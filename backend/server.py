from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import uuid
import time
import base64
import hmac
import hashlib
import secrets
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta
import httpx
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ["OWNER_EMAIL"]
SITE_URL = os.environ.get("SITE_URL", "")

# ---- Auth / JWT ----
JWT_ALGORITHM = "HS256"
BOARD_CATEGORIES = {"local": "Local Communities & Gatherings", "discussion": "Questions & Discussion"}


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(member_id: str, email: str) -> str:
    payload = {"sub": member_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(member_id: str) -> str:
    payload = {"sub": member_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, member_id: str, email: str) -> None:
    response.set_cookie("access_token", create_access_token(member_id, email), httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", create_refresh_token(member_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def member_public(doc: dict) -> dict:
    return {
        "member_id": doc["member_id"],
        "first_name": doc["first_name"],
        "last_name": doc["last_name"],
        "email": doc["email"],
        "location": doc.get("location"),
        "role": doc.get("role", "member"),
        "created_at": doc.get("created_at"),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    member = await db.members.find_one({"member_id": payload["sub"]})
    if not member:
        raise HTTPException(status_code=401, detail="User not found")
    return member_public(member)


# ---- Keyless captcha (signed math challenge) ----
def _sign(data: str) -> str:
    return hmac.new(get_jwt_secret().encode(), data.encode(), hashlib.sha256).hexdigest()


def make_captcha() -> dict:
    a, b = secrets.randbelow(8) + 2, secrets.randbelow(8) + 2
    payload = f"{a + b}.{int(time.time()) + 600}.{secrets.token_hex(4)}"
    token = base64.urlsafe_b64encode(payload.encode()).decode() + "." + _sign(payload)
    return {"captcha_id": token, "question": f"What is {a} + {b}?"}


def verify_captcha(token: str, answer: str) -> bool:
    try:
        raw, sig = token.rsplit(".", 1)
        payload = base64.urlsafe_b64decode(raw.encode()).decode()
    except Exception:
        return False
    if not hmac.compare_digest(sig, _sign(payload)):
        return False
    try:
        total, exp, _nonce = payload.split(".")
    except ValueError:
        return False
    if int(exp) < int(time.time()):
        return False
    return str(answer).strip() == total


# ---- Abuse protection ----
async def check_lockout(identifier: str) -> None:
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("locked_until") and datetime.fromisoformat(rec["locked_until"]) > datetime.now(timezone.utc):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again in about 15 minutes.")


async def record_login_failure(identifier: str) -> None:
    rec = await db.login_attempts.find_one({"identifier": identifier})
    attempts = (rec.get("attempts", 0) if rec else 0) + 1
    update = {"attempts": attempts}
    if attempts >= 5:
        update = {"attempts": 0, "locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)


async def clear_login_failures(identifier: str) -> None:
    await db.login_attempts.delete_one({"identifier": identifier})


async def join_rate_limit(ip: str) -> None:
    key = f"join:{ip}"
    now = datetime.now(timezone.utc)
    rec = await db.login_attempts.find_one({"identifier": key})
    if rec and rec.get("window_start"):
        start = datetime.fromisoformat(rec["window_start"])
        if (now - start).total_seconds() < 3600:
            if rec.get("count", 0) >= 6:
                raise HTTPException(status_code=429, detail="Too many attempts from this network. Please try again later.")
            await db.login_attempts.update_one({"identifier": key}, {"$inc": {"count": 1}})
            return
    await db.login_attempts.update_one({"identifier": key}, {"$set": {"window_start": now.isoformat(), "count": 1}}, upsert=True)

# ---- Email guardrail gate (G2/G3 structural checks) ----
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client_http:
        resp = await client_http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _email_shell(inner: str) -> str:
    site_link = ""
    if SITE_URL:
        site_link = (f'<p style="margin:16px 0 0"><a href="{escape(SITE_URL)}" '
                     f'style="color:#B45309;font-weight:600">Explore upcoming observances</a></p>')
    return ('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
            'style="background:#F6F7FA;padding:24px 0"><tr><td align="center">'
            '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
            'style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:32px;'
            'font-family:Arial,sans-serif;color:#0F172A;font-size:15px;line-height:1.6"><tr><td>'
            f'{inner}'
            f'{site_link}'
            f'<p style="font-size:12px;color:#94A3B8;margin-top:24px;border-top:1px solid #E2E8F0;'
            f'padding-top:16px">Sent by {escape(EMAIL_FROM_NAME)} &middot; Coniuncti ad futurum &middot; '
            f'We never ask for your password or card details by email.</p>'
            '</td></tr></table></td></tr></table>')


class MembershipIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    location: Optional[str] = None
    password: str
    covenant_affirmed: bool
    captcha_id: str = ""
    captcha_answer: str = ""
    website: Optional[str] = ""  # honeypot — real users never fill this


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class PostIn(BaseModel):
    title: str
    category: str
    body: str


class ReplyIn(BaseModel):
    body: str


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    topic: str
    message: str


@api_router.get("/")
async def root():
    return {"message": "United Pluralism API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/membership")
async def register_member(input: MembershipIn, request: Request, response: Response):
    # Honeypot: bots that fill the hidden field get a fake success and nothing is created
    if input.website:
        return {"status": "success", "member_id": str(uuid.uuid4()), "owner_notified": False, "welcome_sent": False, "user": None}
    await join_rate_limit(request.client.host)
    if not verify_captcha(input.captcha_id, input.captcha_answer):
        raise HTTPException(status_code=400, detail="The quick spam-check answer was incorrect. Please try again.")
    if not input.covenant_affirmed:
        raise HTTPException(status_code=400, detail="The United Pluralist Covenant must be affirmed to join.")
    first = input.first_name.strip()
    last = input.last_name.strip()
    if not first or not last:
        raise HTTPException(status_code=400, detail="First and last name are required.")
    if len(input.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    email = str(input.email).lower()
    existing = await db.members.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="This email is already registered. You can sign in to the member community instead.")
    doc = {
        "member_id": str(uuid.uuid4()),
        "first_name": first,
        "last_name": last,
        "email": email,
        "location": (input.location or "").strip() or None,
        "role": "member",
        "password_hash": hash_password(input.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.members.insert_one(doc)

    email_status = {"owner_notified": False, "welcome_sent": False}
    try:
        owner_html = _email_shell(
            f'<h2 style="margin:0 0 12px;font-size:20px;color:#0A192F">New member registration</h2>'
            f'<p style="margin:0 0 6px"><strong>Name:</strong> {escape(first)} {escape(last)}</p>'
            f'<p style="margin:0 0 6px"><strong>Email:</strong> {escape(email)}</p>'
            f'<p style="margin:0"><strong>Location:</strong> {escape(doc["location"] or "Not provided")}</p>')
        await send_email(to=OWNER_EMAIL, subject=f"New United Pluralism member: {first} {last}", html=owner_html)
        email_status["owner_notified"] = True
    except Exception as e:
        logger.error(f"Owner notification failed: {e}")

    try:
        welcome_html = _email_shell(
            f'<h2 style="margin:0 0 12px;font-size:20px;color:#0A192F">Welcome, {escape(first)}.</h2>'
            f'<p style="margin:0 0 12px">Welcome to United Pluralism. Your conscience belongs to you, '
            f'and we are honored to share this community with you.</p>'
            f'<p style="margin:0">We join together not because our beliefs are identical, but because our '
            f'humanity is shared. We will be in touch soon with information about upcoming Gatherings '
            f'and ways to connect.</p>')
        await send_email(to=email, subject="Welcome to United Pluralism", html=welcome_html)
        email_status["welcome_sent"] = True
    except Exception as e:
        logger.error(f"Welcome email failed: {e}")

    set_auth_cookies(response, doc["member_id"], email)
    return {"status": "success", "member_id": doc["member_id"], **email_status, "user": member_public(doc)}


@api_router.post("/contact")
async def submit_contact(input: ContactIn):
    name = input.name.strip()
    message = input.message.strip()
    if not name or not message:
        raise HTTPException(status_code=400, detail="Name and message are required.")
    doc = {
        "enquiry_id": str(uuid.uuid4()),
        "name": name,
        "email": str(input.email),
        "topic": input.topic.strip() or "General inquiry",
        "message": message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.enquiries.insert_one(doc)

    sent = False
    try:
        html = _email_shell(
            f'<h2 style="margin:0 0 12px;font-size:20px;color:#0A192F">New enquiry: {escape(doc["topic"])}</h2>'
            f'<p style="margin:0 0 6px"><strong>From:</strong> {escape(name)} '
            f'(<a href="mailto:{escape(str(input.email))}" style="color:#B45309">{escape(str(input.email))}</a>)</p>'
            f'<p style="margin:16px 0 0;white-space:pre-wrap">{escape(message)}</p>')
        await send_email(to=OWNER_EMAIL, subject=f"[United Pluralism] {doc['topic']} - {name}", html=html)
        sent = True
    except Exception as e:
        logger.error(f"Contact notification failed: {e}")

    return {"status": "success", "enquiry_id": doc["enquiry_id"], "owner_notified": sent}


@api_router.get("/captcha")
async def captcha():
    return make_captcha()


@api_router.post("/auth/login")
async def login(input: LoginIn, request: Request, response: Response):
    email = str(input.email).lower()
    identifier = f"{request.client.host}:{email}"
    await check_lockout(identifier)
    member = await db.members.find_one({"email": email})
    if not member or not member.get("password_hash") or not verify_password(input.password, member["password_hash"]):
        await record_login_failure(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    await clear_login_failures(identifier)
    set_auth_cookies(response, member["member_id"], email)
    return member_public(member)


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "signed_out"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    member = await db.members.find_one({"member_id": payload["sub"]})
    if not member:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie("access_token", create_access_token(member["member_id"], member["email"]),
                        httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    return {"status": "refreshed"}


# ---- Member discussion board ----
def post_public(doc: dict) -> dict:
    return {
        "post_id": doc["post_id"],
        "title": doc["title"],
        "category": doc["category"],
        "category_label": BOARD_CATEGORIES.get(doc["category"], doc["category"]),
        "body": doc["body"],
        "author_name": doc["author_name"],
        "author_location": doc.get("author_location"),
        "reply_count": doc.get("reply_count", 0),
        "created_at": doc["created_at"],
    }


@api_router.get("/posts")
async def list_posts(category: str = "all", user: dict = Depends(get_current_user)):
    query = {} if category == "all" else {"category": category}
    posts = await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(300)
    return [post_public(p) for p in posts]


@api_router.post("/posts")
async def create_post(input: PostIn, user: dict = Depends(get_current_user)):
    title, body = input.title.strip(), input.body.strip()
    if input.category not in BOARD_CATEGORIES:
        raise HTTPException(status_code=400, detail="Unknown category.")
    if not (3 <= len(title) <= 200) or not (3 <= len(body) <= 5000):
        raise HTTPException(status_code=400, detail="A title (3-200 chars) and body (3-5000 chars) are required.")
    doc = {
        "post_id": str(uuid.uuid4()),
        "author_id": user["member_id"],
        "author_name": f"{user['first_name']} {user['last_name'][:1]}.",
        "author_location": user.get("location"),
        "category": input.category,
        "title": title,
        "body": body,
        "reply_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.posts.insert_one(doc)
    return post_public(doc)


@api_router.get("/posts/{post_id}")
async def get_post(post_id: str, user: dict = Depends(get_current_user)):
    post = await db.posts.find_one({"post_id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Discussion not found.")
    replies = await db.replies.find({"post_id": post_id}, {"_id": 0}).sort("created_at", 1).to_list(500)
    return {"post": post_public(post), "replies": replies}


@api_router.post("/posts/{post_id}/replies")
async def create_reply(post_id: str, input: ReplyIn, user: dict = Depends(get_current_user)):
    body = input.body.strip()
    if not (2 <= len(body) <= 3000):
        raise HTTPException(status_code=400, detail="Reply must be between 2 and 3000 characters.")
    post = await db.posts.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Discussion not found.")
    doc = {
        "reply_id": str(uuid.uuid4()),
        "post_id": post_id,
        "author_id": user["member_id"],
        "author_name": f"{user['first_name']} {user['last_name'][:1]}.",
        "body": body,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.replies.insert_one(doc)
    await db.posts.update_one({"post_id": post_id}, {"$inc": {"reply_count": 1}})
    doc.pop("_id", None)
    return doc


@app.on_event("startup")
async def startup():
    await db.members.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.posts.create_index("created_at")
    await db.replies.create_index("post_id")
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.members.find_one({"email": admin_email})
        if existing is None:
            await db.members.insert_one({
                "member_id": str(uuid.uuid4()),
                "first_name": "Community",
                "last_name": "Admin",
                "email": admin_email,
                "location": None,
                "role": "admin",
                "password_hash": hash_password(admin_password),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        elif not existing.get("password_hash") or not verify_password(admin_password, existing["password_hash"]):
            await db.members.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password), "role": "admin"}},
            )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

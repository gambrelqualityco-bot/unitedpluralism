from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import uuid
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import httpx

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
    covenant_affirmed: bool


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
async def register_member(input: MembershipIn):
    if not input.covenant_affirmed:
        raise HTTPException(status_code=400, detail="The United Pluralist Covenant must be affirmed to join.")
    first = input.first_name.strip()
    last = input.last_name.strip()
    if not first or not last:
        raise HTTPException(status_code=400, detail="First and last name are required.")
    doc = {
        "member_id": str(uuid.uuid4()),
        "first_name": first,
        "last_name": last,
        "email": str(input.email),
        "location": (input.location or "").strip() or None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.members.insert_one(doc)

    email_status = {"owner_notified": False, "welcome_sent": False}
    try:
        owner_html = _email_shell(
            f'<h2 style="margin:0 0 12px;font-size:20px;color:#0A192F">New member registration</h2>'
            f'<p style="margin:0 0 6px"><strong>Name:</strong> {escape(first)} {escape(last)}</p>'
            f'<p style="margin:0 0 6px"><strong>Email:</strong> {escape(str(input.email))}</p>'
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
        await send_email(to=str(input.email), subject="Welcome to United Pluralism", html=welcome_html)
        email_status["welcome_sent"] = True
    except Exception as e:
        logger.error(f"Welcome email failed: {e}")

    return {"status": "success", "member_id": doc["member_id"], **email_status}


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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MapPin, MessageSquare, Plus, Users, Sparkles, HelpCircle, Trash2 } from "lucide-react";
import { API, useAuth, formatApiError } from "../context/AuthContext";

const CATEGORIES = [
  { id: "all", label: "All Discussions" },
  { id: "local", label: "Local Communities & Gatherings" },
  { id: "discussion", label: "Questions & Discussion" },
];

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;

const Members = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(null);
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "local", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = user?.role === "admin";

  const load = async (cat) => {
    try {
      const { data } = await axios.get(`${API}/posts`, {
        params: { category: cat },
        withCredentials: true,
      });
      setPosts(data);
    } catch {
      toast.error("Could not load discussions.");
      setPosts([]);
    }
  };

  useEffect(() => {
    setPosts(null);
    load(category);
  }, [category]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/posts`, form, { withCredentials: true });
      toast.success("Your discussion is live.");
      setForm({ title: "", category: "local", body: "" });
      setShowForm(false);
      setCategory("all");
      load("all");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Remove this discussion and all its replies?")) return;
    try {
      await axios.delete(`${API}/posts/${postId}`, { withCredentials: true });
      toast.success("Discussion removed.");
      load(category);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
  };

  return (
    <div data-testid="members-page">
      <section className="relative bg-navy-950 grain overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Member Community</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl tracking-tight text-white" data-testid="members-welcome">
            Welcome, <span className="italic text-gold-light">{user.first_name}.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            This is our shared square. Find members near you and form local communities, organize Gatherings and
            celebrations for your area, or simply ask questions and talk.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              { icon: Users, label: "Form local communities" },
              { icon: Sparkles, label: "Organize celebrations" },
              { icon: HelpCircle, label: "Questions & discussion" },
            ].map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200">
                <c.icon className="h-3.5 w-3.5 text-gold-light" /> {c.label}
              </span>
            ))}
            {isAdmin && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold-light" data-testid="admin-badge">
                Admin
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter discussions">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-testid={`board-filter-${c.id}`}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    category === c.id
                      ? "bg-navy text-white shadow"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-gold hover:text-gold"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              data-testid="new-post-button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" /> Start a Discussion
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={submit}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm"
              data-testid="new-post-form"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  data-testid="new-post-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                  placeholder="Title — e.g. Members in Portland?"
                />
                <select
                  data-testid="new-post-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  <option value="local">Local Communities &amp; Gatherings</option>
                  <option value="discussion">Questions &amp; Discussion</option>
                </select>
              </div>
              <textarea
                required
                rows={4}
                data-testid="new-post-body"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 resize-y"
                placeholder="Share where you are, what you're planning, or what you're wondering&hellip;"
              />
              <button
                type="submit"
                data-testid="new-post-submit"
                disabled={submitting}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Post to the Community
              </button>
            </form>
          )}

          <div className="mt-8 space-y-4" data-testid="posts-list">
            {posts === null ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-gold" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center" data-testid="posts-empty">
                <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-4 font-serif text-xl text-navy">No discussions here yet.</p>
                <p className="mt-1 text-sm text-slate-500">Be the first — introduce yourself and where you live.</p>
              </div>
            ) : (
              posts.map((p) => (
                <Link
                  key={p.post_id}
                  to={`/members/${p.post_id}`}
                  data-testid={`post-card-${p.post_id}`}
                  className="relative block rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5"
                >
                  {isAdmin && (
                    <button
                      type="button"
                      data-testid={`delete-post-${p.post_id}`}
                      onClick={(e) => deletePost(e, p.post_id)}
                      className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Remove discussion ${p.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      p.category === "local" ? "bg-gold-pale text-amber-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.category_label}
                  </span>
                  <h2 className="mt-3 font-serif text-xl font-semibold text-navy pr-10">{p.title}</h2>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{p.body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{p.author_name}</span>
                    {p.author_location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.author_location}
                      </span>
                    )}
                    <span>{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Members;

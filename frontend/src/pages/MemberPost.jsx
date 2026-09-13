import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Loader2, MapPin, Send, Trash2 } from "lucide-react";
import { API, useAuth, formatApiError } from "../context/AuthContext";

const MemberPost = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = user?.role === "admin";

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/posts/${postId}`, { withCredentials: true });
      setData(data);
    } catch {
      toast.error("Could not load this discussion.");
    }
  };

  useEffect(() => {
    load();
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/posts/${postId}/replies`, { body: reply }, { withCredentials: true });
      setReply("");
      load();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReply = async (replyId) => {
    if (!window.confirm("Remove this reply?")) return;
    try {
      await axios.delete(`${API}/replies/${replyId}`, { withCredentials: true });
      toast.success("Reply removed.");
      load();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Remove this discussion and all its replies?")) return;
    try {
      await axios.delete(`${API}/posts/${postId}`, { withCredentials: true });
      toast.success("Discussion removed.");
      navigate("/members");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
  };

  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center" data-testid="post-loading">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const { post, replies } = data;

  return (
    <div className="py-14 lg:py-20" data-testid="member-post-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/members"
            data-testid="back-to-board-link"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the community
          </Link>
          {isAdmin && (
            <button
              type="button"
              data-testid="delete-post-button"
              onClick={deletePost}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove discussion
            </button>
          )}
        </div>

        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 lg:p-10 shadow-sm">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              post.category === "local" ? "bg-gold-pale text-amber-800" : "bg-slate-100 text-slate-600"
            }`}
          >
            {post.category_label}
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-navy" data-testid="post-title">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="font-medium text-slate-600">{post.author_name}</span>
            {post.author_location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {post.author_location}
              </span>
            )}
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
          <p className="mt-6 text-base leading-relaxed text-slate-700 whitespace-pre-wrap" data-testid="post-body">
            {post.body}
          </p>
        </article>

        <h2 className="mt-10 font-serif text-2xl font-semibold text-navy" data-testid="replies-heading">
          Replies ({replies.length})
        </h2>
        <div className="mt-4 space-y-4" data-testid="replies-list">
          {replies.map((r) => (
            <div key={r.reply_id} className="relative rounded-2xl border border-slate-200 bg-white p-5" data-testid={`reply-${r.reply_id}`}>
              {isAdmin && (
                <button
                  type="button"
                  data-testid={`delete-reply-${r.reply_id}`}
                  onClick={() => deleteReply(r.reply_id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remove reply"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{r.author_name}</span>
                <span>{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6" data-testid="reply-form">
          <label htmlFor="reply-body" className="block text-sm font-semibold text-navy">
            Reply as {user.first_name}
          </label>
          <textarea
            id="reply-body"
            required
            rows={3}
            data-testid="reply-input"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 resize-y"
            placeholder="Add to the conversation&hellip;"
          />
          <button
            type="submit"
            data-testid="reply-submit-button"
            disabled={submitting}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberPost;

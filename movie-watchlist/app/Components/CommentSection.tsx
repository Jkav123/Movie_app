"use client";
import { useState, useEffect } from "react";
import { Comment, CreateCommentInput } from "@/lib/types";
import { useSession } from "next-auth/react";

type Props = { imdbId: string };

export default function CommentSection({ imdbId }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments/${imdbId}`)
      .then((r) => r.json())
      .then((data: Comment[]) => {
        setComments(buildThreaded(data));
        setLoading(false);
      });
  }, [imdbId]);

  // Build nested replies from flat array
  const buildThreaded = (flat: Comment[]): Comment[] => {
    const map: Record<number, Comment> = {};
    const roots: Comment[] = [];

    flat.forEach((c) => {
      map[c.id] = { ...c, replies: [] };
    });
    flat.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies!.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const postComment = async (input: CreateCommentInput) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const newComment: Comment = await res.json();
      // Refetch to get correct threaded order
      const res2 = await fetch(`/api/comments/${imdbId}`);
      const data = await res2.json();
      setComments(buildThreaded(data));
      return newComment;
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await postComment({ imdb_id: imdbId, body });
    setBody("");
    setSubmitting(false);
  };

  const handleReply = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !replyTo) return;
    setSubmitting(true);
    await postComment({ imdb_id: imdbId, body: replyBody, parent_id: replyTo });
    setReplyBody("");
    setReplyTo(null);
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      const res2 = await fetch(`/api/comments/${imdbId}`);
      const data = await res2.json();
      setComments(buildThreaded(data));
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div className={`${depth > 0 ? "ml-8 border-l border-gray-700 pl-4" : ""}`}>
      <div className="rounded-xl bg-gray-800 p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full
                            bg-indigo-600 text-xs font-bold text-white"
            >
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-white">
              {comment.author_name}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <div className="flex gap-2">
            {depth === 0 && (
              <button
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
                className="text-xs text-indigo-400 hover:underline"
              >
                {replyTo === comment.id ? "Cancel" : "Reply"}
              </button>
            )}
            {String((session?.user as any)?.id) === String(comment.user_id) && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{comment.body}</p>
      </div>

      {/* Reply form */}
      {replyTo === comment.id && (
        <form onSubmit={handleReply} className="ml-0 mb-3 flex gap-2">
          <input
            autoFocus
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder={`Reply to ${comment.author_name}...`}
            className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white
                       hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Reply
          </button>
        </form>
      )}

      {/* Nested replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  const totalComments = (comments: Comment[]): number =>
    comments.reduce((acc, c) => acc + 1 + totalComments(c.replies ?? []), 0);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-white">
        Comments ({loading ? "..." : totalComments(comments)})
      </h2>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium
                     text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
}

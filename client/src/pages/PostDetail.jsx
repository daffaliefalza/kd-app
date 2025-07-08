import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    const allPosts = await API.get("/posts");
    const found = allPosts.data.posts.find((p) => p._id === id);
    setPost(found);
    setLikes(found.likes?.length || 0);
    setEditForm({ title: found.title, content: found.content });
  };

  const fetchComments = async () => {
    const res = await API.get(`/comments/${id}`);
    setComments(res.data);
  };

  const submitComment = async () => {
    if (!text) return;
    await API.post(`/comments/${id}`, { text });
    setText("");
    fetchComments();
  };

  const submitReply = async (commentId) => {
    const reply = replyText[commentId];
    if (!reply) return;
    await API.post(`/comments/${id}`, {
      text: reply,
      replyTo: commentId,
    });
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    fetchComments();
  };

  const handleEdit = async () => {
    await API.put(`/posts/${id}`, editForm);
    setEditing(false);
    fetchPost();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await API.delete(`/posts/${id}`);
      navigate("/posts");
    }
  };

  const toggleLike = async () => {
    const res = await API.post(`/posts/${id}/like`);
    setLikes(res.data.likes);
  };

  if (!post)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <div className="animate-pulse text-gray-500">Loading post...</div>
      </div>
    );

  const isAuthor = user && post.author.username === user;

  const renderComments = (comments, depth = 0) =>
    comments.map((c) => (
      <div
        key={c._id}
        className={`mt-4 pl-${depth * 4} ${
          depth > 0 ? "border-l-2 border-gray-200 pl-4" : ""
        }`}
      >
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-800">
              {c.author.username}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-700">{c.text}</p>

          {user && (
            <div className="mt-3">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() =>
                  setReplyTo((prev) => (prev === c._id ? null : c._id))
                }
              >
                {replyTo === c._id ? "Cancel" : "Reply"}
              </button>

              {replyTo === c._id && (
                <div className="mt-3">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    rows="2"
                    placeholder="Write your reply..."
                    value={replyText[c._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [c._id]: e.target.value,
                      }))
                    }
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => submitReply(c._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {c.replies && c.replies.length > 0 && (
          <div className="ml-4">{renderComments(c.replies, depth + 1)}</div>
        )}
      </div>
    ));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {editing ? (
          <div className="p-6">
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
            <textarea
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={8}
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {post.title}
            </h1>
            <p className="text-gray-600 mb-6">
              Posted by{" "}
              <span className="font-medium">{post.author.username}</span>
            </p>
            <div className="prose max-w-none text-gray-700 mb-6 whitespace-pre-line">
              {post.content}
            </div>

            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLike}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span>👍</span>
                  <span className="font-medium">{likes} Likes</span>
                </button>
              </div>
              {isAuthor && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Comments ({comments.length})
          </h3>
          {user && (
            <div className="mb-8">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                rows="4"
                placeholder="Share your thoughts..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={submitComment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? (
              renderComments(comments)
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

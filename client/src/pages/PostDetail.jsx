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
    const found = allPosts.data.posts.find((p) => p._id === id); // ← FIXED
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
      navigate("/");
    }
  };

  const toggleLike = async () => {
    const res = await API.post(`/posts/${id}/like`);
    setLikes(res.data.likes);
  };

  if (!post) return <div>Loading...</div>;

  const isAuthor = user && post.author.username === user;

  const renderComments = (comments) =>
    comments.map((c) => (
      <div key={c._id} className="ml-0 border-t pt-2">
        <p>
          <strong>{c.author.username}</strong>: {c.text}
        </p>

        {user && (
          <div className="ml-4 mt-1">
            <button
              className="text-sm text-blue-600"
              onClick={() =>
                setReplyTo((prev) => (prev === c._id ? null : c._id))
              }
            >
              {replyTo === c._id ? "Cancel" : "Reply"}
            </button>

            {replyTo === c._id && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Write a reply..."
                  value={replyText[c._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [c._id]: e.target.value,
                    }))
                  }
                ></textarea>
                <button
                  onClick={() => submitReply(c._id)}
                  className="mt-1 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        )}

        {c.replies && c.replies.length > 0 && (
          <div className="ml-6">{renderComments(c.replies)}</div>
        )}
      </div>
    ));

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {editing ? (
        <div>
          <input
            className="w-full p-2 mb-2 border"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-2 border"
            rows={6}
            value={editForm.content}
            onChange={(e) =>
              setEditForm({ ...editForm, content: e.target.value })
            }
          />
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-gray-600">by {post.author.username}</p>
          <p className="mt-4 whitespace-pre-line">{post.content}</p>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={toggleLike}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded"
            >
              👍 Like ({likes})
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="mt-8">
        <h3 className="text-xl mb-2">Comments</h3>
        {user && (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border"
              rows="3"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              onClick={submitComment}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Comment
            </button>
          </div>
        )}

        <div>{renderComments(comments)}</div>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    const allPosts = await API.get("/posts");
    const found = allPosts.data.find((p) => p._id === id);
    setPost(found);
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

  if (!post) return <div>Loading...</div>;

  const isAuthor = user && post.author.username === user;

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
          {isAuthor && (
            <div className="mt-4 space-x-2">
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
            </div>
          )}
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
        <ul>
          {comments.map((c) => (
            <li key={c._id} className="border-t py-2">
              <strong>{c.author.username}</strong>: {c.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

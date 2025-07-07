import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function PostForm() {
  const [post, setPost] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/posts", post);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">New Post</h2>
      <input
        className="w-full mb-2 p-2 border"
        placeholder="Title"
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      <textarea
        className="w-full mb-2 p-2 border"
        placeholder="Content"
        rows="5"
        onChange={(e) => setPost({ ...post, content: e.target.value })}
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
}

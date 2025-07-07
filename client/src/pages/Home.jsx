import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">All Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow">
            <Link to={`/posts/${post._id}`} className="text-xl font-bold">
              {post.title}
            </Link>
            <p className="text-sm text-gray-600">by {post.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

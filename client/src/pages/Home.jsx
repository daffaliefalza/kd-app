import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (page) => {
    try {
      const res = await API.get(`/posts?page=${page}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="mb-6 border-b pb-4">
            <Link to={`/posts/${post._id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-500">by {post.author.username}</p>
            <p className="mt-2 text-gray-800">
              {post.content.slice(0, 100)}...
            </p>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

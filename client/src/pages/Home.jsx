import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // stores full list for search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, allPosts]);

  useEffect(() => {
    // recalculate paginated result from filtered list
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    setPosts(filtered.slice(start, end));
    setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
  }, [page, filtered]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts?page=1&limit=1000"); // large limit to load all for search
      setAllPosts(res.data.posts);
      setSearch(""); // default search empty
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleSearch = (term) => {
    const lower = term.toLowerCase();
    const filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(lower)
    );
    setFiltered(filteredPosts);
    setPage(1);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="w-full p-2 border rounded"
        />
      </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
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
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

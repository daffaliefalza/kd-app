import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Post() {
  const { user } = useAuth(); // Get user authentication status
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
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
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    setPosts(filtered.slice(start, end));
    setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
  }, [page, filtered]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts?page=1&limit=1000");
      setAllPosts(res.data.posts);
      setSearch("");
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
        {user && ( // Only show this button if user is logged in
          <Link
            to="/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create New Post
          </Link>
        )}
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <Link to={`/posts/${post._id}`}>
                  <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500 mb-4">
                  Posted by{" "}
                  <span className="font-medium">{post.author.username}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  {post.content.slice(0, 150)}...
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

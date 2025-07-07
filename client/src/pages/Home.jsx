import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const res = await API.get("/posts?limit=3");
        setFeaturedPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Kada Blog 😁
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A platform where you can share your thoughts, ideas, and connect
            with fellow learners. All About Korean Asean Digital Academy
            Program!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Get Started
            </Link>
            <Link
              to="/posts"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium"
            >
              Browse Posts
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Posts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest posts from our community members
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-80 h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <Link to={`/posts/${post._id}`}>
                    <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-4">
                    By{" "}
                    <span className="font-medium">{post.author.username}</span>
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center"
                  >
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to share your thoughts?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community and start creating your own posts today
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Join Our Blog?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Posts</h3>
              <p className="text-gray-600">
                Share your knowledge, experiences, and ideas with the community
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Engage in Discussions
              </h3>
              <p className="text-gray-600">
                Comment on posts and reply to others to join the conversation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Show Appreciation</h3>
              <p className="text-gray-600">
                Like posts to show your support for content you enjoy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

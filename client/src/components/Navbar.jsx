import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-100 transition-colors"
        >
          KadaBlog
        </Link>

        <div className="space-x-4 flex items-center">
          <Link
            to="/posts"
            className="font-bold hover:text-blue-100 transition-colors"
          >
            All Posts
          </Link>
          {user && (
            <span className="font-semibold mr-2 hidden sm:inline-block">
              Hello {typeof user === "string" ? user : user.username}👋
            </span>
          )}

          {user ? (
            <>
              <Link
                to="/new"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                New Post
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 hover:bg-blue-500 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

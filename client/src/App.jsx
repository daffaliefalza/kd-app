import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PostForm from "./pages/PostForm";
import PostDetail from "./pages/PostDetail";
import { AuthProvider } from "./AuthContext";
import Post from "./pages/Post";
import Footer from "./components/Footer";
import LoginSuccess from "./pages/LoginSuccess";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Post />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login/success" element={<LoginSuccess />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

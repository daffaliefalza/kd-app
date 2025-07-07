import express from "express";
import Post from "../models/Post.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Post.countDocuments();

  res.json({
    posts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
});

router.post("/", authenticateToken, async (req, res) => {
  const post = await Post.create({
    ...req.body,
    author: req.user.id,
  });
  res.json(post);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id)
    return res.sendStatus(403);
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id)
    return res.sendStatus(403);
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Like or Unlike a post
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId); // like
    } else {
      post.likes.splice(index, 1); // unlike
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
});

export default router;

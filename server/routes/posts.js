import express from "express";
import Post from "../models/Post.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.json(posts);
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

export default router;

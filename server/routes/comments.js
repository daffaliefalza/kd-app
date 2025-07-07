import express from "express";
import Comment from "../models/Comment.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all comments with nested replies for a post
router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "username")
    .lean(); // plain JS objects for easier nesting

  const map = {};
  const roots = [];

  comments.forEach((c) => {
    c.replies = [];
    map[c._id] = c;
  });

  comments.forEach((c) => {
    if (c.replyTo) {
      map[c.replyTo]?.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  res.json(roots);
});

// Create a comment or a reply
router.post("/:postId", authenticateToken, async (req, res) => {
  const { text, replyTo } = req.body;

  const comment = await Comment.create({
    text,
    author: req.user.id,
    post: req.params.postId,
    replyTo: replyTo || null,
  });

  res.json(comment);
});

export default router;

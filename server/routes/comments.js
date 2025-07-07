import express from "express";
import Comment from "../models/Comment.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate(
    "author",
    "username"
  );
  res.json(comments);
});

router.post("/:postId", authenticateToken, async (req, res) => {
  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user.id,
    text: req.body.text,
  });
  res.json(comment);
});

export default router;

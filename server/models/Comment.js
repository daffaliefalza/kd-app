import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);

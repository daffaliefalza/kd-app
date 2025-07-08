import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: false, // ✅ Password is optional (especially for OAuth)
  },
  googleId: { type: String, unique: true, sparse: true },
});

export default mongoose.model("User", userSchema);

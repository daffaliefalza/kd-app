import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // import this file once

dotenv.config();
const app = express();

app.use(cors());

app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: false })
);
app.use(passport.session());
app.use(passport.initialize());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("database connected", process.env.PORT)
    )
  )
  .catch((err) => console.log(err));

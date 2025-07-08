// server/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// const googleOption = {
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: "http://localhost:3005/auth/login/google/callback",
//   scope: ["profile", "email"], // Add this line
// };

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      scope: ["profile", "email"], // Add this line
    },
    async function (accessToken, refreshToken, profile, done) {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) return done(null, existingUser);

      // Create a new user if not found
      const newUser = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      done(null, newUser);
    }
  )
);

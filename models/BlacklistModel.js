import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" }, // Optional: set token expiration after 1 hour
});

const BlacklistModel = mongoose.model("Blacklist", BlacklistSchema);
export default BlacklistModel;

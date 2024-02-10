import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeable_id: { type: mongoose.Schema.Types.ObjectId, ref: "Groupe" },
  likeable_type: String,
  is_like: Boolean,
  description: String,
  created_at: { type: Date, default: Date.now },
});

const Like = mongoose.model("Like", likeSchema);

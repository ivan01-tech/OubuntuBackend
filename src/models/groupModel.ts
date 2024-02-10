import mongoose from "mongoose";

const groupeSchema = new mongoose.Schema({
  offre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Offre" },
  quantiy_product: Number,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  link: String,
  expired_at: Date,
});

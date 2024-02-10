import mongoose from "mongoose";

const priceIntervaleSchema = new mongoose.Schema({
  unity: String,
  price: Number,
  quantiy: Number,
  purchase_by_one_person: { type: Boolean, default: true },
});


const PriceIntervale = mongoose.model("PriceIntervale", priceIntervaleSchema);

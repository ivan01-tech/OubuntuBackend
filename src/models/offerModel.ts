import mongoose, { InferSchemaType } from "mongoose";

const OfferSchema = new mongoose.Schema({
  product_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  author_id: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now },
});

const Offer = mongoose.model("Offer", OfferSchema);

export type OfferType = InferSchemaType<typeof OfferSchema>;
export default Offer;

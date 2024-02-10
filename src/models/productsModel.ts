import mongoose, { InferSchemaType } from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  images: [String],
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
});

export type ProductType = InferSchemaType<typeof productSchema>;
const Product = mongoose.model("Product", productSchema);
export default Product;

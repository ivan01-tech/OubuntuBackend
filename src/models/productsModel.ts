import mongoose, { InferSchemaType } from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value > 0,
      message: 'The price should be greater than zero',
    },
  },
  discount_price: { type: String, default: 0 },
  images: [String],
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  created_at: { type: Date, default: Date.now },
});

export type ProductType = InferSchemaType<typeof productSchema>;
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

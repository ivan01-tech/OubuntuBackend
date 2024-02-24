import mongoose, { Document, Schema } from 'mongoose';

interface Category extends Document {
  name: string;
  image: string;
}

const categorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;

/* eslint-disable operator-linebreak */
import mongoose, { InferSchemaType } from 'mongoose';

const productQuantityGroupeSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantiy: { type: Number, default: 0, required: true },
  reserved_at: {
    type: Date,
    default: Date.now(),
  },
});

export type ProductQuantityGroupeTypes = InferSchemaType<typeof productQuantityGroupeSchema>;
const ProductQuantityGroupe =
  mongoose.models.ProductQuantityGroupe ||
  mongoose.model<ProductQuantityGroupeTypes>('ProductQuantityGroupe', productQuantityGroupeSchema);
export default ProductQuantityGroupe;

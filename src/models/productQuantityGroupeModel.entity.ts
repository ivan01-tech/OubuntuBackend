import mongoose, { InferSchemaType } from 'mongoose';

const productQuantityGroupeSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantiy: Number,
  reserved_at: {
    type: Date,
    default: Date.now(),
  },
});

export type ProductQuantityGroupeTypes = InferSchemaType<typeof productQuantityGroupeSchema>;
const ProductQuantityGroupe = mongoose.model<ProductQuantityGroupeTypes>('User', productQuantityGroupeSchema);
export default ProductQuantityGroupe;

import mongoose, { InferSchemaType } from 'mongoose';

const likeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likeable_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  likeable_type: String,
  is_like: Boolean,
  description: String,
  created_at: { type: Date, default: Date.now },
});

export type LikeType = InferSchemaType<typeof likeSchema>;
const Like = mongoose.model<LikeType>('User', likeSchema);
export default Like;

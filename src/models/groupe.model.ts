import dotenv from 'dotenv';
import mongoose, { InferSchemaType } from 'mongoose';

dotenv.config();

const groupeSchema = new mongoose.Schema({
  offer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  quantiy_product: { type: Number, default: 0 },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  link: { type: String },
  expired_at: { type: Date, default: Date.now() },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const OUBUNTU_BACKEND_URI = process.env.OUBUNTU_BACKEND_URI as string;

// eslint-disable-next-line func-names
groupeSchema.pre('save', async function (next) {
  if (!this.isModified('link')) {
    const link = `${OUBUNTU_BACKEND_URI}/${this._id}/users`;
    this.link = link;
  }
  next();
});

const Group = mongoose.model('Group', groupeSchema);

export type OfferType = InferSchemaType<typeof groupeSchema>;
export default Group;

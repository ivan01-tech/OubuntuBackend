import dotenv from 'dotenv';
import mongoose, { InferSchemaType } from 'mongoose';

import GroupeMember from './groupMenber.entity.js';
import ProductQuantityGroupe from './productQuantityGroupeModel.entity.js';

dotenv.config();

const groupeSchema = new mongoose.Schema({
  offer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  quantiy_product: { type: Number, default: 0 },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  link: { type: String },
  expired_at: { type: Date, default: Date.now() },
});

const OUBUNTU_BACKEND_URI_GRP = `${process.env.OUBUNTU_BACKEND_URI as string}/groups`;

// Middleware pour intercepter la sauvegarde du groupe
groupeSchema.pre('save', async function (next) {
  if (!this.isModified('link')) {
    const link = `${OUBUNTU_BACKEND_URI_GRP}/${this._id}/groupMenbers`;
    this.link = link;
  }

  // Créer automatiquement un membre associé à ce groupe avec l'ID de l'auteur
  const member = new GroupeMember({
    group_id: this._id,
    user_id: this.author_id,
  });

  // Créer automatiquement un membre associé à ce groupe avec l'ID de l'auteur
  const quantiy = new ProductQuantityGroupe({
    group_id: this._id,
    user_id: this.author_id,
    quantiy: 0,
  });

  try {
    await member.save();
    await quantiy.save();
    next();
  } catch (error) {
    next(error);
  }
});
const Group = mongoose.models.Group || mongoose.model('Group', groupeSchema);

export type OfferType = InferSchemaType<typeof groupeSchema>;
export default Group;

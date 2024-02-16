import mongoose, { InferSchemaType } from 'mongoose';

import ProductQuantityGroupe from './productQuantityGroupeModel.entity.js';

const groupeMemberSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
});

// Middleware pre-save pour groupeSchema
groupeMemberSchema.pre('save', async function (next) {
  try {
    // Vérifiez si l'utilisateur a déjà rejoint le groupe
    const existingProductQuantity = await ProductQuantityGroupe.findOne({
      group_id: this._id,
      user_id: this.user_id,
    });

    // Si l'utilisateur n'a pas encore rejoint, créez et enregistrez un nouvel objet
    if (!existingProductQuantity) {
      await ProductQuantityGroupe.create({
        group_id: this._id,
        user_id: this.user_id,
        quantiy: 0,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

export type UserTypes = InferSchemaType<typeof groupeMemberSchema>;
const GroupeMember = mongoose.model<UserTypes>('GroupeMenber', groupeMemberSchema);
export default GroupeMember;

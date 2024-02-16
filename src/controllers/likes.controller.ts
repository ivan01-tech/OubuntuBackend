/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import { isValidObjectId } from 'mongoose';
import { Request, Response } from 'express';
import Like from 'src/models/like.entity.js';
import { isValidId } from 'src/utils/mongoose.js';

class LikeController {
  // Créer un like
  static async createLike(req: Request, res: Response) {
    const { user_id, likeable_id, likeable_type, is_like, description } = req.body;
    // Vérifier la validité des ObjectIds
    if (!isValidId(user_id) || !isValidId(likeable_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId' });
    }

    // Vérifier la présence des propriétés nécessaires
    if (!user_id || !likeable_id || !likeable_type || is_like === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid properties in req.body' });
    }

    // Vérifier les types des propriétés
    if (typeof is_like !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'Invalid property types in req.body' });
    }

    const like = new Like({
      user_id,
      likeable_id,
      likeable_type,
      is_like,
      description,
    });

    const savedLike = await like.save();
    res.status(201).json({ status: 'success', data: savedLike });
  }

  // Obtenir tous les likes
  static async getAllLikes(req: Request, res: Response) {
    const likes = await Like.find();
    res.status(200).json({ status: 'success', data: likes });
  }

  // Obtenir les likes d'un utilisateur spécifique
  static async getUserLikes(req: Request, res: Response) {
    const { user_id } = req.params;
    const userLikes = await Like.find({ user_id });
    res.status(200).json({ status: 'success', data: userLikes });
  }

  // Supprimer un like
  static async deleteLike(req: Request, res: Response) {
    const { likeId } = req.params;

    // Vérifier la validité de l'ObjectId
    if (!isValidObjectId(likeId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId' });
    }

    const deletedLike = await Like.findByIdAndDelete(likeId);
    if (!deletedLike) {
      return res.status(404).json({ status: 'error', message: 'Like not found' });
    }

    res.status(200).json({ status: 'success', message: 'Like deleted successfully' });
  }
}

export default LikeController;

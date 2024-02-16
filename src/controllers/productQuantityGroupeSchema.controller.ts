import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isValidId } from 'src/utils/mongoose.js';

import ProductQuantityGroupe from '../models/productQuantityGroupeModel.entity.js';

export class ProductQuantityGroupeController {
  /**
   * Crée un nouvel objet ProductQuantityGroupe
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async createProductQuantityGroupe(req: Request, res: Response) {
    try {
      // Vérifie si group_id et user_id sont des ObjectIds valides
      if (!mongoose.isValidObjectId(req.body.group_id) || !mongoose.isValidObjectId(req.body.user_id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
      }

      // Crée un nouvel objet ProductQuantityGroupe
      const newProductQuantityGroupe = await ProductQuantityGroupe.create(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'ProductQuantityGroupe created successfully.',
        data: newProductQuantityGroupe,
      });
    } catch (error) {
      console.error('Error creating ProductQuantityGroupe:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error.' });
    }
  }

  /**
   * Récupère tous les objets ProductQuantityGroupe
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async getAllProductQuantityGroupes(req: Request, res: Response) {
    // Récupère tous les objets ProductQuantityGroupe
    const productQuantityGroupes = await ProductQuantityGroupe.find()
      .populate([{ path: 'user_id', select: '-password' }, { path: 'group_id' }])
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupes retrieved successfully.',
      data: productQuantityGroupes,
    });
  }

  /**
   * Récupère tous les objets ProductQuantityGroupe par id du grp
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async getAllProductQuantityGroupesByGroupId(req: Request, res: Response) {
    const { groupId } = req.params;
    // Vérifie si group_id et user_id sont des ObjectIds valides
    if (!isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
    }
    // Récupère tous les objets ProductQuantityGroupe
    const productQuantityGroupes = await ProductQuantityGroupe.find({ group_id: groupId })
      .populate([{ path: 'user_id', select: '-password' }])
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupes retrieved successfully.',
      data: productQuantityGroupes,
    });
  }

  /**
   * Récupère un objet ProductQuantityGroupe par ID
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async getProductQuantityGroupeById(req: Request, res: Response) {
    // Vérifie si l'id est un ObjectId valide
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
    }

    // Récupère un objet ProductQuantityGroupe par ID
    const productQuantityGroupe = await ProductQuantityGroupe.findById(req.params.id);

    // Vérifie si l'objet existe
    if (!productQuantityGroupe) {
      return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupe retrieved successfully.',
      data: productQuantityGroupe,
    });
  }

  /**
   * Met à jour la quantité d'un objet ProductQuantityGroupe par ID.
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async updateProductQuantityGroupe(req: Request, res: Response) {
    try {
      // Vérifie si l'id est un ObjectId valide
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
      }

      // Vérifie la validité de la quantité fournie
      if (typeof req.body.quantity !== 'number' || req.body.quantity < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid quantity format or value.' });
      }

      // Récupère un objet ProductQuantityGroupe par ID
      const productQuantityGroupe = await ProductQuantityGroupe.findById(req.params.id);

      // Vérifie si l'objet existe
      if (!productQuantityGroupe) {
        return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found.' });
      }

      // Met à jour la quantité de l'objet ProductQuantityGroupe
      const updatedProductQuantityGroupe = await ProductQuantityGroupe.findByIdAndUpdate(
        req.params.id,
        { quantity: req.body.quantity }, // Mettez à jour la propriété de quantité ici
        { new: true },
      );

      return res.status(200).json({
        status: 'success',
        message: 'ProductQuantityGroupe quantity updated successfully.',
        data: updatedProductQuantityGroupe,
      });
    } catch (error) {
      console.error('Error updating ProductQuantityGroupe quantity:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error.' });
    }
  }

  /**
   * Supprime un objet ProductQuantityGroupe par ID
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async deleteProductQuantityGroupe(req: Request, res: Response) {
    // Vérifie si l'id est un ObjectId valide
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
    }

    // Récupère un objet ProductQuantityGroupe par ID
    const productQuantityGroupe = await ProductQuantityGroupe.findById(req.params.id);

    // Vérifie si l'objet existe
    if (!productQuantityGroupe) {
      return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found.' });
    }

    // Supprime l'objet ProductQuantityGroupe
    await ProductQuantityGroupe.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupe deleted successfully.',
    });
  }
}

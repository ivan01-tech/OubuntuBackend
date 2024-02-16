/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import ProductQuantityGroupe from '../models/productQuantityGroupeModel.entity.js';
import { isValidId } from '../utils/mongoose.js';

export class ProductQuantityGroupeController {
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
    if (!isValidId(req.params.id)) {
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
    // Vérifie si l'id est un ObjectId valide
    if (!isValidId(req.params.id)) {
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
      { new: true }
    );

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupe quantity updated successfully.',
      data: updatedProductQuantityGroupe,
    });
  }

  /**
   * Met à jour la quantité d'un objet ProductQuantityGroupe par ID.
   * @param req Requête Express
   * @param res Réponse Express
   */
  static async updateProductQuantityGroupeByUserId(req: Request, res: Response) {
    const { userId, quantity } = req.body;
    const { groupId } = req.params;

    console.log('Received request with userId:', userId, 'groupId:', groupId, 'quantity:', quantity);

    // Vérifie si l'id est un ObjectId valide
    if (!isValidId(userId) || !isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId format.' });
    }

    // Vérifie la validité de la quantité fournie
    if (typeof req.body.quantity !== 'number' || req.body.quantity < 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid quantity format or value.' });
    }

    // Récupère un objet ProductQuantityGroupe par ID
    const productQuantityGroupe = await ProductQuantityGroupe.findOne({ user_id: userId, group_id: groupId });

    // Vérifie si l'objet existe
    if (!productQuantityGroupe) {
      return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found.' });
    }

    // Met à jour la quantité dans l'objet
    productQuantityGroupe.quantity = quantity;

    console.log('Updated product quantity in object:', productQuantityGroupe.quantity);

    // Sauvegarde les modifications dans la base de données
    const updatedProductQuantityGroupe = await productQuantityGroupe.save();

    console.log('product quantity after save:', updatedProductQuantityGroupe.quantity);

    return res.status(200).json({
      status: 'success',
      message: 'ProductQuantityGroupe quantity updated successfully.',
      data: updatedProductQuantityGroupe,
    });
  }

  /**
   * Créer une quantité de produit pour un groupe
   * Crée un nouvel objet ProductQuantityGroupe
   * @param req Requête Express
   * @param res Réponse Express
   */

  static async createProductQuantityGroupe(req: Request, res: Response) {
    const { group_id, user_id, quantity } = req.body;

    // Vérifier la validité des ObjectIds
    if (!isValidId(group_id) || !isValidId(user_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId' });
    }

    // Vérifier la présence des propriétés nécessaires
    if (!group_id || !user_id || quantity === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing or invalid properties in req.body' });
    }

    // Vérifier les types des propriétés
    if (typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', message: 'Invalid property types in req.body' });
    }

    const productQuantityGroupe = new ProductQuantityGroupe({
      group_id,
      user_id,
      quantity,
    });
    const savedProductQuantityGroupe = await productQuantityGroupe.save();
    res.status(201).json({ status: 'success', data: savedProductQuantityGroupe });
  }

  // Supprimer une quantité de produit pour un groupe
  /**
   * Supprime un objet ProductQuantityGroupe par ID
   * @param req Requête Express
   * @param res Réponse Express
   */

  static async deleteProductQuantityGroupe(req: Request, res: Response) {
    const { productQuantityGroupeId } = req.params;

    // Vérifier la validité de l'ObjectId
    if (!isValidId(productQuantityGroupeId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId' });
    }

    const deletedProductQuantityGroupe = await ProductQuantityGroupe.findByIdAndDelete(productQuantityGroupeId);
    if (!deletedProductQuantityGroupe) {
      return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found' });
    }

    res.status(200).json({ status: 'success', message: 'ProductQuantityGroupe deleted successfully' });
  }
}

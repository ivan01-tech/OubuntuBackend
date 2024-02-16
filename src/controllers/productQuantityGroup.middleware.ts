/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import ProductQuantityGroupe from 'src/models/productQuantityGroupeModel.entity.js';

const isValidObjectId = mongoose.Types.ObjectId.isValid;

class ProductQuantityGroupeController {
  // Créer une quantité de produit pour un groupe
  static async createProductQuantityGroupe(req: Request, res: Response) {
    const { group_id, user_id, quantity } = req.body;

    // Vérifier la validité des ObjectIds
    if (!isValidObjectId(group_id) || !isValidObjectId(user_id)) {
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
  static async deleteProductQuantityGroupe(req: Request, res: Response) {
    const { productQuantityGroupeId } = req.params;

    // Vérifier la validité de l'ObjectId
    if (!isValidObjectId(productQuantityGroupeId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ObjectId' });
    }

    const deletedProductQuantityGroupe = await ProductQuantityGroupe.findByIdAndDelete(productQuantityGroupeId);
    if (!deletedProductQuantityGroupe) {
      return res.status(404).json({ status: 'error', message: 'ProductQuantityGroupe not found' });
    }

    res.status(200).json({ status: 'success', message: 'ProductQuantityGroupe deleted successfully' });
  }
}

export default ProductQuantityGroupeController;

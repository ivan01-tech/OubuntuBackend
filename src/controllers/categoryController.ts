/* eslint-disable consistent-return */
import { Request, Response } from 'express';

import CategoryModel from '../models/productsCategories.js';
import { isValidId } from '../utils/mongoose.js';

export class CategoryController {
  static createCategory = async (req: Request, res: Response) => {
    const { name, image } = req.body;

    // Vérifier la présence des données nécessaires
    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    // Vérifier le type des données (vous pouvez ajouter d'autres vérifications si nécessaire)
    if (typeof name !== 'string' || typeof image !== 'string') {
      return res.status(400).json({ error: 'Invalid data types' });
    }

    // Créer une nouvelle catégorie
    const newCategory = new CategoryModel({ name, image });

    // Sauvegarder la nouvelle catégorie
    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  };

  static getAllCategories = async (req: Request, res: Response) => {
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  };

  static getCategoryById = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = await CategoryModel.findById(categoryId);

    // Vérifier la valcategoryIdité de l'ID (si nécessaire)
    if (!isValidId(categoryId)) {
      return res.status(400).json({ error: 'InvalcategoryId category ID' });
    }

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(category);
  };

  static updateCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name, image } = req.body;

    // Vérifier la présence des données nécessaires
    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    // Vérifier le type des données (vous pouvez ajouter d'autres vérifications si nécessaire)
    if (typeof name !== 'string' || typeof image !== 'string') {
      return res.status(400).json({ error: 'Invalid data types' });
    }

    // Vérifier la valcategoryIdité de l'ID (si nécessaire)
    if (!isValidId(categoryId)) {
      return res.status(400).json({ error: 'InvalcategoryId category ID' });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, { name, image }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json(updatedCategory);
  };

  static deleteCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    // Vérifier la valcategoryIdité de l'ID (si nécessaire)
    if (!isValidId(categoryId)) {
      return res.status(400).json({ error: 'InvalcategoryId category ID' });
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  };
}

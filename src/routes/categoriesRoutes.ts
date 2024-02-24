import express from 'express';

import { CategoryController } from '../controllers/categoryController.js';

const categoriesRoutes = express.Router();

categoriesRoutes
  .post('/', CategoryController.createCategory)
  .get('/', CategoryController.getAllCategories)
  .get('/:productId', CategoryController.getCategoryById)
  .put('/:productId', CategoryController.updateCategory)
  .delete('/:productId', CategoryController.deleteCategory);

export default categoriesRoutes;

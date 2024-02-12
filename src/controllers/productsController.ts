import { Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';

import Product from '../models/productsModel.js';
import { MyCustomError } from '../utils/CustomError.js';

export default class ProductController {
  /**
   * @desc create a new product
   * @route POST /products
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  // eslint-disable-next-line consistent-return
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, images } = req.body;

      if (!name || !images) {
        return res.status(400).json({
          status: 'error',
          message: 'Error while creating a product : wrong credentials !',
        });
      }

      const adminId = req.session.userId;

      const product = await Product.create({
        created_by: adminId,
        name,
        images,
      });

      if (product) {
        return res.status(201).json({
          message: 'Successfully created product',
          status: 'success',
          data: product,
        });
      }
      return res.status(400).json({ message: 'Invalid product data received !' });
    } catch (error) {
      // Vérifiez si l'erreur est une erreur de validation de Mongoose
      if (error instanceof Error.ValidationError) {
        const validationErrors: { [key: string]: string } = {};

        // Itérer sur les erreurs de validation et les stocker dans un objet
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = (error as Error.ValidationError).errors[key].message;
        });

        res.status(400).json({ errors: validationErrors });
      } else if (error instanceof MyCustomError) {
        return res.status(500).json({ status: 'error', message: error.message });
      } else {
        console.log('error : ', error);
        // Si ce n'est pas une erreur de validation, renvoyez une réponse d'erreur générique
        return res.status(500).json({
          status: 'error',
          message: 'Erreur lors de la création de l\'utilisateur.',
        });
      }
    }
  }

  /**
   * @desc get all products
   * @route GET /product
   * @access public
   * @param req
   * @param res
   * @returns
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const products = await Product.find({}).populate('created_by', '-password').lean().exec();

      if (!products.length) return res.status(404).json({ status: 'error', message: 'No products found !' });

      return res.json({ status: 'success', data: products });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({ status: 'error', message: 'Somethinfg went wrong !' });
    }
  }

  /**
   * @desc delete a single product
   * @route GET /users/
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.body;

      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID.' });
      }

      const product = await Product.findById(productId);

      if (!product) return res.status(404).json({ status: 'error', message: 'No product found !' });
      // TODO
      const deleteP = await product.deleteOne();
      return res.json({ status: 'success', message: 'Successfully Deleted !' });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({ status: 'error', message: 'Somethinfg went wrong !' });
    }
  }
}

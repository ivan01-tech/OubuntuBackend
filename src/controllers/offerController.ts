/* eslint-disable camelcase */
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { findDocumentById } from '../utils/findDocById.js';
import Product from '../models/productsModel.js';
import Offer from '../models/offerModel.js';

export default class OfferController {
  static async createOffer(req: Request, res: Response) {
    const { product_id, description } = req.body;

    let author_id: string;

    if (req.isAuthenticated()) {
      author_id = req.user.id;
    } else {
      author_id = req.session.userId;
    }

    if (!description || !product_id) {
      return res.status(400).json({ status: 'error', message: 'All fields must be set' });
    }

    if (!mongoose.isValidObjectId(product_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid product ID.' });
    }

    const product = await findDocumentById<any>(Product, product_id);
    console.log('first product : ', product);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'product not found' });
    }

    const offer = await Offer.create({ product_id, author_id, description });

    if (offer) {
      return res.status(201).send({
        status: 'Success',
        data: offer,
      });
    }
    return res.status(400).json({ status: 'error', message: 'Invalid offer data received !' });
  }

  /**
   * @desc get all offer
   * @route GET /offers
   * @access public
   * @param req
   * @param res
   * @returns
   */
  static async getAllOffOffers(req: Request, res: Response) {
    console.log('session : ', req.session, req.sessionID);
    const Offers = await Offer.find({})
      .populate([{ path: 'author_id', select: '-password' }, { path: 'product_id' }])
      .lean()
      .exec();

    if (!Offers.length) return res.status(404).json({ status: 'error', message: 'No Offers found !' });

    return res.json({ status: 'success', data: Offers });
  }

  /**
   * @desc delete a single offer
   * @route DELETE /offer/
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  static async deleteOffer(req: Request, res: Response) {
    const { offerId } = req.params;

    if (!mongoose.isValidObjectId(offerId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid offer ID.' });
    }
    const offer = await Offer.findById(offerId);

    if (!offer) return res.status(404).json({ status: 'error', message: 'No offers found !' });
    // TODO
    const p = await offer.deleteOne();

    return res.json({ status: 'success', message: 'Successfully Deleted !', data: p });
  }
}

/* eslint-disable consistent-return */
/* eslint-disable camelcase */

import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { isValidId } from '../utils/mongoose.js';
import Group from '../models/groupe.model.js';
import Offer from '../models/offerModel.js';

export class GroupController {
  /**
   * @desc create a new group
   * @route POST /groups
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async createGroup(req: Request, res: Response) {
    const { offer_id } = req.body;
    let author_id: string;

    if (req.isAuthenticated()) {
      author_id = req.user.id;
    } else {
      author_id = req.session.userId;
    }

    console.log('author_id : ', author_id);

    if (!isValidId(offer_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID.' });
    }

    const offer = await Offer.findById(offer_id);

    if (!offer) {
      return res.status(404).json({
        status: 'error',
        message: `Offer with ${offer} not found !`,
      });
    }

    const group = await Group.create({ offer_id, author_id });

    if (!group) {
      return res.status(400).json({ message: 'Invalid group data !' });
    }

    return res.status(201).send({
      status: 'Success',
      message: 'Group successfully created !',
      data: group,
    });
  }

  /**
   * @desc Met à jour un groupe
   * @route PUT /groups/:groupId
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async updateGroup(req: Request, res: Response) {
    const { groupId } = req.params;
    const { offer_id } = req.body;

    let author_id: string;

    if (req.isAuthenticated()) {
      author_id = req.user.id;
    } else {
      author_id = req.session.userId;
    }

    if (!isValidId(groupId) || !isValidId(offer_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group or offer ID.' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    // Mise à jour des champs nécessaires
    group.offer_id = offer_id;

    const updatedGroup = await group.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Group Successfully Updated!',
      data: updatedGroup,
    });
  }

  /**
   * @desc Supprime un groupe
   * @route DELETE /groups/:groupId
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async deleteGroup(req: Request, res: Response) {
    const { groupId } = req.params;

    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID.' });
    }

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Group Successfully Deleted!',
      data: deletedGroup,
    });
  }

  /**
   * @desc Récupère un groupe
   * @route GET /groups/:groupId
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async getGroup(req: Request, res: Response) {
    const { groupId } = req.params;

    if (!isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID.' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    // Vérification de la validité du groupe en fonction de expired_at
    const now = Date.now();
    if (group.expired_at && group.expired_at.getTime() <= now) {
      return res.status(403).json({ status: 'error', message: 'Group link has expired.' });
    }

    return res.status(200).json({
      status: 'Success',
      data: group,
    });
  }

  /**
   * @desc Récupère tous les groupes
   * @route GET /groups/
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async getAllGroups(req: Request, res: Response) {
    const group = await Group.find()

      .populate([{ path: 'author_id', select: '-password' }, { path: 'offer_id' }])
      .lean()
      .exec();

    if (!group.length) {
      return res.status(404).json({ status: 'error', message: 'Groups not found.' });
    }

    return res.status(200).json({
      status: 'Success',
      data: group,
    });
  }

  /**
   * @desc add new user to the group
   * @route GET /groups/:groupId/users
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async addUser(req: Request, res: Response) {
    const { groupId } = req.params;

    if (isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID.' });
    }

    const offer = await Group.findById(groupId);

    if (!offer) {
      return res.status(404).json({
        status: 'error',
        message: `Group with ${groupId} id not found !`,
      });
    }
    const userIdString = req.session.userId;

    const userIdObjectId = new mongoose.Types.ObjectId(userIdString);
    offer.users = [...offer.users, userIdObjectId];

    // Vérification de la validité du groupe en fonction de expired_at
    const now = Date.now();
    if (offer.expired_at && offer.expired_at.getTime() <= now) {
      return res.status(403).json({ status: 'error', message: 'Group link has expired.' });
    }

    const updateGroup = await offer.save();

    if (!updateGroup) {
      return res.status(400).json({ message: 'Invalid group data !' });
    }

    return res.status(201).send({
      status: 'Success',
      message: 'User Successfully Added !',
      data: updateGroup,
    });
  }

  /**
   * @desc Supprime un utilisateur du groupe
   * @route DELETE /groups/:groupId/users/:userId
   * @access private
   * @param req
   * @param res
   * @returns
   */
  static async removeUser(req: Request, res: Response) {
    const { groupId, userId } = req.params;

    if (!isValidId(groupId) || isValidId(userId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group or user ID.' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    // Supprimer l'utilisateur du tableau des utilisateurs du groupe
    group.users = group.users.filter((user) => !user.equals(userIdObjectId));

    const updatedGroup = await group.save();

    return res.status(200).json({
      status: 'Success',
      message: 'User Successfully Removed from the Group!',
      data: updatedGroup,
    });
  }
}

/* eslint-disable camelcase */
import { Request, Response } from 'express';

import { isValidId } from '../utils/mongoose.js';
import GroupeMember from '../models/groupMenber.entity.js';
import ProductQuantityGroupe from '../models/productQuantityGroupeModel.entity.js';

class GroupeMemberController {
  // Méthode pour récupérer tous les membres de groupe
  static async getAllMembersByGroupId(req: Request, res: Response) {
    const { groupId } = req.params;

    // Vérifier si l'ID du membre est valide
    if (!isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid member ID' });
    }

    const members = await GroupeMember.find({ group_id: groupId })
      .populate([{ path: 'group_id' }, { path: 'user_id', select: '-password' }])
      .lean()
      .exec();

    if (!members.length) return res.status(404).json({ status: 'error', message: 'No members found !' });

    return res.json({ status: 'success', data: members });
  }

  // Méthode pour ajouter un nouveau membre de groupe
  static async addMember(req: Request, res: Response) {
    const { groupId } = req.params;
    const { user_id } = req.body;

    //  TODO remember to implement the join method later

    console.log('user_id', user_id);

    // Vérifier si les ID de groupe et d'utilisateur sont valides
    if (!isValidId(groupId) || !isValidId(user_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group_id or user_id' });
    }
    // check for duplicated
    const deletedMember = await GroupeMember.findOne({
      $and: [{ group_id: groupId }, { user_id }],
    })
      .lean()
      .exec();
    if (deletedMember) {
      return res.status(403).json({ status: 'error', message: 'User Already exist !', data: deletedMember });
    }
    // Créer une nouvelle instance de GroupeMember
    const newMember = new GroupeMember({ group_id: groupId, user_id });

    // Enregistrer dans la base de données
    const savedMember = await newMember.save();

    return res.status(201).json({ status: 'success', data: savedMember });
  }

  // Méthode pour supprimer un membre de groupe
  static async removeMember(req: Request, res: Response) {
    const { memberId, groupId } = req.params;

    // Vérifier si l'ID du membre est valide
    if (!isValidId(memberId) && !isValidId(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid member ID' });
    }

    // Supprimer le membre de groupe
    const deletedMember = await GroupeMember.findOneAndDelete({
      $and: [{ group_id: groupId }, { user_id: memberId }],
    });

    if (!deletedMember) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }
    
    const userProductQ = await ProductQuantityGroupe.findOneAndDelete({
      $and: [{ group_id: groupId }, { user_id: memberId }],
    });

    return res.json({ status: 'success', data: deletedMember });
  }
}

export default GroupeMemberController;

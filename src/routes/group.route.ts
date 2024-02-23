/* eslint-disable comma-dangle */
import express from 'express';

import { requireAuth } from '../middleware/requiredAuth.js';
import { GroupController } from '../controllers/group.middleware.js';
import GroupeMemberController from '../controllers/groupeMenber.controller.js';
import { ProductQuantityGroupeController } from '../controllers/productQuantityGroupeSchema.controller.js';

const groupsRoute = express.Router();

groupsRoute
  .post('/', requireAuth, GroupController.createGroup)
  // .put('/:groupId', GroupController.updateGroup)
  .get('/', GroupController.getAllGroups)

  .patch('/:groupId', requireAuth, GroupController.updateGroup)
  .get('/:groupId', requireAuth, GroupController.getGroup)
  // .post('/:groupId/users', GroupController.addUser)
  .delete('/:groupId', requireAuth, GroupController.deleteGroup)

  // routes for group members
  // Route pour récupérer tous les membres du groupe
  .get('/:groupId/groupMenbers', GroupeMemberController.getAllMembersByGroupId)
  .post('/:groupId/groupMenbers', requireAuth, GroupeMemberController.addMember)
  // Route pour supprimer un membre du groupe
  .delete('/:groupId/groupMenbers/:memberId', requireAuth, GroupeMemberController.removeMember)

  // gestion des quantites
  .get(
    '/:groupId/productQuantities',
    requireAuth,
    ProductQuantityGroupeController.getAllProductQuantityGroupesByGroupId
  )
  .patch(
    '/:groupId/productQuantities/:productQuantityId',
    requireAuth,
    ProductQuantityGroupeController.updateProductQuantityGroupe
  )
  .patch(
    '/:groupId/productQuantities',
    requireAuth,
    ProductQuantityGroupeController.updateProductQuantityGroupeByUserId
  );

export default groupsRoute;

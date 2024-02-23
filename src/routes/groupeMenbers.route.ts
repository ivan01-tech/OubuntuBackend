// groupeMemberRoutes.js
import express from 'express';

import GroupeMemberController from '../controllers/groupeMenber.controller.js';

const router = express.Router();

// Route pour récupérer tous les membres du groupe
router.get('/', GroupeMemberController.getAllMembersByGroupId);

// Route pour ajouter un nouveau membre au groupe
router.post('/:groupId', GroupeMemberController.addMember);

// Route pour supprimer un membre du groupe
router.delete('/:memberId', GroupeMemberController.removeMember);

export default router;

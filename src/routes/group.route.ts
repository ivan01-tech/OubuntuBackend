import express from 'express';

import { requireAuth } from '../middleware/requiredAuth.js';
import { GroupController } from '../controllers/group.middleware.js';

const groupsRoute = express.Router();

groupsRoute
  .post('/', requireAuth, GroupController.createGroup)
  .put('/:groupId', GroupController.updateGroup)
  .delete('/:groupId', GroupController.updateGroup)
  .post('/:groupId/users', GroupController.addUser)
  .delete('/:groupId/users/:userId', GroupController.removeUser);

export default groupsRoute;

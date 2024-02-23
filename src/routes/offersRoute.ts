import express from 'express';

import OfferController from '../controllers/offerController.js';
import { requireAuth } from '../middleware/requiredAuth.js';
import { requiredAdminRoles } from '../middleware/checkUserRoles.js';

const offersRoute = express.Router();

offersRoute
  .post('/', requireAuth, requiredAdminRoles, OfferController.createOffer)
  .delete('/:offerId', requireAuth, requiredAdminRoles, OfferController.deleteOffer)
  .get('/', OfferController.getAllOffOffers);

export default offersRoute;

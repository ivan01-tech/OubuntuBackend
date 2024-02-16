/* eslint-disable import/order */
import { AdminJSOptions } from 'adminjs';
import componentLoader from './component-loader.js';
import Product from '../models/productsModel.js';
import Offer from '../models/offerModel.js';
import { userResource } from '../utils/userResources.js';
import Group from '../models/groupe.model.js';
import GroupeMember from '../models/groupMenber.entity.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [userResource, Product, Offer, Group, GroupeMember],
  databases: [],
};

export default options;

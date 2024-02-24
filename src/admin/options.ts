/* eslint-disable import/order */
import { AdminJSOptions } from 'adminjs';
import componentLoader from './component-loader.js';
import Product from '../models/productsModel.js';
import Offer from '../models/offerModel.js';
import { userResource } from '../utils/userResources.js';
import Group from '../models/groupe.model.js';
import GroupeMember from '../models/groupMenber.entity.js';
import CategoryModel from '../models/productsCategories.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [userResource, Product, Offer, Group, GroupeMember, CategoryModel],
  databases: [],
};

export default options;

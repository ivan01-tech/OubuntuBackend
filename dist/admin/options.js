import User from '../models/userModel.js';
import componentLoader from './component-loader.js';
import Product from '../models/productsModel.js';
import Offer from '../models/offerModel.js';
const options = {
    componentLoader,
    rootPath: '/admin',
    resources: [User, Product, Offer],
    databases: [],
};
export default options;

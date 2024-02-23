import { DefaultAuthProvider } from 'adminjs';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';
import { UserRoles } from '../constants.js';

import componentLoader from './component-loader.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    console.log('password : ', password, email);
    const user = await User.findOne({ email });

    if (!user) return null;

    const matchPassword = await bcrypt.compare(password, user.password);
    console.log('current admin : ', user, matchPassword);

    if (matchPassword && user.roles.includes(UserRoles.is_admin)) {
      return user;
    }

    return null;
  },
});

export default provider;

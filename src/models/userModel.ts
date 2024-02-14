import mongoose, { InferSchemaType } from 'mongoose';
import { isValidPhoneNumber } from 'libphonenumber-js';

// eslint-disable-next-line object-curly-newline
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_NUMBER_REGEX, USER_ROLES, UserRoles, userRoles } from '../constants.js';
import { AfricanCountryCode } from '../utils/CountryCode.js';
import { MyCustomError } from '../utils/CustomError.js';

import Product from './productsModel.js';
import Offer from './offerModel.js';
import Group from './groupe.model.js';

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
    validate: {
      validator: (value: string) => value.length >= 4 && value.length <= 15,
      message: 'Le prénom doit avoir entre 4 et 15 caractères.',
    },
  },
  country_code: {
    type: String,
    enum: AfricanCountryCode,
    required: false,
  },
  created_at: { type: Date, default: Date.now },
  phone_number: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => EMAIL_REGEX.test(v),
      message: (props) => `${props.value} n'est pas un email valide!`,
    },
  },
  password: {
    type: String,
    require: true,
    // validate: {
    //   validator: (v: string) => PASSWORD_REGEX.test(v),
    //   message: (props) => 'Minimum eight characters, at least one letter, one number and one special character:',
    // },
  },
  last_name: {
    type: String,
    default: true,
    validate: {
      validator: (value: string) => value.length >= 4 && value.length <= 15,
      message: 'Le prénom doit avoir entre 4 et 15 caractères.',
    },
  },
  roles: {
    type: [
      {
        type: String,
        enum: UserRoles,
      },
    ],
    required: true,
    default: [UserRoles.is_user],
  },
  googleId: {
    type: String,
    required: false,
    default: null,
  },
  picture: {
    type: String,
    required: false,
    default: null,
  },
});

// mongoose methods
UserSchema.methods.validatePhoneNumber = function (phoneNumber: AfricanCountryCode) {
  return isValidPhoneNumber(phoneNumber, this.country_code);
};
// pre save middleware to test the phone number first
UserSchema.pre('save', async function (next) {
  const phoneNumber = this.phone_number;
  const countryCode = this.country_code as AfricanCountryCode;
  console.log('first phone number : ', phoneNumber, countryCode);

  if (this.phone_number && !isValidPhoneNumber(phoneNumber, countryCode)) {
    throw new MyCustomError('Invalid phone number');
  }

  next();
});

UserSchema.pre('deleteOne', { document: true }, async function (next) {
  const userId = this._id;

  // Mettez à jour les références dans d'autres collections
  // Exemple : Mettre à null le champ `created_by` dans le schéma Products
  await Product.updateMany({ created_by: userId }, { $set: { created_by: null } });
  await Offer.updateMany({ author_id: userId }, { $set: { author_id: null } });
  await Group.updateMany({ author_id: userId }, { $set: { author_id: null } });

  // Ajoutez des étapes similaires pour d'autres références dans d'autres collections

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export type UserTypes = InferSchemaType<typeof UserSchema>;
const User = mongoose.model<UserTypes>('User', UserSchema);
export default User;

import mongoose, { InferSchemaType } from "mongoose";
import {
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
  USER_ROLES,
  UserRoles,
  userRoles,
} from "../constants.js";
import { isValidPhoneNumber } from "libphonenumber-js";
import { AfricanCountryCode } from "../utils/CountryCode.js";
import { MyCustomError } from "../utils/CustomError.js";

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
    validate: {
      validator: (value: string) => {
        return value.length >= 4 && value.length <= 15;
      },
      message: "Le prénom doit avoir entre 4 et 15 caractères.",
    },
  },
  country_code: {
    type: String,
    enum: AfricanCountryCode,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => EMAIL_REGEX.test(v),
      message: (props: any) => `${props.value} n'est pas un email valide!`,
    },
  },
  password: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    default: true,
    validate: {
      validator: (value: string) => {
        return value.length >= 4 && value.length <= 15;
      },
      message: "Le prénom doit avoir entre 4 et 15 caractères.",
    },
  },

  roles: {
    type: [String],
    enum: USER_ROLES,
    required: true,
    default: [userRoles.is_user],
  },
});

// mongoose methods
UserSchema.methods.validatePhoneNumber = function (
  phoneNumber: AfricanCountryCode
) {
  return isValidPhoneNumber(phoneNumber, this.country_code);
};
// pre save middleware to test the phone number first
UserSchema.pre("save", async function (next) {
  const phoneNumber = this.phone_number;
  const countryCode = this.country_code as AfricanCountryCode;
  console.log("first phone number : ", phoneNumber, countryCode);
  if (!isValidPhoneNumber(phoneNumber, countryCode)) {
    throw new MyCustomError("Invalid phone number");
  }

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export type UserTypes = InferSchemaType<typeof UserSchema>;
const User = mongoose.model<UserTypes>("User", UserSchema);
export default User;

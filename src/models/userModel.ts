import mongoose, { InferSchemaType } from "mongoose";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX, userRoles } from "../constants.js";
import parsePhoneNumberFromString, { isValidNumber } from "libphonenumber-js";
import usersRoute from "../routes/userRoute.js";

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
  created_at: { type: Date, default: Date.now },
  phone_number: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        const phoneNumber = parsePhoneNumberFromString(value);
        // TODO revenir ici
        return PHONE_NUMBER_REGEX.test(value);
      },
      message: "Invalid phone number",
    },
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
  country_code: {
    type: Number,
    required: true,
  },
  roles: {
    type: [String],
    default: [userRoles.is_user],
  },
});

export type UserTypes = InferSchemaType<typeof UserSchema>;
const User = mongoose.model<UserTypes>("User", UserSchema);
export default User;

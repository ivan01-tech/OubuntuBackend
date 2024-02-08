import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose, { Error } from "mongoose";
import User from "../models/userModel.js";
import { MyCustomError } from "../utils/CustomError.js";

export class UserController {
  /**
   * @desc create a new user
   * @route POST /users
   * @access Public
   * @param req
   * @param res
   * @returns
   */
  static async createUser(req: Request, res: Response) {
    try {
      const {
        email,
        last_name,
        country_code,
        first_name,
        phone_number,
        password,
      } = req.body;

      // chek for duplicating
      const user = await User.findOne({
        $or: [{ email }, { phone_number }],
      })
        .lean()
        .exec();

      if (user)
        //conflict
        return res
          .status(409)
          .json({ type: "Error", message: "The user already exist" });

      // hashing password
      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        last_name,
        country_code,
        first_name,
        phone_number,
        password: hashPassword,
      });
      console.log("newuser : ", newUser, hashPassword);

      if (newUser) {
        delete newUser.password;

        return res.status(201).send({
          type: "Success",
          message: `Création  d'un nouvel utilisateur avec succès`,
          data: newUser,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid user data received", data: newUser });
      }
    } catch (error) {
      // Vérifiez si l'erreur est une erreur de validation de Mongoose
      if (error instanceof Error.ValidationError) {
        const validationErrors: { [key: string]: string } = {};

        // Itérer sur les erreurs de validation et les stocker dans un objet
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = (error as Error.ValidationError).errors[
            key
          ].message;
        });

        res.status(400).json({ errors: validationErrors });
      } else if (error instanceof MyCustomError) {
        return res.status(500).json({ type: "error", message: error.message });
      } else {
        console.log("error : ", error);
        // Si ce n'est pas une erreur de validation, renvoyez une réponse d'erreur générique
        return res.status(500).json({
          type: "error",
          message: "Erreur lors de la création de l'utilisateur.",
        });
      }
    }
  }

  /**
   * @desc get all users
   * @route GET /users
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find({}).select("-password").lean().exec();

      if (!users.length)
        return res
          .status(404)
          .json({ type: "error", message: "No users found !" });

      return res.json({ type: "success", data: users });
    } catch (error) {
      console.log("error : ", error);
      return res
        .status(500)
        .json({ type: "error", message: "Somethinfg went wrong !" });
    }
  }

  /**
   * @desc get a single user
   * @route GET /users/:userid
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!mongoose.isValidObjectId(userId)) {
        return res
          .status(400)
          .json({ type: "error", message: "Invalid user ID." });
      }
      const users = await User.findById(userId)
        .select("-password")
        .lean()
        .exec();

      if (!users)
        return res
          .status(404)
          .json({ type: "error", message: "No users found !" });

      return res.json({ type: "success", data: users });
    } catch (error) {
      console.log("error : ", error);
      return res
        .status(500)
        .json({ type: "error", message: "Somethinfg went wrong !" });
    }
  }

  /**
   * @desc delete a single user
   * @route GET /users/
   * @access Private
   * @param req
   * @param res
   * @returns
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!mongoose.isValidObjectId(userId)) {
        return res
          .status(400)
          .json({ type: "error", message: "Invalid user ID." });
      }
      const users = await User.findById(userId);

      if (!users)
        return res
          .status(404)
          .json({ type: "error", message: "No users found !" });
      await users.delete();
      return res.json({ type: "success", message: "Successfully Deleted !" });
    } catch (error) {
      console.log("error : ", error);
      return res
        .status(500)
        .json({ type: "error", message: "Somethinfg went wrong !" });
    }
  }

  /**
   * @desc upadate a  user
   * @route PATCH /users/:userId
   * @access Prvate
   * @param req
   * @param res
   * @returns
   */
  static async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { last_name, country_code, first_name, phone_number } = req.body;

      if (!mongoose.isValidObjectId(userId)) {
        return res
          .status(400)
          .json({ type: "error", message: "Invalid user ID." });
      }
      // chek for user
      const user = await User.findById(userId);

      if (!user)
        return res
          .status(404)
          .json({ type: "error", message: "No users found !" });

      last_name && (user.last_name = last_name);
      phone_number && (user.phone_number = phone_number);
      first_name && (user.first_name = first_name);
      country_code && (user.country_code = country_code);

      const ipdateuser = await user.save();
      console.log("updated : ", ipdateuser);
      if (ipdateuser) {
        return res.json({
          type: "Success",
          message: `Successfully updated !`,
          data: ipdateuser,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid user data received", data: user });
      }
    } catch (error) {
      // Vérifiez si l'erreur est une erreur de validation de Mongoose
      if (error instanceof Error.ValidationError) {
        const validationErrors: { [key: string]: string } = {};

        // Itérer sur les erreurs de validation et les stocker dans un objet
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = (error as Error.ValidationError).errors[
            key
          ].message;
        });

        res.status(400).json({ errors: validationErrors });
      } else if (error instanceof MyCustomError) {
        return res.status(500).json({ type: "error", message: error.message });
      } else {
        console.log("error : ", error);
        // Si ce n'est pas une erreur de validation, renvoyez une réponse d'erreur générique
        return res.status(500).json({
          type: "error",
          message: "Erreur lors de la création de l'utilisateur.",
        });
      }
    }
  }
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Error } from "mongoose";
import User from "../models/userModel.js";

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

        res.status(201).send({
          type: "Success",
          message: `Création  d'un nouvel utilisateur avec succès`,
          data: newUser,
        });
      } else {
        res
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
      } else {
        console.log("error : ", error);
        // Si ce n'est pas une erreur de validation, renvoyez une réponse d'erreur générique
        res
          .status(500)
          .json({ error: "Erreur lors de la création de l'utilisateur." });
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
  //   static getAllUsers(req: Request, res: Response) {}
}

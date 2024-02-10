import { Request, Response } from "express";
import User, { UserTypes } from "../models/userModel.js";
import bcrypt from "bcrypt";

export class AuthenticationController {
  /**
   * @desc auhenticate a user with email and password
   * @route POST /auth/login
   * @access public
   * @param req
   * @param res
   * @returns
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "error", message: "All fields are required!" });
      }

      // check if the user exist
      const checkUser = await User.findOne({ email }).lean().exec();
      if (!checkUser) {
        return res
          .status(401)
          .json({ message: "Unauthorized ! ", status: "error" });
      }

      // check if the password match
      const matchPassword = await bcrypt.compare(password, checkUser.password!);

      // the password doesn't match
      if (!matchPassword) {
       return res.status(401).json({ message: "Unauthorized", status: "error" });
      }

      req.session.user = checkUser;
      req.session.userId = checkUser._id.toString();

      console.log("here");
      return res.json({
        status: "success",
        message: "successfully logged in",
      });
    } catch (err) {
      console.log("error", err);
      return res
        .status(500)
        .json({ status: "error", message: (err as Error).message });
    }
  }

  static async getUserStatus(req: Request, res: Response) {
    try {
      const { user, userId } = req.session;
      if (!user || !userId) {
        return res
          .status(403)
          .json({ message: "Not logged in", status: "error" });
      }

      delete (user as UserTypes).password;

      return res.json({
        status: "success",
        message: "Logged in",
        data: user,
      });
    } catch (err) {
      console.log("error", err);
      return res
        .status(500)
        .json({ status: "error", message: (err as Error).message });
    }
  }
  /**
   * @desc logout a user w
   * @route GET /auth/login
   * @access public
   * @param req
   * @param res
   * @returns
   */
  static async logout(req: Request, res: Response) {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully", status: "success" });
    });
  }
}

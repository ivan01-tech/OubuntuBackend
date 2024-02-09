import { Request, Response } from "express";
import User from "../models/userModel.js";
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
        res.status(400).json({ message: "All fields are required!" });
      }

      // check if the user exist
      const checkUser = await User.findOne({ email })
        .lean()
        .exec();
      if (!checkUser) {
        return res
          .status(401)
          .json({ message: "Unauthorized ! ", status: "error" });
      }

      // check if the password match
      console.log("first check : ", checkUser.password, password);
      const matchPassword = await bcrypt.compare(password, checkUser.password!);

      // the password doesn't match
      if (!matchPassword) {
        res.status(401).json({ message: "Unauthorized", status: "error" });
      }

      req.session.user = checkUser;
      req.session.userId = checkUser._id.toString();

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
  /**
   * @desc logout a user w
   * @route POST /auth/login
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

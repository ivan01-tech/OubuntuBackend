/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';

import User, { UserTypes } from '../models/userModel.js';

config();
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields are required!' });
    }

    // check if the user exist
    const checkUser = await User.findOne({ email });
    // console.log('checkUser', checkUser);
    if (!checkUser) {
      return res.status(401).json({ message: 'Unauthorized ! ', status: 'error' });
    }

    // check if the password match
    const matchPassword = await bcrypt.compare(password, checkUser.password);
    // console.log('findUser', matchPassword, checkUser, password);

    // the password doesn't match
    if (!matchPassword) {
      return res.status(401).json({ message: 'Unauthorized', status: 'error' });
    }

    req.session.user = checkUser;
    req.session.userId = checkUser._id.toString();

    delete checkUser.password;
    console.log('user : ', req.session.id);

    return res.json({
      status: 'success',
      data: checkUser,
      message: 'successfully logged in',
    });
  }

  static async getUserStatus(req: Request, res: Response) {
    const { user: userSession, userId } = req.session;
    const { user } = req;
    console.log('user : ', req.session.cookie);

    if (req.isAuthenticated()) {
      return res.json({
        status: 'success',
        message: 'Logged in',
        data: user,
      });
    }
    // console.log('user service : ', userId, userSession);
    if (!userId && !userSession) {
      return res.status(403).json({ message: 'Not logged in', status: 'error' });
    }

    delete (userSession as UserTypes).password;

    return res.json({
      status: 'success',
      message: 'Logged in',
      data: userSession,
    });
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
    req.session.destroy(() => res.json({ message: 'Logged out successfully', status: 'success' }));
    // passport
    req.logout({}, (err) => {
      if (err) return res.status(500).json({ message: 'Something went wrong!', status: 'success' });
    });

    res.redirect(process.env.CLIENT_URL);
  }
}

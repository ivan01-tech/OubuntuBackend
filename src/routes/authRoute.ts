/* eslint-disable comma-dangle */
import express from 'express';
import passport from 'passport';
import { config } from 'dotenv';

import { AuthenticationController } from '../controllers/authController.js';

config();
const authRoute = express.Router();

authRoute
  .post('/login', AuthenticationController.login)
  .get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: '/failed',
    })
  )
  .get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  )
  .get('/failed', (req, res) => {
    res.status(401).json({
      status: 'error',
      message: 'Login failed',
    });
  })
  .get('/logout', AuthenticationController.logout)
  .get('/status', AuthenticationController.getUserStatus);

export default authRoute;

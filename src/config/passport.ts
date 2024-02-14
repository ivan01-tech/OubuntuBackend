/* eslint-disable max-len */
/* eslint-disable comma-dangle */
import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import { config } from 'dotenv';

import User from '../models/userModel.js';

export function configurePassport() {
  config();
  const clientID = process.env.CLIENT_ID as string;
  const clientSecret = process.env.CLIENT_SECRET as string;

  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.phonenumbers.read'], // Ajouter la portée pour accéder au numéro de téléphone
      },
      (accessToken, refreshToken, profile, verification) => {
        console.log('profile : ', profile, refreshToken, verification, accessToken);
        const userJson = profile._json;
        User.findOne({ $and: [{ email: userJson.email }, { googleId: userJson.sub }] })
          .then((existingUser) => {
            if (existingUser) {
              // Handle existing user login (e.g., create session, redirect)
              console.log('User already exists:', existingUser.email);
              verification(null, existingUser); // Or handle differently based on your strategy
            } else {
              const newUser = new User({
                email: userJson.email,
                first_name: userJson.family_name,
                googleId: userJson.sub,
                last_name: userJson.given_name,
                picture: userJson.picture,
              });

              newUser
                .save()
                .then((createdUser) => {
                  console.log('New user created:', createdUser);
                  verification(null, createdUser); // Or handle differently based on your strategy
                })
                .catch((err) => {
                  console.error('Error creating user:', err);
                  verification(err);
                });
            }
          })
          .catch((err) => {
            console.error('Error finding user:', err);
            verification(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('serialized user : ', user);
    done(null, { userId: user._id, user });
  });

  passport.deserializeUser((serializedData, done) => {
    console.log('deserialized user : ', serializedData);

    const { userId, user } = serializedData;
    User.findById(userId, (err, foundUser) => {
      done(err, foundUser || user);
    });
  });
}

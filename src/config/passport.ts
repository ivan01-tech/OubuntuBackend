/* eslint-disable max-len */
/* eslint-disable comma-dangle */
import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

import { SALT_HASH } from '../constants.js';
import User from '../models/userModel.js';

config();
const clientID = process.env.CLIENT_ID as string;
const clientSecret = process.env.CLIENT_SECRET as string;

export function configurePassport() {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email'], // Ajouter la portée pour accéder au numéro de téléphone
      },
      (accessToken, refreshToken, profile, verification) => {
        console.log('profile : ', profile, refreshToken, verification, accessToken);
        const userJson = profile._json;
        User.findOne({ $or: [{ email: userJson.email }, { googleId: userJson.sub }] })
          .then(async (existingUser) => {
            if (existingUser) {
              // Handle existing user login (e.g., create session, redirect)
              console.log('User already exists:', existingUser.email);
              verification(null, existingUser); // Or handle differently based on your strategy
            } else {
              const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, SALT_HASH);

              const newUser = new User({
                email: userJson.email,
                password: hashedPassword,
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
}

// passport.serializeUser((user, done) => {
//   console.log('serialized user : ', user);
//   done(null, user._id);
// });

passport.serializeUser((user, done) => {
  if (user && typeof user === 'object' && '_id' in user) {
    console.log('serialized user : ', user);
    done(null, user._id);
  } else {
    done(new Error('Invalid user object'));
  }
});

passport.deserializeUser((serializedData, done) => {
  console.log('deserialized user : ', serializedData);

  User.findById(serializedData)
    .then((foundUser) => {
      done(null, foundUser);
    })
    .catch((error) => {
      done(error);
    });
});

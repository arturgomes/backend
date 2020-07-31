// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";
import Instagram from 'passport-instagram';
const InstagramStrategy = Instagram.Strategy;

const FacebookStrategy = strategy.Strategy;

import ids from './config/oauths';

import User from '../models/User';

dotenv.config();

passport.initialize();
passport.session();
passport.serializeUser((user, cb) => { cb(null, user) })
passport.deserializeUser((obj, cb) => { cb(null, obj) })

passport.use(
  new FacebookStrategy(
    ids.facebook,
    async (accessToken, refreshToken, profile, done) => {
      //Check the DB to find a User with the profile.id
      // console.log(accessToken);
      await User.findOrCreate({
        where: {
          name: profile._json.name,
          email: profile._json.email,
          provider_type: 'facebook',
          user_id: profile._json.id
        }
      }).then(currentUser => done(null, currentUser));
      // if (!currentUser) {
      //   const newUser = new User({
      //     user_id: profile._json.id, //pass in the id and displayName params from Facebook
      //     name: profile._json.name,
      //     email: profile._json.email,
      //     provider_type: profile.provider
      //   }).save();

      //   if (newUser) {
      //     done(null, newUser);
      //   }
      // }
      // done(null, currentUser); //If User already exists login as stated on line 10 return User
    }
  ));

passport.use(
  new InstagramStrategy(
    ids.instagram,
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(async () => {
        const currentUser = await User.findOne({
          where: {
            name: profile._json.name,
            email: profile._json.email,
            provider_type: 'instagram',
            user_id: profile._json.id
          }
        })
        if (currentUser) { done(null, currentUser) }
        const newUser = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          provider_type: 'instagram',
          user_id: profile._json.id
        })
      }
      );

      // To keep the example simple, the user's Instagram profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Instagram account with a user record in your database,
      // and return that user instead.
      console.log(profile)

      return done(null, profile);
    }));

passport.use(
  new GoogleStrategy(
    ids.google,
    async function (request, accessToken, refreshToken, profile, done) {
      const { err, currentUser } = await User.findOne({ user_id: profile.id })
      // .then((err, user) => {
      if (err) {
        console.log(err);  // handle errors!
      }
      if (!err && currentUser !== null) {
        done(null, currentUser);
      } else {
        const newUser = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          provider_type: 'instagram',
          user_id: profile._json.id
        });

        // user.save(function(err) {
        //   if(err) {
        //     console.log(err);  // handle errors!
        //   } else {
        console.log("saving user ...");
        done(null, newUser);
        //   }
        // });
      }
      // }
      // )
    }
  ));



//Check the DB to find a User with the profile.id
// console.log(accessToken);
// console.log(profile)
// const currentuser = await User.findOne({
//   where: {
//     name: profile._json.name,
//     email: profile._json.email,
//     provider_type: 'facebook',
//     user_id: profile._json.id
//   }
// });
// if (!currentuser) {
//   const newUser = new User({
//     user_id: profile._json.id, //pass in the id and displayName params from Facebook
//     name: profile._json.name,
//     email: profile._json.email,
//     provider_type: profile.provider
//   })

//   if (newUser) {
//     done(null, newUser);
//   }
// }
// done(null, currentUser); //If User already exists login as stated on line 10 return User
export default passport;

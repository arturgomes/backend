// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";
import Instagram from 'passport-instagram';



const FacebookStrategy = strategy.Strategy;

// const InstagramStrategy = Instagram.Strategy;
var InstagramStrategy = require('passport-instagram').Strategy; /* this should be after passport*/


import User from '../models/User';

dotenv.config();

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findOne({ where: { user_id: id } })
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});


passport.use(
  new FacebookStrategy(
    ids.facebook,
    async (accessToken, refreshToken, profile, done) => {
      //Check the DB to find a User with the profile.id
      console.log(accessToken);
      console.log(profile)
      const currentuser = await User.findOne({
        where: {
          name: profile._json.name,
          email: profile._json.email,
          provider_type: 'facebook',
          user_id: profile._json.id
        }
      });
      if (!currentuser) {
        const newUser = new User({
          user_id: profile._json.id, //pass in the id and displayName params from Facebook
          name: profile._json.name,
          email: profile._json.email,
          provider_type: profile.provider
        })

        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser); //If User already exists login as stated on line 10 return User
    }
  ));


passport.use(
  new InstagramStrategy(
    ids.instagram,
    async (accessToken, refreshToken, profile, done) => {
      process.nextTick(function () {

        // To keep the example simple, the user's Instagram profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Instagram account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
      }
      );
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
    }
  ));
export default passport;

// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";


const FacebookStrategy = strategy.Strategy;
import User from '../models/User';

dotenv.config();

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
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
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name
      };
      console.log(userData);
      // new User(userData).save();
      done(null, profile);
    }
  )
);

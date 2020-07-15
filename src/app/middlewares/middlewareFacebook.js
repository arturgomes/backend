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
      // console.log(accessToken);
      await User.findOrCreate({
        where: {
          name: profile._json.name,
          email: profile._json.email,
          provider_type: 'facebook',
          user_id: profile._json.id
        }
      }).then(currentUser => done(null,currentUser));
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

export default passport;

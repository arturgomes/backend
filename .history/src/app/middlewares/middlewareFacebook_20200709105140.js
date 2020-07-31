// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";

import userModel from "../user/user.model";

const FacebookStrategy = strategy.Strategy;
import User from '../models/User';

// const fbstrat = async () => {
//   return new FacebookStrategy(ids.facebook,
//     function (accessToken, refreshToken, profile, done) {
//       const count = User.count({ where: { user_id: profile.id } })
//       if (count === 0) {
//         await User.create({
//           user_id: profile.id,
//           name: profile.name,
//           email: profile.email,
//           provider_type: 'facebook'
//         });
//       }
//     })
// };

// module.exports = { fbstrat }



dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
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
      new userModel(userData).save();
      done(null, profile);
    }
  )
);

// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";
import instagram from "passport-instagram";


const FacebookStrategy = strategy.Strategy;
const InstagramStrategy = instagram.Strategy;
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
      await User.findOne({ 'user_id': profile.id, 'provider_type': 'instagram' }, function (err, user) {
        if (err) return callback(err);
        if (user) {
          return done(null, user); // Check if user already exists
        }
        // const {
        //   id,
        //   full_name,
        //   username,
        //   profile_picture,
        //   bio,
        //   website,
        //   counts: { media, follows, followed_by }
        // } = profile._json.data;
        // const new_user = new User({
        //   instagram: {
        //     id,
        //     accessToken,
        //     full_name,
        //     username,
        //     profile_picture,
        //     bio,
        //     website,
        //     counts: {
        //       media,
        //       follows,
        //       followed_by
        //     }
        //   }
        // });
        // new_user.save(function (err, user) { //saving a new user into mongo
        //   if (err) {
        //     throw err;
        //   }
        //   return done(null, user);
        // });
        console.log(profile)
      });
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

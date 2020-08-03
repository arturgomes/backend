"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// import 'dotenv/config';
var _oauthsjs = require('../../config/oauths.js'); var _oauthsjs2 = _interopRequireDefault(_oauthsjs);
var _passport = require('passport'); var _passport2 = _interopRequireDefault(_passport);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);


const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;


var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

_dotenv2.default.config();

_passport2.default.initialize();
_passport2.default.session();
_passport2.default.serializeUser((user, cb) => { cb(null, user) })
_passport2.default.deserializeUser((obj, cb) => { cb(null, obj) })

_passport2.default.use(
  new FacebookStrategy(
    _oauthsjs2.default.facebook,
    async (accessToken, refreshToken, profile, done) => {
      //Check the DB to find a User with the profile.id
      // console.log(accessToken);
      await _User2.default.findOrCreate({
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

_passport2.default.use(
  new InstagramStrategy(
    _oauthsjs2.default.instagram,
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(async () => {
        const currentUser = await _User2.default.findOne({
          where: {
            name: profile._json.name,
            email: profile._json.email,
            provider_type: 'instagram',
            user_id: profile._json.id
          }
        })
        if (currentUser) { done(null, currentUser) }
        const newUser = await _User2.default.create({
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

_passport2.default.use(
  new GoogleStrategy(
    _oauthsjs2.default.google,
    async function (request, accessToken, refreshToken, profile, done) {
      const { err, currentUser } = await _User2.default.findOne({ user_id: profile.id })
      // .then((err, user) => {
      if (err) {
        console.log(err);  // handle errors!
      }
      if (!err && currentUser !== null) {
        done(null, currentUser);
      } else {
        const newUser = await _User2.default.create({
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
exports. default = _passport2.default;

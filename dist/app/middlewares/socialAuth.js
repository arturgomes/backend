"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oauths = _interopRequireDefault(require("../../config/oauths.js"));

var _passport = _interopRequireDefault(require("passport"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'dotenv/config';
const FacebookStrategy = require('passport-facebook').Strategy; // const TwitterStrategy = require('passport-twitter').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;


const GoogleStrategy = require('passport-google-oauth2').Strategy;

const InstagramStrategy = require('passport-instagram').Strategy;

_dotenv.default.config();

_passport.default.initialize();

_passport.default.session();

_passport.default.serializeUser((user, cb) => {
  cb(null, user);
});

_passport.default.deserializeUser((obj, cb) => {
  cb(null, obj);
});

_passport.default.use(new FacebookStrategy(_oauths.default.facebook, async (accessToken, refreshToken, profile, done) => {
  //Check the DB to find a User with the profile.id
  // console.log(accessToken);
  await _User.default.findOrCreate({
    where: {
      name: profile._json.name,
      email: profile._json.email,
      provider_type: 'facebook',
      user_id: profile._json.id
    }
  }).then(currentUser => done(null, currentUser)); // if (!currentUser) {
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
}));

_passport.default.use(new InstagramStrategy(_oauths.default.instagram, (accessToken, refreshToken, profile, done) => {
  process.nextTick(async () => {
    const currentUser = await _User.default.findOne({
      where: {
        name: profile._json.name,
        email: profile._json.email,
        provider_type: 'instagram',
        user_id: profile._json.id
      }
    });

    if (currentUser) {
      done(null, currentUser);
    }

    const newUser = await _User.default.create({
      name: profile._json.name,
      email: profile._json.email,
      provider_type: 'instagram',
      user_id: profile._json.id
    });
  }); // To keep the example simple, the user's Instagram profile is returned to
  // represent the logged-in user.  In a typical application, you would want
  // to associate the Instagram account with a user record in your database,
  // and return that user instead.

  console.log(profile);
  return done(null, profile);
}));

_passport.default.use(new GoogleStrategy(_oauths.default.google, async function (request, accessToken, refreshToken, profile, done) {
  const {
    err,
    currentUser
  } = await _User.default.findOne({
    user_id: profile.id
  }); // .then((err, user) => {

  if (err) {
    console.log(err); // handle errors!
  }

  if (!err && currentUser !== null) {
    done(null, currentUser);
  } else {
    const newUser = await _User.default.create({
      name: profile._json.name,
      email: profile._json.email,
      provider_type: 'instagram',
      user_id: profile._json.id
    }); // user.save(function(err) {
    //   if(err) {
    //     console.log(err);  // handle errors!
    //   } else {

    console.log("saving user ...");
    done(null, newUser); //   }
    // });
  } // }
  // )

})); //Check the DB to find a User with the profile.id
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


var _default = _passport.default;
exports.default = _default;
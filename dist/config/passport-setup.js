"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth20"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

var _User = _interopRequireDefault(require("../app/models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
_passport.default.serializeUser((user, done) => {
  done(null, user.id);
}); // deserialize the cookieUserId to user in the database


_passport.default.deserializeUser((id, done) => {
  _User.default.findByPk(id).then(user => {
    console.log(user);
    done(null, user);
  }).catch(e => {
    done(new Error("Failed to deserialize an user"));
  });
});

_passport.default.use(new _passportGoogleOauth.default({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (token, tokenSecret, profile, done) => {
  // find current user in UserModel
  // console.log(profile)
  const {
    sub,
    name,
    given_name,
    family_name,
    picture,
    email
  } = profile._json;
  const currentUser = await _User.default.findOne({
    where: {
      email
    }
  }); //  User.findOne({ sub,email })//.then(res => done(null, res));

  if (currentUser) {
    // console.log(currentUser)
    if (currentUser.provider_type !== 'google') {
      return res.json({
        message: `usuário existente com esse email usando outro login social`,
        provider_type: currentUser.provider_type
      });
    }

    console.log("já existeq");
    return done(null, currentUser);
  } else {
    // create new user if the database doesn't have this user
    // if (!currentUser) {
    try {
      await _User.default.create({
        user_id: sub,
        name,
        email,
        thumbnail: picture,
        provider_type: 'google'
      }).then(newUser => {
        console.log("criou novo");
        done(null, newUser);
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  } // }

}));

_passport.default.use(new _passportFacebook.default({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  // callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
  callbackURL: 'http://localhost:3000/auth/facebook/redirect',
  profileFields: ['id', 'displayName', 'emails']
}, async (token, tokenSecret, profile, done) => {
  // find current user in UserModel
  // console.log(profile)
  const {
    sub,
    name,
    given_name,
    family_name,
    picture,
    email
  } = profile._json;
  const currentUser = await _User.default.findOne({
    where: {
      email
    }
  }); //  User.findOne({ sub,email })//.then(res => done(null, res));

  if (currentUser) {
    console.log(currentUser);

    if (currentUser.provider_type !== 'facebook') {
      return res.json({
        message: `usuário existente com esse email usando outro login social`,
        provider_type: currentUser.provider_type
      });
    }

    console.log("já existeq");
    return done(null, currentUser);
  } else {
    // create new user if the database doesn't have this user
    // if (!currentUser) {
    const newUser = await new _User.default({
      user_id: sub,
      name,
      email,
      provider_type: 'facebook'
    }).save();
    console.log("criou novo");

    if (newUser) {
      return done(null, newUser);
    }
  } // }

}));
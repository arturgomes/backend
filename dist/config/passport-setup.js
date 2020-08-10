"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _passport = require('passport'); var _passport2 = _interopRequireDefault(_passport);
var _passportgoogleoauth20 = require('passport-google-oauth20'); var _passportgoogleoauth202 = _interopRequireDefault(_passportgoogleoauth20);
var _passportfacebook = require('passport-facebook'); var _passportfacebook2 = _interopRequireDefault(_passportfacebook);
var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
_passport2.default.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
_passport2.default.deserializeUser((id, done) => {
  _User2.default.findByPk(id)
    .then(user => {
      console.log(user);
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

_passport2.default.use(
  new (0, _passportgoogleoauth202.default)(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      // console.log(profile)
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      const currentUser = await _User2.default.findOne({ where: { email } })
      //  User.findOne({ sub,email })//.then(res => done(null, res));

      if (currentUser) {
        // console.log(currentUser)
        if (currentUser.provider_type !== 'google') {
          return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
        }
        console.log("já existeq")
        return done(null, currentUser);
      }
      else {// create new user if the database doesn't have this user
        // if (!currentUser) {
          try {
            await _User2.default.create({
              user_id: sub, name, email, thumbnail:picture, provider_type: 'google',
            })
              .then(newUser => {
                console.log("criou novo");
                done(null, newUser)
              })
          } catch(err) {
            console.log(err); // TypeError: failed to fetch
          }
      }
      // }
    }
  )
)


_passport2.default.use(
  new (0, _passportfacebook2.default)(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      // callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'emails']

    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      // console.log(profile)
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      const currentUser = await _User2.default.findOne({ where: { email } })
      //  User.findOne({ sub,email })//.then(res => done(null, res));

      if (currentUser) {
        console.log(currentUser)
        if (currentUser.provider_type !== 'facebook') {
          return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
        }
        console.log("já existeq")
        return done(null, currentUser);
      }
      else {// create new user if the database doesn't have this user
        // if (!currentUser) {
        const newUser = await new (0, _User2.default)({
          user_id: sub, name, email, provider_type: 'facebook',
        }).save();
        console.log("criou novo")

        if (newUser) {
          return done(null, newUser);
        }
      }
      // }
    }
  )
);

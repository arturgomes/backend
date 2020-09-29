import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../app/models/User.js";
import Retail from "../app/models/Retail.js";
import {login} from './socialLoginFun.js';


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
const checkRetail = (id) => Retail.findByPk(id);
const checkUser = (id) =>User.findByPk(id);

passport.deserializeUser((id, done) => {
  Promise.all([checkRetail(id),checkUser(id)])
    .then(user => {
      // trying to get one user from users or retail and pass it to done
      const usr = user[0] ? user[0] : user[1];
      done(null, usr);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      passReqToCallback: true,
    },
  async (req, accessToken, refreshToken, profile, done) => login(req,'google',profile,done)
  )
)


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'emails'],
      passReqToCallback: true

    },
    async (req, accessToken, refreshToken, profile, done) => login(req,'facebook',profile,done)

    // async (req, token, tokenSecret, profile, done) => {
    //   console.log(req.retail);

    //   // find current user in UserModel
    //   // console.log(profile)
    //   const { sub, name, given_name, family_name, picture, email } = profile._json;
    //   if (req.retail) {
    //     const currentUser = await Retail.findOne({ where: { email } })
    //     //  User.findOne({ sub,email })//.then(res => done(null, res));

    //     if (currentUser) {
    //       console.log(currentUser)
    //       // if (currentUser.provider_type !== 'facebook') {
    //       //   return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
    //       // }
    //       // console.log("já existe")
    //       return done(null, currentUser);
    //     }
    //     else {// create new user if the database doesn't have this user
    //       // if (!currentUser) {
    //         try {
    //           await Retail.create({
    //             user_id: sub, name, email, thumbnail: picture, provider_type: 'facebook',
    //           })
    //             .then(newUser => {
    //               // console.log("criou novo");
    //               done(null, newUser)
    //             })
    //         } catch (err) {
    //           console.log(err); // TypeError: failed to fetch
    //         }
    //     }
    //   }
    //   {
    //     const currentUser = await User.findOne({ where: { email } })
    //     //  User.findOne({ sub,email })//.then(res => done(null, res));

    //     if (currentUser) {
    //       console.log(currentUser)
    //       // if (currentUser.provider_type !== 'facebook') {
    //       //   return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
    //       // }
    //       // console.log("já existe")
    //       return done(null, currentUser);
    //     }
    //     else {// create new user if the database doesn't have this user
    //       // if (!currentUser) {
    //       const newUser = await new User({
    //         user_id: sub, name, email, provider_type: 'facebook',
    //       }).save();
    //       // console.log("criou novo")

    //       if (newUser) {
    //         return done(null, newUser);
    //       }
    //     }
    //   }
    //   // }
    // }
  )
);


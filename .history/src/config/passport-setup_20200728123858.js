import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import keys from ''
const keys = require("./keys");
import User from "../app/models/User";



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
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      console.log(profile)
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      const currentUser = await User.findOne({where:{email}})
      //  User.findOne({ sub,email })//.then(res => done(null, res));
      if (currentUser) {
        console.log("já existeq")
        return done(null, currentUser);
      }
      else {// create new user if the database doesn't have this user
        // if (!currentUser) {
        const newUser = await new User({
          sub, name, given_name, family_name, picture, email,
          provider: 'google',
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

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../app/models/User";


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      console.log(user);
      done(null, user);
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
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      // console.log(profile)
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      const currentUser = await User.findOne({where:{email}})
      //  User.findOne({ sub,email })//.then(res => done(null, res));

      if (currentUser) {
        console.log(currentUser)
        if(currentUser.provider_type!=='google'){
          return res.json({message:`usuário existente com esse email usando outro login social`,provider_type:currentUser.provider_type})
        }
        console.log("já existeq")
        return done(null, currentUser);
      }
      else {// create new user if the database doesn't have this user
        // if (!currentUser) {
        const newUser = await new User({
          user_id:sub, name, email, provider_type: 'google',
        }).save();
        console.log("criou novo")

        if (newUser) {
          return done(null, newUser);
        }
      }
      // }
    }
  )
)


    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
          // callbackURL: 'http://localhost:3000/auth/facebook/redirect',
          profileFields: ['id', 'displayName', 'emails']

        }async (token, tokenSecret, profile, done) => {
          // find current user in UserModel
          // console.log(profile)
          const { sub, name, given_name, family_name, picture, email } = profile._json;
          const currentUser = await User.findOne({where:{email}})
          //  User.findOne({ sub,email })//.then(res => done(null, res));

          if (currentUser) {
            console.log(currentUser)
            if(currentUser.provider_type!=='google'){
              return res.json({message:`usuário existente com esse email usando outro login social`,provider_type:currentUser.provider_type})
            }
            console.log("já existeq")
            return done(null, currentUser);
          }
          else {// create new user if the database doesn't have this user
            // if (!currentUser) {
            const newUser = await new User({
              user_id:sub, name, email, provider_type: 'google',
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

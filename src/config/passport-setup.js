import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../app/models/User";
import Retail from "../app/models/Retail";


// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      // console.log(user);
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
      callbackURL: process.env.GOOGLE_CALLBACK,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // find current user in UserModel
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      console.log(req.session.retail);
      if (req.session.retail) {

        await Retail.findOne({ where: { email } })
          .then(currentUser => {
            if (currentUser) {
              if (currentUser.provider_type !== 'google') {
                return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
              }
              return done(null, currentUser);
            }
            else {// create new user if the database doesn't have this user
              try {
                await Retail.create({
                  user_id: sub, name, email, thumbnail: picture, provider_type: 'google',
                })
                  .then(newUser => {
                    done(null, newUser)
                  })
              } catch (err) {
                console.log(err); // TypeError: failed to fetch
              }
            }
          })
          .catch(error => res.json({message:"deu ruim no retail"}))
      }
      else {
        const currentUser = await User.findOne({ where: { email } })

        if (currentUser) {
          if (currentUser.provider_type !== 'google') {
            return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
          }
          return done(null, currentUser);
        }
        else {// create new user if the database doesn't have this user
          try {
            await User.create({
              user_id: sub, name, email, thumbnail: picture, provider_type: 'google',
            })
              .then(newUser => {
                done(null, newUser)
              })
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
        }
      }
    }
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
    async (req, token, tokenSecret, profile, done) => {
      console.log(req.retail);

      // find current user in UserModel
      // console.log(profile)
      const { sub, name, given_name, family_name, picture, email } = profile._json;
      if (req.retail) {
        const currentUser = await Retail.findOne({ where: { email } })
        //  User.findOne({ sub,email })//.then(res => done(null, res));

        if (currentUser) {
          console.log(currentUser)
          // if (currentUser.provider_type !== 'facebook') {
          //   return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
          // }
          // console.log("já existe")
          return done(null, currentUser);
        }
        else {// create new user if the database doesn't have this user
          // if (!currentUser) {
          try {
            await Retail.create({
              user_id: sub, name, email, thumbnail: picture, provider_type: 'facebook',
            })
              .then(newUser => {
                // console.log("criou novo");
                done(null, newUser)
              })
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
        }
      }
      {
        const currentUser = await User.findOne({ where: { email } })
        //  User.findOne({ sub,email })//.then(res => done(null, res));

        if (currentUser) {
          console.log(currentUser)
          // if (currentUser.provider_type !== 'facebook') {
          //   return res.json({ message: `usuário existente com esse email usando outro login social`, provider_type: currentUser.provider_type })
          // }
          // console.log("já existe")
          return done(null, currentUser);
        }
        else {// create new user if the database doesn't have this user
          // if (!currentUser) {
          const newUser = await new User({
            user_id: sub, name, email, provider_type: 'facebook',
          }).save();
          // console.log("criou novo")

          if (newUser) {
            return done(null, newUser);
          }
        }
      }
      // }
    }
  )
);


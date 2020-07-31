// import 'dotenv/config';
import ids from '../../config/oauths.js'
import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";


const FacebookStrategy = strategy.Strategy;
import User from '../models/User';

dotenv.config();

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
  new FacebookStrategy(
    ids.facebook,

    function(accessToken, refreshToken, profile, done) {
      //Check the DB to find a User with the profile.id

      console.log(profile);
      User.findOne({where:{ user_id: profile.id })
      .then()
      .catch(err => {if(err) {
        console.log(err);  // handle errors!
      }}), function(err, user) {//See if a User already exists with the Facebook ID


        if (user) {
          done(null, user); //If User already exists login as stated on line 10 return User
        } else { //else create a new User
          user = new User({
            user_id: profile.id, //pass in the id and displayName params from Facebook
            name: profile.displayName
          });
          user.save(function(err) { //Save User if there are no errors else redirect to login route
            if(err) {
              console.log(err);  // handle errors!
            } else {
              console.log("saving user ...");
              done(null, user);
            }
          });
        }
      });
    }

    // function(accessToken, refreshToken, profile, done) {
    //   const { email, first_name, last_name } = profile._json;
    //   const userData = {
    //     email,
    //     firstName: first_name,
    //     lastName: last_name
    //   };
    //   console.log(userData);
    //   // new User(userData).save();
    //   done(null, profile);
    // }
  )
);

export default passport;

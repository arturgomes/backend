import 'dotenv/config';


import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const fbstrat = () => {
  console.log(process.env.FACEBOOK_APP_ID)
    return new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://www.example.com/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({user_id:profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      })
  };

module.exports = {fbstrat}

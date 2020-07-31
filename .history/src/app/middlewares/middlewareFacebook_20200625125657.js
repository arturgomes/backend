import 'dotenv/config';
import ids from '../../config/oauths'

import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const fbstrat = () => {
    return new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://couponfeed.co/auth/facebook/cb"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({user_id:profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      })
  };

module.exports = {fbstrat}

import 'dotenv/config';
import ids from '../../config/oauths.js'

import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const fbstrat = () => {
    return new FacebookStrategy(ids.facebook,
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({user_id:profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      })
  };

module.exports = {fbstrat}

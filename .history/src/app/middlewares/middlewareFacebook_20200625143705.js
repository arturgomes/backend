import 'dotenv/config';
import ids from '../../config/oauths.js'

import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const  fbstrat = async () => {
    return new FacebookStrategy(ids.facebook,
      function(accessToken, refreshToken, profile, done) {



        await User.findOrCreate({user_id:profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      })
  };

module.exports = {fbstrat}

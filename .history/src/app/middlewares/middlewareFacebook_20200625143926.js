import 'dotenv/config';
import ids from '../../config/oauths.js'

import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const fbstrat = async () => {
  return new FacebookStrategy(ids.facebook,
    function (accessToken, refreshToken, profile, done) {

      const count = User.count({ where: { user_id: profile.id } })
      if (count===0){
      await User.findOrCreate({ user_id: profile.id }, function (err, user) {
        if (err) { return done(err); }
        done(null, user);
      });}
    })
};

module.exports = { fbstrat }

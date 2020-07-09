import 'dotenv/config';
import ids from '../../config/oauths.js'

import User from '../models/User';
import GoogleStrategy from 'passport-google';

const gglstrat = async () => {
  return new GoogleStrategy(ids.facebook,
    function (accessToken, refreshToken, profile, done) {
      const count = User.count({ where: { user_id: profile.id } })
      if (count === 0) {
        await User.create({
          user_id: profile.id,
          name: profile.name,
          email: profile.email,
          provider_type: 'facebook'
        });
      }
    })
};

module.exports = { gglstrat }

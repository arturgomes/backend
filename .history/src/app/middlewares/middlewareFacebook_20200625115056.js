import User from '../models/User';
import FacebookStrategy from 'passport-facebook';

const fbstrat = () => {
    return new FacebookStrategy({
        clientID: proccess.env.FACEBOOK_APP_ID,
        clientSecret: proccess.env.FACEBOOK_APP_SECRET,
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

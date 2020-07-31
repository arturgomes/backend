import 'dotenv/config';


var ids = {
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
    profileFields: ['id', 'displayName', 'emails']

  },
  instagram: {
    clientID: '569000340445384',
    clientSecret: '81fa2e7e6dad9a481d6c4ffddd6e8122',
    callbackURL: 'https://api.couponfeed.co/auth/instagram/redirect',
  },
  google: {
    clientID: '972483590198-nmsj5n1demg8r3t971b1b0og11j54vf4.apps.googleusercontent.com',
    clientSecret: '-_bNa8UMX5EBtr9aNFa604Mt',
    callbackURL: 'https://api.couponfeed.co/auth/google/redirect',
    passReqToCallback: true,
  },
  // twitter: {
  //   consumerKey: 'get_your_own',
  //   consumerSecret: 'get_your_own',
  //   callbackURL: 'http://127.0.0.1:1337/auth/twitter/callback'
  // },
  // github: {
  //   clientID: 'get_your_own',
  //   clientSecret: 'get_your_own',
  //   callbackURL: 'http://127.0.0.1:1337/auth/github/callback'
  // },
};

module.exports = ids;

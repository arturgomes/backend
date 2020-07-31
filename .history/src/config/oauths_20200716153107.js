import 'dotenv/config';


var ids = {
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
    // callbackURL: 'http://localhost:3000/auth/facebook/redirect',
    // callbackURL: '/auth/facebook/redirect',
    profileFields: ['id', 'displayName', 'emails']

  },
  instagram: {
    clientID: '569000340445384',
    clientSecret: '81fa2e7e6dad9a481d6c4ffddd6e8122',
    callbackURL: 'https://api.couponfeed.co/auth/instagram/redirect',
  }
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
  // google: {
  //   clientID: 'get_your_own',
  //   clientSecret: 'get_your_own',
  //   callbackURL: 'http://127.0.0.1:1337/auth/google/callback'
  // },
};

module.exports = ids;

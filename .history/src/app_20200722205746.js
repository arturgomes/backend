import 'dotenv/config';

import express from 'express';
// import session from 'express-session';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import session from 'express-session';
import 'express-async-errors';
// import strategy from "passport-facebook";
// import Instagram from 'passport-instagram';
// import Google from 'passport-google';

// const FacebookStrategy = strategy.Strategy;
// const InstagramStrategy = Instagram.Strategy;
// const GoogleStrategy = Google.Strategy;

const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import User from './app/models/User';

import routes from './routes';
// import authRoutes from './authRoutes';
import sentryConfig from './config/sentry';
// import passport from './app/middlewares/middlewareFacebook'
import ids from './config/oauths';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // set up cors to allow us to accept requests from our client
    this.server.use(
      cors({
        origin: "http://localhost:3001", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
      })
    );
    // this.server.use(cors());

    this.server.use(Sentry.Handlers.requestHandler());
    // this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve('..', 'tmp', 'uploads'))
    );
    // this.server.use(session({
    //   secret: 'keyboard cat',
    //   resave: false,
    //   saveUninitialized: false,
    // }));

    // parse cookies
    this.server.use(cookieParser());
    this.server.use(
      cookieSession({
        name: "session",
        keys: ["thisappisawesome"],
        maxAge: 24 * 60 * 60 * 100
      })
    );


    this.server.use(passport.initialize());
    this.server.use(passport.session());
    passport.serializeUser((user, cb) => { cb(null, user.id) })
    passport.deserializeUser((id, cb) => {
      User.findByPk(id)
        .then(user => cb(null, obj))
        .catch(e => done(new Error(" failed to deserialize an user")))
    })

    /**
     * https://www.facebook.com/v3.2/dialog/oauth?
     *  response_type=code&
     *  redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Ffacebook%2Fredirect&
     *  scope=email%2Cname&
     *  client_id=307286726964664
     */

    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: 'https://api.couponfeed.co/auth/facebook/redirect',
          // callbackURL: 'http://localhost:3000/auth/facebook/redirect',
          profileFields: ['id', 'displayName', 'emails']

        },
        async (accessToken, refreshToken, profile, done) => {
          // console.log(profile);
          const newUser = {
            name: profile._json.name,
            email: profile._json.email,
            provider_type: 'facebook',
            user_id: profile.id.toString(),
            phone: null
          }

          try {
            let user = await User.findOne({ where: { email: profile._json.email } });
            if (user) {
              done(null, user);
            }
            else {
              user = await User.create(newUser);
              done(null, user)

            }
          }
          catch (err) { console.error(err) }
          // done(null,profile);
        }
        // {
        //   //Check the DB to find a User with the profile.id
        //   // console.log(accessToken);
        //   await User.findOrCreate({
        //     where: {
        //       name: profile._json.name,
        //       email: profile._json.email,
        //       provider_type: 'facebook',
        //       user_id: profile._json.id
        //     }
        //   }).then(currentUser => done(null, currentUser));
        // }
      ));

    // passport.use(
    //   new InstagramStrategy(
    //     {
    //       clientID: '569000340445384',
    //       clientSecret: '81fa2e7e6dad9a481d6c4ffddd6e8122',
    //       callbackURL: 'http://localhost:3000/auth/instagram/redirect',
    //     },
    //    async (accessToken, refreshToken, profile, done) =>
    //     {
    //       console.log(profile);
    //       const newUser = {
    //         name: profile._json.name,
    //         email: profile._json.email,
    //         provider_type: 'instagram',
    //         user_id: profile.id.toString(),
    //         phone:null
    //       }

    //         try{
    //           let user = await User.findOne({where:{email:profile._json.email}});
    //           if(user){
    //             done(null,user);
    //           }
    //           else{
    //             user = await User.create(newUser);
    //             done(null,user)

    //           }
    //         }
    //         catch (err) { console.error(err)}
    //       // done(null,profile);
    //     }
    //     // {
    //     //   console.log(profile);

    //     //   process.nextTick(async () => {
    //     //     const currentUser = await User.findOne({
    //     //       where: {
    //     //         name: profile._json.name,
    //     //         email: profile._json.email,
    //     //         provider_type: 'instagram',
    //     //         user_id: profile._json.id
    //     //       }
    //     //     })
    //     //     if (currentUser) { done(null, currentUser) }
    //     //     const newUser = await User.create({
    //     //       name: profile._json.name,
    //     //       email: profile._json.email,
    //     //       provider_type: 'instagram',
    //     //       user_id: profile._json.id
    //     //     })
    //     //   }
    //     //   );

    //     //   // To keep the example simple, the user's Instagram profile is returned to
    //     //   // represent the logged-in user.  In a typical application, you would want
    //     //   // to associate the Instagram account with a user record in your database,
    //     //   // and return that user instead.
    //     //   console.log(profile)

    //     //   return done(null, profile);
    //     // }
    //     ));

    passport.use(
      new GoogleStrategy(
        {
          clientID: '972483590198-nmsj5n1demg8r3t971b1b0og11j54vf4.apps.googleusercontent.com',
          clientSecret: '-_bNa8UMX5EBtr9aNFa604Mt',
          callbackURL: 'https://api.couponfeed.co/auth/google/redirect',
          // callbackURL: 'http://localhost:3000/auth/google/redirect',
        },
        async (accessToken, refreshToken, profile, done) => {
          // console.log(profile);
          const newUser = {
            name: profile._json.name,
            email: profile._json.email,
            provider_type: 'google',
            user_id: profile.id.toString(),
            phone: null
          }

          try {
            let user = await User.findOne({ where: { email: profile._json.email } });
            if (user) {
              done(null, user);
            }
            else {
              user = await User.create(newUser);
              done(null, user)

            }
          }
          catch (err) { console.error(err) }
          // done(null,profile);
        }
        //  const {err, currentUser} = await User.findOne({ user_id: profile.id })
        //   // .then((err, user) => {
        //   if(err) {
        //     console.log(err);  // handle errors!
        //   }
        //   if (!err && currentUser !== null) {
        //     done(null, currentUser);
        //   } else {
        //     const newUser = await User.create({
        //       name: profile._json.name,
        //       email: profile._json.email,
        //       provider_type: 'instagram',
        //       user_id: profile._json.id
        //     });

        //     // user.save(function(err) {
        //     //   if(err) {
        //     //     console.log(err);  // handle errors!
        //     //   } else {
        //         console.log("saving user ...");
        //         done(null, newUser);
        //     //   }
        //     // });
        //   }
        // // }
        // // )
      ));



    //Check the DB to find a User with the profile.id
    // console.log(accessToken);
    // console.log(profile)
    // const currentuser = await User.findOne({
    //   where: {
    //     name: profile._json.name,
    //     email: profile._json.email,
    //     provider_type: 'facebook',
    //     user_id: profile._json.id
    //   }
    // });
    // if (!currentuser) {
    //   const newUser = new User({
    //     user_id: profile._json.id, //pass in the id and displayName params from Facebook
    //     name: profile._json.name,
    //     email: profile._json.email,
    //     provider_type: profile.provider
    //   })

    //   if (newUser) {
    //     done(null, newUser);
    //   }
    // }
    // done(null, currentUser); //If User already exists login as stated on line 10 return User
  }


  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal server error');
    });
  }
}

export default new App().server;

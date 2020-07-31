import 'dotenv/config';

import express from 'express';
// import session from 'express-session';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
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
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

// import cookieSession from 'cookie-session';
// import cookieParser from 'cookie-parser';

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

    this.server.use(passport.initialize());
    this.server.use(passport.session());
    passport.serializeUser((user, cb) => { cb(null, user) })
    passport.deserializeUser((obj, cb) => { cb(null, obj) })

    passport.use(
      new FacebookStrategy(
        ids.facebook,
        async (accessToken, refreshToken, profile, done) => {
          //Check the DB to find a User with the profile.id
          // console.log(accessToken);
          await User.findOrCreate({
            where: {
              name: profile._json.name,
              email: profile._json.email,
              provider_type: 'facebook',
              user_id: profile._json.id
            }
          }).then(currentUser => done(null, currentUser));
          // if (!currentUser) {
          //   const newUser = new User({
          //     user_id: profile._json.id, //pass in the id and displayName params from Facebook
          //     name: profile._json.name,
          //     email: profile._json.email,
          //     provider_type: profile.provider
          //   }).save();

          //   if (newUser) {
          //     done(null, newUser);
          //   }
          // }
          // done(null, currentUser); //If User already exists login as stated on line 10 return User
        }
      ));

    passport.use(
      new InstagramStrategy(
        ids.instagram,
        async (accessToken, refreshToken, profile, done) => {
          process.nextTick(function () {
            const currentUser = await User.findOne({
              where: {
                name: profile._json.name,
                email: profile._json.email,
                provider_type: 'instagram',
                user_id: profile._json.id
              }
            })
            if (currentUser) { done(null, currentUser) }
            const newUser = await User.create({
              name: profile._json.name,
              email: profile._json.email,
              provider_type: 'instagram',
              user_id: profile._json.id
            })
          }
          );

          // To keep the example simple, the user's Instagram profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Instagram account with a user record in your database,
          // and return that user instead.
          console.log(profile)

          return done(null, profile);
        }));

    passport.use(
      new GoogleStrategy(
        ids.google,
        function (request, accessToken, refreshToken, profile, done){
        console.log(profile)

        process.nextTick(function () {
          const currentUser = await User.findOne({
            where: {
              name: profile._json.name,
              email: profile._json.email,
              provider_type: 'instagram',
              user_id: profile._json.id
            }
          })
          if (currentUser) { return done(null, currentUser) }
          const newUser = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            provider_type: 'instagram',
            user_id: profile._json.id
          })
          return done(null, newUser)
        }
        );

        // To keep the example simple, the user's Instagram profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Instagram account with a user record in your database,
        // and return that user instead.

        // return done(null, profile);
      })
      )
    );



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

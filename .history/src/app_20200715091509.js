import 'dotenv/config';

import express from 'express';
// import session from 'express-session';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import strategy from "passport-facebook";


const FacebookStrategy = strategy.Strategy;
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
    passport.serializeUser((user,cb) =>{ cb(null,user) })
    passport.deserializeUser((obj,cb) =>{ cb(null,obj) })

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
      }).then(currentUser => done(null,currentUser));
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
    // passport.use(new FacebookStrategy(ids.facebook,
    //   function(accessToken, refreshToken, profile, cb)
    //   {
    //     return cb(null,profile)
    //   }
    //   )
    // );
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

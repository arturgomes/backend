import 'dotenv/config';

import express from 'express';
// import session from 'express-session';
import path from 'path';
import cors from 'cors';
// import passport from 'passport';
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
import User from './app/models/User';

import routes from './routes';
// import authRoutes from './authRoutes';
import sentryConfig from './config/sentry';
import passport from './app/middlewares/socialAuth'
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
    this.server.use(passport);


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
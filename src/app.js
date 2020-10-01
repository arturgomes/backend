import dotenv from 'dotenv'


import express from 'express';
// import session from 'express-session';
import redis from 'redis';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import proxy from 'express-http-proxy';
import session from 'express-session';
import cookieParser from 'cookie-parser';
var RedisStore = require('connect-redis')(session);
import User from './app/models/User.js';


import routes from './routes.js';
// import authRoutes from './authRoutes';
import sentryConfig from './config/sentry.js';
import passportSocial from './config/passport-setup.js';
import './database/index.js';

const redisClient = redis.createClient();

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {

    this.server.use(cookieParser());

    this.server.use(session({
      secret: 'Super Secret Password',
      proxy: true,
      resave: true,
saveUninitialized: true,
      key: 'session.sid',
      cookie: { secure: true },
      //NEVER use in-memory store for production - I'm using redis here
      store: new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient, ttl: 86400 }),
    }));


    // initalize passport
    this.server.use(passport.initialize());
    // deserialize cookie from the browser
    this.server.use(passport.session());
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve('..', 'tmp', 'uploads'))
    );

    this.server.use(cors({
      origin: "https://www.couponfeed.com.br",
      credentials: true
    }))
    this.server.options("*", cors());

  }

  routes() {

    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      // if (process.env.NODE_ENV === 'development') {
      const errors = await new Youch(err, req).toJSON();
      return res.status(500).json(errors);
      //   }
      //   else {
      //     return res.status(500).json({messsage:'Internal server error', error: err});
      // }
    }
    );
  }
}

export default new App().server;

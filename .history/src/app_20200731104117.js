import 'dotenv/config';

import express from 'express';
// import session from 'express-session';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import User from './app/models/User';

import routes from './routes';
// import authRoutes from './authRoutes';
import sentryConfig from './config/sentry';
import './config/passport-setup';
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

    // parse cookies
    this.server.use(cookieParser());
    this.server.use(
      cookieSession({
        name: "session",
        keys: [process.env.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
      })
    );
    this.server.use(
      // cors(
      //   {
      //     origin: "https://couponfeed.co", // allow to server to accept request from different origin
      //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      //     credentials: true // allow session cookie from browser to pass through
      //   }
      // )
      (req,res,next) =>{
        // res.header("Access-Control-Allow-Origin","http://localhost:3001/");

        // res.header("Access-Control-Allow-Headers",
        // "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        // console.log(res.headers);
        // if(req.method === 'OPTIONS'){
        //   res.header('Access-Control-Allow-Credentials','true');
        //   res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE, GET");
        //   return res.status(200).json({});
        // }
        if(req.method === 'OPTIONS'){

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // #
        // # Custom headers and headers various browsers *should* be OK with but aren't
        // #
        res.header('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
        // #
        // # Tell client that this pre-flight info is valid for 20 days
        // #
        res.header('Access-Control-Max-Age', 1728000);
        res.header('Content-Type', 'text/plain; charset=utf-8');
        res.header('Content-Length', 0);
        }
        next();
      }
    );
    // initalize passport
    this.server.use(passport.initialize());
    // deserialize cookie from the browser
    this.server.use(passport.session());
    // set up cors to allow us to accept requests from our client




    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve('..', 'tmp', 'uploads'))
    );

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

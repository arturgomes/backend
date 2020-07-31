import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';
import { fbstrat } from './app/middlewares/middlewareFacebook'
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
    this.server.use(cors());
    this.server.use(Sentry.Handlers.requestHandler());
    // this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve('..', 'tmp', 'uploads'))
    );
    // passport.use(fbstrat());
    this.server.use(passport.initialize());
    this.server.use(passport.session());
    this.server.use(passport.serializeUser((user, done) => {
      done(null, user.id);
    }));
    this.server.use(passport.deserializeUser((id, done) => {
      User.findById(id)
        .then(user => {
          done(null, user);
        })
        .catch(e => {
          done(new Error("Failed to deserialize an user"));
        });
    }));
    this.server.use(passport.use(
      new FacebookStrategy(
        ids.facebook,

        function(accessToken, refreshToken, profile, done) {
          //Check the DB to find a User with the profile.id
          User.findOne({ user_id: profile.id }, function(err, user) {//See if a User already exists with the Facebook ID
            if(err) {
              console.log(err);  // handle errors!
            }

            if (user) {
              done(null, user); //If User already exists login as stated on line 10 return User
            } else { //else create a new User
              user = new User({
                user_id: profile.id, //pass in the id and displayName params from Facebook
                name: profile.displayName
              });
              user.save(function(err) { //Save User if there are no errors else redirect to login route
                if(err) {
                  console.log(err);  // handle errors!
                } else {
                  console.log("saving user ...");
                  done(null, user);
                }
              });
            }
          });
        }

        // function(accessToken, refreshToken, profile, done) {
        //   const { email, first_name, last_name } = profile._json;
        //   const userData = {
        //     email,
        //     firstName: first_name,
        //     lastName: last_name
        //   };
        //   console.log(userData);
        //   // new User(userData).save();
        //   done(null, profile);
        // }
      )
    ));
    // this.server.use(fbstrat);

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

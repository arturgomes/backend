
import { Router } from 'express';
import passport from 'passport';
import Valid from 'validator';
import Feedback from './app/models/Feedback.js';


import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from './config/auth.js';
// import User from '../models/User';
const routes = new Router();

routes.post('/success', async (req, res) => {

  if (req.session.retail === 'true') {
    const { id, name } = req.user;
    const tk = jwt.sign({ id }, process.env.APP_SECRET, {
      expiresIn: '7d', // expires in 5min
    });
    const response = {
      success: true,
      message: 'retail has successfully authenticated',
      // user: req.user,
      login: {
        id,
        name,
        // email,
        tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
      },
      cookies: req.cookies,
      token: tk,
    };
    return res.status(200).json(response);
  } else if (req.session.retail !== 'true') {
    const { id, name } = req.user;
    const tk = jwt.sign({ id }, process.env.APP_SECRET, {
      expiresIn: '7d', // expires in 5min
    });
    console.log(req.body.fid);

    if (req.body.fid && Valid.isUUID(req.body.fid)) {
      await Feedback.findOne({
        id: req.body.fid,
      })
        .then(feed => {
          if (feed.user_id) {
            return res
              .status(400)
              .json({ error: Error.feedback_already_stored });
          }
          feed.update({
            user_id: id,
          });
          return res.json({ message: 'OK' });
        })
        .catch(() => { });


    }
    const response = {
      success: true,
      message: 'user has successfully authenticated',
      login: {
        id,
        name,
        // email,
        tu: '897316929176464ebc9ad085f31e7284',
      },
      cookies: req.cookies,
      token: tk,
    };
    return res.status(200).json(response);
  }
  return res.status(200).json({ message: 'not authenticated' });
});


// routes.get('/success', async (req, res) => {

//   if (req.session.retail === 'true') {
//     const { id, name } = req.user;
//     const tk = jwt.sign({ id }, process.env.APP_SECRET, {
//       expiresIn: '7d', // expires in 5min
//     });
//     const response = {
//       success: true,
//       message: 'retail has successfully authenticated',
//       // user: req.user,
//       login: {
//         id,
//         name,
//         // email,
//         tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
//       },
//       cookies: req.cookies,
//       token: tk,
//     };
//     return res.status(200).json(response);
//   } else if (req.session.retail !== 'true') {
//     const { id, name } = req.user;
//     const tk = jwt.sign({ id }, process.env.APP_SECRET, {
//       expiresIn: '7d', // expires in 5min
//     });

//     const response = {
//       success: true,
//       message: 'user has successfully authenticated',
//       login: {
//         id,
//         name,
//         // email,
//         tu: '897316929176464ebc9ad085f31e7284',
//       },
//       cookies: req.cookies,
//       token: tk,
//     };
//     return res.status(200).json(response);
//   }
//   return res.status(200).json({ message: 'not authenticated' });
// });



routes.get('/error', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user failed to authenticate.',
  });
});

//Google auth

routes.get('/google', (req, res, next) => {
  req.session.retail = 'false';

  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });
  authenticator(req, res, next);
});



routes.get('/google/retail',
  (req, res, next) => {
    req.session.retail = 'true';
    const authenticator = passport.authenticate('google', {
      scope: ['profile', 'email'],
    });
    authenticator(req, res, next);
  });

routes.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: 'https://www.couponfeed.com.br/social',
    failureRedirect: '/auth/error',
  })
);

//facebook auth
routes.get(
  '/facebook/',
  (req, res, next) => {
    req.session.retail = 'false';
    const authenticator = passport.authenticate('facebook', { scope: ['email', 'public_profile'] });
    authenticator(req, res, next);
  }
);
routes.get('/facebook/retail', function (req, res, next) {
  req.session.retail = 'true';
  const authenticator = passport.authenticate('facebook', { scope: ['email', 'public_profile'] });
  authenticator(req, res, next);
});
routes.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {
    successRedirect: 'https://www.couponfeed.com.br/social',
    failureRedirect: '/auth/error',
  })
);

// When logout, redirect to client
routes.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});
export default routes;

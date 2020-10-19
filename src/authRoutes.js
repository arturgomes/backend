/**
 * Ja de cara identifiquei que ta dando erro no JWT ao
 * passar o token. Dá falha 500 e eu num consigo saber pq
 */

import { Router } from 'express';
import passport from 'passport';

import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from './config/auth.js';
// import User from '../models/User';
const routes = new Router();

routes.get('/success', (req, res) => {
  // console.log("entrou no /success")
  // console.log(req.session.retail);
  console.log(req.user.id);

  if (req.session.retail === 'true') {
    // console.log(req.user);
    const { id, name } = req.user;
    // console.log(req.user);
    // const tk = jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn, });
    const tk = jwt.sign({ id }, process.env.APP_SECRET, {
      expiresIn: '7d', // expires in 5min
    });
    // console.log(tk);
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
    // console.log({ resp: response })
    return res.status(200).json(response);
  } else if (req.session.retail !== 'true') {
    // console.log(req.user);
    const { id, name } = req.user;
    // console.log(req.user);
    const tk = jwt.sign({ id }, process.env.APP_SECRET, {
      expiresIn: '7d', // expires in 5min
    });
    // const tk = jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn, });

    // console.log(tk);
    const response = {
      success: true,
      message: 'user has successfully authenticated',
      // user: req.user,
      login: {
        id,
        name,
        // email,
        tu: '897316929176464ebc9ad085f31e7284',
      },
      cookies: req.cookies,
      token: tk,
    };
    // console.log({ resp: response })
    return res.status(200).json(response);
  }
  // console.log(res.headers);
  return res.status(200).json({ message: 'not authenticated' });
});

routes.get('/error', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user failed to authenticate.',
  });
});

//Google auth

// routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
routes.get('/google', (req, res, next) => {
  req.session.retail = 'false';
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });
  authenticator(req, res, next);
});

routes.get('/google/retail', (req, res, next) => {
  req.session.retail = 'true';
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });
  authenticator(req, res, next);
});

routes.get(
  '/google/redirect',
  () => console.log('auth google'),

  passport.authenticate('google', {
    successRedirect: 'https://www.couponfeed.com.br/social',
    failureRedirect: '/auth/error',
  })
);

//facebook auth
routes.get(
  '/facebook',

  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);
routes.get('/facebook/retail', function (req, res, next) {
  req.retail = true;
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })(
    req,
    res,
    next
  );
});
routes.get(
  '/facebook/redirect',
  () => console.log('auth face'),
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

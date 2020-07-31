import { Router } from 'express';
import passport from "passport";

import jwt from 'jsonwebtoken';
// import * as Yup from 'yup';

import authConfig from './config/auth';
// import User from '../models/User';

const routes = new Router();

routes.get('/success', (req, res) => {
  console.log(req.user);
  const {id,name} = req.user;
  return res.status(200).json({
    success: true,
    message: "user has successfully authenticated",
    login: {
      id, //pass in the id and displayName params from Facebook
      name,
      tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
    },
    cookies: req.cookies,
    token: jwt.sign({ id:req.user.user_id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    }),
  })

  // res.status(200).json({ message: "successfully logged in" })
}
);
routes.get('/error', (req, res) => res.status(401).json({ message: "error logging in" }));

//Google auth
routes.get('/google', passport.authenticate('google' , { scope: [ 'profile','email' ] }
));
routes.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  (req,res) => {
    // console.log(req.user.dataValues.email);
    // SocialSessionController.store();
    res.redirect('https://couponfeed.co/validate')
    // res.redirect('/auth/success')
  }
  );



//facebook auth
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  (req,res) => {
    // SocialSessionController.store();
    // res.redirect('/auth/success')
    res.redirect('https://couponfeed.co/validate')


  }
  );

module.exports = routes;

import { Router } from 'express';
import passport from "passport";

import jwt from 'jsonwebtoken';
// import * as Yup from 'yup';

import authConfig from './config/auth';
// import User from '../models/User';
const routes = new Router();

routes.get('/success', (req, res) => {
  console.log("entrou no /success")
  console.log(req);
  if (req.user) {
    // console.log(req.user);
    const { id, name } = req.user;
    console.log(req.user);
    const response = {
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      login: {
        id,
        name,
        // email,
        tu: '897316929176464ebc9ad085f31e7284',
      },
      cookies: req.cookies,
      token: jwt.sign({ id: req.user.user_id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
    console.log({resp: response})
    return res.status(200).json(response);
  }
  console.log(res.headers);
  return res.status(200).json({message:"not authenticated"});
}
);
// when login is successful, retrieve user info
// routes.get("/success", (req, res) => {
//   if (req.user) {
//     return res.json({
//       success: true,
//       message: "user has successfully authenticated",
//       user: req.user,
//       cookies: req.cookies
//     });
//   }
// });

routes.get('/error', (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

//Google auth
routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
routes.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "https://www.couponfeed.co/login",
    failureRedirect: "/auth/error"
  })
);


//facebook auth
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/redirect',
  passport.authenticate('facebook', {
    successRedirect: "https://www.couponfeed.co/login",
    failureRedirect: "/auth/error"
  })
);

// When logout, redirect to client
routes.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});
export default routes;

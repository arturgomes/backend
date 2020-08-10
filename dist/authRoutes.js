"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _passport = require('passport'); var _passport2 = _interopRequireDefault(_passport);

var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
// import * as Yup from 'yup';

var _auth = require('./config/auth'); var _auth2 = _interopRequireDefault(_auth);
// import User from '../models/User';
const routes = new (0, _express.Router)();

routes.get('/success', (req, res) => {
  if (req.user) {
    console.log(req.user);
    const { id, name } = req.user;
    return res.status(200).json({
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
      token: _jsonwebtoken2.default.sign({ id: req.user.user_id }, _auth2.default.secret, {
        expiresIn: _auth2.default.expiresIn,
      }),
    })
  }
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
routes.get('/google', _passport2.default.authenticate('google', { scope: ['profile', 'email'] }));
routes.get(
  "/google/redirect",
  _passport2.default.authenticate("google", {
    // successRedirect: process.env.CLIENT_HOME_PAGE_URL,
    successRedirect: "https://couponfeed.co/login",
    // successRedirect: "https://localhost:3001/login",
    failureRedirect: "/auth/error"
  })
);


//facebook auth
routes.get('/facebook', _passport2.default.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/redirect',
  _passport2.default.authenticate('facebook', {
    successRedirect: process.env.CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/error"
  })
);

// When logout, redirect to client
routes.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});
exports. default = routes;

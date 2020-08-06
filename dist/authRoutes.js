"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _passport = _interopRequireDefault(require("passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _auth = _interopRequireDefault(require("./config/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as Yup from 'yup';
// import User from '../models/User';
const routes = new _express.Router();
routes.get('/success', (req, res) => {
  if (req.user) {
    console.log(req.user);
    const {
      id,
      name
    } = req.user;
    return res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      login: {
        id,
        name,
        // email,
        tu: '897316929176464ebc9ad085f31e7284'
      },
      cookies: req.cookies,
      token: _jsonwebtoken.default.sign({
        id: req.user.user_id
      }, _auth.default.secret, {
        expiresIn: _auth.default.expiresIn
      })
    });
  }
}); // when login is successful, retrieve user info
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
}); //Google auth

routes.get('/google', _passport.default.authenticate('google', {
  scope: ['profile', 'email']
}));
routes.get("/google/redirect", _passport.default.authenticate("google", {
  // successRedirect: process.env.CLIENT_HOME_PAGE_URL,
  successRedirect: "https://couponfeed.co/login",
  // successRedirect: "https://localhost:3001/login",
  failureRedirect: "/auth/error"
})); //facebook auth

routes.get('/facebook', _passport.default.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));
routes.get('/facebook/redirect', _passport.default.authenticate('facebook', {
  successRedirect: process.env.CLIENT_HOME_PAGE_URL,
  failureRedirect: "/auth/error"
})); // When logout, redirect to client

routes.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(process.env.CLIENT_HOME_PAGE_URL);
});
var _default = routes;
exports.default = _default;
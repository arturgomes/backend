"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _passport = _interopRequireDefault(require("passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _multer2 = _interopRequireDefault(require("./config/multer"));

var _ManFeedController = _interopRequireDefault(require("./app/controllers/ManFeedController"));

var _UserController = _interopRequireDefault(require("./app/controllers/UserController"));

var _CouponController = _interopRequireDefault(require("./app/controllers/CouponController"));

var _ShopController = _interopRequireDefault(require("./app/controllers/ShopController"));

var _AllShopsController = _interopRequireDefault(require("./app/controllers/AllShopsController"));

var _SessionController = _interopRequireDefault(require("./app/controllers/SessionController"));

var _FileController = _interopRequireDefault(require("./app/controllers/FileController"));

var _CustomerFileController = _interopRequireDefault(require("./app/controllers/CustomerFileController"));

var _FeedbackController = _interopRequireDefault(require("./app/controllers/FeedbackController"));

var _DashboardController = _interopRequireDefault(require("./app/controllers/DashboardController"));

var _CustomerDashboardController = _interopRequireDefault(require("./app/controllers/CustomerDashboardController"));

var _DisplayFeedbackController = _interopRequireDefault(require("./app/controllers/DisplayFeedbackController"));

var _RetailController = _interopRequireDefault(require("./app/controllers/RetailController"));

var _QrController = _interopRequireDefault(require("./app/controllers/QrController"));

var _ShortnerController = _interopRequireDefault(require("./app/controllers/ShortnerController"));

var _auth = _interopRequireDefault(require("./app/middlewares/auth"));

var _authRoutes = _interopRequireDefault(require("./authRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import enableCors from './app/middlewares/enableCors';
const routes = new _express.Router();
const upload = (0, _multer.default)(_multer2.default); // const authCheck = (req, res, next) => {
//   if (!req.user) {
//     res.status(200).json({
//       authenticated: false,
//       message: "user has not been authenticated"
//     });
//   } else {
//     next();
//   }
// };

/*
routes.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://couponfeed.co/");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

routes.use('/auth', _authRoutes.default);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
}; // if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page


routes.get('/', authCheck, (req, res) => res.redirect('https://couponfeed.co')); // routes.get('/', authCheck, (req, res) => {
//   res.status(200).json({
//     authenticated: true,
//     message: "user successfully authenticated",
//     login: {
//       user_id: req.user.user_id, //pass in the id and displayName params from Facebook
//       name: req.user.name,
//       email: req.user.email,
//       tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
//     },
//     cookies: req.cookies
//   });
// });

routes.post('/users', _UserController.default.store);
routes.post('/users/i', _ManFeedController.default.store);
routes.post('/users/s', _ManFeedController.default.index);
routes.post('/retails', _RetailController.default.store);
routes.post('/feed/:shop_id/f', _FeedbackController.default.index);
routes.post('/feed/:shop_id/c', _FeedbackController.default.store);
routes.post('/surl/:short_url', _ShortnerController.default.index);
routes.post('/sessions', _SessionController.default.store);
routes.use(_auth.default);
routes.post('/files', upload.single('file'), _FileController.default.store);
routes.post('/files/:retail_id', _FileController.default.index);
routes.delete('/files/:id', _FileController.default.delete);
routes.post('/filesc', upload.single('file'), _CustomerFileController.default.store);
routes.post('/filesc/:user_id', _CustomerFileController.default.index);
routes.delete('/filesc/:id', _CustomerFileController.default.delete);
routes.post('/dashboardDataC', _CustomerDashboardController.default.index);
routes.post('/dashboardData', _auth.default, _DashboardController.default.index);
routes.post('/list', _auth.default, _DisplayFeedbackController.default.index);
routes.post('/coupons-l/:retail_id', _auth.default, _CouponController.default.index);
routes.post('/coupons-s', _auth.default, _CouponController.default.store);
routes.post('/allshops', _auth.default, _AllShopsController.default.index);
routes.post('/shops', _auth.default, _ShopController.default.store);
routes.post('/shopsl', _auth.default, _ShopController.default.index);
routes.post('/qr', _auth.default, _QrController.default.index); // routes.post('/files', upload.single('file'), FileController.store);

var _default = routes;
exports.default = _default;
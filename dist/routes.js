"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _passport = require('passport'); var _passport2 = _interopRequireDefault(_passport);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

var _ManFeedController = require('./app/controllers/ManFeedController'); var _ManFeedController2 = _interopRequireDefault(_ManFeedController);
var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _CouponController = require('./app/controllers/CouponController'); var _CouponController2 = _interopRequireDefault(_CouponController);
var _ShopController = require('./app/controllers/ShopController'); var _ShopController2 = _interopRequireDefault(_ShopController);
var _AllShopsController = require('./app/controllers/AllShopsController'); var _AllShopsController2 = _interopRequireDefault(_AllShopsController);
var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);
var _FileController = require('./app/controllers/FileController'); var _FileController2 = _interopRequireDefault(_FileController);
var _CustomerFileController = require('./app/controllers/CustomerFileController'); var _CustomerFileController2 = _interopRequireDefault(_CustomerFileController);
var _FeedbackController = require('./app/controllers/FeedbackController'); var _FeedbackController2 = _interopRequireDefault(_FeedbackController);
var _DashboardController = require('./app/controllers/DashboardController'); var _DashboardController2 = _interopRequireDefault(_DashboardController);
var _CustomerDashboardController = require('./app/controllers/CustomerDashboardController'); var _CustomerDashboardController2 = _interopRequireDefault(_CustomerDashboardController);
var _DisplayFeedbackController = require('./app/controllers/DisplayFeedbackController'); var _DisplayFeedbackController2 = _interopRequireDefault(_DisplayFeedbackController);
var _RetailController = require('./app/controllers/RetailController'); var _RetailController2 = _interopRequireDefault(_RetailController);
var _QrController = require('./app/controllers/QrController'); var _QrController2 = _interopRequireDefault(_QrController);
var _ShortnerController = require('./app/controllers/ShortnerController'); var _ShortnerController2 = _interopRequireDefault(_ShortnerController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
// import enableCors from './app/middlewares/enableCors';
var _authRoutes = require('./authRoutes'); var _authRoutes2 = _interopRequireDefault(_authRoutes);

const routes = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multer4.default);
// const authCheck = (req, res, next) => {
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

routes.use('/auth',_authRoutes2.default);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page

routes.get('/', authCheck,(req, res) => res.redirect('https://couponfeed.co'));
// routes.get('/', authCheck, (req, res) => {
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

routes.post('/users', _UserController2.default.store);
routes.post('/users/i', _ManFeedController2.default.store);
routes.post('/users/s', _ManFeedController2.default.index);

routes.post('/retails', _RetailController2.default.store);

routes.post('/feed/:shop_id/f', _FeedbackController2.default.index);
routes.post('/feed/:shop_id/c', _FeedbackController2.default.store);
routes.post('/surl/:short_url', _ShortnerController2.default.index);


routes.post('/sessions', _SessionController2.default.store);

routes.use(_auth2.default);

routes.post('/files', upload.single('file'), _FileController2.default.store);
routes.post('/files/:retail_id', _FileController2.default.index);
routes.delete('/files/:id', _FileController2.default.delete);

routes.post('/filesc', upload.single('file'), _CustomerFileController2.default.store);
routes.post('/filesc/:user_id', _CustomerFileController2.default.index);
routes.delete('/filesc/:id', _CustomerFileController2.default.delete);

routes.post('/dashboardDataC', _CustomerDashboardController2.default.index);

routes.post('/dashboardData', _auth2.default, _DashboardController2.default.index);

routes.post('/list', _auth2.default, _DisplayFeedbackController2.default.index);

routes.post('/coupons-l/:retail_id', _auth2.default, _CouponController2.default.index);
routes.post('/coupons-s', _auth2.default, _CouponController2.default.store);

routes.post('/allshops', _auth2.default, _AllShopsController2.default.index);

routes.post('/shops', _auth2.default, _ShopController2.default.store);
routes.post('/shopsl', _auth2.default, _ShopController2.default.index);

routes.post('/qr', _auth2.default, _QrController2.default.index);

// routes.post('/files', upload.single('file'), FileController.store);
exports. default = routes;

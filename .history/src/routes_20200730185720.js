import { Router } from 'express';
import multer from 'multer';
import passport from "passport";
import jwt from 'jsonwebtoken';

import multerConfig from './config/multer';

import ManFeedController from './app/controllers/ManFeedController';
import UserController from './app/controllers/UserController';
import CouponController from './app/controllers/CouponController';
import ShopController from './app/controllers/ShopController';
import AllShopsController from './app/controllers/AllShopsController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import CustomerFileController from './app/controllers/CustomerFileController';
import FeedbackController from './app/controllers/FeedbackController';
import DashboardController from './app/controllers/DashboardController';
import CustomerDashboardController from './app/controllers/CustomerDashboardController';
import DisplayFeedbackController from './app/controllers/DisplayFeedbackController';
import RetailController from './app/controllers/RetailController';
import QrController from './app/controllers/QrController';
import ShortnerController from './app/controllers/ShortnerController';

import authMiddleware from './app/middlewares/auth';
// import enableCors from './app/middlewares/enableCors';
import authRoutes from './authRoutes'

const routes = new Router();
const upload = multer(multerConfig);
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

routes.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://couponfeed.co");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

routes.use('/auth',authRoutes);

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

routes.post('/users', UserController.store);
routes.post('/users/i', ManFeedController.store);
routes.post('/users/s', ManFeedController.index);

routes.post('/retails', RetailController.store);

routes.post('/feed/:shop_id/f', FeedbackController.index);
routes.post('/feed/:shop_id/c', FeedbackController.store);
routes.post('/surl/:short_url', ShortnerController.index);


routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/files/:retail_id', FileController.index);
routes.delete('/files/:id', FileController.delete);

routes.post('/filesc', upload.single('file'), CustomerFileController.store);
routes.post('/filesc/:user_id', CustomerFileController.index);
routes.delete('/filesc/:id', CustomerFileController.delete);

routes.post('/dashboardDataC', CustomerDashboardController.index);

routes.post('/dashboardData', authMiddleware, DashboardController.index);

routes.post('/list', authMiddleware, DisplayFeedbackController.index);

routes.post('/coupons-l/:retail_id', authMiddleware, CouponController.index);
routes.post('/coupons-s', authMiddleware, CouponController.store);

routes.post('/allshops', authMiddleware, AllShopsController.index);

routes.post('/shops', authMiddleware, ShopController.store);
routes.post('/shopsl', authMiddleware, ShopController.index);

routes.post('/qr', authMiddleware, QrController.index);

// routes.post('/files', upload.single('file'), FileController.store);
export default routes;

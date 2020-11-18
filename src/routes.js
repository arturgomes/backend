import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import multerConfig from './config/multer.js';

import AllShopsController from './app/controllers/AllShopsController.js';
import CouponController from './app/controllers/CouponController.js';
import CustomerFileController from './app/controllers/CustomerFileController.js';
import CustomerDashboardController from './app/controllers/CustomerDashboardController.js';
import DashboardController from './app/controllers/DashboardController.js';
import DisplayFeedbackController from './app/controllers/DisplayFeedbackController.js';
import FeedbackController from './app/controllers/FeedbackController.js';
import FileController from './app/controllers/FileController.js';
import ManFeedController from './app/controllers/ManFeedController.js';
import QrController from './app/controllers/QrController.js';
import RetailController from './app/controllers/RetailController.js';
import SessionController from './app/controllers/SessionController.js';
import SessionRetailController from './app/controllers/SessionRetailController.js';
import ShopController from './app/controllers/ShopController.js';
import ShortnerController from './app/controllers/ShortnerController.js';
import UpdateFeedbackController from './app/controllers/UpdateFeedbackController.js';
import UserController from './app/controllers/UserController.js';
import authMiddleware from './app/middlewares/auth.js';
// import enableCors from './app/middlewares/enableCors';
import authRoutes from './authRoutes.js';

const routes = new Router();
const upload = multer(multerConfig);

// const showHeaders = (req, res, next) => {
//   console.log(req.headers);
//   next();
// };

// routes.use('/post', postsRoutes);
// routes.use(showHeaders)

routes.use('/auth', authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'user has not been authenticated',
    });
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page

routes.get('/', (req, res) => res.redirect('https://www.couponfeed.com.br'));

routes.post('/users', UserController.store);
routes.post('/users/i', ManFeedController.store);
routes.post('/users/s', ManFeedController.index);

routes.post('/retails', RetailController.store);

routes.post('/feed/:shop_id/f', FeedbackController.index);
routes.post('/feed/:shop_id/c', FeedbackController.store);
routes.post('/surl/:short_url', ShortnerController.index);

routes.post('/sessions', SessionController.store);
routes.post('/rsessions', SessionRetailController.store);

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

routes.post('/coupons/l/:retail_id', authMiddleware, CouponController.index);
routes.post('/coupons/s', authMiddleware, CouponController.store);
routes.post('/coupons/d', authMiddleware, CouponController.delete);


routes.post('/shops', authMiddleware, ShopController.store);
routes.post('/shops/d', authMiddleware, ShopController.delete);
routes.post('/shops/p', authMiddleware, ShopController.index);
routes.post('/shops/l', authMiddleware, AllShopsController.index);

routes.post('/qr', authMiddleware, QrController.index);

routes.post('/users/l/:user_id', UserController.index);
routes.post('/users/add/feedback', UpdateFeedbackController.store);

routes.use(function (err, req, res) {
  res.status(err.status || 500);
  // if you using view enggine
  res.send({
    message: err.message,
    error: {},
  });
  // or you can use res.send();
});

// routes.post('/files', upload.single('file'), FileController.store);
export default routes;

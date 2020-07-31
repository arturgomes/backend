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

const routes = new Router();
const upload = multer(multerConfig);
// routes.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
routes.get('/', (req, res) => res.redirect('https://www.couponfeed.co'));

routes.post('/users', UserController.store);
routes.post('/users/i', ManFeedController.store);
routes.post('/users/s', ManFeedController.index);

routes.post('/retails', RetailController.store);

routes.post('/feed/:shop_id/f', FeedbackController.index);
routes.post('/feed/:shop_id/c', FeedbackController.store);
routes.post('/surl/:short_url', ShortnerController.index);


routes.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      login: {
        user_id: req.user.user_id, //pass in the id and displayName params from Facebook
        name: req.user.name,
        email: req.user.email,
        tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
});
routes.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

routes.get("/facebook", passport.authenticate("facebook", { scope: ['email'] }));
routes.get("/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login/failed"
  })
);

routes.get("/fail", (req, res) => {
  res.json({ resposta: "Failed attempt" });
});

// routes.get("/", (req, res) => {
//   res.json({resposta:"success"});
// });

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

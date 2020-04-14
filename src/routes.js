import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import ManFeedController from './app/controllers/ManFeedController';
import UserController from './app/controllers/UserController';
import CouponController from './app/controllers/CouponController';
import ShopController from './app/controllers/ShopController';
import AllShopsController from './app/controllers/AllShopsController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
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


routes.get('/', (req, res) => res.redirect('http://www.couponfeed.co'));

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
routes.post('/dashboardData', authMiddleware, DashboardController.index);
routes.post('/dashboardDataC', authMiddleware, CustomerDashboardController.index);
routes.post('/list', authMiddleware, DisplayFeedbackController.index);
routes.post('/coupons-l/:retail_id', authMiddleware, CouponController.index);
routes.post('/coupons-s', authMiddleware, CouponController.store);
routes.post('/allshops', authMiddleware, AllShopsController.index);
routes.post('/shops', authMiddleware, ShopController.store);
routes.post('/shopsl', authMiddleware, ShopController.index);

routes.post('/qr', authMiddleware, QrController.index);

// routes.post('/files', upload.single('file'), FileController.store);
export default routes;

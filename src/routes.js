import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import ManFeedController from './app/controllers/ManFeedController';
import UserController from './app/controllers/UserController';
import ShopController from './app/controllers/ShopController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import FeedbackController from './app/controllers/FeedbackController';
import DisplayFeedbackController from './app/controllers/DisplayFeedbackController';
import RetailController from './app/controllers/RetailController';
import QrController from './app/controllers/QrController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Soafia',
//     email: 'saofia@sofia.com',
//     password_hash: '123455',
//   });
//   return res.json(user);
// });

routes.post('/users', UserController.store);
routes.post('/users/i', ManFeedController.store);
routes.post('/users/s', ManFeedController.index);
routes.post('/retails', RetailController.store);
routes.post('/feed/:shop_id/f', FeedbackController.index);
routes.post('/feed/:shop_id/c', FeedbackController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/list', DisplayFeedbackController.index);
routes.post('/shops', ShopController.store);
routes.post('/qr', QrController.index);

// routes.put('/users', UserController.update);
// routes.put('/shops', ShopController.update);

// routes.get('/providers', ProviderController.index);
// routes.get('/providers/:providerId/available', AvailableController.index);

// routes.get('/appointments', AppointmentController.index);
// routes.post('/appointments', AppointmentController.store);
// routes.delete('/appointments/:id', AppointmentController.delete);

// routes.get('/schedule', ScheduleController.index);

// routes.get('/notifications/', NotificationController.index);
// routes.put('/notifications/:id', NotificationController.update);
routes.post('/files', upload.single('file'), FileController.store);
export default routes;

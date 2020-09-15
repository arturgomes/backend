import { Router } from 'express';
import passport from "passport";
import PostController from './app/controllers/PostController'

const routes = new Router();

routes.get('/new', PostController.store);

export default routes;

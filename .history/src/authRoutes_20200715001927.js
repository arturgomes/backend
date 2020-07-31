import { Router } from 'express';
import passport from "passport";
import SocialUserController from './app/controllers/SocialUserController'
import SocialSessionController from './app/controllers/SocialSessionController'
const routes = new Router();

routes.get('/success', (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "successfully logged in" })
}
);
routes.get('/error', (req, res) => res.status(401).json({ message: "error logging in" }));
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'name'] }));
routes.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  SocialUserController.store()
  .then(req => SocialSessionController.store())
  );

module.exports = routes;

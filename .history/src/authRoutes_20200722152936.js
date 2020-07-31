import { Router } from 'express';
import passport from "passport";
// import SocialUserController from './app/controllers/SocialUserController'
import SocialSessionController from './app/controllers/SocialSessionController'
const routes = new Router();

routes.get('/success', (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "successfully logged in" })
}
);
routes.get('/error', (req, res) => res.status(401).json({ message: "error logging in" }));

//Google auth
routes.get('/google', passport.authenticate('google' , { scope: [ 'profile','email' ] }
));
routes.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  // (req,res) => {
    // console.log(req.user.dataValues.email);
    SocialSessionController.store();
    // res.redirect('/auth/success')
  // }
  );



//facebook auth
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  // (req,res) => {
    SocialSessionController.store();
  // }
  );

module.exports = routes;

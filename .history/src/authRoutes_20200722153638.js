import { Router } from 'express';
import passport from "passport";
// import SocialUserController from './app/controllers/SocialUserController'
import SocialSessionController from './app/controllers/SocialSessionController'
const routes = new Router();

routes.get('/success', (req, res) => {
  console.log(req.user);
  return res.status(200).json({
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
  })

  // res.status(200).json({ message: "successfully logged in" })
}
);
routes.get('/error', (req, res) => res.status(401).json({ message: "error logging in" }));

//Google auth
routes.get('/google', passport.authenticate('google' , { scope: [ 'profile','email' ] }
));
routes.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  (req,res) => {
    // console.log(req.user.dataValues.email);
    // SocialSessionController.store();
    res.redirect('/auth/success')
  }
  );



//facebook auth
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/auth/error' }),
  (req,res) => {
    // SocialSessionController.store();
    res.redirect('/auth/success')

  }
  );

module.exports = routes;

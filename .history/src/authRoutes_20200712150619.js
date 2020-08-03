import { Router } from 'express';
import passport from "passport";

const routes = new Router();

routes.get('/success', (req,res) => {
  console.log(req.body);
  res.status(200).json({message:"successifully logged in"})});
routes.get('/error', (req,res) => res.status(401).json({message:"error logging in"}));
routes.get('/facebook',passport.authenticate('facebook', { scope: ['email','name'] }));
routes.get('/facebook/redirect',
            passport.authenticate('facebook',
                { failureRedirect: '/auth/error'}),
                (req,res,next) => {
                  res.status(200).json(req.user);
                  next();
                },
                (req,res,next) => {
                  res.status(200).json(req.user);
                  next();
                }  );

// routes.get('/', (req, res, next) => {
//   const { user } = req;
//   res.render('home', { user });
// });

// routes.get("/login/success", (req, res) => {
//   if (req.user) {
//     return res.status(200).json({
//       success: true,
//       message: "user has successfully authenticated",
//       login: {
//         user_id: req.user.user_id, //pass in the id and displayName params from Facebook
//         name: req.user.name,
//         email: req.user.email,
//         tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
//       },
//       token: jwt.sign({ id }, authConfig.secret, {
//         expiresIn: authConfig.expiresIn,
//       }),
//     });
//   }
//   res.status(200).json({
//     success: false,
//     message: "user failed to authenticate."
//   });
// });

// routes.get("/login/failed", (req, res) => {
//   res.status(200).json({
//     success: false,
//     message: "user failed to authenticate."
//   });
// });

// router.get('/logout', (req, res, next) => {
//   req.logout();
//   res.redirect('/');
// });

// routes.get("/facebook", passport.authenticate("facebook", { scope: ['email'] }));

// routes.get("/facebook/redirect",
//   passport.authenticate("facebook",
//     { failureRedirect: '/' }),
//   (req, res, next) => {
//     res.redirect('/');
//   }
// );
module.exports = routes;
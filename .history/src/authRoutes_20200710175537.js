const routes = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

routes.get("/login/success", (req, res) => {
  if (req.user) {
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

import Valid from 'validator';
import User from "../app/models/User.js";
import Retail from "../app/models/Retail.js";
import Feedback from './app/models/Feedback.js';


export const login = async (req, provider, profile, done) => {
  // console.log(req.session.retail);
  if (req.session.retail === "true")
    logRetail(profile, provider, done);
  else
    logCustomer(req, profile, provider, done)

}

const logRetail = async (profile, provider, done) => {
  const { sub, name, picture, email } = profile._json;

  const currentUser = await Retail.findOne({ where: { email } })

  if (currentUser) {
    return done(null, currentUser);
  }
  else {// create new user if the database doesn't have this user
    try {
      await Retail.create({
        user_id: sub, name, email,
        provider_type: provider,
      })
        .then(newUser => {
          done(null, newUser)
        })
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }
}
const logCustomer = async (req, profile, provider, done) => {
  const { sub, name, picture, email } = profile._json;

  const currentUser = await User.findOne({ where: { email } })

  if (currentUser) {
    return done(null, currentUser);
  }
  else {// create new user if the database doesn't have this user
    try {
      await User.create({
        user_id: sub,
        name,
        email,
        thumbnail: picture,
        provider_type: provider,
      })
        .then(newUser => {
          if (req.params.fid && Valid.isUUID(req.params.fid)) {
            Feedback.findOne({
              id: req.params.fid,
            })
              .then(feed => {
                if (feed.user_id) {
                  return res
                    .status(400)
                    .json({ error: Error.feedback_already_stored });
                }
                feed.update({
                  user_id: id,
                });
                return res.json({ message: 'OK' });
              })
              .catch(() => { });


          }
          done(null, newUser)
        })
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }
}

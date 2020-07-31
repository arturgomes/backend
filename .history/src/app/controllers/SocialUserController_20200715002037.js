import * as Yup from 'yup';
import Valid from 'validator';
import Feedback from '../models/Feedback';
import User from '../models/User';
import Error from '../errors/errors';

class SocialUserController {
  store(req, res,next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_id: Yup.string().required(),
      provider_type: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (
      !(schema.isValid({
        name: req.user.name,
        email: req.user.email,
        provider_type: req.user.provider_type,
        user_id: req.user.user_id,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }
    const { fid } = req.body;
    const fc = fid ? 1 : 0
    const [user, created] = User.findOrCreate({
      where: {
        name: req.user.name,
        email: req.user.email,
        provider_type: req.user.provider_type,
        user_id: req.user.user_id,
        feedcoins: fc

      }
    });
    if (!created) {
      return res.status(400).json({ error: "could not create user" });
    }

    if (fid && Valid.isUUID(fid)) {
      // console.log(`fid = ${fid}`);
      await Feedback.findOne({
        id: fid,
      })
        .then(feed => {
          // console.log(feed);
          if (feed.user_id) {
            return res
              .status(400)
              .json({ error: Error.feedback_already_stored });
          }
          feed.update({
            user_id: user.id,
          });
          return res.json({ message: 'OK' });
        })
        // .catch(error => console.log(error));
        .catch(() => { });

    }
    next();
  }

}

export default new SocialUserController();

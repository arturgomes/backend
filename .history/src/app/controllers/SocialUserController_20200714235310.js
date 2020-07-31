import * as Yup from 'yup';
import Valid from 'validator';
import Feedback from '../models/Feedback';
import User from '../models/User';
import Error from '../errors/errors';

class SocialUserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_id: Yup.string().required(),
      provider_type: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (
      !(await schema.isValid({
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
    const [created] = await User.findOrCreate({
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



    const { id, name, email, phone } = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      cpf: req.body.cpf,
      feedcoins: fc
    });

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
            user_id: id,
          });
          return res.json({ message: 'OK' });
        })
        // .catch(error => console.log(error));
        .catch(() => { });

      // await User.findOne({ id })
      //   .then(user => {
      //     user.update({
      //       feedcoins: user.feedcoins + 1,
      //     });
      //   })
      //   .catch(error => console.log(error));

      // await User.update({ feedcoins: 1 }, { where: id })
      //   .then(message => {
      //     console.log(message);
      //   })
      //   .catch(error => console.log(error));
      // console.log(fe);
    }
    return res.json({ id, name, email, phone });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      // cpf: Yup.string(),
      phone: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    const { cpf, email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (cpf !== user.cpf) {
      const userExists = await User.findOne({ where: { cpf } });

      if (userExists) {
        return res.status(400).json({ error: Error.user_exists });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: Error.invalid_password });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email, cpf });
  }
}

export default new SocialUserController();

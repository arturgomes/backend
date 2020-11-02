import * as Yup from 'yup';
import Valid from 'validator';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import Error from '../errors/errors.js';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      cpf: Yup.string(), // .required(),
      phone: Yup.string().required(),
      // fid: Yup.string(),
    });
    if (
      !(await schema.isValid({
        name: req.body.name,
        email: req.body.email,
        cpf: req.body.cpf,
        password: req.body.password,
        phone: req.body.phone,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }
    // const retailEx = await Retail.findOne({ where: { phone: req.body.phone } });

    const emailEx = await User.findOne({ where: { email: req.body.email } });
    const phoneEx = await User.findOne({ where: { phone: req.body.phone } });
    const cpfEx = await User.findOne({ where: { cpf: req.body.cpf } });

    if (emailEx) {
      return res.status(400).json({ error: Error.email_already_used });
    }
    if (phoneEx) {
      return res.status(400).json({ error: Error.phone_already_used });
    }
    if (cpfEx) {
      return res.status(400).json({ error: Error.cpf_already_used });
    }
    const { fid } = req.body;
    // console.log("UserController.47 fid: ",fid);
    const fc = fid ? 1 : 0

    const { id, name, email, phone } = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      cpf: req.body.cpf,
      feedcoins: fc
    });

    if (fid && Valid.isUUID(fid)) {
      await Feedback.findOne({
        id: fid,
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
    return res.json({ id, name, email, phone });
  }

  async update(req, res) {


    const { cpf, name, phone } = req.body;

    const user = await User.findByPk(req.userId);

    if (cpf !== user.cpf) {
      const userExists = await User.findOne({ where: { cpf } });

      if (userExists) {
        return res.status(400).json({ error: Error.user_exists });
      }
    }


    const upd = await user.update(req.body);

    return res.status(200).json({ message: Error.ok });
  }

  async index(req, res) {
    const { user_id } = req.params;
    const user = await User.findOne({ where: { id: user_id } })

    return res.json(user);
  }
}

export default new UserController();

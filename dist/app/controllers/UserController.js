"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _validator = require('validator'); var _validator2 = _interopRequireDefault(_validator);
var _Feedback = require('../models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

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
      return res.status(400).json({ error: _errors2.default.validation_failed });
    }
    // const retailEx = await Retail.findOne({ where: { phone: req.body.phone } });

    const emailEx = await _User2.default.findOne({ where: { email: req.body.email } });
    const phoneEx = await _User2.default.findOne({ where: { phone: req.body.phone } });
    const cpfEx = await _User2.default.findOne({ where: { cpf: req.body.cpf } });

    if (emailEx) {
      return res.status(400).json({ error: _errors2.default.email_already_used });
    }
    if (phoneEx) {
      return res.status(400).json({ error: _errors2.default.phone_already_used });
    }
    if (cpfEx) {
      return res.status(400).json({ error: _errors2.default.cpf_already_used });
    }
    const { fid } = req.body;
    console.log("UserController.47 fid: ",fid);
    const fc = fid ? 1 : 0

    const { id, name, email, phone } = await _User2.default.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      cpf: req.body.cpf,
      feedcoins:fc
    });

    if (fid && _validator2.default.isUUID(fid)) {
      // console.log(`fid = ${fid}`);
      await _Feedback2.default.findOne({
        id: fid,
      })
        .then(feed => {
          // console.log(feed);
          if (feed.user_id) {
            return res
              .status(400)
              .json({ error: _errors2.default.feedback_already_stored });
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
      return res.status(400).json({ error: _errors2.default.validation_failed });
    }

    const { cpf, email, oldPassword } = req.body;

    const user = await _User2.default.findByPk(req.userId);

    if (cpf !== user.cpf) {
      const userExists = await _User2.default.findOne({ where: { cpf } });

      if (userExists) {
        return res.status(400).json({ error: _errors2.default.user_exists });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: _errors2.default.invalid_password });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email, cpf });
  }
}

exports. default = new UserController();

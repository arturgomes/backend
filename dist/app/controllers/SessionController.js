"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Retail = require('../models/Retail'); var _Retail2 = _interopRequireDefault(_Retail);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: _errors2.default.validation_failed });
    }

    const { email, password } = req.body;

    const user = await _User2.default.findOne({ where: { email } });
    const retail = await _Retail2.default.findOne({ where: { email } });

    if (!user && !retail) {
      return res.status(401).json({ error: _errors2.default.user_not_found });
    }

    if (user) {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: _errors2.default.password_not_match });
      }

      const { id, name } = user;
      // console.log('consumidor logado');

      return res.json({
        login: {
          id,
          name,
          email,
          tu: '897316929176464ebc9ad085f31e7284',
        },
        token: _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
          expiresIn: _auth2.default.expiresIn,
        }),
      });
    }
    if (!(await retail.checkPassword(password))) {
      return res.status(401).json({ error: _errors2.default.password_not_match });
    }

    const { id, name } = retail;
    // console.log('retail logado');

    return res.json({
      login: {
        id,
        name,
        email,
        tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
      },
      token: _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
        expiresIn: _auth2.default.expiresIn,
      }),
    });
  }
}

exports. default = new SessionController();

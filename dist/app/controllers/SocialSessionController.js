"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class SocialSessionController {
  async store(req, res) {
    const user = await _User2.default.findOne({ where: { email:req.user.dataValues.email } });
    if (!user) {
      return res.status(401).json({ error: _errors2.default.user_not_found });
    }
      const { id, name } = user;
      // console.log('consumidor logado');
      return res.status(200).json({
        success: true,
        message: "user has successfully authenticated",
        login: {
          user_id: req.user.dataValued.user_id, //pass in the id and displayName params from Facebook
          name: req.user.dataValued.name,
          email: req.user.dataValued.email,
          tu: 'b026324c6904b2a9cb4b88d6d61c81d1',
        },
        token: _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
          expiresIn: _auth2.default.expiresIn,
        }),
      });
    }
  }


exports. default = new SocialSessionController();

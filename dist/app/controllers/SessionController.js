"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var Yup = _interopRequireWildcard(require("yup"));

var _auth = _interopRequireDefault(require("../../config/auth"));

var _User = _interopRequireDefault(require("../models/User"));

var _Retail = _interopRequireDefault(require("../models/Retail"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    }

    const {
      email,
      password
    } = req.body;
    const user = await _User.default.findOne({
      where: {
        email
      }
    });
    const retail = await _Retail.default.findOne({
      where: {
        email
      }
    });

    if (!user && !retail) {
      return res.status(401).json({
        error: _errors.default.user_not_found
      });
    }

    if (user) {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({
          error: _errors.default.password_not_match
        });
      }

      const {
        id,
        name
      } = user; // console.log('consumidor logado');

      return res.json({
        login: {
          id,
          name,
          email,
          tu: '897316929176464ebc9ad085f31e7284'
        },
        token: _jsonwebtoken.default.sign({
          id
        }, _auth.default.secret, {
          expiresIn: _auth.default.expiresIn
        })
      });
    }

    if (!(await retail.checkPassword(password))) {
      return res.status(401).json({
        error: _errors.default.password_not_match
      });
    }

    const {
      id,
      name
    } = retail; // console.log('retail logado');

    return res.json({
      login: {
        id,
        name,
        email,
        tu: 'b026324c6904b2a9cb4b88d6d61c81d1'
      },
      token: _jsonwebtoken.default.sign({
        id
      }, _auth.default.secret, {
        expiresIn: _auth.default.expiresIn
      })
    });
  }

}

var _default = new SessionController();

exports.default = _default;
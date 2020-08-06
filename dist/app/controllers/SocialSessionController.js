"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var Yup = _interopRequireWildcard(require("yup"));

var _auth = _interopRequireDefault(require("../../config/auth"));

var _User = _interopRequireDefault(require("../models/User"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SocialSessionController {
  async store(req, res) {
    const user = await _User.default.findOne({
      where: {
        email: req.user.dataValues.email
      }
    });

    if (!user) {
      return res.status(401).json({
        error: _errors.default.user_not_found
      });
    }

    const {
      id,
      name
    } = user; // console.log('consumidor logado');

    return res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      login: {
        user_id: req.user.dataValued.user_id,
        //pass in the id and displayName params from Facebook
        name: req.user.dataValued.name,
        email: req.user.dataValued.email,
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

var _default = new SocialSessionController();

exports.default = _default;
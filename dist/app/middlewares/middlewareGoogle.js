"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
var _oauthsjs = require('../../config/oauths.js'); var _oauthsjs2 = _interopRequireDefault(_oauthsjs);

var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _passportgoogle = require('passport-google'); var _passportgoogle2 = _interopRequireDefault(_passportgoogle);

const gglstrat = async () => {
  return new (0, _passportgoogle2.default)(_oauthsjs2.default.facebook,
    function (accessToken, refreshToken, profile, done) {
      const count = _User2.default.count({ where: { user_id: profile.id } })
      if (count === 0) {
        await _User2.default.create({
          user_id: profile.id,
          name: profile.name,
          email: profile.email,
          provider_type: 'facebook'
        });
      }
    })
};

module.exports = { gglstrat }

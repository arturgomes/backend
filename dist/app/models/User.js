"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Shop = _interopRequireDefault(require("./Shop"));

var _Retail = _interopRequireDefault(require("./Retail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      provider_key: _sequelize.default.STRING,
      user_id: _sequelize.default.STRING,
      provider_type: _sequelize.default.ENUM('facebook', 'twitter', 'google', 'instagram'),
      name: _sequelize.default.STRING,
      email: _sequelize.default.STRING,
      password: _sequelize.default.VIRTUAL,
      password_hash: _sequelize.default.STRING,
      cpf: _sequelize.default.STRING,
      phone: _sequelize.default.STRING,
      feedcoins: _sequelize.default.INTEGER,
      thumbnail: _sequelize.default.STRING
    }, {
      sequelize
    });
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await _bcrypt.default.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Feedback, {
      foreignKey: 'user_id' // as: 'fbs'

    });
    this.hasOne(models.FileUser, {
      foreignKey: 'user_id' // as: 'fbs'

    });
  }

  checkPassword(password) {
    return _bcrypt.default.compare(password, this.password_hash);
  }

}

exports.default = User;
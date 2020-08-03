"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _Shop = require('./Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _Retail = require('./Retail'); var _Retail2 = _interopRequireDefault(_Retail);

 class User extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        provider_key: _sequelize2.default.STRING,
        user_id: _sequelize2.default.STRING,
        provider_type: _sequelize2.default.ENUM('facebook','twitter', 'google','instagram'),
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
        cpf: _sequelize2.default.STRING,
        phone: _sequelize2.default.STRING,
        feedcoins: _sequelize2.default.INTEGER,
        thumbnail: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await _bcrypt2.default.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Feedback, {
      foreignKey: 'user_id',
      // as: 'fbs'
    })

    this.hasOne(models.FileUser, {
      foreignKey: 'user_id',
      // as: 'fbs'
    })
  }

  checkPassword(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = User;

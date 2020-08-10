"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _User = require('./User'); var _User2 = _interopRequireDefault(_User);

 class AuthProvider extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        provider_key: _sequelize2.default.STRING,
        user_id: _sequelize2.default.INTEGER,
        provider_type: _sequelize2.default.ENUM('facebook','twitter', 'google','instagram'),
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'cf_user_id'});
  }
} exports.default = AuthProvider;

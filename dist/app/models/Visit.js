"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _User = require('./User'); var _User2 = _interopRequireDefault(_User);
var _Shop = require('./Shop'); var _Shop2 = _interopRequireDefault(_Shop);

class Visit extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        date: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    _User2.default.hasMany(this, { foreignKey: 'user_id', as: 'users' });
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shops' });
    _Shop2.default.hasMany(this, { foreignKey: 'shop_id', as: 'shops' });
  }
}

exports. default = Feedback;

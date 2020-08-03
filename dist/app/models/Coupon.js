"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);
var _Retailjs = require('./Retail.js'); var _Retailjs2 = _interopRequireDefault(_Retailjs);

class Coupon extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        description: _sequelize2.default.STRING,
        feedcoins: _sequelize2.default.INTEGER,
        loyalty: _sequelize2.default.BOOLEAN,
        discount: _sequelize2.default.STRING,
        expire_date: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, { foreignKey: 'retail_id' });
    // Retail.hasMany(this, { foreignKey: 'retail_id' });
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retail' });
    // Shop.hasMany(this, { foreignKey: 'retail_id', as: 'retail' });
  }
}

exports. default = Coupon;

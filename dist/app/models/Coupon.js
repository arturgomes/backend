"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Retail = _interopRequireDefault(require("./Retail.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Coupon extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize.default.STRING,
      description: _sequelize.default.STRING,
      feedcoins: _sequelize.default.INTEGER,
      loyalty: _sequelize.default.BOOLEAN,
      discount: _sequelize.default.STRING,
      expire_date: _sequelize.default.DATE
    }, {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, {
      foreignKey: 'retail_id'
    }); // Retail.hasMany(this, { foreignKey: 'retail_id' });
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retail' });
    // Shop.hasMany(this, { foreignKey: 'retail_id', as: 'retail' });
  }

}

var _default = Coupon;
exports.default = _default;
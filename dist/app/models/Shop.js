"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Shop extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize.default.STRING,
      address_street: _sequelize.default.STRING,
      address_number: _sequelize.default.STRING,
      address_comp: _sequelize.default.STRING,
      address_neighb: _sequelize.default.STRING,
      address_city: _sequelize.default.STRING,
      address_state: _sequelize.default.STRING,
      address_zip: _sequelize.default.STRING,
      address_country: _sequelize.default.STRING,
      short_url: _sequelize.default.STRING,
      manager: _sequelize.default.STRING,
      phone: _sequelize.default.STRING
    }, {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, {
      foreignKey: 'retail_id' // , as: 'retail'

    });
    this.hasMany(models.Feedback, {
      foreignKey: 'shop_id' // , as: 'febs'

    }); // Retail.hasMany(this, { foreignKey: 'retail_id'});
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retails' });
    // Retail.hasMany(this, { foreignKey: 'retail_id', as: 'retails' });
  }

}

var _default = Shop;
exports.default = _default;
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Shop extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        address_street: _sequelize2.default.STRING,
        address_number: _sequelize2.default.STRING,
        address_comp: _sequelize2.default.STRING,
        address_neighb: _sequelize2.default.STRING,
        address_city: _sequelize2.default.STRING,
        address_state: _sequelize2.default.STRING,
        address_zip: _sequelize2.default.STRING,
        address_country: _sequelize2.default.STRING,
        short_url: _sequelize2.default.STRING,
        manager: _sequelize2.default.STRING,
        phone: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {

    this.belongsTo(models.Retail, { foreignKey: 'retail_id'
    // , as: 'retail'
  });
    this.hasMany(models.Feedback, { foreignKey: 'shop_id'
    // , as: 'febs'
  });
    // Retail.hasMany(this, { foreignKey: 'retail_id'});
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retails' });
    // Retail.hasMany(this, { foreignKey: 'retail_id', as: 'retails' });
  }
}

exports. default = Shop;

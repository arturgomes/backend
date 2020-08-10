"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _Shop = require('./Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

class Retail extends _sequelize.Model {
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
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
        cnpj: _sequelize2.default.STRING,
        phone: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async retail => {
      if (retail.password) {
        retail.password_hash = await _bcrypt2.default.hash(retail.password, 8);
      }
    });
    return this;
  }

  static associate(models){
    this.hasMany(models.Feedback, {foreignKey:'retail_id',
    // as: 'shops'
  })
    this.hasMany(models.Shop, {foreignKey:'retail_id',
    // as: 'shops'
  })
  }
  checkPassword(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
}

exports. default = Retail;

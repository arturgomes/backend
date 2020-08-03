"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Feedback extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        date: _sequelize2.default.DATE,
        nps_value: _sequelize2.default.INTEGER,
        promoter_option: _sequelize2.default.INTEGER,
        passive_option: _sequelize2.default.STRING,
        detractor_option: _sequelize2.default.STRING,
        comment_optional: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, { foreignKey: 'retail_id'
    // , as: 'user'
  });
  this.belongsTo(models.User, { foreignKey: 'user_id'
  // , as: 'user'
});
    this.belongsTo(models.Shop, { foreignKey: 'shop_id'
    // , as: 'shop'
  });
  }
}

exports. default = Feedback;

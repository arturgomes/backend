"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Feedback extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      date: _sequelize.default.DATE,
      nps_value: _sequelize.default.INTEGER,
      promoter_option: _sequelize.default.INTEGER,
      passive_option: _sequelize.default.STRING,
      detractor_option: _sequelize.default.STRING,
      comment_optional: _sequelize.default.STRING
    }, {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, {
      foreignKey: 'retail_id' // , as: 'user'

    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id' // , as: 'user'

    });
    this.belongsTo(models.Shop, {
      foreignKey: 'shop_id' // , as: 'shop'

    });
  }

}

var _default = Feedback;
exports.default = _default;
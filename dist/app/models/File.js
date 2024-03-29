"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class File extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        size: _sequelize2.default.INTEGER,
        key: _sequelize2.default.STRING,
        url : _sequelize2.default.STRING,
        // url: {
        //   type: Sequelize.VIRTUAL,
        //   get() {
        //     return `${process.env.APP_URL}`;
        //     // return `http://localhost:8080/files/${this.path}`
        //   },
        // },
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Retail, { foreignKey: 'retail_id'});
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retails' });
  }
}

exports. default = File;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Coupon = _interopRequireDefault(require("../app/models/Coupon"));

var _User = _interopRequireDefault(require("../app/models/User"));

var _Shop = _interopRequireDefault(require("../app/models/Shop"));

var _Retail = _interopRequireDefault(require("../app/models/Retail"));

var _File = _interopRequireDefault(require("../app/models/File"));

var _FileUser = _interopRequireDefault(require("../app/models/FileUser"));

var _Feedback = _interopRequireDefault(require("../app/models/Feedback"));

var _database = _interopRequireDefault(require("../config/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import mongoose from 'mongoose';
// import AuthProvider from '../app/models/AuthProvider';
const models = [_Retail.default, _User.default, _File.default, _FileUser.default, _Shop.default, _Feedback.default, // AuthProvider,
_Coupon.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new _sequelize.default(_database.default);
    models.map(model => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models));
  }

}

var _default = new Database();

exports.default = _default;
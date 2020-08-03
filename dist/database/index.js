"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
// import mongoose from 'mongoose';

var _Coupon = require('../app/models/Coupon'); var _Coupon2 = _interopRequireDefault(_Coupon);
var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Shop = require('../app/models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _Retail = require('../app/models/Retail'); var _Retail2 = _interopRequireDefault(_Retail);
var _File = require('../app/models/File'); var _File2 = _interopRequireDefault(_File);
var _FileUser = require('../app/models/FileUser'); var _FileUser2 = _interopRequireDefault(_FileUser);
var _Feedback = require('../app/models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
// import AuthProvider from '../app/models/AuthProvider';
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

const models = [
  _Retail2.default,
  _User2.default,
  _File2.default,
  _FileUser2.default,
  _Shop2.default,
  _Feedback2.default,
  // AuthProvider,
  _Coupon2.default,
];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

}

exports. default = new Database();

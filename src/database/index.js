import Sequelize from 'sequelize';
// import mongoose from 'mongoose';

import Coupon from '../app/models/Coupon.js';
import User from '../app/models/User.js';
import Shop from '../app/models/Shop.js';
import Retail from '../app/models/Retail.js';
import File from '../app/models/File.js';
import FileUser from '../app/models/FileUser.js';
import Feedback from '../app/models/Feedback.js';
// import AuthProvider from '../app/models/AuthProvider.js';
import databaseConfig from '../config/database.js';

const models = [
  Retail,
  User,
  File,
  FileUser,
  Shop,
  Feedback,
  // AuthProvider,
  Coupon,
];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

}

export default new Database();

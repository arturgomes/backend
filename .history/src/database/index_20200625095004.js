import Sequelize from 'sequelize';
// import mongoose from 'mongoose';

import Coupon from '../app/models/Coupon';
import User from '../app/models/User';
import Shop from '../app/models/Shop';
import Retail from '../app/models/Retail';
import File from '../app/models/File';
import FileUser from '../app/models/FileUser';
import Feedback from '../app/models/Feedback';
import AuthProvider from '../app/models/AuthProvider';
import databaseConfig from '../config/database';

const models = [
  Retail,
  User,
  File,
  FileUser,
  Shop,
  Feedback,
  AuthProvider,
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

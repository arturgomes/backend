import Sequelize from 'sequelize';
// import mongoose from 'mongoose';

import User from '../app/models/User';
import Shop from '../app/models/Shop';
import Retail from '../app/models/Retail';
import File from '../app/models/File';
import Feedback from '../app/models/Feedback';
import databaseConfig from '../config/database';

const models = [User, Retail, File, Feedback, Shop];
class Database {
  constructor() {
    this.init();
    // this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
  //     useNewUrlParser: true,
  //     useFindAndModify: true,
  //   });
  // }
}

export default new Database();

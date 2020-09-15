import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Posts extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        author: Sequelize.STRING,
        content: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

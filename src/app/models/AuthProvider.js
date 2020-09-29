import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
import User from './User.js';

export default class AuthProvider extends Model {
  static init(sequelize) {
    super.init(
      {
        provider_key: Sequelize.STRING,
        user_id: Sequelize.INTEGER,
        provider_type: Sequelize.ENUM('facebook','twitter', 'google','instagram'),
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'cf_user_id'});
  }
}

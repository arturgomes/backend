import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
import Shop from './Shop';
import Retail from './Retail';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        provider_key: Sequelize.STRING,
        user_id: Sequelize.BIGINT,
        provider_type: Sequelize.ENUM('facebook','twitter', 'google','instagram'),
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        cpf: Sequelize.STRING,
        phone: Sequelize.STRING,
        feedcoins: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Feedback, {
      foreignKey: 'user_id',
      // as: 'fbs'
    })

    this.hasOne(models.FileUser, {
      foreignKey: 'user_id',
      // as: 'fbs'
    })
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

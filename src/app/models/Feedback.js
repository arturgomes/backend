import Sequelize, { Model } from 'sequelize';
import User from './User';
import Shop from './Shop';

class Feedback extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        nps_value: Sequelize.INTEGER,
        promoter_option: Sequelize.INTEGER,
        passive_option: Sequelize.STRING,
        detractor_option: Sequelize.STRING,
        comment_optional: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, { foreignKey: 'user_id'});
    User.hasMany(this, { foreignKey: 'user_id'});
    this.belongsTo(models.Shop, { foreignKey: 'shop_id'});
    Shop.hasMany(this, { foreignKey: 'shop_id'});
    // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    // User.hasMany(this, { foreignKey: 'user_id', as: 'users' });
    // this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shops' });
    // Shop.hasMany(this, { foreignKey: 'shop_id', as: 'shops' });
  }
}

export default Feedback;

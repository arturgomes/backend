import Sequelize, { Model } from 'sequelize';
import User from './User';
import Shop from './Shop';

class Visit extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    User.hasMany(this, { foreignKey: 'user_id', as: 'users' });
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shops' });
    Shop.hasMany(this, { foreignKey: 'shop_id', as: 'shops' });
  }
}

export default Feedback;

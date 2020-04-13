import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
import Retail from './retail.js';

class Coupon extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        feedcoins: Sequelize.INTEGER,
        loyalty: Sequelize.BOOLEAN,
        discount: Sequelize.STRING,
        expire_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, { foreignKey: 'retail_id' });
    // Retail.hasMany(this, { foreignKey: 'retail_id' });
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retail' });
    // Shop.hasMany(this, { foreignKey: 'retail_id', as: 'retail' });
  }
}

export default Coupon;

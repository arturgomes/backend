import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Retail extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        discount: Sequelize.STRING,
        expireDate: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retail' });
    Shop.hasMany(this, { foreignKey: 'retail_id', as: 'retail' });
  }
}

export default Retail;

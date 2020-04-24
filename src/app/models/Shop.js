import Sequelize, { Model } from 'sequelize';

class Shop extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_number: Sequelize.STRING,
        address_comp: Sequelize.STRING,
        address_neighb: Sequelize.STRING,
        address_city: Sequelize.STRING,
        address_state: Sequelize.STRING,
        address_zip: Sequelize.STRING,
        address_country: Sequelize.STRING,
        short_url: Sequelize.STRING,
        manager: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {

    this.belongsTo(models.Retail, { foreignKey: 'retail_id'
    // , as: 'retail'
  });
    this.hasMany(models.Feedback, { foreignKey: 'shop_id'
    // , as: 'febs'
  });
    // Retail.hasMany(this, { foreignKey: 'retail_id'});
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retails' });
    // Retail.hasMany(this, { foreignKey: 'retail_id', as: 'retails' });
  }
}

export default Shop;

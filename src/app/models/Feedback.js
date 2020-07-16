import Sequelize, { Model } from 'sequelize';

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
    this.belongsTo(models.Retail, { foreignKey: 'retail_id'
    // , as: 'user'
  });
  this.belongsTo(models.User, { foreignKey: 'user_id'
  // , as: 'user'
});
    this.belongsTo(models.Shop, { foreignKey: 'shop_id'
    // , as: 'shop'
  });
  }
}

export default Feedback;

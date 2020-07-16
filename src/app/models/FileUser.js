import Sequelize, { Model } from 'sequelize';

class FileUser extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        size: Sequelize.INTEGER,
        key: Sequelize.STRING,
        url : Sequelize.STRING,
        // url: {
        //   type: Sequelize.VIRTUAL,
        //   get() {
        //     return `${process.env.APP_URL}`;
        //     // return `http://localhost:8080/files/${this.path}`
        //   },
        // },
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id'});
    // this.belongsTo(models.Retail, { foreignKey: 'retail_id', as: 'retails' });
  }
}

export default FileUser;

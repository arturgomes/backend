import Sequelize, { Model } from 'sequelize';

class Posts extends Model {
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

export default Posts;

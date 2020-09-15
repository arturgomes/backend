module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('posts', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          author: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          content: {
            type: Sequelize.TEXT,
            defaultValue: false,
            allowNull: true,
            // unique: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });
      });
  },
  down: queryInterface => {
    return queryInterface.dropTable('posts');
  },
};

"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('files', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          size: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          key: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          retail_id: {
            type: Sequelize.UUID,
            references: { model: 'retails', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
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
    return queryInterface.dropTable('files');
  },
};

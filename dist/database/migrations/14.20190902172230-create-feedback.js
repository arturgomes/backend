"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(() => {
      return queryInterface.createTable('feedbacks', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        user_id: {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        shop_id: {
          type: Sequelize.UUID,
          references: {
            model: 'shops',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        nps_value: {
          type: Sequelize.INTEGER
        },
        promoter_option: {
          type: Sequelize.STRING,
          allowNull: true
        },
        passive_option: {
          type: Sequelize.STRING,
          allowNull: true
        },
        detractor_option: {
          type: Sequelize.STRING,
          allowNull: true
        },
        comment_optional: {
          type: Sequelize.STRING,
          allowNull: true
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('feedbacks');
  }
};
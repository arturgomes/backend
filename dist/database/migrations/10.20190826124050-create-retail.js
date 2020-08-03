"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('retails', {
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
          address_street: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          address_number: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          address_comp: {
            type: Sequelize.STRING,
            // allowNull: true,
          },
          address_neighb: {
            type: Sequelize.STRING,
            // allowNull: true,
          },
          address_city: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          address_state: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          address_zip: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          address_country: {
            type: Sequelize.STRING,
            // allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          password_hash: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          cnpj: {
            type: Sequelize.STRING,
            defaultValue: false,
            allowNull: false,
          },
          phone: {
            type: Sequelize.STRING,
            defaultValue: false,
            allowNull: false,
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
    return queryInterface.dropTable('retails');
  },
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('shops', {
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
          manager: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          phone: {
            type: Sequelize.STRING,
            defaultValue: false,
            allowNull: false,
          },
          short_url: {
            type: Sequelize.STRING,
            defaultValue: false,
            allowNull: false,
          },
          retail_id: {
            type: Sequelize.UUID,
            references: { model: 'retails', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
    return queryInterface.dropTable('shops');
  },
};

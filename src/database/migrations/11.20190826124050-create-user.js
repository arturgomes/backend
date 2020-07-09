module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('users', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
            allowNull: false,
          },
          provider_key: {
            type: Sequelize.STRING,
            // primaryKey: true,
            allowNull: true,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          provider_type: {
            type:  Sequelize.ENUM('facebook','twitter', 'google','instagram'),
            allowNull: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          password_hash: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          cpf: {
            type: Sequelize.STRING,
            // defaultValue: false,
            allowNull: true,
            // unique: true,
          },
          phone: {
            type: Sequelize.STRING,
            defaultValue: false,
            allowNull: true,
            unique: true,
          },
          feedcoins: {
            type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('users');
  },
};

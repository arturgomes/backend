'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
    .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(()=>{
      return queryInterface.createTable('AuthenticationProvider',{
        provider_key: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        cf_user_id: {
          type: Sequelize.UUID,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        },
        provider_type: {
          type:  Sequelize.ENUM('facebook','twitter', 'google','instagram'),
          allowNull: true,
        },
      })
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addColumn(
      'retails',
      'provider_key',
      {
        type: Sequelize.STRING,
        // primaryKey: true,
        allowNull: true,
      }
    ),
    queryInterface.addColumn(
      'retails',
      'user_id',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'retails',
      'provider_type',
      {
        type: Sequelize.ENUM('facebook', 'twitter', 'google', 'instagram'),
        allowNull: true,
      }
    )])

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

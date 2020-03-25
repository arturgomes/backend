module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'shops',
      'short_url',
      Sequelize.STRING
    )}
};

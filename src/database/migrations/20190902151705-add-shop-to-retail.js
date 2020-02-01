module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('shops', 'retail_id', {
      type: Sequelize.UUID,
      references: { model: 'retails', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('shops', 'retail_id');
  },
};

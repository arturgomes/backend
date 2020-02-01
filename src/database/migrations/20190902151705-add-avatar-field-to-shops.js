module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('shops', 'avatar_id', {
      type: Sequelize.UUID,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('shops', 'avatar_id');
  },
};

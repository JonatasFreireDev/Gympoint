module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'administrator', {
      type: Sequelize.BOOLEAN,
      default: false,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'administrator');
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'username', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'hash', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'salt', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
        }, { transaction: t }),
        queryInterface.addColumn('Users', 'isAdmin', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'username', { transaction: t }),
        queryInterface.removeColumn('Users', 'hash', { transaction: t }),
        queryInterface.removeColumn('Users', 'salt', { transaction: t }),
        queryInterface.removeColumn('Users', 'isAdmin', { transaction: t })
      ]);
    });
  }
};

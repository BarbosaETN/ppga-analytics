'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('periodo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },

      ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      inicio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      fim: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('periodo');
  },
};

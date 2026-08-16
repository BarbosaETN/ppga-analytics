'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('instituicao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            nome: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            sigla: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('instituicao');
    }
};
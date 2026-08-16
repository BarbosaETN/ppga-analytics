'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('parser_versao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            versao: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            criado_em: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('parser_versao');
    }
};
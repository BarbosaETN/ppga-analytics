'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('indicador', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            tipo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            versao_regra: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            ativo: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        await queryInterface.addConstraint('indicador', {
            fields: ['ativo'],
            type: 'check',
            where: {
                ativo: [0, 1]
            },
            name: 'check_indicador_ativo'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('indicador');
    }
};
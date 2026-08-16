'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('producao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            tipo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            titulo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            ano: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            doi: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            isbn: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            periodico: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            evento: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'producao',
            ['tipo'],
            {
                name: 'idx_producao_tipo'
            }
        );

        await queryInterface.addIndex(
            'producao',
            ['ano'],
            {
                name: 'idx_producao_ano'
            }
        );

        await queryInterface.addIndex(
            'producao',
            ['doi'],
            {
                name: 'idx_producao_doi'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('producao');
    }
};
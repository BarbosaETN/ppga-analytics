'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('projeto_extensao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            titulo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            ano_inicio: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            ano_fim: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            processamento_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'processamento',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('projeto_extensao');
    }
};
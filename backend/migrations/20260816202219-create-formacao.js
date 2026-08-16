'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formacao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            docente_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'docente',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            nivel: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            curso: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            instituicao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            ano_inicio: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            ano_conclusao: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            titulo: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'formacao',
            ['docente_id'],
            {
                name: 'idx_formacao_docente'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('formacao');
    }
};
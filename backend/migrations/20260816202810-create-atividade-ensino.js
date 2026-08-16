'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('atividade_ensino', {
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

            periodo_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'periodo',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            tipo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            disciplina: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            nivel: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            descricao: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex(
            'atividade_ensino',
            ['docente_id'],
            {
                name: 'idx_ensino_docente'
            }
        );

        await queryInterface.addIndex(
            'atividade_ensino',
            ['periodo_id'],
            {
                name: 'idx_ensino_periodo'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('atividade_ensino');
    }
};
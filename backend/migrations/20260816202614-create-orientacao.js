'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orientacao', {
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

            aluno_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'aluno',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            nivel: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            titulo: {
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
            'orientacao',
            ['docente_id'],
            {
                name: 'idx_orientacao_docente'
            }
        );

        await queryInterface.addIndex(
            'orientacao',
            ['aluno_id'],
            {
                name: 'idx_orientacao_aluno'
            }
        );

        await queryInterface.addIndex(
            'orientacao',
            ['status'],
            {
                name: 'idx_orientacao_status'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orientacao');
    }
};
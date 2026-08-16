'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('relacao_docente_aluno', {
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

            tipo_relacao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            inicio: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            fim: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            fonte_processamento_id: {
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
            'relacao_docente_aluno',
            ['docente_id'],
            {
                name: 'idx_relacao_docente_aluno_docente'
            }
        );

        await queryInterface.addIndex(
            'relacao_docente_aluno',
            ['aluno_id'],
            {
                name: 'idx_relacao_docente_aluno_aluno'
            }
        );

        await queryInterface.addIndex(
            'relacao_docente_aluno',
            ['tipo_relacao'],
            {
                name: 'idx_relacao_docente_aluno_tipo'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('relacao_docente_aluno');
    }
};
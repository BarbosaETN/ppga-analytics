'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('resultado_indicador', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            indicador_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'indicador',
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

            docente_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'docente',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            aluno_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'aluno',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            valor: {
                type: Sequelize.REAL,
                allowNull: false
            },

            calculado_em: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });

        await queryInterface.addIndex(
            'resultado_indicador',
            ['indicador_id'],
            {
                name: 'idx_resultado_indicador_indicador'
            }
        );

        await queryInterface.addIndex(
            'resultado_indicador',
            ['periodo_id'],
            {
                name: 'idx_resultado_indicador_periodo'
            }
        );

        await queryInterface.addIndex(
            'resultado_indicador',
            ['docente_id'],
            {
                name: 'idx_resultado_indicador_docente'
            }
        );

        await queryInterface.addIndex(
            'resultado_indicador',
            ['aluno_id'],
            {
                name: 'idx_resultado_indicador_aluno'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('resultado_indicador');
    }
};
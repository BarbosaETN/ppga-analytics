'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('classificacao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            producao_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'producao',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            criterio_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'criterio',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            classificacao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            pontuacao: {
                type: Sequelize.REAL,
                allowNull: true
            },

            calculado_em: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });

        await queryInterface.addIndex(
            'classificacao',
            ['producao_id'],
            {
                name: 'idx_classificacao_producao'
            }
        );

        await queryInterface.addIndex(
            'classificacao',
            ['criterio_id'],
            {
                name: 'idx_classificacao_criterio'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('classificacao');
    }
};
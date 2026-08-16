'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('processamento', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            importacao_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'importacao',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            parser_versao_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'parser_versao',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            iniciado_em: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            finalizado_em: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            registros_processados: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            erros: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            alertas: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'processamento',
            ['importacao_id'],
            {
                name: 'idx_processamento_importacao'
            }
        );

        await queryInterface.addIndex(
            'processamento',
            ['parser_versao_id'],
            {
                name: 'idx_processamento_parser'
            }
        );

        await queryInterface.addIndex(
            'processamento',
            ['status'],
            {
                name: 'idx_processamento_status'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('processamento');
    }
};
'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('importacao', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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

            nome_arquivo_original: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            hash_arquivo: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            data_importacao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            status: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });

        await queryInterface.addIndex(
            'importacao',
            ['docente_id'],
            {
                name: 'idx_importacao_docente'
            }
        );

        await queryInterface.addIndex(
            'importacao',
            ['hash_arquivo'],
            {
                name: 'idx_importacao_hash'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('importacao');
    }
};
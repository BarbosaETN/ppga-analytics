'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('auditoria', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            usuario_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuario',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            acao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            entidade: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            entidade_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            data_hora: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            detalhes: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'auditoria',
            ['usuario_id'],
            {
                name: 'idx_auditoria_usuario'
            }
        );

        await queryInterface.addIndex(
            'auditoria',
            ['entidade', 'entidade_id'],
            {
                name: 'idx_auditoria_entidade'
            }
        );

        await queryInterface.addIndex(
            'auditoria',
            ['data_hora'],
            {
                name: 'idx_auditoria_data'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('auditoria');
    }
};
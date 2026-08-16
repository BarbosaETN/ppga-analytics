'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('criterio', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            versao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            ativo: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        await queryInterface.addConstraint('criterio', {
            fields: ['ativo'],
            type: 'check',
            where: {
                ativo: [0, 1]
            },
            name: 'check_criterio_ativo'
        });

        await queryInterface.addIndex(
            'criterio',
            ['ativo'],
            {
                name: 'idx_criterio_ativo'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('criterio');
    }
};
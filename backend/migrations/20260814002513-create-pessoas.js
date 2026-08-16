'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pessoa', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            nome_completo: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            identificador_lattes: {
                type: Sequelize.TEXT,
                allowNull: true,
                unique: true
            },

            nome_normalizado: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'pessoa',
            ['nome_normalizado'],
            {
                name: 'idx_pessoa_nome_normalizado'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('pessoa');
    }
};
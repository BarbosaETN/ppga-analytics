'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('usuario', {
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

            email: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },

            senha_hash: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            ativo: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        await queryInterface.addConstraint('usuario', {
            fields: ['ativo'],
            type: 'check',
            where: {
                ativo: [0, 1]
            },
            name: 'check_usuario_ativo'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('usuario');
    }
};
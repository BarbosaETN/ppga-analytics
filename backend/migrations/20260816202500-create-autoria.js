'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('autoria', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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

            pessoa_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'pessoa',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            ordem_autoria: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            papel: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addConstraint('autoria', {
            fields: ['producao_id', 'pessoa_id'],
            type: 'unique',
            name: 'uq_autoria_producao_pessoa'
        });

        await queryInterface.addIndex(
            'autoria',
            ['producao_id'],
            {
                name: 'idx_autoria_producao'
            }
        );

        await queryInterface.addIndex(
            'autoria',
            ['pessoa_id'],
            {
                name: 'idx_autoria_pessoa'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('autoria');
    }
};
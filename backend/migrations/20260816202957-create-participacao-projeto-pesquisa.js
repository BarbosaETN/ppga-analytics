'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('participacao_projeto_pesquisa', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },

            projeto_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'projeto_pesquisa',
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

            papel: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addConstraint(
            'participacao_projeto_pesquisa',
            {
                fields: ['projeto_id', 'pessoa_id'],
                type: 'unique',
                name: 'uq_participacao_projeto_pesquisa'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('participacao_projeto_pesquisa');
    }
};
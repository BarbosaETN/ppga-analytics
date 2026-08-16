'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('aluno', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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

            programa_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'programa',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            nivel: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            situacao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            ano_ingresso: {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        });

        await queryInterface.addConstraint('aluno', {
            fields: ['pessoa_id', 'programa_id'],
            type: 'unique',
            name: 'uq_aluno_pessoa_programa'
        });

        await queryInterface.addIndex(
            'aluno',
            ['pessoa_id'],
            {
                name: 'idx_aluno_pessoa'
            }
        );

        await queryInterface.addIndex(
            'aluno',
            ['programa_id'],
            {
                name: 'idx_aluno_programa'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('aluno');
    }
};
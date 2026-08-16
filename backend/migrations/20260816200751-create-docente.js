'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('docente', {
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

            categoria: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            ativo: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        await queryInterface.addConstraint('docente', {
            fields: ['ativo'],
            type: 'check',
            where: {
                ativo: [0, 1]
            },
            name: 'check_docente_ativo'
        });

        await queryInterface.addConstraint('docente', {
            fields: ['pessoa_id', 'programa_id'],
            type: 'unique',
            name: 'uq_docente_pessoa_programa'
        });

        await queryInterface.addIndex(
            'docente',
            ['pessoa_id'],
            {
                name: 'idx_docente_pessoa'
            }
        );

        await queryInterface.addIndex(
            'docente',
            ['programa_id'],
            {
                name: 'idx_docente_programa'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('docente');
    }
};
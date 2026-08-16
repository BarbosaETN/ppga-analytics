'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('programa', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            instituicao_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'instituicao',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            nome: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            sigla: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'programa',
            ['instituicao_id'],
            {
                name: 'idx_programa_instituicao'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('programa');
    }
};
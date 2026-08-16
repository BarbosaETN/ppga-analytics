'use strict';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('origem_dado', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            processamento_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'processamento',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            secao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            referencia: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            identificador_origem: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.addIndex(
            'origem_dado',
            ['processamento_id'],
            {
                name: 'idx_origem_dado_processamento'
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('origem_dado');
    }
};
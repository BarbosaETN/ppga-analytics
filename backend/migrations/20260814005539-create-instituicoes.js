"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("instituicoes", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.STRING(200),
                allowNull: false
            },

            sigla: {
                type: Sequelize.STRING(30),
                allowNull: true,
                unique: true
            },

            cnpj: {
                type: Sequelize.STRING(18),
                allowNull: true,
                unique: true
            },

            cidade: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            uf: {
                type: Sequelize.STRING(2),
                allowNull: true
            },

            criado_em: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },

            atualizado_em: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("instituicoes");
    }
};
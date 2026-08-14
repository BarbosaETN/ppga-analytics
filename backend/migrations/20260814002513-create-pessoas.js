"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("pessoas", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            nome_completo: {
                type: Sequelize.STRING(200),
                allowNull: false
            },

            nome_social: {
                type: Sequelize.STRING(200),
                allowNull: true
            },

            cpf: {
                type: Sequelize.STRING(14),
                allowNull: true,
                unique: true
            },

            lattes_id: {
                type: Sequelize.STRING(16),
                allowNull: true,
                unique: true
            },

            email: {
                type: Sequelize.STRING(255),
                allowNull: true
            },

            data_nascimento: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },

            nacionalidade: {
                type: Sequelize.STRING(100),
                allowNull: true
            },

            sexo: {
                type: Sequelize.STRING(30),
                allowNull: true
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
        await queryInterface.dropTable("pessoas");
    }
};
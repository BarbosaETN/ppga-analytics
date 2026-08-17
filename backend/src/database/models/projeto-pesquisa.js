'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class ProjetoPesquisa extends Model {}

ProjetoPesquisa.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ano_inicio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ano_fim: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        processamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'ProjetoPesquisa',
        tableName: 'projeto_pesquisa',
        timestamps: false
    }
);

export default ProjetoPesquisa;

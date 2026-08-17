'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Classificacao extends Model {}

Classificacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        producao_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        criterio_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        classificacao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        pontuacao: {
            type: DataTypes.REAL,
            allowNull: true
        },
        calculado_em: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Classificacao',
        tableName: 'classificacao',
        timestamps: false
    }
);

export default Classificacao;

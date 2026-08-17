'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Producao extends Model {}

Producao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        tipo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ano: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        doi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isbn: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        periodico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        evento: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Producao',
        tableName: 'producao',
        timestamps: false
    }
);

export default Producao;

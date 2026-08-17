'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Periodo extends Model {}

Periodo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ano: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        inicio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fim: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Periodo',
        tableName: 'periodo',
        timestamps: false
    }
);

export default Periodo;

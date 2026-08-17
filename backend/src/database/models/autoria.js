'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Autoria extends Model {}

Autoria.init(
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
        pessoa_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ordem_autoria: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        papel: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Autoria',
        tableName: 'autoria',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['producao_id', 'pessoa_id']
            }
        ]
    }
);

export default Autoria;

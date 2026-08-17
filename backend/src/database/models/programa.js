'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Programa extends Model {}

Programa.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        instituicao_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nome: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sigla: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Programa',
        tableName: 'programa',
        timestamps: false
    }
);

export default Programa;

'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Criterio extends Model {}

Criterio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        versao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ativo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'Criterio',
        tableName: 'criterio',
        timestamps: false
    }
);

export default Criterio;

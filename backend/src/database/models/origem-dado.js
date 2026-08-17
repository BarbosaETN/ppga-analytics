'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class OrigemDado extends Model {}

OrigemDado.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        processamento_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        secao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        referencia: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        identificador_origem: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'OrigemDado',
        tableName: 'origem_dado',
        timestamps: false
    }
);

export default OrigemDado;

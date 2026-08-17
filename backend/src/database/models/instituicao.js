'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Instituicao extends Model {}

Instituicao.init(
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
        sigla: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Instituicao',
        tableName: 'instituicao',
        timestamps: false
    }
);

export default Instituicao;

'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Aluno extends Model {}

Aluno.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        pessoa_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        programa_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nivel: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        situacao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ano_ingresso: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Aluno',
        tableName: 'aluno',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['pessoa_id', 'programa_id']
            }
        ]
    }
);

export default Aluno;

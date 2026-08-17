'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Docente extends Model {}

Docente.init(
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
        categoria: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ativo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'Docente',
        tableName: 'docente',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['pessoa_id', 'programa_id']
            }
        ]
    }
);

export default Docente;

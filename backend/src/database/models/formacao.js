'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Formacao extends Model {}

Formacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        docente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nivel: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        curso: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        instituicao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ano_inicio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ano_conclusao: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Formacao',
        tableName: 'formacao',
        timestamps: false
    }
);

export default Formacao;

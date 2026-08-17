'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Orientacao extends Model {}

Orientacao.init(
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
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nivel: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        titulo: {
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
        processamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Orientacao',
        tableName: 'orientacao',
        timestamps: false
    }
);

export default Orientacao;

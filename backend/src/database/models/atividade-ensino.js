'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class AtividadeEnsino extends Model {}

AtividadeEnsino.init(
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
        periodo_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tipo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        disciplina: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nivel: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        processamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'AtividadeEnsino',
        tableName: 'atividade_ensino',
        timestamps: false
    }
);

export default AtividadeEnsino;

'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class RelacaoDocenteAluno extends Model {}

RelacaoDocenteAluno.init(
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
        tipo_relacao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        inicio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fim: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fonte_processamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'RelacaoDocenteAluno',
        tableName: 'relacao_docente_aluno',
        timestamps: false
    }
);

export default RelacaoDocenteAluno;

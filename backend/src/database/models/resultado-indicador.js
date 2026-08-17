'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class ResultadoIndicador extends Model {}

ResultadoIndicador.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        indicador_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        periodo_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        docente_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        valor: {
            type: DataTypes.REAL,
            allowNull: false
        },
        calculado_em: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ResultadoIndicador',
        tableName: 'resultado_indicador',
        timestamps: false
    }
);

export default ResultadoIndicador;

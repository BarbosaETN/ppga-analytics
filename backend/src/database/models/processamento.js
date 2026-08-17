'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Processamento extends Model {}

Processamento.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        importacao_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parser_versao_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        iniciado_em: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        finalizado_em: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        registros_processados: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        erros: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        alertas: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Processamento',
        tableName: 'processamento',
        timestamps: false
    }
);

export default Processamento;

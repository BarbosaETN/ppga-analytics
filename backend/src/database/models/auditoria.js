'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Auditoria extends Model {}

Auditoria.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        acao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        entidade: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        entidade_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        data_hora: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        detalhes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Auditoria',
        tableName: 'auditoria',
        timestamps: false
    }
);

export default Auditoria;

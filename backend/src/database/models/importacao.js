'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Importacao extends Model {}

Importacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        docente_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nome_arquivo_original: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        hash_arquivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        data_importacao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Importacao',
        tableName: 'importacao',
        timestamps: false
    }
);

export default Importacao;

'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class ParserVersao extends Model {}

ParserVersao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        versao: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        criado_em: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ParserVersao',
        tableName: 'parser_versao',
        timestamps: false
    }
);

export default ParserVersao;

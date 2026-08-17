'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class ParticipacaoProjetoExtensao extends Model {}

ParticipacaoProjetoExtensao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        projeto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pessoa_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        papel: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'ParticipacaoProjetoExtensao',
        tableName: 'participacao_projeto_extensao',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['projeto_id', 'pessoa_id']
            }
        ]
    }
);

export default ParticipacaoProjetoExtensao;

'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Indicador extends Model {}

Indicador.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tipo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        versao_regra: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ativo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'Indicador',
        tableName: 'indicador',
        timestamps: false
    }
);

export default Indicador;

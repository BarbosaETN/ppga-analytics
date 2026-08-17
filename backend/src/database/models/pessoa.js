'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Pessoa extends Model {}

Pessoa.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome_completo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        identificador_lattes: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true
        },
        nome_normalizado: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Pessoa',
        tableName: 'pessoa',
        timestamps: false
    }
);

export default Pessoa;

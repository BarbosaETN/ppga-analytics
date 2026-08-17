'use strict';

import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class Usuario extends Model {}

Usuario.init(
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
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        senha_hash: {
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
        modelName: 'Usuario',
        tableName: 'usuario',
        timestamps: false
    }
);

export default Usuario;

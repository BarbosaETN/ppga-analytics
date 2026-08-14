import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: env.databaseStorage,
    logging: false
});

export default sequelize;
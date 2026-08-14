import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: env.databaseStorage,
    logging: false
});

sequelize.addHook('afterConnect', async (connection) => {
    await connection.run('PRAGMA foreign_keys = ON');
});

export default sequelize;
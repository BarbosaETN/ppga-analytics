import 'dotenv/config';

export const env = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseStorage:
        process.env.DATABASE_STORAGE || '../../data/ppga_analytics.db'
};
import express from 'express';
import cors from 'cors';
import { sequelize } from './database/index.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', async (req, res) => {
    try {
        await sequelize.authenticate();

        return res.status(200).json({
            data: {
                status: 'ok',
                database: 'ok'
            }
        });
    } catch (error) {
        console.error('Database health check failed:', error);

        return res.status(503).json({
            error: {
                code: 'DATABASE_UNAVAILABLE',
                message: 'Database is unavailable.'
            }
        });
    }
});

export default app;
'use strict';

import AppError from '../errors/AppError';

export function errorHandler(error, req, res, next) {
    if(res.headersSent) {
        return next(error)
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
                details: error.details
            }
        });
    }

    console.error('Erro inesperado:', error);

    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Ocorreu um erro inesperado.',
            details: null
        }
    });
}
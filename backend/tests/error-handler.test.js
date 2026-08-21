'use strict';

import { describe, expect, jest, test } from '@jest/globals';

import AppError from '../src/errors/AppError.js';
import { errorHandler } from '../src/middlewares/error-handler.js';

function criarResposta() {
    return {
        headersSent: false,
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
}

describe('errorHandler', () => {
    test('transforma AppError em resposta HTTP padronizada', () => {
        const error = new AppError(
            'nome_completo é obrigatório.',
            {
                statusCode: 400,
                code: 'VALIDATION_ERROR',
                details: {
                    campo: 'nome_completo'
                }
            }
        );

        const res = criarResposta();
        const next = jest.fn();

        errorHandler(error, {}, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'nome_completo é obrigatório.',
                details: {
                    campo: 'nome_completo'
                }
            }
        });
    });

    test('transforma erro inesperado em resposta 500', () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const res = criarResposta();
        const next = jest.fn();

        errorHandler(new Error('erro interno'), {}, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Ocorreu um erro inesperado.',
                details: null
            }
        });

        consoleError.mockRestore();
    });
});
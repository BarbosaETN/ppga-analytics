'use strict';

import AppError from '../errors/AppError.js';
import PeriodoRepository from '../repositories/PeriodoRepository.js';

class PeriodoService {
    constructor() {
        this.periodoRepository = new PeriodoRepository();
    }

    async criar(dados, options = {}) {
        if (
            dados.ano === undefined ||
            dados.ano === null
        ) {
            throw new AppError(
                'ano é obrigatório.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'ano'
                    }
                }
            );
        }

        return this.periodoRepository.create(
            dados,
            options
        );
    }

    async listar(options = {}) {
        return this.periodoRepository.findAll(
            options
        );
    }

    async buscarPorId(id, options = {}) {
        const periodoId = Number(id);

        if (
            !Number.isInteger(periodoId) ||
            periodoId < 1
        ) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'id'
                    }
                }
            );
        }

        const periodo =
            await this.periodoRepository.findById(
                periodoId,
                options
            );

        if (!periodo) {
            throw new AppError(
                'Período não encontrado.',
                {
                    statusCode: 404,
                    code: 'PERIODO_NOT_FOUND',
                    details: {
                        id: periodoId
                    }
                }
            );
        }

        return periodo;
    }
}

export default PeriodoService;
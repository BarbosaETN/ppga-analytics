'use strict';

import AppError from '../errors/AppError.js';
import ProgramaRepository from '../repositories/ProgramaRepository.js';
import InstituicaoRepository from '../repositories/InstituicaoRepository.js';

class ProgramaService {
    constructor() {
        this.programaRepository = new ProgramaRepository();
        this.instituicaoRepository = new InstituicaoRepository();
    }

    async criar(dados, options = {}) {
        const instituicaoId = Number(
            dados.instituicao_id
        );

        if (
            !Number.isInteger(instituicaoId) ||
            instituicaoId < 1
        ) {
            throw new AppError(
                'instituicao_id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'instituicao_id'
                    }
                }
            );
        }

        const instituicao =
            await this.instituicaoRepository.findById(
                instituicaoId,
                options
            );

        if (!instituicao) {
            throw new AppError(
                'Instituição não encontrada.',
                {
                    statusCode: 404,
                    code: 'INSTITUICAO_NOT_FOUND',
                    details: {
                        id: instituicaoId
                    }
                }
            );
        }

        const nome = dados.nome?.trim();

        if (!nome) {
            throw new AppError(
                'nome é obrigatório.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'nome'
                    }
                }
            );
        }

        const dadosPrograma = {
            instituicao_id: instituicaoId,
            nome,
            sigla: dados.sigla?.trim() || null
        };

        return this.programaRepository.create(
            dadosPrograma,
            options
        );
    }
}

export default ProgramaService;
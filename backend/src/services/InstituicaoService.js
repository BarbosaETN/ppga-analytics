'use strict';

import AppError from '../errors/AppError.js';
import InstituicaoRepository from '../repositories/InstituicaoRepository.js';

class InstituicaoService {
    constructor() {
        this.instituicaoRepository = new InstituicaoRepository();
    }

    async criar(dados, options = {}) {
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

        const dadosInstituicao = {
            nome,
            sigla: dados.sigla?.trim() || null
        };

        return this.instituicaoRepository.create(
            dadosInstituicao,
            options
        );
    }

    async listar(options = {}) {
        return this.instituicaoRepository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const instituicaoId = Number(id);

        if (
            !Number.isInteger(instituicaoId) ||
            instituicaoId < 1
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

        return instituicao;
    }

    async atualizar(id, dados, options = {}) {
        const instituicaoId = Number(id);

        if (
            !Number.isInteger(instituicaoId) ||
            instituicaoId < 1
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

        const camposPermitidos = [
            'nome',
            'sigla'
        ];

        const dadosAtualizacao = {};

        for (const campo of camposPermitidos) {
            if (dados[campo] !== undefined) {
                dadosAtualizacao[campo] =
                    typeof dados[campo] === 'string'
                        ? dados[campo].trim()
                        : dados[campo];
            }
        }

        if (Object.keys(dadosAtualizacao).length === 0) {
            throw new AppError(
                'Nenhum campo válido para atualização foi informado.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campos_permitidos: camposPermitidos
                    }
                }
            );
        }

        if (
            dadosAtualizacao.nome !== undefined &&
            !dadosAtualizacao.nome
        ) {
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

        if (dadosAtualizacao.sigla === '') {
            dadosAtualizacao.sigla = null;
        }

        await instituicao.update(
            dadosAtualizacao,
            options
        );

        return instituicao;
    }

    async excluir(id, options = {}) {
        const instituicaoId = Number(id);

        if (
            !Number.isInteger(instituicaoId) ||
            instituicaoId < 1
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

        try {
            await instituicao.destroy(options);
        } catch (error) {
            if (
                error.name === 'SequelizeForeignKeyConstraintError'
            ) {
                throw new AppError(
                    'Não é possível excluir a instituição porque existem registros relacionados.',
                    {
                        statusCode: 409,
                        code: 'INSTITUICAO_HAS_DEPENDENCIES',
                        details: {
                            id: instituicaoId
                        }
                    }
                );
            }

            throw error;
        }
    }
}

export default InstituicaoService;
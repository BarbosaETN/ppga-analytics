'use strict';

import AppError from '../errors/AppError.js';
import ProjetoExtensaoRepository from '../repositories/ProjetoExtensaoRepository.js';
import ProcessamentoRepository from '../repositories/ProcessamentoRepository.js';

class ProjetoExtensaoService {
    constructor() {
        this.projetoExtensaoRepository =
            new ProjetoExtensaoRepository();

        this.processamentoRepository =
            new ProcessamentoRepository();
    }

    async criar(dados, options = {}) {
        const titulo = dados.titulo?.trim();

        if (!titulo) {
            throw new AppError(
                'titulo é obrigatório.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'titulo'
                    }
                }
            );
        }

        let processamentoId = dados.processamento_id ?? null;

        if (processamentoId !== null) {
            processamentoId = Number(processamentoId);

            if (
                !Number.isInteger(processamentoId) ||
                processamentoId < 1
            ) {
                throw new AppError(
                    'processamento_id deve ser um número inteiro positivo.',
                    {
                        statusCode: 400,
                        code: 'VALIDATION_ERROR',
                        details: {
                            campo: 'processamento_id'
                        }
                    }
                );
            }

            const processamento =
                await this.processamentoRepository.findById(
                    processamentoId,
                    options
                );

            if (!processamento) {
                throw new AppError(
                    'Processamento não encontrado.',
                    {
                        statusCode: 404,
                        code: 'PROCESSAMENTO_NOT_FOUND',
                        details: {
                            id: processamentoId
                        }
                    }
                );
            }
        }

        const dadosProjeto = {
            titulo,
            descricao: dados.descricao?.trim() || null,
            ano_inicio: dados.ano_inicio ?? null,
            ano_fim: dados.ano_fim ?? null,
            processamento_id: processamentoId
        };

        return this.projetoExtensaoRepository.create(
            dadosProjeto,
            options
        );
    }

    async listar(options = {}) {
        return this.projetoExtensaoRepository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const projetoId = Number(id);

        if (
            !Number.isInteger(projetoId) ||
            projetoId < 1
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

        const projeto =
            await this.projetoExtensaoRepository.findById(
                projetoId,
                options
            );

        if (!projeto) {
            throw new AppError(
                'Projeto de extensão não encontrado.',
                {
                    statusCode: 404,
                    code: 'PROJETO_EXTENSAO_NOT_FOUND',
                    details: {
                        id: projetoId
                    }
                }
            );
        }

        return projeto;
    }

    async atualizar(id, dados, options = {}) {
        const projetoId = Number(id);

        if (
            !Number.isInteger(projetoId) ||
            projetoId < 1
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

        const projeto =
            await this.projetoExtensaoRepository.findById(
                projetoId,
                options
            );

        if (!projeto) {
            throw new AppError(
                'Projeto de extensão não encontrado.',
                {
                    statusCode: 404,
                    code: 'PROJETO_EXTENSAO_NOT_FOUND',
                    details: {
                        id: projetoId
                    }
                }
            );
        }

        const camposPermitidos = [
            'titulo',
            'descricao',
            'ano_inicio',
            'ano_fim',
            'processamento_id'
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
            dadosAtualizacao.titulo !== undefined &&
            !dadosAtualizacao.titulo
        ) {
            throw new AppError(
                'titulo é obrigatório.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: {
                        campo: 'titulo'
                    }
                }
            );
        }

        if (dadosAtualizacao.descricao === '') {
            dadosAtualizacao.descricao = null;
        }

        if (
            dadosAtualizacao.processamento_id !== undefined &&
            dadosAtualizacao.processamento_id !== null
        ) {
            const processamentoId =
                Number(dadosAtualizacao.processamento_id);

            if (
                !Number.isInteger(processamentoId) ||
                processamentoId < 1
            ) {
                throw new AppError(
                    'processamento_id deve ser um número inteiro positivo.',
                    {
                        statusCode: 400,
                        code: 'VALIDATION_ERROR',
                        details: {
                            campo: 'processamento_id'
                        }
                    }
                );
            }

            const processamento =
                await this.processamentoRepository.findById(
                    processamentoId,
                    options
                );

            if (!processamento) {
                throw new AppError(
                    'Processamento não encontrado.',
                    {
                        statusCode: 404,
                        code: 'PROCESSAMENTO_NOT_FOUND',
                        details: {
                            id: processamentoId
                        }
                    }
                );
            }

            dadosAtualizacao.processamento_id = processamentoId;
        }

        await projeto.update(
            dadosAtualizacao,
            options
        );

        return projeto;
    }

    async excluir(id, options = {}) {
        const projetoId = Number(id);

        if (
            !Number.isInteger(projetoId) ||
            projetoId < 1
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

        const projeto =
            await this.projetoExtensaoRepository.findById(
                projetoId,
                options
            );

        if (!projeto) {
            throw new AppError(
                'Projeto de extensão não encontrado.',
                {
                    statusCode: 404,
                    code: 'PROJETO_EXTENSAO_NOT_FOUND',
                    details: {
                        id: projetoId
                    }
                }
            );
        }

        try {
            await projeto.destroy(options);
        } catch (error) {
            if (
                error.name === 'SequelizeForeignKeyConstraintError'
            ) {
                throw new AppError(
                    'Não é possível excluir o projeto de extensão porque existem registros relacionados.',
                    {
                        statusCode: 409,
                        code: 'PROJETO_EXTENSAO_HAS_DEPENDENCIES',
                        details: {
                            id: projetoId
                        }
                    }
                );
            }

            throw error;
        }
    }
}

export default ProjetoExtensaoService;
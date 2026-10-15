'use strict';

import AppError from '../errors/AppError.js';
import FormacaoRepository from '../repositories/FormacaoRepository.js';
import DocenteRepository from '../repositories/DocenteRepository.js';

class FormacaoService {
    constructor() {
        this.formacaoRepository = new FormacaoRepository();
        this.docenteRepository = new DocenteRepository();
    }

    async criar(dados, options = {}) {
        const docenteId = Number(dados.docente_id);

        if (!Number.isInteger(docenteId) || docenteId < 1) {
            throw new AppError(
                'docente_id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'docente_id' }
                }
            );
        }

        const docente = await this.docenteRepository.findById(
            docenteId,
            options
        );

        if (!docente) {
            throw new AppError('Docente não encontrado.', {
                statusCode: 404,
                code: 'DOCENTE_NOT_FOUND',
                details: { id: docenteId }
            });
        }

        if (!dados.nivel || !dados.nivel.trim()) {
            throw new AppError('O nível da formação é obrigatório.', {
                statusCode: 400,
                code: 'VALIDATION_ERROR',
                details: { campo: 'nivel' }
            });
        }

        const dadosFormacao = {
            docente_id: docenteId,
            nivel: dados.nivel.trim(),
            curso: dados.curso?.trim() || null,
            instituicao: dados.instituicao?.trim() || null,
            ano_inicio: dados.ano_inicio ?? null,
            ano_conclusao: dados.ano_conclusao ?? null,
            titulo: dados.titulo?.trim() || null
        };

        return this.formacaoRepository.create(
            dadosFormacao,
            options
        );
    }

    async listar(options = {}) {
        return this.formacaoRepository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const formacaoId = Number(id);

        if (!Number.isInteger(formacaoId) || formacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const formacao = await this.formacaoRepository.findById(
            formacaoId,
            options
        );

        if (!formacao) {
            throw new AppError('Formação não encontrada.', {
                statusCode: 404,
                code: 'FORMACAO_NOT_FOUND',
                details: { id: formacaoId }
            });
        }

        return formacao;
    }

    async atualizar(id, dados, options = {}) {
        const formacaoId = Number(id);

        if (!Number.isInteger(formacaoId) || formacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const formacao = await this.formacaoRepository.findById(
            formacaoId,
            options
        );

        if (!formacao) {
            throw new AppError('Formação não encontrada.', {
                statusCode: 404,
                code: 'FORMACAO_NOT_FOUND',
                details: { id: formacaoId }
            });
        }

        const dadosAtualizacao = {};

        if (dados.docente_id !== undefined) {
            const docenteId = Number(dados.docente_id);

            if (!Number.isInteger(docenteId) || docenteId < 1) {
                throw new AppError(
                    'docente_id deve ser um número inteiro positivo.',
                    {
                        statusCode: 400,
                        code: 'VALIDATION_ERROR',
                        details: { campo: 'docente_id' }
                    }
                );
            }

            const docente = await this.docenteRepository.findById(
                docenteId,
                options
            );

            if (!docente) {
                throw new AppError('Docente não encontrado.', {
                    statusCode: 404,
                    code: 'DOCENTE_NOT_FOUND',
                    details: { id: docenteId }
                });
            }

            dadosAtualizacao.docente_id = docenteId;
        }

        if (dados.nivel !== undefined) {
            if (!dados.nivel || !dados.nivel.trim()) {
                throw new AppError(
                    'O nível da formação é obrigatório.',
                    {
                        statusCode: 400,
                        code: 'VALIDATION_ERROR',
                        details: { campo: 'nivel' }
                    }
                );
            }

            dadosAtualizacao.nivel = dados.nivel.trim();
        }

        if (dados.curso !== undefined) {
            dadosAtualizacao.curso = dados.curso?.trim() || null;
        }

        if (dados.instituicao !== undefined) {
            dadosAtualizacao.instituicao =
                dados.instituicao?.trim() || null;
        }

        if (dados.ano_inicio !== undefined) {
            dadosAtualizacao.ano_inicio = dados.ano_inicio;
        }

        if (dados.ano_conclusao !== undefined) {
            dadosAtualizacao.ano_conclusao = dados.ano_conclusao;
        }

        if (dados.titulo !== undefined) {
            dadosAtualizacao.titulo = dados.titulo?.trim() || null;
        }

        if (Object.keys(dadosAtualizacao).length === 0) {
            throw new AppError(
                'Nenhum campo válido para atualização foi informado.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR'
                }
            );
        }

        await formacao.update(dadosAtualizacao, options);

        return formacao;
    }

    async excluir(id, options = {}) {
        const formacaoId = Number(id);

        if (!Number.isInteger(formacaoId) || formacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const formacao = await this.formacaoRepository.findById(
            formacaoId,
            options
        );

        if (!formacao) {
            throw new AppError('Formação não encontrada.', {
                statusCode: 404,
                code: 'FORMACAO_NOT_FOUND',
                details: { id: formacaoId }
            });
        }

        await formacao.destroy(options);
    }
}

export default FormacaoService;
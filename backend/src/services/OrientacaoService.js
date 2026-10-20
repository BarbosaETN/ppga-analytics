'use strict';

import AppError from '../errors/AppError.js';
import OrientacaoRepository from '../repositories/OrientacaoRepository.js';
import DocenteRepository from '../repositories/DocenteRepository.js';
import AlunoRepository from '../repositories/AlunoRepository.js';

class OrientacaoService {
    constructor() {
        this.orientacaoRepository = new OrientacaoRepository();
        this.docenteRepository = new DocenteRepository();
        this.alunoRepository = new AlunoRepository();
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

        const alunoId = Number(dados.aluno_id);

        if (!Number.isInteger(alunoId) || alunoId < 1) {
            throw new AppError(
                'aluno_id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'aluno_id' }
                }
            );
        }

        const aluno = await this.alunoRepository.findById(
            alunoId,
            options
        );

        if (!aluno) {
            throw new AppError('Aluno não encontrado.', {
                statusCode: 404,
                code: 'ALUNO_NOT_FOUND',
                details: { id: alunoId }
            });
        }

        if (!dados.status || !dados.status.trim()) {
            throw new AppError('O status é obrigatório.', {
                statusCode: 400,
                code: 'VALIDATION_ERROR',
                details: { campo: 'status' }
            });
        }

        const dadosOrientacao = {
            docente_id: docenteId,
            aluno_id: alunoId,
            nivel: dados.nivel?.trim() || null,
            status: dados.status.trim(),
            titulo: dados.titulo?.trim() || null,
            ano_inicio: dados.ano_inicio ?? null,
            ano_conclusao: dados.ano_conclusao ?? null,
            processamento_id: dados.processamento_id ?? null
        };

        return this.orientacaoRepository.create(
            dadosOrientacao,
            options
        );
    }

    async listar(options = {}) {
        return this.orientacaoRepository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const orientacaoId = Number(id);

        if (!Number.isInteger(orientacaoId) || orientacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const orientacao = await this.orientacaoRepository.findById(
            orientacaoId,
            options
        );

        if (!orientacao) {
            throw new AppError('Orientação não encontrada.', {
                statusCode: 404,
                code: 'ORIENTACAO_NOT_FOUND',
                details: { id: orientacaoId }
            });
        }

        return orientacao;
    }

    async atualizar(id, dados, options = {}) {
        const orientacaoId = Number(id);

        if (!Number.isInteger(orientacaoId) || orientacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const orientacao = await this.orientacaoRepository.findById(
            orientacaoId,
            options
        );

        if (!orientacao) {
            throw new AppError('Orientação não encontrada.', {
                statusCode: 404,
                code: 'ORIENTACAO_NOT_FOUND',
                details: { id: orientacaoId }
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

        if (dados.aluno_id !== undefined) {
            const alunoId = Number(dados.aluno_id);

            if (!Number.isInteger(alunoId) || alunoId < 1) {
                throw new AppError(
                    'aluno_id deve ser um número inteiro positivo.',
                    {
                        statusCode: 400,
                        code: 'VALIDATION_ERROR',
                        details: { campo: 'aluno_id' }
                    }
                );
            }

            const aluno = await this.alunoRepository.findById(
                alunoId,
                options
            );

            if (!aluno) {
                throw new AppError('Aluno não encontrado.', {
                    statusCode: 404,
                    code: 'ALUNO_NOT_FOUND',
                    details: { id: alunoId }
                });
            }

            dadosAtualizacao.aluno_id = alunoId;
        }

        if (dados.nivel !== undefined) {
            dadosAtualizacao.nivel =
                dados.nivel?.trim() || null;
        }

        if (dados.status !== undefined) {
            if (!dados.status || !dados.status.trim()) {
                throw new AppError('O status é obrigatório.', {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'status' }
                });
            }

            dadosAtualizacao.status = dados.status.trim();
        }

        if (dados.titulo !== undefined) {
            dadosAtualizacao.titulo =
                dados.titulo?.trim() || null;
        }

        if (dados.ano_inicio !== undefined) {
            dadosAtualizacao.ano_inicio = dados.ano_inicio;
        }

        if (dados.ano_conclusao !== undefined) {
            dadosAtualizacao.ano_conclusao =
                dados.ano_conclusao;
        }

        if (dados.processamento_id !== undefined) {
            dadosAtualizacao.processamento_id =
                dados.processamento_id;
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

        await orientacao.update(
            dadosAtualizacao,
            options
        );

        return orientacao;
    }

    async excluir(id, options = {}) {
        const orientacaoId = Number(id);

        if (!Number.isInteger(orientacaoId) || orientacaoId < 1) {
            throw new AppError(
                'id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    details: { campo: 'id' }
                }
            );
        }

        const orientacao = await this.orientacaoRepository.findById(
            orientacaoId,
            options
        );

        if (!orientacao) {
            throw new AppError('Orientação não encontrada.', {
                statusCode: 404,
                code: 'ORIENTACAO_NOT_FOUND',
                details: { id: orientacaoId }
            });
        }

        await orientacao.destroy(options);
    }
}

export default OrientacaoService;
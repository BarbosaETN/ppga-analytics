'use strict';

import { validarDadosPessoa } from '../validators/pessoa.validator.js';
import PessoaRepository from '../repositories/PessoaRepository.js';
import AppError from '../errors/AppError.js';
import { ForeignKeyConstraintError } from 'sequelize';

class PessoaService {
    constructor(pessoaRepository = new PessoaRepository()) {
        this.pessoaRepository = pessoaRepository;
    }

    async encontrarOuCriar(dadosPessoa, options = {}) {
        const {
            nome_completo,
            identificador_lattes,
            nome_normalizado
        } = validarDadosPessoa(dadosPessoa);

        if (identificador_lattes) {
            const pessoaExistente = await this.pessoaRepository.findByLattes(
                identificador_lattes,
                options
            );

            if (pessoaExistente) {
                return {
                    pessoa: pessoaExistente,
                    criada: false
                };
            }
        }

        const pessoaCriada = await this.pessoaRepository.create(
            {
                nome_completo,
                identificador_lattes: identificador_lattes ?? null,
                nome_normalizado: nome_normalizado ?? null
            },
            options
        );

        return {
            pessoa: pessoaCriada,
            criada: true
        };
    }

    async listar(options = {}) {
        return this.pessoaRepository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const pessoaId = Number(id);

        if (!Number.isInteger(pessoaId) || pessoaId < 1) {
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

        const pessoa = await this.pessoaRepository.findById(
            pessoaId,
            options
        );

        if (!pessoa) {
            throw new AppError(
                'Pessoa não encontrada.',
                {
                    statusCode: 404,
                    code: 'PESSOA_NOT_FOUND',
                    details: {
                        id: pessoaId
                    }
                }
            );
        }

        return pessoa;
    }

    async atualizar(id, dados, options = {}) {
        const pessoaId = Number(id);

        if (!Number.isInteger(pessoaId) || pessoaId < 1) {
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

        const pessoa = await this.pessoaRepository.findById(
            pessoaId,
            options
        );

        if (!pessoa) {
            throw new AppError(
                'Pessoa não encontrada.',
                {
                    statusCode: 404,
                    code: 'PESSOA_NOT_FOUND',
                    details: {
                        id: pessoaId
                    }
                }
            );
        }

        const camposPermitidos = [
            'nome_completo',
            'identificador_lattes',
            'nome_normalizado'
        ];

        const dadosAtualizacao = {};

        for (const campo of camposPermitidos) {
            if (dados[campo] !== undefined) {
                dadosAtualizacao[campo] = dados[campo];
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
            dadosAtualizacao.identificador_lattes !== undefined &&
            dadosAtualizacao.identificador_lattes !== null
        ) {
            const pessoaExistente =
                await this.pessoaRepository.findByLattes(
                    dadosAtualizacao.identificador_lattes
                );

            if (
                pessoaExistente &&
                pessoaExistente.id !== pessoaId
            ) {
                throw new AppError(
                    'Identificador Lattes já está vinculado a outra pessoa.',
                    {
                        statusCode: 409,
                        code: 'LATTES_ALREADY_EXISTS',
                        details: {
                            identificador_lattes:
                                dadosAtualizacao.identificador_lattes
                        }
                    }
                );
            }
        }

        await pessoa.update(dadosAtualizacao, options);

        return pessoa;
    }

    async remover(id, options = {}) {
        const pessoaId = Number(id);

        if (!Number.isInteger(pessoaId) || pessoaId < 1) {
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

        const pessoa = await this.pessoaRepository.findById(
            pessoaId,
            options
        );

        if (!pessoa) {
            throw new AppError(
                'Pessoa não encontrada.',
                {
                    statusCode: 404,
                    code: 'PESSOA_NOT_FOUND',
                    details: {
                        id: pessoaId
                    }
                }
            );
        }

        try {
            await this.pessoaRepository.delete({
                where: {
                    id: pessoaId
                },
                ...options
            });
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                throw new AppError(
                    'Não é possível excluir a pessoa porque existem registros relacionados.',
                    {
                        statusCode: 409,
                        code: 'PESSOA_HAS_DEPENDENCIES',
                        details: {
                            id: pessoaId
                        }
                    }
                );
            }

            throw error;
        }

        return pessoa;
    }
}

export default PessoaService;
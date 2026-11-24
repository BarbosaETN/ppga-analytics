'use strict';

import AppError from '../errors/AppError.js';
import ParticipacaoProjetoExtensaoRepository from '../repositories/ParticipacaoProjetoExtensaoRepository.js';
import ProjetoExtensaoRepository from '../repositories/ProjetoExtensaoRepository.js';
import PessoaRepository from '../repositories/PessoaRepository.js';

class ParticipacaoProjetoExtensaoService {
    constructor() {
        this.repository = new ParticipacaoProjetoExtensaoRepository();
        this.projetoExtensaoRepository = new ProjetoExtensaoRepository();
        this.pessoaRepository = new PessoaRepository();
    }

    async criar(dados, options = {}) {
        const { projeto_id } = dados;

        if (
            !Number.isInteger(projeto_id) ||
            projeto_id <= 0
        ) {
            throw new AppError(
                'O projeto_id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR'
                }
            );
        }

        const projeto = await this.projetoExtensaoRepository.findById(
            projeto_id,
            options
        );

        if (!projeto) {
            throw new AppError(
                'O projeto de extensão informado não foi encontrado.',
                {
                    statusCode: 404,
                    code: 'PROJETO_EXTENSAO_NOT_FOUND'
                }
            );
        }

        const { pessoa_id } = dados;

        if (
            !Number.isInteger(pessoa_id) ||
            pessoa_id <= 0
        ) {
            throw new AppError(
                'O pessoa_id deve ser um número inteiro positivo.',
                {
                    statusCode: 400,
                    code: 'VALIDATION_ERROR'
                }
            );
        }

        const pessoa = await this.pessoaRepository.findById(
            pessoa_id,
            options
        );

        if (!pessoa) {
            throw new AppError(
                'A pessoa informada não foi encontrada.',
                {
                    statusCode: 404,
                    code: 'PESSOA_NOT_FOUND'
                }
            );
        }

        const papel = dados.papel?.trim() || null;

        const participacaoExistente =
            await this.repository.findByProjetoAndPessoa(
                projeto_id,
                pessoa_id,
                options
            );

        if (participacaoExistente) {
            throw new AppError(
                'A pessoa já participa deste projeto de extensão.',
                {
                    statusCode: 409,
                    code: 'PARTICIPACAO_PROJETO_EXTENSAO_ALREADY_EXISTS'
                }
            );
        }

        return this.repository.create(
            {
                projeto_id,
                pessoa_id,
                papel
            },
            options
        );
    }

    async listar(options = {}) {
        return this.repository.findAll(options);
    }

    async buscarPorId(id, options = {}) {
        const participacao = await this.repository.findById(
            id,
            options
        );

        if (!participacao) {
            throw new AppError(
                'A participação no projeto de extensão não foi encontrada.',
                {
                    statusCode: 404,
                    code: 'PARTICIPACAO_PROJETO_EXTENSAO_NOT_FOUND'
                }
            );
        }

        return participacao;
    }

    async atualizar(id, dados, options = {}) {
        const participacao = await this.buscarPorId(
            id,
            options
        );

        const papel = dados.papel?.trim() || null;

        await participacao.update(
            {
                papel
            },
            options
        );

        return participacao;
    }

    async excluir(id, options = {}) {
        const participacao = await this.buscarPorId(
            id,
            options
        );

        await participacao.destroy(options);
    }
}

export default ParticipacaoProjetoExtensaoService;
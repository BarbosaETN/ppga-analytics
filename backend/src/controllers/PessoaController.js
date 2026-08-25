'use strict';

import PessoaService from '../services/PessoaService.js';

class PessoaController {
    constructor(pessoaService = new PessoaService()) {
        this.pessoaService = pessoaService;
    }

    async criar(req, res, next) {
        try {
            const resultado = await this.pessoaService.encontrarOuCriar(
                req.body
            );

            return res.status(resultado.criada ? 201 : 200).json({
                data: resultado.pessoa,
                meta: {
                    criada: resultado.criada
                }
            });
        } catch (error) {
            return next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const pessoa = await this.pessoaService.buscarPorId(
                req.params.id
            );

            return res.status(200).json({
                data: pessoa
            });
        } catch (error) {
            return next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const pessoas = await this.pessoaService.listar();

            return res.status(200).json({
                data: pessoas
            });
        } catch (error) {
            return next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const pessoa = await this.pessoaService.atualizar(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                data: pessoa
            });
        } catch (error) {
            return next(error);
        }
    }

    async remover(req, res, next) {
        try {
            await this.pessoaService.remover(
                req.params.id
            );

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}

export default PessoaController;
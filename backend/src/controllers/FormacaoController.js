'use strict';

import FormacaoService from '../services/FormacaoService.js';

class FormacaoController {
    constructor() {
        this.formacaoService = new FormacaoService();
    }

    async criar(req, res, next) {
        try {
            const formacao = await this.formacaoService.criar(
                req.body
            );

            return res.status(201).json({
                data: formacao
            });
        } catch (error) {
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const formacoes = await this.formacaoService.listar();

            return res.status(200).json({
                data: formacoes
            });
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const formacao = await this.formacaoService.buscarPorId(
                req.params.id
            );

            return res.status(200).json({
                data: formacao
            });
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const formacao = await this.formacaoService.atualizar(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                data: formacao
            });
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            await this.formacaoService.excluir(req.params.id);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default FormacaoController;
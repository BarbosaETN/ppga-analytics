'use strict';

import OrientacaoService from '../services/OrientacaoService.js';

class OrientacaoController {
    constructor() {
        this.orientacaoService = new OrientacaoService();
    }

    async criar(req, res, next) {
        try {
            const orientacao = await this.orientacaoService.criar(
                req.body
            );

            return res.status(201).json({
                data: orientacao
            });
        } catch (error) {
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const orientacoes = await this.orientacaoService.listar();

            return res.status(200).json({
                data: orientacoes
            });
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const orientacao =
                await this.orientacaoService.buscarPorId(
                    req.params.id
                );

            return res.status(200).json({
                data: orientacao
            });
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const orientacao =
                await this.orientacaoService.atualizar(
                    req.params.id,
                    req.body
                );

            return res.status(200).json({
                data: orientacao
            });
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            await this.orientacaoService.excluir(
                req.params.id
            );

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default OrientacaoController;
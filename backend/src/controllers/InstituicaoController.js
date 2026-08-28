'use strict';

import InstituicaoService from '../services/InstituicaoService.js';

class InstituicaoController {
    constructor() {
        this.instituicaoService = new InstituicaoService();
    }

    async criar(req, res, next) {
        try {
            const instituicao =
                await this.instituicaoService.criar(
                    req.body
                );

            return res.status(201).json({
                data: instituicao
            });
        } catch (error) {
            return next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const instituicoes =
                await this.instituicaoService.listar();

            return res.status(200).json({
                data: instituicoes
            });
        } catch (error) {
            return next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const instituicao =
                await this.instituicaoService.buscarPorId(
                    req.params.id
                );

            return res.status(200).json({
                data: instituicao
            });
        } catch (error) {
            return next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const instituicao =
                await this.instituicaoService.atualizar(
                    req.params.id,
                    req.body
                );

            return res.status(200).json({
                data: instituicao
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default InstituicaoController;
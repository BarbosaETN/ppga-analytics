'use strict';

import AtividadeEnsinoService from '../services/AtividadeEnsinoService.js';

class AtividadeEnsinoController {
    constructor() {
        this.atividadeEnsinoService = new AtividadeEnsinoService();
    }

    async criar(req, res, next) {
        try {
            const atividade = await this.atividadeEnsinoService.criar(req.body);

            return res.status(201).json(atividade);
        } catch (error) {
            return next(error);
        }
    };

    async listar(req, res, next) {
        try {
            const atividades = await this.atividadeEnsinoService.listar();

            return res.status(200).json(atividades);
        } catch (error) {
            return next(error);
        }
    };

    async buscarPorId(req, res, next) {
        try {
            const atividade = await this.atividadeEnsinoService.buscarPorId(
                Number(req.params.id)
            );

            return res.status(200).json(atividade);
        } catch (error) {
            return next(error);
        }
    };

    async atualizar(req, res, next) {
        try {
            const atividade = await this.atividadeEnsinoService.atualizar(
                Number(req.params.id),
                req.body
            );

            return res.status(200).json(atividade);
        } catch (error) {
            return next(error);
        }
    };

    async excluir(req, res, next) {
        try {
            await this.atividadeEnsinoService.excluir(
                Number(req.params.id)
            );

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}

export default AtividadeEnsinoController;
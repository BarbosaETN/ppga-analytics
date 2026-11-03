'use strict';

import AtividadeEnsinoService from '../services/AtividadeEnsinoService.js';

class AtividadeEnsinoController {
    constructor() {
        this.service = new AtividadeEnsinoService();
    }

    criar = async (req, res, next) => {
        try {
            const atividade = await this.service.criar(req.body);

            return res.status(201).json({
                data: atividade
            });
        } catch (error) {
            return next(error);
        }
    };

    listar = async (req, res, next) => {
        try {
            const atividades = await this.service.listar();

            return res.status(200).json({
                data: atividades
            });
        } catch (error) {
            return next(error);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            const atividade = await this.service.buscarPorId(
                Number(req.params.id)
            );

            return res.status(200).json({
                data: atividade
            });
        } catch (error) {
            return next(error);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            const atividade = await this.service.atualizar(
                Number(req.params.id),
                req.body
            );

            return res.status(200).json({
                data: atividade
            });
        } catch (error) {
            return next(error);
        }
    };

    excluir = async (req, res, next) => {
        try {
            await this.service.excluir(Number(req.params.id));

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}

export default AtividadeEnsinoController;
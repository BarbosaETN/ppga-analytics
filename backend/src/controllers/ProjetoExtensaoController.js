'use strict';

import ProjetoExtensaoService from '../services/ProjetoExtensaoService.js';

class ProjetoExtensaoController {
    constructor() {
        this.service = new ProjetoExtensaoService();
    }

    async criar(req, res, next) {
        try {
            const projeto = await this.service.criar(req.body);

            return res.status(201).json({
                data: projeto
            });
        } catch (error) {
            return next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const projetos = await this.service.listar();

            return res.status(200).json({
                data: projetos
            });
        } catch (error) {
            return next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const projeto = await this.service.buscarPorId(
                Number(req.params.id)
            );

            return res.status(200).json({
                data: projeto
            });
        } catch (error) {
            return next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const projeto = await this.service.atualizar(
                Number(req.params.id),
                req.body
            );

            return res.status(200).json({
                data: projeto
            });
        } catch (error) {
            return next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            await this.service.excluir(
                Number(req.params.id)
            );

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}

export default ProjetoExtensaoController;
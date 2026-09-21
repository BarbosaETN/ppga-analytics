'use strict';

import AlunoService from '../services/AlunoService.js';

class AlunoController {
    constructor() {
        this.alunoService =
            new AlunoService();
    }

    async criar(req, res, next) {
        try {
            const aluno =
                await this.alunoService.criar(
                    req.body
                );

            return res.status(201).json({
                data: aluno
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default AlunoController;
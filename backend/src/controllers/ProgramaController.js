'use strict';

import ProgramaService from '../services/ProgramaService.js';

class ProgramaController {
    constructor() {
        this.programaService =
            new ProgramaService();
    }

    async criar(req, res, next) {
        try {
            const programa =
                await this.programaService.criar(
                    req.body
                );

            return res.status(201).json({
                data: programa
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default ProgramaController;
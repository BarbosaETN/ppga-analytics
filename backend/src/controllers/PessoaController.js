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
}

export default PessoaController;
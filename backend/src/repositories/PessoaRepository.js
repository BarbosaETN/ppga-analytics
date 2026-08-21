'use strict';

import BaseRepository from './BaseRepository.js';
import Pessoa from '../database/models/pessoa.js';

class PessoaRepository extends BaseRepository {
    constructor() {
        super(Pessoa);
    }

    async findByLattes(identificadorLattes, options = {}) {
        return this.model.findOne({
            ...options,
            where: {
                ...options.where,
                identificador_lattes: identificadorLattes
            }
        });
    }
}

export default PessoaRepository;
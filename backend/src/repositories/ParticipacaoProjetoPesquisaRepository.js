'use strict';

import BaseRepository from './BaseRepository.js';
import ParticipacaoProjetoPesquisa from '../database/models/participacao-projeto-pesquisa.js';

class ParticipacaoProjetoPesquisaRepository extends BaseRepository {
    constructor() {
        super(ParticipacaoProjetoPesquisa);
    }

    async findByProjetoAndPessoa(projeto_id, pessoa_id, options = {}) {
        return this.model.findOne({
            where: {
                projeto_id,
                pessoa_id
            },
            ...options
        });
    }
}

export default ParticipacaoProjetoPesquisaRepository;
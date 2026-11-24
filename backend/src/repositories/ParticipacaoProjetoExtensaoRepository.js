'use strict';

import BaseRepository from './BaseRepository.js';
import ParticipacaoProjetoExtensao from '../database/models/participacao-projeto-extensao.js';

class ParticipacaoProjetoExtensaoRepository extends BaseRepository {
    constructor() {
        super(ParticipacaoProjetoExtensao);
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

export default ParticipacaoProjetoExtensaoRepository;
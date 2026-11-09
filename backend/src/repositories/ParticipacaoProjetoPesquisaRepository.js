'use strict';

import BaseRepository from './BaseRepository.js';
import ParticipacaoProjetoPesquisa from '../database/models/participacao-projeto-pesquisa.js';

class ParticipacaoProjetoPesquisaRepository extends BaseRepository {
    constructor() {
        super(ParticipacaoProjetoPesquisa);
    }
}

export default ParticipacaoProjetoPesquisaRepository;
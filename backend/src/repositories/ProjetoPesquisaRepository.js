'use strict';

import BaseRepository from './BaseRepository.js';
import ProjetoPesquisa from '../database/models/projeto-pesquisa.js';

class ProjetoPesquisaRepository extends BaseRepository {
    constructor() {
        super(ProjetoPesquisa);
    }
}

export default ProjetoPesquisaRepository;
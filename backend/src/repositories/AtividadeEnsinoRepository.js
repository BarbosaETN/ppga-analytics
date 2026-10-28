'use strict';

import BaseRepository from './BaseRepository.js';
import AtividadeEnsino from '../database/models/atividade-ensino.js';

class AtividadeEnsinoRepository extends BaseRepository {
    constructor() {
        super(AtividadeEnsino);
    }
}

export default AtividadeEnsinoRepository;
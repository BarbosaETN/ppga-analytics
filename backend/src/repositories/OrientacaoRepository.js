'use strict';

import BaseRepository from './BaseRepository.js';
import Orientacao from '../database/models/orientacao.js';

class OrientacaoRepository extends BaseRepository {
    constructor() {
        super(Orientacao);
    }
}

export default OrientacaoRepository;
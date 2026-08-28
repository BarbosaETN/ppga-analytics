'use strict';

import BaseRepository from './BaseRepository.js';
import Instituicao from '../database/models/instituicao.js';

class InstituicaoRepository extends BaseRepository {
    constructor() {
        super(Instituicao);
    }
}

export default InstituicaoRepository;
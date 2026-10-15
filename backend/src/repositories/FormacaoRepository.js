'use strict';

import BaseRepository from './BaseRepository.js';
import Formacao from '../database/models/formacao.js';

class FormacaoRepository extends BaseRepository {
    constructor() {
        super(Formacao);
    }
}

export default FormacaoRepository;
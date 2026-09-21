'use strict';

import BaseRepository from './BaseRepository.js';
import Aluno from '../database/models/aluno.js';

class AlunoRepository extends BaseRepository {
    constructor() {
        super(Aluno);
    }
}

export default AlunoRepository;
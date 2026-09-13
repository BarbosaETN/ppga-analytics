'use strict';

import BaseRepository from './BaseRepository.js';
import Programa from '../database/models/programa.js';

class ProgramaRepository extends BaseRepository {
    constructor() {
        super(Programa);
    }
}

export default ProgramaRepository;
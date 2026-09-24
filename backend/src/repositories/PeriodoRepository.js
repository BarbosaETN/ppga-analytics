'use strict';

import BaseRepository from './BaseRepository.js';
import Periodo from '../database/models/periodo.js';

class PeriodoRepository extends BaseRepository {
    constructor() {
        super(Periodo);
    }
}

export default PeriodoRepository;
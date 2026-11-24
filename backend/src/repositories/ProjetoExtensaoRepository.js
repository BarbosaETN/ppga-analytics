'use strict';

import BaseRepository from './BaseRepository.js';
import ProjetoExtensao from '../database/models/projeto-extensao.js';

class ProjetoExtensaoRepository extends BaseRepository {
    constructor() {
        super(ProjetoExtensao);
    }
}

export default ProjetoExtensaoRepository;
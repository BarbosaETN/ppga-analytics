"use strict";

import BaseRepository from "./BaseRepository.js";
import Processamento from "../database/models/processamento.js";

class ProcessamentoRepository extends BaseRepository {
  constructor() {
    super(Processamento);
  }
}

export default ProcessamentoRepository;
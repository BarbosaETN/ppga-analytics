"use strict";

import BaseRepository from "./BaseRepository.js";
import Importacao from "../database/models/importacao.js";

class ImportacaoRepository extends BaseRepository {
  constructor() {
    super(Importacao);
  }
}

export default ImportacaoRepository;
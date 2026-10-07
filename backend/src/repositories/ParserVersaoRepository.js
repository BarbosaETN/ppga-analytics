"use strict";

import BaseRepository from "./BaseRepository.js";
import ParserVersao from "../database/models/parser-versao.js";

class ParserVersaoRepository extends BaseRepository {
  constructor() {
    super(ParserVersao);
  }
}

export default ParserVersaoRepository;
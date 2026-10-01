"use strict";

import BaseRepository from "./BaseRepository.js";
import Docente from "../database/models/docente.js";

class DocenteRepository extends BaseRepository {
  constructor() {
    super(Docente);
  }
}

export default DocenteRepository;
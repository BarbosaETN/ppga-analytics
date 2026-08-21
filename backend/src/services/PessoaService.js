'use strict';

import { validarDadosPessoa } from '../validators/pessoa.validator.js';
import PessoaRepository from '../repositories/PessoaRepository.js';

class PessoaService {
    constructor(pessoaRepository = new PessoaRepository()) {
        this.pessoaRepository = pessoaRepository;
    }

    async encontrarOuCriar(dadosPessoa, options = {}) {
        const {
            nome_completo,
            identificador_lattes,
            nome_normalizado
        } = validarDadosPessoa(dadosPessoa);

        if (identificador_lattes) {
            const pessoaExistente = await this.pessoaRepository.findByLattes(
                identificador_lattes,
                options
            );

            if (pessoaExistente) {
                return {
                    pessoa: pessoaExistente,
                    criada: false
                };
            }
        }

        const pessoaCriada = await this.pessoaRepository.create(
            {
                nome_completo,
                identificador_lattes: identificador_lattes ?? null,
                nome_normalizado: nome_normalizado ?? null
            },
            options
        );

        return {
            pessoa: pessoaCriada,
            criada: true
        };
    }
}

export default PessoaService;
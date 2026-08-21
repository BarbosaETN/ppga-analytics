'use strict';

import AppError from "../errors/AppError";

function normalizarTexto(valor, campo) {
    if (valor === undefined || valor === null) {
        return null;
    }

    if (typeof valor !== 'string') {
        throw new AppError(
            `${campo} deve ser um texto.`,
            {
                statusCode: 400,
                code: 'VALIDATION_ERROR',
                details: {
                    campo
                }
            }
        );
    }

    const texto = valor.trim();

    return texto || null;
}

export function validarDadosPessoa(dadosPessoa) {
    if (!dadosPessoa || typeof dadosPessoa !== 'object') {
        throw new AppError(
            'Os dados da pessoa são obrigatórios.',
            {
                statusCode: 400,
                code: 'VALIDATION_ERROR'
            }
        );
    }

    const nomeCompleto = normalizarTexto(
        dadosPessoa.nome_completo,
        'nome_completo'
    );

    if (!nomeCompleto) {
        throw new AppError(
            'nome_completo é obrigatório.',
            {
                statusCode: 400,
                code: 'VALIDATION_ERROR',
                details: {
                    campo: 'nome_completo'
                }
            }
        );
    }

    return {
        nome_completo: nomeCompleto,
        identificador_lattes: normalizarTexto(
            dadosPessoa.identificador_lattes,
            'identificador_lattes'
        ),
        nome_normalizado: normalizarTexto(
            dadosPessoa.nome_normalizado,
            'nome_normalizado'
        )
    };
}
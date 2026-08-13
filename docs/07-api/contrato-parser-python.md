# Contrato Interno — Parser Python ↔ Backend Node.js

## 1. Objetivo

Definir a interface entre o componente de extração em Python e o backend Node.js.

Esse contrato é **interno ao sistema** e não é a API pública do frontend.

## 2. Responsabilidades

### Python

Recebe o PDF, extrai e estrutura os dados e devolve JSON.

### Node.js

Envia o PDF ao parser, valida o JSON, aplica regras de negócio e persiste os dados.

## 3. Regra principal

Python não acessa o banco.

Node.js não depende de detalhes internos do parser.

```text
PDF → Python → JSON → Node.js → SQLite
```

## 4. Resposta de sucesso

```json
{
  "status": "success",
  "parserVersion": "1.0.0",
  "data": {
    "pessoa": {
      "nome": "João da Silva",
      "identificadorLattes": "1234567890123456"
    },
    "formacoes": [],
    "producoes": [],
    "orientacoes": [],
    "atividadesEnsino": [],
    "projetosPesquisa": [],
    "projetosExtensao": []
  },
  "warnings": []
}
```

## 5. Estrutura de produção

Exemplo:

```json
{
  "tipo": "ARTIGO",
  "titulo": "Título da produção",
  "ano": 2025,
  "doi": "10.xxxx/xxxxx",
  "periodico": "Nome do periódico",
  "autores": [
    {
      "nome": "João da Silva",
      "identificadorLattes": "1234567890123456",
      "ordem": 1
    }
  ]
}
```

Os tipos definitivos serão normalizados conforme o domínio validado.

## 6. Orientação

```json
{
  "docente": {
    "nome": "Docente"
  },
  "aluno": {
    "nome": "Aluno"
  },
  "nivel": "DOUTORADO",
  "status": "CONCLUIDA",
  "titulo": "Título",
  "anoInicio": 2022,
  "anoConclusao": 2025
}
```

## 7. Alertas

Alertas não impedem necessariamente o processamento.

```json
{
  "code": "POSSIVEL_DUPLICIDADE",
  "message": "Registro semelhante encontrado.",
  "context": { "campo": "nome" }
}
```

## 8. Erro

```json
{
  "status": "error",
  "parserVersion": "1.0.0",
  "error": {
    "code": "PDF_INVALIDO",
    "message": "O PDF não pôde ser processado."
  },
  "warnings": []
}
```

## 9. Versionamento

Toda resposta deverá informar `parserVersion`.

Mudanças incompatíveis no JSON deverão aumentar a versão do contrato.

## 10. Validação no Node.js

O Node.js deverá validar o JSON antes da persistência.

O parser não é considerado fonte de verdade para as regras de negócio; ele é fonte de dados extraídos.

## 11. POC

Antes da implementação definitiva, o contrato deverá ser validado com os cinco currículos utilizados nas POCs.

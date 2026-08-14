# Contrato Interno — Parser Python ↔ Backend Node.js

## 1. Objetivo

Definir o contrato de comunicação entre o componente de extração e interpretação de Currículos Lattes desenvolvido em **Python** e o **backend principal desenvolvido em Node.js**.

Este contrato é **interno ao sistema** e não representa a API pública consumida pelo frontend.

O objetivo é permitir que os dois componentes sejam desenvolvidos de forma independente, desde que ambos respeitem a estrutura definida neste documento.

---

## 2. Responsabilidades

### Python — Parser

O parser Python é responsável por:

- receber o arquivo PDF do Currículo Lattes;
- extrair o conteúdo do PDF;
- identificar e estruturar as informações encontradas;
- normalizar os dados extraídos;
- informar possíveis alertas de extração;
- devolver a resposta JSON conforme este contrato.

O parser Python **não deve**:

- acessar o banco de dados;
- persistir informações no SQLite;
- aplicar regras de negócio do PPGA;
- calcular indicadores;
- calcular pontuações;
- gerar rankings ou classificações;
- decidir como os dados serão armazenados no banco.

### Node.js — Backend

O backend Node.js é responsável por:

- enviar o PDF ao parser Python;
- receber a resposta JSON;
- validar a estrutura recebida;
- aplicar regras de negócio;
- tratar erros e alertas;
- identificar duplicidades de domínio;
- persistir os dados no SQLite;
- gerar indicadores e demais informações derivadas.

---

## 3. Regra principal

O Python **não acessa o banco de dados**.

O Node.js **não depende de detalhes internos da implementação do parser**.

A comunicação deve ocorrer exclusivamente por meio do contrato JSON definido neste documento.

```text
PDF → Python → JSON → Node.js → SQLite
```

O frontend não se comunica diretamente com o parser Python.

```text
Frontend → Node.js → Python
```

---

# 4. Resposta de sucesso

Quando o PDF for processado, mesmo que existam informações ausentes ou alertas, o parser deverá retornar:

```json
{
  "status": "success",
  "parserVersion": "1.0.0",
  "data": {
    "pessoa": {
      "nome": "João da Silva",
      "identificadorLattes": "1234567890123456",
      "nomeCitacoes": [],
      "ultimaAtualizacao": null
    },
    "formacoes": [],
    "atuacoesProfissionais": [],
    "producoes": [],
    "orientacoes": [],
    "projetos": [],
    "producaoTecnica": [],
    "inovacoes": []
  },
  "warnings": []
}
```

### Regras

- `status` deve ser `"success"`.
- `parserVersion` deve informar a versão do parser/contrato utilizada.
- `data` deve conter os dados extraídos.
- Coleções sem registros devem ser retornadas como `[]`.
- Informações que não puderem ser identificadas devem ser `null` quando o campo existir.
- O parser **não deve inventar informações ausentes**.
- `warnings` deve ser um array, mesmo quando vazio.

---

# 5. Pessoa

```json
{
  "pessoa": {
    "nome": "João da Silva",
    "identificadorLattes": "1234567890123456",
    "nomeCitacoes": [
      "SILVA, J."
    ],
    "ultimaAtualizacao": null
  }
}
```

### Campos

| Campo | Tipo | Observação |
|---|---|---|
| `nome` | string | Nome identificado no currículo |
| `identificadorLattes` | string/null | ID Lattes, quando identificado |
| `nomeCitacoes` | array | Nomes de citação encontrados |
| `ultimaAtualizacao` | string/null | Data da última atualização identificada |

O parser não deve gerar um `identificadorLattes` caso ele não esteja disponível no documento.

---

# 6. Formações

```json
{
  "formacoes": [
    {
      "nivel": "DOUTORADO",
      "curso": "Administração",
      "instituicao": "Universidade X",
      "anoInicio": 2015,
      "anoConclusao": 2019,
      "status": "CONCLUIDA",
      "origem": {
        "pagina": 12
      }
    }
  ]
}
```

### Campos

- `nivel`
- `curso`
- `instituicao`
- `anoInicio`
- `anoConclusao`
- `status`
- `origem`

Campos que não puderem ser identificados devem receber `null`.

---

# 7. Atuação profissional

```json
{
  "atuacoesProfissionais": [
    {
      "instituicao": "Universidade X",
      "cargo": "Professor",
      "vinculo": "Servidor",
      "anoInicio": 2019,
      "anoFim": null,
      "origem": {
        "pagina": 20
      }
    }
  ]
}
```

Quando a atuação ainda estiver vigente, `anoFim` poderá ser `null`.

---

# 8. Produções

Todas as produções identificadas pelo parser deverão ser retornadas no array:

```json
{
  "producoes": []
}
```

Cada produção deverá possuir pelo menos:

```json
{
  "tipo": "ARTIGO",
  "titulo": "Título da produção",
  "ano": 2025,
  "autores": [],
  "origem": {
    "pagina": 30
  }
}
```

Os tipos deverão ser normalizados conforme o domínio definido pelo projeto.

Tipos previstos inicialmente:

```text
ARTIGO
LIVRO
CAPITULO
TRABALHO_EVENTO
```

Novos tipos poderão ser adicionados em versões compatíveis do contrato.

---

# 9. Artigo

Exemplo:

```json
{
  "tipo": "ARTIGO",
  "titulo": "Título do artigo",
  "ano": 2025,
  "periodico": "Nome do periódico",
  "volume": "10",
  "numero": "2",
  "paginas": {
    "inicio": 10,
    "fim": 25
  },
  "doi": null,
  "issn": null,
  "autores": [
    {
      "nome": "João da Silva",
      "identificadorLattes": null,
      "ordem": 1
    }
  ],
  "origem": {
    "pagina": 30
  }
}
```

### Campos

- `tipo`
- `titulo`
- `ano`
- `periodico`
- `volume`
- `numero`
- `paginas`
- `doi`
- `issn`
- `autores`
- `origem`

Informações bibliográficas que não estiverem presentes no currículo devem permanecer `null`.

---

# 10. Autores

Cada produção poderá possuir uma lista de autores:

```json
{
  "autores": [
    {
      "nome": "João da Silva",
      "identificadorLattes": null,
      "ordem": 1
    },
    {
      "nome": "Maria Souza",
      "identificadorLattes": null,
      "ordem": 2
    }
  ]
}
```

### Regras

- `nome` representa o nome identificado no documento.
- `identificadorLattes` poderá ser `null`.
- `ordem` representa a ordem de autoria encontrada no currículo.
- O parser não deve tentar descobrir externamente o ID Lattes de um coautor na versão 1.0.0.

---

# 11. Livros

```json
{
  "tipo": "LIVRO",
  "titulo": "Título do livro",
  "ano": 2024,
  "editora": "Editora X",
  "isbn": null,
  "autores": [],
  "origem": {
    "pagina": 40
  }
}
```

Campos opcionais podem receber `null` quando não identificados.

---

# 12. Capítulos de livros

```json
{
  "tipo": "CAPITULO",
  "titulo": "Título do capítulo",
  "ano": 2024,
  "livro": "Nome do livro",
  "editora": "Editora X",
  "isbn": null,
  "autores": [],
  "origem": {
    "pagina": 42
  }
}
```

---

# 13. Trabalhos em eventos

```json
{
  "tipo": "TRABALHO_EVENTO",
  "titulo": "Título do trabalho",
  "ano": 2024,
  "evento": "Congresso X",
  "autores": [],
  "origem": {
    "pagina": 50
  }
}
```

---

# 14. Orientações

```json
{
  "orientacoes": [
    {
      "docente": {
        "nome": "João da Silva",
        "identificadorLattes": "1234567890123456"
      },
      "aluno": {
        "nome": "Maria Souza",
        "identificadorLattes": null
      },
      "nivel": "DOUTORADO",
      "status": "CONCLUIDA",
      "titulo": "Título da tese",
      "anoInicio": 2020,
      "anoConclusao": 2024,
      "origem": {
        "pagina": 80
      }
    }
  ]
}
```

O parser deverá informar apenas as informações identificadas no currículo.

---

# 15. Projetos

Projetos serão retornados em uma coleção única, com o tipo identificado pelo parser:

```json
{
  "projetos": [
    {
      "tipo": "PESQUISA",
      "titulo": "Título do projeto",
      "descricao": null,
      "instituicao": "Universidade X",
      "anoInicio": 2023,
      "anoFim": null,
      "situacao": "EM_ANDAMENTO",
      "participacao": "COORDENADOR",
      "origem": {
        "pagina": 90
      }
    }
  ]
}
```

O parser informa os dados encontrados.

As regras de negócio relacionadas aos projetos serão aplicadas pelo Node.js.

---

# 16. Produção técnica

```json
{
  "producaoTecnica": [
    {
      "tipo": "RELATORIO",
      "titulo": "Título",
      "ano": 2024,
      "descricao": null,
      "origem": {
        "pagina": 100
      }
    }
  ]
}
```

---

# 17. Inovação

```json
{
  "inovacoes": [
    {
      "tipo": "PATENTE",
      "titulo": "Título",
      "ano": 2024,
      "descricao": null,
      "origem": {
        "pagina": 105
      }
    }
  ]
}
```

---

# 18. Origem dos dados

Quando possível, cada registro extraído deverá informar sua origem no documento:

```json
{
  "origem": {
    "pagina": 30
  }
}
```

A propriedade `confianca` poderá ser utilizada futuramente:

```json
{
  "origem": {
    "pagina": 30,
    "confianca": 0.97
  }
}
```

Na versão 1.0.0, `confianca` é opcional.

A finalidade da origem é permitir rastreabilidade e facilitar auditorias e correções.

---

# 19. Warnings

Warnings representam situações que não impedem necessariamente o processamento.

Exemplo:

```json
{
  "status": "success",
  "parserVersion": "1.0.0",
  "data": {},
  "warnings": [
    {
      "code": "CAMPO_NAO_IDENTIFICADO",
      "message": "Não foi possível identificar o DOI da produção.",
      "context": {
        "tipo": "ARTIGO",
        "titulo": "Título do artigo"
      }
    }
  ]
}
```

Outro exemplo:

```json
{
  "code": "POSSIVEL_DUPLICIDADE",
  "message": "Registro semelhante encontrado.",
  "context": {
    "campo": "titulo",
    "valor": "Título da produção"
  }
}
```

### Regra importante

Um warning **não significa que o processamento falhou**.

O Node.js deverá decidir se determinado warning exige alguma ação adicional.

---

# 20. Erros

Quando o parser não conseguir processar o PDF, deverá retornar:

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

Códigos previstos inicialmente:

```text
PDF_INVALIDO
PDF_VAZIO
PDF_NAO_SUPORTADO
ERRO_EXTRACAO
ERRO_PARSER
ESTRUTURA_NAO_IDENTIFICADA
```

O Python deve comunicar **erros relacionados ao processamento do documento**.

Regras de negócio do PPGA não devem ser transformadas em erros do parser.

---

# 21. O que o Python não deve enviar

O parser Python não deve enviar informações derivadas ou específicas da persistência do backend, como:

```text
pontuação
indicadores
ranking
classificação
nota
status acadêmico calculado
IDs internos do banco
IDs de registros do SQLite
regras de negócio
```

O princípio é:

> **Python informa o que encontrou no PDF. Node.js decide o significado e o que fazer com esses dados.**

---

# 22. Versionamento

Toda resposta deverá informar:

```json
{
  "parserVersion": "1.0.0"
}
```

O contrato seguirá versionamento semântico:

```text
MAJOR.MINOR.PATCH
```

### PATCH

Correções internas sem alteração incompatível no contrato.

```text
1.0.0 → 1.0.1
```

### MINOR

Adição de funcionalidades ou campos compatíveis.

```text
1.0.0 → 1.1.0
```

### MAJOR

Alterações incompatíveis na estrutura do contrato.

```text
1.0.0 → 2.0.0
```

O Node.js deverá validar a versão recebida antes de processar a resposta.

---

# 23. Validação no Node.js

O Node.js deverá validar a resposta do parser antes de qualquer persistência.

Fluxo:

```text
JSON recebido
     ↓
Validação estrutural
     ↓
Validação dos tipos
     ↓
Validação das regras de negócio
     ↓
Persistência
```

O parser Python **não é a fonte de verdade das regras de negócio**.

Ele é a fonte dos **dados extraídos do documento**.

---

# 24. Contrato completo de sucesso

Exemplo representativo:

```json
{
  "status": "success",
  "parserVersion": "1.0.0",
  "data": {
    "pessoa": {
      "nome": "João da Silva",
      "identificadorLattes": "1234567890123456",
      "nomeCitacoes": [],
      "ultimaAtualizacao": null
    },

    "formacoes": [],

    "atuacoesProfissionais": [],

    "producoes": [
      {
        "tipo": "ARTIGO",
        "titulo": "Título do artigo",
        "ano": 2025,
        "periodico": "Nome do periódico",
        "volume": "10",
        "numero": "2",
        "paginas": {
          "inicio": 10,
          "fim": 25
        },
        "doi": null,
        "issn": null,
        "autores": [
          {
            "nome": "João da Silva",
            "identificadorLattes": "1234567890123456",
            "ordem": 1
          }
        ],
        "origem": {
          "pagina": 30
        }
      }
    ],

    "orientacoes": [],

    "projetos": [],

    "producaoTecnica": [],

    "inovacoes": []
  },

  "warnings": []
}
```

---

# 25. POC e validação

Antes da implementação definitiva, o contrato deverá ser validado utilizando os **cinco currículos empregados nas POCs do projeto**.

A validação deverá verificar:

- processamento dos cinco PDFs;
- geração de resposta JSON válida;
- identificação do pesquisador;
- identificação das produções;
- estrutura dos autores;
- presença dos campos opcionais quando disponíveis;
- comportamento dos campos ausentes;
- funcionamento de warnings;
- funcionamento de erros;
- compatibilidade da resposta com o backend Node.js.

A aprovação do contrato ocorrerá quando o parser conseguir produzir respostas compatíveis com este documento sem exigir que o Node.js conheça detalhes internos da implementação Python.

---

# 26. Fluxo definitivo entre os desenvolvedores

```text
                    DEV 2
               Python / Parser
                     │
                     │ PDF
                     ▼
              ┌──────────────┐
              │    Parser    │
              └──────┬───────┘
                     │
                     │ JSON 1.0.0
                     ▼
              ┌──────────────┐
              │   DEV 1      │
              │   Node.js    │
              └──────┬───────┘
                     │
               Validação
                     │
               Regras de negócio
                     │
                     ▼
                  SQLite
```

O Dev 3, responsável pelo frontend, comunica-se apenas com o backend Node.js:

```text
Frontend → Node.js → Python
```

O frontend não precisa conhecer a existência ou a implementação do parser Python.

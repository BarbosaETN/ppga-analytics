# Arquitetura do Sistema — PPGA Analytics

## 1. Decisões técnicas atuais

| Camada | Tecnologia/decisão |
|---|---|
| Backend | Node.js + JavaScript |
| API | Express.js + REST |
| ORM | Sequelize |
| Banco | SQLite local |
| Parser/extração | Python |
| Comunicação parser ↔ backend | JSON |
| Entrada | Currículo Lattes em PDF |
| Frontend | A definir |
| Execução inicial | Um usuário / um computador |

A decisão atual separa o parser Python do backend Node.js. O Python é responsável pela extração e estruturação do currículo; o Node.js é responsável pela aplicação, regras de negócio, persistência e API.

---

## 2. Visão da arquitetura

```text
                         USUÁRIO
                            │
                            ▼
                       FRONTEND
                            │ REST/JSON
                            ▼
                    NODE.JS / EXPRESS
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        Importação PDF              API / Services
              │                           │
              ▼                           ▼
        PARSER PYTHON               Repositories
              │                           │
              │ JSON                      ▼
              └──────────────────────► Sequelize
                                          │
                                          ▼
                                       SQLite
```

O parser não acessa o SQLite diretamente.

---

## 3. Responsabilidades

### Node.js / Backend

Responsável por:

- HTTP/API;
- upload e controle das importações;
- comunicação com o parser Python;
- validação do JSON recebido;
- regras de negócio;
- normalização complementar quando necessária;
- deduplicação de dados persistidos;
- persistência via Sequelize;
- indicadores;
- relatórios;
- auditoria;
- consultas para o frontend.

### Python / Parser

Responsável por:

- receber o PDF;
- extrair informações do currículo;
- identificar seções e registros;
- normalizar dados no contexto da extração;
- validar a estrutura extraída;
- produzir o JSON do contrato interno;
- informar erros e alertas de extração.

O parser não deve:

- acessar o SQLite;
- executar regras de pontuação do sistema;
- conhecer Controllers ou rotas HTTP do backend;
- criar registros diretamente no banco.

### Frontend

Responsável por:

- interface;
- seleção/upload de PDFs;
- acompanhamento do processamento;
- consultas;
- dashboard;
- indicadores;
- relatórios.

---

## 4. Fluxo principal

```text
PDF
 ↓
Node.js recebe importação
 ↓
arquivo temporário
 ↓
Parser Python
 ↓
JSON padronizado
 ↓
Node.js valida JSON
 ↓
Services / regras de negócio
 ↓
Repositories
 ↓
Sequelize
 ↓
SQLite
 ↓
PDF temporário descartado
```

O JSON é um **contrato de comunicação**, não uma camada de persistência.

---

## 5. Contrato entre Python e Node.js

A fronteira entre os dois componentes deve ser explícita.

Exemplo de resposta de sucesso:

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

O formato definitivo será documentado em `docs/07-api/contrato-parser-python.md`.

---

## 6. Arquitetura em camadas do backend

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Sequelize
  ↓
SQLite
```

O parser Python fica fora dessa cadeia de persistência:

```text
ImportacaoService
       ↓
Parser Client
       ↓
Python Parser
       ↓
JSON
       ↓
ImportacaoService / ProcessamentoService
```

---

## 7. Estrutura do backend

```text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── database/
    ├── errors/
    ├── middlewares/
    ├── models/
    ├── repositories/
    ├── routes/
    ├── services/
    └── utils/
```

## 8. Estrutura do parser Python

```text
parser/
├── src/
│   ├── converters/
│   ├── extractors/
│   ├── normalizers/
│   ├── validators/
│   └── main.py
├── tests/
├── requirements.txt
└── README.md
```

A biblioteca específica de extração de PDF ainda será escolhida após a POC PDF → JSON.

---

## 9. Persistência

O banco é SQLite local:

```text
data/
└── ppga_analytics.db
```

O arquivo não deverá ser versionado pelo Git.

As migrations definem a evolução do schema; Sequelize representa as tabelas no código.

---

## 10. Processamento

O processamento poderá ser assíncrono para que a interface não fique bloqueada durante lotes maiores.

Estados principais:

```text
RECEBIDA
   ↓
PROCESSANDO
   ↓
CONCLUIDA
```

ou:

```text
PROCESSANDO → CONCLUIDA_COM_ALERTAS
PROCESSANDO → FALHOU
```

---

## 11. Tratamento de erros

Erros do parser deverão ser convertidos em um formato conhecido pelo backend.

Exemplo:

```json
{
  "status": "error",
  "parserVersion": "1.0.0",
  "error": {
    "code": "EXTRACTION_FAILED",
    "message": "Não foi possível extrair a seção de produção."
  },
  "warnings": []
}
```

O backend decide se o processamento falha, termina com alertas ou permite persistência parcial conforme a regra de negócio.

---

## 12. Segurança

Mesmo sendo local:

- validar PDFs;
- limitar tamanho de upload;
- impedir caminhos arbitrários;
- proteger credenciais;
- não armazenar senhas em texto puro;
- não expor stack trace;
- limpar arquivos temporários.

A comunicação local com o parser deve usar mecanismo controlado pelo backend, sem permitir que o frontend invoque o Python diretamente.

---

## 13. Testes

### Backend

- unitários de Services;
- Repository + SQLite;
- migrations;
- API;
- integração com parser.

### Parser

- extractors;
- normalizers;
- validators;
- matching;
- testes com os cinco Lattes das POCs.

### End-to-end

```text
Upload PDF
 ↓
Parser Python
 ↓
JSON
 ↓
Persistência
 ↓
Consulta API
 ↓
Frontend
```

---

## 14. Divisão técnica entre os três desenvolvedores

### Dev 1 — Backend/Infraestrutura

- Node.js;
- Express;
- Sequelize;
- SQLite;
- migrations;
- Models;
- Repositories;
- Services;
- API;
- cliente de comunicação com Python;
- integração geral.

### Dev 2 — Parser Python

- extração do PDF;
- parser;
- normalização de extração;
- matching;
- validação;
- contrato JSON;
- testes do parser.

### Dev 3 — Frontend

- interface;
- upload;
- status;
- docentes;
- alunos;
- produção;
- indicadores;
- dashboard;
- relatórios;
- integração REST.

---

## 15. ADRs

### ADR-001 — SQLite

Banco local para o MVP de um usuário em um computador.

### ADR-002 — Sequelize

ORM do backend JavaScript.

### ADR-003 — Parser Python

Python será utilizado exclusivamente no componente especializado de extração.

### ADR-004 — JSON como contrato interno

O parser Python entregará JSON padronizado ao backend Node.js.

### ADR-005 — PDF não persistido

O PDF é entrada temporária e não será armazenado permanentemente.

### ADR-006 — Separação de responsabilidades

Python não acessará o banco e Node.js não implementará a lógica de extração do currículo.

---

## 16. Decisões ainda abertas

- biblioteca específica de PDF no Python;
- mecanismo de execução/comunicação Node → Python;
- framework do frontend;
- autenticação final do MVP;
- regras definitivas de indicadores;
- critérios de classificação;
- estratégia final de matching.

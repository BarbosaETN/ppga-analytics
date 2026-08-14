# Especificação da API REST — PPGA Analytics

## 1. Objetivo

Contrato entre frontend e backend Node.js.

O parser Python possui um contrato separado em `contrato-parser-python.md`.

## 2. Base URL

```text
http://localhost:3000/api/v1
```

Formato padrão: JSON.

Upload: `multipart/form-data`.

## 3. Sucesso

Objeto:

```json
{ "data": {} }
```

Lista:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

## 4. Erros

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Existem dados inválidos.",
    "details": []
  }
}
```

## 5. Health

```http
GET /health
```

Resposta:

```json
{ "data": { "status": "ok", "database": "ok" } }
```

## 6. Importações

### Criar importação

```http
POST /importacoes
Content-Type: multipart/form-data
```

Campo:

```text
files[]
```

Resposta: `202 Accepted`.

### Consultar

```http
GET /importacoes/:id
GET /importacoes
```

### Iniciar/reprocessar

```http
POST /importacoes/:id/processar
POST /processamentos/:id/reprocessar
```

O backend controla a comunicação com o parser Python.

## 7. Processamentos

```http
GET /processamentos/:id
```

Retorna status, versão do parser, quantidade de registros, erros e alertas.

## 8. Docentes

```http
GET /docentes
GET /docentes/:id
GET /docentes/:id/formacoes
```

Filtros: `page`, `limit`, `search`, `programaId`, `ativo`.

## 9. Alunos

```http
GET /alunos
GET /alunos/:id
```

Filtros: `page`, `limit`, `search`, `programaId`, `nivel`, `situacao`.

## 10. Relações e orientações

```http
GET /relacoes-docente-aluno
GET /relacoes-docente-aluno/:id
GET /orientacoes
GET /orientacoes/:id
```

Filtros por docente, aluno, tipo, nível e status.

## 11. Produções

```http
GET /producoes
GET /producoes/:id
```

Filtros: `page`, `limit`, `search`, `tipo`, `ano`, `docenteId`, `alunoId`.

## 12. Ensino, Pesquisa e Extensão

```http
GET /atividades-ensino
GET /projetos/pesquisa
GET /projetos/pesquisa/:id
GET /projetos/extensao
GET /projetos/extensao/:id
```

## 13. Critérios e classificações

```http
GET /criterios
GET /criterios/:id
GET /classificacoes
GET /classificacoes/:id
```

## 14. Indicadores

```http
GET /indicadores
GET /indicadores/:id
GET /indicadores/:id/resultados
```

Filtros: `periodoId`, `docenteId`, `alunoId`.

## 15. Dashboard

```http
GET /dashboard/resumo
GET /dashboard/producao
```

## 16. Relatórios

```http
GET /relatorios/programa
GET /relatorios/docentes
GET /relatorios/alunos
GET /relatorios/producao
GET /relatorios/orientacoes
GET /relatorios/indicadores
```

## 17. Estados de importação

```text
RECEBIDA
PROCESSANDO
CONCLUIDA
CONCLUIDA_COM_ALERTAS
FALHOU
```

## 18. Paginação

```text
?page=1&limit=20
```

## 19. Regra de fronteira

O frontend conversa somente com a API REST.

O frontend nunca:

- acessa SQLite;
- acessa Sequelize;
- chama o parser Python diretamente;
- manipula o JSON interno do parser como contrato público.

## 20. Código HTTP

| Código | Uso |
|---|---|
| 200 | sucesso |
| 201 | criado |
| 202 | aceito para processamento |
| 204 | sem conteúdo |
| 400 | requisição inválida |
| 401 | não autenticado |
| 403 | proibido |
| 404 | não encontrado |
| 409 | conflito |
| 422 | validação semântica |
| 500 | erro interno |

## 21. Observação

O contrato pode evoluir, mas alterações incompatíveis deverão gerar nova versão da API.

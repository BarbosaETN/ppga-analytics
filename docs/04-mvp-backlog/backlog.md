# Backlog — PPGA Analytics

## 1. Prioridades

- **P0:** essencial para o MVP.
- **P1:** importante, mas pode ser posterior dentro do MVP.
- **P2:** pós-MVP.

## 2. Épicos

| ID | Épico | Prioridade |
|---|---|---|
| EP-01 | Fundação local | P0 |
| EP-02 | Usuário e acesso | P0 |
| EP-03 | Instituição, programa, docentes e alunos | P0 |
| EP-04 | Importação e pipeline PDF → JSON | P0 |
| EP-05 | Parser Python e dados acadêmicos | P0 |
| EP-06 | Relações docente–aluno–produção | P0 |
| EP-07 | Qualidade e rastreabilidade | P0 |
| EP-08 | Ensino, Pesquisa e Extensão | P0 |
| EP-09 | Critérios e classificação | P1 |
| EP-10 | Indicadores | P0 |
| EP-11 | Dashboard e consultas | P0 |
| EP-12 | Relatórios | P1 |
| EP-13 | Auditoria e testes | P0 |
| EP-14 | Validação com dados reais | P0 |
| EP-15 | Evoluções futuras | P2 |

## 3. EP-01 — Fundação local

- US-001 Criar repositório.
- US-002 Configurar estrutura do projeto.
- US-003 Configurar banco local.
- US-004 Configurar migrations.
- US-005 Configurar ambiente de desenvolvimento.
- US-006 Configurar logs.
- US-007 Configurar testes.

## 4. EP-02 — Usuário e acesso

- US-008 Criar usuário.
- US-009 Implementar autenticação.
- US-010 Implementar sessão.
- US-011 Preparar estrutura para perfis futuros.

## 5. EP-03 — Estrutura acadêmica

- US-012 Criar instituição.
- US-013 Criar programa.
- US-014 Criar docente.
- US-015 Criar aluno.
- US-016 Associar docente ao programa.
- US-017 Associar aluno ao programa.
- US-018 Criar períodos.

## 6. EP-04 — Importação e pipeline

- US-019 Upload de PDF.
- US-020 Validar PDF.
- US-021 Criar registro de importação.
- US-022 Enviar o PDF ao parser Python.
- US-023 Receber e validar o JSON produzido pelo parser.
- US-024 Persistir os dados estruturados recebidos.
- US-025 Registrar status.
- US-026 Descartar o PDF temporário.
- US-027 Permitir reprocessamento.
- US-028 Versionar parser.

## 7. EP-05 — Parser e dados

- US-030 Extrair identificação no parser Python.
- US-031 Extrair formação.
- US-032 Extrair Ensino.
- US-033 Extrair Pesquisa.
- US-034 Extrair produção.
- US-035 Extrair autores.
- US-036 Extrair orientações.
- US-037 Extrair Extensão.
- US-038 Normalizar dados no parser Python.
- US-039 Validar dados.
- US-040 Detectar possíveis duplicidades e sinalizar ao backend.

## 8. EP-06 — Docente, aluno e produção

- US-041 Criar produção.
- US-042 Criar relação de autoria.
- US-043 Associar docente à produção.
- US-044 Associar aluno à produção.
- US-045 Registrar natureza da participação.
- US-046 Preservar ordem de autoria.
- US-047 Criar relação docente–aluno.
- US-048 Criar orientação docente–aluno.
- US-049 Criar participação em projetos.

## 9. EP-07 — Qualidade e rastreabilidade

- US-050 Registrar estado do dado.
- US-051 Registrar processamento de origem.
- US-052 Registrar versão do parser.
- US-053 Registrar seção/localização lógica da origem.
- US-054 Registrar histórico de processamento.
- US-055 Criar relatório de processamento.

## 10. EP-08 — Ensino, Pesquisa e Extensão

- US-056 Criar atividade de Ensino.
- US-057 Criar projeto de Pesquisa.
- US-058 Criar projeto de Extensão.
- US-059 Associar docentes a projetos.
- US-060 Associar alunos a atividades/projetos quando identificável.
- US-061 Associar atividades a períodos.
- US-062 Criar consultas acadêmicas.

## 11. EP-09 — Critérios e classificação

- US-063 Criar critério.
- US-064 Criar versão do critério.
- US-065 Classificar produção.
- US-066 Registrar pontuação quando validada.
- US-067 Permitir correção manual.
- US-068 Registrar justificativa de alteração.

## 12. EP-10 — Indicadores

- US-069 Criar indicador.
- US-070 Criar regra de cálculo.
- US-071 Indicadores de Ensino.
- US-072 Indicadores de Pesquisa.
- US-073 Indicadores de Extensão.
- US-074 Indicadores por docente.
- US-075 Indicadores por aluno.
- US-076 Indicadores docente–aluno–produção.
- US-077 Indicadores por período.
- US-078 Registrar versão da regra.
- US-079 Recalcular indicadores.

## 13. EP-11 — Dashboard e consultas

- US-080 Dashboard geral.
- US-081 Perfil do docente.
- US-082 Perfil do aluno.
- US-083 Consulta de produção.
- US-084 Consulta docente–aluno.
- US-085 Filtros por período.
- US-086 Filtros por tipo/classificação.
- US-087 Pontos de atenção.
- US-088 Gráficos históricos.

## 14. EP-12 — Relatórios

- US-089 Relatório do programa.
- US-090 Relatório do docente.
- US-091 Relatório do aluno.
- US-092 Relatório de produção.
- US-093 Relatório docente–aluno.
- US-094 Relatório de indicadores.
- US-095 Exportação.

## 15. EP-13 — Auditoria e testes

- US-096 Auditoria de importações.
- US-097 Auditoria de alterações.
- US-098 Auditoria de classificações.
- US-099 Testes unitários.
- US-100 Testes do parser Python.
- US-101 Testes de integração.
- US-102 Teste do pipeline completo.

## 16. EP-14 — Validação

- US-103 Processar os cinco Lattes da POC.
- US-104 Processar lote de teste.
- US-105 Comparar extração com fonte.
- US-106 Validar relações docente–aluno.
- US-107 Validar produção.
- US-108 Validar indicadores.
- US-109 Registrar divergências.
- US-110 Corrigir parser.
- US-111 Criar testes de regressão.
- US-112 Validar com o cliente.

## 17. EP-15 — Pós-MVP

- FUT-001 Multiusuário.
- FUT-002 Múltiplos computadores.
- FUT-003 Implantação em servidor.
- FUT-004 Cloud.
- FUT-005 Integrações externas.
- FUT-006 Benchmarking.
- FUT-007 IA avançada.
- FUT-008 SaaS.

## 18. Ordem sugerida

```text
Fundação
  ↓
Estrutura acadêmica
  ↓
Importação
  ↓
PDF → Python Parser → JSON → Backend
  ↓
Dados estruturados
  ↓
Docente + Aluno + Produção
  ↓
Ensino/Pesquisa/Extensão
  ↓
Critérios/Classificação
  ↓
Indicadores
  ↓
Dashboard
  ↓
Relatórios
  ↓
Validação
```

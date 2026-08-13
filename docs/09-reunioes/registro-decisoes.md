# Registro de Decisões — PPGA Analytics

## DEC-001 — Uso local no MVP

**Decisão:** o MVP será executado por um único usuário em um único computador.

**Impacto:** SQLite é adequado para o cenário inicial.

## DEC-002 — Banco SQLite

**Decisão:** SQLite será o banco do MVP.

**Motivo:** elimina a necessidade de servidor de banco para o cenário local.

## DEC-003 — Backend JavaScript

**Decisão:** backend em Node.js + JavaScript + Express.

## DEC-004 — ORM Sequelize

**Decisão:** Sequelize será o ORM do backend.

## DEC-005 — Parser Python

**Decisão:** o Dev 2 desenvolverá o parser em Python.

**Motivo:** separar o componente especializado de extração do backend Node.js.

## DEC-006 — PDF → JSON

**Decisão:** a estratégia atual de extração será PDF → parser Python → JSON.

A abordagem anterior PDF → XML não será utilizada na implementação final.

## DEC-007 — JSON como fronteira interna

**Decisão:** o parser Python entrega JSON padronizado ao backend Node.js.

O JSON é contrato de comunicação, não armazenamento permanente.

## DEC-008 — Python sem acesso ao banco

**Decisão:** o parser Python não acessará SQLite nem Sequelize.

## DEC-009 — Node como dono da persistência

**Decisão:** somente o backend Node.js será responsável pela persistência através do Sequelize.

## DEC-010 — PDF não persistido

**Decisão:** PDFs são temporários e serão descartados após o processamento.

## DEC-011 — Modelagem independente do formato de extração

**Decisão:** a troca XML → JSON não altera as entidades acadêmicas do banco porque o banco armazena dados de domínio, não o formato intermediário de extração.

## DEC-012 — POC PDF → JSON

**Decisão:** antes da implementação definitiva do parser Python, deverá ser validada uma POC PDF → JSON com os currículos disponíveis.

## DEC-013 — Contratos separados

**Decisão:** haverá dois contratos:

1. Frontend ↔ API Node.js;
2. Node.js ↔ Parser Python.

## DEC-014 — Divisão dos desenvolvedores

**Dev 1:** backend, banco e integração.

**Dev 2:** parser Python e contrato JSON.

**Dev 3:** frontend.

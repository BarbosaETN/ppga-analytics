# Índice da documentação — PPGA Analytics

1. Visão do produto
2. Requisitos funcionais e não funcionais
3. Regras de negócio
4. MVP e backlog
5. Arquitetura
6. Banco de dados
7. API pública e contrato interno Node ↔ Python
8. Fluxos UI/UX
9. Registro de decisões

## Decisão técnica central atual

```text
PDF → Python Parser → JSON → Node.js → Sequelize → SQLite
```

A troca de XML por JSON afeta principalmente o pipeline de extração, a arquitetura, o backlog e os contratos. As entidades do banco continuam orientadas ao domínio acadêmico.

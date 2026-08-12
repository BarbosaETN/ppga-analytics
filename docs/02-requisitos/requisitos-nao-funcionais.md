# Requisitos Não Funcionais — PPGA Analytics

## 1. Arquitetura e ambiente

### RNF-001 — Execução local
O MVP deverá funcionar inicialmente em um único computador.

### RNF-002 — Banco local
O banco de dados do MVP deverá poder ser executado localmente no computador do usuário.

### RNF-003 — Independência de arquivos
O funcionamento permanente do sistema não deverá depender do armazenamento dos PDFs ou XMLs originais.

### RNF-004 — Evolução
A arquitetura deverá permitir futura migração para ambiente servidor/cloud sem reconstrução completa do domínio.

## 2. Processamento

### RNF-005 — Pipeline
O processamento deverá seguir, conceitualmente, PDF → XML → parser → dados estruturados.

### RNF-006 — Processamento não bloqueante
O processamento de arquivos deverá evitar bloqueio desnecessário da interface.

### RNF-007 — Feedback
O sistema deverá informar o estado do processamento.

### RNF-008 — Reprocessamento
O processamento deverá poder ser repetido com controle de versão.

## 3. Armazenamento

### RNF-009 — Persistência mínima
Somente dados acadêmicos estruturados e metadados necessários deverão ser persistidos.

### RNF-010 — Arquivos temporários
PDF e XML deverão ser tratados como arquivos temporários.

### RNF-011 — Descarte
Arquivos temporários deverão ser removidos após processamento, conforme política definida pela aplicação.

### RNF-012 — Integridade
Os dados persistidos deverão manter integridade referencial e consistência.

## 4. Qualidade da extração

### RNF-013 — Parser modular
O parser deverá ser modular e evolutivo.

### RNF-014 — Independência de paginação
A interpretação não deverá depender de páginas fixas.

### RNF-015 — Normalização
O sistema deverá tratar quebras de linha, espaços e variações de encoding.

### RNF-016 — Não inferência
O sistema não deverá inventar informações ausentes.

### RNF-017 — Validação
O parser deverá possuir testes com currículos reais ou amostras autorizadas.

## 5. Dados

### RNF-018 — Rastreabilidade
Dados relevantes deverão possuir referência ao processamento e à origem disponível.

### RNF-019 — Versionamento
Processamentos deverão identificar a versão do parser e dos critérios quando aplicável.

### RNF-020 — Histórico
Resultados históricos relevantes não deverão ser alterados silenciosamente.

### RNF-021 — Deduplicação
O sistema deverá reduzir duplicidades sem excluir automaticamente registros apenas por suspeita.

## 6. Segurança

### RNF-022 — Autenticação
O acesso deverá ser protegido por autenticação.

### RNF-023 — Senhas
Senhas não deverão ser armazenadas em texto puro.

### RNF-024 — Arquivos temporários
Arquivos enviados deverão ser validados antes do processamento e protegidos durante seu uso.

### RNF-025 — Dados pessoais
Dados pessoais presentes nos currículos deverão ser tratados conforme legislação aplicável.

## 7. Desempenho

### RNF-026 — Consultas
Consultas comuns deverão apresentar resposta adequada ao uso cotidiano.

### RNF-027 — Processamento
O tempo de processamento deverá ser mensurado durante as POCs e ajustado conforme os currículos reais.

### RNF-028 — Escala inicial
O sistema deverá suportar o conjunto de currículos previsto para a utilização inicial sem degradação inadequada.

## 8. Usabilidade

### RNF-029 — Interface
A aplicação deverá ser utilizável por pessoa não técnica.

### RNF-030 — Mensagens
Erros e estados de processamento deverão ser apresentados de forma clara.

## 9. Manutenibilidade

### RNF-031 — Separação de responsabilidades
Parser, domínio, persistência e apresentação deverão possuir responsabilidades separadas.

### RNF-032 — Testabilidade
Componentes críticos deverão possuir testes automatizados.

### RNF-033 — Logs
Falhas e eventos relevantes deverão gerar logs.

## 10. Futuro

### RNF-034 — Escalabilidade futura
A solução não deverá impedir futura adoção por múltiplos usuários, computadores ou instituições.

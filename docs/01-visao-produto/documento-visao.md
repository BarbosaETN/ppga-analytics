# Documento de Visão — PPGA Analytics

## 1. Visão geral

O PPGA Analytics é uma aplicação para apoiar a análise e o acompanhamento da atuação acadêmica de docentes e alunos de um Programa de Pós-Graduação.

A primeira versão será utilizada por **um único usuário, em um único computador**, com banco de dados local. O sistema deverá receber Currículos Lattes em PDF, processá-los por meio de um pipeline PDF → parser Python → JSON → backend e persistir somente os dados acadêmicos extraídos e estruturados.

Os arquivos PDF e os artefatos técnicos temporários do processamento não farão parte do armazenamento permanente do sistema. O JSON produzido pelo parser será transferido ao backend e não precisa ser persistido como arquivo.

## 2. Problema

O programa precisa consolidar e analisar informações de Ensino, Pesquisa e Extensão, além da produção acadêmica e das relações entre docentes e alunos. O objetivo é substituir parte do trabalho manual feito a partir de currículos e planilhas por uma aplicação estruturada, rastreável e evolutiva.

## 3. Objetivo

Permitir que o usuário:

- importe Currículos Lattes;
- processe e estruture seus dados;
- acompanhe docentes e alunos;
- controle produção acadêmica e a relação docente–aluno;
- organize Ensino, Pesquisa e Extensão;
- aplique critérios de avaliação;
- calcule indicadores;
- visualize resultados;
- gere relatórios.

## 4. Escopo inicial

O MVP será direcionado a um único usuário e um único computador. Não haverá, como requisito do MVP:

- múltiplos usuários simultâneos;
- SaaS;
- infraestrutura multi-instituição;
- armazenamento permanente de PDFs;
- armazenamento permanente de artefatos intermediários;
- integração automática com o Lattes.

A arquitetura deverá, entretanto, evitar decisões que impeçam evolução futura.

## 5. Fluxo principal

```text
PDF Lattes
   ↓
Importação
   ↓
Validação
   ↓
Parser Python
   ↓
Normalização
   ↓
Dados acadêmicos estruturados
   ↓
Banco local
   ↓
Indicadores / análises / relatórios

PDF → descarte após processamento; JSON → transferido ao backend e não armazenado como arquivo permanente
```

## 6. Domínio principal

O sistema deverá representar:

- instituição e programa;
- docentes;
- alunos;
- currículos/importações e processamentos;
- formação;
- Ensino;
- Pesquisa;
- produção acadêmica;
- autoria e participação docente/aluno;
- orientações;
- Extensão;
- critérios e classificações;
- períodos;
- indicadores;
- resultados;
- rastreabilidade;
- auditoria.

## 7. Relação docente–aluno

A produção acadêmica deverá permitir identificar a participação de docentes e alunos.

O sistema não deverá assumir que uma produção pertence exclusivamente a um docente. Uma produção poderá possuir múltiplos participantes/autores.

A forma exata de participação deverá ser definida no modelo de dados e nas regras de negócio, sem inventar critérios que ainda não tenham sido confirmados.

## 8. Resultado esperado

O produto deverá demonstrar que é possível transformar currículos Lattes em dados estruturados úteis para análise acadêmica, preservando a confiabilidade e permitindo identificar a origem e o processamento dos dados.

## 9. Evolução futura

Após a validação do MVP, poderão ser avaliados:

- múltiplos usuários;
- outros computadores;
- implantação em servidor;
- múltiplas instituições;
- integrações externas;
- benchmarking;
- IA e análises avançadas;
- SaaS.

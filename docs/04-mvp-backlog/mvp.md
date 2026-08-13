# MVP — PPGA Analytics

## 1. Objetivo

Validar que uma única pessoa, em um único computador, consegue importar Currículos Lattes em PDF, processá-los por PDF → parser Python → JSON → backend Node.js, transformar os conteúdos em dados estruturados persistentes e obter análises acadêmicas úteis.

## 2. Fluxo principal

```text
Usuário
  ↓
Importa N PDFs
  ↓
Validação
  ↓
Parser Python
  ↓
JSON
  ↓
Backend Node.js / regras de negócio
  ↓
Dados estruturados
  ↓
Banco local
  ↓
Indicadores / Dashboard / Relatórios
  ↓
PDF temporário descartado e JSON de comunicação não persistido como arquivo
```

## 3. Usuário

O MVP terá um usuário operacional principal.

Não serão necessários múltiplos usuários simultâneos no primeiro ciclo.

## 4. Funcionalidades P0

- autenticação simples;
- instituição/programa;
- docentes;
- alunos;
- importação de PDFs;
- processamento do PDF pelo parser Python;
- entrega de JSON padronizado ao backend;
- parser;
- normalização;
- persistência dos dados extraídos;
- Ensino;
- Pesquisa;
- Produção;
- Extensão;
- Orientações;
- relação docente–aluno;
- classificação básica;
- indicadores;
- dashboard;
- perfil de docente/aluno;
- histórico;
- rastreabilidade;
- testes com currículos reais.

## 5. Armazenamento

O MVP deverá persistir:

- docentes;
- alunos;
- produções;
- relações de autoria/participação;
- Ensino;
- Pesquisa;
- Extensão;
- orientações;
- formações;
- períodos;
- classificações;
- critérios;
- indicadores;
- resultados;
- metadados de processamento;
- logs/auditoria necessários.

O MVP não deverá persistir permanentemente:

- PDF original;
- arquivo JSON intermediário persistido permanentemente.

## 6. Processamento em lote

O sistema deverá permitir que o usuário importe vários currículos em uma operação, dentro da capacidade do computador.

Exemplo:

```text
14 PDFs
 ↓
14 processamentos
 ↓
dados consolidados
```

O número exato de arquivos por operação poderá ser limitado pela capacidade de processamento.

## 7. Dados acadêmicos

O MVP deverá priorizar:

- identificação;
- formação;
- Ensino;
- Pesquisa;
- produção;
- autoria;
- alunos;
- orientações;
- Extensão;
- projetos;
- eventos quando relevantes.

## 8. Relação docente–aluno

O MVP deverá permitir consultar e analisar:

```text
Docente
   ↕
Aluno
   ↕
Produção
```

A natureza da relação deverá ser registrada quando identificável.

## 9. Classificação e indicadores

O MVP deverá possuir estrutura para:

- critérios;
- classificações;
- pontuação quando os critérios forem validados;
- indicadores por docente;
- indicadores por aluno;
- indicadores por período;
- indicadores que relacionem docente, aluno e produção.

Os critérios específicos do rascunho do cliente serão incorporados somente após validação.

## 10. Dashboard

O dashboard inicial deverá apresentar:

- quantidade de docentes;
- quantidade de alunos;
- produção;
- Ensino;
- Pesquisa;
- Extensão;
- indicadores;
- relações docente–aluno;
- pontos de atenção.

## 11. Relatórios

O MVP deverá permitir relatórios:

- do programa;
- do docente;
- do aluno;
- da produção;
- das relações docente–aluno;
- dos indicadores.

## 12. Critérios de sucesso

O MVP será considerado validado quando:

1. os currículos de teste forem processados;
2. o parser produzir dados estruturados;
3. os dados forem persistidos corretamente;
4. PDF puder ser descartado sem perda das informações necessárias e o JSON tiver sido processado pelo backend;
5. docentes e alunos forem relacionados corretamente;
6. produções forem consultáveis;
7. indicadores básicos forem calculados;
8. o usuário conseguir visualizar os resultados;
9. os resultados forem validados com o cliente.

## 13. Fora do MVP

- múltiplos usuários;
- operação em múltiplos computadores;
- SaaS;
- cloud obrigatória;
- armazenamento de PDFs;
- armazenamento permanente do JSON de comunicação como arquivo;
- integração automática com Lattes;
- benchmarking entre instituições;
- IA avançada;
- aplicativo mobile.

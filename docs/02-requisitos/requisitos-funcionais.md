# Requisitos Funcionais — PPGA Analytics

## 1. Usuário e acesso

### RF-001 — Acesso ao sistema
O sistema deverá permitir acesso ao usuário autorizado.

### RF-002 — Autenticação
O sistema deverá permitir autenticação por credenciais.

### RF-003 — Perfil administrativo
A primeira versão poderá operar com um único usuário autorizado, mantendo estrutura que permita evolução para perfis futuros.

## 2. Estrutura acadêmica

### RF-004 — Cadastro de instituição
O sistema deverá permitir registrar a instituição analisada.

### RF-005 — Cadastro de programa
O sistema deverá permitir registrar o Programa de Pós-Graduação.

### RF-006 — Cadastro de docente
O sistema deverá permitir cadastrar e consultar docentes.

### RF-007 — Cadastro de aluno
O sistema deverá permitir cadastrar e consultar alunos.

### RF-008 — Relação docente–aluno
O sistema deverá permitir registrar relações acadêmicas entre docentes e alunos quando identificadas nos dados.

### RF-009 — Períodos
O sistema deverá permitir organizar informações por período.

## 3. Importação e processamento

### RF-010 — Upload de currículo
O sistema deverá permitir importar Currículos Lattes em PDF.

### RF-011 — Validação do arquivo
O sistema deverá validar o arquivo antes do processamento.

### RF-012 — Processamento pelo parser Python
O sistema deverá enviar o PDF ao componente de extração desenvolvido em Python.

### RF-013 — Recebimento do JSON
O sistema deverá receber do parser Python um JSON padronizado contendo os dados extraídos.

### RF-014 — Normalização
O sistema deverá normalizar os dados extraídos.

### RF-015 — Persistência dos dados
O sistema deverá persistir os dados acadêmicos estruturados.

### RF-016 — Descarte de arquivo temporário
Após o processamento, o sistema deverá descartar o PDF temporário. O JSON de comunicação não deverá ser persistido como arquivo permanente.

### RF-017 — Status de processamento
O sistema deverá informar o status do processamento.

### RF-018 — Reprocessamento
O sistema deverá permitir reprocessar um currículo quando necessário, sem criar duplicidades indevidas.

## 4. Dados acadêmicos

### RF-019 — Formação
Registrar formações acadêmicas dos docentes.

### RF-020 — Ensino
Registrar atividades de Ensino.

### RF-021 — Pesquisa
Registrar projetos e atividades de Pesquisa.

### RF-022 — Produção acadêmica
Registrar artigos, livros, capítulos, trabalhos em eventos e demais tipos relevantes.

### RF-023 — Autoria e participação
Registrar docentes e alunos associados a uma produção, incluindo a natureza da participação quando identificável.

### RF-024 — Orientações
Registrar orientações acadêmicas.

### RF-025 — Extensão
Registrar atividades e projetos de Extensão identificados.

### RF-026 — Eventos
Registrar eventos relevantes quando fizerem parte do escopo validado.

## 5. Qualidade e rastreabilidade

### RF-027 — Estado dos dados
O sistema deverá identificar dados válidos, incompletos, não classificados, inconsistentes e possíveis duplicidades.

### RF-028 — Origem dos dados
O sistema deverá registrar a origem lógica dos dados extraídos.

### RF-029 — Versão do parser
O sistema deverá registrar a versão do parser utilizada em cada processamento.

### RF-030 — Histórico de processamento
O sistema deverá registrar o histórico dos processamentos.

## 6. Classificação e avaliação

### RF-031 — Cadastro de critérios
O sistema deverá permitir cadastrar critérios de avaliação.

### RF-032 — Classificação de produção
O sistema deverá permitir classificar produções segundo critérios definidos.

### RF-033 — Versionamento de critérios
O sistema deverá identificar a versão dos critérios utilizados.

### RF-034 — Classificação manual
O usuário autorizado poderá corrigir ou classificar dados manualmente quando permitido.

## 7. Indicadores e visualização

### RF-035 — Indicadores de Ensino
Calcular indicadores relacionados ao Ensino.

### RF-036 — Indicadores de Pesquisa
Calcular indicadores relacionados à Pesquisa e produção.

### RF-037 — Indicadores de Extensão
Calcular indicadores relacionados à Extensão.

### RF-038 — Indicadores por docente
Permitir análise individual de docentes.

### RF-039 — Indicadores por aluno
Permitir análise relacionada à atuação acadêmica dos alunos quando os dados forem suficientes.

### RF-040 — Indicadores docente–aluno
Permitir análises que considerem a relação entre docentes, alunos e produção acadêmica.

### RF-041 — Indicadores por período
Permitir análise temporal.

### RF-042 — Dashboard
Exibir indicadores e informações consolidadas.

### RF-043 — Perfil acadêmico
Exibir informações de um docente ou aluno.

### RF-044 — Pontos de atenção
Exibir dados incompletos, não classificados, inconsistências e situações relevantes.

## 8. Relatórios

### RF-045 — Relatório do programa
Gerar relatório consolidado.

### RF-046 — Relatório do docente
Gerar relatório individual.

### RF-047 — Relatório acadêmico docente–aluno
Permitir visualizar produção e relações acadêmicas entre docentes e alunos.

### RF-048 — Exportação
Permitir exportar relatórios e dados definidos pelo projeto.

## 9. Auditoria

### RF-049 — Registro de alterações
Registrar alterações relevantes.

### RF-050 — Histórico de classificação
Registrar alterações relevantes de classificação.

### RF-051 — Histórico de critérios
Registrar alterações de critérios.

## 10. Limites do MVP

O MVP não deverá exigir:

- múltiplos usuários;
- operação simultânea;
- armazenamento permanente de PDF;
- armazenamento permanente do JSON de comunicação como arquivo;
- integração automática com Lattes;
- SaaS;
- benchmarking externo.

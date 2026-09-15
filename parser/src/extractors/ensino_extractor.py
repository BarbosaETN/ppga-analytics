import re

def eh_secao_principal(linha):

    return (
        abs(linha["x0"] - 64.44) < 2
        and linha["fontname"] == "FAAAAA+Tahoma"
        and abs(linha["size"] - 11.75) < 0.2
        and linha["non_stroking_color"] == (
            0.1961,
            0.4235,
            0.6
        )
    )

def eh_secao_atuacao_profissional(linha):
    return linha["text"].strip().lower() == "atuação profissional"

def extrair_secao_atuacao_profissional(linhas):

    resultado = []

    dentro_secao = False

    for linha in linhas:
        # Encontrou o título "Atuação Profissional"
        if eh_secao_atuacao_profissional(linha):

            dentro_secao = True
            continue

        # Se já estamos dentro de Atuação Profissional
        # e encontramos outra seção principal,
        # a seção terminou
        if dentro_secao and eh_secao_principal(linha):

            break

        # Enquanto estiver dentro da seção,
        # Guarda a linha
        if dentro_secao:

            resultado.append(linha)

    return resultado

def eh_instituicao(linha):

    return (
        linha["fontname"]
    )


def eh_subsecao(linha):

    return (
        abs(linha["x0"] - 151.72) < 2
        and linha["fontname"] == "GAAAAA+Tahoma-Bold"
        and abs(linha["size"] - 7.83) < 0.2
        and linha["non_stroking_color"] == (
            0.4,
            0.4,
            0.4
        )
    )


def eh_periodo(linha):

    texto = linha["text"].strip()

    padrao = r"^\d{4}\s*-\s*(Atual|\d{4})$"

    return (
        re.match(
            padrao,
            texto,
            re.IGNORECASE
        )
        and abs(linha["x0"] - 151.72) < 2
    )


def eh_outras_informacoes(linha):

    return (
        linha["text"]
        .strip()
        .lower()
        == "outras informações"
    )


def eh_conteudo(linha):

    return abs(linha["x0"] - 210.90) < 3


def montar_atuacao(linhas):

    resultado = []

    instituicao_atual = None
    subsecao_atual = None
    periodo_atual = None
    subsecao_interna_atual = None

    for linha in linhas:

        # ====================================================
        # INSTITUIÇÃO
        # ====================================================

        if eh_instituicao(linha):

            instituicao_atual = {
                "tipo": "instituicao",
                "texto": linha["text"],
                "subsecoes": []
            }

            resultado.append(instituicao_atual)

            subsecao_atual = None
            periodo_atual = None
            subsecao_interna_atual = None

            continue


        # ====================================================
        # SUBSEÇÃO
        # Ex.: Vínculo institucional
        #      Atividades
        # ====================================================

        if eh_subsecao(linha):

            if instituicao_atual is None:
                continue

            subsecao_atual = {
                "tipo": "subsecao",
                "texto": linha["text"],
                "periodos": []
            }

            instituicao_atual["subsecoes"].append(
                subsecao_atual
            )

            periodo_atual = None
            subsecao_interna_atual = None

            continue


        # ====================================================
        # PERÍODO
        # Ex.: 2022 - Atual
        #      2008 - 2010
        # ====================================================

        if eh_periodo(linha):

            if subsecao_atual is None:
                continue

            periodo_atual = {
                "tipo": "periodo",
                "texto": linha["text"],
                "conteudos": [],
                "subsecoes": []
            }

            subsecao_atual["periodos"].append(
                periodo_atual
            )

            subsecao_interna_atual = None

            continue


        # ====================================================
        # SUBSEÇÃO INTERNA
        # Ex.: Outras informações
        # ====================================================

        if eh_outras_informacoes(linha):

            if periodo_atual is None:
                continue

            subsecao_interna_atual = {
                "tipo": "subsubsecao",
                "texto": linha["text"],
                "conteudos": []
            }

            periodo_atual["subsecoes"].append(
                subsecao_interna_atual
            )

            continue


        # ====================================================
        # CONTEÚDO
        # ====================================================

        if eh_conteudo(linha):

            if subsecao_interna_atual is not None:

                subsecao_interna_atual["conteudos"].append(
                    linha["text"]
                )

            elif periodo_atual is not None:

                periodo_atual["conteudos"].append(
                    linha["text"]
                )

    return resultado
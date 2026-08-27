import pdfplumber
import re


def ler_pdf(pdf_path):

    paginas = []

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            words = page.extract_words(
                use_text_flow=True,
                extra_attrs=[
                    "fontname",
                    "size",
                    "non_stroking_color"
                ]
            )

            paginas.append(words)

    return paginas


def agrupar_palavras_em_linhas(words, tolerancia_top=1.5, numero_pagina=None):

    linhas = []

    words = sorted(
        words,
        key=lambda w: (w["top"], w["x0"])
    )

    for word in words:

        if not linhas:
            linhas.append({
                "top": word["top"],
                "words": [word]
            })
            continue

        ultima = linhas[-1]

        if abs(word["top"] - ultima["top"]) <= tolerancia_top:

            ultima["words"].append(word)

        else:

            linhas.append({
                "top": word["top"],
                "words": [word]
            })

    resultado = []

    for linha in linhas:

        linha["words"].sort(key=lambda w: w["x0"])

        texto = " ".join(
            w["text"] for w in linha["words"]
        )

        resultado.append({
            "text": texto,
            "top": linha["top"],
            "x0": min(
                w["x0"] for w in linha["words"]
            ),
            "fontname": linha["words"][0]["fontname"],
            "size": linha["words"][0]["size"],
            "stroking_color": linha["words"][0].get(
                "stroking_color"
            ),
            "non_stroking_color": linha["words"][0].get(
                "non_stroking_color"
            ),
            "pagina": numero_pagina,
        })

    return resultado


def extrair_linhas(pdf_path):

    paginas = ler_pdf(pdf_path)

    todas_as_linhas = []

    for numero_pagina, words in enumerate(paginas, start=1):

        linhas = agrupar_palavras_em_linhas(
            words,
            numero_pagina=numero_pagina
        )

        todas_as_linhas.extend(linhas)

    return todas_as_linhas


def ordenar_linhas_por_pagina(paginas):

    linhas_ordenadas = []

    for numero_pagina, linhas in enumerate(paginas, start=1):

        linhas = sorted(
            linhas,
            key=lambda linha: (
                linha["top"],
                linha["x0"]
            )
        )

        for linha in linhas:
            linha["pagina"] = numero_pagina
            linhas_ordenadas.append(linha)

    return linhas_ordenadas


def ordenar_linhas(linhas):
    return sorted(
        linhas,
        key=lambda linha: (
            linha.get("pagina", 0),
            linha["top"],
            linha["x0"]
        )
    )

# ============================================================
# CLASSIFICADORES
# ============================================================

def eh_instituicao(linha):

    return (
        abs(linha["x0"] - 107.42) < 2
        and linha["fontname"] == "GAAAAA+Tahoma-Bold"
        and abs(linha["size"] - 7.83) < 0.2
        and linha["non_stroking_color"] == (
            0.6706,
            0.6706,
            0.6706
        )
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
    subsubsecao_atual = None

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
            subsubsecao_atual = None

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
            subsubsecao_atual = None

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

            subsubsecao_atual = None

            continue


        # ====================================================
        # SUBSUBSEÇÃO
        # Ex.: Outras informações
        # ====================================================

        if eh_outras_informacoes(linha):

            if periodo_atual is None:
                continue

            subsubsecao_atual = {
                "tipo": "subsubsecao",
                "texto": linha["text"],
                "conteudos": []
            }

            periodo_atual["subsecoes"].append(
                subsubsecao_atual
            )

            continue


        # ====================================================
        # CONTEÚDO
        # ====================================================

        if eh_conteudo(linha):

            if subsubsecao_atual is not None:

                subsubsecao_atual["conteudos"].append(
                    linha["text"]
                )

            elif periodo_atual is not None:

                periodo_atual["conteudos"].append(
                    linha["text"]
                )

    return resultado

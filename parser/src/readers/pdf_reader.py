import pdfplumber


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


import pdfplumber


def ler_pdf(pdf_path):

    paginas = []

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            words = page.extract_words(use_text_flow=True, extra_attrs=["fontname", "size", "non_stroking_color"])

            paginas.append(words)

    return paginas


def agrupar_em_linhas(words):

    words_ordenadas = sorted(
        words,
        key=lambda w: (round(w["top"], 1), w["x0"])
    )

    linhas = []

    for word in words_ordenadas:

        if not linhas:

            linhas.append({
                "top": word["top"],
                "x0": word["x0"],
                "text": word["text"],
                "fontname": word.get("fontname", "Desconhecida"),
                "size": word.get("size", 0),
                "color": word.get("non_stroking_color")
            })

        else:

            diferenca = abs(
                word["top"] - linhas[-1]["top"]
            )

            if diferenca <= 3:

                linhas[-1]["text"] += " " + word["text"]

            else:

                linhas.append({
                    "top": word["top"],
                    "x0": word["x0"],
                    "text": word["text"],
                    "fontname": word.get("fontname", "Desconhecida"),
                    "size": word.get("size", 0),
                    "color": word.get("non_stroking_color")
                })

    return linhas

def identificar_nivel(word):
    fonte = word["fontname"]
    tamanho = word["size"]
    cor = word.get("non_stroking_color") # get para retornar None caso não tenha essa info, ao invés de simplesmente quebrar o programa
    x0 = word["x0"]

    # Instituição
    if(
        fonte == "GAAAAA+Tahoma-Bold"
        and round(tamanho, 2) == 7.83
        and cor == (0.6706, 0.6706, 0.6706)
    ):
        return "instituicao"

    # Subtítulo: Vínculo institucional / Atividades
    if(
        fonte == "GAAAAA+Tahoma-Bold"
        and round(tamanho, 2) == 7.83
        and cor == (0.4, 0.4, 0.4)
    ):
        return "subsecao"

    # Período
    if (
        fonte == "AAAAAA+Tahoma-Bold"
        and round(tamanho, 2) == 10.12
        and cor == (0.1961, 0.4235, 0.6)
    ):
        return "periodo"

    # Conteúdo
    if (
        fonte == "BAAAAA+Tahoma"
        and round(tamanho, 2) == 10.12
        and cor == (0.1961, 0.4235, 0.6)
    ):
        return "conteudo"

    return None
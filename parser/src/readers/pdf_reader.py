import pdfplumber


def ler_pdf(pdf_path):

    paginas = []

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            words = page.extract_words(use_text_flow=True)

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
                "text": word["text"]
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
                    "text": word["text"]
                })

    return linhas
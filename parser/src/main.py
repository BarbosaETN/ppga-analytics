from pathlib import Path

from readers.pdf_reader import ler_pdf, agrupar_em_linhas


BASE_DIR = Path(__file__).resolve().parent

PDF_PATH = (
    BASE_DIR.parent
    / "tests"
    / "fixtures"
    / "lattes-01.pdf"
)


paginas = ler_pdf(PDF_PATH)

primeira_pagina = paginas[0]

linhas = agrupar_em_linhas(primeira_pagina)

secao_atual = None

for numero_pagina, pagina in enumerate(paginas, start=1):

    linhas = agrupar_em_linhas(pagina)

    for linha in linhas:

        if linha["x0"] < 100:
            secao_atual = linha["text"]

            print(
                f"\nPÁGINA {numero_pagina} - "
                f"SEÇÃO: {secao_atual}"
            )

        elif secao_atual is not None and 100 <= linha["x0"] < 200:
            print(
                f"PÁGINA {numero_pagina} - "
                f"CAMPO dentro de [{secao_atual}]: "
                f"{linha['text']}"
            )
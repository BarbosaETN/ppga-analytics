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

    if numero_pagina != 125:
        continue

    linhas = agrupar_em_linhas(pagina)

    for linha in linhas:
        print(
            f"x0={linha['x0']:.2f} | "
            f"top={linha['top']:.2f} | "
            f"fonte={linha['fontname']} | "
            f"tamanho={linha['size']:.2f} | "
            f"{linha['text']}"
        )
# from collections import Counter
# import pdfplumber
# fontes = Counter()

# with pdfplumber.open(PDF_PATH) as pdf:

#     for numero_pagina, page in enumerate(pdf.pages, start=1):

#         words = page.extract_words(
#             extra_attrs=["fontname", "size"]
#         )

#         for word in words:

#             if (
#                 word["fontname"] == "FAAAAA+Tahoma"
#                 and round(word["size"], 2) == 11.75
#             ):
#                 print(
#                     f"PÁGINA {numero_pagina} | "
#                     f"{word['text']} | "
#                     f"x0={word['x0']:.2f} | "
#                     f"top={word['top']:.2f}"
#                 )
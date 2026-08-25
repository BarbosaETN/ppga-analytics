from pathlib import Path
import pdfplumber
from readers.pdf_reader import ler_pdf, agrupar_em_linhas, identificar_nivel


# BASE_DIR = Path(__file__).resolve().parent

# PDF_PATH = (
#     BASE_DIR.parent
#     / "tests"
#     / "fixtures"
#     / "lattes-01.pdf"
# )


# paginas = ler_pdf(PDF_PATH)

# primeira_pagina = paginas[0]

# linhas = agrupar_em_linhas(primeira_pagina)

# secao_atual = None

# for numero_pagina, pagina in enumerate(paginas, start=1):

#     if numero_pagina != 3:
#         continue

#     linhas = agrupar_em_linhas(pagina)

#     for linha in linhas:
#         print(
#             f"x0={linha['x0']:.2f} | "
#             f"top={linha['top']:.2f} | "
#             f"fonte={linha['fontname']} | "
#             f"tamanho={linha['size']:.2f} | "
#             f"cor={linha['color']} | "
#             f"{linha['text']}"
#         )
# # from collections import Counter
# # import pdfplumber
# # fontes = Counter()

# # with pdfplumber.open(PDF_PATH) as pdf:

# #     for numero_pagina, page in enumerate(pdf.pages, start=1):

# #         words = page.extract_words(
# #             extra_attrs=["fontname", "size"]
# #         )

# #         for word in words:

# #             if (
# #                 word["fontname"] == "GAAAAA+Tahoma-Bold"
# #                 and round(word["size"], 2) == 7.83
# #             ):
# #                 print(
# #                     f"PÁGINA {numero_pagina} | "
# #                     f"{word['text']} | "
# #                     f"x0={word['x0']:.2f} | "
# #                     f"top={word['top']:.2f}"
# #                 )

# # with pdfplumber.open(PDF_PATH) as pdf:

# #     def mostrar_informacoes(word):
# #         print(
# #             f"texto={word['text']} | "
# #             f"x0={word['x0']:.2f} | "
# #             f"top={word['top']:.2f} | "
# #             f"fonte={word.get('fontname')} | "
# #             f"tamanho={word.get('size'):.2f} | "
# #             f"cor={word.get('non_stroking_color')}"
# #         )

# #     page = pdf.pages[2]  # página 3

# #     words = page.extract_words(
# #         extra_attrs=["fontname", "size", "non_stroking_color"]
# #     )

# #     for word in words:
# #         if word["text"] in ["2022", "Vínculo", "institucional", "Atividades", "Atual"]:
# #             mostrar_informacoes(word)

# # # with pdfplumber.open(PDF_PATH) as pdf:

# # #     page = pdf.pages[2]

# # #     for char in page.chars:
# # #         if 30 < char["top"] < 70:
# # #             print(
# # #                 f"texto={char['text']} | "
# # #                 f"x0={char['x0']:.2f} | "
# # #                 f"top={char['top']:.2f} | "
# # #                 f"font={char['fontname']} | "
# # #                 f"size={char['size']:.2f} | "
# # #                 f"stroking={char.get('stroking_color')} | "
# # #                 f"non_stroking={char.get('non_stroking_color')}"
# # #             )

import pdfplumber

# 1. Suas funções existentes (ler_pdf, agrupar_em_linhas, identificar_nivel)
# ... [mantenha o código das suas funções aqui] ...


# 2. Bloco de execução para testar a função:
if __name__ == "__main__":
    PDF_PATH = "parser/tests/fixtures/lattes-01.pdf"

    paginas = ler_pdf(PDF_PATH)

    # Acessa diretamente a página 3 (índice 2)
    words_pagina_3 = paginas[2]

    print("--- PÁGINA 3 ---")
    for word in words_pagina_3:
        nivel = identificar_nivel(word)

        if nivel:
            print(
                f"{nivel.upper()} | "
                f"{word['text']} | "
                f"x0={word['x0']:.2f} | "
                f"top={word['top']:.2f}"
            )
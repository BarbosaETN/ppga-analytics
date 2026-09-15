# from pathlib import Path

# from readers.pdf_reader import extrair_linhas

# from extractors.ensino_extractor import (
#     extrair_secao_atuacao_profissional,
#     montar_atuacao
# )


# BASE_DIR = Path(__file__).resolve().parent

# PDF_PATH = (
#     BASE_DIR.parent
#     / "tests"
#     / "fixtures"
#     / "lattes-03.pdf"
# )

# linhas = extrair_linhas(PDF_PATH)

# linhas_atuacao = extrair_secao_atuacao_profissional(linhas)

# atuacao = montar_atuacao(linhas_atuacao)

# for instituicao in atuacao:

#     print()
#     print("INSTITUIÇÃO:", instituicao["texto"])

#     for subsecao in instituicao["subsecoes"]:

#         print("  SUBSEÇÃO:", subsecao["texto"])

#         for periodo in subsecao["periodos"]:

#             print("    PERÍODO:", periodo["texto"])

#             for conteudo in periodo["conteudos"]:

#                 print("      CONTEÚDO:", conteudo)

#             for subsecao_interna in periodo["subsecoes"]:

#                 print(
#                     "      SUBSEÇÃO INTERNA:",
#                     subsecao_interna["texto"]
#                 )

#                 for conteudo in subsecao_interna["conteudos"]:

#                     print(
#                         "        CONTEÚDO:",
#                         conteudo
#                     )


# ======================================
# TESTE 1
# ======================================

# from pathlib import Path
# from readers.pdf_reader import extrair_linhas


# BASE_DIR = Path(__file__).resolve().parent

# for numero in range(1, 6):

#     PDF_PATH = (
#         BASE_DIR.parent
#         / "tests"
#         / "fixtures"
#         / f"lattes-0{numero}.pdf"
#     )

#     print("\n" + "=" * 80)
#     print(f"LATTES {numero}")
#     print("=" * 80)

#     linhas = extrair_linhas(PDF_PATH)

#     for linha in linhas:

#         if "atua" in linha["text"].lower():

#             print(
#                 f"PÁGINA {linha['pagina']} | "
#                 f"texto={linha['text']!r} | "
#                 f"x0={linha['x0']:.2f} | "
#                 f"top={linha['top']:.2f} | "
#                 f"font={linha['fontname']} | "
#                 f"size={linha['size']:.2f} | "
#                 f"cor={linha['non_stroking_color']}"
#             )




# ======================================
# TESTE 2
# ======================================

from pathlib import Path

from readers.pdf_reader import extrair_linhas

from extractors.ensino_extractor import (
    extrair_secao_atuacao_profissional
)


BASE_DIR = Path(__file__).resolve().parent


# for numero in range(1, 6):

#     PDF_PATH = (
#         BASE_DIR.parent
#         / "tests"
#         / "fixtures"
#         / f"lattes-0{numero}.pdf"
#     )

#     print("\n" + "=" * 80)
#     print(f"LATTES {numero}")
#     print("=" * 80)

#     linhas = extrair_linhas(PDF_PATH)

#     atuacao = extrair_secao_atuacao_profissional(linhas)

#     print(f"Quantidade de linhas extraídas: {len(atuacao)}")

#     for linha in atuacao[:10]:

#         print(
#             f"PÁGINA {linha['pagina']} | "
#             f"{linha['text']} | "
#             f"x0={linha['x0']:.2f} | "
#             f"top={linha['top']:.2f}"
#         )

#     if atuacao:
#         print("...")
#         print(
#             f"ÚLTIMA: PÁGINA {atuacao[-1]['pagina']} | "
#             f"{atuacao[-1]['text']} | "
#             f"x0={atuacao[-1]['x0']:.2f} | "
#             f"top={atuacao[-1]['top']:.2f}"
#         )


# ======================================
# TESTE 3
# ======================================

from extractors.ensino_extractor import (
    extrair_secao_atuacao_profissional,
    montar_atuacao
)

# for numero in range(1, 6):

    # PDF_PATH = (
    #     BASE_DIR.parent
    #     / "tests"
    #     / "fixtures"
    #     / f"lattes-0{numero}.pdf"
    # )

    # print("\n" + "=" * 80)
    # print(f"LATTES {numero}")
    # print("=" * 80)

    # linhas = extrair_linhas(PDF_PATH)

    # linhas_atuacao = extrair_secao_atuacao_profissional(linhas)

    # resultado = montar_atuacao(linhas_atuacao)

    # print(f"Instituições encontradas: {len(resultado)}")

    # for instituicao in resultado:

    #     print(
    #         f"\nINSTITUIÇÃO: "
    #         f"{instituicao['texto']}"
    #     )

    #     print(
    #         f"Subseções: "
    #         f"{len(instituicao['subsecoes'])}"
    #     )

    #     for subsecao in instituicao["subsecoes"]:

    #         print(
    #             f"  SUBSEÇÃO: "
    #             f"{subsecao['texto']}"
    #         )

    #         print(
    #             f"  Períodos: "
    #             f"{len(subsecao['periodos'])}"
    #         )

    #         for periodo in subsecao["periodos"]:

    #             print(
    #                 f"    PERÍODO: "
    #                 f"{periodo['texto']}"
    #             )

    #             print(
    #                 f"    Conteúdos: "
    #                 f"{len(periodo['conteudos'])}"
    #             )

    #             print(
    #                 f"    Subseções internas: "
    #                 f"{len(periodo['subsecoes'])}"
    #             )

# ======================================
# TESTE 4
# ======================================

for numero in range(1, 6):

    PDF_PATH = (
        BASE_DIR.parent
        / "tests"
        / "fixtures"
        / f"lattes-0{numero}.pdf"
    )

    print("\n" + "=" * 80)
    print(f"LATTES {numero}")
    print("=" * 80)

    linhas = extrair_linhas(PDF_PATH)

    linhas_atuacao = extrair_secao_atuacao_profissional(linhas)

    for linha in linhas_atuacao[:5]:

        print(
            f"PÁGINA {linha['pagina']} | "
            f"texto={linha['text']!r} | "
            f"x0={linha['x0']:.2f} | "
            f"font={linha['fontname']} | "
            f"size={linha['size']:.2f} | "
            f"cor={linha['non_stroking_color']}"
        )
        
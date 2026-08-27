from pathlib import Path

from readers.pdf_reader import (
    extrair_linhas,
    eh_instituicao,
    eh_subsecao,
    eh_periodo,
    eh_outras_informacoes,
    eh_conteudo
)


BASE_DIR = Path(__file__).resolve().parent

PDF_PATH = (
    BASE_DIR.parent
    / "tests"
    / "fixtures"
    / "lattes-01.pdf"
)


linhas = extrair_linhas(PDF_PATH)


for linha in linhas:

    # Apenas para teste com menos páginas
    if linha["pagina"] > 10:
        break

    if (
        eh_instituicao(linha)
        or eh_subsecao(linha)
        or eh_periodo(linha)
        or eh_outras_informacoes(linha)
        or eh_conteudo(linha)
    ):

        print(
            f"PÁGINA {linha['pagina']} | "
            f"{linha['text']} | "
            f"x0={linha['x0']:.2f} | "
            f"top={linha['top']:.2f}"
        )
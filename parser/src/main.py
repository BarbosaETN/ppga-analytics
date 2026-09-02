from pathlib import Path
from readers.pdf_reader import extrair_linhas
from extractors.ensino_extractor import (
    eh_secao_principal,
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

    texto = linha["text"].strip().lower()

    if eh_secao_principal(linha):
        print(
            f"PÁGINA {linha['pagina']} | "
            f"{linha['text']} | "
            f"x0={linha['x0']:.2f} | "
            f"top={linha['top']:.2f} | "
            f"font={linha['fontname']} | "
            f"size={linha['size']:.2f} | "
            f"cor={linha['non_stroking_color']}"
        )
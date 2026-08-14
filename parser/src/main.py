from pathlib import Path
import pdfplumber

# Descobre o diretório onde o main.py está localizado (.../parser/src)
BASE_DIR = Path(__file__).resolve().parent

# Sobe um nível para a raiz do parser e aponta para a pasta tests/fixtures
PDF_PATH = BASE_DIR.parent / "tests" / "fixtures" / "lattes-01.pdf"

def extrair_estrutura_lattes(pdf_path):
    secao_atual = None
    subsecao_atual = None

    # Adicionada uma leve margem para evitar falso-positivo por arredondamento de float
    # Se o título é 64.44, qualquer x0 < 100 é Título de Seção
    # Se o subtítulo é 151.72, qualquer x0 entre 100 e 200 é Subtítulo
    X_TITULO_MAX = 100.0
    X_SUBTITULO_MAX = 200.0

    with pdfplumber.open(pdf_path) as pdf:
        # AQUI: [:11] limita o processamento apenas para as 11 primeiras páginas (índices 0 a 10)
        for num_pagina, page in enumerate(pdf.pages[:11], 1):
            print(f"\n==========================================")
            print(f"            PROCESSANDO PÁGINA {num_pagina}")
            print(f"==========================================")

            # Extrai palavras ordenadas por posição vertical (top) e depois horizontal (x0)
            words = page.extract_words(use_text_flow=True)
            
            # Agrupar palavras que estão na mesma linha (mesmo 'top' aproximado)
            linhas = []
            words_ordenadas = sorted(words, key=lambda w: (round(w['top'], 1), w['x0']))
            
            # Agrupamento básico por linha (tolerância de 3pt na vertical)
            for word in words_ordenadas:
                if not linhas or abs(word['top'] - linhas[-1]['top']) > 3:
                    linhas.append({'top': word['top'], 'x0': word['x0'], 'text': word['text']})
                else:
                    linhas[-1]['text'] += " " + word['text']

            # Processar cada linha montada
            for linha in linhas:
                texto = linha['text'].strip()
                x0 = linha['x0']

                # Nível 1: Título de Seção Principal
                if x0 < X_TITULO_MAX:
                    secao_atual = texto
                    subsecao_atual = None
                    print(f"\n[SEÇÃO]: {secao_atual}")

                # Nível 2: Subtítulo ou Campo
                elif X_TITULO_MAX <= x0 < X_SUBTITULO_MAX:
                    subsecao_atual = texto
                    print(f"  [CAMPO/ANO]: {subsecao_atual}")

                # Nível 3: Conteúdo Relacionado
                else:
                    print(f"    [VALOR]: {texto}")

# Passa a variável PDF_PATH para a função
extrair_estrutura_lattes(PDF_PATH)
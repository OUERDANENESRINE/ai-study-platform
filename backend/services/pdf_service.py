import pdfplumber


def extract_text_by_page(file_path: str) -> list[dict]:
    """
    Retourne une liste de { "page": int, "text": str } pour chaque page du PDF.
    """
    pages_content = []
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            pages_content.append({"page": i, "text": text})
    return pages_content
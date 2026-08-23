def chunk_text(pages_content: list[dict], chunk_size: int = 800, overlap: int = 150) -> list[dict]:
    """
    Découpe le texte en chunks d'environ `chunk_size` caractères,
    avec un overlap entre chunks pour ne pas couper le contexte.
    Chaque chunk garde une trace de sa page d'origine.
    """
    chunks = []

    for page_data in pages_content:
        text = page_data["text"]
        page = page_data["page"]

        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text_piece = text[start:end]

            if chunk_text_piece.strip():
                chunks.append({"content": chunk_text_piece, "page": page})

            start += chunk_size - overlap

    return chunks
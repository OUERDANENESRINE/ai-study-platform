import os
import time
import voyageai

client = voyageai.Client(api_key=os.getenv("VOYAGE_API_KEY"))


def generate_embeddings(texts: list[str], batch_size: int = 3) -> list[list[float]]:
    """
    Prend une liste de textes et retourne leurs embeddings (vecteurs),
    en les envoyant par petits lots pour respecter les limites de débit de l'API.
    """
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        result = client.embed(batch, model="voyage-3", input_type="document")
        all_embeddings.extend(result.embeddings)

        if i + batch_size < len(texts):
            time.sleep(20)  # respecter la limite de 3 requêtes/minute

    return all_embeddings
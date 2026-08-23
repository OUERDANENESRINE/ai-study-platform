import json
import re
from services.claude_service import client


def generate_flashcards(course_text: str, num_cards: int = 10) -> list[dict]:
    prompt = f"""Voici le contenu d'un cours :

{course_text}

Génère exactement {num_cards} flashcards pour aider à mémoriser les concepts clés de ce cours.
Chaque flashcard a un recto (une question courte ou un terme) et un verso (la réponse ou définition courte).

Réponds UNIQUEMENT avec un tableau JSON valide, sans aucun texte avant ou après, au format exact suivant :
[
  {{
    "front": "question ou terme court",
    "back": "réponse ou définition courte",
    "topic": "sujet/chapitre concerné en 2-3 mots"
  }}
]"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()
    raw_text = re.sub(r"^```json\s*|\s*```$", "", raw_text.strip())

    cards = json.loads(raw_text)
    return cards
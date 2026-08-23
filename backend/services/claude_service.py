import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

USE_MOCK = False  # passe à True pour tester sans appeler l'API

LEVEL_INSTRUCTIONS = {
    "short": "Fais un résumé très concis, en 5-6 points clés maximum.",
    "medium": "Fais un résumé structuré en sections avec les points importants.",
    "detailed": "Fais un résumé détaillé et complet, organisé par chapitres/sections, avec explications.",
}


def generate_summary(course_text: str, level: str = "medium") -> str:
    if USE_MOCK:
        return f"""## Résumé ({level})

Ceci est un résumé simulé pour tester le pipeline sans appeler l'API.

Le cours contient environ {len(course_text)} caractères de contenu.

## Concepts clés
- Concept de test 1
- Concept de test 2
- Concept de test 3
"""

    instruction = LEVEL_INSTRUCTIONS.get(level, LEVEL_INSTRUCTIONS["medium"])

    prompt = f"""Voici le contenu d'un cours :

{course_text}

{instruction}

Structure ta réponse avec des titres de sections clairs (##) et une liste de concepts clés à la fin (## Concepts clés)."""

    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt,
)
    return response.text


def answer_question(question: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks)

    prompt = f"""Voici des extraits d'un cours :

{context}

Question : {question}

Réponds à la question en te basant uniquement sur les extraits ci-dessus. Si la réponse ne s'y trouve pas, dis-le clairement."""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text
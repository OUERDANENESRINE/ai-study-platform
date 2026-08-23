import json
import re
from services.claude_service import client


def generate_quiz_questions(course_text: str, num_questions: int = 5) -> list[dict]:
    prompt = f"""Voici le contenu d'un cours :

{course_text}

Génère exactement {num_questions} questions à choix multiples (QCM) pour tester la compréhension de ce cours.

Réponds UNIQUEMENT avec un tableau JSON valide, sans aucun texte avant ou après, au format exact suivant :
[
  {{
    "question": "texte de la question",
    "options": ["option A", "option B", "option C", "option D"],
    "correct_answer": "la bonne option (doit être identique à une des options)",
    "topic": "sujet/chapitre concerné en 2-3 mots"
  }}
]"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()

    # Nettoyage au cas où l'IA ajoute des balises markdown ```json ... ```
    raw_text = re.sub(r"^```json\s*|\s*```$", "", raw_text.strip())

    questions = json.loads(raw_text)
    return questions
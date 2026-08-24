from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict

from db.database import get_db
from models.quiz import Quiz, QuizQuestion, QuizAttempt
from models.flashcard import Flashcard, FlashcardReview


from services.claude_service import client
router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/course/{course_id}")
def get_progress(course_id: int, db: Session = Depends(get_db)):
    # 1. Dernières tentatives de quiz pour ce cours
    quiz_ids = [q.id for q in db.query(Quiz).filter(Quiz.course_id == course_id).all()]
    attempts = (
        db.query(QuizAttempt).filter(QuizAttempt.quiz_id.in_(quiz_ids)).all()
        if quiz_ids
        else []
    )

    quiz_score_percent = None
    weak_topics_from_quiz = []
    if attempts:
        last_attempt = attempts[-1]
        quiz_score_percent = round((last_attempt.score / last_attempt.total) * 100)
        weak_topics_from_quiz = last_attempt.weak_topics or []

    # 2. Reviews de flashcards pour ce cours
    flashcard_ids = [
        f.id for f in db.query(Flashcard).filter(Flashcard.course_id == course_id).all()
    ]
    reviews = (
        db.query(FlashcardReview)
        .filter(FlashcardReview.flashcard_id.in_(flashcard_ids))
        .all()
        if flashcard_ids
        else []
    )

    difficult_count = len([r for r in reviews if r.difficulty == "difficult"])
    total_reviews = len(reviews)
    flashcard_score_percent = (
        round(((total_reviews - difficult_count) / total_reviews) * 100)
        if total_reviews > 0
        else None
    )

    # 3. Sujets difficiles côté flashcards (via leur topic)
    difficult_flashcard_ids = {
        r.flashcard_id for r in reviews if r.difficulty == "difficult"
    }
    weak_topics_from_flashcards = [
        f.topic
        for f in db.query(Flashcard).filter(Flashcard.id.in_(difficult_flashcard_ids)).all()
        if f.topic
    ]

    # 4. Fusionner les sujets faibles des deux sources
    all_weak_topics = list(set(weak_topics_from_quiz + weak_topics_from_flashcards))

    # 5. Score global (moyenne des deux, si disponibles)
    scores = [s for s in [quiz_score_percent, flashcard_score_percent] if s is not None]
    overall_progress = round(sum(scores) / len(scores)) if scores else 0

    return {
        "overall_progress": overall_progress,
        "quiz_score_percent": quiz_score_percent,
        "flashcard_score_percent": flashcard_score_percent,
        "weak_topics": all_weak_topics,
    }




@router.get("/course/{course_id}/recommendation")
def get_recommendation(course_id: int, db: Session = Depends(get_db)):
    progress_data = get_progress(course_id, db)

    weak_topics = progress_data["weak_topics"]

    if not weak_topics:
        return {
            "recommendation": "Bien joué ! Aucun point faible détecté pour le moment. Continue comme ça 🎉"
        }

    topics_str = ", ".join(weak_topics)

    prompt = f"""Un étudiant a des difficultés sur les sujets suivants dans son cours : {topics_str}.

Écris une recommandation courte et encourageante (2-3 phrases maximum) pour l'aider à progresser, en lui conseillant de revoir ces sujets."""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return {"recommendation": response.text, "weak_topics": weak_topics}
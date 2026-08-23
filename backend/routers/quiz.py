from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db.database import get_db
from models.quiz import QuizQuestion, QuizAttempt

router = APIRouter(prefix="/quiz", tags=["quiz"])


class AnswerItem(BaseModel):
    question_id: int
    selected_option: str


class SubmitRequest(BaseModel):
    answers: list[AnswerItem]


@router.post("/{quiz_id}/submit")
def submit_quiz(quiz_id: int, body: SubmitRequest, db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    questions_by_id = {q.id: q for q in questions}

    score = 0
    weak_topics = []
    results = []

    for answer in body.answers:
        question = questions_by_id.get(answer.question_id)
        if not question:
            continue

        is_correct = answer.selected_option == question.correct_answer
        if is_correct:
            score += 1
        elif question.topic:
            weak_topics.append(question.topic)

        results.append(
            {
                "question_id": question.id,
                "correct": is_correct,
                "correct_answer": question.correct_answer,
            }
        )

    attempt = QuizAttempt(
        quiz_id=quiz_id,
        score=score,
        total=len(body.answers),
        weak_topics=list(set(weak_topics)),
    )
    db.add(attempt)
    db.commit()

    return {
        "score": score,
        "total": len(body.answers),
        "weak_topics": list(set(weak_topics)),
        "results": results,
    }
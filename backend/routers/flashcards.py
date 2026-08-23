from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db.database import get_db
from models.chunk import Chunk
from models.flashcard import Flashcard, FlashcardReview
from services.flashcard_service import generate_flashcards

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


class ReviewRequest(BaseModel):
    difficulty: str  # "easy" | "good" | "difficult"


@router.post("/course/{course_id}/generate")
def generate_course_flashcards(course_id: int, db: Session = Depends(get_db)):
    chunks = db.query(Chunk).filter(Chunk.course_id == course_id).order_by(Chunk.page).all()

    if not chunks:
        return {"error": "Course not found or has no content"}

    course_text = "\n\n".join(c.content for c in chunks)

    cards_data = generate_flashcards(course_text, num_cards=10)

    saved_cards = []
    for card in cards_data:
        flashcard = Flashcard(
            course_id=course_id,
            front=card["front"],
            back=card["back"],
            topic=card.get("topic"),
        )
        db.add(flashcard)
        saved_cards.append(flashcard)

    db.commit()
    for card in saved_cards:
        db.refresh(card)

    return {
        "flashcards": [
            {"id": c.id, "front": c.front, "back": c.back} for c in saved_cards
        ]
    }


@router.post("/{flashcard_id}/review")
def review_flashcard(flashcard_id: int, body: ReviewRequest, db: Session = Depends(get_db)):
    review = FlashcardReview(flashcard_id=flashcard_id, difficulty=body.difficulty)
    db.add(review)
    db.commit()
    return {"status": "saved"}
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from db.database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    front = Column(String, nullable=False)  # la question
    back = Column(String, nullable=False)   # la réponse
    topic = Column(String, nullable=True)


class FlashcardReview(Base):
    __tablename__ = "flashcard_reviews"

    id = Column(Integer, primary_key=True, index=True)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), nullable=False)
    difficulty = Column(String, nullable=False)  # "easy" | "good" | "difficult"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
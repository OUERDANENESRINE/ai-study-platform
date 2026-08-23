from sqlalchemy.orm import Session
from sqlalchemy import select
from models.chunk import Chunk


def find_relevant_chunks(db: Session, course_id: int, query_embedding: list[float], top_k: int = 5):
    """
    Retourne les `top_k` chunks les plus proches sémantiquement de la question,
    parmi les chunks du cours donné.
    """
    stmt = (
        select(Chunk)
        .filter(Chunk.course_id == course_id)
        .order_by(Chunk.embedding.cosine_distance(query_embedding))
        .limit(top_k)
    )
    return db.scalars(stmt).all()
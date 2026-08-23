from sqlalchemy import Column, Integer, String, ForeignKey
from pgvector.sqlalchemy import Vector
from db.database import Base


class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    content = Column(String, nullable=False)
    page = Column(Integer, nullable=True)
    embedding = Column(Vector(1024), nullable=True)
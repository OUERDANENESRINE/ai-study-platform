from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    num_pages = Column(Integer, nullable=False)
    word_count = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
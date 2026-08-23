import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from models.course import Course
from models.chunk import Chunk
from services.pdf_service import extract_text_by_page
from services.chunking_service import chunk_text
from services.embedding_service import generate_embeddings

router = APIRouter(prefix="/courses", tags=["courses"])

UPLOAD_DIR = "uploads"



from fastapi import Query
from services.claude_service import generate_summary


@router.get("/{course_id}/summary")
def get_summary(course_id: int, level: str = Query("medium"), db: Session = Depends(get_db)):
    chunks = db.query(Chunk).filter(Chunk.course_id == course_id).order_by(Chunk.page).all()

    if not chunks:
        return {"error": "Course not found or has no content"}

    course_text = "\n\n".join(c.content for c in chunks)

    summary = generate_summary(course_text, level)

    return {"course_id": course_id, "level": level, "summary": summary}


@router.post("/upload")
async def upload_course(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Sauvegarder le fichier PDF sur disque
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Extraire le texte page par page
    pages_content = extract_text_by_page(file_path)
    word_count = sum(len(p["text"].split()) for p in pages_content)

    # 3. Sauvegarder le cours en base
    course = Course(
        filename=file.filename,
        num_pages=len(pages_content),
        word_count=word_count,
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    # 4. Découper le texte en chunks
    chunks_data = chunk_text(pages_content)

    # 5. Générer les embeddings de tous les chunks en une fois
    texts = [c["content"] for c in chunks_data]
    embeddings = generate_embeddings(texts)

    # 6. Sauvegarder chaque chunk + son embedding en base
    for chunk_data, embedding in zip(chunks_data, embeddings):
        chunk = Chunk(
            course_id=course.id,
            content=chunk_data["content"],
            page=chunk_data["page"],
            embedding=embedding,
        )
        db.add(chunk)

    db.commit()

    return {
        "id": course.id,
        "filename": course.filename,
        "num_pages": course.num_pages,
        "word_count": course.word_count,
        "num_chunks": len(chunks_data),
    }
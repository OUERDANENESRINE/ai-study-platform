from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine
from sqlalchemy import text
from routers import courses, quiz,flashcards,progress

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router)
app.include_router(quiz.router)
app.include_router(flashcards.router)
app.include_router(progress.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"database": "connected"}
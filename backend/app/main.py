from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from app.schemas import Answer, Notice, Question
from app.services.notices import SAMPLE, answer_question

app = FastAPI(title="Yasashii demo API", version="0.1.0")


@app.get("/api/health")
def health() -> dict[str, str]:
    """Report API availability."""
    return {"status": "ok"}


@app.get("/api/notices/sample", response_model=Notice)
def sample_notice() -> Notice:
    """Return the fictional bilingual notice used for demonstrations."""
    return SAMPLE


@app.post("/api/notices/{notice_id}/questions", response_model=Answer)
def ask_question(notice_id: str, question: Question) -> Answer:
    """Answer a question about the supported sample, without an external AI call."""
    if notice_id != SAMPLE.id:
        raise HTTPException(status_code=404, detail="Notice not found")
    if not question.text.strip():
        raise HTTPException(status_code=422, detail="Enter a question")
    return answer_question(question.text, question.language)


# API routes take precedence; this mount is enabled after the frontend is built.
frontend_dir = Path(__file__).parent / "frontend"
if frontend_dir.is_dir():
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

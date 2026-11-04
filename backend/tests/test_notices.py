from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_sample_actions_reference_existing_sources() -> None:
    response = client.get("/api/notices/sample")
    assert response.status_code == 200
    notice = response.json()
    assert notice["demo"] is True
    source_ids = {source["id"] for source in notice["sources"]}
    assert all(action["source_id"] in source_ids for action in notice["actions"])


def test_unknown_question_does_not_invent_instructions() -> None:
    response = client.post(
        "/api/notices/sample-ward-visit/questions",
        json={"text": "What fee should I pay?", "language": "en"},
    )
    assert response.status_code == 200
    assert response.json()["source_ids"] == []
    assert "not stated" in response.json()["text"]


def test_japanese_answer_is_linked_to_source() -> None:
    response = client.post(
        "/api/notices/sample-ward-visit/questions",
        json={"text": "予約は必要ですか", "language": "ja"},
    )
    assert response.json()["source_ids"] == ["s1"]
    assert "予約は いりません" in response.json()["text"]


def test_invalid_requests_are_rejected() -> None:
    url = "/api/notices/sample-ward-visit/questions"
    assert client.post(url, json={"text": " "}).status_code == 422
    assert client.post(url, json={"text": "Hi", "language": "fr"}).status_code == 422
    assert (
        client.post("/api/notices/other/questions", json={"text": "Hi"}).status_code
        == 404
    )

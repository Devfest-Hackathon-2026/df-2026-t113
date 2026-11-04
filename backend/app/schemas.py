from typing import Literal

from pydantic import BaseModel, Field


class BilingualText(BaseModel):
    en: str
    ja: str


class Source(BaseModel):
    id: str
    text: str


class Action(BaseModel):
    id: str
    title: BilingualText
    detail: BilingualText
    source_id: str


class Notice(BaseModel):
    id: str
    title: BilingualText
    issuer: BilingualText
    summary: BilingualText
    deadline: BilingualText
    items: list[BilingualText]
    actions: list[Action]
    sources: list[Source]
    demo: bool = True


class Question(BaseModel):
    text: str = Field(min_length=1, max_length=500)
    language: Literal["en", "ja"] = "en"


class Answer(BaseModel):
    text: str
    source_ids: list[str]
    demo: bool = True

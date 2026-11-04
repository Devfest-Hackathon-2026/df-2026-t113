from app.schemas import Answer, Notice

SAMPLE = Notice.model_validate(
    {
        "id": "sample-ward-visit",
        "title": {"en": "A visit to your ward office", "ja": "区役所へ 行きます"},
        "issuer": {
            "en": "Sample ward office · Fictional notice",
            "ja": "見本の 区役所・練習用の お知らせ",
        },
        "summary": {
            "en": (
                "This sample notice asks you to visit the residents’ "
                "counter to confirm your address. Bring the two docum"
                "ents listed below. You do not need to book an appoin"
                "tment."
            ),
            "ja": (
                "この 見本の お知らせでは、住所を 確かめるために 区役所へ 行きます。下に 書いてある 2つの 書類を"
                " 持っていきます。予約は いりません。"
            ),
        },
        "deadline": {
            "en": "Tuesday, 10 November 2026",
            "ja": "2026年11月10日（火曜日）まで",
        },
        "items": [
            {"en": "Your residence card", "ja": "在留カード"},
            {"en": "This notice", "ja": "この お知らせ"},
        ],
        "actions": [
            {
                "id": "prepare",
                "title": {"en": "Get your documents ready", "ja": "書類を 用意します"},
                "detail": {
                    "en": "Put your residence card and this notice together.",
                    "ja": "在留カードと この お知らせを 用意します。",
                },
                "source_id": "s2",
            },
            {
                "id": "visit",
                "title": {
                    "en": "Visit the residents’ counter",
                    "ja": "区役所の 窓口へ 行きます",
                },
                "detail": {
                    "en": (
                        "Go on a weekday, 9:00–17:00, by 10 November. No appo"
                        "intment needed."
                    ),
                    "ja": "11月10日までの 月〜金曜日、9時〜17時に 行きます。予約は いりません。",
                },
                "source_id": "s1",
            },
            {
                "id": "confirm",
                "title": {
                    "en": "Ask staff to confirm your address",
                    "ja": "住所を 確かめてもらいます",
                },
                "detail": {
                    "en": (
                        "Show your documents at the counter. Ask staff if you"
                        " need to do anything else."
                    ),
                    "ja": "窓口で 書類を 見せます。ほかに することが あるか 聞きます。",
                },
                "source_id": "s3",
            },
        ],
        "sources": [
            {
                "id": "s1",
                "text": (
                    "【見本・架空のお知らせ】2026年11月10日（火）までに区役所の住民窓口へお越しください。受付時間：平"
                    "日9時〜17時。予約は不要です。"
                ),
            },
            {"id": "s2", "text": "持ち物：在留カード、本通知。"},
            {
                "id": "s3",
                "text": "住所確認のため、窓口で上記書類をご提示ください。その他のお手続きについては職員にご確認ください。",
            },
        ],
    }
)


def answer_question(text: str, language: str) -> Answer:
    """Answer supported sample questions using fixed, source-linked responses.

    @param text User question about the fictional sample notice.
    @param language Output language, validated by the API schema.
    @return A demo response with the relevant source identifiers.
    """
    question = text.casefold()
    if any(word in question for word in ["bring", "document", "持", "書類"]):
        answer = {
            "en": (
                "Bring your residence card and this notice. The sampl"
                "e does not list any other required documents."
            ),
            "ja": "在留カードと この お知らせを 持っていきます。ほかの 書類は この 見本には 書いてありません。",
        }
        sources = ["s2"]
    elif any(
        word in question
        for word in ["when", "deadline", "time", "いつ", "時間", "期限"]
    ):
        answer = {
            "en": (
                "Visit by Tuesday, 10 November 2026. The sample count"
                "er is open on weekdays, 9:00–17:00."
            ),
            "ja": "2026年11月10日（火曜日）までに 行きます。月〜金曜日の 9時〜17時です。",
        }
        sources = ["s1"]
    elif any(word in question for word in ["appointment", "book", "予約"]):
        answer = {
            "en": "You do not need an appointment, according to the sample notice.",
            "ja": "この 見本では、予約は いりません。",
        }
        sources = ["s1"]
    else:
        answer = {
            "en": (
                "That information is not stated in this sample notice"
                ". Please ask the issuing office. This demo supports "
                "questions about what to bring, the deadline, and app"
                "ointments."
            ),
            "ja": "そのことは この 見本には 書いてありません。区役所に 聞いてください。この デモでは、持ち物・期限・予約について 答えます。",
        }
        sources = []
    return Answer(text=answer[language], source_ids=sources)

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleCheck,
  FileText,
  Info,
  LoaderCircle,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Notice, Language } from "../client";
import type { Message, Translate } from "../types";

interface Props {
  t: Translate;
  notice: Notice;
  language: Language;
  completed: number;
  tab: "overview" | "steps";
  setTab: (tab: "overview" | "steps") => void;
  sourceButton: (id: string) => ReactNode;
  completedIds: string[];
  toggleAction: (id: string) => void;
  messages: Message[];
  asking: boolean;
  sendQuestion: (text: string) => Promise<void>;
  question: string;
  setQuestion: (text: string) => void;
  chatError: string;
  onBack: () => void;
}

export default function NoticeScreen(props: Props) {
  const {
    t,
    notice,
    language,
    completed,
    tab,
    setTab,
    sourceButton,
    completedIds,
    toggleAction,
    messages,
    asking,
    sendQuestion,
    question,
    setQuestion,
    chatError,
    onBack,
  } = props;
  return (
    <div className="results page-enter">
      <button className="back-link" onClick={() => onBack()}>
        <ArrowLeft size={15} />
        {t("Your notices", "お知らせ")}
      </button>
      <div className="result-topline">
        <span className="pill">
          <Sparkles size={12} />
          {t("MADE SIMPLE", "やさしい 説明")}
        </span>
        <span className="small-label">{t("SAMPLE NOTICE", "見本")}</span>
      </div>
      <h1 className="result-title">{notice.title[language]}</h1>
      <p className="issuer">{notice.issuer[language]}</p>
      <div className="result-tabs" role="tablist" aria-label="Notice sections">
        <button
          role="tab"
          id="overview-tab"
          aria-controls="notice-panel"
          aria-selected={tab === "overview"}
          onClick={() => setTab("overview")}
        >
          {t("The simple version", "やさしい 説明")}
        </button>
        <button
          role="tab"
          id="steps-tab"
          aria-controls="notice-panel"
          aria-selected={tab === "steps"}
          onClick={() => setTab("steps")}
        >
          {t("Your next steps", "次に すること")}
          <span>
            {completed}/{notice.actions.length}
          </span>
        </button>
      </div>
      <div
        id="notice-panel"
        role="tabpanel"
        aria-labelledby={tab === "overview" ? "overview-tab" : "steps-tab"}
      >
        {tab === "overview" ? (
          <>
            <section className="summary-card">
              <span className="card-kicker">
                <BookOpen size={15} />
                {t("IN A FEW WORDS", "かんたんに 言うと")}
              </span>
              <p>{notice.summary[language]}</p>
              {sourceButton("all")}
            </section>
            <section className="deadline-card">
              <div className="date-tile">
                <small>NOV</small>
                <strong>10</strong>
              </div>
              <div>
                <span className="card-kicker">
                  {t("YOUR DEADLINE", "いつまで？")}
                </span>
                <strong>{notice.deadline[language]}</strong>
                <span>
                  {t("Weekdays · 9:00–17:00", "月〜金曜日・9時〜17時")}
                </span>
              </div>
            </section>
            <section className="bring-section">
              <h2>{t("Before you go", "行く 前に")}</h2>
              <p>{t("Two things to take with you.", "2つ 持っていきます。")}</p>
              {notice.items.map((item, index) => (
                <div className="bring-item" key={item.en}>
                  <span>0{index + 1}</span>
                  <FileText size={19} />
                  <strong>{item[language]}</strong>
                  <Check size={16} />
                </div>
              ))}
              {sourceButton("s2")}
            </section>
            <button className="primary-button" onClick={() => setTab("steps")}>
              {t("See my next steps", "次に することを 見る")}
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <section className="checklist-section">
            <div className="checklist-heading">
              <div>
                <h2>
                  {completed === notice.actions.length
                    ? t("You did it.", "できました。")
                    : t("One step at a time.", "ひとつずつ、進めます。")}
                </h2>
                <p aria-live="polite">
                  {completed} {t("of", "/")} {notice.actions.length}{" "}
                  {t("steps complete", "完了")}
                </p>
              </div>
              <CircleCheck size={29} />
            </div>
            <div className="progress-track">
              <span
                style={{
                  width: `${(completed / notice.actions.length) * 100}%`,
                }}
              />
            </div>
            {notice.actions.map((action, index) => (
              <div
                className={`action-card ${completedIds.includes(action.id) ? "done" : ""}`}
                key={action.id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={completedIds.includes(action.id)}
                    onChange={() => toggleAction(action.id)}
                  />
                  <span className="custom-check">
                    {completedIds.includes(action.id) && <Check size={17} />}
                  </span>
                  <span>
                    <span className="small-label">
                      {t("STEP", "手順")} 0{index + 1}
                    </span>
                    <strong>{action.title[language]}</strong>
                  </span>
                </label>
                <p>{action.detail[language]}</p>
                {sourceButton(action.source_id)}
              </div>
            ))}
            <p className="saved-hint">
              <ShieldCheck size={14} />
              {t(
                "Your progress is saved on this device.",
                "進み具合は この 端末に 保存されます。",
              )}
            </p>
          </section>
        )}
      </div>
      <section className="chat-section">
        <span className="chat-icon">
          <MessageCircle size={22} />
        </span>
        <h2>{t("Still a little unsure?", "まだ、わからないことは？")}</h2>
        <p>
          {t("Ask about this sample notice.", "この 見本について 聞けます。")}
        </p>
        <div className="question-chips">
          {[
            t("What should I bring?", "何を 持っていきますか？"),
            t("Do I need an appointment?", "予約は いりますか？"),
          ].map((text) => (
            <button
              key={text}
              disabled={asking}
              onClick={() => void sendQuestion(text)}
            >
              {text}
              <Plus size={12} />
            </button>
          ))}
        </div>
        <div className="messages" role="log" aria-label="Document questions">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <small>
                {message.role === "user"
                  ? t("YOU", "あなた")
                  : t("SAMPLE ANSWER", "見本の 答え")}
              </small>
              <p>{message.text}</p>
              {message.sourceIds?.map((id) => (
                <span key={id}>{sourceButton(id)}</span>
              ))}
            </div>
          ))}
          {asking && (
            <p role="status" className="processing">
              <LoaderCircle size={16} className="spin" />
              {t("Checking the sample…", "見本を 確かめています…")}
            </p>
          )}
        </div>
        <form
          className="question-form"
          onSubmit={(event) => {
            event.preventDefault();
            void sendQuestion(question);
          }}
        >
          <label className="sr-only" htmlFor="question">
            {t("Your question", "質問")}
          </label>
          <input
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={500}
            placeholder={t(
              "What would you like to know?",
              "質問を 書いてください",
            )}
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={asking || !question.trim()}
          >
            <Send size={18} />
          </button>
        </form>
        {chatError && (
          <p role="alert" className="error-box">
            {chatError}
          </p>
        )}
        <p className="chat-note">
          {t(
            "Scripted demo answers, grounded in the sample. No AI service connected.",
            "見本に 基づく 決まった 答えです。AIには 接続していません。",
          )}
        </p>
      </section>
      <div className="notice-warning">
        <Info size={17} />
        <p>
          {t(
            "This is a fictional notice for demonstration. Confirm real instructions with the issuing office.",
            "これは デモ用の 見本です。本当の 手続きは、お知らせを 出した 窓口で 確かめてください。",
          )}
        </p>
      </div>
    </div>
  );
}

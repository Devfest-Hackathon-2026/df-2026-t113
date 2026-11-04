import HomeScreen from "./components/HomeScreen";
import NoticeScreen from "./components/NoticeScreen";
import type { Screen, Message, SavedState } from "./types";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  Heart,
  Home,
  Info,
  Languages,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import {
  askQuestion,
  getSample,
  type Language,
  type Notice,
  type Source,
} from "./client";

const STORAGE_KEY = "yasashii-demo-v1";

function readSaved(): SavedState {
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    );
    if (data && typeof data === "object") {
      const value = data as Record<string, unknown>;
      return {
        completed: Array.isArray(value.completed)
          ? value.completed.filter(
              (item): item is string => typeof item === "string",
            )
          : [],
        saved: value.saved === true,
        largeText: value.largeText === true,
      };
    }
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
  return { completed: [], saved: false, largeText: false };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [savedState, setSavedState] = useState(readSaved);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<Source | null>(null);
  const [upload, setUpload] = useState<{
    name: string;
    url: string;
    image: boolean;
  } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const sourceDialog = useRef<HTMLDialogElement>(null);
  const uploadDialog = useRef<HTMLDialogElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [chatError, setChatError] = useState("");
  const [tab, setTab] = useState<"overview" | "steps">("overview");
  const t = (en: string, ja: string) => (language === "en" ? en : ja);
  const completed =
    notice?.actions.filter((action) => savedState.completed.includes(action.id))
      .length ?? 0;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch {
      /* The app still works without persistence. */
    }
  }, [savedState]);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);
  useEffect(
    () => () => {
      if (upload) URL.revokeObjectURL(upload.url);
    },
    [upload],
  );
  useEffect(() => {
    if (source) sourceDialog.current?.showModal();
    else sourceDialog.current?.close();
  }, [source]);

  useEffect(() => {
    if (upload) uploadDialog.current?.showModal();
    else uploadDialog.current?.close();
  }, [upload]);

  async function openSample() {
    setLoading(true);
    setError("");
    try {
      const result = await getSample();
      setNotice(result);
      setSavedState((state) => ({ ...state, saved: true }));
      setTab("overview");
      setScreen("notice");
      setUpload(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function chooseFile(file: File | undefined) {
    setUploadError("");
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
        file.type,
      )
    ) {
      setUploadError("Choose a JPG, PNG, WebP image, or PDF.");
      return;
    }
    if (file.size === 0 || file.size > 8 * 1024 * 1024) {
      setUploadError("Choose a non-empty file smaller than 8 MB.");
      return;
    }
    setUpload({
      name: file.name,
      url: URL.createObjectURL(file),
      image: file.type.startsWith("image/"),
    });
  }

  function toggleAction(id: string) {
    setSavedState((state) => ({
      ...state,
      completed: state.completed.includes(id)
        ? state.completed.filter((item) => item !== id)
        : [...state.completed, id],
    }));
  }

  async function sendQuestion(text: string) {
    if (!notice || !text.trim() || asking) return;
    setChatError("");
    setAsking(true);
    setQuestion("");
    setMessages((previous) => [
      ...previous,
      { id: Date.now(), role: "user", text: text.trim() },
    ]);
    try {
      const answer = await askQuestion(notice.id, text.trim(), language);
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: answer.text,
          sourceIds: answer.source_ids,
        },
      ]);
    } catch (cause) {
      setChatError(
        cause instanceof Error ? cause.message : "Please try again.",
      );
      setQuestion(text);
    } finally {
      setAsking(false);
    }
  }

  const sourceButton = (id: string) => (
    <button
      className="source-link"
      onClick={() =>
        setSource(
          id === "all" && notice
            ? {
                id: "all",
                text: notice.sources.map((item) => item.text).join("\n\n"),
              }
            : (notice?.sources.find((item) => item.id === id) ?? null),
        )
      }
    >
      <BookOpen size={12} />
      {t("See original", "元の 文を 見る")}
    </button>
  );

  return (
    <div className={`app-shell ${savedState.largeText ? "large-text" : ""}`}>
      <header className="app-header">
        <button
          className="brand"
          onClick={() => setScreen("home")}
          aria-label="Yasashii home"
        >
          <span className="brand-mark">
            <Check size={22} strokeWidth={2.6} />
          </span>
          yasashii<span className="brand-dot">.</span>
        </button>
        <div className="header-actions">
          <button
            className={`icon-button ${savedState.largeText ? "selected" : ""}`}
            onClick={() =>
              setSavedState((state) => ({
                ...state,
                largeText: !state.largeText,
              }))
            }
            aria-label="Larger text"
            aria-pressed={savedState.largeText}
          >
            <Type size={20} />
          </button>
          <button
            className="language-button"
            onClick={() =>
              setLanguage((previous) => (previous === "en" ? "ja" : "en"))
            }
            aria-label="Switch language"
          >
            <Languages size={15} />
            {language === "en" ? "EN" : "日本語"}
          </button>
        </div>
      </header>

      <main id="main-content">
        {screen === "home" && (
          <HomeScreen
            t={t}
            fileInput={fileInput}
            chooseFile={chooseFile}
            uploadError={uploadError}
            loading={loading}
            error={error}
            openSample={openSample}
          />
        )}
        {screen === "notice" && notice && (
          <NoticeScreen
            t={t}
            notice={notice}
            language={language}
            completed={completed}
            tab={tab}
            setTab={setTab}
            sourceButton={sourceButton}
            completedIds={savedState.completed}
            toggleAction={toggleAction}
            messages={messages}
            asking={asking}
            sendQuestion={sendQuestion}
            question={question}
            setQuestion={setQuestion}
            chatError={chatError}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "saved" && (
          <section className="simple-page page-enter">
            <span className="eyebrow">
              {t("A LITTLE MORE ORGANIZED", "お知らせを 整理")}
            </span>
            <h1>{t("Your notices", "保存した お知らせ")}</h1>
            <p>{t("Pick up where you left off.", "続きから 始めましょう。")}</p>
            {savedState.saved ? (
              <>
                <button
                  className="saved-card"
                  onClick={() => void openSample()}
                  disabled={loading}
                >
                  <span className="sample-icon">
                    <FileText size={24} />
                  </span>
                  <span>
                    <span className="small-label">
                      {t("FICTIONAL SAMPLE", "練習用の 見本")}
                    </span>
                    <strong>
                      {t("A visit to your ward office", "区役所へ 行きます")}
                    </strong>
                    <small>
                      {
                        savedState.completed.filter((id) =>
                          ["prepare", "visit", "confirm"].includes(id),
                        ).length
                      }
                      /3 {t("steps complete", "完了")}
                    </small>
                  </span>
                  {loading ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setSavedState((state) => ({
                      ...state,
                      saved: false,
                      completed: [],
                    }));
                    setNotice(null);
                    setMessages([]);
                  }}
                >
                  {t(
                    "Remove sample and reset progress",
                    "見本と 進み具合を 消す",
                  )}
                </button>
              </>
            ) : (
              <div className="empty-state">
                <BookOpen size={40} strokeWidth={1.2} />
                <h2>{t("A fresh start", "まだ 保存は ありません")}</h2>
                <p>
                  {t(
                    "Try the sample notice. Your checklist will be saved here on this device.",
                    "見本を 試すと、チェックリストが ここに 保存されます。",
                  )}
                </p>
                <button
                  className="primary-button"
                  onClick={() => void openSample()}
                  disabled={loading}
                >
                  {t("Try a sample notice", "見本を 試す")}
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
            {error && (
              <p className="error-box" role="alert">
                {error}
              </p>
            )}
            <p className="saved-hint">
              <LockKeyhole size={14} />
              {t(
                "Stored in this browser only. No account needed.",
                "この ブラウザーだけに 保存します。登録は いりません。",
              )}
            </p>
          </section>
        )}

        {screen === "about" && (
          <section className="simple-page about-page page-enter">
            <span className="eyebrow">
              {t("BUILT WITH A LITTLE CARE", "少しの 思いやりから")}
            </span>
            <h1>{t("A clearer way\nforward.", "わかると、\n進める。")}</h1>
            <p>
              {t(
                "Yasashii means gentle, kind, and easy. That’s how understanding a notice should feel.",
                "やさしい 言葉で 読むと、お知らせが わかりやすく なります。",
              )}
            </p>
            <div className="about-card">
              <ShieldCheck size={26} />
              <h2>
                {t("Your documents, your device", "書類は あなたの 端末に")}
              </h2>
              <p>
                {t(
                  "Uploaded files are previewed locally and are never sent to our server in this prototype. Checklist progress stays in your browser.",
                  "この デモでは、ファイルを サーバーへ 送りません。チェックリストは ブラウザーに 保存します。",
                )}
              </p>
            </div>
            <div className="about-card">
              <Sparkles size={26} />
              <h2>{t("An honest little demo", "この デモで できること")}</h2>
              <p>
                {t(
                  "The sample explanation and Q&A are predefined, not AI-generated. Real document reading, translation, and live AI answers are future integrations.",
                  "説明と 質問の 答えは、あらかじめ 用意したものです。実際の 書類の 読み取りや AIの 回答は、まだ できません。",
                )}
              </p>
            </div>
            <div className="about-signature">
              <Heart size={17} />
              {t(
                "Made for a little more independence.",
                "自分で できることを、少しずつ。",
              )}
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          { id: "home" as const, icon: Home, label: t("Home", "ホーム") },
          {
            id: "saved" as const,
            icon: BookOpen,
            label: t("My notices", "お知らせ"),
          },
          {
            id: "about" as const,
            icon: Heart,
            label: t("About", "この アプリ"),
          },
        ].map((item) => (
          <button
            key={item.id}
            aria-current={
              screen === item.id || (screen === "notice" && item.id === "saved")
                ? "page"
                : undefined
            }
            onClick={() => setScreen(item.id)}
          >
            <item.icon size={21} strokeWidth={1.7} />
            <span>{item.label}</span>
            <span className="nav-indicator" />
          </button>
        ))}
      </nav>
      <dialog
        ref={sourceDialog}
        className="source-dialog"
        onCancel={() => setSource(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSource(null);
        }}
        aria-labelledby="source-title"
      >
        <div className="dialog-header">
          <span className="card-kicker">
            <BookOpen size={16} />
            {t("FROM THE ORIGINAL", "元の お知らせ")}
          </span>
          <button
            className="icon-button"
            aria-label="Close original text"
            onClick={() => setSource(null)}
          >
            <X size={21} />
          </button>
        </div>
        <h2 id="source-title">
          {t("Here’s where it says that.", "ここに 書いてあります。")}
        </h2>
        <blockquote lang="ja">{source?.text}</blockquote>
        <p>
          {t(
            "Fictional sample · Original Japanese text",
            "練習用の 見本・元の 日本語",
          )}
        </p>
      </dialog>
      <dialog
        ref={uploadDialog}
        className="upload-overlay"
        aria-labelledby="upload-title"
        onCancel={() => setUpload(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setUpload(null);
        }}
      >
        {upload && (
          <section className="upload-preview">
            <div className="dialog-header">
              <span className="card-kicker">
                <FileText size={15} />
                {t("FILE PREVIEW", "ファイルの 確認")}
              </span>
              <button
                autoFocus
                className="icon-button"
                aria-label="Close file preview"
                onClick={() => setUpload(null)}
              >
                <X size={22} />
              </button>
            </div>
            <h2 id="upload-title">
              {t("Your notice is here.", "ファイルを 選びました。")}
            </h2>
            <p className="filename">{upload.name}</p>
            {upload.image ? (
              <img src={upload.url} alt="Your selected notice" />
            ) : (
              <div className="pdf-preview">
                <FileText size={46} />
                <span>PDF</span>
                <a href={upload.url} target="_blank" rel="noreferrer">
                  {t("Open local preview", "PDFを 開く")}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            )}
            <div className="preview-note">
              <Info size={19} />
              <p>
                {t(
                  "Preview only. This demo doesn’t read or translate uploaded files yet. Try the fictional sample to explore the full experience.",
                  "確認だけ できます。まだ 書類の 読み取りや 翻訳は できません。見本で アプリを 試してください。",
                )}
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => void openSample()}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                t("Explore the sample instead", "見本を 試す")
              )}
              <ArrowRight size={18} />
            </button>
            {error && (
              <p className="error-box" role="alert">
                {error}
              </p>
            )}
            <button className="text-button" onClick={() => setUpload(null)}>
              {t("Back to home", "戻る")}
            </button>
          </section>
        )}
      </dialog>
    </div>
  );
}

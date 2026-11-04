import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Heart,
  Languages,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import type { RefObject } from "react";
import type { Translate } from "../types";

interface Props {
  t: Translate;
  fileInput: RefObject<HTMLInputElement | null>;
  chooseFile: (file: File | undefined) => void;
  uploadError: string;
  loading: boolean;
  error: string;
  openSample: () => Promise<void>;
}

export default function HomeScreen(props: Props) {
  const { t, fileInput, chooseFile, uploadError, loading, error, openSample } =
    props;
  return (
    <>
      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot" />
          {t("A LITTLE HELP, IN YOUR LANGUAGE", "あなたの 言葉で、お手伝い")}
        </div>
        <h1>
          {t("Less confusion.", "むずかしい 文を、")}
          <br />
          <span>{t("More clarity.", "わかりやすく。")}</span>
        </h1>
        <p className="hero-description">
          {t(
            "Japanese notices, made simple. Understand what matters—and what to do next.",
            "日本語の お知らせを やさしくします。大切なことと、次に することが わかります。",
          )}
        </p>
        <div className="notice-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <span className="art-spark">✧</span>
          <div className="paper">
            <div className="paper-heading">
              お知らせ<span>NOTICE</span>
            </div>
            <div className="paper-line wide" />
            <div className="paper-line" />
            <div className="paper-highlight">大切な お手続きについて</div>
            <div className="paper-line wide" />
            <div className="paper-line short" />
            <span className="paper-seal">見本</span>
          </div>
          <div className="art-translation">
            <span className="tiny-check">
              <Check size={15} />
            </span>
            <div>
              {t("You’ve got this.", "だいじょうぶ。")}
              <small>
                {t("One clear step at a time", "ひとつずつ、わかりやすく")}
              </small>
            </div>
            <Sparkles size={17} />
          </div>
          <span className="art-caption">むずかしい → やさしい</span>
        </div>
      </section>
      <section className="input-section">
        <div className="section-heading">
          <h2>{t("Let’s make it simple", "お知らせを 読みましょう")}</h2>
          <span>01 — 03</span>
        </div>
        <button
          className="upload-card"
          onClick={() => fileInput.current?.click()}
        >
          <span className="upload-icon">
            <Upload size={25} strokeWidth={1.7} />
          </span>
          <strong>{t("Add your notice", "お知らせを 選ぶ")}</strong>
          <span>{t("Choose a photo or a PDF", "写真や PDFを 選びます")}</span>
          <span className="upload-file-types">
            JPG, PNG, WEBP, PDF · MAX 8 MB
          </span>
          <span className="upload-plus">
            <Plus size={17} />
          </span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          hidden
          onChange={(event) => {
            chooseFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <p className="privacy">
          <LockKeyhole size={12} />
          {t(
            "File previews stay on your device.",
            "選んだ ファイルは、この 端末に 残ります。",
          )}
        </p>
        {uploadError && (
          <p role="alert" className="error-box">
            {uploadError}
          </p>
        )}
        <div className="or-divider">
          <span />
          {t("OR START WITH AN EXAMPLE", "見本で 試してみる")}
          <span />
        </div>
        <button
          className="sample-card"
          onClick={() => void openSample()}
          disabled={loading}
        >
          <span className="sample-icon">
            <FileText size={23} />
          </span>
          <span className="sample-copy">
            <strong>
              {t("A letter from the ward office", "区役所からの お知らせ")}
            </strong>
            <span>
              {t(
                "A fictional notice. A real feel for the app.",
                "練習用の お知らせで 試せます。",
              )}
            </span>
            <span className="sample-tag">
              {t("TRY THE DEMO", "デモを 試す")}
              <ArrowUpRight size={12} />
            </span>
          </span>
          {loading ? (
            <LoaderCircle className="spin" size={21} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
        {loading && (
          <p className="processing" role="status">
            <LoaderCircle size={15} className="spin" />
            {t(
              "Preparing your simple explanation…",
              "わかりやすい 説明を 用意しています…",
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="error-box">
            {error}
          </p>
        )}
      </section>
      <section className="how-section">
        <div className="section-heading">
          <h2>{t("From notice to next step", "次に することが わかる")}</h2>
          <ArrowDown size={17} />
        </div>
        <div className="how-grid">
          {[
            {
              icon: FileText,
              title: t("Add a notice", "文を 選ぶ"),
              text: t("Start with a document", "お知らせを 用意"),
            },
            {
              icon: Languages,
              title: t("Understand it", "文を 読む"),
              text: t("In words that make sense", "やさしい 言葉で"),
            },
            {
              icon: ListChecks,
              title: t("Take action", "行動する"),
              text: t("One step at a time", "ひとつずつ 確認"),
            },
          ].map((item, index) => (
            <div className="how-item" key={item.title}>
              <span className="how-number">0{index + 1}</span>
              <item.icon size={22} strokeWidth={1.5} />
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="home-footer">
        <Heart size={14} />
        <span>
          {t(
            "A little less worry. A little more independence.",
            "心配を 少なく。自分で できることを 多く。",
          )}
        </span>
      </div>
      <p className="demo-footnote">
        {t(
          "INTERACTIVE PROTOTYPE · SAMPLE CONTENT, NO AI ANALYSIS",
          "試作品・見本の 内容を 表示します。AI解析は しません。",
        )}
      </p>
    </>
  );
}

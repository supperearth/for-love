import { useMemo, useState, type FormEvent } from "react";
import { siteContent, type MatchPair } from "./data/siteContent";

type Stage = "gate" | "welcome" | "quiz" | "match" | "final";

type MatchCard = {
  uid: string;
  pairId: string;
  side: "label" | "detail";
  text: string;
  image: string;
};

const stages: { id: Stage; label: string }[] = [
  { id: "gate", label: "暗号" },
  { id: "welcome", label: "回忆" },
  { id: "quiz", label: "问答" },
  { id: "match", label: "配对" },
  { id: "final", label: "彩蛋" },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeMatchCards(pairs: MatchPair[]): MatchCard[] {
  return shuffle(
    pairs.flatMap((pair) => [
      {
        uid: `${pair.id}-label`,
        pairId: pair.id,
        side: "label" as const,
        text: pair.label,
        image: pair.image,
      },
      {
        uid: `${pair.id}-detail`,
        pairId: pair.id,
        side: "detail" as const,
        text: pair.detail,
        image: pair.image,
      },
    ]),
  );
}

function Progress({ current }: { current: Stage }) {
  const activeIndex = stages.findIndex((stage) => stage.id === current);

  return (
    <nav className="progress" aria-label="流程进度">
      {stages.map((stage, index) => (
        <span
          className={[
            "progress-step",
            index <= activeIndex ? "is-active" : "",
            stage.id === current ? "is-current" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          key={stage.id}
        >
          <span className="progress-dot" />
          <span>{stage.label}</span>
        </span>
      ))}
    </nav>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const expected = siteContent.accessCode.trim();
    const received = value.trim();

    if (!received) {
      setError("先输入暗号再继续。");
      return;
    }

    if (expected && received !== expected) {
      setError("暗号还没有对上。");
      return;
    }

    setError("");
    onUnlock();
  }

  return (
    <section className="stage-grid">
      <div className="intro-copy">
        <p className="eyebrow">{siteContent.anniversaryDate}</p>
        <h1>{siteContent.anniversaryTitle}</h1>
        <p className="lead">{siteContent.openingLine}</p>
      </div>

      <form className="gate-form" onSubmit={submit}>
        <label htmlFor="passcode">暗号</label>
        <input
          id="passcode"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          placeholder="在这里输入"
        />
        <p className="hint">{siteContent.gateHint}</p>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary-button" type="submit">
          进入
        </button>
      </form>
    </section>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <section className="welcome-layout">
      <div className="intro-copy compact">
        <p className="eyebrow">{siteContent.coupleNames}</p>
        <h2>先走过这一段回忆</h2>
        <p className="lead">{siteContent.welcomeText}</p>
        <button className="primary-button" type="button" onClick={onNext}>
          开始第一关
        </button>
      </div>

      <div className="memory-list" aria-label="回忆节点">
        {siteContent.memories.map((memory) => (
          <article className="memory-item" key={memory.title}>
            <p>{memory.date}</p>
            <h3>{memory.title}</h3>
            <span>{memory.body}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuizGame({ onComplete }: { onComplete: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const question = siteContent.questions[questionIndex];
  const isCorrect = selectedIndex === question.answerIndex;

  function choose(index: number) {
    if (showResult) return;
    setSelectedIndex(index);
    setShowResult(true);
  }

  function next() {
    if (!isCorrect) {
      setSelectedIndex(null);
      setShowResult(false);
      return;
    }

    if (questionIndex === siteContent.questions.length - 1) {
      onComplete();
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedIndex(null);
    setShowResult(false);
  }

  return (
    <section className="game-surface">
      <div className="game-header">
        <p className="eyebrow">
          问答 {questionIndex + 1} / {siteContent.questions.length}
        </p>
        <h2>{question.prompt}</h2>
      </div>

      <div className="option-grid">
        {question.options.map((option, index) => (
          <button
            className={[
              "option-button",
              selectedIndex === index ? "is-selected" : "",
              showResult && index === question.answerIndex ? "is-answer" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            key={`${option}-${index}`}
            onClick={() => choose(index)}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {option}
          </button>
        ))}
      </div>

      <div className="result-row" aria-live="polite">
        {showResult ? (
          <p className={isCorrect ? "success" : "error"}>
            {isCorrect ? question.noteAfterAnswer : "这次不是正确答案，再试一次。"}
          </p>
        ) : (
          <p className="hint">选择一个答案继续。</p>
        )}
        {showResult ? (
          <button className="secondary-button" type="button" onClick={next}>
            {isCorrect ? "继续" : "重选"}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function MatchGame({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState(() => makeMatchCards(siteContent.matchPairs));
  const [opened, setOpened] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const isFinished = matched.length === siteContent.matchPairs.length;

  function reset() {
    setCards(makeMatchCards(siteContent.matchPairs));
    setOpened([]);
    setMatched([]);
  }

  function open(card: MatchCard) {
    if (opened.includes(card.uid) || matched.includes(card.pairId)) return;

    if (opened.length === 0) {
      setOpened([card.uid]);
      return;
    }

    const firstCard = cards.find((item) => item.uid === opened[0]);
    if (!firstCard) return;

    if (firstCard.pairId === card.pairId && firstCard.side !== card.side) {
      setMatched((current) => [...current, card.pairId]);
      setOpened([]);
      return;
    }

    setOpened([opened[0], card.uid]);
    window.setTimeout(() => setOpened([]), 700);
  }

  return (
    <section className="game-surface">
      <div className="game-header">
        <p className="eyebrow">翻牌配对</p>
        <h2>把每个提示和它对应的回忆配在一起</h2>
      </div>

      <div className="match-grid">
        {cards.map((card) => {
          const visible = opened.includes(card.uid) || matched.includes(card.pairId);
          return (
            <button
              className={[
                "match-card",
                visible ? "is-visible" : "",
                matched.includes(card.pairId) ? "is-matched" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              key={card.uid}
              onClick={() => open(card)}
            >
              {visible && card.image ? (
                <img src={card.image} alt="" />
              ) : (
                <span>{visible ? card.text : "未翻开"}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="result-row">
        <p className={isFinished ? "success" : "hint"}>
          {isFinished
            ? "所有回忆都配好了，可以打开最后的彩蛋。"
            : `已完成 ${matched.length} / ${siteContent.matchPairs.length} 组。`}
        </p>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={reset}>
            重来
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={onComplete}
            disabled={!isFinished}
          >
            打开彩蛋
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalLetter({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="final-layout">
      <div className="final-copy">
        <p className="eyebrow">{siteContent.anniversaryDate}</p>
        <h2>{siteContent.finalLetterTitle}</h2>
        <p>{siteContent.finalLetter}</p>
      </div>
      <button className="secondary-button" type="button" onClick={onRestart}>
        再看一遍
      </button>
    </section>
  );
}

export default function App() {
  const [stage, setStage] = useState<Stage>("gate");
  const backgroundMarks = useMemo(
    () => ["01", "02", "03", "04", "05", "06"],
    [],
  );

  return (
    <main className="app-shell">
      <div className="background-grid" aria-hidden="true">
        {backgroundMarks.map((mark) => (
          <span key={mark}>{mark}</span>
        ))}
      </div>

      <header className="topbar">
        <a href="/" className="brand" aria-label="返回入口">
          <span className="brand-mark" />
          <span>{siteContent.anniversaryTitle}</span>
        </a>
        <Progress current={stage} />
      </header>

      <div className="stage-wrap">
        {stage === "gate" ? <Gate onUnlock={() => setStage("welcome")} /> : null}
        {stage === "welcome" ? (
          <Welcome onNext={() => setStage("quiz")} />
        ) : null}
        {stage === "quiz" ? (
          <QuizGame onComplete={() => setStage("match")} />
        ) : null}
        {stage === "match" ? (
          <MatchGame onComplete={() => setStage("final")} />
        ) : null}
        {stage === "final" ? (
          <FinalLetter onRestart={() => setStage("welcome")} />
        ) : null}
      </div>
    </main>
  );
}

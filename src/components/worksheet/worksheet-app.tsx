"use client";

import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  EyeOff,
  GraduationCap,
  Lightbulb,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Target,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { worksheetDefinitions, worksheetMap, type Question, type WorksheetId } from "@/lib/worksheet-data";
import { QuestionCard } from "./question-card";

const STORAGE_KEY = "cdc-quantitative-worksheet-progress";
type Theme = "light" | "dark";

type PersistedProgress = {
  activeWorksheetId?: WorksheetId;
  viewed?: Record<string, boolean>;
  revealed?: Record<string, boolean>;
  stepIndexes?: Record<string, number>;
  theme?: Theme;
};

export function WorksheetApp() {
  const [activeWorksheetId, setActiveWorksheetId] = useState<WorksheetId>("quantitative");
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [viewed, setViewed] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [stepIndexes, setStepIndexes] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);
  const activeWorksheet = worksheetMap[activeWorksheetId];
  const activeQuestions = activeWorksheet.questions;
  const isQuantitative = activeWorksheetId === "quantitative";

  /* localStorage is an external client-side store; hydrate it after the static shell mounts. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const progress = JSON.parse(stored) as PersistedProgress;
        if (progress.activeWorksheetId === "quantitative" || progress.activeWorksheetId === "logical") setActiveWorksheetId(progress.activeWorksheetId);
        setViewed(progress.viewed ?? {});
        setRevealed(progress.revealed ?? {});
        setStepIndexes(progress.stepIndexes ?? {});
        if (progress.theme === "light" || progress.theme === "dark") setTheme(progress.theme);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    hydrated.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeWorksheetId, viewed, revealed, stepIndexes, theme } satisfies PersistedProgress));
  }, [activeWorksheetId, viewed, revealed, stepIndexes, theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible[0]) return;
        const id = visible[0].target.id.replace("question-", "");
        const question = activeQuestions.find((item) => item.id === id);
        if (!question) return;
        setActiveQuestion(question.number);
        setViewed((current) => current[id] ? current : { ...current, [id]: true });
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.1, 0.35, 0.7] },
    );
    activeQuestions.forEach((question) => document.getElementById(`question-${question.id}`) && observer.observe(document.getElementById(`question-${question.id}`)!));
    return () => observer.disconnect();
  }, [activeQuestions]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    const onScroll = () => setShowBackToTop(window.scrollY > 650);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const visibleQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return activeQuestions;
    return activeQuestions.filter((question) => questionMatches(question, query));
  }, [activeQuestions, searchTerm]);
  const visibleIds = new Set(visibleQuestions.map((question) => question.id));
  const viewedCount = activeQuestions.filter((question) => viewed[question.id]).length;
  const revealedCount = activeQuestions.filter((question) => revealed[question.id]).length;

  const scrollToQuestion = (questionId: string) => {
    const question = activeQuestions.find((item) => item.id === questionId);
    if (question) setActiveQuestion(question.number);
    setMobileNavOpen(false);
    document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToNumber = (number: number) => {
    const question = activeQuestions.find((item) => item.number === number);
    if (question && visibleIds.has(question.id)) scrollToQuestion(question.id);
  };

  const handleToggleSolution = (questionId: string) => {
    setRevealed((current) => ({ ...current, [questionId]: !current[questionId] }));
    setViewed((current) => ({ ...current, [questionId]: true }));
    if (!revealed[questionId]) setStepIndexes((current) => ({ ...current, [questionId]: 0 }));
  };

  const handleStepChange = (questionId: string, stepIndex: number) => {
    setStepIndexes((current) => ({ ...current, [questionId]: stepIndex }));
    setViewed((current) => ({ ...current, [questionId]: true }));
  };

  const handleNext = (questionId: string) => {
    const index = visibleQuestions.findIndex((question) => question.id === questionId);
    const next = visibleQuestions[index + 1];
    if (next) scrollToQuestion(next.id);
  };

  const switchWorksheet = (worksheetId: WorksheetId) => {
    setActiveWorksheetId(worksheetId);
    setActiveQuestion(1);
    setSearchTerm("");
    setMobileNavOpen(false);
    window.requestAnimationFrame(() => document.getElementById(`question-${worksheetMap[worksheetId].questions[0]?.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const showAllSolutions = () => {
    setRevealed((current) => ({ ...current, ...Object.fromEntries(activeQuestions.map((question) => [question.id, true])) }));
    setViewed((current) => ({ ...current, ...Object.fromEntries(activeQuestions.map((question) => [question.id, true])) }));
    setStepIndexes((current) => ({ ...current, ...Object.fromEntries(activeQuestions.map((question) => [question.id, question.steps.length])) }));
  };

  const hideAllSolutions = () => setRevealed({});

  const resetProgress = () => {
    setViewed({});
    setRevealed({});
    setStepIndexes({});
    setSearchTerm("");
    window.localStorage.removeItem(STORAGE_KEY);
    scrollToNumber(1);
  };

  return (
    <div className="worksheet-app">
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="#top" aria-label="CDC worksheet home"><span className="brand-mark"><GraduationCap size={20} /></span><span className="brand-copy"><strong>CDC WORKSHEET</strong><small>{activeWorksheet.shortName}</small></span></a>
          <div className="topbar__controls">
            <label className="header-search"><Search size={16} /><span className="sr-only">Search problems</span><input ref={searchRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search problems..." />{searchTerm ? <button type="button" aria-label="Clear search" onClick={() => setSearchTerm("")}><X size={14} /></button> : <kbd>⌘ K</kbd>}</label>
            <div className="header-current"><span>{activeWorksheet.shortName}</span><strong>Question {activeQuestion} / {activeQuestions.length}</strong></div>
            <ProgressBar value={activeQuestion} total={activeQuestions.length} compact />
            <button className="icon-button" type="button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button>
            <button className="icon-button mobile-menu-button" type="button" onClick={() => setMobileNavOpen((current) => !current)} aria-expanded={mobileNavOpen} aria-label="Open question navigation">{mobileNavOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {mobileNavOpen ? <QuestionNavigation questions={activeQuestions} activeQuestion={activeQuestion} visibleIds={visibleIds} onSelect={scrollToQuestion} mobile viewed={viewed} /> : null}
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-glow hero-glow--one" /><div className="hero-glow hero-glow--two" />
          <div className="hero-content page-width">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> CDC WORKSHEET · {activeQuestions.length} PROBLEMS <span className="eyebrow-line" /></div>
              <h1 id="hero-title">{isQuantitative ? <>Quantitative <span>aptitude</span><br />meets logic.</> : <>Logical <span>reasoning</span><br />made visual.</>}</h1>
              <p className="hero-subtitle">{activeQuestions.length} Problems <b>•</b> Step-by-Step Solutions <b>•</b> Visual Explanations</p>
              <p className="hero-description">Learn the reasoning behind every answer instead of simply memorizing the result. {activeWorksheet.description}</p>
              <div className="hero-actions"><button className="hero-cta" type="button" onClick={() => scrollToNumber(1)}>Start solving <ArrowRight size={17} /></button><button className="hero-secondary" type="button" onClick={showAllSolutions}><Sparkles size={16} /> Open all solutions</button></div>
              <div className="hero-note"><Check size={15} /> Progress saves automatically in this browser.</div>
            </div>
            <div className="hero-art" aria-label="Abstract quantitative reasoning illustration"><div className="hero-art__grid" /><div className="hero-art__label hero-art__label--top"><span /> {activeQuestions.length} mini lessons</div><div className="hero-art__ring hero-art__ring--outer" /><div className="hero-art__ring hero-art__ring--inner" /><div className="hero-formula hero-formula--one">{isQuantitative ? "n(n−1)/2" : "E > C > A"}</div><div className="hero-formula hero-formula--two">{isQuantitative ? "√(a²+b²)" : "A → B → C"}</div><div className="hero-formula hero-formula--three">{isQuantitative ? "x + 21" : "CAT → DBU"}</div><div className="hero-art__center"><Target size={27} /><strong>Think<br />in steps</strong><small>question → proof</small></div><div className="hero-art__label hero-art__label--bottom"><span /> visual tutor mode</div></div>
          </div>
          <div className="page-width hero-stats"><StatCard icon={<ClipboardList size={18} />} value={`${activeQuestions.length}`} label="Problems" detail={activeWorksheet.shortName} /><StatCard icon={<Lightbulb size={18} />} value={`${activeQuestions.length}`} label="Mini lessons" detail="Approach to answer" /><StatCard icon={<BookOpen size={18} />} value="∞" label="Ways to learn" detail="Formulas & diagrams" /><StatCard icon={<Target size={18} />} value={`${viewedCount}`} label="Viewed" detail={`of ${activeQuestions.length} questions`} /></div>
          <div className="page-width worksheet-picker"><div><span className="section-label">Choose a worksheet</span><p>Both problem sets stay available here.</p></div><div className="worksheet-picker__buttons">{worksheetDefinitions.map((worksheet) => <button className={worksheet.id === activeWorksheetId ? "is-active" : ""} type="button" key={worksheet.id} onClick={() => switchWorksheet(worksheet.id)}><span>{worksheet.id === "quantitative" ? "01" : "02"}</span><strong>{worksheet.shortName}</strong><small>{worksheet.questions.length} questions</small></button>)}</div></div>
        </section>

        <section className="worksheet-workspace page-width" id="worksheet" aria-label={`${activeWorksheet.name} worksheet`}>
          <div className="workspace-intro"><div><div className="eyebrow eyebrow--dark"><span className="eyebrow-dot" /> {activeWorksheet.shortName.toUpperCase()}</div><h2>One problem at a time.</h2><p>Reveal the approach, move through the working, and verify the final answer visually.</p></div><div className="workspace-summary"><ProgressBar value={viewedCount} total={activeQuestions.length} /><div><strong>{viewedCount} / {activeQuestions.length}</strong><span>questions explored</span><small>{revealedCount} solutions opened</small></div></div></div>
          <div className="worksheet-toolbar"><div className="toolbar-result"><strong>{visibleQuestions.length}</strong> showing <span>·</span> {viewedCount}/{activeQuestions.length} viewed</div><div className="toolbar-actions"><button className="toolbar-link" type="button" onClick={showAllSolutions}><Sparkles size={14} /> Show all</button><button className="toolbar-link" type="button" onClick={hideAllSolutions}><EyeOff size={14} /> Hide all</button><button className="toolbar-link toolbar-link--muted" type="button" onClick={resetProgress}><RotateCcw size={13} /> Reset</button></div></div>
          <div className="worksheet-layout"><aside className="question-sidebar"><div className="sidebar-heading"><span>Question navigator</span><span>01—{String(activeQuestions.length).padStart(2, "0")}</span></div><QuestionNavigation questions={activeQuestions} activeQuestion={activeQuestion} visibleIds={visibleIds} onSelect={scrollToQuestion} viewed={viewed} /><div className="sidebar-tip"><div><Lightbulb size={16} /></div><strong>Learn the why</strong><p>Each card separates the approach, working, visual proof, and final answer.</p></div></aside><div className="question-stream">{visibleQuestions.length === 0 ? <EmptyState onClear={() => setSearchTerm("")} searchTerm={searchTerm} /> : null}{visibleQuestions.map((question) => <QuestionCard key={question.id} question={question} totalQuestions={activeQuestions.length} isRevealed={Boolean(revealed[question.id])} stepIndex={stepIndexes[question.id] ?? 0} onToggleSolution={handleToggleSolution} onStepChange={handleStepChange} onNext={handleNext} hasNext={visibleQuestions.indexOf(question) < visibleQuestions.length - 1} />)}</div></div>
        </section>
      </main>

      <div className="mobile-bottom-nav"><button type="button" disabled={activeQuestion <= 1} onClick={() => scrollToNumber(activeQuestion - 1)}><ChevronLeft size={16} /> Prev</button><span><b>{String(activeQuestion).padStart(2, "0")}</b> / {String(activeQuestions.length).padStart(2, "0")}</span><button type="button" disabled={activeQuestion >= activeQuestions.length} onClick={() => scrollToNumber(activeQuestion + 1)}>Next <ChevronRight size={16} /></button></div>
      <footer className="footer page-width"><div className="footer-brand"><span className="brand-mark"><GraduationCap size={18} /></span><div><strong>CDC Worksheet</strong><span>Quantitative Aptitude & Logical Reasoning</span></div></div><div className="footer-note">Built for curious minds <span>✦</span> One clear idea at a time.</div></footer>
      {showBackToTop ? <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp size={17} /></button> : null}
    </div>
  );
}

function QuestionNavigation({ questions, activeQuestion, visibleIds, onSelect, viewed, mobile = false }: { questions: Question[]; activeQuestion: number; visibleIds: Set<string>; onSelect: (questionId: string) => void; viewed: Record<string, boolean>; mobile?: boolean }) {
  return <nav className={`question-navigation ${mobile ? "question-navigation--mobile" : ""}`} aria-label="Question navigation"><div className="question-navigation__grid">{questions.map((question) => <button className={`${activeQuestion === question.number ? "is-active" : ""} ${visibleIds.has(question.id) ? "" : "is-dimmed"} ${viewed[question.id] ? "is-viewed" : ""}`} type="button" disabled={!visibleIds.has(question.id)} onClick={() => onSelect(question.id)} key={question.id} aria-label={`Go to question ${question.number}`} aria-current={activeQuestion === question.number ? "step" : undefined}>{String(question.number).padStart(2, "0")}{viewed[question.id] ? <Check size={10} /> : null}</button>)}</div><ProgressBar value={activeQuestion} total={questions.length} /></nav>;
}

function ProgressBar({ value, total, compact = false }: { value: number; total: number; compact?: boolean }) {
  return <div className={`progress-bar ${compact ? "progress-bar--compact" : ""}`} aria-label={`${value} of ${total}`}><i style={{ width: `${Math.min((value / total) * 100, 100)}%` }} /><span>{compact ? `${value}/${total}` : `${value} / ${total}`}</span></div>;
}

function StatCard({ icon, value, label, detail }: { icon: ReactNode; value: string; label: string; detail: string }) {
  return <div className="stat-card"><div className="stat-card__icon">{icon}</div><div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div></div>;
}

function EmptyState({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) {
  return <div className="empty-state"><div className="empty-state__icon"><Search size={22} /></div><h3>No problems match{searchTerm ? ` “${searchTerm}”` : " this search"}.</h3><p>Try a topic, formula, or question number.</p><button className="button button--primary" type="button" onClick={onClear}>Clear search</button></div>;
}

function questionMatches(question: Question, query: string) {
  return [question.category, question.question, question.context, question.approach, question.answer, question.importantNote, ...question.steps.map((step) => `${step.title} ${step.detail} ${step.formula ?? ""}`)].some((value) => value?.toLowerCase().includes(query));
}

"use client";

import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CircleHelp,
  Code2,
  Compass,
  Filter,
  GraduationCap,
  ListFilter,
  Menu,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import {
  totalQuestions,
  worksheetQuestions,
  worksheetSections,
  type Question,
  type WorksheetSection,
} from "@/lib/worksheet-data";
import { QuestionCard } from "./question-card";

const STORAGE_KEY = "cdc-logical-reasoning-progress";
type AnswerFilter = "all" | "answered" | "unanswered" | "review";
type Theme = "light" | "dark";

type PersistedProgress = {
  selectedAnswers?: Record<string, string>;
  checkedAnswers?: Record<string, boolean>;
  revealedSolutions?: Record<string, boolean>;
  theme?: Theme;
};

export function WorksheetApp() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>("all");
  const [activeSection, setActiveSection] = useState(worksheetSections[0]?.id ?? "direction");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasHydrated = useRef(false);

  /* localStorage is an external client-side store; hydrate it once after the static shell mounts. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const progress = JSON.parse(stored) as PersistedProgress;
        setSelectedAnswers(progress.selectedAnswers ?? {});
        setCheckedAnswers(progress.checkedAnswers ?? {});
        setRevealedSolutions(progress.revealedSolutions ?? {});
        if (progress.theme === "light" || progress.theme === "dark") setTheme(progress.theme);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    hasHydrated.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hasHydrated.current) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedAnswers, checkedAnswers, revealedSolutions, theme } satisfies PersistedProgress),
    );
  }, [selectedAnswers, checkedAnswers, revealedSolutions, theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id.replace("section-", ""));
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: [0.05, 0.2, 0.45, 0.8] },
    );

    worksheetSections.forEach((section) => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 620);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const completedCount = worksheetQuestions.filter((question) => isCompleted(question.id, checkedAnswers, revealedSolutions)).length;
  const checkedCount = worksheetQuestions.filter((question) => checkedAnswers[question.id]).length;
  const correctCount = worksheetQuestions.filter((question) => {
    if (!checkedAnswers[question.id] || question.status !== "solved") return false;
    return question.correctOptions?.includes(selectedAnswers[question.id] ?? "") ?? false;
  }).length;

  const filteredSections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return worksheetSections
      .filter((section) => sectionFilter === "all" || section.id === sectionFilter)
      .map((section) => ({
        section,
        questions: section.questions.filter((question) => {
          const searchMatch = !query || questionMatches(question, section, query);
          const completed = isCompleted(question.id, checkedAnswers, revealedSolutions);
          const statusMatch =
            answerFilter === "all" ||
            (answerFilter === "answered" && completed) ||
            (answerFilter === "unanswered" && !completed) ||
            (answerFilter === "review" && question.status !== "solved");
          return searchMatch && statusMatch;
        }),
      }))
      .filter(({ questions }) => questions.length > 0);
  }, [answerFilter, checkedAnswers, revealedSolutions, searchTerm, sectionFilter]);

  const visibleQuestions = filteredSections.flatMap(({ questions }) => questions);
  const visibleQuestionIds = new Set(visibleQuestions.map((question) => question.id));

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileNavOpen(false);
    document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToQuestion = (questionId: string) => {
    document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSelect = (questionId: string, optionLabel: string) => {
    setSelectedAnswers((current) => ({ ...current, [questionId]: optionLabel }));
    setCheckedAnswers((current) => {
      if (!current[questionId]) return current;
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const handleCheck = (questionId: string) => {
    if (!selectedAnswers[questionId]) return;
    setCheckedAnswers((current) => ({ ...current, [questionId]: true }));
  };

  const handleToggleSolution = (questionId: string) => {
    setRevealedSolutions((current) => ({ ...current, [questionId]: !current[questionId] }));
  };

  const handleNext = (questionId: string) => {
    const currentIndex = visibleQuestions.findIndex((question) => question.id === questionId);
    const nextQuestion = visibleQuestions[currentIndex + 1];
    if (nextQuestion) scrollToQuestion(nextQuestion.id);
  };

  const showAllSolutions = () => {
    setRevealedSolutions(Object.fromEntries(worksheetQuestions.map((question) => [question.id, true])));
  };

  const hideAllSolutions = () => setRevealedSolutions({});

  const resetProgress = () => {
    setSelectedAnswers({});
    setCheckedAnswers({});
    setRevealedSolutions({});
    window.localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="worksheet-app">
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="#top" aria-label="CDC Logical Reasoning home">
            <span className="brand-mark"><GraduationCap size={20} /></span>
            <span className="brand-copy"><strong>CDC</strong><span>Logical Reasoning</span></span>
          </a>
          <div className="topbar__controls">
            <label className="header-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search questions</span>
              <input ref={searchInputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search questions..." />
              {searchTerm ? <button type="button" aria-label="Clear search" onClick={() => setSearchTerm("")}><X size={14} /></button> : <kbd>⌘ K</kbd>}
            </label>
            <div className="header-progress" aria-label={`${completedCount} of ${totalQuestions} questions completed`}>
              <ProgressRing value={completedCount} total={totalQuestions} size="small" />
              <div><span>Progress</span><strong>{completedCount}/{totalQuestions}</strong></div>
            </div>
            <button className="icon-button theme-button" type="button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="icon-button mobile-menu-button" type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-expanded={mobileNavOpen} aria-label="Open section navigation">
              {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {mobileNavOpen ? (
          <nav className="mobile-section-menu" aria-label="Mobile section navigation">
            <div className="mobile-section-menu__label">Jump to a section</div>
            {worksheetSections.map((section) => (
              <button className={activeSection === section.id ? "is-active" : ""} type="button" key={section.id} onClick={() => scrollToSection(section.id)}>
                <span className="mobile-menu-number">0{section.number}</span>
                <span>{section.name}</span>
                <span className="mobile-menu-progress">{section.questions.filter((question) => isCompleted(question.id, checkedAnswers, revealedSolutions)).length}/5</span>
              </button>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-glow hero-glow--one" />
          <div className="hero-glow hero-glow--two" />
          <div className="hero-content page-width">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> CDC · WORKSHEET SERIES <span className="eyebrow-line" /></div>
              <h1 id="hero-title">Master <span>logical</span><br />reasoning.</h1>
              <p className="hero-subtitle">Understand every question with step-by-step visual explanations.</p>
              <p className="hero-description">A guided, visual walkthrough of the CDC logical reasoning worksheet — built to help you spot patterns, test assumptions, and learn the why behind every answer.</p>
              <div className="hero-actions">
                <button className="hero-cta" type="button" onClick={() => scrollToSection("direction")}>
                  Start solving <ArrowRight size={17} />
                </button>
                <button className="hero-secondary" type="button" onClick={showAllSolutions}><Sparkles size={16} /> See all solutions</button>
              </div>
              <div className="hero-note"><Check size={15} /> Your progress is saved automatically in this browser.</div>
            </div>
            <div className="hero-art" aria-label="Abstract visual of reasoning paths">
              <div className="hero-art__backdrop" />
              <div className="hero-art__label hero-art__label--top"><span /> 7 learning modules</div>
              <div className="hero-orbit hero-orbit--outer" />
              <div className="hero-orbit hero-orbit--inner" />
              <div className="hero-path hero-path--one" />
              <div className="hero-path hero-path--two" />
              <div className="hero-path hero-path--three" />
              <div className="hero-node hero-node--center"><Brain size={28} /><span>Think<br />clearly</span></div>
              <div className="hero-node hero-node--one"><Compass size={17} /><span>Trace</span></div>
              <div className="hero-node hero-node--two"><BarChart3 size={17} /><span>Pattern</span></div>
              <div className="hero-node hero-node--three"><Target size={17} /><span>Prove</span></div>
              <div className="hero-art__label hero-art__label--bottom"><span /> visual explanations</div>
            </div>
          </div>
          <div className="page-width hero-stats">
            <StatCard icon={<ListFilter size={18} />} value="07" label="Sections" detail="Every reasoning type" />
            <StatCard icon={<BookOpen size={18} />} value="35" label="Questions" detail="From the worksheet" />
            <StatCard icon={<Sparkles size={18} />} value="35" label="Solutions" detail="Step-by-step walkthroughs" />
            <StatCard icon={<Compass size={18} />} value="∞" label="Ways to learn" detail="Maps, trees & patterns" />
          </div>
        </section>

        <section className="workspace page-width" id="worksheet" aria-label="Interactive worksheet">
          <div className="workspace-intro">
            <div>
              <div className="eyebrow eyebrow--dark"><span className="eyebrow-dot" /> YOUR PRACTICE SPACE</div>
              <h2>Work through the worksheet.</h2>
              <p>Pick an option, check your thinking, and open the visual explanation when you’re ready.</p>
            </div>
            <div className="workspace-intro__score">
              <ProgressRing value={completedCount} total={totalQuestions} />
              <div><span>Learning progress</span><strong>{completedCount === totalQuestions ? "Complete" : `${totalQuestions - completedCount} to go`}</strong><small>{correctCount} correct checks · {checkedCount} attempted</small></div>
            </div>
          </div>

          <div className="mobile-filter-row">
            <label className="select-control"><SlidersHorizontal size={15} /><span className="sr-only">Filter by section</span><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="all">All sections</option>{worksheetSections.map((section) => <option value={section.id} key={section.id}>{String(section.number).padStart(2, "0")} {section.name}</option>)}</select><ChevronDown size={14} /></label>
            <label className="select-control"><Filter size={15} /><span className="sr-only">Filter by progress</span><select value={answerFilter} onChange={(event) => setAnswerFilter(event.target.value as AnswerFilter)}><option value="all">All questions</option><option value="unanswered">Unanswered</option><option value="answered">Answered</option><option value="review">Needs review</option></select><ChevronDown size={14} /></label>
          </div>

          <div className="workspace-toolbar">
            <div className="toolbar-result"><strong>{visibleQuestions.length}</strong> question{visibleQuestions.length === 1 ? "" : "s"} showing <span>·</span> {completedCount}/{totalQuestions} completed</div>
            <div className="toolbar-filters">
              <label className="select-control"><SlidersHorizontal size={14} /><span className="sr-only">Filter by section</span><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="all">All sections</option>{worksheetSections.map((section) => <option value={section.id} key={section.id}>{String(section.number).padStart(2, "0")} {section.name}</option>)}</select><ChevronDown size={13} /></label>
              <label className="select-control"><Filter size={14} /><span className="sr-only">Filter by progress</span><select value={answerFilter} onChange={(event) => setAnswerFilter(event.target.value as AnswerFilter)}><option value="all">All questions</option><option value="unanswered">Unanswered</option><option value="answered">Answered</option><option value="review">Needs review</option></select><ChevronDown size={13} /></label>
            </div>
            <div className="toolbar-actions">
              <button type="button" className="toolbar-link" onClick={showAllSolutions}><Sparkles size={14} /> Show all solutions</button>
              <button type="button" className="toolbar-link" onClick={hideAllSolutions}><EyeOffIcon /> Hide all</button>
              <button type="button" className="toolbar-link toolbar-link--muted" onClick={resetProgress}>Reset progress</button>
            </div>
          </div>

          <div className="workspace-grid">
            <aside className="section-sidebar" aria-label="Worksheet sections">
              <div className="sidebar-heading"><span>Explore sections</span><span>7</span></div>
              <nav>
                {worksheetSections.map((section) => {
                  const sectionCompleted = section.questions.filter((question) => isCompleted(question.id, checkedAnswers, revealedSolutions)).length;
                  return (
                    <button className={`section-nav-item ${activeSection === section.id ? "is-active" : ""}`} type="button" key={section.id} onClick={() => scrollToSection(section.id)}>
                      <span className="section-nav-item__number">0{section.number}</span>
                      <span className="section-nav-item__icon">{sectionIcon(section.icon, 16)}</span>
                      <span className="section-nav-item__copy"><strong>{section.name}</strong><small>{sectionCompleted}/5 complete</small><i><em style={{ width: `${sectionCompleted * 20}%` }} /></i></span>
                      <ChevronRight className="section-nav-item__arrow" size={15} />
                    </button>
                  );
                })}
              </nav>
              <div className="sidebar-tip"><div><Sparkles size={16} /></div><strong>Learn, don’t guess</strong><p>Ambiguous worksheet items are marked so you can spot the difference.</p></div>
            </aside>

            <div className="question-stream">
              {filteredSections.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onClear={() => { setSearchTerm(""); setSectionFilter("all"); setAnswerFilter("all"); }} />
              ) : null}
              {filteredSections.map(({ section, questions }) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  questions={questions}
                  selectedAnswers={selectedAnswers}
                  checkedAnswers={checkedAnswers}
                  revealedSolutions={revealedSolutions}
                  visibleQuestionIds={visibleQuestionIds}
                  onSelect={handleSelect}
                  onCheck={handleCheck}
                  onToggleSolution={handleToggleSolution}
                  onNext={handleNext}
                  onJump={scrollToQuestion}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer page-width">
        <div className="footer-brand"><span className="brand-mark"><GraduationCap size={18} /></span><div><strong>CDC Logical Reasoning</strong><span>Interactive Solutions & Visual Explanations</span></div></div>
        <div className="footer-note">Built for curious minds <span>✦</span> {totalQuestions} questions, one clear idea at a time.</div>
      </footer>

      {showBackToTop ? <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><ArrowUp size={17} /></button> : null}
    </div>
  );
}

type SectionBlockProps = {
  section: WorksheetSection;
  questions: Question[];
  selectedAnswers: Record<string, string>;
  checkedAnswers: Record<string, boolean>;
  revealedSolutions: Record<string, boolean>;
  visibleQuestionIds: Set<string>;
  onSelect: (questionId: string, optionLabel: string) => void;
  onCheck: (questionId: string) => void;
  onToggleSolution: (questionId: string) => void;
  onNext: (questionId: string) => void;
  onJump: (questionId: string) => void;
};

function SectionBlock({ section, questions, selectedAnswers, checkedAnswers, revealedSolutions, visibleQuestionIds, onSelect, onCheck, onToggleSolution, onNext, onJump }: SectionBlockProps) {
  const completed = section.questions.filter((question) => isCompleted(question.id, checkedAnswers, revealedSolutions)).length;

  return (
    <section className="section-block" id={`section-${section.id}`} aria-labelledby={`section-title-${section.id}`}>
      <div className="section-block__header">
        <div className="section-title-row">
          <div className="section-icon-large">{sectionIcon(section.icon, 21)}</div>
          <div><span className="section-eyebrow">SECTION 0{section.number}</span><h2 id={`section-title-${section.id}`}>{section.name}</h2><p>{section.description}</p></div>
        </div>
        <div className="section-completion"><ProgressRing value={completed} total={section.questions.length} size="small" /><div><span>Section progress</span><strong>{completed} / {section.questions.length}</strong></div></div>
      </div>

      {section.context ? <div className="context-card"><div className="context-card__title"><CircleHelp size={16} /><strong>Keep these conditions in view</strong><span>applies to all five questions</span></div><div className="context-list">{section.context.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div></div> : null}

      <div className="question-jump" aria-label={`${section.name} question navigation`}>
        <span>Jump to</span>
        {section.questions.map((question) => {
          const isVisible = questions.some((item) => item.id === question.id);
          return <button className={isVisible ? "" : "is-dimmed"} disabled={!isVisible} type="button" key={question.id} onClick={() => onJump(question.id)}>{String(question.number).padStart(2, "0")}{isCompleted(question.id, checkedAnswers, revealedSolutions) ? <Check size={11} /> : null}</button>;
        })}
      </div>

      <div className="section-questions">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            section={section}
            selectedAnswer={selectedAnswers[question.id]}
            isChecked={Boolean(checkedAnswers[question.id])}
            isRevealed={Boolean(revealedSolutions[question.id])}
            onSelect={onSelect}
            onCheck={onCheck}
            onToggleSolution={onToggleSolution}
            onNext={onNext}
            hasNext={Array.from(visibleQuestionIds).indexOf(question.id) < visibleQuestionIds.size - 1}
          />
        ))}
      </div>
    </section>
  );
}

function EmptyState({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) {
  return (
    <div className="empty-state"><div className="empty-state__icon"><Search size={22} /></div><h3>No questions match{searchTerm ? ` “${searchTerm}”` : " these filters"}.</h3><p>Try a different search term or return to the complete worksheet.</p><button type="button" className="button button--primary" onClick={onClear}>Clear filters</button></div>
  );
}

function StatCard({ icon, value, label, detail }: { icon: ReactNode; value: string; label: string; detail: string }) {
  return <div className="stat-card"><div className="stat-card__icon">{icon}</div><div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div></div>;
}

function ProgressRing({ value, total, size = "regular" }: { value: number; total: number; size?: "small" | "regular" }) {
  const radius = size === "small" ? 17 : 25;
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : Math.min(value / total, 1);
  return (
    <div className={`progress-ring progress-ring--${size}`} style={{ "--progress": `${progress * circumference}` } as CSSProperties}>
      <svg viewBox="0 0 64 64" aria-hidden="true"><circle className="progress-ring__track" cx="32" cy="32" r={radius} /><circle className="progress-ring__value" cx="32" cy="32" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference - progress * circumference} /></svg>
      {size === "regular" ? <span>{Math.round(progress * 100)}%</span> : null}
    </div>
  );
}

function isCompleted(questionId: string, checkedAnswers: Record<string, boolean>, revealedSolutions: Record<string, boolean>) {
  return Boolean(checkedAnswers[questionId] || revealedSolutions[questionId]);
}

function questionMatches(question: Question, section: WorksheetSection, query: string) {
  return [section.name, question.question, question.concept, question.answer, ...question.options.map((option) => option.text), ...question.explanation].some((value) => value?.toLowerCase().includes(query));
}

function sectionIcon(icon: WorksheetSection["icon"], size: number) {
  switch (icon) {
    case "compass": return <Compass size={size} />;
    case "users": return <Users size={size} />;
    case "seats": return <CircleDot size={size} />;
    case "numbers": return <BarChart3 size={size} />;
    case "logic": return <Brain size={size} />;
    case "series": return <Sparkles size={size} />;
    case "code": return <Code2 size={size} />;
  }
}

function EyeOffIcon() {
  return <span className="eye-off-icon" aria-hidden="true">—</span>;
}

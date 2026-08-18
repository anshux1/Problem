import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Flag,
  Maximize2,
  X,
} from "lucide-react";
import { useState } from "react";

import type { Question } from "@/lib/worksheet-data";
import { ApproachBlock, FinalAnswer, ImportantNote, SolutionStepBlock } from "./solution-parts";
import { VisualizationRenderer } from "./visualizations";

type QuestionCardProps = {
  question: Question;
  totalQuestions: number;
  isRevealed: boolean;
  stepIndex: number;
  onToggleSolution: (questionId: string) => void;
  onStepChange: (questionId: string, stepIndex: number) => void;
  onNext: (questionId: string) => void;
  hasNext: boolean;
};

export function QuestionCard({ question, totalQuestions, isRevealed, stepIndex, onToggleSolution, onStepChange, onNext, hasNext }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [optionChecked, setOptionChecked] = useState(false);
  const finalRevealed = stepIndex >= question.steps.length;
  const safeStep = Math.min(stepIndex, Math.max(question.steps.length - 1, 0));
  const statusLabel = question.status === "solved" ? "Solved lesson" : question.status === "ambiguous" ? "Ambiguous puzzle" : question.status === "insufficient-information" ? "Insufficient info" : "Worksheet issue";

  return (
    <article className={`question-card ${isRevealed ? "is-expanded" : ""} question-card--${question.status}`} id={`question-${question.id}`}>
      <div className="question-card__header">
        <div className="question-card__identity">
          <div className="question-number">{String(question.number).padStart(2, "0")}</div>
          <div><span className="question-kicker">Question {String(question.number).padStart(2, "0")}</span><strong>{question.category}</strong></div>
        </div>
        <div className="question-card__meta">
          <span className={`difficulty difficulty--${question.difficulty.toLowerCase()}`}><i /> {question.difficulty}</span>
          <span className={`status-badge status-badge--${question.status}`}>{statusLabel}</span>
          <span className="question-index">{String(question.number).padStart(2, "0")} / {totalQuestions}</span>
        </div>
      </div>

      <div className="question-card__problem">
        <div className="problem-label"><span>Problem statement</span><span>{question.status === "solved" ? "Think it through" : "Read the note carefully"}</span></div>
        <h2>{question.question}</h2>
        {question.context ? <div className="question-context"><Flag size={15} /><p>{question.context}</p></div> : null}
        {question.options?.length ? <div className="worksheet-options"><span className="section-label">Worksheet options</span><div role="group" aria-label={`Options for question ${question.number}`}>{question.options.map((option) => {
          const isSelected = selectedOption === option.label;
          const isCorrect = question.correctOptions?.includes(option.label) ?? false;
          const showCorrect = optionChecked && isCorrect && question.status === "solved";
          const showWrong = optionChecked && isSelected && !isCorrect && question.status === "solved";
          const showReview = optionChecked && isSelected && question.status !== "solved";
          return <button className={`worksheet-option ${isSelected ? "is-selected" : ""} ${showCorrect ? "is-correct" : ""} ${showWrong ? "is-wrong" : ""} ${showReview ? "is-review" : ""}`} type="button" key={option.label} aria-pressed={isSelected} onClick={() => { setSelectedOption(option.label); setOptionChecked(false); }}><b>{option.label})</b><span>{option.text}</span>{showCorrect ? <Check size={14} /> : null}{showWrong ? <X size={14} /> : null}{showReview ? <AlertTriangle size={14} /> : null}</button>;
        })}</div>{selectedOption && !optionChecked ? <button className="option-check" type="button" onClick={() => setOptionChecked(true)}><Check size={13} /> Check selected option</button> : null}{optionChecked ? <div className={`option-feedback ${question.status === "solved" ? (question.correctOptions?.includes(selectedOption ?? "") ? "is-correct" : "is-wrong") : "is-review"}`}>{question.status === "solved" ? (question.correctOptions?.includes(selectedOption ?? "") ? "Correct choice — now open the solution." : `Review the solution. Correct: ${question.correctOptions?.join(" / ") ?? "not uniquely determined"}.`) : "This worksheet item needs review rather than a forced option."}</div> : null}</div> : null}
      </div>

      {!isRevealed ? (
        <div className="reveal-row">
          <div className="reveal-prompt"><span className="reveal-pulse" /><div><strong>Ready to see the reasoning?</strong><small>Work it out first, then reveal one step at a time.</small></div></div>
          <button className="reveal-button" type="button" onClick={() => onToggleSolution(question.id)}><Eye size={16} /> Show solution <ChevronDown size={15} /></button>
        </div>
      ) : (
        <div className="solution-area">
          <ApproachBlock question={question} />
          <div className="solution-divider"><span>Working</span><i /></div>
          <div className="step-progress-row"><span>Guided solution</span><strong>{finalRevealed ? "Final answer" : `Step ${safeStep + 1} of ${question.steps.length}`}</strong><div className="step-progress"><i style={{ width: `${finalRevealed ? 100 : ((safeStep + 1) / question.steps.length) * 100}%` }} /></div></div>
          {!finalRevealed && question.steps[safeStep] ? <SolutionStepBlock step={question.steps[safeStep]} index={safeStep} total={question.steps.length} /> : null}

          <div className="solution-actions">
            <button className="step-button step-button--hide" type="button" onClick={() => onToggleSolution(question.id)}><EyeOff size={15} /> Hide solution</button>
            <button className="step-button" type="button" disabled={safeStep <= 0} onClick={() => onStepChange(question.id, Math.max(0, safeStep - 1))}><ArrowLeft size={15} /> Previous step</button>
            {!finalRevealed ? <button className="step-button step-button--primary" type="button" onClick={() => onStepChange(question.id, Math.min(question.steps.length, safeStep + 1))}>{safeStep === question.steps.length - 1 ? "Reveal final answer" : "Next step"} <ArrowRight size={15} /></button> : <button className="step-button" type="button" onClick={() => onStepChange(question.id, Math.max(0, question.steps.length - 1))}><EyeOff size={15} /> Review steps</button>}
          </div>

          <div className="visual-explanation-heading"><span>Visual explanation</span><Maximize2 size={14} /></div>
          <VisualizationRenderer visualization={question.visualization} questionId={question.id} />

          {finalRevealed ? <FinalAnswer question={question} /> : <button className="answer-tease" type="button" onClick={() => onStepChange(question.id, question.steps.length)}>Finish the steps to reveal the final answer <ArrowRight size={14} /></button>}
          {question.importantNote ? <ImportantNote>{question.importantNote}</ImportantNote> : null}
          {hasNext ? <button className="next-question" type="button" onClick={() => onNext(question.id)}>Continue to Question {String(question.number + 1).padStart(2, "0")} <ArrowRight size={16} /></button> : null}
        </div>
      )}
    </article>
  );
}

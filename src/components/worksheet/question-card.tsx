import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

import type { Question, WorksheetSection } from "@/lib/worksheet-data";
import { AnswerCard, AmbiguityWarning, StepByStep } from "./solution-parts";
import { VisualizationRenderer } from "./visualizations";

type QuestionCardProps = {
  question: Question;
  section: WorksheetSection;
  selectedAnswer?: string;
  isChecked: boolean;
  isRevealed: boolean;
  onSelect: (questionId: string, optionLabel: string) => void;
  onCheck: (questionId: string) => void;
  onToggleSolution: (questionId: string) => void;
  onNext: (questionId: string) => void;
  hasNext: boolean;
};

export function QuestionCard({
  question,
  section,
  selectedAnswer,
  isChecked,
  isRevealed,
  onSelect,
  onCheck,
  onToggleSolution,
  onNext,
  hasNext,
}: QuestionCardProps) {
  const isReview = question.status !== "solved";
  const selectedOption = question.options.find((option) => option.label === selectedAnswer);
  const hasCorrectChoice = question.correctOptions?.includes(selectedAnswer ?? "") ?? false;

  return (
    <article className={`question-card ${isRevealed ? "is-expanded" : ""} ${isReview ? "question-card--review" : ""}`} id={`question-${question.id}`}>
      <div className="question-card__topline">
        <div className="question-card__identity">
          <span className="question-number">Question {String(question.number).padStart(2, "0")}</span>
          <span className="question-section">{section.name}</span>
        </div>
        <div className="question-card__meta">
          <span className={`difficulty difficulty--${question.difficulty.toLowerCase().replace("-", "-")}`}>
            <i /> {question.difficulty}
          </span>
          <span className={`status-badge status-badge--${question.status}`}>
            {statusLabel(question.status)}
          </span>
          <span className="question-count">{String(question.number).padStart(2, "0")} / 05</span>
        </div>
      </div>

      <div className="question-card__body">
        <h3>{question.question}</h3>
        <AmbiguityWarning status={question.status} note={question.statusNote} />

        <div className="options-label-row">
          <span>Choose an answer</span>
          <span>{selectedAnswer ? `Selected ${selectedAnswer}` : "Take a moment to think"}</span>
        </div>
        <div className="option-list" role="group" aria-label={`Answer options for question ${question.number}`}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.label;
            const isCorrect = question.correctOptions?.includes(option.label) ?? false;
            const showCorrect = isChecked && !isReview && isCorrect;
            const showWrong = isChecked && !isReview && isSelected && !isCorrect;
            const showIssueAnswer = isChecked && question.status === "worksheet-issue" && isCorrect;
            const showReview = isChecked && isReview && isSelected;

            return (
              <button
                className={`option-button ${isSelected ? "is-selected" : ""} ${showCorrect ? "is-correct" : ""} ${showWrong ? "is-wrong" : ""} ${showIssueAnswer ? "is-issue-answer" : ""} ${showReview ? "is-review" : ""}`}
                key={option.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(question.id, option.label)}
              >
                <span className="option-letter">{option.label}</span>
                <span className="option-text">{option.text}</span>
                <span className="option-state" aria-hidden="true">
                  {showCorrect || showIssueAnswer ? <Check size={17} /> : null}
                  {showWrong ? <X size={17} /> : null}
                  {showReview ? <AlertTriangle size={16} /> : null}
                </span>
              </button>
            );
          })}
        </div>

        {selectedOption && !isChecked ? (
          <div className="selection-hint" aria-live="polite">
            <span className="selection-hint__dot" />
            {selectedOption.label}) {selectedOption.text} selected. Check it when you are ready.
          </div>
        ) : null}

        <div className="question-actions">
          <button className="button button--primary" type="button" disabled={!selectedAnswer} onClick={() => onCheck(question.id)}>
            <Check size={16} /> Check answer
          </button>
          <button className={`button button--solution ${isRevealed ? "is-open" : ""}`} type="button" onClick={() => onToggleSolution(question.id)} aria-expanded={isRevealed}>
            {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
            {isRevealed ? "Hide explanation" : "Show step-by-step solution"}
            <ChevronDown className="button-chevron" size={15} />
          </button>
        </div>

        {isChecked ? <AnswerFeedback question={question} hasCorrectChoice={hasCorrectChoice} /> : null}
      </div>

      {isRevealed ? (
        <div className="solution-panel">
          <StepByStep question={question} />
          {question.visualization ? <VisualizationRenderer visualization={question.visualization} questionId={question.id} /> : null}
          <AnswerCard question={question} />
          {hasNext ? (
            <button className="next-question" type="button" onClick={() => onNext(question.id)}>
              Continue to next question <ArrowRight size={16} />
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function AnswerFeedback({ question, hasCorrectChoice }: { question: Question; hasCorrectChoice: boolean }) {
  if (question.status === "insufficient-information") {
    return (
      <div className="answer-feedback answer-feedback--review" role="status" aria-live="polite">
        <AlertTriangle size={17} />
        <div><strong>Needs review</strong><span>No option is marked correct because the coding rule is not uniquely established.</span></div>
      </div>
    );
  }

  if (question.status === "ambiguous") {
    return (
      <div className="answer-feedback answer-feedback--review" role="status" aria-live="polite">
        <AlertTriangle size={17} />
        <div><strong>Worksheet ambiguity</strong><span>Your selection is recorded, but the supplied conditions do not support one unique answer.</span></div>
      </div>
    );
  }

  if (question.status === "worksheet-issue") {
    return (
      <div className="answer-feedback answer-feedback--issue" role="status" aria-live="polite">
        {hasCorrectChoice ? <Check size={17} /> : <AlertTriangle size={17} />}
        <div>
          <strong>{hasCorrectChoice ? "Correct text, duplicated option" : "Review the worksheet issue"}</strong>
          <span>{hasCorrectChoice ? "POTPAL is correct, but it appears as both options A and B." : "The answer is POTPAL; the worksheet duplicates that text as A and B."}</span>
        </div>
      </div>
    );
  }

  if (hasCorrectChoice) {
    return (
      <div className="answer-feedback answer-feedback--correct" role="status" aria-live="polite">
        <Check size={17} />
        <div><strong>Correct — nice work!</strong><span>You found the answer. Open the explanation to see the visual reasoning.</span></div>
      </div>
    );
  }

  const correct = question.correctOptions?.map((label) => {
    const option = question.options.find((item) => item.label === label);
    return option ? `${label}) ${option.text}` : label;
  }).join(" or ");

  return (
    <div className="answer-feedback answer-feedback--wrong" role="status" aria-live="polite">
      <X size={17} />
      <div><strong>Not quite</strong><span>Correct answer: {correct}. Keep the reasoning visible as you review it.</span></div>
    </div>
  );
}

function statusLabel(status: Question["status"]) {
  switch (status) {
    case "ambiguous":
      return "Needs review";
    case "insufficient-information":
      return "Insufficient info";
    case "worksheet-issue":
      return "Worksheet issue";
    default:
      return "Solved key";
  }
}

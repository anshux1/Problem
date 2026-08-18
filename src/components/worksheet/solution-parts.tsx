import { AlertTriangle, Check, CircleHelp, Lightbulb, Sparkles } from "lucide-react";

import type { Question, QuestionStatus } from "@/lib/worksheet-data";

export function StepByStep({ question }: { question: Question }) {
  return (
    <div className="step-by-step">
      <div className="solution-heading">
        <div className="solution-heading__icon"><Lightbulb size={17} /></div>
        <div>
          <span className="visual-kicker">Step-by-step solution</span>
          <h4>Reason it out</h4>
        </div>
      </div>
      <div className="concept-line">
        <span>Concept</span>
        <strong>{question.concept}</strong>
      </div>
      <ol className="explanation-list">
        {question.explanation.map((step, index) => (
          <li key={`${question.id}-step-${index}`}>
            <span className="explanation-number">{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AnswerCard({ question }: { question: Question }) {
  const isReview = question.status !== "solved";
  const isIssue = question.status === "worksheet-issue";

  return (
    <div className={`answer-card ${isReview ? "answer-card--review" : ""} ${isIssue ? "answer-card--issue" : ""}`}>
      <div className="answer-card__icon">
        {isReview ? <AlertTriangle size={18} /> : <Check size={18} />}
      </div>
      <div className="answer-card__copy">
        <span className="visual-kicker">Final answer</span>
        <strong>{question.answer ?? "Review the explanation"}</strong>
        {isReview ? (
          <p>{question.statusNote ?? "This worksheet item needs a careful review rather than a forced option."}</p>
        ) : (
          <p>That conclusion follows directly from the steps above.</p>
        )}
      </div>
      <Sparkles className="answer-card__spark" size={22} aria-hidden="true" />
    </div>
  );
}

export function AmbiguityWarning({ status, note }: { status: QuestionStatus; note?: string }) {
  if (status === "solved") return null;

  const title =
    status === "insufficient-information"
      ? "Insufficient information"
      : status === "worksheet-issue"
        ? "Worksheet issue"
        : "Worksheet ambiguity";
  const defaultNote =
    status === "insufficient-information"
      ? "The supplied example does not establish a unique rule, so no option can be justified."
      : status === "worksheet-issue"
        ? "The text answer can be determined, but the option list contains an issue."
        : "More than one interpretation or arrangement remains valid under the supplied conditions.";

  return (
    <div className={`ambiguity-warning ambiguity-warning--${status}`} role="note">
      <div className="ambiguity-warning__icon">
        {status === "insufficient-information" ? <CircleHelp size={17} /> : <AlertTriangle size={17} />}
      </div>
      <div>
        <strong>{title}</strong>
        <p>{note ?? defaultNote}</p>
      </div>
    </div>
  );
}

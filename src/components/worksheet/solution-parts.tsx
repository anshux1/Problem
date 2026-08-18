"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { Check, Clipboard, ClipboardCheck, Lightbulb, AlertTriangle } from "lucide-react";
import { useState } from "react";

import type { Question, SolutionStep } from "@/lib/worksheet-data";

export function ApproachBlock({ question }: { question: Question }) {
  return (
    <div className="approach-block">
      <div className="approach-icon"><Lightbulb size={17} /></div>
      <div>
        <span className="section-label">Approach</span>
        <p>{question.approach}</p>
      </div>
    </div>
  );
}

export function SolutionStepBlock({ step, index, total }: { step: SolutionStep; index: number; total: number }) {
  return (
    <div className="step-block">
      <div className="step-block__number">{String(index + 1).padStart(2, "0")}</div>
      <div className="step-block__content">
        <div className="step-block__heading"><span>Step {index + 1} of {total}</span><h4>{step.title}</h4></div>
        <p>{step.detail}</p>
        {step.formula ? <FormulaBlock formula={step.formula} /> : null}
      </div>
    </div>
  );
}

export function FormulaBlock({ formula, compact = false }: { formula: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const html = katex.renderToString(normalizeFormula(formula), {
    displayMode: true,
    throwOnError: false,
    strict: "ignore",
    trust: false,
  });

  const copyFormula = async () => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`formula-block ${compact ? "formula-block--compact" : ""}`}>
      <div className="formula-block__content" aria-label={`Formula: ${formula}`} dangerouslySetInnerHTML={{ __html: html }} />
      <button className="formula-copy" type="button" onClick={copyFormula} aria-label="Copy formula" title="Copy formula">
        {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

export function FinalAnswer({ question }: { question: Question }) {
  const isAmbiguous = question.status === "ambiguous" || question.status === "insufficient-information";
  const isIssue = question.status === "worksheet-issue";
  const answer = question.answer ?? (isAmbiguous ? "Cannot be determined uniquely" : "Review the worksheet note");

  return (
    <div className={`final-answer ${isAmbiguous ? "final-answer--ambiguous" : ""} ${isIssue ? "final-answer--issue" : ""}`}>
      <div className="final-answer__icon">{isAmbiguous || isIssue ? <AlertTriangle size={18} /> : <Check size={18} />}</div>
      <div className="final-answer__copy">
        <span className="section-label">Final answer</span>
        <strong>{answer}</strong>
      </div>
      <div className="final-answer__check">{isAmbiguous ? "No unique value" : isIssue ? "See note" : "Verified"}</div>
    </div>
  );
}

export function ImportantNote({ children }: { children: string }) {
  return (
    <div className="important-note" role="note">
      <div className="important-note__icon"><AlertTriangle size={17} /></div>
      <div><span className="section-label">Important note</span><p>{children}</p></div>
    </div>
  );
}

function normalizeFormula(formula: string) {
  const lineBreak = "\\[4pt]";
  if (formula.includes(lineBreak)) {
    return `\\begin{aligned}${formula.replaceAll(lineBreak, "\\\\")}\\end{aligned}`;
  }
  return formula;
}

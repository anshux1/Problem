import { ArrowDown, ArrowRight, Check, CircleHelp, RotateCcw, Sparkles } from "lucide-react";

import type {
  CodingVisualization,
  DirectionVisualization,
  FamilyVisualization,
  NumberVisualization,
  OrderingVisualization,
  SeatingVisualization,
  SeriesVisualization,
  Visualization,
} from "@/lib/worksheet-data";

type VisualizationProps = {
  visualization: Visualization;
  questionId: string;
};

export function VisualizationRenderer({ visualization, questionId }: VisualizationProps) {
  switch (visualization.type) {
    case "direction":
      return <DirectionDiagram data={visualization} questionId={questionId} />;
    case "family":
      return <FamilyTree data={visualization} />;
    case "seating":
      return <SeatingChart data={visualization} />;
    case "number":
      return <NumberPattern data={visualization} />;
    case "ordering":
      return <OrderingGraph data={visualization} />;
    case "series":
      return <SeriesVisualizer data={visualization} />;
    case "coding":
      return <CodingVisualizer data={visualization} />;
  }
}

function DirectionDiagram({ data, questionId }: { data: DirectionVisualization; questionId: string }) {
  const markerId = `arrow-${questionId}`;

  if (data.mode === "turns") {
    const orientations = [data.initial ?? "Start", ...(data.turns ?? []).map((turn) => turn.result)];

    return (
      <div className="visual-card direction-visual">
        <div className="visual-card__heading">
          <div>
            <span className="visual-kicker">Orientation tracker</span>
            <h4>Follow every turn</h4>
          </div>
          <div className="compass-glyph" aria-hidden="true">
            <span>N</span><i /><span>E</span><i /><span>W</span><i /><span>S</span>
          </div>
        </div>
        <div className="turn-track" aria-label={`Orientation sequence ending ${data.finalDirection}`}>
          {orientations.map((orientation, index) => (
            <div className="turn-stage" key={`${orientation}-${index}`}>
              <div className={`direction-orb ${index === orientations.length - 1 ? "is-final" : ""}`}>
                <span>{orientation.slice(0, 1)}</span>
              </div>
              <strong>{orientation}</strong>
              {index < (data.turns?.length ?? 0) && data.turns?.[index] ? (
                <span className="turn-label">{data.turns[index].label}</span>
              ) : null}
              {index < orientations.length - 1 ? <ArrowRight className="turn-arrow" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
        <div className="visual-result">
          <span className="result-dot" />
          <span>Final orientation</span>
          <strong>{data.finalDirection}</strong>
        </div>
        <p className="visual-caption">{data.caption}</p>
      </div>
    );
  }

  if (data.mode === "compass") {
    return (
      <div className="visual-card direction-visual compass-only">
        <div className="visual-card__heading">
          <div>
            <span className="visual-kicker">Compass clue</span>
            <h4>Sunset points the way</h4>
          </div>
          <span className="visual-chip"><Sparkles size={14} /> natural cue</span>
        </div>
        <div className="big-compass" aria-label="Compass with West highlighted">
          <span className="compass-label compass-label--north">N</span>
          <span className="compass-label compass-label--east">E</span>
          <span className="compass-label compass-label--south">S</span>
          <span className="compass-label compass-label--west is-active">W</span>
          <div className="compass-needle compass-needle--north" />
          <div className="compass-needle compass-needle--west is-active" />
          <div className="compass-center" />
        </div>
        <div className="visual-result">
          <span className="result-dot result-dot--orange" />
          <span>Sunset is in the</span>
          <strong>{data.finalDirection}</strong>
        </div>
        <p className="visual-caption">{data.caption}</p>
      </div>
    );
  }

  const steps = data.steps ?? [];
  const points = [{ x: 0, y: 0 }];
  for (const step of steps) {
    const previous = points[points.length - 1];
    points.push({ x: previous.x + step.dx, y: previous.y + step.dy });
  }
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min(285 / spanX, 135 / spanY);
  const centerX = 205 - ((minX + maxX) / 2) * scale;
  const centerY = 122 + ((minY + maxY) / 2) * scale;
  const toSvg = (point: { x: number; y: number }) => ({
    x: centerX + point.x * scale,
    y: centerY - point.y * scale,
  });
  const svgPoints = points.map(toSvg);

  return (
    <div className="visual-card direction-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Movement map</span>
          <h4>Trace the route</h4>
        </div>
        <div className="mini-compass" aria-label="North East South West compass">
          <span className="mini-compass__north">N</span>
          <span className="mini-compass__east">E</span>
          <span className="mini-compass__south">S</span>
          <span className="mini-compass__west">W</span>
          <span className="mini-compass__arrow">↑</span>
        </div>
      </div>
      <div className="direction-map-wrap">
        <svg className="direction-map" viewBox="0 0 520 250" role="img" aria-label={`Path map ending ${data.finalDirection}`}>
          <defs>
            <marker id={markerId} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 z" fill="currentColor" />
            </marker>
            <linearGradient id={`${markerId}-start`} x1="0" x2="1">
              <stop offset="0" stopColor="var(--accent-strong)" />
              <stop offset="1" stopColor="var(--accent-violet)" />
            </linearGradient>
          </defs>
          <line className="map-axis" x1="26" y1="122" x2="391" y2="122" />
          <line className="map-axis" x1="205" y1="24" x2="205" y2="220" />
          {svgPoints.slice(0, -1).map((point, index) => {
            const next = svgPoints[index + 1];
            const step = steps[index];
            const midX = (point.x + next.x) / 2;
            const midY = (point.y + next.y) / 2;
            const labelWidth = Math.max((step.distance?.length ?? 2) * 8 + 18, 40);
            return (
              <g key={`${step.direction}-${index}`} className="map-segment">
                <line
                  x1={point.x}
                  y1={point.y}
                  x2={next.x}
                  y2={next.y}
                  markerEnd={`url(#${markerId})`}
                />
                <rect x={midX - labelWidth / 2} y={midY - 17} width={labelWidth} height="22" rx="11" />
                <text x={midX} y={midY - 2} textAnchor="middle">{step.distance}</text>
              </g>
            );
          })}
          <circle className="map-start" cx={svgPoints[0].x} cy={svgPoints[0].y} r="8" />
          <text className="map-point-label" x={svgPoints[0].x} y={svgPoints[0].y + 26} textAnchor="middle">START</text>
          <circle className="map-final" cx={svgPoints[svgPoints.length - 1].x} cy={svgPoints[svgPoints.length - 1].y} r="8" />
          <text className="map-point-label map-point-label--final" x={svgPoints[svgPoints.length - 1].x} y={svgPoints[svgPoints.length - 1].y - 16} textAnchor="middle">FINAL</text>
          <g className="svg-compass" transform="translate(445 68)">
            <circle cx="0" cy="0" r="28" />
            <path d="M0 -20 L4 0 L0 20 L-4 0 Z" />
            <text x="0" y="-34" textAnchor="middle">N</text>
            <text x="36" y="4" textAnchor="middle">E</text>
            <text x="0" y="43" textAnchor="middle">S</text>
            <text x="-36" y="4" textAnchor="middle">W</text>
          </g>
        </svg>
      </div>
      <div className="direction-step-list">
        {steps.map((step, index) => (
          <div className="direction-step" key={`${step.direction}-${index}`}>
            <span className="step-index">0{index + 1}</span>
            <span className="step-arrow">{directionArrow(step.direction)}</span>
            <span>{step.distance} {step.direction}</span>
          </div>
        ))}
      </div>
      <div className="visual-result">
        <span className="result-dot" />
        <span>Net displacement</span>
        <strong>{data.finalDirection}</strong>
      </div>
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function directionArrow(direction: "North" | "South" | "East" | "West"): string {
  return { North: "↑", South: "↓", East: "→", West: "←" }[direction];
}

function FamilyTree({ data }: { data: FamilyVisualization }) {
  const nodeMap = new Map(data.nodes.map((node) => [node.id, node]));

  return (
    <div className="visual-card family-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Relationship map</span>
          <h4>Build the family tree</h4>
        </div>
        <div className="family-legend" aria-label="Gender legend">
          <span><i className="gender-dot gender-dot--male" /> male</span>
          <span><i className="gender-dot gender-dot--female" /> female</span>
        </div>
      </div>
      <div className="family-canvas" role="img" aria-label={data.relationship}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {data.edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                className="family-edge"
              />
            );
          })}
        </svg>
        {data.nodes.map((node) => (
          <div
            className={`family-node family-node--${node.gender} ${node.highlight ? "is-highlighted" : ""}`}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span className="family-node__avatar" aria-hidden="true">
              {node.gender === "male" ? "♂" : node.gender === "female" ? "♀" : "•"}
            </span>
            <span>{node.label}</span>
          </div>
        ))}
      </div>
      <div className="relationship-answer">
        <span className="answer-spark"><Check size={14} /></span>
        <span>{data.relationship}</span>
      </div>
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function SeatingChart({ data }: { data: SeatingVisualization }) {
  return (
    <div className="visual-card seating-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Constraint solver</span>
          <h4>Compare the valid rows</h4>
        </div>
        <span className="visual-chip"><CircleHelp size={14} /> {data.arrangements.length} valid rows</span>
      </div>
      <div className="constraint-pills">
        {data.constraints.map((constraint) => <span key={constraint}>{constraint}</span>)}
      </div>
      <div className="seat-rows">
        {data.arrangements.map((arrangement, index) => (
          <div className="seat-arrangement" key={`${arrangement.join("")}-${index}`}>
            <div className="seat-arrangement__label">Arrangement {index + 1}</div>
            <div className="seat-row">
              {arrangement.map((person, seatIndex) => (
                <div className={`seat ${data.focus?.includes(person) ? "is-focus" : ""}`} key={`${person}-${seatIndex}`}>
                  <span className="seat-number">0{seatIndex + 1}</span>
                  <strong>{person}</strong>
                  <span className="seat-line" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="solver-strip">
        {data.solverSteps.map((step, index) => (
          <div className="solver-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
            {index < data.solverSteps.length - 1 ? <ArrowRight size={14} aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function NumberPattern({ data }: { data: NumberVisualization }) {
  return (
    <div className="visual-card number-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Pattern lab</span>
          <h4>Make the rule visible</h4>
        </div>
        <span className="formula-pill">{data.rule}</span>
      </div>
      {data.mode === "recurrence" ? (
        <div className="recurrence-track" aria-label={`Number pattern ${data.terms.join(", ")}`}>
          {data.terms.map((term, index) => (
            <div className="recurrence-step" key={`${term}-${index}`}>
              <div className={`number-orb ${index === data.terms.length - 1 ? "is-answer" : ""}`}>{term}</div>
              {index < data.operators.length ? <><span className="operator-label">{data.operators[index]}</span><ArrowRight className="number-arrow" aria-hidden="true" /></> : null}
            </div>
          ))}
        </div>
      ) : null}
      {data.mode === "products" ? (
        <div className="product-grid">
          {data.products.map((product, index) => (
            <div className={`product-card ${index === data.products.length - 1 ? "is-answer" : ""}`} key={`${product.left}-${product.right}`}>
              <span>{product.left}</span><b>×</b><span>{product.right}</span><b>=</b><strong>{product.result}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {data.mode === "odd-one-out" ? (
        <div className="odd-grid">
          {data.values.map((item) => (
            <div className={`odd-card ${item.isOdd ? "is-odd" : ""}`} key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.isOdd ? "not a square" : `${Math.round(Math.sqrt(item.value))}²`}</span>
              {item.isOdd ? <CircleHelp size={16} /> : <Check size={16} />}
            </div>
          ))}
        </div>
      ) : null}
      {data.mode === "formula" ? (
        <div className="equation-stack" aria-label="Formula derivation">
          {data.equation.map((line, index) => <div className={index === data.equation.length - 1 ? "is-final" : ""} key={line}>{line}</div>)}
        </div>
      ) : null}
      {data.mode === "cubes" ? (
        <div className="cube-track">
          {data.values.map((item) => (
            <div className="cube-step" key={item.input}>
              <span className="cube-input">{item.input}</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span className="cube-rule">{item.input}³</span>
              <b>=</b>
              <strong>{item.output}</strong>
            </div>
          ))}
        </div>
      ) : null}
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function OrderingGraph({ data }: { data: OrderingVisualization }) {
  return (
    <div className="visual-card ordering-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Logic ladder</span>
          <h4>Turn clues into an order</h4>
        </div>
        <span className="formula-pill">{data.relation}</span>
      </div>
      {data.scores ? (
        <div className="score-strip">
          {data.scores.map((score) => <div className="score-chip" key={score.label}><strong>{score.label}</strong><span>{score.value}</span></div>)}
        </div>
      ) : null}
      <div className="order-chain" aria-label={`Ordering ${data.relation}`}>
        {data.order.map((person, index) => (
          <div className="order-stage" key={`${person}-${index}`}>
            <div className={`order-node ${index === 0 ? "is-top" : ""} ${index === data.order.length - 1 ? "is-bottom" : ""}`}>
              <span>{person}</span>
              {data.scores?.find((score) => score.label === person) ? <small>{data.scores.find((score) => score.label === person)?.value}</small> : null}
            </div>
            {index < data.order.length - 1 ? <ArrowDown className="order-arrow" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <div className="visual-result">
        <span className="result-dot" />
        <span>Deduction</span>
        <strong>{data.conclusion}</strong>
      </div>
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function SeriesVisualizer({ data }: { data: SeriesVisualization }) {
  return (
    <div className="visual-card series-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Sequence studio</span>
          <h4>See the hidden increments</h4>
        </div>
        <span className="visual-chip"><Sparkles size={14} /> pattern found</span>
      </div>
      {data.mode === "alphabet" || data.mode === "quadratic" ? (
        <div className="alphabet-lane">
          <div className="series-term-row">
            {data.terms.map((term, index) => <div className={`series-term ${index === data.terms.length - 1 ? "is-answer" : ""}`} key={`${term}-${index}`}>{term}</div>)}
          </div>
          <div className="series-position-row">
            {data.positions.map((position, index) => <span key={`${position}-${index}`}>{position}</span>)}
          </div>
          <div className="series-diff-row">
            {data.differences.map((difference, index) => <span key={`${difference}-${index}`}>{difference}</span>)}
          </div>
          <div className="series-diff-caption">alphabet position <i /> increasing difference <i /></div>
        </div>
      ) : null}
      {data.mode === "pairs" ? (
        <div className="pair-lane">
          {data.terms.map((term, index) => (
            <div className="pair-stage" key={`${term}-${index}`}>
              <div className={`pair-box ${index === data.terms.length - 1 ? "is-answer" : ""}`}><span>{term[0]}</span><span>{term[1]}</span></div>
              {index < data.terms.length - 1 ? <ArrowRight size={17} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      ) : null}
      {data.mode === "number-letter" ? (
        <div className="number-letter-lane">
          {data.terms.map((term, index) => (
            <div className={`number-letter-card ${index === data.terms.length - 1 ? "is-answer" : ""}`} key={term}>
              <strong>{term.slice(0, -1)}</strong><span>{term.slice(-1)}</span>
            </div>
          ))}
        </div>
      ) : null}
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function CodingVisualizer({ data }: { data: CodingVisualization }) {
  return (
    <div className="visual-card coding-visual">
      <div className="visual-card__heading">
        <div>
          <span className="visual-kicker">Transformation lab</span>
          <h4>Decode it letter by letter</h4>
        </div>
        <span className="visual-chip"><RotateCcw size={14} /> apply the rule</span>
      </div>
      {data.mode === "shift" ? (
        <div className="shift-grid">
          <div className="shift-label">Example</div>
          <div className="shift-word">{[...data.source].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="shift-word shift-word--coded">{[...data.coded].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="shift-rule">+1 each</div>
          <div className="shift-label">Apply to {data.target}</div>
          <div className="shift-word">{[...data.target].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="shift-word shift-word--answer">{[...data.targetCoded].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="shift-rule">answer</div>
        </div>
      ) : null}
      {data.mode === "insufficient" ? (
        <div className="insufficient-map">
          <div className="code-example"><span>{data.source}</span><b>→</b><strong>{data.coded}</strong></div>
          <div className="uncertain-rule"><CircleHelp size={17} /><span>Rule cannot be established uniquely</span></div>
          <div className="code-target"><span>{data.target}</span><b>→</b><em>?</em></div>
        </div>
      ) : null}
      {data.mode === "letter-sum" ? (
        <div className="letter-sum-map">
          <WordValueRow word={data.word} values={data.values} total={data.total} />
          <div className="sum-divider"><ArrowDown size={14} /> same rule</div>
          <WordValueRow word={data.target} values={data.targetValues} total={data.targetTotal} isAnswer />
        </div>
      ) : null}
      {data.mode === "word-map" ? (
        <div className="word-map">
          {data.mappings.map((mapping, index) => (
            <div className={`word-map-row ${index === data.mappings.length - 1 ? "is-answer" : ""}`} key={mapping.word}>
              <span>{mapping.word}</span><ArrowRight size={17} aria-hidden="true" /><strong>{mapping.code}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {data.mode === "reverse" ? (
        <div className="reverse-map">
          <div className="reverse-word reverse-word--source">{[...data.source].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="reverse-hint"><RotateCcw size={16} /><span>read right → left</span></div>
          <div className="reverse-word reverse-word--coded">{[...data.coded].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="reverse-target-label">Apply to {data.target}</div>
          <div className="reverse-word reverse-word--answer">{[...data.answer].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
        </div>
      ) : null}
      <p className="visual-caption">{data.caption}</p>
    </div>
  );
}

function WordValueRow({ word, values, total, isAnswer = false }: { word: string; values: number[]; total: number; isAnswer?: boolean }) {
  return (
    <div className={`word-value-row ${isAnswer ? "is-answer" : ""}`}>
      <div className="word-value-row__word">{word}</div>
      <div className="word-value-row__letters">
        {[...word].map((letter, index) => <span key={`${letter}-${index}`}><b>{letter}</b><small>{values[index]}</small></span>)}
      </div>
      <div className="word-value-row__total">= <strong>{total}</strong></div>
    </div>
  );
}

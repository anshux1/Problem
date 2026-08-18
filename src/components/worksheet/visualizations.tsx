import { AlertTriangle, ArrowDown, ArrowRight, Check, CircleHelp, Route, Sparkles } from "lucide-react";

import type { Visualization } from "@/lib/worksheet-data";
import { LegacyVisualizationRenderer } from "./legacy-visualizations";

type VisualizationProps = { visualization: Visualization; questionId: string };

export function VisualizationRenderer({ visualization, questionId }: VisualizationProps) {
  switch (visualization.type) {
    case "age-timeline": return <AgeTimeline data={visualization} />;
    case "livestock": return <LivestockDiagram data={visualization} />;
    case "finger-count": return <FingerDiagram data={visualization} />;
    case "direction-coordinate": return <CoordinateDiagram data={visualization} questionId={questionId} />;
    case "route-comparison": return <RouteComparison data={visualization} questionId={questionId} />;
    case "handshake": return <HandshakeDiagram data={visualization} />;
    case "day-pattern": return <DayPattern data={visualization} />;
    case "age-chain": return <AgeChain data={visualization} />;
    case "page-digits": return <PageDigits data={visualization} />;
    case "star-puzzle": return <StarPuzzle data={visualization} />;
    case "odd-letter": return <OddLetter data={visualization} />;
    case "wrong-term": return <WrongTerm data={visualization} />;
    case "temperature": return <TemperatureDiagram data={visualization} />;
    case "wrong-number": return <WrongNumber data={visualization} />;
    case "letter-grid": return <LetterGrid data={visualization} />;
    case "number-pyramid": return <NumberPyramid data={visualization} />;
    case "legacy": return <LegacyVisualizationRenderer visualization={visualization.visualization} questionId={questionId} />;
  }
}

function VisualShell({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return <div className={`visual-card ${className}`}><div className="visual-card__heading"><div><span className="visual-kicker">{eyebrow}</span><h3>{title}</h3></div><Sparkles size={16} className="visual-spark" aria-hidden="true" /></div>{children}</div>;
}

function AgeTimeline({ data }: { data: Extract<Visualization, { type: "age-timeline" }> }) {
  return (
    <VisualShell eyebrow="Timeline" title="Age through three moments" className="age-timeline-visual">
      <div className="timeline-columns"><span className="timeline-spacer" />{data.columns.map((column) => <span className={column === "NOW" ? "is-now" : ""} key={column}>{column}</span>)}</div>
      <div className="timeline-body">
        {data.rows.map((row) => <div className="timeline-row" key={row.label}><strong>{row.label}</strong>{row.values.map((value, index) => <div className={`timeline-cell ${data.columns[index] === "NOW" ? "is-now" : ""}`} key={`${row.label}-${value}`}><span>{value}</span><small>years</small></div>)}</div>)}
      </div>
      <div className="timeline-axis"><i /><span>Past</span><b>Present</b><span>Future</span><i /></div>
      <p className="visual-caption">The two equations agree at the present ages: the son is 13 and Ram is 45.</p>
    </VisualShell>
  );
}

function LivestockDiagram({ data }: { data: Extract<Visualization, { type: "livestock" }> }) {
  return (
    <VisualShell eyebrow="Heads & legs" title="Separate the animal counts" className="livestock-visual">
      <div className="animal-cards">{data.animals.map((animal) => <div className="animal-card" key={animal.label}><span className="animal-emoji" aria-hidden="true">{animal.icon}</span><div><strong>{animal.label}</strong><small>{animal.variable} · {animal.legs} legs each</small></div><span className="animal-head">1 head</span></div>)}</div>
      <div className="equation-ribbon"><span>Given rule</span><strong>{data.equation}</strong></div>
      <div className="animal-result"><Check size={16} /><span>Goats derived</span><strong>G = 7</strong></div>
      <p className="visual-caption">Heads cancel from both sides of the equation, leaving the goat count.</p>
    </VisualShell>
  );
}

function FingerDiagram({ data }: { data: Extract<Visualization, { type: "finger-count" }> }) {
  return (
    <VisualShell eyebrow="Repeat the route" title="Count across the left hand" className="finger-visual">
      <div className="finger-hand" role="img" aria-label="Left hand finger count with index finger highlighted">
        {data.fingers.map((finger, index) => <div className={`finger-column finger-column--${index} ${finger.highlight ? "is-highlighted" : ""}`} key={finger.name}><div className="finger-tip" /><div className="finger-digit"><strong>{finger.numbers[0]}</strong>{finger.numbers[1] ? <span>{finger.numbers[1]}</span> : null}</div><small>{finger.name}</small></div>)}
        <div className="hand-palm" />
      </div>
      <div className="finger-key"><span className="finger-key__cycle">{data.cycle}</span><span className="finger-key__remainder">{data.remainder}</span></div>
      <div className="finger-sequence"><span>1</span><i>→</i><span>2</span><i>→</i><span>3</span><i>→</i><span>4</span><i>→</i><span>5</span><i>→</i><span>6</span><i>→</i><span>7</span><i>→</i><span>8</span></div>
      <p className="visual-caption">The second position in every cycle lands on the <strong>index finger</strong>.</p>
    </VisualShell>
  );
}

function CoordinateDiagram({ data, questionId }: { data: Extract<Visualization, { type: "direction-coordinate" }>; questionId: string }) {
  return (
    <VisualShell eyebrow="Coordinate plane" title="Draw the shortest route" className="coordinate-visual">
      <PlotSvg points={data.points} segments={data.lines} questionId={questionId} />
      <div className="symbol-legend">{data.symbols.map((item) => <span key={item.symbol}><b>{item.symbol}</b>{item.meaning}</span>)}</div>
      <div className="visual-result"><Route size={15} /><span>Shortest distance</span><strong>5√37 m</strong></div>
      <p className="visual-caption">S and Q form the endpoints of a right triangle with legs 30 m and 5 m.</p>
    </VisualShell>
  );
}

function PlotSvg({ points, segments, questionId, routeSegments = [] }: { points: { label: string; x: number; y: number; tone?: string }[]; segments: { from: string; to: string; label?: string }[]; questionId: string; routeSegments?: { from: string; to: string; kind: "direct" | "via" }[] }) {
  const pointMap = new Map(points.map((point) => [point.label, point]));
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const scale = Math.min(390 / Math.max(Math.max(...xs) - Math.min(...xs), 1), 185 / Math.max(Math.max(...ys) - Math.min(...ys), 1));
  const centerX = 270 - ((Math.min(...xs) + Math.max(...xs)) / 2) * scale;
  const centerY = 145 + ((Math.min(...ys) + Math.max(...ys)) / 2) * scale;
  const toSvg = (point: { x: number; y: number }) => ({ x: centerX + point.x * scale, y: centerY - point.y * scale });
  const markerId = `plot-arrow-${questionId}`;
  const axis = toSvg({ x: 0, y: 0 });
  const coordinateSegments = segments.map((segment) => ({ ...segment, from: pointMap.get(segment.from), to: pointMap.get(segment.to) })).filter((segment) => segment.from && segment.to);

  return <div className="plot-wrap"><svg viewBox="0 0 620 300" role="img" aria-label="Coordinate diagram showing the points and distances"><defs><marker id={markerId} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="currentColor" /></marker></defs><line className="plot-axis" x1="36" x2="535" y1={axis.y} y2={axis.y} /><line className="plot-axis" x1={axis.x} x2={axis.x} y1="24" y2="273" />{coordinateSegments.map((segment, index) => { const from = toSvg(segment.from!); const to = toSvg(segment.to!); const x = (from.x + to.x) / 2; const y = (from.y + to.y) / 2; return <g className={`plot-segment ${index === 0 ? "plot-segment--answer" : ""}`} key={`${segment.from?.label}-${segment.to?.label}`}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} markerEnd={`url(#${markerId})`} /><text x={x} y={y - 8} textAnchor="middle">{segment.label}</text></g>; })}{routeSegments.map((segment, index) => { const from = pointMap.get(segment.from); const to = pointMap.get(segment.to); if (!from || !to) return null; const a = toSvg(from); const b = toSvg(to); return <line className={`plot-route plot-route--${segment.kind}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} key={`route-${index}`} />; })}{points.map((point) => { const svg = toSvg(point); return <g key={point.label}><circle className={`plot-point plot-point--${point.tone ?? "normal"}`} cx={svg.x} cy={svg.y} r="7" /><text className="plot-point-label" x={svg.x + 10} y={svg.y - 10}>{point.label}</text></g>; })}<text className="plot-direction" x="548" y="145">E</text><text className="plot-direction" x={axis.x} y="18" textAnchor="middle">N</text></svg></div>;
}

function RouteComparison({ data, questionId }: { data: Extract<Visualization, { type: "route-comparison" }>; questionId: string }) {
  const points = data.points;
  const directSegments = [{ from: data.direct[0], to: data.direct[1], label: data.directDistance }];
  const routeSegments = [...data.via.slice(0, -1).map((from, index) => ({ from, to: data.via[index + 1], kind: "via" as const }))];
  return <VisualShell eyebrow="Route comparison" title="Straight line vs. detour" className="route-visual"><PlotSvg points={points} segments={directSegments} routeSegments={routeSegments} questionId={questionId} /><div className="route-legend"><span><i className="route-dot route-dot--direct" /> Direct: {data.directDistance}</span><span><i className="route-dot route-dot--via" /> Via Deva: {data.viaDistance}</span></div><div className="visual-result"><Check size={15} /><span>Distance saved</span><strong>{data.saving}</strong></div><p className="visual-caption">The direct diagonal is shorter than walking from Mithu to Deva and then to Shakshi.</p></VisualShell>;
}

function HandshakeDiagram({ data }: { data: Extract<Visualization, { type: "handshake" }> }) {
  const center = 145;
  const radius = 103;
  const nodes = Array.from({ length: data.people }, (_, index) => { const angle = (index / data.people) * Math.PI * 2 - Math.PI / 2; return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius, label: index + 1 }; });
  return <VisualShell eyebrow="Pair counting" title="Every pair shakes once" className="handshake-visual"><div className="handshake-canvas"><svg viewBox="0 0 290 290" role="img" aria-label={`${data.people} people connected by handshake lines`}>{nodes.map((a, index) => nodes.slice(index + 1).map((b) => <line className="handshake-line" key={`${index}-${b.label}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))}{nodes.map((node) => <g key={node.label}><circle className="handshake-node" cx={node.x} cy={node.y} r="14" /><text x={node.x} y={node.y + 3} textAnchor="middle">{node.label}</text></g>)}</svg><div className="handshake-center"><strong>{data.people}</strong><span>people</span></div></div><div className="formula-chip-row"><span>Pairs</span><strong>{data.formula} = 30</strong><span>worksheet answer</span></div><p className="visual-caption">Each connecting line represents one unique pair of people.</p></VisualShell>;
}

function DayPattern({ data }: { data: Extract<Visualization, { type: "day-pattern" }> }) {
  return <VisualShell eyebrow="Pattern discovery" title="Three pieces make each code" className="day-pattern-visual"><div className="day-table"><div className="day-table__header"><span>Day</span><span>Letters</span><span>Day #</span><span>Sum</span><strong>Code</strong></div>{data.rows.map((row) => <div className={`day-table__row ${row.day === "Sunday" ? "is-answer" : ""}`} key={row.day}><span>{row.day}</span><b>{row.letters}</b><b>{row.dayNumber}</b><b>{row.sum}</b><strong>{row.code}</strong></div>)}</div><div className="pattern-equation"><span>letters</span><i>+</i><span>day number</span><i>=</i><strong>code</strong></div><p className="visual-caption">Sunday: 6 letters + day 7 = 13, giving 6713.</p></VisualShell>;
}

function AgeChain({ data }: { data: Extract<Visualization, { type: "age-chain" }> }) {
  return <VisualShell eyebrow="Age relationship" title="Build the family age ladder" className="age-chain-visual"><div className="age-chain">{data.nodes.map((node, index) => <div className="age-chain-stage" key={node.label}><div className={`age-chain-node age-chain-node--${node.tone ?? "base"}`}><strong>{node.label}</strong><span>{node.value}</span></div>{index < data.nodes.length - 1 ? <><ArrowDown size={15} /><small>{data.connectors[index]}</small></> : null}</div>)}</div><div className="age-chain-answer"><span>B = D</span><i>→</i><strong>C = D + 21</strong></div><p className="visual-caption">The twin relationship lets us replace B with D at the end.</p></VisualShell>;
}

function PageDigits({ data }: { data: Extract<Visualization, { type: "page-digits" }> }) {
  return <VisualShell eyebrow="Digit breakdown" title="Count by page-length blocks" className="page-digits-visual"><div className="digit-table"><div className="digit-table__header"><span>Pages</span><span>How many × digits</span><strong>Used</strong></div>{data.rows.map((row) => <div className="digit-table__row" key={row.pages}><span>{row.pages}</span><b>{row.count}</b><strong>{row.digits}</strong></div>)}<div className="digit-table__total"><span>Total</span><strong>{data.total}</strong></div></div><div className="digit-meter"><i style={{ width: "100%" }} /><span>9 + 180 + 1200 = 1389</span></div><p className="visual-caption">Only the number of digits changes at pages 10 and 100.</p></VisualShell>;
}

function StarPuzzle({ data }: { data: Extract<Visualization, { type: "star-puzzle" }> }) {
  return <VisualShell eyebrow="Worksheet check" title="Two examples, no unique rule" className="star-visual"><div className="stars-row">{data.stars.map((star, index) => <div className={`star-case ${index === 2 ? "is-question" : ""}`} key={index}><div className="star-shape"><span className="star-number star-number--top">{star.top}</span><span className="star-number star-number--left">{star.left}</span><span className="star-number star-number--right">{star.right}</span><span className="star-number star-number--center">{star.center}</span><span className="star-number star-number--bottom-left">{star.bottomLeft}</span><span className="star-number star-number--bottom-right">{star.bottomRight}</span></div><small>Star {index + 1}</small></div>)}</div><div className="ambiguity-callout"><CircleHelp size={16} /><div><strong>Ambiguous puzzle</strong><span>Many rules fit the first two stars, so the centre of Star 3 cannot be proved.</span></div></div><p className="visual-caption">The honest answer is to flag the missing rule, not guess a number.</p></VisualShell>;
}

function OddLetter({ data }: { data: Extract<Visualization, { type: "odd-letter" }> }) {
  return <VisualShell eyebrow="Alphabet positions" title="Find the break in the sequence" className="odd-letter-visual"><div className="letter-track">{data.letters.map((item, index) => <div className={`letter-track__item ${item.isOdd ? "is-odd" : ""}`} key={item.letter}><div><strong>{item.letter}</strong><small>{item.position}</small></div>{index < data.letters.length - 1 ? <ArrowRight size={16} /> : null}</div>)}</div><div className="expected-chip"><span>Expected next</span><strong>F = 6</strong><i>but got G = 7</i></div><p className="visual-caption">{data.rule}. G is one position too high.</p></VisualShell>;
}

function WrongTerm({ data }: { data: Extract<Visualization, { type: "wrong-term" }> }) {
  return <VisualShell eyebrow="Series audit" title="The pattern breaks twice" className="wrong-series-visual"><div className="wrong-series-track">{data.terms.map((term, index) => <div className="wrong-series-stage" key={`${term}-${index}`}><div className={`wrong-series-box ${index === data.brokenAt - 1 ? "is-wrong" : ""}`}>{term}</div>{index < data.terms.length - 1 ? <ArrowRight size={15} /> : null}</div>)}</div><div className="correction-row"><span>After 77, expected</span><strong>163</strong><span>printed</span><b>179</b></div><div className="series-warning"><AlertTriangle size={15} /><span>{data.note}</span></div><p className="visual-caption">179 appears to be the intended wrong term, but 221 also remains outside the rule.</p></VisualShell>;
}

function TemperatureDiagram({ data }: { data: Extract<Visualization, { type: "temperature" }> }) {
  return <VisualShell eyebrow="Overlapping averages" title="Cancel the shared days" className="temperature-visual"><div className="temperature-groups"><TemperatureGroup label="Mon → Thu · average 48°" items={data.first} total="192°" /><div className="overlap-arrow"><ArrowDown size={15} /><span>shared Tue–Thu</span></div><TemperatureGroup label="Tue → Fri · average 46°" items={data.second} total="184°" /></div><div className="temperature-result"><span>150° shared + Friday</span><strong>Friday = 34°C</strong></div><p className="visual-caption">The overlapping Tuesday–Thursday total is the bridge between the two averages.</p></VisualShell>;
}

function TemperatureGroup({ label, items, total }: { label: string; items: { label: string; value: string }[]; total: string }) {
  return <div className="temperature-group"><div className="temperature-group__heading"><span>{label}</span><strong>{total}</strong></div><div className="temperature-days">{items.map((item) => <div className={`temperature-day ${item.label === "Fri" ? "is-answer" : ""}`} key={item.label}><small>{item.label}</small><strong>{item.value}</strong></div>)}</div></div>;
}

function WrongNumber({ data }: { data: Extract<Visualization, { type: "wrong-number" }> }) {
  return <VisualShell eyebrow="Operation audit" title="Replace the broken term" className="wrong-number-visual"><div className="wrong-number-track">{data.terms.map((term, index) => <div className="wrong-number-stage" key={`${term}-${index}`}><div className={`wrong-number-box ${index === data.brokenAt - 1 ? "is-wrong" : ""}`}>{term}</div>{index < data.terms.length - 1 ? <ArrowRight size={14} /> : null}</div>)}</div><div className="wrong-number-correction"><span>Correct operation at the break</span><strong>{data.expected}</strong><Check size={16} /></div><div className="operation-rule"><span>×1+1</span><span>×2+2</span><span>×3+3</span><span>×4+4</span><span>×5+5</span></div><p className="visual-caption">The red term is the printed error; replacing it restores every later step.</p></VisualShell>;
}

function LetterGrid({ data }: { data: Extract<Visualization, { type: "letter-grid" }> }) {
  return <VisualShell eyebrow="Letter positions" title="Make each row add up" className="letter-grid-visual"><div className="hex-grid">{data.cells.flatMap((row, rowIndex) => row.map((cell, cellIndex) => <div className={`hex-cell hex-cell--${cell.tone ?? "normal"}`} key={`${rowIndex}-${cellIndex}`}><strong>{cell.value}</strong><small>{cell.position || "?"}</small></div>))}</div><div className="row-sums">{data.rowSums.map((sum, index) => <span key={`${sum}-${index}`}><b>Row {index + 1}</b><strong>{sum}</strong></span>)}</div><div className="grid-equation"><span>9 + ? + 4</span><b>=</b><strong>34</strong><b>→</b><strong>U</strong></div><p className="visual-caption">The missing hexagon must hold alphabet position 21: U.</p></VisualShell>;
}

function NumberPyramid({ data }: { data: Extract<Visualization, { type: "number-pyramid" }> }) {
  return <VisualShell eyebrow="Column totals" title="Read the pyramid diagonally" className="pyramid-visual"><div className="pyramid-layout"><div className="number-pyramid">{data.rows.map((row, rowIndex) => <div className="pyramid-row" key={rowIndex}>{row.map((value, index) => <div className={`pyramid-cell ${value === "?" ? "is-answer" : ""}`} key={`${rowIndex}-${index}`}>{value}</div>)}</div>)}</div><div className="pyramid-totals">{data.totals.map((total, index) => <div key={total}><span>Column {index + 1}</span><strong>{total}</strong>{index < data.totals.length - 1 ? <ArrowDown size={13} /> : null}</div>)}</div></div><div className="pyramid-rule"><span>16</span><i>−4</i><span>12</span><i>−4</i><span>8</span><i>−4</i><strong>4</strong></div><p className="visual-caption">The final column has only the missing cell, so its value is 4.</p></VisualShell>;
}

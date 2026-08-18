import { worksheetSections as logicalWorksheetSections, type Visualization as LogicalVisualization } from "./logical-worksheet-data";

export type WorksheetId = "quantitative" | "logical";
export type WorksheetStatus = "solved" | "worksheet-issue" | "ambiguous" | "insufficient-information";
export type Difficulty = "Warm-up" | "Core" | "Challenge";

export type SolutionStep = {
  title: string;
  detail: string;
  formula?: string;
};

export type Visualization =
  | { type: "age-timeline"; rows: { label: string; values: string[] }[]; columns: string[] }
  | { type: "livestock"; animals: { label: string; icon: string; legs: number; variable: string }[]; equation: string }
  | { type: "finger-count"; fingers: { name: string; numbers: string[]; highlight?: boolean }[]; cycle: string; remainder: string }
  | { type: "direction-coordinate"; points: { label: string; x: number; y: number; tone?: "start" | "end" | "normal" }[]; lines: { from: string; to: string; label?: string }[]; symbols: { symbol: string; meaning: string }[] }
  | { type: "route-comparison"; points: { label: string; x: number; y: number; tone?: "start" | "end" | "normal" }[]; direct: string[]; via: string[]; directDistance: string; viaDistance: string; saving: string }
  | { type: "handshake"; people: number; formula: string }
  | { type: "day-pattern"; rows: { day: string; code: string; letters: number; dayNumber: number; sum: number }[]; answer: string }
  | { type: "age-chain"; nodes: { label: string; value: string; tone?: "base" | "plus" | "answer" }[]; connectors: string[] }
  | { type: "page-digits"; rows: { pages: string; count: string; digits: string }[]; total: string }
  | { type: "star-puzzle"; stars: { top: number; left: number; right: number; center: string; bottomLeft: number; bottomRight: number }[] }
  | { type: "odd-letter"; letters: { letter: string; position: number; expected?: number; isOdd?: boolean }[]; rule: string }
  | { type: "wrong-term"; terms: string[]; expected: string; brokenAt: number; note: string }
  | { type: "temperature"; first: { label: string; value: string }[]; second: { label: string; value: string }[]; result: string }
  | { type: "wrong-number"; terms: string[]; expected: string; brokenAt: number; note?: string }
  | { type: "letter-grid"; cells: { value: string; position: number; tone?: "normal" | "answer" | "missing" }[][]; rowSums: string[]; answer: string }
  | { type: "number-pyramid"; rows: string[][]; totals: string[]; answer: string }
  | { type: "legacy"; visualization: LogicalVisualization };

export type Option = { label: string; text: string };

export type Question = {
  id: string;
  worksheetId?: WorksheetId;
  section?: string;
  subNumber?: number;
  worksheetTotal?: number;
  number: number;
  category: string;
  difficulty: Difficulty;
  question: string;
  context?: string;
  options?: Option[];
  correctOptions?: string[];
  approach: string;
  steps: SolutionStep[];
  answer?: string;
  status: WorksheetStatus;
  importantNote?: string;
  visualization: Visualization;
};

export const quantitativeQuestions: Question[] = [
  {
    id: "quantitative-01",
    number: 1,
    category: "Age Problem",
    difficulty: "Core",
    question: "Ram tells his son, “5 years ago, I was 5 times as old as you were then. Also 3 years from now, I shall be 3 times as old as you will be”. Find their present ages.",
    approach: "Use the same two present-age variables in both time frames, then equate Ram’s age expressions.",
    steps: [
      { title: "Define the variables", detail: "Let the son’s present age be x and Ram’s present age be y." },
      { title: "Translate five years ago", detail: "Five years ago, Ram was five times the son’s age at that time.", formula: "y - 5 = 5(x - 5)" },
      { title: "Translate three years from now", detail: "Three years from now, Ram will be three times the son’s future age.", formula: "y + 3 = 3(x + 3)" },
      { title: "Solve the pair", detail: "Rearrange both equations and equate the expressions for y.", formula: "y = 5x - 20,\quad y = 3x + 6\\[4pt]5x - 20 = 3x + 6\\[4pt]x = 13,\quad y = 45" },
    ],
    answer: "Son = 13 years · Ram = 45 years",
    status: "solved",
    visualization: {
      type: "age-timeline",
      columns: ["5 years ago", "NOW", "3 years later"],
      rows: [
        { label: "Ram", values: ["40", "45", "48"] },
        { label: "Son", values: ["8", "13", "16"] },
      ],
    },
  },
  {
    id: "quantitative-02",
    number: 2,
    category: "Heads & Legs",
    difficulty: "Warm-up",
    question: "In a group of goats and peacocks, the number of legs is 14 more than twice the number of heads. The number of cows is:",
    approach: "Model heads and legs with variables. The algebra determines goats, while the wording contains an animal mismatch.",
    steps: [
      { title: "Define the variables", detail: "Let the number of goats be G and the number of peacocks be P." },
      { title: "Count heads and legs", detail: "Each animal contributes one head. A goat has four legs and a peacock has two.", formula: "Heads = G + P\\[4pt]Legs = 4G + 2P" },
      { title: "Use the given relationship", detail: "The leg count is 14 more than twice the head count.", formula: "4G + 2P = 2(G + P) + 14" },
      { title: "Simplify", detail: "The peacock terms cancel, leaving the number of goats.", formula: "4G + 2P = 2G + 2P + 14\\[4pt]2G = 14\\[4pt]G = 7" },
    ],
    answer: "7 goats",
    status: "worksheet-issue",
    importantNote: "The worksheet asks for the number of “cows”, but cows are not included in the described group. The mathematically derivable result is 7 goats.",
    visualization: {
      type: "livestock",
      animals: [
        { label: "Goat", icon: "🐐", legs: 4, variable: "G" },
        { label: "Peacock", icon: "🦚", legs: 2, variable: "P" },
      ],
      equation: "4G + 2P = 2(G + P) + 14  →  G = 7",
    },
  },
  {
    id: "quantitative-03",
    number: 3,
    category: "Finger Counting",
    difficulty: "Warm-up",
    question: "A girl counted in the following way on the fingers of her left hand: She started by calling the thumb 1, the index finger 2, middle finger 3, ring finger 4, little finger 5 and then reversed direction calling the ring finger 6, middle finger 7 and so on. She counted upto 1994. She ended counting on which finger?",
    approach: "Find the repeating eight-position path across the hand and use the remainder after division by 8.",
    steps: [
      { title: "Map one complete cycle", detail: "The count travels from thumb to little finger, then back to the ring finger and middle finger: 1, 2, 3, 4, 5, 6, 7, 8. The next count starts the cycle again at the thumb." },
      { title: "Find the remainder", detail: "Divide the target count by the eight positions in one cycle.", formula: "1994 = 8\\times248 + 2" },
      { title: "Read the second position", detail: "A remainder of 2 lands on the second finger in the cycle: the index finger." },
    ],
    answer: "Index Finger",
    status: "solved",
    visualization: {
      type: "finger-count",
      cycle: "8 positions repeat",
      remainder: "1994 ÷ 8 leaves 2",
      fingers: [
        { name: "Thumb", numbers: ["1", "9"] },
        { name: "Index", numbers: ["2", "8"], highlight: true },
        { name: "Middle", numbers: ["3", "7"] },
        { name: "Ring", numbers: ["4", "6"] },
        { name: "Little", numbers: ["5"] },
      ],
    },
  },
  {
    id: "quantitative-04",
    number: 4,
    category: "Direction & Distance",
    difficulty: "Challenge",
    question: "What is the shortest distance between point S and Q?",
    context: "Directions: A is + from point B means B is North of A. A is = from point B means B is South of A. A is || from point B means A is East of B. A is * from point B means A is West of B. S is =20 m from P. Q is =15 m from R. U is +15 m from V. T is ||20 m from V. U is ||16 m from Q. R is ||30 m from P.",
    approach: "Place the relevant points on a coordinate plane, then use the horizontal and vertical differences between S and Q.",
    steps: [
      { title: "Place the anchor point", detail: "Set P at the origin. S is 20 m South of P and R is 30 m East of P.", formula: "P=(0,0),\quad S=(0,-20),\quad R=(30,0)" },
      { title: "Locate Q", detail: "Q is 15 m South of R, so it keeps R’s x-coordinate and moves 15 m down.", formula: "Q=(30,-15)" },
      { title: "Measure the differences", detail: "From S to Q, move 30 m horizontally and 5 m vertically.", formula: "\\Delta x=30,\quad \\Delta y=5" },
      { title: "Apply Pythagoras", detail: "The shortest route is the hypotenuse of the right triangle S–Q.", formula: "d=\\sqrt{30^2+5^2}=\\sqrt{925}=5\\sqrt{37}\\text{ m}" },
    ],
    answer: "A — 5√37 m",
    status: "solved",
    visualization: {
      type: "direction-coordinate",
      points: [
        { label: "P", x: 0, y: 0, tone: "normal" },
        { label: "S", x: 0, y: -20, tone: "start" },
        { label: "R", x: 30, y: 0, tone: "normal" },
        { label: "Q", x: 30, y: -15, tone: "end" },
      ],
      lines: [
        { from: "S", to: "Q", label: "5√37 m" },
        { from: "S", to: "P", label: "20 m" },
        { from: "P", to: "R", label: "30 m" },
        { from: "R", to: "Q", label: "15 m" },
      ],
      symbols: ["+ North", "= South", "|| East", "* West"].map((meaning) => ({ symbol: meaning.split(" ")[0], meaning: meaning.slice(2) })),
    },
  },
  {
    id: "quantitative-05",
    number: 5,
    category: "Route Comparison",
    difficulty: "Core",
    question: "Five friends Shakshi, Mithu, Mithuni, Deva and Jas are playing Hide and Seek and standing randomly. Mithu is to the northeast of Jas. Deva is 20 m to the east of Jas, who is 60 m to the west of Shakshi. Mithuni is to the northwest of Deva and in the line of Jas and Mithu. Deva is 40 m to the south of Mithu. If Mithu is to look for Shakshi in the game, what distance she saves if she goes to Shakshi straight instead of first going to Deva and then reaching Shakshi?",
    approach: "Use the coordinates implied by Jas, Deva, Shakshi, and Mithu. Compare the direct diagonal route with the two-leg route through Deva.",
    steps: [
      { title: "Set the coordinates", detail: "Put Jas at (0,0). Deva is 20 m East, Shakshi is 60 m East, and Mithu is 40 m North of Deva.", formula: "Jas=(0,0),\quad Deva=(20,0),\quad Shakshi=(60,0),\quad Mithu=(20,40)" },
      { title: "Find the direct distance", detail: "The direct path from Mithu to Shakshi is the hypotenuse of a 40 m by 40 m triangle.", formula: "\\sqrt{40^2+40^2}=40\\sqrt2\\approx56.57\\text{ m}" },
      { title: "Find the route through Deva", detail: "Mithu is 40 m North of Deva, then Deva is 40 m West of Shakshi.", formula: "40+40=80\\text{ m}" },
      { title: "Compare the routes", detail: "Subtract the direct distance from the route through Deva.", formula: "80-56.57\\approx23.43\\text{ m}\\approx23.44\\text{ m}" },
    ],
    answer: "D — 23.44 m approximately",
    status: "solved",
    visualization: {
      type: "route-comparison",
      points: [
        { label: "Jas", x: 0, y: 0, tone: "start" },
        { label: "Deva", x: 20, y: 0 },
        { label: "Shakshi", x: 60, y: 0, tone: "end" },
        { label: "Mithu", x: 20, y: 40, tone: "normal" },
      ],
      direct: ["Mithu", "Shakshi"],
      via: ["Mithu", "Deva", "Shakshi"],
      directDistance: "40√2 ≈ 56.57 m",
      viaDistance: "40 + 40 = 80 m",
      saving: "≈ 23.44 m saved",
    },
  },
  {
    id: "quantitative-06",
    number: 6,
    category: "Handshakes",
    difficulty: "Core",
    question: "In a birthday party, every person shakes hand with every other person. If there was a total of 30 handshakes in the party, how many persons were present in the party?",
    approach: "Every handshake is one unique pair. Use the combinations formula and solve the resulting quadratic.",
    steps: [
      { title: "Count pairs", detail: "For n people, each person can pair with every other person, but each handshake must be counted only once.", formula: "\\frac{n(n-1)}{2}=30" },
      { title: "Clear the denominator", detail: "Multiply both sides by 2.", formula: "n(n-1)=60" },
      { title: "Solve the quadratic", detail: "Factor the equation and choose the positive number of people.", formula: "n^2-n-60=0\\[4pt](n-10)(n+6)=0\\[4pt]n=10" },
      { title: "Choose the positive root", detail: "The negative root cannot represent a number of people, so the worksheet’s intended answer is the positive root.", formula: "(n-10)(n+6)=0\\[4pt]n=10" },
    ],
    answer: "10 persons",
    status: "solved",
    visualization: { type: "handshake", people: 10, formula: "n(n−1)/2" },
  },
  {
    id: "quantitative-07",
    number: 7,
    category: "Number Pattern",
    difficulty: "Warm-up",
    question: "Solve the Number puzzle: Monday = 617, Tuesday = 729, Wednesday = 9312, Thursday = 8412, Friday = 6511, Saturday = 8614. Then, Sunday = ?",
    approach: "Each code combines the number of letters in the day, the day’s position in the week, and their sum.",
    steps: [
      { title: "Discover the three pieces", detail: "Monday has 6 letters, is day 1, and 6+1=7, producing 617. Tuesday has 7 letters, is day 2, and 7+2=9, producing 729." },
      { title: "Verify the pattern", detail: "Wednesday is 9 letters and day 3, so 9+3=12 → 9312. Thursday is 8 letters and day 4, so 8+4=12 → 8412." },
      { title: "Apply it to Sunday", detail: "Sunday has 6 letters and is day 7. Their sum is 13.", formula: "6+7=13\\[4pt]Sunday=6713" },
    ],
    answer: "6713",
    status: "solved",
    visualization: {
      type: "day-pattern",
      rows: [
        { day: "Monday", code: "617", letters: 6, dayNumber: 1, sum: 7 },
        { day: "Tuesday", code: "729", letters: 7, dayNumber: 2, sum: 9 },
        { day: "Wednesday", code: "9312", letters: 9, dayNumber: 3, sum: 12 },
        { day: "Thursday", code: "8412", letters: 8, dayNumber: 4, sum: 12 },
        { day: "Friday", code: "6511", letters: 6, dayNumber: 5, sum: 11 },
        { day: "Saturday", code: "8614", letters: 8, dayNumber: 6, sum: 14 },
        { day: "Sunday", code: "6713", letters: 6, dayNumber: 7, sum: 13 },
      ],
      answer: "6713",
    },
  },
  {
    id: "quantitative-08",
    number: 8,
    category: "Family Ages",
    difficulty: "Warm-up",
    question: "A is 12 years older to B and 9 years younger to C, while B and D are twins. How many years older is C to D?",
    approach: "Express every age relative to B, then use the fact that B and D are the same age.",
    steps: [
      { title: "Start with B and D", detail: "Twins have equal ages, so B and D can share the same base age.", formula: "B=D" },
      { title: "Place A", detail: "A is 12 years older than B.", formula: "A=B+12" },
      { title: "Place C", detail: "A is 9 years younger than C, so C is 9 years older than A.", formula: "C=A+9=B+12+9=B+21" },
      { title: "Compare C and D", detail: "Since B=D, C is 21 years older than D." },
    ],
    answer: "C is 21 years older than D",
    status: "solved",
    visualization: {
      type: "age-chain",
      nodes: [
        { label: "B", value: "base", tone: "base" },
        { label: "A", value: "B + 12", tone: "plus" },
        { label: "C", value: "B + 21", tone: "answer" },
        { label: "D", value: "= B", tone: "base" },
      ],
      connectors: ["+12 years", "+9 years", "twins → same base"],
    },
  },
  {
    id: "quantitative-09",
    number: 9,
    category: "Page Digits",
    difficulty: "Core",
    question: "The total number of digits used in numbering the pages of a book having 499 pages is.",
    approach: "Break the page numbers into one-digit, two-digit, and three-digit blocks.",
    steps: [
      { title: "Pages 1–9", detail: "There are 9 one-digit page numbers.", formula: "9\\times1=9" },
      { title: "Pages 10–99", detail: "There are 90 two-digit page numbers.", formula: "90\\times2=180" },
      { title: "Pages 100–499", detail: "There are 400 three-digit page numbers.", formula: "400\\times3=1200" },
      { title: "Add the blocks", detail: "Sum all digits used in the three ranges.", formula: "9+180+1200=1389" },
    ],
    answer: "1389 digits",
    status: "solved",
    visualization: {
      type: "page-digits",
      rows: [
        { pages: "1–9", count: "9 × 1", digits: "9" },
        { pages: "10–99", count: "90 × 2", digits: "180" },
        { pages: "100–499", count: "400 × 3", digits: "1200" },
      ],
      total: "1389",
    },
  },
  {
    id: "quantitative-10",
    number: 10,
    category: "Star Puzzle",
    difficulty: "Challenge",
    question: "Which number replaces the question mark in the star puzzle?",
    context: "The worksheet shows three five-point stars: Star 1 has top 3, left 2, right 8, centre 10, bottom-left 4, bottom-right 1. Star 2 has top 2, left 5, right 6, centre 6, bottom-left 7, bottom-right 10. Star 3 has top 11, left 9, right 4, centre ?, bottom-left 2, bottom-right 3.",
    approach: "Compare the two completed stars, but do not force a rule from only two examples.",
    steps: [
      { title: "Inspect the completed examples", detail: "The first two stars provide two input/output examples, but no rule or instruction says how the six outer numbers should combine." },
      { title: "Test the limitation", detail: "Many different formulas can be made to fit two completed stars and produce different centre values for the third." },
      { title: "Keep the answer honest", detail: "Without another example or a stated operation, the missing value cannot be uniquely determined." },
    ],
    status: "ambiguous",
    importantNote: "Multiple mathematical rules can be constructed from only two examples, so the missing value cannot be determined uniquely from the supplied worksheet.",
    visualization: {
      type: "star-puzzle",
      stars: [
        { top: 3, left: 2, right: 8, center: "10", bottomLeft: 4, bottomRight: 1 },
        { top: 2, left: 5, right: 6, center: "6", bottomLeft: 7, bottomRight: 10 },
        { top: 11, left: 9, right: 4, center: "?", bottomLeft: 2, bottomRight: 3 },
      ],
    },
  },
  {
    id: "quantitative-11",
    number: 11,
    category: "Odd One Out",
    difficulty: "Warm-up",
    question: "Find the odd one out N, L, J, H, G.",
    approach: "Convert letters to alphabet positions and extend the descending even-number pattern.",
    steps: [
      { title: "Convert to positions", detail: "N, L, J, and H correspond to 14, 12, 10, and 8." },
      { title: "Continue the pattern", detail: "The positions decrease by 2 each time, so the next expected position is 6, which is F.", formula: "14\\to12\\to10\\to8\\to6" },
      { title: "Identify the break", detail: "G is position 7, not position 6, so G breaks the pattern." },
    ],
    answer: "G",
    status: "solved",
    visualization: {
      type: "odd-letter",
      rule: "Subtract 2 each time",
      letters: [
        { letter: "N", position: 14 },
        { letter: "L", position: 12 },
        { letter: "J", position: 10 },
        { letter: "H", position: 8 },
        { letter: "G", position: 7, expected: 6, isOdd: true },
      ],
    },
  },
  {
    id: "quantitative-12",
    number: 12,
    category: "Wrong Term",
    difficulty: "Challenge",
    question: "Find out the wrong term in the given series of numbers? 6, 15, 35, 77, 179, 221",
    approach: "Apply the visible ×2 plus consecutive odd number rule, then check every later term instead of stopping at the first mismatch.",
    steps: [
      { title: "Read the intended pattern", detail: "The first steps use ×2 plus increasing odd numbers.", formula: "6\\times2+3=15\\[4pt]15\\times2+5=35\\[4pt]35\\times2+7=77" },
      { title: "Predict the next term", detail: "The next addition should be 9.", formula: "77\\times2+9=163" },
      { title: "Compare with the worksheet", detail: "The worksheet gives 179 instead of 163, so 179 appears to be the intended wrong term." },
      { title: "Check what follows", detail: "221 also does not continue the stated rule, so the series contains an additional error and cannot be repaired uniquely." },
    ],
    answer: "179 appears to be the intended wrong term, but the series is inconsistent",
    status: "worksheet-issue",
    importantNote: "The apparent rule predicts 163 after 77, not 179. The following 221 also fails to continue that rule, so the worksheet likely contains more than one error.",
    visualization: { type: "wrong-term", terms: ["6", "15", "35", "77", "179", "221"], expected: "163", brokenAt: 4, note: "179 breaks first; 221 also remains unexplained." },
  },
  {
    id: "quantitative-13",
    number: 13,
    category: "Average Temperature",
    difficulty: "Core",
    question: "The average temperature for Monday, Tuesday, Wednesday and Thursday was 48 degrees and for Tuesday, Wednesday, Thursday and Friday was 46 degrees. If the temperature on Monday was 42 degrees. Find the temperature on Friday?",
    approach: "Write the totals for the two overlapping four-day groups. The shared Tuesday–Thursday total cancels.",
    steps: [
      { title: "Find the first four-day total", detail: "Monday through Thursday average 48 degrees, so their total is 192.", formula: "48\\times4=192" },
      { title: "Remove Monday", detail: "Monday is 42 degrees, leaving the shared Tuesday–Thursday total.", formula: "Tue+Wed+Thu=192-42=150" },
      { title: "Find the second four-day total", detail: "Tuesday through Friday average 46 degrees, so their total is 184.", formula: "46\\times4=184" },
      { title: "Solve for Friday", detail: "Add Friday to the shared total and isolate it.", formula: "150+Friday=184\\[4pt]Friday=34^\\circ C" },
    ],
    answer: "34°C",
    status: "solved",
    visualization: {
      type: "temperature",
      first: [{ label: "Mon", value: "42°" }, { label: "Tue", value: "?" }, { label: "Wed", value: "?" }, { label: "Thu", value: "?" }],
      second: [{ label: "Tue", value: "?" }, { label: "Wed", value: "?" }, { label: "Thu", value: "?" }, { label: "Fri", value: "34°" }],
      result: "Tue + Wed + Thu = 150°",
    },
  },
  {
    id: "quantitative-14",
    number: 14,
    category: "Wrong Number",
    difficulty: "Challenge",
    question: "Find out the wrong number in the series. 7, 8, 18, 57, 219, 1165, 6996.",
    approach: "The multiplier increases by one and the added number matches that multiplier: ×1+1, ×2+2, ×3+3, and so on.",
    steps: [
      { title: "Verify the opening terms", detail: "The first three transitions follow the same growing operation.", formula: "7\\times1+1=8\\[4pt]8\\times2+2=18\\[4pt]18\\times3+3=57" },
      { title: "Correct the next term", detail: "The fourth step should use ×4+4.", formula: "57\\times4+4=232" },
      { title: "Verify the remaining terms", detail: "Once 232 is restored, the last two terms fit exactly.", formula: "232\\times5+5=1165\\[4pt]1165\\times6+6=6996" },
      { title: "Identify the worksheet error", detail: "219 is printed where 232 is required." },
    ],
    answer: "219 is the wrong number; it should be 232",
    status: "worksheet-issue",
    importantNote: "The worksheet’s answer is the incorrect printed term 219. The corrected sequence uses 232 in its place.",
    visualization: { type: "wrong-number", terms: ["7", "8", "18", "57", "219", "1165", "6996"], expected: "232", brokenAt: 5, note: "219 should be 232" },
  },
  {
    id: "quantitative-15",
    number: 15,
    category: "Letter Puzzle",
    difficulty: "Core",
    question: "Which letter replaces the question mark in the 3×3 hexagonal letter grid?",
    context: "The worksheet grid is: E M H / N O A / I ? D.",
    approach: "Convert each row to alphabet positions. The row totals increase by 4.",
    steps: [
      { title: "Convert row one", detail: "E, M, H correspond to 5, 13, and 8.", formula: "5+13+8=26" },
      { title: "Convert row two", detail: "N, O, A correspond to 14, 15, and 1.", formula: "14+15+1=30" },
      { title: "Predict row three", detail: "The next row total should be 34.", formula: "30+4=34" },
      { title: "Solve the missing position", detail: "I is 9 and D is 4, so the missing letter has position 21: U.", formula: "9+?+4=34\\[4pt]?=21\\[4pt]21^{st}\\text{ letter}=U" },
    ],
    answer: "U",
    status: "solved",
    visualization: {
      type: "letter-grid",
      cells: [
        [{ value: "E", position: 5 }, { value: "M", position: 13 }, { value: "H", position: 8 }],
        [{ value: "N", position: 14 }, { value: "O", position: 15 }, { value: "A", position: 1 }],
        [{ value: "I", position: 9 }, { value: "?", position: 0, tone: "missing" }, { value: "D", position: 4 }],
      ],
      rowSums: ["26", "30", "34"],
      answer: "U",
    },
  },
  {
    id: "quantitative-16",
    number: 16,
    category: "Number Pyramid",
    difficulty: "Core",
    question: "Which number replaces the question mark in the number pyramid?",
    context: "The worksheet pyramid is: 9 / 4 3 / 1 8 1 / 2 1 7 ?.",
    approach: "Add down each diagonal column. The column totals decrease by four each time.",
    steps: [
      { title: "Add the first column", detail: "The leftmost diagonal totals 16.", formula: "9+4+1+2=16" },
      { title: "Add the next columns", detail: "The next two totals are 12 and 8.", formula: "3+8+1=12\\[4pt]1+7=8" },
      { title: "Continue the pattern", detail: "The totals are 16, 12, 8, so the last total must be 4.", formula: "16,\\ 12,\\ 8,\\ 4" },
      { title: "Reveal the missing number", detail: "The last column contains only the missing value, so it must be 4." },
    ],
    answer: "4",
    status: "solved",
    visualization: {
      type: "number-pyramid",
      rows: [["9"], ["4", "3"], ["1", "8", "1"], ["2", "1", "7", "?"]],
      totals: ["16", "12", "8", "4"],
      answer: "4",
    },
  },
];

const quantitativeWorksheetQuestions = quantitativeQuestions.map((question) => ({
  ...question,
  worksheetId: "quantitative" as const,
  worksheetTotal: quantitativeQuestions.length,
}));

const logicalWorksheetQuestions: Question[] = logicalWorksheetSections.flatMap((section) =>
  section.questions.map((question, index) => ({
    id: `logical-${question.id}`,
    worksheetId: "logical" as const,
    section: section.name,
    subNumber: question.number,
    worksheetTotal: logicalWorksheetSections.reduce((total, item) => total + item.questions.length, 0),
    number: logicalWorksheetSections.slice(0, section.number - 1).reduce((total, item) => total + item.questions.length, 0) + index + 1,
    category: section.name,
    difficulty: question.difficulty,
    question: question.question,
    options: question.options,
    correctOptions: question.correctOptions,
    context: [...(section.context ?? []), ...(question.context ?? [])].join(" · ") || undefined,
    approach: question.concept,
    steps: question.explanation.map((detail, stepIndex) => ({
      title: `Reasoning step ${stepIndex + 1}`,
      detail,
    })),
    answer: question.answer,
    status: question.status,
    importantNote: question.statusNote,
    visualization: { type: "legacy" as const, visualization: question.visualization! },
  })),
);

export const worksheetQuestions = quantitativeWorksheetQuestions;
export const totalQuestions = quantitativeWorksheetQuestions.length;
export const allWorksheetQuestions = [...quantitativeWorksheetQuestions, ...logicalWorksheetQuestions];

export type WorksheetDefinition = {
  id: WorksheetId;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  questions: Question[];
};

export const worksheetDefinitions: WorksheetDefinition[] = [
  {
    id: "quantitative",
    name: "Quantitative Aptitude & Logical Reasoning",
    shortName: "Quantitative",
    subtitle: "16 problems · formulas, patterns & visual explanations",
    description: "Work through ages, directions, averages, number patterns, and puzzles with guided solutions.",
    questions: quantitativeWorksheetQuestions,
  },
  {
    id: "logical",
    name: "Logical Reasoning Worksheet",
    shortName: "Logical Reasoning",
    subtitle: "35 problems · relationships, arrangements & coding",
    description: "Explore direction sense, blood relationships, seating arrangements, series, and coding puzzles.",
    questions: logicalWorksheetQuestions,
  },
];

export const worksheetMap = Object.fromEntries(worksheetDefinitions.map((worksheet) => [worksheet.id, worksheet])) as Record<WorksheetId, WorksheetDefinition>;

export function getQuestion(questionId: string) {
  return allWorksheetQuestions.find((question) => question.id === questionId);
}

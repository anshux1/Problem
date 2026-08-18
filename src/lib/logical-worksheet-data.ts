export type QuestionStatus =
  | "solved"
  | "ambiguous"
  | "insufficient-information"
  | "worksheet-issue";

export type Option = {
  label: string;
  text: string;
};

export type Difficulty = "Warm-up" | "Core" | "Challenge";

export type DirectionStep = {
  direction: "North" | "South" | "East" | "West";
  distance?: string;
  dx: number;
  dy: number;
};

export type DirectionVisualization = {
  type: "direction";
  mode: "path" | "turns" | "compass";
  steps?: DirectionStep[];
  initial?: string;
  turns?: { label: string; result: string }[];
  finalDirection: string;
  caption: string;
};

export type FamilyNode = {
  id: string;
  label: string;
  gender: "male" | "female" | "person";
  x: number;
  y: number;
  highlight?: boolean;
};

export type FamilyVisualization = {
  type: "family";
  nodes: FamilyNode[];
  edges: { from: string; to: string }[];
  relationship: string;
  caption: string;
};

export type SeatingVisualization = {
  type: "seating";
  arrangements: string[][];
  constraints: string[];
  solverSteps: string[];
  focus?: string[];
  caption: string;
};

export type NumberVisualization =
  | {
      type: "number";
      mode: "recurrence";
      terms: string[];
      operators: string[];
      rule: string;
      caption: string;
    }
  | {
      type: "number";
      mode: "products";
      products: { left: number; right: number; result: number }[];
      rule: string;
      caption: string;
    }
  | {
      type: "number";
      mode: "odd-one-out";
      values: { value: number; isOdd: boolean }[];
      rule: string;
      caption: string;
    }
  | {
      type: "number";
      mode: "formula";
      equation: string[];
      rule: string;
      caption: string;
    }
  | {
      type: "number";
      mode: "cubes";
      values: { input: number; output: number }[];
      rule: string;
      caption: string;
    };

export type OrderingVisualization = {
  type: "ordering";
  order: string[];
  relation: string;
  scores?: { label: string; value: string }[];
  conclusion: string;
  caption: string;
};

export type SeriesVisualization =
  | {
      type: "series";
      mode: "alphabet";
      terms: string[];
      positions: number[];
      differences: string[];
      caption: string;
    }
  | {
      type: "series";
      mode: "pairs";
      terms: string[];
      caption: string;
    }
  | {
      type: "series";
      mode: "number-letter";
      terms: string[];
      caption: string;
    }
  | {
      type: "series";
      mode: "quadratic";
      terms: string[];
      positions: number[];
      differences: string[];
      caption: string;
    };

export type CodingVisualization =
  | {
      type: "coding";
      mode: "shift";
      source: string;
      coded: string;
      target: string;
      targetCoded: string;
      caption: string;
    }
  | {
      type: "coding";
      mode: "insufficient";
      source: string;
      coded: string;
      target: string;
      caption: string;
    }
  | {
      type: "coding";
      mode: "letter-sum";
      word: string;
      values: number[];
      total: number;
      target: string;
      targetValues: number[];
      targetTotal: number;
      caption: string;
    }
  | {
      type: "coding";
      mode: "word-map";
      mappings: { word: string; code: string }[];
      answer: string;
      caption: string;
    }
  | {
      type: "coding";
      mode: "reverse";
      source: string;
      coded: string;
      target: string;
      answer: string;
      caption: string;
    };

export type Visualization =
  | DirectionVisualization
  | FamilyVisualization
  | SeatingVisualization
  | NumberVisualization
  | OrderingVisualization
  | SeriesVisualization
  | CodingVisualization;

export type Question = {
  id: string;
  sectionId: string;
  number: number;
  question: string;
  options: Option[];
  correctOptions?: string[];
  answer?: string;
  status: QuestionStatus;
  statusNote?: string;
  difficulty: Difficulty;
  concept: string;
  explanation: string[];
  context?: string[];
  visualization?: Visualization;
};

export type WorksheetSection = {
  id: string;
  number: number;
  name: string;
  shortName: string;
  description: string;
  icon: "compass" | "users" | "seats" | "numbers" | "logic" | "series" | "code";
  questions: Question[];
  context?: string[];
};

const seatingArrangements = [
  ["A", "B", "C", "E", "F", "D"],
  ["D", "A", "B", "C", "E", "F"],
];

const seatingConstraints = [
  "Six students A, B, C, D, E and F are sitting in a row facing north",
  "A is second to the left of C",
  "B sits immediately to the right of A",
  "D sits at one of the ends",
  "E sits immediately to the left of F",
  "C is not at an end",
];

const logicalConstraints = [
  "Five students A, B, C, D and E scored different marks",
  "A scored more than B but less than C",
  "D scored less than B",
  "E scored more than C",
];

const directionSteps = {
  q1: [
    { direction: "North" as const, distance: "8 km", dx: 0, dy: 8 },
    { direction: "East" as const, distance: "6 km", dx: 6, dy: 0 },
    { direction: "South" as const, distance: "8 km", dx: 0, dy: -8 },
  ],
  q2: [
    { direction: "South" as const, distance: "10 m", dx: 0, dy: -10 },
    { direction: "East" as const, distance: "15 m", dx: 15, dy: 0 },
    { direction: "North" as const, distance: "10 m", dx: 0, dy: 10 },
  ],
  q4: [
    { direction: "East" as const, distance: "20 m", dx: 20, dy: 0 },
    { direction: "North" as const, distance: "15 m", dx: 0, dy: 15 },
    { direction: "West" as const, distance: "20 m", dx: -20, dy: 0 },
  ],
};

export const worksheetSections: WorksheetSection[] = [
  {
    id: "direction",
    number: 1,
    name: "Direction Sense",
    shortName: "Direction",
    description: "Trace movement, turns, and net displacement on a compass.",
    icon: "compass",
    questions: [
      {
        id: "direction-1",
        sectionId: "direction",
        number: 1,
        question:
          "Ravi walks 8 km north, then turns right and walks 6 km. He then turns right and walks 8 km. How far is he from his starting point?",
        options: [
          { label: "A", text: "2 km" },
          { label: "B", text: "6 km" },
          { label: "C", text: "8 km" },
          { label: "D", text: "14 km" },
        ],
        correctOptions: ["B"],
        answer: "6 km East",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Net displacement",
        explanation: [
          "Ravi first moves 8 km North.",
          "A right turn from North points East, so he walks 6 km East.",
          "The next right turn points South, so he walks 8 km South.",
          "The 8 km North and 8 km South movements cancel each other out.",
          "Only the 6 km East movement remains from the starting point.",
        ],
        visualization: {
          type: "direction",
          mode: "path",
          steps: directionSteps.q1,
          finalDirection: "6 km East",
          caption: "The vertical legs cancel; the endpoint is six kilometres to the East.",
        },
      },
      {
        id: "direction-2",
        sectionId: "direction",
        number: 2,
        question:
          "A person walks 10 m south, turns left and walks 15 m, then turns left and walks 10 m. In which direction is he from his starting point?",
        options: [
          { label: "A", text: "North" },
          { label: "B", text: "East" },
          { label: "C", text: "West" },
          { label: "D", text: "South" },
        ],
        correctOptions: ["B"],
        answer: "East",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Turning relative to facing direction",
        explanation: [
          "The first 10 m takes the person South.",
          "When facing South, a left turn points East; the person then walks 15 m East.",
          "A second left turn points North, followed by 10 m North.",
          "South and North cancel, leaving the person East of the start.",
        ],
        visualization: {
          type: "direction",
          mode: "path",
          steps: directionSteps.q2,
          finalDirection: "East",
          caption: "Equal South and North legs cancel, leaving a 15 m East displacement.",
        },
      },
      {
        id: "direction-3",
        sectionId: "direction",
        number: 3,
        question:
          "Priya is facing east. She turns 90° clockwise, then 180° anticlockwise. Which direction is she facing now?",
        options: [
          { label: "A", text: "East" },
          { label: "B", text: "North" },
          { label: "C", text: "South" },
          { label: "D", text: "West" },
        ],
        correctOptions: ["B"],
        answer: "North",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Angular direction changes",
        explanation: [
          "Priya starts facing East.",
          "A 90° clockwise turn from East points South.",
          "A 180° anticlockwise turn from South points North.",
        ],
        visualization: {
          type: "direction",
          mode: "turns",
          initial: "East",
          turns: [
            { label: "90° clockwise", result: "South" },
            { label: "180° anticlockwise", result: "North" },
          ],
          finalDirection: "North",
          caption: "Follow the orientation after each turn rather than treating turns as distances.",
        },
      },
      {
        id: "direction-4",
        sectionId: "direction",
        number: 4,
        question:
          "Arun is facing north. He turns right, walks 20 m, turns left, walks 15 m, and then turns left and walks 20 m. How far and in which direction is he from his starting point?",
        options: [
          { label: "A", text: "15 m North" },
          { label: "B", text: "15 m South" },
          { label: "C", text: "20 m East" },
          { label: "D", text: "20 m West" },
        ],
        correctOptions: ["A"],
        answer: "15 m North",
        status: "solved",
        difficulty: "Core",
        concept: "Cancellation of horizontal movement",
        explanation: [
          "Facing North, Arun turns right and walks 20 m East.",
          "A left turn from East points North; he walks 15 m North.",
          "Another left turn points West; he walks 20 m West.",
          "The 20 m East and 20 m West legs cancel.",
          "The remaining displacement is 15 m North.",
        ],
        visualization: {
          type: "direction",
          mode: "path",
          steps: directionSteps.q4,
          finalDirection: "15 m North",
          caption: "The route returns to the original vertical line, fifteen metres North of the start.",
        },
      },
      {
        id: "direction-5",
        sectionId: "direction",
        number: 5,
        question:
          "If the sun is setting directly in front of a person, which direction is the person facing?",
        options: [
          { label: "A", text: "East" },
          { label: "B", text: "West" },
          { label: "C", text: "North" },
          { label: "D", text: "South" },
        ],
        correctOptions: ["B"],
        answer: "West",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Natural direction cues",
        explanation: ["The sun sets in the West.", "If sunset is directly in front of the person, the person is facing West."],
        visualization: {
          type: "direction",
          mode: "compass",
          finalDirection: "West",
          caption: "Sunset is the natural clue: West is directly ahead.",
        },
      },
    ],
  },
  {
    id: "blood",
    number: 2,
    name: "Blood Relationship",
    shortName: "Relationships",
    description: "Translate family-language clues into a clear relationship tree.",
    icon: "users",
    questions: [
      {
        id: "blood-1",
        sectionId: "blood",
        number: 1,
        question:
          'Pointing to a woman, Raj said, "She is the daughter of the only son of my grandfather." How is the woman related to Raj?',
        options: [
          { label: "A", text: "Sister" },
          { label: "B", text: "Cousin" },
          { label: "C", text: "Aunt" },
          { label: "D", text: "Daughter" },
        ],
        correctOptions: ["A"],
        answer: "Sister",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Parent-child links",
        explanation: [
          "The only son of Raj's grandfather is Raj's father.",
          "The woman is the daughter of Raj's father.",
          "A daughter of the same father is Raj's sister.",
        ],
        visualization: {
          type: "family",
          nodes: [
            { id: "grandfather", label: "Grandfather", gender: "male", x: 50, y: 14 },
            { id: "father", label: "Father", gender: "male", x: 50, y: 46 },
            { id: "raj", label: "Raj", gender: "male", x: 27, y: 80, highlight: true },
            { id: "woman", label: "Woman", gender: "female", x: 73, y: 80, highlight: true },
          ],
          edges: [
            { from: "grandfather", to: "father" },
            { from: "father", to: "raj" },
            { from: "father", to: "woman" },
          ],
          relationship: "Woman = Raj's sister",
          caption: "The shared parent makes Raj and the woman siblings.",
        },
      },
      {
        id: "blood-2",
        sectionId: "blood",
        number: 2,
        question: "A is the brother of B. B is the mother of C. How is A related to C?",
        options: [
          { label: "A", text: "Father" },
          { label: "B", text: "Uncle" },
          { label: "C", text: "Brother" },
          { label: "D", text: "Grandfather" },
        ],
        correctOptions: ["B"],
        answer: "Uncle",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Sibling-to-child relationship",
        explanation: [
          "A and B are siblings because A is B's brother.",
          "B is C's mother.",
          "A is therefore the brother of C's mother: C's uncle.",
        ],
        visualization: {
          type: "family",
          nodes: [
            { id: "a", label: "A", gender: "male", x: 27, y: 30, highlight: true },
            { id: "b", label: "B", gender: "female", x: 63, y: 30 },
            { id: "c", label: "C", gender: "person", x: 63, y: 76, highlight: true },
          ],
          edges: [
            { from: "a", to: "b" },
            { from: "b", to: "c" },
          ],
          relationship: "A = C's uncle",
          caption: "A is the maternal uncle: the brother of C's mother.",
        },
      },
      {
        id: "blood-3",
        sectionId: "blood",
        number: 3,
        question: "P is the father of Q. R is the mother of P. S is the brother of Q. How is R related to S?",
        options: [
          { label: "A", text: "Mother" },
          { label: "B", text: "Grandmother" },
          { label: "C", text: "Aunt" },
          { label: "D", text: "Sister" },
        ],
        correctOptions: ["B"],
        answer: "Grandmother",
        status: "solved",
        difficulty: "Core",
        concept: "Two-generation links",
        explanation: [
          "R is the mother of P.",
          "P is the father of Q, so R is Q's grandmother.",
          "S is Q's brother, so R is S's grandmother too.",
        ],
        visualization: {
          type: "family",
          nodes: [
            { id: "r", label: "R", gender: "female", x: 50, y: 14, highlight: true },
            { id: "p", label: "P", gender: "male", x: 50, y: 47 },
            { id: "q", label: "Q", gender: "person", x: 28, y: 80 },
            { id: "s", label: "S", gender: "male", x: 72, y: 80, highlight: true },
          ],
          edges: [
            { from: "r", to: "p" },
            { from: "p", to: "q" },
            { from: "p", to: "s" },
          ],
          relationship: "R = S's grandmother",
          caption: "Move down two generations from R to reach S.",
        },
      },
      {
        id: "blood-4",
        sectionId: "blood",
        number: 4,
        question: 'A man introduces a woman as "the daughter of the sister of my father." How is the woman related to the man?',
        options: [
          { label: "A", text: "Sister" },
          { label: "B", text: "Cousin" },
          { label: "C", text: "Aunt" },
          { label: "D", text: "Niece" },
        ],
        correctOptions: ["B"],
        answer: "Cousin",
        status: "solved",
        difficulty: "Core",
        concept: "Aunt's child",
        explanation: [
          "The sister of the man's father is his aunt.",
          "The woman's mother is that aunt.",
          "A daughter of an aunt is the man's cousin.",
        ],
        visualization: {
          type: "family",
          nodes: [
            { id: "father", label: "Father", gender: "male", x: 50, y: 15 },
            { id: "man", label: "Man", gender: "male", x: 25, y: 48, highlight: true },
            { id: "sister", label: "Father's sister", gender: "female", x: 72, y: 48 },
            { id: "woman", label: "Woman", gender: "female", x: 72, y: 81, highlight: true },
          ],
          edges: [
            { from: "father", to: "man" },
            { from: "father", to: "sister" },
            { from: "sister", to: "woman" },
          ],
          relationship: "Woman = Man's cousin",
          caption: "A parent's sibling's child is a cousin.",
        },
      },
      {
        id: "blood-5",
        sectionId: "blood",
        number: 5,
        question: "M is the brother of N. N is the sister of O. O is the father of P. How is M related to P?",
        options: [
          { label: "A", text: "Father" },
          { label: "B", text: "Uncle" },
          { label: "C", text: "Grandfather" },
          { label: "D", text: "Brother" },
        ],
        correctOptions: ["B"],
        answer: "Uncle",
        status: "solved",
        difficulty: "Core",
        concept: "Sibling of a parent",
        explanation: [
          "M and N are siblings.",
          "N and O are siblings, so M is also O's brother.",
          "O is P's father; the father's brother is P's uncle.",
        ],
        visualization: {
          type: "family",
          nodes: [
            { id: "m", label: "M", gender: "male", x: 25, y: 25, highlight: true },
            { id: "n", label: "N", gender: "female", x: 50, y: 25 },
            { id: "o", label: "O", gender: "male", x: 75, y: 25 },
            { id: "p", label: "P", gender: "person", x: 75, y: 76, highlight: true },
          ],
          edges: [
            { from: "m", to: "n" },
            { from: "n", to: "o" },
            { from: "o", to: "p" },
          ],
          relationship: "M = P's uncle",
          caption: "M is the brother of P's father.",
        },
      },
    ],
  },
  {
    id: "seating",
    number: 3,
    name: "Seating Arrangement",
    shortName: "Seating",
    description: "Solve row constraints, then compare every arrangement the clues allow.",
    icon: "seats",
    context: seatingConstraints,
    questions: [
      {
        id: "seating-1",
        sectionId: "seating",
        number: 1,
        question: "Who sits at the extreme left?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "B" },
          { label: "C", text: "D" },
          { label: "D", text: "E" },
        ],
        answer: "A or D",
        status: "ambiguous",
        statusNote: "Both A B C E F D and D A B C E F satisfy the worksheet's conditions.",
        difficulty: "Challenge",
        concept: "Constraint comparison",
        explanation: [
          "A must be two places to the left of C, and B must immediately follow A. This creates the block A–B–C.",
          "E immediately left of F creates the block E–F.",
          "Placing D at the right end gives A B C E F D.",
          "Placing D at the left end gives D A B C E F.",
          "The extreme-left person is therefore not unique: it can be A or D.",
        ],
        visualization: {
          type: "seating",
          arrangements: seatingArrangements,
          constraints: seatingConstraints,
          solverSteps: ["Build A–B–C", "Build E–F", "Place D at an end", "Compare both valid rows"],
          focus: ["A", "D"],
          caption: "Two valid rows remain, so the worksheet cannot identify one extreme-left person.",
        },
      },
      {
        id: "seating-2",
        sectionId: "seating",
        number: 2,
        question: "Who sits immediately to the right of C?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "B" },
          { label: "C", text: "E" },
          { label: "D", text: "F" },
        ],
        correctOptions: ["C"],
        answer: "E",
        status: "solved",
        difficulty: "Core",
        concept: "Relative position",
        explanation: [
          "The A–B–C block is fixed by the first two clues.",
          "The remaining E–F block must sit to the right of C in either valid arrangement.",
          "Therefore E is immediately right of C in both rows.",
        ],
        visualization: {
          type: "seating",
          arrangements: seatingArrangements,
          constraints: seatingConstraints,
          solverSteps: ["Fix A–B–C", "Place E–F after C", "Verify in both rows"],
          focus: ["C", "E"],
          caption: "E follows C in every valid arrangement.",
        },
      },
      {
        id: "seating-3",
        sectionId: "seating",
        number: 3,
        question: "Which pair occupies the two extreme positions?",
        options: [
          { label: "A", text: "A and D" },
          { label: "B", text: "D and F" },
          { label: "C", text: "B and E" },
          { label: "D", text: "A and F" },
        ],
        answer: "A and D, or D and F",
        status: "ambiguous",
        statusNote: "The valid rows produce two different extreme pairs: A and D, or D and F.",
        difficulty: "Challenge",
        concept: "Testing all valid permutations",
        explanation: [
          "The same two valid arrangements must be checked rather than choosing the first one found.",
          "A B C E F D has extremes A and D.",
          "D A B C E F has extremes D and F.",
          "Because both rows satisfy every clue, no single option is guaranteed.",
        ],
        visualization: {
          type: "seating",
          arrangements: seatingArrangements,
          constraints: seatingConstraints,
          solverSteps: ["Generate row 1", "Generate row 2", "Read both extremes", "Notice the conflict"],
          focus: ["A", "D", "F"],
          caption: "The extreme pair changes when D moves to the other end.",
        },
      },
      {
        id: "seating-4",
        sectionId: "seating",
        number: 4,
        question: "Who sits between B and C?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "D" },
          { label: "C", text: "E" },
          { label: "D", text: "F" },
        ],
        answer: "No one — B and C are adjacent",
        status: "ambiguous",
        statusNote: "The worksheet offers no 'no one' option. B is immediately next to C, so there is no person between them.",
        difficulty: "Challenge",
        concept: "Adjacency",
        explanation: [
          "A is second to the left of C, so A–_–C is the initial spacing.",
          "B immediately right of A fills that middle position: A–B–C.",
          "B and C therefore sit next to each other.",
          "No person sits between adjacent seats, so none of the listed options is valid.",
        ],
        visualization: {
          type: "seating",
          arrangements: seatingArrangements,
          constraints: seatingConstraints,
          solverSteps: ["A is two places left of C", "B fills the middle seat", "A–B–C becomes adjacent", "No one can sit between B and C"],
          focus: ["B", "C"],
          caption: "B and C touch in both rows; the correct response is not represented in the options.",
        },
      },
      {
        id: "seating-5",
        sectionId: "seating",
        number: 5,
        question: "What is the position of E with respect to C?",
        options: [
          { label: "A", text: "Immediately right" },
          { label: "B", text: "Immediately left" },
          { label: "C", text: "Second right" },
          { label: "D", text: "Second left" },
        ],
        correctOptions: ["A"],
        answer: "Immediately right",
        status: "solved",
        difficulty: "Core",
        concept: "Relative position",
        explanation: [
          "The valid rows are A B C E F D and D A B C E F.",
          "In each row, E is the next seat after C.",
          "E is immediately right of C.",
        ],
        visualization: {
          type: "seating",
          arrangements: seatingArrangements,
          constraints: seatingConstraints,
          solverSteps: ["Keep the A–B–C block", "Attach E–F after C", "Compare both valid rows"],
          focus: ["C", "E"],
          caption: "The C → E relationship stays fixed even though the whole row can shift.",
        },
      },
    ],
  },
  {
    id: "numbers",
    number: 4,
    name: "Number Puzzles",
    shortName: "Numbers",
    description: "Spot recurrences, products, powers, and the odd pattern out.",
    icon: "numbers",
    questions: [
      {
        id: "numbers-1",
        sectionId: "numbers",
        number: 1,
        question: "Find the missing number: 3, 7, 15, 31, 63, ?",
        options: [
          { label: "A", text: "95" },
          { label: "B", text: "127" },
          { label: "C", text: "128" },
          { label: "D", text: "126" },
        ],
        correctOptions: ["B"],
        answer: "127",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Multiplicative recurrence",
        explanation: [
          "Each term is multiplied by 2, then increased by 1.",
          "3 × 2 + 1 = 7, and the same rule continues through 63.",
          "63 × 2 + 1 = 127.",
        ],
        visualization: {
          type: "number",
          mode: "recurrence",
          terms: ["3", "7", "15", "31", "63", "127"],
          operators: ["×2 + 1", "×2 + 1", "×2 + 1", "×2 + 1", "×2 + 1"],
          rule: "× 2 + 1",
          caption: "The same small operation repeats at every step.",
        },
      },
      {
        id: "numbers-2",
        sectionId: "numbers",
        number: 2,
        question: "2, 6, 12, 20, 30, ?",
        options: [
          { label: "A", text: "40" },
          { label: "B", text: "42" },
          { label: "C", text: "44" },
          { label: "D", text: "46" },
        ],
        correctOptions: ["B"],
        answer: "42",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Consecutive products",
        explanation: [
          "The sequence is formed by multiplying consecutive integers: 1×2, 2×3, 3×4, and so on.",
          "The next product is 6×7.",
          "6×7 = 42.",
        ],
        visualization: {
          type: "number",
          mode: "products",
          products: [
            { left: 1, right: 2, result: 2 },
            { left: 2, right: 3, result: 6 },
            { left: 3, right: 4, result: 12 },
            { left: 4, right: 5, result: 20 },
            { left: 5, right: 6, result: 30 },
            { left: 6, right: 7, result: 42 },
          ],
          rule: "n × (n + 1)",
          caption: "Read each number as a product of consecutive integers.",
        },
      },
      {
        id: "numbers-3",
        sectionId: "numbers",
        number: 3,
        question: "Find the odd number out: 16, 25, 36, 63",
        options: [
          { label: "A", text: "16" },
          { label: "B", text: "25" },
          { label: "C", text: "36" },
          { label: "D", text: "63" },
        ],
        correctOptions: ["D"],
        answer: "63",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Perfect squares",
        explanation: [
          "16 = 4², 25 = 5², and 36 = 6².",
          "63 is not a perfect square.",
          "Therefore 63 is the odd number out.",
        ],
        visualization: {
          type: "number",
          mode: "odd-one-out",
          values: [
            { value: 16, isOdd: false },
            { value: 25, isOdd: false },
            { value: 36, isOdd: false },
            { value: 63, isOdd: true },
          ],
          rule: "Perfect squares",
          caption: "Three values sit on square numbers; 63 does not.",
        },
      },
      {
        id: "numbers-4",
        sectionId: "numbers",
        number: 4,
        question: "If 4 × 5 = 41, 6 × 7 = 85, and 8 × 9 = 145, then 10 × 11 = ?",
        options: [
          { label: "A", text: "201" },
          { label: "B", text: "221" },
          { label: "C", text: "241" },
          { label: "D", text: "261" },
        ],
        correctOptions: ["B"],
        answer: "221",
        status: "solved",
        difficulty: "Core",
        concept: "Custom operator",
        explanation: [
          "The symbol × is being used as a custom rule, not ordinary multiplication.",
          "For each pair, a × b means a² + b²: 4² + 5² = 41 and 6² + 7² = 85.",
          "So 10 × 11 = 10² + 11² = 100 + 121 = 221.",
        ],
        visualization: {
          type: "number",
          mode: "formula",
          equation: ["a × b = a² + b²", "10 × 11 = 10² + 11²", "= 100 + 121", "= 221"],
          rule: "Square both inputs, then add.",
          caption: "A custom operator becomes simple once its formula is exposed.",
        },
      },
      {
        id: "numbers-5",
        sectionId: "numbers",
        number: 5,
        question: "Find the missing number: 2 : 8 :: 3 : 27 :: 4 : ?",
        options: [
          { label: "A", text: "32" },
          { label: "B", text: "48" },
          { label: "C", text: "64" },
          { label: "D", text: "81" },
        ],
        correctOptions: ["C"],
        answer: "64",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Cubes",
        explanation: [
          "2 maps to 2³ = 8.",
          "3 maps to 3³ = 27.",
          "Apply the same rule to 4: 4³ = 64.",
        ],
        visualization: {
          type: "number",
          mode: "cubes",
          values: [
            { input: 2, output: 8 },
            { input: 3, output: 27 },
            { input: 4, output: 64 },
          ],
          rule: "n → n³",
          caption: "The output is the cube of the input.",
        },
      },
    ],
  },
  {
    id: "logical",
    number: 5,
    name: "Logical Puzzles",
    shortName: "Logic",
    description: "Turn comparison clues into a ranked chain and test the consequences.",
    icon: "logic",
    context: logicalConstraints,
    questions: [
      {
        id: "logical-1",
        sectionId: "logical",
        number: 1,
        question: "Who scored the highest?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "B" },
          { label: "C", text: "C" },
          { label: "D", text: "E" },
        ],
        correctOptions: ["D"],
        answer: "E",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Ordering inequalities",
        explanation: [
          "A > B and C > A, so C is above A and B.",
          "E > C, so E is above everyone in the chain.",
          "Therefore E scored the highest.",
        ],
        visualization: {
          type: "ordering",
          order: ["E", "C", "A", "B", "D"],
          relation: "E > C > A > B > D",
          conclusion: "Highest = E",
          caption: "Stack the inequalities into one descending order.",
        },
      },
      {
        id: "logical-2",
        sectionId: "logical",
        number: 2,
        question: "Who scored the lowest?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "B" },
          { label: "C", text: "D" },
          { label: "D", text: "E" },
        ],
        correctOptions: ["C"],
        answer: "D",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Ordering inequalities",
        explanation: [
          "D scored less than B.",
          "The full order is E > C > A > B > D.",
          "D is at the bottom, so D scored the lowest.",
        ],
        visualization: {
          type: "ordering",
          order: ["E", "C", "A", "B", "D"],
          relation: "E > C > A > B > D",
          conclusion: "Lowest = D",
          caption: "The last node in the descending chain is the lowest score.",
        },
      },
      {
        id: "logical-3",
        sectionId: "logical",
        number: 3,
        question: "Who scored immediately below C?",
        options: [
          { label: "A", text: "A" },
          { label: "B", text: "B" },
          { label: "C", text: "D" },
          { label: "D", text: "E" },
        ],
        correctOptions: ["A"],
        answer: "A",
        status: "solved",
        difficulty: "Core",
        concept: "Immediate rank",
        explanation: [
          "The comparison clues form E > C > A > B > D.",
          "A appears directly below C in this chain.",
          "Therefore A scored immediately below C.",
        ],
        visualization: {
          type: "ordering",
          order: ["E", "C", "A", "B", "D"],
          relation: "E > C > A > B > D",
          conclusion: "Immediately below C = A",
          caption: "The neighbor directly under C is A.",
        },
      },
      {
        id: "logical-4",
        sectionId: "logical",
        number: 4,
        question: "If C scored 80 and A scored 70, which of the following could be B's score?",
        options: [
          { label: "A", text: "75" },
          { label: "B", text: "72" },
          { label: "C", text: "68" },
          { label: "D", text: "81" },
        ],
        correctOptions: ["C"],
        answer: "68",
        status: "solved",
        difficulty: "Core",
        concept: "Bounds from inequalities",
        explanation: [
          "The chain contains C > A > B.",
          "With C = 80 and A = 70, B must be less than 70.",
          "Among the choices, only 68 is less than 70.",
        ],
        visualization: {
          type: "ordering",
          order: ["C", "A", "B"],
          relation: "C > A > B",
          scores: [
            { label: "C", value: "80" },
            { label: "A", value: "70" },
            { label: "B", value: "< 70" },
          ],
          conclusion: "Possible B score = 68",
          caption: "B must sit below the 70-point threshold.",
        },
      },
      {
        id: "logical-5",
        sectionId: "logical",
        number: 5,
        question: "Which statement must be true?",
        options: [
          { label: "A", text: "E scored more than A" },
          { label: "B", text: "D scored more than B" },
          { label: "C", text: "B scored more than C" },
          { label: "D", text: "A scored more than E" },
        ],
        correctOptions: ["A"],
        answer: "E scored more than A",
        status: "solved",
        difficulty: "Core",
        concept: "Transitive comparison",
        explanation: [
          "E scored more than C.",
          "C scored more than A.",
          "Therefore E must score more than A by transitivity.",
        ],
        visualization: {
          type: "ordering",
          order: ["E", "C", "A"],
          relation: "E > C > A",
          conclusion: "E scored more than A",
          caption: "A comparison chain lets us infer relationships that were not stated directly.",
        },
      },
    ],
  },
  {
    id: "series",
    number: 6,
    name: "Series",
    shortName: "Series",
    description: "Make the hidden alphabet and number steps visible.",
    icon: "series",
    questions: [
      {
        id: "series-1",
        sectionId: "series",
        number: 1,
        question: "Find the next term: A, C, F, J, O, ?",
        options: [
          { label: "A", text: "T" },
          { label: "B", text: "U" },
          { label: "C", text: "V" },
          { label: "D", text: "W" },
        ],
        correctOptions: ["B"],
        answer: "U",
        status: "solved",
        difficulty: "Core",
        concept: "Increasing alphabet gaps",
        explanation: [
          "The alphabet positions are 1, 3, 6, 10, and 15.",
          "The gaps increase by one each time: +2, +3, +4, +5.",
          "The next gap is +6: 15 + 6 = 21, which is U.",
        ],
        visualization: {
          type: "series",
          mode: "alphabet",
          terms: ["A", "C", "F", "J", "O", "U"],
          positions: [1, 3, 6, 10, 15, 21],
          differences: ["+2", "+3", "+4", "+5", "+6"],
          caption: "The alphabet positions form triangular-number steps.",
        },
      },
      {
        id: "series-2",
        sectionId: "series",
        number: 2,
        question: "AB, DE, GH, JK, ?",
        options: [
          { label: "A", text: "LM" },
          { label: "B", text: "MN" },
          { label: "C", text: "NO" },
          { label: "D", text: "OP" },
        ],
        correctOptions: ["B"],
        answer: "MN",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Letter-pair progression",
        explanation: [
          "Each pair contains consecutive letters.",
          "The starting letter advances by three: A, D, G, J.",
          "The next pair starts at M, giving MN.",
        ],
        visualization: {
          type: "series",
          mode: "pairs",
          terms: ["AB", "DE", "GH", "JK", "MN"],
          caption: "Each pair jumps forward three alphabet positions.",
        },
      },
      {
        id: "series-3",
        sectionId: "series",
        number: 3,
        question: "1A, 3C, 5E, 7G, ?",
        options: [
          { label: "A", text: "8H" },
          { label: "B", text: "9I" },
          { label: "C", text: "10J" },
          { label: "D", text: "11K" },
        ],
        correctOptions: ["B"],
        answer: "9I",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Linked odd-number and alphabet sequence",
        explanation: [
          "The numbers increase by 2: 1, 3, 5, 7, 9.",
          "The letters also move by 2: A, C, E, G, I.",
          "The next combined term is 9I.",
        ],
        visualization: {
          type: "series",
          mode: "number-letter",
          terms: ["1A", "3C", "5E", "7G", "9I"],
          caption: "Both halves advance by two at the same time.",
        },
      },
      {
        id: "series-4",
        sectionId: "series",
        number: 4,
        question: "B, E, J, Q, Z, ?",
        options: [
          { label: "A", text: "H" },
          { label: "B", text: "I" },
          { label: "C", text: "K" },
          { label: "D", text: "L" },
        ],
        correctOptions: ["C"],
        answer: "K",
        status: "solved",
        difficulty: "Challenge",
        concept: "Odd-number gaps with wraparound",
        explanation: [
          "The alphabet positions are 2, 5, 10, 17, and 26.",
          "The gaps are +3, +5, +7, and +9, so the next gap is +11.",
          "26 + 11 = 37; wrapping around gives 37 − 26 = 11, or K.",
        ],
        visualization: {
          type: "series",
          mode: "quadratic",
          terms: ["B", "E", "J", "Q", "Z", "K"],
          positions: [2, 5, 10, 17, 26, 37],
          differences: ["+3", "+5", "+7", "+9", "+11"],
          caption: "The raw position is 37, which wraps to K after passing Z.",
        },
      },
      {
        id: "series-5",
        sectionId: "series",
        number: 5,
        question: "C, F, J, O, U, ?",
        options: [
          { label: "A", text: "Z" },
          { label: "B", text: "A" },
          { label: "C", text: "B" },
          { label: "D", text: "C" },
        ],
        correctOptions: ["C"],
        answer: "B",
        status: "solved",
        difficulty: "Challenge",
        concept: "Increasing alphabet gaps with wraparound",
        explanation: [
          "The positions are 3, 6, 10, 15, and 21.",
          "The gaps are +3, +4, +5, and +6; the next gap is +7.",
          "21 + 7 = 28, which wraps to position 2: B.",
        ],
        visualization: {
          type: "series",
          mode: "alphabet",
          terms: ["C", "F", "J", "O", "U", "B"],
          positions: [3, 6, 10, 15, 21, 28],
          differences: ["+3", "+4", "+5", "+6", "+7"],
          caption: "After U, the sequence wraps around the alphabet to B.",
        },
      },
    ],
  },
  {
    id: "coding",
    number: 7,
    name: "Coding & Decoding",
    shortName: "Coding",
    description: "Compare symbols letter-by-letter, or prove when a code is not determined.",
    icon: "code",
    questions: [
      {
        id: "coding-1",
        sectionId: "coding",
        number: 1,
        question: "If CAT is coded as DBU, how is DOG coded?",
        options: [
          { label: "A", text: "EPH" },
          { label: "B", text: "EOG" },
          { label: "C", text: "FPH" },
          { label: "D", text: "DPH" },
        ],
        correctOptions: ["A"],
        answer: "EPH",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Shift each letter by +1",
        explanation: [
          "CAT → DBU shows that every letter moves one place forward.",
          "D → E, O → P, and G → H.",
          "Therefore DOG → EPH.",
        ],
        visualization: {
          type: "coding",
          mode: "shift",
          source: "CAT",
          coded: "DBU",
          target: "DOG",
          targetCoded: "EPH",
          caption: "Apply the same +1 transformation to every letter in DOG.",
        },
      },
      {
        id: "coding-2",
        sectionId: "coding",
        number: 2,
        question: "In a certain code, COMPUTER is written as RFUVQNPD. How is SCIENCE written?",
        options: [
          { label: "A", text: "FDJFOFT" },
          { label: "B", text: "FDJFOF" },
          { label: "C", text: "ECIENCE" },
          { label: "D", text: "TDKFODF" },
        ],
        answer: "No unique answer",
        status: "insufficient-information",
        statusNote: "COMPUTER → RFUVQNPD does not establish one clear, consistent transformation for every letter, so SCIENCE cannot be determined uniquely.",
        difficulty: "Challenge",
        concept: "Checking whether a coding rule is sufficient",
        explanation: [
          "A coding question needs a rule that can be applied consistently to each position or letter.",
          "The provided COMPUTER → RFUVQNPD example does not reveal a sufficiently clear, consistent rule.",
          "Because multiple rules could fit one example, none of the SCIENCE options can be justified uniquely.",
          "Do not invent a code when the worksheet has not supplied enough information.",
        ],
        visualization: {
          type: "coding",
          mode: "insufficient",
          source: "COMPUTER",
          coded: "RFUVQNPD",
          target: "SCIENCE",
          caption: "One example is not enough when its letter-by-letter rule is inconsistent or unclear.",
        },
      },
      {
        id: "coding-3",
        sectionId: "coding",
        number: 3,
        question: "If APPLE = 50 and BALL = 27, then CAT = ?",
        options: [
          { label: "A", text: "24" },
          { label: "B", text: "25" },
          { label: "C", text: "26" },
          { label: "D", text: "27" },
        ],
        correctOptions: ["A"],
        answer: "24",
        status: "solved",
        difficulty: "Warm-up",
        concept: "Alphabet-position sum",
        explanation: [
          "APPLE confirms the rule: A=1, P=16, P=16, L=12, E=5; the total is 50.",
          "For CAT, C=3, A=1, and T=20.",
          "3 + 1 + 20 = 24.",
        ],
        visualization: {
          type: "coding",
          mode: "letter-sum",
          word: "APPLE",
          values: [1, 16, 16, 12, 5],
          total: 50,
          target: "CAT",
          targetValues: [3, 1, 20],
          targetTotal: 24,
          caption: "Convert letters to alphabet positions, then add them.",
        },
      },
      {
        id: "coding-4",
        sectionId: "coding",
        number: 4,
        question:
          'In a certain code language: "go fast" = "ka la"; "fast runner" = "la ma"; "runner wins" = "ma pa". What is the code for "wins"?',
        options: [
          { label: "A", text: "ka" },
          { label: "B", text: "la" },
          { label: "C", text: "ma" },
          { label: "D", text: "pa" },
        ],
        correctOptions: ["D"],
        answer: "pa",
        status: "solved",
        difficulty: "Core",
        concept: "Common-word matching",
        explanation: [
          "The common word between 'go fast' and 'fast runner' is fast; the common code is la.",
          "The common word between 'fast runner' and 'runner wins' is runner; the common code is ma.",
          "The remaining code in 'runner wins' is pa, so pa means wins.",
        ],
        visualization: {
          type: "coding",
          mode: "word-map",
          mappings: [
            { word: "fast", code: "la" },
            { word: "runner", code: "ma" },
            { word: "wins", code: "pa" },
          ],
          answer: "pa",
          caption: "Intersect the phrases to peel away the known word/code pairs.",
        },
      },
      {
        id: "coding-5",
        sectionId: "coding",
        number: 5,
        question: 'In a code, "MOBILE" is written as "ELIBOM". How is "LAPTOP" written?',
        options: [
          { label: "A", text: "POTPAL" },
          { label: "B", text: "POTPAL" },
          { label: "C", text: "POTPLA" },
          { label: "D", text: "TOPPAL" },
        ],
        correctOptions: ["A", "B"],
        answer: "POTPAL",
        status: "worksheet-issue",
        statusNote: "POTPAL is the correct reversal, but the worksheet duplicates it as options A and B. The text answer is clear; the option label is not unique.",
        difficulty: "Warm-up",
        concept: "Reversal",
        explanation: [
          "MOBILE → ELIBOM reverses the order of all letters.",
          "Reverse LAPTOP from right to left: P O T P A L.",
          "The result is POTPAL.",
          "The worksheet lists POTPAL twice, so both A and B contain the same correct text.",
        ],
        visualization: {
          type: "coding",
          mode: "reverse",
          source: "MOBILE",
          coded: "ELIBOM",
          target: "LAPTOP",
          answer: "POTPAL",
          caption: "Read the target word from its final letter back to its first.",
        },
      },
    ],
  },
];

export const worksheetQuestions = worksheetSections.flatMap((section) => section.questions);

export const totalQuestions = worksheetQuestions.length;

export function getSection(sectionId: string) {
  return worksheetSections.find((section) => section.id === sectionId);
}

export function getQuestion(questionId: string) {
  return worksheetQuestions.find((question) => question.id === questionId);
}

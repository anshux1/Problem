# Build a Beautiful Interactive Solved Worksheet Webpage

Create a polished, modern, responsive educational webpage that presents the complete **CDC – Worksheet: Logical Reasoning** in an interactive and highly visual way.

The goal is not just to display answers. The webpage should make every problem **easy to understand visually**, with the reasoning shown step-by-step.

The original worksheet contains **7 sections and 35 questions**:

1. Direction Sense — 5 questions
2. Blood Relationship — 5 questions
3. Seating Arrangement — 5 questions
4. Number Puzzles — 5 questions
5. Logical Puzzles — 5 questions
6. Series — 5 questions
7. Coding and Decoding — 5 questions

Use the uploaded worksheet as the source of truth for the question wording and options.

---

## 1. Overall Design

Build a beautiful educational dashboard rather than a plain question-answer page.

### Visual style

Use:

* Modern academic/educational aesthetic
* Clean typography
* Large readable question cards
* Soft gradients
* Rounded cards
* Subtle shadows
* Good spacing
* Smooth animations
* Responsive design
* Mobile-first layout
* Dark/light mode
* Accessible contrast
* Minimal but useful icons
* Beautiful diagrams wherever they improve understanding

Avoid making it look like a generic admin dashboard.

The page should feel like a **premium interactive reasoning-learning platform**.

---

# 2. Page Structure

Create:

### Header

Show:

**CDC – Logical Reasoning Worksheet**

Subtitle:

**Interactive Solutions & Visual Explanations**

Include:

* Theme toggle
* Progress indicator
* Search questions
* Section navigation

---

## 3. Hero Section

At the top display:

**Master Logical Reasoning**

"Understand every question with step-by-step visual explanations."

Show statistics:

* 7 Sections
* 35 Questions
* Step-by-step Solutions
* Visual Explanations

Add a prominent:

**Start Solving →**

button that scrolls to the first section.

---

# 4. Section Navigation

Create a sticky section navigation bar/sidebar.

Sections:

```text
01 Direction Sense
02 Blood Relationship
03 Seating Arrangement
04 Number Puzzles
05 Logical Puzzles
06 Series
07 Coding & Decoding
```

Show progress such as:

```text
Direction Sense       0/5
Blood Relationship    0/5
Seating Arrangement   0/5
...
```

When the user completes/reveals a solution, update the progress.

---

# 5. IMPORTANT — EACH QUESTION MUST BE SEPARATE

Every question must have its own individual card.

Do NOT combine multiple questions into one card.

Each question should look approximately like:

```text
┌─────────────────────────────────────────────┐
│ QUESTION 01                         01 / 05 │
│                                             │
│ Ravi walks 8 km north...                    │
│                                             │
│ ○ A) 2 km                                   │
│ ○ B) 6 km                                   │
│ ○ C) 8 km                                   │
│ ○ D) 14 km                                  │
│                                             │
│ [Show Solution]                             │
└─────────────────────────────────────────────┘
```

When clicking **Show Solution**, expand the card with the complete explanation.

---

# 6. Question Card Behavior

Each card should contain:

### Header

* Section name
* Question number
* Difficulty indicator
* Question progress

### Question

Display the exact question from the worksheet.

### Options

Show each option as a selectable-looking option.

When the user clicks an option:

* Correct answer → green success state
* Incorrect answer → red/error state
* Show the correct answer
* Don't allow the UI to imply an answer is correct if the worksheet information is insufficient or ambiguous

### Solution button

Button:

**Show Step-by-Step Solution**

When clicked, reveal:

1. Concept
2. Step-by-step reasoning
3. Visual explanation
4. Final answer

---

# 7. Direction Sense — VISUALIZATION

For Direction Sense questions, don't just write text.

Create graphical diagrams using HTML/CSS/SVG.

Use:

* Compass
* North ↑
* South ↓
* East →
* West ←
* Person/start marker
* Path lines
* Distance labels
* Final position marker

For example, Question 1 should visually show:

```text
             North
               ↑
               │ 8 km
               │
Start ●────────┐
               │
               │
               ↓
              8 km
               
        Final ●──────→ 6 km
```

More accurately implement the actual path using SVG.

For Q1 explain:

```text
8 km North
↓
6 km East
↓
8 km South
↓
North/South movement cancels
↓
Remaining displacement = 6 km East
```

Final answer:

**B) 6 km**

---

# 8. Blood Relationship — FAMILY TREE

For Blood Relationship questions, create interactive family-tree diagrams.

Use nodes such as:

```text
        Grandfather
             │
           Father
             │
        ┌────┴────┐
       Raj      Woman
```

Use different visual styles/icons for:

* Male
* Female
* Parent
* Child
* Sibling

Highlight the relationship being asked.

For example:

Q1:

"She is the daughter of the only son of my grandfather."

Show:

```text
Grandfather
     │
   Father
     │
 ┌───┴───┐
Raj    Woman
```

Then visually highlight:

**Woman = Sister of Raj**

Final answer:

**A) Sister**

---

# 9. Seating Arrangement — INTERACTIVE SEATING DIAGRAM

For seating questions, create a visual row of seats.

Example:

```text
┌────┬────┬────┬────┬────┬────┐
│ A  │ B  │ C  │ E  │ F  │ D  │
└────┴────┴────┴────┴────┴────┘
```

Animate/highlight the people involved.

Important:

The worksheet's conditions allow more than one valid arrangement.

Valid arrangements include:

```text
A B C E F D
```

and

```text
D A B C E F
```

Therefore clearly display:

**⚠️ Worksheet Ambiguity**

Explain why the conditions don't uniquely determine every answer.

For Q1, Q3 and Q4, don't force an incorrect single answer.

Show the possible arrangements and explain the ambiguity.

For Q2:

**E is immediately right of C**

For Q5:

**E is immediately right of C**

---

# 10. Number Puzzles — ANIMATED PATTERN EXPLANATION

For sequence questions, visually show the pattern.

Example:

```text
3 → 7 → 15 → 31 → 63 → 127

×2+1
  ↓
×2+1
  ↓
×2+1
```

For:

```text
2, 6, 12, 20, 30, 42
```

Show:

```text
1×2 = 2
2×3 = 6
3×4 = 12
4×5 = 20
5×6 = 30
6×7 = 42
```

For formula-based questions, display the mathematical formula in a beautiful math-rendered component.

Use **KaTeX or MathJax**.

---

# 11. Logical Puzzles — ORDERING GRAPH

For the marks question, visually represent:

```text
E
↓
C
↓
A
↓
B
↓
D
```

Then explain:

```text
E > C > A > B > D
```

Use animated arrows and highlighting.

For Q4 show:

```text
C = 80
A = 70

Therefore:

C > A > B

B < 70

Possible option:
68 ✓
```

---

# 12. Series — VISUAL PATTERN

For alphabet series, show alphabet positions.

Example:

```text
A    C    F    J    O    U
1    3    6   10   15   21

 +2   +3   +4   +5   +6
```

Highlight the increasing difference.

For letter pairs:

```text
AB → DE → GH → JK → MN
```

Animate the sequence.

---

# 13. Coding & Decoding — TRANSFORMATION VISUALIZER

Show transformations letter-by-letter.

For:

```text
CAT → DBU
```

display:

```text
C → D
A → B
T → U
```

Then:

```text
DOG

D → E
O → P
G → H

DOG → EPH
```

For numerical coding:

```text
APPLE

A = 1
P = 16
P = 16
L = 12
E = 5

1 + 16 + 16 + 12 + 5
= 50
```

Then apply the same rule to CAT.

---

# 14. Complete Question Data

Implement ALL questions from the worksheet.

## SECTION 01 — DIRECTION SENSE

### Q1

**Question:**

Ravi walks 8 km north, then turns right and walks 6 km. He then turns right and walks 8 km. How far is he from his starting point?

Options:

* A) 2 km
* B) 6 km
* C) 8 km
* D) 14 km

Solution:

```text
8 km North
→ 6 km East
→ 8 km South

North and South movements cancel.

Remaining displacement = 6 km East.

Answer: B) 6 km
```

---

### Q2

**Question:**

A person walks 10 m south, turns left and walks 15 m, then turns left and walks 10 m. In which direction is he from his starting point?

Answer:

**B) East**

Explanation:

```text
10 m South
→ Left = East, 15 m
→ Left = North, 10 m

South and North cancel.

Final position = East.
```

---

### Q3

**Question:**

Priya is facing east. She turns 90° clockwise, then 180° anticlockwise. Which direction is she facing now?

Answer:

**B) North**

Explanation:

```text
East
↓ 90° clockwise
South
↓ 180° anticlockwise
North
```

---

### Q4

**Question:**

Arun is facing north. He turns right, walks 20 m, turns left, walks 15 m, and then turns left and walks 20 m. How far and in which direction is he from his starting point?

Answer:

**A) 15 m North**

Explanation:

```text
20 m East
15 m North
20 m West

East and West cancel.

Final displacement = 15 m North.
```

---

### Q5

**Question:**

If the sun is setting directly in front of a person, which direction is the person facing?

Answer:

**B) West**

Explanation:

Sunset = West.

---

# SECTION 02 — BLOOD RELATIONSHIP

### Q1

Answer: **A) Sister**

Reason:

Grandfather → only son = Father → Father's daughter = Sister.

### Q2

Answer: **B) Uncle**

A is brother of B. B is mother of C. Therefore A is C's uncle.

### Q3

Answer: **B) Grandmother**

R is mother of P. P is father of Q. S is Q's brother. Therefore R is S's grandmother.

### Q4

Answer: **B) Cousin**

Father's sister = Aunt. Aunt's daughter = Cousin.

### Q5

Answer: **B) Uncle**

M is brother of N, N is sister of O, O is father of P. Therefore M is P's uncle.

---

# SECTION 03 — SEATING ARRANGEMENT

Conditions:

```text
A is second left of C
B immediately right of A
D at one end
E immediately left of F
C is not at an end
```

Show the constraint-solving process.

Valid arrangements:

```text
A B C E F D
```

and

```text
D A B C E F
```

### Q1

**Ambiguous**

Possible extreme-left person:

* A
* D

### Q2

**C) E**

E is immediately right of C in both valid arrangements.

### Q3

**Ambiguous**

Possible extreme pairs:

* A and D
* D and F

### Q4

**No valid option**

B and C are adjacent, so nobody sits between them.

### Q5

**A) Immediately right**

E is immediately right of C.

Clearly display an **Ambiguous / Worksheet Issue** badge for Q1, Q3 and Q4.

---

# SECTION 04 — NUMBER PUZZLES

### Q1

```text
3, 7, 15, 31, 63, ?

×2 + 1

63 × 2 + 1 = 127
```

Answer: **B) 127**

### Q2

```text
2, 6, 12, 20, 30, ?

1×2
2×3
3×4
4×5
5×6
6×7 = 42
```

Answer: **B) 42**

### Q3

16, 25, 36, 63

16, 25 and 36 are perfect squares.

63 is not.

Answer: **D) 63**

### Q4

Rule:

```text
a × b = a² + b²
```

Therefore:

```text
10 × 11
= 10² + 11²
= 100 + 121
= 221
```

Answer: **B) 221**

### Q5

```text
2 → 2³ = 8
3 → 3³ = 27
4 → 4³ = 64
```

Answer: **C) 64**

---

# SECTION 05 — LOGICAL PUZZLES

Given:

```text
A > B
C > A
B > D
E > C
```

Therefore:

```text
E > C > A > B > D
```

### Q1

Highest = **E**

Answer: **D) E**

### Q2

Lowest = **D**

Answer: **C) D**

### Q3

Immediately below C = **A**

Answer: **A) A**

### Q4

C = 80
A = 70

Therefore:

```text
C > A > B
80 > 70 > B
```

B must be less than 70.

Possible option = **68**

Answer: **C) 68**

### Q5

E > C > A

Therefore E scored more than A.

Answer: **A) E scored more than A**

---

# SECTION 06 — SERIES

### Q1

```text
A C F J O ?

+2 +3 +4 +5 +6
```

Answer = **U**

**B) U**

### Q2

```text
AB DE GH JK ?
```

Each pair advances by 3.

Answer = **MN**

**B) MN**

### Q3

```text
1A
3C
5E
7G
9I
```

Answer = **B) 9I**

### Q4

```text
B E J Q Z ?

2 5 10 17 26 ?

+3 +5 +7 +9 +11
```

26 + 11 = 37.

Wrap around alphabet:

37 − 26 = 11 = K.

Answer: **C) K**

### Q5

```text
C F J O U ?

3 6 10 15 21 ?

+3 +4 +5 +6 +7
```

21 + 7 = 28 → B.

Answer: **C) B**

---

# SECTION 07 — CODING & DECODING

### Q1

```text
CAT → DBU
```

Each letter moves +1.

```text
D → E
O → P
G → H
```

DOG → EPH

Answer: **A) EPH**

### Q2

The worksheet gives:

```text
COMPUTER → RFUVQNPD
```

but this does not provide a sufficiently clear/consistent rule for uniquely determining the coding of SCIENCE.

Do NOT invent a solution.

Display:

**⚠️ Insufficient information**

and explain that the given example does not establish a unique coding rule.

### Q3

```text
APPLE

A = 1
P = 16
P = 16
L = 12
E = 5

Total = 50
```

For CAT:

```text
C = 3
A = 1
T = 20

3 + 1 + 20 = 24
```

Answer: **A) 24**

### Q4

Given:

```text
go fast = ka la
fast runner = la ma
runner wins = ma pa
```

Common word:

```text
fast = la
runner = ma
wins = pa
```

Answer: **D) pa**

### Q5

MOBILE → ELIBOM

This is reversal.

Therefore:

```text
LAPTOP
↓
POTPAL
```

Answer:

**POTPAL**

The worksheet's options appear to contain a typo/duplicate. Display this as a worksheet issue rather than silently changing the original option text.

---

# 15. Solution UX

Every question should support:

### "Try Yourself"

Initially hide the solution.

User sees:

```text
[ Choose an answer ]

[ Check Answer ]

[ Show Solution ]
```

After answering:

```text
✓ Correct!

or

✕ Incorrect
Correct answer: B
```

Then allow:

**Show Explanation**

---

# 16. Visual Explanation Components

Build reusable components such as:

```text
<DirectionDiagram />
<FamilyTree />
<SeatingChart />
<NumberPattern />
<OrderingGraph />
<SeriesVisualizer />
<CodingVisualizer />
<StepByStep />
<AnswerCard />
<AmbiguityWarning />
```

Do not create one giant component.

Keep the question data separate from UI components so questions can easily be modified later.

---

# 17. Suggested Data Architecture

Store the questions as structured data:

```ts
type Question = {
  id: string;
  section: string;
  number: number;
  question: string;
  options: string[];
  correctAnswer?: string;
  status: "solved" | "ambiguous" | "insufficient-information";
  explanation: string[];
  visualization?: {
    type: string;
    data: unknown;
  };
};
```

This should make the UI data-driven.

---

# 18. Technology

Use:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide icons
* Framer Motion or Motion
* SVG for diagrams
* KaTeX/MathJax for mathematical expressions

Do not use unnecessary libraries.

Make the application performant and accessible.

---

# 19. Responsive Design

Desktop:

```text
Sidebar       Main Content
              Question
              Question
              Question
```

Mobile:

```text
Header
Section selector
Question
Question
Question
```

All diagrams must scale correctly on mobile.

---

# 20. Extra Features

Add:

* Search questions
* Filter by section
* Filter unanswered/answered
* Progress tracking
* "Show all solutions"
* "Hide all solutions"
* Dark mode
* Keyboard navigation
* Smooth scroll
* Back-to-top button
* Section completion indicators
* Question number navigation

Persist progress using `localStorage`.

---

# 21. Important Accuracy Rules

Do NOT change the original question wording.

Do NOT silently fix mistakes in the worksheet.

Where the worksheet is ambiguous or contains insufficient information:

* Clearly mark it
* Explain why
* Show the possible interpretations
* Never invent an answer

Known worksheet issues:

### Seating Arrangement

Q1, Q3 and Q4 are ambiguous/invalid under the given conditions.

### Coding Q2

The provided COMPUTER → RFUVQNPD example does not establish a sufficiently clear unique rule.

### Coding Q5

The correct reversal of LAPTOP is:

**POTPAL**

but the worksheet's option list appears to contain a typo/duplicate.

---

# 22. Final Quality Requirement

The finished website should feel like a **real interactive learning product**, not a document viewer.

A student should be able to:

1. Read the question
2. Think about it
3. Select an answer
4. Check the answer
5. See the correct solution
6. Understand the reasoning visually
7. Move to the next question

Every question must be independently understandable.

Prioritize **clarity, visual reasoning, beautiful UI, animations, and educational value** over excessive decoration.

Build the complete working webpage, not just a mockup.

# Build an Interactive Quantitative Aptitude & Logical Reasoning Worksheet Website

Create a beautiful, modern, highly interactive educational webpage that presents and solves **all 16 questions from the provided worksheet**.

The goal is not simply to display answers. The website should make every problem **easy to understand visually**, with clear step-by-step reasoning, formulas, diagrams, and interactive elements wherever useful.

The design should feel like a polished educational product rather than a basic HTML worksheet.

---

## 1. Core Requirements

Build a single-page responsive website containing all **16 questions**, with:

* Every question in its own separate section/card.
* Original question clearly displayed.
* Final answer prominently displayed.
* Step-by-step solution.
* Mathematical formulas rendered beautifully using LaTeX.
* Visual explanations wherever possible.
* Interactive diagrams for geometry/direction/number puzzles.
* Clear distinction between:

  * Question
  * Approach
  * Working
  * Final Answer
  * Important Note, when applicable.
* Smooth scrolling and navigation.
* Responsive design for desktop, tablet, and mobile.
* Excellent typography and spacing.
* Dark/light mode.
* Progress indicator showing which question the user is currently viewing.

Do not put all questions into one huge text block.

Each question should feel like an independent mini lesson.

---

# 2. Recommended Technology

Use:

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion or Motion for animations
* Lucide React for icons
* KaTeX or MathJax for mathematical formulas
* SVG/CSS for diagrams and visualizations

Prefer reusable React components instead of hardcoding everything into one component.

---

# 3. Overall Page Structure

Create the following layout:

### Header

A polished sticky header containing:

**CDC Worksheet**

Subtitle:

**Quantitative Aptitude & Logical Reasoning**

On the right:

* Progress indicator: `Question 1 / 16`
* Theme toggle
* Optional search button

---

### Hero Section

Create a visually attractive introduction.

Display:

> Quantitative Aptitude & Logical Reasoning

Then:

> 16 Problems • Step-by-Step Solutions • Visual Explanations

Add a short description:

> Learn the reasoning behind every answer instead of simply memorizing the result.

Include a button:

**Start Solving →**

which smoothly scrolls to Question 1.

---

# 4. Question Navigation

Add a floating or sticky question navigator.

Display:

`01 02 03 04 05 06 07 08`

`09 10 11 12 13 14 15 16`

Each number should be clickable and scroll to that question.

Change the active question based on scroll position.

Use a visual progress bar:

`████████░░░░░░░░ 8/16`

---

# 5. Reusable Question Card

Create a reusable component such as:

```tsx
<QuestionCard
  number={1}
  type="age-problem"
  question="..."
  answer="..."
>
  ...
</QuestionCard>
```

Each card should contain:

### Header

```text
QUESTION 01
AGE PROBLEM
```

Then the complete question.

### Solution section

Use:

**Step 1 — Define the variables**

**Step 2 — Translate the information into equations**

**Step 3 — Solve**

**Step 4 — Verify**

### Final Answer

Use a visually prominent answer box.

Example:

```text
✓ Final Answer

Ram = 45 years
Son = 13 years
```

---

# 6. Question 1 — Age Problem

Question:

> Ram tells his son, “5 years ago, I was 5 times as old as you were then. Also 3 years from now, I shall be 3 times as old as you will be”. Find their present ages.

Solution:

Let son's present age be:

[
x
]

Let Ram's present age be:

[
y
]

Five years ago:

[
y-5=5(x-5)
]

Therefore:

[
y=5x-20
]

Three years from now:

[
y+3=3(x+3)
]

Therefore:

[
y=3x+6
]

Equating:

[
5x-20=3x+6
]

[
2x=26
]

[
x=13
]

Therefore:

[
y=45
]

### Final Answer

**Son = 13 years**

**Ram = 45 years**

### Visual

Create a timeline showing:

```text
5 years ago        NOW             3 years later
     |               |                   |
   Ram 40          Ram 45              Ram 48
   Son 8           Son 13              Son 16
```

Animate the timeline when the card enters the viewport.

---

# 7. Question 2 — Goats and Peacocks

Question:

> In a group of goats and peacocks, the number of legs is 14 more than twice the number of heads. The number of cows is:

Important note:

The worksheet says "cows", although the problem describes goats and peacocks. Clearly display this as a worksheet inconsistency instead of silently changing it.

Solution:

Let goats = (G)

Let peacocks = (P)

Heads:

[
G+P
]

Legs:

[
4G+2P
]

Given:

[
4G+2P=2(G+P)+14
]

Simplify:

[
4G+2P=2G+2P+14
]

[
2G=14
]

[
G=7
]

### Final Answer

**7 goats**

### Important Note

Show a warning card:

> The worksheet asks for the number of "cows", but cows are not included in the described group. The mathematically derivable result is 7 goats.

---

# 8. Question 3 — Finger Counting

Question:

> A girl counted in the following way on the fingers of her left hand: She started by calling the thumb 1, the index finger 2, middle finger 3, ring finger 4, little finger 5 and then reversed direction calling the ring finger 6, middle finger 7 and so on. She counted upto 1994. She ended counting on which finger?

Create a large interactive hand diagram.

Label:

```text
Thumb   Index   Middle   Ring   Little
  1       2       3       4       5
  9       8       7       6       5
```

Explain that the repeating cycle contains 8 positions.

[
1994 \div 8
]

Remainder:

[
2
]

The second position is the index finger.

### Final Answer

**Index Finger**

Make the index finger visually highlighted.

---

# 9. Question 4 — Direction and Distance

Create an interactive coordinate-plane diagram.

Question involves:

* S = 20 m south of P
* Q = 15 m south of R
* U = 15 m north of V
* T = 20 m east of V
* U = 16 m east of Q
* R = 30 m east of P

For the S → Q calculation:

Set:

[
P=(0,0)
]

[
S=(0,-20)
]

[
R=(30,0)
]

[
Q=(30,-15)
]

Then:

[
\Delta x=30
]

[
\Delta y=5
]

Distance:

[
d=\sqrt{30^2+5^2}
]

[
d=\sqrt{925}
]

[
d=5\sqrt{37}
]

Show a right triangle connecting S and Q.

### Final Answer

**A — (5\sqrt{37}) m**

---

# 10. Question 5 — Mithu, Deva and Shakshi

Create a coordinate diagram.

Place:

```text
                 Mithu
                   ●
                   |
                 40 m
                   |
Jas ●─────────────● Deva
   0 m            20 m
   |
   |
Shakshi ●
```

More accurately position Shakshi 60m west/east according to the worksheet's stated relation and ensure the mathematical coordinates used in the calculation are clearly shown.

Use:

Jas:

[
(0,0)
]

Deva:

[
(20,0)
]

Shakshi:

[
(60,0)
]

Mithu:

[
(20,40)
]

Direct distance:

[
\sqrt{40^2+40^2}
]

[
=40\sqrt2
]

[
\approx56.57m
]

Via Deva:

[
40+40=80m
]

Saving:

[
80-56.57=23.43m
]

### Final Answer

**D — 23.44 m approximately**

Show both routes in different visual styles.

---

# 11. Question 6 — Handshakes

Question:

> In a birthday party, every person shakes hand with every other person. If there was a total of 30 handshakes in the party, how many persons were present?

Show a visual network of people shaking hands.

Formula:

[
\frac{n(n-1)}{2}=30
]

Therefore:

[
n(n-1)=60
]

[
n^2-n-60=0
]

Factor:

[
(n-10)(n+6)=0
]

Therefore:

[
n=10
]

### Final Answer

**10 persons**

Optionally animate 10 dots and demonstrate that every pair creates one handshake.

---

# 12. Question 7 — Day Number Puzzle

Display the original puzzle visually:

```text
Monday    = 617
Tuesday   = 729
Wednesday = 9312
Thursday  = 8412
Friday    = 6511
Saturday  = 8614

Sunday = ?
```

Explain the pattern.

For Monday:

* 6 letters
* Day number = 1
* 6 + 1 = 7

→ 617

Tuesday:

* 7 letters
* Day number = 2
* 7 + 2 = 9

→ 729

For Sunday:

* 6 letters
* Day number = 7
* 6 + 7 = 13

Therefore:

[
\boxed{6713}
]

### Final Answer

**6713**

Include an animated "pattern discovery" effect.

---

# 13. Question 8 — Family Ages

Question:

> A is 12 years older to B and 9 years younger to C, while B and D are twins. How many years older is C to D?

Show an age relationship diagram:

```text
D = B
    ↓
A = B + 12
    ↓
C = A + 9
```

Therefore:

[
C=B+12+9
]

[
C=B+21
]

Since:

[
B=D
]

Therefore:

[
C=D+21
]

### Final Answer

**C is 21 years older than D.**

---

# 14. Question 9 — Page Number Digits

Question:

> The total number of digits used in numbering the pages of a book having 499 pages is.

Create a visual breakdown:

```text
Pages 1–9       → 9 × 1   = 9
Pages 10–99     → 90 × 2  = 180
Pages 100–499   → 400 × 3 = 1200
--------------------------------
Total                      = 1389
```

Animate each section appearing sequentially.

Formula:

[
9+180+1200=1389
]

### Final Answer

**1389 digits**

---

# 15. Question 10 — Star Number Puzzle

Recreate the star puzzle from the worksheet using SVG/CSS.

Display the three stars exactly as provided.

First:

```text
        3
    2       8
       10
    4       1
```

Second:

```text
        2
    5       6
        6
    7       10
```

Third:

```text
        11
    9        4
        ?
    2        3
```

IMPORTANT:

Do not invent a definitive answer.

Explain that the two completed examples do not provide enough information to uniquely determine the intended rule.

Display:

### Status

⚠️ **Ambiguous puzzle**

### Explanation

> Multiple mathematical rules can be constructed from only two examples, so the missing value cannot be determined uniquely from the supplied worksheet.

Make this visually clear rather than presenting a guessed answer.

---

# 16. Question 11 — Odd One Out

Question:

> Find the odd one out N, L, J, H, G.

Display letters with alphabet positions:

```text
N = 14
L = 12
J = 10
H = 8
G = 7
```

Pattern:

```text
14 → 12 → 10 → 8 → 6
```

The expected final letter would be F.

Therefore G breaks the pattern.

### Final Answer

**G**

---

# 17. Question 12 — Wrong Term

Question:

```text
6, 15, 35, 77, 179, 221
```

Show the intended pattern:

[
6\times2+3=15
]

[
15\times2+5=35
]

[
35\times2+7=77
]

Then:

[
77\times2+9=163
]

But the worksheet gives:

[
179
]

Therefore 179 appears to be wrong.

However, explicitly mention that **221 also does not continue the same rule**, meaning the worksheet may contain an additional error.

### Final Answer

**179 appears to be the intended wrong term, but the series itself is inconsistent.**

Use a warning/info component for this question.

---

# 18. Question 13 — Temperature

Question:

> The average temperature for Monday, Tuesday, Wednesday and Thursday was 48 degrees and for Tuesday, Wednesday, Thursday and Friday was 46 degrees. If the temperature on Monday was 42 degrees. Find the temperature on Friday?

Show two overlapping sets visually.

Monday–Thursday:

[
48\times4=192
]

Monday:

[
42
]

Therefore:

[
Tue+Wed+Thu=150
]

Tuesday–Friday:

[
46\times4=184
]

Therefore:

[
150+Friday=184
]

[
Friday=34
]

### Final Answer

**34°C**

---

# 19. Question 14 — Wrong Number

Display:

```text
7 → 8 → 18 → 57 → 219 → 1165 → 6996
```

Show the rule:

[
7\times1+1=8
]

[
8\times2+2=18
]

[
18\times3+3=57
]

Next should be:

[
57\times4+4=232
]

But worksheet says:

[
219
]

Verify:

[
232\times5+5=1165
]

[
1165\times6+6=6996
]

Therefore:

### Final Answer

**219**

Use a red/error indicator on 219 and show the corrected 232.

---

# 20. Question 15 — Letter Puzzle

Recreate the 3×3 hexagonal letter grid:

```text
E   M   H
N   O   A
I   ?   D
```

Convert letters to alphabet positions.

Row 1:

[
5+13+8=26
]

Row 2:

[
14+15+1=30
]

The row sums increase by 4.

Therefore Row 3 should equal:

[
34
]

So:

[
9+?+4=34
]

[
?=21
]

21st letter = U.

### Final Answer

**U**

Highlight U in the visual grid.

---

# 21. Question 16 — Number Pyramid

Recreate the exact number pyramid:

```text
        9
       4 3
      1 8 1
     2 1 7 ?
```

Calculate column totals:

First:

[
9+4+1+2=16
]

Second:

[
3+8+1=12
]

Third:

[
1+7=8
]

The totals decrease by 4:

[
16,\ 12,\ 8,\ 4
]

Therefore:

[
?=4
]

### Final Answer

**4**

---

# 22. Design System

Make the website visually impressive.

Use:

* Large rounded cards
* Subtle shadows
* Glassmorphism where appropriate
* Clean borders
* Soft gradients
* Good whitespace
* Strong typography hierarchy
* Mathematical expressions in large readable format
* Smooth animations

Avoid:

* Excessive gradients
* Excessive animations
* Clutter
* Tiny text
* Huge paragraphs
* Generic dashboard styling

The website should feel like a **premium interactive learning platform**.

---

# 23. Color Semantics

Use colors semantically:

* Blue → information
* Green → correct/final answer
* Yellow → important concept
* Red → error/wrong term
* Purple → mathematical/formula sections

Do not overuse colors.

---

# 24. Animations

Use subtle animations:

* Cards fade/slide in when entering viewport
* Formula steps appear sequentially
* Number counters animate
* Diagram elements draw themselves
* Active question indicator updates while scrolling
* Hover effects on navigation
* Smooth scrolling
* Final answer gets a subtle highlight animation

Respect `prefers-reduced-motion`.

---

# 25. Interactive Features

Add:

### Show/Hide Solution

Each question should initially show:

**Show Solution**

Clicking it expands the solution.

Also provide:

**Hide Solution**

---

### Step-by-Step Mode

For difficult questions, provide:

`← Previous Step`

`Next Step →`

Only one reasoning step is displayed at a time.

At the end:

**Reveal Final Answer**

---

### Copy Formula

Every important formula should have a small copy button.

---

### Question Progress

Track which questions the user has viewed.

Example:

```text
Questions completed

██████████░░░░░░ 10 / 16
```

---

# 26. Mobile Design

On mobile:

* One question card per screen
* Sticky bottom navigation
* Large touch targets
* Diagrams resize properly
* No horizontal scrolling
* Mathematical formulas remain readable

---

# 27. Accessibility

Implement:

* Semantic HTML
* Keyboard navigation
* ARIA labels where necessary
* Good color contrast
* Reduced-motion support
* Screen-reader-friendly mathematical explanations
* Focus states

---

# 28. Data Architecture

Keep the questions in structured data rather than hardcoding the content into JSX.

Example:

```ts
const questions = [
  {
    id: 1,
    category: "Ages",
    question: "...",
    answer: "...",
    difficulty: "Easy",
    steps: [...]
  },
  ...
]
```

This should make it easy to add more worksheets later.

---

# 29. Component Architecture

Create reusable components such as:

```text
App
├── Header
├── Hero
├── QuestionNavigation
├── ProgressBar
├── Worksheet
│   ├── QuestionCard
│   ├── QuestionHeader
│   ├── ProblemStatement
│   ├── SolutionSteps
│   ├── FormulaBlock
│   ├── Diagram
│   ├── FinalAnswer
│   └── ImportantNote
└── Footer
```

Create specialized visual components:

```text
AgeTimeline
CoordinateDiagram
FingerDiagram
HandshakeDiagram
DayPattern
AgeRelationship
PageDigitBreakdown
StarPuzzle
LetterGrid
NumberPyramid
```

---

# 30. Important Accuracy Requirement

Do not silently modify the worksheet.

Where the worksheet contains an apparent typo, inconsistency, or ambiguous puzzle, explicitly show:

> ⚠️ Worksheet Issue

and explain the issue.

Known issues:

### Question 2

The worksheet asks for "number of cows", although the group is described as goats and peacocks.

### Question 10

The star puzzle does not provide enough information to establish a unique rule.

### Question 12

The sequence appears inconsistent because the intended pattern suggests 163 after 77, but the worksheet gives 179, and 221 also doesn't follow the apparent rule.

The UI should make these issues obvious.

---

# 31. Final Experience

The final webpage should feel like:

> **An interactive tutor explaining a worksheet**

not:

> **A PDF converted into HTML**

Every question should answer three things:

1. **What is the problem asking?**
2. **How do we solve it?**
3. **Why is the answer correct?**

Use diagrams whenever a visual explanation is more intuitive than text.

The user should be able to open the webpage and learn the entire worksheet without needing any external explanation.

Build the complete working website, not just a mockup.

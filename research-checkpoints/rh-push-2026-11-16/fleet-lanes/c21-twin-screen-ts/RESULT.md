# c21-twin-screen-ts: RESULT

Date 2026-11-20. Round 21, kind combine (filter lane). Paper only: no numerics were run, no server unit was
started, nothing was committed. Files written only in this directory. **No statement about zeros of zeta is
made. Filter lane: no answer for R4; score 0.** Requirement flags: R1 = R2 = R3 = R4 = false.

Independent referees: 0. `REFEREE.md` is a second pass written in the same session (no separate referee agent
was available to this lane); it re-derives 10 sampled rows and its corrections are entered in `TWIN_SCREEN.md`.
The file is owed an independent referee before the launch rule of STRATEGY section 2 relies on it.

Labels: PROVED (argument written in this lane), PROVED-rel (relative to a refereed statement on file),
ARGUED, TYPED (classified from the text of a map row or device entry; the lane behind it not opened), OPEN.

## 0. Verdict

**Partial result (filter and one consolidating lemma).** `TWIN_SCREEN.md` is written with the three reasons
as statements with hypotheses and limits, Lemma TS-1, and 92 rows (56 device types, 6 pending items, 6 cell
lines, 14 statistic classes, 10 geometric objects with their joins to 5 arithmetic inputs).

1. **Decisive first test (classification of the 56 device types).** The three reasons of STRATEGY section 0c
   cover **10 of 56** device types as a primary verdict (rows 4, 6, 8, 12, 13, 14, 15, 28, 53, 55) and a stated
   sub-form of 2 more (rows 3, 32). The other **46** are "none of the three"; each has a closing row on file
   (45 closed, 1 floored). Their closing rows are of other kinds: passed at every stage by a named control
   that is not a stage twin (17), identity or identification (9), restatement of the target (5), reads only
   Re s >= 1 or another aspect (4), false for zeta or for every object (3), finite measured search (3), mean
   value (2), floored (1), other (2). No device type is left without a row.
2. **Consequence for the launch rule.** The rule "a row to which one of the three reasons applies is not
   launched" filters stage devices (finite support, finite section, finite order, band forms). It does not
   filter the majority kind of the record (devices closed by a fixed control such as T-NR at a fixed prime,
   E_a, EIS-w, the translate WT, backward heat). The screen therefore carries the kind of the closing row for
   every "none" row, and section 6 of the screen states the extra conditions an inverse-explore candidate must
   meet.
3. **Lemma TS-1 (combinable (i)).** (i) PROVED: invisibility at stage P is the coefficient condition
   c(n) = 0 for 2 <= n < P on N = zeta/G, equivalently first local modification at p^(j_p) >= P at every prime;
   it needs neither the functional equation nor the Euler product. (ii) PROVED-rel Theorem A: an Euler-product
   twin with zeta's functional equation is either a local twin (T1: the local clause fails at some prime, a
   property of one local factor) or lies in the boundary regime (T2: local clause at every prime and
   sum delta_p divergent, hence modified at infinitely many primes beyond every stage). (iii) T1 is non-empty
   at every stage (HQ1 to HQ4). (iv) PROVED-rel Theorem C of the euler-shape lane: a T2 twin in regime (K) has
   no off-line zero of its own; existence of any T2 twin is OPEN. So the twins that a stage cannot see and a
   per-prime clause cannot exclude are exactly the T2 class, which is lead BR.
4. **Statistic classes and geometric objects.** 4 of 14 statistic classes of the screening arm fall under the
   three reasons (finite-support Weil-type onsets, finite-order Pick-type onsets, first-differing-prime onsets,
   torus statistics at a finite prime set). No object of the geometric program, alone or in a join on file,
   is "none" without a closing row; the Helson-type input (the only input with no finite stage) is joined to
   no geometric object on file.
5. **Rows for round 23** (screen section 6): cell U5 beyond a span in exact-FE form (it is the T2 question),
   the two tried-not-closed pending items (measured, not proved), the two cells with no displayed object, and
   the empty joins with the discrepancy input. None is a displayed object that escapes all three reasons and
   all closing kinds; the screen supplies no stage-A candidate.

## 1. Plan and what is new against the record

Plan as assigned: (1) decisive test first: classify the 56 device types; (2) write the three reasons with
hypotheses; (3) Lemma TS-1; (4) pending items, statistic classes, geometric objects; (5) second pass on 10
sampled rows.

Pre-filter answers (STRATEGY section 1): R1: no step of this lane uses multiplicativity for a conclusion about
zeta (Lemma TS-1 (i) uses multiplicativity of c only to pass from "c(n) = 0, n < P" to "c(p^k) = 0, p^k < P").
R2: no statement in a window is claimed. R3: no mechanism is claimed, so no control table. R4: none; the lane
is a filter.

New against the record: the classification itself and its count (10 of 56); the coefficient form of
invisibility (Lemma TS-1 (i)), which extends K3-M from single-prime palindromic factors to any F with
a(n) = 1 for n < P; the T1/T2 dichotomy as one statement joining K3-M with Theorems A and C of the euler-shape
lane; the observation that test functions supported in [-u, u] make every explicit-formula device a stage
device at P = e^u (row 3); the list of kinds for the "none" rows. Not new: the three reasons (round-20 lanes),
every closing row.

## 2. Work

Everything is in `TWIN_SCREEN.md`: section 1 (reasons R1-S, R2-S with the twin table and its limits, R3-E,
R3-C, remark R3-add), section 2 (Lemma TS-1 with proof of part (i)), section 3 (devices, pending items,
cells), section 4 (statistic classes), section 5 (geometric objects and joins), section 6 (inverse-explore
rows).

Proof of Lemma TS-1 (i), repeated here because it is the one PROVED step of the lane. zeta = G N with
N = sum c(n) n^-s, c(1) = 1, gives 1 = sum_{d | n} a_G(d) c(n/d) for every n. If c(m) = 0 for 2 <= m < P, then for
n < P the sum is a_G(n), so a_G(n) = 1. If a_G(m) = 1 for m < P, then for n < P, 1 = sum_{e | n} c(e), and Moebius
inversion gives c(n) = 0 for 2 <= n < P. For an Euler product, c is multiplicative with c(p^k) the k-th
coefficient of n_p, and n < P forces each prime-power component of n below P, so the condition is c(p^k) = 0
for p^k < P. Lambda_G(n), n < P, is determined by a_G(m), m <= n.

How rows were typed. A row has "stage" when the device reads (a(n))_{n < P} for a finite P at each use
(including finite sections of the prime chain, finite prime sets on the torus, tests supported in [-u, u]);
then R2-S applies as written. "Pair" is yes when the device contains a form in A_P and the gamma side on
vectors localised at a height. Reason 1 is entered only where the form has degree <= 2 and theta' < 1. Reason
3 is entered only for zero-free stage hypotheses (R3-E) and finite Pick-type orders (R3-C, or line-2 Theorem
A where the node range is unbounded and the comparison object is zeta B_c). A pass by DH itself or by a fixed
control is not counted as reason 3; it is recorded as the kind of the closing row.

## 3. Controls

No zeta-only mechanism is claimed, so there is no step for a control to fail. The control objects that carry
the screen: HQ1 to HQ4 and T-NR at a prime beyond the stage (reason 2); the exponential stages of
Davenport-Heilbronn (reason 3, R3-E); the product D_Q and zeta B_c (reason 3, R3-C). For the nine controls of
the assignment: DH enters through R3-E and R3-C; backward heat, sign-twisted primes, the unimodular twist,
zeta(s + a) zeta(s - a), Beurling, the phase-rotated transfer operator and theta^w enter only as the passing
objects of closing rows of kind F (they are not stage twins and none of the three reasons is about them);
T-NR enters both ways (beyond the stage: reason 2; at a fixed prime: kind F).

## 4. Requirement flags and evidence

- **R1 false.** Nothing established here uses multiplicativity for a statement about zeta. Lemma TS-1 (ii) rests
  on Theorem A, whose proof uses no multiplicativity (its lane says so; referee R-6).
- **R2 false.** No height-uniform or every-window conclusion is drawn; R1-S and R2-S are statements about
  what window forms cannot conclude.
- **R3 false.** No mechanism; the screen lists which objects pass which tests.
- **R4 false.** Filter lane; no crossing step.

## 5. Three weakest steps

1. **Most rows are TYPED, and the referee pass is not independent.** 37 of the 56 device rows were classified
   from the evidence text of `devices.json` and from map rows cut at a few hundred characters; the lanes
   behind them were not opened. The second pass re-derived 10 sampled rows and changed 7 of them in wording,
   closing row or scope (none in verdict). At that rate further rows contain errors of the same size. The
   kind letters (F, I, T, R, X, S, M) are a reading of one line each and several rows carry two.
2. **Reason 2 is non-discriminating, and its use as a launch filter depends on a reading.** R2-S holds for
   every stage functional, including inequalities that RH implies; it shows that the stage is not the step
   separating zeta from the twins, not that a stage inequality is useless. The twins HQ1 to HQ4 have poles,
   so an argument that also uses pole-freeness of zeta near the height is not excluded by R2-S alone; what
   stops it on file is the band-u resolution statement of the c17 and c18 lanes (rows of spacing at most
   2 pi/u are invisible; ZQ passes in the lattice model), which this lane did not re-derive.
3. **Reason 3 is entered beyond what is proved in two places.** For Li and Toeplitz orders (statistic class
   s6) and for Weil forms on finite-dimensional test spaces the verdict rests on remark R3-add, which is
   ARGUED and not written out (the gamma side changes with Q). For finite Pick orders on unbounded node sets
   the comparison object is zeta B_c, which has no off-line zero; the off-line control D_Q is proved on
   bounded node ranges only. Row 15 says so for the lacunary set {4^k}.

Also open: the statistic classes were formed from the `obstruction` field and example lines; the 160 lines
were not each assigned. The geometric joins are TYPED from map rows G1 to G45, and one lane on file
(`h-hecke-channels`) was not opened.

## 6. Files

`TWIN_SCREEN.md` (the deliverable), `RESULT.md`, `REFEREE.md` (second pass, same session; referees = 0),
`lanes.jsonl` (one line). No scripts, no server unit, no file outside this directory.

#!/usr/bin/env python3
"""Builds STATEMENT_O_v4.md next to this file from push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md (not
edited). Version 4 = version 3 verbatim + a header, section B2 (lines 13 to 17), a version-4 paragraph in section C,
and section F (classes on which no line applies). Every insertion anchor must occur exactly once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '..', 'c12-repair-sources-statement-o-v3', 'STATEMENT_O_v3.md'))
t = open(SRC, encoding='utf-8').read()
def repl(a, b):
    global t
    assert t.count(a) == 1, (t.count(a), a[:60]); t = t.replace(a, b)

HEADER = """# Statement O, version 4: record of obstructions

**Version 4, 2026-11-19 (lane `c16-repair-owed-record-r15`; record lane, no attack).** This file is
`push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md` (not edited) with four additions, each marked
"(version 4)": (1) section B2, lines 13 to 17, written against the refereed checkpoint
`push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md` and the referee files of round-15 lanes
`c15-control-with-zeta-fe-classes-u1-u2` and `c15-u5-window-count-threshold-translate-control`; (2) one note under
line 12 (row Q30); (3) a version-4 paragraph at the end of section C on the input-level sentence; (4) section F,
the classes on which no line applies, one conditional statement per class. Lines 1 to 12, sections A, D, E and the
appendix are the version-3 text, unchanged.

What the additions are and are not.
- Each new line is a separate conditional statement of the same form as lines 1 to 12: a device whose whole read
  set lies inside the class of line j is defeated by the control of line j in the stated mode. There is no joint
  clause, and nothing here says what a device must read.
- Label rule (unchanged): PROVED means two referee files cover the closing step. Lines 13 to 17 each rest on ONE
  independent referee file. They are therefore counted ARGUED under the rule, with the lane's own label and the
  referee's confirmation stated in the line. A second referee for the ZQ construction is owed to
  `c16-referee-r15-j1prime-u8-screening`.
- Count after version 4: PROVED 4, PROVED relative to a cited theorem 1, MEASURED 1, ARGUED 11 (the six of
  version 3 and lines 13 to 17).
- New control codes: ZQ, SG, NR-q (map section 2, table rows and note), G_+ (the counterexample of the referee of
  `c15-control-with-zeta-fe-classes-u1-u2`, E1; no engine code).
- Correction carried by this version: the sentence "no control on file has zeta's own functional equation"
  (campaign record of round 14) is false as written; T-NR in the symmetric normalisation has it. The corrected
  form is in the version-4 paragraph of section C.
- No line is a statement about zeros of zeta. No line says that no device exists.

*Header of version 3 follows unchanged.*

**Version 3, reader pass of 2026-11-19 (lane `c12-repair-sources-statement-o-v3`).**"""
repl("# Statement O, version 3: record of obstructions\n\n**Version 3, reader pass of 2026-11-19 (lane `c12-repair-sources-statement-o-v3`).**", HEADER)

B2 = """## B2. Lines 13 to 17 (version 4; round 15 and the refereed checkpoint)

Same fields as section B. Sources: `push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` (C15) and its
`REFEREE.md`, independent pass (C15-REF); `push/c15-u5-window-count-threshold-translate-control/RESULT.md` and
`REFEREE.md`. Typing condition for lines 13 to 16 (C15-REF, E2): the controls have a coefficient measure that is
the sum of an ordinary Dirichlet series and an absolutely continuous part (ZQ, SG, G_+) or a generalised series with
frequencies log n + j log q (NR-q). A1 admits ordinary series, Beurling series, or a Mellin transform of a kernel;
a sum of an ordinary series and a kernel transform is an extension of A1, not a case of it. Lines 13 to 16 are
stated for the class K extended in that way, and "EP, GEOM, SIZE on atoms" means: the discrete part of the measure
of log F is that of log zeta (local factor (1 - p^-s)^-1 at every prime).

### Line 13 (version 4). Zeta's own functional equation with multiplicative structure read on the prime-power atoms, without INT

- **Read class.** R = {FE of zeta itself (conductor 1, zeta's gamma factor), at all heights; simple pole at 1;
  order 1; N(T) for large T; EP, GEOM and SIZE read on the prime-power atoms of log F}. Not in R: INT (no
  coefficient mass off log N), SUPP, POS. This is class U1 {FE, GEOM} and the SIZE branch of class U2 of the
  checkpoint in the atom reading.
- **Control and construction.** ZQ = zeta(s) m(s), m(s) = [(t^2 + gbar^2 + eta^2)^2 - 4 gbar^2 t^2] /
  [(t^2 - g1^2)(t^2 - g2^2)], t^2 = s(1 - s) - 1/4, g1 < g2 ordinates of two zeros of zeta on the line,
  gbar = (g1 + g2)/2, d = (g2 - g1)/2, 0 < eta < 1/2.
- **Step at which the control satisfies the class.** m is a rational function of s(1 - s), real on the real axis,
  with m -> 1 at infinity and m(1) finite and non-zero: ZQ keeps zeta's functional equation exactly, the pole, the
  order and N(T) for T > g2. Its logarithmic coefficient measure is Lambda plus the absolutely continuous signed
  density D(x) = -4 x^(-1/2) cos(gbar log x)(cosh(eta log x) - cos(d log x)), with
  sup abs(D) <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2: every atom is zeta's.
- **Mode and floor.** (Z). Zeros at 1/2 +- eta +- i gbar for any 0 < eta < 1/2: no floor from R alone. The defect
  needed to defeat an output abscissa theta is at most 8 e^-2 ((theta - 1/2)^2 + d^2)/(1 - theta)^2; the infimum
  over the family is 0 and is not attained (relative to Selberg's positive proportion of zeros on the line,
  CLASSICAL, recalled; C15-REF E3).
- **What the line does not say.** If GEOM, SIZE and EP are read on ordinary coefficients, the read set contains
  {FE, INT} and the device is in an identification class (section F, entry U3), where this line does not apply
  and no control exists. Three ways out of the line are on file: reading INT; reading the sign of Lambda with the
  pole clause (line 16 and Lemma L); reading analyticity of twists (then the control is NR-q or T-NR, line 15).
- **Map rows.** Section 2, table row ZQ and the note "Controls ZQ, SG, NR-q and Lemma L".
- **Lanes and referee count.** `c15-control-with-zeta-fe-classes-u1-u2`, 1 independent referee (holds with
  corrections E1 to E5); the lane's own same-lane pass is not counted.
- **Label.** Construction and defect bound: PROVED in the lane, re-derived by the referee; MEASURED on the pairs
  (1, 2), (6709, 6710) and, by the referee, (298, 299). One referee file: ARGUED under the label rule.
- **Owed.** Second referee on the construction (`c16-referee-r15-j1prime-u8-screening`). The paper runs of ZQ
  against device rows Z34, Z36, P53 are ARGUED and were not checked by the referee.

### Line 14 (version 4). Zeta's functional equation with exact atoms and an upper bound for Lambda

- **Read class.** R = {FE of zeta itself; exact prime-power atoms; Lambda_F <= Lambda (a one-sided size bound),
  or positivity of the atoms only}. Not in R: INT, POS for the whole measure.
- **Control and construction.** SG = zeta(s)(t^2 + b^2)/(t^2 - g1^2): the zeros 1/2 +- i g1 of zeta are replaced
  by the real pair 1/2 +- b, 0 < b < 1/2.
- **Step at which the control satisfies the class.** The added density is
  D(x) = -2 x^(-1/2)(cosh(b log x) - cos(g1 log x)) <= 0 for all x (cosh >= 1 >= cos), so Lambda_SG <= Lambda with
  exact atoms and the exact functional equation.
- **Mode and floor.** (Z). A real zero at any prescribed point 1/2 + b of (1/2, 1): no floor from R alone.
- **Map rows.** Section 2, table row SG.
- **Lanes and referee count.** As line 13.
- **Label.** PROVED in the lane, re-derived by the referee; MEASURED at b = 0.3. One referee file: ARGUED under
  the label rule.
- **Owed.** Second referee.

### Line 15 (version 4). Zeta's functional equation with coefficients read at integers only, or covariance at rational primes only

- **Read class.** R = {FE of zeta itself; discrete frequencies; the coefficients at integer frequencies; Hecke
  relations at rational primes}. Not in R: INT in the full sense (no frequency off log N), GEOM at every
  generalised prime.
- **Control and construction.** NR-q = zeta(s)(q^(s-1/2) + c + q^(1/2-s)), q = 1 + sqrt 2 (a base with no rational
  power), 2 < abs(c) < q^(1/2) + q^(-1/2) = 2.1974. T-NR at a rational prime in the symmetric normalisation (line 6) is the
  member of the same kind at a rational base (frequencies log(n/q), log n, log(nq)).
- **Step at which the control satisfies the class.** The multiplier is invariant under s -> 1 - s; the
  integer-frequency part of the generalised series is c zeta exactly; the Hecke relation at every rational prime
  holds on each coset q^j N. The defect sits on one added generalised prime q with non-unimodular parameter.
- **Mode and floor.** (Z). Zeros on Re s = 1/2 +- arccosh(abs(c)/2)/log q, inside the strip for the stated range
  of c (at c = 2.1: 0.857311 + 3.564428i, MEASURED).
- **What the line does not say.** Lemma D (C15, PROVED; scope as corrected by C15-REF E4): a symmetric multiplier
  1 + sum c_j (l_j^(s-1/2) + l_j^(1/2-s)) with a zero in the closed strip has
  sum abs(c_j)(l_j^(1/2) + l_j^(-1/2)) >= 1. A device that reads a small l1 distance of the coefficients from
  those of zeta is not addressed by this line (it is addressed by line 13, whose defect is small and continuous).
- **Map rows.** Section 2, table rows NR-q and NR.
- **Lanes and referee count.** As line 13.
- **Label.** PROVED in the lane, re-derived by the referee; MEASURED at c = 2.1. One referee file: ARGUED under
  the label rule.
- **Owed.** Second referee.

### Line 16 (version 4). Zeta's functional equation, exact atoms and Lambda_F >= Lambda >= 0, without the pole clause

- **Read class.** R = {FE of zeta itself; exact prime-power atoms; POS in the form Lambda_F >= Lambda >= 0}.
  Not in R: "no pole other than s = 1" (in particular no real pole in (0, 1)); INT.
- **Control and construction.** G_+ = zeta m_+, m_+(s) = ((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2)/(t^2 + b^2)^2
  with eta < b < 1/2 (C15-REF, E1). Simple poles with two different b also work (same source).
- **Step at which the control satisfies the class.** D_+(x) = 4 x^(-1/2)(cosh(b L) - cos(gbar L) cosh(eta L)) >= 0
  for all x, L = log x, so Lambda_G >= Lambda >= 0; the functional equation and the atoms are exact; G_+ has double
  real poles at 1/2 +- b.
- **Mode and floor.** (Z). Zeros at 1/2 +- eta +- i gbar, any 0 < eta < b < 1/2: no floor from R alone.
- **What the line does not say.** With the pole clause the class is an identification class (Lemma L, section F,
  entry U3 (iv)). The class {FE, pole at 1 only, Lambda_F >= 0} without Lambda_F >= Lambda is neither a line nor
  an identification: section F, entry U2-POS.
- **Map rows.** Section 2, note "Controls ZQ, SG, NR-q and Lemma L".
- **Lanes and referee count.** The construction is in the referee file only: one derivation (partial fractions),
  MEASURED there on the pair (298, 299) with b = 0.2, eta = 0.07 (min D_+ on the grid 7.6e-11 > 0, functional
  equation defect 2.9e-29). It has not been re-derived by a second agent.
- **Label.** ARGUED under the label rule (one file, one derivation).
- **Owed.** A second derivation of D_+ >= 0; an engine code if the control is used again.

### Line 17 (version 4). The functional equation read through window tests at heights inside one span, with an identification-type conclusion

- **Read class.** R = {EP with unimodular parameters; the window test abs(F - chi conj F) <= eta abs(F) on K unit
  windows whose heights lie in one span [T, T + L]}, with K <= K_tr(T, eta) =
  max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + o(1)), and a conclusion of the form "F = zeta on the window" or
  "the unimodular parameters are trivial". It extends outline line 14 (item 2b of section C: a fixed number of
  windows) to numbers of windows growing with T inside a span.
- **Control and construction.** WT in the span form: zeta(s + i alpha) with alpha about 2 pi/log(T/2 pi), and the
  reflection translate alpha = -2c, c near the midpoint of the span (referee E1).
- **Step at which the control satisfies the class.** F - chi conj F = F(1 - e^(i Psi)) with Psi monotone in t; the
  relative defect on the whole span is pi L/(T log(T/2 pi)) to leading order (L^2/(8T) for the reflection
  translate).
- **Mode and floor.** (S): the identification conclusion is false for the translate. No floor: every translate
  has all its zeros where zeta has them, shifted in height. K_tr exceeds T^a for every a < 1 at fixed eta.
- **What the line does not say.** For a device whose conclusion is about the location of zeros the translate is
  not a control (referee E4). The only passing objects with an off-line zero found by the lane are free-prime
  unimodular products with a zero of a finite model function (float64, no certificate; K = 128 at T = 1e6) and a
  finite combination that passes an absolute-tolerance test only: MEASURED, not a line.
- **Map rows.** S12b; S12; control row WT.
- **Lanes and referee count.** `c15-u5-window-count-threshold-translate-control`, 1 independent referee (holds
  with corrections E1 to E4).
- **Label.** PROVED to leading order in the lane, re-derived by the referee. One referee file: ARGUED under the
  label rule.
- **Owed.** Second referee; an explicit error term in place of "to leading order".

---

## C. The clause on R1, R3 and R4"""
repl("## C. The clause on R1, R3 and R4", B2)

# note under line 12: locate the end of the line-12 block = the '---' before section B2 heading
a = "\n---\n\n## B2. Lines 13 to 17 (version 4; round 15 and the refereed checkpoint)"
assert t.count(a) == 1
t = t.replace(a, "\n- **(version 4) Instance added in round 15.** Fejer-tapered sections of the prime chain with P = t^theta (map row\n  Q30; `c15-u7-growing-section-twin-ladder-bridge`, one independent referee): with the taper the limit step from\n  finite stages is sound (Harnack, Vitali), and the stage inequality at unbounded P is the Weil functional on\n  translated Fejer tests (row P45), the target. This is mode (I) of line 11 for the tapered section and does not\n  change line 12, which concerns stage data shared by U; class U7 of the checkpoint closes as that row.\n" + a)

V4C = """`c11-del-device-read-confirm` item 3, now relative to opened texts). This is why the table above is not a
necessity statement.

**(version 4) The input-level sentence after round 15.** The sentence "every control lacks at least one of FE,
SIZE, GEOM, INT" stays true when GEOM and SIZE are read on ordinary coefficients: ZQ, SG, NR-q and G_+ all lack
INT. It is no longer informative for the sets {FE, SIZE} and {FE, GEOM} when these are read on the prime-power
atoms: ZQ has zeta's own functional equation at all heights and every atom of log zeta, with zeros at any
1/2 + eta (line 13). So of the three minimal input sets of the source, {FE, SIZE} and {FE, GEOM} are failed by
every control only in the reading in which they contain {FE, INT}, which is Hamburger uniqueness, an
identification; in the atom reading each has a control. What no control on file has is zeta's own functional
equation together with an ordinary Dirichlet series; "no control on file has zeta's own functional equation" is
false as written (T-NR in the Laurent form zeta(s)(q^(s-1/2) + c + q^(1/2-s)) has it; map row NR). Additions to
the summary table, each a separate conditional statement with the label of its line (one referee file):

| # | item not read by the class of the line | control inside that class | mode | line | map rows |
|---|---|---|---|---|---|
| 7a | the absence of coefficient mass off log N (INT), when FE of zeta itself and atom-level EP, GEOM, SIZE are read | ZQ | (Z) | 13 | section 2 row ZQ |
| 7b | a lower bound for Lambda (POS), when FE, exact atoms and an upper bound for Lambda are read | SG | (Z) | 14 | section 2 row SG |
| 7c | frequencies off log N at a generalised prime, when FE, integer coefficients and Hecke relations at rational primes are read | NR-q; T-NR | (Z) | 15, 6 | section 2 rows NR-q, NR |
| 7d | the absence of poles other than s = 1, when FE, exact atoms and Lambda_F >= Lambda >= 0 are read | G_+ | (Z) | 16 | section 2 note on ZQ |
| 7e | heights outside one span, or more than K_tr windows, when FE is read through window tests with an identification-type conclusion | WT (span and reflection translates) | (S) | 17 | S12b |

The table remains a list of separate statements; it is not a necessity statement, and items 7a to 7d are
conditional on the typing condition stated at the head of section B2."""
repl("""`c11-del-device-read-confirm` item 3, now relative to opened texts). This is why the table above is not a
necessity statement.""", V4C)

F = """## F. (version 4) Classes on which no line applies: one conditional statement per class

Source: `push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md` (one referee), with the outcomes of
round-15 lanes 1 to 6 as entered in `campaign/STRATEGY.md` section 4.0 (version 5). Each entry is a separate
statement of the form: *if the decisive step of a device reads the set as described, no line of sections B, B2 and
no closed device row read by the checkpoint pass applies to it.* The entries are not leads, the list is not shown
to be complete, and their conjunction is not asserted. An entry says nothing about whether a device exists.

- **U3 (identification classes; no control can lie in the class).** (i) {FE of zeta itself, INT} (Hamburger 1921,
  Satz 1, absolute convergence for sigma > 1; relative to the opened text). (ii) Degree one with FE, INT and the
  Euler-product axiom (Kaczorowski-Perelli 1999; relative to the opened text). (iii) {POS, GEOM at every rational
  prime, INT} (section C row 1b, Lemma I). (iv) {FE of zeta itself, a simple pole at 1 and no other pole,
  Lambda_F >= Lambda} (Lemma L of `c15-control-with-zeta-fe-classes-u1-u2`, PROVED given Landau's theorem for
  Laplace-Stieltjes transforms of positive measures, recalled; confirmed by one referee; the pole clause is
  necessary, line 16). For a device whose decisive step reads one of these sets the record holds an identification
  and no inequality; requirement R3 is tested by relaxing one input inside a family where the conclusion is
  false: INT (ZQ, NR-q, T-NR in Laurent form), POS one-sidedly (SG), the pole clause (G_+), FE (U, THIN, DEL), FE
  at all heights (WT), GEOM at every prime (E_a), POS (sign twists). Classes U1 {FE, GEOM, INT} and U2
  {FE, SIZE, POS at the log level, INT} of the draft are cells of this entry; read without INT on the atoms they
  fall under line 13.
- **U2-POS.** {FE of zeta itself, pole at 1 only, finite order, Lambda_F >= 0 as a measure} without
  Lambda_F >= Lambda: neither a control nor an identification is on file (lemma POS-FE of `campaign/STRATEGY.md`
  section 4.0; lane `c16-pos-fe-u2-positivity-rigidity`). If the decisive step of a device reads this set, no
  line applies.
- **U4 (residual).** Joint functionals of zeta and twists that are none of: functions of finitely many ratios;
  Gram or Hankel-block forms of the pair of unitary symbols; twist-transfer Weil forms; sign functionals of
  dictionary DJ (MEASURED, finite search); functionals invariant under a common pointwise scaling of the members
  (one derivation, no referee). Dictionary DN is closed as MEASURED at two tiers and not closed at the canonical
  tier (map row G41). If the decisive step reads such a functional, no line applies.
- **U5 beyond a span.** Window conditions at heights whose ratio differs from 1 by more than eta log(T/2 pi)/pi,
  read together with more than pi(N) prime conditions. Inside a span: line 17. Beyond it the only statements
  found are identifications on the window (map rows S12, S12b); no line applies.
- **U6 (a).** Hecke eigen-objects with parameter rho in rank >= 2, non-Borel or metaplectic (rank one: rows G35,
  G39, G40). No candidate object on file; no line applies.
- **U6 (b).** Lax-Phillips norms that are non-solid and outside the Hecke-sup, L^q and zero-mode families, or on
  invariant subspaces smaller than the mean-zero subspace (row G37). No line applies.
- **U6 (c).** Global Whittaker constants of a genuine cusp form on the double cover of GL(3). No line applies.
- **U6 (d).** Rank >= 2 compact-at-infinity squares without a Hecke rule (no use of multiplicativity as stated).
  No line applies.
- **U6 (e).** States of the Bost-Connes system outside the three classes of row D8. No line applies; a read set
  invariant under multiplication of the state by a positive element of C*(Q/Z) falls under line 6.
- **U6 (f).** Functionals of the unsummed complex isogenous points that are neither linear nor a second moment
  (row G33). No line applies.
- **U6 (g).** Scattering inequalities that read an exact normalisation, the archimedean factor, or
  f(z) = f(1 - z); rank above one; the two-variable affine kernel. Schur, bounded-analytic and Pick conditions on
  a zero-type coefficient are closed (control BLS, row D9). Otherwise no line applies.
- **U8.** Single-object kernel sign conditions beyond the searched range (order above 4, more than three
  parameters, nodes outside [-2.6, 2.6], other normalisations), outside three proved exclusions (minors on one
  lattice; Polya-frequency orders of the xi-kernel; monomial inequalities for kernels without polar terms, the
  last with one derivation and no referee). No line applies.

Resolved since the draft, and therefore not entries: U1 and U2-SIZE in the atom reading (line 13); U5 inside one
span for identification-type conclusions (line 17); U7 (map row Q30; the note under line 12).

---

## Appendix. Previous text (replaced in version 3; verbatim from the c9 file of 2026-11-18 22:22)"""
repl("## Appendix. Previous text (replaced in version 3; verbatim from the c9 file of 2026-11-18 22:22)", F)
open(os.path.join(HERE, 'STATEMENT_O_v4.md'), 'w', encoding='utf-8').write(t)
print('STATEMENT_O_v4.md written: %d characters (version 3: %d)' % (len(t), len(open(SRC, encoding='utf-8').read())))

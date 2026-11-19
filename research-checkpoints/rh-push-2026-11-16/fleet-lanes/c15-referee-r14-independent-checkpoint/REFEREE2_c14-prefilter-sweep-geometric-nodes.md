# REFEREE2: c14-prefilter-sweep-geometric-nodes

Independent referee, 2026-11-19. Item assigned: Lemma F. Verdict on Lemma F formed before the lane's REFEREE.md
was opened; the campaign round log had already told me that one PROVED sentence of this lane does not hold, and I
located and tested that sentence myself (section 3). Not a statement about zeros of zeta.

## Verdict

- **Lemma F: HOLDS WITH SCOPE LINE.**
- **Verdict item 5 / section 2.2 row Q-B (a): BROKEN as written** (one sentence; repair below).

Scope line for Lemma F (exact): "Lemma F is the statement that a control which satisfies every listed hypothesis
and violates the conclusion refutes the implication. Its content is the three lists of tau-stable step types. Q-B
is proved here for finite Blaschke products over non-real conjugate pairs acting on a coefficient whose strip
zeros are zeros (not poles); the proofs of B1 to B3 extend verbatim to any inner function with the real symmetry,
which is what the T-NR instance D(z)/D(z+1) (an infinite product) needs; B4 is rank one and rests on one referee
pass. A 'PASS' in the sweep is a reading of a node statement by one reader, not a run of a control."

## 1. Lemma F and its instances, re-derived

- The lemma itself: (i) to (iii) give an object with every hypothesis and without the conclusion. Trivial, holds.
- Q-B, B1: Theta_a(z) Theta_a(-z) = 1 (the factors invert each other); real symmetry from the pair (a, conj a);
  modulus 1 on the axis. Holds.
- Q-B, B2: abs((z - a)/(z + conj a)) < 1 for Re z > 0, Re a > 0. Holds.
- Q-B, B3: 1 - Theta(z) M(z) conj(Theta(w) M(w)) = [1 - Theta(z) conj Theta(w)] + Theta(z) [1 - M(z) conj M(w)]
  conj Theta(w): algebra; after division by z + conj w both terms are positive semidefinite kernels. Holds.
  Check (`ref2_checks.json` item6; M(z) = 0.9 (1 - z)/(1 + z) e^(-0.3 z), a = 0.3 + 2.1i, random nodes): identity
  defect 2e-16; smallest Pick eigenvalue at order 6: +1.2e-4 (M), +1.5e-4 (M Theta), -0.50 (M/Theta); at order 10:
  +6.9e-9, +7.2e-9, -1.46. Signs agree at both orders.
- T-NR as an instance: Theta = D(z)/D(z+1), D(z) = p0^(z-1/2) + p0^(1/2-z) + c. D(1 + it) = conj D(it), so
  modulus 1 on the axis (2e-16); D(z+1) has its zeros on Re z = -1/2 +- b < 0; the quotient tends to 1/p0 as
  Re z -> infinity and is periodic in Im z, so it is bounded and Schur by the maximum principle. This is a proof;
  the lane labels the bound MEASURED. Sampled supremum on 0 < Re z <= 3: 0.972 on a 60-point grid, 0.993 on a
  240-point grid (it tends to 1 at the axis). Theta(z) Theta(-z) = 1 because D(1 - z) = D(z).
- Q-S (iii): for real c with 2 < abs(c) < p0^(1/2) + p0^(-1/2), m_w has zeros in the open strip off the line
  (x + 1/x = -c, x real, abs(x) != 1). Holds. m_w(1 - s) = m_w(s): in the Laurent form zeta m_w satisfies zeta's
  own functional equation exactly (used in the checkpoint review, class U1).
- Q-P: quoted from round 13 (refereed twice); not re-derived here.

## 2. What Lemma F does not give

It is a sufficient test for "a control passes". Silence is not a verdict (the lane says so). Hypothesis (ii)
excludes nodes whose hypothesis is true for zeta only under RH; those are typed "t" by reading.

## 3. The sentence that does not hold

"For a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself" (verdict item
5; the same content in section 2.2 row Q-B (a) and in "none sits between"), labelled PROVED.
(i) A zero lambda of X gives a pole of R_a(w) = X(w - a)/X(w + a) at lambda - a, which lies in Re w > 0 only if
Re lambda > a. Zeros with 0 < Re lambda <= a give no pole there. So for fixed a in (0, 1/2) the Schur condition
speaks about the region Re lambda > a at most; RH is the family over a -> 0+.
(ii) Even for Re lambda > a the pole is cancelled when X(lambda - 2a) = 0 (this point I took from the lane's
REFEREE.md, E1, and confirmed): with a = 1/4 and X the polynomial with zeros +-0.35 +- 3i and +-0.15 +- 3i,
R_a has modulus 1 on the axis (9e-16) and sampled supremum 0.9980 (grid 200) and 0.9995 (grid 800) in Re w > 0,
although X has zeros at distance 0.35 > a from the axis. With the zeros +-0.35 +- 3i alone the supremum is 3.8
(grid 200) and 92 (grid 800): a pole. With +-0.2 +- 3i alone: 0.9990, 0.9997 (`ref2_checks_c.json`).
Correct sentence: "If every zero has abs(Re lambda) <= a then R_a has no pole in Re w > 0 (and is Schur under the
growth condition of the gamma class); conversely R_a Schur implies, for each zero with Re lambda > a, a zero of at
least the same multiplicity at lambda - 2a; the conjunction over all a in (0, 1/2) is the zero-free statement."
Also: "for a >= 1/2 ... Schur unconditionally for any X with zeros in the strip" needs a growth hypothesis
(bounded type in the half-plane); true for X in the gamma class of xi.
Effect on the sweep: the pole-type nodes stay typed target-level; no count changes follow from the repair that I
can see, but "none sits between" should be removed.

## 4. Label restrictions

1. Verdict item 5: PROVED -> replace by the corrected sentence; add the growth hypothesis for a >= 1/2.
2. Q-B: "finite product" in the definition against the infinite product of the T-NR instance: state B1 to B3 for
   inner functions with real symmetry.
3. T-NR quotient bound: MEASURED -> PROVED (argument in section 1), or keep MEASURED and cite this file.
4. Sweep counts (134 / 70 / 239): READ, one reader, no control run; not refereed in this pass (the 443 node
   readings were not re-read).

## 5. Not refereed

The node-by-node typing, the control check "0 disagreements" against the round-13 device table, and section 5
(two proposed nodes).

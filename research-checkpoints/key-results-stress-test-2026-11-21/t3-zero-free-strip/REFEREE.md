# REFEREE — t3-zero-free-strip (second pass, 2026-11-20)

Claim as listed: "Twin-ladder T3 equals a zero-free-strip statement, with the dictionary verified numerically to 1e-30."
First verdict: confirmed-weaker-statement, novelty known, arbitrariness 2, importance 2.

## What I ran (independent of t3_check.py)
`referee/ref_check.py`, log `referee/ref_run.log`. python-flint (Arb ball arithmetic) instead of mpmath, different
evaluation points, random rather than grid sampling, own Davenport-Heilbronn implementation (Hurwitz zeta, not
mpmath.dirichlet), own Newton search from a rough start. Run through memcap 8, about 2 minutes. No code shared with
the first reviewer except the mathematical definitions.

R1. E_a = A_a - iB_a with the actual Phi (Arb `acb.integral` on [0,2], 420 bits) against xi from Gamma*zeta at four
    new points (a, z) = (0.3, 14.1347+0.2i), (0.5, 101.318+i), (0.05, 50-0.3i), (0.37, 200+0.6i):
    the difference ball contains 0 at all four; relative radius 2.9e-122, 2.6e-95, 3.5e-111, 4.8e-62.
    Xi(z+ia) = xi(1/2-a+iz) = xi(1/2+a-iz) (Lagarias's form) to 1e-123. Control against Xi(z+ia/2): 0.31, 0.34, 0.069, 0.25.
    (The tail u>2 is below exp(-9000) and was not bounded inside the code; the identity is a one-line theorem anyway.)
R2. zeta, a = 0.5, 0.25, 0.1, 0.02, 0.005; 400 random points with 60<=x<=1000, 1e-3<=y<=3.2 (heights the first
    reviewer did not reach): sup|Theta_a| = 0.99901, 0.99935, 0.99952, 0.99991, 0.99998 (<1). 12-point Gram minimum
    eigenvalue 4.8e-2 .. 8.0e-5 (>0) for spread points; -5e-33 .. -3e-31 for 12 points clustered near gamma_1, which is
    rounding at 30 digits on a near-singular matrix, not a sign.
R3. Davenport-Heilbronn: FE residual 2.4e-34; off-line zero 0.80851718245663738555 + 85.69934848537759217i
    (first reviewer: 0.808517182456637 + 85.6993484853776i; agreement to all 15 digits they gave). b = 0.3085171825.
    Gram minimum eigenvalue: a=0.20 -0.70, 0.30 -0.43, 0.308 -4.4e-3, 0.3085 -3.4e-4, 0.3086 +9e-25, 0.309 +8e-24,
    0.31 +7e-29, 0.40 +2e-24. The sign change is bracketed in (0.3085, 0.3086), containing b. |Theta| evaluated 1e-6
    above the predicted pole lam0 - ia: 1.4e5, 1.6e4, 1.0e3, 35 for a = 0.20, 0.30, 0.308, 0.3085.
R4. Aligned-pair degeneracy on a different (transcendental) toy F = cos(l/3) * quadruple factors, zeros at ordinate 7
    with heights 0.70 and 0.20 (mirror about a = 0.45): Gram min -6e-20 at a = 0.45, -2.8e-2 at 0.44, -9.4e-3 at 0.46.
    The -6e-20 is not rounding at 30 digits: the heights were entered as double-precision floats (0.45+0.25 is off 0.7
    by ~1e-17) while a was exact, so the alignment was broken at the 1e-17 level and the kernel went negative at a
    matching scale. The degeneracy is therefore real but unstable under any perturbation of the pair.
    Misaligning the ordinates by 0.05: Gram min -6.3e-2 at a = 0.45 (kernel fails, as it should).
    In R4 the random sup|Theta| stayed below 1 (0.9999) in every failing case: the pole and the nearby zero are 0.02
    apart and 3000 random points missed the small region. A |Theta| grid test is unreliable in both directions;
    the Gram matrix caught every failure.

Exact reason for the degeneracy (my derivation, agrees with the repo's long verdict and the first reviewer):
Theta_a(z) = Xi(z-ia)/Xi(z+ia). A zero gamma+i*beta of Xi with beta > a gives a pole of Theta_a in C+ unless
gamma + i(2a-beta) is also a zero. Then E_a = S*E0 with S real entire, E0 Hermite-Biehler, K_E = S(z)conj(S(w))K_E0 >= 0.
For zeta this needs three or four zeros at one ordinate (real parts 1/2 +- beta and 1/2 +- (2a-beta)); not excluded
unconditionally. "T3 on a sequence a_n -> a0 implies the strip for a' > a0" needs infinitely many distinct a_n
(otherwise infinitely many zeros at one ordinate would not be forced); the first reviewer's wording omits "distinct".

## Does "confirmed-weaker-statement" stand?
Yes. I could not fault it. Their run B is a genuine check of the identity against an independent xi; my R1 repeats it
with a different library and rigorous balls. Their D and E controls reproduce with independent code and different
toys. The repo's own "1e-30" check is, as they say, the angle-addition formula at 40 digits (SL0_dictionary_audit.md
lines 14-16: trig core 1.0e-30; full identity only for Phi = exp(-u^2), 1.1e-15).

## Literature (my own reading)
Read the text of Lagarias, "Zero spacing distributions for differenced L-functions", Acta Arith. 120 (2005) 159-184,
arXiv:math/0601653 (pdftotext of the arXiv PDF). Lemma 2.1: |xi(h+s)| > |xi(h+1-conj s)| for Re s > 1/2 when h >= 1/2,
and for every h > 0 under RH. Lemma 6.1 exists and restates this as "E_h(z) = xi(1/2+h-iz) is a de Branges structure
function". The proof reduces each Hadamard factor to (2.5): |beta-h-sigma| > |beta-h-(1-sigma)|, which holds for
sigma > 1/2 exactly when beta < 1/2 + h. So the strip version is a corollary of the printed proof, but Lagarias does
not state it; the first reviewer's one-line "by a known lemma (Lagarias 2005) it holds when zeta has no zeros with
Re s > 1/2 + a" attributes slightly more than is printed. Lagarias also records (p. 4) that Xian-Jin Li told him
these results were known to de Branges in the late 1980s (Purdue lectures 1987-88).
Older source for the same phenomenon (from memory, not re-read today): Polya 1926 and de Bruijn, "The roots of
trigonometric integrals", Duke Math. J. 17 (1950): if F has its zeros in |Im| <= Delta then F(z+ia)+F(z-ia) has
only real zeros for a >= Delta; the twin-ladder A_a is (1/2)(Xi(z+ia)+Xi(z-ia)).
Three web searches for an explicit "kernel PSD for xi(.+ia) iff zero-free for Re s > 1/2+a" statement found none
stated verbatim. Classification: known (corollary of a printed proof plus the definition of Hermite-Biehler), not
a new result. The repo's long verdict cites Lagarias 2006 (Frontiers volume) but not the 2005 paper that contains
the lemma.

## Scores
- Verification: confirmed-weaker-statement (unchanged).
- Novelty: known (unchanged), with the attribution caveat above.
- Arbitrariness: 2 (unchanged). Downward pressure: the equivalence itself has no parameters (1). Upward pressure:
  the headline "1e-30" is purely a working-precision setting (my R1 gives 1e-62..1e-122 for the full identity at
  420 bits), "T3"/"twin-ladder" are project names, and the repo's channel numerics sit at a/2.
- Importance: 1 (changed from 2). The scale's 1 is "no consequence beyond the project", and the first reviewer's own
  rationale says the consequence is internal. A specialist already knows it; it constrains nothing about zeta. Its
  internal use (stop trying to close T3 by norm estimates; T3(a) for a < 1/2 is a quasi-RH) is sound.

## One-line (corrected)
The project's T3(a) positivity condition is the de Branges kernel condition for xi(1/2 + a - iz); it holds when zeta
has no zeros with Re s > 1/2 + a (the argument is that of Lagarias 2005, Lemma 2.1, stated there for a >= 1/2 and
under RH), and holding for all a > 0 is equivalent to RH; it is a restatement of known theory and the "1e-30" figure
checks only a trigonometric identity.

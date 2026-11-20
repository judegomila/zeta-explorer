# PREREG: Statement O line 11, per-control table of the cited identities at 40 digits

Written 2026-11-20 before any table run (only an API probe of python-flint had been run on the server: unit `rh-c21probe-1120102157`).
Lane `c21-statement-o-line11-control-table-40-digits-server`. Certified conversion (W1). No statement about zeros of zeta; no R4 answer; no score.

## Identities line 11 cites, and the form in which each is tested

Notation: s = 1/2 + z. F is the completed function of a control (entire where a completion exists), L = F'/F, D the
uncompleted Dirichlet-series function, Lambda_D its von Mangoldt coefficients (-D'/D = sum Lambda_D(n) n^-s).

| row | source row | identity as cited | tested form (exact, finite, every term enclosed) |
|---|---|---|---|
| P8 | P8 (starred cells DH, HEAT, EA, NR) | Q(e^(-zt)) = Re L(z)/Re z = pair formula over the zeros | rectangle R in the z-plane, rate z1 inside: Q - W_R + C_R, with W_R = sum over zeros in R of V(rho) conj V(-conj rho), C_R = (1/2 pi i) contour integral over the boundary of R of h L (h = V V#), which is the contribution of the zeros outside R |
| P1 | P1 (DH, EA; HEAT*, NR*) | Q_L(v) = sum over rho of V(rho) conj V(-conj rho) on a finite exponential test | same with two complex rates and coefficients (order 2) |
| EF | "explicit formula on the stated test class" | prime side of Q(e^(-zt)): L(z) = G'/G(s) - sum Lambda_D(n) n^-s | order 1 at a rate with Re z = 11.5: (prime side with a proved tail bound) - W_R + C_R on a wide rectangle; and pointwise D'/D(s) + sum_{n<=N} Lambda_D(n) n^-s |
| P45 | P45 (tapered section, Fejer weight) | the explicit formula with kernel Y^w/(w^2 log Y) | S_Y(s) - TU + C3 - Res: S_Y the Fejer sum, TU the Dirichlet-series tails of the right side of the rectangle in closed form (incomplete gamma) with a proved n-truncation bound, C3 the other three sides, Res = -D'/D(s) - (D'/D)'(s)/log Y - sum over the divisor of D in R of mult * kernel |

Two readings of Q are computed in rows P8, P1: Q_sym = sum b_i conj b_j (L(z_i) + conj L(z_j))/(z_i + conj z_j) (the cited form) and
Q_gen = sum b_i conj b_j (L(conj z_j) - L(-z_i))/(z_i + conj z_j) (what the residue theorem gives with no symmetry assumed).
They agree when F is even and real on the real axis.

Not converted (no two numerical sides): L2 (a membership lemma), D3 (literature criteria), Q25 (pending). D7 (strip
Dirichlet-to-Neumann = Poisson-Jensen of the strip) is the same residue computation as P8 on another domain and is not run separately.

## Controls

zeta; DH; E_a (a = 0.3); T-NR (q = 2, c = 2.1; zeros of the added factor at Re s = 1/2 +- 0.4544); HEAT at tau = 1 and
tau = 0.25 (parametrisation and located zeros of `c20-statement-o-line4-heat-zero-enclosures-server`; rows P8, P1 only,
since HEAT has no ordinary Dirichlet series: rows EF, P45 are "not formulable"); sign twist (Liouville, D = zeta(2s)/zeta(s),
no completion: F = D, meromorphic); unimodular twist D = zeta(s + i alpha), alpha = 1 (completed, not real on the real axis).

## Method

python-flint (Arb) balls. Zeros in R: Newton from a grid, each certified by the interval Newton test (unique simple zero in a
ball), completeness by the certified integer (1/2 pi i) contour integral of phi'/phi for each factor. Contour integrals:
`acb.integral` (rigorous). Truncation in n: majorant bound, for abs(a_n) <= 1, a_1 = 1:
sum_{n>N} abs(Lambda_D(n)) n^-sigma <= N^-(sigma-2) (-zeta'(2))/(2 - zeta(2)); variants for E_a and T-NR written in RESULT.md.
HEAT values: trapezoid representation and error bound of the c20 lane (its Lemmas Q, T), derivative error by a Cauchy estimate.
Test points are chosen away from zeros; no formula is evaluated at a zero.

## Prediction and threshold

Prediction (as assigned): every cell encloses 0. Refinement recorded before the run, from the algebra above: in rows P8 and P1
the cells with Q_gen enclose 0 for every control; the cells with Q_sym enclose 0 for zeta, DH, E_a, T-NR (and HEAT by evenness
and reality, where Q_sym is not separately computable from the stored samples); for the sign twist and the unimodular twist
the Q_sym cell is expected to exclude 0, because those controls lack evenness or reality. If so, that is a scope correction
to line 11 ("every control for which the identity is formulable"): the cited symmetric form is not formulable for them and
the general form is.

A cell counts as certified when its enclosure contains 0 and has radius below 1e-40 (absolute; the size of each side is
reported so that the cell is seen not to be 0 = 0). A cell whose enclosure excludes 0 is a correction to line 11 and to the
cited map row, reported with the term responsible. Non-triviality: abs F at the rates bounded below, at least one zero in
each R, and the zero-side sum bounded away from 0.

Outcome: line 11 relabelled MEASURED-certified per cell, or corrected. Referee: three cells recomputed with independent
code (mpmath, own zero finding, own quadrature).

# REFEREE pass: twistor ("Twistor duality and the dual intertwiner") — 2026-11-20

Scope: attack the first reviewer's verdict (VERDICT.md / NOTES.md), not the project. All computation ran through
`scripts/memcap.sh 8` with `.venv-arb/bin/python`; own scripts and logs are in `./referee/`.

## 1. What I re-ran, and how independent it is

The first reviewer's replays of `certify_signed_window.py`, `certify_absolute_obstruction.py`, `verify_subdivision.py`,
`verify_structure.py` and `test-rigorous-twistor.mjs` are re-executions of the project's own code. They show the
package is reproducible, not that it is right. The reviewer's own scripts (`fourier.py`, `hankel.py`, `proper.py`)
are independent of the package but had no second implementation behind them. I wrote two new ones from the .tex
only, sharing no code with either the package or the first reviewer.

(a) `referee/ref_schur.py` — the whole Fourier-dilation Schur argument rebuilt in ordinary floating point
(mpmath 25 digits for lambda_k, numpy for the 33x33 matrices), in the complex exponential basis rather than the
package's real cos/sin basis:

| quantity | mine | package / report |
|---|---|---|
| max abs(lambda_k quadrature - lambda_k closed identity), k<=16 | 2.6e-26 | (identity asserted) |
| n_-(B), n_-(S), s=+1 | 28, 28 | 28, 28 |
| n_-(B), n_-(S), s=-1 | 29, 29 | 29, 29 |
| min abs spec S_+ | 9.903747688e-4 | 9.903747686e-4 (lower bound) |
| min abs spec S_- | 7.828557550e-2 | 7.828557550e-2 |
| Woodbury gap, s=+1 | 2.22801224e-5 | 2.22801224e-5 |
| Woodbury gap, s=-1 | 1.74098139e-3 | 1.74098139e-3 |
| min singular value of B_s | 1.3729137544e-2 | 1.372913754e-2 |
| direct gap alpha - lambda_max(B_s G) | 2.6896e-5 (s=+1), 2.4923e-3 (s=-1) | not reported |
| tail bound at k=17 | 0.8229751 | 0.8229750 |
| max abs lambda_k, sampled 17<=k<=2000 | 0.65484 at k=21, 0 violations of A w^-1/4 + B/w | (first reviewer: 0.6548) |

The direct gap (top eigenvalue of W B W* computed as the top eigenvalue of B G) sits between the Woodbury bound
and the true gap (3.77e-5, 3.19e-3 from Galerkin), as it must. The inequality chain
sH <= delta I + W(sD - delta I)W* was re-derived by hand (W W* = I on the interval; omitted blocks <= delta).
Certificate margin: 2.228e-5 against the claimed 2.0e-5 (relative 11%), and 0.823 against 0.85 in the tail; float
error in my run is of order 1e-13, so rounding is not a plausible failure mode even though the formal rigour still
rests on mpmath.iv (not Arb, not a proof assistant).

(b) `referee/ref_galerkin.py` — a second Galerkin discretisation (direct triangle-weighted cell integrals by
Gauss-Legendre in x = t^(1/4), kernel written as t^(a-1) s(t) - P(t)); the first reviewer used second differences of
a second antiderivative. Results at a = 1/4:

| case | L | N | mine | first reviewer | report |
|---|---|---|---|---|---|
| zeta | 1.5 | 1024 | 0.9999617207765692 | 0.9999617207765719 | 0.999961720777 |
| zeta | 1.5 | 2048 | 0.9999622890046 | 0.99996229 | |
| zeta | 1.3 | 1024 | 0.9937683910464 | | 0.993768391046 |
| zeta | sqrt 2 | 1024 | 0.9996548742143 | | 0.999654874214 |
| zeta | 8 | 3072 | 0.99999992383 | (0.99999992 at L=10,12) | |
| DH, own gamma factor | 1.5 | 1024 / 2048 | 0.8797565 / 0.8797572 | 0.8798 | |
| DH | 3 | 1024 | 0.9999989148 | 0.9999989 | |
| DH | 6 | 2048 | 0.9999997997 | 0.9999998 | |
| DH | 8 | 2048 / 3072 | 1.04732 / 1.04867 | 1.0473 / 1.0487 | |
| DH | 10 | 3072 | 1.06788 | 1.0679 | |

Sanity on the control: abs(Lambda_DH(z-a)/Lambda_DH(z+a)) = 1.000000000000000 at z = 1/2+3i, 1/2+20i, 1/2+60i
with Lambda_DH(s) = (5/pi)^(s/2) Gamma((s+1)/2) f(s); the off-line zero 0.808517182457+85.6993484854i recomputed;
Hurwitz-zeta form of f agrees with the Dirichlet series at s=2 to 1.6e-11. So the reviewer's central stress-test
finding stands under a second implementation: the Davenport-Heilbronn function, whose completed ratio at a=1/4 has
a pole in Re z > 1/2, satisfies the certified inequality on the certified window with margin 0.12, and is separated
from zeta only for L of about 7 and above. Galerkin values are lower estimates of the true norms (compressions), so
"DH norm > 1 at L = 8" is the solid direction and "DH norm 0.88 at L=3/2" is a converged float value, not a bound.

(c) Small checks: abs(chi(0.75+6.28817291957i)) = 1 and abs(chi(-16.4061448709)) = 1 (so the page sentence
"abs(chi)=1 exactly at sigma=1/2" is false, as the reviewer says); xi(1)/xi(4) - 15/(2 pi^2) = -1e-31;
max abs(R_{3/2}) over 300 random points in Re w>0 is 0.99688; the kernel g_a is negative on (log 3/2, log 2)
for a in {0.01, 0.05, 0.25, 0.5, 0.75, 1} (max over the interval -0.0139 ... -1.3e-8; at a=1, g=2 pi(3y-2)
vanishes exactly at the left endpoint); the 2^-a Schur-test proof and the coprime-dimension root proof were
re-derived by hand, both are elementary and correct; `scripts/test-rigorous-twistor.mjs` is indeed absent on the
working branch and present on origin/codex/twistor-rigorous-model-2026-10-03; the Lean file has no
sorry/axiom/native_decide and no `.lake` build exists (not compiled by me either).

## 2. Is "confirmed-weaker-statement" deserved?

Yes. The listed claim is "Twistor duality and the dual intertwiner" with routes /twistor and
/viz-twistor-dual-intertwiner. Nothing with that content is established about zeta. What survives is (i) a
classical intertwiner identity re-expressed in split-twistor terms, (ii) a computer-assisted inequality for
Suzuki's truncated Hankel operator at one width on a short window, (iii) three in-project negative statements,
(iv) a Lean diagram chase. I could not fault any of the reviewer's numbers.

## 3. Corrections to the first verdict

1. Literature, missed item. The reviewer read only abstracts and reported that the certified window "was not
   located". Reading the full texts: Suzuki, arXiv:1606.05726, Theorem 2.1 and Proposition 4.2, proves
   unconditionally, for every L-function in the Selberg class (real coefficients) and every pair (omega, nu) with
   nu*omega*d_L > 1, that there is tau > 0 with 1 +- K[t] invertible for all 0 <= t < tau. The tau is not explicit
   and the kernel is the nu-th-power regularisation, so for zeta at omega = 1/4 it covers nu >= 5, not the nu = 1
   operator certified here. Suzuki, arXiv:1204.1827, section 2 (after Theorem 2.3) and section 5: H_{omega,a} is
   compact self-adjoint for all omega > 0, Hilbert-Schmidt with 1 +- H_{omega,a} invertible for every a when
   omega > 1/2, and the range 0 < omega < 1/2 is described as open without RH. So the qualitative fact "a short
   initial window is unconditionally contractive/invertible, for any Selberg-class function, GRH or not" is in the
   literature for a regularised variant; the project's addition is an explicit window (L <= 3/2, constant
   49999/50000) for the unregularised kernel at a = 1/4, and an explicit elementary window for all 0 < a <= 1.
   I did not find those explicit constants anywhere (6 searches + two full texts; not an exhaustive search).
   This also gives a literature-level reason, independent of the DH numerics, why a short-window bound carries no
   zero information.
2. Structural remark the reviewer made only in passing and that should lead: for L <= 3/2 the operator depends on
   exactly two inputs, the archimedean kernel g_{1/4} (gamma factor times the s(s-1) factor) and the single number
   c(2) = 2^(1/4) - 2^(-1/4). The certified theorem is therefore a statement about one explicit special-function
   kernel and one real number. It cannot depend on any zero.
3. The reviewer's "Not 1 because ... the DH comparison gives a concrete numerical illustration of Suzuki's
   criterion" credits the project with the reviewer's own control experiment. The DH comparison is not in the
   package. It should not raise the importance score.
4. Status label. "interval-arithmetic certificate" is accurate for layer (2) only. The two listed routes are
   visualisations, and the working-branch /twistor page still lists four statements under "What It Establishes",
   of which at least two are false as written (abs(chi)=1 "exactly at sigma=1/2"; unitarity/"norm-preserving"
   intertwiner, when chi*Z is not the dual twistor of the same encoding). I keep the label because the schema
   allows one and the certificate is the only non-illustrative content, but the one-line now says so first.
5. Minor: the reviewer's wording "DH ... satisfies the certified inequality" is a float Galerkin observation
   (now from two implementations), not a certificate. Wording adjusted.

## 4. Scores

- Arbitrariness: 4 (unchanged). Upward pressure: the name-bearing content (toy incidence, the hand-chosen rational
  completion (w-1)(w-2)/((w+1)(w+2)), the choice of the 4-dimensional split model that produces width 3/2) is
  fixed by construction, which would be 5 on its own. Downward pressure: the operator is Suzuki's, L = 3/2 is the
  first round value past the first prime threshold sqrt 2, a = 1/4 is inside the range (0,1/2) that Suzuki calls
  open, and delta = 17/20, cutoff 16, degree 512 are proof internals that do not appear in the statement; that
  part alone would be 3. Uncertified sweeps (reviewer's and mine) show the inequality at every nearby parameter,
  so nothing singles out the certified point.
- Importance: 2 (unchanged, at the lower edge). The twistor-named layer alone is 1. The certificate is a correct
  explicit inequality on an operator from the literature in a width range where no global statement is known
  without RH, which is why it is not 1; but it uses only n <= 2, is satisfied with larger margin by a function
  with off-line zeros, has a qualitative precedent (Suzuki's unconditional tau > 0), and implies nothing about
  zeros, RH or the de Bruijn-Newman constant. An analytic number theorist would shrug.
- Novelty: minor-variation (unchanged), with the literature paragraph corrected as in 3.1.
- Verification: confirmed-weaker-statement (unchanged).

## 5. Not done

No Arb re-certification (the float reconstruction agrees to 9-10 digits and the margins are 4-8 orders of
magnitude above float error, so I judged it unnecessary for plausibility; it would still be needed for a claim of
rigour independent of mpmath.iv). Lean project not compiled (no local Mathlib build; downloading is not allowed).
The all-window alternative (limit 1 or infinity) attributed to Suzuki was not re-proved; the DH numerics
(1.049, 1.068 at L = 8, 10; first reviewer 1.091 at L = 12) are consistent with it. The width-perturbation
statement (a within 2e-8 of 1/4) was checked only arithmetically: (1869/4) * 2e-8 = 9.3e-6 < 1e-5.

# REFEREE (adversarial, lens: general): c3-multiwindow-converse-defect

Date: 2026-11-18. Object: `RESULT.md` in this directory. Claimed verdict: precise-obstruction, no new result,
flags R1 = R2 = R3 = R4 = false.

## Decision

**The verdict holds, with corrections.** The PROVED steps (the phase identity, Lemma B, Lemma C(a)) were re-derived and are
correct; Lemma C(b) is correct in substance and off by a factor 2 in its stated tolerance. The measured statements that
were re-run reproduce. Seven statements in the text are stronger than the files support (section 4). None of them changes
the verdict or the flags. Nothing assumes RH, nothing restates verified height as a result, and no known theorem is
presented as new (Hamburger and Kaczorowski-Perelli are cited as CLASSICAL; Lemma B is Dirichlet approximation plus
Stirling and is labelled as a lemma for the filter, not as a result).

Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. Re-derivation of the PROVED steps

**Identity (section 4).** On `s = 1/2 + it`, `1 - conj s = s`, `zeta(1/2 + iu) = Z(u) e^{-i theta(u)}`, `chi(1/2 + it) = e^{-2i theta(t)}`.
Then `chi(s) conj(zeta(s + i alpha)) = Z(t + alpha) e^{i theta(t + alpha) - 2i theta(t)} = zeta(s + i alpha) e^{i Psi}`,
`Psi = 2 theta(t + alpha) - 2 theta(t)`. Relative defect `|1 - e^{i Psi}| = 2 |sin(Psi/2)|`. Confirmed.

**Lemma B.** Dirichlet's simultaneous approximation with `Q = ceil(4 pi/eta)` gives `1 <= alpha <= Q^m` with
`dist(alpha lambda_j, Z) <= 1/Q`, so `dist(alpha log(T_j/2 pi), 2 pi Z) <= 2 pi/Q <= eta/2`. For t in window j and x in
`[t, t + alpha]`, `0 <= log(x/T_j) <= (H + alpha)/T_j`, so the second term is at most `Q^m (H + Q^m)/T_1 <= eta/2.1`.
The Stirling remainder is explicit: `2 theta'(x) = log(x/2 pi) - 1/(24 x^2) + O(x^{-4})`, so the third term is at most
`alpha/(12 T_1^2) <= eta^2/(50 Q^{3m})`, which is below `0.0238 eta` (the slack `1 - 1/2 - 1/2.1`) since `Q >= 13`. So the
lemma holds with the stated threshold exactly, not only to leading order; weakest step 3 of the result ("the error is
quoted, not bounded") can be closed with this line. Confirmed.

What Lemma B establishes: `zeta(s + i alpha)` satisfies zeta's functional equation on the m windows with relative error at
most eta. It does not produce an off-line zero (the translate's zeros are on the line if zeta's are), and it is a
statement about the exact functional equation, not about the model's defect rows (see 4.3).

**Lemma C(a).** `2 arcsin(eta/2) <= pi eta/2 < pi/2`, continuity of Psi in t keeps it at one multiple of `2 pi`, so
`|Psi(T) - Psi(T_0)| <= pi eta`. `d Psi/dt = log(1 + alpha/t) + O(t^{-2})`, hence for `alpha > 0`,
`Psi(T) - Psi(T_0) >= alpha log(T/T_0) - alpha^2/(2 T_0) >= alpha (log(T/T_0) - 1/4)` when `alpha <= T_0/2`, and for
`alpha < 0` the bound `|alpha| log(T/T_0)` holds without correction. Confirmed; the stated leading-order form needs
`log(T/T_0)` not small against 1/4.

**Lemma C(b).** Phase derivative of `L(1/2 + i(t + alpha), chi)` against zeta's is `log(q (t + alpha)/t)`; zero at two
heights forces `alpha = -T_j (1 - 1/q)` for both, hence `q = 1`. The mismatch formula `log(1 + (q - 1)(1 - T_1/T_2))` is
correct. Gap: "other shifts fail in the first window for the same reason" is not true as written; a shift within relative
`pi eta/H` of the matched one passes window 1. The correct two-window condition is that both derivative mismatches are at
most about `pi eta/H`, so failure is forced when `H log(1 + (q - 1)(1 - T_1/T_2)) > 2 pi eta` (factor 2 against the text).
The lemma is stated for primitive chi; its use for DH needs the remark that DH has the functional equation of conductor
5 with odd gamma factor (the code's `chi5` is the even real character, DH is built from the odd complex pair; the phase
derivative agrees to leading order, the constant differs). No effect on the conclusion.

## 2. Numerical re-runs (referee code in a scratch directory outside the repo; all through `scripts/memcap.sh 8`)

**2.1 Lemma B, cases not in the lane** (exact phase, `mpmath.siegeltheta`, 40 digits; `T_1` set to the lemma's threshold;
all integers alpha <= Q^m meeting the Dirichlet condition enumerated; five t per window):

| m | H | eta | Q^m | T_1 | height ratios | alphas found | worst relative defect of the first five |
|---|---|---|---|---|---|---|---|
| 2 | 2 | 0.5 | 676 | 1.93e6 | 1, 1.618 | 4 | 0.21 |
| 3 | 2 | 0.5 | 17576 | 1.30e9 | 1, 1.618, 2.9 | 6 | 0.24 |
| 2 | 5 | 0.2 | 3969 | 1.66e8 | 1, 3.3 | 4 | 0.105 |
| 3 | 2 | 1.0 | 2197 | 1.02e7 | 1, 1.1, 7 | 9 | 0.53 |
| 1 | 2 | 0.05 | 252 | 2.69e6 | 1 | 1 | 0.0019 |

All pass. At `T_1` a factor 1000 below the threshold (m = 2, eta = 0.5) the same alphas give 1.4 to 1.9: the height
condition is needed.

**2.2 A survivor the lane did not ball-check** (`surv_cluster_T100000_m1_d0.25.npy`, T = 1e5, m = 1, delta = 0.25),
referee's own acb code, 140 bits, different window point and X values:

| quantity | referee | lane (float64) |
|---|---|---|
| window defect at t = T + 0.91, X in {1/R, R^0.41, R} (ball upper bound) | 6.7e-10 | 1.1e-9 (grid) |
| abs F(s0), s0 = 0.75 + 100001 i | 2.0e-10 | 2.2e-12 |
| X-dependence at s0 | 2.5e-10 | 1.1e-10 |
| abs F'(s0) (difference quotient, h = 1e-3) | 5.33 | not reported |
| model at theta = 0 against acb zeta(s0) | 1.6e-14 (X = 1), X-dependence 1.8e-11 | "1e-11" |

The witness reproduces. With `|F'(s0)| = 5.3` the model function has a simple zero within about 4e-11 of `s0`, so the
"prescribed zero" is a zero and not only a small value. Float64 off-grid re-evaluation of four survivors (five off-grid t
per window, nine X): m = 1, delta = 0.02: 1.2e-10; m = 1, delta = 0.25: 8.2e-10; m = 1, delta = 0.4: 1.1e-6; m = 2,
delta = 0.25: 3.9e-5; all unimodular to 2e-16 and none within 0.9 rad of a translate `p^{-i alpha}`, `|alpha| <= 60`, on
the primes below N/2. Moving the weight contour from c = 0.5 to c = 0.8 changes the float64 values by 6e-10: the float
floor is 1e-10 to 1e-9, consistent with the lane's statement.

**2.3 Controls run by the referee (T = 1e5, model rows rebuilt off the design grid).**

| control | m = 1 | m = 2 (windows at T, T/2) | lane |
|---|---|---|---|
| zeta | 1.8e-10 | 1.8e-10 | 2.1e-10 |
| translate, lattice point k = +-1 (alpha = +-0.6494) | 3.3e-5, 3.5e-5 | 0.56 | not listed |
| translate, alpha = -8.4425 (lane's "best") | 2.8e-4 to 3.5e-4 | 0.15 | 3.5e-4 |
| translate, alpha = -9.0919 (k = -14) | 4.4e-4 | 7.0e-3 | 6.4e-3 (m = 2 best) |
| `L(s + i alpha, chi_5)`, shift scanned on 1601 points | 1.06e-3 | 1.59 (same alpha); 0.98 (matched at T/2) | 1.2e-3; 0.80 |
| DH, shift scanned on 1601 points | 8.4e-4 | 0.69; 0.49 | 2.8e-3; 0.50 |
| DH, `L(chi_5)` unshifted | 0.70, 1.33 | - | 0.70, 1.39 |

The conductor mechanism is confirmed: both conductor-5 controls go from 1e-3 at one window to order 1 at two, at the same
step, and the Euler product plays no part (DH has none and behaves as `L(chi_5)` does). No zeta-only mechanism is claimed
by the result, and none was found.

## 3. Checks against the data files

Counts: `N = round(3.2 sqrt(T/2 pi))` = 40, 128, 404, 1277 and P = 12, 31, 79, 206: correct. `pi(N)/30` = 0.4, 1.0, 2.6,
6.9: arithmetic correct. All entries of the verdict table, the rank table of Lemma A, the section 3.1 tables and the
control table were compared with `mw_*.jsonl`, `mw2_*.jsonl`, `mw_refine.jsonl`, `arbcheck.jsonl`, `translate_mw.json` and
`server_T1e6/`; they agree to the digits quoted, except as listed in section 4.

## 4. Errors and overstatements

1. **The column "best lattice translate" is not the best translate.** In `mw.py` the local minima of the scan in alpha
   are ranked by the sampled residual on a grid of step 0.0025, which is set by the distance of the grid point to the
   minimum and not by the depth of the minimum; six of about 185 lattice points are then refined. At T = 1e5, m = 1 the
   file reports alpha = -8.44 with 3.5e-4; the lattice points alpha = +-0.649 give 3.3e-5 (section 2.3), ten times
   smaller. The m = 1 entries of the control row "U: lattice translate (best, abs alpha <= 60)" (3e-3, 2.5e-4, 3.5e-4,
   6.6e-5) are upper values, not optima. The m = 2 entry at T = 1e5 (6.4e-3) was reproduced as the best of |k| <= 14.
   The translate start points of the zero search were chosen by the same ranking. The conclusion drawn from the row (the
   translates do not reach 1e-5 at these heights) is unchanged: 3.3e-5 > 1e-5.
2. **The crossover values are stated more sharply than the stated tolerance allows.** At tolerance 1e-5, T = 1e5, the
   witnesses are: m = 1 yes (1e-10), m = 2 no (1.9e-5 after refinement, stalled; 1.6e-5 at delta = 0.02). The measured
   bracket at T = 1e5 is `1 <= m* < 2`, not "2 to 3"; "2 to 3" is the value of `pi(N)/30`. At T = 1e4 no witness reaches
   1e-5 at m = 1 (3e-5 to 7e-5), so `m* < 1`, stated as "about 1". At T = 1e6 the bracket 4 to 8 is supported (6.6e-7 at
   m = 4, 2.2e-3 at m = 8). The brackets (<1, <1, [1,2), [4,8)) at four heights are compatible with `pi(N)/30` up to a
   factor of about 2 and do not separate `sqrt(T)/log T` from other growth laws of similar size.
3. **"Outcome A as the height grows at a fixed number of windows" is MEASURED, not PROVED.** Lemma B gives a translate
   that passes; the translate has no off-line zero of its own. The existence of a passing Euler product with a prescribed
   off-line zero at fixed m and growing T rests on the search results at m = 1, 2, 4 and on the parameter count. What is
   proved is the weaker statement in the claim: no fixed window count forces `chi(p) = 1` uniformly in T. Lemma B is also
   a statement about the exact functional equation; in the model the translate's defect at T = 1e5 is 3.3e-5 against an
   exact relative defect of 5.9e-6 times `max |zeta|` = 7.7 on the window, so the two agree here, but no general
   transfer from the exact phase to the model rows is proved.
4. **"DH passes m = 1 after a shift" holds only at the level 1e-3 to 5e-2**, two to four orders above the tolerance 1e-5
   applied to the witnesses. Under the tolerance of the test DH and `L(chi_5)` fail at m = 1 at every height run. The
   exact functional-equation phase of the shifted `L(chi_5)` has second derivative `4/T` in t, so its exact one-window
   defect is of order `H^2/T` (about 2e-5 at T = 1e5, estimate, not run); the model residual 1e-3 is about fifty times
   larger and is set by the model's use of zeta's gamma weights at s for a function whose weights sit at `s + i alpha`.
   "Fails only by conductor at m >= 2" should read: at m = 1 the residual decays roughly like 1/T; at m >= 2 it is of
   order 1 at every height. The non-monotone entry for `L(chi_5)` at T = 1e6 (4.6e-3 after 1.2e-3 at 1e5) and the DH
   entry at T = 1e5 (2.8e-3; 8.4e-4 on a finer scan) are scan-resolution effects of the 400-point grid.
5. **"c in 0.3 to 0.5" (verdict item 2).** From `translate_mw.json` the ratio of the measured optimum to
   `2 pi (H/(T log(T/2 pi)))^{1/m}` is 0.38 to 0.60 at T_1 = 1e5 and 1e7, and 0.34 to 1.23 at 1e9 (m = 3, 4 give 0.88 and
   1.23 and are not marked scan-limited in the table). "Within a factor 3" (section 4 of the result) is the supported form.
6. **"chi(p) is fixed for the other primes" is checked at one case.** The edge-prime account of the weak directions was
   run only at T = 1e5, m = 16 (rank 70 of 79). At the first m without a witness the rank is well below P: 66 of 79 at
   T = 1e5, m = 4; 170 of 206 at T = 1e6, m = 8; 177 of 206 at m = 16. With 13 to 36 weak directions left, the absence
   of a witness there is a local-search outcome and is not explained by the rank. The result says "not found" and lists
   this as weakest step 1; the phrase "the binding conditions are the window rows themselves" goes beyond that.
7. **Small items.** Section 3.2: the equality of the scores with `|zeta(s0)|` at T = 1e4 holds at m = 16 (0.22, 0.22,
   0.26, 0.39, 0.50) and not at m = 8 (0.21, 0.22, 0.26, 0.32, 0.46). R2 quotes the translate bound as
   `log T/log(1/eta)`; Lemma B's threshold gives `log T/(2 log(1/eta))`. Lemma C(b): factor 2 (section 1).

## 5. Requirement flags (referee)

- **R1 false.** Multiplicativity changes the number of unknowns from `2(N - 1)` to `pi(N)`. Bounded non-multiplicative
  sequences are pinned as well in the geometric layout, and the exact statement is Hamburger's theorem. No step needs
  the Euler product.
- **R2 false.** Lemma B (confirmed) shows that a fixed number of windows does not pin the phases uniformly in T; the
  measured crossover grows with T; the pinned regime gives "F equals zeta on the window".
- **R3 false.** The translate passes any fixed m at large height; DH and `L(chi_5)` are removed by the analytic conductor,
  which belongs to the functional equation. Six controls are not formulable in the model.
- **R4 false.** All objects are finite Euler products in a truncated approximate functional equation; nothing is derived
  for zeta or for the critical line.

## 6. What survives

In the round-2 finite model (smoothed approximate functional equation, X-range R = 2 at the top window, beta = 0.003,
windows of length 2, all primes `p <= 3.2 sqrt(T/2 pi)` free as phases):

- (MEASURED, reproduced, ball-checked at T = 1e5, m = 1 for delta = 0.1 and 0.25) unimodular Euler products exist with
  window defect below 1e-9 and a simple zero of the model function at distance 0.1 or 0.25 from the line; at tolerance
  1e-5 witnesses were found for m = 1 at T = 1e5 and for m <= 4 at T = 1e6, and not found (local search, no certificate)
  at T <= 1e4, at m >= 2 for T = 1e5 and at m >= 8 for T = 1e6.
- (PROVED) Lemma B with its stated threshold, including the Stirling remainder: `zeta(s + i alpha)`, alpha a positive
  integer at most `ceil(4 pi/eta)^m`, satisfies the functional equation with relative error eta on any m windows of
  length H above `T_1 >= (2.1/eta) Q^m (H + Q^m)`. Hence no statement "defect at most eta in m windows implies chi(p) = 1"
  with m, eta independent of T.
- (PROVED) Lemma C(a); Lemma C(b) with the tolerance corrected to `2 pi eta`.
- (MEASURED) Conductor-5 controls: 1e-3 at one window, order 1 at two, identical for DH and `L(chi_5)`.

No statement about zeros of zeta is made or supported.

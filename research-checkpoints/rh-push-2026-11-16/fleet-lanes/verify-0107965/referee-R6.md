# Referee report R6: arithmetic credits (sec 3.6, App D; eqs 74-76, 131-132)

Object: hexagon:2611.00460v1 (Raymond), plan sha256 ec346b7c..., source sha256 b59905d7... (both recomputed here).
Date: 2026-11-17. Local runs only, each through `scripts/memcap.sh 8`, Python `-I`. Nothing was run on the compute server.

## Verdict

**verified** for the content of R6, in this sense: every implication of App D.1-D.4 and sec 3.6 was re-derived by hand
from its stated hypotheses, no incorrect step and no missing argument was found, the four packet stages that
carry the finite hypotheses were read in full and replayed (all pass), the certificate arithmetic was recomputed
with separate code, and the proved inequalities were attacked numerically on the actual data without finding a
violation. Several of the bounds turn out to be sharp to rounding on the actual data, so the tests had power.

This verdict is conditional on three statements that belong to other referee parts and were **not** checked here
(section 6): (a) the identification of the finite head of the source with the polynomial
`P_{t,c}(chi)`, `chi_n = n^{i tau}`, `tau = x/2 + pi t/8`, `c = log(x/4pi)/4` (Thm B.1 Step 1; R4/R5);
(b) the affine native bound (70) with the stated `beta` for the 39 retained rows and the constant global debit
for the 28 shared rows (R5); (c) the jet rows' separate components (R7).

No correction to a number or an inequality is needed. Section 5 lists places where the written proof is
shorter than what the checker does; they are presentation notes.

## 1. What was read and run

Read in full: sec 3.1-3.6, App B (Thm B.1 and proof), App D of the TeX source; the four checker programs
`head_and_phase/verify_head_and_phase.py` (heads28), `global_analytic/check_retained_39_heads.py` (heads39),
`source_overlays/verify_source_overlays_independent.py` (overlays; it certifies the final retained payment
`d`, heads39 certifies only the older payment `d0`), `review/arithmetic_credit/build_credit_audit.py`
(credit map); `replay/launch.py`; the row loop of `referee/check_original_affine_native.py` (only to trace `beta`).
None of the four programs uses network, subprocess, eval or deletes files; none reads a stored PASS flag.

Replayed (packet code, python 3.15.2 / python-flint 0.9.0, not the pinned 3.12 / 0.8.0):

| Stage | Result | Checks | Compared with bundle record |
|---|---|---|---|
| heads28 | exit 0, PASS, 28 rows | 1,513,158 | same count, row table identical |
| heads39 | exit 0, PASS, 39 rows | counts by group identical | identical |
| overlays | exit 0, PASS | 32,403 in `global_common_clock_39_rows` | common-clock rows identical |
| arithmetic-credit-map | exit 0 | 650 | output JSON byte-identical |

Logs and outputs: `runs/R6-work/`. heads28/heads39/overlays do not depend on other stages' fresh outputs
(they read only the frozen inputs), so running them alone is meaningful for R6.

Own code (in `referee-R6-work/`, reads packet JSON as data only):

- `r6_lemmas.py` (12/12 pass): the analytic lemmas, tested at random parameters (section 3).
- `r6_exact.py`: recomputation of every certificate quantity with separate code (exact fractions, mpmath 60 digits).
- `r6_phasecheck.py`: the 263 shared-row phase distances at 250 digits.
- `r6_adversarial.py`: float64 attack on the proved inequalities (section 4).
- `r6_planbind.log`: the 67 scalar node lists and time cells used above equal those of the final plan; final
  head fields equal the tested ones (27 non-jet shared rows exactly; 37 non-jet retained rows `raw - C_comp - d`).

## 2. Step-by-step re-derivation

Notation: `a_n(t,c) = (1/2) d_t(n) n^{-1/2-tc} |F(n)|`, `s_n = sgn F(n)`, `P = sum s_n a_n chi_n`, `c0 = (log N0)/2`.

| # | Step | Finding |
|---|---|---|
| D.1a | `d_t = (b_t log) * b_t^{-1}`, triangular recurrence, `d_t' = (log^2 n/4) d_t + (log n/4) sum_{ab=n} d_t(a) d_t(b)` | Correct. Derived from `partial_t B = B''/4`, `D = -B'/B`: `partial_t D = (D'' - (D^2)')/4`. Nonnegativity and monotonicity follow by induction on n. Finite-difference test n <= 600 at four times: max deviation 3e-10; `d_0 = Lambda` to 1e-40. |
| D.1b | chord `a_n(t,c0) <= (1-theta) U_- + theta U_+` | Correct (monotone `d_t`, convex exponential). |
| D.2a | lower capacity `l_n <= (1/2) d_{t-}(n) n^{-1/2-t+ c0}|F(n)| <= a_n(t,c0)` | Correct, valid at `c = c0` only; the paper uses it only there (see D.2e). |
| D.2b | SOS template: `A Re u + B Re v - C Re uv <= (AB/C + AC/B + BC/A)/2` | Identity expanded by hand: `(C/2)|sqrt(A/B) u + sqrt(B/A) conj(v) - sqrt(AB)/C|^2` equals RHS - LHS for unit u, v. Numerical identity error 2e-15. It holds for all unit u, v, so it also covers a non-repeat template used on a repeated label. |
| D.2c | harmonic branch `C(1/A+1/B) <= 1 => deficit >= 2C` | Correct: `sqrt(1-cos)` is subadditive, then weighted Cauchy. `2C` is the exact minimum (attained at u=v=1). Fails as it should when the hypothesis is violated (tested at 1.3). |
| D.2d | repeated label: max of `(A+B) cos u - C cos 2u` | Correct (quadratic in cos u, vertex `(A+B)/4C`). |
| D.2e | `Re P_{t,c0} <= sum a_n - Delta_fix` for every unit tuple | Correct: each label's deficit `a_n(1 - Re s_n chi_n) >= 0` is split as `used_n + rest`, `used_n <= l_n <= a_n`; frustrated sign `s_m s_n s_mn = -1` gives third gauged phase `-uv`. Code checks sign, both occurrences of repeats, joint capacity. |
| D.2f | coordinate reserve `partial_c {Mc - Re P_{t,c}(chi)} >= mu = M - t+ sum (log n) U_{n,-}` for `c >= c0`, fixed tuple | Correct: `partial_c a_n = -t log n a_n`, `a_n(t,c) <= a_n(t,c0) <= U_{n,-}`. The tuple is held fixed while c moves from c0 to the physical c; no derivative of the physical phase in x is taken. This is what makes the c0-only capacities of D.2a sufficient. |
| D.2g | `c - c0 >= (1 - 4 pi N0^2/x)/4 > kappa0` for `x >= 6e12` | Correct. Value at 6e12: 2.16315e-7 against kappa0 = 2e-7 (8% slack). `4 pi N0^2 = 5999994808434.12 < 6e12 < X-4`. |
| D.2h | relation phases on the band `6e12 <= x <= 6.6e12` | Code requires gauge product +1 and `|phi - pi| <= pi - rho` at both extreme (x,t) corners, `phi = tau log R`. Since `phi` is increasing in x and t, the whole phase interval lies in `[pi - (pi-rho), pi + (pi-rho)]`, a subset of (0, 2pi): no multiple of 2pi is crossed, so `|k.theta| >= dist(phi, 2pi Z) >= rho`. All 263 relations rechecked at 250 digits: phases lie in [2.70, 3.59], minimum slack of the paid distance 5.6e-51 (positive; the stored value is the bound rounded down). |
| D.2i | Gram step: `U = G~ + m 2^-64 I >= G`; `U - UWU = L D L^T`, `D > 0` => `V^T W V <= I` | Correct. `U - UWU > 0` forces `U > 0`, then `U^{1/2} W U^{1/2} < I`, same nonzero spectrum as `W^{1/2} U W^{1/2}`, then `G <= U`. Independent check: largest eigenvalue of `W^{1/2} G W^{1/2}` computed at 60 digits for all 28 rows: 0.99998474 in every row (< 1). |
| D.2j | `sum r_p theta_p^2 >= E` and eq (132) | Correct. Both cases checked (one large angle; all angles below `sqrt u` with `(1-cos v)/v^2` decreasing on [0, pi]); the alternating bound needs `u <= 12`, the monotonicity needs `sqrt u <= pi`; `u <= 6` gives both. |
| D.2k | near/far: `C_orbit <= min(C_near, C_far)` | Correct. Near (x <= X1): `Delta_fix + C_near` at c0 for the actual tuple, plus `mu (c - c0) >= mu kappa0`. Far (x >= X1): `Delta_fix` at c0 plus `mu (c-c0) >= mu kappa0 + C_far`. The two closed domains cover `x >= X`. `mu` is used once: the shared rows carry a constant global native debit (no slope taken by the debit). Recomputed: `paid <= near` and `paid <= far` in all rows (far is 0.041-0.056, paid 0.0065-0.0113). |
| D.3a | composite inequality `1 - Re prod z_p^{e_p} <= Omega sum e_p (1 - Re z_p)` | Correct for unit z (subadditivity of `|sin(x/2)|`, then Cauchy with Omega terms). 2e5 random tests, minimum slack -3e-16; ratio tends to 1 at equal small angles, so the charge `r_n Omega e_p` is sharp. |
| D.3b | composite payment and residual capacities | Correct: `a_n(1 + Re prod) >= 2 r_n - r_n Omega sum e_p (1 - Re z_p)`; prime p keeps `alpha_p = cap_p - sum r_n Omega e_p`. Capacities use `d_{t-}` and attenuation `t+ 27/4`, valid for `t in [t-,t+]`, `L0 <= L <= 27`. |
| D.3c | polydisc extension past L = 27 | Correct: `n^{-t(L-27)/4}` is multiplicative, so `P_{t,c}(chi) = Q(rho chi)` with `Q = P_{t,27/4}` a polynomial in the prime variables and radii `p^{-t(L-27)/4} <= 1` (t >= 0); `Re Q` is pluriharmonic, so its torus bound holds on the closed polydisc. Triangle mass at 27 is below the c0 chord. No main slope used. At t = 0 the radii are 1 and the statement is the torus bound itself. |
| D.3d | clock identity (75) | Correct: `x/2 = 2 pi e^L`, `e^L = N0^2 (1+v)`, so `tau/pi = 2 N0^2 (1 + v + q)`; `k.theta/pi = a(1+v+q) + parity (mod 2)`; the code's condition `parity * (-1)^h = -1` is exactly what makes `k.theta/pi - (1+delta)` an even integer. Tested on the actual orbit (39 rows x 3 times x 60 centres x all relations): distance to an even integer <= 1.1e-14. |
| D.3e | `|delta| < 1 => sigma k.theta >= pi (1 + sigma delta)` | Correct (case k.theta > 0 forces m >= 0; case < 0 forces m <= -1; k.theta = 0 impossible). Largest `|delta|` on the rectangles: 0.9797 (row 8, eighth relation, v = V); all other rows <= 0.62. |
| D.3f | conjugate `C*(alpha,b)` | Correct: stationary points `sin u = b/alpha`; the one at `arcsin` is the maximum, the other a minimum; compare with the endpoint `pi|b| - 2 alpha`. Brute-force test 3000 cases, deviation 3e-11. The endpoint exceeds the interior value for `|b|/alpha >= 0.7246`; the stored multipliers keep `|b|/alpha <= 0.720`, and overlays takes the maximum of both candidates anyway. |
| D.3g | (76): `J >= B_comp + F(v,q)`, concave, four corners | Correct. `A Delta = (A/4) log(1+v)`. For a fixed sign vector `F_sigma` is affine plus a positive multiple of `log(1+v)`. The actual sign vector may change from point to point; this is harmless because the corner bound is proved for each of the 2^m fixed vectors. The checker bounds each `a_j` by an enclosure and uses the unfavourable end per sign. Recomputed all branches (128 per row, 256 for row 8): minimum corner margin 6.87e-5 (row 8) to 6.3e-4, equal to the packet's figures; interior grid values are above the corner minimum. |
| D.3h | near/far for the retained rows | Correct. Near `0 <= Delta <= d/A`: `e^{4 Delta} - 1 <= e^omega - 1 <= omega/(1-omega) = V`. Far `Delta >= d/A`: `A Delta >= d` with the phase-free bound (direct for L <= 27, polydisc beyond). `A = (1-beta) M` is the slope left after the native debit took `beta M`; it is used in exactly one of the two alternatives. `beta` in overlays/heads39 is read from the same record that the affine stage verifies. |
| D.4 | composition: `H - C_comp - d` (retained), `sum U - Delta_fix - mu kappa0 - C_orbit` (shared), conic factor | Recomputed exactly for the 27 non-jet shared rows and 37 non-jet retained rows; the jet rows 0, 16, 44 through the packet's credit map (650 checks) only. Row 8: 11043047769/10^12 - 8143047769/10^12 = 29/10000. Relation `3^4 5 11 19^2 23 47 71 / (2^4 7^5 13 17 31 67) = 123435179505/123435179504` confirmed; `a_8 = 7.7362777`, `h_8 = 7`. |

## 3. Failure modes looked for

| Failure mode | Finding |
|---|---|
| bound proved on an open range, used at an endpoint | Not found. The band and the near/far domains are closed and overlap at their common endpoint; `|delta| < 1` is checked strictly on the closed rectangle; time cells are closed, and `t- = 0` (row 0) is covered (`d_0 = Lambda`, 26 prime-power allocations, radii 1). |
| supremum at infinity | The far bounds grow with x (`mu (c - c0)`, `A Delta`); the composite bound for `L -> infinity` is the polydisc bound, uniform in L. Tested at L = 27, 29, 40 and at x up to 9e60. |
| limit/maximum interchange | The coordinate derivative is taken at a fixed tuple and the tuple is inserted afterwards (D.2f). The sign vector of the relations is not assumed constant (D.3g). |
| remainder valid only in a range | The cosine polynomial is used with `u <= 6`; `C*` covers `|b| >= alpha`. |
| inequality used in the wrong direction | Checked for every capacity: upper caps `U` use `d_{t+}` and the smallest attenuation, lower caps use `d_{t-}` and the largest; `mu` uses upper caps and rounded-up logs; credits are subtracted from an upper bound of `Re P`, which enters `J` with a minus sign. |
| phase interval crossing a multiple of 2 pi between checked endpoints | Excluded (D.2h, D.3e). |
| resource spent twice | Shared: `used_n <= l_n` jointly, the Gram matrix uses `l_p - used_p`. Retained: `alpha_p <= cap_p - spent_p`; the old payment `d0` is replaced by `d`, and `d` is certified as a total (overlays: `margin = F - target > 0` with `target = d0 + gain`), not as an increment on an unverified `d0`. Main slope: D.2k, D.3h. |
| appeal to an earlier preprint | None inside R6. The 39 retained rows reuse old node lists and old multiplier data; all are re-verified as data. |

## 4. Numerical attack on the proved inequalities (float64, not a proof)

`r6_adversarial.py`, 6204 centres x (exact phases `(x/2) log p mod 2 pi` by 300-bit integer arithmetic; x from X-4 to
9e60, dense in [X, 6.75e12]), three times per row, all 4095 labels, own coefficient code. L-BFGS minimisation over
the 564 prime angles; relation constraints imposed exactly through a null-space parametrisation. 0 violations.

| Test | Claim tested | Result over rows |
|---|---|---|
| S1 (28 rows) | torus minimum of the lower-capacity deficit >= `Delta_fix` | minimum found exceeds `Delta_fix` by -3e-16 to 1.5e-4 (0 to 0.9% of `Delta_fix`): the fixed payment is essentially the true torus minimum |
| S2 (28 rows) | minimum subject to the certified relations at band points >= `Delta_fix + C_orbit` | excess 0.0089 to 0.0203 (1.2 to 2.5 times `C_orbit`) |
| S3 (28 rows) | actual orbit: `M c - Re P_{t,c}(chi_x) >= M c0 - chord(final scalar head)` | minimum margin 0.345 |
| R1 (39 rows) | torus minimum with L = 27 capacities >= `C_comp`; `chord - max Re P - C_comp >= 0` at L = 27, 29, 40 | 4e-10 (row 0, sharp) to 0.0072; 7.5e-4 to 0.016 |
| R2 (39 rows) | minimum subject to the relations at rectangle points, plus `(A/4) log(1+v)`, >= `C_comp + d` | margin 0.0018 to 0.0162 (26% to 76% of `d`); all 128/256 sign branches for rows 0, 8, 66, 12 branches elsewhere |
| R3 (39 rows) | actual orbit: `A Delta + raw chord - Re P >= C_comp + d` | minimum margin 0.157 |
| control | without the relations the retained payment would fail | unconstrained torus minimum is below `C_comp + d` in every row (by up to 0.0071), so R2 does test the relation argument |

Random physical centres are far from the extremal tuples (S3, R3 margins are large); the informative tests are the
torus and constrained minimisations. A local minimiser gives an upper bound for the true minimum, so these tests
can refute but not prove.

## 5. Notes on the written proof (no effect on the result)

1. D.2, "the clock interval is checked continuously at its extreme x, t values": the argument needs monotonicity
   of `tau log R` in x and t and the fact that both endpoint phases lie in one interval around pi inside (0, 2 pi).
   The checker enforces exactly this; the text should say it.
2. D.2: the lower capacities hold only at `c = c0`. The text is correct because the coordinate reserve is applied
   at a fixed tuple, but a sentence stating that the near-band payment is first proved at `c0` and then
   transported by `mu (c - c0)` would remove the appearance of a range problem.
3. D.3: the composite inequality is stated for "gauged unit prime phases"; it is false inside the polydisc and is
   used only on the torus at `L <= 27`. The text does this correctly; the order of the two steps matters.
4. Sec 3.6 and D.3 state the guard `L0 + log(1+V) < 27`. heads39 checks `L0 + omega < 27` (enough, since the near
   domain is `L <= L0 + omega`); overlays checks the stated form. Both hold: `L0 = 26.89176`, `omega < 0.038`.
5. The stage that certifies the final retained payment `d` is `overlays` (`verify_main_clock`), not heads39.
   heads39 certifies the capacities, the composite allocation, the residual floors and the older payment `d0`
   (by a more conservative dual with separate worst clocks, 64 patterns plus sign symmetry). A partial replay
   that omits overlays does not cover (76).
6. `kappa0` has 8% slack against the true coordinate surplus at `x = 6e12`, and the stored phase distances
   have slack of order 1e-50: both are exact comparisons and both hold; they are simply tight by construction.

## 6. Not checked here

- Thm B.1 Step 1: that the source functional equals `M c - Re P_{t,c}(chi_{x,t})` minus the charged debits, with
  completely multiplicative phases on one clock, the restored Euler prime powers, and `M c` from the normaliser
  (R4, R5). All of R6 is a statement about that polynomial.
- The affine native bound (70), the value of `beta`, and the constant global debit of the shared rows (R5).
- The jet components of rows 0, 16, 44 and the exact conic assembly of their fields (R7); for these three rows
  only the scalar parent was tested here.
- Rigour of own numerics: `r6_exact.py` uses 60-digit floating point (not intervals) for the transcendental
  quantities; `r6_adversarial.py` is float64. The interval-arithmetic statements rest on the packet's own
  512-bit Arb stages, replayed here with python-flint 0.9.0 rather than the pinned 0.8.0.
- The stages native, activation (run by the map author), spectral, wall, kernel, arcs, affine, interfaces,
  physical-debit-map, direct-source were not run for this report.
- Whether the capacity, allocation and multiplier data are optimal (irrelevant to validity).

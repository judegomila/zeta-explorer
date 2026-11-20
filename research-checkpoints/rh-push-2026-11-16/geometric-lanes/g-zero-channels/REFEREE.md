# REFEREE: g-zero-channels/RESULT.md

Date: 2026-11-16. Adversarial referee pass. Scripts used are in /tmp/ref_gzc (poly.py, tail.py, dh_ref.py, wl.py, indep2.py, mychk.py); nothing in the result directory was changed except this file.

## Verdict

Holds as a partial result with corrections. Every step labelled PROVED was re-derived and confirmed. The certificate data was spot-recomputed and the post-processing reproduced. The DH control was rerun independently and agrees. Nothing assumes RH. Nothing here is new zero information and the result says so.

## PROVED steps re-derived

| Step | Status | Note |
|---|---|---|
| Zero ODE, `q' = 2 - qS` | confirmed | `g' = 1/g - (g/2)S`, so `q' = 2 - qS`; `S >= 0` when all zeros are real. |
| 1.2 coupling relations | confirmed | The sum for `X_yy/X_y` runs over all zeros of `X_y`, including `c = 0` and any non-real ones, taken symmetrically (conditionally convergent). |
| Lemma 1 (wall-height law) | confirmed | `dW/dtau = F_ss(c)/4`; `F_ss/F = (F_s/F)'` at `c`; Hadamard for order 1. Sign checked: on the line the value is `+(1/4) sum (y_c - gamma)^-2`. |
| Corollary 2 | confirmed | `1/a^2 + 1/b^2 >= 8/g^2` at `a + b = g`. Conditional on all zeros real; not an independent proof of de Bruijn preservation. |
| Corollary 3 | confirmed | Real part of `-(1/4)(i d - beta)^-2`. |
| Lemma 3 | confirmed | Local model `X = alpha(y^2 - (tau - tau*)/2)` gives `q = 2(tau - tau*)`, `W/q = -alpha/4 = -X_yy/8`. "Nonzero through a collision" needs `X_yy != 0` there (no triple zero); the text omits this hypothesis. |
| Proposition 4 | confirmed | Uses exactly one critical point between adjacent zeros, which holds in the Laguerre-Polya class. |
| Tail bound (3.1) | confirmed | Phi bound, split at `U = 5`, exponent `8 pi - 2 - 8/U = 21.53 >= 21`; value recomputed as `8.38926e-100` for `J = 240`. Phi bound checked numerically at five points; `8 int u^2 Phi = 0.00574299`. |
| Cell enclosure | confirmed | `b_n' = (n+2)(n+1)/4 b_(n+2)` is exact for the truncated system; the code bounds `b_(n+2)` on the cell by direct ball evaluation, so the enclosure is not circular. |

Polynomial test (poly.py, 7 real zeros, and a case with a complex pair, 40 digits, finite difference in tau): Lemma 1 agrees to 12 digits at every critical point; Lemma 3 `S + R` agrees to 12 digits on two pairs.

## Numerical reruns with different cases

- Wall law at other critical points (near zeros 4/5, 20/21, 34/35, 71/72): both sides agree to 7 digits (limited by the density tail), e.g. `3.21040304` against `3.210403263` at `y_c = 111.3727`.
- `channels.py` rerun locally on zeros 71-72: 24 records identical to the stored JSON. Zeros 101-103 (outside the claimed set): 36/36 cells pass. Zero 34 with 24 cells, `J = 200`, 1200 bits: 24/24 pass.
- `post.py` reproduced: 1200 records, FAILURES 0, fit slope -0.7679. A separately written chain/disjointness check in exact rationals gives 0 failures (worst chain ratio 3.2).
- Independent check not using Arb or the jets: `F_tau` from the Phi integral (mpmath, fixed Gauss-Legendre rule, relative quadrature error about 5e-4). Winding number on the certified `r_max` circle is 1 for zero 34 at `tau = 0.45, 0.5, -0.1, -0.05` and zero 35 at `tau = -0.1, -0.05`; root offsets from the centres (0.019 to 0.027) match the stated drift.
- The other 1140 cells of the main run were not recomputed; they are accepted from the JSON.

## DH control (rerun independently, dh_ref.py)

Different centre (`y = 85.8`), radius 2.5, 800 nodes, `J = 200`, 900 bits, and a different detector (sign change of the wall value at the on-line critical point):

- Off-line zero of `xi_DH` by Newton on the function itself: `0.808517182456637 + 85.6993484853776 i`.
- `tau* = 0.176505` (result: 0.1765). `d(x^2)/dtau = -0.505` on `[0.16, 0.17]` (result: -0.502 nearer the collision).
- `W/(tau - tau*) = 1.01e-28` at `tau = 0.2` (result: 0.99e-28 to 1.20e-28).
- After `tau*` the two zeros are on the line; before it the on-line critical point has `W != 0`.

The result claims no zeta-only mechanism and none was found: all lemmas hold for DH on `tau > tau*`. That is consistent with the obstruction verdict.

## Errors and overstatements

1. **Section 6, factor 4 (error).** For polynomials `sum_k d/dtau log|W_k| = 4 sum_i (gamma_i')^2`, not `sum_i (gamma_i')^2`. Derivation: `Disc = const x prod_k W_k`, and `d/dtau log|Disc| = 2 sum_i gamma_i' V_i = 4 sum_i (gamma_i')^2` with `gamma_i' = V_i/2`. Numerical check: 13.6738185 against 3.4184546. Not in a PROVED step.
2. **"Relative margin is flat" is partly a cell-width artifact.** `mu` is maximised over `r` at a centre that is off the zero by the drift over half a cell (about `0.38 x 0.025`), so `mu ~ 1 - 2 sqrt(|b_0 b_2|)/|b_1|` depends on the cell width. Halving the cells moved zero 34's minimum from 0.484 to 0.643. The block means 0.80-0.83 describe the 0.05 cell width, not an intrinsic quantity. At fixed cell width the margin must fall as the spacing shrinks (the fitted slope -0.035 per unit `log gamma` is that effect); "does not decay with height" is supported only on 14 < gamma < 237.
3. **"PR 57's fixed-disk method certifies zero 1 only" is true only for the single-step interval `delta = 0.05`.** The column `delta_PR57 = abs/0.0057429` uses this result's linear-comparison Rouche margin as a stand-in for PR 57's boundary floor; the true floor can be several times larger (for zero 2 at most about `|F_s| r ~ 4e-5`, giving `delta` up to about 6e-3 against the tabulated 8.4e-4). The qualitative conclusion stands (`0.05 x 0.00574 = 2.9e-4` exceeds any boundary floor from zero 2 on). PR 57 section 2 also describes a stepwise variant, which is not subject to this limit.
4. **Section 1.4, items (iii) and (iv), are not proved as written.** (i) <=> (ii) is fine provided each tube is individually symmetric. (iii) => RH needs that a non-real pair existing at some `tau < Lambda` reaches the line at finite height at a time in `(0, 1/2]` (no escape to infinity along the flow); `W != 0` at on-line critical points also holds while a pair is still off the line (DH at `tau = 0`: `W = -1.48e-29`), so the argument has to go through the collision instant. That compactness step is not supplied. (iv) writes the integrand with real zeros and an index `k` that is not defined when zeros are off the line. Label should be "sketch, one lemma missing", not an equivalence.
5. **"No margin version exists" (1.4) is not established by Lemma 3.** Lemma 3 gives `W ~ q x const`; unboundedness of the relative wall height needs normalised gaps with liminf 0, which the result itself calls conjectural in 3.3. The eq48 referee result is the correct citation.
6. **Proposition 5 and the closing equivalence** ("every curve `Im xi = 0` from `Re s = +infinity` ends at a critical point on the line") are a sketch. The local facts check (on-line simple zero: the only `Im F = 0` curve through it is the line; on-line critical point: line plus a transversal). The global claim that every such curve comes from `+infinity` was not verified here and is not proved in the result.
7. **Lemma 3 is a change of variable, not a cancellation with content.** `W_k/q_k = -X_yy(c_k)/8 (1 + O(q))`: the statement that it is regular through a collision is the statement that `X_yy` is smooth. The result says this itself ("not a barrier"). No coupling norm is reduced.
8. Minor: backward `reach` uses the gap `g` at `tau = 0.025`, not at 0; `c >= 1/2` from `q' <= 2` is conditional on all zeros staying real on the interval. DH jets have no tail proof (stated). Zero 100's tube is not checked against zero 101 in `post.py`; the rerun here puts zero 101's centre 1.26 above with zero 100's `r_max = 0.50`, so there is no overlap.

## RH-independence

The certificate uses only the Phi integral bound, Arb jets of xi, Rouche and reflection. The lemmas are stated "while all zeros are real", which holds unconditionally for `tau > Lambda` and is otherwise a hypothesis, not a use of RH. The statement that tube `k` holds the `k`-th zero at `tau = 0` relies on the classical count `N(237) = 100`. No hidden RH use found.

## Surviving claim

CERTIFIED (Arb plus the confirmed tail bound; 60 of 1200 cells recomputed by the referee, the rest accepted from stored data): 100 pairwise disjoint moving disk chains, each holding exactly one zero of `F_tau`, on the line, for all `tau` in `[-0.1, 0.5]`; zeros between tubes for `tau != 0` not counted. PROVED: Lemma 1, Corollaries 2 and 3, Lemma 3 (with the no-triple-zero hypothesis), Proposition 4. MEASURED and reproduced: absolute margin `exp(-0.768 gamma)`; DH pair lands at `tau* = 0.1765` and then carries one-zero disks. The obstruction verdict (no step uses the Euler product; the only zeta/DH difference is the terminal statement at `tau -> 0`) stands. Corrections 1-5 apply. No RH content.

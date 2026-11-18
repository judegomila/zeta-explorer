# REFEREE: c3-lemmab-halfplane-growing-s (adversarial, lens: general)

Date: 2026-11-18. Target: RESULT.md, claimed verdict precise-obstruction, flags R1-R4 all false.
Referee verdict: **holds, with corrections.** Every step labelled PROVED was re-derived and confirmed. The numerical
identity was rerun on new cases (different S, T_w, T, sigma_0 and a different profile) and closes. Five errors or
overstatements were found; none changes the verdict or a flag. No statement about zeros of zeta is made in the result,
RH is not assumed, verified height is not restated, and the classical items are labelled CLASSICAL.

Referee scripts were kept outside the lane (`/tmp/ref_c3/r.py`, `r2.py`); they import the lane's `t1.py`/`t2.py`
read-only plus an independent prime-line routine. Runs local, `scripts/memcap.sh 8`. The compute server was not used.

## 1. Re-derivation of the PROVED steps

**Lemma 2 (shifted Lemma B). Confirmed.**
- Local functional equation: `1/(1 - p^s) = -p^(-s)/(1 - p^(-s))`, so `zeta_S(-s) = (-1)^|S| N_S^(-s) zeta_S(s)` and
  `zeta_S(delta - z) = (-1)^|S| N_S^(delta - z) zeta_S(z - delta)`. Expanding on `Re z = kappa` gives
  `(-1)^(|S|+1) sum Lambda(n) (N_S m m' n)^(-z) (N_S m'/m)^delta n^(-1/2) W W#`, which is the stated line after
  relabelling m <-> m'. (`kappa > max(delta, 1/2)` suffices; the stated `kappa > 1/2 + delta` is stronger than needed.)
- `W(z) W#(-z)` is the Laplace transform of `C_w(v) = int w(u+v) conj w(u) du`, supported in `|v| <= T_w`; inversion
  gives `C_w(-log x)`, zero for `log x > T_w`. Every term has `x >= 2 N_S` for every delta. Threshold `log(2 N_S)`
  independent of delta: confirmed.
- Residue at `z_0 = delta + 2 pi i k/log p`: `(1 - p^(z - z_0))^(-1) ~ -1/((z - z_0) log p)`, `W#(-z_0) = conj W(-delta + it)`,
  remaining factors `zeta_S(2 delta + it) zeta_{S-p}(-it) zeta'/zeta(sigma_0 + it)`. Sign and form confirmed. The poles
  are simple for `k != 0` (lattices of distinct primes meet only at k = 0).

**Corollary B1'. Confirmed.** Parseval for the `log p`-periodisation needs `T_w <= log p` (stated). `|zeta_p(2 delta + it_k)| = (1 - p^(-2 delta))^(-1)`
because `p^(-it_k) = 1`. `Den >= (1 + p^(-delta))^(-2) ||w||^2`. `1 <= K_w <= e^(delta T_w)` by Cauchy-Schwarz and the
support. So `sqrt(p) -> p^(sigma_0 - 1/2)` in the worst case over profiles: confirmed.

**Lemma 3 (contour form). Confirmed, one omitted hypothesis.** On `Re z = delta +- eta`: `|zeta_S(-+eta - it)| <= prod p^eta/(p^eta - 1) <= prod (1 + 1/(eta log p))`,
`|zeta_S(delta + z)| <= zeta_S(2 delta - eta)`, and Cauchy-Schwarz with Plancherel gives the factor
`2 pi e^((delta+eta) T_w) ||w||^2`. Two lines and `2 Re` give the constant 4. Omitted: the lines `Re s = sigma_0 +- eta`
must avoid `s = 1` (pole of `zeta'/zeta`); see error E3.

**Lemma 1 (labelled CLASSICAL). Checked.** Borel-Caratheodory with `R - r = eta`, `r, R < 3/2` gives `(3/eta)(A L + 1)`,
within the stated `(4/eta)(A L + 1)`. Three-circles exponent `(1 + eta - sigma)/(1 - Theta) + O(1/LL)` confirmed;
Cauchy on radius `1/LL` needs `sigma_0 >= Theta + 4/LL` (stated). It is the Titchmarsh 14.2 argument with 1/2 replaced
by Theta; not presented as new.

**Proposition 4. Arithmetic confirmed.** `e^(delta T_w) LL^2 L^(theta) <= c L` gives `T_w <= ((1 - theta)/delta) LL`,
`1 - theta = (sigma_0 - Theta)/(1 - Theta)`, hence `f`. `f' = (Theta - 1/2)/((1 - Theta)(sigma_0 - 1/2)^2) >= 0`,
`f(1) = 2` for every Theta, `f = 2` identically at Theta = 1/2 (for `sigma_0 >= 1/2 + 4/LL`). Values 0.2078, 0.5,
1.3333, 2 at Theta = 7/8 confirmed by hand. See E2 and E4 for scope.

**Proposition T (CLASSICAL). Confirmed.** Partial summation with `psi(x) <= 1.04 x` gives `2.08 sqrt(x)`;
`T_w <= 2 log(log(T/2 pi)/4.16) = 2 LL - 2.85`.

**Proposition 5. Confirmed.** For `delta > 1/2`, `Phi_delta` is analytic in `|Re z| < delta`, which contains the
critical strip, and `sum Lambda(n) n^(-1/2-delta)` converges, so the Weil formula applies to `Z_S w`; subtraction from
Lemma 2 gives the identification. This shows Lemma 2 is the explicit formula for a non-compactly-supported test, as
the result says.

## 2. Numerical reruns (new cases; MEASURED, float64 + mpmath)

Identity `zero side = arch + residues` below the threshold:

| S | T_w | sigma_0 | T | profile | a | rel diff |
|---|---|---|---|---|---|---|
| {5} | 1.5 | 0.93 | 7000 | sin^4 | 0 | 2.0e-10 |
| {2,7} | 2.9 | 0.90 | 4000 | sin^6 | 0 | -2.5e-11 |
| {3} | 1.05 | 1.10 | 5000 | sin^6 | 0.25 (E_a control) | 2.0e-10 |
| {3} | 1.05 | 1.50 | 5000 | sin^6 | 0 | 2.0e-10 |

Above the threshold, with the prime line computed by an independent routine (direct autocorrelation `C_w`, explicit
sum over `n`, `m`, `m'`):

| S | T_w | sigma_0 | T | profile | zero - arch - residues | prime line | remainder / arch |
|---|---|---|---|---|---|---|---|
| {2} | 2.6 | 0.90 | 3000 | sin^6 | 3.292347442e-3 | 3.292347736e-3 | -2.4e-11 |
| {2} | 2.6 | 1.25 | 3000 | sin^6 | 4.196324783e-3 | 4.196324964e-3 | -2.4e-11 |
| {3} | 2.4 | 0.95 | 5000 | sin^4 | 1.031328438e-4 | 1.031314222e-4 | 2.0e-10 |

This confirms the sign `(-1)^(|S|+1)`, the coefficient `(N_S m/m')^delta n^(-1/2)` and the support rule of the prime
line at two values of delta, which the lane's own runs did not test (all its cases have an empty prime line).

Proposition 5 at a new point: `S = {3}`, `T_w = 1.05`, `T = 5000`, `sigma_0 = 1.5`: residue sum -0.1621291615; Weil
prime sum over prime powers `n <= 2e5`: -0.1621264581; difference 2.7e-6, consistent with the truncation (partial sums
at 1e2..1e5: -0.161729, -0.162560, -0.162139, -0.162123). Weaker than the lane's 1.7e-10 at `sigma_0 = 2`, as expected
from the slower tail `n^(-2)` against `n^(-2.5)`.

E_a control (a = 0.25, `S = {3}`, `sigma_0 = 1.1`): `R = 10.74 > 0`, `Obar = 13.36`. E_a passes the best version, as the
result states. No zeta-only mechanism is claimed, so no further control run is owed.

## 3. Errors and overstatements

- **E1 (count and precision, wrong as stated).** `t1.json` holds 23 cases, not 24 (6+3+3+2+2+1+5+1). The largest
  `|rel diff|` is 2.0e-10 (all cases with T != 3000); 2.4e-11 is the value at T = 3000 only. Correct statement:
  "23 cases, |rel diff| <= 2.0e-10".
- **E2 (scope of "needs"/"capped").** Proposition 4 is a statement about one chain of upper bounds (sup of
  `zeta'/zeta` on a line, Cauchy-Schwarz, worst profile). It shows the bound certifies positivity only for
  `T_w <= f(sigma_0) LL`. It does not show that positivity fails beyond that, nor that every absolute-value estimate
  is so limited: no lower bound for `sup_w sum|res|/Den` is proved. The result's own wording ("PROVED as a statement
  about the bounds") is accurate; the summary sentence "positivity needs T_w <= f log log T" and "T_w is capped" must
  be read in that sense. The paragraph "Why 2 log log T" is labelled ARGUED and stays ARGUED.
- **E3 (Lemma 3 hypothesis).** With `sigma_0 = 1 + 1/T_w` and `eta = 1/T_w` the left line is `Re s = 1`, where
  Lemma 1(c) gives no bound and the line passes through the pole at s = 1. The bullet "sigma_0 = 1 + 1/T_w, no
  zero-free input" is correct for `|S| = 1` through Corollary B1' (only `Re s = sigma_0` is used) and for S empty; for
  `|S| >= 2` through Lemma 3 take `sigma_0 = 1 + 2/T_w`, `eta = 1/T_w`. Leading terms unchanged.
- **E4 (constant slip; unproved sentence inside a PROVED block).** `e^(delta T_w)` at `delta = 1/2 + 1/T_w` is
  `e * e^(T_w/2)`, not `e^(1/2) e^(T_w/2)`. The sentence "when [the prime line] is not empty that line obeys the same
  e^(T_w/2) bound" is not proved in the text, and for `delta > 1/2` the natural bound carries `e^(delta T_w)` times
  S-dependent counting factors. Neither affects `f` or the cap to leading order.
- **E5 (threshold rows are weak tests).** For `sin^6` the autocorrelation near the edge of its support is tiny, so
  the identity without the prime line still closes just above `log(2 N_S)` (referee run: `S = {2}`, `T_w = 1.6 > log 4`,
  rel diff 7e-11). The rows `{7}, 2.5` and `{2}, 1.2` show there is no term at `x = N_S`; they do not locate the
  threshold. The referee's above-threshold runs in section 2 close this gap.

Not errors, recorded for the record: the DH column is inference (not run; the value 1.1203625 is quoted from the
obstruction map and not rechecked here); section 6 (codimension density) and the Beurling-Landau bullet are ARGUED
and labelled so; `t4.py` uses 4.2 and `eps = 2`, which explains 3.0 rather than 3.25 at `log T = 23`.

## 4. Checks requested by the assignment

- RH assumed anywhere: no. Lemma 2 needs only `zeta != 0` on the pole lattice (ZF(7/8) for `sigma_0 > 7/8`).
- Verified height restated as a result: no. The zero list below 1.8e4 is used only for the measured checks.
- Known theorem presented as new: no. Lemma 1 and Proposition T are labelled CLASSICAL; Proposition 5 states that
  Lemma 2 carries no information beyond the explicit formula.
- Statement about zeros of zeta: none.

## 5. Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | The only inequality uses `abs(Lambda(n)) <= log n`; best range at S empty. Multiplicativity is not used in an essential step. |
| R2 | false | Constants are height-independent, but the class is `T_w <= 2 log log T - C`, below resolving power; nothing on a fixed-resolution class. |
| R3 | false | E_a passes (re-measured), sign twist passes the inequality step; DH not run. |
| R4 | false | `c log T` not reached; the contour stays at `Re s >= 1` in the best version. |

`holds = true` for the verdict "precise obstruction of this bounding method", with E1-E5 as corrections.

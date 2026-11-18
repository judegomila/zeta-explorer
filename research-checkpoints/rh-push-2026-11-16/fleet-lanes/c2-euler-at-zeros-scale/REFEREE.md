# REFEREE (lens: general) for c2-euler-at-zeros-scale/RESULT.md

Claimed verdict: dead. Referee verdict: the "dead" verdict HOLDS. One numerical statement in the summary claim is wrong as worded (item E1), two statements are narrower than worded (E2, E3), three are wording issues (E4 to E6). None changes the verdict. All four requirement flags are false.

The result contains no step labelled PROVED. It has CLASSICAL derivations (re-derived below), MEASURED tables (one re-run on new cases, DH control re-run independently), and one HEURISTIC (labelled as such).

## 1. Derivations re-derived

1. Zeta first-order law. |zeta_S(1/2+i gamma)|^2 = sum over S-smooth m, n of (mn)^(-1/2) (m/n)^(i gamma). Diagonal: M_P per zero. Terms n = m p^k (and the conjugate): sum_m 1/m times p^(-k/2) times the Landau main term -(T/2 pi) log p / p^(k/2). Total -2 M_P (T/2 pi) sum_(p<=P) log p/(p-1). With N = (T/2 pi) L this gives 1 - 2 c_P/L, c_P = sum_(p<=P) log p/(p-1). CONFIRMED. c_P = log P - gamma_E + o(1) is correct, but the o(1) is not small in the range used: c_10 = 1.9691 against log 10 - gamma_E = 1.7254 (see E1).
2. "Unconditional for fixed x" for sum x^(i gamma): Landau's theorem is for x^rho. Passing to x^(i gamma) costs sum over zero pairs of (cosh((beta-1/2) log x) - 1), which is O(log^2 x * sum (beta-1/2)^2) = o(T) by Selberg's density estimate. So the label stands for fixed x with an o(T) error; in the measured windows all zeros are on the line (acb.zeta_zeros isolates zeros of Z(t) with a certified count), so no hypothesis enters the numerics. No use of RH found.
3. Shift average. Averaging e^(-i k delta log p) over delta in [0, 2 pi/L] and taking the real part gives sin(u)/u, u = 2 pi k log p/L. Limit for log P >> L: (2/L) * integral_0^inf sin(2 pi v/L)/(2 pi v/L) dv = (2/L)(L/4) = 1/2. CONFIRMED. Consequence stated in the result (the one-spacing shifted reference is itself suppressed) is correct.
4. Liouville twist at zeta zeros: lambda(m) lambda(m p^k) = (-1)^k, sum_k (-1)^k p^(-k) = -1/(p+1), so Rref = 1 + (2/L) sum log p/(p+1). CONFIRMED (matches `asum.py`: c = sum eps log p/(p - eps), eps = -1).
5. Liouville twist at rho/2 (sigma = 1/4, t = gamma/2): main terms need sqrt(n/m) = p^k, i.e. n = m p^(2k); then lambda(m) lambda(n) = 1, (mn)^(-1/4) = m^(-1/2) p^(-k/2), giving -2 (T/2 pi) M' c_P with M' = prod (1 - p^(-1/2))^-1. Ratio 1 - 2 c_P/L with the same c_P as zeta. CONFIRMED.
6. Random twist: c_eps = sum_p sum_k eps_p^k log p/p^k = sum eps_p log p/(p - eps_p), bounded in P almost surely. CONFIRMED.
7. DH reference M^DH_P: a(n) = C chi(n) + conj(C) conj(chi)(n), a(n)^2 = 2|C|^2 |chi|^2 + 2 Re(C^2 chi^2), both parts completely multiplicative, so the two-product formula in `dh2.py` is correct. Checked by brute force over 2,3,7-smooth n <= 1e12: 2.0923 both ways. Character labels checked: dirichlet_char(5,2)(2) = i, (5,3) is its conjugate; kappa and C as in the standard DH definition; theta uses Gamma((s+1)/2) (odd character) and conductor 5.
8. Interval run (`iv.py`): zeros are certified balls, the products are evaluated in ball arithmetic, M_P is a ball, N_w is exact. The Rref and RU enclosures are rigorous for the stated finite sums (the shift d is a float64 used as an exact number, as the result states). `iv.json` re-read: zeta RU upper bounds all < 1 (max 0.97408), zeta Rref max 0.76549; Liouville Rref in [1.1318, 3.9322], RU in [1.0045, 3.4235]. CONFIRMED.

## 2. Numeric check re-run on different cases (referee code, run locally under memcap 8 GB, python-flint 0.9.0)

Different heights (3e5, 3e7), an extra P (30), direct complex products instead of the log1p route, and extra window lengths (100 and 25 zeros).

| T0 | zeros | L | P | x | c_P/L | Rref | 1 - 2c_P/L | 1 - 2x | RU | 0.022 x^-2.87 |
|---|---|---|---|---|---|---|---|---|---|---|
| 3e5 | 4000 | 10.778 | 10 | 0.160 | 0.183 | 0.6341 | 0.6346 | 0.6798 | 0.9115 | n/a |
| 3e5 | 4000 | 10.778 | 30 | 0.262 | 0.281 | 0.4450 | 0.4384 | 0.4760 | 0.7674 | n/a |
| 3e5 | 4000 | 10.778 | 100 | 0.374 | 0.382 | 0.2852 | 0.2364 | 0.2525 | 0.5593 | n/a |
| 3e5 | 4000 | 10.778 | 1000 | 0.587 | 0.590 | 0.1013 | -0.181 | -0.175 | 0.2052 | 0.1013 |
| 3e5 | 4000 | 10.778 | 10000 | 0.801 | 0.802 | 0.0419 | -0.605 | -0.602 | 0.0831 | 0.0416 |
| 3e7 | 2000 | 15.379 | 10 | 0.112 | 0.128 | 0.7327 | 0.7439 | 0.7756 | 0.9367 | n/a |
| 3e7 | 2000 | 15.379 | 30 | 0.184 | 0.197 | 0.5930 | 0.6065 | 0.6327 | 0.8804 | n/a |
| 3e7 | 2000 | 15.379 | 100 | 0.262 | 0.268 | 0.4546 | 0.4649 | 0.4762 | 0.7665 | n/a |
| 3e7 | 2000 | 15.379 | 1000 | 0.412 | 0.414 | 0.2387 | 0.1724 | 0.1767 | 0.4855 | n/a |
| 3e7 | 2000 | 15.379 | 10000 | 0.561 | 0.562 | 0.1088 | -0.124 | -0.123 | 0.2227 | 0.1154 |

- The law 1 - 2c_P/L is reproduced for x <= 0.26 within 0.013 (five new cells). The large-x fit predicts the two new cells with x >= 0.587 within 1.5 percent, and the x = 0.561 cell within 6 percent. The values interpolate the result's Table 1. REPRODUCED.
- Window length. 500-zero windows: Rref max 0.692 (3e5), 0.759 (3e7); RU max 1.013. 100-zero windows: Rref max 0.919, RU max 1.253. 25-zero windows: Rref > 1 in 11 of 160 windows (3e5, P = 10; max 2.06) and 14 of 80 (3e7, P = 10; max 2.29). Single zeros: |zeta_S(rho)|^2 > M_P at 13.6 and 14.5 percent of zeros at P = 10 (max 38 and 43 times M_P). See E2.

## 3. Controls run by the referee

DH, window 5000 < t < 5300 (not a window boundary of the result), own grid (step 0.01) and Brent refinement, own partial-product code:
- 361 on-line zeros found; the result's file has 361 in the same range; max difference 9.1e-13. The 18 off-line pairs of the file in this range satisfy |f| <= 1.3e-12. Total 397 against theta(5300)/pi - theta(5000)/pi = 397.16. The count is consistent in this window.
- On-line zeros: Rref = 0.736, 0.267, 0.092, 0.034 for P = 10, 100, 1000, 1e4 (result, whole range: 0.725, 0.258, 0.078, 0.032). RU = 0.875, 0.382, 0.143, 0.056. Against the continuous t-mean (not in the result's DH table): Rcont = 0.727, 0.256, 0.106, 0.046, so the DH suppression is not an artifact of the reference M^DH_P.
- Off-line zeros with beta > 1/2 (18): RU = 0.352, 0.021, 0.0036, 0.0035 (result: 0.31, 0.024, 0.007, 0.003). Stronger than on the line. REPRODUCED.

The claim "controls share it" for DH is confirmed. Liouville and random-twist statements were checked against the derivations in section 1 and against the stored output (`asum_*.json`): Liouville at rho, min over 2000-zero windows 1.0856; Liouville at rho/2, G negative in every cell (largest window value -0.0043); random seeds, P >= 1000: every seed has 2000-zero windows on both sides of 1 (pooled over the six heights). CONFIRMED from the stored output; not recomputed.

## 4. Errors and corrections

E1 (error in the summary claim). "1 - 2x for x <= 0.25 ... error <= 0.014" attaches the bound to the wrong formula. The measured bound 0.0137 is for 1 - 2 c_P/L (six cells, x <= 0.26; recomputed from the stored output). For 1 - 2x with x = (log P - gamma_E)/L the same six cells give max error 0.055, and the referee's new cells give 0.043 to 0.046, because c_P - (log P - gamma_E) = 0.244 at P = 10 and 0.123 at P = 30. Correct statement: Rref = 1 - 2 c_P/L within 0.014 for c_P/L below about 0.28; "a function of x only" holds within about 15 percent (the result's body says this; example: x = 0.297 at (1e3, P = 10) gives 0.3595 where interpolation between the 1e7 and 1e6 rows at P = 100 gives about 0.41). The better scaling variable in the first-order range is c_P/L.

E2 (narrower than worded). "Below 1 in every window" is true for the windows measured (500 and 2000 zeros, 6 heights, 5 values of P; interval-certified in 6 windows only; the other windows are float64). It is a statement about window length: at 25 zeros per window 7 to 17 percent of windows have Rref > 1 at P = 10, and single zeros exceed M_P about 14 percent of the time. The result's own table shows a 500-zero window at 0.904 against a mean of 0.517 (1e8, P = 100). The result's R2 = false is therefore correct for two reasons, not one: the height dependence at fixed P, and the window-length dependence.

E3 (narrower than worded). "Tending to 1 as T grows" at fixed P is not measured beyond 1e8 (largest measured value at P = 10 is 0.765 for the block mean). It is a consequence of the classical formula at fixed P, not of the data.

E4 (wording). The verdict says the first-order term is "fixed by the coefficients of -F'/F on prime powers". For DH, -f'/f is not supported on prime powers and a(n) is not multiplicative, so no closed form c^DH was derived; the result says so in weakest step 1. The R1 justification should read "coefficients of -F'/F", without "prime-power".

E5 (minor numeric). Random seed 4 at P = 10: the stated range [0.745, 0.916] omits the single 2000-zero window at 1e3 (0.672). The conclusion (below 1 in every 2000-zero window) is unchanged.

E6 (status of the DH data). DH zeros are float64 with an argument count on a ladder; the result states this. The referee's window agrees to 1e-12 with a matching count, but that covers 3 percent of the range.

Not found: no use of RH, no restatement of verified height as a result, no known theorem presented as new (Landau-Gonek is labelled CLASSICAL; the x^-3 law is labelled HEURISTIC with unmatched constants), no claim about zero locations.

## 5. Requirement flags (set by the referee)

- R1 false. The suppression occurs for the DH formal partial product, which has no Euler product (reproduced), and for any series whose truncation is sampled at its own zeros to first order.
- R2 false. At fixed P the ratio depends on height (1 - 2c_P/L), and the one-sided bound fails for short windows (25 zeros) and against the one-spacing shifted reference.
- R3 false. DH (on-line and off-line zeros) and the Liouville twist at rho/2 share the effect. Six of the nine listed controls were not run.
- R4 false. Finite sums over computed zeros below 1.0001e8; no passage to the critical line and no statement about zero location.

## 6. Surviving claim

MEASURED: for 500- and 2000-zero windows at heights 1e3 to 1e8 (plus referee blocks at 3e5 and 3e7) and P = 10 to 1e5, A_S at zeta zeros divided by N_w M_P is below 1 and equals 1 - 2 c_P/L within 0.014 when c_P/L is below about 0.28 (CLASSICAL Landau-Gonek first-order term), and is about 0.022 x^-2.87 for x >= 0.6 (fit). The bound is not uniform in height at fixed P and not uniform in window length. The DH formal partial product at DH zeros shows the same one-sided suppression (reproduced independently in one window, also against the continuous t-mean), as does the Liouville twist at rho/2 in the mean. The quantity does not discriminate zeta from DH. Lead closed.

Referee scripts were run from a scratch directory outside the repository and are not stored; the numbers above are their full output of record.

# Referee report: g-arithmetic-gain/RESULT.md

Date: 2026-11-16. Adversarial pass. Scratch scripts in `/tmp/ref-gain/` (not part of the deliverable).
Only this file was written in the repo. PR 39 was fetched read-only; the three gain notes in `src/` are
byte-identical to `refs/pr/39`.

## Verdict

**holds = true** as a precise obstruction. Every step labelled PROVED was re-derived by hand and survives.
Every MEASURED number I re-ran reproduced with independent code. No step assumes RH. The DH control was run
independently and behaves as stated. Five corrections are needed, all to wording, constants or scope; none
breaks a proof step.

## 1. Re-derivation of PROVED steps

**Setup.** `int du/(d^2+u^2)^3 = 3 pi/(8 d^5)`, so `K_d` has mass 6. On the line, `1-w = 2d/(d+iu)`, the
harmonic measure at `w=0` is `(d/pi) du/(d^2+u^2)`, and `|1-w|^4` times it is `K_d`. `||(1-w)^2||^2 = 1+4+1 = 6`.
Confirmed.

**3.1 Two-jet formula. Confirmed.** `<kappa, kappa v> = phi_0 - 2 phi_1 + phi_2 = 6 v_0 - 4 v_1 + v_2`;
`s - s_0 = 2d w/(1-w)` gives `v_1 = 2d v'`, `v_2 = 2d v' + 2d^2 v''`; total `6v - 6d v' + 2d^2 v''`.
The three consequences follow because the filter space is a complex linear space (optimal scalar multiple).
`81/16 = 6 - 15/16`. H^2 membership of `kappa zeta D` holds by polynomial growth (Smirnov class).
New numeric cases (not the author's):
- `v = zeta(s)(3^{-s} - 1/3)`, `d = 1/4`, `c = 100.3`: quadrature `-11.1696501984340 + 6.9012581422692 i`,
  jet `-11.1696501984402 + 6.9012581422692 i`.
- `v = DH(s) 5^{-s}`, `d = 1/8`, `c = 85.7`: quadrature `-0.96189813591362 - 0.05902529387656 i`,
  jet `-0.96189813591364 - 0.05902529387657 i`.

**3.2 Multi-zero Gram bound. Confirmed** (projection of `kappa` onto the span of reproducing kernels at the
zeros; `kappa zeta D` is orthogonal to that span). `m = 1` gives `(1-|a|^2)|1-a|^4 = 64 d^5 b/((b+d)^2+(gamma-c)^2)^3`,
re-derived. Corner constant `262144/274625` is the minimum on the cell (the function is decreasing in `b` on
`[d/2, d]`). Equality is correctly not claimed for integer dilations.

**3.3 Coefficient mass. Confirmed.** At `s = s_0 + i d u`: `1-|w|^2 = |1-w|^2 = 4/(4+u^2)`, so
`|zeta D - 1| <= eps (4+u^2)^{3/2}/8`; at `|u| <= 1/4`, `eps^2 < 15/16` this is `<= 0.99103`, `delta_0 = 0.00897`.
The grid step `d/2` covers every `t`. `sum_{n<=N} n^{-sigma} <= N^{1-sigma}/(1-sigma)` gives the stated `N` bound.
Montgomery 1977 Thm 1 is unconditional and holds for every rotation angle, so it covers small values; the
`sigma = 1` case uses `1/zeta(1+it) = Omega(log log t)` (Titchmarsh 8.8). Both CLASSICAL, constants not rechecked.

**3.4 Boundary-zero cost. Confirmed as an inequality; constant needs correction (item C1).**
`int_{-1/Lam}^{1/Lam} (1 - Lam|x|)^2 dx = 2/(3 Lam)`, `K_d(0) = 16/(pi d)`.

**Section 6 mollifier arithmetic. Confirmed** given the quoted `1 + 1/theta`: minimum `6/(1+theta)`, threshold `theta > 27/5`.

## 2. Independent numerics

Own code: mpmath 25 digits, step 1/40 on `|t-c| <= 70`, column-scaled least squares.

| Quantity | RESULT.md | Referee |
|---|---|---|
| DH zero | `0.808517182456637 + 85.699348485377592 i` | same, residual 5.8e-26; `min |DH(1/2+it)| = 0.357` on `[85, 86.4]` |
| DH `e_N`, `(1/2, 85.6993)`, N=4/16/64 | 3.116 / 2.997 / 2.952 | 3.1158 / 2.9968 / 2.9523 |
| DH `e_N`, `(1/4, 85.6993)` | 0.924 / 0.881 / 0.861 | 0.9244 / 0.8811 / 0.8617 |
| zeta, `(1/2, 85.6993)` | 0.139 / 0.092 / 0.073 | 0.1386 / 0.0920 / 0.0735 |
| `L(s,chi_5)`, `(1/2, 85.6993)` | 3.799 / 3.570 / 3.298 | 3.7993 / 3.5703 / 3.3121 |
| PR 39 `E`, `V`, gain, after-step at `(1/2, 62957/32)` | 4.075248 / 22.835436 / 3.306444 / 0.768804 | 4.075248 / 22.835436 / 3.306444 / 0.768804 |

`L(s,chi_5)` has an on-line zero at `t = 85.66` (`|L| = 6e-5`), which accounts for its large residual there.

**New case (second DH off-line zero, `0.650830080609737 + 114.163342730757 i`, `b = 0.15083`).**

| d | obstruction `64 d^5 b/(b+d)^6` | DH `e_4` / `e_16` / `e_64` | zeta `e_64` |
|---|---|---|---|
| 1/2 | 3.969 | 4.705 / 4.638 / 4.577 | 2.748 |
| 1/4 (cell contains the zero) | 2.273 | 2.980 / 2.816 / 2.720 | 1.997 |
| 1/8 | 0.669 | 0.924 / 0.862 / 0.819 | 0.597 |

The lower bound holds at all three scales. Note zeta also fails at this anchor at `N = 64` (on-line zero at
114.32), which is the paper's own point: a finite-cutoff failure does not identify an off-line zero.

**Scan data (`scan_out.json`), re-analysed.**
- zeta, `N = 48`: an anchor fails iff the nearest zero is within `0.87 d` (`d = 1/2`) or `0.98 d` (`d = 1/4`);
  the pass/fail split is exact in the sample (largest failing distance `0.870 d`, smallest passing `0.892 d`).
  Correlation of `log e_48` with distance/d is `-0.99`. This supports the section 3.4 reading.
- `L(s,chi_5)` vs DH pass counts: 67/71, 76/79, 82/83, 111/112, 113/113, 114/114. Count difference at most 4. Confirmed.

## 3. Corrections

**C1. The slope constant is 3.54, not 3.62.** `Lam >~ 32*16/(45 pi d) = 3.62/d` uses `K_d ~ K_d(0)` on
`|t-c| <= 1/Lam`, which needs `1/Lam << d`. At the threshold `1/Lam = 0.28 d`, so the approximation is not
valid there. Solving `int_{-1/Lam}^{1/Lam} K_d(u)(1-Lam|u|)^2 du = 15/16` exactly gives `Lam d = 3.5386`.
The rigorous statement is: a zero at `gamma = c` and `E_D < 15/16` force `sup |g'| > 3.538/d`. It applies to a
zero at the anchor height; for a zero elsewhere in the core the constant is smaller.

**C2. "Kernel core" is about `0.9 d`, not `0.3 d`.** The scan shows failure whenever a zero lies within about
`0.87 d` to `1.0 d` at `N = 48`. The count `0.3 d log(c)/pi` per anchor therefore understates the measured
effect by a factor near 3. It remains a heuristic.

**C3. The Euler-blindness measurement is weaker than its wording.**
- The pass *counts* agree within 4; the pass *sets* do not. Anchors passed by both: 46, 53, 56 (`d = 1/2`) and
  87, 87, 89 (`d = 1/4`) out of roughly 70-83 and 112-114. The two functions fail at different anchors
  because their on-line zeros are at different heights. "Differ by at most 4 of 161 anchors" should read
  "pass counts differ by at most 4".
- The scan range `30 <= c <= 70` contains no off-line DH zero (first one is at 85.7; its tail contribution at
  `c = 70` is below 1e-6). In that range DH satisfies the local hypothesis the criterion tests, so equal
  statistics show only that the convergence rate of `e_N` does not depend on the Euler product; they do not
  test the criterion's discrimination. The discrimination is tested only at the two anchors at 85.7 and
  114.16, where it works.
- "the same as `L(s,chi_5)`" in section 4 is 83 vs 82 at `d = 1/2`.

**C4. Cutoff non-uniformity is not proved here without a coefficient bound.** Section 3.3 gives unbounded
coefficient mass unconditionally and unbounded `N` only under `|a_n| <= A`. Unbounded cutoff with free
coefficients rests on PR 39's discrete-universality corollary, which this note cites as "verified" but does not
re-derive. I read the PR 39 argument (Reich's theorem, finite-dimensional norm equivalence on a compact disk)
and found no error, but I did not check it line by line. Label it CLASSICAL/PR 39, not verified here.

**C5. Scope.** The lane asked for the small-value shear, cluster bounds, `rigorous/shear_gram/README.md` and the
shear kernel measure audit. They are copied into `src/` but not analysed in RESULT.md. The statement "no signed
prime sum, Euler product unused" is correct for the three gain notes (I confirmed: the arithmetic there is
integer dilations `n^{-s}` and the fractional-part residual `r_D`; the word "signed" in PR 39 refers to
cancellation inside `r_D` and to the indefinite rank-two operator `A_eta` in eqs. (11)-(13)). It is not a
statement about all of PR 39: `CENTROID_SHEAR.md` eq. for `A(c)` and the PR README do contain
`sum Lambda(n) n^{-sigma} cos(t log n)` in `sigma > 1`. Those sums were not examined.

## 4. Other checks

- **RH not assumed.** The only RH-dependent sentence is "RH gives `e_N -> 0`" (Baez-Duarte), used as a remark.
  It is valid here: `K_d(t-c) <= C_{d,c}/(1/4+t^2)` and the Nyman-Beurling condition `sum c_k theta_k = 0` is
  exactly `D(1) = 0`.
- **Coordinate-change test.** No cancellation is claimed. The note explicitly does not bound the coupling
  block; the Cayley map is used only as an isometry. Nothing to fault.
- **Section 4 composition** depends on the sibling lens lemma, which has its own referee report with
  holds = true. The covering step (finitely many cells per dyadic scale for `x > 0`) is correct. The
  identification with the sign of `K_eta(q,q)` "by integrating `Re xi'/xi` along the horizontal segment" is a
  sufficient condition only and needs the lens to be zero-free for every abscissa in `(x-eta, x+eta)`; it is
  stated in one line without that qualification.
- **Verified height.** All passing certificates lie inside verified height, as stated.
- **Conditioning.** Coefficients reach 1e9 at `N >= 48`; my column-scaled solve agrees with the author's
  values to 4 digits at `N <= 16` and to 2e-3 (zeta, DH) and 1.4e-2 (`L(s,chi_5)`) at `N = 64`. The `N = 64`
  values are upper estimates of the optimum, as the author says.

## 5. Surviving claim

The PR 39 arithmetic gain is the local pole-neutral Nyman-Beurling distance
`e_N(d,c) = 6 - sup_D |ell(zeta D)|^2 / int K_d |zeta D|^2` with `ell(v) = 6v - 6d v' + 2d^2 v''` at `s_0`.
The gain is a squared correlation and uses no Euler product. Passing filters need coefficient mass
`>= 0.00897/|zeta(1/2+d+it)|`, unbounded in height. A zero on the line at the anchor height forces
`sup |(zeta D)'| > 3.538/d`. Off-line zeros give the Gram lower bound; for DH this is 2.209 at
`(1/2, 85.6993)` and 2.273 at `(1/4, 114.1633)`, and the measured residuals stay above both. The gain
certificates reach only the local order-1 test. Finite-cutoff convergence statistics for DH and `L(s,chi_5)`
are alike in a range where DH has no off-line zero. No bound moves and no RH-relevant inequality is proved.

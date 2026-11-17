# REFEREE: ap-hodge-index/RESULT.md

Date: 2026-11-17. Adversarial pass. Claimed verdict: precise obstruction.

**Outcome: the verdict holds. The proved steps were re-derived and the Davenport-Heilbronn (DH) numbers were
reproduced with independent code. Five statements in the summary and in sections 4.3 and 7 are wrong or overstated
as written (items E1-E5); none changes the verdict.** RH is open; the result gives no zero information.

Referee code (not kept in the lane directory, per the write rule): `/tmp/referee-ap-hodge/dh.py`, `gen.py`
(python-flint Arb at 300 and 600 bits, own formulas, no import from `hlib.py`/`harch.py`). All runs through
`scripts/memcap.sh 8`, single process, each under 10 s; largest planned allocation printed (three 134 x 134 Arb
matrices, about 11 MB).

## 1. PROVED steps, re-derived

| Step | Check | Result |
|---|---|---|
| Archimedean kernel form of `A` | From `psi(z) = -gamma + int (e^-t - e^-zt)/(1 - e^-t) dt`, `z = 1/4 + it/2`, `t = 2x`; the constant collects to `psi(1/4) g(0)` | correct |
| Thm 1(a) | `i_+` subadditive, `i_+(P), i_+(-P) <= 1` | correct |
| Thm 1(b) 1 => 2, 2 => 3 | direct | correct |
| Thm 1(b) 3 => 1 | `Re gamma^2 >= 14.13^2 - 1/4 > 199` for every zero; `lH(w_s) = lV(w_s) = s sqrt(2 pi) e^{s^2/8}`; 2x2 determinant positive for large `s`; complement of `h` in the 3-space (or in the 2-space when `h` lies in it) has a positive vector | correct |
| Sign structure | `g(0) = 0` for disjoint supports; `-A = int int f1 f2 k(abs(x-y))`, `k > 0` | correct |
| L1, L5 | degree-2 Lorentzian = non-negative coefficients and at most one positive eigenvalue (Brändén-Huh, definition of `L^2_n`); product closure and closure under `d_i` as stated | correct |
| L2 | `x_1x_2`, `x_3x_9` in the divisor-graph support, `x_2x_3`, `x_2x_9` not | correct |
| L3 lines 1-2 | Hessian of `h_2` is `D(1+J)D`; `N(h_d) = (sum w_p z_p)^d/d!`; bivariate criterion is ultra-log-concavity | correct |
| L4 | symbol `2 Re[log p/(p^{1/2+it} - 1)]`; extrema `±2 log p/(sqrt p ∓ 1)`: 3.3468/-0.5742 (p = 2); positive iff `cos(t log p) > p^{-1/2}`: 25.0%, 30.4%, 35.2% | correct |

**The Bombieri citation is not needed.** The search did not confirm that Bombieri 2000 states the criterion with the
condition `F(±i/2) = 0` (Connes-Consani state it in that form). A self-contained replacement inside the lane's test
class: take a real `f` with `Z(f,f) < 0` (Weil's criterion; complex-to-real reduction as in arith-surface Cor 2.3).
Put `u_± = w_s(x ∓ m)`, so `lH(u_±) = e^{±m/2} L`, `lV(u_±) = e^{∓m/2} L`, `L = s sqrt(2 pi) e^{s^2/8}`. Solve
`lH(f - a u_+ - b u_-) = lV(f - a u_+ - b u_-) = 0`: `a, b = O(1/L)`. `Z(f,u_±)` and `Z(u_±,u_±)` are bounded
(they tend to 0), so `Z(f0,f0) -> Z(f,f) < 0`. Theorem 1(b) therefore follows from the ordinary Weil criterion.
Weakest step 2 of the result can be downgraded accordingly.

## 2. DH failure, independent reproduction

Own prime side (`Lambda_DH` by the convolution recursion, `psi(3/4 + it/2)`, `log(5/pi)`, trapezoid step 0.04) and own
zero side (zeros from `weil-onesided/dh_zeros_200.json`; `|f(rho_0)| = 2.9e-24` at `0.8085171825 + 85.6993484854 i`
by Hurwitz zeta). Midpoint elimination at 300 bits.

| `h` | `s/h` | n | positive pivots (referee) | RESULT.md | quartet at 85.7 removed |
|---|---|---|---|---|---|
| 0.03 | 1 | 134 | 116, 117 (zero side 115, 116) | 116, 117 | none |
| 0.03 | 0.75 | 134 | 120, 123 (zero side 119, 122) | 120, 123 | none |
| 0.036 | 1 | 120 | 119 | 119 | none |
| 0.036 | 0.75 | 120 | none | none | none |
| 0.06 | 0.75 | 80 | 79 | 79 | none |

Prime side minus zero side on the kernel: 5.0e-18 (`h = 0.03`, `s/h = 1`), equal to the lane's figure and to the
omitted tail. Zeta, `h = 0.03`, `s/h = 0.75`, n = 134: one positive pivot (stage 6), pencil eigenvalues
11.55 / -4.486e-10 / -5.632, equal to section 4.5. Drop-2: 39 positive pivots, second at stage 24, equal to 4.2.
Diagonal constant: `K(0)/(s sqrt pi) = -0.9546` at `s = 0.0225` against `-(log(1/s) - 2.84) = -0.954`.

Added by the referee:

- Removing any of the other three quartets leaves the positive pivots unchanged in every row. Subtracting the exact
  contribution of the quartet at 85.7 from the prime-side kernel also removes them.
- **The `h = 0.06` row is the same quartet.** RESULT.md leaves stage 79 "not attributed". The removal test attributes
  it (tail `e^{-s^2 200^2} = 7e-36` there, so the zero side is exact to 25 digits).
- **Relative size of the failure** (largest eigenvalue of the pencil of `I` against the `L^2` Gram matrix):
  5.5e-14 at stage 116 (`s/h = 1`), 1.3e-6 at stage 120 (`s/h = 0.75`), 5.2e-9 at stage 79 (`h = 0.06`); at n = 134
  (`h = 0.03`) the two positive eigenvalues are 0.50 and 0.76 (`s/h = 1`), 0.56 and 0.64 (`s/h = 0.75`). Just below the first failure the form is
  negative definite with relative margin 8e-17 (`s/h = 1`) or 2e-9 (`s/h = 0.75`).
- **Sensitivity.** For `s/h = 1` a relative perturbation of the kernel values of 1e-14 produces spurious positive
  pivots (stages 94, 102, 110, 124 at `h = 0.03`; 77, 88, 95 at `h = 0.036`); 1e-18 does not. For `s/h = 0.75` the
  result is stable at 1e-14. The stage numbers are sound (entries are accurate to better than 1e-60), but double
  precision cannot reproduce the `s/h = 1` rows.

## 3. Errors and overstatements

**E1. "First fails at dimension 116 to 174" and "smallest dimension found: 116" contradict the lane's own table.**
The `h = 0.06` row fails at dimension 79, and the referee attributes it to the same quartet. Correct range over the
grids run: 79 to 174.

**E2. "Always at window length 3.46 to 3.57 when the grid resolves height 85.7" contradicts the table.** At
`h = 0.036` (Nyquist 87.3, above 85.7) the failure is at cutoff 4.25 (`s/h = 1`) or absent to 4.28 (`s/h = 0.75`);
at `h = 0.06` it is at 4.68. Measured range of the first-failure cutoff: 3.45 to 4.68, or none within the run. The
value 3.45-3.57 holds for the four grids with Nyquist at least 105. The fit `c* ~ log(q gamma/2 pi e)` rests on
those four rows.

**E3. "DH satisfies the Lorentzian signature at every stage below dimension 116 (finite stages are Euler-blind)" is a
statement about these nested Gaussian families, not about dimension.** For DH `I = -Z`, and the eigenvector found at
stage 116 spans a one-dimensional test space on which the statement fails. By the lane's own Theorem 1 argument
(with `P = 0`) failure in dimension 1 always exists when a zero is off the line. The invariant quantity is the
support window and the resolution, not the dimension; "dimension about twice the number of zeros below gamma" in
section 7 is specific to translates on a uniform grid (43 on-line ordinates below 85.7; failures at 79 to 174).

**E4. Pivot sizes are compared with the Pick value as if both were margins.** Pivots (`1e-6` to `1e-10`) depend on
the basis. The basis-independent relative margin at first failure is 5.5e-14 to 1.3e-6 (section 2 above), and
detection at `s/h = 1` requires kernel values to 1e-15 or better. The comparison with `-7.9e-480` still shows a
large difference, but the figure to quote is the pencil eigenvalue.

**E5. "E_a, T-NR (c > 2), TW+ share every structural property tested" is false for T-NR.** The lane's own tables
give T-NR `c = 2.2` negative off-diagonal entries (16 at `h = 0.1`, n = 61; 8 to 300 in 4.4), so it fails the sign
structure, as section 7 says. Only `E_a` and TW+ (and the truncated prime sets) pass every structural test.

Smaller points.

- `lorentz.py` does not test the control's own local factors. T-NR is entered as `(1 + cX + X^2)/(1 - X)`
  (coefficients 1, 1+c, 2+c) while the control of section 2 is `(1 + c sqrt2 x + 2x^2)/(1 - x)` (1, 4.11, 6.11,
  6.11, ...); `E_a` is entered with `cosh(a log p) = 1.3` at all four primes instead of `a = 0.2`. The bivariate
  log-concavity check passes for the true T-NR coefficients, so the conclusion is likely unchanged, but the table
  entry is for a factor of the same type, not for the control.
- "Holds verbatim for DH with `P = 0`": statement 2 becomes `i_+ <= 0` and the proof of 3 => 1 (which uses
  `P(w_s,w_s) -> inf`) does not apply; the correct DH statement is `i_+(I) = i_-(Z)`, which the lane also gives.
- Backward heat is one of the three mandatory controls of BRIEF.md and was not run; the HEAT row is an inference
  from openness of a non-degenerate signature. Beurling was not run. Both are disclosed.
- `run_dh_zero.py` takes the zeros file as an argument and RESULT.md does not name it
  (`weil-onesided/dh_zeros_200.json` reproduces the output).
- Section 6 ("no structural certificate other than (i)-(iv)") is a list of mechanisms examined, as weakest step 3
  says; it is not a theorem. The Adiprasito-Huh-Katz proof is an induction over order filters (matroidal flips);
  "local-to-global" describes Brändén-Huh and the later Brändén-Leake argument more accurately.
- "Zeta stages are consequences of the zeros below height about 200" is ARGUED; Gaussians are not band-limited.

## 4. Control check: is the claimed structure also present for the control?

Yes, and the lane says so. The signature statement is RH for each object and is false for every control with
off-line zeros. Each structural property (sign pattern, support, normalised Euler polynomial) is passed by `E_a`
and TW+. The DH failure appears only where the test space resolves the quartet at 85.7 (confirmed by removal).
No step separates zeta from all controls. This agrees with rows P1, P5, Q6, S1 of the obstruction map.

## 5. Novelty

Nothing is presented as new mathematics beyond the bookkeeping of Theorem 1, and that is accurate: "the Weil form
has one positive direction modulo the pole plane iff RH" is the standard Hodge-index reading of Weil's criterion
(Weil 1952; Connes's essays; arith-surface Cor 2.3), and the fixed-`h` reverse Cauchy-Schwarz form is the general
fact for forms with one positive eigenvalue. L1-L5 are elementary. The measured DH thresholds in a Gaussian basis
are new data within the campaign.

## 6. Surviving claim

Theorem 1 (a), (b) as stated, provable from the ordinary Weil criterion; restates RH. L1-L5 and the sign structure.
Measured and independently reproduced: zeta has one positive eigenvalue on the nested Gaussian families checked;
truncated prime sets fail near the first missing prime power; DH is negative definite on these families until the
quartet at height 85.7 is resolved, first failing at dimension 79 to 174 and cutoff 3.45 to 4.68 depending on the
grid, with relative size 5.5e-14 to 1.3e-6 at first failure and of order 0.5 by cutoff 3.99 at `h = 0.03`. `E_a` and
TW+ pass every structural property tested; T-NR passes only the Euler-polynomial test. Backward heat and Beurling
not run. No zero information.

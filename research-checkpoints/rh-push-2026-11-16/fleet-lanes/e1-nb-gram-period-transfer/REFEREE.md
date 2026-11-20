# REFEREE: e1-nb-gram-period-transfer

Date: 2026-11-17. Adversarial referee, separate agent. Scratch code and tables in `/tmp/ref-e1/` (not kept in the
repo). All runs local through `scripts/memcap.sh 8`, largest allocation 27 MB per table, each run under 1 minute.

## Outcome

**holds = true, with four corrections to wording (none changes a PROVED statement).**
No error was found in Theorem 1. Lemmas 2 and 3 are correct but are restatements of classical formulas, not new
results. The measured statements reproduce at a different N. Nothing assumes RH; nothing restates verified
height. The result is a statement about a Gram matrix and says nothing about zeros, as RESULT.md itself states.

## 1. Theorem 1, re-derived line by line

Setup (1). `sum_n a_n floor(u/n) = sum_{m<=u} (1*a)(m)`, so `Phi(u) = u A(1) - sum_{m<=u} f(m)`. For u < 1,
`Phi = u A(1)`, so the integral converges at 0. Confirmed.

Lower bound.
- On (m-1, m+1), `Phi = affine - f(m) 1_{u>=m}`. Confirmed (also for m = 1, interval (0,2)).
- Distance from `1_{v>=0}` to affine functions in L^2(-1,1): `1_{v>=0} = 1/2 + sgn(v)/2`; `<sgn/2, v> = 1/2`,
  `||v||^2 = 2/3`, residual `1/2 - (1/2)^2/(2/3) = 1/8`. Confirmed; valid for complex f(m) and complex affine part.
- Weight `1/u^2 >= 1/(m+1)^2` on the interval; each u lies in at most two intervals; so
  `Q(a) >= (1/16) sum_m |f(m)|^2/(m+1)^2`. Confirmed.
- `a = mu * f` restricted to n <= N; the number of d | n with n/d squarefree is `2^omega(n)`; Cauchy-Schwarz;
  `2^omega(dk) <= 2^omega(d) 2^omega(k)`; `sum_{k<=x} 2^omega(k) <= sum_{k<=x} d(k) = sum_{j<=x} floor(x/j) <= x(1+log x)`.
  Confirmed.
- `(d+1)^2/d <= 4d`; `x(1+log(1/x))` is increasing on (0,1] with value 1 at x = 1. So `W_N <= 4 N^2 2^(Omega_N)`
  and `lam_min >= 1/(64 * 2^(Omega_N) * N^2)`. Confirmed.

Upper bound. With `a = delta_N - ((N-1)/N) delta_{N-1}`: `Phi = (j-i) - j/N`. For `u in [iN,(i+1)N)`, `i <= N-2`:
`u/(N-1) in [i + i/(N-1), i+1+(i+1)/(N-1))`, so `j in {i, i+1}` and `j = i+1` exactly on
`[(i+1)(N-1),(i+1)N)`. Window terms `<= 1/((i+1)(N-1)^2)`, sum `<= (1+log N)/(N-1)^2`; remaining part
`(i/N)^2 * 1/(N i (i+1)) <= 1/N^3` each, sum `<= 1/N^2`; tail `u >= N(N-1)` with `|Phi| < 1` gives `<= 1/(N(N-1))`;
`||a||^2 >= 1`. Total `<= (3+log N)/(N-1)^2`. Confirmed.

Conclusion `lam_min(G_N) = N^(-2+o(1))`: confirmed, from `2^(Omega_N) = N^(O(1/log log N))`.

Numeric check with different cases (float64, zeta table rebuilt at N = 1300):

| N | lower bound | lam_min | upper bound | Q(test vector) |
|---|---|---|---|---|
| 7 | 7.97e-5 | 1.708e-2 | 1.374e-1 | 3.587e-2 |
| 30 | 2.17e-6 | 1.237e-3 | 7.611e-3 | 3.508e-3 |
| 150 | 8.68e-8 | 5.589e-5 | 3.608e-4 | 2.113e-4 |
| 333 | 8.81e-9 | 1.158e-5 | 7.991e-5 | 5.004e-5 |
| 700 | 1.99e-9 | 2.852e-6 | 1.955e-5 | 1.284e-5 |
| 1300 | 5.78e-10 | 8.725e-7 | 6.027e-6 | 4.089e-6 |

The author tested inequalities (2) and (3) on three vectors. I tested them over all vectors by generalised
eigenproblems: `min_a Q(a) / [(1/16) sum_{m<=40n} |f(m)|^2/(m+1)^2]` = 6.51 (n = 60), 6.05 (n = 300), required >= 1;
`min_a [weighted f-sum of (3)] / ||a||^2` = 2.01 (n = 60), 1.92 (n = 300), required >= 1. Both hold with margin.

Entries checked independently of the Vasyunin formula by exact piecewise integration to U = 3e5 at pairs not
used by the author, including non-coprime pairs: (4,9), (13,8), (17,23), (6,4), (10,15), (31,1). Differences
8.3e-7 to 8.8e-7, equal to the neglected tail 0.25/U = 8.3e-7. The gcd rule `G(h,k) = G(h/g,k/g)/g` is confirmed.

## 2. Lemmas 2 and 3

- Lemma 2: `V(h,k) = sum_m {mh/k} cot(pi m/k) = -c_0(hbar/k)` by the substitution m -> m hbar; `kbar/h = 1/(hk) - hbar/k (mod 1)`;
  `x - 1/(hk) = (h hbar - 1)/(hk)` has denominator h. Confirmed. This is the Vasyunin/BBLS formula written with
  c_0, which is how Bettin and Conrey already write it. It is a restatement, not a new result. The check in
  `verify.py` item (1) compares the Farey form against a table built from the same Vasyunin formula, so it tests
  only the hbar/kbar algebra; the independent test is the brute-force integration above.
- Lemma 3: the recursion is a telescoping identity that follows from the definition of g alone
  (`c_0(h/k) = 1/(pi h) + g(h/k) - (k/h) c_0(k/h)`, iterate). Correct, and trivially so. Its only content is the
  CLASSICAL identification `g = (i/2) psi_0`, which is cited, not proved here.
- Three-term relation on rationals: re-derived. The c_0 terms cancel by `c_0(h/(h+k)) = -c_0(k/(h+k))` and
  periodicity; the elementary terms give `-1/h + 1/(h+k) + k/(h(h+k)) = 0`. At 40 digits (mpmath) the residual is
  4e-33 at (233,1000), 3e-34 at (377,610): the author's 3e-8 is float64 cancellation, as stated.
  `g(2/5) = -0.2394795094`, `c_0(2/5) = -0.0803245664`: the normalisation note is confirmed.
- Mellin form of G(h,k): re-derived from `int_0^inf {1/x} x^(s-1) dx = -zeta(s)/s`. Confirmed.
- `b_h = (log h + 1 - gamma)/h` and `b_h = L(1)/h` in the periodic case: re-derived. Confirmed.
- DH floor: `F = (1 - L A)/s`, `F(rho) = 1/rho`, reproducing kernel of H^2(Re s > 1/2) gives
  `d^2 >= (2 beta - 1)/|rho|^2 = 8.40e-5`. Confirmed.

## 3. Controls, rerun and extended

No zeta-only mechanism is claimed; the claim is the opposite (same law for DH). I rebuilt the DH table at
N = 1300 and added two controls the author did not run: mod 5 coefficients (1, 0.6, -0.6, -1, 0) (Euler-free, no
functional equation) and a generic zero-mean sequence mod 7 (1, 0.3, -1.1, 0.5, -0.2, -0.5, 0) (no Euler
product, no functional equation, no symmetry). Entries of all three agree with direct integration to 7e-7.

| family | lam_min N^2 at 100, 200, 400, 800, 1300 | fitted exponent (N = 200..1300) |
|---|---|---|
| zeta | 1.202, 1.250, 1.329, 1.420, 1.474 | -1.911 |
| DH | 1.003, 1.043, 1.097, 1.150, 1.193 | -1.928 |
| mod 5, kappa = 0.6 | 1.242, 1.294, 1.362, 1.429, 1.483 | -1.927 |
| generic mod 7 | 0.926, 0.970, 1.010, 1.062, 1.095 | -1.935 |

The author's values at N = 100..800 are reproduced to all printed digits. `d_N^2 log N` for zeta: 0.04560 (300),
0.04558 (1300). DH `d_N^2`: 2.849e-2 (300), 2.353e-2 (1300), consistent with the author's table.

The lam_min law is therefore independent of the Euler product and of the functional equation. This supports
the author's obstruction statement and makes it stronger than written: lam_min at these N carries no
arithmetic information of any kind.

## 4. Corrections required

1. **"Settles the open lemma" needs its exponent stated.** The node asks for `lam_min >= A N^(-p)`. Theorem 1
   gives it for every p > 2 with `A = A_p`. It does not give p = 2 (`2^(Omega_N)` is unbounded), and the upper bound
   refutes every p < 2, including the fitted 1.918 read as an asymptotic law. Whether `lam_min N^2` is bounded
   below is OPEN. RESULT.md says this in section 2; the headline should say "for every p > 2; false for p < 2;
   p = 2 open".
2. **Lemmas 2 and 3 are not new.** Lemma 2 is the BBLS formula in Bettin-Conrey notation; Lemma 3 is a
   telescoping identity. They should be labelled "restatement of CLASSICAL", not counted as results. Only
   Theorem 1 is a candidate new statement.
3. **The constant `2 + gamma - log 4 pi` is not an unconditional asymptotic.** Unconditionally (Burnol) there is a
   lower bound `liminf d_N^2 log N >= sum over on-line zeros of m(rho)^2/|rho|^2`; this equals `2 + gamma - log 4 pi`
   only under RH with simple zeros, and the matching asymptotic is conditional. RESULT.md uses it only as a
   comparison for a MEASURED value, so no step depends on RH, but "CLASSICAL constant" should read "RH-conditional
   constant (unconditional as a lower bound over on-line zeros)".
4. **Unlabelled statements.** The extension to L(s,chi) is stated without a label. I checked the sketch: with no
   linear term the jump argument gives `|f(m)|^2/2` per interval, the inverse is `mu c` with modulus <= 1, and
   `delta_N - delta_{N-1}` gives `Q <= C_q (log N)/N^2` for every zero-mean periodic c (so the upper bound holds for
   DH and for the two extra controls). It is correct as a sketch; it should be labelled PROVED-sketch. The
   sentences on E_a ("an analogue is expected") and on sign twists for sigma > 1 ("every inequality holds") are
   not derived and should be labelled OPEN / not checked. "Floor reached near log N ~ 2000" is an extrapolation
   of a law measured to N = 2000 only, with the DH value of `d_N^2 log N` drifting from 0.143 to 0.175.

## 5. Checks on the three prohibited patterns

- Assumes RH: no. Theorem 1 uses only the integral form of Q and Moebius inversion.
- Restates verified height: no. No zero data enters except one quoted DH zero used for a lower bound on the DH
  distance.
- Known theorem presented as new: Lemmas 2, 3 (see correction 2). For Theorem 1, one web search
  (smallest eigenvalue, Nyman-Beurling / Baez-Duarte Gram matrix) returned no statement of an `N^-2` law; this is
  not a literature review and novelty remains unchecked. The lower-bound argument is short enough that prior
  appearance is plausible.

## 6. Surviving claim

PROVED (elementary, now checked by a second agent): `1/(64 * 2^(Omega_N) * N^2) <= lam_min(G_N) <= (3+log N)/(N-1)^2`
for the Vasyunin Gram matrix, hence `lam_min >= A_p N^(-p)` for every p > 2 and for no p < 2; p = 2 open; novelty
unchecked. MEASURED (N <= 2000, reproduced at N = 1300): the same law, exponents -1.91 to -1.94, for zeta, four
characters, DH and two further Euler-free sequences without functional equation; `d_N^2 log N` roughly constant
for the six original families; the DH floor 8.4e-5 is not visible. Lemmas 2 and 3 are correct restatements of
classical formulas. No transfer-operator compression found (non-existence not proved). The quantity lam_min
carries no information about zeros; the route stops at P14/P15.

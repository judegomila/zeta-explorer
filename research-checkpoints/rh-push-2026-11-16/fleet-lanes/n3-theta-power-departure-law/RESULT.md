# n3-theta-power-departure-law: the family Z(w,s) = Mellin(theta(t^2)^w) as a control, and its departure law at w = 1

Date 2026-11-17. All runs local, single process, through `scripts/memcap.sh 8`, longest run 11 min. No ssh.
Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN. Nothing here is a statement about zeros of zeta.

## 0. Verdict

- The family is a valid control (MEASURED): for every sampled w != 1 in [0.8, 1.3] with |w-1| >= 0.0052 (below 1) or >= 0.0088 (above 1) it has off-line zeros below height 2000. The kill criterion ("an interval around w = 1 with full on-line count that does not shrink with T") is NOT met: the full-count window is (0.91685, 1.13217) at T = 160, (0.93124, 1.02712) at T = 400, (0.97259, 1.01692) at T = 1000, (0.99482, 1.00876) at T = 2000.
- The proposed law |w-1| log T = const is rejected for the first departure T_1(w) (the product width x log(T/2pi) falls from 0.70 to 0.080 between T = 160 and 2000). It holds for the MEDIAN gap: median |delta_k| log(gamma_k/2pi) = 0.82..1.03 in seven height bands. T_1 is an extreme-value statistic: window width ~ N(T)^(-0.84) (4 windows), N(T) = zero count.
- The w = 1.1 anomaly is explained: each gap of zeta has a signed critical exponent; below height 160 the smallest one on the w > 1 side is +0.13217 (pair 133.50/134.76), on the w < 1 side it is -0.08315 (pair 111.03/111.87). 1.1 is inside the window, 0.9 is outside.
- Lemma (a) as posed is false; the exact statement is proved: T_{p^2}-eigen iff w in {1,...,8}; multiplicative iff w in {1,2,4,8}.
- No w-monotone quantity singling out w = 1 was found. The two-sided margin delta_-(T) < 0 < delta_+(T) is a restatement of "RH and simplicity to height T", with margin tending to 0. No lever.
- New information for the map: the family passes Hecke-Hamburger uniqueness (FE + Dirichlet series + pole determine the function for every 0 < w < 8), which DH and HEAT do not test; and it contains two multiplicative members (w = 4, 8) with zeros off the central line, so inside the family multiplicativity without temperedness is not sufficient either.

## 1. Plan and what is new against the atlas and the map

The map's controls are DH (isolated, no pole, 2-dimensional FE space), HEAT (continuous, leaves the Dirichlet-series class), TW (no FE), EA, NR, B. The theta-power family is not in the map. It is a one-parameter deformation THROUGH zeta that keeps: exact FE with zeta's gamma factor, simple poles with residues of zeta's shape, a positive kernel, an ordinary Dirichlet series in m^(-s/2), Riemann-Roch (van der Geer-Schoof), and (section 3.3) uniqueness in its FE space. It drops multiplicativity. Plan: (1) first test: counts on a w grid; (2) per-gap critical exponents and the departure law; (3) exact Hecke/multiplicativity sets; (4) place the family against the map rows.

## 2. Definitions and exact formulas

theta(t) = sum_{n in Z} exp(-pi n^2 t), theta(1/t) = sqrt(t) theta(t). For real w > 0:

  Z(w,s) = int_1^inf (theta(t^2)^w - 1)(t^s + t^(w-s)) dt/t - 1/s - 1/(w-s).

- F1 (PROVED, two lines from the theta relation). Z(w,.) is meromorphic with simple poles at s = 0 and s = w only, Z(w,s) = Z(w,w-s), real on the real axis and on the central line Re s = w/2. For Re s > w+2: Z(w,s) = (1/2) pi^(-s/2) Gamma(s/2) D_w(s), D_w(s) = sum_{m>=1} c_w(m) m^(-s/2), theta^w = sum c_w(m) q^m (binomial series; |c_w(m)| = O(m^(w/2)) by Cauchy's bound on |q| = 1-1/m).
- F2 (CLASSICAL). w = 1: Z = pi^(-s/2) Gamma(s/2) zeta(s). w = 2: Z = 2 pi^(-s/2) Gamma(s/2) zeta(s/2) L(s/2, chi_-4). w = 4: D_4 = 8 (1 - 4^(1-s/2)) zeta(s/2) zeta(s/2 - 1).
- F3 (PROVED; rotated contour). With delta = pi/4 - eps, f(u) = theta(e^(2 i delta) u^2)^w - 1 (branch: log theta = sum_n log(1 - q^(2n)) + 2 log(1 + q^(2n-1)), principal logs, analytic in |q| < 1), J(s) = int_1^inf f(u) u^(s-1) du and Jb the same with conj(f):
  e^(delta tau) Z(w, w/2 + x + i tau) = e^(i delta (w/2+x)) (J(s) - 1/s) + e^(-i delta (w/2-x)) (Jb(w-s) - 1/(w-s)).
  On the line (x = 0) this is 2 Re[e^(i delta w/2)(J(s) - 1/s)]. The cancellation is only e^(eps tau), which is what makes heights 400-2000 computable.

## 3. Lemma (a): Hecke and multiplicativity sets (exact)

c_w(m) is a polynomial in w of degree m with rational coefficients (recurrence n c(n) = sum_{j = k^2 <= n} 2 (w j - (n-j)) c(n-j)). `hecke.py` works in Q[w] (python-flint fmpq_poly, exact).

- A1 (PROVED, exact identity). c(1) c(6) - c(2) c(3) = (8/45) w^3 (w-1)(w-2)(w-4)(w-8). Hence c_w(m)/c_w(1) is multiplicative only if w in {1,2,4,8}; the converse is CLASSICAL (Jacobi: r_1, r_2, r_4, r_8). D_w has an Euler product exactly for w in {1,2,4,8}. The pairs (2,5), (3,4) give extra factors; the gcd over 8 coprime pairs is w^3 (w-1)(w-2)(w-4)(w-8).
- A2 (PROVED, exact gcd; converse CLASSICAL + checked). Definition used for real w: "T_{p^2}-eigen" means c(p^2 n)/c(n) is constant on each Legendre class of n coprime to p. For p = 3, 5, 7 the gcd of the seven relations c(p^2 n_1) c(n) = c(p^2 n) c(n_1) over the first eight n in each class is w^3 (w-1)(w-2)...(w-8) (one extra factor (w-1) in the non-residue class). So the relation at a single odd prime already forces w in {1,2,...,8} (w = 0 is the constant 1). Conversely for w = 1..8 the class-constant relation holds for all n <= 666 (p = 3), 240 (p = 5), 122 (p = 7) (`hecke2.py`), and for all n by the classical theory (theta^w spans its space for w < 8, section 3.3; Eisenstein for w = 8). For w = 9..12 it fails.
- Consequence. The exact T_{p^2}-eigen set is {1,...,8}, not {1,2,4,8}. {1,2,4,8} is the Euler-product set. For w = 3, 5, 7 the full half-integral three-term relation c(p^2 n) + p^(w-2) c(n/p^2) = (A_p + B_p (n|p)) c(n) holds for all tested n (A_3 = 4, 28, 244). For w = 6 the T_{p^2} eigenvalue is p^4 + chi_-4(p) p^2 + 1 (73, 651, 2353 for p = 3, 5, 7): theta^6 is a sum of two Eisenstein eigenforms with different T_p eigenvalues and equal T_{p^2} eigenvalues.

### 3.3 Uniqueness (CLASSICAL, cited from memory: Hecke; Berndt-Knopp, Hecke's theory of modular forms and Dirichlet series)
The Dirichlet series with signature (lambda, k, gamma) = (2, w/2, +1), i.e. sum c(m) m^(-s') with (pi)^(-s') Gamma(s') phi(s') + c_0/s' + c_0/(k - s') entire, bounded in vertical strips and invariant under s' -> k - s', form a space of dimension 1 + [k/4]. For 0 < w < 8 this is 1: Z(w,.) is the only such function up to scale. Hamburger's theorem is the case w = 1.

## 4. First test: counts (MEASURED)

Method. Double precision: composite 16-point Gauss-Legendre on geometric panels in u, eps = 0.03 (5584 nodes, heights <= 400) and eps = 0.009 (25680 nodes, heights <= 2000); tau step 0.005 (to 400) and 0.01 (to 2000). Independent 60-digit run: python-flint acb at 250 bits, eps = 0.1, 48-point panels (9696 nodes), `hp.py`. Argument principle: winding of Z on the half rectangle 0 <= x <= 4, 0.5 <= tau <= T (the FE and conjugation give the other half; Re s = w/2 + 4 is in the region where the m = 1 term of D_w dominates).

Checks of the evaluator:
- w = 1 against pi^(-s/2) Gamma(s/2) zeta(s): absolute error <= 6e-15 (double, to tau = 399.5); relative error 2.3e-62 (tau = 30.5) and 6.4e-58 (tau = 150.25) in the 60-digit code.
- w = 2 against 2 pi^(-s/2) Gamma(s/2) zeta(s/2) L(s/2, chi_-4): agreement to 1e-14.
- w = 4: 44 on-line zeros of 202 below 400; 44 = number of zeros of 1 - 4^(1-s/2) (spacing 2 pi/ln 2), and 158 = 2 N_zeta(200) off-line at Re s = 1 and 3. Exact agreement with F2.
- Brief's counts to height 160 reproduced: 58 (w = 1, 1.1, 2), 56 (0.9), 52 (0.8, 1.25), 44 (1.5), 23 (3); total count 58 (59 for w = 3).
- Argument-principle totals are integers to 1e-10 (height 400) and 1e-7 (height 2000).

Grid result, w = 0.80..1.30 step 0.01, 0.5 < Im s < 400 (`s400.txt`; total N = 201 or 202, a zero crosses 400 near w = 0.975):

| w | on-line | w | on-line | w | on-line | w | on-line |
|---|---|---|---|---|---|---|---|
| 0.80 | 173 | 0.93 | 199 | 1.06 | 200 | 1.19 | 180 |
| 0.81-0.83 | 175 | 0.94-0.97 | 201 (all) | 1.07-1.08 | 198 | 1.20-1.22 | 180 |
| 0.84 | 179 | 0.98-1.02 | 202 (all) | 1.09-1.10 | 196 | 1.23 | 176 |
| 0.85 | 183 | 1.03-1.05 | 200 | 1.11 | 194 | 1.24 | 170 |
| 0.86 | 185 | | | 1.12 | 190 | 1.25-1.26 | 168 |
| 0.87 | 187 | | | 1.13 | 186 | 1.27-1.28 | 166 |
| 0.88 | 189 | | | 1.14 | 184 | 1.29-1.30 | 162 |
| 0.89 | 191 | | | 1.15 | 182 | | |
| 0.90-0.91 | 195 | | | 1.16-1.18 | 180 | | |
| 0.92 | 197 | | | | | | |

60-digit confirmation: for all 51 grid values the sign of Z at the midpoints between consecutive double-precision zeros alternates without exception (9585 evaluations, `hp400mid.json`), giving the same on-line counts. 60-digit argument principle to height 399.9 for w = 0.8, 0.9, 0.93, 0.94, 1.0, 1.02, 1.03, 1.1, 1.2, 1.3: totals 201, 201, 201, 201, 201, 201, 201, 201, 202, 202; off-line = 28, 6, 2, 0, 0, 0, 2, 6, 22, 40 (`hp400rect.txt`).

Off-line zeros located (double Newton, confirmed at 60 digits: |Z| at the point is 1e-8 of its value 0.01 away): e.g. w = 0.90: s = w/2 + 0.15032652 + 111.33750195 i; w = 1.03: w/2 + 0.12556784 + 357.49562324 i; w = 1.30: w/2 + 0.77802356 + 357.02506094 i (`offline.json`, `hpoff.json`). The offset grows like a square root past the critical w and reaches 0.78, i.e. Re s = 1.43 > w: zeros lie to the right of the pole.

Near w = 2 the on-line property is more fragile: w = 1.98 keeps 189 of 201, w = 2.02 keeps 175 (`sx.txt`).

## 5. Lemma (b): the departure law

- B1 (PROVED). F(w,tau) = e^(delta tau) Z(w, w/2 + i tau) is real-analytic in (w,tau). Zeros of Z(w,.) in a compact rectangle vary continuously with w (Hurwitz) and are symmetric under s -> w - conj(s); a simple on-line zero therefore stays on the line. So an on-line zero can leave only through a double zero of F(w,.), and for every T below verified height there is an open interval I_T containing 1 on which all zeros below T are on the line. (Uses: zeros of zeta below T on the line and simple.)
- B2 (PROVED to first order). The pair bounding gap k merges at w - 1 = delta_k + O(delta_k^2), delta_k = -F/F_w at the stationary point of F/F_w inside the gap; if F_w changes sign inside the gap there is no first-order merger.
- MEASURED (`s2000_gaps.txt`, `law.py`, 1516 gaps of zeta below 2000): 979 gaps are first-order mergeable (575 on the side w < 1, 404 on w > 1), 537 are not. First-order prediction against direct loss on the w grid (pairs lost below 2000): 6 predicted / 6 lost at w = 0.99, 2 / 1 at 1.01, 1 / 0 at 0.995, 20 / 20 at 1.03, 36 / 31 at 0.96. Exact critical values by bisection (`crit.json`, `bis174.py`):

| pair (zeta zeros) | first-order delta_k | exact critical w - 1 |
|---|---|---|
| 75.70, 77.14 | -0.1055 | -0.13489 |
| 111.03, 111.87 | -0.0606 | -0.08315 |
| 133.50, 134.76 | +0.1384 | +0.13217 |
| 204.19, 205.39 | +0.1131 | +0.12201 |
| 275.59, 276.45 | +0.0816 | +0.08179 |
| 357.15, 357.95 | +0.0283 | +0.02712 |
| 367.99, 368.97 | -0.0636 | -0.06876 |
| 459.51, 460.09 | -0.0347 | -0.03885 |
| 630.47, 630.81 | +0.0210 | +0.01692 |
| 677.23, 677.80 | -0.0241 | -0.02741 |
| 1054.78, 1055.00 | -0.0073 | -0.00804 |
| 1283.00, 1283.34 | +0.0094 | +0.00876 |
| 1329.04, 1329.20 | -0.0056 | -0.00562 |
| 1977.17, 1977.27 | -0.0043 | -0.00518 |

- Full-count windows (edges bisected; interior checked on the grid; at T = 2000 additionally w = 0.9949 and 1.0087 keep 1517 of 1517, w = 0.9947 and 1.0089 keep 1515):

| T | N(T) | window | width | width x log(T/2pi) |
|---|---|---|---|---|
| 160 | 58 | (0.91685, 1.13217) | 0.2153 | 0.697 |
| 400 | 202 | (0.93124, 1.02712) | 0.0959 | 0.398 |
| 1000 | 649 | (0.97259, 1.01692) | 0.0443 | 0.225 |
| 2000 | 1517 | (0.99482, 1.00876) | 0.0139 | 0.080 |

  End-to-end exponent: width ~ N(T)^(-0.84).
- Bulk law (MEASURED). Median of |delta_k| log(gamma/2pi) over mergeable gaps in the bands [14,100), [100,200), [200,400), [400,700), [700,1000), [1000,1400), [1400,2000): 1.03, 0.92, 0.89, 0.90, 0.91, 0.87, 0.82. So the hypothesised form |w-1| log T = const (about 0.9) describes the height at which a positive proportion of pairs has left, not the first departure. Small-value law: P(|delta_k| log(gamma/2pi) < y) ~ 1.2 y^1.85 (lowest 15 percent, 144 gaps). log|delta_k| against log(normalised gap): slope 1.40, correlation 0.52.
- ARGUED (heuristic). If delta_k is proportional to the hump height, hence to (normalised gap)^2, and gaps follow GUE repulsion P(gap < g) ~ g^3, then P(y) ~ y^(3/2) and the first departure obeys |w-1| ~ C N(T)^(-2/3)/log(T/2pi). Measured exponents (1.85 for the distribution, 0.84 for the window) are of this type but do not match 3/2 and 2/3 + log; the range T <= 2000 does not decide.
- The 1.1 anomaly (MEASURED). The sign of delta_k is the sign of -F/F_w on the hump and is not tied to gap size: among the 18 mergeable gaps with normalised gap < 0.3, 10 break on the side w < 1 and 8 on w > 1. Below 160 the closest pair (111.03/111.87, normalised gap 0.387) breaks at w = 0.91685; on the other side nothing breaks before w = 1.13217. Hence 58 of 58 at w = 1.1 and 56 at w = 0.9.

## 6. Controls: where the family sits in the obstruction map

What the family has, for every real w in (0,8) (labels as in section 2-3): exact FE with zeta's gamma factor (after the shift s -> s + (w-1)/2); simple poles at the two FE-fixed ends; positive kernel theta(t^2)^w - 1 > 0 (PROVED, trivial); ordinary Dirichlet series in m^(-s/2) with real coefficients; Riemann-Roch for the lattice Z (CLASSICAL); uniqueness in its FE space (CLASSICAL, 3.3); real-analytic dependence on w through zeta.
What it lacks for w not in {1,2,4,8}: multiplicativity (first defect at m = 6, A1), support on squares (c(2) = 2w(w-1)), any Lambda. For w = 4, 8 it lacks unimodular local parameters only.

Row by row (map section 3):
- Wall item 2 rows (P1, P7, P8, G1-G3, G6, G13, Q1-Q3, Q6, S8): these use an even real entire function of order one with a functional equation. Xi_w(z) = s(s-w) Z(w,s), s = w/2 + z, is such a function, so they hold verbatim. ARGUED by inspection of hypotheses; not re-run. Same outcome as DH.
- P3, P5, S7 and every finite certificate at fixed height (finite Pick orders, finite sector positivity): strict inequalities on finitely many functionals continuous in the kernel hold on a neighbourhood of w = 1 (PROVED given continuity; radius not computed per row). HEAT gives the same openness but leaves the Dirichlet-series class; the theta-power family stays inside "fixed gamma factor + ordinary Dirichlet series + pole". This is the part not covered by DH (isolated) or HEAT.
- L2 and the note in map section 2 ("FE + INT is Hamburger uniqueness of zeta, with no inequality"), P6 (Theorem R identifies the function): uniqueness holds at every w in (0,8) while the on-line property fails for the sampled w outside {1,2}. Uniqueness in an FE space therefore carries no zero-location content. PROVED relative to 3.3. DH does not test this (its FE space is 2-dimensional).
- G12, G16, G17 (lattice-variable and modular-average rows): the family is the rank-one lattice with a real exponent; Riemann-Roch holds for all w. Passes (ARGUED).
- L5 (minimal package M1-M4: FE, multiplicativity, spherical vector, unsheared position): w = 4 and 8 have FE and multiplicativity and zeros at Re s = w/2 -+ 1 and -+ 3 (MEASURED for w = 4: 44 of 202 on-line, exactly the zeros of 1 - 4^(1-s/2)). They are E_a-type members (a = 1/2, 3/2 in the s/2 variable) inside the family; they fail at temperedness, consistent with the minimal hitting sets {FE, GEOM}.
- Prime-side rows (Q4, Q10-Q13, P13, P29, Z rows): not formulable for non-multiplicative w; by the map's rule this is not a quantitative handle. The family gives no information on them.
- Kernel-side refined inputs of PR 44/56 ((F), (G), (H)), Csordas-type convexity: NOT checked for theta^w. OPEN.

What it forces on a proof: an argument must fail for w in a punctured neighbourhood of 1 whose radius tends to 0 with height. No finite-height statement, no statement open in the kernel, no uniqueness statement and no lattice or Riemann-Roch statement can do this. The step that fails must use c(mn) = c(m)c(n) (lost at first order in w - 1: c(1)c(6) - c(2)c(3) = -(56/15)(w-1) + O((w-1)^2)) and, because of w = 4, 8, unimodular local parameters. This is the map's corollary (b); the family adds a continuous witness with pole and uniqueness.

Lever search (kill criterion's alternative): quantities examined for w-monotonicity through w = 1: on-line count (not monotone; plateaus around 1 and a single point at 2); sign of delta_k for close pairs (no bias, 10 against 8); position of off-line zeros (two-sided square-root branch at each critical w). None singles out w = 1 except the two-sided window itself, whose non-emptiness for all T is RH plus simplicity. No candidate lever.

## 7. Three weakest steps

1. Numerical rigour. Quadrature truncation and panel errors are not bounded by interval arithmetic; the Arb run controls rounding only. Evidence is agreement of two independent codes (double, 60-digit), the zeta, zeta*L and w = 4 identities, and integer winding numbers. Off-line zeros and the critical exponents are MEASURED, not certified.
2. Map placement. The statement that the wall-item-2 rows hold "verbatim" is by inspection of their hypotheses, not a re-run; the refined kernel conditions (F), (G), (H) and finite Pick orders were not computed for theta^w; Hecke's dimension formula 1 + [k/4] is cited from memory and should be checked against Berndt-Knopp before reuse.
3. The law. Window exponent 0.84 rests on four heights and 14 bisected pairs below 2000; the heuristic (2/3 with a log) is not confirmed; "every w != 1 has off-line zeros" is not proved and is measured only for |w-1| >= 0.0052 / 0.0088. First-order delta_k differs from the exact critical value by up to 37 percent (-0.0606 against -0.0832), changes the order of records, and is undefined for the 35 percent of gaps where F_w changes sign; such gaps can still lose their pair at larger |w-1| (seen on the direct grid).

## 8. Files and reproduction

`tlib.py` (evaluator), `scan.py`, `analyse.py`, `gaps.py`, `law.py`, `bisect.py`, `bis174.py`, `offline.py`, `hp.py` (60-digit), `mkjob.py`, `mkjob400.py`, `cmpjob.py`, `cmprect.py`, `hecke.py`, `hecke2.py`, `test0.py`. Outputs: `s400.txt`, `s2000.txt`, `s2000_gaps.txt`, `sx.txt`, `crit.json`, `offline.json`, `hpoff.json`, `hp160.json`, `hp400mid.json`, `hp400rect.json`, `hp400rect.txt`, `*.pkl`. The `.npz` scan arrays were deleted (regenerate in under 2 min each).
From the repo root: `scripts/memcap.sh 8 .venv-arb/bin/python <dir>/scan.py 0.03 400 0.005 <dir>/s400.npz 0.8:1.3:0.01`, then `analyse.py` and `gaps.py` on the npz; `TSTEP=10 ... scan.py 0.009 2000 0.01 <dir>/s2000.npz 0.96:1.04:0.005`; `hp.py 400 job400mid.json hp400mid.json`.

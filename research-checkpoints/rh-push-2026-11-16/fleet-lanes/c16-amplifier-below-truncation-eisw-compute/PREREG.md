# PREREG: Hecke amplifier with N above the truncation height T, on the truncated Eisenstein series

Written 2026-11-19 before any amplified norm with T < N was computed in this lane. The only number of this kind
known to the author at this time is the one recorded in `c15-edge-argument-strip-width-hecke-amplified`
(zero 1, N = 8, T = 1, float64 spectral quadrature: gain 2.728 against N^delta = 2.828).

## 1. Object

Gamma = PSL(2, Z), F the standard fundamental domain, d mu = dx dy / y^2.
xi(s) = pi^(-s/2) Gamma(s/2) zeta(s). s = sigma + i t, w = s/2, nu = w - 1/2, delta = 1 - sigma.
f = E*(z, w) = A y^w + B y^(1-w) + 4 sqrt(y) sum_(n>=1) tau_nu(n) K_nu(2 pi n y) cos(2 pi n x),
A = xi(2w) = xi(s), B = xi(2w - 1) = xi(2 - s), c0(y) = A y^w + B y^(1-w), lambda(m) = tau_nu(m) = sum_(ad=m) (a/d)^nu.
Truncation at any height h > 0: Lambda^h f = f - E(z | c0 1_(y>h)), E(z | psi) = sum over Gamma_inf \ Gamma of psi(Im g z).
T_m g(z) = m^(-1/2) sum over ad = m, b mod d of g((az + b)/d).
Amplifier A_x = sum_(m<=N) x_m T_m, lambda_x = sum x_m lambda(m). Vector v = A_x Lambda^T f.

Norm computed: ||v||^2 = integral over F of |v|^2 d mu.

## 2. First lemma (paper, before code): which coset terms cross the truncation line

(L-a) T_m commutes with psi -> E(z | psi), with (T_m psi)(y) = m^(-1/2) sum_(ad=m) d psi(a y / d). Hence, for every
T > 0 and every m,

    T_m Lambda^T f = lambda(m) f - sum_(ad=m) [ (a/d)^nu E(z | A y^w 1_(y > Td/a)) + (a/d)^(-nu) E(z | B y^(1-w) 1_(y > Td/a)) ].

The heights are h = T d / a, from T/m to T m.

(L-b) Constant term of E(z | psi): psi(y) + sum_(c>=1) phi_E(c) int_R psi(y / (c^2 (x^2 + y^2))) dx (phi_E Euler).
For psi supported in y > h the term c is supported in y < 1/(c^2 h). For two step functions with thresholds h_i
(conjugated factor) and h_j, unfolding gives

    <E(psi_j), E(psi_i)> = int psi_j conj(psi_i) dy/y^2 + sum over c >= 1 with c^2 h_i h_j < 1 of phi_E(c) I(c; h_i, h_j),

and with u = Im g z as a coordinate in place of x,

    I(c; h_i, h_j; a, bbar) = (1/c) int int over {y > h_i, u > h_j, c^2 u y < 1} of y^(bbar - 3/2) u^(a - 3/2) (1 - c^2 u y)^(-1/2) du dy
                            = c^(-2a) / (bbar - a) * [ (c^2 h_j)^(a - bbar) Bq(bbar - 1/2) - h_i^(bbar - a) Bq(a - 1/2) ],
    Bq(e) = int_q^1 t^(e-1) (1 - t)^(-1/2) dt,  q = c^2 h_i h_j,

for the pieces u^a (a in {w, 1-w}) and conj(y^b) (b in {w, 1-w}).

**Crossing rule: the coset with lower-left entry c contributes to the pairing of the truncations at heights h_i, h_j
exactly when c^2 h_i h_j < 1.** For the pair (T_m, T_n) the smallest product is T^2/(mn). So:
the pairing of T_m Lambda^T f with Lambda^T f itself (n = 1) is free of crossing terms iff m <= T^2; the norm of
T_m Lambda^T f alone is free of them iff m <= T; the whole Gram matrix for m, n <= N is free of them iff N <= T
(Proposition A of the c15 lane). For m > T^2 the terms c = 1, ..., < sqrt(m)/T cross.

(L-c) With H = max(T N, N / T) and g = Lambda^H f (classical truncation, H >= 1): v_m = T_m Lambda^T f =
lambda(m) g + E(Phi_m), Phi_m supported in [T/m, H], and

    <v_m, v_n> = lambda(m) conj(lambda(n)) MS(H) + lambda(m) <g, E(Phi_n)> + conj(lambda(n)) conj(<g, E(Phi_m)>) + <E(Phi_m), E(Phi_n)>,
    <g, E(Phi)> = int_0^H c0 conj(Phi) dy/y^2   (the constant term of g is c0 on 1/H < y <= H),
    MS(H) = (|A|^2 H^(2 Re w - 1) - |B|^2 H^(1 - 2 Re w))/(2 Re w - 1) + Im(A conj(B) H^(2 i Im w)) / Im w   (Maass-Selberg).

Every term is a finite sum of powers and of the incomplete beta values Bq. The value must not depend on H (check).
This holds for every s with sigma != 1 and t != 0, zero or not. At a zero, A = 0.

## 3. Statistics

S1 (gain). G(x) = |lambda_x|^2 ||Lambda^T f||^2 / ||A_x Lambda^T f||^2, compared with N^delta.
  Amplifier families:
  - OPT: the supremum over x in C^N, equal to MS(T) * lambda^* (P^T)^(-1) lambda with P_(mn) = <v_m, v_n>.
  - HECKE: x_m = conj(lambda(m)).
  - SELBERG: x_m = conj(lambda(m)) (1 - log m / log N).
  - PRIMES: x_p = conj(lambda(p)) for primes p <= N, zero otherwise.
  - RANDOM (24): x = a + i b, a, b standard normal N-vectors from numpy default_rng([20261119, T, N, k]), k = 0..23;
    the same vectors at every point s of a cell.
  Also reported: R_gen = MS(T) / MS(T/N) with MS(h) the Maass-Selberg expression evaluated at h (formal for h < 1);
  at a zero R_gen = N^delta. For T >= N one has G <= R_gen for every s (proved in the lane text), so R_gen is the
  comparator that does not use phi = 0.

S2 (device). At a zero, f = N(z) + B y^(1-w) with N the non-constant part (free of B). The unamplified device
(T = 1) is |B|^2/delta >= L, L = strip energy of N in y > 1: it excludes |B'|^2 < delta L. The amplified device is
||v||^2 >= energy of v in the strip {|x| <= 1/2, y > 1}; with B replaced by an unknown B' both sides are quadratic
in B': |B'|^2 q1(x) >= |lambda_x|^2 L + 2 Re(lambda_x conj(B') c_x) + |B'|^2 p_x, where q1 = ||v||^2/|B|^2 (closed
form of section 2), p_x and c_x strip integrals of g_x = (v - lambda_x N)/B. It excludes a disc of B'; the lower
bound it gives for |B| is the positive root r_x of (q1 - p_x) r^2 + 2 |lambda_x c_x| r - |lambda_x|^2 L = 0.
  Statistic R2(x) = r_x^2 / (delta L). The amplified inequality is implied by the unamplified one iff R2 <= 1.
  For T >= N one has c_x = 0, q1 - p_x = |lambda_x|^2/delta, R2 = 1 exactly (used as a code check).
  S2 needs two-dimensional quadrature of discontinuous functions; it is a float64 MEASURED screen on small cells:
  (T, N) = (1, 2), (1, 4), (2, 4), (1, 8) as time allows, 12 zeros, sup over x by numerical optimisation from
  random starts plus the named families.

## 4. Grid

T in {1, 2, 4}; N in {2T, 8T, 32T} (nine cells; N up to 128).
Points: (Z) the first 12 zeros, s = 1/2 + i gamma_k, delta = 1/2, A = 0;
(O) off-line test points s = 1 - delta + i gamma_k, delta in {0.05, 0.1, 0.2}, k = 1..12 (36 points; not zeros;
both constant terms present; every quantity computed from the two-term formulas, not from formulas derived at a zero);
(E) EIS-w points on the line of the zeros: s = 1/2 + i t with t the 11 midpoints (gamma_k + gamma_(k+1))/2 and
t = 10 (12 points; phi != 0, A != 0). The (O) points are EIS-w points as well (Re(1-w) in (1/2, 1), phi != 0).
Arithmetic: python-flint arb balls, 400 bits (raised if a solve fails); zeros from acb.zeta_zero. Verdict cells are
ball statements. No float64 number enters S1.

## 5. Checks registered before the grid

C1. M = L + S at T = 1 at the first 5 zeros and at 3 off-line points: Maass-Selberg against direct quadrature over F,
    target 1e-10 relative.
C2. (L-a) pointwise: T_m Lambda^T f(z) from the definition (sum over (az+b)/d, each point reduced to F) against the
    right side of (L-a) with explicit coset sums, m > T^2, at random z; target 1e-20.
C3. The closed form of ||A_x Lambda^T f||^2 with crossing terms against direct two-dimensional quadrature over F,
    T = 1, N = 2 (and N = 3, 4 if the run time allows), at one zero and at one off-line point, two amplifiers each;
    target 1e-8 relative.
C4. Independence of H: the Gram matrix at H and at 3H agree to ball precision.
C5. For T >= N (cells (2,2), (4,4) added for this purpose): G_OPT reproduces the c15 values (zero 1, delta = 1/2,
    N = 8: 2.7098; N = 32: 5.4586) and G <= N^delta.
C6. Incomplete beta by 2F1 against acb.integral on 20 random (q, e).

## 6. Predictions

P-A (the assignment's prediction, registered as stated): G <= N^delta in every cell, every family, and EIS-w passes
the same bound.

Author's per-cell expectations from section 2, registered before computing (they differ from P-A in two places):
- (Z) cells, all nine (T, N), all 12 zeros: OPT gain within [0.90, 1.00] x N^delta is expected, but the crossing
  terms I(c; h_i, h_j) carry the oscillating factor (y/u)^(i gamma / 2) and have no sign. A violation G_OPT > N^delta
  of relative size O(1/gamma) at the low zeros is possible; a violation growing like a power of N is not expected.
  Families HECKE, SELBERG, PRIMES, RANDOM: G <= G_OPT, hence the same.
- (O) and (E) cells: P-A is expected to FAIL in the direction G_OPT > N^delta for a reason unrelated to the
  amplifier: with A != 0 the proved comparator for T >= N is R_gen = MS(T)/MS(T/N), which exceeds N^delta when the
  A-term lowers MS at the lower height. Expected: G_OPT <= R_gen where MS(T/N) > 0 and T >= N; for T < N the ratio
  G_OPT / R_gen is expected within a few per cent of the (Z) values.
- S2: R2 <= 1 in every cell and every x tried.

## 7. Outcomes and decision rule

- CLOSE (family 31, T < N item): G_OPT <= N^delta at all (Z) cells, or violations that are bounded factors not
  growing with N at fixed T, and (O)/(E) points show gains at least as large relative to N^delta (the bound does not
  read phi = 0); and R2 <= 1 where S2 is run.
- STAGE-A CANDIDATE (MEASURED, no score): at (Z) points G_OPT / N^delta > 1 with log(G_OPT/N^delta) >= 0.05 log N
  across the three N of a fixed T for at least 6 of 12 zeros, and the (E) points at neighbouring heights do not show
  a ratio at least as large; or R2 > 1 by more than the quadrature error at some zero.
- A formula derived at a zero is not used at an (O) or (E) point.

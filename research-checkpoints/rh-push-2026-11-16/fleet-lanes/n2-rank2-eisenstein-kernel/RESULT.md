# n2-rank2-eisenstein-kernel: is rank-2 Maass-Selberg positivity more than rank-1 innerness?

Internal working note, 2026-11-17. Not refereed. Nothing committed, pushed or posted. No ssh.
Every run went through `scripts/memcap.sh 8`, single process, longest run 2 min. RH open. No statement about zeros of zeta is made.

Labels: PROVED (complete argument here) / CLASSICAL / MEASURED / MEASURED-exact (finite-rank kernel, inertia read off at
150-220 digits with a gap of more than 100 orders between the smallest nonzero eigenvalue and the noise floor) / OPEN.

**Verdict: precise obstruction.** Rank-2 positivity is strictly stronger than Lemma 1 and than rank-1 positivity, but the
extra content is a functional-equation-level condition, not a zero-location condition:

1. PROVED (Theorem A). Rank 1: for `c = theta(z)(z+1)/(z-1)` with `theta` real inner, the Maass-Selberg kernel at
   `T = 1` is positive semidefinite iff `theta(1) >= 0` (sign of the residue at `z = 1`). So rank 1 = Lemma 1 + one sign.
2. PROVED (Theorem B). Rank 2: `d/dx K2_{T + x alpha_i^vee}` is a sum of rank-1 kernels. Given rank-1 positivity,
   `K2_T >= K2_0` for every `T` in the closed chamber. All rank-2 content beyond rank 1 sits in the corner kernel `K2_0`.
3. MEASURED-exact over the pole model `c0 = (z+1)/(z-1)`, MEASURED over zeta: the corner kernel is positive for every
   fake whose zero set is closed under `rho -> 1 - conj(rho)` (off-line quadruples at any distance from the line
   included), and has negative eigenvalues as soon as a zero with `Re rho < 1/2` lacks its reflected partner, or the
   root number is -1. An asymmetry of size `1e-6` already gives two negative eigenvalues.
4. Consequence: the rank-2 kernel tests "c = xi(z)/xi(z+1) with xi(s) = xi(1-s), even sign", which Davenport-Heilbronn-type
   controls with off-line quadruples satisfy. No Euler-sensitive step appears. Lane closed. No pivot taken (section 8).

Correction to the assignment text: the kernel is Hermitian for every `c` (also for the sign twist); what the sign twist
loses is `c(z)c(-z) = 1` (section 6.4).

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows G12, P7, Q5, Q14, S8 (and Q2), `g-torus-modular/RESULT.md` section 3.
New relative to those rows: G12 has the rank-1 kernel for `PSL2(Z)` only and no characterisation; Q5 uses Blaschke
quotients as controls for the bridge hypotheses, not for a rank-2 Gram kernel. This lane: (a) exact rank-1
characterisation, (b) reduction of rank 2 to a corner kernel, (c) the first test with a pluggable `c`.

Order followed: first test first (sections 4-6), then the two proofs that the test suggested (sections 2-3).

## 2. Formula, normalisation, Lemma 1

### 2.1 Setting [CLASSICAL; citations from memory, not re-checked against the sources]

`G = SL3`, `Gamma = SL3(Z)`, minimal parabolic. `lambda in C^3`, `sum lambda_i = 0`; `z1 = lambda1 - lambda2`,
`z2 = lambda2 - lambda3`; positive coroot pairings `z1, z2, z1 + z2`. `W = S3` acts by permuting coordinates.
`E(g, lambda) = sum_{B(Z)\Gamma} exp<lambda + rho, H(gamma g)>`, convergent for `Re z_i > 1`.
Constant term along `B`: `sum_w M(w, lambda) exp<w lambda + rho, H>`,

    M(w, lambda) = prod_{alpha > 0, w alpha < 0} c(<lambda, alpha^vee>),   c(z) = xi(z)/xi(z+1),   xi(s) = pi^(-s/2) Gamma(s/2) zeta(s)

(Gindikin-Karpelevich / Langlands). `c(z) c(-z) = 1`, `c(0) = -1`, simple pole at `z = 1` with residue `1/xi(2) = 1.9098593`.
Cocycle: `M(w'w, lambda) = M(w', w lambda) M(w, lambda)`.

Langlands' inner product formula (Langlands, Boulder 1966, section 9; Arthur, Compositio 40 (1980), Lemma 4.2), up to a
positive volume constant:

    <Lambda^T E(lambda), Lambda^T E(mu)> = K2_T(lambda, mu)
      := sum_{w, w' in W} M(w, lambda) conj(M(w', mu)) exp<L, T> / ( (L1 - L2)(L2 - L3) ),     L = w lambda + w' conj(mu).      (2.1)

Region of regularity: `E(lambda)` is holomorphic for `Re lambda` in the open positive chamber away from
`<lambda, alpha^vee> = 1` (`alpha > 0`); `Lambda^T E` is rapidly decreasing, so (2.1) is a Gram kernel on the tube
`{Re z1 > 0, Re z2 > 0}` minus those hyperplanes. The arguments of `c` lie in the critical strip when `Re z_i in (0,1)`.
Validity in `T`: stated in the sources for `T` sufficiently regular. For `SL_n(Z)` the closed chamber `T >= 0` is the
expected range (semistable truncation); this is ASSUMED, not checked. It is not needed for the conclusion (section 7).
The formula is Hermitian for every function `c`: the `(w, w')` term at `(lambda, mu)` is the conjugate of the `(w', w)` term at `(mu, lambda)`.

Rank 1 in the same variables (`t = log(height)/2`, `t = 0` is `T = 1` for `PSL2(Z)`):

    K1_t(z, w) = [e^{(z+w~)t} - c(z) c~(w) e^{-(z+w~)t}]/(z + w~) + [c~(w) e^{(z-w~)t} - c(z) e^{-(z-w~)t}]/(z - w~),   w~ = conj w, c~(w) = conj c(w).   (2.2)

### 2.2 Lemma 1 [PROVED; inputs: Hadamard product, functional equation, zeta != 0 on Re s > 1]

Let `Xi(s) = s(s-1) xi(s)` (entire, order 1). Then `c~(z) := c(z)(z-1)/(z+1) = Xi(z)/Xi(z+1)` and

    c~(z) = prod_rho (z - rho)/(z + conj rho)      (product over the zeros of Xi, grouped rho with conj rho),

a Blaschke product for `Re z > 0`. Proof. `Xi(z)/Xi(z+1) = prod_rho (rho - z)/(rho - z - 1)` (the exponential factors
cancel because `B = -sum Re(1/rho)`). `log|1 + 1/(rho - z - 1)| = Re(1/(rho - z - 1)) + O(|rho|^-2) = O(|rho|^-2)`, so
the product of moduli converges absolutely and may be re-indexed. The zero set is invariant under
`rho -> 1 - conj rho`; re-index the denominators: `|c~(z)| = prod |z - rho|/|z + conj rho|`. Each factor is `<= 1` on
`Re z > 0` exactly when `Re rho >= 0`, which is `zeta != 0` on `Re s > 1` reflected. `c~/B` is zero-free with modulus
1, hence a unimodular constant, equal to 1 by `c~(0) = 1`. No information on `Re rho` inside `[0,1]` enters.

DH: zeros with `Re rho > 1` exist (CLASSICAL, Davenport-Heilbronn 1936), their reflections have `Re < 0`, the factor
`(z - rho)/(z + conj rho)` has a pole in `Re z > 0`. DH fails Lemma 1. (No such zero was located below height 260 on
the lines `Re s = 1.03, 1.12`: `t6d_dh_zero.log`. The poles of `c_DH` are far from the nodes used below.)

## 3. Two theorems

### 3.1 Theorem A (rank 1 is innerness plus one sign) [PROVED; identities checked numerically to 1e-60, `t6_checks.log` (A)]

Let `theta` be inner on `Re z > 0` with `theta(conj z) = conj theta(z)`, and `c = theta (z+1)/(z-1)`. Then `K1_0` is
positive semidefinite on `Re z > 0` iff `theta(1) >= 0`. Since `K1_t = K1_0 + int_0^t f_z conj(f_w) dx`,
`f_z(x) = e^{zx} + c(z) e^{-zx}`, the same holds for every `t >= 0`.

Proof. Model space `K_theta = H^2 - theta H^2`, kernel `k(z,w) = (1 - theta(z) conj theta(w))/(z + w~)`.
`U f(z) = theta(z) f(-z)` is the product of the two commuting conjugations `f -> theta conj f` and `f -> conj f(conj .)`
of `K_theta`, so a unitary involution; `U k_w = h_w`, `h(z,w) = -(theta(z) - conj theta(w))/(z - w~)`. Hence
`A = k + h` and `B = k - h` are positive kernels (twice the kernels of the `U`-even and `U`-odd subspaces). Algebra:

    (z-1)(w~-1) K1_0(z,w) = G(z,w) - v(z) conj v(w),    G = z w~ A + B,    v = 1 - theta,                      (3.1)
    z A(z,w) + w~ B(z,w) = (1 - theta(z))(1 + conj theta(w)).                                                  (3.2)

`G` is a positive kernel. (3.2) at `w = 1`: `G(., 1) = (1 + theta(1)) v`. So `v` lies in the space of `G` with
`||v||^2 = G(1,1)/(1+theta(1))^2 = (1 - theta(1))/(1 + theta(1))`. `G - v v*` is positive iff `||v|| <= 1` iff `theta(1) >= 0`.

Consequences. (i) Zeta: `theta(1) = 1/(2 xi(2)) = 0.955`, so rank-1 positivity follows from Lemma 1. (ii) Any fake
`theta_f = theta * q`, `q` a real Blaschke product with zeros in `0 < Re < 1`: `q(1) > 0`, rank 1 passes. Rank 1 cannot
see a moved zero. (iii) Equivalent form: `K1_0 >= 0` iff `m(zeta) = z(1-c)/(1+c)` is a Nevanlinna function of
`zeta = z^2` (Green's formula `K1_0 = f_z(0) conj f_w(0) (m(z) - conj m(w))/(z^2 - conj(w)^2)`); this contains the
Hejhal / Lagarias-Suzuki statement that the zeros of `1 + c` in `Re z > 0` are real.

### 3.2 Theorem B (rank 2 reduces to the corner) [PROVED; checked by finite differences to 1e-39, `t6_checks.log` (B)]

Let `M = {1, s_2}`, `v` the three minimal representatives of `W_M \ W`, `z_v = <v lambda, alpha_2^vee> in {z2, z1+z2, z1}`,
`T_P` the component of `T` orthogonal to `alpha_2^vee`, `a_v(lambda) = M(v, lambda) exp<v lambda, T_P>`. Then

    d/dx K2_{T + x alpha_1^vee}(lambda, mu) |_{x=0} = sum_{v, v'} a_v(lambda) conj(a_{v'}(mu)) K1_{alpha_2(T)/2}(z_v(lambda), z_{v'}(mu)),      (3.3)

and the same with the indices 1, 2 exchanged. Proof: differentiation multiplies each term of (2.1) by `<L, alpha_1^vee>`
and cancels one denominator; group `w = s v`, use the cocycle `M(s v, lambda) = c(z_v) M(v, lambda)` and
`<s v lambda, T_P> = <v lambda, T_P>`; the four terms `(s, s')` assemble (2.2).

Corollary. If `K1_t >= 0` for all `t >= 0` (Theorem A), the right side of (3.3) is a positive kernel on the tube whenever
`alpha_2(T) >= 0`. For `T, T'` in the closed chamber with `T - T' = a alpha_1^vee + b alpha_2^vee`, `a, b >= 0`, integrate
along the segment: `K2_T - K2_{T'} >= 0`. The chamber lies in the coroot cone, so `K2_T >= K2_0` for all `T` in the
chamber. Rank-2 positivity on the chamber is equivalent to: rank-1 positivity, and `K2_0 >= 0` (the corner kernel).

## 4. First test: code and nodes

`r2lib.py`: (2.1), (2.2) with pluggable `c`; mpmath, 60-220 digits; Gram matrices normalised to unit diagonal; eigenvalues
by `mp.eigh`. Fakes: `c_f(z) = c(z) R(z)/R(z+1)`, `R = prod_new (z - rho)/prod_old (z - rho)`; for a zero set closed
under conjugation and `rho -> 1 - rho` this is "xi with zeros moved" and `c~_f` is inner. `T = t1 varpi_1^vee + t2 varpi_2^vee`.
Sanity: zeta's kernel is positive at all `T >= 0` on every node set, and negative at `T = (-0.2, -0.2)` (rank 1: `t = -0.2`),
so the code reproduces the threshold at the chamber wall.

## 5. Results

### 5.1 Assigned test (8 nodes, heights 10-50 and 12-17, `Re(z_i) in (0,1)`; `t3_zeta.log`) [MEASURED]

Minimum eigenvalue of the unit-diagonal Gram matrix, range over three node sets:

| c | Lemma 1 | rank 1, t = 0 | rank 2, T = 0 | rank 2, T = (0.3, 0.3) | T = (-0.2, -0.2) |
|---|---|---|---|---|---|
| zeta | pass | 5e-19 .. 0.10 | 1.2e-3 .. 0.15 | 0.02 .. 0.26 | -12.8 .. -0.16 |
| E_a, a = 0.2 | pass (two poles) | -2.3e-6 .. 0.27 | -2.2 .. 0.09 | 0.087 .. 0.18 | -2.6 .. 0.06 |
| on-line fake (gamma_1 -> 16) | pass | 4e-19 .. 0.07 | 3.9e-3 .. 0.25 | 0.06 .. 0.26 | -4.7 .. -1.2 |
| off-line fake, pair gamma_1 -> quadruple, d = 0.1, 0.3, 0.45 | pass | 1.6e-15 .. 0.12 | 0.048 .. 0.15 | 0.095 .. 0.26 | -1.8 .. -0.03 |
| off-line, count-preserving (gamma_1, gamma_2 -> one quadruple, d = 0.3) | pass | 1.3e-18 .. 0.011 | 2e-3 .. 0.32 | 0.03 .. 0.40 | -15.7 .. -1.8 |
| zeta with an extra quadruple (0.3, 30) | pass | 1.3e-18 .. 0.15 | 1.4e-3 .. 0.33 | 0.025 .. 0.34 | -19.7 .. 0.43 |
| DH | fail (classical) | 1.4e-8 .. 0.44 | 0.41 .. 0.55 | 0.43 .. 0.56 | 0.39 .. 0.53 |

No fake with an off-line quadruple has a negative eigenvalue at `T >= 0`. E_a is negative in both ranks at small `T`
for a rank-1 reason: its pole at `z = 1 - a` has negative residue (`(z - 0.8) c_a(z) -> -7.43`; at `1.2`: `+10.74`),
the two-pole analogue of the sign in Theorem A. E_a is therefore not a test of the corner. DH passes at these nodes; its
violation of Lemma 1 sits near poles of `c_DH` at unknown large height. (The row of `t3_zeta.log` labelled "near the pole
of c_DH at 1.3086+8.918i" is mislabelled: there is no pole there; a wrong location was used.)

At this stage the test had no demonstrated power. Sections 5.2-5.3 supply it.

### 5.2 Corner kernel over the pole model `c0 = (z+1)/(z-1)` (xi = 1/(z(z-1)), no zeros) [MEASURED-exact]

`K1_0[c0] = 0` (algebra) and `K2_0[c0] = 0` to 120 digits. For `c = c0 theta`, `theta` a finite real Blaschke product
with `d` zeros, `K2_0` has finite rank, so the inertia on 30-46 generic nodes is the inertia of the kernel
(`t5_corner_controlled.log`, `t8_symmetric_sweep.log`; noise floor 1e-196 .. 1e-217):

| zero set of theta | rank 1 (Thm A) | corner K2_0: rank, (+, -) |
|---|---|---|
| on-line pair 1/2 +- i g | pass | 1, (1, 0) |
| FE-symmetric quadruple 1/2 +- d +- i g; d = 0.05, 0.2, 0.45; g = 0.3, 2, 10 | pass | 6, (6, 0) |
| real pair r, 1-r; double zero at 1/2 | pass | 1, (1, 0) |
| 9 random FE-symmetric sets, d = 4 .. 10 (on-line pairs, quadruples, real pairs); 3 fixed sets with d = 4, 6 | pass | C(d,2), all positive |
| one conjugate pair x +- i g, x = 0.55, 1.0, 2.5 (not FE-symmetric) | pass | 3, (3, 0) |
| one conjugate pair x +- i g, x = 0.05, 0.3, 0.45 (not FE-symmetric) | pass | 3, (1, 2) |
| pairs 0.3 +- 2i and 0.7 +- 5i | pass | 10, (8, 2) |
| pairs 0.3 +- 2i and (0.7 + eta) +- (2 + eps) i, (eta, eps) != 0, down to 1e-6 | pass | 8, (6, 2); negative eigenvalues linear in the asymmetry |
| single real zero at 1/2 (root number -1, c(0) = +1) | pass | 2, (1, 1) |
| a real zero r > 1 (theta(1) < 0) | fail | negative |

Rule consistent with all rows (MEASURED, OPEN as a theorem): `K2_0[c0 theta] >= 0` iff every zero with `Re rho < 1/2`
has the partner `1 - conj rho`, and the number of real zeros is even. The distance of a quadruple from the line does not
enter. (`t4_corner_sweep.log` category A shows spurious negatives: its zeros were built from Python floats, so `rho` and
`1 - rho` differed by 1e-17. It is superseded by `t8`, and is itself an instance of the asymmetry row.)

### 5.3 Corner kernel over zeta, 22 nodes, 110 digits (`t7_zeta_power_22*.log`) [MEASURED]

Nodes `Im in (0.2, 6)`, `Re z_i in (0.1, 1.9)`; second run `Im in (11, 17)`. `#neg` = number of negative eigenvalues at `T = 0`.

| modification of zeta's c | min eigenvalue, Im 0.2-6 | #neg | min eigenvalue, Im 11-17 | #neg |
|---|---|---|---|---|
| none | 7.0e-25 | 0 | 3.8e-7 | 0 |
| times pair 0.3 +- 2i (inner, not FE-symmetric) | -1.3e+2 | 2 | 8.9e-5 | 0 |
| times pair 0.3 +- i gamma_1 (not FE-symmetric) | -1.4e-11 | 2 | -5e-3 | 2 |
| times pair 0.7 +- 2i (not FE-symmetric, Re > 1/2) | 2.8e-15 | 0 | 1.1e-4 | 0 |
| times quadruple (0.3, 2) | 6.0e-10 | 0 | 1.3e-4 | 0 |
| times quadruple (0.3, gamma_1) | 2.4e-21 | 0 | 1.1e-3 | 0 |
| pair gamma_1 -> quadruple d = 0.3 | 5.0e-23 | 0 | 1.2e-4 | 0 |
| pair gamma_1 -> quadruple d = 0.45 | 4.0e-23 | 0 | 8.5e-5 | 0 |
| pairs gamma_1, gamma_2 -> one quadruple d = 0.3 | 1.1e-25 | 0 | 9.0e-8 | 0 |
| pair gamma_1 -> on-line pair at 16 | 1.6e-25 | 0 | 9.0e-8 | 0 |
| times real pair 0.2, 0.8 | 1.4e-16 | 0 | 4.6e-5 | 0 |
| times zero at 1/2 (root number -1) | -12.0 | 1 | 6.7e-5 | 0 |

The test has power (rows 2, 3, 12 are negative, and stay negative at `T = (0.1, 0, -0.1)` for the low-height rows), and
the same rule as in 5.2 holds over zeta: non-symmetric zeros left of 1/2 and odd root number are detected;
FE-symmetric off-line quadruples are not. Detection is local in height: the pair at 2 is invisible from nodes at 11-17,
the pair at gamma_1 is 13 orders weaker from nodes at 0.2-6.

## 6. Controls

1. **Blaschke fakes (map row Q5).** FE-symmetric off-line quadruples pass Lemma 1, rank 1 (Theorem A) and the rank-2
   corner (5.2 exact for d <= 10, 5.3 sampled). This is the decisive control: the conclusion "zeros on the line" is
   false for them and every tested positivity holds.
2. **DH.** Fails Lemma 1 by zeros in `Re s > 1`, a rank-1 fact. Inside the strip its off-line zeros form FE-symmetric
   quadruples, the configuration that 5.2-5.3 show is not detected. Nothing in ranks 1-2 uses an Euler product.
3. **E_a = zeta(s+a) zeta(s-a), a = 0.2.** Has an Euler product, the functional equation and zeros at `1/2 +- a`.
   Fails at small `T` in both ranks through the negative residue at `1 - a`; passes at `T = (0.3, 0.3)` on the sampled
   nodes. The failure is not related to the zeros.
4. **Sign twist (Liouville, L = zeta(2s)/zeta(s)).** `c(z)c(-z) = -0.149 + 0.314i != 1`, `|c(12i)| = 1.038`. The kernel
   (2.1) is still Hermitian (defect 6.5e-63): Hermitian symmetry does not use the functional equation. What is lost is
   the cocycle, so (2.1) is not the inner product of anything; the rank-1 Gram matrix has minimum eigenvalue -1.06
   (`c` has poles at the zeta zeros in `Re z > 0`).
5. **Backward heat.** Not run: the deformed `xi` keeps the functional equation, so by 5.2-5.3 the expected outcome is
   "passes while zeros stay in the strip", the same as control 1.

## 7. Decision

The assignment's alternative was: a fake passing Lemma 1 with a negative eigenvalue (new positivity), or none (try to
prove a Hilbert model for every inner `c`). The outcome is a third case.

- There are inner fakes with negative eigenvalues (5.2 rows 6-9, 5.3 rows 2, 3, 12), so "every inner `c` has a
  factorised-scattering Hilbert model in rank 2" is false, and rank-2 positivity is not implied by Lemma 1 or by rank 1.
- What it adds is the reflection symmetry `rho <-> 1 - conj rho` of the zero set of `c~` for zeros left of 1/2, and
  even root number: the statement that `c = xi(z)/xi(z+1)` with `xi(s) = xi(1-s)`, for which `M(w, lambda) = Xi(w lambda)/Xi(lambda)`,
  `Xi(nu) = prod_{beta > 0} xi(<nu, beta^vee> + 1)`, is a coboundary without sign. Zeta has this by the functional equation.
- Among functions with that symmetry, no dependence on the distance of zeros from the line was found, at any height or
  off-line distance tested (d = 0.05 .. 0.45, heights 0.3 .. 19). The uniformity question (map Q2) does not arise:
  there is no violation to scale.

So rank-2 positivity is a functional-equation-level constraint. It is not Euler-sensitive.

## 8. Pivot

None taken. The adjacent candidates were looked at only to this extent: (i) rank `n >= 3`: for FE-symmetric `xi` the
coboundary form `M(w, lambda) = Xi(w lambda)/Xi(lambda)` holds in every rank, and Theorem B's derivative identity
reduces rank `n` to rank `n-1` plus a corner, so the same outcome is expected (not tested); (ii) maximal-parabolic
series with cuspidal data change which `c` occurs, not the positivity mechanism.

## 9. Three weakest steps

1. **The corner rule is measured, not proved.** "FE-symmetric implies `K2_0 >= 0`" rests on exact inertia for about 30
   rational zero sets with `d <= 10` over `c0` (the `d = 12` case had more rank than nodes and is unresolved) and on
   22-node samples over zeta. A proof would need the type-A2 analogue of the Bezoutian identity (3.1). An FE-symmetric
   fake over zeta with a negative direction outside the sampled nodes is not excluded.
2. **Validity of (2.1) at `T = 0`, and the citations.** The formula and its range in `T` are quoted from memory of
   Langlands and Arthur; the closed-chamber range for `SL3(Z)` is assumed. The numerics agree (zeta positive at
   `T >= 0`, negative at `T < 0`), which is evidence for the normalisation, not a proof. The lane's conclusion does not
   depend on it, because it is a statement about fakes passing.
3. **Theorem A and Theorem B are unrefereed.** Theorem A uses that `G = z w~ A + B` is the kernel of a sum space and
   that `G - v v* >= 0` iff `||v||_G <= 1`; for infinite Blaschke products (zeta) the conjugation argument is standard
   but was only checked numerically on a 6-zero example. Theorem B needs rank-1 positivity at the three arguments
   `z1, z2, z1 + z2`, including `Re(z1 + z2) > 1`, which Theorem A covers. The finite-rank claim in 5.2 is observed, not derived.

## 10. Files

All under `tmp/research-2026-11-16/push/n2-rank2-eisenstein-kernel/`. Interpreter: `.venv-arb/bin/python -I`, through `scripts/memcap.sh 8`.

- `r2lib.py`: kernels (2.1), (2.2), `c` functions (zeta, pole model, E_a, Blaschke fakes, DH, Liouville), Gram analysis.
- `t1_rational.py/.log`, `t2_rational_spectra.py/.log`: first passes over `c0`. Rows "c0*real r=0.1, 0.9, 1.5" of `t2` use a single factor `(z-r)/(z+1-r)`, which does not satisfy `c(z)c(-z) = 1`; ignore them.
- `t3_zeta.py/.log`: assigned test (5.1).
- `t4_corner_sweep.py/.log`: random sweep; category A affected by float asymmetry (see 5.2).
- `t5_corner_controlled.py/.log`, `t8_symmetric_sweep.py/.log`: corner inertia over `c0` (5.2).
- `t6_checks.py/.log`: identities (3.1)-(3.3), E_a residues, sign twist. `t6d_dh_zero.py/.log`: search for a DH zero with `Re > 1`.
- `t7_zeta_power.py`, `t7_zeta_power_22.log`, `t7_zeta_power_22_im11-17.log`: corner over zeta (5.3).

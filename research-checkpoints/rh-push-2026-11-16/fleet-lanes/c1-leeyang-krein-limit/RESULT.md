# c1-leeyang-krein-limit: Lee-Yang stages, the Krein index of the bridge form, and the limit step

Date: 2026-11-17. Kind: combine (`res-sparse-ferromagnet` Thm. 3/4 with `g-spinor-square-root` / `sq-krein-index`).
Labels: PROVED (argument in this note), PROVED-rel X, CLASSICAL (recalled, source not opened), MEASURED (float64 + mpmath, not interval arithmetic), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction.** The combination does not supply R4. Three facts:

1. (PROVED, Thm. A, B) The semicontinuity lemma is true: rank Gamma_- is lower semicontinuous under bounded weak-* convergence of symbols. In the stages' own (self-dual, conductor M) normalisation every stage symbol S_M is inner and S_M -> -1 locally uniformly on Re z > 0, for zeta phases and for every unimodular twist alike. The limit symbol is the constant -1; the inequality reads 0 <= 0 and carries no information about the limit function. The stage inequality behind index 0 is Re D_M'/D_M(s) > -(log M)/2 on Re s > 1/2; RH is the same inequality with (log M)/2 replaced by the archimedean term, about (1/2) log(t/2 pi). The first tends to "> -infinity" as M grows.
2. (MEASURED, Test 3) If the conductor factor is replaced by the gamma factor and the stage is divided by its pole factor, the stage symbol is no longer inner: it has about one pole in Re z > 0 per stage zero (rank of the window block 27, 46, 62, 83, 118 for primes up to 13, 19, 29, 37, 47; proportional to log M), the largest window singular value stays between 0.5 and 1.3, and zeta phases, the control U with a zero at 0.75 + 20i, and a random U give the same numbers. liminf rank = infinity, so semicontinuity is vacuous in this normalisation.
3. (PROVED, Thm. C, D) In the one topology that reaches the strip, locally uniform convergence of stage/normaliser with zero-free normalisers, the rank-0 semicontinuity statement is Hurwitz's theorem, and the hypothesis is equivalent to RH: zeta has no zero in Re s > 1/2 if and only if the pole-renormalised Euler stages R_P(s) = prod_{p<=P}(1 - p^-s)^-1 exp(E_1((s-1) log P)) are locally bounded on {Re s > 1/2, s != 1}. For the control U no zero-free normaliser exists near its zero; the normaliser that works has a pole there. The topology the assignment asks for exists, and proving that zeta's stages converge in it is RH (equivalently pi(x) - li(x) = O(x^(1/2+eps))). The Lee-Yang inequality gives the bound exp((log M)(1 + delta - sigma)/2) for the stage in the strip, which is weaker than the trivial bound exp(sum_{p<=P} p^-sigma).

Decisive test outcome: the idea as assigned (Krein-index semicontinuity as the limit step) is dead for the reason in item 1; the adjacent idea (item 3) is a restatement of RH with a located residual. No pivot beyond item 3 was made.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md`; `SYNTHESIS_POSITIVITY_RESIDUALS.md` section 1; `res-sparse-ferromagnet/RESULT.md`; `g-spinor-square-root/REFEREE.md`; `sq-krein-index/RESULT.md` (no REFEREE.md exists for it; it is unrefereed); `OBSTRUCTION_MAP.md` sections 2 and 5 and rows Q1-Q9; `ap-global-bridge` Thm. C (the control U).

Already recorded there: stage theorem (all stage zeros on Re s = 1/2 for K >= 0, a_p = 1/2, any unimodular twist); stages converge on Re s >= 1 + delta and diverge on (1/2, 1]; "no zero-free normaliser for U by Hurwitz", "c_M = D_M/zeta is circular"; inertia theorem neg index = rank Gamma_- for even F.

Not recorded there, done here:
- the stage symbols computed in the bridge normalisation and their limit -1 (Thm. B);
- the semicontinuity statement with proof, and the identification of its rank-0 case with Hurwitz (Thm. A, C);
- the explicit normalisers (pole factor for zeta, zero factor for U) and the equivalence of local boundedness with RH (Thm. D);
- the measurement of the gamma-normalised stage block (Test 3) and of renormalised convergence for zeta and for U (Test 2, 2b);
- the comparison of the Lee-Yang growth bound with the trivial bound (section 5).

Notation: stage D_M(s) = sum_{n|M} chi(n) w(n) n^-s, M squarefree with primes up to P, L = log M, Curie-Weiss weights w(n) = exp((log n)^2/(2L)), chi completely multiplicative unimodular (chi = 1: "zeta phases"). z = s - 1/2. G_M(z) = M^(z/2) D_M(1/2 + z). For a function F: L_F = F'/F, S = (1 - alpha L_F)/(1 + alpha L_F), alpha > 0; Gamma_- = Q S P the anticausal Hankel block.

## 2. Work: the stage symbol and the semicontinuity lemma

### Theorem A (semicontinuity). PROVED.
Let S_N, S in L^inf(iR), sup norm(S_N) < inf, S_N -> S weak-*. Then rank Gamma_-(S) <= liminf rank Gamma_-(S_N).

Proof. For f, g in L^2, <Gamma_-(S_N) f, g> = int S_N (Pf) conj(Qg), and (Pf) conj(Qg) is in L^1, so Gamma_-(S_N) -> Gamma_-(S) in the weak operator topology. If rank Gamma_-(S) >= k+1 choose f_i, g_j (i, j <= k+1) with det <Gamma_-(S) f_i, g_j> != 0; the determinant is a polynomial in matrix entries, so it is nonzero for large N, and rank Gamma_-(S_N) >= k+1. QED.

Remarks. (a) Rank 0 case: H^inf is weak-* closed. (b) A bounded sequence in H^inf(Re z > 0) that converges pointwise in the half-plane converges weak-* on the axis to the boundary function of the limit (CLASSICAL). (c) The lemma needs a uniform bound on the axis and gives nothing when liminf rank = infinity.

### Theorem B (stage symbols). PROVED-rel the stage theorem (`res-sparse-ferromagnet` Thm. 3, refereed).
For every squarefree M, every K >= 0 with a_p = 1/2 and w(n) <= n^(1/2) (all sum-rule graphs and the Curie-Weiss member), every unimodular chi and every alpha > 0:
(i) L_M := G_M'/G_M = L/2 + D_M'/D_M(1/2 + z) has Re L_M > 0 on Re z > 0; S_M is inner; Gamma_-(S_M) = 0; the Krein negative index of the stage is 0.
(ii) S_M -> -1 locally uniformly on Re z > 0 as L -> infinity, hence weak-* on the axis.

Proof. (i) G_M is an exponential polynomial with all zeros i gamma on the axis. Hadamard: L_M = b + sum_gamma (1/(z - i gamma) + 1/(i gamma)). The conjugate self-duality conj G_M(-conj z) = c G_M(z), abs(c) = 1, makes Re L_M odd under z -> -conj z; the sum has that property termwise, so Re b = 0 and Re L_M = sum x/abs(z - i gamma)^2 > 0 for x = Re z > 0. (ii) On Re s >= 3: abs(D_M - 1) <= zeta(5/2) - 1 = 0.342 and abs(D_M') <= -zeta'(5/2), uniformly in M, graph and chi. So abs(D_M'/D_M) <= C there, Re L_M >= L/2 - C, and abs(S_M + 1) = 2/abs(1 + alpha L_M) -> 0 uniformly on Re z >= 5/2. The S_M are bounded by 1 on Re z > 0; Vitali gives locally uniform convergence to the continuation of the limit, the constant -1. QED.

MEASURED (Test 1, `stage_test.log`): min Re L_M > 0 on the grid in all 30 cases (6 stages, 5 phase choices); max abs(S_M) < 1; sup abs(S_M + 1) at Re z = 1 is 0.380, 0.247, 0.176, 0.135, 0.098, 0.075 for P = 13..61 against 2/(1 + alpha L/2) = 0.325, 0.221, 0.163, 0.126, 0.093, 0.073. Zeta phases, U and three random twists agree to within 6 percent at Re z = 1.

Consequence. With the stages' own normalisation the chain "index 0 at each stage, semicontinuity, index 0 in the limit" is valid and its limit object is the constant -1 for every phase choice. The factor M^(z/2) that makes the stage self-dual contributes L/2 to L_M and swamps D_M'/D_M. Stated without the bridge: the stage theorem is equivalent to

  Re D_M'/D_M(s) > -(log M)/2 on Re s > 1/2,

and RH is equivalent (CLASSICAL, Re xi'/xi > 0 right of the line) to

  Re zeta'/zeta(s) > -Re a(s) on Re s > 1/2, a(s) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2), Re a ~ (1/2) log(t/2 pi).

The two right-hand sides agree only at t ~ 2 pi M, where the stage has primes up to about log t (`res-sparse-ferromagnet` Thm. 5). At fixed height the stage inequality tends to an empty statement.

### Test 3 (gamma-normalised, pole-renormalised stage). MEASURED.
L~(z) = a(s) + D_M'/D_M(s) + r'(s), where r is the logarithm of the renormaliser (zeta phases: E_1((s-1) log P); U: -E_1((s-s0) log P); random: none). S~ = (1 - L~)/(1 + L~), alpha = 1. Window 10 < Im z < 30. Poles of S~ in Re z > 0 by Newton iteration started from each stage zero; singular values of the window block from the closed form of `sq-hankel-traces` (eigenvalues of R* A R conj(A), A_jk = 1/(conj z_j + z_k)).

| P | L | phases | stage zeros | poles found in Re z > 0 | median Re(pole) x L | top s.v. | median isolated s.v. | abs(mean(S~ + 1)) on the axis |
|---|---|---|---|---|---|---|---|---|
| 13 | 10.3 | zeta / U / rand | 32 / 33 / 33 | 27 / 29 / 27 | 1.42 / 1.44 / 1.38 | 0.60 / 0.62 / 0.60 | 0.40 / 0.40 / 0.41 | 0.230 / 0.231 / 0.229 |
| 19 | 16.1 | zeta / U / rand | 50 / 51 / 51 | 46 / 47 / 47 | 1.85 / 1.86 / 1.84 | 0.56 / 0.56 / 0.52 | 0.28 / 0.28 / 0.28 | 0.139 / 0.137 / 0.138 |
| 29 | 22.6 | zeta / U / rand | 71 / 72 / 72 | 62 / 67 / 64 | 2.31 / 2.39 / 2.16 | 0.59 / 0.51 / 0.89 | 0.22 / 0.24 / 0.22 | 0.096 / 0.095 / 0.095 |
| 37 | 29.6 | zeta / U / rand | 94 / 94 / 94 | 83 / 88 / 82 | 2.60 / 2.74 / 2.44 | 0.96 / 0.67 / 0.82 | 0.20 / 0.21 / 0.19 | 0.071 / 0.071 / 0.071 |
| 47 | 41.0 | zeta / U / rand | 130 / 130 / 130 | 118 / 122 / 115 | 3.04 / 3.17 / 2.79 | 1.30 / 0.94 / 0.81 | 0.18 / 0.19 / 0.16 | 0.051 / 0.051 / 0.051 |

Reading. The rank of the window block grows in proportion to L (one pole per gap of stage zeros; the counts are lower bounds because Newton can miss poles). The poles sit at depth about log(L/kappa)/L from the axis (ARGUED from the periodic model L_M = (L/2) coth(Lz/2), which gives poles at Re z = log(L/kappa - 1)/L with kappa = 1/alpha + Re a + Re r'; kappa about 2.3 fits the column). The window mean of S~ on the axis tends to -1 like 2.1/L: the boundary weak-* limit is again -1, while the interior values beyond the pole layer follow D_M'/D_M. The top singular value does not decrease in this range. No column separates zeta phases from U. In this normalisation Theorem A applies with liminf rank = infinity.

## 3. Work: the topology that reaches the strip

### Theorem C (rank-0 semicontinuity in the strip is Hurwitz). PROVED (CLASSICAL ingredients: Hurwitz, Vitali).
Let Omega be a domain, f_N and c_N analytic and zero-free on Omega, and suppose f_N/c_N is locally bounded on Omega and converges on a subset with an accumulation point in Omega. Then f_N/c_N converges locally uniformly on Omega and the limit is zero-free or identically zero.

Corollary C1 (control U). Let L_chi have a zero at s0, 1/2 < Re s0 < 1 (`ap-global-bridge` Thm. C), and let f_N be Euler stages or Lee-Yang stages of chi (zero-free on Re s > 1/2). For every domain Omega containing s0 and meeting Re s > 1, and every sequence of zero-free analytic c_N with f_N/c_N -> L_chi on Omega intersect {Re s > 1}, the family f_N/c_N is not locally bounded on Omega.

### Theorem D (the criterion for zeta). PROVED-rel von Koch (CLASSICAL) for the direction "RH implies bounded"; the other direction PROVED.
Let E_P(s) = prod_{p<=P}(1 - p^-s)^-1 and R_P(s) = E_P(s) exp(E_1((s-1) log P)). The function exp(-E_1(w)) = e^gamma w exp(-Ein(w)) is entire with a single zero at w = 0, so c_P(s) = exp(-E_1((s-1) log P)) is entire and zero-free except at s = 1. For theta in [1/2, 1) the following are equivalent:
(a) zeta has no zero in Re s > theta;
(b) R_P is locally bounded on Omega_theta = {Re s > theta, s != 1};
(c) R_P -> zeta locally uniformly on Omega_theta.

Proof. (b) implies (c) implies (a): for Re s > 1, E_P -> zeta and abs(E_1(w)) <= e^(-Re w)/abs(w) -> 0, so R_P -> zeta there; E_P and c_P are zero-free on Omega_theta; apply Theorem C. (a) implies (b): (a) gives pi(x) - li(x) = O(x^(theta+eps)) (CLASSICAL). log zeta(s) - log E_P(s) = int_P^inf x^-s d pi(x) + sum_{p>P} sum_{k>=2} p^(-ks)/k; int_P^inf x^-s d li(x) = E_1((s-1) log P); the remainder int_P^inf x^-s d(pi - li) is O((1 + abs(s)) P^(theta + eps - sigma)/(sigma - theta - eps)) by partial summation and the double sum is O(P^(1 - 2 sigma)). Both sides are analytic on Re s > theta, so log R_P - log zeta -> 0 locally uniformly. QED.

Only an upper bound on abs(R_P) is needed in (b): a one-sided bound Re[sum_{p<=P} p^-s + E_1((s-1) log P)] <= C(K) on compacts K of the strip suffices for RH. This is the form "one-sided bound for a largest value on a line where the prime series does not converge absolutely" of `OBSTRUCTION_MAP.md` section 5.

Lee-Yang stages. The direction "(b) implies (a)" holds verbatim with the primorial Curie-Weiss stages D_M in place of E_P and target zeta(s)/zeta(2s): D_M is zero-free on Re s > 1/2 (stage theorem) and D_M -> zeta(s)/zeta(2s) on Re s >= 1 + delta (`res-sparse-ferromagnet` 3.2). PROVED-rel those two inputs. The converse for Curie-Weiss stages is MEASURED only (below). The stage theorem contributes zero-freeness of the stage in Re s > 1/2, which truncated Euler products have trivially in Re s > 0. In this criterion the Lee-Yang theorem adds nothing to the Euler product.

### Test 2 (zeta phases). MEASURED. sup over t in [3, 40] of the relative error against zeta(s)/zeta(2s).

| P | sigma = 1.1 raw / renorm. | 0.9 | 0.75 | 0.6 | sup abs(raw), sup abs(renorm.) at 0.6 |
|---|---|---|---|---|---|
| 47 (Euler) | 5.3e-2 / 4.5e-2 | 0.117 / 0.129 | 0.301 / 0.328 | 1.15 / 1.23 | 2.94, 2.80 |
| 47 (Curie-Weiss) | 6.2e-2 / 5.3e-2 | 0.131 / 0.113 | 0.276 / 0.301 | 1.13 / 1.21 | |
| 61 (Curie-Weiss) | 5.5e-2 / 4.6e-2 | 0.126 / 0.104 | 0.285 / 0.280 | 1.03 / 1.15 | |
| 1e3 (Euler) | 2.4e-2 / 4.5e-3 | 9.8e-2 / 2.3e-2 | 0.300 / 8.8e-2 | 1.06 / 0.454 | 3.39, 3.04 |
| 1e4 | 1.4e-2 / 9.0e-4 | 9.3e-2 / 7.2e-3 | 0.396 / 3.9e-2 | 2.01 / 0.304 | 4.65, 3.05 |
| 1e5 | 9.1e-3 / 1.5e-4 | 9.1e-2 / 2.1e-3 | 0.503 / 1.6e-2 | 5.83 / 0.181 | 6.39, 3.00 |
| 1e6 | 6.0e-3 / 3.4e-5 | 9.3e-2 / 7.3e-4 | 0.598 / 8.1e-3 | 17.3 / 0.128 | 19.5, 3.01 |

Raw Euler stages diverge in the strip; renormalised ones decrease like about 0.25 P^(1/2 - sigma) (the rate RH gives) and stay bounded. For P <= 61 the pole factor is not yet distinguishable from 1 (errors of raw and renormalised agree within 15 percent), so the range "primes up to 13..47" named in the assignment cannot show the convergence mode; the Euler rows to 1e6 do. Curie-Weiss and Euler stages agree to within 20 percent for P = 19..61.

### Test 2b (controls near s0 = 0.75 + 20i). MEASURED. P = 47, 1e3, 1e4, 1e5, 1e6.

- U (Thm. C character with zero at s0): abs(raw stage) at s0 - 0.15: 0.136, 0.044, 0.018, 0.0063, 0.0019; at s0: 0.200, 0.119, 0.090, 0.072, 0.060; at s0 + 0.15: 0.272, 0.214, 0.196, 0.187, 0.182. With the zero factor, E_P exp(-E_1((s - s0) log P)): at s0 - 0.15, -0.3181+0.1166i, -0.3242+0.1179i, -0.3271+0.1191i (last three P); at s0 - 0.05, -0.0779+0.0257i, -0.0782+0.0257i, -0.0783+0.0258i; at s0 + 0.05 and s0 + 0.15 constant to 4 digits. The normaliser exp(E_1((s - s0) log P)) has a pole at s0, as Corollary C1 requires. With zeta's pole factor instead, U's stages do not settle (at s0 + 0.3i: 0.129+0.249i, 0.144+0.272i, 0.198+0.365i).
- zeta phases with the pole factor: converge at all six points (at s0: 0.8657-0.7081i, 0.8793-0.7051i, 0.8720-0.7028i); with U's zero factor they diverge left of s0 (abs value 27, 46, 187).
- Three random U: raw stages stay within a few percent over P at Re s >= 0.8 and drift at 0.6 (rate P^(1/2 - sigma) expected for random phases; no normaliser needed, and the limit is zero-free almost surely, so random U is not a discriminating control; the discriminating control is the constructed one).

So a topology in which zeta's renormalised stages converge and U's do not does exist (normaliser with divisor supported at s = 1, outside the open strip). What separates the two is the divisor of the normaliser: a zero at s = 1 for zeta, known unconditionally from the pole (integer frequencies, INT); a pole inside the strip for U. Convergence for zeta in that topology is statement (c) of Theorem D.

## 4. The invariant, in the language of the input sets

- INT gives the pole of zeta at 1 and nothing else in this lane. It fixes the divisor of the normaliser. It also gives an unconditional strip limit for a different stage family, the Dirichlet sums sum_{n<=N} n^-s - N^(1-s)/(1-s) -> zeta(s) on Re s > 0 (CLASSICAL). Those stages are not products, have zeros in the strip, and their pole term is additive, so Theorem C does not apply to them.
- GEOM (unimodular local parameters, Euler product) gives zero-free stages. For them the strip limit is Theorem D, equivalent to RH.
- A single stage family with both properties (zero-free in the strip, and strip convergence proved from INT) would prove RH by Theorem C. No such family is constructed here. For the Lee-Yang stages `res-sparse-ferromagnet` Thm. 5 shows the support (divisors of M) cannot contain the integers up to sqrt M, so the INT mechanism (Euler-Maclaurin over consecutive integers) is not available on them. This is the pair {INT, GEOM} of the map, located at one step: local boundedness of R_P.
- FE enters the stages only through the conductor M (stage self-duality), and that is the factor that erases the limit in Theorem B. The stage functional equation holds for every twist.

## 5. What the Lee-Yang inequality gives for the residual. PROVED (comparison).

Integrating Re D_M'/D_M > -L/2 from sigma to sigma' = 1 + delta: abs(D_M(sigma + it)) <= M^((1 + delta - sigma)/2) abs(D_M(1 + delta + it)) <= zeta(1 + delta) exp(L (1 + delta - sigma)/2), with L = theta(P) ~ P. The trivial bound is abs(E_P(s)) <= exp(sum_{p<=P} p^-sigma + O(1)) = exp((1 + o(1)) P^(1 - sigma)/((1 - sigma) log P)). Theorem D(b) needs abs(E_P(s)) <= C abs(c_P(s)), where log abs(c_P) oscillates with amplitude P^(1 - sigma)/(abs(s - 1) log P). The Lee-Yang bound has exponent of order P; the trivial bound and the target have exponent of order P^(1 - sigma)/log P. The Lee-Yang bound is weaker than the trivial bound for every sigma in (1/2, 1) and large P, and it is the same for every unimodular twist.

## 6. Controls

| Control | Stage theorem (index 0) | Thm. B limit -1 | Thm. D criterion | Status |
|---|---|---|---|---|
| U (zero at s0) | passes | same limit as zeta | fails at "zero-free normaliser": the working normaliser has a pole at s0 (Cor. C1) | PROVED; MEASURED in Tests 1, 2b, 3 |
| random U (3 seeds) | passes | same | no normaliser needed; limit zero-free a.s. | MEASURED; not discriminating |
| DH | fails: coefficients not multiplicative, the stage polynomial is not an Ising partition function (refereed in the parent lane: 219 of 250 stage zeros off the line) | not applicable | no zero-free product stages | from the parent lane; not re-run |
| E_a | stage fails for large a (parent lane) | not run | Euler stages are zero-free; the pole at 1 - a lies in the strip and is allowed as a zero of the normaliser; local boundedness must fail near Re s = 1/2 + a by Thm. C | ARGUED; not run |
| backward heat, T-NR, Beurling, sign twist, zeta(s+a)zeta(s-a) at stage level, phase-rotated transfer operator, theta^w | | | | not run |

The step at which U and E_a fail (local boundedness of renormalised stages) is the step that is unproved for zeta. The controls therefore do not fail "for a structural reason at a proved step"; they fail at the open step.

## 7. Requirement flags

- R1 (multiplicativity essential): true at stage level only. Zero-freeness of the stages is the Euler product (or the Lee-Yang theorem on prime spins); DH has no such stages. In the limit step no multiplicative input is used beyond that. Recorded as established for the stage ingredient of Theorem D.
- R2 (height-uniform, every window): false. Theorem D is an equivalence, valid on every domain, with no unconditional conclusion. Theorem B is uniform in height and has an empty limit.
- R3 (every control fails at a named structural step): false. U verified; DH by citation; E_a argued; six controls not run; and the failing step for U is the open step for zeta.
- R4 (reaches the critical line): false. The limit in the bridge normalisation is -1; the strip topology of Theorem D reaches the line only under a hypothesis equivalent to RH.

## 8. Three weakest steps

1. Test 3 is float64 with Newton pole-finding started from stage zeros (no argument-principle count); pole counts are lower bounds, singular values come from Cauchy matrices of size up to 122, and the pole-layer depth log(L/kappa)/L rests on a periodic model. The statement "rank grows like L, same for zeta and U" is measured for P <= 47 on one window, not proved. The norm of the block as L -> infinity is undetermined (top singular value 0.5 to 1.3, no trend).
2. Theorem D is likely known (finite Euler products and RH: Gonek, Gonek-Hughes-Keating; normal-family criteria); the literature was not searched and no novelty is claimed. Its direction (a) implies (b) uses pi(x) - li(x) = O(x^(theta+eps)) as recalled, and the Curie-Weiss version of that direction is supported only by Test 2 at P <= 61, where the pole factor is within 15 percent of 1.
3. "No stage family has both zero-freeness and an INT-proved strip limit" is shown only for the families at hand (Euler, Lee-Yang on divisors of M, Dirichlet sums). It is a located gap, not a no-go theorem. Controls other than U were not run in this lane.

## 9. Files and compute

- `stage_test.py`, `stage_test.log`, `stage_test.json` (this directory). Local run through `scripts/memcap.sh 8`, 50 s. A first run was killed by the cap in Test 3 at P = 47 (chunk too large); the chunk was reduced to 2.5e7 terms and the run completed. Interpreter: `/tmp/g-chan-venv/bin/python` (numpy 2.5.5, mpmath 1.4.1).
- The compute server was not used; no units were started there.

# c5-repair-engine-map-r4: engine and map debts of rounds 3-4, referee debts, owed numerics

Date: 2026-11-18. Kind: repair. Status: unrefereed.
Labels: PROVED (argument written here, one author), CLASSICAL, MEASURED (numerics, not interval-certified), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is made. No bound moves. The compute server was not used; every run was local through `scripts/memcap.sh 8`.

## 0. Verdict

Partial result. The four debts are discharged with the residuals listed in section 6.

1. Engine. Five closed-family patterns added (29 -> 34), the exemption for the functional-equation-symmetrised stage removed, the three closed device nodes turned into walls, the keyword role `crossing` replaced by `engine/curated/devices.json` (21 device types, 60 nodes, states closed / floored / open). Generator with `--top 60`: 38,112 generated, 27,386 rejected, 10,726 scored. Top 60: 0 contain a closed device (24 before, measured with the same list), 25 contain an open device, 35 contain only the floored 7/8 device.
2. Map. Ten edit groups applied to `push/OBSTRUCTION_MAP.md` (450 -> 471 lines): control THIN (table row and note), rows P44 to P49 and G26, section 4 entries 48 and 49, the round-4 paragraph of section 5, section 6 item 14 and items 21, 22, four rows of section 7. The three literature sources of the Ramare rows were opened first.
3. Referee debts. Theorem 1 of `c4-helson-discrepancy-zerofree` holds under an independent second derivation; one exact corollary is added. Literature: four generic searches and one paper read; no prior statement found; novelty is not established. r(0) is decided for the exponent-zero class: a chi with E(x) << x^eps for every eps > 0 has no real zero of F in (0, 1) (Theorem 2 below, PROVED, one author, unrefereed). For fixed small theta > 0 a real zero b satisfies b(1 - b) <= 10 theta; zeros close to 1 are not excluded, so r(theta) -> 0 is not proved.
4. Owed numerics. The Ritz run of K[t] for the heat family at tau = -2 has no object: the quotient is analytic in no half-plane, so Suzuki's causal kernel does not exist and Lemma A of `sq-canonical-det` does not apply. The well-defined substitute (kernel taken above the poles below height Gamma) was computed exactly from the 24 located poles: the first time at which the norm provably exceeds 1 falls from 2.43 to 1.34 (omega = 0.1) and from 2.25 to 1.16 (omega = 0.25) as Gamma goes from 70 to 230. The c1 statement "passes for small t and fails at a finite T*" is corrected in the map.

## 1. Plan

Decisive first test: rerun `generate.py --top 60` after the engine edits and count closed devices in the output. Then the map rows (the graph builder reads the map, so the final engine run comes after them), the referee debts, and the owed computation. Order actually used: curated list and code edits; map edits; engine run; second run after two corrections found in the first output (section 2.1, items 7 and 8).

Read: BRIEF.md to the end; ROUND_LOG rounds 3 to 5; MAP_PENDING; the map's sections 2, 5, 6, 7 and the rows near P41-P43, G25, Q19-Q22; RESULT and REFEREE of the five round-4 lanes named in the assignment and of `c4-thin-twist-control-78`; `sq-canonical-det` (sections 1, 2, 6.3, code), `c1-missing-controls` Part B, `b-escape-law` section 0.

## 2. Work

### 2.1 Engine (`engine/`)

Edits, each with the count before and after.

| # | File | Edit | Before | After |
|---|---|---|---|---|
| 1 | `merge_outcomes.py` | closed families for round 4: `fam-helson-discrepancy-zerofree`, `fam-fe-symmetrised-stage-rouche`, `fam-stage-collision-index`, `fam-laxphillips-hecke-compression`, `fam-ramare-mr-pointwise` | 29 families | 34 families |
| 2 | `merge_outcomes.py` | `unless` exemption `functional-equation-symmetrised` removed from three families; `unless: discrepancy` of `fam-tail-generic-selector` replaced by the additively twisted form | 6 `unless` keys | 4 `unless` keys (twisted sums twice, one of them in the new Helson family; Riemann-Siegel length; Reinhardt shell / gamma term) |
| 3 | `merge_outcomes.py` | tag `crossing-device` removed from the three device nodes; status `closed`; closing lane written into the statement | 3 live curated nodes (776 candidates exempted through the Rouche node, round-4 count) | 0 live; the nodes are walls and occur in no candidate |
| 4 | `curated/mk_devices.py`, `curated/devices.json` | curated device list | none | 21 types, 60 nodes: closed 17 types / 51 nodes, floored 1 / 6, open 3 / 3; 15 target forms; 6 pending proposals |
| 5 | `build_graph.py` | role `device` and field `device` from the list; keyword role `crossing` no longer assigned; `ctl-THIN` text replaced from the lane record; one control edge added | 142 live nodes with role `crossing`, 55 counted as devices by the round-4 rule | 57 live device nodes (48 closed, 6 floored, 3 open); the keyword pattern still matches 262 nodes and is only counted |
| 6 | `generate.py` | R4-device rule reads the state: closed device rejects, open or floored device required; score 3 / 2; option `--per-device` (default 12) | rule on keyword role | rule on curated state |
| 7 | `merge_outcomes.py` | `fam-order2-theta-rows`, second group narrowed: it matched the open direction `map-open-1` itself | 1,080 rejections in the first run, `map-open-1` in no candidate | 668 rejections, all with a theta or half-integral member |
| 8 | `curated/mk_devices.py` | device `twisted-discrepancy` (node `map-open-21`, created by the map edit) moved from pending to open | 2 open nodes | 3 open nodes |
| 9 | `README.md`, `ROADMAP.md`, `ENGINE_LOG.md` | file table, role list, rule paragraph; note under the device table; log section | | appended |

Runs (all through `scripts/memcap.sh 8`): `merge_outcomes.py`: 52 outcome entries, 43 closed, 24 nodes in `nodes-15.json`, 34 families. `build_graph.py`: 1,572 nodes, 953 live, 182 rows, 8,558 edges (before: 1,556 / 952 / 175 / 8,674). `generate.py --top 60`:

| | before | after |
|---|---|---|
| generated | 63,111 | 38,112 |
| rejected | 42,418 | 27,386 |
| scored | 20,693 | 10,726 |
| rejected: no device | 24,781 | 14,298 |
| rejected: contains a closed device | not a rule | 3,362 |
| rejected: closed family | 29 families | 6,155 by 34 families (new five: Lax-Phillips 35, Helson 13, FE-stage 0, collision 0, Ramare 0, after the earlier checks) |
| rejected: closed in outcomes / two nodes shared with a closed lane | 1,988 / 794 | 1,973 / 541 |
| top 60 with a closed device | 24 (ranks in `engine_before.json`) | 0 |
| top 60 with an open device | 0 | 25 |
| top 60 with a floored device only | 1 | 35 |
| top 60 resting on a keyword-only device | 54 | 0 |
| top 60 with a wall node | 0 | 0 |

Rejections by closed device type: monotone flow functional 750, positive-kernel transport 546, residue / explicit formula 480, finite-support positivity 441, mean value / convexity 398, Euler-FE phase at one height 368, geometric positivity 152, maximum principle 121, recurrence 46, dual-measure compactness 34, exact uniqueness 26. The generated count falls because the pool for the third member of moves M1, M3, M4 has 9 nodes instead of 142.

Device nodes in the top 60: `map-open-21` 12, `map-open-9` 12, `tro6-natural` 12, `map-open-4` 12, `qrh-seven-eighths` 10, `seven-eighths-abscissa-formula` 3, `map-open-1` 1. Success criterion of the assignment (no closed device in the top 60; every edit listed with counts): met.

How the list was curated. Source: the ROADMAP device table, the map rows, the round logs and the statements of the 58 nodes the round-4 rule counted as devices. A node is listed as closed only with a row or a refereed lane as evidence. 15 nodes of the old list are RH-equivalent statements or Landau-type final steps and are filed as target forms (no state). About 20 others (identities, tools, Lean records) are not listed.

### 2.2 Map (`push/OBSTRUCTION_MAP.md`)

Script `apply_map.py` (anchored insertions, stops on a missing anchor), log `map_edits.json`, previous file `before/OBSTRUCTION_MAP.md`. 450 -> 471 lines; rows in section 3: 175 -> 182 as parsed by the graph builder.

| Pending item | Applied as | Source state |
|---|---|---|
| Gonek stage theorem is P-independent | row P44 (with the degree form of Rouche and the collision law) | lane and referee (E1-E7) read; Gonek opened by the lane; Montgomery's omega theorem still recalled |
| Fejer-stage F' = Weil functional on Fejer tests | row P45 | lane Lemma 1(c), referee E6 (classical rewriting) |
| Lax-Phillips Hecke compression | row G26 | lane and referee read |
| Ramare / Matomaki-Radziwill | rows P47, P48, P49 | opened: arXiv 1707.01315 abstract (X^(8/33+eps) <= H <= X^(1-eps), arbitrary log-power saving, almost all shifts: confirmed); ar5iv text of 1501.04585 (Lemma 8: count T^(2 log V/log P) V^2 exp(2 (log T/log P) log log T); sets T_j, U with alpha_j = 1/4 - eta(1 + 1/(2j)); Theorem 1 tolerance (log h)^(-1/200), exceptional set (log h)^(-1/100): confirmed against the lane's recalled form); arXiv 1503.05121 abstract (averaged Chowla for H -> infinity; "an averaged form of a corrected conjecture of Elliott"; the two-function form is not in the abstract) |
| Helson relative theorem | row P46; section 4 entries 48, 49 | section 2.3 below |
| THIN as a control | section 2 table row and note | short-interval input marked "cited from memory" until `c5-thin-walk-replay` reports |
| (added) | section 5 round-4 paragraph; section 6 item 14 and items 21, 22; section 7, four rows | |

The literature pages were read through a fetch tool that returns a summary of the page; the three confirmations above are at that level, not a line-by-line reading of the PDFs.

`campaign/MAP_PENDING.md`: a status section appended (what was applied, what is still pending). Its sections A to G had been applied in round 3; the title line is historical.

### 2.3 Referee debts: Theorem 1 of `c4-helson-discrepancy-zerofree`, literature, r(0)

Setting. chi completely multiplicative, abs(chi(n)) = 1, S(x) = sum_{n<=x} chi(n) = c x + E(x), c != 0, E(x) << x^theta, theta < 1. F(s) = sum chi(n) n^-s, F*(s) = conj F(conj s), H = F F*/zeta^2. sigma_0 = largest real zero of F in (theta, 1), or theta if there is none.

**Second check of Theorem 1 (independent derivation; holds).**
- theta >= 0: E jumps by chi(n), of modulus 1, at each integer and is continuous in between, so E is not o(1). Hence (theta, 1) lies in (0, 1), where zeta is finite and negative.
- F(s) = c s/(s-1) + s int_1^inf E(x) x^(-s-1) dx: analytic on Re s > theta except a simple pole at 1 with residue c.
- For Re s > 1: log H = sum_p sum_k (chi(p)^k + conj chi(p)^k - 2) p^(-ks)/k = -2A(s), A(s) = sum_p sum_k (1 - Re chi(p)^k) p^(-ks)/k, coefficients >= 0. Complete multiplicativity and unimodularity are used here and nowhere else.
- H is positive on the real ray (sigma_0, inf): on (1, inf) it is exp(-2A); H(1) = abs(c)^2 (two simple poles against a double pole); on (sigma_0, 1), F*(sigma) = conj F(sigma), so H = abs(F)^2/zeta^2 > 0 by the definition of sigma_0. sigma_0 exists: real zeros of F in (theta, 1) are isolated and cannot accumulate at the pole.
- So -(1/2) log H (real branch) is analytic on a neighbourhood of the ray whose intersection with Re s > 1 is connected, and equals A there. Landau's theorem (a Dirichlet series with non-negative coefficients and finite abscissa of convergence sigma_c is singular at s = sigma_c) gives sigma_c(A) <= sigma_0.
- exp(-2A) is analytic and zero-free on Re s > sigma_0 and equals the meromorphic H on Re s > 1, hence on Re s > sigma_0. So ord_F(s) + ord_F(conj s) = 2 ord_zeta(s) there.
No gap found. The referee's two remarks (the wording for complex chi; dependence of sigma_0 on the chosen theta) stand.

**Corollary C6 (PROVED, new in this lane, one line).** If F has a real zero in (theta, 1), then sigma_c(A) = sigma_0 exactly. Proof: if A converged at some sigma < sigma_0, H = exp(-2A) would be non-zero at sigma_0. Consequence: for sigma_0 > 1/2 the prime sum sum_p (1 - Re chi(p)) p^-sigma diverges at sigma_0 (the k >= 2 terms converge for sigma > 1/2). The thin twists are the equality case: sum_{p in S} p^-sigma has abscissa b.

**Literature (generic queries only).** Four searches (completely multiplicative unimodular functions with power-saving partial sums and zeros of F/zeta; Beurling systems and multiplicative functions close to their mean; Kahane-Saias functions of sum zero; omega bounds for sign modifications at infinitely many primes) and the ar5iv text of Klurman-Mangerel-Pohoata-Teravainen, arXiv 1911.06265, read through the fetch tool. Found: the O(1) classification (KMPT), omega bounds for finitely many modified primes (their Corollary 1.6, Omega(log x)), a square-free-supported Omega(x^(1/4-eps)) result (their Proposition 4.2), Kahane-Saias on the c = 0 class. Not found: any statement with error O(x^theta) of the form of Theorem 1, or the mean-square bound of Theorem 2 (KMPT do not use additive characters). Conclusion: no prior statement found; this is not evidence of novelty. Theorem 1 remains a routine Landau argument.

**Theorem 2 (PROVED, one author, unrefereed).** Let chi be completely multiplicative and unimodular, g = chi * mu (so chi = 1 * g, g multiplicative, g(p^k) = chi(p)^(k-1)(chi(p) - 1)), and assume B(y) := sum_{d<=y} abs(g(d)) <= C y^beta for all y >= 1 with some beta < 1. Put c = sum_d g(d)/d, E(x) = S(x) - c x, C_1 = C(1 + 1/(1 - beta)). Then for every X >= 1,

    sum over primes 3 <= p <= X^(2(1-beta)/5) of abs(1 - chi(p))^2  <=  (4 pi^2/abs(c)^2) (5 sup_{x<=X} abs(E(x))^2 + (C_1^2 + 1)/3).

Proof.
(i) Residue classes. For a prime p and a not divisible by p, S(X; p, a) := sum_{n<=X, n = a mod p} chi(n) = sum_{d<=X, p not dividing d} g(d) #{m <= X/d : m = a d^-1 mod p} = (X/p) c_p(X) + r_a, c_p(X) = sum_{d<=X, p not dividing d} g(d)/d, abs(r_a) <= B(X). The main term does not depend on a. Also sum_{n<=X, p | n} chi(n) = chi(p) S(X/p).
(ii) Additive characters. For p not dividing k, with e(x) = exp(2 pi i x) and sum_{a != 0} e(-ka/p) = -1:
T(k/p) := sum_{n<=X} chi(n) e(-kn/p) = chi(p) S(X/p) - (X/p) c_p(X) + O*((p-1) B(X)).
c_p(X) = c^(p) + O*(C X^(beta-1)/(1-beta)) with c^(p) = sum_{p not dividing d} g(d)/d = c (1 - chi(p)/p)/(1 - 1/p) (Euler factor of g at p: (1 - 1/p)/(1 - chi(p)/p)). Hence
T(k/p) = c X (chi(p) - 1)/(p - 1) + O*(abs(E(X/p)) + C_1 p X^beta).
(iii) Fourier transform of E. With Ehat(xi) = int_0^X E(x) e(-xi x) dx, integration by parts in T(xi) = int e(-xi x) dS(x) gives
T(xi) = c (1 - e(-xi X))/(2 pi i xi) + e(-xi X) E(X) + 2 pi i xi Ehat(xi),
so for xi = k/p with 0 < abs(k) < p/2: abs(Ehat(k/p)) >= (p/(2 pi abs(k))) max(0, a_p - b_{p,k}), a_p = abs(c) X abs(chi(p) - 1)/(p - 1), b_{p,k} <= abs(E(X/p)) + C_1 p X^beta + abs(E(X)) + p/(pi abs(k)).
(iv) Large sieve (Gallagher's form for integrals). For real points xi_r with mutual distance >= delta and f in L^2[0, X]: sum_r abs(fhat(xi_r))^2 <= (pi X + 1/delta) int abs(f)^2. The points k/p, p <= Q an odd prime, 0 < abs(k) < p/2, have mutual distance >= Q^-2.
(v) Assembly. (max(0, a - b))^2 >= a^2/2 - b^2; sum_{0<abs(k)<p/2} (p/(2 pi k))^2 lies between p^2/(2 pi^2) and p^2/12. With M = sup_{x<=X} abs(E(x)):
(pi X + Q^2) X M^2 >= sum_{3<=p<=Q} [ abs(c)^2 X^2 abs(chi(p) - 1)^2/(4 pi^2) - (p^2/3)(2 M^2 + C_1^2 p^2 X^(2 beta) + p^2/pi^2) ].
For Q <= X^(1/2): abs(c)^2 X^2 V(Q)/(4 pi^2) <= 5 X^2 M^2 + (C_1^2 X^(2 beta) + 1) Q^5/3, V(Q) the sum in the statement; Q^5 = X^(2 - 2 beta) gives the claim. QED

**Corollary (PROVED from Theorems 1 and 2).** Under the hypothesis of Theorem 1, if b is a real zero of F in (theta, 1), then b(1 - b) <= 10 theta. In particular: if E(x) << x^eps for every eps > 0, F has no real zero in (0, 1), sum_{p<=y} abs(1 - chi(p))^2 << y^eps, and in Re s > 0 the zeros of F are those of zeta with ord_F(s) + ord_F(conj s) = 2 ord_zeta(s).
Proof. Let b be the largest real zero, so sigma_0 = b. Theorem 1 (C1) and Rankin give B(y) << y^beta for every beta > (1 + b)/2. Theorem 2 with M << X^theta gives V(y) << y^(5 theta/(1 - beta)), so sum_p (1 - Re chi(p)) p^-sigma converges for sigma > 5 theta/(1 - beta). Since 1 - Re z^k <= k^2 (1 - Re z) on the unit circle, the k >= 2 terms of A are dominated by a constant (depending on sigma > 0) times the k = 1 terms, so A converges there. By C6, b <= 5 theta/(1 - beta) for every beta > (1 + b)/2, i.e. b(1 - b) <= 10 theta. QED

**Decision on r(0).**
- In the class "E(x) << x^eps for every eps > 0" (exponent zero): r = 0. No real zero of F in (0, 1) exists. The question in section 3 of the lane ("whether an exponent-0 chi can have a real zero in (0,1)") is answered: no. The best f at exponent zero is Theta, zeta's own supremum.
- For fixed theta in (0, 1/40): real zeros lie in (theta, b_-(theta)] or [b_+(theta), 1), b_+- = (1 +- sqrt(1 - 40 theta))/2 (b_- about 10 theta). The upper branch is not excluded, so lim_{theta -> 0} r(theta) = 0 is OPEN. For theta >= 1/40 the corollary is empty.
- The heuristic behind the measured exponent b/2: with equidistribution of chi in the non-zero classes mod p the mean square of E is about (abs(c)^2/12) sum_{p<=X} abs(1 - chi(p))^2, i.e. theta >= sigma_0/2. Theorem 2 proves this with the sum truncated at X^(2(1-beta)/5); the loss is the error p B(X) in step (ii).
- Recorded inconsistency of the round-5 planner (measured exponent near b/2 with a zero at b, against Theorem 1): there is none. Theorem 1 speaks of Re s > sigma_0, and sigma_0 = b for these twists; the zero at b is the boundary point, and theta < b is allowed.

**Numerical check of the steps (MEASURED; `helson/check_thm2.py`, float64).** Greedy thin sign twists, X = 4e6 (b = 0.3, 0.5) and 2e6 (b = 0.9).
- Step (ii), b = 0.3 (29 primes in S, c = 0.532768, B(X) = 1409): p = 5: T = -1065495.8 against c X (chi(p)-1)/(p-1) = -1065536.0 (difference 60; proved bound 5672); p = 13: -355125.8 against -355178.7; primes outside S: abs(T) between 20 and 440 against main term 0.
- b = 0.5 (314 primes, c = 0.410748, B(X) = 15293): p = 5: -821529.0 against -821495.9; p = 11: -328631.6 against -328598.4.
- b = 0.9 (39,216 primes, B(X) = 2.5e6 > X): the main term is still visible (p = 3: -51926 against -51812; differences 400 to 4000), but the proved error term exceeds the main term at this X; the theorem is asymptotic there.
- Step (iii): the identity holds with absolute residual between 2e-10 and 2e-04 in all 132 cases (T of size 1e2 to 1e6).
- Final inequality: satisfied with a large margin in the two cases with beta < 1 on the range (left side 8 and 4, right side 6.9e6 and 2.9e7). The check confirms the steps; it does not test sharpness.
An integer overflow in the first b = 0.3 run (fit of c) was found and fixed before these numbers.

### 2.4 Owed numerics: K[t] for the backward heat family at tau = -2

Object owed since round 1: Suzuki's operator K[t] (lane `sq-canonical-det`) for Theta_{tau,omega}(z) = F_tau(z - omega)/F_tau(z + omega), F_tau the heat family of the brief (kernel e^(tau u^2/16) kappa), z = s - 1/2.

**The object does not exist for tau < 0 (PROVED relative to `b-escape-law` Theorem A, with non-cancellation MEASURED on the located poles and ARGUED beyond).** Suzuki's kernel is K(x) = (1/2 pi) int over Im z_S = v of Theta e^(-i x z_S) dz_S for v above all poles, K = 0 for x < 0, and K[t] is built from it; Lemma A of `sq-canonical-det` assumes this kernel. A kernel supported on [0, inf) of exponential type exists iff Theta is bounded and analytic in some half-plane Re z > v_0. By the escape law the zeros of F_tau, tau < 0, lie in no vertical strip abs(Re z) <= Y, so Theta has poles of unbounded real part unless every such pole is cancelled by a zero of F_tau at distance 2 omega to the left. At tau = -2 none of the 24 located poles is cancelled (abs(c_j) between 0.119 and 0.169 at omega = 0.1; between 0.004 and 0.328 at omega = 0.25). Consequence: there is no line above all poles, no causal kernel, and "norm K[t] < 1 for small t, failure at a finite T*" (c1 Part B, labelled PROVED-rel Lemma A) is not a statement about a defined operator. The statement "Theta_tau is not inner" stands.

**The defined substitute and its exact computation (MEASURED from the pole data; `heat/heat_k_poles.py`).** K_Gamma(x) := k_0(x) + r_Gamma(x), with k_0 the boundary kernel (Fourier transform of a unimodular function: the operator f -> int k_0(x+y) f(y) dy has norm <= 1 on L^2(-T, T)) and r_Gamma(x) = sum over poles with height below Gamma of 2 Re(c_j e^((v_j + i gamma_j) x)), v_j = delta_j - omega, c_j = F_tau(rho_j - 2 omega)/F_tau'(rho_j). R_Gamma[T] (kernel r_Gamma(x+y) on L^2(-T, T)) has finite rank; its spectrum is that of C G with G[lambda, mu] = 2 sinh((lambda + mu) T)/(lambda + mu). Then norm(K_Gamma[T]) >= norm(R_Gamma[T]) - 1. No Ritz degree enters. Pole data recomputed by `heatlib` (700 bits; Newton steps below 3e-28); eigenvalues by mpmath at 60 digits.

First T with norm(R_Gamma[T]) = 1 and = 2 (the second certifies norm(K_Gamma[T]) > 1):

| Gamma | poles (omega = 0.1) | T(norm 1) | T(norm 2) | poles (omega = 0.25) | T(norm 1) | T(norm 2) |
|---|---|---|---|---|---|---|
| 55 | 1 | 3.518 | none below 4 | 0 | - | - |
| 70 | 2 | 1.789 | 2.434 | 1 | 1.437 | 2.254 |
| 100 | 5 | 1.425 | 1.904 | 4 | 1.100 | 1.728 |
| 130 | 7 | 1.249 | 1.628 | 6 | 0.986 | 1.405 |
| 160 | 13 | 1.174 | 1.594 | 12 | 0.943 | 1.374 |
| 190 | 17 | 1.134 | 1.400 | 16 | 0.879 | 1.276 |
| 230 | 24 | 1.005 | 1.344 | 23 | 0.837 | 1.163 |

norm(R_Gamma[T]) at Gamma = 230: omega = 0.1: 0.177 (T = 0.1), 0.325 (0.5), 0.974 (1.0), 2.71 (1.5), 9.79 (2.0); omega = 0.25: 0.301, 0.554, 1.41, 3.39, 10.4.

Reading.
- The failure time of the truncated operator decreases with the truncation height over the whole range computed; it is a function of Gamma, not a property of the family. A Ritz run of degree p resolves poles up to height about p/T, so its outcome would have depended on the degree in the same way.
- All 24 residues have negative real part (Re c_j in [-0.165, -0.117] at omega = 0.1), so r_Gamma(0) = sum 2 Re c_j = -7.41 at Gamma = 230 and grows linearly with the number of poles: the residue series does not converge at x = 0 on the evidence.
- Single-pole check: Gamma = 55, omega = 0.1 gives norm 0.243 at T = 1 against the closed form abs(c) sinh(2 v T)/v = 0.241 (the conjugate pair is almost orthogonal).
- Not computed: the boundary part k_0, hence the exact norm of K_Gamma[T]; only the lower bound norm(R) - 1 is used. Whether T(norm 2) tends to 0 as Gamma grows is OPEN (v_j grows like a logarithm of the height).

Outcome for the control table: HEAT is outside the domain of the determinant criterion of `sq-canonical-det`; it is not a control that "passes for small t". The flow-blindness reading of that lane is unchanged: every finite pole truncation at small abs(tau) moves the kernel on [0, 2T] by a small amount.

## 3. Controls

No attack is made, so no mechanism has to fail on the controls. Where a statement of this lane meets a control:

| Control | Statement | Outcome |
|---|---|---|
| Beurling (B) | Theorem 1 | passes every step (lane and referee; rechecked) |
| Beurling (B) | Theorem 2 | not formulable: steps (i), (ii) use residue classes mod p, i.e. the additive structure of the integers. This is the one place in the Helson family where the integers enter; the conclusion is still relative (it bounds the deviation of chi from 1, not zeros of zeta) |
| THIN / TW- | Theorems 1, 2 | inside the class; steps (ii), (iii) verified numerically on three thin twists; the corollary is consistent with the measured pairs (b, theta) = (0.9, 0.45), (0.5, 0.3): b(1 - b) <= 10 theta holds |
| DH | Theorems 1, 2 | no Euler product: A does not exist; chi(p) S(X/p) fails in step (i) |
| Liouville, n^(-i alpha) | Theorems 1, 2 | c = 0 or no main term c x: empty |
| HEAT | determinant criterion of `sq-canonical-det` | not formulable (section 2.4) |
| NR, EA, PA, THW, U | - | not run; nothing in this lane is claimed for them. The stage rows P44, P45 list which controls were run by their lanes |

## 4. Requirement flags

No requirement score applies to a repair lane. Flags for the one mathematical statement added (Theorem 2 with its corollary):

- R1 false. Complete multiplicativity at every prime and the residue classes of the integers are used essentially in the proof (steps (i), (ii)), but the statement concerns F for a class of chi relative to zeta. It is not an attack on zeta. Evidence: section 2.3; DH and Beurling rows of section 3.
- R2 false. The conclusions are an identification of zero sets and a bound on real zeros of F; no every-window statement about zeta.
- R3 false. No zeta-only mechanism is claimed; thin twists are inside the class.
- R4 false. Nothing reaches the critical line.

## 5. Three weakest steps

1. Theorem 2 has one author and no referee. Points to test: step (i) (the count X/(dp) + O(1) summed over d <= X with weight abs(g(d)), and the identity c^(p) = c (1 - chi(p)/p)/(1 - 1/p), which needs absolute convergence of sum g(d)/d); the constant in Gallagher's inequality for integrals (pi X + 1/delta after centring the interval); the bootstrap in the corollary (beta is taken from Theorem 1 with sigma_0 = b, then Theorem 2 is applied with that beta). The numerical check confirms steps (ii) and (iii) and not the final exponent. If Theorem 2 fails, map entry 49 and one sentence of row P46 must be removed (noted in MAP_PENDING).
2. The curated device list is one lane's reading. A closed device node rejects every candidate containing it, including uses of the node as an input identity; 15 nodes were filed as target forms and about 20 left unlisted without a row-by-row justification. The three open devices are few, so 35 of the top 60 rest on the floored 7/8 device (frontier part B, not the critical line), and the partner choice remains a tag heuristic.
3. Section 2.4 rests on the escape law of `b-escape-law` (internal, refereed once) and on non-cancellation of high poles, which is measured for 24 poles and argued beyond them. The numbers are lower bounds norm(R) - 1 for a truncated operator defined in this lane, not values of an operator defined in the literature; the boundary part was not computed. The literature confirmations for rows P47 to P49 are at the level of fetched summaries of the pages.

## 6. Residuals carried forward

- Referee for Theorem 2 and its corollary; lim r(theta) as theta -> 0 (upper branch near 1).
- THIN: the short-interval theorem is still cited from memory (lane `c5-thin-walk-replay`); `ctl-THIN` stays conjectural.
- Learn step: set the states of `map-open-1`, `map-open-21` and the six pending proposals in `curated/mk_devices.py` when the round-5 lanes report.
- Montgomery's fixed-X omega theorem (row P44) not opened; non-locality step of the Rouche lane; Lax-Phillips norms outside the weighted-L^2 family; kloss float64 error model (not touched here).
- Controls not run in the stage lanes: HEAT, NR, PA, THW.

## 7. Files

- Engine: `engine/merge_outcomes.py`, `build_graph.py`, `generate.py`, `curated/mk_devices.py`, `curated/devices.json`, `closed_families.json`, `outcomes.json`, `nodes/nodes-15.json`, `IDEA_GRAPH.json`, `CANDIDATES.json`, `README.md`, `ROADMAP.md`, `ENGINE_LOG.md` (section "Campaign round 5 repair"); previous versions in `engine/scratch/*.before-c5.*`.
- Map: `push/OBSTRUCTION_MAP.md`; `campaign/MAP_PENDING.md` (status section appended).
- This directory: `apply_map.py`, `map_edits.json`, `before/` (map, MAP_PENDING, ENGINE_LOG as found), `engine_before.json`, `engine_after.json`, `generate_top60.log`, `rejected_samples.json`, `role_devices_before.json`, `helson/check_thm2.py` with three logs and three JSON files, `heat/heat_k_poles.py`, `.log`, `.json`.

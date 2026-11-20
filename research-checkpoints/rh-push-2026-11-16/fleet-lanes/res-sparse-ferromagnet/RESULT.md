# res-sparse-ferromagnet: sparse, hierarchical and vanishing-coupling ferromagnets for Xi

Date: 2026-11-17. Continues `ap-leeyang-structural` and `ap-leeyang-ladder`. Those lanes excluded complete-graph ferromagnets with couplings bounded below and finite ladder truncations. This lane treats the cases their referees listed as not covered: sparse graphs, hierarchical models, couplings that vanish in the limit.

Nothing here proves or refutes RH. No bound moves. Labels: PROVED (argument in this note), PROVED-rel X (relative to the named input), CLASSICAL (standard theorem, recalled, source not opened), MEASURED (float64 or mpmath, not interval arithmetic), ARGUED, OPEN.

## 0. Verdict

**Precise obstruction (a narrower no-go), with one proved family of finite-stage Lee-Yang theorems.**

1. (PROVED, Prop. 2) On the sites of the proved decomposition Phi = phi * (conv over primes of geometric measures), the free model is the only pair model: any pair coupling, on any graph, of any sign, between prime sites or between a prime site and the archimedean site, changes the kernel. The star graph "every prime coupled to the archimedean site" does not exist for Xi.
2. (PROVED, Thm. 1) The two symmetrisations of a prime site that the functional equation offers both leave the admissible class. The additive one is a T-NR site, with zeros at Re s = 1/2 +- arccosh(sqrt p)/log p. The multiplicative one is the Poisson kernel, zero-free but with moment radius exactly the strip and a product over p that converges nowhere. The third symmetrisation (occupation k -> k - N/2, a spin) is a Lee-Yang site, but it is even about Re s = 0, not 1/2.
3. (PROVED, Thm. 3) In the spin form there is a family of exact critical ferromagnets with sparse or vanishing couplings. For any graph on the primes dividing a squarefree M with couplings K_pq >= 0 obeying the sum rule sum_q K_pq = log p, the Dirichlet polynomial Z_K(s) = sum_{n|M} w_K(n) n^-s is self-dual, Z_K(1-s) = M^(s-1/2) Z_K(s), and **all** its zeros lie on Re s = 1/2, at every height. The Curie-Weiss member is K_pq = log p log q / log M (heat time c* = 1/(2 log M)), which also holds at every ladder depth; its couplings tend to 0 as M grows and its coefficients tend to 1. Without the sum rule the zeros lie in the strip min a_p <= Re s <= max a_p, a_p = (kappa_p + (1/2) sum_q K_pq)/log p.
4. (PROVED-rel Seip's character as refereed in `ap-global-bridge`, Thm. 4) The statement in 3 depends only on K >= 0 and on the moduli of the activities. It holds verbatim for every completely multiplicative unimodular twist, including the control U, whose limit function has a zero at a chosen point of the strip, and the twisted stages converge to that limit on Re s > 1. So no passage to the limit from these stage theorems can be valid unless it uses the phases of the local parameters. The stages also diverge on the real segment (1/2, 1].
5. (PROVED, Thm. 5) Graph-independent obstruction: a stage has zero density (log M)/2 pi at every height, so it can model zeta only near t = 2 pi M, where it contains at most log M / log log M primes and its support (the divisors of M) cannot contain the integers up to sqrt M once sqrt M >= 5. Sparseness of the graph does not change the support.
6. (PROVED, Thm. 6) Kernel-side stages: every symmetrised finite Dirichlet or Euler stage has zeros off the line (infinitely many real s-zeros for Dirichlet stages; zeros next to the poles on Re s = 1 for Euler stages), and its kernel has tails of size e^(-5|u|) or e^(-|u|), so the forward heat flow is undefined. Its de Bruijn-Newman constant is +infinity. The stage constants are: +infinity (kernel side, every stage), 2/log M -> 0 (spin side, in the kernel time t = 4c), against 0 <= Lambda <= 0.2 for the limit. There is no critical limit on the kernel side.
7. (PROVED / CLASSICAL, Prop. 7) Thermodynamic criticality is the opposite end from Lambda = 0: the critical Curie-Weiss block spin has limit density exp(-x^4/12) with Lambda = -infinity; every stage and every fixed point of a Dyson hierarchical block-spin map with coupling beta > 0 has Lambda <= -beta/2; Lambda >= 0 requires the scaled coupling to vanish, and the fully free end (independent Ising spins plus a Gaussian) is excluded for Xi unconditionally.

What remains outside (section 7): pair ferromagnets, conjugate to u, on sites that are not the Euler sites. No candidate is known. Whether the closure of pair-ferromagnet laws equals the whole Lee-Yang class is OPEN; if it does, "Phi is a limit of sparse ferromagnets" is RH restated with no added structure.

## 1. Plan, and what is new against the atlas, the map and the two parent lanes

Atlas section on the primon gas records: the two-sided free energy L_X, a Gaussian limit, non-normalisability of a positive quadratic reweighting of bosonic prime occupations, a quartic-stabilised density that is not the theta density, and the unresolved condition "ferromagnetic finite partition functions converging locally uniformly to the theta transform". Map rows A1, A2 record the parent lanes; rows Q10-Q13 record the l^1/l^2 wall of the prime chain; row F2 the heat cocycle.

Not in those sources:
- Prop. 2 (uniqueness of the free model on the Euler sites, any graph, any sign). Parent lane section 5.1 states "no interaction term" as an observation about one representation.
- Thm. 1 (the three symmetrisations of a prime site and where each fails).
- Thm. 3 for arbitrary graphs with the sum rule, the self-duality, and the exact critical line. Ladder Prop. C has the Curie-Weiss case with zeros on Re s = c log M; it was not evaluated at c log M = 1/2, the self-duality was not noted, and non-complete graphs were not treated.
- Thm. 4 (control U against the vanishing-coupling stages), Thm. 5, Thm. 6(b) (real zeros of Dirichlet stages; the parent lanes counted only t > 1), Prop. 7 (hierarchical fixed points; the two meanings of "critical").

Not re-entered: rows Q10-Q13 (reached again in Thm. 5 and cited), F1-F3, ladder Thm. A/B/D.

Normalisation (parent lane): Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}); Xi(z) = int Phi e^{izu} du = xi(s)/4, s = (1+iz)/2; phi(v) = (2 pi^2 e^{9v} - 3 pi e^{5v}) exp(-pi e^{4v}); gamma(s) = pi^{-s/2} Gamma(s/2); l_p = log p, l_n = log n, L = log M.

## 2. Task 1: the sites and the coupling structure

### 2.1 Theorem 1 (symmetrisations of a prime site). PROVED; numerics in `sites.log` sections 1-2.

The prime site of the decomposition is mu_p = sum_{k>=0} p^{-k/2} delta_{-k l_p/2}, with transform (1 - p^-s)^-1. It is one-sided. The functional equation s <-> 1-s reflects it to mu_p~, transform (1 - p^{s-1})^-1.

(a) Additive symmetrisation mu_p + mu_p~. With a = p^-s, b = p^{s-1}, ab = 1/p:
1/(1-a) + 1/(1-b) = (2 - a - b)/((1-a)(1-b)). Zeros: a + b = 2, i.e. w + 1/w = 2 sqrt p with w = p^{1/2-s}, so
Re s = 1/2 +- arccosh(sqrt p)/log p, Im s in (2 pi/log p) Z.
Since cosh((log p)/2) < sqrt p, these lie outside the closed strip (p = 2: Re s = 1.7716; p = 101: 1.1497; -> 1 as p -> infinity). This is the site of the T-NR control, 2 cosh((s - 1/2) log p) + c with c = -2 sqrt p, |c| > 2. The additively symmetrised prime site is even and positive and is **not** in the Lee-Yang class.

(b) Multiplicative symmetrisation mu_p * mu_p~ = (1 - 1/p)^-1 sum_{m in Z} p^{-|m|/2} delta_{m l_p/2}. Transform:
1/((1-a)(1-b)) = 1/(1 + 1/p - 2 p^{-1/2} cos(z l_p/2)),
the Poisson kernel of radius p^{-1/2}. Even, positive, no zeros. Its moment generating function exists only for |Re(2s-1)| < 1 (poles on Re s = 0 and Re s = 1): the Lee-Yang theorems K6 assume sites with entire transforms (all Gaussian or exponential moments), so the site is outside their hypotheses. The product over p of these sites is zeta(s) zeta(1-s) as a formal Euler product and converges for no s (it needs Re s > 1 and Re s < 0). It represents Xi(z) Xi(-z) = Xi^2 formally and nothing on the line.

(c) Spin symmetrisation. At finite depth N, e_p(z) = sum_{k<=N} z^k with z = p^-s equals p^{-Ns/2} sinh((N+1) s l_p/2)/sinh(s l_p/2): a monomial times the transform of a spin-N/2 site (spin k - N/2), which is in the Lee-Yang class. It is even about Re s = 0. At infinite depth the same shift gives p^{s/2}/(2 sinh(s l_p/2)): the reciprocal of a Lee-Yang function, with poles where a spin site has zeros. Moving the centre of evenness from 0 to 1/2 is the whole problem; sections 3 and 4 compute what it costs.

### 2.2 Proposition 2 (rigidity: the free model is the only pair model on the Euler sites). PROVED.

Model class. Variables: a in R with the archimedean density phi; k_p in Z_{>=0} for each prime, with site weights nu_p(k) >= 0, nu_p(0) = 1; spins x_p = -k_p l_p/2. Interaction factor exp(sum_{p<q} J_pq x_p x_q + a sum_p J_0p x_p) with real J of either sign on any graph. Statistic U = a + sum_p x_p. Writing n = prod p^{k_p}, v_n = u + l_n/2, the kernel of U is

K(u) = sum_n c(n) n^{-1/2} phi(v_n) e^{tau(n) v_n}, c(n) = n^{1/2} prod nu_p(k_p) exp(sum_{p<q} J_pq x_p x_q), tau(n) = -(1/2) sum_p J_0p k_p l_p.

Assume sup_p |J_0p| < infinity and c(n) <= e^{C n^2} (this includes the geometric site weights nu_p(k) = p^{-k/2} with prime-prime couplings of either sign, for which c(n) = exp(O(log^2 n))).

**Claim.** If K(u) = Phi(u) for all large u, then tau = 0 and c = 1 identically: J_0p = 0 for every p, nu_p(k) = p^{-k/2}, and J_pq = 0 for every pair.

Proof. For u -> +infinity, phi(v_m)/phi(v_n) <= C (m/n)^{9/2} exp(-pi (m^2 - n^2) e^{4u}) for m > n, and phi(v_n) > 0. Induction on n: if the terms below n agree, divide the difference K - Phi by n^{-1/2} phi(v_n):
c(n) e^{tau(n) v_n} - 1 = - sum_{m>n} [c(m) e^{tau(m) v_m} - 1] (n/m)^{1/2} phi(v_m)/phi(v_n).
With |tau(m)| <= C' log m and c(m) <= e^{C m^2} the right side is bounded by sum_{m>n} exp(C m^2 + C' log m (u + log m) - pi (m^2 - n^2) e^{4u}) -> 0. So c(n) e^{tau(n)(u + l_n/2)} -> 1 as u -> infinity, which forces tau(n) = 0 and then c(n) = 1. At n = p: J_0p = 0. At n = p^k: nu_p(k) = p^{-k/2}. At n = pq: J_pq = 0. QED.

Consequences.
- The answer to "is Xi a star-graph ferromagnet with every prime coupled only to the archimedean site" is no, and the same holds for every other graph on these sites. What ties the primes to the archimedean site is the evenness of the total law (Poisson summation), which is not a coupling.
- On the Dirichlet side (without the archimedean kernel) bosonic sites admit no positive pair coupling at all: sum_{k,l} e^{K k l} z^k w^l diverges for every K > 0 and all z, w != 0 (atlas; parent lane O3). Pair couplings between prime sites need finite depth.
- With J = 0, K6 is K2 (products), valid where the product converges: Re s > 1.

So a ferromagnetic representation must change the sites. Section 3 does this in the only way the Euler product offers (finite depth, spin form). Section 6 treats sites unrelated to primes.

## 3. Task 2a: sparse and vanishing-coupling ferromagnets on the prime spins

### 3.1 Theorem 3 (critical pair ferromagnets on any graph). PROVED from the Lee-Yang circle theorem (CLASSICAL); MEASURED checks in 3.3.

Let M be squarefree, S = {p | M}, K = (K_pq) symmetric with K_pq >= 0 (zero on non-edges of an arbitrary graph), kappa_p real. Define

Z_K(s) = sum_{n | M} w(n) n^-s, w(n) = exp(sum_{p<q, pq|n} K_pq + sum_{p|n} kappa_p),
r_p = sum_{q != p} K_pq, a_p = (kappa_p + r_p/2)/l_p.

(i) Z_K(s) != 0 for Re s > max_p a_p and for Re s < min_p a_p.
(ii) If a_p = a for all p then every zero of Z_K lies on Re s = a, and Z_K(2a - s) = M^{s-a} Z_K(s).
(iii) Sum rule. With kappa = 0, the condition r_p = log p for all p (the total coupling attached to each prime equals its own energy) puts every zero on the critical line. Then Z_K(1-s) = M^{s-1/2} Z_K(s) and w(n) <= n^{1/2}, w(M/n) = w(n) M^{1/2}/n.
(iv) Curie-Weiss member: K_pq = l_p l_q/L, kappa_p = l_p^2/(2L), so that w(n) = exp(l_n^2/(2L)). This is the heat deformation of E_M(s) = sum_{n|M} n^-s at time c* = 1/(2 log M): D_M = e^{c* d^2/ds^2} E_M. For this member the statement holds at every depth N_p (M = prod p^{N_p}, sum over all n | M).
(v) Unimodular twists. For completely multiplicative chi with |chi(p)| = 1, Z_K^chi(s) = sum_{n|M} chi(n) w(n) n^-s satisfies (i) and (ii) with the same a_p, and conj Z_K^chi(1 - conj s) = conj(chi(M)) M^{s-1/2} Z_K^chi(s) under the sum rule.
(vi) Count: the number of zeros with 0 < t < T is (log M) T/(2 pi) + O(d(M)).

Proof. (i) With occupation n_p = (1 + sigma_p)/2, sum_{p<q} K_pq n_p n_q = const + sum_p (r_p/4) sigma_p + sum_{p<q} (K_pq/4) sigma_p sigma_q, and prod (e^{kappa_p} p^-s)^{n_p} = const * prod (e^{kappa_p} p^-s)^{sigma_p/2}. So Z_K is a constant times an Ising partition function with couplings K_pq/4 >= 0 and complex fields h_p with e^{2 h_p} = zeta_p := e^{kappa_p + r_p/2} p^-s. Lee-Yang: it does not vanish when all |zeta_p| < 1 or all |zeta_p| > 1. |zeta_p| = p^{a_p - Re s}. (ii) follows; for the duality, 2(in(n^c) - in(n)) = sum_{p not| n} r_p - sum_{p | n} r_p, where in(n) is the sum of K over pairs inside n, so w(M/n)/w(n) = (M/n^2)^a; substitute n -> M/n in Z_K(2a - s). (iii) is (ii) with a = 1/2; w(n) <= exp((1/2) sum_{p|n} r_p) = n^{1/2}. (iv) kappa_p + r_p/2 = l_p^2/(2L) + l_p (L - l_p)/(2L) = l_p/2. For general depth: E_M = M^{-s/2} g(s), g = prod sinh((N_p+1) s l_p/2)/sinh(s l_p/2), an even function with zeros on the imaginary axis; e^{cD^2}[e^{-as} g](s) = e^{-as + c a^2} (e^{cD^2} g)(s - 2ca) with a = L/2; e^{cD^2} g is even with zeros on the imaginary axis for c >= 0 (Polya-de Bruijn universal factor, CLASSICAL; referee of the ladder lane confirmed this route). At c L = 1/2 the zeros are on Re s = 1/2 and D_M(s) = const * M^{-s/2} g_c(s - 1/2). (v) The circle theorem uses only the moduli |zeta_p|; the duality uses conj chi(M/n) = conj chi(M) chi(n). (vi) Zero count of an exponential polynomial with real frequencies in [0, L] (Polya, Langer; CLASSICAL). QED.

Remarks.
1. **The sum rule is the controlled vanishing.** In the Curie-Weiss member each pair coupling is l_p l_q/log M -> 0 as M grows, while each prime's total coupling stays equal to log p. In sparse members a prime carries its coupling on a few edges. In "far-coupled" members small primes are joined only to large ones; then w(n) = 1 exactly for every n that contains no coupled pair, so the low coefficients of Z_K are those of the Euler product, the high ones are fixed by duality, and all zeros are on the line. (A bipartite graph between a set A and a set B of primes with no other edges is impossible: it would need prod_A p = prod_B q. Unique factorisation forces edges inside B.)
2. **What the coupling does.** A prime spin is even about Re s = 0 (Thm. 1(c)). The coupling shifts the Lee-Yang line by (1/2) sum_q K_pq / log p; the sum rule is the statement that the shift is 1/2 for every prime at once. In ladder Thm. A the same shift is supplied by the gamma factor, |chi(s)| ~ (t/2 pi)^{-(sigma - 1/2)} against M^{sigma - 1/2}, which balances only at t = 2 pi M.
3. **The stage map contains a backward-heat step.** D_{Mp}(s) = F(s) + p^-s e^{c' l_p^2} F(s - 2 c' l_p), F = e^{-(c - c') D^2} D_M, with c = 1/(2L), c' = 1/(2(L + l_p)). Adding a prime weakens every existing coupling by delta = l_p/(2L(L + l_p)) and then attaches the new site. The stages are not obtained from one another by ferromagnetic operations alone.

### 3.2 Convergence and divergence. PROVED; table MEASURED (`bohr_controls.log`).

Let M run through a sequence in which every integer eventually divides M (deep ladders), and D_M be the Curie-Weiss stage. For Re s = sigma >= 1 + delta:
|D_M(s) - sum_{n|M} n^-s| <= sum_{n|M} (e^{l_n^2/(2L)} - 1) n^-sigma.
For n <= X the sum is at most (e^{log^2 X/(2L)} - 1) zeta(sigma) -> 0. For X < n <= M^eta with eta < 2 delta the terms are at most n^{-sigma + eta/2}, a tail of a convergent series. For n > M^eta the exponent -sigma l + l^2/(2L) is convex in l, hence at most -cL with c = c(delta, eta) > 0 on [eta L, L], and there are d(M) = M^{o(1)} terms. So D_M -> zeta uniformly on Re s >= 1 + delta, and D_M^chi -> sum chi(n) n^-s in the same way. For a general graph with the sum rule the bound w(n) <= n^{1/2} gives convergence on Re s > 3/2 when the product of every coupled pair tends to infinity.

On the real segment 1/2 < sigma <= 1: D_M(sigma) >= sum_{n|M} n^-sigma -> infinity. The stages have no locally uniform limit on any domain that meets (1/2, 1].

Squarefree primorial stages (target zeta(s)/zeta(2s) on Re s > 1):

| P | log M | D(3) | D(2) | D(1.5) | D(0.9) | D(0.75) | D(0.6) |
|---|---|---|---|---|---|---|---|
| 7 | 5.35 | 1.19625 | 1.55399 | 2.0837 | 4.25 | 5.64 | 7.87 |
| 19 | 16.09 | 1.18698 | 1.53803 | 2.1277 | 6.08 | 10.69 | 24.2 |
| 37 | 29.64 | 1.18457 | 1.53111 | 2.1337 | 6.96 | 14.33 | 48.0 |
| 47 | 40.96 | 1.18375 | 1.52845 | 2.1366 | 7.44 | 16.50 | 68.8 |
| 61 | 53.12 | 1.18326 | 1.52668 | 2.1385 | 7.82 | 18.37 | 90.0 |
| target | | 1.18156 | 1.51982 | 2.1733 | | | |

The approach on Re s > 1 is slow (the stage is a Gaussian average of E_M over real shifts of width (log M)^{-1/2}).

### 3.3 Numerical checks of Theorem 3. MEASURED (`bohr_stage.log`, `bohr_controls.log`; float64, argument principle on the box -1.5 < sigma < 2.5 against sign changes of the real function M^{it/2} Z(1/2 + it); largest phase step 0.26 in the rows below).

| Stage | primes, depth | edges | zeros in box | on the line | off the line | duality defect |
|---|---|---|---|---|---|---|
| Curie-Weiss | 2..19, 1 | 28 | 300 | 300 | 0 | 1.2e-13 |
| Curie-Weiss | 2..29, 1 | 45 | 216 | 216 | 0 | 4.7e-14 |
| sparse random graph (LP solution of the sum rule, kappa = 0) | 2..29, 1 | 10 | 216 | 216 | 0 | 4.9e-14 |
| far-coupled ({2,3,5,7} joined only to {11..29}) | 2..29, 1 | 10 | 216 | 216 | 0 | 5.4e-14 |
| Curie-Weiss, random unimodular twist | 2..29, 1 | 45 | 216 | 216 | 0 | 7.2e-14 |
| sparse, random unimodular twist | 2..29, 1 | 10 | 216 | 216 | 0 | 2.1e-14 |
| Curie-Weiss, sign twist | 2..29, 1 | 45 | 216 | 216 | 0 | 3.3e-14 |
| Curie-Weiss, deep | 2..7, 3 | | 250 | 250 | 0 | |
| Curie-Weiss, deep | 2..5, 6 | | 250 | 250 | 0 | |
| Curie-Weiss, deep | 2..11, 2 | | 250 | 250 | 0 | |
| random K >= 0, no sum rule (a_p in [0.244, 1.608]) | 2..19, 1 | 15 | 301 | 0 right of 1.609, 0 left of 0.243 | | |

In both sparse rows the eight smallest coefficients are exactly 1 and the largest weight is w(M) = M^{1/2} = 80434.4.

## 4. The no-go for the vanishing-coupling limit

### 4.1 Theorem 4 (control U passes every stage). PROVED-rel the character of `ap-global-bridge` Thm. C (Seip 2020, refereed there as known; not re-derived here).

Fix s_0 with 1/2 < Re s_0 < 1 and the completely multiplicative unimodular chi with L_chi(s) = sum chi(n) n^-s = E(s)/zeta(s - s_0 + 1), E analytic and zero-free in Re s > 1/2, so L_chi(s_0) = 0. Then for every M, every graph and every K >= 0 with the sum rule:
(a) every zero of Z_K^chi lies on Re s = 1/2 (Thm. 3(v));
(b) Z_K^chi is conjugate-self-dual with conductor M;
(c) for the Curie-Weiss stages, D_M^chi -> L_chi uniformly on Re s >= 1 + delta (3.2), with couplings tending to 0;
(d) the limit function has a zero off the line.

Corollary (the no-go). There is no valid implication of the form: "sites in the Lee-Yang class with unimodular activities at energies log p, pair couplings K >= 0 on any graph with the sum rule (hence all stage zeros on the critical line, at every height, using all primes of the stage jointly), couplings tending to 0, coefficientwise convergence with uniform convergence on Re s >= 1 + delta" implies "the limit has no zeros in Re s > 1/2". Any argument that passes from these stages to the limit must use arg chi(p) = 0, that is, the ordinary-integer structure or the functional equation of the limit. The stage-level functional equation does not help: it holds for chi as well (b).

By Hurwitz, a normaliser c_M (analytic, zero-free near s_0) with D_M^chi / c_M -> L_chi near s_0 cannot exist for U. For zeta, zero-free normalisers with D_M/c_M -> zeta locally uniformly on the strip would imply RH; none is constructed here, and the known choice c_M = D_M/zeta is circular (parent lane 5.2).

### 4.2 Theorem 5 (graph-independent support and density). PROVED from Thm. 3(vi) and ladder Prop. E(b); the mean-square remark is ARGUED.

A stage has (log M)/2 pi zeros per unit height at all heights; zeta has (1/2 pi) log(t/2 pi). They agree only near t = 2 pi M, which is also where the stage functional-equation factor M^{s-1/2} matches |chi(s)|^{-1}. At that height the stage contains at most (1 + o(1)) log M/log log M primes, and its coefficient support is the set of divisors of M, of size M^{o(1)}. The approximate functional equation at that height has length sqrt M, and "every n <= sqrt M divides M" fails for sqrt M >= 5 (lcm(1..5) = 60 > 25). The graph enters only the weights, never the support. So no choice of sparse graph changes the regime found by the ladder lane; the uniform-in-height statement of Thm. 3 is about a function that resembles zeta in at most one window, with a vanishing fraction of the mean square (ARGUED: sum over n | M, n < sqrt M of 1/n is O(log log M) against log M).

## 5. Task 2b: stage constants on the kernel side, hierarchical models, and the two meanings of "critical"

### 5.1 Theorem 6 (kernel-side stages are never in the class). PROVED; numerics `sites.log` sections 3-4, `euler_pole_zero.log`.

(a) Tails. The symmetrised Dirichlet stage kernel sum_{n<=N} n^{-1/2} [phi(u + l_n/2) + phi(-u + l_n/2)] equals -3 pi (sum_{n<=N} n^2) e^{-5|u|} (1 + o(1)) as |u| -> infinity (phi(v) ~ -3 pi e^{5v} as v -> -infinity; measured ratio 0.99999999 at u = 5 for N = 1). It is negative in the tails, so it is not a positive measure, and e^{t u^2} times it is not integrable for any t > 0. With full Euler factors the tails are of size e^{-|u|} (poles on Re s = 0, 1). The super-exponential decay of Phi is produced by the theta functional equation across all n and is absent at every finite stage.

(b) Dirichlet stages have infinitely many zeros on the real s-axis. Let g_N(s) = gamma(s) D_N(s) + gamma(1-s) D_N(1-s), D_N(s) = sum_{n<=N} n^-s. On an interval (2m-1, 2m+1), m odd, gamma(1-s) D_N(1-s) is negative and tends to -infinity at both ends. At s = 2m: gamma(2m) D_N(2m) >= pi^{-m} Gamma(m), and |gamma(1-2m) D_N(1-2m)| <= pi^{m+1/2} N^{2m}/Gamma(m + 1/2). The ratio tends to infinity, so g_N(2m) > 0 for all large odd m and the interval contains two real zeros. These are zeros of the stage at purely imaginary z. Measured first pairs: N = 1: s = 17.406145, 18.920519 (Im z = -33.81), then every odd m from 9 to 59; N = 2: from m = 17 (s = 33.7127, 34.8014); N = 3: from m = 27; N = 10: none below m = 60 (the threshold grows with N).

(c) Euler stages have zeros next to their poles on Re s = 1. With A = gamma(s) zeta_P(s), the stage A(s) + A(1-s) has, near each pole s_k = 1 + 2 pi i k/log p of A(1-s), a zero at s_k + delta_k, delta_k = gamma(1 - s_k) R_k/(log p * gamma(s_k) zeta_P(s_k)) (1 + o(1)), R_k the product of the other reflected factors at s_k; |delta_k| is of order (t/2 pi)^{-1/2}, and Rouche on a circle of radius 2 |delta_k| applies for large k because gamma(1-s)/gamma(s) varies by a factor 1 + O(|delta_k| log t) there. Measured (P = 2 and P = 5, k = 5 to 10^4): for example P = 2, k = 10^4: zero at distance 0.0061 from the pole, Re s - 1/2 = 0.4989. This turns the ARGUED remark 3 of ladder Thm. A into a proved statement for large k.

(d) Constants. For a stage with a non-real zero at t = 0 the set {t : H_t real-rooted} is empty: it is an up-set (K4), it does not contain 0, and t > 0 is undefined by (a). So Lambda(stage) = +infinity for every finite Dirichlet stage and every finite Euler stage. The stage constants do not tend to Lambda(Phi) in [0, 0.2].

Summary of "the de Bruijn-Newman constant of each stage and its limit":

| Object | Constant | Status |
|---|---|---|
| symmetrised Dirichlet stage N, kernel side | +infinity for every N | PROVED |
| symmetrised Euler stage P, kernel side | +infinity for every P | PROVED (large-k Rouche step in outline) |
| spin-side stage M (heat acting on the arithmetic factor only) | zeros on the line iff c = c* = 1/(2 log M), i.e. t* = 4 c* = 2/log M; zeros on Re s = c log M otherwise | PROVED |
| limit of t*_M | 0, from above | PROVED |
| Phi | 0 <= Lambda <= 0.2 | Rodgers-Tao; Platt-Trudgian |

The spin-side constant is not the de Bruijn-Newman constant of a completed function: the heat flow of the completed kernel also shifts the gamma factor term by term (row F2), and under the sum rule the completed spin-side stage gamma(s) Z_K(s) + gamma(1-s) Z_K(1-s) equals gamma(s) Z_K(s) (1 + [gamma(1-s)/gamma(s)] M^{s-1/2}) (PROVED, from the duality), whose second factor is the quotient of ladder Thm. A.

### 5.2 Proposition 7 (hierarchical models and criticality). PROVED / CLASSICAL as marked.

Lambda(rho) = inf{t : int e^{t x^2} e^{izx} d rho has only real zeros}.

(a) Semicontinuity (PROVED-rel Rodgers-Tao; this is parent Cor. 1(b) without a graph). If rho_N -> Phi with uniform exponential moments and all rho_N are in the Lee-Yang class, then no subsequence has Lambda(rho_N) <= -m < 0 (otherwise Hurwitz gives Lambda(Phi) <= -m). So Lambda(rho_N) -> 0 from below: every approximating sequence, on any graphs, loses its margin.

(b) Hierarchical block-spin maps (PROVED-rel Rodgers-Tao). A Dyson hierarchical recursion has the form rho_{n+1}(x) = C e^{(beta/2) x^2} (rho_n * rho_n)(kappa x) (or a K-fold convolution), beta > 0 (Bleher-Sinai / Collet-Eckmann normalisation, recalled). If rho_n is in the class then rho_{n+1} = e^{(beta/2) x^2} Psi with Psi in the class, so Lambda(rho_{n+1}) <= -beta/2. Hence every stage after the first, and every fixed point, has Lambda <= -beta/2 < 0. Phi is not in the image of such a map for any beta > 0, and is not a limit of images with beta bounded below in the scale of Phi. For beta = 0 the map is convolution and its fixed points with finite variance are Gaussian. Phi is not a fixed point of a hierarchical ferromagnetic renormalisation map.

(c) Curie-Weiss at the critical temperature (CLASSICAL: Simon-Griffiths 1973, Ellis-Newman 1978). N^{-3/4} sum sigma_i at J = 1/N converges to the density proportional to exp(-x^4/12), which is in Newman's class U: Lambda = -infinity. In the parent lane's scaled coupling m = J/lambda^2 this is m_N = N^{1/2} -> infinity. The pair couplings J_N -> 0, but the coupling measured in the scale of the statistic diverges.

(d) So "critical point of a ferromagnet" and "Lambda = 0" are opposite ends. Lambda(Phi) >= 0 requires the scaled coupling of any complete-graph approximant to tend to 0 (asymptotic freedom), while thermodynamic critical limits have it tending to infinity. For finite Ising ferromagnets with commensurate weights, Lambda < 0 iff all zeros are simple, and Lambda = 0 occurs exactly at a multiple zero (simple implies Lambda < 0: PROVED, a small backward heat step perturbs the coefficients of a real self-reciprocal polynomial with simple unit-circle roots, which keeps the roots on the circle; the converse is the simplicity of zeros for t > Lambda, CLASSICAL, Csordas-Smith-Varga, recalled). Independent components give Lambda = 0 through common zeros.

(e) The free end is excluded (PROVED given one floating-point evaluation). If Phi were the law of an independent sum of Ising spins plus a Gaussian, then Xi(z) = Xi(0) e^{-a z^2} prod cos(lambda_k z), and with every zero z_0 the point 3 z_0 would be a zero. |zeta(1/2 + 3 i gamma_1)| = 1.0838 (gamma_1 = 14.1347; mpmath). So Xi is not a free Ising product, with or without RH.

## 6. Task 3: controls

Stage statement tested: Thm. 3 with the sum rule ("all zeros of the stage on the critical line"), and its passage to the limit.

| Control | Site or coupling that leaves the class | Stage outcome | Status |
|---|---|---|---|
| DH | not a single ferromagnet: c_1 Z^chi + c_2 Z^{conj chi}, a sum of two ferromagnets with conjugate complex activities; sums do not preserve the class | fails at the first stage: primes {2,3}: 109 + 110 of 250 zeros farther than 0.05 from the line; {2,3,7}: 68 + 140; {2,..,19} without 5: 24 + 47 | MEASURED (`bohr_dh.log`; phase steps up to 1.5 on the near-line contours) |
| HEAT (backward) | the coupling: c < c* moves the line to Re s = c log M < 1/2 (sum rule violated); c < 0 is antiferromagnetic and the circle theorem fails | c = c*/2: all 300 zeros on Re s = 1/4; c = -c*: 109 zeros on each side of the line Re s = -1/2 | PROVED for the line; MEASURED |
| TW+, TW- with abs(eps_p) < 1 | activities eps_p p^-s: a_p = 1/2 + log abs(eps_p)/log p is not constant | zeros in the strip min a_p <= Re s <= 1/2: the one-sided conclusion "no zeros in Re s > 1/2" holds at every stage (0 zeros right of 1/2 in the test) | PROVED; MEASURED |
| sign twists eps_p = +-1 | none | pass (216 of 216 on the line) | PROVED; MEASURED |
| U (unimodular twist) | none | passes every stage; limit has a zero at s_0 | PROVED-rel Seip (Thm. 4) |
| E_a | the site: local polynomial (1 + p^{-s-a})(1 + p^{-s+a}) has roots of modulus p^{+-a}, two sub-sites with a_p = 1/2 +- a | passes while a^2 <= 1/(2 log M) (PROVED, de Bruijn strip contraction) and, measured, somewhat beyond; fails for larger M (MEASURED): a = 0.3, primes to 17: 28 + 28 of 250 off the line; a = 0.4, primes to 11: 101 + 101; primes to 17: 125 + 125. a = 0.1, 0.2 and a = 0.3 with primes to 11: 0 off the line | pass range PROVED; failure MEASURED |
| NR | the site at q: 1 + c z + z^2 with abs(c) > 2 has a root inside the unit circle | not run | PROVED as a statement about the site |
| B (Beurling) | none: Thm. 3 holds for any real energies l_q > 0 with the sum rule | passes every stage | PROVED |

Reading. The stage theorem separates zeta from DH, backward heat, E_a (for large M) and NR by a named site or coupling. It does not separate zeta from U, sign twists or Beurling systems, which are the controls without a functional equation; for those the only place to fail is the limit, and Thm. 4 shows the stage hypotheses cannot supply it. This is the same division as in the ladder lane (its Thm. A is passed by E_a and sign twists); the difference here is that the stage statement is exact at every height, and E_a is excluded at stage level.

For the kernel-side statements (Prop. 2, Thm. 6) there is nothing to separate: they hold for zeta and say that no representation of the proposed kind exists.

The three requirements. All primes together: met at stage level (every prime of M, jointly, through the sum rule). Uniform in height, every window: met at stage level (all zeros, all t). Fails for the controls for a named reason: met for DH, HEAT, E_a, NR; not met for U, sign twists, B. The conclusion about zeta itself is empty.

## 7. What remains outside

1. **Pair ferromagnets conjugate to u on sites unrelated to the Euler product.** Prop. 2 fixes the sites; Thm. 3-5 change them to prime spins. A representation of Phi as a limit of laws of sum lambda_i x_i for ferromagnets on other sites (Ising or Newman-class) is not excluded and no candidate is known. Necessary conditions that are known to hold for Phi: Lambda(rho_N) -> 0 (Prop. 7(a)); the GHS-type inequality (Newman 1991: Phi = e^{-V} with V' convex; recalled). A random search over 203,194 lattice measures with the Lee-Yang property and positive weights (degree <= 16) found none violating (log P(e^h))''' <= 0 (largest value -3.6e-8; `ghs_search.log`, MEASURED), so GHS does not obviously separate ferromagnet laws from the Lee-Yang class.
2. **Is every Lee-Yang measure a limit of pair-ferromagnet laws?** OPEN here. At fixed size the answer is no. PROVED example: the measure with weights (1, 0, e, e, e, 0, 1) on {-6, -4, ..., 6}, small e > 0, has all transform zeros real, and is not the law of sum lambda_i sigma_i for any finite Ising pair ferromagnet with hidden spins allowed: finite couplings give positive weight to all sign patterns of the visible clusters, the two largest atoms force every cluster size >= 2, and sizes (2,2,2) or (2,4) give no atom at 0. MEASURED (`inverse_ly.log`, multistart least squares, not a proof): with strictly positive weights (1, d, 0.3, 0.3, 0.3, d, 1), d = 0.001 and 0.01, and for 3 of 40 random Lee-Yang polynomials at each of N = 5 and N = 6, no ferromagnetic pair couplings on N unit spins (complete graph, hence any graph) reproduce the polynomial (residual 0.03 to 0.29); for N = 4 all 40 are reproduced by a chain. More spins with smaller weights are not covered by this test. If the closure is the whole class, a sparse-ferromagnet representation of Phi is equivalent to RH and carries no extra structure; if it is smaller, the representation is stronger than RH.
3. **Chains.** For N unit spins on an open chain with a_k = e^{-2 J_k}, the partition polynomial is P = w Q + Q*, where Q = Phi_{N-1} is generated by the Szego recursion Phi_n = w Phi_{n-1} + a_n Phi*_{n-1}, Phi_0 = 1 (PROVED: with A_n, B_n the partial sums with last spin up or down, A_{n+1} = w(A_n + a B_n), B_{n+1} = a A_n + B_n, B_n = A_n*, Phi_n = A_{n+1}/w). So a Lee-Yang polynomial is a ferromagnetic chain iff it has a decomposition P = wQ + Q* in which Q has all Schur-Cohn parameters in [0, 1); the solutions Q form the affine family P'/N + R, R antisymmetric. The continuum form of this is a canonical system with a sign condition on its coefficients. It was not pursued: it is the de Branges structure-function setting, where RH is the Hermite-Biehler property and the sign condition is an additional unknown.
4. **Non-pair or non-product structures on the spin side.** Many-body ferromagnetic interactions (no general Lee-Yang theorem), and state spaces that are not divisor-closed (ladder Prop. E(d), undecided).
5. **A limit argument that uses the functional equation of the limit.** Thm. 4 shows this is the only kind left on the spin side. No mechanism was found. The stage conductor M and the archimedean factor agree only at t = 2 pi M.

## 8. Three weakest steps

1. **All zero counts are float64 argument-principle counts, not certified.** Off-line counts are differences of two counts or windings on contours 0.001 to 0.05 from a line carrying zeros; the DH rows have phase steps up to 1.5 radians and should be read as "many zeros off the line", not as exact numbers. The E_a pass/fail boundary (between a = 0.2 and 0.3 at primes to 17) is located only by these counts. Thm. 3 itself does not depend on the numerics.
2. **Thm. 4 depends on a cited character and is a statement about a class of hypotheses.** The existence of chi (Seip 2020) is taken from `ap-global-bridge` and its referee, and was not re-derived or opened. The corollary excludes arguments that use only K >= 0, the moduli of the activities, the stage duality and convergence on Re s > 1; it does not exclude an argument that uses arg chi(p) = 0. Convergence to the limit is proved on Re s > 1 only for the Curie-Weiss member along divisibility-cofinal M; for sparse graphs only Re s > 3/2 under an extra condition. The Rouche step of Thm. 6(c) is given in outline with a measured table.
3. **Scope.** Prop. 2 is rigid only for the Euler sites and the archimedean density phi; it says nothing about other sites. The general-graph part of Thm. 3 is proved at depth 1 (the Curie-Weiss member at every depth); general graphs at higher depth would need Griffiths' spin-S representation and were not done. Section 7 item 2 is measured by local optimisation at N <= 6 and decides nothing about limits. Recalled and not opened: the lattice-gas form of the Lee-Yang theorem, Polya-de Bruijn universal factors, the Polya/Langer zero count, Newman 1991, Ellis-Newman 1978, Simon-Griffiths 1973, Rodgers-Tao. Prop. 7(e) uses one mpmath value of zeta, not an interval enclosure.

## 9. Files

All under `tmp/research-2026-11-16/push/res-sparse-ferromagnet/`. Every run went through `scripts/memcap.sh 8`, single process, local; largest allocation 262 MB (printed by the scripts); longest run 3 min 42 s. The compute server was not used.

- `bohr_stage.py`, `bohr_stage.log`, `bohr_stage.json`: Thm. 3 checks (Curie-Weiss, sparse, far-coupled, twists, no sum rule, half and negative coupling, non-unimodular twist).
- `bohr_controls.py`, `bohr_controls_lib.py`, `bohr_controls.log`, `bohr_controls.json`: deep ladders, E_a, convergence table. The DH rows of this log are superseded by `bohr_dh.log` (the first run used contours 0.002 from the line with phase steps above 2).
- `bohr_dh.py`, `bohr_dh.log`, `bohr_dh.json`: DH stages.
- `sites.py`, `sites.log`: Thm. 1, kernel tails, real zeros of Dirichlet stages, zeta(1/2 + 3 i gamma_1), Curie-Weiss critical density. Section 5 of this log (Newton from the pole) is superseded by `euler_pole_zero.log`.
- `euler_pole_zero.py`, `euler_pole_zero.log`: Thm. 6(c).
- `ghs_search.py`, `ghs_search.log`, `ghs_search.json`; `inverse_ly.py`, `inverse_ly.log`, `inverse_ly.json`: section 7 items 1-2.

# Referee report: res-sparse-ferromagnet

Date: 2026-11-17. Adversarial referee. Inputs read: `BRIEF.md`, `OBSTRUCTION_MAP.md` section 2, `RESULT.md`, the lane's scripts and logs, `ap-global-bridge/RESULT.md` Thm. C and its `REFEREE.md`.
All referee numerics were run locally through `scripts/memcap.sh` (cap 4 GB, largest planned chunk 32 MB, float64 or mpmath 20-30 digits; nothing is interval-certified). The compute server was not used. Referee scripts are in `/tmp/ref-sparse/` (not part of the record).

## Verdict

- The lane's verdict (precise obstruction; no information about any zeta zero; no bound moves) is correct.
- Items (1), (2), (3) of the claim and the control table are confirmed (re-derived and re-measured).
- Item (4) is **not confirmed as stated**. Two PROVED labels do not hold as written:
  - Thm. 6(d), "Lambda = +infinity for every finite Dirichlet stage": the derivation is invalid for N = 1 (section 2.6).
  - Prop. 7(b), "every fixed point of a hierarchical map has Lambda <= -beta/2" and "Phi is not a fixed point / not in the image": proved only for fixed points and pre-images inside the Lee-Yang class (section 2.7).
- By the rule "holds = false if a PROVED step cannot be confirmed", the claim as worded does not hold. The surviving claim is stated in section 6.

## 1. Numerical re-verification (independent code)

Method: zeros located by Newton iteration from a grid (sigma step 0.02, t step min(0.02, 0.25/log M)) in the box -2 < Re s < 3, counted against (log M) T / 2 pi. This is a different method from the lane's argument-principle counts.

| Object | Lane | Referee |
|---|---|---|
| DH stage, primes {2,3}, 0 < t < 876.7 | 250 zeros; 109 + 110 beyond 0.05 | 250 zeros found; 109 right + 110 left beyond 0.05; **none** within 1e-6 of the line; Re s in [0.2455, 0.7545] |
| DH stage, primes {2,3,7}, 0 < t < 420.3 | 68 + 140 | 250 found; 68 + 140; Re s in [-1.4836, 0.9297] |
| single-character stage (chi mod 5), same primes | on the line (Thm. 3(v)) | 250 of 250 on the line, max deviation 1.7e-13 |
| sparse sum-rule graph, primes 2..23, 9 edges, kappa = 0 (three random LP solutions) | on the line | 184, 183, 184 found (expected 183.6); max deviation 1.8e-13 |
| same with a random unimodular twist | on the line | 182, 185, 184 found; max deviation 1.2e-13 |
| Curie-Weiss, c = c* | on the line | 184; 6.6e-14 |
| Curie-Weiss, c = c*/2 | on Re s = 1/4 | 184; 1.4e-13 from 1/4 |
| Curie-Weiss, c = -c* | zeros on both sides of Re s = -1/2 | 128 of 167 found off that line |
| E_a, a = 0.4, primes to 11 | 101 + 101 off (threshold 0.002) | 201 of 249 off (1e-6); 95 + 95 beyond 0.05; Re s in [0.315, 0.685] |
| E_a, a = 0.3, primes to 11 | 0 off | 0 of 250 off |
| E_a, a = 0.3, primes to 17 | 28 + 28 off | 55 of 249 off; 12 + 12 beyond 0.05 |
| E_a, a = 0.2, primes to 17 | 0 off | 0 of 250 off |
| Thm. 1(a) zeros | Re s = 1.7716 (p = 2), 1.1497 (p = 101) | 1.771553, 1.149652; residual 1e-30 |
| Thm. 6(b), N = 1 real zeros | 17.406145, 18.920519 | 17.4061448709, 18.9205194007; g_1(2m) < 0 for m = 1,3,5,7 and > 0 at m = 9 |
| Thm. 6(b), N = 2 | 33.7127 | 33.7127172741 |
| Thm. 6(c), P = 2, k = 10^4 | distance 0.0061, Re s - 1/2 = 0.4989 | zero at 0.998896 + 90647.2088 i; distance 0.006067 (leading-order prediction 0.006006); Re s - 1/2 = 0.498896 |
| Prop. 7(e) | abs zeta(1/2 + 3 i gamma_1) = 1.0838 | 1.083788 |

Additional referee test (not in the lane): replacing one edge of a sum-rule graph by an antiferromagnetic edge K = -0.6 while keeping a_p = 1/2 through kappa (so the duality still holds) gives 26 to 33 of about 183 zeros off the line, Re s in [-0.03, 1.03]. So K >= 0 is used, and the duality alone does not give the line. This supports the "antiferromagnetic" row of the control table.

Notes on the control measurements.
- The DH counts are reproduced exactly. For primes {2,3} the stage has no zero on the line at all in the window. The DH stage is not self-dual: n -> M/n maps it to the stage with kappa -> -kappa, so the off-line zeros of the stage are not mirror pairs of one function. The 109 against 110 is consistent with this.
- The E_a pass range is correct: the stage has total log-degree 2 log M, heat time c = 1/(4 log M), and de Bruijn's strip contraction gives half-width sqrt(max(a^2 - 2c, 0)) with 2c = 1/(2 log M). The measured pass at a = 0.3, primes to 11 (bound 0.16, measured 0) shows the bound is not sharp; this is stated by the lane.
- T-NR was not run by the lane and was not run here. The row is a statement about the site only.

## 2. Re-derivation of the PROVED steps

### 2.1 Thm. 1 (symmetrisations). Confirmed.
(a) With a = p^-s, b = p^(s-1), ab = 1/p and w = p^(1/2-s): a + b = p^(-1/2)(w + 1/w), so a + b = 2 iff w + 1/w = 2 sqrt p. The numerator 2 - a - b equals -p^(-1/2)(2 cosh((s - 1/2) log p) - 2 sqrt p). cosh((log p)/2) = (sqrt p + 1/sqrt p)/2 < sqrt p, so the zeros are outside the closed strip. (b) (1-a)(1-b) = 1 + 1/p - 2 p^(-1/2) cos(z l_p/2); the convolution weights p^(-abs(m)/2)/(1 - 1/p) are correct. (c) correct.

### 2.2 Prop. 2 (rigidity). Confirmed within its stated class.
The kernel formula, the identity n^(-1/2) phi(u + l_n/2) = n-th term of Phi, the ratio bound and the induction are correct. The tail sum tends to 0 because (m^2 - n^2) >= m^2 (2n+1)/(n+1)^2 dominates C m^2 once e^(4u) is large. The values n = p, p^k, pq give J_0p = 0, nu_p(k) = p^(-k/2), J_pq = 0.
Scope that the summary sentence omits: spins fixed at x_p = -k_p log p / 2, statistic with unit weights, bilinear couplings only, sup abs(J_0p) finite, c(n) <= e^(C n^2). "Any graph and any sign" is correct inside this class. It says nothing about other spin assignments on the same index set.

### 2.3 Thm. 3. Confirmed.
- (i) The change n_p = (1 + sigma_p)/2 gives Ising couplings K_pq/4 and e^(2 h_p) = e^(kappa_p + r_p/2) p^-s. The multivariate circle theorem (Lee-Yang; Ruelle) gives non-vanishing when all moduli are < 1 or all > 1. The theorem needed is the multivariate form with unequal complex activities, not the one-variable form; the lane's "CLASSICAL" label is acceptable.
- (ii)-(iii) w(M/n)/w(n) = (M/n^2)^a checked by the cut identity; duality and w(n) <= n^(1/2) follow.
- (iv) kappa_p + r_p/2 = l_p/2 checked. Shift identity e^(cD^2)[e^(-as) g](s) = e^(-as + c a^2)(e^(cD^2) g)(s - 2ca) checked on exponentials; with a = L/2 and c = 1/(2L) the shift is 1/2. The general-depth case uses the Polya-de Bruijn universal factor for a finite real exponential sum with real zeros; correct.
- (v) correct; the conjugate duality was re-derived.
- **Wording error (minor).** The Curie-Weiss member does not satisfy the sum rule "sum_{q != p} K_pq = log p with kappa = 0" of (iii). It has r_p = log p - (log p)^2/log M and kappa_p = (log p)^2/(2 log M). It satisfies the general condition a_p = 1/2, equivalently the sum rule with the diagonal term K_pp = (log p)^2/log M included. The verdict item 3, Thm. 4 and the claim text call it a member of the sum-rule family. The theorem is unaffected.

### 2.4 Section 3.2 (convergence, divergence). Confirmed.
The three ranges (n <= X; X < n <= M^eta with eta < 2 delta; n > M^eta by convexity and d(M) = M^(o(1))) are correct, with the missing terms n not dividing M handled by divisibility-cofinality. Target zeta(3)/zeta(6) = 1.18156 checked.

### 2.5 Thm. 4 (control U). Confirmed, with an attribution correction.
- (a), (b), (c) follow from Thm. 3(v) and 3.2. (d) follows from `ap-global-bridge` Thm. C: zeta_chi(s) = exp(h0 + R + h)/zeta(s - s0 + 1), meromorphic in Re s > 1/2 with a simple zero at s0. That theorem is an explicit elementary construction proved and refereed in that lane.
- **Attribution.** RESULT.md cites "Seip 2020" for the form L_chi = E/zeta(s - s0 + 1) at every s0 with 1/2 < Re s0 < 1. Seip's unconditional theorem (arXiv:1812.11729, abstract and secondary sources checked) prescribes zeros only in 1/2 < Re s <= 39/40; the whole half-critical strip there needs RH. The statement used here is Thm. C of `ap-global-bridge`, not Seip's theorem. For 39/40 < Re s0 < 1 the dependence is on the in-house construction alone.
- **Strength.** The corollary excludes limit arguments that use convergence on Re s >= 1 + delta only. Such an argument cannot reach the strip for any function (Hurwitz needs locally uniform convergence near the zero), and 3.2 already shows the stages diverge on (1/2, 1]. The no-go is correct and close to trivial. It does not exclude a normalised limit in the strip; for U such a normaliser is excluded by Hurwitz, for zeta it is equivalent to RH, as the lane says.

### 2.6 Thm. 5 and Thm. 6. (a)-(c) confirmed; (d) not confirmed for Dirichlet stages.
- Thm. 5: correct. lcm(1..floor(sqrt M)) > M for sqrt M >= 5 checked.
- 6(a): phi(v) ~ -3 pi e^(5v) at -infinity gives the stated tail; correct.
- 6(b): signs of gamma(1-s) on (2m-1, 2m+1) for odd m, the bound abs(gamma(1-2m)) = pi^(m+1/2)/Gamma(m+1/2), and the ratio argument are correct. Zeros reproduced.
- 6(c): the leading-order formula for delta_k is correct and matches the computed zero to 1 percent at k = 10^4. The Rouche step is an outline (the lane says so).
- **6(d) is invalid as written for Dirichlet stages.** The kernel has tails e^(-5 abs(u)), so H_0 is a Fourier integral only for abs(Im z) < 5, that is -2 < Re s < 3. The real zeros of 6(b) are at s >= 17.4, that is abs(Im z) >= 33.8: they are zeros of the meromorphic continuation, outside the strip of convergence. The step "the set {t : H_t real-rooted} is an up-set and does not contain 0, hence contains no t < 0" needs H_t -> H_0 locally uniformly near an off-line zero, which holds only inside the strip.
  Referee count (mpmath, 20 digits, argument principle): for N = 1, the function s(s-1) g_1(s) has 14 zeros in -1.9 < Re s < 2.9, 0.01 < t < 60.3 and **0** with Re s > 0.501. So in that window the N = 1 stage has no off-line zero inside the Fourier strip, and the Hurwitz step has nothing to act on. For N = 2, 3, 5, 10 the same count gives 1, 4, 4, 5 zeros right of 0.501 (inside the strip), so for those N the step is available, relative to float counts.
  Consequence: "Lambda = +infinity for every N" is not proved for N = 1 (and for any N whose strip zeros are all on the line). Whether H_t for the N = 1 stage is real-rooted for some t < 0 is not decided here; a float64 attempt was under-resolved and is discarded. The Euler-stage half of (d) is not affected in the same way at large k: the zeros of 6(c) at k = 10^4 lie at Re s = 0.9989, inside the strip 0 < Re s < 1 (at k = 5 and k = 100 they lie at Re s = 1.18 and 1.04, outside it).
  The statement "every kernel-side finite stage has zeros off the line" is true for the continued function. The statement "the stage constants are +infinity" should carry the label PROVED only for stages with an off-line zero inside the strip of convergence.

### 2.7 Prop. 7. (a), (c), (d), (e) confirmed; (b) overstated.
- (a) correct (Hurwitz plus Rodgers-Tao); the hypothesis that the approximants are in the class already presupposes RH for the limit.
- **(b)** The step "rho_n in the class implies Lambda(rho_(n+1)) <= -beta/2" is correct. The conclusions "every fixed point has Lambda <= -beta/2", "Phi is not in the image of such a map" and "Phi is not a fixed point" follow only when the fixed point, or the pre-image, is in the Lee-Yang class. A fixed point outside the class is not covered. For Phi this makes the exclusion conditional: if RH holds Phi is in the class and the contradiction with Lambda >= 0 follows; if RH fails the argument gives nothing. The unconditional sentences are not proved. The claim text "hierarchical fixed points have Lambda <= -beta/2" needs "in the Lee-Yang class".
- (d) the perturbation argument for simple roots is correct for commensurate weights; the converse is cited.
- (e) the 3 z_0 argument is correct; value reproduced. One float evaluation, as stated.

## 3. Cited theorems against their hypotheses

- Lee-Yang circle theorem: used in the multivariate form with unequal complex activities and couplings K/4 >= 0. Hypotheses met. Not valid for K < 0 (referee test in section 1 shows zeros leaving the line).
- Polya-de Bruijn universal factor: applied to a finite exponential sum with real zeros and to forward time c >= 0. Hypotheses met.
- de Bruijn strip contraction (E_a): applied to a finite exponential sum. Hypotheses met.
- de Bruijn monotonicity (K4) in Thm. 6(d): applied to a kernel with exponential tails, where the t = 0 transform is not entire. Hypotheses not met at the endpoint; see 2.6.
- Polya/Langer zero count: standard for real frequencies with both extreme terms present. Met.
- Rodgers-Tao (Lambda >= 0): used in 7(a), 7(b). Met where the class hypothesis is assumed.
- Seip 2020: see 2.5; the statement used is stronger than Seip's unconditional range and comes from `ap-global-bridge` Thm. C.
- Simon-Griffiths, Ellis-Newman, Newman 1991, Csordas-Smith-Varga: recalled by the lane, not opened; not opened here either. Nothing in the verdict depends on them.

## 4. Controls (map section 2, Q1)

| Control | Lane's statement | Referee |
|---|---|---|
| DH | fails at the first stage; sum of two ferromagnets | confirmed (counts reproduced exactly) |
| HEAT | c < c* moves the line; c < 0 antiferromagnetic | confirmed (c*/2 and -c* re-measured) |
| TW with abs(eps_p) < 1 | a_p not constant; zeros in min a_p <= Re s <= 1/2 | follows from Thm. 3(i); not re-measured |
| sign twists, U, Beurling | pass every stage | confirmed for a random unimodular twist; follows from Thm. 3(v) |
| E_a | passes for a^2 <= 1/(2 log M); fails for larger M | confirmed at four parameter points |
| T-NR | site root inside the circle; not run | not run; site statement only |

The stage theorem is passed by U, whose limit has a zero in the strip. So the stage theorem carries no zero-location information for the limit, which is what the lane concludes. The DH "failure" is a failure of a statement about stages, not of an argument toward RH; no argument toward RH is offered.

## 5. Novelty

- Thm. 3 is the multivariate Lee-Yang theorem evaluated on the line z_p = p^-s. The same mechanism (Lee-Yang polynomials restricted to a torus line give exponential polynomials with zeros on a line) is the basis of Kurasov-Sarnak's stable-polynomial construction of crystalline measures (recalled, not opened). The sum rule, the self-duality and the identification of the Curie-Weiss member with heat time 1/(2 log M) are short consequences. One web search for the statement in the Dirichlet-polynomial form found no source; this is not a literature review. Treat as a corollary of known theorems, new only as a campaign record.
- Thm. 1 and Prop. 2 are elementary; no source was found or expected.
- Thm. 4 rests on a known type of character (Seip; `ap-global-bridge` Thm. C). The corollary is new only as a table entry.
- Thm. 6(b) (real zeros of the continued Dirichlet stages) is elementary; not searched.

## 6. What survives

Surviving claim: No information about any zeta zero; no bound moves. Proved: (1) within the class of Prop. 2 (spins -k_p log p/2, bilinear couplings, bounded archimedean couplings, c(n) <= e^(C n^2)) the free model is the only pair model reproducing Phi; (2) Thm. 1 as stated; (3) for any graph on prime spins with K >= 0 and a_p = (kappa_p + (1/2) sum_q K_pq)/log p = 1/2 for all p, the stage polynomial is self-dual with all zeros on Re s = 1/2, also under unimodular twists; the Curie-Weiss member has kappa_p != 0 (or a diagonal term) and heat time 1/(2 log M); (4) every symmetrised finite Dirichlet stage has real zeros s >= 17.4 of its meromorphic continuation, and Euler stages have zeros next to the poles on Re s = 1 (outline plus measurement); a hierarchical step maps the Lee-Yang class into Lambda <= -beta/2. The control statement is confirmed for DH, backward heat, E_a, and unimodular twists.

## 7. What the result does not cover

1. Pair ferromagnets on sites other than the Euler sites, and other spin assignments on the prime index set (Prop. 2 fixes x_p = -k_p log p/2).
2. General graphs at depth > 1 in Thm. 3 (only the Curie-Weiss member is proved at every depth).
3. Many-body ferromagnetic interactions and state spaces that are not divisor-closed.
4. Any limit statement in the strip for zeta. Convergence is proved on Re s >= 1 + delta only (Curie-Weiss, divisibility-cofinal M); for sparse graphs on Re s > 3/2 under an extra condition.
5. The de Bruijn-Newman constant of the N = 1 Dirichlet stage and of any Dirichlet stage whose zeros inside -2 < Re s < 3 are all on the line (section 2.6).
6. Hierarchical fixed points outside the Lee-Yang class; hence no unconditional statement that Phi is not such a fixed point (section 2.7).
7. Whether the closure of pair-ferromagnet laws is the whole Lee-Yang class (left OPEN by the lane; the N <= 6 optimisation in its section 7 decides nothing).
8. T-NR at stage level (not run by the lane or the referee).
9. Certification: every zero count, by the lane and by the referee, is float64 or fixed-precision mpmath.

## 8. Required corrections to RESULT.md

1. Thm. 6(d) and the constants table: restrict "+infinity, PROVED" to stages with an off-line zero inside the strip of convergence; mark N = 1 as not decided, with the count 14 on-line, 0 off-line for t < 60.3.
2. Prop. 7(b) and verdict item 7: add "in the Lee-Yang class" to the fixed-point statement; mark "Phi is not a fixed point" as conditional on RH or remove it.
3. Verdict item 3 and Thm. 3(iii)-(iv): state the condition as a_p = 1/2 (sum rule with kappa, or with the diagonal term); the Curie-Weiss member is not a kappa = 0 sum-rule member.
4. Thm. 4: cite `ap-global-bridge` Thm. C for the character; cite Seip for the general phenomenon with its unconditional range Re s <= 39/40.
5. Section 1 "not in those sources": add that Thm. 3 is a corollary of the multivariate Lee-Yang theorem and name the Kurasov-Sarnak mechanism as adjacent prior work.

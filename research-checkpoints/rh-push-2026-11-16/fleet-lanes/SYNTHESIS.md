# Final ledger: direct push campaign (2026-11-16), rounds 1 and 2

Scope: 36 ledger rows (22 round-1, 14 round-2), each with a referee report at
`tmp/research-2026-11-16/push/<slug>/REFEREE.md` and a result at `<slug>/RESULT.md`.
Inputs read for this file: BRIEF.md, CRITIC_R1.md, the 36-row ledger with referee outcomes. The RESULT.md and
REFEREE.md files were not re-read; every statement below is the referee's "surviving" text, not the author's claim.
Rows from other lanes in this directory (b-*, g-*, h-*, sq-*, stack-*, r3-*, the seven unrefereed outside agents) are
not part of this ledger.

Counts: 0 rows prove eta > 0 for TRO6-natural, a zero-free abscissa below 7/8 (kernel-checked) or below
0.874886647 (preprint level), or any new statement about zeta zeros. 20 referee reports found no failed PROVED
step; 16 found at least one. One number moved, conditionally: Lambda <= 0.116059817097268 (section 1.1).

Labels: PROVED = re-derived or independently rerun by the referee. PROVED-rel X = proved relative to the cited
unrefereed statement X. MEASURED = numerical, not interval-certified unless stated. All paths below are relative to
`tmp/research-2026-11-16/push/`.

Standing dependencies used below:
- (ZF78) zero-free half-plane Re s > 7/8: Lean-checked locally (section 1.2).
- (ZF-XS) Re s > 0.874886647: unrefereed preprints (Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835).
  Not kernel-checked. Parts hand-checked in 1.2; several lemmas still open.
- (RAY) Raymond's chain and paper hypotheses (H2)-(H4) for the Lambda conversion: unrefereed; tables W, FC, CE, J, K
  not verified.
- (MS) the sextic manuscript's Lemmas 4.4, 4.7, 9.1, 14.3, 15.1, 15.2, 18.1 and proof note (3.9), as stated.

---

## 1. Established and referee-surviving results

### 1.1 Lambda (conditional; accepted bound stays Lambda <= 0.2)

| Statement | Depends on | File |
|---|---|---|
| Lambda <= 29014954274317/(2.5e14) = 0.116059817097268, re-optimised run, 0 failures over 59423 substeps in three checkers (one independent, exact rationals). | zeta(s) != 0 for Re s > 874886647/10^9 exactly (ZF-XS); (H2)-(H4); kernel row (3/5, 4987/2500, 93/400) (float grid check only). | r2-lambda-reopt-run |
| The run above is tuned to its exact theta. At the repository's documented abscissa B = 0.87488665 (and at B* = 0.8748866496166) its modes fail admissibility at substep 605. There, only the fixed-mode replay value 0.116060108665412 stands. | same | r2-lambda-reopt-run |
| Fixed-mode replay of archived F2 run: Lambda <= 0.116060107834762 at theta = 0.874886647; 0.116091488672439 at 7/8 (reproduces the prior value); slope dLambda/dtheta = 0.2768 for the fixed-mode barrier. Independent exact-rational re-implementation. | ZF-XS, (H2)-(H4) | lambda-from-halfplane |
| Raymond's chain alone: 0.118473587983093 at 0.874886647. | RAY; reproduced by rerunning a copy of the author's script, no third implementation | r2-lambda-reopt-run |
| Table values reproduced: theta = 0.87: 0.114686652134445; theta = 4/5: 0.093069284680992 (these use floor entries and kernel rows outside F2's lists, not examined). | hypothetical theta; RAY | r2-lambda-reopt-run |
| Lemma H: Theorem 4.2 holds per substep, so the two-height cell 322 is covered; one-height variant gives 0.116059822328895. | RAY | r2-lambda-reopt-run |
| Far-field cap: any positive probe-measure chain with pointwise kernel domination has sum w_i h_i <= 2y (lambda <= 2). | none | lambda-from-halfplane |
| Theorem C: for a finite signed probe measure with all h_i > y, kernel domination on 0 <= b <= y holds iff r_w(d) = 4y/(d^2+4y^2) - sum w_i K_{h_i}(d-x_i, y) >= 0 on R; certificate -y' >= sum w_i S_i + r_w(0); necessary sum w <= 1, sum w h <= 2y. | none | r2-lambda-tpos-floors |
| Class ceiling (C5): a certificate whose floors also hold on a same-height lattice of pair density L_c/2pi has -y' <= L_c coth(y L_c). With L_c = L: time >= 0.0962. With the floors in hand (<= 6.12): about 0.103-0.104. Independent of the barrier. | none | r2-lambda-tpos-floors |
| Range-split t = 0 floor S >= L + zeta'/zeta/2 + Delta/2 for x >= X-8, Delta = 0.199/0.184/0.166/0.139 at h = 1.5/1.5443/1.6/1.7. Lemma PROVED; constants computer-assisted in floating point, single implementation, k = 34 run not independently rerun. | verified height X | r2-lambda-tpos-floors |
| t = 0 start rate for a simple top zero with y^2 = 0.5625001: >= 12.043 (exact Sturm + 40-digit values, reproduced); 12.070 with the floating-point alignment term. F2 start rate: 11.008. | verified height X | r2-lambda-tpos-floors |

Not established here: any Lambda value from t > 0 probe measures (0.1085-0.1125 are MEASURED/HEURISTIC).

### 1.2 Verification of the zero-free inputs

| Statement | Depends on | File |
|---|---|---|
| Lean: the zeta, Dirichlet and OAI-defined Hecke-family 7/8 theorems and five Main78 theorems depend only on propext, Classical.choice, Quot.sound; no sorry/axiom in the 2924-module closure; olean hash matches the 2026-10-07 build. | Lean kernel; Mathlib | zf-audit-inputs |
| leanchecker replay: 2924/2924 closure modules exit 0 (from logs; closure recomputed). Mathlib, LeanCert and two external packages not replayed. | — | r2-lean-kappa-1318 |
| In a clone: terminal_certificate holds under 2/3 <= kappa together with 2*beta-1 <= kappa; unconditional only for kappa >= 3/4; at kappa = 29991/40000 conditional on the unformalised stage-0 bound beta <= 69991/80000. Modified cone 277/277 modules exit 0. 7/8 theorem statements unchanged. | Lean; clone only | r2-lean-kappa-1318 |
| OAI Hecke LFunction = sum_I chi(I)N(I)^-s = Mathlib LSeries on Re s > 1; unique holomorphic continuation on C\{0,1}; equals Mathlib dedekindZeta on Re s > 1 for modulus (1). | Lean | r2-lean-kappa-1318 |
| LeanCert H and Lambda match the standard definitions (by reading); H_0 = xi/8 is a Lean theorem. | reading | r2-lean-kappa-1318 |
| Xu-Sang certificate (40) at both stages; exponent algebra (12), (17), (21), (23), (26), (28); all admissibility conditions including (29); Appendix A inequalities down to kappa = 13/18. | MS text | zf-audit-inputs |
| Xu-Sang Prop 3.1 low-estimate exponents for 1/6 < l <= 1/5: row norm Z^{M'+(5l+d-1)_+/4}; inequality (17) holds iff l <= 1/5; r_* in [3/5,1], t-r_* in [1/3,1/2] for 0 <= c <= 1. Arithmetic of Appendices B, C, E correct (match to source by reading). | MS Lemma 14.3, Prop 15.2 as stated | r2-xs-lowestimate-audit |
| Liu II Lemma 14.10 as a scalar statement (Arb, 30001 boxes): B_flat = 0.874886647039964130944614...; F_flat(13/18) = 0.874843412008167274...; F_flat increasing on [13/18,1] as a function (not an attainable bound below kappa_flat). | Liu 2610.26835 formulas | r2-xs-lowestimate-audit |

Status of abscissae: kernel-checked 7/8. Hand-checked given manuscript statements plus READ steps (C.3 contours,
Appendix B Sobolev step, Appendix F ordering): 0.8748875 (stage 0), 0.8748867 (stage 1). Open: MS Lemmas 14.3,
15.2, 18.1 at the new geometry; Liu II Lemma 14.11; Xu-Sang B_0, B_1 in Lean; ray-class/primitive identification;
Raymond W, FC, CE, tables J, K.

### 1.3 The zero-free method (what moves B_flat)

| Statement | Depends on | File |
|---|---|---|
| In the decoupled scalar system with twist-family supremum beta_M in [0.74, B_flat], every refined step yields B(l) >= beta_M. Target and field enter no exponent: restricting to zeta or varying F changes nothing. | Liu Lemma 14.10 (unrefereed) | zf-hecke-all-fields |
| Binding class: about U^0.590 sextic twists of norm Z^0.794 with a zero at real part 0.7347, amplitude x = 1/2, plus kappa = 2*beta-1. A count saving U^-tau at that class moves B by about -0.137 tau (rerun: -0.138). | same | zf-hecke-all-fields |
| Guth-Maynard bound >= mean-value bound for sigma <= 7/10; both binding bins of the 7/8 manuscript (delta* = 0.386638, 0.388584) are unaffected, gain exactly 0 (via family GM-shape count >= 4/3 - 5 delta/3 > R* at x = 1/2). Lemma 15.1 is a mean square, not improved by a GM-shape level-set bound. | MS formulas | zf-large-values |
| N-uniform phase-blind hybrid inequality over a target set has constant >= max_eta sum_{u in B} \|D_u(eta)\|^2: no gain over single-target Cauchy-Schwarz. | Liu 2610.26835 | r2-zf-critical-density |
| General (KD)^{2/3} sextic large sieve gives >= min(1-delta/2, 2-2delta): 0.7653 > 0.5903 at the critical class. Max-over-pairs Halasz-Montgomery gives nothing for delta < 1/2. | large sieve shape recalled, not re-read | r2-zf-critical-density |
| Cubic-trace/Halasz expansion (E1)-(E3), (E5), (E6): proved bounds for S2, S3 exceed the mean-value budget (S2 by U^0.338 to U^0.578); pairwise Lindelof still leaves a required saving U^{3r(1/2-delta)} in S3. S/n <= delta for every counted polynomial; C4 row unsupported by Lemma 9.1 beyond bare M_r, unused. | MS Sections 17-19 | r2-zf-gm-inverse-witness |
| Row-order identity, all r >= 3: mu(pi) g(chi) = (-J(chi,rho)) g(chi rho)/g(rho); ord(chi rho) = nu(r) = r (4\|r), r/2 (r = 2 mod 4), 2r (r odd); nu an involution; nu(r) = 3 iff r = 6. | none | zf-higher-rows |
| Product row families: Theorem A (union of translates of pure families), Lemma B (trivial rows <= H_i^{1/r_i} per fibre, <= (H_1...H_j)^{1/2+eps} total; density 1/2 only for conjugate pairs or quadratic components); a conjugate pair cancels the Gauss sum at primes and squarefree moduli. | none | r2-zf-paired-rows |
| Framework A abscissae: >= 7/8 + l2/8 for (4,4); >= 7/8 + 3 l2/8 for (4,12), order-4 variable Poissoned; >= 23/24 + l1/8, order-12 variable Poissoned; >= 1 with two Poissoned variables. | open optimal quartic input; Framework A only | r2-zf-paired-rows |

### 1.4 TRO6 (sextic theta against cubic rows): exact identities and measurements. No eta > 0.

| Statement | Depends on | File |
|---|---|---|
| Lemma L: for squarefree primary c, gamma_2(c) chi_c(m) = mu(c) alpha(c) G(c) conj(g~(m,c)); 172 moduli by independent code. First identity already in the manuscript. G is a mod-4 class function with G(vw) = G(v)G(w)R(v,w), not a character; G = psi_3 times a 4-term combination of quadratic characters mod 4; G^2 is a character. | MS (4.7) | tro6-period, r2-tro6-type12-split |
| Split: for coprime primary a, b prime to 6, g~(m,ab) = R(a,b) g~(m,a) g~(m a^4,b); hence k_e(m;ab) = R^{e+1} k_e(m;a) k_e(m a^4;b). Two independent codes, errors <= 8.3e-14, non-squarefree b included. Manuscript row weight at n = 1 is alpha^2 G^2 nu. | MS (4.7) | r2-tro6-type12-split |
| Polar law (Theorem P): for squarefree primary c prime to 6, N(c) <= Q^{1/2-delta}: sum_m W(N(m)/Q) chi_c(m) rho_sigma(-e0 m) = K0 A(sigma,[c]) gamma_1(c) conj chi_c(-e0) N(c)^{-1/3} (phi(c)/N(c)) W^(5/6) Q^{5/6} + O(Q^-A), K0 = 0.0206959; no Q^{5/6} term for chi_c^k, k = 2..5; resonant class sigma'(c) = [-c]. Constants re-derived; Steps 4-6 in outline; O(Q^-A) untested. | Theorem A of sextic-theta-proof, MS Lemma 4.4 | r2-tro6-polar-theorem |
| Moebius-phased row: for beta = mu conj(alpha G) chi(-e0), conj(B_m) = sum_c w(N c) g~_1(-e0 m, c) exactly (2,822,619 moduli, two formulations). | MS (4.7) | r2-tro6-nonpolar-scale |
| Exponent ledger in TRO6 units at d = 0: literal shifted-sum embedding -8; unreflected -24 (proved sextic sieve), -16-48d (optimal sieve), -72 (additive); reflected + quadratic large sieve exactly 0. Any bound uniform in Phi at fixed l2 norm is capped at eta = 0 (witness Phi = conj(B^J)). | MS Lemma 9.1, (5.26), Cor 14.1 | tro6-shifted-conv |
| Termwise Lindelof-strength bounds for the periods P_c give C^{1/2}Q^{1/2}, never below Cauchy-Schwarz for C >= Q. | bookkeeping | tro6-period |
| Function field F_q[T], q = 1 mod 6 (checked q = 7, 13, 19): Lemma G g_6 g_3 = kappa q^N mu; Theorem A + Lemma R (pairwise identity, all monic moduli, both parities, all ranges); Theorem B (exact dual block formula with the (c,A)=1 coupling); Theorem U without RH (non-principal frequencies <= C q^{d+N+2r-1/2}, C <= 3.2). | none | tro6-functionfield, r2-ff-tro6-complete |
| Function field, with Weil: \|B\| <= Lambda^2 Q O(N q^{(r-d)/2} + q^{5/6+r/6-N/2}), Q = q^{d+k+N}; model saving q^{-eta r/12} on the sufficient range r <= 6d/(6+eta), N >= 5/3 + r(2+eta)/6. One direction only ("Weil-size bound on 1/L coefficients of the target => model TRO6 on that range"). | Weil (RH over F_q), i.e. the target's own zero-free region | r2-ff-tro6-complete |
| MEASURED (11,628 rows, N(m) <= 3199; inputs independently checked): target-free toy cubic rows correlate with rho-natural at the random level (delta about 0.5); first-moment phase gamma_1(c) conj chi_c(-e0), alignment 0.97-1.00 for N(c) <= 1000 on disjoint row halves. | toy rows | tro6-numerics |
| MEASURED (N(m) <= 30000, R = Q^1.4): Moebius-phased row has r = 0.257 at Q = 30000 with no decay on Q <= 30000; rows with Hecke, DH-type or random-sign targets sit at the random-phase null before and after polar subtraction. The statistic has no power to resolve eta. | — | r2-tro6-nonpolar-scale |
| MEASURED (Q = 3199, reproduced at Q = 2400): remainder matrix at random-matrix level after rank-one polar removal. | — | r2-tro6-type12-split |

### 1.5 Positivity criteria and equivalent forms (all Euler-blind or restatements; no bound moves)

| Statement | Depends on | File |
|---|---|---|
| Q(e^{-zt}) = Re L(z)/Re z with exact pair formula and lens lemma; Q >= 0 on {Re z >= c} (order 1) and on the real-rate sub-cone F_c (all orders) iff no zeros with Re s > 1/2 + c. For zeta: Q > 0 on Re z >= 1/2 and on the de la Vallee-Poussin region. | none | dh-separator |
| Screw form: lam1(T) nonincreasing; admissible window of a single coefficient w_n = pencil extremes of 2P_n/q_T, Ritz gives outer bounds. MEASURED: upper bounds for lam1 from 1.3e-3 (ln 2) to 7.9e-62 (T = 2.6). | none | screw-canonical |
| Theorem A (any real data, simple extremal generalized eigenvalue): all zeros of V purely imaginary. Theorem B: RH iff eps_N bounded below. | none; two proof repairs | cc-latest |
| Theorem F (Theta > 0) is a low-height zero-location statement: holds for zeta and (measured zeros) DH; fails for the Euler-product twin T-NR with c > 2. Theorem 4: an extreme Pick ray lies in K_0 iff it is the divided-difference ray or has no root at or above T, up to a band of width <= 1.28K. Order-149 DH vector is outside K_F + K_Omega_T for T <= 937.8 (Arb-signed). | verified height; two proof repairs | r2-lowpass-cone |
| Theorem R (eta supported on n >= 2); Lemma Ri: confluent Pick order N positive definite iff the Richards chain is non-degenerate and r_0..r_{N-1} > 0. CERTIFIED: DH at anchors a <= 3 has r_0..r_147 > 0, r_148 < 0; first indefinite order 150 at a = 5, 7 and 153 at a = 20. | none | r2-pick-euler-entry |
| Nyman-Baez-Duarte at sigma0 in (1/2,1): each zero with beta < sigma0 gives d_N >= c N^{-(sigma0-beta)}; ZF(theta), theta < sigma0, gives d_N << N^{-(sigma0-theta)+eps}; log d_N/log N -> -max(0, sigma0-Theta). Rate eta at sigma0 is equivalent (up to eps) to ZF(sigma0-eta). | none; novelty unchecked (Burnol, de Roton) | nyman-baez-duarte |
| Li: lambda_n >= Q_n - E_n; lambda_n > 0 for n <= n*(H,theta) = (2/(2theta-1)) H^2 (log H + O(log log H)); MEASURED n* = 6.856e26 (strip), 9.216e26 (theta = 7/8) at H = 3.0001753328e12. Toeplitz form with rank-one defect. | verified height; baseline unverified (Coffey 2005) | li-coefficients |
| Jensen: J^{d,n} hyperbolic for all n >= 0 and d <= 9.00e24 (known, Chasse range); d <= 1.60e25 conditional on ZF78. | verified height | jensen-hyperbolicity |
| One-piece Levinson-Conrey functional after optimising P: c = (1+q1^2)/2 + sqrt(AC) coth(theta sqrt(C/A)); kappa < 1 pointwise at finite theta; sup 1 as theta -> infinity with c = 1 + (1/sqrt3 - 1/2) R^2 + o(R^2). | functional recalled from memory | mollifier-halfplane |
| Twist families: (T1) W_c(g) has no prime term when c^ vanishes on prime powers <= e^T; (T2) total weight >= (1 + floor(T/log 2)) c_{chi_0}; (T3) family positivity for cyclic K with e^T <= min(q, least prime power in H) (known device); (T4) identity holds with Lambda replaced by any function on prime powers. | none | twist-rigidity |
| Under ZF(theta): single-moment Ingham-type density method has optimum alpha = 1/2 (Ingham 3/(2-sigma)), floor A >= 2; \|S(T)\| <= ((theta-1/2)/ln 2 + o(1)) log T; under ZF78, m(sigma) >= (49/24)/(7/8-sigma) on [35/54,7/8), alpha_k <= 7/8 - 49/(24k) for k >= 9. | base point m(35/54) >= 9 recalled | vertical-statistics |
| 3-4-1 positivity with companions (cuspidal unitary, central character trivial on R_{>0}, negative zeta weights bounded trivially): the zeta part is a non-negative cosine polynomial with the same a_0, a_1. Constant: 2R_inf in (34.468305, 34.4889920009]. | after three repairs | sym-power-positivity |
| Heat flow: for t < 0, H_t = sum_n exp(t log^2 n) n^{-s} gamma_t(s - 2t log n); cocycle kappa_t(m,n) = 2t log m log n, identical for zeta, DH, planted twins. | none | flow-euler-defect |
| Support: zeta(s-d)zeta(s+d) has the same vanishing set; Weil identity on prime-power-free two-cluster tests confirmed against 20000 zeros; a single off-line quartet at 1/2 + d is visible only if g > (3/2) d x^{1-d} log x (needs beta >= 0.975 against Baker-Harman-Pintz). | none | support-rigidity |
| Class-group pencil D = -20: zeros of F_phi are the level set R = -cot(phi), R = tanh(s log2/2) prod_{p = 3,7 mod 20} tanh(s log p/2)^2; velocity d gamma/d phi = -2/(sin(2phi) omega); collision angles = critical values of R. CERTIFIED to height 2000: 3987 / 3986 zeros, 3091 critical points. | none | r2-classgroup-homotopy |
| Control twin T-NR = xi(s)(2cosh((s-1/2)log q)+c), 2 < \|c\| < q^{1/2}+q^{-1/2}: modified Euler product, functional equation of conductor q^2, off-line zeros at Re s = 1/2 +- arccosh(\|c\|/2)/log q. If sum lambda(n)e^{-ny} <= 0 for small y then RH, simple zeros and \|Gamma(rho)zeta(2rho)/zeta'(rho)\| <= 0.60686 (necessary condition only). | none | ideation-panel |

---

## 2. Results a referee broke

| Slug | Claim as made | Error | What replaces it |
|---|---|---|---|
| tro6-shifted-conv | Lemma N: TRO6 contains no shifted-convolution problem. | A = c n^3; chi_A has period rad(cn), so "N(A) > 4CQ implies m1 = m2" fails for large cube part. | Holds on the bulk only; exceptional stratum has l2 weight <= Z^{-1/9-d/3+eps} and is below target. |
| tro6-shifted-conv | Saturation witness Phi = w(mu0/.)_2. | Saturates the large-sieve inequality, not the form. | Witness Phi = conj(B^J); extension to Rankin-Selberg/individual bounds asserted only. |
| tro6-period | Corollary L': weight Psi = alpha^2 G^2 nu; mu(c)Psi(c) = coefficients of 1/L(s,Psi). | Substitution gives alpha^2 G nu; G not multiplicative (defect +-1 on 78 of 137 composites). | Finite combination over characters mod 4; split omits R(delta,c'). "X^{2/9} vs X^{1/54}" is not a fair gap measure. |
| tro6-functionfield | "Function-field TRO6 is true, eta >= 1." | Corollary bullet 1 false over squarefree c (c-sum does not vanish; modulus 13 measured at q = 13); needs d >= N; Theorem 2 fails for 6 \| N-k. | Replaced by r2-ff-tro6-complete (Theorems A, B, U; Weil bound on a sufficient range). |
| tro6-numerics | Resonant class sigma = class(c). | False on rows prime to 6 (z^2 = 0.8-4.6 against null 2); response sits in sigma'(c). | sigma'(c) = [-c] (r2-tro6-polar-theorem). |
| tro6-numerics | Moebius-phased row: "no decay, Cauchy-Schwarz attained, eta = 0 sharp". | Bootstrap interval contains both eta = 0 and eta = 1; decay at fixed R; "K^2 ~ Q^0.82 N(c)^-0.60" is the exponent of z^2-2, not K^2. | Unresolved; see r2-tro6-nonpolar-scale. |
| r2-tro6-nonpolar-scale (PROVED step holds) | "delta <= 0.0111, so 0.0125 is excluded." | Three systematic contributions each exceed the threshold; noise share varies with Q. | Exclusion not established; noise-corrected cosine has delta -0.002 / +0.012, no interval. |
| r2-tro6-polar-theorem | TRO6-natural(eta) <=> the same bound on the remainder (PROVED-rel). | Needs unproved lower bounds \|\|B^J\|\|^2 >> Q^{1-eps}, M >> Q^{5/6-eps}; row length inconsistent between notes (-1/48 vs -1/36). | HEURISTIC, for a toy n = 1 analogue. "1-3% match" holds for c = 1 only (6.5%-36% rms otherwise; correlation 0.94-0.998). |
| r2-tro6-type12-split | Type-I inner sum = coefficient of the conjugate Kubota Eisenstein series for Gamma_0(a). | Drops the twist Psi(b) rho(a,b); alpha^2 is an infinity-type twist. | Only "Psi*rho-twisted Kubota Dirichlet series at index m a^4"; (RS) is formulated for a different object. Toy geometry inconsistent with Theorem D at 7/8. |
| zf-higher-rows | Theorem 4(ii); "mixtures are never better than their lowest pure order". | Counterexample r1 = r2 = 4, chi(u1) conj chi(u2): count about H, not H^{1/2} (brute force 116/232/470/956). | Replaced by r2-zf-paired-rows Lemma B. Classification table, r >= 7 exclusion, "no order below 0.874886647" are MODEL only. |
| zf-higher-rows | "TRO6-natural and the cubic R2 object are the same 6-fold Kubota object." | No implication in either direction given. | Both are order-6 Gauss-sum series on the 6-fold cover; nothing more. |
| r2-zf-paired-rows | (4,12), order-12 Poisson: theta >= 23/24 + 3 l1/8. | Counterexample (0.3, 1): 0.99583. | 23/24 + l1/8. (4,4) equality holds only for l2 <= l1. |
| r2-zf-critical-density | Corollary H2: hybrid returns exactly count x sup U^{(3R+1)/4}. | Needs a lower bound for H_{eta,u,Z} on the contour region, which Liu Lemma 13.10 does not assert. | OPEN. Section 2.3 comparison wrong on delta in (3/4, 5/6]; repaired. |
| r2-zf-gm-inverse-witness | "Gauss sums cancel, so the missing input is not TRO6"; "no full-family estimate helps". | Non sequitur: (GM6) tested on c_n = conj(g~(n)) implies a bound on sextic theta coefficients over sparse row sets; the note itself names a helping estimate (Lemma 17.1 slot capacity r + z < 1). | "(GM6) is not shown to reduce to TRO6." |
| zf-large-values (holds after repair) | P2 from P1 alone; "zero-density estimates hold for DH". | P1 compares with the mean-value count, but the paper's counts sit above it; DH has >> T zeros in every strip. | Repaired inequality; DH sentence withdrawn. |
| zf-hecke-all-fields (proposition holds) | "Even GRH for the family as input moves the output by only 4.3e-5." | Below beta_M = 0.734 the critical class is empty and the constraint disappears (0.870910 at beta_M = 0.60). | Insensitivity only for family supremum in [0.734, B_flat]. |
| lambda-from-halfplane | P4: single-probe start rate at t = 0 is at most 13.34. | Uses inf of Re zeta'/zeta = zeta'/zeta(sigma); a valid floor need only lie below the infimum with the log term included. | Ceiling only for triangle-inequality floors. Rate 12.07 > 11.01 later obtained (r2-lambda-tpos-floors). |
| r2-lambda-reopt-run (PROVED claims hold) | Lemma G: "for q >= 0 the one-step map is decreasing in c"; "greedy optimum of the F2 menu". | False for 0 <= q < about 1.95e-6; (G-mono) unaudited. | No certified value uses Lemma G. |
| flow-euler-defect | O2: E = 0 locus among symmetric mixtures is the single point xi. | Cauchy mixtures give c_n = n^{-delta}, E = 0, with infinitely many non-real zeros. | Holds only under the Hamburger definition F_mu = gamma(s)D(s). |
| flow-euler-defect | O3: no convergent arithmetic object for t > 0. | Half-line termwise expansion converges absolutely for every t (error < 1e-30 at N = 4). | Only the full-line termwise integrals diverge. |
| support-rigidity | Threshold g > 3 x^{3/2-beta} log x; "W = Q_inf > 0 is unconditional in every actual window". | Conjugate pair omitted and log(1/eta) = d log x; positivity for all x needs a Cramer-strength gap bound (known under RH only). | g > (3/2) d x^{1-d} log x; W > 0 MEASURED at 26 maximal gaps to 2e7. DH statements corrected (DH has no pole). |
| li-coefficients | Q_n >= 0.146 n log n. | Limit is 0.14588; never reached. | Q_n >= Q_low(n), about 0.143 n log n near n*. Theorem B needs R*+1 slack. |
| sym-power-positivity | Theorem A item 1 for any unitary cuspidal pi; cost rule "negative weights cost at least as much". | Counterexample pi = \|.\|^{i gamma}; cost rule false for sigma - 1 >> 1/log gamma. | Require central character trivial on R_{>0}; bound negative weights trivially. Beurling extension with companions unsupported. |
| ideation-panel | Lemma 3.2 for all N >= 3. | Proved for N = 3 only (evaluation point gives a positive value at N = 4, 6, 10, 16). | N = 3 proved; N = 4, 5 numeric witnesses; general N open. Converse of the Liouville sign condition open. |
| r2-lowpass-cone | "All known positive tests form K_0 = K_F + K_Omega"; "any test vanishing above verified height is open". | Direct evaluation and dominance tests lie outside K_0 and are provably positive (example ray with root at 3e12+7). Threshold N < 88 is N <= 86. | Only the listed generators lie in K_0; the uncovered set is tests with suppressed low-height mass. |
| screw-canonical (lemmas hold) | "Any estimate-based primes-only proof is excluded for T >= 1.4." | Lemma 2 excludes only arguments tolerant to moving one coefficient with the rest fixed. | Narrow form in section 3. Rate law (e^T vs T e^T) not determined. |
| r2-pick-euler-entry (PROVED steps hold) | "Gates carry no information beyond the Richards sign pattern"; "DH fails at order 149". | Converse false at level 0 (chi_-4, DH fail J_0' > 0 with all r_j > 0); order is anchor-dependent. | MEASURED; order 149 for a <= 3 only. |
| mollifier-halfplane (PROVED claims hold) | Uniform ceiling < 1 (Prop 2); "ZF(Theta) says nothing about the rest"; constant (2/sqrt3 - 1). | Step (iv) is pointwise; Eisenstein part pairs mu with n^{-it} sigma_{2it}(n), which a half-plane does bound. | Uniform ceiling is a referee sketch; obstruction sits in the cuspidal part. |
| r2-classgroup-homotopy (PROVED steps hold) | "L(chi)/L(chi-bar) is unimodular on the line." | \|ratio\| = 2.31, 3.5e-6, 4.60 at t = 3, 6.18, 10. | Sentence withdrawn; "interval shrinks to {0}" is ARGUED. |

---

## 3. Obstructions newly located

Each is stated with its scope. None is a lower bound on the truth unless stated.

1. Zero-free method floor. Relative to Liu Lemma 14.10, B_flat = 0.874886647 is an infimum of the method, set by
   one formal class (about U^0.590 sextic twists, norm Z^0.794, zero at real part 0.7347, x = 1/2). Changing the
   target, the field, row order (model level), mixtures (Framework A), unequal lengths or numerator mixing
   (<= 6e-14) does not move it. Inputs that move it: a count below U^0.590 at that class (price -0.138 tau), or
   emptiness of the class. (zf-hecke-all-fields, r2-zf-critical-density, zf-higher-rows, r2-zf-paired-rows)
2. Count tools examined and excluded: phase-blind hybrids over targets; general sextic large sieve; max-over-pairs
   Halasz-Montgomery (critical class is 0.0153 below its threshold); Guth-Maynard on the 7/8 manuscript's binding
   bins. In the Xu-Sang system the Halasz + cubic-trace route needs lambda_max(E_B) << U^{0.5903+0.4693r} on
   sparse row sets for r in (0.7605, 0.8728]; the proved exponent is min(1-delta r+r, 2(1+r)/3). Not excluded:
   Lemma 17.1 slot capacity (r + 2z < 1 vs r + z < 1); Jutila-type pair averaging; e(r) below (1+5r)/6 on
   1 <= r <= 1.26. (r2-zf-critical-density, r2-zf-gm-inverse-witness, zf-large-values)
3. TRO6 norm cap. Any bound uniform in Phi at fixed l2 norm is capped at eta = 0; reflected + quadratic large sieve
   gives exactly 0. A proof must use the specific coefficients. (tro6-shifted-conv)
4. TRO6 polar part located. For N(c) <= Q^{1/2-delta} the twisted first moments have an explicit Q^{5/6} term
   (constant, phase, class map). The rows of the conjecture live at N(c) up to about Q^{7/5}, outside that range.
   (r2-tro6-polar-theorem)
5. TRO6 Type I/II reduction (toy geometry D = Q^{7/5}, n = 1). The kernel splits exactly; an arbitrary-coefficient
   bilinear inequality can hold only for Q^0.4 <= N(a), N(b) <= Q (relative to a measured lower bound); sextic large
   sieve gives Q^0.8 against a needed Q^{1/2-eta}; Dunn Prop 1.6 transposed is the primal large sieve; Thm 1.5
   transposed leaves an empty dual range. Not excluded: Type I on average over the level; two smooth variables;
   trilinear Gauss-sum form via mu(a) = gamma_2(a)^3 conj alpha(a). (r2-tro6-type12-split)
6. Function-field model. With every term written, the model TRO6 on the proved range is implied by a Weil-size
   bound on 1/L coefficients of the target, which is the target's own zero-free statement. Window
   6d/(6+eta) < r <= 6d/eta open; general row coefficients correlate at O(1) (measured), so the Moebius factor is
   required. (r2-ff-tro6-complete, tro6-functionfield)
7. Numerical resolution limit for TRO6. At N(m) <= 30000, all target-twisted rows are at the random-phase null; the
   statistic cannot distinguish eta = 0 from eta > 0. (r2-tro6-nonpolar-scale)
8. Lambda conversion. Floor-only certificates whose floors hold on a same-height lattice cannot give time below
   0.0962 (0.103-0.104 with floors in hand); no multi-zero barrier fed the same floors does better. Leaving the
   class needs input that fails on the lattice (two-sided or variation information on S, floors at h - y below
   about 0.3, or larger X). (r2-lambda-tpos-floors)
9. Lean base. The plain moment's numerical use of kappa >= 3/4 is removable (2/3 suffices), but below 3/4 the
   certificate is conditional on beta <= (1+kappa)/2, which Lean has only at 7/8. (r2-lean-kappa-1318)
10. Positivity criteria equal zero-location statements. Order-1 complex-rate Weil positivity on Re z >= c iff
    zero-free for Re s > 1/2 + c; confluent real-Pick inertia at an anchor is a function of the zero set (Richards
    signs); Nyman-Baez-Duarte rate at sigma0 iff zero-free to sigma0 - eta (loop map f(theta) = theta); Li and
    Jensen ranges are (T/2a)^2-type functions of verified height with a factor 4/3 or 16/9 from ZF78.
    (dh-separator, r2-pick-euler-entry, nyman-baez-duarte, li-coefficients, jensen-hyperbolicity)
11. Screw-form window. No positivity proof on [0,T) may treat one prime coefficient as uncertain by more than the
    pencil window (within [-2.5e-26, +5.8e-29] for w_2 at T = 2, measured). (screw-canonical)
12. T-NR as a control. An Euler product plus functional equation with off-line zeros exists; Theorem F fails for
    it, and it fails Pick at level 0. Arguments must fail for T-NR as well as DH. (ideation-panel, r2-lowpass-cone,
    r2-pick-euler-entry)
13. Linear positivity with companions. Sym^m, Hecke and Rankin-Selberg companions change neither the shape
    c/log t nor the constant of the 3-4-1 inequality. Quadratic or mean-value positivity not covered.
    (sym-power-positivity)
14. One-piece mollifier and ZF78. ZF78 reaches the Eisenstein part of the off-diagonal only; the cuspidal part,
    which fixes length 4/7, is untouched. Structural, not a theorem. (mollifier-halfplane)
15. Density under ZF. Single-moment Ingham-type and pointwise Halasz-Montgomery channels give no N(sigma,T) = 0
    below 7/8 and no density record; mixed methods checked by inspection only. (vertical-statistics)
16. Family and support routes. Non-negative weights + common test + orthogonality + explicit formula gives no
    information on W_zeta (holds for any function on prime powers); on test classes vanishing at log p^k the only
    possible output is a refutation of RH; the heat-flow multiplier cocycle is identical for zeta, DH and twins.
    (twist-rigidity, support-rigidity, flow-euler-defect)
17. Class-group pencil. "All zeros below T real and simple" is open in phi for any continuous real-on-line family;
    first collision angle decays with exponent near 2 in n(T) (measured). (r2-classgroup-homotopy)

---

## 4. Top 5 next moves, ranked

1. Close the dependency chain under the conditional numbers. Obtain Liu's Lean repository cited in 2610.12234v2
   (PartsI_III.lean, PartIV.lean) and run the axiom check (claimed to cover the l > 1/6 direct estimate and the
   kappa >= 13/18 moment); replay Liu II Lemma 14.11 in Arb; second reader for Xu-Sang Appendix C.3 and
   Appendix B; formalise Xu-Sang Props 4.1/5.1 so stage 0 licenses stage 1 in Lean. Then rerun the re-optimised
   Lambda consumer at the documented abscissa B = 0.87488665 (the present run is invalid there).
   Output: which of 0.8748875 / 0.8748867 / 0.116059817 has a checked base. Cost: local, no paid compute.
2. Audit the slot capacity in MS Lemma 17.1 (r + 2z < 1 versus r + z < 1): find where the factor 2 arises in the
   Section 17 recursion. At x = 1/2 the natural capacity would give count 1 - delta, i.e. a count saving at the
   critical class, the one input priced to lower B_flat (-0.138 tau). No pivot examined it.
3. Evaluate the twisted first moment T(c) in the dual range Q^{1/2} < N(c) <= Q^{7/5} by the same Poisson-plus-Hecke
   method, and write Steps 4-6 of Theorem P in full. Reconcile the toy geometry with Theorem D at beta_0 = 7/8
   (polar part is Q^{-1/40} below Cauchy-Schwarz in the toy; should be equal) and with the row length in
   tro6-spectral. Until this is done every TRO6 exponent in rounds 1-2 is a toy statement.
4. TRO6 Type I on average over the level: cubic large sieve in (a|b) with the m-sum kept inside, via the exact
   split g~(m,ab) = R g~(m,a) g~(m a^4,b); first derive (RS) for a = 1 to fix the conductor exponent (if
   kappa = 4, Type-I level Q^{1/3} falls below the Type-II window and the split cannot close).
5. Certify t > 0 floors for the positive three-pair probe family (Lam_t(n) >= 0 for the heat-twisted series, tail
   beyond N, x/t uniformity, Sturm certificate per cell), and interval-certify the k = 34 enumeration. Bounded by
   the class ceiling: nothing below 0.096; heuristic estimate 0.110-0.1125; conditional on ZF-XS and RAY.

Closed, do not rerun: dh-separator, screw-canonical, cc-latest, nyman-baez-duarte, li-coefficients,
jensen-hyperbolicity, twist-rigidity, sym-power-positivity, mollifier-halfplane, support-rigidity,
flow-euler-defect, vertical-statistics, tro6-shifted-conv, zf-large-values (Guth-Maynard route),
r2-zf-paired-rows, r2-classgroup-homotopy, r2-lowpass-cone, phase-blind hybrids, further TRO6 numerics at the
present design.

---

## 5. Status relative to RH, the zero-free abscissa and Lambda

RH is open and no row gives new information about the location of any zeta zero. Every positivity or criterion lane
in this ledger was shown to be either Euler-blind (true in the same form for Davenport-Heilbronn) or equivalent to a
zero-free statement of the same strength, and the T-NR twin shows that an Euler-type product plus a functional
equation does not suffice without the local Ramanujan shape. The zero-free abscissa is unchanged: the kernel-checked
value is 7/8 (zeta, Dirichlet and the OAI-defined Hecke family; full leanchecker replay of the 2924-module closure
passed); the preprint values 0.8748875 and 0.8748867 are hand-checked in their exponent arithmetic relative to
manuscript statements, with several lemmas at the new geometry and two appendix steps unverified, and B_flat =
0.874886647 is the infimum of that method. TRO6-natural is open for every eta > 0; what was added is a set of exact
identities, an explicit polar term in the short-conductor range, and reductions in a toy geometry that is not yet
reconciled with the manuscript. For Lambda the accepted bound remains Lambda <= 0.2. The conditional values are
0.116059817097268 (re-optimised, valid only at theta = 0.874886647 exactly) and 0.116060108665412 (replay, at the
documented 0.87488665), both depending on the unrefereed half-plane preprints and on Raymond's unrefereed chain;
the change from the 7/8 value 0.116091488672439 is about 3.1e-5, and the floor-only certificate class cannot go
below about 0.096.

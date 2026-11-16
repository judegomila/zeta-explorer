# Mechanism table (stack-combinator, 2026-11-16)

Built from every RESULT.md / REFEREE.md under `tmp/research-2026-11-16/` (eq48, pick, euler, push/*), via the row digests in `rows/G1.md` .. `rows/G4.md` (236 source rows) and direct reading of weil-onesided, g-spinor-square-root, bootstrap, sq-hankel-traces, sq-causal-cascade, sq-krein-index. Referee status wins over lane status.

Controls. DH = Davenport-Heilbronn. HEAT = backward heat family (tau < 0). TW+ = Lambda(n) -> eps_n Lambda(n) with 0 <= eps_n <= 1. TW- = signed eps_n, |eps_n| <= 1. EA = zeta(s+a) zeta(s-a), 0 < a < 1/2. Two further controls found in the lanes: NR = xi(s)(2 cosh((s-1/2) log q) + c) (ideation-panel T-NR: Euler product, zeta's functional equation, pole at 1, off-line zeros); B = Beurling zeta (sym-power-positivity Thm B: Euler product, Lambda >= 0, pole, no functional equation).

Cells. P = the control satisfies the statement (the statement cannot separate zeta from it). F = the control violates it. N = not formulable for the control. ? = not determined. A trailing * marks an inference (reader agent or this lane) from the inputs the statement uses; no star = stated or measured in the lane or its referee report. Type: IDENT identity, INEQ proved inequality, INPUT structural property, RIGID rigidity statement, NOGO obstruction, MEAS measured only, TARGET RH-equivalent statement (listed for completeness, never a usable hypothesis).

| # | id | type | statement | constrains | uses | region | DH | HEAT | TW+ | TW- | EA | NR | B | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | eq48/Thm1 | IDENT | Q_L(v) = sum_ij b_i conj(b_j)(L(x_i)+L(x_j))/(x_i+x_j) = sum_rho V(rho) conj V(-conj rho) for one-sided exponential sums, rates > 1/2 | zero-side form; no location info | FE | axis | P | P* | N | N | P | P* | N | PROVED (refereed) |
| 2 | weil-onesided/B1 | IDENT | Q_L = sum_rho \|V(rho)\|^2 - (1/2) sum_rho \|V(rho) - V(-conj rho)\|^2 (squares with defect; defect runs over off-line zeros only) | zero-side form | FE | axis | P | P* | N | N | P* | P* | N | PROVED |
| 3 | g-spinor-square-root + sq-krein-index/Krein square | IDENT | H_c = alpha sum_gamma y_gamma conj(y_gammabar) = D^dagger J D; negative index = rank Gamma_- = number of distinct zeros with Re z > 0 (integer or infinity); S = S_0/B, B Blaschke of degree kappa | integer index of the bridge form; counts off-line pairs, does not locate | FE | axis | P | P | N | N | P* | P* | N | PROVED (refereed; inertia theorem unrefereed) |
| 4 | g-spinor-square-root/Weitzenboeck block | IDENT | H_c = A* M_c A, M_c = [[G+*G+, -S_QQ* G-],[-G-* S_QQ, -G-*G-]]; PP block <= 0, so H_c >= 0 iff Gamma_- = 0 (no margin regime) | Hankel blocks of S = N/D | FE | axis | P | P* | N | N | P* | P* | N | PROVED (refereed) |
| 5 | sq-hankel-traces/Thm1 | IDENT | tr(G-* G-)^m = tr(R* A R conj A)^m, A_jk = 1/(conj z_j + z_k); isolated off-line pair at distance beta has singular value alpha/sqrt(alpha^2+beta^2) | anticausal Hankel block; gives a per-zero quantum | FE | axis | P | P* | N | N | P* | P* | N | PROVED for finitely many off-line zeros (unrefereed) |
| 6 | sq-hankel-traces/Thm2 + sq-krein-index/index | IDENT | \|\|G+\|\|^2 - \|\|G-\|\|^2 = N_0 (on-line zeros), \|\|G+\|\|^2 + \|\|G-\|\|^2 = Besov energy of the boundary phase; axis winding of S = -N_0 + O(1); this is Levinson's argument-principle step with D = xi + alpha xi' | counting identity N_0 = N - 2 N_off | FE | axis | P | P | N | N | P* | P* | N | CLASSICAL specialised |
| 7 | sq-hankel-traces/Thm3 + Cor3a | IDENT | windowed anticausal transform I(u) = -2 pi sum_{RHP poles} r_j W(z_j) e^{z_j u} + Rem, \|Rem\| <= sqrt(2 pi) Dl exp(-u^2 Dl^2/2) once \|u\| Dl^2 >= sup Re rho (1/2 for zeta) | anticausal kernel = residue sum; measured ratio \|I\|/bound: zeta 0.33, DH 1.2e7 at u = -6 | FE + zero-free Re s>1 | axis->Re z=x | F* | P* | N | N | P* | P* | N | PROVED (unrefereed) |
| 8 | weil-onesided/ThmF | INEQ | Theta(t) = sum_rho e^{rho^2 t} > 0 for all t > 0; Phi(u) = L(sqrt u)/sqrt u completely monotone; Q_L > 0 on v = e_{a_1}*...*e_{a_M} | lower bound on a low-pass cone; no single high zero is resolved | FE + verified height 100 | axis (low-pass) | P | P* | N | N | F* | P* | N | PROVED; DH MEASURED |
| 9 | weil-onesided/ThmC + B2 | INEQ | liminf Lam d_Lam(v)^2 >= sum over distinct on-line zeros \|V(rho)\|^2; Nyman-Beurling functions lie in the radical of Q_L | Nyman-Beurling distance; one-sided, on-line part only | FE + ordinary Dirichlet series | Re s = 1/2 | P | N* | N | N | P* | P* | N | PROVED |
| 10 | dh-separator/ThmA lens + g-renderer/ThmA | IDENT | Q(e^{-zt}) = Re L(z)/Re z = sum_on 1/\|z - i gamma\|^2 + sum_pairs 2(x^2 - delta^2 + (t-gamma)^2)/(...): negative only inside the disk of radius delta about the pair foot | order-1 complex test; lens geometry of an off-line pair | FE | Re z > 0 | P | P* | N | N | P* | P* | N | PROVED (refereed) |
| 11 | g-coupling-norm/Thm2 Schur-Blaschke | IDENT | 1 - rho(X;y)^2 = node-only Blaschke product x product of Schur factors phi_k (Richards iterates); RH iff \|phi_k\| <= 1 at all orders | Schur parameters of L; identity carries no sign | FE | real nodes | P | P* | N | N | P* | P* | N | PROVED (interval-checked) |
| 12 | g-antibridge-cancel/ThmB + B1 | IDENT | K_e = P + B = sum phi_rho(x_i) phi_rho(x_j), K_o = P - B; S = 2 (K_e^{-1} + K_o^{-1})^{-1}; \|\|T\|\| <= 1 iff K_e, K_o >= 0 | parity sectors; Loewner form in s = x^2 | FE | real nodes | P | P* | N | N | P* | P* | N | PROVED (refereed) |
| 13 | g-channel-geometry/ThmA inertia | IDENT | channel matrix Z = M* J M with J = identity on on-line zeros and a hyperbolic swap on off-line pairs | same Krein structure for PR 29 channels | FE | axis | P | P* | N | N | P* | P* | N | PROVED (finitely many off-line) |
| 14 | g-klein-bottle-seam/T1 | IDENT | N_on(I) + 2 N_right(Omega) = (1/pi) Delta_C arg F | argument principle; integer invariant | FE | boundary of region | P | P* | N | N | P* | P* | N | PROVED (Backlund minus Hardy) |
| 15 | li-coefficients/ThmA-B | INEQ | lambda_n > 0 for n <= n*(H,theta) ~ (2/c) H^2 log H; sharp on the class of zero sets | restates verified height | FE + verified height (+ strip) | axis | P* | P* | N | N | F* | P* | N | PROVED (refereed) |
| 16 | jensen-hyperbolicity/ThmA | INEQ | Jensen polynomials hyperbolic for degree <= d under a cone condition on non-real zeros | restates verified height | FE + verified height | axis | P | P | N | N | ? | P* | N | PROVED (refereed) |
| 17 | pick/K<=12 | INEQ | Pick matrices of L positive definite for all K <= 12 and all real nodes | finite orders follow from verified height | FE + verified height | real nodes | P | P | F | F* | ? | ? | N | CERTIFIED |
| 18 | euler + g-coupling-norm + pick-induction/DH-149 | NOGO | DH Pick pivots positive for orders 2..148, first negative at 149 (three node families): finite Pick orders are Euler-blind | no finite-order positivity separates zeta from DH below order 149 | - | real nodes | P | ? | ? | ? | ? | ? | ? | CERTIFIED (Arb) |
| 19 | pick-induction/ThmR | RIGID | for eta != 0 real with sum \|eta(n)\| n^{-1/2} < inf, L - sum eta(n) n^{-1/2-z} has a non-PSD finite Pick matrix on every interval: all-order positivity has zero tolerance in every prime weight | pins each prime weight; identifies the function, does not locate zeros | exact FE | real nodes | P | N | F | F | N | N | N | PROVED (unrefereed) |
| 20 | b-euler-detector/WeilPinsC2 + b-codex-zero-channels/FE-rigidity + screw-canonical/Lemma2 | RIGID | Weil positivity with zeta's bridge at support ln 3 confines c(2) to [0.99905, 1.00100]; window at log 2 is [-2.5e-26, +5.8e-29] at T = 2; tolerance ~ 10^-(N-2) at order N | same rigidity, quantitative | exact FE | support ln 3 / T=2 | N | ? | F | F | ? | ? | ? | MEASURED |
| 21 | b-mvcap-function-side/Thm1 + Thm2 | NOGO | FE-only forcing has threshold eps* = \|Z(t_m)\| (c/2 pi)^{-(sigma-1/2)/2}; cluster-lift counter-model within ~4e-9 \|Z(t_m)\| of zeta on Re s >= 2 at 3.1e12 | mean-value inputs cannot certify one window (MV-CAP, function side) | FE | strip window | P | P | N | N | ? | ? | N | PROVED (Thm 2 conditional on H_W) |
| 22 | g-odd-adversary/heat-no-go + codex OddCone/SeparatedTail | NOGO | Csordas convexity, entrywise positivity of H_-, the one-sign cone and the separated-tail positivity persist for every tau, while the target fails for tau < 0 | every kernel-side input of PR 44/56 is flow-stable | kernel positivity, Csordas convexity | kernel side | P | P | N | N | ? | ? | N | PROVED |
| 23 | flow-euler-defect/Prop1-2 | IDENT | H_t = sum_n exp(t log^2 n) n^{-s} gamma_t(s - 2t log n) (t<0); coefficient cocycle 2t log m log n; H_t (t<0) = Gaussian mixture of vertical translates of Xi | the heat family has no fixed-gamma ordinary Dirichlet series: HEAT lacks multiplicativity and integrality | heat kernel | all s | P | F | N | N | ? | ? | N | PROVED (refereed) |
| 24 | b-escape-law/ThmA + C1 | NOGO | for tau > 0, H_{-tau} has zeros outside every strip; so every hypothesis class 'all zeros in \|Im z\| <= Y' is flow-critical | strip statements are violated by HEAT | - | strips | F* | F | N | N | P* | P* | N | PROVED (referee-corrected) |
| 25 | b-escape-law/C2 = Bohr-Landau density | INEQ | N(sigma,T) = o(T) for each sigma > 1/2 | zero density; a proportion statement (MV-CAP), never an empty set | FE + size (mean square of zeta M) | Re s > 1/2 | F | F | P* | P* | F | F* | ? | CLASSICAL for zeta; control outcomes PROVED/inferred |
| 26 | lit-dedekind-qrh/ThmA | INEQ | zero-free Re s > theta implies Lambda_F <= (2 theta - 1)^2 / 2 | bridge from a half-plane to the heat axis; Euler-blind | FE (extended Selberg class) | strip | P | N | N | N | P* | P* | N | PROVED |
| 27 | weil-onesided/ThmE (E1) | INEQ | Q_L(v) <= A(v) for pointwise nonnegative v (A = archimedean + pole form); linear form: sum_rho G(rho) <= A(g) for every g >= 0 | upper bound on the zero-side form; with the lens identity gives the de la Vallee-Poussin region | Lambda >= 0, pole at 1 | rates > 1/2 | F | F* | P* | F | P | F* | N | PROVED; DH MEASURED |
| 28 | dh-separator/ThmC | INEQ | Q(e^{-zt}) > 0 for Re z >= 1/2 and on the classical zero-free region; Q >= 0 on the cone F_{1/2} (e^{\|l\|/2} C_r positive definite) | lower bound on a strip-positive cone; equals the classical zero-free region | Lambda >= 0, pole, zero-free Re s >= 1 | Re z >= 1/2 - eta(t) | F | F* | P* | P* | P | P* | ? | PROVED (refereed) |
| 29 | li-coefficients/LemmaD | IDENT | Lambda >= 0 iff Stieltjes-Hankel positivity of the moments M_k(a); the alternating transform to Li coordinates destroys the positivity | prime side only | Lambda >= 0 | base a > 1 | F | N | P* | F | P | F* | P* | PROVED |
| 30 | b-mvcap-function-side/Prop3 | IDENT | u -> log zeta(sigma + iu) is positive definite for sigma > 1, with zero slack | prime side only | Lambda >= 0, exact | Re s > 1 | F | F* | P* | F* | P | F* | P* | PROVED |
| 31 | sym-power-positivity/ThmA | INEQ | 3-4-1 type combinations with cuspidal companions: the zeta part of a nonnegative combination is a nonnegative trig polynomial; no gain beyond the classical region | upper bounds on zero sums | Lambda >= 0 with unitary companions | Re s > 1 | F | N | P* | F* | P | ? | P* | PROVED (refereed) |
| 32 | r2-lambda-tpos-floors/ThmA | INEQ | alignment floor S(x,h,0) >= L + (1/2) zeta'/zeta((1+h)/2) + Delta(h)/2 - 1e-9 | rate floor in the Lambda-bound engine | Lambda >= 0, Q-independence of log p | t >= 0 heat rows | F | ? | P* | F* | ? | ? | ? | PROVED (unrefereed) |
| 33 | support-rigidity/P1-P3 + b-euler-detector/E_p | INPUT | Lambda_F supported on prime powers iff coefficients multiplicative; a(1)a(p^j m) = a(p^j)a(m); DH fails first at n = 6 | identifies Euler products; no analytic content | multiplicativity | formal | F | F | P* | P* | P | P* | P* | PROVED |
| 34 | b-euler-detector/T_pK | INPUT | rung Toeplitz [m_\|i-j\|(p)] PSD for all K iff the local factor has unimodular Satake parameters; DH fails at p = 2, K = 2; E_a fails at every p, K = 1 | local temperedness; kills E_a and the T-NR twin | local unitarity (Ramanujan) | local | F | N | F* | F* | F | F* | P* | CLASSICAL |
| 35 | weil-onesided/ThmA (A2) | IDENT | 2 Re <Tv,v> = sum_p log p (\|\|w_p\|\|^2 - p^{-1} \|\|S_{log p} w_p\|\|^2 - \|\|v\|\|^2), w_p = (1 - p^{-1/2} S_{log p})^{-1} v; per-prime brackets have no sign | prime term as local resolvents | Euler product, geometric local factors | rates > 1/2 | F | N | F* | F* | P* | P* | ? | PROVED |
| 36 | g-passive-cascade/Thm1 + sq-causal-cascade/Thm1 | IDENT | xi'/xi = G - sum_p [Z_p - (log p)/2], Z_p = (log p/2) coth(s log p/2) lossless on Re s = 0; S = T_{M(alpha G) prod_p M(-alpha u_p)}[1], J-defect of a section = Re Z x rank one | series chain of negated lossless stubs; converges only for Re s > 1 | Euler product, geometric local factors | Re s > 1 | F | F | F* | F* | P* | P* | ? | PROVED (refereed / unrefereed) |
| 37 | sq-causal-cascade/Prop2 | IDENT | summed J-defect is bounded iff Re s > 1 and square-summable on the Bohr torus iff Re s > 1/2, variance 1/(8x^2) + O(1) at Re s = 1/2 + x | the critical line is the l^2 threshold of the chain; for E_a the threshold is 1/2 + a | stub size p^{-sigma} | Re s = sigma | N | N | P* | P* | F* | ? | ? | PROVED (unrefereed) |
| 38 | sq-causal-cascade/Thm3 + g-passive-cascade/S5 | INEQ | if sum_{p<=Q} log p/(sqrt p - 1) <= R(t0) the truncated chain is J-contractive: \|S_Q\| <= 1; Q*(t) = (log(t/2pi))^2/16; sharp in the class using only \|Lambda\| | finite-prime Hermite-Biehler reserve; stops at 37 primes at t = 1e12 | \|Lambda(n)\| <= log n only | Re s >= 1/2, \|t\| >= t0 | F | F | P | P | P* | ? | ? | PROVED (unrefereed) |
| 39 | sq-causal-cascade/Thm4-5 + g-passive-cascade/Thm3 + Kronecker budget | NOGO | no splitting L = L_0 + sum_p h_p with L_0 and each h_p positive-real; no single-delay Blaschke-Potapov section at any node; worst-case draw of the primes has no inter-prime cancellation | sectionwise passivity is impossible | - | Re z > 0 | ? | ? | ? | ? | ? | ? | ? | PROVED |
| 40 | sq-hankel-traces/Thm4 | IDENT | S = -1 + 2 sum_m alpha^m P^m/(1 + alpha G)^{m+1}, P^m = sum Lambda^{*m}(n) n^{-1/2-z}: transform supported on u >= 0, so the prime-side anticausal kernel is identically zero, for every sign twist | prime side of Gamma_-; shares no hypothesis with the zero side | \|Lambda(n)\| <= log n | Re z > sigma_0(alpha) | F* | N | P | P | F* | ? | ? | PROVED (unrefereed) |
| 41 | g-channel-geometry/ThmC | INEQ | PR 29 separated-carrier positivity holds for every sequence with the size of Lambda; exceptional-carrier positivity fails for eps_n = cos(t0 log n) | sign-blind channel positivity | Chebyshev + \|Lambda(n)\| <= log n | b-channels | F | N | P | P* | F* | ? | ? | PROVED |
| 42 | twist-rigidity/T1-T4 | INEQ | nonnegative weights over a character family annihilate prime terms up to e^T at total weight >= 1 + floor(T/log 2); the family inequality holds for arbitrary real prime data | family positivity; no information on a single member | orthogonality of characters | support T, families | P | N | ? | ? | ? | ? | N | PROVED (refereed) |
| 43 | support-rigidity/P5-P9 | NOGO | an off-line zero is invisible in every prime-power-free window (domination by n^{1-beta}); exact vanishing gives uniqueness, not location | support of Lambda | support | windows | ? | N | ? | ? | P | ? | ? | PROVED (constant corrected) |
| 44 | support-rigidity/P4 + bootstrap/Prop5 | NOGO | E_a has Lambda >= 0, prime-power support, FE s <-> 1-s and zeros at 1/2 +- a: every inequality from {explicit formula, Lambda >= 0, FE, ZF(theta), growth} holds for E_a | size normalisation must be used | - | - | N | N | N | N | P | N | N | PROVED |
| 45 | ideation-panel/T-NR + b-euler-detector/LaurentTwin | NOGO | xi(s)(2 cosh((s-1/2) log q) + c) is a completed Euler product with zeta's FE, pole at 1 and off-line zeros; it lacks Lambda >= 0 and local temperedness at q | FE + Euler product + pole do not suffice | - | - | N | N | N | N | N | P | N | PROVED |
| 46 | sym-power-positivity/ThmB | NOGO | Beurling zeta with Euler product, Lambda >= 0, simple pole at 1, continuation, and zeros up to any theta < 1 | Euler product + positivity + pole without FE do not suffice | - | - | N | N | N | N | N | N | P | LITERATURE |
| 47 | b-euler-detector/WeilClassRadius | NOGO | over the class of tempered local data, Weil positivity holds only to support 0.7228 (worst case alpha_2 = -1) | class-uniform arguments stop at support 0.7228 | local temperedness class | support | N | ? | F | F | ? | ? | ? | MEASURED |
| 48 | bootstrap/Lemma1-3 + nyman-baez-duarte/ThmC | NOGO | mollified moments, pointwise detectors, Halasz-Montgomery and Nyman-Beurling rates under ZF(theta) all return f(theta) = theta | no contraction of the abscissa | ZF(theta), FE, growth | Re s > theta | N | N | N | N | P | ? | ? | PROVED |
| 49 | eq48/Thm4 + g-antibridge/no-margin | NOGO | for every eta > 0 some test has \|Q_L(v)\| < eta E_gamma(v); 1 - \|\|T\|\| = 2.7e-30 on six nodes | no margin theta < 1 exists on finite tests | - | real nodes | P | ? | N | N | ? | ? | N | PROVED / MEASURED |
| 50 | zf-audit-inputs/H1-Lean78 | INEQ | zeta(s) != 0 and L(s,chi) != 0 for Re s > 7/8 | the only proved zero-location statement beyond the classical region | Hecke cubic rows, sharp mean values, FE | Re s > 7/8 | F | F* | F* | F* | F(a>3/8) | F* | ? | PROVED (Lean; follow-ups unrefereed) |
| 51 | b-toeplitz-beyond/Thm1-2 + b-conjecture-22-1/D1-D2 | INEQ | damped Weil positivity W_theta >= 0 on all supports iff zero-free Re s > 1/2 + theta | restatement of the half-plane as a positivity | = ZF(1/2 + theta) | damping theta | F | F | N | N | F(a>theta) | F* | N | PROVED equivalence; holds for zeta at theta >= 3/8 |
| 52 | r2-tro6-polar-theorem/PolarExpansion + RB | IDENT | polar part of the theta-row form = sum of <= 12 terms E/L(5/6+t, chi_theta); TRO6(eta) iff a bound on the non-polar remainder | where multiplicativity enters the 7/8 method | 1/L(s,chi) (multiplicativity) | 5/6 line | F | N | F* | F* | ? | ? | ? | PROVED (unrefereed) |
| 53 | tro6 large sieves, PropS, LemmaN, GM counts | INEQ | large-sieve and Cauchy-Schwarz steps of the 7/8 architecture hold for arbitrary coefficients | bilinear forms | none (Euler-blind) | mean values | P | N | P* | P* | P* | P* | ? | PROVED (several referee repairs) |
| 54 | lambda-from-halfplane/LemmaR | INEQ | Lambda <= 0.116060107834762 given the 0.874886647 half-plane | de Bruijn-Newman constant | half-plane input | heat axis | F | N | N | N | F | ? | N | CERTIFIED replay, conditional |
| 55 | b-alpoge-furman/AF chain | INEQ | Gabor compression of Weil's form gives a proportion of zeros on the line | proportion (MV-CAP) | prime-side second moment | windows | F | ? | ? | ? | F | ? | ? | QUOTED |
| 56 | b-dyson-defect/defect sign | MEAS | defect Q + 1 > 0 at every height measured | pair statistics | - | zero statistics | P | P | P | F | N | ? | ? | MEASURED (1.04e8 zeros) |
| 57 | eq48/Thm3 = Weil positivity | TARGET | all real-node Pick matrices PSD on one interval <=> one-sided Weil positivity <=> RH | target | - | - | F | F | F | F | F | F | N | PROVED equivalence |
| 58 | spinor: S causal / sq-hankel Cor3b / sq-causal (ME) | TARGET | Gamma_- = 0 <=> \|I(u)\| <= sqrt(2 pi) Dl exp(-u^2 Dl^2/2) for u < 0 <=> Re T_Q >= -Re L_Q on Re s > 1/2 <=> RH (above t0) | target | - | - | F | F | F* | F* | F | F | N | PROVED equivalences |
| 59 | cc-latest/ThmB | TARGET | RH <=> inf_N eps_N > -infinity: any finite L^2 lower bound Q_L(v) >= -C \|\|v\|\|^2 on one accumulating node family implies Q_L >= 0 | target with unbounded slack in the constant | - | real nodes | F | F | ? | ? | F | F | N | PROVED (refereed) |
| 60 | ff-transplant/PropS | TARGET | RH <=> R_x(l) = sum_rho e^{rho l}/(x^2 - rho^2) >= -C(1+l)^m for l >= 0 (one-sided polynomial bound) | target with polynomial slack | Landau | x > 1/2 | F | ? | ? | ? | F | ? | N | PROVED |
| 61 | g-odd-sign-tp/TS + g-antibridge/B2 | TARGET | RH <=> Loewner kernel of phi = -G'/G strictly totally positive of every order <=> K_e >= 0 on one interval <=> Theta(t) completely monotone | target | Loewner | interval | F | ? | ? | ? | F | F | N | PROVED |

## Minimal sets (computed by `gen_table.py`)

A set of usable rows (types IDENT, INEQ, INPUT, RIGID; TARGET, NOGO and MEAS rows excluded) is a hitting set if every control violates at least one member. Rows with the same failure signature are interchangeable, so minimal sets are listed by signature class.

### Strict (F only), brief's controls DH, HEAT, TW+, TW-, EA

Signature classes:

- S1 = fails {DH, HEAT, TW+, TW-, EA}: rows [50]
- S2 = fails {DH, TW+, TW-, EA}: rows [34]
- S3 = fails {DH, HEAT, TW+, TW-}: rows [36]
- S4 = fails {DH, HEAT, EA}: rows [25, 51]
- S5 = fails {DH, HEAT, TW-}: rows [27, 30]
- S6 = fails {DH, TW+, TW-}: rows [35, 52]
- S7 = fails {DH, EA}: rows [40, 41, 54, 55]
- S8 = fails {DH, HEAT}: rows [28, 33, 38]
- S9 = fails {DH, TW-}: rows [29, 31, 32]
- S10 = fails {TW+, TW-}: rows [17, 19, 20]
- S11 = fails {DH}: rows [7]
- S12 = fails {EA}: rows [8, 15, 37]
- S13 = fails {HEAT}: rows [23]

Minimal hitting sets (24):

- {S1}
- {S12, S3}
- {S10, S4}
- {S13, S2}
- {S4, S2}
- {S4, S6}
- {S4, S3}
- {S5, S2}
- {S8, S2}
- {S2, S3}
- {S3, S7}
- {S12, S10, S5}
- {S12, S10, S8}
- {S12, S13, S6}
- {S12, S5, S6}
- {S12, S8, S6}
- {S10, S13, S7}
- {S10, S5, S7}
- {S10, S8, S7}
- {S13, S6, S7}
- {S5, S6, S7}
- {S8, S6, S7}
- {S11, S12, S10, S13}
- {S12, S10, S13, S9}

### Strict (F only), all seven controls

Signature classes:

- S1 = fails {DH, HEAT, TW+, TW-, EA, NR}: rows [50]
- S2 = fails {DH, TW+, TW-, EA, NR}: rows [34]
- S3 = fails {DH, HEAT, EA, NR}: rows [25, 51]
- S4 = fails {DH, HEAT, TW-, NR}: rows [27, 30]
- S5 = fails {DH, HEAT, TW+, TW-}: rows [36]
- S6 = fails {DH, TW-, NR}: rows [29]
- S7 = fails {DH, TW+, TW-}: rows [35, 52]
- S8 = fails {DH, EA}: rows [40, 41, 54, 55]
- S9 = fails {DH, HEAT}: rows [28, 33, 38]
- S10 = fails {DH, TW-}: rows [31, 32]
- S11 = fails {TW+, TW-}: rows [17, 19, 20]
- S12 = fails {DH}: rows [7]
- S13 = fails {EA}: rows [8, 15, 37]
- S14 = fails {HEAT}: rows [23]

Minimal hitting sets (0):


### Lenient (F or N), brief's controls

Signature classes:

- S1 = fails {DH, HEAT, TW+, TW-, EA}: rows [34, 50, 51, 54]
- S2 = fails {DH, HEAT, TW+, TW-}: rows [35, 36, 52]
- S3 = fails {HEAT, TW+, TW-, EA}: rows [19]
- S4 = fails {DH, HEAT, EA}: rows [25, 37, 40, 41]
- S5 = fails {DH, HEAT, TW-}: rows [27, 29, 30, 31]
- S6 = fails {DH, TW+, TW-}: rows [7, 20]
- S7 = fails {TW+, TW-, EA}: rows [8, 15]
- S8 = fails {HEAT, TW+, TW-}: rows [9, 23, 26]
- S9 = fails {DH, EA}: rows [55]
- S10 = fails {DH, HEAT}: rows [28, 33, 38]
- S11 = fails {DH, TW-}: rows [32]
- S12 = fails {TW+, TW-}: rows [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 16, 17]
- S13 = fails {HEAT}: rows [42, 53]

Minimal hitting sets (29):

- {S1}
- {S12, S4}
- {S6, S3}
- {S6, S4}
- {S7, S4}
- {S7, S5}
- {S7, S10}
- {S7, S2}
- {S8, S4}
- {S8, S9}
- {S3, S4}
- {S3, S5}
- {S3, S10}
- {S3, S11}
- {S3, S2}
- {S3, S9}
- {S4, S2}
- {S2, S9}
- {S12, S5, S9}
- {S12, S10, S9}
- {S12, S13, S9}
- {S6, S7, S8}
- {S6, S7, S13}
- {S6, S5, S9}
- {S6, S10, S9}
- {S6, S13, S9}
- {S7, S8, S11}
- {S7, S11, S13}
- {S7, S13, S9}

### Lenient (F or N), all seven controls

Signature classes:

- S1 = fails {DH, HEAT, TW+, TW-, EA, NR, B}: rows [51]
- S2 = fails {DH, HEAT, TW+, TW-, EA, B}: rows [54]
- S3 = fails {HEAT, TW+, TW-, EA, NR, B}: rows [19]
- S4 = fails {DH, HEAT, TW+, TW-, EA, NR}: rows [34, 50]
- S5 = fails {DH, HEAT, TW-, NR, B}: rows [27]
- S6 = fails {DH, TW+, TW-, B}: rows [7]
- S7 = fails {TW+, TW-, EA, B}: rows [8, 15]
- S8 = fails {HEAT, TW+, TW-, B}: rows [9, 23, 26]
- S9 = fails {DH, HEAT, EA, NR}: rows [25]
- S10 = fails {DH, HEAT, TW-, NR}: rows [29, 30]
- S11 = fails {DH, HEAT, TW+, TW-}: rows [35, 36, 52]
- S12 = fails {TW+, TW-, B}: rows [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 16, 17]
- S13 = fails {DH, HEAT, EA}: rows [37, 40, 41]
- S14 = fails {DH, HEAT, TW-}: rows [31]
- S15 = fails {DH, TW+, TW-}: rows [20]
- S16 = fails {HEAT, B}: rows [42]
- S17 = fails {DH, EA}: rows [55]
- S18 = fails {DH, HEAT}: rows [28, 33, 38]
- S19 = fails {DH, TW-}: rows [32]
- S20 = fails {HEAT}: rows [53]

Minimal hitting sets (54):

- {S1}
- {S12, S9}
- {S12, S4}
- {S6, S3}
- {S6, S9}
- {S6, S4}
- {S7, S9}
- {S7, S5}
- {S7, S10}
- {S7, S4}
- {S8, S9}
- {S8, S4}
- {S3, S15}
- {S3, S9}
- {S3, S5}
- {S3, S18}
- {S3, S10}
- {S3, S14}
- {S3, S19}
- {S3, S4}
- {S3, S11}
- {S3, S13}
- {S3, S2}
- {S3, S17}
- {S9, S2}
- {S5, S4}
- {S5, S2}
- {S10, S2}
- {S4, S16}
- {S4, S2}
- {S12, S5, S13}
- {S12, S5, S17}
- {S12, S10, S13}
- {S12, S10, S17}
- {S6, S5, S13}
- {S6, S5, S17}
- {S6, S10, S13}
- {S6, S10, S17}
- {S8, S5, S13}
- {S8, S5, S17}
- {S8, S10, S13}
- {S8, S10, S17}
- {S15, S9, S5}
- {S15, S9, S16}
- {S15, S5, S13}
- {S15, S5, S17}
- {S9, S5, S11}
- {S9, S11, S16}
- {S5, S11, S13}
- {S5, S11, S17}
- {S15, S10, S13, S16}
- {S15, S10, S16, S17}
- {S10, S11, S13, S16}
- {S10, S11, S16, S17}

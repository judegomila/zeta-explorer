# MAP_PENDING: owed edits to push/OBSTRUCTION_MAP.md (not applied)

Written 2026-11-17 by lane `c2-repair-owed-passes`. `push/OBSTRUCTION_MAP.md` was not edited. Each entry gives the
place, the action, and the exact proposed text. Row ids continue the numbering of each table (last ids in the file:
P34, G21, Q18, S10, Z20, F7). Status words follow the map (PROVED, PROVED-rel, MEASURED, CLASSICAL, OPEN); "refereed
once" means one lane referee; "refereed twice" means the lane referee plus the second pass of this lane (REFEREE2.md).
No entry is a statement about zeros of zeta.

## A. Section 6 ("What is not covered")

### A1. Item 6 (Hecke defect on p-primitive tests for all p jointly). Replace the item by:

> 6. **Hecke defect on p-primitive tests for all p jointly: closed (`c1-spinor-hecke-primitive`, refereed twice).** On smooth compactly supported one-sided tests, jointly S-primitive tests (finite S) are dense in norm and in Q_L simultaneously, and the all-prime class {W(1/2) = 0} likewise; the infimum of Q_L/norm^2 and the negative index are the same as on all tests (row P35). Not established: the same statement for DH (zeros right of Re s = 1) and for E_a with a >= 1/8; the identification of the bound with P10. Open remainder: size of sum over zeros of abs(zeta_S(1/2 + i gamma))^2 abs(W(i gamma))^2 against norm(Z_S w)^2 as S grows (largest-value type).

### A2. Item 7 (jointly inner multi-delay sections). Replace the item by:

> 7. **Multi-delay sections of the prime chain: closed in two forms (`c1-multidelay-bohr-section`, refereed twice); three forms open.** Closed: (a) additive, finite P: no positive-real function h = H((p^{-z})_{p in P}), Re H >= 0 on the polydisc, can be split off xi'/xi as a positive-real summand unless it is an imaginary constant (row Q12); (b) multiplicative: no bounded multi-delay factor divides S (trivial, gamma growth). Within the unipotent chain family the joint defect is rank one and additive and every twist is a torus translation. Open: a J-inner linear-fractional section in several delays with Theta(0) = M(c_0) U_0, c_0 > 0, not additive; infinite P (needs sum over P-smooth m of m^{-c} finite for some c < 1/2); the DH analogue (the diagonal term is not a point evaluation, no forced sign); boundary nodes of R_a for a >= 1/2 (not treated in round 1). Against, unchanged: the Fejer-tapered joint section is an explicit-formula identity equivalent to RH that uses no multiplicativity.

### A3. Item 8 (positive-definiteness of log F in the strip). Replace the item by:

> 8. **Positive-definiteness of log F(sigma + iu) for 1/2 < sigma <= 1: closed as a restatement (`c1-pd-log-strip`, refereed once).** The Fourier transform of the horizontal branch is the prime atoms minus the density (e^{(1-sigma)x} - 1)/x plus one term per zero right of sigma. Raw positive-definiteness fails on every line 1/2 < sigma < 1 (Omega-theorem argument). Positivity of the compensated transform CP(sigma) is equivalent to no zeros with Re s > sigma, and the implication towards zeros uses only the half-line x < 0, which contains no primes. Three sigma-transport mechanisms fail at the pole; a general no-transport theorem is not proved.

### A4. Item 10 (semidefinite coupling in one window). Append:

> Round 1 (`c1-window-sdp-scaling`, refereed once): in the window model with outside zeros fixed to zeta's, the real-node Pick LMI of order K <= 24 is linear in the zero measure and equals the explicit-formula LP on the five tabulated node families at 15 (T, K) cells (row S11). Not covered: node-uniform statement at (T, K) = (100, 24); LMIs whose on-line terms are not sign-definite (sector matrices P +- B); the windowed Nehari problem.

### A5. Item 11 (sheared Hecke commutator; Fricke w_4). Replace the item by:

> 11. **Sheared Hecke commutator at tau -> 0 and loading on X_0(4)(R) with Fricke w_4: closed (`c1-shear-hecke-fricke`, refereed once).** [V_n, G_tau] = G_tau (exp(tau l (u + l)/4) - 1) V_n, l = log n (windowed L^2 norms; whole-line only for kappa-type kernels). The eigen-defect of 1 - lambda V_p has tau-order exactly 1 iff c(pm) = lambda c(m) for all m; zeta, zeta(s + a), completely multiplicative sign twists and unimodular twists all have order 1, so the statement is the identity "multiplicative at p", not an inequality. w_4 on the arc is u -> -u (evenness only). For tau < 0 the termwise prime expansion converges for a sign-twisted control as well; that it cannot be carried to tau = 0 is heuristic (Rodgers-Tao), not a theorem (row G22).

### A6. Item 12 (two-sided information on S(t); shifted partners). Append:

> Shifted-partner part decided (`c1-missing-controls` Part D, refereed twice): for every fixed 0 < a <= 1/2, S(T) - (1/pi) arg zeta(1/2 + a + iT) exceeds M on a proportion of [T, 2T] tending to 1/2 and is below -M on a proportion tending to 1/2 (PROVED-rel Selberg's central limit theorem for S(t) and the Bohr-Jessen limit law; both statements checked against the classical ones, sources not opened); hence no fixed shifted pair is an interlacing partner of Xi. Open: shifts a(T) of order 1/log T; partners that are not shifts.

### A7. Item 14 (controls not run). Replace the item by:

> 14. **Controls not run: run in round 1 (`c1-missing-controls`, refereed once), same outcomes as inferred.** Sign twists in seven `h-*` lanes: the DH-failing coefficient step passes exactly in six and is not formulable in `h-klein-fricke`; the twists fail at the functional-equation step. Backward heat in `stack-feasibility` and (from Lemma A plus measured zeros, no Ritz run) in `sq-canonical-det`. DH theta kernel: Arb certificate (positive, strictly log-concave on u >= 0, u L'' - L' < 0 on u > 0). Remaining: Ritz run of K[t] for the heat family at tau = -2; a sign twist with a zero in 7/8 < Re s < 1 as a control for the 7/8 mechanism; controls SEL and the block-permuted Nyman-Beurling family (section 2 additions below).

### A8. New items (append after item 15):

> 16. **Pointwise bound for sum_k mu(k) r_b(x/k) for one fixed cofinal sawtooth remainder r_b** (`e1-cofinal-legendre-dual`, source Step 7). For: it uses the integers and all primes jointly, is uniform in x, and fails for DH, Liouville and theta^3 at Lambda_a >= 0. Against: only a mean-square bound is argued (MV-CAP), and E_a is not separated at the level of exponents.
> 17. **Restricted-level Legendre identity plus positivity (half-weight Chebyshev / Legendre LP below full level).** For: the referee of `e1-forcing-free-bilinear-split` removed the claimed parity cap (2.32 sqrt X from six levels; exact S(X) at D = X^0.7 for X = 1e5), so this case is not closed. Against: the remaining polylog gap is a quantity of RH strength, and positivity enters linearly.
> 18. **Genuine cusp forms on the double cover of GL(3), and Whittaker coefficients of cusp-induced Eisenstein series, as order-2 rows** (`e1-gl3-theta-order2-rows`). For: not computed; item 1 stays open only here. Against: in every computed double-cover case the quadratic symbol enters Hecke relations as a Gauss sum, placing the reciprocal at shift 1/2 and cancelling the gain h/r = 1/2.
> 19. **Multivariate (polydisc, per-prime weights) Lee-Yang property as a one-sided bound on pole-renormalised Euler stages in the strip** (`c1-leeyang-krein-limit`). For: local boundedness of these stages on {Re s > theta, s != 1} is equivalent to the zero-free statement, and the single-variable Lee-Yang inequality was the only bound tried. Against: the single-variable consequence has exponent of order P, weaker than the trivial bound.
> 20. **Window defect: commutator of the cutoff Q_c with Hecke operators** (`c1-spinor-hecke-primitive` Lemma 5). For: it is the one place where a multiplicative mechanism acts on H_c non-trivially. Against: the formula is kernel-independent (holds for every control), so the function must enter through the test vector.

## B. Section 2 (controls)

### B1. Row TW-, column "Use". Append:

> Exact example with zeros off the line in the strip: the Liouville twist, sum lambda(n) n^{-s} = zeta(2s)/zeta(s), zeros at rho/2 (Re s = 1/4 under RH; referee value abs(F) = 5.5e-31 at 1/4 + 7.06736257087i). It tests conclusions of the form "all zeros in the open strip lie on Re s = 1/2"; its off-line zeros lie in Re s < 1/2.

### B2. Row DH, column "Has". Replace "positive even theta kernel, Csordas convexity (measured)" by:

> positive even theta kernel, strictly log-concave on u >= 0, u L'' - L' < 0 on u > 0 (Arb certificate, `c1-missing-controls` Part C; evenness classical); GHS holds on the grid sigma in (0.5, 30.5] (measured)

### B3. Row HEAT, column "Lacks". Append:

> Off-line zeros located (mpmath quadrature at 110/300 digits, refereed once): tau = -0.1: 0.0215579 + 415.2562790i; tau = -0.5: 0.1981079 + 150.6922461i; tau = -2: 0.2485774 + 49.7154476i and 0.6247240 + 60.7078706i (the latter is Re s = 1.125 in the lane's variable).

### B4. Notes on use, "Auxiliary controls used in single lanes". Append:

> SEL: twisted Selberg zeta of Gamma(2) (Euler product over geodesics, s <-> 1-s equation for the order-2 function, real exceptional zeros off the line; lacks INT, order one, finite degree and the sign of the zero side; none of positive-list items 16-23 fails quantitatively against it; it tests nothing at height > 0) (`e1-selberg-twist-control`, measured, not interval-certified). Block-permuted non-multiplicative Nyman-Beurling family (smaller ratio, 1.4 to 2.1, than the Heegner family) (`e1-heegner-averaged-nb-span`). Non-multiplicative random signs on prime powers (behaves as TW- on Q_L spans) (`c1-spinor-hecke-primitive` referee).

## C. Section 3, existing rows

### C1. Row P29, column "Where it stops". Append:

> In the strip 1/2 < sigma < 1 (`c1-pd-log-strip`, refereed once): raw positive-definiteness of log zeta(sigma + iu) fails on every line; the compensated form CP(sigma) is positive iff there is no zero with Re s > sigma, with the implication towards zeros using no primes. The separation of zeta from DH and the lifts by exact positive-definiteness therefore stays on Re s > 1.

Column "Source": add `c1-pd-log-strip`.

### C2. Row Q12, columns "Where it stops", "Status", "Source". Replace by:

> | Q12 | Splitting L into positive-real prime pieces; single-delay and multi-delay section extraction | If L - sum_p h_p is positive-real with prime-periodic h_p, every h_p is an imaginary constant. No Blaschke-Potapov single-delay factor at interior or boundary nodes. Multi-delay, finite P: for H holomorphic with Re H >= 0 on the polydisc and h = H((p^{-z})_p) lossless, sum over poles gamma_j <= T of r_j zeta(1/2 + i gamma_j) = (T/2 pi)(H(0) + conj h(1/2)) + O(T^{1/2+eps}), real part at least (T/2 pi) Re H(0); so if L - h is positive-real then h is an imaginary constant (hypothesis implies RH; proof does not assume it). No bounded multi-delay factor divides S. Multiplicativity is used: the diagonal term is a point evaluation of conj H only for completely multiplicative coefficients. Open: J-inner linear-fractional section in several delays with c_0 > 0; infinite P; DH analogue; boundary nodes of R_a for a >= 1/2. | PROVED (single-delay: author; multi-delay: refereed twice, contour step re-derived) | — (no-go) | `sq-causal-cascade`; `g-passive-cascade`; `c1-multidelay-bohr-section` |

### C3. Row P14, column "Where it stops". Append:

> Gram side (`e1-nb-gram-period-transfer`, refereed once; proved, unrefereed beyond that; novelty unchecked): 1/(64 * 2^(Omega_N) * N^2) <= lam_min(G_N) <= (3 + log N)/(N - 1)^2, Omega_N = max over d <= N of omega(d), so lam_min(G_N) = N^(-2+o(1)); exponent 2 exactly is open. The same law is measured for DH (exponent -1.928), four Dirichlet characters and two periodic sequences without Euler product. It bounds the size of the optimal coefficients, not d_N.

### C4. Row Q4 (prime side by Cayley expansion), column "Where it stops". Append:

> Differentiating the Hankel data along the heat flow does not change this row (`e1-burgers-cascade-anticausal`, refereed once): the prime-side flux is zero for every twist (argued), and the difference is the residue sum over zeros.

## D. Section 3, new rows

Section 3.1 (positivity reformulations):

> | P35 | Q_L restricted to jointly p-primitive tests (finite S, and all primes) | M_S = prod (1 - U_p) maps smooth compactly supported tests into themselves with range of infinite codimension, but every test is a limit of jointly S-primitive tests in norm and in Q_L (classical zero-free region); the all-prime class {W(1/2) = 0} is dense in the same sense (non-vanishing on Re s = 1). Infimum of Q_L/norm^2 and negative index are unchanged by the restriction. The Gram matrix of the dilations U_n w does not contain the function: mean of its symbol about e^gamma log P, sup the divergent product prod (1 - p^{-1/2})^{-2}. All-prime Hecke sums Zw lie in the radical (P12). | PROVED for zeta (refereed twice; original Lemma 3(a) "onto" was false); MEASURED for DH, TW-, random signs, E_a, T-NR (sign unchanged by the restriction) | every control at the orthogonalisation step (function-independent); target | `c1-spinor-hecke-primitive` |
> | P36 | Legendre-LP duals: cofinal limits and compactness | Every limit point of dual-feasible points is feasible at every real scale and has density 0 (psi(t) <= 3 log2 t + 3); the LP optima live at t ~ x in x-dependent Moebius-resonant configurations that are not sections of one measure. A fixed cofinal b is controlled only in mean square. | PROVED (refereed once); measured range corrected by the referee | EA* (same exponents); B (Lambda_a >= 0 holds); DH, Liouville, theta^3 fail only at Lambda_a >= 0 | `e1-cofinal-legendre-dual` |
> | P37 | One-sided Landau target through an exact bilinear identity (Vaughan / Heath-Brown split with the forcing removed) | The X^{1/4} Vaughan forcing equals -(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2) and is removed by two linear conditions on the mollifier (residual at most (U + 32 sqrt U + 25)(6 + log X)/sqrt X). After that every identity of this shape is a linear combination of the half-weight Legendre identity with symbol 1 at every zero; the remaining one-sided polylog bound is equivalent to RH. Positivity enters linearly. | PROVED (gauge identity; equivalence); referee: Theorem R(iii) (parity cap at restricted level) is false, verdict stands | EA; TW+ (not excluded by any proved step) | `e1-forcing-free-bilinear-split` |
> | P38 | Nyman-Beurling span chosen by an arithmetic family (Heegner brackets), ratio as the measured quantity | Averaging over discriminants cancels nothing: every averaged bracket is of DH type with off-line zeros (measured). The ratio is 1 + distance^2 to the constant in L^2(dy/y^2): non-increasing by definition, smaller for a non-multiplicative control, blind to a Blaschke floor (< 1e-24 above verified height). inf R = 1 would imply RH; no step bounds the distance. | PROVED (Lemmas A-C); MEASURED (refereed once; horoball formula corrected) | block-permuted non-multiplicative family; DH-type brackets | `e1-heegner-averaged-nb-span` |
> | P39 | Amplifier "one off-line zero forces many" through Bohr sets / Kronecker / strong recurrence | A recurrence hypothesis whose returns each produce a zero is bounded by the zero count, so it is as strong as the zero-free statement. zeta_P never vanishes, so an off-line zero is a Haar-null event carried by the tail beyond every finite prime set; Kronecker gives frequencies only for sets of positive Haar measure. | PROVED (Lemma 1 for gamma_0 > 0, Corollary 2: classical, not new) (refereed once) | DH, EA separated only at the density estimate; TW- not separated (argued) | `e1-sparse-recurrence-amplifier` |
> | P40 | Riemann-Siegel main sum on the prime torus with a Laguerre / Turan sign test | The torus exclusion set is entered by the zeta main sum itself; the sign of the Laguerre expression is decided by the Riemann-Siegel remainder of size N^{-1/2}: one-point, no margin (rows S4, Q13). The coupling theta' = log(main-sum length) is the functional equation alone and holds for DH up to O(t^{-2}). | PROVED identity with the true-time Lag[f] (the frozen-speed form labelled PROVED was false: residual up to 9.69 against 0.168 at N = 10); MEASURED | DH (coupling holds); HEAT (amplitude tilt passes); THW, NR, B, EA not run | `e1-rs-torus-laguerre-orbit` |

Section 3.2 (geometric structures):

> | G22 | Sheared Hecke commutator at tau -> 0; Fricke w_4 on X_0(4)(R) | [V_n, G_tau] = G_tau (exp(tau l (u + l)/4) - 1) V_n; eigen-defect of tau-order exactly 1 iff the coefficients are multiplicative at p (an identity); w_4 gives evenness only; the sheared prime expansion converges only for tau < 0, where the conclusion is false. | PROVED for windowed norms (refereed once; whole-line form holds only for kappa-type kernels) | zeta(s + a), completely multiplicative TW-, unimodular twists (all order 1) | `c1-shear-hecke-fricke` |
> | G23 | Pair-ferromagnet (Lee-Yang chain) representation of Phi | Chain set = complete-graph set = Lee-Yang set for n = 2, 3, 4. For n = 5..9 explicit Lee-Yang polynomials lie outside the Fortuin-Kasteleyn cone K_n (hidden spins allowed). GHS holds on the weak closure of pair-ferromagnet laws and fails for (w^2 - (44/23) w + 1)(w + 1)^44 at w = 108/55, so the closure is a proper subclass of the Lee-Yang class. The separating conditions (GHS, K_n) are kernel-side positivity that Phi and (measured) the DH kernel satisfy. Membership of Phi in the closure would imply RH; strictness for Phi is not established. Stage kernels N = 2, 3, 4, 5, 10: no real-rooted time t <= 0 (certified off-line zero plus closure of Laguerre-Polya under e^{-lambda D^2}, Craven-Csordas Lemma 3.2). | PROVED / EXACT (refereed twice for step 2.1(c) and the GHS input; GHS itself CLASSICAL, source not opened) | DH (GHS holds, measured); U, TW, B pass every stage; EA, NR pass heat-coupled stages at small log M | `c1-leeyang-chain-closure` |
> | G24 | Selberg / Ruelle zeta as a control with functional equation, and as companion in Theorem PC | The s <-> 1-s equation belongs to the order-2 function; the degree-one unimodular Ruelle product has poles where Z has zeros, so every Landau-positivity mechanism holds with reversed inequality. Off-line zeros are real and finitely many. Any non-negative-coefficient coupling c Z'/Z + E with the PSL2(Z) Selberg zeta has sigma* >= 1/2: Theorem PC is silent at rho/2. | PROVED (refereed once); numerics measured | — (the control does not exist in the needed form) | `e1-selberg-twist-control` |

Section 3.3 (square-root lane):

> | Q19 | Lee-Yang stages to a Krein-space limit (rank Gamma_- semicontinuity) | Rank Gamma_- is lower semicontinuous under bounded weak-* convergence. In the self-dual conductor normalisation every stage symbol is inner and tends to -1 on Re z > 0, for zeta and every unimodular twist: the chain carries no information. With gamma factor and pole renormalisation, zero-free in Re s > theta iff the stages are locally bounded on {Re s > theta, s != 1} (Hurwitz + von Koch; no novelty). The Lee-Yang inequality gives a stage bound with exponent of order P, weaker than trivial. | PROVED (refereed once; one unjustified constant in section 5) | U and random twists (same stage pole counts, measured) | `c1-leeyang-krein-limit` |
> | Q20 | Heat-monotone functionals of the anticausal Hankel block or of zero configurations | No unitarily invariant norm of Gamma_-(t) is monotone in t (through the one-pair collision; 50-digit witnesses between collisions). The sum of Re p over right-half-plane zeros of D_t = F_t + alpha F_t' is continuous and strictly decreasing while positive. A non-negative functional vanishing on axis configurations and monotone along the flow is non-increasing, so it bounds t = 0 only by values at t < 0, where the conclusion is false. | PROVED for polynomial heat solutions (refereed once) | HEAT; DH-type and E_a-type configurations (no proved step fails) | `e1-burgers-cascade-anticausal` |

Section 3.4 (stacking):

> | S11 | Joint window SDP: real-node Pick LMI coupled with the explicit formula | The real-node Pick matrix is linear in the zero measure; on-line pairs add PSD terms; a quartet is 2 P_t + R with R of order sigma^2; the LMI never contains the primes. Joint SDP = explicit-formula LP for T in 1e2..1e6, K in {6, 12, 24} on five node families (grid-certified; product 0.32 at (100, 24), below 1.1e-5 for T >= 1000). DH is accepted at its true quartet. | PROVED (linearity, PSD); GRID-CERTIFIED; node-uniform statement at (100, 24) OPEN (refereed once) | DH; twisted prime sides give the same kind of exclusion sets | `c1-window-sdp-scaling` |

Section 3.5 (zero-free machinery):

> | Z21 | Order-2 version of the 7/8 mechanism: theta and half-integral weight rows on the double cover of GL(2), theta-induced rows on GL(3) | A Moebius sign on a quadratic symbol and centring on the unitary axis did not occur together in any computed case: the symbol enters Hecke relations as a Gauss sum over p, so the reciprocal sits at shift 1/2 and cancels the gain h/r = 1/2. Model abscissa 1, or detection only for beta >= 1. Not computed: genuine cusp forms on the double cover of GL(3). | PROVED for the computed families (refereed once; non-genericity of GL(3) theta cited, not opened) | TW- (Gram is sign-blind: same rows); controls give the same rows in the non-symbol pivot | `e1-gl3-theta-order2-rows` |

Section 3.6 (flow and Lambda):

> | F8 | Heat-time certificate anchored in the Euler region (past collisions read at the anchor) | The test 2 pi^2 c > C fails for every fixed c > 0: the Euler product modulates the compression ratio of adjacent zero pairs at the anchor by order 1/L^2 with both signs, above the trace x^{-C/(2 pi^2)} a past collision leaves. The anchor step returns its input half-plane (f(theta) = theta); a certificate needs S transport below the anchor, i.e. zero positions at the vortex height. | ARGUED + MEASURED (Lemmas 1, 2 PROVED; Lemma 3 midpoint formula is not the leading order) (refereed once) | EA (passes the anchor step; constant-S certificate certifies 4 of 12 collided pairs at a = 0.1, L = 6); TW- (the deficit bound does not use positivity) | `e1-euler-anchor-heat-certificate` |

## E. Section 4 (proved results worth keeping), proposed additions

> - Weighted first moment of zeta over the poles of a lossless multi-delay one-port (finite P): sum over gamma_j <= T of r_j zeta(1/2 + i gamma_j) = (T/2 pi)(H(0) + conj h(1/2)) + O(T^{1/2+eps}). `c1-multidelay-bohr-section` Theorem A (refereed twice). Single-progression case is the known mean of zeta on vertical arithmetic progressions.
> - lam_min of the Nyman-Beurling Gram matrix: 1/(64 * 2^(Omega_N) * N^2) <= lam_min(G_N) <= (3 + log N)/(N - 1)^2. `e1-nb-gram-period-transfer` Theorem 1 (proved, refereed once; novelty unchecked; no bearing on zeros).
> - The Vaughan X^{1/4} forcing is a gauge term: -(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2). `e1-forcing-free-bilinear-split` (refereed once).
> - Strict inclusion: weak closure of pair-ferromagnet laws inside the Lee-Yang class (GHS certificate at degree 46; FK-cone separators n = 5..9). `c1-leeyang-chain-closure` (refereed twice on the two inputs). Likely in the literature in the continuous form (Ellis-Newman); not claimed as new.
> - Density of jointly primitive tests in norm and in Q_L (Lemma 3'), and of {W(1/2) = 0} (Lemma 4'). `c1-spinor-hecke-primitive` REFEREE.md section 1 and REFEREE2.md (Lemma 4' has one author, unrefereed).

## F. Section 5 (the common wall), one sentence to add

> Round 1 and engine batch 1 (18 lanes): where a property separated zeta from completely multiplicative twists it was an identity equivalent to the target (CP(sigma), the Fejer-tapered section, local boundedness of pole-renormalised stages), and the implication towards zeros did not use multiplicativity; multiplicativity entered only as an equality or at stage level, and positivity of Lambda only linearly. A mechanism meeting R3 needs an inequality that uses the Euler product and the functional equation in the same step.

## G. Section 7 (referee-broken claims index), rows to add

> | "M_S maps the domain onto itself; Q_L o M_S is congruent to Q_L" (Lemma 3(a)) | c1-spinor-hecke-primitive | Range has infinite codimension; replaced by simultaneous approximation in norm and in Q_L (zeta: proved; DH and E_a with a >= 1/8: not established) |
> | "The bound on jointly primitive tests is P10 itself" | c1-spinor-hecke-primitive | P10 is proved on exponential node families; the 0-or-minus-infinity dichotomy on compactly supported tests is not established |
> | "No sign twist with a false zero conclusion was constructed" | c1-missing-controls | The Liouville twist zeta(2s)/zeta(s) is an exact twist with zeros off the line (at rho/2) |
> | Theorem R(iii): parity cap (4 - o(1)) sqrt X at restricted level | e1-forcing-free-bilinear-split | False: Theorem P does not apply to Chebyshev-class weights; uniqueness of the dual certificate, "5-8x", "X^0.44", "4.7e-7 by proof" also do not survive |
> | Section 2(b) identity with the frozen-speed torus quantity Lag_N, labelled PROVED | e1-rs-torus-laguerre-orbit | False as written (residual up to 9.69 against 0.168 at N = 10); correct with the true-time Lag[f] |
> | "Phi in cl(L) is strictly stronger than RH" | c1-leeyang-chain-closure | Only the class inclusion is strict; for the single law Phi strictness is not established |
> | Lemma 2 "PROVED for whole-line L^2 norms" | c1-shear-hecke-fricke | Whole-line defect undefined for controls without a functional equation; correct for windowed norms |
> | Proposition D hypothesis at (T, K) = (100, 24) for general node sets | c1-window-sdp-scaling | Fails outside the tabulated families (product up to 6.4); equality there rests on the single-quartet criterion; bound for T >= 1000 is 1.1e-5, not 4e-6 |
> | kron.py labels "Gram symbol sup 15709 / 28.83, mean 5.06 / 2.74" | c1-spinor-hecke-primitive | Those are the values for abs(m_S)^2; the Gram symbol abs(zeta_S)^2 has sup 1.085e6 / 551.9 (at tau = 0) and mean 8.311 / 4.375 |
> | Horoball formula in the claim; "killed" | e1-heegner-averaged-nb-span | Formula inverted (Im z >= sqrt(Dmax)/(2y)); the verdict is an obstruction, not a refutation of a statement |

## H. Not proposed

- No row is proposed for `e1-nb-gram-period-transfer` beyond C3 (it stops at P14 and P15).
- Rows A1, A3, A6, N1, N9, N11, N12, OBS-* referenced by the engine are not in `push/OBSTRUCTION_MAP.md`; no edit to them is listed here.
- Section 1 ("Status in ten lines") is unchanged by these edits: no bound moves and no requirement beyond R1 at stage level was confirmed in any of the 18 lanes.

---

## Status 2026-11-18 (lane `c5-repair-engine-map-r4`)

Sections A to G above were applied to `push/OBSTRUCTION_MAP.md` by `c3-repair-map-theorem-a` (round 3); the title line "not applied" is historical.
The round-4 pending rows (ROUND_LOG "Open items carried forward", round 4) were applied by `c5-repair-engine-map-r4`; script
`push/c5-repair-engine-map-r4/apply_map.py`, previous file `push/c5-repair-engine-map-r4/before/OBSTRUCTION_MAP.md`:

| Pending item | Applied as |
|---|---|
| Gonek stage on-line theorem is P-independent | row P44 (with the Rouche degree form and the collision law of `c4-stage-collision-law`) |
| Fejer-stage F' = Weil functional on Fejer tests | row P45 (cross-references P10, P1, eq48) |
| Helson relative theorem | row P46; section 4 entries 48, 49 |
| Ramare / Matomaki-Radziwill (three rows; sources opened first) | rows P47 (bandwidth; arXiv 1707.01315 abstract), P48 (pointwise; ar5iv text of 1501.04585, Lemma 8, Section 8, Theorem 1), P49 (pretentious / log-averaged; arXiv 1503.05121 abstract) |
| Lax-Phillips Hecke compression | row G26 |
| THIN as a control with a table row | section 2 table row THIN and note; short-interval input marked "cited from memory" until `c5-thin-walk-replay` reports |
| (added) round-4 paragraph, open items, broken claims | section 5 paragraph "Round 4"; section 6 item 14 update and items 21, 22; section 7, four rows |

Still pending (not applied by this lane):

- THIN: replace "cited from memory" by the opened statement (or correct the row) when `c5-thin-walk-replay` reports; set `ctl-THIN` status in `engine/build_graph.py` accordingly.
- Row P46: Theorem 2 of `c5-repair-engine-map-r4` (section 4 entry 49) has one author and no referee. If a referee breaks it, remove entry 49 and the last sentence of the "Where it stops" cell of P46.
- Row P44: Montgomery's fixed-X omega theorem is recalled, not opened. Row P48: the two-function averaged Elliott statement was not found in the abstract opened; the DH pass does not use it.
- Section 1 ("Status in ten lines") is unchanged: no bound moves, no requirement beyond R1 (relative or at stage level) was confirmed in round 4.
- Rows for round-5 lanes: none proposed here.

## Status 2026-11-18, second (lane `c6-repair-referee-debts-r5`)

Applied to `push/OBSTRUCTION_MAP.md` (script `push/c6-repair-referee-debts-r5/apply_map.py`; previous file `push/c6-repair-referee-debts-r5/before/OBSTRUCTION_MAP.md`; 471 -> 490 lines):

| Pending item (ROUND_LOG round 5, "Open items carried forward") | Applied as |
|---|---|
| seven device rows with the referee's six wording corrections | section 3.9, rows D1 to D7 |
| row Z15b (corrected free-geometry statement) | row Z15b, with Lemma U marked as refereed twice |
| angular-family row after Theorem 7 is refereed | row Z22; Theorem 7 (iv) labelled ARGUED for the abstract family |
| section 4 entry 49 and row P46: "largest real zero" | both corrected; Theorem 2 marked as two referee passes; section reference 2.3 |
| THIN: replace "cited from memory" | control row THIN and its note; ray-class variant relative to Coleman 1990 Theorem 2.1 as quoted; `ctl-THIN` status proved-relative in `engine/build_graph.py` |
| (added) | interpolation twin as an auxiliary control (section 2 notes); row count line recounted; header update line |

Still pending (not applied by this lane):

- Row for `c5-twisted-helson-arcs`: its proposed number P44 is taken by the Gonek-stage row; needs a new number (P50) and the qualifier limsup abs(S(x))/x > 0 of its referee.
- Rows or notes for `c5-thin-propd-dichotomy` and `c5-marks-circularity-order2`; update of row Z15 and section 6 item 1 after Theorems B, C are checked against the manuscript (lane `c6-marks-bc-manuscript-check`).
- Section 7 (referee-broken claims index): round-5 entries (Proposition 5 error term of the angular lane; verdict statement 3 of the target-reflection lane; control claim of `c5-thin-propd-dichotomy`).
- Section 1 ("Status in ten lines") unchanged: no bound moves.
- Sources still recalled, not opened: Weil 1952 (Jacobi sums; Remark 8 of the angular lane); Turan's equivalence (row D6); Coleman 1990 primary text; the Baker-Harman-Pintz counting constant; Montgomery's fixed-X omega theorem (row P44); `stack-combinator/TABLE.md` has no THIN row and was not edited.

## Status 2026-11-18, third (lane `c7-repair-engine-map-r6`)

Applied to `push/OBSTRUCTION_MAP.md` (script `push/c7-repair-engine-map-r6/apply_map.py`; previous file `push/c7-repair-engine-map-r6/before/OBSTRUCTION_MAP.md`; 490 -> 515 lines; edit list `map_edits.json`). The map parser accepts row ids of the form letters + digits + optional letter only, so the lane labels A3-C1 .. A3-R were renumbered.

| Pending item (ROUND_LOG round 6, "Open items carried forward") | Applied as |
|---|---|
| A3-C1, A3-C2, A3-C3, A3-R (square intertwiners) | rows G27, G28, G29, G30 (label kept in the route cell), with the referee's corrections to Theorem H2 |
| P50 (quadratic positivity) | row P50; section 6 item 9 replaced (closed for pointwise outputs; density half not run) |
| row for the pair probe | row Z15c, with the referee's corrected classification of h_pair > 1 points |
| row for the double-cover cocycle (narrowed wording) | row Z23 (text of REFEREE.md section 5 of that lane); section 6 item 18 updated |
| row for the normaliser cap at 2/3 | row Z24 (two referees; second: `push/c6-marks-bc-manuscript-check/REFEREE2.md`) |
| row for `c5-twisted-helson-arcs` | row P51 (the lane's label P44 was taken; P50 went to the quadratic row), with the qualifier limsup abs(S(x))/x > 0; section 6 item 21 closed |
| rows for `c5-thin-propd-dichotomy` and `c5-marks-circularity-order2` | rows Z25 (with `c6-probe61-thin-three-weights`) and Z26 (with the corrected chain of `c6-marks-bc-manuscript-check`); note in row Z15; section 6 items 1, 22 updated |
| section 7 entries for rounds 5 and 6 | twelve rows appended |
| (added) | header update line "fifth"; row count line recounted (P 51, G 30, Q 22, S 12, Z 28, F 8, T 3, L 5, D 7 = 166) |

Still pending (not applied by this lane):

- Row proposed by `c6-unreflected-marks-kd23` (its label Z15c is used by the pair probe): not entered; its referee does not hold two headline sentences. Enter after the uncompensated high side is derived (lane `c7-uncompensated-high-side-normaliser`), as Z27.
- Section 1 ("Status in ten lines") and section 5 unchanged: no bound moves; a round-5/6 paragraph for section 5 was not written.
- `stack-combinator/TABLE.md` has no THIN row (unchanged debt).
- Sources recalled, not opened: Gelfand-Tsetlin recipe for double covers (row Z23); Weil 1952; Coleman 1990 primary text; Turan's equivalence (row D6); Montgomery's fixed-X omega theorem (row P44).
- Third referee for Lemma H: MS Lemma 7.1 for j = 0 from (7.10) and (7.8); the conjugation convention of (7.6) against the PDF.

---

# Part 2: owed edits after campaign round 7 (proposed text; not applied)

Written 2026-11-18 by lane `c8-repair-engine-map-r7`. Part 1 above (round 2) was applied by `c3-repair-map-theorem-a`
and is kept for the record. `push/OBSTRUCTION_MAP.md` was not edited by this lane. Last ids in the file at the time
of writing: P51, G30, Q22, S12, Z26, F8, D7. Table columns as in the map: id | route | where it stops | status |
controls | source. "Second referee" means a REFEREE2.md under `push/c8-repair-engine-map-r7/<lane>/`. No entry is a
statement about zeros of zeta.

## C. Section 3.3 (square-root lane): rows under Q12 / Q22

### C1. New row Q23 (after Q22)

> | Q23 | Sections of the prime chain holomorphic only on a Reinhardt shell around the tori (Laurent class; left open by Q12, Q22) | For a positive-real lossless h whose boundary measure is the pullback of a positive measure mu on T^P carried by a hypersurface crossed by the orbit t -> (p^{-it}), the Bohr series of h runs over the half-space k . log p > 0, not the orthant, and the first moment of F over the poles is (2 int F_P dmu)/(2 pi delta) + O(delta^{-1/2-eps}), F_P the P-part of F on the torus (Lemma 1; in coefficients a_1 + conj((Pi_int h)(1/2)), Pi_int the projection onto integer frequencies). Proved for trigonometric-polynomial densities on a coordinate hyperplane; measured for Poisson densities. Sign rule: the real part is forced non-negative over the class iff Re F_P >= 0 on T^P; for zeta iff sum_{p in P} arcsin(p^{-1/2}) <= pi/2 (true for {2}, {2,3}, {2,3,p} with p >= 37; false for {2,3,7} and richer sets); for DH forced on {2,3} (min Re D_P = 0.0387) and not on {2,3,7} (min -0.62). So the Harnack sign of Theorem A' (polydisc) does not survive non-integral frequencies, for zeta and DH alike. Closure: if every pole is a zero of F, all twisted first moments vanish and mu = 0 (zeta: E_P has no zero on the torus; DH: relative to the unproved statement that the zero set of D_P has codimension 2). Limit step: in measure form the class is locally dense in all lossless positive-real functions (the statement "alpha L is a limit of sections" is RH restated); in formula form see Q24. Not covered: P growing like a power of t. | PROVED (Lemma 1, restricted class; one referee, independent run for zeta and DH); MEASURED (Poisson densities); Corollary 1 direction "sign forced" needs Lemma 1 for general measures; the constant-density case is a mean value of zeta on an arithmetic progression (literature not cited by the lane) | holds for DH at every step; no control fails | `c7-laurent-shell-gamma-section` (+ REFEREE.md) |

### C2. New row Q24

> | Q24 | Sections containing the gamma one-port: poles at X_F(1/2 + it) m((p^{-it})_p) = 1, m unimodular on T^P (left open by Q22) | Normalised first moment of F over the poles -> 1 + conj(int_{T^P} F_P m dHaar) (Lemma 2). Monomial m = c w^kappa (these are all unimodular trigonometric polynomials): the poles are shifted Gram-type points 2 theta(t) + t log q = a mod 2 pi, the mean is 1 + conj(c) n^{-1/2} if 1/q = n is an integer and 1 otherwise; proved for zeta by the Gram-point method (Riemann-Siegel formula and Kusmin-Landau), second referee. m = 1: Titchmarsh's mean 2. Holomorphic inner m: 1 + conj(m(0)) (first referee's correction of the lane's value), sign forced. m = -conj(F_P)/F_P (reflected Euler stage): 0. m = -conj(F_P)/abs(F_P): 1 - norm(F_P)_{L^1} < 0 when F_P has no zero on the torus (argued and measured: -0.298 / -0.340 for zeta on {2,3}, {2,3,7}; -0.168 for DH on {2,3}); for DH with three or more primes this m is not continuous. So no forced sign with the gamma term, for zeta or DH; this conclusion rests on a non-monomial m and is not proved. Closure by twists: a prime q outside P has twisted mean f_q q^{-1/2}, so every prime with f_q != 0 must lie in P, and inside the module of P the only candidate is the reflected stage (rows G10, Q10). Limit step in formula form: contractivity abs(U_P) < 1 of the reflected stage on a shell holds at height t only while log(t/2 pi) > 2 sum_{p <= P} log p/(sqrt p - 1); this is the height-coupled reserve bound Q*(t) of `g-passive-cascade` ({2,3} from t = 3590), not uniform in height. | PROVED for monomial m and zeta (second referee's proof, itself unrefereed); ARGUED + MEASURED otherwise (uniformity in k of the expansion sum U^k not established); Proposition 3 ARGUED | holds for DH wherever formulable; uses f_q != 0, not multiplicativity; no control fails | `c7-laurent-shell-gamma-section` (+ REFEREE.md); `c8-repair-engine-map-r7/c7-laurent-shell-gamma-section/REFEREE2.md` |

### C3. Rows Q12 and Q22, last sentence ("Not covered: sections holomorphic only on a Reinhardt shell ...; sections containing the gamma term"). Append:

> Both treated in round 7: rows Q23 (shell) and Q24 (gamma-coupled). Still not covered: P(t) growing like a power of t; J-expansive sections.

### C4. New row Q25 (family bridge)

> | Q25 | Anticausal Hankel block or Krein index of the bridge form summed over a twist family, with the 7/8 theorem as input | The single-cutoff trace tr Gamma_-^* Gamma_- does not depend on c; the gapped block has weights e^{-(beta_j - 1/2)c} and its decay rate in c is twice the least real part of a pole. The prime-side value of every member block is zero before any family sum; a family sum with positive weights is a positive form in the off-line data of all members and equals the bridge form of the product prod F_chi^{c_chi}; its negative index is the number of distinct off-line zeros of the union. The 7/8 input bounds the pole farthest from the line (Re z < 3/8) with the same constant for one member and for the family: gain 0; the family sum reads the pole nearest the line. Every-window form: the tilted block vanishes at tilt >= 3/8 member by member (row G20 restated). Below 3/8 a family bound controls a member only when it is below one unit of the index (MV-CAP, row P23); for unimodular twists n^{-i alpha_k} the family sum is a sum over height translates of one member. Not covered: a bridge formed from a single completed probe row B_m (lane `c8-single-row-bridge-crossing`, round 8). | PROVED for finite pole sets (author-checked; one referee); PROVED-rel 7/8 (unrefereed manuscript); MEASURED (double precision, rational toys) | no control separated: every object lives on the axis (valid for the controls) or where the prime side converges | `c7-bridge-seven-eighths-krein-index` (+ REFEREE.md) |

## D. Section 3.5 (zero-free machinery)

### D1. New row Z27 (Hilbert-Schmidt cap). The lane proposed the label Z15c, which is taken.

> | Z27 | Cap of the Prop. 2.1 format without the hypothesis lx >= l; which low estimates can pass 1 - 1/r | With h = 1 + l - lx, M = lx + ly: the three inputs B >= 1 - h/r (square-root level), B >= 1 - h/r + (M + l - 1)/2 (K-branch), B >= 1/2 - ly/2 + h(1 - 1/r) - l/2 (floor-class high bound H0) give B >= 1 - 1/r + lx/(2r) for all lx, ly, l >= 0, by the identity with weights (r-2)/r, 1/r, 1/r (2lx/(3r) with the uncompensated high bound); attained on the segment l = lx/2, ly = 1 - 3lx/2, which contains the 13/15 point. The K-branch of Liu II Lemma 2.4 (checked against its text) is the Hilbert-Schmidt lower bound max(Q, D) of the reflected row matrix: no l2-l2 operator bound of that matrix is below it, whether applied to the whole matrix or blockwise on a partition of rows and columns (blocks with a positive proportion of unimodular entries; reflected coefficients without a large entry). The cap contains no target data and holds for U, DH, THIN. Not covered: estimates specific to the coefficient vector of the probe ((E-K): sum_m abs(B_m)^2 << Q^{1+eps} Z^{max(0, k_J, k_P)} for Q P > Z; in the form with all range losses removed it contradicts the consistency bound h <= r/2 for long marks, so it is restricted to lx >= l) or to the vector A; mixed norms; cancellation over non-principal rows below H0 ((E-H)). Model values (first referee): with the polar term kept, K-loss removed gives 31/36 at h = 5/6 and no vertex with h > 1; H0 removed gives 13/15 (4/5 with G = 0); 1 - 2/r only in the three-input system. "h <= 1" is not a consequence of the format: the format bounds h by r/2 only (given the high comparison and a true low estimate at exponent lx/2). Phase-blind (unreflected) low estimates have B >= 1 by alignment with the Liouville-twisted target (ARGUED: the high identity (7.5), the principal residue and H_lambda(1) != 0 are checked for the twisted target; the bound for its non-principal rows is not written); with G = 0 this is violated, and keeping the polar term b/(2r) suffices for r >= 3. Outside lx >= l the signal exponent and H0 have no numbered source. | PROVED (identity; Hilbert-Schmidt bound and its blockwise form; two referees, the blockwise form by the second only); EXACT LP on MODEL inputs; alignment ARGUED | target-independent by construction: holds for U, DH, THIN (gives no R3) | `c7-probe-format-h-cap` (+ REFEREE.md); `c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md` |

### D2. Row Z15, sentence "for r = 6, B >= 5/6 under lx >= l (a modelling hypothesis) or M >= 2l with the polar term kept". Append:

> Update (round 7): the hypothesis lx >= l is replaced by two inputs, the K-branch and the floor-class high bound (row Z27); the cap is then 1 - 1/r + lx/(2r) in every geometry, for every operator-norm low estimate.

### D3. Row Z24: replace the two sentences from "MS hypothesis (2.2) is false for every sigma_0 < 7/12 ..." to "... fails at sigma_0 = 2/3 exactly (second referee)." by:

> MS hypothesis (2.2) (sup over Re s > sigma_0 of abs(H_eta - 1) <= 1/2) holds, for suitable S, if and only if sigma_0 > 2/3: for every sigma_0 <= 2/3 the half-plane contains Re s > 2/3, where sup abs(H_eta) is infinite for every finite S (Kronecker on the logs of rational primes; sum over split l of abs(c_l) l^{-sigma} is unbounded as sigma -> 1+, c_l = psi(p) + psi(pbar)). This uses no zero of L(w, psi_eta). The zeros of H_eta in 7/12 <= Re s < 2/3 matter for a different statement, the holomorphy of H_eta / L^S(s, eta) on Re s > B (Lemma S), whose binding abscissa lies in [7/12, 2/3]. The two statements are separate (referee of `c7-repair-engine-map-r6`, E1).

### D4. Row Z24, control cell. Replace the sentence stating that Lemma H holds for THIN and unimodular twists by:

> Local identity only: the formula for H_p and its two factorisations use complete multiplicativity alone (third referee: re-derived from the series (7.10) with (7.8)), so they hold for the Liouville twist, THIN and unimodular twists; H_lambda(1) != 0. The global statements (continuation of L(w, psi_eta), zeros in 7/12 <= Re s < 2/3, symmetry about 7/12, Lemma S) need (alpha eta)^6 to be a Hecke character and are not available for a general unimodular completely multiplicative weight (E4).

### D5. Row Z24, status cell. Replace "re-derived from MS table (7.16) by a second referee" by:

> Lemma H: three referees (sum of table (7.16); (7.11) against the table; series (7.10) with (7.8) and the lift formula, `c8-repair-engine-map-r7/c6-marks-bc-manuscript-check/REFEREE3.md`); the derivation of (7.8) from (7.1)-(7.7) read, not replayed

### D6. Two-row entry on the two uses of periodicity (new rows Z28, Z29)

> | Z28 | Periodicity used as lattice-translation invariance (the 7/8 mechanism) | Every sextic twist of the target is periodic in the row variable, with a Poisson dual uniform in the modulus (MS Lemma 5.8, Prop. 5.1). In the low half this appears as the absence of one coherent term kappa abs(m_w)^2 in the row second moment: for Liouville rows in one ray class, sum_m w(m) abs(B_m)^2 = D + P + Rem with P >= 0 of order M^{5/6} X^{1/3} (exponent 7/6 at M = X = Z against 1 + eps for a periodic weight); P is proportional to the squared smoothed Mertens sum of the weight and is present for non-multiplicative weights as well. So the periodicity input separates THIN and the Liouville twist (R3 of the mechanism) but is a Hermitian form in the weight: the low half carries neither R1 nor R4. It acts in the conductor aspect of the row family at every height of the target. Floor of the device: row Z15 / Z27 (1 - 1/r), normaliser row Z24 (2/3). For THIN the statement is conditional on conductor-uniform bounds (T1, T2). | PROVED (principal term; one referee); remainder ARGUED-rel a recalled second-moment bound and a contour step (referee: label "PROVED-rel (H2)" lowered); MEASURED Z = 2^7 .. 2^14 | Liouville twist fails the periodic row bound by Z^{1/6} (averaged over the characters mod f_0); THIN conditional; U not separated in the height aspect | `c7-liou-high-row-bound` (+ REFEREE.md); `c4-thin-twist-control-78`; `c5-thin-walk-replay` |
> | Z29 | Periodicity used as reciprocity (the 2026 Landau-Siegel device) | A real primitive character is the Frobenius of a quadratic field: for chi mod q the Frobenius class of every prime H < p <= q^A in Gal(Q(sqrt d, sqrt 2)/Q) is determined by chi(p) and (2/p), and an interpolation determinant over a box in Z[sqrt d, sqrt 2] is divisible by the primes of the relevant Frobenius classes (the divisibility holds for the classes {1, sigma, sigma tau}; referee correction of the lane's statement about split primes). The zero enters only through the classical prime bias of a real zero at s = 1 + 1/log X. Floor: real zeros with 1 - beta <= c/log q; the device is empty to the left and has no height-aspect form (n^{-it} has no field: control U). A completely multiplicative sign function that is not periodic (THIN, Liouville) has no field, and the congruence theta^p = Frob_p(theta) mod p has no object: these controls fail at the field step. The statement itself is a corollary of the compiled Dirichlet 7/8 theorem ((1 - beta) log q >= (log 3)/8). The two uses differ: Z28 uses invariance of the coefficients under translation of the argument and acts at every height; Z29 uses the reciprocity law that turns chi(p) into a splitting condition and acts only in the conductor aspect at height 0. Neither supplies R4. | LEAN-RELEASE (tree read as text, not compiled locally); reading of statements, one referee with five corrections | THIN, Liouville twist: fail at the field step (conductor aspect only); U: fails, which is why there is no height-aspect form; DH, heat, E_a, T-NR, Beurling not run | `c7-landau-siegel-device-read` (+ REFEREE.md) |

## E. Section 7 (referee-broken claims index) and section 6

### E1. Entry for `c6-unreflected-marks-kd23` ("No consistent model vertex with h > 1; Lemma D(b)"). Append:

> Attribution of Proposition E replaced (round 7): Proposition E placed the false input of the region lx < l on the uncompensated high side ((S) or H0'), using Lemma D(a) with a bounded mark polynomial. `c7-uncompensated-high-side-normaliser` argues the opposite attribution: the marks carry the conjugate phase of eta(p) and the u = 1 multiplier is -1 + O(Q^{-7/8}) (MS (16.13)), so the mark polynomial has modulus P^{1/2} at sixth-power frequencies and the false input is the row-energy bound (K + D or K for coherent marked rows), which contains the squared signal. Both attributions are conditional: Proposition E was not held by its referee, and the replacement is ARGUED at the level of exponents (its referee: "replaces the attribution ... by an argued one", not "corrects"). The measurement of c6-kd23 (no (KD)^{2/3} term) is not affected. Open debt: Lemma C of `c7-uncompensated-high-side-normaliser` (lane `c8-row-energy-squared-signal`).

### E2. New entry in the index

> | "(E-H) alone gives 1 - 2/r"; "(E-K) alone gives 7/9 at h = 4/3"; "the K-branch is forced for every operator-norm estimate"; "the false input is G = 0" | c7-probe-format-h-cap | First: only in the three-input system at a single row; with the source ledger 4/5 (G = 0) or 13/15 (polar kept). Second: that run has G = 0, which the same result argues is false; with the polar term kept the value is 31/36 at h = 5/6. Third: proved for l2-l2 bounds of the reflected matrix, whole or blockwise; vector-specific estimates are outside. Fourth: G = 0 is a false input there if (S) and k_dir hold; keeping the polar term suffices. |
> | Lemma 2, bullet "m holomorphic and inner: int F_P m = m((p^{-1/2})_p)" | c7-laurent-shell-gamma-section | The value is m(0); the stated value is int conj(F_P) m. Measured 0.9995 for m = w_2 against 1 (formula) and 1.7071 (bullet). |

### E3. Section 6, item 1 (effective order 2). Replace the last two sentences ("Left: ...") by:

> Left after round 7: (E-K), the mean square of reflected marked theta rows for the probe vector with the dual longer than the row set (row Z27; lanes `c8-ek-*`); (E-H), cancellation over non-principal rows (lane `c8-eh-*`); the compensated probe (12.5) in F_q[T]; global Whittaker constants of a genuine cusp form on the double cover of GL(3) (item 18). Closed in round 7: h > 1 by uncompensated marks (the low input contains the squared signal; conditional on Lemma C, exact in F_q[T] at N <= 4); operator-norm estimates below 1 - 1/r. Any order-2 probe needs a normaliser without zeros in Re s > 1/2 (row Z24).

## F. Log rows to mark (no map row)

`push/c5-target-fe-order2-ledger/tiers_fe2.log`, rows Y2 and Y6. Checked by rerunning `tiers_fe2.py` unchanged
(`push/c8-repair-engine-map-r7/c5-target-fe-order2-ledger/tiers_fe2.rerun.log`): the stored log reproduces line for
line. The rows are mislabelled, not stale: no call in `tiers_fe2.py` passes `G=`, so every row ran with the default
G = "src" although the labels say "G polar" (error E1 of the c5 referee). Values under the label actually printed:
Y2 = 9/10 at (1/15, 13/15, 1/15), h = 1; Y6 = 0.88095 at (1/3, 19/21, 1/3), h = 1 (c5 referee; reproduced by
`c7-uncompensated-high-side-normaliser/regress.log` with G = "polar" passed explicitly). The explanation in that
lane's regression note ("a version in which the option G = polar still contained the term b - ly/2") is not the cause;
there is one version of the script. Neither value is a vertex with h > 1. Mark: Y1 = Y2 and X1 = X2 = X3 in that log
are the same run; read the c5 referee's table instead of rows X2, X3, X4, Y2, Y6.

---

## Status 2026-11-19, fourth (lane `c10-repair-record-referee-r9`)

Part 2 above is applied to `push/OBSTRUCTION_MAP.md`; its title words "not applied" are historical. Script `push/c10-repair-record-referee-r9/apply_map.py`, edit list `map_edits.json`, previous file `push/c10-repair-record-referee-r9/before/OBSTRUCTION_MAP.md` (515 -> 551 lines; rows 166 -> 180: P 51, G 31, Q 27, S 12, Z 35, F 8, T 3, L 5, D 7, O 1).

| Pending item | Applied as |
|---|---|
| Part 2 C1, C2 (shell and gamma-coupled sections) | rows Q23, Q24, text as written |
| Part 2 C3 | sentence appended to rows Q22 and Q12 (the Q12 sentence has a different wording in the map; the pointer to Q23, Q24 is appended to it) |
| Part 2 C4 (family bridge) | row Q25, last sentence replaced by the pointer to Q26 (`MAP_ROWS_PROPOSED.md` Part 1) |
| Part 2 D1 (Hilbert-Schmidt cap) | row Z27, with the pointer to Z30, Z31 |
| Part 2 D2 | note in row Z15 (as a parenthesis after the sentence it amends) |
| Part 2 D3, D4, D5 | row Z24: (2.2) sentences, control cell, status cell |
| Part 2 D6 | rows Z28 (with the round-8 sentence on Theorem A of `c8-liou-row-bound-theorem`) and Z29 |
| Part 2 E1 | section 7, entry for `c6-unreflected-marks-kd23`, with the Lemma C sentence of round 8 in place of "Open debt" |
| Part 2 E2 | section 7, two rows |
| Part 2 E3 | section 6 item 1, extended to the state after round 9 |
| Part 2 F (log rows Y2, Y6) | no map row (as stated there); unchanged |
| `MAP_ROWS_PROPOSED.md` Q26 (single-row bridge) | row Q26 |
| `MAP_ROWS_PROPOSED.md` Z30; working label Z15d, (E-K); window extension proposed by `c9-mv6-ff-window-exact` | row Z30, with the window paragraph worded after the referees of `c9-mv6-window-statement` (E1 to E4) and `c9-mv6-ff-window-exact` (E1 to E6) |
| `MAP_ROWS_PROPOSED.md` Z31; working label Z15d, (E-H); replacement text proposed by `c9-eh-dual-r5-target-excess` | row Z31, round-9 paragraph worded after its referee (E1 to E3: "not detected", not "absent") |
| Z24b (`c9-normaliser-cap-avoidance` section 8) | row Z24b, with referee corrections E1 to E6 |
| EIS-w and G31 (drafts, "apply only after a referee holds") | section 2 note EIS-w and row G31, on the corrected statement held by the second pass in `c9-repair-referee-debts-r8` |
| O1 (Statement O) | new section 3.10, row O1, worded as separate conditional statements (first referee E1), labels after the second pass |
| positive-term sum rule (round 9; no text proposed by the lane) | row Q27, written from `c9-szego-sum-rule-prime-cascade` RESULT and REFEREE (five named forms) |
| squarefull stratification, lead 17 (round 9; no text proposed by the lane) | row Z32, written from `c9-tro6-interstratum-cancellation` RESULT and REFEREE |
| (added) | section 7: ten rows for claims of rounds 8 and 9 corrected by referees; header update line "sixth"; row count line |

Still pending (not applied by this lane):

- A row for the thin-prime-deletion control (positivity kept, real zero in (1/2, 1)): after lane `c10-thin-deletion-zero-mode-control` and its referee report. Statement O lines 1 and 5 are to be updated then.
- Section 1 ("Status in ten lines") and section 5 unchanged: no bound moves; no paragraph for rounds 5 to 9 was written for section 5.
- Rows for round-10 lanes: none proposed here.
- `stack-combinator/TABLE.md` has no THIN row (unchanged debt).
- Sources recalled, not opened (unchanged): Beurling construction (Statement O line 5); Coleman 1990 primary text; Huxley's short-interval asymptotic; Turan's equivalence (row D6); Blomer-Goldmakher-Louvel journal text; Gelfand-Tsetlin recipe for double covers (row Z23); Weil 1952; Montgomery's fixed-X omega theorem (row P44). Each is carried as "relative to" in the row or line that uses it.

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

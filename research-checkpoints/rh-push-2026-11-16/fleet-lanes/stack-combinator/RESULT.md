# stack-combinator: conjunctions of the campaign's mechanisms against all controls

Date 2026-11-16. Slug: stack-combinator. Scope: this directory only. Nothing here proves or refutes RH, and no
zero-free region, density bound or Lambda bound changes. Labels: PROVED (argument given here), CLASSICAL,
LANE (proved or measured in a named lane; referee status applied), MEASURED (scripts here, floating point, not
interval-certified), INFERRED (control outcome deduced from the inputs a statement uses), OPEN.

## Verdict

**Precise obstruction, with one classification and three composite plans.**

1. The table (`TABLE.md`, 61 rows) covers every lane with a RESULT.md. Apart from the Re s > 7/8 theorem and its
   two restatements (rows 50, 51, 54), no single usable row is violated by every control. That theorem is the only
   existing conjunction of mechanisms that yields a zero-location statement beyond the classical region.
2. Every minimal hitting set has the same shape: one mechanism that lives on the critical line and uses only the
   functional equation (violated by the sign twists and by Beurling systems, satisfied by DH, backward heat, E_a
   and the T-NR twin), plus one or two mechanisms that live on Re s > 1/2 or Re s > 1 and use the prime side
   (violated by DH, heat, and by E_a or T-NR through the size normalisation). In every such set the members hold
   on disjoint regions. The conjunction is consistent and true for zeta, but it is not a usable hypothesis package
   until a statement transports one member across the strip 0 < Re z < 1/2. The lanes contain exactly three
   transport devices: convexity (lossy; gives the classical region, density theorems and the 7/8 theorem), exact
   uniqueness (Hamburger, Theorem R; identifies the function and gives no inequality), and the residue theorem
   (sq-hankel-traces Theorem 4; exact and empty).
3. Task (3), the pair {Theorem E, Krein-square identity}: PROVED below. The pair is the de la Vallee-Poussin
   argument in quadratic form. On the cone where it applies it bounds each off-line quartet term from above by the
   archimedean form. The cone contains tests on which an off-line quartet term is larger than the on-line value,
   but with forced positive sign; on tests where the hyperbolic term is negative no inequality is available.
   Reach, MEASURED: beta < 1/2 - c/log gamma with c between 0.166 (gamma = 1e2) and 0.061 (gamma = 1e20) for the
   test family used. E_a and Beurling systems satisfy both members with zeros off the line, so the pair cannot
   give more.
4. Three composite plans are written out in section 5, each with one missing lemma and a numerical test on zeta
   and on the controls. Plan 1 (sandwich at a lower abscissa) is closed: its missing lemma is equivalent to its
   conclusion. Plan 2 (integer index plus a Nehari distance with margin) has a missing lemma that is a
   strict inequality with slack, which the Weil form does not admit (eq48 Theorem 4); it needs a function-theoretic
   prerequisite that is open. Plan 3 (chain with hard cap) is the sq-causal-cascade estimate (ME), which is RH
   above a height; its testable form separates zeta from E_a, the sign twist and DH.

## 0. Plan; what is new relative to the atlas and the walls

The atlas and the lanes list mechanisms one at a time and test each against DH. New here: (i) one table with all
controls, including two controls that appear in single lanes only (T-NR twin, Beurling); (ii) minimal hitting
sets, computed, and their common structure (section 2); (iii) the worked answer to the Theorem E + Krein-square
question (section 4); (iv) the quantum-gap formulation in Plan 2, which uses the integer index to replace a
no-margin inequality by one with margin.

Walls. DH, backward heat, sign twist, E_a: columns of the table. MV-CAP: Plans 2 and 3 end at it, and section 5
says where. Verified height: rows whose only input beyond the functional equation is verified height are marked.
Flow-blindness: every row that passes HEAT is flow-stable, and section 2 uses this.

Method. Four reader agents each read one group of lanes in full (RESULT.md and REFEREE.md) and wrote row digests
(`rows/G1.md` .. `rows/G4.md`, 236 rows with per-control outcomes and quoted combination leads). I read
weil-onesided, g-spinor-square-root, bootstrap, sq-hankel-traces, sq-causal-cascade, sq-krein-index and the
verdicts of twist-rigidity, support-rigidity, flow-euler-defect and pick-induction directly, merged the 236 rows
into 61, and filled undetermined control cells by inference where the inputs of the statement decide the outcome
(starred cells). Directories with no RESULT.md at the time of reading: b-lehmer-lower, r2-classgroup-homotopy,
r2-ff-tro6-complete, r2-lambda-reopt-run, r2-lean-kappa-1318, r2-lowpass-cone, r2-pick-euler-entry,
r2-tro6-nonpolar-scale, sq-canonical-det, stack-antibridge.

## 1. The controls and what each one lacks

| Control | Has | Lacks | Source |
|---|---|---|---|
| DH | functional equation, ordinary Dirichlet series | prime-power support (first failure n = 6), Lambda >= 0, bound \|Lambda(n)\| <= log n, zero-free Re s > 1 (sup Re = 1.120362) | support-rigidity P3, b-euler-detector |
| HEAT (tau < 0) | evenness, order one, all kernel-side positivity inputs | any fixed-gamma Dirichlet series: coefficients exp(t log^2 n) with cocycle 2t log m log n | flow-euler-defect Prop 1-2, g-odd-adversary |
| TW+ (0 <= eps_n <= 1) | Lambda >= 0, size, prime-power support, hence an Euler product | functional equation, geometric local factors | support-rigidity P1 |
| TW- (signed) | size, support, Euler product | functional equation, Lambda >= 0 | pick-induction Theorem R |
| E_a | Euler product, Lambda >= 0, functional equation s <-> 1-s | size: coefficients n^a, poles at 1 +- a, local parameters p^{+-a} | support-rigidity P4, bootstrap Prop 5 |
| NR (T-NR twin) | Euler product, zeta's functional equation, pole at 1 | Lambda >= 0 and temperedness at one prime q | ideation-panel, b-euler-detector Laurent twin |
| B (Beurling) | Euler product, Lambda >= 0, pole at 1, continuation | functional equation, integers | sym-power-positivity Theorem B (LITERATURE) |

Two corrections to the brief's description of the sign twist. (a) By support-rigidity P1, a sequence supported on
prime powers always defines an Euler product, so the twist does not destroy multiplicativity; it destroys the
functional equation and the geometric shape of the local factor. (b) A finite twist such as
zeta(s)(1 - 2^{-s})^2 has no zeros in Re s > 0 other than zeta's, so it is not a counterexample to any zero-location
conclusion in Re s > 1/2. It is a control only for arguments whose conclusion is a positivity statement with zeta's
archimedean side (Weil form, Pick matrices). Plans whose conclusion is "no zeros in a region" pass it trivially.

At the level of inputs, every control lacks at least one of: FE (functional equation), SIZE (\|Lambda_F(n)\| <= log n,
pole only at 1), GEOM (unimodular local parameters), INT (ordinary Dirichlet series). The minimal input sets hit by
all seven controls are {FE, SIZE}, {FE, GEOM} and {INT, GEOM}. Lambda >= 0 and prime-power support are in none of
them. At conductor 1, FE with INT is already uniqueness of zeta (Hamburger; support-rigidity P2,
flow-euler-defect O2), with no inequality. So the input level carries no information; the table works at the level
of mechanisms, where each statement uses its inputs only partially.

## 2. Minimal sets

`gen_table.py` computes all minimal hitting sets over the usable rows (types IDENT, INEQ, INPUT, RIGID). Counts:
24 signature-level minimal sets for the brief's controls with stated-or-inferred failures only, 29 when "not
formulable" counts as a failure, 54 with all seven controls. The full lists are at the end of `TABLE.md`. They
fall into six families.

| Family | Shape | Example | Consistent | What the conjunction yields |
|---|---|---|---|---|
| A | one row | {50}: zeta != 0 for Re s > 7/8 (also rows 51, 54, which restate or consume it) | yes (theorem) | the half-plane itself. Uses Hecke cubic rows, sharp diagonal mean values and the functional equation in one argument. E_a with a <= 3/8 satisfies the conclusion, so it kills E_a only for a > 3/8. |
| B | axis identity + prime-side size statement | {3, 40}: Krein square + Cayley expansion; {3, 41}; {6, 25}: index identity + Bohr-Landau density | yes | {3, 40}: zero side = positive sum over off-line poles, prime side = 0 in Re z > sigma_0; the difference is the residue sum (sq-hankel-traces Theorem 4): no inequality. {6, 25}: N_0 = N - 2 N_off with N_off(sigma) = o(T): a proportion on or near the line (Levinson class), never an empty set (MV-CAP). |
| C | exact-FE rigidity + a DH killer | {19, 27}: Theorem R + Theorem E; {19, 33}: Theorem R + prime-power support | yes | Theorem R makes all-order positivity pin every prime weight; with support or positivity this identifies zeta among Dirichlet series (Hamburger content). No zero is located: the rigidity statement is conditional on the positivity it is supposed to prove. |
| D | local temperedness + a HEAT killer | {34, 36}: T_pK + series chain of stubs; {34, 23} | yes | absolute convergence and zero-freeness for Re s > 1 only. Row 37 quantifies the gap: the chain is l^1 on Re s > 1 and l^2 on Re s > 1/2. |
| E | verified-height row + chain | {8, 36}: low-pass cone (Theorem F) + series chain; {15, 36} | yes | Theorem F fails for E_a only because E_a's lowest zeros are off the line; this is verified height, not size. The conjunction restates verified height plus Re s > 1. |
| F | axis identity + Lambda >= 0 + size | {3 or 10, 27, 37 or 41}: Krein or lens identity + Theorem E + a size row | yes | the classical zero-free region (section 4). This is the triple of task (3). |

Statement that covers all six families (PROVED by inspection of the 61 rows): in every minimal set other than
family A, each member is an identity or inequality on one of two regions, the axis Re z = 0 (rows 1-17, 19-20) or
a half-plane Re z >= 1/2 (rows 25-41), and no member relates values on the two regions. Zero-location
information requires such a relation. The three relations present in the lanes:

- Convexity and mean values between the two regions: classical zero-free region (rows 27, 28), density (row 25),
  the 7/8 theorem (row 50). These are lossy and are the only source of zero-location statements so far.
- Exact uniqueness: Hamburger, Theorem R (row 19), the measured windows of row 20. No inequality survives.
- The residue theorem: row 7 with row 40. Exact; the difference of the two sides is the quantity sought.

Consistency. Every conjunction is true for zeta, hence consistent. Usability fails for a second reason in families
B, C, D: all members pass a small backward heat step in the only sense available (HEAT cells are N, not F), so by
b-escape-law C4 they have not used the feature that separates tau = 0 from tau < 0 except by not being formulable.
A package that is violated by HEAT only through non-formulability gives no quantitative handle on the flow.

## 3. Rows that are closest to a transport statement

These are the rows where a mechanism on one region is known to control something on the other, with the loss stated.

| Row | Transport | Loss |
|---|---|---|
| 27 + 10 (Theorem E + lens) | prime positivity on Re s > 1 to zeros near Re s = 1 | width c/log gamma (pole at s = 1 fixes the damping) |
| 38 (coverage theorem) | finite chain is J-contractive on Re s >= 1/2 | at most (log t)^2/16 primes; sharp for sequences of the size of Lambda |
| 37 (l^2 threshold) | variance of the chain defect finite for Re s > 1/2 | mean square only: MV-CAP |
| 7 (windowed contour shift) | anticausal part on Re z = x to the axis | none; adds the residue sum |
| 50 (7/8 theorem) | cubic rows and sharp mean values to zeros | stops at TRO6 |
| 59, 60 (cc-latest Theorem B, ff-transplant Prop S) | any finite lower bound to exact positivity | none: unbounded slack in the constant, but the bound itself is the target |

Rows 59 and 60 matter for plan design: RH follows from Q_L(v) >= -C ||v||^2 for any finite C, and from a one-sided
polynomial bound on R_x(l). A composite does not have to prove positivity with no margin; it has to prove any
finite one-sided bound of these two kinds. Theorem E is one-sided in the opposite direction.

## 4. Task (3): Theorem E with the Krein-square identity

Notation. g real on [0, inf), G(w) = int_0^inf g(l) 2 cosh(wl) dl. For g = C_v (autocorrelation of a real one-sided
test v) G(w) = V(w)V(-w) and sum_rho G(rho) = Q_L(v). Centered zeros rho = beta + i gamma.

**(4.1) Krein decomposition in linear form (CLASSICAL; same content as eq48 Thm 1, g-spinor (3.1)).**

    sum_rho G(rho) = sum_{on-line pairs} 4 int g(l) cos(gamma l) dl + sum_{off-line quartets} 8 int g(l) cosh(beta l) cos(gamma l) dl.

For g = C_v the on-line terms are 2|V(i gamma)|^2 >= 0 and the quartet term is 4 Re[V(rho) conj V(-conj rho)], the
hyperbolic pair of the Krein square.

**(4.2) Theorem E in linear form (LANE weil-onesided, PROVED).** If g >= 0 on [log 2, inf) and int g e^{l/2} < inf:

    sum_rho G(rho) = A(g) - 2 sum_n Lambda(n) n^{-1/2} g(log n) <= A(g),   A(g) = 4 int g cosh(l/2) dl + (gamma-factor form).

Cone K_E = {g >= 0}. Only the sign of g at the points log n is used, so K_E is larger than {C_v : v >= 0}; it
contains every g = C_v with nonnegative autocorrelation, in particular e^{-xl}(3 + 4 cos(gamma_0 l) + cos(2 gamma_0 l)).

**(4.3) The pair (PROVED).** For g in K_E:

    sum_{quartets} 8 int g cosh(beta l) cos(gamma l) dl <= A(g) - sum_{on-line} 4 int g cos(gamma l) dl.        (P)

Let K_S = {g : Re G(w) >= 0 for |Re w| <= 1/2} (dh-separator's cone F_{1/2}: e^{|l|/2} g positive definite). On
K_E ∩ K_S every term on the left and every on-line term is nonnegative, so each single quartet satisfies

    0 <= 8 int g cosh(beta l) cos(gamma l) dl <= A(g) - (sum of the on-line terms of the verified zeros).          (cap)

This is the answer to "what the pair gives, on which cone": an upper bound for each hyperbolic term on
K_E ∩ K_S, where the hyperbolic term is forced to be nonnegative.

**(4.4) Does the cone see an off-line zero (PROVED).** Yes, in two different senses.

- On K_E ∩ K_S: for g = e^{-xl} sum_k a_k cos(k gamma_0 l), x > 1/2, a quartet at beta + i gamma_0 contributes
  a_1 (1/(x - beta) + 1/(x + beta)) + O(1/gamma_0), against a_1 (2/x) for two on-line zeros at the same height. The
  term grows as beta -> x. The sign is positive. (cap) then excludes the quartet when
  a_1 (1/(x-beta) + 1/(x+beta)) > Re sum_k a_k Arch(x - i k gamma_0).
- On K_E outside K_S: for v >= 0 and v_d = v + v(. - d), the term of each zero is multiplied by
  4 cosh^2(rho d/2), whose real part for a quartet is 2(1 + cosh(beta d) cos(gamma d)). At gamma d = pi this is
  -2(cosh(beta d) - 1) < 0, while an on-line zero at the same height gives 0. So K_E contains tests on which the
  hyperbolic term is negative. For those tests (P) is an upper bound on a negative quantity and gives nothing.
  Combining with (cap) for the in-phase test v gives only: the negative term of v_d is at least
  -2(cosh(beta d) - 1) (A(v) - on-line terms of v). This bounds how negative the form can be on the family v_d in
  terms of A(v); it is not a zero-location statement.

So the upper bound and the decomposition do combine, and what they bound is the size of the hyperbolic product
|V(rho) V(-conj rho)| on tests where the pair is in phase. An argument for RH needs the opposite: a lower bound on
tests where the pair is out of phase.

**(4.5) Reach (MEASURED, `t3_pair_reach.py`, `t3_pair_reach.json`).** Family: a = autocorrelation of a
nonnegative sequence of length 5 (so a_k >= 0 and the polynomial is a square), x > 1/2 free, Nelder-Mead from 12
starts. Smallest excluded beta at height gamma_0:

| gamma_0 | 1e2 | 1e4 | 1e6 | 1e9 | 1e12 | 1e20 |
|---|---|---|---|---|---|---|
| 1/2 - beta* | 3.59e-2 | 8.99e-3 | 5.22e-3 | 3.20e-3 | 2.31e-3 | 1.33e-3 |
| (1/2 - beta*) log gamma_0 | 0.166 | 0.083 | 0.072 | 0.066 | 0.064 | 0.061 |
| optimal x - 1/2 | 0.135 | 0.030 | 0.017 | 0.011 | 0.0076 | 0.0044 |

The product tends to a constant near 0.06: the classical region, with a constant below the literature values
because no device beyond (cap) was used. Controls, same script:

| Control | Outcome |
|---|---|
| DH | (4.2) is false: with DH's archimedean form, each of the four true off-line zeros below height 200 violates the inequality (weights 3, 4, 1, x = 0.55: zero term 21.2 against archimedean 10.8 at height 85.70; 15.7 against 11.5; 14.8 against 12.5; 17.4 against 12.6). FAIL. |
| E_a, a = 0.1, 0.25, 0.375 | (4.2) and (4.1) hold with poles at 1 +- a and rates > 1/2 + a. Excluded region beta > 0.583 / 0.723 / 0.844 at height 14.13 and beta > 0.597 / 0.746 / 0.871 at 1e4; true zeros at beta = a. PASS: the pair holds and the zeros are off the line. |
| TW+ | (4.2) holds (prime term keeps its sign); (4.1) has no zero set symmetric under rho -> -conj rho. Pair not formulable. |
| TW- | (4.2) fails. |
| HEAT | no prime side; (4.2) not formulable. (4.1) holds. |
| B (Beurling) | (4.2) holds with zeros up to any theta < 1 (LITERATURE: sym-power-positivity Theorem B; Diamond-Montgomery-Vorhauer for optimality of the region in that class, not re-read). |

**(4.6) Why the pair stops there (PROVED / LANE).** (i) A(g) contains the pole term 4 int g cosh(l/2) dl, so g
must decay faster than e^{-l/2}; the resonance of a zero at beta is 1/(x - beta) with x > 1/2. (ii) For x < 1/2
the prime series in (4.2) diverges; its regularised form has no sign (pick-induction Lemma A, eq (A1)). (iii) E_a
passes. (iv) g-passive-cascade's Kronecker budget: for fixed sigma the supremum over t of the prime sum equals
its absolute value, so no uniform strengthening of (4.2) exists without using the height.

## 5. Three composite plans

Each plan lists members by table row, the conditional statement that is proved, the missing lemma, and the test.
All numbers in the tests are MEASURED (`lemma_tests.py`, `lemma_tests.log`, mpmath 15-20 digits, t-grids of step
0.1 on [10, 200] for zeta, E_a, the twist, and on [80, 120] for DH).

### Plan 1. Sandwich at a lower abscissa

Members: Theorem E (27), strip-positive cone (28), lens identity (10), a zero-free half-plane theta (50).

Conjecture P1(theta). If zeta has no zeros in Re s > theta then it has none in
Re s > theta - c/log(|t| + 2).

Proof plan. Write x_0 = theta - 1/2. All centered zeros have |beta| <= x_0, so Re 1/(x_0 + it - rho) >= 0 for every
zero (lens identity). Hence for a zero beta_0 + i gamma_0:
1/(x_0 - beta_0) <= Re L(x_0 + i gamma_0) = Re G + Re zeta'/zeta(theta + i gamma_0). PROVED.

Missing lemma L1(theta). There is C with Re (zeta'/zeta)(theta + it) <= C log(|t| + 2) for all real t.

Then beta_0 <= x_0 - 1/((C + 1/2) log gamma_0). PROVED (two lines above). Conversely the region gives L1 by the
classical Hadamard-Borel-Caratheodory argument (CLASSICAL). So L1(theta) is equivalent to P1(theta). At theta = 1,
L1 is what Theorem E proves, using the pole. At theta < 1 there is no pole on the line and the prime series
diverges; bootstrap Lemmas 1-3 and nyman-baez-duarte Theorem C show that the known consumers of ZF(theta) return
f(theta) = theta. Status: closed. The plan is recorded because it is the exact form in which the pair of task (3)
would have to be continued.

Test of L1 (statistic max_t Re f'/f(1/2 + x_0 + it)/log(t + 2)):

| Object | x_0 = 0.375 | 0.25 | 0.10 | 0.02 | reading |
|---|---|---|---|---|---|
| zeta, t in [10, 200] | 0.814 | 1.272 | 3.068 | 11.73 | finite on every line; grows like 1/x_0 as the line approaches the zeros at x = 0 (consistent with L1(theta) for theta > 1/2 and its failure at theta = 1/2) |
| E_a, a = 0.3, t in [10, 200] | 4.208 | 0.047 | -0.174 | -0.186 | lines to the left of the zeros at x = 0.3 carry no upper-tail signal; on lines approaching x = 0.3 from the right the statistic is 3.8, 12.3, 36.3, 360 at x_0 = 0.40, 0.33, 0.31, 0.301 (`l1_extra.py`; zeta on the same lines: 0.76, 0.95, 1.02, 1.06). L1(theta) FAILS at theta = 1/2 + a, where E_a satisfies ZF(theta) and Theorem E |
| twist eps_2 = -1, t in [10, 200] | 0.656 | 1.088 | 2.871 | 11.60 | PASS: the twisted function has zeta's zeros in Re s > 0 |
| DH, t in [80, 120] | 3.287 | 1.962 | 1.795 | 10.31 | peak 3.29 at t = 85.7 on the line just right of the zero 0.8085 + 85.70i; the hypothesis ZF(theta) fails for every theta <= 1.12, so P1 is void for DH |
| HEAT | n/a | | | | no Dirichlet series |

L1 separates zeta from E_a at the abscissa of E_a's zeros and from nothing else: it is a zero-location statement
read on a line.

### Plan 2. Integer index plus Nehari distance: an inequality with margin

Members: Krein square and inertia theorem (3), Hankel traces and single-zero quantum (5), index identity (6),
windowed contour shift (7), a zero-free half-plane (50).

Background (LANE). S = N/D = S_0/B with B a Blaschke product whose zeros z_j are the poles of S in Re z > 0 and
S_0 inner (sq-krein-index, finite kappa). RH <=> kappa = 0 <=> Gamma_- = 0. By Nehari (CLASSICAL)
||Gamma_-|| = dist_{L^inf(iR)}(S, H^inf(Re z > 0)).

Step 1 (CLASSICAL, Sarason; applied here, not in the lanes). For unimodular S = conj(B) S_0 on the axis with B a
finite Blaschke product, Gamma_- is unitarily equivalent to S_0(M_B), the function S_0 of the compressed shift on
the model space of B. Its eigenvalues are S_0(z_j). Hence

    kappa >= 1  implies  dist(S, H^inf) = ||Gamma_-|| >= max_j |S_0(z_j)| > 0.                       (Q)

For one isolated pair, |S_0(z_j)| = |r_j|/(2 Re z_j) = alpha/sqrt(alpha^2 + beta^2) (sq-hankel-traces Theorem 1(e)).
In general, from S = S_0/B and B = prod_k (z - z_k)/(z + conj z_k):

    |S_0(z_j)| = (|r_j|/(2 Re z_j)) prod_{k != j} |(z_j - z_k)/(z_j + conj z_k)|,   r_j = 2/(alpha L'(z_j)).

Each factor of the product is < 1, so other poles lower the value. PROVED given the factorisation.

Consequence. Gamma_- is either 0 or has norm at least q := max_j |S_0(z_j)|. Unlike the Weil form, for which
no margin exists on finite tests (eq48 Theorem 4), the Nehari distance has a gap. RH would follow from the pair:

Prerequisite L2a (function theory, OPEN). An explicit lower bound q(T, alpha, b) > 0 for max_j |S_0(z_j)| over the
poles z_j at height about T, valid for every F in the class (H) with zeros in |Re rho| <= b and with the
unconditional local zero count N(T+1) - N(T) <= C log T. Two factors must be bounded below: |r_j|/(2 Re z_j)
(heuristically of order (distance from z_j to the nearest zeros)^2/(alpha Re z_j log T), since |L'(z_j)| is at most
the sum of |z_j - rho|^{-2}), and the Blaschke product over the other poles (heuristically exp(-c alpha Re z_j log T/
(alpha + Re z_j)) from the local density of zeros, which suggests alpha of order 1/log T, Levinson's scaling). The
lemma is false without a separation input when zeros or poles cluster at z_j; it may be false as stated. The
half-plane theta enters only through b.

Missing lemma L2 (arithmetic). For some alpha > 0 and every height window I_T: there is h bounded analytic in
Re z > 0 with sup_{t in I_T} |S(it) - h(it)| < q(T, alpha, b).

Conjecture P2. L2a and L2 hold; then zeta has no zeros off the line.

What is established and what is not. (Q) is proved for finite kappa only; the windowed version (a Nehari problem
on an interval) is OPEN. L2 is true under RH with h = S. No arithmetic candidate for h exists in the lanes: the
truncated chain S_Q of sq-causal-cascade Theorem 3 is in H^inf of the window for Q <= Q*(t), but it does not wind
on the axis, whereas S winds once per zero, so |S - S_Q| reaches 2 near each zero. An approximant must carry the
zeros of N = F - alpha F' in Re z > 0, which is zero-side information. This is the same counting step as Levinson's
method (sq-krein-index section 3), where the loss is in the mean-value step. Status: the gap statement (Q) is new
relative to the lanes; the plan is blocked at L2, which is MV-CAP in Nehari form.

Test (existing logs plus `lemma_tests.py`). The statistic is |I(u)|/(sqrt(2 pi) Dl exp(-u^2 Dl^2/2)) at alpha = 1,
Dl = 1, window centre 85.699348 (<= 1 for all u < 0 iff no pole in the window, sq-hankel-traces Cor 3b), and the
quantum |r_j|/(2 Re z_j) where a pole exists:

| Object | u = -2 | u = -4 | u = -6 | quantum | source |
|---|---|---|---|---|---|
| zeta | 0.342 | 0.334 | 0.328 | none (no pole in the window) | `lemma_tests.log`; agrees with sq-hankel-traces `detector.log` |
| DH | 1.28 | 589 | 1.17e7 | 0.9407 (alpha = 1), 0.6614 (alpha = 0.3), pole at 0.0515 + 85.743i | sq-hankel-traces `detector.log` |
| E_a, a = 0.3 | 1.34 | 439 | 6.2e6 | not computed (every zero is off the line) | `lemma_tests.log` |
| HEAT | not computed | | | index (N - N_0)/2 = 0, 1, 3 at heat time 0, -2, -5 in a box holding 10 zeros | sq-krein-index `heat_index.log` |
| sign twist | n/a | | | the prime-side anticausal kernel is zero for every sign twist; no symmetric zero side exists | sq-hankel-traces Theorem 4 |

The statistic stays near 1/3 for zeta and grows like exp(u^2/2 - (Re z_j)|u|) for DH and E_a. The quantum for the
one DH pole in the window is 0.94: the Nehari distance of S_DH from H^inf is at least 0.94 on any window containing
it (given (Q)), against 0 for zeta under RH.

### Plan 3. Chain with hard cap

Members: series chain and composition identity (36), l^2 threshold (37), coverage theorem (38), lens identity (10),
size normalisation (through 37).

Statement (LANE sq-causal-cascade section 7, PROVED there). With L = L_Q + T_Q, T_Q = (zeta/P_Q)'/(zeta/P_Q):
(ME) Re T_Q(sigma + it) >= -Re L_Q(sigma + it) for all sigma > 1/2, |t| >= t_0 is equivalent to "no zeros with
Re s > 1/2, |Im s| >= t_0". With Q = 1 it reads: -Re zeta'/zeta(sigma + it) <= Re G(sigma + it).

Conjecture P3. For every x > 0 and |t| >= t_0: -Re (zeta'/zeta)(1/2 + x + it) <= Re G(1/2 + x + it). (This is RH above
t_0; no weaker form with slack is equivalent, but by ff-transplant Prop S and cc-latest Theorem B a bound with a
finite additive constant C on the left for all x > 0 already suffices: if Re L >= -C on Re z > 0 then no zero lies
in Re z > 0, since Re L -> -inf on approach to an off-line zero from the left. PROVED.)

Missing lemma L3 (one-sided head bound). For some C and all x in (0, 1/2], |t| >= t_0:

    Re sum_{n <= t} Lambda(n) n^{-1/2 - x - it} w(n/t) <= (1/2) log(t/2 pi) + C,

for a fixed smooth cutoff w, together with the tail statement that the smoothed sum over n > t equals its density
term up to O(1) (sq-causal-cascade 7.3(a); known for Re s > 7/8 from row 50, OPEN below). The head bound is a
one-sided bound for a sum whose root mean square on the Bohr torus is 1/(sqrt 8 x) (row 37) against a cap of size
(1/2) log t. Typical values are far below the cap for x >> 1/log t; the statement concerns the largest value.
Where each control fails: DH has no chain (first step); HEAT has no chain; the sign twist has the same size and
violates the cap once Q exceeds (pi/2)^2 Q*(t_0) (sq-causal-cascade section 6, MEASURED there); E_a has its l^2
threshold at 1/2 + a, so the cap fails for x < a. The only inputs that separate zeta from the twist in L3 are the
position of the line t -> (p^{-it})_p on the torus and, for the tail, the bilinear structure Lambda = mu * log.

Test (statistic max_t (-Re f'/f)/Re G_f on the line Re s = 1/2 + x; P3 says <= 1 for zeta):

| Object | x = 0.375 | 0.25 | 0.10 | 0.02 | reading |
|---|---|---|---|---|---|
| zeta, t in [10, 200] | 0.834 | 0.889 | 0.955 | 0.991 | below 1 on every line, tending to 1 as x -> 0 (no margin) |
| E_a, a = 0.3 | 0.837 | 15.33 | 3.91 | 1.53 | FAIL for x < a, at t = 14.1 |
| twist eps_2 = -1 (with zeta's G) | 1.98 | 2.19 | 2.46 | 2.60 | FAIL at t = 12.0 on every line |
| DH, t in [80, 120] | 0.626 | 8.15 | 4.97 | 1.65 | FAIL for x below 0.3085 (t = 85.7, 114.2); on [80, 120] the line x = 0.375 is to the right of the zeros in the window |
| HEAT | n/a | | | | no chain |

The statistic for zeta approaches the cap from below with no slack as x -> 0, as eq48 Theorem 4 requires. The
twist with one prime's sign changed already exceeds the cap by a factor 2: the cap has no tolerance in the prime
data (same content as Theorem R), so L3 cannot be proved from the size of Lambda.

## 6. DH control

No positive claim about zeta is made, so the control is passed vacuously. Per item: (4.2) fails for DH (measured,
section 4.5); Plan 1's lemma L1 fails for DH on any line to the left of its zeros with Re s > 1; Plan 2's
statistic separates DH from zeta by the factor in the table and its quantum is 0.94 at alpha = 1; Plan 3 fails for
DH at the first step (no chain) and its cap statistic exceeds 1. The steps that use the Euler product: Theorem E
(Lambda >= 0), the chain identity (multiplicativity with geometric local factors), the coverage theorem
(|Lambda(n)| <= log n), the 7/8 input (Hecke structure).

## 7. Three weakest steps

1. Control cells. 61 rows by 7 controls; most HEAT, TW, EA, NR and B cells are inferences from the inputs a
   statement uses (starred), made by the reader agents or by me, not statements of the lanes. The minimal sets
   depend on them. The family structure of section 2 uses only the coarse pattern (axis rows pass DH, HEAT, E_a;
   prime-side rows pass at least one of TW, E_a) and is robust to individual cells; the list of 24/29/54 sets is
   not. I did not re-read the 236 source rows against the original lanes.
2. Plan 2, step (Q). The Sarason identification is quoted from memory and applied to the half-plane with a
   finite Blaschke product; the lanes prove the factorisation S = S_0/B only for finite kappa, and the windowed
   Nehari problem is not formulated. The heuristic sizes in L2a are not proofs, and L2a may be false as stated.
   Nothing here was checked numerically for (Q) beyond the single-pair values already in sq-hankel-traces.
3. Numerics. All tests are floating point on finite grids over heights <= 200; a supremum over t is replaced by a
   maximum on a grid of step 0.1, which misses narrow peaks. The reach table uses a restricted test family and a
   local optimiser; the constant 0.06 is a lower bound for what the pair gives, not its exact value. The DH zero
   list and DH archimedean factor are taken from weil-onesided and euler/dh.py without re-certification.

## Files

- `TABLE.md`: the 61-row table and the computed minimal sets. `table_rows.json`: the same rows as data.
- `gen_table.py`: builds both. `rows/G1.md` .. `rows/G4.md`: source digests (236 rows, with quoted combination leads).
- `t3_pair_reach.py`, `t3_pair_reach.json`: section 4.5. `lemma_tests.py`, `lemma_tests.log`, `lemma_tests.json`, `l1_extra.py`, `l1_extra.log`: section 5.
- `READER_BRIEF.md`, `digest.py`, `digest2.py`, `d1.txt` .. `d3.txt`: reader instructions and digest helpers.

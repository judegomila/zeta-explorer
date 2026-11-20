import json, os
E = 'tmp/research-2026-11-16/engine'
P = 'tmp/research-2026-11-16/push'
cur = {c['slug']: c for c in json.load(open(E + '/curated/batch-2.json'))}
R = {}
R['e2-legendre-riesz-level-phase'] = dict(
 verdict='precise-obstruction', strength=0.12, refereeHolds=True,
 nodes=['legendre-lcm-identity', 'landau-one-sided-d-bound', 'one-sided-excess-target'],
 tags=['legendre-lp', 'riesz-order', 'restricted-level', 'landau-floor', 'reformulation'],
 survivingClaim="Precise obstruction; no proof of RH, no zero information, no bound changed. PROVED (referee-confirmed): for every Riesz order k the Legendre certificate value is >= psi_k(X)/X^k, so its one-sided excess exponent is >= Theta >= 1/2 (classical Landau); Theorem U and the sandwich Theta <= min_theta nu^R_k <= Theta + (1-Theta)^2/(k+2-Theta), a reformulation of RH as an O(X^(1/2+eps)) bound for a prime-free LP as k -> infinity, with the upper half taking M(y) << y^(Theta+eps) as input. MEASURED (reproduced independently at X=2700): the exact LP equals psi_k(X)/X^k from D about 2.2 sqrt X for k=0,1,2 (hyperbola identity); robust LP gap about 0.02-0.03 sqrt X (k=1) and 0.0016 sqrt X (k=2) at theta>=0.7.",
 obstruction="Every certificate value is >= psi_k(X)/X^k, whose excess is Omega_+(X^(Theta-eps)) (Landau), so the certified exponent is never below Theta. From level D about 2 sqrt X the exact LP is Dirichlet's hyperbola identity and returns the truth for every Riesz order; Riesz order and level restriction remove only method losses (forced Moebius head, sawtooth triangle inequality). The residue is a one-sided bound for a Moebius-weighted spline sum over the Type-II range (source Step 7 / (DR)); the upper half of the sandwich is proved from M(y) << y^(Theta+eps). Positivity of Lambda is already spent; uniformity in height is not obtained.",
 obstructionKind='reformulation-pinned-to-truth',
 controlsThatDefeat=["E_a = zeta(s+a)zeta(s-a): passes every step (pinned at a=0.15, 0.3) and returns Theta + a",
  "Beurling: argued only, not run",
  "DH, Liouville sign twist, chi_4: fail only at Lambda_w >= 0 (LP unbounded); the method separates by the sign of Lambda_w, not by zero location"],
 lesson="Restricted-level Legendre LPs are pinned to the truth from D ~ 2 sqrt X for every Riesz order, so the exact LP carries no information. Do not re-run level x Riesz-order variations. The open residue is the Type-II one-sided Moebius spline bound, at RH strength; E_a is not separated.",
 newNodes=[dict(id='legendre-riesz-sandwich-theorem-u', type='identity', status='proved', statement='Theta <= min_theta nu^R_k <= Theta + (1-Theta)^2/(k+2-Theta) for the robust (prime-free) Legendre-Riesz LP exponent; upper half uses M(y) << y^(Theta+eps). Refereed once.'),
  dict(id='legendre-lp-hyperbola-pinning', type='measured-phenomenon', status='measured', statement='For D >= about 2.2 sqrt X the exact Legendre-Riesz LP equals psi_k(X)/X^k for k=0,1,2 (X up to 1e6 for k=0,1; reproduced at X=2700).')])
R['e2-cofinal-moebius-pointwise'] = dict(
 verdict='dead', strength=0.03, refereeHolds=True,
 nodes=['cofinal-pointwise-mobius-sum', 'rig-continuum-sawtooth', 'legendre-dual-limit-density-zero'],
 tags=['legendre-lp', 'cofinal', 'moebius-inversion', 'restatement', 'mv-cap'],
 survivingClaim="Restatement, no new result, no statement about zeros. PROVED: for every b, F_b(x) = psi_b(x) - a x[m(x) log x - beta(x)] - c x m(x); for b >= 0 of density 0 with logarithmic discrepancy, F_b = -c x m(x) + psi_b with 0 <= psi_b = O(log^2 x). CLASSICAL (Landau): for such b with c > 0 a one-sided bound of exponent theta on F_b implies Theta <= theta, and Theta <= theta gives |F_b| << x^(theta+eps). PROVED: tail_K = integral of (M(x/u) - M(K)) d r_b(u); b >= 0 gives only an absolute-value bound (x/K) sup|M|, no sign. MEASURED: exponents near 1/2 for delta_1 and O(log Y) Beurling systems, near 1/2 + a for E_a (a = 0.2, 0.1).",
 obstruction="By Moebius inversion the sum sum_k mu(k) r_b(x/k) equals psi_b minus universal sums of mu(k)/k: for density 0 it is -c x m(x) plus a nonnegative O(log^2 x) term, so the pointwise bound is the pointwise bound on x m(x) (Mertens-type, RH strength); for density a > 0 it is the statement for e_b itself. Positivity of b contributes only a polylog term. Landau turns an assumed one-sided bound into Theta <= theta, never the reverse; every other input is a mean square (MV-CAP).",
 obstructionKind='restatement-of-mertens',
 controlsThatDefeat=["E_a = zeta(s+a)zeta(s-a): passes every step, returns exponent 1/2 + a (measured at a = 0.2, 0.1)",
  "unimodular twist: exactly the same function m(x)",
  "Beurling with O(log Y) discrepancy: passes every step (exponents 0.504 / 0.508)",
  "Liouville sign twist: returns Theta/2",
  "DH: does not engage (F_b = psi_b identically, target 0)",
  "not run: Beurling with large discrepancy, theta^3, operator controls"],
 lesson="A Moebius sum of sawtooth remainders of a fixed measure holds for every coefficient sequence and returns the control's own exponent. Item 1 of 'least blocked after batch 1' is withdrawn.",
 nodeRepairs=[dict(id='cofinal-pointwise-mobius-sum', change='type open-lemma -> restatement (of the pointwise bound on x*m(x) at density 0; of e_b at density a > 0); status open -> reduced', source='e1-cofinal-legendre-dual newNodes')],
 newNodes=[dict(id='cofinal-mobius-sum-equals-x-m', type='identity', status='proved', statement='For density-0 b >= 0 with log discrepancy, sum_k mu(k) r_b(x/k) form F_b = -c x m(x) + psi_b, 0 <= psi_b = O(log^2 x).')])
R['e2-below-level-mixed-moment'] = dict(
 verdict='partial-result', strength=0.2, refereeHolds=True,
 nodes=['map-open-2', 'target-0874-restricted-moment'],
 tags=['seven-eighths', 'mixed-moment', 'below-level', 'density-estimate', 'control-blind'],
 survivingClaim="MEASURED (reproduced; extended to r = 0.6, 0.9 and height twists t <= 1000 at U = 1e6): on the sextic residue-symbol rows over Z[omega] the mixed moment sum_u |M_r S_m|^2 has exponent E = 1.000 +- 0.004 for 1e5 <= U <= 1e9 at m = m* and m = 1/2, equal to the random-multiplicative baseline up to the coprimality factor 0.87, the same for Moebius, random-sign and twisted coefficients; no row exceeds 121 times the mean in the complete families (relative to the mean only). MODEL (float LP, hypothesis H(lam)): no change for lam >= 0.9; 0.8748595 at 0.85; 0.87409 at 0.75; 0.87250 at 0.6; 0.87170 at 0.5; 13/15 for lam <= 0.1; 0.8730210 with the written gates (not rerun). READ: the '+z_0' charge enters through the term L of Lemma 14.2, not the inactive-slot triangle step of Lemma 14.3. Nothing proved; no abscissa below 0.874886647.",
 obstruction="The mixed moment is control-blind (same exponent for random multiplicative rows and for Moebius, random-sign and sign-twisted coefficients), and below level the hypothesis H(lam < 1) is itself a density-type statement for the twist family. It moves the model abscissa only inside [13/15, 0.8749]; the count carries the whole gain and the numerator line adds nothing. The one place where Moebius/Gauss-sum structure could enter is (M1+) for fixed coefficients: cancellation in sums of normalised cubic Gauss sums over primes, uniform in the dual index; it is unproved.",
 obstructionKind='control-blind-density-restatement',
 controlsThatDefeat=["random multiplicative rows: same exponent (ratio 0.87-0.88, flat)",
  "sign-twisted primes and random-sign coefficients: same moment",
  "all controls: the statistic contains no target-specific factor (control-blind)"],
 lesson="Mean-value input inside the 7/8 method is a density estimate in another form; finite-U tests cannot see it. Only (M1+) with the specific Gauss-sum coefficients remains.",
 newNodes=[dict(id='m1plus-cubic-gauss-prime-sum-uniform', type='open-lemma', status='open', statement='(M1+): cancellation in sums of normalised cubic Gauss sums over primes, uniform in the dual index, for the fixed coefficients of the 7/8 method. GRH-type below-level estimate; the single point where arithmetic of the coefficients enters lanes e2-below-level-mixed-moment, e2-ms-slot-capacity, e2-two-scale-detector-moment.'),
  dict(id='z0-charge-is-lemma-14-2-term-l', type='identity', status='read', statement="The '+z_0' charge in the 7/8 manuscript enters through term L of Lemma 14.2 at short dual length, not a triangle-inequality loss (corrects r3-critical-count 5.1).")])
R['e2-tro6-signed-csum-stratified'] = dict(
 verdict='partial-result', strength=0.25, refereeHolds=True,
 nodes=['map-open-4', 'map-pos-30'],
 tags=['seven-eighths', 'tro6-natural', 'squarefull-stratification', 'polar-term', 'dual-term-correlation'],
 survivingClaim="No eta > 0 proved or measured; 7/8 unchanged. (1) Lemma S (exact, independently re-verified): chi_c(m) = chi_c(u m1) xi_k(c), xi_k periodic in primary c modulo 4 rad(k*); the long row sum stays sextic. Proposition S2 holds from its hypotheses ((T_tau) measured only). The squarefree stratum holds about 94% of both l2 norms; non-squarefree strata are 4-6% of the Cauchy-Schwarz bound. (2) After polar removal no excess of rho-hat over random-phase rows is resolved in any stratum (sensitivity 0.01-0.04 in the exponent); the optimiser finds the polar term (+0.53), uniform across strata. (3) A reproducible correlation, excess R^2 about 0.25 over the permutation null and flat in Q, between the non-polar remainder times conj gamma_1(c) and theta estimators at index lambda c. Not a Voronoi formula; gives no bound.",
 obstruction="Stratification by squarefull part only twists the conductor weights by a bounded-conductor character and cannot change an exponent (leg (b) closed as a route; inter-stratum cancellation not excluded). The row-sensitive statistic sees only the polar term. Form (a) (signed c-sum with a power saving, i.e. TRO6 natural) stays open: the measured correlation with theta estimators at index lambda*c is not separated from the shared Gauss-sum table (random-coefficient control not run) and is not a Voronoi formula. Function-field control not run.",
 obstructionKind='no-saving-per-stratum',
 controlsThatDefeat=["random-phase rows: equal exponent after polar removal in every stratum",
  "not run: random-coefficient control for the dual-term correlation; function-field control"],
 lesson="The squarefree stratum is the whole problem. Scan all 216 S-unit shifts before calling a dual-term null (the term sits at index lambda*c, not -e0*c). Next step if continued: random-coefficient control for the lambda*c correlation.",
 housekeeping="15 GB left in ~/rh-push/e2-tro6-signed-csum-stratified/out on the server and 1.1 GB locally (gitignored); a local rm was refused by the safety check and not retried. Needs user action or an explicit cleanup assignment.",
 newNodes=[dict(id='tro6-dual-term-lambda-c-correlation', type='measured-phenomenon', status='measured', statement='Non-polar remainder times conj gamma_1(c) correlates with theta estimators at index lambda*c: excess R^2 about 0.25 over permutation null, flat in Q (3750..10607). Origin (theta coefficients vs shared Gauss-sum table) not separated.'),
  dict(id='tro6-lemma-s-squarefull-twist', type='identity', status='proved', statement='chi_c(u m1 m2^2 ... t^6) = chi_c(u m1) xi_k(c), xi_k of bounded conductor; row sum stays sextic.')])
R['e2-gl3-cover-cuspidal-rows'] = dict(
 verdict='precise-obstruction', strength=0.07, refereeHolds=True,
 nodes=['map-pos-35', 'separating-probe'],
 tags=['seven-eighths', 'order-2-rows', 'gl3-double-cover', 'waldspurger', 'shimura-relation'],
 survivingClaim="For a genuine weight-3/2 form over Q (Kohnen-plus form of 11a, c(n) exact to 2e6, validated against 1644 AFE central values): twist rows are symbol type with sign-blind Gram matrix; product-index rows c(dm) over squarefree labels show no correlation with mu(d)chi_d(m), prime-direction statistic 0 within 1/sqrt(n) (planted absorption gives 0.5-0.9), Gram spectrum not above the random-sign control; the unrestricted row series is entire (h = 0, model abscissa 1); the only coherent set is the square class d0 k^2 (Shimura relation), with the Moebius sign at shift 1/2 (closed by e1). No zero statement.",
 obstruction="Order-2 rows need three conditions together: Moebius produced by the row, shift 0, and a coherent set of relative size 1/2. Signed Waldspurger coefficients at product indices give none (signs at random level); square classes give the first and third only at shift 1/2, the case closed by e1-gl3-theta-order2-rows. Transfer to the Eisenstein series on the double cover of GL(3) is by analogy only (field hypothesis of Brubaker-Friedberg Thm 4.1 not met over Q; exponential sum H and coefficient index not derived).",
 obstructionKind='row-does-not-absorb-moebius',
 controlsThatDefeat=["random-sign rows: same Gram spectrum and same correlation level",
  "not computed: genuine cusp forms on the GL(3) double cover; Gauss-sum-weighted double sum; exact H for the (2,1) parabolic"],
 lesson="Signed square roots of central values behave as random signs against mu*chi. Do not re-run GL(2) half-integral-weight product-index rows. Untested: explicit genuine GL(3)-cover cusp forms.",
 newNodes=[dict(id='order2-row-three-conditions', type='obstruction', status='argued', statement='An order-2 row attack needs jointly: Moebius produced by the row, shift 0, coherent set of relative size 1/2. Waldspurger product-index rows give none; square classes give two at shift 1/2.')])
R['e2-ms-slot-capacity'] = dict(
 verdict='precise-obstruction', strength=0.2, refereeHolds=True,
 nodes=['map-open-3', 'binding-row-bin'],
 tags=['seven-eighths', 'slot-capacity', 'lemma-17-1', 'reflection-conductor', 'sign-twist-invariant'],
 survivingClaim="Relative to the unrefereed 7/8 manuscript. PROVED-rel: both conditions of Lemma 17.1 are hypotheses (17.2) of Lemma 17.2 under (M, F_0, z_0) = (2(r+z)-m, r+z, z). PROVED-rel, principal configuration, for r+z >= 2m/3 and r+3z >= m: r+2z <= m is exactly T_d <= F at the dyad v = T_d of the column branch of Lemma 14.3, T_d = 2M+2z_a-F; the 2z_a comes from mark primes in the reflection conductor (corrects r3-critical-count 5.1). For m/2 <= r+z < 2m/3 the binding requirement is 3r+9z <= 4m. PROVED (elementary): with all rows, r+z < m fails at r=0 for z > 5m/6. MEASURED: for cubic rows at r=0, z > 1/2 the prime-supported Gauss vector exceeds mean-value level with law about 0.65 X^(2/3) N(u)^(-1/3)/log X; sextic excess 7-19%, flat, undecided. MODEL: abscissa 0.87329 / 0.87279-0.87299 with relaxed slot, above 13/15.",
 obstruction="A slot lemma uniform in bounded prime coefficients is sign-twist invariant on its slot side, and the cubic Gauss-vector configuration shows such a statement cannot exceed capacity m/2 at r = 0. A relaxed slot must use the specific coefficients (prime sums of a Hecke character times a Moebius sum), i.e. a GRH-type below-level estimate ((M1+), unproved). Not established for the sextic rows of the lemma or for r >= 1/2; non-principal configurations and the two-Poisson recursion are untraced. Reduced-model tests at U <= 5e5 have no power for slots shorter than U^0.4.",
 obstructionKind='coefficient-uniform-lemma-is-twist-invariant',
 controlsThatDefeat=["sign-twisted primes: any coefficient-uniform slot lemma holds equally for the twist",
  "random-coefficient controls: moment flat, same as the arithmetic case in the window 1-2z < r < 1-z",
  "cubic Gauss vector: explicit configuration forcing the factor 2 at r = 0"],
 lesson="Do not look for a coefficient-uniform relaxation of the slot condition. The price even if relaxed is small (abscissa stays above 13/15).",
 newNodes=[dict(id='ms-slot-condition-is-reflected-dual-length', type='identity', status='proved-relative', statement='Lemma 17.1 condition r+2z <= m equals T_d <= F on the reflected dual length of Lemma 14.3 (principal configuration, r+z >= 2m/3, r+3z >= m); the 2z_a comes from mark primes in the reflection conductor.')])
R['e2-two-scale-detector-moment'] = dict(
 verdict='precise-obstruction', strength=0.12, refereeHolds=True,
 nodes=['map-open-13', 'target-0874-restricted-moment', 'mobius-packet-energy-target'],
 tags=['seven-eighths', 'restricted-fourth-moment', 'two-scale-detector', 'saddle-pair', 'not-family-specific'],
 survivingClaim="Relative to the unrefereed sources; no abscissa moved. For the estimate system C1-C3: a restricted-moment saving that excludes block m* = 0.4183 lowers the critical-class exponent by at most 1.13e-4. (H) at block m* implies a count saving U^-omega on rows whose plain witness is that block (one direction). A detector factor attached by Chebyshev to the central fourth moment needs more than 53% of the distance from large-sieve level to Lindelof-on-average; the two-scale bilinear form 48-49%; the one-scale mixed moment exactly 1/6. PROVED-rel: with the detector at t = 1, all but U^(R_c - d) rows of a class carry a plain witness of length in [0.2543 - 4.26d, 0.4183 + 1.37d]. MEASURED on 19,308 independent prime-conductor sextic rows at U = 2^19: source-threshold class empty; rank-defined class omega 0.35-0.38 against 0.41 random class and 0.33-0.37 random multiplicative rows.",
 obstruction="The restricted fourth moment (H) and the two-scale detector are not independent inputs: both reduce to a count saving at the saddle pair (r*, m*), whose cheapest open form is the one-scale below-level mixed moment (N < 1.1366) or (M1+). The binding numerator block is m* = 0.4183, not m = 1/2, so a central-only saving is worth at most 1.13e-4. Lemma 18.1 admits no Moebius-coefficient factor at central length. Finite-U numerics cannot test (H): no zero-carrying rows exist in the sample and true rows match random multiplicative rows. (H), (TS) and the one-scale mixed moment remain open.",
 obstructionKind='reduces-to-sibling-open-item',
 controlsThatDefeat=["random multiplicative rows: same restricted-moment omega (0.33-0.37 against 0.35-0.38)",
  "random class: omega 0.41 (the statistic is not family-specific)"],
 lesson="Do not combine (H) with detector scales again; the three items map-open-2, map-open-13 and target-0874-restricted-moment are one item (count saving at (r*, m*)). True rows are exact conjugate duplicates in the sample (halve reported counts).",
 newNodes=[dict(id='saddle-pair-count-saving-equivalence', type='identity', status='proved-relative', statement='In the estimate system C1-C3 of the 7/8 method, a restricted fourth-moment saving U^-omega at block m* = 0.4183 implies a count saving U^-omega on plain-witness rows; detector-beside-fourth-moment needs > 53%, two-scale 48-49%, one-scale mixed moment 1/6 of the large-sieve-to-Lindelof gap.')])
R['e2-theta-dual-mseries-fe'] = dict(
 verdict='precise-obstruction', strength=0.08, refereeHolds=True,
 nodes=['probe-equals-theta-row-form', 'cubic-r2-conductor-a4', 'map-pos-31'],
 tags=['seven-eighths', 'multiple-dirichlet-series', 'kubota-reflection', 'weyl-group-indefinite', 'target-blind'],
 survivingClaim="On squarefree m prime to 6 L s mu, the m-dependence of the theta-dual scalar MS (5.3) at j_p=1, times conj(chi_s(-m)), equals (function of m in finitely many classes) x conj(alpha(m))^2 x gt_1(s mu^3, m), index modulo sixth powers (PROVED-rel MS; checked numerically with power). IF a Kubota-type functional equation is granted for that series (existence, K-type and S-data OPEN), the reflection acts by x' = 3x + z - 3/2, the group <K6, Th3, g> is infinite of indefinite type, and every chamber w(R_+) and the g-image of each of the 8 pieces of n1-tube-hull lies in x >= 3/2 (PROVED-model, word length 16). MEASURED: cubic l=+-1 calibration passes, random rows at null level, sextic series undecided at norm 1e7. No abscissa below 0.874886647.",
 obstruction="The m-reflection is target-blind Gauss-sum algebra (same for every eta and for DH). It lowers x only from points with 2x+z < 3/2 where nothing is known; every chamber it adds lies in x >= 3/2, so the hull abscissa equals the input. Its chamber is reached only by meromorphic continuation across the zeros of the Kubota normalising L-factor, and a hull of a meromorphy tube gives no control of the polar set. Existence of the functional equation for the full m-series is open; order-6 equations cannot be tested by dual lengths at norm 1e7 without the S-data matrix.",
 obstructionKind='target-blind-reflection-no-new-region',
 controlsThatDefeat=["DH and every target eta: the reflection step is identical (contains no target)",
  "random rows: stay at null level in the dual-length test (calibration only)"],
 lesson="A second reflection in the modulus adds no region below the input abscissa. Side finding: the 8-piece set of n1-tube-hull is not closed under symmetry transport, so its piece rule is argued, not proved.",
 nodeRepairs=[dict(id='n1-tube-hull', change='piece rule status proved -> argued: K6 composed with the numerator reflection sends the theta-dual piece to x-1/2 = T < -1/2, outside the 8-piece set', source='e2-theta-dual-mseries-fe')],
 newNodes=[dict(id='theta-dual-mseries-is-twisted-kubota', type='identity', status='proved-relative', statement='On squarefree m the theta-dual m-series of MS (5.3) is an alpha^(-2)-twisted stripped sextic Kubota series in the modulus m at index 4^5 s mu^3.')])
R['e2-sixfold-period-z2'] = dict(
 verdict='dead', strength=0.03, refereeHolds=False,
 nodes=['map-open-5', 'zv-spinor-arithmetic-coupling-missing', 'probe-equals-theta-row-form'],
 tags=['seven-eighths', 'sixfold-cover', 'z2-grading', 'period', 'hasse-davenport', 'renderer-spin'],
 survivingClaim="Route dead, by reduction to tro6-period (MB), on step S3 alone. For squarefree moduli prime to m and the n = 1 part of the rows, relative to manuscript (4.7): each signal entry equals the corresponding additive Gram entry times mu(c) alpha(c)^2 G(c)^2 Psi(c) chi_c(-1), independent of the row variable, for every pair of moduli. The integrand cubic theta x sextic section x Hecke character is odd under -1 in mu_6 and integrates to zero. Balanced Gauss-sum triple (corrected): gt_2(m,c) G(c) chi_c(m)^3 = mu(c) alpha(c) G(c)^2 conj(gt_1(m,c)). G(c) depends only on c mod 4. j -> 4-j fixes j mod 2. No global period constructed. No statement about zeros.",
 obstruction="The rows are complex conjugates of the additive Gauss functions up to mu(c) Psi(c), so the signal form and the Gram form share matrix entries: no grading or linear operation on the row variable (the Z/2 factor of Z/6 included), the modulus class or the Hecke grade distinguishes them. Any separation must come from the modulus weight mu(c) Psi(c), which is the tro6-period (MB) form already recorded. The proposed period is Z/2-odd and vanishes. NOT established (referee): that the exceptional P_a^(1/6) term has a definite Z/6 or Z/2 character; the measured 'index 0' concerns the diagonal k = 0 term, not the exceptional term (which comes from nonzero frequencies k = a1^6 e).",
 obstructionKind='shared-matrix-entries',
 controlsThatDefeat=["all controls: the character computation contains no target, so it is the same for every control"],
 lesson="Gradings on the row variable cannot separate signal from exceptional term. The renderer spin sign has no arithmetic counterpart here. The pivot (mu as the Hasse-Davenport constant) returns positive-list item 33.",
 refereeNote="Referee does not hold the claim as worded: steps T1/S2 test the diagonal Gram summand, not the P_a^(1/6) term. The dead verdict stands on S3 only.")
R['e2-control-rz-defect-audit'] = dict(
 verdict='precise-obstruction', strength=0.08, refereeHolds=True, kind='filter',
 nodes=['ctrl-rz-reciprocal-shift', 'map-pos-23', 'map-pos-22'],
 tags=['control', 'local-defect', 'rz-reciprocal-shift', 'statement-shape', 'filter'],
 survivingClaim="Not a lead. The literal statement 'zero offset <= sup_p |log|alpha_p||/log p' is false (1/zeta: defect 0, offset 1/2; T-NR: defect 1/2+delta0, offset delta0). Under convention D1 (fitted, not forced by the functional equation), within products and quotients of shifted zeta and primitive Dirichlet L-functions with T-NR factors at finitely many primes, the offset is given by a divisor formula: identity for finite-prime local zeros and quotient poles; for product factors equivalent to |Re a_j| + Theta_j - 1/2 <= delta (RH/GRH at maximal shift). For E_a, offset = a + Theta - 1/2 unconditionally. The fake (1-5T+5T^2)/((1-T)(1-5T)) (unimodular generalised-prime Euler product, FE, offset 0.29899) and zeta(2s)/zeta(s) show the integers and the functional equation cannot be dropped. RZ_b properties hold (b=0.93, 0.9); completed function has zeros exactly at b and b-1.",
 obstruction="'Zero offset <= local defect' is GRH with defects: for shifted L-function factors it is equivalent to RH/GRH for the factor with the largest shift, and an equality read off E_a silently assumes RH. Local defect is a property of the prime system, not of the function. RZ_b passes every prime-side identity and size inequality after s -> s+1-b and F -> 1/F, so a valid argument needs a step not covariant under shift and reciprocal: the sign of Lambda, or the position of the pole and symmetry line relative to the chain. The chain l^2 threshold sees only infinitely many primes (T-NR: threshold 1/2, zeros at 1/2+delta0) and is not a zero locator.",
 obstructionKind='statement-shape-equivalent-to-grh',
 controlsThatDefeat=["RZ_b = 1/zeta(s+1-b): unimodular parameters, zero at offset 1/2 (counterexample to the literal reading)",
  "T-NR: fails the literal reading; chain threshold 1/2 with zeros at 1/2+delta0",
  "E_a = zeta(s+a)zeta(s-a): offset = a + Theta - 1/2",
  "fake over generalised primes (Beurling-type): unimodular, exact FE, offset 0.299",
  "zeta(2s)/zeta(s): zero at s = 1, no FE",
  "DH: statement not formulable without local factors"],
 lesson="Add RZ_b as a standing control: any step covariant under shift and reciprocal is defeated by it. The 9x7 control table is mostly ARGUED, not replayed.",
 newNodes=[dict(id='ctrl-fake-genprime-unimodular-fe', type='control', status='proved', statement='(1-5T+5T^2)/((1-T)(1-5T)), T = 5^-s: Euler product over generalised primes, unimodular parameters, exact functional equation, zero offset 0.29899. Shows the integers cannot be dropped from any local-defect statement.'),
  dict(id='shift-reciprocal-covariance-filter', type='obstruction', status='argued', statement='RZ_b passes every prime-side identity and size inequality after s -> s+1-b, F -> 1/F; a valid argument needs a step not covariant under shift and reciprocal (sign of Lambda, or position of pole/symmetry line).')])
os.makedirs(E + '/outcomes', exist_ok=True)
for slug, r in R.items():
    c = cur[slug]
    rec = dict(slug=slug, round=2, batch=2, kind=r.pop('kind', 'attack'), family=c['family'], nodes=r.pop('nodes'),
               launchedNodes=c['nodes'], rowsChecked=c.get('rowsChecked', []), tags=r.pop('tags'), verdict=r.pop('verdict'),
               survivingClaim=r.pop('survivingClaim'), obstruction=r.pop('obstruction'), obstructionKind=r.pop('obstructionKind'),
               controlsThatDefeat=r.pop('controlsThatDefeat'), lesson=r.pop('lesson'), refereeHolds=r.pop('refereeHolds'),
               referees=1, aboutZeros=False, strength=r.pop('strength'),
               requirements=dict(r1=False, r2=False, r3=False))
    rec.update(r)
    rec['resultFile'] = f'{P}/{slug}/RESULT.md'
    rf = f'{P}/{slug}/REFEREE.md'
    if os.path.exists(rf): rec['refereeFile'] = rf
    assert all(n in c['nodes'] for n in rec['nodes']), slug
    assert os.path.exists(rec['resultFile']), slug
    json.dump(rec, open(f'{E}/outcomes/{slug}.json', 'w'), indent=1, ensure_ascii=False)
    print(slug, rec['verdict'], 'referee file' if 'refereeFile' in rec else 'NO referee file')

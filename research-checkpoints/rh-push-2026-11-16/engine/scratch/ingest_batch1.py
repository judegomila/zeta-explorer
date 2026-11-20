import json, os
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = 'tmp/research-2026-11-16/push/'
R = []
def rec(slug, nodes, allNodes, verdict, surviving, obstruction, kind, controls, lesson, refHolds, refNote, aboutZeros, strength, tags, newNodes=None, followUp=''):
    R.append(dict(slug=slug, round=1, batch=1, kind='attack', nodes=nodes, launchedNodes=allNodes, tags=tags,
                  verdict=verdict, survivingClaim=surviving, obstruction=obstruction, obstructionKind=kind,
                  controlsThatDefeat=controls, lesson=lesson, refereeHolds=refHolds, refereeNote=refNote,
                  referees=1, aboutZeros=aboutZeros, strength=strength, newNodes=newNodes or [], followUp=followUp,
                  resultFile=P + slug + '/RESULT.md', refereeFile=P + slug + '/REFEREE.md'))

rec('e1-cofinal-legendre-dual',
    ['cofinal-legendre-dual', 'legendre-lp-nu1'],
    ['cofinal-legendre-dual', 'rig-continuum-sawtooth', 'plant-suppressed-by-zeta-rho0', 'legendre-lcm-identity', 'legendre-lp-nu1'],
    'precise-obstruction',
    "PROVED (author and referee): dual-feasible points of the Legendre LP restrict along divisibility chains; alpha log x <= 8 + o(1); every limit point of dual-feasible points is feasible at every real scale, has density 0, psi(t) <= 3 log2 t + 3, and a Dirichlet transform holomorphic in Re s > 0; at density 1 the sawtooth discrepancy is >= (1/8 - o(1)) log x for integer-supported b. MEASURED (1e4..1e7): v log x/x falls from 4.08 to 2.86 with +-0.2 fluctuations, limit undecided; the optimum vanishes at fixed t; the optimum at qx restricted to x has objective -0.39 to -0.52 sqrt x at q = 2, 3 against +1.0 sqrt x. No statement about zeros.",
    "The cofinal limit of dual-feasible points keeps none of nu_1(x) ~ sqrt x: integer unit steps against Y log Y force any bounded-discrepancy cofinal dual to density 0, and the LP optima live at t ~ x in x-dependent Moebius-resonant configurations that are not sections of one measure. A fixed cofinal b is controlled only in mean square (MV-CAP); the pointwise bound is the open Moebius sum sum_k mu(k) r_b(x/k) (the source's Step 7).",
    'no-limit-object',
    ["E_a = zeta(s+a)zeta(s-a): passes every step (chain returns exponent 1/2 + a; nothing separates it from zeta at the level of exponents; ARGUED)",
     "Beurling: Lambda_a >= 0 holds, power-size sawtooth discrepancy",
     "DH, Liouville sign twist, theta^3: fail only at Lambda_a >= 0 (the separating step is positivity with log discrepancy)"],
    "Do not re-run limits of optimal Legendre duals. The only open item is the pointwise sum of mu(k) r_b(x/k) for one fixed r_b.",
    True, "All PROVED steps re-derived. Measured range corrected: v log x/x reaches 2.864 at x = 1e7, below the first stated range; size law mu(m) sqrt(m)/sigma(m) only approximate.",
    False, 0.08, ['legendre-lp', 'cofinal', 'compactness', 'mv-cap'],
    newNodes=[dict(id='legendre-dual-limit-density-zero', type='identity', status='proved', statement='Every limit point of Legendre-LP dual-feasible points is feasible at every real scale and has density 0, psi(t) <= 3 log2 t + 3.'),
              dict(id='legendre-dual-restriction-rule', type='identity', status='proved', statement='Feasibility of a Legendre-LP dual point at qx implies feasibility of its restriction at x.'),
              dict(id='cofinal-pointwise-mobius-sum', type='open-lemma', status='open', statement='Pointwise polylog bound for sum_k mu(k) r_b(x/k) for one fixed cofinal r_b.')])

rec('e1-rs-torus-laguerre-orbit',
    ['euler-fe-coupling-at-height', 'euler-product-torus-parametrisation', 'laguerre-hierarchy'],
    ['dbn-prime-torus-phase-closure', 'euler-fe-coupling-at-height', 'euler-product-torus-parametrisation', 'bridge-winding-equals-NT', 'laguerre-hierarchy'],
    'precise-obstruction',
    "B_1 and B_2 are empty (proved); B_3 is non-empty (explicit point); B_N non-empty with torus measure 0.02 to 0.06 for scanned N <= 300 (measured). Exact identity Lag[2f+R] = 4 Lag[f] + 2(2f'R' - fR'' - Rf'') + Lag[R]; with the true-time Lag[f] (not the frozen torus Lag_N) the remainder beyond -2 R f'' is within N^-3/2 log^2 N at N = 10..300 (measured, not uniform). The zeta main-sum segment enters B_N (first at t = 221.07; 18 of 21 scanned N >= 5); the true Z has Lag > 0 at all 23 points checked, the sign being set by the remainder R. The DH main sum enters B at 85.707, 114.160, 166.479, 176.709, each at an off-line zero.",
    "The torus exclusion set is entered by the zeta main sum itself; the sign of the Laguerre expression is decided by the Riemann-Siegel remainder of size N^-1/2, so the statement is one-point with no margin (rows S4, Q13) and restates verified height. The coupling theta' = log(main-sum length) is the functional equation alone and holds for DH up to O(t^-2). Order-1 Laguerre detects an off-line pair only if 2/beta^2 > S(gamma).",
    'one-point-no-margin',
    ["DH: satisfies the coupling theta' = log N identically (does not separate)",
     "backward heat (amplitude tilt only, c < 0): passes the test at the zeta level",
     "not run: theta^w, T-NR, Beurling, E_a, phase-rotated transfer operator, true heat family"],
    "On the prime torus the Euler product enters only as the identity of one orbit point. Any torus exclusion set needs tolerance |R| ~ N^-1/2 and has no margin. Diagnostic only: (orbit time fraction in B_N)/(torus measure of B_N) is 0.002..0.1 for zeta, 0.4..0.8 for DH, about 1 for translated orbits.",
    False, "Verdict stands. One PROVED-labelled identity was false as written with the frozen-speed torus quantity Lag_N (residual up to 9.69 against claimed 0.168 at N = 10); correct with the true-time Lag[f].",
    False, 0.05, ['prime-torus', 'riemann-siegel', 'laguerre', 'one-point'])

rec('e1-sparse-recurrence-amplifier',
    ['bagchi-strong-recurrence', 'large-sieve-density-selector'],
    ['bagchi-strong-recurrence', 'euler-product-torus-parametrisation', 'tinfty-flow-generator-spectrum', 'large-sieve-density-selector'],
    'precise-obstruction',
    "CLASSICAL (Rouche step of Bagchi's criterion; not new): for a zero with gamma_0 > 0 the number of one-separated Rouche returns is R(T) <= N(beta_0 - r, T + gamma_0 + 1). So power-sparse recurrence at every hypothetical off-line zero (exponent 0.2308 at beta_0 = 7/8, tending to 1 as beta_0 -> 1/2) is equivalent to RH. For a hypothetical zeta zero the return set has frequency 0 and every finite Bohr set leaves the zero in the tail R_P. MEASURED (float64): DH has 8116 zeros in 0.52 <= Re s <= 1.2 up to 1e5; returns at positive rate at three DH zeros (fraction 1.0e-4 to 4.3e-4 at r = 0.1), within 13 to 17 percent of a Haar Monte Carlo model.",
    "A recurrence hypothesis whose returns each produce a zero is bounded by the zero count, so it is as strong as the zero-free statement (restatement). zeta_P never vanishes, so an off-line zeta zero is a Haar-null event carried by the tail beyond every finite prime set; Kronecker equidistribution gives frequencies only for sets of positive Haar measure. Closed at step 2.",
    'restatement-of-rh',
    ["sign twist: not separated (argued, not proved)",
     "DH and E_a: separated only through the density estimate, not through the recurrence step"],
    "Reject combinations whose amplifier is 'one zero implies many zeros' via Bohr sets or almost periodicity.",
    True, "Lemma 1 must be stated for gamma_0 > 0 (pole at s = 1 otherwise); Lemma 1 and Corollary 2 are classical, not new.",
    False, 0.05, ['recurrence', 'bohr-set', 'density-estimate', 'restatement'])

rec('e1-selberg-twist-control',
    ['selberg-zeta-companion', 'pole-coupling-theorem-pc'],
    ['selberg-control-pair', 'selberg-freeze-sandbox', 'selberg-zeta-companion', 'pole-coupling-theorem-pc', 'selberg-phase-gate-vs-zeta'],
    'precise-obstruction',
    "MEASURED (not interval-certified): Z_{Gamma(2)}(s, chi_{a,b}) has a real off-line zero at 0.95033 for (0.01,0.02), 0.83990 for (0.03,0.05), 0.72661 for (0.02,0.07); none on [0.505,1] for (0.05,0.12). The object has an Euler product over geodesics and an s <-> 1-s equation with elementary factor; it lacks the integers, order one, finite degree and zeta's sign of the zero side. PROVED: any non-negative-coefficient series c Z'/Z + E with the PSL2(Z) Selberg zeta has sigma* >= 1/2 > beta/2 (Maass pole at 1/2 + 9.5337i plus Landau), so Theorem PC is silent at rho/2; the pole-cancelling difference has disjoint supports; in Z'/Z - 2 zeta'/zeta(2s) the rho/2 poles cancel.",
    "Selberg zetas do not supply the missing control: the s <-> 1-s equation belongs to the order-2 function, while the degree-one unimodular Ruelle product has poles where Z has zeros, so every Landau-positivity mechanism holds with reversed inequality. Its off-line zeros are real and finitely many, so it tests nothing at height > 0. The Selberg companion for Theorem PC is closed: sigma* >= 1/2.",
    'control-does-not-exist / abscissa',
    ["SEL (twisted Selberg zeta): none of positive-list items 16-23 fails quantitatively against it (16, 17 pass; 20, 21 pass with reversed sign; 18, 19, 22, 23 not formulable, failing at INT)",
     "under the weak reading of GEOM/SIZE the minimal input sets become {INT,GEOM} and {FE,SIZE,INT}; under the strict reading the map's three sets stand"],
    "What separates zeta from the Selberg family is the integers (additive structure), order one and the sign of the zero side; filter new attacks on those. Do not re-attempt Selberg companions for Theorem PC.",
    True, "All PROVED steps re-derived; numerics reproduced on a new character.",
    False, 0.12, ['selberg', 'control', 'landau', 'pole-coupling'],
    newNodes=[dict(id='ctrl-sel-twisted-selberg', type='control', status='measured', statement='Twisted Selberg zeta of Gamma(2): Euler product over geodesics, s <-> 1-s equation, real exceptional zeros off the line; lacks INT, order one, finite degree, sign of the zero side.'),
              dict(id='selberg-pc-abscissa-half', type='obstruction', status='proved', statement='Any non-negative-coefficient coupling c Z\'/Z + E with the PSL2(Z) Selberg zeta has sigma* >= 1/2; Theorem PC is silent at rho/2.')])

rec('e1-nb-gram-period-transfer',
    ['vasyunin-gram', 'vasyunin-lammin-uniform-lower-bound', 'cotangent-reciprocity-period-function'],
    ['vasyunin-gram', 'cotangent-reciprocity-period-function', 'vasyunin-lammin-uniform-lower-bound', 'frobenius-gcd-factorisation', 'rm-kappa-smooth-open'],
    'partial',
    "PROVED (elementary, checked by a second agent; novelty unchecked): 1/(64 * 2^Omega_N * N^2) <= lam_min(G_N) <= (3 + log N)/(N-1)^2 for the Vasyunin Gram matrix, so lam_min >= A_p N^-p holds for every p > 2 and for no p < 2; p = 2 is open. This settles the open lemma vasyunin-lammin-uniform-lower-bound in the form p = 2 + eps. MEASURED (N <= 2000): the same law (exponents -1.91 to -1.94) for zeta, four characters mod 3/4/5, DH and two periodic sequences with neither Euler product nor functional equation.",
    "lam_min(G_N) is a mean-value quantity fixed by the 1/|s|^2 weight: the same N^-2 law holds for DH and for sequences with no arithmetic structure, and it bounds only the size of the optimal coefficients, not the distance d_N. The period-function recursion on Gram entries restates classical formulas and adds no zero information; no transfer-operator compression found (non-existence not proved). Stops at rows P14/P15.",
    'mean-value / control-blind',
    ["DH: same lam_min law (exponent -1.928); DH floor 8.4e-5 invisible at N <= 2000",
     "four Dirichlet characters and two periodic sequences without Euler product or functional equation: same law"],
    "Do not use lam_min of Nyman-Beurling Gram matrices as a zero detector. Phi(u) = u A(1) - sum_{m<=u}(1*a)(m) gives the eigenvalue bounds in a few lines.",
    True, "No error in any PROVED step; Lemmas 2 and 3 are restatements of classical formulas.",
    False, 0.1, ['nyman-beurling', 'gram', 'period-function', 'mv-cap'],
    newNodes=[dict(id='vasyunin-lammin-two-sided', type='identity', status='proved', statement='1/(64*2^Omega_N*N^2) <= lam_min(G_N) <= (3+log N)/(N-1)^2; exponent exactly 2 up to N^o(1); p = 2 open.')])

rec('e1-forcing-free-bilinear-split',
    ['vaughan-sqrt-type1-exact', 'vaughan-forcing-law', 'landau-one-sided-target'],
    ['vaughan-sqrt-type1-exact', 'vaughan-forcing-law', 'landau-one-sided-target', 'legendre-lcm-identity'],
    'precise-obstruction',
    "For any finitely supported mu' on [1, D] and X >= D: sum_m (1*mu')(m) m^-1/2 R(X/m) = -(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2) + E, |E| <= ||mu'||_1 (6 + log X)/sqrt X. With mu' = mu_{<=U} - c2 delta_2 - c3 delta_3 and M'(1) = M'(1/2) = 0: R(X) = K'_X[R] + Xi', |Xi'| <= (U + 32 sqrt U + 25)(6 + log X)/sqrt X, unconditional (7.99e-7 at X = 1e32). The Vaughan X^{1/4} forcing is a normalisation. The kernel symbol is 1 at every zero on or off the line; kernel absolute mass is of order sqrt X. A one-sided polylog bound on K'[R] is equivalent to RH. NOT surviving: the parity cap at restricted level (false: restricted-level Legendre plus positivity is the half-weight Chebyshev/Legendre LP, whose polylog gap is an open RH-hard quantity).",
    "After the forcing is removed by two linear conditions on the mollifier, every identity of this shape is a linear combination of the half-weight Legendre identity (1*Lambda = log) with symbol exactly 1 at every zero; at full level Lambda >= 0 is implied (system has the single solution Lambda), and the remaining one-sided polylog bound on K'[R] is equivalent to RH (Theorem OS). Positivity enters only in Landau's lemma.",
    'restatement-of-rh',
    ["E_a = zeta(s+a)zeta(s-a): not excluded by any proved step",
     "structured sign twist with Lambda >= 0 (TW+): not excluded by any proved step"],
    "Filter out any combination whose only new ingredient is a different Type-I/Type-II split or mollifier of this shape; a live route must use positivity non-linearly or the size normalisation that separates zeta from E_a. Restricted-level Legendre plus positivity is NOT closed by parity: it is the Legendre LP lane.",
    False, "Verdict stands. Theorem R(iii) (parity cap at restricted level, labelled PROVED) is false: Theorem P does not apply to Chebyshev-class weights. Also not surviving: uniqueness of the dual certificate, '5-8x', 'X^0.44', '4.7e-7 by proof'.",
    False, 0.04, ['vaughan', 'bilinear', 'landau', 'legendre-lp', 'restatement'],
    newNodes=[dict(id='vaughan-forcing-is-gauge', type='identity', status='proved', statement='The X^{1/4} Vaughan forcing equals -(4+2gamma) sqrt X M\'(1) - zeta\'(1/2) M\'(1/2) and is removed by two linear conditions on the mollifier; residual |Xi\'| <= (U + 32 sqrt U + 25)(6 + log X)/sqrt X.')])

rec('e1-gl3-theta-order2-rows',
    ['map-open-1', 'mem-new-probe-non-sextic', 'seven-eighths-abscissa-formula'],
    ['map-open-1', 'separating-probe', 'mem-new-probe-non-sextic', 'seven-eighths-abscissa-formula'],
    'precise-obstruction',
    "In the Goldfeld-Hoffstein/CFH model of the quadratic A_2 series: the residue at w = 1 has p-part 1/(1 - x^2); the iterated residue at s = w = 1 vanishes; the chi_b-twisted residue is supported on m = b_0 n^2 with value phi(b)/b (measured, 12 twists). Given the recalled (not opened) non-genericity of theta on the double cover of GL(3), theta and theta-induced rows are of symbol type with no reciprocal: h = 0, model abscissa 1. For genuine cusp forms on the double cover of GL(2) (weights 13/2, 17/2, exact): rows R = X T with X = mu(e)(D/e) e^-1/2; c(D) is a row scaling; the Gram is sign-blind; detection condition beta > 3/2 - h/r >= 1.",
    "On double covers a Moebius sign on a quadratic symbol and centring on the unitary axis did not occur together in any computed case: the symbol enters Hecke relations as a Gauss sum over p, so the reciprocal sits at shift 1/2, cancelling the largest order-2 gain h/r = 1/2. Model abscissa 1 or detection only for beta >= 1.",
    'abscissa-at-or-right-of-1',
    ["sign twist: gives the same rows (Gram is sign-blind)",
     "controls give the same rows in the non-symbol pivot"],
    "Order-2 (quadratic) analogues of the 7/8 mechanism through theta or half-integral weight GL(2) forms are closed. Untested: genuine cusp forms on the GL(3) double cover; exact Whittaker coefficients of cusp-induced Eisenstein series.",
    True, "All PROVED steps confirmed; one false parenthetical in section 3; non-genericity of GL(3) theta is cited from memory, not opened.",
    False, 0.06, ['metaplectic', 'seven-eighths', 'order-2', 'abscissa'])

rec('e1-euler-anchor-heat-certificate',
    ['euler-anchor-heat-certificate', 'heat-evolved-von-mangoldt-positivity'],
    ['euler-anchor-heat-certificate', 'landau-transport-lemma-l', 'offline-zero-visibility-law', 'heat-evolved-von-mangoldt-positivity'],
    'precise-obstruction',
    "PROVED: with constant S a pair with deficit 1 - q <= e^{-cL} is certified to depth 2 pi^2 c/L, so reaching t = 0 from an anchor at kappa = C needs c >= C/(2 pi^2) (0.1013 at C = 2, 0.0760 at C = 3/2); exact identity 1 - q = (d/4)(v(b) - v(a)), v = H''/H'. MEASURED: on the actual H_t the deficit is of order 1/L^2 with both signs for L = 6..18; the certificate condition fails for 1 to 4 of 246 pairs at L = 14. ARGUED: no height-independent exponent c > 0 (c_eff of order log L / L); reach >= input half-plane, f(theta) = theta.",
    "The decisive test 2 pi^2 c > C fails for every fixed c > 0: the Euler product modulates the compression ratio q of adjacent zero pairs at the anchor by order 1/L^2 with both signs, above the trace x^{-C/(2 pi^2)} a past collision leaves. The anchor step returns its input half-plane (f(theta) = theta); the certificate needs S transport below the anchor, i.e. zero positions at the vortex height. Nothing below 0.874886647.",
    'returns-its-input (region right of 1 does not pass to the line)',
    ["E_a = zeta(s+a)zeta(s-a): passes the anchor step; constant-S certificate certifies 4 of 12 collided pairs at a = 0.1, L = 6 (unsound without the transport claim)",
     "lower bound on the deficit does not depend on positivity of the coefficients, so sign twists are not separated"],
    "Any heat-time certificate must supply S transport below the anchor; the anchor alone separates no control. Graph repair: 'Prop L' in the proposal is the theta-collision Proposition L, not Lemma L of the contradiction file; the edge to landau-transport-lemma-l is a naming collision and that node is left out of the closed set.",
    True, "Lemmas 1, 2 confirmed; Lemma 3 midpoint formula is not the leading order (deficit follows the variation of the log-derivative of the truncated Dirichlet polynomial across the pair, correlation 0.93 to 0.996).",
    True, 0.07, ['heat-flow', 'euler-anchor', 'collision', 'returns-input'])

rec('e1-burgers-cascade-anticausal',
    ['resolvent-burgers-identity', 'map-pos-16'],
    ['resolvent-burgers-identity', 'cole-hopf-viscous-burgers', 'discriminant-gradient-flow', 'map-pos-16', 'map-pos-11', 'map-pos-12'],
    'precise-obstruction',
    "For polynomial heat solutions with zero set symmetric under rho -> -conj rho: (i) no unitarily invariant norm of Gamma_-(t) is monotone in t (proved through the one-pair collision; between collisions by 50-digit witnesses, not interval-certified); (ii) the sum of Re p over right-half-plane zeros of D_t = F_t + alpha F_t' is continuous and strictly decreasing while positive for every alpha > 0 (proved; classical Dyson-law mechanism); (iii) a non-negative functional vanishing on axis configurations that is monotone along the flow is non-increasing, so it bounds t = 0 only by backward-heat values (proved); (iv) its derivative is the contour flux -(1/4)(1/2 pi i) oint M^2 (classical; verified to 3.6e-30).",
    "A functional that vanishes on the critical configuration and is monotone along the heat flow must decrease forward, so it only transports information from t < 0 (where the conclusion is false) to t = 0. Differentiating the Hankel data in t does not change row Q4: the prime side is causal for every twist (argued) and the difference is the residue sum over zeros.",
    'flow-blindness / wrong direction of monotonicity',
    ["backward heat: the functional is bounded only by values at t < 0 where the conclusion is false",
     "DH-type and E_a-type configurations: no proved step fails for them",
     "sign twists: prime-side flux zero for every twist (argued from Q4, not computed)"],
    "Reject combinations whose engine is a heat-monotone functional of the anticausal Hankel block or of zero configurations.",
    True, "All PROVED steps re-derived; (ii) is over zeros of D_t counted with multiplicity, not poles of S_t.",
    True, 0.05, ['heat-flow', 'burgers', 'hankel', 'flow-blindness'])

rec('e1-heegner-averaged-nb-span',
    ['heegner-nb-ratio', 'nyman-beurling-dx'],
    ['heegner-nb-ratio', 'heegner-height-upper-bound-h4prime', 'cm-eta-heights-lambda1', 'nyman-beurling-dx'],
    'precise-obstruction',
    "PROVED (routine): for real combinations of two or more class traces of fundamental negative discriminants, sum_D c_D (sqrt|D|/2)^s L(s,chi_D) is a factor zero-free in Re s > -1 times sum_D c_D |D|^-1/2 Lambda(s,chi_D), with pairwise distinct generalised Dirichlet frequencies 2n/sqrt|D|, so no weighting gives an Euler or Eisenstein factor. R(x) - 1 = int_1^inf |f_x - 1|^2 dy/y^2 with f_x the weighted signed count of the divisor in the horoball Im z >= sqrt(Dmax)/(2y) (standard NB dictionary). MEASURED: off-line zeros for all fixed weightings tried; R about 28.3, 9.38, 6.75, 5.26, 4.76, 3.08 at |D| <= 20..1000; a block-permuted non-multiplicative control gives smaller values (1.4 to 2.1).",
    "Averaging over discriminants cancels nothing: every Heegner bracket is of Davenport-Heilbronn type with off-line zeros. The NB ratio is 1 + distance^2 to the constant in L^2(dy/y^2): non-increasing by definition, smaller for a non-multiplicative control, and blind to a Blaschke floor (< 1e-24 above verified height) at values near 3. inf R = 1 would imply RH; no step bounds the distance; nothing passes from finite spans to the limit.",
    'finite-stage-to-limit / control-blind',
    ["block-permuted non-multiplicative control: smaller ratio (1.4 to 2.1) than the Heegner family",
     "every averaged bracket is itself DH-type (off-line zeros measured, float64 winding, not certified)"],
    "Reject Nyman-Beurling span combinations whose only arithmetic is the choice of spanning family. Open and not attacked: density of the family under RH/GRH; non-fundamental discriminants.",
    True, "Lemmas A, B, C correct in substance; horoball formula in the claim was inverted; the H4' cuspidal-energy statement is cited, not verified.",
    False, 0.1, ['nyman-beurling', 'heegner', 'finite-stage', 'dh-type'])

os.makedirs(os.path.join(HERE, 'outcomes'), exist_ok=True)
for r in R:
    json.dump(r, open(os.path.join(HERE, 'outcomes', r['slug'] + '.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# update outcomes.json (the file build_graph.py and generate.py read)
op = os.path.join(HERE, 'outcomes.json')
O = json.load(open(op, encoding='utf-8'))
by = {o['slug']: o for o in O}
for r in R:
    o = by.get(r['slug'])
    if o is None:
        o = dict(slug=r['slug'], title=r['slug'], path='push/' + r['slug']); O.append(o)
    o['verdict'] = 'partial' if r['verdict'] == 'partial' else 'closed'
    o['launchedNodes'] = r['launchedNodes']
    o['nodes'] = r['nodes']
    o['tags'] = sorted(set(o.get('tags', [])) | set(r['tags']))
    o['defeatedBy'] = r['controlsThatDefeat']
    o['note'] = 'batch 1, strength %.2f, referee %s: %s' % (r['strength'], 'holds' if r['refereeHolds'] else 'found a false PROVED step (verdict stands)', r['obstruction'])
tmp = op + '.tmp'
json.dump(O, open(tmp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
os.replace(tmp, op)
print(len(R), 'records;', len(O), 'entries in outcomes.json')

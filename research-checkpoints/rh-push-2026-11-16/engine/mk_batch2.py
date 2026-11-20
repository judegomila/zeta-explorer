#!/usr/bin/env python3
"""Writes curated/batch-2.json: the ten hand-selected assignments of batch 2 (2026-11-17).
The generator was used to enumerate partners and to check closed rows and families; the selection
is by hand (see ROADMAP.md section 7 for the reading of the ranking)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = 'tmp/research-2026-11-16/push'
RULES = (' Rules: ' + P + '/BRIEF.md; write only under ' + P + '/{slug}/ (RESULT.md); local runs through scripts/memcap.sh 8; '
         'label steps PROVED / CLASSICAL / MEASURED / OPEN.')
B = []
def cand(slug, family, nodes, rows, task, expected):
    t = task + RULES.replace('{slug}', slug)
    B.append(dict(slug=slug, family=family, nodes=nodes, rowsChecked=rows, task=t, expectedStop=expected,
                  words=len(t.split())))

cand('e2-legendre-riesz-level-phase', 'integers + positivity: restricted-level Legendre certificates, Riesz order x level',
     ['legendre-lcm-identity', 'legendre-dual-restriction-rule', 'landau-one-sided-d-bound', 'one-sided-excess-target',
      'zero-complete-rational-tents', 'vaughan-forcing-is-gauge'],
     ['T2', 'P10', 'P13', 'fam-legendre-dual-limits', 'fam-vaughan-split-landau'],
     'Combination: Legendre substitution over the integers (sum_{k<=x} mu(k) floor(j/k) = 1; LP value psi(x)) x one-sided Landau rule '
     '(a one-sided excess O(X^alpha) of S(X) = sum Lambda(n) n^(-1/2) - 2 sqrt X gives no zeros in Re s > 1/2 + alpha; alpha < 3/8 passes 7/8) '
     'x Riesz smoothing of order k (prime tents: target O(N^(k+1/2)) with any constant, no log factor). Read ' + P + '/e1-cofinal-legendre-dual '
     'and ' + P + '/e1-forcing-free-bilinear-split (RESULT.md, REFEREE.md) first: restricted-level LP gave 2.32 sqrt X from six levels and the exact '
     'value at D = X^0.7, X = 1e5; the parity cap was refuted. Do not take limits of optimal duals (closed). First lemma: for certificates '
     'supported on k <= D = X^theta the k-fold integrated sawtooth error is <= C_k D^(k+1), so the certificate is unconditional with error below '
     'X^(k+1/2) for theta <= (2k+1)/(2k+2); write the LP whose value G_k(X, theta) is the certified one-sided excess. First decisive test: solve '
     'it for k = 0, 1, 2, theta = 0.3..0.9, X = 1e3..1e6 (sparse LP, print planned memory); fit G_k/X^k ~ X^alpha_k(theta); decide whether '
     'alpha_k(theta) < 1/2 anywhere inside the unconditional range, and where it is not, extract the dual point and prove the floor. Controls: '
     'E_a weights n^a + n^-a (must return 1/2 + a), Beurling integers (no sawtooth), Liouville-twisted Lambda, Davenport-Heilbronn coefficients: '
     'name the failing constraint for each.',
     'alpha_k = 1/2 at every unconditional level, with a dual certificate proving the floor (a parity-type row); any alpha < 3/8 would be a new zero-free statement and needs three referees')

cand('e2-cofinal-moebius-pointwise', 'integers + all primes: pointwise Moebius sum of one fixed sawtooth remainder',
     ['cofinal-pointwise-mobius-sum', 'rig-continuum-sawtooth', 'legendre-dual-limit-density-zero', 'spectral-head-mobius-poisson',
      'mobius-interval-sign-reversal'],
     ['T2', 'P10', 'P29', 'fam-legendre-dual-limits'],
     'Combination: Theorem RIG (a measure b >= 0 on [1, inf) with O(Y^eps) integer-sawtooth discrepancy has Dirichlet transform singular only at '
     'zeta zeros) x the one item left open by lane e1-cofinal-legendre-dual (pointwise bound for F_b(x) = sum_k mu(k) r_b(x/k), r_b the sawtooth '
     'remainder of one fixed cofinal b) x the finite Moebius-inverse head lemma (spectral-head-mobius-poisson) x Landau (only an upper one-sided '
     'bound is needed). Read ' + P + '/e1-cofinal-legendre-dual/RESULT.md and REFEREE.md first; limits of optimal LP duals are closed and density-1 '
     'integer-supported b has discrepancy >= (1/8) log x. First lemma: for three explicit fixed b (density 0, as forced by the lane) write F_b(x) '
     'exactly as head (k <= K, finite Moebius inverse) plus tail, and identify which part of the tail is controlled by b >= 0 alone (monotonicity) '
     'and which part is a sum of M(x/j) against increments of r_b. First decisive test: compute F_b(x) for x <= 1e8 for the three b (segmented '
     'sieve; print planned memory); fit the one-sided growth exponent of max F_b and of min F_b separately; repeat with E_a weights (must give a), '
     'Liouville, Beurling integers and Davenport-Heilbronn coefficients. Decide whether the one-sided exponent differs from the two-sided one. '
     'State where the argument uses more than a mean-square bound (MV-CAP). If the tail reduces to M(x) with no sign information, record it as a '
     'restatement.',
     'tail equals a Mertens-type sum with no one-sided information: restatement at the strength of the input')

cand('e2-below-level-mixed-moment', '7/8 mechanism: mean-value input inside the method (not excluded by any proved lemma)',
     ['map-open-2', 'map-pos-34', 'target-0874-restricted-moment', 'mem-abscissa-formula', 'sextic-theta-mean-square'],
     ['Z10', 'Z12', 'Z15', 'Z16'],
     'Combination: the 7/8 zero-free architecture (the only mechanism in the map that fails for every control; inside it a mean value over the '
     'row family yields a statement at every height) x the below-level mixed moment found by two referees: sum_u |M_{r*} S_m|^2 << U^E for m in '
     '[m*, 1/2], thresholds E < 1.1366 at m = m* and 1.1452 at m = 1/2 against large-sieve 1.1640-1.2457 x the exact critical-count saddle '
     'R_c = 0.5903324. Sources: ' + P + '/SYNTHESIS_R3.md (sections 4.2, 4.3 and the next-steps list), lanes r3-critical-count, r3-lemma181-a, '
     'r3-lemma181-b, r3-method-limit; manuscripts as cited there. First lemma: trace the "+ z_0" charge through manuscript Lemma 14.3 / 17.2 and '
     'Liu II Theorem 11.2 and decide whether it is a triangle-inequality loss; then state the first piece sum |M_r S_b|^2 << U^(1+eps), r + b <= 1, '
     'b <= 0.21 (Heath-Brown-identity component) with every hypothesis explicit. First decisive test: measure the mixed moment on the sextic twist '
     'family over Z[omega] at the largest feasible U (tools and tables in tmp/sextic/: alib.py, gauss6.c; read as code, plan memory) for random '
     'and Moebius coefficients, and fit E. Then re-solve the exact exponent LP with E as input and report the abscissa. Controls: '
     'random unimodular rows as baseline; sign-twisted targets must return their own abscissa. A value below 0.874886647 is conditional on the '
     'moment bound and on the unverified manuscript lemmas listed in the map.',
     'measured E above threshold, or a proof of the first piece only; output stays inside [5/6, 7/8]')

cand('e2-tro6-signed-csum-stratified', '7/8 mechanism: TRO6-natural keeping the sign of beta_c',
     ['map-open-4', 'tro6-natural', 'map-pos-30', 'map-pos-31', 'probe-equals-theta-row-form', 'sextic-theta-numerics'],
     ['Z15', 'Z16', 'N14'],
     'Combination: Conjecture TRO6-natural (power saving for sextic Kubota theta coefficients against cubic rows; its exceptional term is the '
     'obstruction to an abscissa below 7/8) x the split g~(m, ab) = R(a,b) g~(m,a) g~(m a^4, b) and the polar law (Theorem P) x the two forms not '
     'closed by r3-nonpolar-proof: (a) cancellation in the s-tilde sum of the dual form, (b) stratification of m by squarefull part, where '
     'chi_c(m2) degenerates to quadratic or cubic characters. Every per-modulus or l2-in-c route is closed at +1/5 or worse; any bound that drops '
     'the sign of beta_c is at least Q^(11/12) (D/Q)^(1/2). Sources: ' + P + '/SYNTHESIS_R3.md section 4.4 and next-steps item 3; lanes '
     'r3-nonpolar-proof, r3-nonpolar-numerics, r2-tro6-type12-split, r2-tro6-polar-theorem. First lemma: write the signed c-sum for stratum '
     'm = m1 m2^2 m3^3 exactly and identify the character to which chi_c degenerates on each stratum; state the per-stratum saving that would give '
     'eta > 0. First decisive test: build the row-sensitive statistic asked for by the referees (maximise over completely multiplicative unimodular '
     'nu by coordinate ascent on prime phases, random-phase rows as baseline, then Hecke twists of bounded conductor) on the exact Gauss-sum tables '
     'in tmp/sextic/ (extend toward 1e8 only with a printed memory plan); report the measured exponent per stratum. Controls: random-phase rows; '
     'the function-field model (reduces to its own Weil bound). A saving eta is a zero-free statement in (7/8 - eta/96, 7/8].',
     'no measurable saving per stratum, or a saving only on strata of density zero')

cand('e2-gl3-cover-cuspidal-rows', '7/8 mechanism at effective order 2: rows from cuspidal objects on the double cover of GL(3)',
     ['map-pos-35', 'map-pos-33', 'separating-probe', 'mem-sextic-theta-squarefree'],
     ['Z14', 'Z15', 'N19', 'N20', 'N21', 'A6', 'fam-order2-theta-rows'],
     'Combination: scalar bound B >= 1 - h/r (abscissa 1/2 needs a coherent row set with h = r/2) x row-order identity '
     'mu(pi) g(chi) = -J(chi, rho) g(chi rho)/g(rho) (absorption of Moebius, nu(r) = 3 iff r = 6) x the objects left untested by lanes '
     'n4-gl3-double-cover-absorption and e1-gl3-theta-order2-rows: genuine cusp forms on the double cover of GL(3) and Whittaker coefficients of '
     'maximal-parabolic Eisenstein series induced from a GL(2) cusp form. Closed: theta and half-integral weight rows on GL(2) covers, Borel '
     'Eisenstein rows on GL(3) (only sigma_2 survives: Re s = 1), polynomial rows, spin rows. Read those two lanes and r3-method-limit first. First '
     'lemma: from the literature formulas for the Whittaker coefficients of the induced Eisenstein series (central values L(1/2, f x chi_d) appear), '
     'write the row c -> a(c, m) and decide whether it is of symbol type (h = 0) by the criterion of e1-gl3-theta-order2-rows; state exactly what '
     '"absorbs Moebius" requires of a(c, m). First decisive test: for f of level 1 or 11 compute a(d, m) for |d| <= 1e4 by the approximate '
     'functional equation (print cost first), then the correlation of the row with mu(d) chi_d(m) against random-sign rows, and the row Gram '
     'spectrum. Controls: random signs; sign twists (the Gram is sign-blind); state h/r of the row. Cite every formula; mark anything recalled, not '
     'opened, as such.',
     'row is of symbol type or does not absorb Moebius: one more closed order-2 row')

cand('e2-ms-slot-capacity', '7/8 mechanism: one lemma with a confirmed model price',
     ['map-open-3', 'map-pos-34', 'mem-abscissa-formula', 'binding-row-bin'],
     ['Z12', 'Z15'],
     'Combination: the count step of the 7/8 method (critical class saddle R_c = 0.5903324; identity R + m_p(delta/2 - theta) = 2/3) x the slot '
     'capacity of manuscript Lemma 17.1 (condition r + 2z < 1 against r + z < 1), listed in map row Z12 as not excluded and in map section 6 item 3 '
     'with a model price (count saving at the critical class; model floor 13/15 -> 31/36 together with K-loss removal) x the binding high-side row '
     'bin (slack 2.2815e-4 at delta* = 0.3866376). Sources: ' + P + '/OBSTRUCTION_MAP.md rows Z10-Z15, ' + P + '/SYNTHESIS_R3.md, lanes '
     'r3-critical-count, r3-lemma181-a, r3-lemma181-b; manuscripts as cited there. First lemma: restate Lemma 17.1 with its proof skeleton and '
     'locate the single inequality where 2z enters; decide whether the factor 2 is forced by an example (construct the extremal configuration) or '
     'is a loss in a Cauchy-Schwarz or dyadic step. First decisive test: on the reduced model used by n2-kloss-sdp-certificate (Z[omega], '
     'Z <= 32000) measure the quantity bounded by Lemma 17.1 in the range 1 - 2z < r < 1 - z and compare with both bounds; then re-solve the exact '
     'exponent LP with the relaxed slot and report the abscissa. Controls: random-coefficient rows (if they satisfy the relaxed bound equally, the '
     'gain is not arithmetic and must be provable by the large sieve alone). Any abscissa is conditional on unverified manuscript lemmas.',
     'factor 2 forced by an explicit configuration, or relaxed slot proved with the abscissa still above 5/6')

cand('e2-two-scale-detector-moment', '7/8 mechanism: joint detector scales and a class-restricted fourth moment',
     ['map-open-13', 'target-0874-restricted-moment', 'map-pos-34', 'mobius-packet-energy-target'],
     ['Z10', 'Z12', 'Z17'],
     'Combination: restricted fourth-moment target (B = 437/500 needs a numerator fourth moment U^(39/40+eps) on the detected class; with only '
     '#B <= U^R and the global fourth moment, Holder is sharp at U^((3R+1)/4)) x the two items r3-critical-count leaves open: joint use of two '
     'detector scales (M1+), and a class-restricted or amplified fourth moment of the sextic twist family at central length m = 1/2 (model: saving '
     'U^-omega moves B by about -0.046 omega; U^-0.2 reaches 13/15) x the Moebius block-energy form of the same boundary (PR 14: energy exponent '
     '0.7496 gives 0.8748; open part: signed pairs with small common divisor and large separation). Sources: ' + P + '/SYNTHESIS_R3.md sections '
     '4.2-4.3 and next-steps item 5; lanes r3-critical-count, r3-lemma181-a, r3-lemma181-b. Closed there: second moments at level, hybrid second '
     'moments, pair-averaged Halasz-Montgomery chains, sixth-power amplification. First lemma: decide whether the Lemma 18.1 induction admits a '
     'detector factor at z = 0; write the joint estimate with two detector scales as one bilinear form and show it is not implied by Lemmas J, E, '
     'W. First decisive test: measure the fourth moment restricted to the detected class at central length on the sextic family (tmp/sextic/ '
     'tools; printed memory plan), for the true rows and for random unimodular rows; fit omega. Report the LP abscissa at the '
     'measured omega as a model value. Controls: random rows; a random class of the same size.',
     'omega = 0 within error (class restriction gives no saving), or the two-scale form reduces to Lemma W')

cand('e2-theta-dual-mseries-fe', '7/8 mechanism: functional equation of the theta-dual m-series',
     ['probe-equals-theta-row-form', 'cubic-r2-conductor-a4', 'sextic-theta-mean-square', 'map-pos-31', 'tro6-natural'],
     ['N14', 'Z15', 'Z16'],
     'Combination: Theorem D (the 7/8 probe equals the aggregated theta-row form; the P_a^(1/6) loss is one Cauchy-Schwarz) x the cubic R2 '
     'reflection (Poisson dual of the cubic Moebius family = stripped alpha-twisted 6-fold Kubota series at index class y^4, conductor exponent 4) '
     'x row N14 (Bochner tube hull of the multiple Dirichlet series returns its input unless the functional equation of the theta-dual m-series, '
     'manuscript (5.3), is derived; the hull of the estimate-supplied region is open) x the polar law (A_c(w) W-hat(w) minus one simple pole at '
     'w = 5/6 is entire). Read lanes n1-tube-hull, r2-tro6-polar-theorem, tro6-period, tro6-spectral first and do not repeat them. First lemma: '
     'state the m-series with its gamma factor candidates and the group generated by the known reflections; decide whether a second reflection in '
     'the m variable is compatible with the pole at 5/6 and the measured first-moment exponent 0.683 (consistent with 2/3). First decisive test: on '
     'the exact tables in tmp/sextic/ (norm <= 1e7) test the candidate functional equation by comparing smoothed sums at dual lengths X and Q/X for '
     'three conductors; a relative mismatch above the table noise refutes it. If it holds numerically, compute the Bochner hull of the enlarged '
     'tube and the resulting abscissa (model value). Controls: random-phase rows must fail the dual-length test; the cubic series (Patterson) must '
     'pass it as calibration.',
     'no second reflection (dual-length test fails): N14 stands and the multiple-Dirichlet-series route is closed')

cand('e2-sixfold-period-z2', 'renderer spin sign x 7/8 probe: period on the 6-fold cover',
     ['map-open-5', 'probe-equals-theta-row-form', 'zv-spinor-arithmetic-coupling-missing', 'map-pos-33', 'qrh-seven-eighths-input'],
     ['G13', 'N20', 'Z14', 'A3'],
     'Combination: the 7/8 probe with two exact representations (Poisson in the row variable; Gauss sums) x the open item of the renderer roadmap '
     '(an arithmetic coupling for the spinor / double-cover structures) x the row-order identity (nu(r) = 3 iff r = 6) x the direction recorded in '
     + P + '/SYNTHESIS_GEOMETRIC_ARITHMETIC.md (next-steps item 3): derive manuscript eq. (6.1) as a period (cubic theta times a sextic '
     'metaplectic Eisenstein section, twisted by eta) so that reflection and Poisson are its two unfoldings, then test whether the Z/2 factor of '
     'Z/6 = Z/2 x Z/3 separates the exceptional coset from the principal row. Against (h-metaplectic-spin): at n = 6 nothing links grade 1 to '
     'grade 0 and the cover is trivial at the complex place. Read lanes h-metaplectic-spin, h-seven-eighths-in-bridge, tro6-period, ap-squares-rallis '
     'first. First lemma: write the period integral and prove (or refute) that its two unfoldings are the two representations of the probe, with '
     'the exceptional term identified as one coset contribution. First decisive test: compute, on the exact tables in tmp/sextic/, the character of '
     'Z/6 carried by the exceptional term and by the principal signal over 1e3 prime moduli; if both carry the same Z/2 character the separation '
     'is refuted. Controls: the cubic case (Z/3 only, Patterson) as calibration; random-phase rows; state which step fails for a sign-twisted '
     'target. The output is a statement about the P_a^(1/6) term only.',
     'same Z/2 character on both terms: no separation, direction closed')

cand('e2-control-rz-defect-audit', 'filter lane: a twist control with an off-line zero, and the local-defect bound as a statement shape',
     ['ctrl-rz-reciprocal-shift', 'rung-toeplitz-euler-detector', 'map-pos-23', 'map-pos-22', 'pole-coupling-theorem-pc'],
     ['L1', 'L4', 'S1', 'Q4'],
     'Filter lane, not an attack. Control RZ_b(s) = 1/zeta(s + 1 - b), 7/8 < b < 1 (Euler product prod_p (1 - p^(b-1) p^-s); '
     'log-derivative coefficients -n^(b-1) Lambda(n), a signed twist with |eps_n| <= 1; meromorphic on C; real zero at s = b; functional equation '
     'about Re s = b - 1/2) x local temperedness (rung Toeplitz test; kills E_a at K = 1, DH '
     'at p = 2, T-NR at q) x T-NR (zeros at 1/2 +- arccosh(|c|/2)/log q). Observation to test: for E_a and T-NR the largest zero offset '
     'from the symmetry line equals the largest local defect sup_p log|alpha_p|/log p; for zeta the defect is 0. First lemma: verify the listed '
     'properties of RZ_b; then run RZ_b, E_a, T-NR, DH, Beurling, the unimodular twist and backward heat through positive-list items 16-23 of '
     + P + '/OBSTRUCTION_MAP.md and through the row structure of the 7/8 theorem, naming for each the first step that fails and whether it is an '
     'identity or an inequality. First decisive test: search for a counterexample to "zero offset <= sup_p local defect" among objects with an '
     'Euler product of degree <= 2, a functional equation about one line and polynomially bounded coefficients (products and quotients of shifted '
     'zeta and Dirichlet L-functions; T-NR at two primes). Deliver: the control row, the table, and a counterexample or the '
     'statement with the inputs each control lacks.',
     'a table and one control row; the defect bound is GRH with defects (row L4) and is expected to stay a statement shape with no lever')

os.makedirs(os.path.join(HERE, 'curated'), exist_ok=True)
json.dump(B, open(os.path.join(HERE, 'curated', 'batch-2.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
g = json.load(open(os.path.join(HERE, 'IDEA_GRAPH.json'), encoding='utf-8'))
ids = {n['id'] for n in g['nodes']}
for c in B:
    miss = [n for n in c['nodes'] if n not in ids]
    print(c['slug'], c['words'], 'MISSING ' + str(miss) if miss else 'ok')

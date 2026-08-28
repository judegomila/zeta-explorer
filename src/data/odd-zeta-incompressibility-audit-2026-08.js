/**
 * @fileoverview Rigorous audit of the proposed Kolmogorov-complexity route to
 * odd-zeta irrationality, with computability-safe replacements and exact proof
 * targets. This module is deliberately self-contained and has no heavy imports.
 */

export const ODD_ZETA_INCOMPRESSIBILITY_AUDIT = Object.freeze({
  id: 'odd-zeta-incompressibility-audit-2026-08-28',
  title: 'Odd zeta incompressibility: no-go and viable successors',
  status: 'REFUTED AS STATED — standard prefix complexity cannot prove this',
  headline:
    'Every fixed odd zeta value is computable. Its ordinary Kolmogorov prefix ' +
    'complexity, conditioned on the requested precision, is O(1), not N^alpha. ' +
    'The rigorous information budget lives in integer linear forms: analytic ' +
    'cancellation must beat arithmetic denominator growth.',

  definition: {
    prefix:
      'd_b(x,N) denotes the first N digits of a fixed canonical base-b expansion ' +
      '(or, to avoid boundary conventions, a certified N-digit approximation).',
    conditional:
      'K(d_b(x,N) | N,b) is prefix-free Kolmogorov complexity with N and b supplied.',
    notationWarning:
      'K(zeta(2m+1) | N) is ambiguous because K is defined on finite strings, not ' +
      'directly on a real number, and it conflates the zeta index m with precision N.',
  },

  computablePrefixTheorem: {
    statement:
      'If x has a computable digit sequence, then one fixed program reads N and b ' +
      'and prints d_b(x,N). Hence K(d_b(x,N) | N,b) <= c_x = O_x(1) and ' +
      'K(d_b(x,N)) <= K(N)+c_x = O(log N).',
    zetaTail:
      'For every fixed integer k>1, 0 < zeta(k)-sum_{r=1}^M r^(-k) ' +
      '< M^(1-k)/(k-1). This effective tail bound makes zeta(k) computable.',
    uniformVersion:
      'Uniformly in m and N, a fixed algorithm produces certified N-digit ' +
      'approximations to zeta(2m+1), so the conditional program-size bound is O(1).',
    consequence:
      'A lower bound K >= c N^alpha or superlogarithmic K for a fixed odd zeta ' +
      'would imply noncomputability and contradict the theorem. It is not merely ' +
      'an unproved irrationality lemma.',
  },

  refutedClaims: Object.freeze([
    {
      claim: 'The Euler product makes the digits algorithmically random.',
      verdict:
        'False. The Euler product is a short algorithmic description, and the ' +
        'prime sequence itself is computable. Runtime or number of factors is not ' +
        'program length in ordinary Kolmogorov complexity.',
    },
    {
      claim: 'A real is rational if and only if its N-prefix has K=O(log N).',
      verdict:
        'False. Every computable real, including computable irrational and ' +
        'transcendental numbers, has this unconditional upper bound; conditioned ' +
        'on N the upper bound is O(1).',
    },
    {
      claim: 'Positive-power prefix complexity would prove transcendence.',
      verdict:
        'It would prove the much stronger property of noncomputability. Since odd ' +
        'zeta values are computable, the premise cannot hold.',
    },
    {
      claim: 'Maximum channel capacity forces a maximally complex zeta output.',
      verdict:
        'False. Shannon capacity optimizes mutual information over input ' +
        'distributions; it imposes no complexity lower bound on one deterministic ' +
        'output. Odd special values are evaluated at sigma=3,5,..., not sigma=1/2.',
    },
    {
      claim: 'An infinite product of rational prime factors cannot be rational.',
      verdict:
        'False as a structural principle. Infinite products of rational factors ' +
        'can converge to rational or irrational limits; the specific arithmetic ' +
        'and denominator estimates must do the work.',
    },
  ]),

  computabilitySafeReformulations: Object.freeze([
    {
      name: 'Factor or subword complexity',
      statement:
        'Rational base-b expansions are eventually periodic. Proving the digit ' +
        'factor complexity p(l) is unbounded (indeed p(l)>=l+1 for every l in the ' +
        'aperiodic case) would prove irrationality.',
      status:
        'Logically sound, but no known Euler-product theorem gives such a bound for ' +
        'zeta(5). Every finite digit experiment is compatible with an eventually ' +
        'periodic continuation.',
    },
    {
      name: 'Finite-state dimension or digit entropy',
      statement:
        'Positive finite-state dimension is sufficient for non-eventual ' +
        'periodicity and hence irrationality while remaining compatible with a ' +
        'computable real.',
      status:
        'Far stronger than irrationality and presently out of reach for any ' +
        'individual higher odd zeta value.',
    },
    {
      name: 'Arithmetic information budget',
      statement:
        'Treat log denominator height as arithmetic bits and -log absolute error ' +
        'as analytic cancellation bits. A proof needs a certified, nonzero surplus.',
      status:
        'This is exactly the classical integer-linear-form architecture and is the ' +
        'only reformulation here that currently connects to proof-grade machinery.',
    },
  ]),

  resourceBoundedSalvage: {
    statement:
      'For canonical base-b digits, unbounded time-bounded description length at ' +
      'any budget eventually larger than linear implies irrationality: every fixed ' +
      'rational has an O(N)-time long-division program of constant description length.',
    representationWarning:
      'This applies to exact canonical digits, not merely certified Cauchy ' +
      'approximations. Johansson computes p-bit approximations to a fixed zeta value ' +
      'in p^(3/2+o(1)) bit operations, so approximation names are resource-shallow.',
    carryBoundary:
      'Settling the exact first N base-b digits can require extra precision governed ' +
      'by ||b^N zeta(5)||. A lower bound here is already Diophantine content; the ' +
      'Euler product supplies no known route to it.',
    verdict:
      'Logically valid but not a simplification. It asks for a serious exact-digit ' +
      'complexity lower bound that is stronger than irrationality.',
  },

  ensembleAperiodicity: {
    statement:
      'Zudilin proved that at least one of zeta(5), zeta(7), zeta(9), zeta(11) is ' +
      'irrational. Hence the vector word of their simultaneous base-b digits is not ' +
      'ultimately periodic in any fixed base.',
    factorComplexity:
      'By Morse-Hedlund, the vector word has factor complexity p_v(l)>=l+1 for ' +
      'every l>=1.',
    scope:
      'This is a genuine unconditional odd-zeta information theorem, but it is ' +
      'collective: it does not identify zeta(5), and it does not imply positive ' +
      'finite-state dimension.',
  },

  exactIrrationalityCriterion: {
    statement:
      'Construct A_n,B_n in Z such that L_n=A_n*zeta(5)-B_n is nonzero and ' +
      '|L_n| tends to zero. If zeta(5)=p/q, then every nonzero L_n has ' +
      '|L_n|>=1/q, a contradiction.',
    rationalCoefficientVersion:
      'For rational forms l_n=a_n*zeta(5)-b_n and clearing factors D_n with ' +
      'D_n a_n,D_n b_n in Z, require l_n!=0 and D_n|l_n|->0.',
    bitBudget:
      'G_n := -log|l_n| - log D_n. The target is certified nonvanishing and ' +
      'G_n->+infinity.',
  },

  denominatorBarrier: {
    dirichlet:
      'For S_M=sum_{r<=M}r^-5, clearing with lcm(1,...,M)^5 costs exp(5M+o(M)), ' +
      'while zeta(5)-S_M is only asymptotic to 1/(4M^4). The cleared error grows.',
    eulerProduct:
      'Prime truncation has only polynomial tail decay against exponential raw ' +
      'denominator growth. Counting required primes measures one algorithm\'s work, ' +
      'not incompressible information.',
    phaseHasse:
      'The audited phase/Hasse route likewise loses: bounded discrepancy gives ' +
      'polynomial tails and ordinary Hasse acceleration is too weak after exact ' +
      'denominator clearing.',
  },

  internalFrontier: {
    name: 'Positive-cone / Farey brackets',
    status: 'EXACT FINITE EVIDENCE — NOT A PROOF',
    construction:
      'Two isolated positive-cone kernels give exact rational brackets ' +
      'I_n=(L_n,U_n) for zeta(5). In the audited computation the brackets are ' +
      'strictly nested through n=50 and their widths shrink exponentially.',
    closureTarget:
      'Let h(I) be the least reduced denominator of a rational in I. Prove ' +
      'h(I_n)->infinity, equivalently a recurring Stern-Brocot exclusion or a ' +
      'uniform balanced-cylinder determinant inequality, on an infinite sequence.',
    warning:
      'For nested shrinking brackets, denominator escape is equivalent to the ' +
      'irrationality conclusion. Verification through n=50 is evidence only.',
    exactAudit:
      'Exact arithmetic through n=50 gives -log10(width)=3.84583*n+O(1) and ' +
      'log10(h)=1.91890*n+O(1) over n=10..50. The ratio tends numerically to 1/2; ' +
      'at n=50, h^2*width=1.83118 and log(h)/-log(width)=0.500687.',
    interpretation:
      'The common continued-fraction prefix grows but shows no closed recurrence. ' +
      'The construction currently appears to expose more of the continued fraction ' +
      'of zeta(5), not to create an independent symbolic sign law.',
  },

  brownZudilinScalarBudget: {
    status: 'CONDITIONAL REPRODUCTION — ARITHMETIC DEFICIT REMAINS POSITIVE',
    parameterRay: '(8,16,10,15,12,16,18,13)',
    analyticExponent:
      'C0=lim log|Q_n*zeta(5)-P_n|/n=-31.5529693481.',
    denominatorExponent:
      'The raw LCM exponent 84 is reduced by the 7!=5040 symmetry gain ' +
      '34.3942518668, leaving C2=49.6057481332.',
    clearedBudget:
      'C0+C2=18.0527787851 nats per n=26.04465443 bits per n. Since this is ' +
      'positive, the cleared integer linear form grows instead of tending to zero.',
    quality:
      'The reproduced approximation-quality exponent is 0.86597135546; the ' +
      'irrationality threshold is strictly greater than 1.',
    closureOptions:
      'At fixed analytic decay, the denominator exponent must fall by 36.3925%, ' +
      'or an equivalent 18.0527787851 nats per n must come from analytic or mixed ' +
      'determinant cancellation.',
    auditWarning:
      'The public v3 preprint calls its optimized denominator inclusion an ' +
      'experimental observation whose detailed proof is omitted. The reproduced ' +
      'C2 and 0.86597 quality are therefore conditional on that arithmetic input.',
  },

  headOnMellinAudit: {
    status: 'ONE DETERMINANT THEOREM; DENOMINATOR AND CYCLE GAPS REMAIN',
    denominatorSource:
      'Brown-Zudilin v3 labels equation (42), the five-LCM inclusion, an ' +
      'experimental observation and skips the remaining coefficient computation. ' +
      'No public proof code or later primary-source proof was found.',
    strictInteriorNormalizationFailure:
      'At a=(1,1,1,1,1,1,1,1), all 28 orbit forms equal 1, so equation (42) ' +
      'has multiplier 1, while the paper\'s own P_1=87/4. The printed ' +
      'coefficientwise lattice inclusion therefore fails even with strict ' +
      'all-orbit positivity.',
    boundaryCounterexample:
      'For a=(1,0,0,0,1,0,0,0), all 17 convergence forms are nonnegative, ' +
      'the top five h values are 2,1,1,1,1, and I=zeta(2)-1/2, I\'= -1/4. ' +
      'Thus d_2 P=1/2 is not integral. The paper\'s P_2=1190161/384 also ' +
      'contradicts its printed d_n^5 P_n integrality at n=2. A bounded ' +
      'normalization is missing, and convergence alone does not provide the ' +
      'all-orbit positivity used later. Exact recurrence data through n=19 are ' +
      'consistent with universal correction factors 2 and 12, but do not prove ' +
      'a corrected multi-parameter theorem.',
    fiveRayCollapse:
      'For a(v)=(v1,0,0,0,v2,v4+v5,v3+v4,v5), the exact binomial sum gives ' +
      'Q(a(v))=0 for every v!=0, and five orbit coordinates are -v1,...,-v5. ' +
      'This is Q-degeneracy, not moment degeneracy: the first 5-by-5 rational ' +
      'projected tail has determinant 95/2^20, so the block including the origin ' +
      'has determinant 95*zeta(5)/2^20. The experimental denominator rule was ' +
      'applied outside its plausible positivity chamber. At v=(1,1,1,1,1), its ' +
      'multiplier is 32 but I\'=-5/96, so the rational coefficient clears only ' +
      'to -5/3; a correction divisible by 3 is necessary on this cone.',
    cycleDefect:
      'The printed I\'\' residue descent is off by a factor two at a=0, its ' +
      'literal torus intersects a polar hypersurface at every radius, and it misses ' +
      'wall-crossing terms on boundary parameters. No fixed analytic chain for I\' ' +
      'has yet been supplied.',
    scalarHankelTheorem:
      'Conditional on the printed recurrence identity, the symmetric projected ' +
      'sequence has indicial ' +
      'exponent -5/2 at all three characteristic roots. Its generating function is ' +
      'therefore nonrational, so Kronecker\'s theorem proves that the principal ' +
      'Hankel determinants are nonzero infinitely often.',
    geometricDiagnostic:
      'The five-coordinate real image has the rigorous diagnostic bound ' +
      'Sup_rec <= 4^(-11/15)*exp(-8/15)=0.2122587567 and an inscribed-box lower ' +
      'bound 0.00803875. These do not supply a projected zeta(5) criterion.',
  },

  externalFrontier2026: {
    name: 'Brown multi-parameter Mellin / transfinite-diameter criterion',
    status: 'AUDITED GENERAL CRITERION — NOT YET APPLIED TO ZETA(5)',
    criterion:
      'For growing Mellin moment modules with nonzero determinant, Brown\'s ' +
      'criterion combines multivariate transfinite diameter with the determinant ' +
      'of the denominator-clearing matrices. A strict diameter-squared times ' +
      'denominator limit below 1 yields nonzero integer forms tending to zero.',
    candidateApplication:
      'Lift the Brown-Zudilin M_0,8 family from a single parameter ray to growing ' +
      'modules of projected zeta(5) forms. A repaired five-generator algebra ' +
      'containing the symmetric ray has infinite Hankel rank, but no controlled ' +
      'rectangular determinant, denominator lattice, or projected support bound.',
    mainObstacle:
      'Four proof obligations remain coupled: a correctly hypothesized denominator ' +
      'theorem, a genuine fixed projected relative cycle including wall terms, ' +
      'degree-controlled multi-parameter determinant nonvanishing, and a strict ' +
      'transfinite-diameter/denominator inequality.',
    rectangularThreshold:
      'No current numerical threshold is proof-ready. The exp(-13/4) figure ' +
      'survives only as a conditional order-statistic target: its five-ray cone ' +
      'has negative orbit coordinates, and no uniform corrected denominator ' +
      'theorem, projected cycle, or growing-box determinant theorem is proved. ' +
      'Actual row and column denominator matrices must be established first.',
  },

  nextExperiment: Object.freeze([
    'State and prove a strict-interior replacement for the experimental five-LCM inclusion.',
    'Construct a fixed projected relative cycle with the factor-two and wall-crossing terms corrected.',
    'Certify the printed scalar recurrence, then use its Hankel theorem to select degree-controlled modules.',
    'Compute the actual row and column denominator determinants before setting a diameter target.',
    'Only then prove a transfinite-diameter times denominator limit strictly below one.',
  ]),

  references: Object.freeze([
    'F. Brown and W. Zudilin, On cellular rational approximations to zeta(5), arXiv:2210.03391v3 (2026 preprint).',
    'F. Brown, Mellin transforms, transfinite diameter and rational approximations of integrals, arXiv:2604.20741 (2026).',
    'F. Johansson, Rapid computation of special values of Dirichlet L-functions, arXiv:2110.10583.',
    'M. Morse and G. A. Hedlund, Symbolic Dynamics II: Sturmian Trajectories, Amer. J. Math. 62 (1940), 1-42.',
    'W. Zudilin, One of the numbers zeta(5), zeta(7), zeta(9), zeta(11) is irrational, arXiv:math/0206176.',
    'B. Adamczewski and Y. Bugeaud, On the complexity of algebraic numbers I, Ann. of Math. 165 (2007), 547-565.',
    'D. H. Bailey and R. E. Crandall, On the random character of fundamental constant expansions, Exp. Math. 10 (2001), 175-190.',
  ]),
});

export const ODD_ZETA_INCOMPRESSIBILITY_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'ordinary-K route is explicitly refuted',
    check: () => ODD_ZETA_INCOMPRESSIBILITY_AUDIT.status.startsWith('REFUTED'),
  },
  {
    name: 'conditional computable-prefix bound is O(1)',
    check: () => /O(?:_x)?\(1\)/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.computablePrefixTheorem.statement),
  },
  {
    name: 'proof target requires nonzero integer forms tending to zero',
    check: () => {
      const s = ODD_ZETA_INCOMPRESSIBILITY_AUDIT.exactIrrationalityCriterion.statement;
      return /A_n,B_n in Z/.test(s) && /nonzero/.test(s) && /tends to zero/.test(s);
    },
  },
  {
    name: 'finite Farey evidence is not labeled a proof',
    check: () => /NOT A PROOF/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.internalFrontier.status),
  },
  {
    name: 'Brown criterion is not claimed to solve zeta(5)',
    check: () => /NOT YET APPLIED/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.externalFrontier2026.status),
  },
  {
    name: 'experimental five-LCM input is not promoted to a theorem',
    check: () => /experimental observation/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.denominatorSource),
  },
  {
    name: 'strict-interior normalization failure is explicit',
    check: () => /P_1=87\/4/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.strictInteriorNormalizationFailure),
  },
  {
    name: 'five-ray audit distinguishes Q and moment degeneracy',
    check: () => /Q\(a\(v\)\)=0/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.fiveRayCollapse) &&
      /95\/2\^20/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.fiveRayCollapse),
  },
  {
    name: 'scalar projected Hankel nonvanishing is retained',
    check: () => /nonzero infinitely often/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.scalarHankelTheorem),
  },
  {
    name: 'reproduced scalar budget remains on the losing side',
    check: () => /18\.0527787851/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.brownZudilinScalarBudget.clearedBudget),
  },
  {
    name: 'resource-bounded claim is restricted to exact canonical digits',
    check: () => /exact canonical digits/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.resourceBoundedSalvage.representationWarning),
  },
]);

export default ODD_ZETA_INCOMPRESSIBILITY_AUDIT;

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
    status: 'RANK-ONE ABSOLUTE-CAPACITY ROUTE CLOSED; RELATIVE/HIGHER-RANK ROUTES REMAIN',
    denominatorSource:
      'Brown-Zudilin v3 labels equation (42), the five-LCM inclusion, an ' +
      'experimental observation and skips the remaining coefficient computation. ' +
      'No public proof code or later primary-source proof was found.',
    strictInteriorNormalizationFailure:
      'At a=(1,1,1,1,1,1,1,1), all 28 orbit forms equal 1, so equation (42) ' +
      'has multiplier 1, while the paper\'s own P_1=87/4. The printed ' +
      'coefficientwise lattice inclusion therefore fails even with strict ' +
      'all-orbit positivity.',
    literatureBoundary:
      'Zudilin 2004 proves a six-factor bound only for a different normalized ' +
      'one-variable well-poised family; its matching five-successive-max statement ' +
      'is conjectural. The Brown-Zudilin dual-integral identity proves no lattice ' +
      'transfer to I\', and Krattenthaler-Rivoal leave the general asymmetric ' +
      'denominator conjecture open. The missing result is a prime-power ' +
      'slot-majorization lemma, not merely a routine LCM estimate.',
    boundaryCounterexample:
      'For a=(1,0,0,0,1,0,0,0), all 17 convergence forms are nonnegative, ' +
      'the top five h values are 2,1,1,1,1, and I=zeta(2)-1/2, I\'= -1/4. ' +
      'Thus d_2 P=1/2 is not integral. The paper\'s P_2=1190161/384 also ' +
      'contradicts its printed d_n^5 P_n integrality at n=2. Convergence alone ' +
      'does not provide the all-orbit positivity used later.',
    fiveRayCollapse:
      'For a(v)=(v1,0,0,0,v2,v4+v5,v3+v4,v5), the exact binomial sum gives ' +
      'Q(a(v))=0 for every v!=0, and five orbit coordinates are -v1,...,-v5. ' +
      'This is Q-degeneracy, not moment degeneracy: the first 5-by-5 rational ' +
      'projected tail has determinant 95/2^20, so the block including the origin ' +
      'has determinant 95*zeta(5)/2^20. Exact symbolic reduction also proves the ' +
      '20-by-20 total-degree-two and 31-by-31 rectangular tails are invertible.',
    exactMomentCertificate:
      'A finite HPL/MZV evaluator now certifies every required moment exactly: ' +
      '125 nonzero indices of total degree at most four and all 242 nonzero ' +
      'indices in {0,1,2}^5 reduce to Q*zeta(2)+Q, with all higher periods ' +
      'cancelling symbolically. This removes PSLQ from the finite determinant data.',
    uniformDenominatorNoGo:
      'On the diagonal v=(n,n,n,n,n), exact partial fractions prove ' +
      'v_p(I\')=-1 and p I\' congruent 4 mod p whenever p=2n+1 is prime, ' +
      'while the proposed five-LCM multiplier d_(2n)^5 contains no p. The proof ' +
      'enumerates all harmonic crossings and separately controls the A_(n,0) ' +
      'terms. Therefore no fixed integer C repairs that lattice on the old cone. ' +
      'Already at n=2, d_4^5 I\'=-6897/5, so C=12 fails. This kills the old ' +
      'five-ray use of equation (42), not a newly hypothesized theorem restricted ' +
      'to the strict all-28-positive chamber.',
    cycleDefect:
      'After the missing factor 1/2 is restored, switching to the reflected residue ' +
      'chart repairs the e1 test. The self-dual point v=(1,1,1,1,1) is decisive: ' +
      'both advertised residue sums vanish but I\'\'=1/60. Wall crossing has normal ' +
      'orders v1+v4 and v2+v4, producing an unbounded Leray-jet tower. It is not a ' +
      'fixed finite signed measure, so ordinary Andreief and the old real ' +
      'path-polytope capacity bound do not apply. A new capped complex relative ' +
      'cycle remains possible but has not been constructed.',
    oneRayHankelTheorem:
      'Unconditionally on the e1 ray, I(n e1)=2 H_n^(2) zeta(2)/n-' +
      '((H_n^(2))^2-H_n^(4))/(2n), hence the projected moment is ' +
      'mu_n=-((H_n^(2))^2-H_n^(4))/(4n). Since mu_n is asymptotic to ' +
      '-pi^4/(240n), its generating function and the full series with constant ' +
      'term zeta(5) are nonrational. Kronecker\'s theorem gives infinitely many ' +
      'nonzero principal Hankel determinants for both sequences. The natural ' +
      'shift module is rank three over Q(n), not the hoped-for rank-two ' +
      'contiguity system.',
    kroneckerNonLift:
      'There is a five-variable holonomic functional which restricts exactly to ' +
      'this nonrational one-ray sequence and has zero global Hankel annihilator ' +
      'ideal, yet every box {0,...,n-1}^5 for n>=2 has a zero row. Thus one-ray ' +
      'Kronecker nonrationality, global faithfulness, and holonomicity do not imply ' +
      'multivariate box nonvanishing; the actual functional needs a finite-' +
      'observability theorem on the chosen lower sets.',
    rankOneCapacityNoGo:
      'Write det M_n=det R_n*(zeta(5)-s_n). Any multiplier d_n producing a ' +
      'nonzero integral zeta coefficient obeys |d_n|*|det R_n|>=1. On a bounded ' +
      'comparison region containing 0, the full and constant-deleted Vandermonde ' +
      'suprema satisfy t_tail<=t_full<=N*t_tail, so their absolute-capacity ' +
      'exponents agree. Hence a tail bound |det R_n|<=exp(-B*e_n+o(e_n)) forces ' +
      'liminf log|d_n|/e_n>=B: the formerly required strict limsup below B is ' +
      'impossible for the old rank-one common-capacity argument.',
    finiteRectangularBudget:
      'For the exact 32-by-32 rectangular n=2 block, exponent e=80. Row/column ' +
      'clearing has rate 3.47430 and direct determinant clearing 3.22433, both ' +
      'above the conditional geometric budget 3.09990. Primitive Schur content ' +
      'has rate 2.77593, below it by 0.32397. Reflection symmetry proves that its ' +
      'large content is a common odd-sector determinant which cancels from both ' +
      'coefficients. The remaining even-block rate is 3.00361. These are exact but ' +
      'necessarily pre-asymptotic under the equal-capacity hypothesis.',
    fourRayTriangleCertificate:
      'For T_n={(v1,v2,v3,0,v5):v1+v3<n,v2+v5<n}, exact rational tail ' +
      'determinants are nonzero through n=5 (sizes 8,35,99,224). Embedded hashes ' +
      'and three modular residues certify primitive rates 1.95857, 2.37462, ' +
      '2.50584, 2.56840 against the finite diagnostic B=2*log(2e)=3.38629. ' +
      'The decomposition -log|det R|/e+log(q)/e shows a rising tail-decay term ' +
      'and a still-positive Schur-denominator rate, exactly as the no-go predicts.',
    geometricDiagnostic:
      'The five-coordinate real image has the rigorous diagnostic bound ' +
      'Sup_rec <= 4^(-11/15)*exp(-8/15)=0.2122587567 and an inscribed-box lower ' +
      'bound 0.00803875. Because the actual projected functional is not represented ' +
      'by a fixed real measure, these do not presently bound its determinants.',
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
      'Either estimate the rank-one Schur ratio directly, or lift the Brown-Zudilin ' +
      'M_0,8 family to a higher-rank period module. An exact strict-positive ' +
      'five-direction candidate has a nonzero Mellin log-Jacobian and a nonsingular ' +
      '6-by-6 Q-coefficient matrix, but no proved projected cycle or competitive ' +
      'denominator theorem.',
    mainObstacle:
      'The old rank-one absolute-capacity route is structurally closed: its ' +
      'normalization must pay at least the inverse rational-tail determinant, whose ' +
      'common capacity exponent consumes the entire absolute bound. The live ' +
      'alternatives need a relative Schur error beating reduced q_n, a true ' +
      'full-versus-tail capacity separation, or a higher-rank module with new ' +
      'arithmetic and cycle input.',
    rectangularThreshold:
      'For boxes {0,...,n-1}^5, N=n^5 and e=(5/2)n^5(n-1). If a new projected ' +
      'cycle is bounded by the old origin-containing rectangular region, the ' +
      'companion tail has the same exponent B=3.0998983963 and every integral ' +
      'normalization has liminf rate at least B. Thus the former strict-below-B ' +
      'primitive target is impossible, not merely unproved.',
    higherRankDiagnostic:
      'Five exact all-28-positive directions give log-Jacobian determinant 896/81 ' +
      'and a 6-by-6 Q-matrix determinant ' +
      '-261259302637395617302464208660000. The direct capacity B about 20.43 is ' +
      'only numerical, and the conditional five-LCM row-clearing rate about 28.09 ' +
      'already loses. This module escapes rank one algebraically but is not yet a ' +
      'Brown zeta(5) application.',
  },

  nextExperiment: Object.freeze([
    'For the rank-one cone, bound the relative Schur error |zeta(5)-s_n| and the reduced denominator q_n directly.',
    'For the strict-positive higher-rank module, certify the numerical generator maxima and derive a proved denominator lattice.',
    'Construct the projected I\' cycle before applying real-cube capacity or positivity to either module.',
    'Prove finite observability for the actual functional on a chosen lower-set sequence; generic one-ray faithfulness does not lift.',
    'Use the exact four-ray n<=5 blocks as regression tests for a relative theorem, not for the closed common-capacity route.',
  ]),

  references: Object.freeze([
    'F. Brown and W. Zudilin, On cellular rational approximations to zeta(5), arXiv:2210.03391v3 (2026 preprint).',
    'F. Brown, Mellin transforms, transfinite diameter and rational approximations of integrals, arXiv:2604.20741 (2026).',
    'F. Johansson, Rapid computation of special values of Dirichlet L-functions, arXiv:2110.10583.',
    'M. Morse and G. A. Hedlund, Symbolic Dynamics II: Sturmian Trajectories, Amer. J. Math. 62 (1940), 1-42.',
    'W. Zudilin, One of the numbers zeta(5), zeta(7), zeta(9), zeta(11) is irrational, arXiv:math/0206176.',
    'W. Zudilin, Arithmetic of linear forms involving odd zeta values, J. Theor. Nombres Bordeaux 16 (2004), 251-291.',
    'C. Krattenthaler and T. Rivoal, Hypergeometrie et fonction zeta de Riemann, Mem. Amer. Math. Soc. 186 (2007), no. 875.',
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
    name: 'missing arithmetic result is identified precisely',
    check: () => /slot-majorization/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.literatureBoundary),
  },
  {
    name: 'five-ray audit distinguishes Q and moment degeneracy',
    check: () => /Q\(a\(v\)\)=0/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.fiveRayCollapse) &&
      /95\/2\^20/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.fiveRayCollapse),
  },
  {
    name: 'one-ray projected Hankel nonvanishing is proved',
    check: () => /nonzero principal Hankel determinants/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.oneRayHankelTheorem
    ),
  },
  {
    name: 'finite exact moments do not rely on PSLQ',
    check: () => /removes PSLQ/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.exactMomentCertificate
    ),
  },
  {
    name: 'five-ray bounded repairs are ruled out p-adically',
    check: () => /no fixed integer C/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.uniformDenominatorNoGo
    ),
  },
  {
    name: 'reproduced scalar budget remains on the losing side',
    check: () => /18\.0527787851/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.brownZudilinScalarBudget.clearedBudget),
  },
  {
    name: 'resource-bounded claim is restricted to exact canonical digits',
    check: () => /exact canonical digits/.test(ODD_ZETA_INCOMPRESSIBILITY_AUDIT.resourceBoundedSalvage.representationWarning),
  },
  {
    name: 'rank-one common-capacity target is explicitly closed',
    check: () => /strict limsup below B is impossible/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.rankOneCapacityNoGo
    ),
  },
  {
    name: 'one-ray Kronecker theorem is not promoted to box nonvanishing',
    check: () => /do not imply multivariate box nonvanishing/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.kroneckerNonLift
    ),
  },
  {
    name: 'four-ray finite computation is labeled diagnostic',
    check: () => /finite diagnostic/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.headOnMellinAudit.fourRayTriangleCertificate
    ),
  },
  {
    name: 'higher-rank capacity number remains numerical',
    check: () => /only numerical/.test(
      ODD_ZETA_INCOMPRESSIBILITY_AUDIT.externalFrontier2026.higherRankDiagnostic
    ),
  },
]);

export default ODD_ZETA_INCOMPRESSIBILITY_AUDIT;

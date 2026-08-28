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
  },

  externalFrontier2026: {
    name: 'Brown multi-parameter Mellin / transfinite-diameter criterion',
    status: 'PROMISING GENERAL CRITERION — NOT YET APPLIED TO ZETA(5)',
    criterion:
      'For growing Mellin moment modules with nonzero determinant, Brown\'s ' +
      'criterion combines multivariate transfinite diameter with the determinant ' +
      'of the denominator-clearing matrices. A strict diameter-squared times ' +
      'denominator limit below 1 yields nonzero integer forms tending to zero.',
    candidateApplication:
      'Lift the Brown-Zudilin M_0,8 family from a single parameter ray to growing ' +
      'modules of projected zeta(5) forms, then prove determinant nonvanishing and ' +
      'a transfinite-diameter/denominator product below 1.',
    mainObstacle:
      'The Brown-Zudilin zeta(5) form is obtained by projecting away parasitic ' +
      'periods. A genuine projected contour/period representation, a holonomic ' +
      'determinant theorem, or an extension to signed/complex cycles is needed ' +
      'before positivity can certify nonvanishing.',
  },

  nextExperiment: Object.freeze([
    'Reproduce the Brown-Zudilin 0.86 approximation exponent with exact arithmetic.',
    'Build small projected moment matrices over M_0,8 parameter boxes, not a single ray.',
    'Factor row/column denominator lattices using the 7!-symmetry and record exact determinants.',
    'Track analytic determinant contraction minus arithmetic denominator growth.',
    'Use numerics only to select a module family; the deliverable is an infinite nonvanishing and diameter bound.',
  ]),

  references: Object.freeze([
    'F. Brown and W. Zudilin, On cellular rational approximations to zeta(5), Adv. Math. 495 (2026), 110967; arXiv:2210.03391.',
    'F. Brown, Mellin transforms, transfinite diameter and rational approximations of integrals, arXiv:2604.20741 (2026).',
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
]);

export default ODD_ZETA_INCOMPRESSIBILITY_AUDIT;

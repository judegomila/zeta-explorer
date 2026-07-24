/**
 * Immutable public-facing summary of the local de Bruijn--Newman review
 * package at commit 5c4d7a7.  This module deliberately records a candidate,
 * not an accepted theorem: every consumer must preserve the review-open flags.
 */

export const NEWMAN_LAMBDA_01787854_CANDIDATE = {
  identity: {
    label: 'Local fixed-height candidate',
    datePrepared: '2026-07-23',
    packageCommit: '5c4d7a7ba14f9933ca604d18b2e5bf70a104b3b3',
    sealSha256: 'fb43ccd9f71cc39eb15be8e5dec3dcb1b4ca42188fd0b3b155c48f1f9f3e83cd',
    candidate: true,
    rigorous: false,
    published: false,
    independentReviewOpen: true,
  },
  exactTarget: {
    numerator: 893927,
    denominator: 5000000,
    decimal: 0.1787854,
    X: 6000000185827,
    t0Numerator: 129,
    t0Denominator: 800,
    t0: 0.16125,
    y0SquaredNumerator: 87677,
    y0SquaredDenominator: 2500000,
    y0Squared: 0.0350708,
    y0: 0.18727199470289196,
    a0: 0.09363599735144598,
    identityTex:
      't_0+\\frac{y_0^2}{2}=t_0+2a_0^2=' +
      '\\frac{893927}{5000000}=0.1787854',
  },
  finiteEvidence: {
    firstN: 690988,
    lastN: 3840000,
    rowCount: 3149013,
    noGaps: true,
    noDuplicates: true,
    noNonpositiveRows: true,
    noUncertainRows: true,
    primeSetBands: [
      {
        range: '690988–728999',
        primes: '{2, 3, 5, 7, 11}',
        minTriangle: '0.000000791366',
      },
      {
        range: '729000–818999',
        primes: '{2, 3, 5, 7}',
        minTriangle: '0.000315112459',
      },
      {
        range: '819000–1027999',
        primes: '{2, 3, 5}',
        minTriangle: '0.000305788807',
      },
      {
        range: '1028000–3840000',
        primes: '{2, 3}',
        minTriangle: '0.000309285478',
      },
    ],
    dini: {
      precisionsBits: [180, 256],
      divisorPatternCounts: [243, 81, 27, 9],
      worstCertifiedRatio: 0.99999860767275095,
    },
    correctionLogRateUpperBound: -1.36311215475764,
    effectiveErrorUpperBound: 0.000000233494905212335514,
    finiteMarginLowerBound: 0.000000557871094787,
  },
  tailEvidence: {
    precisionsBits: [160, 256],
    checksPassed: 93,
    checksTotal: 93,
    contractionUpperBound: 0.99972090937994,
    flowLowerBound: 0.000173532614415,
    errorUpperBound: 0.00000001167160258919,
    slackLowerBound: 0.000173520942813,
  },
  verifiedHeight: {
    TPT: 3000175332800,
    halfXAtMostTPT: true,
  },
  reviewObligations: [
    {
      title: 'Native Triangle-to-|f_t| binding',
      detail:
        'Check that the producer functional, its normalization, and the effective-error budget are in exactly the same units.',
    },
    {
      title: 'Winding-slab rigor',
      detail:
        'Audit interval endpoints, fail-closed comparisons, coverage of the closed real t-prism, and the incomplete second-line spot check.',
    },
    {
      title: 'Direct Dini reduction',
      detail:
        'Review the derivative at absolute-value zeros, the negative term, divisor-pattern exhaustion, endpoint padding, and the global-monotonicity passage.',
    },
    {
      title: 'Error-term transcription',
      detail:
        'Resolve the implementation denominator x−6.66 versus the paper’s displayed x−12, including the direction of the claimed slack.',
    },
    {
      title: 'Tail theorem and implementation',
      detail:
        'Confirm that the generic exact-convolution tail theorem applies at the candidate endpoint and across the full target box.',
    },
    {
      title: 'Independent interval implementation',
      detail:
        'Reproduce the decisive mpmath.iv margins in an independent interval library such as Arb/FLINT or MPFI.',
    },
    {
      title: 'Finite-producer spot checks',
      detail:
        'Regenerate the weakest row, every prime-set joint and shard boundary, and the finite/tail overlap.',
    },
    {
      title: 'Criterion weld',
      detail:
        'Match the height, nonvanishing, winding, endpoint, and site hypotheses to the cited de Bruijn–Newman criterion with no open-endpoint gap.',
    },
  ],
  replay: {
    stored: [
      'python3 -m venv .venv',
      '. .venv/bin/activate',
      'python3 -m pip install --require-hashes -r requirements.txt',
      './verify.sh',
    ],
    storedExpected: 'RESULT: STORED CANDIDATE PASS',
    container: [
      'docker build -t dbn-lambda-01787854-review .',
      'docker run --rm -v "$PWD:/work" -w /work dbn-lambda-01787854-review',
    ],
    containerExpected: 'RESULT: CONTAINER REVIEW PASS',
  },
  environment: {
    base: 'Ubuntu 24.04',
    flint: '3.0.1',
    python: '3.12',
    mpmath: '1.4.1',
    sympy: '1.12',
  },
};

export const NEWMAN_LAMBDA_01787854_ASSERTIONS = [
  {
    id: 'lambda-01787854-exact-rational-assembly',
    holds: () => {
      const t = NEWMAN_LAMBDA_01787854_CANDIDATE.exactTarget;
      return (
        t.t0Numerator * 6250 + t.y0SquaredNumerator === t.numerator &&
        t.denominator === 5000000 &&
        t.numerator / t.denominator === t.decimal &&
        t.t0Numerator / t.t0Denominator === t.t0 &&
        t.y0SquaredNumerator / t.y0SquaredDenominator === t.y0Squared &&
        Math.abs(t.y0 * t.y0 - t.y0Squared) < 1e-15 &&
        2 * t.t0 + t.y0Squared < 1
      );
    },
    why:
      'The headline decimal must remain the exact identity t0 + y0²/2, not a rounded or independently edited number.',
  },
  {
    id: 'lambda-01787854-candidate-flags-remain-honest',
    holds: () => {
      const i = NEWMAN_LAMBDA_01787854_CANDIDATE.identity;
      return (
        i.candidate === true &&
        i.rigorous === false &&
        i.published === false &&
        i.independentReviewOpen === true
      );
    },
    why:
      'This result is an unpublished, review-open candidate. Passing local scripts must never silently promote it to a theorem.',
  },
  {
    id: 'lambda-01787854-finite-coverage-is-contiguous',
    holds: () => {
      const f = NEWMAN_LAMBDA_01787854_CANDIDATE.finiteEvidence;
      return (
        f.lastN - f.firstN + 1 === f.rowCount &&
        f.rowCount === 3149013 &&
        f.noGaps &&
        f.noDuplicates &&
        f.noNonpositiveRows &&
        f.noUncertainRows
      );
    },
    why:
      'The stored finite certificate claims one row for every integer in the closed range, with no uncertainty or structural defects.',
  },
  {
    id: 'lambda-01787854-decisive-margins-are-strict',
    holds: () => {
      const f = NEWMAN_LAMBDA_01787854_CANDIDATE.finiteEvidence;
      const t = NEWMAN_LAMBDA_01787854_CANDIDATE.tailEvidence;
      const h = NEWMAN_LAMBDA_01787854_CANDIDATE.verifiedHeight;
      return (
        f.dini.worstCertifiedRatio < 1 &&
        f.correctionLogRateUpperBound < 0 &&
        f.finiteMarginLowerBound > 0 &&
        t.contractionUpperBound < 1 &&
        t.flowLowerBound - t.errorUpperBound > 0 &&
        t.slackLowerBound > 0 &&
        t.checksPassed === t.checksTotal &&
        h.halfXAtMostTPT === true &&
        NEWMAN_LAMBDA_01787854_CANDIDATE.exactTarget.X / 2 <= h.TPT
      );
    },
    why:
      'The local candidate depends on strict finite and tail inequalities; a zero or reversed margin invalidates the numerical gate.',
  },
  {
    id: 'lambda-01787854-review-boundary-is-complete',
    holds: () => {
      const c = NEWMAN_LAMBDA_01787854_CANDIDATE;
      return (
        c.reviewObligations.length === 8 &&
        /^[0-9a-f]{40}$/.test(c.identity.packageCommit) &&
        /^[0-9a-f]{64}$/.test(c.identity.sealSha256)
      );
    },
    why:
      'The public summary must retain all eight theorem-level review obligations and immutable package provenance.',
  },
];

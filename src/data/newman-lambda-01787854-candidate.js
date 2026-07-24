/**
 * Immutable public-facing summary of the sealed de Bruijn--Newman result.
 *
 * The filename and compatibility export retain the former "candidate" name so
 * old routes and imports do not break.  The evidence grade changed on
 * 2026-07-24: this is now a theorem proved in the root research repository,
 * while remaining unpublished, unpeer-reviewed, and open to external review.
 */

export const NEWMAN_LAMBDA_01787854_THEOREM = {
  identity: {
    label: 'Repository theorem: Λ ≤ 0.1787854',
    datePrepared: '2026-07-24',
    packageCommit: '9cc69d4775fafe3a9083c8b606ea9ad390e55fb2',
    releaseCommit: '737d14f3212d09d1a14c12f57f518fe00418c7f6',
    releaseTree: '9f532f3c0708788be898c63599e1455d9c7a7399',
    sealSha256: '9d3edd9825d9231183094e035eb695c333f5d344615da896038667d75c597ce8',
    containerImage:
      'sha256:8da4b264d3ca9c4630782d99c806886332987a5e7f882c09b7afdb2ba7214ef8',
    candidate: false,
    repositoryProved: true,
    rigorous: true,
    computerAssisted: true,
    published: false,
    peerReviewed: false,
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
  certifiedRegions: {
    compactSlab: {
      xMin: 6000000185827,
      xMax: 6000000185828,
      yMinNumerator: 1809,
      yMinDenominator: 10000,
      yMax: 1,
      tMin: 0,
      tMaxNumerator: 129,
      tMaxDenominator: 800,
      closedEndpoints: true,
      prismCount: 883,
      minimumStrictMargin: '0.519849894613872543374989997',
      theoremTex:
        'H_t(z)\\ne0\\quad\\left(z\\in[X,X+1]+i[1809/10000,1],\\ 0\\le t\\le129/800\\right)',
    },
    finalTimeHalfStrip: {
      n0: 690988,
      x0Tex: '4\\pi\\left(690988^2-\\frac{129}{12800}\\right)',
      yMinTex: '\\sqrt{87677/2500000}',
      yMaxTex: '\\sqrt{271/400}',
      closedEndpoints: true,
      symmetricExtension: true,
      theoremTex:
        'H_{129/800}(x+iy)\\ne0\\quad\\left(x\\ge x_0,\\ y_0\\le y\\le y_{\\max}\\right)',
      symmetricTex:
        '|\\Re z|\\ge x_0,\\qquad y_0\\le|\\Im z|\\le y_{\\max}',
      excludedRegion: 'No claim is made for |Im z| < y0.',
    },
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
      // Numeric value is rounded outward for use in inequalities; the
      // certificate's displayed endpoint is retained verbatim for the UI.
      worstCertifiedRatio: 0.999998607672751,
      worstCertifiedRatioLiteral: '0.99999860767275095',
    },
    correctionLogRateUpperBound: -1.36311215475764,
    rawFloor: 0.000000791366,
    rawFloorLiteral: '0.000000791366',
    effectiveErrorUpperBound: 2.3349490521229325e-7,
    effectiveErrorUpperBoundLiteral: '2.33494905212293253172e-7',
    finiteMarginLowerBound: 5.578710947877067e-7,
    finiteMarginLowerBoundLiteral: '5.57871094787706746828e-7',
    conservativeErrorCoefficient: 10.5,
    errorCertificate: {
      precisionsBits: [256, 512],
      checksPassed: 96,
      checksTotal: 96,
      domains: ['exact-t0', 'closed-t-box'],
    },
  },
  tailEvidence: {
    precisionsBits: [256, 512],
    checksPassed: 36,
    checksTotal: 36,
    checksArePerPrecision: true,
    // The sealed 512-bit endpoint lies just above the nearest lower JS
    // double, so use the next representable decimal outward.
    contractionUpperBound: 0.9997209093887508,
    // This shorter decimal is an outward display bound for the full Arb
    // interval, whose printed midpoint is 0.999720909388750699545...
    contractionUpperBoundLiteral: '0.9997209093887507',
    flowLowerBound: 0.0001735326089372,
    errorUpperBound: 1.1671603435274713e-8,
    slackLowerBound: 0.0001735209373337,
    conservativeErrorCoefficient: 10.5,
  },
  verifiedHeight: {
    TPT: 3000175332800,
    halfXAtMostTPT: true,
    exactSurplusNumerator: 350479773,
    exactSurplusDenominator: 2,
  },
  closedAuditItems: [
    {
      title: 'Native Triangle-to-|f_t| binding',
      detail:
        'Closed in the immutable release and root attestation: the producer, normalization, corrected effective-error budget, runner, comparator, and payload hashes are bound together.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Closed compact slab',
      detail:
        'Closed by the repaired 883-prism Arb barrier, fail-closed interval comparisons, whole-prism time control, analytic quadrature callbacks, and the t=0 endpoint lemma.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Direct Dini reduction',
      detail:
        'Closed by the direct all-height transfer bound over every active divisor pattern at 180 and 256 bits, retained in the immutable release and checked by the assembly verifier.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Conservative error transcription',
      detail:
        'Closed by deriving 10.50 = 3.58 + 6.92 directly from Polymath Proposition 6.6(vi), auditing x−6.66 and the conservative x−12 replacement, and avoiding the unexplained printed 10.44.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Tail theorem and implementation',
      detail:
        'Closed by the source-bound conservative patch and 36/36 strict tail gates at both 256 and 512 bits, yielding a positive post-error margin.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Independent interval implementation',
      detail:
        'Closed by decisive Arb/FLINT checks for the barrier, finite error, tail error, and exact assembly rather than relying on the earlier mpmath.iv review path.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Full finite material replay',
      detail:
        'Closed by a fresh clean replay of all 3,149,013 rows, including every prime-set joint and shard boundary, with byte and normalized-payload comparisons against the immutable release.',
      status: 'closed-in-root-seal',
    },
    {
      title: 'Criterion weld',
      detail:
        'Closed by the exact Polymath Theorem 1.2 assembly: the compact slab, final-time half-strip, Platt–Trudgian verified height, closed endpoints, and exact rational target are checked together.',
      status: 'closed-in-root-seal',
    },
  ],
  replay: {
    release: [
      'bash proof/certificates/verify_newman_01787854.sh \\',
      '  /path/to/clean/release',
    ],
    releaseExpected:
      'RESULT: FINITE REPLAY ATTESTATION PASS mode=RELEASE · RESULT: NEWMAN 0.1787854 ASSEMBLY PASS',
    material: [
      'bash proof/certificates/verify_newman_01787854.sh \\',
      '  /path/to/clean/release /path/to/fresh/full-sweep',
    ],
    materialExpected:
      'RESULT: FINITE REPLAY ATTESTATION PASS mode=MATERIAL · RESULT: NEWMAN 0.1787854 ASSEMBLY PASS',
  },
  environment: {
    base: 'Ubuntu 24.04',
    architecture: 'Linux/arm64',
    flint: '3.0.1',
    python: '3.12',
    mpmath: '1.4.1',
    sympy: '1.12',
  },
};

// Compatibility alias: the route and filename predate the theorem seal.
export const NEWMAN_LAMBDA_01787854_CANDIDATE =
  NEWMAN_LAMBDA_01787854_THEOREM;

export const NEWMAN_LAMBDA_01787854_ASSERTIONS = [
  {
    id: 'lambda-01787854-exact-rational-assembly',
    holds: () => {
      const c = NEWMAN_LAMBDA_01787854_THEOREM;
      const t = c.exactTarget;
      const slab = c.certifiedRegions.compactSlab;
      const halfStrip = c.certifiedRegions.finalTimeHalfStrip;
      return (
        t.numerator === 893927 &&
        t.t0Numerator * 6250 + t.y0SquaredNumerator === t.numerator &&
        t.denominator === 5000000 &&
        t.X === 6000000185827 &&
        t.t0Numerator === 129 &&
        t.t0Denominator === 800 &&
        t.y0SquaredNumerator === 87677 &&
        t.y0SquaredDenominator === 2500000 &&
        t.numerator / t.denominator === t.decimal &&
        t.t0Numerator / t.t0Denominator === t.t0 &&
        t.y0SquaredNumerator / t.y0SquaredDenominator === t.y0Squared &&
        Math.abs(t.y0 * t.y0 - t.y0Squared) < 1e-15 &&
        2 * t.t0 + t.y0Squared < 1 &&
        slab.xMin === t.X &&
        slab.xMax === t.X + 1 &&
        slab.yMinNumerator === 1809 &&
        slab.yMinDenominator === 10000 &&
        slab.yMax === 1 &&
        slab.tMin === 0 &&
        slab.tMaxNumerator === 129 &&
        slab.tMaxDenominator === 800 &&
        slab.closedEndpoints === true &&
        slab.prismCount === 883 &&
        slab.minimumStrictMargin === '0.519849894613872543374989997' &&
        halfStrip.n0 === 690988 &&
        halfStrip.x0Tex === '4\\pi\\left(690988^2-\\frac{129}{12800}\\right)' &&
        halfStrip.yMinTex === '\\sqrt{87677/2500000}' &&
        halfStrip.yMaxTex === '\\sqrt{271/400}' &&
        halfStrip.closedEndpoints === true &&
        halfStrip.symmetricExtension === true
      );
    },
    why:
      'The headline decimal and both certified zero-free regions must retain the exact sealed integers, endpoints, and rational identity.',
  },
  {
    id: 'lambda-01787854-repository-theorem-flags-remain-honest',
    holds: () => {
      const i = NEWMAN_LAMBDA_01787854_THEOREM.identity;
      return (
        i.candidate === false &&
        i.repositoryProved === true &&
        i.rigorous === true &&
        i.computerAssisted === true &&
        i.published === false &&
        i.peerReviewed === false &&
        i.independentReviewOpen === true
      );
    },
    why:
      'The result is proved in the repository, but remains computer-assisted, unpublished, unpeer-reviewed, and open to external review.',
  },
  {
    id: 'lambda-01787854-finite-coverage-is-contiguous',
    holds: () => {
      const f = NEWMAN_LAMBDA_01787854_THEOREM.finiteEvidence;
      return (
        f.firstN === 690988 &&
        f.lastN === 3840000 &&
        f.lastN - f.firstN + 1 === f.rowCount &&
        f.rowCount === 3149013 &&
        f.noGaps &&
        f.noDuplicates &&
        f.noNonpositiveRows &&
        f.noUncertainRows &&
        f.dini.precisionsBits.join(',') === '180,256' &&
        f.dini.divisorPatternCounts.join(',') === '243,81,27,9' &&
        f.errorCertificate.precisionsBits.join(',') === '256,512' &&
        f.errorCertificate.checksPassed === 96 &&
        f.errorCertificate.checksTotal === 96 &&
        f.errorCertificate.domains.join(',') === 'exact-t0,closed-t-box'
      );
    },
    why:
      'The finite certificate must retain the contiguous 3,149,013-row range, Dini sweeps, and 96/96 two-precision error checks.',
  },
  {
    id: 'lambda-01787854-decisive-margins-are-strict',
    holds: () => {
      const f = NEWMAN_LAMBDA_01787854_THEOREM.finiteEvidence;
      const t = NEWMAN_LAMBDA_01787854_THEOREM.tailEvidence;
      const h = NEWMAN_LAMBDA_01787854_THEOREM.verifiedHeight;
      return (
        f.dini.worstCertifiedRatio < 1 &&
        f.dini.worstCertifiedRatio === 0.999998607672751 &&
        f.dini.worstCertifiedRatioLiteral === '0.99999860767275095' &&
        f.correctionLogRateUpperBound < 0 &&
        f.rawFloorLiteral === '0.000000791366' &&
        f.effectiveErrorUpperBoundLiteral === '2.33494905212293253172e-7' &&
        f.finiteMarginLowerBoundLiteral === '5.57871094787706746828e-7' &&
        f.rawFloor - f.effectiveErrorUpperBound >= f.finiteMarginLowerBound &&
        f.finiteMarginLowerBound > 0 &&
        f.conservativeErrorCoefficient === 10.5 &&
        t.precisionsBits.join(',') === '256,512' &&
        t.contractionUpperBound < 1 &&
        t.contractionUpperBound === 0.9997209093887508 &&
        t.contractionUpperBoundLiteral === '0.9997209093887507' &&
        t.flowLowerBound === 0.0001735326089372 &&
        t.errorUpperBound === 1.1671603435274713e-8 &&
        t.slackLowerBound === 0.0001735209373337 &&
        t.flowLowerBound - t.errorUpperBound >= t.slackLowerBound &&
        t.slackLowerBound > 0 &&
        t.conservativeErrorCoefficient === 10.5 &&
        t.checksPassed === 36 &&
        t.checksTotal === 36 &&
        t.checksPassed === t.checksTotal &&
        t.checksArePerPrecision === true &&
        h.TPT === 3000175332800 &&
        h.halfXAtMostTPT === true &&
        h.exactSurplusNumerator === 350479773 &&
        h.exactSurplusDenominator === 2 &&
        NEWMAN_LAMBDA_01787854_THEOREM.exactTarget.X / 2 <= h.TPT
      );
    },
    why:
      'The repository theorem depends on strict finite and tail inequalities with the corrected conservative 10.50 error coefficient.',
  },
  {
    id: 'lambda-01787854-seal-and-closed-audit-record-are-complete',
    holds: () => {
      const c = NEWMAN_LAMBDA_01787854_THEOREM;
      return (
        c.closedAuditItems.length === 8 &&
        c.closedAuditItems.every((item) => item.status === 'closed-in-root-seal') &&
        c.identity.packageCommit === '9cc69d4775fafe3a9083c8b606ea9ad390e55fb2' &&
        c.identity.releaseCommit === '737d14f3212d09d1a14c12f57f518fe00418c7f6' &&
        c.identity.releaseTree === '9f532f3c0708788be898c63599e1455d9c7a7399' &&
        c.identity.sealSha256 ===
          '9d3edd9825d9231183094e035eb695c333f5d344615da896038667d75c597ce8' &&
        c.identity.containerImage ===
          'sha256:8da4b264d3ca9c4630782d99c806886332987a5e7f882c09b7afdb2ba7214ef8'
      );
    },
    why:
      'The display must retain the eight closed audit interfaces and immutable root, release, tree, manifest, and container provenance.',
  },
];

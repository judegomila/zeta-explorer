/**
 * Public-facing summary of the immutable v3 de Bruijn--Newman review package.
 *
 * Two independent axes are deliberately kept separate:
 *   1. the proposed proof has an unconditional logical form (it is designed
 *      not to assume RH or another unproved conjecture); and
 *   2. the package is still an unreviewed proof candidate, so the proposed
 *      bound is not an established theorem.
 *
 * The legacy THEOREM export is retained only so old imports do not break.
 */

export const NEWMAN_LAMBDA_01787854_CANDIDATE = {
  identity: {
    label: 'Unreviewed proof candidate: Λ ≤ 0.1787854',
    datePrepared: '2026-07-27',
    dateReconciled: '2026-07-28',
    repositoryUrl:
      'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit',
    releaseTag: 'review-01787854-v3',
    releaseUrl:
      'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/releases/tag/review-01787854-v3',
    packageCommit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    releaseCommit: '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea',
    releaseTree: '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44',
    annotatedTagObject: '585586bb0e6fd576710be704fda9500284b24bc7',
    sealSha256: '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c',
    containerImage:
      'ghcr.io/judegomila/dbn-lambda-01787854-review@sha256:6e29bc53adc5a4337802da2b5a219720e3da9dcc1b87c546b96b6126d8b9975d',
    candidate: true,
    intendedLogicalForm: 'unconditional',
    assumesUnprovedConjecture: false,
    established: false,
    accepted: false,
    repositoryProved: false,
    rigorous: false,
    artifactSealed: true,
    encodedChecksPassed: true,
    computerAssisted: true,
    published: false,
    peerReviewed: false,
    independentReviewOpen: true,
  },
  refereePaper: {
    title:
      'A Candidate for an Unconditional Computer-Assisted Proof of Lambda <= 0.1787854',
    publicPath: '/papers/dbn-lambda-01787854-candidate-audit-v3.pdf',
    provenancePath:
      '/papers/dbn-lambda-01787854-candidate-audit-v3.provenance.txt',
    repositoryPath: 'output/pdf/dbn_lambda_01787854_candidate_audit.pdf',
    releaseAssetUrl:
      'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/releases/download/review-01787854-v3/dbn_lambda_01787854_candidate_audit.pdf',
    sha256: 'b1151d56bc2917d98e3ff4047c0426f44ee88e6cf7edd1a6ca3c47ef324b1172',
    pages: 21,
    bytes: 73703,
    format: 'PDF 1.4',
    visuallyInspected: true,
  },
  verification: {
    mainReplay: {
      runId: '30317899517',
      url:
        'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/actions/runs/30317899517',
      fullReviewPassed: true,
      completeFiniteReplayPassed: true,
    },
    tagImageReplay: {
      runId: '30322974859',
      url:
        'https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/actions/runs/30322974859',
      exactImageBuiltOnce: true,
      criticalReplayPassed: true,
      completeFiniteReplayPassed: true,
    },
    offlinePublishedImageMarker: 'RESULT: OFFLINE PUBLISHED-IMAGE REVIEW PASS',
    sealEntryCount: 362,
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
    effectiveErrorUpperBound: 2.3349490521233785e-7,
    effectiveErrorUpperBoundLiteral: '2.33494905212337849e-7',
    finiteMarginLowerBound: 5.57871094787e-7,
    finiteMarginLowerBoundLiteral: '5.57871094787e-7',
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
  barrierEvidence: {
    approximationAllowance: 0.00125,
    effectiveErrorUpperBoundLiteral: '0.000356523011600040',
    prismCount: 883,
    minimumRecomputedPrismMargin: '0.519849894613872543374989997',
    windingLower: '-8.95e-13',
    windingUpper: '8.95e-13',
    coefficientComponents: 7688,
    coefficientContainmentFailures: 0,
  },
  closedAuditItems: [
    {
      title: 'Native Triangle-to-|f_t| binding',
      detail:
        'The v3 candidate supplies a sealed exact-convolution binding from the producer floor to normalized |f_t| units. Its mathematics and source-to-proof correspondence remain external-review obligations.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Closed compact slab',
      detail:
        'The v3 candidate supplies a repaired 883-prism Arb barrier with fail-closed interval comparisons, whole-prism time control, analytic quadrature callbacks, and a t=0 endpoint argument.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Direct Dini reduction',
      detail:
        'The v3 candidate supplies a direct all-height transfer bound over every active divisor pattern at 180 and 256 bits. Independent review must validate the reduction and its implementation.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Conservative error transcription',
      detail:
        'The v3 candidate derives 10.50 = 3.58 + 6.92 from Polymath Proposition 6.6(vi), audits x−6.66 and the conservative x−12 replacement, and does not rely on the displayed 10.44.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Tail theorem and implementation',
      detail:
        'The v3 candidate supplies a source-bound conservative tail implementation and 36/36 strict gates at both 256 and 512 bits, yielding a positive encoded post-error margin.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Independent interval implementation',
      detail:
        'The release includes multiple precisions, two barrier platforms, and Python/FLINT-Arb paths. Truly independent recomputation with different sources, partitions, or algorithms is still requested.',
      status: 'supplied-in-v3-candidate',
    },
    {
      title: 'Full finite material replay',
      detail:
        'GitHub Actions regenerated all 3,149,013 rows against the exact v3 commit and image, including every prime-set joint and shard boundary, and matched the immutable release payloads.',
      status: 'verified-execution-in-v3',
    },
    {
      title: 'Criterion weld',
      detail:
        'The v3 candidate encodes the three Polymath Theorem 1.2 suppliers and exact rational substitution together. Direct referee verification of the theorem transcription and weld remains load-bearing.',
      status: 'supplied-in-v3-candidate',
    },
  ],
  implementationReviewItems: [
    {
      title: 'Window-freeze C6/C7 are documentary gates',
      detail:
        'In v3, verify_window_freeze.py passes C6 and C7 with literal True after checking the surrounding exact hypotheses and interval derivative signs. The claimed freeze directions and half-open endpoint convention therefore still require direct review of the written proof; the PASS labels are not independent computations of those two conclusions.',
      severity: 'review-required',
    },
    {
      title: 'Earlier differential spot-check is not sealed evidence',
      detail:
        'An eight-point, 5.5-million-summand barrier differential experiment was run during preparation, but its temporary artifacts are not in the v3 362-entry seal or release assets. It is deliberately excluded from the v3 evidence count.',
      severity: 'scope-boundary',
    },
  ],
  reviewBoundary: [
    'Published-theorem transcription and the exact three-hypothesis criterion weld.',
    'Mathematical validity of the native binding, Dini transfer, 10.50 error weld, window freeze, all-N tail, closed barrier, and t=0 continuity.',
    'Proof-to-code fidelity and the absence of a conceptual error shared by all replay paths.',
    'Independent recomputation using different source, partitions, intermediate data, or algorithms.',
    'Mutation-test kill rates, parameter-perturbation calibration, and independent referee sign-off.',
  ],
  replay: {
    release: [
      'git clone https://github.com/judegomila/dbn-lambda-01787854-candidate-audit.git',
      'cd dbn-lambda-01787854-candidate-audit',
      'git checkout --detach review-01787854-v3',
      'test "$(git rev-parse HEAD)" = "2e9976c4becbf97e31c56fe75fce07cdff5dd4ea"',
      'python3 -m venv .venv',
      '. .venv/bin/activate',
      'python3 -m pip install --require-hashes -r requirements.txt',
      './verify.sh',
    ],
    releaseExpected:
      'RESULT: STORED UNCONDITIONAL-CANDIDATE REVIEW PASS',
    material: [
      'git clone https://github.com/judegomila/dbn-lambda-01787854-candidate-audit.git',
      'cd dbn-lambda-01787854-candidate-audit',
      'git checkout --detach review-01787854-v3',
      'test "$(git rev-parse HEAD)" = "2e9976c4becbf97e31c56fe75fce07cdff5dd4ea"',
      'docker build --platform linux/amd64 -t dbn-lambda-01787854-review .',
      "review_image_id=$(docker image inspect --format '{{.Id}}' \\",
      '  dbn-lambda-01787854-review)',
      'IMAGE=dbn-lambda-01787854-review EXPECTED_IMAGE_ID="$review_image_id" \\',
      '  ./scripts/run_full_sweep.sh replay/full_sweep',
    ],
    materialExpected:
      'all 3,149,013 canonical rows regenerate and exactly match the 15 sealed shards',
  },
  environment: {
    base: 'Ubuntu 24.04',
    architecture: 'Linux/amd64',
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
      const c = NEWMAN_LAMBDA_01787854_CANDIDATE;
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
    id: 'lambda-01787854-proof-candidate-flags-remain-honest',
    holds: () => {
      const i = NEWMAN_LAMBDA_01787854_CANDIDATE.identity;
      return (
        i.candidate === true &&
        i.intendedLogicalForm === 'unconditional' &&
        i.assumesUnprovedConjecture === false &&
        i.established === false &&
        i.accepted === false &&
        i.repositoryProved === false &&
        i.rigorous === false &&
        i.artifactSealed === true &&
        i.encodedChecksPassed === true &&
        i.computerAssisted === true &&
        i.published === false &&
        i.peerReviewed === false &&
        i.independentReviewOpen === true
      );
    },
    why:
      'The package proposes an unconditional logical form, but the bound remains an unreviewed computer-assisted candidate rather than an established theorem.',
  },
  {
    id: 'lambda-01787854-finite-coverage-is-contiguous',
    holds: () => {
      const f = NEWMAN_LAMBDA_01787854_CANDIDATE.finiteEvidence;
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
      const f = NEWMAN_LAMBDA_01787854_CANDIDATE.finiteEvidence;
      const t = NEWMAN_LAMBDA_01787854_CANDIDATE.tailEvidence;
      const h = NEWMAN_LAMBDA_01787854_CANDIDATE.verifiedHeight;
      return (
        f.dini.worstCertifiedRatio < 1 &&
        f.dini.worstCertifiedRatio === 0.999998607672751 &&
        f.dini.worstCertifiedRatioLiteral === '0.99999860767275095' &&
        f.correctionLogRateUpperBound < 0 &&
        f.rawFloorLiteral === '0.000000791366' &&
        f.effectiveErrorUpperBoundLiteral === '2.33494905212337849e-7' &&
        f.finiteMarginLowerBoundLiteral === '5.57871094787e-7' &&
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
        NEWMAN_LAMBDA_01787854_CANDIDATE.exactTarget.X / 2 <= h.TPT
      );
    },
    why:
      'The proof candidate depends on strict finite and tail inequalities with the corrected conservative 10.50 error coefficient.',
  },
  {
    id: 'lambda-01787854-v3-seal-paper-and-review-boundary-are-pinned',
    holds: () => {
      const c = NEWMAN_LAMBDA_01787854_CANDIDATE;
      return (
        c.closedAuditItems.length === 8 &&
        c.closedAuditItems.every((item) =>
          ['supplied-in-v3-candidate', 'verified-execution-in-v3'].includes(item.status)
        ) &&
        c.identity.releaseTag === 'review-01787854-v3' &&
        c.identity.packageCommit === '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
        c.identity.releaseCommit === '2e9976c4becbf97e31c56fe75fce07cdff5dd4ea' &&
        c.identity.releaseTree === '7f15ecf8c3dbc73d547a2d4a3f2287bd87802f44' &&
        c.identity.annotatedTagObject === '585586bb0e6fd576710be704fda9500284b24bc7' &&
        c.identity.sealSha256 ===
          '89a201565d5b4a0f02ab49092e3189c7a6d3b0bfaa4e93630c68cf8c4155ae1c' &&
        c.identity.containerImage ===
          'ghcr.io/judegomila/dbn-lambda-01787854-review@sha256:6e29bc53adc5a4337802da2b5a219720e3da9dcc1b87c546b96b6126d8b9975d' &&
        c.refereePaper.sha256 ===
          'b1151d56bc2917d98e3ff4047c0426f44ee88e6cf7edd1a6ca3c47ef324b1172' &&
        c.refereePaper.pages === 21 &&
        c.refereePaper.bytes === 73703 &&
        c.refereePaper.publicPath ===
          '/papers/dbn-lambda-01787854-candidate-audit-v3.pdf' &&
        c.refereePaper.provenancePath ===
          '/papers/dbn-lambda-01787854-candidate-audit-v3.provenance.txt' &&
        c.verification.mainReplay.fullReviewPassed === true &&
        c.verification.mainReplay.completeFiniteReplayPassed === true &&
        c.verification.tagImageReplay.criticalReplayPassed === true &&
        c.verification.tagImageReplay.completeFiniteReplayPassed === true &&
        c.verification.sealEntryCount === 362 &&
        c.implementationReviewItems.length === 2 &&
        c.reviewBoundary.length === 5
      );
    },
    why:
      'The display must pin the exact v3 release, paper, image, green replay records, supplied candidate interfaces, and the work that still requires independent review.',
  },
];

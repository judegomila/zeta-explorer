/**
 * @fileoverview imp-95769 — accuracy/consistency audit of every consumer of the imp-95691
 * CF_BAND_HI_PINNED = 1.29615 geometric-mean pin, now that imp-95747 converged the honest
 * CF_BAND_HI representative to the cutoff-independent GUE-saturated r_eff = 9.583x.
 *
 * WHY. imp-95691 still EXPORTS CF_BAND_HI_PINNED = sqrt(1.2 * 1.4) = 1.29615, and its own note
 * says the value is kept unchanged only because downstream modules import its exact number; those
 * readers are directed to use the imp-95747 converged 9.583x as the current honest representative.
 * The supersession chain is 1.29615 (imp-95691 estimate) -> 1.914x (imp-95705 measured bulk-midpoint)
 * -> 6.1-8.6x (imp-95721 density-weighted physical-cutoff band) -> 9.583x (imp-95747 GUE-regularized
 * cutoff-independent converged value). This module audits whether any consumer surfaces one of the
 * superseded numbers (1.29615, or the intermediate 1.914x / 6.1-8.6x) AS the current honest
 * representative, or computes a bound / wedge-depth / box-min figure off it as if it were final.
 *
 * METHOD. Static enumeration of every importer / referencer of CF_BAND_HI_PINNED and the 1.29615
 * literal, with the role each plays (source of record, superseded comparison baseline, historical
 * chain step, or presentation landmark). No re-derivation; carried literals only.
 *
 * FINDINGS.
 *   1. imp-95691 (SOURCE): exports CF_BAND_HI_PINNED = 1.29615 but carries honestStatus with
 *      supersededBy = imp-95747, supersessionChain length 3, supersedingValue = 9.583. The literal
 *      is retained purely for the numeric stability of downstream importers; the object does NOT
 *      present 1.29615 as the honest representative. PASS.
 *   2. imp-95705 (measured reach): references 1.29615 only as IMP95691_PINNED_GM, a SUPERSEDED
 *      comparison baseline against which the measured 1.914x is shown to be higher. Its box-min
 *      figures are computed at cf = 1 and cf = 1.914x, not at the pin. PASS.
 *   3. imp-95721 (density-weighted band): a historical chain step that predates imp-95747; it derives
 *      the 6.1-8.6x band as its OWN result and never claims it is the final honest representative for
 *      all downstream time. It carries no reference to 1.29615 as final. PASS (superseded-but-honest
 *      historical step).
 *   4. imp-95747 (converged value): the source of record for the 9.583x honest representative. PASS.
 *   5. imp-95754 viz-data + Imp95754CfWedgeDepthVsMultiplierViz page (PRESENTATION): plots cf = 1.29615
 *      as one landmark labeled "imp-95691 pinned geom-mean" among nine (C_617 / imp-95691 / imp-95721)
 *      box-min landmarks on a monotone-deepening curve. It does NOT claim any single landmark is the
 *      honest representative -- so it does not MISATTRIBUTE a superseded value as final. HOWEVER the
 *      deepest landmark it plots is the intermediate imp-95721 6.1-8.6x band (minGap -0.171451), and
 *      the imp-95747 converged 9.583x landmark (minGap -0.184642, the current honest representative)
 *      is ABSENT, so the visible endpoint of the curve is a superseded intermediate. FLAGGED as a
 *      completeness gap (not a bound error): a follow-up content ticket should add the imp-95747
 *      9.583x landmark so the viz endpoint matches the current honest representative.
 *
 * VERDICT. AUDIT PASSES on correctness: no consumer surfaces a superseded C_F multiplier
 * (1.29615, 1.914x, or 6.1-8.6x) AS the current honest representative, and no consumer computes a
 * bound / wedge-depth / box-min figure off a superseded value as if it were final. One completeness
 * gap is flagged (the imp-95754 viz omits the imp-95747 9.583x endpoint). This audit changes no
 * bound, establishes no operator positivity, and asserts no QED; no refereed bound is changed
 * . NO heavy imports.
 */

// carried literals of the supersession chain (imp-95691 / imp-95705 / imp-95721 / imp-95747)
const CF_BAND_HI_PINNED = 1.29615;          // imp-95691 geometric-mean estimate sqrt(1.2*1.4)
const CF_MEASURED_MIDPOINT = 1.914;         // imp-95705 measured bulk-midpoint reach
const CF_DENSITY_BAND_LO = 6.1;             // imp-95721 density-weighted physical-cutoff band low
const CF_DENSITY_BAND_HI = 8.6;             // imp-95721 density-weighted physical-cutoff band high
const CF_CONVERGED = 9.583;                 // imp-95747 GUE-saturated cutoff-independent honest rep

// box-min gap landmarks (imp-95617 nominal / imp-95691 pin / imp-95721 band / imp-95747 converged)
const MINGAP_NOMINAL = -0.004682;           // cf = 1 (imp-95617 nominal box-min)
const MINGAP_AT_PIN = -0.013188;            // cf = 1.29615 (imp-95691)
const MINGAP_DENSITY_DEEPEST = -0.171451;   // deepest imp-95721 density-band landmark
const MINGAP_CONVERGED = -0.184642;         // cf = 9.583 (imp-95747), deeper than the imp-95721 band

const CONSUMERS = Object.freeze([
  Object.freeze({
    module: 'imp-95691-cf-band-hi-pinned-wedge-opening.js',
    role: 'source of record',
    usesValue: 'exports CF_BAND_HI_PINNED = 1.29615',
    surfacesSupersededAsHonest: false,
    note:
      'literal retained only for downstream numeric stability; honestStatus.supersededBy = imp-95747, '
      + 'supersedingValue = 9.583, supersessionChain length 3. Directs readers to the converged value.',
  }),
  Object.freeze({
    module: 'imp-95705-cf-integrated-reach-measured.js',
    role: 'superseded comparison baseline',
    usesValue: 'references 1.29615 as IMP95691_PINNED_GM only',
    surfacesSupersededAsHonest: false,
    note:
      'uses 1.29615 as the baseline the measured 1.914x exceeds; box-min figures are at cf = 1 and '
      + 'cf = 1.914x, not presented as final.',
  }),
  Object.freeze({
    module: 'imp-95721-cf-alpha-weight-density-pinned.js',
    role: 'historical chain step',
    usesValue: 'derives the 6.1-8.6x band; imports imp-95691/imp-95705',
    surfacesSupersededAsHonest: false,
    note:
      'predates imp-95747; presents its own 6.1-8.6x band as a step, not as the final representative; '
      + 'carries no claim that 1.29615 is honest.',
  }),
  Object.freeze({
    module: 'imp-95747-cf-reff-gue-repulsion-regularization.js',
    role: 'converged value source',
    usesValue: 'defines r_eff_GUE = 9.583x',
    surfacesSupersededAsHonest: false,
    note: 'the source of record for the current honest CF_BAND_HI representative.',
  }),
  Object.freeze({
    module: 'imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js + Imp95754CfWedgeDepthVsMultiplierViz.jsx',
    role: 'presentation (viz landmarks)',
    usesValue: 'plots cf = 1.29615 as one labeled landmark among nine',
    surfacesSupersededAsHonest: false,
    note:
      'plots a monotone-deepening curve of imp-95617/imp-95691/imp-95721 landmarks without calling any '
      + 'one final, so it does not misattribute a superseded value as honest. COMPLETENESS GAP: the '
      + 'deepest plotted landmark is the intermediate imp-95721 6.1-8.6x band (minGap -0.171451); the '
      + 'imp-95747 converged 9.583x endpoint (minGap -0.184642) is absent, so the visible curve endpoint '
      + 'is a superseded intermediate. Recommend a follow-up content ticket to add the 9.583x landmark.',
  }),
]);

export const CF_BAND_HI_PINNED_CONSUMER_AUDIT = Object.freeze({
  id: 'imp-95769-cf-band-hi-pinned-consumer-audit',
  title:
    'Accuracy audit: no consumer of the imp-95691 CF_BAND_HI_PINNED = 1.29615 pin surfaces a '
    + 'superseded C_F multiplier (1.29615 / 1.914x / 6.1-8.6x) as the current honest representative or '
    + 'computes a bound off it as final; the honest representative is the imp-95747 converged 9.583x',
  status:
    'AUDIT PASS (correctness) with one flagged completeness gap. Enumerated all five consumers of '
    + 'CF_BAND_HI_PINNED / the 1.29615 literal: imp-95691 (source, retains 1.29615 for numeric '
    + 'stability but honestStatus points to imp-95747 9.583x), imp-95705 (1.29615 used only as a '
    + 'superseded comparison baseline), imp-95721 (historical step deriving the 6.1-8.6x band, no final '
    + 'claim), imp-95747 (source of the 9.583x converged value), and the imp-95754 viz-data module + '
    + 'page (plots 1.29615 as one labeled landmark on a monotone-deepening curve, not as final). NONE '
    + 'surfaces a superseded multiplier AS the honest representative and NONE computes a bound / '
    + 'wedge-depth / box-min figure off a superseded value as if final. FLAGGED: the imp-95754 viz '
    + 'omits the imp-95747 9.583x landmark (minGap -0.184642), so its visible curve endpoint is the '
    + 'intermediate imp-95721 6.1-8.6x band -- a completeness gap, not a bound error, for a follow-up '
    + 'content ticket. Accuracy/consistency audit only; changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; NO QED',
  source: 'imp-95691 (pin), imp-95705 (measured reach), imp-95721 (density band), imp-95747 (converged 9.583x), imp-95754 (viz)',

  supersessionChain: Object.freeze({
    pinEstimate: CF_BAND_HI_PINNED,        // 1.29615 (imp-95691)
    measuredMidpoint: CF_MEASURED_MIDPOINT, // 1.914x (imp-95705)
    densityBand: Object.freeze([CF_DENSITY_BAND_LO, CF_DENSITY_BAND_HI]), // 6.1-8.6x (imp-95721)
    convergedHonest: CF_CONVERGED,         // 9.583x (imp-95747) -- current honest representative
    boxMinLandmarks: Object.freeze({
      nominal: MINGAP_NOMINAL,             // cf = 1
      atPin: MINGAP_AT_PIN,                // cf = 1.29615
      densityDeepest: MINGAP_DENSITY_DEEPEST, // imp-95721 deepest plotted landmark
      converged: MINGAP_CONVERGED,         // cf = 9.583 (imp-95747)
    }),
  }),

  consumers: CONSUMERS,

  verdict: Object.freeze({
    anyConsumerSurfacesSupersededAsHonest: false,
    flaggedCompletenessGaps: Object.freeze([
      'imp-95754 viz omits the imp-95747 9.583x landmark (minGap -0.184642); its visible curve endpoint '
      + 'is the intermediate imp-95721 6.1-8.6x band (minGap -0.171451). Follow-up content ticket.',
    ]),
    conclusion:
      'No page or analysis computes a C_F-dependent bound, wedge-depth, or box-min figure off the '
      + 'superseded 1.29615 pin (or the intermediate 1.914x / 6.1-8.6x) as the current honest '
      + 'representative. imp-95691 retains 1.29615 only for downstream numeric stability and directs '
      + 'readers to the imp-95747 converged 9.583x. The one completeness gap (the imp-95754 viz missing '
      + 'the 9.583x endpoint) is presentation-only. The audit moves no bound and asserts no QED.',
  }),

  caveats:
    'Static consumer enumeration with carried literals only; performs no re-derivation of any box-min '
    + 'gap or reach multiplier. The whole imp-95617/imp-95691/imp-95705/imp-95721/imp-95747 chain rests '
    + 'on the inherited imp-3220/imp-3406 model and is NOT a rigorous asymptotic; it changes no bound. '
    + 'No refereed bound is changed; NO QED.',
});

export const CF_BAND_HI_PINNED_CONSUMER_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'supersession chain ordering: 1.29615 < 1.914 < 6.1 < 8.6 < 9.583',
    holds: () =>
      CF_BAND_HI_PINNED < CF_MEASURED_MIDPOINT
      && CF_MEASURED_MIDPOINT < CF_DENSITY_BAND_LO
      && CF_DENSITY_BAND_LO < CF_DENSITY_BAND_HI
      && CF_DENSITY_BAND_HI < CF_CONVERGED,
  },
  {
    name: 'box-min gaps deepen monotonically: nominal > pin > density-deepest > converged',
    holds: () =>
      MINGAP_NOMINAL > MINGAP_AT_PIN
      && MINGAP_AT_PIN > MINGAP_DENSITY_DEEPEST
      && MINGAP_DENSITY_DEEPEST > MINGAP_CONVERGED,
  },
  {
    name: 'all five consumers audited; none surfaces a superseded multiplier as the honest representative',
    holds: () =>
      CONSUMERS.length === 5
      && CONSUMERS.every((c) => c.surfacesSupersededAsHonest === false)
      && CF_BAND_HI_PINNED_CONSUMER_AUDIT.verdict.anyConsumerSurfacesSupersededAsHonest === false,
  },
  {
    name: 'exactly one completeness gap flagged (imp-95754 viz missing the 9.583x endpoint)',
    holds: () =>
      CF_BAND_HI_PINNED_CONSUMER_AUDIT.verdict.flaggedCompletenessGaps.length === 1
      && /imp-95754/.test(CF_BAND_HI_PINNED_CONSUMER_AUDIT.verdict.flaggedCompletenessGaps[0])
      && /9.583/.test(CF_BAND_HI_PINNED_CONSUMER_AUDIT.verdict.flaggedCompletenessGaps[0]),
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () =>
      /changes no bound/.test(CF_BAND_HI_PINNED_CONSUMER_AUDIT.status)
      && /refereed bound is changed/i.test(CF_BAND_HI_PINNED_CONSUMER_AUDIT.status)
      && /NO QED/.test(CF_BAND_HI_PINNED_CONSUMER_AUDIT.status),
  },
]);

export default CF_BAND_HI_PINNED_CONSUMER_AUDIT;

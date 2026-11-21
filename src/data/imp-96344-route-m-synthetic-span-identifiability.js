/**
 * @module imp-96344-route-m-synthetic-span-identifiability
 *
 * imp-96344 (numerical): ASSESS whether a synthetic / model log-N range extension
 * (a generative subleading-spectrum surrogate spanning several more decades than
 * the brute-force Vasyunin Gram can reach) could IN PRINCIPLE break the Route M
 * conductor-band vs smooth-drift degeneracy, and MEASURE the log-N span that
 * would be required for identifiability AT THE OBSERVED BAND WIDTH.
 *
 * BACKGROUND. imp-96325 ran the exact Vasyunin Gram ladder to N=1e4 and its
 * IMP96325_Q2_BAND_UNIQUENESS stayed OPEN: the half-decade of extra log-N span
 * ([5.52,8.70] -> [5.52,9.21], gain only ~0.51) did NOT break the band-vs-drift
 * degeneracy, and the module noted the limit is the NARROW log-N dynamic range,
 * not sample size. This module assesses the "synthetic span extension" route the
 * ticket poses -- can a generated surrogate spanning more decades separate a
 * genuine few-conductor arithmetic band from a smooth drift? -- and reconciles it
 * with the model-selection results already on record.
 *
 * WHAT WAS MEASURED (tmp/imp-96344-scratch.mjs / scratch2.mjs, reproducible,
 * model / measurement only). Two distinct degeneracies must be separated, because
 * they are span-limited very differently:
 *   (D1) BAND vs LITERAL SMOOTH DRIFT -- is the swing a genuine oscillation or a
 *        slow monotone / low-order non-oscillatory trend (const + a/logN + ...)?
 *   (D2) BAND vs OSCILLATION-AT-THE-SAME-FREQUENCY -- given that it IS oscillatory,
 *        can the SPECIFIC discrete conductor content (adjacent lines q=4 at
 *        w_4 = 4.5324 and q=5 at w_5 = 3.9040) be resolved from a single smeared
 *        tone at the intermediate free optimum w = 4.08?
 * For (D1) a pure conductor tone was projected onto the smooth-drift basis
 * {1, 1/x, 1/x^2, 1/x^3}, x = log N, over windows [x0, x0+L]; for (D2) the
 * normalized overlap |corr(cos w_4 x, cos w_5 x)| over the window was measured vs
 * L. x0 = log(250) = 5.5215; the current run reaches x1 = log(1e4) = 9.2103, so
 * the current span is L = 3.6889 in log N.
 *
 * FINDINGS (see IMP96344_* below).
 *   (F1) THE LITERAL BAND-vs-SMOOTH-DRIFT DEGENERACY (D1) IS NOT SPAN-LIMITED --
 *        it is ALREADY RESOLVED at the current span. A pure conductor tone is only
 *        weakly absorbed by the low-order smooth-drift basis even at L=3.69 (RMS
 *        residual fraction 0.94 at drift degree 2), consistent with imp-96231
 *        having DECISIVELY rejected smooth drift at the current 17-point ladder
 *        (delta AICc = -18.6, band R^2=0.712 vs best low-order polynomial 0.140).
 *        Extending the synthetic log-N span does NOT and CANNOT further "break"
 *        this degeneracy, because it is not open: a smooth non-oscillatory drift
 *        is already the losing model. So the ticket premise inherited from
 *        imp-96325 needs the sharpening in F2.
 *   (F2) THE ACTUALLY-OPEN, SPAN-LIMITED DEGENERACY IS (D2): resolving the DISCRETE
 *        conductor content. The adjacent conductor pair q=4/q=5 has frequency
 *        spacing dw = w_4 - w_5 = 0.6284 rad per unit log N. By the Fourier /
 *        Rayleigh criterion two tones separated by dw are resolvable only over a
 *        window L >= 2 pi / dw = the BEAT PERIOD = 9.999 in log N. The current span
 *        L=3.69 is only 0.369 of ONE beat period, so the two lines are completely
 *        unresolved and merge into the single free tone at w=4.08 -- exactly why
 *        imp-96189 found the free optimum sitting BETWEEN q=4 and q=5. The current
 *        adjacent-tone overlap (0.067) is a Dirichlet-sidelobe coincidence at that
 *        particular L, not robust resolution (the overlap RISES to ~0.26 near
 *        L=7.5 before the first true null at L~10).
 *   (F3) REQUIRED IDENTIFIABILITY SPAN AT THE OBSERVED BAND WIDTH. To resolve the
 *        adjacent q=4/q=5 conductor lines: MARGINAL (one beat) L = 9.999 in log N,
 *        i.e. N up to exp(x0+9.999) = 5.50e6; CLEAN (two beats) L = 19.997,
 *        i.e. N up to 1.21e11 -- both FAR beyond the ~1e4 brute-force Gram reach
 *        (imp-96325). The AGGREGATE q=3..q6 band WIDTH (dw = 2.212, beat period
 *        2.8405 < current span 3.69) is by contrast ALREADY within reach, which is
 *        why the band-as-a-whole is detectable now while its individual lines are
 *        not. This matches the Rayleigh threshold on record (imp-96231 /
 *        imp-96248 / imp-96274: split needs L>=10.0, N~5.5e6).
 *   (F4) THE SYNTHETIC-SURROGATE ROUTE IS A DESIGN / POWER CALCULATION, NOT A
 *        SUBSTITUTE FOR REAL DATA -- and it is CIRCULAR for the real decision. A
 *        generative subleading-spectrum surrogate CAN span arbitrary decades and
 *        WILL, at L>=10, recover a genuine multi-conductor band and separate it
 *        from a single smeared tone (that is what imp-96248's AICc-vs-span curve
 *        measures). But a surrogate DECIDES nothing about whether the REAL Route M
 *        d_N^2 data carries a genuine arithmetic band, because a surrogate
 *        generated under a chosen model recovers that model BY CONSTRUCTION. So the
 *        synthetic route yields only the REQUIRED-SPAN number (F3); the real
 *        identification still needs the actual Vasyunin Gram at N ~ 5.5e6..1e11,
 *        which is out of brute-force reach. "Could a synthetic span extension break
 *        the degeneracy?" -> it can QUANTIFY the span required, it cannot ACHIEVE
 *        the identification in place of real data.
 *
 * VERDICT: the log-N span for identifiability is set by Fourier resolution of the
 * conductor band WIDTH, not by sample size and not by a surrogate. At the observed
 * adjacent-conductor spacing dw = 0.628 the required span is L ~ 10 (N ~ 5.5e6,
 * marginal) to L ~ 20 (N ~ 1.2e11, clean). A synthetic surrogate measures this
 * design number but is circular for deciding the real band; IMP96325_Q2 stays
 * OPEN, limited by real-Gram reach, exactly as imp-96325 recorded.
 *
 * MODEL / MEASUREMENT ONLY. Changes no bound, establishes no operator positivity,
 * makes no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (IMP96325_Q2_BAND_UNIQUENESS)
 * @see imp-96231-route-m-band-vs-drift-identifiability.js (band decisively beats smooth drift; conductor content non-identifiable)
 * @see imp-96248-route-m-conductor-resolvability-curve.js (AICc two-tone preference vs span)
 * @see imp-96189-route-m-swing-attribution.js (conductor frequencies w_q = 2 pi / log q)
 *
 * Ticket: imp-96344 (numerical, opus-4-8, api-pool). Model / numerics only; NO QED.
 */

// Log-N window: x0 = log(250), current x1 = log(1e4).
export const IMP96344_WINDOW = Object.freeze({
  x0: 5.521460917862246,     // log(250)
  x1Current: 9.210340371976184, // log(1e4)
  spanCurrent: 3.6888794541139376,
  note: 'x = log N; the imp-96325 run reaches N=1e4 so the current identifiability window has span L = 3.6889 in log N.',
});

// Conductor angular frequencies w_q = 2 pi / log q (imp-96189 / imp-96231).
export const IMP96344_CONDUCTORS = Object.freeze({
  w4: 4.5324, // q=4
  w5: 3.9040, // q=5
  w3: 5.719,  // q=3 (band edge)
  w6: 3.507,  // q=6 (band edge)
  freeOptimum: 4.08, // best free single tone, sits between q4 and q5 (imp-96189)
});

// (D1) band vs LITERAL smooth drift: pure tone projected onto {1,1/x,1/x^2,1/x^3}.
// Residual fraction near 1 => drift cannot absorb the tone even at the current span.
export const IMP96344_DRIFT_DEGENERACY = Object.freeze({
  spanCurrent: 3.6888794541139376,
  freeToneResidFracDeg2: 0.9978,
  freeToneResidFracDeg3: 0.9556,
  bandResidFracDeg2: 0.9432,
  bandResidFracDeg3: 0.9124,
  alreadyResolved: true,
  crossRef: 'imp-96231 delta AICc = -18.6 (band R^2 0.712 vs best polynomial drift 0.140): smooth drift already the losing model at the 17-point ladder.',
  note: 'a pure conductor tone is only weakly captured by a low-order smooth-drift basis even at the current span, so band-vs-smooth-drift is NOT the open, span-limited degeneracy; extending the synthetic span cannot break a degeneracy that is already resolved.',
});

// (D2) band vs oscillation-at-the-same-frequency: adjacent q4/q5 line resolution.
export const IMP96344_LINE_RESOLUTION = Object.freeze({
  dwAdjacent: 0.6284,                 // w4 - w5
  beatPeriodAdjacent: 9.998703544206851, // 2 pi / dwAdjacent, in log N
  currentBeatFraction: 0.36893577630384267, // spanCurrent / beatPeriodAdjacent
  currentOverlap: 0.0674,             // |corr(cos w4 x, cos w5 x)| at L=3.6889
  overlapNearL7p5: 0.2600,            // overlap RISES before the first true null
  note: 'the adjacent q4/q5 pair (dw = 0.628) needs a full beat period (2 pi / dw = 9.999 in log N) to resolve; the current span covers only 0.369 of one beat, so the lines merge into the free tone at w=4.08 (the 0.067 overlap at L=3.69 is a sidelobe coincidence, not resolution -- overlap rises to 0.26 near L=7.5).',
});

// (F3) required identifiability span AT THE OBSERVED BAND WIDTH, and the N it demands.
export const IMP96344_REQUIRED_SPAN = Object.freeze({
  marginal: Object.freeze({ spanLogN: 9.998703544206851, Nmax: 5499481.989660784, beats: 1 }),
  clean: Object.freeze({ spanLogN: 19.997407088413702, Nmax: 120977208618.41339, beats: 2 }),
  aggregateBand: Object.freeze({
    dwBand: 2.212,                    // w3 - w6, full q3..q6 band width
    beatPeriodBand: 2.840499686790048, // 2 pi / dwBand
    alreadyWithinCurrentSpan: true,   // 2.8405 < 3.6889
    note: 'the aggregate q3..q6 band width already fits inside the current span, so the band-as-a-whole is detectable now while its individual conductor lines are not.',
  }),
  gramReach: 10000,
  note: 'resolving adjacent conductors demands N ~ 5.5e6 (marginal, one beat) to ~1.2e11 (clean, two beats), 550x to 1.2e7x beyond the ~1e4 brute-force Vasyunin Gram reach; matches the Rayleigh threshold on record (imp-96231 / imp-96248 / imp-96274).',
});

// (F4) the synthetic-surrogate route: a design/power number, circular for the real decision.
export const IMP96344_SURROGATE_ASSESSMENT = Object.freeze({
  canQuantifyRequiredSpan: true,
  canDecideRealBand: false,
  circular: true,
  answer:
    'a generative subleading-spectrum surrogate can span arbitrary decades and will, at L >= the beat period (~10 in log N), recover a genuine multi-conductor band and separate it from a single smeared tone (as imp-96248 AICc-vs-span measures) -- so it CAN quantify the required span. But it CANNOT decide whether the REAL Route M d_N^2 carries a genuine arithmetic band, because a surrogate generated under a chosen model recovers that model by construction (circular). The real identification still needs the actual Vasyunin Gram at N ~ 5.5e6..1.2e11, out of brute-force reach; IMP96325_Q2 stays OPEN, limited by real-Gram reach.',
});

export const IMP96344_VERDICT = Object.freeze({
  driftDegeneracyAlreadyResolved: true,
  openDegeneracyIsLineResolution: true,
  requiredSpanMarginalLogN: 9.998703544206851,
  requiredNmaxMarginal: 5499481.989660784,
  requiredNmaxClean: 120977208618.41339,
  syntheticRouteDecidesRealBand: false,
  conclusion:
    'identifiability is a Fourier-resolution question set by the conductor band WIDTH, not by sample size and not by a surrogate. The literal band-vs-smooth-drift degeneracy is already resolved (imp-96231); the open, span-limited degeneracy is resolving the discrete conductor lines q4/q5 (spacing 0.628), which needs L >= 2 pi / dw ~ 10 in log N (N ~ 5.5e6, marginal) to ~20 (N ~ 1.2e11, clean). A synthetic surrogate measures this required span but is circular for the real decision, so IMP96325_Q2 band-uniqueness stays OPEN, limited by real-Gram reach exactly as imp-96325 recorded.',
});

export const IMP96344_SUBGAP = Object.freeze({
  id: 'imp-96344-required-span-vs-surrogate-circularity',
  statement:
    'the log-N span required to resolve the adjacent conductor lines is measured (marginal L~10, N~5.5e6; clean L~20, N~1.2e11), but a synthetic surrogate cannot supply that identification for the REAL data: a surrogate generated under a chosen band/drift model recovers it by construction (circular). Deciding whether the real Route M d_N^2 carries a genuine arithmetic band still needs the actual Vasyunin Gram at N ~ 5.5e6..1.2e11, which is out of brute-force reach; the explicit-formula remainder-model route (IMP96325_SUBGAP) remains the only non-brute-force lever.',
});

export const IMP96344_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Model / measurement only: every value is a reproducible numeric from tmp/imp-96344-scratch.mjs / scratch2.mjs (drift-projection residual fractions and adjacent-tone overlaps) plus the analytic Rayleigh beat period 2 pi / (w_4 - w_5); no bound is claimed and no operator positivity is established.';

// imp-96462: plain SYNTHETIC-vs-REAL status separator, so a reader of this module
// (or a consumer viz such as imp-96378) does not mistake the closed-form overlap
// null for a statement about the real Route M spectrum.
export const IMP96344_SYNTHETIC_VS_REAL_NOTE =
  'SYNTHETIC vs REAL: every number on this page (the conductor tones w_4/w_5, the overlap curve, the beat '
  + 'period and required-N figures) comes from an assumed closed-form model of the conductor spectrum, not '
  + 'from the real Route M d_N^2 data. It answers a design/power question -- HOW MUCH log-N span would be '
  + 'needed to separate q=4 from q=5 if the real spectrum matches this model -- and cannot itself decide '
  + 'whether the real spectrum does. The REAL Route M question (does the actual Vasyunin Gram at '
  + 'N ~ 5.5e6..1.2e11 carry a genuine multi-conductor band) stays OPEN, out of brute-force reach '
  + '(IMP96325_Q2_BAND_UNIQUENESS).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96344_ASSERTIONS = [
  {
    id: 'imp96344-window-span-consistent',
    holds: () =>
      Math.abs((IMP96344_WINDOW.x1Current - IMP96344_WINDOW.x0) - IMP96344_WINDOW.spanCurrent) < 1e-12 &&
      Math.abs(IMP96344_WINDOW.x0 - Math.log(250)) < 1e-12 &&
      Math.abs(IMP96344_WINDOW.x1Current - Math.log(10000)) < 1e-12,
    why: 'x0 = log(250), x1 = log(1e4) and the current span is their difference (3.6889 in log N).',
  },
  {
    id: 'imp96344-drift-degeneracy-already-resolved',
    holds: () =>
      IMP96344_DRIFT_DEGENERACY.freeToneResidFracDeg2 > 0.9 &&
      IMP96344_DRIFT_DEGENERACY.bandResidFracDeg2 > 0.9 &&
      IMP96344_DRIFT_DEGENERACY.alreadyResolved === true,
    why: 'a pure conductor tone keeps >90 percent residual against the low-order smooth-drift basis even at the current span, consistent with imp-96231 rejecting smooth drift: the literal band-vs-drift degeneracy is not the open, span-limited one.',
  },
  {
    id: 'imp96344-beat-period-is-rayleigh-of-band-width',
    holds: () => {
      const beat = 2 * Math.PI / IMP96344_LINE_RESOLUTION.dwAdjacent;
      return Math.abs(beat - IMP96344_LINE_RESOLUTION.beatPeriodAdjacent) < 1e-9 &&
        Math.abs(IMP96344_CONDUCTORS.w4 - IMP96344_CONDUCTORS.w5 - IMP96344_LINE_RESOLUTION.dwAdjacent) < 1e-9;
    },
    why: 'the adjacent-line beat period equals 2 pi / (w_4 - w_5) exactly -- the Rayleigh resolution span of the observed conductor band width.',
  },
  {
    id: 'imp96344-current-span-under-one-beat',
    holds: () =>
      IMP96344_LINE_RESOLUTION.currentBeatFraction < 0.5 &&
      Math.abs(IMP96344_LINE_RESOLUTION.currentBeatFraction -
        IMP96344_WINDOW.spanCurrent / IMP96344_LINE_RESOLUTION.beatPeriodAdjacent) < 1e-9,
    why: 'the current span covers only 0.369 of one adjacent-line beat period, so the q4/q5 lines are unresolved -- the source of the open degeneracy.',
  },
  {
    id: 'imp96344-required-span-and-nmax',
    holds: () => {
      const NmaxMarg = Math.exp(IMP96344_WINDOW.x0 + IMP96344_REQUIRED_SPAN.marginal.spanLogN);
      const NmaxClean = Math.exp(IMP96344_WINDOW.x0 + IMP96344_REQUIRED_SPAN.clean.spanLogN);
      return Math.abs(NmaxMarg - IMP96344_REQUIRED_SPAN.marginal.Nmax) / NmaxMarg < 1e-9 &&
        Math.abs(NmaxClean - IMP96344_REQUIRED_SPAN.clean.Nmax) / NmaxClean < 1e-9 &&
        IMP96344_REQUIRED_SPAN.marginal.Nmax > 1e6 &&
        IMP96344_REQUIRED_SPAN.clean.Nmax > 1e11 &&
        IMP96344_REQUIRED_SPAN.marginal.Nmax > IMP96344_REQUIRED_SPAN.gramReach;
    },
    why: 'the marginal (N~5.5e6) and clean (N~1.2e11) required N follow from exp(x0 + required span) and both far exceed the ~1e4 brute-force Gram reach.',
  },
  {
    id: 'imp96344-aggregate-band-already-within-span',
    holds: () => {
      const beatBand = 2 * Math.PI / IMP96344_REQUIRED_SPAN.aggregateBand.dwBand;
      return Math.abs(beatBand - IMP96344_REQUIRED_SPAN.aggregateBand.beatPeriodBand) < 1e-9 &&
        beatBand < IMP96344_WINDOW.spanCurrent &&
        IMP96344_REQUIRED_SPAN.aggregateBand.alreadyWithinCurrentSpan === true;
    },
    why: 'the aggregate q3..q6 band width has beat period 2.84 < current span 3.69, so the band-as-a-whole is detectable now while its individual lines are not -- consistent with imp-96231.',
  },
  {
    id: 'imp96344-surrogate-circular-does-not-decide-real-band',
    holds: () =>
      IMP96344_SURROGATE_ASSESSMENT.canQuantifyRequiredSpan === true &&
      IMP96344_SURROGATE_ASSESSMENT.canDecideRealBand === false &&
      IMP96344_SURROGATE_ASSESSMENT.circular === true &&
      IMP96344_VERDICT.syntheticRouteDecidesRealBand === false,
    why: 'a synthetic surrogate can quantify the required span but is circular for the real decision (it recovers its own generative model), so band-uniqueness stays open, limited by real-Gram reach.',
  },
  {
    id: 'imp96344-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96344_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96344_HONEST_BANNER) &&
      /NO QED/.test(IMP96344_HONEST_BANNER) &&
      typeof IMP96344_SUBGAP.statement === 'string' &&
      /required-span-vs-surrogate-circularity/.test(IMP96344_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap that the required span is measured but a surrogate cannot decide the real band.',
  },
  {
    id: 'imp96344-synthetic-vs-real-note-present',
    holds: () =>
      /SYNTHETIC/.test(IMP96344_SYNTHETIC_VS_REAL_NOTE) &&
      /REAL/.test(IMP96344_SYNTHETIC_VS_REAL_NOTE) &&
      /OPEN/.test(IMP96344_SYNTHETIC_VS_REAL_NOTE) &&
      /5\.5e6/.test(IMP96344_SYNTHETIC_VS_REAL_NOTE) &&
      /1\.2e11/.test(IMP96344_SYNTHETIC_VS_REAL_NOTE),
    why: 'imp-96462: a plain status separator must exist so the synthetic closed-form finding is never read as a statement about the real Route M spectrum.',
  },
];

for (const a of IMP96344_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96344-route-m-synthetic-span-identifiability assertion failed: ${a.id}`);
  }
}

export default {
  window: IMP96344_WINDOW,
  conductors: IMP96344_CONDUCTORS,
  driftDegeneracy: IMP96344_DRIFT_DEGENERACY,
  lineResolution: IMP96344_LINE_RESOLUTION,
  requiredSpan: IMP96344_REQUIRED_SPAN,
  surrogateAssessment: IMP96344_SURROGATE_ASSESSMENT,
  verdict: IMP96344_VERDICT,
  subGap: IMP96344_SUBGAP,
  banner: IMP96344_HONEST_BANNER,
  syntheticVsRealNote: IMP96344_SYNTHETIC_VS_REAL_NOTE,
};

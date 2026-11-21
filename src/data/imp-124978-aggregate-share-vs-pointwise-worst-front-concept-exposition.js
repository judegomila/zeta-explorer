/**
 * @module imp-124978-aggregate-share-vs-pointwise-worst-front-concept-exposition
 * @fileoverview imp-124978 -- standalone Concepts exposition page for the general distinction
 *   between an AGGREGATE (average / share / proportion) statistic over an ensemble and a POINTWISE
 *   WORST-CASE (sup) statistic over the same ensemble, worked through the imp-97690
 *   sigmaDecayStep4LeverAssessment case: why the imp-33582 post-peak decay of the conditional share
 *   sigma(N) = E_coll/E(N) supplies no footing on the Step-4 G6/G6a/C_H pointwise Hoelder-1/2 shock
 *   modulus (imp-35147 C2 wrong-aggregation / C3 wrong-front). Import-light: no re-import of the
 *   16.7MB zeros bundle, lambda-roadmap.js, or glossary.js -- every number here is baked verbatim
 *   from the published imp-97690 field and cross-checked by the tripwire assertions below.
 *
 *   WHY A CONCEPT EXPOSITION (not another glossary headword)
 *   -----------------------------------------------
 *   imp-36225 already carries the imp-35147 C1-C6 classification as a glossary headword, and
 *   imp-97690 states the categoryMismatch inline in lambda-roadmap.js. Neither is the from-scratch,
 *   beginner-to-advanced "Concepts page" the concept-pages style calls for: this module builds the
 *   general aggregate-vs-pointwise distinction first (no assumed prior knowledge of sigma(N) or
 *   C_Lip), then specializes to the imp-97690 case as the worked advanced example.
 *
 *   STATUS: documentation only. Explains an already-published assessment (imp-97690) in plain terms
 *   with a physics analogy and a worked numeric example; establishes nothing new; moves no bound;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-97690 (sigmaDecayStep4LeverAssessment field in src/data/lambda-roadmap.js -- source
 *   assessment this exposition explains)
 * @see imp-36225 (glossary cross-reference note for the imp-35147 G6a weakerGapAssessment C1-C6
 *   classification, in src/data/glossary.js)
 * @see imp-95234 (cHEstimateFactorization: C_H = C_shock * C_Lip / 4, the pointwise factor sigma(N)
 *   never touches)
 *
 * Ticket: imp-124978 (content, low, sonnet-4-6). Documentation only; no bound change; NO QED;
 * no refereed bound is changed.
 */

const AGGREGATE_VS_POINTWISE_EXPOSITION = Object.freeze({
  slug: 'aggregate-energy-share-vs-pointwise-worst-front',
  intro:
    'A statistic computed by summing or averaging over an entire ensemble (an aggregate share) can ' +
    'shrink toward zero while a statistic computed at the single worst point of that same ensemble ' +
    '(a pointwise worst-case, or sup, bound) stays unbounded. The two live in different statistical ' +
    'categories, and no amount of decay in the first automatically buys any control over the second ' +
    '-- a classic wrong-aggregation trap when a bound of one type is mistaken for progress on a bound ' +
    'of the other.',
  levels: [
    {
      level: 'beginner',
      heading: 'An average can hide a single bad point',
      paragraphs: [
        'Suppose a classroom of 100 students takes a test, and 99 score 100% while one student ' +
        'scores 0%. The CLASS AVERAGE is 99% -- high, and it would stay high (in fact get even ' +
        'closer to 100%) if the classroom grew to 1000 students with the same single failing score. ' +
        'But the WORST score in the room is still 0%, completely unmoved by how large or small a ' +
        'share of the class that one student represents.',
        'An aggregate statistic (the average, or more generally any SHARE or PROPORTION of the whole) ' +
        'is computed by combining every point in the ensemble, so a single extreme point gets diluted ' +
        'down to whatever fraction of the total it occupies. A POINTWISE worst-case statistic looks ' +
        'at only the single most extreme point and ignores everyone else entirely. Shrinking the ' +
        'extreme point’s share of the total (by adding more well-behaved points, or by the share ' +
        'itself decaying for some other reason) says nothing about whether that one point is still bad.',
      ],
      example: {
        title: 'The classroom in numbers',
        text:
          'With 1 student at 0% and 99 at 100%, the average is 99.0%. With 1 student at 0% and 999 ' +
          'at 100%, the average rises to 99.9% -- an aggregate statistic that keeps improving. The ' +
          'worst score in the room is 0% in both cases: a pointwise statistic that does not move at all.',
        steps: [],
        result: 'A rising (or shrinking) aggregate share carries zero information about the worst point.',
        source: '',
      },
      math: [],
      details: [],
    },
    {
      level: 'intermediate',
      heading: 'Two distinct ways an aggregate bound fails to reach the worst point',
      paragraphs: [
        'Formalizing the beginner picture for an ensemble of N points x_1, ..., x_N with per-point ' +
        'values f(x_1), ..., f(x_N): an AGGREGATE share is something like the mean (1/N) * sum f(x_i), ' +
        'or more generally any ratio of a summed quantity to a total. A POINTWISE worst-case bound is ' +
        'instead sup_i f(x_i) -- the single largest value, however rare.',
        'There are two separate reasons an aggregate object cannot stand in for the pointwise sup, and ' +
        'both appear in the imp-35147 C1-C6 classification of candidate inputs for a two-point Hoelder ' +
        'modulus: a MEAN / AVERAGE bound (imp-35147 C2) is WRONG-AGGREGATION -- averaging is exactly the ' +
        'dilution mechanism from the classroom example, so a mean can be driven arbitrarily small by ' +
        'adding well-behaved points while the one bad point is untouched. A POSITIVE-PROPORTION bound ' +
        '(imp-35147 C3, "all but a shrinking fraction of points satisfy...") is WRONG-FRONT -- it is a ' +
        'statement that EXCLUDES the exceptional points by construction, so it is silent on exactly the ' +
        'single point a worst-case bound needs to control.',
        'Both failure modes leave the same gap: whatever the aggregate or majority statistic says, the ' +
        'single extremal point can still carry an unbounded (or at least uncontrolled) value, because ' +
        'neither statistic was ever built to see that one point.',
      ],
      example: null,
      math: [
        {
          tex: '\\text{mean} = \\tfrac{1}{N}\\sum_i f(x_i) \\quad\\text{vs.}\\quad \\text{worst} = \\sup_i f(x_i)',
          note: 'an aggregate (mean/share) statistic over the whole ensemble vs. the pointwise worst-case statistic',
        },
      ],
      details: [],
    },
    {
      level: 'advanced',
      heading: 'imp-97690: why the sigma(N) share decay is not a Step-4 lever',
      paragraphs: [
        'The Step-4 Polymath15 bridge needs a POINTWISE two-point Hoelder-1/2 shock modulus: ' +
        '|tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2} at EVERY pair x, x_prime, hence ' +
        'controlled at the single worst pair -- the nearest-pair shock front, where the spacing is ' +
        'smallest. The constant gating this bound factors as C_H = C_shock * C_Lip / 4 (imp-95234), ' +
        'and C_Lip is a Gronwall Jacobian that PROVABLY diverges as the nearest pair collides: ' +
        'C_Lip >= C_shock / (2 sqrt(W_1)) -> infinity as the minimal gap W_1 -> 0. This divergence ' +
        'lives entirely at the single worst-front point.',
        'imp-33582 separately tracks sigma(N) = E_coll / E(N), an AGGREGATE energy-share comparing the ' +
        'total collision energy to the whole assembled ensemble energy. This share peaks at ' +
        'sigma_max ~ 0.949 near N ~ 9.22e5, halves to ~0.4745 by N ~ 3.27e9, and falls below 0.1 only ' +
        'at N ~ 3.21e11: a genuine, if slow, post-peak decay.',
        'imp-97690 asks whether this decaying share supplies any quantitative lever on the Step-4 ' +
        'pointwise modulus, and the answer is NO, for exactly the two imp-35147 reasons above: sigma(N) ' +
        'is a mean-like aggregate ratio over the whole ensemble (the C2 wrong-aggregation category), so ' +
        'it dilutes the single worst-front point rather than bounding it; and it is computed on the ' +
        'ensemble as a whole rather than localized at the nearest-pair front (the C3 wrong-front ' +
        'category), so its decay never touches C_Lip, which is a purely local (front-only) quantity. ' +
        'A share shrinking from 0.949 toward 0.1 says nothing about whether C_Lip at the single worst ' +
        'pair is bounded or diverging -- both are simultaneously true in this case: the share decays ' +
        'AND C_Lip still provably blows up, because they are different statistics over different ' +
        'objects (whole-ensemble magnitude vs. single-front local geometry).',
        'A second, independent gap: sigma(N) is itself computed using the GUE-conditional bound ' +
        'C_mb <= 1 (imp-96093), so even its magnitude reading presupposes the very conditionality ' +
        '(imp-486) that a genuine Step-4 lever would need to be free of. The decaying share therefore ' +
        'confirms, rather than weakens, the existing GUE-conditional status.',
      ],
      example: {
        title: 'Reading the imp-97690 numbers against the C_Lip divergence',
        text:
          'Track the aggregate share sigma(N) down its post-peak ladder, and note at every rung it ' +
          'carries no information about C_Lip at the nearest-pair front.',
        steps: [
          'sigma_max ~ 0.949 at N ~ 9.22e5 (peak of the aggregate share)',
          'sigma ~ 0.4745 (half the peak) at N ~ 3.27e9',
          'sigma < 0.1 only at N ~ 3.21e11 (share has decayed an order of magnitude from peak)',
          'C_Lip >= C_shock / (2 sqrt(W_1)) -> infinity as the nearest gap W_1 -> 0, independent of N',
          'C_H = C_shock * C_Lip / 4 inherits the same unbounded divergence at the worst front',
        ],
        result:
          'The aggregate share sigma(N) decays monotonically while the pointwise factor C_Lip stays ' +
          'provably unbounded at the front: two statistics over different objects, neither constraining ' +
          'the other.',
        source: 'lambda-roadmap.js sigmaDecayStep4LeverAssessment (imp-97690)',
        level: 'advanced',
      },
      math: [
        {
          tex: '\\sigma(N) = E_{coll}/E(N), \\qquad C_H = C_{shock}\\,C_{Lip}/4, \\qquad C_{Lip} \\ge \\frac{C_{shock}}{2\\sqrt{W_1}} \\to \\infty \\;(W_1 \\to 0)',
          note: 'the aggregate share sigma(N) and the pointwise worst-front factor C_Lip are different statistics over different objects',
        },
      ],
      details: [
        'sigma_max ~ 0.949 at N ~ 9.22e5; halved at N ~ 3.27e9; below 0.1 at N ~ 3.21e11 (imp-33582/imp-97690)',
        'C_Lip >= C_shock / (2 sqrt(W_1)) -> infinity as the nearest-pair gap W_1 -> 0 (imp-95234)',
        'imp-35147 C2 (wrong-aggregation: mean dilutes the worst point) + C3 (wrong-front: a share is silent at the exceptional point)',
        'sigma(N) itself rests on the GUE-conditional C_mb <= 1 (imp-96093 / imp-486): circular as an unconditional lever',
      ],
    },
  ],
  physicsAnalogy: {
    system: 'Average room temperature vs. a single hot ember',
    mapping: [
      'The whole-ensemble aggregate ratio sigma(N) = E_coll/E(N) = the average temperature of a room, ' +
        'measured by a thermometer that blends readings from every corner',
      'The decaying share (peak 0.949, falling toward 0.1) = the room slowly cooling on average as ' +
        'more cool air is mixed in',
      'The single nearest-pair shock front and its divergent C_Lip = one ember left glowing in a ' +
        'corner, its own temperature set by local physics, not by how much cool air surrounds it',
      'Needing a pointwise Hoelder bound at the worst front = needing to know the ember’s own ' +
        'temperature, which the room-average thermometer was never built to report',
    ],
    whereItBreaks:
      'A real room-average thermometer could in principle be replaced by enough local thermometers to ' +
      'catch the ember. Here the mismatch is sharper: C_Lip does not merely sit at an unmeasured high ' +
      'value, it is PROVABLY UNBOUNDED as the nearest pair collides (W_1 -> 0), a genuine blow-up, not ' +
      'just a large but finite reading a better average could eventually average away. No amount of ' +
      'global averaging, however fine-grained, bounds a quantity that diverges at a single point.',
  },
  whyItMatters:
    'The distinction tells a reader exactly why a published decay result (imp-33582’s sigma(N) ' +
    'post-peak decay) is a genuine, correctly-stated Step-5 diagnostic that nonetheless supplies no ' +
    'footing on the separate, still-open Step-4 bridge: the two are orthogonal statistics over ' +
    'different objects (whole-ensemble magnitude vs. single-front local geometry), not a weaker and a ' +
    'stronger version of the same claim.',
  pitfalls: [
    'Reading any decaying aggregate statistic (a mean, a share, a "fraction of points satisfying...") ' +
    'as automatic progress toward a pointwise worst-case bound it was never built to control.',
    'Conflating imp-35147 C2 (wrong-aggregation: an average dilutes the worst point) with C3 ' +
    '(wrong-front: a majority/proportion statement is silent about the exceptional point) -- they fail ' +
    'for different reasons, though both leave the same extremal point uncontrolled.',
    'Treating a decaying conditional share as weakening an existing conditional dependency (imp-486), ' +
    'when the share is itself computed under that same conditionality and so confirms it instead.',
  ],
  prerequisites: [
    'Mean / average of a finite set of values',
    'Supremum (worst-case, sup) of a finite set of values',
  ],
  mentions: ['imp-97690', 'imp-35147', 'imp-95234', 'imp-96093', 'imp-33582', 'imp-486', 'imp-36225'],
  furtherReading: [
    { label: 'imp-97690 (sigmaDecayStep4LeverAssessment, the source assessment)', route: null },
    { label: 'imp-36225 (imp-35147 C1-C6 glossary classification)', route: null },
  ],
  sources: [
    { label: 'lambda-roadmap.js sigmaDecayStep4LeverAssessment field', path: 'src/data/lambda-roadmap.js' },
    { label: 'glossary.js G6a weakerGapAssessment headword', path: 'src/data/glossary.js' },
  ],
  diagrams: [],
});

export const IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION = Object.freeze({
  id: 'imp-124978',
  proofSection: 'S-frontier',
  glosses: 'imp-97690',
  scopes: 'aggregate-energy-share vs pointwise-worst-front Concepts exposition (imp-35147 C2/C3 wrong-aggregation)',
  question:
    'What is the general distinction between an aggregate (mean/share) statistic and a pointwise ' +
    'worst-case (sup) statistic over the same ensemble, and how does it explain why the imp-33582 ' +
    'sigma(N) = E_coll/E(N) post-peak decay supplies no lever on the Step-4 pointwise Hoelder-1/2 ' +
    'shock modulus (imp-97690, imp-35147 C2/C3)?',
  exposition: AGGREGATE_VS_POINTWISE_EXPOSITION,
  anyBoundMoved: false,
  verdict:
    'CONCEPTS EXPOSITION ONLY (documentation, not a proof). Explains the aggregate-vs-pointwise ' +
    'distinction from scratch and works the imp-97690 case: sigma(N) decays (peak 0.949 at N ~ 9.22e5, ' +
    'to <0.1 at N ~ 3.21e11) while C_Lip stays provably unbounded at the nearest-pair front ' +
    '(C_Lip >= C_shock/(2 sqrt(W_1)) -> infinity), so the decay is no Step-4 lever (imp-35147 C2/C3). ' +
    'Establishes nothing new; no bound moved; G6a_shock_lipschitz remains OPEN; C_mb stays ' +
    'GUE-conditional (imp-486); NO QED. No refereed bound is changed.',
  citation:
    'imp-97690 (sigmaDecayStep4LeverAssessment, the assessment this exposition explains); imp-35147 ' +
    '(C1-C6 minimal-gap classification, C2/C3 cited here); imp-95234 (C_H = C_shock*C_Lip/4 ' +
    'factorization); imp-33582 (the sigma(N) post-peak decay measurement); imp-96093/imp-486 ' +
    '(GUE-conditional C_mb circularity).',
});

export default IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION_ASSERTIONS = [
  {
    id: 'imp124978-has-three-levels-beginner-to-advanced',
    why: 'The concept-pages style requires beginner-to-advanced levels, not a flat single-level note.',
    holds: () => {
      const levels = IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.exposition.levels;
      return (
        levels.length === 3 &&
        levels[0].level === 'beginner' &&
        levels[1].level === 'intermediate' &&
        levels[2].level === 'advanced'
      );
    },
  },
  {
    id: 'imp124978-has-physics-analogy-with-mapping-and-limit',
    why: 'The ticket explicitly asks for a physics analogy for the aggregate-vs-pointwise distinction.',
    holds: () => {
      const a = IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.exposition.physicsAnalogy;
      return !!a && a.mapping.length >= 3 && a.whereItBreaks.length > 0;
    },
  },
  {
    id: 'imp124978-advanced-worked-example-reproduces-sigma-numbers',
    why: 'The advanced level must work the actual imp-97690/imp-33582 numbers, not just describe them qualitatively.',
    holds: () => {
      const adv = IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.exposition.levels[2];
      const ex = adv.example;
      const joined = ex.steps.join(' ');
      return (
        !!ex &&
        /0\.949/.test(joined) &&
        /3\.27e9/.test(joined) &&
        /3\.21e11/.test(joined) &&
        /W_1/.test(joined)
      );
    },
  },
  {
    id: 'imp124978-names-both-c2-and-c3-defects',
    why: 'The ticket scopes this to the imp-35147 C2 (wrong-aggregation) AND C3 (wrong-front) pair, not just one.',
    holds: () => {
      const text = IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.exposition.levels
        .map((l) => l.paragraphs.join(' '))
        .join(' ');
      return /C2/.test(text) && /C3/.test(text) && /wrong-aggregation/.test(text) && /wrong-front/.test(text);
    },
  },
  {
    id: 'imp124978-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97690.',
    holds: () =>
      IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.anyBoundMoved === false &&
      /NO QED/.test(IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.verdict) &&
      IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION.glosses === 'imp-97690',
  },
];

for (const assertion of IMP124978_AGGREGATE_VS_POINTWISE_EXPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124978-aggregate-share-vs-pointwise-worst-front-concept-exposition assertion failed: ${assertion.id}`,
    );
  }
}

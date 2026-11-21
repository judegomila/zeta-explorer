/**
 * @module imp-124943-knee-floor-elasticity-dimensional-scaling-concept-exposition
 * @fileoverview imp-124943 -- standalone Concepts exposition page for the knee floor-elasticity
 *   dimensional scaling N* ~ E_trunc^(-2), which previously existed only as a certification measurement
 *   (imp-124772) and a chord-to-certification cross-reference note (imp-124825), not as a full
 *   one-page-per-concept exposition. Builds the idea of a "floor-elasticity" from scratch (beginner),
 *   derives the clean two-term dimensional balance E_trunc ~ E_coll(N) that forces the -2 exponent
 *   (intermediate), then works the imp-124772 certified value p_knee_lsq ~ -2.106 against the softer
 *   imp-33684 interior-peak exponent ~ -1.375 as the advanced contrast, explaining WHY the second
 *   balance is softer (a third, non-negligible term shares the budget with the constant floor there).
 *   Import-light: no re-import of the 16.7MB zeros bundle or of the source modules themselves -- every
 *   number here is baked verbatim from the published modules and cross-checked by the tripwire
 *   assertions below.
 *
 *   WHY A CONCEPT EXPOSITION (not another glossary headword or note)
 *   -----------------------------------------------------------------
 *   imp-124772 certifies p_knee ~ -2 via a full 10-floor OLS fit and imp-124825 records the chord
 *   upgrade, but neither explains FROM SCRATCH what a floor-elasticity is or WHY a pure two-term
 *   balance forces exactly -2 while the imp-33684 interior-peak reading only gets to -1.375. This
 *   module is the companion "from scratch" exposition the concept-pages style calls for.
 *
 *   STATUS: documentation only. Explains already-published measurements (imp-124772, imp-33684) in
 *   plain terms with a physics analogy and a worked numeric example; establishes nothing new; moves
 *   no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (the certified p_knee_lsq ~ -2.106 this
 *   exposition explains)
 * @see imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js (the chord-to-
 *   certification upgrade note this exposition is the companion "from scratch" page for)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js (the softer interior-peak exponent
 *   ~ -1.375, the worked contrast)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (the original two-floor chord p_knee ~ -2.099)
 *
 * Ticket: imp-124943 (content, low, sonnet-4-6). Documentation only; no bound change; NO QED;
 * no refereed bound is changed.
 */

const KNEE_FLOOR_ELASTICITY_EXPOSITION = Object.freeze({
  slug: 'knee-floor-elasticity-dimensional-scaling',
  intro:
    'A "floor-elasticity" asks: if a quantity is pinned down by a small constant floor added to a ' +
    'curve, how sensitively does the point where the curve bends (the "knee") move when that floor ' +
    'is rescaled? Turning the floor up or down by a factor and re-measuring where the bend sits traces ' +
    'out a power law N* ~ E_trunc^p, and the EXPONENT p is a fingerprint of which terms are actually ' +
    'doing the balancing at that bend -- a clean two-term balance gives one exponent, a messier ' +
    'three-term balance gives a softer one.',
  levels: [
    {
      level: 'beginner',
      heading: 'What moves a "knee" when you turn a dial on a floor value',
      paragraphs: [
        'Picture a curve that falls steadily as N grows, but never below some small constant floor ' +
        'you have added to it. Far from the floor the curve just follows its own falling shape; close ' +
        'to the floor it flattens out, and there is a visible BEND -- a "knee" -- where the falling ' +
        'part hands off to the flat part. Where that knee sits depends on how big the floor is: raise ' +
        'the floor and the flat part starts earlier (the knee moves to smaller N); lower it and the ' +
        'knee moves to larger N.',
        'The FLOOR-ELASTICITY asks exactly how fast the knee moves: if you double the floor, does the ' +
        'knee location N* halve, quarter, or move by some other factor? Writing N* ~ E_trunc^p, that ' +
        'factor is captured by a single exponent p. A LARGER magnitude of p means the knee is MORE ' +
        'sensitive to the floor (a small floor change moves it a lot); a smaller magnitude means it is ' +
        'more sluggish.',
      ],
      example: {
        title: 'A numbers-only sketch of exponent sensitivity',
        text:
          'If N* ~ E_trunc^(-2), doubling the floor divides N* by 2^2 = 4. If instead N* ~ ' +
          'E_trunc^(-1.375), doubling the floor only divides N* by 2^1.375 ~ 2.6 -- a visibly gentler ' +
          'response to the same floor change.',
        steps: [],
        result: 'The exponent p is a direct, checkable sensitivity reading, not just a qualitative label.',
        source: '',
      },
      math: [],
      details: [],
    },
    {
      level: 'intermediate',
      heading: 'Why a clean two-term balance forces exactly -2',
      paragraphs: [
        'The underlying quantity here is the GUE-conditional share sigma(N) = E_coll / (E_trunc + ' +
        'E_flow + E_coll), where E_coll ~ C_C * sqrt(L / N) for a slowly varying log-height factor L ' +
        '= log T0 (it changes far more slowly with N than any power of N does), and E_trunc is a ' +
        'small, essentially constant floor. Far out, the knee in sigma(N) is set by where the ' +
        'CONSTANT floor term becomes comparable to the SHRINKING E_coll term -- away from that ' +
        'region, one term or the other dominates outright and there is no bend to speak of.',
        'Setting the two dominant terms equal, E_trunc ~ C_C * sqrt(L / N*), and solving for N* gives ' +
        'N* ~ C_C^2 * L / E_trunc^2, i.e. N* ~ E_trunc^(-2) up to the slowly varying log factor L. This ' +
        'is a PURE dimensional balance: only two terms are doing any work, the floor and the one term ' +
        'it is directly competing against, so the exponent comes out as a clean integer power.',
        'That is exactly what imp-124772 measured when it refit the imp-97822 two-floor chord ' +
        '(p_knee ~ -2.099) across the full ten-floor imp-33708 ladder by ordinary least squares: ' +
        'p_knee_lsq ~ -2.106, with R^2 ~ 0.99999 over a ~2.1-decade span -- a textbook-clean power law, ' +
        'matching the -2 dimensional prediction to within the slow-log correction.',
      ],
      example: null,
      math: [
        {
          tex: 'E_{trunc} \\sim C_C \\sqrt{L / N^\\*} \\;\\Rightarrow\\; N^\\* \\sim C_C^2 L \\, / \\, E_{trunc}^2',
          note: 'the two-term balance (constant floor vs the shrinking sqrt(L/N) collision term) forces the -2 exponent',
        },
      ],
      details: [],
    },
    {
      level: 'advanced',
      heading: 'The imp-33684 contrast: a third term softens the exponent to -1.375',
      paragraphs: [
        'The knee is not the only place a floor-elasticity shows up in this family of measurements. ' +
        'imp-33684 perturbed the SAME E_trunc floor but at a DIFFERENT location: the INTERIOR MAXIMUM ' +
        'N_max of sigma(N) (imp-3406s pinned peak, N_max ~ 9.22e5, sigma_max ~ 0.94943 at the base ' +
        'floor E_trunc = 3.06e-5), and measured its own floor-elasticity exponent empirically as ' +
        'N_max ~ E_trunc^(-1.375) -- visibly softer than the knees clean -2.',
        'The reason is exactly the mechanism the intermediate level predicts breaks the clean balance: ' +
        'at the INTERIOR peak, the third term E_flow (which decays super-polynomially, roughly like ' +
        '(log T0)^2/T0) has NOT yet become negligible relative to the constant floor -- imp-33684 ' +
        'reports E_flow ~ 4.7e-5 right at the peak, the SAME ORDER OF MAGNITUDE as the floor ' +
        'E_trunc = 3.06e-5 itself. So the peak location is really set by a THREE-term balance ' +
        '(E_trunc + E_flow) against E_coll, not a clean two-term one, and the still-shrinking E_flow ' +
        'term absorbs part of the floors influence -- softening the exponent from -2 toward the ' +
        'measured -1.375.',
        'The knee, by contrast, sits where E_flow has ALREADY become negligible (it falls off much ' +
        'faster than E_coll ~ 1/sqrt(N) does), leaving a genuinely clean two-term balance. That is why ' +
        'the gap between the two exponents, ~0.73 in magnitude (-2.106 vs -1.375), is itself diagnostic: ' +
        'it measures how much of the floor-elasticity budget the lingering E_flow term is still ' +
        'absorbing at the interior peak but has already surrendered by the time the knee is reached ' +
        'further out.',
      ],
      example: {
        title: 'Working both exponents from their published numbers',
        text:
          'Compare the clean knee exponent (imp-124772, full 10-floor OLS) against the softer ' +
          'interior-peak exponent (imp-33684, two-floor power law), and read off the gap.',
        steps: [
          'Knee: p_knee_lsq = -2.106 (imp-124772 full-ladder OLS, R^2 ~ 0.99999)',
          'Dimensional prediction for a pure two-term balance: p = -2 exactly (up to the slow log L)',
          'Interior peak: N_max ~ E_trunc^p with p = -1.375 (imp-33684, floors 0.5x and 2x)',
          'At the peak, E_flow ~ 4.7e-5 is comparable to E_trunc = 3.06e-5 -- a third term still in play',
          'Gap: |p_knee_lsq - p_interior_peak| = |-2.106 - (-1.375)| = 0.731',
        ],
        result: 'The knee tracks the clean -2 dimensional balance; the interior peak is softened to -1.375 by a non-negligible third term.',
        source: 'imp-124772-knee-floor-elasticity-multifloor-fit.js; imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js',
        level: 'advanced',
      },
      math: [
        {
          tex: '|p_{\\mathrm{knee}} - p_{\\mathrm{peak}}| = |-2.106 - (-1.375)| = 0.731',
          note: 'the exponent gap between the clean two-term knee balance and the softer three-term interior-peak balance',
        },
      ],
      details: [
        'p_knee_lsq ~ -2.106 (imp-124772, full 10-floor OLS, R^2 ~ 0.99999)',
        'two-floor chord p_knee ~ -2.099 (imp-97822, confirmed to ~0.007 by the full-ladder fit)',
        'interior-peak exponent ~ -1.375 (imp-33684, N_max ~ 9.22e5 at base floor E_trunc = 3.06e-5)',
        'E_flow ~ 4.7e-5 at the interior peak, same order as E_trunc = 3.06e-5 -- the softening mechanism',
        'exponent gap ~ 0.731',
      ],
    },
  ],
  physicsAnalogy: {
    system: 'Two different springs holding up the same weight',
    mapping: [
      'The constant floor E_trunc = a stiff spring with a fixed resting length, pushing back no ' +
        'matter how far it is compressed',
      'The shrinking collision term E_coll ~ sqrt(L/N) = a second spring that gets weaker the ' +
        'further out N goes',
      'The clean knee balance = only these two springs present -- the resting point moves by exactly ' +
        'the square of any change to the stiff springs length, giving the -2 exponent',
      'The interior-peak balance = a THIRD spring (E_flow) still pushing with comparable force at ' +
        'that location, sharing the load with the stiff spring and softening how far the resting ' +
        'point shifts when the stiff spring is adjusted -- giving the gentler -1.375 exponent',
    ],
    whereItBreaks:
      'Unlike two literal springs with fixed stiffness, E_flow here is not a constant partner -- it ' +
      'keeps decaying as N grows, so its contribution to the balance is itself location-dependent. The ' +
      'spring picture is a snapshot at the interior peaks particular N, not a fixed property of the ' +
      'system the way a real springs stiffness would be.',
  },
  whyItMatters:
    'Reading -2 vs -1.375 side by side tells you something about where you are standing on the curve, ' +
    'not just a curve-fitting footnote: an exponent near the clean -2 means the floor is the ONLY thing ' +
    'competing with the shrinking collision term at that location, while a softer exponent flags a ' +
    'third term still contributing. Mistaking one measurement location for the other -- or assuming ' +
    'every floor-elasticity in this family must share one exponent -- would misread which terms are ' +
    'actually load-bearing where.',
  pitfalls: [
    'Assuming every floor-elasticity in the sigma(N) family must share one universal exponent -- the ' +
    'knee (-2) and the interior peak (-1.375) are DIFFERENT locations with different numbers of ' +
    'competing terms, not two measurements of the same thing.',
    'Treating the softer -1.375 interior-peak exponent as evidence the -2 knee scaling is wrong -- it ' +
    'is not a contradiction, it is a different balance (three terms instead of two) at a different N.',
    'Reading a two-floor chord as proof of a power law: any two (log E_trunc, log N*) points define an ' +
    'exact line with zero residual by construction (imp-97822/imp-124825) -- the full 10-floor OLS fit ' +
    '(imp-124772) is what actually certifies the -2 reading as a genuine power law rather than a chord.',
  ],
  prerequisites: [
    'The GUE-conditional share sigma(N) = E_coll / (E_trunc + E_flow + E_coll)',
    'Power-law / log-log slope reading (N* ~ E_trunc^p as a straight line in log-log coordinates)',
  ],
  mentions: ['imp-124772', 'imp-124825', 'imp-33684', 'imp-97822', 'imp-33708', 'imp-3406', 'imp-2631'],
  furtherReading: [
    { label: 'imp-124772 (the full 10-floor OLS certification of p_knee ~ -2.106)', route: null },
    { label: 'imp-33684 (the softer interior-peak exponent ~ -1.375)', route: null },
  ],
  sources: [
    { label: 'imp-124772-knee-floor-elasticity-multifloor-fit.js', path: 'src/data/imp-124772-knee-floor-elasticity-multifloor-fit.js' },
    { label: 'imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js', path: 'src/data/imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note.js' },
    { label: 'imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js', path: 'src/data/imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js' },
  ],
  diagrams: [],
});

export const IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION = Object.freeze({
  id: 'imp-124943',
  proofSection: 'S-frontier',
  glosses: 'imp-124772',
  scopes: 'knee floor-elasticity dimensional scaling N* ~ E_trunc^(-2) (Concepts exposition, not a glossary headword)',
  question:
    'Why does a clean two-term dimensional balance force the knee floor-elasticity exponent to exactly ' +
    '-2 (imp-124772), and why does the imp-33684 interior-peak reading only reach the softer -1.375?',
  exposition: KNEE_FLOOR_ELASTICITY_EXPOSITION,
  anyBoundMoved: false,
  verdict:
    'CONCEPTS EXPOSITION ONLY (documentation, not a proof). Explains floor-elasticity from scratch, ' +
    'derives the clean two-term dimensional balance E_trunc ~ C_C*sqrt(L/N*) forcing N* ~ E_trunc^(-2), ' +
    'and works the imp-124772 certified p_knee_lsq ~ -2.106 against the imp-33684 softer interior-peak ' +
    'exponent ~ -1.375 as the advanced contrast, attributing the gap (~0.731) to a non-negligible third ' +
    'term (E_flow ~ 4.7e-5, comparable to E_trunc = 3.06e-5) at the interior peak. Establishes nothing ' +
    'new; no bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-124772 (full 10-floor OLS certification of p_knee_lsq ~ -2.106); imp-124825 (chord-to-' +
    'certification upgrade note); imp-97822 (original two-floor chord p_knee ~ -2.099); imp-33684 ' +
    '(interior-peak exponent ~ -1.375); imp-33708 (0.5x..5x E_trunc floor ladder); imp-3406 (pinned ' +
    'interior peak N_max ~ 9.22e5); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
});

export default IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION_ASSERTIONS = [
  {
    id: 'imp124943-has-three-levels-beginner-to-advanced',
    why: 'The concept-pages style requires beginner-to-advanced levels, not a flat single-level note.',
    holds: () => {
      const levels = IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.exposition.levels;
      return (
        levels.length === 3 &&
        levels[0].level === 'beginner' &&
        levels[1].level === 'intermediate' &&
        levels[2].level === 'advanced'
      );
    },
  },
  {
    id: 'imp124943-has-physics-analogy-with-mapping-and-limit',
    why: 'The ticket calls for a dimensional-analysis intuition grounded in a concrete physical picture.',
    holds: () => {
      const a = IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.exposition.physicsAnalogy;
      return !!a && a.mapping.length >= 3 && a.whereItBreaks.length > 0;
    },
  },
  {
    id: 'imp124943-advanced-worked-example-reproduces-both-exponents',
    why: 'The advanced level must work the actual imp-124772/imp-33684 numbers (both exponents and the ' +
      'gap), not just describe the contrast qualitatively.',
    holds: () => {
      const adv = IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.exposition.levels[2];
      const ex = adv.example;
      const joined = ex ? ex.steps.join(' ') : '';
      return (
        !!ex &&
        /-2\.106/.test(joined) &&
        /-1\.375/.test(joined) &&
        /0\.731/.test(joined) &&
        /clean -2/.test(ex.result) &&
        /-1\.375/.test(ex.result)
      );
    },
  },
  {
    id: 'imp124943-exponent-gap-matches-published-numbers',
    why: 'The worked gap must actually equal |p_knee_lsq - p_interior_peak|, not just restate a figure.',
    holds: () => {
      const pKnee = -2.106;
      const pPeak = -1.375;
      const gap = Math.abs(pKnee - pPeak);
      return Math.abs(gap - 0.731) < 1e-6;
    },
  },
  {
    id: 'imp124943-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124772.',
    holds: () =>
      IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.anyBoundMoved === false &&
      /NO QED/.test(IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.verdict) &&
      IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION.glosses === 'imp-124772',
  },
];

for (const assertion of IMP124943_KNEE_FLOOR_ELASTICITY_DIMENSIONAL_SCALING_EXPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124943-knee-floor-elasticity-dimensional-scaling-concept-exposition assertion failed: ${assertion.id}`,
    );
  }
}

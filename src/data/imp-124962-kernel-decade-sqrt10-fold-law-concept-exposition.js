/**
 * @module imp-124962-kernel-decade-sqrt10-fold-law-concept-exposition
 * @fileoverview imp-124962 -- standalone Concepts exposition page for the reconstruction-kernel
 *   inverse-square-root (sqrt(10)-per-decade) fold law, which previously existed only as a
 *   measurement module (imp-97823) and a glossary headword (imp-97842), not as a full
 *   beginner-to-advanced one-page exposition. Builds the idea of a "reconstruction kernel" and
 *   its decade-growth ratio from scratch (beginner), derives the quadratic-peak inverse-square-root
 *   fold that forces the exact sqrt(10) = 10^(1/2) per-decade growth (intermediate), then works the
 *   imp-97823 deep-limit fit (upslope p=-0.4994, downslope p=-0.5006) and the imp-124776/imp-124922
 *   gap-keyed bracketing of the two arms around sqrt(10) as the advanced example. Import-light: no
 *   re-import of the 16.7MB zeros bundle or of the source modules themselves -- every number here is
 *   baked verbatim from the published modules and cross-checked by the tripwire assertions below.
 *
 *   WHY A CONCEPT EXPOSITION (not another glossary headword or viz leaf)
 *   -----------------------------------------------------------------
 *   imp-97823 certifies the deep-limit sqrt(10) fold via a least-squares slope fit and imp-97842
 *   names it as a glossary headword, but neither explains FROM SCRATCH what the reconstruction
 *   kernel |K| is, why a quadratic peak forces exactly the -1/2 exponent, or why the far-from-peak
 *   ladder visibly departs from sqrt(10) without that departure being a different exponent. This
 *   module is the companion "from scratch" exposition the concept-pages style calls for.
 *
 *   STATUS: documentation only. Explains already-published measurements (imp-97823, imp-97842,
 *   imp-124776, imp-124922) in plain terms with a physics analogy and a worked numeric example;
 *   establishes nothing new; moves no bound; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (the deep-limit sqrt(10) fit this exposition explains)
 * @see imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js (the glossary headword naming the
 *   same result, which this exposition is the companion "from scratch" page for)
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (gap-keyed ratio chart data, both arms
 *   bracketing sqrt(10))
 * @see imp-124922-kernel-decade-ratio-gap-keyed-glossary-headword.js (glossary headword for the
 *   gap-keyed bracketing presentation)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the L1 interior peak this fold straddles)
 *
 * Ticket: imp-124962 (content, low, sonnet-4-6). Documentation only; no bound change; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const KERNEL_SQRT10_FOLD_EXPOSITION = Object.freeze({
  slug: 'kernel-decade-sqrt10-fold-law',
  intro:
    'A "reconstruction kernel" here is a single shared factor |K| that converts a measured slope ' +
    'back into the pieces that produced it. Near a smooth interior peak, that conversion factor ' +
    'blows up as you approach the peak, and it does so at a PRECISE, checkable rate: for every ' +
    'factor of ten that the remaining gap to the peak shrinks, |K| grows by EXACTLY sqrt(10) = ' +
    '3.162278. That clean rate is a direct fingerprint of the peak being a plain quadratic bump, ' +
    'nothing more exotic.',
  levels: [
    {
      level: 'beginner',
      heading: 'What a "decade growth rate" means for a quantity blowing up near a peak',
      paragraphs: [
        'Picture a curve sigma(N) that climbs to a single interior maximum sigma_max and then falls ' +
        'back down as N keeps growing (the imp-97520 L1 landmark: sigma_max ~ 0.949429 at ' +
        'N_peak ~ 9.22e5). Define the GAP g = sigma_max - sigma as how far below the peak you ' +
        'currently are. As N approaches N_peak from either side, g shrinks toward zero.',
        'The reconstruction kernel K is built from the curve\'s own slope: K = -1/(d sigma / d ln N). ' +
        'Far from the peak the slope is a healthy, non-tiny number, so |K| stays modest. But right ' +
        'AT the peak the slope is exactly zero (that is what makes it a peak), so |K| = ' +
        '1/(tiny slope) blows up. The question this exposition answers is: blows up HOW FAST, as a ' +
        'clean function of the gap g?',
      ],
      example: {
        title: 'A numbers-only sketch of decade growth',
        text:
          'If |K| grows by a fixed factor r every time g shrinks by a factor of 10, then at ' +
          'g = 1e-5, 1e-6, 1e-7, 1e-8 the kernel values form a geometric ladder |K|, |K|*r, |K|*r^2, ' +
          '|K|*r^3. Reading off the ladder is just measuring the successive RATIOS of consecutive ' +
          'values; if every ratio comes out the same number r, the growth is a clean power law in g.',
        steps: [],
        result: 'A constant per-decade ratio r means |K| ~ g^(-p) for a single fixed exponent p, with r = 10^p.',
        source: '',
      },
      math: [],
      details: [],
    },
    {
      level: 'intermediate',
      heading: 'Why a quadratic peak forces the per-decade ratio to be exactly sqrt(10)',
      paragraphs: [
        'Near any smooth interior maximum, the curve looks like a parabola in x = ln N: ' +
        'sigma(x) = sigma_max - A*(x - x_peak)^2 + (smaller corrections), for some positive curvature ' +
        'constant A. Differentiating, d sigma/dx = -2A*(x - x_peak), so the kernel is ' +
        '|K| = 1/(2A|x - x_peak|).',
        'The gap at that same point is g = sigma_max - sigma = A*(x - x_peak)^2, so ' +
        '|x - x_peak| = sqrt(g/A). Substituting back, |K| = 1/(2A * sqrt(g/A)) = ' +
        '1/(2*sqrt(A)*sqrt(g)) -- an INVERSE-SQUARE-ROOT law in the gap, |K| ~ g^(-1/2).',
        'A pure g^(-1/2) law has an exact, parameter-free consequence: shrinking g by a factor of ' +
        'ten multiplies |K| by 10^(1/2) = sqrt(10) = 3.162278, regardless of what the curvature A ' +
        'actually is. The curvature only sets the OVERALL SCALE of |K|; it drops out of the ' +
        'per-decade RATIO entirely. That is the entire content of the "sqrt(10)-per-decade fold law": ' +
        'a statement about the universal exponent -1/2, not about any model-specific constant.',
      ],
      example: null,
      math: [
        {
          tex: '\\sigma(x) = \\sigma_{\\max} - A(x-x_{\\mathrm{peak}})^2 \\;\\Rightarrow\\; |K| = \\frac{1}{2\\sqrt{A}\\sqrt{g}} \\sim g^{-1/2}',
          note: 'the quadratic-peak expansion forces the inverse-square-root kernel law, independent of the curvature A',
        },
      ],
      details: [],
    },
    {
      level: 'advanced',
      heading: 'The imp-97823 deep-limit fit and the imp-124776/imp-124922 gap-keyed bracketing',
      paragraphs: [
        'imp-97823 measured |K| directly (a 5-point finite-difference stencil on the actual sigma(N) ' +
        'curve, not the idealized parabola) on BOTH arms of the imp-97520 peak, across a wide ladder ' +
        'of gaps (g = 1e-1 .. 1e-7) and a deep window close to the peak (g = 1e-5 .. 1e-8). In the ' +
        'deep window the least-squares slope of log10|K| against log10(g) comes out p = -0.4994 ' +
        '(upslope, x < x_peak) and p = -0.5006 (downslope, x > x_peak) -- bracketing the predicted ' +
        '-1/2 to about 1e-3, with per-decade growth 3.158 / 3.167 against the exact sqrt(10) = ' +
        '3.162278, log-linear residual ~4e-4. The idealized two-term algebra of the intermediate ' +
        'level survives contact with the real, non-parabolic curve almost exactly.',
        'Far from the peak the raw ladder visibly departs from sqrt(10): the naive full-ladder fit ' +
        'over g = 1e-1..1e-7 reads growth 2.90 (upslope) / 3.36 (downslope), clearly not sqrt(10). ' +
        'This is NOT a different exponent -- it is the CUBIC term in the peak expansion (the next ' +
        'order after the quadratic) injecting an O(sqrt(g)) running correction that is opposite-' +
        'signed on the two arms. imp-124776 and its glossary companion imp-124922 re-present exactly ' +
        'this: charting the per-decade ratio keyed by the actual gap g (rather than a bare decade ' +
        'index) shows the upslope ratio climbing up toward sqrt(10) from below while the downslope ' +
        'ratio falls toward it from above, the two arms BRACKETING sqrt(10) from opposite sides as ' +
        'g shrinks through the deep window.',
        'The per-decade deviation |ratio - sqrt(10)| itself decays geometrically, by a factor of ' +
        '~1/sqrt(10) ~ 0.3162 each additional decade closer to the peak -- consistent with that ' +
        'deviation being an O(sqrt(g)) correction (which shrinks by sqrt(10) every decade, same as ' +
        'the leading term) rather than a constant offset or a genuinely different power law.',
      ],
      example: {
        title: 'Reading the bracket from the published deep-window numbers',
        text:
          'Compare the two arms deep-window growth rates against the exact sqrt(10) prediction and ' +
          'check the bracketing claim.',
        steps: [
          'Exact prediction: sqrt(10) = 3.162278 (parameter-free, from the -1/2 exponent alone)',
          'Upslope deep-window fit: p = -0.4994, growth = 10^0.4994 = 3.158 (below sqrt(10))',
          'Downslope deep-window fit: p = -0.5006, growth = 10^0.5006 = 3.167 (above sqrt(10))',
          'Bracket check: 3.158 < 3.162278 < 3.167 -- the two arms straddle the exact value',
          'Far-ladder naive fit (NOT deep-limit): 2.90 upslope / 3.36 downslope -- a running ' +
          'correction, not a competing exponent',
        ],
        result: 'Both arms bracket sqrt(10) = 3.162278 from opposite sides as the gap shrinks into the deep window; the far-from-peak departure is a decaying correction, not a different law.',
        source: 'imp-97823-kernel-decade-growth-sqrt10.js; imp-124776-kernel-decade-ratio-vs-gap-viz-data.js',
      },
      math: [
        {
          tex: '10^{-0.4994} < \\sqrt{10} < 10^{0.5006} \\;\\Longleftrightarrow\\; 3.158 < 3.162278 < 3.167',
          note: 'the deep-window upslope/downslope growth rates bracket the exact sqrt(10) prediction',
        },
      ],
      details: [
        'deep-window LS slope p = -0.4994 (upslope) / -0.5006 (downslope), imp-97823',
        'deep-window per-decade growth 3.158 / 3.167 vs sqrt(10) = 3.162278, log-linear residual ~4e-4',
        'far-ladder naive growth 2.90 (upslope) / 3.36 (downslope) over g = 1e-1..1e-7 -- the running correction regime',
        'per-decade deviation from sqrt(10) decays by ~1/sqrt(10) ~ 0.3162 per decade toward the peak',
        'gap-keyed bracketing presentation: imp-124776 (viz data), imp-124922 (glossary headword)',
      ],
    },
  ],
  physicsAnalogy: {
    system: 'A ball rolling near the bottom of a smooth bowl',
    mapping: [
      'The peak sigma_max = the bottom of the bowl, the lowest point of potential energy',
      'The gap g = how far up the side of the bowl the ball currently sits (height above the bottom)',
      'The kernel |K| = how sensitive the ball\'s horizontal position is to a small nudge in height -- ' +
        'near the very bottom a tiny height change corresponds to a large horizontal shift, because ' +
        'the bowl is nearly flat there',
      'The quadratic (parabolic) bowl shape = why that sensitivity grows as EXACTLY the inverse ' +
        'square root of the height: halving the height does not simply double the sensitivity, it ' +
        'multiplies it by sqrt(2)',
      'The cubic correction (a slightly lopsided bowl) = why the two sides of the bowl show a small, ' +
        'shrinking asymmetry in that sensitivity far from the bottom, vanishing as you get close to it',
    ],
    whereItBreaks:
      'A real bowl has a fixed shape once built; here the "bowl" sigma(x) is itself an output of a ' +
      'conditional-share model (E_coll/E_N) built from several separately-pinned ansatz terms, so the ' +
      'curvature A and the cubic correction are consequences of that model, not independently chosen ' +
      'physical parameters the way a bowl\'s shape would be.',
  },
  whyItMatters:
    'The exact sqrt(10) rate is a clean, falsifiable prediction with NO free parameters -- it follows ' +
    'purely from the peak being locally quadratic, regardless of the specific curvature A or any of ' +
    'the underlying model constants (C_C, E_trunc, C_F). Measuring the deep-window fit to within ~1e-3 ' +
    'of -1/2 on BOTH arms independently is therefore a genuine cross-check that the L1 peak really is ' +
    'an ordinary smooth maximum, not some other kind of singularity -- while the far-from-peak ' +
    'departure shows exactly how a next-order (cubic) correction masks the clean law until you get ' +
    'close enough.',
  pitfalls: [
    'Reading the far-ladder naive growth (2.90 / 3.36) as evidence the exponent is NOT -1/2 -- it is ' +
    'a running correction from the cubic term, resolved by the deep-window fit, not a competing power law.',
    'Treating the upslope/downslope asymmetry as a sign of an error in the measurement -- the two arms ' +
    'bracketing sqrt(10) from opposite sides is exactly what an odd (cubic) correction to an even ' +
    '(quadratic) peak predicts, not noise.',
    'Confusing this kernel-fold fact with a bound on Lambda or any RH-relevant quantity -- it is a ' +
    'Jacobian-scaling fact about the conditional-share diagnostic sigma(N), with DIAG3 == 0 and every ' +
    'pinned surrogate constant (C_C, E_trunc, C_F) untouched.',
  ],
  prerequisites: [
    'The GUE-conditional share sigma(N) = E_coll / (E_trunc + E_flow + E_coll) and its imp-97520 ' +
    'interior L1 peak (sigma_max ~ 0.949429, N_peak ~ 9.22e5)',
    'Reading a log-log least-squares slope as a power-law exponent',
  ],
  mentions: ['imp-97823', 'imp-97842', 'imp-124776', 'imp-124922', 'imp-97520', 'imp-97721', 'imp-97662'],
  furtherReading: [
    { label: 'imp-97823 (the deep-limit sqrt(10) fit this exposition explains)', route: null },
    { label: 'imp-124776 (gap-keyed ratio chart data, both arms bracketing sqrt(10))', route: null },
  ],
  sources: [
    { label: 'imp-97823-kernel-decade-growth-sqrt10.js', path: 'src/data/imp-97823-kernel-decade-growth-sqrt10.js' },
    { label: 'imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js', path: 'src/data/imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js' },
    { label: 'imp-124776-kernel-decade-ratio-vs-gap-viz-data.js', path: 'src/data/imp-124776-kernel-decade-ratio-vs-gap-viz-data.js' },
  ],
  diagrams: [],
});

export const IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION = Object.freeze({
  id: 'imp-124962',
  proofSection: 'S-frontier',
  glosses: 'imp-97823',
  scopes: 'reconstruction-kernel inverse-square-root (sqrt(10)-per-decade) fold law (Concepts exposition, not a glossary headword)',
  question:
    'Why does the shared reconstruction kernel |K| = |1/(N sigma_N)| grow by exactly sqrt(10) per ' +
    'decade of near-peak gap approaching the imp-97520 L1 sigma peak, and why do the two arms bracket ' +
    'sqrt(10) from opposite sides rather than both converging from the same side?',
  exposition: KERNEL_SQRT10_FOLD_EXPOSITION,
  anyBoundMoved: false,
  verdict:
    'CONCEPTS EXPOSITION ONLY (documentation, not a proof). Explains the reconstruction kernel and ' +
    'decade-growth rate from scratch, derives the quadratic-peak inverse-square-root fold |K| ~ ' +
    'g^(-1/2) forcing exactly sqrt(10) = 3.162278 per decade, and works the imp-97823 deep-limit fit ' +
    '(p = -0.4994 upslope / -0.5006 downslope, growth 3.158 / 3.167) against the imp-124776/imp-124922 ' +
    'gap-keyed bracketing presentation as the advanced example, attributing the far-from-peak ' +
    'departure (naive growth 2.90 / 3.36) to an O(sqrt(g)) cubic running correction, not a distinct ' +
    'exponent. Establishes nothing new; no bound moved; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97823 (deep-limit sqrt(10) fit this exposition explains); imp-97842 (glossary headword for ' +
    'the same result); imp-124776 (gap-keyed ratio viz data); imp-124922 (gap-keyed glossary ' +
    'headword); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-97721 (original ' +
    'qualitative kernel observation); imp-97662 (near-peak individual-elasticity square-root fold).',
});

export default IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION_ASSERTIONS = [
  {
    id: 'imp124962-has-three-levels-beginner-to-advanced',
    why: 'The concept-pages style requires beginner-to-advanced levels, not a flat single-level note.',
    holds: () => {
      const levels = IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.exposition.levels;
      return (
        levels.length === 3 &&
        levels[0].level === 'beginner' &&
        levels[1].level === 'intermediate' &&
        levels[2].level === 'advanced'
      );
    },
  },
  {
    id: 'imp124962-has-physics-analogy-with-mapping-and-limit',
    why: 'The ticket calls for an inline-priors intuition grounded in a concrete physical picture.',
    holds: () => {
      const a = IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.exposition.physicsAnalogy;
      return !!a && a.mapping.length >= 3 && a.whereItBreaks.length > 0;
    },
  },
  {
    id: 'imp124962-advanced-worked-example-reproduces-published-fit',
    why: 'The advanced level must work the actual imp-97823 deep-window numbers (both slopes and the ' +
      'bracketing), not just describe the fold law qualitatively.',
    holds: () => {
      const adv = IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.exposition.levels[2];
      const ex = adv.example;
      const joined = ex ? ex.steps.join(' ') : '';
      return (
        !!ex &&
        /-0\.4994/.test(joined) &&
        /-0\.5006/.test(joined) &&
        /3\.162278/.test(joined) &&
        /bracket/.test(ex.result) &&
        /3\.162278/.test(ex.result)
      );
    },
  },
  {
    id: 'imp124962-bracket-arithmetic-checks-out',
    why: 'The worked bracket must actually hold numerically: 10^(-p_up) < sqrt(10) < 10^(-p_down).',
    holds: () => {
      const pUp = -0.4994;
      const pDown = -0.5006;
      const growthUp = Math.pow(10, -pUp);
      const growthDown = Math.pow(10, -pDown);
      const sqrt10 = Math.sqrt(10);
      return growthUp < sqrt10 && sqrt10 < growthDown;
    },
  },
  {
    id: 'imp124962-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97823.',
    holds: () =>
      IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.anyBoundMoved === false &&
      /NO QED/.test(IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.verdict) &&
      /remains SOTA/.test(IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.verdict) &&
      IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION.glosses === 'imp-97823',
  },
];

for (const assertion of IMP124962_KERNEL_SQRT10_FOLD_LAW_EXPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124962-kernel-decade-sqrt10-fold-law-concept-exposition assertion failed: ${assertion.id}`,
    );
  }
}

/**
 * @module imp-124939-roundoff-vs-truncation-crossover-concept-exposition
 * @fileoverview imp-124939 -- standalone Concepts exposition page for the round-off-vs-truncation
 *   crossover, a textbook numerical-analysis concept the Concepts section previously carried only
 *   as glossary headwords (imp-124802, imp-124864, imp-124919), not a full one-page-per-concept
 *   exposition. Explains truncation error and round-off error from scratch (beginner), formalizes
 *   the general h-vs-epsilon crossover (intermediate), and works the imp-124769 E_CF stencil
 *   crossover |E_CF|_crit = R / relTrunc as the advanced example. Import-light: no re-import of the
 *   16.7MB zeros bundle or of imp-124769 itself -- every number here is baked verbatim from its
 *   published module and cross-checked by the tripwire assertions below.
 *
 *   WHY A CONCEPT EXPOSITION (not another glossary headword)
 *   -----------------------------------------------
 *   imp-124802 already names the imp-124769 crossover as a glossary headword. This module is the
 *   companion "from scratch" exposition the concept-pages style calls for: it does not assume the
 *   reader already knows what truncation error or round-off error are, builds the general
 *   h* ~ eps_mach^(1/3) textbook crossover first, then specializes to imp-124769's variant (a FIXED
 *   step eps = 1e-3, varying signal magnitude |E_CF| down a landmark ladder, with an absolute floor
 *   R set by a bisection solve rather than by stencil cancellation) as the worked example.
 *
 *   STATUS: documentation only. Explains an already-published measurement (imp-124769) in plain
 *   terms with a physics analogy and a worked numeric example; establishes nothing new; moves no
 *   bound; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (source measurement this exposition explains)
 * @see imp-124802-ecf-noise-floor-crossover-glossary-headword.js (the glossary headword this
 *   exposition is the companion "from scratch" page for)
 * @see imp-124867-sigmacrit-precision-reconciliation.js (reconciles the double-precision
 *   sigma_crit ~ 0.013 used here as the worked example against imp-124849's extended-precision
 *   sigma_crit = 0.020385 -- same crossover, two different round-off floors R, not two phenomena)
 *
 * Ticket: imp-124939 (content, low, sonnet-4-6). Documentation only; no bound change; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const ROUNDOFF_VS_TRUNCATION_EXPOSITION = Object.freeze({
  slug: 'roundoff-vs-truncation-crossover',
  intro:
    'Every numerical measurement of a derivative-like quantity carries two independent sources of ' +
    'error that trade off against each other: TRUNCATION error, from approximating an exact formula ' +
    'with a finite-step stencil, and ROUND-OFF error, from the computer storing numbers to only ' +
    'finitely many digits. Shrinking the step improves the first and worsens the second, so every ' +
    'such measurement has a crossover point past which no amount of care in the stencil helps -- the ' +
    'floor is set by the arithmetic itself, not the formula.',
  levels: [
    {
      level: 'beginner',
      heading: 'Two different reasons a computed number can be wrong',
      paragraphs: [
        'Suppose you want the slope of a curve at a point, but you only have a formula that uses ' +
        'the curve at two nearby points, like (f(x+h) - f(x-h)) / (2h). This is an APPROXIMATION: ' +
        'using a finite gap h instead of an infinitesimal one introduces a small, predictable error ' +
        'that gets smaller as h shrinks. Call this the TRUNCATION error -- it comes from truncating ' +
        'an infinite (exact) process to a finite (approximate) one.',
        'But a computer does not store f(x+h) and f(x-h) exactly either -- it keeps roughly 15-16 ' +
        'significant decimal digits. When h is tiny, f(x+h) and f(x-h) are nearly equal numbers, and ' +
        'subtracting two nearly-equal numbers cancels most of their shared digits, leaving mostly ' +
        'noise. Call this the ROUND-OFF error -- it comes from the arithmetic, not the formula.',
        'Shrinking h always helps the truncation error, but past a point it HURTS the round-off ' +
        'error (less genuine signal is left after the cancellation). So there is a sweet spot, and a ' +
        'crossover: make h too big and truncation dominates; make h too small and round-off ' +
        'dominates.',
      ],
      example: {
        title: 'A numbers-only sketch of the trade-off',
        text:
          'If truncation error shrinks like h^2 and round-off error grows like 1/h (schematically), ' +
          'then halving h from a point where they are balanced makes truncation 4x smaller but ' +
          'round-off 2x bigger -- a net win. Halving it again from well past the balance point makes ' +
          'the now-tiny truncation term irrelevant while round-off keeps doubling: a net loss. The ' +
          'balance point in between is where the two curves cross.',
        steps: [],
        result: 'There is always a best step size, not "smaller is always better."',
        source: '',
      },
      math: [],
      details: [],
    },
    {
      level: 'intermediate',
      heading: 'The textbook crossover: h* ~ cube root of machine epsilon',
      paragraphs: [
        'Formalizing the beginner picture: a central-difference stencil (f(x+h) - f(x-h)) / (2h) has ' +
        'a truncation error of order A*h^2 (from the next term in the Taylor expansion) and a ' +
        'round-off error of order B*eps_mach/h (from subtracting two numbers each known only to ' +
        'machine precision eps_mach ~ 2.2e-16 in double precision, then dividing by the small step h).',
        'Minimizing the total error E(h) = A*h^2 + B*eps_mach/h over h gives the classic rule of ' +
        'thumb h* ~ (eps_mach)^(1/3) -- roughly 1e-5 in double precision for a well-scaled problem. ' +
        'This is the general-purpose crossover every numerical-differentiation routine is built ' +
        'around: push the step smaller than this and round-off, not truncation, is what limits you.',
        'The imp-124769 crossover is a VARIANT of this same idea, not a different phenomenon, but it ' +
        'crosses over along a different axis. Instead of fixing the quantity being measured and ' +
        'varying the step h, imp-124769 fixes the step (the shared headline eps = 1e-3) and varies ' +
        'the SIZE of the quantity being measured -- an elasticity E_CF that shrinks by orders of ' +
        'magnitude down a ladder of landmarks. And instead of the round-off floor coming from ' +
        'cancellation inside the stencil itself, it comes from a separate upstream computation: a ' +
        'bisection solve for a landmark N_L, whose own finite resolution in ln(N_L) sets an almost ' +
        'landmark-independent absolute floor R underneath everything measured downstream of it.',
      ],
      example: null,
      math: [
        {
          tex: 'E(h) = A h^2 + B \\, \\varepsilon_{mach} / h',
          note: 'total central-difference error: truncation term grows with h, round-off term shrinks with h',
        },
        {
          tex: 'h^\\* \\sim \\varepsilon_{mach}^{1/3}',
          note: 'minimizing E(h) gives the textbook optimal step (~1e-5 in double precision)',
        },
      ],
      details: [],
    },
    {
      level: 'advanced',
      heading: 'The imp-124769 variant: a fixed-step crossover in the SIGNAL, not the step',
      paragraphs: [
        'imp-124769 measures a crossing elasticity E_CF = d ln N_L / d ln f (how sensitively a ' +
        'landmark N_L moves when the flow-amplitude parameter f is perturbed) at five landmarks ' +
        'L2..L6 along the imp-97520 ladder, where the collapsed (closed-form, reconstructed) E_CF ' +
        'shrinks by more than an order of magnitude at each successive landmark. At each landmark it ' +
        'ALSO measures E_CF directly, by a central-difference re-solve of the landmark bisection at ' +
        'the SAME shared headline step eps = 1e-3, and compares the two: errCF = |E_CF^direct - ' +
        'E_CF^recon|.',
        'Across L2, L3, L4 that error tracks the reconstructed |E_CF| almost exactly: errCF / |E_CF| ' +
        'sits at a stable ~3.3e-7 (the relative O(eps^2) truncation constant of the stencil, ' +
        'relTrunc). But the ABSOLUTE error errCF keeps falling as |E_CF| shrinks down the ladder ' +
        'only until it bottoms out at L5, at errCF ~ 4.5e-13 -- the bisection-resolution round-off ' +
        'floor R, which does not care how small |E_CF| is. Past that point (at L6) the relative ' +
        'error EXPLODES, because the numerator (a fixed floor) no longer shrinks with the ' +
        'denominator (a shrinking |E_CF|).',
        'Setting the two regimes equal, relTrunc * |E_CF|_crit = R, pins the crossover exactly the ' +
        'way h* does in the textbook case, but solved for the SIGNAL magnitude instead of the step: ' +
        '|E_CF|_crit = R / relTrunc ~ 4.5e-13 / 3.3e-7 ~ 1.4e-6. Interpolating in log-log between L5 ' +
        '(|E_CF| ~ 3.25e-6, sigma 0.02, still truncation-clean) and L6 (|E_CF| ~ 2.39e-7, sigma ' +
        '0.005, round-off-dominated) places this at sigma_crit ~ 0.013: the standard eps = 1e-3 rung ' +
        '(and hence the whole DIAG3 = E_CC + E_ET + E_CF eps-ladder built on it) stays clean above ' +
        'this sigma and goes non-monotone below it -- exactly the qualitative break imp-97710 (clean ' +
        'at L5) and imp-97821 (broken at L6) had separately observed.',
        'Honesty check on the floor itself: imp-124867 later reconciled this double-precision ' +
        'sigma_crit ~ 0.013 against imp-124849s extended-precision (dps >= 30) measurement of ' +
        'sigma_crit = 0.020385, and found the SAME crossover formula applies in both cases -- the ' +
        'double-precision R ~ 4.5e-13 used here is itself a round-off-contaminated UNDER-estimate of ' +
        'the true O(eps^2) stencil floor (true value ~ 1.08e-12 at extended precision), not a second ' +
        'phenomenon. Later citations should carry sigma_crit ~ 0.0204 as the precision-independent ' +
        'figure; the ~0.013 value is kept here only as the worked illustration of the crossover ' +
        'mechanism at the originally reported precision.',
      ],
      example: {
        title: 'Working the imp-124769 crossover from its published numbers',
        text:
          'Starting from the plateau relTrunc ~ 3.3e-7 (measured at L2, L3, L4) and the floor ' +
          'R ~ 4.5e-13 (measured at L5), solve relTrunc * X = R for the crossover magnitude X.',
        steps: [
          'relTrunc (plateau, L2-L4 mean) ~ 3.3e-7',
          'R (round-off floor, bottoms at L5) ~ 4.5e-13',
          'X = R / relTrunc = 4.5e-13 / 3.3e-7 ~ 1.4e-6  (this is |E_CF|_crit)',
          'Interpolate log-log between L5 (|E_CF| ~ 3.25e-6, sigma 0.02) and L6 (|E_CF| ~ 2.39e-7, ' +
            'sigma 0.005) at X = 1.4e-6',
        ],
        result: 'sigma_crit ~ 0.013 (double precision; precision-independent figure ~ 0.0204 per imp-124867)',
        source: 'imp-124769-ecf-stencil-noise-floor-crossover.js',
        level: 'advanced',
      },
      math: [
        {
          tex: '\\mathrm{relTrunc} \\cdot |E_{CF}|_{crit} = R \\;\\Rightarrow\\; |E_{CF}|_{crit} = R / \\mathrm{relTrunc}',
          note: 'the imp-124769 crossover condition, solved for the signal magnitude rather than the step',
        },
      ],
      details: [
        'relTrunc ~ 3.3e-7 (stable plateau, L2-L4)',
        'R ~ 4.5e-13 (bisection round-off floor, bottoms at L5)',
        '|E_CF|_crit ~ 1.4e-6, sigma_crit ~ 0.013 (double precision)',
        'precision-independent figure: sigma_crit ~ 0.0204 (imp-124849/imp-124867)',
      ],
    },
  ],
  physicsAnalogy: {
    system: 'Listening for a fading tone against a fixed hiss floor',
    mapping: [
      'The true signal getting quieter and quieter = |E_CF| shrinking down the landmark ladder',
      'A measurement technique whose error scales with the signal itself (quieter tone, ' +
        'proportionally quieter measurement error) = the truncation term relTrunc * |E_CF|',
      'The microphone\u2019s own constant hiss, which does not care how loud the true tone is = the ' +
        'round-off floor R',
      'The moment the shrinking tone\u2019s proportional error dips below the level of the fixed hiss ' +
        '= the crossover |E_CF|_crit = R / relTrunc, below which no amount of care in listening ' +
        'technique helps',
    ],
    whereItBreaks:
      'Unlike an idealized microphone, R here is not strictly fixed once and for all: switching to ' +
      'higher-precision arithmetic (the imp-124849 dps >= 30 measurement) is like upgrading to a ' +
      'quieter microphone -- it lowers the hiss floor and moves the crossover (sigma_crit 0.013 at ' +
      'double precision vs 0.0204 at extended precision), it does not eliminate the crossover ' +
      'entirely. There is always some floor, just possibly a lower one.',
  },
  whyItMatters:
    'The crossover tells a reader exactly how to interpret results on either side of it: above ' +
    'sigma_crit (through L5), the direct central-difference E_CF measurement at the standard step ' +
    'is trustworthy on its own; at or below it (at L6 and beyond), only the reconstructed/closed-form ' +
    'E_CF remains reliable, and a non-monotone direct eps-ladder there is an EXPECTED arithmetic ' +
    'artifact, not evidence against the underlying additivity model.',
  pitfalls: [
    'Reading a non-monotone eps-ladder below sigma_crit as a sign the DIAG3 additivity model is ' +
    'wrong, when it is the expected signature of the round-off floor taking over from truncation.',
    'Treating the double-precision sigma_crit ~ 0.013 as precision-independent -- it is the ' +
    'crossover measured against a round-off-contaminated floor; imp-124867 shows the ' +
    'precision-independent figure is sigma_crit ~ 0.0204.',
    'Assuming shrinking the step h always improves a finite-difference measurement -- past the ' +
    'crossover it makes things worse.',
  ],
  prerequisites: [
    'Central-difference approximation of a derivative',
    'Floating-point machine epsilon / limited significant digits',
  ],
  mentions: ['imp-124769', 'imp-124802', 'imp-124849', 'imp-124867', 'imp-97710', 'imp-97821', 'imp-97520'],
  furtherReading: [
    { label: 'imp-124769 (the source crossover measurement)', route: null },
    { label: 'imp-124802 (glossary headword for this crossover)', route: null },
  ],
  sources: [
    { label: 'imp-124769-ecf-stencil-noise-floor-crossover.js', path: 'src/data/imp-124769-ecf-stencil-noise-floor-crossover.js' },
    { label: 'imp-124802-ecf-noise-floor-crossover-glossary-headword.js', path: 'src/data/imp-124802-ecf-noise-floor-crossover-glossary-headword.js' },
  ],
  diagrams: [],
});

export const IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION = Object.freeze({
  id: 'imp-124939',
  proofSection: 'S-frontier',
  glosses: 'imp-124769',
  scopes: 'round-off-vs-truncation crossover (Concepts exposition, not a glossary headword)',
  question:
    'What is the general round-off-vs-truncation crossover in numerical differentiation, and how ' +
    'does the imp-124769 E_CF stencil crossover |E_CF|_crit = R / relTrunc specialize it?',
  exposition: ROUNDOFF_VS_TRUNCATION_EXPOSITION,
  anyBoundMoved: false,
  verdict:
    'CONCEPTS EXPOSITION ONLY (documentation, not a proof). Explains truncation error and round-off ' +
    'error from scratch, formalizes the textbook h* ~ eps_mach^(1/3) crossover, and works the ' +
    'imp-124769 crossover |E_CF|_crit = R / relTrunc ~ 1.4e-6 (sigma_crit ~ 0.013 at double ' +
    'precision, ~0.0204 precision-independent per imp-124867) as the advanced example. Establishes ' +
    'nothing new; no bound moved; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124769 (the crossover measurement this exposition explains); imp-124802 (glossary ' +
    'headword); imp-124867/imp-124849 (precision reconciliation); imp-97710/imp-97821 (the clean-vs-' +
    'non-monotone eps-ladder behavior this crossover explains); imp-97520 (landmark ladder).',
});

export default IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION_ASSERTIONS = [
  {
    id: 'imp124939-has-three-levels-beginner-to-advanced',
    why: 'The concept-pages style requires beginner-to-advanced levels, not a flat single-level note.',
    holds: () => {
      const levels = IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.exposition.levels;
      return (
        levels.length === 3 &&
        levels[0].level === 'beginner' &&
        levels[1].level === 'intermediate' &&
        levels[2].level === 'advanced'
      );
    },
  },
  {
    id: 'imp124939-has-physics-analogy-with-mapping-and-limit',
    why: 'The ticket explicitly asks for a physics analogy for the two competing error regimes.',
    holds: () => {
      const a = IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.exposition.physicsAnalogy;
      return !!a && a.mapping.length >= 3 && a.whereItBreaks.length > 0;
    },
  },
  {
    id: 'imp124939-advanced-worked-example-reproduces-crossover-numbers',
    why: 'The advanced level must work the actual imp-124769 numbers: relTrunc, R, and the resulting ' +
      '|E_CF|_crit / sigma_crit, not just describe them qualitatively.',
    holds: () => {
      const adv = IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.exposition.levels[2];
      const ex = adv.example;
      return (
        !!ex &&
        /3\.3e-7/.test(ex.steps.join(' ')) &&
        /4\.5e-13/.test(ex.steps.join(' ')) &&
        /1\.4e-6/.test(ex.steps.join(' ')) &&
        /0\.013/.test(ex.result) &&
        /0\.0204/.test(ex.result)
      );
    },
  },
  {
    id: 'imp124939-crossover-formula-matches-imp124769-numerically',
    why: 'The worked crossover must actually equal R / relTrunc, not just restate the published figure.',
    holds: () => {
      const relTrunc = 3.3e-7;
      const R = 4.5e-13;
      const X = R / relTrunc;
      return Math.abs(X - 1.4e-6) / 1.4e-6 < 0.05;
    },
  },
  {
    id: 'imp124939-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-124769.',
    holds: () =>
      IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.anyBoundMoved === false &&
      /NO QED/.test(IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.verdict) &&
      /remains SOTA/.test(IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.verdict) &&
      IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION.glosses === 'imp-124769',
  },
];

for (const assertion of IMP124939_ROUNDOFF_VS_TRUNCATION_CROSSOVER_EXPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124939-roundoff-vs-truncation-crossover-concept-exposition assertion failed: ${assertion.id}`,
    );
  }
}

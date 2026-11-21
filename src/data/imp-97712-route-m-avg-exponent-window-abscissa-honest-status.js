/**
 * @module imp-97712-route-m-avg-exponent-window-abscissa-honest-status
 *
 * imp-97712 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97687
 * finding -- the imp-97659 RESULT-2 average decay exponent ~10.18 for the Route M MCM gap-law
 * residual is window- and abscissa-dependent, and must be read as "faster than any fixed
 * 1/log^q, q<=3", NOT as a precisely determined constant.
 *
 * BACKGROUND. imp-97659 RESULT 2 fit an average decay exponent ~10.18 for the residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * by a log-log regression of |residual| against log(log p) over 11 deep dps=30 rungs
 * (p = 2e6 .. 9.9e7). imp-97687 stress-tested that number's stability.
 *
 * FINDING -- ROBUST WHERE IT MATTERS, BUT NOT A DETERMINED CONSTANT. Leave-one-out (jackknife)
 * over the 11 rungs keeps the exponent in a tight [9.985, 10.334] band (SE ~0.41) -- no single
 * rung manufactures the slope -- and a seeded 20000-draw bootstrap keeps the qualitative
 * "outruns every fixed power <= 3" conclusion at ~99.99%. But the point value itself is NOT
 * precisely determined: it depends on the p-range window (first six rungs give ~11.0, last six
 * give ~14.6) and on the abscissa/model choice -- ~10.18 against log(log p) (proper to the
 * 1/(log p)^q model) versus only ~0.62 against log p (a 1/p^s model). The bootstrap 95%
 * confidence band is wide, ~[8.2, 11.0].
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97687 IMP97687_VERDICT finding as a standalone indexable module (glossary/audit sweeps that
 * grep for honest-status modules by filename, per imp-36209's finding that inline-only corrections
 * are not reliably discoverable). Read-only record; changes no bound; establishes no operator
 * positivity; no RH verdict; NO QED. MCM stays refuted from omega=11 (imp-97432); b/4 ceiling
 * untouched; kappa_arith unchanged; no refereed bound is changed.
 *
 * @see imp-97687-route-m-avg-exponent-robustness.js (the jackknife/bootstrap/window/abscissa finding this note records)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (the deep dps=30 ladder; original ~10.18 exponent)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 * @see imp-36209 (honest-status modules must be standalone-indexable by filename grep)
 */

const HEADLINE_EXPONENT = 10.18;
const LOO_MIN = 9.985;
const LOO_MAX = 10.334;
const JACKKNIFE_SE = 0.41;
const BOOTSTRAP_CI_LOW = 8.2;
const BOOTSTRAP_CI_HIGH = 11.0;
const BOOTSTRAP_FRAC_EXCEEDS_THREE = 0.9999;
const P_RANGE_FIRST6 = 11.0;
const P_RANGE_LAST6 = 14.6;
const ABSCISSA_LOG_LOG_P = 10.18; // 1/(log p)^q model
const ABSCISSA_LOG_P = 0.62;      // 1/p^s model
const MCM_REFUTED_FROM_OMEGA = 11;

export const IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS = {
  id: 'imp-97712',
  proofSection: 'audit',
  question:
    'Is the imp-97659 RESULT-2 average decay exponent ~10.18 a precisely determined constant, or ' +
    'does it depend on the p-window and the abscissa/model choice?',
  verdictShort:
    `NOT A DETERMINED CONSTANT. Leave-one-out keeps the exponent in [${LOO_MIN}, ${LOO_MAX}] and the ` +
    `bootstrap "outruns power <= 3" conclusion holds ~${BOOTSTRAP_FRAC_EXCEEDS_THREE * 100}% of the time, ` +
    `but the value swings ~${P_RANGE_FIRST6} to ~${P_RANGE_LAST6} across p-windows and is ` +
    `${ABSCISSA_LOG_LOG_P} against log(log p) versus only ${ABSCISSA_LOG_P} against log p. Read as ` +
    '"faster than any fixed 1/log^q, q<=3", not as a determined exponent.',
  headlineExponent: HEADLINE_EXPONENT,
  jackknifeMin: LOO_MIN,
  jackknifeMax: LOO_MAX,
  jackknifeSE: JACKKNIFE_SE,
  bootstrapCI95: [BOOTSTRAP_CI_LOW, BOOTSTRAP_CI_HIGH],
  bootstrapFractionExceedsThree: BOOTSTRAP_FRAC_EXCEEDS_THREE,
  pRangeFirst6: P_RANGE_FIRST6,
  pRangeLast6: P_RANGE_LAST6,
  abscissaLogLogP: ABSCISSA_LOG_LOG_P,
  abscissaLogP: ABSCISSA_LOG_P,
  robustToLeaveOneOut: true,
  robustBootstrapConclusion: true,
  isPreciseConstant: false,
  dependsOnPRange: true,
  dependsOnAbscissaModel: true,
  mcmRefutedFromOmega: MCM_REFUTED_FROM_OMEGA,
  anyBoundMoved: false,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    `the imp-97687 IMP97687_VERDICT finding as a standalone module). The imp-97659 ~${HEADLINE_EXPONENT} ` +
    `average decay exponent is robust where it matters -- leave-one-out keeps it in [${LOO_MIN}, ${LOO_MAX}] ` +
    `and a 20000-draw bootstrap keeps the "outruns every fixed power <= 3" conclusion at ` +
    `~${BOOTSTRAP_FRAC_EXCEEDS_THREE * 100}% -- but it is NOT a precise constant: it swings ` +
    `~${P_RANGE_FIRST6} to ~${P_RANGE_LAST6} across p-windows and is ${ABSCISSA_LOG_LOG_P} for the ` +
    `1/(log p)^q abscissa versus only ${ABSCISSA_LOG_P} for the 1/p^s abscissa, with a wide bootstrap ` +
    `95% band [${BOOTSTRAP_CI_LOW}, ${BOOTSTRAP_CI_HIGH}]. Read it as a coarse average trend confirming ` +
    '"faster than any fixed 1/log^q, q<=3", not as a determined exponent. MCM stays refuted from ' +
    `omega=${MCM_REFUTED_FROM_OMEGA} (imp-97432). Changes no bound; establishes no operator positivity; ` +
    'no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-97687-route-m-avg-exponent-robustness.js (IMP97687_VERDICT, the source finding this note ' +
    'records); imp-97659-route-m-gap-law-decay-extprec.js (the deep dps=30 ladder; original ~10.18 ' +
    'exponent); imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11).',
};

export const IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97712-jackknife-recorded-tight-and-above-three',
    description: 'leave-one-out band is recorded as tight and entirely above the power-3 threshold',
    holds: () =>
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.jackknifeMin > 3 &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.jackknifeMax -
        IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.jackknifeMin <
        0.6,
  },
  {
    id: 'imp97712-not-a-precise-constant',
    description: 'the exponent is recorded as NOT precisely determined -- depends on p-window and abscissa model',
    holds: () =>
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.isPreciseConstant === false &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.dependsOnPRange === true &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.dependsOnAbscissaModel === true &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.abscissaLogP < 3 &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.abscissaLogLogP > 3,
  },
  {
    id: 'imp97712-mcm-status-and-no-fix-honesty-gate',
    description: 'MCM stays refuted from omega=11, no bound moved, no fix, no QED, no refereed bound is changed',
    holds: () =>
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.mcmRefutedFromOmega === 11 &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.anyBoundMoved === false &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.fixApplied === false &&
      IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97712-route-m-avg-exponent-window-abscissa-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP97712_AVG_EXPONENT_WINDOW_ABSCISSA_HONEST_STATUS;

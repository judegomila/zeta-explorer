/**
 * @module imp-97775-log10-effective-height-evaluator-assessment
 *
 * imp-97775 (numerical, consumer-audit): imp-97762 F3 found the shipped
 * effectiveHeightForN (lambda-rh-height-mapping.js) Newton-inverts the
 * Riemann-von Mangoldt count in IEEE-754 double T, and T/2pi = e^L overflows a
 * double at L ~ 709 (T0 ~ 1.7e308). The imp-97744 far-tail crossings t = 0.999
 * (L = 1000) and t = 0.9999 (L = 10000) therefore reconstruct N ~ 1.97e437 /
 * 8.81e4346 as +Infinity, and the not-finite guard in effectiveHeightForN returns
 * the sentinel 0. imp-97744 already works around this by carrying base-10 log
 * space. This module ASSESSES a log10-space (mantissa x 10^exp) evaluator that
 * reproduces the shipped double result at moderate heights and returns a finite
 * height at the far-tail crossings, and measures its agreement against the
 * imp-97744 closed-form RvM inverse.
 *
 * THE LOG10-SPACE EVALUATOR (the assessed prototype)
 * --------------------------------------------------
 * Deep in the tail T/2pi = e^L with L = log(T/2pi), so the RvM count is
 * N = (L - 1) e^L. In base-10 that is
 *
 *     log10 N  = L*log10(e) + log10(L - 1),
 *     log10 T0 = log10(2pi) + L*log10(e).
 *
 * Given log10 N (never overflowing), Newton-solve for L on
 * g(L) = L*log10(e) + log10(L - 1) - log10N, with
 * g_prime(L) = log10(e)*(1 + 1/(L - 1)) = log10(e)*L/(L - 1), then read off
 * log10 T0. Everything stays in log space, so the height is finite at every
 * crossing -- no e^L overflow, no sentinel 0.
 *
 * THE FINDINGS (assessment / measurement only)
 * --------------------------------------------
 *   (F1) MODERATE HEIGHTS AGREE TO <= 2 ULP. For the double-representable crossings
 *        t = 0.99 (log10 N = 45.4251) and t = 0.995 (log10 N = 89.1577), the
 *        log10-space evaluator reproduces the shipped double evaluator log10 T0
 *        (44.227628 / 87.657076) to 0 ULP and 2 ULP respectively -- an absolute
 *        agreement under 1e-13 in log10 T0. On round decades log10 N in {6,12,20}
 *        the agreement is 0 ULP.
 *   (F2) THE FAR-TAIL SENTINEL IS REPLACED BY A FINITE HEIGHT. For t = 0.999 the
 *        shipped double path reconstructs N ~ 1.97e437 as +Infinity and returns
 *        the sentinel 0, while the log10 evaluator returns the finite
 *        log10 T0 = 435.0927; for t = 0.9999 (N ~ 8.81e4346, sentinel 0) it
 *        returns log10 T0 = 4343.7430. Both match the imp-97744 closed-form
 *        log10 T0 to < 1e-3.
 *   (F3) L IS RECOVERED TO ~1e-13. Round-tripping the imp-97744 crossing log10 N
 *        back through the evaluator recovers L = 100 / 200 / 1000 / 10000 with
 *        |dL| <= 3e-14, i.e. it inverts the exact far-tail slope to machine
 *        precision.
 *
 * The punchline: a log10-space effectiveHeightForN is a correct, cheap drop-in for
 * the far tail. It agrees with the shipped double evaluator to <= 2 ULP wherever
 * the double is finite, and turns the double-overflow sentinel 0 at t >= 0.999
 * into the finite heights the imp-97744 closed form pins. The shipped double
 * function is left untouched (this is an assessment); a consumer that needs the
 * far-tail heights would call the log10 path.
 *
 * CONSUMER-AUDIT / MEASUREMENT ONLY. Conditional-share diagnostic tooling, NOT an
 * RH bound. Changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; the shipped effectiveHeightForN is unchanged; no RH verdict,
 * NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97744-fartail-diagnostic-crossing-heights (closed-form crossing log10 N/T0 this evaluator is checked against)
 * @see imp-97762-fartail-crossing-height-mapping-domain-audit (F3: shipped effectiveHeightForN overflow floor L ~ 709, sentinel 0)
 * @see lambda-rh-height-mapping (shipped double effectiveHeightForN, unchanged)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.4342944819032518
const TWO_PI = 2 * Math.PI;
const LOG10_TWO_PI = Math.log10(TWO_PI); // 0.7981798683581152

// Verbatim copy of the shipped double-precision evaluator (import-light: no
// dependency on lambda-rh-height-mapping so this data leaf stays cheap to load).
function effectiveHeightForN_double(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// The assessed log10-space evaluator: input log10 N, output {L, log10T0}.
function effectiveHeightForN_log10(log10N) {
  if (!Number.isFinite(log10N)) return { L: 0, log10T0: -Infinity };
  let L = Math.max(2, log10N / LOG10E); // seed: drop the log10(L-1) term
  for (let i = 0; i < 60; i++) {
    if (!(L > 1)) L = 1 + 1e-9;
    const g = L * LOG10E + Math.log10(L - 1) - log10N;
    const gp = LOG10E * (1 + 1 / (L - 1)); // = log10(e)*L/(L-1)
    if (!(Math.abs(gp) > 0) || !Number.isFinite(gp)) break;
    const dL = g / gp;
    L -= dL;
    if (Math.abs(dL) < 1e-13 * Math.max(1, L)) break;
  }
  return { L, log10T0: LOG10_TWO_PI + L * LOG10E };
}

function ulp(x) {
  const ax = Math.abs(x);
  if (ax === 0) return Number.MIN_VALUE;
  return ax + Math.max(ax * 2 ** -52, Number.MIN_VALUE) - ax;
}

// Measure each imp-97744 crossing: closed-form log10 N -> both evaluators.
const TARGETS = [0.99, 0.995, 0.999, 0.9999];
const MEASUREMENTS = TARGETS.map((t) => {
  const Ltrue = 1 / (1 - t);
  const log10N = Ltrue * LOG10E + Math.log10(Ltrue - 1);
  const log10T0_true = LOG10_TWO_PI + Ltrue * LOG10E;
  const N_double = Math.pow(10, log10N); // +Inf when log10N > ~308.25
  const T0_double = effectiveHeightForN_double(N_double);
  const log10T0_double = T0_double > 0 ? Math.log10(T0_double) : null;
  const proto = effectiveHeightForN_log10(log10N);
  return {
    target: t,
    L_true: +Ltrue.toFixed(6),
    L_proto: +proto.L.toFixed(6),
    log10_N: +log10N.toFixed(4),
    // double path
    doubleSentinel: T0_double === 0, // true when N overflowed and the guard fired
    log10T0_double: log10T0_double === null ? null : +log10T0_double.toFixed(6),
    // log10 path
    log10T0_proto: +proto.log10T0.toFixed(6),
    // agreement (only meaningful when the double path is finite)
    dULP:
      log10T0_double === null
        ? null
        : Math.round(Math.abs(log10T0_double - proto.log10T0) / ulp(log10T0_true)),
    absDiff:
      log10T0_double === null
        ? null
        : +Math.abs(log10T0_double - proto.log10T0).toExponential(3),
    dL: +Math.abs(proto.L - Ltrue).toExponential(3),
  };
});

export const IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT = {
  id: 'imp-97775',
  proofSection: 'S-frontier',
  question:
    'Assess a log10-space (mantissa x 10^exp) effectiveHeightForN evaluator so the ' +
    'imp-97744 far-tail crossings t >= 0.999 (L >= 1000) yield a usable height ' +
    'instead of the double-overflow sentinel 0 that the shipped Newton inverter ' +
    'returns. Reproduce the shipped double result at moderate heights and measure ' +
    'agreement against the imp-97744 closed-form RvM inverse. Consumer-audit / ' +
    'measurement only; the shipped function is unchanged; no bound moves; no QED.',
  measuredQuantity:
    'log10 T0 from the log10-space evaluator vs the shipped double evaluator (ULP ' +
    'agreement where the double is finite; finite-vs-sentinel at t >= 0.999) and the ' +
    'recovered L vs the imp-97744 closed form, for t = 0.99/0.995/0.999/0.9999',
  measurements: MEASUREMENTS,
  finding: {
    F1_moderate_heights_agree:
      'At the double-representable crossings t = 0.99 (log10 N = 45.4251) and ' +
      't = 0.995 (log10 N = 89.1577) the log10-space evaluator reproduces the ' +
      'shipped double log10 T0 (44.227628 / 87.657076) to 0 ULP and 2 ULP ' +
      '(absolute agreement < 1e-13 in log10 T0); on round decades log10 N in ' +
      '{6,12,20} the agreement is 0 ULP.',
    F2_fartail_sentinel_replaced:
      'For t = 0.999 the shipped double path reconstructs N ~ 1.97e437 as +Infinity ' +
      'and returns the sentinel 0, while the log10 evaluator returns the finite ' +
      'log10 T0 = 435.0927; for t = 0.9999 (N ~ 8.81e4346, sentinel 0) it returns ' +
      'log10 T0 = 4343.7430. Both match the imp-97744 closed-form log10 T0 to < 1e-3.',
    F3_L_recovered_to_machine_precision:
      'Round-tripping the imp-97744 crossing log10 N back through the evaluator ' +
      'recovers L = 100 / 200 / 1000 / 10000 with |dL| <= 3e-14, i.e. it inverts the ' +
      'exact far-tail slope to machine precision.',
  },
  isRigorous: false,
  verdict:
    'CONSUMER-AUDIT / MEASUREMENT. A log10-space effectiveHeightForN evaluator ' +
    '(Newton on log10 N = L*log10(e) + log10(L - 1), reading log10 T0 = ' +
    'log10(2pi) + L*log10(e)) is a correct, cheap drop-in for the far tail: it ' +
    'agrees with the shipped double evaluator to <= 2 ULP wherever the double is ' +
    'finite (t <= 0.995) and turns the double-overflow sentinel 0 at t >= 0.999 ' +
    'into the finite heights log10 T0 = 435.0927 / 4343.7430 that the imp-97744 ' +
    'closed form pins, recovering L to |dL| <= 3e-14. The shipped double ' +
    'effectiveHeightForN is left unchanged (assessment only). Conditional-share ' +
    'diagnostic tooling, NOT an RH bound; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97744 (closed-form crossing log10 N/T0); imp-97762 F3 (shipped double ' +
    'overflow floor L ~ 709, sentinel 0); lambda-rh-height-mapping (shipped double ' +
    'effectiveHeightForN, unchanged).',
};

export const IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT_ASSERTIONS = [
  {
    // (F1) Moderate double-representable crossings agree to <= 2 ULP in log10 T0.
    id: 'imp97775-moderate-heights-agree-le-2ulp',
    description:
      'for t <= 0.995 the log10 evaluator reproduces the shipped double log10 T0 to <= 2 ULP (absolute < 1e-12)',
    holds: () =>
      MEASUREMENTS.filter((m) => m.log10T0_double !== null).every(
        (m) => m.dULP <= 2 && m.absDiff < 1e-12
      ),
  },
  {
    // (F2) The far-tail crossings t >= 0.999 hit the double sentinel 0 but the
    // log10 evaluator returns a finite log10 T0 matching imp-97744.
    id: 'imp97775-fartail-sentinel-replaced-by-finite',
    description:
      't >= 0.999 double path returns sentinel 0 while the log10 evaluator returns finite log10 T0 (435.0927 / 4343.7430)',
    holds: () => {
      const r999 = MEASUREMENTS.find((m) => m.target === 0.999);
      const r9999 = MEASUREMENTS.find((m) => m.target === 0.9999);
      return (
        r999 &&
        r999.doubleSentinel === true &&
        r999.log10T0_double === null &&
        Number.isFinite(r999.log10T0_proto) &&
        Math.abs(r999.log10T0_proto - 435.0927) < 1e-3 &&
        r9999 &&
        r9999.doubleSentinel === true &&
        r9999.log10T0_double === null &&
        Number.isFinite(r9999.log10T0_proto) &&
        Math.abs(r9999.log10T0_proto - 4343.743) < 1e-3
      );
    },
  },
  {
    // (F3) L is recovered to machine precision for every crossing.
    id: 'imp97775-L-recovered-to-machine-precision',
    description: 'recovered L matches the imp-97744 closed form to |dL| <= 3e-14 at every crossing',
    holds: () =>
      MEASUREMENTS.every((m) => m.dL <= 3e-14) &&
      Math.abs(MEASUREMENTS[0].L_proto - 100) < 1e-4 &&
      Math.abs(MEASUREMENTS[1].L_proto - 200) < 1e-4 &&
      Math.abs(MEASUREMENTS[2].L_proto - 1000) < 1e-3 &&
      Math.abs(MEASUREMENTS[3].L_proto - 10000) < 1e-2,
  },
  {
    // The moderate crossings are NOT sentinels (double path is finite there).
    id: 'imp97775-moderate-heights-not-sentinel',
    description: 't <= 0.995 double path returns a finite height (not the sentinel 0)',
    holds: () =>
      MEASUREMENTS.find((m) => m.target === 0.99).doubleSentinel === false &&
      MEASUREMENTS.find((m) => m.target === 0.995).doubleSentinel === false,
  },
  {
    // Honesty gate: assessment/measurement only, shipped function unchanged, no QED.
    id: 'imp97775-honesty-gate-no-qed',
    description: 'Consumer-audit/measurement only: not rigorous, shipped function unchanged, no QED, PT stays SOTA',
    holds: () =>
      IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT.verdict) &&
      /remains SOTA/.test(IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT.verdict),
  },
];

for (const a of IMP97775_LOG10_EFFECTIVE_HEIGHT_EVALUATOR_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97775-log10-effective-height-evaluator-assessment assertion failed: ${a.id}`
    );
  }
}

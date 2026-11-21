/**
 * @module imp-97762-fartail-crossing-height-mapping-domain-audit
 *
 * imp-97762 (numerical, consumer-audit): assess how the imp-327
 * effectiveHeightForN / N_TO_T_STAR_TABLE (lambda-rh-height-mapping) behaves at the
 * imp-97744 far-tail crossing heights N ~ 2.66e45, 1.44e89, 1.97e437, 8.81e4346.
 *
 * imp-97744 pins those crossings with a closed-form RvM inverse (L = 1/(1 - t),
 * T0 = 2pi e^L, N = (L - 1) e^L) and @see-references lambda-rh-height-mapping, but
 * never checked whether those N exceed the tabulated imp-327 domain or how the
 * shipped effectiveHeightForN degrades that far out. This module runs the shipped
 * consumer directly and reports the outcome. MEASUREMENT / CONSUMER-AUDIT ONLY:
 * no bound moves, no operator positivity, imp-3066 K_a >= 0 untouched, NO QED.
 * No refereed bound is changed.
 *
 * WHAT THE SHIPPED CODE ACTUALLY IS
 * ---------------------------------
 * effectiveHeightForN(N) is NOT a table interpolation. It is a 40-step Newton
 * iteration against the exact Riemann-von Mangoldt asymptote
 * f(T) = (T/2pi)(log(T/2pi) - 1) - N, i.e. the same closed-form inverse imp-97744
 * uses, evaluated in IEEE-754 double precision. N_TO_T_STAR_TABLE is merely a
 * precomputed ladder of that function over N_LADDER = [2458 .. 1e8]; nothing in
 * the module ever interpolates or extrapolates a stored row. So "interpolation vs
 * closed-form asymptotic" resolves to: both the table and the crossing pins call
 * the SAME analytic inverse, and the only degradation possible is double-precision
 * overflow of e^L, not interpolation error.
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (F1) TABLE DOMAIN. The largest N in N_TO_T_STAR_TABLE is 1e8 (T* ~ 4.2654e7,
 *        log10 T* = 7.630). Every imp-97744 crossing height exceeds this: N ~ 2.66e45
 *        overshoots the tabulated ceiling by ~37 orders of magnitude, and N ~ 1.97e437
 *        by ~429. The table therefore covers NONE of the crossing heights; imp-97744
 *        correctly bypasses it and calls the analytic inverse directly.
 *
 *   (F2) AGREEMENT WHERE BOTH ARE DEFINED. For the two crossings that stay inside the
 *        double range (t = 0.99, L = 100, N ~ 2.66e45 and t = 0.995, L = 200,
 *        N ~ 1.44e89) effectiveHeightForN reproduces the imp-97744 closed-form T0 to
 *        machine precision: rel(T0) = 1.17e-16 at N ~ 2.66e45 (exactly 0 at N ~ 1.44e89),
 *        and the round trip zeroCountAtHeight(T) returns N to rel 2.38e-16 (0 at the
 *        second). This VALIDATES the imp-97744 RvM inverse against the shipped consumer:
 *        the two are the same map to within one ULP.
 *
 *   (F3) DOUBLE-PRECISION FLOOR. The closed-form N = (L - 1) e^L overflows IEEE-754
 *        double at L > ~709 (e^L > 1.7977e308), i.e. once log10 N exceeds ~308.25.
 *        The 0.999 crossing (L = 1000, log10 N = 437.29) and 0.9999 crossing
 *        (L = 10000, log10 N = 4346.94) are past this floor, so their N is already
 *        +Infinity as a double BEFORE it reaches effectiveHeightForN. The guard
 *        !Number.isFinite(N) then returns 0 -- a clean sentinel, NOT a silent wrong
 *        answer. In t-space the shipped double-precision consumer is usable up to
 *        t ~ 0.99859 (L ~ 709.78); the 0.99 and 0.995 rungs are inside, the 0.999
 *        and 0.9999 rungs are not.
 *
 *   (F4) NO EXTRAPOLATION ERROR. Because effectiveHeightForN never interpolates a
 *        stored row, there is no extrapolation error to report at N ~ 2.66e45: the
 *        relative error is pure floating-point (1.17e-16, F2), not an extrapolation
 *        artifact. imp-97744's use of base-10 log-space arithmetic (carrying mantissa
 *        x 10^exp) is exactly the workaround for the F3 overflow floor that the shipped
 *        double-precision effectiveHeightForN cannot cross.
 *
 * The punchline: the imp-327 table domain stops at N = 1e8 and never touches the
 * imp-97744 crossings; the shipped effectiveHeightForN agrees with imp-97744's
 * closed-form RvM inverse to one ULP wherever doubles hold (t <= 0.995), and returns
 * the sentinel 0 for the two crossings whose N overflows double (t >= 0.999). imp-97744
 * carrying log10 space is the correct handling of that overflow floor.
 *
 * MEASUREMENT / CONSUMER-AUDIT ONLY. Uses the shipped effectiveHeightForN /
 * zeroCountAtHeight and the imp-97744 closed-form RvM inverse; changes no bound,
 * establishes no positivity, adds no theorem; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see lambda-rh-height-mapping (imp-327: effectiveHeightForN Newton inverse, N_TO_T_STAR_TABLE)
 * @see imp-97744-fartail-diagnostic-crossing-heights (crossing pins N ~ 2.66e45 .. 8.81e4346)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (upstream diagnostic 1 - 1/log(T0/2pi))
 */

import {
  effectiveHeightForN,
  zeroCountAtHeight,
  N_TO_T_STAR_TABLE,
} from './lambda-rh-height-mapping.js';

const LOG10E = Math.LOG10E;
const TWO_PI = 2 * Math.PI;

// imp-97744 closed-form RvM inverse for a diagnostic target t: L = 1/(1 - t),
// T0 = 2pi e^L, N = (L - 1) e^L. Overflows double at L > ~709.
function closedFormCrossing(t) {
  const L = 1 / (1 - t);
  const T0 = TWO_PI * Math.exp(L);
  const N = (L - 1) * Math.exp(L);
  return { t, L, T0, N };
}

// Largest N the imp-327 table actually tabulates.
const TABLE_MAX_ROW = N_TO_T_STAR_TABLE[N_TO_T_STAR_TABLE.length - 1];
const TABLE_MAX_N = TABLE_MAX_ROW.N; // 1e8

// e^L overflow floor: the smallest L at which 2pi e^L exceeds Number.MAX_VALUE.
const L_OVERFLOW = Math.log(Number.MAX_VALUE); // ~709.782712893384
const T_OVERFLOW_LOG10N = Math.log10(Number.MAX_VALUE); // ~308.2547

// Run the shipped consumer at each imp-97744 crossing target and compare.
const CROSSING_AUDIT = [0.99, 0.995, 0.999, 0.9999].map((t) => {
  const c = closedFormCrossing(t);
  const finiteInDouble = Number.isFinite(c.N) && Number.isFinite(c.T0);
  const Tinv = effectiveHeightForN(c.N); // shipped Newton inverse
  const exceedsTableDomain = !(c.N <= TABLE_MAX_N); // true (or true via Infinity)
  let relErrT0 = null;
  let relErrRoundTrip = null;
  if (finiteInDouble && Tinv > 0) {
    relErrT0 = Math.abs(Tinv - c.T0) / c.T0;
    const Nback = zeroCountAtHeight(Tinv);
    relErrRoundTrip = Math.abs(Nback - c.N) / c.N;
  }
  return {
    target: t,
    L: +c.L.toFixed(6),
    log10_N: finiteInDouble ? +(c.L * LOG10E + Math.log10(c.L - 1)).toFixed(4) : Infinity,
    N_finite_in_double: finiteInDouble,
    exceeds_table_domain: exceedsTableDomain,
    effectiveHeightForN: Tinv, // 0 = sentinel for non-finite N
    rel_err_vs_closed_T0: relErrT0 === null ? null : +relErrT0.toExponential(3),
    rel_err_round_trip: relErrRoundTrip === null ? null : +relErrRoundTrip.toExponential(3),
    agrees_to_machine_precision: relErrT0 !== null && relErrT0 < 1e-15,
    degrades_to_sentinel: !finiteInDouble && Tinv === 0,
  };
});

export const IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT = {
  id: 'imp-97762',
  proofSection: 'S-frontier',
  question:
    'Do the imp-97744 far-tail crossing heights N ~ 2.66e45 .. 1.97e437 exceed the imp-327 ' +
    'N_TO_T_STAR_TABLE domain, and how does effectiveHeightForN (Newton on the RvM asymptote, ' +
    'double precision) degrade that far out relative to the imp-97744 closed-form RvM inverse?',
  measuredQuantity:
    'largest N in N_TO_T_STAR_TABLE (1e8); effectiveHeightForN(N) vs closed-form T0 = 2pi e^L ' +
    'and its round trip zeroCountAtHeight(T) at the four crossing targets t = 0.99/0.995/0.999/0.9999',
  tableMaxN: TABLE_MAX_N,
  tableMaxTStar: +TABLE_MAX_ROW.T_star.toFixed(4),
  tableMaxLog10TStar: +TABLE_MAX_ROW.log10_T.toFixed(4),
  doubleOverflowL: +L_OVERFLOW.toFixed(6),
  doubleOverflowLog10N: +T_OVERFLOW_LOG10N.toFixed(4),
  doubleOverflowT: +(1 - 1 / L_OVERFLOW).toFixed(6), // max usable t
  crossingAudit: CROSSING_AUDIT,
  finding: {
    F1_table_domain:
      'The largest N in N_TO_T_STAR_TABLE is 1e8 (T* ~ 4.2654e7, log10 T* = 7.630). All four ' +
      'imp-97744 crossings exceed it: N ~ 2.66e45 by ~37 orders of magnitude, N ~ 1.97e437 by ' +
      '~429. The table covers NONE of the crossing heights; imp-97744 bypasses it and calls the ' +
      'analytic inverse directly, which is the correct usage.',
    F2_agreement_where_defined:
      'For t = 0.99 (N ~ 2.66e45) and t = 0.995 (N ~ 1.44e89) effectiveHeightForN reproduces the ' +
      'imp-97744 closed-form T0 to machine precision: rel(T0) = 1.17e-16 at N ~ 2.66e45 (exactly ' +
      '0 at N ~ 1.44e89), round-trip rel(N) = 2.38e-16 (0 at the second). The shipped consumer ' +
      'and the imp-97744 RvM inverse are the same map to within one ULP.',
    F3_double_precision_floor:
      'The closed form N = (L - 1) e^L overflows IEEE-754 double at L > ~709.78 (log10 N > ~308.25). ' +
      'The 0.999 crossing (L = 1000, log10 N = 437.29) and 0.9999 crossing (L = 10000, log10 N = ' +
      '4346.94) are past the floor, so their N is already +Infinity as a double before reaching ' +
      'effectiveHeightForN; the !Number.isFinite(N) guard then returns 0 -- a clean sentinel, not a ' +
      'silent wrong answer. The shipped double-precision consumer is usable up to t ~ 0.99859.',
    F4_no_extrapolation_error:
      'effectiveHeightForN never interpolates a stored row (it Newton-solves the exact RvM asymptote), ' +
      'so there is no extrapolation error at N ~ 2.66e45: the 1.17e-16 relative error is pure ' +
      'floating point (F2). imp-97744 carrying base-10 log space (mantissa x 10^exp) is exactly the ' +
      'workaround for the F3 overflow floor that double-precision effectiveHeightForN cannot cross.',
  },
  isRigorous: false,
  verdict:
    'CONSUMER-AUDIT / MEASUREMENT (frontier-direction, NOT rigorous). The imp-327 N_TO_T_STAR_TABLE ' +
    'domain stops at N = 1e8 and touches none of the imp-97744 crossings; effectiveHeightForN is a ' +
    'Newton inverse of the same RvM asymptote imp-97744 uses (not a table interpolation), agreeing ' +
    'with the imp-97744 closed-form T0 to one ULP wherever doubles hold (t <= 0.995, rel <= 1.17e-16) ' +
    'and returning the sentinel 0 once N overflows double (t >= 0.999, log10 N > 308.25). imp-97744 ' +
    'carrying log10 space is the correct handling of that overflow floor. Changes no bound, ' +
    'establishes no positivity, adds no theorem; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'lambda-rh-height-mapping (imp-327 effectiveHeightForN / N_TO_T_STAR_TABLE); ' +
    'imp-97744 (crossing pins N ~ 2.66e45 .. 8.81e4346); imp-97723 (upstream diagnostic).',
};

export const IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT_ASSERTIONS = [
  {
    // (F1) The table domain ceiling is N = 1e8 and every crossing exceeds it.
    id: 'imp97762-table-domain-1e8',
    description: 'Largest N in N_TO_T_STAR_TABLE is 1e8 and all four crossings exceed it',
    holds: () =>
      TABLE_MAX_N === 1e8 &&
      CROSSING_AUDIT.every((r) => r.exceeds_table_domain === true),
  },
  {
    // (F2) The two in-range crossings agree with the closed-form T0 to machine precision.
    id: 'imp97762-in-range-machine-precision',
    description:
      't = 0.99 and t = 0.995 crossings: effectiveHeightForN matches the imp-97744 closed-form T0 to < 1e-15',
    holds: () => {
      const a = CROSSING_AUDIT.find((r) => r.target === 0.99);
      const b = CROSSING_AUDIT.find((r) => r.target === 0.995);
      return (
        a && b &&
        a.N_finite_in_double === true &&
        b.N_finite_in_double === true &&
        a.agrees_to_machine_precision === true &&
        b.agrees_to_machine_precision === true &&
        a.rel_err_vs_closed_T0 < 1e-15 &&
        b.rel_err_vs_closed_T0 <= 1e-15
      );
    },
  },
  {
    // (F3) The two deep crossings overflow double and degrade to the sentinel 0.
    id: 'imp97762-deep-crossings-sentinel',
    description:
      't = 0.999 and t = 0.9999 crossings: N overflows double, effectiveHeightForN returns the sentinel 0',
    holds: () => {
      const c = CROSSING_AUDIT.find((r) => r.target === 0.999);
      const d = CROSSING_AUDIT.find((r) => r.target === 0.9999);
      return (
        c && d &&
        c.N_finite_in_double === false &&
        d.N_finite_in_double === false &&
        c.degrades_to_sentinel === true &&
        d.degrades_to_sentinel === true
      );
    },
  },
  {
    // (F3) The double overflow floor sits between the 0.995 and 0.999 crossings.
    id: 'imp97762-overflow-floor-between-rungs',
    description: 'Double overflow floor log10 N ~ 308.25 lies between the 0.995 (89.16) and 0.999 (437.29) crossings',
    holds: () => {
      const b = CROSSING_AUDIT.find((r) => r.target === 0.995);
      return (
        b &&
        b.log10_N < T_OVERFLOW_LOG10N &&
        T_OVERFLOW_LOG10N < 437.29 &&
        Math.abs(L_OVERFLOW - 709.7827) < 1e-3
      );
    },
  },
  {
    // Honesty gate: consumer-audit only, no QED, no refereed bound is changed.
    id: 'imp97762-honesty-gate-no-qed',
    description: 'Consumer-audit/measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT.verdict),
  },
];

for (const a of IMP97762_FARTAIL_CROSSING_HEIGHT_MAPPING_DOMAIN_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97762-fartail-crossing-height-mapping-domain-audit assertion failed: ${a.id}`
    );
  }
}

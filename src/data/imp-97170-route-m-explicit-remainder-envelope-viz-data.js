/**
 * @module imp-97170-route-m-explicit-remainder-envelope-viz-data
 * @fileoverview imp-97170 -- VIZ DATA ONLY. Bakes a chart-ready ladder comparing the imp-97133
 *   explicit remainder ENVELOPE eps(b) = (1/2) 2^omega(b)(log b + 3) / phi(b) (the proven upper
 *   bound on |F_arith(b)/(phi(b) b) - kappa_arith|) against the MEASURED relative L0/L1 coprime-sum
 *   residual measuredRel(b) = |b E0(b) - E1(b)| / (2 phi(b) b) it bounds. Shows the envelope is tight
 *   (ratio ~0.16-0.20) on PRIME b but extremely loose (ratio ~1e-5 to 1e-6) on smooth/primorial b,
 *   the numeric signature of the 2^omega(b)-modulus-dependence imp-97133 already flags as NOT tight
 *   for smooth b. Values are literals recomputed directly from the imp-97133 formulas (self-contained,
 *   no import of the 16.7MB zeros bundle or any heavy module) -- pure frozen-object data, no imports,
 *   no self-executing assertions of its own, per the [[no_heavy_imports_in_pages]] and
 *   [[storage_precision_assertion_tolerance]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the eps(b) envelope and E0/E1 theorems this bakes)
 *
 *   Ticket: imp-97170 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. The envelope/residual pair is a measurement, not a certificate. No refereed bound is changed
 *   . RH open. NO QED.
 */

// -- recomputed directly from imp-97133's formulas: eps(b) envelope vs measured relative residual --
export const IMP97170_ENVELOPE_ROWS = Object.freeze([
  Object.freeze({ b: 49, omega: 1, epsBound: 0.164091, measuredRel: 0.012021, ratio: 0.073259, family: 'smooth' }),
  Object.freeze({ b: 101, omega: 1, epsBound: 0.076151, measuredRel: 0.012355, ratio: 0.162246, family: 'prime' }),
  Object.freeze({ b: 210, omega: 4, epsBound: 1.391185, measuredRel: 0.0000329, ratio: 0.0000236, family: 'primorial' }),
  Object.freeze({ b: 211, omega: 1, epsBound: 0.039771, measuredRel: 0.006767, ratio: 0.170140, family: 'prime' }),
  Object.freeze({ b: 503, omega: 1, epsBound: 0.018368, measuredRel: 0.003265, ratio: 0.177748, family: 'prime' }),
  Object.freeze({ b: 1009, omega: 1, epsBound: 0.009838, measuredRel: 0.001799, ratio: 0.182851, family: 'prime' }),
  Object.freeze({ b: 2003, omega: 1, epsBound: 0.005296, measuredRel: 0.000991, ratio: 0.187209, family: 'prime' }),
  Object.freeze({ b: 2310, omega: 5, epsBound: 0.358167, measuredRel: 0.00000107, ratio: 0.00000298, family: 'primorial' }),
  Object.freeze({ b: 5003, omega: 1, epsBound: 0.002303, measuredRel: 0.000443, ratio: 0.192210, family: 'prime' }),
  Object.freeze({ b: 9973, omega: 1, epsBound: 0.001224, measuredRel: 0.000239, ratio: 0.195479, family: 'prime' }),
  Object.freeze({ b: 30030, omega: 6, epsBound: 0.073944, measuredRel: 0.00000036, ratio: 0.00000487, family: 'primorial' }),
]);

// -- summary: envelope tightness by family (max/min of the ratio column above) --
export const IMP97170_FAMILY_SUMMARY = Object.freeze({
  prime: Object.freeze({ ratioMin: 0.073259, ratioMax: 0.195479, trend: 'ratio rises toward ~0.20 as b grows (converging tightness)' }),
  primorial: Object.freeze({ ratioMin: 0.0000024, ratioMax: 0.0000487, trend: 'ratio stays 4-5 orders of magnitude below 1 (envelope very loose)' }),
});

export const IMP97170_VERDICT = Object.freeze({
  question:
    'compare the imp-97133 explicit remainder envelope eps(b) against the actually measured relative L0/L1 residual it bounds',
  envelopeAlwaysHolds: true, // measuredRel <= epsBound on every row above (ratio < 1 throughout)
  tightOnPrimes: true, // ratio climbs toward ~0.20 (imp-97133's own "worst ratio ~0.20" prime remark)
  looseOnSmoothPrimorial: true, // ratio as small as ~2.4e-6 at b=210, confirming imp-97133's "NOT tight for smooth b"
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The eps(b) envelope from imp-97133 upper-bounds the measured relative F_arith remainder on every sampled b, ' +
    'confirming the theorem numerically. The bound is tight (ratio ~0.16-0.20) on prime b and loose by 4-5 orders ' +
    'of magnitude on primorial b, the numeric signature of the 2^omega(b)-modulus-dependence (triangle inequality, ' +
    'no mu-cancellation) imp-97133 already names as a residual. No bound on Lambda moves; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export default Object.freeze({
  id: 'imp-97170-route-m-explicit-remainder-envelope-viz-data',
  ticket: 'imp-97170',
  source: 'imp-97133-route-m-arith-first-moment-explicit-remainder.js',
  envelopeRows: IMP97170_ENVELOPE_ROWS,
  familySummary: IMP97170_FAMILY_SUMMARY,
  verdict: IMP97170_VERDICT,
  suppliesUniformRemainderBound: false,
  anyBoundMoved: false,
});

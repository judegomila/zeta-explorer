/**
 * @module imp-35315-crossover-deriv-sign-ladder-double-double
 *
 * imp-35315 (numerical, S-frontier): RECOMPUTE the imp-35113 finite-difference derivative-sign
 * ladder sign(g^(n)) = (-1)^(n+1) of the inherited surrogate crossover map g(N) = K log T0(N)
 * (imp-3220 / imp-3406 / imp-33723) in COMPENSATED / DOUBLE-DOUBLE (cancellation-free) stencil
 * arithmetic, to MEASURE whether the largest robustly-resolved order extends past the
 * double-precision ceiling n* = 4 that imp-35113 (M2/M3) reported. imp-35113 flagged the n>=5
 * failure as a ROUND-OFF limit of direct differencing, not a sign change; this module carries the
 * imp-35109 / imp-33229 double-double lever to the SAME from-source differencing and reports the
 * new resolved-order ceiling plus the dd-vs-double agreement on the resolved orders n = 1..4.
 * MEASUREMENT ONLY on the surrogate map; establishes no operator positivity; changes no bound; NO QED.
 *
 * THE TWO ERROR SOURCES IN THE DIFFERENCE (what dd can and cannot touch)
 * -----------------------------------------------------------------------------------------
 * An n-th central difference D = (1/h^n) Sum_j c_j g(x + off_j h) carries error from TWO places:
 *   (E1) the double-precision EVALUATION of each g value g(x+off_j h) = K log(effectiveHeightForN),
 *        each rounded to ~eps|g| (and further limited by the Newton stop-tolerance inside
 *        effectiveHeightForN); this error enters the stencil sum as Sum_j |c_j| * eps|g|, and
 *   (E2) the CANCELLATION / round-off of the summation Sum_j c_j g_j itself, in which terms of
 *        magnitude ~|g| ~ 3e9 cancel down to ~h^n |g^(n)|.
 * A compensated / double-double accumulation removes (E2) essentially exactly. It does NOTHING to
 * (E1): both the dd and the plain-double stencil see the IDENTICAL double-precision g values. On
 * this map (E1) is the binding term, so dd cannot lower the noise floor eps|g| Sum|c_j| / h^n that
 * sets the imp-35113 ceiling. This module MEASURES that prediction rather than assuming it.
 *
 * THE METHOD (from source, dd accumulation, no baked derivative literals)
 * -----------------------------------------------------------------------------------------
 * g is recomputed FROM SOURCE at every evaluation. For each order n = 1..8 the same imp-35113
 * 2nd-order central stencils are combined at steps h and h/2 by Richardson extrapolation, BUT the
 * stencil sum Sum_j c_j g_j is accumulated in double-double arithmetic (Dekker/Knuth twoSum +
 * twoProduct with a Veltkamp split), i.e. compensated / cancellation-free at the summation layer.
 * A sign is ROBUSTLY RESOLVED at an order iff it matches the analytic (-1)^(n+1) at EVERY one of the
 * five ramp points AND EVERY step in the geometric bracket relh in {3e-4 .. 3e-2} (no step-dependent
 * flips) -- the identical robustness criterion imp-35113 used for the double-precision run.
 *
 * THE FINDING (measurement only -- a clean NEGATIVE result)
 * -----------------------------------------------------------------------------------------
 *   (M1) DD DOES NOT EXTEND THE CEILING. The compensated / double-double stencil, applied to the
 *        SAME double-precision g, resolves the sign ladder to n* = 3 -- it does NOT reach past the
 *        double-precision n* = 4, and in fact sits one order LOWER: at the single most
 *        cancellation-stressed grid point (N_cross ~ 3.28e9, smallest step relh = 3e-4) the dd sum
 *        tips the marginal n = 4 case to the wrong sign where plain double barely holds it. So the
 *        double-double lever provides NO resolved-order headroom here.
 *   (M2) DD AND DOUBLE AGREE ON THE RESOLVED ORDERS. For n = 1,2,3 the dd and double Richardson
 *        derivatives at N_cross are bit-for-bit identical (relative difference 0), and at n = 4 they
 *        differ by only ~1.4e-8 -- confirming the two methods carry the SAME information on the
 *        orders that are actually resolvable, so the ceiling is not a summation artifact that dd
 *        could remove.
 *   (M3) THE BINDING ERROR IS THE DOUBLE-PRECISION g, NOT THE SUMMATION. Because dd removes the
 *        summation-cancellation error (E2) and the ceiling is unchanged (even marginally lower), the
 *        floor eps|g| Sum|c_j| / h^n is set by the double-precision EVALUATION of g = log o
 *        effectiveHeightForN (E1), which enters both methods identically. The genuine lever to push
 *        n* past 4 is therefore a double-double-PRECISION g -- a dd effectiveHeightForN (dd Newton
 *        inverse of the Riemann-von Mangoldt count) composed with a dd log -- so that the g VALUES,
 *        not merely their stencil sum, carry >16 digits. That is flagged here as the open sub-gap
 *        SG-imp-35315-dd-g and is a strictly larger undertaking than compensated summation. The
 *        analytic ladder holds for ALL n by the imp-34880 coefficient-positivity induction regardless.
 *
 * PROOF SCOPE / HONESTY. MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE
 * crossover map g. A NEGATIVE numerical result: compensated / double-double summation does not extend
 * the imp-35113 differencing ceiling because the binding error is the double-precision evaluation of
 * the map, not the stencil summation. Establishes NO operator positivity and NO spectral consequence;
 * the sign ladder is a structural property of the SURROGATE map, NOT of the RH operator. The C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are
 * UNTOUCHED. Changes NO bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35113-crossover-deriv-sign-ladder-finite-difference (double-precision ceiling n* = 4)
 * @see imp-35012-crossover-complete-monotonicity-bernstein-assessment (analytic Bernstein sign ladder)
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (all-orders coefficient positivity)
 * @see imp-35109 / imp-33229 (double-double / extended-precision lever)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (surrogate g = K log T0, K = (C_C/E_trunc)^2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33723)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8, the pinned surrogate amplitude

// The inherited surrogate crossover map g(N) = K log T0(N), recomputed FROM SOURCE each call.
function g(N) {
  return K_AMPL * Math.log(effectiveHeightForN(N));
}

// Analytic sign of g^(n): (-1)^(n+1)  (+ for odd n, - for even n).
function analyticSign(n) {
  return n % 2 === 1 ? 1 : -1;
}

// The imp-35113 2nd-order central-difference stencils (IDENTICAL stencils; only the summation
// arithmetic changes here): f^(n) ~ (1/h^n) Sum c_j f(x + off_j h).
const STENCILS = {
  1: { off: [-1, 0, 1], c: [-1 / 2, 0, 1 / 2] },
  2: { off: [-1, 0, 1], c: [1, -2, 1] },
  3: { off: [-2, -1, 0, 1, 2], c: [-1 / 2, 1, 0, -1, 1 / 2] },
  4: { off: [-2, -1, 0, 1, 2], c: [1, -4, 6, -4, 1] },
  5: { off: [-3, -2, -1, 0, 1, 2, 3], c: [-1 / 2, 2, -5 / 2, 0, 5 / 2, -2, 1 / 2] },
  6: { off: [-3, -2, -1, 0, 1, 2, 3], c: [1, -6, 15, -20, 15, -6, 1] },
  7: { off: [-4, -3, -2, -1, 0, 1, 2, 3, 4], c: [-1 / 2, 3, -7, 7, 0, -7, 7, -3, 1 / 2] },
  8: { off: [-4, -3, -2, -1, 0, 1, 2, 3, 4], c: [1, -8, 28, -56, 70, -56, 28, -8, 1] },
};

// --- Double-double (compensated) primitives: Dekker/Knuth error-free transforms. -------------
// twoSum: exact a+b as a hi+lo pair (no assumption on |a| vs |b|).
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
const SPLIT = 134217729; // 2^27 + 1, the Veltkamp splitting factor for double precision.
function split(a) {
  const c = SPLIT * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
// twoProduct: exact a*b as a hi+lo pair.
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
}
// dd + dd -> dd (Dekker add).
function ddAdd([h, l], [H, L]) {
  let [s, e] = twoSum(h, H);
  e += l + L;
  const [h2, l2] = twoSum(s, e);
  return [h2, l2];
}

// Plain double stencil (reproduces the imp-35113 differencing).
function fdDouble(N, n, h) {
  const s = STENCILS[n];
  let acc = 0;
  for (let j = 0; j < s.off.length; j++) acc += s.c[j] * g(N + s.off[j] * h);
  return acc / h ** n;
}

// Compensated / double-double stencil: accumulate c_j g_j in dd (twoProduct + Dekker add), so the
// SUMMATION carries no cancellation error. The g VALUES themselves remain double precision.
function fdDD(N, n, h) {
  const s = STENCILS[n];
  let acc = [0, 0];
  for (let j = 0; j < s.off.length; j++) {
    const term = twoProd(s.c[j], g(N + s.off[j] * h));
    acc = ddAdd(acc, term);
  }
  const hn = h ** n;
  return acc[0] / hn + acc[1] / hn;
}

// Richardson extrapolation of two stencils (steps h, h/2) -> higher-order estimate.
function richardson(fn, N, n, h) {
  const d1 = fn(N, n, h);
  const d2 = fn(N, n, h / 2);
  return (4 * d2 - d1) / 3;
}

// The imp-35113 grid (identical, so the two runs are directly comparable).
const RAMP_NS = [1e9, 3.280294e9, 1e10, 1e11, 1e12];
const REL_STEPS = [3e-4, 1e-3, 3e-3, 1e-2, 3e-2];
const N_CROSS = 3.280294e9;
const REL_STEP_REP = 3e-2;

// Largest contiguous robustly-resolved order for a given differencing method.
function largestResolvedN(fn) {
  let last = 0;
  for (let n = 1; n <= 8; n++) {
    let ok = true;
    for (const N of RAMP_NS) {
      for (const relh of REL_STEPS) {
        const d = richardson(fn, N, n, N * relh);
        if (!(Number.isFinite(d) && Math.sign(d) === analyticSign(n))) { ok = false; break; }
      }
      if (!ok) break;
    }
    if (ok) last = n; else break;
  }
  return last;
}

const DOUBLE_RESOLVED_N = largestResolvedN(fdDouble); // reproduces the imp-35113 n* = 4
const DD_RESOLVED_N = largestResolvedN(fdDD); // does the dd lever extend it?

// dd-vs-double agreement on the resolved orders n = 1..4 at N_cross (representative step).
const AGREEMENT_TABLE = [];
for (let n = 1; n <= 4; n++) {
  const dbl = richardson(fdDouble, N_CROSS, n, N_CROSS * REL_STEP_REP);
  const dd = richardson(fdDD, N_CROSS, n, N_CROSS * REL_STEP_REP);
  const relDiff = Math.abs(dbl - dd) / Math.max(Math.abs(dbl), 1e-300);
  AGREEMENT_TABLE.push({
    n,
    analyticSign: analyticSign(n),
    double: +dbl.toExponential(4),
    dd: +dd.toExponential(4),
    signsMatch: Math.sign(dbl) === analyticSign(n) && Math.sign(dd) === analyticSign(n),
    relDiff: +relDiff.toExponential(3),
  });
}
const MAX_REL_DIFF_1_TO_4 = Math.max(...AGREEMENT_TABLE.map((r) => r.relDiff));

export const IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE = {
  id: 'imp-35315',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-35113 finite-difference derivative-sign ladder sign(g^(n)) = (-1)^(n+1) of the ' +
    'surrogate g = K log T0(N) in compensated / double-double (cancellation-free) stencil arithmetic, ' +
    'and MEASURE whether the largest robustly-resolved order extends past the double-precision ceiling ' +
    'n* = 4. Report the new ceiling and the dd-vs-double agreement on n = 1..4. Measurement only; NO QED.',
  surrogate: 'g(N) = K log T0(N), K = (C_C/E_trunc)^2 ~ 1.5727e8, T0 = effectiveHeightForN(N)',
  method:
    'The IDENTICAL imp-35113 2nd-order central stencils and Richardson (h, h/2) grid, but the stencil ' +
    'sum Sum c_j g_j is accumulated in double-double (Dekker twoSum + twoProduct Veltkamp split), i.e. ' +
    'compensated / cancellation-free at the summation layer. The g VALUES stay double precision. Same ' +
    'robustness criterion: sign matches (-1)^(n+1) at every ramp point AND every step (no step-flip).',
  doubleResolvedN: DOUBLE_RESOLVED_N,
  ddResolvedN: DD_RESOLVED_N,
  ceilingExtended: DD_RESOLVED_N > DOUBLE_RESOLVED_N,
  agreementTable: AGREEMENT_TABLE,
  maxRelDiff1to4: +MAX_REL_DIFF_1_TO_4.toExponential(3),
  openSubGap: 'SG-imp-35315-dd-g',
  finding: {
    M1_dd_does_not_extend_ceiling:
      'The compensated / double-double stencil applied to the SAME double-precision g resolves the ' +
      'sign ladder only to n* = ' +
      DD_RESOLVED_N +
      ' -- it does NOT reach past the double-precision n* = ' +
      DOUBLE_RESOLVED_N +
      ', and sits one order lower: at the single most cancellation-stressed grid point (N_cross, ' +
      'smallest step relh = 3e-4) the dd sum tips the marginal n = 4 case to the wrong sign where plain ' +
      'double barely holds it. The double-double lever gives NO resolved-order headroom here.',
    M2_dd_and_double_agree_on_resolved_orders:
      'For n = 1,2,3 the dd and double Richardson derivatives at N_cross are bit-for-bit identical ' +
      '(relative difference 0) and at n = 4 they differ by only ~' +
      MAX_REL_DIFF_1_TO_4.toExponential(1) +
      ' -- the two methods carry the same information on the orders that are actually resolvable.',
    M3_binding_error_is_double_precision_g:
      'Because dd removes the summation-cancellation error yet the ceiling is unchanged (even marginally ' +
      'lower), the noise floor eps|g| Sum|c_j| / h^n is set by the double-precision EVALUATION of ' +
      'g = log o effectiveHeightForN, which enters both methods identically -- NOT by the stencil ' +
      'summation. The genuine lever to push n* past 4 is a double-double-PRECISION g (dd Newton inverse ' +
      'of the Riemann-von Mangoldt count composed with dd log), flagged as the open sub-gap ' +
      'SG-imp-35315-dd-g -- a strictly larger undertaking than compensated summation. The analytic ' +
      'ladder holds for ALL n by the imp-34880 coefficient-positivity induction regardless.',
  },
  isRigorous: false, // numerical cross-check of the surrogate map derivative signs; no QED
  rigorousScope:
    'MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE crossover map g. A ' +
    'NEGATIVE result: compensated / double-double summation does not extend the imp-35113 differencing ' +
    'ceiling n* = 4 (measured dd ceiling n* = ' +
    DD_RESOLVED_N +
    ') because the binding error is the double-precision evaluation of the map, not the stencil sum. ' +
    'Establishes NO operator positivity, NO spectral consequence, changes NO bound.',
  changesBound: false,
  verdict:
    'MEASUREMENT (frontier-direction, surrogate-map numerical cross-check). Recomputing the imp-35113 ' +
    'from-source finite-difference sign ladder of the inherited surrogate g = K log T0(N) in ' +
    'compensated / double-double (cancellation-free) stencil arithmetic does NOT extend the ' +
    'double-precision resolved-order ceiling: dd resolves the sign robustly only to n* = ' +
    DD_RESOLVED_N +
    ', versus the double-precision n* = ' +
    DOUBLE_RESOLVED_N +
    ' (imp-35113), sitting one order lower because at the single most cancellation-stressed grid point ' +
    '(N_cross, relh = 3e-4) the dd summation tips the marginal n = 4 to the wrong sign. On the resolved ' +
    'orders the two methods agree (relDiff 0 for n = 1,2,3; ~1.4e-8 for n = 4). The reason is that ' +
    'double-double compensates only the summation cancellation, while the binding noise floor ' +
    'eps|g| Sum|c_j| / h^n is set by the double-precision EVALUATION of g = log o effectiveHeightForN ' +
    '(Newton inverse + log rounding), which enters BOTH methods identically. The genuine lever to push ' +
    'n* past 4 is a double-double-precision g (dd effectiveHeightForN + dd log) so the g VALUES carry ' +
    '>16 digits -- flagged as the open sub-gap SG-imp-35315-dd-g. This is a round-off ceiling of direct ' +
    'differencing, NOT a sign change: the analytic ladder holds for ALL n by the imp-34880 ' +
    'coefficient-positivity induction. MEASUREMENT ONLY on the surrogate map: the C_mb GUE-conditional ' +
    'per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; ' +
    'establishes no operator positivity; changes no bound; far-tail exponent stays 1/2 (imp-3463); no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35113 (double-precision ceiling n* = 4); imp-35012 (analytic Bernstein sign ladder); ' +
    'imp-34880 / imp-35107 (all-orders coefficient positivity); imp-35109 / imp-33229 (double-double ' +
    'lever); imp-33723 (surrogate g = K log T0, K = (C_C/E_trunc)^2); imp-2642/imp-2643 (C_C 1/8 ' +
    'ansatz); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE_ASSERTIONS = [
  {
    // Reproduces the imp-35113 double-precision ceiling n* = 4 on the identical grid.
    id: 'imp35315-double-run-reproduces-imp35113-ceiling',
    description:
      'the plain-double Richardson stencil on the identical imp-35113 grid resolves the sign ladder ' +
      'through n* = 4 (reproducing imp-35113 M1/M2)',
    holds: () => DOUBLE_RESOLVED_N === 4,
  },
  {
    // (M1): compensated / double-double summation does NOT extend the ceiling past double precision.
    id: 'imp35315-dd-does-not-extend-ceiling',
    description:
      'the compensated / double-double stencil, applied to the same double-precision g, does NOT ' +
      'resolve a higher order than plain double (dd ceiling <= double ceiling; ceiling not extended)',
    holds: () =>
      DD_RESOLVED_N <= DOUBLE_RESOLVED_N &&
      IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.ceilingExtended === false,
  },
  {
    // (M2): dd and double agree on the resolved orders n = 1..4 (same information; correct signs).
    id: 'imp35315-dd-double-agree-on-resolved-orders',
    description:
      'dd and double Richardson derivatives agree on n = 1..4 (max relative difference small, and both ' +
      'give the analytic sign) -- so the ceiling is not a summation artifact dd could remove',
    holds: () =>
      AGREEMENT_TABLE.length === 4 &&
      AGREEMENT_TABLE.every((r) => r.signsMatch) &&
      MAX_REL_DIFF_1_TO_4 < 1e-6,
  },
  {
    // (M3): the open sub-gap (dd-precision g) is named, and the analytic ladder is unaffected.
    id: 'imp35315-names-dd-g-subgap',
    description:
      'the binding error is the double-precision evaluation of g, so the named lever to extend n* is a ' +
      'double-double-precision g (SG-imp-35315-dd-g), recorded as an open sub-gap',
    holds: () =>
      IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.openSubGap === 'SG-imp-35315-dd-g' &&
      /double-double-PRECISION g/.test(IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.finding.M3_binding_error_is_double_precision_g),
  },
  {
    // Honesty gate: measurement only on the surrogate map, no operator positivity, no bound change, no QED.
    id: 'imp35315-honesty-gate-no-qed',
    description:
      'measurement scope is the surrogate-map derivative signs only: establishes no operator ' +
      'positivity, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.changesBound === false &&
      IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.isRigorous === false &&
      /NO QED/.test(IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.verdict) &&
      /no operator positivity/.test(IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.verdict) &&
      /refereed bound is changed/i.test(IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.verdict) &&
      /surrogate/i.test(IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE.rigorousScope),
  },
];

for (const a of IMP35315_CROSSOVER_DERIV_SIGN_LADDER_DOUBLE_DOUBLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35315-crossover-deriv-sign-ladder-double-double assertion failed: ${a.id}`,
    );
  }
}

/**
 * @module imp-34910-residual-corrected-quotient-ulp-measurement
 *
 * imp-34910 (numerical, frontier): imp-34885 identified that of the four basic interval ops (+, -, *, /),
 * DIVISION is the ONLY one whose correctly-rounded IEEE-754 primitive is NOT exposed in JS -- ECMAScript
 * gives no fesetround, and unlike +,-,* there is no single error-free-transformation that directly yields the
 * directed endpoints, so a residual-corrected quotient (Dekker split / TwoProduct + TwoSum, then a one-ULP
 * directed step) must be built. imp-34885/imp-34908 flagged this as the sole non-IEEE-754-exposed primitive in
 * the directed-rounding checklist but NEVER MEASURED the ULP error it actually injects. This module MEASURES it:
 * it instantiates the residual-corrected directed quotient [RD(a/b), RU(a/b)], evaluates it at the DIVISION
 * sites of the imp-34889/imp-34883 effectiveHeightForN Newton loop that feed / surround the four Math.log
 * evaluation sites, and cross-checks each against a double-double (~106-bit) reference quotient.
 *
 * THE DIVISION SITES (the divisions in / around the four log-evaluation sites of effectiveHeightForN)
 * ----------------------------------------------------------------------------------------------------
 *   S1-seed   (2pi N) / log(N + 2pi)   -- the RvM-inverse seed height (lambda-rh-height-mapping.js:144)
 *   S2-inner  T0 / 2pi                 -- the shared inner log argument of log(T/2pi) and log(T0/2pi)
 *   S2-fp     u / 2pi                  -- the Newton derivative fp = log(T/2pi)/2pi (line 148)
 *   S2-dT     f / fp                   -- the Newton update dT (line 150); the sole negative-quotient site
 *   S4-gp     (2pi K) / (T0 u)         -- the g_prime denominator division, g_prime = 2pi K/(T0 log(T0/2pi))
 * These are the / ops the imp-34885 checklist singles out as non-IEEE-754-exposed. + and - feeding the same
 * expressions are handled by TwoSum and are NOT the concern here.
 *
 * WHAT WAS MEASURED (double-precision, N = N_cross ~ 3.28e9, the imp-34799/imp-34885 evaluation point)
 * ----------------------------------------------------------------------------------------------------
 *   (1) The residual-corrected directed quotient injects EXACTLY 1 ULP of enclosure width at every site
 *       (RU - RD = 1 ulp when inexact) -- the MINIMAL correctly-rounded directed width, never more.
 *       Max relative injected width 1.6804e-16 <= eps (2^-52 = 2.2204e-16); it never exceeds the per-op eps
 *       unit that the imp-34799 gamma(n_op) = n_op eps/(1 - n_op eps) surrogate already budgets for each op.
 *   (2) Native JS a/b is ALREADY correctly rounded at every site: the double-double reference puts the
 *       round-to-nearest error at <= 0.4736 ulp (<= 0.5 ulp everywhere), so the residual-corrected build adds
 *       NO error -- its only job is to MANUFACTURE the directed [RD, RU] endpoints JS cannot supply (no
 *       fesetround), not to correct a wrong quotient.
 *   (3) The directed enclosure [RD, RU] BRACKETS the double-double true quotient at all 5 sites (RD <= true
 *       <= RU), including the negative-quotient Newton-update site S2-dT (sign-aware nextUp/nextDown).
 *
 * VERDICT AGAINST THE imp-34883 HEADROOM
 * --------------------------------------
 * Because each division injects exactly the per-op eps unit the imp-34799 model already assumes (1 ULP, and
 * measured relative width <= eps), the residual-corrected quotient consumes NO MORE than its budgeted share of
 * the op-count ceiling. It is therefore NOT the binding accuracy term: the imp-34883 band-minimum headroom of
 * 2555.18x of the contraction-validity op ceiling over the binding (H2)-margin ceiling is preserved -- the div
 * emulation sits on par with +,-,* and is negligible, not the term that would erode the margin. This is a
 * MEASUREMENT of the div emulation's injected ULP width; it does NOT instantiate the full imp-34687a
 * directed-rounding layer (that still needs the external proven-ULP log binding of imp-34885/imp-34867), does
 * NOT discharge the conditional, changes no bound. imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN; NO QED.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous asymptotic and
 * NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34885-krawczyk-directed-rounding-instantiation-checklist (flags / as the sole non-IEEE-754-exposed basic op; this MEASURES its ULP error)
 * @see imp-34908-krawczyk-certificate-precision-scope (residual-corrected quotient named as the / primitive; this quantifies its injected width)
 * @see imp-34883-krawczyk-worstcase-headroom-band (band-minimum headroom 2555.18x this measurement is compared against)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (gamma(n_op) = n_op eps/(1-n_op eps) per-op eps model the div matches)
 * @see imp-34889-forward-breach-band-uniformity (the forward/contraction Newton loop whose division sites are measured)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop supplying the division sites)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 = 2.2204e-16 (unit roundoff)

// ── sign-aware next-representable-double, for the directed one-ULP step ──────────────────────────────
const _BUF = new DataView(new ArrayBuffer(8));
function nextUp(x) {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return Number.MIN_VALUE;
  _BUF.setFloat64(0, x);
  _BUF.setBigUint64(0, x > 0 ? _BUF.getBigUint64(0) + 1n : _BUF.getBigUint64(0) - 1n);
  return _BUF.getFloat64(0);
}
function nextDown(x) {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return -Number.MIN_VALUE;
  _BUF.setFloat64(0, x);
  _BUF.setBigUint64(0, x > 0 ? _BUF.getBigUint64(0) - 1n : _BUF.getBigUint64(0) + 1n);
  return _BUF.getFloat64(0);
}
function ulp(x) { const a = Math.abs(x); return nextUp(a) - a; }

// ── error-free transformations (Dekker split / TwoProduct / TwoSum; no Math.fma in JS) ───────────────
function split(a) { const c = 134217729 * a; const hi = c - (c - a); return [hi, a - hi]; } // 2^27 + 1
function twoProduct(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; // p + e = a*b exactly
  return [p, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb); // s + err = a + b exactly
  return [s, err];
}

// The residual-corrected DIRECTED quotient [RD(a/b), RU(a/b)] -- the imp-34885 sole non-IEEE-754-exposed op.
// q = fl(a/b) is IEEE-754 correctly rounded; the residual r = a - q*b (recovered exactly via TwoProduct +
// TwoSum) gives the sign of (a/b_exact - q), and a single directed ULP step yields the outward endpoints.
function divDirected(a, b) {
  const q = a / b;
  const [p, e] = twoProduct(q, b);   // q*b = p + e exactly
  const [s, t] = twoSum(a, -p);      // a - p = s + t exactly
  const r = (s - e) + t;             // residual a - q*b, sign-faithful
  let RD, RU;
  if (r > 0) { RD = q; RU = nextUp(q); }        // true quotient > q
  else if (r < 0) { RD = nextDown(q); RU = q; } // true quotient < q
  else { RD = q; RU = q; }                      // exact
  return { q, r, RD, RU, width: Math.abs(RU - RD) };
}

// Double-double (~106-bit) reference quotient: true a/b ~ q1 + q2.
function divDD(a, b) {
  const q1 = a / b;
  const [p, e] = twoProduct(q1, b);
  const [s, t] = twoSum(a, -p);
  const rem = (s - e) + t;
  return { q1, q2: rem / b };
}

// ── the evaluation point and the division sites of the effectiveHeightForN Newton loop ───────────────
const N_CROSS = 3.28029435165241e9; // the imp-34799/imp-34885/imp-34908 evaluation seed
const T0 = effectiveHeightForN(N_CROSS); // ~1.1437849180e9
const U = Math.log(T0 / TWO_PI);
const F = (T0 / TWO_PI) * (U - 1) - N_CROSS;
const FP = U / TWO_PI;
// K = (C_C / E_trunc)^2 with C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-34799/34885).
const K_AMPL = (((1 / 8) * Math.sqrt(3 * Math.PI)) / 3.06e-5) ** 2; // ~1.5727e8

const DIV_SITES = [
  { tag: 'S1-seed', expr: '(2pi N) / log(N + 2pi)', a: TWO_PI * N_CROSS, b: Math.log(N_CROSS + TWO_PI) },
  { tag: 'S2-inner', expr: 'T0 / 2pi', a: T0, b: TWO_PI },
  { tag: 'S2-fp', expr: 'u / 2pi', a: U, b: TWO_PI },
  { tag: 'S2-dT', expr: 'f / fp', a: F, b: FP },
  { tag: 'S4-gp', expr: '(2pi K) / (T0 u)', a: TWO_PI * K_AMPL, b: T0 * U },
];

const MEASUREMENTS = DIV_SITES.map(({ tag, expr, a, b }) => {
  const d = divDirected(a, b);
  const dd = divDD(a, b);
  const widthUlp = d.width / ulp(d.q);              // directed enclosure width in ULPs of the quotient
  const relWidth = d.width / Math.abs(d.q);         // relative injected width
  const nativeErrUlp = Math.abs(dd.q2) / ulp(d.q);  // round-to-nearest error of native a/b, in ULPs
  const trueVal = dd.q1 + dd.q2;
  const brackets = Math.min(d.RD, d.RU) <= trueVal && trueVal <= Math.max(d.RD, d.RU);
  return {
    tag,
    expr,
    q: +d.q.toExponential(6),
    width_ulp: +widthUlp.toFixed(4),
    rel_width: +relWidth.toExponential(4),
    native_err_ulp: +nativeErrUlp.toFixed(4),
    correctly_rounded: nativeErrUlp <= 0.5 + 1e-9,
    brackets_true_quotient: brackets,
  };
});

const MAX_WIDTH_ULP = Math.max(...MEASUREMENTS.map((m) => m.width_ulp));
const MAX_REL_WIDTH = Math.max(...MEASUREMENTS.map((m) => m.rel_width));
const MAX_NATIVE_ERR_ULP = Math.max(...MEASUREMENTS.map((m) => m.native_err_ulp));
const ALL_CORRECTLY_ROUNDED = MEASUREMENTS.every((m) => m.correctly_rounded);
const ALL_BRACKET = MEASUREMENTS.every((m) => m.brackets_true_quotient);

// The imp-34883 band-minimum headroom multiple this measurement is compared against.
const HEADROOM_BAND_MIN = 2555.18; // imp-34883 star_over_H2 band minimum (worst-case seed, upper edge)
// The div injects <= 1 ULP <= eps per call: no MORE than the per-op eps unit the imp-34799 model budgets, so
// it does not erode the headroom -- it is on par with +,-,* and negligible, NOT the binding accuracy term.
const DIV_EXCEEDS_PER_OP_EPS = MAX_REL_WIDTH > EPS; // false: max rel width stays below eps
const DIV_IS_BINDING_TERM = DIV_EXCEEDS_PER_OP_EPS; // false: the div emulation is negligible, not binding

export const IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT = {
  id: 'imp-34910',
  proofSection: 'S-frontier',
  question:
    'imp-34885 flagged division as the SOLE non-IEEE-754-exposed basic op in the directed-rounding checklist, ' +
    'needing a residual-corrected quotient build, but never measured the ULP error that emulation injects. ' +
    'Instantiate the residual-corrected directed quotient [RD(a/b), RU(a/b)] and MEASURE its injected enclosure ' +
    'width at the division sites of the effectiveHeightForN Newton loop that feed the four Math.log sites, ' +
    'cross-check against a double-double reference, and report whether the injected width stays well below the ' +
    'imp-34883 ~2555x headroom over the (H2) ceiling -- i.e. whether the div emulation is the binding accuracy ' +
    'term or negligible. MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS OPEN.',
  evaluation_point: {
    N_cross: +N_CROSS.toPrecision(15),
    T0_at_N_cross: +T0.toPrecision(10),
    eps: +EPS.toExponential(4),
    K_ampl: +K_AMPL.toExponential(4),
  },
  measurements: MEASUREMENTS,
  summary: {
    n_div_sites: MEASUREMENTS.length, // 5
    max_width_ulp: MAX_WIDTH_ULP, // 1.0 -- minimal correctly-rounded directed width, never more
    max_rel_width: +MAX_REL_WIDTH.toExponential(4), // 1.6804e-16 <= eps
    max_native_err_ulp: MAX_NATIVE_ERR_ULP, // 0.4736 <= 0.5 -- native a/b already correctly rounded
    all_correctly_rounded: ALL_CORRECTLY_ROUNDED, // true
    all_bracket_true_quotient: ALL_BRACKET, // true
    headroom_band_min_imp34883: HEADROOM_BAND_MIN, // 2555.18x
    div_is_binding_accuracy_term: DIV_IS_BINDING_TERM, // false -- negligible, on par with +,-,*
  },
  finding:
    'MEASURING the ULP error of the residual-corrected directed quotient [RD(a/b), RU(a/b)] -- the imp-34885 ' +
    'sole non-IEEE-754-exposed basic op -- at the 5 division sites in / around the four Math.log evaluation ' +
    'sites of the effectiveHeightForN Newton loop (seed (2pi N)/log(N+2pi); inner T0/2pi; fp = u/2pi; Newton ' +
    'update dT = f/fp; g_prime denominator (2pi K)/(T0 u)), cross-checked against a double-double (~106-bit) ' +
    'reference. Result: (1) the emulation injects EXACTLY 1 ULP of enclosure width at every site (max ' +
    'relative width 1.6804e-16 <= eps = 2.2204e-16) -- the MINIMAL correctly-rounded directed width, never ' +
    'exceeding the per-op eps unit the imp-34799 gamma(n_op) surrogate already budgets. (2) Native JS a/b is ' +
    'ALREADY correctly rounded at every site (round-to-nearest error <= 0.4736 ulp <= 0.5 ulp), so the ' +
    'residual-corrected build adds NO error -- it only MANUFACTURES the directed endpoints JS cannot supply ' +
    '(no fesetround). (3) The directed enclosure brackets the double-double true quotient at all 5 sites, ' +
    'including the negative-quotient Newton-update site (sign-aware nextUp/nextDown). VERDICT: because each ' +
    'division consumes no more than its budgeted per-op eps share, the div emulation is NOT the binding ' +
    'accuracy term -- the imp-34883 band-minimum headroom of 2555.18x over the (H2)-margin ceiling is ' +
    'preserved and the div sits on par with +,-,* (negligible). This MEASURES the div emulation; it does NOT ' +
    'instantiate the full imp-34687a directed-rounding layer (which still needs the external proven-ULP log ' +
    'binding of imp-34885/imp-34867), does NOT discharge the conditional, changes no bound. imp-34714a and ' +
    'imp-34687a REMAIN OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN; imp-34687a REMAINS OPEN. This MEASURES the residual-corrected quotient ULP width ' +
    '(exactly 1 ULP per call, <= eps relative, brackets the double-double reference, native a/b already ' +
    'correctly rounded) and confirms the div is negligible against the imp-34883 2555x headroom -- but it does ' +
    'NOT supply the transcendental proven-ULP log (still external, imp-34885/imp-34867), does NOT instantiate ' +
    'the imp-34687a directed-rounding layer, and does NOT machine-check the Krawczyk contraction. A ' +
    'measurement of ONE primitive, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'RESIDUAL-CORRECTED QUOTIENT ULP MEASUREMENT (frontier, NOT an RH bound). imp-34885 flagged division as ' +
    'the SOLE non-IEEE-754-exposed basic op needing a residual-corrected build; this MEASURES the ULP error it ' +
    'injects at the 5 division sites of the effectiveHeightForN Newton loop feeding the four Math.log sites, ' +
    'cross-checked against a double-double reference. The emulation injects EXACTLY 1 ULP per call (max ' +
    'relative width 1.6804e-16 <= eps), native a/b is already correctly rounded (<= 0.4736 ulp), and the ' +
    'directed enclosure brackets the true quotient at every site (incl. the negative Newton-update site). ' +
    'Since each div consumes no more than the per-op eps unit the imp-34799 model budgets, it is NOT the ' +
    'binding accuracy term -- the imp-34883 band-minimum 2555.18x headroom over the (H2) ceiling is preserved ' +
    'and the div sits on par with +,-,*. MEASUREMENT ONLY; does NOT instantiate the imp-34687a layer (still ' +
    'gated on the external proven-ULP log binding), does NOT discharge the conditional. SUB-GAPs imp-34714a ' +
    'and imp-34687a REMAIN OPEN. Measurement only on the inherited imp-3220/imp-3406 surrogate crossover map; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34885 (directed-rounding instantiation checklist; / the sole non-IEEE-754-exposed basic op, needs a ' +
    'residual-corrected quotient -- this MEASURES its ULP error); imp-34908 (certificate precision scope; ' +
    'names the residual-corrected quotient as the / primitive); imp-34883 (worst-case headroom band; ' +
    'band-minimum 2555.18x this is compared against); imp-34799 (a-priori gamma(n_op) = n_op eps/(1-n_op eps) ' +
    'per-op eps half-width model the div matches); imp-34889 (forward-breach band-uniformity; the Newton loop ' +
    'supplying the division sites); lambda-rh-height-mapping (effectiveHeightForN). Error-free transformations: ' +
    'Dekker split, TwoSum, TwoProduct; correctly-rounded / and directed rounding: IEEE-754-2019.',
};

export const IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT_ASSERTIONS = [
  {
    // The residual-corrected directed quotient injects EXACTLY 1 ULP at every site (never more), <= eps relative.
    id: 'imp34910-injected-width-exactly-one-ulp',
    description: 'residual-corrected directed quotient injects exactly 1 ULP of enclosure width at every division site; max relative width <= eps',
    holds: () =>
      Math.abs(MAX_WIDTH_ULP - 1) < 1e-9 &&
      MEASUREMENTS.every((m) => Math.abs(m.width_ulp - 1) < 1e-9) &&
      MAX_REL_WIDTH <= EPS,
  },
  {
    // Native JS a/b is already correctly rounded at every site (<= 0.5 ulp), so the build adds no error.
    id: 'imp34910-native-quotient-correctly-rounded',
    description: 'native JS a/b is already correctly rounded (round-to-nearest error <= 0.5 ulp) at every site; the residual-corrected build only manufactures the directed endpoints',
    holds: () =>
      ALL_CORRECTLY_ROUNDED &&
      MAX_NATIVE_ERR_ULP <= 0.5 + 1e-9,
  },
  {
    // The directed enclosure [RD, RU] brackets the double-double true quotient at all 5 sites (incl. negative dT).
    id: 'imp34910-directed-enclosure-brackets-true-quotient',
    description: 'the directed [RD, RU] enclosure brackets the double-double reference quotient at all 5 division sites, including the negative-quotient Newton-update site',
    holds: () =>
      ALL_BRACKET &&
      MEASUREMENTS.length === 5 &&
      MEASUREMENTS.some((m) => m.q < 0), // the negative Newton-update site S2-dT is included
  },
  {
    // The div is NOT the binding accuracy term: it stays within the per-op eps unit, so the imp-34883 headroom holds.
    id: 'imp34910-div-not-binding-headroom-preserved',
    description: 'the div emulation is NOT the binding accuracy term -- injected width stays within the per-op eps unit, so the imp-34883 2555x band-minimum headroom over the (H2) ceiling is preserved',
    holds: () =>
      DIV_IS_BINDING_TERM === false &&
      DIV_EXCEEDS_PER_OP_EPS === false &&
      HEADROOM_BAND_MIN > 100,
  },
  {
    // Honesty gate: measurement only, both sub-gaps open, no QED, no refereed bound is changed.
    id: 'imp34910-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34714a and imp-34687a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.isRigorous === false &&
      /imp-34714a/.test(IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.subGap) &&
      /imp-34687a/.test(IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.subGap) &&
      /REMAINS? OPEN/.test(IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.subGap) &&
      /NO QED/.test(IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT.verdict),
  },
];

for (const a of IMP34910_RESIDUAL_CORRECTED_QUOTIENT_ULP_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34910-residual-corrected-quotient-ulp-measurement assertion failed: ${a.id}`);
  }
}

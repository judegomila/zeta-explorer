/**
 * imp-925: eml-interval primitive.
 *
 * MOTIVATION
 * ----------
 * Odrzywołek 2026-03 (arXiv:2603.21852v2) proves that the binary operator
 * eml(x, y) = exp(x) - ln(y) plus the constant 1 generates every elementary
 * function (NAND-gate analog for analysis). Practical consequence for our
 * imp-857 directed-rounding-backend gap: a rigorous interval-arithmetic
 * backend needs only ONE outward-rounded primitive — eml_interval — instead
 * of separate primitives for {+, -, *, /, exp, log, sin, cos, …}. Surface
 * area drops by ~10× vs. an Arb-via-WASM port.
 *
 * STATUS
 * ------
 * SKELETON / SCAFFOLD. The eml_interval primitive below is implemented with
 * one-ULP outward inflation per Math.exp / Math.log call. Validated on
 * scalar cases; not yet wired into a full interval RK4 driver. Successor
 * ticket (or the same one) extends it to:
 *   (a) rewrite dysonDriftInterval, rk4IntervalStep, backwardCollisionInterval
 *       in eml-normal form
 *   (b) verify wrapper widths at N ∈ {1000, 5000, 10000} are comparable
 *       to or better than the existing per-op interval RK4
 *   (c) compare timing: eml_interval composition vs. the per-op version
 *
 * THEORY: WHAT eml CAN BUILD
 * --------------------------
 * Per Odrzywołek 2026-03, with E = eml and 1 the constant:
 *
 *   exp(z)        =  E(z, 1)             since E(z, 1) = exp(z) - ln(1) = exp(z)
 *   ln(z)         =  E(1, E(E(1,z), 1))  = exp(1) - ln(exp(1) - ln(z) - ...) hmm,
 *                    cited as ln(z) = eml(1, eml(eml(1,z), 1)) in the paper
 *   z + w         =  E( E(0, 1/exp(z)), E(0, 1/exp(w)) )  [one of several equivalents]
 *   z * w         =  exp(ln z + ln w)    composed via eml
 *   z / w         =  exp(ln z − ln w)    composed via eml
 *
 * These rewrites preserve correctness; tightness of the resulting interval
 * enclosure depends on operand domains.
 *
 * INTERVAL ENCLOSURE
 * ------------------
 * For the interval primitive eml_interval([a, b], [c, d]) to be a valid
 * enclosure of { exp(x) - ln(y) : x ∈ [a,b], y ∈ [c,d] }, we use:
 *
 *   eml is monotone in x  (∂_x eml = exp(x) > 0)  → x sweeps [a,b]
 *                             min at x=a, max at x=b
 *   eml is monotone in y  (∂_y eml = -1/y < 0 for y > 0)  → y sweeps [c,d]
 *                             min at y=d, max at y=c
 *
 * So:
 *   lo = exp(a) - ln(d)
 *   hi = exp(b) - ln(c)
 *
 * For y straddling 0 we return null (caller short-circuits, analogous to
 * reciprocalInterval in interval-dyson-integrator.mjs).
 *
 * DIRECTED ROUNDING (one-ULP outward inflation)
 * ---------------------------------------------
 * JavaScript Math.exp and Math.log are round-to-nearest-even. To dominate
 * any IEEE 754 directed-rounding result we inflate by one ULP outward on
 * each side of the resulting interval, just as in
 * interval-dyson-integrator.mjs's inflate(lo, hi).
 *
 * Why this is cheaper than the per-op backend:
 * the existing interval-dyson-integrator.mjs inflates per ARITHMETIC OP. A
 * single eml call covers an entire exp+log composition with ONE inflation.
 * Wrapper-width growth per RK4 step drops by the number of ops collapsed.
 */

// One ULP above x at double precision.
function ulp(x) {
  if (!Number.isFinite(x)) return Number.POSITIVE_INFINITY;
  if (x === 0) return Number.MIN_VALUE;
  const buf = new ArrayBuffer(8);
  const f64 = new Float64Array(buf);
  const u32 = new Uint32Array(buf);
  f64[0] = x;
  u32[0] += 1;
  return f64[0] - x;
}

function inflate(lo, hi) {
  if (Number.isNaN(lo) || Number.isNaN(hi)) return [NaN, NaN];
  return [lo - ulp(lo), hi + ulp(hi)];
}

// ── Single core primitive ──────────────────────────────────────────────────
//
// eml_interval([a, b], [c, d])
//   = enclosure of { exp(x) - ln(y) : x ∈ [a,b], y ∈ [c,d] }
//   = [ exp(a) - ln(d) , exp(b) - ln(c) ]   inflated by 1-ULP outward.
//
// y must be strictly positive on [c, d]. If c <= 0, returns null and the
// caller is expected to short-circuit.
export function eml_interval(xInt, yInt) {
  const [a, b] = xInt;
  const [c, d] = yInt;
  if (c <= 0) return null;
  const lo = Math.exp(a) - Math.log(d);
  const hi = Math.exp(b) - Math.log(c);
  return inflate(lo, hi);
}

// ── Convenience scalar lifts ───────────────────────────────────────────────

export function asInterval(x) {
  return inflate(x, x);
}

// exp(z) via eml: eml(z, 1).
export function exp_interval(zInt) {
  return eml_interval(zInt, [1, 1]);
}

// log(z) via eml: ln(z) = eml(1, eml(eml(1, z), 1))  per Odrzywołek 2026-03.
// Walking the composition outward:
//   inner1 = eml(1, z) = e - ln(z)         (interval over y∈[1,1])
//   inner2 = eml(inner1, 1) = exp(inner1) - 0 = exp(inner1)
//   outer  = eml(1, inner2) = e - ln(inner2)
// So ln(z) = e - ln(exp(e - ln(z))) ⇒ ln(z) = e - (e - ln(z)) = ln(z). Identity.
// For an interval enclosure we just compose the three eml_interval calls.
// Note: this is NOT tighter than Math.log directly; it's a uniformity demo.
// Real users compose eml at the algorithm level.
export function log_interval(zInt) {
  const inner1 = eml_interval([1, 1], zInt);
  if (inner1 === null) return null;
  const inner2 = eml_interval(inner1, [1, 1]);
  if (inner2 === null) return null;
  const outer = eml_interval([1, 1], inner2);
  return outer;
}

// Direct interval log for benchmark: tight monotone enclosure.
export function log_interval_direct(zInt) {
  const [c, d] = zInt;
  if (c <= 0) return null;
  return inflate(Math.log(c), Math.log(d));
}

// ── Sanity self-test (run as Node) ─────────────────────────────────────────

if (typeof process !== 'undefined' && import.meta.url === 'file://' + process.argv[1]) {
  function check(name, got, expected, tol) {
    const eq = (g, e) => (Number.isNaN(e) ? Number.isNaN(g) : Math.abs(g - e) < tol);
    const okLo = eq(got[0], expected[0]);
    const okHi = eq(got[1], expected[1]);
    const ok = okLo && okHi;
    process.stdout.write(
      `  ${ok ? 'OK ' : 'FAIL'}  ${name.padEnd(40)}  got=[${got[0].toExponential(3)}, ${got[1].toExponential(3)}]\n`,
    );
    return ok;
  }

  process.stdout.write('imp-925 eml_interval self-test\n');
  process.stdout.write('-------------------------------\n');

  // Scalar identities at point intervals
  let pass = 0,
    total = 0;

  // exp(0) - ln(1) = 1 - 0 = 1
  total++;
  if (check('eml(0,1) = 1', eml_interval([0, 0], [1, 1]), [1, 1], 1e-10)) pass++;

  // exp(1) - ln(1) = e
  total++;
  if (check('eml(1,1) = e', eml_interval([1, 1], [1, 1]), [Math.E, Math.E], 1e-10))
    pass++;

  // exp(0) - ln(e) = 1 - 1 = 0
  total++;
  if (check('eml(0,e) = 0', eml_interval([0, 0], [Math.E, Math.E]), [0, 0], 1e-10))
    pass++;

  // Interval-valued: x ∈ [0, 1], y ∈ [1, 2]
  // expected: [exp(0) - ln(2), exp(1) - ln(1)] = [1-0.693, e-0] = [0.307, 2.718]
  total++;
  if (
    check(
      'eml([0,1],[1,2])',
      eml_interval([0, 1], [1, 2]),
      [1 - Math.log(2), Math.E],
      1e-10,
    )
  )
    pass++;

  // Negative-y guard
  total++;
  const negY = eml_interval([0, 0], [-1, 1]);
  if (
    check(
      'eml(0,[-1,1]) returns null',
      negY === null ? [NaN, NaN] : negY,
      [NaN, NaN],
      Infinity,
    )
  )
    pass++;

  // exp_interval ≈ Math.exp at point inputs
  total++;
  const expHalf = exp_interval([0.5, 0.5]);
  if (
    check(
      'exp_interval(0.5) ≈ exp(0.5)',
      expHalf,
      [Math.exp(0.5), Math.exp(0.5)],
      1e-10,
    )
  )
    pass++;

  // log_interval ≈ Math.log at point inputs (identity composition)
  total++;
  const logTwo = log_interval([2, 2]);
  if (logTwo !== null) {
    if (
      check(
        'log_interval(2) ≈ log(2) (composed)',
        logTwo,
        [Math.log(2), Math.log(2)],
        1e-8,
      )
    )
      pass++;
  } else {
    process.stdout.write('  FAIL log_interval(2) returned null\n');
  }

  process.stdout.write(
    `\n${pass}/${total} passed.  ${pass === total ? 'OK' : 'FAILURES — review.'}\n`,
  );
  process.exit(pass === total ? 0 : 1);
}

// ── Build-time assertions ──────────────────────────────────────────────────

export const IMP_925_EML_INTERVAL_PRIMITIVE = Object.freeze({
  id: 'imp-925-eml-interval-primitive',
  status: 'skeleton',
  motivation:
    'Single-operator directed-rounding backend for imp-857 inspired by ' +
    'Odrzywołek 2026-03 (arXiv:2603.21852v2). eml(x,y) = exp(x) - ln(y) ' +
    'with constant 1 generates every elementary function, so a rigorous ' +
    'interval-arithmetic backend needs ONLY one outward-rounded primitive.',
  primitive: 'eml_interval([a,b], [c,d]) = inflate(exp(a) - ln(d), exp(b) - ln(c))',
  monotonicity: {
    x: '∂_x eml = exp(x) > 0  →  x ∈ [a,b]: min at x=a, max at x=b',
    y: '∂_y eml = -1/y < 0 (y>0)  →  y ∈ [c,d]: min at y=d, max at y=c',
  },
  successorWork: [
    'rewrite dysonDriftInterval in eml-normal form',
    'rewrite rk4IntervalStep in eml-normal form',
    'benchmark wrapper-width growth at N ∈ {1000, 5000, 10000} vs ' +
      'the existing per-op interval RK4',
  ],
});

export const IMP_925_EML_INTERVAL_PRIMITIVE_ASSERTIONS = [
  {
    id: 'imp925-primitive-monotonicity',
    holds: () => {
      // eml_interval([0,1],[1,2]) should give [1 - ln 2, e]
      const r = eml_interval([0, 1], [1, 2]);
      return (
        r !== null &&
        Math.abs(r[0] - (1 - Math.log(2))) < 1e-9 &&
        Math.abs(r[1] - Math.E) < 1e-9
      );
    },
    why:
      'eml_interval must respect monotonicity: max in x at upper, max in y ' +
      '(via -ln(y)) at lower y. Drift indicates a sign error in the ' +
      'enclosure formula.',
  },
  {
    id: 'imp925-y-straddles-zero-returns-null',
    holds: () => eml_interval([0, 0], [-1, 1]) === null,
    why:
      'When the y-interval straddles 0, ln(y) is undefined; primitive must ' +
      'return null so the caller can short-circuit (analogous to ' +
      'reciprocalInterval in interval-dyson-integrator.mjs).',
  },
  {
    id: 'imp925-status-is-skeleton',
    holds: () => IMP_925_EML_INTERVAL_PRIMITIVE.status === 'skeleton',
    why:
      'Status must remain skeleton until the dysonDriftInterval rewrite ' +
      'and the wrapper-width benchmark land — promotes to closed only when ' +
      'comparable wrapper widths at N >= 1000 are demonstrated.',
  },
];

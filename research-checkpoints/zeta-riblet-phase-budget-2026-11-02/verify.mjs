// Finite checks of a research note. Does not prove RH or certify a zero-free region.
import assert from 'node:assert/strict';
import { verifyCapacity } from './verify-capacity.mjs';
import { runPhaseProbe } from './phase-probe.mjs';

// Unreduced exact rational arithmetic, used only on a bounded finite grid.
const q = (n, d = 1) => ({ n: BigInt(n), d: BigInt(d) });
const add = (a, b) => ({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
const neg = a => ({ n: -a.n, d: a.d });
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => ({ n: a.n * b.n, d: a.d * b.d });
const div = (a, b) => {
  assert.notEqual(b.n, 0n, 'zero rational denominator');
  const sign = b.n < 0n ? -1n : 1n;
  return { n: sign * a.n * b.d, d: sign * a.d * b.n };
};
const sq = a => mul(a, a);
const compare = (a, b) => {
  const v = a.n * b.d - b.n * a.d;
  return v < 0n ? -1 : v > 0n ? 1 : 0;
};
const pos = a => a.n > 0n ? a : q(0);
let pairIdentities = 0, tailBounds = 0, errorInequalities = 0;
for (const x of [q(1, 100), q(1, 10), q(2, 5), q(1)]) {
  for (const b of [q(1, 10), q(1, 5), q(1, 2)]) {
    for (const d of [q(1, 20), q(1, 2), q(1), q(2)]) {
      const Q = add(sq(x), sq(d));
      const left = add(
        div(sub(x, b), add(sq(sub(x, b)), sq(d))),
        div(add(x, b), add(sq(add(x, b)), sq(d))),
      );
      const right = div(mul(mul(q(2), x), sub(Q, sq(b))),
        sub(sq(add(Q, sq(b))), mul(q(4), mul(sq(x), sq(b)))));
      assert.equal(compare(left, right), 0, 'reflected pair identity');
      assert.equal(compare(left, q(0)), compare(Q, sq(b)), 'negative-pocket sign');
      pairIdentities++;
      if (compare(d, q(1)) >= 0) {
        // B=1/2, R=1 gives the rigorous fraction 12/25.
        const lower = mul(q(12, 25), div(mul(q(2), x), Q));
        assert.ok(compare(left, lower) >= 0, 'distant-tail lower bound');
        tailBounds++;
      }
    }
  }
}
for (let a = -12; a <= 12; a++) for (let a0 = -12; a0 <= 12; a0++) {
  const A = q(a, 3), A0 = q(a0, 5);
  assert.ok(compare(pos(neg(A)), add(pos(neg(A0)), pos(sub(A0, A)))) <= 0,
    'one-sided error sign');
  errorInequalities++;
}

// These integer checks underpin the all-height finite-scan counterexample.
assert.ok(2n ** 10n > 199n, 'e > 2 implies e^10 > 199');
assert.ok(compare(sub(mul(q(100), q(99, 100)), q(40)), q(59)) === 0);
// Strict tanh(5)>99/100 then gives a strict lower bound >59.
const scan = [q(1, 20), q(1, 10), q(3, 20), q(1, 4), q(2, 5)];
for (const x of scan) if (compare(x, q(1, 5)) < 0) {
  assert.ok(compare(div(q(2), sub(q(1, 5), x)), q(40)) <= 0);
}

const capacity = verifyCapacity();
const phase = runPhaseProbe();
assert.equal(phase.rows.length, 12);
assert.ok(phase.maxReplayError < 1e-9, 'quadrature tolerance replay');
assert.ok(phase.finite_scan_counterexample.uniform_all_t_lower_bound > 59);
for (const row of phase.rows) {
  for (const [key, value] of Object.entries(row)) assert.ok(Number.isFinite(value), key);
  assert.ok(row.computed_central_mass >= row.analytic_lower_bound - 5e-10);
  assert.ok(row.computed_full_pocket_mass >= row.computed_central_mass - 5e-10);
  assert.ok(row.epsilon < 0.1 && row.certified_halfwidth < 0.05);
}
for (const c of [1, 10, 100, 1000]) {
  const rows = phase.rows.filter(row => row.c === c);
  for (let i = 1; i < rows.length; i++) {
    assert.ok(rows[i].computed_full_pocket_mass > rows[i - 1].computed_full_pocket_mass);
    assert.ok(rows[i].pocket_width < rows[i - 1].pocket_width);
  }
}

// Independent composite-midpoint integration of the constant-background model.
// It checks multiplicity scaling and the arccos formula, not just one synthetic field.
let constantBackgroundCases = 0, maxConstantBackgroundError = 0;
const n = 20000;
for (const m of [1, 2, 5]) for (const ratio of [0.1, 0.01, 0.0001]) {
  const umax = Math.acos(Math.sqrt(ratio)), du = 2 * umax / n;
  let integral = 0;
  for (let i = 0; i < n; i++) {
    const u = -umax + (i + 0.5) * du;
    integral += m * (1 - ratio / Math.cos(u) ** 2) * du;
  }
  const exact = 2 * m * (Math.acos(Math.sqrt(ratio)) - Math.sqrt(ratio * (1 - ratio)));
  const error = Math.abs(integral - exact);
  assert.ok(error < 2e-5, 'constant-background quadrature');
  maxConstantBackgroundError = Math.max(maxConstantBackgroundError, error);
  constantBackgroundCases++;
}

// Analytic polynomial example: pointwise <pi does not supply a uniform gap.
const polynomialBudgets = [0.5, 0.9, 0.99, 0.9999].map(xOverB => {
  const rOverB = Math.sqrt(1 - xOverB ** 2);
  const fromAntiderivative = 2 * (Math.atan(rOverB / (1 - xOverB)) - Math.atan(rOverB / (1 + xOverB)));
  const fromArcsin = 2 * Math.asin(xOverB);
  assert.ok(Math.abs(fromAntiderivative - fromArcsin) < 1e-12);
  assert.ok(fromArcsin < Math.PI);
  return { xOverB, backwardPhase: fromArcsin };
});

console.log(JSON.stringify({
  status: 'finite checks passed; global arithmetic bound open; not an RH proof',
  exactChecks: { pairIdentities, distantTailBounds: tailBounds, oneSidedErrorInequalities: errorInequalities },
  capacity,
  floatingDiagnostics: {
    status: 'IEEE floating point, not interval certified',
    constantBackgroundCases, maxConstantBackgroundError, polynomialBudgets, ...phase,
  },
}, null, 2));

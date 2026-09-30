/** Focused regressions for the September 30 audit. No external dependencies. */
import assert from 'node:assert/strict';
import { FLOW_BLINDNESS_NO_GO_ASSERTIONS } from '../src/data/flow-blindness-no-go.js';
import { HIDDEN_SQUARE_PROGRAM_SECTION_ASSERTIONS } from '../src/data/hidden-square-program-section.js';
import { IMP97049_OBSTRUCTION_AXES, IMP97049_EXHAUSTIVENESS } from '../src/data/imp-97049-polefree-to-weil-obstruction-enumeration.js';
import { IMP97076_BRIDGE_STRUCTURE, IMP97076_VERDICT } from '../src/data/imp-97076-nonsonine-pole-term-bridge-assessment.js';
import { IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD_ASSERTIONS } from '../src/data/imp-97084-polefree-to-weil-three-axis-glossary-headword.js';
import { IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX_ASSERTIONS } from '../src/data/imp-97092-polefree-to-weil-obstruction-cohort-index.js';
import { RH_DIRECTION_AUDIT } from '../src/data/rh-direction-audit-2026-09-30.js';

const checks = [
  ...FLOW_BLINDNESS_NO_GO_ASSERTIONS,
  ...HIDDEN_SQUARE_PROGRAM_SECTION_ASSERTIONS,
  ...IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD_ASSERTIONS,
  ...IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX_ASSERTIONS,
];
for (const c of checks) assert.ok((c.holds || c.check)(), c.id || c.name);
assert.equal(IMP97049_OBSTRUCTION_AXES[1].requiredForRH, false);
assert.equal(IMP97049_EXHAUSTIVENESS.axisIIIhasProvenNoGoAgainstSoftClosure, false);
assert.equal(IMP97076_VERDICT.obstructionIsBridgeAgnosticInLocalClass, false);
assert.match(IMP97076_BRIDGE_STRUCTURE.poleTermSign, /INDEFINITE/);
assert.equal(RH_DIRECTION_AUDIT.rhProved, false);

// A concrete odd test on [-1,1] refutes a PSD pole form. The polynomial and
// its first two derivatives vanish at the boundary; no point masses are used.
function integrate(f, n = 4096) {
  const step = 2 / n;
  let sum = f(-1) + f(1);
  for (let j = 1; j < n; j++) sum += (j % 2 ? 4 : 2) * f(-1 + j * step);
  return sum * step / 3;
}
const odd = (x) => x * (1 - x*x)**3;
const even = (x) => (1 - x*x)**3;
const moments = (h) => [integrate((x) => h(x)*Math.exp(x/2)), integrate((x) => h(x)*Math.exp(-x/2))];
const [op, om] = moments(odd);
const [ep, em] = moments(even);
assert.ok(2*op*om < -0.001, 'odd pole contribution must be negative');
assert.ok(2*ep*em > 0.1, 'even pole contribution must be positive');
assert.ok(Math.abs(op + om) < 1e-12);

// Correct complementary moments detect an odd direction; x*sinh(x/2),
// the former second direction, is even and cannot detect this odd test.
assert.ok(integrate((x) => odd(x)*Math.sinh(x/2)) > 0.01);
assert.ok(Math.abs(integrate((x) => odd(x)*x*Math.sinh(x/2))) < 1e-12);

// P=I, S=diag(2,-1/2): K=P+S is positive while ||P^-1/2 S P^-1/2||=2>1.
const residual = [2, -0.5];
assert.ok(residual.every((r) => 1+r > 0));
assert.ok(Math.max(...residual.map(Math.abs)) > 1);

console.log(`PASS: ${checks.length} data assertions, criterion guards, pole-sign/parity counterexamples, signed-residual counterexample`);
console.log('These regressions do not certify all-support positivity or an RH proof.');

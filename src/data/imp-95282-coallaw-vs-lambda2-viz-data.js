/**
 * @module imp-95282-coallaw-vs-lambda2-viz-data
 *
 * imp-95282 (ux): lightweight, import-light viz-data module baking sampled
 * curves of the imp-95231 / imp-95227 confluent-span value
 *   coalLaw(x) = e^(-2x) (1 + 2x^2 + 2x sqrt(1+x^2))
 * against the exact signed N = 2 constant
 *   Lambda_2(x, r) = P + h^2/2 + (h/2) sqrt(h^2 + 4P),
 *   P = e^(-(1+r)x),  h = (e^(-x) - e^(-rx)) (1+r) / (r-1),
 * at several fixed rate ratios r > 1 (1.01, 1.1, 1.5, 2.0), sampled over
 * x in [0.1, 3.0]. This illustrates the imp-95231 THEOREM COAL-DESC /
 * imp-95227 THEOREM (two-rate coalescence dominance) statement that the
 * confluent value coalLaw(x) dominates Lambda_2(x, r) for every r >= 1, and
 * that Lambda_2(x, r) -> coalLaw(x) as r -> 1 (coalescence).
 *
 * All curve values are recomputed here independently from the closed forms
 * documented in imp-95231-coalescence-ratio-monotonicity.js (lam2, coalLaw)
 * and imp-95227-two-rate-coalescence-dominance-theorem.js (capC) -- no new
 * derivation, no heavy import, no re-import of the source modules (each
 * module carries its own self-executing assertions). Follows the imp-95279 /
 * imp-95266 import-light viz-data pattern.
 *
 * PRESENTATION POINT. For every sampled x and every r in {1.01, 1.1, 1.5, 2.0},
 * Lambda_2(x, r) <= coalLaw(x), with the r = 1.01 curve sitting closest to
 * coalLaw(x) and the r = 2.0 curve sitting furthest below it: the domination
 * gap widens monotonically as r moves away from coalescence (r = 1), exactly
 * as imp-95231 THEOREM COAL-DESC predicts (dLambda_2/dr <= 0 at r -> 1+, for
 * every x > 0).
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95231 / imp-95227 closed
 * forms verbatim; changes no bound, no operator positivity, no RH claim;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95231-coalescence-ratio-monotonicity.js (source: lam2, coalLaw, THEOREM COAL-DESC)
 * @see imp-95227-two-rate-coalescence-dominance-theorem.js (source: capC dominance theorem)
 *
 * Ticket: imp-95282 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

// rate ratios r > 1 sampled, ordered by distance from coalescence (r = 1)
export const IMP95282_RATES = [1.01, 1.1, 1.5, 2.0];

// coalLaw(x) = e^(-2x) (1 + 2x^2 + 2x sqrt(1+x^2)); Lambda_2(x, r) as above.
// Sampled at 20 points linearly spaced over x in [0.1, 3.0].
export const IMP95282_CURVES = [
  { x: 0.1, coalLaw: 0.99966821, r1_01: 0.99966324, r1_1: 0.99961697, r1_5: 0.99937953, r2_0: 0.99901036 },
  { x: 0.25263158, coalLaw: 0.99478782, r1_01: 0.99471104, r1_1: 0.99399914, r1_5: 0.99039461, r2_0: 0.98494212 },
  { x: 0.40526316, coalLaw: 0.97952146, r1_01: 0.97923008, r1_1: 0.97654117, r1_5: 0.96325779, r2_0: 0.94411578 },
  { x: 0.55789474, coalLaw: 0.95026282, r1_01: 0.94958976, r1_1: 0.94341863, r1_5: 0.91392444, r2_0: 0.8740133 },
  { x: 0.71052632, coalLaw: 0.90618196, r1_01: 0.90499056, r1_1: 0.89415057, r1_5: 0.84429703, r2_0: 0.78145079 },
  { x: 0.86315789, coalLaw: 0.84886519, r1_01: 0.84708414, r1_1: 0.83101577, r1_5: 0.76011453, r2_0: 0.67713596 },
  { x: 1.01578947, coalLaw: 0.78146103, r1_01: 0.77909324, r1_1: 0.75792108, r1_5: 0.66840523, r2_0: 0.57121988 },
  { x: 1.16842105, coalLaw: 0.70776396, r1_01: 0.70487575, r1_1: 0.67928545, r1_5: 0.57564355, r2_0: 0.47119417 },
  { x: 1.32105263, coalLaw: 0.63149763, r1_01: 0.62819829, r1_1: 0.59923441, r1_5: 0.48683621, r2_0: 0.38154544 },
  { x: 1.47368421, coalLaw: 0.55587315, r1_01: 0.55229311, r1_1: 0.52115493, r1_5: 0.40530755, r2_0: 0.3042636 },
  { x: 1.62631579, coalLaw: 0.48338871, r1_01: 0.4796611, r1_1: 0.44753763, r1_5: 0.33287611, r2_0: 0.23958903 },
  { x: 1.77894737, coalLaw: 0.41579904, r1_01: 0.4120465, r1_1: 0.38000411, r1_5: 0.27018916, r2_0: 0.18669784 },
  { x: 1.93157895, coalLaw: 0.35418511, r1_01: 0.35051186, r1_1: 0.31943151, r1_5: 0.21707641, r2_0: 0.14422303 },
  { x: 2.08421053, coalLaw: 0.29907109, r1_01: 0.29555931, r1_1: 0.26611331, r1_5: 0.17285668, r2_0: 0.11060624 },
  { x: 2.23684211, coalLaw: 0.25055362, r1_01: 0.24726309, r1_1: 0.21991931, r1_5: 0.13657503, r2_0: 0.08431172 },
  { x: 2.38947368, coalLaw: 0.20842336, r1_01: 0.20539311, r1_1: 0.18043616, r1_5: 0.10717135, r2_0: 0.06394145 },
  { x: 2.54210526, coalLaw: 0.17226897, r1_01: 0.16952017, r1_1: 0.14708106, r1_5: 0.08359085, r2_0: 0.04828506 },
  { x: 2.69473684, coalLaw: 0.14156036, r1_01: 0.13909962, r1_1: 0.11918809, r1_5: 0.06485031, r2_0: 0.03633034 },
  { x: 2.84736842, coalLaw: 0.11571183, r1_01: 0.11353454, r1_1: 0.09607005, r1_5: 0.05007228, r2_0: 0.02725176 },
  { x: 3.0, coalLaw: 0.09412731, r1_01: 0.09222073, r1_1: 0.07706005, r1_5: 0.03849805, r2_0: 0.02038876 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

function coalLawExact(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}

function lam2Exact(x, r) {
  const w1 = Math.exp(-x);
  const h = (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
  const P = w1 * Math.exp(-r * x);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}

const IMP95282_ASSERTIONS = [
  {
    id: 'imp95282-coallaw-matches-closed-form',
    description: 'every baked coalLaw(x) value matches e^(-2x)(1+2x^2+2x sqrt(1+x^2)) to 1e-6 relative',
    holds: () =>
      IMP95282_CURVES.every((p) => Math.abs(p.coalLaw - coalLawExact(p.x)) / coalLawExact(p.x) < 1e-6),
  },
  {
    id: 'imp95282-lambda2-matches-closed-form',
    description: 'every baked Lambda_2(x, r) value matches the exact quadratic-root closed form to 1e-6 relative, for every sampled rate',
    holds: () =>
      IMP95282_CURVES.every((p) =>
        IMP95282_RATES.every((r, i) => {
          const key = ['r1_01', 'r1_1', 'r1_5', 'r2_0'][i];
          const expected = lam2Exact(p.x, r);
          return Math.abs(p[key] - expected) / expected < 1e-6;
        }),
      ),
  },
  {
    id: 'imp95282-coallaw-dominates-every-rate',
    description: 'coalLaw(x) >= Lambda_2(x, r) for every sampled x and every r in {1.01, 1.1, 1.5, 2.0} (imp-95231 COAL-DESC / imp-95227 dominance)',
    holds: () =>
      IMP95282_CURVES.every(
        (p) => p.r1_01 <= p.coalLaw && p.r1_1 <= p.coalLaw && p.r1_5 <= p.coalLaw && p.r2_0 <= p.coalLaw,
      ),
  },
  {
    id: 'imp95282-domination-gap-widens-away-from-coalescence',
    description: 'the gap coalLaw(x) - Lambda_2(x, r) is monotonically increasing as r moves away from coalescence (r1_01 closest to coalLaw, r2_0 furthest) at every sampled x',
    holds: () =>
      IMP95282_CURVES.every((p) => p.r1_01 >= p.r1_1 && p.r1_1 >= p.r1_5 && p.r1_5 >= p.r2_0),
  },
];

for (const a of IMP95282_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95282-coallaw-vs-lambda2-viz-data assertion failed: ${a.id}`);
  }
}

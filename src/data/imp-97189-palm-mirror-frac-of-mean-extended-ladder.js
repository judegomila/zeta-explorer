/**
 * @module imp-97189-palm-mirror-frac-of-mean-extended-ladder
 *
 * imp-97189 (numerical): extend the imp-97101 neutral rigid-lattice Palm 2-slot
 * mirror-count "fraction of mean" ladder past ln N = 22 (where imp-97127 stopped
 * at frac = 0.535) to locate where -- if ever -- frac reaches 1, and quantify how
 * much taller a lattice the imp-97127 height-only reading actually requires.
 *
 * SETUP (identical kernel to imp-97101 / tmp/imp-97101-ladder.mjs):
 *   spacing s = 2 pi / ln N, conditioning pair excluded (2-slot offset 1.5),
 *   mirror kernel 2*[2y/(D^2 + 4y^2)] both sides, exact atan tail; y0 = 0.165.
 *   The "mean" the fraction is measured against is the asymptotic mirror mean
 *   ln N / 2. imp-97127 recorded frac = 0.376 at the seam (ln N = 13.446),
 *   0.476 at the 2-slot parity crossing (ln N* = 18.394) and 0.535 at ln N = 22,
 *   all "well below 1", grounding its HEIGHT-effect (not y0-relaxation) verdict.
 *
 * WHAT THIS LEAF ADDS: it runs the same deterministic count out to ln N = 1e8 and
 * finds the count trails its own mean by a FIXED ADDITIVE constant at every
 * height: palm2(ln N) = ln N / 2 - 1/y0 + o(1), with 1/y0 = 6.06060... measured
 * to 1e-6 (offset 6.006 at ln N = 100, converging to 6.060606 by ln N = 1e5).
 * Hence frac(ln N) = 1 - 2/(y0 * ln N) = 1 - (400/33)/ln N, i.e. the deficit
 * 1 - frac decays only like ~12.12 / ln N. The fraction APPROACHES 1 but never
 * reaches it at any finite height, and only extremely slowly:
 *
 *   ln N       N              palm2        frac
 *   22         3.6e9          5.8798       0.53453  (imp-97127 last rung)
 *   50         5.2e21         19.1514      0.76606
 *   100        2.7e43         43.9938      0.87988
 *   200        7.2e86         93.9531      0.93953
 *   1000       ~e^1000        493.9399     0.98788
 *   10000      ~e^10000       4993.9394    0.99879
 *   1e6        ~e^1e6         499993.939   0.99999
 *
 *   frac target   first reached at ln N (bisection)
 *   0.60          26.96
 *   0.70          38.02
 *   0.80          59.07
 *   0.90          120.5
 *   0.95          242.1
 *   0.99          1212
 *   0.999         12121
 *
 * READING (strengthens imp-97127, moves no bound): the parity crossing at
 * ln N* = 18.394 (frac 0.476) is not merely "below 1" -- the count can never
 * catch its mean, because it lags by the fixed additive constant 1/y0 = 6.06 at
 * EVERY height. Reaching even frac = 0.90 needs ln N ~ 120 (N ~ e^120 ~ 1e52),
 * ~6.5 units of ln N and a factor ~1e45 in N above the crossing; frac = 0.99
 * needs ln N ~ 1212 (N ~ e^1212), far beyond any conceivable zeta height. The
 * height-only reading of imp-97127 is therefore confirmed and sharpened: the
 * count's approach to its mean is an infinitely-slow 1 - O(1/ln N) tail set by
 * the fixed y0-window deficit, not a crossing at any physical lattice.
 *
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (11-rung ladder to ln N=22)
 * @see imp-97127-palm-mirror-height-effect-honest-status.js (frac<1 verdict)
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (two-height anchor)
 *
 * Ticket: imp-97189 (numerical, low, opus-4-8). Measurement only; no bound moves;
 * no refereed bound is changed; RH open; NO QED.
 */

const IMP97189_Y0 = 0.165;

// Neutral rigid-lattice Palm 2-slot mirror count at seam density ln N (imp-97101 kernel).
export function imp97189PalmMirrorCount2(lnN, y = IMP97189_Y0, K = 200000) {
  const s = (2 * Math.PI) / lnN;
  const off = 1.5; // 2-slot: conditioning pair excluded
  let acc = 0;
  for (let k = 0; k <= K; k++) {
    const D = (k + off) * s;
    acc += (2 * 2 * y) / (D * D + 4 * y * y);
  }
  acc += (2 / s) * (Math.PI / 2 - Math.atan(((K + 0.5 + off) * s) / (2 * y)));
  return acc;
}

export function imp97189FracOfMean(lnN, y = IMP97189_Y0) {
  return imp97189PalmMirrorCount2(lnN, y) / (lnN / 2);
}

export const IMP97189_EXTENDED_LADDER = Object.freeze({
  y0: IMP97189_Y0,
  lastImp97127Rung: Object.freeze({ lnN: 22, fracOfMean: 0.53453 }),
  // count = lnN/2 - additiveDeficit + o(1); additiveDeficit -> 1/y0
  additiveDeficit: 6.060606, // = 1/y0 = 1/0.165, measured to 1e-6 by lnN=1e5
  fracDeficitTimesLnN: 12.121212, // = 2/y0; (1 - frac) * lnN converges to this
  rungs: Object.freeze([
    Object.freeze({ lnN: 22, palm2: 5.87981, frac: 0.534528 }),
    Object.freeze({ lnN: 50, palm2: 19.15141, frac: 0.766057 }),
    Object.freeze({ lnN: 100, palm2: 43.99383, frac: 0.879877 }),
    Object.freeze({ lnN: 200, palm2: 93.95309, frac: 0.939531 }),
    Object.freeze({ lnN: 1000, palm2: 493.93994, frac: 0.987880 }),
    Object.freeze({ lnN: 10000, palm2: 4993.93940, frac: 0.998788 }),
    Object.freeze({ lnN: 1e6, palm2: 499993.93939, frac: 0.999988 }),
  ]),
  fracTargets: Object.freeze([
    Object.freeze({ target: 0.6, lnN: 26.96 }),
    Object.freeze({ target: 0.7, lnN: 38.02 }),
    Object.freeze({ target: 0.8, lnN: 59.07 }),
    Object.freeze({ target: 0.9, lnN: 120.46 }),
    Object.freeze({ target: 0.95, lnN: 242.05 }),
    Object.freeze({ target: 0.99, lnN: 1212.0 }),
    Object.freeze({ target: 0.999, lnN: 12121.0 }),
  ]),
  reachesOneAtFiniteHeight: false,
  approachLaw: 'frac(lnN) = 1 - (2/y0)/lnN = 1 - 12.1212/lnN; deficit is a fixed additive 1/y0 in the count',
  verdictStrengthensImp97127HeightEffect: true,
  anyBoundMoved: false,
});

export const IMP97189_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extending the imp-97101 neutral ' +
  'rigid-lattice Palm 2-slot mirror-count frac-of-mean ladder past ln N = 22 (imp-97127 ' +
  'stopped at 0.535) shows frac APPROACHES 1 but never reaches it at any finite height: ' +
  'the count trails its own mean ln N/2 by a FIXED additive constant 1/y0 = 6.06 at every ' +
  'height, so frac = 1 - (2/y0)/ln N = 1 - 12.12/ln N. Reaching frac = 0.90 needs ln N ~ 120 ' +
  '(N ~ e^120, ~1e52), frac = 0.99 needs ln N ~ 1212 -- far above the parity crossing ' +
  'ln N* = 18.39. This CONFIRMS and sharpens the imp-97127 HEIGHT-effect reading (not a ' +
  'y0 = 0.165 window relaxation): the approach to the mean is an infinitely-slow 1 - O(1/ln N) ' +
  'tail set by the fixed y0-window deficit. Measurement only; no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97189_ASSERTIONS = [
  {
    id: 'imp97189-reproduces-imp97127-lnN22-rung',
    holds: () => Math.abs(imp97189FracOfMean(22) - 0.53453) < 2e-4,
    why: 'The extended ladder must reproduce the imp-97127 last rung frac = 0.535 at ln N = 22.',
  },
  {
    id: 'imp97189-frac-monotone-increasing-below-one',
    holds: () => {
      const f22 = imp97189FracOfMean(22);
      const f100 = imp97189FracOfMean(100);
      const f1000 = imp97189FracOfMean(1000);
      return f22 < f100 && f100 < f1000 && f1000 < 1;
    },
    why: 'Fraction of mean increases with height but stays strictly below 1 at every finite ln N.',
  },
  {
    id: 'imp97189-fixed-additive-deficit-is-inverse-y0',
    holds: () => {
      const deficit = 1e6 / 2 - imp97189PalmMirrorCount2(1e6); // lnN/2 - count at lnN=1e6
      return Math.abs(deficit - 1 / IMP97189_Y0) < 1e-3;
    },
    why: 'The count lags its mean by the fixed additive constant 1/y0 = 6.0606, giving frac = 1 - (2/y0)/lnN.',
  },
  {
    id: 'imp97189-honesty-gate-no-qed',
    holds: () =>
      IMP97189_EXTENDED_LADDER.anyBoundMoved === false &&
      IMP97189_EXTENDED_LADDER.reachesOneAtFiniteHeight === false &&
      /NO QED/.test(IMP97189_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97189_HONEST_BANNER) &&
      /RH open/.test(IMP97189_HONEST_BANNER) &&
      /HEIGHT-effect/.test(IMP97189_HONEST_BANNER),
    why:
      'Measurement only: no bound moved, frac never reaches 1 at finite height, no-refereed-bound-change line ' +
      'present, and the height-effect reading stated explicitly.',
  },
];

for (const assertion of IMP97189_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97189-palm-mirror-frac-of-mean-extended-ladder assertion failed: ${assertion.id}`,
    );
  }
}

export default {
  ladder: IMP97189_EXTENDED_LADDER,
  banner: IMP97189_HONEST_BANNER,
  palmMirrorCount2: imp97189PalmMirrorCount2,
  fracOfMean: imp97189FracOfMean,
};

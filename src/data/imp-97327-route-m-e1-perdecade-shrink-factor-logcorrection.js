/**
 * @module imp-97327-route-m-e1-perdecade-shrink-factor-logcorrection
 *
 * imp-97327 (numerical MEASUREMENT -- NO QED): decide whether the per-decade shrink factor of the
 * relative residual
 *     res(b) = 1 - r(b),   r(b) = |E1(b)| / (b/4)
 * on the consecutive-prime semiprime ladder converges to the exact b^{-1/2} constant 10^{-1/2}=0.31623
 * (as imp-97291 RESULT 4 / imp-97315 read it, per-decade factor ~0.33-0.35), or settles at a slightly
 * larger value indicating a log correction to the b^{-1/2} law.
 *
 *   Notation (imp-97291 / imp-97315): E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4), r(b)=|E1(b)|/(b/4),
 *   res(b)=1-r(b). The consecutive-prime semiprime b = p*nextprime(p). Ratios computed with the imp-97291
 *   fast Glaisher-Kinkelin per-divisor evaluator E1fastFromPrimes (validated to <6e-7 vs the direct exact
 *   O(b) coprime sum for b <~ 1e6 in imp-97315). "per-decade factor" = 10^{d log10(res)/d log10 b}, the
 *   factor by which res shrinks per decade of b; a pure res ~ C b^{-1/2} gives exactly 10^{-1/2}=0.31623.
 *
 * -------------------------------------------------------------------------------
 * METHOD.
 * -------------------------------------------------------------------------------
 * A DENSE consecutive-prime semiprime ladder was built at 23 geometrically spaced b-scales from b~3.1e3
 * to b~1e9 (four samples per decade, vs the ~one-per-decade ladder of imp-97291/imp-97315). For each rung
 * res(b)=1-r(b) was measured; the per-decade factor was taken both LOCALLY (consecutive-rung ratio raised
 * to 1/Delta log10 b) and GLOBALLY (least-squares slope of log10(res) vs log10 b, per-decade factor =
 * 10^slope). Two structural diagnostics separate the pure and log-corrected models:
 *     pure b^{-1/2}:        res*sqrt(b)          is CONSTANT iff res ~ C b^{-1/2};
 *     log-correction:       res*sqrt(b)/log(b)   is CONSTANT iff res ~ C b^{-1/2} log b.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE PER-DECADE FACTOR DOES NOT SETTLE AT 0.31623; IT SITS ABOVE IT AND DRIFTS DOWN.
 * -------------------------------------------------------------------------------
 * The LOCAL per-decade factor decreases monotonically across the ladder, from 0.37584 (b 3127->5767)
 * to 0.34722 (b 3.2e8->5.6e8), i.e. it is a slightly LARGER value than 0.31623 everywhere in the measured
 * window and drifts slowly DOWNWARD toward it -- it does NOT converge to a fixed slightly-larger constant,
 * nor does it reach 0.31623. The GLOBAL least-squares fit gives an implied exponent alpha=0.4426 (per-decade
 * 0.36091) on b<=1e7 and alpha=0.4489 (per-decade 0.35572) on b<=1e9 -- both notably shallower than the
 * pure -1/2 (0.31623). The imp-97291/imp-97315 quoted ~0.33-0.35 is confirmed as the coarse-ladder average;
 * the dense ladder resolves it as a drifting 0.376 -> 0.347, not a constant.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- THE DRIFT IS THE 1/log b LOG CORRECTION OF THE b^{-1/2} LAW (leading exponent IS -1/2).
 * -------------------------------------------------------------------------------
 * The pure diagnostic res*sqrt(b) is NOT constant: it grows monotonically 4.612 -> 8.895 across the window,
 * essentially linearly in log b (res*sqrt(b) = 4 M/sqrt(b) with M=b/4-|E1| the imp-97291 RESULT 4 absolute
 * margin, whose M/sqrt(b) climbs 1.153 -> 2.224). Fitting M/sqrt(b) = A + C log b gives A~0.47, C~0.0845,
 * so
 *     res(b) = 4 M(b)/b ~ b^{-1/2} (A + C log b),  A~0.47, C~0.0845,
 * a b^{-1/2} leading law with a POSITIVE log-type multiplicative correction. Its local log-slope is
 *     d log(res)/d log b = -1/2 + C/(A + C log b),
 * and C/(A+C log b) = C/(M/sqrt(b)) falls 0.073 (small b) -> 0.038 (large b), predicting per-decade factor
 * 10^{-0.5+that} = 0.374 -> 0.345, matching the measured local 0.376 -> 0.347. So the per-decade factor
 * converges to 0.31623 only ASYMPTOTICALLY (as C/(A+C log b) ~ 1/log b -> 0), never within a finite window.
 * The exact-b^{-1/2}-constant reading is the b->infinity limit; the finite-window value is genuinely larger
 * because of the log correction, NOT because the exponent differs from -1/2.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The per-decade shrink factor of 1-r(b) does NOT converge to 10^{-1/2}=0.31623 inside any measured window:
 * it sits at a slightly larger value (~0.376 at b~3e3 down to ~0.347 at b~5e8) and drifts slowly downward.
 * The correct reading is the b^{-1/2} law WITH a positive 1/log b multiplicative correction (res ~ b^{-1/2}
 * (A + C log b), A~0.47, C~0.0845), so the leading exponent is -1/2 but the per-decade factor reaches 0.31623
 * only as b->infinity. This refines the imp-97291 RESULT 4 / imp-97315 "~0.33-0.35 b^{-1/2}" reading into the
 * precise finite-window law. Measurement only; no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (RESULT 4: absolute margin ~sqrt(b), 1-r~b^{-1/2})
 * @see imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js (per-decade ~0.33-0.35 reading being refined; FP window)
 *
 * Ticket: imp-97327 (numerical, opus-4-8, api-pool). Per-decade shrink-factor / log-correction measurement; NO QED.
 */

import { IMP97291_KERNEL } from './imp-97291-route-m-e1-wide-composite-ratio-sweep.js';

const { E1fastFromPrimes } = IMP97291_KERNEL;

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
const nextPrime = (n) => { let m = n + 1; while (!isPrime(m)) m++; return m; };
const prevPrime = (n) => { let m = n - 1; while (!isPrime(m)) m--; return m; };

// consecutive-prime semiprime nearest to a target scale s: p = prevPrime(round(sqrt(s))+1), q = nextPrime(p)
const consecutiveSemiprimeNear = (s) => {
  const p = prevPrime(Math.round(Math.sqrt(s)) + 1);
  const q = nextPrime(p);
  return [p, q];
};
const resFromPrimes = ([p, q]) => {
  const b = p * q;
  return 1 - Math.abs(E1fastFromPrimes([p, q])) / (b / 4);
};
// per-decade factor between two rungs = (res2/res1)^{1/(log10 b2 - log10 b1)}
const perDecadeFactor = (b1, res1, b2, res2) =>
  Math.pow(res2 / res1, 1 / (Math.log10(b2) - Math.log10(b1)));

export const IMP97327_KERNEL = Object.freeze({
  consecutiveSemiprimeNear, resFromPrimes, perDecadeFactor,
});

// -- baked dense-ladder measurement (23 rungs, ~4 per decade; reproduced live for small members below) --
export const IMP97327_RESULTS = Object.freeze({
  residualDefinition: 'res(b) = 1 - r(b), r(b) = |E1(b)|/(b/4), consecutive-prime semiprime b = p*nextprime(p)',
  perDecadeDefinition: '10^{d log10(res)/d log10 b}; pure res ~ C b^{-1/2} gives exactly 10^{-1/2}=0.31623',
  bSqrtHalf: 0.31622776601683794, // 10^{-1/2}
  denseLadder: [
    { p: 53, q: 59, b: 3127, res: 8.24699e-2, resSqrtB: 4.61168, resSqrtBoverLogB: 0.57303 },
    { p: 73, q: 79, b: 5767, res: 6.35801e-2, resSqrtB: 4.82832, resSqrtBoverLogB: 0.55755 },
    { p: 97, q: 101, b: 9797, res: 5.06474e-2, resSqrtB: 5.01307, resSqrtBoverLogB: 0.54550 },
    { p: 131, q: 137, b: 17947, res: 3.89969e-2, resSqrtB: 5.22428, resSqrtBoverLogB: 0.53335 },
    { p: 173, q: 179, b: 30967, res: 3.07561e-2, resSqrtB: 5.41228, resSqrtBoverLogB: 0.52340 },
    { p: 233, q: 239, b: 55687, res: 2.37868e-2, resSqrtB: 5.61323, resSqrtBoverLogB: 0.51368 },
    { p: 313, q: 317, b: 99221, res: 1.84443e-2, resSqrtB: 5.80983, resSqrtBoverLogB: 0.50498 },
    { p: 421, q: 431, b: 181451, res: 1.41202e-2, resSqrtB: 6.01479, resSqrtBoverLogB: 0.49673 },
    { p: 557, q: 563, b: 313591, res: 1.10705e-2, resSqrtB: 6.19941, resSqrtBoverLogB: 0.48985 },
    { p: 743, q: 751, b: 557993, res: 8.55912e-3, resSqrtB: 6.39357, resSqrtBoverLogB: 0.48319 },
    { p: 997, q: 1009, b: 1005973, res: 6.57210e-3, resSqrtB: 6.59170, resSqrtBoverLogB: 0.47692 },
    { p: 1327, q: 1361, b: 1806047, res: 5.05128e-3, resSqrtB: 6.78837, resSqrtBoverLogB: 0.47120 },
    { p: 1777, q: 1783, b: 3168391, res: 3.91925e-3, resSqrtB: 6.97625, resSqrtBoverLogB: 0.46605 },
    { p: 2371, q: 2377, b: 5635867, res: 3.01982e-3, resSqrtB: 7.16906, resSqrtBoverLogB: 0.46119 },
    { p: 3137, q: 3163, b: 9922331, res: 2.33597e-3, resSqrtB: 7.35825, resSqrtBoverLogB: 0.45674 },
    { p: 4217, q: 4219, b: 17791523, res: 1.79075e-3, resSqrtB: 7.55339, resSqrtBoverLogB: 0.45245 },
    { p: 5623, q: 5639, b: 31708097, res: 1.37560e-3, resSqrtB: 7.74599, resSqrtBoverLogB: 0.44847 },
    { p: 7499, q: 7507, b: 56294993, res: 1.05777e-3, resSqrtB: 7.93647, resSqrtBoverLogB: 0.44472 },
    { p: 9973, q: 10007, b: 99799811, res: 8.13290e-4, resSqrtB: 8.12475, resSqrtBoverLogB: 0.44111 },
    { p: 13331, q: 13337, b: 177795547, res: 6.25678e-4, resSqrtB: 8.34279, resSqrtBoverLogB: 0.43918 },
    { p: 17783, q: 17789, b: 316341787, res: 4.80170e-4, resSqrtB: 8.54031, resSqrtBoverLogB: 0.43635 },
    { p: 23689, q: 23719, b: 561879391, res: 3.69193e-4, resSqrtB: 8.75135, resSqrtBoverLogB: 0.43438 },
    { p: 31607, q: 31627, b: 999634589, res: 2.81326e-4, resSqrtB: 8.89467, resSqrtBoverLogB: 0.42922 },
  ],
  localPerDecadeFactor: {
    smallB: { pair: '3127->5767', value: 0.37584 },
    midB: { pair: '557993->1005973', value: 0.35627 },
    largeB: { pair: '316341787->561879391', value: 0.34873 },
    note: 'monotone DOWNWARD drift 0.376 -> 0.347 across the ladder; always ABOVE 0.31623',
  },
  globalLeastSquares: {
    trustworthyBelow1e7: { alpha: 0.44260, perDecade: 0.36091 }, // slope -0.4426
    fullWindowBelow1e9: { alpha: 0.44889, perDecade: 0.35572 }, // slope -0.4489, FP note past ~1e7
    note: 'both notably shallower than the pure -1/2 (per-decade 0.31623) -- a positive log correction',
  },
  logCorrectionModel: {
    // res(b) ~ b^{-1/2}(A + C log b); M/sqrt(b) = A + C log b, fit A~0.47 C~0.0845
    form: 'res(b) ~ b^{-1/2}(A + C log b), A~0.47, C~0.0845 (M/sqrt(b)=A+C log b, M=b/4-|E1|)',
    localSlope: 'd log(res)/d log b = -1/2 + C/(A+C log b); C/(A+C log b) falls 0.073 -> 0.038',
    predictedPerDecade: '10^{-0.5+that} = 0.374 -> 0.345, matches measured local 0.376 -> 0.347',
    convergesToBSqrtHalf: 'only asymptotically (C/(A+C log b) ~ 1/log b -> 0), never in a finite window',
  },
});

export const IMP97327_VERDICT = Object.freeze({
  question: 'does the per-decade shrink factor of 1-r(b) converge to 10^{-1/2}=0.31623 or settle at a slightly larger value (log correction)?',
  convergesToBSqrtHalfInWindow: false,
  perDecadeAboveBSqrtHalf: true, // ~0.376 -> ~0.347, always above 0.31623
  perDecadeDriftsDownward: true, // monotone decrease toward 0.31623, not a fixed constant
  leadingExponentIsMinusHalf: true, // b^{-1/2} law confirmed as leading order
  logCorrectionPresent: true, // positive 1/log b multiplicative correction (res ~ b^{-1/2}(A+C log b))
  reachesBSqrtHalfOnlyAsymptotically: true,
  measurementOnly: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Dense 23-rung consecutive-prime semiprime ladder (b~3.1e3 to ~1e9). The per-decade shrink factor of ' +
    'res(b)=1-r(b) does NOT converge to 10^{-1/2}=0.31623 in the measured window: it sits at a slightly ' +
    'larger value (local ~0.376 at b~3e3 down to ~0.347 at b~5e8) and drifts slowly DOWNWARD, and the ' +
    'global least-squares implied exponent is alpha~0.443-0.449 (per-decade 0.356-0.361), shallower than the ' +
    'pure -1/2. The structural diagnostics resolve it as the b^{-1/2} law WITH a positive log correction: ' +
    'res*sqrt(b) grows 4.61 -> 8.90 (not constant), and res(b) ~ b^{-1/2}(A + C log b) with A~0.47, C~0.0845, ' +
    'whose local slope -1/2 + C/(A+C log b) predicts per-decade 0.374 -> 0.345 (matching measurement). So the ' +
    'leading exponent IS -1/2 but the finite-window per-decade factor is genuinely larger, reaching 0.31623 ' +
    'only asymptotically (C/(A+C log b) ~ 1/log b -> 0). Refines the imp-97291 RESULT 4 / imp-97315 ' +
    '"~0.33-0.35 b^{-1/2}" reading. Measurement only; no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97327_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Dense-ladder per-decade measurement of 1-r(b): the ' +
  'shrink factor does NOT settle at 10^{-1/2}=0.31623 -- it sits above it (~0.376 -> ~0.347) and drifts ' +
  'down, because res(b) ~ b^{-1/2}(A+C log b) is the b^{-1/2} law with a positive 1/log b correction ' +
  '(leading exponent -1/2, reaching 0.31623 only asymptotically). Measurement only; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT
//    (fast O(2^omega) evaluator only; prime generation is O(sqrt b) trial division, trivial). --

const IMP97327_ASSERTIONS = [
  {
    id: 'imp97327-dense-ladder-reproduced-on-small-members',
    holds: () => {
      // Re-derive the consecutive-prime semiprime and its residual live on small rungs; match the baked res.
      for (const target of [3127, 9797, 55687]) {
        const [p, q] = consecutiveSemiprimeNear(target);
        const b = p * q;
        const row = IMP97327_RESULTS.denseLadder.find((r) => r.b === b);
        if (!row || row.p !== p || row.q !== q) return false;
        const res = resFromPrimes([p, q]);
        if (Math.abs(res - row.res) / row.res > 1e-4) return false;
      }
      return true;
    },
    why: 'the baked dense-ladder rungs are reproduced live by the fast evaluator on the small members (b=3127,9797,55687) to <1e-4 relative -- the table is not stale.',
  },
  {
    id: 'imp97327-per-decade-factor-above-and-drifts-toward-bsqrthalf',
    holds: () => {
      const L = IMP97327_RESULTS.denseLadder;
      const small = perDecadeFactor(L[0].b, L[0].res, L[1].b, L[1].res);
      const mid = perDecadeFactor(L[9].b, L[9].res, L[10].b, L[10].res);
      const large = perDecadeFactor(L[20].b, L[20].res, L[21].b, L[21].res);
      // every measured per-decade factor is ABOVE the pure b^{-1/2} constant, and it drifts DOWNWARD
      return small > 0.316 && mid > 0.316 && large > 0.316 &&
        small > mid && mid > large && small < 0.40 && large < 0.36;
    },
    why: 'the per-decade shrink factor stays strictly above 10^{-1/2}=0.31623 (small 0.376, mid 0.356, large 0.349) and drifts monotonically DOWNWARD toward it -- it does not settle at 0.31623 in the window.',
  },
  {
    id: 'imp97327-pure-bsqrthalf-diagnostic-fails-log-correction-grows',
    holds: () => {
      const L = IMP97327_RESULTS.denseLadder;
      // res*sqrt(b) is NOT constant -- it grows monotonically (the positive log correction).
      for (let i = 1; i < L.length; i++) if (!(L[i].resSqrtB > L[i - 1].resSqrtB)) return false;
      const growth = L[L.length - 1].resSqrtB / L[0].resSqrtB;
      return growth > 1.8 && growth < 2.0; // 8.895 / 4.612 ~ 1.93
    },
    why: 'the pure-b^{-1/2} diagnostic res*sqrt(b) grows monotonically 4.61 -> 8.90 (~1.93x) rather than staying constant -- direct evidence of the positive log correction to the b^{-1/2} law.',
  },
  {
    id: 'imp97327-honesty-gate-no-qed',
    holds: () =>
      IMP97327_VERDICT.anyBoundMoved === false &&
      IMP97327_VERDICT.postsRigorousCeiling === false &&
      IMP97327_VERDICT.qed === false &&
      IMP97327_VERDICT.measurementOnly === true &&
      IMP97327_VERDICT.convergesToBSqrtHalfInWindow === false &&
      IMP97327_VERDICT.perDecadeAboveBSqrtHalf === true &&
      IMP97327_VERDICT.logCorrectionPresent === true &&
      IMP97327_VERDICT.leadingExponentIsMinusHalf === true &&
      /NO QED/.test(IMP97327_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97327_HONEST_BANNER) &&
      /RH open/.test(IMP97327_HONEST_BANNER),
    why: 'measurement only -- the per-decade factor does not reach 0.31623 in-window (log correction to a -1/2 leading exponent); no rigorous ceiling posted, no bound moved, no QED.',
  },
];

for (const a of IMP97327_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97327-route-m-e1-perdecade-shrink-factor-logcorrection assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97327_KERNEL,
  results: IMP97327_RESULTS,
  verdict: IMP97327_VERDICT,
  banner: IMP97327_HONEST_BANNER,
};

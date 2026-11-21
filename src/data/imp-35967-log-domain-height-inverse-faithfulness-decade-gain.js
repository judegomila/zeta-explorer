/**
 * @module imp-35967-log-domain-height-inverse-faithfulness-decade-gain
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). Companion to imp-35947, which answered the
 * either/or of the imp-35892 R_direct NaN cliff: a log-domain reformulation of effectiveHeightForN
 * (Newton on x = log T, seed x0 = log(2pi) + log N - log(log N)) defers the RvM inverse s own
 * 2 pi . N seed overflow, but the R_direct pipeline gain is only ~0.8 decade and is ultimately capped
 * by the representability of N itself, never by the a-denormal underflow of the -a/(2-a) node.
 *
 * THE GAP imp-35947 LEFT (what this module closes)
 * ------------------------------------------------
 * imp-35947 reported the ~0.8-decade gain and checked the round-trip fidelity of the HEIGHT inverse
 * alone (forwardN(logDomainHeightForN(N)) vs N). It did NOT verify that the log-domain a node
 * a = exp(log(2 pi K) - x - log u) computes the SAME quantity as the stock path
 * a = 2 pi K / (T . u) in the region where BOTH are finite. Without that cross-check, the "~0.8-decade
 * gain" could in principle be the gain of computing a DIFFERENT function, not a pure representability
 * gain of the same one. This module measures that agreement, and separately quantifies the
 * height-inverse-ONLY decade gain (stock effectiveHeightForN s own overflow cliff vs the log-domain
 * inverse s), i.e. the literal "extra decades of representable HEIGHT a log-seed buys" the ticket asks.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 * 1. FAITHFULNESS. Across the ladder N = 10^13 .. 10^307 (below the stock cliff, both paths finite),
 *    the log-domain a node and the stock a node agree to a few ULP (max relative disagreement
 *    < 1e-12). The log-domain reformulation is therefore a faithful re-expression of the SAME a(N),
 *    not a different function -- so the deferral imp-35947 measured is a pure representability gain.
 * 2. HEIGHT-INVERSE DECADE GAIN. The stock effectiveHeightForN returns a finite positive T only up to
 *    N ~ 10^307.46 (its 2 pi . N seed overflows just past there); the log-domain inverse returns a
 *    finite positive T all the way to N = MAX_VALUE = 10^308.25. The height inverse ALONE thus gains
 *    ~0.8 decade of representable N -- the same magnitude as, and the upstream source of, the R_direct
 *    pipeline gain imp-35947 measured downstream.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855/imp-35892 surrogate. The log-domain
 * inverses here are LOCAL to this measurement -- they do NOT replace effectiveHeightForN in the live
 * mapping. Instantiates NO interval, ports nothing, derives no remainder, changes no bound.
 * imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35947-log-domain-height-seed-cliff-deferral (answered the either/or; left faithfulness untested)
 * @see imp-35892-rdirect-own-floor-departure-height (located the 10^307.46 NaN cliff as the seed overflow)
 * @see lambda-rh-height-mapping (stock effectiveHeightForN RvM inverse; 2 pi . N seed overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5707e8 (same amplitude family as imp-35855/imp-35892/imp-35947)

// Log-domain RvM inverse (same construction as imp-35947): Newton on x = log T against
// f(T) = (T/2pi)(log(T/2pi) - 1) - N = 0, df/dx = (u/2pi) . exp(x), so the finite double 2 pi . N is
// never materialized. Returns the log-height exponent x = log T so the a node can also stay log-domain.
function logHeightExponentForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return -Infinity;
  let x = LOG_TWO_PI + Math.log(N) - Math.log(Math.max(1, Math.log(N + TWO_PI)));
  const xMin = Math.log(TWO_PI * 1.0001);
  for (let i = 0; i < 80; i++) {
    const u = x - LOG_TWO_PI;
    if (!(u > 0)) { x = xMin; continue; }
    const T = Math.exp(x);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = (u / TWO_PI) * T;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    let dx = f / fp;
    if (dx > 2) dx = 2;
    if (dx < -2) dx = -2;
    x -= dx;
    if (!(x > xMin)) x = xMin;
    if (Math.abs(dx) < 1e-12) break;
  }
  return x;
}
const logDomainHeightForN = (N) => Math.exp(logHeightExponentForN(N));

// The two a(N) evaluations, sharing amplitude K and the SAME RvM root, differing only in overflow path.
const a_stockPath = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u); // forms the finite product T . u
};
const a_logDomainPath = (N) => {
  const x = logHeightExponentForN(N);
  const u = x - LOG_TWO_PI;
  return Math.exp(Math.log(TWO_PI * K_AMPL) - x - Math.log(u)); // T . u never formed
};

// (1) FAITHFULNESS ladder: both paths finite here, so agreement is a same-function cross-check.
const FAITHFULNESS_LADDER = [13, 50, 100, 150, 200, 250, 300, 305, 307];
const FAITHFULNESS_ROWS = FAITHFULNESS_LADDER.map((L) => {
  const N = Math.pow(10, L);
  const aStock = a_stockPath(N);
  const aLog = a_logDomainPath(N);
  const relErr = Math.abs(aLog - aStock) / Math.abs(aStock);
  return { log10_N: L, a_stock: +aStock.toExponential(6), a_log: +aLog.toExponential(6), rel_err: +relErr.toExponential(4) };
});
const A_AGREEMENT_MAX_RELERR = Math.max(...FAITHFULNESS_ROWS.map((r) => r.rel_err));

// (2) HEIGHT-INVERSE-only decade gain: last log10(N) where each inverse returns a finite positive T.
function lastFiniteHeightLog10N(heightFn) {
  let lo = 305;
  let hi = 309; // 10^309 overflows N itself -> +Infinity, an unambiguous non-finite bracket
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const T = heightFn(Math.pow(10, mid));
    if (Number.isFinite(T) && T > 0) lo = mid;
    else hi = mid;
  }
  return lo;
}
const STOCK_HEIGHT_CLIFF_LOG10N = lastFiniteHeightLog10N(effectiveHeightForN); // ~307.46 (2 pi . N seed overflow)
const LOGSEED_HEIGHT_CLIFF_LOG10N = lastFiniteHeightLog10N(logDomainHeightForN); // ~308.25 (= representability of N)
const HEIGHT_DECADES_GAINED = LOGSEED_HEIGHT_CLIFF_LOG10N - STOCK_HEIGHT_CLIFF_LOG10N; // ~0.8
const LOG10_N_MAX = Math.log10(Number.MAX_VALUE); // ~308.2547

const FAITHFUL_SAME_FUNCTION = A_AGREEMENT_MAX_RELERR < 1e-12;
const HEIGHT_INVERSE_GAINS_SUB_DECADE = HEIGHT_DECADES_GAINED > 0.5 && HEIGHT_DECADES_GAINED < 1.5;
const LOGSEED_REACHES_N_MAX = Math.abs(LOGSEED_HEIGHT_CLIFF_LOG10N - LOG10_N_MAX) < 0.01;

export const IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN = {
  id: 'imp-35967',
  proofSection: 'S-frontier',
  question:
    'Is the log-domain reformulation of effectiveHeightForN a FAITHFUL re-expression of the same a(N) ' +
    '(does a = exp(log(2 pi K) - x - log u) via log T agree with the stock a = 2 pi K / (T . u) where both ' +
    'are finite), and how many extra decades of representable HEIGHT does the log-seed inverse alone buy ' +
    'over the stock 2 pi . N seed? Measurement/diagnostic only, double precision; instantiates no ' +
    'interval; NO QED.',
  finding:
    'FAITHFUL: across N = 10^13 .. 10^307 (below the stock cliff, both paths finite) the log-domain a node ' +
    'and the stock a node agree to max relative disagreement ' +
    A_AGREEMENT_MAX_RELERR.toExponential(2) +
    ' (a few ULP), so the log-domain form computes the SAME a(N) -- the imp-35947 gain is a pure ' +
    'representability gain, not a change of quantity. HEIGHT-INVERSE DECADE GAIN: the stock ' +
    'effectiveHeightForN returns a finite positive T only to N ~ 10^' +
    STOCK_HEIGHT_CLIFF_LOG10N.toFixed(3) +
    ' (its 2 pi . N seed overflows just past there), while the log-domain inverse stays finite to ' +
    'N = MAX_VALUE = 10^' +
    LOGSEED_HEIGHT_CLIFF_LOG10N.toFixed(3) +
    ', a gain of ~' +
    HEIGHT_DECADES_GAINED.toFixed(2) +
    ' decade of representable height -- the upstream source of, and same magnitude as, the R_direct ' +
    'pipeline gain imp-35947 measured downstream. MEASUREMENT/DIAGNOSTIC, double precision; no interval.',
  constants: {
    K_ampl: +K_AMPL.toPrecision(15),
    C_C_pinned: +C_C_PINNED.toPrecision(15),
    E_trunc_PT: E_TRUNC_PT,
    max_double: Number.MAX_VALUE,
    log10_max_double: +LOG10_N_MAX.toFixed(6),
  },
  metric: {
    a_agreement_max_relerr: +A_AGREEMENT_MAX_RELERR.toExponential(4),
    stock_height_cliff_log10_N: +STOCK_HEIGHT_CLIFF_LOG10N.toFixed(6),
    logseed_height_cliff_log10_N: +LOGSEED_HEIGHT_CLIFF_LOG10N.toFixed(6),
    height_decades_gained: +HEIGHT_DECADES_GAINED.toFixed(4),
    faithful_same_function: FAITHFUL_SAME_FUNCTION,
    height_inverse_gains_sub_decade: HEIGHT_INVERSE_GAINS_SUB_DECADE,
    logseed_reaches_N_max: LOGSEED_REACHES_N_MAX,
  },
  faithfulnessLadder: FAITHFULNESS_ROWS,
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision cross-check that the log-domain a path is a ' +
    'faithful re-expression of the stock a path (agreement to a few ULP where both are finite) plus a ' +
    'measurement of the height-inverse-only decade gain (~0.8 decade, stock 10^307.46 -> log-domain ' +
    'N = MAX_VALUE). It instantiates NO interval, ports no operator, does not replace effectiveHeightForN ' +
    'in the live mapping, and does not touch F(m)=0. Changes no bound.',
  isRigorous: false,
  verdict:
    'THE LOG-DOMAIN a PATH IS A FAITHFUL RE-EXPRESSION OF THE STOCK a(N) (measurement/diagnostic, NOT an ' +
    'RH bound): max relative disagreement ' +
    A_AGREEMENT_MAX_RELERR.toExponential(2) +
    ' across N = 10^13 .. 10^307, so the imp-35947 ~0.8-decade deferral is a pure representability gain. ' +
    'The height inverse ALONE buys ~' +
    HEIGHT_DECADES_GAINED.toFixed(2) +
    ' decade (stock finite T to 10^' +
    STOCK_HEIGHT_CLIFF_LOG10N.toFixed(3) +
    ', log-domain to N = MAX_VALUE = 10^' +
    LOGSEED_HEIGHT_CLIFF_LOG10N.toFixed(3) +
    '). Reuses the imp-35855/imp-35892/imp-35947 machinery (same K, C_C, E_trunc, RvM root). imp-34714a ' +
    'REMAINS OPEN; C_C = (1/8) sqrt(3 pi) (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-35947 (log-domain seed defers the RvM inverse; ~0.8-decade R_direct gain, capped by N ' +
    'representability); imp-35892 (R_direct NaN cliff at 10^307.46 = the 2 pi . N seed overflow); ' +
    'lambda-rh-height-mapping (stock effectiveHeightForN RvM inverse). IEEE-754 double: ' +
    'MAX_VALUE ~ 1.7977e308 (10^308.255) -- standard float model.',
};

export const IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN_ASSERTIONS = [
  {
    // Faithfulness: log-domain a path agrees with the stock a path to a few ULP where both are finite.
    id: 'imp35967-logdomain-a-path-is-faithful-same-function',
    description: 'a_logDomainPath agrees with a_stockPath to < 1e-12 relative across N=10^13..10^307',
    holds: () => FAITHFUL_SAME_FUNCTION === true && A_AGREEMENT_MAX_RELERR < 1e-12,
  },
  {
    // Height-inverse-only decade gain: stock cliff ~10^307.46, log-domain reaches N = MAX_VALUE (~10^308.25).
    id: 'imp35967-height-inverse-gains-sub-decade-to-N-max',
    description: 'log-domain height inverse finite to N=MAX_VALUE; ~0.8-decade gain over the stock 2 pi . N seed',
    holds: () =>
      HEIGHT_INVERSE_GAINS_SUB_DECADE === true &&
      LOGSEED_REACHES_N_MAX === true &&
      STOCK_HEIGHT_CLIFF_LOG10N > 307 &&
      STOCK_HEIGHT_CLIFF_LOG10N < 307.5,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35967-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN.subGap) &&
      /NO QED/.test(IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN.verdict) &&
      /refereed bound is changed/i.test(IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN.verdict),
  },
];

for (const a of IMP35967_LOG_DOMAIN_HEIGHT_INVERSE_FAITHFULNESS_DECADE_GAIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35967-log-domain-height-inverse-faithfulness-decade-gain assertion failed: ${a.id}`);
  }
}

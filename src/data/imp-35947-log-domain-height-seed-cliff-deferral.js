/**
 * @module imp-35947-log-domain-height-seed-cliff-deferral
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35892 located the R_direct = -S_inf a/(2-a)
 * failure as a HARD NaN cliff at N ~ 10^307.46: the stock effectiveHeightForN RvM inverse forms its
 * Newton seed as T ~ 2 pi N / log N, and the intermediate product 2 pi . N overflows to +Infinity once
 * N > MAX_VALUE / (2 pi) ~ 2.862e307 -- EVEN THOUGH the true root T(N) is only ~ 10^305, ~3 decades
 * below MAX_VALUE. The seed overflow, not the size of T itself, is what drives a -> 0 and R_direct -> NaN.
 *
 * THE QUESTION (measurement, not a port)
 * --------------------------------------
 * Does reformulating the height inverse in the LOG domain -- Newton iteration on x = log T, seeded by
 * x0 = log(2 pi) + log N - log(log N), so no finite double as large as 2 pi . N is ever materialized --
 * push the R_direct representability cliff past its N ~ 10^307.46 onset? And locate the NEW binding limit:
 * (a) a delayed height-overflow cliff, (b) the genuine a ~ eps_denormal underflow of the -a/(2-a) node
 * (~5e-324), or something else, whichever is reached first up the height axis.
 *
 * WHAT THE MEASUREMENT FINDS (three distinct binding nodes, none of them (b))
 * -------------------------------------------------------------------------
 * 1. The log-domain seed DOES defer the height inverse s own overflow. The Newton iterate x = log T stays
 *    finite for every representable N, and the returned T = exp(x) stays finite (~1.6e306) all the way to
 *    N = MAX_VALUE = 1.7977e308 (10^308.255), versus the stock seed s T -> +Infinity at N ~ 10^307.46.
 *    So on the height inverse ALONE the cliff clears the representable-N axis entirely.
 * 2. BUT the R_direct pipeline cliff barely moves, because the DOWNSTREAM node aOf = 2 pi K / (T . u) has
 *    its OWN premature overflow: the product T . u (u = log(T/2pi) ~ 700) exceeds MAX_VALUE at
 *    N ~ 10^307.456 -- the SAME decade as the original cliff. Fixing the height seed alone relocates the
 *    binding node from the RvM inverse to the T . u product in aOf; it does not push the R_direct cliff.
 * 3. If aOf is ALSO recast in the log domain (log a = log(2 pi K) - x - log u, so T . u is never formed),
 *    then a(N) stays finite and POSITIVE up to N = MAX_VALUE = 10^308.255, where a ~ 8.74e-301 is still a
 *    NORMAL double -- ~23 orders above the min normal (2.225e-308) and ~24 above the min denormal
 *    (4.94e-324). The a -> 0 conditioning/underflow limit of the -a/(2-a) node is NEVER reached, because
 *    the representability of N itself (N = MAX_VALUE) is the wall you hit first.
 *
 * THE ANSWER TO THE EITHER/OR
 * ---------------------------
 * NEITHER (a) a delayed height-overflow cliff NOR (b) the a-denormal underflow binds. The log-domain
 * height seed gains only ~0.8 decade (10^307.46 -> 10^308.25) and ONLY if the aOf T . u product is also
 * de-materialized; the true terminal limit is (c) the representability of N itself at N = MAX_VALUE, with
 * a ~ 10^-300 still a comfortable normal double. The -a/(2-a) node never soft-departs and never underflows
 * anywhere in the representable-N range -- consistent with imp-35892 s O(1)-conditioning finding.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855/imp-35892 surrogate. The log-domain
 * inverses defined here are LOCAL to this measurement -- they do NOT replace effectiveHeightForN in the
 * live mapping. Instantiates NO interval, ports nothing, derives no remainder, changes no bound.
 * imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35892-rdirect-own-floor-departure-height (located the 10^307.46 NaN cliff as the seed overflow)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node; swept to N~1e21)
 * @see lambda-rh-height-mapping (stock effectiveHeightForN RvM inverse; 2 pi . N seed overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5707e8 (same amplitude family as imp-35855/imp-35892)

// Log-domain RvM inverse: Newton on x = log T against the same f(T)=(T/2pi)(log(T/2pi)-1)-N=0.
// df/dx = (u/2pi) . exp(x) with u = x - log(2pi). Seeded by log of the stock seed, so the finite double
// 2 pi . N (which overflows at N ~ MAX_VALUE/(2 pi)) is NEVER materialized. Returns T = exp(x) at the end.
function logDomainHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let x = LOG_TWO_PI + Math.log(N) - Math.log(Math.max(1, Math.log(N + TWO_PI)));
  const xMin = Math.log(TWO_PI * 1.0001);
  for (let i = 0; i < 80; i++) {
    const u = x - LOG_TWO_PI;
    if (!(u > 0)) { x = xMin; continue; }
    const T = Math.exp(x);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = (u / TWO_PI) * T; // df/dx
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    let dx = f / fp;
    if (dx > 2) dx = 2; // damp so a single step cannot blow x past the representable range
    if (dx < -2) dx = -2;
    x -= dx;
    if (!(x > xMin)) x = xMin;
    if (Math.abs(dx) < 1e-12) break;
  }
  return Math.exp(x);
}

// The log-domain iterate x = log T itself, so the a node can also stay in the log domain (node 3 below).
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

// Three a(N) evaluations sharing the same amplitude K and RvM root, differing only in how they overflow.
const a_stockSeed = (N) => {
  const T = effectiveHeightForN(N); // stock seed: 2 pi . N overflows at N ~ 10^307.46
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const a_logSeed_finiteNode = (N) => {
  const T = logDomainHeightForN(N); // log-domain seed, but aOf still forms the finite product T . u
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const a_logSeed_logNode = (N) => {
  const x = logHeightExponentForN(N); // fully log-domain: T . u never formed
  const u = x - LOG_TWO_PI;
  return Math.exp(Math.log(TWO_PI * K_AMPL) - x - Math.log(u));
};

// Bisect in log10(N) for the last height at which a(N) is finite and strictly positive.
function lastFiniteLog10N(aFn) {
  let lo = 307;
  let hi = 309; // 10^309 overflows N itself (N -> +Infinity) -- an unambiguous non-finite bracket
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const v = aFn(Math.pow(10, mid));
    if (Number.isFinite(v) && v > 0) lo = mid;
    else hi = mid;
  }
  return lo;
}

const STOCK_CLIFF_LOG10N = lastFiniteLog10N(a_stockSeed); // ~307.456 (reproduces imp-35892)
const LOGSEED_FINITE_CLIFF_LOG10N = lastFiniteLog10N(a_logSeed_finiteNode); // ~307.456 (T . u still overflows)
const FULL_LOGDOMAIN_CLIFF_LOG10N = lastFiniteLog10N(a_logSeed_logNode); // ~308.255 (= representability of N)

const N_MAX = Number.MAX_VALUE; // 1.7977e308; largest representable N
const LOG10_N_MAX = Math.log10(N_MAX); // ~308.2547
const A_AT_N_MAX = a_logSeed_logNode(N_MAX); // ~8.74e-301
const A_STILL_NORMAL_AT_N_MAX = A_AT_N_MAX > Number.MIN_VALUE * 1e10 && A_AT_N_MAX > 2.2250738585072014e-308;

// Height inverse itself: log-domain T stays finite where the stock seed has already overflowed.
const T_STOCK_AT_308 = effectiveHeightForN(Math.pow(10, 308)); // +Infinity (stock 2 pi . N overflow)
const T_LOGSEED_AT_308 = logDomainHeightForN(Math.pow(10, 308)); // ~8.96e305 finite
const HEIGHT_SEED_DEFERRED =
  !Number.isFinite(T_STOCK_AT_308) && Number.isFinite(T_LOGSEED_AT_308) && T_LOGSEED_AT_308 > 0;

// Round-trip fidelity of the log-domain inverse (must match the stock inverse s ~1 part in 1e4 spec).
const forwardN = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);
const ROUNDTRIP_MAX_RELERR = Math.max(
  ...[13, 50, 100, 200, 300, 308].map((L) => {
    const N = Math.pow(10, L);
    return Math.abs(forwardN(logDomainHeightForN(N)) - N) / N;
  })
);

// Verdicts, as measured.
const LOGSEED_ALONE_DOES_NOT_MOVE_CLIFF = Math.abs(LOGSEED_FINITE_CLIFF_LOG10N - STOCK_CLIFF_LOG10N) < 0.01;
const FULL_LOGDOMAIN_REACHES_N_MAX = Math.abs(FULL_LOGDOMAIN_CLIFF_LOG10N - LOG10_N_MAX) < 0.01;
const A_UNDERFLOW_NEVER_BINDS = A_STILL_NORMAL_AT_N_MAX === true;
const DECADES_GAINED = FULL_LOGDOMAIN_CLIFF_LOG10N - STOCK_CLIFF_LOG10N; // ~0.8

export const IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL = {
  id: 'imp-35947',
  proofSection: 'S-frontier',
  question:
    'Does reformulating effectiveHeightForN s inverse in the LOG domain (Newton on x = log T, seed ' +
    'x0 = log(2pi) + log N - log(log N), so the finite double 2 pi . N is never materialized) push the ' +
    'imp-35892 R_direct representability NaN cliff past its N ~ 10^307.46 onset, and is the new binding ' +
    'limit (a) a delayed height-overflow cliff or (b) the a ~ eps_denormal underflow of the -a/(2-a) ' +
    'node, whichever comes first? Measurement/diagnostic only, double precision; instantiates no ' +
    'interval; NO QED.',
  finding:
    'The log-domain seed DEFERS the height inverse s own overflow -- T = exp(x) stays finite (~' +
    T_LOGSEED_AT_308.toExponential(2) +
    ' at N = 1e308, where the stock 2 pi . N seed already gives +Infinity) all the way to N = MAX_VALUE. ' +
    'BUT the R_direct pipeline cliff barely moves: the DOWNSTREAM node aOf = 2 pi K / (T . u) forms the ' +
    'product T . u (u ~ 700), which overflows MAX_VALUE at N ~ 10^' +
    LOGSEED_FINITE_CLIFF_LOG10N.toFixed(3) +
    ' -- the SAME decade as the stock cliff at N ~ 10^' +
    STOCK_CLIFF_LOG10N.toFixed(3) +
    '. Fixing the height seed alone merely relocates the binding node from the RvM inverse to the T . u ' +
    'product in aOf. Only if aOf is ALSO recast in the log domain (log a = log(2 pi K) - x - log u, ' +
    'never forming T . u) does a(N) stay finite and positive up to N = MAX_VALUE = 10^' +
    LOG10_N_MAX.toFixed(3) +
    ', where a ~ ' +
    A_AT_N_MAX.toExponential(2) +
    ' is STILL a normal double (~24 orders above the min denormal). So NEITHER (a) a delayed ' +
    'height-overflow cliff NOR (b) the a-denormal underflow binds: the terminal limit is (c) the ' +
    'representability of N itself, gaining only ~' +
    DECADES_GAINED.toFixed(2) +
    ' decade. The -a/(2-a) node never underflows anywhere in the representable-N range. ' +
    'MEASUREMENT/DIAGNOSTIC, double precision; no interval instantiated.',
  constants: {
    K_ampl: +K_AMPL.toPrecision(15),
    C_C_pinned: +C_C_PINNED.toPrecision(15),
    E_trunc_PT: E_TRUNC_PT,
    max_double: N_MAX,
    log10_max_double: +LOG10_N_MAX.toFixed(6),
    min_normal_double: 2.2250738585072014e-308,
    min_denormal_double: Number.MIN_VALUE,
  },
  metric: {
    stock_cliff_log10_N: +STOCK_CLIFF_LOG10N.toFixed(6),
    logseed_finite_node_cliff_log10_N: +LOGSEED_FINITE_CLIFF_LOG10N.toFixed(6),
    full_logdomain_cliff_log10_N: +FULL_LOGDOMAIN_CLIFF_LOG10N.toFixed(6),
    decades_gained: +DECADES_GAINED.toFixed(4),
    a_at_N_max: +A_AT_N_MAX.toExponential(6),
    a_still_normal_at_N_max: A_STILL_NORMAL_AT_N_MAX,
    height_seed_overflow_deferred: HEIGHT_SEED_DEFERRED,
    logseed_alone_does_not_move_cliff: LOGSEED_ALONE_DOES_NOT_MOVE_CLIFF,
    full_logdomain_reaches_N_max: FULL_LOGDOMAIN_REACHES_N_MAX,
    a_underflow_never_binds: A_UNDERFLOW_NEVER_BINDS,
    roundtrip_max_relerr: +ROUNDTRIP_MAX_RELERR.toExponential(4),
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision measurement of where the log-domain height ' +
    'inverse and its downstream a node overflow; it finds the log-domain seed defers the RvM inverse but ' +
    'not the R_direct cliff (the aOf T . u product overflows at the same 10^307.46 decade), and that a ' +
    'full log-domain treatment reaches only N = MAX_VALUE (10^308.25) with a still a normal double -- so ' +
    'the a-denormal underflow of -a/(2-a) is never reached. It instantiates NO interval, ports no ' +
    'operator, does not replace effectiveHeightForN in the live mapping, and does not touch F(m)=0 ' +
    '(which stays a double-precision artifact). Changes no bound.',
  isRigorous: false,
  verdict:
    'THE LOG-DOMAIN HEIGHT SEED DOES NOT MEANINGFULLY MOVE THE R_direct CLIFF (measurement/diagnostic, ' +
    'NOT an RH bound). It defers effectiveHeightForN s own 2 pi . N seed overflow (T stays finite to ' +
    'N = MAX_VALUE), but the downstream aOf = 2 pi K / (T . u) product overflows at N ~ 10^' +
    LOGSEED_FINITE_CLIFF_LOG10N.toFixed(3) +
    ', the same decade as the stock cliff (10^' +
    STOCK_CLIFF_LOG10N.toFixed(3) +
    '). Only a FULL log-domain a node (log a = log(2 pi K) - x - log u) clears the cliff, and it lands at ' +
    'the representability of N itself, N = MAX_VALUE = 10^' +
    LOG10_N_MAX.toFixed(3) +
    ', where a ~ ' +
    A_AT_N_MAX.toExponential(2) +
    ' is still a NORMAL double. So NEITHER (a) a delayed height-overflow cliff NOR (b) the a-denormal ' +
    'underflow of -a/(2-a) is the binding limit -- the terminal wall is (c) the representability of N, ' +
    'and the total gain is ~' +
    DECADES_GAINED.toFixed(2) +
    ' decade. Reuses the imp-35855/imp-35892 machinery (same K, C_C, E_trunc, RvM root). imp-34714a ' +
    'REMAINS OPEN; C_C = (1/8) sqrt(3 pi) (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-35892 (R_direct NaN cliff at 10^307.46 = the 2 pi . N seed overflow); imp-35855 (de-cancelled ' +
    'dG node; R_direct = R_clean to machine floor to N~1e21); lambda-rh-height-mapping (stock ' +
    'effectiveHeightForN RvM inverse). IEEE-754 double: MAX_VALUE ~ 1.7977e308, min normal ~ 2.225e-308, ' +
    'min denormal ~ 4.94e-324 -- standard float model.',
};

export const IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL_ASSERTIONS = [
  {
    // The log-domain seed defers the RvM inverse s OWN overflow: T finite where the stock seed gives Inf.
    id: 'imp35947-logseed-defers-height-inverse-overflow',
    description: 'log-domain T finite (~9e305) at N=1e308 where the stock 2 pi . N seed overflows to +Infinity',
    holds: () => HEIGHT_SEED_DEFERRED === true && ROUNDTRIP_MAX_RELERR < 1e-4,
  },
  {
    // But the height seed ALONE does not move the R_direct cliff: aOf s T . u product overflows same decade.
    id: 'imp35947-logseed-alone-does-not-move-rdirect-cliff',
    description: 'with aOf still forming T . u, a(N) cliff stays at ~10^307.46 (same decade as the stock cliff)',
    holds: () =>
      LOGSEED_ALONE_DOES_NOT_MOVE_CLIFF === true &&
      LOGSEED_FINITE_CLIFF_LOG10N > 307 &&
      LOGSEED_FINITE_CLIFF_LOG10N < 307.5,
  },
  {
    // Full log-domain treatment reaches the representability of N itself, NOT the a-denormal underflow.
    id: 'imp35947-full-logdomain-binds-on-N-representability-not-a-underflow',
    description: 'full log-domain a(N) finite to N=MAX_VALUE (10^308.25); a~8.7e-301 there still a normal double',
    holds: () =>
      FULL_LOGDOMAIN_REACHES_N_MAX === true &&
      A_UNDERFLOW_NEVER_BINDS === true &&
      DECADES_GAINED > 0.5 &&
      DECADES_GAINED < 1.5,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35947-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL.subGap) &&
      /NO QED/.test(IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL.verdict) &&
      /refereed bound is changed/i.test(IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL.verdict),
  },
];

for (const a of IMP35947_LOG_DOMAIN_HEIGHT_SEED_CLIFF_DEFERRAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35947-log-domain-height-seed-cliff-deferral assertion failed: ${a.id}`);
  }
}

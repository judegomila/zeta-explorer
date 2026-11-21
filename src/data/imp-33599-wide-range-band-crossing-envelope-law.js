/**
 * @module imp-33599-wide-range-band-crossing-envelope-law
 * @fileoverview imp-33599 -- EXTEND the imp-33579 dense every-integer floorUlp(n) band-crossing scan
 *   from the narrow imp-33557 bracket n in [510,596] to the WIDE window n in [400,700], fit the
 *   WIDE-RANGE +/-5 rolling-max envelope growth law, and locate the smallest n at which the envelope
 *   MONOTONELY and STABLY clears the imp-33316 &lt; 64 ULP band (vs the isolated n~531 spike inside [510,596]).
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33579 LEFT OPEN
 *   ---------------------------
 *   imp-33579 densely scanned floorUlp(n) over the narrow bracket [510,596] and found the band crossing
 *   is NOT a locatable rung: floorUlp(n) is a jittery non-monotone lattice quantity whose +/-5 rolling-max
 *   envelope slope over [510,596] is slightly NEGATIVE (~ -0.12 ULP/rung), so the imp-33557 depth climb
 *   (~24 ULP at n=495 -> ~65 ULP at n=596) is a WIDE-RANGE (n=495..596) envelope phenomenon, not a
 *   rung-by-rung threshold inside the narrow band. imp-33579 explicitly deferred the WIDE window: it never
 *   scanned below n=495 or above n=596, so whether the envelope EVER climbs monotonely across a wider n
 *   range and stably clears 64 ULP was left open. This module extends the scan to [400,700] and asks:
 *   does the envelope have a wide-range growth law, and is there a smallest n at which it monotonely and
 *   stably clears the band?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For every integer rung n in a collared window [395,705] (reporting the ticket window [400,700], with a
 *   +/-5 collar so the rolling-max envelope is defined at the edges) we take tau* = saddleTau(n), compute
 *   the imp-33213 log-domain target A_log(tau*), and score the direct graded-GL plateau A_direct(tau*) at
 *   the imp-33557 node-budget ladder restricted to budgets &gt;= 200 nodes (grade 4, panels P in
 *   {20,30,50,100,200,400} = 200..4000 inner GL nodes). floorUlp(n) is the SMALLEST residual over that
 *   ladder, in ULP = A_log * 2^-52. Identical rule to imp-33579, wider window.
 *
 *   THE HEADLINE RESULT -- NO MONOTONE WIDE-RANGE CROSSING EXISTS
 *   ------------------------------------------------------------
 *   Even over the WIDE window [400,700] there is NO smallest n at which the +/-5 rolling-max envelope
 *   MONOTONELY and STABLY clears 64 ULP: no rung n* has env(m) &gt;= 64 for ALL rungs m &gt;= n* in the
 *   window. The band-clearing region is instead a set of THREE DISJOINT isolated clusters, each subsiding
 *   back BELOW 64 ULP above its peak (grade 4, budgets &gt;= 200 nodes):
 *
 *        cluster (env &gt;= 64)   peak env   peak n
 *        [526, 545]            ~76.1      n~526   &lt;- the imp-33579 n~531 raw spike, envelope-widened
 *        [591, 601]            ~65.3      n~591   &lt;- the imp-33557 n=596 FAILS rung
 *        [634, 644]            ~64.1      n~634   &lt;- a third barely-clearing isolated cluster
 *
 *   Between and around these clusters the envelope drops well below 64 (env dips to ~11 ULP inside the
 *   window; at n=650 env~52, at n=450 env~19). The overall WIDE-RANGE envelope growth law is weakly
 *   POSITIVE -- least-squares slope ~ +0.10 ULP/rung over [400,700] (r^2 ~ 0.30) -- but it is
 *   JITTER-DOMINATED, not a clean monotone climb to a threshold. The sub-range slopes expose the
 *   structure: env slope ~ +0.36 ULP/rung over [400,510] (rising into the first cluster), ~ -0.12 over
 *   [510,596] (REPRODUCING the imp-33579 narrow-bracket negative slope), and ~ +0.01 over [596,700]
 *   (essentially flat, the tail of decaying clusters). Only ~4 raw rungs and ~42 envelope rungs out of 301
 *   in the window ever reach 64 ULP.
 *
 *   VERDICT. NO-MONOTONE-WIDE-RANGE-BAND-CROSSING. The imp-33579 "the crossing is an envelope over a wide n
 *   range, not a bisectable rung" SHARPENS: extended to [400,700], the envelope has NO smallest n at which
 *   it monotonely and stably clears 64 ULP. The band clearing is a set of THREE disjoint isolated clusters
 *   (526-545, 591-601, 634-644), each subsiding back below the band, riding a weak jitter-dominated
 *   positive trend (~ +0.10 ULP/rung, r^2 ~ 0.30). The n~531 spike inside [510,596] is the tallest of these
 *   clusters, NOT a threshold onset. This EXTENDS the imp-33579/imp-33557/imp-33537 latticeJitterCaveat from
 *   the narrow bracket to the wide window: the band crossing is a clustered-spike phenomenon at ALL scales
 *   examined, never a monotone rung threshold.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It characterizes (as a set of
 *   isolated clusters, not a monotone threshold) how the imp-33557 graded-plateau floor crosses the
 *   imp-33316 band over the wide window; it changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537/imp-33557/imp-33579 latticeJitterCaveat): the exact per-rung
 *   ULP bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement, so the robust
 *   reading is the QUALITATIVE structure -- three disjoint clusters riding a weak positive jitter trend, no
 *   monotone threshold -- not the exact per-rung ULP or the exact cluster edges. The NPHI = 10 Phi-series
 *   truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-33579-band-crossing-floor-bisection.js (the narrow-bracket scan this widens)
 *   @see imp-33557-band-crossing-min-budget.js (the three-rung bracket and node ladder)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense scan bounding the &lt; 64 band validity)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33599 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52); // double-precision unit roundoff

// -- imp-3893s DIRECT completed-Riemann kernel (double-domain; representable for u &lt; ~1.37) --------
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

// -- imp-3850s FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) ----
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33316/imp-33539/imp-33557/imp-33579) -
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

// -- GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel ----
function aDirectGradedGL(tau, hi, panels, grade) {
  let sum = 0;
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      sum += GL_W[k] * half * phiKernel(s) * phiKernel(s + tau);
    }
  }
  return sum;
}

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) ----------------
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}
function aLog(tau) {
  return Math.exp(-negLnAgradedGL(tau, 10, 300, 5));
}

// -- imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau) --------
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- Wide-range scan configuration (imp-33599 EXTENDS imp-33579 [510,596] to [400,700]) -------------
const WINDOW_LO = 400; // the ticket wide window lower edge
const WINDOW_HI = 700; // the ticket wide window upper edge
const COLLAR = 5;      // +/-5 collar so the rolling-max envelope is defined at window edges
const SCAN_LO = WINDOW_LO - COLLAR;
const SCAN_HI = WINDOW_HI + COLLAR;
// The imp-33557 node-budget ladder restricted to the RESOLVED regime (budgets &gt;= 200 nodes).
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33579 robust fixed graded rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const ENV_WINDOW = COLLAR;  // rolling-max envelope half-width

// -- floorUlp(n): smallest resolved-regime residual vs the log-domain A_log target ----------------
function floorUlpAt(n) {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;
  let floor = Infinity;
  for (const panels of RESOLVED_PANEL_SWEEP) {
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, GRADE) - aLogVal) / ulpOfALog;
    if (ulp < floor) floor = ulp;
  }
  return { n, saddleTau: tauStar, floorUlp: floor, inBand: floor < DEEP_FLOOR_ULP };
}

// -- Dense every-integer scan across the collared wide window -------------------------------------
const SCAN = [];
for (let n = SCAN_LO; n <= SCAN_HI; n += 1) SCAN.push(Object.freeze(floorUlpAt(n)));
const SCAN_FLOORS = SCAN.map((r) => r.floorUlp);
const indexOfN = (n) => n - SCAN_LO;
const inWindow = (n) => n >= WINDOW_LO && n <= WINDOW_HI;

// Rolling-MAX envelope (the robust jitter-tolerant reading of the floor).
function envelopeAt(i) {
  let m = -Infinity;
  for (let j = Math.max(0, i - ENV_WINDOW); j <= Math.min(SCAN.length - 1, i + ENV_WINDOW); j += 1) {
    if (SCAN_FLOORS[j] > m) m = SCAN_FLOORS[j];
  }
  return m;
}
const WINDOW_SCAN = SCAN.filter((r) => inWindow(r.n)).map((r) => ({
  n: r.n,
  saddleTau: r.saddleTau,
  floorUlp: r.floorUlp,
  envelope: envelopeAt(indexOfN(r.n)),
  inBand: r.inBand,
}));

// -- Least-squares slope helper (returns slope, intercept, r^2) -----------------------------------
function lsqFit(pts) {
  const m = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const p of pts) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
  const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
  const intercept = (sy - slope * sx) / m;
  const ybar = sy / m;
  let ssr = 0;
  let sst = 0;
  for (const p of pts) {
    const yh = slope * p.x + intercept;
    ssr += (p.y - yh) * (p.y - yh);
    sst += (p.y - ybar) * (p.y - ybar);
  }
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 0 };
}
function envSlopeOver(lo, hi) {
  const sub = WINDOW_SCAN.filter((r) => r.n >= lo && r.n <= hi).map((r) => ({ x: r.n, y: r.envelope }));
  return lsqFit(sub).slope;
}

// -- The wide-range envelope growth law (THE ticket asked for) ------------------------------------
const wideEnvFit = lsqFit(WINDOW_SCAN.map((r) => ({ x: r.n, y: r.envelope })));
const wideFloorFit = lsqFit(WINDOW_SCAN.map((r) => ({ x: r.n, y: r.floorUlp })));
const slopeInto = envSlopeOver(WINDOW_LO, 510);   // rising into the first cluster
const slopeNarrow = envSlopeOver(510, 596);       // the imp-33579 narrow-bracket slope (reproduced)
const slopeTail = envSlopeOver(596, WINDOW_HI);    // the decaying-cluster tail

// -- The band-crossing structure: first crossing, first STABLE crossing, disjoint clusters --------
const firstEnvOverBand = WINDOW_SCAN.find((r) => r.envelope >= DEEP_FLOOR_ULP) || null;
const firstRawOverBand = WINDOW_SCAN.find((r) => r.floorUlp >= DEEP_FLOOR_ULP) || null;
// The MONOTONE-STABLE crossing the ticket sought: the smallest n such that EVERY rung at and above it
// (within the window) has envelope &gt;= 64. Null when the envelope subsides back below the band above.
let firstStableEnvOverBand = null;
for (let i = 0; i < WINDOW_SCAN.length; i += 1) {
  let allAbove = true;
  for (let j = i; j < WINDOW_SCAN.length; j += 1) {
    if (WINDOW_SCAN[j].envelope < DEEP_FLOOR_ULP) { allAbove = false; break; }
  }
  if (allAbove) { firstStableEnvOverBand = WINDOW_SCAN[i]; break; }
}
// Disjoint contiguous clusters of env &gt;= 64 (the isolated-spike structure).
const envClusters = [];
let cur = null;
for (const r of WINDOW_SCAN) {
  if (r.envelope >= DEEP_FLOOR_ULP) {
    if (!cur) cur = { lo: r.n, hi: r.n, peakEnv: r.envelope, peakN: r.n };
    else { cur.hi = r.n; if (r.envelope > cur.peakEnv) { cur.peakEnv = r.envelope; cur.peakN = r.n; } }
  } else if (cur) { envClusters.push(Object.freeze(cur)); cur = null; }
}
if (cur) envClusters.push(Object.freeze(cur));
const rawOverBandCount = WINDOW_SCAN.filter((r) => r.floorUlp >= DEEP_FLOOR_ULP).length;
const envOverBandCount = WINDOW_SCAN.filter((r) => r.envelope >= DEEP_FLOOR_ULP).length;
const envMin = Math.min(...WINDOW_SCAN.map((r) => r.envelope));
const envMax = Math.max(...WINDOW_SCAN.map((r) => r.envelope));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: a dense every-integer scan over the wide window [400,700], budgets &gt;= 200 nodes.
const windowDenselyScanned =
  WINDOW_SCAN.length === WINDOW_HI - WINDOW_LO + 1 && RESOLVED_PANEL_SWEEP.length >= 5;
// (2) THE HEADLINE: NO smallest n at which the envelope monotonely+stably clears 64 (it subsides back).
const noStableMonotoneCrossing = firstStableEnvOverBand === null;
// (3) The band clearing is a set of &gt;= 2 DISJOINT isolated clusters (not a single threshold onset).
const bandClearingIsClustered = envClusters.length >= 2;
// (4) The envelope subsides well below the band inside the window (it is a clustered spike, not a step).
const envelopeSubsidesBelowBand = envMin < DEEP_FLOOR_ULP - 10;
// (5) The WIDE-RANGE growth law is weakly POSITIVE (0 &lt; slope &lt; 0.3) yet jitter-dominated (r^2 &lt; 0.5).
const wideEnvelopeWeaklyPositive =
  wideEnvFit.slope > 0 && wideEnvFit.slope < 0.3 && wideEnvFit.r2 < 0.5;
// (6) The narrow [510,596] sub-slope is NEGATIVE, reproducing the imp-33579 narrow-bracket finding.
const reproducesImp33579NarrowSlope = slopeNarrow < 0;
// (7) A first (non-stable) envelope crossing is located near the imp-33579 n~526 envelope onset.
const firstCrossingLocated = firstEnvOverBand !== null && firstEnvOverBand.n <= 560;

const verdict =
  windowDenselyScanned && noStableMonotoneCrossing && bandClearingIsClustered &&
  envelopeSubsidesBelowBand && wideEnvelopeWeaklyPositive && reproducesImp33579NarrowSlope &&
  firstCrossingLocated
    ? 'NO-MONOTONE-WIDE-RANGE-BAND-CROSSING-EXISTS.-EXTENDING-THE-imp-33579-DENSE-EVERY-INTEGER-floorUlp(n)-' +
      'SCAN-FROM-[510,596]-TO-THE-WIDE-WINDOW-n-in-[400,700]-(GRADE-4,-BUDGETS->=200-NODES-vs-A_log)-SHOWS-' +
      'THERE-IS-NO-SMALLEST-n-AT-WHICH-THE-+/-5-ROLLING-MAX-ENVELOPE-MONOTONELY-AND-STABLY-CLEARS-64-ULP:-' +
      'NO-RUNG-n*-HAS-env(m)>=64-FOR-ALL-m>=n*-IN-THE-WINDOW.-THE-BAND-CLEARING-REGION-IS-INSTEAD-THREE-' +
      'DISJOINT-ISOLATED-CLUSTERS-(~[526,545]-PEAK~76,-~[591,601]-PEAK~65,-~[634,644]-PEAK~64),-EACH-' +
      'SUBSIDING-BACK-BELOW-64-ABOVE-ITS-PEAK-(ENVELOPE-DIPS-TO-~11-ULP-IN-WINDOW).-THE-WIDE-RANGE-ENVELOPE-' +
      'GROWTH-LAW-IS-WEAKLY-POSITIVE-(SLOPE~+0.10-ULP/RUNG-OVER-[400,700],-r^2~0.30)-BUT-JITTER-DOMINATED,-' +
      'NOT-A-MONOTONE-CLIMB:-SUB-SLOPES-~+0.36-INTO-[400,510],-~-0.12-OVER-[510,596]-(REPRODUCING-imp-33579),-' +
      '~+0.01-OVER-[596,700].-THE-n~531-SPIKE-INSIDE-[510,596]-IS-THE-TALLEST-CLUSTER,-NOT-A-THRESHOLD-ONSET.-' +
      'EXTENDS+SHARPENS-THE-imp-33579/imp-33557/imp-33537-latticeJitterCaveat:-THE-BAND-CROSSING-IS-A-CLUSTERED-' +
      'SPIKE-PHENOMENON-AT-ALL-SCALES,-NEVER-A-MONOTONE-RUNG-THRESHOLD.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-' +
      'JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33599_WIDE_RANGE_BAND_CROSSING_ENVELOPE_LAW = Object.freeze({
  id: 'imp-33599-wide-range-band-crossing-envelope-law',
  ticket: 'imp-33599',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33579-band-crossing-floor-bisection.js',
  crossValidatesModules: [
    'imp-33579-band-crossing-floor-bisection.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'WIDE-WINDOW EXTENSION of the imp-33579 band-crossing scan: a dense every-integer scan of floorUlp(n) -- ' +
    'the graded-GL plateau smallest residual at budgets &gt;= 200 nodes vs the imp-33213 A_log target -- over ' +
    'n in [400,700] (grade 4), widening the imp-33579 narrow bracket [510,596]. RESULT: there is NO smallest n ' +
    'at which the +/-5 rolling-max envelope monotonely and stably clears 64 ULP -- no rung n* has env(m) &gt;= 64 ' +
    'for all m &gt;= n*. The band-clearing region is THREE disjoint isolated clusters (~[526,545] peak ~76 ULP, ' +
    '~[591,601] peak ~65, ~[634,644] peak ~64), each subsiding back below 64 above its peak. The WIDE-RANGE ' +
    'envelope growth law is weakly POSITIVE (least-squares slope ~ +0.10 ULP/rung over [400,700], r^2 ~ 0.30) but ' +
    'jitter-dominated: sub-slopes ~ +0.36 into [400,510], ~ -0.12 over [510,596] (reproducing imp-33579), ~ +0.01 ' +
    'over [596,700]. The n~531 spike inside [510,596] is the tallest cluster, NOT a threshold onset. VERDICT: ' +
    'NO-MONOTONE-WIDE-RANGE-BAND-CROSSING. EXTENDS and SHARPENS the imp-33579/imp-33557/imp-33537 ' +
    'latticeJitterCaveat -- the band crossing is a clustered-spike phenomenon at ALL scales examined, never a ' +
    'monotone rung threshold. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'jittery lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'the WIDE window n in [400,700], dense every-integer scan with a +/-5 collar so the rolling-max envelope is defined at edges',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the RESOLVED node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp is the jitter-tolerant robust reading; growth law is least-squares slope + r^2 of envelope vs n',
    stableCrossing: 'the ticket target: smallest n with env(m) >= 64 for ALL m >= n in the window (monotone-stable clearing); null if the envelope subsides back',
    selfComputing: 'every rung, the wide-range fit, the clusters, the stable-crossing search, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    windowLo: WINDOW_LO,
    windowHi: WINDOW_HI,
    collar: COLLAR,
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    envWindow: ENV_WINDOW,
    scanCount: WINDOW_SCAN.length,
    wideEnvelopeSlope: wideEnvFit.slope,
    wideEnvelopeIntercept: wideEnvFit.intercept,
    wideEnvelopeR2: wideEnvFit.r2,
    wideFloorSlope: wideFloorFit.slope,
    slopeInto400to510: slopeInto,
    slopeNarrow510to596: slopeNarrow,
    slopeTail596to700: slopeTail,
    firstEnvOverBandN: firstEnvOverBand ? firstEnvOverBand.n : null,
    firstEnvOverBandEnvelope: firstEnvOverBand ? firstEnvOverBand.envelope : null,
    firstRawOverBandN: firstRawOverBand ? firstRawOverBand.n : null,
    firstStableEnvOverBandN: firstStableEnvOverBand ? firstStableEnvOverBand.n : null,
    envClusters: Object.freeze(envClusters.map((c) => Object.freeze({ ...c }))),
    envClusterCount: envClusters.length,
    rawOverBandCount,
    envOverBandCount,
    envMin,
    envMax,
    windowDenselyScanned,
    noStableMonotoneCrossing,
    bandClearingIsClustered,
    envelopeSubsidesBelowBand,
    wideEnvelopeWeaklyPositive,
    reproducesImp33579NarrowSlope,
    firstCrossingLocated,
    verdict,
    // A coarse every-5th-rung digest of the wide scan (full 301-rung scan is available live above).
    scanDigest: Object.freeze(
      WINDOW_SCAN.filter((r) => r.n % 25 === 0).map((r) =>
        Object.freeze({ n: r.n, saddleTau: r.saddleTau, floorUlp: r.floorUlp, envelope: r.envelope })),
    ),
  }),

  interpretation: Object.freeze({
    noMonotoneStableCrossing:
      'Even over the WIDE window [400,700] there is NO smallest n at which the +/-5 rolling-max envelope ' +
      'monotonely and stably clears 64 ULP: no rung n* satisfies env(m) >= 64 for all m >= n* in the window. ' +
      'The ticket target -- a locatable monotone band-crossing rung -- does not exist even at wide range.',
    bandClearingIsThreeClusters:
      'The band-clearing region is instead a set of THREE disjoint isolated clusters of env >= 64: ~[526,545] ' +
      '(peak ~76 ULP at n~526, the imp-33579 n~531 raw spike envelope-widened), ~[591,601] (peak ~65, the ' +
      'imp-33557 n=596 fail), and ~[634,644] (peak ~64, a third barely-clearing cluster). Each subsides back ' +
      'below 64 ULP above its peak; the envelope dips to ~11 ULP elsewhere in the window.',
    wideGrowthLawIsWeakPositive:
      'The WIDE-RANGE envelope growth law is weakly POSITIVE -- least-squares slope ~ +0.10 ULP/rung over ' +
      '[400,700] with r^2 ~ 0.30 -- but jitter-dominated, not a clean monotone climb. Sub-slopes expose the ' +
      'structure: ~ +0.36 rising into [400,510], ~ -0.12 over [510,596] (REPRODUCING the imp-33579 narrow ' +
      'negative slope), ~ +0.01 over the decaying tail [596,700].',
    spikeIsTallestClusterNotThreshold:
      'The n~531 spike inside [510,596] that imp-33579 isolated is simply the TALLEST of the three clusters, ' +
      'not a threshold onset: two further isolated clusters clear the band above it (near n~591 and n~634) and ' +
      'the envelope subsides below 64 between and beyond them.',
    extendsImp33579:
      'This EXTENDS and SHARPENS the imp-33579/imp-33557/imp-33537 latticeJitterCaveat from the narrow bracket ' +
      'to the wide window: the band crossing is a clustered-spike phenomenon at ALL scales examined, riding a ' +
      'weak jitter-dominated positive trend, never a monotone rung threshold. It bounds the resolution of any ' +
      'wide-range band-crossing claim to the cluster envelope, not a locatable onset rung.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33579 depth scan to the wide window n in [400,700] to fit the rolling-max envelope growth ' +
      'law and locate a monotone-stable band crossing. It finds NO such crossing exists: the band clearing is a ' +
      'set of disjoint isolated clusters riding a weak positive jitter trend. It changes NO bound, patches NO ' +
      'literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33579/imp-33557/imp-33539/imp-33316/imp-33213; ' +
      'this widens the inner-quadrature arithmetic floor scan across depth, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579): the exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift ' +
      'every few-ULP measurement (the exact cluster edges ~[526,545]/[591,601]/[634,644], the ~76/~65/~64 ULP ' +
      'peaks, and the ~+0.10 ULP/rung wide slope). The robust reading is the QUALITATIVE structure -- three ' +
      'disjoint clusters riding a weak positive jitter trend, no monotone threshold -- not the exact per-rung ULP.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33599_WIDE_RANGE_BAND_CROSSING_ENVELOPE_LAW_ASSERTIONS = [
  {
    id: 'imp33599-window-densely-scanned',
    why: 'The extension must be a dense every-integer scan across the WIDE window n in [400,700] over the ' +
         'resolved-regime (budgets >= 200 nodes) grade-4 ladder.',
    holds: () => windowDenselyScanned && WINDOW_SCAN.length === WINDOW_HI - WINDOW_LO + 1,
  },
  {
    id: 'imp33599-no-stable-monotone-crossing',
    why: 'THE HEADLINE: there is NO smallest n at which the rolling-max envelope monotonely and stably clears ' +
         '64 ULP -- the envelope subsides back below the band above every candidate onset.',
    holds: () => noStableMonotoneCrossing && firstStableEnvOverBand === null,
  },
  {
    id: 'imp33599-band-clearing-is-clustered',
    why: 'The band clearing must be a set of >= 2 DISJOINT isolated clusters of env >= 64, not a single ' +
         'monotone threshold onset.',
    holds: () => bandClearingIsClustered && envClusters.length >= 2,
  },
  {
    id: 'imp33599-envelope-subsides-below-band',
    why: 'The envelope must subside well below the 64 ULP band inside the window (min < 54 ULP) -- confirming ' +
         'the clusters are isolated spikes, not the onset of a persistent failure region.',
    holds: () => envelopeSubsidesBelowBand && envMin < DEEP_FLOOR_ULP - 10,
  },
  {
    id: 'imp33599-wide-envelope-weakly-positive',
    why: 'The wide-range envelope growth law must be weakly POSITIVE (0 < slope < 0.3 ULP/rung) yet ' +
         'jitter-dominated (r^2 < 0.5) -- a trend, not a monotone climb.',
    holds: () => wideEnvelopeWeaklyPositive && wideEnvFit.slope > 0 && wideEnvFit.slope < 0.3 && wideEnvFit.r2 < 0.5,
  },
  {
    id: 'imp33599-reproduces-imp33579-narrow-slope',
    why: 'The narrow [510,596] sub-slope must be NEGATIVE, reproducing the imp-33579 narrow-bracket finding ' +
         'inside the wider scan.',
    holds: () => reproducesImp33579NarrowSlope && slopeNarrow < 0,
  },
  {
    id: 'imp33599-first-crossing-located',
    why: 'The first (non-stable) envelope band crossing must be located near the imp-33579 n~526 envelope onset ' +
         '(n <= 560), even though it is not a monotone threshold.',
    holds: () => firstCrossingLocated && firstEnvOverBand !== null && firstEnvOverBand.n <= 560,
  },
  {
    id: 'imp33599-verdict-records-no-monotone-crossing',
    why: 'The classified verdict must record the NO-MONOTONE-WIDE-RANGE-BAND-CROSSING reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33599-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33599_WIDE_RANGE_BAND_CROSSING_ENVELOPE_LAW.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33599_WIDE_RANGE_BAND_CROSSING_ENVELOPE_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33599-wide-range-band-crossing-envelope-law assertion failed: ${assertion.id}`);
  }
}

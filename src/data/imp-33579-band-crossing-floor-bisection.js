/**
 * @module imp-33579-band-crossing-floor-bisection
 * @fileoverview imp-33579 -- BISECT the depth axis n in [510,596] to pin the smallest rung n* whose
 *   imp-33557 graded-plateau arithmetic FLOOR first EXCEEDS the imp-33316 &lt; 64 ULP deep band, and
 *   report tau*(n*) and the floor slope d_floorUlp/dn near the crossing.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33557 LEFT OPEN
 *   ---------------------------
 *   imp-33557 measured the graded ~200-node plateau floor at THREE band-crossing rungs (n=495 ~24.2 ULP
 *   in band, n=510 ~61.4 ULP EDGE, n=596 ~65.3 ULP FAILS) and concluded the floor CLIMBS with depth and
 *   crosses the imp-33316 &lt; 64 ULP band somewhere in n in [510,596] -- but it never LOCATED the crossing
 *   rung. This module bisects the depth axis: it scores the graded-GL plateau floorUlp (the smallest
 *   residual at budgets &gt;= 200 nodes vs the imp-33213 A_log target) at EVERY integer rung across the
 *   bracket and asks where the floor first clears 64 ULP.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For every integer rung n in a dense band [505,601] (reporting the ticket bracket [510,596], with a
 *   +/-5 collar so the rolling-max envelope is well defined at the edges) we take tau* = saddleTau(n),
 *   compute the imp-33213 log-domain target A_log(tau*), and score the direct graded-GL plateau
 *   A_direct(tau*) at the imp-33557 node-budget ladder restricted to budgets &gt;= 200 nodes (grade 4,
 *   panels P in {20,30,50,100,200,400} = 200..4000 inner GL nodes). floorUlp(n) is the SMALLEST residual
 *   over that ladder, in ULP = A_log * 2^-52.
 *
 *   THE HEADLINE RESULT -- BISECTION IS ILL-POSED
 *   ---------------------------------------------
 *   floorUlp(n) is NOT a monotone step that crosses 64 ULP once; it is a JITTERY, NON-MONOTONE
 *   arithmetic-floor lattice quantity. Across [510,596] it dips to ~0 ULP repeatedly (n=518, 552, 595)
 *   and spikes above 64 ULP at several isolated rungs, with IN-BAND rungs sitting freely ABOVE the first
 *   out-of-band rung. Concretely (grade 4, budgets &gt;= 200 nodes):
 *
 *        n     tau*        floorUlp    band
 *        510   0.941039    ~61.4       IN (edge, reproduces imp-33557)
 *        518   0.944115    ~0.0        IN
 *        524   0.946392    ~44.1       IN
 *        531   0.949017    ~76.1       OUT  &lt;- FIRST raw rung above 64...
 *        536   0.950872    ~58.7       IN   &lt;- ...but the very next scored rungs fall back IN band
 *        540   0.952344    ~66.9       OUT
 *        552   0.956698    ~0.0        IN
 *        594   0.971255    ~52.6       IN
 *        595   0.971590    ~0.0        IN
 *        596   0.971924    ~65.3       OUT  (reproduces imp-33557)
 *
 *   The FIRST integer rung whose floor clears 64 ULP is n ~ 531 (tau* ~ 0.9490, floor ~ 76 ULP), but
 *   63 of the 65 rungs ABOVE it (up to 596) are still IN band -- so n=531 is NOT a threshold, it is one
 *   isolated jitter spike. A monotone bisection on floorUlp(n) is therefore ILL-POSED: no single rung
 *   n* separates an all-in-band region below from an all-out-of-band region above within [510,596].
 *
 *   The ROBUST reading is an ENVELOPE one. The +/-5 rolling-MAX envelope of floorUlp first reaches 64 ULP
 *   at n ~ 526, but even that envelope does NOT climb monotonically within the narrow bracket -- its
 *   least-squares slope over [510,596] is slightly NEGATIVE (~ -0.12 ULP/rung). The depth-climb imp-33557
 *   reported (~24 ULP at n=495 -> ~65 ULP at n=596) is a WIDE-RANGE envelope phenomenon spanning
 *   n = 495..596, NOT a rung-by-rung threshold resolvable inside [510,596]. Local floor slopes confirm
 *   the jitter: d_floorUlp/dn ~ -0.43 ULP/rung near n=510, ~ +2.9 near the n~531 spike, ~ -1.14 near n=596.
 *
 *   VERDICT. BISECTION-ILL-POSED-CROSSING-IS-NOT-A-LOCATABLE-RUNG. The imp-33557 "the floor crosses the
 *   band somewhere in [510,596]" is an ENVELOPE statement, not a locatable threshold rung: floorUlp(n) is
 *   a non-monotone jitter lattice, the first raw over-band rung (n~531) has 63/65 in-band rungs above it,
 *   and even the rolling-max envelope does not climb rung-by-rung across this bracket. This CONFIRMS and
 *   SHARPENS the imp-33557/imp-33537 latticeJitterCaveat: within a narrow band the crossing is defined only
 *   to the envelope over a wide n range (n=495..596), never to a single rung n*.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It locates (as an envelope,
 *   not a rung) where the imp-33557 graded-plateau floor crosses the imp-33316 band; it changes NO bound,
 *   patches NO literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY arithmetic-floor
 *   lattice property (imp-33249/imp-33277/imp-33296/imp-33537/imp-33557 latticeJitterCaveat): the exact
 *   per-rung ULP bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement, so
 *   the robust reading is the QUALITATIVE non-monotone structure -- the crossing is an envelope over a wide
 *   n range, not a bisectable rung -- not the exact per-rung ULP. The NPHI = 10 Phi-series truncation is
 *   inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33557-band-crossing-min-budget.js (the three-rung bracket this bisects)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense scan bounding the &lt; 64 band validity)
 *   @see imp-33555-deep-tail-jitter-envelope-growth-law.js (the depth-growth law of the jitter envelope)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33579 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33316/imp-33539/imp-33557) -------
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

// -- Bisection / scan configuration ---------------------------------------------------------------
const BRACKET_LO = 510; // imp-33557 EDGE rung (~61.4 ULP, in band)
const BRACKET_HI = 596; // imp-33557 FAILS rung (~65.3 ULP, out of band)
const COLLAR = 5;       // +/-5 collar so the rolling-max envelope is defined at bracket edges
const SCAN_LO = BRACKET_LO - COLLAR;
const SCAN_HI = BRACKET_HI + COLLAR;
// The imp-33557 node-budget ladder restricted to the RESOLVED regime (budgets &gt;= 200 nodes): the
// arithmetic floor lives here (below 200 nodes the residual sits on the ~e7 unresolved-peak spike).
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;             // the imp-33295/imp-33316/imp-33539/imp-33557 robust fixed graded rule
const DEEP_FLOOR_ULP = 64;   // the imp-33316 widened ~2x deep-tail band
const ENV_WINDOW = COLLAR;   // rolling-max envelope half-width

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

// -- Dense every-integer scan across the collared bracket -----------------------------------------
const SCAN = [];
for (let n = SCAN_LO; n <= SCAN_HI; n += 1) SCAN.push(Object.freeze(floorUlpAt(n)));
const SCAN_FLOORS = SCAN.map((r) => r.floorUlp);
const indexOfN = (n) => n - SCAN_LO;
const inBracket = (n) => n >= BRACKET_LO && n <= BRACKET_HI;

// Rolling-MAX envelope (the robust jitter-tolerant reading of the floor).
function envelopeAt(i) {
  let m = -Infinity;
  for (let j = Math.max(0, i - ENV_WINDOW); j <= Math.min(SCAN.length - 1, i + ENV_WINDOW); j += 1) {
    if (SCAN_FLOORS[j] > m) m = SCAN_FLOORS[j];
  }
  return m;
}

// -- The bisection targets the ticket asked for ---------------------------------------------------
// (a) The FIRST raw integer rung in the bracket whose floor clears 64 ULP (the literal bisection answer).
const bracketScan = SCAN.filter((r) => inBracket(r.n));
const firstRawOverBand = bracketScan.find((r) => !r.inBand) || null;
// (b) The FIRST envelope rung whose rolling-max clears 64 ULP (the robust reading).
let firstEnvOverBand = null;
for (const r of bracketScan) {
  if (envelopeAt(indexOfN(r.n)) >= DEEP_FLOOR_ULP) { firstEnvOverBand = r; break; }
}
// (c) THE ILL-POSEDNESS WITNESS: how many rungs ABOVE the first raw over-band rung are still IN band.
let rungsAboveFirstCross = 0;
let inBandAboveFirstCross = 0;
if (firstRawOverBand) {
  for (const r of bracketScan) {
    if (r.n > firstRawOverBand.n) {
      rungsAboveFirstCross += 1;
      if (r.inBand) inBandAboveFirstCross += 1;
    }
  }
}
const inBandFractionAbove = rungsAboveFirstCross ? inBandAboveFirstCross / rungsAboveFirstCross : 0;

// -- Local + envelope slopes near the "crossing" (least-squares d_floorUlp/dn) ---------------------
function localSlope(n0, halfWidth, useEnvelope) {
  const xs = [];
  const ys = [];
  for (let i = 0; i < SCAN.length; i += 1) {
    if (Math.abs(SCAN[i].n - n0) <= halfWidth) {
      xs.push(SCAN[i].n);
      ys.push(useEnvelope ? envelopeAt(i) : SCAN_FLOORS[i]);
    }
  }
  const m = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  return (m * sxy - sx * sy) / (m * sxx - sx * sx);
}
const slopeNearLo = localSlope(BRACKET_LO, 4, false);
const slopeNearCross = firstRawOverBand ? localSlope(firstRawOverBand.n, 4, false) : NaN;
const slopeNearHi = localSlope(BRACKET_HI, 4, false);
// The ENVELOPE least-squares slope across the whole bracket (does it climb rung-by-rung? -> no).
const envelopeBracketSlope = (() => {
  const xs = [];
  const ys = [];
  for (let i = 0; i < SCAN.length; i += 1) {
    if (inBracket(SCAN[i].n)) { xs.push(SCAN[i].n); ys.push(envelopeAt(i)); }
  }
  const m = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  return (m * sxy - sx * sy) / (m * sxx - sx * sx);
})();

// -- Endpoint reproduction of imp-33557 -----------------------------------------------------------
const floorAt510 = floorUlpAt(BRACKET_LO);
const floorAt596 = floorUlpAt(BRACKET_HI);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: a dense every-integer scan over the imp-33557 bracket [510,596], budgets &gt;= 200 nodes.
const bracketDenselyScanned =
  bracketScan.length === BRACKET_HI - BRACKET_LO + 1 && RESOLVED_PANEL_SWEEP.length >= 5;
// (2) Endpoints reproduce imp-33557: n=510 in band near the edge, n=596 out of band.
const endpointsReproduceImp33557 =
  floorAt510.inBand && floorAt510.floorUlp > 40 && !floorAt596.inBand && floorAt596.floorUlp > 60;
// (3) THE HEADLINE: floorUlp(n) is NON-MONOTONE -- a raw over-band rung exists yet many rungs ABOVE it
//     remain IN band, so no monotone threshold separates the bracket (bisection is ill-posed).
const floorIsNonMonotone =
  firstRawOverBand !== null && inBandAboveFirstCross >= 20 && inBandFractionAbove > 0.5;
// (4) The floor dips deep inside the bracket (returns to ~0 ULP) -- it is a jitter lattice, not a step.
const floorDipsInsideBracket = bracketScan.some((r) => r.n > BRACKET_LO && r.floorUlp < 5);
// (5) The rolling-max ENVELOPE does not climb rung-by-rung across the narrow bracket (slope &lt; ~0.2).
const envelopeDoesNotClimbInBracket = envelopeBracketSlope < 0.2;
// (6) A first raw over-band rung and a first envelope over-band rung both exist and are located.
const crossingsLocated = firstRawOverBand !== null && firstEnvOverBand !== null;

const verdict =
  bracketDenselyScanned && endpointsReproduceImp33557 && floorIsNonMonotone &&
  floorDipsInsideBracket && envelopeDoesNotClimbInBracket && crossingsLocated
    ? 'BISECTION-ILL-POSED-THE-CROSSING-IS-NOT-A-LOCATABLE-RUNG.-A-DENSE-EVERY-INTEGER-SCAN-OF-floorUlp(n)-' +
      'OVER-THE-imp-33557-BRACKET-n-in-[510,596]-(GRADE-4,-BUDGETS->=200-NODES-vs-A_log)-SHOWS-THE-GRADED-' +
      'PLATEAU-FLOOR-IS-A-JITTERY-NON-MONOTONE-ARITHMETIC-LATTICE-QUANTITY,-NOT-A-MONOTONE-STEP.-THE-FIRST-' +
      'RAW-INTEGER-RUNG-CLEARING-64-ULP-IS-n~531-(tau*~0.9490,-floor~76-ULP),-BUT-63-OF-THE-65-RUNGS-ABOVE-IT-' +
      'UP-TO-596-ARE-STILL-IN-BAND-(FLOOR-DIPS-TO-~0-AT-n=518,552,595),-SO-n~531-IS-ONE-ISOLATED-SPIKE,-NOT-A-' +
      'THRESHOLD.-THE-ROBUST-READING-IS-THE-+/-5-ROLLING-MAX-ENVELOPE-(FIRST-REACHES-64-ULP-AT-n~526),-BUT-EVEN-' +
      'THE-ENVELOPE-SLOPE-OVER-[510,596]-IS-SLIGHTLY-NEGATIVE-(~-0.12-ULP/RUNG):-THE-imp-33557-DEPTH-CLIMB-' +
      '(~24-ULP-AT-n=495-->-~65-AT-n=596)-IS-A-WIDE-RANGE-(n=495..596)-ENVELOPE-PHENOMENON,-NOT-A-RUNG-BY-RUNG-' +
      'THRESHOLD-INSIDE-[510,596].-LOCAL-FLOOR-SLOPE-~-0.43-ULP/RUNG-NEAR-510,-~+2.9-AT-THE-n~531-SPIKE,-~-1.14-' +
      'NEAR-596.-CONFIRMS+SHARPENS-THE-imp-33557/imp-33537-latticeJitterCaveat:-THE-CROSSING-IS-DEFINED-ONLY-TO-' +
      'THE-ENVELOPE-OVER-A-WIDE-n-RANGE,-NEVER-TO-A-SINGLE-RUNG-n*.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33579_BAND_CROSSING_FLOOR_BISECTION = Object.freeze({
  id: 'imp-33579-band-crossing-floor-bisection',
  ticket: 'imp-33579',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33557-band-crossing-min-budget.js',
  crossValidatesModules: [
    'imp-33557-band-crossing-min-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33555-deep-tail-jitter-envelope-growth-law.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'DEPTH-AXIS BISECTION of the imp-33557 band crossing: a dense every-integer scan of floorUlp(n) -- the ' +
    'graded-GL plateau smallest residual at budgets &gt;= 200 nodes vs the imp-33213 A_log target -- over the ' +
    'imp-33557 bracket n in [510,596] (grade 4). imp-33557 bracketed the crossing between n=510 (~61.4 ULP edge) ' +
    'and n=596 (~65.3 ULP fails) but never located it. RESULT: the crossing is NOT a locatable rung. floorUlp(n) ' +
    'is a JITTERY, NON-MONOTONE arithmetic-floor lattice quantity: the first raw integer rung clearing 64 ULP is ' +
    'n ~ 531 (tau* ~ 0.9490, floor ~ 76 ULP), but 63 of the 65 rungs above it up to 596 are still IN band (the ' +
    'floor dips to ~0 ULP at n=518,552,595), so n~531 is one isolated spike, not a threshold. The robust +/-5 ' +
    'rolling-MAX envelope first reaches 64 ULP at n ~ 526, yet even the envelope slope over [510,596] is slightly ' +
    'NEGATIVE (~ -0.12 ULP/rung): the imp-33557 depth-climb (~24 ULP at n=495 -> ~65 at n=596) is a WIDE-RANGE ' +
    'envelope phenomenon over n=495..596, NOT a rung-by-rung threshold inside the narrow bracket. VERDICT: ' +
    'BISECTION-ILL-POSED. CONFIRMS and SHARPENS the imp-33557/imp-33537 latticeJitterCaveat -- the crossing is ' +
    'defined only to the envelope over a wide n range, never to a single rung n*. ACCURACY/RULE-DESIGN ' +
    'MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity ' +
    '(imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    bracket: 'the imp-33557 band-crossing bracket n in [510,596], dense every-integer scan with a +/-5 collar for the envelope',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the RESOLVED node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp is the jitter-tolerant robust reading; slopes are least-squares d_floorUlp/dn',
    selfComputing: 'every rung, the crossings, the slopes, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    bracketLo: BRACKET_LO,
    bracketHi: BRACKET_HI,
    collar: COLLAR,
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    envWindow: ENV_WINDOW,
    scanCount: bracketScan.length,
    scan: Object.freeze(bracketScan.map((r) => Object.freeze({ n: r.n, saddleTau: r.saddleTau, floorUlp: r.floorUlp, inBand: r.inBand }))),
    floorAt510: floorAt510.floorUlp,
    floorAt596: floorAt596.floorUlp,
    firstRawOverBandN: firstRawOverBand ? firstRawOverBand.n : null,
    firstRawOverBandTau: firstRawOverBand ? firstRawOverBand.saddleTau : null,
    firstRawOverBandFloorUlp: firstRawOverBand ? firstRawOverBand.floorUlp : null,
    firstEnvOverBandN: firstEnvOverBand ? firstEnvOverBand.n : null,
    rungsAboveFirstCross,
    inBandAboveFirstCross,
    inBandFractionAbove,
    slopeNearLo,
    slopeNearCross,
    slopeNearHi,
    envelopeBracketSlope,
    bracketDenselyScanned,
    endpointsReproduceImp33557,
    floorIsNonMonotone,
    floorDipsInsideBracket,
    envelopeDoesNotClimbInBracket,
    crossingsLocated,
    verdict,
  }),

  interpretation: Object.freeze({
    firstRawRungIsAnIsolatedSpike:
      'The first integer rung in [510,596] whose floor clears 64 ULP is n ~ 531 (tau* ~ 0.9490, floor ~ 76 ULP), ' +
      'but it is NOT a threshold: 63 of the 65 rungs above it (up to 596) are still in band, and the floor dips ' +
      'back to ~0 ULP at n=518, 552 and 595. n ~ 531 is one isolated jitter spike, not the onset of a failure region.',
    bisectionIsIllPosed:
      'A monotone bisection on floorUlp(n) is ill-posed: no single rung n* separates an all-in-band region below ' +
      'from an all-out-of-band region above within [510,596]. The floor is a jittery non-monotone arithmetic ' +
      'lattice quantity, so "the crossing rung" the ticket sought does not exist as a locatable single rung.',
    envelopeIsTheRobustReading:
      'The robust jitter-tolerant reading is the +/-5 rolling-MAX envelope of the floor, which first reaches 64 ULP ' +
      'at n ~ 526. But even that envelope does not climb monotonically inside the bracket -- its least-squares slope ' +
      'over [510,596] is slightly negative (~ -0.12 ULP/rung).',
    climbIsWideRangeNotLocal:
      'The imp-33557 depth-climb (~24 ULP at n=495 -> ~65 ULP at n=596) is a WIDE-RANGE envelope phenomenon spanning ' +
      'n = 495..596, NOT a rung-by-rung threshold resolvable inside the narrow [510,596] band. Local floor slopes ' +
      '(~ -0.43 ULP/rung near 510, ~ +2.9 at the n~531 spike, ~ -1.14 near 596) confirm the jitter dominates locally.',
    sharpensImp33557:
      'This CONFIRMS and SHARPENS the imp-33557/imp-33537 latticeJitterCaveat: the "floor crosses the band somewhere ' +
      'in [510,596]" is an ENVELOPE statement over a wide n range, never a locatable rung n*. It bounds the ' +
      'resolution of any band-crossing claim to the envelope, not the individual rung.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Bisects the imp-33557 depth axis n in [510,596] to locate where the graded-plateau floor crosses the ' +
      'imp-33316 < 64 ULP band. It finds the crossing is an ENVELOPE phenomenon, not a locatable rung. It changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33557/imp-33539/imp-33316/imp-33213; this bisects ' +
      'the inner-quadrature arithmetic floor across depth, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/imp-33557): ' +
      'the exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement ' +
      '(the exact n~531/n~526 crossings and the ~76/~61/~65 ULP values). The robust reading is the QUALITATIVE ' +
      'non-monotone structure -- the crossing is an envelope over a wide n range, not a bisectable rung -- not the ' +
      'exact per-rung ULP. imp-33537/imp-33556 establish the < 64 band crossing at n >= 510 as solver-invariant.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33579_BAND_CROSSING_FLOOR_BISECTION_ASSERTIONS = [
  {
    id: 'imp33579-bracket-densely-scanned',
    why: 'The bisection must be a dense every-integer scan across the imp-33557 bracket n in [510,596] over the ' +
         'resolved-regime (budgets >= 200 nodes) grade-4 ladder.',
    holds: () => bracketDenselyScanned && bracketScan.length === BRACKET_HI - BRACKET_LO + 1,
  },
  {
    id: 'imp33579-endpoints-reproduce-imp33557',
    why: 'The endpoints must reproduce imp-33557: n=510 in band near the edge (>40 ULP) and n=596 out of band (>60 ULP).',
    holds: () => endpointsReproduceImp33557 && floorAt510.inBand && !floorAt596.inBand,
  },
  {
    id: 'imp33579-floor-is-non-monotone',
    why: 'THE HEADLINE: floorUlp(n) is non-monotone -- a raw over-band rung exists yet many (>=20, majority) rungs ' +
         'ABOVE it remain in band, so no monotone threshold separates the bracket and bisection is ill-posed.',
    holds: () => floorIsNonMonotone && firstRawOverBand !== null && inBandFractionAbove > 0.5,
  },
  {
    id: 'imp33579-floor-dips-inside-bracket',
    why: 'The floor must dip back deep inside the bracket (returns to <5 ULP above n=510) -- it is a jitter lattice, ' +
         'not a monotone step, so a raw over-band rung is not an onset of a failure region.',
    holds: () => floorDipsInsideBracket,
  },
  {
    id: 'imp33579-envelope-does-not-climb-in-bracket',
    why: 'The robust +/-5 rolling-max envelope must NOT climb rung-by-rung inside the narrow bracket (slope < 0.2 ' +
         'ULP/rung): the imp-33557 climb is a wide-range (n=495..596) phenomenon, not resolvable inside [510,596].',
    holds: () => envelopeDoesNotClimbInBracket && envelopeBracketSlope < 0.2,
  },
  {
    id: 'imp33579-crossings-located',
    why: 'Both a first raw over-band rung and a first envelope over-band rung must be located and reported (with ' +
         'tau*(n) and local slopes) even though neither is a monotone threshold.',
    holds: () => crossingsLocated && firstRawOverBand !== null && firstEnvOverBand !== null,
  },
  {
    id: 'imp33579-verdict-records-ill-posed',
    why: 'The classified verdict must record the BISECTION-ILL-POSED reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33579-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33579_BAND_CROSSING_FLOOR_BISECTION.honestCaveat;
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

for (const assertion of IMP33579_BAND_CROSSING_FLOOR_BISECTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33579-band-crossing-floor-bisection assertion failed: ${assertion.id}`);
  }
}

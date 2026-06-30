/**
 * @module imp-3023-beta-dischargeability
 * @fileoverview imp-3023 (proof, ASSESS-ONLY): classify the unproven field bound
 * beta that throttles the two-sided MIN-GAP SANDWICH (Theorem B,
 * imp-2563-min-gap-sandwich-theorem.js / route-map full-route-map-2026-06-19.js
 * clusters.lambdaUpper opp:5 -- "two-sided bracket throttled by an unproven
 * field bound beta"). The route map files this CONDITIONAL; this module reports
 * the demanded assessment: where beta is DETERMINISTIC (dischargeable by
 * finite-N flow control, no RH) and where it FUNNELS into the C_H/RH-hard
 * repulsion wall like every other lever in the map. No claim that beta is
 * closed -- assess/derive only. PT 0.2 stays SOTA.
 *
 * BETA, RESTATED PRECISELY (cite imp-2683 / imp-2849).
 * ---------------------------------------------------
 * For the colliding adjacent pair a = x_lo < b = x_hi (gap g = b - a) under the
 * attractive flow dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), the net background
 * field of the other N-2 particles on that pair is
 *
 *     B_p(s) = sum_{j != lo,hi} 1/((b - x_j)(a - x_j)) > 0
 *
 * (positive: no particle lies in the open interval (a, b), imp-2683 Obs 1), and
 * the sandwich gating constant is beta = sup_{0 <= s < t_c} B_p(s), required
 * finite with beta g^2 < 2. The EXISTING state of beta:
 *   - imp-2683 Obs 2: at any instant where the pair realises the GLOBAL min gap
 *     G (e.g. s = 0), the telescope bound B_p G^2 <= 2(1 - 1/(K+1)) < 2 is
 *     RIGOROUS and N-uniform. So the INITIAL gate beta_0 g^2 < 2 is proven.
 *   - imp-2683-sub-punctured-min-gap: the SUP over 0 <= s < t_c with the FIXED
 *     initial g is open, because the telescope ceiling 2/g_pair(s)^2 blows up as
 *     the pair gap g_pair(s) -> 0. It is replaced by the conditional reduction
 *         h(s) >= c g for all s < t_c   ==>   beta g^2 <= (pi^2/3)/c^2,
 *     where h(s) = min_{j != lo,hi}(|a - x_j|, |b - x_j|) is the PUNCTURED min
 *     gap (distance from the colliding pair to the nearest BACKGROUND particle).
 *
 * THE ANALYTIC ESTIMATE THAT WOULD DISCHARGE BETA (named, exact).
 * --------------------------------------------------------------
 * Theorem B closes UNCONDITIONALLY (no RH) the instant one proves a uniform
 * N-independent constant c with
 *
 *     h(s) >= c * g_min(0)   for all 0 <= s < t_c.            (PUNCTURED-GAP)
 *
 * Nothing else is missing: (PUNCTURED-GAP) + imp-2683 Obs 3 gives
 * beta <= (pi^2/3)/(c g)^2, hence beta g^2 <= (pi^2/3)/c^2, and any c with
 * (pi^2/3)/c^2 < 2 (i.e. c > pi/sqrt(6) ~ 1.2825) re-arms the full two-sided
 * bracket; any c > pi/sqrt(3 x*) ~ 1.902 (x* = 0.90879, imp-2849) makes the
 * conditional UPPER bound T_+ strictly beat the free A1 trap t_c <= g^2/6.
 *
 * THE NEW ASSESSMENT -- (PUNCTURED-GAP) FACTORS INTO A DETERMINISTIC HALF
 * AND ONE RH-HARD CONSTANT.
 * ----------------------------------------------------------------------
 * Write h_0 = h(0) and c_0 = h_0 / g for the INITIAL punctured ratio. The claim
 * (PUNCTURED-GAP) splits cleanly into TIME-EVOLUTION control and an INITIAL
 * constant, and ONLY the second touches the RH-hard wall.
 *
 * (I) DETERMINISTIC HALF -- h is NON-DECREASING over the collapse, RH-FREE.
 *   Take the nearest background particle on the left, x_m < a (the right case is
 *   symmetric), so h = a - x_m. The colliding endpoint a carries the SINGULAR
 *   drift da/ds = -2[1/(a - b) + sum_{j!=lo,hi} 1/(a - x_j)] = +2/g_pair + O(1):
 *   the +2/g_pair term pushes a RIGHT, AWAY from x_m -- the singular part HELPS
 *   h. The background particle x_m feels the pair only through the BOUNDED
 *   dx_m/ds = -2[1/(x_m - a) + 1/(x_m - b)] + O(1) = +4/h + O(1) (it drifts
 *   toward the pair, the only downward pressure on h). Hence
 *
 *       dh/ds = da/ds - dx_m/ds = +2/g_pair - 4/h + O(1),
 *
 *   which is NON-SINGULAR in its only downward part. Two consequences:
 *     - dropping the favourable +2/g_pair, h(dh/ds) >= -(4 + C_0 h), so
 *       d(h^2)/ds >= -2 C_h with C_h = O(1), and over the collapse window
 *       s <= t_c <= g^2/6 (A1) this gives the worst-case erosion bound
 *       h(s)^2 >= h_0^2 - 2 C_h t_c >= h_0^2 ( 1 - O((g/h_0)^2) );
 *     - whenever 2/g_pair > 4/h (i.e. g_pair < h/2, in particular throughout the
 *       collapse once the initial ratio c_0 = h_0/g > 2) the rate dh/ds > 0, so
 *       h is STRICTLY NON-DECREASING: h(s) >= h_0 and c(s) := h(s)/g >= c_0.
 *   THIS IS DETERMINISTIC: a property of the finite-N Calogero-Moser ODE for ANY
 *   initial data with c_0 > 2, NO reference to where the zeros lie -- it does not
 *   see RH at all. The witness below confirms h_min/h_0 = 1 (no erosion at all).
 *   The sup_s upgrade Theorem B newly demanded (beyond the s = 0 telescope bound)
 *   is, by itself, DISCHARGEABLE.
 *
 * (II) RH-HARD CONSTANT -- the uniform INITIAL ratio c_0 = h_min(0)/g_min(0).
 *   After (I), (PUNCTURED-GAP) holds with c = c_0(1 - o(1)), so the ENTIRE
 *   remaining content of beta is a uniform N-independent LOWER bound on the
 *   initial ratio
 *
 *       c_0 = h_min(0) / g_min(0)
 *           = (distance from the min-gap pair to its nearest neighbour)
 *             / (the min gap itself).
 *
 *   For the actual zeta zeros this is a SPACING-STATISTICS statement: it asks the
 *   smallest gap not to be flanked by a second nearly-as-small gap, uniformly up
 *   the height ladder. That is precisely the Montgomery pair-correlation / level-
 *   repulsion input -- the SAME C_H/RH-hard wall onto which every other lever in
 *   full-route-map-2026-06-19.js funnels (the shared Montgomery-PCC obstruction).
 *   beta introduces NO NEW independent wall: it inherits the one wall, through a
 *   single scalar c_0.
 *
 * VERDICT. beta is SEMI-DISCHARGEABLE and does NOT spawn a fresh obstruction:
 *   - the time-evolution half (the genuinely new difficulty Theorem B added over
 *     the unconditional A1 trap) is DETERMINISTIC and dischargeable;
 *   - the residual reduces to ONE RH-hard scalar, the uniform initial punctured
 *     ratio c_0, which collapses into the existing C_H/pair-correlation wall.
 * So on the route map beta is a CONDITIONAL lever whose conditionality is not its
 * own: closing the shared repulsion wall closes beta for free, and beta cannot be
 * closed strictly before it. PT Lambda <= 0.2 stays SOTA.
 *
 * HOW FAR THE NUMERICS SIT FROM THE NEEDED BETA (deliverable measurement).
 * -----------------------------------------------------------------------
 * The flow witness below MEASURES, over a real backward-flow collapse: the
 * erosion ratio h_final/h_0 (confirming the O((g/h_0)^2) bound of (I)), the
 * effective deterministic constant C_h = sup_s h|dh/ds|, and the fixed-g ratio
 * c(s) = h(s)/g (confirming c_0 is preserved). It reports the implied
 * beta g^2 <= (pi^2/3)/c_0^2 and the slack to both the existence gate (2) and the
 * beat-A1 break-even (x* = 0.90879). The measured c_0 ~ O(1)-to-O(10) on the
 * witness configs leaves beta g^2 one to three orders inside the gate -- but this
 * is MODEL/witness data, NOT a uniform proof of c_0 for the zeros. Honest scope:
 * the deterministic half (I) is derived and witnessed; the RH-hard constant (II)
 * is classified, not closed.
 *
 * @see imp-2563-min-gap-sandwich-theorem (Theorem B; beta is its gating input)
 * @see imp-2683-sandwich-beta-field-bound (positivity, telescope ceiling, residual)
 * @see imp-mingap-beta-bound (imp-2849; beat-A1 break-even x* = 0.90879)
 * @see full-route-map-2026-06-19 (clusters.lambdaUpper opp:5; shared Montgomery-PCC wall)
 */

// -- Self-contained finite-N machinery (no heavy imports) ---------------------

/** Attractive Calogero-Moser drift dx_k/ds = -2 sum_{j!=k} 1/(x_k - x_j). */
function drift(x) {
  const N = x.length;
  const d = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let acc = 0;
    for (let j = 0; j < N; j++) if (j !== k) acc += 1 / (x[k] - x[j]);
    d[k] = -2 * acc;
  }
  return d;
}

/** One classical RK4 step of size h. */
function rk4Step(x, h) {
  const k1 = drift(x);
  const x2 = x.map((v, i) => v + 0.5 * h * k1[i]);
  const k2 = drift(x2);
  const x3 = x.map((v, i) => v + 0.5 * h * k2[i]);
  const k3 = drift(x3);
  const x4 = x.map((v, i) => v + h * k3[i]);
  const k4 = drift(x4);
  return x.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/** Index lo of the adjacent pair (lo, lo+1) realising the global min gap. */
function minGapPair(x) {
  let lo = 0;
  let best = Infinity;
  for (let i = 0; i < x.length - 1; i++) {
    const g = x[i + 1] - x[i];
    if (g < best) {
      best = g;
      lo = i;
    }
  }
  return { lo, hi: lo + 1, gap: best };
}

/** Net background field B_p = sum_{j != lo,hi} 1/((b - x_j)(a - x_j)) > 0. */
function backgroundField(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let s = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    s += 1 / ((b - x[j]) * (a - x[j]));
  }
  return s;
}

/** Punctured min gap h = dist(pair, nearest background particle). */
function puncturedMinGap(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let h = Infinity;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    h = Math.min(h, Math.abs(a - x[j]), Math.abs(b - x[j]));
  }
  return h;
}

// -- Thresholds the discharging constant c must clear ------------------------

const X_STAR = 0.90879; // beat-A1 break-even beta g^2 (imp-2849 literal)
// c_gate: beta g^2 <= (pi^2/3)/c^2 < 2  <=>  c > pi/sqrt(6).
const C_GATE = Math.PI / Math.sqrt(6); // ~1.2825 -- re-arms the existence gate
// c_beatA1: (pi^2/3)/c^2 < x*  <=>  c > pi/sqrt(3 x*).
const C_BEAT_A1 = Math.PI / Math.sqrt(3 * X_STAR); // ~1.902 -- beats the A1 trap

/** beta g^2 implied by a punctured ratio c via imp-2683 Obs 3. */
function betaGsqFromC(c) {
  return (Math.PI * Math.PI) / (3 * c * c);
}

// -- Flow witness: measure the deterministic erosion of h over a collapse -----

/**
 * Embed one small gap g among a symmetric well-separated background and
 * integrate the attractive flow to collapse, tracking the punctured min gap
 * h(s). Returns the preservation ratio h_min/h_0 (>= 1 means h never erodes --
 * the part (I) claim), whether the monotone regime c_0 > 2 holds from the start,
 * and the implied beta g^2 <= (pi^2/3)/c_0^2 from the PRESERVED initial ratio.
 */
function erosionWitness(x0) {
  let x = x0.slice();
  const start = minGapPair(x);
  const g = start.gap;
  const lo0 = start.lo;

  const h0 = puncturedMinGap(x, start.lo, start.hi);
  let hMin = h0;
  let stablePair = true;
  let gap = g;
  let s = 0;
  const EPS = 1e-5;

  while (gap > EPS) {
    const p = minGapPair(x);
    if (p.lo !== lo0) stablePair = false;
    hMin = Math.min(hMin, puncturedMinGap(x, p.lo, p.hi));
    const step = Math.max(1e-9, Math.min(1e-5, 0.001 * gap * gap));
    x = rk4Step(x, step);
    s += step;
    gap = minGapPair(x).gap;
    if (s > 10) break;
  }
  const pf = minGapPair(x);
  hMin = Math.min(hMin, puncturedMinGap(x, pf.lo, pf.hi));
  const tc = s + (gap * gap) / 8;

  const c0 = h0 / g; // initial punctured ratio -- the RH-hard scalar (II)
  const minRatio = hMin / h0; // h never erodes below h_0  ==>  >= 1 (part I)

  return {
    g,
    h0,
    hMin,
    minRatio, // h_min/h_0; >= 1 means the punctured gap is non-decreasing
    c0,
    tc,
    monotoneRegime: c0 > 2, // analytic: 2/g_pair > 4/h_0 from the start => dh/ds>0
    betaGsqFromC0: betaGsqFromC(c0), // implied beta g^2 from the preserved ratio
    clearsGate: betaGsqFromC(c0) < 2,
    beatsA1: betaGsqFromC(c0) < X_STAR,
    stablePair,
  };
}

// Symmetric background {+/-1,+/-2,+/-3} (matches imp-2683 witness) with an
// embedded pair at +/- g/2 -- gap g (A) and g/2 (B). Halving g doubles the
// initial ratio c_0, so the implied beta g^2 = (pi^2/3)/c_0^2 QUARTERS (the
// (g/h_0)^2 law that the sandwich relative width and the gate margin share).
const EROSION_A = erosionWitness([-3, -2, -1, -0.05, 0.05, 1, 2, 3]);
const EROSION_B = erosionWitness([-3, -2, -1, -0.025, 0.025, 1, 2, 3]);

// Implied beta g^2 ratio A/B (~4 by the (g/h_0)^2 law, c_0 doubling A -> B).
const BETAGSQ_RATIO = EROSION_A.betaGsqFromC0 / EROSION_B.betaGsqFromC0;

// -- Exported record ----------------------------------------------------------

export const BETA_DISCHARGEABILITY = {
  id: 'imp-3023',
  parent: 'imp-2563',
  attacks:
    'classify the unproven field bound beta throttling the two-sided min-gap ' +
    'sandwich (Theorem B); full-route-map-2026-06-19 clusters.lambdaUpper opp:5',
  verdict:
    'SEMI-DISCHARGEABLE -- beta FACTORS: the time-evolution (sup_s) half is ' +
    'DETERMINISTIC and dischargeable (flow erodes the punctured gap only by ' +
    'O((g/h_0)^2), RH-free); the residual reduces to ONE RH-hard scalar, the ' +
    'uniform initial ratio c_0 = h_min(0)/g_min(0), which funnels into the SAME ' +
    'Montgomery pair-correlation / C_H wall as every other lever. beta spawns no ' +
    'new wall. NOT closed -- assess/derive only. PT Lambda <= 0.2 stays SOTA.',

  betaDefinition:
    'beta = sup_{0<=s<t_c} B_p(s), B_p(s) = sum_{j!=lo,hi} 1/((b-x_j)(a-x_j)) > 0',

  dischargingEstimate: {
    statement:
      'h(s) >= c*g_min(0) for all 0<=s<t_c (PUNCTURED-GAP), h(s) = ' +
      'min_{j!=lo,hi}(|a-x_j|,|b-x_j|); then beta g^2 <= (pi^2/3)/c^2',
    cToReArmGate: C_GATE, // c > pi/sqrt(6) ~ 1.2825 re-arms beta g^2 < 2
    cToBeatA1: C_BEAT_A1, // c > pi/sqrt(3 x*) ~ 1.902 makes T_+ beat A1
    note:
      'this is exactly the named imp-2683-sub-punctured-min-gap residual; ' +
      'nothing else is missing from Theorem B once a uniform c is proven.',
  },

  factorization: {
    deterministicHalf:
      'Part (I): near collision the singular pair drift +-2/g_pair pushes the ' +
      'endpoints TOWARD each other (helps h), the midpoint drifts O(1/h), and the ' +
      'nearest background particle feels the pair only through bounded O(1/h) ' +
      'terms. So |dh/ds| <= C_h/h (non-singular), d(h^2)/ds >= -2 C_h, hence ' +
      'h(s)^2 >= h_0^2 - 2 C_h t_c >= h_0^2(1 - (C_h/3)(g/h_0)^2): the flow erodes ' +
      'h only by O((g/h_0)^2). DETERMINISTIC, no RH -- a property of the finite-N ' +
      'ODE for any data. The sup_s upgrade is by itself dischargeable.',
    rhHardConstant:
      'Part (II): after (I), (PUNCTURED-GAP) holds with c = c_0(1-o(1)), so beta ' +
      'reduces to a uniform N-independent lower bound on c_0 = h_min(0)/g_min(0) ' +
      '-- the colliding-gap-vs-nearest-neighbour ratio of the actual zeros. That ' +
      'is a spacing-statistics (Montgomery pair-correlation / level-repulsion) ' +
      'statement: the SAME C_H/RH-hard wall the rest of the route map funnels ' +
      'into. beta inherits the one wall through a single scalar; no new wall.',
  },

  witness: {
    configA: EROSION_A,
    configB: EROSION_B,
    betaGsqRatioAoverB: BETAGSQ_RATIO,
    note:
      'symmetric background {+/-1,+/-2,+/-3}, embedded gap g (A) and g/2 (B); ' +
      'measured: the punctured gap is NON-DECREASING over the whole collapse ' +
      '(h_min/h_0 = 1, part I -- no erosion), the monotone regime c_0 > 2 holds ' +
      'from the start, the global min-gap pair never switches, and the implied ' +
      'beta g^2 = (pi^2/3)/c_0^2 sits one-to-three orders inside the existence ' +
      'gate and QUARTERS from A to B (c_0 doubles). WITNESS data, NOT a uniform ' +
      'proof of c_0 -- part (II) stays classified, not closed.',
  },

  honestStatus:
    'ASSESS-ONLY. Derived: the deterministic erosion bound (I) (h preserved up to ' +
    'O((g/h_0)^2) over the g^2/6 collapse window), reducing beta to the single ' +
    'initial scalar c_0. Classified: c_0 is RH-hard (pair correlation), the same ' +
    'wall as the rest of the map -- so beta is conditional but spawns no new ' +
    'obstruction and closes for free once the shared repulsion wall closes. NOT ' +
    'proven: a uniform N-independent lower bound on c_0 for the zeros. No false ' +
    'QED; PT Lambda <= 0.2 remains the rigorous SOTA.',

  sources: [
    'src/data/imp-2563-min-gap-sandwich-theorem.js (Theorem B; beta is its gating input)',
    'src/data/imp-2683-sandwich-beta-field-bound.js (positivity, telescope ceiling, residual)',
    'src/data/imp-mingap-beta-bound.js (imp-2849; beat-A1 break-even x* = 0.90879)',
    'src/data/full-route-map-2026-06-19.js (clusters.lambdaUpper opp:5; shared Montgomery-PCC wall)',
  ],
};

// -- Build-time assertions ----------------------------------------------------

export const BETA_DISCHARGEABILITY_ASSERTIONS = [
  {
    id: 'imp3023-discharge-thresholds-ordered',
    holds: () =>
      Math.abs(C_GATE - Math.PI / Math.sqrt(6)) < 1e-12 &&
      C_GATE < C_BEAT_A1 &&
      betaGsqFromC(C_GATE) > 1.999 &&
      betaGsqFromC(C_GATE) < 2.001 &&
      betaGsqFromC(C_BEAT_A1) > X_STAR - 1e-6 &&
      betaGsqFromC(C_BEAT_A1) < X_STAR + 1e-6,
    why:
      'The discharging estimate beta g^2 <= (pi^2/3)/c^2 must invert to the right ' +
      'thresholds: c = pi/sqrt(6) gives beta g^2 = 2 exactly (re-arms the ' +
      'existence gate) and c = pi/sqrt(3 x*) gives beta g^2 = x* exactly (beats ' +
      'the A1 trap), with the beat-A1 bar strictly above the gate bar. A wrong ' +
      'constant would misstate what (PUNCTURED-GAP) needs to deliver.',
  },
  {
    id: 'imp3023-deterministic-half-preserves-h',
    holds: () =>
      EROSION_A.minRatio >= 1 - 1e-9 &&
      EROSION_B.minRatio >= 1 - 1e-9 &&
      EROSION_A.monotoneRegime === true &&
      EROSION_B.monotoneRegime === true,
    why:
      'Part (I) (DETERMINISTIC, RH-free): over the whole backward-flow collapse the ' +
      'punctured min gap must never drop below its initial value (h_min/h_0 >= 1), ' +
      'and the monotone regime c_0 = h_0/g > 2 (equivalently 2/g_pair > 4/h_0, so ' +
      'dh/ds > 0 from the start) must hold. This witnesses that the singular pair ' +
      'drift pushes the endpoints AWAY from the background, so the flow does not ' +
      'erode h -- the sup_s upgrade is dischargeable without RH. An eroding h ' +
      'would refute the differential inequality dh/ds = +2/g_pair - 4/h + O(1).',
  },
  {
    id: 'imp3023-min-gap-pair-stable',
    holds: () =>
      EROSION_A.stablePair === true && EROSION_B.stablePair === true,
    why:
      'Part (I) needs the colliding pair to remain the global min-gap pair through ' +
      'the collapse (so h(s) measures the distance to a genuine BACKGROUND ' +
      'particle, not a re-labelled member of a switched pair). A pair switch would ' +
      'invalidate reading the preservation of h off this single trajectory.',
  },
  {
    id: 'imp3023-implied-beta-clears-gate-and-scales',
    holds: () =>
      EROSION_A.clearsGate === true &&
      EROSION_B.clearsGate === true &&
      EROSION_A.beatsA1 === true &&
      EROSION_B.beatsA1 === true &&
      EROSION_A.betaGsqFromC0 < 2 &&
      EROSION_B.betaGsqFromC0 < 2 &&
      BETAGSQ_RATIO > 3 &&
      BETAGSQ_RATIO < 5,
    why:
      'Deliverable measurement + the (g/h_0)^2 law: the implied beta g^2 = ' +
      '(pi^2/3)/c_0^2 from the measured initial ratio c_0 must sit inside the ' +
      'existence gate (< 2) AND below the beat-A1 break-even x* at both configs, ' +
      'and must QUARTER from A to B (c_0 doubles when g halves) -- ratio ~4 in ' +
      '[3,5]. This is MODEL/witness support for part (II); it is NOT a uniform ' +
      'proof of c_0. A witness already violating the gate would mean even the ' +
      'favourable model fails.',
  },
];

// -- Self-executing tripwire (matches the imp-2563 sibling pattern) -----------
for (const a of BETA_DISCHARGEABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-3023-beta-dischargeability] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}

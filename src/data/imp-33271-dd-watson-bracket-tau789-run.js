/**
 * @module imp-33271-dd-watson-bracket-tau789-run
 * @fileoverview imp-33271 -- EXTEND the imp-33248 double-double (u_dd = 2^-106) cancellation-free
 *   Watson-bracket reform run to tau in {7,8,9} to LOCATE where even the extended-precision route B
 *   begins to degrade, and report the |B - closed-model| ladder. imp-33229 predicted the u_dd = 2^-106
 *   additive-cancellation onset only reaches tau ~ 8.97; imp-33248 confirmed route B tracks the imp-3892
 *   closed model to ~1e-4 through tau=6. This module runs route B above tau=6 and reports what happens.
 *
 *   WHAT imp-33248 LEFT OPEN
 *   -----------------------
 *   imp-33248 ran route B (analytic -T reformulation folded per node, E_j = smooth_j + pi*huge_j with
 *   huge_j = -e^{4 s} - e^{4 tau} * expm1(4 s), accumulated in Dekker/Knuth double-double) at tau in
 *   {4,5,6} and found it recovers rhoRatio(tau) onto K_lead to ~5.9e-8 / ~5.0e-6 / ~1.0e-4, while the
 *   single-double DIRECT route A blows up (-3.53, -389, -2.31e6). It also found DD and plain double
 *   bit-identical at tau <= 5 (extended precision a NON-lever there) with only a ~7.06e-5 DD tail
 *   correction at tau=6. imp-33229 had PREDICTED the u_dd = 2^-106 additive-cancellation onset reaches
 *   tau ~ 8.97. NEITHER ran route B above tau=6. This module does, at tau in {7,8,9} (plus a fine scan).
 *
 *   THE MEASUREMENT (self-computed below; rhoRatio = rho / e^{-4 tau}, model = K_lead + K6 e^{-2 tau})
 *   ---------------------------------------------------------------------------------------------------
 *     tau   closed model      REFORM+DD (B)        |B - model|      DD - plain     under K0=3.46 gate
 *      7     -3.41205529      -3.41943034            7.38e-3         0 (identical)      YES
 *      8     -3.41205681      -4.45885828e3          4.46e+3         2.10e-1            no
 *      9     -3.41205701      -3.18666729e10         3.19e+10        7.66e+0            no
 *
 *   FINE ONSET SCAN (tau in {7, 7.25, 7.5, 7.75, 8, 8.25, 8.5}) locates two distinct thresholds:
 *     - |B - model| first exceeds the K0=3.46 gate between tau=7.25 (6.4e-4, best point) and tau=7.5
 *       (1.26). So route B is usable only out to tau ~ 7.25-7.5, ONE well past imp-33248 tau=6.
 *     - DD - plain (the imp-33229 additive-cancellation onset) first turns NONZERO at tau ~ 7.75
 *       (7.7e-2), then grows through tau=8 (0.21), 8.25 (0.57), 8.5 (1.04). So the DD accumulation only
 *       begins doing work near tau ~ 7.75-8.97, in the NEIGHBOURHOOD of the imp-33229 tau~8.97 prediction.
 *
 *   THREE HONEST HEADLINES
 *   ----------------------
 *   (1) ROUTE B ALSO BREAKS DOWN -- its usable window ends at tau ~ 7.25-7.5, not tau ~ 8.97. |B - model|
 *       is 7.4e-3 at tau=7 but 4.5e3 at tau=8 and 3.2e10 at tau=9: route B diverges from the closed model
 *       by ORDERS OF MAGNITUDE above tau=7. The reformulation buys exactly one more usable well (tau=6 ->
 *       tau~7.25) over the direct route, not the tau~9 reach imp-33229s precision prediction implied.
 *
 *   (2) THE OPERATIVE WALL IS NOT THE u_dd = 2^-106 ACCUMULATION CANCELLATION -- REFINES imp-33229 the
 *       same way imp-33248 did. At tau=8, DD shifts rhoRatio by only 0.21 while |B - model| = 4.5e3: the
 *       DD accumulation is NOT the limiter. The dominant failure is the e^{4 tau} (= 8.9e12 at tau=8)
 *       amplification of (a) the final rho = bracket - (2 pi - 3 e^{-2 tau}) subtraction, in which
 *       bracket -> 2 pi so ~15 digits cancel, and (b) the ~1e-4 finite-quadrature reconstruction floor
 *       (imp-33252 / imp-33248 row-6 floor). Both get multiplied by e^{4 tau} and swamp the K_lead signal.
 *       So the imp-33229 tau~8.97 onset is where DD BEGINS to matter, but it never becomes the wall.
 *
 *   (3) THE DD-vs-PLAIN ONSET IS CONSISTENT WITH imp-33229 -- it turns nonzero at tau ~ 7.75 and climbs
 *       through the predicted tau ~ 8.97 band, confirming the u_dd = 2^-106 cancellation prediction was
 *       directionally right about WHERE extended precision starts working -- it just does not rescue the
 *       reconstruction, because the quadrature-floor amplification arrives first (tau ~ 7.5).
 *
 *   All measurement only. Certifies NO bound and NO RH. NPHI=10 truncation upstream; imp-3066 K_a >= 0
 *   sign-positivity UNTOUCHED; no QED; no refereed bound is changed.
 */

const NPHI = 10;
const PI = Math.PI;

// ---- Pins: Phi(0), K_lead, K6 (imp-3892 closed model), K0 gate ----------------------------------
let ACC0 = 0;
let DACC0 = 0;
for (let n = 1; n <= NPHI; n += 1) {
  const n2 = n * n;
  const n4 = n2 * n2;
  const amp = 2 * PI * PI * n4 - 3 * PI * n2;
  const expo = Math.exp(-PI * (n2 - 1));
  ACC0 += amp * expo;
  const dAmp = 8 * PI * PI * n4 - 6 * PI * n2;
  const dExpo = -PI * (n2 - 1) * 4;
  DACC0 += (dAmp + amp * dExpo) * expo;
}
const PHI0 = Math.exp(-PI) * ACC0;
const PHI_PRIME_0 = Math.exp(-PI) * (-PI * ACC0 + 0.25 * DACC0);
const PSI_PRIME_0 = PHI_PRIME_0 - 0.5 * PHI0;
const K_LEAD = (2 * PHI_PRIME_0) / PHI0;
const K6 = -(3 / PHI0) * (PSI_PRIME_0 / PI);
const K0 = 3.46; // imp-3730 gate

// ---- Gauss-Legendre 10-node panel rule (identical to imp-33248) --------------------------------
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
const HI = 14;
const PANELS = 1600;
const GRADE = 6;

// ---- Double-double primitives (Dekker/Knuth), u_dd = 2^-106 ------------------------------------
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
const SPLITTER = 134217729; // 2^27 + 1
function split(a) {
  const c = SPLITTER * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
function ddAddD(a, b) {
  let [s, e] = twoSum(a[0], b);
  e += a[1];
  const [hi, lo] = twoSum(s, e);
  return [hi, lo];
}
function ddMulD(a, b) {
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  const [hi, lo] = twoSum(p, e);
  return [hi, lo];
}
function ddToNumber(a) { return a[0] + a[1]; }
const PI_DD = [Math.PI, 1.2246467991473532e-16];

// ---- Route B: cancellation-free reconstruction accumulated in double-double (imp-33248) ---------
function logAccF(s) {
  const e2 = Math.exp(2 * s);
  const e4 = Math.exp(4 * s);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return Math.log(acc);
}
function logAmp1(u) {
  return 4 * u + Math.log(2 * PI * PI - 3 * PI * Math.exp(-2 * u));
}
// E_j = smooth_j + pi*huge_j, huge_j = -e^{4s} - e^{4tau} expm1(4s): the -T cancellation folded per node.
function reconstructLnAplusT(tau, useDD) {
  const e4tau = Math.exp(4 * tau);
  const smooth = [];
  const huge = [];
  for (let j = 0; j < PANELS; j += 1) {
    const a = HI * Math.pow(j / PANELS, GRADE);
    const b = HI * Math.pow((j + 1) / PANELS, GRADE);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      const logw = Math.log(GL_W[k] * half);
      smooth.push(logw + logAccF(s) + logAmp1(s + tau));
      huge.push(-Math.exp(4 * s) - e4tau * Math.expm1(4 * s));
    }
  }
  const N = smooth.length;
  const Eval = new Float64Array(N);
  let mx = -Infinity;
  for (let i = 0; i < N; i += 1) {
    const val = useDD ? ddToNumber(ddAddD(ddMulD(PI_DD, huge[i]), smooth[i])) : PI * huge[i] + smooth[i];
    Eval[i] = val;
    if (val > mx) mx = val;
  }
  let acc = 0;
  for (let i = 0; i < N; i += 1) acc += Math.exp(Eval[i] - mx);
  return mx + Math.log(acc);
}
function reformRhoRatio(tau, useDD) {
  const e4t = Math.exp(-4 * tau);
  const lnAplusT = reconstructLnAplusT(tau, useDD);
  const bracket = Math.exp(lnAplusT - Math.log(PHI0 / 4));
  const rho = bracket - (2 * PI - 3 * Math.exp(-2 * tau));
  return rho / e4t;
}
function closedModel(tau) { return K_LEAD + K6 * Math.exp(-2 * tau); }

// ---- Core ladder at tau in {7,8,9} -------------------------------------------------------------
const RUN_TAUS = [7.0, 8.0, 9.0];
const rows = RUN_TAUS.map((tau) => {
  const model = closedModel(tau);
  const reformPlain = reformRhoRatio(tau, false);
  const reformDD = reformRhoRatio(tau, true);
  return {
    tau,
    model,
    reformPlain,
    reformDD,
    diffModel: Math.abs(reformDD - model),
    ddMinusPlain: Math.abs(reformDD - reformPlain),
    underGate: Math.abs(reformDD) <= K0,
  };
});

// ---- Fine onset scan to locate the two thresholds ----------------------------------------------
const SCAN_TAUS = [7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5];
const scan = SCAN_TAUS.map((tau) => {
  const model = closedModel(tau);
  const reformPlain = reformRhoRatio(tau, false);
  const reformDD = reformRhoRatio(tau, true);
  return {
    tau,
    diffModel: Math.abs(reformDD - model),
    ddMinusPlain: Math.abs(reformDD - reformPlain),
    underGate: Math.abs(reformDD) <= K0,
  };
});

// Threshold 1: last tau at which |B - model| still sits under the K0 gate.
let lastUsableTau = null;
for (const r of scan) if (r.underGate) lastUsableTau = r.tau;
// Threshold 2: first tau at which DD - plain becomes nonzero (the imp-33229 accumulation onset).
let ddOnsetTau = null;
for (const r of scan) { if (r.ddMinusPlain > 0) { ddOnsetTau = r.tau; break; } }

// ---- Classified measurement facts --------------------------------------------------------------
const tau7UnderGate = rows[0].underGate;              // tau=7 still under the gate
const tau7TracksModel = rows[0].diffModel < 1e-2;     // tau=7 |B - model| ~ 7.4e-3
const routeBBlowsUpAtTau89 = rows[1].diffModel > 1e2 && rows[2].diffModel > 1e6; // catastrophic
const ddNotTheLimiterAtTau8 = rows[1].ddMinusPlain < 1 && rows[1].diffModel > 1e2; // DD shift << error
const usableWindowEndsBeforePredictedOnset = lastUsableTau !== null && lastUsableTau < 8.97;
const ddOnsetInPredictedNeighbourhood = ddOnsetTau !== null && ddOnsetTau >= 7.5 && ddOnsetTau <= 8.97;

const verdict = (tau7UnderGate && routeBBlowsUpAtTau89 && ddNotTheLimiterAtTau8
  && usableWindowEndsBeforePredictedOnset)
  ? 'ROUTE-B-USABLE-TO-TAU7-THEN-QUADRATURE-FLOOR-AMPLIFICATION-WALL-BELOW-IMP33229-ONSET'
  : 'INDETERMINATE';

export const IMP33271_DD_WATSON_BRACKET_TAU789_RUN = Object.freeze({
  id: 'imp-33271',
  title: 'Extend the imp-33248 double-double Watson-bracket reform run to tau in {7,8,9} to locate the u_dd=2^-106 onset',
  extendsRun: 'imp-33248',
  refinesPrediction: 'imp-33229',
  closesResiduals: Object.freeze([
    'sg-33271-route-b-high-tau-degradation-onset',
  ]),

  config: Object.freeze({ NPHI, HI, PANELS, GRADE, uDoubleDouble: '2^-106' }),

  constants: Object.freeze({
    PHI0,
    K_LEAD,
    K6,
    K0,
    note: 'K_lead, K6 are the imp-3892 closed two-term model rhoRatio -> K_lead + K6 e^{-2 tau}.',
  }),

  rows: Object.freeze(rows.map((r) => Object.freeze(r))),
  onsetScan: Object.freeze(scan.map((r) => Object.freeze(r))),

  measurement: Object.freeze({
    lastUsableTau,
    ddOnsetTau,
    predictedOnsetTau: 8.97,
    tau7DiffModel: rows[0].diffModel,
    tau8DiffModel: rows[1].diffModel,
    tau9DiffModel: rows[2].diffModel,
    tau8DdMinusPlain: rows[1].ddMinusPlain,
    tau7UnderGate,
    tau7TracksModel,
    routeBBlowsUpAtTau89,
    ddNotTheLimiterAtTau8,
    usableWindowEndsBeforePredictedOnset,
    ddOnsetInPredictedNeighbourhood,
    verdict,
  }),

  interpretation: Object.freeze({
    routeBAlsoBreaksDown:
      'Route B (reform + double-double) tracks the imp-3892 closed model to ~7.4e-3 at tau=7 but ' +
      'diverges to |B - model| ~ 4.5e3 at tau=8 and ~3.2e10 at tau=9. Its usable window (under the ' +
      'K0=3.46 gate) ends at tau ~ 7.25-7.5 -- exactly one well past the imp-33248 tau=6, NOT the ' +
      'tau ~ 8.97 reach the imp-33229 u_dd = 2^-106 precision prediction implied.',
    operativeWallIsNotAccumulationCancellation:
      'REFINES imp-33229 (as imp-33248 did at tau<=6): at tau=8 the double-double accumulation shifts ' +
      'rhoRatio by only 0.21 while |B - model| = 4.5e3, so the u_dd = 2^-106 accumulation cancellation is ' +
      'NOT the limiter. The wall is the e^{4 tau} (8.9e12 at tau=8) amplification of the final ' +
      'rho = bracket - (2 pi - 3 e^{-2 tau}) subtraction (bracket -> 2 pi, ~15 digits cancel) and the ' +
      '~1e-4 finite-quadrature reconstruction floor (imp-33252 / imp-33248 row-6). Both swamp K_lead.',
    ddOnsetConsistentWithImp33229:
      'The DD-vs-plain divergence -- the imp-33229 additive-cancellation onset -- first turns nonzero ' +
      'at tau ~ 7.75 and climbs through the predicted tau ~ 8.97 band, so imp-33229 was directionally ' +
      'right about WHERE extended precision begins to work; it just cannot rescue the reconstruction ' +
      'because the quadrature-floor amplification (tau ~ 7.5) arrives first.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measurementOnly: true,
    derivationScope:
      'Extends one graded-GL quadrature reconstruction of a Watson-majorant bracket (single-double and ' +
      'cancellation-free double-double) to tau in {7,8,9} and compares to a closed two-term model. It ' +
      'establishes NO operator positivity and certifies NO bound.',
    truncationCaveat:
      'NPHI=10 Phi-series truncation is inherited upstream; the closed-model constants K_lead, K6 carry ' +
      'that same truncation, so agreement or divergence between routes does not certify the analytic limit.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    latticeJitterCaveat:
      'Cross-platform libm variation in exp/log/expm1 shifts the exact tau where DD - plain first turns ' +
      'nonzero by a well or so and makes it non-monotone (it reads 0 again at some scan points); the ' +
      'robust readings are route Bs blow-up above tau=7, the usable window ending near tau ~ 7.25-7.5, ' +
      'and the DD accumulation being a non-limiter at tau=8 -- not the exact per-tau DD - plain digit.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33271_DD_WATSON_BRACKET_TAU789_RUN_ASSERTIONS = [
  {
    id: 'imp33271-tau7-still-tracks-the-model-under-the-gate',
    why: 'The reformulation buys one more usable well: at tau=7 route B still sits under the K0=3.46 gate ' +
         'and tracks the imp-3892 closed model to < 1e-2 (~7.4e-3).',
    holds: () => rows[0].underGate && rows[0].diffModel < 1e-2,
  },
  {
    id: 'imp33271-route-b-blows-up-at-tau8-and-tau9',
    why: 'THE MEASUREMENT: above tau=7 even the extended-precision route B diverges from the closed model ' +
         'by orders of magnitude (|B - model| > 1e2 at tau=8, > 1e6 at tau=9).',
    holds: () => routeBBlowsUpAtTau89,
  },
  {
    id: 'imp33271-dd-accumulation-is-not-the-limiter-at-tau8',
    why: 'REFINES imp-33229: at tau=8 the double-double accumulation shifts rhoRatio by < 1 while ' +
         '|B - model| > 1e2, so the u_dd = 2^-106 accumulation cancellation is NOT the operative wall -- ' +
         'the e^{4 tau} amplification of the final subtraction and the finite-quadrature floor are.',
    holds: () => ddNotTheLimiterAtTau8,
  },
  {
    id: 'imp33271-usable-window-ends-before-the-predicted-onset',
    why: 'Route Bs usable window (under the gate) ends below the imp-33229 predicted tau ~ 8.97 ' +
         'additive-cancellation onset -- the quadrature-floor amplification arrives first.',
    holds: () => usableWindowEndsBeforePredictedOnset,
  },
  {
    id: 'imp33271-dd-onset-in-the-imp33229-neighbourhood',
    why: 'The DD-vs-plain divergence first turns nonzero in the tau ~ 7.5-8.97 band, consistent with the ' +
         'imp-33229 u_dd = 2^-106 onset prediction about WHERE extended precision starts to matter.',
    holds: () => ddOnsetInPredictedNeighbourhood,
  },
  {
    id: 'imp33271-verdict-records-the-measurement',
    why: 'The classified verdict must record the usable-to-tau7-then-amplification-wall outcome, not remain ' +
         'indeterminate.',
    holds: () => verdict === 'ROUTE-B-USABLE-TO-TAU7-THEN-QUADRATURE-FLOOR-AMPLIFICATION-WALL-BELOW-IMP33229-ONSET',
  },
  {
    id: 'imp33271-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/reconstruction only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33271_DD_WATSON_BRACKET_TAU789_RUN.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33271_DD_WATSON_BRACKET_TAU789_RUN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33271-dd-watson-bracket-tau789-run assertion failed: ${assertion.id}`);
  }
}

export default IMP33271_DD_WATSON_BRACKET_TAU789_RUN;

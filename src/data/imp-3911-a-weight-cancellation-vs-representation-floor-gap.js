/**
 * @module imp-3911-a-weight-cancellation-vs-representation-floor-gap
 * @fileoverview imp-3911 -- MEASURE which floor binds the imp-3897 clean import-time
 *   self-computation window of -ln A(tau): the imp-3730 tau~6 CANCELLATION floor, or the
 *   derived tau~8.73 ABSOLUTE ulp(V)=1 representation floor. imp-3897 asserted the tau~6
 *   cancellation floor is what actually bounds the window but never DERIVED its location nor
 *   MEASURED the gap to the 8.73 absolute floor. This module closes that.
 *
 *   THE TWO FLOORS ARE FLOORS ON DIFFERENT OBSERVABLES
 *   --------------------------------------------------
 *   -ln A(tau) ~ pi e^{4 tau} + c(tau), with c(tau) an O(1) subleading correction
 *   (imp-3730: c(tau) = -ln A - pi e^{4 tau} -> c_inf ~ 0.3543). A double stores V=-ln A to
 *   RELATIVE 2^-52, so the absolute noise on V is ulp(V) = |V| * 2^-52 = pi e^{4 tau} * 2^-52.
 *
 *     (1) ABSOLUTE representation floor -- binds the RAW MAGNITUDE -ln A. Reached when
 *         ulp(V) = 1, i.e. V = 2^52, pi e^{4 tau} = 2^52  =>  tau_abs = ln(2^52/pi)/4 ~ 8.725.
 *         Past this V cannot even be held to unit absolute precision.
 *
 *     (2) CANCELLATION floor -- binds the SUBLEADING CORRECTION c(tau) = -ln A - pi e^{4 tau},
 *         a difference of two O(pi e^{4 tau}) quantities. The same ulp(V) noise lands directly
 *         on c. c is still CONVERGING toward c_inf with a residual |c(tau) - c_inf| = B e^{-2 tau}
 *         (imp-3730: geometric, ratio e^{-1} per 0.5 step). The correction's convergence becomes
 *         unreadable once the cancellation noise reaches that residual:
 *             ulp(V) = |c(tau) - c_inf|   =>   pi e^{4 tau} 2^-52 = B e^{-2 tau}
 *             =>   tau_cancel = ln( B * 2^52 / pi ) / 6.
 *
 *   MEASURED (all self-computing at import; peak-scaled substitution-Simpson, imp-3873/imp-3897)
 *   -------------------------------------------------------------------------------------------
 *   c(tau) reproduces the imp-3730 ladder to the printed digits and fits c(tau)=c_inf+B e^{-2 tau}:
 *       tau    c(tau)=-ln A - pi e^{4 tau}
 *       3.0    0.355480      c_inf (fit) ~ 0.354292   (imp-3730 extrapolated 0.354291)
 *       3.5    0.354728      B     (fit) ~ 0.479
 *       4.0    0.354453
 *       4.5    0.354351
 *       5.0    0.354314
 *   The two floors, from those self-computed fit constants:
 *       tau_cancel = ln(B 2^52/pi)/6   ~ 5.694   (the imp-3730 tau~6 cancellation floor, derived)
 *       tau_abs    = ln(2^52/pi)/4     ~ 8.725   (the imp-3897 absolute ulp(V)=1 floor)
 *       GAP        = tau_abs - tau_cancel ~ 3.03 tau units
 *   The raw magnitude -ln A stays clean FAR PAST the cancellation floor: its n=4000->8000 rung
 *   step and Xmax in {40,80} domain spread both stay <= ~1 ULP at tau in {6,6.5,7,7.5,8} --
 *   i.e. the substitution-Simpson holds -ln A to the last representable bit all the way toward
 *   the absolute floor, NOT stopping at the cancellation floor.
 *
 *   VERDICT (which floor binds, and by how many tau units)
 *   -----------------------------------------------------
 *   The binding constraint depends on the OBSERVABLE, and the two differ by ~3.03 tau units:
 *     - Extracting the O(1) subleading correction c(tau): BOUND by the CANCELLATION floor
 *       tau_cancel ~ 5.69 (~6). This is the TIGHTER floor and the one imp-3897 meant -- it caps
 *       the window in which the correction structure can be read, ~3 tau units below tau_abs.
 *     - Holding the raw magnitude -ln A: BOUND by the ABSOLUTE floor tau_abs ~ 8.72. -ln A itself
 *       is clean well past tau~6 (measured through tau=8 at <=~1 ULP); the cancellation floor does
 *       NOT bound it. imp-3897s "clean window tau<=6 for -ln A" is thus conservative for the raw
 *       magnitude -- it is the correction c(tau), not -ln A, that the tau~6 floor actually caps.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   ACCURACY / PROVENANCE MEASUREMENT ONLY, at the RH-equivalent scale class. It measures the
 *   floating-point floors on a quadrature value (and its subleading correction) for a fixed
 *   autocorrelation weight used inside a mass-feasibility diagnostic; it establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. No refereed bound is changed.
 *
 *   @see imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js (asserts, but never measures, the gap)
 *   @see imp-3730-a-weight-correction-limit.js (the c(tau)->c_inf ladder and its cancellation floor)
 *   @see imp-3873-a-weight-offline-literal-independent-reproduction.js (the peak-scaled substitution scheme)
 *
 *   Ticket: imp-3911 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)

/**
 * Factored ln Phi(u) (imp-3709/imp-3850/imp-3873/imp-3897 form): pull out the n=1 leading
 * exponent so nothing underflows at the ~1e-4067 magnitude class. amp_n &gt; 0 for u &gt;= 0.
 * ln Phi(u) = -pi e^{4u} + ln( sum_n amp_n e^{-pi (n^2-1) e^{4u}} ).
 */
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2; // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// The imp-3873/imp-3897 peak-scaled substitution uniform log-Simpson: s = sigma * x,
// sigma = 1/(4 pi e^{4 tau}); node placement tracks the analytic peak so n<=8000 resolves it at
// any tau. Returns -ln A(tau), self-computing at import.
function negLnAsubSimpson(tau, Xmax, n) {
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  const m = n % 2 === 0 ? n : n + 1;
  const h = Xmax / m;
  const logw = [];
  let mx = -Infinity;
  for (let i = 0; i <= m; i += 1) {
    const w = i === 0 || i === m ? 1 : (i % 2 === 0 ? 2 : 4);
    const s = sigma * (i * h);
    const t = Math.log(w) + logPhiFactored(s) + logPhiFactored(s + tau);
    logw.push(t);
    if (t > mx) mx = t;
  }
  let acc = 0;
  for (const t of logw) acc += Math.exp(t - mx);
  return -(Math.log(sigma) + Math.log(h / 3) + mx + Math.log(acc));
}

// -- (A) Self-compute the correction c(tau) = -ln A - pi e^{4 tau} on a clean tau grid and fit
//        c(tau) = c_inf + B e^{-2 tau} (linear in c_inf,B via x = e^{-2 tau}). --------------------
const CTAUS = [3, 3.5, 4, 4.5, 5];
const CORRECTION_TABLE = CTAUS.map((tau) => {
  const V = negLnAsubSimpson(tau, 40, 8000);
  const c = V - PI * Math.exp(4 * tau);
  return Object.freeze({ tau, negLnA: V, c });
});
const XS = CORRECTION_TABLE.map((r) => Math.exp(-2 * r.tau));
const YS = CORRECTION_TABLE.map((r) => r.c);
const NFIT = XS.length;
const SX = XS.reduce((a, b) => a + b, 0);
const SY = YS.reduce((a, b) => a + b, 0);
const SXX = XS.reduce((a, b) => a + b * b, 0);
const SXY = XS.reduce((a, b, i) => a + b * YS[i], 0);
const B_FIT = (NFIT * SXY - SX * SY) / (NFIT * SXX - SX * SX);
const C_INF = (SY - B_FIT * SX) / NFIT;

// -- (B) The two floors, derived from the self-computed fit constants. --------------------------
// Cancellation floor: ulp(pi e^{4 tau}) = |c(tau) - c_inf| = B e^{-2 tau}
//   =>  pi e^{4 tau} 2^-52 = B e^{-2 tau}  =>  tau_cancel = ln( B 2^52 / pi ) / 6.
const tauCancel = Math.log((B_FIT * Math.pow(2, 52)) / PI) / 6;
// Absolute representation floor: ulp(V) = |V| 2^-52 = 1  =>  V = 2^52  =>  tau_abs = ln(2^52/pi)/4.
const tauAbs = Math.log(Math.pow(2, 52) / PI) / 4;
// Companion "correction fully swamped" floor: ulp(V) = c_inf (c loses ALL its digits, not just its
// convergence) -- lands between the two, near tau ~ 8.47.
const tauSwamp = Math.log((C_INF * Math.pow(2, 52)) / PI) / 4;
const floorGapTau = tauAbs - tauCancel;

// -- (C) Demonstrate the raw magnitude -ln A stays clean PAST the cancellation floor, up toward
//        the absolute floor -- so the cancellation floor does NOT bind the raw magnitude. --------
const RAW_CLEAN_TAUS = [6, 6.5, 7, 7.5, 8];
const RAW_CLEANLINESS = RAW_CLEAN_TAUS.map((tau) => {
  const V = negLnAsubSimpson(tau, 40, 8000);
  const ulp = Math.abs(V) * EPS;
  const rung = Math.abs(V - negLnAsubSimpson(tau, 40, 4000)) / ulp; // n=4000->8000 rung step
  const dom = Math.abs(V - negLnAsubSimpson(tau, 80, 8000)) / ulp; // Xmax 40->80 domain spread
  return Object.freeze({ tau, negLnA: V, ulp, rungStepUlp: rung, domainSpreadUlp: dom });
});

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) The derived cancellation floor lands at the imp-3730 tau~6 ladder-noise onset.
const cancelFloorAtImp3730 = tauCancel > 5.4 && tauCancel < 6.0;
// (2) The absolute floor lands at the imp-3897 tau~8.73 value.
const absFloorAtImp3897 = tauAbs > 8.6 && tauAbs < 8.85;
// (3) The two floors are separated by ~3 tau units (the measured gap).
const gapIsAboutThreeTau = floorGapTau > 2.7 && floorGapTau < 3.3;
// (4) The correction fit reproduces imp-3730 c_inf ~ 0.3543 (positive constant, not decaying).
const cInfMatchesImp3730 = Math.abs(C_INF - 0.354292) < 5e-5 && B_FIT > 0.3 && B_FIT < 0.7;
// (5) The raw magnitude -ln A is clean (<=2 ULP rung + domain) at EVERY tau past the cancellation
//     floor through tau=8 -- confirming the cancellation floor does not bind the raw magnitude.
const rawCleanPastCancelFloor = RAW_CLEANLINESS.every(
  (r) => r.tau > tauCancel && r.rungStepUlp <= 2 && r.domainSpreadUlp <= 2,
);
// (6) Ordering sanity: cancellation floor < fully-swamped floor < (near) absolute floor.
const floorsOrdered = tauCancel < tauSwamp && tauSwamp < tauAbs;

const verdict =
  cancelFloorAtImp3730 &&
  absFloorAtImp3897 &&
  gapIsAboutThreeTau &&
  cInfMatchesImp3730 &&
  rawCleanPastCancelFloor &&
  floorsOrdered
    ? 'THE-imp-3897-CLEAN-SELF-COMPUTATION-WINDOW-IS-BOUND-BY-TWO-DISTINCT-FLOORS-ON-DIFFERENT-OBSERVABLES,-SEPARATED-BY-~3.03-TAU-UNITS:-THE-imp-3730-CANCELLATION-FLOOR-tau_cancel=ln(B-2^52/pi)/6~5.69-(~6)-BINDS-EXTRACTION-OF-THE-O(1)-SUBLEADING-CORRECTION-c(tau)=-lnA-pi-e^{4tau}-(THE-TIGHTER,-BINDING-FLOOR-imp-3897-MEANT),-WHILE-THE-ABSOLUTE-ulp(V)=1-FLOOR-tau_abs=ln(2^52/pi)/4~8.72-BINDS-THE-RAW-MAGNITUDE--lnA,-WHICH-STAYS-CLEAN-TO-<=~1-ULP-THROUGH-tau=8-WELL-PAST-THE-CANCELLATION-FLOOR;-GAP-tau_abs-tau_cancel~3.03'
    : 'INDETERMINATE';

export const IMP3911_A_WEIGHT_CANCELLATION_VS_REPRESENTATION_FLOOR_GAP = Object.freeze({
  id: 'imp-3911-a-weight-cancellation-vs-representation-floor-gap',
  ticket: 'imp-3911',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-3897-a-weight-substitution-simpson-tau35-40-precision-floor.js',

  summary:
    'DERIVES the imp-3730 tau~6 CANCELLATION floor precisely and MEASURES its gap to the imp-3897 tau~8.73 ' +
    'ABSOLUTE ulp(V)=1 floor, resolving which binds the clean import-time self-computation window of -ln A(tau). ' +
    'The two are floors on DIFFERENT observables. Self-computing c(tau)=-ln A - pi e^{4 tau} on tau in {3..5} and ' +
    'fitting c(tau)=c_inf+B e^{-2 tau} gives c_inf~0.354292 (matching imp-3730), B~0.479. The cancellation floor -- ' +
    'where the ulp(V)=pi e^{4 tau} 2^-52 noise on the difference c reaches its remaining convergence tail ' +
    'B e^{-2 tau} -- is tau_cancel=ln(B 2^52/pi)/6~5.69, exactly the imp-3730 tau~6 ladder-noise onset. The absolute ' +
    'floor tau_abs=ln(2^52/pi)/4~8.72 binds instead the RAW magnitude -ln A, which the peak-scaled substitution-' +
    'Simpson holds to <=~1 ULP (rung + domain spread) all the way through tau=8, far past the cancellation floor. ' +
    'The gap is tau_abs-tau_cancel~3.03 tau units: the cancellation floor is the TIGHTER, binding constraint on ' +
    'reading the O(1) correction (the window imp-3897 meant), while the raw magnitude is bound only ~3 tau later. ' +
    'ACCURACY/PROVENANCE MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    substitutionPath: 'peak-scaled substitution uniform Simpson s=sigma*x, sigma=1/(4 pi e^{4 tau}), n<=8000 -- the imp-3873/imp-3897 scheme whose node placement tracks the collapsing peak, self-computing -ln A at import',
    correctionFit: 'c(tau)=-ln A - pi e^{4 tau} is self-computed on tau in {3,3.5,4,4.5,5} and fit to c(tau)=c_inf+B e^{-2 tau} by linear regression in x=e^{-2 tau}; the fit reproduces the imp-3730 ladder and its c_inf~0.3543 positive constant',
    cancellationFloor: 'the ulp(V)=pi e^{4 tau} 2^-52 noise on the DIFFERENCE c reaches its remaining convergence tail |c(tau)-c_inf|=B e^{-2 tau} at pi e^{4 tau} 2^-52 = B e^{-2 tau} => tau_cancel=ln(B 2^52/pi)/6; below this the correction is still readable, above it the ladder increments drown in cancellation noise (imp-3730 tau~6 onset)',
    absoluteFloor: 'the raw magnitude V=-ln A can be held to unit absolute precision only while ulp(V)=|V| 2^-52 < 1, i.e. V < 2^52, pi e^{4 tau} < 2^52 => tau_abs=ln(2^52/pi)/4',
    rawCleanlinessProbe: 'the substitution-Simpson n=4000->8000 rung step and Xmax 40->80 domain spread (both in ULP of |V|) are measured at tau in {6..8} to show the RAW magnitude stays at the ~1-ULP floor well past the cancellation floor, so only the correction is capped at tau~6',
    selfComputing: 'every table entry, both fit constants, both floors and the raw-cleanliness probe recompute at import (n<=8000 nodes); no offline literal is used as an input',
  }),

  measured: Object.freeze({
    correctionTaus: CTAUS,
    correctionTable: CORRECTION_TABLE,
    cInf: C_INF,
    bFit: B_FIT,
    unitRoundoff: EPS,
    tauCancel,
    tauAbs,
    tauSwamp,
    floorGapTau,
    rawCleanTaus: RAW_CLEAN_TAUS,
    rawCleanliness: RAW_CLEANLINESS,
    cancelFloorAtImp3730,
    absFloorAtImp3897,
    gapIsAboutThreeTau,
    cInfMatchesImp3730,
    rawCleanPastCancelFloor,
    floorsOrdered,
    verdict,
  }),

  interpretation: Object.freeze({
    twoFloorsTwoObservables:
      'The imp-3730 cancellation floor and the imp-3897 absolute floor are NOT the same floor at different names: ' +
      'the cancellation floor caps the SUBLEADING correction c(tau)=-ln A - pi e^{4 tau} (a difference of two ' +
      'O(pi e^{4 tau}) terms), while the absolute floor caps the RAW magnitude -ln A. The same ulp(V) noise binds ' +
      'the small difference ~3 tau units earlier than it binds the large magnitude.',
    cancellationFloorDerived:
      'Setting the cancellation noise ulp(V)=pi e^{4 tau} 2^-52 equal to the residual convergence tail ' +
      '|c(tau)-c_inf|=B e^{-2 tau} gives tau_cancel=ln(B 2^52/pi)/6~5.69 from the self-computed B~0.479 -- landing ' +
      'exactly at the imp-3730 tau~6 onset where the c(tau) ladder increments went noisy (c(6) even ticked UP).',
    absoluteFloorConfirmed:
      'ulp(V)=|V| 2^-52=1 solves to tau_abs=ln(2^52/pi)/4~8.72, matching the imp-3897 tau~8.73 value; the raw ' +
      'substitution-Simpson -ln A stays at <=~1 ULP (rung + domain) through tau=8, confirming the raw magnitude is ' +
      'clean far past the cancellation floor and is bound only by this absolute floor.',
    whichBinds:
      'The binding floor depends on the observable, and the two are separated by ~3.03 tau units. For the O(1) ' +
      'correction c(tau) the CANCELLATION floor ~5.69 (~6) binds -- the tighter constraint imp-3897 meant. For the ' +
      'raw magnitude -ln A the ABSOLUTE floor ~8.72 binds. imp-3897s "clean window tau<=6 for -ln A" is thus ' +
      'conservative for the raw magnitude: it is the correction, not -ln A itself, that the tau~6 floor caps.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the floating-point floors on a quadrature value (and its subleading correction) for a fixed ' +
      'autocorrelation weight -- a magnitude used inside a mass-feasibility diagnostic. It establishes NO operator ' +
      'positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    precisionScopeOnly:
      'This locates FLOATING-POINT floors, not mathematical ones. The cancellation floor is a property of ' +
      'differencing -ln A against pi e^{4 tau}; an extended-precision -ln A would push both floors outward but ' +
      'cannot change c_inf > 0 nor the ~3-tau separation structure (both scale with the mantissa width).',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP3911_A_WEIGHT_CANCELLATION_VS_REPRESENTATION_FLOOR_GAP_ASSERTIONS = [
  {
    id: 'imp3911-cancellation-floor-derived-at-imp3730-tau6',
    why: 'THE DERIVATION: the cancellation floor tau_cancel=ln(B 2^52/pi)/6, from the self-computed fit constant ' +
         'B~0.479, must land in the imp-3730 tau~6 ladder-noise onset (5.4..6.0).',
    holds: () => cancelFloorAtImp3730,
  },
  {
    id: 'imp3911-absolute-floor-at-imp3897-tau873',
    why: 'The absolute ulp(V)=1 floor tau_abs=ln(2^52/pi)/4 must land at the imp-3897 tau~8.73 value (8.6..8.85).',
    holds: () => absFloorAtImp3897,
  },
  {
    id: 'imp3911-floor-gap-is-about-three-tau',
    why: 'THE HEADLINE MEASUREMENT: the two floors must be separated by ~3 tau units ' +
         '(tau_abs - tau_cancel in 2.7..3.3), the quantitative gap imp-3897 asserted but never measured.',
    holds: () => gapIsAboutThreeTau,
  },
  {
    id: 'imp3911-correction-fit-reproduces-imp3730-cinf',
    why: 'The self-computed correction fit must reproduce the imp-3730 positive constant c_inf~0.3543 ' +
         '(|c_inf-0.354292|<5e-5) with a positive decay amplitude B in (0.3,0.7), tying the derivation to imp-3730.',
    holds: () => cInfMatchesImp3730,
  },
  {
    id: 'imp3911-raw-magnitude-clean-past-cancellation-floor',
    why: 'THE BINDING-FLOOR DISCRIMINATOR: the raw magnitude -ln A must stay clean (n=4000->8000 rung step AND ' +
         'Xmax 40->80 domain spread both <=2 ULP) at EVERY tau in {6..8}, all past tau_cancel -- proving the ' +
         'cancellation floor binds only the correction, not the raw magnitude (which the absolute floor binds).',
    holds: () => rawCleanPastCancelFloor,
  },
  {
    id: 'imp3911-floors-correctly-ordered',
    why: 'Ordering sanity: the cancellation floor (correction convergence lost) must precede the fully-swamped ' +
         'floor (correction has zero digits) which must precede the absolute magnitude floor.',
    holds: () => floorsOrdered,
  },
  {
    id: 'imp3911-verdict-records-the-gap-and-which-binds',
    why: 'The classified verdict must record the two-floor / two-observable resolution with the ~3.03-tau gap, ' +
         'not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3911-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: precision measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3911_A_WEIGHT_CANCELLATION_VS_REPRESENTATION_FLOOR_GAP.honestCaveat;
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

for (const assertion of IMP3911_A_WEIGHT_CANCELLATION_VS_REPRESENTATION_FLOOR_GAP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3911-a-weight-cancellation-vs-representation-floor-gap assertion failed: ${assertion.id}`);
  }
}

export default IMP3911_A_WEIGHT_CANCELLATION_VS_REPRESENTATION_FLOOR_GAP;

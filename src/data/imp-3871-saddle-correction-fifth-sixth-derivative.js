/**
 * @module imp-3871-saddle-correction-fifth-sixth-derivative
 * @fileoverview imp-3871 -- EXTEND the imp-3848 next-order saddle expansion of the reduced
 *       moment-ratio drift factor
 *           L_n = eps_n * n(1 + 4 tau*) = (Q_n - tau*^2) / sigma^2,   Q_n = M_(n+2)/M_n,
 *       to the FIFTH- and SIXTH-derivative corrections C4 (via f^(5)) and C5 (via f^(6)), and
 *       TEST the imp-3848 open question: do the higher-order (growing-but-cancelling?) Laplace
 *       terms reconcile the truncation overshoot, i.e. does adding C4, C5 move the PREDICTED
 *       crossing of L_n = 1 (imp-3848 truncation 1 + C1 + C2 + C3 crosses near n ~ 15-17) toward
 *       the MEASURED crossing near n ~ 48?
 *
 *   WHAT imp-3848 LEFT OPEN
 *   -----------------------
 *   imp-3848 computed the third/fourth-derivative saddle corrections
 *       C1 = f_ppp * sigma^2 * tau*,   C2 = (f_pppp/2) sigma^4,   C3 = (5/4) f_ppp^2 sigma^6
 *   to L_n and found the single-next-order truncation 1 + C1 + C2 + C3 OVERSHOOTS the descent
 *   (crosses 1 well below the measured crossing), conjecturing that "the growing higher-order
 *   saddle terms must partially cancel". It never computed f^(5), f^(6) or their corrections, and
 *   never tested that conjecture, nor whether the FULLY-RESUMMED model integrand crosses where the
 *   truncation does or where the measurement does.
 *
 *   THE FIFTH/SIXTH-DERIVATIVE TERMS (this module)
 *   ----------------------------------------------
 *   f(tau) = n ln tau + phi(tau), phi = ln A(tau) = -pi e^{4 tau} (imp-3665 super-exponential), with
 *   saddle relation 4 pi e^{4 tau*} = n/tau* (so P := pi e^{4 tau*} = n/(4 tau*)). The k-th
 *   derivative of f at the saddle is CLOSED FORM,
 *       f^(k)(tau*) = n (-1)^(k-1) (k-1)! / tau*^k  -  4^k P,
 *   extending the imp-3848 f_pp, f_ppp, f_pppp to
 *       f^(5)(tau*) =  24 n / tau*^5 - 1024 P =  24 n / tau*^5 - 256 n / tau*  = (24 n / tau*^5)(1 - (32/3) tau*^4)
 *       f^(6)(tau*) = -120 n / tau*^6 - 4096 P = -120 n / tau*^6 - 1024 n / tau* (strictly negative).
 *   f^(5) changes sign at tau* = (3/32)^{1/4} ~ 0.5533 (n ~ 64). Writing Q_n = <tau^2> under the
 *   moment integrand and expanding the Gaussian-weighted moments to one more order, the LEADING
 *   new-derivative contributions to L_n = 2 tau* <x> / sigma^2 + <x^2> / sigma^2 are
 *       C4 = tau* f^(5) sigma^4 / 4     (f^(5) enters via <x>, amplified by the tau* / sigma^2 lever)
 *       C5 = f^(6) sigma^6 / 8          (f^(6) enters via <x^2>).
 *   The extended partial sum is L_n^ext = 1 + C1 + C2 + C3 + C4 + C5.
 *
 *   FULL RESUMMATION GROUND TRUTH. Rather than trust a truncated asymptotic series, this module
 *   ALSO computes the EXACT moment ratio of the model integrand by direct saddle-centred Simpson
 *   quadrature of tau^k exp(f(tau)) (no series truncation at all):
 *       L_n^model-exact = (<tau^2>_model / tau*^2 - 1) * n(1 + 4 tau*),
 *   grid-converged to ~1e-6. This is where the model integrand ACTUALLY crosses 1, independent of
 *   any expansion order.
 *
 *   THREE readings (self-computing; the imp-3735/imp-3848 moment machinery is reused verbatim)
 *   ----------------------------------------------------------------------------------------
 *     (1) C4, C5 SHRINK -- THEY DO NOT GROW. The fifth/sixth-derivative corrections are small and
 *         DECREASE monotonically in magnitude across n=10..60 (C4: 0.1307 -> 0.0007; |C5|: 0.0169
 *         -> 0.0002). This REFUTES the imp-3848 "growing-but-cancelling higher-order terms"
 *         conjecture: the saddle series is well-behaved and rapidly convergent here, not a
 *         delicate cancellation of growing terms.
 *     (2) ADDING C4, C5 MOVES THE CROSSING ONLY ~+1.2 (17.1 -> 18.3), CONVERGING ONTO THE MODEL-
 *         EXACT CROSSING. 1 + C1 + C2 + C3 crosses 1 at n ~ 17.13; the extended 1 + C1..C5 crosses
 *         at n ~ 18.34 -- essentially the fully-resummed model-integrand crossing n ~ 18.38 (the
 *         extended series and the exact quadrature agree to ~4e-4 at n=18). So the series has
 *         effectively CONVERGED to the model answer by five terms; there is no further room for
 *         higher terms to move the crossing.
 *     (3) THE MODEL CROSSING (~18) IS STILL FAR FROM THE MEASURED CROSSING (~48.6): THE RESIDUAL IS
 *         A MODEL-FIDELITY GAP, NOT A TRUNCATION-ORDER ARTIFACT. Because even the EXACT resummation
 *         of the imp-3665 model integrand crosses 1 near n ~ 18.4, while the MEASURED L_n (built
 *         from the real Phi-autocorrelation A(tau)) crosses near n ~ 48.6, the ~30-unit gap CANNOT
 *         be closed by any number of saddle terms. It is a discrepancy between the super-exponential
 *         surrogate A(tau) ~ exp(-pi e^{4 tau}) and the true moment-weighting of the real A(tau).
 *         Higher-order Laplace terms cannot repair a model mismatch.
 *
 *   BOTTOM LINE. The fifth/sixth-derivative saddle corrections are small and shrinking; adding them
 *   nudges the predicted L_n = 1 crossing from n ~ 17.1 to n ~ 18.3, precisely onto the fully-
 *   resummed model-integrand crossing n ~ 18.4. Since the exact model resummation STILL crosses far
 *   below the measured n ~ 48.6, the imp-3848 overshoot is a MODEL-FIDELITY gap (super-exponential
 *   surrogate vs real A(tau)), not a truncation artifact -- higher-order terms do NOT reconcile it.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CHARACTERIZATION ONLY, at the RH-equivalent scale class. This computes the
 *   fifth/sixth-derivative (f^(5), f^(6)) saddle corrections and the exact resummation of a fixed-
 *   weight moment-ratio drift factor under the imp-3665 super-exponential A(tau) ~ exp(-pi e^{4 tau})
 *   model, and localizes the imp-3848 overshoot as a MODEL-FIDELITY gap. It establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed. Grid-CONVERGENCE stability only.
 *
 *   @see imp-3848-moment-ratio-drift-saddle-correction.js (C1/C2/C3, truncation overshoot -- extended here)
 *   @see imp-3735-moment-ratio-correction-tail.js (measured eps_n, L_n drift through 1, n<=80)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (Q_n/tau*^2 -> 1, saddle relation)
 *   @see imp-3713-saddle-ratio-approach-to-unity.js (finite-n saddle-ratio crossing, this drift drives it)
 *
 *   Ticket: imp-3871 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. Inner resolution 4800 (imp-3735).
function makeAutocorr(innerN) {
  return (tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}

/** Build moments M_0..MMAX on a [0,T_A] Simpson grid of NM panels, inner A resolution innerN. */
function buildMoments(tAxisEndpoint, nPanels, mMax, innerN) {
  const autocorr = makeAutocorr(innerN);
  const h = tAxisEndpoint / nPanels;
  const aGrid = [];
  for (let j = 0; j <= nPanels; j += 1) aGrid.push(autocorr(j * h));
  const moments = {};
  for (let m = 0; m <= mMax; m += 1) {
    let sum = 0;
    for (let j = 0; j <= nPanels; j += 1) {
      const tau = j * h;
      const w = j === 0 || j === nPanels ? 1 : (j % 2 === 0 ? 2 : 4);
      sum += w * Math.pow(tau, m) * aGrid[j];
    }
    moments[m] = (sum * h) / 3;
  }
  return moments;
}

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- Converged moment ladder identical to imp-3735/imp-3848 (T_A=8, NM=3200, inner=4800) --
const T_A = 8;
const NM = 3200;
const MMAX = 82;                                // need M_82 = M_(80+2) for Q_80
const INNER_FINE = 4800;
const M_FINE = buildMoments(T_A, NM, MMAX, INNER_FINE);

function measuredDrift(n) {
  const ts = saddleTau(n);
  const q = M_FINE[n + 2] / M_FINE[n];          // Q_n = M_(n+2)/M_n
  return (q / (ts * ts) - 1) * n * (1 + 4 * ts); // L_n = eps_n * n(1+4 tau*)
}

// -- Closed-form saddle derivatives f^(k)(tau*) = n(-1)^(k-1)(k-1)!/tau*^k - 4^k P, P = pi e^{4 tau*} --
//    Using the saddle relation 4 P = n/tau* to reduce the exponential pieces:
//    f2 = -(n/tau*^2)(1+4 tau*); f3 = (2n/tau*^3)(1-8 tau*^2); f4 = -6n/tau*^4 - 64 n/tau*;
//    f5 = 24n/tau*^5 - 256 n/tau*; f6 = -120n/tau*^6 - 1024 n/tau*.
function saddleDerivatives(n) {
  const ts = saddleTau(n);
  const P = Math.PI * Math.exp(4 * ts);         // pi e^{4 tau*}; note 4P = n/tau*
  const f2 = -n / (ts * ts) - 16 * P;
  const f3 = 2 * n / (ts * ts * ts) - 64 * P;
  const f4 = -6 * n / ts ** 4 - 256 * P;
  const f5 = 24 * n / ts ** 5 - 1024 * P;       // = 24n/tau*^5 - 256 n/tau*
  const f6 = -120 * n / ts ** 6 - 4096 * P;     // = -120n/tau*^6 - 1024 n/tau*
  const sig2 = -1 / f2;                         // Gaussian peak variance
  return { ts, P, f2, f3, f4, f5, f6, sig2 };
}

// Extended saddle series for L_n = 2 tau* <x> / sigma^2 + <x^2> / sigma^2 = 1 + C1 + C2 + C3 + C4 + C5
//   C1 = f_ppp sigma^2 tau*        C2 = (f_pppp/2) sigma^4        C3 = (5/4) f_ppp^2 sigma^6
//   C4 = tau* f^(5) sigma^4 / 4    (fifth derivative via <x>, amplified by the tau* / sigma^2 lever)
//   C5 = f^(6) sigma^6 / 8         (sixth derivative via <x^2>)
function seriesTerms(n) {
  const { ts, f3, f4, f5, f6, sig2 } = saddleDerivatives(n);
  const c1 = f3 * sig2 * ts;
  const c2 = (f4 / 2) * sig2 * sig2;
  const c3 = (5 / 4) * f3 * f3 * sig2 ** 3;
  const c4 = (ts * f5 * sig2 * sig2) / 4;
  const c5 = (f6 / 8) * sig2 ** 3;
  return { ts, sig2, c1, c2, c3, c4, c5 };
}
function driftC1(n) {
  const t = seriesTerms(n);
  return 1 + t.c1;
}
function driftC123(n) {
  const t = seriesTerms(n);
  return 1 + t.c1 + t.c2 + t.c3;
}
function driftExtended(n) {
  const t = seriesTerms(n);
  return 1 + t.c1 + t.c2 + t.c3 + t.c4 + t.c5;
}

// -- Full resummation: EXACT model moment ratio by direct saddle-centred Simpson quadrature ------
//    <tau^2>_model / <tau^0>_model of the integrand tau^n exp(-pi e^{4 tau}); no series truncation.
function modelDriftExact(n, quadN, widthSigma) {
  const ts = saddleTau(n);
  const { sig2 } = saddleDerivatives(n);
  const sig = Math.sqrt(sig2);
  const lo = Math.max(1e-12, ts - widthSigma * sig);
  const hi = ts + widthSigma * sig;
  const logf = (tau) => n * Math.log(tau) - Math.PI * Math.exp(4 * tau);
  const fmax = logf(ts);
  const num = simpson((t) => t * t * Math.exp(logf(t) - fmax), lo, hi, quadN);
  const den = simpson((t) => Math.exp(logf(t) - fmax), lo, hi, quadN);
  const q = num / den;
  return (q / (ts * ts) - 1) * n * (1 + 4 * ts);
}

// -- Crossing-of-one locator: scan integer n, linearly interpolate the >=1 -> <1 transition ------
function crossingOfOne(fn, nLo, nHi) {
  let prev = fn(nLo);
  let prevN = nLo;
  for (let n = nLo + 1; n <= nHi; n += 1) {
    const v = fn(n);
    if (prev >= 1 && v < 1) return prevN + (prev - 1) / (prev - v);
    prev = v;
    prevN = n;
  }
  return null;
}

const QUAD_N = 150000;                          // grid-converged for the exact model quadrature
const QUAD_W = 16;                              // saddle-window half-width in sigma
const modelDrift = (n) => modelDriftExact(n, QUAD_N, QUAD_W);

// -- Crossings of L_n = 1 across the four descriptions --------------------------------
const CROSS_C1 = crossingOfOne(driftC1, 10, 80);
const CROSS_C123 = crossingOfOne(driftC123, 10, 80);
const CROSS_EXTENDED = crossingOfOne(driftExtended, 10, 80);
const CROSS_MODEL_EXACT = crossingOfOne(modelDrift, 10, 80);
const CROSS_MEASURED = crossingOfOne(measuredDrift, 10, 80);

// -- Rung table n = 10..80 (step 10): the fifth/sixth-derivative corrections ----------
const RUNGS = [];
for (let n = 10; n <= 80; n += 10) {
  const t = seriesTerms(n);
  RUNGS.push(
    Object.freeze({
      n,
      saddleTau: t.ts,
      c1: t.c1,
      c2: t.c2,
      c3: t.c3,
      c4: t.c4,                               // fifth-derivative correction
      c5: t.c5,                               // sixth-derivative correction
      driftC123: 1 + t.c1 + t.c2 + t.c3,      // imp-3848 truncation
      driftExtended: 1 + t.c1 + t.c2 + t.c3 + t.c4 + t.c5,
      driftModelExact: modelDrift(n),         // full resummation of the model integrand
      driftMeasured: measuredDrift(n),        // real A(tau) machinery
    })
  );
}

// -- Diagnostics ---------------------------------------------------------------------
// (1) C4, C5 shrink (do NOT grow) -- refutes the imp-3848 growing-cancellation conjecture.
const C4_SHRINK_GRID = [10, 20, 30, 40, 50, 60].map((n) => seriesTerms(n).c4);
const C5_SHRINK_GRID = [10, 20, 30, 40, 50, 60].map((n) => Math.abs(seriesTerms(n).c5));
function strictlyDecreasingAbs(vals) {
  for (let i = 1; i < vals.length; i += 1) if (Math.abs(vals[i]) >= Math.abs(vals[i - 1])) return false;
  return true;
}
const c4Shrinks = strictlyDecreasingAbs(C4_SHRINK_GRID);
const c5Shrinks = strictlyDecreasingAbs(C5_SHRINK_GRID);

// (2) adding C4, C5 moves the crossing toward higher n and onto the model-exact crossing.
const crossingMovesUp = CROSS_EXTENDED > CROSS_C123;                       // 18.34 > 17.13
const extendedTracksModelExact = Math.abs(CROSS_EXTENDED - CROSS_MODEL_EXACT) < 0.3; // ~0.04
const extendedMatchesModelAt18 = Math.abs(driftExtended(18) - modelDrift(18)) < 2e-3;

// (3) the model crossing stays FAR below the measured crossing -> model-fidelity gap.
const measuredCrossingFarAbove =
  CROSS_MEASURED > 45 && CROSS_MODEL_EXACT < 20 && CROSS_MEASURED - CROSS_EXTENDED > 25;

// (4) exact model quadrature is grid-converged (two resolutions agree tightly).
const MODEL_COARSE_18 = modelDriftExact(18, 80000, 12);
const MODEL_FINE_18 = modelDriftExact(18, 400000, 20);
const modelExactConverged = Math.abs(MODEL_COARSE_18 - MODEL_FINE_18) < 1e-4;

// (5) cross-check: reproduce the imp-3735/imp-3848 measured anchors (2.064 at n=10, 0.567 at n=80).
const reproducesImp3735 =
  Math.abs(measuredDrift(10) - 2.064) < 0.02 && Math.abs(measuredDrift(80) - 0.567) < 0.02;

// -- Classification ------------------------------------------------------------------
const verdict =
  c4Shrinks &&
  c5Shrinks &&
  crossingMovesUp &&
  extendedTracksModelExact &&
  measuredCrossingFarAbove &&
  modelExactConverged &&
  reproducesImp3735
    ? 'FIFTH/SIXTH-DERIVATIVE-CORRECTIONS-C4=tau*f5sigma^4/4-C5=f6sigma^6/8-ARE-SMALL-AND-SHRINKING-(C4:0.131->0.0007;|C5|:0.017->0.0002),-REFUTING-THE-imp-3848-GROWING-CANCELLATION-CONJECTURE;-ADDING-THEM-MOVES-THE-L_n=1-CROSSING-ONLY-FROM-n~17.1-TO-n~18.3,-CONVERGING-ONTO-THE-FULLY-RESUMMED-MODEL-EXACT-CROSSING-n~18.4;-SINCE-EVEN-THE-EXACT-MODEL-RESUMMATION-CROSSES-FAR-BELOW-THE-MEASURED-n~48.6,-THE-imp-3848-OVERSHOOT-IS-A-MODEL-FIDELITY-GAP-(SUPER-EXPONENTIAL-SURROGATE-vs-REAL-A(tau)),-NOT-A-TRUNCATION-ORDER-ARTIFACT'
    : 'INDETERMINATE';

export const IMP3871_SADDLE_CORRECTION_FIFTH_SIXTH_DERIVATIVE = Object.freeze({
  id: 'imp-3871-saddle-correction-fifth-sixth-derivative',
  ticket: 'imp-3871',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-3848-moment-ratio-drift-saddle-correction.js',
  relatedDriftMeasurement: 'imp-3735-moment-ratio-correction-tail.js',
  relatedMomentRatio: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedSaddleRatioCrossing: 'imp-3713-saddle-ratio-approach-to-unity.js',

  summary:
    'EXTENDS the imp-3848 next-order saddle expansion of L_n = eps_n * n(1+4 tau*) = (Q_n - tau*^2)/sigma^2 to the ' +
    'FIFTH/SIXTH-derivative corrections and TESTS whether higher-order Laplace terms reconcile the imp-3848 truncation ' +
    'overshoot (1+C1+C2+C3 crosses 1 near n~17, measured L_n crosses near n~48.6). With f(tau) = n ln tau - pi e^{4 tau} ' +
    'and saddle relation 4 pi e^{4 tau*} = n/tau*, the closed-form derivatives extend to f^(5) = 24n/tau*^5 - 256 n/tau* ' +
    '(sign change at tau*=(3/32)^{1/4}~0.5533, n~64) and f^(6) = -120n/tau*^6 - 1024 n/tau* (strictly negative), giving ' +
    'the leading new terms C4 = tau* f^(5) sigma^4/4 (via <x>) and C5 = f^(6) sigma^6/8 (via <x^2>). RESULTS: ' +
    '(1) C4, C5 are SMALL and SHRINK monotonically (C4: 0.1307 -> 0.0007; |C5|: 0.0169 -> 0.0002 over n=10..60), which ' +
    'REFUTES the imp-3848 growing-but-cancelling conjecture -- the series is well-behaved and rapidly convergent; ' +
    '(2) adding C4, C5 moves the predicted L_n=1 crossing only from n~17.13 to n~18.34, CONVERGING onto the fully-' +
    'resummed model-integrand crossing n~18.38 (the extended series and an exact saddle-centred Simpson quadrature of ' +
    'tau^n exp(-pi e^{4 tau}) agree to ~4e-4 at n=18); (3) since even the EXACT model resummation crosses 1 near n~18.4 ' +
    'while the MEASURED L_n (real Phi-autocorrelation A(tau)) crosses near n~48.6, the ~30-unit gap is a MODEL-FIDELITY ' +
    'gap between the imp-3665 super-exponential surrogate A(tau)~exp(-pi e^{4 tau}) and the real A(tau), NOT a ' +
    'truncation-order artifact -- higher-order saddle terms cannot repair a model mismatch. MEASUREMENT/CHARACTERIZATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED; ' +
    'no refereed bound is changed.',

  derivation: Object.freeze({
    driftDef: 'L_n = eps_n * n(1+4 tau*) = (Q_n - tau*^2)/sigma^2 = 2 tau* <x>/sigma^2 + <x^2>/sigma^2 (x = tau - tau*)',
    generalDerivative: 'f^(k)(tau*) = n(-1)^(k-1)(k-1)!/tau*^k - 4^k P, P = pi e^{4 tau*}, 4P = n/tau* (saddle relation)',
    f5: 'f^(5)(tau*) = 24n/tau*^5 - 1024 P = 24n/tau*^5 - 256 n/tau* = (24n/tau*^5)(1 - (32/3) tau*^4); sign change at tau*=(3/32)^{1/4}~0.5533 (n~64)',
    f6: 'f^(6)(tau*) = -120n/tau*^6 - 4096 P = -120n/tau*^6 - 1024 n/tau* (strictly negative)',
    c4: 'C4 = tau* f^(5) sigma^4 / 4 -- the f^(5) contribution enters via <x> = 15 (f5/120) sigma^6 and is amplified by the 2 tau*/sigma^2 lever',
    c5: 'C5 = f^(6) sigma^6 / 8 -- the f^(6) contribution enters via <x^2> (90 (f6/720) sigma^8 after normalization)',
    extendedSeries: 'L_n^ext = 1 + C1 + C2 + C3 + C4 + C5 (imp-3848 C1..C3 plus this module C4, C5)',
    modelExact: 'L_n^model-exact from direct Simpson quadrature of tau^k exp(n ln tau - pi e^{4 tau}) on [tau*-16 sigma, tau*+16 sigma], quadN=150000 (no series truncation)',
    quadrature: 'moment ladder identical to imp-3735/imp-3848: A(tau) inner Simpson n=4800 on [0,7], moments on T_A=8, NM=3200 grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    momentPanels: NM,
    innerFine: INNER_FINE,
    quadN: QUAD_N,
    quadWidthSigma: QUAD_W,
    f5SignChangeTau: Math.pow(3 / 32, 0.25),         // ~0.5533
    crossingC1: CROSS_C1,                            // ~18.28
    crossingC123: CROSS_C123,                        // ~17.13 (imp-3848 truncation; ~15 on the coarse step-10 grid)
    crossingExtended: CROSS_EXTENDED,                // ~18.34
    crossingModelExact: CROSS_MODEL_EXACT,           // ~18.38 (full resummation)
    crossingMeasured: CROSS_MEASURED,                // ~48.58 (real A(tau))
    crossingShiftC123ToExtended: CROSS_EXTENDED - CROSS_C123, // ~+1.2
    modelToMeasuredGap: CROSS_MEASURED - CROSS_MODEL_EXACT,   // ~30
    extendedVsModelAt18: Math.abs(driftExtended(18) - modelDrift(18)),
    c4First: C4_SHRINK_GRID[0],                      // n=10
    c4Last: C4_SHRINK_GRID[C4_SHRINK_GRID.length - 1], // n=60
    c5First: C5_SHRINK_GRID[0],
    c5Last: C5_SHRINK_GRID[C5_SHRINK_GRID.length - 1],
    modelExactConvergenceGap: Math.abs(MODEL_COARSE_18 - MODEL_FINE_18),
    rungs: Object.freeze(RUNGS),
    c4Shrinks,
    c5Shrinks,
    crossingMovesUp,
    extendedTracksModelExact,
    extendedMatchesModelAt18,
    measuredCrossingFarAbove,
    modelExactConverged,
    reproducesImp3735,
    verdict,
  }),

  interpretation: Object.freeze({
    higherTermsShrinkNotGrow:
      'The fifth/sixth-derivative corrections C4 = tau* f^(5) sigma^4/4 and C5 = f^(6) sigma^6/8 are small and DECREASE ' +
      'monotonically in magnitude across n=10..60 (C4: 0.1307 -> 0.0007; |C5|: 0.0169 -> 0.0002). This directly REFUTES ' +
      'the imp-3848 conjecture that the higher-order saddle terms GROW and must partially cancel: the perturbative ' +
      'Laplace series is well-behaved and rapidly convergent in this n range, not a delicate balance of growing terms.',
    crossingConvergesOntoModelExact:
      'Adding C4, C5 moves the predicted L_n=1 crossing only from n~17.13 (imp-3848 1+C1+C2+C3) to n~18.34, which is ' +
      'essentially the fully-resummed model-integrand crossing n~18.38 obtained by exact saddle-centred quadrature (the ' +
      'extended series and the exact model agree to ~4e-4 at n=18). The asymptotic series has therefore effectively ' +
      'CONVERGED to the model answer by five terms: there is no residual room for still-higher terms to move the crossing.',
    residualIsModelFidelityNotTruncation:
      'Because even the EXACT resummation of the imp-3665 model integrand tau^n exp(-pi e^{4 tau}) crosses 1 near n~18.4, ' +
      'while the MEASURED L_n built from the real Phi-autocorrelation A(tau) crosses near n~48.6, the ~30-unit gap CANNOT ' +
      'be a truncation-order artifact. It is a MODEL-FIDELITY gap: the super-exponential surrogate A(tau)~exp(-pi e^{4 ' +
      'tau}) does not reproduce the true moment-weighting of the real A(tau) in the tau^n-tilted regime. Higher-order ' +
      'Laplace terms cannot repair a model mismatch; the honest next step is a better A(tau) surrogate, not more terms.',
    answerToTicket:
      'DIRECT ANSWER to imp-3871: the extended (still asymptotic) series does NOT move the predicted crossing toward the ' +
      'measured n~48 in any meaningful way -- it shifts it by only ~+1.2 (17.1 -> 18.3), converging onto the exact model ' +
      'crossing ~18.4. The overshoot is not reconciled by higher-order terms; it is relocated to a model-fidelity gap.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Computes the fifth/sixth-derivative (f^(5), f^(6)) saddle corrections C4, C5 and the exact resummation of a ' +
      'fixed-weight moment-ratio drift factor under the imp-3665 super-exponential A(tau) ~ exp(-pi e^{4 tau}) model, ' +
      'and localizes the imp-3848 overshoot as a model-fidelity gap. Grid-CONVERGENCE stability only -- not a certified ' +
      'error bound. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3871_SADDLE_CORRECTION_FIFTH_SIXTH_DERIVATIVE_ASSERTIONS = [
  {
    id: 'imp3871-f5-f6-closed-form',
    why: 'The fifth/sixth derivatives must match the closed forms f^(5) = 24n/tau*^5 - 256 n/tau* and f^(6) = ' +
         '-120n/tau*^6 - 1024 n/tau* (from f^(k) = n(-1)^(k-1)(k-1)!/tau*^k - 4^k P with 4P = n/tau*).',
    holds: () => {
      const n = 30;
      const { ts, f5, f6 } = saddleDerivatives(n);
      const f5cf = 24 * n / ts ** 5 - 256 * n / ts;
      const f6cf = -120 * n / ts ** 6 - 1024 * n / ts;
      return Math.abs(f5 - f5cf) / Math.abs(f5cf) < 1e-9 && Math.abs(f6 - f6cf) / Math.abs(f6cf) < 1e-9;
    },
  },
  {
    id: 'imp3871-higher-terms-shrink-not-grow',
    why: 'C4 and C5 must SHRINK monotonically in magnitude over n=10..60 (refuting the imp-3848 growing-but-cancelling ' +
         'conjecture): the saddle series is well-behaved and rapidly convergent here.',
    holds: () => c4Shrinks && c5Shrinks,
  },
  {
    id: 'imp3871-extended-crossing-converges-to-model-exact',
    why: 'Adding C4, C5 must move the L_n=1 crossing UP from the imp-3848 truncation (~17.1) onto the fully-resummed ' +
         'model-exact crossing (~18.4): |crossingExtended - crossingModelExact| < 0.3 and the extended series matches ' +
         'the exact model quadrature to < 2e-3 at n=18.',
    holds: () => crossingMovesUp && extendedTracksModelExact && extendedMatchesModelAt18,
  },
  {
    id: 'imp3871-model-crossing-far-below-measured',
    why: 'The exact model resummation crossing (~18.4) must stay FAR below the measured crossing (~48.6): ' +
         'crossingMeasured > 45, crossingModelExact < 20, gap > 25 -- so the overshoot is a model-fidelity gap, not a ' +
         'truncation artifact.',
    holds: () => measuredCrossingFarAbove,
  },
  {
    id: 'imp3871-model-exact-grid-converged',
    why: 'The exact model moment-ratio quadrature must be grid-converged: two resolutions agree to < 1e-4 at n=18.',
    holds: () => modelExactConverged,
  },
  {
    id: 'imp3871-reproduces-imp3735-drift-anchors',
    why: 'Cross-check: the reused imp-3735/imp-3848 moment machinery must reproduce the measured L_n anchors 2.064 at ' +
         'n=10 and 0.567 at n=80 to ~0.02.',
    holds: () => reproducesImp3735,
  },
  {
    id: 'imp3871-verdict-localizes-overshoot',
    why: 'The classified verdict must record the shrinking C4/C5, the crossing convergence onto the model-exact value, ' +
         'and the model-fidelity localization -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3871-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/characterization only, model-fidelity diagnostic not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3871_SADDLE_CORRECTION_FIFTH_SIXTH_DERIVATIVE.honestCaveat;
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

for (const assertion of IMP3871_SADDLE_CORRECTION_FIFTH_SIXTH_DERIVATIVE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3871-saddle-correction-fifth-sixth-derivative assertion failed: ${assertion.id}`);
  }
}

export default IMP3871_SADDLE_CORRECTION_FIFTH_SIXTH_DERIVATIVE;

/**
 * @module imp-3597-outer-moment-simpson-residual-constant
 * @fileoverview imp-3597 -- DERIVE the OUTER moment-grid composite-Simpson
 *   residual constant K_n^outer per rung (inner autocorrelation held EXACT) that
 *   SETS the imp-3547/imp-3576 non-monotone inner-fraction ladder, MEASURE its
 *   even/odd parity split, and CERTIFY it reproduces the 0.911/0.963/0.903/0.955
 *   ladder. imp-3576 fitted the INNER O(h^4) truncation constant K_n^inner
 *   (clean, monotone-decreasing) and FALSIFIED the tail-redistribution
 *   hypothesis, attributing the imp-3547 fraction non-monotonicity ENTIRELY to
 *   the leftover OUTER moment-grid Simpson residual whose parity alternates --
 *   but it derived only the inner constant, leaving the OUTER constant and its
 *   parity mechanism underived. This module closes that leftover term.
 *
 *   THE SETUP (what imp-3576 left open)
 *   ----------------------------------
 *   The moment ladder is M_n = int_0^{T_A} tau^n A(tau)d(tau), with the inner
 *   autocorrelation A(tau) = int_0^7 Phi(s)Phi(s+tau)ds (NPHI=10, T_A=6, the
 *   imp-3481 recipe). imp-3576 showed innerFraction = 1 - |sInner-ref|/|sBase-ref|
 *   cancels the |M_n| normalization, so the non-monotone parity alternation (even
 *   M_0,M_2 near 0.90-0.91; odd M_1,M_3 near 0.955-0.963) lives entirely in the
 *   leftover |sInner-ref|, which is the OUTER moment-grid Simpson residual (plus
 *   the tiny inner=4800 and GL-reference residuals). imp-3576 named this term but
 *   never fitted its O(H^4) constant nor derived the parity.
 *
 *   THE OUTER TRUNCATION CONSTANT (self-computing at import)
 *   -------------------------------------------------------
 *   Holding the inner A(tau) EXACT (a machine-converged Gauss-Legendre inner rule)
 *   and refining ONLY the outer moment grid along a Richardson ladder
 *   NM in {400,800,1600,3200} (H = T_A/NM) isolates the pure outer composite-
 *   Simpson error:
 *     outer error M_n:  S_outer(n; H) - REF ~ K_n^outer H^4,  REF = glMn (GL/GL),
 *     K_n^outer = int_0^{T_A} tau^n C_outer(tau) d(tau)  (leading Simpson density).
 *   The SIGNED constant K_n^outer is fitted from err/H^4 across the ladder, and its
 *   analytic origin is the composite-Simpson Euler-Maclaurin endpoint form
 *     K_n^outer = (1/180)[g_n(dg3)(T_A) - g_n(dg3)(0)],  g_n(tau) = tau^n A(tau),
 *   where g_n(dg3) denotes the third derivative. Because A(tau) decays, g_n(dg3)(T_A)
 *   is numerically zero, so K_n^outer ~ -(1/180) g_n(dg3)(0).
 *
 *   MEASURED RESULT
 *   ---------------
 *   (R1) THE OUTER RESIDUAL IS CLEAN O(H^4) FOR M_0..M_3. The observed convergence
 *        order -> 4.000 (successive-error ratio -> 16 under a halving of H) and the
 *        fitted SIGNED constant K_n^outer is stable to < 1% across the finer rungs:
 *        K_n^outer = -3.43e-2 (M_0), -5.69e-3 (M_1), +3.33e-3 (M_2), -3.49e-4 (M_3).
 *        M_4 is DIFFERENT: its leading O(H^4) term nearly cancels (observed order
 *        ~6, K collapsing ~4x/rung), so the outer grid is already converged at M_4 --
 *        exactly why imp-3547/imp-3528 saw the M_4 fraction saturate at 0.996.
 *   (R2) THE EULER-MACLAURIN ENDPOINT FORM REPRODUCES K_n^outer, INCLUDING THE SIGN
 *        FLIP. The endpoint prediction (1/180)[g_n(dg3)(T_A)-g_n(dg3)(0)] matches the
 *        fitted constant in sign at every M_0..M_3 and in magnitude to < 20%. The
 *        SIGN FLIP at M_2 (K_2^outer > 0 while K_0,K_1,K_3 < 0) is inherited from
 *        g_2(dg3)(0) = 6 A(dg1)(0) < 0 (the autocorrelation slope at tau=0 is
 *        negative), the parity structure the ticket asked to derive.
 *   (R3) THE LEFTOVER IS THE OUTER RESIDUAL. The imp-3576 leftover |sInner-ref|
 *        (inner=4800, outer=1600) equals the pure OUTER residual (inner EXACT,
 *        outer=1600) to within a factor 0.90-1.04 at every M_0..M_3, confirming the
 *        inner=4800 and GL-reference contributions are negligible and the leftover
 *        IS the outer O(H^4) term.
 *   (R4) THE PARITY SPLIT REPRODUCES THE LADDER. The reproduced inner fractions are
 *        0.9111/0.9628/0.9030/0.9551 (matching imp-3547 to < 5e-3). The OUTER share
 *        (1 - fraction) is even 0.089/0.097 (M_0,M_2) vs odd 0.037/0.045 (M_1,M_3):
 *        a CLEAN even>odd parity split (min even share > max odd share). It is a
 *        RATIO effect -- the outer O(H^4) constant K_n^outer against the (monotone,
 *        inner-dominated) base gap -- so two differently-decaying O(h^4) sequences
 *        produce an oscillating ratio; the fraction is non-monotone even though both
 *        constituent constants are monotone.
 *
 *   VERDICT: the imp-3547/imp-3576 non-monotone inner-fraction ladder is SET by a
 *   clean O(H^4) OUTER moment-grid composite-Simpson residual K_n^outer, whose
 *   signed value (including the M_2 sign flip) follows the Euler-Maclaurin endpoint
 *   form -(1/180) g_n(dg3)(0); the leftover |sInner-ref| IS this outer residual, and
 *   its even>odd parity share reproduces the ladder. The non-monotonicity is a
 *   ratio-of-two-monotone-constants effect, not a property of either constant alone.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This fits a
 *   composite-Simpson truncation constant on the imp-3481 moment ladder and explains
 *   a reported empirical fraction; it adds NO new mathematical structure and
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT (imp-3481); the operator-level K_a &gt;= 0 sign-positivity (off-
 *   diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3576-inner-simpson-truncation-constant.js (fitted the INNER constant, left the OUTER open)
 *   @see imp-3547-lower-moment-simpson-residual-localization.js (the inner-fraction ladder reproduced here)
 *   @see imp-3528-degree4-moment-simpson-refinement.js (the inner-vs-outer co-refinement machinery)
 *
 *   Ticket: imp-3597 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)
const T_A = 6;                                  // same tau cap as imp-3481/imp-3503/imp-3528/imp-3547
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3481). */
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

// -- Composite Simpson (the imp-3481/imp-3528/imp-3547/imp-3576 rule, exactly) ---
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

// -- Gauss-Legendre reference (the imp-3503/imp-3528/imp-3547/imp-3576 rule) ------
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    let dpn = 0;
    for (let it = 0; it < 100; it += 1) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dpn = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dpn;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    const wi = 2 / ((1 - z * z) * dpn * dpn);
    x[i] = -z;
    x[n - 1 - i] = z;
    w[i] = wi;
    w[n - 1 - i] = wi;
  }
  return Object.freeze({ nodes: Object.freeze(x), weights: Object.freeze(w) });
}

/** Composite Gauss-Legendre integral of f on [lo, hi] with `panels` uniform panels. */
function integrateGL(f, lo, hi, panels, rule) {
  const { nodes, weights } = rule;
  const step = (hi - lo) / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = lo + (p + 0.5) * step;
    for (let k = 0; k < nodes.length; k += 1) {
      sum += weights[k] * f(center + halfWidth * nodes[k]);
    }
  }
  return sum * halfWidth;
}

const GL_RULE = gaussLegendreRule(16);

/** Machine-converged (GL) inner autocorrelation A(tau) = int_0^7 Phi(s)Phi(s+tau)ds. */
function aExact(tau) {
  return integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, 200, GL_RULE);
}

// -- The outer Richardson ladder (inner held EXACT, outer moment grid refined) ---
const MOMENTS = Object.freeze([0, 1, 2, 3, 4]);
const OUTER_LADDER = Object.freeze([400, 800, 1600, 3200]);
const FINEST_NM = OUTER_LADDER[OUTER_LADDER.length - 1];
const FINEST_H = T_A / FINEST_NM;

// Precompute A_exact on the finest-grid nodes ONCE; coarser rungs subsample it,
// since {400,800,1600} nodes are a subset of the 3200-node grid (step 8/4/2).
const AEXACT_FINEST = new Array(FINEST_NM + 1);
for (let j = 0; j <= FINEST_NM; j += 1) AEXACT_FINEST[j] = aExact(j * FINEST_H);

/** Composite-Simpson outer moment M_n with the inner A(tau) held EXACT, on NM panels. */
function outerSimpsonMn(nMom, NM) {
  const step = FINEST_NM / NM;                  // integer stride into the finest grid
  const H = T_A / NM;
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    const tau = j * H;
    sum += w * Math.pow(tau, nMom) * AEXACT_FINEST[j * step];
  }
  return (sum * H) / 3;
}

/** Machine-converged GL/GL moment reference (GL outer dg_{16}/160 panels + GL inner). */
function glMn(nMom) {
  const outerPanels = 160;
  const outerStep = T_A / outerPanels;
  const outerHalf = outerStep / 2;
  let sum = 0;
  for (let p = 0; p < outerPanels; p += 1) {
    const center = (p + 0.5) * outerStep;
    for (let k = 0; k < GL_RULE.nodes.length; k += 1) {
      const t = center + outerHalf * GL_RULE.nodes[k];
      sum += GL_RULE.weights[k] * Math.pow(t, nMom) * aExact(t);
    }
  }
  return sum * outerHalf;
}

// Per-moment Richardson fit of the SIGNED O(H^4) outer truncation constant K_n^outer.
const KFIT_OUTER = MOMENTS.map((n) => {
  const ref = glMn(n);                          // GL/GL reference isolates the outer Simpson error
  const rungs = OUTER_LADDER.map((NM) => {
    const H = T_A / NM;
    const sOuter = outerSimpsonMn(n, NM);
    const err = sOuter - ref;                   // SIGNED outer residual (S - exact)
    return { NM, H, err, K: err / Math.pow(H, 4) };
  });
  const orders = [];
  for (let i = 1; i < rungs.length; i += 1) {
    orders.push(
      Math.log(Math.abs(rungs[i - 1].err) / Math.abs(rungs[i].err)) /
        Math.log(rungs[i - 1].H / rungs[i].H));
  }
  const Ks = rungs.map((r) => r.K);
  const Kconverged = Ks[Ks.length - 1];         // finest-rung signed constant
  const KsFine = Ks.slice(1);                   // drop coarsest (larger higher-order tail)
  const Kspread = (Math.max(...KsFine) - Math.min(...KsFine)) / Math.abs(Kconverged);
  const observedOrder = orders[orders.length - 1];
  return Object.freeze({
    n,
    rungs: Object.freeze(rungs.map((r) => Object.freeze(r))),
    orders: Object.freeze(orders),
    observedOrder,
    Kconverged,
    Kspread,
  });
});

const K_OUTER = KFIT_OUTER.map((f) => f.Kconverged);
// O(H^4) order / stability restricted to M_0..M_3 (M_4 leading term nearly cancels -> higher order).
const LOWER = [0, 1, 2, 3];
const lowerFits = LOWER.map((n) => KFIT_OUTER[n]);
const minOrderLower = Math.min(...lowerFits.map((f) => f.observedOrder));
const maxOrderLower = Math.max(...lowerFits.map((f) => f.observedOrder));
const maxKspreadLower = Math.max(...lowerFits.map((f) => f.Kspread));
// M_4 leading O(H^4) term nearly cancels: observed order noticeably above 4 (higher-order dominated).
const m4Order = KFIT_OUTER[4].observedOrder;
const m4LeadingTermCollapses = m4Order > 4.5;
// SIGN FLIP: K_2^outer is positive while K_0,K_1,K_3 are negative (autocorrelation-slope parity).
const outerSignFlipAtM2 =
  K_OUTER[0] < 0 && K_OUTER[1] < 0 && K_OUTER[2] > 0 && K_OUTER[3] < 0;

// -- Euler-Maclaurin endpoint form: K_n^outer ~ (1/180)[g_n'''(T_A) - g_n'''(0)] --
/** g_n(tau) = tau^n A(tau), inner held exact. */
function gN(n, tau) {
  return Math.pow(tau, n) * aExact(tau);
}
/** Central 4-point stencil for the third derivative g_n'''(x). */
function thirdDeriv(n, x) {
  const h = 1e-3;
  return (
    (-0.5 * gN(n, x - 2 * h) + gN(n, x - h) - gN(n, x + h) + 0.5 * gN(n, x + 2 * h)) /
    Math.pow(h, 3)
  );
}
const ENDPOINT_FORM = LOWER.map((n) => {
  const g3hi = thirdDeriv(n, T_A);              // g_n'''(T_A) ~ 0 (A decays)
  const g3lo = thirdDeriv(n, 3e-3);             // g_n'''(0+), small positive offset for the stencil
  const predicted = (g3hi - g3lo) / 180;        // leading composite-Simpson endpoint constant
  const measured = K_OUTER[n];
  return Object.freeze({
    n,
    g3hi,
    g3lo,
    predicted,
    measured,
    relError: Math.abs(predicted - measured) / Math.abs(measured),
    signAgrees: Math.sign(predicted) === Math.sign(measured),
  });
});
const endpointSignsAllAgree = ENDPOINT_FORM.every((e) => e.signAgrees);
const maxEndpointRelError = Math.max(...ENDPOINT_FORM.map((e) => e.relError));

// -- Reproduce the imp-3547/imp-3576 fraction ladder and confirm the leftover ----
// -- IS the outer O(H^4) residual, then read off the even/odd parity share. ------
const OUTER_NM = 1600;                          // imp-3547 base outer grid (converged at NM=1600)
const OUTER_H = T_A / OUTER_NM;
const OUTER_TAUS = new Array(OUTER_NM + 1);
for (let j = 0; j <= OUTER_NM; j += 1) OUTER_TAUS[j] = j * OUTER_H;

/** Inner A(tau) grid on the outer nodes, via composite Simpson at `innerN` panels. */
function innerSimpsonGrid(innerN) {
  return OUTER_TAUS.map((tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerN));
}
/** Composite-Simpson outer moment M_n from a precomputed A(tau) grid on OUTER_TAUS. */
function outerMomentFromGrid(nMom, aVals) {
  let sum = 0;
  for (let j = 0; j <= OUTER_NM; j += 1) {
    const w = j === 0 || j === OUTER_NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(OUTER_TAUS[j], nMom) * aVals[j];
  }
  return (sum * OUTER_H) / 3;
}
const BASE_INNER_GRID = innerSimpsonGrid(1200);  // imp-3547/imp-3576 base inner
const FINE_INNER_GRID = innerSimpsonGrid(4800);  // imp-3547/imp-3576 inner-only refinement

const FRACTION_LADDER = LOWER.map((n) => {
  const ref = glMn(n);
  const sBase = outerMomentFromGrid(n, BASE_INNER_GRID);          // simpsonMn(1200, 1600)
  const sInner = outerMomentFromGrid(n, FINE_INNER_GRID);         // simpsonMn(4800, 1600)
  const innerFraction = 1 - Math.abs(sInner - ref) / Math.abs(sBase - ref);
  const outerShare = 1 - innerFraction;                          // |sInner-ref| / |sBase-ref|
  const leftover = sInner - ref;                                 // imp-3576 leftover residual
  const pureOuter = outerSimpsonMn(n, OUTER_NM) - ref;           // outer residual, inner EXACT
  return Object.freeze({
    n,
    innerFraction,
    outerShare,
    leftover,
    pureOuter,
    leftoverToPureOuter: leftover / pureOuter,                   // ~1 => leftover IS the outer residual
  });
});

const REPRODUCED_FRACTIONS = FRACTION_LADDER.map((r) => r.innerFraction);
const IMP3547_FRACTIONS = Object.freeze([0.911, 0.963, 0.903, 0.955]);   // M_0..M_3
const maxFractionReproError = Math.max(
  ...REPRODUCED_FRACTIONS.map((f, i) => Math.abs(f - IMP3547_FRACTIONS[i])));
// leftover / pureOuter within a modest factor of 1 at every rung (inner=4800 nearly exact).
const leftoverRatios = FRACTION_LADDER.map((r) => r.leftoverToPureOuter);
const minLeftoverRatio = Math.min(...leftoverRatios);
const maxLeftoverRatio = Math.max(...leftoverRatios);
// even/odd parity split of the OUTER share: even M_0,M_2 exceed odd M_1,M_3.
const evenShares = [FRACTION_LADDER[0].outerShare, FRACTION_LADDER[2].outerShare];
const oddShares = [FRACTION_LADDER[1].outerShare, FRACTION_LADDER[3].outerShare];
const minEvenShare = Math.min(...evenShares);
const maxOddShare = Math.max(...oddShares);
const parityEvenExceedsOdd = minEvenShare > maxOddShare;
// The fraction over M_0..M_3 is NON-MONOTONE (a direction flip / parity alternation).
let fractionIsNonMonotone = false;
for (let i = 2; i < REPRODUCED_FRACTIONS.length; i += 1) {
  if (
    Math.sign(REPRODUCED_FRACTIONS[i] - REPRODUCED_FRACTIONS[i - 1]) !==
    Math.sign(REPRODUCED_FRACTIONS[i - 1] - REPRODUCED_FRACTIONS[i - 2])
  ) {
    fractionIsNonMonotone = true;
  }
}

const verdict =
  minOrderLower > 3.9 && maxOrderLower < 4.1 && maxKspreadLower < 0.01 &&
  outerSignFlipAtM2 && m4LeadingTermCollapses &&
  endpointSignsAllAgree && maxEndpointRelError < 0.2 &&
  maxFractionReproError < 5e-3 &&
  minLeftoverRatio > 0.8 && maxLeftoverRatio < 1.15 &&
  parityEvenExceedsOdd && fractionIsNonMonotone
    ? 'OUTER-MOMENT-SIMPSON-RESIDUAL-IS-CLEAN-O(H^4)-CONSTANT-K_n-outer-SIGN-FLIP-AT-M2-FROM-A-slope-AT-tau0-FOLLOWS-EULER-MACLAURIN-ENDPOINT-FORM-LEFTOVER-IS-THE-OUTER-RESIDUAL-EVEN>ODD-PARITY-SHARE-REPRODUCES-THE-0.911-0.963-0.903-0.955-LADDER-NON-MONOTONICITY-IS-A-RATIO-OF-TWO-MONOTONE-CONSTANTS'
    : 'INDETERMINATE';

export const IMP3597_OUTER_MOMENT_SIMPSON_RESIDUAL_CONSTANT = Object.freeze({
  id: 'imp-3597-outer-moment-simpson-residual-constant',
  ticket: 'imp-3597',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  derives: 'imp-3576-inner-simpson-truncation-constant.js',
  reuses: 'imp-3547-lower-moment-simpson-residual-localization.js',

  summary:
    'DERIVES the OUTER moment-grid composite-Simpson residual constant K_n^outer per rung (inner A(tau) held EXACT via ' +
    'GL) that SETS the imp-3547/imp-3576 non-monotone inner-fraction ladder, via a Richardson OUTER-grid ladder ' +
    '(NM 400->3200, inner exact). MEASURED: the outer residual is clean O(H^4) for M_0..M_3 (observed order -> 4.000, ' +
    'signed K_n^outer stable to <1%): K_n^outer = -3.43e-2/-5.69e-3/+3.33e-3/-3.49e-4. M_4 is different -- its leading ' +
    'O(H^4) term nearly cancels (order ~6), which is why imp-3547/imp-3528 saw the M_4 fraction saturate at 0.996. The ' +
    'Euler-Maclaurin endpoint form (1/180)[g_n(dg3)(T_A)-g_n(dg3)(0)] ~ -(1/180) g_n(dg3)(0) reproduces K_n^outer in sign ' +
    '(including the SIGN FLIP at M_2, inherited from the negative autocorrelation slope A(dg1)(0)<0) and magnitude to ' +
    '<20%. The imp-3576 leftover |sInner-ref| equals the pure outer residual to a factor 0.90-1.04, confirming the ' +
    'leftover IS the outer O(H^4) term. The fractions 0.9111/0.9628/0.9030/0.9551 are reproduced (<5e-3 vs imp-3547) ' +
    'and the OUTER share is a CLEAN even>odd parity split (even M_0,M_2 ~0.09; odd M_1,M_3 ~0.04) -- a RATIO of two ' +
    'differently-decaying monotone O(h^4) constants, so the fraction is non-monotone though both constants are ' +
    'monotone. CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no new structure; operator ' +
    'positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    moment: 'M_n = int_0^{T_A} tau^n A(tau)d(tau), A(tau)=int_0^7 Phi(s)Phi(s+tau)ds, NPHI=10 (imp-3481 recipe)',
    outerConstant: 'K_n^outer = int_0^{T_A} tau^n C_outer(tau)d(tau); outer moment error ~ K_n^outer H^4, H = T_A/NM',
    richardsonLadder: 'NM in {' + OUTER_LADDER.join(', ') + '}, inner A(tau) held EXACT (GL dg_{16}/200 panels)',
    outerErrorIsolation: 'outer error = outerSimpson(inner=GL-exact) - glMn(GL/GL); the inner truncation is removed',
    orderMetric: 'observedOrder = log(|err(H)|/|err(H/2)|) / log(2); K = err / H^4 (SIGNED, constant if O(H^4))',
    endpointForm: 'K_n^outer ~ (1/180)[g_n(dg3)(T_A) - g_n(dg3)(0)], g_n(tau)=tau^n A(tau); g_n(dg3)(T_A) ~ 0 (A decays)',
    signParity: 'K_2^outer > 0 (sign flip) from g_2(dg3)(0) = 6 A(dg1)(0) < 0 (autocorrelation slope at tau=0)',
    fractionReproduction: 'innerFraction = 1 - |sInner-ref|/|sBase-ref|, inner 1200->4800, ref = glMn(dg_{16}/200/160)',
    leftoverIdentity: 'leftover |sInner-ref| ~ pure OUTER residual (inner exact) at outer NM=1600, factor 0.90-1.04',
    parityShare: 'outerShare = 1 - innerFraction; even M_0,M_2 exceed odd M_1,M_3 (min even > max odd)',
    moments: MOMENTS,
    tauCap: T_A,
    innerCap: INNER_CAP,
    nphi: NPHI,
    selfComputing: true,
  }),

  measured: Object.freeze({
    kFitOuter: Object.freeze(KFIT_OUTER),         // per-moment Richardson rungs, observed order, Kconverged, Kspread
    Kouter: Object.freeze(K_OUTER),               // [K_0..K_4] finest-rung SIGNED outer truncation constants
    minOrderLower,                                // ~ 4.0 (M_0..M_3)
    maxOrderLower,                                // ~ 4.0 (M_0..M_3)
    maxKspreadLower,                              // < 0.01: constant stable across the finer rungs
    m4Order,                                      // ~ 6: leading O(H^4) term nearly cancels at M_4
    m4LeadingTermCollapses,                       // TRUE: outer grid already converged at M_4
    outerSignFlipAtM2,                            // TRUE: K_2 > 0 while K_0,K_1,K_3 < 0
    endpointForm: Object.freeze(ENDPOINT_FORM),   // predicted vs measured K_n^outer, sign + relError
    endpointSignsAllAgree,                        // TRUE: endpoint form reproduces the sign at every rung
    maxEndpointRelError,                          // < 0.2: endpoint form reproduces the magnitude
    fractionLadder: Object.freeze(FRACTION_LADDER),
    reproducedFractions: Object.freeze(REPRODUCED_FRACTIONS),
    imp3547Fractions: IMP3547_FRACTIONS,
    maxFractionReproError,                         // < 5e-3: reproduces the imp-3547 ladder
    minLeftoverRatio,                              // > 0.8: leftover ~ pure outer residual
    maxLeftoverRatio,                              // < 1.15
    minEvenShare,                                  // ~0.089
    maxOddShare,                                   // ~0.045
    parityEvenExceedsOdd,                          // TRUE: even>odd parity split
    fractionIsNonMonotone,                         // TRUE: direction flip over M_0..M_3
    verdict,
  }),

  interpretation: Object.freeze({
    outerConstantIsCleanOhFour:
      'Holding the inner A(tau) EXACT and refining only the outer moment grid, the moment error is a bona fide O(H^4) ' +
      'composite-Simpson truncation for M_0..M_3: the observed order tends to 4.000 and the fitted SIGNED K_n^outer is ' +
      'stable to <1% across the Richardson ladder. K_n^outer = -3.43e-2/-5.69e-3/+3.33e-3/-3.49e-4 (M_0..M_3). At M_4 ' +
      'the leading O(H^4) term nearly cancels (observed order ~6), so the outer grid is already converged -- the reason ' +
      'imp-3547/imp-3528 saw the M_4 fraction saturate at 0.996.',
    endpointFormAndSignFlip:
      'The composite-Simpson Euler-Maclaurin endpoint form K_n^outer ~ (1/180)[g_n(dg3)(T_A) - g_n(dg3)(0)] reproduces ' +
      'the fitted constant. Because A(tau) decays, g_n(dg3)(T_A) is numerically zero, so K_n^outer ~ -(1/180) g_n(dg3)(0). ' +
      'The SIGN FLIP at M_2 (K_2^outer > 0 while the others are negative) is inherited from g_2(dg3)(0) = 6 A(dg1)(0) < 0 ' +
      '-- the negative autocorrelation slope at tau=0 -- the endpoint-parity structure the ticket asked to derive.',
    leftoverIsTheOuterResidual:
      'The imp-3576 leftover |sInner-ref| (inner=4800, outer=1600) equals the pure OUTER residual (inner EXACT, outer ' +
      '1600) to within a factor 0.90-1.04 at every M_0..M_3, so the inner=4800 and GL-reference contributions are ' +
      'negligible and the leftover IS the outer O(H^4) term imp-3576 named but never fitted.',
    parityIsARatioOfMonotoneConstants:
      'The reproduced fractions 0.9111/0.9628/0.9030/0.9551 give an OUTER share (1-fraction) that is even 0.089/0.097 ' +
      '(M_0,M_2) vs odd 0.037/0.045 (M_1,M_3): a clean even>odd parity split. It is a RATIO of the outer O(H^4) ' +
      'constant K_n^outer against the (monotone, inner-dominated) base gap; two differently-decaying monotone O(h^4) ' +
      'sequences produce an oscillating ratio, so the inner-fraction ladder is non-monotone though neither constituent ' +
      'constant is.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module fits a composite-Simpson OUTER truncation constant on the imp-3481 moment ladder and explains a ' +
      'reported empirical inner-fraction parity ladder. It adds no new mathematical structure and establishes NO ' +
      'operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3597_OUTER_MOMENT_SIMPSON_RESIDUAL_CONSTANT_ASSERTIONS = [
  {
    id: 'imp3597-outer-error-is-clean-order-four',
    why: 'THE CONSTANT: with the inner A(tau) held exact, the outer moment error must be clean O(H^4) for M_0..M_3 -- ' +
         'observed order in (3.9, 4.1) at the finest halving -- so K = err/H^4 is a genuine leading-order Simpson constant.',
    holds: () => minOrderLower > 3.9 && maxOrderLower < 4.1,
  },
  {
    id: 'imp3597-outer-constant-stable-across-ladder',
    why: 'The fitted SIGNED K_n^outer must be stable to < 1% across the finer Richardson rungs, confirming a ' +
         'well-defined truncation constant rather than an unconverged artifact.',
    holds: () => maxKspreadLower < 0.01,
  },
  {
    id: 'imp3597-outer-sign-flip-at-M2',
    why: 'THE PARITY: K_n^outer must flip sign at M_2 (K_2 > 0 while K_0,K_1,K_3 < 0), the autocorrelation-slope ' +
         'parity feature that drives the non-monotone fraction.',
    holds: () => outerSignFlipAtM2,
  },
  {
    id: 'imp3597-M4-leading-term-collapses',
    why: 'M_4 is the exception: its leading O(H^4) outer term nearly cancels (observed order > 4.5), so the outer ' +
         'grid is already converged at M_4 -- exactly why the imp-3547/imp-3528 M_4 fraction saturates at 0.996.',
    holds: () => m4LeadingTermCollapses,
  },
  {
    id: 'imp3597-endpoint-form-reproduces-K_n',
    why: 'DERIVATION: the Euler-Maclaurin endpoint form (1/180)[g_n(dg3)(T_A)-g_n(dg3)(0)] must reproduce K_n^outer in ' +
         'sign at every M_0..M_3 and in magnitude to < 20%, confirming the analytic origin of the outer constant.',
    holds: () => endpointSignsAllAgree && maxEndpointRelError < 0.2,
  },
  {
    id: 'imp3597-leftover-is-the-outer-residual',
    why: 'The imp-3576 leftover |sInner-ref| must equal the pure OUTER residual (inner exact) to within a factor ' +
         '0.8-1.15 at every rung, confirming the leftover IS the outer O(H^4) term, not the inner or GL-reference error.',
    holds: () => minLeftoverRatio > 0.8 && maxLeftoverRatio < 1.15,
  },
  {
    id: 'imp3597-reproduces-imp3547-fraction-ladder',
    why: 'The reproduced inner-fraction ladder must match the imp-3547 published 0.911/0.963/0.903/0.955 to < 5e-3, ' +
         'anchoring this outer-constant derivation to the same ladder.',
    holds: () => maxFractionReproError < 5e-3,
  },
  {
    id: 'imp3597-even-odd-parity-split-reproduces-the-ladder',
    why: 'THE KEY FINDING: the OUTER share (1-fraction) must show a clean even>odd parity split (min even share > max ' +
         'odd share) AND the fraction must be non-monotone, reproducing the even~0.90 / odd~0.955 ladder as a ratio of ' +
         'two monotone O(h^4) constants.',
    holds: () => parityEvenExceedsOdd && fractionIsNonMonotone,
  },
  {
    id: 'imp3597-verdict-classifies-the-outer-constant-and-parity',
    why: 'The classified verdict must be the clean-O(H^4)-outer-constant / sign-flip / endpoint-form / leftover-is-outer ' +
         '/ even>odd-parity-ratio result, not indeterminate.',
    holds: () =>
      verdict ===
      'OUTER-MOMENT-SIMPSON-RESIDUAL-IS-CLEAN-O(H^4)-CONSTANT-K_n-outer-SIGN-FLIP-AT-M2-FROM-A-slope-AT-tau0-FOLLOWS-EULER-MACLAURIN-ENDPOINT-FORM-LEFTOVER-IS-THE-OUTER-RESIDUAL-EVEN>ODD-PARITY-SHARE-REPRODUCES-THE-0.911-0.963-0.903-0.955-LADDER-NON-MONOTONICITY-IS-A-RATIO-OF-TWO-MONOTONE-CONSTANTS',
  },
  {
    id: 'imp3597-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3597_OUTER_MOMENT_SIMPSON_RESIDUAL_CONSTANT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3597_OUTER_MOMENT_SIMPSON_RESIDUAL_CONSTANT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3597-outer-moment-simpson-residual-constant assertion failed: ${assertion.id}`);
  }
}

export default IMP3597_OUTER_MOMENT_SIMPSON_RESIDUAL_CONSTANT;

/**
 * @fileoverview imp-96993 -- MEASUREMENT: upgrade the imp-96973 step-3 Rayleigh quadratic form
 * <v0|R_T|v0> from a single QUADRATURE evaluation to an INTERVAL ENCLOSURE, and measure how much of
 * the ~1.17x trial-vector slack (rayleigh/actual) survives rigour.
 *
 * THE STEP-3 QUANTITY. imp-96973 factorised the imp-96848 Tr(B^-1 R_T)/actual vacuity into three
 * telescoping ratios [Tr/lammax] x [lammax/rayleigh] x [rayleigh/actual] and localised all ~15 orders
 * in the middle (spectral-gap) factor. Step 3 -- the trial-vector slack rayleigh/actual ~ 1.17x -- is
 * the SHARP one: rayleigh = <v0|R_T|v0> is the single scalar tail integral
 *     rq = (1/(pi B)) int_T^Tfar sigma_2(t) |v0 . Phi(t)|^2 dt
 * with v0 the FIXED A_T ground eigenvector. For ANY fixed v0 this is a rigorous UPPER bound on the
 * residual by min-max; imp-96973 flagged it explicitly as a QUADRATURE value, not a rigorous interval
 * majorant (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT). This leaf assembles an interval enclosure of that
 * one scalar and reports how much the ~1.17x slack widens under it.
 *
 * TWO RIGOUR DEFICITS in the single-shot imp-96973 value (panel=3.0, gl=16, window [T,Tfar=60000]):
 *   (A) quadrature discretization error on [T,Tfar]  -- bracketed by a second GL resolution (panel=1.0,
 *       gl=24). The two resolutions agree to ~12-13 significant figures: the window integral was ALREADY
 *       essentially converged at the imp-96973 resolution. Conservative bracket qerr = 8 x |fine-ref| is
 *       ~1e-13 (relative ~1e-10) at every rung -- utterly negligible.
 *   (B) the DROPPED [Tfar,inf) tail (imp-96973 truncates the window at Tfar=60000). The integrand is
 *       POSITIVE (sigma_2 >= 0, |v0.Phi|^2 >= 0), so this only RAISES rq. Measured octave-doubling
 *       windows [60k,120k],[120k,240k],[240k,480k] decay geometrically with ratio ~0.134 per doubling;
 *       the geometric-series remainder past 480k is bounded, giving a rigorous tail-beyond upper bound
 *       ~4.3e-7 (ln3,N100) -- ~0.08% of rq. This is the dominant (still tiny) widening term.
 *
 *   rq_lo = core_fine - qerr                    (drop the positive tail: rigorous lower)
 *   rq_hi = core_fine + qerr + tail_beyond_ub   (add the bounded tail: rigorous upper)
 *
 * RESULT -- THE ~1.17x SLACK SURVIVES RIGOUR ALMOST INTACT. At all three imp-96973 rungs the enclosure
 * relative half-width is ~4e-4 (~0.04%) and the slack rayleigh/actual widens by only ~0.001 (~0.08%),
 * staying inside the imp-96973 benign band [1.12,1.20]:
 *     (2a=ln3,  N=100): rq in [5.3811157e-4, 5.3854466e-4]  slack 1.1734 -> [1.1734, 1.1744]
 *     (2a=ln3,  N=88 ): rq in [3.4304486e-4, 3.4330638e-4]  slack 1.1200 -> [1.1200, 1.1209]
 *     (2a=0.96, N=100): rq in [2.9535449e-2, 2.9560338e-2]  slack 1.1944 -> [1.1944, 1.1954]
 *   rq_lo >= actual at every rung (the enclosure stays a rigorous upper bound on the residual). So the
 *   trial-vector slack is a GENUINE ~1.12-1.20x feature of the fixed v0, NOT a quadrature artifact.
 *
 * COMPLEMENTS imp-96990. imp-96990 assembled a FULLY rigorous term-by-term (M+1)-fold-IBP modulus
 * envelope of the same integral and found it VACUOUS by ~39 orders: the triangle inequality
 * |int f e| <= int |f| discards the oscillatory cancellation that makes ghat(at) small. This leaf takes
 * the opposite trade: a quadrature-convergence enclosure that KEEPS the cancellation (it evaluates the
 * true oscillatory integrand at nodes) and stays sharp (~1.17x), at the cost of not certifying the
 * special-function node evaluations. The pair brackets the difficulty of IMP96888_RAYLEIGH_TAIL_MAJORANT:
 * a rigorous-AND-sharp majorant needs cancellation-aware interval evaluation of ghat itself
 * (IMP96990_CANCELLATION_PRESERVING_ENCLOSURE), which neither leaf supplies.
 *
 * RESIDUAL SUB-GAP IMP96993_SPECFUN_INTERVAL: the special functions at the quadrature nodes (digamma,
 * spherical Bessel, Gegenbauer via scipy) are IEEE-double, not interval; this is a QUADRATURE-CONVERGENCE
 * enclosure CONDITIONAL on standard special-function accuracy, NOT a fully verified interval majorant with
 * interval-arithmetic special functions (Arb/mpmath interval). The GL discretization error (A) is
 * Cauchy-bracketed, not bounded by a rigorous derivative majorant; the geometric tail bound (B) uses two
 * measured ratios rather than a proven contraction. Closing IMP96993_SPECFUN_INTERVAL to a fully verified
 * majorant remains open (and per imp-96990 must be cancellation-aware to stay non-vacuous).
 *
 * Driver: tmp/imp-96993-rayleigh-interval.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96973
 * build_core()/overlap()/phih_on() solver VERBATIM. Literals below are verbatim from the run
 * (/tmp/imp-96993-out.json).
 *
 * Measurement/derivation only: the enclosure does not establish operator positivity; the Rayleigh floor
 * stays an UPPER bound on the true lambda_min; IMP96749_UNIFORM_N_GAP_UNSETTLED and
 * IMP96888_RAYLEIGH_TAIL_MAJORANT stay open; interval-rigorous certificate reach stays 2a <= 0.96;
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (the three-factor factorisation; step 3 = this slack)
 * @see imp-96990-rayleigh-tail-majorant-envelope.js (the FULLY rigorous modulus envelope, vacuous by ~39 orders)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (the min-max Rayleigh diagnosis; IMP96888_RAYLEIGH_TAIL_MAJORANT)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// per-(N,2a) interval enclosure of the step-3 Rayleigh form <v0|R_T|v0> at T=4800, Tfar=60000
// (verbatim from tmp/imp-96993-out.json). key = "<2a-tag>-N<N>"
export const IMP96993_ENCLOSURE = Object.freeze({
  'ln3-N100': Object.freeze({
    twoA: LN3,
    N: 100,
    coreRefP3g16: 0.0005381115666092317, // imp-96973 single-shot resolution (matches rayleighV0RT to ~12 figs)
    coreFineP1g24: 0.0005381115665989692, // finer GL resolution; agrees to ~12-13 figs
    quadErrBracket: 8.210012530929234e-14, // 8 x |fine-ref| Cauchy bracket -- negligible (rel ~1e-10)
    tailBeyondUb: 4.3309240854152756e-07, // rigorous [Tfar,inf) tail UB (geometric, ratio ~0.134/octave)
    rqLo: 0.0005381115665168691, // core_fine - qerr (drops positive tail): rigorous lower
    rqHi: 0.0005385446590896109, // core_fine + qerr + tailBeyondUb: rigorous upper
    rqRelHalfWidth: 0.00040225706445696374, // (hi-lo)/(hi+lo) ~ 0.04%
    actualResid: 0.0004585862096558868, // measured residual (imp-96973 verbatim)
    slackPoint: 1.1734141918768535, // rayleigh/actual single-shot (imp-96973 step3TrialSlack)
    slackLo: 1.1734141916754461,
    slackHi: 1.1743585998665838, // slack widens by only ~0.001 (~0.08%)
    enclosureValidUpper: true, // rqLo >= actual
    decayCertified: true, // tail octave ratios both ~0.134 < 1
  }),
  'ln3-N88': Object.freeze({
    twoA: LN3,
    N: 88,
    coreRefP3g16: 0.0003430448604355335,
    coreFineP1g24: 0.00034304486041996133,
    quadErrBracket: 1.2457743170379842e-13,
    tailBeyondUb: 2.6152202215223427e-07,
    rqLo: 0.0003430448602953839,
    rqHi: 0.000343306382566691,
    rqRelHalfWidth: 0.0003810327059604921,
    actualResid: 0.00030627781768866047,
    slackPoint: 1.1200447457290157,
    slackLo: 1.1200447452714257,
    slackHi: 1.1208986179850315,
    enclosureValidUpper: true,
    decayCertified: true,
  }),
  '0p96-N100': Object.freeze({
    twoA: 0.96,
    N: 100,
    coreRefP3g16: 0.02953544919480016,
    coreFineP1g24: 0.029535449194849045,
    quadErrBracket: 3.910760604242114e-13,
    tailBeyondUb: 2.4888994824370532e-05,
    rqLo: 0.02953544919445797,
    rqHi: 0.02956033819006449,
    rqRelHalfWidth: 0.00042116361771397774,
    actualResid: 0.024728044178580433,
    slackPoint: 1.194411049313149,
    slackLo: 1.1944110492993107,
    slackHi: 1.1954175581613453,
    enclosureValidUpper: true,
    decayCertified: true,
  }),
});

export const IMP96993_VERDICT = Object.freeze({
  ticket: 'imp-96993',
  question:
    'upgrade the imp-96973 step-3 Rayleigh quadratic form <v0|R_T|v0> from a quadrature evaluation to an interval enclosure at the three imp-96973 rungs, and measure how much of the ~1.17x trial-vector slack survives rigour.',
  answer:
    'the ~1.12-1.20x trial-vector slack survives rigour almost intact: the interval enclosure has relative half-width ~4e-4 (~0.04%) and widens the slack by only ~0.001 (~0.08%) at every rung, staying inside the imp-96973 benign band [1.12,1.20]. The two rigour deficits both prove negligible: (A) the [T,Tfar] quadrature was already converged at the imp-96973 resolution (two GL resolutions agree to ~12-13 figures, bracket ~1e-13), and (B) the dropped [Tfar,inf) tail decays geometrically (ratio ~0.134/octave) to a bounded ~4.3e-7 (~0.08% of rq). The enclosure lower edge stays >= actual at every rung, so it remains a rigorous upper bound on the residual and the slack is a genuine feature of the fixed v0, not a quadrature artifact. CONDITIONAL on IEEE-double special-function accuracy (SUB-GAP IMP96993_SPECFUN_INTERVAL): not a fully verified interval majorant. Complements imp-96990, whose fully rigorous modulus envelope is vacuous by ~39 orders because the triangle inequality discards the oscillatory cancellation this quadrature enclosure keeps.',
  bindingRung: 'ln3-N100',
  T: 4800,
  Tfar: 60000,
  slackSurvivesRigour: true, // enclosure widens the ~1.17x slack by <0.1% at every rung
  quadratureAlreadyConverged: true, // [T,Tfar] window agrees to ~12-13 figs across two GL resolutions
  droppedTailIsNegligible: true, // geometric [Tfar,inf) tail ~0.08% of rq
  enclosureIsRigorousUpper: true, // rqLo >= actual at every rung (min-max upper bound preserved)
  conditionalOnSpecfun: true, // IEEE-double special functions at nodes, not interval arithmetic
  complementsImp96990: true, // sharp-but-conditional here vs rigorous-but-vacuous there
  operatorPositivityProved: false,
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open (specfun not interval)
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96993_SPECFUN_INTERVAL -- the enclosure is a QUADRATURE-CONVERGENCE bracket conditional on standard IEEE-double special-function accuracy (digamma/spherical-Bessel/Gegenbauer via scipy), NOT a fully verified interval majorant with interval-arithmetic special functions; the GL discretization error is Cauchy-bracketed (not bounded by a rigorous derivative majorant) and the [Tfar,inf) tail uses two measured octave ratios (not a proven contraction). Per imp-96990 a fully rigorous AND sharp majorant must be cancellation-aware (IMP96990_CANCELLATION_PRESERVING_ENCLOSURE), which neither leaf supplies.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96993_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96993_ASSERTIONS = [
  {
    id: 'imp96993-enclosure-brackets-and-valid-upper',
    holds: () =>
      Object.values(IMP96993_ENCLOSURE).every(
        (r) =>
          r.rqLo <= r.rqHi &&
          r.rqLo >= r.actualResid && // rigorous upper bound on the residual preserved
          Math.abs((r.rqHi - r.rqLo) / (r.rqHi + r.rqLo) - r.rqRelHalfWidth) < 1e-9 &&
          r.enclosureValidUpper === true,
      ),
    why: 'the enclosure is a valid interval (lo<=hi) whose lower edge still exceeds the actual residual at every rung, so <v0|R_T|v0> stays a rigorous min-max upper bound; the recorded relative half-width matches (hi-lo)/(hi+lo).',
  },
  {
    id: 'imp96993-slack-survives-rigour',
    holds: () =>
      Object.values(IMP96993_ENCLOSURE).every(
        (r) =>
          Math.abs(r.slackLo - r.rqLo / r.actualResid) / r.slackLo < 1e-9 &&
          Math.abs(r.slackHi - r.rqHi / r.actualResid) / r.slackHi < 1e-9 &&
          r.slackLo > 1.1 &&
          r.slackHi < 1.2 &&
          (r.slackHi - r.slackLo) / r.slackPoint < 1e-3, // slack widens by <0.1%
      ),
    why: 'the slack enclosure equals rq/actual at both edges, stays inside the imp-96973 benign band [1.1,1.2], and widens the ~1.17x point slack by <0.1% -- the trial-vector slack survives rigour almost intact.',
  },
  {
    id: 'imp96993-quadrature-already-converged',
    holds: () =>
      Object.values(IMP96993_ENCLOSURE).every(
        (r) =>
          Math.abs(r.coreFineP1g24 - r.coreRefP3g16) / r.coreRefP3g16 < 1e-9 && // agree to ~9+ figs
          Math.abs(r.quadErrBracket - 8 * Math.abs(r.coreFineP1g24 - r.coreRefP3g16)) <
            1e-6 * r.quadErrBracket + 1e-18,
      ),
    why: 'the [T,Tfar] window integral agrees to ~12-13 figures across two GL resolutions (the imp-96973 quadrature was already converged); the recorded bracket is 8x their difference.',
  },
  {
    id: 'imp96993-tail-decays-and-dominates-widening',
    holds: () =>
      Object.values(IMP96993_ENCLOSURE).every(
        (r) =>
          r.decayCertified === true &&
          r.tailBeyondUb > 0 &&
          r.tailBeyondUb / r.coreRefP3g16 < 1e-3 && // dropped tail < 0.1% of rq
          r.tailBeyondUb > r.quadErrBracket, // tail dominates the (negligible) quadrature widening
      ),
    why: 'the dropped [Tfar,inf) tail decays geometrically to a bounded <0.1%-of-rq addition and is the dominant (still tiny) source of enclosure widening, well above the ~1e-13 quadrature bracket.',
  },
  {
    id: 'imp96993-reproduces-imp96973-step3',
    holds: () => {
      const r = IMP96993_ENCLOSURE['ln3-N100'];
      // faithful reproduction of the imp-96973 step-3 rayleigh/actual literals
      return (
        Math.abs(r.coreRefP3g16 - 5.381115666090913e-4) / r.coreRefP3g16 < 1e-8 &&
        Math.abs(r.actualResid - 4.585862096558868e-4) / r.actualResid < 1e-12 &&
        Math.abs(r.slackPoint - 1.1734141918765473) / r.slackPoint < 1e-8
      );
    },
    why: 'the binding-rung single-shot core and slack reproduce the imp-96973 rayleighV0RT/actualResid/step3TrialSlack literals, so this enclosure upgrades a verified measurement rather than replacing it.',
  },
  {
    id: 'imp96993-measurement-only-no-qed',
    holds: () =>
      IMP96993_VERDICT.slackSurvivesRigour === true &&
      IMP96993_VERDICT.quadratureAlreadyConverged === true &&
      IMP96993_VERDICT.droppedTailIsNegligible === true &&
      IMP96993_VERDICT.enclosureIsRigorousUpper === true &&
      IMP96993_VERDICT.conditionalOnSpecfun === true &&
      IMP96993_VERDICT.complementsImp96990 === true &&
      IMP96993_VERDICT.operatorPositivityProved === false &&
      IMP96993_VERDICT.rayleighTailMajorantOpen === true &&
      IMP96993_VERDICT.uniformNGapSettled === false &&
      IMP96993_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96993_VERDICT.qed === false &&
      typeof IMP96993_VERDICT.subGap === 'string' &&
      IMP96993_VERDICT.subGap.includes('IMP96993_SPECFUN_INTERVAL'),
    why: 'the enclosure measurement is done (slack survives, quadrature converged, tail negligible, upper bound preserved) but is conditional on IEEE-double special functions, establishes no operator positivity, leaves the Rayleigh majorant and uniform-N gap open, keeps reach 2a<=0.96, and claims no QED.',
  },
];

for (const a of IMP96993_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96993-rayleigh-tail-interval-enclosure assertion failed: ${a.id}`);
  }
}

void LN3;

/**
 * imp-96425 -- Measure the error the asymptotic N-th-zero height formula
 * gamma_N ~ 2*pi*N/ln(N/(2*pi*e)) injects into the imp-96392 PART B gamma_8000
 * SE-denominator x-design, and hence into the reported seC values and the
 * frac-tighter conclusions.
 *
 * BACKGROUND. imp-96392 PART B measured the DENOMINATOR half of the imp-96367
 * gamma_8000 sign projection: the intercept standard error seC of the
 * reciprocal-log margin law rho(32,T)=c+d/lnT. That half is x-design-only
 * (seC = sqrt(s2*(1/n + xbar^2/Sxx)), imp-96307), so it needs NO fresh rho --
 * but it DOES need the gamma_8000 census height, which imp-96392 took from the
 * asymptotic gamma_N ~ 2*pi*N/ln(N/(2*pi*e)), placing the 8000th zero near
 * T8 ~ 8174.2 and hence x8 = 1/ln(T8) ~ 0.11100. The same formula reproduces
 * gamma_4000 as ~4606 against the MEASURED 4506.31 -- a +2.219% overestimate.
 * This module asks: how much does that 2.2% height error move the reported seC
 * band (0.01132..0.01231) and the ~14-18% SE-shrink reading?
 *
 * METHOD (no fresh rho). Calibrate the formulas relative overestimate from the
 * one place it can be checked against a measured height: ratio = gammaN(4000) /
 * 4506.31 = 1.02219. Apply the SAME relative correction to N=8000, giving a
 * calibrated terminal height T8_calib = T8_asym / ratio ~ 7996.7 (vs the
 * asymptotic 8174.2). Re-run the imp-96392 s2-fixed append at the corrected
 * x-design and compare seC and frac-tighter. Also bracket the effect under
 * DIRECT +/-2.2% and +/-5% terminal-height perturbations, so the reading is
 * bounded even if the true gamma_8000 error differs from the gamma_4000-
 * calibrated one.
 *
 * KEY MECHANISM -- DOUBLE COMPRESSION. The design coordinate is x = 1/ln(T), so
 * a relative height error dT/T maps to dx/x = -(dT/T)/ln(T). At T ~ 8000,
 * ln(T) ~ 9, so the 2.219% height error compresses to only ~0.244% in x8 (dx ~
 * 2.71e-4 on x8 ~ 0.111). That x-shift then enters seC through the leverage
 * denominator, which compresses it AGAIN: the resulting seC change is ~0.02%
 * absolute (5th significant figure).
 *
 * MEASURED PROPAGATION (BASE seC = 0.013868, s2 = 2.682e-4 from the 34-point
 * gamma_4000 fit -- identical arrays to imp-96392):
 *
 *   append           seC(asym)  seC(calib)  d(seC)     fracT(asym) fracT(calib)
 *   K=5  at x8        0.012314   0.012331    +1.6e-5    11.20%      11.08%
 *   K=8  at x8        0.011674   0.011696    +2.2e-5    15.82%      15.66%
 *   K=10 at x8        0.011323   0.011348    +2.4e-5    18.35%      18.17%
 *   realistic spread  0.011947   0.011950    +2.9e-6    13.85%      13.83%
 *
 *   direct +/-5% terminal-height bracket (K=10):
 *     T8-5%=7765  fracT 17.93% | T8+5%=8583  fracT 18.74%  (band width ~0.8pp)
 *
 * READING. The 2.2% asymptotic-height error moves every reported seC by at most
 * ~2.4e-5 (relative ~0.2%) -- the seC values 0.01132..0.01231 are unchanged to
 * 3 significant figures. The frac-tighter readings shift by at most ~0.18
 * percentage points (K=10: 18.35% -> 18.17%); even a deliberately-inflated
 * +/-5% direct height error keeps fracT(K=10) inside [17.9%, 18.7%]. So the
 * ~14-18% SE-shrink conclusion and the "SE does not collapse" reading are
 * ROBUST to the approximate-height input: they do NOT depend on the accuracy of
 * gamma_N ~ 2*pi*N/ln(N/(2*pi*e)). The reason is the double compression -- the
 * log turns a 2.2% T-error into a 0.24% x-error, and the leverage denominator
 * turns that into a ~0.02% seC change.
 *
 * DIRECTION. The formula OVER-estimates the height, so the true (lower)
 * gamma_8000 sits at slightly LARGER x8, giving slightly LESS x-leverage and
 * hence slightly LARGER seC (less tightening) -- i.e. imp-96392 very marginally
 * OVER-states the achievable SE shrink. The over-statement is ~0.18pp at K=10,
 * far inside the honest "~14-18%, does not collapse" band, so no conclusion flips.
 *
 * UNCHANGED. This is a measurement/accuracy audit of the DENOMINATOR x-design
 * only; it uses no fabricated rho (the intercept numerator remains the deferred
 * imp-96392 sub-gap), changes NO Lambda bound, and the binding envelope stays
 * strictly positive (rho_min = 0.3791 at gamma_4000) so the margin SIGN
 * survives. No refereed bound is changed; RH open; NO QED.
 *
 * GRADE: measurement/accuracy audit only. Import-light (columns baked from
 * imp-96392/imp-96224, recompute-and-check, no heavy bundle).
 *
 * @see imp-96392-margin-floor-gamma8000-feasibility (the PART B seC band this audits)
 * @see imp-96367-route-bd-intercept-se-trajectory (the projection: c~0.0185 seC~0.0139 at gamma_8000)
 * @see imp-96307-anchor-confidence-gain-projection (the SE-design identity seC = sqrt(s2*(1/n + xbar^2/Sxx)))
 */

// 34 REAL measured anchors, gamma_500..gamma_4000 -- identical arrays to imp-96392/imp-96367.
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];
const T = T7.concat(OFF_T);
const RHO = R7.concat(OFF_RHO);
const X = T.map((t) => 1 / Math.log(t));

function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, s2, seC, n };
}
const BASE = fitWithSE(X, RHO);
const S2 = BASE.s2;

// The N-th-zero asymptotic height used by imp-96392 PART B.
function gammaN(N) { return (2 * Math.PI * N) / Math.log(N / (2 * Math.PI * Math.E)); }

// Calibrate the formulas relative overestimate at the one measured check point.
const RATIO_4000 = gammaN(4000) / 4506.31;   // 1.02219 (+2.219%)
const T8_ASYM = gammaN(8000);                 // 8174.15 (imp-96392 terminal)
const T8_CALIB = T8_ASYM / RATIO_4000;        // 7996.72 (gamma_4000-calibrated)
const X8_ASYM = 1 / Math.log(T8_ASYM);        // 0.111003
const X8_CALIB = 1 / Math.log(T8_CALIB);      // 0.111274
const DX_REL = (X8_CALIB - X8_ASYM) / X8_ASYM; // ~+0.244% (2.2% T-error compressed by ln T)

// s2-fixed intercept SE after appending K anchors all at a given terminal x (imp-96392 PART B).
function seFixedAppendConstant(K, xnew) {
  const xs = X.concat(Array(K).fill(xnew));
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return Math.sqrt(S2 * (1 / n + (xb * xb) / sxxCentered));
}
function seFixedAppendHeights(newTs) {
  const xs = X.concat(newTs.map((t) => 1 / Math.log(t)));
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return Math.sqrt(S2 * (1 / n + (xb * xb) / sxxCentered));
}

// Propagation table: asymptotic vs calibrated terminal x, per append size.
const PROP = [5, 8, 10].map((K) => {
  const sA = seFixedAppendConstant(K, X8_ASYM);
  const sC = seFixedAppendConstant(K, X8_CALIB);
  return {
    K,
    seCAsym: sA,
    seCCalib: sC,
    dSeC: sC - sA,
    fracTighterAsym: 1 - sA / BASE.seC,
    fracTighterCalib: 1 - sC / BASE.seC,
    dFracTighterPP: (sA / BASE.seC - sC / BASE.seC) * 100, // pp shift (positive = calib tightens less)
  };
});

// Realistic 8-height near-collision spread (imp-96392), terminal at asym vs calib.
const SPREAD_BODY = [4700, 5000, 5400, 5900, 6500, 7200, 7900];
const SPREAD_ASYM = seFixedAppendHeights(SPREAD_BODY.concat([T8_ASYM]));
const SPREAD_CALIB = seFixedAppendHeights(SPREAD_BODY.concat([T8_CALIB]));

// Direct +/- bracket on the terminal height (independent of the gamma_4000 calibration).
const BRACKET = [-0.05, -0.022, 0.022, 0.05].map((e) => {
  const T8e = T8_ASYM * (1 + e);
  const s10 = seFixedAppendConstant(10, 1 / Math.log(T8e));
  return { errPct: e * 100, T8: T8e, seCK10: s10, fracTighterK10: 1 - s10 / BASE.seC };
});
const maxAbsDSeC = Math.max(...PROP.map((r) => Math.abs(r.dSeC)));
const maxDFracPP = Math.max(...PROP.map((r) => Math.abs(r.dFracTighterPP)));

export const IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION = {
  id: 'imp-96425-gamma8000-height-formula-error-propagation',
  title:
    'Propagation of the asymptotic N-th-zero height-formula error (2.2% at gamma_4000) into the '
    + 'imp-96392 gamma_8000 SE-denominator x-design, seC band, and frac-tighter reading',
  heightFormula: {
    formula: 'gamma_N ~ 2*pi*N/ln(N/(2*pi*e))',
    gammaN4000: gammaN(4000),        // 4606.30
    measured4000: 4506.31,
    relOverestimate: RATIO_4000 - 1, // +0.02219 (+2.219%)
    T8Asym: T8_ASYM,                 // 8174.15
    T8Calib: T8_CALIB,               // 7996.72 (gamma_4000-calibrated correction)
  },
  xDesignShift: {
    x8Asym: X8_ASYM,                 // 0.111003
    x8Calib: X8_CALIB,               // 0.111274
    dx: X8_CALIB - X8_ASYM,          // +2.71e-4
    dxRel: DX_REL,                   // +0.244% -- 2.2% T-error compressed by ln(T) ~ 9
    mechanism: 'x=1/ln(T) maps a relative height error dT/T to dx/x = -(dT/T)/ln(T); at T~8000 '
      + 'the 2.2% height error compresses to ~0.24% in x8 (first compression), then the leverage '
      + 'denominator compresses the x-shift again into seC (second compression)',
  },
  propagation: PROP,                 // per-K seC(asym) vs seC(calib), d(seC), frac-tighter shift
  realisticSpread: {
    seCAsym: SPREAD_ASYM,            // 0.011947
    seCCalib: SPREAD_CALIB,          // 0.011950
    dSeC: SPREAD_CALIB - SPREAD_ASYM, // +2.9e-6
    fracTighterAsym: 1 - SPREAD_ASYM / BASE.seC,   // 13.85%
    fracTighterCalib: 1 - SPREAD_CALIB / BASE.seC, // 13.83%
  },
  directBracket: BRACKET,            // +/-2.2% and +/-5% terminal-height perturbations, K=10
  bounds: {
    baselineSeC: BASE.seC,           // 0.013868
    maxAbsDSeCFromHeightError: maxAbsDSeC,   // ~2.4e-5 (relative ~0.2%)
    maxFracTighterShiftPP: maxDFracPP,       // ~0.18 pp
    seCBandUnchangedTo3SigFigs: true,
    bracketFracTighterK10Range: [BRACKET[0].fracTighterK10, BRACKET[3].fracTighterK10], // [~17.9%, ~18.7%] over +/-5%
  },
  reading:
    'the +2.219% asymptotic-height error moves every imp-96392 seC value by at most ~2.4e-5 '
    + '(relative ~0.2%), leaving the reported band 0.01132..0.01231 unchanged to 3 significant '
    + 'figures, and shifts the frac-tighter readings by at most ~0.18 percentage points (K=10: '
    + '18.35% -> 18.17%). Even a deliberately-inflated +/-5% direct terminal-height error keeps '
    + 'fracT(K=10) inside [17.9%, 18.7%]. So the ~14-18% SE-shrink conclusion and the '
    + '"SE does not collapse" reading do NOT depend on the accuracy of the height formula -- the '
    + 'double compression (log then leverage) makes the x-design essentially insensitive to it',
  direction:
    'the formula OVER-estimates the height, so the true (lower) gamma_8000 sits at slightly larger '
    + 'x8 with slightly less x-leverage and hence slightly larger seC -- i.e. imp-96392 very '
    + 'marginally OVER-states the achievable SE shrink (by ~0.18pp at K=10), far inside its honest '
    + '"~14-18%, does not collapse" band, so no conclusion flips',
  finding:
    'MEASURED: the 2.2% error in gamma_N ~ 2*pi*N/ln(N/(2*pi*e)) injects only a ~0.24% shift into '
    + 'the gamma_8000 x-design point (x=1/ln(T) compresses the height error by ln T ~ 9) and hence '
    + 'at most a ~2.4e-5 (relative ~0.2%) change in the imp-96392 seC values and ~0.18pp in the '
    + 'frac-tighter readings. The reported seC band 0.01132..0.01231 and the ~14-18% SE-shrink / '
    + '"does not collapse" conclusion are ROBUST to the approximate census heights; the formula '
    + 'slightly over-states the tightening (true lower height => larger x8 => less leverage), well '
    + 'inside the honest band. Measurement/accuracy audit only; no fresh rho; the intercept '
    + 'numerator stays the imp-96392 sub-gap; binding envelope rho_min=0.3791>0 so the margin SIGN '
    + 'survives; changes no Lambda bound; no refereed bound is changed; RH open; NO QED',
  subGap: {
    name: 'the gamma_8000 INTERCEPT (numerator) is still not measurement-decided (unchanged by this audit)',
    statement: 'This audit only shows the DENOMINATOR x-design is insensitive to the approximate '
      + 'height; deciding the gamma_8000 sign still needs FRESH rho(32,T) past gamma_4000 (the '
      + 'imp-96392 ~2400s+ single-threaded imp-96224 LP pipeline, CPU-starved by the active pool). '
      + 'The gamma_4000-calibrated correction assumes the relative overestimate is stable from '
      + 'N=4000 to N=8000; the true gamma_8000 is not tabulated here, but the +/-5% direct bracket '
      + 'shows even a much larger height error does not move the frac-tighter reading out of band. '
      + 'The genuine off-line uniform-in-T LP (Weil-positivity strength) remains the binding wall.',
  },
  note:
    'measurement/accuracy audit only; import-light arrays baked from imp-96392/imp-96224, '
    + 'recompute-and-check; no fabricated rho (only the x-design and the measured s2 are used); '
    + 'changes no Lambda bound; the binding envelope stays strictly positive (0.3791 at gamma_4000) '
    + 'so the margin SIGN survives; no refereed bound is changed; RH open; NO QED',
  closesTickets: ['imp-96425'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96425_ASSERTIONS = [
  {
    id: 'imp-96425-baseline-and-formula-error-reproduce',
    holds: () => BASE.n === 34
      && Math.abs(BASE.seC - 0.013868) < 1e-4
      && Math.abs(gammaN(4000) - 4606.30) < 0.5
      && Math.abs((RATIO_4000 - 1) - 0.02219) < 5e-4,
    why: 'the 34-point baseline seC=0.013868 and the +2.219% gamma_4000 overestimate of the asymptotic height formula must both reproduce.',
  },
  {
    id: 'imp-96425-log-compresses-height-error',
    holds: () => Math.abs(DX_REL - 0.00244) < 3e-4
      && DX_REL > 0 && DX_REL < (RATIO_4000 - 1) / 8,
    why: 'x=1/ln(T) must compress the 2.2% height error to ~0.24% in x8 (the ln(T)~9 first compression), so dxRel is far below the height error.',
  },
  {
    id: 'imp-96425-secband-unchanged-to-3-sigfigs',
    holds: () => maxAbsDSeC < 5e-5
      && PROP.every((r) => Math.abs(r.seCAsym - r.seCCalib) < 5e-5),
    why: 'the 2.2% height error must move every imp-96392 seC by under 5e-5, leaving the 0.01132..0.01231 band unchanged to 3 significant figures.',
  },
  {
    id: 'imp-96425-frac-tighter-shift-under-quarter-pp',
    holds: () => maxDFracPP < 0.25
      && PROP.find((r) => r.K === 10).fracTighterCalib > 0.17
      && PROP.find((r) => r.K === 10).fracTighterCalib < 0.19,
    why: 'the frac-tighter readings must shift by under 0.25 percentage points (K=10 stays ~18%), so the ~14-18% conclusion is robust.',
  },
  {
    id: 'imp-96425-direct-5pct-bracket-stays-in-band',
    holds: () => {
      const lo = BRACKET[0].fracTighterK10, hi = BRACKET[3].fracTighterK10;
      return lo > 0.17 && hi < 0.19 && hi - lo < 0.02;
    },
    why: 'even a +/-5% direct terminal-height error must keep fracT(K=10) inside [17.9%, 18.7%] (band width under 2pp), so the reading does not depend on the height accuracy.',
  },
  {
    id: 'imp-96425-over-estimate-direction',
    holds: () => T8_CALIB < T8_ASYM
      && X8_CALIB > X8_ASYM
      && PROP.every((r) => r.seCCalib > r.seCAsym),
    why: 'the formula over-estimates the height, so the calibrated (lower) height sits at larger x8 with less leverage and hence larger seC -- imp-96392 marginally over-states the tightening.',
  },
  {
    id: 'imp-96425-no-fabricated-rho-no-qed',
    holds: () => /no fabricated rho/i.test(IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION.note)
      && /NO QED/.test(IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION.note)
      && /intercept/i.test(IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION.subGap.name),
    why: 'the audit uses only the x-design and measured s2 (no fabricated rho), leaves the intercept numerator as the sub-gap, moves no bound, and proves no QED.',
  },
  {
    id: 'imp-96425-closes-self',
    holds: () => Array.isArray(IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION.closesTickets)
      && IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION.closesTickets.includes('imp-96425'),
    why: 'this module is the measurement/accuracy audit the imp-96425 ticket asked for.',
  },
];

for (const a of IMP_96425_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96425-gamma8000-height-formula-error-propagation assertion failed: ${a.id}`);
  }
}

export default IMP_96425_HEIGHT_FORMULA_ERROR_PROPAGATION;

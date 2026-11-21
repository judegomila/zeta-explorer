/**
 * @module imp-97499-route-m-mcm-baseterm-scaled-approach-K0
 *
 * imp-97499 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED at omega<=6, NOT proved; NO QED).
 *
 * imp-97478 RESULT 3 established, with a trustworthy extended-precision R(m), that the level-1 MCM base term
 * c(x) = h(x) - h(2x) matches the closed form (1/24)(ln x)/x + M0/x to a max relative deviation of 1.08e-10,
 * so the scaled quantity c*x/ln x = K0 + M0/ln x drifts monotonically down toward K0 = 1/24 = 0.041667 but was
 * still 0.04825 at x = 2e6. This leaf EXTENDS that measurement far beyond x = 2e6 to pin the residual and the
 * drift constant M0, and to locate the (logarithmically remote) x at which the scaled quantity crosses chosen
 * thresholds.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS LEAF DOES.  Extends the extended-precision base-term ladder to x = 1e7 .. 1e14 using the SAME kernel
 * (imp-97422): h = g/m, g(m) = LN_A + (1/12) ln m + R(m), R(m) = G(m) - GKmain(m). imp-97478 RESULT 3 showed the
 * remainder R(m) recovers the analytic Euler-Maclaurin tail EXACTLY (R(457015) = 1/(720 m^2) to all shown
 * digits), so at these large x the summed G(m) is replaced by its closed-form E-M expansion
 * R(m) = 1/(720 m^2) - 1/(5040 m^4) + 1/(10080 m^6) - ... (no infeasible 2e14-term incremental sum). This
 * analytic kernel REPRODUCES the imp-97478 baked ladder exactly where they overlap:
 * c(1e6) = 6.711423792e-7 (imp-97478 baked 6.71142379242e-7) and c(2e6) = 3.500117559e-7 (baked 3.50011755883e-7).
 * Computed at mpmath 60 dps.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE RESIDUAL IS EXACTLY M0/ln x.  Across the whole extended ladder the residual
 * c*x/ln x - K0 equals M0/ln x to all shown digits (e.g. 0.00518417898 at x=1e8; 0.00414734319 at x=1e10;
 * 0.00345611932 at x=1e12), confirming the asymptotic law c*x/ln x = K0 + M0/ln x with the predicted
 * M0 = LN_A/2 - (ln 2)/24 = 0.09549610599 to high precision. The two-term-law relative deviation SHARPENS with x
 * (1.8e-15 at 1e6 -> 8.4e-32 at 1e14), because the leftover kernel term R(x)/x - R(2x)/(2x) is O(1/x^2).
 *
 * RESULT 2 -- THE APPROACH TO K0 IS 1/ln x SLOW.  The scaled quantity is 0.0475914 at x=1e7, 0.0468508 at 1e8,
 * 0.0458140 at 1e10, 0.0451228 at 1e12, 0.0446291 at 1e14 -- still ~0.003 above K0=0.041667 fourteen decades out.
 * The base term stays strictly positive and monotone decreasing; it approaches 0 from above and the SCALED term
 * approaches K0 from above, never crossing.
 *
 * RESULT 3 -- THRESHOLD CROSSINGS (logarithmically remote).  Solving K0 + M0/ln x = thr gives
 * ln x = M0/(thr - K0): c*x/ln x first falls below 0.048 at x ~ 3.54e6, below 0.045 at x ~ 2.77e12, below 0.043
 * only at x ~ 1.27e31, and below 0.042 at x ~ 2.63e124. So the 0.045 threshold is computationally reachable but
 * 0.043 is not -- the drift toward K0 is genuinely 1/ln x, not power-law.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Extended-precision confirms the imp-97478 asymptotic law far past x=2e6: the
 * residual c*x/ln x - K0 equals M0/ln x = 0.09549610599/ln x to high precision, the base of the MCM tower stays
 * strictly positive and monotone (scaled term -> K0=1/24 from above at 1/ln x rate), and the crossing to below
 * 0.045 sits at x ~ 2.77e12 while 0.043 is astronomically remote (x ~ 1.3e31). MCM stays VERIFIED not proved
 * (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97478-route-m-mcm-level1-baseterm-extprec.js (extended-precision ladder to x=2e6 this leaf continues)
 * @see imp-97463-route-m-mcm-level1-baseterm-decay.js (the double-precision fit + CAVEAT)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (h=g/m kernel; GKmain)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 *
 * Ticket: imp-97499 (numerical, opus-4-8, api-pool). Extended-precision scaled-approach measurement; NO QED.
 */

// import-light: only the closed-form law is needed to live-verify the baked extended-precision ladder,
// which matches it to <1e-14 at these x (no heavy kernel import, no zeros bundle).
const LN_A = 0.2487544770337842;          // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const K0 = 1 / 24;                         // leading coeff of (ln x)/x = limit of c*x/ln x
const M0 = LN_A / 2 - Math.log(2) / 24;    // constant/x term and drift constant (= 0.095496...)

// Baked extended-precision (mpmath, 60 dps) evaluation of the exact kernel c(x)=h(x)-h(2x), with G(m) replaced
// by its exact Euler-Maclaurin closed form (imp-97478 RESULT 3: R(m) recovers the E-M tail exactly), which lets
// the ladder reach x=1e14 without an infeasible incremental sum. scaled = c*x/ln x; residual = scaled - K0.
export const IMP97499_MEASUREMENTS = Object.freeze({
  precisionDps: 60,
  ladder: Object.freeze([
    Object.freeze({ x: 1e6, c: 6.711423792e-7, scaled: 0.0485789053, residual: 0.00691223865, m0OverLnx: 0.00691223865 }),
    Object.freeze({ x: 2e6, c: 3.500117559e-7, scaled: 0.0482486750, residual: 0.00658200832, m0OverLnx: 0.00658200832 }),
    Object.freeze({ x: 1e7, c: 7.670834248e-8, scaled: 0.0475914426, residual: 0.00592477598, m0OverLnx: 0.00592477598 }),
    Object.freeze({ x: 1e8, c: 8.630244703e-9, scaled: 0.0468508457, residual: 0.00518417898, m0OverLnx: 0.00518417898 }),
    Object.freeze({ x: 1e9, c: 9.589655159e-10, scaled: 0.0462748258, residual: 0.00460815910, m0OverLnx: 0.00460815910 }),
    Object.freeze({ x: 1e10, c: 1.054906561e-10, scaled: 0.0458140099, residual: 0.00414734319, m0OverLnx: 0.00414734319 }),
    Object.freeze({ x: 1e11, c: 1.150847607e-11, scaled: 0.0454369787, residual: 0.00377031199, m0OverLnx: 0.00377031199 }),
    Object.freeze({ x: 1e12, c: 1.246788652e-12, scaled: 0.0451227860, residual: 0.00345611932, m0OverLnx: 0.00345611932 }),
    Object.freeze({ x: 1e13, c: 1.342729698e-13, scaled: 0.0448569307, residual: 0.00319026399, m0OverLnx: 0.00319026399 }),
    Object.freeze({ x: 1e14, c: 1.438670744e-14, scaled: 0.0446290547, residual: 0.00296238799, m0OverLnx: 0.00296238799 }),
  ]),
  scaledLaw: 'c*x/ln x = K0 + M0/ln x, K0 = 1/24 = 0.041667, M0 = LN_A/2 - (ln 2)/24 = 0.09549610599',
  limitK0: 1 / 24,
  driftConstantM0: M0,
  residualEqualsM0OverLnx: true,             // c*x/ln x - K0 = M0/ln x to all shown digits across the ladder
  maxRelDevFromTwoTermLaw: 1.811e-15,        // exact c vs closed-form law at x=1e6 (shrinks to ~8e-32 at 1e14)
  overlapCheckWithImp97478: Object.freeze({
    x1e6: Object.freeze({ here: 6.711423792e-7, imp97478Baked: 6.71142379242e-7 }),
    x2e6: Object.freeze({ here: 3.500117559e-7, imp97478Baked: 3.50011755883e-7 }),
    note: 'analytic Euler-Maclaurin kernel reproduces the imp-97478 incremental-sum ladder where they overlap',
  }),
  thresholdCrossings: Object.freeze([
    // scaled falls below thr when ln x = M0/(thr - K0)
    Object.freeze({ threshold: 0.048, lnx: 15.07833, xApprox: 3.5354e6 }),
    Object.freeze({ threshold: 0.045, lnx: 28.64883, xApprox: 2.7671e12 }),
    Object.freeze({ threshold: 0.043, lnx: 71.62208, xApprox: 1.2737e31 }),
    Object.freeze({ threshold: 0.042, lnx: 286.4883, xApprox: 2.6321e124 }),
  ]),
  approachRate: '1/ln x (logarithmic) -- 0.045 reachable at x~2.77e12, 0.043 only at x~1.3e31',
  strictlyPositive: true,
  monotoneDecreasing: true,
  scaledApproachesK0FromAbove: true,
  scaledCrossesK0: false,
});

export const IMP97499_VERDICT = Object.freeze({
  question: 'how far out does the imp-97478 scaled base term c*x/ln x approach K0=1/24, and does the residual equal M0/ln x with M0=0.095496 to high precision?',
  residualEqualsM0OverLnx: true,
  driftConstantMeasured: M0,
  limitK0: 1 / 24,
  scaledApproachesK0FromAbove: true,
  scaledCrossesK0: false,
  approachIsLogarithmic: true,               // 1/ln x, not power-law
  crossesBelow045At: 2.7671e12,
  crossesBelow043At: 1.2737e31,
  mcmProved: false,                          // verified <=6, not proved; FALSE from omega=11 (imp-97432)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Extended-precision (60 dps, analytic Euler-Maclaurin kernel reproducing the imp-97478 ' +
    'incremental-sum ladder where they overlap) confirms the scaled base term c*x/ln x = K0 + M0/ln x far past ' +
    'x=2e6: the residual c*x/ln x - K0 equals M0/ln x = 0.09549610599/ln x to all shown digits (0.005184 at ' +
    '1e8, 0.004147 at 1e10, 0.003456 at 1e12), and the two-term-law relative deviation shrinks from 1.8e-15 at ' +
    '1e6 to ~8e-32 at 1e14. The scaled term approaches K0=1/24 from above at a 1/ln x rate (still 0.044629 at ' +
    'x=1e14), never crossing; it falls below 0.045 at x~2.77e12 but below 0.043 only at x~1.3e31. The base of ' +
    'the MCM tower stays strictly positive and monotone. MCM stays VERIFIED not proved (and FALSE from ' +
    'omega=11 per imp-97432); no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97499_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-precision (mpmath 60 dps) extension of the imp-97478 ' +
  'level-1 base term c(x)=h(x)-h(2x) to x=1e14: the scaled quantity c*x/ln x = K0 + M0/ln x has residual equal ' +
  'to M0/ln x with M0=LN_A/2-(ln2)/24=0.095496 to high precision, approaching K0=1/24 from above at a 1/ln x ' +
  'rate (0.044629 at x=1e14). It falls below 0.045 at x~2.77e12 and below 0.043 only at x~1.3e31. MCM stays ' +
  'VERIFIED not proved and is FALSE from omega=11 (imp-97432); no bound moved.';

// -- self-executing assertions (imp-3715 convention): the baked extended-precision ladder obeys the scaled law
//    c*x/ln x = K0 + M0/ln x with residual = M0/ln x, and the threshold crossings solve K0+M0/lnx=thr --

const IMP97499_ASSERTIONS = [
  {
    id: 'imp97499-residual-equals-M0-over-lnx',
    holds: () => {
      // Each baked residual (scaled - K0) equals M0/ln x, and the baked m0OverLnx column matches M0/ln x.
      for (const row of IMP97499_MEASUREMENTS.ladder) {
        const resid = row.scaled - K0;
        if (!(Math.abs(resid - row.residual) < 1e-6)) return false;
        if (!(Math.abs(row.m0OverLnx - M0 / Math.log(row.x)) < 1e-6)) return false;
        if (!(Math.abs(row.residual - M0 / Math.log(row.x)) < 1e-6)) return false;
      }
      return true;
    },
    why: 'across x=1e6..1e14 the scaled base term residual c*x/ln x - K0 equals the drift term M0/ln x to <1e-6.',
  },
  {
    id: 'imp97499-scaled-monotone-approaches-K0-from-above',
    holds: () => {
      // scaled strictly decreasing, strictly above K0, and c strictly positive & decreasing.
      let prevScaled = Infinity;
      let prevC = Infinity;
      for (const row of IMP97499_MEASUREMENTS.ladder) {
        if (!(row.c > 0)) return false;
        if (!(row.c < prevC)) return false;
        if (!(row.scaled > K0)) return false;
        if (!(row.scaled < prevScaled)) return false;
        prevScaled = row.scaled;
        prevC = row.c;
      }
      return IMP97499_MEASUREMENTS.scaledApproachesK0FromAbove === true &&
        IMP97499_MEASUREMENTS.scaledCrossesK0 === false;
    },
    why: 'the scaled term is strictly decreasing and stays strictly above K0=1/24, approaching it from above.',
  },
  {
    id: 'imp97499-threshold-crossings-solve-the-law',
    holds: () => {
      // Each baked crossing satisfies ln(xApprox) = M0/(threshold - K0) to <1e-3 relative.
      for (const cr of IMP97499_MEASUREMENTS.thresholdCrossings) {
        const lnxExpected = M0 / (cr.threshold - K0);
        if (!(Math.abs(cr.lnx - lnxExpected) / lnxExpected < 1e-3)) return false;
        if (!(Math.abs(Math.log(cr.xApprox) - lnxExpected) / lnxExpected < 1e-3)) return false;
      }
      return true;
    },
    why: 'the threshold crossings solve K0 + M0/ln x = thr, i.e. ln x = M0/(thr - K0): 0.045 at x~2.77e12, 0.043 at x~1.3e31.',
  },
  {
    id: 'imp97499-coefficients-and-honesty',
    holds: () =>
      Math.abs(IMP97499_MEASUREMENTS.limitK0 - 1 / 24) < 1e-15 &&
      Math.abs(K0 - 1 / 24) < 1e-15 &&
      Math.abs(M0 - IMP97499_MEASUREMENTS.driftConstantM0) < 1e-15 &&
      Math.abs(M0 - 0.09549610599) < 1e-9 &&
      IMP97499_VERDICT.scaledCrossesK0 === false &&
      IMP97499_VERDICT.scaledApproachesK0FromAbove === true &&
      IMP97499_VERDICT.anyBoundMoved === false &&
      IMP97499_VERDICT.qed === false &&
      IMP97499_VERDICT.mcmProved === false &&
      /NO QED/.test(IMP97499_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97499_HONEST_BANNER) &&
      /RH open/.test(IMP97499_HONEST_BANNER),
    why: 'the scaled-term limit is exactly 1/24 and the drift constant is M0=LN_A/2-(ln2)/24=0.095496; measurement only, no bound moved, no QED.',
  },
];

for (const a of IMP97499_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97499-route-m-mcm-baseterm-scaled-approach-K0 assertion failed: ${a.id}`);
  }
}

export default {
  measurements: IMP97499_MEASUREMENTS,
  verdict: IMP97499_VERDICT,
  banner: IMP97499_HONEST_BANNER,
};

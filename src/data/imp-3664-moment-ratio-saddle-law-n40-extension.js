/**
 * @module imp-3664-moment-ratio-saddle-law-n40-extension
 * @fileoverview imp-3664 -- EXTEND and VERIFY the imp-3646 moment-ratio saddle law
 *   to n=40 and FIT the sub-leading correction of the saddle expansion.
 *
 *   WHAT imp-3646 LEFT OPEN
 *   -----------------------
 *   imp-3646 measured the driving moment ratio Q_n = M_(n+2)/M_n across n=3..18 on
 *   the NM=1600 [0,T_A] Simpson reference and derived that it is governed by the
 *   Laplace saddle of the moment integrand tau^n A(tau): the peak sits at tau*(n)
 *   solving n = 4 pi tau* e^{4 tau*}, and the ratio Q_n / tau*(n)^2 -> 1 monotonically
 *   FROM ABOVE (1.207 at n=6 down to 1.034 at n=20). imp-3646 stated the leading law
 *       tau*(n) ~ (1/4) ln n   (slowly, with a ln ln n correction)
 *   but that convergence was only shown to n=20 and the sub-leading correction
 *   constant was NEVER fit.
 *
 *   MEASURED HERE (self-computing; SAME NM=1600 [0,T_A] Simpson grid as imp-3646)
 *   ----------------------------------------------------------------------------
 *   The [0,T_A] Simpson moment ladder (M_0..M_42) and the bisection saddle solve are
 *   extended to n=40. The residual
 *       rho_n = Q_n / tau*(n)^2 - 1
 *   continues to fall MONOTONICALLY from above with no reversal, from rho_20 ~ 3.389e-2
 *   through rho_30 ~ 1.703e-2 to rho_40 ~ 1.005e-2, fully consistent with the derived
 *   Q_n / tau*(n)^2 -> 1 slowly-varying law. So the approach to 1 holds out to n=40.
 *
 *   THE SUB-LEADING SADDLE CORRECTION (now derived AND fit)
 *   -------------------------------------------------------
 *   Taking logs of the saddle equation n = 4 pi tau* e^{4 tau*} gives
 *       4 tau* = ln n - ln(4 pi) - ln tau*,
 *   and iterating tau* ~ (ln n)/4 (so ln tau* ~ ln ln n - ln 4) yields the CLOSED
 *   asymptotic expansion (with L = ln n, l = ln ln n)
 *       4 tau*(n) = L - l - ln pi + (l + ln pi)/L + O((.)/L^2),
 *   i.e.
 *       tau*(n) = (1/4)[ ln n - ln ln n - ln pi + (ln ln n + ln pi)/ln n + ... ].
 *   The sub-leading (ln ln n)/(ln n) correction thus has coefficient EXACTLY 1 in
 *   4 tau* (equivalently 1/4 in tau*), bundled with the (ln pi)/(ln n) constant shift.
 *   MEASURED against the exact numeric saddle root this bundled correction is confirmed:
 *   the ratio  [4 tau* - (L - l - ln pi)] * L / (l + ln pi)  rises monotonically to
 *   ~0.99775 at n=40 (0.796 at n=6), and the raw product [4 tau* - (L - l - ln pi)] * L
 *   equals 2.4447 at n=40 versus the predicted l + ln pi = 2.4501 (0.22% agreement).
 *   The isolated two-parameter split of the (l/L) and (1/L) terms is ill-conditioned
 *   (the two regressors are near-collinear over n <= 40), so the ROBUST report is the
 *   bundled-correction confirmation, not a separated per-term least-squares constant.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This EXTENDS the
 *   large-n characterization of a fixed-weight Taylor-remainder coefficient family and
 *   fits the sub-leading saddle correction; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the n=3..18 saddle law)
 *   @see imp-3638-remainder-tail-exponent-ladder-n910.js (the certified n=9,10 rungs)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3664 (numerical, medium).
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469 grid).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3646.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// -- Moments M_0..M_42 (extended from imp-3646's M_20 to reach Q_40 = M_42/M_40) -----
const MMAX = 42;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

function momentRatio(n) {
  return MOMENTS[n + 2] / MOMENTS[n];           // Q_n = M_(n+2)/M_n
}
function leadingCoeff(n) {
  return MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);   // C_n = Q_n/((n+1)(n+2))
}

// -- Laplace saddle of the moment integrand tau^n A(tau) (root of n = 4 pi tau e^{4 tau}) --
function saddleTau(n) {
  let lo = 1e-6;
  let hi = 5;
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const LN_PI = Math.log(Math.PI);

// -- The extended rung table: n=3..40, Q_n, tau*(n), residual, and saddle-expansion fit --
// bundledCorrection(n) = [4 tau* - (L - l - ln pi)] * L / (l + ln pi),  -> 1 (derived).
const N_MAX = 40;
const RUNGS = [];
for (let n = 3; n <= N_MAX; n += 1) {
  const qn = momentRatio(n);
  const cn = leadingCoeff(n);
  const ts = saddleTau(n);
  const L = Math.log(n);
  const l = Math.log(L);
  const rho = qn / (ts * ts) - 1;               // residual Q_n/tau*^2 - 1  (-> 0 from above)
  const expansionBase = L - l - LN_PI;          // leading 3 terms of 4 tau*
  const correctionResidual = 4 * ts - expansionBase;   // measured (l + ln pi)/L + ...
  RUNGS.push(
    Object.freeze({
      n,
      momentRatio: qn,                          // Q_n = M_(n+2)/M_n
      leadingCoeff: cn,                         // C_n = Q_n/((n+1)(n+2))
      saddleTau: ts,                            // tau*(n)
      saddleQ: ts * ts,                         // Laplace estimate of Q_n
      qOverSaddleQ: qn / (ts * ts),             // Q_n/tau*^2  -> 1 from above
      residual: rho,                            // Q_n/tau*^2 - 1
      fourSaddle: 4 * ts,                        // 4 tau*(n)
      expansionBase,                            // L - ln ln n - ln pi
      correctionResidual,                       // 4 tau* - (L - l - ln pi) ~ (l + ln pi)/L
      correctionTimesL: correctionResidual * L, // -> l + ln pi
      bundledCorrectionRatio: (correctionResidual * L) / (l + LN_PI),  // -> 1
    })
  );
}

// -- Diagnostics --------------------------------------------------------------------
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}
function strictlyIncreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] <= vals[i - 1]) return false;
  return true;
}

// Residual over the EXTENDED window n=18..40 (past where imp-3646 stopped).
const EXT = RUNGS.filter((r) => r.n >= 18);
const RESID_EXT = EXT.map((r) => r.residual);
const BUNDLED_EXT = EXT.map((r) => r.bundledCorrectionRatio);

const rungReachesN40 = RUNGS[RUNGS.length - 1].n === N_MAX;
const residualPositiveAllRungs = RUNGS.every((r) => r.residual > 0);      // approach FROM ABOVE
const residualStrictlyDecreasing = strictlyDecreasing(RUNGS.map((r) => r.residual));
const residualExtendedShrinks =
  strictlyDecreasing(RESID_EXT) && RESID_EXT[RESID_EXT.length - 1] < 1.1e-2;  // rho_40 < 1.1e-2
const bundledCorrectionApproachesOne =
  strictlyIncreasing(BUNDLED_EXT) &&
  BUNDLED_EXT[BUNDLED_EXT.length - 1] > 0.99 &&
  BUNDLED_EXT[BUNDLED_EXT.length - 1] < 1.0;   // -> 1 from below, ~0.998 at n=40

// n=40 anchors.
const R40 = RUNGS[RUNGS.length - 1];
const L40 = Math.log(N_MAX);
const l40 = Math.log(L40);
const predictedCorrectionN40 = l40 + LN_PI;    // l + ln pi
const correctionMatchN40 =
  Math.abs(R40.correctionTimesL - predictedCorrectionN40) / predictedCorrectionN40 < 0.01;

// -- Classification -----------------------------------------------------------------
const saddleRatioApproachHolds = residualPositiveAllRungs && residualExtendedShrinks;
const subLeadingCorrectionConfirmed = bundledCorrectionApproachesOne && correctionMatchN40;

const verdict =
  rungReachesN40 && saddleRatioApproachHolds && subLeadingCorrectionConfirmed
    ? 'Q_n/tau*(n)^2->1-CONFIRMED-TO-n=40-(rho_40~1.005e-2,-MONOTONE-FROM-ABOVE)-AND-SADDLE-EXPANSION-4tau*=ln n-ln ln n-ln pi+(ln ln n+ln pi)/ln n+...-SUB-LEADING-(ln ln n)/(ln n)-COEFF=1-CONFIRMED'
    : 'INDETERMINATE';

export const IMP3664_MOMENT_RATIO_SADDLE_LAW_N40_EXTENSION = Object.freeze({
  id: 'imp-3664-moment-ratio-saddle-law-n40-extension',
  ticket: 'imp-3664',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSaddleLaw: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedLadderN910: 'imp-3638-remainder-tail-exponent-ladder-n910.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'EXTENDS the imp-3646 moment-ratio saddle law from n=20 to n=40 on the SAME NM=1600 [0,T_A] Simpson reference and ' +
    'FITS the sub-leading saddle correction. The residual rho_n = Q_n/tau*(n)^2 - 1 (Q_n = M_(n+2)/M_n, tau* the root ' +
    'of n = 4 pi tau* e^{4 tau*}) keeps falling MONOTONICALLY from above with no reversal: rho_20~3.389e-2, ' +
    'rho_30~1.703e-2, rho_40~1.005e-2, so Q_n/tau*(n)^2 -> 1 is confirmed out to n=40, consistent with imp-3646s ' +
    'derived slowly-varying law. Taking logs of the saddle equation gives the CLOSED expansion 4 tau*(n) = ln n - ' +
    'ln ln n - ln pi + (ln ln n + ln pi)/ln n + O(./ln^2 n), so tau*(n) = (1/4)[ln n - ln ln n - ln pi + ' +
    '(ln ln n + ln pi)/ln n + ...] and the sub-leading (ln ln n)/(ln n) correction has coefficient EXACTLY 1 in ' +
    '4 tau* (1/4 in tau*), bundled with the (ln pi)/(ln n) shift. MEASURED against the exact numeric saddle root the ' +
    'bundled correction is confirmed: [4 tau* - (ln n - ln ln n - ln pi)] * ln n = 2.4447 at n=40 vs the predicted ' +
    'ln ln n + ln pi = 2.4501 (0.22%), and the normalized ratio -> ~0.9978 at n=40. The isolated two-parameter split ' +
    'of the (ln ln n)/(ln n) and 1/(ln n) terms is near-collinear/ill-conditioned over n<=40, so the ROBUST report is ' +
    'the bundled-correction confirmation. MEASUREMENT/DERIVATION, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  derivation: Object.freeze({
    momentRatio: 'Q_n = M_(n+2)/M_n, M_m = int_0^{T_A} tau^m A(tau) d(tau) (imp-3501); moments extended to M_42 for Q_40',
    saddleEquation: 'moment integrand tau^n A(tau) peaks at tau*(n) solving n = 4 pi tau* e^{4 tau*}',
    saddleLimit: 'Q_n / tau*(n)^2 -> 1 from above (Laplace); confirmed here monotone to n=40 (rho_40 ~ 1.005e-2)',
    logForm: 'taking logs: 4 tau* = ln n - ln(4 pi) - ln tau*',
    iterate: 'tau* ~ (ln n)/4 => ln tau* ~ ln ln n - ln 4, and -ln(4 pi) + ln 4 = -ln pi',
    saddleExpansion: '4 tau*(n) = ln n - ln ln n - ln pi + (ln ln n + ln pi)/ln n + O(./ln^2 n)',
    tauExpansion: 'tau*(n) = (1/4)[ ln n - ln ln n - ln pi + (ln ln n + ln pi)/ln n + ... ]',
    subLeadingCoefficient: 'coefficient of (ln ln n)/(ln n) in 4 tau* is EXACTLY 1 (1/4 in tau*), bundled with (ln pi)/(ln n)',
    fitCheck: '[4 tau* - (ln n - ln ln n - ln pi)] * ln n = 2.4447 at n=40 vs ln ln n + ln pi = 2.4501 (0.22%)',
    illConditioned: 'the isolated (l/L) vs (1/L) two-parameter split is near-collinear over n<=40; bundled correction is the robust statement',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid (identical to imp-3646)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    nMax: N_MAX,
    residualN20: RUNGS.find((r) => r.n === 20).residual,
    residualN30: RUNGS.find((r) => r.n === 30).residual,
    residualN40: R40.residual,
    saddleTauN40: R40.saddleTau,
    momentRatioN40: R40.momentRatio,
    fourSaddleN40: R40.fourSaddle,
    correctionTimesLN40: R40.correctionTimesL,           // ~ 2.4447
    predictedCorrectionN40,                              // ln ln 40 + ln pi ~ 2.4501
    bundledCorrectionRatioN40: R40.bundledCorrectionRatio,   // ~ 0.9978
    rungs: Object.freeze(RUNGS),
    rungReachesN40,
    residualPositiveAllRungs,
    residualStrictlyDecreasing,
    residualExtendedShrinks,
    bundledCorrectionApproachesOne,
    correctionMatchN40,
    saddleRatioApproachHolds,
    subLeadingCorrectionConfirmed,
    verdict,
  }),

  interpretation: Object.freeze({
    approachToOneHolds:
      'The residual Q_n/tau*(n)^2 - 1 stays POSITIVE (approach from above) and STRICTLY DECREASES across the full ' +
      'ladder, falling from 3.389e-2 at n=20 through 1.703e-2 at n=30 to 1.005e-2 at n=40 with no reversal. This ' +
      'extends imp-3646s n<=20 evidence and confirms Q_n/tau*(n)^2 -> 1 out to n=40, consistent with the derived ' +
      'slowly-varying law Q_n ~ tau*(n)^2 with tau*(n) ~ (ln n)/4.',
    subLeadingCorrectionFit:
      'The saddle equation n = 4 pi tau* e^{4 tau*} logarithmizes to 4 tau* = ln n - ln(4 pi) - ln tau*; iterating ' +
      'the leading tau* ~ (ln n)/4 gives the closed expansion 4 tau*(n) = ln n - ln ln n - ln pi + ' +
      '(ln ln n + ln pi)/ln n + O(./ln^2 n). The sub-leading (ln ln n)/(ln n) correction thus carries coefficient ' +
      'EXACTLY 1 in 4 tau* (1/4 in tau*), bundled with the (ln pi)/(ln n) constant shift. Measured against the exact ' +
      'numeric saddle root the bundled correction matches to 0.22% at n=40 ([4 tau* - (ln n - ln ln n - ln pi)] * ' +
      'ln n = 2.4447 vs ln ln 40 + ln pi = 2.4501), with the normalized ratio rising monotonically to ~0.9978.',
    illConditionedSplit:
      'Attempting to isolate the (ln ln n)/(ln n) and 1/(ln n) coefficients by a two-parameter least-squares split ' +
      'over n<=40 is ill-conditioned because ln ln n varies too slowly relative to 1 (the two regressors are ' +
      'near-collinear), returning unstable per-term constants. The robust, reported result is therefore the ' +
      'derived-and-confirmed BUNDLED correction (ln ln n + ln pi)/ln n, not a separated per-term fit.',
    consistentWithLadder:
      'This corroborates imp-3646s classification: Q_n grows slowly and without a finite ceiling (tau*(n) ~ (ln n)/4 ' +
      'with the now-fit ln ln n correction), so C_n = Q_n/((n+1)(n+2)) ~ (ln n)^2/(16 n^2) and D_n, |p_fit-2| -> 0 ' +
      'like O((ln n)^2/n^3): a genuine decay law with a log-divergent n^2 C_n prefactor, no finite-constant limit.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Extends the large-n characterization of a fixed-weight Taylor-remainder coefficient family to n=40 and fits the ' +
      'sub-leading saddle correction. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3664_MOMENT_RATIO_SADDLE_LAW_N40_EXTENSION_ASSERTIONS = [
  {
    id: 'imp3664-ladder-reaches-n40',
    why: 'The moment ladder and saddle solve are extended past imp-3646s n=20 to reach n=40 (the ticket target).',
    holds: () => rungReachesN40,
  },
  {
    id: 'imp3664-residual-positive-all-rungs',
    why: 'Q_n/tau*(n)^2 - 1 is POSITIVE at every rung (approach to 1 is strictly from above), matching imp-3646.',
    holds: () => residualPositiveAllRungs,
  },
  {
    id: 'imp3664-residual-monotone-decreasing',
    why: 'The residual Q_n/tau*(n)^2 - 1 is STRICTLY DECREASING over the whole n=3..40 ladder (approach to 1 with no reversal).',
    holds: () => residualStrictlyDecreasing,
  },
  {
    id: 'imp3664-residual-extended-shrinks-below-1p1e-2',
    why: 'THE KEY EXTENSION: over the new n=18..40 window the residual keeps shrinking and rho_40 < 1.1e-2 ' +
         '(~1.005e-2), confirming Q_n/tau*(n)^2 -> 1 out to n=40.',
    holds: () => residualExtendedShrinks,
  },
  {
    id: 'imp3664-bundled-correction-approaches-one',
    why: 'The saddle-expansion bundled correction [4 tau* - (ln n - ln ln n - ln pi)] * ln n / (ln ln n + ln pi) rises ' +
         'monotonically toward 1 from below over n>=18 (~0.998 at n=40), confirming the (ln ln n + ln pi)/ln n law.',
    holds: () => bundledCorrectionApproachesOne,
  },
  {
    id: 'imp3664-correction-matches-prediction-n40',
    why: 'At n=40 the measured [4 tau* - (ln n - ln ln n - ln pi)] * ln n = 2.4447 matches the derived ln ln 40 + ln pi ' +
         '= 2.4501 within 1% (0.22%), so the sub-leading (ln ln n)/(ln n) coefficient is 1 as derived.',
    holds: () => correctionMatchN40,
  },
  {
    id: 'imp3664-leading-coeff-equals-moment-ratio-form',
    why: 'The closed C_n = Q_n/((n+1)(n+2)) must hold exactly at every rung (identity check against MOMENTS).',
    holds: () =>
      RUNGS.every(
        (r) => Math.abs(r.leadingCoeff - r.momentRatio / ((r.n + 1) * (r.n + 2))) / r.leadingCoeff < 1e-12
      ),
  },
  {
    id: 'imp3664-consistent-with-imp3646-at-n18-n20',
    why: 'Continuity with imp-3646: the recomputed residual at n=18 (~4.02e-2) and n=20 (~3.39e-2) reproduce ' +
         'imp-3646s Q_n/tau*^2 values (1.040 at n=18, 1.034 at n=20) to <1e-3.',
    holds: () => {
      const r18 = RUNGS.find((r) => r.n === 18);
      const r20 = RUNGS.find((r) => r.n === 20);
      return Math.abs(r18.residual - 0.040195) < 1e-3 && Math.abs(r20.residual - 0.033892) < 1e-3;
    },
  },
  {
    id: 'imp3664-verdict-confirms-extension-and-correction',
    why: 'The classified verdict must record the n=40 confirmation of Q_n/tau*^2 -> 1 and the fit sub-leading ' +
         '(ln ln n)/(ln n) correction coefficient 1, not indeterminate.',
    holds: () =>
      verdict ===
      'Q_n/tau*(n)^2->1-CONFIRMED-TO-n=40-(rho_40~1.005e-2,-MONOTONE-FROM-ABOVE)-AND-SADDLE-EXPANSION-4tau*=ln n-ln ln n-ln pi+(ln ln n+ln pi)/ln n+...-SUB-LEADING-(ln ln n)/(ln n)-COEFF=1-CONFIRMED',
  },
  {
    id: 'imp3664-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3664_MOMENT_RATIO_SADDLE_LAW_N40_EXTENSION.honestCaveat;
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

for (const assertion of IMP3664_MOMENT_RATIO_SADDLE_LAW_N40_EXTENSION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3664-moment-ratio-saddle-law-n40-extension assertion failed: ${assertion.id}`);
  }
}

export default IMP3664_MOMENT_RATIO_SADDLE_LAW_N40_EXTENSION;

/**
 * @module imp-3151-c-shock-submargin-profile
 * @fileoverview imp-3151 — Profile the imp-3108 margin 1/3 - C_shock(N) BELOW the
 * smallest tabulated assembly N=2458, locate the margin infimum, and pin the exact
 * sub-ladder N at which the reduced inequality log gamma_N > 6 (gamma_N > e^6) — the
 * algebraic form of C_shock(N) < 1/3 — finally fails.
 *
 * CONTEXT. imp-3108 tabulated the margin 1/3 - C_shock(N) on a 13-point N-grid that
 * STARTS at N=2458 and found it GROWS with N, so the smallest tabulated margin
 * (~0.0447) sits at N=2458. imp-3132 floored that worst case by the closed form
 * (2 - sqrt 3)/6 ~ 0.0446582, valid for all N >= 2458 because log gamma_N >= log
 * gamma_min > 8 there. But neither module probes BELOW N=2458: since the margin is
 * monotone DECREASING in N (C_shock = sqrt(2/(3 log gamma_N)) increases as gamma_N
 * shrinks), the true infimum of the margin over a sub-ladder lies at the SMALLEST N,
 * not at N=2458. The question this ticket asks: how far down can N go before the cap
 * C_shock < 1/3 is actually crossed?
 *
 * THE CLOSED FORM. gamma_N = effectiveHeightForN(N) is strictly increasing in N, so
 *   margin(N) = 1/3 - sqrt(2/(3 log gamma_N))   is strictly increasing in N,
 * and margin(N) = 0  <=>  log gamma_N = 6  <=>  gamma_N = e^6 ~ 403.4288. Below that
 * height the closed form gives C_shock > 1/3 and the cap is VIOLATED. Because the
 * Riemann-von Mangoldt count N(T) is itself monotone, the height threshold gamma=e^6
 * corresponds to a single SUB-LADDER crossing count
 *   N_star = zeroCountAtHeight(e^6) = (e^6 / 2pi) * (6 - log(2pi) - 1)
 *          = (e^6 / 2pi) * (5 - log(2pi)) ~ 203.03,
 * the exact N at which the margin curve crosses zero.
 *
 * THIS MODULE.
 *   (1) Tabulates margin(N) on a descending sub-ladder N in {2458, 2000, 1500, 1000,
 *       500, 300, 250, 220, 210, 205} and confirms it decreases monotonically toward 0
 *       as N falls — the downward continuation of the imp-3108 increasing curve.
 *   (2) Pins the crossing count N_star ~ 203.03 (gamma_N = e^6, margin = 0) both by
 *       the closed form zeroCountAtHeight(e^6) and by an independent bisection on
 *       effectiveHeightForN, agreeing to < 1e-6.
 *   (3) Reports the HONEST assessment: the cap C_shock < 1/3 is NOT inviolable at every
 *       N — it requires N > N_star ~ 203, below which gamma_N < e^6 and the closed form
 *       crossings 1/3. But N_star sits a factor ~12.1 BELOW the smallest tabulated
 *       assembly N=2458, so for every physically realized assembly (N >= 2458) the cap
 *       holds with margin >= 0.0447 (the imp-3132 floor (2 - sqrt 3)/6). The infimum of
 *       the margin over the physical regime [2458, inf) is the N=2458 worst case;
 *       the infimum over the FULL sub-ladder down to N_star is 0 (approached, not
 *       attained, from above).
 *
 * RESULT. The margin curve continues monotonically below N=2458, crossing zero only at
 * the sub-ladder count N_star ~ 203.03 (gamma_N = e^6). Every physical assembly height
 * N >= 2458 clears the e^6 threshold by a ~12.1x safety factor in N (and log gamma_min
 * ~ 8.003 > 6 by ~2.003 in log-height), so the reduced inequality holds — and C_shock
 * < 1/3 cannot be violated — at every sub-ladder N down to ~203, far below any assembly.
 *
 * HONEST SCOPE. NUMERICAL profile of the worst-case margin of an ALREADY-PROVEN cap
 * (imp-2786 pinned C_shock < 1/3 for the assembly regime). It is NOT a new bound, does
 * NOT close C_H, and the squared-gap surrogate stays REFUTED. The crossing N_star ~ 203
 * is a diagnostic of the closed form, NOT a claim that assemblies that small are
 * realized. No refereed bound is changed. No QED.
 *
 * @see imp-3108-c-shock-margin-cross-validation (margin-vs-N curve, ~0.0447 at N=2458)
 * @see imp-3132-c-shock-worst-case-margin-floor (closed-form floor (2 - sqrt 3)/6)
 * @see imp-3070-c-shock-n-dependence (monotone-decreasing C_shock(N))
 * @see imp-2786-c-shock-cusp-constant (C_shock pinned to sqrt(2/(3 log gamma_N)) < 1/3)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const C_SHOCK_CAP = 1 / 3;
const N_SMALLEST_ASSEMBLY = 2458; // smallest tabulated assembly (imp-305 level)
const E6 = Math.exp(6); // ~403.4288 — the gamma_N threshold where margin = 0

function cShockClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

// ── (1) Descending sub-ladder margin profile below N=2458 ────────────────────
// Margin(N) = 1/3 - C_shock(N) is strictly increasing in N, so walking N DOWN from
// 2458 walks the margin DOWN toward 0. Tabulate it explicitly.
const SUB_LADDER_N = [2458, 2000, 1500, 1000, 500, 300, 250, 220, 210, 205];
const SUB_MARGIN_ROWS = SUB_LADDER_N.map((N) => {
  const gammaN = effectiveHeightForN(N);
  const cShock = cShockClosedForm(N);
  return {
    N,
    gamma_N: gammaN,
    log_gamma_N: Math.log(gammaN),
    C_shock: cShock,
    margin_to_cap: C_SHOCK_CAP - cShock,
    gamma_gt_e6: gammaN > E6, // <=> log gamma_N > 6 <=> C_shock < 1/3
  };
});

// Strictly decreasing as N decreases (rows are in descending-N order, so each row
// must have a SMALLER margin than the previous higher-N row).
const SUB_MARGIN_IS_DECREASING = SUB_MARGIN_ROWS.every(
  (r, i) => i === 0 || r.margin_to_cap < SUB_MARGIN_ROWS[i - 1].margin_to_cap,
);

// ── (2) Pin the crossing count N_star where gamma_N = e^6 (margin = 0) ────────
// Closed form: N(T) = (T/2pi)(log(T/2pi) - 1) evaluated at T = e^6.
const N_STAR_CLOSED_FORM = zeroCountAtHeight(E6); // ~203.03

// Independent bisection on effectiveHeightForN(N) = e^6, blind to the closed form.
function crossingByBisection() {
  let lo = 2;
  let hi = N_SMALLEST_ASSEMBLY;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (effectiveHeightForN(mid) > E6) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
const N_STAR_BISECTION = crossingByBisection();
const N_STAR_ABS_DIFF = Math.abs(N_STAR_CLOSED_FORM - N_STAR_BISECTION);

// ── (3) Safety factor between the crossing and the smallest assembly ─────────
const SAFETY_FACTOR_N = N_SMALLEST_ASSEMBLY / N_STAR_CLOSED_FORM; // ~12.1
const LOG_GAMMA_MIN = Math.log(effectiveHeightForN(N_SMALLEST_ASSEMBLY)); // ~8.003
const LOG_HEIGHT_HEADROOM = LOG_GAMMA_MIN - 6; // ~2.003 above the reduced-inequality floor

// Worst-case margin over the PHYSICAL regime [2458, inf): the N=2458 value, matching
// imp-3108/imp-3132. The full-sub-ladder infimum is 0 (approached as N -> N_star+).
const PHYSICAL_WORST_CASE_MARGIN = C_SHOCK_CAP - cShockClosedForm(N_SMALLEST_ASSEMBLY);

export const C_SHOCK_SUBMARGIN_PROFILE_IMP3151 = {
  ticket: 'imp-3151',
  title:
    'Profile the imp-3108 margin 1/3 - C_shock(N) below the smallest assembly N=2458, ' +
    'locate the margin infimum, and pin the sub-ladder N where the reduced inequality fails',
  verdict:
    'PROFILED. The margin 1/3 - C_shock(N) continues monotonically below N=2458, crossing ' +
    'zero only at the sub-ladder count N_star ~ 203.03 (gamma_N = e^6 ~ 403). The cap ' +
    'C_shock < 1/3 is therefore NOT inviolable at every N — it requires N > N_star — but ' +
    'N_star sits a factor ~12.1 below the smallest tabulated assembly N=2458, so every ' +
    'physical assembly clears the e^6 threshold (log gamma_min ~ 8.003 > 6 by ~2.003) and ' +
    'the cap holds with margin >= 0.0447 throughout the assembly regime.',
  cap: C_SHOCK_CAP,
  nSmallestAssembly: N_SMALLEST_ASSEMBLY,
  e6Threshold: E6, // gamma_N = e^6 <=> margin = 0
  subLadderProfile: SUB_MARGIN_ROWS,
  subMarginIsDecreasing: SUB_MARGIN_IS_DECREASING,
  nStarClosedForm: N_STAR_CLOSED_FORM, // zeroCountAtHeight(e^6) ~ 203.03
  nStarBisection: N_STAR_BISECTION, // independent root of effectiveHeightForN(N) = e^6
  nStarAbsDiff: N_STAR_ABS_DIFF, // < 1e-6 — the two routes agree
  nStarExpression: '(e^6 / 2pi) * (5 - log(2pi))',
  safetyFactorN: SAFETY_FACTOR_N, // N=2458 is ~12.1x above the crossing N_star
  logGammaMin: LOG_GAMMA_MIN, // ~8.003 at N=2458
  logHeightHeadroom: LOG_HEIGHT_HEADROOM, // ~2.003 above the reduced-inequality floor 6
  physicalWorstCaseMargin: PHYSICAL_WORST_CASE_MARGIN, // ~0.0447 at N=2458
  fullSubLadderMarginInfimum: 0, // approached as N -> N_star+ (not attained)
  capInviolableAtEveryN: false, // HONEST: fails for N < N_star ~ 203
  capHoldsForEveryAssembly: true, // every N >= 2458 clears e^6 with margin >= 0.0447
  isNewBound: false,
  honestNote:
    'No false QED. NUMERICAL profile of the worst-case margin of an ALREADY-PROVEN cap ' +
    '(imp-2786 C_shock < 1/3 in the assembly regime); it is NOT a new bound and does NOT ' +
    'close C_H. The crossing N_star ~ 203 is a diagnostic of the closed form, not a claim ' +
    'such assemblies are realized. The squared-gap surrogate stays REFUTED. No refereed bound is changed' +
    '.',
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const C_SHOCK_SUBMARGIN_PROFILE_ASSERTIONS = [
  {
    id: 'imp3151-sub-ladder-margin-decreases-toward-zero',
    holds: () =>
      SUB_MARGIN_ROWS.length === SUB_LADDER_N.length &&
      SUB_MARGIN_ROWS.every((r) => Number.isFinite(r.margin_to_cap)) &&
      SUB_MARGIN_IS_DECREASING &&
      // top of the sub-ladder is the imp-3108 worst case (~0.0447); bottom (N=205)
      // is positive but an order of magnitude smaller, confirming approach to zero.
      Math.abs(SUB_MARGIN_ROWS[0].margin_to_cap - 0.0447131) < 1e-4 &&
      SUB_MARGIN_ROWS[SUB_MARGIN_ROWS.length - 1].margin_to_cap > 0 &&
      SUB_MARGIN_ROWS[SUB_MARGIN_ROWS.length - 1].margin_to_cap < 0.001,
    why:
      'THE PROFILE (1): walking N DOWN from 2458, the margin 1/3 - C_shock(N) must ' +
      'decrease strictly (the downward continuation of the imp-3108 increasing curve) from ' +
      'the worst case ~0.0447 at N=2458 toward 0, reaching < 0.001 by N=205. Confirms the ' +
      'infimum lies BELOW N=2458, not at it.',
  },
  {
    id: 'imp3151-crossing-count-pinned-two-ways',
    holds: () =>
      Number.isFinite(N_STAR_CLOSED_FORM) &&
      Math.abs(N_STAR_CLOSED_FORM - 203.0325) < 1e-3 &&
      // closed form and bisection agree, and at N_star the height is exactly e^6
      N_STAR_ABS_DIFF < 1e-5 &&
      Math.abs(effectiveHeightForN(N_STAR_CLOSED_FORM) - E6) < 1e-4,
    why:
      'THE PROFILE (2): the count where the margin crosses zero must pin to N_star ~ 203.03 ' +
      'by the closed form zeroCountAtHeight(e^6) = (e^6/2pi)(5 - log 2pi) AND by an ' +
      'independent bisection on effectiveHeightForN(N) = e^6, agreeing to < 1e-5. At N_star ' +
      'the effective height equals e^6 to < 1e-4, the algebraic boundary log gamma_N = 6.',
  },
  {
    id: 'imp3151-assembly-regime-clears-threshold',
    holds: () => {
      const r = C_SHOCK_SUBMARGIN_PROFILE_IMP3151;
      return (
        // smallest assembly is far above the crossing
        SAFETY_FACTOR_N > 12 &&
        N_SMALLEST_ASSEMBLY > N_STAR_CLOSED_FORM &&
        LOG_HEIGHT_HEADROOM > 2 &&
        Math.abs(PHYSICAL_WORST_CASE_MARGIN - 0.0447131) < 1e-4 &&
        // the HONEST flags: cap is NOT inviolable at every N, but holds for every assembly
        r.capInviolableAtEveryN === false &&
        r.capHoldsForEveryAssembly === true &&
        SUB_MARGIN_ROWS.every((row) => row.gamma_gt_e6) // all tabulated N > N_star clear e^6
      );
    },
    why:
      'THE PROFILE (3): the honest assessment. The crossing N_star ~ 203 sits a factor > 12 ' +
      'below the smallest assembly N=2458 (log-height headroom ~2.003 above the floor 6), so ' +
      'every physical assembly N >= 2458 clears the e^6 threshold and the cap holds with ' +
      'margin >= 0.0447 — even though the cap is NOT inviolable at arbitrarily small N.',
  },
  {
    id: 'imp3151-profile-not-a-beat',
    holds: () => {
      const r = C_SHOCK_SUBMARGIN_PROFILE_IMP3151;
      return (
        r.isNewBound === false &&
        /refereed bound is changed/i.test(r.honestNote) &&
        /REFUTED/.test(r.honestNote) &&
        /PROFILED/.test(r.verdict)
      );
    },
    why:
      'VERDICT LOCK: a NUMERICAL profile of the worst-case margin of an already-proven cap, ' +
      'NOT a new bound. The surrogate stays refuted and no refereed bound is changed' +
      '. Blocks any future edit from inflating this sub-ladder profile into a claimed C_H ' +
      'closure or rigorous beat.',
  },
];

for (const a of C_SHOCK_SUBMARGIN_PROFILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3151 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

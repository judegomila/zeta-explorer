/**
 * @module imp-34187-ecoll-residual-milestone-ladder
 *
 * imp-34187 (numerical, frontier-direction): imp-34130 (F3) established that the SEPARATED
 * E_coll local-exponent residual to -1/2, resid(N) = q(N) + 1/2, KEEPS CLOSING toward zero as
 * N grows (it does NOT floor), decaying as ~1/(2 log T0) -- the identical law governing the
 * sigma-share exponent (imp-33816). imp-34130 quoted approximate landmarks in prose ("below
 * 1e-3 near N ~ 1e230", "below 1e-5 near N ~ 1e42000") but never TABULATED the milestone
 * crossings as a landmark ladder the way imp-33582/imp-33723 tabulated the sigma-decay
 * landmarks. imp-34198 (a viz) refined the FOUR decade crossings (1e-2, 1e-3, 1e-4, 1e-5);
 * this module completes a FINER SEVEN-RUNG ladder -- adding the intermediate half-decade
 * thresholds 3e-3, 3e-4, 3e-5 -- and, for each rung, CROSS-CHECKS the bisected crossing
 * against the closed-form resid ~ 1/(2 log T0) inverse.
 *
 * THE QUANTITY (identical inherited imp-3220/imp-3406/imp-33816 sub-term, per imp-34130)
 * -------------------------------------------------------------------------------------
 *     E_coll(N) = C_C sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 * Its local exponent in ln N is q(N) = d ln E_coll / d ln N = -1/2 + (1/2) d ln(log T0)/d ln N,
 * so the residual to -1/2 is resid(N) = q(N) + 1/2 = (1/2) d ln(log T0)/d ln N >= 0. With
 * u = log(T0/2pi) the Riemann-von Mangoldt inverse gives ln N = u + log(u-1), whence
 *     d(log T0)/d ln N = (u-1)/u   and   resid(N) = (1/2)(u-1)/(u log T0) ~ 1/(2 log T0).
 * This module evaluates the residual on the imp-33859 LOG-SPACE DIRECT PATH (ln N = u + log(u-1)
 * solved by Newton, never forming T0 or N), so it reaches log10(N) ~ 2e4 far past IEEE range.
 * It is import-light: the C_C normalization CANCELS in the local-exponent derivative (per
 * [[no_heavy_imports_in_pages]]), so the Newton solve alone reproduces the imp-34130 numbers.
 *
 * THE CLOSED-FORM INVERSE (the cross-check)
 * -----------------------------------------
 * The leading-order law resid ~ 1/(2 log T0) inverts to log T0 = 1/(2 resid); feeding that back
 * through u = log T0 - log(2pi) and ln N = u + log(u-1) predicts the crossing log10(N). Because
 * the closed form DROPS the finite-N (u-1)/u factor, it slightly OVER-predicts log T0 (hence
 * log10 N); the ratio cf_log10N / measured_log10N therefore approaches 1 FROM ABOVE as the
 * threshold tightens and (u-1)/u -> 1.
 *
 * THE FINDING (tabulation + cross-check only)
 * -------------------------------------------
 *   (F1) THE SEVEN-RUNG MILESTONE LADDER. The residual first falls below each threshold at a
 *        strictly increasing log10(N): 1e-2 at ~22.12 (log T0 ~ 48.9), 3e-3 at ~73.35 (~165.6),
 *        1e-3 at ~218.61 (~499.0), 3e-4 at ~725.81 (~1665.7), 1e-4 at ~2173.94 (~4999.0),
 *        3e-5 at ~7241.23 (~16665.7), 1e-5 at ~21718.19 (~50000.0). The decade rungs reproduce
 *        the imp-34198 crossings (22.12 / 218.61 / 2173.93 / 21723) -- the 1e-5 rung tightens the
 *        viz FD-noise-limited 21723.01 to the analytic 21718.19. At every rung log T0 * resid
 *        sits within 0.011 of 0.5 (0.48938 at 1e-2 -> 0.49999 at 1e-5), confirming resid ~ 1/(2 log T0).
 *   (F2) THE CLOSED-FORM INVERSE TRACKS EACH CROSSING, RATIO -> 1 FROM ABOVE. The closed-form
 *        prediction log T0 = 1/(2 thr) reproduces the crossing log10(N) with a ratio that
 *        collapses monotonically 1.02129 (1e-2) -> 1.00606 -> 1.00200 -> 1.00060 -> 1.00020 ->
 *        1.00006 -> 1.00002 (1e-5), i.e. the finite-N (u-1)/u shortfall relaxes exactly as the
 *        law predicts -- a direct confirmation the landmark ladder rides the 1/(2 log T0) curve.
 *
 * MEASUREMENT / TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the source: residual CLOSES, ~1/(2 log T0), no floor)
 * @see imp-34198-ecoll-residual-milestone-ladder-viz-data (the four decade crossings; this refines to seven rungs)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the sigma-share exponent gap ~ 1/(2 log T0); same law)
 * @see imp-33723 / imp-33582 (the sigma-decay landmark-ladder tabulation convention this mirrors)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 */

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote; E_coll local exponent -> -1/2 from above

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton,
// never forming T0 or N (reaches log10 N ~ 2e4 far past IEEE-double range).
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 100; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-15 * Math.max(1, u)) break;
  }
  return u;
}
const logT0FromLnN = (lnN) => uFromLnN(lnN) + Math.log(TWO_PI); // L = log T0 = u + log(2pi)

// resid(N) = (1/2)(u-1)/(u log T0), the imp-34130 closed form (C_C cancels; exact, no FD noise).
function residAnalyticFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + Math.log(TWO_PI);
  return HALF * (u - 1) / (u * L);
}
const residFromLog10N = (d) => residAnalyticFromLnN(d * Math.LN10);

// imp-34130 FD cross-path (log(C_C) drops in the central difference) -- for the model gate below.
function residFDFromLnN(lnN) {
  const dl = 1e-3;
  const f = (x) => 0.5 * Math.log(logT0FromLnN(x)) - 0.5 * x;
  return (f(lnN + dl) - f(lnN - dl)) / (2 * dl) + HALF;
}

// Smallest log10(N) at which resid(N) first falls below thr (resid strictly decreasing in log10 N).
function crossingLog10N(thr) {
  let lo = 11;
  let hi = 1e6;
  for (let i = 0; i < 300; i++) {
    const mid = 0.5 * (lo + hi);
    if (residFromLog10N(mid) > thr) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Closed-form inverse of resid ~ 1/(2 log T0): log T0 = 1/(2 thr), then invert through the RvM law.
function closedFormInverse(thr) {
  const L = 1 / (2 * thr);
  const u = L - Math.log(TWO_PI);
  const lnN = u + Math.log(u - 1);
  return { cf_logT0: L, cf_log10N: lnN / Math.LN10 };
}

// imp-34130 (F2)/(F3) closed-form reference law, exposed for cross-checking downstream.
export function residLawAtLogT0(logT0) {
  return 1 / (2 * logT0);
}

const THRESHOLDS = [1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5];

// (F1)+(F2) the seven-rung milestone ladder with the closed-form cross-check per rung.
const MILESTONE_LADDER = THRESHOLDS.map((thr) => {
  const log10N = crossingLog10N(thr);
  const L = logT0FromLnN(log10N * Math.LN10);
  const resid = residFromLog10N(log10N);
  const cf = closedFormInverse(thr);
  return {
    threshold: +thr.toExponential(0),
    log10N: +log10N.toFixed(2),
    logT0: +L.toFixed(2),
    residAtCrossing: +resid.toExponential(4), // == threshold (bisection target)
    logT0_times_resid: +(L * resid).toFixed(5), // -> 0.5 (confirms resid ~ 1/(2 log T0))
    cf_logT0: +cf.cf_logT0.toFixed(2), // closed-form 1/(2 thr)
    cf_log10N: +cf.cf_log10N.toFixed(2), // closed-form crossing prediction
    cf_over_measured: +(cf.cf_log10N / log10N).toFixed(5), // -> 1 from above as (u-1)/u relaxes
  };
});

// Model-consistency gate: the analytic residual == the imp-34130 FD path at the 1e-3 crossing.
const MODEL_GATE_FD_VS_ANALYTIC_AT_1e3 = (() => {
  const lnN = MILESTONE_LADDER[2].log10N * Math.LN10;
  return Math.abs(residFDFromLnN(lnN) - residAnalyticFromLnN(lnN));
})();

export const IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER = {
  id: 'imp-34187',
  proofSection: 'S-frontier',
  question:
    'imp-34130 (F3) reports the separated E_coll local-exponent residual to -1/2 keeps closing as ' +
    '~1/(2 log T0), falling below 1e-3 near N ~ 1e230 and below 1e-5 near N ~ 1e42000, but never ' +
    'tabulated those milestone N-values as a landmark ladder (as imp-33582/imp-33723 did for the ' +
    'sigma-decay landmarks). Tabulate the log10(N) and log T0 at which the residual first crosses ' +
    '1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5 on the imp-33859 log-space direct path, cross-checking ' +
    'each against the closed-form resid ~ 1/(2 log T0) inverse. Measurement/tabulation only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'separated E_coll = C_C sqrt(log T0 / N); the smallest log10(N) at which the residual to -1/2, ' +
    'resid(N) = q + 1/2 = (1/2)(u-1)/(u log T0), first falls below each of seven thresholds ' +
    '{1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5}, plus the closed-form 1/(2 log T0) inverse per rung',
  milestoneLadder: MILESTONE_LADDER,
  closedFormLaw: 'resid(N) ~ 1/(2 log T0)  =>  crossing at log T0 = 1/(2 thr), inverted via ln N = u + log(u-1)',
  modelGate_FD_vs_analytic_residual_at_1e3: +MODEL_GATE_FD_VS_ANALYTIC_AT_1e3.toExponential(3), // ~0
  farTailExponent: -HALF, // imp-3463 asymptote the local exponent q(N) approaches from above
  finding: {
    F1_seven_rung_milestone_ladder:
      'The residual first falls below each threshold at a strictly increasing log10(N): 1e-2 at ' +
      '~22.12 (log T0 ~ 48.9), 3e-3 at ~73.35 (~165.6), 1e-3 at ~218.61 (~499.0), 3e-4 at ~725.81 ' +
      '(~1665.7), 1e-4 at ~2173.94 (~4999.0), 3e-5 at ~7241.23 (~16665.7), 1e-5 at ~21718.19 ' +
      '(~50000.0). The decade rungs reproduce the imp-34198 crossings; the 1e-5 rung tightens the ' +
      'viz FD-noise-limited 21723.01 to the analytic 21718.19. log T0 * resid stays within 0.011 of ' +
      '0.5 at every rung (0.48938 at 1e-2 -> 0.49999 at 1e-5), confirming resid ~ 1/(2 log T0) out to log10 N ~ 2e4.',
    F2_closed_form_inverse_ratio_to_one_from_above:
      'The closed-form prediction log T0 = 1/(2 thr) reproduces each crossing log10(N) with a ratio ' +
      'cf/measured that collapses monotonically FROM ABOVE 1.02129 (1e-2) -> 1.00606 -> 1.00200 -> ' +
      '1.00060 -> 1.00020 -> 1.00006 -> 1.00002 (1e-5) as the finite-N (u-1)/u shortfall relaxes -- ' +
      'a direct confirmation the landmark ladder rides the 1/(2 log T0) curve.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / TABULATION (frontier-direction, NOT rigorous). The imp-34130 separated E_coll ' +
    'local-exponent residual-to-(-1/2) milestone ladder, now tabulated at seven thresholds on the ' +
    'imp-33859 log-space direct path: resid first drops below 1e-2 at log10 N ~ 22.12, below 1e-3 at ' +
    '~218.61, below 1e-5 at ~21718.19, with the intermediate half-decade rungs (3e-3 at ~73.35, ' +
    '3e-4 at ~725.81, 3e-5 at ~7241.23) filling the ladder; log T0 = 1/(2 resid) exactly, so the ' +
    'crossing log T0 doubles with each threshold decade (48.9 -> 499.0 -> 4999.0 -> 50000). The ' +
    'closed-form 1/(2 log T0) inverse reproduces every crossing with a ratio collapsing to 1 from ' +
    'above (1.02129 -> 1.00002) as the finite-N (u-1)/u factor relaxes. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34130 (separated E_coll residual CLOSES as ~1/(2 log T0), no floor); imp-34198 (the four ' +
    'decade crossings, refined here to seven rungs); imp-33816 (sigma-share exponent gap ~ 1/(2 log T0), ' +
    'same law); imp-33723/imp-33582 (sigma-decay landmark-ladder convention); imp-33859 (log-space ' +
    'direct path ln N = u + log(u-1)); imp-3463 (far-tail exponent -> -1/2 from above); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER_ASSERTIONS = [
  {
    // (F1) reuse gate: the decade rungs reproduce the imp-34198 crossings (22.12 / 218.61 / 2173.93),
    // proving the identical inherited separated-E_coll model and log-space path are in use.
    id: 'imp34187-reproduces-imp34198-decade-crossings',
    description: 'decade crossings reproduce imp-34198: 1e-2@~22.12, 1e-3@~218.61, 1e-4@~2173.93',
    holds: () =>
      Math.abs(MILESTONE_LADDER[0].log10N - 22.12) < 0.05 &&
      Math.abs(MILESTONE_LADDER[2].log10N - 218.61) < 0.05 &&
      Math.abs(MILESTONE_LADDER[4].log10N - 2173.93) < 0.05,
  },
  {
    // (F1) the seven-rung ladder is strictly increasing in log10(N): 1e-2 loosest, 1e-5 tightest,
    // with the half-decade rungs strictly interleaved between the decades.
    id: 'imp34187-seven-rung-ladder-strictly-increasing',
    description: 'seven crossings strictly increasing in log10(N) (threshold strictly decreasing)',
    holds: () => {
      if (MILESTONE_LADDER.length !== 7) return false;
      for (let i = 1; i < MILESTONE_LADDER.length; i++) {
        if (!(MILESTONE_LADDER[i].log10N > MILESTONE_LADDER[i - 1].log10N)) return false;
        if (!(MILESTONE_LADDER[i].threshold < MILESTONE_LADDER[i - 1].threshold)) return false;
      }
      return true;
    },
  },
  {
    // (F1) at every rung the residual equals its threshold and log T0 * resid sits within 1.1% of 0.5,
    // confirming the crossings ride the resid ~ 1/(2 log T0) curve.
    id: 'imp34187-crossings-track-half-law',
    description: 'each rung: resid == threshold and log T0 * resid within 0.011 of 0.5',
    holds: () =>
      MILESTONE_LADDER.every(
        (r) =>
          Math.abs(r.residAtCrossing - r.threshold) / r.threshold < 1e-3 &&
          Math.abs(r.logT0_times_resid - HALF) < 1.15e-2,
      ),
  },
  {
    // (F2) the closed-form 1/(2 log T0) inverse reproduces every crossing with a ratio that
    // collapses to 1 STRICTLY FROM ABOVE (finite-N (u-1)/u shortfall relaxes monotonically).
    id: 'imp34187-closed-form-inverse-ratio-to-one-from-above',
    description: 'cf/measured ratio > 1 at every rung, strictly decreasing toward 1, tightest rung within 1e-4',
    holds: () => {
      for (const r of MILESTONE_LADDER) {
        if (!(r.cf_over_measured > 1)) return false;
      }
      for (let i = 1; i < MILESTONE_LADDER.length; i++) {
        if (!(MILESTONE_LADDER[i].cf_over_measured < MILESTONE_LADDER[i - 1].cf_over_measured)) return false;
      }
      return Math.abs(MILESTONE_LADDER[MILESTONE_LADDER.length - 1].cf_over_measured - 1) < 1e-4;
    },
  },
  {
    // model gate: the imp-34130 FD residual path == this analytic path at the 1e-3 crossing (same model).
    id: 'imp34187-fd-vs-analytic-model-gate',
    description: 'imp-34130 FD residual == analytic (u-1)/(u log T0) residual at the 1e-3 crossing (< 1e-9)',
    holds: () => MODEL_GATE_FD_VS_ANALYTIC_AT_1e3 < 1e-9,
  },
  {
    // honesty gate: tabulation only, far-tail exponent = -1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp34187-honesty-gate-no-qed',
    description: 'Tabulation only: far-tail exponent = -1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER.isRigorous === false &&
      IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER.farTailExponent === -0.5 &&
      /NO QED/.test(IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER.verdict) &&
      /remains SOTA/.test(IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER.verdict),
  },
];

for (const a of IMP34187_ECOLL_RESIDUAL_MILESTONE_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34187-ecoll-residual-milestone-ladder assertion failed: ${a.id}`);
  }
}

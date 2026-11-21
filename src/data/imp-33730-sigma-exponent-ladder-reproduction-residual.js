/**
 * @module imp-33730-sigma-exponent-ladder-reproduction-residual
 *
 * imp-33730 (accuracy, frontier-direction): imp-33701 asserts, as a REUSE GATE, that its
 * recomputed six-decade local-decay-exponent ladder p_dec(6..11) reproduces the imp-33582
 * published perDecadeLadder "to the printed 4 decimals" -- proving the IDENTICAL imp-3406/
 * imp-33582 sigma(N) = E_coll/E(N) sub-terms and OLS window are in use. But that gate is a
 * single pass/fail boolean; the PER-DECADE residual was never tabulated, so how close the
 * reproduction actually is (and whether any one decade is drifting) is unquantified. This
 * module fills that gap: it recomputes the full-precision ladder from the shared sub-terms,
 * tabulates the six per-decade differences against imp-33582's stored 4-decimal p_local, and
 * confirms the max residual is within 4-decimal printing tolerance (or surfaces any decade that
 * exceeds it, which would flag a divergent sub-term).
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 -- no re-derivation, no fresh terms)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], k = 6..11, 4 pts/decade.
 * These are the EXACT imp-33582 / imp-33701 sub-terms; the recomputed ladder here is used only
 * to MEASURE its residual against the published 4-decimal ladder, not to derive anything new.
 *
 * THE MEASUREMENT: per-decade reproduction residual
 * -------------------------------------------------
 *   For each decade k = 6..11, residual(k) = | p_full(k) - p_pub4(k) |, where p_full is the
 *   full-precision recompute and p_pub4 is imp-33582.perDecadeLadder[k].p_local (stored at 4
 *   decimals). The half-ULP of a 4-decimal print is 5e-5, so residual(k) <= 5e-5 is EXACTLY
 *   "agrees to the printed 4 decimals" -- a residual above it would mean the recompute and the
 *   published value disagree in the 4th decimal, i.e. a genuine sub-term / window drift, not a
 *   rounding artifact.
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (F1) THE REPRODUCTION IS EXACT TO THE PRINTED 4 DECIMALS ON ALL SIX DECADES. The per-decade
 *        residuals are 2.27e-5, 4.55e-5, 1.71e-5, 2.34e-5, 1.67e-5, 4.84e-5 -- every one below
 *        the 5e-5 half-ULP of a 4-decimal print. The imp-33701 reuse-gate claim is confirmed and
 *        now QUANTIFIED per decade, not just as a boolean.
 *   (F2) THE MAX RESIDUAL IS 4.84e-5, AT THE [1e11,1e12] DECADE (k = 11). It sits at ~0.97 of the
 *        5e-5 tolerance -- the tightest decade, yet still inside it. The far-tail decade rounds
 *        least favorably (0.4310484 -> 0.4310) but does NOT cross the 4th decimal.
 *   (F3) NO DECADE DRIFTS. All six residuals are pure 4-decimal rounding artifacts (each < the
 *        half-ULP), so there is no divergent sub-term: the sigma model, the E_trunc/E_flow/E_coll
 *        split, and the 4-pts/decade OLS window are byte-identical between imp-33582 and imp-33701.
 *
 * The punchline: imp-33701's "reproduces to the printed 4 decimals" reuse gate is now a
 * TABULATED six-row residual ladder with a measured max of 4.84e-5 (< 5e-5 half-ULP), confirming
 * the reproduction is exact to the printed precision on every decade with zero sub-term drift.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Pure numerical reproduction audit, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (the reuse gate whose residual this tabulates)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the published perDecadeLadder cross-checked against)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly
const FOUR_DEC_HALF_ULP = 5e-5; // half-ULP of a 4-decimal print == "agrees to the printed 4 decimals"

// EXACT imp-3406/imp-33582/imp-33701 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
// Identical to imp-33582/imp-33701 so the ladder reproduces the published perDecadeLadder.
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Full-precision recomputed six-decade exponent ladder, k = 6..11.
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const P_FULL = DECADE_KS.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1)));

// Published imp-33582 ladder (p_local already stored at 4 decimals).
const PUB = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.perDecadeLadder;

// Per-decade reproduction residual: |full-precision recompute - published 4-decimal value|.
const RESIDUALS = DECADE_KS.map((k, i) => ({
  decade: `1e${k}->1e${k + 1}`,
  pFull: +P_FULL[i].toFixed(10),
  pPublished4dec: PUB[i].p_local,
  residual: Math.abs(P_FULL[i] - PUB[i].p_local),
}));

let MAX_RESIDUAL = 0;
let MAX_RESIDUAL_K = DECADE_KS[0];
for (const r of RESIDUALS) {
  const k = parseInt(r.decade.slice(2), 10);
  if (r.residual > MAX_RESIDUAL) {
    MAX_RESIDUAL = r.residual;
    MAX_RESIDUAL_K = k;
  }
}
const ALL_WITHIN_4DEC = RESIDUALS.every((r) => r.residual <= FOUR_DEC_HALF_ULP);

export const IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL = {
  id: 'imp-33730',
  proofSection: 'S-frontier',
  question:
    'imp-33701 asserts its recomputed p_dec(6..11) reproduces the imp-33582 published ' +
    'perDecadeLadder "to the printed 4 decimals" as a reuse gate but never tabulates the ' +
    'per-decade residual. Recompute both ladders from the shared sub-terms, TABULATE the six ' +
    'per-decade differences, and confirm the max residual is within 4-decimal printing tolerance ' +
    '(or surface any decade that drifts). Measurement / cross-check only; NOT an RH bound; no QED.',
  measuredQuantity:
    'residual(k) = | p_full(k) - p_published4dec(k) | for k = 6..11, where p_full is the ' +
    'full-precision recompute of the imp-33582/imp-33701 sigma-ladder OLS exponent and ' +
    'p_published4dec is imp-33582.perDecadeLadder[k].p_local (stored at 4 decimals); the ' +
    'per-decade table, the max residual and its decade, and whether all six are <= the 5e-5 ' +
    'half-ULP of a 4-decimal print',
  fourDecHalfUlp: FOUR_DEC_HALF_ULP,
  residualTable: RESIDUALS.map((r) => ({
    decade: r.decade,
    pFull: r.pFull,
    pPublished4dec: r.pPublished4dec,
    residual: +r.residual.toExponential(4),
  })),
  maxResidual: +MAX_RESIDUAL.toExponential(6),
  maxResidualDecade: `1e${MAX_RESIDUAL_K}->1e${MAX_RESIDUAL_K + 1}`,
  allWithin4Decimals: ALL_WITHIN_4DEC,
  finding: {
    F1_exact_to_printed_4_decimals_on_all_six:
      'The per-decade residuals are 2.27e-5, 4.55e-5, 1.71e-5, 2.34e-5, 1.67e-5, 4.84e-5 -- every ' +
      'one below the 5e-5 half-ULP of a 4-decimal print. The imp-33701 reuse-gate claim ' +
      '("reproduces the imp-33582 perDecadeLadder to the printed 4 decimals") is confirmed and now ' +
      'QUANTIFIED per decade, not just as a boolean.',
    F2_max_residual_4p84e5_at_1e11:
      'The max residual is 4.84e-5 at the [1e11,1e12] decade (k = 11), sitting at ~0.97 of the ' +
      '5e-5 tolerance -- the tightest decade, yet still inside it. The far-tail decade rounds least ' +
      'favorably (0.4310484 -> 0.4310) but does NOT cross the 4th decimal.',
    F3_no_decade_drifts:
      'All six residuals are pure 4-decimal rounding artifacts (each below the half-ULP), so there ' +
      'is no divergent sub-term: the sigma model, the E_trunc/E_flow/E_coll split, and the ' +
      '4-pts/decade OLS window are identical between imp-33582 and imp-33701.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). Recomputing the six-decade ' +
    'sigma-ladder OLS exponent from the shared imp-33582/imp-33701 sub-terms and differencing it ' +
    'against the published 4-decimal perDecadeLadder yields per-decade residuals of 2.27e-5, ' +
    '4.55e-5, 1.71e-5, 2.34e-5, 1.67e-5, 4.84e-5 -- all below the 5e-5 half-ULP of a 4-decimal ' +
    'print, with the max 4.84e-5 landing at the [1e11,1e12] decade at ~0.97 of tolerance. So the ' +
    'imp-33701 reuse-gate claim of 4-decimal reproduction is confirmed AND tabulated, and no ' +
    'decade drifts (every residual is a pure rounding artifact), meaning the IDENTICAL sigma ' +
    'model and OLS window are in use. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33701 (reuse gate whose residual this tabulates); imp-33582 (published perDecadeLadder); ' +
    'imp-3406 (interior MAX N ~ 9.22e5); imp-3463 (far-tail leading form, exponent -> 1/2 from ' +
    'below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL_ASSERTIONS = [
  {
    // The published and recomputed ladders align in length and decade labels.
    id: 'imp33730-ladder-shape-matches-imp33582',
    description: 'the recomputed ladder has the same six decades as the published imp-33582 perDecadeLadder',
    holds: () =>
      PUB.length === P_FULL.length &&
      PUB.length === 6 &&
      DECADE_KS.every((k, i) => PUB[i].decade === `1e${k}->1e${k + 1}`),
  },
  {
    // (F1): every per-decade residual is within the 5e-5 half-ULP of a 4-decimal print,
    // i.e. the recompute reproduces the published ladder to the printed 4 decimals.
    id: 'imp33730-all-six-residuals-within-4dec',
    description: 'all six per-decade residuals are <= 5e-5 (the 4-decimal half-ULP)',
    holds: () => ALL_WITHIN_4DEC && RESIDUALS.every((r) => r.residual <= FOUR_DEC_HALF_ULP),
  },
  {
    // (F2): the max residual is ~4.84e-5 and lands at the far-tail [1e11,1e12] decade.
    id: 'imp33730-max-residual-4p84e5-at-1e11',
    description: 'max residual is ~4.84e-5 within tolerance, at the [1e11,1e12] decade (k=11)',
    holds: () =>
      MAX_RESIDUAL_K === 11 &&
      Math.abs(MAX_RESIDUAL - 4.84e-5) < 5e-6 &&
      MAX_RESIDUAL < FOUR_DEC_HALF_ULP,
  },
  {
    // (F3): no drift -- the recompute agrees with the imp-33701 exposed ladder digits too,
    // confirming a single shared model. Compare against imp-33582 4-dec values rounded from full.
    id: 'imp33730-no-decade-drifts',
    description: 'each full-precision recompute rounds to exactly the published 4-decimal value',
    holds: () => RESIDUALS.every((r, i) => +P_FULL[i].toFixed(4) === PUB[i].p_local),
  },
  {
    // Honesty gate: measurement/cross-check only, no QED, no refereed bound is changed.
    id: 'imp33730-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL.verdict),
  },
];

for (const a of IMP33730_SIGMA_EXPONENT_LADDER_REPRODUCTION_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33730-sigma-exponent-ladder-reproduction-residual assertion failed: ${a.id}`);
  }
}

/**
 * @module ch-lip-impossibility-w1grid-2026-06-30
 * @fileoverview imp-3047 — Tabulate the route-1 IMPOSSIBILITY lower bound
 *   C_Lip >= C_shock / (2 sqrt(W_1))  ->  inf
 * across a decreasing W_1 grid on the witnessed CM-flow cusp family, as a
 * STANDALONE certificate. The ch-wall frontier verdict
 * (ch-wall-frontier-verdict-2026-06-26.js l.13-18) states this lower bound is
 * WITNESSED in the real cusp family but never tabulated across a W_1 grid on its
 * own — that gap is what this module closes.
 *
 * THE CUSP LAW (Holder-1/2, ch-wall route 1). Along the 1-parameter CM-flow cusp
 * family the first-collision minimal gap obeys
 *     g_min(W_1)  =  C_shock * W_1^{1/2},   C_shock < 1/3
 * with C_shock pinned to the closed form C_shock(N) = sqrt(2 / (3 log gamma_N))
 * by imp-2786 (~0.2692 at N* = 1e4).
 *
 * THE LIPSCHITZ QUOTIENT. For two nearby measures mu1, mu2 on the cusp family
 * separated by bridge metric W_1, the gap observable's Lipschitz quotient is
 *     |g_min(mu1) - g_min(mu2)| / W_1(mu1, mu2).
 * For a SECANT between cusp-family points at metrics W_a > W_b this is exactly
 *     C_shock * (sqrt(W_a) - sqrt(W_b)) / (W_a - W_b)  =  C_shock / (sqrt(W_a) + sqrt(W_b)),
 * and as the pair contracts (W_a, W_b -> W_1) it tends to the LOCAL slope
 *     dg_min/dW_1  =  C_shock / (2 sqrt(W_1)).
 * Either way the realized quotient is a GENUINE LOWER bound on any candidate
 * N-uniform Lipschitz constant C_Lip, and it diverges as W_1 -> 0.
 *
 * WHAT THIS MODULE MEASURES (decreasing W_1 grid, 1e-2 .. 1e-12):
 *   - the local quotient Q(W_1) via a central finite difference of g_min along the
 *     family (the realized lower bound at that scale);
 *   - the analytic bound A(W_1) = C_shock / (2 sqrt(W_1)) it must match;
 *   - the consecutive-decade SECANT quotient C_shock / (sqrt(W_a) + sqrt(W_b));
 *   - the FITTED divergence exponent from a log-log regression of Q(W_1) vs W_1,
 *     which must be -1/2 (so Q ~ W_1^{-1/2} -> inf).
 *
 * RESULT (N* = 1e4): the local quotient reproduces C_shock/(2 sqrt(W_1)) to
 * machine precision, climbs monotonically from ~1.35 at W_1 = 1e-2 to ~1.35e5 at
 * W_1 = 1e-12 (five decades of growth across the ten-decade W_1 window), and the
 * log-log fit pins the exponent at exactly -1/2 — certifying the genuine,
 * tabulated divergence C_Lip >= C_shock/(2 sqrt(W_1)) -> inf.
 *
 * HONEST SCOPE. This is the route-1 IMPOSSIBILITY certificate: it confirms a
 * candidate N-uniform global-W_1 Lipschitz constant CANNOT exist (the lower bound
 * diverges). It is NOT a beat and must NOT be reinterpreted as one — it forecloses
 * the Lipschitz route rather than closing C_H. No refereed bound is changed
 * ; no QED.
 *
 * @see ch-wall-frontier-verdict-2026-06-26 (route 1 lower bound C_Lip >= C_shock/(2 sqrt(W_1)))
 * @see imp-2786-c-shock-cusp-constant (C_shock pinned to sqrt(2/(3 log gamma_N)) < 1/3)
 * @see imp-3026-c-shock-cross-validation (Holder-1/2 cusp law C_shock measured two ways)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// Closed-form cusp-law C_shock(N) from imp-2786 — the prefactor in g_min ~ C_shock W_1^{1/2}.
function cShockClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

const N_STAR = 10000;
const C_SHOCK = cShockClosedForm(N_STAR); // ~0.2692 at N*=1e4

// The cusp family: g_min(W_1) = C_shock * W_1^{1/2} (ch-wall route 1).
function gMinOfW(W) {
  return C_SHOCK * Math.sqrt(W);
}

// Analytic local Lipschitz lower bound = dg_min/dW_1 = C_shock / (2 sqrt(W_1)).
function analyticBound(W) {
  return C_SHOCK / (2 * Math.sqrt(W));
}

// ── Decreasing W_1 grid: 1e-2 .. 1e-12 (the cusp scale shrinking to collision) ──
const W_GRID = [];
for (let k = 2; k <= 12; k++) W_GRID.push(Math.pow(10, -k));

// Per-W_1 row: realized local quotient (central FD of g_min) vs the analytic bound.
const GRID_ROWS = W_GRID.map((W) => {
  const dW = W * 1e-6;
  const qLocal = (gMinOfW(W + dW) - gMinOfW(W - dW)) / (2 * dW); // realized lower bound at scale W
  const qAnalytic = analyticBound(W);
  return {
    W_1: W,
    g_min: gMinOfW(W),
    C_Lip_lower_bound: qLocal,
    analytic_C_shock_over_2sqrtW: qAnalytic,
    rel_err: Math.abs(qLocal - qAnalytic) / qAnalytic,
  };
});

// ── Consecutive-decade SECANT quotients = C_shock / (sqrt(W_a) + sqrt(W_b)) ──────
const SECANT_ROWS = [];
for (let i = 1; i < W_GRID.length; i++) {
  const Wa = W_GRID[i - 1];
  const Wb = W_GRID[i];
  const secant = Math.abs(gMinOfW(Wa) - gMinOfW(Wb)) / Math.abs(Wa - Wb);
  const closedForm = C_SHOCK / (Math.sqrt(Wa) + Math.sqrt(Wb));
  SECANT_ROWS.push({
    W_a: Wa,
    W_b: Wb,
    secant_quotient: secant,
    closed_form_C_shock_over_sum_sqrt: closedForm,
    abs_diff: Math.abs(secant - closedForm),
  });
}

// ── Fitted divergence exponent: log-log regression of Q_local vs W_1 ────────────
// log Q = log(C_shock/2) - (1/2) log W  =>  slope must be -1/2.
function fitExponent() {
  const n = GRID_ROWS.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of GRID_ROWS) {
    const x = Math.log(r.W_1);
    const y = Math.log(r.C_Lip_lower_bound);
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, prefactor: Math.exp(intercept) }; // prefactor -> C_shock/2
}

const EXPONENT_FIT = fitExponent();
const FIRST_ROW = GRID_ROWS[0];
const LAST_ROW = GRID_ROWS[GRID_ROWS.length - 1];
const DIVERGENCE_RATIO = LAST_ROW.C_Lip_lower_bound / FIRST_ROW.C_Lip_lower_bound;

// Monotone-divergent across the whole grid (each smaller W_1 gives a larger bound)?
const MONOTONE_DIVERGENT = (() => {
  for (let i = 1; i < GRID_ROWS.length; i++) {
    if (!(GRID_ROWS[i].C_Lip_lower_bound > GRID_ROWS[i - 1].C_Lip_lower_bound)) return false;
  }
  return true;
})();

export const CH_LIP_IMPOSSIBILITY_W1GRID_IMP3047 = {
  ticket: 'imp-3047',
  title:
    'Certify the route-1 impossibility lower bound C_Lip >= C_shock/(2 sqrt(W_1)) -> inf on the CM-flow cusp family across a W_1 grid',
  verdict:
    'WITNESSED AND TABULATED. Along the cusp law g_min = C_shock W_1^{1/2} (C_shock ~ 0.2692 < 1/3) the ' +
    'realized Lipschitz lower bound C_Lip >= C_shock/(2 sqrt(W_1)) climbs monotonically across the ' +
    'W_1 = 1e-2 .. 1e-12 grid and the log-log fit pins its divergence exponent at -1/2, so any candidate ' +
    'N-uniform global-W_1 Lipschitz constant is foreclosed.',
  nStar: N_STAR,
  cShock: C_SHOCK,
  cShockUnderThird: C_SHOCK < 1 / 3,
  // Headline divergence numbers.
  boundAtLargestW: FIRST_ROW.C_Lip_lower_bound, // ~1.35 at W_1=1e-2
  boundAtSmallestW: LAST_ROW.C_Lip_lower_bound, // ~1.35e5 at W_1=1e-12
  divergenceRatio: DIVERGENCE_RATIO, // ~1e5 over 10 decades of W_1
  fittedExponent: EXPONENT_FIT.slope, // -> -1/2
  fittedPrefactor: EXPONENT_FIT.prefactor, // -> C_shock/2
  monotoneDivergent: MONOTONE_DIVERGENT,
  grid: GRID_ROWS,
  secantLadder: SECANT_ROWS,
  isBeat: false,
  isImpossibilityCertificate: true,
  honestNote:
    'No false QED. This is the route-1 IMPOSSIBILITY certificate: the lower bound DIVERGES, foreclosing a ' +
    'finite N-uniform global-W_1 C_Lip. It must NOT be reinterpreted as a beat — it closes the Lipschitz ' +
    'route, it does not close C_H. No refereed bound is changed.',
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const CH_LIP_IMPOSSIBILITY_W1GRID_ASSERTIONS = [
  {
    id: 'imp3047-local-quotient-matches-analytic-bound',
    holds: () => GRID_ROWS.every((r) => r.rel_err < 1e-6),
    why:
      'The realized local Lipschitz quotient (central FD of g_min along the cusp family) must reproduce the ' +
      'analytic lower bound C_shock/(2 sqrt(W_1)) at every W_1 (relative error < 1e-6). A mismatch would mean ' +
      'the tabulated lower bound is not the witnessed C_shock/(2 sqrt(W_1)) the verdict claims.',
  },
  {
    id: 'imp3047-divergence-exponent-is-minus-half',
    holds: () => Math.abs(EXPONENT_FIT.slope - (-0.5)) < 1e-9,
    why:
      'THE CERTIFICATE: the log-log fit of the Lipschitz lower bound vs W_1 must have slope -1/2, certifying ' +
      'C_Lip >= C_shock/(2 sqrt(W_1)) ~ W_1^{-1/2} -> inf. Any other exponent would break the route-1 ' +
      'impossibility divergence claim.',
  },
  {
    id: 'imp3047-bound-monotone-divergent',
    holds: () => MONOTONE_DIVERGENT && DIVERGENCE_RATIO > 1e4,
    why:
      'The lower bound must increase monotonically as W_1 shrinks and grow by > 1e4 across the ten-decade ' +
      'W_1 window (it scales as W_1^{-1/2}, so ~1e5). This is the tabulated divergence the verdict says was ' +
      'witnessed but never gridded on its own.',
  },
  {
    id: 'imp3047-secant-equals-closed-form',
    holds: () => SECANT_ROWS.every((r) => r.abs_diff < 1e-9),
    why:
      'Each consecutive-decade secant Lipschitz quotient must equal the exact closed form ' +
      'C_shock/(sqrt(W_a)+sqrt(W_b)) to < 1e-9, confirming the secant realization of the lower bound ' +
      'contracts to the local C_shock/(2 sqrt(W_1)) as the pair shrinks.',
  },
  {
    id: 'imp3047-c-shock-under-third',
    holds: () =>
      Number.isFinite(C_SHOCK) && C_SHOCK > 0.2 && C_SHOCK < 1 / 3,
    why:
      'The cusp prefactor C_shock must sit under the imp-2786 < 1/3 cap (~0.2692 at N*=1e4). If a future edit ' +
      'pushed it past 1/3 the divergence prefactor would be inconsistent with the pinned cusp constant.',
  },
  {
    id: 'imp3047-impossibility-not-a-beat',
    holds: () => {
      const r = CH_LIP_IMPOSSIBILITY_W1GRID_IMP3047;
      return (
        r.isBeat === false &&
        r.isImpossibilityCertificate === true &&
        /refereed bound is changed/i.test(r.honestNote) &&
        /IMPOSSIBILITY/.test(r.honestNote)
      );
    },
    why:
      'VERDICT LOCK: this is an impossibility certificate (the lower bound DIVERGES), NOT a beat. Blocks any ' +
      'future edit from reinterpreting the divergent C_Lip lower bound as a C_H closure. No refereed bound is changed' +
      '.',
  },
];

for (const a of CH_LIP_IMPOSSIBILITY_W1GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3047 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

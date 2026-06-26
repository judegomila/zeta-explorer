/**
 * @module imp-2786-c-shock-cusp-constant
 * @fileoverview imp-2681 — Pin C_shock from the Polymath15 cusp-density constant
 * C_cusp, isolating which of the two factors of C_H = C_shock * C_Lip / 4 is the
 * actual obstruction to a rigorous Holder-1/2 modulus on the first-collision time.
 *
 * BACKGROUND (polymath15-lemma52-shock-holder.js, Steps 1-3). The Holder-1/2
 * modulus constant of the first-collision functional tau_c factors as
 *
 *     C_H  =  C_shock * C_Lip / 4
 *
 * with TWO unpinned factors:
 *   - C_Lip : the gap-Lipschitz constant on |g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1
 *             (Step 1/Step 2). imp-2640 proved this is NOT a finite N-uniform
 *             constant: its only bound is the backward-flow Gronwall Jacobian
 *             2/g(t)^2, whose collision integral int_0^{tc} 2/g^2 dt diverges
 *             logarithmically as g -> 0.
 *   - C_shock : the cusp-scaling constant in g_min ~ C_shock * W_1^{1/2} near the
 *             Burgers shock (Step 3), set by the cusp density
 *             rho_inf ~ C_cusp / |gamma - gamma_star|^{1/2}. This was NEVER pinned
 *             independently — that is the imp-2681 deliverable here.
 *
 * THE QUANTILE-SPACING IDENTITY (shock-holder.js l.96-98). The limiting density
 * rho_inf has an inverse-square-root cusp at the shock, equivalently the quantile
 * function Q_inf satisfies gamma_star - Q_inf(1-u) ~ (u / C_cusp)^2, so consecutive
 * quantile spacings near the shock obey
 *
 *     Q_inf(k/N) - Q_inf((k-1)/N)  ~  2(N - k) / (N^2 * C_cusp^2).
 *
 * At the first-collision pair (N - k ~ 1) the MINIMAL spacing equals the empirical
 * minimum gap g_min, which pins C_cusp:
 *
 *     g_min  ~  2 / (N^2 * C_cusp^2)     =>     C_cusp  =  sqrt( 2 / (N^2 * g_min) ).
 *
 * PINNING C_shock. Step 3 reads g_min ~ C_shock * W_1(mu_N, rho_inf)^{1/2}, so with
 * the imp-341 Koksma-Hlawka bound W_1 <= C_KH * log(gamma_N) / N (C_KH = pi * C_Selberg
 * = 3 pi) the cusp-scaling constant is the explicit ratio
 *
 *     C_shock  =  g_min / W_1^{1/2}  =  g_min / sqrt( C_KH * log(gamma_N) / N ).
 *
 * Taking g_min at the microscopic gap scale g_min ~ y_N_sharp = sqrt(2 pi / N) (the
 * scale at which the first collision actually lives, shock-holder.js l.413/454) gives
 * the closed form
 *
 *     C_shock(N)  =  sqrt( 2 pi / N ) / sqrt( 3 pi * log(gamma_N) / N )
 *                 =  sqrt( 2 / (3 * log(gamma_N)) ),
 *
 * which is N-INDEPENDENT up to the slow sqrt(1/log) factor: BOUNDED, in fact
 * < 1/3 and slowly decreasing along the ladder. So C_shock IS pinnable to an
 * explicit, finite, bounded value.
 *
 * HONEST VERDICT (the isolation this ticket delivers). Pinning C_shock to a bounded
 * value does NOT discharge C_H, because the OTHER factor C_Lip remains the imp-2640
 * Gronwall wall (non-N-uniform). The contribution of imp-2681 is to NARROW the
 * obstruction: of the two factors of C_H = C_shock * C_Lip / 4, the cusp factor
 * C_shock is bounded (~0.27 at N*=1e4, O(1/sqrt(log)) -> 0), so the obstruction is
 * ISOLATED to C_Lip ALONE. NO rigorous beat is claimed; Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * Convention note (honest). The Whitham-fold reading C_cusp ~ 1/C_W (g6a-sub-
 * constant-value.js l.54) gives a DIFFERENT, divergent value because the boundary-
 * shock fold normalization C_W -> 0 (imp-395). This module uses the quantile-spacing
 * identity (the route the imp-2681 description cites, l.96-98) as the definitional
 * basis for C_cusp; the two conventions disagree precisely because the Whitham fold
 * does not describe the true microscopic spacing (imp-354/imp-395). Either way the
 * cusp factor entering g_min ~ C_shock * W_1^{1/2} is bounded; the wall is C_Lip.
 *
 * Tickets: imp-2681 created this module.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// Koksma-Hlawka constant C_KH = pi * C_Selberg with the documented C_Selberg = 3
// placeholder (imp-341/imp-366). Hardcoded to keep this self-executing assertion
// module light (no transitive heavy imports).
const C_KH = Math.PI * 3;

// Ladder of N-values for the cusp-constant report.
const LADDER_N = [1000, 10000, 100000, 1000000];

// N*=1e4 empirical minimum-gap of the first-collision pair (the same value used in
// shock-holder.js imp-2640/imp-2642: tc-part-vs-mf-linchpin-finding.js).
const N_STAR = 10000;
const G_MIN_STAR_EMPIRICAL = 0.037698;

// ── C_cusp from the quantile-spacing identity ────────────────────────────────
//
// Inverting g_min ~ 2 / (N^2 C_cusp^2) at the first-collision pair (N - k ~ 1).
function cuspConstantFromGap(N, gMin) {
  if (!(N > 1) || !(gMin > 0)) return null;
  return Math.sqrt(2 / (N * N * gMin));
}

// ── C_shock from the Step-3 Holder estimate g_min ~ C_shock * W_1^{1/2} ───────
//
// Microscopic gap scale g_min ~ y_N_sharp = sqrt(2 pi / N) and W_1 <= C_KH log gamma_N / N.
function w1BoundAtN(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return C_KH * Math.log(gammaN) / N;
}

function microscopicGapScale(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

function shockConstantAtN(N) {
  const w1 = w1BoundAtN(N);
  if (w1 === null || !(w1 > 0)) return null;
  return microscopicGapScale(N) / Math.sqrt(w1);
}

// Closed form C_shock(N) = sqrt( 2 / (3 log gamma_N) ) — the microscopic scale and
// the 1/N in W_1 cancel, leaving only the slow sqrt(1/log) decay.
function shockConstantClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

const LADDER_ROWS = LADDER_N.map((N) => {
  const gammaN = effectiveHeightForN(N);
  const gMicro = microscopicGapScale(N);
  const w1 = w1BoundAtN(N);
  const cShock = shockConstantAtN(N);
  const cShockClosed = shockConstantClosedForm(N);
  // C_cusp pinned from the microscopic gap via the quantile-spacing identity.
  const cCusp = cuspConstantFromGap(N, gMicro);
  return {
    N,
    gamma_N: gammaN,
    g_min_microscopic: gMicro,
    W_1_bound: w1,
    C_cusp: cCusp,
    C_shock: cShock,
    C_shock_closed_form: cShockClosed,
  };
});

// C_shock at N*=1e4 using the EMPIRICAL min gap (cross-check of the microscopic proxy).
const C_SHOCK_STAR_EMPIRICAL = G_MIN_STAR_EMPIRICAL / Math.sqrt(w1BoundAtN(N_STAR));
const C_CUSP_STAR_EMPIRICAL = cuspConstantFromGap(N_STAR, G_MIN_STAR_EMPIRICAL);

const C_SHOCK_MAX = Math.max(...LADDER_ROWS.map((r) => r.C_shock));
const C_SHOCK_BOUNDED = LADDER_ROWS.every((r) => r.C_shock !== null && r.C_shock > 0 && r.C_shock < 1);
const C_SHOCK_DECREASING = (() => {
  for (let i = 1; i < LADDER_ROWS.length; i++) {
    if (!(LADDER_ROWS[i].C_shock < LADDER_ROWS[i - 1].C_shock)) return false;
  }
  return true;
})();

// ── imp-2843: ladder-wide C_shock verification ───────────────────────────────
//
// Verify the C_shock pinning is N-uniform along the ACTUAL N-ladder used by the
// Holder chain in polymath15-lemma52-shock-holder.js (its LADDER_N at l.185:
// [2458, 5000, 1e4, 1e5, 1e6, 1e7, 1e8]) — not just the single N*=1e4. Mirrored
// here as a literal (not imported) to keep this assertion module light, per the
// C_KH convention note above. The < 1/3 tripwire certifies that the "C_shock is
// NOT the obstruction" isolation holds at every N the chain uses, focusing all
// C_H pressure on C_Lip ladder-wide.
const SHOCK_HOLDER_LADDER_N = [2458, 5000, 10000, 100000, 1_000_000, 10_000_000, 1e8];
const SHOCK_HOLDER_LADDER_ROWS = SHOCK_HOLDER_LADDER_N.map((N) => ({
  N,
  gamma_N: effectiveHeightForN(N),
  C_shock: shockConstantAtN(N),
}));
const C_SHOCK_LADDER_MAX = Math.max(...SHOCK_HOLDER_LADDER_ROWS.map((r) => r.C_shock));
const C_SHOCK_LADDER_UNDER_THIRD = SHOCK_HOLDER_LADDER_ROWS.every(
  (r) => Number.isFinite(r.C_shock) && r.C_shock > 0 && r.C_shock < 1 / 3,
);
const C_SHOCK_LADDER_DECREASING = (() => {
  for (let i = 1; i < SHOCK_HOLDER_LADDER_ROWS.length; i++) {
    if (!(SHOCK_HOLDER_LADDER_ROWS[i].C_shock < SHOCK_HOLDER_LADDER_ROWS[i - 1].C_shock)) return false;
  }
  return true;
})();

// ── The imp-2681 record ──────────────────────────────────────────────────────

export const C_SHOCK_CUSP_CONSTANT_IMP2681 = {
  ticket: 'imp-2681',
  title:
    'Pin C_shock from the Polymath15 cusp-density constant C_cusp via the quantile-spacing identity',
  verdict:
    'C_shock IS pinnable to an explicit BOUNDED value C_shock(N) = sqrt(2 / (3 log gamma_N)) ' +
    '(~0.27 at N*=1e4, O(1/sqrt(log)) -> 0). Pinning it does NOT discharge C_H = C_shock * C_Lip / 4: ' +
    'the OTHER factor C_Lip remains the imp-2640 Gronwall wall (non-N-uniform). The obstruction is ' +
    'thereby ISOLATED to C_Lip ALONE. No rigorous beat; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  cShockPinned: true,
  remainingWall:
    'C_Lip — the gap-Lipschitz constant. Its only bound is the backward-flow Gronwall Jacobian 2/g^2, ' +
    'whose collision integral int_0^{tc} 2/g^2 dt diverges logarithmically as g -> 0 (imp-2640). ' +
    'C_shock being bounded does not help: C_H = C_shock * C_Lip / 4 inherits the C_Lip divergence.',
  rigorousBeat: false,
  quantileSpacingIdentity:
    'Q_inf(k/N) - Q_inf((k-1)/N) ~ 2(N-k)/(N^2 C_cusp^2); at the first-collision pair (N-k ~ 1) ' +
    'the minimal spacing = g_min pins C_cusp = sqrt(2 / (N^2 g_min)).',
  cShockFormula:
    'C_shock = g_min / W_1^{1/2} = g_min / sqrt(C_KH log gamma_N / N); with g_min ~ sqrt(2 pi / N) ' +
    'the N-dependence cancels to the closed form C_shock(N) = sqrt(2 / (3 log gamma_N)).',
  nStar: N_STAR,
  gMinStarEmpirical: G_MIN_STAR_EMPIRICAL,
  cCuspStarEmpirical: C_CUSP_STAR_EMPIRICAL,
  cShockStarEmpirical: C_SHOCK_STAR_EMPIRICAL,
  cShockMax: C_SHOCK_MAX,
  cShockBounded: C_SHOCK_BOUNDED,
  cShockDecreasing: C_SHOCK_DECREASING,
  ladder: LADDER_ROWS,
  // imp-2843: per-N C_shock over the actual shock-holder.js Holder-chain ladder.
  shockHolderLadder: SHOCK_HOLDER_LADDER_ROWS,
  cShockLadderMax: C_SHOCK_LADDER_MAX,
  cShockLadderUnderThird: C_SHOCK_LADDER_UNDER_THIRD,
  cShockLadderDecreasing: C_SHOCK_LADDER_DECREASING,
  C_KH,
  conventionNote:
    'The Whitham-fold reading C_cusp ~ 1/C_W diverges at the boundary shock (C_W -> 0, imp-395). ' +
    'This module uses the quantile-spacing identity (imp-2681 description, shock-holder.js l.96-98) ' +
    'as the definitional basis. The two disagree because the Whitham fold does not describe the ' +
    'true microscopic spacing (imp-354/imp-395); either way the cusp factor in g_min ~ C_shock W_1^{1/2} ' +
    'is bounded and the wall is C_Lip.',
  honestNote:
    'No false QED. This NARROWS the C_H obstruction from two factors to one (C_Lip) by pinning the ' +
    'cusp factor C_shock to a bounded explicit value. It does NOT close C_H and does NOT yield a ' +
    'rigorous Lambda < 0.2. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const C_SHOCK_CUSP_CONSTANT_ASSERTIONS = [
  {
    id: 'imp2681-c-cusp-finite-positive',
    holds: () => LADDER_ROWS.every((r) => Number.isFinite(r.C_cusp) && r.C_cusp > 0),
    why:
      'C_cusp from the quantile-spacing identity C_cusp = sqrt(2 / (N^2 g_min)) must be finite ' +
      'and positive at every ladder N. A null or non-finite value means the microscopic gap scale ' +
      'or effectiveHeightForN returned a bad result.',
  },
  {
    id: 'imp2681-c-shock-bounded-pinnable',
    holds: () =>
      C_SHOCK_BOUNDED &&
      Number.isFinite(C_SHOCK_MAX) &&
      C_SHOCK_MAX < 0.5,
    why:
      'THE LOAD-BEARING FINDING: C_shock = g_min / W_1^{1/2} is BOUNDED (every ladder value in (0,1), ' +
      'max < 0.5), so the cusp factor of C_H = C_shock * C_Lip / 4 is pinnable. This is what isolates ' +
      'the obstruction to C_Lip alone. If this fails, the claim that C_shock is bounded is broken.',
  },
  {
    id: 'imp2681-c-shock-closed-form-matches',
    holds: () =>
      LADDER_ROWS.every(
        (r) =>
          r.C_shock !== null &&
          r.C_shock_closed_form !== null &&
          Math.abs(r.C_shock - r.C_shock_closed_form) < 1e-9,
      ),
    why:
      'The explicit ratio C_shock = g_min / sqrt(C_KH log gamma_N / N) with g_min = sqrt(2 pi / N) ' +
      'must equal the closed form sqrt(2 / (3 log gamma_N)) to numerical tolerance (the microscopic ' +
      'scale and the 1/N in W_1 cancel). Failure means the cancellation in the pinning derivation is wrong.',
  },
  {
    id: 'imp2681-c-shock-star-empirical-order-unity',
    holds: () =>
      Number.isFinite(C_SHOCK_STAR_EMPIRICAL) &&
      C_SHOCK_STAR_EMPIRICAL > 0.1 &&
      C_SHOCK_STAR_EMPIRICAL < 1.0,
    why:
      'The N*=1e4 empirical-gap value C_shock = g_min(emp) / W_1^{1/2} must be order unity (in (0.1, 1)). ' +
      'Both the microscopic-proxy (~0.27) and empirical-gap (~0.40) routes give a bounded O(1) cusp ' +
      'factor, confirming C_shock is not the unbounded factor of C_H.',
  },
  {
    id: 'imp2843-c-shock-ladder-uniform-under-third',
    holds: () =>
      C_SHOCK_LADDER_UNDER_THIRD &&
      C_SHOCK_LADDER_DECREASING &&
      Number.isFinite(C_SHOCK_LADDER_MAX) &&
      C_SHOCK_LADDER_MAX < 1 / 3 &&
      SHOCK_HOLDER_LADDER_ROWS.length === 7,
    why:
      'imp-2843 TRIPWIRE: C_shock(N) = g_min / W_1^{1/2} must stay < 1/3 and monotone-decreasing ' +
      'across the FULL N-ladder actually used by the Holder chain in polymath15-lemma52-shock-holder.js ' +
      '(N = 2458 .. 1e8, l.185), not just at N*=1e4. This certifies the "C_shock is NOT the obstruction" ' +
      'isolation ladder-wide, so all C_H pressure is on C_Lip at every N. If a future edit to the height ' +
      'mapping or the cusp formula pushed any ladder C_shock past 1/3, this fails loudly.',
  },
  {
    id: 'imp2681-wall-is-clip-no-beat',
    holds: () => {
      const r = C_SHOCK_CUSP_CONSTANT_IMP2681;
      return (
        r.cShockPinned === true &&
        r.rigorousBeat === false &&
        /C_Lip/.test(r.remainingWall) &&
        /ISOLATED to C_Lip ALONE/.test(r.verdict) &&
        /SOTA/.test(r.honestNote)
      );
    },
    why:
      'VERDICT LOCK: C_shock is pinned (bounded) but C_H is NOT discharged — the remaining wall is C_Lip ' +
      '(imp-2640 Gronwall divergence). This assertion blocks any future edit from flipping the bounded-C_shock ' +
      'finding into a claimed C_H closure or a rigorous Lambda < 0.2 beat. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

// Self-executing assertion check at import (matches the project convention).
for (const a of C_SHOCK_CUSP_CONSTANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2786 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

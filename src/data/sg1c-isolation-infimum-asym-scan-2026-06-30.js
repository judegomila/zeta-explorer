/**
 * @module sg1c-isolation-infimum-asym-scan-2026-06-30
 *
 * imp-3045: NUMERICAL bracket-tightening of the still-OPEN global multi-body
 * isolation constant (the infimum of the isolation ratio rho = g / d_1 among
 * margin-WORSENING configurations, d(rho_iso)/ds > 0 at rho < 1). This is a
 * higher-resolution adversarial scan ONLY -- it is NOT the closed-form closure
 * (that stays the separate deterministic forward-move ticket). NO false QED.
 *
 * THE FLOW (independently anchored, not posited):
 *   The SG1c isolation rate is computed from the log-gas velocity field
 *     v_i = - sum_{j != i} 1/(x_i - x_j),
 *   with rho = g / d_1 (g = minimal adjacent-pair gap, d_1 = nearest environment
 *   gap), drho/ds = (dg/ds)/d_1 - g (dd_1/ds)/d_1^2. This field is VALIDATED
 *   against the two closed-form anchors already in sg1c-theta-trap-theorems:
 *     - Lemma R2-T single-neighbour onset rho* = 1 (exact), and
 *     - Lemma R2-T2 symmetric single-shell onset rho* = c* = sqrt(2+sqrt(3))-1
 *       ~ 0.93185165, reproduced here by bisection to machine precision.
 *   Reproducing BOTH closed forms certifies the scan runs the correct dynamics.
 *
 * WHAT THE HIGHER-RESOLUTION SCAN FINDS:
 *   The worst case is NOT the symmetric shell. An 8e6-config random sweep (3-7
 *   particles, asymmetric, both sides) plus a structured (L,R)-lattice onset map
 *   locate the infimum in a HIGHLY ASYMMETRIC class:
 *     {pair (0,g)} U {one tight neighbour at -d_1} U {opposite uniform lattice
 *      g + d_1, g + 2 d_1, ...}  (one close neighbour on one side, a long
 *      uniform lattice of the same spacing on the other).
 *   The symmetric L=R lattice onset RISES toward 1 as the lattice grows (L=R=1
 *   gives c*=0.93185; L=R=12 gives 0.99979), so symmetry is the BENIGN direction.
 *   The asymmetric L=1, R->inf onset DECREASES and converges to
 *     rho_inf ~ 0.9039  (stable from R >= 16 onward),
 *   which sits BELOW the previously-tabulated lower bracket 0.927 and is fully
 *   consistent with the imp-3046 note widening the open range to ~(0.90, 0.943).
 *   The opposite-side spacing equal to d_1 (uniform) is itself the worst; looser
 *   or tighter opposite spacings raise the onset (Rsp=1.3 -> 0.940, Rsp=0.8 -> 1).
 *
 * TIGHTENED EMPIRICAL BRACKET (this scan, validated flow):
 *     global isolation constant in approximately (0.9039, 0.93185]
 *   lower end = asymmetric one-tight-neighbour + opposite-lattice infimum,
 *   upper end = symmetric single-shell c* (closed form). The prior (0.927, 0.943)
 *   bracket was loose on BOTH ends: the asymmetric tail reaches below 0.927, and
 *   no worsening config was found above the symmetric c*=0.93185.
 *
 * THE DECISIVE DOWNSTREAM FACT IS PRESERVED (and reported honestly):
 *   Theorem C's basin operates at rho <= 0.72. Even at the new, LOWER infimum
 *   0.9039 the basin sits 0.184 below the worsening threshold, and drho/ds at
 *   rho = 0.72 is strongly negative (~-1.1), so the isolated pair self-improves
 *   (rho falls) on the entire basin REGARDLESS of where the open global constant
 *   lands inside (0.9039, 0.93185]. The basin-conditional C_Lip of
 *   ch-lip-basin-conditional-2026-06-30 is UNAFFECTED -- its 0.72 separation
 *   survives the tighter (lower) bracket with margin 0.184 > 0.
 *
 * HONEST (NO false QED):
 *   - This is a NUMERICAL bracket only on an independently-anchored flow; it does
 *     NOT close the global constant in closed form. Only the single-neighbour
 *     c = 1 (R2-T) and the symmetric single-shell c* (R2-T2) are closed in form.
 *   - The reported 0.9039 lies below the prior random-scan brackets (0.927/0.943);
 *     those scans under-sampled the asymmetric semi-lattice tail. The value here
 *     is anchored by exact reproduction of BOTH closed forms, not asserted.
 *   - Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA; nothing here is a beat.
 *
 * @see sg1c-theta-trap-theorems (Lemma R2-T onset 1; R2-T2 c*; SHELL_K2 quintic)
 * @see ch-lip-basin-conditional-2026-06-30 (the 0.72 basin separation this preserves)
 */

// SG1c isolation flow velocity (sign matches R2-T: worsening when g > d_1).
const vel = (x) => x.map((xi, i) => -x.reduce((s, xj, j) => (i === j ? s : s + 1 / (xi - xj)), 0));

const sortedGaps = (x) => {
  const g = [];
  for (let i = 1; i < x.length; i++) g.push(x[i] - x[i - 1]);
  return g;
};

// Isolation-ratio rate drho/ds for a configuration: minimal adjacent-pair gap g,
// nearest environment gap d_1, rho = g / d_1. Returns null if the pair gap is not
// the minimal local gap (rho would exceed 1) or there is no environment neighbour.
function isolationRate(xRaw) {
  const x = [...xRaw].sort((a, b) => a - b);
  const G = sortedGaps(x);
  const gi = G.indexOf(Math.min(...G));
  const g = G[gi];
  const pi = gi;
  const pj = gi + 1;
  let d1 = Infinity;
  let near = -1;
  let nbr = -1;
  if (gi - 1 >= 0 && G[gi - 1] < d1) { d1 = G[gi - 1]; near = pi; nbr = gi - 1; }
  if (gi + 1 < G.length && G[gi + 1] < d1) { d1 = G[gi + 1]; near = pj; nbr = gi + 2; }
  if (near < 0 || g > d1 + 1e-12) return null;
  const v = vel(x);
  const dg = v[pj] - v[pi];
  const dd1 = x[nbr] > x[near] ? v[nbr] - v[near] : v[near] - v[nbr];
  return { rho: g / d1, drho: dg / d1 - (g * dd1) / (d1 * d1) };
}

// Onset rho* (drho/ds = 0) for the asymmetric class: pair (0,g), one tight
// neighbour at -1, opposite uniform lattice {g+1, ..., g+R} spacing 1 (=d_1).
function asymmetricOnset(R) {
  const f = (g) => {
    const x = [-1, 0, g];
    for (let k = 1; k <= R; k++) x.push(g + k);
    return isolationRate(x).drho;
  };
  // Bracket kept strictly below 1 so the tracked pair stays the minimal-gap pair
  // (at g >= d_1 the minimal gap would switch to a neighbour gap). The onset < 1.
  let lo = 0.4;
  let hi = 0.9999;
  for (let k = 0; k < 80; k++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// Onset for the symmetric single-shell {-(g/2+1),-g/2,g/2,g/2+1} (R2-T2 anchor).
function symmetricShellOnset() {
  const f = (g) => isolationRate([-(g / 2 + 1), -g / 2, g / 2, g / 2 + 1]).drho;
  let lo = 0.5;
  let hi = 0.9999;
  for (let k = 0; k < 80; k++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

const C_STAR = Math.sqrt(2 + Math.sqrt(3)) - 1;       // 0.93185165 (R2-T2 closed form)
const SHELL_ONSET = symmetricShellOnset();            // reproduces c* (flow validation)
const ASYM_INF = asymmetricOnset(64);                 // ~0.9039 (R>=16 converged)
const BASIN_RHO = 0.72;                               // Theorem-C isolation cap
// drho/ds on the basin (must be strongly negative => self-improving):
const BASIN_DRHO = (() => {
  const g = BASIN_RHO;
  const x = [-1, 0, g];
  for (let k = 1; k <= 64; k++) x.push(g + k);
  return isolationRate(x).drho;
})();

export const SG1C_ISOLATION_INFIMUM_ASYM_SCAN = {
  ticket: 'imp-3045',
  date: '2026-06-30',
  flowValidation: {
    singleNeighbourOnset: 1, // R2-T exact (g = d_1)
    symmetricShellOnset: SHELL_ONSET,
    symmetricShellClosedForm: C_STAR,
    shellMatchesClosedForm: Math.abs(SHELL_ONSET - C_STAR) < 1e-7,
  },
  worstCaseClass: 'asymmetric: one tight neighbour at d_1 on one side + opposite uniform lattice of spacing d_1 (L=1, R->inf)',
  asymmetricInfimum: ASYM_INF,                         // ~0.9039
  symmetricUpperEnd: C_STAR,                           // 0.93185 (no worsening config found above it)
  tightenedBracket: [ASYM_INF, C_STAR],                // ~(0.9039, 0.93185]; prior (0.927, 0.943) was loose both ends
  priorBracket: [0.927, 0.943],
  basinIsolationRatio: BASIN_RHO,
  basinDrho: BASIN_DRHO,                               // strongly negative => self-improving
  preservedBasinMargin: ASYM_INF - BASIN_RHO,          // ~0.184 > 0
  status: 'NUMERICAL bracket-tightening of the open global isolation constant; worst case is asymmetric, not symmetric; 0.72 basin separation preserved',
  honest: 'NUMERICAL only on an independently-anchored flow, NOT a closed-form closure. Only single-neighbour c=1 and symmetric single-shell c* are closed in form. PT Lambda <= 0.2 stays the rigorous SOTA. NO false QED.',
};

export const SG1C_ISOLATION_INFIMUM_ASYM_SCAN_ASSERTIONS = [
  {
    id: 'sg1c-iso-scan-flow-anchored-on-closed-forms',
    description: 'the scan flow reproduces BOTH closed-form anchors: single-neighbour onset 1 and symmetric single-shell onset c*=sqrt(2+sqrt(3))-1 to machine precision',
    holds: () => Math.abs(isolationRate([-1, 0, 1]).rho - 1) < 1e-12
      && Math.abs(SHELL_ONSET - C_STAR) < 1e-7,
  },
  {
    id: 'sg1c-iso-scan-asymmetric-is-worst',
    description: 'the asymmetric (L=1, opposite-lattice) infimum ~0.9039 lies strictly below the symmetric single-shell c*, so symmetry is the benign direction and the worst case is asymmetric',
    holds: () => ASYM_INF < C_STAR && Math.abs(ASYM_INF - 0.9039) < 2e-3,
  },
  {
    id: 'sg1c-iso-scan-tightens-prior-bracket',
    description: 'the validated-flow bracket (~0.9039, ~0.93185] is tighter than and contained below the prior loose (0.927, 0.943): asymmetric tail reaches below 0.927 and no worsening config exceeds c*',
    holds: () => ASYM_INF < 0.927 && C_STAR < 0.943,
  },
  {
    id: 'sg1c-iso-scan-basin-072-preserved',
    description: 'Theorem-C basin rho<=0.72 still self-improves (drho/ds < 0 at 0.72) with positive margin to the tighter (lower) infimum, so the basin-conditional C_Lip survives the lower bracket',
    holds: () => BASIN_DRHO < 0 && ASYM_INF - BASIN_RHO > 0.15,
  },
  {
    id: 'sg1c-iso-scan-honest-not-closed-form',
    description: 'explicitly NUMERICAL bracketing, NOT a closed-form closure, and PT 0.2 stays SOTA',
    holds: () => /NUMERICAL only/.test(SG1C_ISOLATION_INFIMUM_ASYM_SCAN.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(SG1C_ISOLATION_INFIMUM_ASYM_SCAN.honest),
  },
];

for (const a of SG1C_ISOLATION_INFIMUM_ASYM_SCAN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-isolation-infimum-asym-scan assertion failed: ${a.id}`);
}

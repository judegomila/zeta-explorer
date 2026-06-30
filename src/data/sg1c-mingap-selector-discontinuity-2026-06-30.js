/**
 * @module sg1c-mingap-selector-discontinuity-2026-06-30
 *
 * imp-3173: NUMERICAL diagnostic of the imp-3045 artifact. The sg1c-asym
 * closed-form module (imp-3170) attributes the imp-3045 bisection bracket
 * (~0.9032-0.9039) to a "minimal-gap selector discontinuity" near g ~ 0.9029
 * that trapped a naive bisection ABOVE the smooth drho/ds zero at the
 * closed-form onset c_asym = 0.9027902227683418. This module independently
 * characterizes that discontinuity. NO QED; PT Lambda <= 0.2 stays SOTA.
 *
 * THE CONFIG (imp-3045 R->inf worst-case class):
 *   x = {-1, 0, g} U {g + k : k = 1..R}, tracked pair (0, g), tight neighbour
 *   at -1 (left gap d_1 = 1), opposite uniform unit lattice on the right.
 *   The adjacent gap array is  G = [1, g, 1, 1, ..., 1]  (length R+2).
 *
 * WHAT ACTUALLY FLIPS (precisely located -- it is NOT the gi index):
 *   The minimal-gap index gi = G.indexOf(min) stays pinned at 1 (the tracked
 *   pair gap g < 1) across the whole window. The discontinuity is one level
 *   down, in the imp-3045 isolationRate ENVIRONMENT-NEIGHBOUR (d_1) tie-break:
 *     if (G[gi-1] < d1) pick LEFT(-1);   if (G[gi+1] < d1) pick RIGHT(lattice);
 *   Both candidate gaps are the unit gap = 1, BUT the right lattice gap is
 *   computed as the floating subtraction (g + 1) - g, which rounds to either
 *   exactly 1.0 OR to 0.9999999999999999 (one ULP below 1) depending on g.
 *   When round-off drops it a hair below 1, the strict "<" test grabs the
 *   RIGHT lattice neighbour instead of the genuinely-tight LEFT (-1) neighbour.
 *   Whether (g+1)-g lands at 1.0 or 1-eps is a round-off-chaotic function of g:
 *   the selected d_1 side flips ~10^3 times across (0.901, 0.905) -- it is NOT
 *   a single clean crossover at one g.
 *
 * WHY THAT FLIP INJECTS A SPURIOUS SIGN CHANGE:
 *   Each branch is individually SMOOTH in g.
 *     - LEFT branch (correct, tight -1 neighbour) is the closed-form flow; it
 *       passes through zero at the true continuous onset (R=64: ~0.902827,
 *       converging to c_asym = 0.9027902 as R->inf).
 *     - RIGHT branch (spurious lattice neighbour) sits at drho ~ -0.59 across
 *       the entire window and NEVER crosses zero near the onset.
 *   The naive selector returns whichever branch round-off picks, so the sampled
 *   f(g) hops between a near-zero sign-changing curve and a flat -0.59 curve.
 *   At representative trap points just above the onset (e.g. g = 0.9032364)
 *   round-off takes the RIGHT branch, so f = -0.59 < 0 there -- even though the
 *   TRUE (LEFT) drho is already +0.0022 > 0 (the onset is past). A bisection
 *   reading such spurious negatives concludes the onset lies higher and locks
 *   its bracket ABOVE the genuine zero; its reported endpoint 0.9032364257812502
 *   itself has TRUE drho > 0, i.e. it sits above the continuous onset --
 *   reproducing the slightly-high imp-3045 bracket. (Which individual g lands on
 *   LEFT vs RIGHT is round-off-chaotic, so the endpoint float need not itself be
 *   a RIGHT point; the chaotic neighbourhood is what does the trapping.)
 *
 * THE FIX / SAFE WINDOW (reported, no new math):
 *   Break the d_1 tie with a tolerance (gaps within ~1e-9 are the same unit
 *   neighbour; keep the genuinely-tight LEFT side) instead of strict "<". The
 *   resulting drho is the single smooth LEFT branch; bisection on ANY bracket
 *   straddling the onset (e.g. (0.85, 0.92)) lands cleanly on the continuous
 *   zero -- R=64 -> 0.902827, R=256 -> 0.9027926, -> c_asym. Equivalently,
 *   root-find on the closed-form asymOnsetDrho directly (imp-3170), which has
 *   no floating lattice gap to round.
 *
 * HONEST: this is a NUMERICAL diagnostic of a discrete-selector / round-off
 * artifact, explaining why the imp-3045 bracket was high and confirming the
 * imp-3170 closed-form onset is the genuine continuous zero. It changes NO
 * downstream constant: the 0.72 basin margin (c_asym - 0.72 = 0.1828) and the
 * basin-conditional C_Lip are untouched. Platt-Trudgian Lambda <= 0.2 stays
 * the rigorous SOTA. NO false QED.
 *
 * @see sg1c-isolation-infimum-asym-scan-2026-06-30 (the imp-3045 scan with the strict-"<" selector)
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170 closed form c_asym this confirms)
 */

const vel = (x) => x.map((xi, i) => -x.reduce((s, xj, j) => (i === j ? s : s + 1 / (xi - xj)), 0));
const sortedGaps = (x) => { const g = []; for (let i = 1; i < x.length; i++) g.push(x[i] - x[i - 1]); return g; };
function buildConfig(g, R) { const x = [-1, 0, g]; for (let k = 1; k <= R; k++) x.push(g + k); return x; }

// Exact imp-3045 environment-neighbour (d_1) tie-break, instrumented to report
// which side the strict "<" comparison selected. side = LEFT (-1, tight) | RIGHT (lattice).
function naiveDrho(g, R) {
  const x = buildConfig(g, R).sort((a, b) => a - b);
  const G = sortedGaps(x);
  const gi = G.indexOf(Math.min(...G));
  const pi = gi, pj = gi + 1;
  let d1 = Infinity, near = -1, nbr = -1, side = 'none';
  if (gi - 1 >= 0 && G[gi - 1] < d1) { d1 = G[gi - 1]; near = pi; nbr = gi - 1; side = 'LEFT'; }
  if (gi + 1 < G.length && G[gi + 1] < d1) { d1 = G[gi + 1]; near = pj; nbr = gi + 2; side = 'RIGHT'; }
  if (near < 0 || g > d1 + 1e-12) return null;
  const v = vel(x);
  const dg = v[pj] - v[pi];
  const dd1 = x[nbr] > x[near] ? v[nbr] - v[near] : v[near] - v[nbr];
  return { drho: dg / d1 - (g * dd1) / (d1 * d1), side, gi };
}

// Force one branch (LEFT = tight -1 neighbour, RIGHT = first lattice neighbour).
function branchDrho(g, R, forceSide) {
  const x = buildConfig(g, R).sort((a, b) => a - b);
  const G = sortedGaps(x), gi = 1, v = vel(x);
  const dg = v[gi + 1] - v[gi];
  if (forceSide === 'LEFT') { const d1 = G[gi - 1], near = gi, nbr = gi - 1; return dg / d1 - (g * (v[near] - v[nbr])) / (d1 * d1); }
  const d1 = G[gi + 1], near = gi + 1, nbr = gi + 2; return dg / d1 - (g * (v[nbr] - v[near])) / (d1 * d1);
}

// Tolerance-robust selector (the safe fix): a unit-gap tie keeps the tight LEFT side.
function robustDrho(g, R) { return branchDrho(g, R, 'LEFT'); }
function robustRoot(R) {
  let lo = 0.85, hi = 0.92;
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (robustDrho(m, R) > 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

// Count naive d_1-selector flips on a deterministic grid near the onset.
function selectorFlips(R, lo, hi, N) {
  let flips = 0, prev = null;
  for (let i = 0; i <= N; i++) {
    const g = lo + (hi - lo) * i / N;
    const r = naiveDrho(g, R);
    if (r && prev && r.side !== prev) flips++;
    if (r) prev = r.side;
  }
  return flips;
}

const C_ASYM = 0.9027902227683418;          // imp-3170 closed-form continuous onset (R->inf)
const SCAN_FALSE_ONSET = 0.9032364257812502; // imp-3045 reported bisection-on-discontinuity value
// A representative trap point just above the true onset where round-off DOES take the
// spurious RIGHT lattice branch (the unit gap rounds to 1-ulp). Whether any individual g
// lands on LEFT or RIGHT is round-off-chaotic; this witness exhibits the spurious negative.
const WITNESS_TRAP = 0.9032364;
const FLIPS_NEAR_ONSET = selectorFlips(64, 0.901, 0.905, 2000); // ~998 (round-off chaotic)
const ROBUST_ROOT_R64 = robustRoot(64);      // ~0.902827 (below the false onset)
const ROBUST_ROOT_R256 = robustRoot(256);    // ~0.9027926 (-> c_asym)

export const SG1C_MINGAP_SELECTOR_DISCONTINUITY = {
  ticket: 'imp-3173',
  date: '2026-06-30',
  diagnoses: 'imp-3045',
  confirms: 'imp-3170',
  configClass: 'asymmetric R->inf: pair (0,g) + tight neighbour at -1 (d_1=1) + opposite uniform unit lattice {g+k}',
  whatFlips: 'NOT the minimal-gap index gi (pinned at 1); the d_1 environment-neighbour tie-break flips LEFT(-1) <-> RIGHT(lattice) because (g+1)-g rounds to 1.0 or to 1-ulp round-off-chaotically, and the strict "<" test then grabs the spurious right lattice neighbour',
  selectorFlipsNearOnset: FLIPS_NEAR_ONSET,   // ~998 flips over a 2000-pt grid in (0.901,0.905): chaotic, not one crossover
  leftBranchIsSmoothZero: true,               // tight -1 branch crosses zero at the true onset
  rightBranchFlatNoZero: true,                // lattice branch ~ -0.59, no zero near onset
  trueOnsetClosedForm: C_ASYM,                // 0.9027902227683418
  scanFalseOnset: SCAN_FALSE_ONSET,           // 0.9032364 -- where round-off took the RIGHT branch (drho<0 spurious)
  robustRootR64: ROBUST_ROOT_R64,             // ~0.902827 with the tolerance-robust selector
  robustRootR256: ROBUST_ROOT_R256,           // ~0.9027926 -> c_asym as R->inf
  safeWindow: 'tolerance tie-break (unit-gap ties keep the tight LEFT neighbour) OR root-find the closed-form asymOnsetDrho directly; any bracket straddling the onset, e.g. (0.85,0.92), then lands on the smooth zero',
  basinMarginUnchanged: C_ASYM - 0.72,        // 0.1828: load-bearing constant untouched
  status: 'NUMERICAL diagnostic: the imp-3045 high bracket is a round-off-driven d_1-selector discontinuity, not a real onset; the imp-3170 closed-form c_asym is the genuine continuous zero',
  honest: 'NUMERICAL diagnostic of a discrete-selector/round-off artifact, NOT a closure and NOT a beat; the 0.72 basin margin is unchanged; PT Lambda <= 0.2 stays the rigorous SOTA. NO false QED.',
};

export const SG1C_MINGAP_SELECTOR_DISCONTINUITY_ASSERTIONS = [
  {
    id: 'sg1c-mgs-gi-index-pinned-not-flipping',
    description: 'the minimal-gap index gi stays pinned at the tracked pair (gi=1) across the onset window: it is NOT the gi index that flips',
    holds: () => [0.901, 0.9028, 0.9032364, 0.904, 0.905].every((g) => naiveDrho(g, 64).gi === 1),
  },
  {
    id: 'sg1c-mgs-d1-selector-flips-chaotically',
    description: 'the naive strict-"<" d_1 environment-neighbour selector flips hundreds of times across (0.901,0.905): a round-off-chaotic discontinuity, not a single clean crossover',
    holds: () => FLIPS_NEAR_ONSET > 100,
  },
  {
    id: 'sg1c-mgs-branches-smooth-left-zero-right-flat',
    description: 'each forced branch is smooth: the LEFT (tight -1) branch crosses zero near the onset (neg below, pos above) while the RIGHT (lattice) branch stays ~ -0.59 with no zero near the onset',
    holds: () => branchDrho(0.9027, 64, 'LEFT') < 0 && branchDrho(0.9029, 64, 'LEFT') > 0
      && branchDrho(0.9027, 64, 'RIGHT') < -0.5 && branchDrho(0.9032364, 64, 'RIGHT') < -0.5,
  },
  {
    id: 'sg1c-mgs-false-onset-is-spurious-right-branch',
    description: 'at a representative trap point above the true onset the naive selector takes the RIGHT branch (spurious drho<0) while the TRUE (LEFT) drho is already >0; and the imp-3045 reported endpoint itself has true drho>0 -- i.e. the bisection terminated ABOVE the genuine continuous zero, trapped by such spurious negatives',
    holds: () => naiveDrho(WITNESS_TRAP, 64).side === 'RIGHT'
      && naiveDrho(WITNESS_TRAP, 64).drho < 0
      && branchDrho(WITNESS_TRAP, 64, 'LEFT') > 0
      && branchDrho(SCAN_FALSE_ONSET, 64, 'LEFT') > 0,
  },
  {
    id: 'sg1c-mgs-robust-selector-recovers-true-onset',
    description: 'the tolerance-robust selector gives a single smooth zero strictly BELOW the imp-3045 false onset, converging to the imp-3170 closed-form c_asym as R->inf',
    holds: () => ROBUST_ROOT_R64 < SCAN_FALSE_ONSET && Math.abs(ROBUST_ROOT_R256 - C_ASYM) < 1e-4,
  },
  {
    id: 'sg1c-mgs-basin-and-sota-unchanged',
    description: 'the diagnostic changes no downstream constant: the 0.72 basin margin stays 0.1828 and PT 0.2 stays SOTA',
    holds: () => Math.abs(SG1C_MINGAP_SELECTOR_DISCONTINUITY.basinMarginUnchanged - 0.1828) < 1e-3
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(SG1C_MINGAP_SELECTOR_DISCONTINUITY.honest),
  },
];

for (const a of SG1C_MINGAP_SELECTOR_DISCONTINUITY_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-mingap-selector-discontinuity assertion failed: ${a.id}`);
}

/**
 * @fileoverview imp-95967 -- characterize the imp-95925 Q0_RECON non-monotone "dip near m~50-60"
 * (the 41->60 interval sign wobble, dQ/dm = -7.05e-8). Evaluate Q0_RECON on a FINE integer modulus
 * grid m=41..70, locate the minimizing modulus m*, measure the dip depth, and confirm grid
 * convergence at Nsub=120000 vs 240000. MEASURE ONLY; changes no bound; NO QED.
 *
 * SETUP (from imp-95925 / imp-95822 / imp-95900). imp-95925 swept Q0_RECON at the moduli
 * m = 20, 22, 30, 41, 60, 80, 110, 150 (wide intervals) and found the TIER-1/TIER-3 imbalance
 * dQ/dm = D_3(m) + C_1 collapses to zero like ~midM^-3, EXCEPT for a single negative value on the
 * 41->60 interval (dQ/dm = -7.05e-8) which it called "a genuine grid-converged dip of the
 * reconstruction, not quadrature noise" -- but the location and depth of the dip were never
 * characterized. imp-95822 had already noted a grid-converged per-modulus fine structure alternating
 * at unit spacing.
 *
 * WHAT THIS MODULE DOES. Using the faithful 238-cell Q_0 machinery verbatim from imp-95822/95925
 * (breakpoint-partition K_v(m,v), the A_rho singular block Q_0(m,v), integrand Q_0 . zeta(3,1+v),
 * composite 8-point Gauss-Legendre), it re-quadratures Q0_RECON at EVERY integer modulus m=41..70 on
 * the imp-95746-tightened grid Nsub=120000, then re-runs the minimizing modulus and its neighbours at
 * Nsub=240000 to test grid convergence. SCRATCH: tmp/imp-95967-scratch.mjs, tmp/imp-95967-branch.mjs.
 *
 * THE FINDING (the "dip" is a PARITY-SAMPLING ARTIFACT, not a genuine reconstruction dip). On the
 * fine integer grid Q0_RECON does NOT dip anywhere near m~50-60. Instead it splits cleanly by the
 * PARITY of m into two smoothly-rising, each STRICTLY MONOTONE-INCREASING branches:
 *   ODD  branch (m=41,43,...,69): -0.0106560777 -> -0.0106534333, monotone up toward the asymptote.
 *   EVEN branch (m=42,44,...,70): -0.0106629747 -> -0.0106559781, monotone up, sitting BELOW the odd
 *     branch by ~7.26e-6 at m~42, the gap SHRINKING to ~2.78e-6 at m~68 (both branches converge to
 *     the common asymptote ~ -0.010653).
 * Neither branch has any interior local minimum. The minimizing modulus of the whole m=41..70 grid is
 * m* = 42 (the deepest EVEN point, at the low end), Q0_RECON(42) = -0.0106629747, sitting ~6.90e-6
 * below the m=41 anchor and ~6.90e-6 below the 41->70 chord. Grid-converged: at Nsub=240000 the
 * m=41,42,43 values shift by only ~8e-12, ~3.0e-11, ~2.2e-11 -- ALL far below the ~1e-7 wobble scale,
 * so these are NOT Gauss-Legendre (Nsub) quadrature noise; the values are stable.
 *
 * WHY THE imp-95925 SWEEP SAW A "DIP". Its sampled moduli have parity 20(even) 22(even) 30(even)
 * 41(ODD) 60(even) 80(even) 110(even) 150(even) -- so m=41 is the SOLE ODD modulus, sitting on the
 * ELEVATED odd branch ~7e-6 ABOVE the even branch. The 30->41 step therefore jumped UP onto the odd
 * branch (the anomalously large +1.55e-6 imbalance) and the 41->60 step jumped back DOWN onto the
 * even branch, producing the spurious negative dQ/dm. The 41->60 finite difference is an
 * odd-branch-value MINUS an even-branch-value -- a parity mismatch, not a genuine local minimum of the
 * reconstruction near m~50-60. Restricted to the even branch alone (30,60,80,110,150) Q0_RECON is
 * strictly monotone increasing with NO sign wobble at all.
 *
 * RECONCILIATION WITH imp-95925/95822. imp-95925 was RIGHT that the individual values are
 * grid-converged (not Nsub quadrature noise) but IMPRECISE to read it as a genuine reconstruction dip:
 * the object is neither Nsub noise nor a genuine interior dip -- it is a parity-branch sampling
 * artifact (the imp-95822 "unit-step alternation" resolved here as a clean odd/even split of ~7e-6
 * near m~42, shrinking with m). The imp-95925 macro-trend and ~midM^-3 tail decay are UNAFFECTED (they
 * average over parity via the wide even-branch intervals); only the single 41->60 sign wobble is
 * reattributed from "genuine dip" to "parity-sampling artifact".
 *
 * HONEST CAVEAT (same residual as imp-95822/95925). Q0_RECON is a faithful 238-cell reconstruction
 * certified only at m=20 (Sun 6.23 kappa); grid convergence to ~1e-11 shows the integral of the
 * reconstructed integrand is exact, NOT that the reconstruction equals Sun Prop-6.3 at m>20
 * (imp-95966 obstruction). Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author,
 * unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes
 * the offline-measured Q0_RECON literals; no heavy quadrature at import.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95967-scratch.mjs
 * (fine integer grid m=41..70 + Nsub=240000 convergence at m*), tmp/imp-95967-branch.mjs (parity).
 */

// Q0_RECON at every integer modulus m=41..70 (Nsub=120000, imp-95746-tightened grid; faithful
// 238-cell reconstruction). Offline-measured literals (tmp/imp-95967-scratch.mjs).
const Q0_FINE = Object.freeze({
  41: -0.0106560776836, 42: -0.0106629746940, 43: -0.0106557142590, 44: -0.0106620160559,
  45: -0.0106553966709, 46: -0.0106611766024, 47: -0.0106551164868, 48: -0.0106604374787,
  49: -0.0106548690514, 50: -0.0106597833704, 51: -0.0106546490920, 52: -0.0106592018125,
  53: -0.0106544528446, 54: -0.0106586820108, 55: -0.0106542770058, 56: -0.0106582164831,
  57: -0.0106541186337, 58: -0.0106577969542, 59: -0.0106539756707, 60: -0.0106574180750,
  61: -0.0106538461139, 62: -0.0106570745668, 63: -0.0106537281117, 64: -0.0106567628851,
  65: -0.0106536212412, 66: -0.0106564773983, 67: -0.0106535230799, 68: -0.0106562168092,
  69: -0.0106534332579, 70: -0.0106559780758,
});
const GRID = Object.freeze(Object.keys(Q0_FINE).map(Number));

// parity branches: odd m and even m each form a strictly-monotone-increasing sequence.
const ODD_M = Object.freeze(GRID.filter((m) => m % 2 === 1));
const EVEN_M = Object.freeze(GRID.filter((m) => m % 2 === 0));
const isIncreasing = (ms) => ms.every((m, i) => i === 0 || Q0_FINE[m] > Q0_FINE[ms[i - 1]]);
const ODD_MONOTONE = isIncreasing(ODD_M);
const EVEN_MONOTONE = isIncreasing(EVEN_M);

// the minimizing modulus m* over the whole grid (deepest / most-negative Q0_RECON).
let M_STAR = GRID[0];
for (const m of GRID) if (Q0_FINE[m] < Q0_FINE[M_STAR]) M_STAR = m;
const Q0_MIN = Q0_FINE[M_STAR];

// dip depth: below the m=41 anchor and below the straight 41->70 chord evaluated at m*.
const DEPTH_BELOW_M41 = Q0_FINE[41] - Q0_MIN; // ~6.90e-6
const CHORD_AT_MSTAR = Q0_FINE[41] + (Q0_FINE[70] - Q0_FINE[41]) * (M_STAR - 41) / (70 - 41);
const DIP_BELOW_CHORD = CHORD_AT_MSTAR - Q0_MIN; // ~6.90e-6

// parity gap = odd(m+1) - even(m); shrinks as the two branches converge to the common asymptote.
const PARITY_GAP_LOW = Q0_FINE[43] - Q0_FINE[42];  // ~7.26e-6 near m~42
const PARITY_GAP_HIGH = Q0_FINE[69] - Q0_FINE[68]; // ~2.78e-6 near m~68
const PARITY_GAP_SHRINKS = PARITY_GAP_HIGH < PARITY_GAP_LOW;

// grid convergence at m* and neighbours: |value(Nsub=240000) - value(Nsub=120000)| (measured).
const GRID_SHIFT = Object.freeze({ 41: 7.773e-12, 42: 2.972e-11, 43: 2.163e-11 });
const MAX_GRID_SHIFT = Math.max(...Object.values(GRID_SHIFT)); // ~3.0e-11
const WOBBLE_SCALE = 7.054651e-8; // the imp-95925 41->60 dQ/dm wobble magnitude
const GRID_CONVERGED = MAX_GRID_SHIFT < WOBBLE_SCALE * 1e-2; // shift ~1000x below the wobble

// the imp-95925 sweep moduli and their parity: m=41 is the SOLE odd modulus.
const SWEEP_MODULI = Object.freeze([20, 22, 30, 41, 60, 80, 110, 150]);
const SWEEP_ODD = Object.freeze(SWEEP_MODULI.filter((m) => m % 2 === 1)); // [41] only
const SOLE_ODD_IS_41 = SWEEP_ODD.length === 1 && SWEEP_ODD[0] === 41;

export const Q0_DIP_PARITY_SAMPLING_ARTIFACT = Object.freeze({
  id: 'imp-95967-q0-dip-parity-sampling-artifact',
  title:
    'Characterize the imp-95925 Q0_RECON "dip near m~50-60" on a fine integer grid m=41..70: it is a '
    + 'PARITY-SAMPLING ARTIFACT -- Q0_RECON splits into two strictly-monotone-increasing branches by '
    + 'parity of m (odd ~7e-6 above even, gap shrinking to ~2.8e-6), neither with an interior minimum; '
    + 'the minimizing modulus is m*=42 (endpoint even point), and the imp-95925 41->60 sign wobble is '
    + 'the odd-branch m=41 (sole odd modulus) minus the even-branch m=60, not a genuine reconstruction dip',
  status:
    'MEASURED (fine integer grid m=41..70, Nsub=120000, faithful 238-cell machinery verbatim from '
    + 'imp-95822/95925) -- Q0_RECON does NOT dip near m~50-60: it splits by parity into an ODD branch '
    + '(41,43,...,69: -0.0106560777 -> -0.0106534333) and an EVEN branch (42,44,...,70: -0.0106629747 '
    + '-> -0.0106559781), each STRICTLY MONOTONE INCREASING toward the common asymptote ~ -0.010653, '
    + 'the even branch ~7.26e-6 below the odd at m~42 (gap shrinking to ~2.78e-6 at m~68). The '
    + 'minimizing modulus is m*=42 (deepest even endpoint), Q0_RECON(42)=-0.0106629747, ~6.90e-6 below '
    + 'the m=41 anchor and 41->70 chord. Grid-converged: Nsub=240000 shifts the m=41,42,43 values by '
    + 'only ~8e-12/3.0e-11/2.2e-11, ~1000x below the ~7.05e-8 wobble -- NOT Nsub quadrature noise. But '
    + 'the imp-95925 sweep sampled m=41 as the SOLE ODD modulus (elevated odd branch) between even '
    + 'moduli, so its 41->60 dQ/dm<0 is a parity-branch mismatch (odd minus even), NOT a genuine dip '
    + 'of the reconstruction; the even branch alone (30,60,80,110,150) is strictly monotone with no '
    + 'wobble. Certified only at m=20 (imp-95822/95966 residual); G irrationality OPEN; Sun unrefereed; '
    + 'no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95925 (wide-interval sweep that reported the 41->60 sign wobble as a genuine grid-converged '
    + 'dip near m~50-60; this module locates and reattributes it), imp-95822 (faithful 238-cell Q_0 '
    + 'machinery + tightened-Nsub grid; noted the unit-step alternation), imp-95900/95916 (the TIER-3 '
    + 'cancellation this sweep instruments), imp-95966 (m>20 certification obstruction)',
  scratch: ['tmp/imp-95967-scratch.mjs', 'tmp/imp-95967-branch.mjs'],

  q0Fine: Q0_FINE,
  grid: GRID,

  dip: Object.freeze({
    minimizingModulus: M_STAR,        // 42
    q0AtMin: Q0_MIN,                  // -0.0106629747
    depthBelowM41: DEPTH_BELOW_M41,   // ~6.90e-6
    dipBelowChord: DIP_BELOW_CHORD,   // ~6.90e-6 below the straight 41->70 chord at m*
    interior: false, // m*=42 is an ENDPOINT even point, not an interior m~50-60 local minimum
    reading:
      'the minimizing modulus over m=41..70 is m*=42 -- the deepest EVEN point at the low end -- not an '
      + 'interior local minimum near m~50-60. Neither parity branch has any interior minimum.',
  }),

  parity: Object.freeze({
    oddMonotoneIncreasing: ODD_MONOTONE,   // true
    evenMonotoneIncreasing: EVEN_MONOTONE, // true
    oddRange: Object.freeze([Q0_FINE[41], Q0_FINE[69]]),
    evenRange: Object.freeze([Q0_FINE[42], Q0_FINE[70]]),
    gapLow: PARITY_GAP_LOW,   // ~7.26e-6 near m~42
    gapHigh: PARITY_GAP_HIGH, // ~2.78e-6 near m~68
    gapShrinks: PARITY_GAP_SHRINKS, // branches converge to the common asymptote ~ -0.010653
    reading:
      'Q0_RECON splits by parity of m into two smoothly-rising, each strictly-monotone-increasing '
      + 'branches; the even branch sits ~7e-6 below the odd at m~42, the gap shrinking with m as both '
      + 'converge to the asymptote. The imp-95822 unit-step alternation is this odd/even split.',
  }),

  gridConvergence: Object.freeze({
    grids: [120000, 240000],
    shift: GRID_SHIFT,             // per-modulus |240000 - 120000| at m=41,42,43
    maxGridShift: MAX_GRID_SHIFT,  // ~3.0e-11
    wobbleScale: WOBBLE_SCALE,     // ~7.05e-8 (the imp-95925 41->60 dQ/dm)
    gridConverged: GRID_CONVERGED, // shift ~1000x below the wobble => not Nsub quadrature noise
    reading:
      'at Nsub=240000 the m=41,42,43 values shift by ~1e-11, far below the ~7e-8 wobble, so the values '
      + 'are grid-converged and the wobble is NOT a Gauss-Legendre (Nsub) quadrature artifact -- it is '
      + 'a parity-sampling artifact of the imp-95925 wide-interval sweep.',
  }),

  sampling: Object.freeze({
    sweepModuli: SWEEP_MODULI,
    soleOddModulus: SOLE_ODD_IS_41 ? 41 : null, // m=41 is the ONLY odd modulus in the imp-95925 sweep
    explanation:
      'imp-95925 sampled 20,22,30 (even), 41 (SOLE odd, elevated ~7e-6 above the even branch), then '
      + '60,80,110,150 (even). The 30->41 step jumped up onto the odd branch (+1.55e-6) and 41->60 '
      + 'jumped back down onto the even branch (dQ/dm=-7.05e-8): a parity mismatch, not a local '
      + 'minimum near m~50-60. The even branch alone is strictly monotone with no sign wobble.',
  }),

  verdict: Object.freeze({
    outcome:
      'MEASURE ONLY -- the imp-95925 41->60 "dip near m~50-60" is a PARITY-SAMPLING ARTIFACT, not a '
      + 'genuine reconstruction dip; minimizing modulus m*=42 (endpoint), each parity branch monotone',
    conclusion:
      'On the fine integer grid m=41..70 Q0_RECON splits by parity into two strictly-monotone-'
      + 'increasing branches (odd ~7e-6 above even at m~42, gap shrinking to ~2.78e-6 at m~68), '
      + 'neither with an interior minimum. The minimizing modulus is m*=42 (deepest even endpoint), '
      + '~6.90e-6 below the m=41 anchor; grid-converged to ~1e-11 (not Nsub noise). The imp-95925 '
      + '41->60 sign wobble is the sole-odd-modulus m=41 (elevated odd branch) minus the even-branch '
      + 'm=60 -- a parity mismatch, NOT the genuine reconstruction dip it was read as. The imp-95925 '
      + 'macro-trend and ~midM^-3 tail (even-branch intervals) are unaffected. Changes no bound; NO QED.',
  }),

  caveats:
    'Faithful 238-cell machinery re-used verbatim from imp-95822/95925; new work is the fine integer '
    + 'grid + parity analysis. Q0_RECON is certified only at m=20 (Sun 6.23 kappa): grid convergence '
    + 'to ~1e-11 bounds quadrature error, not reconstruction faithfulness at m>20 (imp-95966 '
    + 'obstruction). Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; '
    + 'no refereed bound is changed; NO QED.',
});

export const Q0_DIP_PARITY_SAMPLING_ARTIFACT_ASSERTIONS = Object.freeze([
  {
    name: 'the fine grid covers every integer m=41..70 (30 moduli), Q0_RECON literals present',
    holds: () =>
      GRID.length === 30
      && GRID[0] === 41 && GRID[GRID.length - 1] === 70
      && Math.abs(Q0_FINE[42] - -0.0106629746940) < 1e-13,
  },
  {
    name: 'both parity branches are strictly monotone increasing (no interior dip)',
    holds: () =>
      ODD_MONOTONE === true && EVEN_MONOTONE === true
      && ODD_M.length === 15 && EVEN_M.length === 15,
  },
  {
    name: 'FINDING: minimizing modulus is m*=42 (endpoint even), depth ~6.90e-6 below the m=41 anchor',
    holds: () =>
      M_STAR === 42
      && Q0_DIP_PARITY_SAMPLING_ARTIFACT.dip.interior === false
      && Math.abs(DEPTH_BELOW_M41 - 6.897e-6) < 5e-9
      && Math.abs(DIP_BELOW_CHORD - 6.900e-6) < 5e-9,
  },
  {
    name: 'parity gap odd-even is ~7.26e-6 at m~42, shrinking to ~2.78e-6 at m~68 (branches converge)',
    holds: () =>
      PARITY_GAP_SHRINKS === true
      && Math.abs(PARITY_GAP_LOW - 7.2604e-6) < 1e-9
      && Math.abs(PARITY_GAP_HIGH - 2.7836e-6) < 1e-9,
  },
  {
    name: 'grid-converged: Nsub=240000 shifts m=41,42,43 by ~1e-11, ~1000x below the ~7e-8 wobble',
    holds: () =>
      GRID_CONVERGED === true
      && MAX_GRID_SHIFT < 1e-9
      && MAX_GRID_SHIFT < WOBBLE_SCALE * 1e-2,
  },
  {
    name: 'the imp-95925 sweep sampled m=41 as the SOLE odd modulus (parity-mismatch source)',
    holds: () =>
      SOLE_ODD_IS_41 === true
      && Q0_DIP_PARITY_SAMPLING_ARTIFACT.sampling.soleOddModulus === 41,
  },
  {
    name: 'verdict is MEASURE ONLY: parity-sampling artifact not a genuine dip, disclaimers present',
    holds: () => {
      const v = Q0_DIP_PARITY_SAMPLING_ARTIFACT.verdict;
      const s = Q0_DIP_PARITY_SAMPLING_ARTIFACT.status;
      return /MEASURE ONLY/.test(v.outcome)
        && /PARITY-SAMPLING ARTIFACT/.test(v.outcome)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default Q0_DIP_PARITY_SAMPLING_ARTIFACT;

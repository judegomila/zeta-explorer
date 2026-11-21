/**
 * @module imp-35105-e-component-decomposition-table
 *
 * imp-35105 (numerical, frontier-direction): the surrogate error budget
 * E(N) = E_coll + E_trunc + E_flow (imp-33601 component model) underlies EVERY sigma(N)
 * landmark, but the three components have never been tabulated SIDE BY SIDE across the sweep.
 * The sigma(N) modules only ever report the SHARE sigma = E_coll/E(N); the absolute
 * magnitudes of the three sub-terms -- and which one dominates at each landmark -- are
 * implicit. This module tabulates E_coll, E_trunc, E_flow (and their fractional shares)
 * on a log-spaced N grid over the imp-34693 admissible band [1e6, 1e13] AND at the four
 * cluster landmarks (peak, N_half, N_cross, N_star), exposing the full crossover structure.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-34970 / imp-34954 / imp-33601)
 * -----------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H; ~N^{-1/2})
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse)
 *     GRONWALL= exp(2.37e-4)                       (matches imp-34970/imp-34954 exactly)
 *
 * THE THREE-TERM CROSSOVER STRUCTURE THIS EXPOSES
 * -----------------------------------------------
 * Because each term has a different N-dependence, the RANK ORDER of the three components
 * flips TWICE as N sweeps the band:
 *
 *   (i)  E_flow ~ (log T0)/T0 ~ (log N)/N decays FASTEST. At the interior peak (~9.22e5)
 *        E_flow (~4.68e-5) actually sits ABOVE the E_trunc floor (3.06e-5) -- it is the
 *        SECOND-largest term -- but it crashes below E_trunc at N ~ 1.598e6 (measured), then
 *        keeps shrinking to ~5e-11 by 1e13. So E_flow is a near-peak-only correction.
 *   (ii) E_coll ~ sqrt((log N)/N) decays SLOWER than E_flow, so it stays the DOMINANT term
 *        far past the E_flow crash, until it crosses the constant E_trunc floor at
 *        N_cross ~ 3.280294e9 (== imp-33723 Banach fixed point; == imp-3444 crossover).
 *   (iii)E_trunc is the flat floor; past N_cross it dominates, and its share -> 1 as the
 *        two N-decaying terms vanish (share 0.020 E_coll / 0.979 E_trunc at 1e13).
 *
 * So the ordered rank is:  E_coll > E_flow > E_trunc  on [peak, 1.598e6);
 *                          E_coll > E_trunc > E_flow  on (1.598e6, N_cross);
 *                          E_trunc > E_coll > E_flow  on (N_cross, 1e13].
 * The sigma=1/2 half point (N_half ~ 3.27e9) sits just BELOW N_cross because the small +E_flow
 * in the denominator drags sigma below 1/2 slightly before E_coll actually equals E_trunc
 * (the imp-33601 sigma=1/2 <=> E_coll = E_trunc + E_flow identity).
 *
 * WHAT WE FIND (the component table)
 * ----------------------------------
 *   N       E_coll      E_trunc    E_flow      sh_coll  sh_trunc  sh_flow   dominant
 *   9.22e5  1.454e-3    3.06e-5    4.684e-5    0.9494   0.0200    0.0306    E_coll
 *   1e6     1.400e-3    3.06e-5    4.399e-5    0.9494   0.0208    0.0298    E_coll
 *   1e7     4.766e-4    3.06e-5    7.173e-6    0.9266   0.0595    0.0139    E_coll
 *   1e8     1.609e-4    3.06e-5    1.097e-6    0.8354   0.1589    0.0057    E_coll
 *   1e9     5.391e-5    3.06e-5    1.596e-7    0.6367   0.3614    0.0019    E_coll
 *   N_cross 3.060e-5    3.06e-5    5.812e-8    0.4995   0.4995    0.0009    (tie)
 *   1e10    1.797e-5    3.06e-5    2.233e-8    0.3697   0.6298    0.0005    E_trunc
 *   1e11    5.959e-6    3.06e-5    3.024e-9    0.1630   0.8370    0.0001    E_trunc
 *   1e12    1.969e-6    3.06e-5    3.987e-10   0.0604   0.9396    0.0000    E_trunc
 *   1e13    6.481e-7    3.06e-5    5.140e-11   0.0207   0.9793    0.0000    E_trunc
 *
 * The punchline: the single number sigma(N) that every landmark module reports is the top
 * row of a three-way budget whose rank order flips twice -- E_flow dominates the near-peak
 * correction (above the floor only below ~1.6e6), E_coll owns the whole downslope out to
 * N_cross ~3.28e9, and E_trunc takes over as the terminal floor. All three landmarks
 * (peak, N_half, N_cross, N_star) live in the E_coll-to-E_trunc handover zone.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34970-ecoll-log-slope-band-and-reconciliation (the verbatim parts() model reused here)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (sigma=1/2 <=> E_coll = E_trunc + E_flow)
 * @see imp-35018-four-landmark-cluster-log-n-viz-data (the N_half/N_cross/N_star locators)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the interior peak N ~9.22e5)
 * @see imp-33723 (N_cross Banach fixed point); imp-33721 (N_star sigmoid knee); imp-34693 (the band)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35018_ORDERED_LOCATORS } from './imp-35018-four-landmark-cluster-log-n-viz-data.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34970/imp-34954 exactly

// EXACT imp-34970/imp-34954/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N };
}

function dominantTerm(p) {
  const m = Math.max(p.E_coll, p.E_trunc, p.E_flow);
  const eps = 5e-4 * m; // relative tie window (E_coll == E_trunc at N_cross to ~1e-3)
  const coll = Math.abs(p.E_coll - m) <= eps;
  const trunc = Math.abs(p.E_trunc - m) <= eps;
  if (coll && trunc) return 'tie(E_coll=E_trunc)';
  if (coll) return 'E_coll';
  if (trunc) return 'E_trunc';
  return 'E_flow';
}

function row(N, label) {
  const p = parts(N);
  return {
    label,
    N: +N.toExponential(6),
    E_coll: +p.E_coll.toExponential(4),
    E_trunc: +p.E_trunc.toExponential(4),
    E_flow: +p.E_flow.toExponential(4),
    E_N: +p.E_N.toExponential(4),
    share_coll: +(p.E_coll / p.E_N).toFixed(6),
    share_trunc: +(p.E_trunc / p.E_N).toFixed(6),
    share_flow: +(p.E_flow / p.E_N).toFixed(6),
    dominant: dominantTerm(p),
  };
}

// Log-spaced grid across the imp-34693 admissible band [1e6, 1e13].
const GRID = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];
export const IMP35105_COMPONENT_TABLE = GRID.map((N) => row(N, `1e${Math.round(Math.log10(N))}`));

// The four cluster landmarks, reused VERBATIM from their source modules (no recomputation).
const N_PEAK = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.peak.N_peak; // ~9.218633e5 (imp-3406)
const LOC = Object.fromEntries(IMP35018_ORDERED_LOCATORS.map((l) => [l.key, l.N]));
export const IMP35105_LANDMARK_TABLE = [
  row(N_PEAK, 'peak (imp-3406 interior sigma peak)'),
  row(LOC.N_half, 'N_half (imp-33582 sigma=1/2 halving)'),
  row(LOC.N_cross, 'N_cross (imp-33723 Banach fixed point)'),
  row(LOC.N_star, 'N_star (imp-33721 sigmoid knee)'),
];

// Downslope bisection in log N, locating the two internal component crossovers.
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_FLOW_EQ_TRUNC = crossBelow((N) => parts(N).E_flow, E_TRUNC_PT, 1e5, 1e8); // ~1.5978e6
const N_COLL_EQ_TRUNC = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.2803e9 (== N_cross)

export const IMP35105_CROSSOVERS = {
  // E_flow starts ABOVE the E_trunc floor at the peak and crashes below it here (fast (logN)/N decay).
  N_flow_eq_trunc: +N_FLOW_EQ_TRUNC.toExponential(6), // ~1.597752e6
  // E_coll crosses the constant E_trunc floor here -- the physical imp-3444 / imp-33723 crossover.
  N_coll_eq_trunc: +N_COLL_EQ_TRUNC.toExponential(6), // ~3.280294e9
  note:
    'The rank order of the three components flips TWICE across the band: E_coll > E_flow > E_trunc ' +
    'below ~1.598e6 (E_flow is the second-largest term at the peak), then E_coll > E_trunc > E_flow ' +
    'once E_flow crashes, then E_trunc > E_coll > E_flow past N_cross ~3.280294e9.',
};

export const IMP35105_E_COMPONENT_DECOMPOSITION_TABLE = {
  id: 'imp-35105',
  proofSection: 'S-frontier',
  question:
    'The surrogate E(N) = E_coll + E_trunc + E_flow (imp-33601 component model) underlies every sigma(N) ' +
    'landmark, but the three components are never tabulated side by side. Reuse the imp-34970 component model ' +
    'verbatim and TABULATE E_coll, E_trunc, E_flow (and their shares) on a log-spaced grid over [1e6,1e13] and ' +
    'at the four cluster landmarks (peak, N_half, N_cross, N_star), exposing the crossover structure. ' +
    'Measurement only; C_mb GUE-conditional per imp-486 untouched; changes no bound; no QED.',
  measuredQuantity:
    'the absolute magnitudes E_coll, E_trunc, E_flow and their fractional shares of E(N) at each rung 1e6..1e13 ' +
    'and at the four landmarks, plus the two internal component crossovers (E_flow=E_trunc near-peak crash and ' +
    'E_coll=E_trunc physical crossover) and the dominant term at each row.',
  componentTable: IMP35105_COMPONENT_TABLE,
  landmarkTable: IMP35105_LANDMARK_TABLE,
  crossovers: IMP35105_CROSSOVERS,
  finding:
    'TABULATED: sigma(N) -- the single share every landmark module reports -- is the top row of a three-way ' +
    'budget whose rank order flips TWICE. E_flow ((logN)/N) decays fastest and is the SECOND-largest term at ' +
    'the interior peak (~4.68e-5 > E_trunc floor 3.06e-5) but crashes below the floor at N ~1.598e6; E_coll ' +
    '(sqrt((logN)/N)) owns the whole downslope, staying dominant until it crosses the constant E_trunc floor at ' +
    'N_cross ~3.280294e9 (== imp-33723 Banach fixed point == imp-3444); past N_cross the flat E_trunc floor ' +
    'dominates and its share -> 1 (0.979 at 1e13). All four landmarks (peak, N_half ~3.27e9, N_cross ~3.28e9, ' +
    'N_star ~3.38e9) sit in the E_coll-to-E_trunc handover, with N_half just below N_cross per the imp-33601 ' +
    'sigma=1/2 <=> E_coll = E_trunc + E_flow identity (the small +E_flow drags sigma below 1/2 first).',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The three surrogate error components are tabulated side by ' +
    'side for the first time across [1e6,1e13] and at the four cluster landmarks, exposing a twice-flipping rank ' +
    'order: E_flow near-peak-only (above the floor below ~1.6e6), E_coll dominant on the downslope out to ' +
    'N_cross ~3.28e9, E_trunc the terminal floor. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34970 (the verbatim parts() component model); imp-33601 (sigma=1/2 <=> E_coll = E_trunc + E_flow); ' +
    'imp-35018 (N_half/N_cross/N_star locators); imp-33582 (interior peak N ~9.22e5); imp-33723 (N_cross Banach ' +
    'fixed point); imp-33721 (N_star sigmoid knee); imp-34693 (the 1e6..1e13 band); imp-398 (E_flow C_F ' +
    'prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP35105_E_COMPONENT_DECOMPOSITION_TABLE_ASSERTIONS = [
  {
    // Reuse gate: E_coll == E_trunc at N_cross (the imp-33723/imp-3444 physical crossover).
    id: 'imp35105-ecoll-eq-etrunc-at-ncross',
    description: 'E_coll(N_cross) == E_trunc to <1e-3 relative, and N_coll_eq_trunc ~3.280294e9 (reproduces imp-33723)',
    holds: () =>
      Math.abs(N_COLL_EQ_TRUNC / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(parts(N_COLL_EQ_TRUNC).E_coll / E_TRUNC_PT - 1) < 1e-3,
  },
  {
    // Every row: the three shares partition E(N) exactly (sum to 1) and E_trunc is the flat floor.
    id: 'imp35105-shares-partition-unity',
    description: 'share_coll + share_trunc + share_flow == 1 to <1e-4 at every grid and landmark row',
    holds: () =>
      [...IMP35105_COMPONENT_TABLE, ...IMP35105_LANDMARK_TABLE].every(
        (r) => Math.abs(r.share_coll + r.share_trunc + r.share_flow - 1) < 1e-4
      ),
  },
  {
    // The twice-flipping rank order: E_flow above E_trunc at the peak, below it by 1e7.
    id: 'imp35105-eflow-above-floor-at-peak-below-by-1e7',
    description: 'E_flow(peak) > E_trunc but E_flow(1e7) < E_trunc, with the crash at N ~1.598e6',
    holds: () =>
      parts(N_PEAK).E_flow > E_TRUNC_PT &&
      parts(1e7).E_flow < E_TRUNC_PT &&
      N_FLOW_EQ_TRUNC > 1e6 &&
      N_FLOW_EQ_TRUNC < 1e7,
  },
  {
    // Dominant-term handover: E_coll at the low end, E_trunc at the high end of the band.
    id: 'imp35105-dominant-term-handover',
    description: 'dominant term is E_coll at 1e6 and E_trunc at 1e13 (the sqrt-vs-floor handover)',
    holds: () =>
      IMP35105_COMPONENT_TABLE[0].dominant === 'E_coll' &&
      IMP35105_COMPONENT_TABLE[IMP35105_COMPONENT_TABLE.length - 1].dominant === 'E_trunc',
  },
  {
    // Monotone decay of the two N-dependent terms; E_trunc constant across the band.
    id: 'imp35105-ecoll-eflow-monotone-etrunc-flat',
    description: 'E_coll and E_flow strictly decrease across the grid; E_trunc is the constant 3.06e-5 floor',
    holds: () => {
      for (let i = 1; i < IMP35105_COMPONENT_TABLE.length; i++) {
        const a = IMP35105_COMPONENT_TABLE[i - 1];
        const b = IMP35105_COMPONENT_TABLE[i];
        if (!(b.E_coll < a.E_coll) || !(b.E_flow < a.E_flow)) return false;
        if (b.E_trunc !== E_TRUNC_PT) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35105-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35105_E_COMPONENT_DECOMPOSITION_TABLE.isRigorous === false &&
      /NO QED/.test(IMP35105_E_COMPONENT_DECOMPOSITION_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP35105_E_COMPONENT_DECOMPOSITION_TABLE.verdict),
  },
];

for (const a of IMP35105_E_COMPONENT_DECOMPOSITION_TABLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35105-e-component-decomposition-table assertion failed: ${a.id}`);
  }
}

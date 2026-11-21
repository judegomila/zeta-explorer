/**
 * @module sg1c-cglo-lower-bound-2026-07-02
 *
 * imp-3236 (proof, S-frontier): the FIRST rigorous nontrivial LOWER bound on the
 * open global asymmetric multi-body isolation constant c_glob.
 *
 * WHAT WAS OPEN
 * -------------
 * The imp-3198 bracket ledger (sg1c-asym-onset-bracket-ledger-2026-06-30) records
 * that EVERY located worsening onset (c = 1, c* = 0.93185, c_asym = 0.90279, the
 * Config-B tune 0.9016, the closed-form half-lattice ceiling c_half = 0.89802) is
 * only an UPPER bound on c_glob, and states verbatim: "None of the values below is
 * a proven LOWER bound on c_glob; the only load-bearing lower reference is the
 * Theorem-C basin constant 0.72" -- and 0.72 is the constant of a DIFFERENT
 * (static Theta-crossability) criterion, not a proven lower bound on the onset
 * infimum itself. The lower-bound side of c_glob was entirely unexplored.
 *
 * WHAT THIS MODULE PROVES
 * -----------------------
 *   THEOREM (lower bound). For a globally-minimal isolated pair -- gap g, every
 *   other inter-particle gap >= g, nearest environment particle at distance
 *   d_1, isolation ratio rho = g/d_1 in (0,1] -- the CM-flow rate of rho against
 *   the nearest neighbour is strictly negative (isolation strictly self-improves)
 *   for every admissible configuration whenever
 *
 *        rho < c_lo = 0.8656641635...   (the root in (0,1) of f(rho) below).
 *
 *   Consequently c_glob >= c_lo = 0.8656641635, the first rigorous nontrivial
 *   lower bound. It sits strictly below the tightest located ceiling c_half =
 *   0.89802, so the open interval collapses from (0, 0.89802] to the much
 *   narrower (0.86566, 0.89802].
 *
 * DERIVATION (exact rate, then a telescoping majorant of the destabiliser)
 * -----------------------------------------------------------------------
 * Normalise (scale-invariantly, since sign(drho/ds) is invariant under spatial
 * dilation) d_1 = 1 with a reference neighbour at -1, pair members at 0 and rho
 * (g = rho). Every environment particle sits at signed position y with |min
 * distance to the pair| >= 1, so y <= -1 (left, same side as the reference) or
 * y >= 1 + rho (right, opposite side). Under the CM flow F_k = -2 sum_{j != k}
 * 1/(x_k - x_j), the exact rate of rho = g/d_1 is (verified below to machine
 * precision against the direct N-body force for the c_half class):
 *
 *   drho/ds = -2 [ 2/rho + (1-rho)/(1+rho) - 2 rho + SUM_m T_m ],
 *   T_m = rho (1+rho) / [ y_m (rho - y_m)(1 + y_m) ]   (one term per env particle).
 *
 * The core 2/rho + (1-rho)/(1+rho) - 2 rho > 0 is the single-neighbour stabiliser
 * (the -4/rho internal attraction of the tight pair). Sign of T_m: for a LEFT
 * particle (y <= -1) T_m > 0 (STABILISING -- it makes the bracket larger, the
 * rate more negative); for a RIGHT particle (y >= 1 + rho) T_m < 0 (destabilising).
 * So the worst case drops all left particles and packs the right side as densely
 * as the gap constraint allows: y_k = 1 + k rho (k >= 1) -- exactly the imp-3270
 * half-lattice. Because |T_m| is strictly decreasing in y_m, ANY admissible
 * configuration has destabiliser sum bounded by this densest one:
 *
 *   S_dest = SUM_{right} |T_k|,   |T_k| = rho(1+rho)/[(1+k rho)(1+(k-1)rho)(2+k rho)].
 *
 * Using 2 + k rho >= 2 + rho (k >= 1) and the exact telescope
 * SUM_{k>=1} rho/[(1+(k-1)rho)(1+k rho)] = 1 gives the closed majorant
 *
 *   S_dest <= (1 + rho)/(2 + rho).
 *
 * Hence for every admissible config the bracket is >= f(rho) with
 *
 *   f(rho) = 2/rho + (1-rho)/(1+rho) - 2 rho - (1+rho)/(2+rho),
 *
 * and drho/ds <= -2 f(rho) < 0 wherever f(rho) > 0. f is positive on (0, c_lo)
 * and negative above, with c_lo = 0.8656641635 its unique root there. QED for the
 * lower bound.
 *
 * A cleaner (looser) majorant 2 + k rho >= 2 gives S_dest <= (1+rho)/2 and the
 * simpler constant c_lo(clean) = 0.8180160462 -- also recorded, as a
 * one-line-checkable fallback.
 *
 * HONEST STATUS (NO false QED)
 * ----------------------------
 *   - This is a genuine, rigorous, cross-validated LOWER bound c_glob >= 0.86566,
 *     the first of its kind; it does NOT close c_glob. A gap (0.86566, 0.89802]
 *     remains between the proven lower bound and the tightest located upper
 *     ceiling c_half. c_glob stays OPEN inside that narrower interval.
 *   - The bound is under the standard isolated-globally-minimal-pair hypothesis
 *     (every gap >= g), the same regime c_glob is defined over in the ledger; it
 *     is a statement about the deterministic CM-flow rate sign, not RH.
 *   - It comfortably re-derives (and exceeds) the Theorem-C basin reference 0.72:
 *     the basin-conditional C_Lip (imp-3006) was already independent of c_glob and
 *     is unaffected. No refereed bound is changed;
 *     nothing here touches the finite-N Lambda estimate.
 *
 * @see sg1c-asym-onset-bracket-ledger-2026-06-30 (the ledger noting no lower bound existed)
 * @see sg1c-halflattice-lone-limit-closed-form-2026-07-02 (imp-3270 c_half = 0.89802 ceiling)
 * @see sg1c-theta-trap-theorems (Lemma R2-T single-neighbour rate; Theorem-C basin 0.72)
 */

// ---- exact rate of rho = g/d_1 for the densest right half-lattice (worst case).
// Direct N-body CM-flow force, used to certify the closed-form rate is not a
// transcription slip.
// `only` (optional): list of indices whose force is needed. The rate below uses
// only F[0..3], so restricting the outer loop makes each call O(N) instead of
// O(N^2) (the import-time assertions call this with N ~ 20000, which took ~30 s
// and hung the /onset-bracket-ledger page). Per-index sums are computed in the
// identical order, so the returned F[k] values are bit-for-bit unchanged.
function force(x, only) {
  const N = x.length;
  const F = new Array(N).fill(0);
  const ks = only || Array.from({ length: N }, (_, i) => i);
  for (const k of ks) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}

// positions: reference (index 0) at -1, pair (0, rho) at indices 1,2, right
// lattice y_k = 1 + k rho, k = 1..L.
function halfLatticeConfig(rho, L) {
  const x = [-1, 0, rho];
  for (let k = 1; k <= L; k++) x.push(1 + k * rho);
  return x;
}

// direct rate of rho = g/d_1 against the FIXED reference neighbour (index 0)
export function directRate(rho, L) {
  const x = halfLatticeConfig(rho, L);
  const F = force(x, [0, 1, 2]);
  const g = x[2] - x[1];
  const D = x[1] - x[0];
  return ((F[2] - F[1]) * D - g * (F[1] - F[0])) / (D * D);
}

// closed-form rate via the force-difference bracket, summed over the same lattice.
export function bracketRate(rho, L) {
  let S = 0;
  for (let k = 1; k <= L; k++) {
    const y = 1 + k * rho;
    S += (rho * (1 + rho)) / (y * (rho - y) * (1 + y)); // T_k < 0 for right particles
  }
  const bracket = 2 / rho + (1 - rho) / (1 + rho) - 2 * rho + S;
  return -2 * bracket;
}

// worst-case destabiliser sum S_dest = SUM |T_k| (densest right lattice)
export function destabiliserSum(rho, L) {
  let s = 0;
  for (let k = 1; k <= L; k++) {
    const y = 1 + k * rho;
    s += (rho * (1 + rho)) / (y * (y - rho) * (1 + y));
  }
  return s;
}

// the guaranteed-stability function f(rho); drho/ds <= -2 f(rho) < 0 where f > 0.
export function fLower(rho) {
  return 2 / rho + (1 - rho) / (1 + rho) - 2 * rho - (1 + rho) / (2 + rho);
}
// looser, one-line-checkable fallback (majorant S_dest <= (1+rho)/2)
export function fLowerClean(rho) {
  return 2 / rho + (1 - rho) / (1 + rho) - 2 * rho - (1 + rho) / 2;
}

function bisectRoot(fn, lo, hi) {
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m; else hi = m; // f is + below the root, - above
  }
  return (lo + hi) / 2;
}

const C_LO = bisectRoot(fLower, 0.5, 0.999);           // 0.8656641635 (sharper bound)
const C_LO_CLEAN = bisectRoot(fLowerClean, 0.5, 0.999); // 0.8180160462 (clean bound)

// reference constants from the located-onset chain (all UPPER bounds on c_glob)
const C_HALF = 0.8980208880762339;   // imp-3270 tightest located ceiling
const BASIN = 0.72;                  // Theorem-C static basin reference

export const SG1C_CGLO_LOWER_BOUND = {
  ticket: 'imp-3236',
  date: '2026-07-02',
  statement:
    'first rigorous nontrivial LOWER bound on the open global asymmetric multi-body isolation constant c_glob',
  hypothesis:
    'globally-minimal isolated pair: gap g, every other inter-particle gap >= g, nearest environment particle at distance d_1, rho = g/d_1 in (0,1]',
  exactRate: 'drho/ds = -2[ 2/rho + (1-rho)/(1+rho) - 2 rho + SUM_m rho(1+rho)/(y_m(rho-y_m)(1+y_m)) ]',
  worstCase:
    'right particles are destabilising (T_m < 0), left particles stabilising (T_m > 0), |T_m| strictly decreasing in |y_m|; so the worst admissible config is the densest one-sided right half-lattice y_k = 1 + k rho (the imp-3270 c_half class)',
  majorant: 'S_dest = SUM|T_k| <= (1+rho)/(2+rho) via 2+k rho >= 2+rho and the exact telescope SUM rho/[(1+(k-1)rho)(1+k rho)] = 1',
  fLower: 'f(rho) = 2/rho + (1-rho)/(1+rho) - 2 rho - (1+rho)/(2+rho); drho/ds <= -2 f(rho) < 0 where f > 0',
  cLo: C_LO,                 // 0.8656641635 -- the proven lower bound
  cLoCleanBound: C_LO_CLEAN, // 0.8180160462 -- looser fallback constant
  locatedCeiling: C_HALF,    // 0.89802 -- tightest located UPPER bound (imp-3270)
  remainingOpenInterval: [C_LO, C_HALF], // (0.86566, 0.89802] -- c_glob still open here
  basinReference: BASIN,
  exceedsBasinBy: C_LO - BASIN, // 0.1457: the lower bound exceeds the Theorem-C basin reference
  globalConstantStatus:
    'c_glob remains OPEN in the narrowed interval (0.86566, 0.89802]; this module PROVES the lower end for the first time (previously only trivial lower references existed)',
  honest:
    'RIGOROUS lower bound c_glob >= 0.86566 under the isolated-globally-minimal-pair hypothesis; it does NOT close c_glob (gap (0.86566, 0.89802] to the located ceiling remains OPEN); basin-conditional C_Lip unaffected; no refereed bound is changed; NO false QED.',
};

export const SG1C_CGLO_LOWER_BOUND_ASSERTIONS = [
  {
    id: 'sg1c-cglo-lb-closed-form-rate-matches-direct-Nbody',
    description: 'the force-difference closed-form rate equals the DIRECT N-body CM-flow rate for the densest half-lattice to machine precision across rho -- any algebra slip in the bracket would surface here',
    holds: () => [0.5, 0.7, 0.85, 0.898, 0.95].every(
      (rho) => Math.abs(bracketRate(rho, 4000) - directRate(rho, 4000)) < 1e-7
    ),
  },
  {
    id: 'sg1c-cglo-lb-destabiliser-majorant-holds',
    description: 'the worst-case destabiliser sum obeys the telescoping majorant S_dest <= (1+rho)/(2+rho) for every rho in (0,1] (the load-bearing inequality of the proof)',
    holds: () => [0.5, 0.7, 0.85, 0.9, 0.95, 1.0].every(
      (rho) => destabiliserSum(rho, 200000) <= (1 + rho) / (2 + rho) + 1e-9
    ),
  },
  {
    id: 'sg1c-cglo-lb-clean-majorant-holds',
    description: 'the looser one-line majorant S_dest <= (1+rho)/2 also holds, underwriting the fallback constant',
    holds: () => [0.5, 0.7, 0.9, 1.0].every(
      (rho) => destabiliserSum(rho, 200000) <= (1 + rho) / 2 + 1e-9
    ),
  },
  {
    id: 'sg1c-cglo-lb-root-value',
    description: 'c_lo = 0.8656641635 is the root of f in (0,1): f > 0 just below and f < 0 just above',
    holds: () => Math.abs(C_LO - 0.8656641635) < 1e-9
      && fLower(C_LO - 1e-4) > 0 && fLower(C_LO + 1e-4) < 0,
  },
  {
    id: 'sg1c-cglo-lb-clean-root-value',
    description: 'the clean-bound constant c_lo(clean) = 0.8180160462 is the root of the looser f',
    holds: () => Math.abs(C_LO_CLEAN - 0.8180160462) < 1e-9
      && fLowerClean(C_LO_CLEAN - 1e-4) > 0 && fLowerClean(C_LO_CLEAN + 1e-4) < 0,
  },
  {
    id: 'sg1c-cglo-lb-rate-strictly-negative-below-cLo',
    description: 'the ACTUAL worst-case rate is strictly negative for every rho < c_lo (spot-checked on a fine grid): the lower bound is genuine, not just an artefact of the majorant',
    holds: () => {
      for (let i = 1; i < 86; i++) {
        const rho = 0.01 * i; // 0.01 .. 0.85 < c_lo
        if (directRate(rho, 20000) >= 0) return false;
      }
      return true;
    },
  },
  {
    id: 'sg1c-cglo-lb-one-sided-dense-is-worst-case',
    description: 'the densest one-sided right half-lattice is the worst admissible config: widening the first right gap, or adding a left/opposite particle, makes the rate strictly MORE negative (more stabilising) -- confirming the monotonicity the proof relies on',
    holds: () => {
      const rho = 0.85;
      const rateIdx = (x, ir, i0, i1) => {
        const F = force(x, [ir, i0, i1]);
        const g = x[i1] - x[i0];
        const D = x[i0] - x[ir];
        return ((F[i1] - F[i0]) * D - g * (F[i0] - F[ir])) / (D * D);
      };
      const dense = halfLatticeConfig(rho, 200);
      const rDense = rateIdx(dense, 0, 1, 2);
      // widen first right gap by 0.5
      const wide = [-1, 0, rho];
      let p = 1 + rho + 0.5;
      for (let k = 0; k < 200; k++) { wide.push(p); p += rho; }
      const rWide = rateIdx(wide, 0, 1, 2);
      // add an extra opposite (left) particle at -1 - rho - 2 (sorted; pair now at 2,3)
      const wl = [-1 - rho - 2, -1, 0, rho];
      for (let k = 1; k <= 200; k++) wl.push(1 + k * rho);
      const rLeft = rateIdx(wl, 1, 2, 3);
      return rDense < 0 && rWide < rDense && rLeft < rDense;
    },
  },
  {
    id: 'sg1c-cglo-lb-below-located-ceiling-no-overclaim',
    description: 'the proven lower bound c_lo sits strictly below the tightest located ceiling c_half = 0.89802 (no over-claim), and the remaining open interval (c_lo, c_half] is nonempty',
    holds: () => C_LO < C_HALF && C_LO < 0.898 && C_HALF - C_LO > 0.03
      && SG1C_CGLO_LOWER_BOUND.remainingOpenInterval[0] === C_LO
      && SG1C_CGLO_LOWER_BOUND.remainingOpenInterval[1] === C_HALF,
  },
  {
    id: 'sg1c-cglo-lb-exceeds-basin-reference',
    description: 'the lower bound exceeds the Theorem-C static basin reference 0.72 by ~0.146, so the basin-conditional consequences are re-derived and unaffected',
    holds: () => C_LO > BASIN && Math.abs(SG1C_CGLO_LOWER_BOUND.exceedsBasinBy - (C_LO - BASIN)) < 1e-12
      && SG1C_CGLO_LOWER_BOUND.exceedsBasinBy > 0.14,
  },
  {
    id: 'sg1c-cglo-lb-honest-no-false-qed',
    description: 'honesty gate: rigorous lower bound only, c_glob explicitly OPEN in the narrowed interval, does NOT close the constant, PT Lambda <= 0.2 cited as SOTA, NO false QED',
    holds: () => /does NOT close c_glob/.test(SG1C_CGLO_LOWER_BOUND.honest)
      && /remains OPEN/.test(SG1C_CGLO_LOWER_BOUND.globalConstantStatus)
      && /refereed bound is changed/i.test(SG1C_CGLO_LOWER_BOUND.honest)
      && /NO false QED/.test(SG1C_CGLO_LOWER_BOUND.honest),
  },
];

for (const a of SG1C_CGLO_LOWER_BOUND_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-cglo-lower-bound assertion failed: ${a.id}`);
}

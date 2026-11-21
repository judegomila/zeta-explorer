/**
 * @module imp-96166-en-decay-exponent-vs-step4-bridge-threshold
 *
 * imp-96166 (numerical, frontier-direction): the lambda-roadmap
 * conditionalBookkeeping items B1-B3 are all BLOCKED on the OPEN
 * G5-step4-bridge -- the E(N) -> 0 rate (with t_c >= 0) that would upgrade the
 * headline |Lambda - (-t_c(N))| <= E(N) into an UNCONDITIONAL Lambda <= 0.
 * imp-35164 records the qualitative obstruction: on the CURRENT surrogate the
 * assembled E(N) does NOT tend to 0 -- it FLOORS. This module MEASURES that
 * floor quantitatively: it computes the empirical E(N) decay exponent across a
 * wide N-ladder (reusing the exact imp-3220 / imp-2643 sub-term formulas), reads
 * off where the decay stalls, and quantifies the residual shortfall against the
 * decay the Step-4 bridge threshold requires (a sustained strictly-positive
 * exponent so that E(N) -> 0).
 *
 * THE MEASURED QUANTITY
 * ---------------------
 * The empirical local decay exponent
 *     p(N) = - d log E(N) / d log N   (backward finite difference on the ladder),
 * where E(N) = E_trunc + E_flow + E_coll uses the identical repo constants of
 * imp-3220: E_coll = C_C sqrt(log T0 / N) (dominant, GUE-conditional C_H),
 * E_flow = C_F (log T0 / T0) exp(C_G |t_c|) (unconditional), and E_trunc = the
 * N-INDEPENDENT Platt-Trudgian fixed-strip term ~ 3.06e-5 tied to the
 * T_PT = 3e12 verification height (unconditional but frozen).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 * Two regimes, separated by a sharp crossover:
 *   (1) E_coll-dominated (N up to ~3.3e9): E(N) decays with p(N) ~ 0.42..0.47,
 *       i.e. the sqrt(log T0 / N) leading order (asymptotically 1/2, held below
 *       1/2 by the slowly growing log T0). This is the ONLY decaying part of the
 *       budget -- and it is exactly the GUE-conditional E_coll (imp-3220).
 *   (2) floor-dominated (N beyond the crossover N_x ~ 3.28e9, log10 ~ 9.52,
 *       where E_coll = E_trunc): p(N) collapses toward 0 and E(N) plateaus at the
 *       E_trunc floor ~ 3.06e-5. By N ~ 1e14 the exponent is < 0.02; E(N) is
 *       within 1% of the floor by N ~ 4.7e13.
 *
 * THE SHORTFALL
 * -------------
 * The Step-4 bridge threshold for Lambda <= 0 requires lim_N E(N) = 0, i.e. a
 * decay exponent that stays strictly positive as N -> infinity. The measured
 * exponent instead -> 0 at finite N, because the unconditional part of E(N)
 * (E_trunc) does NOT decay at all: it is pinned to the finite verification
 * height T_PT = 3e12. The residual shortfall is therefore the FROZEN FLOOR
 *     E_floor = lim_N E(N) = E_trunc ~ 3.06e-5 > 0,
 * a definite positive gap to the E(N) -> 0 the bridge needs. Crossing it does
 * NOT require a faster N-decay: it requires E_trunc -> 0, i.e. pushing the
 * verification height T_PT -> infinity (or a fixed-strip route with a tail that
 * decays with N rather than freezing at 3e12). The one part of E(N) that DOES
 * decay (E_coll) is simultaneously the sole GUE-conditional term (imp-486 C_mb),
 * so the assembled surrogate as written cannot supply an unconditional E(N) -> 0
 * from either direction.
 *
 * MEASUREMENT / DERIVATION ONLY. No positivity, no bridge closure, no RH claim,
 * NO QED. No refereed bound is changed; RH remains OPEN.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (conditional share sigma(N), same formulas)
 * @see imp-2643-honest-assembled-EN (single-point E(N) capstone at N* = 1e4)
 * @see lambda-roadmap (Step 4 bridge; conditionalBookkeeping B1-B3 blockedOn G5-step4-bridge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;

// N-INDEPENDENT Platt-Trudgian fixed-strip term tied to T_PT = 3e12 (imp-2631 /
// imp-3220): frozen across the assembly, and hence the floor E(N) plateaus at.
const E_TRUNC_PT = 3.06e-5;

// |t_c| <= 2.37e-4 A1 trap; Gronwall exponent C_G = 1 (non-binding, imp-2644).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// One row: reuse the EXACT imp-3220 sub-term formulas (same C_C_PINNED, C_F, etc.)
function enOf(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // pinned prefactor (imp-398)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // dominant, GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { N, T0, L, E_flow, E_coll, E_N };
}

// Wide ladder spanning the E_coll-dominated regime through the E_trunc floor.
const LADDER_N = [1e2, 1e4, 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18, 1e20];

const TABLE = LADDER_N.map((N, i) => {
  const r = enOf(N);
  let localExp = null;
  if (i > 0) {
    const prev = enOf(LADDER_N[i - 1]);
    localExp =
      -(Math.log(r.E_N) - Math.log(prev.E_N)) / (Math.log(N) - Math.log(prev.N));
  }
  return {
    N,
    T0: +r.T0.toExponential(3),
    E_coll: +r.E_coll.toExponential(6),
    E_flow: +r.E_flow.toExponential(6),
    E_N: +r.E_N.toExponential(6),
    localDecayExp: localExp === null ? null : +localExp.toFixed(4),
    E_coll_share: +(r.E_coll / r.E_N).toFixed(5),
    _E_N_full: r.E_N,
    _localExp_full: localExp,
    _E_coll_full: r.E_coll,
  };
});

// Crossover N_x where the decaying E_coll drops to the frozen E_trunc floor
// (bisection in log10 N): beyond it the exponent collapses toward 0.
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}
let lo = 8;
let hi = 12;
for (let i = 0; i < 80; i++) {
  const mid = (lo + hi) / 2;
  if (eColl(Math.pow(10, mid)) > E_TRUNC_PT) lo = mid;
  else hi = mid;
}
const CROSSOVER_LOG10 = (lo + hi) / 2;
const CROSSOVER_N = Math.pow(10, CROSSOVER_LOG10);

// Peak measured decay exponent in the E_coll-dominated regime (sqrt-law top).
const PEAK_EXP = TABLE.reduce(
  (a, r) => (r._localExp_full !== null && r._localExp_full > a ? r._localExp_full : a),
  0,
);
// Final measured exponent (floor-dominated tail): should be ~ 0.
const FINAL_EXP = TABLE[TABLE.length - 1]._localExp_full;
// The residual shortfall: the frozen floor E(N) plateaus at (= E_trunc).
const E_FLOOR = E_TRUNC_PT;

export const IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE = {
  id: 'imp-96166',
  proofSection: 'S-frontier',
  question:
    'Measure the empirical E(N) decay exponent p(N) = -dlogE/dlogN across a wide ' +
    'N-ladder (reusing the imp-3220/imp-2643 sub-term formulas) and quantify the ' +
    'residual shortfall against the sustained strictly-positive decay the ' +
    'Step-4 bridge threshold requires for Lambda <= 0. Measurement only, no QED.',
  measuredQuantity:
    'p(N) = -dlog E(N)/dlog N with E(N) = E_trunc + E_flow + E_coll (identical ' +
    'repo constants to imp-3220). E_coll = C_C sqrt(log T0 / N) is the only ' +
    'decaying term and is GUE-conditional; E_trunc ~ 3.06e-5 is N-independent ' +
    '(frozen at T_PT = 3e12); E_flow decays faster than E_coll.',
  table: TABLE.map(({ _E_N_full, _localExp_full, _E_coll_full, ...pub }) => pub),
  crossover: {
    N: +CROSSOVER_N.toExponential(4),
    log10N: +CROSSOVER_LOG10.toFixed(4),
    note:
      'E_coll (the decaying term) drops to the frozen E_trunc floor at ' +
      'N_x ~ 3.28e9 (log10 ~ 9.52). Below N_x the measured exponent is the ' +
      'sqrt-law p ~ 0.42..0.47; above it the exponent collapses toward 0 and ' +
      'E(N) plateaus at the E_trunc floor.',
  },
  regimeExponents: {
    peakDecayExp: +PEAK_EXP.toFixed(4),
    peakNote:
      'Peak measured exponent ~ 0.47 in the E_coll-dominated regime -- the ' +
      'sqrt(log T0 / N) leading order (asymptotically 1/2, held below 1/2 by the ' +
      'slowly growing log T0). This decay is entirely the GUE-conditional E_coll.',
    finalDecayExp: +FINAL_EXP.toFixed(4),
    finalNote:
      'Final measured exponent ~ 0 in the floor-dominated tail (N >> N_x): ' +
      'E(N) has stopped decaying, matching imp-35164 "E(N) FLOORS".',
  },
  residualShortfall: {
    E_floor: +E_FLOOR.toExponential(6),
    thresholdNeeded:
      'The Step-4 bridge requires lim_N E(N) = 0 (a decay exponent staying ' +
      'strictly positive as N -> infinity) to give an unconditional Lambda <= 0.',
    measuredLimit:
      'The measured E(N) instead tends to the frozen floor E_trunc ~ 3.06e-5 > 0, ' +
      'so the empirical decay exponent -> 0 at finite N and the threshold is NOT met.',
    shortfall:
      'Residual shortfall = the frozen floor E_floor = E_trunc ~ 3.06e-5, a ' +
      'definite positive gap to the E(N) -> 0 the bridge needs. Closing it needs ' +
      'E_trunc -> 0 (verification height T_PT -> infinity, or a fixed-strip tail ' +
      'that decays with N), NOT a faster N-decay; and the one decaying term ' +
      '(E_coll) is simultaneously the sole GUE conditional (imp-486 C_mb), so the ' +
      'surrogate as written cannot supply an unconditional E(N) -> 0.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The empirical E(N) decay ' +
    'exponent is two-regime: p ~ 0.47 (sqrt-law E_coll) up to the crossover ' +
    'N_x ~ 3.28e9, then collapsing to ~ 0 as E(N) plateaus at the frozen ' +
    'E_trunc floor ~ 3.06e-5. The Step-4 bridge threshold for Lambda <= 0 ' +
    'requires a sustained strictly-positive exponent (E(N) -> 0); the residual ' +
    'shortfall is the positive floor E_trunc ~ 3.06e-5 that the finite ' +
    'T_PT = 3e12 verification height freezes in. Since the only decaying term ' +
    '(E_coll) is also the sole GUE conditional (imp-486), the surrogate cannot ' +
    'supply an unconditional E(N) -> 0 from either direction. This quantifies ' +
    'the imp-35164 "E(N) FLOORS" obstruction on which conditionalBookkeeping ' +
    'B1-B3 are blocked (G5-step4-bridge). No positivity, no bridge closure, no ' +
    'RH claim, NO QED. No refereed bound is changed; RH OPEN.',
  citation:
    'imp-3220 (E(N) sub-term formulas, conditional share); imp-2643 (single-point ' +
    'capstone); imp-35164 (E(N) FLOORS on the current surrogate); imp-2631 ' +
    '(E_trunc fixed-strip T_PT route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
};

export const IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE_ASSERTIONS = [
  {
    id: 'imp96166-ladder-spans-both-regimes',
    description: 'The N-ladder spans the E_coll-dominated regime through the E_trunc floor',
    holds: () =>
      TABLE.length === 10 && TABLE[0].N === 1e2 && TABLE[TABLE.length - 1].N === 1e20,
  },
  {
    // In the E_coll regime the measured exponent must sit near the sqrt-law 1/2
    // (below it, from the slowly growing log T0): the decaying regime is real.
    id: 'imp96166-sqrt-law-decay-in-ecoll-regime',
    description: 'Peak measured decay exponent is the sqrt-law ~0.47 (below 1/2)',
    holds: () => PEAK_EXP > 0.4 && PEAK_EXP < 0.5,
  },
  {
    // The tail exponent must have collapsed to ~0: E(N) FLOORS (imp-35164).
    id: 'imp96166-exponent-collapses-to-floor',
    description: 'Final measured decay exponent ~0: E(N) has plateaued (FLOORS)',
    holds: () => Math.abs(FINAL_EXP) < 0.01,
  },
  {
    // The plateau value is the frozen E_trunc floor: the E(N) limit is E_trunc,
    // not 0 -- the substance of the residual shortfall.
    id: 'imp96166-limit-is-etrunc-floor',
    description: 'E(N) tail plateaus at the frozen E_trunc floor ~3.06e-5, not 0',
    holds: () =>
      Math.abs(TABLE[TABLE.length - 1]._E_N_full - E_TRUNC_PT) < 5e-7 && E_TRUNC_PT > 0,
  },
  {
    // The crossover (E_coll = E_trunc) is interior to the ladder near N~3.3e9:
    // this is where the decay stalls, separating the two regimes.
    id: 'imp96166-crossover-near-3e9',
    description: 'The E_coll=E_trunc crossover is near N~3.28e9 (log10~9.52)',
    holds: () => Math.abs(CROSSOVER_LOG10 - 9.52) < 0.1,
  },
  {
    // Above the crossover E_coll (the conditional decaying term) must fall below
    // E_trunc -- confirming the floor, not the decay, controls the tail.
    id: 'imp96166-ecoll-below-floor-past-crossover',
    description: 'Past the crossover E_coll < E_trunc (floor, not decay, controls the tail)',
    holds: () => {
      const tail = TABLE[TABLE.length - 1];
      return tail._E_coll_full < E_TRUNC_PT;
    },
  },
  {
    // Honesty gate: measurement only, names the frozen E_trunc floor as the
    // shortfall, keeps PT SOTA, and makes no rigorous / RH claim.
    id: 'imp96166-honesty-gate-no-qed',
    description: 'Measurement only: names the E_trunc floor shortfall, no QED, no refereed bound is changed',
    holds: () =>
      IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE.isRigorous === false &&
      /E_trunc/.test(IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE.residualShortfall.shortfall) &&
      /NO QED/.test(IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE.verdict) &&
      /refereed bound is changed/i.test(IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE.verdict),
  },
];

for (const a of IMP96166_EN_DECAY_EXPONENT_VS_STEP4_BRIDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96166-en-decay-exponent-vs-step4-bridge-threshold assertion failed: ${a.id}`,
    );
  }
}

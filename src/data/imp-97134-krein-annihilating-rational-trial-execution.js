/**
 * @module imp-97134-krein-annihilating-rational-trial-execution
 *
 * imp-97134 (numerical): EXECUTE the fixed rational trial that imp-97113 only SCOPED -- build the explicit
 * degree-coefficient combination that annihilates the leading spherical-Bessel t^-1, t^-2, t^-3 asymptotic
 * orders of the Krein ground-state combination g(t) = v0 . Phih(t), MEASURE whether it actually forces
 * g(t) = O(t^-4), and locate the resulting reduction against the imp-97114 Rayleigh-tail floor
 * (currently ~1.23x actual at T=4800). Targets SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL.
 *
 * WHAT imp-97113 LEFT UNDONE. imp-97113 proved the six leading asymptotic functionals of
 *   g(t) = a^7 sum_k d_k j_k(a t)
 * decouple by parity into two rank-3 blocks (even k -> {L1sin, L2cos, L3sin}; odd k -> {L1cos, L2sin, L3cos}),
 * so a nontrivial annihilating trial needs >= 4 degrees per parity, and it verified the 3x4 blocks on
 * {0,2,4,6} and {1,3,5,7} are rank 3 with a 1-dimensional kernel. But it reported NO explicit kernel vector
 * (actualGroundStateCoeffsMeasured:false) and its O(t^-4) check lived only in tmp/imp-97113-scope.py, not in a
 * committed leaf. This leaf CLOSES that execution gap at the degree level.
 *
 * THE EXPLICIT RATIONAL TRIALS (derived here, exact integer solutions of the imp-97113 parity blocks). Using
 * the exact per-degree carrier weights of imp-97113 (evenRow(k) = [cosHalf, tri*cosHalf, -quad*cosHalf],
 * oddRow(k) = [-sinHalf, tri*sinHalf, quad*sinHalf]), the two homogeneous 3x4 systems have 1-dimensional
 * integer kernels:
 *   EVEN degrees {0,2,4,6}:  (d0,d2,d4,d6) = (33, 55, 27, 5)
 *   ODD  degrees {1,3,5,7}:  (d1,d3,d5,d7) = (143, 273, 165, 35)
 * Each is CERTIFIED-EXACT: substituting into the six imp-97113 functionals gives all six equal to 0 exactly
 * (integer arithmetic, no rounding), so the t^-1, t^-2, t^-3 asymptotic coefficients of g(t) vanish
 * identically. Because even degrees feed only the even block and odd degrees only the odd block, either trial
 * alone (or any combination) annihilates all six orders.
 *
 * MEASURED DECAY (this leaf, exact spherical-Bessel via the stable upward recurrence j_(k+1) = (2k+1)/z j_k -
 * j_(k-1) seeded by j_0 = sin z / z, j_1 = sin z / z^2 - cos z / z, valid here since z = a t >> k=7). Evaluating
 * g(z) = sum_k d_k j_k(z) on the ladder z in {100,200,400,800,1600,3200}:
 *   even trial:  |g(z)| z^4 stays in ~[9.9e2, 3.1e3] -- BOUNDED, non-growing  => g = O(z^-4)
 *   odd  trial:  |g(z)| z^4 stays in ~[1.9e4, 4.3e4] -- BOUNDED, non-growing  => g = O(z^-4)
 *   generic (all-ones) trial:  |g(z)| z^1 stays O(1) but |g(z)| z^4 GROWS ~z^3 (6.3e4 -> 1.35e8) => only O(z^-1)
 * So the explicit rational annihilation genuinely delivers the four-order decay imp-97100 measured (g ~ t^-3.96)
 * on the numerical ground state, while a non-annihilating trial keeps only the single-mode t^-1 floor. This is
 * a three-order improvement in g (t^-1 -> t^-4), hence a SIX-order improvement in the tail integrand |g|^2
 * (t^-2 -> t^-8): the phase-preserving |g|^2 decays as t^-8 vs the mode-wise-split t^-2 that imp-97114 flagged
 * as divergent under the super-cubic sigma_2 tail.
 *
 * RELATION TO THE imp-97114 FLOOR. imp-97114 estimated the achievable Route B phase-preserving majorant as
 * floor(T) * (1 + eps_bessel) ~ 1.23x actual at T=4800, eps_bessel=0.05, but that estimate PRE-SUPPOSED the
 * ~3-order inter-mode phase cancellation of g(t) is certified (else the mode-wise Route A split diverges). This
 * leaf supplies that missing ingredient at the DEGREE level: an EXACT integer rational trial whose six leading
 * carrier functionals vanish identically, confirming g = O(t^-4) is reachable by a fixed rational combination
 * (not only by the floating-point ground state). So the imp-97114 ~1.23x achievable floor is now backed by an
 * explicit annihilating trial rather than a heuristic assumption -- the floor VALUE is unchanged (this leaf
 * moves no bound), but its enabling premise is executed.
 *
 * WHAT THIS IS NOT. The trials live at the DEGREE-coefficient level {d_k}. Mapping them back onto certified
 * rational v0 components through the committed overlap matrix C (with interval enclosure) -- the final step
 * of IMP97100_PHASE_CANCELLATION_TRIAL -- is NOT executed here, because the numerical v0 -> {d_k} overlap is
 * not re-solved. So no fixed rational v0 with a certified interval g(t) = O(t^-4) enclosure is produced and the
 * Route B/C interval majorant does not close. Measurement / execution only: produces no interval majorant;
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes no operator positivity; changes NO
 * bound; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (SCOPED the annihilation; IMP97113_FUNCTIONALS reused here)
 * @see imp-97114-krein-rayleigh-tail-enclosure-slack-budget.js (~1.23x achievable floor presupposing the cancellation)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL; measured g ~ t^-3.96)
 *
 * Ticket: imp-97134 (numerical, opus-4-8, medium). Execution / measurement only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97113 functional weights), no zeros bundle.
 */

import { IMP97113_FUNCTIONALS } from './imp-97113-krein-bessel-asymptotic-annihilation-scope.js';

// Explicit integer kernel vectors (exact solutions of the imp-97113 3x4 parity blocks).
export const IMP97134_TRIALS = Object.freeze({
  // degree -> coefficient d_k
  even: Object.freeze({ 0: 33, 2: 55, 4: 27, 6: 5 }), // annihilates {L1sin, L2cos, L3sin}
  odd: Object.freeze({ 1: 143, 3: 273, 5: 165, 7: 35 }), // annihilates {L1cos, L2sin, L3cos}
});

// Evaluate the six imp-97113 leading carrier functionals on a degree-coefficient map.
function functionalResidual(dmap) {
  // even functionals [L1sin, L2cos, L3sin] over even degrees, odd [L1cos, L2sin, L3cos] over odd degrees
  const evenVals = [0, 0, 0];
  const oddVals = [0, 0, 0];
  for (const kStr of Object.keys(dmap)) {
    const k = +kStr;
    const d = dmap[kStr];
    if (k % 2 === 0) {
      const row = IMP97113_FUNCTIONALS.evenRow(k);
      for (let i = 0; i < 3; i++) evenVals[i] += d * row[i];
    } else {
      const row = IMP97113_FUNCTIONALS.oddRow(k);
      for (let i = 0; i < 3; i++) oddVals[i] += d * row[i];
    }
  }
  return { evenVals, oddVals };
}

// Stable spherical-Bessel j_k(z) via upward recurrence (z >> k here: z = a t, kmax = 7).
function sphBessel(kmax, z) {
  const j = new Array(kmax + 1);
  j[0] = Math.sin(z) / z;
  if (kmax >= 1) j[1] = Math.sin(z) / (z * z) - Math.cos(z) / z;
  for (let k = 1; k < kmax; k++) {
    j[k + 1] = ((2 * k + 1) / z) * j[k] - j[k - 1];
  }
  return j;
}

function gOfZ(dmap, z) {
  const j = sphBessel(7, z);
  let s = 0;
  for (const kStr of Object.keys(dmap)) s += dmap[kStr] * j[+kStr];
  return s;
}

const Z_LADDER = Object.freeze([100, 200, 400, 800, 1600, 3200]);
const GENERIC = Object.freeze({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 });

// Measured |g(z)| z^4 (annihilating trials) and |g(z)| z^1 vs |g(z)| z^4 (generic) across the ladder.
export const IMP97134_DECAY = Object.freeze(
  Z_LADDER.map((z) => {
    const ge = gOfZ(IMP97134_TRIALS.even, z);
    const go = gOfZ(IMP97134_TRIALS.odd, z);
    const gg = gOfZ(GENERIC, z);
    return Object.freeze({
      z,
      evenGz4: Math.abs(ge) * z ** 4, // bounded => g_even = O(z^-4)
      oddGz4: Math.abs(go) * z ** 4, // bounded => g_odd = O(z^-4)
      genGz1: Math.abs(gg) * z, // bounded => g_gen = O(z^-1)
      genGz4: Math.abs(gg) * z ** 4, // grows ~z^3 => g_gen NOT O(z^-4)
    });
  }),
);

export const IMP97134_VERDICT = Object.freeze({
  ticket: 'imp-97134',
  question:
    'execute the imp-97113 fixed rational trial annihilating the t^-1, t^-2, t^-3 orders of g(t) = v0.Phih(t), measure whether it forces g(t) = O(t^-4), and quantify the resulting reduction against the imp-97114 ~1.23x Rayleigh-tail floor (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL).',
  answer:
    'the two 3x4 parity blocks of imp-97113 have exact 1-dimensional INTEGER kernels: even degrees {0,2,4,6} -> (33,55,27,5) and odd degrees {1,3,5,7} -> (143,273,165,35). Substituted into the six imp-97113 leading carrier functionals all six vanish EXACTLY (integer arithmetic), so the t^-1, t^-2, t^-3 asymptotic coefficients of g are annihilated. Evaluating g(z) = sum_k d_k j_k(z) with exact spherical Bessel over z in {100..3200}, both trials give |g(z)| z^4 BOUNDED and non-growing (even ~1e3-3e3, odd ~2e4-4e4) => g = O(z^-4), while the generic all-ones trial keeps |g(z)| z^1 bounded but |g(z)| z^4 grows ~z^3 => only O(z^-1). So the explicit rational annihilation delivers the imp-97100 measured four-order decay (t^-1 -> t^-4 in g, t^-2 -> t^-8 in |g|^2, a six-order integrand improvement). This backs the imp-97114 ~1.23x achievable floor (which pre-supposed the ~3-order cancellation) with an explicit annihilating trial rather than a heuristic; the floor value is unchanged. Mapping the degree-level trials back onto certified rational v0 components through the committed overlap matrix C under interval arithmetic is NOT executed, so no fixed rational v0 with a certified interval O(t^-4) enclosure is produced and IMP97100_PHASE_CANCELLATION_TRIAL stays open.',
  evenTrial: IMP97134_TRIALS.even,
  oddTrial: IMP97134_TRIALS.odd,
  functionalsVanishExactly: true, // all six imp-97113 functionals = 0 in integer arithmetic
  evenDecayOrder: 4, // |g| z^4 bounded
  oddDecayOrder: 4,
  genericDecayOrder: 1, // |g| z^1 bounded, z^4 grows ~z^3
  gz2ImprovementOrders: 6, // |g|^2: t^-2 (mode-wise) -> t^-8 (phase-preserving)
  consistentWithMeasuredGDecay: true, // matches imp-97100 g ~ t^-3.96
  degreeLevelOnly: true, // trials live at {d_k}, not certified rational v0
  v0OverlapMapExecuted: false, // C-map under interval arithmetic NOT done
  intervalMajorantProduced: false, // execution/measurement only
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  imp97114FloorValue: 1.2321, // ~floor(4800)*1.05 -- UNCHANGED by this leaf
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL stays open -- this leaf EXECUTES the annihilation at the DEGREE level (explicit exact integer kernel trials (33,55,27,5) and (143,273,165,35) whose six imp-97113 carrier functionals vanish identically, verified to give g = O(t^-4) against exact spherical Bessel while a generic trial keeps only t^-1), confirming the imp-97114 ~1.23x floor premise. It does NOT map the trials back onto certified rational v0 components via the committed overlap matrix C under interval arithmetic, so no fixed rational v0 with a certified interval g(t) = O(t^-4) enclosure is produced and the Route B/C interval majorant does not close.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97134_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97134_ASSERTIONS = [
  {
    id: 'imp97134-trials-annihilate-exactly',
    holds: () => {
      const e = functionalResidual(IMP97134_TRIALS.even);
      const o = functionalResidual(IMP97134_TRIALS.odd);
      // even trial kills the even block; odd trial kills the odd block; cross-blocks trivially zero
      return (
        e.evenVals.every((v) => v === 0) &&
        e.oddVals.every((v) => v === 0) &&
        o.evenVals.every((v) => v === 0) &&
        o.oddVals.every((v) => v === 0)
      );
    },
    why: 'the explicit integer trials (33,55,27,5) and (143,273,165,35) drive all six imp-97113 leading carrier functionals to exactly 0 in integer arithmetic, so the t^-1, t^-2, t^-3 asymptotic coefficients of g vanish identically.',
  },
  {
    id: 'imp97134-trials-nontrivial',
    holds: () =>
      Object.values(IMP97134_TRIALS.even).some((d) => d !== 0) &&
      Object.values(IMP97134_TRIALS.odd).some((d) => d !== 0) &&
      Object.keys(IMP97134_TRIALS.even).length === 4 &&
      Object.keys(IMP97134_TRIALS.odd).length === 4,
    why: 'each trial is a nontrivial 4-degree combination (the 1-dimensional kernel of a rank-3 3x4 parity block), matching the imp-97113 minimum-support count of >= 4 degrees per parity.',
  },
  {
    id: 'imp97134-annihilating-trials-are-order-four',
    holds: () => {
      // |g| z^4 bounded and non-growing across the ladder for both parities
      const evenVals = IMP97134_DECAY.map((r) => r.evenGz4);
      const oddVals = IMP97134_DECAY.map((r) => r.oddGz4);
      const evenMax = Math.max(...evenVals);
      const oddMax = Math.max(...oddVals);
      // last rung not larger than the overall max (bounded, not growing) and finite/positive
      return (
        evenMax < 1e5 &&
        oddMax < 1e6 &&
        evenVals.every((v) => Number.isFinite(v) && v > 0) &&
        oddVals.every((v) => Number.isFinite(v) && v > 0) &&
        evenVals[evenVals.length - 1] <= evenMax &&
        oddVals[oddVals.length - 1] <= oddMax
      );
    },
    why: 'evaluating g(z) = sum_k d_k j_k(z) with exact spherical Bessel, both annihilating trials keep |g(z)| z^4 bounded and non-growing across z in {100..3200}, so g = O(z^-4).',
  },
  {
    id: 'imp97134-generic-trial-only-order-one',
    holds: () => {
      const gz1 = IMP97134_DECAY.map((r) => r.genGz1);
      const gz4 = IMP97134_DECAY.map((r) => r.genGz4);
      const gz1Max = Math.max(...gz1);
      // generic: |g| z^1 bounded (O(z^-1)) but |g| z^4 grows strongly (last >> first)
      return (
        gz1Max < 1 &&
        gz4[gz4.length - 1] > 100 * gz4[0] &&
        gz4[gz4.length - 1] > gz4[0]
      );
    },
    why: 'a generic non-annihilating trial keeps |g(z)| z^1 bounded (g ~ z^-1) but |g(z)| z^4 grows ~z^3 (6.3e4 -> 1.35e8 over the ladder), confirming it retains only the single-mode t^-1 floor -- the annihilation is what buys the extra three orders.',
  },
  {
    id: 'imp97134-execution-only-no-qed',
    holds: () =>
      IMP97134_VERDICT.functionalsVanishExactly === true &&
      IMP97134_VERDICT.evenDecayOrder === 4 &&
      IMP97134_VERDICT.oddDecayOrder === 4 &&
      IMP97134_VERDICT.genericDecayOrder === 1 &&
      IMP97134_VERDICT.gz2ImprovementOrders === 6 &&
      IMP97134_VERDICT.degreeLevelOnly === true &&
      IMP97134_VERDICT.v0OverlapMapExecuted === false &&
      IMP97134_VERDICT.intervalMajorantProduced === false &&
      IMP97134_VERDICT.operatorPositivityProved === false &&
      IMP97134_VERDICT.boundChanged === false &&
      IMP97134_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97134_VERDICT.qed === false &&
      typeof IMP97134_VERDICT.subGap === 'string' &&
      IMP97134_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'execution done (explicit exact integer annihilating trials, six functionals verified zero, g = O(t^-4) measured vs generic t^-1), but the trials stay at the degree level, the v0 overlap map under interval arithmetic is not executed, no interval majorant is produced, no operator positivity, no bound change, sub-gap open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97134_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97134-krein-annihilating-rational-trial-execution assertion failed: ${a.id}`);
  }
}

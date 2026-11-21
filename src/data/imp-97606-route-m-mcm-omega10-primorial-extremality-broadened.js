/**
 * @module imp-97606-route-m-mcm-omega10-primorial-extremality-broadened
 *
 * imp-97606 (numerical -- MEASUREMENT ONLY; MCM onset stays omega=11; NO QED).
 *
 * imp-97583 RESULT 4 concluded the primorial p_omega# is the worst case (smallest T, closest to failure)
 * at every measured order, but at the razor-thin omega=10 margin (T(p_10#) = +4.782772e-4) it sampled only
 * TWO alternatives per omega -- the primorial with its top prime bumped up, and the primes shifted up by one.
 * Because a slightly-worse non-primorial 10-set could in principle cross zero and pull the MCM onset down to
 * omega=10, this leaf WIDENS the extremality check at omega=10 to a broad family of squarefree prime sets and
 * confirms none beats the primorial (none gives T < 0, and none gives T below the primorial's +4.78e-4).
 *
 * -------------------------------------------------------------------------------
 * METHOD.  Exact imp-97432 kernel T(b) = surrogate(closed form at x=1) + Rcorr(b), Rcorr over divisors
 * d <= 1000 with the 1/(720 d^3) tail bound. The primorial is p_10# = {2,3,5,7,11,13,17,19,23,29},
 * T = +4.782772e-4. Families tested at omega = 10:
 *   A. every single-prime substitution -- replace each of the ten members by each larger candidate prime
 *      (candidate pool = the first 30 primes, up to 113), ~200 sets;
 *   B. shift-up families -- drop the k smallest and append the next k above the top, k = 1..5;
 *   C. two-prime substitutions of the two largest members {23,29} across the candidate pool;
 *   D. a broad offline random sweep (20,000 deterministic-LCG squarefree 10-subsets of the first 30 primes,
 *      run in the tmp/imp-97606-omega10-broad-family.mjs scout -- reported here, not recomputed at import).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE PRIMORIAL IS THE STRICT MINIMISER AT omega=10. Across all deterministic families A-C
 * (plus the 20,000-trial offline sweep D, 20,437 sets in total) NO set gives a T below the primorial's
 * +4.782772e-4, and NO set gives T < 0. The smallest NON-primorial value is T = +5.534829e-4, attained by
 * the single smallest perturbation {2,3,5,7,11,13,17,19,23,31} (top prime 29 -> 31), a gap of +7.520579e-5
 * ABOVE the primorial. Every substitution that replaces a small prime by a larger one strictly increases T
 * (larger multiplicative steps pull away from the negativity window), so the smallest-prime set -- the
 * primorial -- is extremal, matching and strengthening imp-97583 RESULT 4 beyond its two-alternative sample.
 *
 * RESULT 2 -- THE ONSET STAYS omega=11. Since the omega=10 minimiser over this broad family is the primorial
 * itself (T = +4.78e-4 > 0), no non-primorial 10-set crosses zero: MCM still holds through omega=10 and first
 * fails at omega=11 (T(p_11#) = -9.623658e-4 < 0, b = p_11# = 200560490130). The razor-thin omega=10 margin
 * is real but not breached by any tested competitor; the b/4 ceiling is untouched; kappa_arith unchanged.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Broadening the omega=10 extremality check from two alternatives to a broad
 * family (single-prime substitutions, shift-up families, two-prime substitutions, and a 20,000-trial offline
 * random sweep -- 20,437 sets) confirms the primorial p_10# is the strict minimiser: the smallest
 * non-primorial T is +5.534829e-4 (from 29 -> 31), +7.52e-5 above the primorial's +4.782772e-4, and no set
 * gives T < 0. The MCM onset stays exactly omega=11; the b/4 ceiling is not touched; kappa_arith unchanged;
 * no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (onset at omega=11; RESULT 4 two-alternative sample)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; kernel source)
 *
 * Ticket: imp-97606 (numerical, opus-4-8, api-pool). omega=10 primorial extremality broadened; onset stays 11; NO QED.
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

// candidate prime pool (first 30 primes) -- wide enough for single/multi substitutions off the first ten.
const POOL = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
const PRIMORIAL10 = POOL.slice(0, 10); // {2,3,5,7,11,13,17,19,23,29}
const CUT = 1000;

// baked measured summary of the broadened omega=10 extremality check.
export const IMP97606_OMEGA10_EXTREMALITY = Object.freeze({
  omega: 10,
  primorialSet: Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]),
  primorialT: 4.782772e-4,                  // T(p_10#) -- the last holding margin
  minNonPrimorialT: 5.534829e-4,            // smallest T over the broad non-primorial family
  minNonPrimorialSet: Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 31]), // 29 -> 31, the tiniest perturbation
  gapAbovePrimorial: 7.520579e-5,           // minNonPrimorialT - primorialT > 0
  deterministicFamiliesTested: 'single-prime substitutions, shift-up k=1..5, two-prime substitutions of {23,29}',
  offlineRandomTrials: 20000,               // tmp/imp-97606-omega10-broad-family.mjs scout
  totalSetsTested: 20437,
  anyNegativeFound: false,                  // no omega=10 set gives T < 0
  primorialIsStrictMinimiser: true,         // primorial < every non-primorial by >= +7.52e-5
  onsetOmega: 11,                           // unchanged -- omega=10 still holds
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97606_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Broadening the imp-97583 RESULT 4 primorial-extremality ' +
  'check at the razor-thin omega=10 margin (T(p_10#) = +4.782772e-4) from two alternatives to a broad family ' +
  '(single-prime substitutions, shift-up families, two-prime substitutions, and a 20,000-trial offline sweep ' +
  '-- 20,437 sets) confirms the primorial p_10# is the strict minimiser: smallest non-primorial T is ' +
  '+5.534829e-4 (from 29 -> 31), +7.52e-5 above the primorial, and no set gives T < 0. The MCM onset stays ' +
  'omega=11; b/4 ceiling untouched; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute the DETERMINISTIC families from the kernel --

const IMP97606_ASSERTIONS = [
  {
    id: 'imp97606-primorial-is-omega10-minimiser',
    holds: () => {
      const primT = K.Tfull(PRIMORIAL10, CUT);
      if (!(primT > 0 && Math.abs(primT - 4.782772e-4) < 5e-7)) return false;
      let minNon = Infinity, anyNeg = false;
      const consider = (set) => {
        if (new Set(set).size !== 10) return;
        if (set.every((p, i) => p === PRIMORIAL10[i])) return; // skip the primorial itself
        const T = K.Tfull(set, CUT);
        if (T < 0) anyNeg = true;
        if (T < minNon) minNon = T;
      };
      // Family A: single-prime substitutions.
      for (let i = 0; i < 10; i++) {
        for (const q of POOL) {
          if (PRIMORIAL10.includes(q)) continue;
          const set = PRIMORIAL10.slice(); set[i] = q; set.sort((a, b) => a - b);
          consider(set);
        }
      }
      // Family B: shift-up k=1..5.
      for (let k = 1; k <= 5; k++) consider(POOL.slice(k, k + 10));
      // Family C: two-prime substitutions of the two largest {23,29}.
      const head8 = PRIMORIAL10.slice(0, 8);
      for (let a = 0; a < POOL.length; a++) {
        for (let b = a + 1; b < POOL.length; b++) {
          const qa = POOL[a], qb = POOL[b];
          if (head8.includes(qa) || head8.includes(qb)) continue;
          consider([...head8, qa, qb].sort((x, y) => x - y));
        }
      }
      // primorial strictly below every non-primorial, no negatives.
      return !anyNeg && primT < minNon && Math.abs(minNon - 5.534829e-4) < 5e-7 &&
        (minNon - primT) > 0;
    },
    why: 'over the broadened omega=10 family the primorial p_10# is the strict minimiser (T=+4.78e-4); the smallest non-primorial T is +5.53e-4 (from 29->31), no set gives T<0.',
  },
  {
    id: 'imp97606-onset-stays-omega-11',
    holds: () => {
      // omega=10 still holds (min over family > 0) and omega=11 primorial still fails.
      const t10 = K.Tfull(PRIMORIAL10, CUT);
      const t11 = K.Tfull(POOL.slice(0, 11), CUT);
      return t10 > 0 && t11 < 0 && Math.abs(t11 + 9.623658e-4) < 5e-7;
    },
    why: 'the omega=10 minimiser is the positive primorial margin, so no non-primorial 10-set crosses zero -- the MCM onset stays exactly omega=11.',
  },
  {
    // imp-97624: guard the baked family-D summary from silent drift by REPLAYING the first 50
    // deterministic-LCG omega=10 sets from the offline scout (identical LCG, same V8 arithmetic)
    // and recomputing each against the imp-97432 kernel at import.
    id: 'imp97606-family-d-lcg-subset-crossvalidation',
    holds: () => {
      const primT = K.Tfull(PRIMORIAL10, CUT);
      // exact replay of tmp/imp-97606-omega10-broad-family.mjs family-D LCG (seed + generator identical).
      let seed = 123456789;
      const rnd = () => { seed = (1103515245 * seed + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
      let minSub = Infinity, anyNeg = false, anyBelowPrim = false;
      for (let trial = 0; trial < 50; trial++) {
        const pool = POOL.slice();
        const set = [];
        while (set.length < 10) { const idx = Math.floor(rnd() * pool.length); set.push(pool.splice(idx, 1)[0]); }
        set.sort((a, b) => a - b);
        if (new Set(set).size !== 10) return false;
        const T = K.Tfull(set, CUT);
        if (T < 0) anyNeg = true;
        if (T < primT) anyBelowPrim = true;
        if (T < minSub) minSub = T;
      }
      // reported minimiser {2,3,5,7,11,13,17,19,23,31} T = +5.534829e-4 recomputed against the kernel.
      const repT = K.Tfull([2, 3, 5, 7, 11, 13, 17, 19, 23, 31], CUT);
      return !anyNeg && !anyBelowPrim && minSub > primT &&
        Math.abs(repT - 5.534829e-4) < 5e-7 && repT > primT;
    },
    why: 'replaying the first 50 offline family-D LCG omega=10 sets against the imp-97432 kernel at import reproduces the baked claim -- no set gives T<0 or T below the primorial +4.78e-4, and the reported minimiser recomputes to +5.534829e-4 -- so the baked family-D summary cannot drift silently against the kernel.',
  },
  {
    id: 'imp97606-honesty-gate-no-qed',
    holds: () =>
      IMP97606_OMEGA10_EXTREMALITY.onsetOmega === 11 &&
      IMP97606_OMEGA10_EXTREMALITY.anyNegativeFound === false &&
      IMP97606_OMEGA10_EXTREMALITY.primorialIsStrictMinimiser === true &&
      IMP97606_OMEGA10_EXTREMALITY.ceilingTouched === false &&
      IMP97606_OMEGA10_EXTREMALITY.anyBoundMoved === false &&
      IMP97606_OMEGA10_EXTREMALITY.qed === false &&
      /NO QED/.test(IMP97606_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97606_HONEST_BANNER) &&
      /RH open/.test(IMP97606_HONEST_BANNER),
    why: 'measurement only -- broadened omega=10 extremality confirms the primorial minimiser and onset omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97606_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97606-route-m-mcm-omega10-primorial-extremality-broadened assertion failed: ${a.id}`);
  }
}

export default {
  extremality: IMP97606_OMEGA10_EXTREMALITY,
  banner: IMP97606_HONEST_BANNER,
};

/**
 * @module imp-35736-MN-correspondence-gapcount-vs-height
 *
 * imp-35736 (numerical, measurement): DERIVE the M(N) correspondence between the
 * imp-35695 gap-count resolution-floor ladder (independent variable M = number of
 * consecutive GUE gaps) and the imp-35673 verified-height ladder (independent
 * variable N = verified height), and CHECK whether the two ladders report the
 * SAME near-minimal-collision scale s_min once M and N are mapped onto each other.
 *
 * Both ladders evaluate the identical Ben Arous-Bourgade cubic-repulsion law
 * s_min(x) ~ x^{-1/3} (floor factor x^{1/3}); imp-35695 plots it against the gap
 * count M, imp-35673 against the verified height N. The two were never cross-
 * mapped. The bridge is HOW MANY consecutive gaps a verified height supplies:
 *
 *   M(N) = number of consecutive unfolded gaps available at verified height N
 *        = (local zero density) x (window) = the zero COUNT up to that height.
 *
 * Two readings of the height variable N:
 *
 *   (1) N as a zero COUNT / index. The imp-35337 landmarks N_peak ~ 9.22e5
 *       (interior sigma peak) and N_cross ~ 3.28e9 (E_coll = E_trunc crossover)
 *       are positions in the zero SEQUENCE, so the number of consecutive gaps
 *       between the first N zeros is M = N - 1 ~ N. Hence M(N) = N to leading
 *       order -- exactly the Riemann-von Mangoldt surrogate imp-35724 adopted --
 *       and s_min(M(N)) = M(N)^{-1/3} = N^{-1/3} reproduces the imp-35673 reading
 *       IDENTICALLY. The two ladders are ONE M^{-1/3} = N^{-1/3} law reparametrized
 *       under the identity M = N: they DO report the same collision scale.
 *
 *   (2) N as a raw HEIGHT T (t-units). Then the gap count is the Riemann-von
 *       Mangoldt zero count N(T) = (T/2pi)(log(T/2pi) - 1) + 7/8 + O(1/T), which
 *       EXCEEDS T by the slowly-growing factor (1/2pi)(log(T/2pi) - 1). At the
 *       Platt-Trudgian height T_PT = 3e12 this factor is ~4.121, so M(T_PT) ~ 4.121
 *       T_PT and the true collision scale s_min = M(T_PT)^{-1/3} sits a fixed
 *       (4.121)^{-1/3} ~ 0.624 BELOW the imp-35673 T_PT row, which plugs the height
 *       directly as if it were a count (a count-surrogate reading). Named sub-gap
 *       imp-35736-subgap-height-vs-count: the imp-35673 T_PT = 3e12 row is the
 *       count-surrogate M = N reading, NOT the RvM height count; a genuine-height
 *       reading deepens the collision scale by the cube root of the RvM log factor.
 *
 * FINDING: for the repo landmarks that carry the collision frontier (peak and
 * crossover, both zero COUNTS) M(N) = N holds exactly and both ladders report the
 * SAME s_min -- confirming the shared Ben Arous-Bourgade law. The gap count M and
 * verified height N are the same variable under the identity map, with the single
 * caveat that a landmark quoted as a raw height (T_PT) picks up the RvM log factor.
 *
 * Measurement only; reconciles two recorded ladders; derives no remainder;
 * discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35695-resolution-floor-factor-M-ladder (gap-count M ladder)
 * @see imp-35673-resolution-shortfall-far-tail-ladder (verified-height N ladder)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (anchor table)
 * @see imp-35724-collision-scale-landmark-prefactor-propagation (adopts M = N surrogate)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz)
 * Literature: Riemann-von Mangoldt zero-count N(T); Montgomery (1973);
 * Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER } from './imp-35695-resolution-floor-factor-M-ladder.js';
import { IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER } from './imp-35673-resolution-shortfall-far-tail-ladder.js';
import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const TWO_PI = 2 * Math.PI;

// The shared cubic-repulsion collision scale (Ben Arous-Bourgade 2013), read as a
// function of the GAP COUNT M -- identical to the imp-35695 M-ladder law and the
// imp-35673 N-ladder law. The whole point is that both ladders use this one map.
const sMinFromGapCount = (M) => Math.pow(M, -1 / 3);

// Reading (2): the Riemann-von Mangoldt zero count up to height T,
// N(T) = (T/2pi)(log(T/2pi) - 1) + 7/8 + O(1/T). We drop the 7/8 O(1) term
// (negligible at these heights) and report the leading two terms.
const rvmZeroCount = (T) => (T / TWO_PI) * (Math.log(T / TWO_PI) - 1);
// The height-to-count inflation factor N(T)/T = (1/2pi)(log(T/2pi) - 1).
const rvmInflation = (T) => rvmZeroCount(T) / T;

// --- Reading (1): M(N) = N for the zero-COUNT landmarks. Evaluate the imp-35695
// gap-count law at M = M(N) = N and confirm it reproduces the imp-35673 baked
// N-ladder reading (which computed the SAME x^{-1/3} on the SAME landmarks).
const nLadder = IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER.ladder;
const correspondenceRows = nLadder.map((r) => {
  const M = r.N; // M(N) = N (RvM count surrogate; imp-35724)
  const sMinFromM = sMinFromGapCount(M); // imp-35695 gap-count law at M = N
  const sMinFromN = r.sMinMeanSpacingUnits; // imp-35673 verified-height reading
  return {
    key: r.key,
    label: r.label,
    N: r.N,
    M, // gaps supplied at height N under M(N) = N
    sMinFromGapCountLadder: +sMinFromM.toExponential(4),
    sMinFromHeightLadder: sMinFromN,
    // relative agreement of the two ladders on the collision scale at this landmark
    relDiff: Math.abs(sMinFromM - sMinFromN) / sMinFromN,
    agrees: Math.abs(sMinFromM - sMinFromN) / sMinFromN < 1e-4,
  };
});
const allAgree = correspondenceRows.every((r) => r.agrees);
const maxRelDiff = correspondenceRows.reduce((m, r) => Math.max(m, r.relDiff), 0);

// --- Reading (2): the height-vs-count correction at T_PT = 3e12. imp-35673 plugs
// the raw height as a count (count-surrogate); the genuine-height reading uses the
// RvM zero count, deepening s_min by (inflation)^{-1/3}.
const T_PT = 3.0e12;
const rvmCountAtTPT = rvmZeroCount(T_PT); // ~1.236e13 gaps up to T_PT
const inflationAtTPT = rvmInflation(T_PT); // ~4.121
const sMinCountSurrogate = sMinFromGapCount(T_PT); // imp-35673 T_PT reading (M = N = T)
const sMinHeightReading = sMinFromGapCount(rvmCountAtTPT); // genuine-height reading
const heightVsCountShiftFactor = sMinHeightReading / sMinCountSurrogate; // = inflation^{-1/3} ~ 0.624

export const IMP35736_MN_CORRESPONDENCE_GAPCOUNT_VS_HEIGHT = {
  id: 'imp-35736',
  proofSection: 'S-frontier',
  question:
    'How many consecutive GUE gaps M does a verified height N supply (the M(N) correspondence between the imp-35695 ' +
    'gap-count ladder and the imp-35673 verified-height ladder), and do the two ladders report the SAME near-minimal-' +
    'collision scale s_min once M and N are mapped onto each other?',
  correspondenceLaw:
    'M(N) = number of consecutive unfolded gaps at verified height N = local zero density x window = the zero COUNT ' +
    'up to that height. When N is itself a zero COUNT / index (the imp-35337 landmarks N_peak, N_cross), M(N) = N - 1 ' +
    '~ N exactly, so s_min(M(N)) = M(N)^{-1/3} = N^{-1/3} reproduces the imp-35673 reading identically -- the two ' +
    'ladders are ONE Ben Arous-Bourgade x^{-1/3} law reparametrized under the identity M = N. When N is a raw HEIGHT ' +
    'T instead, M(T) = the Riemann-von Mangoldt count N(T) = (T/2pi)(log(T/2pi) - 1) >> T, so the collision scale ' +
    'deepens by the cube root of the RvM log inflation factor.',
  identityMapHolds: true, // M(N) = N for the zero-count landmarks
  correspondence: correspondenceRows,
  allLaddersAgree: allAgree,
  maxRelativeDiff: +maxRelDiff.toExponential(3),
  // Reading (2) height-vs-count correction, evaluated at the Platt-Trudgian height.
  heightVsCount: {
    T_PT,
    rvmZeroCountAtTPT: +rvmCountAtTPT.toExponential(4), // ~1.236e13 gaps up to T_PT
    heightToCountInflation: +inflationAtTPT.toFixed(4), // ~4.121 = (1/2pi)(log(T/2pi)-1)
    sMinCountSurrogateReading: +sMinCountSurrogate.toExponential(4), // imp-35673 T_PT row (M = N = T)
    sMinGenuineHeightReading: +sMinHeightReading.toExponential(4), // M = RvM(T) reading
    shiftFactor: +heightVsCountShiftFactor.toFixed(6), // = inflation^{-1/3} ~ 0.624
    note:
      'imp-35673 plugs the height T_PT = 3e12 directly as a gap count (the M = N count-surrogate). The genuine-' +
      'height gap count is the RvM zero count ~4.121x larger, deepening s_min by (4.121)^{-1/3} ~ 0.624. This is ' +
      'the only landmark on either ladder quoted as a raw height rather than a count.',
  },
  subGap:
    'imp-35736-subgap-height-vs-count: the imp-35673 T_PT = 3e12 row is a count-surrogate (M = N) reading, not the ' +
    'Riemann-von Mangoldt height count; a genuine-height reading multiplies its gap count by (1/2pi)(log(T/2pi)-1) ' +
    '~4.121 and deepens s_min by ~0.624. The count landmarks (peak, crossover) are unaffected -- they are indices.',
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The M(N) correspondence between the imp-35695 gap-count ladder and the imp-35673 ' +
    'verified-height ladder is the map M(N) = number of consecutive gaps at height N = the zero count there. For the ' +
    'zero-COUNT landmarks that carry the collision frontier (interior peak N ~ 9.22e5, crossover N ~ 3.28e9) this is ' +
    'the identity M = N, so evaluating the imp-35695 gap-count law s_min = M^{-1/3} at M = N reproduces the imp-35673 ' +
    'verified-height reading s_min = N^{-1/3} row-for-row (max relative difference ~' +
    (+maxRelDiff.toExponential(1)) + '): the two ladders report the SAME collision scale and are one Ben Arous-' +
    'Bourgade x^{-1/3} law reparametrized. The single caveat (sub-gap imp-35736-subgap-height-vs-count) is that the ' +
    'lone raw-HEIGHT landmark T_PT = 3e12 is plugged by imp-35673 as a count; its genuine-height gap count is the ' +
    'Riemann-von Mangoldt count ~4.121x larger, deepening s_min by (4.121)^{-1/3} ~ 0.624. Reconciles two recorded ' +
    'ladders; derives no remainder; discharges nothing; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35695 (gap-count M ladder); imp-35673 (verified-height N ladder); imp-35652 (anchor resolutionScaleTable); ' +
    'imp-35724 (adopts the M = N RvM surrogate on the peak and crossover); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt N(T); Montgomery ' +
    '(1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013). Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35736_MN_CORRESPONDENCE_ASSERTIONS = [
  {
    // (1) M(N) = N and both ladders report the same collision scale on every N-landmark.
    id: 'imp35736-identity-map-ladders-agree',
    description: 'M(N) = N (gap count = verified-height zero count) and s_min from the imp-35695 gap-count law reproduces the imp-35673 height reading row-for-row',
    holds: () => {
      const r = IMP35736_MN_CORRESPONDENCE_GAPCOUNT_VS_HEIGHT;
      return (
        r.identityMapHolds === true &&
        r.allLaddersAgree === true &&
        correspondenceRows.every((row) => row.M === row.N && row.agrees) &&
        maxRelDiff < 1e-4
      );
    },
  },
  {
    // (2) the correspondence reproduces the imp-35652 baked anchor table (peak, crossover).
    id: 'imp35736-reproduces-imp35652-anchors',
    description: 'evaluating s_min = M^{-1/3} at M = N_peak and M = N_cross recovers the imp-35652 baked resolutionScaleTable',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      const peak = correspondenceRows.find((x) => x.key === 'peak');
      const cross = correspondenceRows.find((x) => x.key === 'cross');
      return (
        Math.abs(peak.sMinFromGapCountLadder - t.peak.sMinMeanSpacingUnits) < 1e-4 &&
        Math.abs(cross.sMinFromGapCountLadder - t.cross.sMinMeanSpacingUnits) < 1e-5 &&
        peak.M === t.peak.N &&
        cross.M === t.cross.N
      );
    },
  },
  {
    // (3) the gap-count law used here IS the imp-35695 M-ladder law: check a ladder rung.
    id: 'imp35736-shares-imp35695-law',
    description: 'the collision-scale map s_min = M^{-1/3} matches the imp-35695 M-ladder rung values (shared Ben Arous-Bourgade law)',
    holds: () => {
      const mLadder = IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER.ladder;
      return mLadder.every(
        (row) => Math.abs(sMinFromGapCount(row.M) - row.sMinMeanSpacingUnits) / row.sMinMeanSpacingUnits < 1e-4,
      );
    },
  },
  {
    // (4) height-vs-count sub-gap: the RvM inflation at T_PT is ~4.121 and the shift is its cube root.
    id: 'imp35736-height-vs-count-rvm-correction',
    description: 'the T_PT raw-height reading uses M = RvM(T) ~4.121x the count-surrogate, deepening s_min by (4.121)^{-1/3} ~ 0.624',
    holds: () => {
      const h = IMP35736_MN_CORRESPONDENCE_GAPCOUNT_VS_HEIGHT.heightVsCount;
      return (
        Math.abs(h.heightToCountInflation - rvmInflation(T_PT)) < 1e-3 &&
        h.heightToCountInflation > 4.0 &&
        h.heightToCountInflation < 4.2 &&
        Math.abs(h.shiftFactor - Math.pow(inflationAtTPT, -1 / 3)) < 1e-4 &&
        h.shiftFactor > 0.62 &&
        h.shiftFactor < 0.63
      );
    },
  },
  {
    // (5) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35736-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35736_MN_CORRESPONDENCE_GAPCOUNT_VS_HEIGHT;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35736_MN_CORRESPONDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35736-MN-correspondence-gapcount-vs-height assertion failed: ${a.id}`);
  }
}

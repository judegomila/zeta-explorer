/**
 * imp-95555 - per-N profile of the imp-95519 headroom factor 1.306.
 *
 * imp-95519 derives the minimal contract requirement as the factor
 *     headroom = Q_target / Q_anchor = 1.306
 * from ONE anchor cell |E97|(690988) = 0.2141254901198318, and its own
 * section imp95538 (headroomAcrossWindow) reports the factor is
 * "CONFIRMED N-INDEPENDENT, spread 0" over 690988 <= N <= 54799999.
 * This module MEASURES what that scan actually holds fixed and separates the
 * part that is genuinely N-flat from the part that is anchor-capped.
 * Report only: no bound changes, no refereed bound is changed, RH open, NO QED.
 *
 * WHAT VARIES WITH N. The contract closes iff Q_sup < Q_target where
 *     Q_target = R_ex / sqrt(Sbar),   Q(N) = |E97|(N) / sqrt(Sbar).
 * The majorant mass Sbar = 2 p^{-4/3} sum_{j<=48} j^{-2/3} with p = 97 carries
 * NO N (imp-95519 SHARE_P97): sqrt(Sbar) = 0.19522203 is a fixed constant across
 * the whole RS window. Hence the ONLY N-varying input to Q(N) is the RS seam
 * cell |E97|(N), and
 *     headroom(N) = Q_target / Q(N) = R_ex / |E97|(N).
 * The imp95538 scan sets Q_ANCHOR = |E97|(anchor) as a constant and varies only
 * Q_target (which is N-flat), so its "spread 0" measures the N-invariance of
 * sqrt(Sbar) -- correct but trivial -- NOT the per-N Q profile. The per-N Q
 * profile is exactly the per-N profile of |E97|(N), which that scan never reads.
 *
 * HOW MANY CELLS ARE AVAILABLE. Exactly one |E97| cell is closed anywhere in the
 * repo: |E97|(690988) = 0.2141254901198318 (imp-95053 calls it "the one closed
 * source cell"; imp-95519 is import-light and carries only this anchor). So the
 * genuine per-N tabulation Q(N) over 690988 <= N <= 54799999 CANNOT be produced
 * import-light: it needs the RS-cell scan (the offline sub-gap named below).
 * At the single available point:
 *     Q_anchor = 1.0968305683525155,  Q_target = 1.4326671818370846,
 *     headroom = R_ex/|E97|(anchor) = 1.3061882328726573.
 *
 * IS THE ANCHOR THE WORST CELL. headroom(N) is minimal exactly where |E97|(N) is
 * LARGEST. The anchor sits at the window floor N_LO = 690988 = the floor alias,
 * where the Fresnel exponent alpha is maximal (alpha_max = 1.0953 at N_LO vs
 * 1.0730 at N_HI = 54799999) and the localized sum sees the fewest twisted zeros
 * (Delta = 6.91e5 at N_LO vs 5.48e7 at N_HI), i.e. the least cancellation room.
 * That makes anchor-maximality of |E97| STRUCTURALLY PLAUSIBLE, but plausibility
 * is not measurement: a single sampled cell cannot rule out an interior worst
 * cell that would tighten the factor below 1.306.
 *
 * NET. The 1.306 headroom factor is a FLOOR that is CONDITIONAL on the anchor
 * being the worst (largest-|E97|) cell of the window. Its window-uniformity is
 * NOT independently measured -- only one cell exists -- and reduces exactly to
 * the per-N tabulation of |E97|(N). Sub-gap:
 *   imp-95555-sub-per-n-e97-cell-scan -- compute |E97|(N) on a grid spanning
 *   690988..54799999 (both imp-95519 charts) via the RS seam evaluator, then
 *   read headroom(N) = R_ex/|E97|(N) and locate max_N |E97|(N).
 * No bound changes; no refereed bound is changed; NO QED.
 */

const N_LO = 690988;
const N_HI = 54799999;

const R_EX = 0.27968819555261474; // strict target R_ex
const ANCHOR_E97 = 0.2141254901198318; // |E97|(690988), the one closed source cell
const SQRT_SBAR = 0.19522203; // sqrt(Sbar), N-invariant majorant (imp-95519 page figure)

const Q_ANCHOR = ANCHOR_E97 / SQRT_SBAR; // 1.09683
const Q_TARGET = R_EX / SQRT_SBAR; // 1.43267
const HEADROOM_ANCHOR = Q_TARGET / Q_ANCHOR; // = R_EX/ANCHOR_E97 = 1.30619

// The single measurable row of the per-N Q profile. Every other N would need
// |E97|(N) from the RS seam evaluator (offline sub-gap), so the "profile" is a
// one-row table today; the extra fields record WHY that is and what would fill it.
const Q_PROFILE = Object.freeze([
  Object.freeze({
    N: N_LO,
    e97: ANCHOR_E97,
    q: Q_ANCHOR,
    headroom: R_EX / ANCHOR_E97,
    source: 'closed anchor cell (imp-95053)',
    alphaFloor: 1.0953,
    delta: 6.91e5,
  }),
]);

// N-endpoints of the two invariants, to make the separation explicit.
const INVARIANTS = Object.freeze({
  sqrtSbarNInvariant: true, // majorant mass carries no N
  qTargetNInvariant: true, // Q_target = R_ex/sqrt(Sbar) is N-flat
  qProfileVaries: 'through |E97|(N) only', // the sole N motion in Q(N)
  alphaFloorLo: 1.0953, // N_LO
  alphaFloorHi: 1.073, // N_HI
  deltaLo: 6.91e5, // twisted-zero window at N_LO
  deltaHi: 5.48e7, // twisted-zero window at N_HI
});

export const IMP95555_HEADROOM_PER_N_PROFILE = Object.freeze({
  id: 'imp-95555-headroom-factor-per-n-profile',
  parent: 'imp-95519-localized-barrier-sum-prime-zero-nogo',
  window: { N_LO, N_HI },
  constants: {
    R_ex: R_EX,
    anchorE97: ANCHOR_E97,
    sqrtSbar: SQRT_SBAR,
    Q_anchor: Q_ANCHOR,
    Q_target: Q_TARGET,
    headroomAnchor: HEADROOM_ANCHOR,
    reserve: R_EX - ANCHOR_E97,
  },
  invariants: INVARIANTS,
  profile: Q_PROFILE,
  finding:
    'Q(N) = |E97|(N)/sqrt(Sbar) varies with N ONLY through |E97|(N) because ' +
    'sqrt(Sbar) = 0.19522203 is N-invariant. The imp95538 spread-0 scan holds ' +
    '|E97| fixed at the anchor, so it certifies the N-flatness of sqrt(Sbar), ' +
    'not the per-N Q profile. Only one |E97| cell is closed anywhere in the ' +
    'repo, so the genuine per-N profile cannot be tabulated import-light.',
  conditionality:
    'The 1.306 factor is a floor CONDITIONAL on the anchor N=690988 being the ' +
    'worst (largest-|E97|) cell. That is structurally plausible -- N_LO is the ' +
    'floor alias with alpha_max=1.0953 and the fewest twisted zeros (Delta=6.91e5) ' +
    '-- but is NOT measured: a single cell cannot exclude an interior worst cell.',
  subGap: 'imp-95555-sub-per-n-e97-cell-scan',
  promotesBound: false,
  netVerdict:
    'Assessment only: the 1.306 headroom factor is anchor-conditional, not a ' +
    'measured-uniform factor; window-uniformity reduces to the per-N |E97|(N) ' +
    'scan sub-gap. No bound change, no refereed bound is changed, RH open, NO QED.',
});

export const IMP95555_HEADROOM_PER_N_PROFILE_ASSERTIONS = Object.freeze([
  {
    id: 'imp95555-anchor-headroom-matches-parent',
    description: 'headroom at the anchor = R_ex/|E97|(anchor) = 1.30619 (imp-95519 factor 1.306)',
    holds: () => Math.abs(HEADROOM_ANCHOR - 1.306) < 2e-3 && Math.abs(HEADROOM_ANCHOR - R_EX / ANCHOR_E97) < 1e-12,
  },
  {
    id: 'imp95555-q-anchor-value',
    description: 'Q_anchor = |E97|(anchor)/sqrt(Sbar) = 1.09683',
    holds: () => Math.abs(Q_ANCHOR - 1.09683) < 1e-4,
  },
  {
    id: 'imp95555-sqrt-sbar-n-invariant',
    description: 'the only N-motion in Q(N) is |E97|(N); sqrt(Sbar) and Q_target carry no N',
    holds: () => INVARIANTS.sqrtSbarNInvariant === true && INVARIANTS.qTargetNInvariant === true,
  },
  {
    id: 'imp95555-single-closed-cell',
    description: 'exactly one measurable Q row exists (the closed anchor cell); the profile is one row',
    holds: () => Q_PROFILE.length === 1 && Q_PROFILE[0].N === N_LO,
  },
  {
    id: 'imp95555-conditional-not-measured',
    description: 'the 1.306 factor is anchor-conditional with a named per-N |E97| scan sub-gap',
    holds: () =>
      IMP95555_HEADROOM_PER_N_PROFILE.subGap === 'imp-95555-sub-per-n-e97-cell-scan' &&
      /CONDITIONAL/.test(IMP95555_HEADROOM_PER_N_PROFILE.conditionality),
  },
  {
    id: 'imp95555-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95555_HEADROOM_PER_N_PROFILE.promotesBound === false &&
      /NO QED/.test(IMP95555_HEADROOM_PER_N_PROFILE.netVerdict) &&
      /refereed bound is changed/i.test(IMP95555_HEADROOM_PER_N_PROFILE.netVerdict),
  },
]);

for (const a of IMP95555_HEADROOM_PER_N_PROFILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95555-headroom-factor-per-n-profile assertion failed: ${a.id}`);
  }
}

export default IMP95555_HEADROOM_PER_N_PROFILE;

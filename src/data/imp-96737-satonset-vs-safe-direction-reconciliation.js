/**
 * @module imp-96737-satonset-vs-safe-direction-reconciliation
 * @fileoverview imp-96737 -- reconcile the two finite-height scales that the
 *   basis-C corroboration story quotes side by side:
 *
 *     (A) imp-96695 FINDING 2 "saturation onset" at L ~ 3-8, and
 *     (B) imp-96714 "safe-direction" threshold that only holds from L = 120.
 *
 *   imp-96714 explains its L >= 120 threshold by number-variance saturation
 *   pinning the empirical rho against the rigidity limit -1/2, yet cites the
 *   imp-96695 saturation onset as L ~ 3-8 -- roughly 1.5 decades earlier. This
 *   module measures both scales from the SAME baked imp-96695 table and shows
 *   they are different objects, so the ~1.5-decade gap is expected, not a
 *   contradiction. Measurement only; reuses baked data; NO QED.
 *
 *   THE TWO SCALES (from the imp-96695 L = {30,60,120,240,480,960} table)
 *   -----------------------------------------------
 *   Write sig_emp(L) = |rho_emp(L) + 1/2| and sig_gue(L) = |rho_gue(L) + 1/2|.
 *   Because rho(L) = Sigma2(2L)/(2 Sigma2(L)) - 1, one has the exact identity
 *       sig(L) = |rho(L) + 1/2| = (1/2) |Sigma2(2L)/Sigma2(L) - 1|,
 *   i.e. sig(L) is HALF the octave-flatness of Sigma2: rho sits at the rigidity
 *   limit -1/2 exactly when Sigma2 is FLAT across the octave [L, 2L].
 *
 *   Scale (A) -- Sigma2 DEPARTURE onset (a pointwise level statement). From the
 *   imp-96695 saturation sweep the ratio Sigma2_emp/Sigma2_gue first bends away
 *   from 1: 0.99 at L=0.5, 0.95 at L=1, 0.92 at L=2, 0.90 at L=3, 0.85 at L=5,
 *   0.76 at L=8. So Sigma2_emp STARTS leaving the GUE curve at L ~ 3-8.
 *
 *   Scale (B) -- Sigma2 PLATEAU / octave-flatness (what actually pins rho to
 *   -1/2). The "safe direction" sig_emp(L) < sig_gue(L) is exactly "rho_emp is
 *   within the (shrinking) moving tolerance sig_gue(L) of -1/2". Measured
 *   first-and-stays thresholds from the baked table:
 *     safe-direction sig_emp < sig_gue        : first-and-stays at L = 120
 *     saturation to |rho_emp+1/2| < 0.05       : first-and-stays at L = 60
 *     saturation to |rho_emp+1/2| < 0.02       : first-and-stays at L = 120
 *     saturation to |rho_emp+1/2| < 0.01       : first-and-stays at L = 480
 *   The octave ratio Sigma2_emp(2L)/Sigma2_emp(L) confirms it: 1.162 at L=30,
 *   0.904 at L=60, then 1.020 / 1.030 / 1.002 at L=120/240/480 -- Sigma2_emp is
 *   still climbing toward its plateau through the transition and only reaches
 *   octave-flatness (ratio -> 1) from L ~ 120 onward.
 *
 *   WHY THE TWO DIFFER (~1.5 decades)
 *   -----------------------------------------------
 *   (i) They measure different things. (A) is where Sigma2_emp merely BEGINS to
 *       bend away from the growing GUE log-curve; (B) needs Sigma2_emp to have
 *       FLATTENED into its plateau so its octave ratio Sigma2(2L)/Sigma2(L) ~ 1.
 *       A curve that has just started departing is still itself rising -- here
 *       Sigma2_emp climbs from 0.350 at L=30 to a plateau ~0.387 near L=480-960
 *       -- so the octave ratio (hence rho -> -1/2) settles ~1.5 decades after
 *       the departure onset.
 *   (ii) The L = 60 OVERSHOOT delays the safe direction one further rung. Across
 *       [60,120] Sigma2_emp dips non-monotonically (0.40655 -> 0.36747), pushing
 *       rho_emp(60) below -1/2 to -0.548206, so sig_emp(60) = 0.048206 still
 *       marginally EXCEEDS the still-large GUE signal sig_gue(60) = 0.046152.
 *       Only at L >= 120, once the dip has passed and rho_emp settles just above
 *       -1/2, does sig_emp collapse below sig_gue and stay there.
 *   (iii) A second, smaller wobble at L = 240 (sig_emp rises 0.008707 -> 0.015472)
 *       is why the tighter 0.01 tolerance is not met-and-held until L = 480: the
 *       "distance to -1/2" is not monotone in the transition band, so the scale
 *       you read off depends on the tolerance you demand.
 *
 *   BOTTOM LINE: the imp-96714 L = 120 threshold and the imp-96695 L ~ 3-8 onset
 *   are consistent -- onset marks where Sigma2_emp leaves GUE (a level test),
 *   the threshold marks where Sigma2_emp has plateaued enough for the octave
 *   ratio to pin rho_emp inside the shrinking GUE tolerance (a flatness test),
 *   about 1.5 decades later, with the L=60 overshoot pushing the boundary rung.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A reconciliation MEASUREMENT over baked imp-96695/imp-96714 data. It
 *   recomputes nothing from the zeros, moves no bound, instantiates no interval,
 *   closes no sub-gap. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the rho table and L~3-8 onset)
 * @see imp-96714-safe-direction-per-rung-verification (the L>=120 safe-direction threshold)
 * @see imp-96721-sigma2-emp-vs-gue-viz-data (signal-column presentation reshape)
 */

// -- Per-rung reconciliation (baked imp-96695 sigma2Emp / rhoEmp / rhoGue verbatim) --
// sigEmp = |rhoEmp + 1/2|, sigGue = |rhoGue + 1/2|; octaveRatio = sigma2Emp(2L)/sigma2Emp(L)
// (null at L=960 since 2L=1920 is off the table). safe = (sigEmp < sigGue).
const IMP96737_RECONCILE_TABLE = Object.freeze([
  Object.freeze({ L: 30, sigma2Emp: 0.35002, rhoEmp: -0.419104, rhoGue: -0.449153, sigEmp: 0.080896, sigGue: 0.050847, octaveRatio: 1.16151, safe: false }),
  Object.freeze({ L: 60, sigma2Emp: 0.40655, rhoEmp: -0.548206, rhoGue: -0.453848, sigEmp: 0.048206, sigGue: 0.046152, octaveRatio: 0.90387, safe: false }),
  Object.freeze({ L: 120, sigma2Emp: 0.36747, rhoEmp: -0.491293, rhoGue: -0.457748, sigEmp: 0.008707, sigGue: 0.042252, octaveRatio: 1.02008, safe: true }),
  Object.freeze({ L: 240, sigma2Emp: 0.37485, rhoEmp: -0.484528, rhoGue: -0.461040, sigEmp: 0.015472, sigGue: 0.038960, octaveRatio: 1.02975, safe: true }),
  Object.freeze({ L: 480, sigma2Emp: 0.38600, rhoEmp: -0.498869, rhoGue: -0.463857, sigEmp: 0.001131, sigGue: 0.036143, octaveRatio: 1.00231, safe: true }),
  Object.freeze({ L: 960, sigma2Emp: 0.38689, rhoEmp: -0.499670, rhoGue: -0.466293, sigEmp: 0.000330, sigGue: 0.033707, octaveRatio: null, safe: true }),
]);

// -- The two measured scales -------------------------------------------------
const IMP96737_SIGMA2_ONSET_L = Object.freeze({ lo: 3, hi: 8 }); // Sigma2_emp departs GUE (imp-96695 sweep)
const IMP96737_SAFE_DIRECTION_L = 120; // first-and-stays sigEmp < sigGue
// "saturation to within a fixed tolerance of -1/2" -- first-and-stays sigEmp < tol
const IMP96737_SAT_TO_HALF = Object.freeze([
  Object.freeze({ tol: 0.05, firstAndStaysL: 60 }),
  Object.freeze({ tol: 0.02, firstAndStaysL: 120 }),
  Object.freeze({ tol: 0.01, firstAndStaysL: 480 }),
]);
const IMP96737_OVERSHOOT_L = 60; // rho_emp(60) = -0.548206 overshoots below -1/2, keeping sigEmp>sigGue

export const IMP96737_SATONSET_VS_SAFE_DIRECTION = Object.freeze({
  id: 'imp-96737',
  proofSection: 'S-frontier',
  reconciles: 'imp-96695 saturation onset L~3-8 vs imp-96714 safe-direction threshold L>=120',
  table: IMP96737_RECONCILE_TABLE,
  sigma2OnsetL: IMP96737_SIGMA2_ONSET_L,
  safeDirectionL: IMP96737_SAFE_DIRECTION_L,
  saturationToHalf: IMP96737_SAT_TO_HALF,
  overshootL: IMP96737_OVERSHOOT_L,
  anyBoundMoved: false,
  verdict:
    'RECONCILIATION MEASUREMENT. The imp-96695 saturation onset (L ~ 3-8) and the imp-96714 ' +
    'safe-direction threshold (L >= 120) are consistent because they measure different objects. ' +
    'Onset is where Sigma2_emp merely BEGINS to bend away from the growing GUE log-curve (a ' +
    'pointwise level test on the ratio Sigma2_emp/Sigma2_gue). The safe direction sig_emp < ' +
    'sig_gue is equivalent to rho_emp being within the shrinking moving tolerance sig_gue(L) of ' +
    '-1/2, which via the identity sig(L) = (1/2)|Sigma2(2L)/Sigma2(L) - 1| requires Sigma2_emp ' +
    'to have FLATTENED into its plateau (octave ratio -> 1). Sigma2_emp keeps climbing (0.350 at ' +
    'L=30 to plateau ~0.387 near L=480-960) so octave-flatness -- hence rho_emp pinned to -1/2 ' +
    '-- is reached ~1.5 decades after the departure onset. The L=60 overshoot (Sigma2_emp dips ' +
    '0.40655 -> 0.36747 across [60,120], rho_emp(60) = -0.548 < -1/2, sig_emp = 0.048206 still ' +
    'above sig_gue = 0.046152) delays the safe direction to the L=120 rung, and a second wobble ' +
    'at L=240 makes the tighter 0.01 tolerance hold only from L=480. Reuses baked imp-96695/ ' +
    'imp-96714 data; recomputes nothing from the zeros; moves no bound; instantiates no interval; ' +
    'NO QED. No refereed bound is changed; RH open.',
  citation:
    'imp-96695 (sigma2Emp/rhoEmp/rhoGue table and the L~3-8 saturation onset); imp-96714 ' +
    '(the L>=120 safe-direction threshold); imp-96721 (signal-column presentation reshape).',
});

export default IMP96737_SATONSET_VS_SAFE_DIRECTION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96737_SATONSET_VS_SAFE_DIRECTION_ASSERTIONS = [
  {
    id: 'imp96737-signal-columns-match-baked-rho',
    why: 'sigEmp/sigGue must be the exact |rho + 1/2| reshape of the baked imp-96695 rhoEmp/ ' +
      'rhoGue values -- no independent recomputation, so they must agree to rounding.',
    holds: () => IMP96737_RECONCILE_TABLE.every((r) => {
      const eEmp = Math.abs(Math.abs(r.rhoEmp + 0.5) - r.sigEmp);
      const eGue = Math.abs(Math.abs(r.rhoGue + 0.5) - r.sigGue);
      return eEmp < 5e-7 && eGue < 5e-7;
    }),
  },
  {
    id: 'imp96737-safe-direction-first-and-stays-at-120',
    why: 'The safe direction sigEmp < sigGue must first hold AND stay held from L = 120 -- ' +
      'it fails at L in {30,60} and holds at every rung L >= 120.',
    holds: () => {
      const rows = IMP96737_RECONCILE_TABLE;
      const idx = rows.findIndex((r) => r.L === IMP96737_SAFE_DIRECTION_L);
      const staysFrom120 = rows.slice(idx).every((r) => r.sigEmp < r.sigGue);
      const failsBelow = rows.slice(0, idx).every((r) => r.sigEmp >= r.sigGue);
      return staysFrom120 && failsBelow;
    },
  },
  {
    id: 'imp96737-saturation-to-half-is-tolerance-dependent',
    why: 'The "saturation to within tolerance of -1/2" scale depends on the tolerance ' +
      'demanded (0.05 -> 60, 0.02 -> 120, 0.01 -> 480), and the recorded first-and-stays L ' +
      'must match a direct scan of sigEmp against each tolerance.',
    holds: () => IMP96737_SAT_TO_HALF.every((t) => {
      const rows = IMP96737_RECONCILE_TABLE;
      let firstL = null;
      for (let i = 0; i < rows.length; i++) {
        if (rows.slice(i).every((r) => r.sigEmp < t.tol)) { firstL = rows[i].L; break; }
      }
      return firstL === t.firstAndStaysL;
    }),
  },
  {
    id: 'imp96737-onset-precedes-safe-direction-by-decade',
    why: 'The core reconciliation: the Sigma2 departure onset (L ~ 3-8) is at least a full ' +
      'decade below the safe-direction / octave-flatness threshold (L = 120).',
    holds: () => IMP96737_SIGMA2_ONSET_L.hi * 10 < IMP96737_SAFE_DIRECTION_L,
  },
  {
    id: 'imp96737-l60-overshoot',
    why: 'The delaying mechanism: rho_emp(60) overshoots below the rigidity limit -1/2, yet ' +
      'sigEmp(60) still exceeds sigGue(60), so the safe direction cannot hold at L = 60.',
    holds: () => {
      const r60 = IMP96737_RECONCILE_TABLE.find((r) => r.L === IMP96737_OVERSHOOT_L);
      return r60.rhoEmp < -0.5 && r60.sigEmp > r60.sigGue;
    },
  },
  {
    id: 'imp96737-no-bound-moved',
    why: 'This is a reconciliation measurement only; it must not assert any bound movement.',
    holds: () => IMP96737_SATONSET_VS_SAFE_DIRECTION.anyBoundMoved === false,
  },
];

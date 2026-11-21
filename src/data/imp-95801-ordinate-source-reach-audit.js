/**
 * @module imp-95801-ordinate-source-reach-audit
 *
 * imp-95801 -- AUDITING every verified-ordinate source in the repo to measure the true
 * reach ceiling and decide whether any source (or a cheap extension of one) pushes the
 * top verified ordinate past the imp-95750 dead-zone ceiling gamma_1e6 = 6.003e5. This
 * is the ordinate-source half of the imp-95783 F4 obstruction: F4 resolves to the
 * OBSTRUCTION side of its binary precisely because above that ceiling there are NO
 * verified ordinates in the repo, so neither a non-GUE proxy nor a resampled-window
 * estimator of the true ratio r(T) can be formed anywhere in the ~3.28-decade dead zone.
 *
 * WHY THIS MATTERS. imp-95750 established the direct sd(C - E) measurement ceiling by
 * citing the single largest table (zeros-to-1e6). imp-95801 closes the loop by AUDITING
 * every source individually -- ZEROS_EXTENDED, zeros-first-25, the imp-360 / imp-962
 * ladders, and a repo-wide numeric sweep for any other Odlyzko-derived ordinate bundle --
 * so the "no other source reaches higher" claim is measured, not assumed.
 *
 * THE AUDIT (import-light, no zeros bundle; every value a baked literal).
 *
 *  (S1) zeros-to-1e6.js / ZEROS_EXTENDED. N = 1,000,000 verified Odlyzko ordinates
 *       (zeros1..zeros10, sigma = 1/2). Largest entry is the last of the frozen array,
 *       gamma_1e6 = 600269.6770124451 (~6.002697e5). THIS IS THE REPO REACH CEILING.
 *
 *  (S2) zeros-first-25.js / FIRST_25_ZEROS. 25 ordinates gamma_1..gamma_25; largest is
 *       gamma_25 = 88.809111207634465 (T < 100). A bundle-size leaf, far below the ceiling;
 *       adds nothing to the reach.
 *
 *  (S3) imp-360-extended-ladder-N1e6.js. An N-indexed collision-time / minimum-gap ladder
 *       (H_raw = min gap, t_c_pair = H_raw^2/8, bracket bounds) at N up to 1,000,000. It
 *       DERIVES its rows FROM the same 1e6 ordinates in zeros-to-1e6.js; it holds no raw
 *       ordinate table of its own and reaches no higher (top row N = 1e6 uses exactly the
 *       ordinates up to gamma_1e6). Not an ordinate source.
 *
 *  (S4) imp-962 plateau / Gronwall-cert modules (N10k..N1e6). Derived plateau-structure
 *       and per-plateau certificate summaries, N-indexed; no ordinate table, no reach.
 *
 *  (S5) Repo-wide numeric sweep for any other verified ordinate above the ceiling. A scan
 *       of src/data for ordinate-shaped literals in (600270, 9999999) finds NO verified
 *       zero ordinate above gamma_1e6 anywhere. The only million-scale literals that turn
 *       up are NON-ordinate quantities: a cosh cancellation "margin" 1433526.6 (imp-3541),
 *       Watson majorant rho-ratios -2307494.8 / floorNoise 3075424.7 (imp-33241), and a
 *       gate-2 lane-A probe 5377393.96 (imp-95013b). None is a zero ordinate.
 *
 * QUANTIFYING THE DEAD-ZONE CLOSURE. The imp-95519 verified-height window bottom
 * T = 3.0e12 is a VERIFICATION result (RH confirmed up to that height, Platt-Trudgian /
 * Gourdon), not a table of windowable ordinates, so it supplies no ordinate reach. With
 * the top verified ordinate pinned at gamma_1e6 = 6.003e5 and the imp-95729 crossover at
 * T0 = 1.14e9, extending an ordinate-based estimator past the ceiling would require new
 * Odlyzko-scale computed ordinate tables that do not exist in the repo and are not a cheap
 * extension. So the fraction of the dead zone that any in-repo ordinate source closes
 * ABOVE the ceiling is ZERO: all ~3.279 decades from the ceiling to the crossover and all
 * ~6.699 decades to the window bottom stay unreached by verified ordinates.
 *
 * VERDICT. The obstruction STANDS. The verified-ordinate reach ceiling for the WHOLE repo
 * is gamma_1e6 = 6.003e5 (source S1); no other source (S2..S4) reaches higher and no other
 * Odlyzko-derived ordinate bundle exists (S5). This is the verified-height bottleneck: the
 * only lever that would push past it is more verified ordinate data (RH-free HPC), which is
 * out of reach in-repo. Assessment only; changes no bound; NO QED; the zero-side route
 * stays PCC/GRH-gated; no refereed bound is changed.
 *
 * @see imp-95750-number-variance-deadzone-measurement-reach (direct-measurement ceiling)
 * @see imp-95783-rtrue-vs-rcap-gap-deadzone (F4 obstruction this audit backs)
 * @see zeros-to-1e6 (ZEROS_EXTENDED, gamma_1e6 = 6.003e5)
 */

// Reach ceiling and landmark heights (baked literals from the cited modules).
const GAMMA_1E6 = 600269.6770124451; // last entry of ZEROS_EXTENDED (zeros-to-1e6.js)
const GAMMA_25 = 88.809111207634465; // last entry of FIRST_25_ZEROS (zeros-first-25.js)
const CROSSOVER_T0 = 1.14e9; // imp-95729 E_coll = E_trunc crossover height
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom (verification, not ordinates)

// Decade arithmetic above the ceiling (closed form; recomputed here).
const remainingToCrossoverDecades = Math.log10(CROSSOVER_T0 / GAMMA_1E6); // ~3.279
const remainingToWindowBottomDecades = Math.log10(WINDOW_BOTTOM_T / GAMMA_1E6); // ~6.699
const deadZoneClosedAboveCeilingPct = 0; // no in-repo ordinate source reaches above the ceiling

export const IMP95801_ORDINATE_SOURCE_REACH_AUDIT = {
  ticket: 'imp-95801',
  proofSection: 'S-frontier',
  question:
    'Does any verified-ordinate source in the repo (ZEROS_EXTENDED, zeros-first-25, the ' +
    'imp-360 / imp-962 ladders, or any other Odlyzko-derived bundle), or a cheap extension ' +
    'of one, push the top verified ordinate past the imp-95750 dead-zone ceiling ' +
    'gamma_1e6 = 6.003e5, and how much of the imp-95783 F4 dead zone would that close? ' +
    'Audit / assessment only; NO QED.',
  reachCeiling: {
    value: +GAMMA_1E6.toExponential(6), // 6.002697e5
    source: 'S1: zeros-to-1e6.js / ZEROS_EXTENDED (last of N = 1e6 Odlyzko ordinates)',
  },
  sources: [
    {
      id: 'S1',
      module: 'zeros-to-1e6.js',
      exportName: 'ZEROS_EXTENDED',
      kind: 'verified ordinate table',
      count: 1000000,
      maxOrdinate: GAMMA_1E6, // 600269.6770124451
      isReachCeiling: true,
      note: 'Odlyzko zeros1..zeros10, sigma = 1/2; the single largest verified ordinate table in the repo.',
    },
    {
      id: 'S2',
      module: 'zeros-first-25.js',
      exportName: 'FIRST_25_ZEROS',
      kind: 'verified ordinate table (leaf)',
      count: 25,
      maxOrdinate: GAMMA_25, // 88.809111207634465
      isReachCeiling: false,
      note: 'gamma_1..gamma_25 (T < 100); bundle-size leaf; equals ZEROS_EXTENDED.slice(0,25); adds no reach.',
    },
    {
      id: 'S3',
      module: 'imp-360-extended-ladder-N1e6.js',
      exportName: 'imp-360 / imp-423 collision-time ladder',
      kind: 'derived N-indexed summary (not an ordinate source)',
      count: null,
      maxOrdinate: null,
      isReachCeiling: false,
      note: 'H_raw / t_c_pair rows at N up to 1e6, derived FROM ZEROS_EXTENDED; holds no raw ordinate table, reaches no higher.',
    },
    {
      id: 'S4',
      module: 'imp-962-plateau-structure-N10k-to-N1e6.js (+ Gronwall-cert sibling)',
      exportName: 'IMP_962_PLATEAU_STRUCTURE_*',
      kind: 'derived N-indexed summary (not an ordinate source)',
      count: null,
      maxOrdinate: null,
      isReachCeiling: false,
      note: 'plateau-structure / per-plateau certificate summaries; no ordinate table, no reach.',
    },
    {
      id: 'S5',
      module: 'repo-wide numeric sweep',
      exportName: null,
      kind: 'audit sweep for any other Odlyzko-derived ordinate bundle',
      count: 0,
      maxOrdinate: null,
      isReachCeiling: false,
      note:
        'No verified zero ordinate above gamma_1e6 exists anywhere in src/data. The only ' +
        'million-scale literals found are NON-ordinate quantities: cosh margin 1433526.6 ' +
        '(imp-3541), Watson rho-ratios -2307494.8 / floorNoise 3075424.7 (imp-33241), and a ' +
        'gate-2 lane-A probe 5377393.96 (imp-95013b).',
    },
  ],
  deadZoneClosure: {
    ceiling: GAMMA_1E6, // 6.003e5
    crossoverT0: CROSSOVER_T0, // 1.14e9 (imp-95729)
    windowBottomT: WINDOW_BOTTOM_T, // 3.0e12 (imp-95519; verification, not ordinates)
    remainingToCrossoverDecades: +remainingToCrossoverDecades.toFixed(4), // ~3.279
    remainingToWindowBottomDecades: +remainingToWindowBottomDecades.toFixed(4), // ~6.699
    closedAboveCeilingPct: deadZoneClosedAboveCeilingPct, // 0
    note:
      'The imp-95519 window bottom is a verified-HEIGHT result (RH up to T = 3e12), not a table ' +
      'of windowable ordinates, so it supplies no ordinate reach. Pushing an ordinate-based ' +
      'estimator past gamma_1e6 needs new Odlyzko-scale computed tables absent from the repo and ' +
      'not a cheap extension, so 0% of the dead zone above the ceiling is closeable in-repo.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier ordinate-source audit, NOT rigorous). The obstruction STANDS. The ' +
    'verified-ordinate reach ceiling for the whole repo is gamma_1e6 = 6.003e5 (S1: the last of ' +
    'the 1e6 Odlyzko ordinates in zeros-to-1e6.js). No other source reaches higher -- ' +
    'zeros-first-25 stops at gamma_25 < 100 (S2), the imp-360 / imp-962 ladders are N-indexed ' +
    'derived summaries with no ordinate table of their own (S3, S4), and a repo-wide sweep finds ' +
    'no other Odlyzko-derived ordinate bundle, only non-ordinate million-scale literals (S5). So ' +
    '0% of the dead zone above the ceiling is closeable from in-repo ordinate data: all ~3.279 ' +
    'decades to the imp-95729 crossover T0 = 1.14e9 and all ~6.699 decades to the imp-95519 ' +
    'window bottom T = 3.0e12 stay unreached by verified ordinates. This is the verified-height ' +
    'bottleneck; the only lever past it is more verified ordinate data (RH-free HPC), out of ' +
    'reach in-repo. Changes no bound; NO QED; the zero-side route stays PCC/GRH-gated; ' +
    'no refereed bound is changed.',
  citation:
    'imp-95750 (direct-measurement ceiling); imp-95783 F4 (dead-zone obstruction this backs); ' +
    'imp-95729 (crossover T0 = 1.14e9); imp-95519 (window bottom T = 3.0e12); ' +
    'zeros-to-1e6 (ZEROS_EXTENDED, gamma_1e6 = 6.003e5); zeros-first-25 (gamma_25 = 88.809...).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // The reach ceiling is the largest ordinate and it is the imp-95750 gamma_1e6 = 6.003e5.
  if (!approx(GAMMA_1E6, 6.003e5, 5e2))
    throw new Error('imp-95801: reach ceiling drifted from gamma_1e6 = 6.003e5');
  // The ceiling sits strictly above the imp-95710 measured top region and below the crossover.
  if (!(GAMMA_1E6 > GAMMA_25 && GAMMA_1E6 < CROSSOVER_T0))
    throw new Error('imp-95801: ceiling not strictly between gamma_25 and the crossover');
  // zeros-first-25 tops out well under 100, far below the ceiling.
  if (!(GAMMA_25 < 100))
    throw new Error('imp-95801: zeros-first-25 max ordinate unexpectedly large');
  // Above the ceiling, more than 3 decades remain to the crossover.
  if (!(remainingToCrossoverDecades > 3))
    throw new Error('imp-95801: remaining-to-crossover decades unexpectedly small');
  // No in-repo ordinate source closes any of the dead zone above the ceiling.
  if (deadZoneClosedAboveCeilingPct !== 0)
    throw new Error('imp-95801: dead-zone-above-ceiling closure must be exactly 0 percent');
  // Exactly one source is flagged as the reach ceiling (S1), and it is the ordinate table.
  const ceilingSources = IMP95801_ORDINATE_SOURCE_REACH_AUDIT.sources.filter((s) => s.isReachCeiling);
  if (ceilingSources.length !== 1 || ceilingSources[0].id !== 'S1')
    throw new Error('imp-95801: exactly S1 must be the reach ceiling');
  // honesty gate: assessment only, no QED, no refereed bound is changed.
  if (IMP95801_ORDINATE_SOURCE_REACH_AUDIT.isRigorous !== false)
    throw new Error('imp-95801: isRigorous must be false');
  if (!/NO QED/.test(IMP95801_ORDINATE_SOURCE_REACH_AUDIT.verdict))
    throw new Error('imp-95801: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95801_ORDINATE_SOURCE_REACH_AUDIT.verdict))
    throw new Error('imp-95801: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95801_ORDINATE_SOURCE_REACH_AUDIT;

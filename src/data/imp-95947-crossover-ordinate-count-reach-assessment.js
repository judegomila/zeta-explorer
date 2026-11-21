/**
 * @module imp-95947-crossover-ordinate-count-reach-assessment
 *
 * imp-95947 -- ESTIMATING the verified-ordinate-table size N needed to push a direct, WINDOWED
 * sd(C - E) number-variance measurement up to the imp-95729 crossover T0 ~ 1.14e9 (the nearest
 * frontier landmark, where E_coll = E_trunc), and QUANTIFYING the shortfall from the in-repo
 * N = 1e6 ordinate ceiling (gamma_1e6 = 6.003e5) in orders of magnitude.
 *
 * BACKGROUND. imp-95750 found the direct pointwise sd(C - E) variance measurement is hard-capped
 * by the largest in-repo verified ordinate gamma_1e6 = 6.003e5 (the sole ordinate table, per the
 * imp-95801 audit), so the windowed sample reaches only ~2.4% (~0.079 decade) into the ~3.36-decade
 * gap up to the imp-95729 crossover T0 ~ 1.14e9. imp-95863 built a decade-reach LEDGER for
 * consecutive-ordinate tables aimed at the imp-95519 window bottom T = 3.0e12 (reached only by a
 * ~1.236e13 ordinate table). NEITHER module computed the specific ordinate count N required to
 * reach the CROSSOVER -- the nearest landmark, and the relevant target for a windowed direct
 * measurement. This module fills that single gap.
 *
 * METHOD (RvM-asymptotic reach; import-light, every value a baked literal). For a consecutive
 * ordinate table of N zeros counted from the origin, the top ordinate gamma_N is the height at
 * which the Riemann-von-Mangoldt smooth counting function equals N -- the SAME inversion imp-95863
 * used, so the two modules are consistent:
 *
 *     N_smooth(T) = (T / 2pi) [ ln(T / 2pi) - 1 ] + 7/8 .
 *
 * Here we evaluate N_smooth FORWARD at the crossover instead of inverting to a height.
 * CALIBRATION: N_smooth(gamma_1e6) = 9.99999e5, matching the N = 1e6 anchor to ~4e-7, so the
 * forward evaluations at the crossover are trustworthy asymptotic ESTIMATES (not verified counts).
 *
 * TWO TARGETS.
 *   (1) REACH -- table top exactly at the crossover (gamma_N = T0):
 *         N_reach = N_smooth(1.14e9) ~ 3.269e9 ordinates.
 *   (2) WINDOW -- to CENTER a +/-30% tiled sd(C - E) window at the crossover (the imp-95843 /
 *       imp-95863 windowing needs a half-window of ordinates ABOVE Tc, so the table must reach
 *       1.30 * T0):
 *         N_window = N_smooth(1.30 * 1.14e9) ~ 4.311e9 ordinates.
 *
 * SHORTFALL FROM THE IN-REPO N = 1e6 CEILING.
 *     target      N required     N / 1e6      log10 (orders of magnitude)
 *     reach       3.269e9        3.269e3      3.514
 *     windowed    4.311e9        4.311e3      3.635
 * So a windowed direct measurement at the crossover needs ~4.3e9 verified ordinates -- about
 * 3.6 ORDERS OF MAGNITUDE (a factor ~4300) beyond the in-repo 1e6 table. In height terms this is
 * log10(1.30 * T0 / gamma_1e6) ~ 3.39 decades of T, consistent with the imp-95750 ~3.36-decade
 * gap. CROSS-CHECK against the imp-95863 ledger: the crossover T0 = 1.14e9 sits between the ledger
 * rows N = 1e9 (gamma = 3.719e8) and N = 1e10 (gamma = 3.294e9), so N_reach ~ 3.27e9 is bracketed
 * as required.
 *
 * REALISM. A 3.3e9 (reach) to 4.3e9 (windowed) consecutive-ordinate table is ~1600x..2000x the
 * in-repo 16.7 MB zeros bundle -- roughly 26 GB..35 GB of double-precision ordinates. These zeros
 * DO exist externally (Gourdon 2004 verified the first ~1e13 zeros up to height ~2.4e12, far above
 * the crossover 1.14e9), so the crossover is reachable IN PRINCIPLE by an external dataset -- but
 * it is NOT reachable by the in-repo bundle nor by any cheap near-term extension of it, and no
 * cataloged in-repo source (imp-95801) comes within ~3.5 orders of magnitude of it. This matches
 * the imp-95863 verdict: the only in-repo lever that reaches high T is the imp-95722 analytic
 * r_cap envelope, not a bigger ordinate table.
 *
 * VERDICT. A direct windowed sd(C - E) measurement at the imp-95729 crossover T0 ~ 1.14e9 needs
 * ~4.3e9 verified ordinates (~3.3e9 for bare reach), a ~3.6-order-of-magnitude (factor ~4300)
 * shortfall from the in-repo N = 1e6 ceiling. No in-repo table and no realistic near-term
 * extension of the 16.7 MB bundle closes it; only an external Odlyzko/Gourdon-scale table (26..35
 * GB) could, and that overshoots the repo's role. The zero-side direct-measurement route to the
 * crossover therefore stays out of reach; the analytic r_cap envelope remains the only in-repo
 * lever above gamma_1e6. Assessment/estimate only; changes no bound; NO QED; the zero-side route
 * stays PCC / GRH-gated; no refereed bound is changed.
 *
 * @see imp-95750-number-variance-deadzone-measurement-reach (F2 dead-zone: ~2.4% reached, ~3.36-decade gap)
 * @see imp-95863-intermediate-ordinate-table-reach-ledger (complementary ledger to the 3e12 window bottom)
 * @see imp-95801 (in-repo ordinate ceiling gamma_1e6 = 6.003e5, no source higher)
 * @see imp-95729 (crossover T0 = 1.14e9, E_coll = E_trunc); imp-95722 (analytic r_cap envelope)
 */

// Baked landmark values (from the cited modules).
const GAMMA_1E6 = 600269.6770124451; // exact ZEROS_EXTENDED anchor; in-repo ordinate ceiling (N=1e6)
const CEILING_N = 1000000; // in-repo ordinate-table size cap (imp-95801)
const CROSSOVER_T0 = 1.14e9; // imp-95729 E_coll = E_trunc crossover height (nearest frontier landmark)
const WINDOW_HALF_FRAC = 0.30; // +/-30% tiled sd(C-E) window (imp-95843 / imp-95863 windowing)

// Riemann-von-Mangoldt smooth counting function -- SAME inversion family as imp-95863, evaluated
// forward here (height -> count). N_smooth(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8.
const TWO_PI = 2 * Math.PI;
function nSmooth(T) {
  return (T / TWO_PI) * (Math.log(T / TWO_PI) - 1) + 7 / 8;
}

const N_REACH = nSmooth(CROSSOVER_T0); // ~3.269e9: table top exactly at the crossover
const N_WINDOW = nSmooth((1 + WINDOW_HALF_FRAC) * CROSSOVER_T0); // ~4.311e9: center a +/-30% window at Tc

const SHORTFALL = [
  {
    target: 'reach',
    note: 'table top exactly at the crossover (gamma_N = T0)',
    nRequired: +N_REACH.toExponential(6), // 3.268838e9
    ratioOverCeiling: +(N_REACH / CEILING_N).toExponential(4), // 3.2688e3
    ordersOfMagnitude: +Math.log10(N_REACH / CEILING_N).toFixed(4), // 3.5144
    storageGB: +((N_REACH * 8) / 1e9).toFixed(1), // ~26.2 GB float64
  },
  {
    target: 'windowed',
    note: 'center a +/-30% tiled sd(C-E) window at the crossover (top = 1.30 * T0)',
    nRequired: +N_WINDOW.toExponential(6), // 4.311373e9
    ratioOverCeiling: +(N_WINDOW / CEILING_N).toExponential(4), // 4.3114e3
    ordersOfMagnitude: +Math.log10(N_WINDOW / CEILING_N).toFixed(4), // 3.6346
    storageGB: +((N_WINDOW * 8) / 1e9).toFixed(1), // ~34.5 GB float64
  },
];

export const IMP95947_CROSSOVER_ORDINATE_COUNT_REACH_ASSESSMENT = {
  ticket: 'imp-95947',
  proofSection: 'S-frontier',
  question:
    'What verified-ordinate-table size N would a direct, WINDOWED sd(C - E) number-variance ' +
    'measurement need to reach the imp-95729 crossover T0 ~ 1.14e9 (E_coll = E_trunc), and how ' +
    'many orders of magnitude short of that is the in-repo N = 1e6 ceiling? Assessment only; NO QED.',
  method:
    'Evaluate the Riemann-von-Mangoldt smooth counting function N_smooth(T) = (T/2pi)(ln(T/2pi) - 1) ' +
    '+ 7/8 FORWARD at the crossover (the same inversion family imp-95863 used, evaluated height->count). ' +
    'Calibration: N_smooth(gamma_1e6) = 9.99999e5 matches the N=1e6 anchor to ~4e-7. Estimates, ' +
    'not verified counts.',
  inRepoCeiling: {
    N: CEILING_N,
    gammaN: GAMMA_1E6,
    value: +GAMMA_1E6.toExponential(6), // 6.002697e5
    bundleSizeMB: 16.7, // in-repo zeros bundle for 1e6 ordinates
    source: 'imp-95801: zeros-to-1e6.js / ZEROS_EXTENDED is the sole ordinate table; nothing higher in-repo',
  },
  crossoverT0: CROSSOVER_T0,
  windowHalfFrac: WINDOW_HALF_FRAC,
  nReach: +N_REACH.toExponential(6), // 3.268838e9
  nWindow: +N_WINDOW.toExponential(6), // 4.311373e9
  shortfall: SHORTFALL,
  heightDecadesToCrossover: +Math.log10(CROSSOVER_T0 / GAMMA_1E6).toFixed(4), // 3.2786 (matches imp-95750 ~3.36)
  ledgerBracket: {
    // Cross-check vs imp-95863 ledger: T0 = 1.14e9 sits between these consecutive-table rows.
    below: { N: 1e9, gammaN: 3.7187e8 },
    above: { N: 1e10, gammaN: 3.2935e9 },
    nReachBetween: true, // 1e9 < N_reach(~3.27e9) < 1e10, and its gamma matches T0 between the rows
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier reach estimate, NOT rigorous). A direct WINDOWED sd(C - E) measurement ' +
    'at the imp-95729 crossover T0 ~ 1.14e9 needs ~4.311e9 verified ordinates (~3.269e9 for bare ' +
    'reach with the table top AT the crossover), a ~3.6-order-of-magnitude (factor ~4300) shortfall ' +
    'from the in-repo N = 1e6 ceiling (gamma_1e6 = 6.003e5). That is a ~26..35 GB double-precision ' +
    'table, ~1600x..2000x the 16.7 MB in-repo zeros bundle; no in-repo source (imp-95801) comes ' +
    'within ~3.5 orders of magnitude, and no cheap near-term extension of the bundle closes it. The ' +
    'zeros DO exist externally (Gourdon 2004 verified ~1e13 zeros to height ~2.4e12, far above the ' +
    'crossover), so the crossover is reachable IN PRINCIPLE by an external Odlyzko/Gourdon-scale ' +
    'dataset but not by the repo. Consistent with imp-95863: the only in-repo lever above gamma_1e6 ' +
    'is the imp-95722 analytic r_cap envelope, not a bigger ordinate table. Changes no bound; NO ' +
    'QED; the zero-side route stays PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95750 (direct-measurement dead-zone, ~2.4% reached, ~3.36-decade gap to the crossover); ' +
    'imp-95863 (complementary ordinate-table reach ledger to T = 3.0e12); imp-95801 (in-repo ' +
    'ordinate ceiling gamma_1e6 = 6.003e5); imp-95729 (crossover T0 = 1.14e9); imp-95722 (analytic ' +
    'r_cap envelope, the only in-repo high-T lever).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // Calibration: N_smooth(gamma_1e6) matches the N=1e6 anchor to ~4e-7.
  if (!(rel(nSmooth(GAMMA_1E6), CEILING_N) < 1e-5))
    throw new Error('imp-95947: N_smooth(gamma_1e6) drifted from the N=1e6 anchor');
  // Reach count is ~3.269e9 and the windowed count is strictly larger (~4.311e9).
  if (!approx(N_REACH, 3.269e9, 5e6))
    throw new Error('imp-95947: N_reach drifted from ~3.269e9');
  if (!approx(N_WINDOW, 4.311e9, 5e6))
    throw new Error('imp-95947: N_window drifted from ~4.311e9');
  if (!(N_WINDOW > N_REACH))
    throw new Error('imp-95947: windowed count must exceed bare-reach count');
  // Shortfall is ~3.5..3.6 orders of magnitude over the 1e6 ceiling.
  for (const s of SHORTFALL) {
    if (!approx(s.ordersOfMagnitude, Math.log10(s.nRequired / CEILING_N), 5e-3))
      throw new Error('imp-95947: orders-of-magnitude inconsistent with nRequired at target=' + s.target);
    if (!(s.ordersOfMagnitude > 3.4 && s.ordersOfMagnitude < 3.7))
      throw new Error('imp-95947: shortfall must be ~3.5..3.6 orders of magnitude at target=' + s.target);
    if (!(s.storageGB > 20 && s.storageGB < 40))
      throw new Error('imp-95947: float64 storage must be ~20..40 GB at target=' + s.target);
  }
  // Height decades to the crossover is ~3.28 (consistent with the imp-95750 ~3.36-decade gap).
  if (!approx(Math.log10(CROSSOVER_T0 / GAMMA_1E6), 3.2786, 5e-3))
    throw new Error('imp-95947: height-decades-to-crossover drifted from ~3.28');
  // Ledger bracket: T0 sits between the imp-95863 rows N=1e9 (3.719e8) and N=1e10 (3.294e9).
  if (!(CROSSOVER_T0 > 3.7187e8 && CROSSOVER_T0 < 3.2935e9))
    throw new Error('imp-95947: crossover T0 must lie between the imp-95863 gamma_1e9 and gamma_1e10 rows');
  if (!(N_REACH > 1e9 && N_REACH < 1e10))
    throw new Error('imp-95947: N_reach must lie between the imp-95863 N=1e9 and N=1e10 ledger rows');
  // Assessment only -- never a proof.
  if (IMP95947_CROSSOVER_ORDINATE_COUNT_REACH_ASSESSMENT.isRigorous !== false)
    throw new Error('imp-95947: assessment must not be marked rigorous (NO QED)');
})();

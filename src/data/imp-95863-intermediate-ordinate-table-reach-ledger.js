/**
 * @module imp-95863-intermediate-ordinate-table-reach-ledger
 *
 * imp-95863 -- ASSESSING whether any intermediate verified-ordinate table (the "zeros-to-1e7
 * or higher" candidate the frontier scout floated) would narrow the imp-95843 / imp-95735
 * number-variance ratio window-reach data-ceiling, and QUANTIFYING how many decades each
 * candidate table size buys toward the imp-95519 verified-height window bottom T = 3.0e12.
 *
 * BACKGROUND. imp-95562 measured the pointwise number-variance ratio
 * r(T) = sd(C - E)^2 / Sigma^2(L) ~ 0.40 on the 10^6 Odlyzko ordinates (the GUE / mean-square
 * envelope OVER-estimates the true pointwise zero-count fluctuation). imp-95710 tabulated r(T)
 * at six heights T = 1e4..5e5 (flat-to-weakly-falling band [0.349, 0.480], NOT rising toward
 * the GUE asymptote 1). imp-95843 pushed the measurement above 5e5 but hit a DATA-CEILING: the
 * +/-30% tiled windows truncate at gamma(10^6) = 6.003e5, so the effective sampled height rose
 * only ~0.025 decades and the ~6.8-decade gap to T = 3.0e12 was unchanged. imp-95801 then
 * AUDITED every verified-ordinate source in the repo and found the sole ordinate table caps at
 * N = 1e6 (gamma_1e6 = 600269.677 ~ 6.003e5); no in-repo source reaches higher.
 *
 * THE QUESTION HERE. Given the imp-95801 catalog, would ANY intermediate verified-ordinate
 * source ("zeros-to-1e7 or higher") narrow the ~6.8-decade gap, and how many decades does each
 * candidate table size buy? This module answers by building a DECADE LEDGER over candidate
 * table sizes N = 1e6..1e13.
 *
 * METHOD (RvM-asymptotic reach; import-light, every value a baked literal). For a consecutive
 * ordinate table of N zeros counted from the origin, the top ordinate gamma_N is the height at
 * which the Riemann-von Mangoldt smooth counting function equals N:
 *
 *     N_smooth(T) = (T / 2pi) [ ln(T / 2pi) - 1 ] + 7/8 = N ,
 *
 * inverted by Newton iteration (tmp/imp-95863-scratch.mjs). CALIBRATION: at N = 1e6 the
 * inversion returns gamma_1e6 = 6.00270e5, matching the exact ZEROS_EXTENDED anchor
 * 600269.6770124451 to relative error ~3.9e-7, so the ledger's higher rows are trustworthy
 * asymptotic ESTIMATES (labelled as such -- not verified ordinates). Decades bought is measured
 * against the baseline gap log10(3.0e12 / gamma_1e6) = 6.6988 from the current in-repo ceiling.
 *
 * THE LEDGER (RvM-asymptotic gamma_N; decades still remaining to T = 3.0e12; decades bought
 * over the in-repo gamma_1e6 = 6.003e5 ceiling):
 *
 *     N       gamma_N (RvM)   dec. to 3e12   dec. bought
 *     1e6     6.0027e5        6.6988         0.0000   <- in-repo ceiling (only real table)
 *     1e7     4.9924e6        5.7788         0.9200
 *     1e8     4.2654e7        4.8472         1.8516
 *     1e9     3.7187e8        3.9067         2.7920
 *     1e10    3.2935e9        2.9595         3.7393
 *     1e11    2.9539e10       2.0067         4.6920
 *     1e12    2.6765e11       1.0495         5.6492
 *     1e13    2.4460e12       0.0887         6.6101   <- essentially reaches the window bottom
 *
 * Each 10x larger table buys ~0.95 decades (the zero density grows only logarithmically, so
 * gamma_N ~ 2pi N / ln N and log10 gamma_N advances almost exactly one decade per decade of N).
 * To land a LOCAL window centred at T = 3.0e12 needs N_smooth(3e12) ~ 1.236e13 consecutive
 * ordinates -- about 1.24e7 times the in-repo 1e6 table.
 *
 * VERDICT. NONE of these intermediate tables narrows the gap in-repo, because per the imp-95801
 * audit NONE of them exists in the repo: the "zeros-to-1e7 or higher" candidate is hypothetical,
 * so the decades actually bought BY ANY CATALOGED SOURCE is 0.0000 and the ~6.70-decade gap to
 * T = 3.0e12 stands unchanged. The ledger quantifies the PRICE of closing it numerically: a
 * ~1e7 table buys under one decade (still ~5.8 short), and only a ~1e13-scale consecutive
 * ordinate table reaches the window bottom -- Odlyzko-scale computation absent from the repo and
 * not a cheap extension. (Odlyzko-style LOCAL high blocks near T = 10^20..10^23 sit far ABOVE
 * 3e12 and would overshoot the forecast target rather than land on it.) The only lever that
 * actually reaches T = 3e12 in-repo is the imp-95722 analytic r_cap envelope (r_cap(3e12) ~ 0.26),
 * not a bigger ordinate table. Assessment only; changes no bound; NO QED; the zero-side route
 * stays PCC / GRH-gated; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-95801-ordinate-source-reach-audit (in-repo ceiling gamma_1e6 = 6.003e5, no source higher)
 * @see imp-95843-number-variance-ratio-extend-data-ceiling (data-ceiling sub-gap this quantifies)
 * @see imp-95735-number-variance-ratio-conservatism-glossary-headword (window-reach sub-gap named)
 */

// Baked landmark heights (from the cited modules).
const GAMMA_1E6 = 600269.6770124451; // exact ZEROS_EXTENDED anchor (zeros-to-1e6.js); in-repo ceiling
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom (verification, not ordinates)
const CROSSOVER_T0 = 1.14e9; // imp-95729 E_coll = E_trunc crossover height
const BASELINE_GAP_DECADES = 6.6988; // log10(3.0e12 / gamma_1e6)
const N_AT_WINDOW_BOTTOM = 1.2362e13; // N_smooth(3.0e12): consecutive ordinates to reach the window bottom

// RvM-asymptotic reach ledger (baked literals from tmp/imp-95863-scratch.mjs; N=1e6 row is the
// exact anchor, higher rows are Newton inversions of N_smooth(T)=N, calibrated to ~3.9e-7 at 1e6).
const LEDGER = [
  { N: 1e6, gammaN: GAMMA_1E6, decadesToWindow: 6.6988, decadesBought: 0.0, inRepo: true },
  { N: 1e7, gammaN: 4.9924e6, decadesToWindow: 5.7788, decadesBought: 0.92, inRepo: false },
  { N: 1e8, gammaN: 4.2654e7, decadesToWindow: 4.8472, decadesBought: 1.8516, inRepo: false },
  { N: 1e9, gammaN: 3.7187e8, decadesToWindow: 3.9067, decadesBought: 2.792, inRepo: false },
  { N: 1e10, gammaN: 3.2935e9, decadesToWindow: 2.9595, decadesBought: 3.7393, inRepo: false },
  { N: 1e11, gammaN: 2.9539e10, decadesToWindow: 2.0067, decadesBought: 4.692, inRepo: false },
  { N: 1e12, gammaN: 2.6765e11, decadesToWindow: 1.0495, decadesBought: 5.6492, inRepo: false },
  { N: 1e13, gammaN: 2.446e12, decadesToWindow: 0.0887, decadesBought: 6.6101, inRepo: false },
];

// Decades actually bought in-repo by any cataloged source (imp-95801): the only real table is 1e6.
const decadesBoughtInRepo = LEDGER.filter((r) => r.inRepo).reduce((m, r) => Math.max(m, r.decadesBought), 0);

export const IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER = {
  ticket: 'imp-95863',
  proofSection: 'S-frontier',
  question:
    'Would any intermediate verified-ordinate source cataloged in imp-95801 (zeros-to-1e7 or ' +
    'higher) narrow the ~6.8-decade imp-95843 / imp-95735 number-variance ratio window-reach ' +
    'data-ceiling toward T = 3.0e12, and how many decades does each available table buy? ' +
    'Assessment only; NO QED.',
  method:
    'RvM-asymptotic reach: gamma_N solves N_smooth(T) = (T/2pi)(ln(T/2pi) - 1) + 7/8 = N by ' +
    'Newton inversion (tmp/imp-95863-scratch.mjs), calibrated to the exact gamma_1e6 anchor at ' +
    'relative error ~3.9e-7. Decades bought are measured against the baseline gap ' +
    'log10(3.0e12 / gamma_1e6) = 6.6988. Higher rows are asymptotic ESTIMATES, not verified ordinates.',
  inRepoCeiling: {
    N: 1000000,
    gammaN: GAMMA_1E6,
    value: +GAMMA_1E6.toExponential(6), // 6.002697e5
    source: 'imp-95801: zeros-to-1e6.js / ZEROS_EXTENDED is the sole ordinate table; nothing higher exists in-repo',
  },
  windowBottomT: WINDOW_BOTTOM_T,
  crossoverT0: CROSSOVER_T0,
  baselineGapDecades: BASELINE_GAP_DECADES,
  ledger: LEDGER,
  decadesPerTenfold: 0.95, // ~0.95 decades bought per 10x table growth (log density growth)
  consecutiveOrdinatesToWindowBottom: N_AT_WINDOW_BOTTOM, // ~1.236e13 (N_smooth(3e12))
  decadesBoughtInRepo, // 0 -- no cataloged source above gamma_1e6 exists
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier reach ledger, NOT rigorous). NO intermediate verified-ordinate source ' +
    'narrows the gap IN-REPO: per the imp-95801 audit the sole ordinate table caps at N = 1e6 ' +
    '(gamma_1e6 = 6.003e5), so the "zeros-to-1e7 or higher" candidate is hypothetical and the ' +
    'decades actually bought by any cataloged source is 0.0 -- the ~6.70-decade gap to T = 3.0e12 ' +
    'stands unchanged. The ledger prices the numeric route: a ~1e7 table would buy only ~0.92 ' +
    'decades (still ~5.78 short), each 10x larger table adds ~0.95 decades, and only a ~1e13-scale ' +
    'consecutive ordinate table (N_smooth(3e12) ~ 1.236e13 zeros, ~1.24e7x the in-repo table) ' +
    'reaches the window bottom -- Odlyzko-scale computation absent from the repo and not a cheap ' +
    'extension. Odlyzko-style LOCAL high blocks near T = 10^20..10^23 overshoot 3e12 rather than ' +
    'land on it. The only in-repo lever that actually reaches T = 3e12 is the imp-95722 analytic ' +
    'r_cap envelope (r_cap(3e12) ~ 0.26), not a bigger ordinate table. Changes no bound; NO QED; ' +
    'the zero-side route stays PCC / GRH-gated; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-95801 (in-repo ordinate ceiling gamma_1e6 = 6.003e5); imp-95843 (data-ceiling sub-gap); ' +
    'imp-95735 / imp-95710 / imp-95562 (number-variance ratio r(T) ~ 0.40, no GUE trend); ' +
    'imp-95519 (window bottom T = 3.0e12); imp-95729 (crossover T0 = 1.14e9); ' +
    'imp-95722 (analytic r_cap envelope, r_cap(3e12) ~ 0.26).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // Calibration: RvM inversion at N=1e6 matches the exact ZEROS_EXTENDED anchor closely.
  if (!approx(GAMMA_1E6, 6.003e5, 5e2))
    throw new Error('imp-95863: in-repo ceiling drifted from gamma_1e6 = 6.003e5');
  // Baseline gap is log10(3e12 / gamma_1e6) ~ 6.699.
  if (!approx(Math.log10(WINDOW_BOTTOM_T / GAMMA_1E6), BASELINE_GAP_DECADES, 5e-3))
    throw new Error('imp-95863: baseline gap decades disagree with log10(3e12 / gamma_1e6)');
  // Ledger is monotone in N: gamma_N rises, decades-to-window falls, decades-bought rises.
  for (let i = 1; i < LEDGER.length; i++) {
    if (!(LEDGER[i].N > LEDGER[i - 1].N)) throw new Error('imp-95863: ledger N not increasing');
    if (!(LEDGER[i].gammaN > LEDGER[i - 1].gammaN)) throw new Error('imp-95863: gamma_N not increasing');
    if (!(LEDGER[i].decadesToWindow < LEDGER[i - 1].decadesToWindow))
      throw new Error('imp-95863: decades-to-window not decreasing');
    if (!(LEDGER[i].decadesBought > LEDGER[i - 1].decadesBought))
      throw new Error('imp-95863: decades-bought not increasing');
  }
  // Each row: decadesToWindow + decadesBought must equal the baseline gap (closure identity).
  for (const r of LEDGER) {
    if (!approx(r.decadesToWindow + r.decadesBought, BASELINE_GAP_DECADES, 3e-3))
      throw new Error('imp-95863: row closure identity (toWindow + bought = baseline) violated at N=' + r.N);
    // gamma_N vs decadesToWindow consistency: log10(3e12 / gamma_N) ~ decadesToWindow.
    if (!approx(Math.log10(WINDOW_BOTTOM_T / r.gammaN), r.decadesToWindow, 5e-3))
      throw new Error('imp-95863: gamma_N and decadesToWindow inconsistent at N=' + r.N);
  }
  // A 1e7 table buys under one decade (the frontier-scout hope is quantitatively small).
  const row1e7 = LEDGER.find((r) => r.N === 1e7);
  if (!(row1e7 && row1e7.decadesBought < 1))
    throw new Error('imp-95863: a 1e7 table must buy under one decade');
  // Reaching the window bottom needs a ~1e13-scale table.
  if (!(N_AT_WINDOW_BOTTOM > 1e13 && N_AT_WINDOW_BOTTOM < 2e13))
    throw new Error('imp-95863: N at window bottom must be ~1.2e13');
  // No cataloged in-repo source buys any decades.
  if (decadesBoughtInRepo !== 0)
    throw new Error('imp-95863: decades bought in-repo must be exactly 0 (imp-95801 catalog)');
  // honesty gate: assessment only, no QED, PT stays SOTA.
  if (IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.isRigorous !== false)
    throw new Error('imp-95863: isRigorous must be false');
  if (!/NO QED/.test(IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.verdict))
    throw new Error('imp-95863: verdict dropped the NO QED banner');
  if (!/Lambda <= 0\.2 remains SOTA/.test(IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER.verdict))
    throw new Error('imp-95863: verdict dropped the PT Lambda <= 0.2 SOTA banner');
})();

export default IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER;

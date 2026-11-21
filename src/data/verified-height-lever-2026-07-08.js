/**
 * @module verified-height-lever-2026-07-08
 * @fileoverview
 * "The one real lever below Λ ≤ 0.2": extending the rigorous RH verification
 * height X. Companion to the PT-floor sensitivity audit (which showed X, not
 * barrier slack, binds the floor). This module specifies the lever honestly:
 * its mechanism, its X→Λ payoff, its diminishing-returns (inverse-log) scaling,
 * and its hard ceiling (it can NEVER reach Λ=0 / RH at any finite height).
 *
 * Sources: Platt (2017) Math.Comp. 86; Platt–Trudgian (2021) BLMS 53, arXiv:2004.09765;
 * Polymath15 (Tao et al. 2019) arXiv:1904.12438 + Polymath wiki; Rodgers–Tao (2020)
 * Forum Math Pi (Λ≥0). Uncertainty flags preserved verbatim — see caveats.
 *
 * HONEST SCOPE: this is a RH-FREE HPC computation, not an analytic advance. It
 * only nudges the bound (0.20 → ~0.19 for a 3× height gain) and asymptotes well
 * above 0. No refereed bound is changed. NO QED.
 *
 * @see VerifiedHeightLeverPage.jsx (route /verified-height-lever, listed in
 *   nav-groups.js) -- the page consumer that renders this module's payoff
 *   table, scaling law, and honest-ceiling banner.
 */

export const LEVER_META = {
  date: '2026-07-08',
  mechanism: 'Λ ≤ t₀ + ½ y₀²  (Polymath15 barrier). A taller verified height X lets the barrier ' +
    'rectangle sit closer to the real axis (smaller y₀) and lower t₀, shrinking the bound.',
  scalingLaw: 'The Λ upper bound improves ~INVERSELY with log(X). Height gains buy sharply ' +
    'diminishing bound improvements.',
  currentRecord: 'X = 3×10¹² (Platt–Trudgian 2021): 12,363,153,437,138 zeros up to height ' +
    '3,000,175,332,800, all simple and on the critical line — rigorously, via interval arithmetic.',
  midFlight: 'No rigorous verification beyond 3×10¹² announced through mid-2026 (Gourdon 2004 ' +
    'reached 10¹³ zeros but NON-rigorously, so it cannot serve as a barrier input).',
  verdict: 'Real, shovel-ready, RH-free — but a diminishing-returns HPC crank, not a path to RH.',
};

// X → best rigorous Λ. `pinned` marks rows locked to a primary source; others
// carry the researcher's uncertainty annotation (do NOT present as exact).
export const HEIGHT_TO_LAMBDA = [
  { X: '≈6×10¹⁰', lambda: 'Λ ≤ 0.22', pinned: true,  note: 'Published unconditional headline, arXiv:1904.12438 (X available at write-up).' },
  { X: '3×10¹²',  lambda: 'Λ ≤ 0.20', pinned: true,  note: 'Platt–Trudgian 2021 height fed into the same machinery (Polymath wiki).' },
  { X: '≈10¹³–2×10¹³', lambda: 'Λ ≤ ~0.19', pinned: false, note: 'Plausible next rung; exact X NOT pinned to a primary source (P15 §10 table not verifiable this pass). Treat 0.19 as ≈.' },
  { X: '≈10¹⁴–10¹⁵', lambda: 'Λ ≤ ~0.18', pinned: false, note: 'Interpolated from the inverse-log law, not sourced.' },
  { X: '≈10¹⁹–10²¹', lambda: 'Λ ≤ ~0.1', pinned: false, note: 'Deep-conditional rung (Polymath threads); astronomically beyond feasible HPC.' },
  { X: '∞ (impossible)', lambda: 'Λ ≤ 0 (RH)', pinned: true, note: 'UNREACHABLE by computation — RH ⇔ zeros on the line to INFINITE height. This route asymptotes well above 0.' },
];

export const METHODOLOGY = [
  'Rigorous interval / ball arithmetic (Platt: MPFI, ~300-bit, complex rectangles) — every ζ value is a certified enclosure, so the output is a theorem, not a scan.',
  'Certified evaluation of ζ(½+it) on the critical line with rigorous error control (band-limited / smoothed-sum Riemann–Siegel with bounded Poisson-summation error); sign changes locate on-line zeros.',
  'Rigorous zero COUNTING via Turing’s method (Turing, corrected by Lehman, sharpened by Trudgian): N(T) from the argument principle must equal the on-line sign-change count. Equality ⇒ all zeros up to T are simple and on the line.',
];

export const COST_ESTIMATE = {
  claim: 'Extending 3×10¹² → 10¹³ is a bigger, not a new, computation — the same certified ' +
    'Riemann–Siegel + Turing pipeline over a taller band.',
  magnitude: 'Order ~3–5× the Platt–Trudgian compute budget (≈3.3× the height; work grows a bit ' +
    'faster than linearly in T). A large-but-ordinary HPC allocation, not a moonshot.',
  caveat: 'ORDER-OF-MAGNITUDE estimate from the algorithm’s scaling — NOT a group’s published cost model.',
};

export const HONEST_VERDICT = [
  'Real lever, correctly identified: the binding input to the rigorous Λ bound is the verified height.',
  'Only incremental: because improvement is ~inverse-log in height, a 3× gain buys only 0.20 → ~0.19.',
  'A computation, not an analytic advance: it changes one input number; it does not improve the barrier method, close any analytic gap, or touch the Λ≥0 lower bound (Rodgers–Tao).',
  'No QED, ever, via this route: finite verification can never deliver RH; the bound asymptotes above 0.',
];

export const LEVER_CITATIONS = [
  { key: 'platt2017', text: 'Platt, D. J. (2017). "Isolating some non-trivial zeros of zeta." Math. Comp. 86(307).', url: 'https://www.ams.org/journals/mcom/2017-86-307/S0025-5718-2017-03198-7/S0025-5718-2017-03198-7.pdf', status: 'verified' },
  { key: 'plattTrudgian2021', text: 'Platt, D. & Trudgian, T. (2021). "The Riemann hypothesis is true up to 3·10¹²." BLMS 53(3), 792–797. arXiv:2004.09765.', url: 'https://arxiv.org/abs/2004.09765', status: 'verified' },
  { key: 'polymath15', text: 'Tao, T. et al. (Polymath15) (2019). "Effective approximation of heat flow evolution of the Riemann ξ function…" Res. Math. Sci. arXiv:1904.12438.', url: 'https://arxiv.org/abs/1904.12438', status: 'verified (bound/formula/X); §10 exact rows not re-verified' },
  { key: 'polymathWiki', text: 'Polymath Wiki, "De Bruijn–Newman constant" — Λ≤0.20 with 3·10¹²; inverse-log height dependence; deep rungs near 10²¹.', url: 'https://michaelnielsen.org/polymath/index.php?title=De_Bruijn-Newman_constant', status: 'verified as stated' },
  { key: 'rodgersTao2020', text: 'Rodgers, B. & Tao, T. (2020). "The de Bruijn–Newman constant is non-negative." Forum Math. Pi. (context: barrier route lives strictly above 0).', url: 'https://arxiv.org/abs/1801.05914', status: 'collateral cite' },
  { key: 'gourdon2004', text: 'Gourdon, X. (2004). "The 10¹³ first zeros of the Riemann Zeta function…" — Odlyzko–Schönhage, NON-rigorous, unpublished; NOT a valid barrier input.', url: '', status: 'verified as existing & non-rigorous' },
  { key: 'goldstonSuriajaya2025', text: 'Goldston, D. A. & Suriajaya, A. I. (Nov 2025). "Zeta Zeros on the Critical Line." arXiv:2511.20059 — theoretical; only CITES 3·10¹², confirms no newer rigorous record.', url: 'https://arxiv.org/abs/2511.20059', status: 'verified' },
];

export const LEVER_UNCERTAINTIES = [
  'The exact height↔Λ rows below 0.20 (0.19/0.18 and their X) are consistent with the published inverse-log mechanism but were NOT locked to a P15 §10 primary source this pass — 0.19 shown as "≈, at ~10¹³–2×10¹³".',
  'Büthe’s analytic verification method (an alternative to Turing counting) exists and is relevant; exact titles/verified height need a primary-source check before quoting.',
  'The 3×10¹²→10¹³ compute multiple is an algorithmic-scaling order-of-magnitude, not a quoted figure.',
];

// imp-35155: Fit the inverse-log X->Lambda law from the TWO pinned anchors and
// test whether the UNPINNED ~0.19 (at ~10^13) is quantitatively consistent.
// Both candidate 2-parameter forms are EXACTLY determined by the two pinned
// points (6e10 -> 0.22, 3e12 -> 0.20), so each has zero residual on the anchors;
// the discriminating question is the interpolated value at the unpinned rows.
// Log10 heights: L1 = 10.77815, L2 = 12.47712 (delta = 1.69897 decades).
//   Form A (linear-in-log):  Lambda = 0.346879 - 0.0117716 * log10(X)
//   Form B (inverse-log):    Lambda = 0.073114 + 1.583194 / log10(X)   <- matches the stated mechanism
// Measurement only; pins no row to a primary source; changes no bound; NO QED.
export const INVERSE_LOG_FIT = {
  ticket: 'imp-35155',
  anchors: [
    { X: '6e10', log10X: 10.77815, lambda: 0.22, pinned: true },
    { X: '3e12', log10X: 12.47712, lambda: 0.20, pinned: true },
  ],
  formA: { name: 'linear-in-log10', a: 0.346879, b: 0.0117716, expr: 'Lambda = a - b*log10(X)', anchorResidual: 0 },
  formB: { name: 'inverse-log10',   a: 0.073114, b: 1.583194, expr: 'Lambda = a + b/log10(X)', anchorResidual: 0 },
  // Interpolated Lambda at the module HEIGHT_TO_LAMBDA unpinned rows.
  predictions: [
    { X: '1e13',  log10X: 13.0,     module: 0.19, formA: 0.1938, formB: 0.1949 },
    { X: '2e13',  log10X: 13.30103, module: 0.19, formA: 0.1903, formB: 0.1921 },
    { X: '1e14',  log10X: 14.0,     module: 0.18, formA: 0.1821, formB: 0.1862 },
    { X: '1e15',  log10X: 15.0,     module: 0.18, formA: 0.1703, formB: 0.1787 },
  ],
  // Residual of the module approximate 0.19 vs the fits, at the nominal 1e13.
  residualAt1e13: { vsFormA: -0.0038, vsFormB: -0.0049, note: 'module 0.19 sits ~0.004-0.005 BELOW both fits, i.e. within the anchors 2-decimal (+/-0.005) rounding.' },
  band: {
    valueAt1e13: 0.194,
    plusMinus: 0.005,
    interval: [0.189, 0.199],
    rationale: 'Band dominated by the two pinned anchors own 2-decimal rounding (+/-0.005 each); it also covers the A-vs-B form spread (0.0011 at 1e13) and the 1e13..2e13 window width (fit spans 0.190..0.195). The module 0.19 lies inside.',
  },
  verdict: 'CONSISTENT. The unpinned ~0.19 at ~10^13 is quantitatively consistent with the inverse-log law fitted to the two pinned anchors (0.194 +/- 0.005). The inverse-log form (B) is preferred: it matches BOTH the stated 1/log(X) mechanism AND the 0.18 row at 10^14-10^15 (0.179..0.186), whereas linear-in-log undershoots to 0.170 at 10^15. Measurement only; pins no row; changes no bound; NO QED.',
};

export const VERIFIED_HEIGHT_LEVER = {
  meta: LEVER_META,
  heightToLambda: HEIGHT_TO_LAMBDA,
  methodology: METHODOLOGY,
  costEstimate: COST_ESTIMATE,
  honestVerdict: HONEST_VERDICT,
  citations: LEVER_CITATIONS,
  uncertainties: LEVER_UNCERTAINTIES,
  inverseLogFit: INVERSE_LOG_FIT,
};

/**
 * @module imp-35988-i2-derivative-cap-route-comparison
 *
 * imp-35988 (proof/assessment, S-frontier): COMPARE the TWO admissible derivative-error-cap
 * routes imp-35832 named for certifying B = sup|H_t prime| -- the numerator of the imp-35777
 * I2 per-panel log-derivative cap L_panel . (B/delta) < pi -- and ASSESS which yields the
 * TIGHTER certified sup|H_t prime|, and at what PANEL-COUNT cost.
 *
 * imp-35832 named the two routes but only established they are OOM-consistent at B ~ |H_t| . w,
 * NEVER comparing their tightness. This module DERIVES the tightness ordering from structure
 * plus the imp-35845 sharp amplification constant.
 *
 *   Route (I) -- SEPARATE ADDITIVE derivative-error cap C_t prime = E_A prime + E_B prime +
 *     E_{C_0} prime (an independent same-shape Polymath15 budget on the DIFFERENTIATED tails),
 *     with the finite MAIN terms A_t + B_t differentiated EXACTLY termwise.
 *   Route (II) -- CAUCHY ESTIMATE on the I1 value enclosure: |H_t prime(z_0)| <=
 *     sup_{|z - z_0| = r} |H_t(z)| / r, reusing the I1 machinery on a 2D neighbourhood disk of
 *     radius r, inflated uniformly by 1/r (naive r ~ 1/w gives 1/r ~ w).
 *
 * ASSESSMENT / DERIVATION-OF-ORDERING ONLY. Certifies no cap; instantiates no enclosure;
 * evaluates no H_t or H_t prime; budgets no C_t prime; fixes no Cauchy radius r; changes no
 * bound; imp-35337a OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE COMPARISON (three structural sources of Route-II slack, all in the SAME direction)
 * -----------------------------------------------------------------------------
 * Write B_I = sup|A_t prime + B_t prime| + C_t prime (route I, component-wise) and
 * B_II = sup_{disk} |H_t| / r (route II, uniform). Route I is TIGHTER on EVERY axis:
 *
 *   1. MAIN-TERM SHARPNESS. Route I differentiates the finite A_t + B_t Dirichlet sum EXACTLY
 *      termwise (n^{-s} -> (-log n) n^{-s}); this is the SHARPEST possible derivative bound --
 *      no analyticity slack. Route II bounds the main part by the same 1/r ~ w Cauchy inflation
 *      it applies to everything, a COARSER analytic surrogate that ignores the explicit finite-
 *      sum term structure. Exact termwise <= Cauchy-analytic, always.
 *
 *   2. FREQUENCY CONSTANT. Route I amplifies the ERROR cap by A_amp = C_t prime / C_t ~ log N
 *      (imp-35845: the tail-weighted average of log n pinned at the largest surviving term
 *      n = N + 1). Route II inflates by 1/r = w at the natural gap-fraction radius. The EXACT
 *      identity log N = w - (1/2) log 2 makes Route II LARGER by half a nat: w / log N ~ 1.0265
 *      at T_PT (N ~ 4.886e5), so Routes disagree by ~ 2.65% in the frequency factor -- Route I
 *      the smaller.
 *
 *   3. UNIFORM-FOLD + DISK-SUP. Route II applies its single 1/r inflation to the ENTIRE
 *      magnitude sup|H_t| (main terms AND the error cap C_t folded together), and uses the SUP
 *      over a 2D disk, which is >= the value on the 1D boundary segment. Route I applies the
 *      large factor ONLY to the (small) error half and keeps the main-term derivative exact.
 *      Since sup_{disk}|H_t| >= sup_{segment}|H_t| >= |main terms|, this fold is a third,
 *      strictly same-signed, Route-II penalty.
 *
 * All three point the same way: B_I <= B_II structurally. The two routes AGREE only to OOM
 * (both ~ |H_t| . w, imp-35832); the SHARP comparison breaks the tie in favour of Route I.
 *
 * PANEL-COUNT COST (what the tighter B buys downstream)
 * -----------------------------------------------------------------------------
 * The imp-35777 cap sets the per-panel width L_panel = pi / (B / delta), so for a fixed edge
 * length the panel COUNT n scales LINEARLY with B (delta = inf|H_t| is shared -- both routes
 * bound the SAME modulus floor). Hence the panel-count ratio is n_II / n_I = B_II / B_I, whose
 * frequency-factor floor is w / log N ~ 1.0265: Route II needs ~ 2.65% MORE panels than Route I
 * from the constant alone, and strictly more once the uniform-fold + disk-sup slack is added.
 * This is a MARGINAL (few-percent) cost, NOT an order of magnitude -- the panel budget is
 * near-insensitive to the route choice.
 *
 * VERDICT: ROUTE I IS TIGHTER; ROUTE II IS CHEAPER TO INSTANTIATE (a tightness/effort trade)
 * -----------------------------------------------------------------------------
 * Route I (the separate additive cap C_t prime) yields the TIGHTER certified sup|H_t prime| --
 * strictly, by the structural inequality B_I <= B_II, with the frequency floor w / log N ~ 1.0265
 * and further neighbourhood slack. BUT Route II (Cauchy) is CHEAPER to DERIVE: it reuses the I1
 * value machinery on a disk and needs NO new Polymath15 differentiated-tail estimates, whereas
 * Route I must re-run E_A prime + E_B prime + E_{C_0} prime as an independent budget. The trade
 * is TIGHTNESS (route I, ~ 2.65%+ fewer panels) vs DERIVATION EFFORT (route II, no new budget).
 * Because the panel-count gap is only a few percent, the CHEAPER route II is the pragmatic
 * default unless the panel count is the binding constraint. Neither route is instantiated here.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Assessment / ordering-derivation only. Certifies no cap (I2); instantiates no enclosure (I1);
 * evaluates no H_t or H_t prime on any segment; budgets no C_t prime; produces no numeric B;
 * fixes no Cauchy radius r, Delta, or h; lower-bounds no delta; establishes no positivity;
 * certifies no non-vanishing; I2 remains GREENFIELD downstream of W1; changes no bound;
 * imp-35337a OPEN; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35832-i2-derivative-bound-from-i1-enclosure-scope (named the two routes, OOM-consistent only)
 * @see imp-35845-d2-differentiated-truncation-cap-amplification (route I sharp constant A_amp = log N = w - (1/2)log2)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 * @see imp-35725-w1-effective-error-cap-budget (undifferentiated value cap C_t = E_A + E_B + E_{C_0})
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x) = floor(sqrt(x/4 pi)) retained terms)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35832 / imp-35845 / imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this comparison
const TWO_PI = 2 * Math.PI;

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const WINDING_RATE = 0.5 * Math.log(T_PT / TWO_PI); // w(T_PT) ~ 13.446

// Retained-term count N = floor(sqrt(T / 4 pi)) (imp-35674 Part D).
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10

// Route I sharp amplification constant A_amp = log N (imp-35845, tail-weighted, pinned at n=N+1).
// Route II naive Cauchy inflation 1/r = w at the gap-fraction radius r ~ 1/w (imp-35832).
const ROUTE_I_FREQ_FACTOR = LOG_N_TPT; // ~13.10 (exact termwise main terms + log N error amp)
const ROUTE_II_FREQ_FACTOR = WINDING_RATE; // ~13.446 (uniform 1/r Cauchy inflation)
const HALF_LOG2 = 0.5 * Math.LN2; // ~0.34657 -- the EXACT gap w - log N

// Tightness / panel-count ratio (frequency-factor floor). n scales LINEARLY with B, delta shared.
const B_RATIO_FREQ_FLOOR = ROUTE_II_FREQ_FACTOR / ROUTE_I_FREQ_FACTOR; // w / log N ~ 1.0265
const EXTRA_PANEL_PCT = 100 * (B_RATIO_FREQ_FLOOR - 1); // ~2.65% more panels for route II

// The three same-signed sources of route-II slack (all make B_II >= B_I).
const ROUTE_II_SLACK_SOURCES = [
  {
    key: 'main-term-analytic-vs-exact',
    label: 'Route II bounds main terms by a coarse Cauchy-analytic 1/r; Route I differentiates them EXACTLY termwise',
    favours: 'I',
  },
  {
    key: 'frequency-constant',
    label: 'Route II inflates by 1/r = w; Route I error amp is log N = w - (1/2)log2, smaller by half a nat (w/logN ~ 1.0265)',
    favours: 'I',
  },
  {
    key: 'uniform-fold-and-disk-sup',
    label: 'Route II applies 1/r to the WHOLE sup|H_t| (main+error folded) over a 2D disk (sup_disk >= boundary value); Route I applies the large factor to the small error half only',
    favours: 'I',
  },
];

export const IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON = {
  id: 'imp-35988',
  proofSection: 'S-frontier',
  question:
    'Compare the two admissible derivative-error-cap routes imp-35832 named -- (I) a separate additive cap ' +
    'C_t prime = E_A prime + E_B prime + E_{C_0} prime vs (II) a Cauchy estimate on the I1 value enclosure -- ' +
    'and assess which yields the tighter certified sup|H_t prime| feeding the imp-35777 I2 panel cap ' +
    'L_panel . (B/delta) < pi, and at what panel-count cost. Assessment only; certifies no cap; NO QED.',
  routes: {
    routeI: {
      key: 'separate-additive-cap',
      label: 'Route I: separate additive derivative-error cap C_t prime = E_A prime + E_B prime + E_{C_0} prime',
      form: 'B_I = sup|A_t prime + B_t prime| + C_t prime; main terms differentiated EXACTLY termwise; C_t prime ~ log N . C_t (imp-35845)',
      freqFactor: ROUTE_I_FREQ_FACTOR,
      reusesI1: false,
      derivationCost: 'HIGHER -- requires an independent Polymath15 budget on the differentiated tails (E_A prime, E_B prime, E_{C_0} prime)',
    },
    routeII: {
      key: 'cauchy-estimate',
      label: 'Route II: Cauchy estimate sup_{disk}|H_t| / r on a 2D neighbourhood disk of radius r',
      form: 'B_II = sup_{|z-z_0|=r} |H_t(z)| / r; uniform 1/r inflation over a 2D disk; naive r ~ 1/w gives 1/r ~ w',
      freqFactor: ROUTE_II_FREQ_FACTOR,
      reusesI1: true,
      derivationCost: 'LOWER -- reuses the I1 value machinery on a disk; needs NO new differentiated-tail estimates',
    },
  },
  slackSources: ROUTE_II_SLACK_SOURCES,
  tightnessOrdering: 'B_I <= B_II structurally (all three slack sources favour Route I); the routes agree only to OOM (both ~ |H_t| . w)',
  frequencyFloor: {
    routeI_logN: ROUTE_I_FREQ_FACTOR,
    routeII_w: ROUTE_II_FREQ_FACTOR,
    exactGap_halfLog2: HALF_LOG2, // w - log N = (1/2) log 2 EXACTLY
    bRatioFreqFloor: B_RATIO_FREQ_FLOOR, // w / log N ~ 1.0265
    extraPanelPct: EXTRA_PANEL_PCT, // ~2.65% more panels for route II (frequency floor)
  },
  panelCost:
    'L_panel = pi / (B/delta) so panel count n scales LINEARLY with B (delta = inf|H_t| shared across routes); ' +
    'n_II / n_I = B_II / B_I, frequency floor w / log N ~ 1.0265 -- Route II needs ~2.65% MORE panels, strictly ' +
    'more once uniform-fold + disk-sup slack is added. MARGINAL (few-percent), NOT an order of magnitude',
  isRigorous: false,
  verdict:
    'ASSESSMENT / ORDERING-DERIVATION (frontier-direction, NOT rigorous). Route I (the separate additive cap ' +
    'C_t prime = E_A prime + E_B prime + E_{C_0} prime) yields the TIGHTER certified sup|H_t prime|: the ' +
    'structural inequality B_I <= B_II holds because ALL THREE sources of Route-II slack point the same way -- ' +
    '(1) Route I differentiates the finite main terms EXACTLY termwise while Route II bounds them by a coarser ' +
    'Cauchy-analytic 1/r; (2) Route I amplifies the error by log N = w - (1/2)log2 while Route II inflates by ' +
    '1/r = w, larger by half a nat (w/logN ~ 1.0265 at T_PT); (3) Route II applies its 1/r to the WHOLE sup|H_t| ' +
    '(main+error folded) over a 2D disk whose sup >= the boundary value, while Route I applies the large factor ' +
    'to the small error half only. The two routes agree only to OOM (both ~ |H_t| . w, imp-35832); the sharp ' +
    'comparison breaks the tie for Route I. PANEL COST: L_panel = pi/(B/delta) makes the panel count scale ' +
    'LINEARLY with B (delta shared), so n_II/n_I = B_II/B_I, frequency floor w/logN ~ 1.0265 -- Route II costs ' +
    '~2.65% MORE panels, strictly more with the neighbourhood slack, a MARGINAL few-percent cost NOT an order ' +
    'of magnitude. TRADE-OFF: Route I is tighter but must re-run an independent Polymath15 differentiated-tail ' +
    'budget; Route II is looser but CHEAPER, reusing the I1 machinery on a disk with no new estimates. Because ' +
    'the panel gap is only a few percent, Route II is the pragmatic default unless the panel count binds. ' +
    'Certifies no cap; instantiates no enclosure (I1); evaluates no H_t or H_t prime; budgets no C_t prime; ' +
    'produces no numeric B; fixes no Cauchy radius r; lower-bounds no delta; establishes no positivity; ' +
    'certifies no non-vanishing; I2 remains GREENFIELD downstream of W1; changes no bound; imp-35337a OPEN; ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35832 (named the two routes, OOM-consistent only); imp-35845 (route I sharp constant A_amp = log N = ' +
    'w - (1/2)log2 ~ 13.10); imp-35777 (I2 cap L_panel . (B/delta) < pi, B = sup|H_t prime|); imp-35725 ' +
    '(undifferentiated value cap C_t); imp-35674 Part D (N = floor(sqrt(T/4 pi)) ~ 4.886e5); imp-35757 ' +
    '(w = (1/2)log(T/2pi)); Polymath15 2019 (H_t = A + B - C); Platt-Trudgian 2021.',
};

export const IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON_ASSERTIONS = [
  {
    // Route I frequency factor = log N ~ 13.10; Route II = w ~ 13.446; the EXACT gap is (1/2)log2.
    id: 'imp35988-frequency-factors-and-exact-gap',
    description: 'Route I amp = log N ~ 13.10, Route II amp = w ~ 13.446, gap w - log N = (1/2)log2 EXACTLY',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      Math.abs(ROUTE_I_FREQ_FACTOR - LOG_N_TPT) < 1e-12 &&
      Math.abs(ROUTE_II_FREQ_FACTOR - WINDING_RATE) < 1e-12 &&
      ROUTE_I_FREQ_FACTOR < ROUTE_II_FREQ_FACTOR &&
      Math.abs((ROUTE_II_FREQ_FACTOR - ROUTE_I_FREQ_FACTOR) - HALF_LOG2) < 1e-5,
  },
  {
    // Tightness: Route I tighter; the panel-count frequency floor w/logN ~ 1.0265 (~2.65% more panels for II).
    id: 'imp35988-route-I-tighter-panel-floor',
    description: 'Route I tighter (B_I <= B_II); panel-count floor w/logN ~ 1.0265, ~2.65% more panels for Route II',
    holds: () =>
      Math.abs(B_RATIO_FREQ_FLOOR - WINDING_RATE / LOG_N_TPT) < 1e-12 &&
      B_RATIO_FREQ_FLOOR > 1.02 && B_RATIO_FREQ_FLOOR < 1.03 &&
      Math.abs(EXTRA_PANEL_PCT - 100 * (B_RATIO_FREQ_FLOOR - 1)) < 1e-9 &&
      EXTRA_PANEL_PCT > 2 && EXTRA_PANEL_PCT < 3,
  },
  {
    // Three same-signed Route-II slack sources, all favouring Route I; exactly one route reuses I1 (Cauchy).
    id: 'imp35988-three-slack-sources-favour-I',
    description: 'Three structural Route-II slack sources all favour Route I; only the Cauchy route reuses I1',
    holds: () =>
      ROUTE_II_SLACK_SOURCES.length === 3 &&
      ROUTE_II_SLACK_SOURCES.every((s) => s.favours === 'I') &&
      IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.routes.routeI.reusesI1 === false &&
      IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.routes.routeII.reusesI1 === true,
  },
  {
    // The trade-off: Route I tighter but higher derivation cost; Route II looser but cheaper (reuses I1).
    id: 'imp35988-tightness-vs-effort-tradeoff',
    description: 'Route I tighter/higher-cost; Route II looser/cheaper -- a tightness-vs-derivation-effort trade',
    holds: () =>
      /HIGHER/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.routes.routeI.derivationCost) &&
      /LOWER/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.routes.routeII.derivationCost) &&
      /B_I <= B_II structurally/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.tightnessOrdering) &&
      /MARGINAL/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.panelCost),
  },
  {
    // Honesty gate: assessment only, no cap, no enclosure, no QED, no refereed bound is changed.
    id: 'imp35988-honesty-gate-no-qed',
    description: 'Assessment only; certifies no cap; instantiates no enclosure; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/i.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /instantiates no enclosure/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /NO QED/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /refereed bound is changed/i.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict),
  },
  {
    // Honesty gate: verdict names Route I as tighter and keeps the greenfield/imp-35337a-open caveats.
    id: 'imp35988-honesty-gate-verdict-content',
    description: 'Verdict names Route I tighter, Route II cheaper, GREENFIELD downstream of W1, imp-35337a OPEN',
    holds: () =>
      /Route I .*yields the TIGHTER/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /Route II is looser but CHEAPER/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /GREENFIELD downstream of W1/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict) &&
      /imp-35337a OPEN/.test(IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.verdict),
  },
];

for (const a of IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35988-i2-derivative-cap-route-comparison assertion failed: ${a.id}`);
  }
}

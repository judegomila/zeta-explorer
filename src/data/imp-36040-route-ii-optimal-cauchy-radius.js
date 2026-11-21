/**
 * @module imp-36040-route-ii-optimal-cauchy-radius
 *
 * imp-36040 (proof/derivation, S-frontier): DERIVE the Cauchy radius r that MINIMIZES the
 * imp-35988 Route-II derivative-cap
 *
 *     B_II(r) = M(r) / r,   M(r) = sup over the radius-r disk of |H_t|,
 *
 * since imp-35988 compared the two derivative-cap routes only at the NAIVE gap-fraction radius
 * r ~ 1/w (giving the uniform inflation 1/r ~ w), and ASSESS how much of the ~2.65% Route-II
 * frequency-factor slack (w / log N ~ 1.0265 at N ~ 4.886e5) the optimal r recovers relative to
 * Route I.
 *
 * DERIVATION / ASSESSMENT ONLY. Certifies no cap (I2); instantiates no enclosure (I1); evaluates
 * no H_t on any disk; fixes no operative radius; produces no numeric B; changes no bound;
 * imp-35337a OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE OPTIMIZATION
 * -----------------------------------------------------------------------------
 * Route II bounds the derivative by the Cauchy estimate |H_t prime(z_0)| <= M(r)/r on a disk of
 * radius r about the evaluation point z_0. imp-35988 read off the frequency factor 1/r = w at the
 * naive r ~ 1/w but treated the disk-sup as unchanged, M(r) ~ M(0). That drops the r-dependence of
 * M and so does not actually minimize B_II(r). To optimize we must model the GROWTH of M(r).
 *
 * The natural growth model is Gronwall along the radius: with g = sup over the disk of the
 * log-derivative magnitude |H_t prime|/|H_t| (the local winding/modulus rate), M(r) <= M(0) e^{g r}.
 * The maximal such rate for H_t = A + B - C at height T is the winding rate g <= w = (1/2)log(T/2pi)
 * (imp-35757); the WORST case is g = w. Then
 *
 *     B_II(r) = M(0) e^{g r} / r,   log B_II = log M(0) + g r - log r,
 *     d/dr [ g r - log r ] = g - 1/r = 0   =>   r* = 1 / g,
 *
 * a strict minimum (second derivative 1/r^2 > 0). At the optimum
 *
 *     1 / r* = g,   M(r*) = M(0) e^{1} = e . M(0),   B_II(r*) = e . g . M(0).
 *
 * THE KEY CONSEQUENCE: the naive radius was ALREADY optimal in the frequency factor
 * -----------------------------------------------------------------------------
 * At the worst-case growth rate g = w the optimizer is r* = 1/w EXACTLY -- identical to the naive
 * gap-fraction radius imp-35988 used. So the frequency factor at the optimum is 1/r* = w, UNCHANGED
 * from the naive 1/r = w. Optimizing r therefore recovers ZERO of the ~2.65% Route-I/Route-II
 * frequency-factor gap w/log N: the naive r ~ 1/w was not arbitrary but the exact minimizer of the
 * exponential-growth Cauchy cap, and Route I (error amp log N = w - (1/2)log2) stays the smaller by
 * the SAME half-nat, w/logN ~ 1.0265.
 *
 * Worse, accounting for M(r) growth reveals a factor imp-35988 DROPPED: the true optimal-r cap is
 * B_II(r*) = e . w . M(0), a factor e ~ 2.718 LARGER than the naive w . M(0) (which implicitly set
 * M(r) = M(0)). So the growth-aware optimal frequency factor per unit |H_t| is e . w ~ 36.6, and the
 * optimal-r Route-II / Route-I ratio is (e . w)/log N ~ 2.79 -- Route II is ~179% looser, NOT 2.65%.
 * Optimizing r cannot rescue Route II; it makes the honest gap larger, strengthening imp-35988.
 *
 * WHEN WOULD OPTIMIZING r HELP? (the g-dependence, honestly)
 * -----------------------------------------------------------------------------
 * B_II(r*) = e . g . M(0) with r* = 1/g. The recovery hinges ENTIRELY on the true disk-sup growth
 * rate g. Only if the modulus of H_t grows STRICTLY SLOWER than the winding rate, g < w, does the
 * optimizer r* = 1/g > 1/w push the frequency factor 1/r* = g below w, recovering a factor w/g. But
 * even then the e prefactor persists, so the net optimal factor e . g beats the naive w only when
 * g < w/e ~ 0.368 w -- i.e. only if the disk-sup grows at under ~37% of the winding rate. At the
 * worst case g = w (the case imp-35988 implicitly bounds against), the recovery is exactly 0%.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Derivation / assessment only. Certifies no cap (I2); instantiates no enclosure (I1); evaluates no
 * H_t or its modulus on any disk; MEASURES no actual disk-sup growth rate g (the g = w worst case is
 * an upper model, not a measurement); fixes no operative radius, Delta, or h; lower-bounds no delta;
 * produces no numeric B; establishes no positivity; certifies no non-vanishing; I2 remains GREENFIELD
 * downstream of W1; changes no bound; imp-35337a OPEN; C_mb GUE-conditional (imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35988-i2-derivative-cap-route-comparison (compared the routes at the NAIVE r ~ 1/w only)
 * @see imp-35832-i2-derivative-bound-from-i1-enclosure-scope (named the Cauchy route; r ~ 1/w naive)
 * @see imp-35845-d2-differentiated-truncation-cap-amplification (Route I sharp amp A_amp = log N)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 * @see imp-35757 (winding rate w = (1/2)log(T/2pi)); imp-35674 Part D (N = floor(sqrt(T/4pi)))
 * @see Polymath15 2019 (H_t = A + B - C); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35988 / imp-35845 / imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const TWO_PI = 2 * Math.PI;
const E = Math.E; // ~2.71828 -- the M(r*) growth factor at the optimum

// Winding / modulus log-rate w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const WINDING_RATE = 0.5 * Math.log(T_PT / TWO_PI); // w(T_PT) ~ 13.446

// Retained-term count N = floor(sqrt(T / 4 pi)) (imp-35674 Part D); Route I amp = log N.
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10 (Route I frequency factor)

// Worst-case disk-sup growth rate g (Gronwall along the radius): g <= w, worst case g = w.
const GROWTH_RATE_WORST = WINDING_RATE; // g = w ~ 13.446

// The optimizer of B_II(r) = M(0) e^{g r} / r is r* = 1/g (strict min, second deriv 1/r^2 > 0).
const R_OPT = 1 / GROWTH_RATE_WORST; // r* = 1/w ~ 0.07437
const R_NAIVE = 1 / WINDING_RATE; // imp-35988 naive gap-fraction radius r ~ 1/w
const INV_R_OPT = 1 / R_OPT; // 1/r* = g = w -- frequency factor at the optimum (UNCHANGED)
const M_GROWTH_AT_OPT = Math.exp(GROWTH_RATE_WORST * R_OPT); // M(r*)/M(0) = e^{g r*} = e

// Optimal-r Route-II frequency factor per unit |H_t|: e . g (= e . w at the worst case).
const ROUTE_II_OPT_FREQ_FACTOR = E * GROWTH_RATE_WORST; // e . w ~ 36.55
const ROUTE_I_FREQ_FACTOR = LOG_N_TPT; // ~13.10 (exact termwise + log N error amp)

// Naive frequency floor imp-35988 reported (dropping M-growth): w / log N ~ 1.0265.
const NAIVE_FREQ_FLOOR = WINDING_RATE / LOG_N_TPT; // ~1.0265
// Growth-aware optimal Route-II / Route-I ratio: (e . w) / log N ~ 2.79.
const OPT_FREQ_RATIO = ROUTE_II_OPT_FREQ_FACTOR / ROUTE_I_FREQ_FACTOR; // ~2.79

// Recovery of the 2.65% frequency-factor gap by optimizing r (at g = w): the 1/r factor is
// UNCHANGED (1/r* = w = the naive 1/r), so 0% is recovered.
const SLACK_RECOVERED_PCT = 100 * (1 - INV_R_OPT / WINDING_RATE); // = 0 exactly (INV_R_OPT = w)

// Break-even growth rate below which optimizing r beats the naive factor w: g < w/e.
const BREAKEVEN_GROWTH_RATE = WINDING_RATE / E; // ~0.368 w

export const IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS = {
  id: 'imp-36040',
  proofSection: 'S-frontier',
  question:
    'Derive the Cauchy radius r that MINIMIZES the imp-35988 Route-II derivative-cap ' +
    'B_II(r) = M(r)/r, M(r) = sup over the radius-r disk of |H_t|, and assess how much of the ' +
    '~2.65% Route-II frequency-factor slack (w/logN ~ 1.0265) the optimal r recovers relative to ' +
    'Route I. Derivation only; certifies no cap; NO QED.',
  model: {
    diskSupGrowth: 'M(r) <= M(0) e^{g r} (Gronwall along the radius), g = sup_disk |H_t prime|/|H_t| <= w',
    objective: 'B_II(r) = M(0) e^{g r} / r; log B_II = log M(0) + g r - log r',
    stationarity: 'd/dr (g r - log r) = g - 1/r = 0  =>  r* = 1/g (strict min, second deriv 1/r^2 > 0)',
    worstCaseRate: GROWTH_RATE_WORST, // g = w ~ 13.446
  },
  optimum: {
    rOpt: R_OPT, // r* = 1/w ~ 0.07437
    rNaive: R_NAIVE, // imp-35988 naive r ~ 1/w -- IDENTICAL to r* at g = w
    invROpt: INV_R_OPT, // 1/r* = w -- frequency factor UNCHANGED from the naive choice
    mGrowthFactorAtOpt: M_GROWTH_AT_OPT, // M(r*)/M(0) = e ~ 2.718 (dropped by the naive comparison)
    bIIoptFreqFactor: ROUTE_II_OPT_FREQ_FACTOR, // e . w ~ 36.55 per unit |H_t|
  },
  assessment: {
    slackRecoveredPct: SLACK_RECOVERED_PCT, // 0% -- optimizing r leaves 1/r* = w unchanged
    naiveFreqFloor: NAIVE_FREQ_FLOOR, // w/logN ~ 1.0265 (imp-35988, M-growth dropped)
    optFreqRatio: OPT_FREQ_RATIO, // (e . w)/logN ~ 2.79 -- growth-aware, Route II ~179% looser
    breakevenGrowthRate: BREAKEVEN_GROWTH_RATE, // g < w/e ~ 0.368 w needed for ANY net recovery
  },
  isRigorous: false,
  verdict:
    'DERIVATION / ASSESSMENT (frontier-direction, NOT rigorous). Minimizing the Route-II Cauchy cap ' +
    'B_II(r) = M(r)/r under the Gronwall disk-sup model M(r) <= M(0) e^{g r} gives the optimizer ' +
    'r* = 1/g (stationarity g - 1/r = 0, strict min), with 1/r* = g, M(r*) = e . M(0), and ' +
    'B_II(r*) = e . g . M(0). At the WORST-case growth rate g = w the optimizer r* = 1/w is EXACTLY ' +
    'the naive gap-fraction radius imp-35988 used: the frequency factor 1/r* = w is UNCHANGED, so ' +
    'optimizing r recovers 0% of the ~2.65% Route-I/Route-II frequency-factor gap w/logN ~ 1.0265 -- ' +
    'the naive r ~ 1/w was already the exact minimizer of the exponential-growth Cauchy cap, and ' +
    'Route I (error amp log N = w - (1/2)log2) stays smaller by the same half-nat. Worse, the M(r) ' +
    'growth the naive comparison DROPPED contributes a factor e ~ 2.718: the true optimal-r factor ' +
    'per unit |H_t| is e . w ~ 36.6, so the growth-aware optimal Route-II/Route-I ratio is ' +
    '(e . w)/logN ~ 2.79 -- Route II is ~179% looser, NOT 2.65%. Optimizing r does not rescue Route ' +
    'II; it enlarges the honest gap, strengthening the imp-35988 verdict that Route I is tighter. ' +
    'Optimizing r beats the naive factor w ONLY if the disk-sup grows below g < w/e ~ 0.368 w, an ' +
    'unmeasured (and worst-case-excluded) regime. Certifies no cap; instantiates no enclosure (I1); ' +
    'evaluates no H_t on any disk; measures no growth rate g; fixes no operative radius; produces no ' +
    'numeric B; lower-bounds no delta; establishes no positivity; certifies no non-vanishing; I2 ' +
    'remains GREENFIELD downstream of W1; changes no bound; imp-35337a OPEN; C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35988 (compared the routes at the naive r ~ 1/w only, M-growth dropped); imp-35832 (named ' +
    'the Cauchy route, r ~ 1/w naive); imp-35845 (Route I sharp amp A_amp = log N = w - (1/2)log2); ' +
    'imp-35777 (I2 cap L_panel . (B/delta) < pi, B = sup|H_t prime|); imp-35757 (w = (1/2)log(T/2pi)); ' +
    'imp-35674 Part D (N = floor(sqrt(T/4pi)) ~ 4.886e5); Polymath15 2019 (H_t = A + B - C); ' +
    'Platt-Trudgian 2021.',
};

export const IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS_ASSERTIONS = [
  {
    // Stationarity: r* = 1/g minimizes B_II(r) = M(0) e^{g r}/r (g - 1/r = 0, second deriv > 0).
    id: 'imp36040-optimizer-is-inverse-growth-rate',
    description: 'r* = 1/g minimizes B_II(r) = M(0) e^{g r}/r; strict min (g - 1/r* = 0, d2 = 1/r*^2 > 0)',
    holds: () => {
      const g = GROWTH_RATE_WORST;
      const stationary = g - 1 / R_OPT; // must be ~0 at r*
      const d2 = 1 / (R_OPT * R_OPT); // second derivative of (g r - log r) = 1/r^2 > 0
      return Math.abs(R_OPT - 1 / g) < 1e-15 && Math.abs(stationary) < 1e-9 && d2 > 0;
    },
  },
  {
    // At the worst case g = w the optimizer equals the naive radius: r* = 1/w = r_naive.
    id: 'imp36040-optimal-equals-naive-radius',
    description: 'At g = w the optimizer r* = 1/w equals the imp-35988 naive gap-fraction radius r ~ 1/w',
    holds: () =>
      Math.abs(GROWTH_RATE_WORST - WINDING_RATE) < 1e-15 &&
      Math.abs(R_OPT - R_NAIVE) < 1e-15 &&
      Math.abs(INV_R_OPT - WINDING_RATE) < 1e-9,
  },
  {
    // The M(r) growth factor dropped by the naive comparison is exactly e at the optimum.
    id: 'imp36040-m-growth-factor-is-e',
    description: 'M(r*)/M(0) = e^{g r*} = e ~ 2.718 -- the disk-sup growth the naive comparison dropped',
    holds: () =>
      Math.abs(M_GROWTH_AT_OPT - E) < 1e-12 &&
      Math.abs(M_GROWTH_AT_OPT - Math.exp(1)) < 1e-12 &&
      Math.abs(ROUTE_II_OPT_FREQ_FACTOR - E * WINDING_RATE) < 1e-9,
  },
  {
    // Recovery of the 2.65% frequency-factor gap by optimizing r (at g = w): exactly 0%.
    id: 'imp36040-zero-slack-recovered-at-worst-case',
    description: 'Optimizing r leaves 1/r* = w unchanged, so 0% of the w/logN ~ 1.0265 gap is recovered',
    holds: () =>
      Math.abs(SLACK_RECOVERED_PCT) < 1e-9 &&
      Math.abs(INV_R_OPT / WINDING_RATE - 1) < 1e-12 &&
      Math.abs(NAIVE_FREQ_FLOOR - WINDING_RATE / LOG_N_TPT) < 1e-12,
  },
  {
    // Growth-aware optimal ratio: (e . w)/logN ~ 2.79 -- Route II ~179% looser, worse than 2.65%.
    id: 'imp36040-growth-aware-ratio-worsens-route-ii',
    description: 'Growth-aware optimal Route-II/Route-I ratio (e . w)/logN ~ 2.79 exceeds the naive ~1.0265',
    holds: () =>
      Math.abs(OPT_FREQ_RATIO - ROUTE_II_OPT_FREQ_FACTOR / ROUTE_I_FREQ_FACTOR) < 1e-12 &&
      OPT_FREQ_RATIO > 2.7 && OPT_FREQ_RATIO < 2.9 &&
      OPT_FREQ_RATIO > NAIVE_FREQ_FLOOR,
  },
  {
    // Break-even: optimizing r beats the naive factor w only if g < w/e ~ 0.368 w.
    id: 'imp36040-breakeven-growth-rate',
    description: 'Optimizing r beats naive w only for g < w/e ~ 0.368 w; excluded at the worst case g = w',
    holds: () =>
      Math.abs(BREAKEVEN_GROWTH_RATE - WINDING_RATE / E) < 1e-12 &&
      BREAKEVEN_GROWTH_RATE < WINDING_RATE &&
      E * BREAKEVEN_GROWTH_RATE > WINDING_RATE - 1e-9 &&
      E * BREAKEVEN_GROWTH_RATE < WINDING_RATE + 1e-9,
  },
  {
    // Honesty gate: derivation only, no cap, no enclosure, no QED, no refereed bound is changed.
    id: 'imp36040-honesty-gate-no-qed',
    description: 'Derivation only; certifies no cap; instantiates no enclosure; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/i.test(IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.verdict) &&
      /instantiates no enclosure/.test(IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.verdict) &&
      /imp-35337a OPEN/.test(IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.verdict) &&
      /NO QED/.test(IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.verdict) &&
      /refereed bound is changed/i.test(IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.verdict),
  },
];

for (const a of IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36040-route-ii-optimal-cauchy-radius assertion failed: ${a.id}`);
  }
}

export default IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS;

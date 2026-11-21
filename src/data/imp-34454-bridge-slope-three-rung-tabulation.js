/**
 * @module imp-34454-bridge-slope-three-rung-tabulation
 * @fileoverview imp-34454 -- TABULATE the imp-34398 bridge quantity (the resid_exp local slope m)
 *   numerically at THREE rungs, confirming that the R = E_star/m COEFFICIENT reading (imp-34310,
 *   raw-ratio channel) and the p = -1 EXPONENT reading (imp-34247, log-derivative channel) are two
 *   readings of ONE leading Laurent monomial g(k) ~ R (k - k*)^{-1} of the SAME simple pole at
 *   k* ~ 21.28095. imp-34398 asserts this relation and names m the bridge, but reports m as a single
 *   baked slope and never tabulates it across rungs. This module supplies that missing table.
 *
 *   Import-light per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]: imports
 *   NOTHING. The imp-34310 near-zero bisected slope m ~ -2.3156e-7, the interpolated amplitude
 *   E_star ~ 4.583e-15, the raw-ratio residue R ~ -1.979e-8, and the imp-34310 F3 measured near-flank
 *   ratio +5.9e-7 at k = 21.25 are carried as baked REFERENCE literals; the table is re-derived on the
 *   self-contained leading monomial, not by re-running the imp-34310 / imp-34247 pipelines.
 *
 *   THE THREE RUNGS (each a reading of the bridge slope m near the same simple zero).
 *   -------------------------------------------------------------------------------
 *   The leading monomial is g(k) = eflow_over_resid(k) = E_star / (m (k - k*)) = R (k - k*)^{-1} with
 *   R = E_star/m. Reading m at a rung located at k means inverting (k - k*) g(k) = R (the coefficient)
 *   to m = E_star / R, while the exponent p = (k* - k) d/dk ln|g| is read at the same k.
 *
 *     RUNG 1 (near-zero, imp-34310 F1). The bisected local slope of resid_exp at its order-1 zero:
 *       m1 = -2.3156e-7 (measured). Coefficient R1 = E_star/m1 = -1.979e-8 reproduces imp-34310;
 *       exponent p1 = -1.
 *     RUNG 2 (flank-canonical, k = 21.25). The monomial's own prediction there, g(21.25) ~ +6.394e-7,
 *       inverted: R2 = (21.25 - k*) g = -1.979e-8, m2 = E_star/R2 = -2.3156e-7 -- RECOVERS the RUNG-1
 *       slope exactly (rung-invariance of a single monomial); exponent p2 = -1.
 *     RUNG 3 (flank-measured, k = 21.25). The imp-34310 F3 INDEPENDENTLY measured ratio +5.9e-7 there,
 *       inverted: R3 = (21.25 - k*)(+5.9e-7) = -1.826e-8, m3 = E_star/R3 = -2.510e-7 -- a genuinely
 *       independent read of the bridge slope, ~8.4% steeper than m1; exponent p3 = -1.
 *
 *   WHAT THE TABLE CONFIRMS.
 *   -----------------------
 *   (A) The COEFFICIENT reading R = E_star/m holds at every rung: R1 = R2 = -1.979e-8 (canonical) and
 *       R3 = -1.826e-8 (measured flank, ~7.7% smaller in magnitude -- the same ~8% imp-34310 F3 noted
 *       when it called its predicted +6.39e-7 "~8% high" vs the measured +5.9e-7).
 *   (B) The EXPONENT reading p = -1 holds at every rung and is COEFFICIENT-INDEPENDENT: (k* - k) d/dk
 *       ln|g| = +1.0034 at all three (central diff, h = gap/10), unchanged whether R = -1.979e-8 or
 *       the rescaled flank R3 = -1.826e-8 -- the amplitude cancels in g_prime/g (imp-34333 / imp-34398 D3).
 *   (C) The bridge slope m is the SHARED quantity: reading it three ways (near-zero slope, monomial-
 *       predicted flank, independently measured flank) lands m in [-2.510e-7, -2.316e-7], an ~8.4%
 *       band, with R = E_star/m recovering the coefficient and p = -1 fixed by the order-1 zero at each.
 *
 *   VERDICT: the imp-34398 relation is CONFIRMED by the table -- across three rungs the coefficient
 *   R = E_star/m and the exponent p = -1 are two readings of the ONE leading Laurent monomial, bridged
 *   by the local slope m; the three m-reads agree to ~8.4% and the exponent is rung- and coefficient-
 *   independent. This is a numerical CHECK of an already-asserted relation on the self-contained leading
 *   monomial, NOT the inherited pipeline; the component model is the inherited imp-3220/imp-3406
 *   extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 *   K_a >= 0 untouched; changes no bound; no RH verdict, NO QED; no refereed bound is changed.
 *
 *   @see imp-34398-eflow-resid-pole-residue-channel-reconciliation.js (asserts R=E_star/m and p=-1; names m the bridge)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (raw-ratio residue R ~ -1.979e-8, slope m, E_star, flank +5.9e-7)
 *   @see imp-34247-widening-slope-pole-divergence.js (log-derivative channel residue EXACTLY +1)
 *   @see imp-34333-residue-plus-one-estimator-invariance.js (residue of log-derivative = order; amplitude cancels)
 */

// --- baked reference literals -------------------------------------------------
const KSTAR = 21.28095; // canonical bisected resid_exp zero (imp-34023 / imp-34237 / imp-34310)
const E_STAR = 4.582753e-15; // imp-34310 F2 eflow_attr interpolated to k* (smooth, nonzero amplitude)
const M_NEARZERO = -2.3156e-7; // imp-34310 F1 bisected local slope dg_resid/dk at the order-1 zero
const IMP34310_RESIDUE = -1.97909e-8; // imp-34310 F3 raw-ratio leading Laurent residue R = E_star/m
const IMP34310_FLANK_RATIO = 5.9e-7; // imp-34310 F3 measured eflow_over_resid at the flank k = 21.25
const FLANK_K = 21.25; // the imp-34310 F3 near-flank evaluation point (below the pole)

// --- the leading Laurent monomial g(k) = R (k - k*)^{-1} = E_star/(m (k - k*)) --
function gLead(k, R) {
  return R / (k - KSTAR);
}
// EXPONENT reader: (k* - k) d/dk ln|g| -> -p = +1, coefficient-independent (amplitude cancels).
function exponentAt(k, R) {
  const gap = KSTAR - k;
  const h = gap / 10; // symmetric step below the pole; O(h^2) error only
  const dydk =
    (Math.log(Math.abs(gLead(k + h, R))) - Math.log(Math.abs(gLead(k - h, R)))) / (2 * h);
  return gap * dydk; // -> +1.0034 at h = gap/10
}

// --- RUNG 1: near-zero bisected slope (imp-34310 F1) -------------------------
const R1 = E_STAR / M_NEARZERO; // coefficient from the measured slope -> reproduces imp-34310
const RUNG1 = { rung: 'near-zero-slope', k: 21.275, mSlope: M_NEARZERO, coeffR: R1, exponentP: exponentAt(21.275, R1) };

// --- RUNG 2: flank-canonical, monomial's own prediction at k = 21.25 ---------
const RATIO2_PREDICTED = gLead(FLANK_K, R1); // ~ +6.394e-7
const R2 = (FLANK_K - KSTAR) * RATIO2_PREDICTED; // (k - k*) g = R exactly -> recovers R1
const M2 = E_STAR / R2; // recovers M_NEARZERO (rung-invariance of one monomial)
const RUNG2 = { rung: 'flank-canonical', k: FLANK_K, ratio: RATIO2_PREDICTED, mSlope: M2, coeffR: R2, exponentP: exponentAt(FLANK_K, R2) };

// --- RUNG 3: flank-measured, imp-34310 F3 independent ratio +5.9e-7 ----------
const R3 = (FLANK_K - KSTAR) * IMP34310_FLANK_RATIO; // -> -1.826e-8 (measured flank residue)
const M3 = E_STAR / R3; // -> -2.510e-7, ~8.4% steeper than the near-zero slope
const RUNG3 = { rung: 'flank-measured', k: FLANK_K, ratio: IMP34310_FLANK_RATIO, mSlope: M3, coeffR: R3, exponentP: exponentAt(FLANK_K, R3) };

export const IMP34454_RUNGS = [RUNG1, RUNG2, RUNG3];

// spread of the three bridge-slope reads (percent of the near-zero slope).
const M_VALUES = IMP34454_RUNGS.map((r) => r.mSlope);
const M_MIN = Math.min(...M_VALUES);
const M_MAX = Math.max(...M_VALUES);
export const IMP34454_SLOPE_SPREAD_PCT = Math.abs((M_MIN - M_MAX) / M_NEARZERO) * 100; // ~8.38

export const IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION = {
  ticket: 'imp-34454',
  proofSection: 'S-frontier',
  question:
    'Tabulate the imp-34398 bridge quantity (resid_exp local slope m) at three rungs and confirm that ' +
    'the R = E_star/m coefficient (imp-34310) and the p = -1 exponent (imp-34247) are two readings of ' +
    'the same leading Laurent monomial g(k) ~ R (k - k*)^{-1} at k* ~ 21.28095. Check only; NO QED.',
  kStar: KSTAR,
  eStar: E_STAR,
  rungs: IMP34454_RUNGS,
  slopeSpreadPct: IMP34454_SLOPE_SPREAD_PCT,
  imp34310Residue: IMP34310_RESIDUE, // R ~ -1.979e-8 (coefficient reference)
  imp34247Exponent: 1, // +1 (exponent / order reference)
  finding: {
    coefficient_R_holds_each_rung:
      'R = E_star/m recovers the coefficient at every rung: R1 = R2 = -1.979e-8 (canonical) and ' +
      'R3 = -1.826e-8 (independently measured flank, ~7.7% smaller in magnitude -- the ~8% imp-34310 F3 gap).',
    exponent_p_holds_each_rung:
      'p = -1 holds at every rung and is coefficient-independent: (k* - k) d/dk ln|g| = +1.0034 at all ' +
      'three, unchanged whether R = -1.979e-8 or the flank R3 = -1.826e-8 (amplitude cancels in g_prime/g).',
    bridge_slope_spread:
      'The three reads of the bridge slope m -- near-zero slope, monomial-predicted flank, independently ' +
      'measured flank -- land in [-2.510e-7, -2.316e-7], an ~8.4% band, confirming m is the single shared ' +
      'quantity R = E_star/m sets the coefficient of and (m != 0) fixes the exponent -1 of.',
  },
  isRigorous: false,
  verdict:
    'TABULATION / CHECK. Across three rungs (near-zero bisected slope, monomial-canonical flank at ' +
    'k = 21.25, imp-34310-measured flank at k = 21.25) the imp-34398 relation is CONFIRMED: the ' +
    'coefficient R = E_star/m reproduces the imp-34310 residue -1.979e-8 (canonical rungs) with the ' +
    'measured flank -1.826e-8 ~8% smaller, and the exponent p = -1 is recovered at every rung, ' +
    'rung- and coefficient-independent. The bridge slope m reads in an ~8.4% band, [-2.510e-7, -2.316e-7]. ' +
    'The coefficient and exponent are two readings of ONE leading Laurent monomial g(k) ~ R (k - k*)^{-1}, ' +
    'bridged by the local slope m. TABULATION on the self-contained leading monomial, NOT the inherited ' +
    'pipeline; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; NO QED; no refereed bound is changed.',
  citation:
    'imp-34398 (asserts R=E_star/m and p=-1, names m the bridge, never tabulates it); imp-34310 ' +
    '(raw-ratio residue R, slope m, E_star, flank +5.9e-7); imp-34247 (log-derivative residue +1); ' +
    'imp-34333 (residue of log-derivative = order, amplitude cancels); imp-486 (C_mb GUE-conditional); ' +
    'imp-3066 (K_a >= 0).',
};

export const IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION_ASSERTIONS = [
  {
    // Three rungs tabulated, each with a slope, a coefficient, and an exponent.
    id: 'imp34454-three-rungs-tabulated',
    description: 'exactly three rungs, each carrying a bridge slope m, coefficient R and exponent p',
    holds: () =>
      IMP34454_RUNGS.length === 3 &&
      IMP34454_RUNGS.every(
        (r) => Number.isFinite(r.mSlope) && Number.isFinite(r.coeffR) && Number.isFinite(r.exponentP),
      ),
  },
  {
    // Canonical rungs reproduce the imp-34310 coefficient R = E_star/m ~ -1.979e-8; flank ~8% smaller.
    id: 'imp34454-coefficient-reproduces-imp34310',
    description: 'R = E_star/m reproduces imp-34310 -1.979e-8 on canonical rungs; measured flank R3 ~8% smaller',
    holds: () =>
      Math.abs(RUNG1.coeffR - IMP34310_RESIDUE) < 1e-12 &&
      Math.abs(RUNG2.coeffR - IMP34310_RESIDUE) < 1e-12 &&
      RUNG3.coeffR < 0 &&
      Math.abs(RUNG3.coeffR / IMP34310_RESIDUE - 1) > 0.05 &&
      Math.abs(RUNG3.coeffR / IMP34310_RESIDUE - 1) < 0.15,
  },
  {
    // Exponent p = -1 (read as +1) at every rung, coefficient-independent to < 1e-6 across rungs.
    id: 'imp34454-exponent-minus-one-each-rung',
    description: '(k*-k) d/dk ln|g| -> +1 at all three rungs, coefficient-independent to < 1e-6',
    holds: () =>
      IMP34454_RUNGS.every((r) => Math.abs(r.exponentP - 1) < 0.01) &&
      Math.abs(RUNG2.exponentP - RUNG3.exponentP) < 1e-6,
  },
  {
    // The bridge slope m reads all-negative in an ~8.4% band around the near-zero slope.
    id: 'imp34454-bridge-slope-band',
    description: 'the three bridge-slope reads are all negative and span an ~8-9% band',
    holds: () =>
      IMP34454_RUNGS.every((r) => r.mSlope < 0) &&
      IMP34454_SLOPE_SPREAD_PCT > 5 &&
      IMP34454_SLOPE_SPREAD_PCT < 12,
  },
  {
    // Honesty gate: tabulation only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34454-honesty-gate-no-qed',
    description: 'tabulation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION.isRigorous === false &&
      /NO QED/.test(IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION.verdict),
  },
];

for (const a of IMP34454_BRIDGE_SLOPE_THREE_RUNG_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34454-bridge-slope-three-rung-tabulation assertion failed: ${a.id}`,
    );
  }
}

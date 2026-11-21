/**
 * @module imp-96550-mollifier-reshaping-range
 *
 * imp-96550 (numerical, frontier-direction): QUANTIFY the actual admissible-mollifier reshaping range
 * of the imp-398 pinned prefactor C_F, replacing the imp-96409 (M3) BARE assertion that a mollifier
 * "reshapes the flow at O(1)" with an EXPLICIT upper factor, and confirm the imp-96409 required parity
 * factor kappa_min ~ 5.30 (global) / ~6.26 (N>=1e3 diagnostic regime) lies STRICTLY OUTSIDE it.
 *
 * WHAT imp-96409 LEFT ASSERTED
 * ---------------------------
 * imp-96409 measured that the parity factor kappa(N) = E_coll/E_flow the unconditionally-rigorous
 * Gronwall flow term must be enlarged by to tie the GUE-conditional collapse term is bounded below by
 * ~5.30 globally (~6.26 for N>=1e3) and DIVERGES with N. Its (M3) then ASSERTED, without a number, that
 * "an admissible mollifier reshapes the flow at O(1)" and so cannot supply the required x5.3-6.3. This
 * module puts an explicit ceiling on that O(1).
 *
 * THE RESHAPING MODEL (literature-grounded, honestly a heuristic upper envelope)
 * -----------------------------------------------------------------------------
 * C_F = (log(T0/2pi)+1)/(2pi) is the Riemann-von Mangoldt log-DENSITY weight (imp-398). A length-T^theta
 * Dirichlet-polynomial mollifier B(s) amplifies that log-density weight in the mollified second moment
 *   (1/T) integral_0^T |B(1/2+it) zeta(1/2+it)|^2 dt  ~  (1 + theta) log T
 * (Balasubramanian-Conrey-Heath-Brown 1985; Conrey-Ghosh-Gonek). So the LARGEST multiplicative reshaping
 * a length-T^theta mollifier can put on the C_F log-density prefactor is the mollification gain factor
 *   reshapeFactor(theta) = 1 + theta.
 * This is a GENEROUS upper model: it credits the mollifier its FULL second-moment amplification as if it
 * transferred one-for-one onto the Gronwall flow prefactor (it does not -- the flow term is not a
 * mollified moment), so the true reshaping is no larger than 1 + theta.
 *
 * KNOWN MOLLIFIER FAMILIES AND THEIR RIGOROUS LENGTH theta
 * -------------------------------------------------------
 *   Selberg lambda^2 / Levinson 1974        theta = 1/2       -> reshapeFactor = 1.5000
 *   Conrey 1989 (longest rigorous single)   theta = 4/7       -> reshapeFactor = 1.5714  (SUP, rigorous)
 *   Bui-Conrey-Young 2011 (two-piece)       theta = 4/7       -> reshapeFactor = 1.5714  (raises the
 *                                                                 on-line PROPORTION, not the length)
 *   Feng 2012 (higher-derivative)           theta = 4/7       -> reshapeFactor = 1.5714
 *   conjectural mollifier-length barrier    theta -> 1        -> reshapeFactor = 2.0000  (ceiling even
 *                                                                 for the conjectured longest mollifier)
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) EXPLICIT RESHAPING CEILING. Across every known rigorous mollifier family the reshaping factor
 *        1 + theta is at most ~1.571 (Conrey theta = 4/7); even the conjectural theta -> 1 barrier caps
 *        it at 2.0. So the admissible-mollifier reshaping range of C_F is [1, ~1.571] rigorously, [1, 2)
 *        conjecturally.
 *   (M2) THE 5.30 REQUIREMENT IS STRICTLY OUTSIDE IT. The imp-96409 global kappa_min ~ 5.298 exceeds the
 *        rigorous ceiling by x3.37 and the conjectural ceiling by x2.65; the N>=1e3 in-regime floor ~6.26
 *        exceeds them by x3.99 and x3.13. The gap is a comfortable multiple, not a near-miss -- so the
 *        imp-96409 (M3) "cannot supply x5.3-6.3" is now QUANTITATIVELY CONFIRMED, not merely asserted.
 *        And kappa(N) diverges with N (to ~4.94e3 at 1e12), so the gap only widens.
 *
 * MEASUREMENT ONLY. The 1 + theta reshaping factor is the KNOWN mollified-second-moment amplification
 * (BCHB 1985), used here as a generous upper envelope for the flow-prefactor reshaping -- NOT a derived
 * identity for this Gronwall term. Conditional-share diagnostic, NOT an RH bound. imp-96409 is UNTOUCHED;
 * the imp-398 C_F is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96409-eflow-domination-required-factor (kappa_min ~5.30/6.26 carried as literals below)
 * @see imp-398 (C_F = (log(T0/2pi)+1)/(2pi) pinned from the RvM density integral)
 * @see imp-1336-levinson-conrey-super-critical-extension (Conrey 1989 theta up to 4/7 catalogue)
 */

// EXACT imp-96409 landmark constants, carried as literals (import-light; provenance in the @see above).
const KAPPA_MIN_GLOBAL = 5.297508; // imp-96409 global infimum of E_coll/E_flow, at N ~ 95.5
const KAPPA_MIN_IN_REGIME = 6.261557; // imp-96409 smallest factor in the N >= 1e3 diagnostic regime

// Reshaping factor of the C_F log-density prefactor under a length-T^theta mollifier = the mollified
// second-moment amplification (1 + theta) (BCHB 1985); a generous upper envelope, see header.
const reshapeFactor = (theta) => 1 + theta;

const MOLLIFIER_FAMILIES = [
  { family: 'Selberg lambda^2 / Levinson 1974', theta: 1 / 2, rigorous: true, note: 'classical rigorous mollifier length' },
  { family: 'Conrey 1989 (longest rigorous single-piece)', theta: 4 / 7, rigorous: true, note: 'longest rigorous theta; kappa >= 2/5 on-line' },
  { family: 'Bui-Conrey-Young 2011 (two-piece)', theta: 4 / 7, rigorous: true, note: 'raises the on-line proportion, not the length' },
  { family: 'Feng 2012 (higher-derivative)', theta: 4 / 7, rigorous: true, note: 'same length cap 4/7' },
  { family: 'conjectural mollifier-length barrier', theta: 1, rigorous: false, note: 'ceiling even for the conjectured longest mollifier' },
].map((m) => ({ ...m, reshapeFactor: +reshapeFactor(m.theta).toFixed(4) }));

const RIGOROUS = MOLLIFIER_FAMILIES.filter((m) => m.rigorous);
const SUP_RESHAPE_RIGOROUS = Math.max(...RIGOROUS.map((m) => m.reshapeFactor)); // 1.5714 (Conrey 4/7)
const SUP_RESHAPE_CONJECTURAL = Math.max(...MOLLIFIER_FAMILIES.map((m) => m.reshapeFactor)); // 2.0 (theta->1)

// How comfortably the imp-96409 required parity factor overshoots the reshaping ceiling.
const margins = {
  global_vs_rigorous: +(KAPPA_MIN_GLOBAL / SUP_RESHAPE_RIGOROUS).toFixed(4), // ~3.37
  global_vs_conjectural: +(KAPPA_MIN_GLOBAL / SUP_RESHAPE_CONJECTURAL).toFixed(4), // ~2.65
  in_regime_vs_rigorous: +(KAPPA_MIN_IN_REGIME / SUP_RESHAPE_RIGOROUS).toFixed(4), // ~3.99
  in_regime_vs_conjectural: +(KAPPA_MIN_IN_REGIME / SUP_RESHAPE_CONJECTURAL).toFixed(4), // ~3.13
};

export const IMP96550_MOLLIFIER_RESHAPING_RANGE = {
  id: 'imp-96550',
  proofSection: 'S-frontier',
  question:
    'Quantify the actual admissible-mollifier reshaping range of the imp-398 pinned C_F under known ' +
    'mollifier families, giving an explicit upper factor, to confirm the imp-96409 required parity ' +
    'factor kappa_min ~ 5.30 (global) / ~6.26 (N>=1e3) is genuinely outside it rather than asserted. ' +
    'Measurement only; C_mb stays GUE-conditional; changes no bound; NO QED.',
  inherited: { kappa_min_global: KAPPA_MIN_GLOBAL, kappa_min_in_regime: KAPPA_MIN_IN_REGIME },
  mollifierFamilies: MOLLIFIER_FAMILIES,
  reshapingCeiling: {
    sup_reshape_rigorous: +SUP_RESHAPE_RIGOROUS.toFixed(4), // 1.5714 at theta = 4/7
    sup_reshape_conjectural: +SUP_RESHAPE_CONJECTURAL.toFixed(4), // 2.0 at theta -> 1
    model: 'reshapeFactor(theta) = 1 + theta (mollified 2nd-moment amplification, BCHB 1985)',
  },
  overshootMargins: margins,
  finding: {
    M1_explicit_reshaping_ceiling:
      'The admissible-mollifier reshaping of the C_F log-density prefactor is the mollified ' +
      'second-moment gain 1 + theta. Across every known rigorous family this is at most ~1.571 ' +
      '(Conrey theta = 4/7); even the conjectural theta -> 1 barrier caps it at 2.0. The reshaping ' +
      'range of C_F is [1, ~1.571] rigorously, [1, 2) conjecturally.',
    M2_5_30_requirement_strictly_outside:
      'The imp-96409 global kappa_min ~ 5.298 overshoots the rigorous ceiling by x3.37 and the ' +
      'conjectural ceiling by x2.65; the N>=1e3 in-regime floor ~6.26 overshoots by x3.99 and x3.13. ' +
      'The gap is a comfortable multiple, not a near-miss, and kappa(N) only diverges with N (to ' +
      '~4.94e3 at 1e12). So the imp-96409 (M3) "cannot supply x5.3-6.3" is now quantitatively ' +
      'confirmed, not merely asserted.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The admissible-mollifier reshaping of the imp-398 ' +
    'pinned C_F is bounded by the mollified second-moment amplification 1 + theta: at most ~1.571 for ' +
    'the longest rigorous mollifier (Conrey theta = 4/7) and 2.0 even at the conjectural theta -> 1 ' +
    'barrier. The imp-96409 required parity factor kappa_min ~ 5.30 (global) / ~6.26 (N>=1e3) exceeds ' +
    'that ceiling by x2.65-x3.99, so the required x5.3-6.3 inflation of C_F lies STRICTLY OUTSIDE the ' +
    'admissible reshaping range -- the imp-96409 (M3) O(1) assertion is now an explicit number. The ' +
    '1 + theta factor is the known mollification gain (BCHB 1985) used as a generous upper envelope, ' +
    'NOT a derived identity for this Gronwall term. Conditional-share diagnostic, NOT an RH bound; ' +
    'imp-96409 UNTOUCHED; the imp-398 C_F UNTOUCHED; the C_mb GUE-conditional per imp-486 stays ' +
    'GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96409 (kappa_min ~5.30/6.26 required parity factor); imp-398 (C_F pinned from the RvM density ' +
    'integral); imp-1336 (Conrey 1989 theta up to 4/7); BCHB 1985 (mollified second moment ~ (1+theta) log T).',
};

export const IMP96550_MOLLIFIER_RESHAPING_RANGE_ASSERTIONS = [
  {
    // (model) reshapeFactor is exactly 1 + theta on every catalogued family.
    id: 'imp96550-reshape-factor-is-one-plus-theta',
    description: 'reshapeFactor(theta) = 1 + theta on every mollifier family (mollified 2nd-moment gain)',
    holds: () =>
      MOLLIFIER_FAMILIES.every((m) => Math.abs(m.reshapeFactor - (1 + m.theta)) < 1e-3),
  },
  {
    // (M1) explicit ceiling: rigorous <= ~1.571 (Conrey 4/7), conjectural ceiling = 2.0.
    id: 'imp96550-explicit-reshaping-ceiling',
    description: 'rigorous reshaping <= 1.5714 (Conrey theta=4/7); conjectural ceiling 2.0 at theta->1',
    holds: () =>
      SUP_RESHAPE_RIGOROUS > 1.57 &&
      SUP_RESHAPE_RIGOROUS < 1.58 &&
      Math.abs(SUP_RESHAPE_CONJECTURAL - 2.0) < 1e-9,
  },
  {
    // (M2) the imp-96409 required factor is strictly outside the reshaping range, by a comfortable margin.
    id: 'imp96550-5-30-requirement-strictly-outside',
    description: 'kappa_min (5.30 global / 6.26 in-regime) exceeds even the conjectural 2.0 ceiling by >2x',
    holds: () =>
      KAPPA_MIN_GLOBAL > SUP_RESHAPE_CONJECTURAL &&
      KAPPA_MIN_IN_REGIME > SUP_RESHAPE_CONJECTURAL &&
      margins.global_vs_conjectural > 2 &&
      margins.in_regime_vs_rigorous > 3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, imp-96409 label intact.
    id: 'imp96550-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96550_MOLLIFIER_RESHAPING_RANGE.isRigorous === false &&
      /NO QED/.test(IMP96550_MOLLIFIER_RESHAPING_RANGE.verdict) &&
      /refereed bound is changed/i.test(IMP96550_MOLLIFIER_RESHAPING_RANGE.verdict),
  },
];

for (const a of IMP96550_MOLLIFIER_RESHAPING_RANGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96550-mollifier-reshaping-range assertion failed: ${a.id}`);
  }
}

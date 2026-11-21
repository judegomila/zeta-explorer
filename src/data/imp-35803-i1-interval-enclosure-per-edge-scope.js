/**
 * @module imp-35803-i1-interval-enclosure-per-edge-scope
 *
 * imp-35803 (proof/assessment, S-frontier): SCOPE the imp-35727 ingredient I1 -- a
 * validated interval extension of f = H_t = A + B - C that BRACKETS the true value over
 * each WHOLE sub-segment (panel) of dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h],
 * carrying certified truncation + rounding error -- at T_PT = 3e12. imp-35727 named I1
 * GREENFIELD but, unlike its scoped siblings I2 (imp-35777, log-derivative panel cap) and
 * I3 (imp-35758 / imp-35778, modulus-floor edge split), never enumerated what I1 costs.
 * This module supplies that enumeration and its ONE structural finding: I1 is the base
 * engine the other four ingredients are functionals of.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; certifies nothing; instantiates no interval
 * enclosure; evaluates no A, B, or C; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * NODE SAMPLING vs INTERVAL ENCLOSURE (what I1 needs that the held code lacks)
 * -----------------------------------------------------------------------------
 * The held experimental winding scaffolding (imp-2696 / imp-33923 / imp-33968) evaluates
 * f at GRID NODES in double precision and unwraps the sampled phase. I1 instead demands a
 * SET-VALUED extension: for a panel box Z = [z_k, z_{k+1}] contained in dR, a computable
 * complex interval (box or disc) F(Z) with the INCLUSION property
 *     f(z) in F(Z)   for every z in Z,
 * so F brackets the true f over the WHOLE panel, not just at its endpoints. Two further
 * properties make F usable: inclusion isotonicity (Z1 subset Z2 implies F(Z1) subset
 * F(Z2)) and convergence (diam F(Z) -> 0 as diam(Z) -> 0), so subdividing a panel drives
 * the enclosure to any tightness the downstream caps require. Node sampling supplies none
 * of this: it bounds f nowhere between the nodes.
 *
 * THE TWO CERTIFIED ERROR CHANNELS THE ENCLOSURE MUST CARRY
 * -----------------------------------------------------------------------------
 * f = H_t = A + B - C is the Polymath15 EFFECTIVE approximation, so F(Z) must pad two
 * distinct errors, both already scoped upstream in W1:
 *   (a) TRUNCATION. The retained finite sums A, B, C differ from the target by a tail;
 *       the imp-35725 effective-error cap C_t = E_A + E_B + E_C0 bounds that tail. F(Z)
 *       inherits C_t as an additive complex pad of radius C_t (the same cap the imp-35758
 *       / imp-35778 barrier margin M = |A + B| - |C| already rests on). NAMING NOTE: the
 *       imp-35725 cap C_t is NOT the term C of H_t = A + B - C -- a name collision worth
 *       flagging (cf. [[etrunc_pt_anchor_reclassification]]).
 *   (b) ROUNDING. Each retained term (an interval n to the power minus s = exp(minus s log
 *       n) over the box Z, plus the Gaussian / theta weights) accumulates floating-point
 *       error; validated interval arithmetic with DIRECTED ROUNDING captures it per term.
 * So F(Z) = Aext(Z) + Bext(Z) - Cext(Z) + pad(C_t), the interval extensions Aext / Bext /
 * Cext computed with directed rounding and C_t the truncation pad -- I1 is exactly W1
 * (the imp-35681 Part A / imp-35725 evaluator) LIFTED from real-argument bound to a
 * validated 2D complex box extension traversing dR. W2 I1 is strictly downstream of W1.
 *
 * THE STRUCTURAL FINDING: I1 IS THE BASE ENGINE; I2 AND I3 ARE ITS FUNCTIONALS
 * -----------------------------------------------------------------------------
 * The per-panel quantities the other ingredients need are TWO PROJECTIONS of the SAME box
 * F(Z), not independent constructions:
 *     I3 modulus floor  delta_panel = inf_{Z} |F(Z)|      (the MODULUS projection),
 *     I2 phase range     Delta arg_panel = argwidth F(Z)   (the ARGUMENT projection).
 * The I2 sufficient cap (f stays in an open half-plane, argwidth F(Z) < pi) and the I3
 * non-vanishing floor (0 not in F(Z), i.e. delta_panel > 0) are the argument-range and
 * modulus-floor READ-OUTS of one enclosure. So the genuinely greenfield UNIT is I1: once F
 * exists, I2 / I3 are functionals of it, and I4 (sum the per-panel arg increments) / I5
 * (compose across corners) consume the same per-panel boxes. This says a certificate cannot
 * build I1 "after" I2 / I3 -- I1 is upstream of all four, and its per-panel width is the
 * single knob that sets whether the half-plane cap (I2) and the floor (I3) both hold.
 *
 * TWO ENCLOSURES ARE NEEDED, NOT ONE
 * -----------------------------------------------------------------------------
 * The base extension F (above) delivers the I3 floor and the I2 half-plane form directly.
 * But the SHARPER I2 log-derivative cap (imp-35777: L_panel . sup|f prime / f| < pi) and
 * the imp-35799 long-edge derivative floor (delta_long ~ inf|H_t prime| . h) require a
 * SECOND validated extension F_prime(Z) bracketing the z-derivative H_t prime = A prime +
 * B prime - C prime over the panel. imp-35799 already logged that differentiated enclosure
 * as its OPEN sub-gap SG-1 (z-derivative of imp-35681 Part A, still GREENFIELD). So I1
 * splits into I1a (base F, greenfield) and I1b (differentiated F_prime, = imp-35799 SG-1,
 * greenfield); differentiation multiplies each term coefficient by a log-frequency factor
 * <= log N ~ w(T_PT), so F_prime reuses F machinery at ~w times the coefficient scale.
 *
 * THE MECHANICAL COST (same obstruction imp-35725 named, now set-valued)
 * -----------------------------------------------------------------------------
 * Each box evaluation of Aext / Bext / Cext sums the ~4.886e5 retained terms imp-35725
 * named, now as interval n-to-the-minus-s over Z rather than scalar. The panel count along
 * dR is set by the imp-35777 density ~ w / pi ~ 4.28 panels per unit height in the robust
 * regime (mean zero gap g = pi / w ~ 0.2336), so the certificate performs ~ (perimeter . 4.28)
 * box evaluations, each a ~4.886e5-term interval sum -- and TWICE that with I1b for F_prime.
 * No new mechanism beyond W1: the same retained sum, lifted to directed-rounding boxes.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Scoping only. It writes the I1 inclusion form and the two error channels, names I1 the
 * base engine that I2 / I3 project from, and splits I1 into base (I1a) and differentiated
 * (I1b = imp-35799 SG-1) enclosures. It BUILDS no extension, evaluates no A / B / C, pads
 * no C_t, computes no delta_panel or argwidth, verifies no inclusion, fixes no Delta or h,
 * certifies nothing, changes no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1 named GREENFIELD, un-scoped)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 = argument-range readout; sup|f prime/f|)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 = modulus-floor readout; floor = barrier surplus)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (I3 short/long edge split off the SAME enclosure)
 * @see imp-35799-i3-long-edge-derivative-floor-scope (SG-1 = the differentiated enclosure I1b, GREENFIELD)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: interval-bounded A + B - C evaluator, W1)
 * @see imp-35725-w1-effective-error-cap-budget (C_t = E_A + E_B + E_C0; the truncation pad F carries)
 * @see imp-2696-winding-lyapunov-experiment (node-sampled phase, isRigorous:false; no between-node enclosure)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35777 / imp-35778) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const TWO_PI = 2 * Math.PI;
const HALF_TURN = Math.PI; // I2 half-plane threshold: argwidth F(Z) < pi per panel

// Mean winding rate w(t) = (1/2) log(t/2pi); the log-frequency factor F_prime coefficients scale by.
const LOG_T_OVER_2PI = Math.log(T_PT / TWO_PI); // ~ 26.892
const WINDING_RATE = 0.5 * LOG_T_OVER_2PI; // w(T_PT) ~ 13.446

// Robust-regime panel geometry inherited from imp-35777 (both projections read off the SAME box).
const MEAN_ZERO_GAP = HALF_TURN / WINDING_RATE; // g = pi/w ~ 0.2336 = imp-35757 borderline width
const PANELS_PER_UNIT_HEIGHT = WINDING_RATE / HALF_TURN; // ~ 4.28 (imp-35777 density)

// The retained-term count of the effective sum (imp-35725 / imp-35778); the per-box work unit.
const RETAINED_TERMS_OOM = 4.886e5; // ~4.886e5 retained terms per box evaluation

export const IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE = {
  id: 'imp-35803',
  proofSection: 'S-frontier',
  question:
    'Scope what the imp-35727 ingredient I1 -- a validated interval extension of f = H_t = A + B - C bracketing the ' +
    'true value over each WHOLE sub-segment of dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h], carrying ' +
    'certified truncation + rounding error, downstream of the imp-35725 effective-error cap C_t -- requires at ' +
    'T_PT = 3e12. Scoping only; ports nothing; certifies nothing; changes no bound; NO QED.',
  nodeVsEnclosure: {
    heldShape:
      'imp-2696 / imp-33923 / imp-33968 evaluate f at grid NODES in double precision and unwrap the sampled phase; ' +
      'they bound f nowhere between the nodes (isRigorous:false).',
    inclusionForm:
      'I1 demands a computable complex interval F(Z) with f(z) in F(Z) for every z in the panel box Z = [z_k, z_{k+1}] ' +
      'contained in dR -- a SET-VALUED extension bracketing f over the whole panel, not point evaluation.',
    usabilityProperties:
      'inclusion isotone (Z1 subset Z2 implies F(Z1) subset F(Z2)) and convergent (diam F(Z) -> 0 as diam Z -> 0), so ' +
      'subdividing a panel tightens the enclosure to whatever the downstream caps need.',
  },
  twoErrorChannels: {
    truncation:
      'The retained sums A, B, C are the Polymath15 EFFECTIVE approximation; F(Z) pads the tail via the imp-35725 cap ' +
      'C_t = E_A + E_B + E_C0 as an additive complex pad of radius C_t (the cap the imp-35758 / imp-35778 barrier ' +
      'margin M = |A + B| - |C| already rests on).',
    rounding:
      'Each retained term (interval n-to-the-minus-s = exp(minus s log n) over Z, plus Gaussian / theta weights) is ' +
      'evaluated with DIRECTED-ROUNDING interval arithmetic so floating-point error is captured per term.',
    assembledForm: 'F(Z) = Aext(Z) + Bext(Z) - Cext(Z) + pad(C_t): W1 lifted from real-argument bound to a 2D complex box extension.',
    namingCollisionNote:
      'The imp-35725 cap C_t is NOT the term C of H_t = A + B - C; flagged to avoid the collision (cf etrunc reclassification).',
  },
  structuralFinding: {
    finding:
      'I1 is the BASE ENGINE the other ingredients are functionals of: the I3 modulus floor delta_panel = inf_Z |F(Z)| ' +
      'is the MODULUS projection of the box and the I2 phase range argwidth F(Z) is the ARGUMENT projection. The I2 ' +
      'half-plane cap (argwidth F(Z) < pi) and the I3 floor (0 not in F(Z)) are two read-outs of ONE enclosure.',
    consequence:
      'A certificate cannot build I1 after I2 / I3 -- I1 is upstream of all four (I4 sums the per-panel increments, I5 ' +
      'composes them across corners), and the per-panel enclosure WIDTH is the single knob setting whether the ' +
      'half-plane cap (I2) and the floor (I3) both hold on that panel.',
    i3Floor: 'delta_panel = inf_Z |F(Z)| (modulus projection)',
    i2Range: 'argwidth F(Z) (argument projection); cap argwidth F(Z) < pi',
    capThreshold: HALF_TURN,
  },
  twoEnclosures: {
    i1aBase: 'Base extension F(Z) of A + B - C: delivers the I3 floor and the I2 half-plane form directly. GREENFIELD.',
    i1bDifferentiated:
      'Second extension F_prime(Z) bracketing H_t prime = A prime + B prime - C prime, needed by the sharper I2 ' +
      'log-derivative cap (imp-35777) and the imp-35799 long-edge derivative floor. This is EXACTLY imp-35799 SG-1 ' +
      '(z-derivative of imp-35681 Part A), still GREENFIELD.',
    derivativeScaling:
      'Differentiation multiplies each term coefficient by a log-frequency factor <= log N ~ w(T_PT) ~ 13.446, so ' +
      'F_prime reuses the F machinery at ~w times the coefficient scale.',
    windingRate: WINDING_RATE,
  },
  mechanicalCost: {
    perBoxWork: 'Each Aext / Bext / Cext box evaluation sums the ~4.886e5 retained terms imp-35725 named, now interval-valued.',
    panelCount:
      'Panels along dR set by the imp-35777 density ~ w/pi ~ 4.28 per unit height (mean zero gap g = pi/w ~ 0.2336); ' +
      'the certificate performs ~ (perimeter . 4.28) box evaluations, TWICE with I1b for F_prime.',
    noNewMechanism: 'No mechanism beyond W1: the same retained sum, lifted to directed-rounding boxes.',
    retainedTermsOOM: RETAINED_TERMS_OOM,
    panelsPerUnitHeight: PANELS_PER_UNIT_HEIGHT,
    meanZeroGap: MEAN_ZERO_GAP,
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The imp-35727 ingredient I1 is a validated interval ' +
    'extension F(Z) with f(z) in F(Z) over each WHOLE panel Z of dR -- inclusion isotone and convergent, so ' +
    'subdivision tightens it -- unlike the held node-sampled double-precision phase (imp-2696 / imp-33923 / imp-33968, ' +
    'isRigorous:false). F(Z) = Aext(Z) + Bext(Z) - Cext(Z) + pad(C_t) carries TWO certified error channels: truncation ' +
    '(the imp-35725 cap C_t = E_A + E_B + E_C0, NOT the term C) and rounding (directed-rounding interval arithmetic). ' +
    'STRUCTURAL FINDING: I1 is the base engine the other ingredients are functionals of -- the I3 floor delta_panel = ' +
    'inf_Z |F(Z)| is the modulus projection and the I2 cap argwidth F(Z) < pi is the argument projection of the SAME box, ' +
    'so I2 / I3 read out one enclosure and I4 / I5 consume the same per-panel boxes; the per-panel width is the single ' +
    'knob. I1 splits into I1a (base F, greenfield) and I1b (differentiated F_prime = imp-35799 SG-1, greenfield, needed ' +
    'by the sharper log-derivative I2 and the long-edge derivative floor). It is W1 (imp-35681 Part A / imp-35725) LIFTED ' +
    'to 2D complex boxes: strictly downstream of W1, same ~4.886e5-term retained sum, no new mechanism. Builds no ' +
    'extension; evaluates no A / B / C; pads no C_t; computes no delta_panel or argwidth; verifies no inclusion; fixes ' +
    'no Delta or h; certifies nothing; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35727 (I1 named GREENFIELD, un-scoped); imp-35777 (I2 argument-range readout, log-derivative cap); imp-35758 / ' +
    'imp-35778 (I3 modulus-floor readout, short/long edge split); imp-35799 (SG-1 = the differentiated enclosure I1b); ' +
    'imp-35681 Part A (interval-bounded A + B - C evaluator, W1); imp-35725 (effective-error cap C_t = E_A + E_B + E_C0); ' +
    'imp-2696 / imp-33923 / imp-33968 (node-sampled phase, isRigorous:false); Polymath15 2019 (H_t = A + B - C; barrier ' +
    'method); Platt-Trudgian 2021.',
};

export const IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE_ASSERTIONS = [
  {
    // I1 is an inclusion-isotone, convergent SET-VALUED extension bracketing f over whole panels, not node sampling.
    id: 'imp35803-inclusion-form-not-node-sampling',
    description: 'I1 = computable F(Z) with f(z) in F(Z) over the whole panel box; inclusion isotone + convergent; not node sampling',
    holds: () =>
      /f\(z\) in F\(Z\)/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.nodeVsEnclosure.inclusionForm) &&
      /SET-VALUED/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.nodeVsEnclosure.inclusionForm) &&
      /inclusion isotone/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.nodeVsEnclosure.usabilityProperties) &&
      /convergent/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.nodeVsEnclosure.usabilityProperties) &&
      /NODES/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.nodeVsEnclosure.heldShape),
  },
  {
    // Two error channels: truncation (the imp-35725 C_t pad, distinct from the term C) + directed-rounding.
    id: 'imp35803-two-error-channels',
    description: 'F(Z) carries truncation (imp-35725 C_t = E_A+E_B+E_C0 pad) + rounding (directed rounding); C_t distinct from term C',
    holds: () =>
      /C_t = E_A \+ E_B \+ E_C0/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.twoErrorChannels.truncation) &&
      /DIRECTED-ROUNDING/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.twoErrorChannels.rounding) &&
      /NOT the term C/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.twoErrorChannels.namingCollisionNote) &&
      /Aext\(Z\) \+ Bext\(Z\) - Cext\(Z\) \+ pad\(C_t\)/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.twoErrorChannels.assembledForm),
  },
  {
    // Structural finding: I1 base engine; I3 floor = modulus projection, I2 cap = argument projection of the SAME box.
    id: 'imp35803-i1-base-engine-i2-i3-functionals',
    description: 'I3 floor = inf_Z|F(Z)| (modulus projection), I2 cap = argwidth F(Z) < pi (argument projection) of ONE enclosure',
    holds: () =>
      /base engine/i.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.structuralFinding.finding) &&
      /inf_Z \|F\(Z\)\|/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.structuralFinding.i3Floor) &&
      /argwidth F\(Z\)/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.structuralFinding.i2Range) &&
      Math.abs(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.structuralFinding.capThreshold - Math.PI) < 1e-15,
  },
  {
    // I1 splits into I1a (base) + I1b (differentiated = imp-35799 SG-1); geometry inherited from imp-35777.
    id: 'imp35803-two-enclosures-and-cost',
    description: 'I1b = imp-35799 SG-1 differentiated enclosure; density ~ w/pi ~ 4.28, gap = pi/w ~ 0.2336, ~4.886e5 terms per box',
    holds: () =>
      /imp-35799 SG-1/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.twoEnclosures.i1bDifferentiated) &&
      T_PT === 3e12 &&
      Math.abs(WINDING_RATE - 13.4458782) < 1e-4 &&
      Math.abs(PANELS_PER_UNIT_HEIGHT - WINDING_RATE / Math.PI) < 1e-15 &&
      Math.abs(PANELS_PER_UNIT_HEIGHT - 4.279956) < 1e-4 &&
      Math.abs(MEAN_ZERO_GAP - Math.PI / WINDING_RATE) < 1e-15 &&
      Math.abs(MEAN_ZERO_GAP - 0.2336488) < 1e-4 &&
      Math.abs(RETAINED_TERMS_OOM - 4.886e5) < 1,
  },
  {
    // Honesty gate: scoping only, no enclosure built, certifies nothing, NO QED, no refereed bound is changed.
    id: 'imp35803-honesty-gate-no-qed',
    description: 'Scoping only; builds no extension; certifies nothing; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies nothing/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.verdict) &&
      /NO QED/.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE.verdict),
  },
];

for (const a of IMP35803_I1_INTERVAL_ENCLOSURE_PER_EDGE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35803-i1-interval-enclosure-per-edge-scope assertion failed: ${a.id}`);
  }
}

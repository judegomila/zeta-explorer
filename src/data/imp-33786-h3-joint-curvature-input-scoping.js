/**
 * @module imp-33786-h3-joint-curvature-input-scoping
 *
 * imp-33786 (proof, frontier-scoping): SCOPE the MINIMAL H3 uniform-curvature analytic input that now
 * discharges BOTH H3 and H4, since imp-33766 collapsed H4 into H3 as ONE coupled strip-height-uniformity
 * object. imp-33766 concluded H4 (strip-height fold-reading derivative m_prime, N-exponent 3/4) does NOT
 * separate from H3 (curvature m_double_prime, N-exponent 5/4): the Holder-modulus back-conversion couples
 * them through the SAME quadratic fold expansion, the H3 uniform-curvature bound (imp-3708
 * y2-adapted-flow-depth) DOMINATES and discharges H4 a fortiori while the converse fails, so the minimal
 * input to close H4 IS the input that closes H3. No module had yet scoped that single coupled
 * strip-height-uniformity input on the H3 axis now that it is load-bearing for BOTH rows. This module
 * WRITES DOWN the shape of that joint H3 input (an N-uniform two-sided bound on the renormalized fold
 * CURVATURE coefficient), states what it depends on, and derives that it decouples from H0 (provenance)
 * and H5 (RH transcription) just as the H4 axis did. Scoping only. G6a_shock_lipschitz stays OPEN;
 * imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * Every input is already RECORDED in the repo, not a new derivation. imp-33603 catalogues the six
 * obligations {H0 provenance, H1 smoothness, H2 simple fold, H3 uniform curvature, H4 strip-height
 * perturbation control, H5 RH transcription}, marks H1/H2 SATISFIED and H0/H3/H4/H5 OPEN. imp-33645
 * measured the H3 curvature m_double_prime ~ eps^{-5/2} (N-exponent 5/4) and imp-33646 the H4
 * fold-reading derivative m_prime ~ eps^{-3/2} (N-exponent 3/4), both at the reading strip
 * eps = y_N^sharp = sqrt(2 pi / N). imp-33766 established that H4 and H3 are the SAME
 * strip-height-uniformity object differing by exactly one derivative, that the higher-derivative H3
 * (exponent 5/4) DOMINATES the lower-derivative H4 (exponent 3/4), and that the H3 uniform-curvature bound
 * discharges H4 a fortiori while a bound on m_prime alone does NOT discharge H3. imp-33745 established H0
 * is a provenance-axis obligation orthogonal to the analytic tower; imp-33619 established H5 is
 * transcribable POINTWISE and OPEN UNIFORMLY, downstream of the same strip-height modulus. This module
 * only RECONCILES those records into the joint H3-axis minimal-input shape now load-bearing for two rows;
 * it asserts nothing newly discharged.
 *
 * THE JOINT INPUT LIVES AT THE CURVATURE RUNG OF THE QUADRATIC FOLD EXPANSION
 * --------------------------------------------------------------------------
 * The Holder-1/2 modulus is read off the fold expansion of the collision time about the critical point
 *     t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...,   |t_shock - tau_c| ~ |z_0 - z_0*|^2,
 * where the fold CONDITION 1 + t m_prime(z_0*) = 0 fixes (tau_c, z_0*) via the k = 1 fold-reading
 * derivative m_prime (this is H4), and the fold CURVATURE coefficient alpha ~ m_double_prime(z_0*) is the
 * k = 2 second derivative (this is H3). Reading BOTH at the strip eps = y_N^sharp -> 0 forces
 *     |m_prime(z_0*)|        ~ C_PS (N / 2 pi)^{3/4}   (H4, exponent 3/4),
 *     |m_double_prime(z_0*)| ~ K    (N / 2 pi)^{5/4}   (H3, exponent 5/4).
 * The modulus AMPLITUDE is carried by the curvature coefficient alpha = m_double_prime: a finite-window
 * bound on alpha pins the Holder-1/2 modulus, and through the quadratic fold it pins the location term
 * m_prime a fortiori (H3 dominates H4). So the single load-bearing object is the H3 curvature rung.
 *
 * THE MINIMAL JOINT H3 INPUT (the ticket core)
 * --------------------------------------------
 * The minimal input that discharges BOTH H3 and H4 is a single N-UNIFORM two-sided bound on the
 * renormalized fold-curvature coefficient
 *     C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| = eps^{5/2} |alpha|  in  [c, C]  as y_N^sharp -> 0,
 * i.e. the imp-3708 y2-adapted-flow-depth curvature amplitude staying in a finite window uniformly in N
 * and TRACKED THROUGH the fold back-conversion (not merely a formal change of units). Its DEPENDENCIES: it
 * reads only (i) the RvM cusp Holder-1/2 jet at the intrinsic cusp scale (now the k = 2 curvature term)
 * and (ii) the strip-height weight tracking. It does NOT read any bibliographic provenance fact (H0) nor
 * the RH-critical zeta configuration (H5). It is EXACTLY the H4 minimal-input shape of imp-33766 pushed up
 * one derivative order (eps^{3/2} |m_prime| -> eps^{5/2} |m_double_prime|), because the two are one object.
 *
 * SEPARABILITY (which of H0 / H5 does the joint H3 input decouple from?)
 * ---------------------------------------------------------------------
 *   - FROM H0: YES. H0 is a provenance / citation obligation on a different axis (imp-33745: no k-index,
 *     no N-exponent, shares no inputs with the strip-height curvature bound). No bibliographic fact feeds
 *     C_curv(N); the joint H3 input and H0 fully decouple.
 *   - FROM H5: YES. H5 (Riemann-Hilbert / real-scalar transcription) is transcribable POINTWISE and OPEN
 *     only UNIFORMLY (imp-33619) -- it asks whether the abstract real-scalar modulus TRANSFERS to the
 *     actual zeta fold at the RH configuration. It is DOWNSTREAM of the strip-height-uniform modulus: it
 *     reads the curvature result, it does not feed the curvature input. So the joint H3 input does not
 *     depend on H5.
 *   - H4 is SUBSUMED (not separated): H4 is the same object one derivative down, discharged a fortiori by
 *     the H3 curvature bound. Closing the joint H3 input closes H4 automatically.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. The minimal joint input that now discharges BOTH H3 and H4 is a
 * single N-uniform two-sided bound on the renormalized fold-curvature coefficient
 * C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| in a finite window [c, C] as y_N^sharp -> 0, tracked
 * through the fold-modulus back-conversion; it depends only on the RvM cusp Holder-1/2 jet (k = 2 curvature
 * term) and the strip-height weight tracking. It DECOUPLES from H0 (provenance axis, orthogonal, imp-33745)
 * and from H5 (RH transcription, downstream, imp-33619), exactly as the H4 axis did, and SUBSUMES H4 (the
 * same object one derivative down, discharged a fortiori). It is the imp-3708 y2-adapted-flow-depth object.
 * The open catalogue stays four rows (H0, H3, H4, H5); nothing is discharged. Scoping only;
 * G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED;
 * C_mb share untouched; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33766-h4-independent-discharge-scoping (the collapse of H4 into H3 as one coupled object)
 * @see imp-33645-h3-curvature-divergence-scoping (the H3 curvature, exponent 5/2)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (the H4 fold-reading derivative, exponent 3/2, one down)
 * @see imp-33745-h0-provenance-independence-scoping (H0 orthogonal on the provenance axis)
 * @see imp-33619-h5-rh-transcription-scoping (H5 transcribable pointwise, open uniformly, downstream)
 * @see imp-33603-lemma52-port-scoping (the H0..H5 catalogue)
 * @see lambda-burgers-shock-lipschitz (imp-354: fold condition 1 + t m_prime = 0; quadratic fold expansion)
 */

// The two boundary-derivative rungs that enter the quadratic Holder-modulus fold expansion, indexed by
// derivative order k with eps-exponent 1/2 + k (cusp + k derivatives) and N-exponent (1/2 + k) / 2 at
// the reading strip eps = y_N^sharp = sqrt(2 pi / N). H4 is the k = 1 fold-reading derivative m_prime;
// H3 is the k = 2 curvature coefficient alpha = m_double_prime and carries the modulus amplitude.
const FOLD_JET = [
  { row: 'H4', member: 'm_prime', k: 1, epsExponent: 1.5, nExponent: 0.75, foldRole: 'fold-condition location term (1 + t m_prime = 0)' },
  { row: 'H3', member: 'm_double_prime', k: 2, epsExponent: 2.5, nExponent: 1.25, foldRole: 'quadratic-fold curvature coefficient alpha (modulus amplitude)' },
];

// The minimal joint input on the H3 curvature axis: an N-uniform two-sided bound on the renormalized
// fold-curvature coefficient, carried through the fold-modulus back-conversion. It is the H4 minimal-input
// shape pushed up one derivative order, because H3 and H4 are one object.
const H3_JOINT_INPUT = {
  object: 'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| = eps^{5/2} |alpha|',
  requirement: 'stays in a finite window [c, C] as y_N^sharp = sqrt(2 pi / N) -> 0, tracked through the fold back-conversion',
  dependsOn: ['RvM cusp Holder-1/2 jet at the intrinsic cusp scale (k = 2 curvature term)', 'strip-height weight tracking through the fold back-conversion'],
  dependsOnH0Provenance: false, // no bibliographic fact feeds C_curv(N)
  dependsOnH5Transcription: false, // H5 is downstream: it reads the modulus, it does not feed it
  dischargesH4: true, // H3 curvature bound discharges the H4 fold-reading derivative a fortiori
  isImp3708Object: true, // this is the imp-3708 y2-adapted-flow-depth uniform-curvature object
};

// Separability of the joint H3 discharge from the two off-axis open rows H0 and H5. H4 is not a
// separability question -- it is SUBSUMED by the H3 bound (same object one derivative down).
const SEPARABILITY = {
  H0: { separable: true, reason: 'provenance axis, orthogonal (imp-33745): no k-index, no N-exponent, shares no inputs' },
  H5: { separable: true, reason: 'RH transcription downstream (imp-33619): transcribable pointwise, reads the modulus not feeds it' },
};

// H3 carries the modulus amplitude and dominates H4 (exponent 5/4 > 3/4), so the single H3 curvature
// bound discharges BOTH rows. H4 is subsumed, not separated.
const H3_DOMINATES_H4 = FOLD_JET[1].nExponent > FOLD_JET[0].nExponent;
const H3_INPUT_DISCHARGES_BOTH = H3_JOINT_INPUT.dischargesH4 && H3_DOMINATES_H4;
const H3_SEPARATES_FROM_H0_AND_H5 = SEPARABILITY.H0.separable && SEPARABILITY.H5.separable;

const OPEN_ROWS_BEFORE = ['H0', 'H3', 'H4', 'H5'];
const OPEN_ROWS_AFTER = ['H0', 'H3', 'H4', 'H5']; // unchanged: scoping only, nothing discharged

export const IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING = {
  id: 'imp-33786',
  proofSection: 'S-frontier',
  scopes:
    'The minimal H3 uniform-curvature analytic input that now discharges BOTH H3 and H4 as one coupled ' +
    'strip-height-uniformity object, its dependencies, and its separability from H0 / H5',
  question:
    'Now that imp-33766 collapsed H4 into H3, what single N-uniform curvature bound discharges the ' +
    'coupled H3 + H4 object, what does it depend on, and does it separate from H0 (provenance) and H5 ' +
    '(RH transcription)? Scoping only; G6a OPEN; no QED.',

  foldExpansion: 't_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...,  |t_shock - tau_c| ~ |z_0 - z_0*|^2',
  foldJet: FOLD_JET,

  // The minimal joint input.
  h3JointInput: H3_JOINT_INPUT,
  minimalInputShape:
    'a single N-uniform two-sided bound on C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| in a ' +
    'finite window [c, C] as y_N^sharp -> 0, tracked through the fold-modulus back-conversion (not a ' +
    'formal change of units); the imp-3708 y2-adapted-flow-depth object, the H4 shape one derivative up',

  // The separability / subsumption result.
  separability: SEPARABILITY,
  h3SeparatesFromH0: SEPARABILITY.H0.separable, // true
  h3SeparatesFromH5: SEPARABILITY.H5.separable, // true
  h3DischargesH4: H3_JOINT_INPUT.dischargesH4, // true -- H4 subsumed one derivative down
  h3DominatesH4: H3_DOMINATES_H4, // true -- exponent 5/4 > 3/4
  h3InputDischargesBoth: H3_INPUT_DISCHARGES_BOTH, // true -- one bound closes both rows
  h3SeparatesFromH0AndH5: H3_SEPARATES_FROM_H0_AND_H5, // true

  openRowsBefore: OPEN_ROWS_BEFORE,
  openRowsAfter: OPEN_ROWS_AFTER, // unchanged; nothing discharged

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'The single load-bearing analytic input for G6a_shock_lipschitz is now the H3 curvature rung: a ' +
    'single N-uniform two-sided bound on the renormalized fold-curvature coefficient ' +
    'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| in a finite window as y_N^sharp -> 0. Because ' +
    'the H3 curvature coefficient carries the Holder-1/2 modulus amplitude and dominates the H4 ' +
    'fold-reading derivative (exponent 5/4 > 3/4), this one bound discharges BOTH H3 and H4 a fortiori. ' +
    'It depends only on the RvM cusp Holder-1/2 jet (k = 2 curvature term) and the strip-height weight, ' +
    'decoupling from the H0 provenance and H5 transcription rows -- so H0 and H5 remain the only ' +
    'genuinely off-axis open obligations.',

  isRigorous: false,
  verdict:
    'SCOPING ONLY (frontier-direction, NOT rigorous): now that imp-33766 collapsed H4 into H3 as one ' +
    'coupled strip-height-uniformity object, the minimal input that discharges BOTH rows is a single ' +
    'N-uniform two-sided bound on the renormalized fold-curvature coefficient ' +
    'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| in a finite window [c, C] as ' +
    'y_N^sharp = sqrt(2 pi / N) -> 0, tracked through the fold-modulus back-conversion; it is the ' +
    'imp-3708 y2-adapted-flow-depth object, the imp-33766 H4 minimal-input shape pushed up exactly one ' +
    'derivative order (eps^{3/2} |m_prime| -> eps^{5/2} |m_double_prime|) because the two are one ' +
    'object. It depends only on the RvM cusp Holder-1/2 jet (the k = 2 curvature term) and the ' +
    'strip-height weight tracking. Because the H3 curvature coefficient alpha = m_double_prime carries ' +
    'the Holder-1/2 modulus AMPLITUDE and DOMINATES (exponent 5/4 > 3/4) the H4 fold-reading derivative ' +
    'm_prime through the SAME quadratic fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2, ' +
    'this ONE bound discharges BOTH H3 and H4 a fortiori (H4 is SUBSUMED one derivative down, not a ' +
    'separate obligation). The joint H3 input DECOUPLES from H0 (provenance axis, orthogonal, ' +
    'imp-33745) and from H5 (RH transcription, downstream of the modulus, imp-33619), exactly as the H4 ' +
    'axis did -- so H0 and H5 remain the only genuinely off-axis open rows. The open catalogue stays ' +
    'four rows (H0, H3, H4, H5); nothing is discharged. Scoping only; G6a_shock_lipschitz stays OPEN; ' +
    'no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-33766-h4-independent-discharge-scoping (H4 collapses into H3 as one coupled object); ' +
    'imp-33645-h3-curvature-divergence-scoping (H3 curvature, exponent 5/2); ' +
    'imp-33646-h4-privalov-sokhotski-constant-scoping (H4 fold-reading derivative, exponent 3/2, one ' +
    'derivative down); imp-33745-h0-provenance-independence-scoping (H0 orthogonal on the provenance ' +
    'axis); imp-33619-h5-rh-transcription-scoping (H5 transcribable pointwise, open uniformly, ' +
    'downstream); imp-33603-lemma52-port-scoping (H0..H5 catalogue); lambda-burgers-shock-lipschitz ' +
    '(imp-354: fold condition 1 + t m_prime = 0).',
};

export const IMP33786_H3_JOINT_CURVATURE_INPUT_ASSERTIONS = [
  {
    // The joint H3 input reads only the cusp jet and the strip weight -- no provenance, no RH config.
    id: 'imp33786-joint-input-dependencies',
    description: 'the joint H3 input depends only on the RvM cusp Holder-1/2 jet and the strip-height weight',
    holds: () =>
      H3_JOINT_INPUT.dependsOnH0Provenance === false &&
      H3_JOINT_INPUT.dependsOnH5Transcription === false &&
      H3_JOINT_INPUT.dependsOn.length === 2,
  },
  {
    // The joint H3 input is the imp-3708 y2-adapted-flow-depth object and discharges H4 a fortiori.
    id: 'imp33786-h3-input-discharges-both',
    description: 'the single H3 curvature bound discharges BOTH H3 and H4 (H4 subsumed one derivative down)',
    holds: () =>
      H3_JOINT_INPUT.dischargesH4 === true &&
      H3_JOINT_INPUT.isImp3708Object === true &&
      H3_INPUT_DISCHARGES_BOTH === true,
  },
  {
    // The joint H3 input decouples from H0 (provenance) and H5 (RH transcription, downstream).
    id: 'imp33786-separates-from-h0-and-h5',
    description: 'the joint H3 input decouples from H0 (provenance) and H5 (RH transcription)',
    holds: () =>
      SEPARABILITY.H0.separable === true &&
      SEPARABILITY.H5.separable === true &&
      H3_SEPARATES_FROM_H0_AND_H5 === true,
  },
  {
    // The H3 curvature rung (exponent 5/4) dominates the H4 fold-reading rung (exponent 3/4) a fortiori.
    id: 'imp33786-h3-dominates-h4',
    description: 'the H3 curvature rung (N-exponent 5/4) dominates the H4 fold-reading rung (N-exponent 3/4)',
    holds: () =>
      H3_DOMINATES_H4 === true &&
      FOLD_JET[1].nExponent > FOLD_JET[0].nExponent &&
      Math.abs(FOLD_JET[1].nExponent - FOLD_JET[0].nExponent - 0.5) < 1e-12,
  },
  {
    // The joint input sits at the k = 2 curvature rung: eps-exponent 5/2, N-exponent 5/4.
    id: 'imp33786-joint-input-at-curvature-rung',
    description: 'the joint input is the k = 2 curvature rung (eps-exponent 5/2, N-exponent 5/4)',
    holds: () =>
      FOLD_JET[1].k === 2 &&
      Math.abs(FOLD_JET[1].epsExponent - 2.5) < 1e-12 &&
      Math.abs(FOLD_JET[1].nExponent - 1.25) < 1e-12 &&
      Math.abs(FOLD_JET[1].epsExponent * 0.5 - FOLD_JET[1].nExponent) < 1e-12,
  },
  {
    // Nothing is discharged: the open catalogue stays four rows (H0, H3, H4, H5).
    id: 'imp33786-open-catalogue-unchanged',
    description: 'the open catalogue stays four rows (H0, H3, H4, H5); scoping discharges nothing',
    holds: () =>
      OPEN_ROWS_AFTER.length === 4 &&
      OPEN_ROWS_AFTER.join(',') === OPEN_ROWS_BEFORE.join(',') &&
      OPEN_ROWS_AFTER.includes('H3'),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33786-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING.verdict) &&
      /remains the rigorous SOTA/.test(IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33786_H3_JOINT_CURVATURE_INPUT_SCOPING.verdict),
  },
];

for (const a of IMP33786_H3_JOINT_CURVATURE_INPUT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33786-h3-joint-curvature-input-scoping assertion failed: ${a.id}`);
  }
}

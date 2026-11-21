/**
 * @module imp-33766-h4-independent-discharge-scoping
 *
 * imp-33766 (proof, frontier-scoping): SCOPE the MINIMAL analytic input that would discharge the H4
 * strip-height-uniformity residual on its OWN axis, and ASSESS its separability from the remaining
 * open G6a rows H0 (provenance), H3 (curvature) and H5 (RH transcription). imp-33603/imp-33745 name
 * H4 (strip-height perturbation control) the SINGLE load-bearing G6a_shock_lipschitz residual with
 * H0/H3/H5 the remaining open rows, but no module has scoped what minimal lemma would close H4 alone.
 * This module WRITES DOWN the shape of the missing input (a strip-height-UNIFORM bound on the
 * renormalized fold-reading derivative), states what it depends on, and derives which of H0/H3/H5 it
 * separates from. Scoping only. G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity;
 * NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * Every input is already RECORDED in the repo, not a new derivation. imp-33603 catalogues the six
 * obligations {H0 provenance, H1 smoothness, H2 simple fold, H3 uniform curvature, H4 strip-height
 * perturbation control, H5 RH transcription}, marks H1/H2 SATISFIED and H0/H3/H4/H5 OPEN, and names
 * H4 the load-bearing residual. imp-33646 measured the H4 fold-reading derivative m_prime ~ eps^{-3/2}
 * (N-exponent 3/4) and imp-33645 the H3 curvature m_double_prime ~ eps^{-5/2} (N-exponent 5/4), both
 * at the reading strip eps = y_N^sharp = sqrt(2 pi / N); both found the same conclusion -- a formal
 * strip-height weight relocates the object but does not close it, and H4 and H3 are the SAME
 * strip-height-uniformity object differing by exactly one derivative. imp-33745 established H0 is a
 * provenance-axis obligation orthogonal to the analytic tower; imp-33619 established H5 is
 * transcribable POINTWISE and OPEN UNIFORMLY, downstream of the same strip-height modulus. This module
 * only RECONCILES those records into a minimal-input shape; it asserts nothing newly discharged.
 *
 * THE MISSING INPUT LIVES IN THE QUADRATIC FOLD EXPANSION
 * ------------------------------------------------------
 * The Holder-1/2 modulus is read off the fold expansion of the collision time about the critical point
 *     t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...,   |t_shock - tau_c| ~ |z_0 - z_0*|^2,
 * where the fold CONDITION 1 + t m_prime(z_0*) = 0 fixes (tau_c, z_0*) -- the k = 1 fold-reading
 * derivative m_prime (this is H4) -- and the fold CURVATURE coefficient alpha ~ m_double_prime(z_0*)
 * is the k = 2 second derivative (this is H3). Reading BOTH at the strip eps = y_N^sharp -> 0 forces
 *     |m_prime(z_0*)|      ~ C_PS (N / 2 pi)^{3/4}   (H4, exponent 3/4),
 *     |m_double_prime(z_0*)| ~ K   (N / 2 pi)^{5/4}   (H3, exponent 5/4).
 * The Holder modulus back-conversion is the product/ratio of these two through the quadratic fold, so
 * the modulus amplitude depends on BOTH the k = 1 location term and the k = 2 curvature term.
 *
 * THE MINIMAL H4-ALONE INPUT (the ticket core)
 * --------------------------------------------
 * The minimal input on the H4 axis alone is a single N-UNIFORM two-sided bound on the renormalized
 * fold-reading derivative
 *     C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| = eps^{3/2} |m_prime|  in  [c, C]  as y_N^sharp -> 0,
 * i.e. the Privalov-Sokhotski boundary-extension amplitude C_PS (imp-33646, ~ pi / sqrt(2)) staying in
 * a finite window uniformly in N and TRACKED THROUGH the fold back-conversion (not merely as a formal
 * change of units). Its DEPENDENCIES: it reads only (i) the RvM cusp Holder-1/2 jet at the intrinsic
 * cusp scale and (ii) the strip-height weight tracking. It does NOT read any bibliographic provenance
 * fact (H0) nor the RH-critical zeta configuration (H5).
 *
 * SEPARABILITY (which of H0/H3/H5 does H4 decouple from?)
 * ------------------------------------------------------
 *   - FROM H0: YES. H0 is a provenance / citation obligation on a different axis (imp-33745: no
 *     k-index, no N-exponent, shares no inputs with the strip-height curvature bound). No bibliographic
 *     fact feeds C_ren(N); H4 and H0 fully decouple.
 *   - FROM H5: YES. H5 (Riemann-Hilbert / real-scalar transcription) is transcribable POINTWISE and
 *     OPEN only UNIFORMLY (imp-33619) -- it asks whether the abstract real-scalar modulus TRANSFERS to
 *     the actual zeta fold at the RH configuration. It is DOWNSTREAM of the strip-height-uniform
 *     modulus: it reads the H4 result, it does not feed the H4 input. So H4 does not depend on H5.
 *   - FROM H3: NO. The Holder modulus back-conversion couples m_prime (H4, k = 1) and
 *     m_double_prime (H3, k = 2) through the SAME quadratic fold expansion: a uniform bound on m_prime
 *     alone pins the collision LOCATION but not the modulus AMPLITUDE alpha = m_double_prime. So H4 is
 *     NOT dischargeable in isolation from H3. Moreover H3 (exponent 5/4) DOMINATES H4 (exponent 3/4)
 *     a fortiori: a strip-height-uniform curvature bound (H3, the imp-3708 y2-adapted-flow-depth
 *     object) discharges H4 automatically, but a bound on m_prime alone does NOT discharge H3. H4 and
 *     H3 collapse into ONE coupled strip-height-uniformity object, load-bearing at the H3 rung.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. The minimal H4-axis input is a single N-uniform two-sided
 * bound on the renormalized fold-reading derivative C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| in a
 * finite window as y_N^sharp -> 0, tracked through the fold-modulus back-conversion; it depends only on
 * the RvM cusp Holder-1/2 jet and the strip-height weight. H4 SEPARATES cleanly from H0 (provenance
 * axis, orthogonal, imp-33745) and from H5 (RH transcription, downstream, imp-33619), but does NOT
 * separate from H3: the Holder modulus back-conversion couples the k = 1 fold-reading derivative
 * (m_prime, H4) and the k = 2 curvature coefficient (alpha = m_double_prime, H3) through the SAME
 * quadratic fold expansion, and the H3 uniform-curvature bound (imp-3708 y2-adapted-flow-depth)
 * dominates and discharges H4 a fortiori while the converse fails. So H4 is NOT independently
 * dischargeable on its own axis: it and H3 are ONE coupled strip-height-uniformity object, load-bearing
 * at the H3 curvature rung, decoupled from the H0 provenance and H5 transcription rows. The minimal
 * input to close H4 is therefore the SAME missing input that closes H3. Scoping only;
 * G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * UNTOUCHED; C_mb share untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (the H4 fold-reading derivative, exponent 3/2)
 * @see imp-33645-h3-curvature-divergence-scoping (the H3 curvature, exponent 5/2; same object one derivative up)
 * @see imp-33745-h0-provenance-independence-scoping (H0 orthogonal on the provenance axis)
 * @see imp-33619-h5-rh-transcription-scoping (H5 transcribable pointwise, open uniformly, downstream)
 * @see imp-33603-lemma52-port-scoping (the H0..H5 catalogue; H4 the load-bearing residual)
 * @see lambda-burgers-shock-lipschitz (imp-354: fold condition 1 + t m_prime = 0; quadratic fold expansion)
 */

// The two boundary-derivative rungs that enter the quadratic Holder-modulus fold expansion, indexed by
// derivative order k with eps-exponent 1/2 + k (cusp + k derivatives) and N-exponent (1/2 + k) / 2 at
// the reading strip eps = y_N^sharp = sqrt(2 pi / N). H4 is the k = 1 fold-reading derivative m_prime;
// H3 is the k = 2 curvature coefficient alpha = m_double_prime.
const FOLD_JET = [
  { row: 'H4', member: 'm_prime', k: 1, epsExponent: 1.5, nExponent: 0.75, foldRole: 'fold-condition location term (1 + t m_prime = 0)' },
  { row: 'H3', member: 'm_double_prime', k: 2, epsExponent: 2.5, nExponent: 1.25, foldRole: 'quadratic-fold curvature coefficient alpha' },
];

// The minimal analytic input on the H4 axis alone: an N-uniform two-sided bound on the renormalized
// fold-reading derivative, carried through the fold-modulus back-conversion.
const H4_MINIMAL_INPUT = {
  object: 'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| = eps^{3/2} |m_prime|',
  requirement: 'stays in a finite window [c, C] as y_N^sharp = sqrt(2 pi / N) -> 0, tracked through the fold back-conversion',
  dependsOn: ['RvM cusp Holder-1/2 jet at the intrinsic cusp scale', 'strip-height weight tracking through the fold back-conversion'],
  dependsOnH0Provenance: false, // no bibliographic fact feeds C_ren(N)
  dependsOnH5Transcription: false, // H5 is downstream: it reads the modulus, it does not feed it
  couplesToH3Curvature: true, // the Holder modulus amplitude alpha = m_double_prime is the H3 rung
};

// Separability of the H4 discharge from each of the other three open rows.
const SEPARABILITY = {
  H0: { separable: true, reason: 'provenance axis, orthogonal (imp-33745): no k-index, no N-exponent, shares no inputs' },
  H5: { separable: true, reason: 'RH transcription downstream (imp-33619): transcribable pointwise, reads the modulus not feeds it' },
  H3: { separable: false, reason: 'coupled through the quadratic fold expansion; H3 uniform-curvature bound dominates and discharges H4 a fortiori' },
};

// Direction of subsumption inside the coupled H3/H4 object: the higher-derivative H3 (exponent 5/4)
// dominates the lower-derivative H4 (exponent 3/4), so an H3 uniform bound closes H4 but not conversely.
const H3_DOMINATES_H4 = FOLD_JET[1].nExponent > FOLD_JET[0].nExponent;
const H4_INDEPENDENTLY_DISCHARGEABLE = SEPARABILITY.H3.separable; // false -- coupled to H3
const H4_SEPARATES_FROM_H0_AND_H5 = SEPARABILITY.H0.separable && SEPARABILITY.H5.separable;

const OPEN_ROWS_BEFORE = ['H0', 'H3', 'H4', 'H5'];
const OPEN_ROWS_AFTER = ['H0', 'H3', 'H4', 'H5']; // unchanged: scoping only, nothing discharged

export const IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING = {
  id: 'imp-33766',
  proofSection: 'S-frontier',
  scopes:
    'The minimal analytic input that would discharge the imp-33603 H4 strip-height-uniformity residual ' +
    'on its own axis, and its separability from the remaining open rows H0 / H3 / H5',
  question:
    'What minimal lemma closes H4 (strip-height perturbation control) on its own axis, what does it ' +
    'depend on, and is it separable from H0 (provenance), H3 (curvature) and H5 (RH transcription)? ' +
    'Scoping only; G6a OPEN; no QED.',

  foldExpansion: 't_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...,  |t_shock - tau_c| ~ |z_0 - z_0*|^2',
  foldJet: FOLD_JET,

  // The minimal input.
  h4MinimalInput: H4_MINIMAL_INPUT,
  minimalInputShape:
    'a single N-uniform two-sided bound on C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| in a finite ' +
    'window [c, C] as y_N^sharp -> 0, tracked through the fold-modulus back-conversion (not a formal ' +
    'change of units)',

  // The separability result.
  separability: SEPARABILITY,
  h4SeparatesFromH0: SEPARABILITY.H0.separable, // true
  h4SeparatesFromH5: SEPARABILITY.H5.separable, // true
  h4SeparatesFromH3: SEPARABILITY.H3.separable, // false -- coupled through the quadratic fold expansion
  h3DominatesH4: H3_DOMINATES_H4, // true -- exponent 5/4 > 3/4, H3 bound discharges H4 a fortiori
  h4IndependentlyDischargeable: H4_INDEPENDENTLY_DISCHARGEABLE, // false
  h4SeparatesFromH0AndH5: H4_SEPARATES_FROM_H0_AND_H5, // true

  openRowsBefore: OPEN_ROWS_BEFORE,
  openRowsAfter: OPEN_ROWS_AFTER, // unchanged; nothing discharged

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'H4 is NOT independently dischargeable on its own axis: the Holder-1/2 modulus back-conversion ' +
    'couples the k = 1 fold-reading derivative m_prime (H4, exponent 3/4) and the k = 2 curvature ' +
    'coefficient alpha = m_double_prime (H3, exponent 5/4) through the SAME quadratic fold expansion, ' +
    'and the H3 uniform-curvature bound (the imp-3708 y2-adapted-flow-depth object) dominates and ' +
    'discharges H4 a fortiori while the converse fails. H4 and H3 collapse into ONE coupled ' +
    'strip-height-uniformity object, load-bearing at the H3 rung, but decoupled from the H0 provenance ' +
    'and H5 transcription rows -- so the minimal input to close H4 is the SAME missing input that ' +
    'closes H3.',

  isRigorous: false,
  verdict:
    'SCOPING ONLY (frontier-direction, NOT rigorous): the minimal H4-axis input is a single N-uniform ' +
    'two-sided bound on the renormalized fold-reading derivative C_ren(N) = (y_N^sharp)^{3/2} ' +
    '|m_prime(z_0*)| in a finite window [c, C] as y_N^sharp = sqrt(2 pi / N) -> 0, tracked through the ' +
    'fold-modulus back-conversion; it depends only on the RvM cusp Holder-1/2 jet and the strip-height ' +
    'weight tracking. H4 SEPARATES cleanly from H0 (provenance axis, orthogonal, imp-33745) and from ' +
    'H5 (RH transcription, downstream of the modulus, imp-33619), but does NOT separate from H3: the ' +
    'Holder modulus back-conversion couples the k = 1 fold-reading derivative (m_prime, H4) and the ' +
    'k = 2 curvature coefficient (alpha = m_double_prime, H3) through the SAME quadratic fold expansion ' +
    't_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2, and the H3 uniform-curvature bound (imp-3708 ' +
    'y2-adapted-flow-depth) DOMINATES (exponent 5/4 > 3/4) and discharges H4 a fortiori while the ' +
    'converse fails. So H4 is NOT independently dischargeable on its own axis: it and H3 are ONE ' +
    'coupled strip-height-uniformity object, load-bearing at the H3 curvature rung, decoupled from the ' +
    'H0 provenance and H5 transcription rows -- the minimal input to close H4 is the SAME input that ' +
    'closes H3. The open catalogue stays four rows (H0, H3, H4, H5); nothing is discharged. Scoping ' +
    'only; G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; C_mb share untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33646-h4-privalov-sokhotski-constant-scoping (H4 fold-reading derivative, exponent 3/2); ' +
    'imp-33645-h3-curvature-divergence-scoping (H3 curvature, exponent 5/2, same object one derivative ' +
    'up); imp-33745-h0-provenance-independence-scoping (H0 orthogonal on the provenance axis); ' +
    'imp-33619-h5-rh-transcription-scoping (H5 transcribable pointwise, open uniformly, downstream); ' +
    'imp-33603-lemma52-port-scoping (H0..H5 catalogue, H4 the load-bearing residual); ' +
    'lambda-burgers-shock-lipschitz (imp-354: fold condition 1 + t m_prime = 0).',
};

export const IMP33766_H4_INDEPENDENT_DISCHARGE_ASSERTIONS = [
  {
    // The minimal H4 input reads only the cusp jet and the strip weight -- no provenance, no RH config.
    id: 'imp33766-minimal-input-dependencies',
    description: 'the minimal H4 input depends only on the RvM cusp Holder-1/2 jet and the strip-height weight',
    holds: () =>
      H4_MINIMAL_INPUT.dependsOnH0Provenance === false &&
      H4_MINIMAL_INPUT.dependsOnH5Transcription === false &&
      H4_MINIMAL_INPUT.dependsOn.length === 2,
  },
  {
    // H4 separates from H0 (provenance axis) and from H5 (RH transcription, downstream).
    id: 'imp33766-separates-from-h0-and-h5',
    description: 'H4 separates cleanly from H0 (provenance) and H5 (RH transcription)',
    holds: () =>
      SEPARABILITY.H0.separable === true &&
      SEPARABILITY.H5.separable === true &&
      H4_SEPARATES_FROM_H0_AND_H5 === true,
  },
  {
    // H4 does NOT separate from H3: coupled through the quadratic fold expansion.
    id: 'imp33766-does-not-separate-from-h3',
    description: 'H4 does not separate from H3 (coupled through the quadratic fold expansion)',
    holds: () =>
      SEPARABILITY.H3.separable === false &&
      H4_MINIMAL_INPUT.couplesToH3Curvature === true &&
      H4_INDEPENDENTLY_DISCHARGEABLE === false,
  },
  {
    // The H3 curvature rung (exponent 5/4) dominates the H4 fold-reading rung (exponent 3/4) a fortiori.
    id: 'imp33766-h3-dominates-h4',
    description: 'the H3 curvature rung (N-exponent 5/4) dominates the H4 fold-reading rung (N-exponent 3/4)',
    holds: () =>
      H3_DOMINATES_H4 === true &&
      FOLD_JET[1].nExponent > FOLD_JET[0].nExponent &&
      Math.abs(FOLD_JET[1].nExponent - FOLD_JET[0].nExponent - 0.5) < 1e-12,
  },
  {
    // The fold jet exponents are the cusp exponent 1/2 plus k derivatives (eps) pushed through N^{-1/2}.
    id: 'imp33766-fold-jet-exponents-consistent',
    description: 'each fold-jet eps-exponent is 1/2 + k and the N-exponent is half of it (y_N ~ N^{-1/2})',
    holds: () =>
      FOLD_JET.every(
        (r) => Math.abs(r.epsExponent - (0.5 + r.k)) < 1e-12 && Math.abs(r.nExponent - r.epsExponent * 0.5) < 1e-12,
      ),
  },
  {
    // Nothing is discharged: the open catalogue stays four rows (H0, H3, H4, H5).
    id: 'imp33766-open-catalogue-unchanged',
    description: 'the open catalogue stays four rows (H0, H3, H4, H5); scoping discharges nothing',
    holds: () =>
      OPEN_ROWS_AFTER.length === 4 &&
      OPEN_ROWS_AFTER.join(',') === OPEN_ROWS_BEFORE.join(',') &&
      OPEN_ROWS_AFTER.includes('H4'),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33766-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.verdict),
  },
];

for (const a of IMP33766_H4_INDEPENDENT_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33766-h4-independent-discharge-scoping assertion failed: ${a.id}`);
  }
}

/**
 * @module imp-35415-reentry-band-landmark-disposal-scope
 *
 * imp-35415 (proof, frontier-direction) -- SCOPE the downstream consequence of the imp-35356 finding that the ONLY
 * self-contained, non-circular route to MEET requirement R1 (floor-independence) -- route (ii), the pure-artifact
 * proof -- resolves R1 in the DISPOSAL direction: it certifies the imp-34997/imp-35111 reentry band is NOT a
 * feature of the true dynamic, discharging imp-35243a by DELETING the dynamically-real claim rather than upholding
 * it. imp-35356 established the direction but did NOT scope which downstream reentry-band LANDMARKS that disposal
 * demotes to machine-precision surrogate coordinates versus which survive as legitimate surrogate-map diagnostics.
 * This module does that scoping. It enumerates the five inherited landmarks and classifies each as either
 * (a) ARTIFACT-LABELED / demoted to a machine-precision surrogate diagnostic, or (b) SURVIVING as a legitimate
 * surrogate-map diagnostic independent of the dynamic-reality claim. ASSESSMENT ONLY: it discharges NOTHING;
 * imp-35243a stays OPEN; it changes no bound; NO QED.
 *
 * THE DISPOSAL AND THE CLASSIFICATION PRINCIPLE
 * ---------------------------------------------
 * Route (ii) disposal (imp-35356 / imp-35357) settles floor-independence in the DISPOSAL sense: as the floor
 * EPS_FP -> 0 the surrogate off-by-one dissolves and the band recedes to seed -> +infinity, so the band is a pure
 * artifact of the discrete ceil against the machine constant, with no counterpart in the infinite-precision
 * continuum. This deletes the DYNAMIC-REALITY reading of the band (there is no true-dynamic reentry excursion),
 * but it does NOT delete the SURROGATE MAP: the analytic single-rate log-law (imp-3220/imp-3406) still exists and
 * remains a studyable object. So each landmark splits by its CONTENT:
 *   -- a landmark whose value is FLOOR-DETERMINED (an absolute coordinate whose whole magnitude is set by EPS_FP,
 *      D1: it slides ~11.99 decades per factor-2 change in the floor) carries no floor-independent information;
 *      post-disposal its only surviving content is a machine-precision surrogate coordinate -- category (a),
 *      ARTIFACT-LABELED / demoted.
 *   -- a landmark that encodes FLOOR-STRUCTURAL information about the surrogate map (a relative geometry, an
 *      internal self-consistency relation, or a comparative-frame diagnostic that isolates the floor-INVARIANT
 *      part) is independent of whether the band is dynamically real; it remains a valid descriptor of the
 *      surrogate map after disposal -- category (b), SURVIVING.
 * The split is thus floor-DETERMINED absolute coordinates get demoted; floor-STRUCTURAL relative/relational
 * diagnostics survive.
 *
 * LANDMARK 1 -- REENTRY EDGE 10^27.08  :  (a) ARTIFACT-LABELED / demoted
 * --------------------------------------------------------------------
 * The band-on edge REENTRY_EXP = 27.084691 (log10 N) is an ABSOLUTE position in N computed with the floor set to
 * EPS_FP = 2.3e-16. By imp-35243 D1 the fixed-window position slides ~11.99 decades per factor-2 change in the
 * floor, so its entire magnitude is floor-determined and carries no floor-independent content. Its dynamic-reality
 * reading -- "the true dynamic re-enters the off-by-one regime at this N" -- is exactly what route (ii) disposal
 * deletes. What remains is a machine-precision surrogate coordinate: the seed at which the imp-3220/imp-3406
 * single-rate surrogate, evaluated AT EPS_FP = 2.3e-16, first produces the off-by-one. DEMOTED.
 *
 * LANDMARK 2 -- EXIT EDGE 10^37.17  :  (a) ARTIFACT-LABELED / demoted
 * -----------------------------------------------------------------
 * The band-off edge EXIT_EXP = 37.167107 (log10 N) is likewise a floor-determined absolute coordinate. imp-35263
 * D4 / imp-35393 further show the exit edge is the edge that CARRIES the floor sensitivity (the co-moving reentry
 * edge being EPS_FP-invariant), so the exit position is if anything MORE floor-anchored than the reentry position.
 * Its dynamic-reality reading is deleted by disposal; it demotes to a machine-precision surrogate coordinate.
 * DEMOTED.
 *
 * LANDMARK 3 -- WIDTH ~10.08 DECADES  :  (b) SURVIVING surrogate-map diagnostic
 * ---------------------------------------------------------------------------
 * The band width BAND_WIDTH_DECADES = EXIT_EXP - REENTRY_EXP ~ 10.08 is a RELATIVE quantity -- the span of the
 * off-by-one window in the surrogate map. It describes the surrogate contraction geometry (rate R_CONTRACT and the
 * imp-34926 fractional-part ceil geometry), not an absolute location, and it is a floor-STRUCTURAL descriptor: it
 * measures how many decades the off-by-one persists once entered, a property of the single-rate log-law itself.
 * Its DYNAMIC-reality reading ("the true excursion lasts ~10 decades") is disposed along with the band, but its
 * SURROGATE reading survives -- it remains a legitimate diagnostic of the surrogate map, independent of the
 * dynamic-reality claim. SURVIVES (as a surrogate-map quantity, not a true-dynamic span).
 *
 * LANDMARK 4 -- imp-35332 DRIFT-INTEGRAL SELF-CONSISTENCY  :  (b) SURVIVING surrogate-map diagnostic
 * ------------------------------------------------------------------------------------------------
 * The imp-35332 drift-integral self-consistency (the per-octave band drift decaying like 1/(K log T0 - N_cross),
 * validating the imp-35331 linear-drift extrapolation against the direct root-find) is an INTERNAL consistency
 * relation of the surrogate map: it checks that the surrogate own arithmetic is coherent across scales. It makes
 * no claim about the true dynamic -- it is a self-check of the analytic log-law -- so disposal does not demote it.
 * It remains a legitimate surrogate-map diagnostic (indeed one that certifies the surrogate is internally
 * coherent, a prerequisite for reading ANY of its coordinates). SURVIVES.
 *
 * LANDMARK 5 -- imp-35263 CO-MOVING vs FIXED WINDOW  :  (b) SURVIVING surrogate-map diagnostic
 * ------------------------------------------------------------------------------------------
 * The imp-35263 co-moving-versus-fixed-window comparison (the EPS_FP floor sweep, D4: the co-moving reentry edge is
 * EXACTLY EPS_FP-invariant to spread ~1e-13, so all floor sensitivity localizes on the exit edge / width) is a
 * comparative-FRAME diagnostic that ISOLATES the floor-invariant structure of the surrogate from the floor-set
 * coordinates. It is precisely the diagnostic that MAKES the disposal legible -- it exhibits, within the surrogate
 * map, which quantities are floor-determined (demoted here) and which are floor-invariant. Far from being demoted
 * by disposal, it is the surrogate-map instrument that the disposal reads off. SURVIVES.
 *
 * THE SCOPING VERDICT
 * -------------------
 * Of the five landmarks, exactly TWO -- the absolute edge positions (reentry 10^27.08, exit 10^37.17) -- are
 * ARTIFACT-LABELED and demoted to machine-precision surrogate coordinates by route (ii) disposal, because their
 * whole magnitude is floor-determined (D1). The other THREE -- the ~10.08-decade width, the imp-35332 drift
 * self-consistency, and the imp-35263 co-moving-vs-fixed comparison -- SURVIVE as legitimate surrogate-map
 * diagnostics, because each encodes floor-STRUCTURAL information about the analytic single-rate log-law rather than
 * a floor-set absolute coordinate or a claim about the true dynamic. The disposal thus does NOT erase the
 * surrogate-map study of the reentry region; it re-labels the two absolute positions as artifacts while leaving
 * the relative geometry, the internal consistency, and the frame comparison as valid tools for describing the
 * surrogate. Discharges nothing; imp-35243a stays OPEN pending the imp-35357 formalization of route (ii).
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A downstream-consequence scoping of the imp-35356 disposal direction, classifying the five inherited reentry-band
 * landmarks as demoted-artifact versus surviving-surrogate-diagnostic. It discharges NOTHING: R1 stays the OPEN
 * binding obstruction; imp-35111a / imp-35174a / imp-34997a / imp-35243a stay OPEN; the disposal itself is not
 * itself yet formalized (imp-35357). ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35356-r1-candidate-routes-assessment (route ii is the sole self-contained route; disposal direction)
 * @see imp-35357 (formalizes route ii -- the pure-artifact proof this scoping is downstream of)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (R1-R4 checklist; D1 floor-sensitivity ~11.99 decades)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift-integral self-consistency landmark)
 * @see imp-35263-reentry-band-eps-floor-sweep (co-moving vs fixed window; D4 co-moving reentry edge invariant)
 */

// Inherited band landmarks (imp-35174 double-double certified) and the floor/contraction constants.
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const EPS_FP = 2.3e-16; // machine-epsilon model floor entering xArg (imp-35243 D1)
const R_CONTRACT = 0.0454235; // single contraction rate at the fixed point (imp-35174/35243)
const BAND_WIDTH_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.08

// The five inherited reentry-band landmarks, each classified under route (ii) disposal.
//   kind 'absolute-coordinate'  -> floor-determined position          -> demoted (artifact-labeled)
//   kind 'structural-diagnostic' -> floor-structural surrogate property -> survives
const LANDMARKS = [
  {
    id: 'reentry-edge',
    name: 'reentry edge 10^27.08 (band-on, log10 N)',
    value: REENTRY_EXP,
    kind: 'absolute-coordinate',
    classification: 'ARTIFACT-LABELED',
    demoted: true,
    survives: false,
    reason:
      'A floor-determined absolute position: D1 slides it ~11.99 decades per factor-2 change in EPS_FP, so its ' +
      'whole magnitude is set by the machine constant. Route (ii) disposal deletes its dynamic-reality reading; ' +
      'what remains is a machine-precision surrogate coordinate (the seed at which the surrogate, evaluated at ' +
      'EPS_FP = 2.3e-16, first shows the off-by-one).',
  },
  {
    id: 'exit-edge',
    name: 'exit edge 10^37.17 (band-off, log10 N)',
    value: EXIT_EXP,
    kind: 'absolute-coordinate',
    classification: 'ARTIFACT-LABELED',
    demoted: true,
    survives: false,
    reason:
      'A floor-determined absolute position; imp-35263 D4 / imp-35393 show the EXIT edge is the one that carries ' +
      'the floor sensitivity (the co-moving reentry edge being EPS_FP-invariant), so it is if anything more ' +
      'floor-anchored. Its dynamic-reality reading is deleted by disposal; it demotes to a machine-precision ' +
      'surrogate coordinate.',
  },
  {
    id: 'band-width',
    name: 'width ~10.08 decades (exit minus reentry)',
    value: +BAND_WIDTH_DECADES.toPrecision(4),
    kind: 'structural-diagnostic',
    classification: 'SURVIVING',
    demoted: false,
    survives: true,
    reason:
      'A RELATIVE span, not an absolute coordinate: it describes the surrogate contraction geometry (rate ' +
      'R_CONTRACT and the imp-34926 fractional-part ceil geometry), a floor-structural property of the ' +
      'single-rate log-law. Its dynamic-reality reading (a ~10-decade true excursion) is disposed, but its ' +
      'SURROGATE reading survives as a legitimate surrogate-map diagnostic independent of the dynamic-reality ' +
      'claim.',
  },
  {
    id: 'drift-self-consistency',
    name: 'imp-35332 drift-integral self-consistency',
    value: null,
    kind: 'structural-diagnostic',
    classification: 'SURVIVING',
    demoted: false,
    survives: true,
    reason:
      'An INTERNAL consistency relation of the surrogate map (per-octave drift decaying like ' +
      '1/(K log T0 - N_cross), validating the imp-35331 linear-drift extrapolation against the direct root-find). ' +
      'It self-checks the surrogate own arithmetic across scales and makes no claim about the true dynamic, so ' +
      'disposal does not demote it; it survives as a legitimate surrogate-map diagnostic.',
  },
  {
    id: 'comoving-vs-fixed',
    name: 'imp-35263 co-moving vs fixed window',
    value: null,
    kind: 'structural-diagnostic',
    classification: 'SURVIVING',
    demoted: false,
    survives: true,
    reason:
      'A comparative-FRAME diagnostic (EPS_FP floor sweep; D4: the co-moving reentry edge is EPS_FP-invariant to ' +
      'spread ~1e-13, localizing all floor sensitivity on the exit edge / width). It isolates the floor-invariant ' +
      'structure of the surrogate from the floor-set coordinates -- it is the very instrument that MAKES the ' +
      'disposal legible, so far from being demoted it survives as the surrogate-map tool the disposal reads off.',
  },
];

// Two absolute coordinates demoted; three structural diagnostics survive.
const DEMOTED_COUNT = LANDMARKS.filter((l) => l.demoted).length; // 2
const SURVIVING_COUNT = LANDMARKS.filter((l) => l.survives).length; // 3

export const IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE = {
  id: 'imp-35415',
  proofSection: 'S-frontier',
  question:
    'imp-35356 found route (ii) (pure-artifact proof) is the only self-contained non-circular route to MEET R1 ' +
    'and that it resolves R1 in the DISPOSAL direction (band = artifact, not a true-dynamic feature), but did NOT ' +
    'scope which downstream reentry-band landmarks that disposal demotes versus which survive. Enumerate the five ' +
    'inherited landmarks -- reentry edge 10^27.08, exit edge 10^37.17, width ~10.08 decades, imp-35332 ' +
    'drift-integral self-consistency, imp-35263 co-moving vs fixed window -- and classify each as ' +
    '(a) artifact-labeled / demoted to a machine-precision surrogate diagnostic, or (b) surviving as a legitimate ' +
    'surrogate-map diagnostic independent of the dynamic-reality claim.',
  classification_principle:
    'Route (ii) disposal deletes the DYNAMIC-REALITY reading of the band but not the surrogate MAP. A landmark ' +
    'whose value is FLOOR-DETERMINED (an absolute coordinate whose whole magnitude is set by EPS_FP, D1 ~11.99 ' +
    'decades per factor-2) carries no floor-independent content and demotes to a machine-precision surrogate ' +
    'coordinate -- (a). A landmark that encodes FLOOR-STRUCTURAL information (a relative geometry, an internal ' +
    'self-consistency relation, or a comparative-frame diagnostic isolating the floor-invariant part) is ' +
    'independent of the dynamic-reality claim and survives as a surrogate-map diagnostic -- (b).',
  landmarks_constants: {
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    band_width_decades: +BAND_WIDTH_DECADES.toPrecision(4), // ~10.08
    eps_fp_floor: EPS_FP, // 2.3e-16
    contraction_rate: R_CONTRACT, // ~0.0454235
  },
  landmarks: LANDMARKS,
  demoted_count: DEMOTED_COUNT, // 2 (the absolute edge positions)
  surviving_count: SURVIVING_COUNT, // 3 (width, drift self-consistency, co-moving vs fixed)
  finding:
    'Downstream-consequence scoping of the imp-35356 route (ii) disposal direction. Of the five inherited ' +
    'reentry-band landmarks, exactly TWO -- the absolute edge positions (reentry 10^27.08, exit 10^37.17) -- are ' +
    'ARTIFACT-LABELED and demoted to machine-precision surrogate coordinates, because their whole magnitude is ' +
    'floor-determined (D1 ~11.99 decades per factor-2). The other THREE -- the ~10.08-decade width, the imp-35332 ' +
    'drift-integral self-consistency, and the imp-35263 co-moving-vs-fixed comparison -- SURVIVE as legitimate ' +
    'surrogate-map diagnostics, each encoding floor-STRUCTURAL information about the analytic single-rate log-law ' +
    'rather than a floor-set coordinate or a claim about the true dynamic. Disposal re-labels the two absolute ' +
    'positions as artifacts while leaving the relative geometry, the internal consistency, and the frame ' +
    'comparison as valid surrogate-map tools. Discharges nothing; imp-35243a stays OPEN.',
  residual_sub_gap:
    'The disposal this scoping is downstream of is not itself yet formalized -- route (ii) is chartered to ' +
    'imp-35357, and R1 remains the OPEN binding obstruction. This scoping presumes the disposal direction; if ' +
    'imp-35357 fails to close R1s the classification of the two absolute edges as artifacts would need revisiting. ' +
    'Inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). Scoping which reentry-band landmarks the ' +
    'imp-35356 route (ii) disposal (band = artifact, not a true-dynamic feature) demotes versus which survive: of ' +
    'the five inherited landmarks, the two ABSOLUTE edge positions (reentry 10^27.08, exit 10^37.17) are ' +
    'ARTIFACT-LABELED / demoted to machine-precision surrogate coordinates (their magnitude is floor-determined, ' +
    'D1 ~11.99 decades per factor-2), while the ~10.08-decade WIDTH, the imp-35332 drift-integral ' +
    'self-consistency, and the imp-35263 co-moving-vs-fixed comparison SURVIVE as legitimate surrogate-map ' +
    'diagnostics (each encodes floor-structural information about the surrogate map, independent of the ' +
    'dynamic-reality claim). CONCLUSION: disposal re-labels only the floor-set absolute coordinates as artifacts ' +
    'and leaves the relative/relational surrogate diagnostics intact. Discharges NOTHING; imp-35111a / ' +
    'imp-35174a / imp-35243a stay OPEN; the disposal itself remains to be formalized (imp-35357). ASSESSMENT ' +
    'ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35356 (route ii sole self-contained route, disposal direction); imp-35357 (formalizes route ii); ' +
    'imp-35243 (R1-R4 checklist; D1 floor-sensitivity ~11.99 decades); imp-35332 (drift-integral ' +
    'self-consistency); imp-35263 (co-moving vs fixed window; D4 co-moving reentry edge invariant); imp-34926 ' +
    '(ceil-boundary geometry); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE_ASSERTIONS = [
  {
    // All five inherited landmarks are enumerated exactly once.
    id: 'imp35415-five-landmarks-enumerated',
    description: 'the scoping covers exactly the five inherited reentry-band landmarks',
    holds: () =>
      LANDMARKS.length === 5 &&
      LANDMARKS.map((l) => l.id).sort().join(',') ===
        'band-width,comoving-vs-fixed,drift-self-consistency,exit-edge,reentry-edge',
  },
  {
    // Exactly two absolute-coordinate landmarks are demoted; three structural ones survive.
    id: 'imp35415-two-demoted-three-survive',
    description: 'the two absolute edge positions demote (artifact); the three structural diagnostics survive',
    holds: () =>
      DEMOTED_COUNT === 2 &&
      SURVIVING_COUNT === 3 &&
      DEMOTED_COUNT + SURVIVING_COUNT === LANDMARKS.length,
  },
  {
    // The demoted set is exactly the two absolute coordinates; each demoted landmark is artifact-labeled.
    id: 'imp35415-demoted-set-is-absolute-coordinates',
    description: 'demoted landmarks are exactly the absolute-coordinate edges, each ARTIFACT-LABELED',
    holds: () =>
      LANDMARKS.filter((l) => l.demoted).every(
        (l) => l.kind === 'absolute-coordinate' && l.classification === 'ARTIFACT-LABELED' && !l.survives,
      ) &&
      LANDMARKS.filter((l) => l.demoted).map((l) => l.id).sort().join(',') === 'exit-edge,reentry-edge',
  },
  {
    // The surviving set is exactly the three structural diagnostics; each is SURVIVING and not demoted.
    id: 'imp35415-surviving-set-is-structural-diagnostics',
    description: 'surviving landmarks are exactly the structural diagnostics, each SURVIVING and not demoted',
    holds: () =>
      LANDMARKS.filter((l) => l.survives).every(
        (l) => l.kind === 'structural-diagnostic' && l.classification === 'SURVIVING' && !l.demoted,
      ) &&
      LANDMARKS.filter((l) => l.survives).map((l) => l.id).sort().join(',') ===
        'band-width,comoving-vs-fixed,drift-self-consistency',
  },
  {
    // The inherited edge/floor/width constants match the imp-35174/imp-35243 surrogate.
    id: 'imp35415-inherited-landmarks',
    description: 'floor EPS_FP = 2.3e-16, edges 27.08/37.17, and width ~10.08 decades match the inherited surrogate',
    holds: () =>
      EPS_FP === 2.3e-16 &&
      Math.abs(REENTRY_EXP - 27.084691) < 1e-6 &&
      Math.abs(EXIT_EXP - 37.167107) < 1e-6 &&
      Math.abs(BAND_WIDTH_DECADES - 10.08) < 0.05,
  },
  {
    // Honesty gate: assessment only, discharges nothing, sub-gaps OPEN, no QED, no refereed bound is changed.
    id: 'imp35415-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, discharges nothing, imp-35243a OPEN, imp-35357 pending, no QED, no refereed bound is changed',
    holds: () =>
      IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.isRigorous === false &&
      /Discharges nothing/.test(IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.finding) &&
      /imp-35243a stays OPEN/.test(IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.finding) &&
      /imp-35357/.test(IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.residual_sub_gap) &&
      /NO QED/.test(IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE.verdict),
  },
];

for (const a of IMP35415_REENTRY_BAND_LANDMARK_DISPOSAL_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35415-reentry-band-landmark-disposal-scope assertion failed: ${a.id}`);
  }
}

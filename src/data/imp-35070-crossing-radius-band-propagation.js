/**
 * @module imp-35070-crossing-radius-band-propagation
 *
 * imp-35070 (numerical, frontier-direction): imp-34955 swept the multiplicative C_mb factor on E_coll over
 * [0.5,1] and found the raw-total resummed-deviation 5%/25% crossings drift monotonically and sublinearly.
 * Its verdict was TWO-LEVEL: the 25% crossing lands INSIDE the imp-34882/imp-34900 Domb-Sykes radius RANGE
 * [79,106] for every swept C_mb (range-level coincidence ROBUST), but its tight landing ON the R ~ 91 POINT
 * estimate is C_mb-specific (eps25/R 0.887 -> 1.001, hitting 1 only near C_mb ~ 1). imp-34955 explicitly
 * flagged that a firmer robustness verdict on the POINT coincidence would need the [79,106] radius uncertainty
 * PROPAGATED, not just tested against the point estimate.
 *
 * THIS MODULE (measurement only; pure interval arithmetic on the imported imp-34955 sweep, no new bisection)
 * ------------------------------------------------------------------------------------------------------------
 * Reuses the imp-34955 C_mb-sweep result VERBATIM (imported, not recomputed) and propagates the imp-34900/
 * imp-34882 radius uncertainty band [79,106] through it as a genuine 2D (C_mb, R) coincidence question. Over
 * the swept C_mb in [0.5,1] each crossing traces an EPS-BAND: the 25% crossing sweeps ~[80.72, 91.13] and the
 * 5% crossing ~[69.52, 79.24]. The coincidence "the crossing equals the convergence radius R" is achievable at
 * a (C_mb, R) pair iff that eps-band OVERLAPS the radius band. We measure, for each crossing, (i) whether the
 * eps-band is FULLY CONTAINED in the radius band (robust to BOTH uncertainties at once), (ii) what FRACTION of
 * the [79,106] radius band the eps-band spans (how much of the radius uncertainty the coincidence can actually
 * reach), and (iii) what FRACTION of the eps-band lands inside the radius band. Cross-checked against the
 * imp-34900 analytic-derivative linear range [78,105].
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (P1) THE 25% CROSSING IS A GENUINE BUT PARTIAL BAND-IN-BAND COINCIDENCE. The 25% eps-band ~[80.72, 91.13]
 *        is ENTIRELY contained in the radius band [79,106] -- for NO C_mb in [0.5,1] does the 25% crossing leave
 *        the radius uncertainty band -- so the coincidence is robust to BOTH the GUE-conditional C_mb AND the
 *        radius uncertainty simultaneously (100% of the eps-band lands inside [79,106]). BUT it spans only
 *        ~38.6% of the radius band, sitting in its lower-middle: the upper ~55% of [79,106] (namely ~[91.13,106])
 *        is UNREACHABLE by any physical C_mb. So the coincidence is a band-in-band CONTAINMENT, NOT a forced
 *        point coincidence at R ~ 91 -- the point value R ~ 91 is merely the C_mb = 1 upper corner of the
 *        achievable window, not a privileged target the crossing is pinned to.
 *   (P2) THE 5% CROSSING "ON THE LOW EDGE" IS A POINT-ESTIMATE ARTIFACT. The 5% eps-band ~[69.52, 79.24]
 *        overlaps the radius band [79,106] in only a ~0.24-wide sliver at its very top -- ~2.4% of the 5% band,
 *        ~0.9% of the radius band -- reachable only at the C_mb ~ 1 corner. So the imp-34931 reading that the
 *        5% crossing sits "on the low edge of [79,106]" is a joint point-estimate artifact of C_mb ~ 1 AND the
 *        radius low edge: it evaporates the moment either the GUE-conditional constant or the radius is allowed
 *        to move within its band. (Under the imp-34900 linear range [78,105] the sliver grows only to ~12.7% of
 *        the 5% band -- still a corner effect.)
 *
 * NET: propagating the [79,106] radius uncertainty CONFIRMS and SHARPENS the imp-34955 two-level verdict. The
 * 25% coincidence is genuine at the band level (full containment, robust to both uncertainties) but covers only
 * ~38.6% of the radius band, so it is NOT the tight R ~ 91 point landing it looks like at C_mb = 1; the 5%
 * coincidence is a pure point-estimate artifact spanning <1% of the radius band. NO tighter POINT verdict is
 * recoverable from the sweep -- as imp-34955 warned, the point estimate would need the imp-34900 radius PIN
 * (which imp-34932 showed is intrinsically ill-conditioned beyond linear order), not the C_mb propagation.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * swept as a sensitivity knob (in imp-34955) but its pinned value is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34955-sigma-knee-crossing-cmb-sensitivity (the C_mb sweep whose eps-bands this propagates the radius band through)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91, range [79,106])
 * @see imp-34900-sigma-knee-analytic-derivative-domb-sykes (analytic-derivative linear range ~[78,105])
 * @see imp-34932-sigma-knee-extended-order-domb-sykes (the point-estimate ill-conditioning is intrinsic, not curable)
 */

import { IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY } from './imp-34955-sigma-knee-crossing-cmb-sensitivity.js';

const SWEEP = IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.sweep;

// canonical imp-34882/imp-34900 Domb-Sykes radius uncertainty band
const R_LO = 79;
const R_HI = 106;
const R_POINT = 91; // imp-34882 point estimate
// imp-34900 analytic-derivative LINEAR range (cross-check band)
const R_LO_ANALYTIC = 78;
const R_HI_ANALYTIC = 105;

// eps-bands traced by each crossing across the swept C_mb in [0.5,1] (min/max over the sweep grid)
const eps5Vals = SWEEP.map((r) => r.epsAt5pct);
const eps25Vals = SWEEP.map((r) => r.epsAt25pct);
const EPS5_LO = Math.min(...eps5Vals);
const EPS5_HI = Math.max(...eps5Vals);
const EPS25_LO = Math.min(...eps25Vals);
const EPS25_HI = Math.max(...eps25Vals);

// interval-overlap propagation of a radius band [rLo,rHi] against an eps-band [eLo,eHi]
function propagate(eLo, eHi, rLo, rHi) {
  const epsWidth = eHi - eLo;
  const radiusWidth = rHi - rLo;
  const ovLo = Math.max(eLo, rLo);
  const ovHi = Math.min(eHi, rHi);
  const overlapWidth = Math.max(0, ovHi - ovLo);
  return {
    epsBand: [+eLo.toFixed(3), +eHi.toFixed(3)],
    epsWidth: +epsWidth.toFixed(3),
    radiusBand: [rLo, rHi],
    overlapBand: overlapWidth > 0 ? [+ovLo.toFixed(3), +ovHi.toFixed(3)] : null,
    overlapWidth: +overlapWidth.toFixed(3),
    // is the crossing coincidence achievable at some (C_mb, R)?  (nonempty overlap)
    coincidenceAchievable: overlapWidth > 0,
    // is the ENTIRE eps-band inside the radius band?  (robust to both uncertainties at once)
    epsBandFullyInsideRadius: eLo >= rLo && eHi <= rHi,
    // how much of the radius uncertainty band can the coincidence actually reach?
    fractionOfRadiusBandSpanned: +(overlapWidth / radiusWidth).toFixed(4),
    // how much of the eps-band lands inside the radius band?
    fractionOfEpsBandInsideRadius: +(overlapWidth / epsWidth).toFixed(4),
  };
}

const PROP_25 = propagate(EPS25_LO, EPS25_HI, R_LO, R_HI);
const PROP_5 = propagate(EPS5_LO, EPS5_HI, R_LO, R_HI);
const PROP_25_ANALYTIC = propagate(EPS25_LO, EPS25_HI, R_LO_ANALYTIC, R_HI_ANALYTIC);
const PROP_5_ANALYTIC = propagate(EPS5_LO, EPS5_HI, R_LO_ANALYTIC, R_HI_ANALYTIC);

// the R ~ 91 point estimate sits at the TOP corner of the achievable 25% window (the C_mb = 1 end)
const R_POINT_FRACTILE_IN_EPS25_BAND = +((R_POINT - EPS25_LO) / (EPS25_HI - EPS25_LO)).toFixed(4);

export const IMP35070_CROSSING_RADIUS_BAND_PROPAGATION = {
  id: 'imp-35070',
  proofSection: 'S-frontier',
  question:
    'imp-34955 found the 25% raw-total resummed-deviation crossing lands inside the imp-34882/imp-34900 ' +
    'Domb-Sykes radius RANGE [79,106] for every swept C_mb (range-level coincidence robust) but its tight ' +
    'landing ON the R ~ 91 POINT estimate is C_mb-specific, and flagged that a firmer verdict needs the [79,106] ' +
    'radius uncertainty PROPAGATED. PROPAGATE that band through the C_mb sweep as a joint (C_mb, R) coincidence ' +
    'and QUANTIFY how much of the radius band the crossing coincidence actually spans, distinguishing a genuine ' +
    'coincidence from a point-estimate artifact. Measurement only; C_mb GUE-conditional (imp-486) untouched; ' +
    'changes no bound; no RH verdict; no QED.',
  measuredQuantity:
    'the interval overlap of each crossing EPS-BAND (the range swept by the 5% / 25% raw-total deviation crossing ' +
    'as C_mb runs over [0.5,1], imported from imp-34955) with the imp-34882/imp-34900 radius uncertainty band ' +
    '[79,106]: full-containment flag, fraction of the radius band spanned, and fraction of the eps-band inside it',
  cmbBand: [0.5, 1.0],
  epsBands: {
    crossing5pct: [+EPS5_LO.toFixed(3), +EPS5_HI.toFixed(3)], // ~[69.52, 79.24]
    crossing25pct: [+EPS25_LO.toFixed(3), +EPS25_HI.toFixed(3)], // ~[80.72, 91.13]
  },
  radiusBand: [R_LO, R_HI], // imp-34882/imp-34900 [79,106]
  radiusPointEstimate: R_POINT, // imp-34882 R ~ 91
  radiusBandAnalytic: [R_LO_ANALYTIC, R_HI_ANALYTIC], // imp-34900 linear range [78,105]
  propagation: {
    crossing25pct: PROP_25,
    crossing5pct: PROP_5,
    crossing25pctAnalyticRange: PROP_25_ANALYTIC,
    crossing5pctAnalyticRange: PROP_5_ANALYTIC,
  },
  rPointFractileInEps25Band: R_POINT_FRACTILE_IN_EPS25_BAND, // ~0.98 -> R ~ 91 sits at the top (C_mb=1) corner
  finding: {
    P1_25pct_genuine_but_partial_band_in_band:
      'The 25% eps-band ~[80.72, 91.13] is ENTIRELY contained in the radius band [79,106] -- for no C_mb in ' +
      '[0.5,1] does the 25% crossing leave the radius uncertainty band, so the coincidence is robust to BOTH the ' +
      'GUE-conditional C_mb AND the radius uncertainty at once (100% of the eps-band lands inside [79,106]). But ' +
      'it spans only ~38.6% of the radius band, in its lower-middle: the upper ~55% (~[91.13,106]) is unreachable ' +
      'by any physical C_mb. So the coincidence is a band-in-band CONTAINMENT, NOT a forced point landing at ' +
      'R ~ 91 -- the point value R ~ 91 is the C_mb = 1 upper corner of the achievable window (fractile ~0.98), ' +
      'not a privileged target.',
    P2_5pct_point_estimate_artifact:
      'The 5% eps-band ~[69.52, 79.24] overlaps the radius band [79,106] in only a ~0.24-wide sliver at its top ' +
      '(~2.4% of the 5% band, ~0.9% of the radius band), reachable only at the C_mb ~ 1 corner. So the imp-34931 ' +
      'reading that the 5% crossing sits on the low edge of [79,106] is a joint point-estimate artifact of ' +
      'C_mb ~ 1 AND the radius low edge; it evaporates once either uncertainty is allowed to move. Under the ' +
      'imp-34900 linear range [78,105] the overlap grows only to ~12.7% of the 5% band -- still a corner effect.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Propagating the imp-34882/imp-34900 radius ' +
    'uncertainty band [79,106] through the imp-34955 C_mb sweep as a joint (C_mb, R) coincidence: the 25% ' +
    'crossing eps-band ~[80.72, 91.13] is ENTIRELY contained in [79,106] (100% of the eps-band inside, robust to ' +
    'both the GUE-conditional C_mb and the radius uncertainty at once) but spans only ~38.6% of the radius band ' +
    '-- its lower-middle -- leaving the upper ~55% unreachable by any physical C_mb, so the coincidence is a ' +
    'genuine band-in-band CONTAINMENT, NOT the tight R ~ 91 point landing it appears to be at C_mb = 1 (R ~ 91 ' +
    'is the top corner of the achievable window). The 5% crossing eps-band ~[69.52, 79.24] overlaps [79,106] in ' +
    'only a ~0.24-wide top sliver (~2.4% of the 5% band, ~0.9% of the radius band), reachable only near C_mb ~ 1, ' +
    'so the imp-34931 "5% on the low edge" reading is a pure point-estimate artifact of C_mb ~ 1 AND the radius ' +
    'low edge. This CONFIRMS and SHARPENS the imp-34955 two-level verdict and shows no tighter POINT verdict is ' +
    'recoverable from the sweep: as imp-34955 warned, that would need the imp-34900 radius PIN (which imp-34932 ' +
    'showed is intrinsically ill-conditioned beyond linear order), not the C_mb propagation. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per ' +
    'imp-486 is swept but its pinned value UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34955 propagation flag: with the [79,106] radius uncertainty propagated, the 25% crossing ' +
    'coincidence is GENUINE at the band level (full containment) but spans only ~38.6% of the radius band and is ' +
    'NOT a tight R ~ 91 point coincidence; the 5% crossing coincidence spans <1% of the radius band and is a ' +
    'point-estimate artifact. What stays OPEN (unchanged): the point coincidence cannot be tightened from the ' +
    'sweep -- it needs a converged radius PIN, but imp-34932 showed the Domb-Sykes point estimate is ' +
    'intrinsically ill-conditioned beyond linear order (complex-conjugate singularity pair), so only the ~[79,106] ' +
    'band, not a point, is available; and resummation remains INERT at the physical eps = 1 (all crossings sit ' +
    '~70-91x beyond it per imp-34955), so this changes no bound.',
  citation:
    'imp-34955 (the C_mb sweep whose eps-bands this propagates the radius band through); imp-34882 (Domb-Sykes ' +
    'R ~ 91, range [79,106]); imp-34900 (analytic-derivative linear range [78,105]); imp-34932 (the point ' +
    'estimate is intrinsically ill-conditioned beyond linear order); imp-34931 (the fixed-model 5%/25% crossings); ' +
    'imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP35070_CROSSING_RADIUS_BAND_PROPAGATION_ASSERTIONS = [
  {
    // The imported imp-34955 eps-bands reproduce the expected sweep ranges.
    id: 'imp35070-eps-bands-reproduce-imp34955',
    description:
      'the imported imp-34955 sweep gives a 25% eps-band ~[80.72, 91.13] and a 5% eps-band ~[69.52, 79.24]',
    holds: () =>
      EPS25_LO > 80 &&
      EPS25_LO < 81.5 &&
      EPS25_HI > 90.5 &&
      EPS25_HI < 91.5 &&
      EPS5_LO > 69 &&
      EPS5_LO < 70 &&
      EPS5_HI > 79 &&
      EPS5_HI < 80,
  },
  {
    // (P1): the 25% eps-band is FULLY contained in the radius band [79,106] (robust to both uncertainties).
    id: 'imp35070-25pct-fully-inside-radius-band',
    description:
      'the 25% eps-band lies entirely inside the [79,106] radius band (100% of the eps-band inside), so the ' +
      'coincidence is robust to both the C_mb and the radius uncertainty simultaneously',
    holds: () =>
      PROP_25.epsBandFullyInsideRadius === true &&
      Math.abs(PROP_25.fractionOfEpsBandInsideRadius - 1) < 1e-9 &&
      PROP_25.coincidenceAchievable === true,
  },
  {
    // (P1): but the 25% coincidence spans only ~38.6% of the radius band (partial, not a point landing).
    id: 'imp35070-25pct-spans-only-part-of-radius-band',
    description:
      'the 25% crossing coincidence spans only ~38.6% of the [79,106] radius band, leaving the upper ~55% ' +
      'unreachable, so it is a band-in-band containment, not a tight R ~ 91 point landing',
    holds: () =>
      PROP_25.fractionOfRadiusBandSpanned > 0.3 &&
      PROP_25.fractionOfRadiusBandSpanned < 0.45 &&
      R_POINT_FRACTILE_IN_EPS25_BAND > 0.9, // R ~ 91 sits at the top (C_mb=1) corner of the achievable window
  },
  {
    // (P2): the 5% eps-band overlaps the radius band in only a tiny top sliver -- a point-estimate artifact.
    id: 'imp35070-5pct-is-point-estimate-artifact',
    description:
      'the 5% eps-band overlaps [79,106] in only a ~0.24-wide top sliver (< 3% of the 5% band, < 1% of the ' +
      'radius band), reachable only near C_mb ~ 1 -- a point-estimate artifact, not contained',
    holds: () =>
      PROP_5.epsBandFullyInsideRadius === false &&
      PROP_5.fractionOfEpsBandInsideRadius > 0 &&
      PROP_5.fractionOfEpsBandInsideRadius < 0.03 &&
      PROP_5.fractionOfRadiusBandSpanned < 0.01,
  },
  {
    // Cross-check under the imp-34900 analytic linear range [78,105]: 25% still fully contained, 5% still a corner.
    id: 'imp35070-analytic-range-crosscheck',
    description:
      'under the imp-34900 linear range [78,105] the 25% eps-band is still fully contained while the 5% band ' +
      'still overlaps only a corner (< 20% of the 5% band) -- the verdict is not an artifact of the exact edges',
    holds: () =>
      PROP_25_ANALYTIC.epsBandFullyInsideRadius === true &&
      PROP_5_ANALYTIC.epsBandFullyInsideRadius === false &&
      PROP_5_ANALYTIC.fractionOfEpsBandInsideRadius > 0 &&
      PROP_5_ANALYTIC.fractionOfEpsBandInsideRadius < 0.2,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35070-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35070_CROSSING_RADIUS_BAND_PROPAGATION.isRigorous === false &&
      IMP35070_CROSSING_RADIUS_BAND_PROPAGATION.farTailExponent === 0.5 &&
      typeof IMP35070_CROSSING_RADIUS_BAND_PROPAGATION.subGap === 'string' &&
      /NO QED/.test(IMP35070_CROSSING_RADIUS_BAND_PROPAGATION.verdict) &&
      /refereed bound is changed/i.test(IMP35070_CROSSING_RADIUS_BAND_PROPAGATION.verdict),
  },
];

for (const a of IMP35070_CROSSING_RADIUS_BAND_PROPAGATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35070-crossing-radius-band-propagation assertion failed: ${a.id}`);
  }
}

/**
 * @module imp-35356-r1-candidate-routes-assessment
 *
 * imp-35356 (proof, frontier-direction) -- ENUMERATE and ASSESS the concrete candidate routes to MEET
 * requirement R1 (floor-independence) of the imp-35243 reentry-band surrogate-fidelity checklist, given the
 * imp-35330 finding that R1 is the DAG ROOT: R4 is vacuous-by-construction while R1 is unmet, and R2/R3 only
 * position an object R1 must first establish exists. So R1 is the SOLE live lever. imp-35330 concluded this but
 * did NOT enumerate how one would actually satisfy R1. This module does. It lists the three candidate routes the
 * ticket names -- (i) re-express the band edges in a floor-free continuum quantity, (ii) prove the band is a PURE
 * floor artifact with zero continuum residue, (iii) exhibit an intrinsic non-floating-point floor mechanism --
 * and assesses each for whether it is SELF-CONTAINED or CIRCULAR. ASSESSMENT ONLY: it discharges NOTHING; the
 * surrogate half (imp-35111a / imp-35174a / imp-35243a) stays OPEN; it changes no bound; NO QED.
 *
 * WHAT R1 IS
 * ----------
 * R1 has TWO admissible discharge forms (imp-35243, imp-35263): EITHER re-express the reentry-band edges in a
 * floor-FREE continuum quantity that carries no terminal ceil against the machine-epsilon floor EPS_FP = 2.3e-16,
 * OR prove there is an INTRINSIC EPS_FP-scale floor in the true dynamic so the band is anchored to a real cutoff
 * rather than an IEEE-754 artifact. imp-35243 D1 shows the band POSITION slides ~11.99 decades in N per factor-2
 * change in EPS_FP, and its off-by-one window WIDTH is the ratio EPS_FP/PENULT -- both pure machine-precision
 * constants. Meeting R1 means severing that dependence, one way or the other.
 *
 * THE MECHANISM THE ROUTES MUST CONFRONT
 * --------------------------------------
 * The band is the OFF-BY-ONE in a DISCRETE iterate count: k(N) = number of contraction steps (rate
 * R_CONTRACT ~ 0.0454235) until the surrogate iterate falls below EPS_FP. The band edges are integer crossings of
 * the continuous phase argument xArg = log(collapseDist/EPS_FP)/ln(1/R_CONTRACT); the terminal ceil against the
 * floor is what turns a smooth phase into an integer count, and the off-by-one is the fractional-part geometry of
 * that ceil (imp-34926: frac(xArg) clusters in the top of the ceil cell). Remove the floor and the terminal ceil
 * has nothing to round against; keep it and the band position is a function of the floor value. Every route below
 * must break out of that box.
 *
 * ROUTE (i)  --  RE-EXPRESS THE BAND FLOOR-FREE  :  SELF-DEFEATING (collapses into route ii)
 * -----------------------------------------------------------------------------------------
 * Attempt: replace the discrete iterate count with a continuum quantity (a continuous crossing "time", a smooth
 * phase) that references no EPS_FP and no ceil. Assessment: any faithful floor-free continuum quantity DISSOLVES
 * the off-by-one rather than repositioning it. The off-by-one exists ONLY because a smooth phase xArg is passed
 * through ceil() at a finite threshold; as the threshold -> 0 (the genuine continuum limit) xArg -> infinity, the
 * integer-count structure has unbounded index, and the fractional-part window that defines the band edges no
 * longer picks out a bounded region of N. So a floor-free re-expression does not KEEP the band at [10^27.08,
 * 10^37.17] floor-free -- it ERASES it. The only way a floor-free-LOOKING quantity reproduces the band is if it
 * smuggles a positive terminal threshold back in (pick any epsilon > 0 and you get a band, but its location is a
 * function of epsilon -- exactly the D1 sensitivity, i.e. still floor-dependent, merely renamed). VERDICT:
 * route (i) is NOT a self-contained way to UPHOLD the band; it is self-defeating -- faithful ==> no band,
 * band-preserving ==> floor smuggled back in (circular). It collapses into route (ii): showing the floor-free
 * limit has no band IS the pure-artifact proof.
 *
 * ROUTE (ii)  --  PROVE PURE FLOOR ARTIFACT, ZERO CONTINUUM RESIDUE  :  SELF-CONTAINED, but DISPOSAL-direction
 * ----------------------------------------------------------------------------------------------------------
 * Attempt: construct the infinite-precision continuum model of the iterate count and prove the off-by-one has
 * ZERO continuum residue -- the band is an artifact of the discrete ceil against EPS_FP with no counterpart as
 * threshold -> 0. Assessment: this is SELF-CONTAINED and non-circular -- it needs only the surrogate log-law and a
 * limit argument (threshold -> 0 removes the ceil; the residual smooth phase carries no integer band), no appeal
 * to the very fact it is trying to establish. It is precisely the route imp-35357 is chartered to formalize. BUT
 * note its DIRECTION: meeting R1 this way settles floor-independence in the DISPOSAL sense -- it certifies the
 * band is NOT a feature of the true dynamic. It discharges imp-35243a by DELETING the claim that the reentry band
 * is dynamically real, not by upholding it. That is a legitimate resolution of R1 (the question "floor-free or
 * intrinsic-floor?" is answered "neither -- artifact"), and it is the ONLY one of the three routes that is both
 * self-contained and non-circular. What it does NOT do is preserve the band as a true-dynamic landmark.
 *
 * ROUTE (iii)  --  EXHIBIT AN INTRINSIC NON-FLOATING-POINT FLOOR  :  CIRCULAR (as a band-preserving route)
 * ------------------------------------------------------------------------------------------------------
 * Attempt: identify a REAL cutoff in the true dynamic -- e.g. a minimum resolvable gap set by the mean zero
 * spacing, or the imp-2563 collision horizon -- so the band anchors to that intrinsic floor rather than to
 * EPS_FP. Assessment: the observed band edges [10^27.08, 10^37.17] were COMPUTED with the floor set to
 * EPS_FP = 2.3e-16. By D1, moving the floor by a factor of 2 relocates the band ~11.99 decades. So any intrinsic
 * floor that REPRODUCES the observed edges must numerically COINCIDE with the machine constant 2.3e-16 to within a
 * small factor -- and there is no dynamical reason a physical cutoff would land on an IEEE-754 double-precision
 * epsilon. The physically-motivated candidate floors sit at entirely different scales: the mean zero spacing is
 * an N-DEPENDENT quantity (not a fixed constant), and the collision horizon is a finite-TIME singularity on the
 * trajectory, not a floor on the gap DISTANCE. Either would place the band at a different location, contradicting
 * the observed edges unless one back-fits the intrinsic floor to match EPS_FP -- which is circular (assuming the
 * band position to derive the floor that produces it). VERDICT: route (iii) is CIRCULAR as a route that
 * PRESERVES the observed band; a genuinely intrinsic, independently-motivated floor would produce a DIFFERENT
 * band, not this one, so it cannot certify the band as computed.
 *
 * THE ENUMERATION VERDICT
 * -----------------------
 * Exactly ONE of the three routes -- (ii), the pure-artifact proof -- is self-contained and non-circular, and it
 * resolves R1 in the DISPOSAL direction (band = artifact, not a true-dynamic feature). Route (i) is self-defeating
 * (floor-free ==> no band; band-preserving ==> floor smuggled back), collapsing into (ii). Route (iii) is circular
 * as a band-preserving route (reproducing the edges forces the intrinsic floor onto the machine constant, with no
 * dynamical justification). CONCLUSION: there is NO self-contained, non-circular route that UPHOLDS the reentry
 * band as a feature of the true dynamic; the only clean discharge of R1 disposes of the band. This is consistent
 * with, and sharpens, imp-35330 (R1 is the DAG root) and imp-35243 D1 (floor-sensitivity): the fidelity gap
 * resolves toward "artifact," and the burden of the only live route sits with imp-35357. Discharges nothing.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A route-enumeration assessment of how R1 could be MET, refining imp-35330 (which named R1 the root but did not
 * enumerate routes). It discharges NOTHING: R1 stays the OPEN binding obstruction; imp-35111a / imp-35174a /
 * imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (R1 is the DAG root; R4 vacuous, R2/R3 dominated)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; D1 floor-sensitivity; D2 gap)
 * @see imp-35357 (charters the pure-artifact formalization -- route (ii) here)
 * @see imp-35263-reentry-band-eps-floor-sweep (R1 dedicated ticket; EPS_FP floor sweep)
 * @see imp-34926-iters-to-floor-ceil-boundary-geometry (frac(xArg) top-of-cell geometry; PENULT < EPS_FP)
 * @see imp-2563 (collision horizon -- finite-time singularity, not a distance floor)
 */

// Inherited band landmarks (imp-35174 double-double certified) and the floor/contraction constants.
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const EPS_FP = 2.3e-16; // machine-epsilon model floor entering xArg (imp-35243 D1)
const R_CONTRACT = 0.0454235; // single contraction rate at the fixed point (imp-35174/35243)
const BAND_WIDTH_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.08

// The three candidate routes to MEET R1, each classified self-contained | self-defeating | circular.
const R1_ROUTES = [
  {
    id: 'route-i',
    name: 'floor-free continuum re-expression',
    r1Form: 're-express the band edges in a floor-free continuum quantity (no terminal ceil against EPS_FP)',
    classification: 'SELF-DEFEATING',
    selfContained: false,
    circular: false,
    upholdsBand: false,
    note: 'A faithful floor-free limit (threshold -> 0) sends xArg -> infinity and dissolves the integer off-by-one, so it ERASES the band rather than repositioning it floor-free. The only band-preserving variant re-introduces a positive threshold, i.e. smuggles a floor back in (the D1 sensitivity, renamed). Collapses into route (ii): the floor-free limit having no band IS the pure-artifact proof.',
  },
  {
    id: 'route-ii',
    name: 'pure floor artifact, zero continuum residue',
    r1Form: 'prove the band is a PURE floor artifact with zero continuum residue as the floor -> 0',
    classification: 'SELF-CONTAINED',
    selfContained: true,
    circular: false,
    upholdsBand: false,
    note: 'Needs only the surrogate log-law and a threshold -> 0 limit removing the ceil; no appeal to the conclusion. Non-circular. But it resolves R1 in the DISPOSAL direction -- it certifies the band is NOT a true-dynamic feature, discharging imp-35243a by deleting the claim, not upholding it. This is the route imp-35357 formalizes. The ONLY self-contained, non-circular option of the three.',
  },
  {
    id: 'route-iii',
    name: 'intrinsic non-floating-point floor mechanism',
    r1Form: 'exhibit an intrinsic (non-IEEE-754) floor so the band anchors to a real cutoff',
    classification: 'CIRCULAR',
    selfContained: false,
    circular: true,
    upholdsBand: false,
    note: 'The observed edges were computed with the floor = EPS_FP = 2.3e-16, and by D1 a factor-2 change relocates the band ~11.99 decades; so any intrinsic floor reproducing THESE edges must coincide with the machine constant, for which there is no dynamical reason. Physical candidates (mean zero spacing -- N-dependent, not a fixed constant; imp-2563 collision horizon -- a finite-time singularity, not a distance floor) sit at different scales and would place a DIFFERENT band. Reproducing the computed band forces back-fitting the floor to EPS_FP -- circular.',
  },
];

// Exactly one route is both self-contained and non-circular (route ii).
const SELF_CONTAINED_NONCIRCULAR_COUNT = R1_ROUTES.filter((r) => r.selfContained && !r.circular).length; // 1
// No route upholds the band as a true-dynamic feature.
const BAND_UPHOLDING_ROUTE_COUNT = R1_ROUTES.filter((r) => r.upholdsBand).length; // 0

export const IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT = {
  id: 'imp-35356',
  proofSection: 'S-frontier',
  question:
    'imp-35330 found R1 (floor-independence) is the DAG root of the reentry-band fidelity requirements -- the ' +
    'sole live lever, R4 vacuous and R2/R3 dominated -- but did NOT enumerate how R1 could be met. Enumerate the ' +
    'concrete candidate routes to MEET R1 -- (i) re-express the band edges in a floor-free continuum quantity, ' +
    '(ii) prove the band is a PURE floor artifact with zero continuum residue, (iii) exhibit an intrinsic ' +
    'non-floating-point floor mechanism -- and assess each as self-contained or circular.',
  landmarks: {
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    band_width_decades: +BAND_WIDTH_DECADES.toPrecision(4), // ~10.08
    eps_fp_floor: EPS_FP, // 2.3e-16
    contraction_rate: R_CONTRACT, // ~0.0454235
  },
  routes: R1_ROUTES,
  self_contained_noncircular_count: SELF_CONTAINED_NONCIRCULAR_COUNT, // 1 (route ii)
  band_upholding_route_count: BAND_UPHOLDING_ROUTE_COUNT, // 0
  route_i_verdict:
    'SELF-DEFEATING. A faithful floor-free continuum quantity (threshold -> 0) dissolves the integer off-by-one ' +
    '(xArg -> infinity), ERASING the band rather than repositioning it floor-free; the only band-preserving ' +
    'variant smuggles a positive threshold back in (the D1 floor-sensitivity, renamed). It collapses into ' +
    'route (ii): showing the floor-free limit carries no band IS the pure-artifact proof. Not a self-contained ' +
    'way to UPHOLD the band.',
  route_ii_verdict:
    'SELF-CONTAINED and non-circular -- needs only the surrogate log-law and a threshold -> 0 limit that removes ' +
    'the terminal ceil, with no appeal to the conclusion. It is the ONLY clean route, and it resolves R1 in the ' +
    'DISPOSAL direction: it certifies the band is NOT a feature of the true dynamic, discharging imp-35243a by ' +
    'deleting the claim rather than upholding it. This is exactly what imp-35357 is chartered to formalize.',
  route_iii_verdict:
    'CIRCULAR as a band-preserving route. The observed edges were computed at floor = EPS_FP = 2.3e-16, and D1 ' +
    'shows a factor-2 change relocates the band ~11.99 decades; so any intrinsic floor reproducing THESE edges ' +
    'must numerically coincide with the machine constant, with no dynamical justification. Independently ' +
    'motivated cutoffs (N-dependent mean spacing; the imp-2563 collision horizon, a finite-time singularity not ' +
    'a distance floor) sit at other scales and would place a DIFFERENT band; matching the computed band forces ' +
    'back-fitting the floor to EPS_FP -- circular.',
  finding:
    'Route-enumeration assessment refining imp-35330 (R1 is the DAG root but routes to meet it were not ' +
    'enumerated). Of the three candidate routes, exactly ONE -- route (ii), the pure-artifact proof -- is ' +
    'self-contained and non-circular, and it resolves R1 in the DISPOSAL direction (band = artifact). Route (i) ' +
    '(floor-free re-expression) is SELF-DEFEATING (floor-free ==> no band; band-preserving ==> floor smuggled ' +
    'back), collapsing into (ii). Route (iii) (intrinsic floor) is CIRCULAR as a band-preserving route: ' +
    'reproducing the computed edges forces the intrinsic floor onto the machine constant EPS_FP, and any ' +
    'independently-motivated cutoff lands at a different scale (D1). NO route upholds the band as a true-dynamic ' +
    'feature; the only clean discharge disposes of it, with the burden sitting on imp-35357. Discharges nothing; ' +
    'imp-35111a / imp-35174a / imp-35243a stay OPEN.',
  residual_sub_gap:
    'R1 remains the OPEN binding obstruction. The only self-contained route is (ii), formalized by imp-35357: ' +
    'construct the infinite-precision continuum model and prove the off-by-one has zero continuum residue as the ' +
    'floor -> 0. Meeting R1 this way disposes of the reentry band as a true-dynamic feature (it does not uphold ' +
    'it). Inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). Enumerating the routes to MEET R1 ' +
    '(floor-independence), the DAG root per imp-35330, for the reentry band [10^27.08, 10^37.17]: exactly ONE of ' +
    'the three candidate routes is self-contained and non-circular -- route (ii), the pure-artifact proof -- and ' +
    'it resolves R1 in the DISPOSAL direction (the band is an artifact, not a true-dynamic feature). Route (i) ' +
    '(floor-free re-expression) is SELF-DEFEATING: a faithful floor-free limit dissolves the off-by-one and ' +
    'erases the band, while any band-preserving variant smuggles a floor back in; it collapses into (ii). ' +
    'Route (iii) (intrinsic floor) is CIRCULAR as a band-preserving route: reproducing the computed edges forces ' +
    'the intrinsic floor to coincide with the machine constant EPS_FP = 2.3e-16, for which there is no dynamical ' +
    'reason, and any independently-motivated cutoff sits at a different scale (D1 ~11.99 decades per factor-2). ' +
    'CONCLUSION: NO route upholds the band as a feature of the true dynamic; the only clean discharge disposes of ' +
    'it, and the burden of that route sits with imp-35357. This sharpens imp-35330 and imp-35243 D1. Discharges ' +
    'NOTHING; imp-35111a / imp-35174a / imp-35243a stay OPEN; imp-35174 arithmetic result unaffected. ' +
    'ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35330 (R1 is the DAG root; routes not enumerated); imp-35243 (R1-R4 checklist; D1 floor-sensitivity; ' +
    'D2 extrapolation gap); imp-35357 (charters the pure-artifact formalization = route ii); imp-35263 (R1 ' +
    'dedicated ticket); imp-34926 (ceil-boundary geometry, PENULT < EPS_FP); imp-2563 (collision horizon); ' +
    'imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT_ASSERTIONS = [
  {
    // All three named routes are enumerated exactly once.
    id: 'imp35356-three-routes-enumerated',
    description: 'the assessment covers exactly route-i / route-ii / route-iii',
    holds: () =>
      R1_ROUTES.length === 3 &&
      R1_ROUTES.map((r) => r.id).sort().join(',') === 'route-i,route-ii,route-iii',
  },
  {
    // Exactly one route is self-contained and non-circular (route ii), and no route upholds the band.
    id: 'imp35356-one-self-contained-none-upholds',
    description: 'exactly one self-contained non-circular route (route ii); zero band-upholding routes',
    holds: () => {
      const rii = R1_ROUTES.find((r) => r.id === 'route-ii');
      return (
        SELF_CONTAINED_NONCIRCULAR_COUNT === 1 &&
        BAND_UPHOLDING_ROUTE_COUNT === 0 &&
        rii.selfContained === true &&
        rii.circular === false &&
        rii.classification === 'SELF-CONTAINED'
      );
    },
  },
  {
    // Route (i) is self-defeating (collapses into ii); route (iii) is circular.
    id: 'imp35356-route-i-selfdefeating-route-iii-circular',
    description: 'route (i) is SELF-DEFEATING and non-upholding; route (iii) is CIRCULAR and non-upholding',
    holds: () => {
      const ri = R1_ROUTES.find((r) => r.id === 'route-i');
      const riii = R1_ROUTES.find((r) => r.id === 'route-iii');
      return (
        ri.classification === 'SELF-DEFEATING' &&
        ri.upholdsBand === false &&
        riii.classification === 'CIRCULAR' &&
        riii.circular === true &&
        riii.upholdsBand === false
      );
    },
  },
  {
    // The floor constant and the band-width the routes must confront are the inherited landmarks.
    id: 'imp35356-inherited-landmarks',
    description: 'floor EPS_FP = 2.3e-16 and band width ~10.08 decades match the inherited surrogate',
    holds: () =>
      EPS_FP === 2.3e-16 &&
      Math.abs(BAND_WIDTH_DECADES - 10.08) < 0.05 &&
      Math.abs(EXIT_EXP - REENTRY_EXP - BAND_WIDTH_DECADES) < 1e-9,
  },
  {
    // Honesty gate: assessment only, disposal-direction, no QED, sub-gaps OPEN, no refereed bound is changed.
    id: 'imp35356-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, one self-contained route in disposal direction, no QED, no refereed bound is changed, sub-gaps OPEN',
    holds: () =>
      IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.isRigorous === false &&
      /SELF-CONTAINED/.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.route_ii_verdict) &&
      /DISPOSAL/.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.route_ii_verdict) &&
      /NO QED/.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.verdict) &&
      /imp-35243a/.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.residual_sub_gap) &&
      /imp-35357/.test(IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT.residual_sub_gap),
  },
];

for (const a of IMP35356_R1_CANDIDATE_ROUTES_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35356-r1-candidate-routes-assessment assertion failed: ${a.id}`);
  }
}

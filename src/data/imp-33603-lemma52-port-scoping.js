/**
 * @module imp-33603-lemma52-port-scoping
 *
 * imp-33603 (proof, frontier-scoping): SCOPE the direct port of Polymath15 Lemma 5.2 named by the
 * roadmap Step-4 nextStep as the candidate closure of the sole OPEN bridge sub-gap
 * G6a_shock_lipschitz -- WITHOUT claiming closure. The roadmap OPEN_GAPS ledger lists
 * G6a_shock_lipschitz (structurally silent verdict; needs a Holder-1/2 modulus; imp-2520
 * negative-finding 1: the naive modulus -> 0 as strip height -> 0) as the last open Step-4 gap, and
 * its own nextStep reads "Close G6a_shock_lipschitz by direct port of Polymath15 Lemma 5.2 or
 * equivalent". This module ENUMERATES the hypotheses that a Lemma-5.2-type Holder-1/2 blow-up modulus
 * requires, MAPS each onto the backward-Dyson shock-front setting, marks which are SATISFIED vs OPEN,
 * and states the PRECISE residual obstruction. Assessment / literature-scoping only. G6a stays OPEN;
 * no QED; does not touch imp-3066 or C_mb.
 *
 * PROVENANCE OF THE HYPOTHESIS CATALOGUE (honesty note)
 * ----------------------------------------------------
 * The repo cites "Polymath15 / Tao, arXiv:1802.05390v3, Lemma 5.2" as the blow-up lemma that would
 * supply the Holder-1/2 modulus (see lambda-polymath15-bridge.js THE OPEN SUB-GAP, and
 * lambda-burgers-shock-lipschitz.js which already reduced G6a to the Whitham fold catastrophe with two
 * named sub-sub-gaps). The hypothesis list H1..H5 below is the STRUCTURAL hypothesis set that ANY such
 * fold-catastrophe / blow-up Holder-1/2 modulus argument requires, reconstructed from the repo's own
 * documented understanding (the imp-345 scaffold + the imp-354 Whitham fold analysis), NOT a verbatim
 * transcription of the published lemma text. Confirming the verbatim hypothesis list against the arXiv
 * source is itself flagged below as part of the scoping residual (H0). No hypothesis is asserted to be
 * discharged that the repo has not already recorded as discharged.
 *
 * THE FIVE STRUCTURAL HYPOTHESES OF A LEMMA-5.2-TYPE HOLDER-1/2 MODULUS
 * --------------------------------------------------------------------
 * A blow-up modulus |tau_c(field + eps) - tau_c(field)| <= C * ||eps||^{1/2} at a fold requires:
 *   H1  SMOOTHNESS AWAY FROM THE FOLD. The first-collision-time functional tau_c is C^2 in the flow
 *       field on the strip away from the critical (shock) point z_0*, so the only non-Lipschitz
 *       behaviour is the fold itself.
 *   H2  NON-DEGENERATE FOLD. At z_0* the first variation of the shock-time map vanishes and the second
 *       variation (curvature) is NONZERO -- the "simple shock" hypothesis
 *       u_0_prime(z_0*) != 0, u_0_double_prime(z_0*) != 0. This is what FORCES the square root (exponent
 *       exactly 1/2, pinned by the imp-354 tripwire).
 *   H3  UNIFORM CURVATURE LOWER BOUND. A quantitative lower bound |u_0_double_prime(z_0*)| >= c > 0
 *       UNIFORM in N, so the modulus constant C_W = sqrt(2 / |u_0_double_prime(z_0*)|) is finite
 *       uniformly (not just finite pointwise).
 *   H4  PERTURBATION CONTROL ON A STRIP ABOVE THE FOLD. The perturbation eps = m_N - m_infinity is
 *       controlled in L^inf on a strip {Im z >= y_N^sharp} that stays UNIFORMLY ABOVE the strip height
 *       at which the fold degenerates, so the modulus is read where H2/H3 hold.
 *   H5  REAL-SCALAR SETTING (or a transcription of it). The blow-up lemma is stated for a real-scalar
 *       field u : R -> R; the backward-Dyson field is the complex Stieltjes transform m : C_+ -> C_+,
 *       so a Riemann-Hilbert transcription of the fold is required.
 *
 * MAPPING ONTO THE BACKWARD-DYSON SHOCK FRONT (satisfied vs open)
 * --------------------------------------------------------------
 *   H1  SATISFIED. tau_c is smooth away from the shock; away from z_0* the modulus is Lipschitz,
 *       controlled by the second-derivative bound on sup Im m (imp-345 THE OPEN SUB-GAP; imp-354 C1).
 *   H2  SATISFIED (as the definition of a simple shock). The Riemann-von Mangoldt density gives a
 *       genuine fold: tau_c = inf_{z_0} t_shock(z_0) with a non-degenerate critical point z_0*
 *       (imp-354 Step 3 fold-catastrophe expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...).
 *   H3  OPEN (imp-354 G6a-sub-constant). For the RvM boundary shock the fold forms at y -> 0+ where
 *       z_0* sits on the real axis and u_0_double_prime = 2 m_infinity_double_prime DIVERGES; there is
 *       no uniform-in-N lower bound on the curvature, so C_W is only SYMBOLIC positive, not uniform.
 *   H4  OPEN -- THIS IS THE RESIDUAL. The perturbation is measured on {Im z >= y_N^sharp} with
 *       y_N^sharp = sqrt(2 pi / N) -> 0 as N -> infinity, so the reading strip DESCENDS toward the
 *       degenerate boundary shock instead of staying above it. imp-2520 negative-finding 1 is exactly
 *       this: the naive modulus -> 0 (equivalently C_W -> infinity) as strip height -> 0. H3 (uniform
 *       curvature) and H4 (strip above the fold) are therefore in DIRECT CONFLICT for this front: the
 *       perturbation control FORCES y_N^sharp -> 0, which drives the reading into the degenerate regime.
 *   H5  OPEN (imp-354 G6a-sub-hyperbolic). Whitham/Lemma-5.2 is real-scalar u : R -> R; porting to the
 *       complex Stieltjes m : C_+ -> C_+ needs a Riemann-Hilbert fold analysis the repo does not
 *       reproduce.
 *   H0  OPEN (provenance). The verbatim hypothesis list of arXiv:1802.05390v3 Lemma 5.2 must be checked
 *       against the source; the catalogue above is a structural reconstruction, not a transcription.
 *
 * THE PRECISE RESIDUAL OBSTRUCTION
 * -------------------------------
 * STRIP-HEIGHT-UNIFORMITY OF THE MODULUS. A per-N Holder-1/2 bound needs H3 and H4 to hold on the SAME
 * strip {Im z >= y_N^sharp}: the fold curvature must be bounded below (finite C_W) AT the height where
 * the perturbation is measured. But for the backward-Dyson front the perturbation control pushes
 * y_N^sharp = sqrt(2 pi / N) -> 0, and the fold degenerates precisely as y_N^sharp -> 0 (curvature ->
 * infinity, C_W -> infinity, floor -> 0). So the residual blocking the port is NOT the fold exponent
 * (H2 gives 1/2 unconditionally) and NOT smoothness (H1) -- it is a strip-height-UNIFORM lower bound on
 * the fold curvature (equivalently a non-vacuous modulus constant) at heights y_N^sharp -> 0. This is
 * the SAME still-missing object named downstream as G6a_shock_lipschitz::y2-adapted-flow-depth
 * (imp-3708): a self-similar depth s(y) ~ y^2 pinning the contraction floor away from 0 at the
 * nearest-pair front. Lemma 5.2 supplies the fold BLOW-UP but not the strip-height uniformity that the
 * y_N^sharp -> 0 front demands; the port cannot close G6a without that uniform-curvature input.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. The Lemma 5.2 port discharges H1 and H2 (smoothness + the
 * simple-fold structure that forces exponent 1/2) but leaves H3, H4, H5 (and provenance H0) open, with
 * H4 (strip-height-uniformity) the precise load-bearing residual. This RECONCILES the roadmap nextStep
 * ("direct port of Lemma 5.2 or equivalent") with imp-2520 negative-finding 1 and the imp-354 two
 * sub-sub-gaps: the port is necessary but NOT sufficient; the missing input is a uniform-in-N curvature
 * lower bound at y_N^sharp -> 0. Assessment only; no positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share untouched.
 * Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see lambda-polymath15-bridge (imp-345: opens G6a; cites Lemma 5.2 as the blow-up lemma)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; G6a-sub-hyperbolic, G6a-sub-constant)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (the y2-adapted-flow-depth still-missing object)
 * @see imp-2520 (negative-finding 1: naive modulus -> 0 as strip height -> 0)
 * @see lambda-roadmap (Step 4 nextStep: close G6a by direct port of Polymath15 Lemma 5.2)
 */

// y_N^sharp = sqrt(2 pi / N) is the uniformity strip height at which m_N - m_infinity is controlled
// (same convention as imp-341 / imp-354). It DESCENDS toward the boundary shock at y = 0+ as N grows,
// which is the geometric root of the H3/H4 conflict.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// A ladder from moderate to large N witnessing y_N^sharp -> 0 (the reading strip descends to the fold).
const N_LADDER = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12];
const STRIP_HEIGHT_LADDER = N_LADDER.map((N) => ({
  N,
  y_N_sharp: +ySharp(N).toExponential(4),
}));

// The five structural hypotheses of a Lemma-5.2-type Holder-1/2 blow-up modulus, mapped onto the front.
const HYPOTHESES = [
  {
    id: 'H1',
    name: 'smoothness away from the fold',
    requires: 'tau_c is C^2 in the flow field off the shock point z_0*',
    mapsTo: 'satisfied: away from the shock tau_c is Lipschitz via the sup-Im-m second-derivative bound',
    status: 'satisfied',
  },
  {
    id: 'H2',
    name: 'non-degenerate (simple) fold',
    requires: 'u_0_prime(z_0*) != 0 and u_0_double_prime(z_0*) != 0 -- forces exponent exactly 1/2',
    mapsTo: 'satisfied: the RvM density gives a genuine fold, imp-354 fold-catastrophe expansion',
    status: 'satisfied',
  },
  {
    id: 'H3',
    name: 'uniform curvature lower bound',
    requires: '|u_0_double_prime(z_0*)| >= c > 0 UNIFORM in N so C_W = sqrt(2/|u_0_double_prime|) is finite uniformly',
    mapsTo: 'OPEN (imp-354 G6a-sub-constant): at the y -> 0+ boundary shock the curvature diverges, C_W only symbolic',
    status: 'open',
  },
  {
    id: 'H4',
    name: 'perturbation control on a strip above the fold',
    requires: 'eps = m_N - m_infinity controlled on {Im z >= y_N^sharp} staying UNIFORMLY ABOVE the degenerate height',
    mapsTo: 'OPEN -- RESIDUAL: y_N^sharp = sqrt(2 pi / N) -> 0 descends INTO the degenerate regime (imp-2520 nf-1)',
    status: 'open',
    isResidual: true,
  },
  {
    id: 'H5',
    name: 'real-scalar setting (or transcription of it)',
    requires: 'lemma stated for u : R -> R; complex Stieltjes m : C_+ -> C_+ needs a Riemann-Hilbert fold analysis',
    mapsTo: 'OPEN (imp-354 G6a-sub-hyperbolic): the RH transcription of the fold is not reproduced',
    status: 'open',
  },
  {
    id: 'H0',
    name: 'provenance of the hypothesis list',
    requires: 'the verbatim Lemma 5.2 hypotheses of arXiv:1802.05390v3 confirmed against the source',
    mapsTo: 'OPEN: the H1..H5 catalogue is a structural reconstruction from the repo scaffold, not a transcription',
    status: 'open',
  },
];

const SATISFIED = HYPOTHESES.filter((h) => h.status === 'satisfied').map((h) => h.id);
const OPEN = HYPOTHESES.filter((h) => h.status === 'open').map((h) => h.id);
const RESIDUAL = HYPOTHESES.filter((h) => h.isResidual === true).map((h) => h.id);

export const IMP33603_LEMMA52_PORT_SCOPING = {
  id: 'imp-33603',
  proofSection: 'S-frontier',
  scopes: 'Direct port of Polymath15 Lemma 5.2 (arXiv:1802.05390v3) as candidate closure of G6a_shock_lipschitz',
  question:
    'Enumerate the hypotheses a Lemma-5.2-type Holder-1/2 blow-up modulus requires, map each onto the ' +
    'backward-Dyson shock front, mark satisfied vs open, and state the precise residual blocking a per-N ' +
    'Holder-1/2 bound. Assessment / literature-scoping only; G6a stays OPEN; no QED.',
  hypotheses: HYPOTHESES,
  satisfied: SATISFIED, // H1, H2 -- discharged by the port (smoothness + simple-fold, exponent 1/2 forced)
  open: OPEN, // H3, H4, H5, H0
  residualHypothesis: RESIDUAL, // H4
  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'A per-N Holder-1/2 bound needs H3 (uniform curvature lower bound) and H4 (strip above the fold) on ' +
    'the SAME strip {Im z >= y_N^sharp}, but the perturbation control forces y_N^sharp = sqrt(2 pi / N) ' +
    '-> 0 while the fold degenerates precisely as y_N^sharp -> 0 (curvature -> infinity, C_W -> infinity, ' +
    'modulus floor -> 0, imp-2520 negative-finding 1). The missing input is a strip-height-UNIFORM lower ' +
    'bound on the fold curvature at heights y_N^sharp -> 0 -- the same still-missing object named ' +
    'downstream as G6a_shock_lipschitz::y2-adapted-flow-depth (imp-3708). Lemma 5.2 supplies the fold ' +
    'blow-up (H1, H2) but NOT this uniformity, so the port is necessary but not sufficient.',
  stripHeightLadder: STRIP_HEIGHT_LADDER, // witnesses y_N^sharp -> 0: the reading strip descends to the fold
  portDischarges: 'H1 (smoothness), H2 (simple fold => exponent 1/2 forced)',
  portLeavesOpen: 'H3 (uniform curvature), H4 (strip-height-uniformity, the residual), H5 (RH transcription), H0 (provenance)',
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous): the direct port of Polymath15 Lemma 5.2 discharges H1 ' +
    '(smoothness away from the fold) and H2 (the simple non-degenerate fold that FORCES exponent 1/2), ' +
    'but leaves H3 (uniform-in-N curvature lower bound), H4 (perturbation strip staying above the fold), ' +
    'H5 (Riemann-Hilbert transcription of the real-scalar lemma) and H0 (verbatim provenance) OPEN. The ' +
    'PRECISE residual is H4 strip-height-uniformity: the perturbation control forces the reading strip ' +
    'y_N^sharp = sqrt(2 pi / N) -> 0 down onto the y -> 0+ boundary shock where the RvM fold curvature ' +
    'diverges, so H3 and H4 are in direct conflict and the naive modulus -> 0 as strip height -> 0 ' +
    '(imp-2520 negative-finding 1). This reconciles the roadmap nextStep (direct port of Lemma 5.2 or ' +
    'equivalent) with the imp-354 two sub-sub-gaps: the port is NECESSARY but NOT SUFFICIENT; the ' +
    'missing input is a strip-height-uniform lower bound on the fold curvature at y_N^sharp -> 0, the ' +
    'same still-missing object as G6a_shock_lipschitz::y2-adapted-flow-depth (imp-3708). Assessment / ' +
    'literature-scoping only; G6a_shock_lipschitz stays OPEN; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share ' +
    'untouched. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'lambda-polymath15-bridge (imp-345: opens G6a; cites Polymath15 Lemma 5.2 arXiv:1802.05390v3 as the ' +
    'blow-up lemma); lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction, G6a-sub-hyperbolic ' +
    'and G6a-sub-constant); imp-3708 (y2-adapted-flow-depth still-missing object); imp-2520 ' +
    '(negative-finding 1: naive modulus -> 0 as strip height -> 0); lambda-roadmap Step 4 nextStep.',
};

export const IMP33603_LEMMA52_PORT_SCOPING_ASSERTIONS = [
  {
    // Exactly six hypotheses catalogued (H1..H5 structural + H0 provenance), each with a status.
    id: 'imp33603-hypotheses-enumerated',
    description: 'six hypotheses (H1..H5 structural + H0 provenance) catalogued, each with a satisfied/open status',
    holds: () =>
      HYPOTHESES.length === 6 &&
      HYPOTHESES.every((h) => h.status === 'satisfied' || h.status === 'open') &&
      ['H0', 'H1', 'H2', 'H3', 'H4', 'H5'].every((id) => HYPOTHESES.some((h) => h.id === id)),
  },
  {
    // The port discharges exactly H1 and H2 (smoothness + simple fold), forcing exponent 1/2.
    id: 'imp33603-port-discharges-h1-h2',
    description: 'the Lemma 5.2 port discharges exactly H1 (smoothness) and H2 (simple fold => exponent 1/2)',
    holds: () =>
      SATISFIED.length === 2 &&
      SATISFIED.includes('H1') &&
      SATISFIED.includes('H2') &&
      !SATISFIED.includes('H3') &&
      !SATISFIED.includes('H4'),
  },
  {
    // H3, H4, H5, H0 remain open; H4 is the single named residual.
    id: 'imp33603-residual-is-h4-strip-height-uniformity',
    description: 'H3/H4/H5/H0 open; the single residual is H4 strip-height-uniformity',
    holds: () =>
      OPEN.length === 4 &&
      ['H0', 'H3', 'H4', 'H5'].every((id) => OPEN.includes(id)) &&
      RESIDUAL.length === 1 &&
      RESIDUAL[0] === 'H4' &&
      /strip-height-uniformity/.test(IMP33603_LEMMA52_PORT_SCOPING.residualObstruction),
  },
  {
    // The strip height y_N^sharp = sqrt(2 pi / N) is strictly decreasing to 0 across the ladder (H3/H4 conflict root).
    id: 'imp33603-strip-height-descends-to-fold',
    description: 'y_N^sharp = sqrt(2 pi / N) strictly decreases toward 0 across the N ladder (reading strip descends onto the fold)',
    holds: () => {
      const monotone = STRIP_HEIGHT_LADDER.every(
        (row, i) => i === 0 || row.y_N_sharp < STRIP_HEIGHT_LADDER[i - 1].y_N_sharp,
      );
      return (
        monotone &&
        STRIP_HEIGHT_LADDER.length === N_LADDER.length &&
        ySharp(1e3) > 0.07 &&
        ySharp(1e12) < 1e-5
      );
    },
  },
  {
    // Honesty gate: scoping only, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33603-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33603_LEMMA52_PORT_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33603_LEMMA52_PORT_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33603_LEMMA52_PORT_SCOPING.verdict) &&
      /remains the rigorous SOTA/.test(IMP33603_LEMMA52_PORT_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33603_LEMMA52_PORT_SCOPING.verdict),
  },
];

for (const a of IMP33603_LEMMA52_PORT_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33603-lemma52-port-scoping assertion failed: ${a.id}`);
  }
}

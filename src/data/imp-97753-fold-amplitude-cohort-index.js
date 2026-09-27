/**
 * @module imp-97753-fold-amplitude-cohort-index
 * @fileoverview imp-97753 -- META cross-reference index grouping the sigma-peak fold-amplitude
 *   cohort (imp-97662, imp-97683, imp-97700, imp-97725) by role: the fold law + first K route, the
 *   even-poly fit cross-check, the implicit-differentiation machinery, and the analytic pin
 *   K=0.4233, mirroring the imp-97657/imp-97674 cohort-index pattern.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE FOLD-AMPLITUDE STORY IN ONE LINE. As the sigma(N) target level s is swept toward the
 *   imp-97520 L1 interior peak sigma_max ~ 0.949429, the imp-97622/imp-97642 C_C-elasticity closed
 *   form E = d(ln N)/d(ln C_C) diverges like a square-root fold, E ~ +/- K / sqrt(sigma_max - s),
 *   with K ~ 0.423330. Four tickets, in order, discover the law, cross-check the amplitude by an
 *   independent route, build the implicit-differentiation machinery that avoids finite-difference
 *   noise, and finally pin K to a closed structure using that machinery.
 *
 *   ROLE 1 -- THE FOLD LAW AND FIRST K ROUTE (imp-97662).
 *     Identifies the closed-form denominator D = 1 + 2 d(ln R)/dx - d(ln L)/dx as EXACTLY the peak
 *     condition (D=0 at x_peak), so E = 2/D blows up there; because the peak LOCATION is
 *     C_C-invariant, the divergence carries a single amplitude K = (d sigma_max/d ln C_C)/(2 sqrt(A))
 *     with A = -sigma_xx(x_peak)/2. First (bare finite-difference) measurement: K ~ 0.423330, with
 *     the downslope branch converging cleanly and the upslope branch noisier at wide gaps.
 *
 *   ROLE 2 -- THE EVEN-POLY FIT CROSS-CHECK (imp-97683).
 *     Independently re-measures K by a second, higher-order route sharing no finite-difference step
 *     with imp-97662: a degree-6 even-polynomial least-squares fit for the curvature A and a 5-point
 *     O(h^4) stencil for the peak-height sensitivity. Reproduces K = 0.423330 to all 6 reported
 *     figures, and resolves the imp-97662 upslope noise as a finite-gap fold asymmetry (both branches
 *     converge to the same |K| by gap 1e-8), not a genuine |K| split.
 *
 *   ROLE 3 -- THE IMPLICIT-DIFFERENTIATION MACHINERY (imp-97700).
 *     A neighboring investigation (the Gronwall-exponent wrapper identity E_GEXP = TC_A1_TRAP*E_CF)
 *     hit a noise floor that a longer bisection could not cure; diagnoses the floor as a
 *     finite-difference-of-a-quantized-root artifact (the crossing root is only resolved to one
 *     double-ULP) and shows the fix is EXACT IMPLICIT DIFFERENTIATION of the smooth component
 *     functions R(N), L(N) -- never differentiate a bisected root. This is the general lesson
 *     imp-97725 reuses to pin K.
 *
 *   ROLE 4 -- THE ANALYTIC PIN K=0.4233 (imp-97725).
 *     Applies the imp-97700 lesson to the fold amplitude itself: the numerator
 *     d sigma_max/d ln C_C = sigma_max(1-sigma_max) is closed-form exact (C_C is a bare E_coll
 *     prefactor, x_peak is C_C-invariant), and the curvature A = phi_xx(x_peak)*sigma_max(1-sigma_max)/2
 *     is read directly from the smooth R(N), L(N) via phi_xx = (ln R)_xx - (1/2)(ln L)_xx -- no
 *     bisected root anywhere. Collapses to K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) = 0.423330,
 *     matching both prior routes. HONEST SUB-GAP: only the structure is pinned -- phi_xx is a second
 *     log-derivative of the Riemann-von Mangoldt inverse height map with no elementary closed form,
 *     so K itself stays a numerical property of the inherited surrogate, not a universal constant.
 *
 *   WHY GROUP THESE (not re-derive). Read independently, the four tickets look like a repeated
 *   measurement of the same number; grouped by role they show a clean escalation -- discover the law,
 *   cross-check the amplitude, build (in a neighboring context) the machinery that removes
 *   finite-difference noise, then apply that machinery to close the amplitude derivation as far as it
 *   can be closed. This index bakes that escalation so a future scout can see, at a glance, why K
 *   stops at "structure pinned" rather than "closed form".
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - Fold law: E ~ +/-K/sqrt(sigma_max - s), denominator D=0 is the peak condition (imp-97662).
 *   - K ~ 0.423330 confirmed by two finite-difference routes sharing no step (imp-97662, imp-97683);
 *     upslope/downslope branch spread resolved as finite-gap asymmetry, not a real |K| split.
 *   - Implicit-differentiation lesson: differentiate the smooth model, never a bisected root, cures a
 *     double-ULP-quantization noise floor exactly (imp-97700).
 *   - K pinned to the closed structure K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)); numerator exact,
 *     curvature denominator inherits the height-mapping surrogate (imp-97725).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - K = 0.4233 is NOT pinned to a universal dimensionless constant; phi_xx has no elementary closed
 *     form (imp-97725 sub-gap, unresolved by this batch).
 *   - no new coercivity constant, no operator positivity, no RH verdict anywhere in the cohort.
 *   - the C_C 1/8 ansatz, E_trunc pinned 3.06e-5, and imp-3066 K_a >= 0 are UNTOUCHED throughout.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97662-cc-elasticity-peak-divergence.js (fold law + first K route ~0.423330)
 * @see imp-97683-fold-amplitude-independent-crosscheck.js (even-poly fit cross-check + branch resolution)
 * @see imp-97700-gexp-identity-analytic-crossing.js (implicit-differentiation machinery, smooth model)
 * @see imp-97725-fold-amplitude-analytic-pin.js (analytic pin K=sqrt(S/(2 phi_xx)) + K-not-universal sub-gap)
 * @see imp-97674-late-frontier-leaves-cohort-index-2.js (sibling cohort-index pattern this follows)
 *
 * Ticket: imp-97753 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const K_MEASURED = 0.42333;
const SIGMA_MAX = 0.9494290142;

const COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97662',
    role: 'fold-law-and-first-K-route',
    step: 'discover the square-root-fold divergence law and measure K with bare finite differences',
    result:
      'closed-form denominator D = 1 + 2 dlnR/dx - dlnL/dx IS the peak condition (D=0 at x_peak); ' +
      'E ~ +/-K/sqrt(sigma_max - s), K ~ 0.423330 from a 3-point curvature and 2-point peak-height ' +
      'sensitivity; downslope branch clean, upslope branch noisy at wide gaps.',
  }),
  Object.freeze({
    id: 'imp-97683',
    role: 'even-poly-fit-crosscheck',
    step: 'independently re-measure K by a degree-6 even-polynomial fit + 5-point stencil, sharing no finite-difference step with imp-97662',
    result:
      'reproduces K = 0.423330 to all 6 reported figures; resolves the imp-97662 upslope spread as a ' +
      'finite-gap fold asymmetry (both branches converge to the same |K| by gap 1e-8), not a real |K| split.',
  }),
  Object.freeze({
    id: 'imp-97700',
    role: 'implicit-differentiation-machinery',
    step: 'diagnose a neighboring (Gronwall-exponent identity) noise floor and fix it with exact implicit differentiation',
    result:
      'the floor is a finite-difference-of-a-quantized-root artifact (crossing root resolved to only ' +
      'one double-ULP); the fix is to differentiate the SMOOTH component functions directly, never a ' +
      'bisected root -- the general lesson imp-97725 reuses.',
  }),
  Object.freeze({
    id: 'imp-97725',
    role: 'analytic-pin-K',
    step: 'apply the imp-97700 lesson to pin the fold amplitude: closed-form numerator + smooth-model curvature',
    result:
      'K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) = 0.423330, matching both prior routes; numerator ' +
      'sigma_max(1-sigma_max) is exact, but phi_xx (a Riemann-von Mangoldt inverse height-map second ' +
      'log-derivative) has no elementary closed form -- K stays a numerical property of the surrogate, ' +
      'not a universal constant.',
  }),
]);

export const IMP97753_FOLD_AMPLITUDE_COHORT_INDEX = Object.freeze({
  id: 'imp-97753',
  proofSection: 'S-frontier',
  cohort: COHORT,
  measuredSignal:
    'four fold-amplitude tickets (imp-97662/97683/97700/97725), grouped by role: the fold law + ' +
    'first K route, an independent even-poly-fit cross-check, the implicit-differentiation machinery ' +
    '(built in a neighboring context), and the final analytic pin of K to a closed structure.',
  namedResiduals: [
    'IMP97662_FOLD_LAW_K_FIRST_ROUTE_0P423330',
    'IMP97683_EVENPOLY_CROSSCHECK_CONFIRMS_K',
    'IMP97700_IMPLICIT_DIFF_MACHINERY_CURES_ULP_FLOOR',
    'IMP97725_K_STRUCTURE_PINNED_NOT_UNIVERSAL',
  ],
  kMeasured: K_MEASURED,
  sigmaMax: SIGMA_MAX,
  kIsUniversalConstant: false,
  numeratorClosedForm: true,
  anyBoundMoved: false,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  question:
    'The four fold-amplitude tickets imp-97662/97683/97700/97725, read independently, look like a ' +
    'repeated measurement of the same number K ~ 0.4233. Split by role -- fold-law discovery ' +
    '(imp-97662), independent cross-check (imp-97683), implicit-differentiation machinery ' +
    '(imp-97700), and the final analytic pin (imp-97725) -- does each step add something distinct, ' +
    'and does the cohort end with a genuine closed form or only a pinned structure?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97662 discovers the square-root-fold divergence ' +
    'law and gives the first K ~ 0.423330 via bare finite differences; imp-97683 independently ' +
    'confirms K by a distinct even-polynomial-fit route and resolves the upslope-branch spread as a ' +
    'finite-gap artifact, not a real split; imp-97700 builds, in a neighboring context, the exact ' +
    'implicit-differentiation lesson (differentiate the smooth model, never a bisected root) that ' +
    'cures a double-ULP quantization floor; imp-97725 reuses that lesson to pin K to the closed ' +
    'structure K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)), with an EXACT numerator but a curvature ' +
    'denominator (phi_xx) that has no elementary closed form -- so K = 0.4233 is pinned as a ' +
    'structure, not as a universal dimensionless constant. No bound moves in this batch: RH open; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97662 (fold law, first K route); imp-97683 (even-poly-fit cross-check, branch resolution); ' +
    'imp-97700 (implicit-differentiation machinery); imp-97725 (analytic pin, K-not-universal sub-gap).',
});

export default IMP97753_FOLD_AMPLITUDE_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97753_FOLD_AMPLITUDE_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97753-cohort-has-all-four-members-no-overlap',
    why: 'The whole point of the index is grouping exactly these four tickets by role; a missing or duplicated member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.cohort.map((c) => c.id);
      const expected = ['imp-97662', 'imp-97683', 'imp-97700', 'imp-97725'];
      return (
        ids.length === 4 &&
        expected.every((id) => ids.includes(id)) &&
        new Set(ids).size === 4
      );
    },
  },
  {
    id: 'imp97753-roles-are-distinct',
    why: 'Each cohort member must carry a distinct role label, otherwise the index collapses the escalation it is meant to document.',
    holds: () => {
      const roles = IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.cohort.map((c) => c.role);
      return new Set(roles).size === roles.length;
    },
  },
  {
    id: 'imp97753-named-residuals-match-cohort-count',
    why: 'One named residual per cohort member keeps the index and the residual ledger in lockstep.',
    holds: () =>
      Array.isArray(IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.namedResiduals) &&
      IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.namedResiduals.length ===
        IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.cohort.length,
  },
  {
    id: 'imp97753-k-not-universal-honestly-flagged',
    why: 'imp-97725 established K is a pinned structure, not a universal constant; the index must not overclaim it as a closed dimensionless number.',
    holds: () =>
      IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.kIsUniversalConstant === false &&
      IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.numeratorClosedForm === true &&
      Math.abs(IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.kMeasured - 0.42333) < 1e-4,
  },
  {
    id: 'imp97753-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97753_FOLD_AMPLITUDE_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97753_FOLD_AMPLITUDE_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97753-fold-amplitude-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}

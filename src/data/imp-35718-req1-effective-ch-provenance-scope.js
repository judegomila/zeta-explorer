/**
 * @module imp-35718-req1-effective-ch-provenance-scope
 *
 * imp-35718 (proof/assessment, S-frontier): EXPAND imp-35538 REQ-1 -- the
 * "effective C_H = 1/8 provenance" definitional prerequisite -- into its own
 * requirements inventory. imp-35538 REQ-1 states that without an effective
 * derivation of C_H = 1/8 itself there is NO object against which |err(N)| is
 * even defined (the definitional floor of a route-(i) remainder), but it never
 * enumerates WHAT such a derivation consumes. This module does: it lists the
 * analytic inputs an effective derivation expressing
 *     E_coll_true(N) = <local-statistics functional of the zeros>
 * with leading term C_C sqrt(log T0/N) (C_C = (1/8) sqrt(3 pi), C_H = 1/8;
 * imp-2642/imp-2643) would have to supply, and assesses which repo modules
 * already supply a PARTIAL of each input and which sub-input is still missing.
 *
 * ASSESSMENT / SCOPING ONLY. Derives NO remainder; discharges NOTHING; changes
 * no bound; tightens no bound; establishes no operator positivity; no RH
 * verdict, NO QED. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the
 * tangency coefficient 8 / the reading 1/8 (imp-2690/imp-366/imp-2563), the
 * E_trunc = 3.06e-5 floor (imp-2631) and C_mb GUE-conditional (imp-486) are
 * UNTOUCHED. No refereed bound is changed.
 *
 * THE OBJECT REQ-1 DEMANDS
 * -----------------------------------------------------------------------------
 * An EXPLICIT identity expressing the true collision term as a functional of the
 * local zero statistics -- a pair-correlation / near-minimal-spacing integral --
 * together with a PROOF that its leading term is C_C sqrt(log T0/N). Only once
 * E_coll_true is so defined does a deviation |err(N)| = |E_coll_true / (C_C
 * sqrt(log T0/N)) - 1| acquire meaning (that deviation is what imp-35538 REQ-2
 * would then bound). REQ-1 is thus PRIOR to REQ-2: no functional, no err(N).
 *
 * THE FIVE ANALYTIC INPUTS AN EFFECTIVE DERIVATION CONSUMES
 * -----------------------------------------------------------------------------
 * INPUT 1a -- FUNCTIONAL DEFINITION. Fix WHICH statistic E_coll_true is: the
 *   expected near-minimal collision gap over the M = M(N) consecutive unfolded
 *   spacings inside the relevant window, i.e. E[ min_{1<=k<=M} s_k ] (or a
 *   near-minimal variant). This requires naming M(N) and the window; without a
 *   fixed functional there is nothing to expand. REPO PARTIAL: NONE -- the repo
 *   carries E_coll only as the ansatz VALUE C_C sqrt(log T0/N), never as an
 *   E[...] over the spacings. This is the missing definitional core.
 *
 * INPUT 1b -- SMALL-GAP DENSITY LAW. The near-coincidence amplitude is fixed by
 *   the nearest-neighbour spacing density as s -> 0. Under GUE cubic level
 *   repulsion p(s) ~ (pi^2/3) s^2 (small-s Wigner-surmise / sine-kernel
 *   asymptotic). REPO PARTIAL: SUPPLIED -- p(s) ~ (pi^2/3) s^2 is exactly the
 *   short-range fact imp-35652/imp-35680/imp-35696 already carry.
 *
 * INPUT 1c -- SMALLEST-GAP SCALING. The M-dependence of the minimal gap:
 *   s_min(M) ~ M^{-1/3} in mean-spacing units (Ben Arous-Bourgade 2013: smallest
 *   GUE gap ~ n^{-4/3} raw, i.e. n^{-1/3} unfolded). This pins the collision
 *   EXPONENT. REPO PARTIAL: SUPPLIED -- the M^{-1/3} law and the reciprocal
 *   resolution-floor factor M^{1/3} are tabulated in imp-35695/imp-35696.
 *
 * INPUT 1d -- CONSTANT-PINNING. Combine 1a+1b+1c so the leading coefficient
 *   EMERGES as exactly C_C = (1/8) sqrt(3 pi) (equivalently C_H = 1/8) rather
 *   than being ASSUMED. REPO PARTIAL: ONLY A NEGATIVE -- the local-statistics
 *   coefficient the repo can reach is the density curvature pi^2/3, which
 *   OVERSHOOTS C_C by (pi^2/3)/C_C ~ 8.573x (imp-35680/imp-35696); equivalently
 *   the cube-root collision-scale prefactor differs by ((pi^2/3)/C_C)^{1/3} ~
 *   2.047x (imp-35696). So the local-statistics machinery does NOT reproduce
 *   (1/8) sqrt(3 pi): the amplitude is UN-pinned by any repo functional.
 *
 * INPUT 1e -- HEIGHT MAP. Convert the M-gap scale to sqrt(log T0/N) via the RvM
 *   mean spacing 2 pi / log T0 (imp-3220/imp-3406 surrogate; lambda-rh-height-
 *   mapping). REPO PARTIAL: SUPPLIED -- effectiveHeightForN is the RvM inverse
 *   the repo already uses; the sqrt(log T0/N) height dependence is standard.
 *
 * THE TWO DISTINCT "1/8"s (the crux of REQ-1)
 * -----------------------------------------------------------------------------
 * The repo pins the NUMBER 1/8 from the QUADRATIC-TANGENCY ODE: d(g^2)/ds = -8
 * gives |tau_c| = g_min^2 / 8 exactly (imp-2690/imp-366/imp-2563), a
 * DETERMINISTIC gap-to-collision-TIME coefficient. REQ-1 instead needs 1/8 (as
 * C_C = (1/8) sqrt(3 pi)) as the LEADING AMPLITUDE of a pair-correlation /
 * near-minimal-SPACING functional -- a STOCHASTIC local-statistics object. These
 * two "1/8"s are NUMERICALLY IDENTICAL but of DISTINCT and currently UN-BRIDGED
 * provenance: nothing in the repo derives the tangency 1/8 FROM the small-gap
 * statistics, and imp-2642 already flags the amplitude as isRigorousUpperBound =
 * false (a positive O(1) remainder pushes the effective coefficient to ~0.127 >
 * 1/8). REQ-1 is exactly the demand to build that bridge (INPUT 1a + INPUT 1d).
 *
 * NET: of the five inputs an effective C_H = 1/8 derivation consumes, the repo
 * SUPPLIES three (1b small-gap density, 1c M^{-1/3} scaling, 1e height map) but
 * lacks the two load-bearing ones: 1a (a functional DEFINITION of E_coll_true as
 * E[min gap], entirely absent) and 1d (a derivation pinning the leading constant
 * to (1/8) sqrt(3 pi) -- the repo-reachable local coefficient pi^2/3 overshoots
 * by ~8.573x). So REQ-1 is NOT partially discharged in any load-bearing sense:
 * the ansatz value is the tangency-ODE 1/8, not a pair-correlation amplitude, and
 * the two provenances are unbridged. REQ-1 therefore remains the definitional
 * floor beneath REQ-2 (imp-35551 ranks it below the REQ-2 crux, but it is prior).
 * Assessment / scoping only; discharges nothing; changes no bound; no positivity;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ-1 stated as the definitional prerequisite; this module expands it)
 * @see imp-35551-route-i-requirement-severity-ranking (ranks REQ-1 below the REQ-2 crux, but REQ-1 is prior/definitional)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (small-gap density + M^{-1/3} scaling; collision scale inaccessible inside |alpha|<1)
 * @see imp-35680-constant-mismatch-magnitude ((pi^2/3)/C_C ~ 8.573 amplitude overshoot)
 * @see imp-35696-collision-exponent-consistency-check (M^{-1/3} exponent coefficient-independent; cube-root prefactor ~2.047)
 * @see imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz; isRigorousUpperBound = false; ~0.127 stress test)
 * @see imp-2643-honest-assembled-EN (E_coll classified NOT-RIGOROUS, C_H = 1/8 ansatz)
 * @see imp-2690-tangency-remainder-sign (the tangency 1/8 = exact gap-to-TIME coefficient, d(g^2)/ds = -8)
 * @see imp-2706-ecoll-conditional-modulo-ch (conditional E_coll modulo the named C_H gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse for INPUT 1e)
 * @see imp-486 (GUE-conditional caveat any local-law derivation inherits)
 */

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const CUBIC_CURVATURE = (Math.PI * Math.PI) / 3; // pi^2/3 ~ 3.2898681, GUE small-gap density coefficient p(s) ~ (pi^2/3) s^2
const TANGENCY_COEFF = 8; // d(g^2)/ds = -8 (imp-2690); the tangency reading 1/8 = 1/8
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any REQ-1 provenance scoping)

// The amplitude mismatch: the repo-reachable local coefficient vs the ansatz constant.
const CURVATURE_TO_CC_RATIO = CUBIC_CURVATURE / C_C; // ~8.573 (imp-35680/imp-35696)
const PREFACTOR_RATIO = Math.cbrt(CURVATURE_TO_CC_RATIO); // ((pi^2/3)/C_C)^{1/3} ~ 2.047 (imp-35696)

// The five analytic inputs an effective C_H = 1/8 derivation consumes, tagged by repo-partial status.
const REQ1_INPUTS = [
  {
    key: '1a-functional-definition',
    input: 'Fix WHICH statistic E_coll_true is: the expected near-minimal collision gap E[min_{k<=M} s_k] over the M = M(N) consecutive unfolded spacings in the window; name M(N) and the window.',
    repoPartial: 'NONE',
    note: 'The repo carries E_coll only as the ansatz VALUE C_C sqrt(log T0/N), never as an E[...] over spacings -- the missing definitional core.',
  },
  {
    key: '1b-small-gap-density',
    input: 'The nearest-neighbour spacing density as s -> 0: GUE cubic level repulsion p(s) ~ (pi^2/3) s^2.',
    repoPartial: 'SUPPLIED',
    note: 'p(s) ~ (pi^2/3) s^2 is the short-range fact imp-35652/imp-35680/imp-35696 already carry.',
  },
  {
    key: '1c-smallest-gap-scaling',
    input: 'The minimal-gap M-scaling s_min(M) ~ M^{-1/3} in mean-spacing units (Ben Arous-Bourgade 2013).',
    repoPartial: 'SUPPLIED',
    note: 'The M^{-1/3} law / reciprocal floor factor M^{1/3} are tabulated in imp-35695/imp-35696.',
  },
  {
    key: '1d-constant-pinning',
    input: 'Combine 1a+1b+1c so the leading coefficient EMERGES as C_C = (1/8) sqrt(3 pi) (C_H = 1/8), not assumed.',
    repoPartial: 'NEGATIVE-ONLY',
    note: 'The repo-reachable local coefficient pi^2/3 OVERSHOOTS C_C by ~8.573x (imp-35680/imp-35696); cube-root prefactor differs by ~2.047x. The amplitude is un-pinned by any repo functional.',
  },
  {
    key: '1e-height-map',
    input: 'Convert the M-gap scale to sqrt(log T0/N) via the RvM mean spacing 2 pi / log T0 (imp-3220/imp-3406; effectiveHeightForN).',
    repoPartial: 'SUPPLIED',
    note: 'effectiveHeightForN is the RvM inverse the repo already uses; the sqrt(log T0/N) height dependence is standard.',
  },
];

const SUPPLIED_COUNT = REQ1_INPUTS.filter((r) => r.repoPartial === 'SUPPLIED').length; // 3 (1b,1c,1e)
const MISSING_LOAD_BEARING = REQ1_INPUTS.filter(
  (r) => r.repoPartial === 'NONE' || r.repoPartial === 'NEGATIVE-ONLY',
).map((r) => r.key); // [1a, 1d]

export const IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE = {
  id: 'imp-35718',
  proofSection: 'S-frontier',
  question:
    'EXPAND imp-35538 REQ-1 (effective C_H = 1/8 provenance) into its own requirements inventory: what analytic ' +
    'inputs does an effective derivation expressing E_coll_true as a pair-correlation / near-minimal-spacing ' +
    'functional with C_C = (1/8) sqrt(3 pi) as its proven leading term consume, and which repo module supplies a ' +
    'partial of each? Requirements scoping only; derives no remainder; NO QED.',
  objectReq1Demands:
    'An EXPLICIT identity E_coll_true(N) = <local-statistics functional of the zeros> (a pair-correlation / ' +
    'near-minimal-spacing integral) with a PROOF that its leading term is C_C sqrt(log T0/N). Only then does ' +
    '|err(N)| = |E_coll_true/(C_C sqrt(log T0/N)) - 1| acquire meaning -- REQ-1 is PRIOR to REQ-2.',
  inputs: REQ1_INPUTS,
  twoDistinctEighths:
    'The repo pins the NUMBER 1/8 from the quadratic-tangency ODE d(g^2)/ds = -8, |tau_c| = g_min^2/8 exactly ' +
    '(imp-2690/imp-366/imp-2563) -- a DETERMINISTIC gap-to-TIME coefficient. REQ-1 needs 1/8 as the LEADING ' +
    'AMPLITUDE (C_C = (1/8) sqrt(3 pi)) of a near-minimal-SPACING functional -- a STOCHASTIC local-statistics ' +
    'object. Numerically identical, provenance DISTINCT and currently UN-BRIDGED; imp-2642 flags the amplitude ' +
    'isRigorousUpperBound = false (positive remainder pushes the effective coefficient to ~0.127 > 1/8).',
  suppliedCount: SUPPLIED_COUNT, // 3 (1b density, 1c M^{-1/3}, 1e height map)
  missingLoadBearing: MISSING_LOAD_BEARING, // 1a functional definition, 1d constant-pinning
  curvatureToCCRatio: +CURVATURE_TO_CC_RATIO.toPrecision(6), // ~8.573 amplitude overshoot
  prefactorRatio: +PREFACTOR_RATIO.toPrecision(6), // ~2.047 cube-root prefactor mismatch
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (REQ-1 requirements inventory, NOT rigorous). An effective C_H = 1/8 derivation ' +
    'consumes five analytic inputs: (1a) a functional DEFINITION of E_coll_true as E[min gap] over M = M(N) ' +
    'spacings; (1b) the GUE small-gap density p(s) ~ (pi^2/3) s^2; (1c) the smallest-gap scaling s_min ~ ' +
    'M^{-1/3} (Ben Arous-Bourgade 2013); (1d) a constant-pinning step making (1/8) sqrt(3 pi) EMERGE; (1e) the ' +
    'RvM height map to sqrt(log T0/N). The repo SUPPLIES three (1b, 1c, 1e) but lacks the two load-bearing ' +
    'ones: 1a is ENTIRELY ABSENT (E_coll is stored as the ansatz value, never as a functional) and 1d is only ' +
    'a NEGATIVE (the repo-reachable local coefficient pi^2/3 overshoots C_C by ~8.573x; cube-root prefactor by ' +
    '~2.047x). The ansatz 1/8 is the tangency-ODE coefficient (imp-2690), NOT a pair-correlation amplitude, and ' +
    'the two provenances are un-bridged. So REQ-1 is NOT partially discharged in any load-bearing sense; it ' +
    'remains the definitional floor beneath the imp-35538 REQ-2 crux. Derives NO remainder; discharges NOTHING; ' +
    'changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), the ' +
    'tangency 8 / reading 1/8 (imp-2690) and C_mb GUE-conditional (imp-486) are UNTOUCHED; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-35538 (REQ-1 stated as the definitional prerequisite; this module expands it); imp-35551 (severity ' +
    'ranking); imp-35652 (small-gap density + M^{-1/3}; collision scale inaccessible inside |alpha|<1); ' +
    'imp-35680 ((pi^2/3)/C_C ~ 8.573); imp-35696 (M^{-1/3} coefficient-independent; cube-root prefactor ~2.047); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, isRigorousUpperBound = false); imp-2690/imp-366/imp-2563 ' +
    '(tangency 8 / reading 1/8 gap-to-TIME); imp-2706 (conditional E_coll modulo C_H); imp-486 (GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Literature: Montgomery (1973); Rudnick-Sarnak ' +
    '(1996); Ben Arous-Bourgade (2013).',
};

export const IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE_ASSERTIONS = [
  {
    // (1) the five REQ-1 analytic inputs are enumerated with repo-partial status, and exactly three are SUPPLIED.
    id: 'imp35718-five-inputs-enumerated',
    description: 'REQ-1 is expanded into five analytic inputs (1a functional definition, 1b small-gap density, 1c M^{-1/3} scaling, 1d constant-pinning, 1e height map) each tagged with repo-partial status, with exactly three SUPPLIED',
    holds: () => {
      const inp = IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.inputs;
      const keys = inp.map((r) => r.key).join(',');
      return (
        inp.length === 5 &&
        keys === '1a-functional-definition,1b-small-gap-density,1c-smallest-gap-scaling,1d-constant-pinning,1e-height-map' &&
        IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.suppliedCount === 3 &&
        inp.filter((r) => r.repoPartial === 'SUPPLIED').length === 3
      );
    },
  },
  {
    // (2) the two load-bearing inputs (1a definition, 1d constant-pinning) are the ones NOT supplied.
    id: 'imp35718-load-bearing-inputs-missing',
    description: 'the two load-bearing inputs 1a (functional definition, NONE) and 1d (constant-pinning, NEGATIVE-only) are exactly the un-supplied ones, so REQ-1 is not partially discharged',
    holds: () => {
      const m = IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.missingLoadBearing;
      return (
        m.length === 2 &&
        m.includes('1a-functional-definition') &&
        m.includes('1d-constant-pinning')
      );
    },
  },
  {
    // (3) amplitude mismatch arithmetic: pi^2/3 overshoots C_C by ~8.573x, cube-root prefactor by ~2.047x.
    id: 'imp35718-amplitude-mismatch-arithmetic',
    description: 'the repo-reachable local curvature pi^2/3 overshoots C_C = (1/8) sqrt(3 pi) by ~8.573x and the cube-root collision-scale prefactor by ~2.047x, so 1d is a NEGATIVE (constant un-pinned)',
    holds: () =>
      Math.abs(C_C - 0.38374752) < 1e-6 &&
      Math.abs(CUBIC_CURVATURE - 3.2898681) < 1e-6 &&
      CURVATURE_TO_CC_RATIO > 8.5 && CURVATURE_TO_CC_RATIO < 8.6 &&
      Math.abs(PREFACTOR_RATIO - Math.cbrt(CURVATURE_TO_CC_RATIO)) < 1e-12 &&
      PREFACTOR_RATIO > 2.04 && PREFACTOR_RATIO < 2.05,
  },
  {
    // (4) honesty gate: the two 1/8 provenances are distinct/unbridged, not rigorous, no refereed bound is changed, tangency untouched; NO QED.
    id: 'imp35718-two-eighths-distinct-no-qed',
    description: 'the tangency 1/8 (gap-to-TIME, d(g^2)/ds=-8) and the amplitude 1/8 (C_C = (1/8) sqrt(3 pi)) are distinct/unbridged, the module is not rigorous, PT 0.2 unchanged, tangency coefficient 8 untouched, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      TANGENCY_COEFF === 8 &&
      IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.isRigorous === false &&
      IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.isUnconditional === false &&
      /UN-BRIDGED/.test(IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.twoDistinctEighths) &&
      /isRigorousUpperBound = false/.test(IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.twoDistinctEighths) &&
      /NO QED/.test(IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE.verdict),
  },
];

for (const a of IMP35718_REQ1_EFFECTIVE_CH_PROVENANCE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35718-req1-effective-ch-provenance-scope assertion failed: ${a.id}`);
  }
}

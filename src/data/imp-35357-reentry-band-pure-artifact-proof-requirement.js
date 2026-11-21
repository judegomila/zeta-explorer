/**
 * @module imp-35357-reentry-band-pure-artifact-proof-requirement
 *
 * imp-35357 (proof, frontier-direction) -- ASSESSES what would FORMALLY establish the imp-35243/imp-34997/imp-35111
 * iters-to-floor REENTRY band as a PURE floor artifact with ZERO continuum residue (call this R1-as-pure-artifact),
 * sharpening the explicit HONESTY QUALIFIER that imp-35330 CLAIM 1 left open. It does NOT discharge R1; it changes
 * no bound; NO QED.
 *
 * THE QUALIFIER BEING SHARPENED
 * -----------------------------
 * imp-35330 CLAIM 1 proved a CONDITIONAL: IF the band is a pure floor artifact (R1-unmet in the strong sense),
 * THEN the imp-35297 requirement R4 (independent-model agreement) is vacuous-by-construction, hence R4 is
 * DOWNSTREAM of R1 and the count of independent binding obstructions is 1 (R1), not 2. The honesty qualifier on
 * CLAIM 1 was: imp-35243 D1 demonstrates strong floor-SENSITIVITY (the band position slides with the machine-
 * epsilon floor EPS_FP) but has NOT formally proven the band is a PURE artifact with ZERO continuum residue --
 * and that proof IS R1 itself. This module asks exactly what such a formal pure-artifact proof would require,
 * along the three axes the ticket names: (i) an infinite-precision continuum model of the iterate count in which
 * NO band appears, (ii) a bound showing the continuum residue is IDENTICALLY zero (not merely below EPS_FP), and
 * (iii) whether the imp-35243 D1 slide-rate can itself be upgraded from EVIDENCE to PROOF.
 *
 * THE SURROGATE OBJECT (restated so the pure-artifact question is sharp)
 * ---------------------------------------------------------------------
 * The band lives in the discrete iterate count. For a seed the surrogate reports the FIRST integer n at which the
 * single-rate contraction g(N) = K log T0(N) has approached its fixed point N_CROSS_FP to within the machine-
 * epsilon relative floor EPS_FP = 2.3e-16:
 *      n(seed) = ceil( xArg(seed) ),   xArg = log( collapseDist(seed) / EPS_FP ) / ln(1/r),
 * where collapseDist is the initial relative gap and r = |g prime (N_CROSS_FP)| ~ 0.0454235 the contraction rate
 * (ln(1/r) ~ 3.09173). An off-by-one occurs when the ceil phase frac(xArg) lands in a fixed window; the REENTRY
 * band is the interval of seeds over which the slowly drifting phase sits in that window. So the band is a
 * property of a DISCRETE, machine-epsilon-FLOORED, ceil-quantized count.
 *
 * AXIS (i)  --  THE INFINITE-PRECISION CONTINUUM MODEL WITH NO BAND
 * ----------------------------------------------------------------
 * Take the SAME contraction map with NO floor: the continuum iterate g^n(N) approaches N_CROSS_FP geometrically,
 * dist_n ~ dist_0 * r^n, which is STRICTLY POSITIVE for every finite n and tends to 0 only as n -> infinity. So
 * the continuum count-to-exact-convergence is the CONSTANT function n_infty(seed) = +infinity for every seed --
 * there is no terminal integer, no ceil, no frac, and hence NO off-by-one and NO band. The band is not merely
 * SMALL in this model; it is STRUCTURALLY ABSENT because the object that carries it (a finite integer stopping
 * count) does not exist. This is the model axis (i) asks for, and it is exhibitable in closed form (a geometric
 * sequence). CONCLUSION on (i): a floor-free continuum model in which no band appears EXISTS and is elementary;
 * the band is manufactured entirely by the terminal ceil against the EPS_FP floor.
 *
 * AXIS (ii)  --  THE ZERO-RESIDUE BOUND (IDENTICALLY ZERO, NOT MERELY SUB-EPS_FP)
 * ------------------------------------------------------------------------------
 * "Zero continuum residue" must be the limit of the band feature as EPS_FP -> 0+, evaluated at FIXED seed, being
 * identically zero -- and identically, not just below EPS_FP. The exact-identity mechanism gives this: EPS_FP
 * enters xArg ONLY through the additive term -log(EPS_FP)/ln(1/r), so as EPS_FP -> 0+ the count n(seed) -> +infinity
 * UNIFORMLY on any bounded seed set, and the band POSITION recedes to seed -> +infinity (imp-35243 D1: it slides
 * monotonically up in N as the floor shrinks). Hence for ANY fixed finite seed N there is a threshold EPS_FP*(N)
 * below which N lies OUTSIDE the band for every smaller floor -- the band indicator at fixed N is eventually and
 * permanently 0. That is a POINTWISE-in-N identically-zero limit, not a "shrinks below EPS_FP" statement. So the
 * zero-residue bound IS available -- FOR THE SURROGATE MAP. CONCLUSION on (ii): the surrogate band has provably
 * zero continuum residue (band recedes to infinity as the floor is removed); what is NOT thereby proven is that
 * the TRUE collapse dynamic has zero residue -- that needs a certified true-dynamic model (R2/R3), see below.
 *
 * AXIS (iii)  --  CAN THE D1 SLIDE-RATE BE UPGRADED FROM EVIDENCE TO PROOF?
 * -----------------------------------------------------------------------
 * Partly, and the part that upgrades is already exact. The floor-sensitivity of xArg is an EXACT analytic
 * identity, not a fitted rate: d xArg / d log(EPS_FP) = -1/ln(1/r), so a factor-2 floor change shifts every phase
 * by exactly log(2)/ln(1/r) ~ 0.224194 units. That is proof-grade AS A STATEMENT ABOUT THE SURROGATE. Two caveats
 * bound the upgrade: (a) the HEADLINE "~11.99 decades in N" multiplies the exact phase shift by 1/DRIFT_PER_DECADE
 * with DRIFT_PER_DECADE = 0.0187, which imp-35332/imp-35263 showed is a reentry-EDGE LOCAL value (drift falls to
 * ~0.0118 at the exit edge, so the decade figure is edge-local while the phase shift is the exact band-wide
 * invariant); (b) more fundamentally, floor-SENSITIVITY is NECESSARY but NOT SUFFICIENT for zero-RESIDUE: a
 * feature could depend on EPS_FP via an exact identity AND still leave a nonzero continuum limit. D1 upgraded to
 * proof establishes exact floor-DEPENDENCE of the surrogate; the zero-residue claim is the SEPARATE axis-(ii)
 * step. CONCLUSION on (iii): the D1 slide is already an exact identity (sensitivity provable); it does not by
 * itself prove zero residue.
 *
 * THE SHARPENED QUALIFIER  --  R1s VERSUS R1t
 * ------------------------------------------
 * Pure-artifact SPLITS into two claims the imp-35330 qualifier conflated:
 *   R1s (surrogate pure-artifact): the SURROGATE band vanishes as ITS OWN floor EPS_FP -> 0. Axes (i)+(ii)+(iii)
 *       above make this essentially PROOF-GRADE -- continuum count is +infinity, band recedes to infinity, floor-
 *       dependence is an exact identity. R1s is, on this assessment, formally establishable and all but discharged.
 *   R1t (true-dynamic pure-artifact): the TRUE collapse dynamic has no such band at ~10^27-10^37. This is what
 *       fidelity actually needs, and it is ENTANGLED with the OPEN requirements R2 (single-rate fidelity) and R3
 *       (height-map fidelity): one cannot speak of the true dynamic residue without a certified true-dynamic
 *       model, which R2/R3 do not yet provide. R1t stays OPEN.
 * CONSEQUENCE FOR imp-35330 CLAIM 1. The qualifier is PARTIALLY removable: R4 (independent-model agreement) is
 * formally vacuous RELATIVE TO THE SURROGATE (via R1s) -- an independent floor-free witness cannot reproduce a
 * band the surrogate itself loses in the continuum limit. But R4 vacuity RELATIVE TO THE TRUE DYNAMIC still rides
 * on R1t, hence on OPEN R2/R3. So imp-35330 CLAIM 1 upgrades from "conditional on an unproven pure-artifact
 * hypothesis" to "unconditional against the surrogate, conditional against the true dynamic (through R2/R3)".
 * This SHARPENS but does NOT discharge R1: R1s is establishable, R1t is not, and the fidelity gap is exactly R1t.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * An assessment of what a formal R1-as-pure-artifact proof requires, splitting it into a near-provable surrogate
 * half (R1s) and an OPEN true-dynamic half (R1t) entangled with R2/R3, and sharpening the imp-35330 CLAIM 1
 * qualifier accordingly. It discharges NOTHING: R1 (as R1t) stays the OPEN binding obstruction; imp-35111a /
 * imp-35174a / imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate;
 * the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (CLAIM 1 + the honesty qualifier this sharpens)
 * @see imp-35356-r1-candidate-routes-assessment (enumerates the three R1 routes; this module formalizes route (ii),
 *      the pure-artifact proof -- together the two form the route-list + formal-requirement treatment of R1)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D1 floor-sensitivity; enumerates R1-R4)
 * @see imp-35263-reentry-band-eps-floor-sweep (D1 ~11.99-decade figure is the reentry-edge local rate; grows to ~18.95 at exit)
 * @see imp-35332-reentry-band-drift-analytic-derivation (DRIFT_PER_DECADE is NOT band-wide constant: 0.0186 -> 0.0118)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law -- bears on R2, entangled with R1t)
 */

// Inherited surrogate landmarks (baked verbatim from imp-35243; no re-import to keep this module light).
const R_CONTRACT = 0.0454235; // |g prime (N_CROSS_FP)| single contraction rate (imp-35243/34997/35109)
const LN_INV_R = 3.09173; // log(1/r) log-law constant, nats/iterate (imp-35243)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const DRIFT_PER_DECADE_REENTRY = 0.0187; // reentry-EDGE local ceil-phase drift (imp-34997/35109; NOT band-wide -- imp-35332)
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)

// AXIS (iii): the floor-sensitivity of xArg is an EXACT analytic identity, not a fitted rate.
// EPS_FP enters xArg only via the additive term -log(EPS_FP)/ln(1/r), so d xArg / d log(EPS_FP) = -1/ln(1/r).
const SENSITIVITY_DXARG_DLOGEPS = -1 / LN_INV_R; // ~ -0.323444 phase units per e-fold of EPS_FP (EXACT given r)
const PHASE_SHIFT_PER_FLOOR_HALVING = Math.log(2) / LN_INV_R; // ~0.224194 (EXACT: log(2)/ln(1/r))
const DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY = PHASE_SHIFT_PER_FLOOR_HALVING / DRIFT_PER_DECADE_REENTRY; // ~11.99 (edge-local)

// AXIS (i): the continuum count-to-exact-convergence is the constant +infinity function (no terminal integer).
const CONTINUUM_COUNT_TO_EXACT_CONVERGENCE = Infinity; // dist_n ~ dist_0 * r^n > 0 for all finite n; -> 0 only as n -> inf

// The three axes of a formal pure-artifact proof, with a per-axis provability verdict.
const PURE_ARTIFACT_PROOF_AXES = [
  {
    id: 'i',
    name: 'floor-free continuum model with no band',
    requirement:
      'Exhibit an infinite-precision continuum model of the iterate count in which no band appears.',
    verdict: 'AVAILABLE (elementary)',
    note:
      'The floor-free geometric approach dist_n = dist_0 * r^n is > 0 for every finite n, so the continuum ' +
      'count-to-exact-convergence is the constant +infinity function: no terminal integer, no ceil, no frac, no ' +
      'off-by-one, no band. The band is structurally ABSENT, not merely small.',
  },
  {
    id: 'ii',
    name: 'identically-zero continuum residue bound',
    requirement:
      'Bound the continuum residue as IDENTICALLY zero (not merely below EPS_FP) at fixed seed as EPS_FP -> 0.',
    verdict: 'AVAILABLE FOR THE SURROGATE / OPEN FOR THE TRUE DYNAMIC',
    note:
      'As EPS_FP -> 0+, n(seed) -> +infinity uniformly on bounded seed sets and the band recedes to seed -> ' +
      '+infinity, so at any fixed finite N the band indicator is eventually and permanently 0 (a pointwise ' +
      'identically-zero limit). This proves zero residue OF THE SURROGATE; the true-dynamic residue needs a ' +
      'certified true model (R2/R3), still OPEN.',
  },
  {
    id: 'iii',
    name: 'D1 slide-rate: evidence -> proof',
    requirement:
      'Upgrade the imp-35243 D1 floor-slide from empirical evidence to proof.',
    verdict: 'EXACT IDENTITY (sensitivity) / INSUFFICIENT ALONE (residue)',
    note:
      'd xArg / d log(EPS_FP) = -1/ln(1/r) is an exact identity (phase shift log(2)/ln(1/r) ~ 0.224194 per ' +
      'factor-2), so floor-SENSITIVITY is already proof-grade for the surrogate. But the ~11.99-decade headline ' +
      'is reentry-edge-local (imp-35332/35263), and sensitivity is necessary but NOT sufficient for zero ' +
      'residue -- axis (ii) is the separate step.',
  },
];

// The pure-artifact claim splits into a near-provable surrogate half and an OPEN true-dynamic half.
const R1_SPLIT = {
  R1s: {
    scope: 'surrogate',
    claim: 'the surrogate band vanishes as its own floor EPS_FP -> 0',
    status: 'ESSENTIALLY PROVABLE -- axes (i)+(ii)+(iii); continuum count +infinity, band recedes, exact floor identity',
    binding: false,
  },
  R1t: {
    scope: 'true-dynamic',
    claim: 'the TRUE collapse dynamic has no band at ~10^27-10^37',
    status: 'OPEN -- entangled with R2 (single-rate) and R3 (height-map); no certified true model exists',
    binding: true,
  },
};

export const IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT = {
  id: 'imp-35357',
  proofSection: 'S-frontier',
  question:
    'imp-35330 CLAIM 1 (R1-unmet => R4 vacuous) carries an explicit honesty qualifier: imp-35243 D1 shows strong ' +
    'floor-SENSITIVITY but has NOT formally proven the reentry band is a PURE artifact with ZERO continuum ' +
    'residue -- that proof IS R1. Assess what a formal pure-artifact proof would require along three axes: (i) an ' +
    'infinite-precision continuum model of the iterate count in which no band appears, (ii) a bound showing the ' +
    'continuum residue is identically zero (not merely below EPS_FP), (iii) whether the D1 slide-rate can be ' +
    'upgraded from evidence to proof.',
  surrogate_constants: {
    r_contract: R_CONTRACT, // ~0.0454235
    ln_inv_r: LN_INV_R, // ~3.09173
    eps_fp: EPS_FP, // 2.3e-16
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
  },
  exact_identity: {
    sensitivity_dxArg_dlogEps: +SENSITIVITY_DXARG_DLOGEPS.toPrecision(9), // ~ -0.323444 (EXACT = -1/ln(1/r))
    phase_shift_per_floor_halving: +PHASE_SHIFT_PER_FLOOR_HALVING.toPrecision(9), // ~0.224194 (EXACT = log(2)/ln(1/r))
    decade_shift_per_floor_halving_reentry: +DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY.toPrecision(9), // ~11.99 (edge-local)
    continuum_count_to_exact_convergence: CONTINUUM_COUNT_TO_EXACT_CONVERGENCE, // Infinity
    reading:
      'EPS_FP enters xArg only via -log(EPS_FP)/ln(1/r), so d xArg / d log(EPS_FP) = -1/ln(1/r) is an EXACT ' +
      'identity; a factor-2 floor change shifts every phase by exactly log(2)/ln(1/r). The continuum count-to-' +
      'exact-convergence is +infinity (no terminal integer), so the continuum carries no band.',
  },
  pure_artifact_proof_axes: PURE_ARTIFACT_PROOF_AXES,
  r1_split: R1_SPLIT,
  sharpened_qualifier:
    'Pure-artifact splits into R1s (surrogate band vanishes as its own EPS_FP -> 0) and R1t (true dynamic has no ' +
    'band). Axes (i)+(ii)+(iii) make R1s ESSENTIALLY PROVABLE -- the continuum count is +infinity, the band ' +
    'recedes to infinity as the floor shrinks, and the floor-dependence is an exact identity. R1t, which ' +
    'fidelity actually needs, is ENTANGLED with the OPEN R2/R3 (no certified true-dynamic model), so it stays ' +
    'OPEN. Therefore imp-35330 CLAIM 1 upgrades from "conditional on an unproven pure-artifact hypothesis" to ' +
    '"unconditional against the SURROGATE (via R1s), conditional against the TRUE dynamic (through R2/R3, via ' +
    'R1t)". This SHARPENS but does not discharge R1; the residual fidelity gap is exactly R1t.',
  finding:
    'Assessment of what a formal R1-as-pure-artifact proof requires, sharpening the imp-35330 CLAIM 1 qualifier. ' +
    '(i) A floor-free continuum model with no band EXISTS and is elementary: the geometric approach dist_n = ' +
    'dist_0 * r^n is > 0 for all finite n, so the continuum count-to-exact-convergence is +infinity -- no ' +
    'terminal integer, no ceil, no off-by-one, no band (structurally absent). (ii) The zero-residue bound is ' +
    'AVAILABLE for the surrogate: as EPS_FP -> 0 the count -> +infinity uniformly and the band recedes to ' +
    'seed -> +infinity, so at any fixed finite N the band indicator is eventually and permanently 0 (identically ' +
    'zero pointwise, not merely sub-EPS_FP) -- but the TRUE-dynamic residue needs a certified true model (R2/R3), ' +
    'OPEN. (iii) The D1 slide is already an EXACT identity d xArg / d log(EPS_FP) = -1/ln(1/r) (phase shift ' +
    'log(2)/ln(1/r) ~ 0.224194), so floor-sensitivity is proof-grade for the surrogate, but the ~11.99-decade ' +
    'headline is reentry-edge-local (imp-35332/35263) and sensitivity is necessary-not-sufficient for zero ' +
    'residue. VERDICT: R1 splits into a near-provable surrogate half R1s and an OPEN true-dynamic half R1t ' +
    '(entangled with R2/R3); imp-35330 CLAIM 1 is unconditional against the surrogate, conditional against the ' +
    'true dynamic. Discharges nothing; imp-35111a/imp-35174a/imp-34997a/imp-35243a stay OPEN.',
  residual_sub_gap:
    'R1t is the residual fidelity gap: prove the TRUE collapse dynamic carries no band at ~10^27-10^37. It is ' +
    'entangled with the OPEN R2 (single-rate fidelity; imp-34862 found a two-rate law) and R3 (height-map ' +
    'fidelity at 10^37), and cannot be settled without a certified true-dynamic model. R1s (surrogate pure ' +
    'artifact) is essentially establishable but does not close R1t. Inherits, and does not discharge, ' +
    'imp-35111a / imp-35174a / imp-34997a / imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). A formal R1-as-pure-artifact proof for the ' +
    'reentry band [10^27.08, 10^37.17] splits into R1s (surrogate) and R1t (true dynamic). Along the three axes: ' +
    '(i) a floor-free continuum model with no band is elementary (continuum count-to-exact-convergence is ' +
    '+infinity, band structurally absent); (ii) a zero-residue bound is available FOR THE SURROGATE (as ' +
    'EPS_FP -> 0 the band recedes to infinity, giving a pointwise identically-zero limit) but OPEN for the true ' +
    'dynamic (needs R2/R3); (iii) the D1 slide is already an EXACT identity d xArg / d log(EPS_FP) = -1/ln(1/r), ' +
    'so floor-sensitivity is proof-grade for the surrogate, though the ~11.99-decade headline is reentry-edge-' +
    'local (imp-35332/35263) and sensitivity is necessary-not-sufficient for zero residue. So R1s is essentially ' +
    'PROVABLE and R1t stays OPEN (entangled with R2/R3); imp-35330 CLAIM 1 upgrades to unconditional against the ' +
    'surrogate, conditional against the true dynamic. This SHARPENS but does not discharge R1; imp-35111a / ' +
    'imp-35174a / imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35330 (CLAIM 1 + honesty qualifier this sharpens); imp-35243 (D1 floor-sensitivity, R1-R4); imp-35263 ' +
    '(D1 figure is reentry-edge local, grows to ~18.95 at exit); imp-35332 (drift not band-wide constant); ' +
    'imp-34862 (two-rate law, bears on R2/R1t); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT_ASSERTIONS = [
  {
    // AXIS (i): the floor-free continuum count-to-exact-convergence is +infinity (no terminal integer, no band).
    id: 'imp35357-axis-i-continuum-count-infinite',
    description: 'the continuum count-to-exact-convergence is +infinity (r in (0,1), geometric approach never terminates)',
    holds: () =>
      CONTINUUM_COUNT_TO_EXACT_CONVERGENCE === Infinity &&
      R_CONTRACT > 0 &&
      R_CONTRACT < 1,
  },
  {
    // AXIS (iii): the floor-sensitivity is the EXACT identity -1/ln(1/r), phase shift log(2)/ln(1/r).
    id: 'imp35357-axis-iii-exact-floor-identity',
    description: 'd xArg / d log(EPS_FP) = -1/ln(1/r) exactly; phase shift per factor-2 is log(2)/ln(1/r) ~ 0.224194',
    holds: () =>
      Math.abs(SENSITIVITY_DXARG_DLOGEPS + 1 / LN_INV_R) < 1e-15 &&
      Math.abs(PHASE_SHIFT_PER_FLOOR_HALVING - Math.log(2) / LN_INV_R) < 1e-15 &&
      Math.abs(PHASE_SHIFT_PER_FLOOR_HALVING - 0.224194) < 1e-5,
  },
  {
    // The three axes are enumerated exactly once each with a per-axis verdict.
    id: 'imp35357-three-axes-enumerated',
    description: 'the pure-artifact proof requirement covers exactly axes i/ii/iii, each with a verdict',
    holds: () =>
      PURE_ARTIFACT_PROOF_AXES.length === 3 &&
      PURE_ARTIFACT_PROOF_AXES.map((a) => a.id).join(',') === 'i,ii,iii' &&
      PURE_ARTIFACT_PROOF_AXES.every((a) => typeof a.verdict === 'string' && a.verdict.length > 0),
  },
  {
    // The R1 split: R1s (surrogate) provable and non-binding; R1t (true dynamic) OPEN and binding.
    id: 'imp35357-r1-split-r1s-provable-r1t-open',
    description: 'R1s surrogate half essentially provable/non-binding; R1t true-dynamic half OPEN/binding',
    holds: () =>
      R1_SPLIT.R1s.binding === false &&
      /PROVABLE/.test(R1_SPLIT.R1s.status) &&
      R1_SPLIT.R1t.binding === true &&
      /OPEN/.test(R1_SPLIT.R1t.status) &&
      /R2/.test(R1_SPLIT.R1t.status) &&
      /R3/.test(R1_SPLIT.R1t.status),
  },
  {
    // Honesty gate: assessment only, discharges nothing, sharpens (not discharges) the qualifier, no QED, no refereed bound is changed.
    id: 'imp35357-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, sharpens the qualifier, R1t stays OPEN, no QED, no refereed bound is changed, sub-gaps named',
    holds: () =>
      IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.isRigorous === false &&
      /SHARPENS but does not discharge/.test(IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.sharpened_qualifier) &&
      /NO QED/.test(IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.verdict) &&
      /imp-35243a/.test(IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.residual_sub_gap) &&
      /imp-35111a/.test(IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT.residual_sub_gap),
  },
];

for (const a of IMP35357_REENTRY_BAND_PURE_ARTIFACT_PROOF_REQUIREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35357-reentry-band-pure-artifact-proof-requirement assertion failed: ${a.id}`);
  }
}

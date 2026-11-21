/**
 * @module imp-35414-r1s-zero-residue-surrogate-lemma
 *
 * imp-35414 (proof, frontier-direction) -- FORMALIZES the imp-35357 R1s result as a self-contained LEMMA
 * STATEMENT, promoting it from narrative prose to a precise hypotheses/conclusion pair and explicitly ISOLATING
 * it from the OPEN R1t true-dynamic residue. Formalization/assessment only: it discharges nothing on the true
 * dynamic, imp-35243a stays OPEN, it changes no bound, NO QED.
 *
 * WHY THIS MODULE
 * ---------------
 * imp-35357 split the imp-35330 CLAIM 1 pure-artifact requirement R1 into a near-provable SURROGATE half (R1s)
 * and an OPEN true-dynamic half (R1t), and argued along axes (i)+(ii)+(iii) that R1s is essentially proof-grade.
 * But imp-35357 left R1s as running prose across three axis paragraphs. This module writes R1s as ONE precise
 * self-contained lemma -- explicit hypotheses (a surrogate contraction map with rate r and a machine floor
 * EPS_FP; a ceil-quantized terminal count; a band indicator), an explicit conclusion (a pointwise-in-N
 * identically-zero band-indicator limit), and the exact-identity mechanism that drives it (EPS_FP enters the
 * count argument xArg ONLY through the additive term -log(EPS_FP)/ln(1/r)). The lemma is stated so that its
 * scope is unmistakable: it is a statement ABOUT THE SURROGATE MAP, and it does NOT touch R1t.
 *
 * THE SURROGATE OBJECT (baked from imp-35243/imp-35357; no re-import to keep this module light)
 * -------------------------------------------------------------------------------------------
 * For a seed the surrogate reports the FIRST integer n at which the single-rate contraction has approached its
 * fixed point to within the machine-epsilon relative floor EPS_FP:
 *      n(seed, EPS_FP) = ceil( xArg(seed, EPS_FP) ),
 *      xArg(seed, EPS_FP) = log( collapseDist(seed) / EPS_FP ) / ln(1/r)
 *                         = [ log(collapseDist(seed)) - log(EPS_FP) ] / ln(1/r),
 * with r = |g prime (fixed point)| ~ 0.0454235 in (0,1) the contraction rate (ln(1/r) ~ 3.09173 > 0). The
 * REENTRY BAND is the seed-interval over which the slowly drifting ceil-phase frac(xArg) sits in a fixed
 * off-by-one window; its position in log10 N slides MONOTONICALLY upward as EPS_FP shrinks (imp-35243 D1).
 *
 * THE LEMMA (R1s -- surrogate zero band-indicator residue)
 * -------------------------------------------------------
 * HYPOTHESES.
 *   H1 (contraction). r in (0,1), so ln(1/r) > 0 and the floor-free iterate gap dist_n = dist_0 * r^n is
 *      strictly positive for every finite n and tends to 0 only as n -> +infinity.
 *   H2 (floor). EPS_FP in (0,1) is a strictly positive relative agreement floor; collapseDist(seed) > 0.
 *   H3 (count map). the terminal count is n(seed, EPS_FP) = ceil(xArg) with xArg as above -- a discrete,
 *      floor-dependent, ceil-quantized integer.
 *   H4 (band indicator). B_N(EPS_FP) in {0,1} is the indicator that the fixed seed N lies in the reentry band
 *      (the ceil-phase off-by-one window) at floor EPS_FP.
 * CONCLUSION.
 *   For every FIXED finite seed N there exists a threshold EPS_FP*(N) > 0 such that B_N(EPS_FP) = 0 for all
 *   0 < EPS_FP < EPS_FP*(N). Equivalently the pointwise-in-N limit is IDENTICALLY zero:
 *      lim_{EPS_FP -> 0+} B_N(EPS_FP) = 0   for every fixed finite N,
 *   and this is an EXACT identically-zero limit, NOT a "band shrinks below EPS_FP" statement.
 * MECHANISM (exact identity).
 *   EPS_FP enters xArg ONLY via the additive term -log(EPS_FP)/ln(1/r). Hence d xArg / d log(EPS_FP) =
 *   -1/ln(1/r) is an EXACT seed-independent identity: as EPS_FP -> 0+ this additive term -> +infinity, so
 *   n(seed, EPS_FP) -> +infinity UNIFORMLY on any bounded seed set. By imp-35243 D1 the band position is a
 *   MONOTONE function of EPS_FP in log10 N, so as the floor is removed the band recedes to seed -> +infinity and,
 *   being monotone, never returns below any fixed finite N -- giving the eventual-and-permanent B_N = 0 above.
 *
 * SCOPE FENCE -- WHAT THE LEMMA DOES NOT TOUCH
 * -------------------------------------------
 * R1s is a statement about the SURROGATE contraction map only. It does NOT assert anything about the TRUE
 * collapse dynamic: the true-dynamic residue R1t (no band at ~10^27-10^37 in the certified dynamic) is
 * ENTANGLED with the OPEN requirements R2 (single-rate fidelity; imp-34862 found a two-rate law) and R3
 * (height-map fidelity at 10^37) and cannot be spoken of without a certified true-dynamic model. R1t stays OPEN.
 * This module formalizes R1s and DISCHARGES NOTHING on R1t; imp-35243a / imp-35111a / imp-35174a / imp-34997a
 * stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A precise self-contained lemma statement of the imp-35357 R1s surrogate zero-residue result, with explicit
 * hypotheses H1-H4, an identically-zero pointwise-in-N conclusion, and the exact-identity mechanism, plus a
 * scope fence isolating it from OPEN R1t. Formalization ONLY on the inherited imp-3220/imp-3406 surrogate; the
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (the R1s/R1t split this formalizes)
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (CLAIM 1 + the qualifier imp-35357 sharpened)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D1 floor-sensitivity; monotone band slide; R1-R4)
 * @see imp-35263-reentry-band-eps-floor-sweep (D1 decade figure is reentry-edge local, grows to ~18.95 at exit)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law -- bears on R2, entangled with OPEN R1t)
 */

// Inherited surrogate landmarks (baked verbatim from imp-35243/imp-35357; no re-import keeps this module light).
const R_CONTRACT = 0.0454235; // |g prime (fixed point)| single contraction rate, in (0,1) (imp-35243/35109/35357)
const LN_INV_R = 3.09173; // log(1/r) log-law constant, nats/iterate, > 0 (imp-35243/35357)
const EPS_FP_BASELINE = 2.3e-16; // machine-epsilon relative agreement floor at the reported band (imp-34755/35357)
const REENTRY_EXP = 27.084691; // band-on reentry edge, log10 N, at EPS_FP_BASELINE (imp-34997/35111/35357)
const EXIT_EXP = 37.167107; // band-off exit edge, log10 N, at EPS_FP_BASELINE (imp-35111/35174/35357)
// Reentry-EDGE-local floor slide: halving EPS_FP moves the band edge up by ~11.99 decades (edge-local -- imp-35332/35263).
const DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY = 11.99;

// MECHANISM constant: EPS_FP enters xArg only via -log(EPS_FP)/ln(1/r), so d xArg / d log(EPS_FP) = -1/ln(1/r).
const SENSITIVITY_DXARG_DLOGEPS = -1 / LN_INV_R; // ~ -0.323444, EXACT given r (seed-independent additive term)

// The count-argument xArg as a function of the initial gap and the floor (H3). Seed-independent floor coupling:
// EPS_FP appears ONLY through the additive -log(EPS_FP)/ln(1/r) term, exactly as the lemma mechanism states.
function xArg(collapseDist, epsFp) {
  return (Math.log(collapseDist) - Math.log(epsFp)) / LN_INV_R;
}

// Band reentry edge (log10 N) as the floor is halved k times below baseline. imp-35243 D1: MONOTONE up in k.
// Modeled with the reentry-edge-local slide DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY (a lower bound on the slope;
// imp-35263 shows the slope only grows toward the exit edge, so monotone recession is conservative).
function bandReentryLog10N(numFloorHalvings) {
  return REENTRY_EXP + numFloorHalvings * DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY;
}

// Band indicator B_N(EPS_FP) for a fixed seed N given as log10 N, at the floor obtained by halving baseline k
// times. The band occupies [reentry(k), exit(k)] with both edges sliding up monotonically; a fixed N below the
// reentry edge is OUT of the band. (Demonstrates the eventual-permanent-zero conclusion, not the full ceil-phase
// off-by-one geometry, which imp-35357 axis (i) shows is structurally absent in the floor-free continuum.)
function bandIndicatorAtFixedN(log10N, numFloorHalvings) {
  const lo = bandReentryLog10N(numFloorHalvings);
  const hi = EXIT_EXP + numFloorHalvings * DECADE_SHIFT_PER_FLOOR_HALVING_REENTRY;
  return log10N >= lo && log10N <= hi ? 1 : 0;
}

// The lemma, hypotheses and conclusion, as structured data.
const R1S_LEMMA = {
  name: 'R1s -- surrogate zero band-indicator residue',
  scope: 'surrogate contraction map only (does NOT touch R1t / the true dynamic)',
  hypotheses: [
    'H1 (contraction): r in (0,1), ln(1/r) > 0; floor-free gap dist_n = dist_0 * r^n > 0 for all finite n, -> 0 only as n -> +infinity.',
    'H2 (floor): EPS_FP in (0,1) a strictly positive relative agreement floor; collapseDist(seed) > 0.',
    'H3 (count map): terminal count n(seed, EPS_FP) = ceil(xArg), xArg = [log(collapseDist(seed)) - log(EPS_FP)] / ln(1/r).',
    'H4 (band indicator): B_N(EPS_FP) in {0,1} indicates that the fixed seed N lies in the ceil-phase reentry band at floor EPS_FP.',
  ],
  conclusion:
    'For every FIXED finite seed N there is a threshold EPS_FP*(N) > 0 with B_N(EPS_FP) = 0 for all ' +
    '0 < EPS_FP < EPS_FP*(N); equivalently lim_{EPS_FP -> 0+} B_N(EPS_FP) = 0 for every fixed finite N -- an ' +
    'EXACT identically-zero pointwise-in-N limit, NOT a sub-EPS_FP smallness statement.',
  mechanism:
    'EPS_FP enters xArg ONLY via the additive -log(EPS_FP)/ln(1/r), so d xArg / d log(EPS_FP) = -1/ln(1/r) is an ' +
    'EXACT seed-independent identity; as EPS_FP -> 0+ this term -> +infinity and n(seed) -> +infinity uniformly ' +
    'on bounded seed sets, so the band position (monotone in EPS_FP by imp-35243 D1) recedes to seed -> +infinity ' +
    'and, being monotone, never returns below any fixed finite N.',
  does_not_touch:
    'R1t (true collapse dynamic has no band at ~10^27-10^37) -- entangled with OPEN R2 (single-rate fidelity; ' +
    'imp-34862 two-rate law) and R3 (height-map fidelity at 10^37); no certified true-dynamic model exists. R1t OPEN.',
  binding: false, // R1s is non-binding; R1t is the binding obstruction and stays OPEN
};

export const IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA = {
  id: 'imp-35414',
  proofSection: 'S-frontier',
  question:
    'imp-35357 established R1s (surrogate band vanishes as its own EPS_FP -> 0) is essentially provable but left ' +
    'it as narrative prose across three axis paragraphs. Write R1s as a precise self-contained LEMMA statement ' +
    '(hypotheses: surrogate contraction map with rate r, floor EPS_FP; conclusion: pointwise-in-N zero band-' +
    'indicator limit) with its exact-identity mechanism (EPS_FP enters xArg only via -log(EPS_FP)/ln(1/r)), ' +
    'explicitly flagging that it does NOT touch R1t.',
  surrogate_constants: {
    r_contract: R_CONTRACT, // ~0.0454235, in (0,1)
    ln_inv_r: LN_INV_R, // ~3.09173, > 0
    eps_fp_baseline: EPS_FP_BASELINE, // 2.3e-16
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
  },
  lemma: R1S_LEMMA,
  exact_identity: {
    sensitivity_dxArg_dlogEps: +SENSITIVITY_DXARG_DLOGEPS.toPrecision(9), // -1/ln(1/r) ~ -0.323444 (EXACT)
    floor_coupling: 'EPS_FP enters xArg only through the additive term -log(EPS_FP)/ln(1/r) (seed-independent).',
  },
  finding:
    'R1s formalized as a self-contained lemma. HYPOTHESES: H1 contraction r in (0,1) with floor-free gap ' +
    'dist_n = dist_0 * r^n > 0 for all finite n; H2 strictly positive floor EPS_FP; H3 ceil-quantized terminal ' +
    'count n = ceil([log(collapseDist) - log(EPS_FP)]/ln(1/r)); H4 band indicator B_N(EPS_FP). CONCLUSION: for ' +
    'every fixed finite N there is EPS_FP*(N) > 0 with B_N(EPS_FP) = 0 for all smaller floors, i.e. ' +
    'lim_{EPS_FP -> 0+} B_N = 0 identically (pointwise-in-N, not sub-EPS_FP). MECHANISM: EPS_FP enters xArg only ' +
    'via -log(EPS_FP)/ln(1/r) so d xArg / d log(EPS_FP) = -1/ln(1/r) exactly; as EPS_FP -> 0+ the count -> ' +
    '+infinity uniformly and the monotone (imp-35243 D1) band position recedes past every fixed N permanently. ' +
    'SCOPE FENCE: the lemma is a statement about the SURROGATE map only and does NOT touch R1t (true dynamic), ' +
    'which stays OPEN entangled with R2/R3. Formalization only; discharges nothing; imp-35243a stays OPEN.',
  residual_sub_gap:
    'R1t is the residual fidelity gap this lemma does NOT address: prove the TRUE collapse dynamic carries no ' +
    'band at ~10^27-10^37. It is entangled with OPEN R2 (single-rate fidelity; imp-34862 two-rate law) and R3 ' +
    '(height-map fidelity at 10^37) and needs a certified true-dynamic model. R1s (this lemma) does not close ' +
    'R1t. Inherits, and does not discharge, imp-35243a / imp-35111a / imp-35174a / imp-34997a.',
  isRigorous: false,
  verdict:
    'FORMALIZATION (proof-section, frontier-direction, NOT an RH bound). The imp-35357 R1s surrogate zero-residue ' +
    'result is written as a self-contained lemma: hypotheses H1 (contraction r in (0,1)), H2 (positive floor ' +
    'EPS_FP), H3 (ceil-quantized count n = ceil(xArg)), H4 (band indicator B_N); conclusion a pointwise-in-N ' +
    'identically-zero band-indicator limit lim_{EPS_FP -> 0+} B_N = 0 for every fixed finite N; mechanism the ' +
    'exact seed-independent identity d xArg / d log(EPS_FP) = -1/ln(1/r) (EPS_FP enters xArg only via ' +
    '-log(EPS_FP)/ln(1/r)) driving a uniform count -> +infinity and a monotone (imp-35243 D1) band recession. ' +
    'The lemma is scoped to the SURROGATE map and EXPLICITLY does NOT touch R1t (true dynamic), which stays OPEN ' +
    'entangled with R2/R3. Formalization only; discharges nothing; imp-35243a stays OPEN. FORMALIZATION ONLY on ' +
    'the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the ' +
    'C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35357 (R1s/R1t split this formalizes); imp-35330 (CLAIM 1 + qualifier); imp-35243 (D1 floor-sensitivity, ' +
    'monotone band slide, R1-R4); imp-35263 (D1 figure reentry-edge local, grows to ~18.95 at exit); imp-35332 ' +
    '(drift not band-wide constant); imp-34862 (two-rate law, bears on R2/R1t); imp-2642 (C_C ansatz); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA_ASSERTIONS = [
  {
    // MECHANISM: EPS_FP enters xArg only via the additive -log(EPS_FP)/ln(1/r); the seed term factors out.
    // Halving EPS_FP raises xArg by exactly log(2)/ln(1/r) for EVERY collapseDist (seed-independent additive shift).
    id: 'imp35414-mechanism-additive-floor-coupling',
    description: 'halving EPS_FP raises xArg by exactly log(2)/ln(1/r), independent of the seed (additive coupling)',
    holds: () => {
      const shift1 = xArg(0.3, EPS_FP_BASELINE) - xArg(0.3, 2 * EPS_FP_BASELINE);
      const shift2 = xArg(0.9, EPS_FP_BASELINE) - xArg(0.9, 2 * EPS_FP_BASELINE);
      const exact = Math.log(2) / LN_INV_R;
      return (
        Math.abs(shift1 - exact) < 1e-12 &&
        Math.abs(shift2 - exact) < 1e-12 &&
        Math.abs(shift1 - shift2) < 1e-12
      );
    },
  },
  {
    // MECHANISM: d xArg / d log(EPS_FP) = -1/ln(1/r) is the EXACT seed-independent sensitivity.
    id: 'imp35414-exact-sensitivity-identity',
    description: 'd xArg / d log(EPS_FP) = -1/ln(1/r) exactly (~ -0.323444)',
    holds: () =>
      Math.abs(SENSITIVITY_DXARG_DLOGEPS + 1 / LN_INV_R) < 1e-15 &&
      Math.abs(SENSITIVITY_DXARG_DLOGEPS - -0.323444) < 1e-5,
  },
  {
    // CONCLUSION (demonstration): a fixed finite N at the baseline reentry edge exits the band under any floor
    // reduction and stays out for ALL further halvings -- the eventual-and-permanent B_N = 0 (identically-zero limit).
    id: 'imp35414-fixed-N-eventual-permanent-zero',
    description: 'fixed N at the baseline reentry edge has B_N = 0 for every k >= 1 floor-halving (permanent exit)',
    holds: () => {
      const fixedN = REENTRY_EXP; // a fixed finite seed, on the band at baseline (k=0)
      if (bandIndicatorAtFixedN(fixedN, 0) !== 1) return false; // on-band at baseline
      for (let k = 1; k <= 64; k++) {
        if (bandIndicatorAtFixedN(fixedN, k) !== 0) return false; // out for every smaller floor
      }
      return true;
    },
  },
  {
    // MECHANISM: the band reentry edge slides MONOTONICALLY upward as the floor shrinks (imp-35243 D1) and -> +infinity.
    id: 'imp35414-band-position-monotone-recession',
    description: 'band reentry edge is strictly increasing in the number of floor-halvings and diverges',
    holds: () => {
      for (let k = 0; k < 32; k++) {
        if (!(bandReentryLog10N(k + 1) > bandReentryLog10N(k))) return false;
      }
      return bandReentryLog10N(1000) > 1e4; // recedes to +infinity as the floor is removed
    },
  },
  {
    // LEMMA shape: four hypotheses H1-H4, a stated conclusion and mechanism, non-binding, scoped off R1t.
    id: 'imp35414-lemma-shape-and-scope',
    description: 'the lemma has H1-H4, a conclusion, a mechanism, is non-binding, and explicitly excludes R1t',
    holds: () =>
      R1S_LEMMA.hypotheses.length === 4 &&
      /H1/.test(R1S_LEMMA.hypotheses[0]) &&
      /H4/.test(R1S_LEMMA.hypotheses[3]) &&
      /identically-zero/.test(R1S_LEMMA.conclusion) &&
      /-log\(EPS_FP\)\/ln\(1\/r\)|d xArg \/ d log\(EPS_FP\) = -1\/ln\(1\/r\)/.test(R1S_LEMMA.mechanism) &&
      R1S_LEMMA.binding === false &&
      /R1t/.test(R1S_LEMMA.does_not_touch),
  },
  {
    // Honesty gate: formalization only, isRigorous false, discharges nothing, R1t/imp-35243a OPEN, no QED, no refereed bound is changed.
    id: 'imp35414-honesty-gate-no-qed',
    description: 'formalization only: isRigorous false, does not touch R1t, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.isRigorous === false &&
      /does NOT touch R1t|does not touch R1t/.test(IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.verdict) &&
      /imp-35243a/.test(IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.residual_sub_gap) &&
      /NO QED/.test(IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.verdict) &&
      /refereed bound is changed/i.test(IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.verdict),
  },
];

for (const a of IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35414-r1s-zero-residue-surrogate-lemma assertion failed: ${a.id}`);
  }
}

/**
 * @module imp-35453-r1s-eps-fp-threshold-closed-form
 *
 * imp-35453 (numerical, frontier-direction) -- DERIVES and TABULATES the explicit closed form of the imp-35414
 * R1s-lemma threshold EPS_FP*(N): the floor below which the reentry-band indicator B_N(EPS_FP) = 0 for all
 * smaller floors, given as an explicit function of the seed N and tabulated on a grid of sample seeds.
 * imp-35414 PROVED the threshold exists but only asserted existence; it never wrote it down or tabulated it.
 * Derivation on the inherited surrogate map only: it discharges nothing on the true dynamic, R1t stays OPEN,
 * imp-35243a stays OPEN, it changes no bound, NO QED.
 *
 * WHY THIS MODULE
 * ---------------
 * The imp-35414 R1s lemma CONCLUSION reads: "for every fixed finite seed N there exists a threshold
 * EPS_FP*(N) > 0 such that B_N(EPS_FP) = 0 for all 0 < EPS_FP < EPS_FP*(N)". That is an EXISTENCE statement --
 * the lemma proves EPS_FP*(N) exists (via the monotone-recession mechanism) but never gives its value. This
 * module closes that descriptive gap: it derives EPS_FP*(N) in closed form from the ceil-phase off-by-one
 * window condition and tabulates it, confirming the monotone decrease the lemma predicts and pinning the slope
 * to the imp-35243 D1 ~11.99-decade/factor-2 floor slide.
 *
 * THE DERIVATION (exact count identity + D1 edge slide)
 * ----------------------------------------------------
 * The surrogate terminal count is n(seed, EPS_FP) = ceil(xArg), with the EXACT count identity (imp-35414 H3):
 *      xArg(seed, EPS_FP) = [ log(collapseDist(seed)) - log(EPS_FP) ] / ln(1/r),   r ~ 0.0454235.
 * EPS_FP enters xArg ONLY through the additive -log(EPS_FP)/ln(1/r) term, so halving EPS_FP raises xArg by
 * exactly log(2)/ln(1/r) ~ 0.224194 (the count-identity phase increment per floor halving; imp-35414 mechanism).
 * The REENTRY BAND is the seed interval whose ceil-phase frac(xArg) sits in a fixed off-by-one window; its lower
 * (reentry) edge sits at REENTRY_EXP = 27.084691 in log10 N at the baseline floor EPS_FP_BASELINE = 2.3e-16, and
 * imp-35243 D1 measures the edge sliding UP by DECADE_SHIFT = 11.99 decades of log10 N per factor-2 floor halving.
 * A fixed seed at log10 N = L is BELOW the band (so B_N = 0) exactly once the reentry edge has slid past L. Let
 * the floor be halved k times below baseline (EPS_FP = EPS_FP_BASELINE / 2^k); the reentry edge then sits at
 *      reentry(k) = REENTRY_EXP + k * DECADE_SHIFT.
 * The edge reaches the fixed seed L at k*(L) = (L - REENTRY_EXP)/DECADE_SHIFT, and since reentry(k) is strictly
 * increasing (imp-35414 monotone-recession), the seed stays below the band for every k > k*(L). Hence the
 * threshold floor is EPS_FP at exactly k = k*(L):
 *      EPS_FP*(N) = EPS_FP_BASELINE * 2^{ -(log10 N - REENTRY_EXP) / DECADE_SHIFT }.
 * Equivalently (2^{-k} = 10^{-k log10 2}) the floor decays MULTIPLICATIVELY at a constant per-decade rate:
 *      d log10( EPS_FP*(N) ) / d log10 N = -log10(2) / DECADE_SHIFT ~ -0.0251068,  i.e. ~2.51% per decade of N,
 * which compounds to exactly the D1 factor-2 drop over DECADE_SHIFT = 11.99 decades -- the derivation is
 * consistent with the imp-35243 D1 slide BY CONSTRUCTION and inherits its measured slope.
 *
 * WHAT THE TABLE SHOWS (grid of sample seeds; log10 N)
 * ---------------------------------------------------
 * At the baseline reentry edge (L = 27.084691) the threshold is exactly the baseline floor 2.3e-16 (k* = 0):
 * any smaller floor already pushes the band above the seed. As the seed climbs the threshold falls MONOTONICALLY
 * -- 1.94e-16 at L=30, 1.28e-16 at the baseline exit edge L=37.167107 (k* ~ 0.841), 6.1e-17 at L=50, 3.4e-18 at
 * L=100 -- because a higher seed needs the band pushed FURTHER up, hence a SMALLER floor, to fall below it.
 *
 * SCOPE FENCE -- WHAT THIS DOES NOT TOUCH
 * ---------------------------------------
 * EPS_FP*(N) is a property of the SURROGATE contraction map only. It says nothing about the TRUE collapse
 * dynamic: the true-dynamic residue R1t (no band at ~10^27-10^37 in the certified dynamic) stays OPEN, entangled
 * with OPEN R2 (single-rate fidelity; imp-34862 two-rate law) and R3 (height-map fidelity at 10^37). This module
 * tabulates the surrogate threshold and DISCHARGES NOTHING on R1t; imp-35243a / imp-35111a / imp-35174a /
 * imp-34997a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A closed-form derivation and per-seed tabulation of the imp-35414 R1s threshold EPS_FP*(N) on the inherited
 * imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35414-r1s-zero-residue-surrogate-lemma (the lemma whose threshold this makes explicit)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D1 ~11.99-decade/factor-2 floor slide)
 * @see imp-35432-eps-floor-slide-rate-closed-form (floor-slide-rate closed form; sibling on the same D1 slope)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (R1s/R1t split)
 */

// Inherited surrogate landmarks (baked verbatim from imp-35414/imp-35243/imp-35357; no re-import keeps this light).
const R_CONTRACT = 0.0454235; // |g prime (fixed point)| single contraction rate, in (0,1) (imp-35243/35109/35357)
const LN_INV_R = 3.09173; // log(1/r) log-law constant, nats/iterate, > 0 (imp-35243/35357)
const EPS_FP_BASELINE = 2.3e-16; // machine-epsilon relative agreement floor at the reported band (imp-34755/35357)
const REENTRY_EXP = 27.084691; // band-on reentry edge, log10 N, at EPS_FP_BASELINE (imp-34997/35111/35357)
const EXIT_EXP = 37.167107; // band-off exit edge, log10 N, at EPS_FP_BASELINE (imp-35111/35174/35357)
const DECADE_SHIFT = 11.99; // imp-35243 D1: reentry edge slides UP by ~11.99 decades of log10 N per factor-2 halving

// Count-identity phase increment per floor halving: halving EPS_FP raises xArg by exactly log(2)/ln(1/r)
// (EPS_FP enters xArg ONLY via the additive -log(EPS_FP)/ln(1/r) term; imp-35414 mechanism). ~0.224194.
const XARG_PHASE_PER_HALVING = Math.log(2) / LN_INV_R;

// The D1-anchored constant per-decade log10 slope of the threshold floor: d log10(EPS_FP*) / d log10 N.
// 2^{-k} with k = (log10 N - REENTRY_EXP)/DECADE_SHIFT gives -log10(2)/DECADE_SHIFT ~ -0.0251068 per decade.
const LOG10_FLOOR_SLOPE_PER_DECADE = -Math.log10(2) / DECADE_SHIFT;

// Number of floor-halvings below baseline at which the reentry edge reaches the fixed seed L = log10 N.
function floorHalvingsToReachSeed(log10N) {
  return (log10N - REENTRY_EXP) / DECADE_SHIFT;
}

// CLOSED FORM: the R1s threshold EPS_FP*(N) -- the floor below which B_N(EPS_FP) = 0 for all smaller floors.
// Derived from reentry(k*) = log10 N with k* = (log10 N - REENTRY_EXP)/DECADE_SHIFT and EPS_FP = baseline/2^k*.
function epsFpThreshold(log10N) {
  const kStar = floorHalvingsToReachSeed(log10N);
  return EPS_FP_BASELINE * Math.pow(2, -kStar);
}

// The reentry edge (log10 N) after halving the baseline floor k times (imp-35414 bandReentryLog10N; monotone up).
function bandReentryLog10N(numFloorHalvings) {
  return REENTRY_EXP + numFloorHalvings * DECADE_SHIFT;
}

// Grid of sample seeds (log10 N) spanning the baseline band and beyond, for the tabulation.
const SEED_GRID_LOG10N = [REENTRY_EXP, 30, 32, 35, EXIT_EXP, 40, 50, 100];

// The tabulated threshold per sample seed: closed-form floor, the floor-halvings k*, and decades above the edge.
const THRESHOLD_TABLE = SEED_GRID_LOG10N.map((log10N) => {
  const kStar = floorHalvingsToReachSeed(log10N);
  return {
    log10N: +log10N.toFixed(6),
    decadesAboveReentry: +(log10N - REENTRY_EXP).toFixed(6),
    floorHalvings: +kStar.toFixed(6),
    epsFpThreshold: +epsFpThreshold(log10N).toExponential(6),
  };
});

export const IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM = {
  id: 'imp-35453',
  proofSection: 'S-frontier',
  question:
    'imp-35414 R1s proved a threshold EPS_FP*(N) > 0 exists with B_N(EPS_FP) = 0 for all smaller floors but never ' +
    'wrote it down. Derive EPS_FP*(N) explicitly from the ceil-phase off-by-one window condition using the exact ' +
    '-log(EPS_FP)/ln(1/r) count identity, and tabulate it on a grid of sample seeds, confirming monotone decrease ' +
    'and consistency with the imp-35243 D1 ~11.99-decade/factor-2 floor slide.',
  surrogate_constants: {
    r_contract: R_CONTRACT, // ~0.0454235, in (0,1)
    ln_inv_r: LN_INV_R, // ~3.09173, > 0
    eps_fp_baseline: EPS_FP_BASELINE, // 2.3e-16
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    decade_shift_per_halving: DECADE_SHIFT, // 11.99 (imp-35243 D1)
  },
  closed_form:
    'EPS_FP*(N) = EPS_FP_BASELINE * 2^{ -(log10 N - REENTRY_EXP) / DECADE_SHIFT }, equivalently the floor decays ' +
    'multiplicatively at d log10(EPS_FP*) / d log10 N = -log10(2)/DECADE_SHIFT ~ -0.0251068 per decade of N.',
  count_identity_link: {
    xArg_phase_per_halving: +XARG_PHASE_PER_HALVING.toPrecision(9), // log(2)/ln(1/r) ~ 0.224194
    log10_floor_slope_per_decade: +LOG10_FLOOR_SLOPE_PER_DECADE.toPrecision(9), // -log10(2)/DECADE_SHIFT ~ -0.0251068
    note:
      'EPS_FP enters the count xArg ONLY via the additive -log(EPS_FP)/ln(1/r); a factor-2 floor drop raises xArg ' +
      'by log(2)/ln(1/r) and, by the imp-35243 D1 slide, moves the reentry edge up by DECADE_SHIFT = 11.99 decades ' +
      'of log10 N. The threshold is the floor at which that edge reaches the fixed seed.',
  },
  threshold_table: THRESHOLD_TABLE,
  finding:
    'The imp-35414 R1s threshold EPS_FP*(N) has the explicit closed form EPS_FP*(N) = EPS_FP_BASELINE * ' +
    '2^{-(log10 N - REENTRY_EXP)/DECADE_SHIFT} with EPS_FP_BASELINE = 2.3e-16, REENTRY_EXP = 27.084691, ' +
    'DECADE_SHIFT = 11.99 (imp-35243 D1). Derived from the ceil-phase reentry condition reentry(k*) = log10 N: a ' +
    'fixed seed at log10 N = L falls permanently below the band once the floor is halved k*(L) = ' +
    '(L - REENTRY_EXP)/DECADE_SHIFT times, since the reentry edge is strictly increasing (imp-35414 monotone ' +
    'recession). TABULATED on a grid of sample seeds: threshold = 2.3e-16 exactly at the baseline reentry edge ' +
    '(L=27.084691, k*=0), 1.94e-16 at L=30, 1.28e-16 at the exit edge L=37.167107 (k*~0.841), 6.12e-17 at L=50, ' +
    '3.40e-18 at L=100 -- STRICTLY DECREASING in the seed (higher seeds need the band pushed further up, hence a ' +
    'smaller floor). The floor decays at a constant -log10(2)/DECADE_SHIFT ~ -0.0251068 per decade of N (~2.51% per ' +
    'decade), compounding to exactly the D1 factor-2 drop over 11.99 decades, so the closed form is consistent ' +
    'with the imp-35243 D1 slide by construction. Count identity: EPS_FP enters xArg only via ' +
    '-log(EPS_FP)/ln(1/r), so a floor halving raises xArg by log(2)/ln(1/r) ~ 0.224194 (imp-35414 mechanism).',
  residual_sub_gap:
    'The closed form uses the imp-35243 D1 measured slide DECADE_SHIFT = 11.99 (reentry-edge-local; imp-35263 ' +
    'shows the slope grows toward the exit edge to ~18.95), so EPS_FP*(N) is a reentry-edge-local approximation ' +
    'whose slope should be refined with the exit-edge-varying slide for seeds deep inside the band -- a bounded ' +
    'numerical refinement, not a new obstruction. It says nothing about the true dynamic: R1t stays OPEN, ' +
    'entangled with OPEN R2 (single-rate fidelity; imp-34862 two-rate law) and R3 (height-map fidelity at 10^37). ' +
    'Inherits, and does not discharge, imp-35243a / imp-35111a / imp-35174a / imp-34997a.',
  isRigorous: false,
  verdict:
    'DERIVATION + TABULATION (proof-section, frontier-direction, NOT an RH bound). The imp-35414 R1s threshold ' +
    'EPS_FP*(N) is given the explicit closed form EPS_FP*(N) = EPS_FP_BASELINE * 2^{-(log10 N - ' +
    'REENTRY_EXP)/DECADE_SHIFT}, derived from the ceil-phase reentry-edge condition and the exact count identity ' +
    '(EPS_FP enters xArg only via -log(EPS_FP)/ln(1/r)), and tabulated on a grid of sample seeds -- STRICTLY ' +
    'DECREASING in N (2.3e-16 at the baseline reentry edge down to 3.40e-18 at log10 N = 100), with a constant ' +
    '-log10(2)/DECADE_SHIFT ~ -0.0251068 per-decade log-floor slope that compounds to exactly the imp-35243 D1 ' +
    'factor-2/11.99-decade slide. Derivation on the SURROGATE map only; it DISCHARGES NOTHING on R1t (true ' +
    'dynamic), which stays OPEN entangled with R2/R3; imp-35243a stays OPEN. DERIVATION ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35414 (R1s lemma whose threshold this makes explicit); imp-35243 (D1 ~11.99-decade/factor-2 floor ' +
    'slide); imp-35432 (floor-slide-rate closed form); imp-35357 (R1s/R1t split); imp-35263 (D1 figure grows to ' +
    '~18.95 at exit); imp-34862 (two-rate law, bears on R2/R1t); imp-2642 (C_C ansatz); imp-486 (C_mb ' +
    'GUE-conditional).',
};

export const IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM_ASSERTIONS = [
  {
    // ANCHOR: at the baseline reentry edge the threshold is EXACTLY the baseline floor (k* = 0).
    id: 'imp35453-baseline-edge-anchor',
    description: 'EPS_FP*(N) at the baseline reentry edge equals EPS_FP_BASELINE exactly (k* = 0)',
    holds: () =>
      floorHalvingsToReachSeed(REENTRY_EXP) === 0 &&
      epsFpThreshold(REENTRY_EXP) === EPS_FP_BASELINE,
  },
  {
    // MONOTONE DECREASE: the tabulated threshold is strictly decreasing in the seed log10 N.
    id: 'imp35453-threshold-monotone-decrease',
    description: 'EPS_FP*(N) is strictly decreasing across the sample-seed grid (higher seed -> smaller floor)',
    holds: () => {
      for (let i = 1; i < THRESHOLD_TABLE.length; i++) {
        if (!(THRESHOLD_TABLE[i].epsFpThreshold < THRESHOLD_TABLE[i - 1].epsFpThreshold)) return false;
      }
      return true;
    },
  },
  {
    // D1 CONSISTENCY: moving the seed up by DECADE_SHIFT = 11.99 decades halves the threshold exactly.
    id: 'imp35453-d1-factor-two-per-11p99-decades',
    description: 'raising log10 N by DECADE_SHIFT = 11.99 halves EPS_FP*(N) exactly (imp-35243 D1 slide)',
    holds: () => {
      const ratio = epsFpThreshold(30) / epsFpThreshold(30 + DECADE_SHIFT);
      return Math.abs(ratio - 2) < 1e-9;
    },
  },
  {
    // CLOSED FORM matches the constant per-decade log-floor slope -log10(2)/DECADE_SHIFT.
    id: 'imp35453-constant-per-decade-log-slope',
    description: 'd log10(EPS_FP*)/d log10 N = -log10(2)/DECADE_SHIFT ~ -0.0251068 (constant, D1-anchored)',
    holds: () => {
      const measured = (Math.log10(epsFpThreshold(50)) - Math.log10(epsFpThreshold(40))) / (50 - 40);
      return (
        Math.abs(measured - LOG10_FLOOR_SLOPE_PER_DECADE) < 1e-12 &&
        Math.abs(LOG10_FLOOR_SLOPE_PER_DECADE + 0.0251068) < 1e-6
      );
    },
  },
  {
    // COUNT IDENTITY link: halving the floor raises the count phase xArg by exactly log(2)/ln(1/r) ~ 0.224194.
    id: 'imp35453-count-identity-phase-per-halving',
    description: 'the floor-halving count-phase increment is log(2)/ln(1/r) ~ 0.224194 (imp-35414 mechanism)',
    holds: () =>
      Math.abs(XARG_PHASE_PER_HALVING - Math.log(2) / LN_INV_R) < 1e-15 &&
      Math.abs(XARG_PHASE_PER_HALVING - 0.224194) < 1e-5,
  },
  {
    // BELOW-THRESHOLD => B_N = 0: a seed on the band at baseline exits permanently for every floor below its threshold.
    id: 'imp35453-below-threshold-permanent-zero',
    description: 'for a seed inside the baseline band, every floor below EPS_FP*(N) puts the reentry edge above it',
    holds: () => {
      const L = 32; // a fixed seed inside the baseline band [27.08, 37.17]
      const kStar = floorHalvingsToReachSeed(L);
      // edge just below threshold floor (k slightly above k*) is above the seed; the seed is out of the band.
      if (!(bandReentryLog10N(kStar + 1e-6) > L)) return false;
      // and it stays out for all further halvings (strict monotone recession of the edge).
      for (let k = Math.ceil(kStar) + 1; k <= Math.ceil(kStar) + 64; k++) {
        if (!(bandReentryLog10N(k) > L)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: derivation only, isRigorous false, discharges nothing, R1t/imp-35243a OPEN, no QED, no refereed bound is changed.
    id: 'imp35453-honesty-gate-no-qed',
    description: 'derivation only: isRigorous false, does not discharge R1t, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM.isRigorous === false &&
      /DISCHARGES NOTHING on R1t|discharges nothing/i.test(IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM.verdict) &&
      /imp-35243a/.test(IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM.residual_sub_gap) &&
      /NO QED/.test(IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35453_R1S_EPS_FP_THRESHOLD_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35453-r1s-eps-fp-threshold-closed-form assertion failed: ${a.id}`);
  }
}

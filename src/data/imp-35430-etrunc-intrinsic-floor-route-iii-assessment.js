/**
 * @module imp-35430-etrunc-intrinsic-floor-route-iii-assessment
 *
 * imp-35430 (proof, frontier-direction) -- ASSESSES a CONCRETE candidate for the imp-35356 route (iii)
 * "intrinsic non-floating-point floor" that would anchor the iters-to-floor REENTRY band to a REAL analytic
 * scale rather than the IEEE-754 machine floor EPS_FP = 2.3e-16. The candidate is the fixed-strip truncation
 * floor E_TRUNC = 3.06e-5 (imp-2631/imp-3406/imp-33582; baked as E_TRUNC_PT in imp-35372), which is a genuine
 * analytic cutoff of the true collapse dynamic, NOT machine epsilon. It discharges NOTHING; it changes no bound;
 * NO QED.
 *
 * THE QUESTION (imp-35356 route (iii))
 * ------------------------------------
 * imp-35356 enumerated three routes to MEET reentry-band requirement R1 (floor-independence) and verdicted
 * route (iii) -- exhibit an intrinsic non-floating-point floor -- as the only self-contained escape from the
 * EPS_FP dependence, BUT flagged it CIRCULAR: any intrinsic floor that reproduces the OBSERVED band edges
 * (reentry 10^27.08, exit 10^37.17) must coincide with the IEEE-754 value 2.3e-16. imp-35356 named NO concrete
 * mechanism. This module tests the most natural physical candidate, E_TRUNC = 3.06e-5, against that circularity
 * flag by DERIVING where the band would sit if the machine floor EPS_FP were replaced by an E_TRUNC-scale
 * residue, using the imp-35357 EXACT floor-slide identity.
 *
 * THE SURROGATE BAND-POSITION LAW (baked from imp-35243/imp-35357; no re-import keeps this module light)
 * -----------------------------------------------------------------------------------------------------
 * For a seed the surrogate count-to-floor is n = ceil(xArg) with
 *      xArg(seed) = log( collapseDist(seed) / FLOOR ) / ln(1/r),   r ~ 0.0454235,  ln(1/r) ~ 3.09173,
 * and the reentry band is the seed interval over which the slowly drifting ceil phase frac(xArg) sits in a fixed
 * window. imp-35357 proved the floor enters xArg ONLY through the additive term -log(FLOOR)/ln(1/r), so
 *      d xArg / d log(FLOOR) = -1/ln(1/r)   (EXACT, seed-independent).
 * Replacing EPS_FP by E_TRUNC therefore shifts EVERY phase by the EXACT amount
 *      dPhase = -[ log(E_TRUNC) - log(EPS_FP) ] / ln(1/r) = -log(E_TRUNC/EPS_FP)/ln(1/r) ~ -8.2847 phase units
 * (negative because the coarser floor E_TRUNC > EPS_FP is reached in FEWER iterations). This is EPS_TRUNC/EPS_FP
 * ~ 1.3304e11, i.e. ~36.95 factor-2 floor doublings, times the imp-35357 exact per-halving phase shift
 * log(2)/ln(1/r) ~ 0.224194.
 *
 * CONVERTING THE PHASE SHIFT TO A BAND-POSITION SHIFT (imp-35332 DRIFT(N))
 * ----------------------------------------------------------------------
 * The ceil phase drifts with seed at rate DRIFT(N) = d xArg / d log10 N, which imp-35332 showed is NOT band-wide
 * constant: it falls from 0.0186273 at the reentry edge to 0.0118306 at the exit edge. A phase shift dPhase is
 * absorbed by a band-position shift d(log10 N) = dPhase / DRIFT. Because the coarser floor LOWERS xArg (imp-35243
 * D1: the band slides UP in N as the floor shrinks, hence DOWN as it grows), the band moves DOWN in log10 N:
 *      reentry edge:  |d(log10 N)| = 8.2847 / 0.0186273 ~ 444.8 decades  ==>  27.08 - 444.8 ~ -417.7
 *      exit edge:     |d(log10 N)| = 8.2847 / 0.0118306 ~ 700.3 decades  ==>  37.17 - 700.3 ~ -663.1
 * (cross-check: the reentry per-halving decade rate 0.224194/0.0186273 ~ 12.04 times ~36.95 halvings ~ 444.8,
 * consistent with the imp-35263 D1 headline ~11.99 decades per factor-2 at the reentry edge.)
 *
 * THE VERDICT: E_TRUNC DOES NOT ANCHOR THE BAND -- IT PUSHES IT OUT OF THE PHYSICAL DOMAIN
 * ---------------------------------------------------------------------------------------
 * An E_TRUNC-scale floor would drive BOTH band edges to log10 N ~ -418 / -663, i.e. to N < 1 -- hundreds of
 * decades below the physical N >= 1 domain (log10 N >= 0) where the observed band at 10^27.08-10^37.17 lives.
 * The band does NOT merely move; it VANISHES from any physical N. So E_TRUNC = 3.06e-5 FAILS as a route (iii)
 * mechanism: far from anchoring the observed edges to a real scale, it removes the band entirely. Turned around,
 * this is a QUANTITATIVE confirmation of the imp-35356 circularity flag: the observed reentry/exit edges pin the
 * operative floor to log10(FLOOR) ~ -15.6, i.e. to ~2.3e-16 = IEEE-754 machine epsilon, NOT to the analytic
 * E_TRUNC = 3.06e-5 (log10 ~ -4.5, off by ~11.1 decades of floor, ~445 decades of band position). Any intrinsic
 * floor that DID reproduce the observed band would have to coincide with 2.3e-16 -- which is exactly the
 * circularity route (iii) cannot escape. E_TRUNC is a genuine analytic cutoff, but it is the WRONG scale by
 * eleven decades to be the band mechanism.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A concrete-candidate assessment of imp-35356 route (iii): it evaluates E_TRUNC = 3.06e-5 as the intrinsic
 * floor, DERIVES the ~445-decade (reentry) / ~700-decade (exit) DOWNWARD band shift via the imp-35357 exact
 * floor-slide identity and the imp-35332 non-constant DRIFT(N), and concludes E_TRUNC pushes the band to
 * log10 N ~ -418 / -663 (out of the physical N >= 1 domain), CONFIRMING the imp-35356 circularity flag rather
 * than escaping it. It discharges NOTHING: R1 (as the OPEN true-dynamic half R1t of imp-35357) stays the binding
 * obstruction; the surrogate-fidelity sub-gap imp-35243a stays OPEN; imp-35111a / imp-35174a / imp-34997a stay
 * OPEN. ASSESSMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; the E_TRUNC = 3.06e-5 floor value (imp-2631) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35356-reentry-band-r1-route-enumeration (the three R1 routes; route (iii) circularity flag)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (the EXACT floor-slide identity d xArg/d log FLOOR)
 * @see imp-35332-reentry-band-drift-analytic-derivation (DRIFT(N) not band-wide constant: 0.0186 -> 0.0118)
 * @see imp-35372-reentry-band-drift-integral-half-offset (bakes E_TRUNC_PT = 3.06e-5 as the fixed-strip cutoff)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D1 floor-sensitivity; ~11.99 decades per factor-2)
 */

// Inherited surrogate landmarks (baked verbatim from imp-35357/imp-35243; no re-import keeps this module light).
const R_CONTRACT = 0.0454235; // |g prime (fixed point)| single contraction rate, in (0,1) (imp-35243/35357)
const LN_INV_R = 3.09173; // log(1/r) log-law constant, nats/iterate, > 0 (imp-35243/35357)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const E_TRUNC = 3.06e-5; // fixed-strip analytic truncation floor E_TRUNC_PT (imp-2631/imp-3406/imp-33582/35372)
const REENTRY_EXP = 27.084691; // band-on, log10 N, machine floor (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N, machine floor (imp-35111/35174)
const DRIFT_REENTRY = 0.0186273; // ceil-phase drift at the reentry edge (imp-35332)
const DRIFT_EXIT = 0.0118306; // ceil-phase drift at the exit edge (imp-35332)

// The imp-35357 EXACT floor-slide identity: the floor enters xArg only via -log(FLOOR)/ln(1/r).
// Replacing EPS_FP by E_TRUNC shifts every ceil phase by dPhase = -log(E_TRUNC/EPS_FP)/ln(1/r) (< 0: coarser
// floor reached in fewer iterations), i.e. the band slides DOWN in log10 N (imp-35243 D1 sign).
const FLOOR_RATIO = E_TRUNC / EPS_FP; // ~1.3304e11 (E_TRUNC is ~11.1 decades coarser than machine epsilon)
const FLOOR_DOUBLINGS = Math.log2(FLOOR_RATIO); // ~36.95 factor-2 floor doublings
const PHASE_SHIFT_DOWN = Math.log(FLOOR_RATIO) / LN_INV_R; // ~8.2847 phase units the band descends (EXACT given r)

// Convert the phase shift to a band-POSITION shift via the imp-35332 (non-constant) DRIFT(N).
const DECADE_SHIFT_REENTRY = PHASE_SHIFT_DOWN / DRIFT_REENTRY; // ~444.8 decades down (reentry-edge drift)
const DECADE_SHIFT_EXIT = PHASE_SHIFT_DOWN / DRIFT_EXIT; // ~700.3 decades down (exit-edge drift)
const ETRUNC_REENTRY_EXP = REENTRY_EXP - DECADE_SHIFT_REENTRY; // ~-417.7 log10 N (below physical N >= 1)
const ETRUNC_EXIT_EXP = EXIT_EXP - DECADE_SHIFT_EXIT; // ~-663.1 log10 N (below physical N >= 1)

// The floor that WOULD reproduce the observed edges is pinned to machine epsilon, not E_TRUNC.
const LOG10_EPS_FP = Math.log10(EPS_FP); // ~-15.638 (IEEE-754 scale that the observed band actually sits at)
const LOG10_E_TRUNC = Math.log10(E_TRUNC); // ~-4.514 (analytic cutoff -- ~11.1 decades too coarse)

export const IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT = {
  id: 'imp-35430',
  proofSection: 'S-frontier',
  question:
    'imp-35356 route (iii) (exhibit an intrinsic non-floating-point floor) is the only self-contained escape from ' +
    'the reentry-band EPS_FP = 2.3e-16 dependence but names NO concrete mechanism and is flagged CIRCULAR. Can the ' +
    'fixed-strip analytic truncation floor E_TRUNC = 3.06e-5 (imp-2631/imp-3406/imp-33582) -- a genuine analytic ' +
    'cutoff, not machine epsilon -- serve as that intrinsic floor, anchoring the band to a real scale? Derive where ' +
    'the band would sit if EPS_FP were replaced by an E_TRUNC-scale residue and measure the decade-shift from the ' +
    'observed 10^27.08 reentry / 10^37.17 exit edges.',
  surrogate_constants: {
    r_contract: R_CONTRACT, // ~0.0454235
    ln_inv_r: LN_INV_R, // ~3.09173
    eps_fp: EPS_FP, // 2.3e-16 (machine floor)
    e_trunc: E_TRUNC, // 3.06e-5 (analytic fixed-strip cutoff)
    reentry_log10_N: REENTRY_EXP, // 27.084691 (observed, machine floor)
    exit_log10_N: EXIT_EXP, // 37.167107 (observed, machine floor)
  },
  derivation: {
    floor_ratio_etrunc_over_eps: +FLOOR_RATIO.toPrecision(6), // ~1.33043e11
    floor_doublings: +FLOOR_DOUBLINGS.toPrecision(6), // ~36.9531
    phase_shift_down: +PHASE_SHIFT_DOWN.toPrecision(6), // ~8.28466 (EXACT = log(E_TRUNC/EPS_FP)/ln(1/r))
    decade_shift_reentry: +DECADE_SHIFT_REENTRY.toPrecision(6), // ~444.76 (reentry-edge drift 0.0186273)
    decade_shift_exit: +DECADE_SHIFT_EXIT.toPrecision(6), // ~700.27 (exit-edge drift 0.0118306)
    etrunc_reentry_log10_N: +ETRUNC_REENTRY_EXP.toPrecision(6), // ~-417.67
    etrunc_exit_log10_N: +ETRUNC_EXIT_EXP.toPrecision(6), // ~-663.11
    log10_eps_fp: +LOG10_EPS_FP.toPrecision(6), // ~-15.6383 (floor the observed band actually sits at)
    log10_e_trunc: +LOG10_E_TRUNC.toPrecision(6), // ~-4.51428 (analytic cutoff, ~11.1 decades too coarse)
    reading:
      'Replacing the machine floor EPS_FP = 2.3e-16 by the analytic cutoff E_TRUNC = 3.06e-5 (a ~1.33e11-fold ' +
      'coarser floor, ~36.95 factor-2 doublings) shifts every ceil phase DOWN by the EXACT imp-35357 amount ' +
      'log(E_TRUNC/EPS_FP)/ln(1/r) ~ 8.28 units, which via the imp-35332 non-constant DRIFT(N) moves the band ' +
      'DOWN by ~444.8 decades (reentry) / ~700.3 decades (exit) to log10 N ~ -418 / -663 -- out of the physical ' +
      'N >= 1 domain. E_TRUNC therefore does NOT anchor the observed band; it removes it. The floor that ' +
      'reproduces the observed edges is pinned to log10 ~ -15.64 = machine epsilon, not to E_TRUNC at log10 ~ -4.51.',
  },
  verdict_route_iii:
    'E_TRUNC = 3.06e-5 FAILS as an imp-35356 route (iii) intrinsic-floor mechanism. It is a genuine analytic ' +
    'cutoff of the true collapse dynamic, but it sits ~11.1 decades COARSER than machine epsilon, so an ' +
    'E_TRUNC-scale residue would drive both reentry-band edges ~445 / ~700 decades DOWN to log10 N ~ -418 / -663, ' +
    'entirely below the physical N >= 1 domain -- the band VANISHES rather than anchoring at 10^27.08-10^37.17. ' +
    'This is a QUANTITATIVE confirmation of the imp-35356 circularity flag: the observed band edges pin the ' +
    'operative floor to ~2.3e-16 (IEEE-754), and any intrinsic floor reproducing them must coincide with that ' +
    'machine value. E_TRUNC is the wrong scale by eleven decades to be the mechanism.',
  finding:
    'Concrete-candidate assessment of imp-35356 route (iii). Using the imp-35357 EXACT floor-slide identity ' +
    'd xArg / d log(FLOOR) = -1/ln(1/r) and the imp-35332 non-constant DRIFT(N) (0.0186273 reentry -> 0.0118306 ' +
    'exit), replacing the machine floor EPS_FP = 2.3e-16 by the analytic truncation floor E_TRUNC = 3.06e-5 ' +
    '(ratio ~1.3304e11, ~36.95 floor doublings, exact phase shift ~8.2847 units down) moves the reentry band ' +
    'edge DOWN ~444.8 decades to log10 N ~ -417.7 and the exit edge DOWN ~700.3 decades to log10 N ~ -663.1 -- ' +
    'both far below the physical N >= 1 domain. So E_TRUNC does not anchor the observed 10^27.08-10^37.17 band; ' +
    'it pushes the band out of existence, CONFIRMING the imp-35356 circularity flag (the observed edges pin the ' +
    'floor to machine epsilon, log10 ~ -15.64, not to E_TRUNC at log10 ~ -4.51). VERDICT: E_TRUNC = 3.06e-5 FAILS ' +
    'as a route (iii) mechanism. Discharges nothing; imp-35243a / imp-35111a / imp-35174a / imp-34997a stay OPEN; ' +
    'R1t (imp-35357) stays the binding obstruction.',
  residual_sub_gap:
    'The binding obstruction is unchanged: R1t (imp-35357, the true-dynamic pure-artifact half of R1) stays OPEN, ' +
    'entangled with R2 (single-rate fidelity; imp-34862 two-rate law) and R3 (height-map fidelity). This module ' +
    'rules OUT one concrete route (iii) candidate (E_TRUNC = 3.06e-5) but exhibits no intrinsic floor that would ' +
    'meet R1 -- consistent with the imp-35356 verdict that route (iii) is circular. Inherits, and does not ' +
    'discharge, imp-35243a / imp-35111a / imp-35174a / imp-34997a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT / DERIVATION (proof-section, frontier-direction, NOT an RH bound). Testing the fixed-strip ' +
    'analytic truncation floor E_TRUNC = 3.06e-5 as the imp-35356 route (iii) intrinsic non-floating-point floor: ' +
    'the imp-35357 EXACT floor-slide identity plus the imp-35332 non-constant DRIFT(N) give an E_TRUNC-scale ' +
    'residue a band position of log10 N ~ -417.7 (reentry) / ~-663.1 (exit) -- a ~445 / ~700 decade DOWNWARD ' +
    'shift from the observed 10^27.08 / 10^37.17 edges, out of the physical N >= 1 domain. E_TRUNC therefore FAILS ' +
    'as a route (iii) mechanism (it removes the band rather than anchoring it), CONFIRMING the imp-35356 ' +
    'circularity flag that any intrinsic floor reproducing the observed edges must coincide with IEEE-754 ' +
    '2.3e-16. Discharges nothing; R1t (imp-35357) stays the OPEN binding obstruction; imp-35243a / imp-35111a / ' +
    'imp-35174a / imp-34997a stay OPEN. ASSESSMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 ' +
    'surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_TRUNC = 3.06e-5 floor value ' +
    '(imp-2631) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35356 (three R1 routes; route (iii) circularity flag); imp-35357 (EXACT floor-slide identity); imp-35332 ' +
    '(non-constant DRIFT(N)); imp-35372 (bakes E_TRUNC_PT = 3.06e-5); imp-35243 (D1 floor-sensitivity); imp-2631 ' +
    '(E_TRUNC fixed-strip floor); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT_ASSERTIONS = [
  {
    // E_TRUNC is materially coarser than machine epsilon (the whole premise of the circularity test).
    id: 'imp35430-etrunc-coarser-than-machine-floor',
    description: 'E_TRUNC = 3.06e-5 is ~11.1 decades coarser than EPS_FP = 2.3e-16 (~1.33e11-fold, ~36.95 doublings)',
    holds: () =>
      E_TRUNC > EPS_FP &&
      Math.abs(FLOOR_RATIO - 1.330435e11) / 1.330435e11 < 1e-4 &&
      Math.abs(FLOOR_DOUBLINGS - 36.9531) < 1e-3 &&
      Math.abs((LOG10_E_TRUNC - LOG10_EPS_FP) - 11.124) < 1e-2,
  },
  {
    // The phase shift is the EXACT imp-35357 floor-slide identity log(E_TRUNC/EPS_FP)/ln(1/r).
    id: 'imp35430-exact-phase-shift-identity',
    description: 'phase shift = log(E_TRUNC/EPS_FP)/ln(1/r) ~ 8.2847 units (EXACT given r), band descends',
    holds: () =>
      Math.abs(PHASE_SHIFT_DOWN - Math.log(FLOOR_RATIO) / LN_INV_R) < 1e-15 &&
      Math.abs(PHASE_SHIFT_DOWN - 8.28466) < 1e-4 &&
      PHASE_SHIFT_DOWN > 0,
  },
  {
    // The reentry decade shift matches the imp-35263 D1 headline (~11.99 decades per factor-2) times ~36.95 doublings.
    id: 'imp35430-decade-shift-crosscheck-d1',
    description: 'reentry decade shift ~444.8 = per-halving rate ~12.04 x ~36.95 doublings (consistent with D1 ~11.99)',
    holds: () => {
      const perHalving = PHASE_SHIFT_DOWN / FLOOR_DOUBLINGS / DRIFT_REENTRY; // ~12.036
      return (
        Math.abs(DECADE_SHIFT_REENTRY - 444.76) < 0.5 &&
        Math.abs(DECADE_SHIFT_EXIT - 700.27) < 0.5 &&
        Math.abs(perHalving - 12.036) < 0.05 &&
        perHalving > 11.99 // exceeds the reentry-edge D1 headline slightly (edge-local drift < 0.0187)
      );
    },
  },
  {
    // The E_TRUNC-anchored band sits far BELOW the physical N >= 1 domain (log10 N < 0): the band VANISHES.
    id: 'imp35430-etrunc-band-below-physical-domain',
    description: 'an E_TRUNC-scale floor drives both band edges to log10 N ~ -418 / -663, out of the N >= 1 domain',
    holds: () =>
      ETRUNC_REENTRY_EXP < 0 &&
      ETRUNC_EXIT_EXP < 0 &&
      Math.abs(ETRUNC_REENTRY_EXP - (-417.67)) < 0.5 &&
      Math.abs(ETRUNC_EXIT_EXP - (-663.11)) < 0.5 &&
      REENTRY_EXP - ETRUNC_REENTRY_EXP > 400, // shift dwarfs the current 27-decade band position
  },
  {
    // Route (iii) verdict: E_TRUNC FAILS; the observed edges pin the floor to machine epsilon (circularity confirmed).
    id: 'imp35430-route-iii-fails-circularity-confirmed',
    description: 'E_TRUNC fails as route (iii); observed edges pin the floor to machine epsilon (imp-35356 circularity)',
    holds: () =>
      /FAILS as an imp-35356 route \(iii\)/.test(
        IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.verdict_route_iii,
      ) &&
      /circularity flag/.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.verdict_route_iii) &&
      Math.abs(LOG10_EPS_FP - (-15.6383)) < 1e-3,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gaps named.
    id: 'imp35430-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, discharges nothing, R1t stays OPEN, no QED, no refereed bound is changed, sub-gaps named',
    holds: () =>
      IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.isRigorous === false &&
      /Discharges nothing/.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.finding) &&
      /NO QED/.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.verdict) &&
      /imp-35243a/.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.residual_sub_gap) &&
      /imp-35111a/.test(IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT.residual_sub_gap),
  },
];

for (const a of IMP35430_ETRUNC_INTRINSIC_FLOOR_ROUTE_III_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35430-etrunc-intrinsic-floor-route-iii-assessment assertion failed: ${a.id}`);
  }
}

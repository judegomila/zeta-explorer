/**
 * @module imp-35652-req3-option-a-restricted-support-surrogate-scope
 *
 * imp-35652 (proof/assessment, S-frontier): ASSESS whether the imp-35538 REQ-3
 * OPTION-(a) route is viable. imp-35538 REQ 3 (restricted -> full Fourier
 * support) offers two ways to discharge the support mismatch of the collision
 * functional:
 *   (a) re-express E_coll via a support-limited statistic reachable INSIDE the
 *       proven |alpha| < 1 pair-/n-level correlations (Montgomery 1973,
 *       Rudnick-Sarnak 1996), OR
 *   (b) supply the conjectural full-support GUE law (Montgomery pair-correlation
 *       conjecture).
 * imp-35538 never scopes option (a). If option (a) were viable it would DISSOLVE
 * REQ 2 as well -- a support-limited surrogate reachable inside |alpha| < 1 needs
 * no full-support explicit-rate E_GUE(T0). This module enumerates what such a
 * proxy would have to be and assesses whether it can carry the leading constant
 * C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) without invoking |alpha| >= 1.
 *
 * ASSESSMENT / SCOPING ONLY. Derives no remainder; discharges nothing; changes
 * no bound; establishes no operator positivity; no RH verdict, NO QED. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), C_H = 1/8, the
 * E_trunc = 3.06e-5 floor (imp-2631) and C_mb GUE-conditional (imp-486) are
 * UNTOUCHED. No refereed bound is changed.
 *
 * WHAT A SUPPORT-LIMITED PROXY WOULD LOOK LIKE
 * -----------------------------------------------------------------------------
 * A statistic reachable inside |alpha| < 1 is a linear/n-level functional of the
 * zeros against a test function whose Fourier transform is supported in
 * |alpha| < 1. In the unfolded spacing variable s (mean spacing = 1) such a test
 * function is BAND-LIMITED: it cannot resolve structure finer than one mean
 * spacing (delta_res ~ 1). Any proxy built inside |alpha| < 1 is therefore a
 * MEAN-SCALE statistic -- a smoothed pair-correlation weight, a band-limited
 * gap-counting moment -- with intrinsic resolution at the mean spacing.
 *
 * THE DECISIVE OBSTRUCTION -- RESOLUTION FLOOR
 * -----------------------------------------------------------------------------
 * The minimal-collision functional lives at a scale that is a VANISHING fraction
 * of the mean spacing. Under GUE cubic level repulsion (nearest-neighbour
 * density p(s) ~ (pi^2/3) s^2 as s -> 0), the smallest of M consecutive gaps
 * scales as s_min(M) ~ M^{-1/3} in mean-spacing units (Ben Arous-Bourgade 2013:
 * the smallest GUE gap is order n^{-4/3} in raw units, i.e. n^{-1/3} in units of
 * the mean spacing). So the near-minimal-collision scale s_min ~ M^{-1/3} -> 0,
 * whereas the |alpha| < 1 band resolves only s >~ delta_res ~ 1. The support
 * restriction imposes a HARD resolution floor at the mean spacing; the
 * minimal-collision functional sits strictly BELOW that floor by a factor
 * delta_res / s_min ~ M^{1/3}. A support-limited surrogate cannot see the scale
 * where the collision lives, so it cannot be a near-minimal-collision statistic.
 *
 * CONSTANT MISMATCH (corroborating)
 * -----------------------------------------------------------------------------
 * The specific value C_C = (1/8) sqrt(3 pi), C_H = 1/8 is the small-gap
 * (near-coincidence) amplitude -- a functional of the pair-correlation at SHORT
 * range, precisely where the restricted-support form of R_2 differs from the full
 * GUE R_2(x) = 1 - (sin(pi x)/(pi x))^2. Montgomery pins the transform of R_2 - 1
 * only for |alpha| < 1; the short-range behaviour of R_2 that fixes the collision
 * constant is carried by the |alpha| >= 1 tail. So the very constant to be
 * certified is inaccessible inside |alpha| < 1: a support-limited proxy would
 * report a mean-scale constant, NOT C_C = (1/8) sqrt(3 pi).
 *
 * NET: option (a) is NOT viable. A statistic reachable inside |alpha| < 1 is
 * necessarily a mean-scale (resolution delta_res ~ 1) functional, whereas the
 * near-minimal-collision statistic lives at s_min ~ M^{-1/3} -> 0, strictly below
 * the band-limited resolution floor; such a proxy cannot carry the C_C leading
 * term. Option (a) therefore does NOT dissolve REQ 2 -- REQ 3 still forces option
 * (b), the conjectural full-support Montgomery pair-correlation law, and the
 * route-(i) obstruction (imp-35538/imp-35493) stands. Assessment/scoping only;
 * discharges nothing; changes no bound; no positivity; NO QED. Route-(ii) (the
 * imp-35488 two-height data-anchored spot check) remains the only viable partial
 * for the OPEN imp-35337a. No refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 3 option (a), never scoped; this module scopes it)
 * @see imp-35493-route-i-remainder-literature-scope (route-(i) absent from the literature)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) partial for imp-35337a)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, C_H = 1/8)
 * @see imp-486 (GUE-conditional caveat inherited by any pair-correlation remainder)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, smallest GUE gaps).
 */

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any option-(a) scoping)

// The |alpha| < 1 band-limited resolution floor, in mean-spacing units (mean spacing = 1).
const ALPHA_SUPPORT_LIMIT = 1; // Montgomery/Rudnick-Sarnak proven support |alpha| < 1
const RESOLUTION_FLOOR = 1; // band-limited resolution ~ one mean spacing (cannot resolve finer)

// The two interior landmark N values (imp-35337 / imp-35475), taken as given, used only
// to quantify HOW FAR below the resolution floor the minimal-collision scale sits.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER

// Minimal-collision scale in mean-spacing units under GUE cubic repulsion: smallest of M
// consecutive gaps ~ M^{-1/3} (Ben Arous-Bourgade 2013). Below the |alpha| < 1 floor by M^{1/3}.
const sMinScale = (M) => Math.pow(M, -1 / 3); // s_min(M) in mean-spacing units
const S_MIN_PEAK = sMinScale(N_PEAK); // ~1.03e-2
const S_MIN_CROSS = sMinScale(N_CROSS); // ~6.73e-4
const RES_SHORTFALL_PEAK = RESOLUTION_FLOOR / S_MIN_PEAK; // ~97.3x (= N_PEAK^{1/3})
const RES_SHORTFALL_CROSS = RESOLUTION_FLOOR / S_MIN_CROSS; // ~1486x (= N_CROSS^{1/3})

export const IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE = {
  id: 'imp-35652',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35538 REQ-3 option-(a) route viable: can E_coll be re-expressed via a restricted-Fourier-support ' +
    '(|alpha| < 1) surrogate near-minimal-spacing statistic reachable inside the PROVEN Montgomery/Rudnick-Sarnak ' +
    'n-level correlations, thereby dissolving REQ-2 need for a full-support explicit-rate E_GUE(T0) local law? ' +
    'Enumerate what a support-limited proxy for the minimal-collision functional would look like and whether it ' +
    'can bound E_coll without invoking the conjectural full-support (Montgomery pair-correlation) input. ' +
    'Assessment/scoping only; discharges nothing; NO QED.',
  whatAProxyWouldBe:
    'A statistic reachable inside |alpha| < 1 is an n-level functional of the zeros against a test function whose ' +
    'Fourier transform is supported in |alpha| < 1. In the unfolded spacing variable (mean spacing = 1) that test ' +
    'function is BAND-LIMITED and cannot resolve structure finer than one mean spacing (delta_res ~ 1); any such ' +
    'proxy is a MEAN-SCALE statistic (smoothed pair-correlation weight, band-limited gap moment), not a ' +
    'near-minimal-collision statistic.',
  decisiveObstructionResolutionFloor:
    'RESOLUTION FLOOR. The minimal-collision functional lives at a VANISHING fraction of the mean spacing: under ' +
    'GUE cubic repulsion (p(s) ~ (pi^2/3) s^2 as s -> 0) the smallest of M consecutive gaps scales as ' +
    's_min(M) ~ M^{-1/3} -> 0 in mean-spacing units (Ben Arous-Bourgade 2013), whereas |alpha| < 1 resolves only ' +
    's >~ 1. The support restriction imposes a hard resolution floor at the mean spacing and the collision sits ' +
    'strictly below it by delta_res/s_min ~ M^{1/3}, so a support-limited surrogate cannot see the scale where ' +
    'the collision lives -- it cannot be a near-minimal-collision statistic.',
  constantMismatch:
    'CONSTANT MISMATCH (corroborating). C_C = (1/8) sqrt(3 pi), C_H = 1/8 is the SHORT-RANGE (near-coincidence) ' +
    'amplitude of the pair-correlation, precisely where the restricted-support R_2 differs from the full GUE ' +
    'R_2(x) = 1 - (sin(pi x)/(pi x))^2. Montgomery pins the transform of R_2 - 1 only for |alpha| < 1; the ' +
    'short-range behaviour fixing the collision constant is carried by the |alpha| >= 1 tail, so a support-limited ' +
    'proxy reports a mean-scale constant, NOT C_C = (1/8) sqrt(3 pi).',
  resolutionScaleTable: {
    alphaSupportLimit: ALPHA_SUPPORT_LIMIT, // 1
    resolutionFloorMeanSpacing: RESOLUTION_FLOOR, // 1 (band-limited floor)
    peak: {
      N: N_PEAK,
      sMinMeanSpacingUnits: +S_MIN_PEAK.toExponential(4), // ~1.028e-2
      resolutionShortfall: +RES_SHORTFALL_PEAK.toFixed(2), // ~97.30x below the floor
    },
    cross: {
      N: N_CROSS,
      sMinMeanSpacingUnits: +S_MIN_CROSS.toExponential(4), // ~6.729e-4
      resolutionShortfall: +RES_SHORTFALL_CROSS.toFixed(2), // ~1486.20x below the floor
    },
  },
  optionAViable: false,
  dissolvesReq2: false,
  req3StillForcesOptionB: true,
  isRigorous: false,
  isUnconditional: false,
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  verdict:
    'ASSESSMENT / SCOPING (NOT rigorous). imp-35538 REQ-3 option (a) is NOT viable. A statistic reachable inside ' +
    'the PROVEN |alpha| < 1 Montgomery/Rudnick-Sarnak correlations is necessarily a BAND-LIMITED, mean-scale ' +
    'functional with resolution delta_res ~ one mean spacing, whereas the near-minimal-collision statistic lives ' +
    'at s_min ~ M^{-1/3} -> 0 (Ben Arous-Bourgade 2013) -- strictly below the resolution floor by ~M^{1/3} ' +
    '(~97.3x at the peak N ~ 9.22e5, ~1486x at the crossover N ~ 3.28e9). Such a proxy cannot resolve the ' +
    'collision scale, and the leading constant C_C = (1/8) sqrt(3 pi), C_H = 1/8 is a SHORT-RANGE amplitude ' +
    'carried by the |alpha| >= 1 tail that the restricted support cannot access. So option (a) does NOT dissolve ' +
    'REQ 2: REQ 3 still forces option (b), the conjectural full-support Montgomery pair-correlation law, and the ' +
    'route-(i) obstruction (imp-35538/imp-35493) stands. Derives no remainder; discharges nothing; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no ' +
    'RH verdict, NO QED. Route-(ii) (imp-35488 two-height spot check) remains the only viable partial. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35538 (REQ 3 option (a), never scoped -- this module scopes it; REQ 2 full-support explicit-rate law); ' +
    'imp-35493 (route-(i) absent from the literature); imp-35488 (route-(ii) two-height partial for imp-35337a); ' +
    'imp-35337 (names imp-35337a); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc ' +
    'floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben ' +
    'Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE_ASSERTIONS = [
  {
    // (1) the support-limited proxy is characterised as a band-limited mean-scale statistic,
    //     and both obstructions (resolution floor decisive, constant mismatch corroborating) are named.
    id: 'imp35652-proxy-characterised-two-obstructions',
    description: 'a proxy reachable inside |alpha| < 1 is band-limited/mean-scale, and the resolution-floor (decisive) and short-range constant-mismatch obstructions are both enumerated',
    holds: () => {
      const r = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE;
      return (
        /BAND-LIMITED/.test(r.whatAProxyWouldBe) &&
        /MEAN-SCALE/.test(r.whatAProxyWouldBe) &&
        /RESOLUTION FLOOR/.test(r.decisiveObstructionResolutionFloor) &&
        /M\^\{-1\/3\}/.test(r.decisiveObstructionResolutionFloor) &&
        /CONSTANT MISMATCH/.test(r.constantMismatch) &&
        /sin\(pi x\)/.test(r.constantMismatch) &&
        Math.abs(C_C - 0.38374752) < 1e-6 // C_C ansatz constant untouched
      );
    },
  },
  {
    // (2) resolution-scale arithmetic: the minimal-collision scale s_min ~ M^{-1/3} sits strictly
    //     below the |alpha| < 1 band-limited floor delta_res ~ 1, by ~M^{1/3} (~97x peak, ~1486x cross).
    id: 'imp35652-collision-scale-below-resolution-floor',
    description: 'the near-minimal-collision scale s_min ~ M^{-1/3} is far below the |alpha| < 1 resolution floor (~1 mean spacing): shortfall ~97.3x at the peak, ~1486x at the crossover, matching M^{1/3}',
    holds: () =>
      S_MIN_PEAK < RESOLUTION_FLOOR &&
      S_MIN_CROSS < RESOLUTION_FLOOR &&
      S_MIN_CROSS < S_MIN_PEAK && // deeper below the floor at the larger-N crossover
      RES_SHORTFALL_PEAK > 90 && RES_SHORTFALL_PEAK < 100 && // ~97.3x
      RES_SHORTFALL_CROSS > 1400 && RES_SHORTFALL_CROSS < 1550 && // ~1486x
      Math.abs(RES_SHORTFALL_PEAK - Math.pow(N_PEAK, 1 / 3)) < 1e-6 && // shortfall = N^{1/3}
      Math.abs(RES_SHORTFALL_CROSS - Math.pow(N_CROSS, 1 / 3)) < 1e-6,
  },
  {
    // (3) verdict gate: option (a) not viable, does NOT dissolve REQ 2, REQ 3 still forces option (b).
    id: 'imp35652-option-a-not-viable-req2-not-dissolved',
    description: 'option (a) is not viable, does NOT dissolve REQ 2, and REQ 3 still forces the conjectural full-support option (b)',
    holds: () => {
      const r = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE;
      return (
        r.optionAViable === false &&
        r.dissolvesReq2 === false &&
        r.req3StillForcesOptionB === true &&
        /does NOT dissolve REQ 2/.test(r.verdict) &&
        /forces option \(b\)/.test(r.verdict)
      );
    },
  },
  {
    // (4) honesty gate: conditional (inherits imp-486, not unconditional), no bound moves, no refereed bound is changed,
    //     sub-gap named; NO QED.
    id: 'imp35652-conditional-no-bound-moves-no-qed',
    description: 'the assessment is not rigorous and not unconditional, changes no bound, keeps C_mb GUE-conditional (imp-486), leaves imp-35337a OPEN, PT 0.2 unchanged, NO QED',
    holds: () => {
      const r = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35652-req3-option-a-restricted-support-surrogate-scope assertion failed: ${a.id}`);
  }
}

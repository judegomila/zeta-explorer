/**
 * imp-95013 - Gate-2 evaluator Lane A: native double-double E97/C_E,17 scanner
 * with a mandatory anchor gate. HONEST STATUS: BLOCKED-ON-SPEC.
 *
 * The ticket asks for a standalone native (clang -O3 pthreads / rust) scanner:
 * an SPF sieve to 5.48e7, a double-double phase pipeline (naive double fails
 * near x ~ 3.77e16), the 25-factor A97 product over primes p <= 97, and per-N
 * evaluation of the residual cocycle E97(x) = L(MA(x) c(x)) across the open
 * family 690988 <= N <= 54799999. Its HARD GATE, quoted from the ticket:
 * reproduce |E97|(N=690988) = 0.2141254901198318 BEFORE any scan output is
 * trusted; "failure = BLOCKED-ON-SPEC, no surrogate substitution".
 *
 * WHY THIS IS BLOCKED (the honest residual, not a work-around).
 * The frozen Gate-2 spec (imp-95012, from the committed paper source) bakes the
 * STRUCTURAL definitions only: the row (8), the coefficient law b_n =
 * exp((log n)^2 / 4) (10), the shape of A97 and MA (11), and the (17)-(20)
 * carrier targets and the anchor cell. It deliberately "derives no bound and
 * closes no gap". To reproduce the 16-digit anchor a native evaluator needs the
 * ARITHMETIC evaluation formula, and those inputs are NOT present anywhere in
 * this repository:
 *   (1) compute_exact_N -- the N -> x* landmark map (Polymath-15 eqs (20)-(24));
 *       without the exact x*(690988) the sieve, phases, and window all shift.
 *   (2) sB(x) -- the complex exponent driving p^{-sB(x)} in the A97 product and
 *       the n^{-sB(x)} carrier terms; the spec names it but does not transcribe
 *       it as an evaluable function of x.
 *   (3) c(x) -- the full carrier coefficient sequence c_n(x) that MA acts on
 *       (beyond the b_n law), including the truncation window and the
 *       normalization that fixes the overall scale of |E97|.
 *   (4) the five window-parameter kernels and the two seam-side constructions
 *       that the scan must sweep (imp-95011 lists them as unspecified here).
 *   (5) the reference implementation verify_uniform_error_01787854.c whose
 *       conventions (Polymath-15 (20)-(24), compute_exact_N) the ticket says to
 *       copy -- it is NOT on disk (grep across the repo finds only queue text).
 *
 * A scanner written without (1)-(5) cannot hit 0.2141254901198318 to 16 digits;
 * emitting its numbers anyway would be exactly the surrogate substitution the
 * HARD GATE forbids. So the correct, ticket-sanctioned outcome is to record the
 * BLOCKED-ON-SPEC verdict, pin the anchor gate the future scanner MUST clear,
 * and enumerate the precise missing evaluator inputs so the next worker builds
 * against a frozen target instead of re-discovering the gap.
 *
 * This module contributes: (a) the machine-checkable anchor-gate literal and
 * the native-lane build parameters carried verbatim from the ticket and the
 * imp-95012 frozen spec; (b) the exact list of missing arithmetic inputs; and
 * (c) a named sub-gap. It runs NO scan, emits NO E97 measurement, and makes no
 * surrogate substitution. Changes no bound; closes no gap; NO QED;
 * no refereed bound is changed.
 */

import {
  GATE2_TARGETS,
  PRIMES_LE_97,
  E97_SPEC,
} from './imp-95012-gate2-frozen-spec.js';

// ── the mandatory anchor gate the native Lane-A scanner MUST clear ──────────
// Carried from the imp-95012 frozen spec (paper anchor cell). A native run is
// untrusted until it reproduces this to full double-double precision.
export const ANCHOR_GATE = Object.freeze({
  N: GATE2_TARGETS.anchor.N, // 690988
  halfWidth: GATE2_TARGETS.anchor.halfWidth.value, // 1 / 4e10
  requiredE97Peak: GATE2_TARGETS.anchor.E97Peak, // 0.2141254901198318
  matchTolerance: 1e-13, // double-double reproduction of the 16-digit literal
  correlatedCenterTarget: GATE2_TARGETS.correlatedCenterTargetEq20, // 0.27968819555261474
  RexExact: GATE2_TARGETS.RexExact, // 0.2796881955526244146123
  reserveDocumented: GATE2_TARGETS.anchor.reserveDocumented, // 0.0655627054327926
  rule: 'no scan output is trusted until |E97|(690988) is reproduced; failure = BLOCKED-ON-SPEC, no surrogate substitution',
});

// ── native-lane build parameters (carried from the ticket, for the builder) ──
export const NATIVE_LANE_SPEC = Object.freeze({
  backend: 'standalone C (clang -O3, pthreads) or rust beside rust/interval-rk4',
  sievePrimeBound: E97_SPEC.sieveBoundPrime, // 97 (SPF <= 97 bit sieve)
  sieveUpperN: 5.48e7, // sieve to 5.48e7
  a97FactorCount: PRIMES_LE_97.length, // 25 primes p <= 97 -> 25-factor A97 product
  naiveDoubleFailureX: 3.77e16, // naive double fails near x ~ 3.77e16 -> dd-precision phase pipeline
  openFamily: { Nmin: GATE2_TARGETS.openFamily.Nmin, Nmax: GATE2_TARGETS.openFamily.Nmax },
  perTermPipeline: 'b_n / n^{-sigma} / sincos per ladder, A97 25-factor product',
  conventionsSource: 'verify_uniform_error_01787854.c (Polymath-15 (20)-(24), compute_exact_N)',
});

// ── the precise missing arithmetic inputs (why Lane A cannot run in-repo) ────
export const MISSING_EVALUATOR_INPUTS = Object.freeze([
  {
    key: 'compute_exact_N',
    what: 'the N -> x* landmark map (Polymath-15 eqs (20)-(24)); fixes x*(690988) and hence sieve, phases, window',
    presentInRepo: false,
  },
  {
    key: 'sB_of_x',
    what: 'the complex exponent sB(x) in p^{-sB(x)} (A97) and n^{-sB(x)} (carrier); named in imp-95012 but not transcribed as an evaluable function',
    presentInRepo: false,
  },
  {
    key: 'carrier_c_of_x',
    what: 'the full carrier coefficient sequence c_n(x) that MA = R97 - A97*I acts on (truncation window + normalization that fixes |E97| scale)',
    presentInRepo: false,
  },
  {
    key: 'windows_and_seams',
    what: 'the five window-parameter kernels and the two seam-side constructions the scan must sweep (imp-95011 lists them as unspecified)',
    presentInRepo: false,
  },
  {
    key: 'reference_c_file',
    what: 'verify_uniform_error_01787854.c whose conventions the ticket says to copy; grep across the repo finds only queue text, no source file',
    presentInRepo: false,
  },
]);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95013_GATE2_LANE_A_BLOCKED = Object.freeze({
  ticket: 'imp-95013',
  proofSection: 'gate2-producer MOVE 2 / K1',
  source:
    'Permuting the Zeta Twin Ladder Section 4; imp-95012 frozen Gate-2 spec; imp-95011 oscillation probe (evaluator not in repo)',
  status: 'BLOCKED-ON-SPEC',
  anchorGate: ANCHOR_GATE,
  nativeLaneSpec: NATIVE_LANE_SPEC,
  missingInputs: MISSING_EVALUATOR_INPUTS,
  ranScan: false,
  emittedE97Measurement: false,
  surrogateSubstitution: false,
  namedSubGap: 'imp-95013-sub-native-evaluator-spec',
  subGapStatement:
    'the arithmetic Gate-2 evaluator (compute_exact_N N->x* map, the exponent sB(x), the carrier c_n(x), the window/seam family) plus the reference implementation verify_uniform_error_01787854.c must be committed to the repo before the native Lane-A scanner can be built and cleared against the |E97|(690988) = 0.2141254901198318 anchor; only the structural frozen spec (imp-95012) is present, so Lane A cannot run in-repo and no surrogate may be substituted',
  isRigorous: false,
  promotesBound: false,
  verdict:
    'BLOCKED-ON-SPEC (the ticket-named failure mode, not a work-around): the native Lane-A E97/C_E,17 scanner cannot be built and anchor-gated in this repo because the arithmetic evaluator inputs (compute_exact_N, sB(x), the carrier c_n(x), the window/seam family) and the reference C file are absent -- only the imp-95012 structural spec is present. This module pins the mandatory anchor gate and the exact missing inputs and names the sub-gap; it runs no scan, emits no E97 measurement, and makes no surrogate substitution. Changes no bound; closes no gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ───────────
export const IMP95013_GATE2_LANE_A_BLOCKED_ASSERTIONS = [
  {
    id: 'imp95013-anchor-gate-literal-matches-frozen-spec',
    description: 'the pinned anchor peak equals the imp-95012 frozen paper anchor to the last digit',
    holds: () =>
      ANCHOR_GATE.requiredE97Peak === 0.2141254901198318 &&
      ANCHOR_GATE.requiredE97Peak === GATE2_TARGETS.anchor.E97Peak &&
      ANCHOR_GATE.N === 690988,
  },
  {
    id: 'imp95013-anchor-below-target-below-rex',
    description: 'anchor peak < downward-rounded target (20) < exact allowance Rex (19) -- the closed cell ordering',
    holds: () =>
      ANCHOR_GATE.requiredE97Peak < ANCHOR_GATE.correlatedCenterTarget &&
      ANCHOR_GATE.correlatedCenterTarget < ANCHOR_GATE.RexExact,
  },
  {
    id: 'imp95013-native-lane-uses-25-factor-a97',
    description: 'the A97 product has 25 factors, one per prime p <= 97, matching the frozen spec',
    holds: () =>
      NATIVE_LANE_SPEC.a97FactorCount === 25 &&
      PRIMES_LE_97.length === 25 &&
      NATIVE_LANE_SPEC.sievePrimeBound === 97,
  },
  {
    id: 'imp95013-all-evaluator-inputs-absent',
    description: 'every enumerated arithmetic evaluator input the scanner needs is absent from the repo (why Lane A is blocked)',
    holds: () =>
      MISSING_EVALUATOR_INPUTS.length === 5 &&
      MISSING_EVALUATOR_INPUTS.every((m) => m.presentInRepo === false),
  },
  {
    id: 'imp95013-no-surrogate-no-scan-no-measurement',
    description: 'the ticket protocol is honored: no scan run, no E97 measurement emitted, no surrogate substitution',
    holds: () =>
      IMP95013_GATE2_LANE_A_BLOCKED.ranScan === false &&
      IMP95013_GATE2_LANE_A_BLOCKED.emittedE97Measurement === false &&
      IMP95013_GATE2_LANE_A_BLOCKED.surrogateSubstitution === false &&
      IMP95013_GATE2_LANE_A_BLOCKED.status === 'BLOCKED-ON-SPEC',
  },
  {
    id: 'imp95013-honesty-gate-no-qed',
    description: 'promotes no bound, names the sub-gap, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95013_GATE2_LANE_A_BLOCKED.promotesBound === false &&
      IMP95013_GATE2_LANE_A_BLOCKED.isRigorous === false &&
      IMP95013_GATE2_LANE_A_BLOCKED.namedSubGap === 'imp-95013-sub-native-evaluator-spec' &&
      /NO QED/.test(IMP95013_GATE2_LANE_A_BLOCKED.verdict) &&
      /refereed bound is changed/i.test(IMP95013_GATE2_LANE_A_BLOCKED.verdict),
  },
];

for (const a of IMP95013_GATE2_LANE_A_BLOCKED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95013-gate2-lane-a-blocked-on-spec assertion failed: ${a.id}`);
  }
}

export default IMP95013_GATE2_LANE_A_BLOCKED;

/**
 * imp-95072 - Hunt the five missing Gate-2 Lane-A arithmetic evaluator inputs
 * against the committed paper/repo source. ASSESS/MEASURE ONLY; no surrogate
 * substitution; NO QED; no refereed bound is changed.
 *
 * CONTEXT. imp-95013 declared the native Lane-A E97/C_E,17 scanner
 * BLOCKED-ON-SPEC and flatly recorded all five arithmetic evaluator inputs as
 * presentInRepo:false. Since then the source manuscript was committed to
 *   research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf
 * (the same file imp-95012 transcribed the STRUCTURAL frozen spec from). This
 * ticket re-hunts each of the five inputs against that committed paper and the
 * repo tree so the future native scanner builds against a frozen target instead
 * of re-discovering the gap. The result is a three-tier recoverability map, not
 * a flat absent/present flag: the paper recovers the structural FORM and the
 * external CITATION for several inputs, but NONE is yet transcribed as an
 * evaluable arithmetic function of the landmark x, so imp-95013 BLOCKED-ON-SPEC
 * still stands -- now with a precisely scoped unlock.
 *
 * METHOD. pdftotext of the committed PDF (2430 lines) + grep of src/ and the
 * repo tree. Equation and line references below are into that extraction.
 *
 * HEADLINE CORRECTION to imp-95013. The paper carrier eq (10) is a TWO-ladder
 * vector
 *   c_n(x) = b_n n^{-sB(x)} + gamma(x) n^{-sA(x)},   b_n = exp( t0 log^2 n / 4 )
 * so there are TWO exponents sA(x) (reflected ladder) and sB(x) (direct ladder)
 * plus a cross-chart gamma ratio gamma(x) -- not the single sB(x) imp-95013
 * enumerated. Any evaluator that models only sB(x) cannot reproduce E97.
 *
 * TRANSCRIPTION NOTE (flag only, not fixed here). Paper eq (10) writes
 * b_n = exp( t0 (log^2 n) / 4 ) with the row constant t0 = 0.123637595 as a
 * factor; the imp-95012 frozen-spec module baked b_n = exp( (log n)^2 / 4 )
 * WITHOUT the t0 factor. This is a candidate transcription discrepancy in the
 * two-ladder coefficient law worth a dedicated cross-check ticket; it is NOT
 * touched by this assessment (measure only).
 */

import { GATE2_TARGETS } from './imp-95012-gate2-frozen-spec.js';

// Recoverability tiers used by the hunt (ordered weakest->strongest recovery).
export const RECOVERY_TIERS = Object.freeze({
  GENUINELY_MISSING: 'genuinely-missing', // not in paper, not in repo, not citable
  STRUCTURE_NAMED: 'structure-named', // paper names/uses it but gives no evaluable form
  RECOVERABLE_EXTERNAL: 'recoverable-external', // paper cites an external source that carries the evaluable form
  STRUCTURE_PRESENT: 'structure-present', // the structural formula IS transcribed in the paper; sub-functions still open
});

// ── the hunt result for each of the five imp-95013 inputs ────────────────────
export const EVALUATOR_INPUT_HUNT = Object.freeze([
  {
    key: 'compute_exact_N',
    imp95013Claim: 'presentInRepo:false (N->x* landmark map, Polymath-15 eqs (20)-(24))',
    paperSource:
      'cites the Polymath upper-bound mechanism [4] (paper lines 191, 474) and pins X = 6000000185827 in the active row (8) (line 445); endpoint U(t,y) = t + y^2/2 given as eq (3)',
    tier: 'recoverable-external',
    stillMissing:
      'the explicit N->x* map is NOT transcribed in this paper; the ticket eqs (20)-(24) are equation numbers in the EXTERNAL Polymath-15 reference [4], which must be transcribed to make x*(N) evaluable',
    evaluableInRepo: false,
  },
  {
    key: 'sB_of_x_and_sA_of_x',
    imp95013Claim: 'presentInRepo:false (single exponent sB(x))',
    paperSource:
      'carrier eq (10) (line 548) uses BOTH n^{-sB(x)} (direct) and n^{-sA(x)} (reflected); A97 uses p^{-sB(x)} (line 558); tied to the complex s via the trace identities eq (1) Tr(N^{-1} e^{-sA}) = log zeta(s) (line 139)',
    tier: 'structure-named',
    stillMissing:
      'TWO exponents sA(x), sB(x) (imp-95013 named only one); neither is transcribed as a closed evaluable function of the landmark x -- both require the s<->x relation that flows from the compute_exact_N landmark map',
    evaluableInRepo: false,
  },
  {
    key: 'carrier_c_of_x',
    imp95013Claim: 'presentInRepo:false (full carrier sequence c_n(x))',
    paperSource:
      'the structural FORM is transcribed: eq (10) (line 527) c_n(x) = b_n n^{-sB(x)} + gamma(x) n^{-sA(x)} on the unsplit direct/reflected coefficient vector; b_n = exp( t0 log^2 n / 4 )',
    tier: 'structure-present',
    stillMissing:
      'the evaluable sub-functions sA(x), sB(x), gamma(x); the truncation window (which n / the Riemann-Siegel window) and the normalization that fixes the overall |E97| scale are not pinned as numbers',
    evaluableInRepo: false,
  },
  {
    key: 'windows_and_seams',
    imp95013Claim: 'presentInRepo:false (five window kernels + two seam constructions)',
    paperSource:
      'the cutoff tensor q = (P, B, a, r, Y, delta, omega) is enumerated with a gloss per coordinate in eq (5) (line 212); the Riemann-Siegel window (line 527) and both one-sided seam charts appear at lines 515, 809, 905, 1965 (gate G5)',
    tier: 'structure-named',
    stillMissing:
      'the enumerated parameter tensor is a bookkeeping list, not the evaluable window KERNELS or the two seam-side constructions; the specific sweep ranges and kernel evaluations the scan must cover are not transcribed',
    evaluableInRepo: false,
  },
  {
    key: 'reference_c_file',
    imp95013Claim: 'presentInRepo:false (verify_uniform_error_01787854.c)',
    paperSource:
      'grep of the paper text finds NO occurrence of verify_uniform_error / compute_exact_N / 01787854; paper gate G1 (line 1954) states the workspace contains NO implementation of the global paired B/Fresnel-Airy enclosure',
    tier: 'genuinely-missing',
    stillMissing:
      'the reference C file exists nowhere (paper, repo source, or elsewhere); it is a file to be WRITTEN against the recovered spec, not a file to be found -- the paper confirms no such evaluator implementation exists yet',
    evaluableInRepo: false,
  },
]);

// ── verdict ──────────────────────────────────────────────────────────────────
export const IMP95072_EVALUATOR_INPUT_HUNT = Object.freeze({
  ticket: 'imp-95072',
  proofSection: 'S-frontier',
  source:
    'research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf (pdftotext) + grep of src/ and the repo tree; equation/line refs into that extraction',
  refines: 'imp-95013 (Gate-2 Lane-A BLOCKED-ON-SPEC; imp-95013 recorded all five inputs as a flat presentInRepo:false)',
  hunt: EVALUATOR_INPUT_HUNT,
  anchorGateStillOpen: GATE2_TARGETS.anchor.E97Peak, // 0.2141254901198318, unchanged
  headlineCorrection:
    'the carrier eq (10) has TWO ladder exponents sA(x) and sB(x) plus a gamma(x) ratio; imp-95013 enumerated only sB(x)',
  transcriptionFlag:
    'paper eq (10) b_n = exp(t0 log^2 n / 4) carries the row constant t0 as a factor; imp-95012 baked b_n = exp((log n)^2/4) without t0 -- a candidate cross-check ticket, not fixed here',
  blockedOnSpecStillStands: true,
  ranScan: false,
  emittedE97Measurement: false,
  surrogateSubstitution: false,
  namedSubGap: 'imp-95072-sub-landmark-map-and-sxrelation',
  subGapStatement:
    'the single input that unlocks compute_exact_N, sA(x)/sB(x), and the numeric carrier c_n(x) is the external Polymath-15 [4] landmark map eqs (20)-(24) plus the s<->x relation; transcribing them (and, separately, the window/seam kernel sweeps for input (4)) turns the paper structural forms into an evaluable arithmetic pipeline; the reference verify_uniform_error_01787854.c must then be WRITTEN, not found (paper gate G1 confirms no such implementation exists)',
  isRigorous: false,
  promotesBound: false,
  verdict:
    'Hunt result (assess only): the committed paper recovers the structural FORM (carrier eq (10)) and the external CITATION (Polymath [4]) for the Gate-2 evaluator, and corrects imp-95013 by exposing a SECOND ladder exponent sA(x) and the gamma(x) ratio; but none of the five inputs is yet an evaluable arithmetic function in-repo, so imp-95013 BLOCKED-ON-SPEC still stands. The unlock is precisely scoped: transcribe the external Polymath-15 landmark map + s<->x relation (recovers inputs 1,2,3), transcribe the window/seam kernel sweeps (input 4); the reference C file (input 5) is genuinely absent everywhere and must be written, not found. Runs no scan, emits no E97 measurement, makes no surrogate substitution. Changes no bound; closes no gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ────────────
export const IMP95072_EVALUATOR_INPUT_HUNT_ASSERTIONS = [
  {
    id: 'imp95072-covers-all-five-imp95013-inputs',
    description: 'the hunt reports on exactly the five imp-95013 evaluator inputs',
    holds: () => EVALUATOR_INPUT_HUNT.length === 5,
  },
  {
    id: 'imp95072-every-input-not-evaluable-in-repo',
    description: 'no input is yet an evaluable arithmetic function in-repo, so BLOCKED-ON-SPEC stands',
    holds: () =>
      EVALUATOR_INPUT_HUNT.every((h) => h.evaluableInRepo === false) &&
      IMP95072_EVALUATOR_INPUT_HUNT.blockedOnSpecStillStands === true,
  },
  {
    id: 'imp95072-tiers-are-a-refinement-not-flat',
    description: 'the hunt is a genuine refinement: it uses at least three distinct recoverability tiers, not a flat absent flag',
    holds: () => {
      const tiers = new Set(EVALUATOR_INPUT_HUNT.map((h) => h.tier));
      const valid = new Set(Object.values(RECOVERY_TIERS));
      return tiers.size >= 3 && [...tiers].every((t) => valid.has(t));
    },
  },
  {
    id: 'imp95072-carrier-structure-present-reference-genuinely-missing',
    description: 'carrier form (eq 10) is structure-present; the reference C file is genuinely-missing',
    holds: () => {
      const carrier = EVALUATOR_INPUT_HUNT.find((h) => h.key === 'carrier_c_of_x');
      const ref = EVALUATOR_INPUT_HUNT.find((h) => h.key === 'reference_c_file');
      return (
        carrier.tier === RECOVERY_TIERS.STRUCTURE_PRESENT &&
        ref.tier === RECOVERY_TIERS.GENUINELY_MISSING
      );
    },
  },
  {
    id: 'imp95072-landmark-map-recoverable-external',
    description: 'compute_exact_N is recoverable-external (via the cited Polymath [4] reference), not in-repo',
    holds: () => {
      const lm = EVALUATOR_INPUT_HUNT.find((h) => h.key === 'compute_exact_N');
      return lm.tier === RECOVERY_TIERS.RECOVERABLE_EXTERNAL && lm.evaluableInRepo === false;
    },
  },
  {
    id: 'imp95072-two-exponent-correction',
    description: 'the hunt records the two-exponent correction (sA and sB), the key error in imp-95013',
    holds: () => {
      const exps = EVALUATOR_INPUT_HUNT.find((h) => h.key === 'sB_of_x_and_sA_of_x');
      return (
        /sA/.test(exps.stillMissing) &&
        /sB/.test(exps.stillMissing) &&
        /TWO exponents/.test(exps.stillMissing) &&
        /TWO ladder exponents sA/.test(IMP95072_EVALUATOR_INPUT_HUNT.headlineCorrection)
      );
    },
  },
  {
    id: 'imp95072-anchor-gate-unchanged',
    description: 'the anchor gate the future scanner must clear is unchanged from the frozen spec',
    holds: () => IMP95072_EVALUATOR_INPUT_HUNT.anchorGateStillOpen === 0.2141254901198318,
  },
  {
    id: 'imp95072-no-surrogate-no-scan-no-qed',
    description: 'ticket protocol honored: no scan, no measurement, no surrogate, no QED, no refereed bound is changed',
    holds: () =>
      IMP95072_EVALUATOR_INPUT_HUNT.ranScan === false &&
      IMP95072_EVALUATOR_INPUT_HUNT.emittedE97Measurement === false &&
      IMP95072_EVALUATOR_INPUT_HUNT.surrogateSubstitution === false &&
      IMP95072_EVALUATOR_INPUT_HUNT.promotesBound === false &&
      IMP95072_EVALUATOR_INPUT_HUNT.isRigorous === false &&
      /NO QED/.test(IMP95072_EVALUATOR_INPUT_HUNT.verdict) &&
      /refereed bound is changed/i.test(IMP95072_EVALUATOR_INPUT_HUNT.verdict),
  },
];

for (const a of IMP95072_EVALUATOR_INPUT_HUNT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95072-gate2-evaluator-input-hunt assertion failed: ${a.id}`);
  }
}

export default IMP95072_EVALUATOR_INPUT_HUNT;

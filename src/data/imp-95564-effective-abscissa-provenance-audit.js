/**
 * imp-95564 - Provenance audit of the claimed Polymath A/B-effective +0.8 shift
 * that gives Re s_B ~ 1.4, and its impact on the imp-95519 zero-side gating.
 *
 * imp-95542 (sigma_B sensitivity) hangs its "obstruction dissolves" branch on the
 * perm-arch caveat that "under Polymath A/B-effective normalization s_B carries a
 * real shift ~ +0.8, giving Re s_B ~ 1.4", pushing the coefficient-ladder abscissa
 * to the RIGHT of the critical strip where zeta and L(s, chi) are unconditionally
 * zero-free. This module ASSESSES the provenance of that +0.8 shift from the
 * paper's own definitions. Accuracy audit only: no bound changes, no refereed bound is changed
 * , RH open, NO QED.
 *
 * WHAT THE PAPER ACTUALLY DEFINES. Coefficient vector (10) of "Permuting the Zeta
 * Twin Ladder" (Sections 4.1-4.6) reads, verbatim as transcribed by imp-95519:
 *     c_n(x) = b_n n^{-s_B(x)} + gamma(x) n^{-s_A(x)},
 *     b_n = exp((t0/4) log^2 n),  Re s_B = (1 + y0)/2 = 0.59045,  Im s = T.
 * The B-term exponent (1 + y0)/2 and its A-partner (1 - y0)/2 = 0.40955 ARE the
 * Polymath-15 de Bruijn-Newman effective A/B normalization already: in the
 * A_t^{eff} + B_t^{eff} approximation to H_t the B-sum carries n^{-s} at
 * Re s = (1 + y)/2 and the reflected A-sum at Re s = (1 - y)/2. So the paper is
 * NOT missing an A/B-effective normalization to which a further +0.8 must be added
 * - it is written IN that normalization, and both effective exponents sit strictly
 * inside the critical strip 0 < Re s < 1 (0.40955 and 0.59045, gap exactly y0).
 *
 * WHERE +0.8 WOULD HAVE TO COME FROM - AND DOES NOT. Reaching Re s_B ~ 1.4 from
 * the transcribed 0.59045 needs a real shift of 0.80955. The minimum shift that
 * merely exits the critical strip (to Re s = 1) is 1 - (1 + y0)/2 = (1 - y0)/2 =
 * 0.40955, i.e. exactly the A-partner exponent; the claimed +0.8 is nearly DOUBLE
 * that (ratio ~1.98). No quantity in the paper's normalization - not t0, not y0,
 * not the Gaussian b_n = exp((t0/4) log^2 n) - produces an additive real shift of
 * ~0.8 to the abscissa. A grep of the repo finds the "+0.8 / Re s_B ~ 1.4" claim
 * ONLY in the perm-arch caveat and its downstream echo imp-95542; it is asserted,
 * never derived, and no source transcribes an alternate sB_of_x whose real part
 * exceeds 1.
 *
 * SEPARATELY, sB_of_x AS A FUNCTION REMAINS MISSING. imp-95013 is BLOCKED-ON-SPEC:
 * the evaluable exponent function sB(x) (its x-dependence; Im s = T) is not
 * transcribed in the repo, only its REAL PART is pinned by eq (10). This audit
 * pins the real part - the only datum that decides inside-vs-outside the strip -
 * and does NOT claim the full evaluable sB(x); that stays a named sub-gap.
 *
 * NET. On the only transcribed definition available (eq (10)), the effective
 * abscissa STAYS in the critical strip at Re s_B = 0.59045 < 1; the ~1.4 reading
 * is UNSUBSTANTIATED - it contradicts the paper's own A/B-effective exponent and
 * has no derivation in-repo. Consequently imp-95542's "under Re s_B ~ 1.4 the
 * alpha/PCC obstruction is an artifact" is CONDITIONAL on an unverified premise,
 * and the imp-95519 zero-side framing as WRITTEN (sigma_B = 0.59045, PCC-gated) is
 * the one supported by the definitions. This changes NO bound: the last-lever
 * no-go stands on the abscissa-invariant prime side and the section 5(i)
 * small-prime closure regardless (imp-95542 already established that). Only the
 * FRAMING is corrected: do not treat Re s_B ~ 1.4 as established; the transcribed
 * effective abscissa is sub-1. No bound; NO QED; no refereed bound is changed;
 * RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

const Y0 = 0.1809;
const SIGMA_B_PAPER = (1 + Y0) / 2; // 0.59045 - paper eq (10), B-effective exponent
const SIGMA_A_PAPER = (1 - Y0) / 2; // 0.40955 - paper eq (10), A-effective (reflected) exponent
const AB_GAP = SIGMA_B_PAPER - SIGMA_A_PAPER; // = y0 = 0.1809 (the A/B split)

const SIGMA_B_CLAIMED = 1.4; // perm-arch caveat / imp-95542 A/B-effective reading
const CLAIMED_SHIFT = SIGMA_B_CLAIMED - SIGMA_B_PAPER; // 0.80955 - the "+0.8" being audited
const MIN_EXIT_SHIFT = 1 - SIGMA_B_PAPER; // 0.40955 = (1-y0)/2 = min shift to reach Re s = 1
const SHIFT_RATIO = CLAIMED_SHIFT / MIN_EXIT_SHIFT; // ~1.977: claimed shift ~2x the exit shift

export const IMP95564_EFFECTIVE_ABSCISSA_AUDIT = Object.freeze({
  ticket: 'imp-95564',
  date: '2026-09-22',
  source:
    'Permuting the Zeta Twin Ladder Sections 4.1-4.6 eq (10) (via imp-95519 transcription); perm-arch-sieve-universality-no-go-2026-09-22 imp95519Caveat; imp-95542 sigma_B sensitivity; imp-95013 sB_of_x BLOCKED-ON-SPEC',
  question:
    'Is the Polymath A/B-effective +0.8 shift giving Re s_B ~ 1.4 the correct effective abscissa, or does the effective abscissa stay in the critical strip',

  paperDefinition: {
    equation: 'c_n(x) = b_n n^{-s_B(x)} + gamma(x) n^{-s_A(x)}, b_n = exp((t0/4) log^2 n)',
    reSigmaB: SIGMA_B_PAPER,
    reSigmaA: SIGMA_A_PAPER,
    abGap: AB_GAP,
    note:
      'The (1 + y0)/2 and (1 - y0)/2 exponents ARE the Polymath-15 de Bruijn-Newman effective A/B normalization (B-sum at Re s = (1+y)/2, reflected A-sum at (1-y)/2). The paper is written IN that normalization; there is no further A/B-effective shift to apply on top of it.',
    bothInsideStrip: SIGMA_A_PAPER > 0 && SIGMA_A_PAPER < 1 && SIGMA_B_PAPER > 0 && SIGMA_B_PAPER < 1,
  },

  claimedShiftProvenance: {
    claimedReSigmaB: SIGMA_B_CLAIMED,
    claimedShift: CLAIMED_SHIFT,
    minShiftToExitStrip: MIN_EXIT_SHIFT,
    shiftVsExitRatio: SHIFT_RATIO,
    derivableFromPaper: false,
    foundInRepoOnlyAs:
      'the perm-arch imp95519Caveat and its downstream echo imp-95542 - asserted, never derived; no source transcribes an alternate sB_of_x with real part > 1',
    reading:
      'Reaching Re s_B ~ 1.4 needs a real shift of ~0.80955, nearly DOUBLE the minimum 0.40955 = (1-y0)/2 that merely exits the strip. No quantity in the normalization (t0, y0, the Gaussian b_n) produces an additive ~0.8 abscissa shift. The +0.8 is spurious.',
  },

  sBofxStatus: {
    realPartPinned: true,
    realPartValue: SIGMA_B_PAPER,
    fullFunctionTranscribed: false,
    note:
      'imp-95013 is BLOCKED-ON-SPEC: the evaluable sB(x) (x-dependence; Im s = T) is not in the repo, only its real part is fixed by eq (10). This audit pins the real part - the datum that decides inside-vs-outside the strip - and leaves the full evaluable sB(x) a named sub-gap.',
    namedSubGap: 'imp-95013-sub-native-evaluator-spec',
  },

  netVerdict:
    'On the only transcribed definition (eq (10)) the effective abscissa STAYS in the critical strip at Re s_B = 0.59045 < 1; the Re s_B ~ 1.4 reading is UNSUBSTANTIATED - it contradicts the paper A/B-effective exponent and has no in-repo derivation, so its +0.8 shift is spurious. Therefore the imp-95542 "obstruction dissolves at Re s_B ~ 1.4" branch is CONDITIONAL on an unverified premise, and the imp-95519 zero-side framing as written (sigma_B = 0.59045, PCC-gated) is the definition-supported one. This changes NO bound: the last-lever no-go stands on the abscissa-invariant prime side and the section 5(i) small-prime closure regardless. Only the framing is corrected: do not treat Re s_B ~ 1.4 as established. No bound; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The abscissa arithmetic and the identification of (1 +/- y0)/2 with the Polymath A/B-effective exponents are elementary and exact; the provenance finding is a repo-and-paper transcription audit, not a new theorem. It corrects the FRAMING of imp-95542, not any bound.',
});

export const IMP95564_EFFECTIVE_ABSCISSA_AUDIT_ASSERTIONS = Object.freeze([
  {
    id: 'imp95564-paper-b-exponent',
    description: 'paper eq (10) B-effective exponent is (1+y0)/2 = 0.59045, inside the critical strip',
    holds: () => Math.abs(SIGMA_B_PAPER - 0.59045) < 1e-12 && SIGMA_B_PAPER < 1,
  },
  {
    id: 'imp95564-paper-a-exponent',
    description: 'paper eq (10) A-effective exponent is (1-y0)/2 = 0.40955, also inside the strip',
    holds: () => Math.abs(SIGMA_A_PAPER - 0.40955) < 1e-12 && SIGMA_A_PAPER > 0 && SIGMA_A_PAPER < 1,
  },
  {
    id: 'imp95564-ab-gap-is-y0',
    description: 'the A/B effective split is exactly y0 = 0.1809, not a ~0.8 shift',
    holds: () => Math.abs(AB_GAP - Y0) < 1e-12,
  },
  {
    id: 'imp95564-claimed-shift-nearly-double-exit',
    description: 'the claimed +0.8 shift (0.80955) is ~2x the minimum 0.40955 = (1-y0)/2 needed to exit the strip',
    holds: () =>
      Math.abs(CLAIMED_SHIFT - 0.80955) < 1e-9 &&
      Math.abs(MIN_EXIT_SHIFT - SIGMA_A_PAPER) < 1e-12 &&
      SHIFT_RATIO > 1.9 && SHIFT_RATIO < 2.0,
  },
  {
    id: 'imp95564-effective-abscissa-stays-in-strip',
    description: 'on the transcribed definition the effective abscissa is sub-1; the ~1.4 reading is not derivable',
    holds: () =>
      IMP95564_EFFECTIVE_ABSCISSA_AUDIT.paperDefinition.bothInsideStrip === true &&
      IMP95564_EFFECTIVE_ABSCISSA_AUDIT.claimedShiftProvenance.derivableFromPaper === false,
  },
  {
    id: 'imp95564-sbofx-realpart-only',
    description: 'audit pins Re s_B from eq (10) but leaves full sB(x) a named sub-gap (imp-95013)',
    holds: () =>
      IMP95564_EFFECTIVE_ABSCISSA_AUDIT.sBofxStatus.realPartPinned === true &&
      IMP95564_EFFECTIVE_ABSCISSA_AUDIT.sBofxStatus.fullFunctionTranscribed === false,
  },
  {
    id: 'imp95564-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95564_EFFECTIVE_ABSCISSA_AUDIT.promotesBound === false &&
      /NO QED/.test(IMP95564_EFFECTIVE_ABSCISSA_AUDIT.netVerdict) &&
      /refereed bound is changed/i.test(IMP95564_EFFECTIVE_ABSCISSA_AUDIT.netVerdict),
  },
]);

for (const a of IMP95564_EFFECTIVE_ABSCISSA_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95564-effective-abscissa-provenance-audit assertion failed: ${a.id}`);
  }
}

export default IMP95564_EFFECTIVE_ABSCISSA_AUDIT;

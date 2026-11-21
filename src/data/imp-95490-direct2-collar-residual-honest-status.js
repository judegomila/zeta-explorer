/**
 * @module imp-95490-direct2-collar-residual-honest-status
 *
 * imp-95490 (content, S-frontier): standalone honest-status note recording
 * the imp-95426 verdict for a reader who has not read imp-95426 in full.
 * THEOREM DIRECT-2 (the 2x2 seam-pencil reduction) is uniformly the tightest
 * of the three closed-form two-block bounds, but it does NOT close the
 * sigma -> 1 collar residual wedge against the exact joint pencil that
 * imp-95378 named.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   (1) UNIFORMLY THE TIGHTEST BOUND. THEOREM DIRECT-2 reduces the imp-95249
 *   seam pencil directly to a 2x2 generalized Rayleigh quotient and is
 *   provably <= both SPLIT-2 and SPLIT-LOO everywhere (elementary AM-GM /
 *   sigma <= 1 orderings), hence <= their min. Measured on the imp-95378 /
 *   imp-95256 35-point surface, DIRECT/MIN in [0.8945, 1.0]: never worse,
 *   up to ~11.8% tighter where the two block quotients L1, L2 are the most
 *   asymmetric.
 *
 *   (2) THE COLLAR RESIDUAL WEDGE STAYS OPEN. DIRECT still carries the same
 *   1/(1-sigma^2) angular collar as SPLIT-2 and SPLIT-LOO, and in the
 *   symmetric-twin limit L1 = L2 (the every-octave nearby-cluster regime the
 *   certificate is meant to serve) it collapses EXACTLY to SPLIT-2 -- the
 *   AM-GM gain vanishes exactly where the residual matters most. Measured
 *   DIRECT/exact spans [1.194, 3.22e6], the SAME range imp-95378 found for
 *   MIN/exact, and a collar sweep confirms DIRECT/exact ~ C/(1-sigma): the
 *   wedge is unbounded as sigma -> 1.
 *
 *   So: THEOREM DIRECT-2 is a genuine, uniform improvement over the pointwise
 *   min -- but the improvement is bounded (~12%) and orthogonal to the
 *   collar; it fixes the numerator pricing (arithmetic vs sqrt), not the
 *   denominator's angle relaxation that produces the collar. Closing the
 *   residual still needs the full joint pencil, which is NOT 2x2-reducible.
 *
 * @see imp-95426-direct-seam-pencil-twoblock-bound (source derivation, measurement, verdict)
 * @see imp-95378-min-split-certificate (origin of the collar residual wedge claim)
 */

import {
  IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND,
  IMP95426_SURFACE_SUMMARY,
} from './imp-95426-direct-seam-pencil-twoblock-bound.js';

export const IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS = {
  id: 'imp-95490',
  proofSection: 'S-frontier',
  headline:
    'THEOREM DIRECT-2 IS UNIFORMLY THE TIGHTEST TWO-BLOCK SEAM BOUND -- ' +
    'BUT THE SIGMA -> 1 COLLAR RESIDUAL WEDGE STAYS OPEN',
  statements: {
    S1_uniformly_tightest: {
      claim:
        'THEOREM DIRECT-2 is provably <= min(SPLIT-2, SPLIT-LOO) at every ' +
        'surface point (elementary AM-GM / sigma<=1 orderings) and up to ' +
        '~12% tighter where the block quotients L1, L2 are most asymmetric.',
      directOverMinRange: IMP95426_SURFACE_SUMMARY.directOverMinRange,
      maxImprovementMinOverDirect:
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.sharperThanMin
          .maxImprovementMinOverDirect,
    },
    S2_collar_residual_open: {
      claim:
        'DIRECT still carries the shared 1/(1-sigma^2) angular collar and ' +
        'collapses exactly to SPLIT-2 in the symmetric-twin limit L1=L2, so ' +
        'the imp-95378 residual wedge against the exact joint pencil ' +
        'survives, unbounded as sigma -> 1.',
      directOverExactRange: IMP95426_SURFACE_SUMMARY.directOverExactRange,
      symmetricTwinCollapseDirectOverSplit2:
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.doesNotCloseCollar
          .symmetricTwinCollapseDirectOverSplit2,
      collarLaw:
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.doesNotCloseCollar
          .collarLaw,
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). THEOREM DIRECT-2 ' +
    'is uniformly the tightest of the three closed-form two-block seam ' +
    'bounds (never worse than min(SPLIT-2, SPLIT-LOO), up to ~12% tighter ' +
    'for asymmetric blocks), but it does NOT close the sigma -> 1 collar ' +
    'residual wedge against the exact joint pencil: it shares the same ' +
    '1/(1-sigma^2) collar and collapses to SPLIT-2 at L1=L2. Ports nothing; ' +
    'measures nothing new; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95426-direct-seam-pencil-twoblock-bound (source derivation, measurement, and verdict).',
};

export const IMP95490_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95490-headline-names-both-claims',
    description:
      'Headline names both the uniform tightest-bound claim and the still-open collar wedge',
    holds: () =>
      /UNIFORMLY THE TIGHTEST TWO-BLOCK SEAM BOUND/.test(
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.headline,
      ) &&
      /COLLAR RESIDUAL WEDGE STAYS OPEN/.test(
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.headline,
      ),
  },
  {
    id: 'imp95490-tightest-range-matches-source',
    description:
      'The DIRECT/MIN range and max improvement quoted here match the imp-95426 module exactly',
    holds: () => {
      const [lo, hi] =
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.statements
          .S1_uniformly_tightest.directOverMinRange;
      const [srcLo, srcHi] = IMP95426_SURFACE_SUMMARY.directOverMinRange;
      const maxImp =
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.statements
          .S1_uniformly_tightest.maxImprovementMinOverDirect;
      return (
        lo === srcLo &&
        hi === srcHi &&
        hi <= 1.0000001 &&
        maxImp > 1.11 &&
        maxImp < 1.12
      );
    },
  },
  {
    id: 'imp95490-collar-range-matches-source-and-unbounded',
    description:
      'The DIRECT/exact range quoted here matches the imp-95426 module and the symmetric-twin collapse ratio is ~1',
    holds: () => {
      const [lo, hi] =
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.statements
          .S2_collar_residual_open.directOverExactRange;
      const [srcLo, srcHi] = IMP95426_SURFACE_SUMMARY.directOverExactRange;
      const collapse =
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.statements
          .S2_collar_residual_open.symmetricTwinCollapseDirectOverSplit2;
      return (
        lo === srcLo &&
        hi === srcHi &&
        lo > 1.1 &&
        hi > 1e5 &&
        Math.abs(collapse - 1) < 1e-5
      );
    },
  },
  {
    id: 'imp95490-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.verdict,
      ) &&
      /not a new claim/.test(
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.verdict,
      ) &&
      /NO QED/.test(IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(
        IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS.verdict,
      ),
  },
];

for (const a of IMP95490_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95490-direct2-collar-residual-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP95490_DIRECT2_COLLAR_RESIDUAL_HONEST_STATUS;

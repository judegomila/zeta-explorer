/**
 * @module imp-95456-min-split-inter-cert-closed-honest-status
 *
 * imp-95456 (content, S-frontier): standalone honest-status note recording
 * the imp-95378 verdict on the pointwise certificate
 * min(SPLIT-2, SPLIT-LOO) for the joint two-block quotient
 * Lambda(V_1 u V_2, x). Two DIFFERENT gaps are in play and imp-95378 closes
 * only one of them; this note states that split for a reader who has not
 * read imp-95378 in full.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   (1) INTER-CERTIFICATE gap (imp-95256): SPLIT-2 and SPLIT-LOO never
 *   differ from each other by more than 2x. Taking the pointwise minimum
 *   of the two proven upper bounds ABSORBS this wedge completely and
 *   uniformly -- by construction the min equals the tighter certificate at
 *   every (geometry, depth) point, so a user who reports the min never pays
 *   the up-to-2x penalty of guessing the wrong single split. Measured
 *   across the imp-95378 35-point surface: worse-certificate/min = 1.9996
 *   at most. Residual here is exactly zero.
 *
 *   (2) CERTIFICATE-TO-EXACT gap: the min vs the exact joint pencil
 *   Lambda(V_1 u V_2, x). This gap is NOT closed by the min and cannot be,
 *   because SPLIT-2 and SPLIT-LOO share the same angular-collar denominator
 *   ((1 - sigma) resp. (1 - sigma^2)); the min of two collar-limited blow-
 *   ups is still collar-limited. Measured min/exact ranges from ~1.19x
 *   (wide separation) to > 3.2e6x (nearby twin lattice, sigma -> 1), and a
 *   collar sweep confirms min/exact ~ C/(1 - sigma) as clusters merge -- an
 *   UNBOUNDED residual as sigma -> 1.
 *
 *   So: uniform closure of the <=2x inter-certificate gap, but an unbounded
 *   collar-limited residual survives against the exact pencil. Closing that
 *   residual needs a genuinely non-diagonal joint collar (e.g. the
 *   imp-95249 seam pencil used directly), not a choice between the two
 *   existing collared forms.
 *
 * @see imp-95378-min-split-certificate (source measurement and verdict)
 * @see imp-95256-... (origin of the <=2x inter-certificate non-dominance claim)
 */

import {
  IMP95378_MIN_SPLIT_CERTIFICATE,
  IMP95378_SURFACE_SUMMARY,
} from './imp-95378-min-split-certificate.js';

export const IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS = {
  id: 'imp-95456',
  proofSection: 'S-frontier',
  headline:
    'MIN(SPLIT-2, SPLIT-LOO) CLOSES THE <=2x INTER-CERTIFICATE GAP UNIFORMLY ' +
    '-- BUT LEAVES AN UNBOUNDED COLLAR-LIMITED RESIDUAL VS THE EXACT PENCIL AS SIGMA -> 1',
  statements: {
    S1_inter_certificate_gap_closed: {
      claim:
        'the pointwise min of the two proven upper bounds SPLIT-2 and SPLIT-LOO ' +
        'absorbs the imp-95256 <=2x inter-certificate wedge completely and ' +
        'uniformly: residual is exactly zero, since the min equals the tighter ' +
        'of the two at every surface point.',
      maxWorseCertOverMin:
        IMP95378_MIN_SPLIT_CERTIFICATE.interCertificateGap.maxWorseCertOverMin,
      residualIsZero: true,
    },
    S2_residual_vs_exact_unbounded: {
      claim:
        'the min does NOT close the gap to the exact joint pencil and cannot, ' +
        'because both splits share the same angular collar; the residual ' +
        'min/exact grows like C/(1 - sigma) and is unbounded as sigma -> 1.',
      minOverExactRange: IMP95378_SURFACE_SUMMARY.minOverExactRange,
      collarLaw: IMP95378_MIN_SPLIT_CERTIFICATE.certificateToExactGap.collarLaw,
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). ' +
    'min(SPLIT-2, SPLIT-LOO) uniformly closes the <=2x INTER-certificate gap ' +
    'of imp-95256 (residual exactly zero) but leaves a large, UNBOUNDED ' +
    'residual wedge against the EXACT joint pencil as sigma -> 1, driven by ' +
    'the angular collar shared by both splits. Ports nothing; measures ' +
    'nothing new; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95378-min-split-certificate (source derivation, measurement, and verdict).',
};

export const IMP95456_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95456-headline-names-both-gaps',
    description:
      'Headline names the closed inter-certificate gap and the unbounded residual vs exact',
    holds: () =>
      /INTER-CERTIFICATE GAP UNIFORMLY/.test(
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.headline,
      ) &&
      /UNBOUNDED COLLAR-LIMITED RESIDUAL/.test(
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.headline,
      ),
  },
  {
    id: 'imp95456-inter-cert-residual-zero-and-bounded-by-2',
    description:
      'The recorded max worse-certificate/min ratio is <= 2 and the residual is flagged as exactly zero',
    holds: () =>
      IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.statements
        .S1_inter_certificate_gap_closed.maxWorseCertOverMin <= 2 &&
      IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.statements
        .S1_inter_certificate_gap_closed.residualIsZero === true,
  },
  {
    id: 'imp95456-exact-gap-range-matches-source',
    description:
      'The min/exact range quoted here matches the imp-95378 measured surface summary exactly',
    holds: () => {
      const [lo, hi] =
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.statements
          .S2_residual_vs_exact_unbounded.minOverExactRange;
      const [srcLo, srcHi] = IMP95378_SURFACE_SUMMARY.minOverExactRange;
      return lo === srcLo && hi === srcHi && lo > 1.1 && hi > 1e5;
    },
  },
  {
    id: 'imp95456-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.verdict,
      ) &&
      /not a new claim/.test(
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.verdict,
      ) &&
      /NO QED/.test(IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(
        IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS.verdict,
      ),
  },
];

for (const a of IMP95456_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95456-min-split-inter-cert-closed-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP95456_MIN_SPLIT_INTER_CERT_CLOSED_HONEST_STATUS;

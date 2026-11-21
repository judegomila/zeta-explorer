/**
 * @module imp-95475-xstar-unif-onset-robust-honest-status
 *
 * imp-95475 (content): standalone honest-status note recording the
 * imp-95259 verdict for a reader who has not read imp-95259 in full: the
 * imp-95250 LEMMA TAIL crude PhiUnif lower bound is robust to tightening --
 * it already agrees with the exact infinite cross-Blaschke product to
 * within one ulp, so the XSTAR_UNIF = 27.035582 unbounded-count firing
 * onset does NOT move under a tighter closed-form PhiUnif.
 *
 * DOCUMENTATION ONLY. Ports nothing; measures nothing new; changes no
 * bound; NO QED. No refereed bound is changed.
 *
 * THE NOTE
 * -----------------------------------------------------------------------------
 *   imp-95250 COROLLARY EV-OCT-UNIF certifies the uniform every-octave-
 *   multiplicity block fence via a single constant PhiUnif, lower-bounded
 *   by a CRUDE two-step tail estimate (linearize 1 - b_n^8 <= 8(1 - b_n),
 *   then apply the Weierstrass product-vs-sum inequality, truncated at
 *   N = 30). That crude bound feeds the certificate
 *     sqrt(Lambda) <= [e^(-x)(1 + 2x) + 2 e^(-3x/2)] / sqrt(PhiUnif)
 *   whose unbounded-count firing onset is XSTAR_UNIF = 27.035582.
 *
 *   imp-95259 measured whether a tighter closed-form PhiUnif could raise
 *   the fence (and hence lower XSTAR_UNIF): it compared the crude literal
 *   PhiUnif_crude = 9.977927681808903e-21 against the exact infinite
 *   product PhiUnif_exact = 9.977927681808923e-21 by log-summation to
 *   n = 1000. The two agree to a relative gap of ~1.81e-15 -- within one
 *   ulp. The N = 30 truncation deficit (~1.94e-8) is small enough that the
 *   second-order corrections dropped by both crude steps are O(1e-16),
 *   below double precision, so nothing was left on the table.
 *
 *   Because the firing onset x* satisfies envelope(x*)^2 = level x PhiUnif,
 *   a relative change eps in PhiUnif shifts x* by only ~eps/2. With
 *   eps ~ 1.81e-15 the onset shift is ~1e-15 -- unresolvable in double
 *   precision. XSTAR_UNIF = 27.035582 is therefore ROBUST to PhiUnif
 *   tightening: no re-derivation of the tail estimate is warranted.
 *
 * @see imp-95259-phiunif-crude-tail-tightness (source measurement and verdict)
 * @see imp-95250-leaveoneout-multiblock-split-certificate (COROLLARY EV-OCT-UNIF, PhiUnif, XSTAR_UNIF)
 */

import { IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS } from './imp-95259-phiunif-crude-tail-tightness.js';

export const IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS = {
  id: 'imp-95475',
  proofSection: 'S-frontier',
  headline:
    'XSTAR_UNIF = 27.035582 IS ROBUST TO PhiUnif TIGHTENING -- ' +
    'THE imp-95250 CRUDE TAIL BOUND ALREADY SITS WITHIN ONE ULP OF THE EXACT PRODUCT',
  statements: {
    crude_is_sharp: {
      claim:
        'The imp-95250 LEMMA TAIL crude PhiUnif lower bound agrees with the ' +
        'exact infinite cross-Blaschke product to a relative gap of ' +
        '~1.81e-15 (within one ulp) at the chosen N = 30 truncation.',
      phiUnifCrude: IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.phiUnifCrude,
      phiUnifExact: IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.phiUnifExact,
      relGapExactMinusCrude:
        IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.relGapExactMinusCrude,
    },
    onset_unchanged: {
      claim:
        'Because the firing onset shifts by only ~eps/2 for a relative ' +
        'PhiUnif change eps, the ~1.81e-15 gap moves XSTAR_UNIF by ~1e-15 -- ' +
        'unresolvable in double precision, so the onset is unchanged to ' +
        'machine precision.',
      xstarUnifUnchanged: IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.xstarUnifUnchanged,
    },
    no_rederivation_warranted: {
      claim:
        'A tighter closed-form PhiUnif does NOT raise the uniform fence and ' +
        'does NOT lower the unbounded-count firing threshold; no ' +
        're-derivation of the crude tail estimate is warranted.',
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS NOTE (documentation, not a new claim). ' +
    'The imp-95259 measurement confirms the imp-95250 crude PhiUnif lower ' +
    'bound is effectively sharp (within one ulp of the exact infinite ' +
    'product), so the XSTAR_UNIF = 27.035582 unbounded-count firing onset ' +
    'is ROBUST to PhiUnif tightening. Ports nothing; measures nothing new; ' +
    'changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95259-phiunif-crude-tail-tightness (source measurement and verdict); ' +
    'imp-95250-leaveoneout-multiblock-split-certificate (COROLLARY EV-OCT-UNIF).',
};

export const IMP95475_HONEST_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp95475-headline-names-robust-onset',
    description:
      'Headline names the robust onset value and the one-ulp crude bound',
    holds: () =>
      /XSTAR_UNIF = 27.035582 IS ROBUST/.test(
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.headline,
      ) &&
      /WITHIN ONE ULP/.test(
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.headline,
      ),
  },
  {
    id: 'imp95475-crude-and-exact-match-source-and-agree',
    description:
      'The recorded crude/exact PhiUnif values match the imp-95259 source exactly and agree to < 1e-14 relative',
    holds: () => {
      const s =
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.statements
          .crude_is_sharp;
      return (
        s.phiUnifCrude === IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.phiUnifCrude &&
        s.phiUnifExact === IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.phiUnifExact &&
        s.relGapExactMinusCrude < 1e-14
      );
    },
  },
  {
    id: 'imp95475-onset-matches-source',
    description:
      'The recorded unchanged onset matches the imp-95259 source XSTAR_UNIF literal exactly',
    holds: () =>
      IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.statements.onset_unchanged
        .xstarUnifUnchanged ===
      IMP95259_PHIUNIF_CRUDE_TAIL_TIGHTNESS.xstarUnifUnchanged,
  },
  {
    id: 'imp95475-honesty-gate-no-qed',
    description: 'Documentation only: not rigorous, no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.isRigorous === false &&
      /HONEST-STATUS NOTE/.test(
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.verdict,
      ) &&
      /not a new claim/.test(
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.verdict,
      ) &&
      /NO QED/.test(IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(
        IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS.verdict,
      ),
  },
];

for (const a of IMP95475_HONEST_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95475-xstar-unif-onset-robust-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP95475_XSTAR_UNIF_ONSET_ROBUST_HONEST_STATUS;

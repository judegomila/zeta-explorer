/**
 * @module imp-35711-postport-parity-no-beat-honest-status-banner
 *
 * imp-35711 (content, S-frontier): imp-35654 F3 characterizes the post-port
 * far-tail bridge as "unconditional up to a vanishing GUE-conditional share
 * sigma" -- an ASYMPTOTIC collapse from two orthogonal conditionalities to
 * one. That framing, read quickly, sounds like progress toward an
 * unconditional RH result. F3 already carries the correction (the collapse is
 * still only PARITY-WITH-PT, no beat of Lambda<=0.2) but that caveat has no
 * dedicated honest-status banner of its own. This module IS that banner: a
 * standalone, prominent, self-asserting companion that states the no-beat
 * verdict without the surrounding derivation, so a reader who lands only on
 * this module (via cross-reference, search, or dashboard) gets the correction
 * first.
 *
 * DOCUMENTATION ONLY. Ports nothing; discharges nothing; changes no bound;
 * establishes no operator positivity; adds no new claim beyond imp-35654 F3;
 * C_mb GUE-conditional (imp-486) UNTOUCHED; the imp-34791 E_trunc
 * barrier-lemma reclassification UNCHANGED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE BANNER (restated from imp-35654 F3; no new derivation)
 * -----------------------------------------------------------------------------
 *   "Collapse to one conditionality" IS NOT "beats Lambda <= 0.2."
 *   The ported far-tail bridge becomes ASYMPTOTICALLY unconditional (residual
 *   GUE-conditional share = sigma -> 0, sigma-TRACKING not sigma-blind) but:
 *     (i)   it is STILL ONLY PARITY-WITH-PT -- the ported machinery IS PT own
 *           Lambda <= 0.2 barrier theorem, so it MATCHES 0.2, it does NOT beat it
 *           (imp-35419 C2);
 *    (ii)   it is GUE-conditional on a NONZERO share sigma for EVERY finite N
 *           -- the asymptotic collapse to one class never reaches zero
 *           conditionality at any finite height;
 *   (iii)   C_mb stays GUE-conditional per imp-486, UNTOUCHED by the port.
 *
 * The punchline: read "unconditional up to a vanishing share" as an honest
 * ASYMPTOTIC-PARITY statement, NOT as an unconditional-RH beat. No bound
 * changes; NO QED; no refereed bound is changed.
 *
 * @see imp-35654-ported-barrier-far-tail-mixed-conditionality (source: F3 "unconditional up to a vanishing GUE share" + no-beat caveat)
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (C1: barrier theorem itself unconditional; C2: ported machinery IS PT own Lambda<=0.2 machinery)
 * @see imp-35678-finite-height-beat-vs-parity-regime-boundary (COMPATIBLE reading: finite-N numeric beat vs. asymptotic-parity machinery are different regimes)
 * @see imp-486 (C_mb GUE-conditional -- the surviving residual after the port)
 */

const L_PT = 0.2; // Platt-Trudgian 2021 bound -- the value the ported bridge MATCHES, not beats
const RESIDUAL_GUE_SHARE_SYMBOL = 'sigma'; // the only surviving conditional dependence (vanishing, never zero at finite N)

export const IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER = {
  id: 'imp-35711',
  proofSection: 'S-frontier',
  bannerLevel: 'PROMINENT',
  headline: 'COLLAPSE TO ONE CONDITIONALITY IS NOT A BEAT OF LAMBDA <= 0.2',
  statements: {
    S1_still_only_parity: {
      claim:
        'The imp-35654 post-port far-tail bridge is ASYMPTOTICALLY unconditional (residual GUE-conditional ' +
        'share sigma -> 0) but this is STILL ONLY PARITY-WITH-PT: the ported machinery IS the Polymath15/PT ' +
        'own Lambda <= 0.2 barrier theorem (imp-35419 C2), so the bridge MATCHES 0.2, it does NOT beat it.',
      L_pt_matched_not_beaten: L_PT,
    },
    S2_nonzero_at_every_finite_N: {
      claim:
        'For every FINITE N the residual GUE-conditional share ' + RESIDUAL_GUE_SHARE_SYMBOL + ' is NONZERO ' +
        '-- the collapse from two conditional classes to one is an asymptotic statement, not a finite-N ' +
        'unconditional result. It never reaches exactly zero conditionality at any finite height.',
    },
    S3_c_mb_untouched: {
      claim:
        'C_mb stays GUE-conditional per imp-486, UNTOUCHED by the port. The port folds only the sigma-blind ' +
        'C_T-barrier share into unconditional (imp-35419 C1); it does not touch the imp-486 GUE dependence.',
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS BANNER (documentation, NOT a new claim). Restates imp-35654 F3 prominently so the ' +
    '"unconditional up to a vanishing GUE-conditional share" framing is never mistaken for an unconditional-RH ' +
    'beat: the ported far-tail bridge is STILL ONLY PARITY-WITH-PT (matches Lambda <= 0.2, does NOT beat it, ' +
    'imp-35419 C2), remains GUE-conditional on a NONZERO share for every finite N, and leaves C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED. Ports nothing; discharges nothing; changes no bound; establishes ' +
    'no operator positivity; the imp-34791 E_trunc barrier-lemma reclassification UNCHANGED; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35654 (source: F3 asymptotic-parity framing and no-beat caveat); imp-35419 (C1: barrier theorem ' +
    'itself unconditional; C2: ported machinery IS PT own Lambda<=0.2 machinery); imp-35678 (compatible ' +
    'finite-N-beat vs. asymptotic-parity regime boundary); imp-486 (C_mb GUE-conditional, untouched).',
};

export const IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER_ASSERTIONS = [
  {
    // The banner must be flagged prominent and carry the no-beat headline verbatim.
    id: 'imp35711-banner-is-prominent',
    description: 'Banner is flagged PROMINENT with a headline stating no-beat',
    holds: () =>
      IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.bannerLevel === 'PROMINENT' &&
      /NOT A BEAT OF LAMBDA/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.headline),
  },
  {
    // S1: parity-not-beat statement carries the correct L_PT value.
    id: 'imp35711-parity-not-beat-value',
    description: 'S1 states parity-with-PT at Lambda = 0.2, matched not beaten',
    holds: () =>
      Math.abs(
        IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S1_still_only_parity
          .L_pt_matched_not_beaten - 0.2,
      ) < 1e-15 &&
      /STILL ONLY PARITY-WITH-PT/.test(
        IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S1_still_only_parity.claim,
      ) &&
      /does NOT beat it/.test(
        IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S1_still_only_parity.claim,
      ),
  },
  {
    // S2: the nonzero-at-finite-N claim is present.
    id: 'imp35711-nonzero-at-finite-n',
    description: 'S2 states the residual GUE share is nonzero at every finite N',
    holds: () =>
      /NONZERO/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S2_nonzero_at_every_finite_N.claim) &&
      /FINITE N/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S2_nonzero_at_every_finite_N.claim),
  },
  {
    // S3: C_mb GUE-conditional untouched claim references imp-486.
    id: 'imp35711-c-mb-untouched',
    description: 'S3 states C_mb stays GUE-conditional per imp-486, untouched by the port',
    holds: () =>
      /imp-486/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S3_c_mb_untouched.claim) &&
      /UNTOUCHED/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.statements.S3_c_mb_untouched.claim),
  },
  {
    // Honesty gate: documentation only, no QED, no refereed bound is changed.
    id: 'imp35711-honesty-gate-no-qed',
    description: 'Documentation only: no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.isRigorous === false &&
      /HONEST-STATUS BANNER/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /NOT a new claim/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /NO QED/.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.verdict) &&
      /refereed bound is changed/i.test(IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER.verdict),
  },
];

for (const a of IMP35711_POSTPORT_PARITY_NO_BEAT_HONEST_STATUS_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35711-postport-parity-no-beat-honest-status-banner assertion failed: ${a.id}`);
  }
}

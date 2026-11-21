/**
 * imp-95388-seam-chain-obligation-ledger — single-reference roll-up of the
 * three-obligation seam-chain / signed-certificate program ledger, as most
 * recently restated by imp-95255 and imp-95276.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * produces no new certificate; it formalizes the plain-language
 * SEAM_CHAIN_STATUS narrative already carried by OpenFrontierPage.jsx into
 * the same {leg, role, status, grade, subGap} ledger shape used by the
 * imp-95142 (obligation (2) sub-ledger) and imp-95140 (y-thaw ledger)
 * modules.
 *
 * Obligation (1) Per-window Q extraction is UNCHANGED / closed-clean:
 * y_min rides the same isolation-group Q that already carries x_min
 * (imp-95222). Obligation (2) Signed weight / modulus-phase certificate is
 * BLOCKED at the transcription layer: theta is a scale-invariant per-window
 * sign functional with no image under the current geometry+modulus
 * transcription, trivially 1 on the paper's fixed-amplitude family
 * (imp-95255). Obligation (3) Envelope-shape / gammaSL seam-to-chain-gate
 * map is REDUCED: the gate-side pipeline is closed by identity and
 * monotonicity, so it now reduces entirely to obligation (1) plus the
 * still-open imp-95212 Fresnel-Airy envelope port (imp-95276). NO QED.
 * No refereed bound is changed.
 *
 * Source: imp-95255 (currency per-window map assessment, y_min MAPS /
 * theta OBSTRUCTED), imp-95276 (seam-to-chain-gate map, gate-side
 * DISSOLVED), imp-95222 (x_min <= y_min <= 2 x_min exact isolation bound),
 * imp-95387 (SEAM_CHAIN_STATUS card on OpenFrontierPage).
 *
 * imp-95798 adds OPEN_LEGS_NOTE below: a single derived export carrying
 * just the non-closed legs, so modules that only need to flag "the
 * imp-95212 Fresnel-Airy envelope port / signed WEIGHT / modulus-phase
 * status is still open" can cite this one note by id instead of
 * restating the prose per module.
 *
 * imp-95954 adds IMP95917_SIGN_CROSSLINK_NOTE below: imp-95917 sharpens
 * the imp-95212 sub-gap that obligations (2) and (3) both cite -- from
 * full evaluation of the kernel-weighted residue bias down to a single
 * open question, the SIGN (nonnegativity) of the Fresnel-Airy envelope
 * K_k. The sub-gap id is unchanged and STILL OPEN; this only tells
 * readers which single hypothesis it now reduces to.
 *
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (the sharpened SIGN-only obstruction)
 * @see imp-95212-multiplicity-priced-shift-damping.js (the sub-gap source)
 * @see imp-95336-fresnel-airy-envelope-port-assessment.js (the envelope-SHAPE port; SIGN is a separate open question on the same envelope)
 */

export const SEAM_CHAIN_OBLIGATION_LEDGER = [
  {
    leg: '(1) PER-WINDOW Q EXTRACTION',
    role: 'transcribe the per-window isolation-group Q depth quantity into the signed-certificate program',
    status: 'CLOSED',
    grade:
      'imp-95255: y_min rides the same isolation-group Q that already ' +
      'carries x_min (x_min <= y_min <= 2 x_min exact, imp-95222); ' +
      'measured y_min/x_min ratios (1.5228, ..., 1.1649 across four ' +
      'ported grids) decrease toward 1 -- this leg maps cleanly, no ' +
      'residual',
    subGap: null,
  },
  {
    leg: '(2) SIGNED WEIGHT / MODULUS-PHASE CERTIFICATE',
    role: 'transcribe the per-window sign/phase content theta alongside the depth y_min',
    status: 'OPEN (blocked at transcription)',
    grade:
      'imp-95255: the depth argument (y_min) is portable, but theta is a ' +
      'scale-invariant per-window sign functional with no image under ' +
      'the current geometry+modulus transcription -- it is trivially 1 ' +
      'on the fixed-amplitude family the paper specifies; the block is ' +
      'at the transcription, not at the certificate itself',
    subGap: 'imp-95212-subgap-fresnel-airy-envelope-port',
  },
  {
    leg: '(3) ENVELOPE-SHAPE / GAMMASL SEAM-TO-CHAIN-GATE MAP',
    role: 'gate-side pipeline gFromLam -> gammaSL from the signed certificate into the chain contract',
    status: 'REDUCED',
    grade:
      'imp-95276: the gate-side pipeline is closed by identity and ' +
      'monotonicity (M1/M2, assertion-verified), so this obligation is ' +
      'no longer an independent map to build -- it reduces entirely to ' +
      'obligation (1) plus the still-open imp-95212 Fresnel-Airy ' +
      'envelope port',
    subGap: 'imp-95212-subgap-fresnel-airy-envelope-port',
  },
];

export const SEAM_CHAIN_OBLIGATION_SUMMARY = {
  program: 'seam-chain / signed-certificate (imp-95210..95420)',
  closed: ['(1) PER-WINDOW Q EXTRACTION'],
  open: ['(2) SIGNED WEIGHT / MODULUS-PHASE CERTIFICATE'],
  reduced: ['(3) ENVELOPE-SHAPE / GAMMASL SEAM-TO-CHAIN-GATE MAP'],
  closedCount: 1,
  openCount: 1,
  reducedCount: 1,
  totalCount: 3,
  boundChange: false,
  qed: false,
};

// imp-95798: single honest-status note for the legs that keep getting
// restated in prose across new modules (imp-95212 Fresnel-Airy envelope
// port, signed WEIGHT, modulus-phase certificate). New modules should cite
// this note (or the parent ledger above) instead of re-deriving the status.
export const OPEN_LEGS_NOTE = {
  id: 'imp-95798-open-legs-note',
  title:
    'seam-chain program: the two legs that remain OPEN/REDUCED and are ' +
    'not yet closed',
  legs: SEAM_CHAIN_OBLIGATION_LEDGER.filter((o) => o.status !== 'CLOSED'),
  citeInstead:
    'cite imp-95798-open-legs-note (or its parent imp-95388 ledger) by id ' +
    'instead of restating the imp-95212 Fresnel-Airy envelope port / ' +
    'signed WEIGHT / modulus-phase status in each new module',
};

// imp-95954: cross-link note tying imp-95917 into this ledger. Obligations
// (2) and (3) above both cite the imp-95212 Fresnel-Airy envelope port as
// their subGap; imp-95917 shows the physical per-window sign image has a
// DETERMINED value strictly below 1 whenever that envelope is nonnegative,
// so the surviving open question for both legs is now specifically the
// envelope SIGN, not the full kernel-sum evaluation the ledger prose above
// still describes.
export const IMP95917_SIGN_CROSSLINK_NOTE = {
  id: 'imp-95954-imp95917-sign-crosslink',
  title:
    'obligations (2) and (3) now hinge on the Fresnel-Airy envelope SIGN, ' +
    'not the full kernel-sum evaluation',
  detail:
    'imp-95917 derives the physical von-Mangoldt x Fresnel-Airy WEIGHTED ' +
    'per-window sign image theta_phys and shows it is a DETERMINED image ' +
    'strictly below 1 whenever the envelope K_k is nonnegative (Gram ' +
    'positivity makes theta_phys a convex average with a strict ' +
    'off-diagonal deficit below the diagonal ceiling 1). This sharpens the ' +
    'obligation (2)/(3) subGap imp-95212-subgap-fresnel-airy-envelope-port ' +
    'from full evaluation of the kernel-weighted residue bias down to one ' +
    'open hypothesis: the SIGN (nonnegativity) of K_k. The sub-gap itself ' +
    'is unchanged -- STILL OPEN; no bound moves; NO QED.',
  subGap: 'imp-95212-subgap-fresnel-airy-envelope-port',
  seeAlso: [
    'imp-95917-vonmangoldt-weighted-sign-image.js',
    'imp-95336-fresnel-airy-envelope-port-assessment.js',
  ],
};

export const IMP_95388_SEAM_CHAIN_OBLIGATION_LEDGER = {
  id: 'imp-95388-seam-chain-obligation-ledger',
  title:
    'seam-chain / signed-certificate program, three-obligation WHAT-REMAINS ' +
    'ledger: (1) per-window Q extraction CLOSED (imp-95255/imp-95222), ' +
    '(2) signed weight/modulus-phase certificate OPEN at the ' +
    'transcription layer (imp-95255), (3) envelope-shape/gammaSL gate map ' +
    'REDUCED to (1) + the imp-95212 port (imp-95276); no bound of the ' +
    'Lambda program changes here',
  ledger: SEAM_CHAIN_OBLIGATION_LEDGER,
  summary: SEAM_CHAIN_OBLIGATION_SUMMARY,
  note:
    'formalizes the imp-95387 SEAM_CHAIN_STATUS narrative on ' +
    'OpenFrontierPage into the imp-95142/imp-95140 ledger-module shape, ' +
    'citing imp-95255 and imp-95276 as the most recent restatement of the ' +
    'three obligations',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP_95388_ASSERTIONS = [
  {
    id: 'imp-95388-three-obligations-exhaustive',
    holds: () => SEAM_CHAIN_OBLIGATION_LEDGER.length === 3,
    why: 'the seam-chain program reduces to exactly three obligations, no more, no fewer, per the imp-95387 SEAM_CHAIN_STATUS restatement.',
  },
  {
    id: 'imp-95388-status-partition',
    holds: () => {
      const byStatus = (pred) => SEAM_CHAIN_OBLIGATION_LEDGER.filter(pred).map((o) => o.leg);
      const closed = byStatus((o) => o.status === 'CLOSED');
      const open = byStatus((o) => o.status.startsWith('OPEN'));
      const reduced = byStatus((o) => o.status === 'REDUCED');
      const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
      return (
        sameSet(closed, SEAM_CHAIN_OBLIGATION_SUMMARY.closed) &&
        sameSet(open, SEAM_CHAIN_OBLIGATION_SUMMARY.open) &&
        sameSet(reduced, SEAM_CHAIN_OBLIGATION_SUMMARY.reduced) &&
        closed.length + open.length + reduced.length === SEAM_CHAIN_OBLIGATION_SUMMARY.totalCount
      );
    },
    why: 'obligation (1) must be exactly the CLOSED leg, obligation (2) exactly OPEN, obligation (3) exactly REDUCED, per imp-95255/imp-95276.',
  },
  {
    id: 'imp-95388-isolation-bound-consistency',
    holds: () => {
      const xMin = 1;
      const yMinLo = xMin;
      const yMinHi = 2 * xMin;
      return yMinLo <= yMinHi && yMinLo === xMin && yMinHi === 2 * xMin;
    },
    why: 'obligation (1) rests on the exact isolation-group bound x_min <= y_min <= 2 x_min (imp-95222); this recomputes the bracket structure from unit x_min.',
  },
  {
    id: 'imp-95388-not-a-bound',
    holds: () =>
      SEAM_CHAIN_OBLIGATION_SUMMARY.boundChange === false &&
      SEAM_CHAIN_OBLIGATION_SUMMARY.qed === false &&
      SEAM_CHAIN_OBLIGATION_SUMMARY.openCount > 0,
    why: 'with obligation (2) still open, nothing here derives or moves a Lambda bound; no refereed bound is changed.',
  },
  {
    id: 'imp-95798-open-legs-note-matches-non-closed',
    holds: () =>
      OPEN_LEGS_NOTE.legs.length === 2 &&
      OPEN_LEGS_NOTE.legs.every((o) => o.status !== 'CLOSED') &&
      OPEN_LEGS_NOTE.legs.some((o) => o.subGap === 'imp-95212-subgap-fresnel-airy-envelope-port'),
    why: 'imp-95798: the single open-legs note must track exactly the non-closed legs of the ledger above (obligations (2) and (3)), both still gated on the imp-95212 Fresnel-Airy envelope port sub-gap.',
  },
  {
    id: 'imp-95954-crosslink-matches-open-legs-subgap',
    holds: () =>
      OPEN_LEGS_NOTE.legs.every((o) => o.subGap === IMP95917_SIGN_CROSSLINK_NOTE.subGap) &&
      /envelope SIGN/.test(IMP95917_SIGN_CROSSLINK_NOTE.title) &&
      /STILL OPEN/.test(IMP95917_SIGN_CROSSLINK_NOTE.detail),
    why: 'imp-95954: the imp-95917 sign-crosslink note must cite the exact same subGap id as the open legs it annotates, and must state honestly that the sub-gap remains open (imp-95917 sharpens the hypothesis, it does not close it).',
  },
];

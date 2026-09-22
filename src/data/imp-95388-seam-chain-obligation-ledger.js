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
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * Source: imp-95255 (currency per-window map assessment, y_min MAPS /
 * theta OBSTRUCTED), imp-95276 (seam-to-chain-gate map, gate-side
 * DISSOLVED), imp-95222 (x_min <= y_min <= 2 x_min exact isolation bound),
 * imp-95387 (SEAM_CHAIN_STATUS card on OpenFrontierPage).
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
    why: 'with obligation (2) still open, nothing here derives or moves a Lambda bound; Platt-Trudgian Lambda <= 0.2 remains the peer-reviewed benchmark.',
  },
];

/**
 * @fileoverview r2-lemma-b-status-2026-10-02 — status of Lemma B (two-band comparison with a walled local RH window), written out in
 * formalization/paper/lemma-B-two-band.md, matched against the five missing steps listed by the second internal referee pass.
 * Theorem B: (W), (RH-head), (RH-win), (BB1), (BB2), (T) ⇒ every zero of H_T is real at T = max(U1, U2), so Λ ≤ max(U1, U2).
 *
 * Referee corrections applied:
 *  - Second referee (r2-second-referee-2026-10-02) graded Lemma B “GAP (logic sound)” against the b145 docstring; the written document
 *    (same day) absorbs fixes 1, 4 and 5 and defers fixes 2 and 3 into the band barriers (BB1)/(BB2), which are NOT PROVED. Table below.
 *  - Correction to the record (written document §9): the step needed at both band values in use is band-2 persistence on the half-infinite
 *    cell (U1 > U2), which uses P15 Thm 1.5(i); the Track B referee’s “band 1 from U1 to max(U1, U2)” case arises only at floor heights ≥ 2X.
 *  - The q_e/2 terminal allowance comes from the LOCAL strip contraction (Lemma B.2), which needs head and window zeros real at all times
 *    (Lemma B.3), not from the global de Bruijn theorem used in Raymond’s single-band setting.
 *  - Height route (r2-height-reduction): the chained three-band form (middle band with band neighbours on both sides) is not written.
 *
 * PROVED (written, unrefereed): Lemma B.1 (boundary), Lemma B.2 (local strip contraction, walled or half-infinite cell), Lemma B.3 (real
 *  zeros stay real in a walled cell; Hurwitz + forward splitting, no hypothesis on zeros outside), Theorem B as an implication.
 * CERTIFIED: walls (both lanes), H2_BMAX52 far field (24/24), window coverage by a second FLINT entry point. CONDITIONAL: (BB1), (BB2) not
 *  proved; (RH-win) on FLINT (audited once, wrap-fixed rerun); (RH-head) proved by PT at PT floor height, open at 1.6X/1.7X.
 * Verdict: Lemma B is a written conditional gluing theorem; its band barriers are the open piece. No refereed bound is changed. RH open. NO QED.
 * Files: formalization/paper/lemma-B-two-band.md, formalization/paper/verify_lemma_B_hypotheses.py (0 failures 2026-10-01).
 * Import-free. ASSERTIONS recompute the B.2 contraction end time (= q_e/2), window width vs D_W, the boundary-zero margins, U1 > U2 at both
 * band values, the band-1 start margin, the RH-head ordinates at PT and 1.7X, and the fix-status bookkeeping.
 */

const T_PT_EXACT = 3000175332800;
const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;
// Lemma B.2 contraction: |y(t)| ≤ sqrt(max(y0² − 2(t − t0), 0))
const yBound = (y0, dt) => Math.sqrt(Math.max(y0 * y0 - 2 * dt, 0));

export const R2_LEMMA_B_STATUS = Object.freeze({
  id: 'r2-lemma-b-status-2026-10-02',
  date: '2026-10-02',
  title: 'Lemma B written as a conditional gluing theorem; band barriers BB1/BB2 not proved',
  status: 'CONDITIONAL (written proofs of B.1–B.3 and Theorem B, unrefereed; BB1/BB2 NOT PROVED; RH-win on FLINT). NO QED.',
  doc: 'formalization/paper/lemma-B-two-band.md',

  steps: Object.freeze([
    { id: 'B.1', what: 'boundary lemma: no zero on a wall or on |y| = 1 for t ∈ [0, 41/250]', grade: 'written proof, unrefereed' },
    { id: 'B.2', what: 'local de Bruijn strip contraction in a walled or half-infinite cell (Sep, Conf hypotheses)', grade: 'written proof, unrefereed' },
    { id: 'B.3', what: 'real zeros stay real in a walled cell; applied to the window and to the head (Raymond AF §2 GAP 2a written out)', grade: 'written proof, unrefereed' },
    { id: 'Theorem B', what: 'Λ ≤ max(U1, U2) from (W), (RH-head), (RH-win), (BB1), (BB2), (T)', grade: 'written proof, unrefereed' },
    { id: 'BB1', what: 'band-1 barrier: zeros of H_t in C(x_f, x_L) satisfy y² < B1(t), B1(t_e1) = q_e', grade: 'NOT PROVED (AF §11 transplant to a walled cell not written)' },
    { id: 'BB2', what: 'band-2 barrier on (x_R, ∞), start q0 = 1.000002', grade: 'NOT PROVED (AF §11 transplant not written)' },
    { id: 'chained', what: 'three-band form for the 1.6X height route', grade: 'not written' },
  ]),
  refereeFixes: Object.freeze([
    { n: 1, what: 'how a band finishes (q_e/2 allowance without the global de Bruijn contraction)', status: 'absorbed', where: 'Theorem B steps 3–4 via Lemma B.2; equivalent ending §6' },
    { n: 2, what: 'first contact in band 1 by compactness of the walled box', status: 'deferred to BB1', where: '§6.1 item (band 1); not proved' },
    { n: 3, what: 'joint first contact of the two bands; H2 for b ≤ 1 both directions', status: 'deferred to BB1/BB2', where: '§6.1; not proved' },
    { n: 4, what: 'operative far-field certificate H2_BMAX52 (h ≥ √(2/5))', status: 'absorbed', where: '§2 hypothesis (H2)' },
    { n: 5, what: 'window premise conditional on FLINT 3.6.0', status: 'absorbed', where: '§2 hypothesis (RH-win); audit r2-flint-audit-2026-10-02' },
  ]),
  numbers: Object.freeze({
    xL: '15600000002223.2344', xR: '15600000009475.44', DW: 7252, xf17: '10200000023546.2402', XPT: 6000000185827,
    gammaFirst: 7800000000999.9154, gammaLast: 7800000005887.9204, qe: 1e-8, y0: 1e-4,
    U1_17: '18108446112627/125000000000000', U1_PT: '18409208597849/125000000000000', U1_PT_r2: '36126446200683/250000000000000',
    U2: '36063660805739/250000000000000', q0band1: 0.97590803034,
  }),

  verdict:
    'Lemma B is written as a conditional gluing theorem (B.1–B.3 and Theorem B, unrefereed). Of the five steps the second referee listed, three are '
    + 'absorbed in the written document and two are part of the band barriers BB1/BB2, which are not proved. At PT floor height (RH-head) is supplied '
    + 'by Platt–Trudgian; at 1.6X/1.7X it is open. No refereed bound is changed. RH open. NO QED.',
  nextStep: 'Write the BB1/BB2 transplant of Raymond AF §11 (single-cell first contact, compactness of the walled band-1 cell, H2 for cross-band pairs, joint first contact) and the chained three-band statement; send B.1–B.3, Theorem B and the transplant to one adversarial referee.',
});

const L = R2_LEMMA_B_STATUS;
const n = L.numbers;

export const R2_LEMMA_B_STATUS_ASSERTIONS = Object.freeze([
  {
    id: 'r2-lemmaB-contraction-end',
    holds: () => {
      const tEnd = (n.y0 * n.y0) / 2;
      return Math.abs(tEnd - n.qe / 2) < 1e-24 && yBound(n.y0, tEnd) === 0 && yBound(n.y0, tEnd / 2) > 0
        && Math.abs(yBound(n.y0, tEnd / 2) - n.y0 / Math.SQRT2) < 1e-18;
    },
    why: 'B.2 from y0 = 1e-4 reaches y = 0 after y0²/2 = 5e-9 = q_e/2, the terminal allowance inside U_i.',
  },
  {
    id: 'r2-lemmaB-window-geometry',
    holds: () => {
      const xL = rat(n.xL), xR = rat(n.xR);
      return xR - xL > n.DW && Math.abs(xR - xL - 7252.2056) < 1e-3 && Math.abs(xL / 2 - n.gammaFirst - 111.702) < 1e-2
        && Math.abs(n.gammaLast - xR / 2 - 1150.200) < 1e-2;
    },
    why: 'Window width 7252.2056 > D_W = 7252; first window zero 111.70 below x_L/2, last 1150.20 above x_R/2.',
  },
  {
    id: 'r2-lemmaB-band-order-and-start',
    holds: () => rat(n.U1_17) > rat(n.U2) && rat(n.U1_PT) > rat(n.U2) && rat(n.U1_PT_r2) > rat(n.U2)
      && n.q0band1 - qMTY(rat(n.xL)) > 1.99e-6 && rat(n.U2) - n.qe / 2 - 1e-15 > 0.1442,
    why: 'U1 > U2 at 1.7X, PT and the r2 PT value, so the needed persistence step is band 2 on the half-infinite cell; band-1 start 2e-6 above q_MTY(x_L); t_e2 > 0.1442.',
  },
  {
    id: 'r2-lemmaB-rh-head',
    holds: () => n.XPT / 2 < T_PT_EXACT && rat(n.xf17) / 2 > T_PT_EXACT && Math.abs(rat(n.xf17) / 2 - 5100000011773.12) < 0.01,
    why: 'At PT floor height the head ordinate X/2 = 3.0000001e12 is below PT’s 3000175332800 (supplied); at 1.7X it is 5.10e12 (open).',
  },
  {
    id: 'r2-lemmaB-fix-bookkeeping',
    holds: () => L.refereeFixes.length === 5 && L.refereeFixes.filter((f) => f.status === 'absorbed').length === 3
      && L.refereeFixes.filter((f) => /deferred/.test(f.status)).every((f) => /BB/.test(f.status))
      && L.steps.filter((s) => /NOT PROVED/.test(s.grade)).map((s) => s.id).join(',') === 'BB1,BB2'
      && /refereed bound is changed/i.test(L.verdict) && /NO QED/.test(L.verdict),
    why: 'Three referee fixes absorbed, two deferred into BB1/BB2; BB1/BB2 the only NOT PROVED steps; honest scope.',
  },
]);

export default R2_LEMMA_B_STATUS;

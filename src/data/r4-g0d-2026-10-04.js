/**
 * @fileoverview r4-g0d-2026-10-04 — G0-d: independent re-derivation of Raymond's AF Part I §§6–9 (the one-point input OP) and
 * recomputation of every producer input the consumers read. Write-up formalization/paper/raymond-af-6-9-independent.md. One adversarial
 * internal referee pass (tmp/r4-ref-g0d-*): not refuted, minor.
 *
 * Re-derived (no ERROR): identity (6.1) and the cone lemma; head nonnegativity (= Lemma CG); (6.3) closed forms and the reflected masses
 *  A_V, B_V; Q_y = −V/2; the exceptional set (head pairs m < n, m, n ∉ {2,3,5}, mn ≤ ⌊e^{2C}⌋); §7 κ ∈ [−K_L, 0], the A0'' cap, (7.1),
 *  L-monotonicity (h·v0 > 2), block enclosures; (8.1)–(8.3) including the infinite interval and the e^{1e-5} absorption (budget ≤ 1.4472e-6);
 *  (8.4) with l1 norms; (8.5), (9.1), the E_ℓ cap at (t_L, L_lo), (9.2) and its consumed form. 8 expository GAPs g1–g8, each with a fix.
 *
 * Referee corrections applied:
 *  - Coverage: G0-d recomputed 2 of the 11 one-point producer families the PT-height values read (PLAN rows at X and 2.6X). The referee
 *    recomputed the other nine (PROBE_kap_0_94, PROBE_kap_0_88, X1_P0_97, X1_K21_10/K12_5/K11_4/K31_10, XW26_P0_97, XW26_P0_94) in full:
 *    0 failures in every consumer-read field. Total 1,327,776 referee comparisons (+ 252,320 at X and 252,320 at 2.6X by G0-d).
 *  - Archive note: PROBE_kap_0_88 has 2,847 rows with C = 17/5 and cone_margin_lower = 0 (cone not closed), including cells 517 and 555 on
 *    the certified route-P path; their density_lower is NOT a valid one-point floor. No consumer reads it (r2 reads only A+, B+, E_n, E_y,
 *    E_ℓ, pert; b145-B-lib.validate_cells rejects such rows).
 *  - Consumers read the reassembled validate() floor (extra −1e-7, rounded down to 1e-12), ~9e-8 below density_lower (safe direction);
 *    the own-minimal-C floor table is information, not a validity margin. Assembled relative radius up to 1.2e-21 (raw sums ~1e-23).
 *
 * PROVED (written, one internal referee pass): AF Part I §§6–9 as re-derived. CERTIFIED: all 11 one-point producer families, two engines
 * (different algorithms, both arb/FLINT; mpmath on 4 packs). CONDITIONAL on AF §§4–5 (internal SOUND grade). Missing: non-project reader.
 * Import-free. ASSERTIONS recompute the comparison totals, the ε budget, the exceptional-pair bound and the family list.
 */

export const R4_G0D = Object.freeze({
  id: 'r4-g0d-2026-10-04',
  date: '2026-10-04',
  title: 'G0-d: AF Part I §§6–9 re-derived (no ERROR, 8 expository GAPs); all 11 one-point producer families recomputed, 0 failures',
  status: 'G0-d CLOSED internally: written part proved + one internal adversarial referee pass; numerics certified for every family read by P-cert, P-cond, b145. Non-project reader missing. No Λ value moves. NO QED.',
  doc: 'formalization/paper/raymond-af-6-9-independent.md',
  gaps: Object.freeze(['g1 reflected masses written out', 'g2 first-branch block monotonicity', 'g3 (8.4) l1 norms', 'g4 evaluation point of E_ℓ, E_n, E_y',
    'g5 stronger lane per rectangle', 'g6 e^{1e-5} budget displayed', 'g7 head nonnegativity proof', 'g8 inputs come from the producer, not reconstructed']),
  families: Object.freeze({
    byG0d: { PLAN_X: 252320, PLAN_2p6X: 252320 },
    byReferee: { PLAN_X: 317376, kap094: 169632, kap088_consumerRead: 140448, X1_P0_97: 153924, K21_10: 82719, K12_5: 55449, K11_4: 38481, K31_10: 18786, XW26_P0_97: 153924, XW26_P0_94: 138774, PLAN_2p6X_spot: 23028, interior: 14592 },
    kap088Total: 161091, kap088Flagged: 2847,
  }),
  refereeTotal: 1327776,
  domain: Object.freeze({ epsBudgetX: 1.4472e-6, epsBudget2p6X: 8.98e-7, epsAllowed: 1e-5, sX: 4.4812e-7, s2p6X: 1.3801e-7, minHv0: 8.164, minK: 0.458, Crange: [0.5093, 1.4153], maxExceptionalTerms: 12 }),
  floorMargin: Object.freeze({ storedField: [7.176e-6, 1.205e-5], consumerRead: [7.266e-6, 1.214e-5], coneMarginMin: 1.743e-4 }),
  verdict: 'G0-d: AF Part I §§6–9 SOUND (no ERROR, 8 expository GAPs with fixes), proved as written with one internal referee pass; every one-point '
    + 'producer field read by the three PT-height values certified by independent code. PROBE_kap_0_88 C = 17/5 rows carry no valid floor (unread). '
    + 'No Λ value moves. No refereed bound is changed. RH open. NO QED.',
});

const G = R4_G0D;
export const R4_G0D_ASSERTIONS = Object.freeze([
  {
    id: 'r4-g0d-referee-total',
    holds: () => {
      const r = G.families.byReferee;
      const sum = r.PLAN_X + r.kap094 + G.families.kap088Total + r.X1_P0_97 + r.K21_10 + r.K12_5 + r.K11_4 + r.K31_10 + r.XW26_P0_97 + r.XW26_P0_94 + r.PLAN_2p6X_spot + r.interior;
      return sum === G.refereeTotal && r.kap088_consumerRead + G.families.kap088Flagged <= G.families.kap088Total;
    },
    why: 'Referee comparison counts add to 1,327,776; the 2,847 flagged kap_0_88 rows are outside the consumer-read comparisons.',
  },
  {
    id: 'r4-g0d-eleven-families',
    holds: () => { const k = Object.keys(G.families.byReferee).filter((x) => !/spot|interior|PLAN/.test(x)); return k.length === 9 && 9 + Object.keys(G.families.byG0d).length === 11; },
    why: '2 PLAN families (G0-d) + 9 off-PLAN families (referee) = the 11 one-point families read at PT height.',
  },
  {
    id: 'r4-g0d-domain-live',
    holds: () => {
      const d = G.domain;
      const exc = Math.floor(Math.exp(2 * d.Crange[1]));
      return d.epsBudgetX < d.epsAllowed && d.epsBudget2p6X < d.epsAllowed && d.sX > 0 && d.s2p6X > 0 && d.minHv0 > 2 && d.minK > 0 && exc <= 16 && exc < 2 * 3 * 5 && Math.exp(6.8) < 1024;
    },
    why: 'ε budget < 1e-5, s(X−2) > 0, h·v0 > 2 (L-monotonicity), k > 0, ⌊e^{2C}⌋ ≤ 16 (only (1, n) exceptional pairs), e^{6.8} < 1024.',
  },
  {
    id: 'r4-g0d-floor-margins',
    holds: () => { const f = G.floorMargin; return f.storedField[0] > 0 && f.consumerRead[0] > f.storedField[0] && f.coneMarginMin > 0 && G.gaps.length === 8; },
    why: 'Recomputed floors exceed both the stored field and the (lower) floor the consumers read; cone margin positive; 8 GAPs listed.',
  },
  { id: 'r4-g0d-honest', holds: () => /NO QED/.test(G.status) && /No Λ value moves/.test(G.verdict) && /Non-project reader missing/.test(G.status), why: 'Internal closure only; no Λ change.' },
]);

export default R4_G0D;

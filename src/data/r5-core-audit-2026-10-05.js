/**
 * @fileoverview r5-core-audit-2026-10-05 — line-by-line audit of r3core4.c (+ r4core_t.c), the engine behind 149 r4 certified-path floors.
 * One adversarial internal referee pass (tmp/r5-ref-core-audit-*): REFUTED (fatal) in its conclusion.
 *
 * Audit (claimant): one soundness gap F1 — beta is a Taylor-model product of two UPPER-bound Taylor models (tm_mul with complex eta
 *  coefficients left by tm_realify), not a valid upper bound (counterexample 5.648 < 5.831); fix env_mul(A_I, A_B). 145 of 149 floors
 *  affected (all with eta primes); 50 certificates re-certified leaf by leaf with the fixed engine; claimed value 0.146816844000245.
 *
 * Referee (fatal): a second gap F3 in the Python mapping from engine output to leaf bounds. Engine.__init__ (tmp/r3-outer-lib4.py) and
 *  EngineT/EngineA (tmp/r4-woladapt-lib.py) read the pair table r3_pair() BEFORE r3_setup() runs init_pairs(); in a fresh process the
 *  table is [(0,0)]·NZZ and finalize() drops every off-diagonal second-order eta coefficient. No leaf bound with NH ≥ 2 is proved.
 *  Affects all 145 NL=2 r4 floors, the 6 off-path and all 50 'corrected' re-certificates. Size: true-table finalisation raises recorded
 *  leaf values by 1.5e-7–2.66e-3 (median 7.7e-4); a gap in rigour, not a demonstrated wrong bound (coordinate search of the majorant on
 *  121's top leaf: max excess −0.0010 < stale 0.0040). The S = {2,3,5} floors (NH = 0) stand: 9254/9254 leaves re-evaluated bit-exact.
 *  The wol-pd floors (separate code) are unaffected. The audit's no-NL2 reproduction command produces a different file (0.146952187680282);
 *  the reported 0.146827593305006 comes from an unrecorded later step (matches its description).
 *
 * PROVED/CONFIRMED: F1 real, fix correct; tm_mul / build_em / truncation tier re-derived. NOT CERTIFIED: every r3core4.c floor with NH ≥ 1
 * (r4 'ad', 'adref', NL=2 'r3' sources) and the audit's 50 corrected margins. CERTIFIED: 4 S235 floors; second wol-pd implementation
 * (75 floors, outward-rounded, block-local suffix sums; referee-confirmed). Referee F1+F3-corrected re-certificates of 8 floors exist
 * (referee code, unrefereed). Import-free. ASSERTIONS recompute the value ordering, the scope counts and the decimals.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };

export const R5_CORE_AUDIT = Object.freeze({
  id: 'r5-core-audit-2026-10-05',
  date: '2026-10-05',
  title: 'r3core4.c audit: F1 found and fixed; referee finds F3 (stale pair table) — no NL=2 r3core4.c floor is certified',
  status: 'REFUTED (fatal) by the internal referee: the audit missed F3; r4 P-cert 0.146808080767225 and the audit value 0.146816844000245 are NOT certified. NO QED.',
  gaps: Object.freeze({
    F1: { where: 'r3core4.c beta = tm_mul(IOTA, BT) of two upper-bound TMs', counterexample: [5.648, 5.831], fixed: 'env_mul(A_I, A_B)', confirmedByReferee: true },
    F3: { where: 'tmp/r3-outer-lib4.py / tmp/r4-woladapt-lib.py: r3_pair() read before init_pairs()', foundBy: 'referee', leafShift: [1.5e-7, 2.66e-3], median: 7.7e-4, demonstratedWrongBound: false },
  }),
  scope: Object.freeze({ r4CertPathR3core4: 149, nh0: 4, affectedF1F3: 145, auditRecerts: 50, auditRecertsValid: 0, s235LeavesBitExact: 9254, refereeRecertsF1F3: 8 }),
  wpd2: Object.freeze({ pathFloorsReproduced: 41, setBWolC: 34, reproducedTotal: 75, marginBelowOriginal: [5.8e-10, 1.11e-9], refereeSample: 22 }),
  values: Object.freeze({
    r4PcertNotCertified: { exact: '5872323230689/40000000000000', dec: '0.146808080767225', note: 'r4 P-cert: fails on F1 and F3' },
    auditClaim: { exact: '29363368800049/200000000000000', dec: '0.146816844000245', note: 'audit: fails on F3 (NOT certified)' },
    refereeB: { exact: '29365248320989/200000000000000', dec: '0.146826241604945', note: 'referee: wol-pd + S235 + 8 referee F1+F3 re-certificates (referee code unrefereed); on r4 sources only' },
    noNL2: { exact: '73413796652503/500000000000000', dec: '0.146827593305006', note: 'wol-pd + S235 only (no r3core4.c floor with eta primes); E6-altlog flag, robust +1e-15' },
    hybridRef: { exact: '72399668122583/500000000000000', dec: '0.144799336245166', note: 'CONDITIONAL on WOL-C for 380 floors; NOT PROVED' },
  }),
  verdict: 'REFUTED (fatal): the line-by-line audit found F1 (beta product of two upper-bound Taylor models) and a correct fix, but missed F3 '
    + '(the leaf-bound mapping reads a stale all-(0,0) pair table in every fresh process), so no r3core4.c floor with eta primes is certified: '
    + 'not the 145 r4 floors and not the audit\'s 50 corrected re-certificates. The 4 S={2,3,5} floors stand (bit-exact over 9254 leaves). '
    + 'r4 P-cert 0.146808080767225 and the audit value 0.146816844000245 are NOT certified. No refereed bound is changed. RH open. NO QED.',
});

const W = R5_CORE_AUDIT;
export const R5_CORE_AUDIT_ASSERTIONS = Object.freeze([
  {
    id: 'r5-core-scope',
    holds: () => W.scope.nh0 + W.scope.affectedF1F3 === W.scope.r4CertPathR3core4 && W.scope.auditRecertsValid === 0 && W.gaps.F1.counterexample[0] < W.gaps.F1.counterexample[1]
      && W.gaps.F3.foundBy === 'referee' && W.gaps.F3.demonstratedWrongBound === false && W.wpd2.pathFloorsReproduced + W.wpd2.setBWolC === W.wpd2.reproducedTotal,
    why: '149 = 4 (NH = 0) + 145 affected; none of the 50 audit re-certificates is valid after F3; F3 is a rigour gap, not a demonstrated wrong bound.',
  },
  {
    id: 'r5-core-values',
    holds: () => Object.values(W.values).every((v) => { const n = exact15(v.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(v.dec)) < 1e-16; })
      && lt(W.values.r4PcertNotCertified.exact, W.values.auditClaim.exact) && lt(W.values.auditClaim.exact, W.values.refereeB.exact)
      && lt(W.values.refereeB.exact, W.values.noNL2.exact) && lt(W.values.hybridRef.exact, '145/1000'),
    why: 'Each correction raises the certified value: r4 < audit < referee (8 re-certificates) < no NL=2 floor; the hybrid stays conditional.',
  },
  {
    id: 'r5-core-honest',
    holds: () => /REFUTED/.test(W.status) && /NOT certified/.test(W.verdict) && /refereed bound is changed/i.test(W.verdict) && /NO QED/.test(W.verdict),
    why: 'The audit conclusion is refuted; the r3core4.c NL=2 floors are not certified; no QED.',
  },
]);

export default R5_CORE_AUDIT;

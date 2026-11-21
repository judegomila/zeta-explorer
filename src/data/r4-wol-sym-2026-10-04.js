/**
 * @fileoverview r4-wol-sym-2026-10-04 — WOL-C angle 2: block reduction of the first branch of Φ onto per-prime one-dimensional checks via
 * the exact Dirichlet-log Fourier form. One adversarial internal referee pass (tmp/r4-ref-wol-sym-*): REFUTED (major) in its reach claims.
 *
 * Lemmas (re-derived by the referee, correct): Lemma A (K0, X_j, W_j and log|c_1| have exact Fourier forms; W_j coefficients are
 *  [z^m](c_j/c_1), not L_n; Φ itself has no exact Fourier expansion), Lemma B (B1, B2 coherent pinning), Lemma C (majorisation onto primes),
 *  Theorem PB (per-prime reduction of the first branch), Lemma D (reflected denominators), Hessian formula at θ = 0, separable-majorant Remark.
 *
 * Referee corrections applied:
 *  - MAJOR: the float survey omitted the truncation-tail term 2(T_K + Σ_j T_j) that Theorem PB requires. At MCUT = N0, (t_lo, a_mid),
 *    β0 = 0, over the 205 P ≥ 13 entries in cells ≤ 262: 108 exceed 0.0223 on the tail term alone (P19 0.0215–0.036, P23 0.034–0.063,
 *    P47 c232–262 0.166–0.252). The headline reach ('inside 0.0223 for P13–P23 and P47 up to cell ~274') is refuted for the method as
 *    implemented; only P13/P17 (96 entries) are not excluded. True K0 tail at P47 c262 ≈ 3.4e-4, ~60× below the majorant T_K = 0.0206.
 *  - Float survey not converged in MCUT (P47 c262: 0.0130 at 3000 → 0.0181 at 20000).
 *  - Measured-number corrections: non-additive interaction up to +0.0253 (not 0.0115); whole-cell E1 = 0.2796 is an upper bound at MCUT
 *    6000 only; the P47 c500 'exact-coefficient Hessian' is MCUT-truncated with top eigenvalue +0.0667 (wrong sign vs the r2 second
 *    difference −0.062 along the same v).
 *  - Pilot reproduced at 192 bits: E1 = 1.448816e-2 (original 1.450074e-2 stands as a looser bound); (H0) d = 0.02277 confirmed.
 *  - E1–E8 on the conditional paths: 262-none and 262+S235 carry one E6-altlog flag (2.5e-16 / 2.3e-16; Leibniz bound holds); 274-none and
 *    300+S235 clean. Reachable variant (P ≤ 17 floors in cells ≤ 262): 0.146859192198741, still conditional.
 *
 * CERTIFIED: only the first-branch pilot at ONE (t, a) point of ONE entry (P13 cell 141) — not WOL-C for any entry. No admission shift.
 * CONDITIONAL: the consumer values below (WOL-C assumed on the listed floors). Import-free. ASSERTIONS recompute the tail-term excess count
 * consistency, the pilot sum, the rational→decimal values and that no conditional value is below 0.145.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

export const R4_WOL_SYM = Object.freeze({
  id: 'r4-wol-sym-2026-10-04',
  date: '2026-10-04',
  title: 'WOL-C angle 2 (per-prime block reduction): lemmas correct; reach claim refuted by the omitted tail term; no WOL-C certificate',
  status: 'NOT PROVED; REFUTED (major) in its reach: 108 of 205 P ≥ 13 entries in cells ≤ 262 exceed 0.0223 on the majorant tail term alone. Contributes no certified margin. NO QED.',
  pilot: Object.freeze({ entry: '141|1|sharp (P13)', perPrime: 4.806e-4, TK: 2.402e-4, sumTj: 6.770e-3, E1: 1.450074e-2, E1ref: 1.448816e-2, d: 0.02277, scope: 'first branch Φ1, β frozen, one (t, a) point' }),
  tailCheck: Object.freeze({ n: 205, over0223: 108, over0245: 103, notExcluded: 96, p47c262: { d: 0.0956, TK: 0.02055, sumTj: 0.1021, tail: 0.2454, trueTailK0: 3.45e-4 } }),
  conditionalValues: Object.freeze({
    cells262: '146769333764033/1000000000000000',
    cells274: '36672974471137/250000000000000',
    cells262S235: '145595666820823/1000000000000000',
    cells300S235: '29099726966841/200000000000000',
    reachP17c262: '146859192198741/1000000000000000',
    reachP17c262S235: '145689018554233/1000000000000000',
  }),
  verdict: 'NOT PROVED. The per-prime reduction (Lemmas A–D, Theorem PB) is correct, but the implemented majorant tail term alone exceeds the '
    + '0.0223 margin for 108 of the 205 P ≥ 13 entries it was projected to reach; the only certified object is a first-branch bound at one point. '
    + 'This angle contributes no WOL-C certificate to the synthesis. No refereed bound is changed. RH open. NO QED.',
});

const S = R4_WOL_SYM;
export const R4_WOL_SYM_ASSERTIONS = Object.freeze([
  {
    id: 'r4-wolsym-pilot-sum',
    holds: () => { const p = S.pilot; const e = p.perPrime + 2 * (p.TK + p.sumTj); return Math.abs(e - p.E1) < 2e-6 && p.E1ref <= p.E1 && p.d < 1; },
    why: 'E1 = per-prime sum + 2(T_K + ΣT_j) at the pilot point; the referee rerun is tighter; (H0) via d < 1.',
  },
  {
    id: 'r4-wolsym-tail-refutation',
    holds: () => {
      const t = S.tailCheck, q = t.p47c262;
      return t.over0223 > t.n / 2 && t.over0245 <= t.over0223 && Math.abs(2 * (q.TK + q.sumTj) - q.tail) < 1e-3 && q.tail > 0.0223 && q.TK / q.trueTailK0 > 50;
    },
    why: 'The majorant tail 2(T_K + ΣT_j) at P47 c262 is 0.245 ≫ 0.0223, while the true K0 tail is ~60× below T_K: the obstruction is the majorant, not Φ.',
  },
  {
    id: 'r4-wolsym-conditional-not-sub0145',
    holds: () => Object.values(S.conditionalValues).every((v) => exact15(v) !== null && lt('145/1000', v)),
    why: 'Every conditional consumer value of this angle is above 0.145.',
  },
  { id: 'r4-wolsym-honest', holds: () => /NOT PROVED/.test(S.status) && /REFUTED/.test(S.status) && /NO QED/.test(S.verdict) && /refereed bound is changed/i.test(S.verdict), why: 'No certificate, no QED.' },
]);

export default R4_WOL_SYM;

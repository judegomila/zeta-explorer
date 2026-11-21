/**
 * @fileoverview imp-96875 -- SCOUT (numerical): can the Route C Kato-Temple lower bound
 *   lambda_1 >= mu - ||T g - mu g||^2 / (beta - mu),   beta <= lambda_2,  mu < beta,
 * deliver a POSITIVE uniform floor on lambda_1(T_a[sigma_2]) at 2a=ln3 -- even IN PRINCIPLE,
 * i.e. GRANTING a provisional (uncertified) Ritz estimate of lambda_2 as the seed beta ? This is
 * a pre-certification feasibility measurement for the imp-96846 Route C sub-gap. It is the
 * COMPLEMENT of imp-96865: imp-96865 shows the exogenous CERTIFIED seed is unreachable (Loewner /
 * Weyl force beta < 0, so KT2 mu < beta fails); this module instead GRANTS the honest measured
 * seed (the Ritz lambda_2, provisionally used as beta) and asks whether the RESIDUAL leg then
 * permits a positive floor. It does not. NO operator positivity established; NO QED.
 *
 * METHOD (reuses the imp-96768 pole-free Gegenbauer Galerkin build, tmp/imp-96875-katotemple-scout.py).
 * T_a[sigma_2] on L^2(-a,a), sigma_2 = (t^2+1/4)^2 w_1, w_1 = 2 theta-prime - sqrt2 ln2 cos(t ln2),
 * pole-free trial space span{ (a^2-x^2)^m poly_n(x/a) }, m=3, in the exactly-diagonal Gegenbauer
 * basis (L^2 Gram B = scaleB * I, condB=1). For each N:
 *   mu     = smallest Ritz value (the measured trial floor; an UPPER bound on lambda_1),
 *   g      = its Ritz eigenvector (the trial),
 *   beta_N = second-smallest Ritz value at dimension N (a PROVISIONAL lambda_2 estimate),
 *   beta_big = second Ritz value in a 2N-dim space (a sharper provisional lambda_2),
 * and the Kato-Temple residual is the OUT-OF-SPACE operator defect measured in a nested 2N-dim
 * evaluation space: g embeds by zero-padding (nested orthonormal basis), and
 *   ||T g - mu g||_B^2 = | A_tail v |^2 / scaleB^2,   A_tail = A_big[N:2N, :N],
 * since the in-space Galerkin residual A_N v - mu scaleB v vanishes identically.
 *
 * RESULT 1 -- the provisional SEED is fine. The true lambda_2 of this order-4 operator is LARGE and
 * positive: the Ritz estimate is beta_N ~ 99..111 (beta_big ~ 84..101), vastly above mu ~ 0.58..0.63.
 * So KT2 (mu < beta) is comfortably CLEARED by the honest/provisional seed -- the beta-seed is NOT
 * the binding obstruction once one uses the measured Ritz lambda_2 rather than an exogenous certified
 * bound. (imp-96865 concerns CERTIFIABILITY of beta, not its true value.)
 *
 * RESULT 2 -- the RESIDUAL leg diverges, and it is BINDING. The out-of-space defect ||T g - mu g|| is
 * O(1e4) and GROWS without bound as the evaluation space grows: at fixed N=20 it climbs
 * 1.65e3 -> 4.60e3 -> 9.59e3 -> 1.62e4 -> 1.99e4 -> 2.60e4 as Nbig = 24,30,40,60,80,120. This is the
 * unmistakable signature of an UNBOUNDED operator: the m=3 pole-free trial g lies in the FORM domain
 * (int sigma_2 |ghat|^2 < inf) but NOT the OPERATOR domain -- ghat decays like t^{-(m+1)}=t^{-4}, so
 * int sigma_2^2 |ghat|^2 ~ int (t^4 ln t)^2 t^{-8} dt = int (ln t)^2 dt DIVERGES, i.e. T g is not even
 * in L^2. Hence ||T g - mu g||^2 is effectively infinite for the true operator, and the measured
 * residual^2 (9.2e7 at N=20 up to 3.9e9 at N=44) divided by the O(1e2) gap swamps mu ~ O(1):
 *   KT floor = mu - residual^2/(beta - mu) ~ -8.3e5 (N=20) .. -4.0e7 (N=44),   MASSIVELY NEGATIVE.
 *
 * VERDICT. Even granting a positive provisional Ritz seed beta ~ 1e2 (KT2 satisfied), the DIRECT
 * Kato-Temple estimate returns a floor of order -1e6, and the negativity WORSENS with N because the
 * residual grows (unbounded operator). So the route CANNOT in principle deliver a positive floor in
 * its direct form -- the binding obstruction is the RESIDUAL (operator-domain) leg, distinct from and
 * complementary to the beta-seed sign obstruction of imp-96865. A viable Kato-Temple / Lehmann-Goerisch
 * attack would have to be run on a BOUNDED reformulation (shift-invert / resolvent (T+m)^{-1}), where
 * the residual is controllable -- which collapses onto Route B open resolvent-truncation-rate envelope
 * (imp-96846 Obstruction B, imp-96827 / imp-96847 / imp-96848). SUB-GAP IMP96875_KT_RESIDUAL_DIVERGES:
 * the direct Kato-Temple residual ||T g - mu g|| diverges for the unbounded T_a[sigma_2] on m=3
 * pole-free trials (form-domain, not operator-domain), so the direct route yields a floor ~ -1e6 even
 * with a positive provisional seed; a positive floor requires a bounded (resolvent / shift-invert)
 * reformulation, i.e. Route C-direct and Route B share the same unbounded-operator wall. Scouting /
 * measurement only; provisional beta is NOT a certified lower bound (Ritz gives UPPER bounds);
 * interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96846-krein-uniform-N-lower-bound-routes-assessment.js (Route C most tractable; SUB-GAP IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND)
 * @see imp-96865-krein-katotemple-lambda2-lowerbound-obstruction.js (CERTIFIED beta seed obstructed: Loewner/Weyl force beta<0; complementary to this residual scout)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here; N=36 floor 0.588067 at 2a=ln3)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open resolvent-truncation (N,T) rate the bounded reformulation reduces to)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96875_RIGOROUS_REACH_2A = 0.96;

// measured Kato-Temple scout at 2a=ln3 (tmp/imp-96875-katotemple-scout.py; well-conditioned
// Gegenbauer basis, out-of-space residual in a nested 2N-dim evaluation space). floor_* NEGATIVE.
export const IMP96875_SCOUT = Object.freeze([
  Object.freeze({ N: 20, Nbig: 40, mu: 0.625397, betaN: 110.734672, betaBig: 100.705287, residual2: 9.1939e7, floorBetaN: -834980.47, floorBetaBig: -918657.10 }),
  Object.freeze({ N: 28, Nbig: 56, mu: 0.598141, betaN: 104.284155, betaBig: 95.992702, residual2: 7.9601e8, floorBetaN: -7677116.9, floorBetaBig: -8344392.5 }),
  Object.freeze({ N: 36, Nbig: 72, mu: 0.588067, betaN: 101.641337, betaBig: 90.878249, residual2: 2.4920e9, floorBetaN: -24660459.1, floorBetaBig: -27600121.9 }),
  Object.freeze({ N: 44, Nbig: 88, mu: 0.583422, betaN: 99.527635, betaBig: 84.242085, residual2: 3.9144e9, floorBetaN: -39561536.5, floorBetaBig: -46789955.2 }),
]);

// residual GROWS with the evaluation space at fixed N=20 (unbounded-operator signature): the trial
// g is in the FORM domain but not the OPERATOR domain, so ||T g - mu g|| diverges with Nbig.
export const IMP96875_RESIDUAL_GROWTH_N20 = Object.freeze([
  Object.freeze({ Nbig: 24, residual: 1.6464e3 }),
  Object.freeze({ Nbig: 30, residual: 4.6009e3 }),
  Object.freeze({ Nbig: 40, residual: 9.5885e3 }),
  Object.freeze({ Nbig: 60, residual: 1.6248e4 }),
  Object.freeze({ Nbig: 80, residual: 1.9930e4 }),
  Object.freeze({ Nbig: 120, residual: 2.6036e4 }),
]);

export const IMP96875_VERDICT = Object.freeze({
  ticket: 'imp-96875',
  question: 'can the DIRECT Kato-Temple estimate deliver a positive floor on lambda_1(T_a[sigma_2]) at 2a=ln3 even when GRANTED a provisional Ritz lambda_2 as the seed beta ?',
  // the provisional seed is fine -- true lambda_2 is large positive, KT2 mu<beta is cleared
  provisionalBetaClearsKT2: true,          // beta_N ~ 1e2 >> mu ~ 0.6
  seedIsBindingObstruction: false,         // unlike imp-96865 (which is about CERTIFIABILITY of beta)
  // but the residual leg diverges and is binding
  residualDivergesWithEvalSpace: true,     // 1.65e3 -> 2.60e4 at fixed N=20 as Nbig 24->120
  trialInFormDomainNotOperatorDomain: true,// ghat~t^{-4} => int sigma_2^2 |ghat|^2 ~ int (ln t)^2 = inf
  provisionalFloorIsPositive: false,       // KT floor ~ -1e6, worsening with N
  reachableFloorSignDirectKatoTemple: 'negative',
  bindingObstruction: 'residual (operator-domain) leg, not the beta seed',
  needsBoundedReformulation: true,         // shift-invert / resolvent (T+m)^{-1}; -> Route B open (N,T) rate
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96875_KT_RESIDUAL_DIVERGES -- the DIRECT Kato-Temple residual ||T g - mu g|| diverges for the unbounded T_a[sigma_2] on m=3 pole-free trials (form-domain, not operator-domain: ghat~t^{-4} so int sigma_2^2 |ghat|^2 ~ int (ln t)^2 dt = inf), giving a floor ~ -1e6 that WORSENS with N even when a positive provisional Ritz seed beta ~ 1e2 clears KT2; the binding obstruction is the residual leg, complementary to the beta-seed sign obstruction of imp-96865; a positive floor needs a BOUNDED (shift-invert / resolvent) reformulation, which collapses onto the open Route B resolvent-truncation (N,T) rate of imp-96827/96847/96848 -- so Route C-direct and Route B share one unbounded-operator wall',
  qed: false,
});
export default IMP96875_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96875_ASSERTIONS = [
  {
    id: 'imp96875-provisional-seed-clears-kt2-but-floor-negative',
    holds: () =>
      IMP96875_SCOUT.every((r) => r.betaN > r.mu && r.betaBig > r.mu) &&   // KT2 cleared by provisional seed
      IMP96875_SCOUT.every((r) => r.floorBetaN < 0 && r.floorBetaBig < 0) && // yet floor is negative
      IMP96875_VERDICT.provisionalBetaClearsKT2 === true &&
      IMP96875_VERDICT.provisionalFloorIsPositive === false,
    why: 'the provisional Ritz seed beta ~ 1e2 comfortably clears KT2 (mu < beta), yet the direct Kato-Temple floor is negative at every measured N -- so the seed is not the binding obstruction.',
  },
  {
    id: 'imp96875-residual-diverges-unbounded-signature',
    holds: () => {
      const g = IMP96875_RESIDUAL_GROWTH_N20;
      let mono = true;
      for (let i = 1; i < g.length; i++) if (!(g[i].residual > g[i - 1].residual)) mono = false;
      return mono && g[g.length - 1].residual > 5 * g[0].residual &&
        IMP96875_VERDICT.residualDivergesWithEvalSpace === true &&
        IMP96875_VERDICT.trialInFormDomainNotOperatorDomain === true;
    },
    why: 'at fixed N=20 the residual grows monotonically 1.65e3 -> 2.60e4 as the evaluation space grows Nbig 24->120: the unbounded-operator signature (Tg not in L^2 for the m=3 form-domain trial).',
  },
  {
    id: 'imp96875-floor-worsens-with-N',
    holds: () => {
      for (let i = 1; i < IMP96875_SCOUT.length; i++)
        if (!(IMP96875_SCOUT[i].floorBetaN < IMP96875_SCOUT[i - 1].floorBetaN)) return false;
      return IMP96875_VERDICT.reachableFloorSignDirectKatoTemple === 'negative' &&
        IMP96875_VERDICT.bindingObstruction.indexOf('residual') === 0;
    },
    why: 'the KT floor gets MORE negative with N (-8.3e5 -> -4.0e7) because the residual grows: the binding obstruction is the residual (operator-domain) leg, not the seed.',
  },
  {
    id: 'imp96875-needs-bounded-reformulation-and-complements-96865',
    holds: () =>
      IMP96875_VERDICT.seedIsBindingObstruction === false &&
      IMP96875_VERDICT.needsBoundedReformulation === true &&
      IMP96875_VERDICT.subGap.indexOf('IMP96875_KT_RESIDUAL_DIVERGES') === 0,
    why: 'a positive floor needs a bounded (shift-invert / resolvent) reformulation, which reduces to the open Route B (N,T) rate; this residual obstruction is complementary to the imp-96865 certified-seed sign obstruction.',
  },
  {
    id: 'imp96875-scout-only-no-qed',
    holds: () =>
      IMP96875_VERDICT.operatorPositivityProved === false &&
      IMP96875_VERDICT.intervalRigorousReachUnchanged === IMP96875_RIGOROUS_REACH_2A &&
      IMP96875_RIGOROUS_REACH_2A === 0.96 &&
      LN2 < LN3 &&
      IMP96875_VERDICT.qed === false,
    why: 'scouting only: no operator-positivity theorem, provisional beta is not a certified bound, the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96875_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96875-krein-katotemple-residual-scout assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;

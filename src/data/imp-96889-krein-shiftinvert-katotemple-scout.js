/**
 * @fileoverview imp-96889 -- SCOUT (numerical): does a BOUNDED shift-invert / resolvent (T+m)^{-1}
 * reformulation of the Route C Kato-Temple attack on lambda_1(T_a[sigma_2]) at 2a=ln3 deliver a
 * POSITIVE, N-stable floor, or does it merely re-express the open imp-96827/imp-96847/imp-96848
 * (N,T) resolvent-truncation rate ? Companion to imp-96875 (which showed the DIRECT residual
 * diverges). Scouting / measurement only; provisional beta is a Ritz value (NOT a certified bound);
 * NO operator positivity established; NO QED.
 *
 * SETUP. imp-96875 (SUB-GAP IMP96875_KT_RESIDUAL_DIVERGES) showed the DIRECT Kato-Temple residual
 * ||T g - mu g|| DIVERGES for the unbounded T_a[sigma_2] on m=3 pole-free trials (form domain, not
 * operator domain: ghat~t^{-4} so int sigma_2^2 |ghat|^2 ~ int (ln t)^2 dt = inf), giving a floor
 * ~ -1e6 that WORSENS with N even after a positive provisional Ritz seed clears KT2. Its verdict
 * flagged the only viable variant: run Kato-Temple on a BOUNDED reformulation. This leaf measures it.
 *
 * METHOD (reuses the imp-96768/imp-96875 pole-free Gegenbauer Galerkin build, exactly-diagonal L^2
 * Gram B=scaleB*I; operator matrix in the orthonormal basis is K = A/scaleB; driver
 * tmp/imp-96889-shiftinvert-scout.py, /tmp/rhvenv scipy 1.18). Shift m=1; resolvent R=(K+m)^{-1} is
 * BOUNDED, ||R|| <= 1/(lambda_min+m). Its LARGEST eigenvalue is Lambda_1 = 1/(lambda_1(K)+m); an
 * UPPER bound on Lambda_1 gives a LOWER bound lambda_1 = 1/Lambda_1 - m. Kato-Temple for the TOP
 * eigenvalue of the self-adjoint bounded R, with unit trial g, eta=<g,Rg>, eps=||R g - eta g||, and
 * an upper bound beta on the SECOND-largest eigenvalue with beta<eta:
 *     Lambda_1 <= eta + eps^2/(eta - beta).
 * g is the top eigenvector of the compression R_N=R[:N,:N]; the out-of-space residual is the tail
 * (R g)[N:Nbig] evaluated in a nested Nbig-dim space; beta is the provisional Ritz second-largest
 * of R in the big space.
 *
 * FINDING 1 -- THE BOUNDED REFORMULATION CURES THE imp-96875 RESIDUAL DIVERGENCE. At fixed N=20 the
 * out-of-space residual eps=||(I-P_N) R g|| is TINY and BOUNDED as the evaluation space grows:
 * 1.04e-5 (Nbig=24) -> 2.09e-5 (Nbig=120) -- flat to O(1e-5), versus imp-96875 DIRECT residual
 * 1.65e3 -> 2.60e4 diverging over the same Nbig ladder. R is bounded, so R g is essentially captured
 * by the low-order (smooth) Gegenbauer modes and its out-of-space leakage is negligible. So the
 * residual leg is NO LONGER the binding obstruction.
 *
 * FINDING 2 -- BUT THE KATO-TEMPLE CORRECTION IS NEGLIGIBLE, SO THE FLOOR COLLAPSES ONTO THE RITZ
 * UPPER BOUND. Because eps ~ 1e-6..1e-5, the KT correction eps^2/(eta-beta) ~ 1e-12 is negligible
 * vs eta ~ 0.63, so Lambda_1^ub = eta to 6 digits and hence lam1_LB = 1/Lambda_1^ub - m EQUALS the
 * Ritz estimate lam1_ritz = 1/eta - m to 6 digits at every N (0.585633, 0.573734, 0.561112, 0.545630
 * for N=20,28,36,44). The "floor" is POSITIVE but it is numerically the RITZ value, which is an
 * UPPER bound on lambda_1 -- it carries no genuine lower-bound margin. The measured eps only counts
 * leakage into the [N,Nbig) band of a truncated resolvent; the TRUE residual ||(I-P_N)R_true g||
 * (Nbig->inf, T->inf) is what a certified KT bound needs, and it is UNDER-estimated here.
 *
 * FINDING 3 -- THE FLOOR RE-EXPRESSES THE OPEN (N,T) TRUNCATION RATE, NOT A NEW N-STABLE BOUND.
 * (a) N-instability: at fixed N=20 the top Ritz eta DRIFTS UP with the evaluation space,
 *     0.622238 (Nbig=24) -> 0.660250 (Nbig=120) -- unconverged in N. (b) T-instability: at N=36,
 *     Nbig=72 the floor tracks the imp-96827 t-truncation ladder exactly, lam1_LB 0.561112 (T=800)
 *     -> 0.578874 (T=1600) -> 0.581818 (T=3200), i.e. it climbs onto the imp-96827 plateau ~0.5805
 *     +/- 8e-4, NOT a T-independent floor. So the bounded reformulation re-expresses the SAME open
 *     resolvent-truncation (N,T) envelope of imp-96827/imp-96847/imp-96848 -- exactly as imp-96875
 *     predicted -- rather than delivering an independent positive N-stable certified floor.
 *
 * VERDICT. The shift-invert / resolvent (T+m)^{-1} reformulation FIXES the imp-96875 form-domain
 * residual divergence (eps ~1e-5 bounded vs ~1e4 diverging) and returns a nominally POSITIVE floor
 * at every N, but that floor is numerically the RITZ value (KT correction ~1e-12 negligible), so it
 * inherits the Ritz UPPER-bound character and is NOT a certified lower bound; the genuine lower-bound
 * content requires the TRUE out-of-space residual ||(I-P_N)R g|| (Nbig->inf, T->inf), whose rate is
 * exactly the open (N,T) resolvent-truncation envelope -- confirmed by the eta drift with Nbig
 * (Finding 3a) and the floor tracking the imp-96827 T-ladder (Finding 3b). Route C-shift-invert and
 * Route B therefore share ONE open (N,T) truncation wall. SUB-GAP IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE.
 * Provisional beta is a Ritz value, NOT a certified bound (Ritz gives upper bounds on lambda);
 * interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96875-krein-katotemple-residual-scout.js (DIRECT residual diverges; predicted this bounded reformulation collapses to Route B)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open t-truncation (N,T) rate the floor here tracks: plateau ~0.5805 +/- 8e-4)
 * @see imp-96846-krein-uniform-N-lower-bound-routes-assessment.js (Route C most tractable; SUB-GAP IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96889_RIGOROUS_REACH_2A = 0.96;

// FINDING 1: shift-invert out-of-space residual eps=||(I-P_N) R g|| at fixed N=20 -- BOUNDED and tiny
// (contrast imp-96875 DIRECT residual 1.65e3 -> 2.60e4 diverging over the same Nbig ladder). eta drifts.
export const IMP96889_RESIDUAL_BOUNDED_N20 = Object.freeze([
  Object.freeze({ Nbig: 24, eps: 1.041689e-5, eta: 0.622238 }),
  Object.freeze({ Nbig: 30, eps: 1.466933e-5, eta: 0.626182 }),
  Object.freeze({ Nbig: 40, eps: 1.573842e-5, eta: 0.630663 }),
  Object.freeze({ Nbig: 60, eps: 1.632566e-5, eta: 0.636740 }),
  Object.freeze({ Nbig: 80, eps: 1.724667e-5, eta: 0.643806 }),
  Object.freeze({ Nbig: 120, eps: 2.092030e-5, eta: 0.660250 }),
]);

// FINDING 2: N-ladder (Nbig=2N, T=800). lam1_lb EQUALS lam1_ritz to 6 digits (KT correction ~1e-12
// negligible): the "floor" is the Ritz UPPER bound, not a certified lower bound.
export const IMP96889_KT_LADDER = Object.freeze([
  Object.freeze({ N: 20, Nbig: 40, eta: 0.630663, beta: 0.009832, eps: 1.5738e-5, Lambda1_ub: 0.630663, lam1_ritz: 0.585633, lam1_lb: 0.585633 }),
  Object.freeze({ N: 28, Nbig: 56, eta: 0.635431, beta: 0.010310, eps: 4.2951e-6, Lambda1_ub: 0.635431, lam1_ritz: 0.573734, lam1_lb: 0.573734 }),
  Object.freeze({ N: 36, Nbig: 72, eta: 0.640569, beta: 0.010884, eps: 1.5012e-6, Lambda1_ub: 0.640569, lam1_ritz: 0.561112, lam1_lb: 0.561112 }),
  Object.freeze({ N: 44, Nbig: 88, eta: 0.646986, beta: 0.011731, eps: 1.3114e-6, Lambda1_ub: 0.646986, lam1_ritz: 0.545630, lam1_lb: 0.545630 }),
]);

// FINDING 3b: T-truncation dependence at N=36, Nbig=72 -- the floor tracks the imp-96827 t-ladder
// (climbs onto the plateau ~0.5805 +/- 8e-4): NOT a T-independent floor.
export const IMP96889_T_LADDER_N36 = Object.freeze([
  Object.freeze({ T: 800, eta: 0.640569, eps: 1.5012e-6, Lambda1_ub: 0.640569, lam1_lb: 0.561112 }),
  Object.freeze({ T: 1600, eta: 0.633363, eps: 1.4869e-6, Lambda1_ub: 0.633363, lam1_lb: 0.578874 }),
  Object.freeze({ T: 3200, eta: 0.632184, eps: 1.4925e-6, Lambda1_ub: 0.632184, lam1_lb: 0.581818 }),
]);

export const IMP96889_VERDICT = Object.freeze({
  ticket: 'imp-96889',
  question: 'does a BOUNDED shift-invert / resolvent (T+m)^{-1} Kato-Temple reformulation give a positive, N-stable floor on lambda_1(T_a[sigma_2]) at 2a=ln3, or does it re-express the open (N,T) truncation rate ?',
  shift_m: 1.0,
  // Finding 1: the imp-96875 residual divergence is cured
  residualDivergenceCured: true,          // eps ~1e-5 bounded vs imp-96875 ~1e4 diverging
  residualLegBinding: false,              // no longer the obstruction (bounded operator)
  // Finding 2: but the KT correction is negligible, so the floor collapses onto the Ritz UPPER bound
  ktCorrectionNegligible: true,          // eps^2/(eta-beta) ~ 1e-12 << eta ~ 0.63
  floorEqualsRitzUpperBound: true,       // lam1_lb == lam1_ritz to 6 digits at every N
  floorIsCertifiedLowerBound: false,     // it carries Ritz UPPER-bound character
  provisionalFloorIsPositive: true,      // nominally 0.55..0.59, but see floorEqualsRitzUpperBound
  // Finding 3: it re-expresses the open (N,T) truncation rate
  etaDriftsWithEvalSpace: true,          // 0.622238 -> 0.660250 at fixed N=20 as Nbig 24->120 (N-unstable)
  floorTracksTtruncationLadder: true,    // 0.561112 -> 0.578874 -> 0.581818 over T=800,1600,3200 (imp-96827)
  reExpressesOpenNTrate: true,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE -- the bounded shift-invert / resolvent (T+m)^{-1} Kato-Temple reformulation CURES the imp-96875 form-domain residual divergence (out-of-space eps ~1e-5 BOUNDED vs the direct ~1e4 diverging over the same Nbig ladder) and returns a nominally POSITIVE floor at every N, but the KT correction eps^2/(eta-beta) ~ 1e-12 is negligible so lam1_lb EQUALS the Ritz upper estimate lam1_ritz to 6 digits -- the floor inherits the Ritz UPPER-bound character and is NOT a certified lower bound; the genuine lower-bound content needs the TRUE out-of-space residual ||(I-P_N)R g|| (Nbig->inf, T->inf), whose rate is exactly the open (N,T) resolvent-truncation envelope, confirmed by the top-Ritz eta drifting up with Nbig (N-unstable) and the floor tracking the imp-96827 t-truncation ladder onto the ~0.5805 +/- 8e-4 plateau (T-unstable); Route C-shift-invert and Route B share ONE open (N,T) truncation wall',
  qed: false,
});
export default IMP96889_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96889_ASSERTIONS = [
  {
    id: 'imp96889-bounded-reformulation-cures-residual-divergence',
    holds: () => {
      const g = IMP96889_RESIDUAL_BOUNDED_N20;
      // eps stays O(1e-5) across the full Nbig ladder (bounded), unlike imp-96875 O(1e4) diverging
      const allTiny = g.every((r) => r.eps < 1e-4);
      const boundedRatio = g[g.length - 1].eps < 5 * g[0].eps;   // grows <5x (vs imp-96875 >15x)
      return allTiny && boundedRatio &&
        IMP96889_VERDICT.residualDivergenceCured === true &&
        IMP96889_VERDICT.residualLegBinding === false;
    },
    why: 'the bounded resolvent out-of-space residual eps stays O(1e-5) across Nbig=24..120 at fixed N=20 (grows <5x), curing the imp-96875 direct-residual divergence (1.65e3 -> 2.60e4, >15x).',
  },
  {
    id: 'imp96889-floor-collapses-onto-ritz-upper-bound',
    holds: () =>
      IMP96889_KT_LADDER.every((r) => Math.abs(r.lam1_lb - r.lam1_ritz) < 1e-6) && // KT floor == Ritz value
      IMP96889_KT_LADDER.every((r) => r.Lambda1_ub - r.eta < 1e-6) &&              // KT correction negligible
      IMP96889_VERDICT.ktCorrectionNegligible === true &&
      IMP96889_VERDICT.floorEqualsRitzUpperBound === true &&
      IMP96889_VERDICT.floorIsCertifiedLowerBound === false,
    why: 'because eps ~1e-6 the KT correction eps^2/(eta-beta) ~1e-12 is negligible, so Lambda1_ub == eta and lam1_lb == lam1_ritz to 6 digits: the floor is numerically the Ritz UPPER bound, not a certified lower bound.',
  },
  {
    id: 'imp96889-floor-is-positive-but-not-N-converged',
    holds: () => {
      const g = IMP96889_RESIDUAL_BOUNDED_N20;
      let etaMono = true;
      for (let i = 1; i < g.length; i++) if (!(g[i].eta > g[i - 1].eta)) etaMono = false;
      return IMP96889_KT_LADDER.every((r) => r.lam1_lb > 0) &&    // nominally positive
        etaMono && g[g.length - 1].eta - g[0].eta > 0.03 &&       // eta drifts up with Nbig (N-unstable)
        IMP96889_VERDICT.provisionalFloorIsPositive === true &&
        IMP96889_VERDICT.etaDriftsWithEvalSpace === true;
    },
    why: 'the floor is nominally positive at every N, but the top Ritz eta drifts up 0.622238 -> 0.660250 with the evaluation space at fixed N=20, so it is not N-converged.',
  },
  {
    id: 'imp96889-floor-tracks-imp96827-t-truncation-ladder',
    holds: () => {
      const g = IMP96889_T_LADDER_N36;
      let tMono = true;
      for (let i = 1; i < g.length; i++) if (!(g[i].lam1_lb > g[i - 1].lam1_lb)) tMono = false;
      // climbs onto the imp-96827 plateau ~0.5805
      return tMono && g[0].lam1_lb < 0.57 && g[g.length - 1].lam1_lb > 0.58 &&
        IMP96889_VERDICT.floorTracksTtruncationLadder === true &&
        IMP96889_VERDICT.reExpressesOpenNTrate === true;
    },
    why: 'at N=36 the floor climbs 0.561112 -> 0.578874 -> 0.581818 over T=800,1600,3200, tracking the imp-96827 t-truncation ladder onto the ~0.5805 plateau: it re-expresses the open (N,T) rate.',
  },
  {
    id: 'imp96889-scout-only-no-qed',
    holds: () =>
      IMP96889_VERDICT.operatorPositivityProved === false &&
      IMP96889_VERDICT.intervalRigorousReachUnchanged === IMP96889_RIGOROUS_REACH_2A &&
      IMP96889_RIGOROUS_REACH_2A === 0.96 &&
      IMP96889_VERDICT.subGap.indexOf('IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE') === 0 &&
      LN2 < LN3 &&
      IMP96889_VERDICT.qed === false,
    why: 'scouting only: no operator-positivity theorem, provisional beta is not a certified bound, the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96889_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96889-krein-shiftinvert-katotemple-scout assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;

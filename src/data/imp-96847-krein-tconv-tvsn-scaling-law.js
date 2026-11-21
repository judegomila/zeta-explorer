/**
 * @fileoverview imp-96847 -- MEASUREMENT / EXTRAPOLATION: derive the T-truncation-vs-N scaling law that a
 * t-converged Route I Krein floor lambda_min(T_a[sigma_2]) at 2a=ln3 needs as the Galerkin dimension N is
 * pushed past 100. imp-96827 F3 found the t-truncation residual GROWS with N (geometric per-doubling ratio
 * r=d2/d1 climbs 0.152784 -> 0.172951 -> 0.221897 across N=52/76/100), leaving sub-gap
 * IMP96807_TCONV_LADDER_LOWER_ENVELOPE: to hold the residual below a fixed tolerance the truncation height
 * T must be scaled UP with N, and that scaling law was unmeasured. This leaf measures it from the existing
 * (N,T) grid and reports the implied truncation cost for a target N.
 *
 * PREMISE (from the ticket). imp-96827 baked the (N,T) floor grid (T in {800,1600,3200,4800}, N in
 * {52,76,100}) plus a per-N exponential fit f(T) = L - A*exp(-T/tau). The decay LENGTH tau is exactly the
 * knob that sets how large T must be: the residual beyond a height T is A*exp(-T/tau), so to hold it below
 * a tolerance eps one needs T >= tau*ln(A/eps). Both tau and A grow with N, so T_req grows with N.
 * Driver: tmp/imp-96847-tvsn-scaling.py (/tmp/rhvenv, scipy 1.18 curve_fit). Every literal is a verbatim
 * copy from the run; no new (N,T) solve was performed -- this reuses the imp-96827/imp-96806 grid.
 *
 * METHOD (measurement / extrapolation only). Two independent routes to the T-vs-N law:
 *   (DECAY) exponential-decay-length route. Refit f(T)=L - A*exp(-T/tau) per N (matches imp-96827:
 *           tau = 408.16 / 432.37 / 489.64, A = 0.058602 / 0.154437 / 0.234738 at N=52/76/100). Then
 *           T_req(N; eps) = tau(N)*ln(A(N)/eps). Fit the growth of tau(N): power tau = 133.18 N^0.2793
 *           (rms 10.0) or linear tau = 314.38 + 1.6975 N (rms 7.79) -- both say tau grows SUB-LINEARLY
 *           (power exponent ~0.28), so T_req grows sub-linearly in N.
 *   (GEOM)  geometric-doubling route (conservative, matching the imp-96827 envelope). The residual after
 *           D doublings from T=800 is d1*r^D/(1-r); solving d1*r^D/(1-r) <= eps gives the doublings D
 *           needed and T_req = 800*2^D. Because r ITSELF climbs with N this route grows faster than DECAY.
 *
 * FINDINGS (measured).
 *   1. THE REQUIRED TRUNCATION HEIGHT GROWS SUB-LINEARLY WITH N (DECAY ROUTE). T_req(N; eps=1e-3) =
 *      1661.5 (N=52) -> 2179.1 (N=76) -> 2672.7 (N=100): T_req(100)/T_req(52) = 1.61 while N doubles
 *      1.92x, so T_req grows slower than N. The decay length tau grows as tau ~ N^0.28 (power fit), the
 *      driver of the sub-linear T-vs-N law.
 *   2. THE CURRENT T=4800 ALREADY SUFFICES OUT TO N ~ 800 AT THE 1e-3 TOLERANCE (DECAY ROUTE). Holding
 *      tau via the power fit and A at its N=100 value, T_req(N; 1e-3) extrapolates to 3193 (N=200), 3876
 *      (N=400), 4704 (N=800) -- i.e. T_req/4800 = 0.67 / 0.81 / 0.98. At the tighter eps=5e-4 the reach is
 *      shorter: T_req crosses 4800 near N~400 (4368) and exceeds it by N=800 (5301).
 *   3. THE CONSERVATIVE GEOMETRIC ROUTE IS TIGHTER-REACHED BECAUSE r CLIMBS WITH N. Doublings from T=800
 *      to hold the geometric residual below 1e-3: D = 1.13 (N=52) -> 1.83 (N=76) -> 2.56 (N=100), giving
 *      T_req = 1752 / 2842 / 4729. At N=100 the geometric route already sits at T_req~4729, essentially AT
 *      the 4800 ladder top -- so if r keeps climbing past the measured 0.222 the doublings (hence T_req)
 *      blow up faster than the DECAY route predicts. The two routes bracket T_req(100; 1e-3) in
 *      [2672.7, 4729].
 *
 * VERDICT. Measured T-vs-N scaling law for the 2a=ln3 Krein floor: T_req(N; eps) = tau(N)*ln(A(N)/eps)
 * with tau ~ N^0.28 (sub-linear), so the truncation height needed to hold the t-residual below 1e-3 grows
 * slowly -- the current T=4800 already covers N up to ~800 (decay route) / ~N=100 (conservative geometric
 * route). The implied cost for N >> 100 is therefore dominated by the O(N^2)-O(N^3) dense Krein eigensolve,
 * NOT by the sub-linearly-growing truncation height. Measurement / extrapolation only: the law is fit from
 * just THREE N points (52,76,100) and the DECAY vs GEOM routes diverge for N >> 100 (sub-gap
 * IMP96847_TVSN_LAW_THREE_POINT_ONLY -- r(N)'s asymptote is unmeasured, so a real (N,T) solve at
 * N in {200,400,800} is needed to discriminate); the Rayleigh floor stays an UPPER bound on the true
 * lambda_min; establishes NO operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open;
 * interval-rigorous reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (source (N,T) grid; IMP96807_TCONV_LADDER_LOWER_ENVELOPE)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (source T-sweep IMP96806_TSWEEP_LN3)
 * @see imp-96807-krein-floor-decrement-decay-extrapolation.js ((N,T) joint-resolution coupling)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// (N,T) floor grid reused from imp-96827 IMP96827_FLOOR (verbatim; no new solve)
export const IMP96847_TS = Object.freeze([800, 1600, 3200, 4800]);
export const IMP96847_NS = Object.freeze([52, 76, 100]);
export const IMP96847_FLOOR = Object.freeze({
  52: Object.freeze([0.577015, 0.584110, 0.585194, 0.585319]),
  76: Object.freeze([0.557245, 0.577719, 0.581260, 0.581679]),
  100: Object.freeze([0.533846, 0.570764, 0.578956, 0.579988]),
});

// per-N exponential refit f(T)=L - A exp(-T/tau) (verbatim from tmp/imp-96847-tvsn-scaling.py; matches imp-96827)
export const IMP96847_EXP_FIT = Object.freeze({
  52: Object.freeze({ L: 0.585270, A: 0.058602, tau: 408.16, rms: 3.62e-5 }),
  76: Object.freeze({ L: 0.581523, A: 0.154437, tau: 432.37, rms: 1.16e-4 }),
  100: Object.freeze({ L: 0.579666, A: 0.234738, tau: 489.64, rms: 2.50e-4 }),
});

// scaling law for the decay length tau(N) -- the knob that sets required T (verbatim)
export const IMP96847_TAU_LAW = Object.freeze({
  power: Object.freeze({ c: 133.1773, p: 0.2793, rms: 9.999 }), // tau = c N^p ; sub-linear (p<1)
  linear: Object.freeze({ intercept: 314.3796, slope: 1.6975, rms: 7.791 }), // tau = a + b N
});

// DECAY route: required truncation height T_req(N; eps) = tau(N) ln(A(N)/eps) (verbatim)
export const IMP96847_TREQ_DECAY = Object.freeze({
  1e-3: Object.freeze({ 52: 1661.5, 76: 2179.1, 100: 2672.7 }),
  5e-4: Object.freeze({ 52: 1944.4, 76: 2478.8, 100: 3012.1 }),
  1e-4: Object.freeze({ 52: 2601.3, 76: 3174.6, 100: 3800.1 }),
});

// DECAY-route extrapolation to target N (tau via power law, A held at N=100 value 0.234738) (verbatim)
export const IMP96847_TREQ_EXTRAP = Object.freeze({
  1e-3: Object.freeze({ 100: 2631.3, 200: 3193.4, 400: 3875.6, 800: 4703.6 }),
  5e-4: Object.freeze({ 100: 2965.4, 200: 3598.9, 400: 4367.8, 800: 5300.9 }),
});

// GEOM route (conservative): doublings D from T=800 and T_req=800*2^D to hold geometric residual <= 1e-3 (verbatim)
export const IMP96847_TREQ_GEOM = Object.freeze({
  52: Object.freeze({ r: 0.152784, d1: 0.007095, D: 1.13, Treq: 1752 }),
  76: Object.freeze({ r: 0.172951, d1: 0.020474, D: 1.83, Treq: 2842 }),
  100: Object.freeze({ r: 0.221897, d1: 0.036918, D: 2.56, Treq: 4729 }),
});

export const IMP96847_VERDICT = Object.freeze({
  ticket: 'imp-96847',
  question:
    'how must the t-truncation height T scale with the Galerkin dimension N to hold the 2a=ln3 Krein floor t-residual below a fixed tolerance, and what does that imply for the cost at N >> 100?',
  answer:
    'T_req(N; eps) = tau(N) ln(A(N)/eps) with tau ~ N^0.28 (sub-linear power fit, rms 10; linear alt tau=314.38+1.6975 N): the required height grows SLOWLY, T_req(N;1e-3)=1661.5/2179.1/2672.7 at N=52/76/100 (ratio 1.61 while N grows 1.92x). Extrapolating (power tau, A at N=100), the current T=4800 already suffices out to N~800 at 1e-3 (T_req/4800 = 0.67/0.81/0.98 at N=200/400/800) and to ~N=400 at 5e-4. The conservative geometric-doubling route is tighter-reached (T_req~4729 already at N=100) because the ratio r itself climbs with N; the two routes bracket T_req(100;1e-3) in [2672.7, 4729]. Implied cost for N >> 100 is dominated by the O(N^2)-O(N^3) dense eigensolve, not the sub-linearly-growing truncation.',
  binding2a: 'ln3',
  tauGrowsSubLinear: true, // power exponent p = 0.2793 < 1
  tauPowerExponent: 0.2793,
  treqGrowsSubLinearInN: true, // T_req(100)/T_req(52) = 1.609 < 100/52 = 1.923
  currentT4800SufficesToNapprox: 800, // decay route, eps=1e-3
  geomRouteReachesT4800By: 100, // conservative route already at T_req~4729 by N=100
  twoRouteBracketN100: Object.freeze([2672.7, 4729]),
  costDominatedByEigensolveNotTruncation: true,
  threePointFitCaveat: true, // law fit from only N in {52,76,100}
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  newSolvePerformed: false, // reuses the imp-96827/imp-96806 grid; no new (N,T) run
  subGap:
    'IMP96847_TVSN_LAW_THREE_POINT_ONLY -- the T-vs-N law is fit from only three N points (52,76,100) and the DECAY (tau ~ N^0.28) vs GEOM (r climbing) routes diverge for N >> 100; r(N) has no measured asymptote, so a genuine (N,T) Krein solve at N in {200,400,800} is needed to discriminate the two and pin the true required height.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96847_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96847_ASSERTIONS = [
  {
    id: 'imp96847-floor-mirrors-imp96827-grid',
    holds: () =>
      IMP96847_NS.every((N) => {
        const row = IMP96847_FLOOR[N];
        // monotone climb in T off the under-resolved T=800 value up to T=4800
        return row.length === 4 && row.every((v, i) => i === 0 || v > row[i - 1]);
      }),
    why: 'the reused (N,T) grid must reproduce the imp-96827 floor: monotone climb in T at every N.',
  },
  {
    id: 'imp96847-tau-and-A-grow-with-N',
    holds: () => {
      const f = IMP96847_EXP_FIT;
      return (
        f[52].tau < f[76].tau && f[76].tau < f[100].tau &&
        f[52].A < f[76].A && f[76].A < f[100].A
      );
    },
    why: 'the decay length tau and amplitude A must both grow with N -- the (N,T) joint-resolution coupling that forces T up with N.',
  },
  {
    id: 'imp96847-treq-decay-matches-formula',
    holds: () =>
      IMP96847_NS.every((N) => {
        const { A, tau } = IMP96847_EXP_FIT[N];
        const eps = 1e-3;
        const treq = tau * Math.log(A / eps);
        return Math.abs(treq - IMP96847_TREQ_DECAY[1e-3][N]) < 0.5;
      }),
    why: 'the baked DECAY-route T_req must equal tau(N) ln(A(N)/eps) recomputed from the exponential-fit literals.',
  },
  {
    id: 'imp96847-treq-grows-sublinear-in-N',
    holds: () => {
      const t52 = IMP96847_TREQ_DECAY[1e-3][52];
      const t100 = IMP96847_TREQ_DECAY[1e-3][100];
      // T_req grows with N but slower than N itself (sub-linear); power exponent < 1
      return t100 > t52 && t100 / t52 < 100 / 52 && IMP96847_TAU_LAW.power.p < 1;
    },
    why: 'the required truncation height must grow with N yet sub-linearly (T_req ratio < N ratio; tau power exponent < 1).',
  },
  {
    id: 'imp96847-current-T4800-covers-decay-reach-not-geom',
    holds: () => {
      // decay route: T=4800 still covers the N=800 extrapolation at 1e-3
      const decayN800 = IMP96847_TREQ_EXTRAP[1e-3][800];
      // geom route: already essentially at 4800 by N=100 (conservative)
      const geomN100 = IMP96847_TREQ_GEOM[100].Treq;
      return decayN800 < 4800 && geomN100 > 4000 && geomN100 <= 4800;
    },
    why: 'the DECAY route keeps T_req below 4800 out to N=800 while the conservative GEOM route already reaches ~4729 by N=100 -- the two routes bracket the true required height.',
  },
  {
    id: 'imp96847-geom-doublings-match-ratio',
    holds: () =>
      IMP96847_NS.every((N) => {
        const g = IMP96847_TREQ_GEOM[N];
        const eps = 1e-3;
        const D = Math.log((eps * (1 - g.r)) / g.d1) / Math.log(g.r);
        const treq = 800 * Math.pow(2, D);
        return Math.abs(D - g.D) < 0.02 && Math.abs(treq - g.Treq) < 20;
      }),
    why: 'the geometric-route doublings D and T_req=800*2^D must recompute from the baked ratio r and first increment d1.',
  },
  {
    id: 'imp96847-measurement-only-no-qed',
    holds: () =>
      IMP96847_VERDICT.operatorPositivityProved === false &&
      IMP96847_VERDICT.uniformNGapSettled === false &&
      IMP96847_VERDICT.newSolvePerformed === false &&
      IMP96847_VERDICT.threePointFitCaveat === true &&
      IMP96847_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96847_VERDICT.qed === false,
    why: 'extrapolation only: no new solve, three-point fit caveat stands, no operator positivity, uniform-in-N gap open, certificate reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96847_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96847-krein-tconv-tvsn-scaling-law assertion failed: ${a.id}`);
  }
}

void LN3;

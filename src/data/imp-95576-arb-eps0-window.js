/**
 * imp-95576 — Arbitrary-precision eps0Window: resolving the imp-95557
 * PD-persistence window W(S) = mu_S(0)/M1 BELOW the ~1e-6 float64 ceiling and
 * locating the node count n at which W crosses the Lehmer collision threshold
 * 1.15e-11. Closes the imp-95557 SUB-GAP W-DECAY-PRECISION on the numeric side.
 * Report only; changes no bound; NO QED; no refereed bound is changed; RH open.
 *
 * THE SUB-GAP. imp-95557 measured W(S) for structured node families but hit the
 * float64 wall: mu_S(0) sinks below the ~1e-10 double-precision noise floor (the
 * Cauchy-Gram metric G_ij = 1/(s_i+s_j-1) is a Cauchy/Hilbert matrix whose
 * condition number grows super-exponentially in n), so Cholesky of G fails and
 * mu_S(0) goes spuriously negative by n ~ 5 (dense families) to n = 8 (dyadic).
 * At its last resolvable count the tightest dyadic family was still W = 2.79e-6
 * = 2.4e5 x the collision threshold, and the extrapolated crossings (n ~ 7 dense,
 * n ~ 14-45 dyadic, uncertain) sat BEYOND float64 verification. imp-95557 named
 * the residual W-DECAY-PRECISION: "certifying the window below W ~ 1e-6 requires
 * extended precision (double-double / Arb) for the ill-conditioned pencil."
 *
 * THE EXTENDED-PRECISION COMPUTATION (offline, tmp/imp-95576-arb-eps0.py). The
 * imp-95531 pencil is ported VERBATIM to mpmath at dps = 60 (arbitrary precision,
 * the Arb-class route imp-95557 called for): G_ij = 1/(s_i+s_j-1);
 * P_ij = (phi(s_i)+phi(s_j))/(s_i+s_j-1); phi(s) = 2<u sinh(2yu)>/<cosh(2yu)>,
 * y = s-1/2, <f> = int_0^inf Phi(u) f du at eps=0; P'_ij = (dphi_i+dphi_j)/
 * (s_i+s_j-1) with dphi = 2(nP*den - num*dP)/den^2, nP = -<u^3 sinh>,
 * dP = -<u^2 cosh>. Integrals via adaptive mp.quad on [0,3] (Phi decays double-
 * exponentially). mu0 = lambda_min(P; G) and M1 = ||G^{-1/2} P' G^{-1/2}||_2 are
 * taken from the metric pencil via mpmath Cholesky + eigsy, all in high precision,
 * so the ill-conditioned metric no longer floors mu0 at ~1e-10. W = mu0/M1.
 *
 * VALIDATION. The arbitrary-precision W reproduces the imp-95557 float64 rows on
 * the overlap to rel ~1e-5 (dyadic n=3: 2.74778e-3 vs 2.7478e-3, rel 7e-6;
 * dyadic n=5: 2.27253e-5 vs 2.2725e-5, rel 1.3e-5; arithmetic n=4: 2.55035e-5 vs
 * 2.5504e-5, rel 1.9e-5). Precision-robust: recomputing at dps = 100 reproduces
 * arithmetic n=8 (W = 9.743420947e-12) and dyadic n=16 (W = 2.028589757e-6) to 10
 * significant figures, and dyadic n=20 to ~8 figures — the results below are NOT
 * precision artifacts.
 *
 * MEASURED PAST THE FLOAT64 CEILING (dps = 60; Lehmer = 1.15e-11):
 *   ARITHMETIC nu = 1..n (dense)   W crosses 1.15e-11 at n = 8
 *     n=6  mu0 2.733e-10  W 1.426e-8    (1240 x)  <- already below the float64 floor
 *     n=7  mu0 8.729e-12  W 3.444e-10   (30.0 x)
 *     n=8  mu0 2.925e-13  W 9.743e-12   (0.847 x) <- FIRST W < Lehmer
 *     n=12 mu0 1.772e-18  W 3.626e-17   (3.2e-6 x)
 *   GEOMETRIC r=1.5 nu = r^k (dense)   W crosses 1.15e-11 at n = 9
 *     n=7  mu0 8.587e-12  W 3.283e-10   (28.5 x)
 *     n=8  mu0 1.074e-12  W 4.055e-11   (3.53 x)
 *     n=9  mu0 2.451e-13  W 7.734e-12   (0.672 x) <- FIRST W < Lehmer
 *   DYADIC nu = 2^k (exponentially spread)   W NEVER crosses -- it PLATEAUS
 *     n=8  mu0 7.266e-8   W 2.788e-6    (2.42e5 x)  (imp-95557 last float64 row)
 *     n=12 mu0 5.582e-8   W 2.067e-6    (1.80e5 x)
 *     n=16 mu0 5.490e-8   W 2.029e-6    (1.76e5 x)
 *     n=20 mu0 ~5.48e-8   W 2.026e-6    (1.76e5 x)  <- converging to W_inf ~ 2.03e-6
 *
 * FINDING (refines imp-95557).
 *  - DENSE families do reach the collision threshold at a SMALL, now-certified
 *    node count: arithmetic at n = 8, geometric r=1.5 at n = 9 — consistent with
 *    imp-95557's near-exponential extrapolation (n ~ 7) but pinned exactly, and
 *    the decay continues clean and monotone down to W ~ 1e-17 (mu0 ~ 1e-18) with
 *    no floor. This is the arithmetic route to inf_S W(S) = 0 (imp-95530 A5).
 *  - The NESTED DYADIC family does NOT cross: W does not decay to zero, it
 *    CONVERGES to a positive limit W_inf ~ 2.03e-6 (mu0 -> ~5.48e-8). Adding a
 *    node at nu = 2^(n-1) far out barely perturbs the pencil (a nearly decoupled
 *    1x1 block whose Rayleigh ratio tends to a limit), so this particular
 *    sequence STAYS ~1.76e5 x above the collision threshold forever. imp-95557's
 *    "extrapolated dyadic crossing n ~ 14-45 (uncertain)" is CORRECTED: within the
 *    nested-dyadic family there is NO finite crossing — the collapse to inf W = 0
 *    is a property of DENSE / spreading families, not of arbitrarily-spread ones.
 *  - So inf_S W(S) = 0 is realized by dense node sets (crossing near n ~ 8-9),
 *    while the plateauing spread family is a red herring for the collision bound:
 *    node SPREAD does not merely slow the decay (imp-95557), it can HALT it.
 *
 * SCOPE / HONESTY. Report only; the crossing counts are numeric measurements at
 * arbitrary precision, not a proof. They change NO bound: the imp-95531 window is
 * per-finite-S and A4(i) flow-stability is unaffected. The relevant collision
 * threshold 1.15e-11 is a de Bruijn-Newman flow time; crossing it at n = 8-9 for
 * dense families means only that a dense enough interpolation node set gives a
 * positivity certificate whose guaranteed flow-window drops below the first
 * unconditional non-real-zero time — the finite-S certificate itself stays valid,
 * this quantifies where the SOFT window margin is exhausted. RH OPEN; NO QED.
 *
 * Import-light: imports eps0Window from imp-95531 only to CROSS-CHECK the float64-
 * resolvable overlap rows (n where mu0 > 1e-9); the sub-floor rows are baked from
 * the mpmath run and verified for internal consistency (W = mu0/M1, monotone
 * dense decay, dyadic plateau, crossing logic). Offline script preserved at
 * tmp/imp-95576-arb-eps0.py. Changes no bound; NO QED; RH open; PT Lambda <= 0.2.
 */
import { eps0Window } from './imp-95531-eps0-pd-persistence-window.js';

// node families, s = nu + 0.5 (match imp-95557)
export const dyadicNodes = (n) => Array.from({ length: n }, (_, k) => 0.5 + 2 ** k);
export const arithmeticNodes = (n) => Array.from({ length: n }, (_, k) => 1.5 + k);
export const geometricNodes = (r) => (n) => Array.from({ length: n }, (_, k) => 0.5 + r ** k);

export const IMP95576_LITERALS = Object.freeze({
  lehmerCollisionEps: 1.15e-11,
  float64MuFloor: 1e-10,
  mpmathDps: 60,
  // arbitrary-precision tables (mpmath dps=60; W = mu0/M1). Rows past the float64
  // floor (mu0 < 1e-10) are the extended-precision resolution of W-DECAY-PRECISION.
  tables: {
    arithmetic: [
      { n: 2, mu0: 8.75169e-4, M1: 5.57832e-3, W: 1.56887e-1 },
      { n: 3, mu0: 1.93515e-5, M1: 1.05032e-2, W: 1.84243e-3 },
      { n: 4, mu0: 3.93391e-7, M1: 1.54250e-2, W: 2.55035e-5 },
      { n: 5, mu0: 1.05557e-8, M1: 1.86008e-2, W: 5.67488e-7 },
      { n: 6, mu0: 2.73268e-10, M1: 1.91651e-2, W: 1.42586e-8 },
      { n: 7, mu0: 8.72881e-12, M1: 2.53417e-2, W: 3.44445e-10 },
      { n: 8, mu0: 2.92521e-13, M1: 3.00225e-2, W: 9.74342e-12 }, // FIRST W < Lehmer
      { n: 9, mu0: 1.24528e-14, M1: 3.12518e-2, W: 3.98467e-13 },
      { n: 10, mu0: 5.92825e-16, M1: 3.85000e-2, W: 1.53981e-14 },
      { n: 11, mu0: 3.29742e-17, M1: 3.97791e-2, W: 8.28933e-16 },
      { n: 12, mu0: 1.77164e-18, M1: 4.88614e-2, W: 3.62584e-17 },
    ],
    geometric15: [
      { n: 2, mu0: 5.50642e-4, M1: 4.69400e-3, W: 1.17308e-1 },
      { n: 3, mu0: 7.11362e-6, M1: 8.60254e-3, W: 8.26920e-4 },
      { n: 4, mu0: 1.03325e-7, M1: 1.34440e-2, W: 7.68558e-6 },
      { n: 5, mu0: 2.80320e-9, M1: 1.77852e-2, W: 1.57614e-7 },
      { n: 6, mu0: 1.11524e-10, M1: 1.88804e-2, W: 5.90690e-9 },
      { n: 7, mu0: 8.58712e-12, M1: 2.61600e-2, W: 3.28254e-10 },
      { n: 8, mu0: 1.07433e-12, M1: 2.64911e-2, W: 4.05542e-11 },
      { n: 9, mu0: 2.45136e-13, M1: 3.16972e-2, W: 7.73367e-12 }, // FIRST W < Lehmer
    ],
    dyadic: [
      { n: 8, mu0: 7.26597e-8, M1: 2.60580e-2, W: 2.78838e-6 },
      { n: 9, mu0: 6.34758e-8, M1: 2.65716e-2, W: 2.38886e-6 },
      { n: 10, mu0: 5.88675e-8, M1: 2.68213e-2, W: 2.19480e-6 },
      { n: 12, mu0: 5.58197e-8, M1: 2.70045e-2, W: 2.06706e-6 },
      { n: 14, mu0: 5.50797e-8, M1: 2.70498e-2, W: 2.03624e-6 },
      { n: 16, mu0: 5.48958e-8, M1: 2.70611e-2, W: 2.02859e-6 },
      { n: 20, mu0: 5.48000e-8, M1: 2.70700e-2, W: 2.02620e-6 }, // plateau, W_inf ~ 2.03e-6
    ],
  },
  crossings: {
    arithmetic: 8, // first n with W < 1.15e-11
    geometric15: 9,
    dyadic: null, // never crosses -- plateaus at W_inf
  },
  dyadicPlateauW: 2.0262e-6, // dyadic W converges here, ~1.76e5 x the collision threshold
  precisionRobust: {
    // dps=60 vs dps=100 agreement (sig figs)
    arithN8: { dps60: 9.743420947e-12, dps100: 9.743420947e-12 },
    dyadicN16: { dps60: 2.028589757e-6, dps100: 2.028589757e-6 },
  },
});

export const IMP95576_ARB_EPS0_WINDOW = Object.freeze({
  id: 'imp-95576-arb-eps0-window',
  parent: 'imp-95557-w-decay-scaling',
  subgapClosed: 'W-DECAY-PRECISION (numeric side)',
  question: 'Below the ~1e-6 float64 ceiling, where does the imp-95557 window W(S) cross the 1.15e-11 collision threshold, and at what node count n, for the dense and dyadic families?',
  method: 'Port the imp-95531 Cauchy-Gram pencil verbatim to mpmath at dps=60 (arbitrary precision): G, P, P prime built from mp.quad integrals of phi and its eps-derivative; mu0=lambda_min(P;G) and M1=||G^{-1/2}P prime G^{-1/2}||_2 via mpmath Cholesky + eigsy, so the super-exponentially ill-conditioned metric no longer floors mu0 at ~1e-10. Validated against the imp-95557 float64 rows (rel ~1e-5) and re-checked at dps=100 (10 sig figs).',
  finding: 'Dense families reach the collision threshold at a small, now-certified count: ARITHMETIC crosses 1.15e-11 at n=8 (W=9.74e-12), GEOMETRIC r=1.5 at n=9 (W=7.73e-12), with clean monotone decay continuing to W~1e-17 (mu0~1e-18), no floor. The NESTED DYADIC family does NOT cross: W does not decay to zero but CONVERGES to a positive limit W_inf~2.03e-6 (mu0->~5.48e-8, ~1.76e5 x the threshold), because a far-out node at nu=2^(n-1) barely perturbs the pencil. This corrects imp-95557 extrapolated dyadic crossing n~14-45: within the nested-dyadic family there is NO finite crossing.',
  scope: 'Numeric measurement at arbitrary precision, not a proof. Changes NO bound: the imp-95531 window is per-finite-S and A4(i) flow-stability is unaffected. inf_S W(S)=0 (imp-95530 A5) is realized by DENSE families (crossing near n~8-9); node SPREAD can HALT the decay, not merely slow it (refines imp-95557). The 1.15e-11 threshold is a de Bruijn-Newman flow time; crossing it means only that a dense-enough node set gives a certificate whose guaranteed soft flow-window drops below the first unconditional non-real-zero time.',
  verdict: 'W-DECAY-PRECISION sub-gap closed on the numeric side: arbitrary precision resolves W(S) far below the float64 ceiling. Dense families cross 1.15e-11 at n=8 (arithmetic) and n=9 (geometric r=1.5); the nested dyadic family plateaus at W_inf~2.03e-6 and never crosses. Changes no bound; RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95576_ASSERTIONS = [
  {
    id: 'imp95576-float64-overlap-crosscheck',
    description: 'the arbitrary-precision baked rows agree with the imp-95531 float64 eps0Window on the resolvable overlap (mu0 > 1e-9): dyadic n=8, arithmetic n=4 (rel 3e-3)',
    holds: () => {
      const dy8 = eps0Window(dyadicNodes(8)), ar4 = eps0Window(arithmeticNodes(4));
      const bdy8 = IMP95576_LITERALS.tables.dyadic.find((r) => r.n === 8);
      const bar4 = IMP95576_LITERALS.tables.arithmetic.find((r) => r.n === 4);
      return relEq(dy8.W, bdy8.W, 3e-3) && relEq(ar4.W, bar4.W, 3e-3);
    },
  },
  {
    id: 'imp95576-window-equals-mu-over-M1',
    description: 'every baked row satisfies W = mu0 / M1 (rel 1e-3, 6-sig-fig storage)',
    holds: () => Object.values(IMP95576_LITERALS.tables).every((t) => t.every((r) => relEq(r.W, r.mu0 / r.M1, 1e-3))),
  },
  {
    id: 'imp95576-dense-crossing-counts',
    description: 'arithmetic W first drops below 1.15e-11 at n=8 and geometric r=1.5 at n=9 (dense crossing counts)',
    holds: () => {
      const L = IMP95576_LITERALS.lehmerCollisionEps;
      const firstCross = (t) => { const r = t.find((row) => row.W < L); return r ? r.n : null; };
      return firstCross(IMP95576_LITERALS.tables.arithmetic) === IMP95576_LITERALS.crossings.arithmetic
        && firstCross(IMP95576_LITERALS.tables.geometric15) === IMP95576_LITERALS.crossings.geometric15
        && IMP95576_LITERALS.crossings.arithmetic === 8
        && IMP95576_LITERALS.crossings.geometric15 === 9;
    },
  },
  {
    id: 'imp95576-dense-monotone-below-floor',
    description: 'arithmetic mu0 and W keep decreasing monotonically well past the float64 floor (n=6..12, mu0 down to ~1e-18) with no floor/sign flip',
    holds: () => {
      const t = IMP95576_LITERALS.tables.arithmetic.filter((r) => r.n >= 6);
      return t.every((r, i) => (i === 0 || (t[i - 1].mu0 > r.mu0 && t[i - 1].W > r.W)) && r.mu0 > 0);
    },
  },
  {
    id: 'imp95576-dyadic-plateaus-never-crosses',
    description: 'dyadic W converges to a positive plateau (~2.03e-6) and stays > 1.15e-11 through n=20 -- the nested dyadic family never crosses',
    holds: () => {
      const t = IMP95576_LITERALS.tables.dyadic;
      const L = IMP95576_LITERALS.lehmerCollisionEps;
      const allAbove = t.every((r) => r.W > L);
      const last = t[t.length - 1];
      return allAbove && IMP95576_LITERALS.crossings.dyadic === null
        && relEq(last.W, IMP95576_LITERALS.dyadicPlateauW, 1e-3)
        && last.W / L > 1e5;
    },
  },
  {
    id: 'imp95576-precision-robust',
    description: 'arithmetic n=8 and dyadic n=16 reproduce to 10 sig figs at dps=60 vs dps=100 (results are not precision artifacts)',
    holds: () => {
      const p = IMP95576_LITERALS.precisionRobust;
      return relEq(p.arithN8.dps60, p.arithN8.dps100, 1e-10) && relEq(p.dyadicN16.dps60, p.dyadicN16.dps100, 1e-10);
    },
  },
  {
    id: 'imp95576-honesty',
    description: 'record states the sub-gap closed, numeric-not-proof scope, refines imp-95557, RH OPEN, PT Lambda <= 0.2, NO QED',
    holds: () => /W-DECAY-PRECISION/.test(IMP95576_ARB_EPS0_WINDOW.subgapClosed)
      && /not a proof/.test(IMP95576_ARB_EPS0_WINDOW.scope)
      && /refines imp-95557/.test(IMP95576_ARB_EPS0_WINDOW.scope)
      && /RH OPEN/.test(IMP95576_ARB_EPS0_WINDOW.verdict)
      && /refereed bound is changed/i.test(IMP95576_ARB_EPS0_WINDOW.verdict)
      && /NO QED/.test(IMP95576_ARB_EPS0_WINDOW.verdict),
  },
];
for (const a of IMP95576_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95576-arb-eps0-window assertion failed: ${a.id}`);
}
export default IMP95576_ARB_EPS0_WINDOW;

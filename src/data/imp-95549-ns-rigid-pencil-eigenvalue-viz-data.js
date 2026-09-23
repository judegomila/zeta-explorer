/**
 * @fileoverview imp-95549 viz data: the imp-95530 THEOREM NS-RIGID (A4)(i)
 * dichotomy witness, reader-facing. Import-light (baked literals only, no
 * heavy modules); reproduces flowedPickPencilMin(S, eps) from
 * src/data/imp-95530-native-span-arithmetic-input-rigidity.js verbatim on a
 * log-spaced eps grid for the node set S = {1.5, 2.5, 4.5} (nu = {1,2,4}).
 * NOT a bound; NO QED.
 */

export const LEHMER_COLLISION_EPS = 1.15e-11;

// lam_min(P_S(eps); G) for S = {1.5, 2.5, 4.5} (nu = {1,2,4}), eps log-spaced
// from 1e-12 to 1e2. Recomputed from imp-95530 flowedPickPencilMin; matches
// the module's baked eps=0 / eps=100 literals (3.2421e-5 / 3.0244e-8) to 4
// digits. Stays strictly positive across the whole grid -- PSD through TEN
// ORDERS OF MAGNITUDE past the Lehmer-pair collision threshold at eps =
// 1.15e-11 (dashed vertical line on the chart).
export const NS_RIGID_PENCIL_EIGENVALUE_ROWS = Object.freeze([
  { eps: 1e-12, lam: 3.242101e-5 },
  { eps: 3.162278e-12, lam: 3.242101e-5 },
  { eps: 1e-11, lam: 3.242101e-5 },
  { eps: 3.162278e-11, lam: 3.242101e-5 },
  { eps: 1e-10, lam: 3.242101e-5 },
  { eps: 3.162278e-10, lam: 3.242101e-5 },
  { eps: 1e-9, lam: 3.242101e-5 },
  { eps: 3.162278e-9, lam: 3.242101e-5 },
  { eps: 1e-8, lam: 3.242101e-5 },
  { eps: 3.162278e-8, lam: 3.242101e-5 },
  { eps: 1e-7, lam: 3.242101e-5 },
  { eps: 3.162278e-7, lam: 3.242101e-5 },
  { eps: 1e-6, lam: 3.242101e-5 },
  { eps: 3.162278e-6, lam: 3.242100e-5 },
  { eps: 1e-5, lam: 3.242098e-5 },
  { eps: 3.162278e-5, lam: 3.242090e-5 },
  { eps: 1e-4, lam: 3.242065e-5 },
  { eps: 3.162278e-4, lam: 3.241986e-5 },
  { eps: 1e-3, lam: 3.241738e-5 },
  { eps: 3.162278e-3, lam: 3.240952e-5 },
  { eps: 1e-2, lam: 3.238468e-5 },
  { eps: 3.162278e-2, lam: 3.230627e-5 },
  { eps: 1e-1, lam: 3.205969e-5 },
  { eps: 3.162278e-1, lam: 3.129351e-5 },
  { eps: 1e0, lam: 2.900067e-5 },
  { eps: 3.162278e0, lam: 2.288865e-5 },
  { eps: 1e1, lam: 1.124714e-5 },
  { eps: 3.162278e1, lam: 1.652041e-6 },
  { eps: 1e2, lam: 3.024365e-8 },
]);

export const NS_RIGID_PENCIL_EIGENVALUE_SUMMARY = Object.freeze({
  nodeSet: '{1.5, 2.5, 4.5} (nu = {1,2,4})',
  lehmerCollisionEps: LEHMER_COLLISION_EPS,
  lamAtEps0: 3.242101e-5,
  lamAtLehmerThreshold: 3.242101e-5,
  lamAtEps100: 3.024365e-8,
  ordersOfMagnitudePastThreshold: Math.log10(1e2 / LEHMER_COLLISION_EPS),
});

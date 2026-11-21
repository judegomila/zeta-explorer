/**
 * imp-96564 — LEG (E) VERIFICATION RECIPE + PER-ENTRY QUADRATURE ERROR BUDGET for the Route I
 * D_S <= L_S certificate (rh-route-i-uncertainty-concentration-certificate-2026-09-24;
 * imp-96544-route-i-ds-le-ls-interval-port-triage). imp-96544 ported legs (B) floor lemma and
 * (D) Bernstein tail to rigorous interval arithmetic, reducing the whole double-precision theorem
 * W(h) >= 9.04e-4 ||h||^2 (pole-free h, 2a <= ln 3) to exactly ONE un-enclosed leg (E): a verified
 * lower bound on the constrained Galerkin smallest eigenvalue lambda_min(K_N|V_N) of absolute
 * accuracy < 9e-4. imp-96544 named leg (E) an "Arb-scale computation" but did NOT specify the
 * verification method or quantify the per-entry accuracy it demands. This module supplies both:
 * a rigorous recipe (Weyl perturbation + Rump verified Cholesky) and the per-entry quadrature
 * ERROR BUDGET it forces, turning leg (E) from "resists a lightweight enclosure" into a concrete,
 * checkable numeric target. This module does NOT run the Arb computation and does NOT produce an
 * actual verified eigenvalue enclosure -- it is the rigorous reduction of leg (E) to a per-entry
 * tolerance, an HONEST PARTIAL. Fixed-window positivity implies nothing about RH; RH open; NO QED.
 *
 * THE RECIPE (standard rigorous smallest-eigenvalue lower bound, no eigensolve trusted).
 * Per parity sector, let A = K_N|V_N be the exact (real-symmetric, dimension d) constrained
 * Galerkin matrix, whose entries are the oscillatory analytic integrals
 *   A_mn = (2a/pi) eps_m eps_n sqrt((2m+1)(2n+1)) int_0^T (w(t) - m_T) j_m(a t) j_n(a t) dt,
 * compressed onto the pole-free constraint complement V_N = V cap range P_N. Two rigorous steps:
 *   (1) ENTRY ENCLOSURE. With Arb acb_calc_integrate (a certified quadrature error bound) enclose
 *       each entry as A_mn in [Atilde_mn - r_mn, Atilde_mn + r_mn], Atilde the floating midpoint,
 *       r_mn the half-width. The error matrix E = A - Atilde is symmetric with |E_mn| <= r_mn, so
 *       a RIGOROUS spectral bound is the max absolute row sum (symmetric => ||E||_2 <= ||E||_inf):
 *           ||E||_2 <= max_m sum_n r_mn <= d * r_max,   r_max = max_mn r_mn.
 *   (2) VERIFIED FLOOR OF THE MIDPOINT MATRIX. Certify a rigorous lower bound s <= lambda_min(Atilde)
 *       by a Rump/interval Cholesky of (Atilde - s I): if the verified factorisation succeeds the
 *       shifted matrix is positive semidefinite, hence lambda_min(Atilde) >= s. (s is chosen just
 *       below the floating lambda_min(Atilde); the verification loss eps_chol ~ ulp * cond is tiny.)
 * Weyl's inequality (A = Atilde + E, both symmetric) gives lambda_min(A) >= lambda_min(Atilde) +
 * lambda_min(E) >= s - ||E||_2 >= s - d * r_max, and the operator tail from imp-96544/Lemma D adds
 * -2 ||K Q_N|| (<= 6.6e-24 at N=320, <= 1e-10 at N=160). The certificate closes when this rigorous
 * lower bound clears the imp-96544 threshold -0.8067765722222 (T=400) / -0.1136286103 (T=200).
 *
 * THE PER-ENTRY ERROR BUDGET (tmp/imp-96564-budget.mjs, doubles cross-checked below).
 * Available slack = double lambda_min(K_N|V_N) - threshold = the certificate margin:
 *   T=400,N=320: lambda_min = -0.8058722, threshold = -0.8067766, margin = 9.0437e-4, d ~ 160.
 *   T=200,N=160: lambda_min = -0.1128081, threshold = -0.1136286, margin = 8.2047e-4, d ~ 80.
 * Requiring s - d r_max - 2||K Q_N|| >= threshold with s ~ lambda_min(Atilde) (eps_chol and the
 * tail both negligible against ~9e-4) yields the SUFFICIENT per-entry half-width
 *       r_max <= margin / d  =  5.65e-6 (T=400)  /  1.03e-5 (T=200).
 * VERDICT: leg (E) is FEASIBLE, and the binding constraint is NOT quadrature accuracy. Arb
 * acb_calc_integrate routinely certifies analytic oscillatory integrals to absolute half-width
 * ~1e-15, roughly TEN orders of magnitude below the 5.65e-6 the eigenvalue budget demands; even a
 * coarse tolerance clears it. The residual for a full interval proof is therefore ENGINEERING --
 * assembling the d x d/sector Arb entry sweep and the Rump verified-Cholesky floor -- not an
 * accuracy obstruction. The stated tolerance scales as margin/d: it TIGHTENS linearly in the
 * matrix dimension d (roughly N/2 per sector) and LOOSENS with the T-sequence (margin ~ C/T grows
 * with T while d ~ 0.8 T, so r_max ~ C/(0.8 T^2) shrinks) -- so the largest feasible-window T sets
 * the smallest tolerance; at (T,N) = (400,320) it is a comfortable 5.65e-6.
 *
 * SUB-GAP imp-96564-arb-galerkin-sweep: this module specifies the method and the per-entry
 * tolerance but does NOT execute the Arb entry enclosures or the verified Cholesky; producing the
 * actual certified lambda_min(K_N|V_N) enclosure (and thus a rigorous W >= 9.04e-4 ||h||^2) remains
 * the concrete residual. Nothing here localises a zero or moves a Lambda bound or verified height;
 * no refereed bound is changed; RH open; NO QED.
 */

import { IMP96544_INTERVAL_LEGS } from './imp-96544-route-i-ds-le-ls-interval-port-triage.js';

/** the leg-(E) verification recipe and per-entry quadrature error budget (doubles cross-checked in assertions) */
export const IMP96564_LEG_E_BUDGET = Object.freeze({
  method: 'Weyl perturbation (||E||_2 <= max abs row sum of the entry-radius matrix <= d r_max, E symmetric) + Rump/interval-Cholesky verified floor s <= lambda_min(Atilde), giving lambda_min(A) >= s - d r_max - 2||K Q_N||; entries enclosed by Arb acb_calc_integrate with certified quadrature error',
  // per (T,N): certificate constant, interval m_T lower endpoint, baked double m_T, operator tail 2||K Q_N||,
  // resulting threshold, double lambda_min(K_N|V_N), margin, per-sector constrained dim d, per-entry tolerance r_max
  windows: {
    T400N320: {
      certificate: 9.043721e-4, mTlower: 0.80677657222220, mTdouble: 0.80677657222470,
      twoTail: 6.612e-24, threshold: -0.8067765722222, lambdaMinDouble: -0.8058722,
      margin: 9.043721e-4, sectorDim: 160, rMaxPerEntry: 5.65e-6,
    },
    T200N160: {
      certificate: 8.204660e-4, mTlower: 0.11362861040986, mTdouble: 0.11362861041048,
      twoTail: 1e-10, threshold: -0.1136286103, lambdaMinDouble: -0.1128081,
      margin: 8.204659e-4, sectorDim: 80, rMaxPerEntry: 1.03e-5,
    },
  },
  arbRoutineAbsAccuracy: 1e-15,
  headroomOrders: { T400: 9.75, T200: 10.01 },
  toleranceScaling: 'r_max = margin/d; TIGHTENS linearly in the per-sector dim d (~N/2) and, since margin ~ C/T grows while d ~ 0.8 T, r_max ~ C/(0.8 T^2) shrinks with T -- the largest feasible-window T sets the smallest tolerance',
  verdict: 'leg (E) is FEASIBLE and quadrature-accuracy is NOT binding: the required per-entry half-width 5.65e-6 (T=400) is ~10 orders above Arb acb_calc_integrate routine accuracy ~1e-15; the residual is assembling the Arb entry sweep + Rump verified Cholesky, not achieving accuracy',
  subGap: 'imp-96564-arb-galerkin-sweep: execute the d x d/sector Arb entry enclosures + verified-Cholesky floor to emit the actual certified lambda_min(K_N|V_N) enclosure; NOT done here',
});

export const IMP96564_ROUTE_I_GALERKIN_EIGENVALUE_VERIFICATION_RECIPE = Object.freeze({
  id: 'imp-96564-route-i-galerkin-eigenvalue-verification-recipe',
  parents: [
    'src/data/imp-96544-route-i-ds-le-ls-interval-port-triage.js',
    'src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js',
  ],
  status: 'PARTIAL (honest): supplies the rigorous method AND the per-entry accuracy budget for leg (E), the single un-enclosed leg of the Route I D_S <= L_S certificate after imp-96544. RECIPE: per sector, enclose each oscillatory Galerkin entry A_mn in [Atilde_mn +/- r_mn] via Arb acb_calc_integrate; the symmetric error matrix obeys ||A - Atilde||_2 <= max abs row sum <= d r_max; a Rump/interval-Cholesky of (Atilde - s I) certifies lambda_min(Atilde) >= s; Weyl then gives lambda_min(K_N|V_N) >= s - d r_max - 2||K Q_N||. BUDGET: clearing the imp-96544 threshold needs per-entry half-width r_max <= margin/d = 5.65e-6 (T=400,N=320, d~160) / 1.03e-5 (T=200,N=160, d~80) -- roughly 10 orders LOOSER than Arb routine accuracy ~1e-15. VERDICT: leg (E) is feasible and NOT accuracy-bound; the residual (SUB-GAP imp-96564-arb-galerkin-sweep) is engineering the Arb entry sweep + verified Cholesky, which this module does NOT execute. No actual verified eigenvalue enclosure is produced here. Fixed-window positivity implies nothing about RH; RH open; no refereed bound is changed; NO QED',
  honestLimits: 'the recipe (Weyl + Rump verified Cholesky) and the row-sum spectral bound are standard and rigorous, and the margin/d budget is doubles-exact; but no Arb entry enclosure or verified Cholesky is RUN here, so no certified lambda_min(K_N|V_N) enclosure (and hence no interval-rigorous W >= 9.04e-4 ||h||^2) is produced -- only the tolerance leg (E) must hit is derived. The per-sector dim d ~ 160 is used as a conservative upper estimate on the constrained dimension (a larger d only tightens the stated r_max, so the budget is SUFFICIENT). eps_chol (verified-Cholesky loss) and the operator tail 2||K Q_N|| are both negligible against the ~9e-4 margin. Nothing localises a zero or changes any Lambda bound or verified height; RH open; NO QED',
});

export default IMP96564_ROUTE_I_GALERKIN_EIGENVALUE_VERIFICATION_RECIPE;

// ---- assertions (all fast; recompute the budget arithmetic from the imp-96544 system-of-record literals)
const B = IMP96564_LEG_E_BUDGET;
export const IMP96564_ROUTE_I_GALERKIN_EIGENVALUE_VERIFICATION_RECIPE_ASSERTIONS = Object.freeze([
  {
    id: 'imp96564-budget-consistent-with-imp96544',
    description: 'the T=400 threshold, double eigenvalue and margin reproduce the imp-96544 system-of-record reduction literals (thresholdLowerBound, doubleEigenvalue, marginAboveThreshold) to their printed precision',
    holds: () => {
      const R = IMP96544_INTERVAL_LEGS.reduction, w = B.windows.T400N320;
      return Math.abs(w.threshold - R.thresholdLowerBound) < 1e-12
        && Math.abs(w.lambdaMinDouble - R.doubleEigenvalue) < 1e-6
        && Math.abs(w.margin - R.marginAboveThreshold) < 1e-7
        && Math.abs(w.mTlower - IMP96544_INTERVAL_LEGS.floorLemma.mT400[0]) < 1e-12;
    },
  },
  {
    id: 'imp96564-per-entry-tolerance-arithmetic',
    description: 'for each window the derived per-entry half-width equals margin/d to 2%, the threshold equals -(m_T lower) + 2 tail, and the margin equals the double lambda_min minus the threshold (the full leg-(E) budget chain)',
    holds: () => {
      return Object.values(B.windows).every((w) => {
        const thr = -w.mTlower + w.twoTail;
        const margin = w.lambdaMinDouble - thr;
        const rMax = margin / w.sectorDim;
        return Math.abs(thr - w.threshold) < 1e-9
          && Math.abs(margin - w.margin) < 5e-6
          && Math.abs(rMax - w.rMaxPerEntry) / w.rMaxPerEntry < 0.02;
      });
    },
  },
  {
    id: 'imp96564-feasibility-headroom',
    description: 'the required per-entry tolerance is many orders above Arb routine accuracy 1e-15 (headroom > 9 orders in both windows), so leg (E) is accuracy-feasible; T=400 demands a TIGHTER tolerance than T=200 (larger d, r_max ~ C/T^2)',
    holds: () => {
      const h400 = Math.log10(B.windows.T400N320.rMaxPerEntry / B.arbRoutineAbsAccuracy);
      const h200 = Math.log10(B.windows.T200N160.rMaxPerEntry / B.arbRoutineAbsAccuracy);
      return h400 > 9 && h200 > 9
        && Math.abs(h400 - B.headroomOrders.T400) < 0.2 && Math.abs(h200 - B.headroomOrders.T200) < 0.2
        && B.windows.T400N320.rMaxPerEntry < B.windows.T200N160.rMaxPerEntry;
    },
  },
  {
    id: 'imp96564-verdict-honesty',
    description: 'status/honestLimits record NO QED / RH open, mark leg (E) FEASIBLE but NOT executed here (no verified enclosure produced), name the sub-gap, and state nothing localises a zero',
    holds: () => {
      const M = IMP96564_ROUTE_I_GALERKIN_EIGENVALUE_VERIFICATION_RECIPE;
      return /NO QED/.test(M.status) && /RH open/.test(M.status)
        && /FEASIBLE/.test(B.verdict) && /NOT/.test(B.verdict)
        && /imp-96564-arb-galerkin-sweep/.test(B.subGap)
        && /[Nn]othing localises a zero/.test(M.honestLimits)
        && /no certified lambda_min\(K_N\|V_N\) enclosure/.test(M.honestLimits);
    },
  },
]);

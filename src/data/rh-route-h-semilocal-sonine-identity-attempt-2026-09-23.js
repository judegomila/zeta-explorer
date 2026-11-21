/**
 * rh-route-h-semilocal-sonine-identity-attempt (2026-09-23) — the NEXT STEP named by
 * rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js (Test 2 verdict) and by the
 * A-G sweep synthesis routeH.verdict: ATTEMPT the semilocal S = {oo, 2} Sonine trace
 * identity on g-support < ln 3, to try to extend the proven archimedean Weil positivity
 * past the first prime shift u = ln 2, or record the precise obstruction. Result: the
 * identity is EXACT but CIRCULAR, and the p = 2 place cannot supply the missing positivity
 * because it is a sign-indefinite rank-limited shift that helps only the NON-binding sector.
 * RH OPEN; no refereed bound is changed; NO QED.
 *
 * THE CANDIDATE IDENTITY. The Connes-Consani archimedean Sonine identity writes the
 * archimedean Weil term plus the poles as a manifestly positive trace,
 *   W_oo(g) + [pole term] = Tr(Q_oo vartheta(g) Q_oo),
 * with Q_oo the projection complementary to the archimedean prolate/Sonine space; that is
 * what proves Weil positivity for g-support inside the first shift (in-repo anchor
 * imp-95520 class II / Route A; here the archimedean-only form is positive up to
 * g-support 2 a_* = 0.743 (odd) / 0.820 (even), a_* = 0.3716 / 0.4101, from the route-H
 * module). The semilocal S = {oo, 2} extension replaces vartheta by the joint scaling flow
 * U(lambda) on X_S = (R x Q_2)/{+-2^n} and Q_oo by Q_S = Q_oo (x) Q_2. By the semilocal
 * Guillemin-Sternberg trace formula (Connes 1999) its trace is EXACTLY
 *   Tr(Q_S vartheta(g) Q_S) = W_oo(g) + W_2(g) + [pole term].
 *
 * WHAT THE p = 2 FACTOR ACTUALLY CONTRIBUTES (derived, verified). For g = h * h~ with
 * h in L^2(-a, a) and (ln 2)/2 < a <= (ln 3)/2, the 2-adic Weil distribution collapses to
 * its single k = 1 term, because g is supported in (-2a, 2a) and 2 ln 2 > 2a, ln 3 >= 2a:
 *   W_2(g) = (ln 2) 2^{-1/2} [g(ln 2) + g(-ln 2)] = sqrt(2) (ln 2) g(ln 2),  g(ln 2) = <h, S_{ln2} h>.
 * Verified from the route-H assembly: (i) NO prime other than 2 enters below (ln 3)/2
 * (primeTerms has the single key 2 at a = 0.36, 0.45, 0.50, (ln 3)/2), and (ii) the whole
 * assembled Prime matrix equals (ln 2 / sqrt 2) fsMat(ln 2) to machine zero. So the 2-adic
 * factor of the semilocal trace is EXACTLY one compressed shift S_{ln2} on L^2(-a,a)
 * (nilpotent of order 2) -- a rank-limited, self-adjoint, but SIGN-INDEFINITE operator.
 *
 * DOES THE p = 2 TERM SUPPLY THE MISSING POSITIVITY (the ticket question)? NO.
 *  (a) It is sign-indefinite across parity sectors. On the EVEN-sector minimizer at a = 0.5
 *      it is +1.25e-2 (it SUBTRACTS from W = W_oo + poles - P_2, i.e. it works AGAINST
 *      positivity); on the ODD-sector minimizer at a = 0.4 it is -6.14e-2 (it ADDS, and
 *      rescues the odd sector past a_* = 0.3716). A sign-indefinite operator cannot be a
 *      one-sided positivity supplier.
 *  (b) The binding constraint is the EVEN sector -- exactly where p = 2 has the wrong sign.
 *      At a = 0.5 the full-form lambda_min is 9.4e-7 in the even sector, 200x smaller than
 *      1.96e-4 in the odd. So the sector that decides positivity is the one the second
 *      direction hurts, not helps.
 *
 * THE IDENTITY IS EXACT BUT CIRCULAR (the precise obstruction). By the explicit formula
 *   Tr(Q_S vartheta(g) Q_S) = W_oo(g) + W_2(g) + poles = Sum_gamma |hhat(gamma)|^2   (RH-true),
 * so its positivity on g-support < ln 3 IS Weil positivity on that support: proving it
 * unconditionally is proving RH there, not reducing it. The even-sector residual after the
 * archimedean-vs-(p=2) cancellation (lambda_min / P_2 = 7.6e-5 at a = 0.5) is precisely
 * that zero-side sum. The second (2-adic) direction supplies structure (the exact single
 * shift), not an independent inequality.
 *
 * SUB-GAP (named, not closed). Because the p = 2 place cannot supply the even-sector
 * positivity (wrong sign), the ONLY remaining route to g-support < ln 3 is a purely
 * ARCHIMEDEAN one: extend the prolate factorization Q_oo vartheta Q_oo >= 0 from its sharp
 * even range 2 a_* = 0.820 to 2a = ln 3 = 1.099. Equivalently, prove
 *   W_oo(g) + poles >= sqrt(2) (ln 2) g(ln 2)   for all even h in L^2(-a, a), a <= (ln 3)/2.
 * This is strictly stronger than the Connes-Consani theorem and is NOT delivered by the
 * semilocal (second-direction) structure. Not reached here.
 *
 * VERDICT: no extension of the proven positivity past u = ln 2; the semilocal Sonine
 * identity is exact but circular; p = 2 is a sign-indefinite rank-limited shift that helps
 * only the non-binding odd sector. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: reuses weilForm / quadForm / parityBlock from the route-H module (which does
 * NOT import the 16.7MB zeros bundle). Assertions recompute the cheap Galerkin forms at
 * N = 24 and check the derived structural facts. Changes no bound.
 */

import { weilForm, quadForm, parityBlock } from './rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';

const LN2 = Math.log(2), LN3 = Math.log(3);

// compact symmetric-matrix smallest eigenpair (Jacobi), local to keep this module self-contained
function symEig(Min) {
  const n = Min.length; const A = Min.map((r) => Array.from(r));
  const V = Array.from({ length: n }, (_, i) => { const r = new Array(n).fill(0); r[i] = 1; return r; });
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = A.map((_, i) => i).sort((i, j) => A[i][i] - A[j][j]);
  return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}

export const RH_ROUTE_H_SEMILOCAL_SONINE = Object.freeze({
  id: 'rh-route-h-semilocal-sonine-identity-attempt-2026-09-23',
  route: 'H (next step) — the semilocal S = {oo, 2} Sonine trace identity on g-support < ln 3',
  parent: 'src/data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js (Test 2 verdict named this step)',
  status: 'ATTEMPTED — the semilocal Sonine identity is EXACT but CIRCULAR (its positivity on g-support < ln 3 is Weil positivity there); the p = 2 place is a sign-indefinite rank-limited shift that helps only the NON-binding odd sector and HURTS the binding even sector; NO extension of the proven positivity past u = ln 2. RH open; no refereed bound is changed; NO QED',
  identity: 'Tr(Q_S vartheta(g) Q_S) = W_oo(g) + W_2(g) + poles, Q_S = Q_oo (x) Q_2, by the semilocal Guillemin-Sternberg trace formula (Connes 1999)',
  p2Structure: 'for (ln 2)/2 < a <= (ln 3)/2 the 2-adic Weil distribution collapses to the single k = 1 term W_2(g) = sqrt(2)(ln 2) g(ln 2), g(ln 2) = <h, S_{ln2} h>; verified: only prime 2 enters below (ln 3)/2 and the assembled Prime matrix equals (ln 2 / sqrt 2) fsMat(ln 2) to machine zero (the 2-adic factor is exactly one compressed shift, nilpotent of order 2, sign-indefinite)',
  supplyPositivity: 'NO: the p = 2 term is +1.25e-2 on the even minimizer at a = 0.5 (subtracts / works against positivity) but -6.14e-2 on the odd minimizer at a = 0.4 (adds / rescues the odd sector); the BINDING sector is the even one (full-form lambda_min 9.4e-7 vs 1.96e-4 odd at a = 0.5), exactly where p = 2 has the wrong sign',
  obstruction: 'the identity is exact but CIRCULAR: Tr(Q_S vartheta(g) Q_S) = Sum_gamma |hhat(gamma)|^2 on g-support < ln 3, so its positivity IS Weil positivity there; the even-sector residual after the archimedean-vs-(p=2) cancellation (lambda_min / P_2 = 7.6e-5 at a = 0.5) is that zero-side sum. The second direction gives an exact shift, not an independent inequality',
  subGap: 'the only remaining route to g-support < ln 3 is purely ARCHIMEDEAN: extend Q_oo vartheta Q_oo >= 0 from its sharp even range 2 a_* = 0.820 to 2a = ln 3 = 1.099, i.e. prove W_oo(g) + poles >= sqrt(2)(ln 2) g(ln 2) for all even h in L^2(-a, a), a <= (ln 3)/2 -- strictly stronger than Connes-Consani, NOT supplied by the 2-adic direction; not reached',
  verdict: 'no extension of the proven positivity past u = ln 2 by the semilocal (second-direction) structure; the Sonine identity is exact but circular; p = 2 is a sign-indefinite rank-limited shift that helps only the non-binding odd sector. RH open; no refereed bound is changed; NO QED',
  honestLimits: 'double-precision Legendre Galerkin at N = 24 (converged to < 1% of the route-H N = 32 baseline for a <= 0.6); the a_* and lambda_min quoted are finite-dimensional Rayleigh-Ritz values (upper bounds on the true infima); the identity structure Q_S = Q_oo (x) Q_2 and the collapse to the single shift are exact algebra, but the archimedean prolate positivity range a_* is a computed (not proven-sharp) value; nothing here moves a Lambda bound or verified height',
});

// ---- assertions (cheap: N = 24, weilForm cached in the route-H module)
export const RH_ROUTE_H_SEMILOCAL_SONINE_ASSERTIONS = Object.freeze([
  {
    id: 'S1-only-p2-and-exact-single-shift',
    description: 'for (ln2)/2 < a <= (ln3)/2 the semilocal trace 2-adic factor is exactly one compressed shift: primeTerms has the single key 2 at a = 0.36, 0.45, 0.50, (ln3)/2, and the assembled Prime matrix equals (ln2/sqrt2) fsMat(ln2) to < 1e-12',
    holds: () => {
      const onlyP2 = [0.36, 0.45, 0.5, LN3 / 2].every((a) => {
        const keys = Object.keys(weilForm(a, 24).primeTerms); return keys.length === 1 && keys[0] === '2';
      });
      const wf = weilForm(0.5, 24); const wq = LN2 / Math.SQRT2; const FSq = wf.fsMat(LN2);
      let maxd = 0; for (let m = 0; m < wf.N; m++) for (let n = 0; n < wf.N; n++) maxd = Math.max(maxd, Math.abs(wf.Prime[m][n] - wq * FSq[m][n]));
      return onlyP2 && maxd < 1e-12;
    },
  },
  {
    id: 'S2-p2-sign-indefinite-across-sectors',
    description: 'the p = 2 term is sign-indefinite on the sector minimizers: > 0 on the even minimizer at a = 0.5 (subtracts, hurts positivity) and < 0 on the odd minimizer at a = 0.4 (adds, rescues the odd sector)',
    holds: () => {
      const we = weilForm(0.5, 24); const ce = symEig(parityBlock(we.W, 0)).vecs[0]; const p2even = quadForm(parityBlock(we.Prime, 0), ce);
      const wo = weilForm(0.4, 24); const co = symEig(parityBlock(wo.W, 1)).vecs[0]; const p2odd = quadForm(parityBlock(wo.Prime, 1), co);
      return p2even > 5e-3 && p2odd < -3e-2;
    },
  },
  {
    id: 'S3-even-sector-binds-and-cancellation-is-zero-side',
    description: 'the binding sector is even: at a = 0.5 the full-form lambda_min is smaller in the even sector than the odd, both positive, and the even lambda_min / P_2 ratio is < 2e-4 (the archimedean-vs-p2 cancellation = the zero-side residual)',
    holds: () => {
      const wf = weilForm(0.5, 24);
      const ee = symEig(parityBlock(wf.W, 0)); const eo = symEig(parityBlock(wf.W, 1));
      const p2even = quadForm(parityBlock(wf.Prime, 0), ee.vecs[0]);
      return ee.vals[0] > 0 && eo.vals[0] > 0 && ee.vals[0] < eo.vals[0] && ee.vals[0] / p2even < 2e-4;
    },
  },
  {
    id: 'verdict-honesty',
    description: 'the finding records RH open / NO QED / exact-but-circular identity / no extension past ln 2, and names the archimedean sub-gap without claiming it',
    holds: () => /RH open/.test(RH_ROUTE_H_SEMILOCAL_SONINE.status) && /NO QED/.test(RH_ROUTE_H_SEMILOCAL_SONINE.status)
      && /CIRCULAR/.test(RH_ROUTE_H_SEMILOCAL_SONINE.status) && /NO extension/.test(RH_ROUTE_H_SEMILOCAL_SONINE.status)
      && /not reached/.test(RH_ROUTE_H_SEMILOCAL_SONINE.subGap) && /circular/i.test(RH_ROUTE_H_SEMILOCAL_SONINE.obstruction),
  },
]);

export default RH_ROUTE_H_SEMILOCAL_SONINE;

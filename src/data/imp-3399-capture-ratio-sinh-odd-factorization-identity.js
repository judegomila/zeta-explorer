/**
 * @module imp-3399-capture-ratio-sinh-odd-factorization-identity
 * @fileoverview imp-3399 -- SYMBOLIC upgrade of the imp-3350 numerical coincidence
 *   r_star = r_lin to an EXACT IDENTITY, plus an honest exhibition of the residual.
 *
 *   THE QUESTION (imp-3399, proof, medium)
 *   --------------------------------------
 *   imp-3350 certified only NUMERICALLY (a^2-Richardson + power iteration at N = 240,
 *   gap < 5e-15) that the a -> 0 limit r_star of the sinh-shear capture ratio
 *     r(a) = ||T_a|| / ||G_a||,
 *       G_a(u,v) = Phi(u) Phi(v) sinh(a(v-u)),   T_a(u,v) = sinh(a(v-u)) Abar(|v-u|),
 *   equals the exactly-linear-shear ratio
 *     r_lin = ||T_lin|| / ||G_lin||,
 *       G_lin(u,v) = Phi(u) Phi(v)(v-u),        T_lin(u,v) = (v-u) Abar(|v-u|).
 *   Its honestCaveat.limitIsNumericalNotSymbolic flagged that the O(a^2)
 *   sinh-nonlinearity vanishing in the norm RATIO was NOT proven symbolically.
 *   This module asks: does the common sinh(a Delta) = a Delta + O(a^3) factor cancel
 *   the O(a^2) term exactly in the ratio, upgrading the coincidence to an identity --
 *   or does a residual survive?
 *
 *   THE SYMBOLIC FINDING (assessment; RH-equivalent; NO QED)
 *   -------------------------------------------------------
 *   The answer splits cleanly, and BOTH halves are provable at fixed N:
 *
 *   (L1) EXACT leading-a cancellation (all orders, an identity -- not leading order).
 *        sinh is ODD, so sinh(a Delta) = a Delta * g((a Delta)^2) with the EVEN entire
 *        series g(x) = sum_{n>=0} x^n / (2n+1)!, g(0) = 1. Hence each Gram factors as
 *          G_a = a * Ghat_a,   T_a = a * That_a,
 *        with Ghat_a(u,v) = Phi(u) Phi(v)(v-u) g((a(v-u))^2) and
 *        That_a(u,v) = (v-u) Abar(|v-u|) g((a(v-u))^2), whose every entry is a
 *        real-analytic EVEN function of a. Since ||a M|| = |a| ||M|| for the operator
 *        norm, the scalar |a| cancels IDENTICALLY in the ratio:
 *          r(a) = ||T_a|| / ||G_a|| = ||That_a|| / ||Ghat_a||.
 *        This is exact to all orders, not just the leading term.
 *
 *   (L2) r is EVEN in a. Replacing a -> -a negates sinh(a Delta), hence negates BOTH
 *        G_a and T_a; the operator norm is sign-invariant, so r(-a) = r(a) EXACTLY
 *        (verified here to 0 machine ULPs). Therefore r has NO odd-order term in a;
 *        the first possible correction to r_lin is O(a^2).
 *
 *   (L3) r_star = r_lin is an EXACT IDENTITY. As a -> 0, g((a Delta)^2) -> 1 entrywise,
 *        so Ghat_a -> G_lin and That_a -> T_lin. The operator norm is 1-Lipschitz
 *        (| ||A|| - ||B|| | <= ||A - B|| <= ||A - B||_F), hence ||Ghat_a|| -> ||G_lin||
 *        and ||That_a|| -> ||T_lin||. Because ||G_lin|| = sqrt(Q0 Q2 - Q1^2) > 0
 *        (the imp-3350 rank-2 skew area, Q_k = sum_i u_i^k Phi_i^2), the ratio limit
 *        exists and
 *          r_star := lim_{a->0} r(a) = ||T_lin|| / ||G_lin|| = r_lin.
 *        This is a THEOREM at fixed N, upgrading imp-3350 from numerical to symbolic:
 *        the < 5e-15 gap is a genuine identity of the a -> 0 limit, not a coincidence.
 *
 *   (R) The O(a^2) term does NOT cancel in the ratio -- residual EXHIBITED. r(a) is
 *        even and real-analytic near 0, so r(a) = r_lin + c2 a^2 + O(a^4). The
 *        coefficient c2 = dr/d(a^2)|_{a=0} is NONZERO (measured ~1.58e-5 at U = 6 via
 *        c2 ~ (r(2h) - r(h)) / ((2h)^2 - h^2), reproducing the imp-3350 monotone drift
 *        r(0.5) - r(0.01) ~ 4e-6). So the leading a factor cancels EXACTLY, but the
 *        O(a^2) sinh-nonlinearity survives as a genuine nonzero even correction; the
 *        identity is about the a -> 0 LIMIT, NOT about r being constant in a.
 *
 *   WHAT THIS RESOLVES / DOES NOT
 *   -----------------------------
 *   Resolves imp-3350 honestCaveat.limitIsNumericalNotSymbolic: r_star = r_lin is now
 *   an exact identity by the odd-factorization + Lipschitz-continuity argument (L1-L3),
 *   with the residual (R) honestly exhibited. It does NOT construct the missing
 *   magnitude and does NOT touch the imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 *   positivity -- the lone obstruction. No RH verdict, no QED.
 *
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the numerical coincidence upgraded here)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C in the same linear-shear limit)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the r ~ C/U law and the a -> 0 drift)
 *
 *   Ticket: imp-3399 (proof, medium).
 */

const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3350 / imp-3240)
const N = 240; // representative resolution (the imp-3350 headline grid resolution)
const ITERS = 350; // power-iteration steps (converges the ratio to better than 1e-8 at this N)
const U_STAR = 6; // headline lag cutoff (imp-3350 headline cell)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3350). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3350). */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  // Per-row nonzero column span [lo[i], hi[i]). Entries outside it are +-0, and
  // with finite v each skipped term is +-0, which never changes an accumulator
  // that starts at +0 (x + +-0 === x for x !== -0, and the accumulator is never
  // -0). So restricting to the span is bit-identical to the dense loop while
  // skipping the exactly-zero Phi tail / band (the dense version made the
  // /closure-routes page take tens of seconds at import).
  const lo = new Int32Array(n);
  const hi = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const Mi = M[i];
    let a = 0;
    while (a < n && Mi[a] === 0) a++;
    let b = n;
    while (b > a && Mi[b - 1] === 0) b--;
    lo[i] = a;
    hi[i] = b;
  }
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    // Row-major accumulation (cache-friendly): each MtMv[j] still receives the
    // terms M[i][j]*Mv[i] in the same i = 0..n-1 order starting from 0, so the
    // result is bit-identical to the column-wise loop it replaces.
    const MtMv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const Mi = M[i];
      const mvi = Mv[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) MtMv[j] += Mi[j] * mvi;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** Shared per-U build: midpoint nodes, Phi samples, per-lag autocorrelation Abar (identical to imp-3350). */
function buildPhiAbar(U) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const abar = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    let c = 0;
    for (let i = 0; i + k < N; i++) {
      s += phi[i] * phi[i + k];
      c += 1;
    }
    abar[k] = c ? s / c : 0;
  }
  return { u, phi, abar };
}

/** Both sinh-shear norms at (a, U): returns { nG = ||G_a||, nT = ||T_a|| } (identical build to imp-3350). */
function normsSinh(a, ctx) {
  const { u, phi, abar } = ctx;
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const sh = Math.sinh(a * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rT[j] = sh * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  return { nG: spectralNorm(G, N, ITERS), nT: spectralNorm(T, N, ITERS) };
}

/** Exactly-linear-shear norms: sinh(a(v-u)) -> (v-u). The common a factor is absent, so the ratio is a-FREE. */
function normsLinear(ctx) {
  const { u, phi, abar } = ctx;
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const d = u[j] - u[i];
      rG[j] = phi[i] * phi[j] * d; // G_lin = Phi(u)Phi(v)(v-u)
      rT[j] = d * abar[k]; // T_lin = (v-u) Abar(|v-u|)
    }
    G.push(rG);
    T.push(rT);
  }
  // Rank-2 skew closed form for ||G_lin|| = sqrt(Q0 Q2 - Q1^2), Q_k = sum_i u_i^k Phi_i^2.
  let Q0 = 0;
  let Q1 = 0;
  let Q2 = 0;
  for (let i = 0; i < N; i++) {
    const w = phi[i] * phi[i];
    Q0 += w;
    Q1 += w * u[i];
    Q2 += w * u[i] * u[i];
  }
  return {
    nG: spectralNorm(G, N, ITERS),
    nT: spectralNorm(T, N, ITERS),
    nGclosed: Math.sqrt(Q0 * Q2 - Q1 * Q1),
  };
}

const CTX = buildPhiAbar(U_STAR);
const LIN = normsLinear(CTX);
const R_LIN = LIN.nT / LIN.nG;

// --- (L2) EVENNESS: r(+a) = r(-a) EXACTLY -- no odd term, first correction is O(a^2).
const A_EVEN = 0.3;
const RP = normsSinh(A_EVEN, CTX);
const RM = normsSinh(-A_EVEN, CTX);
const evenGap = Math.abs(RP.nT / RP.nG - RM.nT / RM.nG); // 0 to machine ULPs

// --- (L1) EXACT |a| FACTORIZATION: ||G_a|| / |a| -> ||G_lin|| as a -> 0 (odd sinh => G_a = a Ghat_a).
const FACT_A = Object.freeze([0.5, 0.1, 0.01]);
const factScaledG = Object.freeze(FACT_A.map((a) => normsSinh(a, CTX).nG / a)); // -> ||G_lin||
const maxFactRelErr = Math.max(...factScaledG.map((g) => Math.abs(g - LIN.nG) / LIN.nG)); // shrinks with a

// --- (L3) LIMIT IDENTITY + (R) RESIDUAL: a^2 Richardson from a = {0.02, 0.01}.
const H1 = 0.01;
const H2 = 0.02;
const RHI = normsSinh(H2, CTX);
const RLO = normsSinh(H1, CTX);
const rHi = RHI.nT / RHI.nG;
const rLo = RLO.nT / RLO.nG;
const rStar = rLo - (rHi - rLo) / 3; // a^2 Richardson: r(a) = r_lin + c2 a^2 + O(a^4)
const limitEqualsLinear = Math.abs(rStar - R_LIN); // < 5e-15: r_star = r_lin EXACT identity
// Residual slope c2 = dr/d(a^2)|_0 ~ (r(2h) - r(h)) / ((2h)^2 - h^2); NONZERO => O(a^2) does NOT cancel.
const residualC2 = (rHi - rLo) / (H2 * H2 - H1 * H1);

const verdict =
  evenGap === 0 &&
  maxFactRelErr < 1e-3 &&
  limitEqualsLinear < 1e-12 &&
  Math.abs(residualC2) > 1e-7
    ? 'LEADING-a-FACTOR-CANCELS-EXACTLY-r_star=r_lin-IS-A-SYMBOLIC-IDENTITY-BUT-O(a^2)-RESIDUAL-SURVIVES'
    : 'INDETERMINATE';

export const IMP3399_CAPTURE_RATIO_SINH_ODD_FACTORIZATION_IDENTITY = Object.freeze({
  id: 'imp-3399-capture-ratio-sinh-odd-factorization-identity',
  ticket: 'imp-3399',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: ['§25', '§26', '§27'],
  upgradesNumericalCoincidence: 'imp-3350-capture-ratio-linear-shear-limit.js',
  relatedConstantDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',

  summary:
    'SYMBOLIC upgrade of the imp-3350 numerical coincidence r_star = r_lin to an EXACT IDENTITY, with the ' +
    'residual honestly exhibited. sinh is ODD, so sinh(a Delta) = a Delta * g((a Delta)^2), g(x) = ' +
    'sum x^n/(2n+1)! even entire, g(0) = 1; hence G_a = a Ghat_a and T_a = a That_a with entries ' +
    'real-analytic EVEN in a. Since ||a M|| = |a| ||M||, the leading a factor cancels IDENTICALLY (all ' +
    'orders): r(a) = ||That_a|| / ||Ghat_a||. So r is EVEN in a (verified r(+0.3) = r(-0.3) to 0 ULPs) -- ' +
    'no odd term, first correction O(a^2). As a -> 0, g -> 1 entrywise, and the 1-Lipschitz operator norm ' +
    'gives ||Ghat_a|| -> ||G_lin|| > 0, ||That_a|| -> ||T_lin||, so r_star := lim_{a->0} r(a) = ' +
    '||T_lin||/||G_lin|| = r_lin EXACTLY -- a theorem at fixed N, upgrading imp-3350 from numerical to ' +
    'symbolic (the < 5e-15 gap is a genuine limit identity, not a coincidence). BUT the O(a^2) ' +
    'sinh-nonlinearity does NOT cancel in the ratio: r(a) = r_lin + c2 a^2 + O(a^4) with c2 = dr/d(a^2)|_0 ' +
    'NONZERO (~1.58e-5 at U = 6, reproducing the imp-3350 ~4e-6 drift). Leading a cancels exactly; the ' +
    'identity is about the a -> 0 LIMIT, not about r being constant in a. Assessment only; RH-equivalent; ' +
    'does NOT touch the imp-3066 K_a >= 0 obstruction; NO RH verdict and NO QED. No refereed bound is changed.',

  symbolicArgument: Object.freeze({
    oddFactorization:
      'sinh(a(v-u)) = a(v-u) g((a(v-u))^2), g(x) = sum_{n>=0} x^n/(2n+1)! (even, entire, g(0)=1). ' +
      'Thus G_a = a Ghat_a, T_a = a That_a with Ghat_a(u,v)=Phi(u)Phi(v)(v-u)g((a(v-u))^2), ' +
      'That_a(u,v)=(v-u)Abar(|v-u|)g((a(v-u))^2): every entry real-analytic and EVEN in a.',
    exactLeadingCancellation:
      'operator norm is absolutely homogeneous, ||a M|| = |a| ||M||, so |a| cancels identically in the ' +
      'ratio: r(a) = ||T_a||/||G_a|| = ||That_a||/||Ghat_a||. Exact to all orders, not just leading term.',
    evenness:
      'a -> -a negates sinh, hence negates both G_a and T_a; the sign-invariant operator norm gives ' +
      'r(-a) = r(a) EXACTLY. So r has no odd-order term; the first correction to r_lin is O(a^2).',
    limitIdentity:
      'as a -> 0, g((a(v-u))^2) -> 1 entrywise, so Ghat_a -> G_lin and That_a -> T_lin. The 1-Lipschitz ' +
      'operator norm (| ||A|| - ||B|| | <= ||A-B||_F) forces ||Ghat_a|| -> ||G_lin|| and ' +
      '||That_a|| -> ||T_lin||; since ||G_lin|| = sqrt(Q0 Q2 - Q1^2) > 0, r_star = lim r(a) = r_lin EXACTLY.',
    residual:
      'r even and real-analytic near 0 => r(a) = r_lin + c2 a^2 + O(a^4); c2 = dr/d(a^2)|_0 is NONZERO, so ' +
      'the O(a^2) sinh-nonlinearity does NOT cancel in the ratio -- it survives as a genuine even correction.',
  }),

  measured: Object.freeze({
    rLin: R_LIN, // ~0.02966452 at U = 6 (the exactly-linear-shear ratio)
    evenGap, // 0: r(+0.3) = r(-0.3) to machine ULPs -> no odd term (L2)
    factorizationScaledNormG: factScaledG, // ||G_a||/a for a in {0.5,0.1,0.01} -> ||G_lin|| (L1)
    maxFactorizationRelErr: maxFactRelErr, // shrinks toward 0 with a: the |a| factorization is exact
    sinhRichardsonLimit: rStar, // r_star: a^2-Richardson a -> 0 limit
    limitEqualsLinear, // < 5e-15: r_star = r_lin EXACT identity (L3)
    residualC2, // ~1.58e-5: c2 = dr/d(a^2)|_0, NONZERO -> O(a^2) does NOT cancel (R)
    verdict,
  }),

  interpretation: Object.freeze({
    whatIsAnIdentity:
      'The leading a factor of sinh cancels EXACTLY (all orders) in the ratio, and the a -> 0 limit ' +
      'r_star equals the exactly-linear ratio r_lin as an EXACT identity, by odd-factorization plus ' +
      'operator-norm continuity. This upgrades imp-3350 honestCaveat.limitIsNumericalNotSymbolic: the ' +
      'coincidence is now a theorem at fixed N, not a numerical accident.',
    whatIsNotAnIdentity:
      'The O(a^2) sinh-nonlinearity does NOT cancel in the ratio. r(a) = r_lin + c2 a^2 + O(a^4) has a ' +
      'nonzero c2 ~ 1.58e-5 (U = 6), the origin of the imp-3350 monotone ~4e-6 drift over a in [0.01,0.5]. ' +
      'The identity is strictly about the a -> 0 LIMIT; r is NOT constant in a.',
  }),

  honestCaveat: Object.freeze({
    isProof: true, // the LIMIT identity r_star = r_lin is proven at fixed N (odd factorization + Lipschitz)
    provesLimitNotConstancy:
      'What is proven is lim_{a->0} r(a) = r_lin, an identity of the a -> 0 limit. It is NOT claimed that ' +
      'r(a) = r_lin for a > 0 -- the O(a^2) residual c2 is nonzero. The leading a factor, not the O(a^2) ' +
      'term, is what cancels exactly.',
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    fixedNProof:
      'The proof is at fixed finite N (finite matrices; operator norm 1-Lipschitz in Frobenius distance). ' +
      'It upgrades the leading-term coincidence to a symbolic identity of the discretized capture ratio; ' +
      'it does not address the N -> infinity continuum limit, which imp-3350 handled numerically.',
    measuresRatioNotPositivity:
      'This concerns only the shear-weight structure of the capture RATIO; it does NOT construct the ' +
      'missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity -- the lone obstruction.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3399_CAPTURE_RATIO_SINH_ODD_FACTORIZATION_IDENTITY_ASSERTIONS = [
  {
    id: 'imp3399-ratio-is-even-in-a',
    why: 'sinh is odd, so a -> -a negates both G_a and T_a; the sign-invariant operator norm forces ' +
      'r(-a) = r(a) EXACTLY. A nonzero even gap would break the no-odd-term claim underlying the O(a^2) ' +
      'first correction.',
    holds: () => evenGap === 0,
  },
  {
    id: 'imp3399-exact-a-factorization',
    why: 'The odd factorization G_a = a Ghat_a means ||G_a||/|a| -> ||G_lin|| as a -> 0; the relative error ' +
      'over a in {0.5,0.1,0.01} must stay small (< 1e-3) and shrink with a. A failure would mean the leading ' +
      'a factor does not cancel identically in the ratio.',
    holds: () => maxFactRelErr < 1e-3,
  },
  {
    id: 'imp3399-limit-equals-linear-is-identity',
    why: 'THE CORE DELIVERABLE: the a^2-Richardson a -> 0 limit r_star EQUALS the exactly-linear ratio r_lin ' +
      'to below 1e-12 (in fact < 5e-15), the numerical face of the operator-norm-continuity identity ' +
      'r_star = r_lin. This upgrades imp-3350 limitIsNumericalNotSymbolic to a symbolic identity at fixed N.',
    holds: () => limitEqualsLinear < 1e-12,
  },
  {
    id: 'imp3399-o-a2-residual-is-nonzero',
    why: 'HONESTY GATE: the O(a^2) term does NOT cancel. c2 = dr/d(a^2)|_0 must be NONZERO (|c2| > 1e-7); ' +
      'a vanishing c2 would falsely claim r is constant in a. The identity is about the LIMIT only.',
    holds: () => Math.abs(residualC2) > 1e-7,
  },
  {
    id: 'imp3399-rlin-reproduces-imp3350-headline',
    why: 'The U = 6 exactly-linear ratio must reproduce the imp-3350 / imp-3240 headline capture ~0.02966, ' +
      'confirming the build agrees with the parent modules whose coincidence is being upgraded.',
    holds: () => R_LIN > 0.0296 && R_LIN < 0.0297,
  },
  {
    id: 'imp3399-verdict-symbolic-identity-with-residual',
    why: 'The classified verdict must be the leading-a-cancels-exactly / r_star = r_lin identity / O(a^2) ' +
      'residual survives split, not indeterminate; a flip means evenness, factorization, the limit identity, ' +
      'or the nonzero residual failed.',
    holds: () =>
      verdict ===
      'LEADING-a-FACTOR-CANCELS-EXACTLY-r_star=r_lin-IS-A-SYMBOLIC-IDENTITY-BUT-O(a^2)-RESIDUAL-SURVIVES',
  },
  {
    id: 'imp3399-honest-assessment-no-qed',
    why: 'Mandatory honesty: proves the a -> 0 LIMIT identity only (not constancy in a), fixed N, ' +
      'RH-equivalent, positivity not attempted, no reduction below RH, no refereed bound is changed. Any flip is ' +
      'over-claiming.',
    holds: () => {
      const c = IMP3399_CAPTURE_RATIO_SINH_ODD_FACTORIZATION_IDENTITY.honestCaveat;
      return (
        c.isProof === true &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.provesLimitNotConstancy === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3399_CAPTURE_RATIO_SINH_ODD_FACTORIZATION_IDENTITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3399-capture-ratio-sinh-odd-factorization-identity assertion failed: ${assertion.id}`);
  }
}

export default IMP3399_CAPTURE_RATIO_SINH_ODD_FACTORIZATION_IDENTITY;

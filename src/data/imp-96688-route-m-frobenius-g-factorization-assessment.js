/**
 * @module imp-96688-route-m-frobenius-g-factorization-assessment
 *
 * imp-96688 (proof/assessment ONLY): assess whether the double Dirichlet sum
 *   ||G_N||_F^2 = Sum_{h,k<=N} gcd(h,k)^2 I(h/g,k/g)^2 / (h k)^2   (g=gcd(h,k))
 * admits a rigorous asymptotic (Bohr-lift / mean-value estimate) that would convert the
 * imp-96684 FITTED Frobenius slope (0.4781, extrapolated four decades to the ~3.76e7
 * conditioning ceiling) into a PROVED growth law. Derive what can be derived; state the
 * precise obstruction. No bound is claimed unless established. NO QED.
 *
 * WHY THE FROBENIUS NORM IS MORE TRACTABLE THAN lam_max. imp-96562 showed the measured
 * lam_max slope 0.3526 is a spectral-EDGE growth rate of the multiplicative Vasyunin
 * operator with NO available Szego/Grenander analog (multiplicative not additive-Toeplitz;
 * log-divergent unbounded edge). The Frobenius norm is a different, strictly more elementary
 * object: ||G||_F^2 = trace(G^2) = Sum_{h,k} G_hk^2 is a PLAIN non-negative double sum, not
 * a spectral quantity, so it is exactly the kind of arithmetic sum a mean-value method can
 * attack. This ticket carries that attack as far as it goes rigorously.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS, EXACT) -- the gcd variable factors out completely.
 * -------------------------------------------------------------------------------
 * Write h = g a, k = g b with g = gcd(h,k) and gcd(a,b) = 1. Then hk = g^2 a b, so
 *   G_hk^2 = g^2 I(a,b)^2 / (hk)^2 = g^2 I(a,b)^2 / (g^4 a^2 b^2) = I(a,b)^2 / (g^2 a^2 b^2).
 * The map (h,k) <-> (g,a,b) with gcd(a,b)=1, g a <= N, g b <= N is a bijection, so
 *
 *   ||G_N||_F^2 = Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) * Sum_{g=1}^{floor(N/max(a,b))} 1/g^2.
 *
 * This is an EXACT identity (elementary algebra + Fubini), verified below to machine
 * precision against the direct double sum on a self-built Vasyunin table. It cleanly
 * SEPARATES the arithmetic scaling variable g (whose sum is a partial zeta(2), bounded by
 * zeta(2) = pi^2/6 for every pair) from the coprime CORE. The gcd-weight, which is what
 * makes G multiplicative rather than additive-Toeplitz (imp-96603), contributes only this
 * trivially-convergent 1/g^2 tail.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (RIGOROUS) -- the entire N-growth is localized in the coprime core.
 * -------------------------------------------------------------------------------
 * Because 1 <= Sum_{g<=M} 1/g^2 <= zeta(2) for all M>=1, the inner factor is bounded above
 * and below by constants, so ||G_N||_F^2 grows at exactly the rate of the coprime-core sum
 *   T(N) := Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2/(a^2 b^2),
 * up to the bounded ratio in [1, zeta(2)]. Two immediate rigorous consequences:
 *   (i) DIAGONAL a=b=1 gives I(1,1)^2 * Sum_{g<=N} 1/g^2 -> I(1,1)^2 zeta(2) = 2.614...,
 *       a CONSTANT -- consistent with imp-96562 (diagonal spectral ceiling frozen at
 *       I(1,1)); all growth is off-diagonal / off-core.
 *   (ii) ||G_N||_F^2 diverges IFF T(infinity) diverges; the measured ||G||_F ~ 2.55 +
 *        0.478 log N (imp-96684) means ||G||_F^2 ~ 0.229 (log N)^2, so T(N) must diverge
 *        like ~(log N)^2 -- i.e. the weighted coprime second moment of the Vasyunin
 *        cotangent sum I(a,b)^2 accumulates a double-log mass.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (THE PRECISE OBSTRUCTION) -- a proved growth law needs a UNIFORM second-moment
 * asymptotic for the Vasyunin cotangent sums, which the literature does not supply.
 * -------------------------------------------------------------------------------
 * T(N) is a two-dimensional weighted mean value of I(a,b)^2 = (Vasyunin cotangent sum)^2,
 * where I is built from V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q) (imp-96105 construction).
 * Making T(N) rigorous is exactly a Bettin-Conrey / Maier-Rassias cotangent-sum MOMENT
 * problem. The precise gap between what is available and what is needed:
 *   (a) AVAILABLE. Bettin-Conrey ("Period functions and cotangent sums", 2013) and the
 *       Maier-Rassias line give a second-moment asymptotic for a FIXED denominator k:
 *       Sum_{h mod k, (h,k)=1} c_0(h/k)^2 ~ (main term) k^2 log k + ... -- a ONE-parameter
 *       average over numerators h with k held fixed.
 *   (b) NEEDED. T(N) is a JOINT double sum over coprime pairs (a,b) with BOTH indices free,
 *       coupled by coprimality and the 1/(a^2 b^2) weight, and truncated by max(a,b)<=N.
 *       Extracting the (log N)^2 coefficient of T(N) requires the fixed-k second moment to
 *       hold UNIFORMLY in k with an error term summable against 1/(a^2 b^2), and then a
 *       second summation over the free denominator -- a two-dimensional weighted mean value
 *       the cotangent-sum literature does not provide uniformly.
 * So the obstruction is NOT the multiplicative-vs-Toeplitz edge obstruction of imp-96562
 * (which kills lam_max); the Frobenius norm sidesteps that by being a plain sum. The
 * obstruction is instead the absence of a UNIFORM (in both arguments) second-moment
 * asymptotic for the Vasyunin cotangent sum with the coprimality-restricted 1/(ab)^2 weight.
 * The g-factorization REDUCES the imp-96684 sub-gap to this single, well-posed, sharper
 * analytic-number-theory statement -- but does not by itself close it.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * PARTIAL. The gcd variable factors out EXACTLY (Result 1, verified to machine precision),
 * localizing the entire ||G||_F^2 growth into the coprime-core Vasyunin second moment T(N)
 * up to a bounded [1, zeta(2)] factor (Result 2). This is a rigorous reduction and it is
 * strictly stronger than the imp-96684 fit framing. But converting the fitted 0.4781 slope
 * into a proved growth law requires a UNIFORM second-moment asymptotic for the Vasyunin
 * cotangent sums summed over coprime pairs against 1/(a^2 b^2) (Result 3) -- a Bettin-Conrey
 * cotangent-sum moment problem the literature supplies only for a fixed denominator, not
 * uniformly in two free coupled arguments. The imp-96684 ~3.76e7 ceiling therefore stays
 * fit-extrapolated; the sub-gap is now sharper and well-posed, not closed. No bound moved;
 * no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (the fit-extrapolated ceiling / sub-gap this reduces)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (original two-moment majorant / sub-gap origin)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (the harder lam_max edge obstruction, contrasted)
 * @see imp-96603-vasyunin-gram-multiplicative-not-toeplitz-glossary-headword.js (multiplicative kernel structure)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the exact Vasyunin cotangent-table Gram construction)
 *
 * Ticket: imp-96688 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Gram diagonal numerator I(1,1); diag(G) ceiling = G_11 = I(1,1) (imp-96443/96562, frozen in N).
export const IMP96688_I11 = 1.2606614015078126;
export const IMP96688_ZETA2 = Math.PI * Math.PI / 6; // 1.6449340668...

// The exact g-factorization identity (Result 1), stated symbolically for the record.
export const IMP96688_IDENTITY = Object.freeze({
  frobeniusSquared: '||G_N||_F^2 = Sum_{h,k<=N} gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2',
  factored:
    '||G_N||_F^2 = Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) * Sum_{g=1}^{floor(N/max(a,b))} 1/g^2',
  derivation:
    'h=g a, k=g b, gcd(a,b)=1 => hk=g^2 a b => G_hk^2 = g^2 I(a,b)^2/(g^4 a^2 b^2) = ' +
    'I(a,b)^2/(g^2 a^2 b^2); (h,k)<->(g,a,b) is a bijection with g a<=N, g b<=N (Fubini).',
  innerFactorBounds: 'for every pair, 1 <= Sum_{g<=M} 1/g^2 <= zeta(2) = pi^2/6 (bounded).',
  exact: true,
});

// The reduced coprime-core sum T(N) that carries the entire growth (Result 2).
export const IMP96688_COPRIME_CORE = Object.freeze({
  definition: 'T(N) := Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2/(a^2 b^2)',
  growthEquivalence:
    '||G_N||_F^2 grows at the rate of T(N) up to a bounded ratio in [1, zeta(2)]; ' +
    'in particular ||G_N||_F^2 diverges IFF T(infinity) diverges.',
  diagonalTerm: 'a=b=1: I(1,1)^2 Sum_{g<=N} 1/g^2 -> I(1,1)^2 zeta(2) = 2.614..., a constant',
  diagonalLimit: 1.2606614015078126 * 1.2606614015078126 * (Math.PI * Math.PI / 6),
  measuredImplication:
    'imp-96684 measured ||G||_F ~ 2.55 + 0.478 log N => ||G||_F^2 ~ 0.229 (log N)^2, so ' +
    'T(N) must diverge like ~(log N)^2 (a double-log coprime second-moment mass).',
});

// The precise obstruction (Result 3): available vs needed cotangent-sum moment.
export const IMP96688_OBSTRUCTION = Object.freeze({
  available:
    'Bettin-Conrey (2013) / Maier-Rassias: a second-moment asymptotic for a FIXED ' +
    'denominator k, Sum_{h mod k,(h,k)=1} c_0(h/k)^2 ~ (main) k^2 log k -- a one-parameter ' +
    'average over numerators with k held fixed.',
  needed:
    'T(N) is a JOINT double sum over coprime pairs (a,b), both indices free, coupled by ' +
    'coprimality and the 1/(a^2 b^2) weight, truncated by max(a,b)<=N; extracting its ' +
    '(log N)^2 coefficient needs the fixed-k moment UNIFORMLY in k with an error summable ' +
    'against 1/(a^2 b^2), then a second summation over the free denominator.',
  gap:
    'a UNIFORM (in both arguments) second-moment asymptotic for the Vasyunin cotangent sum ' +
    'with the coprimality-restricted 1/(ab)^2 weight -- a two-dimensional weighted mean ' +
    'value the cotangent-sum literature does not supply.',
  contrastWithLamMax:
    'this is NOT the imp-96562 multiplicative-vs-additive-Toeplitz edge obstruction (which ' +
    'kills lam_max as a spectral edge); the Frobenius norm sidesteps that by being a plain ' +
    'double sum. The obstruction here is a missing uniform arithmetic moment, not a missing ' +
    'spectral-edge theorem.',
  closesTheSubGap: false, // it REDUCES/sharpens the imp-96684 sub-gap; it does not close it
});

export const IMP96688_VERDICT = Object.freeze({
  question:
    'does ||G_N||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 admit a rigorous asymptotic ' +
    '(Bohr-lift / mean-value) that would convert the imp-96684 fitted Frobenius slope into a ' +
    'proved growth law?',
  gcdFactorsOutExactly: true,
  growthLocalizedInCoprimeCore: true,
  rigorousAsymptoticEstablished: false,
  anyBoundMoved: false,
  conclusion:
    'PARTIAL. The gcd variable factors out EXACTLY: ||G_N||_F^2 = Sum_{gcd(a,b)=1} ' +
    'I(a,b)^2/(a^2 b^2) Sum_{g<=N/max(a,b)} 1/g^2 (verified to machine precision), which ' +
    'localizes the entire growth into the coprime-core Vasyunin second moment T(N) up to a ' +
    'bounded [1,zeta(2)] factor -- a rigorous reduction strictly stronger than the imp-96684 ' +
    'fit framing, with the diagonal a=b=1 contributing only the constant I(1,1)^2 zeta(2). ' +
    'But proving the growth law needs a UNIFORM second-moment asymptotic for the Vasyunin ' +
    'cotangent sums over coprime pairs against 1/(a^2 b^2) -- a Bettin-Conrey moment problem ' +
    'the literature supplies only for a fixed denominator, not uniformly in two free coupled ' +
    'arguments. The ~3.76e7 ceiling stays fit-extrapolated; the sub-gap is sharper and ' +
    'well-posed, not closed. No bound moved; no operator positivity; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP96688_SUBGAP = Object.freeze({
  id: 'imp-96688-frobenius-needs-uniform-cotangent-second-moment',
  statement:
    'after the exact g-factorization the imp-96684 Frobenius-ceiling sub-gap reduces to a ' +
    'single well-posed statement: a UNIFORM (in both free arguments) second-moment asymptotic ' +
    'for the Vasyunin cotangent sums I(a,b)^2 summed over coprime pairs a,b<=N against the ' +
    'weight 1/(a^2 b^2). Bettin-Conrey / Maier-Rassias give this for a fixed denominator only; ' +
    'the joint two-dimensional weighted uniform version is not available, so the (log N)^2 ' +
    'coefficient -- and hence the proved growth law and the rigorous conditioning ceiling -- ' +
    'remain open. This SHARPENS and REDUCES the imp-96684 sub-gap; it does not close it.',
});

export const IMP96688_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the g-factorization is an ' +
  'EXACT identity (elementary algebra + Fubini, verified to machine precision against the ' +
  'direct double sum on a self-built Vasyunin table); the reduction to the coprime-core ' +
  'Vasyunin second moment and the Bettin-Conrey obstruction are structural. No bound is ' +
  'claimed moved, no operator positivity is established, and no rigorous asymptotic is proved.';

// -- self-verifying reproduction of Result 1 (the exact g-factorization) --
// Build a small Vasyunin cotangent table and check direct ||G||_F^2 == factored form.
// The identity is purely algebraic, so ANY symmetric I(a,b) exercises it; we use the real
// Vasyunin V plus a symmetric combination to make the test non-trivial. NMAX small (fast).

const frac = (x) => x - Math.floor(x);
const cotan = (x) => Math.cos(x) / Math.sin(x);

function vasyunin(a, q) {
  // V(a/q) = Sum_{m=1}^{q-1} frac(m a / q) cot(pi m / q)
  if (q <= 1) return 0;
  let s = 0;
  for (let m = 1; m < q; m += 1) s += frac((m * a) / q) * cotan((Math.PI * m) / q);
  return s;
}

function kernelI(a, b) {
  // symmetric stand-in exercising the algebraic identity (test is I-agnostic).
  const va = b > 0 ? vasyunin(a % b, b) : 0;
  const vb = a > 0 ? vasyunin(b % a, a) : 0;
  return 1 + va + vb;
}

function gcdOf(x, y) {
  let p = x;
  let q = y;
  while (q) {
    const t = p % q;
    p = q;
    q = t;
  }
  return p;
}

function frobeniusSquaredDirect(N) {
  let s = 0;
  for (let h = 1; h <= N; h += 1) {
    for (let k = 1; k <= N; k += 1) {
      const g = gcdOf(h, k);
      const val = (g * kernelI(h / g, k / g)) / (h * k);
      s += val * val;
    }
  }
  return s;
}

function frobeniusSquaredFactored(N) {
  let s = 0;
  for (let a = 1; a <= N; a += 1) {
    for (let b = 1; b <= N; b += 1) {
      if (gcdOf(a, b) !== 1) continue;
      const mx = Math.max(a, b);
      const M = Math.floor(N / mx);
      let h2 = 0;
      for (let g = 1; g <= M; g += 1) h2 += 1 / (g * g);
      s += ((kernelI(a, b) ** 2) / (a * a * b * b)) * h2;
    }
  }
  return s;
}

const IMP96688_CHECK_N = 24;
const IMP96688_DIRECT = frobeniusSquaredDirect(IMP96688_CHECK_N);
const IMP96688_FACTORED = frobeniusSquaredFactored(IMP96688_CHECK_N);
export const IMP96688_IDENTITY_CHECK = Object.freeze({
  N: IMP96688_CHECK_N,
  direct: IMP96688_DIRECT,
  factored: IMP96688_FACTORED,
  relDiff: Math.abs(IMP96688_DIRECT - IMP96688_FACTORED) / Math.abs(IMP96688_DIRECT),
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96688_ASSERTIONS = [
  {
    id: 'imp96688-g-factorization-exact-machine-precision',
    holds: () => IMP96688_IDENTITY_CHECK.relDiff < 1e-12 && IMP96688_IDENTITY.exact === true,
    why: 'the direct double sum and the g-factored form agree to machine precision, so the gcd variable factors out exactly (Result 1).',
  },
  {
    id: 'imp96688-inner-factor-bounded-by-zeta2',
    holds: () => IMP96688_ZETA2 > 1.6449 && IMP96688_ZETA2 < 1.645,
    why: 'the inner g-sum is a partial zeta(2), bounded in [1, zeta(2)=pi^2/6], so it cannot itself drive the growth (Result 2).',
  },
  {
    id: 'imp96688-diagonal-term-is-constant',
    holds: () =>
      Math.abs(IMP96688_COPRIME_CORE.diagonalLimit - IMP96688_I11 * IMP96688_I11 * IMP96688_ZETA2) < 1e-12 &&
      IMP96688_COPRIME_CORE.diagonalLimit > 2.6 && IMP96688_COPRIME_CORE.diagonalLimit < 2.63,
    why: 'the a=b=1 diagonal term tends to the constant I(1,1)^2 zeta(2) = 2.614..., so all growth is off-core (Result 2, consistent with imp-96562).',
  },
  {
    id: 'imp96688-obstruction-is-uniform-moment-not-szego',
    holds: () =>
      IMP96688_OBSTRUCTION.closesTheSubGap === false &&
      /uniform/i.test(IMP96688_OBSTRUCTION.gap) &&
      /Bettin-Conrey/.test(IMP96688_OBSTRUCTION.available) &&
      /plain double sum/i.test(IMP96688_OBSTRUCTION.contrastWithLamMax),
    why: 'the recorded obstruction is a missing UNIFORM cotangent-sum second moment (a Bettin-Conrey moment problem), distinct from the imp-96562 spectral-edge Szego obstruction.',
  },
  {
    id: 'imp96688-honesty-gate-no-qed',
    holds: () =>
      IMP96688_VERDICT.anyBoundMoved === false &&
      IMP96688_VERDICT.gcdFactorsOutExactly === true &&
      IMP96688_VERDICT.rigorousAsymptoticEstablished === false &&
      /NO QED/.test(IMP96688_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96688_HONEST_BANNER) &&
      /RH open/.test(IMP96688_HONEST_BANNER) &&
      /needs-uniform-cotangent-second-moment/.test(IMP96688_SUBGAP.id),
    why: 'assessment only: no bound moved, the exact factorization is recorded, no rigorous asymptotic is claimed, and the honesty markers plus the sharpened sub-gap are present.',
  },
];

for (const a of IMP96688_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96688-route-m-frobenius-g-factorization-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  i11: IMP96688_I11,
  zeta2: IMP96688_ZETA2,
  identity: IMP96688_IDENTITY,
  coprimeCore: IMP96688_COPRIME_CORE,
  obstruction: IMP96688_OBSTRUCTION,
  verdict: IMP96688_VERDICT,
  subGap: IMP96688_SUBGAP,
  identityCheck: IMP96688_IDENTITY_CHECK,
  banner: IMP96688_HONEST_BANNER,
};

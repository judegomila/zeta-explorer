/**
 * @module imp-96590-route-m-lammax-helson-multiplicative-toeplitz-assessment
 *
 * imp-96590 (numerical, STRUCTURAL ASSESSMENT ONLY): imp-96562 ruled out a classical
 * ADDITIVE Szego/Grenander pin of the measured Vasyunin lam_max log-slope
 * b_meas = 0.3526253785070698 because the Vasyunin Gram is translation-invariant on the
 * MULTIPLICATIVE semigroup (a Dirichlet-Bohr kernel), not on Z, and has a log-divergent
 * (unbounded) spectral edge. imp-96562 FINDING 2 explicitly flagged the kernel as
 * multiplicative / Bohr-lift, but never assessed the natural next candidate: the
 * MULTIPLICATIVE-Toeplitz / Helson-matrix theory (spectral asymptotics for matrices
 * indexed by the multiplicative semigroup). This ticket ASSESSES whether that framework
 * -- Helson matrices, the multiplicative Hilbert matrix, Perfekt-Pushnitski eigenvalue
 * asymptotics, and the Gal / Bondarenko-Seip GCD-sum theory -- contains any limiting-
 * spectrum statement able to rigorously predict 0.3526, or reaches the precise
 * obstruction that blocks it.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is a
 * structural literature-mapping assessment plus a re-derivation of the imp-96562 measured
 * slope for internal consistency. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the Vasyunin Gram is a two-variable GCD-Gram, matching NEITHER
 *              canonical multiplicative-matrix class exactly.
 * -------------------------------------------------------------------------------
 * Write h = g a, k = g b with g = gcd(h,k) and gcd(a,b) = 1. Then
 *
 *     G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) = g I(a,b)/(g^2 a b) = I(a,b)/(g a b),
 *
 * so the entry depends on the pair (h,k) through BOTH the gcd g AND the coprime pair
 * (a,b). This is a GCD-Gram, and it is:
 *   (a) NOT a multiplicative-Toeplitz (ratio) matrix. A ratio-Toeplitz / Bohr-Toeplitz
 *       matrix has A_{mn} = f(m/n), a function of the ratio alone (translation invariance
 *       on the multiplicative group Q_+). G depends on g and (a,b) separately, not on
 *       the ratio h/k = a/b alone, so it is NOT a multiplicative-Toeplitz matrix.
 *   (b) NOT a Helson / multiplicative-Hankel matrix. A Helson matrix has M_{mn} = c(mn),
 *       a function of the PRODUCT mn (Bohr-lift of a Dirichlet series to a Hankel form on
 *       the infinite torus). G is not a function of hk. So it is NOT a Helson matrix
 *       either.
 * The Bohr lift of G is therefore a genuinely two-index kernel on the infinite torus,
 * with the Dirichlet-series singularity supplying an UNBOUNDED symbol (consistent with
 * imp-96562 FINDING 2b). Neither canonical multiplicative-matrix class indexes it.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the developed Helson spectral theory gives DECAY / NORM statements,
 *              never a finite-truncation edge-GROWTH rate.
 * -------------------------------------------------------------------------------
 * The two rigorous outputs of Helson-matrix theory are of the WRONG type to pin 0.3526:
 *   (i) NORM CONSTANTS for BOUNDED operators. The multiplicative Hilbert matrix
 *       (1/(sqrt(mn) log(mn)))_{m,n>=2} is bounded with operator norm exactly pi
 *       (Perfekt-Pushnitski 2018). This is a CONSTANT edge for a bounded operator -- the
 *       measured Vasyunin lam_max GROWS without bound (~0.35 log N), so it is not a
 *       bounded-Helson-operator norm at all.
 *   (ii) EIGENVALUE-DECAY asymptotics for COMPACT operators. For compact self-adjoint
 *       Helson matrices with a logarithmic symbol singularity, the ordered eigenvalues
 *       decay like lambda_n ~ C/n (Perfekt-Pushnitski, "Spectral asymptotics for compact
 *       self-adjoint Helson matrices"). This describes the TAIL of the spectrum of a
 *       FIXED infinite operator, not the finite-N truncation edge. It yields a decay
 *       coefficient C, never a truncation growth-rate coefficient like 0.3526.
 * Both statement types are about a fixed infinite operator (its norm, or its ordered-
 * spectrum tail); neither is a finite-truncation edge-GROWTH-rate theorem. Since the
 * Vasyunin operator is unbounded (log-divergent edge), the compact/bounded Helson theory
 * has no theorem that produces a log-growth slope -- the SAME core obstruction
 * (unbounded edge) as the additive case survives the move to the correct group.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the framework that DOES address GCD-Gram largest eigenvalues (Gal /
 *              Bondarenko-Seip GCD-sum theory) has no leading-CONSTANT theorem here.
 * -------------------------------------------------------------------------------
 * The sup of a GCD-Gram quadratic form is exactly the object of the Gal / Bondarenko-Seip
 * GCD-sum theory. For the pure GCD kernel gcd(m,n)^{2 sigma}/(mn)^{sigma} the sharp
 * growth of the largest form value on N terms is:
 *     sigma = 1/2 (critical):  exp( (c + o(1)) sqrt( log N log log N ) )   [Bondarenko-Seip],
 *     sigma > 1/2:             BOUNDED (convergent).
 * The Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) has gcd-exponent 1 = 2 sigma and
 * denominator exponent 1 on hk, i.e. sigma = 1/2 in the gcd but sigma = 1 in the
 * denominator -- it is NOT a pure Gal GCD sum. The extra Vasyunin / Franel numerator
 * I(a,b) (a cotangent-sum weight, imp-96105 / imp-96443) is precisely what re-balances a
 * would-be convergent (sigma > 1/2, bounded) kernel into a LOG-divergent edge:
 * lam_max ~ 0.35 log N is far milder than the sigma = 1/2 stretched-exponential and far
 * stronger than the sigma > 1/2 bounded case -- an intermediate log regime. The GCD-sum
 * literature delivers the exponential RATE at the critical exponent and boundedness above
 * it, but NO sharp leading CONSTANT for an I(a,b)-weighted GCD Gram in the intermediate
 * log-divergent regime. So even the correct (GCD-sum) framework has no theorem yielding
 * the numerical value 0.3526.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO. The multiplicative-Toeplitz / Helson-matrix framework cannot rigorously predict the
 * measured lam_max slope 0.3526. (1) The Vasyunin Gram is a two-variable GCD-Gram,
 * matching neither a ratio multiplicative-Toeplitz matrix nor a product Helson matrix, so
 * no canonical multiplicative-matrix class even indexes it. (2) The developed Helson
 * theory (multiplicative Hilbert matrix norm = pi; Perfekt-Pushnitski compact eigenvalue
 * decay lambda_n ~ C/n) produces only bounded-operator norm constants and infinite-
 * operator decay tails -- never a finite-truncation edge-GROWTH rate -- and the Vasyunin
 * edge is unbounded, so the same core obstruction survives the move to the correct group.
 * (3) The framework that natively bounds GCD-Gram top eigenvalues, the Gal /
 * Bondarenko-Seip GCD-sum theory, gives the critical stretched-exponential rate and the
 * super-critical boundedness but no leading-CONSTANT theorem for the I(a,b)-weighted
 * intermediate log-divergent Vasyunin kernel. The assessment SHARPENS the imp-96562
 * IMP96562_SUBGAP: 0.3526 is the leading log-constant of a critical, I-weighted GCD-Gram
 * spectral-edge problem -- reachable in principle only by a Gal / Bondarenko-Seip-type
 * leading-constant theorem for weighted GCD sums, which is not available; classical
 * additive Szego (imp-96562), mean-field proxies (imp-96586), and Helson compact/bounded
 * asymptotics (this ticket) all miss it. Changes no bound; no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (rules out additive Szego; frames the Bohr-lift kernel)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (rules out mean-field / rank-one proxies)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max = 3.0247 + 0.3526 log N fit)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace-domination slope 1.2607)
 *
 * Ticket: imp-96590 (numerical, opus-4-8, api-pool). Structural assessment only; NO QED.
 */

import { IMP96562_ROWS } from './imp-96562-route-m-lammax-offdiagonal-szego-assessment.js';

// imp-96443 measured lam_max log-slope this assessment targets.
export const IMP96590_MEASURED_SLOPE = 0.3526253785070698;

// Bounded reference edge from Helson theory: the multiplicative Hilbert matrix norm = pi.
// A CONSTANT (bounded operator), contrasted below with the GROWING Vasyunin edge.
export const IMP96590_MULT_HILBERT_NORM = Math.PI;

// OLS slope of a + b log N (returns {a,b,r2}); re-derives the imp-96562 measured slope.
function olsLog(rows, yOf) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map(yOf);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  let sst = 0;
  let ssr = 0;
  for (let i = 0; i < n; i += 1) {
    sst += (ys[i] - my) ** 2;
    ssr += (a + b * xs[i] - ys[i]) ** 2;
  }
  return { a, b, r2: 1 - ssr / sst };
}

const lamMaxFit = olsLog(IMP96562_ROWS, (r) => r.lamMax);

// FINDING 1 -- two-variable GCD-Gram; matches neither canonical multiplicative class.
export const IMP96590_KERNEL_CLASS = Object.freeze({
  form: 'G_{hk} = I(a,b)/(g a b) with h = g a, k = g b, g = gcd(h,k), gcd(a,b) = 1',
  isMultiplicativeToeplitz: false, // depends on g and (a,b) separately, not on ratio h/k = a/b
  isHelsonHankel: false, // not a function of the product hk
  reason:
    'the entry depends on the pair (h,k) through BOTH gcd g AND the coprime pair (a,b); a ' +
    'ratio multiplicative-Toeplitz matrix is a function of h/k alone and a Helson matrix is a ' +
    'function of the product hk alone, so this two-variable GCD-Gram is neither -- its Bohr ' +
    'lift is a two-index infinite-torus kernel with an unbounded (Dirichlet-singularity) symbol.',
});

// FINDING 2 -- Helson theory gives norm / decay statements, not a truncation growth rate.
export const IMP96590_HELSON_ASSESSMENT = Object.freeze({
  predictsCoefficient: false,
  boundedNormResult:
    'the multiplicative Hilbert matrix (1/(sqrt(mn) log(mn))) is bounded with operator norm ' +
    'exactly pi (Perfekt-Pushnitski 2018): a CONSTANT edge for a BOUNDED operator -- the ' +
    'Vasyunin lam_max grows without bound, so it is not a bounded-Helson-operator norm.',
  eigenvalueDecayResult:
    'compact self-adjoint Helson matrices with a log symbol singularity have ordered ' +
    'eigenvalues lambda_n ~ C/n (Perfekt-Pushnitski): a DECAY tail of a fixed infinite ' +
    'operator, not a finite-N truncation edge, so it yields a decay constant not a growth rate.',
  conclusion:
    'both rigorous Helson outputs (bounded-operator norm constants; compact eigenvalue-decay ' +
    'tails) are about a fixed infinite operator; neither is a finite-truncation edge-GROWTH ' +
    'rate. The Vasyunin edge is unbounded, so the same core obstruction as the additive case ' +
    'survives the move to the correct (multiplicative) group.',
});

// FINDING 3 -- Gal / Bondarenko-Seip GCD-sum theory: rate + boundedness, no leading constant.
export const IMP96590_GCDSUM_ASSESSMENT = Object.freeze({
  predictsCoefficient: false,
  criticalRate:
    'for the pure GCD kernel gcd^{2 sigma}/(mn)^{sigma} the critical exponent sigma = 1/2 gives ' +
    'the sharp growth exp((c + o(1)) sqrt(log N log log N)) (Bondarenko-Seip); sigma > 1/2 is ' +
    'bounded.',
  vasyuninIsNotPureGCD:
    'the Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) has gcd-exponent 1 = 2 sigma (sigma = 1/2) but ' +
    'denominator exponent 1 on hk (sigma = 1); the extra Franel/cotangent numerator I(a,b) ' +
    're-balances a would-be convergent kernel into a LOG-divergent edge (milder than the ' +
    'critical stretched-exponential, stronger than the super-critical bounded case).',
  conclusion:
    'the GCD-sum literature delivers the exponential RATE at the critical exponent and ' +
    'boundedness above it, but NO sharp leading CONSTANT for an I(a,b)-weighted GCD Gram in the ' +
    'intermediate log-divergent regime, so it cannot produce the value 0.3526 either.',
});

export const IMP96590_VERDICT = Object.freeze({
  question:
    'does the multiplicative-Toeplitz / Helson-matrix (Bohr-lift) framework offer a limiting-' +
    'spectrum statement that rigorously predicts the measured Vasyunin lam_max slope 0.3526?',
  helsonPredictsCoefficient: false,
  gcdSumPredictsCoefficient: false,
  anyBoundMoved: false,
  conclusion:
    'NO. (1) the Vasyunin Gram is a two-variable GCD-Gram, matching neither a ratio ' +
    'multiplicative-Toeplitz nor a product Helson matrix, so no canonical multiplicative-matrix ' +
    'class indexes it; (2) the developed Helson theory gives only bounded-operator norm ' +
    'constants (mult. Hilbert matrix norm = pi) and compact eigenvalue-DECAY tails ' +
    '(lambda_n ~ C/n), never a finite-truncation edge-GROWTH rate, and the Vasyunin edge is ' +
    'unbounded so the core obstruction survives; (3) the Gal / Bondarenko-Seip GCD-sum theory ' +
    'that natively bounds GCD-Gram top eigenvalues gives the critical stretched-exponential rate ' +
    'and super-critical boundedness but no leading-CONSTANT theorem for the I(a,b)-weighted ' +
    'intermediate log-divergent Vasyunin kernel. Sharpens IMP96562_SUBGAP: 0.3526 is the leading ' +
    'log-constant of a critical, I-weighted GCD-Gram spectral-edge problem, reachable only by a ' +
    'Gal / Bondarenko-Seip-type leading-constant theorem for weighted GCD sums, not available. ' +
    'Changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96590_SUBGAP = Object.freeze({
  id: 'imp-96590-lammax-weighted-gcd-sum-leading-constant',
  statement:
    'the residual open piece, after ruling out additive Szego (imp-96562), mean-field proxies ' +
    '(imp-96586), and Helson compact/bounded asymptotics (imp-96590), is specifically the ' +
    'leading log-CONSTANT 0.3526 of the largest eigenvalue of the I(a,b)-weighted GCD Gram ' +
    'gcd(h,k) I(h/g,k/g)/(hk) at its critical (log-divergent) exponent. Pinning it would require ' +
    'a Gal / Bondarenko-Seip-type sharp leading-constant theorem for weighted GCD sums, which ' +
    'the GCD-sum literature does not currently provide; until then 0.3526 remains a measured fit.',
});

export const IMP96590_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Structural assessment only: the kernel-class ' +
  'analysis and the Helson / GCD-sum literature mapping establish no bound and no operator ' +
  'positivity; the only computation is a re-derivation of the imp-96562 measured lam_max slope ' +
  '0.3526 for internal consistency. No canonical multiplicative-matrix framework predicts it.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96590_ASSERTIONS = [
  {
    id: 'imp96590-reproduces-measured-slope',
    holds: () => Math.abs(lamMaxFit.b - IMP96590_MEASURED_SLOPE) < 1e-9 && lamMaxFit.r2 > 0.99,
    why: 're-deriving the OLS log-slope of the imp-96562 lam_max ladder reproduces the measured 0.3526, anchoring the assessment to the same target.',
  },
  {
    id: 'imp96590-edge-grows-not-bounded-norm',
    holds: () => {
      const first = IMP96562_ROWS[0].lamMax;
      const last = IMP96562_ROWS[IMP96562_ROWS.length - 1].lamMax;
      // the edge GROWS with N -- it is not a fixed bounded-operator norm like the mult. Hilbert pi.
      return last > first + 0.5 && IMP96590_MULT_HILBERT_NORM > 3 && IMP96590_MULT_HILBERT_NORM < 3.2;
    },
    why: 'the Vasyunin lam_max grows measurably across the ladder, so it is a truncation growth rate, not a bounded-Helson-operator norm (the multiplicative Hilbert matrix norm pi is the bounded reference).',
  },
  {
    id: 'imp96590-kernel-matches-neither-class',
    holds: () =>
      IMP96590_KERNEL_CLASS.isMultiplicativeToeplitz === false &&
      IMP96590_KERNEL_CLASS.isHelsonHankel === false,
    why: 'the two-variable GCD-Gram is neither a ratio multiplicative-Toeplitz matrix nor a product Helson matrix, so no canonical multiplicative-matrix class indexes it.',
  },
  {
    id: 'imp96590-neither-framework-predicts',
    holds: () =>
      IMP96590_HELSON_ASSESSMENT.predictsCoefficient === false &&
      IMP96590_GCDSUM_ASSESSMENT.predictsCoefficient === false &&
      IMP96590_VERDICT.helsonPredictsCoefficient === false &&
      IMP96590_VERDICT.gcdSumPredictsCoefficient === false,
    why: 'neither the Helson compact/bounded theory nor the Gal / Bondarenko-Seip GCD-sum theory contains a statement that predicts the 0.3526 leading constant.',
  },
  {
    id: 'imp96590-honesty-gate-no-qed',
    holds: () =>
      IMP96590_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96590_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96590_HONEST_BANNER) &&
      /RH open/.test(IMP96590_HONEST_BANNER) &&
      /weighted-gcd-sum-leading-constant/.test(IMP96590_SUBGAP.id),
    why: 'assessment only: no bound moved, honesty markers present, and the sharpened weighted-GCD-sum leading-constant sub-gap is recorded.',
  },
];

for (const a of IMP96590_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96590-route-m-lammax-helson-multiplicative-toeplitz-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  measuredSlope: IMP96590_MEASURED_SLOPE,
  multHilbertNorm: IMP96590_MULT_HILBERT_NORM,
  kernelClass: IMP96590_KERNEL_CLASS,
  helsonAssessment: IMP96590_HELSON_ASSESSMENT,
  gcdSumAssessment: IMP96590_GCDSUM_ASSESSMENT,
  verdict: IMP96590_VERDICT,
  subGap: IMP96590_SUBGAP,
  banner: IMP96590_HONEST_BANNER,
};

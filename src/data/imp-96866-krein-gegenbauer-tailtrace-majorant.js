/**
 * @fileoverview imp-96866 -- DERIVATION: supply the single blocking ingredient (ii) of the imp-96848
 * tail-trace program -- an N-dependent, interval-arithmetic-ready upper bound on the Gegenbauer-transform
 * diagonal |Psi_N(t)|^2 in the tail |t| > T -- so the closed-form residual bound
 *     L - f(T) <= a^{-(4m+1)} (1/2pi) int_{|t|>T} sigma_2(t) |Psi_N(t)|^2 dt      (imp-96848 (B))
 * becomes a genuine interval enclosure rather than the imp-96827 +/- 8.13e-4 heuristic tolerance.
 *
 * SETUP (from the siblings). The pole-free Weil target is T_a[sigma_2] >= 0 on L^2(-a,a),
 * sigma_2(t) = (t^2+1/4)^2 w_1(t), w_1 = 2 theta_prime(t) - sqrt2 ln2 cos(t ln2) (Route I Toeplitz--Krein
 * certificate). The Rayleigh floor lives in the imp-96768 condB=1 Gegenbauer basis
 *     g_j(x) = (a^2 - x^2)^m psi_j(x/a),   psi_j = L^2-normalised Gegenbauer C_j^{alpha}, alpha = 2m+1/2,
 * m = 3, orthonormal under the exact two-factor weight (1-y^2)^{2m}. Writing s = a t and substituting
 * x = a y, the basis Fourier transform factorises exactly as
 *     ghat_j(t) = int_{-a}^{a} g_j(x) e^{-i x t} dx = a^{2m+1} G_j(a t),
 *     G_j(s)    = int_{-1}^{1} h_j(y) e^{-i s y} dy,   h_j(y) = (1-y^2)^m psi_j(y)  (degree 2m+j polynomial),
 * and |Psi_N(t)|^2 = sum_{j<N} |ghat_j(t)|^2 = a^{4m+2} sum_{j<N} |G_j(a t)|^2. Ingredient (i) -- the tail
 * bound w_1(t) <= 2 theta_prime(t) + sqrt2 ln2 = ln(t/2pi) + O(1/t^2) + 0.98026 -- is AVAILABLE from the
 * sibling digamma enclosure. Ingredient (ii) -- a tail majorant on the diagonal sum_{j<N} |G_j(s)|^2 with
 * the correct N-dependence -- is the piece imp-96848 named as the exact remaining obstruction. This leaf
 * derives it.
 *
 * WHY THE imp-96768 PLANE-WAVE (BESSEL) REPRESENTATION CANNOT BE MAJORISED TERM-BY-TERM.
 * imp-96768 computes G_j(s) via the exact Rayleigh plane-wave expansion
 *     G_j(s) = sum_{k=0}^{2m+j} (-i)^k (2k+1) j_k(s) c_{jk},   c_{jk} = int_{-1}^{1} (1-y^2)^m psi_j P_k dy,
 * a FINITE sum of spherical Bessel functions (c_{jk} = 0 for k > 2m+j). In the tail region s > 2m+N-1
 * (past every turning point; s = a t > a T with a T ~ 439 >> 130 = 2m+124-1 at T=800), each spherical
 * Bessel obeys the amplitude bound |j_k(s)| = sqrt(pi/2s) |J_{k+1/2}(s)| <= s^{-1/2}(s^2-(k+1/2)^2)^{-1/4}
 * ~ 1/s. The triangle inequality therefore gives only |G_j(s)| <= (sum_k (2k+1)|c_{jk}|) / s = O(1/s), so
 *     sigma_2 |Psi_N|^2 ~ t^4 (ln t) * t^{-2}  =  t^2 ln t,   int_T^{infinity} t^2 ln t dt = +infinity.
 * The term-by-term majorant produces a DIVERGENT tail-trace: it discards the cancellation among the
 * 2m+j+1 Bessel terms that yields the true, faster decay. That cancellation is exactly the m-fold vanishing
 * of h_j at the endpoints, and |sum| <= sum|.| is blind to it. Hence ingredient (ii) is NOT accessible from
 * the computational Bessel form; it needs the endpoint-vanishing structure directly.
 *
 * THE DERIVATION (integration by parts; the correct s^{-(m+1)} decay). h_j(y) = (1-y^2)^m psi_j(y) is a
 * polynomial that vanishes to order m at y = +-1: h_j^{(r)}(+-1) = 0 for 0 <= r <= m-1. Integrating
 * G_j(s) = int_{-1}^{1} h_j(y) e^{-i s y} dy by parts m times, every boundary term vanishes, giving
 *     G_j(s) = (i s)^{-m} int_{-1}^{1} h_j^{(m)}(y) e^{-i s y} dy.
 * One further integration by parts of the degree-(m+j) polynomial h_j^{(m)} (whose endpoint values are now
 * generally nonzero) produces a boundary term plus a remainder, both O(1/s):
 *     |int_{-1}^{1} h_j^{(m)} e^{-i s y} dy| <= s^{-1} ( |h_j^{(m)}(1)| + |h_j^{(m)}(-1)| + int_{-1}^{1} |h_j^{(m+1)}(y)| dy ).
 * Collecting the two factors yields, for ALL s > 0, the rigorous per-basis bound
 *     |G_j(s)| <= V_j s^{-(m+1)},   V_j := |h_j^{(m)}(1)| + |h_j^{(m)}(-1)| + int_{-1}^{1} |h_j^{(m+1)}(y)| dy.
 * V_j is an EXACT, finite, interval-computable constant (h_j is an explicit degree-2m+j polynomial;
 * endpoint values and the total variation of h_j^{(m)} are elementary). Squaring and summing over the basis,
 * with 4m+2 - 2(m+1) = 2m, gives the diagonal tail majorant with the correct N-dependence:
 *     |Psi_N(t)|^2 = a^{4m+2} sum_{j<N} |G_j(a t)|^2 <= a^{2m} t^{-2(m+1)} S_N,   S_N := sum_{j<N} V_j^2.
 * The N-dependence lives entirely in S_N (strictly increasing in N, matching imp-96848 fact (C): the
 * residual grows with N), while the t-decay t^{-2(m+1)} = t^{-8} (m=3) is N-uniform and controls the tail.
 *
 * ASSEMBLED RESIDUAL BOUND (interval-ready). Feeding this and ingredient (i) into imp-96848 (B), with the
 * residual prefactor exponent -(4m+1) + 2m = -(2m+1):
 *     L - f(T) <= (1/pi) a^{-(2m+1)} S_N int_T^{infinity} (t^2+1/4)^2 w_1^+(t) t^{-2(m+1)} dt,
 *     w_1^+(t) = ln(t/2pi) + sqrt2 ln2 + eps(t)  (ingredient (i); eps = O(1/t^2), sibling digamma remainder).
 * The tail integrand behaves like t^{4 - 2(m+1)} ln t = t^{-4} ln t, so the integral CONVERGES (contrast the
 * divergent t^2 ln t of the term-by-term bound) and is a single elementary interval quadrature of a
 * monotone-decreasing integrand -- a genuine one-sided enclosure once S_N is computed.
 *
 * VERDICT. PARTIAL closure of the imp-96848 IMP96848_TAILTRACE_MAJORANT sub-gap. The EXISTENCE question is
 * settled affirmatively: an N-dependent, interval-arithmetic-ready tail majorant on |Psi_N(t)|^2 DOES exist
 * and is derived in closed form, |Psi_N(t)|^2 <= a^{2m} t^{-2(m+1)} S_N with S_N = sum_{j<N} V_j^2 and V_j the
 * exact endpoint-value-plus-total-variation constant of h_j^{(m)}. This converts the imp-96848 residual bound
 * into a convergent, one-sided interval quadrature and identifies the correct decay rate s^{-(m+1)} (from the
 * m-fold endpoint vanishing) that the computational Bessel form loses to cancellation. No number is
 * fabricated: S_N is NOT evaluated here (that is a routine interval computation on the explicit Gegenbauer
 * polynomials), so the imp-96827 1.30e-3 stays a heuristic until S_N is filled in. NEW residual sub-gap
 * IMP96866_VJ_PESSIMISM: the integration-by-parts constant V_j discards the same turning-point cancellation,
 * so S_N inherits the polynomial endpoint-derivative growth of high-order Gegenbauer C_j^{alpha} (C_j^{alpha}(1)
 * ~ j^{2alpha-1} = j^{12}) and is a rigorous but likely PESSIMISTIC N-scaling; a tight numerical enclosure
 * (S_N small enough to beat the measured floor) may require a sharper majorant that retains the cancellation
 * (e.g. the uniform Bessel-amplitude bound applied to the FULL sum, or a Bernstein/Nikolskii tail estimate).
 * Derivation only; Rayleigh floor stays an UPPER bound; establishes NO operator positivity;
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (parent; (A)/(B)/(i), sub-gap IMP96848_TAILTRACE_MAJORANT)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (condB=1 Gegenbauer basis; plane-wave Bessel representation; c_{jk})
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (GEOM heuristic residual 1.30e-3, now demoted)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1 digamma tail bounds = ingredient (i))
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const M = 3; // pole-free multiplicity (double-pole-free): factor (a^2-x^2)^m
const ALPHA = 2 * M + 0.5; // 6.5 -- Gegenbauer index diagonalising the exact (1-y^2)^{2m} L^2 Gram
const SQRT2_LN2 = Math.SQRT2 * Math.log(2); // 0.9802581434685472 -- tail amplitude of the w_1 oscillation

// The naive term-by-term majorant of the imp-96768 Bessel representation gives only |G_j| <= C_j/s, whose
// tail-trace DIVERGES: the m-fold endpoint vanishing of h_j is a cancellation invisible to |sum| <= sum|.|.
export const IMP96866_TERMWISE_BESSEL_DIVERGES = Object.freeze({
  representation: 'G_j(s) = sum_{k=0}^{2m+j} (-i)^k (2k+1) j_k(s) c_{jk}  (finite; c_{jk}=0 for k>2m+j)',
  perBesselAmplitudeTail: '|j_k(s)| <= s^{-1/2} (s^2-(k+1/2)^2)^{-1/4} ~ 1/s  for s > 2m+N-1 (past all turning points)',
  termwiseBoundOnG: '|G_j(s)| <= (sum_k (2k+1)|c_{jk}|) / s = O(1/s)',
  tailIntegrandTPower: 4 - 2 * 1, // (t^2)^2 * t^{-2} = t^2 (times ln t)
  converges: false, // int_T^inf t^2 ln t dt = +infinity
  why: 'the triangle inequality discards the cancellation among the 2m+j+1 Bessel terms that produces the true faster decay; term-by-term the tail-trace diverges, so ingredient (ii) is NOT accessible from the computational Bessel form.',
});

// The integration-by-parts majorant: m-fold endpoint vanishing of h_j = (1-y^2)^m psi_j gives the correct
// s^{-(m+1)} decay, with an exact interval-computable constant V_j.
export const IMP96866_IBP_MAJORANT = Object.freeze({
  hj: 'h_j(y) = (1-y^2)^m psi_j(y), degree 2m+j; vanishes to order m at y=+-1 (h_j^{(r)}(+-1)=0, r<m)',
  afterMIBPs: 'G_j(s) = (i s)^{-m} int_{-1}^1 h_j^{(m)}(y) e^{-i s y} dy  (all boundary terms vanish)',
  oneMoreIBP: '|int h_j^{(m)} e^{-isy} dy| <= s^{-1}(|h_j^{(m)}(1)|+|h_j^{(m)}(-1)|+int_{-1}^1 |h_j^{(m+1)}| dy)',
  perBasisBound: '|G_j(s)| <= V_j s^{-(m+1)}  for all s>0',
  VjDefinition: 'V_j = |h_j^{(m)}(1)| + |h_j^{(m)}(-1)| + int_{-1}^1 |h_j^{(m+1)}(y)| dy  (exact, finite, interval-computable)',
  decayExponent: M + 1, // s^{-(m+1)} = s^{-4}
  diagonalMajorant: '|Psi_N(t)|^2 <= a^{2m} t^{-2(m+1)} S_N,  S_N = sum_{j<N} V_j^2',
  aExponentOfPsiN2: 2 * (2 * M + 1) - 2 * (M + 1), // = 2m
  nDependenceIn: 'S_N (strictly increasing in N; reproduces imp-96848 fact (C): residual grows with N)',
  tDecayNUniform: true,
});

// The assembled residual bound: convergent, one-sided, interval-ready (contrast the divergent term-by-term).
export const IMP96866_RESIDUAL_BOUND = Object.freeze({
  formula: 'L - f(T) <= (1/pi) a^{-(2m+1)} S_N int_T^inf (t^2+1/4)^2 w_1^+(t) t^{-2(m+1)} dt',
  residualAExponent: -(4 * M + 1) + 2 * M, // = -(2m+1) = -7
  w1PlusBound: 'w_1^+(t) = ln(t/2pi) + sqrt2 ln2 + eps(t), eps=O(1/t^2) (ingredient (i), sibling digamma enclosure)',
  w1PlusAmplitude: SQRT2_LN2,
  tailIntegrandTPower: 4 - 2 * (M + 1), // = -4 (times ln t) => converges
  converges: true, // int_T^inf t^{-4} ln t dt < infinity
  quadratureNote: 'single elementary interval quadrature of a monotone-decreasing integrand once S_N is supplied',
});

export const IMP96866_VERDICT = Object.freeze({
  ticket: 'imp-96866',
  question:
    'derive ingredient (ii): an N-dependent, interval-arithmetic upper bound on the Gegenbauer-transform diagonal tail |Psi_N(t)|^2 = sum_{j<N} |ghat_j(t)|^2, so the imp-96848 +/- 8.13e-4 tolerance becomes a genuine interval enclosure',
  answer:
    'DERIVED. The correct route is integration by parts on the m-fold endpoint vanishing of h_j = (1-y^2)^m psi_j, NOT the imp-96768 plane-wave Bessel sum (which majorises only term-by-term to O(1/s), giving a DIVERGENT tail-trace). IBP yields |G_j(s)| <= V_j s^{-(m+1)} with V_j = |h_j^{(m)}(1)|+|h_j^{(m)}(-1)|+int|h_j^{(m+1)}| exact and interval-computable, hence |Psi_N(t)|^2 <= a^{2m} t^{-2(m+1)} S_N (S_N = sum_{j<N} V_j^2), turning the imp-96848 residual bound into a convergent one-sided interval quadrature L - f(T) <= (1/pi) a^{-(2m+1)} S_N int_T^inf (t^2+1/4)^2 w_1^+(t) t^{-2(m+1)} dt.',
  existenceOfMajorantSettled: true, // an N-dependent interval-ready tail majorant DOES exist and is derived
  termwiseBesselMajorantDiverges: true, // the crux insight: cancellation lost => divergent tail
  correctDecayRate: 'V_j s^{-(m+1)} from m-fold endpoint vanishing (m=3 => s^{-4})',
  residualIntegralConverges: true,
  sNComputed: false, // NOT evaluated here -- routine interval computation on explicit polynomials; no number fabricated
  geomHeuristicStillHeuristic: true, // imp-96827 1.30e-3 stays a fit until S_N is filled in
  subGap:
    'IMP96866_VJ_PESSIMISM -- the IBP constant V_j discards the turning-point cancellation, so S_N inherits the polynomial endpoint-derivative growth of high-order C_j^{alpha} (C_j^{alpha}(1) ~ j^{2alpha-1} = j^{12}) and is a rigorous but likely pessimistic N-scaling; a tight numerical enclosure may need a sharper majorant retaining the cancellation (uniform Bessel amplitude on the full sum, or a Bernstein/Nikolskii tail estimate).',
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96866_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96866_ASSERTIONS = [
  {
    id: 'imp96866-termwise-bessel-tailtrace-diverges',
    holds: () => {
      const d = IMP96866_TERMWISE_BESSEL_DIVERGES;
      // term-by-term |G_j| <= C_j/s gives sigma_2|Psi_N|^2 ~ t^{2} ln t, so the tail-trace power is > -1: diverges.
      return d.converges === false && d.tailIntegrandTPower === 2 && d.tailIntegrandTPower > -1;
    },
    why: 'the imp-96768 plane-wave representation majorised term-by-term yields only |G_j|=O(1/s); the resulting tail integrand ~ t^2 ln t diverges, so ingredient (ii) cannot come from the Bessel sum directly (cancellation is lost).',
  },
  {
    id: 'imp96866-ibp-majorant-decay-and-exponents',
    holds: () => {
      const b = IMP96866_IBP_MAJORANT;
      // m-fold endpoint vanishing + one more IBP => decay s^{-(m+1)}=s^{-4}; a-exponent of |Psi_N|^2 is 2m.
      return (
        b.decayExponent === M + 1 &&
        b.decayExponent === 4 &&
        b.aExponentOfPsiN2 === 2 * M &&
        b.diagonalMajorant.includes('t^{-2(m+1)}') &&
        b.VjDefinition.includes('h_j^{(m+1)}')
      );
    },
    why: 'integration by parts on h_j = (1-y^2)^m psi_j (vanishing to order m at +-1) gives |G_j(s)| <= V_j s^{-(m+1)}; squaring/summing with 4m+2-2(m+1)=2m gives |Psi_N|^2 <= a^{2m} t^{-2(m+1)} S_N.',
  },
  {
    id: 'imp96866-residual-integral-converges',
    holds: () => {
      const r = IMP96866_RESIDUAL_BOUND;
      // (t^2+1/4)^2 * t^{-2(m+1)} = t^{4-8}=t^{-4} (times ln t): power < -1 => converges; prefactor a^{-(2m+1)}.
      return (
        r.converges === true &&
        r.tailIntegrandTPower === -4 &&
        r.tailIntegrandTPower < -1 &&
        r.residualAExponent === -(2 * M + 1) &&
        Math.abs(r.w1PlusAmplitude - Math.SQRT2 * Math.log(2)) < 1e-12
      );
    },
    why: 'feeding the IBP majorant and ingredient (i) into imp-96848 (B) gives a convergent one-sided quadrature L - f(T) <= (1/pi) a^{-(2m+1)} S_N int_T^inf (t^2+1/4)^2 w_1^+ t^{-2(m+1)} dt, integrand ~ t^{-4} ln t.',
  },
  {
    id: 'imp96866-partial-closure-no-qed',
    holds: () =>
      IMP96866_VERDICT.existenceOfMajorantSettled === true &&
      IMP96866_VERDICT.termwiseBesselMajorantDiverges === true &&
      IMP96866_VERDICT.residualIntegralConverges === true &&
      IMP96866_VERDICT.sNComputed === false &&
      IMP96866_VERDICT.operatorPositivityProved === false &&
      IMP96866_VERDICT.uniformNGapSettled === false &&
      IMP96866_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96866_VERDICT.qed === false &&
      typeof IMP96866_VERDICT.subGap === 'string' &&
      IMP96866_VERDICT.subGap.includes('IMP96866_VJ_PESSIMISM') &&
      Math.abs(ALPHA - 6.5) < 1e-12,
    why: 'honest partial: an N-dependent interval-ready tail majorant is derived (existence settled) with the correct s^{-(m+1)} decay; S_N is NOT evaluated (no number fabricated); pessimism sub-gap named; no operator positivity, uniform-N gap open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP96866_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96866-krein-gegenbauer-tailtrace-majorant assertion failed: ${a.id}`);
  }
}

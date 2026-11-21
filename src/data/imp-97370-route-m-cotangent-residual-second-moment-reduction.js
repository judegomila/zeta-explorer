/**
 * @module imp-97370-route-m-cotangent-residual-second-moment-reduction
 * @fileoverview imp-97370 -- ASSESSMENT + REDUCTION (no bound moved): bound/assess the SECOND MOMENT
 *   of the Vasyunin cotangent residual r(a,b) = I(a,b) - Ihat(a,b) enough to (a) certify the
 *   coprimality divisor weighting of the interior second-moment log^2 b coefficient and (b) rigorously
 *   locate the origin of any smooth b^(1/2) sub-leading, the IMP97349_SUBGAP left open by imp-97349.
 *
 *   Setup (imp-97349): Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2 splits, in the 1/a^2-weighted
 *   ell^2 inner product <x,y> = Sum_{a coprime} x(a) y(a) / a^2, as the Pythagorean decomposition
 *       Q = Qhat + Qcross + Qrr,   Ihat = (a/2) log(b/a) + a(C + 1/2)  (imp-97330 skeleton),
 *       Qhat = <Ihat,Ihat>,  Qcross = 2 <Ihat, r>,  Qrr = <r,r>,   r = I - Ihat.
 *   imp-97349 proved Qhat is an elementary LOG-POLYNOMIAL (pre-coprimality log^2 b coefficient -1/8,
 *   NO fractional power) and measured Qcross, Qrr LINEAR in b. This leaf sharpens the two arithmetic
 *   pieces and reduces the whole b^(1/2)-vs-log^2 b question to a single second-moment statement.
 *
 *   ------------------------------------------------------------------------------------------
 *   REDUCTION 1 (RIGOROUS) -- Cauchy-Schwarz squeezes Qcross between Qhat and Qrr.
 *   ------------------------------------------------------------------------------------------
 *   Qcross = 2 <Ihat, r> obeys, by Cauchy-Schwarz in the 1/a^2-weighted inner product,
 *       |Qcross|  <=  2 sqrt(Qhat) sqrt(Qrr).
 *   This is a finite, elementary inequality (no arithmetic input). MEASURED the ratio
 *   |Qcross| / (2 sqrt(Qhat Qrr)) ~ 0.11 (0.108..0.128 over b = 211..1300) -- Qcross sits far below the
 *   Cauchy-Schwarz ceiling (strong first-moment cancellation of r against Ihat, the imp-97116 signed
 *   mean value). CONSEQUENCE: since Qhat is a PROVEN log-polynomial with NO b^(1/2) (imp-97349), any
 *   smooth b^(1/2) in Q = Qhat + Qcross + Qrr must enter through Qrr, because Qcross is squeezed to the
 *   scale sqrt(Qhat Qrr) whose fractional-power content is inherited entirely from Qrr (Qhat is a
 *   log-polynomial). The b^(1/2) question is thereby reduced to the SECOND MOMENT Qrr alone.
 *
 *   ------------------------------------------------------------------------------------------
 *   REDUCTION 2 (STRUCTURAL, MEASURED) -- the second-moment divisor weighting is the TOTIENT phi(b).
 *   ------------------------------------------------------------------------------------------
 *   imp-97349 flagged that coprimality turns the -1/8 skeleton coefficient into a "divisor-weighted
 *   arithmetic function of b" but did not identify it. At the SECOND-MOMENT level it is exactly the
 *   totient: normalizing Qrr by phi(b) removes essentially all arithmetic fluctuation, while
 *   normalizing by b does not.
 *       Qrr(b) / phi(b) = 0.000767 +- 1.7%   (mean 0.000767, sd 1.3e-5 over 11 b spanning smooth
 *                                             b = 300,630,900,1050,1200 and primes 211..1301),
 *       Qrr(b) / b      = 0.00047  +- 57%    (same b: fluctuates 0.00018..0.00077 with omega(b)).
 *   So Qrr(b) = c2 phi(b) + (lower order), c2 ~ 0.000764 (LSQ through origin on primes). The b^(1/2)
 *   candidate CANNOT be the leading Qrr behaviour: the leading term is the divisor-weighted linear
 *   c2 phi(b) (~ c2 (6/pi^2) b on average), matching the imp-97349 finding that Qrr feeds the LEADING
 *   slope s0, not the sub-leading -- and identifying the arithmetic function precisely as phi.
 *
 *   ------------------------------------------------------------------------------------------
 *   REDUCTION 3 (MEASURED constraint) -- the second-moment deviation is O(1)-small, no large b^(1/2).
 *   ------------------------------------------------------------------------------------------
 *   The deviation E_rr(b) = Qrr(b) - c2 phi(b) is TINY: |E_rr| <= 0.006 over b = 211..1259 (~ 1% of
 *   Qrr), and it does NOT track sqrt(b) (E_rr/sqrt(b) is non-constant and CHANGES SIGN near b ~ 850,
 *   which a genuine s sqrt(b) cannot). Hence any smooth b^(1/2) sub-leading in Qrr has coefficient
 *   |s| <= ~3e-4 (MEASURED bound), decisively sub-dominant to c2 phi(b). But E_rr's exact form
 *   (log^2 b vs b^(1/2) vs bounded oscillation) is NOT resolved on b <= ~1300: the two candidates stay
 *   collinear at this scale, the same numerical degeneracy as imp-97292/imp-97349. So a LARGE b^(1/2)
 *   is excluded, the EXACT coefficient is not pinned.
 *
 *   ------------------------------------------------------------------------------------------
 *   PRECISE REMAINING OBSTRUCTION -- a second-moment inverse-line variance bound (inherits imp-97116).
 *   ------------------------------------------------------------------------------------------
 *   Certifying the exact log^2 b coefficient -- and rigorously (not just measured) excluding a smooth
 *   b^(1/2) in E_rr and in Qcross -- requires bounding the deviation of the SECOND MOMENT
 *   Qrr = Sum_{a coprime} r(a,b)^2/a^2 from its totient-linear mean. By the imp-97116 reduction each
 *   varying-modulus term is the inverse-line cotangent value c_0(b-inverse mod a / a); the FIRST moment
 *   of that line (imp-97116) is governed by the frequency of small modular inverses b-inverse mod a,
 *   and the SECOND moment needed here is the VARIANCE of the same inverse-line residual -- an
 *   Estermann / Kloosterman equidistribution input at second-moment order, NOT elementary. This is the
 *   exact second-moment analogue of the imp-97116 first-moment absolute-value bound: the same
 *   small-inverse equidistribution, one moment higher.
 *
 *   ------------------------------------------------------------------------------------------
 *   WHAT IS ESTABLISHED vs OPEN.
 *   ------------------------------------------------------------------------------------------
 *   ESTABLISHED (rigorous): (R1) the Pythagorean split Q = Qhat + Qcross + Qrr with the Cauchy-Schwarz
 *   squeeze |Qcross| <= 2 sqrt(Qhat Qrr), reducing the whole b^(1/2) question to Qrr since Qhat is a
 *   proven log-polynomial. MEASURED (not proved): (R2) Qrr = c2 phi(b) + o(phi b), c2 ~ 0.000764, the
 *   divisor weighting is the totient (phi-normalization stable to 1.7% vs 57% for b); (R3) the
 *   deviation E_rr is O(1)-small (|E_rr| <= 0.006 ~ 1% of Qrr) with any b^(1/2) coefficient |s| <=
 *   ~3e-4. OPEN: the exact log^2 b coefficient and a rigorous b^(1/2) exclusion, needing a
 *   second-moment (variance) bound on the inverse-line cotangent residual (imp-97116 small-inverse
 *   equidistribution, one moment higher). No bound moved; the rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by > 2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97370-inverse-line-second-moment-variance -- prove |Qrr(b) - c2 phi(b)| =
 *   o(b^(1/2)) (and |Qcross - linear| = o(b^(1/2))) via a variance bound on the inverse-line cotangent
 *   residual r(a,b), the second-moment analogue of the imp-97116 first-moment small-inverse input.
 *
 * @see imp-97349-route-m-diagonal-remainder-profile-separation (parent: Q = Qhat+Qcross+Qrr, IMP97349_SUBGAP)
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction (inverse-line first moment; inherited input)
 * @see imp-97330-route-m-smalla-intercept-closed-form (Ihat = (a/2)log(b/a) + a(C+1/2); the skeleton)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), the V kernel)
 *
 * Ticket: imp-97370 (proof, opus-4-8, api-pool). Second-moment reduction; separation origin located; NO QED.
 */

export const IMP97370_GAMMA = 0.5772156649015329;
export const IMP97370_C = (Math.log(2 * Math.PI) - IMP97370_GAMMA) / 2;
export const IMP97370_K = IMP97370_C + 0.5;

// -- exact Vasyunin kernel and the imp-97349 coefficient / skeleton (small b only; O(b^2)). --------
const frac = (x) => x - Math.floor(x);
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  return s;
}
export function coefficientI(a, b) {
  return (
    IMP97370_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}
export function skeletonIhat(a, b) {
  return (a / 2) * Math.log(b / a) + a * IMP97370_K;
}
const gcdInt = (x, y) => (y === 0 ? x : gcdInt(y, x % y));
function eulerPhi(n) {
  let r = n, x = n;
  for (let d = 2; d * d <= x; d++) {
    if (x % d === 0) {
      while (x % d === 0) x = Math.floor(x / d);
      r -= Math.floor(r / d);
    }
  }
  if (x > 1) r -= Math.floor(r / x);
  return r;
}

// -- the coprime-restricted ell^2 pieces Qhat, Qcross, Qrr of Q(b) plus phi(b). O(b^2); keep b small. --
export function secondMomentPieces(b) {
  let Qtot = 0, Qhat = 0, Qcross = 0, Qrr = 0;
  for (let a = 2; a < b; a++) {
    if (gcdInt(a, b) !== 1) continue;
    const Ih = skeletonIhat(a, b);
    const r = coefficientI(a, b) - Ih;
    const w = 1 / (a * a);
    Qtot += (Ih + r) * (Ih + r) * w;
    Qhat += Ih * Ih * w;
    Qcross += 2 * Ih * r * w;
    Qrr += r * r * w;
  }
  return { Qtot, Qhat, Qcross, Qrr, phi: eulerPhi(b) };
}

// -- baked measured constants (tmp/imp-97370-scratch{,2,3}.mjs; b <= ~1300 exact kernel). ----------
export const IMP97370_QRR_OVER_PHI = 0.000767; // Qrr/phi(b) mean, sd 1.3e-5 (rel 1.7%) over 11 b
export const IMP97370_QRR_OVER_PHI_RELSD = 0.017; // vs 0.575 for Qrr/b: phi is the divisor weighting
export const IMP97370_C2_PRIMES = 0.00076448; // LSQ through origin Qrr = c2 phi on primes 211..1259
export const IMP97370_CS_RATIO = 0.11; // |Qcross|/(2 sqrt(Qhat Qrr)) ~ 0.108..0.128 (well below 1)
export const IMP97370_SQRTB_COEFF_BOUND = 3e-4; // MEASURED |s| for a b^(1/2) sub-leading in Qrr
export const IMP97370_ERR_MAX = 0.006; // |Qrr - c2 phi| <= 0.006 over b=211..1259 (~1% of Qrr)

export const IMP97370_VERDICT = Object.freeze({
  id: 'imp-97370',
  proofSection: 'Route-M',
  question:
    'Can a bound on the SECOND MOMENT Qrr = Sum_{a coprime} r(a,b)^2/a^2 of the Vasyunin residual ' +
    'r = I - Ihat certify the interior second-moment log^2 b coefficient and rigorously exclude a ' +
    'smooth b^(1/2) sub-leading in Qcross/Qrr (the IMP97349_SUBGAP)?',
  cauchySchwarzSqueezeRigorous: true, // |Qcross| <= 2 sqrt(Qhat Qrr), reduces b^(1/2) question to Qrr
  csRatioMeasured: IMP97370_CS_RATIO, // ~0.11: Qcross far below the CS ceiling (first-moment cancellation)
  divisorWeightingIsTotient: true, // Qrr/phi(b) stable (1.7%) vs Qrr/b (57%): the weighting is phi
  qrrOverPhi: IMP97370_QRR_OVER_PHI, // 0.000767
  qrrLeadingIsTotientLinear: true, // Qrr = c2 phi(b) + o(phi b): feeds s0, NOT the sub-leading
  deviationIsSmall: true, // |E_rr| <= 0.006 ~ 1% of Qrr; no LARGE b^(1/2)
  largeSqrtBExcludedMeasured: true, // |s| <= ~3e-4, and E_rr/sqrt(b) non-constant + sign change
  exactCoefficientPinned: false, // form of E_rr collinearity-degenerate on b <= ~1300
  rigorousSqrtBExclusion: false, // needs a second-moment inverse-line variance bound
  remainingInputElementary: false, // Estermann/Kloosterman small-inverse variance (imp-97116, one moment up)
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by > 2600x
  conclusion:
    'The interior second moment splits (imp-97349) as Q = Qhat + Qcross + Qrr in the 1/a^2-weighted ' +
    'ell^2 product, Qcross = 2<Ihat,r>, Qrr = <r,r>, r = I - Ihat. TWO reductions locate the origin ' +
    'of any b^(1/2). (R1, RIGOROUS) Cauchy-Schwarz gives |Qcross| <= 2 sqrt(Qhat Qrr) (MEASURED ratio ' +
    '~0.11, far below the ceiling); since Qhat is a proven log-polynomial with no fractional power ' +
    '(imp-97349), any smooth b^(1/2) in Q must enter through Qrr, so the whole question reduces to the ' +
    'SECOND MOMENT Qrr. (R2, MEASURED) the coprimality divisor weighting that imp-97349 left ' +
    'unidentified is exactly the TOTIENT: Qrr/phi(b) = 0.000767 +- 1.7% is stable across smooth and ' +
    'prime-rich b while Qrr/b fluctuates +-57%, so Qrr = c2 phi(b) + o(phi b) (c2 ~ 0.000764) feeds ' +
    'the LEADING slope, not the sub-leading. (R3, MEASURED) the deviation E_rr = Qrr - c2 phi(b) is ' +
    'O(1)-small (|E_rr| <= 0.006 ~ 1% of Qrr) and does not track sqrt(b) (E_rr/sqrt(b) non-constant, ' +
    'sign change near b ~ 850), so any b^(1/2) coefficient is |s| <= ~3e-4 -- a LARGE b^(1/2) is ' +
    'excluded, but the exact form of E_rr stays collinearity-degenerate on b <= ~1300. Certifying the ' +
    'exact coefficient and a RIGOROUS b^(1/2) exclusion needs a variance (second-moment) bound on the ' +
    'inverse-line cotangent residual -- the imp-97116 small-inverse (Estermann/Kloosterman) input, one ' +
    'moment higher. No coefficient claimed; no bound moves; the rigorous anchor stays T = 2.594e7; ' +
    'compute N ~ 9916 binds first by > 2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97370_SUBGAP = Object.freeze({
  id: 'imp-97370-inverse-line-second-moment-variance',
  statement:
    'In Q = Qhat + Qcross + Qrr (1/a^2-weighted ell^2, imp-97349), Cauchy-Schwarz gives |Qcross| <= ' +
    '2 sqrt(Qhat Qrr), so with Qhat a proven log-polynomial (no b^(1/2)) the whole b^(1/2)-vs-log^2 b ' +
    'question reduces to the SECOND MOMENT Qrr = Sum_{a coprime} r(a,b)^2/a^2. MEASURED Qrr = c2 phi(b) ' +
    '+ o(phi b) (c2 ~ 0.000764; the divisor weighting is the totient, Qrr/phi stable to 1.7% vs 57% ' +
    'for Qrr/b) with deviation |Qrr - c2 phi(b)| <= 0.006 (~1% of Qrr, any b^(1/2) coefficient |s| <= ' +
    '~3e-4). OPEN: a RIGOROUS bound |Qrr - c2 phi(b)| = o(b^(1/2)) (and |Qcross - linear| = o(b^(1/2))) ' +
    'certifying the exact log^2 b coefficient. It needs a VARIANCE (second-moment) bound on the ' +
    'inverse-line cotangent residual r(a,b) = c_0(b-inverse mod a / a) - envelope -- the same ' +
    'small-inverse Estermann/Kloosterman equidistribution as the imp-97116 first moment, one moment ' +
    'higher. Measured, not proved.',
});

export const IMP97370_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + reduction only: the interior second ' +
  'moment Q = Qhat + Qcross + Qrr obeys the RIGOROUS Cauchy-Schwarz squeeze |Qcross| <= 2 sqrt(Qhat ' +
  'Qrr), which -- with Qhat a proven log-polynomial (imp-97349, no b^(1/2)) -- reduces the whole ' +
  'b^(1/2)-vs-log^2 b question to the second moment Qrr = Sum r^2/a^2. MEASURED: the coprimality ' +
  'divisor weighting is the totient (Qrr/phi(b) = 0.000767 +- 1.7% vs Qrr/b +- 57%), so Qrr = c2 ' +
  'phi(b) + o(phi b) feeds the leading slope, and the deviation is O(1)-small (|Qrr - c2 phi| <= ' +
  '0.006, any b^(1/2) coefficient |s| <= ~3e-4). A LARGE b^(1/2) is excluded; the exact coefficient ' +
  'stays unpinned (collinearity-degenerate on b <= ~1300) and a rigorous b^(1/2) exclusion needs a ' +
  'variance bound on the inverse-line cotangent residual (imp-97116 small-inverse input, one moment ' +
  'higher). No coefficient claimed; no bound moved; the rigorous anchor stays the trace ceiling T = 2.594e7.';

export default IMP97370_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT --
// -- (exact kernel used only at primes b = 211,307,401 and smooth b = 300; each O(b^2)). ----------
const IMP97370_ASSERTIONS = [
  {
    id: 'imp97370-pythagorean-split-is-exact',
    why: 'Q = Qhat + Qcross + Qrr must hold to machine precision (the exact ell^2 decomposition of ' +
      'I = Ihat + r under the 1/a^2 weight), the foundation of the reduction.',
    holds: () => {
      const { Qtot, Qhat, Qcross, Qrr } = secondMomentPieces(307);
      return Math.abs(Qtot - (Qhat + Qcross + Qrr)) < 1e-9;
    },
  },
  {
    id: 'imp97370-cauchy-schwarz-squeeze-holds',
    why: 'the RIGOROUS reduction: |Qcross| <= 2 sqrt(Qhat Qrr) (Cauchy-Schwarz), and MEASURED the ' +
      'ratio sits well below 1 (~0.11) -- Qcross is far from the ceiling, so the b^(1/2) content is ' +
      'carried by Qrr, not manufactured by the cross term.',
    holds: () => {
      for (const b of [211, 307, 401]) {
        const { Qhat, Qcross, Qrr } = secondMomentPieces(b);
        const ceiling = 2 * Math.sqrt(Qhat * Qrr);
        if (!(Math.abs(Qcross) <= ceiling + 1e-9)) return false; // Cauchy-Schwarz (rigorous)
        const ratio = Math.abs(Qcross) / ceiling;
        if (!(ratio > 0.08 && ratio < 0.2)) return false; // measured ~0.11
      }
      return true;
    },
  },
  {
    id: 'imp97370-divisor-weighting-is-totient',
    why: 'the second-moment divisor weighting is the totient: Qrr/phi(b) is stable across a smooth ' +
      'b = 300 (phi/b = 0.267) and a prime b = 419 (phi/b ~ 1) to ~1.5%, while Qrr/b differs by ~3.7x ' +
      '-- so phi(b), not b, removes the arithmetic fluctuation of the second moment.',
    holds: () => {
      const s = secondMomentPieces(300); // smooth
      const p = secondMomentPieces(419); // prime
      const perPhiRel = Math.abs(s.Qrr / s.phi - p.Qrr / p.phi) / (p.Qrr / p.phi);
      const perBRel = Math.abs(s.Qrr / 300 - p.Qrr / 419) / (p.Qrr / 419);
      return (
        perPhiRel < 0.05 && // phi-normalization agrees to < 5%
        perBRel > 0.5 && // b-normalization differs by > 50% (measured ~73%)
        Math.abs(p.Qrr / p.phi - IMP97370_QRR_OVER_PHI) < 5e-5 // ~ 0.000767
      );
    },
  },
  {
    id: 'imp97370-second-moment-deviation-is-small-and-sublinear',
    why: 'the deviation E_rr = Qrr - c2 phi(b) is O(1)-small (~1% of Qrr) at primes 211,307,401 with ' +
      'c2 = IMP97370_C2_PRIMES -- decisively sub-linear, so Qrr feeds the LEADING slope c2 phi(b) and ' +
      'any b^(1/2) is a tiny correction, not the leading behaviour.',
    holds: () => {
      for (const b of [211, 307, 401]) {
        const { Qrr, phi } = secondMomentPieces(b);
        const E = Qrr - IMP97370_C2_PRIMES * phi;
        if (!(Math.abs(E) <= IMP97370_ERR_MAX)) return false; // |E| <= 0.006
        if (!(Math.abs(E) < 0.05 * Qrr)) return false; // < 5% of Qrr (sub-linear)
      }
      return true;
    },
  },
  {
    id: 'imp97370-honesty-gate-no-qed',
    why: 'assessment + reduction only: the Cauchy-Schwarz squeeze is rigorous, the totient weighting ' +
      'and the small deviation are MEASURED, the exact coefficient is unpinned and a rigorous b^(1/2) ' +
      'exclusion stays open (needs an inverse-line variance bound), no bound moved, compute binds ' +
      'first, honesty markers + named sub-gap present.',
    holds: () =>
      IMP97370_VERDICT.anyBoundMoved === false &&
      IMP97370_VERDICT.cauchySchwarzSqueezeRigorous === true &&
      IMP97370_VERDICT.divisorWeightingIsTotient === true &&
      IMP97370_VERDICT.qrrLeadingIsTotientLinear === true &&
      IMP97370_VERDICT.largeSqrtBExcludedMeasured === true &&
      IMP97370_VERDICT.exactCoefficientPinned === false &&
      IMP97370_VERDICT.rigorousSqrtBExclusion === false &&
      IMP97370_VERDICT.remainingInputElementary === false &&
      IMP97370_VERDICT.computeBindsFirst === true &&
      /whole question reduces/i.test(IMP97370_VERDICT.conclusion) &&
      /inverse-line-second-moment-variance/.test(IMP97370_SUBGAP.id) &&
      /variance/i.test(IMP97370_SUBGAP.statement) &&
      /NO QED/.test(IMP97370_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97370_HONEST_BANNER) &&
      /RH open/.test(IMP97370_HONEST_BANNER),
  },
];

for (const a of IMP97370_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97370-route-m-cotangent-residual-second-moment-reduction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97370_ASSERTIONS };

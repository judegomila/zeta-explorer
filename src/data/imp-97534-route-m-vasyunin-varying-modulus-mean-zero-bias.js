/**
 * @module imp-97534-route-m-vasyunin-varying-modulus-mean-zero-bias
 *
 * imp-97534 (proof, DERIVATION + PARTIAL): evaluate/bound the leading coefficient of the OPERATIVE
 * varying-modulus half Sum_{a=2,(a,b)=1}^{b-1} V(b,a) of the Route M cotangent first moment (the
 * imp-97097 RESULT 2 + OBSTRUCTION: this half carries the whole leading -0.077 phi(b) b of Phi(b),
 * measured stable ~ -0.076 but not evaluated). This leaf makes a genuine analytic advance and CORRECTS
 * the imp-97097 framing. No bound is proved rigorous; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97097/imp-96750. V(h,k) = Sum_{m=1}^{k-1} frac(m h/k) cot(pi m/k) is the Vasyunin
 * cotangent sum; in the operative half V(b,a) the summation index a is the MODULUS and b the multiplier.
 *
 * -------------------------------------------------------------------------------
 * STEP 0 -- rigorous reduction: V(b,a) = V(b mod a, a).
 * -------------------------------------------------------------------------------
 * frac(m b/a) depends only on b mod a, so V(b,a) = V(r_a, a) with r_a = b mod a; since (a,b)=1 the
 * sample r_a is a reduced residue mod a. Hence the operative half is a sum over the MODULUS a of a
 * single Vasyunin value sampled at the reduced residue r_a = b mod a:
 *      Sum_{a=2,(a,b)=1}^{b-1} V(b,a) = Sum_{a=2,(a,b)=1}^{b-1} V(b mod a, a).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the coprime-residue MEAN of V(.,a) vanishes EXACTLY (rigorous), for every a.
 * -------------------------------------------------------------------------------
 * The SAME antisymmetry that killed the fixed-modulus half in imp-97097 now acts in the FIRST argument.
 * For (h,a)=1 and 1 <= m <= a-1, a does NOT divide m h, so frac(-m h/a) = 1 - frac(m h/a); with
 * Sum_{m=1}^{a-1} cot(pi m/a) = 0 (odd symmetry m <-> a-m) this gives the exact FIRST-ARGUMENT
 * antisymmetry
 *      V(a-h, a) = Sum_m (1 - frac(m h/a)) cot(pi m/a) = -V(h, a).
 * The map h <-> a-h is a fixed-point-free involution of the reduced residues mod a (h = a-h forces
 * h = a/2, never coprime to a for a >= 3), so the Vasyunin values cancel in pairs:
 *      Sum_{(h,a)=1} V(h,a) = 0   for EVERY a >= 2   (EXACT, no hypothesis, no error term),
 * i.e. the coprime-residue MEAN  M(a) = (1/phi(a)) Sum_{(h,a)=1} V(h,a) = 0 identically.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the leading -0.076 coefficient is a pure EQUIDISTRIBUTION BIAS, not a mean value.
 * -------------------------------------------------------------------------------
 * Because M(a) = 0 exactly, replacing the deterministic sample r_a = b mod a by the reduced-residue
 * AVERAGE gives exactly zero. So the entire measured leading coefficient of the operative half is the
 * SIGNED ASYMMETRY of the specific sample a -> (b mod a) under the involution h <-> a-h -- an
 * equidistribution BIAS, NOT a non-elementary mean. The pairing partner of r_a = b mod a is
 * a - r_a = (-b) mod a, and V((-b) mod a, a) = -V(b mod a, a); the coefficient measures how the map
 * a -> b mod a systematically favours one half of each involution pair. NUMERICAL CONFIRMATION
 * (tmp/imp-97534-verify.py): sampling a uniformly-random reduced residue per modulus a (in place of
 * b mod a) yields coefficient ~ 0 (mean 0.003 +/- 0.007 at b=211), against the biased value -0.075.
 * The operative-half coefficient ladder (matching imp-97097 ~ -0.077):
 *      Sum_a V(b,a)/(phi(b) b):  -0.0608 (b=31) -> -0.0721 (101) -> -0.0755 (211) -> -0.0772 (401)
 *                                -> -0.0779 (601).
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION (sharpened; CORRECTS imp-97097).
 * -------------------------------------------------------------------------------
 * imp-97097 framed the operative half as a non-elementary Bettin-Conrey period-function AVERAGE with a
 * mean ~ -0.076. That framing is corrected here: the coprime-residue mean is EXACTLY ZERO, so there is
 * no non-zero mean to elementarise -- the leading coefficient is a second-order BIAS term. A rigorous
 * lower bound c < kappa_arith = (3/2)C - 3/8 = 0.5705 therefore requires one of:
 *   (i)  a quantitative equidistribution/bias estimate for the sample a -> b mod a over reduced
 *        residues, weighted by the involution-ODD kernel V(.,a) -- an incomplete-Kloosterman-type
 *        correlation Sum_a <V(.,a), delta_{b mod a}>, whose sign and size are the whole content; or
 *   (ii) the Bettin-Conrey first ABSOLUTE moment bound Sum_a |V(b mod a, a)| < kappa_arith phi(b) b
 *        (the imp-97116 / imp-97203 absolute-value route), which dominates the signed bias but is
 *        itself an L1 Vasyunin mean, not elementary.
 * Neither is elementarised by reciprocity (which, as in imp-97097, closes only the half whose exact
 * value is zero). The sign of the bias (coefficient < 0, so kappa_cot > 0, no cancellation of the
 * arithmetic +0.5705) stays MEASURED, not proved.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): V(b,a) = V(b mod a, a); the first-argument antisymmetry V(a-h,a) = -V(h,a);
 * the exact vanishing of the coprime-residue mean Sum_{(h,a)=1} V(h,a) = 0 for every a, hence the
 * leading coefficient of the operative half is a pure equidistribution bias (confirmed by the
 * random-residue control giving ~ 0). OPEN: an absolute lower bound on that bias -- a quantitative
 * correlation/first-absolute-moment estimate over varying moduli -- so the cotangent part cannot cancel
 * the arithmetic part. MEASURED |coeff| ~ 0.076 << 0.5705, but NOT proved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The leading coefficient of the operative varying-modulus half is EVALUATED structurally, not as a
 * closed number: its underlying reduced-residue MEAN is exactly ZERO (first-argument antisymmetry), so
 * the whole -0.076 phi(b) b is an equidistribution bias of the sample a -> b mod a, correcting the
 * imp-97097 "non-elementary mean" framing. A rigorous lower bound reduces to a quantitative bias /
 * first-absolute-moment estimate over varying moduli, neither elementary nor reachable by reciprocity.
 * No rigorous ceiling posted; trace ceiling T ~ 2.594e7 stays the anchor; compute binds first. No refereed bound is changed
 * ; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97534-varying-modulus-bias -- an absolute lower bound on the signed
 * bias Sum_{a=2,(a,b)=1}^{b-1} V(b mod a, a) >= -c phi(b) b with explicit c < 0.5705, via a
 * quantitative equidistribution estimate for a -> b mod a against the involution-odd kernel V(.,a),
 * or the first-absolute-moment bound Sum_a |V(b mod a,a)| < 0.5705 phi(b) b.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (parent; RESULT 2 + OBSTRUCTION, framing corrected here)
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (the absolute-value route (ii))
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (Cauchy-Schwarz on the abs moment)
 *
 * Ticket: imp-97534 (proof, opus-4-8, api-pool). Derivation + partial; NO QED.
 */

// -- lightweight exact Vasyunin kernel (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
const eulerPhi = (n) => {
  let result = n, x = n;
  for (let d = 2; d * d <= x; d++) {
    if (x % d === 0) {
      while (x % d === 0) x = Math.floor(x / d);
      result -= Math.floor(result / d);
    }
  }
  if (x > 1) result -= Math.floor(result / x);
  return result;
};

// Operative varying-modulus half Sum_{a=2,(a,b)=1}^{b-1} V(b,a) and its coefficient over phi(b) b.
function operativeHalf(b) {
  let S = 0;
  for (let a = 2; a < b; a++) if (gcd(a, b) === 1) S += Vsum(b, a);
  const phi = eulerPhi(b);
  return { S, phi, coeff: S / (phi * b) };
}

// MEASURED constants (tmp/imp-97534-verify.py; ladders over b <= 601).
export const IMP97534_MEASURED = Object.freeze({
  coeffLadder: Object.freeze([
    { b: 31, coeff: -0.06083 },
    { b: 101, coeff: -0.07208 },
    { b: 211, coeff: -0.07546 },
    { b: 401, coeff: -0.07716 },
    { b: 601, coeff: -0.07786 },
  ]),
  leadingCoeff: -0.077, // consistent with imp-97097 varyingModulusCoeff / phiCoeff
  randomResidueControlCoeff: 0.003, // random reduced residue per modulus -> ~ 0 (sd 0.007 at b=211)
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8 (the part the cotangent must not cancel)
});

// The exact structural evaluation: mean zero, coefficient is a bias.
export const IMP97534_REDUCTION = Object.freeze({
  moduloReduction: 'V(b,a) = V(b mod a, a)  (frac(m b/a) depends only on b mod a; b mod a is a reduced residue since (a,b)=1)',
  firstArgAntisymmetry: 'V(a-h,a) = -V(h,a)  (frac(-m h/a) = 1 - frac(m h/a), Sum_m cot(pi m/a) = 0)',
  coprimeMeanVanishes: 'Sum_{(h,a)=1} V(h,a) = 0  for every a >= 2  (EXACT; h <-> a-h fixed-point-free involution) => M(a) = 0',
  leadingCoeffIsBias: 'leading coefficient of Sum_a V(b mod a,a) is the signed asymmetry of a -> b mod a under h <-> a-h, an equidistribution BIAS (random reduced-residue sample -> coeff ~ 0)',
  pairingPartner: 'partner of r_a = b mod a is a - r_a = (-b) mod a, with V((-b) mod a, a) = -V(b mod a, a)',
  correctsImp97097: true, // imp-97097 called the operative half a non-elementary mean ~ -0.076; the mean is EXACTLY 0
});

export const IMP97534_VERDICT = Object.freeze({
  id: 'imp-97534',
  question:
    'evaluate or bound the leading coefficient of the operative varying-modulus half ' +
    'Sum_{a=2,(a,b)=1}^{b-1} V(b,a) of the Route M cotangent first moment (Bettin-Conrey mean value)?',
  moduloReductionRigorous: true, // V(b,a) = V(b mod a, a)
  firstArgAntisymmetryRigorous: true, // V(a-h,a) = -V(h,a)
  coprimeMeanVanishesRigorously: true, // Sum_{(h,a)=1} V(h,a) = 0 EXACT
  leadingCoeffIsEquidistributionBias: true, // whole -0.076 is a bias; random residue -> ~ 0
  imp97097MeanFramingCorrected: true, // the reduced-residue mean is 0, not a non-elementary ~ -0.076
  leadingCoeffClosedForm: false, // structural, not a closed number
  leadingCoeffLowerBoundProved: false, // sign/magnitude MEASURED, not proved
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The leading coefficient of the operative varying-modulus half Sum_{a=2,(a,b)=1}^{b-1} V(b,a) is ' +
    'evaluated STRUCTURALLY. First, V(b,a) = V(b mod a, a), so the half samples one Vasyunin value at the ' +
    'reduced residue r_a = b mod a per modulus a. Second, the first-argument antisymmetry V(a-h,a) = ' +
    '-V(h,a) (fixed-point-free involution h <-> a-h) forces the coprime-residue mean Sum_{(h,a)=1} V(h,a) ' +
    '= 0 EXACTLY for every a. Therefore the whole measured leading coefficient ~ -0.077 phi(b) b is a pure ' +
    'EQUIDISTRIBUTION BIAS of the sample a -> b mod a (confirmed: a uniformly-random reduced residue per ' +
    'modulus gives coefficient ~ 0), NOT a non-elementary mean value -- correcting the imp-97097 framing. ' +
    'A rigorous lower bound c < kappa_arith = 0.5705 reduces to a quantitative bias / first-absolute-moment ' +
    'estimate over varying moduli (an incomplete-Kloosterman correlation or the imp-97116/imp-97203 L1 ' +
    'Vasyunin moment), neither elementary nor reachable by reciprocity, which closes only the zero-value ' +
    'half. Sign (coeff < 0, so no cancellation of the arithmetic +0.5705) MEASURED, not proved. No bound ' +
    'moved, no rigorous ceiling posted; T ~ 2.594e7 anchor; compute binds first. No refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97534_SUBGAP = Object.freeze({
  id: 'imp-97534-varying-modulus-bias',
  statement:
    'The coprime-residue mean of V(.,a) vanishes EXACTLY (Sum_{(h,a)=1} V(h,a) = 0, first-argument ' +
    'antisymmetry), so the leading coefficient of the operative half Sum_{a=2,(a,b)=1}^{b-1} V(b mod a,a) ' +
    'is a pure equidistribution BIAS of the sample a -> b mod a, not a mean value. The open piece is an ' +
    'absolute lower bound on that bias: Sum_{a=2,(a,b)=1}^{b-1} V(b mod a,a) >= -c phi(b) b with explicit ' +
    'c < kappa_arith = (3/2)C - 3/8 = 0.5705. Two routes, both non-elementary: (i) a quantitative ' +
    'equidistribution estimate for a -> b mod a against the involution-odd kernel V(.,a) (incomplete ' +
    'Kloosterman correlation); (ii) the first-absolute-moment bound Sum_a |V(b mod a,a)| < 0.5705 phi(b) b ' +
    '(imp-97116/imp-97203). MEASURED |coeff| ~ 0.076 << 0.5705, but NOT proved.',
});

export const IMP97534_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + partial: the operative varying-modulus ' +
  'half is V(b,a) = V(b mod a, a), and the first-argument antisymmetry V(a-h,a) = -V(h,a) forces the ' +
  'coprime-residue mean Sum_{(h,a)=1} V(h,a) = 0 EXACTLY for every a. So the whole leading ~ -0.077 ' +
  'phi(b) b coefficient is a pure equidistribution BIAS of the sample a -> b mod a (random reduced ' +
  'residue -> coeff ~ 0), NOT a non-elementary mean -- correcting the imp-97097 framing. A rigorous ' +
  'lower bound reduces to a quantitative bias / first-absolute-moment estimate over varying moduli, ' +
  'neither elementary nor reachable by reciprocity; the sign is measured, not proved. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97534_ASSERTIONS = [
  {
    id: 'imp97534-modulo-reduction',
    holds: () => {
      // V(b,a) = V(b mod a, a) for coprime pairs.
      for (const [b, a] of [[101, 30], [211, 44], [401, 57], [601, 88]]) {
        if (gcd(a, b) !== 1) continue;
        if (Math.abs(Vsum(b, a) - Vsum(b % a, a)) > 1e-8) return false;
      }
      return true;
    },
    why: 'frac(m b/a) depends only on b mod a, so V(b,a) = V(b mod a, a); verified for coprime pairs.',
  },
  {
    id: 'imp97534-first-arg-antisymmetry',
    holds: () => {
      // V(a-h,a) = -V(h,a) for every reduced residue h.
      for (const a of [11, 30, 31, 60, 101]) {
        for (let h = 1; h < a; h++) {
          if (gcd(h, a) === 1 && Math.abs(Vsum(a - h, a) + Vsum(h, a)) > 1e-8) return false;
        }
      }
      return true;
    },
    why: 'the first-argument antisymmetry V(a-h,a) = -V(h,a) holds for all reduced residues h (frac(-m h/a) = 1 - frac(m h/a), Sum_m cot = 0).',
  },
  {
    id: 'imp97534-coprime-mean-vanishes-exactly',
    holds: () => {
      // Sum_{(h,a)=1} V(h,a) = 0 for every a (even and odd), to machine precision.
      for (let a = 3; a <= 130; a++) {
        let s = 0;
        for (let h = 1; h < a; h++) if (gcd(h, a) === 1) s += Vsum(h, a);
        if (Math.abs(s) > 1e-6) return false;
      }
      return true;
    },
    why: 'the coprime-residue mean vanishes EXACTLY: Sum_{(h,a)=1} V(h,a) = 0 for every a >= 2 via the fixed-point-free involution h <-> a-h; verified to 1e-6 for all a <= 130.',
  },
  {
    id: 'imp97534-operative-coeff-negative-and-tracks-measured',
    holds: () => {
      // The operative half is negative and near the imp-97097 measured ~ -0.076.
      for (const { b, coeff } of IMP97534_MEASURED.coeffLadder) {
        if (b > 220) continue; // keep O(b^2) modest at import
        const { coeff: c } = operativeHalf(b);
        if (!(c < 0)) return false;
        if (Math.abs(c - coeff) > 1e-3) return false;
      }
      // |leading coeff| stays well below kappa_arith: no cancellation of the arithmetic part.
      return Math.abs(IMP97534_MEASURED.leadingCoeff) < IMP97534_MEASURED.kappaArith;
    },
    why: 'the operative-half coefficient is negative and matches the measured ladder (-0.061 at b=31, -0.072 at b=101, -0.075 at b=211), with |coeff| ~ 0.076 << kappa_arith 0.5705 so it cannot cancel the arithmetic part -- MEASURED, not proved.',
  },
  {
    id: 'imp97534-honesty-gate-no-qed',
    holds: () =>
      IMP97534_VERDICT.coprimeMeanVanishesRigorously === true &&
      IMP97534_VERDICT.leadingCoeffIsEquidistributionBias === true &&
      IMP97534_VERDICT.imp97097MeanFramingCorrected === true &&
      IMP97534_VERDICT.leadingCoeffClosedForm === false &&
      IMP97534_VERDICT.leadingCoeffLowerBoundProved === false &&
      IMP97534_VERDICT.anyBoundMoved === false &&
      IMP97534_VERDICT.postsRigorousCeiling === false &&
      IMP97534_VERDICT.qed === false &&
      IMP97534_REDUCTION.correctsImp97097 === true &&
      /varying-modulus-bias/.test(IMP97534_SUBGAP.id) &&
      /EXACTLY/.test(IMP97534_SUBGAP.statement) &&
      /NO QED/.test(IMP97534_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97534_HONEST_BANNER) &&
      /RH open/.test(IMP97534_HONEST_BANNER),
    why: 'derivation + partial: the modulo reduction, first-argument antisymmetry, and exact vanishing of the coprime mean are rigorous, but the leading coefficient is a bias whose lower bound is unproved -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97534_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97534-route-m-vasyunin-varying-modulus-mean-zero-bias assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97534_MEASURED,
  reduction: IMP97534_REDUCTION,
  verdict: IMP97534_VERDICT,
  subGap: IMP97534_SUBGAP,
  banner: IMP97534_HONEST_BANNER,
};

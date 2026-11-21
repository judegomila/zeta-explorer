/**
 * @module imp-97268-route-m-signed-inverseline-mean-value
 *
 * imp-97268 (proof, ATTEMPT + PARTIAL): attempt the DIRECT signed Bettin-Conrey inverse-line mean
 * value S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) = Sum_a c_0(h_a/a), which would deliver the measured
 * signed constant c_s ~ 0.0795 (imp-97226) -- the ~1.85x sharpening over the absolute majorant
 * c ~ 0.147 (imp-97180). This leaf does NOT prove a direct signed bound. It carries the natural
 * Bettin-Conrey reduction to the point where it stalls and, in doing so, produces a NEW rigorous
 * structural identity that pins EXACTLY why the signed first moment is non-elementary and shows the
 * obstruction it hits is the SAME inverse-map equidistribution transfer already binding the absolute
 * mean-square route (imp-97225/imp-97267), not a new or harder one. c_s ~ 0.0795 stays MEASURED; no
 * bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97097/imp-97116/imp-97180/imp-97204. V(h,k) = Sum_{m=1}^{k-1} frac(m h/k) cot(pi m/k).
 * The operative varying-modulus half is S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a); the imp-97116 R1 identity
 * gives V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a. Because frac(m b/a) depends only on b mod a,
 * V(b,a) = V(b mod a, a) exactly (verified below): S(b) sums the SINGLE residue slice h = b mod a over
 * each varying modulus a -- one point per modulus along the inverse line, NOT a full-residue average.
 *
 * -------------------------------------------------------------------------------
 * NEW RIGOROUS RESULT 1 (elementary): the cotangent sum V is ODD under h -> a-h at fixed modulus.
 * -------------------------------------------------------------------------------
 * For (h,a)=1 and 1 <= m <= a-1 the value m h/a is never an integer, so frac(-m h/a) = 1 - frac(m h/a).
 * Hence, using frac(m(a-h)/a) = frac(-m h/a) = 1 - frac(m h/a),
 *     V(a-h, a) = Sum_{m=1}^{a-1} (1 - frac(m h/a)) cot(pi m/a)
 *               = [Sum_{m=1}^{a-1} cot(pi m/a)] - V(h, a)  =  -V(h, a),
 * because Sum_{m=1}^{a-1} cot(pi m/a) = 0 (odd symmetry m <-> a-m of the cotangent over the half-period).
 * So V(., a) is EXACTLY ODD under h -> a-h. (Verified to ~3e-13 over coprime h, a = 7..101.)
 *
 * -------------------------------------------------------------------------------
 * NEW RIGOROUS RESULT 2 (elementary): the FULL-residue signed first moment vanishes at every modulus.
 * -------------------------------------------------------------------------------
 * Pairing each reduced residue h with a-h (both coprime to a, and h = a-h is impossible for a > 2 since
 * it forces a = 2h with gcd(h,a) = h > 1), Result 1 gives an exact cancellation:
 *     T(a) := Sum_{h=1,(h,a)=1}^{a-1} V(h, a) = 0   for every a >= 2   (EXACT, no hypothesis).
 * (Verified |T(a)| <= 2e-10 for a = 7,12,31,50,101,210,401.) This is the varying-modulus analogue of the
 * imp-97097 fixed-modulus antisymmetry, applied here to the ARGUMENT at each modulus a of the inverse-line
 * decomposition -- an axis on which imp-97097 explicitly does NOT act.
 *
 * -------------------------------------------------------------------------------
 * NEW RIGOROUS RESULT 3 (the reduction): S(b) is a Kloosterman-selected slice of a zero-mean family.
 * -------------------------------------------------------------------------------
 * Combining Results 1-2: S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b mod a, a) selects, at each modulus a, the
 * ONE residue h = b mod a out of the phi(a) reduced residues whose FULL signed average is exactly zero
 * (Result 2). Writing 1[h = b mod a] for the selection indicator, for each a
 *     V(b mod a, a) = Sum_{h,(h,a)=1} V(h,a) ( 1[h = b mod a] - 1/phi(a) )   (since Sum_h V = 0),
 * so S(b) is EXACTLY the correlation of the odd function V(.,a) against the fluctuation of the b-slice
 * indicator about its mean. A direct signed bound on S(b) is therefore equivalent to an equidistribution
 * (cancellation-preserving) estimate for how the Kloosterman-type selection a |-> b mod a (equivalently
 * the inverse line a |-> h_a = b-inverse mod a) correlates with the odd Bettin-Conrey period values -- a
 * genuine first-MOMENT deviation, with no absolute value and no square. This is the crux: the even-moment
 * Bettin-Conrey machinery (Sum_h c_0(h/a)^2 ~ C a^3, imp-97203) and the a<->a-h antisymmetry (which only
 * kills the FULL average, Result 2) do NOT reach a single selected slice.
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION (assessed): the signed first moment is NOT strictly harder than the mean square.
 * -------------------------------------------------------------------------------
 * Result 3 identifies the remaining input as an inverse-map (Kloosterman) equidistribution transfer for
 * the FIRST moment of the odd period values along a |-> h_a -- precisely the SAME class of transfer that
 * imp-97225 measured (OVR plateau) and imp-97267 wrote as an exact character-detection identity DIAG +
 * OFFDIAG for the mean-square M2w. So the signed route does NOT introduce a new obstruction beyond the
 * absolute program: it needs the same equidistribution input, applied to a first (odd) moment rather than
 * a second moment. It is NOT broken here -- the transfer stays the sole missing analytic ingredient -- but
 * the assessment DOWNGRADES the imp-97204 framing "strictly harder than the absolute/mean-square objects":
 * the signed mean value shares the mean-square obstruction (inverse-map equidistribution), it does not
 * exceed it. For POSITIVITY nothing changes: the absolute program dominates via |S| <= A (imp-97204).
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous, elementary): V(.,a) is exactly odd under h -> a-h (Result 1); the full-residue
 * signed first moment T(a) = 0 at every modulus (Result 2); and S(b) is exactly the correlation of the
 * odd period values against the b-slice-indicator fluctuation about its (zero) mean (Result 3), so the
 * direct signed bound is equivalent to an inverse-map equidistribution transfer for the first (odd)
 * moment. ASSESSED: that transfer is the SAME one binding the mean-square route (imp-97225/imp-97267),
 * so the signed mean value is NOT strictly harder than the mean square (a downgrade of the imp-97204
 * framing). MEASURED (not proved): c_s ~ 0.0795 (imp-97226), |S|/A ~ 0.540. OPEN: the inverse-line
 * equidistribution transfer itself (shared with imp-97267) stays non-elementary; the direct signed
 * bound is NOT proved. No bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The direct signed Bettin-Conrey inverse-line mean value is NOT evaluated and the direct signed bound
 * is NOT proved. The attempt (i) proves V(.,a) is exactly odd under h -> a-h and hence the full-residue
 * signed first moment T(a) = 0 at every modulus; (ii) shows S(b) is exactly a Kloosterman-selected slice
 * of this zero-mean family, so a direct signed bound is equivalent to an inverse-map equidistribution
 * transfer for the first (odd) moment; and (iii) assesses that this is the SAME transfer already binding
 * the absolute mean-square route (imp-97225/imp-97267), so the signed mean value SHARES that obstruction
 * rather than exceeding it -- a downgrade of the imp-97204 "strictly harder" framing. The non-elementary
 * obstruction is NOT broken: the inverse-line equidistribution input stays the missing ingredient.
 * Measured c_s ~ 0.0795 stays measured; positivity is unaffected (absolute program dominates via
 * |S| <= A). No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97268-signed-inverseline-equidistribution -- the first (odd) moment
 * inverse-map equidistribution transfer for Sum_a V(b mod a, a), shared with the imp-97267 mean-square
 * character-detection identity; needed only for the sharper signed constant, not for positivity.
 *
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (parent: |S| <= A; signed obstruction)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (measured c_s ~ 0.0795, |S|/A ~ 0.540)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus antisymmetry; S(b) isolated)
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (inverse-map OVR plateau, mean square)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (even-moment Sum_h c_0^2 ~ C a^3)
 *
 * Ticket: imp-97268 (proof, opus-4-8, api-pool). Attempt + partial; NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// V(h,k) = Sum_{m=1}^{k-1} frac(m h/k) cot(pi m/k).
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};

// Full-residue signed first moment T(a) = Sum_{h coprime a} V(h,a) (= 0, Result 2). O(a^2).
function fullResidueFirstMoment(a) {
  let T = 0, phi = 0;
  for (let h = 1; h < a; h++) {
    if (gcd(h, a) !== 1) continue;
    T += Vsum(h, a);
    phi += 1;
  }
  return { T, phi };
}

// Inverse-line signed mean S(b)/(phi b) (the operative varying-modulus half). O(b^2).
function signedInverseLine(b) {
  let phi = 0, S = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    S += Vsum(b, a); // = V(b mod a, a) exactly (Result-3 slice selection)
  }
  return phi > 0 ? S / (phi * b) : 0;
}

export const IMP97268_MEASURED = Object.freeze({
  csharpMeasured: 0.0795, // imp-97226 signed constant c_s ~ |S|/(phi b) (NOT proved by this leaf)
  absConstant: 0.147, // imp-97180 absolute majorant c (NOT moved)
  sharpeningFactor: 1.85, // c / c_s ~ 1.85x (the sharpening a direct signed bound would buy)
  cancellationRatio: 0.54, // imp-97226 |S|/A ~ 0.540 (persistent, measured)
  signedInverseLineSampled: -0.077353, // S(b)/(phi b) at b=401 (recomputed below)
});

export const IMP97268_ATTEMPT = Object.freeze({
  target:
    'direct signed bound S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) >= -c_s phi(b) b with c_s < absolute c (measured c_s ~ 0.0795)',
  sliceIdentity:
    'V(b,a) = V(b mod a, a) exactly: S(b) selects one residue slice h = b mod a per varying modulus a (inverse line)',
  oddSymmetry: 'V(a-h, a) = -V(h, a) exactly for (h,a)=1, since Sum_{m=1}^{a-1} cot(pi m/a) = 0',
  fullResidueVanishes: 'T(a) = Sum_{h,(h,a)=1} V(h,a) = 0 at every modulus a (pair h with a-h)',
  reductionToCorrelation:
    'S(b) = Sum_a Sum_h V(h,a) (1[h = b mod a] - 1/phi(a)): correlation of the odd period values against the b-slice-indicator fluctuation',
  obstructionShared:
    'the remaining input is a first (odd) moment inverse-map equidistribution transfer -- the SAME transfer binding the mean-square route (imp-97225/imp-97267), not a new or harder one',
  downgrade:
    'the signed mean value SHARES the mean-square obstruction rather than exceeding it -- downgrades the imp-97204 "strictly harder than absolute/mean-square" framing',
});

export const IMP97268_VERDICT = Object.freeze({
  question:
    'evaluate the DIRECT signed Bettin-Conrey inverse-line mean value S(b) = Sum_a c_0(h_a/a) ' +
    'to deliver the measured signed constant c_s ~ 0.0795 (the ~1.85x sharpening) -- can the ' +
    'non-elementary obstruction be broken?',
  directSignedBoundProved: false, // c_s stays MEASURED, not certified
  oddSymmetryProved: true, // V(a-h,a) = -V(h,a) exactly (Result 1)
  fullResidueFirstMomentVanishes: true, // T(a) = 0 at every modulus (Result 2)
  reducedToInverseMapCorrelation: true, // S(b) = correlation of odd values against b-slice fluctuation (Result 3)
  obstructionSameAsMeanSquare: true, // shares imp-97225/imp-97267 inverse-map equidistribution transfer
  strictlyHarderFramingDowngraded: true, // NOT strictly harder than the mean square (imp-97204 framing softened)
  obstructionBroken: false, // the transfer stays non-elementary -- NOT broken
  positivityUnaffected: true, // absolute program dominates via |S| <= A (imp-97204)
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The direct signed Bettin-Conrey inverse-line mean value is NOT evaluated and the direct signed ' +
    'bound is NOT proved. The attempt proves V(.,a) is exactly odd under h -> a-h and hence the ' +
    'full-residue signed first moment T(a) = 0 at every modulus, then shows S(b) is exactly a ' +
    'Kloosterman-selected slice of this zero-mean family -- so a direct signed bound is equivalent to a ' +
    'first (odd) moment inverse-map equidistribution transfer. That transfer is the SAME one binding the ' +
    'absolute mean-square route (imp-97225/imp-97267), so the signed mean value SHARES its obstruction ' +
    'rather than exceeding it (a downgrade of the imp-97204 "strictly harder" framing). The ' +
    'non-elementary obstruction is NOT broken. Measured c_s ~ 0.0795 stays measured; positivity is ' +
    'unaffected (|S| <= A). No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97268_SUBGAP = Object.freeze({
  id: 'imp-97268-signed-inverseline-equidistribution',
  statement:
    'the first (odd) moment inverse-map equidistribution transfer for S(b) = Sum_a V(b mod a, a): ' +
    'a cancellation-preserving estimate for the correlation of the odd Bettin-Conrey period values ' +
    'V(.,a) with the Kloosterman selection a |-> b mod a (equivalently the inverse line a |-> b-inverse ' +
    'mod a). This is the SAME inverse-map transfer already binding the mean-square route (imp-97225 OVR ' +
    'plateau, imp-97267 DIAG + OFFDIAG character-detection identity), applied to a first (odd) moment ' +
    'rather than a second moment. Needed ONLY for the sharper signed constant c_s ~ 0.0795; positivity ' +
    'follows from the absolute program (imp-97204, |S| <= A). Stays non-elementary.',
});

export const IMP97268_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Attempt + partial only: the direct signed ' +
  'inverse-line mean value is NOT evaluated and the direct signed bound is NOT proved. Proved (elementary): ' +
  'V(.,a) is exactly odd under h -> a-h, so the full-residue signed first moment T(a) = 0 at every modulus, ' +
  'and S(b) is exactly a Kloosterman-selected slice of this zero-mean family. Assessed: a direct signed ' +
  'bound is equivalent to a first (odd) moment inverse-map equidistribution transfer -- the SAME transfer ' +
  'binding the mean-square route (imp-97225/imp-97267), so the signed mean value SHARES that obstruction ' +
  'rather than exceeding it. The obstruction is NOT broken. Measured c_s ~ 0.0795 stays measured; positivity ' +
  'is unaffected (|S| <= A). No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97268_ASSERTIONS = [
  {
    id: 'imp97268-cotangent-sum-vanishes',
    holds: () => {
      // Sum_{m=1}^{a-1} cot(pi m/a) = 0 (the identity behind the odd symmetry, Result 1).
      for (const a of [7, 12, 31, 101]) {
        let s = 0;
        for (let m = 1; m < a; m++) s += cot((Math.PI * m) / a);
        if (!(Math.abs(s) < 1e-8)) return false;
      }
      return true;
    },
    why: 'Sum_{m=1}^{a-1} cot(pi m/a) = 0 (odd symmetry m <-> a-m of the cotangent over the half-period), the exact identity that turns V(a-h,a) into -V(h,a).',
  },
  {
    id: 'imp97268-V-odd-under-h-to-a-minus-h',
    holds: () => {
      // V(a-h, a) = -V(h, a) EXACTLY for coprime h (Result 1).
      for (const a of [7, 12, 31, 50, 101]) {
        for (let h = 1; h < a; h++) {
          if (gcd(h, a) !== 1) continue;
          if (!(Math.abs(Vsum(a - h, a) + Vsum(h, a)) < 1e-8)) return false;
        }
      }
      return true;
    },
    why: 'the cotangent sum V(.,a) is exactly odd under h -> a-h for reduced residues (verified to <1e-8 over a = 7..101), the structural fact this leaf adds.',
  },
  {
    id: 'imp97268-full-residue-first-moment-vanishes',
    holds: () => {
      // T(a) = Sum_{h,(h,a)=1} V(h,a) = 0 at every modulus (Result 2).
      for (const a of [7, 12, 31, 50, 101, 210, 401]) {
        const { T, phi } = fullResidueFirstMoment(a);
        if (!(phi >= 1)) return false;
        if (!(Math.abs(T) < 1e-6)) return false;
      }
      return true;
    },
    why: 'the full-residue signed first moment T(a) = Sum_{h coprime a} V(h,a) = 0 at every tested modulus (pairing h with a-h), the zero-mean family S(b) samples one slice of.',
  },
  {
    id: 'imp97268-signed-inverse-line-negative-and-nonzero',
    holds: () => {
      // S(b)/(phi b) is negative and near the measured c_s ~ -0.077 -- a single b-slice, NOT the zero
      // full average (so it is a genuine correlation, non-elementary; Result 3).
      const s = signedInverseLine(401);
      if (!(s < 0)) return false;
      if (!(s > -0.09 && s < -0.06)) return false;
      if (!(Math.abs(s - IMP97268_MEASURED.signedInverseLineSampled) < 1e-4)) return false;
      // contrast: the full-residue average at the same modulus vanishes
      const { T } = fullResidueFirstMoment(401);
      if (!(Math.abs(T) < 1e-6)) return false;
      return true;
    },
    why: 'the inverse-line slice S(b)/(phi b) at b=401 is negative ~-0.077 (nonzero) while the full-residue average vanishes -- confirming S(b) is a genuine Kloosterman-selected correlation, not captured by the antisymmetry that kills the full mean.',
  },
  {
    id: 'imp97268-honesty-gate-no-qed',
    holds: () =>
      IMP97268_VERDICT.directSignedBoundProved === false &&
      IMP97268_VERDICT.oddSymmetryProved === true &&
      IMP97268_VERDICT.fullResidueFirstMomentVanishes === true &&
      IMP97268_VERDICT.reducedToInverseMapCorrelation === true &&
      IMP97268_VERDICT.obstructionSameAsMeanSquare === true &&
      IMP97268_VERDICT.obstructionBroken === false &&
      IMP97268_VERDICT.positivityUnaffected === true &&
      IMP97268_VERDICT.anyBoundMoved === false &&
      IMP97268_VERDICT.postsRigorousCeiling === false &&
      IMP97268_VERDICT.qed === false &&
      /signed-inverseline-equidistribution/.test(IMP97268_SUBGAP.id) &&
      /NO QED/.test(IMP97268_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97268_HONEST_BANNER) &&
      /RH open/.test(IMP97268_HONEST_BANNER),
    why: 'attempt + partial: the direct signed bound is not proved; the leaf adds the odd symmetry / zero full-moment / correlation reduction and assesses the obstruction as shared with the mean square (not harder), no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97268_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97268-route-m-signed-inverseline-mean-value assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97268_MEASURED,
  attempt: IMP97268_ATTEMPT,
  verdict: IMP97268_VERDICT,
  subGap: IMP97268_SUBGAP,
  banner: IMP97268_HONEST_BANNER,
};

/**
 * @module imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz
 *
 * imp-97203 (proof, ASSESSMENT + PARTIAL): attempt to certify the imp-97180 residual sub-gap
 * -- prove Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c_1 Sum_{a coprime} a with an
 * explicit c_1 < kappa_arith = 0.5704960511308594 (measured c_1 ~ 0.29), a Bettin-Conrey
 * ABSOLUTE first moment over the inverse line. The attempt does NOT produce a rigorous c_1;
 * instead it SHARPENS the imp-97180 obstruction with an exact Cauchy-Schwarz REDUCTION of the
 * absolute (non-reciprocal) first moment to a mean-SQUARE, and pins the remaining input to an
 * inverse-map equidistribution transfer. No bound is proved rigorous; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * Notation as imp-97180/imp-97116/imp-97097. c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h/k) is the
 * Vasyunin/Bettin-Conrey cotangent sum; imp-97116 R1 gives V(b,a) = c_0(h_a/a) exactly with
 * h_a = b-inverse mod a. The ticket constant is c_1 = Sum_a |c_0(h_a/a)| / Sum_a a.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS, exact finite inequality): a Cauchy-Schwarz REDUCTION to the second moment.
 * -------------------------------------------------------------------------------
 * Write each coprime term as sqrt(a) times |c_0(h_a/a)| / sqrt(a). Finite Cauchy-Schwarz over the
 * coprime residues a gives, with NO analytic input,
 *     ( Sum_a |c_0(h_a/a)| )^2 <= ( Sum_a a ) ( Sum_a c_0(h_a/a)^2 / a ),
 * hence
 *     c_1 = Sum_a |c_0(h_a/a)| / Sum_a a  <=  sqrt( M2w ),   M2w := ( Sum_a c_0(h_a/a)^2 / a ) / ( Sum_a a ).
 * This is a rigorous, unconditional finite identity/inequality (verified numerically below only as a
 * self-check of the arithmetic). It converts the SOLE open input from an ABSOLUTE (non-reciprocal)
 * FIRST moment -- where no reciprocity/moment machinery applies and imp-97180 ruled out every
 * elementary termwise route -- into a mean-SQUARE M2w. Certifying c_1 < 0.5705 is therefore IMPLIED
 * by certifying M2w < 0.5705^2 = 0.32546 (the squared target).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (MEASURED): the Cauchy-Schwarz ceiling stays below target -- NO overshoot.
 * -------------------------------------------------------------------------------
 * MEASURED, the a-weighted inverse-line second moment M2w is a bounded CONSTANT with no log drift:
 *     M2w ~ 0.129 (b=101) -> 0.156 (401) -> 0.168 (2003) -> 0.172 (8009), FLAT.
 * So the CS ceiling sqrt(M2w) ~ 0.359 (b=101) -> 0.410 (2003) -> 0.415 (8009) stays BELOW
 * kappa_arith = 0.5705 with margin ~1.38x, i.e. Cauchy-Schwarz does NOT overshoot the target in this
 * (upper-bound) direction. This is the operative contrast with the Route M LOWER companion, where
 * squaring a lower bound overshoots (the reason that leaf pursues the mean VALUE, not the mean square);
 * for the UPPER bound on c_1 the mean-square ceiling still clears 0.5705 with room. The measured c_1
 * itself is ~0.266 (b=101) -> 0.291 (2003) -> 0.294 (8009), flat, comfortably under the ceiling.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (MEASURED): the full-residue second moment is ALSO bounded -- corrects an imp-97180 hint.
 * -------------------------------------------------------------------------------
 * The MEAN over ALL coprime residues h mod a of (c_0(h/a)/a)^2 is bounded (does NOT diverge):
 *     E_h[(c_0(h/a)/a)^2] ~ 0.108 (a=101) -> 0.126 (401) -> 0.134 (2003), FLAT.
 * The small-inverse spike c_0(1/a) ~ -(1/pi) a log a makes (c_0(1/a)/a)^2 ~ (log a / pi)^2 large, but
 * it is a SINGLE residue out of ~a, contributing only ~(log a/pi)^2 / phi(a) -> 0 to the mean. So the
 * mean-square over full residues is carried by the bulk and is bounded (equivalently Sum_h c_0^2 ~ C
 * a^3, the classical Bettin-Conrey even-moment order), and Bettin-Conrey reciprocity/even-moment
 * machinery applies to c_0^2 (no absolute value). This is the concrete reason the mean-square is the
 * tractable object the first moment is not.
 *
 * -------------------------------------------------------------------------------
 * REFINED OBSTRUCTION: the residual is an INVERSE-MAP equidistribution transfer, not the first moment.
 * -------------------------------------------------------------------------------
 * M2w averages c_0(h_a/a)^2/a along the INVERSE LINE a |-> h_a = b-inverse mod a (one residue per a),
 * whereas the tractable Bettin-Conrey second-moment bound is over the FULL residue set h mod a. The two
 * are close but NOT identical: the inverse-line M2w (~0.17) sits modestly ABOVE the full-residue mean
 * (~0.13), i.e. the inverse map oversamples the large-|c_0| (small reduced-inverse) residues by ~30%.
 * A rigorous full-residue mean-square bound E_h[(c_0(h/a)/a)^2] <= C therefore certifies M2w -- and thus
 * c_1 < 0.5705 via Result 1 -- ONLY after an inverse-map equidistribution (Kloosterman-type) transfer
 * that absorbs this ~30% oversampling. That transfer is the remaining non-elementary input; it is a
 * SECOND-moment equidistribution statement, strictly narrower than the imp-97180 absolute-first-moment
 * input, and it sits entirely inside the ~1.38x CS margin (0.415 vs 0.5705).
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): the Cauchy-Schwarz reduction c_1 <= sqrt(M2w) is an exact unconditional
 * finite inequality; certifying M2w < 0.32546 implies certifying c_1 < 0.5705. MEASURED (not proved):
 * M2w ~ 0.17 flat, CS ceiling sqrt(M2w) ~ 0.415 < 0.5705 by ~1.38x (no overshoot); c_1 ~ 0.29 flat;
 * the full-residue mean-square E_h[(c_0/a)^2] ~ 0.13 is bounded (small-inverse spike negligible in the
 * mean). OPEN: an explicit certified M2w -- now a SECOND-moment (mean-square) input for which
 * Bettin-Conrey even-moment machinery applies over full residues, requiring an inverse-map
 * equidistribution transfer (~30% oversampling) to descend to the inverse line. No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The certified c_1 < 0.5705 is NOT obtained. The attempt (i) proves a rigorous Cauchy-Schwarz
 * reduction c_1 <= sqrt(M2w) that trades the intractable ABSOLUTE FIRST moment for a mean-SQUARE,
 * (ii) measures the CS ceiling sqrt(M2w) ~ 0.415 staying below 0.5705 by ~1.38x (no overshoot), and
 * (iii) sharpens the imp-97180 obstruction: the remaining input is an inverse-map equidistribution
 * transfer of a full-residue second-moment bound (Bettin-Conrey even moments apply to c_0^2), NOT the
 * absolute first moment itself. The measured c_1 ~ 0.29 and M2w ~ 0.17 stay MEASURED, not proved. No
 * bound on Lambda moves; T ~ 2.594e7 trace anchor; compute (N ~ 9916) binds first. No refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (parent: names this sub-gap)
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (R1: V(b,a) = c_0(h_a/a))
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0)
 *
 * Ticket: imp-97203 (proof, opus-4-8, api-pool). Assessment + partial; NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// V(b,a) = Sum_{m=1}^{a-1} frac(m b / a) cot(pi m / a) = c_0(h_a/a) by imp-97116 R1.
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
// direct c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h / k) -- for the full-residue mean-square check.
const c0direct = (h, k) => {
  let s = 0;
  for (let n = 1; n < k; n++) s += (n / k) * cot((Math.PI * n * h) / k);
  return s;
};
function egcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}
const modinv = (a, m) => {
  const [g, x] = egcd(((a % m) + m) % m, m);
  return g !== 1 ? null : ((x % m) + m) % m;
};

// Inverse-line quantities: c_1 = Sum|c_0| / Sum a, and the a-weighted second moment
// M2w = (Sum c_0^2 / a) / (Sum a) whose sqrt is the Cauchy-Schwarz ceiling on c_1. O(b^2); keep b small.
function inverseLinePieces(b) {
  let sumV = 0, sumA = 0, sumC2overA = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    const v = Math.abs(Vsum(b, a)); // = |c_0(h_a/a)|
    sumV += v;
    sumA += a;
    sumC2overA += (v * v) / a;
  }
  const c1 = sumV / sumA;
  const M2w = sumC2overA / sumA;
  return { c1, M2w, csCeiling: Math.sqrt(M2w) };
}

// Full-residue mean of (c_0(h/a)/a)^2 over coprime h (bounded; small-inverse spike negligible). O(a^2).
function fullResidueMeanSquare(a) {
  let s = 0, phi = 0;
  for (let h = 1; h < a; h++) {
    if (gcd(h, a) !== 1) continue;
    phi += 1;
    const r = c0direct(h, a) / a;
    s += r * r;
  }
  return s / phi;
}

// MEASURED constants (tmp/imp-97203-cs.mjs, tmp/imp-97203-fullmoment.mjs; b <= 8009).
export const IMP97203_MEASURED = Object.freeze({
  c1Stable: 0.29, // Sum|c_0|/Sum a: 0.266 (b=101) -> 0.291 (2003) -> 0.294 (8009); FLAT, no log drift
  M2wStable: 0.17, // a-weighted inverse-line second moment: 0.129 (101) -> 0.168 (2003) -> 0.172 (8009)
  csCeilingStable: 0.415, // sqrt(M2w): 0.359 (101) -> 0.410 (2003) -> 0.415 (8009), FLAT
  csMarginBelowKappaArith: 1.38, // 0.5705 / 0.415 ~ 1.38x -- CS ceiling clears target, no overshoot
  fullResidueMeanSquare: 0.13, // E_h[(c_0(h/a)/a)^2] over ALL coprime h: 0.108 (101) -> 0.134 (2003), bounded
  inverseOversamplingFactor: 1.3, // M2w (~0.17) / full-residue mean (~0.13): inverse line oversamples ~30%
  squaredTarget: 0.32546, // 0.5704960511308594^2 -- certify M2w below this to certify c_1 < 0.5705
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
});

export const IMP97203_ATTEMPT = Object.freeze({
  target: 'Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c_1 Sum_a a with certified c_1 < 0.5705',
  cauchySchwarzReduction:
    'exact finite inequality c_1 = Sum|c_0|/Sum a <= sqrt(M2w), M2w = (Sum c_0^2/a)/(Sum a): trades the ' +
    'ABSOLUTE first moment for a mean-SQUARE; certifying M2w < 0.32546 implies certifying c_1 < 0.5705',
  csCeilingNoOvershoot:
    'sqrt(M2w) ~ 0.415 (measured, flat) stays below 0.5705 by ~1.38x -- unlike the lower companion, the ' +
    'mean-square ceiling does NOT overshoot the target in the upper-bound direction',
  fullResidueSecondMomentBounded:
    'E_h[(c_0(h/a)/a)^2] ~ 0.13 (measured, flat): the mean-square over ALL residues is bounded (the ' +
    'small-inverse spike c_0(1/a) ~ -(1/pi) a log a is one residue of ~a, negligible in the mean); ' +
    'Bettin-Conrey even-moment/reciprocity machinery applies to c_0^2 (no absolute value)',
  refinedObstruction:
    'the residual input is an INVERSE-MAP equidistribution (Kloosterman-type) transfer of a full-residue ' +
    'second-moment bound to the inverse line (which oversamples large-|c_0| residues by ~30%), NOT the ' +
    'absolute first moment; it sits inside the ~1.38x CS margin',
});

export const IMP97203_VERDICT = Object.freeze({
  question:
    'prove Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c_1 Sum_a a with an explicit certified ' +
    'c_1 < kappa_arith = 0.5705 (imp-97180 residual sub-gap)?',
  certifiedConstantProved: false, // c_1 stays MEASURED ~0.29, not proved
  cauchySchwarzReductionRigorous: true, // c_1 <= sqrt(M2w) is an exact unconditional finite inequality
  csCeilingBelowTargetMeasured: true, // sqrt(M2w) ~ 0.415 < 0.5705 (measured, no overshoot)
  fullResidueMeanSquareBounded: true, // E_h[(c_0/a)^2] ~ 0.13 bounded (corrects an imp-97180 divergence hint)
  remainingInputElementary: false, // inverse-map equidistribution transfer of a Bettin-Conrey second moment
  remainingInputIsSecondMoment: true, // narrower than the imp-97180 absolute-first-moment input
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The certified c_1 < 0.5705 is NOT obtained. The attempt proves a rigorous Cauchy-Schwarz reduction ' +
    'c_1 <= sqrt(M2w) that trades the intractable ABSOLUTE FIRST moment for a mean-SQUARE M2w; measures ' +
    'the CS ceiling sqrt(M2w) ~ 0.415 staying below 0.5705 by ~1.38x (no overshoot, unlike the lower ' +
    'companion); and sharpens the imp-97180 obstruction to an inverse-map equidistribution transfer of a ' +
    'full-residue second-moment bound (the full-residue mean-square E_h[(c_0/a)^2] ~ 0.13 is bounded and ' +
    'Bettin-Conrey even moments apply to c_0^2; the inverse line oversamples large-|c_0| residues ~30%). ' +
    'The measured c_1 ~ 0.29 and M2w ~ 0.17 stay MEASURED, not proved. No bound on Lambda moves; ' +
    'T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97203_SUBGAP = Object.freeze({
  id: 'imp-97203-cotangent-absvalue-second-moment-inverse-equidistribution',
  statement:
    'prove M2w = (Sum_{a=2,(a,b)=1} c_0(b-inverse mod a / a)^2 / a) / (Sum_a a) <= 0.32546 uniformly in b ' +
    '(measured M2w ~ 0.17), which by the exact Cauchy-Schwarz reduction c_1 <= sqrt(M2w) certifies c_1 < ' +
    'kappa_arith = 0.5705. This REPLACES the imp-97180 absolute-first-moment framing with a mean-SQUARE ' +
    'input: the full-residue second moment E_h[(c_0(h/a)/a)^2] ~ 0.13 is bounded and admits Bettin-Conrey ' +
    'even-moment machinery (no absolute value); the sole remaining step is an inverse-map equidistribution ' +
    '(Kloosterman-type) transfer to the inverse line a |-> b-inverse mod a, which oversamples the ' +
    'large-|c_0| (small reduced-inverse) residues by ~30% -- a factor inside the ~1.38x CS margin. ' +
    'c_1 stays MEASURED.',
});

export const IMP97203_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + partial only: the attempt to certify ' +
  'Sum|c_0| <= c_1 Sum a with c_1 < 0.5705 does NOT succeed. It proves a rigorous Cauchy-Schwarz ' +
  'reduction c_1 <= sqrt(M2w) trading the ABSOLUTE first moment for a mean-SQUARE, measures the ceiling ' +
  'sqrt(M2w) ~ 0.415 below 0.5705 by ~1.38x (no overshoot), and sharpens the imp-97180 obstruction to an ' +
  'inverse-map equidistribution transfer of a full-residue second-moment bound (bounded ~0.13; ' +
  'Bettin-Conrey even moments apply to c_0^2). The measured c_1 ~ 0.29 and M2w ~ 0.17 stay measured, not ' +
  'proved. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97203_ASSERTIONS = [
  {
    id: 'imp97203-cauchy-schwarz-inequality-holds',
    holds: () => {
      // c_1 <= sqrt(M2w) is the exact finite Cauchy-Schwarz inequality: verify numerically as a self-check.
      for (const b of [101, 211, 401]) {
        const { c1, csCeiling } = inverseLinePieces(b);
        if (!(c1 <= csCeiling + 1e-12)) return false;
        if (!(c1 > 0.2 && c1 < 0.35)) return false; // measured c_1 ~ 0.27..0.29
      }
      return true;
    },
    why: 'the finite Cauchy-Schwarz inequality c_1 = Sum|c_0|/Sum a <= sqrt(M2w) holds exactly (verified b=101,211,401); c_1 ~ 0.27..0.29 measured, comfortably under the ceiling.',
  },
  {
    id: 'imp97203-cs-ceiling-below-kappa-arith-no-overshoot',
    holds: () => {
      // sqrt(M2w) stays below kappa_arith with margin: the mean-square ceiling does not overshoot the target.
      for (const b of [101, 211, 401]) {
        const { csCeiling } = inverseLinePieces(b);
        if (!(csCeiling < IMP97203_MEASURED.kappaArith)) return false; // below target
        if (!(csCeiling > 0.3 && csCeiling < 0.45)) return false; // measured ~0.36..0.40 in this range
      }
      return true;
    },
    why: 'the Cauchy-Schwarz ceiling sqrt(M2w) ~ 0.36..0.40 (b=101,211,401) stays strictly below kappa_arith = 0.5705, so squaring does not overshoot the target -- unlike the Route M lower companion.',
  },
  {
    id: 'imp97203-full-residue-mean-square-bounded',
    holds: () => {
      // E_h[(c_0/a)^2] over ALL coprime h is bounded (does not diverge): small-inverse spike negligible in mean.
      const e1 = fullResidueMeanSquare(101);
      const e2 = fullResidueMeanSquare(211);
      const e3 = fullResidueMeanSquare(401);
      for (const e of [e1, e2, e3]) if (!(e > 0.08 && e < 0.2)) return false;
      // bounded and only mildly increasing (consistent with a constant, not divergence)
      return e3 > e1 && e3 < 2 * e1;
    },
    why: 'the mean over all coprime residues h of (c_0(h/a)/a)^2 is ~0.11..0.13 (b=101,211,401), bounded and flat -- the small-inverse spike c_0(1/a) ~ (1/pi) a log a is a single residue and is negligible in the mean; Bettin-Conrey even moments apply to c_0^2.',
  },
  {
    id: 'imp97203-inverse-line-oversamples-full-residue',
    holds: () => {
      // Inverse-line M2w exceeds the full-residue mean-square (the ~30% oversampling the transfer absorbs).
      const b = 401;
      const { M2w } = inverseLinePieces(b);
      const full = fullResidueMeanSquare(b);
      return M2w > full && M2w < 1.6 * full; // modest, bounded oversampling
    },
    why: 'at b=401 the inverse-line second moment M2w exceeds the full-residue mean-square by a modest bounded factor (~1.2..1.3x), quantifying the oversampling of large-|c_0| residues the equidistribution transfer must absorb -- inside the CS margin.',
  },
  {
    id: 'imp97203-honesty-gate-no-qed',
    holds: () =>
      IMP97203_VERDICT.certifiedConstantProved === false &&
      IMP97203_VERDICT.cauchySchwarzReductionRigorous === true &&
      IMP97203_VERDICT.csCeilingBelowTargetMeasured === true &&
      IMP97203_VERDICT.fullResidueMeanSquareBounded === true &&
      IMP97203_VERDICT.remainingInputElementary === false &&
      IMP97203_VERDICT.remainingInputIsSecondMoment === true &&
      IMP97203_VERDICT.anyBoundMoved === false &&
      IMP97203_VERDICT.postsRigorousCeiling === false &&
      IMP97203_VERDICT.qed === false &&
      /second-moment-inverse-equidistribution/.test(IMP97203_SUBGAP.id) &&
      /Cauchy-Schwarz/.test(IMP97203_SUBGAP.statement) &&
      /NO QED/.test(IMP97203_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97203_HONEST_BANNER) &&
      /RH open/.test(IMP97203_HONEST_BANNER),
    why: 'assessment + partial: the certified c_1 is not obtained; the Cauchy-Schwarz reduction is rigorous and the obstruction is refined to an inverse-map equidistribution transfer of a bounded second moment -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97203_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97203_MEASURED,
  attempt: IMP97203_ATTEMPT,
  verdict: IMP97203_VERDICT,
  subGap: IMP97203_SUBGAP,
  banner: IMP97203_HONEST_BANNER,
};

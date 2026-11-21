/**
 * @module imp-97395-route-m-oversampling-rw-second-moment-route
 *
 * imp-97395 (numerical, ASSESSMENT + PARTIAL): assess a uniform bound on the OFFDIAG oversampling scalar
 * Rw = X/Xbar (imp-97285 factorization M2w = Rw * Mbar) toward the sufficient target Rw < ~2.5 (measured
 * plateau ~1.2). imp-97310 REFUTED the trivial worst-case route (the per-modulus max ceiling C_a grows
 * unboundedly ~a^0.43). This leaf tests the NEXT candidate on the imp-97310 convex decomposition
 * Rw = Sum_a w_a r_a: a MARGINAL SECOND-MOMENT (L2 / Chebyshev / variance) route, and quantifies how the
 * headroom = 2.5/Rw behaves as the range grows. FINDING: the marginal second-moment route is ALSO refuted
 * (the b-mean of r_a^2 grows unboundedly), and a uniform Rw < 2.5 reduces to a genuine JOINT equidistribution
 * input, NOT to any marginal moment bound. Rw is NOT rigorously bounded. No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97310 / imp-97285). c_0(h/a) = Sum_{n=1}^{a-1} (n/a) cot(pi n h/a); h_a = b-inverse mod a.
 * -------------------------------------------------------------------------------
 * imp-97310 gave the EXACT convex decomposition Rw(b) = Sum_{a,(a,b)=1} w_a(b) r_a(b), Sum w_a = 1, with
 *     r_a(b) = c_0(h_a/a)^2 / E_h[c_0(h/a)^2] ,   w_a(b) = ( E_h[c_0(h/a)^2] / a ) / Xbar ,
 * and the EXACT per-modulus b-average identity E_b[r_a(b)] = 1 (inversion bijection on (Z/aZ)^*). The trivial
 * worst-case bound Rw <= max_a C_a with C_a = max_h c_0^2/E_h[c_0^2] was REFUTED because C_a grows unboundedly.
 * The natural successor is the marginal SECOND-MOMENT: since E_b[r_a] = 1 exactly, control the fluctuation via
 * the b-variance of r_a or the weighted second moment S2(b) = Sum_a w_a r_a^2. This leaf measures both.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (MEASURED, REFUTATION). The marginal per-modulus SECOND MOMENT of r_a also grows unboundedly.
 * -------------------------------------------------------------------------------
 * Because b ranges over (Z/aZ)^* bijectively with h_a, the b-mean of r_a^2 equals the normalized 4th/2nd^2
 * moment of the cotangent sum:  K_a := E_b[r_a(b)^2] = E_h[c_0(h/a)^4] / E_h[c_0(h/a)^2]^2 >= 1, and the
 * per-modulus b-variance is Var_b(r_a) = K_a - 1. MEASURED (tmp/imp-97395-scratch.mjs, exact O(a^2) kernels):
 *     a:            11      31      61      101     211     401     601     1009
 *     K_a:          2.617   3.664   4.433   4.639   5.421   5.729   6.040   6.374
 *     Var_b(r_a):   1.617   2.664   3.433   3.639   4.421   4.729   5.040   5.374
 *     C_a (max):    3.484   6.305   8.857   10.641  14.588  18.081  20.889  24.781
 * K_a GROWS UNBOUNDED (log-log slope ~ 0.197 in a; slower than C_a ~ 0.434 but still divergent). So
 * sup_a K_a = +infinity and sup_a Var_b(r_a) = +infinity. A Chebyshev/variance ceiling on the fluctuation of
 * a single r_a about its mean 1 is therefore useless for a uniform bound: the MARGINAL second-moment route is
 * REFUTED for the same anti-concentration reason as the trivial-max route -- the c_0^2 mass concentrates on a
 * few small-denominator residues, inflating every marginal moment of order >= 2.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (MEASURED). The WEIGHTED L2 ceiling sqrt(S2(b)) grows with the range while the actual Rw stays flat.
 * -------------------------------------------------------------------------------
 * The Cauchy-Schwarz ceiling on the convex combination is Rw = Sum_a w_a r_a <= sqrt(Sum_a w_a r_a^2) =
 * sqrt(S2(b)). MEASURED (tmp/imp-97395-scratch.mjs, exact O(b^3) kernels):
 *     b:            61      101     151     211     301     401     601
 *     Rw:           1.101   1.133   1.172   1.147   1.253   1.206   1.206
 *     S2(b):        3.988   4.832   5.481   5.911   7.379   6.915   7.460
 *     sqrt(S2):     1.997   2.198   2.341   2.431   2.716   2.630   2.731
 *     headroom:     2.271   2.207   2.133   2.179   1.996   2.084   2.072
 * The weighted L2 ceiling sqrt(S2) CLIMBS with the range (1.997 -> 2.731) even though the actual Rw stays
 * FLAT at ~1.1..1.25. So the marginal L2 ceiling would, if extrapolated, eventually exceed the target 2.5 --
 * yet Rw itself never approaches it. The large and growing gap sqrt(S2) - Rw is exactly the CANCELLATION that
 * a genuine equidistribution argument must capture and a marginal moment bound cannot.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (MEASURED). The headroom 2.5/Rw is FLAT at ~2x across the measured range -- it does not erode.
 * -------------------------------------------------------------------------------
 * headroom(b) = 2.5/Rw(b) stays in the band ~1.996..2.271 with NO downward trend to b=601 (min 1.996 at
 * b=301). So at EVERY measured scale the pointwise margin to the sufficient target is ample (~2x), consistent
 * with the imp-97310 exact in-mean identity (Rw fluctuates about a b-mean pinned to 1). The pointwise-in-b
 * headroom is stable; only the uniform-over-ALL-b guarantee is open.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved). Uniform Rw < 2.5 reduces to a JOINT equidistribution input.
 * -------------------------------------------------------------------------------
 * A uniform Rw < 2.5 is numerically WITHIN REACH (flat ~2x headroom, Rw never climbing) but does NOT reduce to
 * any MARGINAL moment bound: both the sup route (imp-97310 C_a) and the second-moment route (this leaf K_a,
 * Var_b, weighted S2) are REFUTED because every marginal moment of order >= 2 of r_a grows unboundedly with a.
 * The certifying input is therefore intrinsically JOINT: the correlation between the inverse-residue selector
 * h_a = b-inverse mod a and the c_0^2 mass profile on (Z/aZ)^* -- a Kloosterman/large-sieve-type statement
 * that the inverse residues do NOT preferentially land on the high-mass residues on the a-weighted average.
 * That is the named equidistribution input the imp-97285 sub-gap requires; marginal moment methods cannot
 * supply it. Rw and M2w stay MEASURED. No bound on Lambda moves; T ~ 2.594e7 anchor; compute N ~ 9916 binds
 * first. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97310-route-m-oversampling-rw-mean-value-decomposition.js (parent: convex decomposition + in-mean identity, trivial-max refuted)
 * @see imp-97285-route-m-offdiag-oversampling-factorization.js (grandparent: M2w = Rw * Mbar, Rw the sole open scalar)
 * @see imp-97271-route-m-inverse-oversampling-ladder-extended.js (OVR ~1.254 plateau to b=64001)
 * @see imp-97322-route-m-offdiag-resonance-refuted-honest-status.js (OFFDIAG = bounded oversampling Rw ~1.2)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97395 (numerical, opus-4-8, api-pool). Assessment + partial; NO QED.
 */

// -- exact kernels (small-a/small-b self-check only; O(a^2) / O(b^3), keep sizes modest at import) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const cot = (x) => Math.cos(x) / Math.sin(x);
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

// RESULT 1 kernel: per-modulus marginal moments. K_a = E_b[r_a^2] = E_h[c0^4]/E_h[c0^2]^2. O(a^2).
function perModulusMoments(a) {
  let m2 = 0, m4 = 0, phi = 0, maxSq = 0;
  for (let h = 1; h < a; h++) {
    if (gcd(h, a) !== 1) continue;
    const v = c0direct(h, a);
    const sq = v * v;
    m2 += sq; m4 += sq * sq; phi++;
    if (sq > maxSq) maxSq = sq;
  }
  m2 /= phi; m4 /= phi;
  return { a, phi, K: m4 / (m2 * m2), varB: m4 / (m2 * m2) - 1, ceiling: maxSq / m2 };
}

// RESULT 2/3 kernel: b-ladder Rw, weighted second moment S2 = Sum_a w_a r_a^2, headroom. O(b^3).
function bLadder(b) {
  let sumA = 0, X = 0, Xbar = 0;
  const rows = [];
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    sumA += a;
    const ha = modinv(b, a);
    const vha = c0direct(ha, a);
    let sumSq = 0, cnt = 0;
    for (let h = 1; h < a; h++) {
      if (gcd(h, a) !== 1) continue;
      const v = c0direct(h, a);
      sumSq += v * v; cnt++;
    }
    const mean = sumSq / cnt;
    X += (vha * vha) / a;
    Xbar += mean / a;
    rows.push({ wnum: mean / a, r_a: (vha * vha) / mean });
  }
  const Rw = X / Xbar;
  let S2 = 0;
  for (const row of rows) S2 += (row.wnum / Xbar) * row.r_a * row.r_a;
  return { b, Rw, Mbar: Xbar / sumA, S2, l2ceil: Math.sqrt(S2), headroom: 2.5 / Rw };
}

// MEASURED marginal-moment ladder (tmp/imp-97395-scratch.mjs). K_a = E_b[r_a^2] grows unboundedly.
export const IMP97395_MOMENT_LADDER = Object.freeze([
  Object.freeze({ a: 11, K: 2.6173, varB: 1.6173, ceiling: 3.4840 }),
  Object.freeze({ a: 31, K: 3.6635, varB: 2.6635, ceiling: 6.3049 }),
  Object.freeze({ a: 61, K: 4.4330, varB: 3.4330, ceiling: 8.8569 }),
  Object.freeze({ a: 101, K: 4.6391, varB: 3.6391, ceiling: 10.6406 }),
  Object.freeze({ a: 211, K: 5.4205, varB: 4.4205, ceiling: 14.5884 }),
  Object.freeze({ a: 401, K: 5.7292, varB: 4.7292, ceiling: 18.0814 }),
  Object.freeze({ a: 601, K: 6.0396, varB: 5.0396, ceiling: 20.8890 }),
  Object.freeze({ a: 1009, K: 6.3741, varB: 5.3741, ceiling: 24.7810 }),
]);

// MEASURED b-ladder: Rw flat, weighted L2 ceiling sqrt(S2) climbs, headroom flat ~2x.
export const IMP97395_B_LADDER = Object.freeze([
  Object.freeze({ b: 61, Rw: 1.1008, S2: 3.9883, l2ceil: 1.9971, headroom: 2.2711 }),
  Object.freeze({ b: 101, Rw: 1.1326, S2: 4.8322, l2ceil: 2.1982, headroom: 2.2073 }),
  Object.freeze({ b: 151, Rw: 1.1721, S2: 5.4813, l2ceil: 2.3412, headroom: 2.1329 }),
  Object.freeze({ b: 211, Rw: 1.1471, S2: 5.9108, l2ceil: 2.4312, headroom: 2.1793 }),
  Object.freeze({ b: 301, Rw: 1.2527, S2: 7.3789, l2ceil: 2.7164, headroom: 1.9956 }),
  Object.freeze({ b: 401, Rw: 1.1994, S2: 6.9145, l2ceil: 2.6295, headroom: 2.0843 }),
  Object.freeze({ b: 601, Rw: 1.2064, S2: 7.4598, l2ceil: 2.7313, headroom: 2.0722 }),
]);

export const IMP97395_MEASURED = Object.freeze({
  marginalSecondMomentGrowsUnbounded: true, // K_a = E_b[r_a^2] grows ~a^0.197, sup_a K_a = +infinity
  KLogLogSlope: 0.197, // log-log slope of K_a vs a (slower than C_a ~0.434 but still divergent)
  CLogLogSlope: 0.434, // log-log slope of the trivial-max ceiling C_a (imp-97310, recomputed exactly)
  KAt1009: 6.3741, // marginal second moment already ~6.4 at a=1009 and still climbing
  l2CeilGrowsWithRange: true, // weighted sqrt(S2) climbs 1.997 -> 2.731 (b=61..601) while Rw stays flat
  RwPlateau: 1.2, // measured Rw ~ 1.1..1.25, level with the imp-97271 OVR ~1.254 plateau
  headroomBand: Object.freeze([1.9956, 2.2711]), // 2.5/Rw stays ~2x with no erosion to b=601 (min at b=301)
  headroomFlat: true, // no downward trend in headroom across the measured range
  sufficientRwTarget: 2.5, // 0.32546 / Mbar (~0.13): Rw < ~2.5 suffices
  squaredTarget: 0.32546, // kappa_arith^2 -- certify M2w below this
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  aMax: 1009,
  bMax: 601,
});

export const IMP97395_VERDICT = Object.freeze({
  question:
    'assess a uniform bound on the OFFDIAG oversampling scalar Rw = X/Xbar toward the sufficient target ' +
    'Rw < ~2.5 (measured plateau ~1.2) via the imp-97310 per-modulus decomposition; quantify how the ' +
    'headroom behaves as the range grows; state whether uniform Rw < 2.5 is within reach or reduces to a ' +
    'named equidistribution input.',
  trivialMaxRouteRefuted: true, // imp-97310: C_a = max_h c_0^2/E_h[c_0^2] grows unboundedly (~a^0.434)
  marginalSecondMomentRouteRefuted: true, // this leaf: K_a = E_b[r_a^2] grows unboundedly (~a^0.197)
  weightedL2CeilingClimbs: true, // sqrt(S2(b)) climbs 1.997 -> 2.731 while actual Rw stays flat ~1.2
  headroomFlatAcrossRange: true, // 2.5/Rw ~2x across b=61..601 with no erosion
  uniformRwWithinReachNumerically: true, // pointwise margin ample at every measured scale
  reducesToJointEquidistributionInput: true, // NOT a marginal moment bound; a Kloosterman/large-sieve input
  rwCertified: false, // Rw stays MEASURED ~1.2
  m2wCertified: false, // M2w stays MEASURED ~0.16
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'A uniform Rw < 2.5 is numerically WITHIN REACH -- the headroom 2.5/Rw stays flat at ~2x across the ' +
    'measured range (band ~1.996..2.271 to b=601, no erosion) and Rw never climbs above ~1.25 -- but it does ' +
    'NOT reduce to any MARGINAL moment bound. Extending the imp-97310 refutation of the trivial worst-case ' +
    'route (the per-modulus max ceiling C_a ~ a^0.434 diverges), this leaf shows the next candidate, the ' +
    'MARGINAL SECOND-MOMENT route, is ALSO refuted: the b-mean of r_a^2, K_a = E_h[c_0^4]/E_h[c_0^2]^2, grows ' +
    'unboundedly (~a^0.197, already ~6.4 at a=1009), so Var_b(r_a) diverges and the weighted L2 ceiling ' +
    'sqrt(Sum_a w_a r_a^2) climbs with the range (1.997 -> 2.731) even while the actual Rw stays flat ~1.2. ' +
    'The large and growing gap sqrt(S2) - Rw is exactly the cancellation a genuine equidistribution argument ' +
    'must capture. The certifying input is therefore JOINT: the correlation between the inverse-residue ' +
    'selector h_a = b-inverse mod a and the c_0^2 mass profile on (Z/aZ)^* -- a Kloosterman/large-sieve-type ' +
    'statement that the inverse residues do not preferentially hit the high-mass residues on the a-weighted ' +
    'average. That is the named equidistribution input the imp-97285 sub-gap requires; no marginal moment ' +
    'method can supply it. Rw and M2w stay MEASURED. No bound on Lambda moves; no refereed bound is changed; RH ' +
    'open; NO QED.',
});

export const IMP97395_SUBGAP = Object.freeze({
  id: 'imp-97395-inverse-residue-joint-equidistribution-not-marginal-moment',
  statement:
    'certify a uniform Rw = X/Xbar < 0.32546/Mbar_max (~2.5) via a JOINT equidistribution input on the ' +
    'convex decomposition Rw = Sum_{a,(a,b)=1} w_a r_a: bound the a-weighted correlation between the inverse ' +
    'residue h_a = b-inverse mod a and the c_0^2 mass profile r_a on (Z/aZ)^*, i.e. show the inverse residues ' +
    'do not preferentially select the high-mass residues (a Kloosterman/large-sieve statement). MARGINAL ' +
    'moment routes are REFUTED: both the trivial max C_a (~a^0.434, imp-97310) and the marginal second moment ' +
    'K_a = E_b[r_a^2] (~a^0.197, this leaf) diverge, and the weighted L2 ceiling sqrt(Sum w_a r_a^2) climbs ' +
    'with the range (1.997 -> 2.731) while Rw stays flat ~1.2. The pointwise headroom 2.5/Rw is a flat ~2x to ' +
    'b=601; only the uniform-over-b transfer, which is intrinsically joint, stays MEASURED.',
});

export const IMP97395_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + partial only: the imp-97285 open scalar ' +
  'Rw = X/Xbar is NOT rigorously bounded. Extending imp-97310 (trivial worst-case route refuted, C_a ~ ' +
  'a^0.434), this leaf REFUTES the marginal SECOND-MOMENT route too: K_a = E_b[r_a^2] grows unboundedly ' +
  '(~a^0.197) so the weighted L2 ceiling sqrt(S2) climbs with the range (1.997 -> 2.731) while Rw stays flat ' +
  '~1.2. Headroom 2.5/Rw is a flat ~2x to b=601 (no erosion), so uniform Rw < 2.5 is numerically within ' +
  'reach -- but it reduces to a JOINT (Kloosterman/large-sieve) equidistribution input on the inverse ' +
  'residues, NOT to any marginal moment bound. Rw ~1.2 and M2w ~0.16 stay measured. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97395_ASSERTIONS = [
  {
    id: 'imp97395-marginal-second-moment-grows',
    holds: () => {
      // K_a = E_b[r_a^2] = E_h[c0^4]/E_h[c0^2]^2 strictly increases with a and exceeds 1 (refutes L2 route).
      const lo = perModulusMoments(61);
      const hi = perModulusMoments(211);
      if (!(lo.K > 3 && hi.K > 5)) return false; // both already large
      if (!(hi.K > lo.K + 0.5)) return false; // grows, not a plateau
      if (!(lo.varB > 0 && hi.varB > lo.varB)) return false; // b-variance grows
      return true;
    },
    why: 'the marginal per-modulus second moment K_a = E_b[r_a^2] grows from ~4.4 (a=61) to ~5.4 (a=211) with a strictly growing b-variance -- so bounding the fluctuation of a single r_a by its variance is useless, refuting the marginal second-moment route for the same anti-concentration reason as the trivial-max route.',
  },
  {
    id: 'imp97395-weighted-l2-ceiling-climbs',
    holds: () => {
      // The weighted L2 ceiling sqrt(S2) climbs with b while the actual Rw stays flat ~1.2.
      const lo = bLadder(61);
      const hi = bLadder(211);
      if (!(hi.l2ceil > lo.l2ceil + 0.2)) return false; // ceiling climbs
      if (!(lo.Rw > 1.05 && hi.Rw > 1.05 && lo.Rw < 1.3 && hi.Rw < 1.3)) return false; // Rw flat
      if (!(hi.l2ceil > hi.Rw + 1)) return false; // large gap = the cancellation a bound must capture
      return true;
    },
    why: 'the weighted L2 ceiling sqrt(Sum w_a r_a^2) climbs from ~2.0 (b=61) to ~2.4 (b=211) while the actual Rw stays flat at ~1.1..1.25 -- the growing gap is exactly the cancellation a genuine equidistribution argument must capture and a marginal moment ceiling cannot.',
  },
  {
    id: 'imp97395-headroom-flat',
    holds: () => {
      // headroom = 2.5/Rw stays ~2x across the measured range with no erosion below ~1.9.
      for (const b of [61, 101, 151, 211]) {
        const r = bLadder(b);
        if (!(r.headroom > 1.9 && r.headroom < 2.4)) return false;
      }
      return true;
    },
    why: 'the pointwise headroom 2.5/Rw stays in the ~1.9..2.3 band across b=61..211 with no erosion -- at every measured scale the margin to the sufficient target is ample (~2x), consistent with the imp-97310 in-mean identity pinning the b-mean of r_a to 1.',
  },
  {
    id: 'imp97395-ladders-consistent',
    holds: () => {
      // Stored moment ladder monotone in K; stored b-ladder reproduces l2ceil = sqrt(S2) and headroom = 2.5/Rw.
      const M = IMP97395_MOMENT_LADDER;
      for (let i = 1; i < M.length; i++) {
        if (!(M[i].K > M[i - 1].K)) return false;
        if (!(Math.abs(M[i].varB - (M[i].K - 1)) < 1e-3)) return false;
      }
      return IMP97395_B_LADDER.every(
        (r) =>
          Math.abs(r.l2ceil - Math.sqrt(r.S2)) < 5e-4 &&
          Math.abs(r.headroom - 2.5 / r.Rw) < 5e-4 &&
          r.Rw > 1.05 && r.Rw < 1.27,
      );
    },
    why: 'the stored marginal-moment ladder is strictly increasing in K_a with varB = K-1, and the stored b-ladder reproduces l2ceil = sqrt(S2) and headroom = 2.5/Rw with Rw in the ~1.10..1.25 band -- the marginal moments climb while Rw stays a bounded plateau.',
  },
  {
    id: 'imp97395-honesty-gate-no-qed',
    holds: () =>
      IMP97395_VERDICT.trivialMaxRouteRefuted === true &&
      IMP97395_VERDICT.marginalSecondMomentRouteRefuted === true &&
      IMP97395_VERDICT.weightedL2CeilingClimbs === true &&
      IMP97395_VERDICT.headroomFlatAcrossRange === true &&
      IMP97395_VERDICT.uniformRwWithinReachNumerically === true &&
      IMP97395_VERDICT.reducesToJointEquidistributionInput === true &&
      IMP97395_VERDICT.rwCertified === false &&
      IMP97395_VERDICT.m2wCertified === false &&
      IMP97395_VERDICT.anyBoundMoved === false &&
      IMP97395_VERDICT.qed === false &&
      /joint-equidistribution-not-marginal-moment/.test(IMP97395_SUBGAP.id) &&
      /JOINT equidistribution/.test(IMP97395_SUBGAP.statement) &&
      /NO QED/.test(IMP97395_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97395_HONEST_BANNER) &&
      /RH open/.test(IMP97395_HONEST_BANNER),
    why: 'assessment + partial: Rw is not certified; the marginal second-moment route is refuted (K_a diverges) on top of the imp-97310 trivial-max refutation, uniform Rw < 2.5 is numerically within reach but reduces to a named JOINT equidistribution input, and no bound moved -- honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97395_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97395-route-m-oversampling-rw-second-moment-route assertion failed: ${a.id}`,
    );
  }
}

export default {
  momentLadder: IMP97395_MOMENT_LADDER,
  bLadder: IMP97395_B_LADDER,
  measured: IMP97395_MEASURED,
  verdict: IMP97395_VERDICT,
  subGap: IMP97395_SUBGAP,
  banner: IMP97395_HONEST_BANNER,
};

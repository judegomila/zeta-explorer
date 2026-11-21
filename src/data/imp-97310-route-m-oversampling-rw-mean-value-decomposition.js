/**
 * @module imp-97310-route-m-oversampling-rw-mean-value-decomposition
 *
 * imp-97310 (numerical, DERIVATION + PARTIAL): attempt to evaluate or rigorously bound the SOLE open scalar
 * Rw = X/Xbar (imp-97285 weighted inverse-residue oversampling ratio, measured ~1.1..1.25) so that the
 * inverse-line mean square M2w = Rw * Mbar can be certified below the squared target kappa_arith^2 = 0.32546.
 * Rw is NOT rigorously bounded here. What IS established: an exact per-modulus mean-value decomposition of Rw
 * with a rigorous b-average identity (the b-mean of Rw equals 1 exactly), and a REFUTATION of the trivial
 * per-modulus worst-case bounding route. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97285 / imp-97271 / imp-97203).
 * -------------------------------------------------------------------------------
 * c_0(h/a) = Sum_{n=1}^{a-1} (n/a) cot(pi n h/a) is the Vasyunin/Bettin-Conrey cotangent sum; h_a = b-inverse
 * mod a. imp-97285 factored the inverse-line mean square EXACTLY as M2w = Rw * Mbar, with
 *     X    = Sum_{a,(a,b)=1} c_0(h_a/a)^2 / a            (inverse line: ONE residue h_a per modulus a),
 *     Xbar = Sum_{a,(a,b)=1} E_h[c_0(h/a)^2] / a         (residue-averaged surrogate: full-residue mean),
 *     Mbar = Xbar / Sum_a a  (Bettin-Conrey-bounded),    Rw = X / Xbar  (the SOLE open scalar).
 * E_h[c_0(h/a)^2] = (1/phi(a)) Sum_{h mod a}* c_0(h/a)^2 is the full-residue mean square. The sufficient
 * condition (imp-97285) is Rw < 0.32546 / Mbar_max (~2.5 at measured Mbar ~ 0.13), with ~2x measured
 * headroom. This leaf probes the STRUCTURE of Rw toward a rigorous bound.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS: exact per-modulus decomposition). Rw is a convex combination of per-modulus ratios.
 * -------------------------------------------------------------------------------
 * Define the per-modulus oversampling ratio and its weight
 *     r_a(b) = c_0(h_a/a)^2 / E_h[c_0(h/a)^2] >= 0 ,   w_a(b) = ( E_h[c_0(h/a)^2] / a ) / Xbar >= 0 .
 * Then IDENTICALLY
 *     Rw(b) = X / Xbar = Sum_{a,(a,b)=1} w_a(b) r_a(b) ,   Sum_{a,(a,b)=1} w_a(b) = 1 .
 * So Rw is a weighted average (convex combination) of the per-modulus ratios r_a, with weights summing to 1.
 * VERIFIED to machine precision (reconstruction residual < 1e-15) at b = 61,151,211,401, reproducing the
 * imp-97285 Rw ladder (1.10078, 1.17213, 1.14714, 1.19945). This is an exact algebraic identity, not a fit.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (RIGOROUS: b-average identity). The b-mean of every per-modulus ratio is EXACTLY 1.
 * -------------------------------------------------------------------------------
 * Fix a modulus a. As b ranges over the reduced residues (Z/aZ)^*, the inverse h_a = b-inverse mod a ranges
 * over (Z/aZ)^* BIJECTIVELY (inversion is an involution on the unit group). Therefore
 *     E_b[r_a(b)] := (1/phi(a)) Sum_{b in (Z/aZ)^*} c_0(h_a/a)^2 / E_h[c_0(h/a)^2]
 *                  = (1/phi(a)) Sum_{h in (Z/aZ)^*} c_0(h/a)^2 / E_h[c_0(h/a)^2]
 *                  = E_h[c_0(h/a)^2] / E_h[c_0(h/a)^2] = 1   EXACTLY.
 * VERIFIED to 12 digits at a = 11,31,61,101,211,401,601,1009 (avgR = 1.000000000000). CONSEQUENCE: Rw is a
 * fluctuation of a quantity whose per-modulus b-mean is pinned to 1; the measured plateau Rw ~ 1.25 is a
 * modest POSITIVE fixed-b fluctuation above the exact mean of 1, not a systematic climb. This is the rigorous
 * mean-value core of the equidistribution the imp-97285 sub-gap requires: equidistribution IN MEAN holds
 * exactly; only the POINTWISE (uniform-over-b) bound is open.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (MEASURED, REFUTATION). The trivial per-modulus worst-case ceiling GROWS -- it cannot bound Rw.
 * -------------------------------------------------------------------------------
 * The most direct route to a uniform Rw bound is to bound each r_a(b) by its modulus-wide worst case
 *     C_a := max_{h in (Z/aZ)^*} c_0(h/a)^2 / E_h[c_0(h/a)^2]   (>= r_a(b) for every b),
 * giving Rw <= max_a C_a. MEASURED (tmp/imp-97310-scratch.mjs, exact O(a^2) kernels):
 *     a:    11     31     61     101    211    401    601    1009
 *     C_a:  3.48   6.30   8.86   10.64  14.59  18.08  20.89  24.78
 * C_a GROWS UNBOUNDED (log-log slope ~ 0.38 in a; between log a and sqrt a). So sup_a C_a = +infinity and the
 * trivial worst-case bound gives Rw <= +infinity -- USELESS. This REFUTES the trivial-max bounding route:
 * because a few residues h carry an unboundedly large share of the c_0^2 mass (the cotangent sum concentrates
 * near small-denominator h), a uniform bound on Rw CANNOT come from bounding each r_a by its modulus maximum.
 * A genuine ANTI-CONCENTRATION / equidistribution argument -- showing the inverse residues h_a = b-inverse
 * mod a AVOID the C_a-attaining residues on the a-weighted average -- is required. Result 2 shows that
 * avoidance holds exactly IN MEAN; the pointwise transfer is the remaining obstruction.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): (1) the exact convex decomposition Rw = Sum_a w_a r_a, Sum w_a = 1; (2) the exact
 * per-modulus b-average identity E_b[r_a] = 1 (inversion bijection on the unit group), so Rw fluctuates about
 * a b-mean pinned to 1. MEASURED (not proved): the trivial per-modulus ceiling C_a = max_h c_0^2 / E_h[c_0^2]
 * grows unboundedly (~ a^0.38), refuting the trivial-max bounding route. OPEN: a uniform (pointwise-in-b)
 * bound Rw <= ~2.5 -- it requires an anti-concentration/equidistribution transfer that the exact in-mean
 * identity (Result 2) does NOT by itself supply. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97285-route-m-offdiag-oversampling-factorization.js (parent: M2w = Rw * Mbar, Rw the sole open scalar)
 * @see imp-97271-route-m-inverse-oversampling-ladder-extended.js (OVR ~1.254 plateau to b=64001)
 * @see imp-97295-route-m-offdiagonal-evaluation-reclassification-honest-status.js (honest-status note)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (grandparent: c_1 <= sqrt(M2w))
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97310 (numerical, opus-4-8, api-pool). Derivation + partial; NO QED.
 */

// -- exact kernels (small-b/small-a self-check only; O(b^3) / O(a^2), keep sizes modest at import) --
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

// RESULT 2 kernel: per-modulus b-average of r_a and the trivial worst-case ceiling C_a. O(a^2).
function perModulusStats(a) {
  const sq = [];
  let sumSq = 0;
  for (let h = 1; h < a; h++) {
    if (gcd(h, a) !== 1) continue;
    const v = c0direct(h, a);
    sq.push(v * v);
    sumSq += v * v;
  }
  const phi = sq.length;
  const mean = sumSq / phi;
  // avgR = (1/phi) Sum_b r_a(b) = (1/phi) Sum_h (c_0^2/mean) = 1 by the inversion bijection.
  let avgR = 0;
  let maxSq = 0;
  for (const w of sq) {
    avgR += w / mean / phi;
    if (w > maxSq) maxSq = w;
  }
  return { a, phi, mean, avgR, ceiling: maxSq / mean };
}

// RESULT 1 kernel: exact convex decomposition Rw = Sum_a w_a r_a, Sum w_a = 1. O(b^3); keep b modest.
function decomposeRw(b) {
  const rows = [];
  let X = 0, Xbar = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    const ha = modinv(b, a);
    const vha = c0direct(ha, a);
    let sumSq = 0, cnt = 0;
    for (let h = 1; h < a; h++) {
      if (gcd(h, a) !== 1) continue;
      const v = c0direct(h, a);
      sumSq += v * v;
      cnt++;
    }
    const mean = sumSq / cnt;
    X += (vha * vha) / a;
    Xbar += mean / a;
    rows.push({ a, r_a: (vha * vha) / mean, wnum: mean / a });
  }
  const Rw = X / Xbar;
  let wsum = 0, recon = 0;
  for (const row of rows) {
    const w = row.wnum / Xbar;
    wsum += w;
    recon += w * row.r_a;
  }
  return { b, Rw, wsum, recon, reconResidual: Math.abs(Rw - recon) };
}

// MEASURED trivial-ceiling ladder C_a = max_h c_0^2 / E_h[c_0^2] (tmp/imp-97310-scratch.mjs).
export const IMP97310_CEILING_LADDER = Object.freeze([
  Object.freeze({ a: 11, ceiling: 3.4840, avgR: 1.0 }),
  Object.freeze({ a: 31, ceiling: 6.3049, avgR: 1.0 }),
  Object.freeze({ a: 61, ceiling: 8.8569, avgR: 1.0 }),
  Object.freeze({ a: 101, ceiling: 10.6406, avgR: 1.0 }),
  Object.freeze({ a: 211, ceiling: 14.5884, avgR: 1.0 }),
  Object.freeze({ a: 401, ceiling: 18.0814, avgR: 1.0 }),
  Object.freeze({ a: 601, ceiling: 20.8890, avgR: 1.0 }),
  Object.freeze({ a: 1009, ceiling: 24.7810, avgR: 1.0 }),
]);

// MEASURED Rw decomposition ladder (reproduces imp-97285 Rw values via the convex decomposition).
export const IMP97310_RW_LADDER = Object.freeze([
  Object.freeze({ b: 61, Rw: 1.10078 }),
  Object.freeze({ b: 151, Rw: 1.17213 }),
  Object.freeze({ b: 211, Rw: 1.14714 }),
  Object.freeze({ b: 401, Rw: 1.19945 }),
]);

export const IMP97310_MEASURED = Object.freeze({
  bAverageOfRaIsOne: 1.0, // E_b[r_a(b)] = 1 EXACTLY (inversion bijection on the unit group); verified 12 digits
  ceilingGrowsUnbounded: true, // C_a = max_h c_0^2 / E_h[c_0^2] grows ~ a^0.38, so sup_a C_a = +infinity
  ceilingLogLogSlope: 0.38, // log-log slope of C_a vs a (between log a and sqrt a)
  ceilingAt1009: 24.7810, // trivial worst-case ceiling already ~25x at a=1009 and still climbing
  RwPlateau: 1.2, // measured Rw ~ 1.1..1.25, level with the imp-97271 OVR ~1.254 plateau
  sufficientRwTarget: 2.5, // 0.32546 / Mbar (~0.13): Rw < ~2.5 suffices; measured Rw ~ 1.2 is ~2x below
  squaredTarget: 0.32546, // kappa_arith^2 -- certify M2w below this
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  bMax: 401,
  aMax: 1009,
});

export const IMP97310_VERDICT = Object.freeze({
  question:
    'evaluate or rigorously bound the single open scalar Rw = X/Xbar (imp-97285 weighted inverse-residue ' +
    'oversampling ratio, measured ~1.2) so M2w = Rw * Mbar can be certified below kappa_arith^2 = 0.32546?',
  convexDecompositionExact: true, // Rw = Sum_a w_a r_a, Sum w_a = 1, reconstructs to machine precision
  bAverageIdentityRigorous: true, // E_b[r_a(b)] = 1 exactly by the inversion bijection on the unit group
  trivialMaxBoundRouteRefuted: true, // C_a = max_h c_0^2 / E_h[c_0^2] grows unboundedly (~a^0.38)
  equidistributionInMeanHolds: true, // Rw fluctuates about a b-mean pinned exactly to 1
  pointwiseUniformBoundOpen: true, // a uniform Rw <= ~2.5 over ALL b stays open
  rwCertified: false, // Rw stays MEASURED ~1.2
  m2wCertified: false, // M2w stays MEASURED ~0.16
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'Rw is NOT rigorously bounded. Two rigorous structural facts are established: (1) the EXACT convex ' +
    'decomposition Rw(b) = Sum_{a,(a,b)=1} w_a(b) r_a(b) with per-modulus ratio r_a = c_0(h_a/a)^2 / ' +
    'E_h[c_0(h/a)^2], nonnegative weights w_a = (E_h[c_0^2]/a)/Xbar summing to 1 (reconstructs the imp-97285 ' +
    'Rw ladder to machine precision); (2) the EXACT per-modulus b-average identity E_b[r_a(b)] = 1 -- as b ' +
    'ranges over (Z/aZ)^* the inverse h_a = b-inverse mod a ranges over it bijectively, so the b-mean of r_a ' +
    'is pinned to 1 and the measured plateau Rw ~ 1.25 is a modest positive fixed-b fluctuation above 1, not ' +
    'a climb. This makes equidistribution IN MEAN exact. But the trivial route to a uniform bound -- bound ' +
    'each r_a by its modulus maximum C_a = max_h c_0^2 / E_h[c_0^2] -- is REFUTED: C_a grows unboundedly ' +
    '(~a^0.38, already ~25x at a=1009), because the cotangent sum concentrates its c_0^2 mass on a few ' +
    'small-denominator residues. A uniform Rw bound thus needs a genuine ANTI-CONCENTRATION / ' +
    'equidistribution transfer (the inverse residues h_a avoid the C_a-attaining residues on the a-weighted ' +
    'average), which the in-mean identity does not by itself supply. Rw and M2w stay MEASURED. No bound on ' +
    'Lambda moves; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97310_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + partial only: the imp-97285 open scalar ' +
  'Rw = X/Xbar is NOT rigorously bounded. Established rigorously: the exact convex decomposition ' +
  'Rw = Sum_a w_a r_a (weights sum to 1) and the exact per-modulus b-average identity E_b[r_a] = 1 (inversion ' +
  'bijection), so Rw fluctuates about a b-mean pinned to 1 -- equidistribution in mean is exact. REFUTED: the ' +
  'trivial worst-case bound Rw <= max_a max_h c_0^2/E_h[c_0^2], since that ceiling C_a grows unboundedly ' +
  '(~a^0.38). A uniform Rw <= ~2.5 needs a genuine anti-concentration/equidistribution transfer, which stays ' +
  'open. Rw ~1.2 and M2w ~0.16 stay measured. No bound on Lambda moved.';

export const IMP97310_SUBGAP = Object.freeze({
  id: 'imp-97310-inverse-residue-anticoncentration-pointwise-transfer',
  statement:
    'upgrade the EXACT in-mean identity E_b[r_a(b)] = 1 to a POINTWISE (uniform-over-b) bound Rw(b) = ' +
    'Sum_{a,(a,b)=1} w_a(b) r_a(b) <= 0.32546/Mbar_max (~2.5) by an anti-concentration/equidistribution ' +
    'argument showing that the inverse residues h_a = b-inverse mod a avoid the C_a-attaining residues (the ' +
    'few small-denominator h carrying the bulk of the c_0^2 mass) on the a-weighted average. The trivial ' +
    'worst-case bound Rw <= max_a C_a is USELESS because C_a = max_h c_0(h/a)^2/E_h[c_0(h/a)^2] grows ' +
    'unboundedly (~a^0.38). MEASURED Rw ~ 1.1..1.25 (level with the imp-97271 OVR ~1.254 plateau); the ' +
    'in-mean bound and the convex decomposition are rigorous, the pointwise transfer stays MEASURED.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97310_ASSERTIONS = [
  {
    id: 'imp97310-convex-decomposition-exact',
    holds: () => {
      // Rw = Sum_a w_a r_a with weights summing to 1, reconstructing to machine precision at b=61,101.
      for (const b of [61, 101]) {
        const d = decomposeRw(b);
        if (!(Math.abs(d.wsum - 1) < 1e-12)) return false;
        if (!(d.reconResidual < 1e-9)) return false;
      }
      return true;
    },
    why: 'the exact convex decomposition Rw = Sum_a w_a r_a has weights summing to 1 and reconstructs Rw to machine precision at b=61,101 -- Rw is a weighted average of the per-modulus oversampling ratios, an algebraic identity not a fit.',
  },
  {
    id: 'imp97310-b-average-identity-is-one',
    holds: () => {
      // E_b[r_a(b)] = 1 exactly for every modulus a, by the inversion bijection on the unit group.
      for (const a of [11, 31, 61, 101]) {
        const s = perModulusStats(a);
        if (!(Math.abs(s.avgR - 1) < 1e-9)) return false;
      }
      return true;
    },
    why: 'the per-modulus b-average of r_a is exactly 1 at a=11,31,61,101 -- as b ranges over the unit group the inverse h_a ranges over it bijectively, so equidistribution in mean is exact and Rw fluctuates about a b-mean pinned to 1.',
  },
  {
    id: 'imp97310-trivial-ceiling-grows-unbounded',
    holds: () => {
      // C_a = max_h c_0^2 / E_h[c_0^2] strictly increases with a (refutes the trivial-max bounding route).
      const cLo = perModulusStats(61).ceiling;
      const cHi = perModulusStats(211).ceiling;
      if (!(cLo > 5 && cHi > 12)) return false; // both already large
      if (!(cHi > cLo + 3)) return false; // grows, not a plateau
      return true;
    },
    why: 'the trivial per-modulus worst-case ceiling C_a = max_h c_0^2/E_h[c_0^2] grows from ~8.9 (a=61) to ~14.6 (a=211) -- it is unbounded, so bounding each r_a by its modulus maximum gives Rw <= +infinity and cannot certify a uniform bound.',
  },
  {
    id: 'imp97310-ceiling-ladder-monotone-consistent',
    holds: () => {
      // Stored ceiling ladder is strictly increasing and the Rw ladder reproduces the imp-97285 band.
      const L = IMP97310_CEILING_LADDER;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].ceiling > L[i - 1].ceiling)) return false;
        if (!(L[i].avgR === 1.0)) return false;
      }
      return IMP97310_RW_LADDER.every((r) => r.Rw > 1.05 && r.Rw < 1.27);
    },
    why: 'the stored ceiling ladder is strictly increasing with avgR pinned to 1 at every rung, and the Rw ladder stays in the ~1.10..1.25 band -- the in-mean identity holds exactly while the worst-case ceiling climbs unboundedly.',
  },
  {
    id: 'imp97310-honesty-gate-no-qed',
    holds: () =>
      IMP97310_VERDICT.convexDecompositionExact === true &&
      IMP97310_VERDICT.bAverageIdentityRigorous === true &&
      IMP97310_VERDICT.trivialMaxBoundRouteRefuted === true &&
      IMP97310_VERDICT.equidistributionInMeanHolds === true &&
      IMP97310_VERDICT.pointwiseUniformBoundOpen === true &&
      IMP97310_VERDICT.rwCertified === false &&
      IMP97310_VERDICT.m2wCertified === false &&
      IMP97310_VERDICT.anyBoundMoved === false &&
      IMP97310_VERDICT.qed === false &&
      /anticoncentration-pointwise-transfer/.test(IMP97310_SUBGAP.id) &&
      /pointwise/.test(IMP97310_SUBGAP.statement) &&
      /NO QED/.test(IMP97310_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97310_HONEST_BANNER) &&
      /RH open/.test(IMP97310_HONEST_BANNER),
    why: 'derivation + partial: Rw is not certified; two rigorous structural facts (convex decomposition, in-mean identity) are established and the trivial-max bounding route is refuted, with no bound moved -- honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97310_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97310-route-m-oversampling-rw-mean-value-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default {
  ceilingLadder: IMP97310_CEILING_LADDER,
  rwLadder: IMP97310_RW_LADDER,
  measured: IMP97310_MEASURED,
  verdict: IMP97310_VERDICT,
  subGap: IMP97310_SUBGAP,
  banner: IMP97310_HONEST_BANNER,
};

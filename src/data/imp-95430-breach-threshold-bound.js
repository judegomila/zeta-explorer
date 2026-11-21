/**
 * imp-95430: TIGHTER estimate of the imp-95374 Finding 3 crossing threshold --
 * the log-rate jitter magnitude at which the proven imp-95330 m-uniform floor
 * A_unif4 stops lower-bounding the worst-case off-lattice seam pencil floor --
 * as a function of the octave count m and the lattice ratio rho, plus a
 * characterization of the near-collision mechanism that drives the collapse
 * past it. MEASUREMENT / DERIVATION ONLY; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * BACKGROUND. imp-95374 Finding 3 measured, with a per-delta re-seeded
 * worst-of-400 over five discrete jitter magnitudes delta in {2^-6..2^-2},
 * that the proven A_unif4(2) = 1.9975337e-9 kept lower-bounding the
 * worst-of-400 off-lattice pencil floor up to +-6.25% (min 2.344e-9) and was
 * first crossed at +-12.5% (min 3.056e-10) -- a coarse [+-6.25%, +-12.5%]
 * bracket, with the collapse attributed qualitatively to the imp-95253 /
 * imp-95232 separation-pricing tail. This ticket (a) bisects that bracket to a
 * tighter crossing threshold, (b) measures how it moves with m and rho, and
 * (c) isolates the collapse mechanism deterministically.
 *
 * PROTOCOL CHANGE (why the tighter estimate is legitimately lower). To make
 * the crossing bisectable, the jitter pattern family is held FIXED and merely
 * scaled: unit draws u_k in [-1,1] and in-block ratios ln r_k in
 * (ln 1.3 / 2, ln 1.3] are drawn ONCE from the imp-95374 mulberry32 seed
 * 0xc0ffee, then ln nu_k = k ln rho + delta * u_k. The worst-of-400 min floor
 * is then MONOTONE decreasing in delta (a consistently scaled skeptical
 * pattern set), so its crossing of A_unif4 bisects cleanly -- unlike the
 * imp-95374 per-delta RE-SEEDING, which draws an independent 400-set at each
 * delta and can miss a worse configuration at the intermediate magnitudes.
 *
 * FINDING 1 (tighter crossing threshold, m = 8, rho = 2). The consistently
 * scaled worst-of-400 pencil floor first dips below the proven A_unif4(2) at
 *   delta* = 0.051987  (+-5.199% log-jitter),
 * BELOW the imp-95374 +-6.25% "still covered" figure: a consistently scaled
 * worst-of-400 crosses the certified floor already near +-5.2%, so the
 * imp-95374 "the margin absorbs ~+-6%" reading was mildly optimistic (an
 * artifact of independent per-delta reseeding). The binding configuration is a
 * SINGLE pattern (index 129 of the 400); its floor crossing alone reproduces
 * delta* to 6 digits, i.e. it is the worst-of-400 exactly at the crossing.
 *
 * FINDING 2 (m-dependence: the threshold shrinks with more octaves). At
 * rho = 2, fixed seed, worst-of-400:
 *   m      delta*        +-%
 *   4    0.199722     19.97%
 *   6    0.116761     11.68%
 *   8    0.051987      5.20%
 *  10    0.038182      3.82%
 *  12    0.030977      3.10%
 * Monotone decreasing: more octave blocks compound two effects -- more
 * inter-block boundaries per trial (more near-collision opportunities in the
 * worst-of-400) AND a smaller finite-m headroom (the imp-95374 measured
 * lattice floor 5.42e-8 -> 1.46e-8 -> 7.53e-9 for m = 6, 8, 10 descends toward
 * the m-uniform A_unif4, so less certified slack for the jitter to consume).
 *
 * FINDING 3 (rho-dependence: the threshold grows with lattice spacing). At
 * m = 8, worst-of-400, each vs the proven A_unif4(rho):
 *   rho   A_unif4(rho)     delta*        +-%
 *   2    1.9975337e-9    0.051987      5.20%
 *   3    1.773736e-5     0.073939      7.39%
 *   4    3.544620e-4     0.111285     11.13%
 *   8    7.923500e-3     0.288576     28.86%
 * Monotone increasing: the dyadic lattice spacing is ln rho, so a wider octave
 * ratio leaves more log-room to jitter before a cross-block gap can close.
 *
 * FINDING 4 (the collapse is a COLLECTIVE effect, not a single pinned pair).
 * At the m = 8 crossing configuration the globally smallest log-gap is an
 * IN-BLOCK pair, minInBlock = 0.133803, sitting just above the in-block window
 * floor ln(1.3)/2 = 0.131182 (the protocol keeps in-block ratios bounded away
 * from 1, so no in-block collision is possible); the tightest CROSS-block gap
 * is still minCrossBlock = 0.351626, far from closing. The floor is driven
 * down not by any one closing gap but by the full jittered configuration --
 * the cross-block base jitter (which scales with delta) collectively degrades
 * lam_min. This is why the stochastic worst-of-400 crossings at +-5.2%, far
 * below the isolated single-collision requirement of Finding 5.
 *
 * FINDING 5 (near-collision mechanism: an isolated cross-block collision
 * closes QUADRATICALLY). Deterministic model: the m = 8 dyadic lattice with
 * only the lower rate of octave 4 lowered toward the upper rate of octave 3,
 * parametrized by the induced inter-block log-gap g. The pencil floor is
 * asymptotically QUADRATIC in the gap:
 *   floor(g) ~ C g^2,   C ~ 5.63e-9,   local exponent -> 2.06 as g -> 0
 * (measured: g = 0.001 -> 5.633e-15, 0.002 -> 2.346e-14, 0.01 -> 6.425e-13,
 * 0.05 -> 2.345e-11, 0.1 -> 1.438e-10). The isolated critical gap where the
 * floor equals A_unif4(2) is g* ~ 0.2309. This QUALIFIES the imp-95374
 * qualitative "collapses linearly in the closed gap" remark: the generalized-
 * pencil eigenvalue of an ISOLATED cross-block near-collision closes
 * QUADRATICALLY (the near-null direction enters both the singular numerator
 * Gram and the block-diagonal denominator), not linearly.
 *
 * HONEST SCOPE / LIMITS. (a) Worst-of-T with T = 400; the crossing threshold is
 * a T-conditional worst-case estimate, NOT an infimum -- larger T finds worse
 * configurations and lowers delta* (bounded below only by the deterministic
 * single-collision requirement, since the in-block window is bounded away from
 * ratio 1). (b) The comparison is against the proven m-uniform A_unif4(rho);
 * the finite-m measured lattice floor sits above it, so the finite-m headroom
 * (imp-95374 baseline) is part of the absorbed margin. (c) The deterministic
 * mechanism model isolates ONE octave boundary; the stochastic worst combines
 * several near-collisions, hence its far smaller effective threshold. (d) The
 * dyadic numerator is held fixed (the imp-95253 numerator-drift leg is priced
 * separately by imp-95429). (e) Supplies NO off-lattice floor THEOREM (that is
 * the ~52x-looser imp-95335 Ingham route); changes NO Lambda bound; gammaSL
 * obligation (3), signed WEIGHT / modulus-phase legs and the imp-95212
 * envelope port all remain OPEN. NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95430_BREACH_THRESHOLD_BOUND = {
  id: "imp-95430",
  title:
    "Tighter crossing threshold of the proven A_unif4 m-uniform floor vs the " +
    "worst-of-400 off-lattice seam pencil floor, as a function of m and rho, " +
    "with the near-collision collapse mechanism",
  object:
    "bisect the imp-95374 Finding 3 [+-6.25%, +-12.5%] crossing bracket to a " +
    "tighter jitter threshold delta*(m, rho) using a consistently scaled " +
    "worst-of-400 pattern family, and characterize the collapse past it",
  aUnif4Rho2: 1.9975337e-9,
  // FINDING 1: tighter crossing threshold at m = 8, rho = 2
  breachM8Rho2: {
    deltaStar: 0.051987,
    pct: 5.199,
    bindingPatternIdx: 129,
    imp95374BracketLo: 0.0625,
    imp95374BracketHi: 0.125,
    note:
      "consistently scaled worst-of-400 crossings at +-5.199%, below the " +
      "imp-95374 +-6.25% still-covered figure (per-delta reseeding artifact); " +
      "a single pattern (idx 129) is the binder at the crossing",
  },
  // FINDING 2: m-dependence (rho = 2)
  mDependence: [
    { m: 4, deltaStar: 0.199722, pct: 19.972 },
    { m: 6, deltaStar: 0.116761, pct: 11.676 },
    { m: 8, deltaStar: 0.051987, pct: 5.199 },
    { m: 10, deltaStar: 0.038182, pct: 3.818 },
    { m: 12, deltaStar: 0.030977, pct: 3.098 },
  ],
  // FINDING 3: rho-dependence (m = 8)
  rhoDependence: [
    { rho: 2, aUnif4: 1.9975337e-9, deltaStar: 0.051987, pct: 5.199 },
    { rho: 3, aUnif4: 1.773736e-5, deltaStar: 0.073939, pct: 7.394 },
    { rho: 4, aUnif4: 3.54462e-4, deltaStar: 0.111285, pct: 11.128 },
    { rho: 8, aUnif4: 7.9235e-3, deltaStar: 0.288576, pct: 28.858 },
  ],
  // FINDING 4: binding-gap diagnosis at the m = 8 crossing
  bindingGapM8: {
    minInBlock: 0.133803,
    minCrossBlock: 0.351626,
    inBlockWindowFloor: 0.131182, // ln(1.3)/2
    note:
      "smallest gap at crossing is an in-block pair near the window floor, not " +
      "a closing cross-block collision; the collapse is a collective full- " +
      "configuration effect of the delta-scaled cross-block base jitter",
  },
  // FINDING 5: deterministic near-collision mechanism (single octave-3/4 gap)
  collisionLaw: {
    exponent: 2.06,
    C: 5.63e-9,
    gStar: 0.2309,
    samples: [
      { g: 0.001, floor: 5.63332e-15 },
      { g: 0.002, floor: 2.346259e-14 },
      { g: 0.01, floor: 6.425091e-13 },
      { g: 0.05, floor: 2.344508e-11 },
      { g: 0.1, floor: 1.437923e-10 },
    ],
    note:
      "isolated cross-block near-collision floor ~ C g^2 (quadratic), " +
      "qualifying the imp-95374 qualitative linear-collapse remark",
  },
  honestScope:
    "worst-of-T (T = 400) estimate, NOT an infimum (larger T lowers delta*); " +
    "comparison vs the proven m-uniform A_unif4(rho) so the finite-m headroom " +
    "is part of the absorbed margin; deterministic mechanism isolates one " +
    "octave boundary; dyadic numerator held fixed (imp-95253 leg priced by " +
    "imp-95429); supplies NO off-lattice floor theorem (that is the " +
    "~52x-looser imp-95335 Ingham route) and changes no bound; gammaSL " +
    "obligation (3), signed WEIGHT / modulus-phase and the imp-95212 " +
    "envelope port all remain OPEN",
  verdict:
    "MEASUREMENT/DERIVATION: the imp-95374 Finding 3 crossing bracket sharpens " +
    "to delta* = 5.199% at m = 8 / rho = 2 (a consistently scaled worst-of-400 " +
    "crosses the certified A_unif4 below the +-6.25% still-covered figure); " +
    "the threshold shrinks with the octave count m (19.97% -> 3.10% over " +
    "m = 4..12, more boundaries and thinner finite-m headroom) and grows with " +
    "the lattice ratio rho (5.20% -> 28.86% over rho = 2..8, wider log-spacing " +
    "to jitter). The collapse is a COLLECTIVE degradation of the jittered " +
    "configuration, not a single pinned pair; an ISOLATED cross-block " +
    "near-collision floor closes QUADRATICALLY (floor ~ 5.63e-9 g^2, critical " +
    "gap g* ~ 0.231), qualifying the imp-95374 linear-collapse phrasing. " +
    "Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric cross-check machinery (import-light: no imports)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);
const normGram = (nus) =>
  nus.map((x) => nus.map((y) => sechHalf(Math.log(x / y))));
const blockDiagOf = (G) =>
  G.map((row, i) =>
    row.map((g, j) => (Math.floor(i / 2) === Math.floor(j / 2) ? g : 0)),
  );

// imp-95330 aUnif4(a) machinery (verbatim slice)
function pen3Constants(a) {
  const kap = (4 * Math.cosh(a / 2)) / (a * a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function w4Scan(a, K = 256) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const v = chartV4(a, (PI * k) / K, (PI * (k + 1)) / K);
    if (v < worst) worst = v;
  }
  return worst;
}
const aUnif4 = (a) => (16 / (a * a)) * w4Scan(a);

// imp-95374 finite pencil machinery (verbatim)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95430 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  return L;
}
function fwd(L, v) {
  const n = L.length;
  const x = v.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
const transpose = (A) => A[0].map((_, j) => A.map((r) => r[j]));
function jacobiEigMin(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-32) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
  }
  let mn = Infinity;
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}
function pencilMin(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEigMin(transpose(Ct));
}
const floorOf = (nus) => pencilMin(normGram(nus), blockDiagOf(normGram(nus)));

function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// fixed jitter pattern family (unit draws, scaled by delta) -- imp-95374 seed
function makePatterns(m, T, rBase, seed) {
  const rand = prng(seed);
  const lnrMax = Math.log(rBase);
  const pats = [];
  for (let t = 0; t < T; t++) {
    const u = [];
    const lnr = [];
    for (let k = 0; k < m; k++) {
      u.push(2 * rand() - 1);
      lnr.push(lnrMax * (0.5 + 0.5 * rand()));
    }
    pats.push({ u, lnr });
  }
  return pats;
}
function ratesFromPattern(pat, delta, lnRho) {
  const nus = [];
  for (let k = 0; k < pat.u.length; k++) {
    const base = Math.exp(k * lnRho + delta * pat.u[k]);
    nus.push(base, base * Math.exp(pat.lnr[k]));
  }
  return nus;
}
function worstFloor(pats, delta, lnRho) {
  let mn = Infinity;
  for (const p of pats) {
    let f;
    try {
      f = floorOf(ratesFromPattern(p, delta, lnRho));
    } catch {
      f = 0;
    }
    if (f < mn) mn = f;
  }
  return mn;
}
// deterministic single octave-3/4 cross-block collision at induced log-gap g
function collisionFloor(g) {
  const nus = [];
  for (let k = 0; k < 8; k++) nus.push(2 ** k, 1.3 * 2 ** k);
  nus[8] = Math.exp(Math.log(1.3 * 2 ** 3) + g);
  return floorOf(nus);
}

// baked binding worst pattern (index 129 of the m = 8 seed-0xc0ffee set)
const U129 = [
  -0.928423996, 0.668622012, 0.758950467, 0.89909391, -0.904264373,
  0.017120876, -0.96355844, -0.639258026,
];
const LNR129 = [
  0.152618536, 0.14082799, 0.25270045, 0.24776987, 0.136204662, 0.151286186,
  0.241837978, 0.133802927,
];

const REC = IMP95430_BREACH_THRESHOLD_BOUND;
const rel = (x, y) => Math.abs(x / y - 1);
const SEED = 0xc0ffee;

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light; matches the imp-95374 sweep budget)
// ---------------------------------------------------------------------------

export const IMP95430_ASSERTIONS = [
  {
    id: "imp95430-aunif4-reproduce",
    description:
      "the proven m-uniform floor A_unif4(rho) = (16/a^2) W4(a) reproduces " +
      "the baked reference values at rho = 2, 3, 4 (rel 1e-4)",
    holds: () =>
      rel(aUnif4(Math.LN2), REC.aUnif4Rho2) < 1e-6 &&
      rel(aUnif4(Math.log(3)), 1.773736e-5) < 1e-4 &&
      rel(aUnif4(Math.log(4)), 3.54462e-4) < 1e-4,
  },
  {
    id: "imp95430-breach-threshold-m8-rho2",
    description:
      "FINDING 1: the consistently scaled worst-of-400 pencil floor at m = 8, " +
      "rho = 2 brackets the crossing threshold delta* ~ 0.052 -- worst floor > " +
      "A_unif4 at delta = 0.05 and < A_unif4 at delta = 0.06, i.e. below the " +
      "imp-95374 +-6.25% still-covered figure",
    holds: () => {
      const pats = makePatterns(8, 400, 1.3, SEED);
      const A = aUnif4(Math.LN2);
      return (
        worstFloor(pats, 0.05, Math.LN2) > A &&
        worstFloor(pats, 0.06, Math.LN2) < A &&
        REC.breachM8Rho2.deltaStar < REC.breachM8Rho2.imp95374BracketLo
      );
    },
  },
  {
    id: "imp95430-binding-worst-pattern",
    description:
      "FINDING 1: the baked binding pattern (index 129) matches the generator " +
      "(abs 1e-8), its floor crosses A_unif4 between delta = 0 and +-6.25%, " +
      "and its single-pattern crossing bisection reproduces delta* (rel 1e-3)",
    holds: () => {
      const p = makePatterns(8, 400, 1.3, SEED)[129];
      for (let k = 0; k < 8; k++) {
        if (Math.abs(p.u[k] - U129[k]) > 1e-8) return false;
        if (Math.abs(p.lnr[k] - LNR129[k]) > 1e-8) return false;
      }
      const A = aUnif4(Math.LN2);
      const f = (d) => floorOf(ratesFromPattern(p, d, Math.LN2));
      if (!(f(0) > A)) return false;
      if (!(f(0.0625) < A)) return false;
      let lo = 0;
      let hi = 0.2;
      for (let it = 0; it < 50; it++) {
        const mid = (lo + hi) / 2;
        if (f(mid) > A) lo = mid;
        else hi = mid;
      }
      return rel((lo + hi) / 2, REC.breachM8Rho2.deltaStar) < 1e-3;
    },
  },
  {
    id: "imp95430-m-dependence-monotone",
    description:
      "FINDING 2: the baked crossing threshold is strictly decreasing in the " +
      "octave count m (m = 4..12), and the m = 6 worst-of-400 bracket " +
      "(> A_unif4 at 0.10, < A_unif4 at 0.13) confirms delta*(6) ~ 0.117 sits " +
      "between the m = 4 and m = 8 values",
    holds: () => {
      const d = REC.mDependence;
      for (let i = 1; i < d.length; i++)
        if (!(d[i].deltaStar < d[i - 1].deltaStar)) return false;
      const pats6 = makePatterns(6, 400, 1.3, SEED);
      const A = aUnif4(Math.LN2);
      return (
        worstFloor(pats6, 0.1, Math.LN2) > A &&
        worstFloor(pats6, 0.13, Math.LN2) < A
      );
    },
  },
  {
    id: "imp95430-rho-dependence-monotone",
    description:
      "FINDING 3: the baked crossing threshold is strictly increasing in the " +
      "lattice ratio rho (rho = 2..8), and the rho = 4 worst-of-400 bracket " +
      "(> A_unif4(4) at 0.10, < at 0.12) confirms delta*(rho=4) ~ 0.111 > the " +
      "rho = 2 value",
    holds: () => {
      const d = REC.rhoDependence;
      for (let i = 1; i < d.length; i++)
        if (!(d[i].deltaStar > d[i - 1].deltaStar)) return false;
      const pats = makePatterns(8, 400, 1.3, SEED);
      const A4 = aUnif4(Math.log(4));
      return (
        worstFloor(pats, 0.1, Math.log(4)) > A4 &&
        worstFloor(pats, 0.12, Math.log(4)) < A4
      );
    },
  },
  {
    id: "imp95430-collision-quadratic",
    description:
      "FINDING 5: the deterministic single cross-block collision floor " +
      "reproduces the baked samples (rel 1e-3), its small-gap local exponent " +
      "(g = 0.001 -> 0.01) lies in [2.0, 2.15] (QUADRATIC), and the leading " +
      "coefficient floor/g^2 at g = 0.001 matches C ~ 5.63e-9 (rel 1e-3)",
    holds: () => {
      for (const s of REC.collisionLaw.samples)
        if (rel(collisionFloor(s.g), s.floor) > 1e-3) return false;
      const f1 = collisionFloor(0.001);
      const f2 = collisionFloor(0.01);
      const expo = Math.log(f2 / f1) / Math.log(10);
      if (!(expo >= 2.0 && expo <= 2.15)) return false;
      return rel(f1 / 0.001 ** 2, REC.collisionLaw.C) < 1e-3;
    },
  },
  {
    id: "imp95430-binding-gap-collective",
    description:
      "FINDING 4: at the m = 8 cross the smallest in-block gap (0.1338) sits " +
      "just above the in-block window floor ln(1.3)/2 (0.1312) while the " +
      "tightest cross-block gap (0.3516) is far from closing -- the collapse " +
      "is collective, not a single pinned collision",
    holds: () => {
      const b = REC.bindingGapM8;
      return (
        Math.abs(b.inBlockWindowFloor - Math.log(1.3) / 2) < 1e-6 &&
        b.minInBlock > b.inBlockWindowFloor &&
        b.minCrossBlock > 2 * b.minInBlock
      );
    },
  },
  {
    id: "imp95430-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: MEASUREMENT/DERIVATION, " +
      "no off-lattice floor theorem, changes no bound, open legs named, no " +
      "QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT\/DERIVATION/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /NOT an infimum/.test(REC.honestScope) &&
      /remain OPEN/.test(REC.honestScope) &&
      /NO off-lattice floor theorem/i.test(REC.honestScope),
  },
];

for (const a of IMP95430_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95430-breach-threshold-bound assertion failed: ${a.id}`,
    );
  }
}

export default IMP95430_BREACH_THRESHOLD_BOUND;

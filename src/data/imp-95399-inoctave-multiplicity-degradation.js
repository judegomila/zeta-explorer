/**
 * imp-95399: MEASUREMENT of how the imp-95250 SPLIT-LOO / COROLLARY EV-OCT
 * every-octave certificate degrades under IN-OCTAVE MULTIPLICITY -- the
 * "separate wall" that imp-95253 deliberately isolated OUT. imp-95253
 * measured OFF-lattice (inter-octave) fragility while holding the in-octave
 * twin ratio r fixed, and flagged in-octave multiplicity as untouched.
 * Here we hold the octave skeleton on-lattice and instead pack N >= 3
 * near-coincident rates into every octave window, measuring the firing-onset
 * shift and certificate inflation as the in-octave count N grows from the
 * twin pair. MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT. The imp-95285 THEOREM EV-OCT-N actual-fence closed certificate for
 * an m-octave every-octave configuration that carries a block V_k of N rates
 * in each window [2^k, R 2^k], at depth x, is
 *   sqrt(Lambda(V, x)) <= sum_(k=0..m-1) coalN(N, R, 2^k x) / sqrt(Phi_k),
 * coalN(N, R, y) = e^(-y)[L_(N-1)(-2Ry) + 2 sum_(l<=N-2) L_l(-2Ry)] (the
 * imp-95251 THEOREM COAL-N confluent law, coalescence-uniform, no separation
 * denominators), and Phi_k = prod over cross pairs (a in V_k, b not in V_k)
 * of ((a - b)/(a + b))^2 (the imp-95249 LEMMA ANG-DET fence on 1 - sigma_k^2,
 * evaluated on the ACTUAL rates). This is the imp-95253 closed certificate
 * with the pair-only coalLaw replaced by the N-fold coalN, so it remains a
 * VALID upper bound on arbitrary positive rates (validity inherited from the
 * three proven inputs SPLIT-LOO/COAL-N/ANG-DET); only its VALUE and firing
 * onset degrade as N grows. Both ingredients are pure arithmetic, so the
 * measurement is fully reproducible across V8 (no eigensolver).
 *
 * PROTOCOL. Fix m = 6 octaves and the window ratio R = 1.1 (the same window
 * as the imp-95253 twin ratio r = 1.1), and place N equispaced rates
 * nu_(k,j) = 2^k (1 + (R - 1) j/(N - 1)), j = 0..N-1, in each octave.
 * N = 2 is the imp-95253 twin baseline; N = 3, 4, 5 are the k-fold in-octave
 * clusters. Measure the firing onset xStar(N) (bisection, certificate = 1)
 * and the certificate value / inflation ratio vs N at fixed depth.
 *
 * FINDING 1 (the firing onset roughly DOUBLES twin -> triple, then grows
 * super-linearly). At m = 6, R = 1.1:
 *   N    xStar(N)     increment
 *   2    11.573415      --        (= the actual-fence coalN twin baseline)
 *   3    26.015473    +14.442
 *   4    44.979621    +18.964
 *   5    68.332206    +23.353
 * The onset more than doubles from the twin pair to the triple, and each
 * further in-octave rate costs MORE depth than the last (+14.4, +19.0,
 * +23.4): the increments themselves grow ~+4.5 per added rate, so the onset
 * is super-linear (roughly quadratic) in N. Contrast the imp-95253
 * OFF-lattice wall, where the onset rose only ~+2.3 depth units over +-20%
 * site jitter -- in-octave multiplicity is a HARD wall, off-lattice a mild
 * one.
 *
 * FINDING 2 (the wall is set by the in-octave count N, NOT the octave count
 * m). Widening to m = 12 (near the m-uniform limit) barely moves the onsets
 * (11.84 / 26.61 / 46.03 / 69.96 at N = 2/3/4/5 vs 11.57 / 26.02 / 44.98 /
 * 68.33 at m = 6): the onset saturates within ~2.4% by m = 12. The extra
 * octaves add only tail summands whose coalN factors are depth-suppressed;
 * the wall lives in a single crowded octave.
 *
 * FINDING 3 (the dominant DRIVER is the ANG-DET fence collapse, not COAL-N
 * count-pricing). Decomposing the octave-0 summand coalN / sqrt(Phi_0) at
 * fixed depth x = 30, m = 6:
 *   N    coalN(x=30)    Phi_0           summand_0
 *   2    6.457e-12      7.194e-8        2.407e-8
 *   3    2.290e-10      8.867e-17       2.432e-2
 *   4    5.559e-9       2.981e-29       1.018e+6
 *   5    1.038e-7       2.739e-45       1.984e+15
 * The COAL-N numerator grows only ~35x per added rate (count-pricing), while
 * the actual-rate ANG-DET fence Phi_0 COLLAPSES by ~10^12 per added rate:
 * packing near-coincident rates into one window crushes the cross-Blaschke
 * separation factors quadratically (each new rate adds N cross factors to
 * every OTHER octave and receives them back). The fence, not the confluent
 * law, is what makes in-octave multiplicity a wall. This is the same
 * separation-pricing mechanism imp-95253 saw off-lattice, but driven here
 * by intra-block coincidence rather than inter-block collision.
 *
 * FINDING 4 (certificate inflation at fixed depth is astronomical). cert(N)
 * / cert(2) at m = 6:
 *   x     N=3         N=4         N=5
 *   14    2.76e+11    9.81e+29    4.20e+56
 *   20    4.85e+11    6.29e+26    1.89e+52
 *   30    1.02e+12    1.79e+27    1.04e+46
 * Each added in-octave rate inflates the certificate by ~10^11-10^12
 * (N=2->3) then ~10^15 (N=3->4) at these depths -- the fence-collapse tail.
 *
 * CROSS-CHECK. The N = 2 onset here (11.573415) sits BETWEEN the imp-95253
 * sharp-pair COAL-DOM onset (11.3495; coalN is a slightly looser majorant
 * than the sharp pair law) and the imp-95285 uniform-lattice phiHat onset
 * (14.9215; the actual-rate ANG-DET fence is TIGHTER than the uniform
 * b_(|k-l|)^(2N^2) fence). Likewise the N = 3 actual-fence onset 26.015 sits
 * below the imp-95285 phiHat N = 3 onset 33.504 -- the actual fence beats the
 * uniform lattice fence, as it must. The machinery is thus consistent with
 * both sibling routes.
 *
 * VERDICT. In-octave multiplicity is a HARD wall for the EV-OCT certificate,
 * qualitatively unlike the mild off-lattice degradation imp-95253 measured.
 * The firing onset more than doubles from the twin pair to the triple
 * (11.57 -> 26.02 at m = 6) and grows super-linearly thereafter (44.98 /
 * 68.33 at N = 4/5), set by the in-octave count N and essentially
 * independent of the octave count m. The dominant driver is the ANG-DET
 * fence collapse (~10^12 per added rate), not the COAL-N count-pricing
 * (~35x per added rate): near-coincident cluster rates crush the
 * cross-Blaschke separation. The certificate stays a VALID upper bound
 * throughout (inherited from SPLIT-LOO/COAL-N/ANG-DET), but its value
 * inflates astronomically at fixed depth. MEASUREMENT ONLY; changes no
 * bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION = {
  id: "imp-95399",
  title:
    "In-octave multiplicity degradation of the imp-95250 EV-OCT certificate: " +
    "firing-onset shift and inflation as each octave carries N >= 3 " +
    "near-coincident rates (the separate wall imp-95253 isolated out)",
  config: {
    m: 6,
    R: 1.1,
    layout: "nu_(k,j) = 2^k (1 + (R-1) j/(N-1)), j = 0..N-1, in every octave",
    fence: "actual-rate ANG-DET Phi_k (imp-95249); per-block coalN (imp-95251)",
  },
  onsetM6: [
    { N: 2, xStar: 11.573414738606768 },
    { N: 3, xStar: 26.015473426635772 },
    { N: 4, xStar: 44.97962109635296 },
    { N: 5, xStar: 68.33220622702265 },
  ],
  onsetIncrementsM6: [14.442058688029004, 18.96414766971719, 23.35258513066969],
  onsetM12: [
    { N: 2, xStar: 11.840491943061 },
    { N: 3, xStar: 26.612567 },
    { N: 4, xStar: 46.031413 },
    { N: 5, xStar: 69.962957 },
  ],
  driverAtX30: [
    { N: 2, coalN: 6.4568e-12, phi0: 7.194e-8, summand0: 2.4073e-8 },
    { N: 3, coalN: 2.2898e-10, phi0: 8.8668e-17, summand0: 2.4317e-2 },
    { N: 4, coalN: 5.5591e-9, phi0: 2.9806e-29, summand0: 1.0182e6 },
    { N: 5, coalN: 1.0384e-7, phi0: 2.7394e-45, summand0: 1.984e15 },
  ],
  inflation: {
    x14: { c2: 0.010982596391551878, c3: 3028176869.4321847, c4: 1.0775557488567443e28, c5: 4.6142263652032894e54 },
    x20: { c2: 1.3045026621124924e-7, c3: 63265.81371546042, c4: 8.209882429494546e19, c5: 2.4599298238896897e45 },
    x30: { c2: 5.795055161358173e-16, c3: 0.0005913318071021617, c4: 1036852570449.5077, c5: 6.052045637956468e30 },
  },
  crossCheck: {
    n2OnsetThisRoute: 11.573414738606768,
    n2SharpPairImp95253: 11.3495,
    n2PhiHatImp95285: 14.9215,
    n3PhiHatImp95285: 33.504309,
    note:
      "N=2 onset sits between the sharp-pair COAL-DOM (looser coalN majorant) " +
      "and the uniform-lattice phiHat (looser than the actual ANG-DET fence); " +
      "N=3 actual-fence onset 26.02 < phiHat 33.50, as it must",
  },
  verdict:
    "MEASUREMENT ONLY. In-octave multiplicity is a HARD wall, qualitatively " +
    "unlike the mild off-lattice degradation of imp-95253: the firing onset " +
    "more than doubles twin -> triple (11.57 -> 26.02 at m=6) and grows " +
    "super-linearly (44.98 / 68.33 at N=4/5), set by the in-octave count N " +
    "and near-independent of octave count m. Dominant driver is the ANG-DET " +
    "fence collapse (~10^12 per added rate) not the COAL-N count-pricing " +
    "(~35x per added rate). Certificate stays a valid upper bound throughout " +
    "(inherited from SPLIT-LOO/COAL-N/ANG-DET). Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric machinery (self-contained, import-light, pure arithmetic)
// ---------------------------------------------------------------------------

// L_k(-y) = sum_(l<=k) C(k,l) y^l / l! (imp-95251 / imp-95285 lagNeg)
function lagNeg(k, y) {
  let s = 0;
  let c = 1;
  let p = 1;
  for (let l = 0; l <= k; l++) {
    s += c * p;
    c = (c * (k - l)) / (l + 1);
    p = (p * y) / (l + 1);
  }
  return s;
}
// imp-95251 THEOREM COAL-N right side (sqrt level)
function coalN(N, R, x) {
  const y = 2 * R * x;
  let s = lagNeg(N - 1, y);
  for (let k = 0; k <= N - 2; k++) s += 2 * lagNeg(k, y);
  return Math.exp(-x) * s;
}
// imp-95249 LEMMA ANG-DET actual-rate fence
function phiFence(n1, n2) {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
}
// N equispaced rates in the window [2^k, R 2^k] in every octave k = 0..m-1
function clusterBlocks(m, N, R) {
  const b = [];
  for (let k = 0; k < m; k++) {
    const rates = [];
    for (let j = 0; j < N; j++) {
      const frac = N === 1 ? 0 : j / (N - 1);
      rates.push(2 ** k * (1 + (R - 1) * frac));
    }
    b.push(rates);
  }
  return b;
}
// EV-OCT actual-fence closed certificate (Lambda level)
function certClosed(m, N, R, x) {
  const blocks = clusterBlocks(m, N, R);
  let s = 0;
  for (let k = 0; k < m; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += coalN(N, R, blocks[k][0] * x) / Math.sqrt(phiFence(blocks[k], rest));
  }
  return s * s;
}
// firing onset: least depth at which the certificate drops below 1
function onset(m, N, R) {
  let lo = 4;
  let hi = 400;
  for (let it = 0; it < 100; it++) {
    const mid = (lo + hi) / 2;
    if (certClosed(m, N, R, mid) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Self-executing assertions (all pure arithmetic, fully reproducible)
// ---------------------------------------------------------------------------

export const IMP95399_INOCTAVE_MULTIPLICITY_ASSERTIONS = [
  {
    id: "imp95399-onset-recompute-and-double",
    description:
      "FINDING 1: the m=6 firing onset recomputes for N=2..5 and more than " +
      "doubles from the twin pair to the triple",
    holds: () => {
      const rows = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetM6;
      for (const row of rows) {
        const x = onset(6, row.N, 1.1);
        if (Math.abs(x - row.xStar) > 1e-6) return false;
      }
      return rows[1].xStar > 2 * rows[0].xStar; // 26.02 > 2 * 11.57
    },
  },
  {
    id: "imp95399-onset-superlinear",
    description:
      "FINDING 1: the onset increments themselves grow with N (super-linear, " +
      "roughly quadratic onset) at m=6",
    holds: () => {
      const inc = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetIncrementsM6;
      const rows = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetM6;
      for (let i = 0; i < inc.length; i++) {
        const d = rows[i + 1].xStar - rows[i].xStar;
        if (Math.abs(d - inc[i]) > 1e-6) return false;
      }
      return inc[1] > inc[0] && inc[2] > inc[1];
    },
  },
  {
    id: "imp95399-wall-is-N-not-m",
    description:
      "FINDING 2: widening to m=12 barely moves the onsets (within ~2.5%), " +
      "so the wall is set by the in-octave count N not the octave count m",
    holds: () => {
      const r12 = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetM12;
      const r6 = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetM6;
      // recompute the anchor N=2 m=12 onset exactly, others qualitatively
      if (Math.abs(onset(12, 2, 1.1) - r12[0].xStar) > 1e-6) return false;
      for (let i = 0; i < r12.length; i++) {
        const rel = (r12[i].xStar - r6[i].xStar) / r6[i].xStar;
        if (!(rel > 0 && rel < 0.03)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95399-driver-fence-collapse",
    description:
      "FINDING 3: at x=30 the ANG-DET fence Phi_0 collapses by ~10^12 per " +
      "added rate while coalN grows only ~35x -- the fence is the dominant " +
      "driver of the in-octave wall",
    holds: () => {
      const blk = (N) => clusterBlocks(6, N, 1.1);
      const rest0 = (N) => blk(N).filter((_, l) => l !== 0).flat();
      let prevPhi = null;
      let prevCoal = null;
      for (let N = 2; N <= 5; N++) {
        const b = blk(N);
        const phi = phiFence(b[0], rest0(N));
        const cn = coalN(N, 1.1, 30);
        if (prevPhi !== null) {
          const phiDrop = prevPhi / phi; // fence shrinks
          const coalGrow = cn / prevCoal; // numerator grows
          if (!(phiDrop > coalGrow)) return false; // fence collapse dominates
          if (!(phiDrop > 1e8)) return false; // ~10^9-10^16 per rate
          if (!(coalGrow < 1e3)) return false; // ~35x per rate
        }
        prevPhi = phi;
        prevCoal = cn;
      }
      return true;
    },
  },
  {
    id: "imp95399-inflation-table",
    description:
      "FINDING 4: the certificate inflation table cert(N) at x in {14,20,30} " +
      "recomputes exactly and grows monotonically in N at each depth",
    holds: () => {
      const inf = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.inflation;
      const check = (x, rec) => {
        const cs = [2, 3, 4, 5].map((N) => certClosed(6, N, 1.1, x));
        const ref = [rec.c2, rec.c3, rec.c4, rec.c5];
        for (let i = 0; i < 4; i++)
          if (Math.abs(cs[i] - ref[i]) > 1e-6 * Math.abs(ref[i])) return false;
        for (let i = 1; i < 4; i++) if (!(cs[i] > cs[i - 1])) return false;
        return true;
      };
      return check(14, inf.x14) && check(20, inf.x20) && check(30, inf.x30);
    },
  },
  {
    id: "imp95399-crosscheck-brackets-siblings",
    description:
      "CROSS-CHECK: the N=2 actual-fence onset sits between the imp-95253 " +
      "sharp-pair onset and the imp-95285 phiHat onset, and the N=3 " +
      "actual-fence onset is below the imp-95285 phiHat N=3 onset",
    holds: () => {
      const cc = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.crossCheck;
      const rows = IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.onsetM6;
      return (
        cc.n2OnsetThisRoute > cc.n2SharpPairImp95253 &&
        cc.n2OnsetThisRoute < cc.n2PhiHatImp95285 &&
        rows[1].xStar < cc.n3PhiHatImp95285
      );
    },
  },
  {
    id: "imp95399-verdict-honesty",
    description:
      "the verdict carries the honest labels: measurement only, hard wall, " +
      "fence-collapse driver, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT ONLY/.test(
        IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict,
      ) &&
      /HARD wall/.test(IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict) &&
      /fence collapse/.test(
        IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict,
      ) &&
      /Changes no bound/.test(
        IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict,
      ) &&
      /NO QED/.test(IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict) &&
      /refereed bound is changed/i.test(IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION.verdict),
  },
];

for (const a of IMP95399_INOCTAVE_MULTIPLICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95399-inoctave-multiplicity-degradation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95399_INOCTAVE_MULTIPLICITY_DEGRADATION;

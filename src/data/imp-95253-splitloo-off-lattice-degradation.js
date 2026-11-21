/**
 * imp-95253: MEASUREMENT of how the imp-95250 SPLIT-LOO / COROLLARY EV-OCT
 * every-octave twin-pair certificate degrades OFF the geometric dyadic
 * skeleton -- the "off-lattice rates unchanged" residual recorded in the
 * imp-95250 honestScope (residual (c)). Mirrors the imp-95232 FINDING 2
 * protocol (deterministic-PRNG jitter of the lattice sites), but for the
 * leave-one-out multi-block certificate rather than the raw
 * Blaschke-Lagrange bound. MEASUREMENT ONLY; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT. The imp-95250 COROLLARY EV-OCT closed-form certificate for a
 * twin pair {2^k, r 2^k} in every octave k = 0..m-1 at depth x is
 *   sqrt(Lambda(V, x)) <= sum_(k=0..m-1) sqrt( coalLaw(2^k x) / Phi_k ),
 * coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2)) (imp-95227 COAL-DOM +
 * imp-95231 RATE-MONO), Phi_k = prod over cross pairs (i in V_k, j not in
 * V_k) of ((nu_i - nu_j)/(nu_i + nu_j))^2 (imp-95249 LEMMA ANG-DET fence
 * on 1 - sigma_k^2). BOTH ingredients are exact on ARBITRARY positive
 * rates -- coalLaw uses per-block scale invariance
 * Lambda_k = Lambda({s_k, r s_k}, x) = Lambda({1, r}, s_k x) <=
 * coalLaw(s_k x), and Phi_k is evaluated on the actual perturbed rates --
 * so the closed form stays a VALID upper bound off the lattice; only its
 * VALUE (and firing onset) degrade, because Phi_k is separation-priced:
 * a perturbation that closes an inter-octave gap shrinks the cross
 * Blaschke factors and inflates the certificate, exactly the imp-95232
 * FINDING 2 mechanism.
 *
 * PROTOCOL. Perturb each octave SITE s_k = 2^k (1 + eps U_k), U_k in
 * [-1, 1] from a deterministic LCG, keeping the in-octave twin ratio r
 * fixed (isolating the inter-octave / off-lattice degradation, which is
 * the named residual; in-octave multiplicity is a separate wall). 400
 * trials per eps; the certificate certClosed is PURE arithmetic (no
 * eigensolver), hence fully reproducible across V8. Fixed m = 6, r = 1.1.
 *
 * FINDING 1 (depth x = 12, at the fired-regime edge). The on-lattice
 * baseline certificate is 0.30379 (fires). Degradation vs eps:
 *   eps    mean cert    worst cert    fires<1
 *   0.01    0.3063        0.3600       400/400
 *   0.05    0.3267        0.7078       400/400
 *   0.10    0.4246        1.6456       372/400
 *   0.20    1.4104       52.891        282/400
 *   0.30    3.85e5        1.256e8      239/400
 * Mild jitter (+-1% site) is near-lossless (worst 1.19x baseline). At
 * +-5% the certificate still fires on every trial (worst 0.71). At +-10%
 * it first breaks (372/400), and beyond that the separation-pricing tail
 * explodes: a trial that nearly collides two octave sites drives Phi_k
 * toward 0 and the certificate toward infinity. The certificate is
 * MORE off-lattice-fragile than the raw BL of imp-95232 (which fired
 * 400/400 through eps = 0.3): the leave-one-out Phi_k multiplies FOUR
 * cross factors per adjacent octave, so it is quadratically more
 * separation-sensitive than the single BL separation factor.
 *
 * FINDING 2 (deeper x = 14 restores robustness). At x = 14 the on-lattice
 * baseline is 7.556e-3, and the extra depth suppression buys back the
 * off-lattice margin:
 *   eps    mean cert    worst cert    fires<1
 *   0.01    7.63e-3       9.22e-3      400/400
 *   0.05    8.28e-3       2.06e-2      400/400
 *   0.10    1.09e-2       4.22e-2      400/400
 *   0.20    3.73e-2       0.6297       400/400
 *   0.30    2.66e3        8.66e5       364/400
 * Now +-20% jitter fires on EVERY trial (worst 0.63); only +-30% (where
 * sites can nearly collide) breaks it. So depth trades directly against
 * off-lattice tolerance -- the same lesson as the imp-95250 onset ladder,
 * seen here through the jitter budget.
 *
 * FINDING 3 (worst-case firing onset degrades GRACEFULLY, roughly
 * linearly in eps). Bisecting the depth at which the worst of 400
 * trials first fires:
 *   eps     xStar(worst-of-400)
 *   0.00      11.3495   (= the r = 1.1 closed onset, above the r->1
 *                          coalescent 11.3166)
 *   0.05      11.8321
 *   0.10      12.3337
 *   0.20      13.6130
 * The onset rises ~+2.26 depth units over +-20% jitter (slope ~11 per
 * unit eps), a controlled, quantified cost -- the every-octave
 * certificate carries to generic well-separated octave sites at a modest
 * depth premium, not a cliff (until sites collide near eps ~ 0.3).
 *
 * WITNESS (fixed deterministic eps = 0.2 perturbation
 * U = [-0.6, 0.4, -0.8, 0.5, -0.3, 0.7], x = 12). Closed certificate
 * 0.435154 (fires), exact-ingredient SPLIT-LOO 9.308e-3, exact pencil
 * Lambda 6.218e-5: the closed form is ~7000x above the exact pencil (the
 * imp-95250 collar, unchanged off-lattice) but still fires with room.
 *
 * VERDICT. The imp-95250 off-lattice residual is a MILD, QUANTIFIED
 * degradation at the certificate level: near-lossless to +-5% site jitter
 * at x = 12 (400/400 fire) and to +-20% at x = 14, with the firing onset
 * rising only ~+2.3 depth units over +-20% jitter. The certificate is
 * more separation-fragile than the raw BL (breaks at +-10% vs never
 * through +-30% at x = 12) because the leave-one-out fence multiplies four
 * cross Blaschke factors per octave; and it, like BL, collapses only when
 * a perturbation nearly collides two octave sites (eps ~ 0.3). The
 * count-uniform lattice structure is a convenience, not a cliff: generic
 * well-separated octave sites are certified at a modest depth premium.
 * MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION = {
  id: "imp-95253",
  title:
    "SPLIT-LOO / EV-OCT off-lattice degradation: how the every-octave " +
    "twin-pair certificate carries off the geometric dyadic skeleton",
  config: { m: 6, r: 1.1, trials: 400, protocol: "site s_k = 2^k(1 + eps U_k), U_k in [-1,1] LCG" },
  onLatticeBaseline: { x12: 0.3037895607652669, x14: 0.00755609660175329 },
  degradationX12: [
    { eps: 0.01, mean: 0.3063303622425985, worst: 0.3600351241344492, fires: 400 },
    { eps: 0.05, mean: 0.32673057728237753, worst: 0.7077514937222441, fires: 400 },
    { eps: 0.1, mean: 0.42462398617790553, worst: 1.6455568389059272, fires: 372 },
    { eps: 0.2, mean: 1.4103529136713036, worst: 52.8909824837257, fires: 282 },
    { eps: 0.3, mean: 384729.945860904, worst: 125566815.57781741, fires: 239 },
  ],
  degradationX14: [
    { eps: 0.01, mean: 0.007630634150120723, worst: 0.009216605630782266, fires: 400 },
    { eps: 0.05, mean: 0.008277458956182423, worst: 0.020577114436173827, fires: 400 },
    { eps: 0.1, mean: 0.010878932145133207, worst: 0.04215223073409942, fires: 400 },
    { eps: 0.2, mean: 0.03734501228276206, worst: 0.6296897242163746, fires: 400 },
    { eps: 0.3, mean: 2664.5773832567093, worst: 866009.6216689391, fires: 364 },
  ],
  onsetVsEps: [
    { eps: 0.0, xStarWorst: 11.34948162581263 },
    { eps: 0.05, xStarWorst: 11.832142811969604 },
    { eps: 0.1, xStarWorst: 12.333734542122286 },
    { eps: 0.2, xStarWorst: 13.61299381471484 },
  ],
  witness: {
    eps: 0.2,
    perturbation: [-0.6, 0.4, -0.8, 0.5, -0.3, 0.7],
    x: 12,
    certClosed: 0.43515382218024057,
    note: "fires (< 1); ~7000x above the exact pencil (imp-95250 collar), unchanged off-lattice",
  },
  verdict:
    "MEASUREMENT ONLY. Off-lattice = mild, quantified degradation of the " +
    "every-octave certificate: near-lossless to +-5% site jitter at x=12 " +
    "(400/400 fire) and to +-20% at x=14, firing onset rising only ~+2.3 " +
    "depth units over +-20% jitter. More separation-fragile than raw BL " +
    "(breaks at +-10% vs never through +-30% at x=12) since the LOO fence " +
    "multiplies four cross Blaschke factors per octave; collapses only when " +
    "a perturbation nearly collides two octave sites (eps ~ 0.3). Lattice " +
    "structure is a convenience, not a cliff. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function crossGram(n1, n2) {
  return n1.map((a) => n2.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function matMul(A, B) {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let l = 0; l < k; l++) {
      const a = A[i][l];
      for (let j = 0; j < m; j++) C[i][j] += a * B[l][j];
    }
  return C;
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95253 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
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
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
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
  return jacobiEig(transpose(Ct));
}
function invSym(B) {
  const n = B.length;
  const L = chol(B);
  const inv = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const e = new Array(n).fill(0);
    e[j] = 1;
    const y = fwd(L, e);
    const x = y.slice();
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) x[i] -= L[k][i] * x[k];
      x[i] /= L[i][i];
    }
    for (let i = 0; i < n; i++) inv[i][j] = x[i];
  }
  return inv;
}
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};

// off-lattice twin blocks: octave site s_k = 2^k(1 + eps U_k), pair {s_k, r s_k}
function offBlocks(m, r, eps, U) {
  const b = [];
  for (let k = 0; k < m; k++) {
    const s = 2 ** k * (1 + eps * U[k]);
    b.push([s, r * s]);
  }
  return b;
}
// closed-form COROLLARY EV-OCT certificate on the actual (perturbed) rates
function certClosed(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += Math.sqrt(coalLaw(blocks[k][0] * x) / phiFence(blocks[k], rest));
  }
  return s * s;
}
// exact-ingredient THEOREM SPLIT-LOO bound (eigensolver)
function splitLooExact(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    const s2 = cos2Direct(blocks[k], rest);
    s += Math.sqrt(lamExact(blocks[k], x) / (1 - s2));
  }
  return s * s;
}
// deterministic LCG on [-1, 1] (matches the imp-95232 style)
function mkRnd(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return (s / 2147483648) * 2 - 1;
  };
}
function tableRow(m, r, x, eps, trials) {
  const rnd = mkRnd(987654321 + Math.round(eps * 1000));
  let sum = 0;
  let worst = 0;
  let fires = 0;
  for (let t = 0; t < trials; t++) {
    const U = Array.from({ length: m }, () => rnd());
    const c = certClosed(offBlocks(m, r, eps, U), x);
    sum += c;
    if (c > worst) worst = c;
    if (c < 1) fires++;
  }
  return { mean: sum / trials, worst, fires };
}
function worstCert(m, r, x, eps, trials) {
  const rnd = mkRnd(555 + Math.round(eps * 1000));
  let worst = 0;
  for (let t = 0; t < trials; t++) {
    const U = Array.from({ length: m }, () => rnd());
    const c = certClosed(offBlocks(m, r, eps, U), x);
    if (c > worst) worst = c;
  }
  return worst;
}

// ---------------------------------------------------------------------------
// Self-executing assertions (the closed-form certificate is pure arithmetic,
// hence fully reproducible; eigensolver quantities checked only qualitatively)
// ---------------------------------------------------------------------------

export const IMP95253_SPLITLOO_OFF_LATTICE_ASSERTIONS = [
  {
    id: "imp95253-onlattice-baseline",
    description:
      "the on-lattice (eps=0) EV-OCT closed certificate at m=6, r=1.1 " +
      "recomputes at x=12 and x=14 and both fire (< 1)",
    holds: () => {
      const b = IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.onLatticeBaseline;
      const c12 = certClosed(offBlocks(6, 1.1, 0, new Array(6).fill(0)), 12);
      const c14 = certClosed(offBlocks(6, 1.1, 0, new Array(6).fill(0)), 14);
      if (Math.abs(c12 - b.x12) > 1e-9) return false;
      if (Math.abs(c14 - b.x14) > 1e-9) return false;
      return c12 < 1 && c14 < 1;
    },
  },
  {
    id: "imp95253-degradation-tables",
    description:
      "FINDING 1 and 2: the mean/worst/fires degradation tables recompute " +
      "exactly (deterministic PRNG, pure-arithmetic certificate) at x=12 " +
      "and x=14 across eps in {0.01,0.05,0.10,0.20,0.30}",
    holds: () => {
      const check = (rows, x) => {
        for (const row of rows) {
          const t = tableRow(6, 1.1, x, row.eps, 400);
          if (Math.abs(t.mean - row.mean) > 1e-6 * Math.abs(row.mean))
            return false;
          if (Math.abs(t.worst - row.worst) > 1e-6 * Math.abs(row.worst))
            return false;
          if (t.fires !== row.fires) return false;
        }
        return true;
      };
      return (
        check(IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.degradationX12, 12) &&
        check(IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.degradationX14, 14)
      );
    },
  },
  {
    id: "imp95253-monotone-degradation-and-depth-tradeoff",
    description:
      "the worst-case certificate rises monotonically in eps at each depth, " +
      "x=14 fires on every trial through eps=0.20 while x=12 first breaks at " +
      "eps=0.10, and x=12 stays 400/400 through eps=0.05",
    holds: () => {
      const t12 = IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.degradationX12;
      const t14 = IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.degradationX14;
      for (let i = 1; i < t12.length; i++)
        if (!(t12[i].worst > t12[i - 1].worst)) return false;
      for (let i = 1; i < t14.length; i++)
        if (!(t14[i].worst > t14[i - 1].worst)) return false;
      // depth buys back off-lattice tolerance
      if (!(t12.find((r) => r.eps === 0.1).fires < 400)) return false;
      if (!(t12.find((r) => r.eps === 0.05).fires === 400)) return false;
      if (!(t14.find((r) => r.eps === 0.2).fires === 400)) return false;
      return true;
    },
  },
  {
    id: "imp95253-onset-degrades-gracefully",
    description:
      "FINDING 3: the worst-of-400 firing onset rises monotonically and " +
      "gracefully with eps (11.35 -> 13.61 over +-20% jitter), bisection " +
      "reproducible",
    holds: () => {
      const rows = IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.onsetVsEps;
      for (const row of rows) {
        let lo = 8;
        let hi = 40;
        for (let it = 0; it < 50; it++) {
          const mid = (lo + hi) / 2;
          if (worstCert(6, 1.1, mid, row.eps, 400) > 1) lo = mid;
          else hi = mid;
        }
        if (Math.abs((lo + hi) / 2 - row.xStarWorst) > 1e-6) return false;
      }
      for (let i = 1; i < rows.length; i++)
        if (!(rows[i].xStarWorst > rows[i - 1].xStarWorst)) return false;
      return true;
    },
  },
  {
    id: "imp95253-witness-fires-collar-unchanged",
    description:
      "the fixed eps=0.2 deterministic witness fires (closed cert 0.4352 " +
      "recomputes exactly) and the imp-95250 collar is unchanged off-lattice: " +
      "exact pencil < exact-ingredient SPLIT-LOO < closed certificate, all < 1",
    holds: () => {
      const w = IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.witness;
      const blocks = offBlocks(6, 1.1, w.eps, w.perturbation);
      const cc = certClosed(blocks, w.x);
      if (Math.abs(cc - w.certClosed) > 1e-9) return false;
      const si = splitLooExact(blocks, w.x);
      const le = lamExact(blocks.flat(), w.x);
      if (!(cc < 1)) return false;
      // collar ordering (large margins; eigensolver only used for inequalities)
      return le < si && si < cc && cc / le > 100;
    },
  },
  {
    id: "imp95253-verdict-honesty",
    description:
      "the verdict carries the honest labels: measurement only, mild " +
      "quantified degradation, more separation-fragile than raw BL, no bound " +
      "change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT ONLY/.test(
        IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.verdict,
      ) &&
      /separation-fragile/.test(
        IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.verdict,
      ) &&
      /Changes no bound/.test(
        IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.verdict,
      ) &&
      /NO QED/.test(IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.verdict) &&
      /refereed bound is changed/i.test(IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION.verdict),
  },
];

for (const a of IMP95253_SPLITLOO_OFF_LATTICE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95253-splitloo-off-lattice-degradation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95253_SPLITLOO_OFF_LATTICE_DEGRADATION;

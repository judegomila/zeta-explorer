/**
 * @module imp-95451-splitloo-sigma-direction-pipeline-audit
 *
 * imp-95451 (accuracy / audit): imp-95376 flagged SECONDARY CHECK S1 -- a
 * direction-of-inequality check, not a new object -- that for the imp-95250
 * THEOREM SPLIT-LOO admissibility to hold, each transcribed block angle
 * sigma_k must be an UPPER bound so the collar factor 1/(1 - sigma_k^2) is
 * OVER- never UNDER-estimated. imp-95425 already TABULATED that direction
 * numerically for the ANG-DET fence substitution step across the ported grid.
 * THIS module does the complementary PIPELINE audit S1 named but nobody had
 * walked link-by-link: it traces the transcription pipeline
 *   imp-95220 (rate map) -> imp-95249 ANG-DET (fence) -> imp-95250 SPLIT-LOO
 *                                                          (collar)
 * and records, at EACH link, the direction verdict and any place the direction
 * is UNVERIFIED. AUDIT only; changes no bound; NO QED; no refereed bound is changed.
 *
 * WHERE sigma_k ENTERS AND HOW THE COLLAR IS BUILT (three links).
 *
 * LINK 1 -- imp-95250 LEMMA LOO (the collar itself). For F = F_k + G with
 * G in E_(V minus V_k) and sigma_k = cos of the first principal angle between
 * E_(V_k) and E_(V minus V_k), LEMMA LOO proves
 *   ||F_k|| <= ||F|| / sqrt(1 - sigma_k^2).
 * The factor 1/sqrt(1 - sigma_k^2) is a GENUINE upper bound on the
 * norm-amplification ||F_k||/||F|| for EVERY F (it is the exact operator norm
 * of the skew block projection, attained at the principal direction). So at
 * LINK 1 the direction is UNCONDITIONALLY correct AS A FUNCTION of the true
 * sigma_k: a LARGER sigma_k gives a LARGER collar, so any UPPER bound on
 * sigma_k over-estimates the collar. DIRECTION AUDIT: monotone-increasing in
 * sigma_k, so S1 reduces to "the transcribed sigma_k is >= the true sigma_k".
 *
 * LINK 2 -- imp-95249 LEMMA ANG-DET (the fence substitution). The closed-form
 * COROLLARY EV-OCT does NOT carry the true sigma_k; it substitutes the PROVEN
 * fence
 *   1 - sigma_k^2  >=  Phi_k = prod over (i in V_k, j notin V_k) beta_ij^2,
 *   beta_ij = (nu_i - nu_j)/(nu_i + nu_j),
 * so the transcribed collar is 1/Phi_k. Since Phi_k <= (1 - sigma_k^2) is a
 * proven inequality of exact rational objects, 1/Phi_k >= 1/(1 - sigma_k^2):
 * the transcribed collar OVER-estimates the true one, and the implied
 * transcribed angle sqrt(1 - Phi_k) >= sigma_k IS the required upper bound.
 * DIRECTION AUDIT: SAFE, and this is exactly the substitution imp-95425
 * tabulated (87/87 well-conditioned blocks safe, worst ratio 0.3754 < 1).
 *
 * LINK 3 -- imp-95220 THEOREM AW (the rate map that produces the nu_i). The
 * beta_ij in LINK 2 are functions of the transcribed rates nu_i = mu(d) and
 * centers, produced by the imp-95220 alias-denominator-to-dictionary-rate map.
 * KEY OBSERVATION of this audit: ANG-DET is proven for ANY set of distinct
 * positive rates, so LINK 2 CANNOT be broken by the map -- whatever rates the
 * map emits, Phi_k <= 1 - sigma_k^2 holds PROVIDED the SAME rate set nu is
 * used to form (a) the fence Phi_k, (b) the true angle sigma_k, and (c) the
 * per-block Lambda_k. Within the model family (imp-95226 exponential
 * dictionary) this identity of rate sets is structural -- every quantity is
 * read off the same nu -- so the direction is SAFE. DIRECTION AUDIT: SAFE
 * within-family; distinctness/positivity of the mapped rates is the only
 * precondition, and coincident rates (nu_i = nu_j) merely send Phi_k -> 0,
 * i.e. collar -> +inf, still an OVER-estimate (safe but vacuous).
 *
 * THE TWO PLACES THE DIRECTION IS UNVERIFIED (recorded, not violations).
 *  (U1) CROSS-FAMILY rate identity. ANG-DET guarantees the LINK-2 direction
 *       ONLY when Phi_k and sigma_k are computed from the SAME rates. If the
 *       fence is ever evaluated on the MODEL rates while the true angle
 *       sigma_k pertains to the ACTUAL Fresnel-Airy paper window (a
 *       cross-family comparison), ANG-DET does NOT cover the direction. That
 *       cross-family step is precisely the still-open imp-95376 LEG B
 *       envelope-domination inequality LamBar_paper(d) <= Lambda(E_V, d)
 *       (obligations enumerated in imp-95424); it is OUT OF S1 scope and is
 *       flagged here only so the boundary of S1 is explicit.
 *  (U2) NUMERIC ground truth at near-coalescent corners. Independent numerical
 *       confirmation of Phi_k <= 1 - sigma_k^2 fails at 3 large-m corners where
 *       the direct principal-angle solve is ill-conditioned (imp-95425
 *       measurement sub-gap); the direction there rests on the PROVEN ANG-DET
 *       fence, and an extended-precision solve is the surviving numeric gap.
 *
 * LIVE AUDIT (this module). LINK 2 was numerically covered by imp-95425;
 * LINK 1 (the collar as a genuine norm-amplification upper bound) was NOT
 * previously audited, so this module supplies it: on a concrete twin lattice
 * V_k = {2^k, r 2^k} it (i) computes the true sigma_k, (ii) draws many
 * deterministic skeptical coefficient vectors F = F_k + G, and checks that
 * the realized amplification ||F_k||/||F|| never exceeds the collar
 * 1/sqrt(1 - sigma_k^2) (LINK 1 direction), the ratio approaching 1 at the
 * principal direction; and it re-confirms the LINK-2 chain
 * Phi_k <= 1 - sigma_k^2 on the same blocks (so the two links compose in the
 * safe direction). All norms use the Cauchy-Gram inner product of the model.
 *
 * HONEST LIMITS. (a) AUDIT only: nothing here derives or moves a bound; it
 * records the direction verdict per pipeline link and the two unverified
 * boundaries (U1 cross-family = imp-95376 LEG B, U2 numeric corners =
 * imp-95425 sub-gap). (b) The within-family direction is already PROVEN
 * (LINK 1 = exact operator norm; LINK 2 = imp-95249 ANG-DET); this module
 * adds the previously-missing LINK-1 numeric audit and the link-by-link
 * ledger. (c) Model family only; no mapping to paper per-window data
 * (obligation (3) unchanged). Import-light (no zeros bundle, no sibling
 * imports; numerics self-contained). Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Self-contained numerics (import-light; mirrors imp-95250 / imp-95425)
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
        if (s <= 0) throw new Error("imp-95451 chol: pencil base not PD");
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
    const y = fwd(L, A.map((r) => r[j]));
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(L, Yt.map((r) => r[j]));
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
// TRUE cos^2 of the first principal angle between spans (imp-95249 route)
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}
// TRANSCRIBED fence on 1 - sigma^2 (imp-95249 LEMMA ANG-DET closed form)
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};
const twinLattice = (m, r) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, r * 2 ** k]);
  return blocks;
};

// Deterministic LCG so the adversarial-vector audit is reproducible.
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Cauchy-Gram norm of a coefficient vector over the full rate list.
function gramNorm2(coeff, allRates) {
  const G = cauchyGram(allRates);
  let s = 0;
  for (let i = 0; i < coeff.length; i++)
    for (let j = 0; j < coeff.length; j++) s += coeff[i] * G[i][j] * coeff[j];
  return s;
}

// LINK 1 AUDIT: is the collar 1/sqrt(1 - sigma_k^2) a genuine UPPER bound on
// the realized amplification ||F_k||/||F|| for skeptical F = F_k + G, AND is
// it SHARP (attained)? The exact sup of ||F_k||^2/||F||^2 over all F is the
// largest generalized eigenvalue of the pencil (J G J, G), J = diag(1 on the
// block-k coords, 0 else); LEMMA LOO claims this sup equals 1/(1 - sigma_k^2).
// We verify BOTH: (i) every skeptical sample stays under the collar, and
// (ii) the exact pencil sup equals the collar (sharpness -> the collar is the
// load-bearing quantity, so an upper bound on sigma_k over-estimates it).
function link1CollarAudit(m, r, nSamples) {
  const blocks = twinLattice(m, r);
  const rnd = lcg(20260914);
  let worstDeficit = Infinity; // min (collar - realized sample ratio); >= 0
  let worstSharpErr = 0; // max |exact pencil sup - collar| / collar; ~0
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    const all = [...blocks[k], ...rest];
    const s2 = cos2Direct(blocks[k], rest);
    if (!(s2 > 0 && s2 < 1 - 1e-9)) continue; // skip ill-conditioned corner
    const collar = 1 / Math.sqrt(1 - s2);
    const nk = blocks[k].length;
    // (ii) exact sup of ||F_k||^2/||F||^2 = lambda_max(J G J, G)
    const G = cauchyGram(all);
    const JGJ = G.map((row, i) =>
      row.map((g, j) => (i < nk && j < nk ? g : 0)),
    );
    const ev = pencilEig(JGJ, G);
    const supRatio = Math.sqrt(ev[ev.length - 1]);
    const sharpErr = Math.abs(supRatio - collar) / collar;
    if (sharpErr > worstSharpErr) worstSharpErr = sharpErr;
    // (i) skeptical samples must never exceed the collar
    for (let t = 0; t < nSamples; t++) {
      const c = [];
      for (let i = 0; i < all.length; i++) c.push(2 * rnd() - 1);
      const ck = c.slice(0, nk).concat(new Array(rest.length).fill(0));
      const normF2 = gramNorm2(c, all);
      const normFk2 = gramNorm2(ck, all);
      if (normF2 <= 0) continue;
      const ratio = Math.sqrt(normFk2 / normF2);
      const deficit = collar - ratio;
      if (deficit < worstDeficit) worstDeficit = deficit;
    }
  }
  return { worstDeficit, worstSharpErr };
}

// LINK 2 AUDIT: re-confirm Phi_k <= 1 - sigma_k^2 on the same lattice blocks.
function link2FenceAudit(m, r) {
  const blocks = twinLattice(m, r);
  let allSafe = true;
  let worstRatio = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    const s2 = cos2Direct(blocks[k], rest);
    if (!(s2 > 0 && s2 < 1 - 1e-9)) continue;
    const phi = phiFence(blocks[k], rest);
    const ratio = phi / (1 - s2);
    if (ratio > worstRatio) worstRatio = ratio;
    if (!(phi <= (1 - s2) * (1 + 1e-9))) allSafe = false;
  }
  return { allSafe, worstRatio };
}

const AUDIT_M = 3;
const AUDIT_R = 1.2;
const LINK1 = link1CollarAudit(AUDIT_M, AUDIT_R, 4000);
const LINK2 = link2FenceAudit(AUDIT_M, AUDIT_R);

export const IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT = {
  ticket: "imp-95451",
  rideAlong: "imp-95376 SECONDARY CHECK S1",
  scope:
    "AUDIT the imp-95220 -> imp-95249 ANG-DET -> imp-95250 SPLIT-LOO "
    + "transcription pipeline link-by-link and record, at each link, whether "
    + "sigma_k is ported as an UPPER bound so the collar 1/(1 - sigma_k^2) is "
    + "OVER- (never UNDER-) estimated, plus every place the direction is "
    + "unverified",
  links: [
    {
      link: "LINK 1 -- imp-95250 LEMMA LOO (collar)",
      role: "the collar 1/sqrt(1 - sigma_k^2) is the exact operator norm of the "
        + "skew block projection, a genuine UPPER bound on ||F_k||/||F||",
      directionVerdict: "SAFE (monotone increasing in sigma_k; any upper bound "
        + "on sigma_k over-estimates the collar)",
      auditedHere: true,
    },
    {
      link: "LINK 2 -- imp-95249 LEMMA ANG-DET (fence)",
      role: "substitutes the proven fence Phi_k <= 1 - sigma_k^2, so the "
        + "transcribed collar 1/Phi_k >= 1/(1 - sigma_k^2)",
      directionVerdict: "SAFE (proven inequality of exact rationals; tabulated "
        + "by imp-95425 on 87/87 well-conditioned blocks)",
      auditedHere: true,
    },
    {
      link: "LINK 3 -- imp-95220 THEOREM AW (rate map)",
      role: "emits the rates nu_i feeding beta_ij; ANG-DET holds for ANY "
        + "distinct positive rates, so the map cannot break LINK 2 provided the "
        + "SAME rate set forms Phi_k, sigma_k and Lambda_k",
      directionVerdict: "SAFE within the model family (structural rate-set "
        + "identity); coincident rates send Phi_k -> 0, collar -> +inf, still an "
        + "over-estimate",
      auditedHere: false,
    },
  ],
  unverified: [
    {
      id: "U1",
      place: "CROSS-FAMILY rate identity: fence on model rates vs true angle on "
        + "the actual Fresnel-Airy paper window",
      status: "OUT OF S1 SCOPE -- this IS the still-open imp-95376 LEG B "
        + "envelope-domination inequality (obligations enumerated in imp-95424)",
    },
    {
      id: "U2",
      place: "NUMERIC ground truth at 3 near-coalescent large-m corners where "
        + "the direct principal-angle solve is ill-conditioned",
      status: "direction rests on PROVEN imp-95249 ANG-DET; extended-precision "
        + "solve is the surviving numeric gap (imp-95425 sub-gap)",
    },
  ],
  verdict:
    "CONFIRMED within-family -- every pipeline link ports sigma_k in the SAFE "
    + "direction (collar over-estimated); the only unverified places are the "
    + "cross-family step (= imp-95376 LEG B, out of S1 scope) and the 3 "
    + "ill-conditioned numeric corners (imp-95425 sub-gap)",
  link1WorstDeficit: LINK1.worstDeficit, // collar - realized ratio; must be >= 0
  link1WorstSharpErr: LINK1.worstSharpErr, // |exact sup - collar|/collar; ~0
  link2AllSafe: LINK2.allSafe,
  link2WorstRatio: LINK2.worstRatio, // Phi_k/(1 - sigma_k^2) <= 1
  honest:
    "AUDIT ONLY -- records the direction verdict per pipeline link and the two "
    + "unverified boundaries (U1 cross-family = imp-95376 LEG B, U2 numeric "
    + "corners = imp-95425 sub-gap); the within-family direction is already "
    + "PROVEN (LINK 1 exact operator norm, LINK 2 imp-95249 ANG-DET). Model "
    + "family only; obligation (3) unchanged. Changes no bound; NO QED; "
    + "no refereed bound is changed.",
  fns: { link1CollarAudit, link2FenceAudit, cos2Direct, phiFence },
};

export const IMP95451_ASSERTIONS = [
  {
    id: "imp-95451-link1-collar-is-upper-bound",
    description:
      "LINK 1 (LEMMA LOO): across skeptical coefficient vectors the realized "
      + "amplification ||F_k||/||F|| never exceeds the collar 1/sqrt(1 - "
      + "sigma_k^2) -- the collar is a genuine UPPER bound (safe direction)",
    holds: () => LINK1.worstDeficit >= -1e-9,
  },
  {
    id: "imp-95451-link1-collar-sharp",
    description:
      "LINK 1: the exact sup of ||F_k||/||F|| (largest generalized eigenvalue "
      + "of (J G J, G)) EQUALS the collar 1/sqrt(1 - sigma_k^2), so the collar "
      + "is attained (sharp) and a larger sigma_k strictly enlarges it -- the "
      + "upper-bound direction is the load-bearing one",
    holds: () => LINK1.worstSharpErr < 1e-6,
  },
  {
    id: "imp-95451-link2-fence-safe-direction",
    description:
      "LINK 2 (ANG-DET): Phi_k <= 1 - sigma_k^2 on every well-conditioned block "
      + "of the audit lattice, so the transcribed collar 1/Phi_k over-estimates "
      + "1/(1 - sigma_k^2) -- consistent with imp-95425",
    holds: () => LINK2.allSafe === true && LINK2.worstRatio < 1,
  },
  {
    id: "imp-95451-links-compose-safe",
    description:
      "the two links compose in the safe direction: LINK 1 upper-bounds by the "
      + "true collar and LINK 2 upper-bounds the true collar by 1/Phi_k",
    holds: () => LINK1.worstDeficit >= -1e-9 && LINK2.worstRatio < 1,
  },
  {
    id: "imp-95451-two-unverified-places-recorded",
    description:
      "the audit records exactly the two unverified boundaries: U1 cross-family "
      + "(= imp-95376 LEG B) and U2 numeric corners (imp-95425 sub-gap)",
    holds: () => {
      const u = IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.unverified;
      return (
        u.length === 2
        && /LEG B/.test(u[0].status)
        && /imp-95425/.test(u[1].status)
      );
    },
  },
  {
    id: "imp-95451-honest-audit-only",
    description:
      "verdict is CONFIRMED within-family, AUDIT ONLY, and no refereed bound is changed"
      + "",
    holds: () =>
      /CONFIRMED within-family/.test(
        IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.verdict,
      )
      && /AUDIT ONLY/.test(IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.honest)
      && /refereed bound is changed/i.test(
        IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT.honest,
      ),
  },
];

for (const a of IMP95451_ASSERTIONS) {
  if (!a.holds())
    throw new Error(
      `imp-95451-splitloo-sigma-direction-pipeline-audit assertion failed: ${a.id}`,
    );
}

export default IMP95451_SPLITLOO_SIGMA_DIRECTION_PIPELINE_AUDIT;

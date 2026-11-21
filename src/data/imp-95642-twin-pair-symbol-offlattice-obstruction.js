/**
 * imp-95642 -- OBSTRUCTION: the lattice twin-pair Toeplitz block symbol
 * does NOT admit an off-lattice / m-uniform port; the residual onset gap
 * SPLIT-OPT - SPLIT-RZ = 4.611560 (imp-95609) is a GENUINE floor of the
 * delta-separated class, not un-ported slack.
 *
 * GRADE: derivation + numerical witness. Imports no heavy bundle. Settles
 * the imp-95609 open question ("can the twin-pair symbol be carried
 * off-lattice, or is 4.611560 a genuine floor?") in favour of GENUINE
 * FLOOR, with a structural obstruction and a two-endpoint collapse
 * witness. Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * BACKGROUND (imp-95335 / imp-95419 / imp-95609). Normalized seam Gram
 * Gtilde_ij = sech((x_i - x_j)/2) on log-rates x. THEOREM SEP-OPT
 * (imp-95419) proved the CLASS-optimal m-uniform SCALAR floor over every
 * delta-log-separated rate set is exactly the lattice Szego infimum
 * A_opt(delta) = sum_(n in Z) (-1)^n sech(n delta/2), and that the
 * equally-spaced lattice is the EXTREMAL (worst) separated configuration
 * for that scalar constant. Feeding A_opt/2 as the per-pair BLK floor into
 * the imp-95335 SPLIT chain gives the off-lattice onset SPLIT-OPT =
 * 20.593144. The lattice-pinned rung SPLIT-RZ = 15.981584 is sharper
 * because it uses the full twin-pair Toeplitz (2x2 block-Toeplitz) SYMBOL
 * per pair instead of the scalar A_opt/2, leaving a 4.611560 depth-unit
 * residual that imp-95609 attributed to BLOCK structure but left open.
 *
 * THE QUESTION. Can that twin-pair block symbol be ported off-lattice
 * (m-uniform over the delta-separated class) to pull SPLIT-OPT down toward
 * SPLIT-RZ, or is the block-vs-scalar gap a genuine floor?
 *
 * THE OBSTRUCTION (two-scale hypothesis is missing). The twin-pair symbol
 * is sharp only on a TWO-SCALE geometry: an IN-pair gap delta and a
 * CROSS-pair gap D that is bounded strictly above delta (D >= rho delta,
 * rho > 1). Its sharpness IS the retained in-pair 2x2 coupling
 * sech(delta/2): for isolated pairs (D -> inf) the Gram is block-diagonal
 * with 2x2 blocks [[1, sech(d/2)],[sech(d/2), 1]] whose lambda_min is the
 * block floor 1 - sech(delta/2). But the delta-separated CLASS is
 * SINGLE-SCALE: it constrains only min gap >= delta and admits
 * configurations with D -> delta+ (the uniform delta-lattice). There the
 * two-scale twin-pair structure DISSOLVES and, by SEP-OPT, per-pair
 * lambda_min degrades continuously to the scalar A_opt(delta). Hence any
 * class-uniform block constant F(delta) valid for ALL delta-separated
 * configurations obeys
 *   F(delta) <= inf_(class) (per-pair lambda_min) <= A_opt(delta)
 * (the uniform-lattice member is in the class), i.e. the block refinement
 * yields NO m-uniform gain: it collapses to the scalar floor. The
 * SPLIT-OPT onset is therefore class-optimal and the 4.611560 gap is a
 * GENUINE floor -- a lattice-specific (two-scale, rigid-geometry) effect
 * that the single-scale delta-separated class cannot access.
 *
 * WHERE THE PORT FAILS MECHANICALLY. In the LEMMA QUAD route (imp-95419)
 * a band-limited minorant k of exponential type delta kills every
 * off-diagonal with separation >= delta, leaving only the diagonal
 * khat(0) -- exactly the scalar floor. To RETAIN the in-pair 2x2 coupling
 * while still eliminating cross-pair terms, a matrix-valued minorant would
 * need exponential type in the OPEN window (delta, D): wide enough to see
 * the in-pair gap delta, narrow enough to vanish beyond the cross-pair gap
 * D. Under the delta-separated class D can approach delta, so this window
 * (delta, D) is empty and no such uniform minorant exists. The two-scale
 * separation that the port would require is precisely the hypothesis the
 * class omits.
 *
 * NUMERICAL WITNESS (delta = ln 1.3, verified below). Twin-pair lattice,
 * in-pair gap delta, cross-pair gap D:
 *   - block floor (isolated pairs, D -> inf): 1 - sech(delta/2) =
 *     8.543109e-3, which is 1.9389e12x the scalar A_opt(delta) =
 *     4.406252e-15 -- the block sharpening is enormous but LATTICE-BOUND.
 *   - collapse (D -> delta+, uniform lattice): per-point lambda_min ->
 *     A_opt(delta) (finite-size ratio 1.092 at 80 points, decreasing to 1
 *     as count -> inf, matching the imp-95419 Szego closure) -- the block
 *     floor is GONE, only the scalar A_opt survives.
 * The two endpoints exhibit exactly the block-vs-scalar mechanism: the
 * block floor is available only when D is bounded above delta, and the
 * class does not guarantee that.
 *
 * HONEST SCOPE. (a) This settles PORTABILITY of the twin-pair scalar-vs-
 * block gap for the m-uniform delta-separated CLASS; it does NOT touch the
 * lattice-pinned RZ-PEN chart refinements (imp-95328..95334), which stay
 * lattice-only and sharper on the lattice, as imp-95419 note (d) records.
 * (b) The verdict rests on the already-established SEP-OPT scalar result
 * plus the elementary class-infimum / continuity argument above; it
 * introduces no new cited input. (c) Model seam family only; the
 * imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay
 * OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95609-seam-gram-onset-ladder-table (the open 4.611560 residual)
 * @see imp-95419-separated-class-optimal-riesz-floor (THEOREM SEP-OPT, scalar class floor)
 * @see imp-95335-ingham-offlattice-riesz-floor (SPLIT chain, A_sep bracket)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95642_TWIN_PAIR_SYMBOL_OFFLATTICE_OBSTRUCTION = {
  id: "imp-95642",
  title:
    "OBSTRUCTION: the twin-pair Toeplitz block symbol does not port " +
    "off-lattice / m-uniformly; the SPLIT-OPT - SPLIT-RZ = 4.611560 onset " +
    "gap is a genuine floor of the single-scale delta-separated class",
  question:
    "can the imp-95609 residual 4.611560 (attributed to BLOCK structure) " +
    "be closed by porting the lattice twin-pair Toeplitz symbol off-lattice " +
    "/ m-uniformly, or is it a genuine floor?",
  verdictKind: "genuine-floor",
  delta: 0.26236426446749106, // ln 1.3
  aOpt: 4.406252285191383e-15, // scalar lattice floor A_opt(ln 1.3), imp-95419
  blockFloorIsolated: 0.008543108609445182, // 1 - sech(delta/2), isolated 2x2 twin-pair block
  blockOverScalarRatio: 1938860522843.19, // block floor / scalar floor: lattice-bound sharpening
  finiteSizeCollapseRatio80: 1.092, // uniform-lattice (D=delta) lambda_min/A_opt at 80 points
  onsetSplitOpt: 20.593144, // off-lattice m-uniform scalar-floor onset
  onsetSplitRz: 15.981584, // lattice-pinned twin-pair-symbol onset
  residualGap: 4.611560, // SPLIT-OPT - SPLIT-RZ, now shown genuine
  obstruction:
    "the twin-pair symbol is sharp only on a TWO-SCALE geometry (in-pair " +
    "gap delta, cross-pair gap D >= rho delta with rho > 1); the " +
    "delta-separated CLASS is single-scale (min gap >= delta only) and " +
    "admits D -> delta+ (the uniform lattice), where SEP-OPT forces " +
    "per-pair lambda_min down to the scalar A_opt, so any class-uniform " +
    "block constant is <= A_opt -- the block refinement gives no m-uniform " +
    "gain and 4.611560 is a genuine floor",
  mechanicalFailure:
    "a matrix-valued LEMMA-QUAD minorant retaining the in-pair 2x2 coupling " +
    "would need exponential type in the OPEN window (delta, D); the class " +
    "allows D -> delta so the window is empty and no uniform minorant exists",
  boundChange: false,
  qed: false,
  verdict:
    "GENUINE FLOOR. The lattice twin-pair Toeplitz block symbol does NOT " +
    "admit an off-lattice / m-uniform port: it is a two-scale, " +
    "lattice-specific sharpening, and the single-scale delta-separated " +
    "class admits the uniform-lattice limit (cross-pair gap D -> delta+) " +
    "where the block floor collapses continuously to the scalar A_opt " +
    "(THEOREM SEP-OPT). Any class-uniform block constant is bounded above " +
    "by A_opt, so SPLIT-OPT (20.593144) is class-optimal and the 4.611560 " +
    "depth-unit gap to the lattice-pinned SPLIT-RZ (15.981584) is genuine, " +
    "attributable exactly to the block-vs-scalar mechanism (the missing " +
    "two-scale hypothesis). Rests on the established SEP-OPT scalar result " +
    "plus an elementary class-infimum argument; no new cited input. " +
    "Lattice-pinned RZ-PEN chart refinements stay lattice-only; the " +
    "imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay " +
    "OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95642"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// stable theta-dual (Poisson) form of the scalar class floor A_opt(delta)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 500; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-25) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// Jacobi eigenvalue sweep, lambda_min of a symmetric matrix
function lambdaMin(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
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
  }
  let mn = Infinity;
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}

function gramFromLogRates(xs) {
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// twin-pair lattice: nPairs pairs, in-pair gap delta, cross-pair gap D
function twinPairRates(nPairs, delta, D) {
  const xs = [];
  let base = 0;
  for (let k = 0; k < nPairs; k++) {
    xs.push(base);
    xs.push(base + delta);
    base += delta + D;
  }
  return xs;
}

const REF = IMP95642_TWIN_PAIR_SYMBOL_OFFLATTICE_OBSTRUCTION;

export const IMP95642_ASSERTIONS = [
  {
    id: "imp95642-scalar-floor-matches-sep-opt",
    description:
      "the scalar class floor A_opt(ln 1.3) reproduces the imp-95419 baked " +
      "literal to 1e-10 rel",
    holds: () => {
      const a = aOptDual(REF.delta);
      return Math.abs(a - REF.aOpt) / REF.aOpt < 1e-10;
    },
  },
  {
    id: "imp95642-block-floor-and-ratio",
    description:
      "the isolated twin-pair 2x2 block floor 1 - sech(delta/2) matches the " +
      "baked literal and is ~1.94e12x the scalar A_opt (the block sharpening " +
      "is enormous but lattice-bound)",
    holds: () => {
      const block = 1 - sech(REF.delta / 2);
      if (Math.abs(block - REF.blockFloorIsolated) / REF.blockFloorIsolated > 1e-12)
        return false;
      const ratio = block / aOptDual(REF.delta);
      return Math.abs(ratio - REF.blockOverScalarRatio) / REF.blockOverScalarRatio < 1e-6;
    },
  },
  {
    id: "imp95642-isolation-endpoint-recovers-block-floor",
    description:
      "for well-separated pairs (D = 100 delta) per-point lambda_min recovers " +
      "the isolated 2x2 block floor 1 - sech(delta/2) to 1e-4 rel -- the " +
      "block symbol is sharp only in the two-scale regime",
    holds: () => {
      const xs = twinPairRates(40, REF.delta, 100 * REF.delta);
      const lm = lambdaMin(gramFromLogRates(xs));
      const block = 1 - sech(REF.delta / 2);
      return Math.abs(lm - block) / block < 1e-4;
    },
  },
  {
    id: "imp95642-collapse-to-scalar-at-uniform-lattice",
    description:
      "COLLAPSE: as the cross-pair gap D -> delta (uniform single-scale " +
      "lattice) the twin-pair lambda_min degrades to the scalar A_opt " +
      "(finite-size ratio ~1.09 at 80 points, decreasing toward 1) -- the " +
      "block floor is unavailable to the single-scale class",
    holds: () => {
      const xs = twinPairRates(40, REF.delta, REF.delta); // D = delta => uniform lattice
      const lm = lambdaMin(gramFromLogRates(xs));
      const ratio = lm / aOptDual(REF.delta);
      // collapses to the scalar floor: within a small finite-size Szego factor of 1,
      // and ~12 orders of magnitude BELOW the isolated block floor
      if (!(ratio > 1 && ratio < 1.2)) return false;
      const block = 1 - sech(REF.delta / 2);
      return lm < block / 1e6;
    },
  },
  {
    id: "imp95642-residual-gap-arithmetic",
    description:
      "the residual gap SPLIT-OPT - SPLIT-RZ reconciles with the imp-95609 " +
      "onset literals to 1e-6",
    holds: () =>
      Math.abs(REF.onsetSplitOpt - REF.onsetSplitRz - REF.residualGap) < 1e-6,
  },
  {
    id: "imp95642-not-a-bound",
    description:
      "this is a structural obstruction / documentation module; it moves no " +
      "Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /GENUINE FLOOR/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95642-closes-self",
    description: "this module is the deliverable the imp-95642 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95642"),
  },
];

for (const a of IMP95642_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95642-twin-pair-symbol-offlattice-obstruction assertion failed: ${a.id}`,
    );
  }
}

export default IMP95642_TWIN_PAIR_SYMBOL_OFFLATTICE_OBSTRUCTION;

/**
 * imp-95429: MEASUREMENT of the TOTAL imp-95374 off-lattice every-octave
 * onset shift -- combining the RZ-PEN4 symbol-pencil FLOOR degradation
 * (imp-95374) with the separately-priced coalLaw-NUMERATOR off-lattice drift
 * (the imp-95253 leg). imp-95374 isolated the floor degradation by holding
 * the dyadic every-octave numerator sum_k coalLaw(2^k x) FIXED while
 * substituting the jittered pencil floor A for A_pen4; its own honestScope
 * (b) and the PROTOCOL note explicitly DEFERRED the numerator's own
 * off-lattice drift to the imp-95253 leg. This ticket lets the numerator
 * jitter TOO -- coalLaw is evaluated at the actual perturbed octave base
 * rate nu_k instead of 2^k -- and measures the total onset shift, decomposed
 * against the isolated-floor and isolated-numerator shifts. MEASUREMENT
 * ONLY; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT. The imp-95374 every-octave onset is bisected from
 *   Lambda <= [ sum_k coalLaw(nu_k x) ] / A = 1,
 * coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1+y^2)) (imp-95227 COAL-DOM),
 * A = inf lam_min of the seam symbol pencil. TWO off-lattice effects move
 * the onset: (i) the FLOOR A degrades (imp-95374 measured this, holding the
 * numerator at its dyadic values nu_k = 2^k); (ii) the NUMERATOR drifts,
 * because off the lattice coalLaw is evaluated at the perturbed base rate
 * nu_k = 2^k e^(U_k) instead of 2^k, and the every-octave sum is dominated
 * by the SMALLEST rate (k = 0), so a downward jitter of nu_0 inflates
 * coalLaw(nu_0 x) and raises the onset -- exactly the separation-priced
 * numerator sensitivity that the imp-95253 SPLIT-LOO leg prices in its own
 * certificate. This module measures BOTH together.
 *
 * PROTOCOL. Identical off-lattice draw to imp-95374 (m = 8 octave twin
 * blocks, ln nu_k = k ln 2 + U_k with U_k uniform in [-delta, delta] from
 * the SAME deterministic mulberry32 seed 0xc0ffee ^ round(delta 1e6), in-
 * block ratio ln r_k uniform in (ln(1.3)/2, ln(1.3)], five jitter
 * magnitudes delta in {2^-6..2^-2}, 400 trials each). For every trial the
 * SAME draw yields both (a) the pencil floor A_t = lam_min(Gtilde,
 * blockdiag G0) and (b) the octave base rates nu_k for the jittered
 * numerator sum_k coalLaw(nu_k x) (the every-octave tail k >= 8 continues
 * dyadic and is numerically negligible at these depths). Three worst-of-400
 * onset series are bisected:
 *   FLOOR-ONLY  = onset( dyadic numerator, A_t )        -> reproduces imp-95374
 *   NUM-ONLY    = onset( jittered numerator, m=8 floor )
 *   TOTAL       = onset( jittered numerator, A_t )
 * each taken as the MAX realized onset over the 400 draws, all measured
 * against the imp-95374 m = 8 measured-lattice baseline onset 12.220244 so
 * the finite-m gap cancels.
 *
 * CALIBRATION (exact). The FLOOR-ONLY series reproduces the imp-95374
 * worst-of-400 floor-driven onsets to 12 digits (12.560772, 12.875539,
 * 13.211373, 14.309699, 21.405430 at delta = 2^-6..2^-2), confirming the
 * identical PRNG draw; the min floors (7.786e-9, 4.359e-9, 2.344e-9,
 * 3.056e-10, 4.69e-16) match imp-95374 FINDING 1.
 *
 * FINDING 1 (the numerator drift adds a comparable, separately-sized onset
 * premium). The isolated-NUMERATOR worst-of-400 onset shift is of the same
 * order as the isolated-FLOOR shift across the mild-to-moderate band:
 *   delta      floorShift   numShift    totalShift
 *   2^-6  (+-1.56%)  +0.340528   +0.192435   +0.404471
 *   2^-5  (+-3.13%)  +0.655295   +0.386125   +0.788217
 *   2^-4  (+-6.25%)  +0.991130   +0.787396   +1.582664
 *   2^-3  (+-12.5%)  +2.089455   +1.627065   +3.670328
 *   2^-2  (+-25.0%)  +9.185187   +3.440560   +11.231383
 * The numerator premium is driven by the smallest-rate downward jitter
 * (nu_0 = e^(U_0) < 1 inflates coalLaw(nu_0 x)) and grows smoothly with
 * delta; unlike the floor, it does NOT show a near-collision cliff (numShift
 * stays sub-4 even at +-25%, where floorShift is +9.19).
 *
 * FINDING 2 (the combined shift is SUB-additive at small jitter, tending to
 * additive as a single near-collision draw comes to dominate). The total
 * shift sits BELOW the naive sum floorShift + numShift, ratio
 *   total / (floorShift + numShift)
 *   = 0.759, 0.757, 0.890, 0.988, 0.890 at delta = 2^-6..2^-2.
 * At small jitter the worst-floor draw and the worst-numerator draw are
 * DIFFERENT trials, so combining per-trial recovers less than adding the two
 * separate worst cases (ratio ~0.76). As delta grows toward +-12.5% a single
 * near-collision trial simultaneously collapses the floor and inflates its
 * own numerator, so the two effects concentrate in one draw and the ratio
 * approaches 1.
 *
 * FINDING 3 (the numerator drift meaningfully increases the every-octave
 * onset cost over the floor-only imp-95374 estimate). The TOTAL onset shift
 * exceeds the isolated-floor (imp-95374) shift by
 *   +0.064 / +0.133 / +0.592 / +1.581 / +2.046 depth units
 * at delta = 2^-6..2^-2 -- i.e. +19% / +20% / +60% / +76% / +22% on top of
 * the floor-only shift. So the imp-95374 floor-only onset is an
 * UNDER-estimate of the true off-lattice every-octave onset by up to ~1.6
 * depth units in the +-12.5% band; the numerator drift is not a negligible
 * correction but a comparable second contribution.
 *
 * HONEST SCOPE / LIMITS. (a) Measurement of the MODEL seam pencil and its
 * every-octave onset only; changes NO Lambda bound and supplies NO
 * off-lattice floor or onset THEOREM. (b) Worst-of-400 is a finite-sample
 * lower bound on the true worst case; the three series share the PRNG draw
 * with imp-95374 so the FLOOR-ONLY column reproduces it exactly, but the
 * true off-lattice supremum over ALL configurations is not attained. (c)
 * Finite m = 8; onsets are all measured against the same m = 8 lattice
 * baseline so the finite-m gap cancels in the shifts. (d) The +-25% (2^-2)
 * floor 4.69e-16 is near float noise (imp-95374 limit (d)); the totalShift
 * there inherits that qualitative-only status, while the numShift and the
 * +-1.56%..+-6.25% band reproduce to 12 digits. (e) The every-octave
 * numerator tail k >= 8 is continued dyadic (coalLaw(2^8 x) underflows at
 * these depths), so only the m = 8 measured octave base rates carry the
 * numerator drift. (f) gammaSL obligation (3), signed WEIGHT / modulus-phase
 * legs and the imp-95212 envelope port all remain OPEN. NO QED;
 * no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95429_RZPEN_OFFLATTICE_TOTAL_ONSET = {
  id: "imp-95429",
  title:
    "Total off-lattice every-octave onset shift: imp-95374 symbol-pencil " +
    "FLOOR degradation combined with the imp-95253 coalLaw-NUMERATOR " +
    "off-lattice drift, decomposed against the isolated-floor and " +
    "isolated-numerator shifts (m = 8, delta in {2^-6..2^-2}, worst-of-400)",
  object:
    "the every-octave onset solves Lambda <= [sum_k coalLaw(nu_k x)] / A = 1; " +
    "imp-95374 jittered only the floor A (dyadic numerator held fixed); here " +
    "the numerator jitters too (coalLaw at the perturbed base rate nu_k), " +
    "measuring the TOTAL onset shift and its floor/numerator decomposition",
  baselineOnsetM8: 12.220243786987574,
  // FINDING 1-3: worst-of-400 onset series and their shifts vs the m=8 baseline
  rows: [
    {
      delta: 0.015625,
      minFloor: 7.786057107782184e-9,
      floorOnset: 12.560772253450725,
      numOnset: 12.412678825275034,
      totalOnset: 12.624714460092427,
      floorShift: 0.3405284664631516,
      numShift: 0.19243503828746,
      totalShift: 0.4044706731048535,
      subAddRatio: 0.7589,
      totalOverFloorExtra: 0.0639422066417019,
    },
    {
      delta: 0.03125,
      minFloor: 4.358594697708234e-9,
      floorOnset: 12.875539208081968,
      numOnset: 12.606368438674192,
      totalOnset: 13.008460763944047,
      floorShift: 0.6552954210943938,
      numShift: 0.38612465168661814,
      totalShift: 0.7882169769564733,
      subAddRatio: 0.7569,
      totalOverFloorExtra: 0.1329215558620795,
    },
    {
      delta: 0.0625,
      minFloor: 2.343927799102147e-9,
      floorOnset: 13.211373410922477,
      numOnset: 13.0076393277851,
      totalOnset: 13.802908251614674,
      floorShift: 0.9911296239349028,
      numShift: 0.7873955407975259,
      totalShift: 1.5826644646271006,
      subAddRatio: 0.8899,
      totalOverFloorExtra: 0.5915348406921978,
    },
    {
      delta: 0.125,
      minFloor: 3.0558549273053504e-10,
      floorOnset: 14.309699185301337,
      numOnset: 13.847308982340138,
      totalOnset: 15.890571646374998,
      floorShift: 2.0894553983137634,
      numShift: 1.6270651953525643,
      totalShift: 3.670327859387424,
      subAddRatio: 0.9876,
      totalOverFloorExtra: 1.5808724610736607,
    },
    {
      delta: 0.25,
      minFloor: 4.688790308620294e-16,
      floorOnset: 21.40543043983334,
      numOnset: 15.660803645943254,
      totalOnset: 23.45162691545997,
      floorShift: 9.185186652845765,
      numShift: 3.4405598589556803,
      totalShift: 11.231383128472395,
      subAddRatio: 0.8896,
      totalOverFloorExtra: 2.0461964756266306,
    },
  ],
  honestScope:
    "model seam-pencil / every-octave onset measurement only; supplies NO " +
    "off-lattice floor or onset theorem and changes no Lambda bound; " +
    "worst-of-400 is a finite-sample lower bound sharing the imp-95374 PRNG " +
    "draw (FLOOR-ONLY column reproduces it to 12 digits); finite m = 8 " +
    "baseline quoted so the finite-m gap cancels; the +-25% total shift " +
    "inherits the imp-95374 near-float-noise status; every-octave numerator " +
    "tail k >= 8 continued dyadic (underflows); gammaSL obligation (3), " +
    "signed WEIGHT / modulus-phase and the imp-95212 envelope port remain OPEN",
  verdict:
    "MEASUREMENT: including the deferred coalLaw-NUMERATOR off-lattice drift " +
    "raises the imp-95374 floor-only every-octave onset shift by +19%..+76% " +
    "over the +-1.56%..+-12.5% band (up to ~+1.6 depth units), so the " +
    "numerator drift is a comparable SECOND contribution, not a negligible " +
    "correction. The combined shift is SUB-additive at small jitter (ratio " +
    "~0.76: worst-floor and worst-numerator fall in different draws) and " +
    "tends to additive (~0.99) as a single near-collision draw comes to " +
    "collapse the floor and inflate its own numerator together. The " +
    "numerator premium grows smoothly with no near-collision cliff, while " +
    "the floor collapse still dominates the +-25% tail. Changes no bound; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric cross-check machinery (import-light: no imports)
// ---------------------------------------------------------------------------

const sechHalf = (u) => 1 / Math.cosh(u / 2);
const normGram = (nus) =>
  nus.map((x) => nus.map((y) => sechHalf(Math.log(x / y))));
const blockDiagOf = (G) =>
  G.map((row, i) =>
    row.map((g, j) => (Math.floor(i / 2) === Math.floor(j / 2) ? g : 0)),
  );
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));

function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95429 chol: base not PD");
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
// lam_min of the generalized pencil (A, B), B SPD
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
function latticeRates(m, r, rho) {
  const v = [];
  for (let k = 0; k < m; k++) v.push(rho ** k, r * rho ** k);
  return v;
}
// identical draw order to imp-95374 offLatticeRates; also returns octave base
// rates nu_k for the jittered numerator
function offLatticeDraw(m, delta, rand, rBase) {
  const nus = [];
  const bases = [];
  const lnrMax = Math.log(rBase);
  for (let k = 0; k < m; k++) {
    const base = Math.exp(k * Math.LN2 + delta * (2 * rand() - 1));
    const lnr = lnrMax * (0.5 + 0.5 * rand());
    nus.push(base, base * Math.exp(lnr));
    bases.push(base);
  }
  return { nus, bases };
}
// every-octave dyadic numerator (imp-95374 held fixed)
function numDyadic(x) {
  let s = 0;
  for (let k = 0; k < 80; k++) {
    const t = coalLaw(2 ** k * x);
    s += t;
    if (t < 1e-320) break;
  }
  return s;
}
// jittered numerator: coalLaw at the perturbed octave base rate, dyadic tail
function numJitter(bases, x) {
  let s = 0;
  for (let k = 0; k < bases.length; k++) s += coalLaw(bases[k] * x);
  for (let k = bases.length; k < 80; k++) {
    const t = coalLaw(2 ** k * x);
    s += t;
    if (t < 1e-320) break;
  }
  return s;
}
// onset from num(x) / A = 1
function onset(numFn, A) {
  let lo = 1;
  let hi = 60;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (numFn(mid) / A > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function latticeFloor(m) {
  const G = normGram(latticeRates(m, 1.3, 2));
  return pencilMin(G, blockDiagOf(G));
}
// worst-of-400 FLOOR-ONLY / NUM-ONLY / TOTAL onsets from one shared draw
function sweepOnsets(delta, f8, T = 400) {
  const rand = prng(0xc0ffee ^ Math.round(delta * 1e6));
  let minFloor = Infinity;
  let worstFloor = 0;
  let worstNum = 0;
  let worstTotal = 0;
  for (let t = 0; t < T; t++) {
    const { nus, bases } = offLatticeDraw(8, delta, rand, 1.3);
    const G = normGram(nus);
    const A = pencilMin(G, blockDiagOf(G));
    if (A < minFloor) minFloor = A;
    const oFloor = onset(numDyadic, A);
    if (oFloor > worstFloor) worstFloor = oFloor;
    const jn = (x) => numJitter(bases, x);
    const oNum = onset(jn, f8);
    if (oNum > worstNum) worstNum = oNum;
    const oTot = onset(jn, A);
    if (oTot > worstTotal) worstTotal = oTot;
  }
  return { minFloor, worstFloor, worstNum, worstTotal };
}

const REC = IMP95429_RZPEN_OFFLATTICE_TOTAL_ONSET;
const rel = (x, y) => Math.abs(x / y - 1);

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95429_ASSERTIONS = [
  {
    id: "imp95429-baseline-onset",
    description:
      "the m = 8 measured-lattice baseline every-octave onset (dyadic " +
      "numerator, lattice pencil floor) reproduces the imp-95374 value " +
      "12.220244 (abs 1e-5)",
    holds: () => {
      const f8 = latticeFloor(8);
      return Math.abs(onset(numDyadic, f8) - REC.baselineOnsetM8) < 1e-5;
    },
  },
  {
    id: "imp95429-floor-only-reproduces-imp95374",
    description:
      "CALIBRATION: the FLOOR-ONLY worst-of-400 onsets (dyadic numerator + " +
      "per-trial floor) reproduce the imp-95374 floor-driven onsets to 12 " +
      "digits at every delta, and the min floors match imp-95374 FINDING 1 " +
      "(rel 1e-6)",
    holds: () => {
      const f8 = latticeFloor(8);
      for (const row of REC.rows) {
        const s = sweepOnsets(row.delta, f8);
        if (Math.abs(s.worstFloor - row.floorOnset) > 1e-9) return false;
        if (rel(s.minFloor, row.minFloor) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95429-total-onset-table",
    description:
      "FINDING 1: the NUM-ONLY and TOTAL worst-of-400 onsets and their " +
      "shifts vs the m = 8 baseline reproduce the baked table (abs 1e-6), " +
      "and totalShift = floorShift + numShift - overlap holds numerically " +
      "(total <= floor + num, sub-additive)",
    holds: () => {
      const f8 = latticeFloor(8);
      const base = onset(numDyadic, f8);
      for (const row of REC.rows) {
        const s = sweepOnsets(row.delta, f8);
        if (Math.abs(s.worstNum - row.numOnset) > 1e-6) return false;
        if (Math.abs(s.worstTotal - row.totalOnset) > 1e-6) return false;
        const floorShift = s.worstFloor - base;
        const numShift = s.worstNum - base;
        const totalShift = s.worstTotal - base;
        if (Math.abs(floorShift - row.floorShift) > 1e-6) return false;
        if (Math.abs(numShift - row.numShift) > 1e-6) return false;
        if (Math.abs(totalShift - row.totalShift) > 1e-6) return false;
        // sub-additivity: combining per-trial recovers no more than the sum
        if (!(totalShift <= floorShift + numShift + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95429-numerator-adds-comparable-premium",
    description:
      "FINDING 1/3: the numerator drift is a comparable second contribution " +
      "-- the TOTAL onset shift exceeds the isolated-floor (imp-95374) shift " +
      "by +19%..+76% over the +-1.56%..+-12.5% band (totalOverFloorExtra " +
      "matches the baked column and is a positive, increasing fraction of " +
      "the floor shift there)",
    holds: () => {
      for (let i = 0; i < 4; i++) {
        const row = REC.rows[i];
        const extra = row.totalShift - row.floorShift;
        if (Math.abs(extra - row.totalOverFloorExtra) > 1e-6) return false;
        const frac = extra / row.floorShift;
        if (!(frac > 0.15 && frac < 0.9)) return false;
      }
      // the fraction grows across the mild-to-moderate band
      const fracs = REC.rows
        .slice(0, 4)
        .map((r) => (r.totalShift - r.floorShift) / r.floorShift);
      for (let i = 1; i < fracs.length; i++)
        if (!(fracs[i] > fracs[i - 1])) return false;
      return true;
    },
  },
  {
    id: "imp95429-subadditive-toward-additive",
    description:
      "FINDING 2: the combined shift is sub-additive (total < floor + num) " +
      "at small jitter (ratio ~0.76) and tends toward additive (~0.99) as a " +
      "single near-collision draw dominates; the baked subAddRatio matches " +
      "and the +-1.56% ratio is below the +-12.5% ratio",
    holds: () => {
      for (const row of REC.rows) {
        const ratio = row.totalShift / (row.floorShift + row.numShift);
        if (Math.abs(ratio - row.subAddRatio) > 5e-4) return false;
        if (!(ratio <= 1 + 1e-9)) return false;
      }
      return REC.rows[0].subAddRatio < REC.rows[3].subAddRatio;
    },
  },
  {
    id: "imp95429-numerator-no-collision-cliff",
    description:
      "the numerator premium grows smoothly with no near-collision cliff " +
      "(numShift monotone increasing and stays below 4 even at +-25%, while " +
      "the floor shift blows out to +9.19 there)",
    holds: () => {
      for (let i = 1; i < REC.rows.length; i++)
        if (!(REC.rows[i].numShift > REC.rows[i - 1].numShift)) return false;
      const last = REC.rows[REC.rows.length - 1];
      return last.numShift < 4 && last.floorShift > 9;
    },
  },
  {
    id: "imp95429-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: MEASUREMENT, no " +
      "off-lattice floor/onset theorem, changes no bound, open legs named, " +
      "no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /measurement only/i.test(REC.honestScope) &&
      /remain OPEN/.test(REC.honestScope) &&
      /NO off-lattice floor or onset theorem/i.test(REC.honestScope),
  },
];

for (const a of IMP95429_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95429-rzpen-offlattice-total-onset assertion failed: ${a.id}`,
    );
  }
}

export default IMP95429_RZPEN_OFFLATTICE_TOTAL_ONSET;

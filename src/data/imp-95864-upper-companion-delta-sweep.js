/**
 * imp-95864 -- UPPER-COMPANION DELTA SWEEP: reproduce the imp-95846 baked
 * lambda_max(G_n) / ess-sup f ratios and extend the check across the imp-95693
 * rho-sweep regime (ln 1.2 .. ln 2).
 *
 * GRADE: numerical verification note. Import-light (no heavy bundle, no
 * imports). Changes NO bound; NO QED.
 *
 * WHAT imp-95846 LEFT UNTESTED. imp-95846 verified the finite-section upper
 * companion lambda_max(G_n) <= ess-sup f = f(0) for the positive sech Toeplitz
 * Gram at only FOUR deltas (3, 5, 8, and ln 1.3), baking its ratio table from
 * tmp/imp-95846-scratch.mjs. It reported the ratio lambda_max / ess-sup f rises
 * to 1 from below (e.g. 0.80496 -> 0.92727 -> 0.97753 at ln 1.3) but never
 * swept the seam-relevant rho regime the twin-pair block floor (imp-95693) uses.
 * This module (i) independently reproduces the imp-95846 ln 1.3 literals from
 * the same construction, and (ii) extends the sweep to seven rho values across
 * the imp-95693 rho-sweep band ln 1.2 .. ln 2, testing whether the upper
 * companion approaches ess-sup f = f(0) from below UNIFORMLY in delta.
 *
 * THE CONSTRUCTION (identical to imp-95846). At rho = 1 the seam Gram is the
 * real symmetric Toeplitz matrix G_n[j,k] = sech((j - k) delta / 2), a finite
 * section of the positive sech Toeplitz operator with generating symbol
 *     f(theta) = 1 + 2 sum_{m>=1} sech(m delta / 2) cos(m theta) > 0.
 * The Rayleigh-quotient bound v* G_n v = (1/2pi) integral |p|^2 f <= ess-sup f
 * gives lambda_max(G_n) <= ess-sup f for every section size n, and the supremum
 * sits at the cancellation-free forward peak ess-sup f = f(0) = sum_m sech(m
 * delta/2). lambda_max increases in n and converges UP to f(0), so the ratio can
 * only ever approach 1 from below.
 *
 * WHAT THE SWEEP FINDS (baked from tmp/imp-95864-scratch.mjs). Across rho =
 * 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0 (delta = ln rho), at section sizes
 * n = 40, 80, 160:
 *   (i)   EVERY ratio lambda_max(G_n) / ess-sup f is strictly below 1;
 *   (ii)  the ratio INCREASES monotonically in n at every rho (approaches the
 *         supremum only from below -- the mirror of the imp-95825 lower
 *         companion, which decreases to 1 from above);
 *   (iii) the ln 1.3 row (delta = 0.262364) reproduces the imp-95846 baked
 *         literals 0.80495863 -> 0.92726779 -> 0.97753070 to machine precision;
 *   (iv)  the approach is delta-UNIFORM in the qualitative sense: at every rho
 *         the pattern is the same monotone rise to 1 from below, with the
 *         n = 160 ratio tightening from 0.9576 (rho = 1.2) up to 0.9963
 *         (rho = 2.0) -- larger delta => faster convergence, but the shape is
 *         invariant across the whole band.
 * ess-sup f = f(0) is O(1)..O(35) across the band (34.46 at rho = 1.2 down to
 * 9.06 at rho = 2.0), all far from the float64 cancellation floor, so every row
 * is a clean sub-1 readout.
 *
 * HONEST SCOPE. (a) Cross-reproduces the imp-95846 baked ln 1.3 ratios and
 * widens the delta coverage from four points to a seven-point rho sweep; no new
 * cited input and no new bound. (b) "Delta-uniform" here means the qualitative
 * monotone-rise-to-1-from-below pattern is invariant across the swept band; the
 * n = 160 ratio still varies smoothly with delta (0.9576 .. 0.9963) and this
 * sweep does not establish a delta-independent convergence RATE. (c) Model seam
 * family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase
 * legs stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95846-finite-section-upper-companion-bound (the four-delta table this reproduces + extends)
 * @see imp-95825-finite-section-positivity-certificate (the lower companion)
 * @see imp-95693-twin-pair-block-floor-second-delta (the rho-sweep regime this band tracks)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95864_UPPER_COMPANION_DELTA_SWEEP = {
  id: "imp-95864",
  title:
    "UPPER-COMPANION DELTA SWEEP: reproduce the imp-95846 lambda_max(G_n)/ess-sup f " +
    "ratios and extend to a seven-point rho sweep across the imp-95693 band " +
    "(ln 1.2 .. ln 2) -- the ratio rises to 1 from below uniformly across delta",
  question:
    "does the upper companion lambda_max(G_n) <= ess-sup f = f(0) approach the " +
    "supremum monotonically from below across the whole imp-95693 rho-sweep band " +
    "ln 1.2 .. ln 2, not just at the four deltas imp-95846 checked?",
  sectionSizes: [40, 80, 160],
  // Reproduced imp-95846 baked literals at delta = ln 1.3 (cross-check anchor).
  reproducedLn13: {
    delta: 0.26236426446749106,
    essSup: 2.394833e1,
    ratios: [0.80495863, 0.92726779, 0.97753070], // n = 40, 80, 160
  },
  // Extended sweep: rho = 1.2 .. 2.0, delta = ln rho. Each row: the supremum
  // ess-sup f = f(0), and the ratio lambda_max(G_n)/ess-sup f at n = 40,80,160
  // (all < 1, monotone increasing). Baked from tmp/imp-95864-scratch.mjs.
  sweep: [
    { rho: 1.2, delta: 0.1823215568, essSup: 3.446211e1, ratios: [0.70461501, 0.87426812, 0.95760700] },
    { rho: 1.3, delta: 0.2623642645, essSup: 2.394833e1, ratios: [0.80495863, 0.92726779, 0.97753070] },
    { rho: 1.4, delta: 0.3364722366, essSup: 1.867371e1, ratios: [0.85935927, 0.95148174, 0.98568838] },
    { rho: 1.5, delta: 0.4054651081, essSup: 1.549624e1, ratios: [0.89222512, 0.96465789, 0.98986639] },
    { rho: 1.6, delta: 0.4700036292, essSup: 1.336838e1, ratios: [0.91371105, 0.97268919, 0.99231731] },
    { rho: 1.8, delta: 0.5877866649, essSup: 1.068957e1, ratios: [0.93943252, 0.98169380, 0.99497272] },
    { rho: 2.0, delta: 0.6931471806, essSup: 9.064720e0, ratios: [0.95388938, 0.98645601, 0.99633416] },
  ],
  ratioUpperBound: 1, // lambda_max / ess-sup f < 1 for all rows (exact, delta-uniform)
  approachFromBelow: true, // ratio increases in n at every rho, converges up to 1
  qualitativelyDeltaUniform: true, // same monotone-rise-from-below shape at every rho...
  rateDeltaUniform: false, // ...but the n=160 ratio still varies smoothly (0.9576 .. 0.9963)
  boundChange: false,
  qed: false,
  verdict:
    "VERIFIED. Independently reproduced the imp-95846 baked upper-companion " +
    "ratios at delta = ln 1.3 (0.80495863 -> 0.92726779 -> 0.97753070 at " +
    "n = 40,80,160) and extended the check to a seven-point rho sweep across the " +
    "imp-95693 band rho = 1.2 .. 2.0 (delta = ln rho). At EVERY rho the ratio " +
    "lambda_max(G_n) / ess-sup f = f(0) stays strictly below 1 and increases " +
    "monotonically in the section size, approaching the supremum only from below " +
    "-- the exact mirror of the imp-95825 lower companion. The pattern is " +
    "qualitatively delta-uniform across the whole band: the n = 160 ratio " +
    "tightens smoothly from 0.9576 (rho = 1.2) to 0.9963 (rho = 2.0), with " +
    "larger delta converging faster but the monotone-rise-from-below shape " +
    "invariant. ess-sup f = f(0) is O(1)..O(35) across the band, all far from " +
    "the cancellation floor, so every readout is clean. This widens the " +
    "imp-95846 four-delta table to a seven-point sweep and cross-reproduces its " +
    "ln 1.3 anchor; no new cited input, no new bound. Qualitative uniformity " +
    "only -- no delta-independent convergence rate is claimed. Model seam family " +
    "only; imp-95212 envelope port, signed WEIGHT, modulus/phase legs stay OPEN. " +
    "Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95864"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// forward symbol f(theta) = 1 + 2 sum_{m>=1} sech(m delta/2) cos(m theta)
function symbol(theta, delta) {
  let s = 1;
  for (let m = 1; m <= 20000; m++) {
    const t = sech((m * delta) / 2);
    s += 2 * t * Math.cos(m * theta);
    if (t < 1e-40) break;
  }
  return s;
}

// Jacobi eigenvalue sweep, returns [lambda_min, lambda_max]
function eigMinMax(A0) {
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
  let mx = -Infinity;
  for (let i = 0; i < n; i++) {
    mn = Math.min(mn, A[i][i]);
    mx = Math.max(mx, A[i][i]);
  }
  return [mn, mx];
}

// uniform single-scale lattice (rho = 1 => cross gap = in-pair gap = delta)
function uniformGram(nPts, delta) {
  const xs = [];
  for (let k = 0; k < nPts; k++) xs.push(k * delta);
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

const REF = IMP95864_UPPER_COMPANION_DELTA_SWEEP;
const SECTION_SIZES = REF.sectionSizes;

export const IMP95864_ASSERTIONS = [
  {
    id: "imp95864-reproduces-imp95846-ln13-row",
    description:
      "the baked imp-95846 ln 1.3 ratios (0.80495863 -> 0.92726779 -> 0.97753070) " +
      "are reproduced by a fresh computation to tight relative tolerance",
    holds: () => {
      const { delta, essSup, ratios } = REF.reproducedLn13;
      const f0 = symbol(0, delta);
      if (Math.abs(f0 - essSup) / essSup > 1e-6) return false;
      return SECTION_SIZES.every((nPts, i) => {
        const [, lmax] = eigMinMax(uniformGram(nPts, delta));
        return Math.abs(lmax / f0 - ratios[i]) / ratios[i] < 1e-5;
      });
    },
  },
  {
    id: "imp95864-sweep-rows-reproduced",
    description:
      "each baked sweep row (ess-sup f = f(0) and the three section ratios) is " +
      "reproduced by a fresh computation at the corresponding delta = ln rho",
    holds: () =>
      REF.sweep.every((row) => {
        const f0 = symbol(0, row.delta);
        if (Math.abs(f0 - row.essSup) / row.essSup > 1e-6) return false;
        return SECTION_SIZES.every((nPts, i) => {
          const [, lmax] = eigMinMax(uniformGram(nPts, row.delta));
          return Math.abs(lmax / f0 - row.ratios[i]) / row.ratios[i] < 1e-5;
        });
      }),
  },
  {
    id: "imp95864-every-ratio-below-one",
    description:
      "at every rho in the sweep and every section size the ratio " +
      "lambda_max(G_n) / ess-sup f is strictly below 1 (upper companion holds)",
    holds: () =>
      REF.ratioUpperBound === 1 &&
      REF.sweep.every((row) => row.ratios.every((r) => r <= 1 + 1e-12)),
  },
  {
    id: "imp95864-ratio-rises-from-below-uniformly",
    description:
      "at every rho the baked ratios increase monotonically in the section size " +
      "(approach the supremum from below at every delta in the band)",
    holds: () =>
      REF.approachFromBelow === true &&
      REF.sweep.every((row) => {
        let prev = -Infinity;
        for (const r of row.ratios) {
          if (!(r > prev)) return false;
          prev = r;
        }
        return true;
      }),
  },
  {
    id: "imp95864-supremum-is-forward-peak-across-band",
    description:
      "at every rho the baked ess-sup f equals the cancellation-free all-in-phase " +
      "sum 1 + 2 sum_{m>=1} sech(m delta/2) to machine precision",
    holds: () =>
      REF.sweep.every((row) => {
        let s = 1;
        for (let m = 1; m <= 40000; m++) {
          const t = sech((m * row.delta) / 2);
          s += 2 * t;
          if (t < 1e-40) break;
        }
        return Math.abs(s - row.essSup) / row.essSup < 1e-6;
      }),
  },
  {
    id: "imp95864-band-covers-ln12-to-ln2",
    description:
      "the swept deltas span the imp-95693 rho-sweep band ln 1.2 .. ln 2, wider " +
      "than the four deltas imp-95846 checked",
    holds: () => {
      const deltas = REF.sweep.map((r) => r.delta);
      const lo = Math.min(...deltas);
      const hi = Math.max(...deltas);
      return (
        Math.abs(lo - Math.log(1.2)) < 1e-6 &&
        Math.abs(hi - Math.log(2.0)) < 1e-6 &&
        REF.sweep.length >= 7
      );
    },
  },
  {
    id: "imp95864-rate-uniformity-not-overclaimed",
    description:
      "the module flags qualitative delta-uniformity but does NOT claim a " +
      "delta-independent convergence rate (the n=160 ratio varies across the band)",
    holds: () => {
      if (REF.qualitativelyDeltaUniform !== true) return false;
      if (REF.rateDeltaUniform !== false) return false;
      const last = REF.sweep.map((r) => r.ratios[r.ratios.length - 1]);
      const spread = Math.max(...last) - Math.min(...last);
      return spread > 0.01; // n=160 ratio genuinely varies with delta
    },
  },
  {
    id: "imp95864-not-a-bound",
    description:
      "this is a numerical verification / documentation module; it moves no " +
      "Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /VERIFIED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95864-closes-self",
    description: "this module is the deliverable the imp-95864 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95864"),
  },
];

for (const a of IMP95864_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95864-upper-companion-delta-sweep assertion failed: ${a.id}`,
    );
  }
}

export default IMP95864_UPPER_COMPANION_DELTA_SWEEP;

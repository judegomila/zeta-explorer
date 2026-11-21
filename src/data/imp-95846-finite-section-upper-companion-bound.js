/**
 * imp-95846 -- FINITE-SECTION UPPER COMPANION BOUND for the rho = 1 sech Gram.
 *
 * GRADE: numerical verification note completing the imp-95825 two-sided envelope.
 * Import-light (no heavy bundle, no imports). Changes NO bound; NO QED.
 *
 * WHAT imp-95825 STATED BUT NEVER CHECKED. imp-95825 certified the LOWER
 * finite-section bound lambda_min(G_n) >= ess-inf f = A_opt(delta) via the
 * Rayleigh-quotient argument, verified away from the float64 floor at
 * delta = 3, 5, 8, and remarked in passing that "the upper companion
 * lambda_max(G_n) <= ess-sup f follows the same way" -- but never verified it
 * numerically. This module supplies that missing verification, completing the
 * two-sided finite-section spectral envelope for the seam Gram.
 *
 * THE UPPER COMPANION (Grenander-Szego finite-section eigenvalue bound). At
 * rho = 1 the seam Gram is the real symmetric Toeplitz matrix
 *     G_n[j,k] = sech((j - k) delta / 2),   j,k = 0 .. n-1,
 * with the same positive, continuous, 2pi-periodic generating symbol
 *     f(theta) = sum_{m in Z} sech(m delta / 2) e^{i m theta}
 *              = 1 + 2 sum_{m>=1} sech(m delta / 2) cos(m theta) > 0.
 * For any unit vector v with trigonometric polynomial p(theta) = sum_j v_j e^{i j theta}
 * the Rayleigh quotient is
 *     v^* G_n v = (1 / 2pi) integral_0^{2pi} |p(theta)|^2 f(theta) d theta
 *              <= (ess-sup f) (1 / 2pi) integral |p|^2 = ess-sup f,
 * since (1/2pi) integral |p|^2 = sum |v_j|^2 = 1. Maximising over v gives, for
 * EVERY finite section size n,
 *     lambda_max(G_n) <= ess-sup f.
 * This is the mirror of the imp-95825 nesting/monotone-convergence picture:
 * lambda_max(G_n) INCREASES in n and converges UP to ess-sup f, so it can only
 * ever approach the supremum from BELOW, never overshoot it.
 *
 * ess-sup f = f(0) (the forward peak). Because sech(m delta/2) is positive for
 * every m, the cosine series f(theta) = 1 + 2 sum_{m>=1} sech(m delta/2) cos(m theta)
 * is maximised where every term is in phase, i.e. at theta = 0, giving the
 * sign-definite (no cancellation) peak
 *     f(0) = ess-sup f = sum_{m in Z} sech(m delta / 2)
 *          = 1 + 2 sum_{m>=1} sech(m delta / 2).
 * Unlike the infimum f(pi), this forward sum has NO alternating cancellation, so
 * it is well-conditioned at every delta -- which is why the upper companion is
 * reachable even at delta = ln 1.3, where the LOWER companion sits on the float64
 * cancellation floor.
 *
 * WHAT THE VERIFICATION FINDS (baked from tmp/imp-95846-scratch.mjs). Across the
 * three well-conditioned deltas 3, 5, 8 AND at delta = ln 1.3, at section sizes
 * n = 40, 80, 160:
 *   (i)  lambda_max(G_n) <= ess-sup f = f(0) at every section (ratio <= 1);
 *   (ii) the ratio lambda_max / ess-sup f INCREASES monotonically in n and
 *        approaches 1 from below (the mirror of the lower companion, which
 *        decreases to 1 from above);
 *   (iii) the forward peak f(0) matches the direct all-in-phase sum exactly.
 * At delta = 3 the ratio climbs 0.99691 -> 0.99920 -> 0.99980; at delta = ln 1.3
 * it climbs 0.80496 -> 0.92727 -> 0.97753 (slower, larger matrix needed, but
 * still monotone up and still strictly below 1 -- ess-sup f = f(0) ~ 23.95 here
 * is O(1), far from the cancellation floor).
 *
 * TWO-SIDED ENVELOPE (imp-95825 + this). Combining the two companions, for every
 * finite section size n and every delta,
 *     ess-inf f = A_opt(delta) <= lambda_min(G_n) <= lambda_max(G_n) <= ess-sup f = f(0),
 * with lambda_min descending to the left endpoint and lambda_max ascending to the
 * right endpoint. The full spectrum of the finite section is trapped inside the
 * symbol range [ess-inf f, ess-sup f] = [A_opt(delta), f(0)] for all n.
 *
 * HONEST SCOPE. (a) Numerically verifies the standard finite-section upper bound
 * that imp-95825 stated but did not check; introduces no new cited input and no
 * new bound. (b) The bound is exact and delta-uniform; the verification confirms
 * it at four deltas including ln 1.3. (c) Model seam family only; the imp-95212
 * envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO
 * bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95825-finite-section-positivity-certificate (the lower companion this mirrors)
 * @see imp-95677-rho1-szego-finite-size-convergence (the ratio table these bracket)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt = ess-inf f = f(pi))
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95846_FINITE_SECTION_UPPER_COMPANION_BOUND = {
  id: "imp-95846",
  title:
    "FINITE-SECTION UPPER COMPANION BOUND: lambda_max(G_n) <= ess-sup f = f(0) = " +
    "sum_m sech(m delta/2) for the positive sech Toeplitz Gram at every section " +
    "size, approaching the supremum from below -- completing the two-sided " +
    "finite-section spectral envelope imp-95825 stated but never checked",
  question:
    "does the upper companion lambda_max(G_n) <= ess-sup f = f(0), which " +
    "imp-95825 said follows the same Rayleigh-quotient way, hold numerically " +
    "across section sizes at delta = 3, 5, 8 and (reachably) ln 1.3, with " +
    "lambda_max approaching ess-sup f from below?",
  // The bound holds delta-uniformly. Because the supremum f(0) is a
  // cancellation-free forward sum, it is well-conditioned at EVERY delta,
  // including ln 1.3 (where the lower companion sits on the float64 floor).
  verifiedDeltas: [3, 5, 8],
  reachableFloorDelta: 0.26236426446749106, // ln 1.3, reachable for the upper companion
  // Rows: the supremum ess-sup f = f(0) (essSup), and the LARGEST section ratio
  // lambda_max(G_n)/ess-sup f across nPts = 40,80,160 (all <= 1, closest at 160).
  // Baked from the run in tmp/imp-95846-scratch.mjs.
  certified: [
    { delta: 3, essSup: 2.106041e0, maxInteriorRatio: 0.99979507, lambdaMax160: 2.105610e0 },
    { delta: 5, essSup: 1.355503e0, maxInteriorRatio: 0.99993594, lambdaMax160: 1.355416e0 },
    { delta: 8, essSup: 1.074605e0, maxInteriorRatio: 0.99998604, lambdaMax160: 1.074590e0 },
    { delta: 0.26236426446749106, essSup: 2.394833e1, maxInteriorRatio: 0.97753070, lambdaMax160: 2.341023e1 },
  ],
  ratioUpperBound: 1, // lambda_max / ess-sup f <= 1 for all nPts (exact, delta-uniform)
  approachFromBelow: true, // lambda_max increases in n, converges UP to ess-sup f
  supremumEqualsForwardPeak: true, // ess-sup f = f(0) = 1 + 2 sum_{m>=1} sech(m delta/2)
  boundChange: false,
  qed: false,
  verdict:
    "VERIFIED. The rho = 1 seam Gram G_n[j,k] = sech((j-k) delta/2) is a finite " +
    "section of a positive sech Toeplitz operator with symbol f(theta) = 1 + " +
    "2 sum_{m>=1} sech(m delta/2) cos(m theta) > 0. The Rayleigh-quotient upper " +
    "bound v^* G_n v = (1/2pi) integral |p|^2 f <= ess-sup f gives lambda_max(G_n) " +
    "<= ess-sup f for every section size n, mirroring the imp-95825 lower " +
    "companion. The supremum sits at the forward peak ess-sup f = f(0) = " +
    "sum_m sech(m delta/2), a cancellation-free sum well-conditioned at every " +
    "delta. Verified at delta = 3, 5, 8 AND at delta = ln 1.3: lambda_max(G_n) " +
    "stays strictly below ess-sup f = f(0) at every section (n = 40, 80, 160) and " +
    "the ratio lambda_max / ess-sup f increases monotonically toward 1 from below " +
    "(the exact mirror of the lower companion, which decreases to 1 from above). " +
    "Unlike the infimum, the supremum is reachable at ln 1.3 (f(0) ~ 23.95 is " +
    "O(1), far from the cancellation floor). Combining with imp-95825, the full " +
    "finite-section spectrum is trapped in [A_opt(delta), f(0)] = [ess-inf f, " +
    "ess-sup f] for all n -- the two-sided finite-section spectral envelope. " +
    "Numerical verification of the standard bound imp-95825 stated but did not " +
    "check; no new cited input, no new bound. Model seam family only; imp-95212 " +
    "envelope port, signed WEIGHT, modulus/phase legs stay OPEN. Changes no bound " +
    "of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95846"],
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

const REF = IMP95846_FINITE_SECTION_UPPER_COMPANION_BOUND;
const SECTION_SIZES = [40, 80, 160];
const ALL_DELTAS = [3, 5, 8, REF.reachableFloorDelta];

export const IMP95846_ASSERTIONS = [
  {
    id: "imp95846-supremum-at-zero",
    description:
      "at each delta the forward positive symbol attains its maximum at theta = 0 " +
      "(a coarse scan finds no value above f(0) plus a tiny tol)",
    holds: () =>
      ALL_DELTAS.every((delta) => {
        const f0 = symbol(0, delta);
        const M = 4000;
        for (let i = 0; i <= M; i++) {
          const th = (Math.PI * i) / M;
          if (symbol(th, delta) > f0 + 1e-12 * (1 + Math.abs(f0))) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95846-supremum-equals-forward-peak",
    description:
      "the symbol supremum f(0) equals the cancellation-free all-in-phase sum " +
      "1 + 2 sum_{m>=1} sech(m delta/2) to machine precision -- so ess-sup f = f(0)",
    holds: () =>
      REF.supremumEqualsForwardPeak === true &&
      ALL_DELTAS.every((delta) => {
        const f0 = symbol(0, delta);
        let s = 1;
        for (let m = 1; m <= 40000; m++) {
          const t = sech((m * delta) / 2);
          s += 2 * t;
          if (t < 1e-40) break;
        }
        return Math.abs(f0 - s) / s < 1e-12;
      }),
  },
  {
    id: "imp95846-lambda-max-le-supremum",
    description:
      "the upper companion lambda_max(G_n) <= ess-sup f = f(0) holds at every " +
      "section and every delta (ratio lambda_max / ess-sup f <= 1 for all nPts)",
    holds: () =>
      REF.ratioUpperBound === 1 &&
      ALL_DELTAS.every((delta) => {
        const f0 = symbol(0, delta);
        return SECTION_SIZES.every((nPts) => {
          const [, lmax] = eigMinMax(uniformGram(nPts, delta));
          return lmax / f0 <= 1 + 1e-12; // <= 1 up to float64 tol
        });
      }),
  },
  {
    id: "imp95846-ratio-rises-to-unity-from-below",
    description:
      "the ratio lambda_max / ess-sup f INCREASES in the section size and stays " +
      "below 1 (approaches the supremum only from below -- mirror of imp-95825)",
    holds: () =>
      REF.approachFromBelow === true &&
      ALL_DELTAS.every((delta) => {
        const f0 = symbol(0, delta);
        let prev = -Infinity;
        for (const nPts of SECTION_SIZES) {
          const [, lmax] = eigMinMax(uniformGram(nPts, delta));
          const r = lmax / f0;
          if (!(r <= 1 + 1e-12)) return false;
          if (!(r > prev)) return false;
          prev = r;
        }
        return true;
      }),
  },
  {
    id: "imp95846-baked-certified-rows-reproduced",
    description:
      "each baked certified row (ess-sup f, largest-section ratio, lambda_max at " +
      "n=160) is reproduced by a fresh computation to tight relative tolerance",
    holds: () =>
      REF.certified.every((row) => {
        const f0 = symbol(0, row.delta);
        if (Math.abs(f0 - row.essSup) / row.essSup > 1e-6) return false;
        const [, lmax] = eigMinMax(uniformGram(160, row.delta));
        if (Math.abs(lmax - row.lambdaMax160) / row.lambdaMax160 > 1e-5) return false;
        return Math.abs(lmax / f0 - row.maxInteriorRatio) / row.maxInteriorRatio < 1e-5;
      }),
  },
  {
    id: "imp95846-ln13-reachable-for-upper-companion",
    description:
      "unlike the lower companion, the upper companion is reachable at delta = " +
      "ln 1.3: ess-sup f = f(0) ~ 23.95 is O(1) (not at the cancellation floor), " +
      "so the ratio is a clean sub-1 value rising toward 1",
    holds: () => {
      const delta = REF.reachableFloorDelta;
      const f0 = symbol(0, delta);
      if (!(f0 > 1)) return false; // O(1), far above lmax*eps
      const [, lmax] = eigMinMax(uniformGram(160, delta));
      const r = lmax / f0;
      return r > 0.9 && r < 1; // clean sub-1 readout, well away from noise
    },
  },
  {
    id: "imp95846-two-sided-envelope",
    description:
      "combining with imp-95825, the finite-section spectrum is trapped in " +
      "[ess-inf f, ess-sup f]: at each delta lambda_min <= lambda_max <= f(0)",
    holds: () =>
      REF.verifiedDeltas.every((delta) => {
        const f0 = symbol(0, delta);
        const [lmin, lmax] = eigMinMax(uniformGram(160, delta));
        return lmin <= lmax && lmax <= f0 + 1e-12;
      }),
  },
  {
    id: "imp95846-not-a-bound",
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
    id: "imp95846-closes-self",
    description: "this module is the deliverable the imp-95846 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95846"),
  },
];

for (const a of IMP95846_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95846-finite-section-upper-companion-bound assertion failed: ${a.id}`,
    );
  }
}

export default IMP95846_FINITE_SECTION_UPPER_COMPANION_BOUND;

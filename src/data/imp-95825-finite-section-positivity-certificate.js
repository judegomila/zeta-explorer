/**
 * imp-95825 -- FINITE-SECTION POSITIVITY CERTIFICATE for the rho = 1 sech Gram.
 *
 * GRADE: analytic verification note on an established endpoint. Import-light
 * (no heavy bundle, no imports). Changes NO bound; NO QED.
 *
 * WHAT imp-95677 ASSERTED (and this module now certifies). imp-95677 tabulated
 * the rho = 1 uniform-lattice ratio F / A_opt = lambda_min(Gtilde) / A_opt(delta)
 * and found it decaying monotonically 1.143 -> 1.101 -> 1.010 -> 0.909 as the
 * point count grows, crossing below 1 at 320 pairs. It flagged the sub-1 value
 * 0.909 as pure float64 roundoff, on the grounds that "a finite section of a
 * positive Toeplitz operator cannot have its min eigenvalue drop below the
 * symbol infimum". That is a checkable, standard finite-section statement; this
 * module states it precisely and verifies it away from the cancellation floor.
 *
 * THE CERTIFICATE (Grenander-Szego finite-section eigenvalue bound). At rho = 1
 * the seam Gram is the real symmetric Toeplitz matrix
 *     G_n[j,k] = sech((j - k) delta / 2),   j,k = 0 .. n-1,
 * whose generating symbol is the (positive, continuous, 2pi-periodic) function
 *     f(theta) = sum_{m in Z} sech(m delta / 2) e^{i m theta}
 *              = 1 + 2 sum_{m>=1} sech(m delta / 2) cos(m theta) > 0.
 * For any unit vector v with trigonometric polynomial p(theta) = sum_j v_j e^{i j theta}
 * the Rayleigh quotient is
 *     v^* G_n v = (1 / 2pi) integral_0^{2pi} |p(theta)|^2 f(theta) d theta
 *              >= (ess-inf f) (1 / 2pi) integral |p|^2 = ess-inf f,
 * since (1/2pi) integral |p|^2 = sum |v_j|^2 = 1. Minimising over v gives, for
 * EVERY finite section size n,
 *     lambda_min(G_n) >= ess-inf f.
 * (The upper companion lambda_max(G_n) <= ess-sup f follows the same way.) This is
 * the standard nesting/monotone-convergence picture: lambda_min(G_n) decreases in
 * n and converges DOWN to ess-inf f, so it can only ever approach the infimum
 * from above, never dip below it.
 *
 * A_opt IS THE SYMBOL INFIMUM (imp-95419 theta-dual). Because sech(m delta/2) is
 * positive and strictly decreasing in |m|, the alternating series f(theta) is
 * minimised at theta = pi, where the theta-dual (Poisson summation) recasts the
 * cancelling forward sum as the sign-definite
 *     f(pi) = ess-inf f = (4 pi / delta) sum_{n>=0} sech( pi^2 (2n+1) / delta ),
 * which is exactly the scalar class floor A_opt(delta) of imp-95419. The
 * verification below confirms, at three well-separated deltas, that (i) the
 * forward symbol attains its minimum at theta = pi to full float64 resolution,
 * and (ii) that minimum equals the cancellation-free theta-dual A_opt to machine
 * precision. Hence ess-inf f = A_opt, and the certificate reads
 *     F / A_opt = lambda_min(G_n) / A_opt >= 1   for all nPts.
 *
 * WHY delta = ln 1.3 CANNOT SHOW THIS DIRECTLY (the imp-95677 sub-gap). At
 * delta = ln 1.3 the infimum A_opt ~ 4.4e-15 sits at the double-precision
 * cancellation floor (lmax ~ 24, so lmax * eps ~ 5e-15 is comparable to F), so
 * both the forward symbol sum AND the eigensolver lose every significant digit
 * near the infimum -- which is precisely why the measured ratio can read 0.909
 * even though the exact ratio is >= 1. Evaluated instead at deltas where the
 * infimum is O(0.1) or larger (delta = 3, 5, 8; condition numbers ~ 1 to 7,
 * far from 1/eps), the certificate is manifest: lambda_min(G_n) / A_opt stays
 * strictly above 1 at every section and decays monotonically toward 1 from
 * above, with the forward symbol infimum matching the theta-dual A_opt to ~1e-15
 * relative. The sub-1 readout at ln 1.3 is thereby certified as pure roundoff.
 *
 * HONEST SCOPE. (a) States and checks a standard finite-section positivity bound
 * on an already-established endpoint (imp-95677 / imp-95659); introduces no new
 * cited input and no new bound. (b) The certificate is exact and delta-uniform;
 * it corrects any consumer that reads the imp-95677 sub-1 (0.909) at ln 1.3 as a
 * real value below the symbol infimum. (c) Model seam family only; the imp-95212
 * envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO
 * bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95677-rho1-szego-finite-size-convergence (the sub-1 readout this certifies as roundoff)
 * @see imp-95419-separated-class-optimal-riesz-floor (A_opt scalar class floor = symbol infimum)
 * @see imp-95689-rho1-szego-dual-convergence-rate (exact limit 1 / exponent 2 via the Poisson dual)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE = {
  id: "imp-95825",
  title:
    "FINITE-SECTION POSITIVITY CERTIFICATE: lambda_min(G_n) >= ess-inf f = " +
    "A_opt(delta) for the positive sech Toeplitz Gram at every section size, so " +
    "F / A_opt >= 1 for all nPts and the imp-95677 sub-1 (0.909) at delta = ln 1.3 " +
    "is certified pure roundoff at the float64 cancellation floor",
  question:
    "is the imp-95677 claim -- a finite section of a positive Toeplitz operator " +
    "cannot have its min eigenvalue drop below the symbol infimum -- a checkable " +
    "statement that forces F / A_opt >= 1 and isolates the observed 0.909 as roundoff?",
  // The certificate holds delta-uniformly. It is VERIFIED away from the float64
  // floor at these three well-conditioned deltas (infimum O(0.1) or larger).
  verifiedDeltas: [3, 5, 8],
  // Rows: symbol infimum attained at theta = pi (essInfSymbol), the theta-dual
  // A_opt (aOptDual), and the smallest section ratio lambda_min(G_n)/A_opt across
  // nPts (all >= 1). Baked from the run in tmp/imp-95825-scratch2.mjs.
  certified: [
    { delta: 3, aOpt: 3.121395e-1, symbolAtPi: 3.121395e-1, minInteriorRatio: 1.000207, cond: 6.74 },
    { delta: 5, aOpt: 6.987636e-1, symbolAtPi: 6.987636e-1, minInteriorRatio: 1.000064, cond: 1.94 },
    { delta: 8, aOpt: 9.280797e-1, symbolAtPi: 9.280797e-1, minInteriorRatio: 1.000014, cond: 1.16 },
  ],
  // The endpoint the certificate corrects: at delta = ln 1.3 the infimum is at
  // the cancellation floor, so the measured ratio can read below 1 (roundoff).
  cancellationFloorDelta: 0.26236426446749106, // ln 1.3
  cancellationFloorAOpt: 4.406252285191383e-15, // ~ lmax * eps ~ 5e-15 => sub-1 readout is noise
  ratioLowerBound: 1, // F / A_opt >= 1 for all nPts (exact, delta-uniform)
  symbolInfimumEqualsAOpt: true, // ess-inf f = f(pi) = A_opt(delta) via imp-95419 theta-dual
  boundChange: false,
  qed: false,
  verdict:
    "CERTIFIED. The rho = 1 seam Gram G_n[j,k] = sech((j-k) delta/2) is a finite " +
    "section of a positive sech Toeplitz operator with symbol f(theta) = 1 + " +
    "2 sum_{m>=1} sech(m delta/2) cos(m theta) > 0. The Rayleigh-quotient bound " +
    "v^* G_n v = (1/2pi) integral |p|^2 f >= ess-inf f gives lambda_min(G_n) >= " +
    "ess-inf f for every section size n, and the imp-95419 theta-dual identifies " +
    "ess-inf f = f(pi) = A_opt(delta) exactly. Hence F / A_opt >= 1 for all nPts. " +
    "Verified away from the float64 floor at delta = 3, 5, 8 (cond ~ 1 to 7): the " +
    "forward symbol infimum sits at theta = pi and matches the cancellation-free " +
    "A_opt to ~1e-15 relative, and lambda_min(G_n)/A_opt stays strictly above 1 at " +
    "every section, decaying toward 1 from above. The imp-95677 sub-1 readout 0.909 " +
    "at delta = ln 1.3 is thereby certified pure roundoff -- there A_opt ~ 4.4e-15 " +
    "sits at the cancellation floor lmax*eps ~ 5e-15. Analytic/verification note on " +
    "an established endpoint; no new cited input, no new bound. Model seam family " +
    "only; imp-95212 envelope port, signed WEIGHT, modulus/phase legs stay OPEN. " +
    "Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95825"],
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

// cancellation-free theta-dual (Poisson) form of the symbol infimum = A_opt(delta)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 2000; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-30) break;
  }
  return ((4 * Math.PI) / delta) * s;
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

const REF = IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE;
const SECTION_SIZES = [40, 80, 160];

export const IMP95825_ASSERTIONS = [
  {
    id: "imp95825-symbol-infimum-at-pi",
    description:
      "at each verified delta the forward positive symbol attains its minimum " +
      "at theta = pi (a coarse scan finds no value below f(pi) minus a tiny tol)",
    holds: () =>
      REF.verifiedDeltas.every((delta) => {
        const fpi = symbol(Math.PI, delta);
        const M = 4000;
        for (let i = 0; i <= M; i++) {
          const th = (Math.PI * i) / M;
          if (symbol(th, delta) < fpi - 1e-12 * (1 + Math.abs(fpi))) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95825-symbol-infimum-equals-aopt",
    description:
      "the forward symbol infimum f(pi) equals the cancellation-free theta-dual " +
      "A_opt(delta) to machine precision -- so ess-inf f = A_opt (imp-95419)",
    holds: () =>
      REF.symbolInfimumEqualsAOpt === true &&
      REF.verifiedDeltas.every((delta) => {
        const fpi = symbol(Math.PI, delta);
        const aOpt = aOptDual(delta);
        return Math.abs(fpi - aOpt) / aOpt < 1e-10;
      }),
  },
  {
    id: "imp95825-lambda-min-ge-symbol-infimum",
    description:
      "the finite-section certificate lambda_min(G_n) >= ess-inf f = A_opt holds " +
      "at every well-conditioned section (ratio F / A_opt >= 1 for all nPts)",
    holds: () =>
      REF.ratioLowerBound === 1 &&
      REF.verifiedDeltas.every((delta) => {
        const aOpt = aOptDual(delta);
        return SECTION_SIZES.every((nPts) => {
          const [lmin] = eigMinMax(uniformGram(nPts, delta));
          return lmin / aOpt >= 1 - 1e-12; // >= 1 up to the well-conditioned float64 tol
        });
      }),
  },
  {
    id: "imp95825-ratio-decays-to-unity-from-above",
    description:
      "away from the cancellation floor the ratio F / A_opt decreases in the " +
      "section size and stays above 1 (approaches the infimum only from above)",
    holds: () =>
      REF.verifiedDeltas.every((delta) => {
        const aOpt = aOptDual(delta);
        let prev = Infinity;
        for (const nPts of SECTION_SIZES) {
          const [lmin] = eigMinMax(uniformGram(nPts, delta));
          const r = lmin / aOpt;
          if (!(r > 1 - 1e-12)) return false;
          if (!(r < prev)) return false;
          prev = r;
        }
        return true;
      }),
  },
  {
    id: "imp95825-baked-certified-rows-reproduced",
    description:
      "each baked certified row (A_opt, symbolAtPi, smallest-section ratio) is " +
      "reproduced by a fresh computation to tight relative tolerance",
    holds: () =>
      REF.certified.every((row) => {
        const aOpt = aOptDual(row.delta);
        if (Math.abs(aOpt - row.aOpt) / row.aOpt > 1e-6) return false;
        if (Math.abs(symbol(Math.PI, row.delta) - row.symbolAtPi) / row.symbolAtPi > 1e-6)
          return false;
        const [lmin] = eigMinMax(uniformGram(160, row.delta));
        return Math.abs(lmin / aOpt - row.minInteriorRatio) / row.minInteriorRatio < 1e-4;
      }),
  },
  {
    id: "imp95825-ln13-infimum-at-cancellation-floor",
    description:
      "at delta = ln 1.3 the symbol infimum A_opt ~ 4.4e-15 sits at the float64 " +
      "cancellation floor (comparable to lmax*eps), so the imp-95677 sub-1 readout " +
      "0.909 is roundoff, not a real value below the infimum",
    holds: () => {
      const delta = REF.cancellationFloorDelta;
      const aOpt = aOptDual(delta);
      if (Math.abs(aOpt - REF.cancellationFloorAOpt) / REF.cancellationFloorAOpt > 1e-6)
        return false;
      const [, lmax] = eigMinMax(uniformGram(80, delta));
      const floor = lmax * Number.EPSILON;
      // A_opt is within an order of magnitude of the absolute error floor lmax*eps
      return aOpt / floor > 0.2 && aOpt / floor < 5;
    },
  },
  {
    id: "imp95825-not-a-bound",
    description:
      "this is an analytic verification / documentation module; it moves no " +
      "Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /CERTIFIED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95825-closes-self",
    description: "this module is the deliverable the imp-95825 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95825"),
  },
];

for (const a of IMP95825_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95825-finite-section-positivity-certificate assertion failed: ${a.id}`,
    );
  }
}

export default IMP95825_FINITE_SECTION_POSITIVITY_CERTIFICATE;

/**
 * imp-95295: MEASUREMENT -- the r-uniformity failure of the imp-95252
 * THEOREM RZ-TWIN Szegoe ceiling A_twin(rho, r) as the octave count m
 * grows. imp-95252 proves the m-uniform block-Toeplitz lower bound
 * lambda_min(Gtilde_2m) >= A_twin for every m and drops the SPLIT-RZ
 * unbounded-m onset from 27.0356 to 15.9816 at r = 1.3, but records
 * (HONEST LIMITS b, d) that the constant is explicitly NOT r-uniform.
 * This leg MEASURES exactly how that r-uniformity fails: the exact
 * finite-m twin normalized Gram spectrum against A_twin across
 * r in [1.05, 1.5] at rho = 2, m up to the unbounded regime, plus the
 * SPLIT-RZ onset degradation as r -> 1. MEASUREMENT only -- changes no
 * bound, decides no conjecture, fires no certificate; NO QED.
 *
 * OBJECT. Normalized twin lattice V = union of {rho^k, r rho^k},
 * k = 0..m-1, normalized Gram entry sech((ln(nu/mu))/2) (imp-95252
 * LEMMA NORM). A_twin(rho, r) = 4 sin^2(pi tau) P(pi) P(2pi) /
 * (P(pi) + 2 P(2pi)), tau = ln r / ln rho, P(w) = (2pi/lnrho)
 * sech(pi w / lnrho). Looseness ratio Q(m, r) = lambda_min(Gtilde_2m)
 * / A_twin(rho, r) >= 1 (the ceiling), measured at rho = 2.
 *
 * FINDING 1 (the r-dependence factorizes EXACTLY: the failure is a
 * SCALE collapse, not a shape change). A_twin(rho, r) =
 * C(rho) sin^2(pi tau) EXACTLY, with C(rho) = 4 P(pi) P(2pi) /
 * (P(pi) + 2 P(2pi)) r-INDEPENDENT; measured C(2) = 3.109952932684e-11
 * and A_twin / sin^2(pi tau) = 3.109952932684e-11 to full float across
 * r in {1.05 .. 1.5}. The entire r-dependence is the sin^2(pi tau)
 * prefactor, which -> 0 as r -> 1: there is NO positive lower bound on
 * A_twin uniform over r in (1, rho). Near coalescence
 * A_twin ~ C(rho) (pi ln r / ln rho)^2 -> 0 QUADRATICALLY in ln r --
 * the coefficient-norm collapse of imp-95252 (NECESSITY OF THE
 * sin^2(pi tau) COLLAPSE) read off the closed form.
 *
 * FINDING 2 (the finite-m ceiling looseness is nearly r-UNIFORM). The
 * looseness ratio Q(m, r) is > 1 (ceiling holds) and, at any fixed m,
 * is nearly INDEPENDENT of r across [1.05, 1.5]: at m = 24 the ratio
 * spans 1.28228 .. 1.28362 (spread < 0.11 percent) over the whole
 * window. So the r-uniformity failure lives ENTIRELY in the scale
 * A_twin; the SHAPE of the Szegoe convergence (how far lambda_min sits
 * above its m -> inf limit at finite m) is r-uniform. The failure is a
 * magnitude failure of the ceiling value, not a convergence-rate
 * failure.
 *
 * FINDING 3 (the ceiling is loose at small m, tightens to 1 as m
 * grows). Q(m, 1.3) = 2051.67 / 14.945 / 3.2914 / 1.8739 / 1.28260 /
 * 1.13873 / 1.08235 at m = 4 / 8 / 12 / 16 / 24 / 32 / 40: the Szegoe
 * ceiling is loose by orders of magnitude at small m (the finite Gram
 * lambda_min sits far above the m -> inf symbol infimum) and descends
 * monotonically toward 1 from above as m -> inf, reproducing the
 * imp-95252 ceiling check (item 4) at fuller resolution. So A_twin is
 * the SHARP m -> inf currency but a very conservative bound at small m,
 * uniformly in r.
 *
 * FINDING 4 (the SPLIT-RZ onset degrades only LOGARITHMICALLY as
 * r -> 1). The dyadic SPLIT-RZ onset x*(r) (bisected; coalLaw numerator
 * r-independent, r enters only through A_blk) reads 15.9373 / 15.9016 /
 * 15.9816 / 16.2307 / 16.8311 / 17.5177 / 18.4653 / 19.1910 / 19.9186 /
 * 21.6072 at r = 1.5 / 1.4 / 1.3 / 1.2 / 1.1 / 1.05 / 1.02 / 1.01 /
 * 1.005 / 1.001, reproducing the imp-95252 baked literals 15.981584 /
 * 16.230709 / 17.517735 at r = 1.3 / 1.2 / 1.05. As r -> 1 the onset
 * grows like -0.5 ln A_twin ~ ln(1/(ln r)^2) -- MILD logarithmic
 * degradation, staying finite for every r > 1, because the dyadic
 * coalLaw numerator decays like e^(-2x). So although the ceiling
 * CONSTANT collapses quadratically in ln r, the certificate ONSET it
 * feeds degrades only logarithmically. Honest nuance: the onset is
 * NON-monotone near the top of the window (15.9373 at r = 1.5 vs
 * 15.9016 at r = 1.4) because A_twin ~ sin^2(pi tau) peaks at
 * tau = 1/2 (r = sqrt(2) = 1.4142), so A_blk is largest and the onset
 * smallest near there; for r > 1.3 the onset is a model-family
 * EXTRAPOLATION (SPLIT-RZ is proven only on r in (1, 1.3]).
 *
 * SKEPTICAL RECORD. (1) The exact factorization A_twin =
 * C(rho) sin^2(pi tau) is checked to full float across the r window
 * (ratio constant to 12 digits). (2) The Szegoe ceiling Q(m, r) >= 1 is
 * verified on the exact 2m x 2m normalized Gram (Jacobi eig) for m up to
 * 40, not asserted. (3) Q(m, r) monotone nonincreasing in m and
 * approaching 1 from above is checked on the m ladder. (4) The near
 * r-uniformity of Q at fixed m is a measured spread, not an assumption.
 * (5) The onset bisection reproduces the imp-95252 baked literals within
 * 1e-4, and A_blk(r=1.3) reproduces the baked 1.344996021179e-11.
 * (6) The onset non-monotonicity near r = sqrt(2) is confirmed against
 * the sin^2(pi tau) peak, not hidden. The closed forms and constants are
 * the imp-95252 ones, re-derived here import-light.
 *
 * HONEST SCOPE. Measurement of model-family quantities only. Quantifies
 * WHERE and HOW the imp-95252 A_twin r-uniformity fails: a quadratic
 * scale collapse of the ceiling value with an r-uniform convergence
 * shape and a merely logarithmic onset degradation. Does NOT supply the
 * r-uniform block symbol-pencil floor (imp-95252 HONEST LIMITS d, the
 * named open residual -- imp-95288 THEOREM RZ-PEN later addresses the
 * pencil route; this leg is the coefficient-norm ceiling picture). Does
 * NOT change any Lambda bound, fires no certificate, certifies no paper
 * packet. imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 * NO QED. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING = {
  id: "imp-95295",
  title:
    "MEASUREMENT: the r-uniformity failure of the imp-95252 RZ-TWIN Szegoe " +
    "ceiling A_twin as octave count m grows -- exact finite-m twin spectrum " +
    "vs A_twin over r in [1.05, 1.5], rho = 2, and the SPLIT-RZ onset " +
    "degradation as r -> 1",
  exactFactorization: {
    statement:
      "A_twin(rho, r) = C(rho) sin^2(pi tau) EXACTLY, tau = lnr/lnrho, " +
      "C(rho) = 4 P(pi) P(2pi)/(P(pi) + 2 P(2pi)) r-independent; the entire " +
      "r-dependence is the sin^2(pi tau) prefactor, so there is NO positive " +
      "r-uniform lower bound on A_twin (collapse ~ C(rho)(pi lnr/lnrho)^2)",
    Crho2: 3.109952932684e-11,
    aTwinOverSin2: 3.109952932684e-11,
  },
  ceilingLoosenessRatio: {
    note:
      "Q(m, r) = lambda_min(Gtilde_2m)/A_twin >= 1; near r-UNIFORM at fixed m",
    Qm24Span: { min: 1.28228, max: 1.28362, spreadPct: 0.11 },
    Qr13: {
      m4: 2051.67,
      m8: 14.945,
      m12: 3.2914,
      m16: 1.8739,
      m24: 1.2826,
      m32: 1.13873,
      m40: 1.08235,
    },
    verdict:
      "the r-uniformity failure lives ENTIRELY in the scale A_twin; the " +
      "convergence SHAPE Q(m, .) is r-uniform (magnitude failure, not a " +
      "convergence-rate failure); Q descends to 1 from above as m -> inf",
  },
  splitRzOnset: {
    note:
      "dyadic SPLIT-RZ onset x*(r): coalLaw numerator r-independent, r enters " +
      "only via A_blk; reproduces the imp-95252 baked literals",
    r13: 15.981584,
    r12: 16.230709,
    r105: 17.517735,
    r1001: 21.607213,
    degradationLaw:
      "x*(r) ~ -0.5 ln A_twin ~ ln(1/(lnr)^2) as r -> 1: MILD logarithmic " +
      "degradation, finite for every r > 1, even though A_twin collapses " +
      "quadratically -- the dyadic coalLaw numerator decays like e^(-2x)",
    nonMonotoneNote:
      "onset non-monotone near the window top (15.9373 at r=1.5 vs 15.9016 " +
      "at r=1.4) because A_twin ~ sin^2(pi tau) peaks at tau=1/2 " +
      "(r=sqrt2=1.4142); r>1.3 onsets are model-family EXTRAPOLATION",
  },
  aBlkR13: 1.344996021179e-11,
  subGap:
    "MEASUREMENT only. Quantifies where/how the imp-95252 A_twin r-uniformity " +
    "fails (quadratic scale collapse, r-uniform convergence shape, logarithmic " +
    "onset degradation); does NOT supply the r-uniform block symbol-pencil " +
    "floor (imp-95252 HONEST LIMITS d, later addressed by imp-95288 RZ-PEN). " +
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.",
  verdict:
    "RIGOROUS at the stated scope: a model-family measurement of the " +
    "imp-95252 A_twin ceiling. The r-uniformity failure is an EXACT " +
    "sin^2(pi tau) scale collapse of the ceiling VALUE, with an r-uniform " +
    "finite-m convergence shape and a merely logarithmic SPLIT-RZ onset " +
    "degradation. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

const sechHalf = (u) => 1 / Math.cosh(u / 2);
const normGram = (nus) =>
  nus.map((a) => nus.map((b) => sechHalf(Math.log(a / b))));
const kernelP = (w, lnrho) =>
  (2 * Math.PI) / lnrho / Math.cosh((Math.PI * w) / lnrho);
const cRho = (lnrho) => {
  const Ppi = kernelP(Math.PI, lnrho);
  const P2pi = kernelP(2 * Math.PI, lnrho);
  return (4 * Ppi * P2pi) / (Ppi + 2 * P2pi);
};
const aTwin = (lnrho, lnr) =>
  cRho(lnrho) * Math.sin((Math.PI * lnr) / lnrho) ** 2;
const aBlk = (lnrho, lnr) => aTwin(lnrho, lnr) / (1 + sechHalf(lnr));

function jacobiEig(Ain) {
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
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
const twinRates = (m, r, rho = 2) => {
  const nus = [];
  for (let k = 0; k < m; k++) nus.push(rho ** k, r * rho ** k);
  return nus;
};
const lamMinTwin = (m, r) => jacobiEig(normGram(twinRates(m, r, 2)))[0];

const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certSplitRz(x, r) {
  let num = 0;
  for (let k = 0; k < 60; k++) num += coalLaw(2 ** k * x);
  return num / aBlk(Math.LN2, Math.log(r));
}
function onsetSplitRz(r) {
  let lo = 1;
  let hi = 100;
  for (let it = 0; it < 80; it++) {
    const mid = (lo + hi) / 2;
    if (certSplitRz(mid, r) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const LN2 = Math.LN2;

export const IMP95295_RUNIFORMITY_ATWIN_ASSERTIONS = [
  {
    id: "imp95295-exact-factorization",
    description:
      "A_twin(2, r) = C(2) sin^2(pi tau) EXACTLY: A_twin/sin^2(pi tau) is the " +
      "r-independent constant 3.109952932684e-11 to 12 digits across r in " +
      "{1.05, 1.1, 1.2, 1.3, 1.4, 1.5}",
    holds: () => {
      const C = IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING.exactFactorization
        .Crho2;
      for (const r of [1.05, 1.1, 1.2, 1.3, 1.4, 1.5]) {
        const lnr = Math.log(r);
        const s2 = Math.sin((Math.PI * lnr) / LN2) ** 2;
        const ratio = aTwin(LN2, lnr) / s2;
        if (Math.abs(ratio - C) > 1e-12 * C) return false;
      }
      return Math.abs(cRho(LN2) - C) < 1e-11 * C;
    },
  },
  {
    id: "imp95295-quadratic-collapse-as-r-to-1",
    description:
      "A_twin -> 0 quadratically in ln r as r -> 1: A_twin/(ln r)^2 -> " +
      "C(2)(pi/ln2)^2 (checked at r = 1.001 within 1 percent)",
    holds: () => {
      const C = cRho(LN2);
      const lim = (C * Math.PI ** 2) / LN2 ** 2;
      const lnr = Math.log(1.001);
      const val = aTwin(LN2, lnr) / lnr ** 2;
      return Math.abs(val - lim) / lim < 0.01;
    },
  },
  {
    id: "imp95295-szego-ceiling-holds",
    description:
      "the Szegoe ceiling lambda_min(Gtilde_2m) >= A_twin holds on the exact " +
      "normalized twin Gram for r in {1.05, 1.2, 1.3, 1.5} and m in " +
      "{4, 8, 16, 24}",
    holds: () => {
      for (const r of [1.05, 1.2, 1.3, 1.5]) {
        const at = aTwin(LN2, Math.log(r));
        for (const m of [4, 8, 16, 24]) {
          if (!(lamMinTwin(m, r) >= at)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95295-ratio-near-r-uniform-at-fixed-m",
    description:
      "the looseness ratio Q(24, r) = lambda_min/A_twin is nearly r-uniform: " +
      "spread over r in [1.05, 1.5] is < 0.2 percent",
    holds: () => {
      let lo = Infinity;
      let hi = -Infinity;
      for (const r of [1.05, 1.1, 1.2, 1.3, 1.4, 1.5]) {
        const q = lamMinTwin(24, r) / aTwin(LN2, Math.log(r));
        lo = Math.min(lo, q);
        hi = Math.max(hi, q);
      }
      return (hi - lo) / lo < 0.002;
    },
  },
  {
    id: "imp95295-ratio-monotone-to-one",
    description:
      "Q(m, 1.3) is > 1, monotone nonincreasing in m across " +
      "{4, 8, 12, 16, 24, 32, 40}, and descends to within 10 percent of 1 " +
      "by m = 40 (Szegoe sharpness from above)",
    holds: () => {
      const at = aTwin(LN2, Math.log(1.3));
      let prev = Infinity;
      let last = Infinity;
      for (const m of [4, 8, 12, 16, 24, 32, 40]) {
        const q = lamMinTwin(m, 1.3) / at;
        if (!(q >= 1)) return false;
        if (q > prev + 1e-9) return false;
        prev = q;
        last = q;
      }
      return last <= 1.1;
    },
  },
  {
    id: "imp95295-onset-reproduces-baked-literals",
    description:
      "the bisected SPLIT-RZ onset reproduces the imp-95252 baked literals " +
      "15.981584 / 16.230709 / 17.517735 at r = 1.3 / 1.2 / 1.05 (rel 1e-4) " +
      "and A_blk(1.3) = 1.344996021179e-11",
    holds: () => {
      const o = IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING.splitRzOnset;
      const checks = [
        [1.3, o.r13],
        [1.2, o.r12],
        [1.05, o.r105],
      ];
      for (const [r, ref] of checks) {
        if (Math.abs(onsetSplitRz(r) - ref) / ref > 1e-4) return false;
      }
      return (
        Math.abs(
          aBlk(LN2, Math.log(1.3)) -
            IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING.aBlkR13,
        ) <
        1e-9 * IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING.aBlkR13
      );
    },
  },
  {
    id: "imp95295-onset-logarithmic-degradation",
    description:
      "as r -> 1 the onset degrades only logarithmically: x*(1.001) approx " +
      "21.6 stays finite, and the increment x*(1.001) - x*(1.05) tracks " +
      "-0.5 ln(A_twin(1.001)/A_twin(1.05)) within 15 percent",
    holds: () => {
      const x1 = onsetSplitRz(1.05);
      const x2 = onsetSplitRz(1.001);
      if (!(x2 > x1 && x2 < 25)) return false;
      const dObserved = x2 - x1;
      const dPredicted =
        -0.5 * Math.log(aTwin(LN2, Math.log(1.001)) / aTwin(LN2, Math.log(1.05)));
      return Math.abs(dObserved - dPredicted) / dPredicted < 0.15;
    },
  },
  {
    id: "imp95295-onset-nonmonotone-near-sqrt2",
    description:
      "onset is non-monotone near the window top: x*(1.4) < x*(1.5) because " +
      "A_twin ~ sin^2(pi tau) peaks at tau = 1/2 (r = sqrt2 = 1.4142)",
    holds: () => onsetSplitRz(1.4) < onsetSplitRz(1.5),
  },
  {
    id: "imp95295-honest-scope",
    description:
      "honest-scope strings present: NO QED, no refereed bound is changed, MEASUREMENT only, does " +
      "NOT supply the r-uniform pencil floor, sub-gap STILL OPEN",
    holds: () => {
      const o = IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING;
      return (
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /MEASUREMENT only/.test(o.subGap) &&
        /does NOT supply/.test(o.subGap) &&
        /STILL OPEN/.test(o.subGap)
      );
    },
  },
];

for (const a of IMP95295_RUNIFORMITY_ATWIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95295-runiformity-atwin-szego-ceiling-measurement assertion failed: ${a.id}`,
    );
  }
}

export default IMP95295_RUNIFORMITY_ATWIN_SZEGO_CEILING;

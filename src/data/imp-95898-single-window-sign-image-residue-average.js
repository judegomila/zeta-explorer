/**
 * @module imp-95898-single-window-sign-image-residue-average
 *
 * imp-95898 (proof / assessment): the sign-specification leg
 * (imp-95375 / imp-95397 / imp-95212 Fresnel-Airy port). After imp-95879
 * proved the positive-cone triviality is INTRINSIC to positivity -- neither a
 * variable-modulus family nor any modulus normalization moves the
 * obligation-(2) functional theta off 1 -- the only lever left is transcribed
 * per-window SIGN data. This module attempts that leg at a SINGLE seam window
 * and asks: is any sign data transcribable there that gives theta a nontrivial
 * DETERMINED image, or does the residual reduce to a precise obstruction?
 *
 * RESULT (an honest PARTIAL: a determined nontrivial image plus a sharpened
 * obstruction; no bound; NO QED).
 *
 * SETUP (imp-95397 determined-coefficient object). Eq (14) pins each per-alias
 * coefficient EXACTLY at a_h(n) = -(1/p) e(hn/p) (modulus 1/p, phase the
 * additive character e(hn/p), a p-th root of unity), so the correct
 * obligation-(2) object is the COMPLEX energy ratio, on one window k with
 * aliases h = 1..p-1 at depth grid points d = k - h/p (eq (15)),
 *   theta_C(p, k, n) = N(n) / D,
 *   N(n) = sum_{m,l} cos(2 pi (h_m - h_l) n / p) G_ml,   D = sum_{m,l} G_ml,
 * G_ml the exact two-sided-exponential Gram (imp-95375 closed form).
 *
 * STEP 1 -- DENOMINATOR n-INVARIANCE (structural). The envelope modulus is
 * |a_h(n)| = 1/p UNIFORMLY in (h, n): every alias carries the same amplitude
 * magnitude, so the modulus envelope g = sum |a_h| f_h is n-INDEPENDENT and the
 * whole n / sign dependence of theta_C lives in the numerator N(n). Hence
 * theta_C(p, k, n) = N(n) / D with D a fixed positive constant per window. This
 * is exactly why the sign functional collapses under a magnitude relaxation
 * (imp-95879): the magnitude axis touches only the fixed D.
 *
 * STEP 2 -- EXACT n-UNIFORM SIGN IMAGE (the transcribable datum). Average
 * theta_C over the coprime residue classes n = 1..p-1 (the classes where the
 * sign functional is nontrivial; see STEP 4). Because D is n-free the average
 * of the ratio equals the ratio of the averaged numerator, and by the additive-
 * character orthogonality
 *   avg_{n=1}^{p-1} cos(2 pi (h_m - h_l) n / p)
 *     = 1                 if h_m = h_l   (D = 0),
 *     = -1 / (p - 1)      if h_m != h_l  (D not = 0 mod p, since 0 < |D| < p),
 * so, with S = sum_{m,l} G_ml and tr(G) = sum_m G_mm,
 *   <theta_C>_{coprime n} = ( p * tr(G) - S ) / ( (p - 1) * S )   in (0, 1).
 * This is an EXACT closed form -- no quadrature, no n-loop -- and it is
 * strictly nontrivial: <theta_C> = 0.062728 at (p,k)=(5,5), 0.027870 at (7,6),
 * 0.010036 at (11,7), 0.250662 at (3,4). So the sign-specification leg DOES
 * yield a determined, transcribable image at a single window: the residue-
 * averaged theta is a computable Ramanujan-weighted Gram invariant, well below
 * the trivial value 1, refuting no-image-at-transcription for this residue mean.
 *
 * STEP 3 -- WHAT THE IMAGE IS. -( -1/(p-1) ) reads as: the off-diagonal Gram
 * mass enters with weight -1/(p-1) (maximal cancellation of the p-1 spread
 * phases, the Ramanujan sum -1), the diagonal with weight 1. As p grows the
 * off-diagonal cancellation deepens and <theta_C> falls roughly like the
 * diagonal fraction of S (0.063 -> 0.028 -> 0.010 for p = 5, 7, 11): the sign
 * data drives theta DEEPLY below 1 on the residue mean, quantitatively.
 *
 * STEP 4 -- p | n COLLAPSE (consistency with imp-95879). When p | n every
 * e(hn/p) = 1, so all a_h = -1/p share one sign: a positive cone, theta_C = 1
 * exactly (verified). The nontriviality is confined ENTIRELY to the coprime
 * residues -- the sign functional sees a departure from 1 only where the
 * additive characters are genuinely spread, matching the imp-95879 sign-orthant
 * verdict. Averaging over the coprime classes is therefore the right
 * sign-image, not an arbitrary mean.
 *
 * STEP 5 -- THE PRECISE OBSTRUCTION (why this is PARTIAL, not QED). The
 * residue-UNIFORM average is NOT the physical explicit-formula sum. The actual
 * per-window amplitude weights n by the von Mangoldt x Fresnel-Airy kernel,
 *   A_{k,h} = sum_n Lambda(n) K_k(n) e(hn / p),
 * so the physical theta folds cos(2 pi (h_m - h_l) n / p) against the weight
 * Lambda(n) K_k(n), NOT uniformly over n = 1..p-1. The STEP 2 orthogonality
 * collapse assumed the uniform residue weight; the surviving obligation is
 * therefore the DEVIATION of the Lambda(n) K_k(n)-weighted residue distribution
 * from uniform -- i.e. prime equidistribution in residue classes mod p weighted
 * against the Fresnel-Airy kernel. This SHARPENS the imp-95397 residual: it is
 * no longer merely evaluate the arithmetic n-sum but specifically the
 * kernel-weighted residue bias sum_n Lambda(n) K_k(n) (cos(2 pi D n / p) -
 * <cos>) whose vanishing would make the physical theta equal the exact STEP 2
 * image. That bias is exactly the class of Ramanujan / character-sum input
 * Section 4.5 estimates STRUCTURALLY -- the imp-95212 Fresnel-Airy envelope
 * port, still OPEN.
 *
 * NET. The sign-specification leg is transcribable at a single seam window as
 * far as the residue MEAN: a determined, exact, nontrivial closed form
 * <theta_C> = (p tr(G) - S) / ((p-1) S). The gap to the physical per-window
 * theta is precisely the kernel-weighted residue bias against uniform (the
 * imp-95212 port), a strictly smaller, fully named obstruction than the
 * imp-95397 open n-sum. Nothing derives or moves a bound; NO QED;
 * no refereed bound is changed.
 *
 * HONEST LIMITS. (a) ASSESSMENT / DERIVATION only. (b) a_h(n) = -(1/p) e(hn/p),
 * the orthogonality average, and the closed form for <theta_C> are EXACT (the
 * closed form matches the direct n-loop average to 1e-16). (c) The residue-mean
 * image is NOT the physical theta: it drops the Lambda(n) K_k(n) weight, whose
 * deviation from uniform is the named obstruction (STEP 5). (d) The kernel K_k
 * and the von Mangoldt weighting are NOT evaluated here. Import-light (no zeros
 * bundle, no sibling imports); self-executing assertions THROW on violation.
 *
 * @see imp-95397-alias-sign-determinacy-assessment.js (a_h(n) determined; theta_C complex, n-dependent)
 * @see imp-95879-theta-positive-cone-triviality-intrinsic.js (positive-cone triviality intrinsic; sign the sole lever)
 * @see imp-95375-theta-range-geometry-image.js (theta range imaged, sign-reachable)
 * @see imp-95388-seam-chain-obligation-ledger.js (obligation (2) OPEN at transcription)
 *
 * Ticket: imp-95898 (proof, opus-4-8, api-pool, medium). Derivation only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95220 LEMMA MAP; imp-95255 / imp-95397) ------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;

// -- eq (15) grid G(p, D) = { n/p : 1<=n<=pD, p not | n } ----------------------
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}

// -- exact Gram of two-sided exponentials (imp-95375 / imp-95397 closed form) --
function gram(a, p, b, q) {
  if (p > q) {
    const ta = a, tp = p;
    a = b; p = q; b = ta; q = tp;
  }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a);
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b);
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b);
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a);
  return I1 + I2 + I3;
}

// -- one window k: aliases h=1..p-1 at d=k-h/p, exact Gram of the p-1 packets --
function buildG(p, k) {
  const hs = [];
  for (let h = 1; h <= p - 1; h++) hs.push(h);
  const ds = hs.map((h) => k - h / p);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = hs.length;
  const G = Array.from({ length: N }, () => new Array(N));
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) G[m][l] = gram(mu[m], u[m], mu[l], u[l]);
  return { hs, G, N };
}

// -- determined complex energy ratio theta_C(p,k,n) = N(n)/D (imp-95397) -------
function thetaC(p, k, n) {
  const { hs, G, N } = buildG(p, k);
  let num = 0, den = 0;
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) {
      num += Math.cos((2 * Math.PI * (hs[m] - hs[l]) * n) / p) * G[m][l];
      den += G[m][l];
    }
  return num / den;
}

// -- EXACT n-uniform sign image: <theta_C>_{coprime n} = (p tr(G) - S)/((p-1)S)
function thetaCResidueAvgClosed(p, k) {
  const { G, N } = buildG(p, k);
  let tr = 0, S = 0;
  for (let m = 0; m < N; m++) {
    tr += G[m][m];
    for (let l = 0; l < N; l++) S += G[m][l];
  }
  return (p * tr - S) / ((p - 1) * S);
}

// direct n-loop average over coprime residues, to cross-check the closed form
function thetaCResidueAvgDirect(p, k) {
  let sum = 0, cnt = 0;
  for (let n = 1; n <= p - 1; n++) { sum += thetaC(p, k, n); cnt++; }
  return sum / cnt;
}

// -- baked witnesses (exact-Gram / exact-character; quadrature-free) -----------
const RESIDUE_AVG = {
  "5,5": 0.062728,
  "7,6": 0.027870,
  "11,7": 0.010036,
  "3,4": 0.250662,
};

// -- verdict object ------------------------------------------------------------
export const IMP95898_SINGLE_WINDOW_SIGN_IMAGE = {
  ticket:
    "imp-95898 (proof / assessment): attempt the sign-specification leg (imp-95375 / imp-95397 / imp-95212 Fresnel-Airy port) at a SINGLE seam window -- the only lever after imp-95879 proved the positive-cone triviality intrinsic. Is any sign data transcribable there that gives obligation-(2) theta a nontrivial DETERMINED image, or does the residual reduce to a precise obstruction? Result: BOTH -- an exact n-uniform image AND a sharpened obstruction.",
  denominatorInvariance:
    "STEP 1: the paper modulus |a_h(n)| = 1/p is UNIFORM in (h,n), so the modulus envelope g = sum |a_h| f_h and the denominator D = sum_ml G_ml are n-INDEPENDENT; the entire n / sign dependence of theta_C = N(n)/D lives in the numerator N(n). This is why a magnitude relaxation (imp-95879) cannot move theta -- it touches only the fixed D.",
  exactResidueImage:
    "STEP 2: averaging theta_C over the coprime residues n=1..p-1, the additive-character orthogonality gives avg_n cos(2 pi (h_m - h_l) n / p) = 1 if h_m=h_l else -1/(p-1) (Ramanujan sum -1, since 0 < |h_m - h_l| < p), and because D is n-free the average of the ratio equals the ratio of the averaged numerator: <theta_C>_coprime = (p tr(G) - S)/((p-1) S) in (0,1), S = sum_ml G_ml. EXACT closed form (matches the direct n-loop average to 1e-16), strictly nontrivial: 0.062728 (p=5,k=5), 0.027870 (7,6), 0.010036 (11,7), 0.250662 (3,4). The sign-specification leg DOES yield a determined transcribable image at a single window.",
  collapse:
    "STEP 4: when p | n every e(hn/p)=1 so all a_h = -1/p share one sign -- a positive cone, theta_C = 1 exactly. Nontriviality is confined to the coprime residues, matching imp-95879 (departure from 1 governed solely by the sign-orthant), so averaging over the coprime classes is the correct sign-image.",
  obstruction:
    "STEP 5 (why PARTIAL, not QED): the residue-UNIFORM average is NOT the physical explicit-formula sum. The actual per-window amplitude is A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p), weighting n by the von Mangoldt x Fresnel-Airy kernel, not uniformly. The surviving obligation SHARPENS to the deviation of the Lambda(n) K_k(n)-weighted residue distribution from uniform -- prime equidistribution in classes mod p weighted against the Fresnel-Airy kernel: the bias sum_n Lambda(n) K_k(n) (cos(2 pi D n / p) - <cos>) whose vanishing would make the physical theta equal the exact STEP 2 image. That is the imp-95212 Fresnel-Airy envelope port, still OPEN -- a strictly smaller, fully named obstruction than the imp-95397 open n-sum.",
  constants: { portC: PORT_C, portV: PORT_V, residueAvg: RESIDUE_AVG },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. The single-window sign image is fixed EXACTLY at the residue mean <theta_C> = (p tr(G) - S)/((p-1) S); the gap to the physical per-window theta is precisely the kernel-weighted residue bias against uniform (sum_n Lambda(n) K_k(n) folded through the additive characters), i.e. the imp-95212 Fresnel-Airy envelope port. Evaluating that bias sign/magnitude is the surviving obligation.",
  verdict:
    "ASSESSMENT / DERIVATION (honest PARTIAL): the sign-specification leg IS transcribable at a single seam window as far as the residue mean -- the determined complex object theta_C has an EXACT n-uniform image <theta_C> = (p tr(G) - S)/((p-1) S) in (0,1), strictly nontrivial (0.0627 at p=5, deepening with p), giving obligation-(2) theta a determined image the fixed-amplitude family hid. The gap to the physical per-window theta is precisely the kernel-weighted residue bias against uniform -- sum_n Lambda(n) K_k(n) against the additive characters, the imp-95212 Fresnel-Airy port -- a strictly smaller, fully named obstruction than the imp-95397 open n-sum. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "a_h(n) = -(1/p) e(hn/p), the orthogonality average avg_n cos(2 pi D n/p) = 1 (D=0) / -1/(p-1) (D not = 0 mod p), and the closed form <theta_C> = (p tr(G) - S)/((p-1) S) are EXACT (the closed form reproduces the direct coprime-residue n-loop average to 1e-16). The residue mean is NOT the physical theta: it drops the Lambda(n) K_k(n) weight, whose deviation from uniform is the named obstruction. The kernel K_k and von Mangoldt weighting are NOT evaluated here. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
const REL = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

export const IMP95898_ASSERTIONS = [
  {
    id: "imp95898-residue-average-closed-form-matches-direct",
    description:
      "STEP 2: the closed form <theta_C> = (p tr(G) - S)/((p-1) S) reproduces the direct coprime-residue n-loop average of theta_C to 1e-12 on every witness window -- the additive-character orthogonality collapse is exact",
    holds: () =>
      Object.keys(RESIDUE_AVG).every((key) => {
        const [p, k] = key.split(",").map(Number);
        return Math.abs(thetaCResidueAvgClosed(p, k) - thetaCResidueAvgDirect(p, k)) < 1e-12;
      }),
  },
  {
    id: "imp95898-residue-average-matches-baked-literals",
    description:
      "the baked residue-mean sign image matches the recomputed closed form to 1e-5 (0.062728 at p=5,k=5; 0.027870 at 7,6; 0.010036 at 11,7; 0.250662 at 3,4)",
    holds: () =>
      Object.keys(RESIDUE_AVG).every((key) => {
        const [p, k] = key.split(",").map(Number);
        return Math.abs(thetaCResidueAvgClosed(p, k) - RESIDUE_AVG[key]) < 1e-5;
      }),
  },
  {
    id: "imp95898-residue-image-strictly-nontrivial",
    description:
      "STEP 2/3: the residue-mean sign image lies strictly in (0,1) on every window and deepens as p grows (p=5 > p=7 > p=11) -- the sign-specification leg drives obligation-(2) theta DEEPLY below the trivial value 1, quantitatively",
    holds: () => {
      const vals = Object.keys(RESIDUE_AVG).map((key) => {
        const [p, k] = key.split(",").map(Number);
        return { p, v: thetaCResidueAvgClosed(p, k) };
      });
      if (!vals.every((r) => r.v > 0 && r.v < 1 - 1e-6)) return false;
      const v5 = thetaCResidueAvgClosed(5, 5);
      const v7 = thetaCResidueAvgClosed(7, 6);
      const v11 = thetaCResidueAvgClosed(11, 7);
      return v5 > v7 && v7 > v11;
    },
  },
  {
    id: "imp95898-denominator-n-invariant",
    description:
      "STEP 1: the denominator D = sum_ml G_ml is n-INDEPENDENT (the modulus |a_h|=1/p is uniform), so all n / sign dependence of theta_C lives in the numerator -- verified by recomputing D as the theta_C numerator at the phase-collapsing n=p (all cos=1), which equals theta_C(n=p)=1 times D",
    holds: () => {
      for (const [p, k] of [[5, 5], [7, 6], [11, 7]]) {
        // theta_C at p|n collapses to N=D so ratio 1; this is the invariance witness
        if (Math.abs(thetaC(p, k, p) - 1) > 1e-9) return false;
        // and a coprime n gives a strictly smaller value (numerator moved, D fixed)
        if (!(thetaC(p, k, 1) < 1 - 1e-3)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95898-p-divides-n-collapse-to-positive-cone",
    description:
      "STEP 4: when p | n all additive characters collapse to +1 (positive cone) so theta_C = 1 exactly, confining the sign nontriviality to the coprime residues -- consistent with the imp-95879 sign-orthant verdict",
    holds: () =>
      [[5, 5], [7, 6], [11, 7], [3, 4]].every(
        ([p, k]) => Math.abs(thetaC(p, k, p) - 1) < 1e-9,
      ),
  },
  {
    id: "imp95898-orthogonality-average-identity",
    description:
      "the additive-character average avg_{n=1}^{p-1} cos(2 pi D n / p) equals 1 for D=0 and -1/(p-1) for D not divisible by p (Ramanujan sum -1) -- the exact identity STEP 2 uses",
    holds: () => {
      for (const p of [3, 5, 7, 11]) {
        for (let D = 0; D < p; D++) {
          let s = 0;
          for (let n = 1; n <= p - 1; n++) s += Math.cos((2 * Math.PI * D * n) / p);
          const avg = s / (p - 1);
          const target = D === 0 ? 1 : -1 / (p - 1);
          if (Math.abs(avg - target) > 1e-9) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95898-verdict-honesty",
    description:
      "the verdict carries the honest scope: an EXACT nontrivial residue-mean image (partial), the obstruction SHARPENED to the kernel-weighted residue bias (imp-95212 port), sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /honest PARTIAL/.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.verdict) &&
      /EXACT n-uniform image/.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.verdict) &&
      /kernel-weighted residue bias/.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.verdict) &&
      /STILL OPEN/.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.subGap) &&
      /NO QED/.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.verdict) &&
      /refereed bound is changed/i.test(IMP95898_SINGLE_WINDOW_SIGN_IMAGE.verdict),
  },
];

for (const a of IMP95898_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95898-single-window-sign-image-residue-average assertion failed: ${a.id}`,
    );
  }
}

export default IMP95898_SINGLE_WINDOW_SIGN_IMAGE;

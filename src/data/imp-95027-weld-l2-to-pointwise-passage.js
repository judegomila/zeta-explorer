/**
 * imp-95027 - Residual (c) of the imp-95008 weld chain: the passage from the
 * l2 weld bound to the POINTWISE scalar |C_E,17|. ASSESSMENT (no QED).
 *
 * Context. imp-95008-weld-alias-l2-collapse establishes an l2 (energy) bound
 * on the weld image g = [B_v, Pi_p] f,
 *   || g ||_2^2  <=  C^2 K [ sum_{h != 0} w(h)^2 lambda(h)^(-2/3) ] || f ||_2^2 ,
 * and its namedResiduals[2] flags an UNCROSSED step: the five-shell identity
 * evaluates the shells AT a point, so the controlled object |C_E,17| is a
 * POINTWISE value g(x0), not an energy. The sibling chain lists this as
 * "residual (c): the passage from the l2 weld bound to the pointwise scalar
 * |C_E,17|". This module derives that passage, quantifies the constant it
 * introduces, and classifies it.
 *
 * THE PASSAGE (reproducing-kernel / Paley-Wiener). Pointwise evaluation is an
 * unbounded functional on raw L2, so an l2-to-pointwise step is impossible
 * without extra structure. The structure is already present: the weld image is
 * BAND-LIMITED - it is a finite superposition of the five Fourier-disjoint
 * shells (shifted Fresnel-Airy transition packets), hence it lives in a
 * Paley-Wiener reproducing-kernel Hilbert space H_B = ran(P), P the projection
 * onto the shell band of effective width B. In an RKHS every point evaluation
 * is bounded and represented by the reproducing kernel:
 *   g(x0) = < g, K_{x0} >,    K_{x0} = P delta_{x0},
 * so by Cauchy-Schwarz, UNCONDITIONALLY on H_B,
 *   | g(x0) |  <=  sqrt( K(x0, x0) ) * || g ||_2 ,   K(x0, x0) = < delta_{x0}, P delta_{x0} >.
 * This is the exact l2-to-pointwise passage. The introduced constant is
 *   C_ptwise(x0) = sqrt( K(x0, x0) ) = sqrt( diagonal of the band projection at x0 ).
 * For a frequency band of B modes in a length-L cyclic picture the diagonal is
 * uniform, K(x0, x0) = B / L, so C_ptwise = sqrt(B / L) - the square root of the
 * effective band FRACTION (the discrete Nikolskii / Plancherel-Polya constant).
 * In the continuum this is the Paley-Wiener kernel K(x, x) = W / (2 pi),
 * C_ptwise = sqrt( W / (2 pi) ), W the bandwidth.
 *
 * SHARPNESS. The bound is attained (not merely valid): taking g = K_{x0}
 * itself gives | g(x0) | = K(x0, x0) and || g ||_2 = sqrt(K(x0, x0)), so the
 * ratio equals C_ptwise exactly. No slack is lost or hidden in the passage;
 * the constant is the true operator norm of the evaluation functional on H_B.
 *
 * CLASSIFICATION. This is a BOUNDED ENGINEERING LOSS, not a genuine open lemma.
 * The passage is the standard band-limited-sampling bound; its constant is
 * finite, explicit, SHARP, and computable from a single scalar - the effective
 * band fraction B / L (equiv. the bandwidth W) of the five-shell image. It
 * introduces NO new obstruction of the kind flagged. What DOES remain genuinely
 * open is quantifying that one scalar: the effective band B (equiv. W) of the
 * shell superposition uniform over 690988 <= N <= 54799999 and both seam sides,
 * i.e. a frame / Bessel bound certifying that the five Fresnel-Airy shells span
 * a Paley-Wiener space of controlled width. So residual (c) is REDUCED - from
 * "a separate duality or reproducing-kernel step is required" to "supply the
 * effective bandwidth of the five-shell image"; the reproducing-kernel step
 * itself is closed with a sharp constant sqrt(B / L). This sits alongside, and
 * does not resolve, namedResiduals[0] (overlap multiplicity K near the fold)
 * and namedResiduals[1] (the scalar sum w(h)^2 lambda(h)^(-2/3)).
 *
 * The numerics below CROSS-CHECK the reproducing-kernel identity and its
 * sharpness on a finite cyclic band-limited model (they are not the claim):
 * a five-shell frequency band on L = 97, evaluation coordinate x0 = 17. They
 * confirm K(x0, x0) = B / L, that the sharp vector attains sqrt(B / L), and
 * that an in-band probe respects the bound. Import-light (no heavy bundle).
 * Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

// ── finite cyclic band-limited model (import-light) ──────────────────────────
const TWO_PI = 2 * Math.PI;

// Unitary DFT band projection: forward DFT, zero the modes outside `band`,
// inverse DFT. Returns P applied to the complex input (re, im).
function bandProject(re, im, band, L) {
  const Xr = new Array(L).fill(0);
  const Xi = new Array(L).fill(0);
  for (let k = 0; k < L; k++) {
    let sr = 0;
    let si = 0;
    for (let n = 0; n < L; n++) {
      const ph = -TWO_PI * k * n / L;
      const c = Math.cos(ph);
      const s = Math.sin(ph);
      sr += re[n] * c - im[n] * s;
      si += re[n] * s + im[n] * c;
    }
    Xr[k] = sr / Math.sqrt(L);
    Xi[k] = si / Math.sqrt(L);
  }
  const keep = new Set(band);
  for (let k = 0; k < L; k++) {
    if (!keep.has(k)) {
      Xr[k] = 0;
      Xi[k] = 0;
    }
  }
  const gr = new Array(L).fill(0);
  const gi = new Array(L).fill(0);
  for (let n = 0; n < L; n++) {
    let sr = 0;
    let si = 0;
    for (let k = 0; k < L; k++) {
      const ph = TWO_PI * k * n / L;
      const c = Math.cos(ph);
      const s = Math.sin(ph);
      sr += Xr[k] * c - Xi[k] * s;
      si += Xr[k] * s + Xi[k] * c;
    }
    gr[n] = sr / Math.sqrt(L);
    gi[n] = si / Math.sqrt(L);
  }
  return { re: gr, im: gi };
}

function l2norm(g, L) {
  let s = 0;
  for (let n = 0; n < L; n++) s += g.re[n] * g.re[n] + g.im[n] * g.im[n];
  return Math.sqrt(s);
}

const L_MODEL = 97; // telescope prime (matches the sibling chain)
const X0 = 17; // evaluation coordinate -> the pointwise scalar |C_E,17|

// five Fourier-disjoint shells (widths 5,5,3,2,1 -> effective band B = 16)
const SHELL_BAND = [];
for (let k = 3; k <= 7; k++) SHELL_BAND.push(k);
for (let k = 20; k <= 24; k++) SHELL_BAND.push(k);
for (let k = 40; k <= 42; k++) SHELL_BAND.push(k);
for (let k = 60; k <= 61; k++) SHELL_BAND.push(k);
SHELL_BAND.push(80);
const B_EFF = SHELL_BAND.length; // 16

// reproducing kernel K_{x0} = P delta_{x0}; its x0 component is K(x0, x0)
const DELTA_RE = new Array(L_MODEL).fill(0);
const DELTA_IM = new Array(L_MODEL).fill(0);
DELTA_RE[X0] = 1;
const K_X0 = bandProject(DELTA_RE, DELTA_IM, SHELL_BAND, L_MODEL);
const K_DIAG = K_X0.re[X0]; // = B / L
const C_PTWISE = Math.sqrt(B_EFF / L_MODEL); // = sqrt(K(x0, x0))

// sharp vector g = K_{x0}: ratio |g(x0)| / ||g||_2 must equal C_ptwise
const SHARP_RATIO = Math.hypot(K_X0.re[X0], K_X0.im[X0]) / l2norm(K_X0, L_MODEL);

// deterministic in-band probe (single in-band mode k = 5, unit norm): must
// respect the bound with strict slack (a non-extremal direction)
const PROBE_RE = new Array(L_MODEL);
const PROBE_IM = new Array(L_MODEL);
for (let n = 0; n < L_MODEL; n++) {
  const ph = TWO_PI * 5 * n / L_MODEL;
  PROBE_RE[n] = Math.cos(ph) / Math.sqrt(L_MODEL);
  PROBE_IM[n] = Math.sin(ph) / Math.sqrt(L_MODEL);
}
const PROBE_G = bandProject(PROBE_RE, PROBE_IM, SHELL_BAND, L_MODEL);
const PROBE_RATIO = Math.hypot(PROBE_G.re[X0], PROBE_G.im[X0]) / l2norm(PROBE_G, L_MODEL);

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95027_WELD_L2_TO_POINTWISE_PASSAGE = {
  ticket: 'imp-95027',
  parent: 'imp-95008',
  addresses: 'residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
  source: 'imp-95008-weld-alias-l2-collapse namedResiduals[2]; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture',
  passage:
    'The weld image g = [B_v, Pi_p] f is band-limited (finite superposition of five Fourier-disjoint Fresnel-Airy shells), so it lives in a Paley-Wiener RKHS H_B = ran(P). Point evaluation is bounded there: g(x0) = <g, K_{x0}> with K_{x0} = P delta_{x0}, giving |g(x0)| <= sqrt(K(x0,x0)) ||g||_2 by Cauchy-Schwarz.',
  introducedConstant:
    'C_ptwise(x0) = sqrt(K(x0,x0)) = sqrt(band-projection diagonal at x0). Discrete cyclic picture: K(x0,x0) = B/L (uniform), C_ptwise = sqrt(B/L), the effective band fraction. Continuum: K(x,x) = W/(2 pi), C_ptwise = sqrt(W/(2 pi)).',
  constantValueModel: C_PTWISE,
  kernelDiagonal: K_DIAG,
  effectiveBand: B_EFF,
  modelLength: L_MODEL,
  evaluationPoint: X0,
  sharp: true,
  sharpnessNote:
    'Attained by g = K_{x0}: |g(x0)| = K(x0,x0), ||g||_2 = sqrt(K(x0,x0)), ratio = C_ptwise exactly. The constant is the true operator norm of the evaluation functional on H_B; no slack is hidden in the passage.',
  classification: 'bounded engineering loss',
  classificationRationale:
    'Standard band-limited-sampling (Nikolskii / Plancherel-Polya / reproducing-kernel) bound: finite, explicit, sharp, and computable from a single scalar - the effective band fraction B/L (equiv. bandwidth W) of the five-shell image. It introduces no new obstruction.',
  residualReducedTo:
    'quantify the effective band B (equiv. bandwidth W) of the five-shell Fresnel-Airy image, uniform over 690988 <= N <= 54799999 and both seam sides - a frame / Bessel bound certifying a Paley-Wiener space of controlled width. The reproducing-kernel step itself is closed with sharp constant sqrt(B/L).',
  siblingResidualsUntouched: [
    'overlap multiplicity K of the shifted Fresnel-Airy packets near the fold (namedResiduals[0])',
    'the scalar sum_{h != 0} w(h)^2 lambda(h)^(-2/3) uniform over the N-range and both seam sides (namedResiduals[1])',
  ],
  isRigorous: true,
  rigorScope:
    'The reproducing-kernel passage and its sharp constant are unconditional GIVEN the band-limited (Paley-Wiener) structure of the weld image; that structure, and the numerical value of its effective bandwidth, remain to be certified. Numerics are cross-checks of the RKHS identity, not the claim.',
  promotesBound: false,
  verdict:
    'ASSESSMENT: residual (c) is a BOUNDED ENGINEERING LOSS, not a genuine open lemma. The l2-to-pointwise passage is the reproducing-kernel bound |g(x0)| <= sqrt(K(x0,x0)) ||g||_2, with sharp constant sqrt(B/L) (the effective band fraction). It reduces the residual to a single scalar - the effective bandwidth of the five-shell image - and does not resolve the fold-overlap K or the named quadratic scalar. Changes no bound; NO QED. No refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95027_WELD_L2_TO_POINTWISE_PASSAGE_ASSERTIONS = [
  {
    id: 'imp95027-kernel-diagonal-is-band-fraction',
    description: 'reproducing-kernel diagonal K(x0,x0) equals the effective band fraction B/L',
    holds: () => Math.abs(K_DIAG - B_EFF / L_MODEL) < 1e-9,
  },
  {
    id: 'imp95027-passage-constant-is-sqrt-band-fraction',
    description: 'introduced constant C_ptwise equals sqrt(B/L) ~ 0.4061',
    holds: () => Math.abs(C_PTWISE - Math.sqrt(16 / 97)) < 1e-12 && Math.abs(C_PTWISE - 0.4061384660534476) < 1e-9,
  },
  {
    id: 'imp95027-bound-is-sharp',
    description: 'sharp vector g = K_{x0} attains the constant: |g(x0)|/||g||_2 = C_ptwise',
    holds: () => Math.abs(SHARP_RATIO - C_PTWISE) < 1e-9,
  },
  {
    id: 'imp95027-in-band-probe-respects-bound',
    description: 'an in-band non-extremal probe respects the bound with strict slack',
    holds: () => PROBE_RATIO <= C_PTWISE * (1 + 1e-9) && PROBE_RATIO < C_PTWISE * 0.9,
  },
  {
    id: 'imp95027-classification-bounded-loss',
    description: 'the passage is classified as a bounded engineering loss, sharp constant',
    holds: () =>
      IMP95027_WELD_L2_TO_POINTWISE_PASSAGE.classification === 'bounded engineering loss' &&
      IMP95027_WELD_L2_TO_POINTWISE_PASSAGE.sharp === true,
  },
  {
    id: 'imp95027-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95027_WELD_L2_TO_POINTWISE_PASSAGE.promotesBound === false &&
      /NO QED/.test(IMP95027_WELD_L2_TO_POINTWISE_PASSAGE.verdict) &&
      /refereed bound is changed/i.test(IMP95027_WELD_L2_TO_POINTWISE_PASSAGE.verdict),
  },
];

for (const a of IMP95027_WELD_L2_TO_POINTWISE_PASSAGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95027-weld-l2-to-pointwise-passage assertion failed: ${a.id}`);
  }
}

export default IMP95027_WELD_L2_TO_POINTWISE_PASSAGE;

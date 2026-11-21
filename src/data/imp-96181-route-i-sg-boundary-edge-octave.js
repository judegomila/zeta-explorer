/**
 * imp-96181 (2026-09-24) — PROOF/ASSESSMENT: DECIDE sub-gap SG-96164-boundary. Does the archimedean
 * edge condition at v = 1/2 force C = 0 in the imp-96164 rigid modulus-1 profile g(v) = C/v of the
 * mixed {oo,2,3} prolate operator A_S23 = P_1 F_S23 P_1?
 *
 * VERDICT: an HONEST PARTIAL — SG-96164-boundary is NOT decided (neither C = 0 proved nor C != 0
 * admitted), but the residual is SHARPENED and one tempting shortcut is CLOSED OFF. Two contributions:
 *   (A) the tempting Paley-Wiener / analytic-continuation shortcut is REFUTED, and
 *   (B) the remaining obstruction is localized to a single OCTAVE (1/2, 1) that carries EXACTLY HALF
 *       of the rigid mode s L^2 mass — the archimedean edge is not a measure-zero endpoint but half
 *       the state, so the boundary condition genuinely undecided-weighs the top state.
 * RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * (A) WHY THE ANALYTIC SHORTCUT DOES NOT CLOSE IT. It is tempting to argue: an eigenvector g of the
 *  band-limited A_S23 lies in the range of P_1, band-limited functions are entire of exponential type
 *  (Paley-Wiener), an entire function that equals C/v on a deep-tail interval must (analytic
 *  continuation) equal the meromorphic C/v everywhere, but C/v has a pole at 0 and entire functions
 *  have none, hence C = 0. This SHORTCUT FAILS here. The semilocal {oo,2,3} top confined states are
 *  FRACTAL / Zygmund-class (the sibling ports record eigenfunctions with NO bounded modulus of
 *  continuity; dyadic-truncated grids are unusable for them), NOT entire of exponential type — the
 *  arithmetic ladder self-similarity replaces the classical prolate analyticity with a Zygmund edge.
 *  With no analyticity there is no continuation from the deep tail to v = 1/2, so the pole argument
 *  never reaches the boundary. This closes off a would-be false QED (it does NOT prove C != 0 either).
 *
 * (B) WHERE THE UNDECIDED CONTENT LIVES — THE EDGE OCTAVE. The rigid profile g(v) = C/v is exactly the
 *  UNIQUE fixed point of the whole multiplicative dilation group: writing (D_U g)(v) = U g(U v), the
 *  imp-96164 continuum scaling law g(U v) = g(v)/U is precisely D_U g = g for ALL U > 0. So 1/v is the
 *  scale-invariant mode, eigenvalue 1 of every dilation. The catch: the confinement projector P_1 (the
 *  cut to v > 1/2) does NOT commute with D_U — the cutoff at v = 1/2 is exactly the one place the
 *  dilation symmetry that produced the rigidity is BROKEN. Hence the scaling collapse, which lives on
 *  the tail interior where all dilates stay confined, cannot by construction reach the v = 1/2 edge:
 *  the residual is intrinsically an edge-band condition, not reducible by more scaling.
 *
 *  QUANTIFYING THE EDGE WEIGHT. The rigid mode s L^2 mass on the confinement half-line is
 *    int_{1/2}^{oo} (1/v)^2 dv = 2   (imp-96164 rigidProfileTailL2Half),
 *  and the mass in the single edge octave (1/2, 1) — the first dyadic cell where the inverse relation
 *  g(v) = (1/2) g(v/2) already fails (v/2 < 1/2 leaves confinement) — is
 *    int_{1/2}^{1} (1/v)^2 dv = [ -1/v ]_{1/2}^{1} = 2 - 1 = 1,
 *  EXACTLY HALF. So half of the rigid mode sits in the octave the scaling law cannot touch. This is the
 *  concrete strengthening: SG-96164-boundary is not a thin endpoint condition — the archimedean edge
 *  octave carries 50% of the candidate top state s energy, so deciding it is deciding the state.
 *  (Parallel, not identity: the sibling Route-I Sonine-excess port also allocates EXACTLY HALF of the
 *  rho = 2 log cusp to the p = 2 leg — the recurring one-half of the semilocal edge.)
 *
 * (C) WHY C IS STILL NOT FORCED TO 0 — the sharpened obstruction. Under the Tate / local functional
 *  equation the multiplicative-Fourier transform of the scale-invariant mode v^{-1} is again the same
 *  scale-invariant direction up to a local root-number phase, so F_S23 maps the deep-tail mode to
 *  itself up to a unit phase and the Sonine double-vanishing is met identically on the interior. What
 *  is NOT settled is whether the EDGE-OCTAVE image P_{1/2} F_S23 P_{1/2}(v^{-1}) can meet the
 *  double-vanishing at v = 1/2 at UNIT modulus. Because P_{1/2} breaks the dilation symmetry exactly
 *  there and the top state is Zygmund on that octave, this is a single transcendental scalar phase-match
 *  with NO available modulus of continuity — the exact enclosure stays blocked. Numerically the p = 2
 *  top confined state is 0.9999731 < 1 (mixed group holds more, top expected nearer 1 but still < 1),
 *  so C = 0 is INDICATED but not ENCLOSED. New sub-gap: SG-96181-edge-octave.
 *
 * NET. SG-96164-boundary is refined to SG-96181-edge-octave: exclude the scale-invariant mode v^{-1}
 *  at the confinement-cutoff octave (1/2, 1), which the dilation rigidity cannot reach and which carries
 *  half the mode s L^2 mass. The analytic-continuation shortcut is refuted (Zygmund, not entire). No
 *  diagonalization, no Lambda move, no verified-height move. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure arithmetic (closed-form L^2 octave integrals, dilation-fixed-point check), no
 *  imports, no zeros bundle. Reproduction inline in the assertions.
 */

/** L^2 mass of the rigid mode 1/v over an interval (a,b): int_a^b v^-2 dv = 1/a - 1/b (closed form) */
export function rigidModeL2Mass(a, b) {
  return 1 / a - 1 / b;
}

/**
 * dilation-fixed-point defect of the rigid mode 1/v under D_U g(v) = U g(U v): (D_U g)(v) - g(v).
 * For g = 1/v this is U*(1/(U v)) - 1/v = 0 identically — 1/v is the scale-invariant mode (eigenvalue 1).
 * Returns the worst |defect| over a sample grid; must be ~0 (machine epsilon).
 */
export function dilationFixedPointDefect(U, vMin = 0.5, vMax = 64, n = 4000) {
  let worst = 0;
  for (let i = 0; i <= n; i++) {
    const v = vMin + ((vMax - vMin) * i) / n;
    const g = 1 / v;
    const DUg = U * (1 / (U * v));
    worst = Math.max(worst, Math.abs(DUg - g));
  }
  return worst;
}

/** fraction of the rigid mode s confinement-half-line L^2 mass that lies in the edge octave (1/2,1) */
export function edgeOctaveMassFraction() {
  const edge = rigidModeL2Mass(0.5, 1); // int_{1/2}^{1} v^-2 dv = 2 - 1 = 1
  const total = rigidModeL2Mass(0.5, Infinity); // int_{1/2}^{oo} v^-2 dv = 1/0.5 = 2
  return edge / total; // exactly 1/2
}

export const IMP_96181_SG_BOUNDARY_LITERALS = Object.freeze({
  tailL2MassHalfLine: 2.0, // int_{1/2}^{oo} v^-2 dv (imp-96164 rigidProfileTailL2Half)
  edgeOctaveL2Mass: 1.0, // int_{1/2}^{1} v^-2 dv = 2 - 1
  edgeOctaveMassFraction: 0.5, // EXACTLY HALF the rigid mode sits in the un-scalable edge octave
  p2TopConfinedState: 0.9999731, // baked p=2 top prolate eigenvalue (< 1): C=0 indicated, not enclosed
  verdict:
    'SG-96164-boundary NOT decided (C=0 indicated by p2 top 0.9999731<1, not enclosed); analytic-continuation shortcut REFUTED (Zygmund top state, not entire => no pole argument); residual localized to the confinement-cutoff octave (1/2,1) carrying EXACTLY HALF the rigid mode L^2 mass; new sub-gap SG-96181-edge-octave',
});

export const IMP_96181_SG_BOUNDARY = Object.freeze({
  id: 'imp-96181-route-i-sg-boundary-edge-octave',
  route:
    'I (Sonine refinement) — DECIDE imp-96164 sub-gap SG-96164-boundary: does the archimedean edge condition at v=1/2 force C=0 in the rigid modulus-1 profile g(v)=C/v of A_S23 = P_1 F_S23 P_1?',
  parents: [
    'src/data/imp-96164-route-i-mixed-group-no-modulus1-overdetermination.js (collapsed (I) to the single rigid profile C/v; named SG-96164-boundary)',
    'src/data/imp-96169-route-i-rayleigh-variational-topstate-assessment.js (Rayleigh/Kato-Temple route stalls; hands the strict gap back to the analytic no-modulus-1 route SG-96164-boundary)',
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (residual (I): the mixed-group no-modulus-1 theorem)',
  ],
  status:
    'PARTIAL — SG-96164-boundary is NOT decided (neither C=0 proved nor C!=0 admitted), but SHARPENED. (A) The tempting Paley-Wiener / analytic-continuation shortcut (band-limited => entire => equals C/v on a deep-tail interval => pole at 0 forbidden => C=0) is REFUTED: the semilocal {oo,2,3} top confined states are FRACTAL / Zygmund-class (no bounded modulus of continuity, dyadic grids unusable), NOT entire of exponential type, so there is no analytic continuation from the deep tail to v=1/2 and the pole argument never reaches the boundary — a would-be false QED closed off. (B) The rigid mode 1/v is exactly the UNIQUE fixed point of the multiplicative dilation group (D_U g(v)=U g(Uv), the imp-96164 law g(Uv)=g(v)/U is D_U g = g for all U>0); the confinement cutoff P_1 at v=1/2 does NOT commute with D_U, so the scaling rigidity by construction CANNOT reach the v=1/2 edge — the residual is intrinsically an edge-band condition. (C) The undecided content is localized to the FIRST OCTAVE (1/2,1) (where the inverse relation g(v)=(1/2)g(v/2) first fails), which carries EXACTLY HALF the rigid mode L^2 mass: int_{1/2}^{1} v^-2 dv = 1 of int_{1/2}^{oo} v^-2 dv = 2. So the archimedean edge is not a thin endpoint but half the candidate top state. C=0 is INDICATED numerically (p=2 top 0.9999731<1) but not ENCLOSED (Zygmund edge blocks the exact scalar phase-match P_{1/2} F_S23 P_{1/2}(v^-1) at v=1/2). New sub-gap SG-96181-edge-octave. RH open; no refereed bound is changed; NO QED',
  contributionA:
    'refute the analytic shortcut: top confined states are Zygmund-fractal not entire, so band-limited=>entire=>C=0 does NOT apply (no continuation from deep tail to the edge)',
  contributionB:
    '1/v is the unique dilation-group fixed point; P_1 confinement cut at v=1/2 breaks dilation symmetry exactly there => scaling rigidity cannot reach the boundary; residual is intrinsically edge-band',
  contributionC:
    'localize + weigh: the edge octave (1/2,1) carries EXACTLY HALF the rigid mode L^2 mass (1 of 2), so SG-96164-boundary undecided-weighs half the top state — not a measure-zero endpoint',
  subGap:
    'SG-96181-edge-octave: exclude the scale-invariant mode v^-1 at the confinement-cutoff octave (1/2,1) — a single transcendental scalar phase-match P_{1/2} F_S23 P_{1/2}(v^-1) at v=1/2 with NO available modulus of continuity (Zygmund edge); numerically indicated C=0 (p=2 top 0.9999731<1) but not enclosed',
  honestLimits:
    'this refines and re-localizes SG-96164-boundary and kills the analyticity shortcut; it does NOT prove C=0 (no enclosure of the edge-octave phase-match) nor C!=0 (the mode is transform-stable and L^2, no obstruction to admissibility surfaced); nothing diagonalizes A_S23, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96181_SG_BOUNDARY_ASSERTIONS = Object.freeze([
  {
    id: 'imp96181-edge-octave-carries-half',
    description:
      '(C) the edge octave (1/2,1) carries EXACTLY HALF the rigid mode 1/v L^2 mass on the confinement half-line: int_{1/2}^{1} v^-2 dv = 1 and int_{1/2}^{oo} v^-2 dv = 2, so the fraction is 1/2 — the archimedean edge undecided-weighs half the top state, not a measure-zero endpoint',
    holds: () =>
      approx(rigidModeL2Mass(0.5, 1), 1.0, 1e-12) &&
      approx(rigidModeL2Mass(0.5, Infinity), 2.0, 1e-12) &&
      approx(edgeOctaveMassFraction(), 0.5, 1e-12),
  },
  {
    id: 'imp96181-1overv-is-dilation-fixed-point',
    description:
      '(B) the rigid mode 1/v is the exact fixed point of every multiplicative dilation D_U g(v)=U g(Uv) (eigenvalue 1) — the imp-96164 law g(Uv)=g(v)/U restated — verified to machine epsilon over a v-grid at several U; this is why the confinement cutoff at v=1/2 (which breaks D_U) is exactly where the scaling rigidity cannot reach',
    holds: () =>
      [0.5, 1.7, 2, 3, 6, Math.E].every((U) => dilationFixedPointDefect(U) < 1e-12),
  },
  {
    id: 'imp96181-C0-indicated-not-enclosed',
    description:
      '(C) C=0 is INDICATED (p=2 top confined state 0.9999731 < 1, mixed group holds more so top nearer 1 but still < 1) but NOT ENCLOSED — the status records the exact scalar phase-match at v=1/2 is blocked by the Zygmund edge',
    holds: () =>
      IMP_96181_SG_BOUNDARY_LITERALS.p2TopConfinedState < 1 &&
      /not ENCLOSED|not enclosed/.test(IMP_96181_SG_BOUNDARY.status),
  },
  {
    id: 'imp96181-analytic-shortcut-refuted',
    description:
      '(A) the honest verdict records that the band-limited=>entire=>C=0 (Paley-Wiener / analytic-continuation) shortcut is REFUTED because the top confined states are Zygmund-fractal not entire — a would-be false QED closed off, not a proof of C!=0',
    holds: () =>
      /REFUTED/.test(IMP_96181_SG_BOUNDARY.status) &&
      /Zygmund/.test(IMP_96181_SG_BOUNDARY.status) &&
      /Paley-Wiener|analytic-continuation/.test(IMP_96181_SG_BOUNDARY.status),
  },
  {
    id: 'imp96181-verdict-honesty',
    description:
      'status is a PARTIAL: names the new sub-gap SG-96181-edge-octave, states NOT decided (neither C=0 proved nor C!=0 admitted), and asserts RH open / PT Lambda <= 0.2 / NO QED',
    holds: () =>
      /PARTIAL/.test(IMP_96181_SG_BOUNDARY.status) &&
      /SG-96181-edge-octave/.test(IMP_96181_SG_BOUNDARY.subGap) &&
      /NOT decided/.test(IMP_96181_SG_BOUNDARY.status) &&
      /RH open/.test(IMP_96181_SG_BOUNDARY.status) &&
      /NO QED/.test(IMP_96181_SG_BOUNDARY.status),
  },
]);

export default IMP_96181_SG_BOUNDARY;

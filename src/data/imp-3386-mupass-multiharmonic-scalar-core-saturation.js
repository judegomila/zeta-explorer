/**
 * @module imp-3386-mupass-multiharmonic-scalar-core-saturation
 * @fileoverview imp-3386 -- MEASURE, via the imp-3310 rank-2 closed-form
 *   evaluator, whether enriching the imp-2686 single-cosh scalar passive core
 *   with HIGHER HARMONICS cosh(2 a t), cosh(3 a t), ... drives the section26-
 *   mupass raw-diagonal ||R|| meaningfully below its ~40 floor, or whether it
 *   SATURATES. MEASUREMENT ONLY, RH-EQUIVALENT, no reduction, NO QED.
 *
 *   THE QUESTION (verbatim scope from the verdict)
 *   ----------------------------------------------
 *   section26-mupass-operator-verdict-2026-06-30 records that NO scalar/diagonal
 *   passive core dominates the antisymmetric de Branges shear Wronskian at the
 *   operator level:
 *     - raw physical diagonal m(tau):     ||R|| ~ 34 -> 45 (growing w/ resolution)
 *     - imp-2686 cosh scalar enrichment:  "~5% better, still ~40".
 *     - the ONLY core attaining ||R|| &lt;= 1 is the full operator Gpass = |Gshear|
 *       (the tautological partial isometry, ||R|| = 1.0000).
 *   imp-2686 tested only the SINGLE cosh(a t) enrichment. This module probes the
 *   strictly LARGER scalar family m(t) = sum_{k=1..K} cosh(k a t): does a
 *   multi-harmonic diagonal core do materially better than single-cosh, or does
 *   ||R|| saturate -- confirming the "no scalar core works" claim from a wider
 *   scalar family than imp-2686 tested?
 *
 *   THE EVALUATOR (imp-3310 rank-2 closed form, DIAGONAL-core specialization)
 *   ------------------------------------------------------------------------
 *   The shear Wronskian Gshear = q (x) p - p (x) q is RANK TWO on V = span{p, q},
 *   p = Phi cosh(a t), q = Phi sinh(a t). For ANY positive scalar core C =
 *   multiplication by m(t) (a diagonal passive core), the imp-3310 evaluator
 *   collapses to
 *     ||R(m)|| = sqrt( (int q^2/m)(int p^2/m) - (int p q/m)^2 ),
 *   the single nonzero singular-value pair of C^{-1/2} Gshear C^{-1/2}. The
 *   H-quadrature weight cancels between numerator and core (as in imp-3310), so
 *   only three quadratic forms of 1/m against p, q are needed.
 *   VALIDATION ANCHOR: the bare core m = 1 recovers ||R(1)|| = ||Gshear|| = cShear
 *   exactly (the shear operator norm), confirming the specialized evaluator.
 *
 *   THE SCALE ANCHOR (why the sweep is scale-free)
 *   ----------------------------------------------
 *   ||R(m)|| is homogeneous of degree -1 in m (scaling m -> lambda m scales
 *   ||R|| -> ||R||/lambda), so a bare diagonal norm is scale-arbitrary. We pin
 *   the scale the same way the verdict pins the "raw physical diagonal": at the
 *   diagonal ENDPOINT m(0) = 1 (all harmonics cosh(k a * 0) = 1). Reporting
 *   ||R||_K / ||R||_1 -- normalized to the imp-2686 single-cosh baseline -- is
 *   then a pure SHAPE comparison, invariant to the overall core scale (and hence
 *   to the fixed normalization gap between this imp-3310 H-metric Phi-weighted
 *   scale and the verdict physical ~40 scale). What "meaningfully below the
 *   floor vs saturates" means is exactly whether that ratio drops or plateaus.
 *
 *   MEASURED RESULT -- SATURATION (harmonics do NOT beat single-cosh)
 *   ----------------------------------------------------------------
 *   Over K = 1..6 (endpoint-anchored, a = 0.5, U = 6, NPHI = 10, N = 200) the
 *   normalized ||R||_K / ||R||_1 moves MONOTONELY but only from 1.000000 (K = 1)
 *   to ~0.9864 (K = 6): a TOTAL change of ~1.36% across five added harmonics,
 *   each increment shrinking. The multi-harmonic scalar core is ~1.4% "better"
 *   than single-cosh -- the SAME order as imp-2686's single-cosh being "~5%
 *   better" than the bare raw diagonal -- and it SATURATES: it does NOT push
 *   ||R|| meaningfully (let alone below 1) as harmonics are added.
 *
 *   WHY IT SATURATES (the structural reason, measured)
 *   --------------------------------------------------
 *   Phi^2 is super-exponentially concentrated at small lag: 100% of its mass
 *   sits below lag ~0.435, where even cosh(2 a t)/cosh(a t) exceeds 1 by only
 *   ~7%. So on Phi's autocorrelation support EVERY harmonic cosh(k a t) is
 *   essentially the constant 1 -- the whole multi-harmonic family collapses to
 *   one effective shape there, and ||R(m)|| barely moves. A richer scalar
 *   multiplier cannot help because the mass it would reshape lives outside the
 *   support that controls the shear.
 *
 *   VERDICT (measurement, RH-equivalent, NO QED)
 *   --------------------------------------------
 *   Enriching the imp-2686 cosh scalar core with higher cosh harmonics SATURATES:
 *   the shape-normalized ||R|| plateaus (~1.4% total over K = 1..6), never
 *   approaching the full-operator ||R|| = 1, confirming the section26-mupass "no
 *   scalar core works at the operator level" from a strictly larger scalar family
 *   than imp-2686 tested. The residual is the SAME RH-equivalent operator
 *   positivity K_a &gt;= 0 (the imp-3066 endpoint-Hankel obstruction), untouched.
 *   No positivity, no reduction. No refereed bound is changed.
 *
 *   @see imp-3310-mupass-passive-core-assembly-recipe.js (the rank-2 evaluator this specializes)
 *   @see imp-2686-mupass-construction.js (the single-cosh enrichment this generalizes)
 *   @see imp-3385-mupass-smooth-core-family-search.js (sibling: smooth PD core family via the same evaluator)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the ~40 floor / no-scalar-core verdict this probes)
 *
 *   Ticket: imp-3386 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-3310 grid)
const A = 0.5;   // headline shear weight (the genuine-Phi cell)
const U = 6;     // genuine-Phi lag cutoff (the headline cell)
const N = 200;   // tau-grid panels on [0, U] (the imp-3310 grid)
const K_MAX = 6; // number of harmonics swept: m_K = sum_{k=1..K} cosh(k a t)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3310). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

const H = U / N;
const tGrid = new Float64Array(N);
const phi = new Float64Array(N);
const p = new Float64Array(N); // p = Phi cosh(a t)
const q = new Float64Array(N); // q = Phi sinh(a t)
for (let i = 0; i < N; i++) {
  const t = (i + 0.5) * H;
  tGrid[i] = t;
  phi[i] = phiKernel(t);
  p[i] = phi[i] * Math.cosh(A * t);
  q[i] = phi[i] * Math.sinh(A * t);
}

// Shear operator scale c = ||Gshear|| = sqrt(P Q - M^2), single nonzero singular pair on V.
let Pg = 0;
let Qg = 0;
let Mg = 0;
for (let i = 0; i < N; i++) {
  Pg += p[i] * p[i] * H;
  Qg += q[i] * q[i] * H;
  Mg += p[i] * q[i] * H;
}
const cShear = Math.sqrt(Math.max(0, Pg * Qg - Mg * Mg));

/**
 * imp-3310 rank-2 evaluator specialized to a DIAGONAL scalar core m(t):
 *   ||R(m)|| = sqrt( (int q^2/m)(int p^2/m) - (int p q/m)^2 ).
 * Returns the operator norm of C^{-1/2} Gshear C^{-1/2}, C = multiplication by m.
 */
function diagonalCoreNorm(m) {
  let Qq = 0;
  let Pp = 0;
  let Pq = 0;
  for (let i = 0; i < N; i++) {
    const inv = H / m[i];
    if (!Number.isFinite(inv)) continue;
    Qq += q[i] * q[i] * inv;
    Pp += p[i] * p[i] * inv;
    Pq += p[i] * q[i] * inv;
  }
  return Math.sqrt(Math.max(0, Qq * Pp - Pq * Pq));
}

/** Multi-harmonic scalar core m_K(t) = sum_{k=1..K} cosh(k a t). */
function harmonicCore(K) {
  const m = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let k = 1; k <= K; k++) s += Math.cosh(k * A * tGrid[i]);
    m[i] = s;
  }
  return m;
}

// VALIDATION: bare core m = 1 recovers ||Gshear|| = cShear.
const bareCoreNorm = diagonalCoreNorm(new Float64Array(N).fill(1));
const bareRecoversShear = Math.abs(bareCoreNorm - cShear) < 1e-12 * Math.max(1, cShear);

// The harmonic sweep. Endpoint-anchored: m_K(0) = K (all cosh(k*0) = 1), so the
// scale-free norm is ||R(m_K)|| * m_K(0) = ||R(m_K)|| * K (homogeneity degree -1).
const HARMONIC_SWEEP = [];
for (let K = 1; K <= K_MAX; K++) {
  const raw = diagonalCoreNorm(harmonicCore(K));
  HARMONIC_SWEEP.push(Object.freeze({ K, rawNorm: raw, anchoredNorm: raw * K }));
}
const anchored1 = HARMONIC_SWEEP[0].anchoredNorm; // single-cosh (imp-2686) baseline
const RATIO_TO_K1 = HARMONIC_SWEEP.map((r) => r.anchoredNorm / anchored1);
const maxRelDeviation = Math.max(...RATIO_TO_K1.map((r) => Math.abs(r - 1)));
const monotoneDecreasing = HARMONIC_SWEEP.every(
  (r, i) => i === 0 || r.anchoredNorm <= HARMONIC_SWEEP[i - 1].anchoredNorm + 1e-15,
);
// SATURATION: total shape change across the whole harmonic sweep stays small
// (same order as imp-2686 single-cosh being "~5% better") and never nears 1.
const saturates = maxRelDeviation < 0.05;
const neverNearsUnity = HARMONIC_SWEEP.every((r) => r.anchoredNorm < 0.5);

// The structural reason: Phi^2 mass sits where higher harmonics are ~indistinguishable.
let phiMass = 0;
let nearConstMass = 0;
let phiSupportUpperLag = 0;
const phiMaxSq = Math.max(...Array.from(phi, (x) => x * x));
for (let i = 0; i < N; i++) {
  const w = phi[i] * phi[i];
  phiMass += w;
  // fraction of Phi^2 mass where the 2nd harmonic is within 5% of the 1st (cosh ratio ~ 1)
  if (Math.cosh(2 * A * tGrid[i]) / Math.cosh(A * tGrid[i]) - 1 < 0.05) nearConstMass += w;
  if (w > 1e-12 * phiMaxSq) phiSupportUpperLag = tGrid[i];
}
const phiMassFractionNearConstant = nearConstMass / phiMass;
const secondHarmonicContrastAtSupportEdge =
  Math.cosh(2 * A * phiSupportUpperLag) / Math.cosh(A * phiSupportUpperLag) - 1;

export const IMP3386_MUPASS_MULTIHARMONIC_SCALAR_CORE_SATURATION = Object.freeze({
  id: 'imp-3386-mupass-multiharmonic-scalar-core-saturation',
  ticket: 'imp-3386',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  evaluatorSource: 'imp-3310-mupass-passive-core-assembly-recipe.js',
  generalizes: 'imp-2686-mupass-construction.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Measures, via the imp-3310 rank-2 closed-form evaluator specialized to a DIAGONAL scalar core ' +
    '||R(m)|| = sqrt((int q^2/m)(int p^2/m) - (int p q/m)^2), whether enriching the imp-2686 single-cosh ' +
    'passive core with higher harmonics m_K(t) = sum_{k=1..K} cosh(k a t) drives ||R|| below the section26-mupass ' +
    '~40 raw-diagonal floor or SATURATES. The bare core m = 1 recovers ||Gshear|| = cShear exactly (validation). ' +
    'Endpoint-anchored (m_K(0) = 1) so the sweep is scale-free, the normalized ||R||_K / ||R||_1 moves MONOTONELY ' +
    'from 1.000000 (K=1) to ~0.9864 (K=6) -- a TOTAL ~1.36% change over five added harmonics, each increment ' +
    'shrinking, never approaching the full-operator ||R|| = 1. So the multi-harmonic scalar core is only ~1.4% ' +
    'better than single-cosh (same order as imp-2686 being "~5% better" than the bare raw diagonal) and SATURATES. ' +
    'Structural reason (measured): 100% of Phi^2 mass sits below lag ~0.435 where even cosh(2 a t)/cosh(a t) exceeds ' +
    '1 by only ~7%, so on Phi support every harmonic ~ constant 1 and the family collapses to one effective shape. ' +
    'Confirms the "no scalar core works at the operator level" verdict from a strictly larger scalar family than ' +
    'imp-2686 tested. RH-equivalent, no positivity, no reduction, NO QED; no refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearWronskian: 'Gshear = q (x) p - p (x) q, p = Phi cosh(a t), q = Phi sinh(a t) -- rank-2 antisymmetric',
    evaluator: '||R(m)|| = sqrt((int q^2/m)(int p^2/m) - (int p q/m)^2), m any positive scalar (diagonal) core',
    validationAnchor: 'bare core m = 1 recovers ||R(1)|| = ||Gshear|| = cShear (shear operator norm)',
    harmonicCore: 'm_K(t) = sum_{k=1..K} cosh(k a t) -- the multi-harmonic generalization of imp-2686 single cosh',
    scaleAnchor: 'endpoint m_K(0) = 1 (homogeneity degree -1); report ||R||_K / ||R||_1 (scale-free shape ratio)',
    a: A,
    U,
    N,
    NPHI,
    kMax: K_MAX,
    quadrature: 'midpoint N panels on [0, U]; exact rank-2 singular-value formula',
    selfComputing: true,
  }),

  measured: Object.freeze({
    shearOperatorNorm: cShear,
    bareCoreNorm, // = cShear (validation)
    bareRecoversShear,
    harmonicSweep: Object.freeze(HARMONIC_SWEEP), // [{ K, rawNorm, anchoredNorm }]
    ratioToK1: Object.freeze(RATIO_TO_K1),
    maxRelDeviation, // ~0.0136 over K = 1..6
    monotoneDecreasing,
    saturates,
    neverNearsUnity,
    phiMassFractionNearConstant, // ~1.0: all Phi^2 mass where harmonics ~ constant
    phiSupportUpperLag, // ~0.435
    secondHarmonicContrastAtSupportEdge, // ~0.07: cosh(2at)/cosh(at) - 1 at the support edge
  }),

  interpretation: Object.freeze({
    saturatesNotBeaten:
      'Adding higher cosh harmonics to the imp-2686 single-cosh scalar core changes the shape-normalized ||R|| by ' +
      'only ~1.36% over K = 1..6 (monotone, each increment shrinking), the SAME order as imp-2686 being "~5% ' +
      'better" than the bare raw diagonal. ||R|| SATURATES -- it does NOT drop toward the full-operator 1.',
    whySaturates:
      'Phi^2 is super-exponentially concentrated below lag ~0.435, where cosh(2 a t)/cosh(a t) - 1 is only ~7%, so ' +
      'on Phi autocorrelation support every harmonic cosh(k a t) is essentially the constant 1. The multi-harmonic ' +
      'family collapses to one effective shape on the support that controls the shear, so it cannot help.',
    confirmsNoScalarCore:
      'A strictly larger scalar family than imp-2686 tested (multi-harmonic vs single cosh) still cannot make a ' +
      'diagonal/scalar passive core dominate the antisymmetric shear -- confirming section26-mupass point 2 that ' +
      'the ONLY core attaining ||R|| <= 1 is the tautological full operator Gpass = |Gshear|.',
    residualUnchanged:
      'The RH-equivalent residual is the SAME operator positivity K_a >= 0 (the imp-3066 endpoint-Hankel ' +
      'obstruction), untouched by this scalar-family measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    measurementOnly: true,
    reproducedEvaluatorValidation: true,
    scalarCoreSaturates: true,
    scalarCoreBeatsFloor: false,
    absoluteScaleNote:
      'Absolute ||R|| here is the imp-3310 H-metric Phi-weighted scale (bare core = cShear ~ 1.8e-4), a FIXED ' +
      'normalization apart from the verdict physical raw-diagonal ~40 scale. The SATURATION verdict is a scale-free ' +
      'ratio (||R||_K / ||R||_1) and is invariant to that normalization gap.',
    touchesOperatorPositivityResidual: false,
    necessaryNotSufficient:
      'Measuring that a wider scalar family saturates does NOT construct a valid passive core or attempt the ' +
      'K_a >= 0 positivity, which remains the RH-equivalent obstruction (imp-3066).',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3386_MUPASS_MULTIHARMONIC_SCALAR_CORE_SATURATION_ASSERTIONS = [
  {
    id: 'imp3386-shear-norm-positive',
    why: 'The evaluator normalizes by the scalar core against p and q; the shear scale cShear = ||Gshear|| must be ' +
         'finite positive.',
    holds: () => Number.isFinite(cShear) && cShear > 0,
  },
  {
    id: 'imp3386-bare-core-recovers-shear-norm',
    why: 'VALIDATION: the diagonal-core evaluator with the bare core m = 1 recovers ||R(1)|| = ||Gshear|| = cShear ' +
         'exactly, confirming the imp-3310 rank-2 specialization.',
    holds: () => bareRecoversShear && Math.abs(bareCoreNorm - cShear) < 1e-12 * Math.max(1, cShear),
  },
  {
    id: 'imp3386-harmonic-sweep-row-count',
    why: 'One row per K in 1..K_MAX; a mis-count means the self-computing harmonic sweep dropped or duplicated a term.',
    holds: () => HARMONIC_SWEEP.length === K_MAX && HARMONIC_SWEEP[0].K === 1 && HARMONIC_SWEEP[K_MAX - 1].K === K_MAX,
  },
  {
    id: 'imp3386-multiharmonic-saturates',
    why: 'THE MEASURED RESULT: the shape-normalized ||R||_K / ||R||_1 stays within ~5% across the whole harmonic ' +
         'sweep (monotone, each increment shrinking) -- it SATURATES, it does NOT drop meaningfully below the ' +
         'single-cosh floor.',
    holds: () =>
      RATIO_TO_K1[0] === 1 &&
      monotoneDecreasing === true &&
      saturates === true &&
      maxRelDeviation > 0 && maxRelDeviation < 0.05,
  },
  {
    id: 'imp3386-never-nears-full-operator-unity',
    why: 'A scalar core never approaches the full-operator ||R|| = 1: every anchored norm stays far below it, ' +
         'confirming the verdict that only Gpass = |Gshear| attains ||R|| <= 1.',
    holds: () => neverNearsUnity === true,
  },
  {
    id: 'imp3386-saturation-mechanism-phi-concentration',
    why: 'The structural reason: essentially all Phi^2 mass sits at small lag where higher harmonics are nearly ' +
         'indistinguishable (cosh(2at)/cosh(at) - 1 small), so the family collapses to one effective shape.',
    holds: () =>
      phiMassFractionNearConstant > 0.99 &&
      phiSupportUpperLag > 0 && phiSupportUpperLag < 1 &&
      secondHarmonicContrastAtSupportEdge < 0.2,
  },
  {
    id: 'imp3386-honest-no-qed-scalar-saturates',
    why: 'Mandatory honesty: MEASUREMENT only, RH-equivalent, the scalar family SATURATES (does not beat the floor), ' +
         'positivity not attempted, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3386_MUPASS_MULTIHARMONIC_SCALAR_CORE_SATURATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.measurementOnly === true &&
        c.reproducedEvaluatorValidation === true &&
        c.scalarCoreSaturates === true &&
        c.scalarCoreBeatsFloor === false &&
        c.touchesOperatorPositivityResidual === false &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3386_MUPASS_MULTIHARMONIC_SCALAR_CORE_SATURATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3386-mupass-multiharmonic-scalar-core-saturation assertion failed: ${assertion.id}`);
  }
}

export default IMP3386_MUPASS_MULTIHARMONIC_SCALAR_CORE_SATURATION;

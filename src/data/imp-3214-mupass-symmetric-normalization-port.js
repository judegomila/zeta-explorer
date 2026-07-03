/**
 * @module imp-3214-mupass-symmetric-normalization-port
 * @fileoverview imp-3214 -- Port/re-derive the section26-mupass SYMMETRIC
 *   partial-isometry normalization R = Gpass^{-1/2} Gshear Gpass^{-1/2} in-repo
 *   and ASSESS whether the reproducible in-repo path anchors the verdict scalars
 *   ||R|| = 0.876 (lag &lt;= 0.2) and 0.711 (lag &lt;= 0.40), or measure the residual.
 *
 *   CONTEXT
 *   -------
 *   imp-3202-mupass-bridge-lag-cutoff-sweep names an OPEN, NAMED sub-gap: it
 *   reproduces only the in-repo lag-cutoff CAPTURE knee, while the exact verdict
 *   scalars ||R|| = 0.876 / 0.711 are the SYMMETRICALLY-NORMALIZED partial-isometry
 *   norm ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| whose Gpass^{-1/2} core-normalization
 *   machinery was NOT checked into the repo. This module ports the symmetric
 *   normalization functional calculus in-repo and measures what the in-repo path
 *   delivers against the two verdict anchors.
 *
 *   THE SHEAR WRONSKIAN IS RANK TWO -- EXACT 2x2 REDUCTION
 *   -----------------------------------------------------
 *   The genuine shear Gram is the antisymmetric de Branges Wronskian
 *     Gshear(u, v) = q(u) p(v) - p(u) q(v),   p = Phi cosh(a t),  q = Phi sinh(a t).
 *   As an operator Gshear = q (x) p - p (x) q is RANK TWO, supported on the 2D
 *   subspace V = span{p, q}. In the weighted inner product with Gram entries
 *     P = &lt;p,p&gt;,  Q = &lt;q,q&gt;,  M = &lt;p,q&gt;
 *   an orthonormal basis of V puts Gshear in the closed form
 *     [Gshear]_V = [[0, -c], [c, 0]],   c = sqrt(P Q - M^2) = ||Gshear||.
 *   Then |Gshear| = sqrt(Gshear^* Gshear) = c * P_V, so the FULL passive core
 *   Gpass = |Gshear| gives the symmetric normalization EXACTLY:
 *     R = Gpass^{-1/2} Gshear Gpass^{-1/2} = (1/c) [Gshear]_V,   ||R|| = 1.0000.
 *   This IS the verdict tautology "the only core attaining ||R|| &lt;= 1 is
 *   Gpass = |Gshear|, which gives ||R|| = 1.0000 EXACTLY (partial isometry)" --
 *   now DERIVED and reproduced in-repo, not asserted from out-of-repo output. The
 *   symmetric Gpass^{-1/2} functional calculus is the ported half of the sub-gap.
 *
 *   WHAT ANCHORS 0.876 / 0.711 -- AND WHAT DOES NOT
 *   -----------------------------------------------
 *   The verdict reads 0.876 -&gt; 0.711 as DECREASING toward the full-core ceiling
 *   1.0000 as the lag cutoff GROWS. A norm that decreases as more near-diagonal
 *   mass is included and saturates below the full-core value can only come from
 *   truncating the CORE assembly Gpass_c (more bridge mass = better domination =
 *   smaller ||R||), NOT from truncating the numerator Gshear. We measure the
 *   opposite (numerator-truncation) candidate to make the distinction concrete:
 *     R_c^num = Gpass^{-1/2} (P_V Gshear_c P_V) Gpass^{-1/2},   Gshear_c = band |u-v| &lt;= c,
 *   whose norm is ||P_V Gshear_c P_V|| / c. This rises toward the tautological 1.0
 *   as c grows (0.985 at lag 0.2, 1.000 at lag 0.40), NOT down to 0.711 -- so the
 *   numerator-truncation reading is RULED OUT, localizing the residual precisely.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   PORTED: the symmetric partial-isometry normalization functional calculus
 *   R = Gpass^{-1/2} Gshear Gpass^{-1/2}, reproducing the full-core anchor
 *   ||R|| = 1.0000 EXACTLY in-repo via the rank-2 reduction. RESIDUAL (sharpened):
 *   the exact scalars 0.876 / 0.711 require the specific out-of-repo PASSIVE-CORE
 *   ASSEMBLY recipe -- which near-diagonal bridge mass, at which lags, with what
 *   sign/weight, builds Gpass_c -- which is a different object from the functional
 *   calculus and remains un-ported. The un-ported half is now the core-assembly
 *   recipe, not the Gpass^{-1/2} machinery. RH-equivalent residual untouched;
 *   Platt-Trudgian Lambda &lt;= 0.2 stays SOTA. No reduction, no positivity, no QED.
 *
 *   @see imp-3202-mupass-bridge-lag-cutoff-sweep.js (the sibling that named this sub-gap)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose ||R||=1.0000 tautology this derives)
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the lag-stationary surrogate sibling)
 *
 *   Ticket: imp-3214 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]

// The two verdict anchors we assess the in-repo path against.
const VERDICT_R_020 = 0.876; // lag <= 0.2  -> ||R|| in the section26 verdict
const VERDICT_R_040 = 0.711; // lag <= 0.40 -> ||R|| saturation in the verdict

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3202 / imp-3197). */
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
const u = new Array(N);
const phi = new Array(N);
const p = new Array(N); // p = Phi cosh(a t)
const q = new Array(N); // q = Phi sinh(a t)
for (let i = 0; i < N; i++) {
  u[i] = (i + 0.5) * H;
  phi[i] = phiKernel(u[i]);
  p[i] = phi[i] * Math.cosh(A * u[i]);
  q[i] = phi[i] * Math.sinh(A * u[i]);
}

// Weighted Gram entries of the rank-2 span V = span{p, q} (midpoint weight H).
let P = 0;
let Q = 0;
let Mpq = 0;
for (let i = 0; i < N; i++) {
  P += p[i] * p[i] * H;
  Q += q[i] * q[i] * H;
  Mpq += p[i] * q[i] * H;
}

// ||Gshear|| = sqrt(P Q - M^2): the single nonzero singular value pair of the
// rank-2 antisymmetric Wronskian. This is the full-core normalization scale c.
const cShear = Math.sqrt(Math.max(0, P * Q - Mpq * Mpq));

// Orthonormal basis of V: e1 = p / sqrt(P); e2 = (q - (M/P) p) / s, s = sqrt(Q - M^2/P).
const sqrtP = Math.sqrt(P);
const sPerp = Math.sqrt(Math.max(0, Q - (Mpq * Mpq) / P));
const e1 = new Float64Array(N);
const e2 = new Float64Array(N);
for (let i = 0; i < N; i++) {
  e1[i] = p[i] / sqrtP;
  e2[i] = (q[i] - (Mpq / P) * p[i]) / sPerp;
}

/** Top singular value of a 2x2 matrix m = [[a,b],[c,d]]. */
function svMax2(m) {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  const t = a * a + b * b + c * c + d * d;
  const det = a * d - b * c;
  const disc = Math.sqrt(Math.max(0, t * t - 4 * det * det));
  return Math.sqrt((t + disc) / 2);
}

/**
 * Compression of the lag-truncated shear onto V in the orthonormal basis {e1, e2}:
 *   (P_V Gshear_c P_V)_{ab} = H^2 sum_{|i-j| &lt;= band} e_a(i) (q_i p_j - p_i q_j) e_b(j).
 * Gshear_c keeps the near-diagonal band |u - v| &lt;= cutoff of the rank-2 Wronskian.
 */
function compressBand(cutoff) {
  const band = Math.floor(cutoff / H + 1e-12);
  const m = [
    [0, 0],
    [0, 0],
  ];
  for (let i = 0; i < N; i++) {
    const lo = Math.max(0, i - band);
    const hi = Math.min(N - 1, i + band);
    for (let j = lo; j <= hi; j++) {
      const g = q[i] * p[j] - p[i] * q[j];
      m[0][0] += e1[i] * g * e1[j];
      m[0][1] += e1[i] * g * e2[j];
      m[1][0] += e2[i] * g * e1[j];
      m[1][1] += e2[i] * g * e2[j];
    }
  }
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) m[a][b] *= H * H;
  return m;
}

// Symmetric normalization with the FULL core Gpass = |Gshear| = c P_V:
//   ||R_c^num|| = ||P_V Gshear_c P_V|| / c  (numerator-truncation candidate).
function symmetricNormNumeratorTruncated(cutoff) {
  return cShear > 0 ? svMax2(compressBand(cutoff)) / cShear : 0;
}

// The full-core symmetric normalization (cutoff = U covers everything): this is the
// ported ||R|| = 1.0000 tautology, derived analytically and checked numerically.
const fullCoreNorm = symmetricNormNumeratorTruncated(U);

// The numerator-truncation candidate at the two verdict anchors.
const candAt020 = symmetricNormNumeratorTruncated(0.2);
const candAt040 = symmetricNormNumeratorTruncated(0.4);

// Measured residual discrepancy vs the verdict scalars (the requested assessment).
const discrepancy020 = candAt020 - VERDICT_R_020;
const discrepancy040 = candAt040 - VERDICT_R_040;

// Does the in-repo numerator-truncation path reproduce the verdict to tolerance?
const REPRO_TOL = 0.02; // stated tolerance for "reproduces the verdict scalar"
const reproducesVerdict =
  Math.abs(discrepancy020) <= REPRO_TOL && Math.abs(discrepancy040) <= REPRO_TOL;

export const IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT = Object.freeze({
  id: 'imp-3214-mupass-symmetric-normalization-port',
  ticket: 'imp-3214',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSubgap: 'imp-3202-mupass-bridge-lag-cutoff-sweep.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Ports the section26-mupass SYMMETRIC partial-isometry normalization ' +
    'R = Gpass^{-1/2} Gshear Gpass^{-1/2} in-repo. Because the shear Wronskian ' +
    'Gshear = q(x)p - p(x)q is RANK TWO (span{p,q}, p = Phi cosh(a t), q = Phi ' +
    'sinh(a t)), the functional calculus reduces EXACTLY to a 2x2 problem: in an ' +
    'orthonormal basis [Gshear]_V = [[0,-c],[c,0]] with c = sqrt(PQ - M^2) = ' +
    '||Gshear||, so the full core Gpass = |Gshear| = c P_V gives ||R|| = 1.0000 ' +
    'EXACTLY -- the verdict tautology, now DERIVED and reproduced in-repo. ' +
    'ASSESSMENT vs the two verdict anchors: the numerator-truncation candidate ' +
    '||P_V Gshear_c P_V|| / c rises toward the tautological 1.0 (0.985 at lag ' +
    '0.2, 1.000 at lag 0.40), NOT down to the verdict 0.876 / 0.711, so it does ' +
    'NOT reproduce those scalars. The verdict pair DECREASES toward the full-core ' +
    'ceiling as the cutoff grows, which can only come from truncating the CORE ' +
    'assembly Gpass_c (more near-diagonal mass = better domination), not the ' +
    'numerator. SHARPENED RESIDUAL: the Gpass^{-1/2} functional calculus is now ' +
    'ported; the un-ported half is the out-of-repo passive-core ASSEMBLY recipe ' +
    '(which lag-band mass, sign, weight). RH-equivalent, NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearWronskian: 'Gshear(u,v) = q(u)p(v) - p(u)q(v), p = Phi cosh(a t), q = Phi sinh(a t) -- rank-2 antisymmetric',
    rank2Gram: 'P = <p,p>, Q = <q,q>, M = <p,q> in the midpoint-weighted inner product on [0,U]',
    shearNorm: '||Gshear|| = c = sqrt(P Q - M^2), the single nonzero singular value pair on V = span{p,q}',
    fullCore: 'Gpass = |Gshear| = c P_V, so R = Gpass^{-1/2} Gshear Gpass^{-1/2} = (1/c) [Gshear]_V, ||R|| = 1',
    numeratorTruncationCandidate: 'R_c^num = Gpass^{-1/2} (P_V Gshear_c P_V) Gpass^{-1/2}, ||.|| = ||P_V Gshear_c P_V|| / c',
    a: A,
    U,
    N,
    quadrature: 'midpoint, N panels on [0, U]; exact 2x2 functional calculus on the rank-2 span',
    selfComputing: true,
  }),

  measured: Object.freeze({
    shearOperatorNorm: cShear, // c = ||Gshear||
    gramP: P,
    gramQ: Q,
    gramM: Mpq,
    fullCoreSymmetricNorm: fullCoreNorm, // ported ||R|| = 1.0000 tautology (full core Gpass = |Gshear|)
    candidateNormAt020: candAt020, // numerator-truncation candidate at the lag <= 0.2 anchor
    candidateNormAt040: candAt040, // numerator-truncation candidate at the lag <= 0.40 anchor
    verdictR020: VERDICT_R_020,
    verdictR040: VERDICT_R_040,
    discrepancyAt020: discrepancy020, // candidate - verdict at lag <= 0.2
    discrepancyAt040: discrepancy040, // candidate - verdict at lag <= 0.40
    reproTol: REPRO_TOL,
    reproducesVerdict, // false: numerator-truncation path does NOT anchor 0.876 / 0.711
  }),

  interpretation: Object.freeze({
    functionalCalculusPorted:
      'The symmetric Gpass^{-1/2} partial-isometry normalization is now in-repo: the rank-2 structure of ' +
      'Gshear reduces R = Gpass^{-1/2} Gshear Gpass^{-1/2} to an exact 2x2 problem, reproducing the full-core ' +
      'anchor ||R|| = 1.0000 exactly. This is the ported half of the imp-3202 sub-gap.',
    numeratorTruncationRuledOut:
      'The numerator-truncation reading (truncate Gshear, keep the full core) gives ||R|| RISING toward the ' +
      'tautological 1.0 (0.985 at lag 0.2, 1.000 at lag 0.40), not the verdict 0.876 / 0.711. The verdict pair ' +
      'DECREASES toward the full-core ceiling as the cutoff grows, so the cutoff acts on the CORE assembly, not ' +
      'the numerator -- ruling out the simplest reading and localizing the residual.',
    residualIsCoreAssemblyRecipe:
      'What remains un-ported is no longer the Gpass^{-1/2} functional calculus (ported here) but the specific ' +
      'out-of-repo PASSIVE-CORE ASSEMBLY recipe: which near-diagonal bridge mass, at which lags, with what sign ' +
      'and weight, builds Gpass_c such that ||Gpass_c^{-1/2} Gshear Gpass_c^{-1/2}|| = 0.876 / 0.711.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    portedSymmetricFunctionalCalculus: true,
    reproducesVerdictScalarValues: false,
    coreAssemblyRecipeStillOutOfRepo: true,
    didNotAttemptPositivity: true,
    necessaryNotSufficient:
      'Porting the symmetric normalization functional calculus reproduces the full-core ||R|| = 1.0000 tautology ' +
      'and rules out the numerator-truncation reading of 0.876 / 0.711, but does NOT construct the passive-core ' +
      'assembly recipe or attempt the K_a >= 0 positivity, which remains the RH-equivalent obstruction.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT_ASSERTIONS = [
  {
    id: 'imp3214-shear-norm-positive',
    why: 'The symmetric normalization divides by c = ||Gshear||; it must be a finite positive operator norm.',
    holds: () => Number.isFinite(cShear) && cShear > 0,
  },
  {
    id: 'imp3214-full-core-tautology-reproduced',
    why: 'THE PORTED ANCHOR: the full core Gpass = |Gshear| = c P_V gives the symmetric partial-isometry norm ' +
         '||R|| = 1.0000 exactly (the verdict tautology), reproduced in-repo via the rank-2 reduction.',
    holds: () => Math.abs(fullCoreNorm - 1) < 1e-6,
  },
  {
    id: 'imp3214-numerator-truncation-does-not-anchor-verdict',
    why: 'THE MEASURED RESIDUAL: the numerator-truncation candidate rises toward the tautological 1.0 (0.985 at ' +
         'lag 0.2, 1.000 at lag 0.40), NOT down to the verdict 0.876 / 0.711, so it does NOT reproduce those ' +
         'scalars -- the verdict cutoff acts on the CORE assembly, not the numerator.',
    holds: () =>
      reproducesVerdict === false &&
      Math.abs(discrepancy020) > REPRO_TOL &&
      Math.abs(discrepancy040) > REPRO_TOL &&
      candAt040 >= candAt020 - 1e-9,
  },
  {
    id: 'imp3214-candidate-bounded-by-tautology',
    why: 'The numerator-truncation candidate is a compression of Gshear normalized by the full-core scale, so it ' +
         'cannot exceed the tautological ceiling 1.0 (up to rounding).',
    holds: () => candAt020 > 0 && candAt020 <= 1 + 1e-6 && candAt040 <= 1 + 1e-6,
  },
  {
    id: 'imp3214-honest-no-qed-no-scalar-reproduction',
    why: 'Mandatory honesty: functional calculus ported, but the verdict 0.876 / 0.711 are NOT reproduced ' +
         '(core-assembly recipe out-of-repo); ASSESSMENT only, RH-equivalent, positivity not attempted, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.portedSymmetricFunctionalCalculus === true &&
        c.reproducesVerdictScalarValues === false &&
        c.coreAssemblyRecipeStillOutOfRepo === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3214-mupass-symmetric-normalization-port assertion failed: ${assertion.id}`);
  }
}

export default IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT;

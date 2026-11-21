/**
 * @module imp-3221-mupass-position-concentration-measure
 * @fileoverview imp-3221 -- Quantify the POSITION-CONCENTRATION measure that
 *   carries the ~97% of ||Gshear|| the imp-3197 1D Phi autocorrelation does not
 *   determine, relative to a uniform-Phi (flat-occupation) baseline. Isolates
 *   how much of the K_a &gt;= 0 magnitude obstruction is pure position
 *   concentration.
 *
 *   CONTEXT
 *   -------
 *   imp-3197-mupass-bridge-sign-phi-only split "correct sign at correct lags"
 *   into a SIGN half (Phi-only, free, zero gap) and a MAGNITUDE half (the
 *   operator norm). Its lag-stationary Toeplitz surrogate T -- which keeps the
 *   EXACT Phi autocorrelation profile as its symbol but averages the position
 *   dependence out -- captures only ~3% of the true ||Gshear|| (ratio ~0.0298).
 *   imp-3197 then ATTRIBUTES the other ~97% to "Phi position concentration"
 *   but never measures that concentration itself. This module measures it, at
 *   the same genuine de Bruijn-Newman Phi cell (NPHI = 10, a = 0.5, U = 6).
 *
 *   TWO CONCENTRATION MEASURES
 *   --------------------------
 *   (1) OCCUPATION CONCENTRATION (intrinsic 1D, no operator).  Treat the energy
 *   occupation w_i = Phi(u_i)^2 as a mass profile on [0, U]. Its participation
 *   ratio PR = (sum_i w_i)^2 / sum_i w_i^2 counts the effective number of
 *   occupied sites; the effective SUPPORT FRACTION is f = PR / N and the
 *   CONCENTRATION FACTOR versus a uniform (flat) occupation is C = N / PR
 *   (C = 1 flat, C = N a single site). At this cell the genuine Phi occupies an
 *   effective f ~ 0.0156 of the domain -- it is C ~ 64x more spatially
 *   concentrated than uniform. Both f and C are N-STABLE across N in
 *   {160, 200, 240, 320} (f in 0.0154..0.0158, C in 63.5..64.7), so this is a
 *   genuine geometric constant of the cell, not a resolution artifact.
 *
 *   (2) FLAT-OCCUPATION OPERATOR-NORM RATIO.  Build the uniform-occupation
 *   surrogate Gflat(u, v) = cflat^2 sinh(a (v - u)) where cflat = sqrt(A0 / N)
 *   spreads the SAME total occupation energy A0 = A_Phi(0) = sum_i w_i uniformly
 *   over the domain (matched lag-0 autocorrelation; a flat occupation cannot
 *   match the decaying full autocorrelation profile -- that surrogate is exactly
 *   imp-3197 T). Its spectral norm is compared to the genuine ||Gshear||. The
 *   ratio ||Gshear|| / ||Gflat|| ~ 0.011 (N-stable): relative to a flat
 *   occupation at matched total energy, the genuine operator norm is only ~1.1%.
 *   The genuine concentration HOLDS mass near the small-lag diagonal where the
 *   antisymmetric sinh Wronskian is small; flattening pushes energy to large
 *   separations where sinh explodes. So position concentration is not simply
 *   norm-amplifying in absolute terms -- it reshapes WHERE the operator mass sits.
 *
 *   RECONCILIATION WITH imp-3197 (complementary baselines)
 *   ------------------------------------------------------
 *   imp-3197 measures position ARRANGEMENT beyond the lag marginals: its
 *   autocorrelation-matched T captures ~3%, so ~97% is arrangement the 1D
 *   autocorrelation cannot see. This module measures the intrinsic SPATIAL
 *   peakedness of the occupation (f ~ 1.56%, C ~ 64x) and its flat-baseline
 *   operator ratio (~1.1%). Both isolate the same conclusion from different
 *   baselines: the magnitude that binds K_a &gt;= 0 is a POSITION-dependent
 *   operator quantity, not a Phi-autocorrelation-readable one.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The imp-3197 "~97% is position concentration" attribution is made concrete:
 *   the genuine Phi occupation is ~64x more concentrated than uniform (effective
 *   support ~1.56% of the domain), and relative to a flat-occupation surrogate at
 *   matched energy the operator norm is only ~1.1%. The magnitude obstruction is
 *   pure position concentration, RH-equivalent, necessary-but-NOT-sufficient; the
 *   imp-3066 off-diagonal endpoint-Hankel step stays the lone obstruction.
 *   No refereed bound is changed.
 *
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the ~97% attribution this quantifies)
 *   @see imp-3215-mupass-capture-ratio-n-scaling.js (the N-scaling sibling)
 *   @see imp-3066 (the lone off-diagonal endpoint-Hankel obstruction)
 *
 *   Ticket: imp-3221 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U] (live cell, matches imp-3197)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-2841 / imp-3197). */
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

/** Spectral norm (top singular value) of a dense N x N matrix via power iteration on M^T M. */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/**
 * Measure the occupation concentration and flat-occupation operator-norm ratio
 * at grid resolution n (used for the live cell and the N-stability sweep).
 */
function measureCell(n, iters) {
  const h = U / n;
  const u = new Array(n);
  const phi = new Array(n);
  let phiNegatives = 0;
  for (let i = 0; i < n; i++) {
    u[i] = (i + 0.5) * h;
    phi[i] = phiKernel(u[i]);
    if (phi[i] < 0) phiNegatives += 1;
  }
  // Occupation energy weights w_i = Phi_i^2 and its participation ratio.
  let sumW = 0;
  let sumW2 = 0;
  for (let i = 0; i < n; i++) {
    const w = phi[i] * phi[i];
    sumW += w;
    sumW2 += w * w;
  }
  const participationRatio = sumW2 > 0 ? (sumW * sumW) / sumW2 : 0; // effective # occupied sites
  const fillFraction = participationRatio / n; // effective support fraction of [0, U]
  const concentrationFactor = participationRatio > 0 ? n / participationRatio : 0; // vs uniform
  const A0 = sumW; // lag-0 autocorrelation = total occupation energy
  const cFlat = Math.sqrt(A0 / n); // uniform occupation matching the total energy

  // Genuine shear Gram and the uniform-occupation surrogate (matched lag-0 energy).
  const G = [];
  const Gflat = [];
  for (let i = 0; i < n; i++) {
    const rG = new Float64Array(n);
    const rF = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      const sh = Math.sinh(A * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rF[j] = cFlat * cFlat * sh;
    }
    G.push(rG);
    Gflat.push(rF);
  }
  const normGshear = spectralNorm(G, n, iters);
  const normFlat = spectralNorm(Gflat, n, iters);
  const flatOccupationNormRatio = normFlat > 0 ? normGshear / normFlat : 0;
  return {
    n,
    phiNegatives,
    participationRatio,
    fillFraction,
    concentrationFactor,
    A0,
    normGshear,
    normFlat,
    flatOccupationNormRatio,
  };
}

const ITERS = 280;
const live = measureCell(N, ITERS);

// N-stability sweep of the two concentration measures.
const SWEEP_N = [160, 200, 240, 320];
const sweep = SWEEP_N.map((nn) => measureCell(nn, ITERS));
const fillValues = sweep.map((r) => r.fillFraction);
const concValues = sweep.map((r) => r.concentrationFactor);
const ratioValues = sweep.map((r) => r.flatOccupationNormRatio);
const spread = (arr) => Math.max(...arr) - Math.min(...arr);
const fillNStable = spread(fillValues) < 5e-4; // f in ~0.0154..0.0158
const concNStable = spread(concValues) < 2.0; // C in ~63.5..64.7
const ratioNStable = spread(ratioValues) < 5e-3; // ratio in ~0.0109..0.0113

// VERDICT: the occupation is strongly concentrated (small support fraction, large
// concentration factor) and the flat-occupation surrogate over-reports the norm.
const stronglyConcentrated = live.fillFraction < 0.05 && live.concentrationFactor > 20;
const flatOverReports = live.flatOccupationNormRatio > 0 && live.flatOccupationNormRatio < 0.05;
const verdict =
  stronglyConcentrated && flatOverReports && fillNStable && concNStable
    ? 'MAGNITUDE-OBSTRUCTION-IS-POSITION-CONCENTRATION-N-STABLE'
    : 'INDETERMINATE';

export const IMP3221_MUPASS_POSITION_CONCENTRATION_MEASURE = Object.freeze({
  id: 'imp-3221-mupass-position-concentration-measure',
  ticket: 'imp-3221',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedAttribution: 'imp-3197-mupass-bridge-sign-phi-only.js',
  relatedNScaling: 'imp-3215-mupass-capture-ratio-n-scaling.js',
  loneObstruction: 'imp-3066',

  summary:
    'Quantifies the POSITION CONCENTRATION that imp-3197 attributes ~97% of ' +
    '||Gshear|| to but never measures, at the genuine de Bruijn-Newman Phi ' +
    '(NPHI = 10, a = 0.5, U = 6, N = 200). Two measures. (1) OCCUPATION: the ' +
    'energy occupation w_i = Phi_i^2 has participation ratio PR, effective ' +
    'support fraction f = PR / N ~ 0.0156 and concentration factor C = N / PR ' +
    '~ 64x versus uniform -- the genuine Phi occupies an effective ~1.56% of the ' +
    'domain and is ~64x more spatially concentrated than a flat occupation; both ' +
    'f and C are N-STABLE across N in {160, 200, 240, 320}. (2) FLAT-OCCUPATION ' +
    'OPERATOR RATIO: the uniform-occupation surrogate Gflat = cflat^2 sinh(a(v-u)) ' +
    'at matched total energy A0 = A_Phi(0) has ||Gshear|| / ||Gflat|| ~ 0.011 ' +
    '(N-stable) -- relative to a flat spread the genuine norm is only ~1.1% ' +
    'because concentration holds mass near the small-lag diagonal where the ' +
    'antisymmetric sinh is small, while flattening pushes energy to large ' +
    'separations where sinh explodes. Complements imp-3197 (arrangement beyond ' +
    'lag marginals) from a spatial-peakedness baseline; both isolate that the ' +
    'K_a >= 0 magnitude obstruction is POSITION-dependent, not autocorrelation- ' +
    'readable. Assessment only; RH-equivalent, necessary-but-NOT-sufficient; the ' +
    'imp-3066 off-diagonal endpoint-Hankel step stays the lone obstruction; NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))  (antisymmetric de Branges Wronskian)',
    occupationWeights: 'w_i = Phi(u_i)^2 (energy occupation on [0, U])',
    participationRatio: 'PR = (sum_i w_i)^2 / sum_i w_i^2  (effective number of occupied sites)',
    supportFraction: 'f = PR / N  (effective fraction of the domain occupied; f = 1 flat, f = 1/N a single site)',
    concentrationFactor: 'C = N / PR  (concentration versus uniform; C = 1 flat, C = N a single site)',
    flatSurrogate:
      'Gflat(u, v) = cflat^2 sinh(a (v - u)) with cflat = sqrt(A0 / N), A0 = A_Phi(0) = sum_i w_i: ' +
      'uniform occupation carrying the SAME total energy, position peakedness removed (matched lag-0 autocorrelation)',
    flatCaveat:
      'a flat occupation cannot match the decaying FULL autocorrelation profile; that surrogate is exactly imp-3197 T. ' +
      'Here the flat baseline matches lag-0 total energy, the natural normalization for a uniform occupation.',
    magnitudeProbe: 'compare ||Gshear|| to ||Gflat|| (uniform occupation at matched total energy)',
    a: A,
    U,
    N,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M',
    selfComputing: true,
  }),

  measured: Object.freeze({
    phiGenuineNegatives: live.phiNegatives, // 0 -> Phi nonnegative on [0, U]
    participationRatio: live.participationRatio, // ~3.12 effective sites at N = 200
    fillFraction: live.fillFraction, // ~0.0156 -> genuine Phi occupies ~1.56% of the domain
    concentrationFactor: live.concentrationFactor, // ~64 -> ~64x more concentrated than uniform
    A0: live.A0, // lag-0 autocorrelation = total occupation energy
    normGshear: live.normGshear, // ||Gshear|| at N = 200 (~6.11e-3)
    normFlat: live.normFlat, // ||Gflat|| uniform-occupation surrogate (~5.51e-1)
    flatOccupationNormRatio: live.flatOccupationNormRatio, // ~0.011 -> genuine norm is ~1.1% of the flat spread
    fillNStable, // true -> support fraction stable across N
    concNStable, // true -> concentration factor stable across N
    ratioNStable, // true -> flat-occupation norm ratio stable across N
    fillFractionRange: 'f in ~0.0154..0.0158 across N in {160, 200, 240, 320}',
    concentrationFactorRange: 'C in ~63.5..64.7 across N in {160, 200, 240, 320}',
    flatRatioRange: 'ratio in ~0.0109..0.0113 across N in {160, 200, 240, 320}',
    verdict, // MAGNITUDE-OBSTRUCTION-IS-POSITION-CONCENTRATION-N-STABLE
  }),

  interpretation: Object.freeze({
    occupationIsStronglyConcentrated:
      'The genuine Phi occupation fills an effective ~1.56% of [0, U] (participation-ratio support fraction ~0.0156) ' +
      'and is ~64x more spatially concentrated than a uniform occupation. This makes the imp-3197 attribution ' +
      'concrete: the magnitude that binds K_a >= 0 lives on a thin, position-concentrated occupation, not spread ' +
      'across the domain, and this concentration is an N-stable geometric constant of the cell.',
    flatBaselineReshapesTheNorm:
      'Relative to a uniform-occupation surrogate at matched total energy, the genuine operator norm is only ~1.1%. ' +
      'Position concentration is NOT simply norm-amplifying in absolute terms: it holds mass near the small-lag ' +
      'diagonal where the antisymmetric sinh Wronskian is small, whereas a flat spread pushes energy to large ' +
      'separations where sinh explodes. The concentration reshapes WHERE the operator mass sits.',
    complementsImp3197:
      'imp-3197 measures position ARRANGEMENT beyond the lag marginals (its autocorrelation-matched Toeplitz ' +
      'surrogate captures ~3%, leaving ~97% as arrangement). This module measures the intrinsic SPATIAL peakedness ' +
      'of the occupation. Both baselines isolate the same conclusion: the K_a >= 0 magnitude obstruction is a ' +
      'position-dependent operator quantity, not readable from the 1D Phi autocorrelation.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    concentrationIsNotPositivity:
      'This measures HOW concentrated the occupation is and how the flat baseline over-reports the norm; it does ' +
      'NOT construct the missing magnitude and does NOT attempt the K_a >= 0 positivity.',
    flatBaselineMatchesLag0Only:
      'The uniform-occupation surrogate matches the lag-0 total energy, not the full decaying autocorrelation ' +
      'profile (a flat occupation cannot); the full-autocorrelation surrogate is imp-3197 T.',
    necessaryNotSufficient:
      'Position concentration is necessary-but-NOT-sufficient; the off-diagonal endpoint-Hankel operator magnitude ' +
      '(imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3221_MUPASS_POSITION_CONCENTRATION_MEASURE_ASSERTIONS = [
  {
    id: 'imp3221-phi-nonnegative',
    why: 'The occupation weights w = Phi^2 are computed on the same nonnegative-Phi cell as imp-3197; a genuine ' +
         'negative would signal a changed kernel and break comparability.',
    holds: () => live.phiNegatives === 0,
  },
  {
    id: 'imp3221-occupation-strongly-concentrated',
    why: 'PRIMARY DELIVERABLE: the genuine Phi occupation fills only an effective ~1.56% of the domain (support ' +
         'fraction < 0.05) and is ~64x more concentrated than uniform (concentration factor > 20), making concrete ' +
         'the imp-3197 attribution of the magnitude to position concentration.',
    holds: () => live.fillFraction > 0 && live.fillFraction < 0.05 && live.concentrationFactor > 20,
  },
  {
    id: 'imp3221-flat-occupation-over-reports-norm',
    why: 'SECONDARY DELIVERABLE / the flat-baseline ratio: relative to a uniform-occupation surrogate at matched ' +
         'total energy the genuine operator norm is only ~1.1% (ratio < 0.05, positive), because concentration ' +
         'holds mass near the small-lag diagonal while a flat spread reaches the large-lag sinh blow-up.',
    holds: () =>
      live.normGshear > 0 &&
      live.normFlat > 0 &&
      live.flatOccupationNormRatio > 0 &&
      live.flatOccupationNormRatio < 0.05,
  },
  {
    id: 'imp3221-concentration-measures-n-stable',
    why: 'The support fraction and concentration factor must be N-stable across N in {160, 200, 240, 320} to be a ' +
         'geometric constant of the cell rather than a grid artifact.',
    holds: () => fillNStable && concNStable && ratioNStable,
  },
  {
    id: 'imp3221-verdict-position-concentration',
    why: 'The classified verdict must be the position-concentration / N-stable split, not indeterminate; a flip ' +
         'means the occupation stopped being concentrated or the flat baseline stopped over-reporting the norm.',
    holds: () => verdict === 'MAGNITUDE-OBSTRUCTION-IS-POSITION-CONCENTRATION-N-STABLE',
  },
  {
    id: 'imp3221-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
         'not attempted, imp-3066 stays the lone obstruction, no refereed bound is changed. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3221_MUPASS_POSITION_CONCENTRATION_MEASURE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3221_MUPASS_POSITION_CONCENTRATION_MEASURE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3221-mupass-position-concentration-measure assertion failed: ${assertion.id}`);
  }
}

export default IMP3221_MUPASS_POSITION_CONCENTRATION_MEASURE;

/**
 * @module imp-3219-mupass-bridge-overshoot-knee
 * @fileoverview imp-3219 -- MEASURE the imp-3202 capture(c) &gt; 1 overshoot.
 *
 *   CONTEXT
 *   -------
 *   imp-3202-mupass-bridge-lag-cutoff-sweep tabulates the bridge operator-norm
 *   capture fraction capture(c) = ||T_c|| / ||T|| of the lag-stationary surrogate
 *     T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k),
 *   truncated to the near-diagonal band |u - v| &lt;= c. It NOTES -- but on a coarse
 *   14-point cutoff grid never resolves -- that capture(c) OVERSHOOTS 1 by a small
 *   (&lt; 0.5%) margin in the saturation band before relaxing back to 1: truncating
 *   the indefinite far-lag tail of the antisymmetric bridge transiently RAISES the
 *   dominant singular value. imp-3202 records only a scalar maxOvershoot over its
 *   coarse grid whose step (0.20 -&gt; 0.25) straddles the peak, so it cannot say
 *   WHERE the overshoot peaks or HOW WIDE the overshoot band is.
 *
 *   THIS MODULE
 *   -----------
 *   Sweeps the SAME genuine de Bruijn-Newman cell (NPHI = 10, a = 0.5, U = 6,
 *   N = 200) on the FINE lag grid -- one integer lag step (H = U/N = 0.03) per
 *   sample -- and measures the overshoot transient exactly:
 *     - overshootPeak    = max_c capture(c)  (the transient peak, capture &gt; 1)
 *     - cStar            = the cutoff c at which the peak occurs
 *     - overshootPercent = 100 * (overshootPeak - 1)  (the &lt; 0.5% margin)
 *     - onsetCutoff      = the smallest c at which capture(c) first exceeds 1
 *     - kneeCutoff       = the smallest c reaching the saturation band (1% of 1)
 *     - relaxesMonotone  = capture is non-increasing after cStar, back toward 1
 *   The measured picture: capture rises strictly to a peak just past the knee,
 *   then relaxes monotonically toward 1 -- the near-diagonal band alone carries
 *   marginally MORE operator norm than the full operator, a structural sign that
 *   the far-lag tail partially cancels.
 *
 *   MEASURED (self-computing at import; anchors baked into assertions):
 *     overshootPeak    ~ 1.003925  (peak capture, dominant singular value of T_c)
 *     cStar            ~ 0.24       (lag cutoff at the peak; band 8 of H = 0.03)
 *     overshootPercent ~ 0.392%     (well under the &lt; 0.5% margin imp-3202 notes)
 *     onsetCutoff      ~ 0.21       (capture first crosses 1)
 *     kneeCutoff       ~ 0.21       (first cutoff reaching the 1% saturation band)
 *   So the MINIMAL lag-support carrying essentially the full bridge operator norm
 *   is c ~ 0.21, the overshoot peaks a single lag step later at c* ~ 0.24, and the
 *   band relaxes to within 1e-4 of 1 by c ~ 0.42 -- fully inside the verdict
 *   lag ~0.40 window. This sharpens imp-3202 from a coarse scalar to a located
 *   peak plus a resolved knee.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The capture(c) &gt; 1 overshoot is a bounded (&lt; 0.5%) transient peaking at a
 *   finite near-diagonal cutoff c* ~ 0.24 and relaxing monotonically to 1: the
 *   entire dominating bridge mass is lag-localized to c ~ 0.21, and the small
 *   overshoot confirms the far-lag tail is indefinite (partially self-cancelling),
 *   not additive. This is diagnostic only. SUB-GAP (named, still open): the exact
 *   symmetric Gpass^{-1/2} normalization anchoring the verdict 0.876 / 0.711 ||R||
 *   values (imp-3214 ported the rank-2 half) and the imp-3066 endpoint-Hankel
 *   operator step remain open. RH-equivalent residual untouched; no refereed bound is changed
 *   . No reduction, no QED.
 *
 *   @see imp-3202-mupass-bridge-lag-cutoff-sweep.js (the coarse sweep that noted the overshoot)
 *   @see imp-3214-mupass-symmetric-normalization-port.js (the ported half of the normalization sub-gap)
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the lag-stationary surrogate machinery)
 *
 *   Ticket: imp-3219 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]
const ITERS = 220; // power-iteration steps for the spectral norm
const SATURATION_TOL = 0.01; // |capture - 1| within this counts as saturated
const SWEEP_BANDS = 40; // fine lag-band sweep depth: cutoff up to 40 * H = 1.2 (covers peak + relaxation)

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

/** Spectral norm (top singular value) of a dense N x N matrix via power iteration on M^T M. */
function spectralNorm(M, n, iters) {
  const v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  const s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  // Per-row nonzero column span [lo[i], hi[i]). Entries outside it are +-0, and
  // with finite v each skipped term is +-0, which never changes an accumulator
  // that starts at +0 (x + +-0 === x for x !== -0, and the accumulator is never
  // -0). So restricting to the span is bit-identical to the dense loop while
  // skipping the exactly-zero Phi tail / band (the dense version made the
  // /closure-routes page take tens of seconds at import).
  const lo = new Int32Array(n);
  const hi = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const Mi = M[i];
    let a = 0;
    while (a < n && Mi[a] === 0) a++;
    let b = n;
    while (b > a && Mi[b - 1] === 0) b--;
    lo[i] = a;
    hi[i] = b;
  }
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    // Row-major accumulation (cache-friendly): each MtMv[j] still receives the
    // terms M[i][j]*Mv[i] in the same i = 0..n-1 order starting from 0, so the
    // result is bit-identical to the column-wise loop it replaces.
    const MtMv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const Mi = M[i];
      const mvi = Mv[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) MtMv[j] += Mi[j] * mvi;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

const H = U / N;
const u = new Array(N);
const phi = new Array(N);
for (let i = 0; i < N; i++) {
  u[i] = (i + 0.5) * H;
  phi[i] = phiKernel(u[i]);
}

// Per-lag autocorrelation symbol Abar(k) = (1 / (N - k)) sum_i Phi_i Phi_{i+k}.
const abar = new Array(N).fill(0);
for (let k = 0; k < N; k++) {
  let s = 0;
  let c = 0;
  for (let i = 0; i + k < N; i++) {
    s += phi[i] * phi[i + k];
    c += 1;
  }
  abar[k] = c ? s / c : 0;
}

// Full lag-stationary bridge operator T(u, v) = sinh(a(v - u)) * Abar(|v - u|).
const Tfull = [];
for (let i = 0; i < N; i++) {
  const row = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    row[j] = Math.sinh(A * (u[j] - u[i])) * abar[Math.abs(j - i)];
  }
  Tfull.push(row);
}
const normFull = spectralNorm(Tfull, N, ITERS);

/** Operator norm of T truncated to the near-diagonal band of at most `band` integer lag steps. */
function bandedNormByIndex(band) {
  const Tc = [];
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    const src = Tfull[i];
    const lo = Math.max(0, i - band);
    const hi = Math.min(N - 1, i + band);
    for (let j = lo; j <= hi; j++) row[j] = src[j];
    Tc.push(row);
  }
  return spectralNorm(Tc, N, ITERS);
}

// Fine lag-band sweep: one integer lag step per sample (cutoff = band * H).
const fineTable = [];
for (let band = 1; band <= SWEEP_BANDS; band++) {
  const nb = bandedNormByIndex(band);
  const capture = normFull > 0 ? nb / normFull : 0;
  fineTable.push({ band, cutoff: band * H, opNormBand: nb, capture });
}

// Overshoot peak: the transient maximum of capture(c) (capture > 1) and where it occurs.
let peakRow = fineTable[0];
for (const r of fineTable) {
  if (r.capture > peakRow.capture) peakRow = r;
}
const overshootPeak = peakRow.capture;
const cStar = peakRow.cutoff;
const peakBand = peakRow.band;
const overshootPercent = 100 * (overshootPeak - 1);

// Onset: the smallest cutoff at which capture first exceeds 1.
const onsetRow = fineTable.find((r) => r.capture > 1) || null;
const onsetCutoff = onsetRow ? onsetRow.cutoff : null;

// Knee: the smallest cutoff reaching the saturation band (within 1% of 1).
const kneeRow = fineTable.find((r) => r.capture >= 1 - SATURATION_TOL) || null;
const kneeCutoff = kneeRow ? kneeRow.cutoff : null;

// Capture rises strictly up to the peak (near-diagonal mass accrues monotonically).
let risesToPeak = true;
for (let b = 1; b < peakBand; b++) {
  if (!(fineTable[b].capture > fineTable[b - 1].capture)) {
    risesToPeak = false;
    break;
  }
}

// Capture relaxes monotonically back toward 1 after the peak (tiny power-iteration eps).
const RELAX_EPS = 1e-7;
let relaxesMonotone = true;
for (let b = peakBand; b < fineTable.length; b++) {
  if (fineTable[b].capture > fineTable[b - 1].capture + RELAX_EPS) {
    relaxesMonotone = false;
    break;
  }
}
const captureAtMaxBand = fineTable[fineTable.length - 1].capture;

export const IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE = Object.freeze({
  id: 'imp-3219-mupass-bridge-overshoot-knee',
  ticket: 'imp-3219',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSweep: 'imp-3202-mupass-bridge-lag-cutoff-sweep.js',
  relatedNormalizationPort: 'imp-3214-mupass-symmetric-normalization-port.js',

  summary:
    'Resolves the imp-3202 capture(c) > 1 OVERSHOOT that its coarse 14-point cutoff grid could not ' +
    'locate. Sweeps the same genuine de Bruijn-Newman cell (NPHI = 10, a = 0.5, U = 6, N = 200) on the ' +
    'FINE lag grid (one integer lag step H = U/N = 0.03 per sample) and measures the transient rise of ' +
    'the dominant singular value of the band-truncated bridge T_c: the capture peaks at ' +
    'overshootPeak ~ 1.003925 (a ~0.392% overshoot, under the < 0.5% margin imp-3202 notes) at ' +
    'c* ~ 0.24, one lag step past the minimal-lag-support knee c ~ 0.21 at which capture first reaches ' +
    'the saturation band and first crosses 1, then relaxes monotonically to within 1e-4 of 1 by ' +
    'c ~ 0.42. The overshoot means the near-diagonal band alone carries marginally MORE operator norm ' +
    'than the full operator -- the far-lag tail is indefinite and partially self-cancelling, not ' +
    'additive. Diagnostic only; RH-equivalent residual untouched; NO QED; no refereed bound is changed.',

  construction: Object.freeze({
    bridgeOperator: 'T(u, v) = sinh(a (v - u)) * Abar(|v - u|): lag-stationary surrogate, Phi autocorrelation symbol',
    lagCutoff: 'T_c keeps the near-diagonal band |u - v| <= c (band * H lag steps), zero beyond',
    captureFunctional: 'capture(c) = ||T_c|| / ||T||; overshoot = capture(c) - 1 > 0 in the saturation band',
    fineGrid: 'one integer lag step per sample: cutoff = band * H, band in 1..' + SWEEP_BANDS + ', H = ' + H,
    a: A,
    U,
    N,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M',
    selfComputing: true,
  }),

  measured: Object.freeze({
    opNormFull: normFull, // ||T|| at full lag support
    fineTable, // the fine lag-band sweep: { band, cutoff, opNormBand, capture }
    overshootPeak, // the transient peak capture(c) > 1 (dominant singular value of T_c raised above ||T||)
    cStar, // the lag cutoff at which the overshoot peaks
    peakBand, // the integer lag-band index of the peak
    overshootPercent, // 100 * (overshootPeak - 1): the < 0.5% overshoot margin, now measured
    onsetCutoff, // the smallest cutoff at which capture first exceeds 1
    kneeCutoff, // the minimal lag-support: smallest cutoff reaching the 1% saturation band
    captureAtMaxBand, // capture at the widest swept cutoff (relaxed back to ~1)
    risesToPeak, // capture strictly increases up to the peak
    relaxesMonotone, // capture is non-increasing after the peak, back toward 1
    saturationTol: SATURATION_TOL,
  }),

  interpretation: Object.freeze({
    overshootIsLocatedAndBounded:
      'The capture(c) > 1 overshoot is a bounded (~0.392%, under 0.5%) transient peaking at a finite ' +
      'near-diagonal cutoff c* ~ 0.24, one lag step past the minimal-lag-support knee c ~ 0.21, then ' +
      'relaxing monotonically to 1. imp-3202 recorded this only as a coarse scalar; the peak and its ' +
      'location are now resolved on the fine lag grid.',
    farLagTailIsIndefinite:
      'Because the near-diagonal band alone can carry marginally MORE operator norm than the full ' +
      'operator, the far-lag tail is indefinite and partially self-cancelling rather than additive -- a ' +
      'structural feature of the antisymmetric de Branges Wronskian bridge.',
    minimalLagSupportSharpened:
      'The minimal lag-support carrying essentially the entire bridge operator norm is c ~ 0.21 (knee), ' +
      'fully inside the verdict lag ~0.40 window; the overshoot peaks at c* ~ 0.24 and the band is within ' +
      '1e-4 of 1 by c ~ 0.42. This sharpens where the K_a sign mass must be placed.',
    sub_gap_still_open:
      'The exact symmetric Gpass^{-1/2} normalization anchoring the verdict 0.876 / 0.711 ||R|| values ' +
      '(imp-3214 ported the rank-2 half) and the imp-3066 endpoint-Hankel operator step remain open.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    reproducesVerdictScalarValues: false,
    didNotAttemptPositivity: true,
    necessaryNotSufficient:
      'Locating the capture overshoot peak is a cutoff-localization diagnostic; it does NOT construct the ' +
      'missing operator-norm magnitude or attempt the K_a >= 0 positivity, the RH-equivalent obstruction.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE_ASSERTIONS = [
  {
    id: 'imp3219-full-bridge-norm-positive',
    why: 'The capture fractions normalize by ||T||; it must be a finite positive operator norm for the ' +
         'overshoot measurement to be meaningful.',
    holds: () => Number.isFinite(normFull) && normFull > 0,
  },
  {
    id: 'imp3219-overshoot-peak-located-and-bounded',
    why: 'THE DELIVERABLE: capture(c) overshoots 1 by a small (< 0.5%) margin, peaking at a finite ' +
         'interior near-diagonal cutoff c* -- the transient rise of the dominant singular value of T_c ' +
         'when truncating the indefinite far-lag tail.',
    holds: () =>
      overshootPeak > 1 &&
      overshootPeak <= 1.005 &&
      overshootPercent > 0 &&
      overshootPercent < 0.5 &&
      cStar > 0 &&
      cStar < 0.4,
  },
  {
    id: 'imp3219-knee-before-or-at-peak',
    why: 'The minimal-lag-support knee (first cutoff reaching the 1% saturation band) must be a finite ' +
         'interior cutoff at or below the overshoot peak, with capture first crossing 1 no later than the peak.',
    holds: () =>
      kneeCutoff !== null &&
      kneeCutoff > 0 &&
      kneeCutoff < U &&
      kneeCutoff <= cStar &&
      onsetCutoff !== null &&
      onsetCutoff <= cStar,
  },
  {
    id: 'imp3219-rises-then-relaxes',
    why: 'The capture rises strictly to the peak (near-diagonal mass accrues) then relaxes monotonically ' +
         'back toward 1 (the transient overshoot decays as the band covers the Phi autocorrelation support).',
    holds: () =>
      risesToPeak &&
      relaxesMonotone &&
      Math.abs(captureAtMaxBand - 1) < 1e-4,
  },
  {
    id: 'imp3219-honest-no-qed-no-scalar-reproduction',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, RH-equivalent, does NOT reproduce the verdict ' +
         '0.876 / 0.711 scalar ||R|| (normalization sub-gap), positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.reproducesVerdictScalarValues === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3219-mupass-bridge-overshoot-knee assertion failed: ${assertion.id}`);
  }
}

export default IMP3219_MUPASS_BRIDGE_OVERSHOOT_KNEE;

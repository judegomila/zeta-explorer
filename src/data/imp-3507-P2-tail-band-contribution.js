/**
 * @module imp-3507-P2-tail-band-contribution
 * @fileoverview imp-3507 -- CERTIFY the "only n = 1, 2 numerically live" claim that
 *   imp-3484 recorded qualitatively for the imp-3470 stationarity polynomial
 *   P2(xi) = 2(C1^2 + S1^2 + C C2 + S S2), whose root pins the peak-slope maximizer
 *   xi* = 12.0870439 behind the imp-3346 capture constant C_inf ~ 0.1751.
 *
 *   WHAT imp-3484 LEFT OPEN
 *   -----------------------
 *   imp-3484 itemized P2 as "six Fourier-moment integrals x ten dBN bands (only
 *   n = 1, 2 numerically live)" but decomposed only the DOMINANT part C = I0c per
 *   band, leaving the live-band claim for the OTHER five moments -- and the induced
 *   tail contribution to P2 itself -- unmeasured. This module closes that gap.
 *
 *   WHAT IS MEASURED HERE
 *   ---------------------
 *   1. PER-BAND, PER-MOMENT tail: for EACH of the six base integrals
 *        I0c=C, I0s=S, I1c=S1, I1s=-C1, I2c=-C2, I2s=-S2,
 *      decompose the n = 1..10 dBN bands and tabulate each band fraction
 *        f_n = |I_n| / sum_m |I_m|.
 *      The tail fraction f_tail = sum_{n>=3} f_n is certified astronomically
 *      negligible (< 1e-9) for all six, so each moment has exactly two live bands.
 *   2. INDUCED P2 tail: reconstruct P2 from moments truncated at band N,
 *        P2^(N), for N = 1..10, showing it stabilizes by N = 2. The bands-n>=3
 *      shift dP2 = P2^(10) - P2^(2) is measured in absolute terms and against the
 *      product-term scale p2AbsSum = sum |2 C1^2|, |2 S1^2|, |2 C C2|, |2 S S2|.
 *
 *   RESULT (a = 1, U = 8, NPHI = 10, Simpson N = 4000)
 *   --------------------------------------------------
 *   Every moment: n = 1 carries ~99.9%, n = 2 the ~1e-4..1e-3 remainder, and the
 *   n >= 3 tail fraction is 1e-12..3e-10 (worst case I0c ~ 3.0e-10). The P2
 *   reconstruction is 1.73964e-8 at N = 1, 1.77604134e-8 at N = 2, and
 *   1.77604136e-8 at N = 10: the bands-n>=3 shift is dP2 ~ 2.8e-16 (absolute),
 *   ~1.5e-11 of the p2AbsSum scale. The Gaussian tail exp(-pi n^2 e^{4u}) crushes
 *   band n = 3 by exp(-9 pi) ~ 5e-13 at u = 0 and faster deeper in the window, so
 *   the "only n = 1, 2 live" claim is quantitatively certified.
 *
 *   @see imp-3484-P2-spectral-integral-enumeration.js (itemizes P2; decomposes only C per band)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (locates xi*, names the "ten integrals")
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C_inf ~ 0.1751 assembled from the peak slope)
 *
 *   Ticket: imp-3507 (accuracy, medium). Measurement/certification only; RH-equivalent;
 *   imp-3066 K_a >= 0 magnitude UNTOUCHED; NO RH verdict, NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3484 / imp-3470)
const XI_STAR = 12.0870439; // the imp-3470 slope maximizer (root of P2 = 0)
const U_WINDOW = 8; // imp-3470 / imp-3484 upper ladder rung
const A_LINEAR = 1.0; // shear weight cancels in the ratio; read at a = 1
const SIMPSON_N = 4000; // finest imp-3484 grid; residual already < 1e-8 there

/** de Bruijn-Newman completed-Riemann kernel, single band n (identical to imp-3484). */
function bandKernel(uu, n) {
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  const n2 = n * n;
  const n4 = n2 * n2;
  return (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
}

/** Composite Simpson quadrature of f on [0, U] with N (even) panels (identical to imp-3484). */
function simpson(f, U, N) {
  const h = U / N;
  let s = f(0) + f(U);
  for (let i = 1; i < N; i++) s += (i % 2 ? 4 : 2) * f(i * h);
  return (s * h) / 3;
}

// The six distinct Fourier-moment integrand weights composing P2 (identical to imp-3484).
const BASE_DEFS = [
  { key: 'I0c', maps: 'C', w: (u) => Math.cos(XI_STAR * u) },
  { key: 'I0s', maps: 'S', w: (u) => Math.sin(XI_STAR * u) },
  { key: 'I1c', maps: 'S1 = dS/dxi', w: (u) => u * Math.cos(XI_STAR * u) },
  { key: 'I1s', maps: '-C1 = -dC/dxi', w: (u) => u * Math.sin(XI_STAR * u) },
  { key: 'I2c', maps: '-C2', w: (u) => u * u * Math.cos(XI_STAR * u) },
  { key: 'I2s', maps: '-S2', w: (u) => u * u * Math.sin(XI_STAR * u) },
];

// --- 1. Per-band, per-moment decomposition of all six base integrals -----------
// For each moment, tabulate the n = 1..10 band values and their |fraction| of the
// total, then the tail fraction carried by bands n >= 3.
const moments = BASE_DEFS.map((d) => {
  const bands = [];
  for (let n = 1; n <= NPHI; n++) {
    bands.push({ n, value: simpson((u) => bandKernel(u, n) * d.w(u), U_WINDOW, SIMPSON_N) });
  }
  const absSum = bands.reduce((a, b) => a + Math.abs(b.value), 0);
  const withFrac = bands.map((b) => ({ ...b, fraction: Math.abs(b.value) / absSum }));
  const tailFraction = withFrac.slice(2).reduce((a, b) => a + b.fraction, 0); // n >= 3
  const liveBands = withFrac.filter((b) => b.fraction > 1e-9).length;
  return {
    key: d.key,
    maps: d.maps,
    total: bands.reduce((a, b) => a + b.value, 0),
    band1Fraction: withFrac[0].fraction,
    band2Fraction: withFrac[1].fraction,
    tailFraction, // sum_{n>=3} |I_n| / sum |I_m| -- the astronomically-negligible tail
    liveBands, // numerically live bands (expected 2)
    perBand: withFrac,
  };
});

// Worst-case tail fraction across the six moments (the certification headline).
const maxTailFraction = Math.max(...moments.map((m) => m.tailFraction));
const allTwoLive = moments.every((m) => m.liveBands === 2);

// --- 2. Cumulative P2 reconstruction: truncate the moments at band N -----------
// P2 is BILINEAR in (C, S, C1, S1, C2, S2), so the "band tail" of P2 is measured by
// reconstructing P2 from the moment PARTIAL SUMS over bands 1..N (imp-3470 signs).
const byKey = Object.fromEntries(moments.map((m) => [m.key, m.perBand]));
function assembleP2(N) {
  let C = 0, S = 0, I1c = 0, I1s = 0, I2c = 0, I2s = 0;
  for (let i = 0; i < N; i++) {
    C += byKey.I0c[i].value;
    S += byKey.I0s[i].value;
    I1c += byKey.I1c[i].value;
    I1s += byKey.I1s[i].value;
    I2c += byKey.I2c[i].value;
    I2s += byKey.I2s[i].value;
  }
  const C1 = -I1s, S1 = I1c, C2 = -I2c, S2 = -I2s;
  return { P2: 2 * (C1 * C1 + S1 * S1 + C * C2 + S * S2), C, S, C1, S1, C2, S2 };
}

const cumulativeP2 = [];
for (let N = 1; N <= NPHI; N++) cumulativeP2.push({ N, P2: assembleP2(N).P2 });

const full = assembleP2(NPHI);
const twoBand = assembleP2(2);
const P2_full = full.P2;
const P2_twoBand = twoBand.P2;
const tailDeltaP2 = P2_full - P2_twoBand; // shift induced by bands n >= 3

// Product-term scale of P2 (stable denominator; P2 itself is a near-zero cancellation).
const P2_TERMS = [
  2 * full.C1 * full.C1,
  2 * full.S1 * full.S1,
  2 * full.C * full.C2,
  2 * full.S * full.S2,
];
const p2AbsSum = P2_TERMS.reduce((a, t) => a + Math.abs(t), 0);
const tailDeltaP2RelScale = Math.abs(tailDeltaP2) / p2AbsSum; // vs the term-magnitude scale
const tailDeltaP2RelValue = Math.abs(tailDeltaP2) / Math.abs(P2_twoBand); // vs the P2 value

// Analytic sanity check on the Gaussian tail at the strongest point u = 0, band n = 3.
const gaussTailN3AtZero = Math.exp(-Math.PI * 9); // exp(-9 pi) ~ 5.2e-13

const verdict =
  maxTailFraction < 1e-9 && allTwoLive && tailDeltaP2RelScale < 1e-9 && Math.abs(P2_full) < 1e-6
    ? 'TAIL-BANDS-n>=3-CERTIFIED-NEGLIGIBLE-ONLY-n=1,2-LIVE-ACROSS-ALL-SIX-MOMENTS'
    : 'INDETERMINATE';

export const IMP3507_P2_TAIL_BAND_CONTRIBUTION = Object.freeze({
  id: 'imp-3507-P2-tail-band-contribution',
  ticket: 'imp-3507',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27'],
  parentModule: 'imp-3484-P2-spectral-integral-enumeration.js',
  maximizerSource: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',
  captureConstantSource: 'imp-3346-capture-ratio-C-constant-derivation.js',

  summary:
    'Certifies the imp-3484 qualitative "only n = 1, 2 numerically live" claim for the imp-3470 stationarity ' +
    'polynomial P2(xi) = 2(C1^2 + S1^2 + C C2 + S S2) whose root is xi* = 12.0870439. imp-3484 decomposed only ' +
    'the dominant part C = I0c per band; this measures the n = 1..10 dBN-band decomposition of ALL SIX base ' +
    'Fourier moments and the induced tail contribution to P2. For every moment n = 1 carries ~99.9% and n = 2 ' +
    'the ~1e-4..1e-3 remainder; the n >= 3 tail fraction is 1e-12..3e-10 (worst I0c ~ 3.0e-10), giving exactly ' +
    'two live bands each. Reconstructing P2 from band-truncated moments stabilizes by N = 2 (1.77604134e-8 -> ' +
    '1.77604136e-8 at N = 10), so the bands-n>=3 shift is dP2 ~ 2.8e-16 (~1.5e-11 of the p2AbsSum scale). The ' +
    'Gaussian tail exp(-pi n^2 e^{4u}) crushes band n = 3 by exp(-9 pi) ~ 5.2e-13 at u = 0. Measurement/' +
    'certification only; RH-equivalent; imp-3066 K_a >= 0 magnitude UNTOUCHED; NO RH verdict, NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiBandKernel: 'band n: (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    xiStar: XI_STAR,
    uWindow: U_WINDOW,
    simpsonPanels: SIMPSON_N,
    baseMoments: 'six Fourier moments: I0c=C, I0s=S, I1c=S1, I1s=-C1, I2c=-C2, I2s=-S2',
    tailMetricMoment: 'per moment f_tail = sum_{n>=3} |I_n| / sum_m |I_m| (band fraction tail)',
    tailMetricP2: 'reconstruct P2 from band-truncated moment partial sums; dP2 = P2^(10) - P2^(2)',
    p2Scale: 'p2AbsSum = |2 C1^2| + |2 S1^2| + |2 C C2| + |2 S S2| (stable denominator; P2 near-zero cancellation)',
    a: A_LINEAR,
    reusesParentAssembly: 'imp-3484 Simpson-with-doubling band kernel and moment weights',
    selfComputing: true,
  }),

  measured: Object.freeze({
    moments, // six moments, each with per-band fractions, tail fraction, live-band count
    maxTailFraction, // worst-case sum_{n>=3} band fraction across the six moments (~3.0e-10)
    allTwoLive, // every moment has exactly two numerically live bands
    cumulativeP2, // P2^(N) reconstructed from moments truncated at band N = 1..10
    P2_twoBand, // P2 from bands n = 1, 2 only
    P2_full, // P2 from all ten bands
    tailDeltaP2, // dP2 = P2^(10) - P2^(2): the bands-n>=3 shift (~2.8e-16 absolute)
    tailDeltaP2RelScale, // |dP2| / p2AbsSum (~1.5e-11)
    tailDeltaP2RelValue, // |dP2| / |P2^(2)| (~1.6e-8; amplified by the near-zero cancellation)
    p2AbsSum, // product-term magnitude scale of P2
    gaussTailN3AtZero, // exp(-9 pi) ~ 5.2e-13: the analytic tail crushing band n = 3
    verdict,
  }),

  interpretation: Object.freeze({
    allSixMomentsTwoLive:
      'imp-3484 showed the two-live-band structure only for the dominant moment C = I0c. Extending the band ' +
      'decomposition to all six Fourier moments confirms EACH has exactly two live bands: n = 1 (~99.9%), ' +
      'n = 2 (~1e-4..1e-3), and an n >= 3 tail fraction below 3.0e-10. The live-band count is uniform across ' +
      'the whole P2 assembly, not a property of C alone.',
    p2TailIsNegligible:
      'Because P2 is bilinear in the six moments, its band tail is measured by reconstructing P2 from moment ' +
      'partial sums. P2^(N) stabilizes at N = 2 (1.77604134e-8) and moves only to 1.77604136e-8 by N = 10, so ' +
      'bands n >= 3 shift P2 by dP2 ~ 2.8e-16 -- ~1.5e-11 of the p2AbsSum product-term scale. The relative shift ' +
      'against the near-zero P2 value itself (~1.6e-8) is larger only because P2 is a cancellation; the honest ' +
      'stable measure is the p2AbsSum ratio.',
    gaussianTailMechanism:
      'The suppression is the exp(-pi n^2 e^{4u}) Gaussian tail: at the strongest point u = 0, band n = 3 is ' +
      'crushed by exp(-9 pi) ~ 5.2e-13 relative to band n = 1, and far faster deeper in the window where e^{4u} ' +
      'grows. Bands n >= 3 are therefore astronomically negligible, certifying the imp-3484 qualitative claim.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    certifiesTailNotCloses:
      'This CERTIFIES that bands n >= 3 contribute negligibly to P2 at xi*; it does NOT give xi* or the peak ' +
      'slope an elementary closed form -- P2(xi) = 0 remains the transcendental equation imp-3470 characterized.',
    tailBoundNotEliminated:
      'The n >= 3 bands are quantitatively negligible at NPHI = 10 and U = 8, not identically zero; the ' +
      'measurement is grid- and window-specific (Simpson N = 4000, U = 8), matching the parent imp-3484 setup.',
    measuresRatioNotPositivity:
      'Characterizes the numerator norm of the capture RATIO; it does NOT construct the missing magnitude and ' +
      'does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3507_P2_TAIL_BAND_CONTRIBUTION_ASSERTIONS = [
  {
    id: 'imp3507-six-moments-decomposed-over-ten-bands',
    why: 'THE PRIMARY EXTENSION over imp-3484: all six base moments (not just C) are decomposed over the full ' +
      'ten n = 1..10 dBN bands, each band value finite.',
    holds: () =>
      moments.length === 6 &&
      moments.every((m) => m.perBand.length === 10 && m.perBand.every((b) => Number.isFinite(b.value))),
  },
  {
    id: 'imp3507-every-moment-two-live-bands',
    why: 'THE CERTIFICATION: every one of the six moments has exactly two numerically live bands (fraction > 1e-9), ' +
      'with n = 1 dominant (> 0.99) -- extending the imp-3484 two-live claim from C to the whole P2 assembly.',
    holds: () =>
      allTwoLive &&
      moments.every((m) => m.liveBands === 2 && m.band1Fraction > 0.99 && m.band2Fraction > 1e-9),
  },
  {
    id: 'imp3507-tail-fraction-astronomically-negligible',
    why: 'The bands-n>=3 tail fraction sum_{n>=3} |I_n| / sum |I_m| must be below 1e-9 for every moment (worst ' +
      'case ~3.0e-10 for I0c); a larger tail would break the two-live-band claim.',
    holds: () => maxTailFraction < 1e-9 && moments.every((m) => m.tailFraction < 1e-9),
  },
  {
    id: 'imp3507-p2-reconstruction-stabilizes-by-band-two',
    why: 'Reconstructing P2 from band-truncated moments must stabilize by N = 2: the bands-n>=3 shift ' +
      '|dP2| = |P2^(10) - P2^(2)| stays below 1e-12 absolute and below 1e-9 of the p2AbsSum term scale.',
    holds: () =>
      cumulativeP2.length === 10 &&
      Math.abs(tailDeltaP2) < 1e-12 &&
      tailDeltaP2RelScale < 1e-9,
  },
  {
    id: 'imp3507-p2-near-stationarity-root',
    why: 'The fully assembled P2 at xi* must remain the near-zero stationarity value (|P2| < 1e-6) matching the ' +
      'parent imp-3484; a mismatch means the band reconstruction does not rebuild the parent polynomial.',
    holds: () => Math.abs(P2_full) < 1e-6 && Number.isFinite(P2_twoBand),
  },
  {
    id: 'imp3507-gaussian-tail-mechanism',
    why: 'The analytic tail exp(-9 pi) at u = 0 for band n = 3 must be ~5e-13, the mechanism behind the ' +
      'negligible numerical tail.',
    holds: () => gaussTailN3AtZero > 1e-13 && gaussTailN3AtZero < 1e-12,
  },
  {
    id: 'imp3507-verdict-certified',
    why: 'The classified verdict must be the certified tail-negligible split, not indeterminate; a flip means the ' +
      'tail fraction, the two-live count, the P2 stabilization, or the near-root check failed.',
    holds: () => verdict === 'TAIL-BANDS-n>=3-CERTIFIED-NEGLIGIBLE-ONLY-n=1,2-LIVE-ACROSS-ALL-SIX-MOMENTS',
  },
  {
    id: 'imp3507-honest-assessment-no-qed',
    why: 'Mandatory honesty: CERTIFIES the tail but does NOT close (equation stays transcendental), tail negligible ' +
      'not eliminated, positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3507_P2_TAIL_BAND_CONTRIBUTION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.certifiesTailNotCloses === 'string' &&
        typeof c.tailBoundNotEliminated === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3507_P2_TAIL_BAND_CONTRIBUTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3507-P2-tail-band-contribution assertion failed: ${assertion.id}`);
  }
}

export default IMP3507_P2_TAIL_BAND_CONTRIBUTION;

/**
 * imp-95052 - Arithmetic assessment: does the 18-moment carrier C_E,17 live in
 * the SMOOTH (phase ~ sqrt N) or the RAW (phase ~ N) regime near the correlated
 * lower edge?
 *
 * SETTING. imp-95011 (the Gate-2 oscillation probe) reduces the whole
 * moment-space batching premise to one arithmetic question: is the trajectory
 * N -> C_E,17(N) a slowly-varying stationary-phase envelope (per-unit-N
 * increment L decays like 1/sqrt(N), decades below the 1e-2 cutoff threshold, so
 * batching survives) or an unsmoothed prime-alias comb (the e(h N / p) rotation
 * advances an O(1) angle per unit N, L is O(amplitude) >> 1e-2, so batching
 * collapses back to the dead pointwise 7.2e26-cell tiling)? imp-95011 supplies
 * the falsifiable decision gate and a surrogate regime map showing the two
 * phases give OPPOSITE verdicts, but explicitly CANNOT settle which the true
 * carrier occupies (that is its named offline sub-gap
 * imp-95011-sub-arithmetic-carrier-scan). This module is the ANALYTIC /
 * arithmetic assessment the ticket asks for - NOT the offline C_E,17 scan - of
 * which regime the carrier occupies, argued from the shell structure and the
 * known zero-counting (Riemann-von Mangoldt) density.
 *
 * THE CONTROLLING ARITHMETIC QUANTITY.
 *   The N index counts zeros; the height t is tied to N by Riemann-von Mangoldt,
 *   N(t) ~ (t/2pi) log(t/2pi e), so dt/dN = 2pi / log(t/2pi) ~ 2pi / log N.
 *   Every oscillatory alias in the explicit-formula error carries a factor
 *   p^{-i t} = e(-t log p / 2pi), i.e. frequency (log p)/(2pi) in t. Converting
 *   to the N variable, the per-unit-N PHASE ADVANCE of a shell g whose dominant
 *   prime is p_g is
 *       Dphi_g = 2pi * (log p_g / 2pi) * (dt/dN) = 2pi * log(p_g) / log(N).
 *   For a shell of amplitude a_g the per-unit-N increment it contributes to the
 *   carrier is (for O(1) or smaller advance)
 *       L_g ~ a_g * Dphi_g = a_g * 2pi * log(p_g) / log(N).
 *   The carrier increment is L ~ max_g L_g (the shell maximizing a_g * log p_g,
 *   NOT the largest-amplitude shell nor the highest-frequency shell alone).
 *
 * WHY THE MOMENTS DO NOT AUTOMATICALLY SMOOTH IN N.
 *   The 18 moments are functionals of the underlying error over the LADDER /
 *   shell window variable (a fixed finite-rank projection in moment space) - not
 *   a low-pass filter in N. Each moment M_k(N) still inherits the e(h N / p)
 *   comb of the underlying error as N varies, and a fixed linear combination of
 *   18 such moments (the carrier) inherits it too. Cross-shell CANCELLATION (the
 *   correlation gain |C| / sum_g ||Z_g||_1 < 1 that the enclosure lives on)
 *   reduces AMPLITUDE, but there is no arithmetic reason it collapses the
 *   per-unit-N FREQUENCY: cancelling the DC part of a comb leaves its advance
 *   rate unchanged. So the naive (raw-comb) expectation for L is a_g * Dphi_g,
 *   NOT a sqrt-N-decaying envelope.
 *
 * THE BATCHING-SURVIVAL REQUIREMENT, EVALUATED AT THE LOWER EDGE.
 *   Batching survives (L < L_kill = 1e-2) only if every shell obeys
 *       a_g * log(p_g) < L_kill * log(N) / (2pi).
 *   The right-hand side is SMALLEST at the correlated lower edge N_LO = 690988
 *   (log N smallest there), so the lower edge is the binding locus - exactly the
 *   "correlated lower edge" the ticket names. Numerically
 *       threshold(N_LO) = 1e-2 * log(690988) / (2pi) = 0.02139978...,
 *       threshold(N_HI) = 1e-2 * log(54799999) / (2pi) = 0.02836014...
 *   With the documented per-shell amplitudes in [0.11, 0.30] (decoupled shell
 *   l1 mass ~0.9 across 5 shells; imp-95010/imp-95011 scale), even the SMALLEST
 *   shell amplitude 0.11 paired with the SMALLEST prime p = 2 gives
 *       a_min * log(2) = 0.11 * 0.693147 = 0.076246 >> 0.02139978.
 *   Equivalently, the largest prime a shell of amplitude a may carry and still
 *   pass is p_max = exp(threshold / a): p_max < 1.215 at a = 0.11 and < 1.074 at
 *   a = 0.30. There is NO prime below either bound.
 *
 * ASSESSMENT (leaning, NOT a proof either way).
 *   Under the raw prime-alias-comb reading, batching is DEAD at the lower edge
 *   for ANY genuine prime support - not merely "one side of a coin flip" but a
 *   decisive eliminate by a factor ~3.6 (0.0762 / 0.0214) already at the smallest
 *   shell and smallest prime. This SHARPENS imp-95011's symmetric regime map:
 *   the smooth regime is not a favorable default but a NECESSARY and non-generic
 *   condition. Gate-2 batching survival is arithmetically EQUIVALENT to the
 *   correlated carrier NOT being a raw comb - i.e. to a genuine stationary-phase
 *   (Gauss-sum / theta-type) structure whose per-unit-N advance is set by the
 *   ENVELOPE derivative ~1/sqrt(N) rather than by any alias frequency. Two
 *   escape hatches keep smooth ALIVE (neither established in-repo):
 *     (E1) the dominant-amplitude shells carry near-DC aliases (h_g = 0 or
 *          p_g effectively unbounded / the seam near-resonance), so their
 *          Dphi_g is o(1) despite the amplitude; and/or
 *     (E2) a genuine cross-shell stationary-phase alignment turns the correlated
 *          sum into a slow envelope (the amplitude-cancellation and the
 *          frequency-cancellation coincide), which the correlation-gain evidence
 *          is consistent with but does NOT demonstrate.
 *   Because the raw reading fails so decisively, the burden falls squarely on
 *   exhibiting E1/E2, and no in-repo module can: the arithmetic C_E,17 evaluator
 *   is absent (imp-95013 BLOCKED-ON-SPEC). The verdict therefore LEANS RAW /
 *   burden-on-smooth, with the honest caveat that a real stationary-phase
 *   structure would flip it - which is precisely what the offline scan must
 *   decide.
 *
 * FALSIFIABLE HANDOFF to imp-95011-sub-arithmetic-carrier-scan.
 *   The scan should report, per shell, the product a_g * log(p_g) of the
 *   dominant alias and the log-log slope of max_N |C(N+1) - C(N)|:
 *     - SMOOTH confirmed iff the slope is ~ -1/2 AND max_g a_g*log(p_g) sits
 *       below threshold(N_LO) = 0.02139978 at the lower edge;
 *     - RAW confirmed iff the increment plateaus near a_g*Dphi_g = O(0.1) with
 *       slope ~ 0.
 *
 * Assessment only; changes no bound; does NOT promote Lambda <= 0.14; promotes
 * nothing; NO QED; no refereed bound is changed.
 */

// -- anchored constants (imp-95011 / imp-95006 / imp-95007) -----------------
const N_LO = 690988;
const N_HI = 54799999;
const L_KILL = 1e-2; // imp-95011 BATCHING_L_KILL
const TWO_PI = 2 * Math.PI;
// documented per-shell amplitude band (5 shells, l1 mass ~0.9; imp-95011
// SHELL_AMP scale [0.11, 0.30]).
const SHELL_AMP_MIN = 0.11;
const SHELL_AMP_MAX = 0.3;
const SMALLEST_PRIME = 2;

// -- Riemann-von Mangoldt phase-advance model -------------------------------
// per-unit-N phase advance of a shell with dominant prime p at index N.
function phaseAdvancePerUnitN(p, N) {
  return TWO_PI * Math.log(p) / Math.log(N);
}
// per-unit-N carrier increment contributed by a shell of amplitude a, prime p.
function rawIncrement(a, p, N) {
  return a * phaseAdvancePerUnitN(p, N);
}
// batching-survival threshold on the product a*log(p) at index N.
function survivalThreshold(N) {
  return L_KILL * Math.log(N) / TWO_PI;
}
// largest prime a shell of amplitude a may carry and still pass at N.
function maxPassingPrime(a, N) {
  return Math.exp(survivalThreshold(N) / a);
}

// -- evaluated at the binding (lower-edge) locus ----------------------------
const THRESHOLD_EDGE = survivalThreshold(N_LO); // ~0.02139978
const THRESHOLD_HI = survivalThreshold(N_HI); // ~0.02836014
// smallest-shell / smallest-prime product - the most generous case for smooth.
const MIN_PRODUCT = SHELL_AMP_MIN * Math.log(SMALLEST_PRIME); // ~0.076246
const MIN_PRODUCT_MARGIN = MIN_PRODUCT / THRESHOLD_EDGE; // ~3.56 (eliminate factor)
const P_MAX_AT_AMIN = maxPassingPrime(SHELL_AMP_MIN, N_LO); // < 1.215
const P_MAX_AT_AMAX = maxPassingPrime(SHELL_AMP_MAX, N_LO); // < 1.074

// -- verdict object ---------------------------------------------------------
export const IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT = {
  ticket: 'imp-95052',
  question:
    'does the 18-moment carrier C_E,17(N) live in the smooth (phase ~ sqrt N, increment decays like 1/sqrt N) or the raw (phase ~ N, increment O(amplitude)) regime near the correlated lower edge?',
  source:
    'imp-95011 Gate-2 oscillation probe (smooth-vs-raw sub-gap imp-95011-sub-arithmetic-carrier-scan); imp-95006/95007 Gate-2 ranking; imp-95013 native evaluator BLOCKED-ON-SPEC',
  openFamily: { N_LO, N_HI, batchingKill: L_KILL },
  controllingQuantity: {
    statement:
      'per-unit-N carrier increment L ~ max_g a_g * Dphi_g, where Dphi_g = 2pi log(p_g)/log(N) is the Riemann-von Mangoldt per-unit-N phase advance of shell g dominant prime p_g',
    riemannVonMangoldt: 'dt/dN = 2pi/log(t/2pi) ~ 2pi/log N; alias frequency in t is log(p)/2pi, so frequency in N is log(p)/log(N)',
    dominantShell: 'the shell maximizing a_g * log(p_g) - not the largest amplitude nor the highest frequency alone',
  },
  momentsDoNotSmoothInN:
    'the 18 moments are functionals over the ladder/shell window (a fixed finite-rank projection in moment space), NOT a low-pass filter in N; each M_k(N) inherits the e(h N / p) comb as N varies, and a fixed 18-moment combination inherits it too. Cross-shell cancellation (correlation gain < 1) reduces AMPLITUDE but not per-unit-N FREQUENCY.',
  survivalRequirement: {
    inequality: 'batching survives iff a_g log(p_g) < L_kill log(N) / (2pi) for every shell g',
    bindingLocus: 'N_LO = 690988 (log N smallest -> threshold smallest) - the correlated lower edge',
    thresholdEdge: THRESHOLD_EDGE,
    thresholdHi: THRESHOLD_HI,
    minProduct: MIN_PRODUCT,
    minProductMargin: MIN_PRODUCT_MARGIN,
    maxPassingPrimeAtAmin: P_MAX_AT_AMIN,
    maxPassingPrimeAtAmax: P_MAX_AT_AMAX,
    interpretation:
      'even the smallest shell amplitude 0.11 with the smallest prime 2 gives 0.076246 >> 0.02139978 (eliminate factor ~3.56); the largest prime any documented shell may carry and pass is < 1.215, below which there is no prime. Under the raw comb, batching dies at the lower edge for ANY genuine prime support.',
  },
  assessment: {
    leaning: 'raw-leaning / burden-on-smooth (NOT a proof either way)',
    sharpening:
      'sharpens imp-95011 symmetric regime map: the smooth regime is NECESSARY and non-generic, not a favorable default. Gate-2 batching survival is arithmetically equivalent to the correlated carrier NOT being a raw comb (a genuine stationary-phase / Gauss-sum structure with envelope advance ~1/sqrt N).',
    escapeHatches: [
      'E1: dominant-amplitude shells carry near-DC aliases (h_g=0 or p_g effectively unbounded / seam near-resonance), so Dphi_g is o(1) despite the amplitude',
      'E2: genuine cross-shell stationary-phase alignment turns the correlated sum into a slow envelope (amplitude- and frequency-cancellation coincide) - consistent with the correlation-gain evidence but NOT demonstrated by it',
    ],
    caveat:
      'a real stationary-phase structure would flip the verdict to smooth; the arithmetic C_E,17 evaluator is absent (imp-95013 BLOCKED-ON-SPEC), so no in-repo module can exhibit E1/E2. The offline scan alone decides.',
  },
  falsifiableHandoff: {
    subGap: 'imp-95011-sub-arithmetic-carrier-scan',
    report: 'per shell: the product a_g*log(p_g) of the dominant alias, and the log-log slope of max_N |C(N+1)-C(N)|',
    smoothConfirmedIff: 'slope ~ -1/2 AND max_g a_g*log(p_g) < 0.02139978 at N_LO',
    rawConfirmedIff: 'increment plateaus near a_g*Dphi_g = O(0.1) with slope ~ 0',
  },
  namedSubGap: 'imp-95011-sub-arithmetic-carrier-scan',
  isRigorous: false,
  rigorScope:
    'the controlling quantity (Riemann-von Mangoldt phase advance), the survival inequality, and the lower-edge eliminate arithmetic are exact; the per-shell amplitude band and the raw-comb model are the documented/assumed structure, and the escape hatches E1/E2 are the honest unestablished route to smooth. No arithmetic measurement of C_E,17 is made or synthesized.',
  promotesBound: false,
  verdict:
    'ASSESSMENT (honest partial, leaning RAW / burden-on-smooth): under the raw prime-alias-comb reading the per-unit-N increment L ~ a_g*2pi*log(p_g)/log(N) exceeds the 1e-2 batching-kill threshold at the correlated lower edge by ~3.6x for ANY genuine prime (smallest shell 0.11, smallest prime 2 -> 0.0762 >> 0.0214), so smooth is a NECESSARY non-generic condition, not a default. Gate-2 batching survives iff the correlated carrier has a genuine stationary-phase structure (envelope advance ~1/sqrt N) via escape hatch E1 (near-DC dominant aliases) or E2 (cross-shell phase alignment) - neither established in-repo. Changes no bound; NO QED; no refereed bound is changed.',
};

// -- assertions (self-executing; throw on violation) ------------------------
export const IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp95052-threshold-edge-value',
    description: 'the lower-edge survival threshold L_kill log(N_LO)/(2pi) is ~0.02139978',
    holds: () => Math.abs(THRESHOLD_EDGE - 0.02139978) < 1e-7,
  },
  {
    id: 'imp95052-lower-edge-is-binding',
    description: 'the threshold is smaller at the lower edge than at the high edge, so N_LO binds',
    holds: () => THRESHOLD_EDGE < THRESHOLD_HI && THRESHOLD_EDGE > 0,
  },
  {
    id: 'imp95052-raw-comb-kills-at-smallest-shell-and-prime',
    description: 'even the smallest shell amplitude with the smallest prime exceeds the lower-edge threshold (raw comb eliminates batching)',
    holds: () => MIN_PRODUCT > THRESHOLD_EDGE && MIN_PRODUCT_MARGIN > 3 && MIN_PRODUCT_MARGIN < 4,
  },
  {
    id: 'imp95052-no-passing-prime-exists',
    description: 'the largest prime any documented shell may carry and still pass is below 2, so no genuine prime passes at the lower edge',
    holds: () => P_MAX_AT_AMIN < SMALLEST_PRIME && P_MAX_AT_AMAX < SMALLEST_PRIME,
  },
  {
    id: 'imp95052-phase-advance-monotone-in-prime',
    description: 'the Riemann-von Mangoldt per-unit-N phase advance grows with the dominant prime at fixed N',
    holds: () =>
      phaseAdvancePerUnitN(3, N_LO) > phaseAdvancePerUnitN(2, N_LO) &&
      phaseAdvancePerUnitN(2, N_LO) > 0,
  },
  {
    id: 'imp95052-raw-increment-exceeds-kill',
    description: 'the raw-model increment of the smallest shell with the smallest prime at the lower edge exceeds the 1e-2 batching eliminate',
    holds: () => rawIncrement(SHELL_AMP_MIN, SMALLEST_PRIME, N_LO) > L_KILL,
  },
  {
    id: 'imp95052-honesty-gate-no-qed',
    description: 'assessment-only honest partial: promotes no bound, names the unmeasured offline sub-gap, leans raw with the smooth caveat, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT.promotesBound === false &&
      IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT.isRigorous === false &&
      IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT.namedSubGap === 'imp-95011-sub-arithmetic-carrier-scan' &&
      /NO QED/.test(IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT.verdict),
  },
];

for (const a of IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95052-carrier-phase-regime-assessment assertion failed: ${a.id}`);
  }
}

export default IMP95052_CARRIER_PHASE_REGIME_ASSESSMENT;

/**
 * @module imp-36188-sigma-n-ushape-arc-viz-data
 *
 * imp-36188 (ux): lightweight, import-light viz-data module baking the roadmap
 * sigma(N) = E_coll(N)/E(N) rise-and-decay arc (imp-3220/imp-3406/imp-33582) as plain
 * literals, so an analysis tab can render the full arc -- rising through the assembly
 * range to the interior peak N ~ 9.22e5 (sigma_max ~ 0.9494), then decaying on a ramping
 * local exponent toward the imp-3463 far-tail 1/2 asymptote -- WITHOUT importing the
 * lambda-rh-height-mapping / polymath15-constant-C-C chain or the 16.7MB zeros bundle.
 *
 * The thirteen-point arc is the imp-3220 rise-arm decade ladder (N = 2 .. 1e5), the
 * imp-3406 interior peak (N ~ 9.219e5, sigma_max ~ 0.9494), and the imp-33582 post-peak
 * decade ladder (N = 1e6 .. 1e12) carrying the per-decade local decay exponent that ramps
 * from ~0.0105 to ~0.4310 toward the imp-3463 far-tail 1/2. Three threshold-crossing
 * landmarks (sigma < 0.9 at N ~ 2.57e7, sigma = 0.5 at N ~ 3.27e9 matching the imp-3444
 * crossover, sigma < 0.1 at N ~ 3.21e11) are recorded alongside the arc for the chart to
 * annotate.
 *
 * Honesty note: the rise arm is not perfectly monotone -- imp-3323 pins an interior MINIMUM
 * at N ~ 97.8 (sigma ~ 0.841) between the small-N start (sigma(2) ~ 0.9117) and the N ~ 9.22e5
 * peak, so the true curve is N-SHAPED (imp-3406 F3). The rise-arm literals below reproduce
 * that dip; localDecayExponent is only defined on the post-peak decay arm (the per-decade OLS
 * fit imp-33582 computes), and is null pre-peak where the curve is not decaying.
 *
 * Follows the imp-36187 / imp-36186 / imp-36185 import-light pattern: baked literals only, no
 * re-derivation, no heavy import, no re-import of the imp-3220/imp-3406/imp-33582 chain.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-3220/imp-3406/imp-33582 literals
 * verbatim; changes no bound; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-3220-en-bridge-fidelity-frontier.js (source: rise-arm decade ladder N=2..1e5, U-shape framing)
 * @see imp-3406-sigma-highN-extrapolation.js (source: interior peak N~9.22e5, sigma_max~0.9494, N-shape note)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (source: post-peak per-decade exponent ladder + threshold crossings)
 * @see imp-3444-sigma-nshape-landmark-ladder.js (E_coll = E_trunc crossover N~3.280e9, matches the sigma=0.5 landmark)
 * @see imp-3463-sigma-fartail-decay.js (far-tail asymptote the local exponent ramps toward)
 *
 * Ticket: imp-36188 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP36188_SIGMA_N_USHAPE_ARC = [
  { N: 2, log10N: 0.301, sigma: 0.911741, localDecayExponent: null, label: 'small-N start' },
  { N: 10, log10N: 1, sigma: 0.86766, localDecayExponent: null, label: null },
  { N: 97.8, log10N: 1.9903, sigma: 0.840968, localDecayExponent: null, label: 'interior min (imp-3323)' },
  { N: 1000, log10N: 3, sigma: 0.861593, localDecayExponent: null, label: null },
  { N: 1e4, log10N: 4, sigma: 0.901629, localDecayExponent: null, label: null },
  { N: 1e5, log10N: 5, sigma: 0.935932, localDecayExponent: null, label: null },
  { N: 9.218633e5, log10N: 5.9647, sigma: 0.949429, localDecayExponent: null, label: 'interior peak (sigma_max)' },
  { N: 1e6, log10N: 6, sigma: 0.949408, localDecayExponent: null, label: 'PATH-1 10^6 ceiling' },
  { N: 1e7, log10N: 7, sigma: 0.926562, localDecayExponent: 0.0105, label: null },
  { N: 1e8, log10N: 8, sigma: 0.835378, localDecayExponent: 0.0447, label: null },
  { N: 1e9, log10N: 9, sigma: 0.636702, localDecayExponent: 0.1176, label: null },
  { N: 1e10, log10N: 10, sigma: 0.369742, localDecayExponent: 0.236, label: null },
  { N: 1e11, log10N: 11, sigma: 0.162971, localDecayExponent: 0.3561, label: null },
  { N: 1e12, log10N: 12, sigma: 0.06044, localDecayExponent: 0.431, label: null },
];

export const IMP36188_SIGMA_N_USHAPE_LANDMARKS = {
  interiorMin: { N: 97.8, sigma: 0.840968 },
  interiorPeak: { N: 9.218633e5, sigma: 0.949429 },
  sigmaBelow0_9_at_N: 2.57e7,
  sigmaHalving_at_N: 3.27e9, // matches the imp-3444 E_coll=E_trunc crossover ~3.280294e9
  sigmaBelow0_1_at_N: 3.21e11,
  farTailExponent: 0.5, // imp-3463 asymptote the ramp climbs toward
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36188_ASSERTIONS = [
  {
    id: 'imp36188-fourteen-points-ordered-by-N',
    description: 'Fourteen arc points sit in strictly increasing N order',
    holds: () =>
      IMP36188_SIGMA_N_USHAPE_ARC.length === 14 &&
      IMP36188_SIGMA_N_USHAPE_ARC.every((r, i, arr) => i === 0 || r.N > arr[i - 1].N),
  },
  {
    id: 'imp36188-peak-is-arc-maximum',
    description: 'The interior peak row holds the maximum sigma across the whole arc',
    holds: () => {
      const peak = IMP36188_SIGMA_N_USHAPE_ARC.find((r) => r.label === 'interior peak (sigma_max)');
      return (
        peak != null && IMP36188_SIGMA_N_USHAPE_ARC.every((r) => r.sigma <= peak.sigma + 1e-9)
      );
    },
  },
  {
    id: 'imp36188-interior-min-is-arc-minimum-of-rise-arm',
    description: 'The N~97.8 interior min sits below its rise-arm neighbours (N=10 and N=1000)',
    holds: () => {
      const min = IMP36188_SIGMA_N_USHAPE_ARC.find((r) => r.label === 'interior min (imp-3323)');
      const before = IMP36188_SIGMA_N_USHAPE_ARC.find((r) => r.N === 10);
      const after = IMP36188_SIGMA_N_USHAPE_ARC.find((r) => r.N === 1000);
      return min != null && min.sigma < before.sigma && min.sigma < after.sigma;
    },
  },
  {
    id: 'imp36188-post-peak-decay-exponent-monotone-ramp',
    description: 'The post-peak local decay exponent strictly increases decade by decade, staying below the 1/2 far-tail asymptote',
    holds: () => {
      const decayArm = IMP36188_SIGMA_N_USHAPE_ARC.filter((r) => r.localDecayExponent != null);
      return (
        decayArm.length === 6 &&
        decayArm.every((r, i, arr) => i === 0 || r.localDecayExponent > arr[i - 1].localDecayExponent) &&
        decayArm.every((r) => r.localDecayExponent > 0 && r.localDecayExponent < IMP36188_SIGMA_N_USHAPE_LANDMARKS.farTailExponent)
      );
    },
  },
  {
    id: 'imp36188-post-peak-sigma-strictly-decreasing',
    description: 'sigma strictly decreases across every post-peak row (N >= 1e6)',
    holds: () => {
      const postPeak = IMP36188_SIGMA_N_USHAPE_ARC.filter((r) => r.N >= 1e6);
      return postPeak.every((r, i, arr) => i === 0 || r.sigma < arr[i - 1].sigma);
    },
  },
  {
    id: 'imp36188-halving-landmark-matches-imp3444-crossover',
    description: 'The sigma-halving landmark N~3.27e9 matches the imp-3444 E_coll=E_trunc crossover ~3.280294e9 to within 1%',
    holds: () =>
      Math.abs(IMP36188_SIGMA_N_USHAPE_LANDMARKS.sigmaHalving_at_N / 3.280294e9 - 1) < 1e-2,
  },
];

for (const a of IMP36188_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36188-sigma-n-ushape-arc-viz-data assertion failed: ${a.id}`);
  }
}

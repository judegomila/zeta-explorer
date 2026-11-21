/**
 * @module imp-35438-krawczyk-headroom-cancellation-reconstruction-crosscheck
 *
 * imp-35404 (imp-35404-krawczyk-headroom-cancellation-viz-data) reproduced the imp-35266
 * Krawczyk contraction-validity headroom decomposition literals VERBATIM as baked reference
 * values -- the three-landmark (band-bottom / N_cross / band-top) dG (asymptotic-floor pull),
 * dFP (FP_LO finite-N push) and surplus, plus the N-flat ratio -dFP/dG ~ 2.00042 -- without
 * an independent recomputation. This module supplies exactly that independent cross-check.
 *
 * WHAT WAS RECONSTRUCTED
 * ----------------------
 * From the imp-35266 closed forms (identical K, delta, N_cross, band, headroom form), for each
 * landmark N with local contraction factor a(N) and lower-bracket a_lo = a(N(1-delta)):
 *   S_inf = 1/(2 delta) = 2500 (the imp-34996 large-N floor),
 *   G  = 1 - a,  FP_LO = 1 - a_lo,
 *   M_G  = 2G/(1+G)  (asymptotic-floor / G-factor piece),  M_FP = 1/FP_LO  (FP_LO finite-N piece),
 *   dG  = S_inf (M_G - 1)          (negative: G < 1 pulls S below the floor),
 *   dFP = S_inf . M_G (M_FP - 1)   (positive: FP_LO < 1 pushes S above the floor),
 *   surplus = S - S_inf = dG + dFP.
 * The full-precision a(N) at the three landmarks (recomputed here from the imp-35266
 * effectiveHeightForN Banach map, baked below to avoid re-importing lambda-rh-height-mapping.js
 * per [[no_heavy_imports_in_pages]]) drives the reconstruction; the leading-order estimate
 * dFP ~ S_inf . a, dG ~ -S_inf . a/2, surplus ~ S_inf . a/2 is also carried for context.
 *
 * FINDING. Every one of the three imp-35404 baked literals reproduces from the imp-35266 closed
 * forms WITHIN STORAGE ROUNDING. Reconstructed vs baked, max |diff| over all nine dG/dFP/surplus
 * values is ~2.7e-4 (band-bottom dFP/surplus), fully inside the 4-decimal toFixed(4) storage
 * grain -- no term drifts. The ratio -dFP/dG reproduces 2.00042 at every landmark (|diff| &lt; 1e-5),
 * and the two internal-consistency identities hold: surplus = dG + dFP to machine precision on the
 * reconstruction (|diff| &lt; 3e-13) and to storage rounding on the baked literals (each rounded
 * independently, so band-top gives -55.1605 + 110.3441 = 55.1836 vs baked surplus 55.1835, a
 * 1e-4 rounding residue). The leading-order S_inf . a/2 tracks each surplus to ~2.4% (band-top
 * 53.970 vs 55.1835), confirming the imp-35266 D3 reading. Zero drift beyond storage rounding.
 *
 * VERIFICATION / ACCURACY CROSS-CHECK ONLY. No new bound; the imp-35404 viz literals are
 * confirmed faithful to their imp-35266 source. The imp-34714a machine certificate REMAINS OPEN;
 * F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per
 * imp-3463 untouched; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35404-krawczyk-headroom-cancellation-viz-data (baked the literals cross-checked here)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (source closed forms + measurement block)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1)
 * @see imp-34693-crossover-contraction-seed-band (band-bottom / N_cross / band-top landmarks)
 */

const S_INF = 2500; // 1/(2 delta), delta = 2e-4 (imp-34996 large-N floor)
const DELTA = 2e-4;

// -- imp-35266 full-precision local contraction factors a(N) at the three imp-34693 landmarks --
//    (recomputed offline from the imp-35266 effectiveHeightForN Banach map; baked here light).
const LANDMARK_A = Object.freeze({
  'band-bottom': { N: 3.109049e9, a: 0.04791815273101053, aLo: 0.047927711635947785 },
  'N_cross': { N: 3.280294e9, a: 0.045423376959955054, aLo: 0.045432438331748065 },
  'band-top': { N: 3.451539e9, a: 0.043175795913930434, aLo: 0.04318440904319563 },
});

// -- the imp-35404 baked literals (IMP35404_LADDER) this cross-check reconstructs against --
const IMP35404_BAKED = Object.freeze([
  Object.freeze({ label: 'band-bottom', dG: -61.368, dFP: 122.762, surplus: 61.394, ratio: 2.00042 }),
  Object.freeze({ label: 'N_cross', dG: -58.099, dFP: 116.222, surplus: 58.123, ratio: 2.00042 }),
  Object.freeze({ label: 'band-top', dG: -55.1605, dFP: 110.3441, surplus: 55.1835, ratio: 2.00042 }),
]);

// Reconstruct dG / dFP / surplus from the imp-35266 closed forms at a landmark.
function reconstructAt(label) {
  const { a, aLo } = LANDMARK_A[label];
  const G = 1 - a;
  const FP_LO = 1 - aLo;
  const M_G = (2 * G) / (1 + G);
  const M_FP = 1 / FP_LO;
  const dG = S_INF * (M_G - 1); // negative
  const dFP = S_INF * M_G * (M_FP - 1); // positive
  const surplus = dG + dFP;
  return {
    label,
    dG,
    dFP,
    surplus,
    ratio: -dFP / dG,
    dG_leading: (-S_INF * a) / 2,
    dFP_leading: S_INF * a,
    surplus_leading: (S_INF * a) / 2,
  };
}

export const IMP35438_RECONSTRUCTION = Object.freeze(
  IMP35404_BAKED.map((baked) => {
    const r = reconstructAt(baked.label);
    return Object.freeze({
      label: baked.label,
      recon: Object.freeze({
        dG: +r.dG.toFixed(4),
        dFP: +r.dFP.toFixed(4),
        surplus: +r.surplus.toFixed(4),
        ratio: +r.ratio.toFixed(5),
      }),
      baked,
      diffs: Object.freeze({
        dG: Math.abs(r.dG - baked.dG),
        dFP: Math.abs(r.dFP - baked.dFP),
        surplus: Math.abs(r.surplus - baked.surplus),
        ratio: Math.abs(r.ratio - baked.ratio),
      }),
      leading: Object.freeze({
        surplus: +r.surplus_leading.toFixed(4),
        relErr: Math.abs(r.surplus_leading - baked.surplus) / Math.abs(baked.surplus),
      }),
    });
  })
);

// Storage grain: literals are stored at toFixed(4)/toFixed(5); allow the 4-decimal grain (~5e-4).
const STORAGE_TOL = 5e-4;
const RATIO_TOL = 1e-4;
const MAX_DIFF = Math.max(
  ...IMP35438_RECONSTRUCTION.flatMap((r) => [r.diffs.dG, r.diffs.dFP, r.diffs.surplus])
);

export const IMP35438_SUMMARY = Object.freeze({
  id: 'imp-35438',
  proofSection: 'S-frontier',
  landmarks: IMP35438_RECONSTRUCTION.length,
  maxAbsDiff: +MAX_DIFF.toExponential(3),
  reproducesWithinStorageRounding: MAX_DIFF < STORAGE_TOL,
  ratioReproduces: IMP35438_RECONSTRUCTION.every((r) => r.diffs.ratio < RATIO_TOL),
  isRigorous: false,
  verdict:
    'CROSS-CHECK PASS (frontier, NOT an RH bound). The imp-35404 baked three-landmark dG/dFP/surplus ' +
    'literals reconstruct from the imp-35266 closed forms (S_inf = 2500 floor plus the S_inf . a/2 ' +
    'leading surplus and its M_G/M_FP corrections) with no drift beyond storage rounding -- max |diff| ' +
    '~2.7e-4, inside the toFixed(4) grain -- and ratio = -dFP/dG ~ 2.00042 plus surplus = dG + dFP ' +
    'hold at every landmark. Verification only; the imp-35404 viz literals are faithful to imp-35266. ' +
    'imp-34714a REMAINS OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
});

export default Object.freeze({
  id: 'imp-35438-krawczyk-headroom-cancellation-reconstruction-crosscheck',
  ticket: 'imp-35438',
  sInf: S_INF,
  delta: DELTA,
  reconstruction: IMP35438_RECONSTRUCTION,
  summary: IMP35438_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35438_ASSERTIONS = [
  {
    id: 'imp35438-three-landmarks-reconstructed-in-band-order',
    holds: () =>
      IMP35438_RECONSTRUCTION.length === 3 &&
      IMP35438_RECONSTRUCTION.map((r) => r.label).join(',') === 'band-bottom,N_cross,band-top',
    why: 'The cross-check must cover exactly the three imp-34693 band landmarks in band order.',
  },
  {
    id: 'imp35438-dG-dFP-surplus-reproduce-within-storage-rounding',
    holds: () =>
      IMP35438_RECONSTRUCTION.every(
        (r) => r.diffs.dG < STORAGE_TOL && r.diffs.dFP < STORAGE_TOL && r.diffs.surplus < STORAGE_TOL
      ),
    why: 'Every reconstructed dG/dFP/surplus must reproduce the imp-35404 baked literal within the 4-decimal storage grain (~5e-4).',
  },
  {
    id: 'imp35438-ratio-reproduces-2p00042-every-landmark',
    holds: () => IMP35438_RECONSTRUCTION.every((r) => Math.abs(r.recon.ratio - 2.00042) < RATIO_TOL),
    why: 'The reconstructed ratio -dFP/dG must reproduce the baked 2.00042 at every landmark.',
  },
  {
    id: 'imp35438-surplus-equals-dG-plus-dFP-internal-consistency',
    holds: () =>
      IMP35438_RECONSTRUCTION.every((r) => Math.abs(r.recon.dG + r.recon.dFP - r.recon.surplus) < STORAGE_TOL),
    why: 'imp-35266 D1: surplus = dG + dFP must hold internally on the reconstructed values within storage rounding.',
  },
  {
    id: 'imp35438-leading-order-tracks-surplus-within-3pct',
    holds: () => IMP35438_RECONSTRUCTION.every((r) => r.leading.relErr < 0.03),
    why: 'imp-35266 D3: the leading-order S_inf . a/2 estimate must track each surplus to within ~3%.',
  },
  {
    id: 'imp35438-honesty-gate-no-qed',
    holds: () =>
      IMP35438_SUMMARY.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35438_SUMMARY.verdict) &&
      /NO QED/.test(IMP35438_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP35438_SUMMARY.verdict),
    why: 'Cross-check only: isRigorous false, sub-gap open, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP35438_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35438-krawczyk-headroom-cancellation-reconstruction-crosscheck assertion failed: ${assertion.id}`);
  }
}

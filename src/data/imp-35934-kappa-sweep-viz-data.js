/**
 * @module imp-35934-kappa-sweep-viz-data
 * @fileoverview imp-35934 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35854 MEASURED
 *   summation-scheme error-vs-condition-number kappa ladder: naive recursive,
 *   pairwise divide-and-conquer, and Kahan-Babuska compensated summation, both
 *   normalized (err / Sum|t_k|) and relative (err / |Sum t_k|) error, swept across
 *   kappa = (Sum|t_k|) / |Sum t_k| ~ 1 to ~2e5 on the SAME N = floor(sqrt(T_PT/4 pi))
 *   ~ 488602-term oscillatory sum at T_PT = 3e12.
 *
 *   The literals below are copied verbatim from the imp-35854 exact-BigInt-referenced
 *   kappaSweep measurement -- this module does not import imp-35854 (no re-running
 *   the ten (alpha, beta) rungs at page-load time) so pages consuming it stay
 *   import-light, following the imp-35865 baked-literal pattern.
 *
 *   @see imp-35854-w1-summation-kappa-sweep.js (source measurement)
 *   @see imp-35812-w1-summation-scheme-measured-cost.js (single-kappa baseline)
 *   @see imp-35865-summation-scheme-ladder-viz-data.js (same viz-data pattern, N-axis sibling)
 *
 *   Ticket: imp-35934 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u

// Measured kappa-sweep rungs (imp-35854), sorted ascending by measured kappa.
// naiveNorm/pairwiseNorm/kahanNorm = err / Sum|t_k| (Higham gamma scale);
// naiveRel/pairwiseRel/kahanRel = err / |Sum t_k| = normalized * kappa (what appears
// in the summed value). All against the exact-BigInt 2^{-96} fixed-point reference.
export const IMP35934_KAPPA_SWEEP = Object.freeze([
  { kappa: 0.9999999999999655, naiveNorm: 3.460932031010621e-14, pairwiseNorm: 5.009528325885514e-17, kahanNorm: 5.009528325885514e-17, naiveRel: 3.4609320310105014e-14, pairwiseRel: 5.009528325885341e-17, kahanRel: 5.009528325885341e-17 },
  { kappa: 2.3351818790182453, naiveNorm: 5.0266603670460396e-14, pairwiseNorm: 4.616830809029923e-17, kahanNorm: 8.878488385139165e-18, naiveRel: 1.1738166201105114e-13, pairwiseRel: 1.0781139643739821e-16, kahanRel: 2.073288519005094e-17 },
  { kappa: 3.736733026807435, naiveNorm: 4.964586457596228e-15, pairwiseNorm: 2.2535526364764273e-17, kahanNorm: 2.2535526364764273e-17, naiveRel: 1.8551334180540755e-14, pairwiseRel: 8.420924564370435e-17, kahanRel: 8.420924564370435e-17 },
  { kappa: 34.839186292219814, naiveNorm: 2.3057238080628796e-16, pairwiseNorm: 7.030922556475399e-18, kahanNorm: 1.0234267100589515e-18, naiveRel: 8.032954128750914e-15, pairwiseRel: 2.4495162075121683e-16, kahanRel: 3.5655353808177445e-17 },
  { kappa: 78.75125658901575, naiveNorm: 6.792481442380192e-16, pairwiseNorm: 2.237448297933955e-18, kahanNorm: 2.4624036869841035e-19, naiveRel: 5.349164489450103e-14, pairwiseRel: 1.7620186501525346e-16, kahanRel: 1.9391738457942357e-17 },
  { kappa: 158.45118870082, naiveNorm: 6.58715295776395e-16, pairwiseNorm: 8.638368168354701e-18, kahanNorm: 3.488704621712004e-19, naiveRel: 1.0437422163118203e-13, pairwiseRel: 1.3687597047111276e-15, kahanRel: 5.5278939433631164e-17 },
  { kappa: 536.6236248365253, naiveNorm: 9.465970068323459e-17, pairwiseNorm: 4.055903129806848e-18, kahanNorm: 5.729639307605592e-20, naiveRel: 5.0796631706577856e-14, pairwiseRel: 2.176493439502759e-15, kahanRel: 3.074659814253152e-17 },
  { kappa: 1391.0045053572817, naiveNorm: 3.032193419836597e-17, pairwiseNorm: 3.556628498813625e-19, kahanNorm: 1.89155419746951e-20, naiveRel: 4.21779470810741e-14, pairwiseRel: 4.947286265731858e-16, kahanRel: 2.6311604108075656e-17, label: 'imp-35812 anchor' },
  { kappa: 13631.990968383647, naiveNorm: 3.9368509956951006e-17, pairwiseNorm: 6.898691824666043e-18, kahanNorm: 1.4806539344477773e-20, naiveRel: 5.366711721718778e-13, pairwiseRel: 9.404290464750959e-14, kahanRel: 2.0184261061693813e-16 },
  { kappa: 199191.12622721316, naiveNorm: 4.224742013067422e-17, pairwiseNorm: 7.72114959724071e-19, kahanNorm: 1.2275701636179018e-20, naiveRel: 8.415311196023235e-12, pairwiseRel: 1.5379844840431703e-13, kahanRel: 2.4452108341397417e-15 },
]);

export const IMP35934_KAPPA_RANGE = Object.freeze({
  min: 0.9999999999999655,
  max: 199191.12622721316,
  decades: 5.299269987117836,
});

// imp-35854 headline finding: naive relative error grows far sublinearly in kappa.
export const IMP35934_NAIVE_REL_GROWTH = Object.freeze({
  minRel: 8.032954128750914e-15, // lowest naiveRel across the sweep (at kappa ~ 34.8, not the kappa~1 endpoint)
  maxRel: 8.415311196023235e-12, // highest naiveRel, at kappa ~ 2e5
  decades: Math.log10(8.415311196023235e-12 / 8.032954128750914e-15),
  kappaDecades: 5.299269987117836,
});

export const IMP35934_KAPPA_SWEEP_VIZ_DATA = {
  ticket: 'imp-35934',
  sourceTicket: 'imp-35854',
  sweep: IMP35934_KAPPA_SWEEP,
  kappaRange: IMP35934_KAPPA_RANGE,
  naiveRelGrowth: IMP35934_NAIVE_REL_GROWTH,
  uRoundoff: U_ROUNDOFF,
  note:
    'Exact-BigInt-referenced measurement (imp-35854) of naive/pairwise/Kahan-Babuska summation ' +
    'normalized and relative error as the condition number kappa = Sum|t_k| / |Sum t_k| is swept ' +
    '~5.3 decades (kappa ~ 1 to ~2e5) on the SAME N ~ 4.886e5-term oscillatory sum at T_PT = 3e12. ' +
    'The naive relative error grows far sublinearly in kappa (REFINING, not confirming, the ' +
    'pessimistic sqrt(N).u.kappa random-walk model); pairwise/Kahan stay kappa-robust on the ' +
    'normalized scale.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35854 exact-BigInt-referenced kappa-sweep ' +
    'measurement; adds no new derivation and changes no bound. Measurement only; certifies no W1 ' +
    'bound; evaluates no true H_0; instantiates no interval; verifies no inequality; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35934_VIZ_ASSERTIONS = [
  {
    id: 'imp35934-sweep-ten-points-kappa-increasing',
    description: 'sweep has 10 points strictly increasing in kappa, spanning >=5 decades',
    holds: () => {
      const S = IMP35934_KAPPA_SWEEP;
      if (S.length !== 10) return false;
      for (let i = 1; i < S.length; i++) {
        if (S[i].kappa <= S[i - 1].kappa) return false;
      }
      return IMP35934_KAPPA_RANGE.decades >= 5;
    },
  },
  {
    id: 'imp35934-hierarchy-holds-every-rung',
    description: 'at every rung, kahanNorm <= pairwiseNorm <= naiveNorm (scheme hierarchy)',
    holds: () =>
      IMP35934_KAPPA_SWEEP.every((r) => r.kahanNorm <= r.pairwiseNorm && r.pairwiseNorm <= r.naiveNorm),
  },
  {
    id: 'imp35934-naive-rel-sublinear-in-kappa',
    description: 'naive relative-error growth spans strictly fewer decades than the kappa sweep itself',
    holds: () =>
      IMP35934_NAIVE_REL_GROWTH.decades > 0 &&
      IMP35934_NAIVE_REL_GROWTH.decades < IMP35934_NAIVE_REL_GROWTH.kappaDecades - 1,
  },
  {
    id: 'imp35934-kahan-stays-near-roundoff-floor',
    description: 'Kahan normalized error stays below 2u at every rung (kappa-robust)',
    holds: () => IMP35934_KAPPA_SWEEP.every((r) => r.kahanNorm < 2 * U_ROUNDOFF),
  },
  {
    id: 'imp35934-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35934_KAPPA_SWEEP_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35934_KAPPA_SWEEP_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35934_KAPPA_SWEEP_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35934_KAPPA_SWEEP_VIZ_DATA.honest),
  },
];

for (const a of IMP35934_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35934-kappa-sweep-viz-data assertion failed: ${a.id}`);
  }
}

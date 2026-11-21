/**
 * @module imp-35897-kappa-sweep-ceiling-floor-viz-data
 * @fileoverview imp-35897 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35854 MEASURED
 *   summation-scheme kappa sweep, contrasted against its two reference SCALES: the
 *   Wilkinson random-walk relative-error ceiling sqrt(N) u kappa (naive scheme) and
 *   the Kahan-Babuska relative-error floor 2u kappa (compensated scheme, ~sqrt(N)/2
 *   below the ceiling at every rung). imp-35934 already baked the raw
 *   naiveNorm/pairwiseNorm/kahanNorm/naiveRel/pairwiseRel/kahanRel sweep; this module
 *   adds the two derived reference-scale series per rung so a page can plot measured
 *   error alongside both scales on one log-log axis.
 *
 *   The literals are copied verbatim from imp-35854 (sweep values) with the two
 *   reference scales re-derived here (sqrtNuKappaCeiling = sqrt(N) u kappa,
 *   kahanFloor2uKappa = 2 u kappa, N = 488602, u = 2^-53) and cross-checked against
 *   imp-35854's own sqrtNuKappaCeiling column. This module does not import imp-35854
 *   (no re-running the ten (alpha, beta) rungs at page-load time).
 *
 *   @see imp-35854-w1-summation-kappa-sweep.js (source measurement)
 *   @see imp-35934-kappa-sweep-viz-data.js (raw norm/rel sweep, same rungs)
 *   @see imp-35865-summation-scheme-ladder-viz-data.js (sibling N-axis viz-data pattern)
 *
 *   Ticket: imp-35897 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const N_AT_TPT = 488602; // Polymath15 retained-term count at T_PT = 3e12 (imp-35674 Part D)
const U_ROUNDOFF = 2 ** -53; // unit roundoff u
const SQRTN_U = Math.sqrt(N_AT_TPT) * U_ROUNDOFF; // Wilkinson random-walk factor

// Measured kappa-sweep rungs (imp-35854 / imp-35934), sorted ascending by measured kappa,
// with the two reference scales appended per rung.
export const IMP35897_KAPPA_CEILING_FLOOR_SWEEP = Object.freeze(
  [
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
  ].map((r) => ({
    ...r,
    sqrtNuKappaCeiling: SQRTN_U * r.kappa,
    kahanFloor2uKappa: 2 * U_ROUNDOFF * r.kappa,
  }))
);

export const IMP35897_SCALES = Object.freeze({
  N: N_AT_TPT,
  u: U_ROUNDOFF,
  sqrtNu: SQRTN_U,
  ceilingToFloorRatio: SQRTN_U / (2 * U_ROUNDOFF), // ~ sqrt(N)/2, N-independent of kappa
});

export const IMP35897_KAPPA_CEILING_FLOOR_VIZ_DATA = {
  ticket: 'imp-35897',
  sourceTicket: 'imp-35854',
  sweep: IMP35897_KAPPA_CEILING_FLOOR_SWEEP,
  scales: IMP35897_SCALES,
  note:
    'Measured naive/pairwise/Kahan-Babuska relative error (imp-35854, ten (alpha,beta) rungs, ' +
    'kappa ~ 1 to ~2e5 at N = 488602) contrasted against two reference scales: the Wilkinson ' +
    'random-walk ceiling sqrt(N).u.kappa (naive stays below it at every rung) and the ' +
    'Kahan-Babuska floor 2u.kappa (~sqrt(N)/2 ~ 350x below the ceiling, kappa-independent ratio). ' +
    'The measured naive relative error is well below its ceiling throughout, and measured Kahan ' +
    'relative error is well below its floor throughout -- both scales are loose, not tight, bounds.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35854 exact-BigInt-referenced kappa-sweep ' +
    'measurement plus two re-derived reference scales; adds no new derivation and changes no bound. ' +
    'Measurement only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD (imp-35681 Part A). NO QED. No refereed bound is changed.',
};

export const IMP35897_VIZ_ASSERTIONS = [
  {
    id: 'imp35897-sweep-ten-points-kappa-increasing',
    description: 'sweep has 10 points strictly increasing in kappa',
    holds: () => {
      const S = IMP35897_KAPPA_CEILING_FLOOR_SWEEP;
      if (S.length !== 10) return false;
      for (let i = 1; i < S.length; i++) {
        if (S[i].kappa <= S[i - 1].kappa) return false;
      }
      return true;
    },
  },
  {
    id: 'imp35897-naive-rel-below-ceiling-every-rung',
    description: 'measured naive relative error stays below the sqrt(N) u kappa ceiling at every rung',
    holds: () => IMP35897_KAPPA_CEILING_FLOOR_SWEEP.every((r) => r.naiveRel < r.sqrtNuKappaCeiling),
  },
  {
    id: 'imp35897-kahan-rel-below-floor-every-rung',
    description: 'measured Kahan relative error stays below the 2u kappa floor scale at every rung',
    holds: () => IMP35897_KAPPA_CEILING_FLOOR_SWEEP.every((r) => r.kahanRel < r.kahanFloor2uKappa),
  },
  {
    id: 'imp35897-ceiling-floor-ratio-is-sqrtN-over-2',
    description: 'ceiling/floor ratio equals sqrt(N)/2 independent of kappa (both scale linearly in kappa)',
    holds: () => Math.abs(IMP35897_SCALES.ceilingToFloorRatio - Math.sqrt(IMP35897_SCALES.N) / 2) < 1e-9,
  },
  {
    id: 'imp35897-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35897_KAPPA_CEILING_FLOOR_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35897_KAPPA_CEILING_FLOOR_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35897_KAPPA_CEILING_FLOOR_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35897_KAPPA_CEILING_FLOOR_VIZ_DATA.honest),
  },
];

for (const a of IMP35897_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35897-kappa-sweep-ceiling-floor-viz-data assertion failed: ${a.id}`);
  }
}

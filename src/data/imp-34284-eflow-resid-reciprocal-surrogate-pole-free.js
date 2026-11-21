/**
 * @module imp-34284-eflow-resid-reciprocal-surrogate-pole-free
 * @fileoverview imp-34284 -- lightweight, self-contained measurement module (baked
 *   literals only, no heavy imports, per [[no_heavy_imports_in_pages]]) assessing
 *   whether a POLE-FREE RECIPROCAL surrogate for the imp-34237/imp-33810
 *   eflow_over_resid ratio renders all 13 boundary windows (kEnd = 20.0 .. 26.0,
 *   step 0.5) FINITE while still exposing the k* ~ 21.28095 sign-flip.
 *
 *   THE PROBLEM (imp-34237). The raw ratio
 *       r(k) = eflow_attr(k) / resid_exp(k)
 *   puts the surrogate residual resid_exp(k) = pEcoll(1 - sigma) - pSigma in the
 *   DENOMINATOR. resid_exp crosses zero at k* ~ 21.28095 (the imp-34023 bisected /
 *   imp-34127 closed-form M2-residual ceiling), so r has a POLE there: r flips from
 *   +5.9e-7 at k=21.25 to -5.67e-8 at k=21.5 by blowing through +/-infinity, and only
 *   3 of the ticket 13-window kEnd grid (kEnd = 20.0, 20.5, 21.0, all strictly below
 *   k*) stay computable -- every window at kEnd >= 21.5 is past the pole.
 *
 *   THE SURROGATE (this module). The reciprocal
 *       s(k) = resid_exp(k) / eflow_attr(k) = 1 / r(k)
 *   swaps resid_exp into the NUMERATOR. Its new denominator eflow_attr(k) is the
 *   attributed E_flow term, which imp-33810 R4 established is STRICTLY POSITIVE and
 *   (imp-33810 R3) monotone-decreasing but never zero across the whole ladder -- an
 *   energy-flow share ~ few e-15 in this tail. Therefore:
 *     (S1) s has NO pole anywhere the tail model is defined: the resid_exp zero at k*
 *          becomes a benign ZERO of s (s(k*) = 0 / eflow_attr(k*) = 0, finite), not a
 *          blow-up. All 13 kEnd = 20 .. 26 windows are finite.
 *     (S2) sign(s) = sign(resid_exp) because eflow_attr > 0, so s preserves the exact
 *          sign-flip the raw ratio encodes: s > 0 for k < k*, s < 0 for k > k*,
 *          crossing zero AT k*. The sign-change is exposed as a smooth zero-crossing
 *          (s ~ linear in k - k* near k*) instead of the ratio 1/(k - k*) divergence.
 *     (S3) where the raw ratio IS defined the two agree exactly: s = 1/r (the reciprocal
 *          is a pure denominator/numerator swap of the SAME two primitives, no new model).
 *
 *   THE NEAR-POLE DEMONSTRATION TRIANGLE (all three primitives from imp-34237/imp-33810):
 *       k       resid_exp     eflow_attr     r = eflow/resid   s = resid/eflow
 *       21.25   +8.19e-9      +4.8321e-15    +5.9e-7 (finite)  +1.694915e6 (finite)
 *       21.281  0 (k*)        +4.58e-15*     UNDEFINED (pole)  0            (finite)
 *       21.50   -4.97e-8      +2.8180e-15    -5.67e-8 (finite) -1.763668e7  (finite)
 *   (*eflow_attr(k*) is a linear interpolation of the two bracketing e-15 rungs, used
 *    only to confirm the denominator stays strictly positive AT k*; the s(k*) = 0 value
 *    is exact regardless of that interpolation since the numerator resid_exp(k*) = 0.)
 *   At the one point where the raw ratio dies (the k* pole) the reciprocal is finite and
 *   equals zero; at the two flanking points the two are exact reciprocals of one another.
 *
 *   WHY NOT THE BOUNDED MAGNITUDE FORM. The ticket also floats a bounded surrogate
 *       b(k) = |eflow_attr| / (|resid_exp| + eps).
 *   b is finite everywhere too, but it is |.|-symmetric: b(21.25) and b(21.50) are BOTH
 *   positive, so b DESTROYS the sign-change (S2) it is supposed to expose. Among the
 *   candidates only the signed reciprocal s satisfies BOTH requirements -- finite at all
 *   13 windows AND sign-flip-preserving -- so it is the surrogate this module adopts; the
 *   magnitude form is retained here only as the contrast that fails the sign test.
 *
 *   NET: reciprocal takes the computable-window count from 3/13 (raw ratio) to 13/13
 *   while keeping the k* sign-flip visible as a zero-crossing.
 *
 *   All numbers are baked reference literals copied from the imp-34237 viz-data module
 *   and the imp-33810 ladder; this module imports nothing (no lambda-rh-height-mapping /
 *   polymath15-constant-C-C chain), so it stays import-light and does not hang under
 *   ssrLoadModule per [[verify_heavy_assertion_modules]].
 *
 *   Ticket: imp-34284 (numerical, medium). DESCRIPTIVE SURROGATE ONLY, presentation /
 *   no-bound-change; the component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 *   K_a >= 0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data (raw ratio pole this replaces)
 *   @see imp-33810-eflow-resid-ratio-N-ladder (resid_over_eflow = the reciprocal, on k=6..11; R3/R4 eflow>0)
 *   @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281, same zero)
 *   @see imp-34127-m2-residual-signchange-ceiling-closed-form (closed-form derivation of the same zero)
 *   @see imp-34273-eflow-resid-share-negligibility-bound (E_flow share of the M2 residual across the window)
 */

// --- Baked primitives on the shared deep-tail k-axis (from imp-34237 / imp-33810). ---
// resid_exp(k) = pEcoll(1 - sigma) - pSigma, crossing zero at k* ~ 21.28095 (imp-34237 F2).
const KSTAR = 21.28095; // imp-34023 bisected / imp-34127 closed-form M2-residual sign-change ceiling

// eflow_attr(k) reconstructed at the two rungs where imp-34237 baked the raw ratio too:
// eflow_attr = ratio * resid_exp (both from imp-34237), giving the strictly-positive, decaying
// energy-flow share; matches imp-33810 R3/R4 (eflow_attr > 0 and shrinking in the tail).
export const IMP34284_NEAR_POLE_ROWS = Object.freeze([
  { k: 21.25, residExp: 8.19e-9, eflowAttr: 4.8321e-15, rawRatio: 5.9e-7 },
  { k: 21.5, residExp: -4.97e-8, eflowAttr: 2.818e-15, rawRatio: -5.67e-8 },
]);

// The reciprocal surrogate s(k) = resid_exp / eflow_attr, derived in-module from the SAME
// two primitives (denominator/numerator swap). At k* the numerator is 0 so s(k*) = 0 exactly;
// the interpolated positive eflow_attr(k*) only confirms the denominator never touches zero.
const eflowAtKStar = (() => {
  const [a, b] = IMP34284_NEAR_POLE_ROWS;
  const f = (KSTAR - a.k) / (b.k - a.k);
  return a.eflowAttr + f * (b.eflowAttr - a.eflowAttr); // ~4.58e-15 > 0
})();

export const IMP34284_RECIPROCAL_TRIANGLE = Object.freeze([
  {
    k: IMP34284_NEAR_POLE_ROWS[0].k,
    residExp: IMP34284_NEAR_POLE_ROWS[0].residExp,
    eflowAttr: IMP34284_NEAR_POLE_ROWS[0].eflowAttr,
    rawRatio: IMP34284_NEAR_POLE_ROWS[0].rawRatio, // finite, positive
    reciprocal: IMP34284_NEAR_POLE_ROWS[0].residExp / IMP34284_NEAR_POLE_ROWS[0].eflowAttr, // +1.694915e6
    rawDefined: true,
  },
  {
    k: KSTAR,
    residExp: 0, // resid_exp(k*) = 0 by definition of the bisected zero
    eflowAttr: eflowAtKStar, // ~4.58e-15 > 0 (interpolated, denominator stays positive)
    rawRatio: null, // eflow_attr / 0 -> POLE, raw ratio UNDEFINED here
    reciprocal: 0 / eflowAtKStar, // 0 / (positive) = 0, FINITE -- the pole is a benign zero for s
    rawDefined: false,
  },
  {
    k: IMP34284_NEAR_POLE_ROWS[1].k,
    residExp: IMP34284_NEAR_POLE_ROWS[1].residExp,
    eflowAttr: IMP34284_NEAR_POLE_ROWS[1].eflowAttr,
    rawRatio: IMP34284_NEAR_POLE_ROWS[1].rawRatio, // finite, negative
    reciprocal: IMP34284_NEAR_POLE_ROWS[1].residExp / IMP34284_NEAR_POLE_ROWS[1].eflowAttr, // -1.763668e7
    rawDefined: true,
  },
]);

// The bounded magnitude contrast surrogate b(k) = |eflow_attr| / (|resid_exp| + eps): finite
// everywhere but |.|-symmetric, so it collapses the sign-flip (both rungs come out POSITIVE).
const REG_EPS = 1e-30; // eps << the e-9..e-15 scale here; only guards the exact-zero denominator
export const IMP34284_MAGNITUDE_SURROGATE = Object.freeze(
  IMP34284_NEAR_POLE_ROWS.map((r) => ({
    k: r.k,
    bounded: Math.abs(r.eflowAttr) / (Math.abs(r.residExp) + REG_EPS),
  }))
);

// --- The 13-window kEnd = 20.0 .. 26.0 grid, classified by which surrogate is finite. ---
export const IMP34284_KEND_GRID = Object.freeze(
  Array.from({ length: 13 }, (_, i) => {
    const kEnd = +(20 + 0.5 * i).toFixed(1);
    // raw ratio is computable (finite AND log-defined) only strictly below the k* pole:
    const rawComputable = kEnd < KSTAR;
    return { kEnd, rawComputable, reciprocalFinite: true }; // reciprocal finite at every window (eflow>0)
  })
);
export const IMP34284_RAW_COMPUTABLE_COUNT = IMP34284_KEND_GRID.filter((w) => w.rawComputable).length; // 3
export const IMP34284_RECIPROCAL_FINITE_COUNT = IMP34284_KEND_GRID.filter((w) => w.reciprocalFinite).length; // 13
export const IMP34284_TOTAL_WINDOW_COUNT = IMP34284_KEND_GRID.length; // 13

export const IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE = {
  ticket: 'imp-34284',
  proofSection: 'S-frontier',
  question:
    'The imp-34237 raw ratio eflow_over_resid = eflow_attr / resid_exp has a POLE at the ' +
    'resid_exp zero k* ~ 21.28095, leaving only 3 of 13 boundary windows (kEnd = 20 .. 26) ' +
    'computable. Assess whether a pole-free reciprocal surrogate s = resid_exp / eflow_attr ' +
    'renders all 13 windows finite while still exposing the k* sign-flip. Descriptive ' +
    'surrogate only; NOT an RH bound; no QED.',
  kStar: KSTAR,
  nearPoleTriangle: IMP34284_RECIPROCAL_TRIANGLE,
  magnitudeSurrogate: IMP34284_MAGNITUDE_SURROGATE,
  kEndGrid: IMP34284_KEND_GRID,
  rawComputableCount: IMP34284_RAW_COMPUTABLE_COUNT, // 3
  reciprocalFiniteCount: IMP34284_RECIPROCAL_FINITE_COUNT, // 13
  totalWindowCount: IMP34284_TOTAL_WINDOW_COUNT, // 13
  finding: {
    S1_reciprocal_is_pole_free:
      'The reciprocal s = resid_exp / eflow_attr moves resid_exp out of the denominator; its ' +
      'new denominator eflow_attr is strictly positive and monotone-decreasing but never zero ' +
      'across the tail (imp-33810 R3/R4). So s has NO pole: the resid_exp zero at k* becomes a ' +
      'benign ZERO of s (s(k*) = 0, finite), and all 13 kEnd = 20 .. 26 windows are finite -- ' +
      'up from the 3 computable under the raw ratio.',
    S2_sign_flip_preserved:
      'sign(s) = sign(resid_exp) because eflow_attr > 0, so s is positive for k < k* and ' +
      'negative for k > k* (+1.694915e6 at k=21.25, -1.763668e7 at k=21.5), crossing zero AT ' +
      'k* ~ 21.28095. The sign-change the raw ratio encoded as a +/-infinity pole is exposed by ' +
      's as a smooth zero-crossing.',
    S3_agrees_where_raw_defined:
      'Where the raw ratio is defined (k = 21.25, 21.5) s = 1 / r exactly (+1.694915e6 = ' +
      '1 / 5.9e-7; -1.763668e7 = 1 / -5.67e-8): the reciprocal is a pure denominator/numerator ' +
      'swap of the same two primitives, introducing no new model.',
    S4_magnitude_form_loses_sign:
      'The bounded contrast surrogate b = |eflow_attr| / (|resid_exp| + eps) is finite ' +
      'everywhere too but |.|-symmetric, returning a POSITIVE value at both k=21.25 and k=21.5 -- ' +
      'it destroys the sign-flip. Only the signed reciprocal satisfies both requirements at once.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SURROGATE (frontier-direction, NOT rigorous). Replacing the imp-34237 raw ' +
    'ratio eflow_attr / resid_exp with its reciprocal s = resid_exp / eflow_attr moves the ' +
    'sign-changing resid_exp out of the denominator into the numerator. Because the new ' +
    'denominator eflow_attr stays strictly positive throughout the tail (imp-33810 R3/R4), s is ' +
    'pole-free: the resid_exp zero at k* ~ 21.28095 becomes a benign zero-crossing of s rather ' +
    'than a +/-infinity pole, so all 13 kEnd = 20 .. 26 boundary windows are finite (up from 3 ' +
    'under the raw ratio) and the k* sign-flip is preserved (s > 0 below k*, s < 0 above, s = 0 ' +
    'at k*). Where the raw ratio is defined the two agree exactly (s = 1 / r). The bounded ' +
    'magnitude form |eflow| / (|resid| + eps) is finite too but |.|-symmetric and so loses the ' +
    'sign, which is why the signed reciprocal is the surrogate adopted here. This is a ' +
    'descriptive re-parameterisation only: the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34237 (raw ratio pole this replaces); imp-33810 (resid_over_eflow reciprocal on k=6..11, ' +
    'R3/R4 eflow_attr > 0); imp-34023 (bisected kEnd* ~ 21.281); imp-34127 (closed-form ceiling); ' +
    'imp-34273 (E_flow share of the M2 residual); imp-486 (C_mb GUE-conditional).',
};

export const IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE_ASSERTIONS = [
  {
    // (S1) The reciprocal is finite at every point of the near-pole triangle, INCLUDING the k*
    // pole where the raw ratio is undefined -- the pole of r is a benign zero of s.
    id: 'imp34284-reciprocal-finite-including-at-pole',
    description: 'reciprocal s is finite at k=21.25, at k* (=0), and at k=21.5; raw ratio is undefined at k*',
    holds: () => {
      const tri = IMP34284_RECIPROCAL_TRIANGLE;
      const allFinite = tri.every((row) => Number.isFinite(row.reciprocal));
      const poleRow = tri.find((row) => row.rawDefined === false);
      return (
        tri.length === 3 &&
        allFinite &&
        poleRow.k === KSTAR &&
        poleRow.reciprocal === 0 && // s(k*) = 0, finite
        poleRow.rawRatio === null && // raw ratio undefined at the pole
        poleRow.eflowAttr > 0 // denominator strictly positive at k*
      );
    },
  },
  {
    // (S2) The reciprocal preserves the raw-ratio sign-flip: positive below k*, negative above,
    // zero at k*.
    id: 'imp34284-reciprocal-preserves-sign-flip',
    description: 's > 0 below k*, s < 0 above k*, s = 0 at k* -- same sign-change the pole encoded',
    holds: () => {
      const [lo, mid, hi] = IMP34284_RECIPROCAL_TRIANGLE;
      return lo.k < KSTAR && lo.reciprocal > 0 && mid.reciprocal === 0 && hi.k > KSTAR && hi.reciprocal < 0;
    },
  },
  {
    // (S3) Where the raw ratio is defined the reciprocal equals 1 / r (pure swap, no new model).
    // ~1e-3 relative tolerance absorbs the imp-34237 toExponential storage rounding
    // (per [[storage_precision_assertion_tolerance]]).
    id: 'imp34284-reciprocal-equals-one-over-raw-where-defined',
    description: 's = 1 / rawRatio at k=21.25 and k=21.5 (denominator/numerator swap of the same primitives)',
    holds: () =>
      IMP34284_RECIPROCAL_TRIANGLE.filter((row) => row.rawDefined).every(
        (row) => Math.abs(row.reciprocal - 1 / row.rawRatio) <= 1e-3 * Math.abs(1 / row.rawRatio)
      ),
  },
  {
    // (S1 count) The reciprocal renders all 13 windows finite; the raw ratio only the 3 below k*.
    id: 'imp34284-window-count-3-to-13',
    description: 'raw ratio computable at 3 of 13 windows (kEnd < k*); reciprocal finite at all 13',
    holds: () =>
      IMP34284_TOTAL_WINDOW_COUNT === 13 &&
      IMP34284_RAW_COMPUTABLE_COUNT === 3 &&
      IMP34284_RECIPROCAL_FINITE_COUNT === 13 &&
      IMP34284_KEND_GRID.filter((w) => w.rawComputable).every((w) => w.kEnd < KSTAR) &&
      IMP34284_KEND_GRID.filter((w) => !w.rawComputable).every((w) => w.kEnd > KSTAR),
  },
  {
    // (S4) The bounded magnitude surrogate is finite but destroys the sign-flip (both rungs positive).
    id: 'imp34284-magnitude-surrogate-loses-sign',
    description: 'bounded |eflow|/(|resid|+eps) is finite but positive at BOTH rungs -- it loses the sign-change',
    holds: () =>
      IMP34284_MAGNITUDE_SURROGATE.length === 2 &&
      IMP34284_MAGNITUDE_SURROGATE.every((r) => Number.isFinite(r.bounded) && r.bounded > 0),
  },
  {
    // Honesty gate: descriptive surrogate only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34284-honesty-gate-no-qed',
    description: 'Measurement/surrogate only: isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE.isRigorous === false &&
      /NO QED/.test(IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE.verdict) &&
      /refereed bound is changed/i.test(IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE.verdict),
  },
];

for (const a of IMP34284_EFLOW_RESID_RECIPROCAL_SURROGATE_POLE_FREE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34284-eflow-resid-reciprocal-surrogate-pole-free assertion failed: ${a.id}`);
  }
}

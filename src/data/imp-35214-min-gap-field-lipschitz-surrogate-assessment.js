/**
 * @module imp-35214-min-gap-field-lipschitz-surrogate-assessment
 *
 * imp-35214 (proof, ASSESSMENT ONLY): imp-35196 proved the imp-35127 I3
 * N-uniform field-Lipschitz requirement is STRICTLY INCOMPATIBLE with
 * front-adherence for ANY vertical strip schedule y_star(N) -- the strip field
 * Jacobian L_strip = 2N/y^2 forces an accumulation floor y_star ~ sqrt(N) that
 * detaches from the y = 0 front. imp-35196 pointed to a DIFFERENT lever: an
 * N-uniform field-Lipschitz surrogate built from the imp-35167 min-gap g_min(t)
 * (an intrinsic accumulation constant, NOT a distance-to-pole bound). This
 * ticket ASSESSES whether that min-gap route can be N-uniform: enumerate what the
 * surrogate needs, whether it inherits the imp-35194 beta ~ 1/g_min
 * self-referential front-coupling, and whether it merely RELOCATES the imp-35167
 * M5 horizon obstruction. Assessment only; discharges nothing; I3 stays OPEN; NO QED.
 *
 * THE TWO PICTURES (strip vs min-gap)
 * -----------------------------------
 * The backward-Dyson field is M(z) = sum_j 1/(z - x_j); its Jacobian is
 * dz M = -sum_j 1/(z - x_j)^2.
 *
 *   STRIP picture (imp-2520 / imp-35127 / imp-35196). Evaluate on a horizontal
 *   strip Im z >= y_star. At height y all N poles contribute comparably, so
 *          L_strip(N, y) = 2N / y^2      -- prefactor is N-LINEAR.
 *   imp-35196 eliminated this: N-uniformity forces y_star ~ sqrt(N), off the front.
 *
 *   MIN-GAP picture (imp-35167 / imp-35194, THIS ticket). Evaluate ON the real
 *   axis at the intrinsic separation scale of the collapsing adjacent pair. The
 *   nearest pair at separation g = g_min DOMINATES the reciprocal-square field,
 *          L_gap(g) ~ c_pair / g^2               (adjacent-pair term 1/(x_k - x_{k+1})^2)
 *   with the remaining N - 2 particles entering only through the background field
 *   beta = sup |B_p| (imp-35194). So the PREFACTOR c_pair is a PAIR constant, not N.
 *
 * WHAT THE SURROGATE NEEDS (Q1..Q5), with present-vs-OPEN status
 * -------------------------------------------------------------
 *   Q1  A field-Lipschitz surrogate keyed to g_min: L_gap(g) ~ c_pair / g^2, the
 *       adjacent-pair reciprocal-square scale.  -- PRESENT (algebraic; the pair
 *       term dominates dz M on the real axis near a collapse).
 *   Q2  N-uniformity of the PREFACTOR c_pair (no factor of N). -- PRESENT /
 *       data-level: imp-35194 F1 measured the background beta N-uniform at MATCHED
 *       front-progress (relative spread < 1.5% across N = 50, 100, 200), so the
 *       min-gap prefactor does NOT inherit the strip 2N/y^2 N-linearity. THIS is
 *       the min-gap route genuine advantage over the strip route (answers imp-35196).
 *   Q3  An a-priori g_min(t) > 0 lower bound along the WHOLE backward trajectory to
 *       the front, so c_pair / g^2 is finite along the flow. -- OPEN = EXACTLY the
 *       imp-35167 M2/M5 min-gap certificate (the g_min separation bound, self-
 *       referentially coupled to beta and gated by the horizon-front bridge M5).
 *   Q4  Convergence of the accumulation e-fold E_acc = integral_0^{t_c} L_gap ds.
 *       Near the front the gap collapses like g^2(s) ~ 8 (T - s) (imp-2563 gap ODE
 *       du/ds = -8 + 4 beta u lower branch, u = g^2), so
 *          integral c_pair / g^2 ds = (c_pair / 8) integral ds/(T - s)
 *       is LOG-DIVERGENT at the front s -> t_c; finite only with the Q3 cutoff,
 *       E_acc = (c_pair / 8) log(g_0^2 / g_min^2). -- REDUCES to Q3.
 *   Q5  Independence from the min-gap it certifies. -- FAILS: the background beta
 *       driving both the gap ODE and the Lipschitz surrogate is itself ~ 1/g_min
 *       (imp-35194 F2: beta . g_min in (1, 1.4), DECREASING 1.33 -> 1.04 toward the
 *       front), so the surrogate and its input g_min are the SAME self-referential
 *       coupling imp-35167 M2 flagged -- no independent estimate.
 *
 * THE VERDICT (relocation, not removal)
 * -------------------------------------
 * The min-gap surrogate genuinely DEFEATS the imp-35196 obstruction: its prefactor
 * is N-uniform (Q1/Q2), so the N-LINEAR 2N/y^2 that no strip schedule could beat is
 * gone. But it does NOT supply an N-uniform field-Lipschitz CONSTANT, because the
 * g_min in its denominator is uncertified along the trajectory (Q3) and its
 * accumulation e-fold log-diverges at the front (Q4), finite only under an a-priori
 * g_min > 0 whole-trajectory bound. That bound is EXACTLY the imp-35167 M5
 * horizon-front bridge that already gates the I2 min-gap certificate. So the min-gap
 * route RELOCATES the I3 obstruction onto M5 rather than removing it: under the
 * min-gap surrogate I3 COLLAPSES INTO I2 (both now need the same g_min(t) > 0
 * whole-trajectory certificate), and the self-referential beta ~ 1/g_min coupling
 * (Q5) is inherited intact. This is progress -- the two Step-2 obligations unify to
 * one binding lever (M5) instead of two independent walls -- but it is NOT a
 * discharge: M5 is OPEN, so I3 stays OPEN. Assessment only; discharges nothing;
 * establishes no operator positivity; changes no bound; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; names this lever)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2/M5 min-gap certificate; the OPEN Q3)
 * @see imp-35194-background-field-sup-n-uniformity (F1 N-uniform beta; F2 beta ~ 1/g_min)
 * @see imp-35127-g-step-error-certified-bound-scope (I3 ingredient; I2 coupling)
 * @see backward-flow-stability-gronwall.js (imp-2520 Lemma B; strip field Lipschitz N/y^2)
 * @see lambda-roadmap.js Step 2 rigorousUpgradeGap.obligations[G-gronwall] / [G-step-error]
 */

// --- imp-35194 measured inputs (re-encoded literals; measurement, not certificate) ---
// F1: background beta N-uniform at matched front-progress across N = 50, 100, 200.
const BETA_MAX_REL_SPREAD = 0.0114; // < 1.5%: prefactor carries NO factor of N
// F2: the product beta . g_min band, decreasing toward the front (beta ~ 1/g_min).
const BETA_GMIN_WIDEST = 1.326; // at g_min ~ 0.48 (front-progress 0.5)
const BETA_GMIN_TIGHTEST = 1.036; // at g_min ~ 0.047 (front-progress 0.05)

// Front collapse rate from the imp-2563 gap ODE lower branch u = g^2, du/ds ~ -8
// near the front, so g^2(s) = g_0^2 - 8 s hits 0 at the horizon T = g_0^2 / 8.
const COLLAPSE_RATE = 8;
const C_PAIR = 1; // adjacent-pair reciprocal-square prefactor c_pair (a pair constant, no N)

// Strip field-Lipschitz prefactor (imp-35196): N-LINEAR.
function lStrip(N, y) {
  return (2 * N) / (y * y);
}

// Min-gap field-Lipschitz surrogate: prefactor is a pair constant, NO factor of N.
function lGap(g) {
  return C_PAIR / (g * g);
}

// Accumulation e-fold of the min-gap surrogate from an initial gap g0 down to a
// cutoff gap g_min, using g^2(s) = 8 (T - s): integral c_pair / g^2 ds over the flow
// equals (c_pair / 8) log(g0^2 / g_min^2). Log-divergent as g_min -> 0.
function accEfoldGap(g0, gMin) {
  return (C_PAIR / COLLAPSE_RATE) * Math.log((g0 * g0) / (gMin * gMin));
}

// Representative N-sweep on the roadmap flow anchors, with a fixed matched-front gap.
const N_SWEEP = [2, 10, 100, 1e3, 1e4, 1e5, 1e6];
const G_MATCHED = 0.1; // an illustrative matched-front-progress separation

const ROWS = N_SWEEP.map((N) => {
  const yFloorStrip = Math.sqrt(N); // the imp-35196 accumulation floor y_star ~ sqrt(N)
  return {
    N,
    // Strip prefactor is N-linear: it grows with N at any fixed height.
    l_strip_at_g: +lStrip(N, G_MATCHED).toExponential(4),
    strip_floor_ystar: +yFloorStrip.toExponential(4), // rises unbounded (imp-35196)
    // Min-gap surrogate at the SAME separation is N-INDEPENDENT.
    l_gap: +lGap(G_MATCHED).toExponential(4),
    // Ratio strip/gap = 2N (proportional to the pole count the min-gap route sheds).
    strip_over_gap: +(lStrip(N, G_MATCHED) / lGap(G_MATCHED)).toExponential(4),
  };
});

// Accumulation e-fold as the cutoff gap shrinks toward the front (log-divergent).
const G0 = 0.5;
const GMIN_SWEEP = [0.25, 0.1, 0.047, 0.01, 1e-3, 1e-4];
const EFOLD_ROWS = GMIN_SWEEP.map((gMin) => ({
  g_min: gMin,
  acc_efold: +accEfoldGap(G0, gMin).toFixed(4),
}));

export const IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT = {
  id: 'imp-35214',
  proofSection: 'S-frontier',
  question:
    'Can the imp-35167 min-gap route -- an intrinsic accumulation constant keyed to g_min(t), NOT a ' +
    'distance-to-pole bound -- supply the N-uniform field-Lipschitz surrogate that imp-35196 proved ' +
    'unreachable by any vertical strip schedule y_star(N)? Assessment only; NO QED.',
  surrogateRequirements: {
    Q1_pair_dominated_surrogate:
      'PRESENT: L_gap(g) ~ c_pair / g^2, the adjacent-pair reciprocal-square scale dominating dz M on the real axis near a collapse',
    Q2_prefactor_N_uniform:
      'PRESENT / data-level: imp-35194 F1 gives the background beta N-uniform at matched front-progress (spread < 1.5%); the min-gap prefactor sheds the strip 2N/y^2 N-linearity -- the genuine advantage over the strip route',
    Q3_apriori_gmin_lower_bound:
      'OPEN: an a-priori g_min(t) > 0 along the WHOLE backward trajectory -- EXACTLY the imp-35167 M2/M5 min-gap certificate',
    Q4_accumulation_efold_converges:
      'REDUCES to Q3: near the front g^2 ~ 8 (T - s), so integral c_pair / g^2 ds is LOG-divergent, finite only with the Q3 cutoff: E_acc = (c_pair / 8) log(g0^2 / g_min^2)',
    Q5_independence_from_gmin:
      'FAILS: the background beta driving both the gap ODE and the surrogate is itself ~ 1/g_min (imp-35194 F2 beta . g_min in (1, 1.4), decreasing 1.33 -> 1.04 toward the front) -- the same self-referential coupling imp-35167 M2 flagged',
  },
  stripVsMinGap: {
    stripPrefactor: 'L_strip = 2N / y^2 -- N-LINEAR (all N poles seen at height y); eliminated by imp-35196',
    minGapPrefactor: 'L_gap ~ c_pair / g^2 -- N-UNIFORM prefactor (adjacent pair dominates; background beta N-uniform per imp-35194 F1)',
    ratioIsPoleCount: 'L_strip / L_gap = 2N at a fixed separation: the min-gap route sheds a factor proportional to the pole count the strip route could not',
  },
  betaMaxRelSpread: BETA_MAX_REL_SPREAD,
  betaGminBand: { widest: BETA_GMIN_WIDEST, tightest: BETA_GMIN_TIGHTEST },
  rows: ROWS,
  efoldRows: EFOLD_ROWS,
  // The min-gap route DEFEATS the imp-35196 (N-linear-prefactor) obstruction ...
  defeatsStripObstruction: true,
  // ... but does NOT yield an N-uniform Lipschitz CONSTANT: it inherits beta ~ 1/g_min ...
  inheritsSelfReferentialCoupling: true,
  // ... and its accumulation e-fold is finite only under the imp-35167 M5 bridge.
  relocatesM5Obstruction: true,
  suppliesNUniformSurrogate: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The imp-35167 min-gap route genuinely DEFEATS the ' +
    'imp-35196 strip obstruction: evaluated on the real axis at the collapsing-pair separation scale the ' +
    'field-Lipschitz surrogate is L_gap ~ c_pair / g^2 with a PAIR prefactor c_pair carrying NO factor of ' +
    'N (imp-35194 F1: the background beta is N-uniform at matched front-progress, spread < 1.5%), so the ' +
    'N-LINEAR 2N/y^2 that no strip schedule y_star(N) could beat (imp-35196) is GONE -- L_strip / L_gap = 2N ' +
    'at a fixed separation, a factor proportional to the pole count the min-gap route sheds. But it does NOT supply an ' +
    'N-uniform field-Lipschitz CONSTANT. (Q3) The g_min in its denominator is uncertified along the ' +
    'trajectory -- an a-priori g_min(t) > 0 to the front is EXACTLY the imp-35167 M2/M5 min-gap ' +
    'certificate. (Q4) Its accumulation e-fold integral_0^{t_c} c_pair / g^2 ds LOG-diverges at the front ' +
    '(g^2 ~ 8 (T - s), imp-2563 gap ODE), finite only with that cutoff: E_acc = (c_pair / 8) log(g0^2 / ' +
    'g_min^2). (Q5) The beta driving both the gap ODE and the surrogate is itself ~ 1/g_min (imp-35194 F2), ' +
    'so the surrogate and its input g_min are the same self-referential coupling. CONSEQUENCE: the min-gap ' +
    'route RELOCATES the I3 obstruction onto the imp-35167 M5 horizon-front bridge rather than removing it ' +
    '-- under this surrogate I3 COLLAPSES INTO I2 (both now need the one g_min(t) > 0 whole-trajectory ' +
    'certificate). That is genuine progress (two Step-2 walls unify to one binding lever M5) but not a ' +
    'discharge: M5 is OPEN, so I3 stays OPEN. Assessment only; discharges nothing; establishes no operator ' +
    'positivity; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; names this lever); ' +
    'imp-35167-g-min-non-collision-certificate-scope (M2/M5 min-gap certificate; the OPEN Q3); ' +
    'imp-35194-background-field-sup-n-uniformity (F1 N-uniform beta; F2 beta ~ 1/g_min); ' +
    'imp-35127-g-step-error-certified-bound-scope (I3 ingredient; I2 coupling); ' +
    'backward-flow-stability-gronwall.js (imp-2520 Lemma B, strip field Lipschitz N/y^2); ' +
    'imp-2563 (gap ODE lower branch); imp-486 (C_mb GUE-conditional).',
};

export const IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT_ASSERTIONS = [
  {
    // The strip prefactor is N-linear: at a fixed separation it grows with N.
    id: 'imp35214-strip-prefactor-N-linear',
    description: 'L_strip = 2N / y^2 grows monotonically with N at a fixed height (the imp-35196 N-linearity)',
    holds: () => {
      for (let i = 1; i < ROWS.length; i += 1) {
        if (lStrip(ROWS[i].N, G_MATCHED) <= lStrip(ROWS[i - 1].N, G_MATCHED)) return false;
      }
      return true;
    },
  },
  {
    // The min-gap surrogate prefactor is N-INDEPENDENT: same value at every N.
    id: 'imp35214-min-gap-prefactor-N-uniform',
    description: 'L_gap ~ c_pair / g^2 is N-independent (a pair constant): identical across the whole N-sweep',
    holds: () => {
      const v0 = lGap(G_MATCHED);
      return N_SWEEP.every(() => Math.abs(lGap(G_MATCHED) - v0) < 1e-12);
    },
  },
  {
    // The ratio strip / gap is exactly the pole count N -- what the min-gap route sheds.
    id: 'imp35214-ratio-is-pole-count',
    description: 'L_strip / L_gap = 2N at a fixed separation: the min-gap route sheds a factor proportional to the pole count',
    holds: () => ROWS.every((r) => Math.abs(lStrip(r.N, G_MATCHED) / lGap(G_MATCHED) - 2 * r.N) < 1e-6 * r.N),
  },
  {
    // The accumulation e-fold LOG-diverges as the cutoff gap shrinks toward the front.
    id: 'imp35214-accumulation-efold-log-diverges',
    description: 'E_acc = (c_pair / 8) log(g0^2 / g_min^2) grows without bound as g_min -> 0 (finite only with a Q3 cutoff)',
    holds: () => {
      // Monotone increasing as g_min shrinks.
      for (let i = 1; i < EFOLD_ROWS.length; i += 1) {
        if (EFOLD_ROWS[i].acc_efold <= EFOLD_ROWS[i - 1].acc_efold) return false;
      }
      // Logarithmic growth: halving g_min adds a fixed increment (c_pair / 8) . log 4.
      const inc = accEfoldGap(G0, 1e-4) - accEfoldGap(G0, 2e-4);
      return Math.abs(inc - (C_PAIR / COLLAPSE_RATE) * Math.log(4)) < 1e-9;
    },
  },
  {
    // imp-35194 F1: the background beta is N-uniform at matched front-progress (prefactor sheds N).
    id: 'imp35214-beta-N-uniform-at-matched-front',
    description: 'imp-35194 F1: background beta relative spread across N is < 1.5% at matched front-progress (prefactor carries no N)',
    holds: () => BETA_MAX_REL_SPREAD > 0 && BETA_MAX_REL_SPREAD < 0.015,
  },
  {
    // imp-35194 F2: beta . g_min stays O(1) and DECREASES toward the front (beta ~ 1/g_min coupling).
    id: 'imp35214-beta-gmin-self-referential',
    description: 'imp-35194 F2: beta . g_min in (1, 1.4) and decreasing toward the front -- the inherited beta ~ 1/g_min coupling',
    holds: () =>
      BETA_GMIN_TIGHTEST > 1 &&
      BETA_GMIN_WIDEST < 1.4 &&
      BETA_GMIN_TIGHTEST < BETA_GMIN_WIDEST,
  },
  {
    // Honesty gate: defeats the strip obstruction but relocates M5; supplies NO N-uniform surrogate; NO QED; no refereed bound is changed.
    id: 'imp35214-honesty-gate-no-qed',
    description: 'Assessment only: defeats strip obstruction true, relocates M5 true, supplies N-uniform surrogate FALSE, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.defeatsStripObstruction === true &&
      IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.inheritsSelfReferentialCoupling === true &&
      IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.relocatesM5Obstruction === true &&
      IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.suppliesNUniformSurrogate === false &&
      IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT.verdict),
  },
];

for (const a of IMP35214_MIN_GAP_FIELD_LIPSCHITZ_SURROGATE_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35214-min-gap-field-lipschitz-surrogate-assessment assertion failed: ${a.id}`);
  }
}

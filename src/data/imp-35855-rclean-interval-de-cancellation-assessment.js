/**
 * @module imp-35855-rclean-interval-de-cancellation-assessment
 *
 * ASSESSMENT / SCOPING ONLY. imp-35810 showed that the naively-evaluated Krawczyk surplus-split ratio
 * R_measured = -dFP/dG carries relative error ~ eps_mach / a because it forms
 *   dG = S_inf . (M_G - 1),   M_G = 2G/(1+G),   G = 1 - a,
 * i.e. it subtracts the near-equal quantities M_G (a ~1 number) and 1, whose difference
 * |M_G - 1| = a/(2-a) -> 0 collapses toward the machine floor as a(N) -> 0. imp-35810 used the
 * algebraically-identical cancellation-free R_clean = 2 (aLo/a)(1-a)/(1-aLo) ONLY as a post-hoc
 * diagnostic reference. The OPEN imp-34714a machine certificate still routes dG through the M_G - 1
 * subtraction, so a directed-rounding enclosure [dG] inherits the cancellation as an inflated interval
 * width, and F(m) = 0 stays a double-precision artifact.
 *
 * THE QUESTION (assessment, not a port)
 * -------------------------------------
 * Does R_clean admit an interval-arithmetic evaluation that lets the imp-34714a Krawczyk machinery avoid
 * the dG = S_inf (M_G - 1) near-equal subtraction ENTIRELY -- rather than only diagnosing the artifact
 * after the fact? Equivalently: is the cancellation-free form directly interval-representable at the
 * dG node, and with what conditioning?
 *
 * THE ALGEBRAIC DE-CANCELLATION (the crux)
 * ----------------------------------------
 * The subtraction is removable in CLOSED FORM, not merely reorderable:
 *   M_G - 1 = 2G/(1+G) - 1 = (2G - (1+G))/(1+G) = (G - 1)/(1+G) = -a/(2-a),   since G = 1 - a.
 * Hence the identical real number dG can be evaluated as
 *   dG = S_inf . (M_G - 1)        [cancellation route: subtracts near-equal M_G, 1]
 *      = -S_inf . a/(2-a)          [cancellation-free route: a computed DIRECTLY, 2-a well away from 0].
 * The cancellation-free route contains no subtraction of near-equal quantities: a is the small positive
 * input evaluated directly (never as a difference of ~1 numbers), and the only subtraction, 2 - a,
 * subtracts a tiny a from 2, which is perfectly conditioned (its condition number |2|/|2-a| ~ 1). The
 * ratio R then evaluates as R_direct = -dFP/dG = 2 (aLo/a)(1-a)/(1-aLo) = R_clean identically.
 *
 * CONDITIONING METRIC (scoping surrogate, NO interval instantiated)
 * -----------------------------------------------------------------
 * The relative width that a directed-rounding enclosure inflicts on dG is governed by the subtraction
 * condition number kappa_sub = |x| + |y| over |x - y| at that node:
 *   cancellation route:  kappa_cancel = (|M_G| + 1)/|M_G - 1| ~ 2/(a/2) ~ 4/a  ->  DIVERGES as a -> 0.
 *   cancellation-free route: kappa_direct = (|2| + |a|)/|2 - a| ~ 2/2 ~ 1      ->  O(1), BOUNDED.
 * So an enclosure [dG] built on the -a/(2-a) form carries relative width ~ O(1) . eps_directed, while the
 * M_G - 1 form carries ~ (4/a) . eps_directed -- the exact factor imp-35810 measured as the ~ eps_mach/a
 * departure envelope. Replacing the dG node with the R_clean form therefore DE-CANCELS the certificate at
 * that node: the near-equal subtraction is avoided entirely, not just diagnosed. We DEMONSTRATE this in
 * double precision (a strict lower bound on any directed-rounding gain): R_direct tracks R_clean to the
 * machine floor at every height up to N ~ 1e21, whereas R_measured departs on the ~ eps_mach/a envelope.
 *
 * WHY THIS DOES NOT CLOSE imp-34714a (the honest sub-gap)
 * ------------------------------------------------------
 * This is a NODE-LEVEL de-cancellation of ONE subtraction inside the surplus-split diagnostic. The full
 * imp-34714a certificate is the Krawczyk operator K(m) = m - [F-prime]^{-1} F(m) evaluated over the
 * imp-34687a directed-rounding layer; it involves F(m), [F-prime], and the g(m)/F-prime enclosures, none
 * of which this assessment ports, instantiates, or audits for OTHER cancellations. R_clean being
 * interval-representable at the dG node is NECESSARY but not SUFFICIENT for a valid certificate: F(m) = 0
 * remains a double-precision artifact, no interval is instantiated here, imp-34714a REMAINS OPEN, and no
 * bound moves. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35810-cancellation-onset-height (measured the ~ eps_mach/a departure envelope; R_clean as diagnostic)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 flagged the float-cancellation artifact)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35766/imp-35810)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Evaluate the SAME real dG two ways, plus the node-level subtraction condition numbers.
function assess(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const M_G = (2 * G) / (1 + G); // ~ 1, rounded to ~0.5 ULP absolute

  const dG_cancel = S_INF * (M_G - 1); // cancellation route: subtracts near-equal M_G, 1
  const dG_direct = -(S_INF * a) / (2 - a); // cancellation-free: a direct, 2-a well-conditioned
  const dFP = S_INF * M_G * (aLo / (1 - aLo)); // common numerator (M_G ~1, not cancelling)

  const R_cancel = -dFP / dG_cancel; // carries relative error ~ eps_mach/a
  const R_direct = -dFP / dG_direct; // de-cancelled; = R_clean identically
  const R_clean = (2 * (aLo / a) * (1 - a)) / (1 - aLo); // cancellation-free reference

  const depart_cancel = Math.abs(R_cancel - R_clean) / Math.abs(R_clean); // ~ eps_mach/a
  const depart_direct = Math.abs(R_direct - R_clean) / Math.abs(R_clean); // ~ eps_mach (machine floor)

  // Subtraction condition numbers (relative interval-width amplification at the node).
  const kappa_cancel = (Math.abs(M_G) + 1) / Math.abs(M_G - 1); // ~ 4/a, diverges
  const kappa_direct = (2 + Math.abs(a)) / Math.abs(2 - a); // ~ 1, bounded

  return {
    N,
    a,
    dG_cancel,
    dG_direct,
    R_cancel,
    R_direct,
    R_clean,
    depart_cancel,
    depart_direct,
    kappa_cancel,
    kappa_direct,
  };
}

// Sweep the height axis from below the PT anchor into the deep float-cancellation regime.
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) SWEEP.push(assess(Math.pow(10, L)));

const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13
const PT = assess(N_PT);
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21, deep in the cancellation regime

// Algebraic identity check at a MODERATE height where the M_G-1 subtraction is still well-resolved
// (a ~ 1e-5), so both forms of dG agree to many digits -- confirming they are the SAME real number.
const CHECK = assess(1e13);
const DG_FORMS_AGREE_LOW = Math.abs(CHECK.dG_cancel - CHECK.dG_direct) / Math.abs(CHECK.dG_direct) < 1e-6;

// De-cancellation demonstrated: at the TOP of the sweep the cancellation route has lost many digits
// (depart_cancel large) while the direct route stays at the machine floor.
const MAX_DEPART_DIRECT = Math.max(...SWEEP.map((r) => r.depart_direct));
const DE_CANCELLED = TOP.depart_cancel > 1e-6 && MAX_DEPART_DIRECT < 1e-10;

// Conditioning: the cancellation node diverges up the height axis; the direct node stays O(1).
const MAX_KAPPA_DIRECT = Math.max(...SWEEP.map((r) => r.kappa_direct));
const KAPPA_CANCEL_GROWS = TOP.kappa_cancel > PT.kappa_cancel && TOP.kappa_cancel > 1e6;
const KAPPA_DIRECT_BOUNDED = MAX_KAPPA_DIRECT < 2; // ~1 everywhere

export const IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION = {
  id: 'imp-35855',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35810 cancellation-free closed-form ratio R_clean = 2 (aLo/a)(1-a)/(1-aLo) admit an ' +
    'interval-arithmetic evaluation that lets the OPEN imp-34714a Krawczyk certificate avoid the ' +
    'dG = S_inf (M_G - 1) near-equal subtraction ENTIRELY, rather than only diagnosing the artifact ' +
    'post hoc -- i.e. is R_clean directly interval-representable at the dG node, and with what ' +
    'conditioning? Assessment/scoping only; ports nothing; instantiates no interval; NO QED.',
  finding:
    'YES at the dG NODE. The near-equal subtraction is removable in CLOSED FORM: M_G - 1 = -a/(2-a) ' +
    '(from G = 1 - a), so the identical real dG = S_inf (M_G - 1) = -S_inf a/(2-a) can be evaluated with a ' +
    'computed DIRECTLY (never as a difference of ~1 numbers) and the only subtraction 2 - a perfectly ' +
    'conditioned. The subtraction condition number at the node collapses from kappa_cancel = (|M_G|+1)/' +
    '|M_G-1| ~ 4/a (which DIVERGES as a -> 0) to kappa_direct = (2+a)/(2-a) ~ 1 (BOUNDED, max over the ' +
    'sweep ~ ' +
    MAX_KAPPA_DIRECT.toFixed(6) +
    '). So a directed-rounding enclosure [dG] on the R_clean form carries relative width ~ O(1) eps ' +
    'instead of ~ (4/a) eps -- the cancellation is AVOIDED, not merely diagnosed. Double-precision ' +
    'demonstration (a strict lower bound on the directed-rounding gain): R_direct tracks R_clean to the ' +
    'machine floor (max departure ~ ' +
    MAX_DEPART_DIRECT.toExponential(2) +
    ') at every height to N ~ 1e21, while R_measured departs by ~ ' +
    TOP.depart_cancel.toExponential(2) +
    ' at the top of the sweep on the eps_mach/a envelope. ASSESSMENT/SCOPING, NOT a machine certificate.',
  constants: {
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    machine_epsilon: Number.EPSILON,
  },
  metric: {
    kappa_cancel_at_PT: +PT.kappa_cancel.toExponential(4),
    kappa_cancel_at_top: +TOP.kappa_cancel.toExponential(4),
    kappa_direct_max_over_sweep: +MAX_KAPPA_DIRECT.toExponential(4),
    depart_measured_at_top: +TOP.depart_cancel.toExponential(4),
    depart_direct_max_over_sweep: +MAX_DEPART_DIRECT.toExponential(4),
    dG_forms_agree_at_low_N: DG_FORMS_AGREE_LOW,
    de_cancellation_demonstrated: DE_CANCELLED,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This de-cancels ONE subtraction (the dG node) in closed form and shows it is ' +
    'interval-representable with O(1) conditioning -- NECESSARY but not SUFFICIENT. The full Krawczyk operator ' +
    'K(m) = m - [F-prime]^{-1} F(m) over the imp-34687a directed-rounding layer (F(m), [F-prime], the g/F-prime ' +
    'enclosures) is NOT ported, instantiated, or audited for other cancellations here. F(m) = 0 stays a ' +
    'double-precision artifact; no interval is instantiated; changes no bound.',
  isRigorous: false,
  verdict:
    'R_clean IS DIRECTLY INTERVAL-REPRESENTABLE AT THE dG NODE, WITH O(1) CONDITIONING (assessment/scoping, ' +
    'NOT an RH bound). The near-equal subtraction M_G - 1 is removable in closed form as -a/(2-a), so the ' +
    'identical dG = -S_inf a/(2-a) evaluates a directly and 2 - a is well-conditioned; the node condition ' +
    'number drops from ~ 4/a (divergent) to ~ 1 (bounded, max ~ ' +
    MAX_KAPPA_DIRECT.toFixed(4) +
    '). Double precision demonstrates the de-cancellation: R_direct = R_clean to the machine floor (max ~ ' +
    MAX_DEPART_DIRECT.toExponential(2) +
    ') through N ~ 1e21, while R_measured rides the eps_mach/a envelope (departure ~ ' +
    TOP.depart_cancel.toExponential(2) +
    ' at the top). So replacing the dG = S_inf (M_G - 1) node with the R_clean form WOULD let a Krawczyk/' +
    'interval evaluation avoid the cancellation ENTIRELY, not merely diagnose it. SUB-GAP imp-34714a REMAINS ' +
    'OPEN: this is a node-level de-cancellation, NECESSARY but not SUFFICIENT; the full K(m) operator over the ' +
    'imp-34687a directed-rounding layer is not ported, no interval is instantiated, and F(m) = 0 remains a ' +
    'double-precision artifact. Reuses the imp-35266/imp-35766/imp-35810 machinery (identical K, delta, S_inf, ' +
    'aOf); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35810 (eps_mach/a departure envelope; R_clean as diagnostic); imp-35766 (B3 float-cancellation ' +
    'artifact); imp-35266 (2:1 split -dFP/dG ~ 2.00042); imp-34996 (S_inf = 1/(2 delta) floor); imp-34714a ' +
    '(OPEN Krawczyk machine certificate); imp-34687a (directed-rounding layer); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Subtraction condition number ' +
    'kappa = (|x|+|y|)/|x-y| and closed-form cancellation removal: standard floating-point / interval analysis.',
};

export const IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION_ASSERTIONS = [
  {
    // The two forms of dG are the SAME real number: they agree to many digits where a is well-resolved.
    id: 'imp35855-dG-forms-are-the-same-real-number',
    description: 'dG = S_inf(M_G-1) and dG = -S_inf a/(2-a) agree < 1e-6 at N=1e13 (a ~1e-5)',
    holds: () => DG_FORMS_AGREE_LOW === true,
  },
  {
    // De-cancellation: the direct route holds the machine floor everywhere while the cancel route blows up.
    id: 'imp35855-direct-form-de-cancels',
    description: 'R_direct tracks R_clean to machine floor (<1e-10) up to N~1e21; R_measured departs >1e-6 at top',
    holds: () => DE_CANCELLED === true && MAX_DEPART_DIRECT < 1e-10,
  },
  {
    // Conditioning: the cancellation node diverges up the height axis; the direct node stays O(1).
    id: 'imp35855-node-conditioning-collapses-to-O1',
    description: 'kappa_cancel ~ 4/a diverges (>1e6 at top, grows past PT); kappa_direct ~ 1 bounded (<2)',
    holds: () => KAPPA_CANCEL_GROWS === true && KAPPA_DIRECT_BOUNDED === true,
  },
  {
    // Interval-representability claim recorded: the finding states YES at the dG node with O(1) conditioning.
    id: 'imp35855-interval-representable-at-dG-node',
    description: 'finding asserts YES at the dG node; metric records de_cancellation_demonstrated true',
    holds: () =>
      /YES at the dG NODE/.test(IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.finding) &&
      IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.metric.de_cancellation_demonstrated === true,
  },
  {
    // Honesty gate: assessment/scoping, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35855-honesty-gate-no-qed',
    description: 'assessment: isRigorous false, imp-34714a open, node-level NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.subGap) &&
      /NO QED/.test(IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.verdict) &&
      /refereed bound is changed/i.test(IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION.verdict),
  },
];

for (const a of IMP35855_RCLEAN_INTERVAL_DE_CANCELLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35855-rclean-interval-de-cancellation-assessment assertion failed: ${a.id}`);
  }
}

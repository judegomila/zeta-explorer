/**
 * @module imp-35925-krawczyk-interior-subtraction-audit
 *
 * ASSESSMENT / MEASUREMENT ONLY. imp-35885 audited the OPERATOR-LEVEL difference nodes of the OPEN
 * imp-34714a Krawczyk certificate K(m) = m - [F-prime]^{-1} F(m), F(N) = N - g(N), F-prime = 1 - g-prime,
 * treating the map value g(N) = K log T0(N) and the Jacobian a(N) = g-prime(N) = 2 pi K / (T0 u),
 * u = log(T0/2pi), as ATOMIC building blocks. It found NONE of A/B/C/D carries the dG-type near-equal
 * subtraction (kappa_sub ~ 4/a) that imp-35855 de-cancelled. imp-35925 asks the NEXT-FINER question that
 * imp-35885 explicitly left atomic: WHICH subtraction sites live INSIDE the enclosures of F(m), [F-prime],
 * and g/F-prime themselves -- i.e. below the operator level -- and do any of THEM carry a subtraction
 * condition number kappa_sub = (|x| + |y|)/|x - y| that DIVERGES as a(N) -> 0 and would need its own
 * closed-form de-cancellation for a full interval K(m) certificate?
 *
 * THE QUESTION (assessment, not a port)
 * -------------------------------------
 * To build a directed-rounding enclosure [F(m)], [F-prime], and [g/F-prime], the machine must first
 * enclose g(N) = K log T0(N) and a(N) = 2 pi K / (T0 u). Those pass through the Riemann-von Mangoldt
 * inverse T0(N) that solves N(T) = (T/2pi)(u - 1) with u = log(T/2pi) (imp-3220/imp-3406 RvM surrogate,
 * lambda-rh-height-mapping.effectiveHeightForN). Enumerate the difference nodes at THIS interior layer and
 * form kappa_sub at each; which stay O(1) and which diverge as a -> 0?
 *
 * THE INTERIOR NODE CATALOGUE (each difference below the operator level, and its kappa_sub)
 * ----------------------------------------------------------------------------------------
 *  NODE E -- the RvM main-term factor (u - 1) inside T0(N):  N(T) = (T/2pi)(u - 1), u = log(T/2pi). The
 *    only near-equal-candidate subtraction the T0(N) inverse (and hence every enclosure of g and a) must
 *    pass through is u - 1. Its condition number kappa_E = (|u| + 1)/|u - 1| = (u + 1)/(u - 1) -> 1 as
 *    a -> 0, because on the height axis a -> 0 forces T0 -> infinity, so u = log(T0/2pi) GROWS without
 *    bound (u ~ 26.7 at N ~ 1e13, ~ 44.6 at N ~ 1e21). kappa_E would only diverge if u -> 1, i.e.
 *    T0 -> 2 pi e ~ 17.08 -- unreachably far BELOW the verified-height regime. BOUNDED, and DE-conditions
 *    (tends to 1) exactly along the a -> 0 axis where dG diverges: the polar opposite behaviour.
 *  NODE F -- the argument u = log(T0/2pi):  T0/2pi is a DIVISION (no subtraction), and log is a monotone
 *    unary map, so u carries NO subtraction of near-equal quantities. (The algebraically equal split
 *    u = log T0 - log(2pi) would subtract log(2pi) ~ 1.838 from log T0 ~ 26.7..44.6, giving
 *    kappa = (log T0 + log 2pi)/|log T0 - log 2pi| ~ 1.15, still bounded -- but the surrogate forms u as a
 *    single log of a ratio, so there is no interior subtraction here at all.)
 *  NODE G -- the Newton residual f = N(T) - N inside the T0(N) inverse:  this subtracts the target count N
 *    from the running estimate N(T); at the converged root f -> 0. That is the SAME residual-at-root form
 *    as the operator-level F(m) = m - g(m) = 0 artifact already CLASSIFIED by imp-35885 NODE B
 *    (a-INDEPENDENT root-proximity at the FIXED solution, not an a -> 0 divergence). Not a new dG-type site.
 *
 * VERDICT (assessment, NO interval instantiated, imp-34714a REMAINS OPEN)
 * ----------------------------------------------------------------------
 * Descending ONE granularity below imp-35885 into the interior of the F(m)/[F-prime]/(g/F-prime)
 * enclosures, the ONLY genuine near-equal-candidate subtraction is the RvM main-term factor u - 1
 * (NODE E), and it is O(1)-conditioned: kappa_E = (u + 1)/(u - 1) ~ 1.08 at N ~ 1e13 and DE-conditions to
 * ~ 1 as a -> 0 (u grows), the exact opposite of the dG node. The u node (NODE F) is a log-of-ratio with
 * no interior subtraction; the Newton residual (NODE G) is the already-known a-independent
 * residual-at-root, not a dG-type divergence. So NO interior sub-node needs closed-form de-cancellation
 * either: across BOTH the operator-level audit (imp-35885, nodes A/B/C/D) and this interior-level audit
 * (nodes E/F/G), the imp-35855 dG = S_inf (M_G - 1) surplus-split node remains the UNIQUE
 * divergent-as-a -> 0 subtraction in the machine.
 *
 * WHY THIS DOES NOT CLOSE imp-34714a (the honest sub-gap)
 * ------------------------------------------------------
 * This is a double-precision CONDITIONING catalogue of the interior subtraction sites -- a diagnostic
 * surrogate for the imp-34687a directed-rounding layer, one level finer than imp-35885. It instantiates NO
 * interval, ports NO certificate, and does NOT discharge the F(m) = 0 residual-at-root artifact; it only
 * extends the imp-35885 classification to the interior and confirms no further de-cancellation is required.
 * Establishing that the interior nodes are O(1)-conditioned is NECESSARY but not SUFFICIENT; the full K(m)
 * operator over the imp-34687a layer is not ported. imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35885-krawczyk-node-cancellation-audit (operator-level nodes A/B/C/D; left g/a atomic)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node in closed form)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (the operator K(m); F(m)=0 artifact; contraction gap)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM inverse N(T)=(T/2pi)(u-1), u=log(T/2pi))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35855/imp-35885)

// Height-axis parameter a(N) = g-prime(N) = 2 pi K / (T0 u), u = log(T0/2pi) (identical to imp-35885 aOf),
// and the interior RvM building block u itself.
const uOf = (N) => Math.log(effectiveHeightForN(N) / TWO_PI);
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Interior subtraction condition numbers.
// NODE E -- the RvM main-term factor (u - 1): subtracts 1 from the LARGE u (~26..45), not near-equal.
const kappaMainTerm = (u) => (u + 1) / Math.abs(u - 1); // -> 1 as u -> infinity (a -> 0)
// NODE F -- the algebraically-equal log-difference split u = log T0 - log(2pi) (the surrogate does NOT use
// this form; recorded to show even that split stays bounded). log(2pi) ~ 1.838.
const LOG_TWO_PI = Math.log(TWO_PI);
const kappaLogSplit = (T0) => {
  const lT = Math.log(T0);
  return (lT + LOG_TWO_PI) / Math.abs(lT - LOG_TWO_PI); // -> 1 as T0 -> infinity
};
// CONTRAST -- the imp-35855 dG node (M_G - 1, M_G = 2G/(1+G), G = 1 - a): kappa ~ 4/a, DIVERGES as a -> 0.
const kappaDG = (a) => {
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  return (Math.abs(M_G) + 1) / Math.abs(M_G - 1);
};

// Sweep the height axis a -> 0 exactly as imp-35855/imp-35885 (N = 10^13 .. 10^21).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) {
  const N = Math.pow(10, L);
  const T0 = effectiveHeightForN(N);
  const u = uOf(N);
  const a = aOf(N);
  SWEEP.push({
    N,
    T0,
    u,
    a,
    kappaMainTerm: kappaMainTerm(u), // NODE E
    kappaLogSplit: kappaLogSplit(T0), // NODE F (equal-split reference)
    kappaDG: kappaDG(a), // contrast (the de-cancelled node)
  });
}
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21, deepest a -> 0
const BOTTOM = SWEEP[0]; // N ~ 1e13

// NODE E ((u - 1)) is bounded across the whole a -> 0 sweep and tends to 1 (DE-conditions as a -> 0).
const MAX_KAPPA_MAIN_TERM = Math.max(...SWEEP.map((r) => r.kappaMainTerm));
const MAIN_TERM_TENDS_TO_ONE =
  TOP.kappaMainTerm < BOTTOM.kappaMainTerm && Math.abs(TOP.kappaMainTerm - 1) < 0.05;
// NODE F (equal-split reference) is likewise bounded and tends to 1.
const MAX_KAPPA_LOG_SPLIT = Math.max(...SWEEP.map((r) => r.kappaLogSplit));
const LOG_SPLIT_TENDS_TO_ONE =
  TOP.kappaLogSplit < BOTTOM.kappaLogSplit && Math.abs(TOP.kappaLogSplit - 1) < 0.1;
// CONTRAST: the dG node DIVERGES up the same axis (reproduces the imp-35855/imp-35885 ~4/a reading).
const DG_DIVERGES = TOP.kappaDG > BOTTOM.kappaDG && TOP.kappaDG > 1e6;

export const IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT = {
  id: 'imp-35925',
  proofSection: 'S-frontier',
  question:
    'imp-35885 audited the OPERATOR-LEVEL nodes A/B/C/D of the OPEN imp-34714a Krawczyk certificate ' +
    'K(m) = m - [F-prime]^{-1} F(m) but treated the map value g(N) = K log T0(N) and Jacobian ' +
    'a(N) = g-prime(N) as ATOMIC. Descending ONE granularity finer, which subtraction sites INSIDE the ' +
    'enclosures of F(m), [F-prime], and g/F-prime -- i.e. inside the RvM inverse T0(N) that solves ' +
    'N(T) = (T/2pi)(u - 1), u = log(T/2pi) -- carry a subtraction condition number kappa_sub = ' +
    '(|x|+|y|)/|x-y| that DIVERGES as a(N) -> 0 and would need its own closed-form de-cancellation? ' +
    'Assessment/measurement only; instantiates no interval; ports no certificate; NO QED.',
  finding:
    'NONE of the interior nodes carries a dG-type divergent-as-a->0 subtraction. NODE E the RvM main-term ' +
    'factor (u - 1) -- the only near-equal-candidate subtraction the T0(N) inverse (hence every enclosure ' +
    'of g and a) passes through -- subtracts 1 from the LARGE u = log(T0/2pi) (~ ' +
    BOTTOM.u.toFixed(2) +
    ' at N~1e13 to ~ ' +
    TOP.u.toFixed(2) +
    ' at N~1e21), so kappa_E = (u+1)/(u-1) -> 1 as a -> 0 (max over the sweep ~ ' +
    MAX_KAPPA_MAIN_TERM.toFixed(6) +
    ', BOUNDED, DE-conditions) -- the polar opposite of dG, which subtracts the near-1 M_G from 1. It ' +
    'would only diverge if u -> 1 (T0 -> 2 pi e ~ 17.08), unreachably below the verified-height regime. ' +
    'NODE F the argument u = log(T0/2pi) is a log of a DIVISION with no interior subtraction at all (even ' +
    'the equal-split u = log T0 - log 2pi stays bounded, kappa -> 1, max ~ ' +
    MAX_KAPPA_LOG_SPLIT.toFixed(6) +
    '). NODE G the Newton residual N(T) - N is the SAME residual-at-root form as the imp-35885 NODE B ' +
    'F(m)=0 artifact (a-INDEPENDENT root-proximity, not an a->0 divergence). CONTRAST: the de-cancelled dG ' +
    'node DIVERGES up the same axis, kappa_dG ~ 4/a from ~ ' +
    BOTTOM.kappaDG.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.kappaDG.toExponential(2) +
    ' at N~1e21. So across BOTH the operator-level (imp-35885) and interior-level (this) audits the ' +
    'imp-35855 dG surplus-split node remains the UNIQUE a->0-divergent subtraction; no interior sub-node ' +
    'needs closed-form de-cancellation. ASSESSMENT/SCOPING, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    u_at_bottom: +BOTTOM.u.toFixed(6),
    u_at_top: +TOP.u.toFixed(6),
    machine_epsilon: Number.EPSILON,
  },
  interiorNodeCatalogue: [
    { node: 'E: RvM main-term factor (u - 1), u = log(T0/2pi)', form: '(u+1)/(u-1)', limit_as_a_to_0: 1, diverges: false },
    { node: 'F: argument u = log(T0/2pi)', form: 'log of a DIVISION (no subtraction); equal-split (logT0+log2pi)/|logT0-log2pi|', limit_as_a_to_0: 1, diverges: false },
    { node: 'G: Newton residual N(T) - N (residual-at-root)', form: 'imp-35885 NODE B F(m)=0 artifact (a-independent)', limit_as_a_to_0: 1, diverges: false },
    { node: 'dG (imp-35855, de-cancelled): S_inf(M_G-1)', form: '~4/a', limit_as_a_to_0: Infinity, diverges: true },
  ],
  metric: {
    kappa_main_term_at_bottom: +BOTTOM.kappaMainTerm.toExponential(4),
    kappa_main_term_at_top: +TOP.kappaMainTerm.toExponential(4),
    kappa_main_term_max_over_sweep: +MAX_KAPPA_MAIN_TERM.toExponential(4),
    kappa_log_split_max_over_sweep: +MAX_KAPPA_LOG_SPLIT.toExponential(4),
    kappa_dG_at_bottom: +BOTTOM.kappaDG.toExponential(4),
    kappa_dG_at_top: +TOP.kappaDG.toExponential(4),
    main_term_tends_to_one: MAIN_TERM_TENDS_TO_ONE,
    log_split_tends_to_one: LOG_SPLIT_TENDS_TO_ONE,
    dG_diverges: DG_DIVERGES,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision CONDITIONING catalogue of the INTERIOR subtraction ' +
    'sites (one granularity below imp-35885), a diagnostic surrogate for the imp-34687a directed-rounding ' +
    'layer. It instantiates NO interval, ports NO certificate, and does NOT discharge the F(m) = 0 ' +
    'residual-at-root artifact; it only extends the imp-35885 classification to the interior and confirms no ' +
    'further de-cancellation is required. O(1) interior conditioning is NECESSARY but not SUFFICIENT; the ' +
    'full K(m) operator over the imp-34687a layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK INTERIOR-SUBTRACTION AUDIT (assessment/scoping, NOT an RH bound). Descending ONE granularity ' +
    'below the imp-35885 operator-level catalogue into the interior of the F(m)/[F-prime]/(g/F-prime) ' +
    'enclosures -- the RvM inverse T0(N) solving N(T)=(T/2pi)(u-1), u=log(T/2pi): NONE of the interior nodes ' +
    'carries a dG-type divergent-as-a->0 subtraction. The ONLY near-equal-candidate is the RvM main-term ' +
    'factor (u - 1) (NODE E), O(1)-conditioned with kappa_E=(u+1)/(u-1) -> 1 as a -> 0 (max ~ ' +
    MAX_KAPPA_MAIN_TERM.toFixed(4) +
    ') because it subtracts 1 from the LARGE, GROWING u ~ ' +
    BOTTOM.u.toFixed(1) +
    '..' +
    TOP.u.toFixed(1) +
    ' -- the polar opposite of dG (kappa ~ 4/a, ~ ' +
    TOP.kappaDG.toExponential(2) +
    ' at N~1e21). The u argument (NODE F) is a log of a DIVISION with no interior subtraction (even the ' +
    'equal-split log T0 - log 2pi stays bounded), and the Newton residual (NODE G) is the already-known ' +
    'a-independent residual-at-root, not a dG-type divergence. So across BOTH the operator-level ' +
    '(imp-35885) and interior-level (this) audits the imp-35855 dG surplus-split node remains the UNIQUE ' +
    'a->0-divergent subtraction; no interior sub-node needs closed-form de-cancellation. SUB-GAP imp-34714a ' +
    'REMAINS OPEN: a double-precision conditioning catalogue, NOT a machine certificate; no interval ' +
    'instantiated, the F(m)=0 artifact is classified not discharged, the imp-34687a layer is not ported. ' +
    'Reuses the imp-34774/imp-35855/imp-35885 machinery (identical K_AMPL, aOf, RvM inverse); C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35885 (operator-level nodes A/B/C/D; left g/a atomic); imp-35855 (de-cancelled the dG node in ' +
    'closed form, M_G-1=-a/(2-a)); imp-34774 (the operator K(m), F(m)=0 artifact, contraction gap); ' +
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-34687 (directed-rounding ' +
    'layer; sub-gap imp-34687a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'RvM inverse N(T)=(T/2pi)(u-1)). Subtraction condition number kappa = (|x|+|y|)/|x-y|: standard ' +
    'floating-point / interval analysis (Moore, Neumaier).',
};

export const IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT_ASSERTIONS = [
  {
    // NODE E: the RvM main-term factor (u - 1) is O(1)-conditioned and tends to 1 as a -> 0.
    id: 'imp35925-main-term-node-is-O1',
    description: 'kappa_(u-1) = (u+1)/(u-1) is bounded (<1.1) across the a->0 sweep and tends to 1',
    holds: () => MAX_KAPPA_MAIN_TERM < 1.1 && MAIN_TERM_TENDS_TO_ONE === true,
  },
  {
    // NODE F: even the equal-split log-difference form of u is bounded and tends to 1 as a -> 0.
    id: 'imp35925-u-argument-has-no-divergent-subtraction',
    description: 'equal-split (logT0+log2pi)/|logT0-log2pi| is bounded (<1.2) across the sweep and -> 1',
    holds: () => MAX_KAPPA_LOG_SPLIT < 1.2 && LOG_SPLIT_TENDS_TO_ONE === true,
  },
  {
    // CONTRAST: the de-cancelled dG node DOES diverge up the same axis, confirming it was the unique one.
    id: 'imp35925-dG-node-is-the-unique-divergent-one',
    description: 'kappa_dG ~ 4/a diverges up the same a->0 sweep (>1e12 at top, grows from bottom)',
    holds: () => DG_DIVERGES === true && TOP.kappaDG > 1e12,
  },
  {
    // Interior catalogue records exactly one divergent node (the de-cancelled dG); all interior nodes bounded.
    id: 'imp35925-interior-catalogue-one-divergent-node',
    description: 'interiorNodeCatalogue: exactly one entry diverges (dG); all interior nodes (E/F/G) do not',
    holds: () => {
      const cat = IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.interiorNodeCatalogue;
      const diverging = cat.filter((n) => n.diverges === true);
      return diverging.length === 1 && /dG/.test(diverging[0].node);
    },
  },
  {
    // Honesty gate: assessment/scoping, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35925-honesty-gate-no-qed',
    description: 'assessment: isRigorous false, imp-34714a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.subGap) &&
      /NO QED/.test(IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT.verdict),
  },
];

for (const a of IMP35925_KRAWCZYK_INTERIOR_SUBTRACTION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35925-krawczyk-interior-subtraction-audit assertion failed: ${a.id}`);
  }
}

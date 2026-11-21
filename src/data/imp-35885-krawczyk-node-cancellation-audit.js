/**
 * @module imp-35885-krawczyk-node-cancellation-audit
 *
 * ASSESSMENT / MEASUREMENT ONLY. imp-35855 de-cancelled exactly ONE node of the OPEN imp-34714a machine
 * Krawczyk certificate -- the surplus-split diagnostic node dG = S_inf (M_G - 1), whose near-equal
 * subtraction M_G - 1 = a/(2-a) carries a subtraction condition number kappa_sub ~ 4/a that DIVERGES as
 * the height-axis parameter a(N) = 2 pi K / (T u) -> 0 (kappa ~ 2.6e5 at N ~ 1e13 up to ~ 2.6e13 at
 * N ~ 1e21). imp-35855 explicitly states that the OTHER nodes of the operator
 *   K(m) = m - [F-prime]^{-1} F(m),  F(N) = N - g(N),  g(N) = K log T0(N),  F-prime(N) = 1 - g-prime(N)
 * -- namely F(m), the [F-prime] Jacobian enclosure, and the g(m)/F-prime enclosures -- were NOT audited for
 * OTHER cancellations of the same dG type. THIS MODULE audits them.
 *
 * THE QUESTION (assessment, not a port)
 * -------------------------------------
 * Forming the subtraction condition number kappa_sub = (|x| + |y|)/|x - y| at EVERY difference node of
 * K(m), which (if any) OTHER nodes carry a kappa_sub that DIVERGES as a(N) -> 0 -- i.e. would inflate a
 * directed-rounding enclosure the way dG did -- and which stay O(1)?
 *
 * THE NODE CATALOGUE (each difference node of K(m) and its subtraction condition number)
 * -------------------------------------------------------------------------------------
 *  NODE A -- the [F-prime] Jacobian:  F-prime = 1 - g-prime = 1 - a  (g-prime = a on the height axis).
 *    This subtracts the SMALL positive a directly from 1 (never a near-1 quantity from 1), so
 *      kappa_A = (|1| + |a|)/|1 - a| = (1 + a)/(1 - a) -> 1  as a -> 0.   BOUNDED (the polar opposite of
 *    dG, which subtracts the near-1 quantity M_G ~ 1 from 1). The [F-prime] Jacobian is the most natural
 *    dG candidate -- both are "1 minus something" -- yet its conditioning is O(1) precisely because the
 *    subtrahend a is small, not near 1.
 *  NODE B -- the residual F(m) = m - g(m):  at the certificate CENTRE m = N_cross (the fixed point of g)
 *    this is EXACTLY 0 in double precision, so kappa_B is the DEGENERATE 0/0 residual-at-root form. This
 *    is the ALREADY-KNOWN F(m) = 0 artifact (imp-34774/imp-34908/imp-35855): a directed-rounding F(m)
 *    would be a small NONZERO interval, tightening the image, not an a-driven inflation. Its ill-condition
 *    is ROOT-PROXIMITY at the FIXED a ~ 0.045 of N_cross, NOT an a -> 0 divergence: moving OFF the root up
 *    the height axis, the residual DE-conditions -- kappa_F_axis = (N + g(N))/|N - g(N)| -> 1 as a -> 0
 *    because g(N) = K log T0 grows only logarithmically while N grows linearly (g/N ~ 4.5e-4 at N ~ 1e13
 *    down to ~ 7.3e-12 at N ~ 1e21). So NODE B is NOT a dG-type a -> 0 subtraction.
 *  NODE C -- the g(m)/F-prime enclosure (the Krawczyk quotient q = F(m)/F-prime):  a DIVISION, not a
 *    subtraction, so it has NO subtraction condition number at all. Its denominator F-prime = 1 - a is
 *    bounded away from 0 by the contraction gap (imp-34774), so the quotient is well-conditioned; there is
 *    no near-equal cancellation to catalogue here.
 *  NODE D -- the Krawczyk update m - q:  at the landmark-centred bracket F(m) = 0 => q = 0, so m - q = m
 *    subtracts 0 from m and kappa_D = (|m| + 0)/|m| = 1.   BOUNDED.
 *
 * VERDICT (assessment, NO interval instantiated, imp-34714a REMAINS OPEN)
 * ----------------------------------------------------------------------
 * NONE of the OTHER nodes carries a dG-type divergent-as-a -> 0 subtraction condition number. The dG
 * divergence (kappa ~ 4/a) was UNIQUE to the surplus-split RATIO diagnostic node M_G - 1, not the base
 * operator. The [F-prime] Jacobian node (1 - a) is O(1)-conditioned (kappa -> 1) exactly because it
 * subtracts a small a from 1; the Krawczyk-update node m - q is O(1) (kappa -> 1) because q -> 0 at the
 * fixed point; the g/F-prime enclosure is a division with no subtraction. The single genuinely
 * ill-conditioned subtraction in the base operator is the residual F(m) = m - g(m) at N_cross, but that is
 * the ALREADY-KNOWN, a-INDEPENDENT F(m) = 0 residual-at-root artifact (root-proximity at fixed a ~ 0.045),
 * which DE-conditions to kappa -> 1 as a -> 0 -- a fundamentally different mechanism from dG. So imp-35855
 * de-cancelled the ONLY a -> 0-divergent subtraction in the machine; no further node-level de-cancellation
 * of the dG kind is required.
 *
 * WHY THIS DOES NOT CLOSE imp-34714a (the honest sub-gap)
 * ------------------------------------------------------
 * This is a double-precision CONDITIONING catalogue of the operator nodes, a diagnostic surrogate for the
 * imp-34687a directed-rounding layer. It instantiates NO interval, ports NO certificate, and does NOT
 * discharge the F(m) = 0 residual-at-root artifact (it only classifies it as a-independent, not dG-type).
 * imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node; left F/[F-prime]/g audit open)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (the operator K(m)=m-[F-prime]^-1 F(m); F(m)=0 artifact; contraction gap)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-35810-cancellation-onset-height (the eps_mach/a departure envelope for the dG node)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35855)

// The shared imp-34774/imp-35855 Banach map g(N) = K log T0(N), residual F(N) = N - g(N), and the
// height-axis parameter a(N) = g-prime(N) = 2 pi K / (T0 u), u = log(T0/2pi) (identical to imp-35855 aOf).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// The unique double-precision fixed point N_cross (imp-34774/imp-34755): every seed flows here.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const A_AT_CROSS = aOf(N_CROSS); // ~0.045423 (= |g-prime(N_cross)|, the contraction rate)
const F_AT_CROSS = N_CROSS - g(N_CROSS); // exactly 0 in double precision: the F(m)=0 artifact

// Node condition numbers as functions of the height parameter a.
// NODE A ([F-prime] = 1 - a): subtracts a small a from 1 (NOT a near-1 quantity from 1).
const kappaFPrime = (a) => (1 + a) / Math.abs(1 - a); // -> 1 as a -> 0
// NODE B off-root (residual F = N - g(N)): the axis form; -> 1 as a -> 0 (g grows only logarithmically).
const kappaResidualAxis = (N) => {
  const gg = g(N);
  return (N + gg) / Math.abs(N - gg);
};
// CONTRAST -- the imp-35855 dG node (M_G - 1, M_G = 2G/(1+G), G = 1 - a): kappa ~ 4/a, DIVERGES.
const kappaDG = (a) => {
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  return (Math.abs(M_G) + 1) / Math.abs(M_G - 1);
};

// Sweep the height axis a -> 0 exactly as imp-35855 (N = 10^13 .. 10^21).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) {
  const N = Math.pow(10, L);
  const a = aOf(N);
  SWEEP.push({
    N,
    a,
    kappaFPrime: kappaFPrime(a), // NODE A
    kappaResidualAxis: kappaResidualAxis(N), // NODE B off-root
    kappaDG: kappaDG(a), // contrast (the de-cancelled node)
    gOverN: g(N) / N,
  });
}
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21, deepest a -> 0
const BOTTOM = SWEEP[0]; // N ~ 1e13

// Node A ([F-prime]) is bounded across the whole a -> 0 sweep and tends to 1.
const MAX_KAPPA_FPRIME = Math.max(...SWEEP.map((r) => r.kappaFPrime));
const FPRIME_TENDS_TO_ONE = TOP.kappaFPrime < BOTTOM.kappaFPrime && Math.abs(TOP.kappaFPrime - 1) < 1e-6;
// Node B (residual, off-root) is bounded and tends to 1 (DE-conditions as a -> 0).
const MAX_KAPPA_RESIDUAL = Math.max(...SWEEP.map((r) => r.kappaResidualAxis));
const RESIDUAL_TENDS_TO_ONE = TOP.kappaResidualAxis < BOTTOM.kappaResidualAxis && Math.abs(TOP.kappaResidualAxis - 1) < 1e-6;
// Contrast: the dG node DIVERGES up the same axis (reproduces imp-35855's ~4/a reading).
const DG_DIVERGES = TOP.kappaDG > BOTTOM.kappaDG && TOP.kappaDG > 1e6;

// At the certificate CENTRE (m = N_cross): F(m)=0 artifact, but [F-prime] and the update node are O(1).
const KAPPA_FPRIME_AT_CROSS = kappaFPrime(A_AT_CROSS); // ~1.095, bounded
const F_IS_ZERO_ARTIFACT = F_AT_CROSS === 0; // the known double-precision residual-at-root
const KAPPA_UPDATE_AT_CROSS = (Math.abs(N_CROSS) + 0) / Math.abs(N_CROSS - 0); // q = F/F-prime = 0 => m - 0 = m => 1

export const IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT = {
  id: 'imp-35885',
  proofSection: 'S-frontier',
  question:
    'imp-35855 de-cancelled ONE node (dG = S_inf(M_G-1), kappa_sub ~ 4/a divergent) of the OPEN imp-34714a ' +
    'Krawczyk certificate K(m) = m - [F-prime]^{-1} F(m) but left F(m), the [F-prime] Jacobian enclosure, ' +
    'and the g(m)/F-prime enclosures un-audited. Forming kappa_sub = (|x|+|y|)/|x-y| at every difference ' +
    'node, which OTHER nodes (if any) carry a kappa_sub that DIVERGES as a(N) -> 0 the way dG did, and ' +
    'which stay O(1)? Assessment/measurement only; instantiates no interval; ports no certificate; NO QED.',
  finding:
    'NONE of the other nodes carries a dG-type divergent-as-a->0 subtraction. NODE A the [F-prime] Jacobian ' +
    '(F-prime = 1 - g-prime = 1 - a) subtracts the SMALL a directly from 1, so kappa_A = (1+a)/(1-a) -> 1 ' +
    '(max over the sweep ~ ' +
    MAX_KAPPA_FPRIME.toFixed(6) +
    ', BOUNDED) -- the polar opposite of dG, which subtracts the near-1 M_G from 1. NODE B the residual ' +
    'F(m) = m - g(m) is EXACTLY 0 at the certificate centre m = N_cross (the ALREADY-KNOWN F(m)=0 ' +
    'residual-at-root artifact, a-INDEPENDENT root-proximity at fixed a ~ ' +
    A_AT_CROSS.toFixed(6) +
    '); moving off-root up the axis it DE-conditions, kappa_F_axis = (N+g)/|N-g| -> 1 (max ~ ' +
    MAX_KAPPA_RESIDUAL.toFixed(6) +
    ') because g = K log T0 grows only logarithmically (g/N ~ ' +
    BOTTOM.gOverN.toExponential(2) +
    ' at N~1e13 down to ~ ' +
    TOP.gOverN.toExponential(2) +
    ' at N~1e21) -- NOT a dG-type a->0 divergence. NODE C the g/F-prime enclosure is a DIVISION with no ' +
    'subtraction condition number (denominator 1 - a bounded away from 0 by the contraction gap). NODE D ' +
    'the Krawczyk update m - q has q = F/F-prime = 0 at the fixed point, so kappa_D = 1. CONTRAST: the ' +
    'de-cancelled dG node DIVERGES up the SAME axis, kappa_dG ~ 4/a from ~ ' +
    BOTTOM.kappaDG.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.kappaDG.toExponential(2) +
    ' at N~1e21. So imp-35855 de-cancelled the ONLY a->0-divergent subtraction; no further dG-type ' +
    'node-level de-cancellation is required. ASSESSMENT/SCOPING, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    a_at_N_cross: +A_AT_CROSS.toFixed(6),
    F_at_N_cross: F_AT_CROSS,
    machine_epsilon: Number.EPSILON,
  },
  nodeCatalogue: [
    { node: 'A: [F-prime] Jacobian = 1 - a', form: '(1+a)/(1-a)', limit_as_a_to_0: 1, diverges: false },
    { node: 'B: residual F(m) = m - g(m)', form: '0/0 at N_cross (F=0 artifact); (N+g)/|N-g| off-root', limit_as_a_to_0: 1, diverges: false },
    { node: 'C: g/F-prime quotient', form: 'DIVISION (no subtraction)', limit_as_a_to_0: null, diverges: false },
    { node: 'D: Krawczyk update m - q', form: '(|m|+|q|)/|m-q|, q=0 at fixed point', limit_as_a_to_0: 1, diverges: false },
    { node: 'dG (imp-35855, de-cancelled): S_inf(M_G-1)', form: '~4/a', limit_as_a_to_0: Infinity, diverges: true },
  ],
  metric: {
    kappa_FPrime_at_bottom: +BOTTOM.kappaFPrime.toExponential(4),
    kappa_FPrime_at_top: +TOP.kappaFPrime.toExponential(4),
    kappa_FPrime_max_over_sweep: +MAX_KAPPA_FPRIME.toExponential(4),
    kappa_residual_axis_at_bottom: +BOTTOM.kappaResidualAxis.toExponential(4),
    kappa_residual_axis_at_top: +TOP.kappaResidualAxis.toExponential(4),
    kappa_residual_axis_max_over_sweep: +MAX_KAPPA_RESIDUAL.toExponential(4),
    kappa_dG_at_bottom: +BOTTOM.kappaDG.toExponential(4),
    kappa_dG_at_top: +TOP.kappaDG.toExponential(4),
    kappa_FPrime_at_N_cross: +KAPPA_FPRIME_AT_CROSS.toFixed(6),
    kappa_update_at_N_cross: +KAPPA_UPDATE_AT_CROSS.toFixed(6),
    F_is_zero_artifact_at_N_cross: F_IS_ZERO_ARTIFACT,
    fprime_tends_to_one: FPRIME_TENDS_TO_ONE,
    residual_tends_to_one: RESIDUAL_TENDS_TO_ONE,
    dG_diverges: DG_DIVERGES,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision CONDITIONING catalogue of the operator nodes -- a ' +
    'diagnostic surrogate for the imp-34687a directed-rounding layer. It instantiates NO interval, ports NO ' +
    'certificate, and does NOT discharge the F(m) = 0 residual-at-root artifact; it only CLASSIFIES that ' +
    'artifact as a-independent (root-proximity at fixed a ~ 0.045), NOT of the dG a->0 kind. Establishing ' +
    'that the [F-prime], quotient, and update nodes are O(1)-conditioned is NECESSARY but not SUFFICIENT; ' +
    'the full K(m) operator over the imp-34687a layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK NODE-CANCELLATION AUDIT (assessment/scoping, NOT an RH bound). Auditing every difference node ' +
    'of K(m) = m - [F-prime]^{-1} F(m) for the dG-type near-equal subtraction imp-35855 left un-checked: ' +
    'NONE of the other nodes carries a divergent-as-a->0 subtraction condition number. The [F-prime] ' +
    'Jacobian node F-prime = 1 - a has kappa = (1+a)/(1-a) -> 1 (bounded, max ~ ' +
    MAX_KAPPA_FPRIME.toFixed(6) +
    ') because it subtracts a SMALL a from 1 (contrast dG, which subtracts the near-1 M_G from 1, giving ' +
    'kappa ~ 4/a, ~ ' +
    TOP.kappaDG.toExponential(2) +
    ' at N~1e21). The residual F(m) = m - g(m) is the ALREADY-KNOWN F(m)=0 artifact at N_cross ' +
    '(a-independent root-proximity at fixed a ~ ' +
    A_AT_CROSS.toFixed(6) +
    '); off-root it de-conditions to kappa -> 1. The g/F-prime enclosure is a DIVISION with no subtraction ' +
    'condition number, and the Krawczyk update m - q has q = 0 at the fixed point (kappa = 1). So imp-35855 ' +
    'de-cancelled the ONLY a->0-divergent subtraction in the machine; no further node-level de-cancellation ' +
    'of the dG kind is required. SUB-GAP imp-34714a REMAINS OPEN: a double-precision conditioning ' +
    'catalogue, NOT a machine certificate; no interval instantiated, the F(m)=0 artifact is classified not ' +
    'discharged, the imp-34687a layer is not ported. Reuses the imp-34774/imp-35855 machinery (identical ' +
    'K_AMPL, g, aOf, N_cross); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35855 (de-cancelled the dG node; left F/[F-prime]/g audit open); imp-34774 (the operator K(m), ' +
    'F(m)=0 artifact, contraction gap); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-34687 (directed-rounding layer; sub-gap imp-34687a); imp-35810 (eps_mach/a departure ' +
    'envelope for dG); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, RvM ' +
    'inverse). Subtraction condition number kappa = (|x|+|y|)/|x-y|: standard floating-point / interval ' +
    'analysis (Moore, Neumaier).',
};

export const IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT_ASSERTIONS = [
  {
    // NODE A: the [F-prime] Jacobian node (1 - a) is O(1)-conditioned and tends to 1 as a -> 0.
    id: 'imp35885-fprime-jacobian-node-is-O1',
    description: 'kappa_FPrime = (1+a)/(1-a) is bounded (<1.01) across the a->0 sweep and tends to 1',
    holds: () => MAX_KAPPA_FPRIME < 1.01 && FPRIME_TENDS_TO_ONE === true,
  },
  {
    // NODE B: the residual F(m) is the F(m)=0 artifact at N_cross; off-root it de-conditions to 1.
    id: 'imp35885-residual-node-is-a-independent-artifact',
    description: 'F(N_cross)=0 exactly (known artifact); off-root kappa_residual is bounded (<1.01) and -> 1 as a->0',
    holds: () => F_IS_ZERO_ARTIFACT === true && MAX_KAPPA_RESIDUAL < 1.01 && RESIDUAL_TENDS_TO_ONE === true,
  },
  {
    // CONTRAST: the de-cancelled dG node DOES diverge up the same axis, confirming it was the unique one.
    id: 'imp35885-dG-node-is-the-unique-divergent-one',
    description: 'kappa_dG ~ 4/a diverges up the same a->0 sweep (>1e6 at top, grows from bottom)',
    holds: () => DG_DIVERGES === true && TOP.kappaDG > 1e12,
  },
  {
    // At the certificate centre the [F-prime] and update nodes are O(1); only F(m)=0 is degenerate.
    id: 'imp35885-certificate-centre-nodes-bounded',
    description: 'at m=N_cross: kappa_FPrime ~1.095 and kappa_update = 1 (q=0), both bounded; F(m)=0 degenerate',
    holds: () =>
      Math.abs(KAPPA_FPRIME_AT_CROSS - 1.095) < 0.01 &&
      Math.abs(KAPPA_UPDATE_AT_CROSS - 1) < 1e-12 &&
      F_IS_ZERO_ARTIFACT === true,
  },
  {
    // Catalogue records exactly one divergent node (the de-cancelled dG); all base-operator nodes bounded.
    id: 'imp35885-catalogue-one-divergent-node',
    description: 'nodeCatalogue: exactly one entry diverges (dG); all base-operator nodes (A/B/C/D) do not',
    holds: () => {
      const cat = IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.nodeCatalogue;
      const diverging = cat.filter((n) => n.diverges === true);
      return diverging.length === 1 && /dG/.test(diverging[0].node);
    },
  },
  {
    // Honesty gate: assessment/scoping, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35885-honesty-gate-no-qed',
    description: 'assessment: isRigorous false, imp-34714a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.subGap) &&
      /NO QED/.test(IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT.verdict),
  },
];

for (const a of IMP35885_KRAWCZYK_NODE_CANCELLATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35885-krawczyk-node-cancellation-audit assertion failed: ${a.id}`);
  }
}

/**
 * @module imp-36154-krawczyk-existence-uniqueness-subgap-requirements
 *
 * imp-36154 (proof/scoping, S-frontier): ENUMERATE what the OPEN imp-34714a Krawczyk
 * existence/uniqueness sub-gap concretely requires in order to instantiate a CERTIFIED interval for the
 * residual node [F(m)] = [m] - [K log T0(m)]. imp-36136 scoped the directed-rounding LAYER for the
 * residual VALUE (the width side); THIS module scopes the OPERATOR side -- the existence/uniqueness
 * obligations (H1)-(H2) that turn a certified value into a certified UNIQUE fixed point -- grounded in
 * the imp-36066 finding that imp-34714a STAYS OPEN and the imp-34687a directed-rounding layer is
 * UNIMPLEMENTED.
 *
 * SCOPING / ASSESSMENT ONLY. Instantiates no interval; ports nothing; evaluates no certified residual;
 * constructs no derivative enclosure; certifies no self-map; closes no sub-gap; imp-34687a stays
 * UNIMPLEMENTED; imp-34714a stays OPEN. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/2643) and C_mb
 * GUE-conditional (imp-486) untouched; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * THE RESIDUAL NODE AS A FIXED-POINT OPERATOR
 * -----------------------------------------------------------------------------
 * F(m) = m - K log T0(m), K = (C_C / E_trunc)^2 ~ 1.5727e8, T0(m) = effectiveHeightForN(m) the
 * Riemann-von Mangoldt height inverse. The certificate centre m = N_cross ~ 3.28e9 is the fixed point:
 * K log T0(N_cross) = N_cross, so F(N_cross) = 0 (the F(m) = 0 residual-at-root artifact). The exact
 * derivative is
 *      F-prime(m) = 1 - K (d/dm) log T0(m) = 1 - K * (2 pi) / ( T0(m) log(T0(m) / 2 pi) ),
 * using T0-prime(m) = 1 / count-prime(T0) = 2 pi / log(T0/2 pi) for the RvM count. At m = N_cross this is
 * ~0.954 in double precision -- comfortably away from 0, so the (H1) NONVANISHING hypothesis holds with a
 * LARGE margin (existence/uniqueness is NOT obstructed by any near-degeneracy of the residual node).
 *
 * imp-34714 (the existence/uniqueness lemma) is stated for the RvM count f(T); its (H1)-(H2) template
 * transfers verbatim to the residual operator F(m), with T0-solving playing the role of an inner
 * certified evaluation. The imp-34714a sub-gap is the MACHINE instantiation of that template: certifying,
 * with directed rounding, the value and derivative enclosures that (H1)-(H2) consume.
 *
 * REQUIREMENTS (R1-R6): what a certified UNIQUE-fixed-point enclosure for [F(m)] concretely needs
 * -----------------------------------------------------------------------------
 * R1  CERTIFIED RESIDUAL VALUE [F(m)]. The imp-36136 three-op op-DAG (op1 L = log T0, op2 G = K L, op3
 *     F = m - G) over certified inputs, outward-rounded. This is the OPERATOR NUMERATOR. SCOPED by
 *     imp-36136 (structure AVAILABLE), but the directed-rounding layer under it is UNIMPLEMENTED.
 * R2  CERTIFIED DERIVATIVE ENCLOSURE [F-prime(m)]. F-prime(m) = 1 - K * 2 pi / ( T0 log(T0/2 pi) ) needs a
 *     certified [T0] (from the imp-34687/imp-34714 RvM interval-Newton contraction), a certified
 *     [log(T0/2 pi)], and directed multiply/divide/subtract. This enclosure has NEVER been constructed --
 *     imp-36136 named it as the C6 operator input but built no [F-prime]. GREENFIELD arithmetic sitting
 *     on the same missing directed-rounding layer as R1.
 * R3  (H1) NONVANISHING-DERIVATIVE TEST: certify 0 not in [F-prime(m)] over the bracket [m]. The exact
 *     value F-prime(N_cross) ~ 0.954 sits far from 0, so (H1) holds with a large margin; the requirement
 *     is to certify that the enclosed [F-prime] EXCLUDES 0 (needs R2). Uniqueness follows from the
 *     imp-34714 lemma once (H1) is certified.
 * R4  (H2) STRICT SELF-MAP INCLUSION: certify the Krawczyk image
 *          K([m]) = mid - Y [F(mid)] + (1 - Y [F-prime]) ([m] - mid),   Y = 1 / F-prime(mid),
 *     (equivalently the interval-Newton image N([m]) = mid - [F(mid)] / [F-prime]) satisfies
 *     K([m]) subset int([m]). Consumes R1 (value) and R2 (derivative) as certified inputs. The EXACT
 *     real-analysis implication (H1)+(H2) => a unique fixed point enclosed by K([m]) is the imp-34714
 *     lemma content -- AVAILABLE; only the machine inclusion test is missing.
 * R5  DIRECTED-ROUNDING ARITHMETIC LAYER (imp-34687a). The shared UNIMPLEMENTED primitive: every op in
 *     R1-R4 must be outward-rounded so the computed floats provably ENCLOSE the exact reals. Stock JS Math
 *     has no directed-rounding mode and Math.log carries no proven ULP bound (imp-36136 C1). The imp-35969
 *     nextafter surrogate is a ~2x-conservative stand-in (imp-36017), NOT a certificate.
 * R6  CERTIFIED SEED BRACKET + CONCLUSION ASSEMBLY. An a-priori bracket [m] straddling N_cross with a
 *     certified sign witness (F(m_lo) < 0 < F(m_hi)), plus the final assembly
 *     "(H1) + (H2) => unique fixed point in [m], enclosed by N([m])" invoking the imp-34714 lemma. The
 *     lemma STATEMENT is AVAILABLE; the machine assembly waits on R1-R5.
 *
 * GREENFIELD vs AVAILABLE
 * -----------------------------------------------------------------------------
 * AVAILABLE (no open math): the imp-34714 EXACT existence/uniqueness lemma ((H1)+(H2) => unique root,
 * enclosure, contraction rho ~ delta/U); the imp-36136 residual-VALUE op-DAG [F(m)] structure (R1); the
 * nextafter surrogate primitive (2x-conservative, not a certificate); the imp-34687/imp-34714 RvM
 * interval-Newton contraction supplying [T0].
 * GREENFIELD (not built): the certified DERIVATIVE enclosure [F-prime(m)] (R2 -- never constructed); a
 * correctly-rounded / provably-outward transcendental log + a machine directed-rounding mode (R5,
 * imp-34687a); the assembled machine (H1)-(H2) self-map test wiring R1 + R2 through the Krawczyk operator
 * (R3, R4, R6).
 *
 * READING: a certified residual VALUE [F(m)] (imp-36136, R1) is only the operator numerator -- NECESSARY
 * but NOT SUFFICIENT. The imp-34714a existence/uniqueness certificate additionally requires a certified
 * DERIVATIVE enclosure [F-prime(m)] (R2, un-built) and the machine (H1)-(H2) self-map test (R3, R4). The
 * (H1) margin is large (F-prime ~ 0.954 far from 0), so existence/uniqueness is not obstructed by any
 * near-degeneracy; the whole obstruction is the UNIMPLEMENTED directed-rounding layer (R5) plus the
 * un-built [F-prime] (R2). This module NAMES those requirements; it instantiates no interval and ports
 * nothing.
 *
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (imp-34714a STAYS OPEN; imp-34687a layer UNIMPLEMENTED)
 * @see imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope (the residual-VALUE width side; C6 named the operator interface this module expands)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact (H1)-(H2) lemma; sub-gap imp-34714a = the machine instantiation)
 * @see imp-34687-crossover-interval-arithmetic-scope (RvM interval-Newton enclosure supplying [T0]; sub-gap imp-34687a directed-rounding layer)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (nextafter SURROGATE; ~2x-conservative stand-in, not a certificate)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (surrogate over-estimates the layer 2x, a-independent)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see Moore/Krawczyk/Neumaier interval-Newton existence-uniqueness; IEEE-754 directed rounding
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// -- Anchor + operative constants (import-light; matching imp-36136 / imp-34714) --------------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // ~0.3837 ansatz (coefficient 1/8, imp-2642/2643/2714)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35969/imp-36136)
const N_CROSS = 3.28029435165241e9; // certificate centre, the F(m)=0 fixed point (imp-34774/imp-36136)

// Exact derivative of the residual node at the centre (double-precision illustration of (H1)).
// F-prime(m) = 1 - K (d/dm) log T0(m), with (d/dm) log T0 = 2 pi / ( T0 log(T0/2 pi) ).
const T0_AT_CENTER = effectiveHeightForN(N_CROSS); // RvM height inverse at m = N_cross
const DLOG_T0_DM = TWO_PI / (T0_AT_CENTER * Math.log(T0_AT_CENTER / TWO_PI));
const FP_AT_CENTER = 1 - K_AMPL * DLOG_T0_DM; // ~0.954: (H1) 0 not in [F-prime] holds with a large margin

// Six requirements the imp-34714a existence/uniqueness certificate imposes on the residual node.
const REQUIREMENT_COUNT = 6; // R1 value; R2 derivative; R3 (H1); R4 (H2); R5 directed-rounding layer; R6 seed+assembly

export const IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS = {
  id: 'imp-36154',
  proofSection: 'S-frontier',
  question:
    'Enumerate what the OPEN imp-34714a Krawczyk existence/uniqueness sub-gap concretely requires to ' +
    'instantiate a certified interval for the residual node [F(m)] = [m] - [K log T0(m)], grounded in the ' +
    'imp-36066 finding that imp-34714a STAYS OPEN and the imp-34687a directed-rounding layer is ' +
    'UNIMPLEMENTED. Complements imp-36136 (residual-VALUE width side) by scoping the OPERATOR side -- the ' +
    '(H1)-(H2) existence/uniqueness obligations. Scoping only; instantiates no interval; closes no ' +
    'sub-gap; NO QED.',
  operatorAnchor: {
    center: N_CROSS,
    K_amplification: K_AMPL,
    fPrimeAtCenter: FP_AT_CENTER,
    h1MarginNote:
      'F(m) = m - K log T0(m) has F(N_cross) = 0 (fixed point) and exact derivative F-prime(m) = 1 - K * ' +
      '2 pi / ( T0 log(T0/2 pi) ) ~ 0.954 at the centre -- comfortably away from 0, so (H1) 0 not in ' +
      '[F-prime] holds with a LARGE margin; existence/uniqueness is NOT obstructed by any near-degeneracy',
    lemmaTransfer:
      'the imp-34714 (H1)-(H2) lemma (stated for the RvM count f(T)) transfers verbatim to the residual ' +
      'operator F(m); imp-34714a is the MACHINE instantiation of that template for [F(m)]',
  },
  requirements: {
    R1_certifiedResidualValue:
      'certified residual VALUE [F(m)] from the imp-36136 three-op op-DAG (log, multiply, subtract), ' +
      'outward-rounded -- the OPERATOR NUMERATOR. SCOPED by imp-36136 (structure AVAILABLE); the ' +
      'directed-rounding layer under it is UNIMPLEMENTED',
    R2_certifiedDerivativeEnclosure:
      'certified DERIVATIVE enclosure [F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) ): needs certified ' +
      '[T0] (imp-34687/imp-34714 RvM interval-Newton), [log(T0/2 pi)], and directed multiply/divide/subtract. ' +
      'NEVER constructed -- imp-36136 named it as the C6 input but built no [F-prime]. GREENFIELD',
    R3_h1NonvanishingDerivativeTest:
      'certify (H1): 0 not in [F-prime(m)] over the bracket [m]. Exact F-prime(N_cross) ~ 0.954 far from 0, ' +
      'so (H1) holds with a large margin; requirement is to certify [F-prime] EXCLUDES 0 (needs R2). ' +
      'Uniqueness then follows from the imp-34714 lemma (strict monotonicity)',
    R4_h2StrictSelfMapInclusion:
      'certify (H2): the Krawczyk image K([m]) = mid - Y[F(mid)] + (1 - Y[F-prime])([m]-mid), Y = ' +
      '1/F-prime(mid) (equivalently N([m]) = mid - [F(mid)]/[F-prime]) satisfies K([m]) subset int([m]). ' +
      'Consumes R1 (value) and R2 (derivative). The EXACT (H1)+(H2) => unique enclosed fixed point is the ' +
      'imp-34714 lemma content -- AVAILABLE; only the machine inclusion test is missing',
    R5_directedRoundingArithmeticLayer:
      'the imp-34687a directed-rounding LAYER: every op in R1-R4 outward-rounded so the computed floats ' +
      'provably ENCLOSE the exact reals. Stock JS Math has no directed-rounding mode and Math.log no proven ' +
      'ULP bound; the imp-35969 nextafter surrogate is a ~2x-conservative stand-in, NOT a certificate. ' +
      'UNIMPLEMENTED (shared with R1)',
    R6_certifiedSeedBracketAndAssembly:
      'an a-priori bracket [m] straddling N_cross with a certified sign witness (F(m_lo) < 0 < F(m_hi)), ' +
      'plus the final assembly "(H1)+(H2) => unique fixed point in [m], enclosed by N([m])" invoking the ' +
      'imp-34714 lemma. Lemma STATEMENT AVAILABLE; machine assembly waits on R1-R5',
  },
  greenfieldVsAvailable: {
    available: [
      'imp-34714 EXACT existence/uniqueness lemma ((H1)+(H2) => unique root, enclosure, contraction rho ~ delta/U)',
      'imp-36136 residual-VALUE op-DAG [F(m)] structure (R1)',
      'nextafter surrogate primitive (2x-conservative, NOT a certificate)',
      'imp-34687/imp-34714 RvM interval-Newton contraction supplying [T0]',
    ],
    greenfield: [
      'certified DERIVATIVE enclosure [F-prime(m)] (R2 -- never constructed)',
      'correctly-rounded / provably-outward transcendental log + a machine directed-rounding mode (R5, imp-34687a)',
      'assembled machine (H1)-(H2) self-map test wiring R1 + R2 through the Krawczyk operator (R3, R4, R6)',
    ],
  },
  conclusion: {
    necessaryNotSufficient:
      'a certified residual VALUE [F(m)] (imp-36136, R1) is only the operator NUMERATOR -- NECESSARY but ' +
      'NOT SUFFICIENT; imp-34714a additionally requires the certified DERIVATIVE [F-prime] (R2, un-built) ' +
      'and the machine (H1)-(H2) self-map test (R3, R4)',
    obstructionIsLayerAndDerivative:
      'the (H1) margin is large (F-prime ~ 0.954 far from 0), so existence/uniqueness is not obstructed by ' +
      'any near-degeneracy; the whole obstruction is the UNIMPLEMENTED directed-rounding layer (R5) plus ' +
      'the un-built certified derivative enclosure (R2) -- NOT the operator math',
    staysUnimplementedAndOpen:
      'this module scopes the requirements; it instantiates no interval and ports nothing, so imp-34687a ' +
      'stays UNIMPLEMENTED and imp-34714a stays OPEN',
  },
  isRigorous: false,
  verdict:
    'KRAWCZYK EXISTENCE/UNIQUENESS SUB-GAP (imp-34714a), REQUIREMENTS ENUMERATED (frontier, NOT rigorous). ' +
    'imp-36066 records that imp-34714a STAYS OPEN and the imp-34687a directed-rounding layer is ' +
    'UNIMPLEMENTED. The residual node F(m) = m - K log T0(m) is a fixed-point operator with F(N_cross) = 0 ' +
    'and exact derivative F-prime(m) = 1 - K * 2 pi / ( T0 log(T0/2 pi) ) ~ 0.954 at the centre, so the (H1) ' +
    'nonvanishing hypothesis holds with a LARGE margin. Certifying a UNIQUE-fixed-point enclosure for [F(m)] ' +
    'requires: R1 certified residual VALUE (the imp-36136 op-DAG; structure AVAILABLE, layer ' +
    'UNIMPLEMENTED), R2 certified DERIVATIVE enclosure [F-prime] (never built; GREENFIELD), R3 the (H1) 0 ' +
    'not in [F-prime] test, R4 the (H2) strict self-map inclusion K([m]) subset int([m]) consuming R1+R2, ' +
    'R5 the imp-34687a directed-rounding arithmetic layer under all of R1-R4 (UNIMPLEMENTED; nextafter ' +
    'surrogate is a 2x-conservative non-certificate), and R6 a certified seed bracket + the (H1)+(H2) => ' +
    'unique-enclosed-root assembly via the imp-34714 lemma. NECESSARY-BUT-NOT-SUFFICIENT: the imp-36136 ' +
    'certified value is only the operator numerator; imp-34714a additionally needs the un-built [F-prime] ' +
    '(R2) and the machine (H1)-(H2) test. The obstruction is the directed-rounding layer (R5) plus the ' +
    'un-built derivative enclosure (R2), NOT the operator math. SCOPING / ASSESSMENT ONLY: instantiates no ' +
    'interval; ports nothing; constructs no derivative enclosure; certifies no self-map; closes no sub-gap; ' +
    'imp-34687a stays UNIMPLEMENTED; imp-34714a stays OPEN. C_C = 1/8 (imp-2642/2643) and C_mb ' +
    'GUE-conditional (imp-486) untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36066 (imp-34714a STAYS OPEN; imp-34687a layer UNIMPLEMENTED); imp-36136 (residual-VALUE ' +
    'directed-rounding layer construction; C6 operator interface expanded here); imp-34714 (exact ' +
    '(H1)-(H2) existence/uniqueness lemma; sub-gap imp-34714a = machine instantiation); imp-34687 (RvM ' +
    'interval-Newton enclosure supplying [T0]; sub-gap imp-34687a directed-rounding layer); imp-35969 ' +
    '(nextafter surrogate, 2x-conservative non-certificate); imp-36017 (surrogate over-estimates layer 2x); ' +
    'imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN). Moore/Krawczyk/Neumaier ' +
    'interval-Newton existence-uniqueness; IEEE-754 directed rounding; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS_ASSERTIONS = [
  {
    // The residual node is the fixed-point operator with K ~ 1.5727e8, centred at N_cross, F-prime > 0 there.
    id: 'imp36154-operator-anchor-and-h1-margin',
    description: 'F(m)=m-K log T0(m): K=(C_C_pinned/E_trunc)^2 ~ 1.5727e8, centre N_cross ~ 3.28e9, F-prime(N_cross) in (0,1) so (H1) holds with margin',
    holds: () =>
      Math.abs(K_AMPL - ((1 / 8) * Math.sqrt(3 * Math.PI) / 3.06e-5) ** 2) < 1 &&
      K_AMPL > 1.57e8 && K_AMPL < 1.58e8 &&
      N_CROSS > 3.2e9 && N_CROSS < 3.3e9 &&
      FP_AT_CENTER > 0 && FP_AT_CENTER < 1,
  },
  {
    // Six requirements R1-R6 are enumerated, each naming a concrete obligation.
    id: 'imp36154-six-requirements',
    description: 'R1-R6 enumerated: value, derivative, (H1) test, (H2) self-map, directed-rounding layer, seed+assembly',
    holds: () => {
      const r = IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.requirements;
      return Object.keys(r).length === REQUIREMENT_COUNT &&
        /NUMERATOR/.test(r.R1_certifiedResidualValue) &&
        /GREENFIELD/.test(r.R2_certifiedDerivativeEnclosure) &&
        /0 not in \[F-prime\(m\)\]/.test(r.R3_h1NonvanishingDerivativeTest) &&
        /subset int\(\[m\]\)/.test(r.R4_h2StrictSelfMapInclusion) &&
        /UNIMPLEMENTED/.test(r.R5_directedRoundingArithmeticLayer) &&
        /imp-34714 lemma/.test(r.R6_certifiedSeedBracketAndAssembly);
    },
  },
  {
    // The greenfield/available partition is populated and places the un-built [F-prime] enclosure in greenfield.
    id: 'imp36154-greenfield-vs-available-partition',
    description: 'both lists non-empty; certified [F-prime] enclosure is GREENFIELD; imp-34714 exact lemma AVAILABLE',
    holds: () => {
      const g = IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.greenfieldVsAvailable;
      return Array.isArray(g.available) && Array.isArray(g.greenfield) &&
        g.available.length >= 4 && g.greenfield.length >= 3 &&
        g.greenfield.some((x) => /DERIVATIVE enclosure \[F-prime\(m\)\]/.test(x)) &&
        g.available.some((x) => /imp-34714 EXACT existence\/uniqueness lemma/.test(x));
    },
  },
  {
    // The necessary-but-not-sufficient conclusion is recorded: certified value alone does not close imp-34714a.
    id: 'imp36154-necessary-not-sufficient',
    description: 'conclusion records the imp-36136 certified value is NECESSARY but NOT SUFFICIENT for imp-34714a',
    holds: () =>
      /NECESSARY but[\s\S]*NOT SUFFICIENT/.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.conclusion.necessaryNotSufficient) &&
      /R2/.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.conclusion.necessaryNotSufficient),
  },
  {
    // Honesty gate: scoping only; layer unimplemented; imp-34714a open; no QED; no refereed bound is changed.
    id: 'imp36154-honesty-gate-no-qed',
    description: 'scoping only; imp-34687a UNIMPLEMENTED; imp-34714a OPEN; no QED; no refereed bound is changed',
    holds: () =>
      IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /UNIMPLEMENTED/.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.conclusion.staysUnimplementedAndOpen) &&
      /imp-34714a stays OPEN/.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.conclusion.staysUnimplementedAndOpen) &&
      /NO QED/.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS.verdict),
  },
];

for (const a of IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36154-krawczyk-existence-uniqueness-subgap-requirements assertion failed: ${a.id}`);
  }
}

export default IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS;

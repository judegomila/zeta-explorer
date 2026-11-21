/**
 * @module imp-36219-krawczyk-derivative-enclosure-r2-discharge-scope
 *
 * imp-36219 (proof/scoping, S-frontier): ASSESS whether a certified interval enclosure [F-prime] at
 * N_cross would DISCHARGE the imp-36154 Krawczyk existence/uniqueness sub-gap requirement R2 (the
 * un-built certified DERIVATIVE enclosure), given the imp-36154 finding that the (H1) nonvanishing
 * hypothesis holds with a LARGE margin (F-prime(N_cross) ~ 0.9546), and MAP how R2 composes with the
 * still-UNIMPLEMENTED R5 directed-rounding layer (imp-34687a). The narrow question imp-36154 left
 * dangling: does the 0.9546 margin leave enough slack that even a COARSE [F-prime] enclosure discharges
 * R2, or is R2 precision-limited?
 *
 * SCOPING / ASSESSMENT ONLY. Instantiates no interval; constructs no derivative enclosure; certifies no
 * self-map; closes no sub-gap; imp-34687a stays UNIMPLEMENTED; imp-34714a stays OPEN. C_C = 1/8 ansatz
 * (imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE DERIVATIVE ENCLOSURE R2 HAS A DUAL ROLE
 * -----------------------------------------------------------------------------
 * imp-36154 named R2 (a certified [F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) )) as the un-built
 * GREENFIELD enclosure that R3 (the (H1) test) and R4 (the (H2) Krawczyk self-map inclusion) both
 * consume. A [F-prime] enclosure written as centre +/- r (r = certified half-width) feeds two obligations:
 *
 *   (a) R3 / (H1) NONVANISHING: certify 0 not in [F-prime]. With centre F-prime(mid) ~ 0.9546 > 0, the
 *       enclosure excludes 0 iff r < F-prime(mid). So the (H1) radius budget is r < ~0.9546.
 *   (b) R4 / (H2) CONTRACTION: the Krawczyk factor is |1 - Y [F-prime]| with the natural preconditioner
 *       Y = 1 / F-prime(mid). Writing [F-prime] = F-prime(mid) +/- r gives 1 - Y [F-prime] = -/+ r /
 *       F-prime(mid), so the derivative-side contraction magnitude is EXACTLY r / F-prime(mid). The
 *       Krawczyk map contracts (necessary for the strict self-map inclusion) iff r / F-prime(mid) < 1,
 *       i.e. iff r < F-prime(mid) ~ 0.9546 -- the SAME threshold as (a).
 *
 * So BOTH derivative-side obligations impose the single budget r < F-prime(mid) ~ 0.9546. (The strict
 * self-map inclusion K([m]) subset int([m]) additionally carries the value-side term |Y| * rad([F(mid)])
 * from R1, which shrinks the usable derivative budget by a second-order amount; the DOMINANT derivative
 * constraint is the r / F-prime(mid) < 1 contraction, budget ~0.9546.)
 *
 * DOES 0.9546 LEAVE SLACK FOR A COARSE ENCLOSURE? YES -- ENORMOUS.
 * -----------------------------------------------------------------------------
 * A certified [F-prime] radius of r < 0.9546 is astronomically loose compared with any achievable
 * enclosure. The exact node F-prime(m) = 1 - K * 2 pi / ( T0 log(T0/2 pi) ) is a handful of elementary
 * ops over [T0] (whose RvM interval-Newton enclosure is tight to ~1e-8 relative) and a log; the imp-35969
 * nextafter SURROGATE -- itself ~2x-conservative over the true directed-rounding layer (imp-36017) --
 * still returns a half-width many orders of magnitude below 0.9546. Concretely, a coarse enclosure with
 * r = 0.5 gives a contraction magnitude 0.5 / 0.9546 ~ 0.524 < 1 and excludes 0 with room to spare;
 * realistic enclosures sit near r ~ 1e-8, contraction ~1e-8. R2 is therefore TOLERANCE-GENEROUS, NOT
 * precision-limited: the (H1) margin means the derivative enclosure need only be CORRECT, not TIGHT.
 *
 * BUT THE SLACK IS A TIGHTNESS MARGIN, NOT A SOUNDNESS MARGIN -- R5 STILL BINDS
 * -----------------------------------------------------------------------------
 * The 0.9546 slack removes any PRECISION obstruction to R2. It removes NO SOUNDNESS obstruction. Claiming
 * "0 not in [F-prime]" and "r / F-prime(mid) < 1" both presuppose that [F-prime] is a CERTIFIED OUTWARD
 * enclosure of the exact real derivative -- i.e. every op (the [T0] solve, log, multiply, divide,
 * subtract) is outward-rounded so the computed float interval provably CONTAINS the exact value. A coarse
 * enclosure that is not provably outward proves nothing about the exact F-prime, no matter how wide. That
 * provable-outward property is exactly the UNIMPLEMENTED R5 directed-rounding layer (imp-34687a): stock JS
 * Math has no directed-rounding mode and Math.log carries no proven ULP bound (imp-36136 C1), and the
 * nextafter surrogate is a stand-in, not a certificate. Hence R2 DISCHARGE IS CONDITIONAL ON R5 regardless
 * of how generous the (H1) tolerance is -- the margin buys tightness headroom, never soundness headroom.
 *
 * READING: an interval enclosure [F-prime] at N_cross WOULD discharge R2 -- and thereby R3 (the (H1) 0
 * not in [F-prime] test) and the R4 Krawczyk contraction factor -- with orders of magnitude of slack,
 * because the (H1) margin sets a radius budget r < ~0.9546 that dwarfs any achievable certified
 * half-width. R2 is therefore NOT the binding constraint on imp-34714a; the (H1) margin makes the
 * derivative enclosure tolerance-easy. The single residual binding dependency is R5 -- a coarse [F-prime]
 * must still be provably outward-rounded -- which stays UNIMPLEMENTED (imp-34687a). This module NAMES that
 * composition; it instantiates no interval and ports nothing.
 *
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements (R1-R6; R2 un-built derivative; R5 layer; (H1) margin ~0.9546)
 * @see imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope (residual-VALUE op-DAG R1; C6 operator interface)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (exact (H1)-(H2) lemma; sub-gap imp-34714a machine instantiation)
 * @see imp-34687-crossover-interval-arithmetic-scope (RvM interval-Newton enclosure supplying [T0]; sub-gap imp-34687a directed-rounding layer)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (nextafter SURROGATE; ~2x-conservative stand-in, not a certificate)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (surrogate over-estimates the layer 2x, a-independent)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see Moore/Krawczyk/Neumaier interval-Newton existence-uniqueness; IEEE-754 directed rounding
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// -- Anchor + operative constants (import-light; matching imp-36154 / imp-36136) --------------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // ~0.3837 ansatz (coefficient 1/8, imp-2642/2643/2714)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35969/imp-36136/imp-36154)
const N_CROSS = 3.28029435165241e9; // certificate centre, the F(m)=0 fixed point (imp-34774/imp-36136/imp-36154)

// Exact derivative at the centre: F-prime(m) = 1 - K * 2 pi / ( T0 log(T0/2 pi) ), the (H1) centre value.
const T0_AT_CENTER = effectiveHeightForN(N_CROSS);
const DLOG_T0_DM = TWO_PI / (T0_AT_CENTER * Math.log(T0_AT_CENTER / TWO_PI));
const FP_AT_CENTER = 1 - K_AMPL * DLOG_T0_DM; // ~0.9546

// The single derivative-side radius budget shared by (H1) and the Krawczyk contraction factor.
// (H1): 0 not in centre +/- r  <=>  r < F-prime(mid).  Contraction: |1 - (1/F-prime(mid)) [F-prime]| =
// r / F-prime(mid) < 1  <=>  r < F-prime(mid).  Both reduce to r < FP_AT_CENTER.
const R2_RADIUS_BUDGET = FP_AT_CENTER; // ~0.9546
// Illustrative coarse enclosure: half-width 0.5 still contracts and excludes 0 comfortably.
const COARSE_R = 0.5;
const COARSE_CONTRACTION = COARSE_R / FP_AT_CENTER; // ~0.524 < 1

export const IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE = {
  id: 'imp-36219',
  proofSection: 'S-frontier',
  question:
    'Assess whether a certified interval enclosure [F-prime] at N_cross would DISCHARGE the imp-36154 ' +
    'Krawczyk existence/uniqueness requirement R2 (un-built certified derivative enclosure), given the ' +
    '(H1) nonvanishing hypothesis holds with a LARGE margin (F-prime(N_cross) ~ 0.9546), and map how R2 ' +
    'composes with the UNIMPLEMENTED R5 directed-rounding layer. Scoping only; instantiates no interval; ' +
    'closes no sub-gap; NO QED.',
  operatorAnchor: {
    center: N_CROSS,
    K_amplification: K_AMPL,
    fPrimeAtCenter: FP_AT_CENTER,
    r2RadiusBudget: R2_RADIUS_BUDGET,
    coarseExampleRadius: COARSE_R,
    coarseExampleContraction: COARSE_CONTRACTION,
  },
  dualRoleOfR2: {
    h1NonvanishingBudget:
      'R3 / (H1): certify 0 not in [F-prime] = F-prime(mid) +/- r. With F-prime(mid) ~ 0.9546 > 0 the ' +
      'enclosure excludes 0 iff r < F-prime(mid), so the (H1) radius budget is r < ~0.9546',
    h2ContractionBudget:
      'R4 / (H2): the Krawczyk contraction factor with preconditioner Y = 1/F-prime(mid) is ' +
      '|1 - Y [F-prime]| = r / F-prime(mid); the map contracts iff r / F-prime(mid) < 1, i.e. iff ' +
      'r < F-prime(mid) ~ 0.9546 -- the SAME threshold as (H1)',
    sharedBudgetNote:
      'both derivative-side obligations reduce to the single budget r < F-prime(mid) ~ 0.9546; the strict ' +
      'self-map inclusion additionally carries the value-side |Y| * rad([F(mid)]) term from R1, a ' +
      'second-order shrink of the usable derivative budget, dominant derivative constraint remains r < ~0.9546',
  },
  coarseEnclosureDischargesR2:
    'YES with enormous slack: a certified [F-prime] radius r < 0.9546 is astronomically loose next to any ' +
    'achievable enclosure -- the exact node is a handful of elementary ops over a [T0] tight to ~1e-8 ' +
    'relative, and even the ~2x-conservative imp-35969 nextafter surrogate returns a half-width many ' +
    'orders below 0.9546 (a coarse r = 0.5 gives contraction 0.5/0.9546 ~ 0.524 < 1 and excludes 0). R2 ' +
    'is TOLERANCE-GENEROUS, NOT precision-limited: the (H1) margin means [F-prime] need only be CORRECT, ' +
    'not TIGHT',
  r5StillBinds:
    'the 0.9546 slack is a TIGHTNESS margin, NOT a SOUNDNESS margin. "0 not in [F-prime]" and ' +
    '"r/F-prime(mid) < 1" both presuppose [F-prime] is a CERTIFIED OUTWARD enclosure -- every op ([T0] ' +
    'solve, log, multiply, divide, subtract) outward-rounded so the interval provably CONTAINS the exact ' +
    'derivative. A coarse enclosure that is not provably outward proves nothing, no matter how wide. That ' +
    'provable-outward property is exactly the UNIMPLEMENTED R5 directed-rounding layer (imp-34687a; stock ' +
    'JS Math has no directed-rounding mode, Math.log no proven ULP bound). R2 discharge is CONDITIONAL ON ' +
    'R5 regardless of the (H1) tolerance -- the margin buys tightness headroom, never soundness headroom',
  conclusion: {
    r2NotBinding:
      'an interval [F-prime] at N_cross WOULD discharge R2 (and thereby R3 and the R4 contraction factor) ' +
      'with orders of magnitude of slack; R2 is NOT the binding constraint on imp-34714a -- the (H1) ' +
      'margin makes the derivative enclosure tolerance-easy',
    residualDependencyIsR5:
      'the single residual binding dependency is R5: a coarse [F-prime] must still be provably ' +
      'outward-rounded, and that directed-rounding layer (imp-34687a) stays UNIMPLEMENTED',
    staysUnimplementedAndOpen:
      'this module maps the R2/R5 composition; it instantiates no interval and ports nothing, so ' +
      'imp-34687a stays UNIMPLEMENTED and imp-34714a stays OPEN',
  },
  isRigorous: false,
  verdict:
    'KRAWCZYK DERIVATIVE-ENCLOSURE R2 DISCHARGE, ASSESSED (frontier, NOT rigorous). The imp-36154 R2 (an ' +
    'un-built certified [F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) )) feeds BOTH R3 (the (H1) 0 ' +
    'not in [F-prime] test) and R4 (the (H2) Krawczyk self-map). Written as F-prime(mid) +/- r with ' +
    'F-prime(mid) ~ 0.9546 > 0, (H1) excludes 0 iff r < F-prime(mid), and the Krawczyk contraction factor ' +
    'with Y = 1/F-prime(mid) is exactly r / F-prime(mid) < 1 iff r < F-prime(mid) -- the SAME budget ' +
    'r < ~0.9546. That budget is astronomically loose: any achievable enclosure (even the ~2x-conservative ' +
    'nextafter surrogate over a [T0] tight to ~1e-8) has half-width orders below 0.9546, so a COARSE ' +
    '[F-prime] discharges R2 with enormous slack -- R2 is TOLERANCE-GENEROUS, NOT precision-limited, and ' +
    'NOT the binding constraint on imp-34714a. BUT the slack is a TIGHTNESS margin, not a SOUNDNESS ' +
    'margin: both obligations presuppose [F-prime] is a CERTIFIED OUTWARD enclosure, which is exactly the ' +
    'UNIMPLEMENTED R5 directed-rounding layer (imp-34687a). Hence R2 discharge is CONDITIONAL ON R5 ' +
    'regardless of the (H1) margin; the residual binding dependency is R5, unchanged. SCOPING / ' +
    'ASSESSMENT ONLY: instantiates no interval; constructs no derivative enclosure; certifies no ' +
    'self-map; closes no sub-gap; imp-34687a stays UNIMPLEMENTED; imp-34714a stays OPEN. C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound; no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-36154 (R1-R6 existence/uniqueness requirements; R2 un-built derivative; R5 UNIMPLEMENTED layer; ' +
    '(H1) margin F-prime ~ 0.9546); imp-36136 (residual-VALUE op-DAG R1; C6 operator interface); imp-34714 ' +
    '(exact (H1)-(H2) existence/uniqueness lemma; sub-gap imp-34714a = machine instantiation); imp-34687 ' +
    '(RvM interval-Newton enclosure supplying [T0]; sub-gap imp-34687a directed-rounding layer); imp-35969 ' +
    '(nextafter surrogate, 2x-conservative non-certificate); imp-36017 (surrogate over-estimates layer 2x); ' +
    'imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN). Moore/Krawczyk/Neumaier ' +
    'interval-Newton existence-uniqueness; IEEE-754 directed rounding; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE_ASSERTIONS = [
  {
    // Anchor: the (H1) centre value F-prime(N_cross) ~ 0.9546 in (0,1), K ~ 1.5727e8, centre N_cross ~ 3.28e9.
    id: 'imp36219-operator-anchor-and-h1-centre',
    description: 'F-prime(N_cross) ~ 0.9546 in (0,1); K=(C_C_pinned/E_trunc)^2 ~ 1.5727e8; centre N_cross ~ 3.28e9',
    holds: () =>
      K_AMPL > 1.57e8 && K_AMPL < 1.58e8 &&
      N_CROSS > 3.2e9 && N_CROSS < 3.3e9 &&
      FP_AT_CENTER > 0.95 && FP_AT_CENTER < 0.96,
  },
  {
    // The dual-role budgets are the SAME threshold r < F-prime(mid): (H1) exclude-0 and the contraction factor.
    id: 'imp36219-shared-radius-budget',
    description: '(H1) exclude-0 budget and the Krawczyk contraction budget both reduce to r < F-prime(mid) ~ 0.9546',
    holds: () =>
      Math.abs(R2_RADIUS_BUDGET - FP_AT_CENTER) < 1e-15 &&
      COARSE_R < R2_RADIUS_BUDGET && // coarse example is inside the budget
      Math.abs(COARSE_CONTRACTION - COARSE_R / FP_AT_CENTER) < 1e-15 &&
      COARSE_CONTRACTION < 1, // contracts
  },
  {
    // A coarse enclosure discharges R2 (tolerance-generous), yet R2 discharge stays conditional on R5.
    id: 'imp36219-coarse-discharges-but-r5-binds',
    description: 'coarse [F-prime] discharges R2 with enormous slack (tightness), but R5 directed rounding still binds (soundness)',
    holds: () => {
      const o = IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE;
      return /YES with enormous slack/.test(o.coarseEnclosureDischargesR2) &&
        /TOLERANCE-GENEROUS, NOT precision-limited/.test(o.coarseEnclosureDischargesR2) &&
        /TIGHTNESS margin, NOT a SOUNDNESS margin/.test(o.r5StillBinds) &&
        /CONDITIONAL ON[\s\S]*R5/.test(o.r5StillBinds) &&
        /NOT the binding constraint/.test(o.conclusion.r2NotBinding) &&
        /R5/.test(o.conclusion.residualDependencyIsR5);
    },
  },
  {
    // Honesty gate: scoping only; layer unimplemented; imp-34714a open; no QED; no refereed bound is changed.
    id: 'imp36219-honesty-gate-no-qed',
    description: 'scoping only; imp-34687a UNIMPLEMENTED; imp-34714a OPEN; no QED; no refereed bound is changed',
    holds: () =>
      IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /UNIMPLEMENTED/.test(IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE.conclusion.staysUnimplementedAndOpen) &&
      /imp-34714a stays OPEN/.test(IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE.conclusion.staysUnimplementedAndOpen) &&
      /NO QED/.test(IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE.verdict) &&
      /refereed bound is changed/i.test(IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE.verdict),
  },
];

for (const a of IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36219-krawczyk-derivative-enclosure-r2-discharge-scope assertion failed: ${a.id}`);
  }
}

export default IMP36219_KRAWCZYK_DERIVATIVE_ENCLOSURE_R2_DISCHARGE;

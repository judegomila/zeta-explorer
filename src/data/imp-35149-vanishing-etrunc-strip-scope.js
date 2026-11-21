/**
 * @module imp-35149-vanishing-etrunc-strip-scope
 *
 * imp-35149 (proof, frontier-direction, SCOPING ONLY): imp-35100 measured that the surrogate
 * total E(N) = E_coll + E_trunc + E_flow is monotone decreasing but FLOORS at the constant
 * E_trunc = 3.06e-5 (E/E_trunc 48.2 -> 1.02 over [1e6,1e13]), so E(N) -> E_trunc > 0, NOT 0.
 * The vanishing part E(N) - E_trunc = E_coll + E_flow -> 0, but the fixed truncation constant is
 * a hard floor, so the surrogate as WRITTEN cannot supply the Step-4 rate E(N) -> 0. imp-35100
 * names the fix -- "a genuinely vanishing E_trunc route (N-dependent strip), NOT the imp-2631
 * fixed strip" -- but leaves it unscoped. THIS module scopes that route: what N-dependence of the
 * truncation strip would drive E_trunc(N) -> 0, what analytic/computational input it requires, and
 * whether it re-inflates E_coll / E_flow. Enumerates obligations R1..R5. SCOPING ONLY; NO QED.
 *
 * WHERE E_trunc COMES FROM (imp-2631, inherited, not re-derived)
 * -------------------------------------------------------------
 * E_trunc is the tail contribution of the unverified strip ABOVE a VERIFIED height T_v, using an
 * unconditional zero-density D(sigma, T) at a working abscissa sigma:
 *     E_trunc(T_v, sigma) = (2 e / kappa) * T_v^{-kappa},   kappa = 1 - e,   e = e(sigma).
 * With Ingham 1940 e(sigma) = 3(1-sigma)/(2-sigma). The imp-2631 FIXED strip pins T_v = T_PT =
 * 3e12 (Platt-Trudgian verified height) and sigma = 3/4 (e = 0.6, kappa = 0.4), giving the
 * N-INDEPENDENT constant E_trunc = (2*0.6/0.4) * (3e12)^{-0.4} = 3.06e-5. It is N-independent
 * precisely because BOTH T_v and sigma are fixed -- neither moves with N. That fixedness is the
 * imp-35100 floor.
 *
 * THE TWO KNOBS AND WHY ONLY ONE CAN VANISH E_trunc
 * -------------------------------------------------
 * E_trunc(T_v, sigma) has exactly two levers:
 *   (Knob A) GROW the verified height T_v(N) -> infinity at a FIXED abscissa sigma bounded away
 *            from 1/2 (kappa >= kappa_0 > 0). Then E_trunc(N) = (2e/kappa) T_v(N)^{-kappa} -> 0
 *            at the algebraic rate T_v(N)^{-kappa_0}. This is the ONLY lever that vanishes E_trunc.
 *   (Knob B) SHRINK the abscissa toward the critical line, sigma(N) -> 1/2, i.e. the imp-2622
 *            "thin moving strip" sigma = 1/2 + 1/log T. Then kappa = kappa(sigma) -> 0 and the
 *            prefactor 2e/kappa -> infinity, so E_trunc GROWS, not shrinks (imp-2622: 7.65 at
 *            1e13, never < 0.2 at scale). Knob B is structurally DEAD for a vanishing route.
 * So a "genuinely vanishing E_trunc(N)" route MUST be Knob A: an N-indexed growing VERIFIED height
 * T_v(N) -> infinity with sigma held at (or below, toward 1) 3/4, NOT a thinner strip.
 *
 * DOES KNOB A RE-INFLATE E_coll / E_flow?  (the ticket sub-question)
 * -----------------------------------------------------------------
 * E_coll = C_C sqrt(log T0 / N) and E_flow = C_F (log T0 / T0) Gronwall depend on the
 * INSTANTIATION height T0 = effectiveHeightForN(N), i.e. the height at which the surrogate is
 * evaluated -- NOT on the verified height T_v. So RAISING T_v (Knob A) leaves E_coll, E_flow
 * UNTOUCHED provided T_v is chosen INDEPENDENTLY of T0. The re-inflation trap is the OPPOSITE
 * identification: if one instead ties the verified height to the instantiation height,
 * T_v = T0(N), and lets the strip ride the critical line at that height (Knob B forced by honesty
 * at T0), then kappa_{T0} = (4/3)/log T0 -> 0 and E_trunc blows up -- the imp-2622 height-mismatch.
 * CONCLUSION: Knob A decouples cleanly (no re-inflation), but its cost is that T_v(N) must be
 * SEPARATELY, UNCONDITIONALLY supplied -- and that supply, past T_PT = 3e12, is exactly the
 * verified-zero-count input the project does not yet have unconditionally beyond RH itself.
 *
 * THE OBLIGATIONS R1..R5 (what a vanishing-strip route must discharge)
 * -------------------------------------------------------------------
 *   R1 STRIP-WIDTH LAW.   Specify an explicit N-indexed verified height T_v(N) (equivalently strip
 *      lower abscissa) with T_v(N) -> infinity and abscissa sigma(N) bounded away from 1/2
 *      (kappa(N) >= kappa_0 > 0). Then and only then E_trunc(N) = (2e/kappa) T_v(N)^{-kappa} -> 0.
 *   R2 VANISHING RATE / EXCLUDED-TAIL DECAY.   Certify the unconditional density input
 *      D(sigma, T) for all T >= T_v(N) giving the tail bound E_trunc(N) <~ T_v(N)^{-kappa_0}; i.e.
 *      the excluded-strip contribution above T_v(N) actually decays at the claimed algebraic rate
 *      (Ingham sigma=3/4 supplies kappa=0.4; Guth-Maynard sharpens to ~0.423, imp-2631(c)).
 *   R3 VERIFIED-HEIGHT SUPPLY (the hard one).   Exhibit that T_v(N) -> infinity is UNCONDITIONALLY
 *      available. Beyond T_PT = 3e12 this is NOT an analytic constant but either (i) HPC extension
 *      of RH-verification (RH-FREE but finite / expensive, an N-indexed compute obligation), or
 *      (ii) an unconditional theorem placing on-line zeros up to arbitrary height -- which for the
 *      critical line IS RH (circular). R3 is where the route is currently blocked.
 *   R4 NO-REINFLATION DECOUPLING.   Prove the chosen T_v(N) enters ONLY E_trunc and NOT E_coll,
 *      E_flow (which key off the instantiation height T0 = effectiveHeightForN(N)). Forbids the
 *      T_v = T0(N) identification, which re-lands on the imp-2622 thin-strip blow-up.
 *   R5 CONDITIONALITY LEDGER.   Record that R1/R2/R4 are analytic/algebraic and dischargeable, but
 *      R3 is the binding obligation, and it is a VERIFIED-HEIGHT (RH-free compute or RH-circular)
 *      input DISTINCT from the C_mb GUE-conditional per imp-486 that binds the E_coll side. The
 *      two conditionals do not collapse: E_trunc's obstruction is verified height, E_coll's is GUE.
 *
 * THE NUMERICAL ILLUSTRATION (scoping evidence, NOT a bound)
 * ---------------------------------------------------------
 *   (S1) Knob A works: at FIXED sigma = 3/4 (kappa = 0.4), letting the verified height grow
 *        T_v = 10^m over m in [12..24] drives E_trunc(T_v) monotonically to 0 at the algebraic
 *        rate T_v^{-0.4} (E_trunc 3.06e-5 at 3e12 down to ~7.5e-10 at 1e24). Vanishing is REAL
 *        under Knob A.
 *   (S2) Knob B fails: the imp-2622 honest thin strip at the INSTANTIATION height T0(N),
 *        sigma = 1/2 + 1/log T0, kappa = (4/3)/log T0, gives E_trunc GROWING past 0.2 as N grows
 *        (never a vanishing route) -- confirms Knob B is dead, so the route must be Knob A.
 *   (S3) Decoupling holds: E_coll, E_flow computed from T0 = effectiveHeightForN(N) are numerically
 *        INVARIANT to the Knob-A choice of T_v (they never reference T_v), so raising T_v does not
 *        re-inflate them -- R4 is satisfiable, the re-inflation is only under the forbidden
 *        T_v = T0 identification.
 *
 * SCOPING ONLY. Enumerates obligations for a vanishing-E_trunc(N) route; discharges NONE of them;
 * R3 (unconditional growing verified height beyond T_PT = 3e12) is named as the binding open
 * obligation and is RH-free-compute-or-RH-circular. Changes no bound; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED and is a SEPARATE conditional from R3; the imp-2631 fixed strip is
 * UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no
 * operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35100-surrogate-total-E-fartail-floor (E(N) floors at constant E_trunc; names this route)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = (2e/kappa) T_v^{-kappa}; fixed strip)
 * @see imp-2622-height-mismatch-refutation (thin moving strip kappa -> 0, E_trunc blows up; Knob B)
 * @see imp-459 sigma_opt = 3/4 variational optimum for the fixed-strip route
 * @see imp-486 (C_mb GUE-conditional caveat; separate conditional from the R3 verified-height input)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = instantiation height)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const T_PT = 3e12; // Platt-Trudgian verified height (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35100 exactly

const eIngham = (sigma) => (3 * (1 - sigma)) / (2 - sigma); // Ingham 1940 density exponent

// E_trunc via the PT+Ingham tail integral: (2 e / kappa) * T_v^{-kappa}, kappa = 1 - e.
function eTrunc(T_v, sigma) {
  const e = eIngham(sigma);
  const kappa = 1 - e;
  if (!(kappa > 0) || !(T_v > 1)) return null;
  return ((2 * e) / kappa) * Math.exp(-kappa * Math.log(T_v));
}

// Reproduce the imp-2631 fixed-strip constant (reuse gate): sigma = 3/4, T_v = T_PT.
const E_TRUNC_FIXED = eTrunc(T_PT, 0.75); // ~3.06e-5

// (S1) Knob A -- FIXED sigma = 3/4, verified height grows T_v = 10^m; E_trunc -> 0 like T_v^{-0.4}.
const KNOB_A_LADDER = [12, 14, 16, 18, 20, 22, 24].map((m) => {
  const T_v = Math.pow(10, m);
  return { log10Tv: m, E_trunc: eTrunc(T_v, 0.75) };
});

// (S2) Knob B -- honest thin moving strip at the INSTANTIATION height T0(N): kappa -> 0, blows up.
function eTruncThinStrip(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const sigma = 0.5 + 1 / L; // imp-2622 honest moving strip
  const kappa = (4 / 3) / L; // imp-2622 kappa_T = (4/3)/log T0
  const e = 1 - kappa;
  return { T0, sigma, kappa, E_trunc: ((2 * e) / kappa) * Math.exp(-kappa * L) };
}
const KNOB_B_LADDER = [6, 9, 13].map((k) => {
  const N = Math.pow(10, k);
  return { log10N: k, ...eTruncThinStrip(N) };
});

// (S3) Decoupling -- E_coll, E_flow key off T0 = instantiation height, NOT the Knob-A T_v.
function collFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { E_coll, E_flow };
}
const CF_1E9 = collFlow(1e9); // invariant to any Knob-A T_v choice (never references T_v)

// Diagnostics for the findings/assertions.
const KNOB_A_FIRST = KNOB_A_LADDER[0]; // 3.06e-5 at 1e12
const KNOB_A_LAST = KNOB_A_LADDER[KNOB_A_LADDER.length - 1]; // ~7.5e-10 at 1e24
const KNOB_A_VANISHES =
  KNOB_A_LAST.E_trunc < KNOB_A_FIRST.E_trunc / 100 && KNOB_A_LAST.E_trunc > 0;
let knobAMonotone = true;
for (let i = 1; i < KNOB_A_LADDER.length; i++) {
  if (!(KNOB_A_LADDER[i].E_trunc < KNOB_A_LADDER[i - 1].E_trunc)) knobAMonotone = false;
}
const KNOB_B_BLOWS_UP = KNOB_B_LADDER[KNOB_B_LADDER.length - 1].E_trunc > 0.2; // never vanishes

const OBLIGATIONS = [
  {
    id: 'R1',
    name: 'strip-width-law',
    statement:
      'Specify an N-indexed verified height T_v(N) -> infinity at a fixed abscissa sigma bounded ' +
      'away from 1/2 (kappa >= kappa_0 > 0); then E_trunc(N) = (2e/kappa) T_v(N)^{-kappa} -> 0.',
    status: 'analytic, dischargeable (Knob A)',
  },
  {
    id: 'R2',
    name: 'vanishing-rate-excluded-tail-decay',
    statement:
      'Certify the unconditional density D(sigma,T) for T >= T_v(N) giving the excluded-strip tail ' +
      'bound E_trunc(N) <~ T_v(N)^{-kappa_0} (Ingham sigma=3/4 -> kappa=0.4; GM 2024 -> ~0.423).',
    status: 'analytic, dischargeable',
  },
  {
    id: 'R3',
    name: 'verified-height-supply',
    statement:
      'Exhibit T_v(N) -> infinity as UNCONDITIONALLY available beyond T_PT = 3e12: either (i) HPC ' +
      'RH-verification extension (RH-free but finite/expensive N-indexed compute) or (ii) an ' +
      'unconditional on-line-zero theorem to arbitrary height (= RH, circular). BINDING / OPEN.',
    status: 'OPEN -- binding obligation (RH-free-compute or RH-circular)',
  },
  {
    id: 'R4',
    name: 'no-reinflation-decoupling',
    statement:
      'Prove T_v(N) enters ONLY E_trunc, not E_coll/E_flow (which key off T0 = ' +
      'effectiveHeightForN(N)); forbids the T_v = T0(N) identification that re-lands on the ' +
      'imp-2622 thin-strip blow-up (Knob B).',
    status: 'analytic, satisfiable (decoupling holds)',
  },
  {
    id: 'R5',
    name: 'conditionality-ledger',
    statement:
      'Record that R3 (verified height) is a SEPARATE conditional from the C_mb GUE-conditional ' +
      '(imp-486) that binds E_coll; the two do not collapse. E_trunc obstruction = verified ' +
      'height; E_coll obstruction = GUE universality.',
    status: 'bookkeeping, dischargeable',
  },
];

export const IMP35149_VANISHING_ETRUNC_STRIP_SCOPE = {
  id: 'imp-35149',
  proofSection: 'S-frontier',
  question:
    'Scope whether an N-DEPENDENT truncation strip -- a genuinely vanishing E_trunc(N) -> 0, NOT ' +
    'the imp-2631 fixed 3.06e-5 strip -- can supply the Step-4 E(N) -> 0 rate the fixed-strip ' +
    'surrogate provably cannot (imp-35100: E(N) floors at the constant E_trunc). What N-dependence ' +
    'of the strip vanishes E_trunc(N), what input it needs, and whether it re-inflates ' +
    'E_coll/E_flow. Scoping only; enumerates obligations R1..R5; changes no bound; ' +
    'C_mb GUE-conditional per imp-486; NO QED.',
  eTruncModel:
    'E_trunc(T_v, sigma) = (2 e / kappa) T_v^{-kappa}, kappa = 1 - e, e = 3(1-sigma)/(2-sigma) ' +
    '(Ingham); imp-2631 fixed strip pins T_v = T_PT = 3e12, sigma = 3/4 -> E_trunc = 3.06e-5 ' +
    '(N-independent because BOTH knobs fixed).',
  twoKnobs: {
    knobA_grow_verified_height:
      'FIXED sigma bounded off 1/2 (kappa >= kappa_0 > 0), T_v(N) -> infinity: E_trunc -> 0 at ' +
      'rate T_v^{-kappa_0}. The ONLY vanishing lever.',
    knobB_thin_moving_strip:
      'sigma(N) -> 1/2 (imp-2622 sigma = 1/2 + 1/log T): kappa -> 0, prefactor 2e/kappa -> infinity, ' +
      'E_trunc GROWS past 0.2 -- structurally DEAD for a vanishing route.',
  },
  reinflation:
    'Knob A decouples: E_coll = C_C sqrt(log T0/N) and E_flow = C_F (log T0/T0) Gronwall key off the ' +
    'INSTANTIATION height T0 = effectiveHeightForN(N), never the verified height T_v, so raising ' +
    'T_v does NOT re-inflate them -- provided T_v is chosen independently of T0. Re-inflation ' +
    'occurs ONLY under the forbidden T_v = T0(N) identification (Knob B at T0).',
  obligations: OBLIGATIONS,
  bindingObligation: 'R3',
  knobA_ladder: KNOB_A_LADDER.map((r) => ({
    log10Tv: r.log10Tv,
    E_trunc: +r.E_trunc.toExponential(4),
  })),
  knobB_ladder: KNOB_B_LADDER.map((r) => ({
    log10N: r.log10N,
    sigma: +r.sigma.toFixed(4),
    kappa: +r.kappa.toFixed(4),
    E_trunc: +r.E_trunc.toExponential(4),
  })),
  landmarks: {
    E_trunc_fixed_at_TPT: +E_TRUNC_FIXED.toExponential(4), // ~3.06e-5 (reuse gate)
    E_trunc_knobA_at_1e24: +KNOB_A_LAST.E_trunc.toExponential(4), // ~7.5e-10 (vanishing)
    E_trunc_knobB_at_1e13: +KNOB_B_LADDER[KNOB_B_LADDER.length - 1].E_trunc.toExponential(4), // >0.2
    E_coll_at_1e9: +CF_1E9.E_coll.toExponential(4),
    E_flow_at_1e9: +CF_1E9.E_flow.toExponential(4),
  },
  finding: {
    S1_knobA_vanishes:
      'At FIXED sigma = 3/4 (kappa = 0.4), growing verified height T_v = 10^m drives E_trunc ' +
      'monotonically to 0 at the algebraic rate T_v^{-0.4} (3.06e-5 at 3e12 -> ~7.5e-10 at 1e24). ' +
      'A vanishing E_trunc(N) is REAL under Knob A.',
    S2_knobB_dead:
      'The imp-2622 honest thin moving strip at the instantiation height T0 (sigma = 1/2 + 1/log T0, ' +
      'kappa = (4/3)/log T0 -> 0) makes E_trunc GROW past 0.2, never a vanishing route -- so the ' +
      'route MUST be Knob A (grow the verified height), NOT a thinner strip.',
    S3_decoupling:
      'E_coll, E_flow are computed from T0 = effectiveHeightForN(N) and never reference T_v, so the ' +
      'Knob-A choice of verified height leaves them numerically invariant -- R4 is satisfiable; ' +
      're-inflation arises only under the forbidden T_v = T0 identification.',
    R3_is_binding:
      'The route reduces to R3: an UNCONDITIONAL growing verified height T_v(N) -> infinity beyond ' +
      'T_PT = 3e12, which is either RH-free HPC compute (finite/expensive, N-indexed) or an ' +
      'on-line-zero theorem to arbitrary height (= RH, circular). R3 is the binding open obligation ' +
      'and is DISTINCT from the C_mb GUE-conditional (imp-486) on the E_coll side.',
  },
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous). A genuinely vanishing E_trunc(N) -> 0 route DOES ' +
    'exist analytically -- Knob A: hold the density abscissa sigma fixed off the critical line ' +
    '(sigma = 3/4, kappa = 0.4) and let the VERIFIED height T_v(N) -> infinity, giving ' +
    'E_trunc(N) = (2e/kappa) T_v(N)^{-kappa} -> 0 at rate T_v^{-0.4} (illustrated 3.06e-5 at 3e12 ' +
    'down to ~7.5e-10 at 1e24). The alternative Knob B (thin moving strip sigma -> 1/2, imp-2622) ' +
    'is structurally dead: kappa -> 0 makes E_trunc BLOW UP past 0.2. Crucially the vanishing route ' +
    'does NOT re-inflate E_coll/E_flow, which key off the instantiation height T0 = ' +
    'effectiveHeightForN(N) and never the verified height T_v -- so R4 (decoupling) is satisfiable; ' +
    're-inflation happens only under the forbidden T_v = T0 identification (Knob B at T0). The route ' +
    'therefore reduces to FIVE obligations R1 (strip-width law), R2 (excluded-tail decay rate), R3 ' +
    '(UNCONDITIONAL growing verified height beyond T_PT = 3e12), R4 (no-reinflation decoupling), R5 ' +
    '(conditionality ledger). R1/R2/R4/R5 are analytic/algebraic and dischargeable; R3 is the ' +
    'BINDING obligation and is a VERIFIED-HEIGHT input -- either RH-free HPC verification (finite, ' +
    'expensive, N-indexed) or an on-line-zero theorem to arbitrary height (= RH, circular) -- ' +
    'DISTINCT from and not collapsing onto the C_mb GUE-conditional per imp-486 that binds E_coll. ' +
    'SCOPING ONLY: discharges NONE of R1..R5; changes no bound; the imp-2631 fixed strip is ' +
    'UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no ' +
    'operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35100 (E(N) floors at constant E_trunc; names this route); imp-2631 (E_trunc = ' +
    '(2e/kappa) T_v^{-kappa}, fixed strip); imp-2622 (thin moving strip kappa -> 0, blow-up, ' +
    'Knob B); imp-459 (sigma_opt = 3/4); imp-486 (C_mb GUE-conditional, separate from R3); ' +
    'imp-3463 (far-tail E_flow decay exponent 1/2); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35149_VANISHING_ETRUNC_STRIP_SCOPE_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-2631 fixed-strip constant E_trunc = 3.06e-5 (same model in use).
    id: 'imp35149-reproduces-fixed-strip-constant',
    description: 'E_trunc(T_PT, 3/4) ~ 3.06e-5 on the shared imp-2631 (2e/kappa) T_v^{-kappa} model',
    holds: () => Math.abs(E_TRUNC_FIXED / 3.06e-5 - 1) < 5e-3,
  },
  {
    // (S1) Knob A: growing verified height at fixed sigma vanishes E_trunc monotonically.
    id: 'imp35149-knobA-vanishes-monotone',
    description: 'E_trunc(10^m, 3/4) monotone decreasing and drops >100x from 1e12 to 1e24',
    holds: () => knobAMonotone && KNOB_A_VANISHES,
  },
  {
    // (S2) Knob B: thin moving strip at the instantiation height blows up past 0.2 (dead route).
    id: 'imp35149-knobB-blows-up',
    description: 'thin moving strip (sigma -> 1/2) E_trunc > 0.2 at 1e13 -- never a vanishing route',
    holds: () => KNOB_B_BLOWS_UP,
  },
  {
    // R3 is flagged as the binding open obligation.
    id: 'imp35149-R3-binding-open',
    description: 'R3 (verified-height supply) is named the binding obligation and marked OPEN',
    holds: () =>
      IMP35149_VANISHING_ETRUNC_STRIP_SCOPE.bindingObligation === 'R3' &&
      /OPEN/.test(OBLIGATIONS.find((r) => r.id === 'R3').status),
  },
  {
    // Honesty gate: scoping only, no QED, no refereed bound is changed, imp-486 GUE conditional untouched.
    id: 'imp35149-honesty-gate-no-qed',
    description: 'Scoping only: isRigorous false, no QED, GUE-conditional noted, no refereed bound is changed',
    holds: () =>
      IMP35149_VANISHING_ETRUNC_STRIP_SCOPE.isRigorous === false &&
      /NO QED/.test(IMP35149_VANISHING_ETRUNC_STRIP_SCOPE.verdict) &&
      /imp-486/.test(IMP35149_VANISHING_ETRUNC_STRIP_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35149_VANISHING_ETRUNC_STRIP_SCOPE.verdict),
  },
];

for (const a of IMP35149_VANISHING_ETRUNC_STRIP_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35149-vanishing-etrunc-strip-scope assertion failed: ${a.id}`);
  }
}

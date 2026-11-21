// @module data/imp-96190-fixed-strip-n-decaying-tail-obstruction
//
// imp-96190 (numerical, frontier-direction): imp-96166 measured that the
// assembled E(N) FLOORS at the N-independent truncation term E_trunc ~ 3.06e-5
// (frozen at the Platt-Trudgian verification height T_PT = 3e12), and named two
// ways past the shortfall for an unconditional lim_N E(N) = 0: push T_PT to
// infinity, OR find a fixed-strip route whose truncation TAIL decays with N
// instead of freezing. This module ASSESSES the second alternative and derives
// that it is STRUCTURALLY OBSTRUCTED within the current framework, cross-checking
// the imp-2622 / imp-35164 thin-strip ceiling.
//
// THE TWO BRANCHES OF THE TRUNCATION HEIGHT
// -----------------------------------------
// The truncation tail is E_trunc(H) = (2 e / kappa) H^{-kappa} (Ingham 1940
// density above the honest strip abscissa; imp-447 / imp-2322), where H is the
// height at which the off-line-zero contribution starts. There are exactly two
// ways for H to enter the assembly, and hence to depend on N:
//   (A) FIXED verified height: H = T_PT = 3e12, honest abscissa sigma = 3/4
//       (e_I = 0.6, kappa = 0.4). Unconditional, but N-INDEPENDENT: E_trunc is
//       frozen at ~3.06e-5 -- the imp-96166 floor. No decay, no N-dependence.
//   (B) N-COUPLED height: H = T0(N) grows with N (the flow instantiation height,
//       the only N-coupled height in the surrogate). Above T0(N) there is NO
//       strip verification, so honesty forces the density abscissa to the moving
//       edge sigma = 1/2 + 1/log T0, at which the Ingham exponent collapses to
//       kappa(H) = (4/3) / log H -> 0 (the imp-2622 thin-strip ceiling).
//
// THE DECAY-VERSUS-HONESTY IDENTITY (the obstruction, this module)
// ----------------------------------------------------------------
// A decaying tail can only come from the power factor H^{-kappa} as H -> infinity
// (the prefactor 2 e / kappa never decays). But substituting the honest moving
// exponent kappa(H) = (4/3) / log H produces an EXACT height-cancellation:
//   H^{-kappa} = exp(-kappa log H) = exp(-4/3) = 0.263597   (a CONSTANT, all H).
// The sole decay lever is pinned to a constant, so the honest tail becomes
//   E_trunc(H) = (2 (1 - kappa) / kappa) e^{-4/3} = e^{-4/3} (1.5 log H - 2),
// which is strictly INCREASING in log H (slope e^{-4/3} * 1.5 = 0.3954 > 0).
// Coupling the height to N to buy decay instead makes the honest truncation tail
// GROW like ~0.4 log H: E_trunc(3e12) ~ 10.8, E_trunc(1e13) ~ 11.3, ~14.0 at
// 1e16 -- consistent with the imp-2622 ceiling (never below 0.2, growing with
// height). This is the anti-decay: the N-coupling that would supply decay is
// exactly the coupling that forces growth.
//
// WHAT AN N-DECAYING TAIL WOULD REQUIRE
// -------------------------------------
// A genuinely decaying tail E ~ (const) H(N)^{-kappa_star} needs the exponent
// kappa_star held at a FIXED positive value while the height H(N) -> infinity.
// Honesty permits a fixed kappa_star > 0 above a height H only with an
// all-zeros-in-strip certificate to H (Platt-Trudgian strength). So an
// N-decaying E_trunc-analog is precisely a VERIFIED strip height that grows with
// N -- e.g. the imp-96185 inversion needs H = 1.56e16 to reach a 1e-6 floor and
// H -> infinity to reach 0. That is the T_PT -> infinity branch, not a
// fixed-strip alternative: no N-decaying-tail fixed-strip surrogate exists in the
// framework. The two named ways past the shortfall are therefore ONE way
// (verified height must grow), not two.
//
// CROSS-CHECK WITH imp-35164
// --------------------------
// This confirms the imp-35164 dichotomy from the truncation side: E(N) FLOORS
// when the height is frozen (branch A) and BLOWS UP when the height is coupled to
// N (branch B). Both branches of the only available parameterization fail the
// Step-4 bridge requirement lim_N E(N) = 0.
//
// SCOPE: ASSESSMENT / DERIVATION ONLY. No zero is verified, no new T_PT is
// claimed, the rigorous bound stays E_trunc = 3.06e-5, and C_mb stays
// GUE-conditional per imp-486. Discharges no gap; changes no bound. No
// positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed
// ; RH remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-96166-en-decay-exponent-vs-step4-bridge-threshold (the frozen E_trunc floor / the two named alternatives)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (verified-height inversion, T_PT -> infinity branch)
// @see imp-2631-honest-truncation-route-assessment (fixed-strip route optimum; thin-strip ceiling)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward E_trunc(T_PT) power law, elasticity -0.4)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Anchors of the fixed-strip truncation term (imp-2322 / imp-447).
const T_PT_BASELINE = 3e12;                 // Platt-Trudgian 2021 verified height
const SIGMA_OPT = 0.75;                       // imp-459 honest fixed abscissa
const INGHAM_E = (3 * (1 - SIGMA_OPT)) / (2 - SIGMA_OPT); // 0.6
const INGHAM_KAPPA = 1 - INGHAM_E;            // 0.4
const FROZEN_FLOOR = ((2 * INGHAM_E) / INGHAM_KAPPA) * Math.pow(T_PT_BASELINE, -INGHAM_KAPPA); // ~3.06e-5

// Branch A -- FIXED verified height, honest sigma = 3/4. N-independent (frozen).
function frozenTail() {
  return FROZEN_FLOOR;
}

// Branch B -- N-coupled height. Honesty above an unverified height forces the
// moving edge abscissa sigma = 1/2 + 1/log H, whose Ingham exponent collapses to
// kappa(H) = (4/3)/log H (imp-2622 thin-strip ceiling).
const MOVING_C = 4 / 3;
function movingKappa(H) {
  return MOVING_C / Math.log(H);
}
function movingTail(H) {
  const kappa = movingKappa(H);
  const e = 1 - kappa;
  return ((2 * e) / kappa) * Math.pow(H, -kappa);
}
// Closed form after the exact height-cancellation H^{-kappa} = exp(-4/3).
function movingTailClosed(H) {
  return Math.exp(-MOVING_C) * (1.5 * Math.log(H) - 2);
}

// The exact height-cancellation constant: H^{-kappa(H)} = exp(-4/3) for every H.
const HEIGHT_CANCELLATION = Math.exp(-MOVING_C);          // 0.263597
// Slope of the honest moving tail in log H: strictly positive -> tail GROWS.
const MOVING_SLOPE_PER_LOGH = Math.exp(-MOVING_C) * 1.5;  // 0.395396

// A representative N-coupled height ladder (T0 growing with N). The honest tail
// is monotone increasing along it -- the anti-decay.
const HEIGHT_LADDER = [3e12, 1e13, 1e16, 1e30, 1e60];
const MOVING_TABLE = HEIGHT_LADDER.map((H) => ({
  H: +H.toExponential(1),
  logH: +Math.log(H).toFixed(4),
  kappa: +movingKappa(H).toFixed(6),
  powerFactor: +Math.pow(H, -movingKappa(H)).toFixed(6), // == exp(-4/3), all rows
  E_trunc_moving: +movingTail(H).toFixed(4),
  _E_full: movingTail(H),
}));

export const IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION = {
  id: 'imp-96190',
  proofSection: 'S-frontier',
  question:
    'Can a fixed-strip route with a truncation TAIL that decays with N (rather ' +
    'than the T_PT-frozen E_trunc) supply an unconditional lim_N E(N) = 0, or is ' +
    'it structurally obstructed? Assessment / derivation only, changes no bound, ' +
    'no QED (imp-96166 named alternative).',
  branches: {
    frozen: {
      label: 'Branch A -- fixed verified height H = T_PT, honest sigma = 3/4',
      sigma: SIGMA_OPT,
      kappa: INGHAM_KAPPA,
      E_trunc: +frozenTail().toExponential(4),
      Ndependent: false,
      note:
        'Unconditional but N-INDEPENDENT: frozen at ~3.06e-5, the imp-96166 ' +
        'floor. No decay.',
    },
    coupled: {
      label: 'Branch B -- N-coupled height H = T0(N), honest moving edge',
      kappaOfH: 'kappa(H) = (4/3)/log H -> 0 (imp-2622 thin-strip ceiling)',
      heightCancellation: +HEIGHT_CANCELLATION.toFixed(6),
      closedForm: 'E_trunc(H) = exp(-4/3) (1.5 log H - 2)',
      slopePerLogH: +MOVING_SLOPE_PER_LOGH.toFixed(6),
      Ndependent: true,
      monotone: 'increasing',
      note:
        'Honesty above the unverified height forces the density exponent to ' +
        'collapse as (4/3)/log H, so the sole decay lever H^{-kappa} is pinned to ' +
        'the constant exp(-4/3) = 0.263597 and the tail GROWS like ~0.4 log H ' +
        'instead of decaying.',
    },
  },
  heightCancellationIdentity:
    'H^{-kappa(H)} = exp(-kappa(H) log H) = exp(-4/3) = 0.263597 for every H: the ' +
    'honest moving exponent kappa(H) = (4/3)/log H cancels the height in the power ' +
    'factor exactly, removing the only source of decay.',
  movingTailTable: MOVING_TABLE.map(({ _E_full, ...pub }) => pub),
  whatNDecayWouldRequire:
    'A decaying tail E ~ (const) H(N)^{-kappa_star} needs kappa_star held at a ' +
    'FIXED positive value while H(N) -> infinity. Honesty allows a fixed ' +
    'kappa_star > 0 above height H only with an all-zeros-in-strip certificate to ' +
    'H (Platt-Trudgian strength). So an N-decaying E_trunc-analog is exactly a ' +
    'verified strip height growing with N (imp-96185: H = 1.56e16 for a 1e-6 ' +
    'floor, H -> infinity for 0) -- the T_PT -> infinity branch, NOT a fixed-strip ' +
    'alternative. No N-decaying-tail fixed-strip surrogate exists here.',
  crossCheckImp35164:
    'Confirms the imp-35164 dichotomy from the truncation side: E(N) FLOORS when ' +
    'the height is frozen (branch A) and BLOWS UP when the height is coupled to N ' +
    '(branch B). Both branches of the only available parameterization fail ' +
    'lim_N E(N) = 0.',
  honestStatusBanner: {
    tier: 'ASSESSMENT / DERIVATION ONLY -- NOT A THEOREM',
    label: 'The two named ways past the E(N) shortfall collapse to ONE',
    body:
      'imp-96166 named two routes past the frozen E_trunc floor: push T_PT to ' +
      'infinity, or find a fixed-strip surrogate whose truncation tail decays ' +
      'with N. This module shows no such fixed-strip surrogate exists: honesty ' +
      'above an unverified height forces the moving exponent kappa(H) = ' +
      '(4/3)/log H, whose exact height-cancellation H^-kappa(H) = exp(-4/3) pins ' +
      'the only decay lever to a constant, so the tail GROWS instead of ' +
      'decaying. The two named alternatives are therefore ONE alternative: an ' +
      'unconditional lim_N E(N) = 0 requires a verified strip height that grows ' +
      'with N (the T_PT -> infinity branch), not a fixed-strip shortcut. Changes ' +
      'no bound; C_mb stays GUE-conditional per imp-486. NO QED.',
  },
  isRigorous: false,
  verdict:
    'OBSTRUCTED (assessment / derivation, NOT rigorous). The truncation height H ' +
    'has exactly two parameterizations, and neither supplies an N-decaying tail: ' +
    '(A) fixed verified height H = T_PT is frozen (the imp-96166 floor ~3.06e-5, ' +
    'no N-dependence); (B) N-coupling H = T0(N) forces the honest moving exponent ' +
    'kappa(H) = (4/3)/log H, whose exact height-cancellation H^{-kappa} = ' +
    'exp(-4/3) = 0.263597 pins the sole decay lever to a constant, so the tail ' +
    'GROWS as E_trunc(H) = exp(-4/3)(1.5 log H - 2) ~ 0.4 log H (imp-2622 ' +
    'ceiling, never below 0.2). A genuinely decaying tail would require a FIXED ' +
    'positive exponent at a growing height -- i.e. an all-zeros-in-strip ' +
    'certificate to H(N), which is the T_PT -> infinity branch, not a fixed-strip ' +
    'alternative. So no N-decaying-tail fixed-strip surrogate exists; the two ' +
    'imp-96166 alternatives collapse to one (verified height must grow), ' +
    'cross-checking imp-35164. Discharges no gap; changes no bound; C_mb stays ' +
    'GUE-conditional per imp-486. No positivity, no bridge closure, no RH claim, ' +
    'NO QED. No refereed bound is changed; RH OPEN.',
  citation:
    'imp-96166 (frozen E_trunc floor / two named alternatives); imp-96185 ' +
    '(verified-height inversion); imp-2631 (fixed-strip route optimum); imp-2622 ' +
    '(thin-strip ceiling kappa_T = (4/3)/log T0); imp-2322 (forward E_trunc power ' +
    'law); imp-35164 (E(N) FLOORS/BLOWS UP dichotomy); imp-486 (C_mb ' +
    'GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
};

export const IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION_ASSERTIONS = [
  {
    // Branch A frozen value matches the canonical imp-96166 / imp-2322 floor and
    // is N-independent (no N enters the fixed-strip tail).
    id: 'imp96190-frozen-branch-is-the-floor',
    description: 'Branch A (fixed verified height) is the frozen ~3.06e-5 floor, N-independent',
    holds: () =>
      Math.abs(frozenTail() - 3.06e-5) < 1e-6 &&
      IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.branches.frozen.Ndependent === false,
  },
  {
    // The exact height-cancellation: H^{-kappa(H)} = exp(-4/3) for EVERY ladder
    // height (the crux of the obstruction). Independence of H is the point.
    id: 'imp96190-height-cancellation-exact',
    description: 'H^{-kappa(H)} = exp(-4/3) = 0.263597 exactly for every coupled height',
    holds: () =>
      HEIGHT_LADDER.every(
        (H) => Math.abs(Math.pow(H, -movingKappa(H)) - Math.exp(-4 / 3)) < 1e-9,
      ),
  },
  {
    // The closed form after cancellation reproduces the full moving tail exactly.
    id: 'imp96190-closed-form-matches-full-tail',
    description: 'Closed form exp(-4/3)(1.5 log H - 2) reproduces the full moving tail',
    holds: () =>
      HEIGHT_LADDER.every(
        (H) => Math.abs(movingTailClosed(H) - movingTail(H)) < 1e-9 * movingTail(H),
      ),
  },
  {
    // The honest moving tail is strictly INCREASING in H: coupling to N grows the
    // tail (anti-decay), the opposite of what the bridge needs.
    id: 'imp96190-moving-tail-grows-not-decays',
    description: 'Honest N-coupled tail is strictly increasing in H (grows, does not decay)',
    holds: () => {
      for (let i = 1; i < MOVING_TABLE.length; i++) {
        if (!(MOVING_TABLE[i]._E_full > MOVING_TABLE[i - 1]._E_full)) return false;
      }
      return MOVING_SLOPE_PER_LOGH > 0;
    },
  },
  {
    // The moving tail sits far above the imp-2622 "never below 0.2" ceiling and
    // is enormously larger than the frozen floor -- both branches fail decay.
    id: 'imp96190-both-branches-fail-decay',
    description: 'Frozen branch floors > 0; coupled branch stays above 0.2 and grows -- neither decays to 0',
    holds: () => {
      const frozenPositive = frozenTail() > 0;
      const coupledAboveCeiling = MOVING_TABLE.every((r) => r._E_full > 0.2);
      const coupledFarAboveFrozen = MOVING_TABLE[0]._E_full > 1e5 * frozenTail();
      return frozenPositive && coupledAboveCeiling && coupledFarAboveFrozen;
    },
  },
  {
    // The honest-status banner names the collapse-to-one framing explicitly, so
    // a reader consuming only the banner still gets the correct, non-QED verdict.
    id: 'imp96190-honest-status-banner-names-collapse',
    description: 'honestStatusBanner names the two-alternatives-collapse-to-one verdict',
    holds: () =>
      /collapse to ONE/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.honestStatusBanner.label) &&
      /grows with N/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.honestStatusBanner.body) &&
      /NO QED/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.honestStatusBanner.body),
  },
  {
    // Honesty gate: assessment only, names the obstruction, keeps PT SOTA, no QED.
    id: 'imp96190-honesty-gate-no-qed',
    description: 'Assessment only: OBSTRUCTED verdict, E_trunc named, no QED, no refereed bound is changed',
    holds: () =>
      IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.isRigorous === false &&
      /OBSTRUCTED/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.verdict) &&
      /E_trunc/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.whatNDecayWouldRequire) &&
      /NO QED/.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.verdict) &&
      /refereed bound is changed/i.test(IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION.verdict),
  },
];

for (const a of IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96190-fixed-strip-n-decaying-tail-obstruction assertion failed: ${a.id}`,
    );
  }
}

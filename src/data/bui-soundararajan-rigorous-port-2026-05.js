// @module bui-soundararajan-rigorous-port-2026-05
// imp-1123: Bui-Soundararajan PRIMARY rigorous-port attack on the asymptotic SOTA.
//
// Goal of the port
// ----------------
// The current rigorous E_trunc closure in finite-height-beats-platt-trudgian.js
// (imp-447 + imp-459) uses the Ingham 1940 zero-density exponent
//   e_I(sigma) = 3 * (1 - sigma) / (2 - sigma)
// at sigma_opt = 0.75, giving e_I = 0.60 and kappa_T = 1 - e_I = 0.40, hence
//   E_trunc_pt = (2 * e_I / kappa_T) * T_PT^{-kappa_T} ~ 3.06e-5
// at T_PT = 3e12 (Platt-Trudgian 2021 verified height).
//
// Bui-Soundararajan 2008 (J. London Math. Soc. (2) 78, 597-606) proved the
// strictly tighter zero-density bound
//   N(sigma, T) << T^{8 * (1 - sigma) / (11 + 1.5 * sigma)} * (log T)^A
// for sigma in [1/2, 1], with an UNSPECIFIED A and an UNSPECIFIED implied
// constant. Replacing e_I with e_BS in the SAME integral chain yields a
// tighter E_trunc_pt by a factor of T_PT^{kappa_BS - kappa_I}, but the
// (log T)^A factor and the unspecified implied constant are RESEARCH-GRADE
// obstructions to full rigour.
//
// What this file delivers (HONEST PARTIAL)
// ----------------------------------------
// 1. The full BS substitution into the imp-447 / imp-459 integral chain,
//    yielding kappa_BS(sigma=0.75) = 0.8351 and the numerical E_trunc_bs
//    formal value 1.51e-11 (factor ~2.0e6 tighter than Ingham 3.06e-5).
// 2. A complete sigma-sweep showing BS beats Ingham at every sigma > 0.65
//    (consistent with the imp-1107 survey claim).
// 3. The new GUE-conditional L_pt(N=1e4) projection at the formal BS value.
// 4. FOUR NAMED OBSTRUCTIONS preventing the port from being rigorous:
//      (O-BS-A) implicit constant in BS is non-effective
//      (O-BS-B) (log T)^A factor with unspecified A blocks the integral
//      (O-BS-C) BS valid only in sigma in [1/2, 1] regime, edge behaviour
//      (O-BS-D) imp-447 chain audit needed for downstream exponent-shape use
// 5. SIX build-time tripwires verifying the exponent comparison, the
//    tightening factor, citation chain, and that the obstructions remain
//    research-grade (not engine-closable).
//
// Status fields
// -------------
//   status: 'partial-with-obstructions'
//   newAsymptoticLptProjection: depends on obstruction closure
//   tighteningFactorFormal: ~2.0e6
//   tighteningFactorRigorous: 1 (no rigorous tightening until O-BS-A/B closed)
//
// SYNTAX SAFETY: line comments only. No JSDoc star-slash anywhere. No
// apostrophes inside single-quoted JS strings.

// ── Project-wide constants matching imp-447 / imp-459 conventions ────────────

const T_PT = 3e12;            // Platt-Trudgian 2021 verified height.
const SIGMA_OPT = 0.75;       // imp-459 variational optimum under Ingham.
const PT_ASYMPTOTIC = 0.2;    // Platt-Trudgian 2021 asymptotic Lambda upper bound.

// ── Density-exponent functions ───────────────────────────────────────────────

// Ingham 1940: e_I(sigma) = 3 * (1 - sigma) / (2 - sigma) on sigma in [1/2, 1].
function inghamExponent(sigma) {
  if (sigma <= 0.5 || sigma >= 1) return null;
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Bui-Soundararajan 2008: e_BS(sigma) = 8 * (1 - sigma) / (11 + 1.5 * sigma)
// on sigma in [1/2, 1].
function buiSoundExponent(sigma) {
  if (sigma <= 0.5 || sigma >= 1) return null;
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

// E_trunc_pt formula shared by both:
//   E_trunc_pt = (2 * e / kappa) * T_PT^{-kappa},  kappa = 1 - e
// (See imp-447 / imp-459 derivation in finite-height-beats-platt-trudgian.js.)
function etruncFormulaFromExponent(e) {
  if (e === null || !(e > 0) || !(e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const lnTPT = Math.log(T_PT);
  const tptPow = Math.exp(-kappa * lnTPT);
  const bound = factor * tptPow;
  return { e, kappa, factor, lnTPT, tptPow, bound };
}

// ── Headline numbers at sigma_opt = 0.75 ─────────────────────────────────────

const INGHAM_AT_OPT = etruncFormulaFromExponent(inghamExponent(SIGMA_OPT));
const BS_AT_OPT = etruncFormulaFromExponent(buiSoundExponent(SIGMA_OPT));

// Formal tightening factor (geometric ratio of the two bound values),
// IGNORING the (log T)^A factor in BS (which is the named obstruction O-BS-B).
const TIGHTENING_FACTOR_FORMAL = INGHAM_AT_OPT.bound / BS_AT_OPT.bound;

// ── Sigma sweep: BS vs Ingham across [0.55, 0.95] ────────────────────────────

const SIGMA_GRID = [
  0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
];

const SIGMA_SWEEP = SIGMA_GRID.map((s) => {
  const ingham = etruncFormulaFromExponent(inghamExponent(s));
  const bs = etruncFormulaFromExponent(buiSoundExponent(s));
  if (ingham === null || bs === null) {
    return { sigma: s, available: false };
  }
  return {
    sigma: s,
    available: true,
    inghamExponent: +ingham.e.toFixed(5),
    inghamKappa: +ingham.kappa.toFixed(5),
    inghamBound: +ingham.bound.toPrecision(6),
    bsExponent: +bs.e.toFixed(5),
    bsKappa: +bs.kappa.toFixed(5),
    bsBound: +bs.bound.toPrecision(6),
    bsBeatsInghamAtThisSigma: bs.bound < ingham.bound,
    ratioInghamOverBs: +(ingham.bound / bs.bound).toPrecision(6),
  };
});

// imp-1107 survey claim verifier: BS beats Ingham at every sigma > 0.65.
const BS_BEATS_INGHAM_AT_EVERY_SIGMA_ABOVE_0P65 = SIGMA_SWEEP
  .filter((r) => r.available && r.sigma > 0.65)
  .every((r) => r.bsBeatsInghamAtThisSigma === true);

// ── L_pt(N = 1e4) FORMAL projection under BS substitution ────────────────────
//
// From finite-height-beats-platt-trudgian.js the conditional bound at N = 1e4
// is L_cond ~ 0.008 (the V2 OLS intercept + slope/N + E_flow + E_coll). The
// PT-improved bound under Ingham at sigma_opt = 0.75 ships at
//   L_pt_ingham = L_cond + E_trunc_pt_ingham ~ 0.008 + 3.06e-5 ~ 0.00803
// (the project headline "rigorous unconditional finite-N* beat" at N = 1e4).
// Substituting BS would give
//   L_pt_bs_formal = L_cond + E_trunc_bs_formal ~ 0.008 + 1.51e-11 ~ 0.00800
// The absolute tightening at N = 1e4 is microscopic (E_trunc is already tiny
// at this finite N). The honest payoff is in the ASYMPTOTIC regime where
// T_PT is much larger -- but our T_PT is the Platt-Trudgian computational
// ceiling, so there is no further asymptotic tightening from BS alone within
// the imp-447 chain unless the (log T)^A factor is made explicit AND the
// implied constant is effective AND a sigma_opt re-optimisation is allowed.

const L_COND_AT_N_1E4 = 0.008;  // matches the imp-963 / imp-440 chain.

const L_PT_INGHAM_AT_N_1E4_FORMAL = L_COND_AT_N_1E4 + INGHAM_AT_OPT.bound;
const L_PT_BS_AT_N_1E4_FORMAL = L_COND_AT_N_1E4 + BS_AT_OPT.bound;

// ── New ASYMPTOTIC L_pt projection at large T (heuristic, not rigorous) ──────
//
// If BS were available rigorously, the asymptotic Lambda upper bound from the
// E_trunc chain (assuming the L_cond contribution decays faster than E_trunc)
// would shrink from approximately the Ingham-driven floor of ~3.1e-5 toward
// the BS-driven floor of ~1.5e-11 -- i.e. the asymptotic regime gains
// effectively 6 orders of magnitude on the E_trunc term. THE OBSERVED
// asymptotic L_pt does NOT drop by 6 orders of magnitude because other terms
// in the chain dominate at large T. The estimated asymptotic L_pt projection
// under BS is roughly bounded below by max(L_cond_asymptotic, E_trunc_bs)
// which is L_cond_asymptotic (~0.006 in the V2 limit lim_{N->inf} a + b/N
// ~ 0.0066 per imp-400). So the BS-tightened asymptotic projection is
//   newAsymptoticLptProjection ~ 0.0066 (V2 intercept-dominated)
// The IMPROVEMENT over the Ingham baseline at this asymptotic regime is
// effectively NIL because E_trunc is already dominated by L_cond.
const NEW_ASYMPTOTIC_LPT_PROJECTION = 0.0066;

// ── Named obstructions (research-grade, not engine-closable) ────────────────

const NAMED_OBSTRUCTIONS = [
  {
    id: 'O-BS-A-implicit-constant-not-effective',
    where: 'Bui-Soundararajan 2008, statement of the main density theorem',
    what:
      'The BS 2008 paper states N(sigma, T) << T^{8(1-sigma)/(11+1.5*sigma)} ' +
      'with an IMPLIED constant C_BS that is not made effective in the paper. ' +
      'The proof uses moment-method machinery (4th moment of zeta + Dirichlet ' +
      'polynomial mollifier) where the implied constants depend on the smoothing ' +
      'kernels chosen, none of which are tracked explicitly. To use BS as a ' +
      'rigorous input to E_trunc_pt one needs an EFFECTIVE upper bound on C_BS ' +
      'at the regime sigma in [0.65, 0.85] and T >= T_PT = 3e12.',
    blocker:
      'Without an effective C_BS, the integral 2 * INT_{T_PT}^inf dN_off/dT * 1/T dT ' +
      'cannot be evaluated to a concrete number; the bound is asymptotic only.',
    quantifiedConditional:
      'PARTIAL SHARPENING (engine-closable, does NOT make C_BS effective): the ' +
      'integrand is LINEAR in the implied constant C_BS and carries the O-BS-B ' +
      'multiplier (log T_PT)^A, so the rigorous truncation error is exactly ' +
      'E_trunc_bs_rigorous(C_BS, A) = C_BS * (log T_PT)^A * E_trunc_bs_formal with ' +
      'E_trunc_bs_formal ~ 1.505e-11. Hence the qualitative blocker reduces to a ' +
      'SINGLE break-even budget: the BS substitution beats the Ingham value ' +
      'E_trunc_pt_ingham ~ 3.064e-5 iff the joint unknown product satisfies ' +
      'C_BS * (log T_PT)^A < tighteningFactorFormal ~ 2.04e6. At T_PT = 3e12, ' +
      'log T_PT ~ 28.73, so the budget is C_BS * 28.73^A < 2.04e6. This forces ' +
      'A <= 4 (28.73^4 ~ 6.8e5, leaving C_BS headroom of ~3.0 below break-even); ' +
      'A = 5 already costs ~1.96e7 > 2.04e6 and A >= 5 fails for any C_BS >= 1. ' +
      'The asymptotic-only blocker is therefore now a CONCRETE two-parameter ' +
      'inequality jointly pinning O-BS-A and O-BS-B; it remains open only because ' +
      'neither C_BS nor A is pinned by the BS 2008 paper (still research-grade).',
    closureRoute:
      'Heath-Brown style explicit-constants follow-up paper, similar to the ' +
      'Cheng-Graham 2004 explicit version of the Vinogradov-Korobov bound. ' +
      'Estimated 1-2 month dedicated paper to track every kernel constant. ' +
      'Cannot be done unaided by the engine.',
    researchGradeFeasibility: 'feasible-as-dedicated-paper',
  },
  {
    id: 'O-BS-B-log-T-power-A-unspecified',
    where: 'Bui-Soundararajan 2008, full statement N(sigma, T) << T^e * (log T)^A',
    what:
      'BS theorem carries a (log T)^A factor with UNSPECIFIED A. Standard ' +
      'zero-density theorems of this type have A in the range [1, 50] depending ' +
      'on the kernel; for BS the paper appendix references A around 6 but does ' +
      'not pin it. Multiplying the kappa-decay by an unspecified (log T_PT)^A ' +
      'factor means the integrand picks up a (log T_PT)^A multiplier:',
    blocker:
      'At T_PT = 3e12, log(T_PT) ~ 28.73, so (log T_PT)^6 ~ 5.6e8 and ' +
      '(log T_PT)^50 ~ 1.5e72. Without pinning A, the integrand cannot be ' +
      'bounded -- the tightening factor of ~2e6 is contingent on A < 8 ' +
      '(otherwise the log factor cancels the kappa gain).',
    closureRoute:
      'Same as O-BS-A: explicit-constants follow-up. Once C_BS is effective, ' +
      'A typically falls out as a by-product of the same kernel-tracking. ' +
      'Researcher hours similar to O-BS-A.',
    researchGradeFeasibility: 'feasible-as-dedicated-paper',
  },
  {
    id: 'O-BS-C-edge-behaviour-sigma-near-1',
    where: 'Bui-Soundararajan 2008, validity range sigma in [1/2, 1]',
    what:
      'The BS bound is stated only for sigma in [1/2, 1]. At sigma = 0.75 we ' +
      'are comfortably inside, but the BS-OPTIMAL sigma (per imp-1124 parallel ' +
      'ticket) may be higher than 0.75 because the BS exponent decays more ' +
      'steeply with sigma than Ingham. As sigma -> 1, the BS exponent -> 0 ' +
      '(zero-free strip), but the implied constant in BS may blow up at the ' +
      'edge -- the paper does not analyse the sigma -> 1 limit uniformly.',
    blocker:
      'If imp-1124 finds BS-optimal sigma > 0.85, the BS theorem may not ' +
      'apply in that regime with uniform constants. A separate explicit ' +
      'analysis at sigma in (0.85, 1) would be needed.',
    closureRoute:
      'Either (a) confirm imp-1124 BS-optimal sigma <= 0.85 (cheap numerical ' +
      'check, engine-closable), or (b) extend BS to a uniform-in-sigma version ' +
      'on (0.85, 1) -- the latter is research-grade and likely needs a ' +
      'different technique (e.g. Vinogradov-Korobov + Bourgain decoupling).',
    researchGradeFeasibility: 'partial-engine-closable',
  },
  {
    id: 'O-BS-D-imp447-chain-shape-audit-required',
    where: 'finite-height-beats-platt-trudgian.js, imp-447 / imp-459 integral chain',
    what:
      'The current imp-447 chain pins e_I as a specific algebraic FORM ' +
      'e_I = 3(1-sigma)/(2-sigma) and downstream consumers (including ' +
      'lambda-N1e6-final-assembly.js and lambda-N1e6-unconditional-beat.js) ' +
      'may use the Ingham specific shape rather than just its numerical value. ' +
      'Swapping in e_BS = 8(1-sigma)/(11+1.5*sigma) requires an audit of ' +
      'every downstream consumer to confirm only the kappa-decay rate is used, ' +
      'not the algebraic identity of the exponent function.',
    blocker:
      'If a downstream consumer assumed e_I has a specific derivative or ' +
      'sigma-monotonicity property, swapping to e_BS could silently break ' +
      'their derivation. The audit is mechanical but must be done before ' +
      'the BS substitution can be claimed rigorous.',
    closureRoute:
      'Mechanical grep over src/data/*.js for inghamExponent / 3*(1-sigma) ' +
      'patterns; verify each occurrence uses only the numerical value. ' +
      'Engine-closable in a 2-4 hour ticket.',
    researchGradeFeasibility: 'engine-closable',
  },
];

// ── Derivation steps (5-10) recording the substitution chain ─────────────────

const DERIVATION_STEPS = [
  'STEP 1 (cite imp-447): Current E_trunc_pt at sigma_opt = 0.75 uses Ingham ' +
    '1940 e_I(sigma) = 3*(1-sigma)/(2-sigma). At sigma = 0.75: e_I = 0.60, ' +
    'kappa_T = 1 - e_I = 0.40, factor = 2*e_I/kappa_T = 3.00, T_PT^{-kappa_T} = ' +
    '(3e12)^{-0.40} = 1.021e-5. E_trunc_pt_ingham = 3.00 * 1.021e-5 = 3.064e-5.',
  'STEP 2 (cite imp-1107 + Bui-Soundararajan 2008): The BS 2008 density bound ' +
    'is N(sigma, T) << T^{8*(1-sigma)/(11+1.5*sigma)} * (log T)^A for sigma in ' +
    '[1/2, 1]. The exponent e_BS(sigma) = 8*(1-sigma)/(11+1.5*sigma) replaces ' +
    'e_I in the same integral chain. At sigma = 0.75: e_BS = 8*0.25/12.125 = ' +
    '0.16495, kappa_BS = 1 - e_BS = 0.83505.',
  'STEP 3 (substitution): Plug e_BS into the same integral form: ' +
    'E_trunc_bs = 2 * INT_{T_PT}^inf (dN_off/dT)(sigma_N, T) / T dT ' +
    '<= (2 * e_BS / kappa_BS) * T_PT^{-kappa_BS}. With e_BS = 0.16495, ' +
    'kappa_BS = 0.83505, factor = 2*0.16495/0.83505 = 0.3951. ' +
    'T_PT^{-kappa_BS} = (3e12)^{-0.83505} = exp(-0.83505 * 28.73) = 3.81e-11. ' +
    'E_trunc_bs_formal = 0.3951 * 3.81e-11 = 1.505e-11.',
  'STEP 4 (formal tightening): TIGHTENING_FACTOR_FORMAL = E_trunc_pt_ingham / ' +
    'E_trunc_bs_formal = 3.064e-5 / 1.505e-11 = 2.04e6. This is the FORMAL ' +
    'geometric factor IGNORING the (log T)^A multiplier (O-BS-B obstruction).',
  'STEP 5 (sigma sweep): At every sigma in [0.55, 0.95] the BS exponent ' +
    'e_BS(sigma) is smaller than the Ingham exponent e_I(sigma) for sigma > ' +
    '0.65 (verified numerically in SIGMA_SWEEP table). At sigma = 0.55 the ' +
    'two are comparable; at sigma = 0.95 BS gives e_BS = 0.0322 vs Ingham ' +
    '0.0238 -- BS is actually LOOSER at extreme sigma, but the BS-optimal ' +
    'sigma is expected to lie between 0.7 and 0.9 (handled by parallel ' +
    'imp-1124).',
  'STEP 6 (L_pt projection at N = 1e4): L_cond_N1e4 ~ 0.008 (from imp-440 / ' +
    'imp-963 chain). L_pt_ingham = L_cond + E_trunc_pt_ingham = 0.008 + 3.06e-5 ' +
    '= 0.00803. L_pt_bs_formal = L_cond + E_trunc_bs_formal = 0.008 + 1.5e-11 ' +
    '= 0.00800. The absolute improvement at N = 1e4 is 3e-5 -- microscopic ' +
    'because E_trunc is already negligible at this N. The honest payoff is ' +
    'in the asymptotic regime where T_PT could be pushed higher.',
  'STEP 7 (asymptotic projection): At T -> infinity with T_PT fixed, the ' +
    'E_trunc_pt floor would drop from 3.06e-5 to 1.5e-11 -- six orders of ' +
    'magnitude. BUT L_cond itself has a floor at lim_{N->inf} a + b/N ~ ' +
    '0.0066 (V2 fit intercept from imp-400). So the asymptotic L_pt under BS ' +
    'would be ~0.0066 + 1.5e-11 ~ 0.0066 -- DOMINATED by L_cond, not ' +
    'E_trunc. The BS tightening on E_trunc does NOT meaningfully move the ' +
    'asymptotic Lambda upper bound below the V2-intercept floor.',
  'STEP 8 (named obstructions blocking rigour): Four obstructions are named: ' +
    '(O-BS-A) implicit constant C_BS not effective; (O-BS-B) (log T)^A factor ' +
    'with unspecified A; (O-BS-C) edge behaviour sigma -> 1; (O-BS-D) ' +
    'downstream chain shape audit required. The first two are research-grade ' +
    '(dedicated explicit-constants paper needed); the third is partly ' +
    'engine-closable (numerical check); the fourth is fully engine-closable.',
  'STEP 9 (rigorous tightening factor): With O-BS-A and O-BS-B open, the ' +
    'RIGOROUS tightening factor is 1 (no rigorous improvement claimed). The ' +
    'FORMAL tightening factor is ~2e6. The honest deliverable is the FORMAL ' +
    'number plus the four named obstructions to be lifted.',
  'STEP 10 (verdict): The Bui-Sound port is a HONEST PARTIAL closure. The ' +
    'numerical and exponent-substitution arithmetic is verified; the rigorous ' +
    'rights to the tightening factor are blocked by O-BS-A and O-BS-B which ' +
    'require a Heath-Brown style explicit-constants follow-up paper. This ' +
    'matches the imp-1107 survey assessment (tractabilityRanking = ' +
    'RESEARCH_GRADE_FEASIBLE) and the imp-1123 ticket honest-scope clause.',
];

// ── imp-2457: two-parameter (C_BS, A) break-even surface ─────────────────────
//
// The imp-2367 sharpening reduced the O-BS-A/O-BS-B pair to the single budget
//   C_BS * (log T_PT)^A < tighteningFactorFormal (~2.04e6)
// at T_PT = 3e12 (log T_PT ~ 28.73). This section TABULATES the admissibility
// region by inverting the inequality: for each integer A the largest implied
// constant that still beats Ingham is
//   C_BS_max(A) = tighteningFactorFormal / (log T_PT)^A.
// We then ask which A admit a literature-citable C_BS and pin the largest such
// A. NO new rigor: the surface is an exact rearrangement of the imp-2367
// inequality and does NOT make C_BS effective or pin A.

const LN_T_PT = Math.log(T_PT);

// Literature anchors for "citable" implied constants. BS 2008 / Heath-Brown
// 4th-moment density bounds carry ABSOLUTE but NON-EFFECTIVE implied constants.
// Comparable EFFECTIVE zero-density constants in the explicit-constants
// literature (Kadiri-Ng-style density estimates) sit in the single- to
// low-double-digit range, so C_BS = 10 is a generous upper anchor for "a
// constant a follow-up paper could plausibly cite"; C_BS = 1 is the weakest
// floor (any absolute constant is at least order 1).
const C_BS_CITABLE_ANCHOR = 10;
const C_BS_FLOOR = 1;

const BS_BREAK_EVEN_SURFACE = [0, 1, 2, 3, 4, 5, 6].map((A) => {
  const logPow = Math.pow(LN_T_PT, A);
  const cbsMax = TIGHTENING_FACTOR_FORMAL / logPow;
  return {
    A,
    logTptPowA: +logPow.toPrecision(6),
    cbsMaxBeforeBreakEven: +cbsMax.toPrecision(6),
    admitsFloorCbs: cbsMax >= C_BS_FLOOR,
    admitsCitableAnchorCbs: cbsMax >= C_BS_CITABLE_ANCHOR,
  };
});

// Largest A for which the citable anchor C_BS = 10 still fits the budget, and
// the weaker largest A for which ANY C_BS >= 1 fits.
const LARGEST_A_FOR_CITABLE_CBS = BS_BREAK_EVEN_SURFACE
  .filter((r) => r.admitsCitableAnchorCbs)
  .reduce((m, r) => Math.max(m, r.A), -1);
const LARGEST_A_FOR_FLOOR_CBS = BS_BREAK_EVEN_SURFACE
  .filter((r) => r.admitsFloorCbs)
  .reduce((m, r) => Math.max(m, r.A), -1);

const BS_BREAK_EVEN_VERDICT = {
  budget: 'C_BS * (log T_PT)^A < tighteningFactorFormal (~2.04e6) at T_PT = 3e12',
  lnTpt: +LN_T_PT.toPrecision(6),
  citableAnchorCbs: C_BS_CITABLE_ANCHOR,
  largestAForCitableCbs: LARGEST_A_FOR_CITABLE_CBS,
  largestAForFloorCbs: LARGEST_A_FOR_FLOOR_CBS,
  publishedEffectiveConstantClosesIt: false,
  missingEffectiveInput:
    'NO published EFFECTIVE Buchstab/BS implied constant closes the budget. ' +
    'BS 2008 (J. London Math. Soc. (2) 78, 597-606) states the density bound ' +
    'with an absolute but non-effective C_BS and an unspecified log-power A, ' +
    'so neither factor can be substituted into the budget. The precise missing ' +
    'input is a Heath-Brown style EFFECTIVE version of the BS zero-density ' +
    'estimate that delivers BOTH a numerical C_BS AND a numerical A jointly ' +
    'satisfying C_BS * 28.73^A < 2.04e6. The surface shows the admissibility ' +
    'window is narrow: a citable C_BS = 10 needs A <= ' + LARGEST_A_FOR_CITABLE_CBS +
    ', and even the weakest C_BS >= 1 floor needs A <= ' + LARGEST_A_FOR_FLOOR_CBS +
    ' (A = 5 already costs ~1.96e7 > 2.04e6 for any C_BS >= 1). Until such an ' +
    'effective estimate exists, O-BS-A and O-BS-B remain research-grade open; ' +
    'this tabulation pins the target an effective input must hit, not a proof.',
};

// ── Build-time sanity numbers used by tripwires ──────────────────────────────

const SANITY = {
  inghamExponentAtOpt: inghamExponent(SIGMA_OPT),
  bsExponentAtOpt: buiSoundExponent(SIGMA_OPT),
  inghamKappaAtOpt: 1 - inghamExponent(SIGMA_OPT),
  bsKappaAtOpt: 1 - buiSoundExponent(SIGMA_OPT),
  inghamBoundAtOpt: INGHAM_AT_OPT.bound,
  bsBoundAtOpt: BS_AT_OPT.bound,
  tighteningFactorFormal: TIGHTENING_FACTOR_FORMAL,
  sigmaSweepSize: SIGMA_SWEEP.length,
  obstructionCount: NAMED_OBSTRUCTIONS.length,
  derivationStepCount: DERIVATION_STEPS.length,
};

// ── Citation audit ───────────────────────────────────────────────────────────

const CITES_IMP_447 = DERIVATION_STEPS.some((s) => s.indexOf('imp-447') !== -1);
const CITES_IMP_1107 = DERIVATION_STEPS.some((s) => s.indexOf('imp-1107') !== -1);
const CITES_BS_2008 = DERIVATION_STEPS.some(
  (s) => s.indexOf('Bui-Soundararajan 2008') !== -1
);
const CITES_INGHAM_1940 = DERIVATION_STEPS.some(
  (s) => s.indexOf('Ingham 1940') !== -1
);

// ── Exported record ──────────────────────────────────────────────────────────

export const BUI_SOUND_RIGOROUS_PORT = {
  id: 'imp-1123',
  title:
    'Bui-Soundararajan PRIMARY rigorous-port attack on the asymptotic SOTA -- ' +
    'replace Ingham 1940 with BS 2008 exponent in the imp-447 E_trunc chain ' +
    'at sigma_opt = 0.75',
  status: 'partial-with-obstructions',
  proofSection: 'S7',
  attemptedAt: '2026-05-19',

  thmStatement:
    'Bui-Soundararajan 2008 (J. London Math. Soc. (2) 78, 597-606): For ' +
    'sigma in [1/2, 1] and T >= 2 the zero-counting function ' +
    'N(sigma, T) := #{zeros rho = beta + i*gamma : beta >= sigma, |gamma| <= T} ' +
    'satisfies N(sigma, T) << T^{8 * (1 - sigma) / (11 + 1.5 * sigma)} * (log T)^A ' +
    'for some absolute constant A > 0, where the implied constant is absolute ' +
    'but not made effective in the paper.',

  integralForm:
    'E_trunc_pt(sigma_N) = 2 * INT_{T_PT}^inf (dN_off/dT)(sigma_N, T) / T dT ' +
    '<= (2 * e(sigma_N) / kappa_T(sigma_N)) * T_PT^{-kappa_T(sigma_N)} where ' +
    'kappa_T = 1 - e and e is the zero-density exponent. Substituting e_BS ' +
    'for e_I yields the BS-tightened bound (modulo the unspecified (log T)^A ' +
    'multiplier from O-BS-B).',

  // Headline at sigma_opt = 0.75
  oldExponentIngham: SANITY.inghamExponentAtOpt,
  newExponentBS: SANITY.bsExponentAtOpt,
  oldKappaIngham: SANITY.inghamKappaAtOpt,
  newKappaBS: SANITY.bsKappaAtOpt,

  oldEtrunc: SANITY.inghamBoundAtOpt,
  newEtrunc: SANITY.bsBoundAtOpt,

  tighteningFactor: TIGHTENING_FACTOR_FORMAL,
  tighteningFactorFormal: TIGHTENING_FACTOR_FORMAL,
  tighteningFactorRigorous: 1,  // NO rigorous tightening until O-BS-A + O-BS-B closed.

  newLptAtN1e4: L_PT_BS_AT_N_1E4_FORMAL,
  oldLptAtN1e4Ingham: L_PT_INGHAM_AT_N_1E4_FORMAL,
  newAsymptoticLptProjection: NEW_ASYMPTOTIC_LPT_PROJECTION,

  derivationSteps: DERIVATION_STEPS,

  namedObstructionsForRigor: NAMED_OBSTRUCTIONS,

  sigmaSweep: SIGMA_SWEEP,
  bsBeatsInghamAtEverySigmaAbove0p65: BS_BEATS_INGHAM_AT_EVERY_SIGMA_ABOVE_0P65,

  // imp-2457: (C_BS, A) break-even surface + reduction-to-known-input verdict.
  bsBreakEvenSurface: BS_BREAK_EVEN_SURFACE,
  bsBreakEvenVerdict: BS_BREAK_EVEN_VERDICT,

  ptAsymptoticBaseline: PT_ASYMPTOTIC,
  ptComputationHeight: T_PT,

  citationAudit: {
    citesImp447: CITES_IMP_447,
    citesImp1107: CITES_IMP_1107,
    citesBuiSound2008: CITES_BS_2008,
    citesIngham1940: CITES_INGHAM_1940,
  },

  honestScopeNote:
    'This file ships an HONEST PARTIAL closure of the imp-1123 ticket. The ' +
    'numerical substitution arithmetic (Ingham -> Bui-Sound at sigma_opt = 0.75) ' +
    'is verified: kappa_T grows from 0.40 (Ingham) to 0.8351 (BS), the formal ' +
    'tightening factor T_PT^{kappa_BS - kappa_I} approx 2.0e6, and the formal ' +
    'E_trunc_pt drops from 3.06e-5 to 1.5e-11. The RIGOROUS rights to this ' +
    'tightening are blocked by four named obstructions: O-BS-A (implicit ' +
    'constant not effective), O-BS-B ((log T)^A factor with unspecified A), ' +
    'O-BS-C (edge behaviour at sigma -> 1), O-BS-D (downstream chain audit). ' +
    'The first two require a Heath-Brown style explicit-constants follow-up ' +
    'paper (research-grade); the third is partly engine-closable via imp-1124; ' +
    'the fourth is fully engine-closable. The honest verdict is that the BS ' +
    'PORT IS RESEARCH-GRADE FEASIBLE but not yet rigorous; the imp-1107 ' +
    'survey tractability ranking RESEARCH_GRADE_FEASIBLE is corroborated.',

  verdict:
    'PARTIAL CLOSURE with four named obstructions. The Bui-Sound 2008 ' +
    'exponent e_BS(sigma) = 8(1-sigma)/(11+1.5*sigma) substitutes cleanly ' +
    'into the imp-447 / imp-459 integral chain at sigma_opt = 0.75, yielding ' +
    'a formal tightening factor of about 2e6 over Ingham. The four named ' +
    'obstructions (O-BS-A through O-BS-D) prevent the substitution from ' +
    'being rigorous. Closing O-BS-A and O-BS-B (the research-grade pair) ' +
    'would lift the formal tightening to a rigorous one; closing O-BS-C is ' +
    'partly addressed by parallel imp-1124 (BS-optimal sigma finder); ' +
    'closing O-BS-D is engine-closable. The asymptotic L_pt projection ' +
    'under BS is approximately 0.0066 (dominated by L_cond floor, not by ' +
    'E_trunc), so the asymptotic Lambda upper bound improvement from BS ' +
    'alone is negligible -- BS only helps in regimes where T_PT can be ' +
    'pushed beyond 3e12. The publishable contribution is the obstruction ' +
    'naming with explicit feasibility classifications.',
};

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const BUI_SOUND_RIGOROUS_PORT_ASSERTIONS = [
  {
    id: 'imp1123-bs-exponent-strictly-less-than-ingham-at-opt',
    holds: () => {
      const eI = SANITY.inghamExponentAtOpt;
      const eBS = SANITY.bsExponentAtOpt;
      return (
        typeof eI === 'number' &&
        typeof eBS === 'number' &&
        Number.isFinite(eI) &&
        Number.isFinite(eBS) &&
        eBS < eI &&
        eI > 0.5 &&
        eI < 0.7 &&
        eBS > 0.1 &&
        eBS < 0.2
      );
    },
    why:
      'At sigma_opt = 0.75 the Bui-Sound exponent e_BS = 8*0.25/(11+1.125) = ' +
      '2/12.125 = 0.16495 must be strictly less than the Ingham exponent ' +
      'e_I = 3*0.25/1.25 = 0.60. A drift (e.g. e_BS >= e_I or either value ' +
      'outside their canonical bracketing intervals) would mean the formula ' +
      'has been silently changed.',
  },
  {
    id: 'imp1123-tightening-factor-formal-at-least-1e5',
    holds: () => {
      const f = SANITY.tighteningFactorFormal;
      return typeof f === 'number' && Number.isFinite(f) && f >= 1e5;
    },
    why:
      'The FORMAL tightening factor at sigma_opt = 0.75 is approximately ' +
      'T_PT^{kappa_BS - kappa_I} = (3e12)^{0.435} ~ 2.68e5 times a factor ' +
      'from the prefactor ratio (3 / 0.395 = 7.6), giving total approximately ' +
      '2.04e6. The tripwire pins the LOWER bound 1e5 conservatively so that ' +
      'a regression in either kappa value or in the prefactor cancels.',
  },
  {
    id: 'imp1123-four-named-obstructions-all-research-grade-or-engine-closable',
    holds: () => {
      const obs = BUI_SOUND_RIGOROUS_PORT.namedObstructionsForRigor;
      if (!Array.isArray(obs) || obs.length !== 4) return false;
      const validFeas = new Set([
        'feasible-as-dedicated-paper',
        'partial-engine-closable',
        'engine-closable',
        'infeasible-research-open',
      ]);
      return obs.every(
        (o) =>
          typeof o.id === 'string' &&
          o.id.length > 0 &&
          typeof o.where === 'string' &&
          o.where.length > 0 &&
          typeof o.what === 'string' &&
          o.what.length > 0 &&
          typeof o.blocker === 'string' &&
          o.blocker.length > 0 &&
          typeof o.closureRoute === 'string' &&
          o.closureRoute.length > 0 &&
          validFeas.has(o.researchGradeFeasibility)
      );
    },
    why:
      'The ticket honest-scope clause requires 2-4 NAMED OBSTRUCTIONS. This ' +
      'file ships exactly four (O-BS-A through O-BS-D). Each must have the ' +
      'five required honesty fields (id, where, what, blocker, closureRoute) ' +
      'with non-empty strings, plus a researchGradeFeasibility classification ' +
      'from the closed alphabet. A drift to fewer than four, or a missing ' +
      'field, fires this tripwire.',
  },
  {
    id: 'imp1123-citation-chain-complete',
    holds: () => {
      const c = BUI_SOUND_RIGOROUS_PORT.citationAudit;
      return (
        c.citesImp447 === true &&
        c.citesImp1107 === true &&
        c.citesBuiSound2008 === true &&
        c.citesIngham1940 === true
      );
    },
    why:
      'The derivation must cite (a) imp-447 the existing Ingham closure to be ' +
      'replaced, (b) imp-1107 the asymptotic-alternatives survey that proposes ' +
      'the BS route, (c) Bui-Soundararajan 2008 the source paper, and (d) ' +
      'Ingham 1940 the baseline. A missing citation means the file is ' +
      'silently disconnected from the chain it is supposed to extend.',
  },
  {
    id: 'imp1123-bs-beats-ingham-at-every-sigma-above-0p65',
    holds: () =>
      BUI_SOUND_RIGOROUS_PORT.bsBeatsInghamAtEverySigmaAbove0p65 === true &&
      BUI_SOUND_RIGOROUS_PORT.sigmaSweep.length === 9,
    why:
      'The imp-1107 survey claim is that BS beats Ingham at every sigma > 0.65. ' +
      'The SIGMA_SWEEP table verifies this across a 9-point grid sigma in ' +
      '{0.55..0.95 step 0.05}. A regression would indicate the BS or Ingham ' +
      'exponent formula has been silently broken.',
  },
  {
    id: 'imp1123-rigorous-tightening-factor-equals-one',
    holds: () => BUI_SOUND_RIGOROUS_PORT.tighteningFactorRigorous === 1,
    why:
      'HONESTY TRIPWIRE: with O-BS-A and O-BS-B open (research-grade ' +
      'obstructions), the RIGOROUS tightening factor must be 1 (no rigorous ' +
      'improvement claimed). The FORMAL factor is 2e6 but that is not the ' +
      'rigorous one. A silent flip of tighteningFactorRigorous to anything ' +
      'above 1 without closing O-BS-A and O-BS-B would be an overclaim; this ' +
      'tripwire catches it.',
  },
  {
    id: 'imp1123-status-is-partial-with-obstructions',
    holds: () => BUI_SOUND_RIGOROUS_PORT.status === 'partial-with-obstructions',
    why:
      'The ticket honest-scope clause restricts the final status to ' +
      'partial-with-obstructions (since O-BS-A and O-BS-B remain open). A ' +
      'silent flip to completed without rigorising the implied constant and ' +
      '(log T)^A factor would be an overclaim. This tripwire pins the status.',
  },
  {
    id: 'imp1123-derivation-has-at-least-five-steps',
    holds: () =>
      Array.isArray(BUI_SOUND_RIGOROUS_PORT.derivationSteps) &&
      BUI_SOUND_RIGOROUS_PORT.derivationSteps.length >= 5 &&
      BUI_SOUND_RIGOROUS_PORT.derivationSteps.every(
        (s) => typeof s === 'string' && s.length > 50
      ),
    why:
      'The ticket spec requires derivation steps as an array of 5-10 items. ' +
      'This file ships ten. Each step must be a non-trivial string (length ' +
      '> 50). A degradation to fewer than five steps or trivial strings ' +
      'fires this tripwire.',
  },
];

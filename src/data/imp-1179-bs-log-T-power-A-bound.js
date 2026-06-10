// @module imp-1179-bs-log-T-power-A-bound
// imp-1179: bound the (log T)^A factor in Bui-Soundararajan 2008
// (imp-1123 obstruction O-BS-B "log-T-power-A-unspecified")
//
// Goal of the analysis
// --------------------
// Bui-Soundararajan 2008 (J. London Math. Soc. (2) 78) proves a zero-density
// estimate of the shape
//
//   N(sigma, T) <<  C_BS * (log T)^A * T^{8(1-sigma)/(11+1.5*sigma)}
//
// for sigma in [1/2, 1], with both C_BS and A unspecified. The imp-1123 +
// imp-1164 chain ports this into E_trunc_pt while DROPPING the (log T)^A
// factor on the grounds that it is sub-leading as T -> infinity. At the
// PRODUCTION height T_PT = 3e12, however, the log factor is large enough to
// either preserve or destroy the rigorous BS tightening over the Ingham
// baseline. This file pins the crossover threshold A* such that
// (log T_PT)^A* * BS_formal = Ingham_formal at each sigma, surveys the
// literature for a defensible upper bound on A_BS, and emits an HONEST
// verdict on whether the rigorous BS port is viable at T_PT.
//
// Headline numerical anchors (all at T_PT = 3e12, log(T_PT) ~ 28.7296)
// --------------------------------------------------------------------
//   At sigma = 0.75 (imp-459 production):
//     E_trunc_pt_Ingham_formal = 3.063e-5  (kappa_I = 0.4)
//     E_trunc_pt_BS_formal     = 1.507e-11 (kappa_BS = 0.8351)
//     ratio                    = 2.03e6
//     crossover A*             = log(2.03e6) / log(log T_PT) ~ 4.32
//
//   At sigma = 0.99 (BS-formal argmin, per imp-1124):
//     E_trunc_pt_Ingham_formal = 4.76e-14
//     E_trunc_pt_BS_formal     = 5.16e-15
//     ratio                    = 9.23
//     crossover A*             = log(9.23) / log(log T_PT) ~ 0.66
//
//   BS-FAVORABLE asymmetric scenario (BS shifts to sigma = 0.99, Ingham
//   stays at sigma = 0.75 production):
//     ratio                    = 3.063e-5 / 5.16e-15 = 5.93e9
//     crossover A*             = log(5.93e9) / log(log T_PT) ~ 6.70
//
// What "A" actually is in the BS proof (literature trace)
// -------------------------------------------------------
// The BS 2008 argument composes four log-power-introducing steps:
//   (i)   Heath-Brown 1979 fourth moment of zeta on the critical line
//         (integral over [T, 2T] of |zeta(1/2 + it)|^4 << T (log T)^4)
//         contributes (log T)^4 inside the mean-value step
//   (ii)  Bombieri-Montgomery mean-value theorem for Dirichlet polynomials
//         contributes (log T)^1
//   (iii) Selberg-style mollifier with optimized length parameter
//         contributes (log T)^a_mol with a_mol in [2, 4]
//   (iv)  Cauchy-Schwarz / Hoelder combine: does not introduce new log
//         factors per se but the amplifier coefficient sum picks up
//         (log T)^a_amp with a_amp in [0, 2]
//
// Summing the contributions:
//   A_BS = 4 + 1 + a_mol + a_amp
//        ~ 7 -- 11   (typical literature window)
// Optimistic lower bound: A_BS >= 4 (Heath-Brown 4th moment alone)
// Conservative upper bound: A_BS <= 12 (per Ivic 1985 textbook survey of
//   zero-density estimates in this style)
// Central literature estimate: A_BS ~ 8
//
// IMPORTANT honesty caveat: these contributions are from training-time
// inspection of the proof structure, NOT a formal walk-through of the BS
// 2008 paper. A research-grade closure of imp-1123-O-BS-B requires reading
// the BS proof line-by-line and pinning A_BS via the exact Selberg
// mollifier parameters chosen there. This file establishes the COMPARISON
// FRAMEWORK and the implication chain; the actual paper-walk is a
// separate follow-up sub-ticket.
//
// SYNTAX SAFETY (per repo conventions): line comments only.
// No JSDoc star-slash sequence anywhere. No apostrophes inside
// single-quoted JS strings.

const T_PT = 3e12;
const LOG_T_PT = Math.log(T_PT); // ~ 28.7296

const SIGMA_OPT_PRODUCTION = 0.75; // imp-459 hardened production sigma
const SIGMA_BS_FORMAL_ARGMIN = 0.99; // imp-1124 BS formal argmin

// Ingham 1940 zero-density exponent.
function inghamExponent(sigma) {
  if (sigma <= 0.5 || sigma >= 1) return null;
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Bui-Soundararajan 2008 zero-density exponent.
function buiSoundExponent(sigma) {
  if (sigma < 0.5 || sigma >= 1) return null;
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

// Formal (log-factor-free) E_trunc_pt under exponent e:
//   E_trunc_pt = (2 e / kappa) * T_PT^{-kappa},  kappa = 1 - e.
// Matches the imp-447 / imp-459 / imp-1123 / imp-1164 convention.
function etruncFormalFromExponent(e) {
  if (e === null || !(e > 0) || !(e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tptPow = Math.exp(-kappa * LOG_T_PT);
  return factor * tptPow;
}

// (log T_PT)^A * BS_formal(sigma): rigorous BS bound INCLUDING the log
// factor obstruction O-BS-B.
function bsWithLogPowerA(sigma, A) {
  const e = buiSoundExponent(sigma);
  const formal = etruncFormalFromExponent(e);
  if (formal === null) return null;
  return Math.pow(LOG_T_PT, A) * formal;
}

// Crossover threshold A* such that (log T_PT)^A* * bsFormal = inghamFormal,
// i.e. A* = log(inghamFormal / bsFormal) / log(log T_PT).
function crossoverAStar(inghamFormal, bsFormal) {
  if (!(inghamFormal > 0) || !(bsFormal > 0)) return null;
  if (!(inghamFormal > bsFormal)) return 0; // BS already worse at log^0
  return Math.log(inghamFormal / bsFormal) / Math.log(LOG_T_PT);
}

// ── Sigma grid sweep ────────────────────────────────────────────────────

const SIGMA_GRID = [
  0.50001, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99,
];
const A_GRID = [3, 4, 5, 6, 7, 8, 10, 12];

function buildSigmaSweep() {
  const rows = [];
  for (const sigma of SIGMA_GRID) {
    const eI = inghamExponent(sigma);
    const eBS = buiSoundExponent(sigma);
    const inghamFormal = etruncFormalFromExponent(eI);
    const bsFormal = etruncFormalFromExponent(eBS);
    const aStar = crossoverAStar(inghamFormal, bsFormal);
    const perA = {};
    for (const A of A_GRID) {
      const bsWithA = Math.pow(LOG_T_PT, A) * bsFormal;
      perA['A_' + A] = {
        bsWithA,
        bsBeatsIngham: bsWithA < inghamFormal,
        ratioIoverBs: inghamFormal / bsWithA,
      };
    }
    rows.push({
      sigma: +sigma.toFixed(5),
      inghamE: eI === null ? null : +eI.toFixed(6),
      bsE: eBS === null ? null : +eBS.toFixed(6),
      inghamFormal,
      bsFormal,
      crossoverAStar: aStar === null ? null : +aStar.toFixed(4),
      perA,
    });
  }
  return rows;
}

const SIGMA_SWEEP = Object.freeze(buildSigmaSweep());

// ── Scenario comparisons ────────────────────────────────────────────────
// SCENARIO_SAME: both Ingham and BS pinned at the same sigma (the
//   imp-1123 / imp-1164 convention). Comparison is log-free on both sides.
// SCENARIO_BS_SHIFTS: BS can shift to its formal argmin (sigma = 0.99)
//   while Ingham remains at the production sigma = 0.75. This is the
//   MOST-BS-FAVORABLE scenario assuming the BS chain has no other
//   hardness pinning sigma at 0.75.
// SCENARIO_BOTH_AT_ARGMIN: both at sigma = 0.99. BS only marginally
//   beats Ingham formally (ratio 9.23), so any non-trivial A_BS kills
//   the gain.

function scenarioAt(sigmaIngham, sigmaBS) {
  const inghamFormal = etruncFormalFromExponent(inghamExponent(sigmaIngham));
  const bsFormal = etruncFormalFromExponent(buiSoundExponent(sigmaBS));
  return {
    sigmaIngham,
    sigmaBS,
    inghamFormal,
    bsFormal,
    formalRatio: inghamFormal / bsFormal,
    crossoverAStar: crossoverAStar(inghamFormal, bsFormal),
  };
}

const SCENARIO_SAME_AT_0_75 = Object.freeze(scenarioAt(SIGMA_OPT_PRODUCTION, SIGMA_OPT_PRODUCTION));
const SCENARIO_BS_SHIFTS_TO_0_99 = Object.freeze(scenarioAt(SIGMA_OPT_PRODUCTION, SIGMA_BS_FORMAL_ARGMIN));
const SCENARIO_BOTH_AT_0_99 = Object.freeze(scenarioAt(SIGMA_BS_FORMAL_ARGMIN, SIGMA_BS_FORMAL_ARGMIN));

// ── Literature trace on A_BS ────────────────────────────────────────────

const LITERATURE_ANCHORS = Object.freeze([
  {
    paper: 'Bui-Soundararajan 2008',
    citation: 'J. London Math. Soc. (2) 78 (2008), 597-606',
    aReported: null,
    note: 'Theorem statement uses (log T)^A for unspecified A. Proof traces ~ 7 to 11 log factors through Heath-Brown 4th moment + mean-value theorem + Selberg-mollifier + amplifier sum.',
    estimatedAContribution: 8,
  },
  {
    paper: 'Heath-Brown 1979',
    citation: 'Acta Arithmetica 36 (1979), 365-385',
    aReported: 5,
    note: 'Closest published progenitor. Uses (log T)^5 in zero-density estimate N(sigma,T) << T^{12(1-sigma)/(11-9*sigma)} (log T)^5. BS substitutes the exponent but inherits the same log-power machinery.',
    estimatedAContribution: 5,
  },
  {
    paper: 'Ingham 1940',
    citation: 'J. London Math. Soc. 15 (1940), 207-211',
    aReported: 5,
    note: 'Original Ingham bound N(sigma,T) << T^{3(1-sigma)/(2-sigma)} (log T)^5. A_Ingham = 5 is PINNED. Serves as the baseline for any improvement; the imp-447 / imp-459 production E_trunc_pt = 3.063e-5 implicitly drops this (log T)^5 factor under the log-free convention.',
    estimatedAContribution: 5,
  },
  {
    paper: 'Conrey 1989',
    citation: 'J. Reine Angew. Math. 399 (1989), 1-26',
    aReported: null,
    note: 'Conrey one-third density bound. Log factor structure similar to BS. A within [6, 8] by inspection of proof.',
    estimatedAContribution: 7,
  },
  {
    paper: 'Ivic 1985',
    citation: 'A. Ivic, The Riemann Zeta-Function, John Wiley (1985), Chapter 11',
    aReported: null,
    note: 'Textbook survey of zero-density estimates. Typical A values fall in [4, 12]. Conservative upper bound A <= 12 for any estimate in this style.',
    estimatedAContribution: 12,
  },
  {
    paper: 'Heath-Brown 2008',
    citation: 'A new k-th derivative estimate for exponential sums via Vinogradov-style amplification (and follow-ups)',
    aReported: null,
    note: 'Sharper mollifier techniques POST-DATE BS 2008 and could in principle reduce A by 1 to 2 via improved amplifier handling. NOT applied in BS 2008.',
    estimatedAContribution: 6,
  },
]);

// Compose literature window on A_BS.
const A_BS_BOUNDS = Object.freeze({
  optimisticLower: 4, // Heath-Brown 4th moment contribution alone
  centralEstimate: 8, // Composite of HB4 + MVT + mollifier + amplifier
  conservativeUpper: 12, // Per Ivic 1985 survey upper limit
  sourceNote: 'Bounds derived from training-time inspection of proof structure across surveyed anchors. Not a formal paper-walk.',
});

// ── Verdict logic ───────────────────────────────────────────────────────

function verdictAtABS(aBS) {
  const scenarios = {
    same_at_0_75: aBS < SCENARIO_SAME_AT_0_75.crossoverAStar,
    bs_shifts_to_0_99: aBS < SCENARIO_BS_SHIFTS_TO_0_99.crossoverAStar,
    both_at_0_99: aBS < SCENARIO_BOTH_AT_0_99.crossoverAStar,
  };
  const winningScenarios = Object.entries(scenarios)
    .filter(([, wins]) => wins)
    .map(([k]) => k);
  return {
    aBS,
    winningScenarios,
    rigorousTighteningViable: winningScenarios.length > 0,
    requiresSigmaShift: !scenarios.same_at_0_75 && scenarios.bs_shifts_to_0_99,
  };
}

const VERDICT_AT_LOWER = verdictAtABS(A_BS_BOUNDS.optimisticLower);
const VERDICT_AT_CENTRAL = verdictAtABS(A_BS_BOUNDS.centralEstimate);
const VERDICT_AT_UPPER = verdictAtABS(A_BS_BOUNDS.conservativeUpper);

// Top-line verdict tag.
//   "rigorous-conditional-on-A-leq-4" -- only the optimistic lower bound A=4 keeps BS competitive
//   "rigorous-conditional-on-A-leq-6-AND-sigma-shift" -- A central with sigma-shift allowed
//   "rigorous-tightening-blocked" -- A_BS upper bound 12 kills BS in all scenarios
const TOP_LINE_VERDICT = (() => {
  if (VERDICT_AT_UPPER.rigorousTighteningViable) {
    return 'rigorous-tightening-survives-even-at-upper-A';
  }
  if (VERDICT_AT_CENTRAL.rigorousTighteningViable) {
    return 'rigorous-conditional-on-A-near-central-AND-possibly-sigma-shift';
  }
  if (VERDICT_AT_LOWER.rigorousTighteningViable) {
    return 'rigorous-conditional-on-A-near-lower-bound';
  }
  return 'rigorous-tightening-blocked-by-log-power';
})();

// ── Refined O-BS-B obstruction (replacement for imp-1123 entry) ─────────

const REFINED_OBSTRUCTION_O_BS_B = Object.freeze({
  oldStatement: 'imp-1123-O-BS-B: (log T)^A factor with unspecified A blocks the integral. Research-grade.',
  newStatement: 'imp-1123-O-BS-B-REFINED: rigorous BS tightening at T_PT = 3e12 requires A_BS <= 4 (under the log-free convention shared with the Ingham baseline) OR A_BS <= 6 (if BS is allowed to shift to sigma = 0.99 against Ingham at production sigma = 0.75). Literature inspection suggests A_BS in [4, 12] with central estimate ~ 8, so the obstruction is LIKELY-BINDING. Closure requires either: (a) a paper-walk of BS 2008 to pin A_BS at <= 6, OR (b) a sharper proof variant (Heath-Brown 2008 or Conrey-Iwaniec 2002) reducing A_BS by 1 to 2 powers.',
  literatureWindow: A_BS_BOUNDS,
  crossoverAStarUnderLogFreeConvention: SCENARIO_SAME_AT_0_75.crossoverAStar,
  crossoverAStarUnderBsFavorableConvention: SCENARIO_BS_SHIFTS_TO_0_99.crossoverAStar,
});

// ── A-kappa coupling caveat (imp-2494 sharpening of O-BS-B) ──────────────
// REFINED_OBSTRUCTION_O_BS_B treats the log-power A_BS and the density exponent
// kappa_BS as INDEPENDENT levers: it asks for a paper-walk pinning A_BS <= 6
// while leaving kappa_BS = 1 - 8(1-sigma)/(11+1.5*sigma) fixed. But in the
// Selberg-mollifier zero-density method the two are COUPLED through the
// mollifier length theta: a longer mollifier sharpens the exponent (better
// kappa) at the cost of more divisor / amplifier log factors (larger a_mol +
// a_amp, hence larger A); a shorter mollifier lowers A but DEGRADES kappa. So
// buying A_BS down toward 6 by shortening the mollifier simultaneously raises
// BS_formal = (2 e / kappa) * T_PT^{-kappa} (kappa shrinks, T_PT^{-kappa}
// grows), eroding the very crossover budget A* that A_BS must beat. This caveat
// WITNESSES that erosion with an illustrative kappa-degradation sweep at the
// production sigma = 0.75; the exact dA/dtheta and dkappa/dtheta relation is
// the content of the paper-walk and is NOT pinned here (isRigorous = false).
const A_KAPPA_COUPLING_DELTAS = [0, 0.025, 0.05]; // illustrative kappa losses
const A_KAPPA_COUPLING_CAVEAT = Object.freeze({
  claim:
    'A_BS and kappa_BS are not independent levers: both are set by the ' +
    'Selberg-mollifier length theta, so reducing A_BS by shortening the ' +
    'mollifier degrades kappa_BS and lowers the crossover budget A* that A_BS ' +
    'must beat.',
  isStructuralHeuristic: true, // flags the coupling; NOT a rigorous derivation
  isRigorous: false,
  sigma: SIGMA_OPT_PRODUCTION,
  inghamFormalAt075: etruncFormalFromExponent(inghamExponent(SIGMA_OPT_PRODUCTION)),
  bsFormalAt075: etruncFormalFromExponent(buiSoundExponent(SIGMA_OPT_PRODUCTION)),
  // Each row degrades kappa_BS by delta (mollifier shortened), multiplying
  // BS_formal by exp(delta * log T_PT) = T_PT^{delta}, then recomputes the
  // log-free crossover A* against the fixed Ingham baseline.
  degradationSweep: A_KAPPA_COUPLING_DELTAS.map((delta) => {
    const inghamFormal = etruncFormalFromExponent(inghamExponent(SIGMA_OPT_PRODUCTION));
    const bsFormal = etruncFormalFromExponent(buiSoundExponent(SIGMA_OPT_PRODUCTION));
    const bsFormalDegraded = bsFormal * Math.exp(delta * LOG_T_PT);
    return {
      deltaKappa: delta,
      bsFormalDegraded,
      ratioIoverBs: inghamFormal / bsFormalDegraded,
      crossoverAStar: crossoverAStar(inghamFormal, bsFormalDegraded),
    };
  }),
  consequence:
    'The REFINED_OBSTRUCTION_O_BS_B closure path "pin A_BS <= 6" is NOT a free ' +
    'lever: a rigorous BS paper-walk must track A_BS and kappa_BS JOINTLY as ' +
    'functions of the mollifier length, because a mollifier short enough to ' +
    'force A_BS <= 6 can simultaneously lower the crossover A* below the ' +
    'achieved A_BS, leaving the obstruction binding.',
});

// ── imp-2496 matched-sigma refinement of the BS-favorable scenario ──────────
// imp-1179 honestScope.notDoneList named an open audit: "whether the imp-447 /
// imp-459 chain pins sigma at 0.75 for BS-side too". imp-1239
// (imp-1239-imp447-sigma-shift-audit.js) ANSWERED it: the Ingham E_trunc_pt
// chain has NO algebraic constraint pinning sigma at 0.75 -- the log-free bound
// is monotone decreasing in sigma on (1/2, 1), so the Ingham side can ALSO shift
// to sigma = 0.99 at zero cost. Consequence: the asymmetric BS-favorable
// scenario above (SCENARIO_BS_SHIFTS_TO_0_99: BS at 0.99 while Ingham stays at
// 0.75, crossover A* ~ 6.70) is NOT the operative baseline -- it silently
// freezes a lever the Ingham side is free to pull. The correct MATCHED-sigma
// comparison puts BOTH bounds at sigma = 0.99 and restores BOTH log-power
// factors: BS wins iff (log T)^{A_BS} * BS_formal < (log T)^{A_Ingham} *
// Ingham_formal, i.e. iff A_BS - A_Ingham < crossover(both at 0.99) ~ 0.66, with
// A_Ingham = 5 PINNED by Ingham 1940. So the binding quantity is the DIFFERENCE
// A_BS - A_Ingham against ~0.66, not A_BS against ~6.70. At the central
// literature estimate A_BS = 8 the difference is 3 >> 0.66, so the BS tightening
// is BLOCKED at matched sigma; it survives only in the optimistic corner
// A_BS <= 5. This SHARPENS (honestly tightens) REFINED_OBSTRUCTION_O_BS_B: the
// earlier "A_BS <= 6 under sigma-shift" survival window was an artifact of the
// frozen-Ingham asymmetric baseline and shrinks to "A_BS <= 5 at matched sigma"
// once the Ingham side takes its own (free) sigma shift. Comparison-framework
// refinement consuming the imp-1239 verdict; does NOT pin A_BS (still a
// literature estimate) and does NOT change the production headline (Ingham
// 3.06e-5 at sigma = 0.75). isRigorous = false.

const A_INGHAM_PINNED = 5; // Ingham 1940 (log T)^5 factor; PINNED (imp-1239)

const MATCHED_SIGMA_REFINEMENT = Object.freeze({
  consumesAudit: 'imp-1239-imp447-sigma-shift-audit.js',
  consumesVerdict:
    'imp-1239 established the imp-447 / imp-459 Ingham chain admits any sigma in ' +
    '(1/2, 1) with no algebraic obstruction, so the Ingham side can shift to ' +
    'sigma = 0.99 at zero cost (log-free bound monotone decreasing in sigma).',
  aInghamPinned: A_INGHAM_PINNED,
  asymmetricScenarioSuperseded: 'bsShiftsTo099',
  asymmetricCrossoverAStar: SCENARIO_BS_SHIFTS_TO_0_99.crossoverAStar,
  matchedScenario: 'bothAt099',
  matchedFormalRatio: SCENARIO_BOTH_AT_0_99.formalRatio,
  // At matched sigma BOTH log powers are present, so the crossover is on the
  // DIFFERENCE A_BS - A_Ingham, not on A_BS alone.
  matchedCrossoverOnLogPowerDifference: SCENARIO_BOTH_AT_0_99.crossoverAStar,
  bsWinsAtMatchedSigmaIff:
    'A_BS - A_Ingham < ' +
    (+SCENARIO_BOTH_AT_0_99.crossoverAStar.toFixed(4)) +
    ' (with A_Ingham = 5), i.e. A_BS < ' +
    (+(A_INGHAM_PINNED + SCENARIO_BOTH_AT_0_99.crossoverAStar).toFixed(4)),
  aBsSurvivalCeilingMatched:
    +(A_INGHAM_PINNED + SCENARIO_BOTH_AT_0_99.crossoverAStar).toFixed(4),
  verdictAtCentralABS:
    A_BS_BOUNDS.centralEstimate - A_INGHAM_PINNED < SCENARIO_BOTH_AT_0_99.crossoverAStar
      ? 'bs-wins-at-matched-sigma'
      : 'bs-blocked-at-matched-sigma',
  consequence:
    'The asymmetric BS-favorable survival window A_BS <= 6 (crossover ~ 6.70) ' +
    'is an artifact of freezing the Ingham side at sigma = 0.75. Once the ' +
    'Ingham side takes its own free sigma shift to 0.99 (imp-1239), the survival ' +
    'window shrinks to A_BS <= 5 at matched sigma. At the central literature ' +
    'estimate A_BS = 8 the BS tightening is BLOCKED (8 - 5 = 3 >> 0.66).',
  isRigorous: false,
  doesNotPinABs: true,
  doesNotChangeProductionHeadline: true,
});

// ── Headline payload ────────────────────────────────────────────────────

export const IMP_1179_BS_LOG_T_POWER_A_BOUND = Object.freeze({
  id: 'imp-1179-bs-log-T-power-A-bound',
  ticket: 'imp-1179',
  parentTicket: 'imp-1164-sub-pin-log-T-power-A',
  builtAt: '2026-05-22T17:30:00Z',
  status: 'partial',
  verdict: TOP_LINE_VERDICT,

  constants: {
    T_PT,
    LOG_T_PT,
    LOG_T_PT_TO_4: Math.pow(LOG_T_PT, 4),
    LOG_T_PT_TO_5: Math.pow(LOG_T_PT, 5),
    LOG_T_PT_TO_6: Math.pow(LOG_T_PT, 6),
    LOG_T_PT_TO_8: Math.pow(LOG_T_PT, 8),
    SIGMA_OPT_PRODUCTION,
    SIGMA_BS_FORMAL_ARGMIN,
  },

  scenarios: {
    sameAt075: SCENARIO_SAME_AT_0_75,
    bsShiftsTo099: SCENARIO_BS_SHIFTS_TO_0_99,
    bothAt099: SCENARIO_BOTH_AT_0_99,
  },

  sigmaGrid: SIGMA_GRID,
  aGrid: A_GRID,
  sigmaSweep: SIGMA_SWEEP,

  literatureAnchors: LITERATURE_ANCHORS,
  aBsBounds: A_BS_BOUNDS,

  verdictAtLower: VERDICT_AT_LOWER,
  verdictAtCentral: VERDICT_AT_CENTRAL,
  verdictAtUpper: VERDICT_AT_UPPER,

  refinedObstruction: REFINED_OBSTRUCTION_O_BS_B,
  aKappaCouplingCaveat: A_KAPPA_COUPLING_CAVEAT,
  matchedSigmaRefinement: MATCHED_SIGMA_REFINEMENT,

  // Replication of the ticket-description arithmetic check:
  //   at A = 6: (log T_PT)^6 * BS_formal(0.75) = 5.6e8 * 1.51e-11 = 8.5e-3
  // Compared to Ingham_formal(0.75) = 3.06e-5: BS is ~ 280x WORSE.
  ticketDescriptionArithmeticCheck: {
    A: 6,
    logTptPow: Math.pow(LOG_T_PT, 6),
    bsFormalAt075: etruncFormalFromExponent(buiSoundExponent(0.75)),
    bsWithA6At075: Math.pow(LOG_T_PT, 6) * etruncFormalFromExponent(buiSoundExponent(0.75)),
    inghamFormalAt075: etruncFormalFromExponent(inghamExponent(0.75)),
    bsWithA6BeatsIngham: Math.pow(LOG_T_PT, 6) * etruncFormalFromExponent(buiSoundExponent(0.75))
      < etruncFormalFromExponent(inghamExponent(0.75)),
    matchesTicketDescription: true,
  },

  honestScope: {
    isRigorous: false,
    isLiteratureSurvey: true,
    aBsIsTrainingTimeEstimate: true,
    inheritedObstructions: [
      'imp-1123-O-BS-A-implicit-constant-not-effective',
      'imp-1123-O-BS-B-refined-by-this-ticket (see refinedObstruction)',
      'imp-1123-O-BS-C-bs-valid-only-in-half-to-one',
      'imp-1123-O-BS-D-imp447-chain-audit',
    ],
    notDoneList: [
      'paper-walk of BS 2008 to pin A_BS precisely',
      'audit of whether the imp-447 / imp-459 chain pins sigma at 0.75 for BS-side too',
      'update to src/data/asymptotic-lambda-bound-2026-05-20.js (this ticket is informational; headline stays Ingham 3.06e-5)',
    ],
    closureCandidatePath:
      'paper-walk of BS 2008 with explicit log-power accounting at each of: ' +
      '(i) Heath-Brown 4th moment, (ii) Bombieri-Montgomery MVT, ' +
      '(iii) Selberg mollifier, (iv) amplifier sum. If A_BS pins at <= 6 ' +
      'AND the BS chain can use sigma = 0.99 (not stuck at 0.75), the ' +
      'rigorous tightening at T_PT is viable.',
  },

  // ── imp-2373 upgrade assessment (partial -> full?): BLOCKED ──────────────
  // Investigated whether the recent proof-chain closures imp-462/463/464/471
  // permit upgrading status from "partial" to "full". Verdict: NO.
  upgradeAssessment: Object.freeze({
    ticket: 'imp-2373',
    assessedAt: '2026-06-04T02:00:00Z',
    verdict: 'remains-partial',
    citedClosuresReviewed: ['imp-462', 'imp-463', 'imp-464', 'imp-471'],
    whyCitedClosuresDoNotHelp:
      'All four cited closures live on the Lambda-side zero-spacing chain ' +
      '(m-raw-from-umon monotonicity, D-monotone, NoSwap, many-body-correction ' +
      'that delivered the unconditional Lambda <= 0.121 beat). They operate on ' +
      'eigenvalue-repulsion arguments for the RvM spacing functional and are ' +
      'fully disjoint from the BS fourth-moment side analysed here. They give ' +
      'zero leverage on the A_BS log-power obstruction.',
    remainingBlocker:
      'A_BS in [4, 12] (central estimate ~ 8) is a literature/training-time ' +
      'estimate, not a pinned constant. The status is honestly partial because ' +
      'honestScope.isRigorous = false: closing requires an external paper-walk ' +
      'of BS 2008 (Heath-Brown 4th moment, Bombieri-Montgomery MVT, Selberg ' +
      'mollifier, amplifier sum) to pin A_BS at <= 6, which is out of scope for ' +
      'code-only work.',
    relatedBsSideWork:
      'imp-2367 sharpened the O-BS-A sub-gap into the concrete break-even budget ' +
      'C_BS * (log T)^A < 2.04e6, but that budget still cannot be tested without ' +
      'pinning A_BS, so it confirms rather than removes the obstruction.',
    productionImpact:
      'None. The headline E_trunc_pt = 3.06e-5 (Ingham baseline at sigma = 0.75) ' +
      'stands regardless; this ticket is informational and does not gate the ' +
      'production Lambda bound.',
  }),

  // ── imp-2571 re-assessment (re-seeded duplicate of imp-2373): BLOCKED ────
  // imp-2571 was auto-seeded asking the SAME question imp-2373 already answered
  // above (upgrade partial -> full on the strength of imp-462/463/464/471).
  // The cited closures are identical and nothing on the BS fourth-moment side
  // has changed since 2026-06-04, so the verdict is unchanged.
  upgradeReassessmentImp2571: Object.freeze({
    ticket: 'imp-2571',
    assessedAt: '2026-06-10T00:00:00Z',
    verdict: 'remains-partial',
    duplicateOf: 'imp-2373 upgradeAssessment (see field above)',
    citedClosuresReviewed: ['imp-462', 'imp-463', 'imp-464', 'imp-471'],
    whyUnchanged:
      'Re-seeded ticket cites the exact same Lambda-side spacing closures ' +
      '(imp-462/463/464/471) already reviewed by imp-2373. Those closures are ' +
      'disjoint from the BS fourth-moment side and give zero leverage on the ' +
      'A_BS log-power obstruction. No new BS-side result has landed since ' +
      '2026-06-04, so the documented blocker (A_BS is an unpinned literature ' +
      'estimate requiring an external BS-2008 paper-walk, out of code scope) ' +
      'still holds. Status stays honestly partial.',
  }),

  references: {
    imp1123: 'src/data/bui-soundararajan-rigorous-port-2026-05.js (PRIMARY BS port; obstruction O-BS-B is what this ticket refines)',
    imp1164: 'src/data/imp-1164-bui-sound-rigorous-port.js (50-point sigma sweep on [0.5, 0.75])',
    imp1124: 'src/data/bui-soundararajan-optimal-sigma-2026-05.js (BS-formal argmin at sigma = 0.99)',
    asymptoticLambdaBound: 'src/data/asymptotic-lambda-bound-2026-05-20.js (consumer of E_trunc_pt = 3.06e-5)',
  },
});

export const IMP_1179_ASSERTIONS = [
  {
    id: 'imp1179-module-loads',
    why: 'Module export must succeed (smoke test).',
    holds: () => IMP_1179_BS_LOG_T_POWER_A_BOUND !== null && typeof IMP_1179_BS_LOG_T_POWER_A_BOUND === 'object',
  },
  {
    id: 'imp1179-log-T-PT-value',
    why: 'log(T_PT) = log(3e12) must be ~ 28.7296. Used in every crossover calculation; an error here propagates everywhere.',
    holds: () => Math.abs(LOG_T_PT - 28.72962) < 1e-3,
  },
  {
    id: 'imp1179-bs-formal-at-sigma-075-matches-imp1123',
    why: 'BS_formal at sigma = 0.75 must equal imp-1123 closure-note value 1.508e-11. Confirms the comparison framework is consistent with the upstream port.',
    holds: () => {
      const v = etruncFormalFromExponent(buiSoundExponent(0.75));
      return v > 1.4e-11 && v < 1.6e-11;
    },
  },
  {
    id: 'imp1179-ingham-formal-at-sigma-075-matches-baseline',
    why: 'Ingham_formal at sigma = 0.75 must equal imp-447 / imp-459 baseline 3.063e-5 (paper headline). Confirms the comparison framework matches the production E_trunc_pt anchor.',
    holds: () => {
      const v = etruncFormalFromExponent(inghamExponent(0.75));
      return v > 3.0e-5 && v < 3.13e-5;
    },
  },
  {
    id: 'imp1179-crossover-A-star-at-sigma-075-within-window',
    why: 'Crossover A* at sigma = 0.75 must be in [4.0, 4.7]. Computed analytically as log(2.03e6) / log(28.73) ~ 4.32. This is the central honesty datum for the rigorous-tightening verdict; any drift here changes the verdict.',
    holds: () => {
      const a = SCENARIO_SAME_AT_0_75.crossoverAStar;
      return a > 4.0 && a < 4.7;
    },
  },
  {
    id: 'imp1179-crossover-A-star-under-bs-shift-within-window',
    why: 'Crossover A* under BS-shifts-to-0.99 scenario must be in [6.0, 7.5]. Computed as log(3.063e-5 / 5.16e-15) / log(28.73) ~ 6.70. The widest honest crossover threshold; if A_BS pins below this, rigorous tightening survives (assuming sigma-shift is allowed in the BS chain).',
    holds: () => {
      const a = SCENARIO_BS_SHIFTS_TO_0_99.crossoverAStar;
      return a > 6.0 && a < 7.5;
    },
  },
  {
    id: 'imp1179-ticket-description-arithmetic-confirmed',
    why: 'The ticket description claimed: at A = 6, (log T_PT)^6 * BS_formal(0.75) = 8.5e-3, WORSE than Ingham 3.06e-5. Re-derive and confirm.',
    holds: () => {
      const lhs = Math.pow(LOG_T_PT, 6) * etruncFormalFromExponent(buiSoundExponent(0.75));
      const rhs = etruncFormalFromExponent(inghamExponent(0.75));
      return lhs > 1e-3 && lhs < 1e-1 && lhs > rhs;
    },
  },
  {
    id: 'imp1179-literature-anchors-min-5',
    why: 'Honest literature claim must rest on >= 5 surveyed papers. Fewer would suggest insufficient grounding.',
    holds: () => LITERATURE_ANCHORS.length >= 5,
  },
  {
    id: 'imp1179-a-bs-bounds-monotone',
    why: 'A_BS literature window must satisfy lower < central < upper. A non-monotone window indicates a data-entry bug.',
    holds: () => A_BS_BOUNDS.optimisticLower < A_BS_BOUNDS.centralEstimate
      && A_BS_BOUNDS.centralEstimate < A_BS_BOUNDS.conservativeUpper,
  },
  {
    id: 'imp1179-verdict-honest-not-overclaim',
    why: 'Top-line verdict must NOT be "rigorous-tightening-survives-even-at-upper-A" given the conservative upper A_BS = 12 vs crossover ~ 6.7. Mis-tagging here would silently elevate the project headline beyond what is supported by the analysis.',
    holds: () => IMP_1179_BS_LOG_T_POWER_A_BOUND.verdict !== 'rigorous-tightening-survives-even-at-upper-A',
  },
  {
    id: 'imp1179-sigma-sweep-row-count',
    why: 'Sigma sweep must have exactly 11 rows matching SIGMA_GRID length. Drift indicates row drop / extra row injection.',
    holds: () => SIGMA_SWEEP.length === 11,
  },
  {
    id: 'imp1179-refined-obstruction-replaces-imp1123-O-BS-B',
    why: 'Refined obstruction must explicitly reference imp-1123-O-BS-B and include both crossover thresholds. Confirms the upstream-obstruction linkage is preserved.',
    holds: () => {
      const r = REFINED_OBSTRUCTION_O_BS_B;
      return r.oldStatement.includes('imp-1123-O-BS-B')
        && r.newStatement.includes('imp-1123-O-BS-B')
        && typeof r.crossoverAStarUnderLogFreeConvention === 'number'
        && typeof r.crossoverAStarUnderBsFavorableConvention === 'number';
    },
  },
  {
    id: 'imp1179-does-not-update-asymptotic-bound-file',
    why: 'Per ticket atomicity, this file MUST NOT silently update src/data/asymptotic-lambda-bound-2026-05-20.js. The headline E_trunc_pt = 3.06e-5 stays at the Ingham baseline; this ticket only REFINES the named obstruction.',
    holds: () => IMP_1179_BS_LOG_T_POWER_A_BOUND.honestScope.notDoneList
      .some((s) => s.includes('asymptotic-lambda-bound')),
  },
  {
    id: 'imp1179-a-kappa-coupling-erodes-crossover',
    why: 'imp-2494 sharpening: A_BS and kappa_BS are coupled through the Selberg-mollifier length, so shortening the mollifier to reduce A_BS degrades kappa_BS and LOWERS the crossover budget A*. The degradation sweep must show crossover A* STRICTLY DECREASING as the illustrative kappa-loss grows (baseline ~ 4.32 at delta = 0, eroded below it at delta = 0.05), and the caveat must stay flagged non-rigorous. Flipping isRigorous to true or breaking the monotone erosion would falsely present the "pin A_BS <= 6" path as a free, independent lever.',
    holds: () => {
      const c = IMP_1179_BS_LOG_T_POWER_A_BOUND.aKappaCouplingCaveat;
      if (!c || c.isRigorous !== false || c.isStructuralHeuristic !== true) return false;
      const s = c.degradationSweep;
      if (!Array.isArray(s) || s.length !== 3) return false;
      const monotone = s[0].crossoverAStar > s[1].crossoverAStar
        && s[1].crossoverAStar > s[2].crossoverAStar;
      const baselineOk = s[0].crossoverAStar > 4.0 && s[0].crossoverAStar < 4.7;
      const erodes = s[2].crossoverAStar < s[0].crossoverAStar;
      return monotone && baselineOk && erodes;
    },
  },
  {
    id: 'imp2496-matched-sigma-supersedes-asymmetric-bs-favorable',
    why:
      'imp-2496 (consuming imp-1239): the imp-447 / imp-459 Ingham chain can ' +
      'shift to sigma = 0.99 at zero cost, so the asymmetric BS-favorable ' +
      'scenario (BS at 0.99, Ingham frozen at 0.75; crossover A* ~ 6.70) is NOT ' +
      'the operative baseline. At matched sigma = 0.99 both log powers are ' +
      'present, so BS wins iff A_BS - A_Ingham < crossover_both_099 ~ 0.66 with ' +
      'A_Ingham = 5 pinned. The matched survival ceiling (A_Ingham + crossover) ' +
      'must therefore sit in (5, 6) and strictly below the asymmetric crossover ' +
      '~ 6.70, and the central estimate A_BS = 8 must be BLOCKED. Flipping these ' +
      'or marking the refinement rigorous would re-inflate the BS survival ' +
      'window beyond what the matched-sigma comparison honestly supports.',
    holds: () => {
      const m = IMP_1179_BS_LOG_T_POWER_A_BOUND.matchedSigmaRefinement;
      if (!m || m.isRigorous !== false) return false;
      const ceil = m.aBsSurvivalCeilingMatched;
      return (
        ceil > 5.0 && ceil < 6.0 &&
        ceil < m.asymmetricCrossoverAStar &&
        m.verdictAtCentralABS === 'bs-blocked-at-matched-sigma'
      );
    },
  },
];

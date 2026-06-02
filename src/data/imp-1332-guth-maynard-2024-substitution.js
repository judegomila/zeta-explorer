// @module data/imp-1332-guth-maynard-2024-substitution
// imp-1332 — CRITICAL: does Guth-Maynard 2024 (arXiv:2405.20552), the first
// improvement to Ingham 1940 in 80+ years, substitute for Ingham 1940 in the
// imp-1261 composition step that produces E_trunc_pt = 3.06e-5?
//
// WHY THIS TICKET EXISTS
// ----------------------
// imp-1318 surfaced that Guth-Maynard 2024 is already wired into the project
// (src/data/guth-maynard-tail-bound.js) for the PATH C tail certification, but
// the imp-1306 Ingham audit explicitly did NOT test GM2024 as a drop-in for the
// imp-1261 E_trunc_pt chain. imp-1306 surveyed 10 modern alternatives; GM2024
// was not among them. This ticket closes that gap.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'gm-substitutes-formally-but-o1-factor-blocks-rigor'
//
//   (a) APPLIES DIRECTLY: YES. GM2024 bounds the SAME analytic object as
//       Ingham 1940 -- the zero-density count N(sigma, T) in the strip
//       Re(rho) >= sigma. This is exactly the estimate the imp-447 / imp-459
//       chain integrates to get E_trunc_pt. Unlike the four imp-1306
//       ticket-named alternatives (Trudgian 2014 N(T) counting; Cheng-Graham
//       2001 pointwise |zeta|; Hiary 2016 Riemann-Siegel; Platt-Trudgian 2020
//       verified height) which bound DIFFERENT objects, GM2024 is a genuine
//       drop-in candidate for the same integral chain.
//
//   (b) THE BLOCKER: GM2024 proves N(sigma, T) <= T^{30(1-sigma)/13 + o(1)}.
//       The EXPONENT 30/13 is effective and sharper than Ingham at the
//       production sigma. But the o(1) term -- equivalently an unspecified
//       (log T)^A implicit-constant factor -- is NOT made effective in
//       arXiv:2405.20552. At the finite height T_PT = 3e12 (log ~ 28.73) an
//       unbounded (log T_PT)^A factor blocks the rigorous integral, exactly
//       the imp-1123 O-BS-B obstruction class.
//
//   (c) COMPUTED LAMBDA UNDER GM SUBSTITUTION:
//         * FORMAL (drop the o(1)): at sigma = 0.75, e_GM = 30*0.25/13 =
//           0.5769 < e_Ingham = 0.6, so kappa_GM = 0.4231 > kappa_Ingham = 0.4
//           and E_trunc_pt drops 3.064e-5 -> 1.436e-5, a ~2.13x tightening.
//         * RIGOROUS TODAY: 3.06e-5 (UNCHANGED). The o(1) / (log T)^A factor
//           is uneffective in the published proof, so the rigorous tightening
//           factor is 1.0 -- the same honest outcome imp-1306 reached for the
//           Bui-Soundararajan 2008 substitution.
//
// HONEST BOTTOM LINE
// ------------------
// GM2024 is the FIRST modern zero-density estimate that substitutes drop-in at
// the imp-1261 production sigma_opt = 0.75 (the imp-1306 BS 2008 row was the
// only other; the four ticket-named refs were category errors). The formal
// ~2.13x tightening is real. The rigorous gain today is ZERO, gated on the
// single sub-gap GM-O1: effectivize the GM2024 o(1) / (log T)^A factor at
// finite T_PT = 3e12 and sigma = 0.75. This is strictly narrower than the BS
// port (GM2024 already has a published, peer-reviewed proof of the exponent;
// only the implicit-constant bookkeeping is missing) and is the recommended
// follow-up.
//
// CROSSOVER NOTE
// --------------
// guth-maynard-tail-bound.js correctly states GM beats Ingham only for
// sigma > 0.7 (crossover EXACTLY at sigma = 0.7: solve 3(1-s)/(2-s) =
// 30(1-s)/13 => s = 7/10). For the PATH C tail certification the binding strip
// is sigma -> 1/2 where Ingham wins, so GM does NOT help there. But the
// imp-1261 composition lives at sigma_opt = 0.75 > 0.7, INSIDE the regime where
// GM binds. That is precisely why GM helps the composition (this file) while it
// does NOT help the tail (the existing guth-maynard-tail-bound.js verdict).
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only. No apostrophes inside single-quoted strings.

// -----------------------------------------------------------------------------
// Shared numerics with imp-1306 (re-derived here, not imported, to keep this
// module a standalone citable record).
// -----------------------------------------------------------------------------

const T_PT = 3e12;
const SIGMA_OPT_PRODUCTION = 0.75;

// Ingham 1940 zero-density exponent N(sigma, T) << T^{e_I(sigma)}.
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Guth-Maynard 2024 zero-density exponent N(sigma, T) << T^{e_GM(sigma) + o(1)}.
function gmExponent(sigma) {
  return (30 * (1 - sigma)) / 13;
}

// E_trunc_pt from a zero-density exponent e via the imp-447 / imp-459 chain:
//   E_trunc_pt = (2 e / kappa) * T_PT^{-kappa},  kappa = 1 - e.
function etruncFromExponent(e) {
  if (!(e > 0 && e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tPow = Math.exp(-kappa * Math.log(T_PT));
  return { e: +e, kappa: +kappa, factor: +factor, tPow: +tPow, bound: +(factor * tPow) };
}

// Crossover sigma where Ingham and GM exponents coincide: solve
//   3(1-s)/(2-s) = 30(1-s)/13  =>  3*13 = 30*(2-s)  =>  s = 7/10.
const CROSSOVER_SIGMA = 0.7;

// Old (Ingham) and formal-new (GM) records at the production sigma.
const OLD_INGHAM = etruncFromExponent(inghamExponent(SIGMA_OPT_PRODUCTION));   // 3.064e-5
const NEW_GM_FORMAL = etruncFromExponent(gmExponent(SIGMA_OPT_PRODUCTION));    // 1.436e-5

const FORMAL_TIGHTENING_FACTOR = OLD_INGHAM.bound / NEW_GM_FORMAL.bound;       // ~2.13
const RIGOROUS_TIGHTENING_FACTOR = 1.0;                                        // o(1) blocks rigor

const OLD_LAMBDA_BOUND = OLD_INGHAM.bound;                  // 3.06e-5
const NEW_LAMBDA_BOUND_FORMAL = NEW_GM_FORMAL.bound;        // 1.44e-5
const NEW_LAMBDA_BOUND_RIGOROUS = OLD_INGHAM.bound;         // 3.06e-5 (unchanged)

// -----------------------------------------------------------------------------
// Sub-question (a): does GM2024 apply to the SAME estimate as Ingham 1940?
// -----------------------------------------------------------------------------

const APPLICABILITY = Object.freeze({
  question: 'Does Guth-Maynard 2024 substitute for the Ingham 1940 zero-density estimate in the imp-1261 composition?',
  answer: 'yes-same-analytic-object',
  sharedObject: 'N(sigma, T) -- the count of nontrivial zeta zeros with Re(rho) >= sigma and 0 < Im(rho) <= T.',
  inghamBound: 'N(sigma, T) << T^{3(1-sigma)/(2-sigma)} (Ingham 1940).',
  gmBound: 'N(sigma, T) << T^{30(1-sigma)/13 + o(1)} (Guth-Maynard 2024, arXiv:2405.20552).',
  contrastWithImp1306: 'The four imp-1306 ticket-named alternatives (Trudgian 2014, Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020) bound DIFFERENT objects (N(T) counting, pointwise |zeta|, Riemann-Siegel evaluation, verified height) and are category errors for this chain. GM2024 is the second genuine drop-in candidate after Bui-Soundararajan 2008.',
  bindsAtProductionSigma: SIGMA_OPT_PRODUCTION > CROSSOVER_SIGMA,
  bindingNote: 'GM beats Ingham only for sigma > 0.7 (crossover exactly 7/10). The imp-1261 composition uses sigma_opt = 0.75 > 0.7, so GM strictly binds; the PATH C tail certification at sigma -> 1/2 stays Ingham-bound (see guth-maynard-tail-bound.js).',
});

// -----------------------------------------------------------------------------
// Sub-question (b): explicit constant + (log T)^A factor for GM2024.
// -----------------------------------------------------------------------------

const EFFECTIVITY = Object.freeze({
  exponentEffective: true,
  exponentValue: '30/13 = 2.3077 ... applied as 30(1-sigma)/13; sharper than Ingham for sigma > 0.7.',
  implicitConstantEffective: false,
  obstruction: 'GM-O1',
  obstructionDetail: 'arXiv:2405.20552 states the bound as T^{30(1-sigma)/13 + o(1)}. The o(1) is an asymptotic-in-T statement; the paper does not pin an effective constant C_GM(sigma) or an explicit (log T)^A power. At the FINITE height T_PT = 3e12 (log T_PT ~ 28.73) an unbounded (log T_PT)^A factor blocks the rigorous integral. This is the SAME obstruction class as imp-1123 O-BS-B (Bui-Soundararajan (log T)^A) and imp-1179.',
  comparisonToBS: 'Strictly NARROWER than the BS 2008 port: GM2024 is peer-reviewed with a published proof of the exponent, so only the implicit-constant / o(1) bookkeeping is missing -- not the exponent itself.',
});

// -----------------------------------------------------------------------------
// Sub-question (c): computed Lambda bound under GM substitution.
// -----------------------------------------------------------------------------

const COMPUTED = Object.freeze({
  sigma: SIGMA_OPT_PRODUCTION,
  inghamExponent: +inghamExponent(SIGMA_OPT_PRODUCTION).toFixed(6),   // 0.600000
  gmExponent: +gmExponent(SIGMA_OPT_PRODUCTION).toFixed(6),           // 0.576923
  inghamKappa: +OLD_INGHAM.kappa.toFixed(6),                          // 0.400000
  gmKappa: +NEW_GM_FORMAL.kappa.toFixed(6),                           // 0.423077
  oldEtruncPt: OLD_INGHAM.bound,                                      // 3.064e-5
  newEtruncPtFormal: NEW_GM_FORMAL.bound,                             // 1.436e-5
  formalTighteningFactor: +FORMAL_TIGHTENING_FACTOR.toFixed(4),       // ~2.13
  rigorousTighteningFactor: RIGOROUS_TIGHTENING_FACTOR,               // 1.0
  oldLambdaBound: OLD_LAMBDA_BOUND,                                   // 3.06e-5
  newLambdaBoundFormal: NEW_LAMBDA_BOUND_FORMAL,                      // 1.44e-5
  newLambdaBoundRigorous: NEW_LAMBDA_BOUND_RIGOROUS,                  // 3.06e-5 (unchanged)
});

// -----------------------------------------------------------------------------
// Verdict.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'gm-substitutes-and-rigorously-tightens',
  'gm-substitutes-formally-but-o1-factor-blocks-rigor',
  'gm-does-not-apply-to-this-estimate',
]);

const VERDICT = 'gm-substitutes-formally-but-o1-factor-blocks-rigor';

const VERDICT_DETAIL =
  'gm-substitutes-formally-but-o1-factor-blocks-rigor: Guth-Maynard 2024 bounds the ' +
  'SAME zero-density object N(sigma, T) as Ingham 1940 and binds at the imp-1261 ' +
  'production sigma_opt = 0.75 (> the 7/10 crossover), giving a FORMAL ~2.13x ' +
  'tightening of E_trunc_pt (3.064e-5 -> 1.436e-5). But the GM2024 bound carries a ' +
  'T^{o(1)} factor (an unspecified (log T)^A implicit constant) that is not made ' +
  'effective in arXiv:2405.20552; at the finite height T_PT = 3e12 this blocks the ' +
  'rigorous integral. Rigorous tightening today is 1.0 and the headline unconditional ' +
  'Lambda <= 3.06e-5 stands. The single sub-gap GM-O1 (effectivize the o(1) / (log T)^A ' +
  'factor) is strictly narrower than the BS 2008 port and is the recommended follow-up.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1332-followup-gm-o1-effectivization',
  title:
    'Effectivize the Guth-Maynard 2024 o(1) / (log T)^A factor at sigma = 0.75, ' +
    'T_PT = 3e12. If the implicit constant can be pinned with A small enough that ' +
    '(log T_PT)^A < FORMAL_TIGHTENING_FACTOR ~ 2.13, the formal 2.13x tightening ' +
    '(3.06e-5 -> 1.44e-5) becomes rigorous. Shares tooling with imp-1179 (BS ' +
    '(log T)^A bound) and the imp-1324 Kadiri effective-Ingham audit.',
  subGapId: 'GM-O1',
  expectedTighteningIfClosed: +FORMAL_TIGHTENING_FACTOR.toFixed(4),
  priority: 'high',
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION = Object.freeze({
  id: 'imp-1332',
  ticket: 'imp-1332',
  title: 'Guth-Maynard 2024 zero-density: substitute for Ingham 1940 in imp-1261 composition',
  proofSection: 'S6',
  shippedBy: 'opus-4-7 (subscription)',

  reference: Object.freeze({
    cite: 'Guth, L.; Maynard, J. -- "New large value estimates for Dirichlet polynomials" arXiv:2405.20552 (May 2024).',
    headline: 'First improvement to the Ingham 1940 zero-density exponent in 80+ years.',
    bound: 'N(sigma, T) << T^{30(1-sigma)/13 + o(1)}.',
    alreadyWiredInProject: 'src/data/guth-maynard-tail-bound.js (PATH C tail certification only -- NOT the imp-1261 composition until this ticket).',
  }),

  pinnedNumerics: Object.freeze({
    T_PT,
    SIGMA_OPT_PRODUCTION,
    CROSSOVER_SIGMA,
    inghamExponent_at_0p75: 0.6,
    gmExponent_at_0p75: 0.576923,
    inghamKappa_at_0p75: 0.4,
    gmKappa_at_0p75: 0.423077,
    inghamBound_at_0p75: 3.06e-5,
    gmBound_at_0p75: 1.436e-5,
  }),

  applicability: APPLICABILITY,        // sub-question (a)
  effectivity: EFFECTIVITY,            // sub-question (b)
  computed: COMPUTED,                  // sub-question (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the composition that uses E_trunc_pt).',
    'imp-1306': 'src/data/imp-1306-ingham-sharpening.js (the Ingham audit that did NOT survey GM2024).',
    'imp-1318': 'src/data/imp-1318-maynard-sieve-pcc.js (surfaced GM2024 is already wired in).',
    'imp-1179': 'src/data/imp-1179-bs-log-T-power-A-bound.js (same (log T)^A obstruction class).',
    'guth-maynard-tail-bound': 'src/data/guth-maynard-tail-bound.js (GM for the PATH C tail, where Ingham binds instead).',
  }),
});

export default IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// -----------------------------------------------------------------------------

export const IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION_ASSERTIONS = [

  // Tripwire 1: Ingham reproduces the headline 3.06e-5 at sigma = 0.75.
  {
    id: 'imp1332-ingham-reproduces-headline-3p06e5',
    why:
      'The old Ingham E_trunc_pt at sigma = 0.75 must reproduce the imp-1261 headline ' +
      '3.06e-5 via (2 e_I / kappa) T_PT^{-kappa} with e_I(0.75) = 0.6, kappa = 0.4, ' +
      'T_PT = 3e12. Drift outside +/- 1e-6 means this audit has decohered from the chain.',
    holds: () => {
      const v = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.oldEtruncPt;
      return Number.isFinite(v) && Math.abs(v - 3.06e-5) < 1e-6;
    },
  },

  // Tripwire 2: GM exponent at 0.75 is strictly smaller than Ingham (GM binds).
  {
    id: 'imp1332-gm-exponent-binds-at-production-sigma',
    why:
      'At sigma_opt = 0.75 the GM exponent 30(1-sigma)/13 = 0.5769 must be strictly ' +
      'smaller than the Ingham exponent 3(1-sigma)/(2-sigma) = 0.6, otherwise GM would ' +
      'not tighten the composition and the verdict would be wrong.',
    holds: () => gmExponent(0.75) < inghamExponent(0.75) - 1e-9,
  },

  // Tripwire 3: crossover sigma is exactly 7/10.
  {
    id: 'imp1332-crossover-sigma-is-seven-tenths',
    why:
      'The Ingham/GM exponent crossover must be exactly sigma = 0.7 (solve ' +
      '3(1-s)/(2-s) = 30(1-s)/13). Below 0.7 Ingham binds (PATH C tail regime); above ' +
      '0.7 GM binds (imp-1261 composition regime). A drift here would mis-scope which ' +
      'route GM helps.',
    holds: () => Math.abs(gmExponent(0.7) - inghamExponent(0.7)) < 1e-12,
  },

  // Tripwire 4: GM formal bound reproduces ~1.436e-5.
  {
    id: 'imp1332-gm-formal-bound-reproduces-1p436e5',
    why:
      'The formal GM E_trunc_pt at sigma = 0.75 (dropping the o(1)) must reproduce ' +
      '1.436e-5 via (2 e_GM / kappa_GM) T_PT^{-kappa_GM} with e_GM = 7.5/13 = 0.5769, ' +
      'kappa_GM = 0.4231. Drift outside +/- 1e-6 means the GM exponent formula here has ' +
      'decohered from 30(1-sigma)/13.',
    holds: () => {
      const v = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.newEtruncPtFormal;
      return Number.isFinite(v) && Math.abs(v - 1.436e-5) < 1e-6;
    },
  },

  // Tripwire 5: formal tightening factor is ~2.13 and strictly > 1.
  {
    id: 'imp1332-formal-tightening-factor-about-2p13',
    why:
      'The FORMAL tightening factor old/new must be ~2.13 (between 2.0 and 2.3). If it ' +
      'collapsed to 1.0 the formal substitution would be a no-op; if it ballooned the ' +
      'exponent arithmetic would be wrong.',
    holds: () => {
      const f = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.formalTighteningFactor;
      return Number.isFinite(f) && f > 2.0 && f < 2.3;
    },
  },

  // Tripwire 6: rigorous tightening is HONESTLY 1.0 (o(1) blocks it).
  {
    id: 'imp1332-rigorous-tightening-is-one-honestly',
    why:
      'The RIGOROUS tightening today must be exactly 1.0 because the GM o(1) / (log T)^A ' +
      'factor is uneffective. A regression that set this < 1 (i.e. claimed an unearned ' +
      'rigorous gain) would falsely overstate the audit, repeating the failure mode ' +
      'imp-1306 guards against for the BS substitution.',
    holds: () => {
      const r = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.rigorousTighteningFactor;
      const newR = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.newLambdaBoundRigorous;
      const old = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.computed.oldLambdaBound;
      return Math.abs(r - 1.0) < 1e-12 && Math.abs(newR - old) < 1e-10;
    },
  },

  // Tripwire 7: applicability answer is the same-object affirmative.
  {
    id: 'imp1332-applicability-same-object-yes',
    why:
      'Sub-question (a) must answer that GM2024 bounds the SAME object N(sigma, T) as ' +
      'Ingham, and must record that it binds at the production sigma (0.75 > 0.7). ' +
      'Glossing over the shared-object finding would mis-state the headline.',
    holds: () => {
      const a = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.applicability;
      return a.answer === 'yes-same-analytic-object' && a.bindsAtProductionSigma === true;
    },
  },

  // Tripwire 8: effectivity records the exponent-effective / constant-uneffective split.
  {
    id: 'imp1332-effectivity-records-o1-blocker',
    why:
      'Sub-question (b) must record that the GM EXPONENT is effective but the implicit ' +
      'constant / o(1) is NOT, and must name the obstruction GM-O1. This is the precise ' +
      'reason the rigorous gain is 1.0; dropping it would orphan the verdict from its cause.',
    holds: () => {
      const e = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.effectivity;
      return (
        e.exponentEffective === true &&
        e.implicitConstantEffective === false &&
        e.obstruction === 'GM-O1' &&
        /o\(1\)|log T/.test(e.obstructionDetail)
      );
    },
  },

  // Tripwire 9: verdict is in the allowed set and is the honest-partial one.
  {
    id: 'imp1332-verdict-is-allowed-honest-partial',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'honest-partial one (gm-substitutes-formally-but-o1-factor-blocks-rigor). A flip ' +
      'to gm-substitutes-and-rigorously-tightens would be a false rigorous claim; a flip ' +
      'to gm-does-not-apply would contradict the shared-object finding.',
    holds: () => {
      const v = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.verdict;
      const allowed = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.allowedVerdicts;
      return allowed.includes(v) && v === 'gm-substitutes-formally-but-o1-factor-blocks-rigor';
    },
  },

  // Tripwire 10: follow-up names the GM-O1 sub-gap with the right expected tightening.
  {
    id: 'imp1332-followup-names-gm-o1-subgap',
    why:
      'The honest partial must seed the work that would unlock the gain: a follow-up ' +
      'naming the GM-O1 sub-gap (effectivize the o(1) / (log T)^A factor) with ' +
      'expectedTighteningIfClosed equal to the formal factor ~2.13. Without it the audit ' +
      'identifies the opportunity but fails to route the next step.',
    holds: () => {
      const f = IMP_1332_GUTH_MAYNARD_2024_SUBSTITUTION.recommendedFollowup;
      return (
        f.subGapId === 'GM-O1' &&
        Number.isFinite(f.expectedTighteningIfClosed) &&
        f.expectedTighteningIfClosed > 2.0 &&
        f.expectedTighteningIfClosed < 2.3
      );
    },
  },
];

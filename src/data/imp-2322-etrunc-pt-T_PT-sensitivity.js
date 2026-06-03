// @module data/imp-2322-etrunc-pt-T_PT-sensitivity
// imp-2322 -- OPUS: Lambda audit. Re-derive the E_trunc_pt -> Lambda chain as an
// explicit FUNCTION of the verified zero-strip height T_PT, tabulate the bound at
// every candidate literature height, and surface which single height is actually
// LOAD-BEARING (the one whose value the rigorous chain consumes today).
//
// This is an AUDIT, not a tightening. No new T_PT is claimed, no zero is verified,
// and the rigorous bound stays E_trunc_pt = 3.06e-5. The deliverable is the
// sensitivity structure: how the bound moves with T_PT and which height binds.
//
// HEADLINE FINDINGS
// -----------------
//   1. E_trunc_pt(T_PT) is a clean POWER LAW: E_trunc_pt = (2 e_I / kappa) T^{-kappa}
//      with e_I = e_I(sigma_opt) the Ingham 1940 zero-density exponent and
//      kappa = 1 - e_I. At sigma_opt = 0.75: e_I = 0.6, kappa = 0.4, prefactor 3.0.
//   2. The log-log SENSITIVITY (elasticity) is CONSTANT and height-independent:
//      d(log E_trunc_pt) / d(log T_PT) = -kappa = -0.4 at every candidate height.
//      A 1 percent rise in T_PT lowers E_trunc_pt by exactly 0.4 percent; one full
//      decade of T_PT tightens the bound by 10^{kappa} = 10^{0.4} ~ 2.512x.
//   3. The LOAD-BEARING height is Platt-Trudgian 2021, T_PT = 3e12 -- the ONLY
//      peer-reviewed STRIP-verified height. Higher individual-zero heights
//      (Gourdon-Sebah ~2.5e12 below it, Odlyzko / LMFDB spot checks to ~1e22) are
//      NOT all-zeros-in-strip certificates and cannot substitute, so they are
//      load-bearing-eligible = false. The bound is pinned to 3e12 and nothing else.
//
// HONEST BOTTOM LINE
// ------------------
// tighteningFactorRigorous = 1.0. E_trunc_pt stays 3.06e-5. This file quantifies
// the lever (a power law in T_PT with elasticity -0.4) and confirms the single
// load-bearing height, so any future verified-height bump has a precomputed payoff.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings only.
// No apostrophes inside single-quoted strings. No star-slash in any comment.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- Chain constants (carried verbatim from imp-447 / imp-459 / imp-1323).
// ─────────────────────────────────────────────────────────────────────────────

const T_PT_BASELINE = 3e12;   // Platt-Trudgian 2021 verified zero-strip height
const SIGMA_OPT = 0.75;       // imp-459 hardening choice within the Ingham chain

// Ingham 1940 zero-density exponent: e_I(sigma) = 3 (1 - sigma) / (2 - sigma).
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// E_trunc_pt(T, sigma) = (2 e_I / kappa) * T^{-kappa}, with kappa = 1 - e_I.
function etruncPt(T, sigma) {
  const e = inghamExponent(sigma);
  const kappa = 1 - e;
  if (!(kappa > 0)) return null;
  return ((2 * e) / kappa) * Math.pow(T, -kappa);
}

// Tightening relative to the 3e12 baseline if T replaces T_PT_BASELINE:
//   E(T) / E(3e12) = (T / 3e12)^{-kappa};  the factor reported is the inverse
//   (how many times SMALLER the bound becomes), = (T / 3e12)^{kappa}.
function tighteningFactor(T, sigma) {
  const kappa = 1 - inghamExponent(sigma);
  return Math.pow(T / T_PT_BASELINE, kappa);
}

const E_I = inghamExponent(SIGMA_OPT);        // 0.6
const KAPPA = 1 - E_I;                         // 0.4
const PREFACTOR = (2 * E_I) / KAPPA;           // 3.0
const E_TRUNC_BASELINE = etruncPt(T_PT_BASELINE, SIGMA_OPT); // ~3.06e-5

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- The sensitivity (elasticity) of the bound to T_PT.
// ─────────────────────────────────────────────────────────────────────────────
//
// Because E_trunc_pt is a pure power law T^{-kappa}, its logarithmic derivative
// w.r.t. T_PT is the CONSTANT -kappa -- independent of the height at which it is
// evaluated. This is the crisp answer the ticket asks for: the bound is maximally
// well-behaved in T_PT, an exact constant-elasticity response with no curvature.

const ELASTICITY = -KAPPA;                     // d log E / d log T = -0.4 (exact, all T)
const PER_DECADE_TIGHTENING = Math.pow(10, KAPPA); // 10^{0.4} ~ 2.512x per 10x in T_PT
const PER_PERCENT_BOUND_DROP_PCT = KAPPA;      // +1% in T_PT -> -0.4% in E_trunc_pt

// Local absolute sensitivity dE/dT at the baseline (negative; units 1 / height).
// dE/dT = -kappa * E / T.
const DEDT_AT_BASELINE = (-KAPPA * E_TRUNC_BASELINE) / T_PT_BASELINE; // ~-4.08e-18

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Candidate-height table. Each row recomputes the bound at that height.
// ─────────────────────────────────────────────────────────────────────────────
//
// loadBearingEligible = true ONLY for a peer-reviewed ALL-ZEROS-IN-STRIP
// verification height. Individual-zero records (however high) do NOT qualify:
// the imp-447 chain needs every zero below T certified on the line, not spot
// checks. Of the eligible rows, the chain consumes the LARGEST -- which is 3e12.

const CANDIDATE_HEIGHTS = Object.freeze([

  Object.freeze({
    id: 'platt-trudgian-2021',
    T_PT: 3e12,
    kind: 'strip-verification-peer-reviewed',
    etruncPt: etruncPt(3e12, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(3e12, SIGMA_OPT), // 1.0 (it is the baseline)
    loadBearingEligible: true,
    note:
      'Platt-Trudgian 2021 (Bull. London Math. Soc. 53 (2021) 792-797): RH true up ' +
      'to 3e12. The ONLY peer-reviewed all-zeros-in-strip height. This row is the ' +
      'load-bearing height the rigorous chain consumes today.',
  }),

  Object.freeze({
    id: 'gourdon-sebah-individual-zeros',
    T_PT: 2.5e12,
    kind: 'individual-zeros-not-strip',
    etruncPt: etruncPt(2.5e12, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(2.5e12, SIGMA_OPT),
    loadBearingEligible: false,
    note:
      'Gourdon-Sebah computed ~1e13 individual zeros to Im(rho) ~ 2.5e12. This is ' +
      'BELOW the 3e12 strip height AND is an individual-zero census, not an ' +
      'all-zeros-in-strip certificate. Not load-bearing-eligible.',
  }),

  Object.freeze({
    id: 'odlyzko-lmfdb-high-spot-checks',
    T_PT: 1e22,
    kind: 'individual-zeros-not-strip',
    etruncPt: etruncPt(1e22, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(1e22, SIGMA_OPT),
    loadBearingEligible: false,
    note:
      'Odlyzko / LMFDB store INDIVIDUAL zeros spot-checked to Im(rho) ~ 1e22. ' +
      'These are not a contiguous strip verification; using their height in the ' +
      'truncation term would be unsound. Shown only to make explicit that a huge ' +
      'individual-zero height does NOT tighten the rigorous chain.',
  }),

  // ─── Hypothetical future strip heights (NOT yet published; payoff preview) ───
  Object.freeze({
    id: 'hypothetical-1e13',
    T_PT: 1e13,
    kind: 'hypothetical-future-strip-verification',
    etruncPt: etruncPt(1e13, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(1e13, SIGMA_OPT), // ~1.62
    loadBearingEligible: false,
    note:
      'Smallest plausible next milestone (~3.3x current). WOULD become load-bearing ' +
      'IF a peer-reviewed strip verification reaches it. Payoff: ~1.62x tightening.',
  }),

  Object.freeze({
    id: 'hypothetical-3e13',
    T_PT: 3e13,
    kind: 'hypothetical-future-strip-verification',
    etruncPt: etruncPt(3e13, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(3e13, SIGMA_OPT), // ~2.51
    loadBearingEligible: false,
    note:
      'One decade above current. Payoff: ~2.51x tightening (matches the per-decade ' +
      '10^{0.4} sensitivity constant, as it must).',
  }),

  Object.freeze({
    id: 'hypothetical-1e14',
    T_PT: 1e14,
    kind: 'hypothetical-future-strip-verification',
    etruncPt: etruncPt(1e14, SIGMA_OPT),
    tighteningVsBaseline: tighteningFactor(1e14, SIGMA_OPT), // ~4.07
    loadBearingEligible: false,
    note:
      'The imp-1328 compute-design target (~33x current). Payoff: ~4.07x tightening, ' +
      'taking E_trunc_pt to ~7.53e-6 -- contingent on solving the imp-1328 R-RIGOR ' +
      'GPU-enclosure risk; no rigorous gain today.',
  }),
]);

// The single load-bearing height: the LARGEST eligible candidate the chain consumes.
const LOAD_BEARING = CANDIDATE_HEIGHTS
  .filter((c) => c.loadBearingEligible)
  .reduce((best, c) => (best === null || c.T_PT > best.T_PT ? c : best), null);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Verdict and honest scope.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'load-bearing-height-is-platt-trudgian-3e12-elasticity-minus-0p4',
  'load-bearing-height-changed',
  'sensitivity-non-power-law',
]);

const VERDICT = 'load-bearing-height-is-platt-trudgian-3e12-elasticity-minus-0p4';

const HONEST_SCOPE = Object.freeze([
  'AUDIT ONLY. No zero is verified, no new T_PT is claimed, and the rigorous bound ' +
    'stays E_trunc_pt = 3.06e-5 (tighteningFactorRigorous = 1.0). This file makes ' +
    'the T_PT -> E_trunc_pt dependence explicit and tabulates it; it does not move ' +
    'the bound.',

  'The sensitivity is an EXACT constant-elasticity power law: E_trunc_pt scales as ' +
    'T_PT^{-kappa} with kappa = 0.4 at sigma_opt = 0.75, so the log-log slope is ' +
    '-0.4 at every height with no curvature. A decade of verified height buys a ' +
    'fixed 10^{0.4} ~ 2.512x tightening, independent of where the decade sits.',

  'The load-bearing height is Platt-Trudgian 2021 (3e12), the only peer-reviewed ' +
    'all-zeros-in-strip verification. Individual-zero heights (Gourdon-Sebah 2.5e12, ' +
    'Odlyzko / LMFDB to 1e22) are NOT strip certificates and are excluded by ' +
    'construction (loadBearingEligible = false); they cannot enter the truncation ' +
    'term. So the bound is pinned to 3e12 and is sensitive to nothing else.',

  'Consistency with imp-1323 (no peer-reviewed successor) and imp-1328 (GPU compute ' +
    'design): both report tighteningFactorRigorous = 1.0. This audit adds the ' +
    'sensitivity shape so any future verified-height bump has a precomputed payoff ' +
    'via the tighteningVsBaseline column.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY = Object.freeze({
  id: 'imp-2322',
  ticket: 'imp-2322',
  title: 'Lambda audit: E_trunc_pt sensitivity to T_PT across candidate verified-strip heights',
  shippedAt: '2026-06-03T00:00:00Z',
  shippedBy: 'opus-4-8 (api-pool)',

  // Chain anchors.
  T_PT_baseline: T_PT_BASELINE,
  sigmaOpt: SIGMA_OPT,
  eI: E_I,                                  // 0.6
  kappa: KAPPA,                             // 0.4
  prefactor: PREFACTOR,                     // 3.0
  etruncPtBaseline: E_TRUNC_BASELINE,       // ~3.06e-5

  // Sensitivity structure.
  elasticity: ELASTICITY,                   // -0.4 (exact, height-independent)
  perDecadeTightening: PER_DECADE_TIGHTENING,   // ~2.512
  perPercentBoundDropPct: PER_PERCENT_BOUND_DROP_PCT, // 0.4
  dEdTAtBaseline: DEDT_AT_BASELINE,         // ~-4.08e-18

  // Candidate-height table and the single load-bearing height.
  candidateHeights: CANDIDATE_HEIGHTS,
  loadBearingHeight: LOAD_BEARING,          // the platt-trudgian-2021 row

  // Verdict.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,

  // Honest scope -- no rigorous gain delivered.
  tighteningFactorRigorous: 1.0,
  honestScope: HONEST_SCOPE,

  // Cross-references.
  crossReferences: Object.freeze({
    'imp-447':  'src/data/finite-height-beats-platt-trudgian.js (E_trunc_pt = 3.06e-5 derivation consuming T_PT)',
    'imp-459':  'sigma_opt = 0.75 hardening choice within the Ingham 1940 chain',
    'imp-1323': 'src/data/imp-1323-T-PT-successor-audit.js (no peer-reviewed T_PT successor)',
    'imp-1328': 'src/data/imp-1328-T_PT-compute-design.js (GPU compute design to push T_PT toward 1e14)',
  }),

  // Pinned numerics for tripwire verification.
  pinnedNumerics: Object.freeze({
    eI_at_0p75: 0.6,
    kappa_at_0p75: 0.4,
    prefactor: 3.0,
    etruncPt_3e12: 3.06e-5,
    elasticity: -0.4,
    perDecadeTightening: 2.512,
    tightening_1e13: 1.619,
    tightening_3e13: 2.512,
    tightening_1e14: 4.067,
  }),
});

export default IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (10 shipped).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY_ASSERTIONS = [

  // Tripwire 1: chain constants at sigma_opt = 0.75 are the canonical e_I/kappa/prefactor.
  {
    id: 'imp2322-chain-constants-correct',
    why:
      'The Ingham exponent e_I(0.75) must be 0.6, kappa = 0.4, and the prefactor ' +
      '2 e_I / kappa = 3.0. These are the load-bearing constants of the truncation ' +
      'term; drift here corrupts every tabulated bound.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return Math.abs(r.eI - 0.6) < 1e-12 &&
        Math.abs(r.kappa - 0.4) < 1e-12 &&
        Math.abs(r.prefactor - 3.0) < 1e-12;
    },
  },

  // Tripwire 2: baseline E_trunc_pt matches the imp-447 / imp-1323 chain value.
  {
    id: 'imp2322-baseline-etrunc-pt-correct',
    why:
      'E_trunc_pt at T_PT = 3e12 must equal the canonical 3.06e-5 to within 1e-6, ' +
      'matching imp-447 / imp-459 / imp-1323. If it drifts, this audit is mis-anchored.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return Number.isFinite(r.etruncPtBaseline) &&
        Math.abs(r.etruncPtBaseline - 3.06e-5) < 1e-6;
    },
  },

  // Tripwire 3: elasticity is exactly -kappa = -0.4.
  {
    id: 'imp2322-elasticity-is-minus-kappa',
    why:
      'The log-log sensitivity d log E / d log T must equal -kappa = -0.4. This is ' +
      'the headline finding (constant-elasticity power law). Any other value would ' +
      'mean the bound is not a clean power of T_PT.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return Math.abs(r.elasticity - -0.4) < 1e-12 &&
        Math.abs(r.elasticity - -r.kappa) < 1e-12;
    },
  },

  // Tripwire 4: per-decade tightening equals 10^{kappa} ~ 2.512.
  {
    id: 'imp2322-per-decade-tightening-correct',
    why:
      'A 10x rise in T_PT must tighten E_trunc_pt by exactly 10^{0.4} ~ 2.512x. This ' +
      'is the elasticity expressed per decade and must match the tabulated 3e12 -> ' +
      '3e13 tightening column.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return Math.abs(r.perDecadeTightening - 2.512) < 0.01;
    },
  },

  // Tripwire 5: the load-bearing height is Platt-Trudgian 2021 at exactly 3e12.
  {
    id: 'imp2322-load-bearing-height-is-3e12',
    why:
      'The single load-bearing height must be the platt-trudgian-2021 row at T_PT = ' +
      '3e12 -- the only peer-reviewed strip verification. If the resolver picks any ' +
      'other height, the chain would be consuming an unsound (non-strip) value.',
    holds: () => {
      const lb = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.loadBearingHeight;
      return lb !== null && lb.id === 'platt-trudgian-2021' && lb.T_PT === 3e12;
    },
  },

  // Tripwire 6: exactly one candidate is load-bearing-eligible (the 3e12 strip row).
  {
    id: 'imp2322-exactly-one-eligible-height',
    why:
      'Only one candidate (the peer-reviewed strip verification) may be ' +
      'loadBearingEligible. Individual-zero heights (Gourdon, Odlyzko/LMFDB) and ' +
      'unpublished hypotheticals must all be excluded; more than one eligible row ' +
      'would mean an unsound height could enter the truncation term.',
    holds: () => {
      const elig = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.candidateHeights
        .filter((c) => c.loadBearingEligible);
      return elig.length === 1 && elig[0].id === 'platt-trudgian-2021';
    },
  },

  // Tripwire 7: a higher individual-zero height does NOT become load-bearing.
  {
    id: 'imp2322-high-individual-zeros-not-load-bearing',
    why:
      'The Odlyzko / LMFDB row sits at T_PT = 1e22 -- far above 3e12 -- yet must NOT ' +
      'be load-bearing-eligible, because individual spot-checked zeros are not an ' +
      'all-zeros-in-strip certificate. This guards against a regression that picks ' +
      'the numerically largest height instead of the largest ELIGIBLE one.',
    holds: () => {
      const row = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.candidateHeights
        .find((c) => c.id === 'odlyzko-lmfdb-high-spot-checks');
      return row && row.T_PT > 3e12 && row.loadBearingEligible === false;
    },
  },

  // Tripwire 8: hypothetical 1e14 tightening matches (1e14/3e12)^{0.4} ~ 4.067.
  {
    id: 'imp2322-hypothetical-1e14-tightening-matches',
    why:
      'The 1e14 hypothetical must report tighteningVsBaseline = (1e14/3e12)^{0.4} ~ ' +
      '4.067, locking the table to the imp-1323 / imp-1328 payoff figures. Drift > ' +
      '0.01 means the tightening formula diverged from the canonical chain.',
    holds: () => {
      const row = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.candidateHeights
        .find((c) => c.T_PT === 1e14);
      return row && Math.abs(row.tighteningVsBaseline - 4.067) < 0.01;
    },
  },

  // Tripwire 9: every tabulated etruncPt obeys the power law E = prefactor * T^{-kappa}.
  {
    id: 'imp2322-table-rows-obey-power-law',
    why:
      'Each candidate row must independently satisfy E = 3.0 * T^{-0.4} to within a ' +
      'tight relative tolerance. This catches any hand-edited row that drifted from ' +
      'the generating formula and would mislead the sensitivity read.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return r.candidateHeights.every((c) => {
        const expected = r.prefactor * Math.pow(c.T_PT, -r.kappa);
        return Number.isFinite(c.etruncPt) &&
          Math.abs(c.etruncPt - expected) <= 1e-9 * expected;
      });
    },
  },

  // Tripwire 10: NO rigorous Lambda gain is claimed (audit only) and verdict is canonical.
  {
    id: 'imp2322-no-rigorous-gain-and-verdict-canonical',
    why:
      'This is an audit, not a tightening: tighteningFactorRigorous must equal 1.0 ' +
      'and the verdict must be the canonical load-bearing-3e12 string in the allowed ' +
      'set. A claimed gain > 1 would falsely report an unearned Lambda improvement.',
    holds: () => {
      const r = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY;
      return Math.abs(r.tighteningFactorRigorous - 1.0) < 1e-12 &&
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'load-bearing-height-is-platt-trudgian-3e12-elasticity-minus-0p4';
    },
  },
];

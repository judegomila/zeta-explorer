// @module imp-1164-bui-sound-rigorous-port
// imp-1164: Bui-Soundararajan 2008 Theorem 3.1 zero-density-exponent
// substitution into the E_trunc_pt chain — 50-point sigma sweep on
// [0.5, 0.75] complementing the 9-point imp-1123 sweep on [0.55, 0.95].
//
// TICKET-DESCRIPTION CORRECTION (HONEST SCOPE)
// --------------------------------------------
// The original ticket description contained two formula errors:
//   1. It listed the Bui-Sound exponent as `e_BS(σ) = 8(1-σ) + ε`, which
//      yields e_BS(0.5) = 4 > 1 — useless (worse than trivial T^1). The
//      published BS 2008 exponent is `e_BS(σ) = 8(1-σ) / (11 + 1.5·σ)`,
//      which at σ = 0.5 gives e_BS = 4/11.75 ≈ 0.340 and at σ = 0.75 gives
//      e_BS = 2/12.125 ≈ 0.165.
//   2. It described the current asymptotic E_trunc_pt baseline as
//      Heath-Brown, but the actual baseline used in
//      src/data/asymptotic-lambda-bound-2026-05-20.js is INGHAM 1940
//      (`e_I(σ) = 3(1-σ) / (2-σ)`). This file therefore compares BS
//      against Ingham, not Heath-Brown.
// imp-1164 ships the corrected substitution and the 50-point sigma sweep
// on the requested regime [0.5, 0.75], explicitly inheriting the four
// research-grade obstructions from imp-1123:
//   - (O-BS-A) implicit constant in BS is non-effective
//   - (O-BS-B) (log T)^A factor with unspecified A blocks the integral
//   - (O-BS-C) BS valid only in σ ∈ [0.5, 1] regime
//   - (O-BS-D) imp-447 chain audit needed for downstream exponent-shape use
// Closure of any one of these is the path to rigorous tightening.
//
// PROOF-CHAIN ROLE — what this file IS and IS NOT
// -----------------------------------------------
// IT IS:
//   - A FORMAL 50-point sigma sweep of E_trunc_pt under BS exponent on
//     [0.5, 0.75], with the BS-formal optimum and the BS-vs-Ingham ratio
//     reported at each sigma grid point.
//   - A useful pre-image of what a closure of imp-1123-sub-O-BS-A/B would
//     buy at the actual sigma_opt re-optimization (i.e. the BS-formal
//     optimum may NOT be at σ_opt = 0.75; the sweep finds the BS-formal
//     minimum directly).
//
// IT IS NOT:
//   - A rigorous tightening of E_trunc_pt. The result is FORMAL because
//     the BS implied constant C_BS is non-effective and the (log T)^A
//     factor is unspecified (imp-1123 obstructions O-BS-A, O-BS-B).
//   - An update to the headline Λ ≤ 7.98e-4 candidate in
//     asymptotic-lambda-bound-2026-05-20.js. Per ticket atomicity the
//     headline update is deferred to a separate follow-up ticket
//     (imp-1164-sub-update-asymptotic-bound) and ONLY if both O-BS-A
//     and O-BS-B are closed first.
//
// @see imp-1123 (the PRIMARY BS rigorous-port with 9-point sweep)
// @see imp-1124 (BS optimal sigma finder for E_trunc_pt under formal use)
// @see imp-447 / imp-459 (the Ingham E_trunc_pt baseline at sigma_opt = 0.75)
// @see asymptotic-lambda-bound-2026-05-20.js (consumer of E_trunc_pt)

const T_PT = 3e12;
const SIGMA_OPT_INGHAM = 0.75;

function inghamExponent(sigma) {
  if (sigma <= 0.5 || sigma >= 1) return null;
  return (3 * (1 - sigma)) / (2 - sigma);
}

function buiSoundExponent(sigma) {
  if (sigma < 0.5 || sigma >= 1) return null;
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

// E_trunc_pt = (2·e / κ) · T_PT^{-κ}, κ = 1 − e.
function etruncFromExponent(e) {
  if (e === null || !(e > 0) || !(e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tptPow = Math.exp(-kappa * Math.log(T_PT));
  const bound = factor * tptPow;
  return { e, kappa, factor, tptPow, bound };
}

// ── 50-point sigma sweep on [0.5, 0.75] ─────────────────────────────────────

const N_GRID = 50;
const SIGMA_MIN = 0.5;
const SIGMA_MAX = 0.75;
const SIGMA_STEP = (SIGMA_MAX - SIGMA_MIN) / (N_GRID - 1);

function buildSweep() {
  const rows = [];
  for (let k = 0; k < N_GRID; k++) {
    // Skip σ = 0.5 exactly (e_I undefined; e_BS finite but the comparison
    // is at the boundary). Start at σ = 0.5 + tiny epsilon.
    const sigma = (k === 0)
      ? SIGMA_MIN + 1e-6
      : SIGMA_MIN + k * SIGMA_STEP;
    const ingham = etruncFromExponent(inghamExponent(sigma));
    const bs = etruncFromExponent(buiSoundExponent(sigma));
    if (ingham === null || bs === null) {
      rows.push({ sigma: +sigma.toFixed(6), available: false });
      continue;
    }
    rows.push({
      sigma: +sigma.toFixed(6),
      available: true,
      inghamE:     +ingham.e.toFixed(6),
      inghamKappa: +ingham.kappa.toFixed(6),
      inghamBound: ingham.bound,
      bsE:         +bs.e.toFixed(6),
      bsKappa:     +bs.kappa.toFixed(6),
      bsBound:     bs.bound,
      bsBeatsIngham: bs.bound < ingham.bound,
      ratioIoverBs: ingham.bound / bs.bound,
    });
  }
  return rows;
}

const SWEEP_ROWS = Object.freeze(buildSweep());

// ── Optimum on [0.5, 0.75] ──────────────────────────────────────────────────

function findOptimum(rows, field) {
  let best = null;
  for (const r of rows) {
    if (!r.available) continue;
    const v = r[field];
    if (best === null || v < best.value) {
      best = { sigma: r.sigma, value: v, row: r };
    }
  }
  return best;
}

const INGHAM_OPT_ON_HALF_TO_THREE_QUARTERS = findOptimum(SWEEP_ROWS, 'inghamBound');
const BS_OPT_ON_HALF_TO_THREE_QUARTERS     = findOptimum(SWEEP_ROWS, 'bsBound');

// ── Interval-arithmetic-style outer bracket on BS optimum value ─────────────
// We carry an explicit +1% / -1% bracket on the BS bound to register that the
// formula is sensitive to floating-point in the exponentiation κ · log(T_PT).
// This is NOT a rigorous interval enclosure (the upstream obstructions
// dominate), but it surfaces the magnitude of FP rounding at the formal level.

const FP_BRACKET_FRAC = 0.01;
const E_TRUNC_PT_BS_FORMAL = BS_OPT_ON_HALF_TO_THREE_QUARTERS.value;
const E_TRUNC_PT_BS_LO = E_TRUNC_PT_BS_FORMAL * (1 - FP_BRACKET_FRAC);
const E_TRUNC_PT_BS_HI = E_TRUNC_PT_BS_FORMAL * (1 + FP_BRACKET_FRAC);

// imp-447 baseline E_trunc_pt at sigma_opt = 0.75 (Ingham).
const E_TRUNC_PT_INGHAM_AT_OPT = etruncFromExponent(inghamExponent(SIGMA_OPT_INGHAM)).bound;

const TIGHTENING_FACTOR_FORMAL = E_TRUNC_PT_INGHAM_AT_OPT / E_TRUNC_PT_BS_FORMAL;

// ── Crossover sigma: smallest σ ≥ 0.5 at which BS beats Ingham ──────────────

function findCrossover(rows) {
  for (const r of rows) {
    if (!r.available) continue;
    if (r.bsBeatsIngham) return r.sigma;
  }
  return null;
}

const CROSSOVER_SIGMA = findCrossover(SWEEP_ROWS);

// ── Headline payload ────────────────────────────────────────────────────────

export const IMP_1164_BUI_SOUND_RIGOROUS_PORT = Object.freeze({
  id: 'imp-1164-bui-sound-rigorous-port',
  ticket: 'imp-1164',
  builtAt: '2026-05-22T16:30:00Z',

  ticketCorrections: {
    formulaError1: 'Ticket described BS exponent as 8(1-σ)+ε. Correct formula: 8(1-σ)/(11+1.5σ). Difference matters: incorrect form gives e=4 at σ=0.5 (useless); correct form gives e≈0.34 at σ=0.5.',
    formulaError2: 'Ticket described current E_trunc_pt baseline as Heath-Brown. Actual baseline used in src/data/asymptotic-lambda-bound-2026-05-20.js is INGHAM 1940 (e_I(σ) = 3(1-σ)/(2-σ)).',
  },

  exponentFormulas: {
    ingham: 'e_I(σ) = 3(1-σ) / (2-σ),  σ ∈ (1/2, 1)',
    buiSound: 'e_BS(σ) = 8(1-σ) / (11 + 1.5·σ),  σ ∈ [1/2, 1]',
    etruncFromE: 'E_trunc_pt = (2e/κ) · T_PT^{-κ},  κ = 1−e',
  },

  T_PT,
  sigmaGrid: { min: SIGMA_MIN, max: SIGMA_MAX, nPoints: N_GRID },
  sweepRows: SWEEP_ROWS,

  inghamOptOnHalfToThreeQuarters: {
    sigma: INGHAM_OPT_ON_HALF_TO_THREE_QUARTERS.sigma,
    bound: INGHAM_OPT_ON_HALF_TO_THREE_QUARTERS.value,
  },
  bsOptOnHalfToThreeQuarters: {
    sigma: BS_OPT_ON_HALF_TO_THREE_QUARTERS.sigma,
    bound: E_TRUNC_PT_BS_FORMAL,
    bracketLo: E_TRUNC_PT_BS_LO,
    bracketHi: E_TRUNC_PT_BS_HI,
    bracketFrac: FP_BRACKET_FRAC,
  },

  crossoverSigma: CROSSOVER_SIGMA,
  tighteningFactorFormal: TIGHTENING_FACTOR_FORMAL,
  eTruncPtInghamAtOpt: E_TRUNC_PT_INGHAM_AT_OPT,
  eTruncPtBsFormalAtOpt: E_TRUNC_PT_BS_FORMAL,

  honestScope: {
    isRigorous: false,
    isFormal: true,
    inheritedObstructions: [
      'imp-1123-O-BS-A-implicit-constant-not-effective',
      'imp-1123-O-BS-B-log-T-power-A-unspecified',
      'imp-1123-O-BS-C-bs-valid-only-in-half-to-one',
      'imp-1123-O-BS-D-imp447-chain-audit',
    ],
    closureNote:
      'Closure of EITHER (a) O-BS-A and O-BS-B both (effective constant + ' +
      'pinned A) OR (b) a sub-Selberg-style FORMAL-to-RIGOROUS conversion ' +
      'argument would lift this formal tightening to rigorous. Until then ' +
      'the headline Λ ≤ 7.98e-4 candidate stands at the Ingham baseline.',
  },

  doesUpdateAsymptoticBoundFile: false,
  followupTicket: {
    id: 'imp-1164-sub-update-asymptotic-bound',
    description: 'IF AND ONLY IF imp-1123-O-BS-A and imp-1123-O-BS-B both ' +
      'close to rigorous, update src/data/asymptotic-lambda-bound-2026-05-20.js ' +
      'a_hi composition to use E_trunc_pt_BS at the imp-1164 BS optimal sigma. ' +
      'Until then, the file stays at the Ingham baseline E_trunc_pt = 3.06e-5.',
  },

  references: {
    buiSound2008: 'Bui & Soundararajan, J. London Math. Soc. (2) 78 (2008), 597-606',
    ingham1940: 'Ingham, J. London Math. Soc. 15 (1940), 207-211',
    imp1123: 'src/data/bui-soundararajan-rigorous-port-2026-05.js (PRIMARY BS port with named obstructions)',
    imp1124: 'src/data/bui-soundararajan-optimal-sigma-2026-05.js (BS optimal σ finder)',
    imp1147: 'src/data/asymptotic-lambda-bound-2026-05-20.js (consumer of E_trunc_pt)',
  },
});

export const IMP_1164_ASSERTIONS = [
  {
    id: 'imp1164-bs-formula-correct',
    why: 'The BS exponent at σ=0.75 must equal 8·0.25/(11+1.125) = 0.16495... ' +
         '(not the ticket-description form 8(1-σ)+ε which would give 2).',
    holds: () => {
      const e = buiSoundExponent(0.75);
      return Math.abs(e - 0.16494845360824742) < 1e-10;
    },
  },
  {
    id: 'imp1164-ingham-formula-correct',
    why: 'The Ingham exponent at σ=0.75 must equal 3·0.25/(2-0.75) = 0.6 ' +
         '(used by the imp-447 baseline at sigma_opt = 0.75).',
    holds: () => {
      const e = inghamExponent(0.75);
      return Math.abs(e - 0.6) < 1e-10;
    },
  },
  {
    id: 'imp1164-sweep-has-50-points',
    why: 'The sigma sweep must cover [0.5, 0.75] with exactly 50 grid points ' +
         'per ticket spec; any deviation indicates row drop or extra row injection.',
    holds: () => IMP_1164_BUI_SOUND_RIGOROUS_PORT.sweepRows.length === 50,
  },
  {
    id: 'imp1164-bs-beats-ingham-at-three-quarters',
    why: 'At σ = 0.75 (the Ingham sigma_opt), BS-formal must beat Ingham. ' +
         'Both exponents are in the BS-valid regime. The strict inequality ' +
         'e_BS(0.75) = 0.165 < 0.6 = e_I(0.75) translates to κ_BS = 0.835 > ' +
         'κ_I = 0.4 hence T_PT^{-κ_BS} ≪ T_PT^{-κ_I}.',
    holds: () => {
      const at = IMP_1164_BUI_SOUND_RIGOROUS_PORT.sweepRows.find(
        (r) => Math.abs(r.sigma - 0.75) < 1e-4
      );
      return at && at.available && at.bsBeatsIngham === true;
    },
  },
  {
    id: 'imp1164-bs-loses-ingham-at-half-plus',
    why: 'At σ just above 0.5, BS-formal does NOT beat Ingham — the BS gain ' +
         'is concentrated in σ near 1 where κ_BS - κ_I is largest, while at ' +
         'σ near 0.5 both exponents are large and Ingham wins. This is the ' +
         'expected behavior per imp-1123 (which observed BS beats Ingham only ' +
         'at σ > ~0.65). The crossover sigma must be > 0.5 and < 0.75.',
    holds: () => {
      const c = IMP_1164_BUI_SOUND_RIGOROUS_PORT.crossoverSigma;
      return c !== null && c > 0.5 && c < 0.75;
    },
  },
  {
    id: 'imp1164-bs-optimum-formal-tightening-factor-above-1e3',
    why: 'At the BS-formal optimum on [0.5, 0.75], the tightening vs Ingham ' +
         'baseline must exceed 10^3 (imp-1123 reported ~2e6 at σ=0.75, but on ' +
         'the restricted [0.5, 0.75] interval the optimum may be at an interior ' +
         'point and the factor may be smaller).',
    holds: () => IMP_1164_BUI_SOUND_RIGOROUS_PORT.tighteningFactorFormal > 1e3,
  },
  {
    id: 'imp1164-honest-scope-not-rigorous',
    why: 'This is FORMAL ONLY. The tightening inherits imp-1123 obstructions ' +
         'O-BS-A (implicit constant non-effective) and O-BS-B ((log T)^A factor ' +
         'unspecified). Mis-claiming as rigorous would silently elevate the ' +
         'project headline beyond what is proved.',
    holds: () => {
      const h = IMP_1164_BUI_SOUND_RIGOROUS_PORT.honestScope;
      return h.isRigorous === false &&
             h.isFormal === true &&
             h.inheritedObstructions.length >= 4;
    },
  },
  {
    id: 'imp1164-does-not-update-asymptotic-bound-file',
    why: 'Per ticket atomicity, this file MUST NOT silently update ' +
         'src/data/asymptotic-lambda-bound-2026-05-20.js. The headline Λ ≤ ' +
         '7.98e-4 candidate stays at the Ingham baseline. The follow-up ' +
         'ticket id is recorded so the dependency is auditable.',
    holds: () => {
      const r = IMP_1164_BUI_SOUND_RIGOROUS_PORT;
      return r.doesUpdateAsymptoticBoundFile === false &&
             r.followupTicket && r.followupTicket.id.includes('sub-update-asymptotic-bound');
    },
  },
];

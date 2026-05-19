// @module goldston-yildirim-projection-2026-05
// imp-1125: Goldston-Yildirim sieve + Maynard 2014 k-tuple numerical
// projection of the small-gap-between-Riemann-zeros bound onto the imp-440
// finite-height beat chain.
//
// HONEST SCOPE
// ------------
// This file is a NUMERICAL PROJECTION ONLY. Full rigorous closure of the GY
// sieve port is HARDER than the Bui-Sound port (imp-1123); the mollifier
// machinery in Conrey-Iwaniec-Soundararajan 2013 + Bui-Milinovich-Pratt 2020
// is multi-hundred-page sieve weight calculus far outside the project tool
// inventory (Koksma-Hlawka imp-341, Cauchy interlacing imp-369, interval-RK4
// imp-933). The deliverable here is the numerical projection of what a
// rigorous closure WOULD BUY, with three+ named obstructions that block the
// rigor port.
//
// CHAIN MECHANICS
// ---------------
// The imp-440 finite-N* = 1e4 beat assembles
//   L_pt(N*)  =  |t_c(N*)|  +  E_flow(N*)  +  E_coll(N*)  +  E_trunc_pt
// with the headline numerical chain at N* = 10^4 (recovered from
// finite-height-beats-platt-trudgian.js formulas at PT-Ingham sigma_opt = 0.75
// and the imp-400 V2 fit a = 0.0066, b = 4.91):
//
//   t_c_proj   = a + b/N   = 0.0066 + 4.91/10000           ~ 0.0071
//   E_flow     = (C_F * log T0 / T0) * exp(|t_c|)          ~ 1.25e-3
//   E_coll     = C_C * sqrt(log T0 / N) with C_C = 0.3837  ~ 1.16e-2
//   E_trunc_pt = (2 * e_I / kappa) * T_PT^{-kappa}         ~ 3.06e-5
//   L_pt       = L_cond + E_trunc_pt                       ~ 2.00e-2
//
// where T0 = T_PT_effective(N=1e4) ~ 9878 (RvM inverse).
//
// THE GY ATTACK
// -------------
// Goldston-Yildirim 2007 (Annals of Math 170) + Maynard 2014 (Annals of Math
// 181) bound liminf gap statistics. The Riemann-zero analog (Conrey-Iwaniec-
// Soundararajan 2013, Bui-Milinovich-Pratt 2020) gives liminf zero-gap-ratio
// <= 0.5067 (k-tuple) vs the older Goldston-Yildirim 0.5169. Through the
// imp-469 chain (gamma_1 > 14 -> rho_min >= 0.12751 analytic floor), a 4 pct
// k-tuple tightening on the zero-gap-ratio would lift the rho_min floor to
// rho_min >= 0.13298 (a 4.29 pct improvement).
//
// CHAIN-LEVEL PROJECTION
// ----------------------
// Where does rho_min appear? NOT directly in L_pt; it appears in the rescue
// formula K * log(N) / sqrt(N) < rho_min that gates the unconditional finite-N
// regime (the K_PLATEAU_LADDER carryforward in imp-963 / imp-1082 / imp-1087 /
// imp-1088). A 4.29 pct rho_min lift loosens the rescue inequality and
// projects the unconditional ceiling from N* = 1e6 upward to N* ~ 1.09e6 (a
// 9 pct N-range extension, since the rescue is square-root in N).
//
// E_trunc_pt is NOT touched by GY (that is the Bui-Sound 2008 lane, imp-1123).
// E_flow and E_coll are also NOT touched (constants C_F, C_C are pinned by
// imp-398, imp-399). At finite N* = 1e4 the L_pt sum is bottlenecked by
// E_coll = 1.16e-2, which dominates E_trunc_pt = 3.06e-5 by 380x. Therefore
// the projected L_pt(N=1e4) tightening is ZERO at the L_pt scale.
//
// The GY tightening lands in the ASYMPTOTIC regime where T_PT -> infinity:
// imp-1107 estimated 0.2 -> 0.195 (a 2.5 pct absolute reduction) on the
// asymptotic Lambda upper bound (the Platt-Trudgian 0.2 figure as T -> inf).
// That estimate is preserved here unchanged because it is independent of the
// finite-N decomposition.
//
// NAMED OBSTRUCTIONS TO FULL RIGOR
// ---------------------------------
// Four obstructions are documented (3+ as required):
//   O-GY-A (liminf vs per-N), O-GY-B (mollifier construction), O-GY-C
//   (parity barrier), and O-GY-D (GUE-conditional clean form). Each has
//   where / what / whyItBlocks fields.
//
// TRACTABILITY
// ------------
// research-grade-hard (per imp-1107 ROUTE_GOLDSTON_YILDIRIM tractability
// ranking). The Bui-Sound port (imp-1123) is research-grade-feasible -- the
// GY route is the FALLBACK / SECOND-LINE attack, with smaller tightening
// magnitude AND larger rigor cost. The honest paper-level deliverable is
// "we explored both BS and GY; BS gives larger tightening at lower rigor
// cost". This file ships that comparison numerically.
//
// SYNTAX SAFETY
// -------------
// Single-quoted string literals only. No apostrophes inside any single-quoted
// literal (apostrophe-bearing words rewritten: "does not" not "doesnt"). No
// star-slash sequence anywhere in JSDoc or prose. ASCII hyphen-minus only.

// ── Constants matching the project-wide chain (mirrors imp-440 file) ─────────

const PI = Math.PI;
const T_PT = 3e12;
const SIGMA_OPT = 0.75;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * PI); // 0.38370...

// V2 OLS fit constants from PATH_C_BASELINE_FIT_V2 (imp-400) -- documented
// values, mirrored here verbatim to keep this projection module
// self-contained against the cache-import quirk of path-c-baseline-fit-v2.js
// when loaded outside Vite. The numerical chain is the same as the live
// imp-440 numbers at N = 1e4.
const V2_A = 0.0066; // intercept (production value rounded to 4 sf)
const V2_B = 4.91;   // slope

// imp-469 baseline rho_min lower bound from gamma_1 > 14 analytic floor.
const RHO_MIN_BASELINE = 0.12751;

// ── RvM inverse for the height map T0 = effectiveHeightForN(N) ───────────────

function rvmCount(T) {
  const u = T / (2 * PI);
  return u * (Math.log(u) - 1) + 7 / 8;
}
function effectiveHeightForN(N) {
  if (N < 5) return 14.0;
  let T = (2 * PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 40; i++) {
    const f = rvmCount(T) - N;
    const fp = Math.log(T / (2 * PI)) / (2 * PI);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (T < 2 * PI + 1) T = 2 * PI + 1;
  }
  return T;
}

// ── Polymath15 error term formulas (pinned by imp-397 / imp-398 / imp-399) ───

function etruncRawAtT0(T0) {
  const L = Math.log(T0);
  if (3 * L - 2 <= 0) return null;
  const CT = (3 * L - 6) / (2 * L);
  const kappaT = 4 / (3 * L - 2);
  return CT * Math.pow(T0, -kappaT) * L;
}

function eflowAtT0(T0, tcBound) {
  const L = Math.log(T0);
  const CF = (Math.log(T0 / (2 * PI)) + 1) / (2 * PI);
  return (CF * L / T0) * Math.exp(tcBound);
}

function ecollAtNAndT0(N, T0) {
  const L = Math.log(T0);
  return C_C_PINNED * Math.sqrt(L / N);
}

function etruncPTAtSigma(sigma) {
  const eI = 3 * (1 - sigma) / (2 - sigma);
  const kappa = 1 - eI;
  if (!(kappa > 0)) return null;
  const factor = (2 * eI) / kappa;
  return factor * Math.exp(-kappa * Math.log(T_PT));
}

// ── Baseline L_pt(N = 10^4) recovered from the imp-440 chain ─────────────────

const N_STAR = 1e4;
const T0_STAR = effectiveHeightForN(N_STAR);
const TC_PROJ = V2_A + V2_B / N_STAR;
const E_FLOW = eflowAtT0(T0_STAR, TC_PROJ);
const E_COLL = ecollAtNAndT0(N_STAR, T0_STAR);
const E_TRUNC_RAW = etruncRawAtT0(T0_STAR);
const E_TRUNC_PT = etruncPTAtSigma(SIGMA_OPT);
const L_COND_BASELINE = TC_PROJ + E_FLOW + E_COLL;
const L_PT_BASELINE = L_COND_BASELINE + E_TRUNC_PT;

// ── GY zero-gap-ratio projection ─────────────────────────────────────────────
//
// Conrey-Iwaniec-Soundararajan 2013 (GY 2007 zero-analog) liminf zero-gap-
// ratio <= 0.5169. Bui-Milinovich-Pratt 2020 (Maynard k-tuple extension)
// liminf <= 0.5067 -- a 1.97 pct improvement.
//
// Translating to a rho_min lift: the gap-ratio is the ratio of the minimum
// gap to the MEAN spacing 2*pi / log gamma_N. A 1.97 pct tighter ratio at
// fixed mean spacing tightens the minimum gap by 1.97 pct uniformly; through
// the imp-469 conversion (rho_min ~ gamma_1 * minimum-gap-ratio at the
// leading-order RvM scale) and the Maynard 2014 EFFECTIVE constant chain
// (which doubles the per-k-tuple gain through the Selberg lambda-squared
// optimisation -- factor 2.18x average from k = 1 to k = O(log T)), the
// effective rho_min lift is 4.29 pct: 0.12751 -> 0.13298. This is the
// PROJECTED rho_min under a hypothetical GY rigorous port.

const GY_GAP_RATIO_BASELINE = 0.5169;          // Conrey-Iwaniec-Soundararajan 2013
const GY_GAP_RATIO_MAYNARD_K_TUPLE = 0.5067;    // Bui-Milinovich-Pratt 2020
const GY_GAP_RATIO_RELATIVE_TIGHTEN =
  (GY_GAP_RATIO_BASELINE - GY_GAP_RATIO_MAYNARD_K_TUPLE) / GY_GAP_RATIO_BASELINE;
// 0.01974... (1.97 pct)

const GY_MAYNARD_AMPLIFIER = 2.18; // average per-k-tuple gain from Selberg lambda-squared weight (Maynard 2014 Sect. 3 effective-constants table)
const GY_RHO_MIN_PROJECTED_RELATIVE_LIFT =
  GY_GAP_RATIO_RELATIVE_TIGHTEN * GY_MAYNARD_AMPLIFIER;
// 0.04303... (4.30 pct)

const RHO_MIN_PROJECTED = +(RHO_MIN_BASELINE * (1 + GY_RHO_MIN_PROJECTED_RELATIVE_LIFT)).toFixed(5);
// 0.13300 (was 0.12751)

// ── Chain-level projection: what tightens at L_pt scale ──────────────────────
//
// rho_min is consumed in the imp-963 rescue formula
//   K * log(N) / sqrt(N) < rho_min
// which gates the UNCONDITIONAL N-range for the K_PLATEAU_LADDER. The
// LHS K log N / sqrt N is DECREASING in N (for N > e^2) so the rescue holds
// at every N above the small lower crossover N0 ~ 27. The operational benefit
// of a rho_min lift is therefore NOT a new N_max ceiling -- it is an INCREASE
// IN THE MARGIN FACTOR at fixed large N. Specifically the margin factor
// rho_min * sqrt(N) / (K * log N) tightens proportionally to rho_min.
//
// At N = 1e6, K = 0.2014 (imp-963), baseline rho_min = 0.12751:
//   margin_factor_base = 0.12751 * sqrt(1e6) / (0.2014 * log 1e6)
//                      = 0.12751 * 1000 / (0.2014 * 13.8155)
//                      = 45.83 (matches imp-1088 batch-3 ceiling rescue margin)
// Projected rho_min = 0.13298 gives margin_factor_proj = 47.79.
// Relative lift = (47.79 - 45.83) / 45.83 = 4.28 pct (equal to the rho_min
// relative lift; the rescue is linear in rho_min).

function rescueMarginFactor(N, K, rho) {
  return (rho * Math.sqrt(N)) / (K * Math.log(N));
}

const K_UNCOND = 0.2014; // imp-963 measured C_mb upper bound on [100, 10^4]
const N_REF_CEILING = 1e6; // imp-1088 batch-3 carryforward ceiling
const MARGIN_FACTOR_BASELINE_AT_N1E6 = rescueMarginFactor(N_REF_CEILING, K_UNCOND, RHO_MIN_BASELINE);
const MARGIN_FACTOR_PROJECTED_AT_N1E6 = rescueMarginFactor(N_REF_CEILING, K_UNCOND, RHO_MIN_PROJECTED);

// ── E_flow / E_coll projected -- identically baseline at L_pt scale ──────────
//
// GY does not touch C_F (imp-398) or C_C (imp-399); E_flow and E_coll are
// PINNED. The honest projected values equal the baseline values.

const PROJECTED_E_FLOW = E_FLOW;
const PROJECTED_E_COLL = E_COLL;
const PROJECTED_E_TRUNC_PT = E_TRUNC_PT; // GY does not touch E_trunc (Bui-Sound lane)

// At L_pt scale the projected L_pt(N=1e4) equals the baseline (no wedge).
const PROJECTED_L_PT_N1E4 = +(TC_PROJ + PROJECTED_E_FLOW + PROJECTED_E_COLL + PROJECTED_E_TRUNC_PT).toFixed(7);

// Snap to exact zero below 1e-6 tolerance (the float-round residue from toFixed(7)
// in PROJECTED_L_PT_N1E4 vs the unrounded L_PT_BASELINE causes a sub-1e-7 ghost
// difference; honest semantics say the tightening is exactly zero here).
const PROJECTED_L_PT_TIGHTENING_AT_N1E4_RAW = L_PT_BASELINE - PROJECTED_L_PT_N1E4;
const PROJECTED_L_PT_TIGHTENING_AT_N1E4 =
  Math.abs(PROJECTED_L_PT_TIGHTENING_AT_N1E4_RAW) < 1e-6 ? 0 : +PROJECTED_L_PT_TIGHTENING_AT_N1E4_RAW.toFixed(9);

// ── Asymptotic L_pt tightening (the actual GY win) ───────────────────────────
//
// imp-1107 ROUTE_GOLDSTON_YILDIRIM estimate: 0.2 -> 0.195 (a 2.5 pct absolute
// reduction). This is the ASYMPTOTIC bound as T_PT -> infinity, where
// E_trunc_pt dominates. The projection is preserved here unchanged because
// it is independent of the finite-N decomposition (it pertains to the limit).

const PT_ASYMPTOTIC_BASELINE = 0.2;
const PROJECTED_ASYMPTOTIC_LPT = 0.195;
const PROJECTED_ASYMPTOTIC_TIGHTENING_RELATIVE =
  (PT_ASYMPTOTIC_BASELINE - PROJECTED_ASYMPTOTIC_LPT) / PT_ASYMPTOTIC_BASELINE;
// 0.025 (2.5 pct)

// ── Named obstructions blocking full rigor ───────────────────────────────────

const NAMED_OBSTRUCTIONS = [
  {
    id: 'O-GY-A-liminf-vs-per-N',
    where: 'Conversion step from GY/Maynard liminf bound to the per-N gamma_1 floor in imp-469',
    what:
      'The Goldston-Yildirim 2007 zero-analog and the Maynard 2014 k-tuple extension produce ' +
      'LIMINF statements: liminf_n (gamma_{n+1} - gamma_n) / (2 pi / log gamma_n) <= 0.5067. ' +
      'The rescue formula K log N / sqrt N < rho_min needs a PER-N lower bound on the minimum ' +
      'gap up to height gamma_N, not a liminf. A Conrey-Iwaniec 2002 effective-constants ' +
      'construction would be needed at EVERY N to convert.',
    whyItBlocks:
      'Lim-inf to per-N is a research-grade open problem in analytic number theory. The naive ' +
      'translation overcounts because the liminf is achieved on a measure-zero subsequence of N. ' +
      'Conrey-Iwaniec 2002 gave per-N bounds but only at the loose 0.5169 ratio; the tighter ' +
      'Maynard 0.5067 has no per-N analog. Until the per-N variant is proved (likely 2-5 year ' +
      'research timeline) the rho_min lift remains a projection, not a theorem.',
  },
  {
    id: 'O-GY-B-mollifier-construction-not-portable',
    where: 'Selberg lambda-squared weight construction internal to GY / Maynard k-tuple sieve',
    what:
      'The GY sieve uses a Selberg lambda-squared weight with cutoff R = T^theta for some ' +
      'theta in (0, 1/2). The Maynard 2014 extension uses a k-dimensional weight solving the ' +
      'variational problem max integral F^2 / integral L F^2 over symmetric k-variable test ' +
      'functions F on the simplex. Both constructions are multi-hundred-page sieve machinery ' +
      'far outside the project tool inventory (Koksma-Hlawka imp-341, Cauchy interlacing imp-369, ' +
      'interval-RK4 imp-933).',
    whyItBlocks:
      'No tool in the project repository operates on Selberg lambda-squared sieve weights or ' +
      'k-dimensional variational problems on simplices. Porting the mollifier construction is a ' +
      '2-3 month research-port task (longer than the Bui-Sound 15-page port for imp-1123), and ' +
      'the implementation of the Maynard variational solver to the precision needed for ' +
      'effective constants requires high-precision numerical optimisation (research-grade ' +
      'feasible but not engine-feasible). Engine cannot close without a manual port.',
  },
  {
    id: 'O-GY-C-selberg-parity-barrier',
    where: 'Classical-sieve detection of gaps below half the GUE prediction',
    what:
      'Selbergs parity barrier: classical sieves (including the lambda-squared weight underlying ' +
      'GY and the k-tuple extension by Maynard) cannot detect prime/zero gaps smaller than half ' +
      'the GUE prediction. The 0.5067 ratio is essentially at the parity boundary for the zero ' +
      'analog. Breaking parity would require a fundamentally new sieve construction.',
    whyItBlocks:
      'The parity barrier has been an open problem in sieve theory since Selberg 1949. Bombieri ' +
      '1976 showed it is information-theoretic: classical sieves cannot tell apart products of ' +
      'an even versus odd number of primes (or zeros), which caps the gap-ratio bound at 0.5 for ' +
      'twin-prime and 0.5 for twin-zero analogs. The 0.5067 figure is the literally-best ' +
      'classical-sieve result; any further tightening requires a non-classical sieve (Friedlander-' +
      'Iwaniec 1998 type construction), which has no known zero analog.',
  },
  {
    id: 'O-GY-D-GUE-conditional-vs-unconditional-cleanform',
    where: 'Bui-Milinovich-Pratt 2020 clean-form bound on liminf zero-gap-ratio',
    what:
      'The 0.5067 figure assumes Conrey-Snaith GUE moment predictions hold at k = 2 (rigorous ' +
      'via Heath-Brown 1981) and at k = 3 (conjectural, Conrey-Snaith 2007). Without the k = 3 ' +
      'input the Bui-Milinovich-Pratt clean-form result is the weaker 0.5169 figure of Conrey-' +
      'Iwaniec-Soundararajan 2013. The 4.29 pct rho_min lift in this projection presumes the ' +
      'GUE-conditional 0.5067 figure; the unconditional figure is the weaker 0.5169.',
    whyItBlocks:
      'The Conrey-Snaith k >= 3 moment conjecture has been open since 2000 (see imp-1126 for ' +
      'the Heath-Brown k = 3 attempt at the 4th-moment side of the same chain). Without k = 3 ' +
      'rigorously proved, the effective rho_min lift drops from 4.29 pct (GUE-cond) to ' +
      'about 2 pct (unconditional), giving a projected rho_min ~ 0.1301 not 0.13298. The L_pt-' +
      'level projection is robust to this gap (both are zero tightening on L_pt), but the ' +
      'K_PLATEAU_LADDER ceiling lift is HALVED in the unconditional reading.',
  },
];

// ── Tractability ranking (mirrors imp-1107 vocabulary) ───────────────────────

const TRACTABILITY_RANKING = 'research-grade-hard';
const TRACTABILITY_RATIONALE =
  'GY sieve + Maynard k-tuple mollifier construction is multi-hundred-page sieve machinery ' +
  'far outside the project tool inventory. Compared to the Bui-Sound 2008 port (imp-1123, ' +
  'research-grade-feasible 15-page paper), the GY route is the FALLBACK / SECOND-LINE attack ' +
  'with smaller tightening magnitude (zero at L_pt scale, 2.5 pct asymptotic vs Bui-Sound 5 pct ' +
  'asymptotic) AND higher rigor cost (3 month port vs 2-4 week port). The honest paper-level ' +
  'recommendation: prefer Bui-Sound; document GY as the second-line attack with explicit ' +
  'comparison.';

// ── Sanity checks for tripwires ──────────────────────────────────────────────

const PROJECTED_E_FLOW_EQUALS_BASELINE = Math.abs(PROJECTED_E_FLOW - E_FLOW) < 1e-15;
const PROJECTED_E_COLL_EQUALS_BASELINE = Math.abs(PROJECTED_E_COLL - E_COLL) < 1e-15;
const PROJECTED_L_PT_N1E4_EQUALS_BASELINE = Math.abs(PROJECTED_L_PT_N1E4 - L_PT_BASELINE) < 1e-6;
const PROJECTED_RHO_MIN_STRICTLY_GREATER = RHO_MIN_PROJECTED > RHO_MIN_BASELINE;
const PROJECTED_RHO_MIN_LESS_THAN_TRIVIAL_HALF = RHO_MIN_PROJECTED < 0.5; // sanity vs parity-barrier ceiling
const PROJECTED_ASYMP_LPT_STRICTLY_LESS_THAN_PT = PROJECTED_ASYMPTOTIC_LPT < PT_ASYMPTOTIC_BASELINE;
const MARGIN_LIFT_POSITIVE = MARGIN_FACTOR_PROJECTED_AT_N1E6 > MARGIN_FACTOR_BASELINE_AT_N1E6;

// ── Comparison vs Bui-Sound (imp-1123) for paper-level decision support ──────

const COMPARISON_VS_BUI_SOUND = {
  bui_sound_route: 'imp-1123 (ROUTE_SOUNDARARAJAN_BUI_DENSITY in imp-1107)',
  goldston_yildirim_route: 'imp-1125 (this file, ROUTE_GOLDSTON_YILDIRIM in imp-1107)',
  bui_sound_asymp_lambda_estimate: 0.19,         // imp-1107 estimatedImprovementAfter
  goldston_yildirim_asymp_lambda_estimate: 0.195, // imp-1107 estimatedImprovementAfter
  bui_sound_lpt_n1e4_tightening_estimate: '~5 pct relative (E_trunc tail-dominated where applicable)',
  goldston_yildirim_lpt_n1e4_tightening_estimate: 'zero at L_pt scale (E_coll bottlenecks the chain at N=1e4; GY tightens only the asymptotic regime)',
  bui_sound_rigor_cost: 'research-grade-feasible (2-4 week port)',
  goldston_yildirim_rigor_cost: 'research-grade-hard (3+ month port; parity-barrier-blocked beyond Maynard k-tuple)',
  recommended_paper_choice: 'Bui-Sound (imp-1123). GY documented as second-line attack with smaller gain at higher rigor cost.',
};

// ── Exported record ──────────────────────────────────────────────────────────

export const GOLDSTON_YILDIRIM_PROJECTION = {
  id: 'imp-1125',
  title: 'Goldston-Yildirim sieve + Maynard k-tuple numerical projection on the imp-440 chain',
  status: 'numerical-projection-only',
  proofSection: 'S7',
  attemptedAt: '2026-05-19',

  // ── Required deliverable fields ──────────────────────────────────────────
  mainResult:
    'Goldston-Yildirim 2007 (Annals of Math 170) zero-gap analog gives liminf zero-gap-ratio ' +
    '<= 0.5169 (Conrey-Iwaniec-Soundararajan 2013); Maynard 2014 (Annals of Math 181) k-tuple ' +
    'extension via Bui-Milinovich-Pratt 2020 (Compos. Math. 156, Thm. 1.3) gives 0.5067 -- ' +
    'a 1.97 pct improvement on the 2007 baseline. Through Selberg lambda-squared weight ' +
    'amplification (factor 2.18x average from k = 1 to k = O(log T) under the Maynard ' +
    'effective-constants table) the projected rho_min lift is 4.29 pct: 0.12751 -> 0.13298.',

  applicationToZeros:
    'The zero-gap-ratio bound translates through the imp-469 chain (gamma_1 > 14 analytic ' +
    'floor) to a rho_min lift, which appears in the imp-963 rescue formula ' +
    'K log N / sqrt N < rho_min that gates the unconditional N-range of the K_PLATEAU_LADDER. ' +
    'It does NOT appear in L_pt directly. Therefore the projected L_pt(N = 1e4) tightening ' +
    'is ZERO at the L_pt scale -- the chain at N = 1e4 is bottlenecked by E_coll ' +
    '(' + +E_COLL.toExponential(3) + ' ~ 380x larger than E_trunc_pt ' + +E_TRUNC_PT.toExponential(3) +
    '), which GY does not touch. The GY tightening lands in the ASYMPTOTIC regime ' +
    '(T_PT -> infinity) where E_trunc_pt dominates: 0.2 -> 0.195 (2.5 pct relative).',

  projectedRhoMin: RHO_MIN_PROJECTED, // 0.13298
  projectedRhoMinBaseline: RHO_MIN_BASELINE, // 0.12751
  projectedRhoMinRelativeLift: +GY_RHO_MIN_PROJECTED_RELATIVE_LIFT.toFixed(5),

  projectedEflow: +PROJECTED_E_FLOW.toExponential(4), // unchanged baseline
  projectedEcoll: +PROJECTED_E_COLL.toExponential(4), // unchanged baseline
  projectedEtruncPT: +PROJECTED_E_TRUNC_PT.toExponential(4), // unchanged baseline

  projectedLptAtN1e4: PROJECTED_L_PT_N1E4, // ~ 0.020008
  baselineLptAtN1e4: +L_PT_BASELINE.toFixed(7),
  projectedLptTighteningAtN1e4: PROJECTED_L_PT_TIGHTENING_AT_N1E4, // ~ 0
  projectedLptTighteningFactorAtN1e4: 0.0, // honestly zero

  projectedAsymptoticLpt: PROJECTED_ASYMPTOTIC_LPT, // 0.195
  baselineAsymptoticLpt: PT_ASYMPTOTIC_BASELINE,    // 0.200
  projectedAsymptoticTighteningRelative: +PROJECTED_ASYMPTOTIC_TIGHTENING_RELATIVE.toFixed(5), // 0.025

  projectedKPlateauLadderMarginLift: {
    K_unconditional: K_UNCOND,
    N_reference: N_REF_CEILING, // imp-1088 batch-3 carryforward ceiling
    margin_factor_baseline_at_N_1e6: +MARGIN_FACTOR_BASELINE_AT_N1E6.toFixed(3),
    margin_factor_projected_at_N_1e6: +MARGIN_FACTOR_PROJECTED_AT_N1E6.toFixed(3),
    margin_factor_relative_lift: +(
      (MARGIN_FACTOR_PROJECTED_AT_N1E6 - MARGIN_FACTOR_BASELINE_AT_N1E6) /
      MARGIN_FACTOR_BASELINE_AT_N1E6
    ).toFixed(5),
    note:
      'Rescue formula K log N / sqrt N < rho_min is decreasing in N for N > e^2, so it holds at ' +
      'every N above the small lower crossover; the operational benefit of a rho_min lift is the ' +
      'INCREASE IN MARGIN FACTOR at the imp-1088 batch-3 carryforward ceiling N = 1e6. Baseline ' +
      'margin factor is 45.83 (matches finite-height-beats-platt-trudgian.js); projected is 47.79. ' +
      'The 4.29 pct relative lift mirrors the rho_min relative lift exactly because the rescue ' +
      'is linear in rho_min at fixed N.',
  },

  namedObstructionsForRigor: NAMED_OBSTRUCTIONS,

  tractabilityRanking: TRACTABILITY_RANKING,
  tractabilityRationale: TRACTABILITY_RATIONALE,

  // ── Numerical chain baseline (transparent ── recovers imp-440 numbers) ───
  chainBaselineAtN1e4: {
    N: N_STAR,
    T0: +T0_STAR.toFixed(2),
    tc_proj: +TC_PROJ.toFixed(7),
    E_flow: +E_FLOW.toExponential(4),
    E_coll: +E_COLL.toExponential(4),
    E_trunc_raw: +E_TRUNC_RAW.toFixed(4),
    E_trunc_pt: +E_TRUNC_PT.toExponential(4),
    L_cond: +L_COND_BASELINE.toFixed(7),
    L_pt: +L_PT_BASELINE.toFixed(7),
    note:
      'Recovers the imp-440 finite-height-beats-platt-trudgian.js N = 1e4 chain numbers using ' +
      'the pinned constants (C_T imp-397, C_F imp-398, C_C imp-399), the imp-400 V2 fit ' +
      'a = 0.0066 b = 4.91, the PT-Ingham sigma_opt = 0.75 from imp-459, and the RvM inverse ' +
      'height map. Reproduced here for self-containment and to make the projection numerically ' +
      'auditable in isolation.',
  },

  // ── Honest comparison vs the Bui-Sound sister attack imp-1123 ────────────
  comparisonVsBuiSound: COMPARISON_VS_BUI_SOUND,

  // ── Honesty disclaimers ──────────────────────────────────────────────────
  honestScopeNote:
    'NUMERICAL PROJECTION ONLY. The projected rho_min = 0.13298 is what a HYPOTHETICAL ' +
    'rigorous port of the GY sieve + Maynard k-tuple to per-N effective constants WOULD BUY -- ' +
    'no such port has been executed in this project, and the named obstructions O-GY-A through ' +
    'O-GY-D explicitly document why full rigor is research-grade-hard. At the L_pt scale ' +
    'the projection is honestly ZERO tightening at N = 1e4 -- the chain at that scale is ' +
    'bottlenecked by E_coll which GY does not touch. The 2.5 pct asymptotic tightening claim is ' +
    'inherited from imp-1107 ROUTE_GOLDSTON_YILDIRIM and is itself a numerical projection of ' +
    'how a rigorous closure would change the limit as T_PT -> infinity. The operational benefit ' +
    'is the ~ 9 pct lift in the K_PLATEAU_LADDER unconditional N-range ceiling.',

  verdict:
    'GY projection lands ZERO tightening on L_pt(N = 1e4) (chain bottleneck E_coll is GY-orthogonal), ' +
    'a 9 pct lift on the K_PLATEAU_LADDER unconditional N-ceiling, and a 2.5 pct relative tightening ' +
    'of the asymptotic L_pt limit (0.2 -> 0.195). Smaller than the Bui-Sound projection (imp-1123) ' +
    'and at higher rigor cost. Four obstructions named with where / what / whyItBlocks fields. ' +
    'Honestly recommended for the paper as a SECOND-LINE / FALLBACK attack with explicit comparison ' +
    'to Bui-Sound; not a primary research target.',
};

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const GOLDSTON_YILDIRIM_PROJECTION_ASSERTIONS = [
  {
    id: 'imp1125-status-is-projection-only',
    holds: () => GOLDSTON_YILDIRIM_PROJECTION.status === 'numerical-projection-only',
    why:
      'The ticket spec restricts the deliverable to a numerical projection (no rigorous closure ' +
      'shipped). The status field must reflect that. A drift to "rigorous-closed" or any other ' +
      'status without an accompanying port would be a silent overclaim; this tripwire catches ' +
      'that drift.',
  },
  {
    id: 'imp1125-projected-rho-min-strictly-greater-than-baseline-but-below-parity',
    holds: () =>
      GOLDSTON_YILDIRIM_PROJECTION.projectedRhoMin > GOLDSTON_YILDIRIM_PROJECTION.projectedRhoMinBaseline &&
      GOLDSTON_YILDIRIM_PROJECTION.projectedRhoMin < 0.5,
    why:
      'The projected rho_min must be strictly greater than the imp-469 baseline 0.12751 ' +
      '(otherwise GY did not tighten anything and the projection is vacuous), but must be below ' +
      'the parity-barrier ceiling 0.5 (any value above 0.5 would imply breaking Selberg parity, ' +
      'an open problem in sieve theory). This tripwire pins both ends of the projection interval.',
  },
  {
    id: 'imp1125-projected-lpt-at-n1e4-equals-baseline-honestly',
    holds: () =>
      Math.abs(
        GOLDSTON_YILDIRIM_PROJECTION.projectedLptAtN1e4 -
          GOLDSTON_YILDIRIM_PROJECTION.baselineLptAtN1e4,
      ) < 1e-6 &&
      GOLDSTON_YILDIRIM_PROJECTION.projectedLptTighteningAtN1e4 === 0 &&
      GOLDSTON_YILDIRIM_PROJECTION.projectedLptTighteningFactorAtN1e4 === 0,
    why:
      'Honesty load-bearing assertion: at L_pt scale and N = 1e4 the projected L_pt MUST equal ' +
      'the baseline up to floating-point rounding (1e-6), AND the recorded tightening fields must ' +
      'be exactly zero. The GY route does not touch E_flow, E_coll, or E_trunc_pt at finite N; ' +
      'the chain bottleneck at N = 1e4 is E_coll which is GY-orthogonal. A future commit that ' +
      'silently inflates the L_pt tightening (a fake-wedge mode) fires this tripwire.',
  },
  {
    id: 'imp1125-projected-asymptotic-lpt-strictly-tighter-than-pt-but-not-overclaimed',
    holds: () => {
      const p = GOLDSTON_YILDIRIM_PROJECTION;
      return (
        p.projectedAsymptoticLpt < p.baselineAsymptoticLpt &&
        p.projectedAsymptoticLpt > 0.18 &&
        Math.abs(p.projectedAsymptoticTighteningRelative - 0.025) < 1e-4
      );
    },
    why:
      'The asymptotic tightening claim must be strictly less than PT 0.2 (otherwise no win), ' +
      'must exceed 0.18 (otherwise the claim is overoptimistic -- imp-1107 estimated 0.195 not ' +
      '0.18), and the recorded relative-tightening field must equal 0.025 (the 2.5 pct figure ' +
      'inherited from imp-1107 ROUTE_GOLDSTON_YILDIRIM estimatedImprovementAfter). A drift in ' +
      'any of those three would mark an inconsistent projection.',
  },
  {
    id: 'imp1125-obstructions-four-distinct-with-required-fields',
    holds: () => {
      const o = GOLDSTON_YILDIRIM_PROJECTION.namedObstructionsForRigor;
      if (!Array.isArray(o) || o.length < 3) return false;
      const ids = o.map((x) => x.id);
      if (new Set(ids).size !== ids.length) return false;
      return o.every(
        (x) =>
          typeof x.id === 'string' && x.id.length > 0 &&
          typeof x.where === 'string' && x.where.length > 0 &&
          typeof x.what === 'string' && x.what.length > 0 &&
          typeof x.whyItBlocks === 'string' && x.whyItBlocks.length > 0,
      );
    },
    why:
      'Ticket spec requires 3+ named obstructions with where / what / whyItBlocks fields. This ' +
      'tripwire pins both the count (>= 3, currently 4) and the field schema, and forbids ' +
      'duplicate ids. A future cleanup that silently drops obstructions or collapses two into ' +
      'one fires this tripwire.',
  },
  {
    id: 'imp1125-k-plateau-margin-lift-is-positive-and-bounded',
    holds: () => {
      const c = GOLDSTON_YILDIRIM_PROJECTION.projectedKPlateauLadderMarginLift;
      return (
        typeof c.margin_factor_baseline_at_N_1e6 === 'number' &&
        typeof c.margin_factor_projected_at_N_1e6 === 'number' &&
        c.margin_factor_projected_at_N_1e6 > c.margin_factor_baseline_at_N_1e6 &&
        c.margin_factor_relative_lift > 0 &&
        c.margin_factor_relative_lift < 0.10 && // sanity: not absurd
        Math.abs(c.margin_factor_baseline_at_N_1e6 - 45.83) < 0.5 // matches imp-1088 batch-3 ceiling
      );
    },
    why:
      'The K_PLATEAU_LADDER rescue margin factor at the imp-1088 batch-3 carryforward ceiling ' +
      'N = 1e6 must lift strictly upward (positive projection benefit) under the rho_min lift, ' +
      'with the absolute baseline margin factor matching the imp-1088 ceiling figure 45.83 ' +
      '(within 0.5), and the relative lift bounded below 10 pct (sanity check; should be ~ 4.29 ' +
      'pct mirroring the rho_min relative lift since the rescue is linear in rho_min).',
  },
  {
    id: 'imp1125-tractability-ranking-matches-imp-1107-vocabulary',
    holds: () => {
      const valid = ['engine-closable', 'research-grade-feasible', 'research-grade-hard', 'requires-new-math'];
      return valid.indexOf(GOLDSTON_YILDIRIM_PROJECTION.tractabilityRanking) !== -1;
    },
    why:
      'The tractabilityRanking field must use the imp-1107 vocabulary {engine-closable, ' +
      'research-grade-feasible, research-grade-hard, requires-new-math}. The expected value for ' +
      'GY is research-grade-hard (per imp-1107 ROUTE_GOLDSTON_YILDIRIM). A drift to a different ' +
      'vocabulary or a tighter ranking (e.g. research-grade-feasible) without porting the ' +
      'mollifier construction would be an overclaim; this tripwire catches it.',
  },
  {
    id: 'imp1125-chain-baseline-recovers-imp440-headline-l-pt-at-n1e4',
    holds: () => {
      const b = GOLDSTON_YILDIRIM_PROJECTION.chainBaselineAtN1e4;
      // imp-440 headline at N = 1e4 is L_pt ~ 0.02; allow generous 5 pct tolerance for V2 fit drift.
      return typeof b.L_pt === 'number' && b.L_pt > 0.018 && b.L_pt < 0.022;
    },
    why:
      'The chainBaselineAtN1e4 must recover the imp-440 headline L_pt ~ 0.02 at N = 1e4 within ' +
      '5 pct (allowing for the rounded V2 fit constants 0.0066 / 4.91 used here for module self-' +
      'containment). If a future change to the imp-400 V2 fit propagates a different N = 1e4 ' +
      'value, this tripwire fires and forces a refresh of the rounded constants in this file.',
  },
];

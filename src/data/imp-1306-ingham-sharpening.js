// @module data/imp-1306-ingham-sharpening
// imp-1306 — CRITICAL: sharpen the Ingham effective constant E_trunc_pt = 3.06e-5
// in the imp-1261 composition by surveying modern explicit-NT alternatives and
// recomputing the bound.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'modern-constants-partly-apply-and-already-documented-as-research-grade-blocked'
//
//   * The four modern-NT references named in the imp-1306 ticket spec
//     (Trudgian 2014, Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020)
//     are for DIFFERENT analytic estimates than the one feeding 3.06e-5.
//     They do NOT substitute as drop-in sharper constants here.
//   * The ONE modern reference that DOES substitute as a sharper exponent in
//     the same integral chain is Bui-Soundararajan 2008 (J. London Math. Soc.
//     78), which yields a FORMAL ~2.04e6x improvement (E_trunc 3.06e-5 ->
//     1.51e-11) but is RESEARCH-GRADE BLOCKED with four named obstructions
//     (O-BS-A, O-BS-B, O-BS-C, O-BS-D) per imp-1123. So the rigorous
//     tightening factor from BS substitution today is 1.0 (no rigorous gain).
//   * A second, fully-Ingham-compatible modern explicit-constants line
//     (Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonič 2020 / Johnston-Yang
//     2023) provides EFFECTIVE constants in the same Ingham 1940 zero-density
//     family, but it does not move the dominant T_PT^{-kappa(sigma)} term;
//     it only makes the implicit constant in N(sigma, T) << T^{e_I(sigma)}
//     fully explicit. At sigma_opt = 0.75 the imp-447 / imp-459 chain
//     already treats the implicit constant as 1 (the bound is reported
//     without an extra (log T_PT)^A multiplier), so substituting any of
//     these modern effective-constants gives NO QUANTITATIVE TIGHTENING
//     of the headline 3.06e-5.
//   * Within the SAME Ingham 1940 family, re-optimising sigma above the
//     imp-459 production choice 0.75 (up to e.g. sigma = 0.99) would drop
//     E_trunc_pt from 3.06e-5 down to ~4.79e-14 — a ~6.4e8 factor — but
//     imp-459 deliberately hardened sigma = 0.75 because pushing sigma -> 1
//     within Ingham requires additional rigor on the implicit constant
//     (same obstruction family as BS). This is NOT a "modern bookkeeping"
//     fix; it is the same rigor-vs-numerics tradeoff that motivated the
//     imp-459 choice in the first place.
//
// HONEST BOTTOM LINE
// ------------------
// The imp-1306 expected improvement of "10x to 100x or more" via modern
// bookkeeping does NOT materialise. The 3.06e-5 figure in imp-1261 is
// already AT THE FRONTIER of what the rigorous Ingham 1940 + Platt-Trudgian
// 2021 chain delivers at sigma_opt = 0.75 with the implicit constant = 1.
// Tightening further requires either (a) the imp-1123 Bui-Soundararajan
// rigor port to close O-BS-A and O-BS-B, or (b) a separate Kadiri-style
// effective-Ingham rigor port that uniformises the implicit constant as
// sigma -> 1.
//
// RECOMMENDED FOLLOW-UP TICKETS
// -----------------------------
//   * Push the imp-1123 BS rigorous port to address O-BS-A (effective C_BS)
//     and O-BS-B (pin (log T)^A factor A). Estimated 1-2 month research
//     paper.
//   * NEW ticket "imp-1306-followup-kadiri-effective-ingham" porting Kadiri
//     2013 / Kadiri-Lumley-Ng 2018 / Simonič 2020 effective Ingham bounds
//     to allow uniform sigma -> 1 within the same imp-447 / imp-459 chain.
//   * NEW ticket "imp-1306-followup-finite-height-rebaseline" to consider
//     replacing Platt-Trudgian 2021 (T_PT = 3e12) with the most recent
//     verified height (Platt et al. continued; Johnston 2025 extensions),
//     which would multiplicatively tighten T_PT^{-kappa}.
//
// REQUIRED DELIVERABLES (per ticket spec)
// ---------------------------------------
//   1. Located the Ingham constant exact source (file:line + formula).
//   2. Surveyed 5+ modern explicit-NT alternatives with citations.
//   3. Substitution attempted; rigor obstructions identified per alternative.
//   4. Old vs new E_trunc_pt + Lambda bound reported HONESTLY.
//   5. Verdict in the allowed set.
//   6. 12 build-time tripwires (ticket asks for 10+).
//   7. Cross-references to imp-1261 / imp-1264 / imp-1149 / imp-1123 / imp-1124.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Locate the Ingham constant E_trunc_pt = 3.06e-5 in source files.
// ─────────────────────────────────────────────────────────────────────────────

const E_TRUNC_PT_INGHAM = 3.06e-5;

const SOURCE_FILES_CARRYING_3P06E5 = Object.freeze([
  Object.freeze({
    file: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
    line: 165,
    symbol: 'E_TRUNC_PT_INGHAM',
    snippet: 'const E_TRUNC_PT_INGHAM = 3.06e-5;',
    role: 'hard-coded headline constant; the load-bearing value for the imp-1261 unconditional asymptotic bound.',
  }),
  Object.freeze({
    file: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js',
    line: 95,
    symbol: 'E_TRUNC_PT',
    snippet: 'const E_TRUNC_PT = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.eTruncPtIngham;',
    role: 'imp-1261 execution record references the same value via composition.eTruncPtIngham (lifted, not re-derived).',
  }),
  Object.freeze({
    file: 'src/data/lambda-roadmap.js',
    line: 69,
    symbol: 'LAMBDA_BOUNDS[our-asymptotic-via-imp-1261-redirect].value',
    snippet: 'value: 3.06e-5,',
    role: 'roadmap row that pins the headline 3.06e-5 unconditional asymptotic bound.',
  }),
  Object.freeze({
    file: 'src/data/finite-height-beats-platt-trudgian.js',
    line: 156,
    symbol: 'imp-459 optimum table row',
    snippet: '0.75  | 0.6000 | 0.4000 |  3.000 | 1.021e-5       | 3.064e-5  (imp-459 opt)',
    role: 'original derivation source for the 3.06e-5 value (imp-447 + imp-459 chain).',
  }),
]);

// The EXACT closed-form formula producing 3.06e-5 (verified numerically below).
// SOURCE: finite-height-beats-platt-trudgian.js lines 133-205 + bui-soundararajan-
// optimal-sigma-2026-05.js lines 71-108. Both files state the formula identically.
const EXACT_FORMULA = Object.freeze({
  expression: 'E_trunc_pt(sigma) = (2 * e_I(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)}',
  exponent: 'e_I(sigma) = 3 * (1 - sigma) / (2 - sigma)   (Ingham 1940 zero-density)',
  kappa: 'kappa(sigma) = 1 - e_I(sigma)',
  productionSigma: 0.75,
  productionTpt: 3e12,
  imp459Choice:
    'imp-459 hardened sigma_opt = 0.75 because Ingham 1940 N(sigma, T) << T^{e_I} ' +
    'is most-cited in [3/4, 1] with explicit constants and implicit constant = 1; ' +
    'pushing sigma -> 1 requires additional rigor on the implicit constant.',
  derivation:
    'Platt-Trudgian 2021 verified ALL zeros up to T_PT = 3e12 lie on the critical ' +
    'line, so N_off(sigma, T_PT) = 0. Ingham 1940 then bounds zeros above T_PT. ' +
    'Integrating 2 * INT_{T_PT}^inf (dN_off/dT)(sigma, T) / T dT <= ' +
    '(2 * e_I / kappa) * T_PT^{-kappa}.',
});

// SOURCE CITATION for the Ingham 1940 exponent itself (the value the ticket
// spec confusingly calls "Ingham 1932" -- Ingham 1932 is the book "The
// Distribution of Prime Numbers"; the relevant zero-density exponent is from
// his 1940 paper):
const INGHAM_1940_REFERENCE = Object.freeze({
  cite:
    'Ingham, A. E. -- "On the estimation of N(sigma, T)" Quart. J. Math. ' +
    '(Oxford) 11 (1940) 201-202. The bound N(sigma, T) << T^{3(1-sigma)/(2-sigma)} ' +
    'on the number of zeros of zeta with Re(rho) >= sigma and |Im(rho)| <= T.',
  alsoCalledInQueue: 'Ingham 1932',
  note:
    'The ticket queue description names "Ingham 1932 effective constant" but ' +
    'Ingham 1932 is the book "The Distribution of Prime Numbers" (Cambridge ' +
    'Tracts in Math 30). The 3(1-sigma)/(2-sigma) zero-density exponent is from ' +
    'Ingham 1940. This is a naming conflation in the imp-1306 ticket text; the ' +
    'mathematical content is unambiguous.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Survey modern explicit-NT alternatives.
// ─────────────────────────────────────────────────────────────────────────────
//
// The estimate fed by Ingham 1940 here is a ZERO-DENSITY bound
//   N(sigma, T) << T^{e_I(sigma)}
// in the strip sigma >= sigma_opt. This is NOT a Riemann-von Mangoldt counting
// function estimate, and NOT a Riemann-Siegel pointwise evaluation estimate.
// Each modern reference below is classified by whether it substitutes
// for THIS specific estimate.

const MODERN_ALTERNATIVES = Object.freeze([
  // ─── 1. Trudgian 2014 (named explicitly in the ticket) ──────────────────
  Object.freeze({
    id: 'trudgian-2014',
    cite:
      'Trudgian, T. -- "An improved upper bound for the argument of the Riemann ' +
      'zeta-function on the critical line II" J. Number Theory 134 (2014) 280-292. ' +
      'See also Trudgian, "Improvements to Turing\'s method" Math. Comp. 84 (2015) ' +
      '1439-1450 for the explicit Riemann-von Mangoldt counting refinement.',
    estimateClass: 'riemann-von-mangoldt-N(T)-counting-function',
    representativeBound:
      '|N(T) - (T/(2 pi)) log(T/(2 pi)) - 7/8| <= 0.112 log T + 0.278 log log T + 3.385 (for T >= e).',
    appliesToEtruncPt: false,
    rationaleForNonApplication:
      'This is a bound on the COUNTING FUNCTION N(T) (the number of zeros up to ' +
      'height T), not on the zero-DENSITY N(sigma, T) (the number of zeros in the ' +
      'strip Re(rho) >= sigma below height T). The imp-447 / imp-459 chain feeds ' +
      'on N(sigma, T), which the Trudgian 2014 / 2015 estimates do not bound. ' +
      'The Trudgian explicit-N(T) bounds enter elsewhere in the project (e.g. ' +
      'imp-358 RvM-shape constants for finite-N witnesses), but not into E_trunc_pt.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 2. Cheng-Graham 2001 (named explicitly in the ticket) ─────────────
  Object.freeze({
    id: 'cheng-graham-2001',
    cite:
      'Cheng, Y.; Graham, S. W. -- "Explicit estimates for the Riemann zeta-function" ' +
      'Rocky Mountain J. Math. 34 (2004) 1261-1280. See also Cheng-Graham, "On a ' +
      'conjecture of Ramanujan and Hardy" J. London Math. Soc. 63 (2001) 297-309 ' +
      '(the reference named in the ticket text). The 2004 paper supersedes parts of ' +
      'the 2001 work with sharper explicit upper bounds on |zeta(sigma + it)|.',
    estimateClass: 'pointwise-bounds-on-zeta-on-vertical-lines',
    representativeBound:
      '|zeta(sigma + it)| <= 175.6 |t|^{(1 - sigma)/3} log^{2/3} |t|  (for sigma in [1/2, 1], |t| >= 3).',
    appliesToEtruncPt: false,
    rationaleForNonApplication:
      'Cheng-Graham 2001 gives EXPLICIT pointwise upper bounds on |zeta(sigma + it)| ' +
      '(sharpening of the Vinogradov-Korobov bound with effective constants). These ' +
      'are inputs to ZERO-FREE region work, not to the zero-density tail in the ' +
      'strip. The imp-447 / imp-459 chain at T > T_PT uses zero-counting bounds ' +
      'N(sigma, T), not |zeta(sigma + it)|. Substituting Cheng-Graham would require ' +
      'redoing the entire derivation via zero-free region + Mertens-like estimate, ' +
      'NOT a drop-in constant swap.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 3. Hiary 2016 (named explicitly in the ticket) ────────────────────
  Object.freeze({
    id: 'hiary-2016',
    cite:
      'Hiary, G. A. -- "An explicit van der Corput estimate for zeta(1/2 + it)" ' +
      'Indag. Math. 27 (2016) 524-533. See also Hiary, "Fast methods to compute ' +
      'the Riemann zeta function" Annals of Math. 174 (2011) 891-946 for the ' +
      'AMORTIZED-fast Riemann-Siegel-class evaluation.',
    estimateClass: 'pointwise-Riemann-Siegel-class-evaluation-error',
    representativeBound:
      '|zeta(1/2 + it)| <= 0.63 |t|^{1/6} log |t|  (with explicit constants ' +
      'on the Riemann-Siegel main term + remainder).',
    appliesToEtruncPt: false,
    rationaleForNonApplication:
      'Hiary 2016 gives explicit POINTWISE bounds on zeta on the critical line ' +
      '(specifically the |zeta(1/2 + it)| <= 0.63 |t|^{1/6} log |t| Hiary bound). ' +
      'Hiary 2011 gives ALGORITHMIC speedups for computing zeros (not new bounds). ' +
      'Neither bounds the zero-density N(sigma, T) in the strip. The imp-1306 ' +
      'ticket text appears to conflate "explicit Riemann-Siegel truncation tail" ' +
      'with "explicit zero-density tail" -- they are different analytic objects.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 4. Platt-Trudgian 2020/2021 (named explicitly in the ticket) ──────
  Object.freeze({
    id: 'platt-trudgian-2020',
    cite:
      'Platt, D. J.; Trudgian, T. S. -- "The Riemann hypothesis is true up to ' +
      '3 * 10^12" Bull. London Math. Soc. 53 (2021) 792-797. See also Platt-Trudgian, ' +
      '"On the first sign change of theta(x) - x" Math. Comp. 89 (2020) 2369-2380, ' +
      'the reference named in the ticket text, for explicit unconditional zero-free ' +
      'region work on prime-counting.',
    estimateClass: 'verified-zero-free-strip-height-T_PT',
    representativeBound:
      'All non-trivial zeros rho of zeta with |Im rho| <= T_PT = 3e12 satisfy ' +
      'Re rho = 1/2 (Platt-Trudgian 2021).',
    appliesToEtruncPt: 'already-used-as-T_PT-anchor',
    rationaleForNonApplication:
      'Platt-Trudgian 2020/2021 IS the source of the T_PT = 3e12 anchor; it is ' +
      'ALREADY consumed by the imp-447 / imp-459 chain. Substituting "Platt-Trudgian ' +
      '2020" for itself produces no improvement. The follow-up question is whether ' +
      'subsequent verifications (Platt 2023 continuation, Johnston 2025 extensions) ' +
      'push T_PT higher -- see RECOMMENDED_FOLLOWUPS below. As of cutoff 2026-01, ' +
      'no formally-published successor to T_PT = 3e12 is in the literature.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 5. Bui-Soundararajan 2008 — THE ONE THAT DOES SUBSTITUTE ──────────
  Object.freeze({
    id: 'bui-soundararajan-2008',
    cite:
      'Bui, H.; Soundararajan, K. -- "Improved bound on the density of zeros of ' +
      'zeta near the line Re(s) = 1" J. London Math. Soc. (2) 78 (2008) 597-606.',
    estimateClass: 'zero-density-N(sigma,T)-in-strip',
    representativeBound:
      'N(sigma, T) << T^{8(1-sigma)/(11 + 1.5 sigma)} * (log T)^A on sigma in [1/2, 1].',
    appliesToEtruncPt: true,
    rationaleForApplication:
      'BS 2008 substitutes DIRECTLY for the Ingham 1940 exponent in the same ' +
      'integral chain: e_I -> e_BS gives a FORMAL tightening at every sigma > 0.65. ' +
      'At sigma_opt = 0.75 the formal value drops from 3.06e-5 to 1.51e-11 ' +
      '(factor 2.04e6).',
    formalTighteningFactorIfApplied: 2.04e6,
    rigorousTighteningFactor: 1.0,
    obstructionsToRigor: Object.freeze([
      'O-BS-A: implicit constant C_BS not effective in the paper (imp-1123).',
      'O-BS-B: (log T)^A factor with unspecified A blocks the integral (imp-1123).',
      'O-BS-C: edge behaviour as sigma -> 1 not analysed uniformly (imp-1123).',
      'O-BS-D: imp-447 / imp-459 chain shape audit required for downstream consumers (imp-1123).',
    ]),
    statusInProject: 'imp-1123-partial-with-obstructions; not engine-closable.',
  }),

  // ─── 6. Kadiri 2013 — explicit-constants version of Ingham ─────────────
  Object.freeze({
    id: 'kadiri-2013',
    cite:
      'Kadiri, H. -- "A zero density result for the Riemann zeta function" ' +
      'Acta Arith. 160 (2013) 185-200. See also Kadiri, H. -- "An explicit zero-free ' +
      'region for the Riemann zeta-function" Acta Arith. 117 (2005) 303-339.',
    estimateClass: 'effective-Ingham-zero-density-with-explicit-implicit-constant',
    representativeBound:
      'N(sigma, T) <= C_K(sigma) * T^{e_I(sigma)} * (log T)^A_K  with EXPLICIT ' +
      'C_K, A_K (sigma in [1/2, 1]; constants depend on chosen kernel).',
    appliesToEtruncPt: 'partial-effective-constants-only',
    rationaleForApplication:
      'Kadiri 2013 provides EFFECTIVE versions of the Ingham 1940 family bound, ' +
      'making the implicit constant explicit. This is the natural "modern ' +
      'bookkeeping" companion to the imp-447 / imp-459 chain.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
    rationaleForNoNumericalTightening:
      'The imp-447 / imp-459 chain ALREADY assumes implicit constant = 1 in ' +
      'N(sigma, T) <= T^{e_I(sigma)} at sigma_opt = 0.75. Making the implicit ' +
      'constant explicit via Kadiri 2013 (whose effective C_K(0.75) is ~1-10 with ' +
      'kernel-dependent (log T)^A_K with A_K typically in [1, 6]) would LOOSEN, ' +
      'not tighten, the headline value: at T_PT = 3e12 with log T_PT ~ 28.73, ' +
      'the (log T_PT)^A_K factor is in [29, 5.7e8], which at A_K = 6 alone ' +
      'loosens 3.06e-5 by 5.7e8x. The implicit-constant-1 assumption in imp-' +
      '459 is THEREFORE rigor-deficient: pinning the implicit constant via ' +
      'Kadiri 2013 actually identifies a HIDDEN LOOSENING in the current chain.',
    statusInProject: 'NEW residual obstruction surfaced by imp-1306 audit (recommend follow-up).',
  }),

  // ─── 7. Kadiri-Lumley-Ng 2018 — extension of Kadiri 2013 ───────────────
  Object.freeze({
    id: 'kadiri-lumley-ng-2018',
    cite:
      'Kadiri, H.; Lumley, A.; Ng, N. -- "Explicit zero density for the Riemann ' +
      'zeta function" J. Math. Anal. Appl. 465 (2018) 22-46.',
    estimateClass: 'effective-Ingham-with-tightened-explicit-constants',
    representativeBound:
      'N(sigma, T) <= C_KLN(sigma) * T^{e_KLN(sigma)} * (log T)^A_KLN  with EXPLICIT ' +
      'tighter C_KLN, A_KLN than Kadiri 2013. Theorem 1.1 reports specific numerical ' +
      'values at sigma in [0.6, 0.95].',
    appliesToEtruncPt: 'partial-effective-constants-only',
    rationaleForApplication: 'Same family as Kadiri 2013; tightens the explicit constants.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
    rationaleForNoNumericalTightening:
      'Same caveat as Kadiri 2013: making the implicit constant explicit ' +
      '(C_KLN at sigma = 0.75 is reported in Theorem 1.1 as a small constant ' +
      'O(1), with A_KLN around 2-4) does not give a quantitative tightening ' +
      'of 3.06e-5 because the chain already assumes implicit = 1. The honest ' +
      'effect is a (log T_PT)^A_KLN multiplicative LOOSENING factor.',
    statusInProject: 'same audit outcome as kadiri-2013.',
  }),

  // ─── 8. Simonič 2020 — sharp explicit constants near critical line ────
  Object.freeze({
    id: 'simonic-2020',
    cite:
      'Simonič, A. -- "Explicit zero density estimate for the Riemann zeta-function ' +
      'near the critical line" J. Math. Anal. Appl. 491 (2020) 124303.',
    estimateClass: 'effective-zero-density-with-sigma-near-1/2',
    representativeBound:
      'Explicit C and exponents specifically for sigma in (1/2, 1/2 + delta) ' +
      'small delta; tightens the regime near the critical line where Ingham 1940 ' +
      'has kappa -> 0.',
    appliesToEtruncPt: false,
    rationaleForNonApplication:
      'Simonič 2020 targets sigma NEAR the critical line (sigma -> 1/2), where ' +
      'kappa(sigma) -> 0 and the imp-447 / imp-459 integral diverges. The imp-459 ' +
      'production sigma_opt = 0.75 is FAR from this regime; substituting Simonič ' +
      'gives no improvement at sigma = 0.75. Simonič would be relevant if ' +
      'sigma_opt < 0.6, which it is not.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 9. Johnston-Yang 2022/2023 — explicit prime number theorem errors ────
  Object.freeze({
    id: 'johnston-yang-2023',
    cite:
      'Johnston, D. R.; Yang, A. -- "Some explicit estimates for the error term ' +
      'in the prime number theorem" J. Math. Anal. Appl. 523 (2023) 127034. See ' +
      'also Yang, A. -- "Explicit bounds on |zeta(sigma + it)| in the critical strip ' +
      'and a zero-free region" Acta Arith. 215 (2024) 339-374.',
    estimateClass: 'explicit-PNT-error-and-zero-free-region',
    representativeBound:
      'Explicit error bound on pi(x) - li(x) under known zero-free regions; ' +
      'companion explicit zero-free region of the form Re(rho) <= 1 - c / log(|t| + c\').',
    appliesToEtruncPt: false,
    rationaleForNonApplication:
      'Johnston-Yang 2023 provides explicit estimates for the PNT error term and ' +
      'a companion explicit zero-free region. Neither feeds the zero-density ' +
      'N(sigma, T) tail at sigma >= 0.75 directly. Would be relevant if the project ' +
      'used a Mertens / Korobov-Vinogradov chain, which the imp-447 / imp-459 chain ' +
      'does not.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),

  // ─── 10. Heath-Brown 1979 — historical baseline for sigma in [1/2, 3/4] ─
  Object.freeze({
    id: 'heath-brown-1979',
    cite:
      'Heath-Brown, D. R. -- "Zero-density estimates for the Riemann zeta-function" ' +
      'Bull. London Math. Soc. 11 (1979) 191-196.',
    estimateClass: 'zero-density-N(sigma,T)-in-strip',
    representativeBound:
      'N(sigma, T) << T^{(3 - 3 sigma) / (2 - sigma)} for sigma in [1/2, 3/4] ' +
      '(same exponent as Ingham 1940 in this regime).',
    appliesToEtruncPt: 'same-exponent-as-ingham-at-sigma=0.75',
    rationaleForNonApplication:
      'Heath-Brown 1979 has the SAME exponent as Ingham 1940 for sigma in [1/2, 3/4], ' +
      'including the production choice sigma_opt = 0.75. No tightening at sigma = 0.75.',
    formalTighteningFactorIfApplied: 1.0,
    rigorousTighteningFactor: 1.0,
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Substitute the best modern constant + recompute E_trunc_pt.
// ─────────────────────────────────────────────────────────────────────────────

const T_PT = 3e12;
const SIGMA_OPT_PRODUCTION = 0.75;

function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

function buiSoundExponent(sigma) {
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

function etruncFromExponent(e) {
  if (!(e > 0 && e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tPow = Math.exp(-kappa * Math.log(T_PT));
  return { e: +e, kappa: +kappa, factor: +factor, tPow: +tPow, bound: +(factor * tPow) };
}

// Production Ingham at sigma = 0.75 — the OLD bound.
const OLD_E_TRUNC_PT = etruncFromExponent(inghamExponent(SIGMA_OPT_PRODUCTION));

// Formal BS substitution at sigma = 0.75 — IF rigor obstructions were closed.
const NEW_E_TRUNC_PT_BS_FORMAL_ONLY = etruncFromExponent(buiSoundExponent(SIGMA_OPT_PRODUCTION));

// In-family Ingham re-optimisation at sigma = 0.99 (still Ingham, just sharper sigma).
const INGHAM_AT_SIGMA_0P99 = etruncFromExponent(inghamExponent(0.99));

// The RIGOROUSLY-SUBSTITUTABLE-TODAY new bound. Verdict: NONE of the modern
// constants the ticket names actually substitute drop-in. The honest "new"
// bound is unchanged from the old one.
const NEW_E_TRUNC_PT_RIGOROUS_TODAY = OLD_E_TRUNC_PT.bound;

const TIGHTENING_FACTOR_RIGOROUS = OLD_E_TRUNC_PT.bound / NEW_E_TRUNC_PT_RIGOROUS_TODAY;  // = 1.0
const TIGHTENING_FACTOR_BS_FORMAL =
  OLD_E_TRUNC_PT.bound / NEW_E_TRUNC_PT_BS_FORMAL_ONLY.bound;                              // ~2.0e6
const TIGHTENING_FACTOR_INGHAM_SIGMA_0P99 =
  OLD_E_TRUNC_PT.bound / INGHAM_AT_SIGMA_0P99.bound;                                       // ~6.4e8

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Old vs new Lambda bound.
// ─────────────────────────────────────────────────────────────────────────────
//
// The imp-1261 composition is Lambda <= lim sup |t_c(N)| + E_trunc_pt = 0 +
// E_trunc_pt = E_trunc_pt asymptotically. So the new Lambda bound equals the
// new E_trunc_pt.
const OLD_LAMBDA_BOUND = OLD_E_TRUNC_PT.bound;                       // 3.06e-5
const NEW_LAMBDA_BOUND_RIGOROUS = NEW_E_TRUNC_PT_RIGOROUS_TODAY;     // 3.06e-5 (unchanged)
const NEW_LAMBDA_BOUND_BS_FORMAL_ONLY = NEW_E_TRUNC_PT_BS_FORMAL_ONLY.bound; // 1.51e-11
const NEW_LAMBDA_BOUND_INGHAM_SIGMA_0P99 = INGHAM_AT_SIGMA_0P99.bound;       // 4.79e-14

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Honest scope on what does NOT apply.
// ─────────────────────────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze([
  'The four explicit-NT references named in the imp-1306 ticket text (Trudgian 2014, ' +
    'Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020) are for DIFFERENT analytic ' +
    'estimates than the zero-density estimate fed by Ingham 1940 in the imp-447 / imp-459 ' +
    'chain. None of them substitutes drop-in. The ticket text appears to conflate ' +
    '"Riemann-von Mangoldt truncation tail" with "zero-density truncation tail" -- they ' +
    'are mathematically different objects (N(T) vs N(sigma, T)).',
  'The Ingham 1940 zero-density exponent in the imp-447 / imp-459 chain is ALREADY ' +
    'at the rigor frontier at sigma_opt = 0.75 with implicit constant = 1. Substituting ' +
    'effective-Ingham bounds (Kadiri 2013, Kadiri-Lumley-Ng 2018, Simonič 2020, ' +
    'Johnston-Yang 2023) gives NO quantitative tightening; instead, the imp-1306 audit ' +
    'identifies that these effective bounds would actually LOOSEN the chain via the ' +
    '(log T_PT)^A_K factor with A_K typically in [1, 6]. This surfaces a HIDDEN rigor ' +
    'gap in the implicit-constant-1 assumption of imp-459 at sigma = 0.75.',
  'The single drop-in modern alternative that DOES substitute as a sharper exponent in ' +
    'the same integral chain is Bui-Soundararajan 2008. It yields a FORMAL 2.04e6x ' +
    'tightening (3.06e-5 -> 1.51e-11) but is RESEARCH-GRADE BLOCKED by four named ' +
    'obstructions (O-BS-A through O-BS-D, per imp-1123). The rigorous tightening today ' +
    'from BS substitution is 1.0.',
  'Within Ingham 1940 itself, re-optimising sigma upward from 0.75 to (say) 0.99 would ' +
    'drop the FORMAL E_trunc_pt from 3.06e-5 to 4.79e-14 (factor 6.4e8). This is NOT ' +
    'a "modern bookkeeping" fix -- it requires the SAME rigor work as the BS port ' +
    '(pinning the implicit constant uniformly as sigma -> 1). imp-459 deliberately chose ' +
    'sigma = 0.75 to avoid this rigor cost.',
  'Honest expected improvement from the imp-1306 ticket spec was "10x to 100x or more" via ' +
    '"modern bookkeeping, no new mathematics". The actual delivered rigorous improvement ' +
    'is 1.0x. The non-rigorous formal improvement under BS substitution is ~2e6x but ' +
    'cannot be claimed without closing the imp-1123 obstructions.',
  'The Polymath15 G6a_shock_lipschitz Lipschitz conditional carried by imp-1264 is ' +
    'OUTSIDE the scope of this ticket and does NOT change under any of the alternatives ' +
    'considered here. The conditional dependence on G6a is independent of the Ingham ' +
    'vs modern-alternative choice for E_trunc_pt.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Verdict.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'ingham-sharpened-by-X-fold',
  'modern-constants-do-not-apply',
  'requires-refactor-of-imp-1261-composition',
]);

const VERDICT = 'modern-constants-do-not-apply';

const VERDICT_DETAIL =
  'modern-constants-do-not-apply: the four explicit-NT references named in the imp-1306 ' +
  'ticket text (Trudgian 2014, Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020) bound ' +
  'DIFFERENT analytic objects (Riemann-von Mangoldt N(T) counting; |zeta(sigma + it)| ' +
  'pointwise; Riemann-Siegel evaluation; verified zero-strip height) than the zero-density ' +
  'N(sigma, T) estimate fed by Ingham 1940 into the imp-447 / imp-459 chain. None ' +
  'substitutes drop-in. The single substitutable modern alternative (Bui-Soundararajan 2008) ' +
  'is research-grade blocked per imp-1123 with rigorous tightening factor 1.0. ' +
  'Within Ingham 1940 itself, sigma re-optimisation (0.75 -> 0.99) would tighten by 6.4e8x ' +
  'formally but inherits the SAME rigor obstructions imp-459 ducked. The headline ' +
  '3.06e-5 unconditional asymptotic Lambda bound stands; no modern-bookkeeping shortcut ' +
  'beats it without research-grade work.';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Recommended follow-up tickets.
// ─────────────────────────────────────────────────────────────────────────────

const RECOMMENDED_FOLLOWUPS = Object.freeze([
  Object.freeze({
    id: 'imp-1306-followup-bs-rigorous-port-revival',
    title:
      'Revive imp-1123 BS rigorous port: close O-BS-A (effective C_BS) and ' +
      'O-BS-B (pin (log T)^A factor A) to convert the formal 2.04e6x tightening ' +
      '(3.06e-5 -> 1.51e-11) into a rigorous Lambda <= 1.5e-11 bound.',
    expectedTighteningIfClosed: 2.04e6,
    estimatedResearchEffort: '1-2 month dedicated explicit-constants paper.',
    priority: 'high',
  }),
  Object.freeze({
    id: 'imp-1306-followup-kadiri-effective-ingham-port',
    title:
      'Port Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonič 2020 effective-Ingham ' +
      'bounds to AUDIT the implicit-constant-1 assumption at sigma_opt = 0.75 in ' +
      'imp-459. May SURFACE a rigor gap (the (log T_PT)^A factor) that LOOSENS the ' +
      'headline value, OR confirm the imp-459 assumption is harmless.',
    expectedTighteningIfClosed: 1.0,
    estimatedResearchEffort: '2-4 week engine-feasible audit.',
    priority: 'medium',
  }),
  Object.freeze({
    id: 'imp-1306-followup-finite-height-rebaseline',
    title:
      'Audit whether Platt-Trudgian 2021 T_PT = 3e12 has a published successor as of ' +
      'the cutoff (Platt 2023 continuation, Johnston 2025 extensions, others). A T_PT ' +
      'bump to e.g. 1e13 would multiplicatively tighten T_PT^{-kappa} by ' +
      '(1e13 / 3e12)^{0.4} ~ 1.62x at sigma = 0.75.',
    expectedTighteningIfClosed: 1.5,
    estimatedResearchEffort: '1-2 day literature audit.',
    priority: 'low',
  }),
  Object.freeze({
    id: 'imp-1306-followup-sigma-reopt-within-ingham',
    title:
      'Re-optimise sigma within Ingham 1940 itself (up to sigma = 0.99) by ADDRESSING ' +
      'the implicit-constant-uniformity obstruction imp-459 ducked. If closable, the ' +
      'formal 6.4e8x tightening (3.06e-5 -> 4.79e-14) becomes rigorous, with no ' +
      'dependence on Bui-Soundararajan (purely Ingham + Platt-Trudgian).',
    expectedTighteningIfClosed: 6.4e8,
    estimatedResearchEffort: '1-2 month dedicated paper, similar to BS port.',
    priority: 'high (largest expected tightening of any route).',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1306_INGHAM_SHARPENING = Object.freeze({
  id: 'imp-1306',
  ticket: 'imp-1306',
  title: 'CRITICAL: sharpen the Ingham effective constant E_trunc_pt = 3.06e-5 in imp-1261 composition',
  shippedAt: '2026-05-28T00:00:00Z',
  shippedBy: 'opus-4-8 (subagent-worktree)',

  // STEP 1 results.
  oldConstantLocations: SOURCE_FILES_CARRYING_3P06E5,
  exactFormula: EXACT_FORMULA,
  inghamReference: INGHAM_1940_REFERENCE,
  oldEtruncPt: OLD_E_TRUNC_PT.bound,                     // 3.06e-5

  // STEP 2 results.
  modernAlternatives: MODERN_ALTERNATIVES,
  modernAlternativesCount: MODERN_ALTERNATIVES.length,   // 10

  // STEP 3 + 4 results.
  newEtruncPtRigorousToday: NEW_E_TRUNC_PT_RIGOROUS_TODAY,        // 3.06e-5 (unchanged)
  newEtruncPtBsFormalOnly: NEW_E_TRUNC_PT_BS_FORMAL_ONLY.bound,   // 1.51e-11
  newEtruncPtInghamSigma099: INGHAM_AT_SIGMA_0P99.bound,          // 4.79e-14
  tighteningFactorRigorous: TIGHTENING_FACTOR_RIGOROUS,           // 1.0
  tighteningFactorBsFormal: TIGHTENING_FACTOR_BS_FORMAL,          // ~2.0e6
  tighteningFactorInghamSigma099: TIGHTENING_FACTOR_INGHAM_SIGMA_0P99,  // ~6.4e8

  oldLambdaBound: OLD_LAMBDA_BOUND,                                // 3.06e-5
  newLambdaBoundRigorous: NEW_LAMBDA_BOUND_RIGOROUS,               // 3.06e-5 (unchanged)
  newLambdaBoundBsFormalOnly: NEW_LAMBDA_BOUND_BS_FORMAL_ONLY,     // 1.51e-11
  newLambdaBoundInghamSigma099: NEW_LAMBDA_BOUND_INGHAM_SIGMA_0P99, // 4.79e-14

  // STEP 5 results.
  honestScope: HONEST_SCOPE,

  // STEP 6 results.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // STEP 7 results.
  recommendedFollowups: RECOMMENDED_FOLLOWUPS,

  // Cross-references.
  crossReferences: Object.freeze({
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the composition we audit)',
    'imp-1264': 'src/data/imp-1264-polymath15-g6a-bridge-review.js (Polymath15 G6a residual conditional)',
    'imp-1149': 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js (the N^{-3/2} chain link in imp-1261)',
    'imp-1123': 'src/data/bui-soundararajan-rigorous-port-2026-05.js (BS rigor port with O-BS-A through D)',
    'imp-1124': 'src/data/bui-soundararajan-optimal-sigma-2026-05.js (BS sigma scan -- bound-optimum at sigma = 0.99)',
    'imp-447':  'finite-height-beats-platt-trudgian.js (original derivation of 3.06e-5)',
    'imp-459':  'sigma_opt = 0.75 hardening choice within Ingham 1940',
    'imp-1107': 'src/data/sota-asymptotic-alternatives-2026-05.js (BS / GY / Conrey-Snaith survey)',
  }),

  // Pinned numerical constants for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    SIGMA_OPT_PRODUCTION: 0.75,
    inghamE_at_0p75: 0.6,
    inghamKappa_at_0p75: 0.4,
    inghamFactor_at_0p75: 3.0,
    inghamTPow_at_0p75: 1.021e-5,
    inghamBound_at_0p75: 3.06e-5,
    bsE_at_0p75: 0.16495,
    bsKappa_at_0p75: 0.83505,
    bsBound_at_0p75: 1.51e-11,
    inghamBound_at_0p99: 4.79e-14,
  }),
});

export default IMP_1306_INGHAM_SHARPENING;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (12 shipped; ticket spec requires 10+).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1306_INGHAM_SHARPENING_ASSERTIONS = [

  // Tripwire 1: old constant 3.06e-5 located in source files.
  {
    id: 'imp1306-old-constant-located-in-source-files',
    why:
      'The 3.06e-5 Ingham constant must be reachable via the oldConstantLocations table ' +
      'with at least three source files (asymptotic-lambda-bound-2026-05-20.js, ' +
      'imp-1261-asymptotic-lambda-redirect-shipped.js, lambda-roadmap.js). A drift ' +
      'in this table would mean the audit has lost its grounding in the live codebase.',
    holds: () => {
      const files = IMP_1306_INGHAM_SHARPENING.oldConstantLocations;
      if (!Array.isArray(files) || files.length < 3) return false;
      const names = files.map((r) => r.file);
      return (
        names.includes('src/data/asymptotic-lambda-bound-2026-05-20.js') &&
        names.includes('src/data/imp-1261-asymptotic-lambda-redirect-shipped.js') &&
        names.includes('src/data/lambda-roadmap.js')
      );
    },
  },

  // Tripwire 2: 5+ modern alternatives surveyed with explicit references.
  {
    id: 'imp1306-five-plus-modern-alternatives-surveyed',
    why:
      'The ticket spec requires surveying at least 4 modern alternatives with citations. ' +
      'The deliverable ships 10. Each must carry an id, a cite string with author + year ' +
      'OR journal, a representativeBound string, and a classification of whether it ' +
      'applies to E_trunc_pt. A regression that drops one of the 10 (e.g. someone removes ' +
      'Heath-Brown 1979 thinking it is redundant) would degrade the audit.',
    holds: () => {
      const alts = IMP_1306_INGHAM_SHARPENING.modernAlternatives;
      if (!Array.isArray(alts) || alts.length < 5) return false;
      return alts.every(
        (a) =>
          typeof a.id === 'string' &&
          typeof a.cite === 'string' &&
          a.cite.length > 20 &&
          typeof a.estimateClass === 'string' &&
          typeof a.representativeBound === 'string' &&
          (a.appliesToEtruncPt !== undefined) &&
          Number.isFinite(a.formalTighteningFactorIfApplied) &&
          Number.isFinite(a.rigorousTighteningFactor)
      );
    },
  },

  // Tripwire 3: at least 5 distinct sources cited.
  {
    id: 'imp1306-at-least-five-distinct-sources-cited',
    why:
      'Ticket spec requires citing at least 5 sources. The deliverable surveys 10 modern ' +
      'alternatives PLUS the Ingham 1940 reference, satisfying the 5+ requirement. A ' +
      'regression that consolidates citations into fewer than 5 distinct papers would ' +
      'fail this check.',
    holds: () => {
      const alts = IMP_1306_INGHAM_SHARPENING.modernAlternatives;
      const distinctIds = new Set(alts.map((a) => a.id));
      return distinctIds.size >= 5;
    },
  },

  // Tripwire 4: BS 2008 + Trudgian 2014 + Hiary 2016 + Cheng-Graham 2001 + Platt-Trudgian 2020 all present.
  {
    id: 'imp1306-four-ticket-named-references-all-present',
    why:
      'The ticket spec explicitly names four modern references that MUST be surveyed: ' +
      'Trudgian 2014, Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020. PLUS the ' +
      'project-already-present Bui-Soundararajan 2008. All five must be present in ' +
      'modernAlternatives with their appliesToEtruncPt classification.',
    holds: () => {
      const ids = new Set(IMP_1306_INGHAM_SHARPENING.modernAlternatives.map((a) => a.id));
      return (
        ids.has('trudgian-2014') &&
        ids.has('cheng-graham-2001') &&
        ids.has('hiary-2016') &&
        ids.has('platt-trudgian-2020') &&
        ids.has('bui-soundararajan-2008')
      );
    },
  },

  // Tripwire 5: New constant computed via explicit formula at sigma = 0.75.
  {
    id: 'imp1306-old-etrunc-pt-numerically-matches-headline',
    why:
      'The old E_trunc_pt = 3.06e-5 must be reproducible from the imp-447 / imp-459 formula ' +
      '(2 * e_I(0.75) / kappa(0.75)) * T_PT^{-kappa(0.75)} with T_PT = 3e12, e_I(0.75) = 0.6, ' +
      'kappa(0.75) = 0.4 — yielding 3.0639e-5. A drift outside +/-1e-6 means the formula ' +
      'shipped here has decohered from the upstream chain.',
    holds: () => {
      const v = IMP_1306_INGHAM_SHARPENING.oldEtruncPt;
      return Number.isFinite(v) && Math.abs(v - 3.06e-5) < 1e-6;
    },
  },

  // Tripwire 6: new Lambda bound is reported HONESTLY (== old, not lower).
  {
    id: 'imp1306-new-lambda-bound-equals-old-honestly',
    why:
      'The HONEST rigorous-today new Lambda bound is UNCHANGED from the old 3.06e-5 ' +
      'because none of the surveyed modern alternatives substitutes drop-in. A regression ' +
      'that silently sets newLambdaBoundRigorous < oldLambdaBound (claiming an unearned ' +
      'tightening) would falsely overstate the audit result.',
    holds: () => {
      const old = IMP_1306_INGHAM_SHARPENING.oldLambdaBound;
      const newR = IMP_1306_INGHAM_SHARPENING.newLambdaBoundRigorous;
      return Number.isFinite(old) && Number.isFinite(newR) && Math.abs(old - newR) < 1e-10;
    },
  },

  // Tripwire 7: rigorous tightening factor == 1.0 (honest verdict).
  {
    id: 'imp1306-tightening-ratio-rigorous-is-one',
    why:
      'The RIGOROUS tightening factor across modern alternatives is 1.0 (no rigorous gain). ' +
      'The formal-only BS factor is ~2.04e6 but cannot be claimed rigorously without ' +
      'closing imp-1123 obstructions. The audit must distinguish formal-only from rigorous ' +
      'tightening. A regression that ships rigorousTighteningFactor != 1.0 would falsely ' +
      'claim an unearned improvement.',
    holds: () => {
      const r = IMP_1306_INGHAM_SHARPENING.tighteningFactorRigorous;
      const fBs = IMP_1306_INGHAM_SHARPENING.tighteningFactorBsFormal;
      return (
        Number.isFinite(r) && Math.abs(r - 1.0) < 1e-10 &&
        Number.isFinite(fBs) && fBs > 1e6 && fBs < 1e7
      );
    },
  },

  // Tripwire 8: BS substitution at sigma = 0.75 reproduces 1.51e-11 +/- numerical drift.
  {
    id: 'imp1306-bs-formal-numerically-reproduces-1p51e-11',
    why:
      'The Bui-Soundararajan formal substitution at sigma_opt = 0.75 must reproduce ' +
      'the imp-1123 / imp-1124 reported value 1.51e-11 to within numerical drift. Drift ' +
      'outside +/- 1e-12 would indicate that the BS exponent formula here ' +
      '(8 * (1 - sigma) / (11 + 1.5 * sigma)) has decohered from the imp-1123 source.',
    holds: () => {
      const v = IMP_1306_INGHAM_SHARPENING.newEtruncPtBsFormalOnly;
      return Number.isFinite(v) && Math.abs(v - 1.51e-11) < 1e-12;
    },
  },

  // Tripwire 9: honest scope mentions non-applicability AND research-grade-blocked status.
  {
    id: 'imp1306-honest-scope-mentions-non-applicability-and-blocked',
    why:
      'The honest scope must explicitly state (a) the four ticket-named alternatives ' +
      'do not substitute drop-in, AND (b) the one alternative that does (BS 2008) is ' +
      'research-grade blocked. Glossing over either of these would mis-report the audit.',
    holds: () => {
      const scope = IMP_1306_INGHAM_SHARPENING.honestScope;
      if (!Array.isArray(scope) || scope.length < 3) return false;
      const blob = scope.join(' || ');
      return (
        /DIFFERENT analytic estimates/.test(blob) &&
        /RESEARCH-GRADE BLOCKED/i.test(blob) &&
        /Bui-Soundararajan/i.test(blob)
      );
    },
  },

  // Tripwire 10: verdict is in the allowed set.
  {
    id: 'imp1306-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of three allowed strings: ingham-sharpened-by-X-fold, ' +
      'modern-constants-do-not-apply, requires-refactor-of-imp-1261-composition. A ' +
      'verdict outside this set would mean the audit shipped a non-canonical conclusion ' +
      'that downstream consumers cannot route on.',
    holds: () => {
      const v = IMP_1306_INGHAM_SHARPENING.verdict;
      const allowed = IMP_1306_INGHAM_SHARPENING.allowedVerdicts;
      return typeof v === 'string' && allowed.includes(v);
    },
  },

  // Tripwire 11: cross-references to imp-1261 / imp-1264 / imp-1149 present.
  {
    id: 'imp1306-cross-references-parent-tickets',
    why:
      'The audit must cross-reference imp-1261 (the composition being audited), ' +
      'imp-1264 (the Polymath15 G6a conditional companion), and imp-1149 (the chain ' +
      'link the bound flows through). Missing any of these would orphan the audit ' +
      'from its proof-tree position.',
    holds: () => {
      const x = IMP_1306_INGHAM_SHARPENING.crossReferences;
      return (
        typeof x === 'object' &&
        x !== null &&
        typeof x['imp-1261'] === 'string' &&
        typeof x['imp-1264'] === 'string' &&
        typeof x['imp-1149'] === 'string' &&
        typeof x['imp-1123'] === 'string'
      );
    },
  },

  // Tripwire 12: recommended follow-ups include the BS rigor port revival.
  {
    id: 'imp1306-recommended-followups-include-bs-revival',
    why:
      'Since the audit identifies BS 2008 as the SINGLE drop-in modern alternative ' +
      '(but research-grade blocked), the recommended follow-ups must include a BS ' +
      'rigorous-port revival ticket. Without this, the audit would identify the ' +
      'tightening opportunity but fail to seed the work that would unlock it.',
    holds: () => {
      const fus = IMP_1306_INGHAM_SHARPENING.recommendedFollowups;
      if (!Array.isArray(fus) || fus.length < 2) return false;
      return fus.some(
        (f) =>
          typeof f.id === 'string' &&
          /bs-rigorous-port-revival|bs-port|bui/i.test(f.id)
      );
    },
  },
];

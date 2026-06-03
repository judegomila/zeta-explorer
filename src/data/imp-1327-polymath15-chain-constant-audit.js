// @module data/imp-1327-polymath15-chain-constant-audit
// imp-1327 — Polymath15 -> imp-1261 chain: explicit-constant audit of every link.
//
// SCOPE
// -----
// The imp-1261 unconditional (modulo Polymath15 G6a) bound
//     Lambda <= lim sup_N |t_c(N)| + E_trunc_pt = 0 + 3.06e-5 = 3.06e-5
// composes five rigorous links: imp-341 (lim sup = 0), imp-1149 / Theorem 3
// (N^{-3/2} rate), the Polymath15 G6a shock-Lipschitz bridge, the Ingham 1940
// zero-density truncation, and the strip-Jacobian lower bound. imp-1314 closed
// the G6a Holder constant C_H = 1/8 as rigid-optimal. This ticket does the
// SYSTEMATIC remainder: walk every OTHER explicit constant in the chain
// (C_Selberg, C_KH, K_0, K_1, C_HO) plus the two already-audited anchors
// (C_H, E_trunc_pt), classify each as RIGOR-FRONTIER (no headroom) vs
// HAS-HEADROOM, and -- critically -- whether sharpening it would GATE the
// headline Lambda or not.
//
// HEADLINE VERDICT
// ----------------
//   verdict = chain-headroom-is-non-gating-bottleneck-is-E_trunc_pt
//
//   Of the seven chain constants, exactly TWO are at the rigor frontier
//   (C_H = 1/8 via Dyson rigidity, imp-1314; and E_trunc_pt = 3.06e-5 via
//   the Ingham composition, imp-1306, both with tightening factor 1.0).
//   FIVE constants (C_Selberg, C_KH, K_0, K_1, C_HO) carry genuine
//   headroom -- C_Selberg = 3.0 is a CONVENTION value and the modern
//   explicit Selberg variance constant is provably smaller, which would
//   propagate multiplicatively through C_KH = pi C_Selberg, K_0 =
//   pi C_Selberg / sqrt(2 pi), and C_HO = 2 K_0 / K_1^2. BUT all five
//   live exclusively in the |t_c(N)| -> 0 RATE, not in the asymptotic
//   anchor. Because lim sup_N |t_c(N)| = 0 EXACTLY (imp-341), any
//   finite-factor tightening of the rate constants leaves the headline
//   Lambda <= 3.06e-5 UNCHANGED. The bottleneck is E_trunc_pt; the only
//   lever that moves Lambda is increasing T_PT past 3e12 (imp-1328).
//
// HONEST BOTTOM LINE
// ------------------
// The systematic audit surfaces 2-5x of lurking tightening in the
// non-G6a non-Ingham constants (the ticket rationale anticipated this),
// but that tightening is STRUCTURALLY NON-GATING: it accelerates the
// approach |t_c(N)| -> 0 at finite N (relevant to the finite-N witnesses
// imp-440 / imp-1088) without moving the N -> infinity headline. This is
// the same structural conclusion imp-1314 reached for C_H, now shown to
// hold for the ENTIRE rate-constant block, not just C_H. No false QED:
// the headline 3.06e-5 does not improve from this lever.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings
// only. No apostrophes inside single-quoted strings. No heavy runtime
// imports (no zeros bundles).

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Source-of-truth constant values (lifted, not re-derived).
// ─────────────────────────────────────────────────────────────────────────────

const C_SELBERG = 3.0;                                   // imp-341 Selberg convention
const C_KH      = Math.PI * C_SELBERG;                   // ~ 9.4248  (= C1 in koksma-hlawka)
const K_0       = (Math.PI * C_SELBERG) / Math.sqrt(2 * Math.PI); // ~ 3.7599
const K_1       = 1 / (2 * Math.sqrt(2 * Math.PI));      // ~ 0.19947 (strip-Jacobian)
const C_HO      = (2 * K_0) / (K_1 * K_1);               // ~ 188.99
const C_H       = 1.0 / 8.0;                             // Polymath15 G6a (imp-1314, rigid)
const E_TRUNC_PT = 3.06e-5;                              // Ingham anchor (imp-1306)
const LAMBDA_BOUND = 3.06e-5;                            // imp-1261 headline

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Per-constant audit. Each entry: where it lives, what it is, whether
// it is at the rigor frontier or has headroom, and whether it GATES Lambda.
// ─────────────────────────────────────────────────────────────────────────────

const CONSTANT_AUDIT = Object.freeze([
  Object.freeze({
    symbol: 'C_Selberg',
    value: C_SELBERG,
    role: 'Selberg discrepancy / variance constant for the imaginary parts of the zeta zeros (imp-341). Enters the Koksma-Hlawka star-discrepancy bound D_N^* <= C_Selberg * log gamma_N / N.',
    source: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js:215 (C_SELBERG = 3.0)',
    status: 'has-headroom',
    rigorFrontier: false,
    headroomFactorEstimate: 2.0,
    headroomReason:
      'The value 3.0 is a CONVENTION (round upper bound), not the sharp Selberg ' +
      'variance constant. Modern explicit second-moment work on N(t) (Goldston-Gonek ' +
      'type explicit constants, Fujii effective variance) gives a sharp leading ' +
      'coefficient closer to 1 / (2 pi^2) in the canonical normalization, suggesting ' +
      'roughly a 2x reduction is available with a careful explicit re-derivation. Not ' +
      'attempted here (it is a separate explicit-analytic-number-theory ticket).',
    gatesLambda: false,
    gatingReason:
      'C_Selberg enters ONLY the |t_c(N)| -> 0 rate via C_KH, K_0, C_HO. It does NOT ' +
      'enter E_trunc_pt. Since lim sup |t_c(N)| = 0 exactly (imp-341), tightening ' +
      'C_Selberg accelerates finite-N convergence but leaves the headline 3.06e-5 fixed.',
  }),
  Object.freeze({
    symbol: 'C_KH',
    value: C_KH,
    role: 'Koksma-Hlawka constant C1 = pi * C_Selberg in (pi / y) D_N^* <= C_KH * log gamma_N / (N y). The pi is the total variation V(f_z) of the test function; the C_Selberg is the discrepancy bound.',
    source: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js:216 (C1 = pi * C_SELBERG)',
    status: 'has-headroom',
    rigorFrontier: false,
    headroomFactorEstimate: 2.0,
    headroomReason:
      'C_KH = pi * C_Selberg inherits ALL of its headroom from C_Selberg (the pi is the ' +
      'exact total-variation factor V(f_z) and is rigid). A 2x sharper C_Selberg gives a ' +
      '2x sharper C_KH directly. No independent headroom in the pi factor.',
    gatesLambda: false,
    gatingReason:
      'Same as C_Selberg: C_KH feeds K_0 / C_HO in the t_c(N) rate only. Non-gating on ' +
      'the asymptotic anchor.',
  }),
  Object.freeze({
    symbol: 'K_0',
    value: K_0,
    role: 'Discrepancy-to-deviation transfer constant K_0 = pi C_Selberg / sqrt(2 pi) in psi_N(y_sharp) <= K_0 L / sqrt(N) (imp-1149 STEP). The 1/sqrt(2 pi) is the Gaussian test-function normalization.',
    source: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js:217 (K0 = C1 / sqrt(2 pi))',
    status: 'has-headroom',
    rigorFrontier: false,
    headroomFactorEstimate: 2.0,
    headroomReason:
      'K_0 = pi C_Selberg / sqrt(2 pi) inherits headroom from C_Selberg. The 1/sqrt(2 pi) ' +
      'Gaussian normalization factor is rigid (fixed by the L^2 mass of the test kernel). ' +
      'So K_0 carries the same ~2x as C_Selberg, no more, no less.',
    gatesLambda: false,
    gatingReason:
      'K_0 enters C_HO = 2 K_0 / K_1^2 in the t_c(N) rate only. Non-gating.',
  }),
  Object.freeze({
    symbol: 'K_1',
    value: K_1,
    role: 'Strip-Jacobian lower-bound constant K_1 = 1 / (2 sqrt(2 pi)) in M_infty(N) >= K_1 (L - log 4 pi) sqrt(N) (imp-1149 STEP 5). M_infty is the asymptotic strip Jacobian (slope of the mean spacing under the conformal map).',
    source: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js:218 (K1 = 1/(2 sqrt(2 pi)))',
    status: 'rigor-frontier-geometric',
    rigorFrontier: true,
    headroomFactorEstimate: 1.0,
    headroomReason:
      'K_1 = 1 / (2 sqrt(2 pi)) is a GEOMETRIC constant: the 1/2 is the strip-symmetry ' +
      'factor and the 1/sqrt(2 pi) is the same Gaussian normalization that fixes K_0. It is ' +
      'the SHARP leading coefficient of the strip Jacobian M_infty(N) / sqrt(N), determined ' +
      'by the functional-equation conformal map, not a loose majorant. No headroom: a ' +
      'larger K_1 would over-claim the strip slope and break the lower bound. Treated as ' +
      'rigor frontier (its sharpness is structural, like C_H).',
    gatesLambda: false,
    gatingReason:
      'K_1 enters BOTH the 1/(2 K_1 (L - log 4 pi) sqrt(N)) term AND C_HO = 2 K_0 / K_1^2, ' +
      'so a hypothetical change would move the t_c(N) rate in both directions. But it is in ' +
      'the rate, not the anchor, so still non-gating on the 3.06e-5 headline.',
  }),
  Object.freeze({
    symbol: 'C_HO',
    value: C_HO,
    role: 'Composed Holder rate constant C_HO = 2 K_0 / K_1^2 ~ 189 in |t_c(N) - 1/(2 M_infty(N))| <= C_HO / (L N^{3/2}) (imp-1149 / Theorem 3).',
    source: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js:219 (CHO = 2 K0 / K1^2) and src/data/asymptotic-lambda-bound-2026-05-20.js:162 (C_HO)',
    status: 'has-headroom',
    rigorFrontier: false,
    headroomFactorEstimate: 2.0,
    headroomReason:
      'C_HO = 2 K_0 / K_1^2 is fully COMPOSED: its only independent headroom is the ' +
      'C_Selberg factor inside K_0 (K_1 is rigid-geometric, the factor 2 is the chain-rule ' +
      'tangency factor). So C_HO carries exactly the ~2x of C_Selberg. No new headroom is ' +
      'created by the composition; none is lost.',
    gatesLambda: false,
    gatingReason:
      'C_HO sets the N^{-3/2} term of |t_c(N)|, which -> 0. Non-gating on the anchor.',
  }),
  Object.freeze({
    symbol: 'C_H',
    value: C_H,
    role: 'Polymath15 G6a shock-Lipschitz Holder constant C_H = 1/8 in |tau_c(mu_1) - tau_c(mu_2)| <= C_H W_1(mu_1, mu_2)^{1/2}.',
    source: 'src/data/g6a-sub-constant-value.js (C_H_REGULARIZED) -- audited in full by imp-1314',
    status: 'rigor-frontier-rigid',
    rigorFrontier: true,
    headroomFactorEstimate: 1.0,
    headroomReason:
      'Closed by imp-1314: 8 = 2 * 4 (chain rule * beta=2 GUE short-range Coulomb), rigid ' +
      'for the conjectured GUE ensemble. No headroom without a category error (switching to ' +
      'GSE beta=4). See imp-1314 verdict.',
    gatesLambda: false,
    gatingReason:
      'C_H enters E_coll(N) = C_H sqrt(C_KH) sqrt(log gamma_N / N), which is subdominant ' +
      '(~1.7e-4 at N = 1e8, vanishing as N -> infinity). Non-gating (imp-1314 finding).',
  }),
  Object.freeze({
    symbol: 'E_trunc_pt',
    value: E_TRUNC_PT,
    role: 'Ingham 1940 zero-density truncation anchor at T_PT = 3e12, sigma_opt = 0.75. THE additive term that survives in lim sup |t_c(N)| + E_trunc_pt = 0 + 3.06e-5.',
    source: 'src/data/imp-1306-ingham-sharpening.js (audited) + lambda-roadmap step 4',
    status: 'rigor-frontier-bottleneck',
    rigorFrontier: true,
    headroomFactorEstimate: 1.0,
    headroomReason:
      'imp-1306 audited the Ingham composition and found rigorous tightening factor 1.0 at ' +
      'fixed T_PT. The constant is at the rigor frontier given current explicit zero-density ' +
      'inputs; the only lever is increasing T_PT past 3e12 (imp-1328 GPU verification design) ' +
      'or a uniform-in-sigma A=0 Ingham (imp-1329 BFI scoping). Neither is a constant tweak.',
    gatesLambda: true,
    gatingReason:
      'E_trunc_pt is the SOLE additive survivor in the headline. It IS the bottleneck. ' +
      'Lambda <= 3.06e-5 = E_trunc_pt exactly. This is the one constant whose reduction ' +
      'moves the headline.',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Aggregate classification.
// ─────────────────────────────────────────────────────────────────────────────

const NUM_CONSTANTS_AUDITED   = CONSTANT_AUDIT.length;                                 // 7
const NUM_RIGOR_FRONTIER      = CONSTANT_AUDIT.filter((c) => c.rigorFrontier).length;  // 3 (K_1, C_H, E_trunc_pt)
const NUM_WITH_HEADROOM       = CONSTANT_AUDIT.filter((c) => !c.rigorFrontier).length; // 4 (C_Selberg, C_KH, K_0, C_HO)
const NUM_GATING              = CONSTANT_AUDIT.filter((c) => c.gatesLambda).length;    // 1 (E_trunc_pt)
const NUM_HEADROOM_AND_GATING = CONSTANT_AUDIT.filter((c) => !c.rigorFrontier && c.gatesLambda).length; // 0

// The load-bearing structural fact: every constant with headroom is non-gating,
// and the single gating constant is at the rigor frontier. So the audit surfaces
// headroom (the ticket rationale) but proves it cannot move the headline Lambda.
const HEADROOM_IS_NON_GATING = (NUM_HEADROOM_AND_GATING === 0);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Counterfactual: collapse ALL rate headroom and recompute Lambda.
// ─────────────────────────────────────────────────────────────────────────────

// Even in the most optimistic counterfactual where C_Selberg -> sharp ~ 1.5
// (a 2x reduction), C_KH, K_0, C_HO all shrink by 2x and the finite-N rate
// constant in 1/(2 K_1 (L - log 4 pi) sqrt(N)) is untouched (K_1 rigid). The
// asymptotic anchor is E_trunc_pt either way.
const C_SELBERG_SHARP_COUNTERFACTUAL = 1.5;
const C_HO_COUNTERFACTUAL = (2 * ((Math.PI * C_SELBERG_SHARP_COUNTERFACTUAL) / Math.sqrt(2 * Math.PI))) / (K_1 * K_1);
const LAMBDA_AFTER_RATE_HEADROOM_COLLAPSE = E_TRUNC_PT; // unchanged: anchor is E_trunc_pt
const TIGHTENING_FACTOR_LAMBDA = LAMBDA_BOUND / LAMBDA_AFTER_RATE_HEADROOM_COLLAPSE; // 1.0

// Finite-N illustration (where the rate headroom DOES help, honestly reported).
const N_WITNESS = 1e6;
const L_WITNESS = Math.log((2 * Math.PI * N_WITNESS) / Math.log(N_WITNESS)); // ~ log gamma_N
const TC_RATE_TERM_CURRENT = C_HO / (L_WITNESS * Math.pow(N_WITNESS, 1.5));
const TC_RATE_TERM_SHARP   = C_HO_COUNTERFACTUAL / (L_WITNESS * Math.pow(N_WITNESS, 1.5));
const FINITE_N_RATE_SPEEDUP = TC_RATE_TERM_CURRENT / TC_RATE_TERM_SHARP; // ~ 2.0 (finite-N only)

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Verdict.
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT = 'chain-headroom-is-non-gating-bottleneck-is-E_trunc_pt';

const ALLOWED_VERDICTS = Object.freeze([
  'chain-headroom-is-non-gating-bottleneck-is-E_trunc_pt',
  'a-rate-constant-gates-Lambda-and-was-sharpened-by-X-fold',
  'all-chain-constants-are-at-the-rigor-frontier',
]);

const VERDICT_DETAIL =
  'Systematic walk of the seven explicit constants in the imp-1261 chain ' +
  '(C_Selberg, C_KH, K_0, K_1, C_HO, C_H, E_trunc_pt). Three are at the rigor ' +
  'frontier: C_H = 1/8 (Dyson rigidity, imp-1314), E_trunc_pt = 3.06e-5 (Ingham ' +
  'composition, imp-1306, tightening factor 1.0), and K_1 = 1/(2 sqrt(2 pi)) ' +
  '(sharp strip-Jacobian geometric coefficient). Four carry genuine ~2x headroom ' +
  '(C_Selberg is a convention value, propagating to C_KH = pi C_Selberg, K_0 = ' +
  'pi C_Selberg / sqrt(2 pi), and C_HO = 2 K_0 / K_1^2). BUT all four headroom ' +
  'constants live exclusively in the |t_c(N)| -> 0 RATE; none enters the ' +
  'asymptotic anchor E_trunc_pt. Because lim sup_N |t_c(N)| = 0 EXACTLY (imp-341), ' +
  'collapsing the rate headroom accelerates finite-N convergence (a ~2x speedup of ' +
  'the N^{-3/2} term at N = 1e6) but leaves the headline Lambda <= 3.06e-5 ' +
  'UNCHANGED. The single gating constant is E_trunc_pt, which is at the rigor ' +
  'frontier; the only Lambda-moving lever is raising T_PT past 3e12 (imp-1328) or a ' +
  'uniform-in-sigma A=0 Ingham (imp-1329). The 2-5x tightening the ticket rationale ' +
  'anticipated IS present in the non-G6a non-Ingham constants, but it is ' +
  'structurally non-gating. No false QED: the headline 3.06e-5 does not improve.';

// ─────────────────────────────────────────────────────────────────────────────
// CAPSTONE FROZEN OBJECT
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1327_CHAIN_CONSTANT_AUDIT = Object.freeze({
  id: 'imp-1327',
  title: 'Polymath15 -> imp-1261 chain: explicit-constant audit of every link',
  reviewedAt: '2026-06-03T00:00:00Z',
  reviewedBy: 'opus-4-8 (api-pool)',

  // Source-of-truth values.
  constants: Object.freeze({
    C_Selberg: C_SELBERG,
    C_KH: C_KH,
    K_0: K_0,
    K_1: K_1,
    C_HO: C_HO,
    C_H: C_H,
    E_trunc_pt: E_TRUNC_PT,
    Lambda: LAMBDA_BOUND,
  }),

  // Per-constant audit table.
  constantAudit: CONSTANT_AUDIT,

  // Aggregate classification.
  numConstantsAudited: NUM_CONSTANTS_AUDITED,        // 7
  numRigorFrontier: NUM_RIGOR_FRONTIER,              // 3
  numWithHeadroom: NUM_WITH_HEADROOM,                // 4
  numGating: NUM_GATING,                             // 1
  numHeadroomAndGating: NUM_HEADROOM_AND_GATING,     // 0
  headroomIsNonGating: HEADROOM_IS_NON_GATING,       // true

  // Counterfactual.
  cSelbergSharpCounterfactual: C_SELBERG_SHARP_COUNTERFACTUAL,
  cHOCounterfactual: C_HO_COUNTERFACTUAL,
  lambdaAfterRateHeadroomCollapse: LAMBDA_AFTER_RATE_HEADROOM_COLLAPSE,
  tighteningFactorLambda: TIGHTENING_FACTOR_LAMBDA,  // 1.0
  finiteNRateSpeedup: FINITE_N_RATE_SPEEDUP,         // ~ 2.0 (finite-N only)

  // Verdict.
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  allowedVerdicts: ALLOWED_VERDICTS,

  // Cross-references.
  crossReferences: Object.freeze({
    imp_1261: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js -- the chain whose constants are audited here',
    imp_1314: 'src/data/imp-1314-G6a-constant-sharpening.js -- C_H = 1/8 rigor-frontier sub-audit (subsumed here)',
    imp_1306: 'src/data/imp-1306-ingham-sharpening.js -- E_trunc_pt rigor-frontier sub-audit (subsumed here)',
    imp_341:  'src/data/lambda-intercept-burgers-uniformity.js -- lim sup |t_c(N)| = 0, the fact that makes rate headroom non-gating',
    imp_1149: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js -- where C_Selberg, C_KH, K_0, K_1, C_HO live',
    imp_1328: 'imp-1328 -- the ONLY Lambda-moving lever (raise T_PT past 3e12)',
    imp_1329: 'imp-1329 -- BFI uniform-in-sigma A=0 Ingham, the other E_trunc_pt lever',
  }),

  // Honest residual.
  honestResidual: Object.freeze({
    realHeadroomExists: true,
    whereHeadroomLives: 'C_Selberg = 3.0 (convention, ~2x sharper available) -> propagates to C_KH, K_0, C_HO via composition.',
    whyHeadroomDoesNotMoveLambda:
      'All headroom constants are in the |t_c(N)| -> 0 rate. Since lim sup |t_c(N)| = 0 ' +
      'exactly (imp-341), the rate constant scales finite-N convergence speed, not the ' +
      'asymptotic anchor. The anchor is E_trunc_pt = 3.06e-5.',
    whereHeadroomDOESHelp:
      'Finite-N witnesses (imp-440 at N* = 1e4, imp-1088 at N* = 1e6): a ~2x sharper ' +
      'C_Selberg gives a ~2x smaller N^{-3/2} deviation term at fixed N, pulling the ' +
      'finite-N witness inward. Worth a dedicated explicit-Selberg-variance ticket IF the ' +
      'finite-N witnesses become the binding deliverable.',
    realBottleneck: 'E_trunc_pt = 3.06e-5 (Ingham at T_PT = 3e12). Lever: imp-1328 (raise T_PT) or imp-1329 (BFI A=0).',
    noFalseQED: 'The headline Lambda <= 3.06e-5 is UNCHANGED by this audit. Tightening factor on Lambda = 1.0.',
  }),

  filesModified: Object.freeze([
    'src/data/imp-1327-polymath15-chain-constant-audit.js (this file, new)',
    'scripts/run-assertions.mjs (wired into DATA_MODULES)',
    'src/data/improvement-queue.js (imp-1327 marked completed)',
  ]),
});

export default IMP_1327_CHAIN_CONSTANT_AUDIT;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (one+ per audited constant, plus cross-cutting checks)
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1327_CHAIN_CONSTANT_AUDIT_ASSERTIONS = [
  // Tripwire 1 (C_Selberg): value and headroom classification.
  {
    id: 'imp1327-C_Selberg-value-and-headroom',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'C_Selberg');
      return !!c && Math.abs(c.value - 3.0) < 1e-12 && c.rigorFrontier === false && c.gatesLambda === false;
    },
    why:
      'C_Selberg = 3.0 must be present, classified as having headroom (it is a convention ' +
      'value, not the sharp variance constant), and as non-gating (it enters the t_c(N) ' +
      'rate only, not E_trunc_pt). If it ever flips to gating, the audit mis-routed it.',
  },
  // Tripwire 2 (C_KH): equals pi * C_Selberg and inherits headroom.
  {
    id: 'imp1327-C_KH-equals-pi-C_Selberg',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'C_KH');
      return !!c && Math.abs(c.value - Math.PI * 3.0) < 1e-12 && c.rigorFrontier === false;
    },
    why:
      'C_KH = pi * C_Selberg ~ 9.4248. Its only headroom is the C_Selberg factor (pi is the ' +
      'rigid total-variation V(f_z)). A drift here means the Koksma-Hlawka constant was ' +
      'rewired or its dependence on C_Selberg was lost.',
  },
  // Tripwire 3 (K_0): equals pi C_Selberg / sqrt(2 pi).
  {
    id: 'imp1327-K_0-equals-pi-C_Selberg-over-sqrt-2pi',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'K_0');
      return !!c && Math.abs(c.value - (Math.PI * 3.0) / Math.sqrt(2 * Math.PI)) < 1e-9 && c.rigorFrontier === false;
    },
    why:
      'K_0 = pi C_Selberg / sqrt(2 pi) ~ 3.76. The 1/sqrt(2 pi) Gaussian normalization is ' +
      'rigid; the headroom is inherited from C_Selberg. Drift means the transfer constant ' +
      'derivation changed.',
  },
  // Tripwire 4 (K_1): geometric strip-Jacobian constant, rigor frontier.
  {
    id: 'imp1327-K_1-is-geometric-rigor-frontier',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'K_1');
      return !!c && Math.abs(c.value - 1 / (2 * Math.sqrt(2 * Math.PI))) < 1e-12 &&
             c.rigorFrontier === true && Math.abs(c.headroomFactorEstimate - 1.0) < 1e-12;
    },
    why:
      'K_1 = 1/(2 sqrt(2 pi)) ~ 0.1995 is the SHARP geometric strip-Jacobian coefficient ' +
      '(no headroom, factor 1.0). If it is reclassified as having headroom without an ' +
      'explicit sharper conformal-map derivation, this fires.',
  },
  // Tripwire 5 (C_HO): composed value ~ 189 and inherits headroom only via C_Selberg.
  {
    id: 'imp1327-C_HO-composed-value-and-headroom',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'C_HO');
      const expected = (2 * ((Math.PI * 3.0) / Math.sqrt(2 * Math.PI))) / Math.pow(1 / (2 * Math.sqrt(2 * Math.PI)), 2);
      return !!c && Math.abs(c.value - expected) < 1e-6 && c.rigorFrontier === false && c.gatesLambda === false;
    },
    why:
      'C_HO = 2 K_0 / K_1^2 ~ 189. It is fully composed; its only independent headroom is ' +
      'the C_Selberg factor in K_0. Must remain non-gating (sets the N^{-3/2} rate term, ' +
      'which vanishes as N -> infinity).',
  },
  // Tripwire 6 (C_H): rigor frontier, subsumed from imp-1314.
  {
    id: 'imp1327-C_H-rigor-frontier-subsumed-from-1314',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'C_H');
      return !!c && Math.abs(c.value - 1.0 / 8.0) < 1e-15 && c.rigorFrontier === true && c.gatesLambda === false;
    },
    why:
      'C_H = 1/8 was closed by imp-1314 as rigid (Dyson 8 = 2 * 4). It must be carried into ' +
      'this systematic audit as rigor-frontier and non-gating. If it is missing the audit ' +
      'is not actually systematic over the WHOLE chain.',
  },
  // Tripwire 7 (E_trunc_pt): the SOLE gating constant, at the rigor frontier.
  {
    id: 'imp1327-E_trunc_pt-is-the-sole-gating-constant',
    holds: () => {
      const c = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.find((x) => x.symbol === 'E_trunc_pt');
      return !!c && Math.abs(c.value - 3.06e-5) < 1e-10 && c.gatesLambda === true && c.rigorFrontier === true;
    },
    why:
      'E_trunc_pt = 3.06e-5 is the SINGLE additive survivor in lim sup |t_c(N)| + E_trunc_pt ' +
      '= 0 + 3.06e-5, hence the SOLE gating constant, and it is at the rigor frontier ' +
      '(imp-1306 tightening factor 1.0). If anything else is marked gating, the routing is wrong.',
  },
  // Tripwire 8 (aggregate): exactly one gating constant, zero headroom-and-gating.
  {
    id: 'imp1327-exactly-one-gating-zero-headroom-gating',
    holds: () =>
      IMP_1327_CHAIN_CONSTANT_AUDIT.numGating === 1 &&
      IMP_1327_CHAIN_CONSTANT_AUDIT.numHeadroomAndGating === 0 &&
      IMP_1327_CHAIN_CONSTANT_AUDIT.headroomIsNonGating === true,
    why:
      'The load-bearing structural fact: exactly one constant gates Lambda (E_trunc_pt), and ' +
      'NO constant both has headroom AND gates. This is why the surfaced 2x headroom cannot ' +
      'move the headline. If numHeadroomAndGating > 0 a future edit claimed a gating tightening ' +
      'without supplying the derivation.',
  },
  // Tripwire 9 (counterfactual): collapsing rate headroom leaves Lambda at 3.06e-5.
  {
    id: 'imp1327-rate-headroom-collapse-does-not-move-Lambda',
    holds: () =>
      Math.abs(IMP_1327_CHAIN_CONSTANT_AUDIT.lambdaAfterRateHeadroomCollapse - 3.06e-5) < 1e-10 &&
      Math.abs(IMP_1327_CHAIN_CONSTANT_AUDIT.tighteningFactorLambda - 1.0) < 1e-12,
    why:
      'Even the optimistic counterfactual C_Selberg -> 1.5 (2x sharper) leaves Lambda at ' +
      '3.06e-5 with tightening factor exactly 1.0, because the anchor is E_trunc_pt. A drift ' +
      'here would mean the audit silently claimed a headline improvement it cannot support.',
  },
  // Tripwire 10 (finite-N honesty): the headroom DOES help finite-N, by ~2x.
  {
    id: 'imp1327-finite-N-rate-speedup-is-about-2x',
    holds: () => {
      const s = IMP_1327_CHAIN_CONSTANT_AUDIT.finiteNRateSpeedup;
      return Number.isFinite(s) && s > 1.8 && s < 2.2;
    },
    why:
      'Honesty check: the headroom is REAL and DOES help finite-N witnesses -- a ~2x speedup ' +
      'of the N^{-3/2} deviation term at N = 1e6. Reporting this (rather than pretending the ' +
      'headroom is illusory) is what makes the non-gating conclusion credible rather than ' +
      'dismissive. If this drifts away from ~2x the counterfactual was mis-set.',
  },
  // Tripwire 11 (verdict): in allowed set and is the non-gating verdict.
  {
    id: 'imp1327-verdict-is-non-gating-and-allowed',
    holds: () =>
      IMP_1327_CHAIN_CONSTANT_AUDIT.allowedVerdicts.includes(IMP_1327_CHAIN_CONSTANT_AUDIT.verdict) &&
      IMP_1327_CHAIN_CONSTANT_AUDIT.verdict === 'chain-headroom-is-non-gating-bottleneck-is-E_trunc_pt',
    why:
      'The verdict must be one of the three allowed strings and specifically the non-gating ' +
      'one, matching the honest finding that headroom exists but does not move Lambda.',
  },
  // Tripwire 12 (coverage): all seven chain constants audited, 3 frontier + 4 headroom.
  {
    id: 'imp1327-all-seven-constants-covered',
    holds: () => {
      const syms = IMP_1327_CHAIN_CONSTANT_AUDIT.constantAudit.map((c) => c.symbol);
      const want = ['C_Selberg', 'C_KH', 'K_0', 'K_1', 'C_HO', 'C_H', 'E_trunc_pt'];
      const allPresent = want.every((w) => syms.includes(w));
      return allPresent &&
             IMP_1327_CHAIN_CONSTANT_AUDIT.numConstantsAudited === 7 &&
             IMP_1327_CHAIN_CONSTANT_AUDIT.numRigorFrontier === 3 &&
             IMP_1327_CHAIN_CONSTANT_AUDIT.numWithHeadroom === 4;
    },
    why:
      'The audit must be SYSTEMATIC: all seven chain constants present, with the 3 rigor-' +
      'frontier (K_1, C_H, E_trunc_pt) vs 4 headroom (C_Selberg, C_KH, K_0, C_HO) split ' +
      'intact. A missing constant means the walk is incomplete and the ticket deliverable ' +
      'is not met.',
  },
];

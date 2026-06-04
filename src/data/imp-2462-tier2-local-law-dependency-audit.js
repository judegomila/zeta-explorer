/**
 * @module imp-2462-tier2-local-law-dependency-audit
 * @jsdocTag imp-2462
 *
 * imp-2462: Tier-2 optimal-local-law dependency audit for the Route-A C_mb
 * monotonicity bound -- a reduction-to-known-input ledger.
 *
 * Wave-4 follow-on to imp-2365 (local-law-rigidity-closure.js) and imp-2429
 * (imp-2429-route-a-rigidity-exponent-bisection.js). Those two pinned, as a
 * continuous threshold, that the Route-A many-body center-of-mass correction
 * C_mb stays O(1) only if the Riemann zeros obey a local law / bulk rigidity at
 * the MICROSCOPIC scale N to the power -(1 - eps):
 *
 *   Tier 1  edge rigidity N^-(2/3)        -- INSUFFICIENT (imp-2429 verdict)
 *   Tier 2  optimal bulk local law N^-(1-eps) -- the actual required input
 *   Tier 3  full sine-kernel / GUE bulk universality -- STRICTLY STRONGER
 *
 * This file does NOT prove anything new. It is a structured ledger: it lists the
 * known partial results that bear on a Tier-2 local law FOR THE RIEMANN ZEROS
 * SPECIFICALLY, classifies each as unconditional vs conditional (on RH, on
 * Montgomery PCC, on full universality), records the SCALE each result actually
 * reaches and the norm (L2 variance vs L-infinity worst-case) it controls, and
 * from that ledger reads off the single smallest hypothesis that would
 * unconditionalize Route A.
 *
 * HONEST SCOPE
 * ------------
 * This is an audit / reduction ledger, not a theorem. No QED is claimed and the
 * Route-A "closed modulo bulk universality" status is unchanged. The deliverable
 * is the ledger plus the named smallest-input statement and a residual sub-gap.
 *
 * THE CRUX (grounded in imp-1304 and imp-2431 in this repo)
 * --------------------------------------------------------
 * Montgomery 1973 gives the pair-correlation form factor F(alpha) -> |alpha|
 * (equivalently the GUE second moment of mesoscopic zero counts) UNCONDITIONALLY
 * GIVEN RH, but ONLY for test functions whose Fourier support stays inside
 * (-1, 1). The microscopic scale N^-(1-eps) needed for Tier 2 corresponds to
 * Fourier support reaching and passing 1; that regime is exactly strong / full
 * Montgomery PCC, which is a 50-year-open problem. So every unconditional input
 * is either (a) macroscopic / global (Riemann-von Mangoldt counting, zero-density
 * estimates) and far too coarse, or (b) restricted-support mesoscopic (Montgomery
 * 2-point, Rudnick-Sarnak n-level) and unable to reach the microscopic scale.
 * Nothing unconditional reaches Tier 2.
 *
 * SYNTAX SAFETY: comments use dg_{k}/dt notation and N^-(1-eps) (no slash inside
 * an exponent); no apostrophes inside single-quoted strings.
 */

// -- Scale / tier reference exponents (rigidity |lambda_i - gamma_i| <= N^-alpha)

const TIER1_EDGE_ALPHA = 2 / 3; // edge-scale rigidity (imp-2365 Tier 1)
const TIER2_BULK_ALPHA = 1.0; // optimal bulk local law N^-(1-eps), eps -> 0
const TIER3_UNIVERSALITY = "sine-kernel bulk universality (all n-level correlations, full support)";

// -- The reduction-to-known-input ledger ---------------------------------------
//
// Each entry records, for one known result bearing on Tier 2:
//   input        : the theorem / hypothesis
//   status       : "unconditional" | "conditional-RH" | "conditional-PCC" |
//                  "conditional-universality"
//   scaleReached : the finest spacing scale the result controls, as an exponent
//                  alpha (rigidity to N^-alpha) or a qualitative label
//   norm         : "L2-variance" | "L-infinity" | "counting" | "n.a."
//   reachesTier2 : boolean -- does it deliver the bulk N^-(1-eps) L-infinity input
//   gapToTier2   : the precise reason it does or does not close Tier 2
//   repoRef      : grounding file in this repository, where applicable

const LEDGER = [
  {
    input: "Riemann-von Mangoldt counting N(T) with error O(log T)",
    status: "unconditional",
    scaleReached: 0.0,
    norm: "counting",
    reachesTier2: false,
    gapToTier2:
      "Pins zero ordinates only to within O(log T) mean spacings (macroscopic). " +
      "Equivalent rigidity exponent alpha = 0: many orders below the Tier-2 " +
      "requirement alpha -> 1. Controls the global count, not bulk spacing.",
    repoRef: null,
  },
  {
    input:
      "Zero-density estimates (Ingham; Huxley; Guth-Maynard 2024 density-hypothesis progress)",
    status: "unconditional",
    scaleReached: "off-line horizontal, not vertical-spacing",
    norm: "counting",
    reachesTier2: false,
    gapToTier2:
      "Bounds the number of zeros with real part >= sigma (horizontal " +
      "distribution). Orthogonal to vertical bulk rigidity of the ordinates on " +
      "the critical line; supplies no spacing-scale local law.",
    repoRef: "guth-maynard-tail-bound.js",
  },
  {
    input:
      "Montgomery 1973 pair correlation: F(alpha) -> |alpha| for Fourier support in (-1, 1)",
    status: "conditional-RH",
    scaleReached: "mesoscopic (support-limited); cannot reach N^-(1-eps)",
    norm: "L2-variance",
    reachesTier2: false,
    gapToTier2:
      "Gives the GUE second moment / variance of mesoscopic linear statistics, " +
      "but ONLY for smooth test functions with Fourier support inside (-1, 1). " +
      "The microscopic scale N^-(1-eps) needs support reaching 1; that regime is " +
      "unproven. Also an L2 (variance) statement, not the L-infinity worst-case " +
      "coupling the imp-2429 C_mb model uses.",
    repoRef: "imp-2431-zpo-pair-correlation-gue.js",
  },
  {
    input:
      "Rudnick-Sarnak 1996 n-level correlations match GUE for restricted Fourier support",
    status: "conditional-RH",
    scaleReached: "mesoscopic (support-limited)",
    norm: "L2-variance",
    reachesTier2: false,
    gapToTier2:
      "Extends the GUE match to all n-level correlations, hence all moments of " +
      "mesoscopic counts, but under the SAME support restriction. Removing the " +
      "restriction (to reach the microscopic scale at every order) is exactly " +
      "strong PCC plus its higher-order analogues -- open.",
    repoRef: null,
  },
  {
    input:
      "Strong / full Montgomery PCC: F(alpha) -> 1 for all alpha (Fourier support unbounded)",
    status: "conditional-PCC",
    scaleReached: TIER2_BULK_ALPHA,
    norm: "L2-variance",
    reachesTier2: true,
    gapToTier2:
      "Would deliver the GUE bulk variance at the microscopic scale, i.e. the L2 " +
      "(averaged) form of the Tier-2 local law. This is the SMALLEST natural " +
      "source of Tier-2 -- but is itself a 50-year-open problem (support > 1 is " +
      "unproven, see imp-1304). Still only L2; the L-infinity upgrade is extra.",
    repoRef: "imp-1304-iwaniec-sarnak-no-pcc.js",
  },
  {
    input:
      "ESY / Erdos-Yau optimal eigenvalue rigidity N^-(1-eps) for Wigner / GUE ensembles",
    status: "conditional-universality",
    scaleReached: TIER2_BULK_ALPHA,
    norm: "L-infinity",
    reachesTier2: true,
    gapToTier2:
      "On the random-matrix side the optimal L-infinity rigidity at N^-(1-eps) " +
      "IS a theorem. The obstacle (imp-407 obstacle O1) is that the Riemann " +
      "zeros are deterministic numbers with no product-measure structure, so the " +
      "RMT rigidity does not transfer without a universality bridge -- which is a " +
      "PCC-type input. Reaching Tier 2 this way still routes through PCC.",
    repoRef: "esy-rigidity-port.js",
  },
  {
    input:
      "Small / large consecutive-gap results (Soundararajan-Bui and successors)",
    status: "conditional-RH",
    scaleReached: "extreme-value, not bulk",
    norm: "L-infinity (lower bounds)",
    reachesTier2: false,
    gapToTier2:
      "Show gaps below c*mean and above C*mean occur infinitely often. These are " +
      "LOWER bounds on fluctuations (how far from rigidity the zeros provably " +
      "are), the opposite direction from the UPPER bound Tier 2 requires. " +
      "They cannot supply a rigidity bound; if anything they constrain how good " +
      "any rigidity constant can be.",
    repoRef: "soundararajan-bui-gap-bound.js",
  },
];

// -- Classification roll-up ----------------------------------------------------

const UNCONDITIONAL = LEDGER.filter((e) => e.status === "unconditional");
const REACH_TIER2 = LEDGER.filter((e) => e.reachesTier2);
const UNCONDITIONAL_REACHING_TIER2 = LEDGER.filter(
  (e) => e.status === "unconditional" && e.reachesTier2,
);

// The headline structural fact: NO unconditional ledger entry reaches Tier 2.
const NO_UNCONDITIONAL_TIER2 = UNCONDITIONAL_REACHING_TIER2.length === 0;

// Every entry that DOES reach Tier 2 is conditional on PCC or on universality.
const ALL_TIER2_ROUTES_CONDITIONAL = REACH_TIER2.every(
  (e) => e.status === "conditional-PCC" || e.status === "conditional-universality",
);

// -- The smallest hypothesis that would unconditionalize Route A ---------------
//
// Read off the ledger. The averaged (L2) Route-A bound and the worst-case
// (L-infinity) Route-A bound have DIFFERENT smallest inputs; we name both.

const SMALLEST_INPUT = {
  averagedRouteA: {
    statement:
      "Extend Montgomery form-factor asymptotic F(alpha) -> 1 from |alpha| < 1 " +
      "to a window |alpha| < 1 + delta for some fixed delta > 0 (PCC with an " +
      "epsilon of extra Fourier support).",
    delivers:
      "Lifts the restricted-support mesoscopic variance bound to a scale below " +
      "the mean spacing, supplying the L2 (variance / averaged) form of the " +
      "Tier-2 local law -- enough to bound the C_mb correction in its averaged " +
      "form (matching the imp-2429 ensemble-mean threshold).",
    strictlyWeakerThan:
      "full Montgomery PCC (all support) and full sine-kernel universality",
    strictlyStrongerThan:
      "the currently-proven support-(-1,1) Montgomery / Rudnick-Sarnak results",
    status: "open (support > 1 unproven)",
  },
  worstCaseRouteA: {
    statement:
      "The above support-extension PLUS an L2-to-L-infinity rigidity upgrade " +
      "(high-probability / second-moment variance control promoted to a " +
      "deterministic worst-case bound over all N ordinates).",
    delivers:
      "The full L-infinity bulk rigidity that the imp-2429 worst-case C_mb " +
      "coupling (an L-infinity statement over the N points) actually consumes.",
    obstacle:
      "This is the imp-407 obstacle O3 (high-probability-to-deterministic " +
      "conversion). For a deterministic sequence with no probability space it is " +
      "the harder half; absent it, only the averaged Route-A bound is reachable.",
    status: "open",
  },
};

// -- Residual sub-gap blocking unconditionalization ----------------------------

const IMP2462_SUB_GAP = {
  id: "imp-2462-support-extension-and-Linf-upgrade",
  label:
    "PCC Fourier-support extension past 1, and the L2-to-L-infinity rigidity upgrade",
  description:
    "The ledger localizes the entire Route-A unconditionality gap to two " +
    "stacked open inputs: (1) extend the Montgomery pair-correlation form factor " +
    "to Fourier support 1 + delta (any fixed delta > 0), which alone gives the " +
    "averaged Tier-2 local law; and (2) upgrade that L2 / variance control to a " +
    "deterministic L-infinity worst-case bound, which the imp-2429 C_mb coupling " +
    "consumes. Input (1) is a quantitative sliver of strong PCC; input (2) is the " +
    "imp-407 O3 obstacle. Neither is available unconditionally, and both are " +
    "strictly weaker than full sine-kernel universality.",
  reference:
    "imp-2365 local-law-rigidity-closure.js; imp-2429 rigidity-exponent " +
    "bisection; imp-407 esy-rigidity-port.js obstacles O1-O3; imp-1304 PCC " +
    "support regime; imp-2431 pair-correlation GUE match",
  difficulty: "research-grade / open (subset of the 50-year-open PCC problem)",
  partialProgress:
    "Reduction completed: every unconditional input is macroscopic or " +
    "restricted-support and cannot reach the microscopic scale N^-(1-eps); " +
    "every Tier-2-reaching input is conditional on PCC or universality. The " +
    "smallest separating hypothesis is named (support-extension for the averaged " +
    "bound; plus an L-infinity upgrade for the worst-case bound).",
};

// -- Closure record ------------------------------------------------------------

export const TIER2_LOCAL_LAW_DEPENDENCY_AUDIT = {
  id: "imp-2462",
  title:
    "Tier-2 optimal-local-law dependency audit for the Route-A C_mb monotonicity bound",
  status: "partial",
  closureType: "honest-partial-audit",
  proofSection: null,

  summary:
    "A reduction-to-known-input ledger for the Tier-2 local law that the Route-A " +
    "C_mb=O(1) monotonicity bound requires (imp-2365 / imp-2429). Lists seven " +
    "known results bearing on a microscopic N^-(1-eps) bulk rigidity for the " +
    "Riemann zeros, classifies each as unconditional vs conditional and by the " +
    "scale and norm it controls, establishes that NO unconditional input reaches " +
    "Tier 2, and reads off the single smallest hypothesis that would " +
    "unconditionalize Route A (a Montgomery form-factor support-extension for the " +
    "averaged bound, plus an L2-to-L-infinity upgrade for the worst-case bound).",

  consumes: [
    "imp-2365 LOCAL_LAW_RIGIDITY_CLOSURE (local-law-rigidity-closure.js)",
    "imp-2429 ROUTE_A_RIGIDITY_EXPONENT_BISECTION (imp-2429-route-a-rigidity-exponent-bisection.js)",
    "imp-407 ESY_RIGIDITY_PORT obstacles O1-O3 (esy-rigidity-port.js)",
  ],

  tiers: {
    tier1EdgeAlpha: TIER1_EDGE_ALPHA,
    tier2BulkAlpha: TIER2_BULK_ALPHA,
    tier3Universality: TIER3_UNIVERSALITY,
    note:
      "Tier 1 (edge N^-(2/3)) is insufficient per imp-2429; Tier 2 (bulk " +
      "N^-(1-eps)) is the required input; Tier 3 (full universality) is strictly " +
      "stronger than needed.",
  },

  ledger: LEDGER,

  rollUp: {
    totalEntries: LEDGER.length,
    unconditionalCount: UNCONDITIONAL.length,
    reachTier2Count: REACH_TIER2.length,
    unconditionalReachingTier2Count: UNCONDITIONAL_REACHING_TIER2.length,
    noUnconditionalTier2: NO_UNCONDITIONAL_TIER2,
    allTier2RoutesConditional: ALL_TIER2_ROUTES_CONDITIONAL,
  },

  smallestInput: SMALLEST_INPUT,

  subGap: IMP2462_SUB_GAP,

  verdict:
    "REDUCTION COMPLETE (audit, not theorem). The Tier-2 local law required by " +
    "Route A is not delivered by any unconditional result: the unconditional " +
    "inputs (Riemann-von Mangoldt counting, zero-density estimates) are " +
    "macroscopic, and the restricted-support mesoscopic results (Montgomery " +
    "2-point, Rudnick-Sarnak n-level) stop short of the microscopic scale " +
    "N^-(1-eps) precisely where Fourier support reaches 1. Every Tier-2-reaching " +
    "input is conditional on Montgomery PCC or on full universality. The single " +
    "smallest separating hypothesis is a Montgomery form-factor support-extension " +
    "to 1 + delta (giving the averaged Route-A bound), with an additional " +
    "L2-to-L-infinity rigidity upgrade (imp-407 O3) needed for the worst-case " +
    "bound. Both are strictly weaker than full sine-kernel universality. NOT a " +
    "theorem: see sub-gap imp-2462-support-extension-and-Linf-upgrade.",
};

// -- Build-time assertions -----------------------------------------------------

export const TIER2_LOCAL_LAW_DEPENDENCY_AUDIT_ASSERTIONS = [
  {
    id: "imp2462-ledger-populated",
    holds: () =>
      Array.isArray(LEDGER) &&
      LEDGER.length >= 6 &&
      LEDGER.every(
        (e) =>
          typeof e.input === "string" &&
          typeof e.status === "string" &&
          typeof e.gapToTier2 === "string" &&
          typeof e.reachesTier2 === "boolean",
      ),
    why:
      "The ledger must list at least six fully-specified inputs. A short or " +
      "malformed ledger means the dependency survey is incomplete and the " +
      "smallest-input conclusion is unsupported.",
  },
  {
    id: "imp2462-status-values-valid",
    holds: () =>
      LEDGER.every((e) =>
        [
          "unconditional",
          "conditional-RH",
          "conditional-PCC",
          "conditional-universality",
        ].includes(e.status),
      ),
    why:
      "Every entry must carry one of the four recognized status labels. An " +
      "unrecognized status would break the unconditional-vs-conditional " +
      "classification that the whole ledger turns on.",
  },
  {
    id: "imp2462-no-unconditional-reaches-tier2",
    holds: () => NO_UNCONDITIONAL_TIER2 === true,
    why:
      "The central finding: no UNCONDITIONAL input delivers the Tier-2 bulk " +
      "local law. If an entry were marked both unconditional and Tier-2-reaching " +
      "it would assert an unconditional Route-A closure, contradicting the " +
      "imp-2365 / imp-2429 / imp-486 obstruction. This tripwire guards the " +
      "headline conclusion against an over-claim.",
  },
  {
    id: "imp2462-tier2-routes-are-conditional",
    holds: () => REACH_TIER2.length >= 1 && ALL_TIER2_ROUTES_CONDITIONAL === true,
    why:
      "At least one route must reach Tier 2 (otherwise the target is unstated), " +
      "and every such route must be conditional on PCC or universality. A Tier-2 " +
      "route tagged conditional-RH or unconditional would misstate where the real " +
      "obstruction sits.",
  },
  {
    id: "imp2462-edge-below-bulk",
    holds: () => TIER1_EDGE_ALPHA < TIER2_BULK_ALPHA,
    why:
      "The Tier-1 edge exponent 2/3 must sit strictly below the Tier-2 bulk " +
      "exponent 1. If they coincided the imp-2429 verdict (edge insufficient, " +
      "bulk required) would be contradicted and the tier ladder would collapse.",
  },
  {
    id: "imp2462-smallest-input-strictly-between",
    holds: () =>
      typeof SMALLEST_INPUT.averagedRouteA.strictlyWeakerThan === "string" &&
      SMALLEST_INPUT.averagedRouteA.strictlyWeakerThan.includes("universality") &&
      typeof SMALLEST_INPUT.averagedRouteA.strictlyStrongerThan === "string",
    why:
      "The named smallest input must be explicitly bracketed: strictly weaker " +
      "than full universality and strictly stronger than the proven " +
      "restricted-support results. Dropping either bracket would let the " +
      "smallest-hypothesis claim drift into either triviality or full " +
      "universality.",
  },
  {
    id: "imp2462-sub-gap-named",
    holds: () =>
      typeof IMP2462_SUB_GAP.id === "string" &&
      IMP2462_SUB_GAP.id.startsWith("imp-2462"),
    why:
      "An honest partial audit must name a sub-gap blocking unconditionalization. " +
      "The id must start with imp-2462 to tie it to this ticket; a wrong id breaks " +
      "the audit trail and risks a false impression of full closure.",
  },
];

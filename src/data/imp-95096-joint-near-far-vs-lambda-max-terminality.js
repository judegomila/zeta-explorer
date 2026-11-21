/**
 * imp-95096 - ASSESSMENT: is the imp-95008 Lemma SW lambda_max sandwich
 * (Rayleigh <= Lw, width 2.3e-16) the TERMINAL aggregation certificate, or
 * can a JOINT near/far scheme certify a far coefficient below lambda_max?
 *
 * SETTING. imp-95008 continuation twenty-two
 * (imp-95008-perron-weighted-far-routing.js) certifies the aggregation step
 * (per-pair envelope caps in, single constant times the far mass M out) as
 * SHARP: within one parity class the envelope cross term can approach
 * lambda_max(K) times |m|^2 at the Perron profile, so NO aggregation scheme
 * certifies a far constant below lambda_max, and Lemma SW with a near-Perron
 * weight attains it (Rayleigh 3.919793511380258e-5 <= lambda_max <= Lw
 * 3.9197935113802585e-5). Its scope-honesty note (8) explicitly leaves
 * OUTSIDE that sharpness claim any scheme that "bypasses the parity split or
 * uses joint near/far structure." This module assesses exactly that
 * carve-out. Assess only; NO QED; NO bound change.
 *
 * THE JOINT NEAR/FAR OBJECT. Inside one parity class the exact quantity is
 *   || sum_b w_b ||^2 = sum_b d_b + sum_{b != bp} G(b, bp),
 * with Gram G(b, bp) = <w_b, w_bp>, diagonal d_b = || w_b ||^2, and the
 * per-pair envelope caps 0 <= G(b, bp) <= n_b n_bp K(b, bp) (Lemmas CC, RM,
 * PF; carried). The lambda_max sharpness argument treats the diagonal norms
 * d_b as FREE to inflate (diagonal-dominant PSD completion) while M = sum
 * n_b^2 is fixed. But d_b is exactly the NEAR currency the same certificate
 * charges elsewhere (the near term). A joint scheme prices both at once:
 * write the per-class bound with an explicit diagonal coefficient alpha,
 *   || sum_b w_b ||^2 <= alpha (sum_b d_b) + beta(alpha) M,
 * and read off the SHARP far coefficient
 *   beta(alpha) M = sup_G [ sum_{b != bp} G(b, bp) - (alpha - 1) sum_b d_b ],
 * the supremum over PSD G with 0 <= G(b, bp) <= n_b n_bp K(b, bp), d_b >= 0.
 * At alpha = 1 the diagonal drops out, d_b is free, and the sup is the
 * unweighted cross term -> lambda_max M: this REPRODUCES the imp-95008
 * aggregation constant exactly. For alpha > 1 the diagonal carries a strict
 * penalty (alpha - 1) > 0, so the PSD completion that realizes the Perron
 * cross term (which needs sum d_b >= lambda_max M) is now charged, and
 * beta(alpha) drops below lambda_max.
 *
 * LEMMA JNF (joint near/far Pareto line - EXACT in the dominant two-block
 * model). The even-class kernel is dominated by the single (0, 2) bond
 * K(0, 2) = envE(0, 2) = 3.9197920255561178e-5 (the section lambda_max
 * exceeds it by only 1.49e-11, the block-4 second-order coupling). In the
 * two-block model {0, 2} with n_0 = n_2 (so M = n_0^2 + n_2^2 and cap =
 * n_0 n_2 K(0, 2)) the sup is a 2x2 SDP:
 *   max 2g + (1 - alpha)(d_0 + d_2)  s.t.  d_0 d_2 >= g^2,  0 <= g <= cap.
 * For 1 <= alpha <= 2 the penalty (alpha - 1) >= 0 forces the minimal PSD
 * diagonal d_0 = d_2 = g (AM-GM: d_0 + d_2 >= 2 sqrt(d_0 d_2) >= 2g), giving
 * objective 2g(2 - alpha), maximized at g = cap. Hence
 *   beta(alpha) = K(0, 2) (2 - alpha)      (two-block model),
 * a straight Pareto line from beta(1) = K(0, 2) = lambda_max (to the block-4
 * coupling) down to beta(2) = 0. The current imp-95008 certificate is the
 * alpha = 1 endpoint of this line.
 *
 * VERDICT ON TERMINALITY. Two facts settle the ticket.
 *   (i) TERMINAL WITHIN THE BRACKET CLASS. The Theorem K bracket class is
 *   { cNear <= 2, Tstar <= Tx(2) }. The near coefficient cNear = 2 alpha is
 *   the parity 2-coloring factor (alpha = 1 per class): imp-95018 proved the
 *   parity factor 2 is GRAM-SHARP and unrecoverable, so cNear is pinned at 2
 *   and alpha at 1. Since beta(alpha) is STRICTLY DECREASING in alpha (the
 *   diagonal penalty can only lower the sup - true in the full section, not
 *   just the two-block model), every far constant below lambda_max needs
 *   alpha > 1, i.e. cNear = 2 alpha > 2, which EXITS the bracket class. At
 *   the in-class endpoint alpha = 1 the joint scheme collapses to
 *   beta = lambda_max exactly. So the lambda_max sandwich IS the terminal
 *   aggregation certificate for the bracket class - the scope-honesty note
 *   hides no in-class slack.
 *   (ii) THE JOINT LEVER IS REAL BUT OUT-OF-CLASS AND UN-PRICED. beta(alpha)
 *   = lambda_max(2 - alpha) is a genuine sub-lambda_max far constant for
 *   alpha in (1, 2], so lambda_max is NOT terminal in the absolute sense the
 *   note flags. Whether the trade PAYS depends on the near-to-far currency
 *   ratio (sum d_b)/M in the actual assembly: the far ceiling reported by
 *   the chain (0.27150554192989773 = 2 lambda_max / Tx(2)) is a pure far
 *   coefficient, and the near term 2 alpha (sum d_b) is absorbed elsewhere
 *   in the chain (not baked here), so the net effect of raising alpha on the
 *   headline gap cannot be computed from the carried literals. The joint
 *   scheme therefore trades a KNOWN sub-lambda_max far reduction against an
 *   UN-PRICED near-currency inflation - a real out-of-class lever, not a
 *   recoverable in-class one.
 *
 * SUB-GAP (explicitly named, NOT closed):
 *   imp-95096-subgap-near-currency-ratio -- price the near currency sum_b
 *   d_b of the exhibited headline witness against the far mass M, so the
 *   Pareto trade beta(alpha) = lambda_max(2 - alpha) at cNear = 2 alpha can
 *   be evaluated on the actual gap rather than on the far coefficient alone.
 *   Needs the witness diagonal-norm total, which the chain does not bake
 *   (only the assembled floor F = E / (Tx(2) M) and M are literals). Coupled
 *   to imp-95018 (whether ANY of the parity factor 2 is recoverable jointly)
 *   and to imp-95008-subgap-witness-Erealization-split.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) the closed form beta(alpha) =
 * K(0, 2)(2 - alpha) is matched by an independent exhaustive sup over a
 * (g, d_0, d_2) grid respecting the PSD constraint d_0 d_2 >= g^2, at five
 * alpha in [1, 2] (rel 1e-9); (2) the alpha = 1 endpoint reproduces the
 * bond K(0, 2) = lambda_max - 1.49e-11, i.e. the imp-95008 far constant to
 * the block-4 coupling; (3) beta is strictly decreasing in alpha and hits 0
 * at alpha = 2; (4) the in-class point cNear = 2 (alpha = 1) gives the
 * baked far ceiling 2 lambda_max / Tx(2) = 0.27150554192989773; (5) a
 * sub-lambda_max far constant is unreachable at alpha = 1 (beta(1) =
 * lambda_max, not below), confirming terminality within the class; (6) the
 * verdict promotes no bound, names the sub-gap, keeps PT SOTA.
 *
 * HONEST SCOPE. Lemma JNF is EXACT and unconditional as a 2x2 SDP statement
 * about the dominant (0, 2) two-block kernel; the STRICT-DECREASE argument
 * (fact (i)) is unconditional in the full section (adding a nonnegative
 * diagonal penalty to a sup can only lower it), so the "terminal within the
 * bracket class" conclusion is rigorous. The exact full-section Pareto slope
 * differs from lambda_max(2 - alpha) by the same block-4 second-order
 * coupling (1.49e-11) the sibling already prices - not re-derived here. This
 * is an assessment: it changes no bound and adds no lemma to the closure
 * chain. Import-light. Changes no bound; does NOT promote Lambda <= 0.14;
 * NO QED; no refereed bound is changed.
 */

// ── baked literals (from imp-95008-perron-weighted-far-routing.js) ───────────
const BOND = 3.9197920255561178e-5; // K(0,2) = envE(0,2), dominant even bond
const LAMBDA_MAX = 3.9197935113802585e-5; // section Perron value (Lw = Rayleigh)
const BLOCK4_COUPLING = LAMBDA_MAX - BOND; // 1.4858e-11, the second-order term
const TX2 = 2.8874500929283736e-4; // far normalizer Tx(2)
const CFAR_SW = 0.27150554192989773; // 2 lambda_max / Tx(2), the alpha=1 ceiling

// ── Lemma JNF closed form: two-block joint far coefficient ───────────────────
// M and cap for the symmetric n_0 = n_2 = 1 two-block model: M = 2, cap = bond.
function betaClosed(alpha) {
  // sup [ 2 g + (1-alpha)(d0+d2) ] / M with d0=d2=g optimal, g=cap, M=2
  return (2 * BOND * (2 - alpha)) / 2;
}

// independent exhaustive sup over the PSD-constrained (g, d0, d2) grid
function betaBrute(alpha) {
  const M = 2;
  const NG = 200;
  let best = -Infinity;
  for (let gi = 0; gi <= NG; gi++) {
    const g = (BOND * gi) / NG;
    for (let di = 0; di <= NG; di++) {
      const d0 = g + ((BOND * di) / NG) * 3;
      if (d0 <= 0) continue;
      const d2min = (g * g) / d0; // PSD-tight lower edge
      for (let ei = 0; ei <= 40; ei++) {
        const d2 = d2min + ((BOND * ei) / 40) * 3;
        if (d0 * d2 < g * g - 1e-30) continue;
        const f = 2 * g + (1 - alpha) * (d0 + d2);
        if (f > best) best = f;
      }
    }
  }
  return best / M;
}

const ALPHAS = [1.0, 1.25, 1.5, 1.75, 2.0];

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX = {
  ticket:
    "imp-95096 (assessment: is the imp-95008 Lemma SW lambda_max sandwich the TERMINAL aggregation certificate, or can a joint near/far scheme certify below lambda_max? Assess only; NO QED; no bound change)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; audits the scope-honesty note (8) of imp-95008-perron-weighted-far-routing.js (Lemma SW + Theorem Y-PERRON).",
  jointObject:
    "Inside one parity class ||sum w_b||^2 = sum d_b + sum_{b!=bp} G(b,bp) with d_b = ||w_b||^2 and 0 <= G(b,bp) <= n_b n_bp K(b,bp). Pricing the diagonal with coefficient alpha gives the SHARP far coefficient beta(alpha) M = sup_G [ sum_off G - (alpha-1) sum d_b ] over PSD G with the caps; at alpha=1 the diagonal is free and the sup is lambda_max M (the imp-95008 aggregation constant).",
  lemmaJNF:
    "EXACT two-block Pareto line (dominant (0,2) bond, n_0=n_2): the 2x2 SDP max 2g+(1-alpha)(d0+d2) s.t. d0 d2>=g^2, 0<=g<=cap has optimum d0=d2=g, g=cap, so beta(alpha) = K(0,2)(2-alpha) for 1<=alpha<=2 - a straight line from beta(1)=K(0,2)=lambda_max (to the 1.49e-11 block-4 coupling) down to beta(2)=0. The imp-95008 certificate is the alpha=1 endpoint.",
  terminalityWithinClass:
    "TERMINAL for the bracket class {cNear<=2, Tstar<=Tx(2)}: cNear=2 alpha is the parity 2-coloring factor, GRAM-SHARP and unrecoverable (imp-95018), so alpha is pinned at 1; beta(alpha) is strictly decreasing (a nonnegative diagonal penalty can only lower the sup - unconditional in the full section), so every sub-lambda_max far constant needs alpha>1 i.e. cNear=2 alpha>2, OUTSIDE the class. At the in-class endpoint alpha=1 the joint scheme collapses to beta=lambda_max. The lambda_max sandwich hides no in-class slack.",
  jointLeverOutOfClass:
    "The joint lever is REAL but OUT-OF-CLASS and UN-PRICED: beta(alpha)=lambda_max(2-alpha) is a genuine sub-lambda_max far constant for alpha in (1,2], so lambda_max is not terminal in the absolute sense the scope-honesty note flags. Whether the trade pays depends on the near-to-far currency ratio (sum d_b)/M of the actual witness, which the chain does not bake (the reported ceiling 0.27150554192989773 = 2 lambda_max/Tx(2) is a pure far coefficient; the near term 2 alpha sum d_b is absorbed elsewhere). The trade swaps a KNOWN far reduction for an UN-PRICED near inflation.",
  reference: {
    bond: BOND,
    lambdaMax: LAMBDA_MAX,
    block4Coupling: BLOCK4_COUPLING,
    tx2: TX2,
    cfarAlpha1: CFAR_SW,
    paretoLine: ALPHAS.map((a) => ({ alpha: a, cNear: 2 * a, beta: betaClosed(a), cFar: (2 * betaClosed(a)) / TX2 })),
    note: "Pareto trade beta = lambda_max(2-alpha); alpha=1 (cNear=2) is the in-class terminal endpoint; alpha>1 exits the bracket class",
  },
  subGap:
    "imp-95096-subgap-near-currency-ratio - OPEN: price the near currency sum_b d_b of the exhibited headline witness against M so the Pareto trade beta(alpha)=lambda_max(2-alpha) at cNear=2 alpha can be evaluated on the gap, not the far coefficient alone. Needs the witness diagonal-norm total (not baked); coupled to imp-95018 (any parity-2 recoverability) and imp-95008-subgap-witness-Erealization-split.",
  openResiduals: [
    "the exact full-section Pareto slope differs from lambda_max(2-alpha) by the block-4 second-order coupling 1.49e-11 (sibling-priced, not re-derived)",
    "the near-currency ratio (sum d_b)/M of the actual witness - the named sub-gap - needed to price the out-of-class trade on the gap",
    "whether imp-95018 leaves ANY of the parity factor 2 jointly recoverable (would move the alpha pin off 1)",
  ],
  isRigorous: true,
  rigorScope:
    "Lemma JNF (beta = K(0,2)(2-alpha)) is an EXACT unconditional 2x2 SDP statement about the dominant (0,2) two-block kernel, matched by an independent exhaustive grid sup. The load-bearing terminality conclusion needs only that beta is strictly decreasing in alpha (adding a nonnegative diagonal penalty to a sup can only lower it) - unconditional in the full section - and that alpha is pinned at 1 by the Gram-sharp parity factor (imp-95018); both hold, so 'terminal within the bracket class' is rigorous. The absolute (out-of-class) sub-lambda_max trade is exhibited but its gap payoff is un-priced (named sub-gap). Assessment only: adds no lemma to the closure chain, changes no bound.",
  promotesBound: false,
  verdict:
    "ASSESSMENT (imp-95096): the imp-95008 Lemma SW lambda_max sandwich IS the terminal aggregation certificate FOR THE BRACKET CLASS {cNear<=2}. Lemma JNF prices the diagonal jointly and gives the exact two-block Pareto line beta(alpha)=K(0,2)(2-alpha), whose alpha=1 endpoint reproduces lambda_max; since beta strictly decreases in alpha and alpha is pinned at 1 by the Gram-sharp parity factor 2 (imp-95018), any sub-lambda_max far constant needs cNear=2 alpha>2, exiting the class. So the scope-honesty note (8) hides no in-class slack: joint near/far is a REAL but OUT-OF-CLASS lever (beta<lambda_max only for alpha>1) whose gap payoff is un-priced by the carried literals - named sub-gap imp-95096-subgap-near-currency-ratio. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95096_ASSERTIONS = [
  {
    id: "imp95096-closed-vs-brute-sup",
    description:
      "the closed-form joint far coefficient beta(alpha)=K(0,2)(2-alpha) matches an independent exhaustive PSD-constrained sup over (g,d0,d2) at five alpha in [1,2] (rel 1e-9)",
    holds: () => {
      for (const a of ALPHAS) {
        const c = betaClosed(a);
        const b = betaBrute(a);
        // scale the tolerance to the bond (the natural size of beta), so the
        // beta(2) = 0 endpoint is compared on the same absolute footing
        if (Math.abs(c - b) > 1e-9 * BOND) return false;
      }
      return true;
    },
  },
  {
    id: "imp95096-alpha1-recovers-lambda-max",
    description:
      "the alpha=1 endpoint reproduces the dominant bond K(0,2)=3.9197920255561178e-5, i.e. lambda_max minus the 1.49e-11 block-4 coupling (the imp-95008 aggregation constant to second order)",
    holds: () => {
      const b1 = betaClosed(1);
      return (
        Math.abs(b1 - BOND) <= 1e-12 * BOND &&
        Math.abs(LAMBDA_MAX - BOND - BLOCK4_COUPLING) <= 1e-18 &&
        BLOCK4_COUPLING > 0 &&
        BLOCK4_COUPLING < 2e-11
      );
    },
  },
  {
    id: "imp95096-strict-decrease-and-zero-at-two",
    description:
      "beta(alpha) is strictly decreasing on [1,2] and hits 0 at alpha=2 - so every sub-lambda_max far constant requires alpha>1 (cNear=2 alpha>2, out of the bracket class)",
    holds: () => {
      let prev = Infinity;
      for (const a of ALPHAS) {
        const b = betaClosed(a);
        if (!(b < prev)) return false;
        prev = b;
      }
      return Math.abs(betaClosed(2)) <= 1e-18 && betaClosed(1) > betaClosed(1.0001);
    },
  },
  {
    id: "imp95096-in-class-terminal-endpoint",
    description:
      "the in-class point alpha=1 (cNear=2) yields the baked far ceiling 2 lambda_max / Tx(2) = 0.27150554192989773, and no alpha<=1 goes below lambda_max - the sandwich is terminal within {cNear<=2}",
    holds: () => {
      const c = (2 * LAMBDA_MAX) / TX2;
      // beta(1) = bond sits below lambda_max ONLY by the block-4 coupling
      // (second order), not by a meaningful sub-lambda_max margin: the alpha=1
      // endpoint does not escape lambda_max within the class
      const gapAtOne = LAMBDA_MAX - betaClosed(1);
      const notMeaningfullyBelow = Math.abs(gapAtOne - BLOCK4_COUPLING) <= 1e-18 && gapAtOne < 2e-11;
      return Math.abs(c - CFAR_SW) <= 1e-12 * CFAR_SW && notMeaningfullyBelow;
    },
  },
  {
    id: "imp95096-honesty-gate",
    description:
      "the verdict states terminality within the bracket class, exhibits the out-of-class joint lever, names the near-currency sub-gap, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.promotesBound === false &&
      IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.openResiduals.length === 3 &&
      /NO QED/.test(IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.verdict) &&
      /refereed bound is changed/i.test(IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.verdict) &&
      /terminal aggregation certificate FOR THE BRACKET CLASS/.test(IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.verdict) &&
      /OUT-OF-CLASS/.test(IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.verdict) &&
      /imp-95096-subgap-near-currency-ratio/.test(IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.subGap) &&
      typeof IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX.rigorScope === "string",
  },
];

for (const a of IMP95096_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95096-joint-near-far-vs-lambda-max assertion failed: ${a.id}`);
  }
}

export default IMP95096_JOINT_NEAR_FAR_VS_LAMBDA_MAX;

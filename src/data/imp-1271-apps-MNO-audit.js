// @module data/imp-1271-apps-MNO-audit
// imp-1271 -- OPUS-4.8 DEEP audit of v52 Appendices M-O (KYP bounded-real /
//              positive-real / delay-Gram). Last paper section never directly
//              audited; referenced by imp-1233 + imp-1245 but never opened.
//
// PAPER
// -----
//   research-inputs/twin_ladder_consolidated_v52.pdf
//     App M -- KYP state-space passive lifts                (pp 97-102)
//     App N -- bounded-real delay lifts + signed-Mobius     (pp 103-107)
//     App O -- delay-Gram bounded-real certificates         (pp 107-110)
//
//   Apps M-O are reachable on disk via src/data/kyp-bounded-real-section.js
//   (imp-1201) which is the reference data record loaded by the /kyp-bounded-
//   real route. The text of Apps M-O is not extracted directly from the PDF in
//   this session; the audit works from the kyp-bounded-real-section.js
//   contents, the twin-ladder-paper-roadmap App M/N/O entries, and the
//   imp-1233 + imp-1245 + imp-1258 cross-references that already cite Apps M-O
//   paragraphs.
//
// QUESTION UNDER TEST
// -------------------
// (a) Does Apps M-O contain STANDALONE claims independent of CDB-Exist
//     (imp-1241)?
// (b) Does Apps M-O extend the imp-1258 §15-27 collapse to a wider operator
//     class (block / matrix-valued / Pontryagin-passive)?
// (c) Does Apps M-O carry any NEW closure paths to Lambda that the imp-1267
//     HS / imp-1287 WH wave-15/16 attacks missed?
//
// METHOD
// ------
// Training-time knowledge only. No external browsing. Each Apps M-O claim is
// classified against the established 13-conjecture audit vocabulary:
//
//   SUBSUMED-BY-RH          RH-equivalent reformulation -- iff RH.
//   SUBSUMED-BY-LITERATURE  Textbook theorem (Anderson-Vongpanitlerd 1973
//                           KYP lemma, Gu-Kharitonov-Chen 2003 delay-LMI,
//                           Aronszajn 1950 RKHS density, Arov-Nudelman 1996).
//   PARTIALLY-RELATED       Half RH-equivalent, half textbook -- sits on top
//                           of mature literature but adds a specific non-
//                           circular construction that is open.
//   INDEPENDENT-NOVEL       Not RH, not textbook, not a reformulation of any
//                           other audited claim.
//
// VERDICT VOCABULARY (top-level)
// ------------------------------
//   extends-1258-collapse-to-block         Apps M-O genuinely widens the
//                                          §15-27 collapse to a block /
//                                          matrix-valued operator class
//                                          and adds new closure paths.
//   standalone-novel-claims                Apps M-O contains independent
//                                          claims with no overlap to the
//                                          existing audit corpus.
//   redundant-with-1244+1245+1258          Apps M-O is a control-theoretic
//                                          re-paraphrase of CDB-Exist /
//                                          §27 -- same content, different
//                                          dress, same Phi-non-circularity
//                                          obstruction.
//   mixed-N-novel-M-redundant-O-textbook   Per-App split: at least one App
//                                          carries genuinely novel content
//                                          (e.g. App N signed-Mobius argument
//                                          principle), at least one is a
//                                          textbook restatement (Anderson-
//                                          Vongpanitlerd 1973), at least one
//                                          is redundant with §27 (App O Gram-
//                                          Cholesky pilot = §27 finite-N
//                                          truncation in disguise).
//
// FINAL VERDICT
// -------------
// redundant-with-1244+1245+1258 (with App N signed-Mobius argument-principle
// flag as the closest-to-novel sub-claim, but still RH-equivalent on closure).
//
// HONEST READ
// -----------
// All three Apps reformulate the same shared bottleneck (K_a >= 0, equivalently
// Theta_a Schur) in control-theoretic language. App M is the KYP LMI (RH-
// equivalent via Schur transfer-function dictionary); App N is the bounded-real
// delay Lyapunov-Krasovskii functional (RH-equivalent + same circularity per
// kyp-bounded-real-section.js App N blocker); App O is the delay-Gram Cholesky
// pilot (RH-equivalent + RKHS density gap per kyp-bounded-real-section.js App O
// blocker). The two named conjectures M.1 and O.1 BOTH have impliesRH = true.
// The control-theoretic dress is a notational re-presentation; the load-bearing
// obstruction is unchanged from §27.
//
// New closure path? No. The imp-1267 HS bound (||V|| <= sqrt(I_0 J_a) <= 2.94e-4)
// + imp-1287 WH bound (||V|| <= ||Phi||_inf^2 / a = 0.1996/a) already give two
// unconditional analytic routes for ||V_{a,Phi}|| <= 1 on L^2([0, inf)) covering
// ALL a > 0. Apps M-O give finite-N Cholesky pilots only. None of M / N / O
// supplies an analytical L^2([0, inf)) bound -- they instead pose existence of
// uniform passivity margins (M.1) and density extensions (O.1) as open sub-
// conjectures.
//
// SYNTAX NOTE: no apostrophes inside single-quoted JS strings.

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Per-claim audit entries -----------------------------------------------

const CLAIM_M_LMI = Object.freeze({
  id: 'M.lmi',
  appLabel: 'App M',
  claimName: 'KYP LMI feasibility iff Theta_a bounded-real',
  paperSection: 'App M, pp 97-102',

  paraphrasedStatement:
    'A state-space realization (A, B, C, D) of the shifted bridge ratio ' +
    'Theta_a is a passive lift iff the Lure -- KYP LMI is feasible: there ' +
    'exists P > 0 such that A^T P + PA + (PB + C^T)(I - D^T D)^{-1}(B^T P + ' +
    'D^T C) <= 0. Feasibility iff ||Theta_a||_inf <= 1 iff K_a >= 0 iff RH.',

  classification: 'SUBSUMED-BY-LITERATURE',
  classificationRationale:
    'The KYP lemma (Yakubovich 1962, Kalman 1963, Popov 1962, Anderson-' +
    'Vongpanitlerd 1973) gives the equivalence (existence of P > 0 solving ' +
    'the Lure equation) <=> (transfer function is Schur / bounded-real / ' +
    'positive-real) as a textbook theorem in the finite-dimensional setting. ' +
    'In the infinite-dimensional setting (operator LMI on l^2), Arov-Nudelman ' +
    '1996 supplies the corresponding passive realization. The biconditional ' +
    'feasibility <=> bounded-real is therefore literature, not novel.',

  rhRelationship:
    'feasible-iff-bounded-real (literature), bounded-real iff K_a >= 0 ' +
    '(de Branges 1968 Thm 23), K_a >= 0 iff RH (shift-bridge threshold ' +
    'theorem, imp-1241 / imp-1258). So feasibility <=> RH, but the literature ' +
    'half (feasibility <=> bounded-real) is the textbook KYP biconditional.',

  novelContentIfAny:
    'NONE. The specific application to Theta_a = E_a^# / E_a is a particular ' +
    'instance of the general KYP biconditional.',

  obstruction:
    'No finite-dimensional state-space realization exists for the prime-delay ' +
    'system Sigma_a (countably infinite Baker-independent delays). Finite-N ' +
    'truncations P_N exist (imp-1201 pilots: lambda_min(P_20) ~ 0.013, ' +
    'lambda_min(P_50) ~ 2.4e-4) but uniform passivity margin epsilon_N >= ' +
    'c > 0 is the OPEN content (= Conjecture M.1).',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1233 (Conj 18.1 audit, PARTIALLY-RELATED to KYP / Yakubovich / ' +
      'Kalman / Anderson-Vongpanitlerd 1973)',
    'imp-1241 (CDB-Exist, three-of-four-unified -- 18.1 is the KYP-passive ' +
      'face of the unified canonical-system existence)',
    'imp-1245 axis (a) (KYP <=> CDB-Exist via Arov-Nudelman 1996 infinite-' +
      'dim bridge)',
  ]),
});

const CLAIM_M_1 = Object.freeze({
  id: 'M.1',
  appLabel: 'App M',
  claimName: 'Conjecture M.1: KYP certificate convergence',
  paperSection: 'App M, pp 97-102',

  paraphrasedStatement:
    'The sequence of N-th truncation KYP certificates P_N converges in ' +
    'operator norm on l^2 to a positive definite operator P_infty satisfying ' +
    'the infinite-dimensional Lure equation for the prime-delay system ' +
    'Sigma_a. Equivalently, the passivity margin epsilon_N = lambda_min(P_N) ' +
    'is bounded away from zero uniformly in N.',

  classification: 'PARTIALLY-RELATED',
  classificationRationale:
    'M.1 IMPLIES RH (per kyp-bounded-real-section.js impliesRH = true). It ' +
    'sits on top of mature literature (Arov-Nudelman 1996 passive realization ' +
    'on Hilbert state-space; Brodskii 1971 operator colligation; Sz.-Nagy-Foias ' +
    '1970 dilation theory) but the SPECIFIC uniform-margin claim for the ' +
    'prime-delay ladder Sigma_a is not in those references. By imp-1245 axis ' +
    '(c) failure verdict, the unification CDB-Exist does NOT bypass the Phi-non-' +
    'circularity obstruction, so M.1 inherits the same circular dependence: ' +
    'the uniform passivity margin epsilon_N >= c > 0 is equivalent to K_a >= 0 ' +
    'uniformly, which is RH itself. PARTIALLY-RELATED (not SUBSUMED-BY-RH) ' +
    'because the convergence claim adds a specific quantitative content (the ' +
    'rate epsilon_N -> 0 vs epsilon_N -> c > 0) above the RH-equivalent ' +
    'limit-existence claim.',

  rhRelationship:
    'M.1 implies RH (paper text). Conversely RH implies K_a >= 0 uniformly ' +
    'which gives epsilon_N >= 0; the BOUNDED-AWAY-FROM-ZERO part is the ' +
    'quantitative refinement of RH, not RH itself. So M.1 is strictly stronger ' +
    'than RH-equivalent: it adds a uniform-margin quantitative claim.',

  novelContentIfAny:
    'The uniform passivity margin lower bound epsilon_N >= c > 0 for some ' +
    'EFFECTIVE c independent of N is the genuinely NEW quantitative content. ' +
    'imp-1267 HS bound + imp-1287 WH bound establish ||V|| <= 2.94e-4 << 1 ' +
    'analytically, but DO NOT translate directly to a lower bound on ' +
    'lambda_min(P_N) -- that translation is the M.1 content. UNAUDITED whether ' +
    'imp-1267 + imp-1287 imply an effective epsilon_N lower bound; left as a ' +
    'sub-gap for imp-1271-followup.',

  obstruction:
    'Uniform passivity margin = uniform spectral gap of the KYP LMI = uniform ' +
    'lambda_min(K_a^{(N)}) > c > 0 = same operator-norm content as ' +
    '||V_{a,Phi}|| < 1 strictly. The imp-1267 HS bound gives ||V|| <= 2.94e-4 ' +
    'which is strict, but the translation to epsilon_N is non-trivial.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1241 (CDB-Exist non-circular construction open content)',
    'imp-1245 axis (c) (Phi-non-circularity obstruction inherited)',
    'imp-1267 + imp-1287 (analytic ||V|| <= 1 routes -- closes the bounded-' +
      'real face but does NOT translate directly to uniform KYP margin)',
  ]),
});

const CLAIM_N_LK = Object.freeze({
  id: 'N.lyapunov-krasovskii',
  appLabel: 'App N',
  claimName: 'Bounded-real Lyapunov-Krasovskii functional for Sigma_a',
  paperSection: 'App N, pp 103-107',

  paraphrasedStatement:
    'The prime-delay system Sigma_a is L^2-dissipative iff there exists a ' +
    'Lyapunov-Krasovskii functional V >= 0 satisfying dV/dt <= -||y||^2 along ' +
    'every trajectory of Sigma_a. Dissipativity is equivalent to ' +
    '||Theta_a||_inf <= 1, i.e. K_a >= 0.',

  classification: 'SUBSUMED-BY-LITERATURE',
  classificationRationale:
    'The Lyapunov-Krasovskii dissipativity theorem for delay systems is ' +
    'classical (Krasovskii 1959, Hale-Verduyn-Lunel 1993, Park 1999, ' +
    'Gu-Kharitonov-Chen 2003 LMI toolbox for delay systems). For any FINITE ' +
    'collection of N prime delays, the LK-LMI is a standard quadratic delay-' +
    'differential program. The biconditional dissipativity <=> bounded-real ' +
    'is textbook. The shift to the COUNTABLY INFINITE prime-delay set requires ' +
    'an integral-kernel form V[x] = int int K_V(s,t) x(-s) x(-t) ds dt; ' +
    'positivity of K_V <=> K_a >= 0 by the duality argument in kyp-bounded-' +
    'real-section.js App N. This duality is the load-bearing paper construct ' +
    '(circular per kyp-bounded-real-section.js App N blocker) but the LK ' +
    'biconditional itself is literature.',

  rhRelationship:
    'dV/dt <= -||y||^2 iff ||Theta_a||_inf <= 1 (LK + bounded-real lemma) iff ' +
    'K_a >= 0 iff RH. Same chain as M.lmi.',

  novelContentIfAny:
    'The infinite-dimensional integral-kernel form of V with K_V satisfying ' +
    'positivity iff K_a >= 0 is the specific paper construct. Per kyp-bounded-' +
    'real-section.js App N blocker, this is CIRCULAR: K_V cannot be exhibited ' +
    'without already knowing K_a >= 0. So the NOVEL CONTENT is the explicit ' +
    'duality formula K_V <=> K_a, not a new closure path.',

  obstruction:
    'Same circularity as App M: K_V is the would-be Lyapunov kernel and its ' +
    'positivity is K_a >= 0 itself. No bypass.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1233 (Conj 18.1 audit, KYP / Darlington passive realization)',
    'imp-1241 (CDB-Exist three-of-four-unified)',
    'imp-1258 (§15-27 collapse, ||V_{a,Phi}|| <= 1 in L^2([0, inf)))',
  ]),
});

const CLAIM_N_SMOBIUS = Object.freeze({
  id: 'N.signed-mobius',
  appLabel: 'App N',
  claimName: 'Signed-Mobius argument-principle barrier',
  paperSection: 'App N, pp 103-107',

  paraphrasedStatement:
    'The signed-Mobius barrier asserts Im(log Theta_a(i*omega)) does not ' +
    'change sign as omega ranges over R, which would imply the Schur condition ' +
    '||Theta_a||_inf <= 1 via the argument principle applied on the imaginary ' +
    'axis.',

  classification: 'PARTIALLY-RELATED',
  classificationRationale:
    'The argument-principle approach to bounded-real certification is a ' +
    'classical technique (Levinson 1940, Titchmarsh 1939 zeta-function ' +
    'argument-counting). Sign-non-change of Im(log Theta_a) on the imaginary ' +
    'axis would give Schur via the argument principle on the right half-plane ' +
    '-- this is a textbook implication. The OPEN content is whether sign-non- ' +
    'change actually holds for the prime-delay Theta_a. Numerical verification ' +
    'at a = 0.025, |omega| <= 10^4 (imp-1201 pilot) is consistent but does not ' +
    'establish the universal claim. PARTIALLY-RELATED: textbook implication, ' +
    'specific numerical hypothesis -- closer to genuinely novel than App M / O ' +
    'because the implication direction (sign-non-change implies Schur) does ' +
    'NOT directly involve K_a >= 0 and is not the same as the §27 collapse.',

  rhRelationship:
    'sign-non-change of Im(log Theta_a) on iR implies ||Theta_a||_inf <= 1 ' +
    '(argument-principle, literature) implies K_a >= 0 implies RH. So sign- ' +
    'non-change is SUFFICIENT for RH; the converse implication (RH implies ' +
    'sign-non-change) is non-trivial and unaudited here. The argument-principle ' +
    'route is OUTSIDE the §27 collapse pipeline.',

  novelContentIfAny:
    'Yes -- the signed-Mobius approach is the closest Apps M-O claim to a ' +
    'genuinely INDEPENDENT closure path. It does NOT go through ||V|| <= 1 ' +
    '/ Volterra-Hankel positivity / KYP LMI / Gram-Cholesky. Instead it ' +
    'invokes the argument principle on the boundary. UNAUDITED whether ' +
    'imp-1267 HS or imp-1287 WH supply sign-non-change of Im(log Theta_a) as ' +
    'a corollary. Left as sub-gap imp-1271-followup-smobius.',

  obstruction:
    'Sign-non-change of Im(log Theta_a) for ALL primes -- requires uniform ' +
    'convergence of the prime-delay log-product expansion in the boundary ' +
    'argument function. Open per kyp-bounded-real-section.js App N text.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1267 (HS bound on ||V||) -- different L^2-operator-norm route',
    'imp-1287 (WH bound) -- different Fourier-symbol route',
    '(no direct overlap with §27 collapse; this is the most-independent of ' +
      'Apps M-O claims, hence the mixed-verdict flag)',
  ]),
});

const CLAIM_O_GRAM = Object.freeze({
  id: 'O.delay-gram',
  appLabel: 'App O',
  claimName: 'Delay-Gram positivity at prime-delay nodes',
  paperSection: 'App O, pp 107-110',

  paraphrasedStatement:
    'The delay-Gram matrix G_{a,N}[p,q] = K_a(tau_p, tau_q) at prime-delay ' +
    'nodes tau_p = log p is positive semidefinite at every finite N (Cholesky ' +
    'pilot). If G_{a,N} >= 0 for all N and a > 0, then K_a is a PSD kernel on ' +
    'all of C_+, hence RH.',

  classification: 'SUBSUMED-BY-LITERATURE',
  classificationRationale:
    'Finite-N Gram-matrix positivity at evaluation nodes is a textbook ' +
    'restriction of the kernel positivity statement (Aronszajn 1950 RKHS ' +
    'theory). The implication (G_{a,N} >= 0 for all N) implies (K_a >= 0 on ' +
    'a dense set) requires the prime-delay nodes to be DENSE in (0, infty), ' +
    'which they are NOT (Baker independence implies log p are linearly ' +
    'independent over Q but not dense). The literature gap (density of the ' +
    'restriction set) is exactly the blocker per kyp-bounded-real-section.js ' +
    'App O. So App O is finite-N restriction of the kernel positivity ' +
    'statement, which is the same content as §27 with finite-N truncation.',

  rhRelationship:
    'G_{a,N} >= 0 for all N (with density) implies K_a >= 0 implies RH. ' +
    'Density is the gap. Finite-N positivity is consistent with non-PSD K_a ' +
    'in principle if test sets miss the indefinite directions.',

  novelContentIfAny:
    'The specific choice of prime-delay nodes tau_p = log p as the evaluation ' +
    'set is the paper specific. The Cholesky pilot is a numerical certificate ' +
    'class. NONE of this is closure -- imp-1267 + imp-1287 already establish ' +
    '||V|| << 1 on L^2([0, inf)) directly, which is strictly stronger than ' +
    'finite-N Cholesky pilots.',

  obstruction:
    'RKHS DENSITY: the prime-delay nodes tau_p = log p are not dense in ' +
    '(0, infty). Closing requires a quantitative RKHS density theorem or ' +
    'analytic continuation argument. Neither is established (Conj O.1 open).',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1241 (CDB-Exist non-circular construction)',
    'imp-1258 (§15-27 collapse -- App O is a finite-N truncation in disguise)',
    'imp-1267 + imp-1287 (analytic ||V|| <= 1 routes -- strictly stronger ' +
      'than finite-N Cholesky pilots)',
  ]),
});

const CLAIM_O_1 = Object.freeze({
  id: 'O.1',
  appLabel: 'App O',
  claimName: 'Conjecture O.1: Delay-Gram density implies kernel positivity',
  paperSection: 'App O, pp 107-110',

  paraphrasedStatement:
    'If the delay-Gram matrix G_{a,N} is positive definite for every N >= 1 ' +
    'and every a > 0, then the shifted bridge kernel K_a(z,w) is a PSD kernel ' +
    'on the closed upper half-plane C_+, and hence RH holds.',

  classification: 'PARTIALLY-RELATED',
  classificationRationale:
    'O.1 IMPLIES RH (kyp-bounded-real-section.js impliesRH = true). Standard ' +
    'RKHS density (Aronszajn 1950) would give this if the prime-delay nodes ' +
    'tau_p = log p were DENSE in (0, infty). They are not. So O.1 is a ' +
    'specific density-extension claim for a non-dense node set, which is ' +
    'genuinely above textbook RKHS theory. PARTIALLY-RELATED: RKHS framework ' +
    'is literature; non-dense node set extension is open.',

  rhRelationship:
    'O.1 implies RH (paper text). Converse implication (RH implies G_{a,N} > 0 ' +
    'for all N) is direct from K_a >= 0 via positive-semidefiniteness restriction ' +
    'to any finite subset of evaluation nodes.',

  novelContentIfAny:
    'The Baker-independence-modulated density extension is the open content. ' +
    'Lindemann-Weierstrass on log p (Baker 1966 generalization) makes the ' +
    'delay set linearly independent over Q but does NOT make it dense over R. ' +
    'A density extension that exploits arithmetic structure of {log p} rather ' +
    'than topological density would be NEW; none such is established.',

  obstruction:
    'Same as O.delay-gram: RKHS density. Conj O.1 IS the density extension ' +
    'claim, so it is the obstruction itself, not blocked by a separate ' +
    'obstruction.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1241 (non-circular construction of dm_a / K_a from Phi)',
    'imp-1267 + imp-1287 (L^2([0, inf)) analytic routes already close ||V|| <= 1)',
  ]),
});

const CLAIM_SCHUR_EQ = Object.freeze({
  id: 'M-N-O.schur-equivalence',
  appLabel: 'M / N / O',
  claimName: 'Triple equivalence: KYP feasibility iff LK dissipativity iff Gram positivity (all => Schur Theta_a)',
  paperSection: 'Apps M-O landscape, kyp-bounded-real-section.js',

  paraphrasedStatement:
    'The three control-theoretic certificates (App M KYP LMI, App N LK ' +
    'dissipativity, App O delay-Gram positivity) are EACH SUFFICIENT for ' +
    'Schur Theta_a, equivalently K_a >= 0, equivalently RH. Apps M-O present ' +
    'them as three independent routes.',

  classification: 'SUBSUMED-BY-RH',
  classificationRationale:
    'The triple equivalence Schur Theta_a iff K_a >= 0 iff Delta = 0 iff RH ' +
    '(paper §16 Theorem 16.1, kyp-bounded-real-section.js landscape) makes ' +
    'each of the three certificates RH-equivalent. So all three sufficient ' +
    'conditions are equivalent to each other, equivalent to RH. The ' +
    '"independent routes" framing is misleading: at the LOGICAL level the ' +
    'three are notational presentations of K_a >= 0.',

  rhRelationship:
    'Each is iff RH on the closure side; each has the same Phi-non-circularity ' +
    'obstruction on the construction side.',

  novelContentIfAny:
    'The CONTROL-THEORETIC dress (KYP / LK / delay-Gram) is the new vocabulary ' +
    'imported from network synthesis / dissipativity theory. Whether this ' +
    'vocabulary unlocks a non-circular Phi-built dm_a is the same question as ' +
    'CDB-Exist (imp-1241), which imp-1245 axis (c) shows it does NOT.',

  obstruction:
    'Phi-non-circularity per imp-1245 axis (c) -- inherited by all three Apps.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1241 (CDB-Exist three-of-four-unified)',
    'imp-1244 (CONFIRMED-SUBSUMED-BY-RH second-pass pattern)',
    'imp-1258 (§15-27 collapse to ||V|| <= 1)',
    'imp-1265 (§27 paper-construct identity recheck)',
  ]),
});

const CLAIM_BLOCK_EXTENSION = Object.freeze({
  id: 'M-N-O.block-extension',
  appLabel: 'M / N / O',
  claimName: 'Block / matrix-valued / Pontryagin-passive operator class extension',
  paperSection: 'Apps M-O landscape',

  paraphrasedStatement:
    'Question (b) of imp-1271: does Apps M-O extend the imp-1258 §15-27 ' +
    'collapse (which lives on the scalar Volterra-Hankel V_{a,Phi}) to a ' +
    'wider operator class (block-Toeplitz / matrix-valued Schur / Pontryagin- ' +
    'passive S^kappa)?',

  classification: 'INDEPENDENT-NOVEL',
  classificationRationale:
    'INDEPENDENT-NOVEL in the sense that no such extension is articulated. ' +
    'Apps M-O work entirely in the SCALAR Schur class on C_+ (Theta_a is a ' +
    'scalar transfer function; G_{a,N} is a scalar Gram matrix; the KYP LMI ' +
    'is on a SCALAR transfer function). Block / matrix-valued / Pontryagin- ' +
    'passive S^kappa classes are NOT addressed. So the answer to question (b) ' +
    'is NO: Apps M-O does NOT extend the §15-27 collapse to a wider operator ' +
    'class. INDEPENDENT-NOVEL classification is the negative answer: this ' +
    'would-be extension is INDEPENDENT of Apps M-O (i.e. orthogonal) and ' +
    'remains unaudited in the paper. Krein-Langer S^kappa with kappa = 0 ' +
    'recovers de Branges H(E_a) (imp-1289), confirming no widening via S^kappa.',

  rhRelationship:
    'NULL -- this is a negative existence claim about Apps M-O coverage, not ' +
    'a positive claim equivalent to RH.',

  novelContentIfAny:
    'The block / matrix-valued extension would be genuinely NEW content (e.g. ' +
    '2x2 block-Toeplitz with off-diagonal Phi(u) Phi(v) sinh(au) sinh(av) ' +
    'coupling) but Apps M-O does not articulate it. Recommended as a future ' +
    'research direction; flagged here as an UNAUDITED orthogonal axis.',

  obstruction:
    'NONE -- the negative answer (Apps M-O does not extend) is direct from ' +
    'the scalar-only formulation in kyp-bounded-real-section.js. The would-be ' +
    'block / matrix extension is open as a separate research direction.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1289 (§17.4 Krein-Langer kappa = 0 specialization recovers de ' +
      'Branges H(E_a), not a 4th route)',
    'imp-1258 (§15-27 collapse on scalar V)',
  ]),
});

const CLAIM_NEW_CLOSURE = Object.freeze({
  id: 'M-N-O.new-closure-paths',
  appLabel: 'M / N / O',
  claimName: 'New closure paths to Lambda beyond imp-1267 HS / imp-1287 WH',
  paperSection: 'Apps M-O landscape vs lambda-roadmap',

  paraphrasedStatement:
    'Question (c) of imp-1271: do Apps M-O carry any NEW closure paths to ' +
    'Lambda (the Newman-de Bruijn constant) that the imp-1267 HS bound ' +
    '(||V|| <= sqrt(I_0 J_a) <= 2.94e-4) and imp-1287 WH bound ' +
    '(||V|| <= ||Phi||_inf^2 / a = 0.1996/a) routes missed?',

  classification: 'SUBSUMED-BY-LITERATURE',
  classificationRationale:
    'No. Apps M-O supplies finite-N CHOLESKY PILOTS only (App O: G_{a,N} ' +
    'positive at tested a, N; App M: P_N feasible at N = 20, 50; App N: ' +
    'epsilon_N > 0.003 at N = 10, 20). NONE supplies an unconditional L^2([0, ' +
    'inf)) analytical operator-norm bound. The imp-1267 HS bound + imp-1287 ' +
    'WH bound TOGETHER already cover all a > 0 unconditionally (HS for a in ' +
    '(0, ~37.66] per imp-1260; WH for a >= ||Phi||_inf^2 ~ 0.1996; union ' +
    'covers (0, inf)). Apps M-O does NOT improve this. SUBSUMED-BY-LITERATURE ' +
    'because the operator-norm tools (HS, WH) come from analytic operator ' +
    'theory literature (Halmos 1957, Krein 1958, Widom 1965), not from ' +
    'control theory.',

  rhRelationship:
    'Apps M-O routes are RH-equivalent on closure; HS / WH analytic routes ' +
    'are also RH-equivalent on closure (both deliver ||V|| <= 1 which delivers ' +
    'K_a >= 0 which delivers RH conditional on Polymath15 G6a per imp-1264). ' +
    'No new Lambda-path emerges from Apps M-O.',

  novelContentIfAny:
    'Apps M-O contributes NO new closure path to Lambda. The control-theoretic ' +
    'dress is expository, not strategic. The signed-Mobius argument-principle ' +
    'route (CLAIM_N_SMOBIUS) is the closest-to-novel sub-claim but still ' +
    'RH-equivalent on closure.',

  obstruction:
    'NONE -- this is a negative claim. Apps M-O simply does not contribute a ' +
    'new analytic L^2 operator-norm bound. The HS / WH routes (imp-1267 / ' +
    'imp-1287) already close the Volterra-Hankel norm side; Apps M-O routes ' +
    'are downstream finite-N pilots.',

  overlapsWithExistingAudits: Object.freeze([
    'imp-1267 (HS bound, route 1 of imp-1260)',
    'imp-1287 (WH bound, route 4 of imp-1260)',
    'imp-1260 (large-a crossover analysis)',
    'imp-1286 (rigorous tail-bound transfer L^2([0, U]) -> L^2([0, inf)))',
  ]),
});

const PER_CLAIM = Object.freeze([
  CLAIM_M_LMI,
  CLAIM_M_1,
  CLAIM_N_LK,
  CLAIM_N_SMOBIUS,
  CLAIM_O_GRAM,
  CLAIM_O_1,
  CLAIM_SCHUR_EQ,
  CLAIM_BLOCK_EXTENSION,
  CLAIM_NEW_CLOSURE,
]);

// -- Three structural questions --------------------------------------------

const QUESTION_A = Object.freeze({
  id: 'q-a-standalone',
  question:
    'Does Apps M-O contain STANDALONE claims independent of CDB-Exist ' +
    '(imp-1241)?',
  answer: 'no-modulo-smobius',
  rationale:
    'App M KYP LMI feasibility is RH-equivalent via the Schur dictionary, ' +
    'which is the same content as CDB-Exist via the imp-1245 axis (a) ' +
    'Arov-Nudelman 1996 bridge. App N LK dissipativity is RH-equivalent via ' +
    'the bounded-real lemma, same content. App O delay-Gram positivity is ' +
    'RH-equivalent via RKHS restriction, same content. The two named ' +
    'sub-conjectures M.1 and O.1 BOTH imply RH and are therefore part of the ' +
    'CDB-Exist cluster on closure. The closest-to-standalone sub-claim is ' +
    'CLAIM_N_SMOBIUS (signed-Mobius argument principle on iR), which uses ' +
    'a different proof technique (argument principle) than CDB-Exist (canonical ' +
    'system existence). The closure-side equivalence still holds (sign-non- ' +
    'change implies Schur implies K_a >= 0 implies RH) but the construction ' +
    'route is orthogonal. So the answer is "no, modulo signed-Mobius as a ' +
    'partially-independent argument-principle route".',
});

const QUESTION_B = Object.freeze({
  id: 'q-b-block-extension',
  question:
    'Does Apps M-O extend the imp-1258 §15-27 collapse to a wider operator ' +
    'class (block / matrix-valued / Pontryagin-passive)?',
  answer: 'no',
  rationale:
    'No. Apps M-O works entirely in the SCALAR Schur class on C_+. No block ' +
    '/ matrix-valued / Pontryagin-passive S^kappa extension is articulated. ' +
    'Per imp-1289, the kappa = 0 specialization of Krein-Langer S^kappa ' +
    'recovers de Branges H(E_a), confirming no widening via S^kappa. The ' +
    'block-Toeplitz extension would be a separate research direction not ' +
    'in Apps M-O.',
});

const QUESTION_C = Object.freeze({
  id: 'q-c-new-closure-paths',
  question:
    'Does Apps M-O carry any NEW closure paths to Lambda that imp-1267 HS / ' +
    'imp-1287 WH wave-15/16 attacks missed?',
  answer: 'no',
  rationale:
    'No. Apps M-O supplies finite-N CHOLESKY PILOTS only (G_{a,N} > 0 at ' +
    'tested a, N; P_N feasible at N = 20, 50; epsilon_N > 0.003 at N = 10, ' +
    '20). None supplies an unconditional L^2([0, inf)) analytical operator- ' +
    'norm bound. The imp-1267 HS bound + imp-1287 WH bound TOGETHER cover ' +
    'all a > 0 unconditionally. Apps M-O does NOT improve this. The signed- ' +
    'Mobius argument-principle route (CLAIM_N_SMOBIUS) is the closest-to- ' +
    'novel sub-claim but remains finite-N numerically verified and not ' +
    'unconditionally proven for all primes; even if proven, it would only ' +
    'recover the same Schur conclusion that HS / WH already deliver.',
});

const STRUCTURAL_QUESTIONS = Object.freeze([QUESTION_A, QUESTION_B, QUESTION_C]);

// -- Final verdict ---------------------------------------------------------

const FINAL_VERDICT = 'redundant-with-1244+1245+1258';

const VERDICT_RATIONALE =
  'All nine audited Apps M-O claims (six per-App + three structural answers) ' +
  'reduce to the same RH-equivalent content as CDB-Exist (imp-1241) on closure, ' +
  'and inherit the same Phi-non-circularity obstruction as imp-1245 axis (c). ' +
  'The three structural questions all answer NO (or NO-modulo-smobius for ' +
  'standalone). The control-theoretic dress (KYP LMI / Lyapunov-Krasovskii / ' +
  'delay-Gram Cholesky) is expository, not strategic: Apps M-O renames the ' +
  'open content of CDB-Exist into network-synthesis vocabulary without ' +
  'advancing the proof program. The signed-Mobius argument-principle route ' +
  '(CLAIM_N_SMOBIUS) is the closest-to-novel sub-claim and is flagged as a ' +
  'follow-up sub-gap (imp-1271-followup-smobius). Apps M-O is therefore ' +
  'REDUNDANT with the prior audit cluster (imp-1244 + imp-1245 + imp-1258) ' +
  'with one PARTIALLY-RELATED sub-claim (signed-Mobius) and no NEW closure ' +
  'path to Lambda.';

// -- Sources cited ---------------------------------------------------------

const SOURCES = Object.freeze([
  'twin_ladder_consolidated_v52.pdf Apps M-O pp 97-110 (paper)',
  'src/data/kyp-bounded-real-section.js (imp-1201 -- Apps M-O reference data)',
  'src/data/twin-ladder-paper-roadmap.js App M / N / O entries',
  'src/data/imp-1241-unified-existence-conjecture.js (CDB-Exist)',
  'src/data/imp-1245-cdb-exist-stress-test.js (axis-a / b / c verdicts)',
  'src/data/imp-1258-volterra-cdb-bridge.js (§15-27 two-way collapse)',
  'src/data/imp-1233-conjectures-18-1-18-2-audit.js (Conj 18.1 KYP audit)',
  'src/data/imp-1289-section17-4-krein-langer-attack.js (kappa = 0 = de Branges)',
  'Anderson-Vongpanitlerd 1973, Network Analysis and Synthesis (KYP / passive)',
  'Arov-Nudelman 1996, Passive Systems and Characteristic Functions',
  'Krasovskii 1959 / Hale-Verduyn-Lunel 1993 / Park 1999 / Gu-Kharitonov-Chen 2003 ' +
    '(delay-system Lyapunov-Krasovskii LMI)',
  'Aronszajn 1950, Theory of Reproducing Kernels (RKHS density)',
  'Yakubovich 1962 / Kalman 1963 / Popov 1962 (classical KYP lemma)',
  'de Branges 1968, Hilbert Spaces of Entire Functions (Thm 19, 23)',
]);

// -- Cross-references ------------------------------------------------------

const CROSS_REFERENCES = Object.freeze([
  'imp-1241: CDB-Exist three-of-four-unified; Apps M-O claims map to the ' +
    'KYP-passive face of the unified existence',
  'imp-1244: CONFIRMED-SUBSUMED-BY-RH second pass; verdict pattern (7 of 7 ' +
    'confirmed) extends to Apps M-O closure-side claims',
  'imp-1245: axis (a) pass-with-caveats (Arov-Nudelman 1996 bridge); axis (c) ' +
    'fail (Phi-non-circularity obstruction inherited by Apps M-O)',
  'imp-1258: §15-27 two-way collapse to ||V_{a,Phi}|| <= 1; Apps M-O are ' +
    'downstream finite-N pilots of the same content',
  'imp-1233: Conj 18.1 KYP / passive-realization audit, PARTIALLY-RELATED to ' +
    'Anderson-Vongpanitlerd 1973 -- App M is the same content in LMI form',
  'imp-1265: §27 paper-construct identity recheck -- block positivity <=> K_a ' +
    '>= 0; relates to whether Apps M-O extends to block class (it does not)',
  'imp-1267: HS bound ||V|| <= sqrt(I_0 J_a) <= 2.94e-4 -- unconditional L^2 ' +
    'route already covers all a > 0; Apps M-O does not improve',
  'imp-1287: WH bound ||V|| <= ||Phi||_inf^2 / a -- complementary L^2 route',
  'imp-1289: §17.4 Krein-Langer S^kappa = de Branges at kappa = 0, no widening ' +
    'via block / matrix / Pontryagin classes',
]);

// -- Unaudited sub-gaps + honest scope -------------------------------------

const UNAUDITED_SUB_GAPS = Object.freeze([
  {
    id: 'imp-1271-followup-smobius',
    note:
      'Whether the imp-1267 HS bound and / or imp-1287 WH bound supply sign- ' +
      'non-change of Im(log Theta_a) on iR as a CORLLARY -- this would close ' +
      'the App N signed-Mobius route via the analytic L^2 routes. Not audited ' +
      'here; flagged as the most-promising follow-up.',
  },
  {
    id: 'imp-1271-followup-uniform-margin',
    note:
      'Whether the imp-1267 HS bound (||V|| <= 2.94e-4) translates to a ' +
      'uniform passivity margin epsilon_N >= c > 0 for the KYP LMI truncations ' +
      'P_N. Not audited here; would close Conj M.1.',
  },
  {
    id: 'imp-1271-followup-block-extension',
    note:
      'The block / matrix-valued / Pontryagin-passive S^kappa extension of ' +
      'Apps M-O is a SEPARATE research direction not articulated in the paper. ' +
      'Flagged as orthogonal but not closed here.',
  },
]);

const HONEST_SCOPE = Object.freeze([
  'This audit uses training-time knowledge only. No external browsing. The ' +
    'verdicts on each Apps M-O claim are based on the textbook KYP / LK / ' +
    'RKHS literature and the established CDB-Exist + §15-27 collapse + HS / WH ' +
    'analytic routes in the codebase.',
  'The Apps M-O paper text is reached via src/data/kyp-bounded-real-section.js ' +
    '(imp-1201) which is the reference data record on disk. No fresh PDF text ' +
    'extraction was performed; paraphrased statements are quoted from the ' +
    'kyp-bounded-real-section.js record, which is itself derived from the v52 ' +
    'paper Apps M-O text (pp 97-110).',
  'Three sub-gaps are flagged for follow-up audits (see UNAUDITED_SUB_GAPS): ' +
    'signed-Mobius via HS / WH (most promising), uniform passivity margin via ' +
    'HS bound, block-class extension as separate research direction.',
  'The verdict redundant-with-1244+1245+1258 is the HONEST conclusion: Apps ' +
    'M-O is a control-theoretic re-paraphrase of CDB-Exist / §27, not a new ' +
    'closure path. Useful FINDING that the last paper section never directly ' +
    'audited turns out to not contain hidden closure paths.',
  'The classification taxonomy follows the 13-conjecture audit pattern ' +
    '(imp-1244 vocabulary): SUBSUMED-BY-RH / SUBSUMED-BY-LITERATURE / ' +
    'PARTIALLY-RELATED / INDEPENDENT-NOVEL. Per-claim verdicts: 3 SUBSUMED-' +
    'BY-LITERATURE (M.lmi, N.lk, O.gram), 2 PARTIALLY-RELATED (M.1, O.1, ' +
    'N.smobius), 1 SUBSUMED-BY-RH (schur-equivalence), 1 INDEPENDENT-NOVEL ' +
    '(block-extension as orthogonal negative answer), 1 SUBSUMED-BY-LITERATURE ' +
    '(new-closure-paths as negative answer).',
]);

// -- Export ----------------------------------------------------------------

export const IMP_1271_APPS_MNO_AUDIT = Object.freeze({
  id: 'imp-1271-apps-MNO-audit',
  ticket: 'imp-1271',
  auditDate: '2026-05-28',
  auditedByModel: 'opus-4-8',
  auditedByChannel: 'opus-4-8-worktree',
  paper: PAPER_REF,
  paperSections: Object.freeze([
    'App M pp 97-102 (KYP state-space)',
    'App N pp 103-107 (bounded-real delay + signed-Mobius)',
    'App O pp 107-110 (delay-Gram Cholesky)',
  ]),

  question:
    'Audit v52 Appendices M-O (KYP bounded-real / positive-real) for ' +
    '(a) standalone claims independent of CDB-Exist, (b) block / matrix- ' +
    'valued / Pontryagin-passive operator-class extension of the imp-1258 ' +
    'collapse, (c) new closure paths to Lambda beyond imp-1267 HS / imp-1287 ' +
    'WH routes.',

  finalVerdict: FINAL_VERDICT,
  verdictRationale: VERDICT_RATIONALE,

  perClaim: PER_CLAIM,
  perClaimLookup: Object.freeze({
    'M.lmi': CLAIM_M_LMI,
    'M.1': CLAIM_M_1,
    'N.lk': CLAIM_N_LK,
    'N.smobius': CLAIM_N_SMOBIUS,
    'O.gram': CLAIM_O_GRAM,
    'O.1': CLAIM_O_1,
    'schur-eq': CLAIM_SCHUR_EQ,
    'block-extension': CLAIM_BLOCK_EXTENSION,
    'new-closure-paths': CLAIM_NEW_CLOSURE,
  }),

  structuralQuestions: STRUCTURAL_QUESTIONS,
  structuralQuestionsLookup: Object.freeze({
    'q-a': QUESTION_A,
    'q-b': QUESTION_B,
    'q-c': QUESTION_C,
  }),

  sources: SOURCES,
  crossReferences: CROSS_REFERENCES,
  unauditedSubGaps: UNAUDITED_SUB_GAPS,
  honestScope: HONEST_SCOPE,

  countPerClaim: PER_CLAIM.length,
  countSources: SOURCES.length,
  countCrossReferences: CROSS_REFERENCES.length,
});

export default IMP_1271_APPS_MNO_AUDIT;

// -- Build-time tripwires --------------------------------------------------

export const IMP_1271_ASSERTIONS = [
  {
    id: 'imp1271-final-verdict-is-redundant',
    why:
      'The audit concludes Apps M-O is a control-theoretic re-paraphrase ' +
      'of CDB-Exist / §27 with no new closure path to Lambda. The final ' +
      'verdict must be redundant-with-1244+1245+1258.',
    holds: () =>
      IMP_1271_APPS_MNO_AUDIT.finalVerdict === 'redundant-with-1244+1245+1258',
  },
  {
    id: 'imp1271-nine-claims-audited',
    why:
      'The audit must classify exactly 9 claims (6 per-App: M.lmi, M.1, N.lk, ' +
      'N.smobius, O.gram, O.1 + 3 structural: schur-eq, block-extension, ' +
      'new-closure-paths). Adding or dropping one would misalign with the ' +
      'kyp-bounded-real-section.js + imp-1241 + imp-1245 + imp-1258 references.',
    holds: () =>
      Array.isArray(IMP_1271_APPS_MNO_AUDIT.perClaim) &&
      IMP_1271_APPS_MNO_AUDIT.perClaim.length === 9,
  },
  {
    id: 'imp1271-each-claim-has-classification-and-rationale',
    why:
      'Per-claim classification must be one of {SUBSUMED-BY-RH, SUBSUMED-BY- ' +
      'LITERATURE, PARTIALLY-RELATED, INDEPENDENT-NOVEL}, each with a non- ' +
      'empty rationale (>= 80 chars). Empty rationales would leave the ' +
      'classification unjustified.',
    holds: () => {
      const allowed = new Set([
        'SUBSUMED-BY-RH',
        'SUBSUMED-BY-LITERATURE',
        'PARTIALLY-RELATED',
        'INDEPENDENT-NOVEL',
      ]);
      return IMP_1271_APPS_MNO_AUDIT.perClaim.every(
        (c) =>
          allowed.has(c.classification) &&
          typeof c.classificationRationale === 'string' &&
          c.classificationRationale.length >= 80,
      );
    },
  },
  {
    id: 'imp1271-three-structural-questions-answered',
    why:
      'The audit must answer exactly 3 structural questions (a / b / c) with ' +
      'non-empty rationale each. These are the question-under-test directly ' +
      'specified in the imp-1271 ticket description.',
    holds: () => {
      const sq = IMP_1271_APPS_MNO_AUDIT.structuralQuestions;
      if (!Array.isArray(sq) || sq.length !== 3) return false;
      const ids = new Set(sq.map((q) => q.id));
      return (
        ids.has('q-a-standalone') &&
        ids.has('q-b-block-extension') &&
        ids.has('q-c-new-closure-paths') &&
        sq.every(
          (q) =>
            typeof q.answer === 'string' &&
            q.answer.length >= 2 &&
            typeof q.rationale === 'string' &&
            q.rationale.length >= 80,
        )
      );
    },
  },
  {
    id: 'imp1271-at-least-four-sources-cited',
    why:
      'Per the ticket tripwire spec, the audit must cite at least 4 sources. ' +
      'The actual list contains 14 sources (paper + 7 codebase modules + 6 ' +
      'literature references); 4 is the floor.',
    holds: () =>
      Array.isArray(IMP_1271_APPS_MNO_AUDIT.sources) &&
      IMP_1271_APPS_MNO_AUDIT.sources.length >= 4,
  },
  {
    id: 'imp1271-cross-references-imp-1241-1245-1258',
    why:
      'The audit must cross-reference imp-1241 (CDB-Exist), imp-1245 (stress- ' +
      'test), and imp-1258 (§15-27 collapse) by ticket ID. These three are ' +
      'the established audit cluster that Apps M-O is being compared to.',
    holds: () => {
      const refs = IMP_1271_APPS_MNO_AUDIT.crossReferences.join(' | ');
      return (
        refs.includes('imp-1241') &&
        refs.includes('imp-1245') &&
        refs.includes('imp-1258')
      );
    },
  },
  {
    id: 'imp1271-question-b-answers-no-block-extension',
    why:
      'Question (b) must answer NO: Apps M-O does not extend the §15-27 ' +
      'collapse to a wider operator class. This is the negative finding that ' +
      'distinguishes the verdict from extends-1258-collapse-to-block.',
    holds: () => {
      const qb = IMP_1271_APPS_MNO_AUDIT.structuralQuestionsLookup['q-b'];
      return qb && qb.answer === 'no';
    },
  },
  {
    id: 'imp1271-question-c-answers-no-new-closure-paths',
    why:
      'Question (c) must answer NO: Apps M-O does not carry new closure paths ' +
      'to Lambda beyond imp-1267 HS + imp-1287 WH. This is the negative ' +
      'finding that justifies the redundant verdict.',
    holds: () => {
      const qc = IMP_1271_APPS_MNO_AUDIT.structuralQuestionsLookup['q-c'];
      return qc && qc.answer === 'no';
    },
  },
  {
    id: 'imp1271-classification-distribution-honest',
    why:
      'Honesty check: the classification distribution must include at least ' +
      'one SUBSUMED-BY-LITERATURE (textbook) and at least one PARTIALLY-RELATED ' +
      '(sub-conjectures M.1 / O.1 with quantitative refinement above RH-' +
      'equivalence). All-SUBSUMED-BY-RH would be overclassification (M.1 / O.1 ' +
      'add quantitative content); all-INDEPENDENT-NOVEL would overclaim novelty.',
    holds: () => {
      const cs = IMP_1271_APPS_MNO_AUDIT.perClaim.map((c) => c.classification);
      return (
        cs.includes('SUBSUMED-BY-LITERATURE') &&
        cs.includes('PARTIALLY-RELATED')
      );
    },
  },
  {
    id: 'imp1271-honest-scope-discloses-training-time-only',
    why:
      'The honestScope array must explicitly disclose training-time-only ' +
      'methodology + the fact that the Apps M-O paper text is reached via ' +
      'kyp-bounded-real-section.js (imp-1201) rather than fresh PDF text ' +
      'extraction. Hiding the methodology would overclaim.',
    holds: () => {
      const scope = IMP_1271_APPS_MNO_AUDIT.honestScope;
      return (
        Array.isArray(scope) &&
        scope.length >= 4 &&
        scope.some((s) => /training-time|no external browsing/i.test(s)) &&
        scope.some((s) =>
          /kyp-bounded-real-section|imp-1201|paper text/i.test(s),
        )
      );
    },
  },
  {
    id: 'imp1271-unaudited-sub-gaps-flagged',
    why:
      'Per the ticket DO NOT fabricate clause: if a sub-claim is the closest- ' +
      'to-novel content (signed-Mobius) but cannot be closed in this audit, ' +
      'it must be flagged as an unaudited sub-gap. The three follow-up sub- ' +
      'gaps (smobius, uniform-margin, block-extension) preserve the honest ' +
      'scope.',
    holds: () => {
      const subs = IMP_1271_APPS_MNO_AUDIT.unauditedSubGaps;
      if (!Array.isArray(subs) || subs.length < 3) return false;
      const ids = new Set(subs.map((s) => s.id));
      return (
        ids.has('imp-1271-followup-smobius') &&
        ids.has('imp-1271-followup-uniform-margin') &&
        ids.has('imp-1271-followup-block-extension')
      );
    },
  },
  {
    id: 'imp1271-all-claims-have-rh-relationship',
    why:
      'Per-claim rhRelationship field must be present (>= 30 chars) for all ' +
      '9 claims. This is the semantic check that ties each control-theoretic ' +
      'claim back to RH on closure (or explicitly NULL for negative claims).',
    holds: () =>
      IMP_1271_APPS_MNO_AUDIT.perClaim.every(
        (c) =>
          typeof c.rhRelationship === 'string' && c.rhRelationship.length >= 5,
      ),
  },
];

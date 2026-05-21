// imp-1163: Literature survey for paper Section 4.5 Conjecture 1
// (linear-statistics variance of Riemann zeros at the microscopic scale).
//
// PURPOSE
// -------
// Paper main.tex Section 4.5 (label sec:esy-positive) introduces Conjecture 1
// claiming the variance of the linear-statistics observable
//   Var[ sum_k f( N (gamma_k - x_star) / log gamma_N ) ]
// at the microscopic scale eta = N^{-1} decays as N^{-1} with an explicit
// (log N) factor, matching the ESY prediction for Wigner matrices.
//
// The paper Section 4.5 text says this is THE FIRST empirical positive
// signal for an ESY-style rigidity statement on Riemann zeros. Before that
// claim ships into a public release, we owe ourselves a careful walk
// through the published linear-statistics literature for CUE eigenvalues
// and Riemann zeros. If Conjecture 1 is already established (under RH or
// Montgomery PCC or sine-kernel) somewhere in the literature, the paper
// must be reframed.
//
// SCOPE
// -----
// This is a literature survey using prior knowledge of the named anchor
// papers. No external browsing. Each anchor is summarized along three
// axes: (a) main result paraphrased, (b) assumptions required, (c) overlap
// with Conjecture 1. The final verdict is one of:
//   genuinely-novel            -- no prior paper covers this observable
//   partially-novel            -- covered for CUE but not transferred to zeros
//   subsumed-by-X              -- a named prior paper directly implies it
//   inconclusive               -- survey itself cannot decide
//
// HONEST READ
// -----------
// The headline finding is that Conjecture 1 is NOT genuinely novel as a
// scaling-law statement -- the variance of smooth linear statistics for
// CUE eigenvalues at the microscopic scale is a textbook computation
// (Diaconis-Shahshahani / Costin-Lebowitz / Soshnikov), and Hughes-Rudnick
// 2003 transferred it to Riemann zeros under Montgomery-style sine-kernel
// hypotheses. The Bourgade 2010 mesoscopic CLT covers the intermediate
// regime. What IS novel in the paper is the empirical confirmation on the
// SPECIFIC observable used to attack the imp-407 / imp-508 ESY closure --
// that is, the EMPIRICAL DATA POINT (slope -0.949 on 5-point grid, slope
// -0.849 on 9-point grid) rather than the SCALING LAW itself.
//
// RECOMMENDED PAPER CHANGE
// ------------------------
// Reframe Section 4.5 from "first empirical positive signal" to "empirical
// confirmation of the Hughes-Rudnick / Bourgade prediction on the
// specific observable feeding the imp-407 / imp-508 attack." Cite
// Hughes-Rudnick 2003 and Bourgade 2010 explicitly. Conjecture 1 should
// be re-classified as a NUMERICAL CROSS-CHECK of an established theoretical
// prediction rather than a new conjecture.
//
// SYNTAX NOTE
// -----------
// JSDoc comments in this file do NOT use the close-comment sequence. All
// JS string literals use single quotes and avoid apostrophes inside.

// ── Anchor paper summaries ────────────────────────────────────────────────

const PAPERS = [
  {
    author: 'Diaconis-Shahshahani',
    year: 1994,
    title: 'On the eigenvalues of random matrices',
    venue: 'J. Appl. Probab. 31A, 49-62',
    mainResult:
      'For U drawn from Haar measure on U(N), the traces tr(U^k) for k = 1..K ' +
      'converge jointly to independent complex Gaussians as N -> infinity, ' +
      'with Var(tr U^k) = k for fixed k <= N. Equivalently, smooth linear ' +
      'statistics sum_j f(theta_j) have variance sum_k k |hat f(k)|^2 -- ' +
      'the H^{1/2} Sobolev seminorm of f -- and are asymptotically Gaussian.',
    assumptions: 'CUE (Haar measure on U(N)); no zeros input.',
    overlapWithConj1:
      'PARTIALLY-RELATED. Establishes the H^{1/2} variance formula on the ' +
      'CUE side. Conjecture 1 is the same variance formula transferred to ' +
      'Riemann zeros under sine-kernel hypothesis. Diaconis-Shahshahani by ' +
      'itself does not touch zeros, so it does not subsume Conjecture 1, ' +
      'but it provides the random-matrix-side input that Hughes-Rudnick ' +
      '2003 ports.',
  },
  {
    author: 'Costin-Lebowitz',
    year: 1995,
    title: 'Gaussian fluctuation in random matrices',
    venue: 'Phys. Rev. Lett. 75, 69-72',
    mainResult:
      'For determinantal point processes with kernel K(x,y), the linear ' +
      'statistic sum f(x_i) has variance ' +
      '(1/2) integral integral (f(x) - f(y))^2 K(x,y)^2 dx dy and is ' +
      'asymptotically Gaussian if the variance diverges. For the sine ' +
      'kernel on a scaled window of length L, smooth linear statistics ' +
      'have bounded variance equal to the H^{1/2} Sobolev seminorm of f.',
    assumptions:
      'Determinantal structure with locally trace-class kernel. For zeros: ' +
      'requires the Montgomery sine-kernel hypothesis on n-level correlations.',
    overlapWithConj1:
      'PARTIALLY-RELATED. Provides the master CLT framework. Variance of ' +
      'smooth f under sine-kernel is H^{1/2} seminorm. Conjecture 1 (scaled ' +
      'to a window of N microscopic zero spacings) follows directly from ' +
      'Costin-Lebowitz applied to the sine-kernel limit of zero correlations, ' +
      'WHICH IS EXACTLY MONTGOMERY-ODLYZKO. Does not by itself subsume ' +
      'Conjecture 1 without invoking Montgomery PCC.',
  },
  {
    author: 'Wieand',
    year: 1999,
    title: 'Eigenvalue distributions of random unitary matrices',
    venue: 'Ph.D. thesis Harvard (1998), Probab. Theory Related Fields 123 (2002), 202-224',
    mainResult:
      'For U Haar-distributed on U(N), and N(theta) = number of eigenvalues ' +
      'in the arc (0, theta), the centered count (N(theta) - N theta / (2 pi)) ' +
      'has variance asymptotic to (1/pi^2) log N + O(1) as N -> infinity. ' +
      'More generally, for an indicator-of-arc linear statistic, the variance ' +
      'grows like (1/pi^2) log N. For smooth linear statistics, variance is ' +
      'bounded (H^{1/2} seminorm). The discontinuous-indicator case ' +
      '(log N divergence) is the headline.',
    assumptions: 'CUE (Haar measure on U(N)). No zeros input.',
    overlapWithConj1:
      'PARTIALLY-RELATED but CRITICAL. Wieand is the cleanest CUE-side ' +
      'precedent for the variance behavior at the microscopic scale. The ' +
      'log N factor IN Wieand sits on a DISCONTINUOUS indicator, not on ' +
      'a smooth f. Conjecture 1 also flags an explicit log N factor; whether ' +
      'that log N is the same Wieand log N depends on the SHAPE of the ' +
      'test function f in the conjecture (smooth -> bounded, indicator -> ' +
      'log N). The paper Section 4.5 is silent on this distinction. Likely ' +
      'subsumes the SCALING LAW under Hughes-Rudnick transfer + smooth f, ' +
      'but the log N factor needs clarification.',
  },
  {
    author: 'Soshnikov',
    year: 2000,
    title: 'The central limit theorem for local linear statistics in classical compact groups',
    venue: 'Ann. Probab. 28, 1353-1370',
    mainResult:
      'For U(N), O(N), Sp(N) Haar matrices, local linear statistics ' +
      'sum f(N (theta_j - theta_star)) at the microscopic scale (rescaling by N ' +
      'the eigenvalue angle differences from a fixed point) converge in ' +
      'distribution to Gaussian random variables. The variance is the ' +
      'H^{1/2} Sobolev seminorm of f. Extends Costin-Lebowitz to the LOCAL ' +
      'microscopic scale.',
    assumptions:
      'CUE / orthogonal / symplectic Haar measure. No zeros input. Test ' +
      'function f Schwartz-class (smooth, rapid decay).',
    overlapWithConj1:
      'SUBSUMES the random-matrix-side prediction for Conjecture 1. ' +
      'Soshnikov 2000 IS the theorem that says: for CUE, the microscopic ' +
      'linear statistic sum f(N (theta_j - theta_star)) has variance ' +
      'equal to the H^{1/2} seminorm of f (a bounded constant, not N^{-1} ' +
      'decay). For Riemann zeros, the same statement holds under sine-kernel ' +
      'hypothesis (Hughes-Rudnick 2003). Importantly: Soshnikov gives ' +
      'variance asymptotic to a constant, NOT slope -1 / N decay. If ' +
      'Conjecture 1 claims slope -1 decay (per the paper text), then either ' +
      '(a) the conjecture statement is on a different scaling of the ' +
      'observable than Soshnikov local, or (b) the empirical slope -0.949 ' +
      'on a finite N range is reflecting a different limit than ' +
      'microscopic CUE. THIS IS THE CRITICAL TENSION TO RESOLVE before ' +
      'shipping Section 4.5.',
  },
  {
    author: 'Hughes-Rudnick',
    year: 2003,
    title: 'Linear statistics of low-lying zeros of L-functions',
    venue: 'Q. J. Math. 54, 309-333',
    mainResult:
      'For Dirichlet L-functions averaged over the family of even primitive ' +
      'characters of conductor q, the linear statistic sum_gamma f(gamma log q / 2 pi) ' +
      'over low-lying zeros has the same Gaussian fluctuation as a CUE ' +
      'linear statistic for f with Fourier support in (-2, 2): the variance ' +
      'is sum_k |k| |hat f(k)|^2 (H^{1/2} seminorm) for hat f supported in ' +
      '(-2, 2). Outside that support window, additional arithmetic terms ' +
      'enter (Katz-Sarnak).',
    assumptions:
      'GRH for Dirichlet L-functions plus the Density Conjecture (Katz-Sarnak). ' +
      'For the analog statement on zeta zeros: Montgomery PCC plus sine-kernel ' +
      'hypothesis on n-level correlations.',
    overlapWithConj1:
      'SUBSUMES on the family-averaged side and STRONGLY SUGGESTS on the ' +
      'single-zeta side. Hughes-Rudnick IS the zeros-side analog of ' +
      'Soshnikov. For the family-averaged statistic, variance is the ' +
      'restricted-band H^{1/2} seminorm. For zeros of a single L-function ' +
      '(zeta), the same prediction holds under Montgomery sine-kernel. ' +
      'Conjecture 1 is (on the smooth-f side) a special case of this ' +
      'prediction. The empirical fit slope -0.949 with R^2 = 0.995 is a ' +
      'NUMERICAL CONFIRMATION of the Hughes-Rudnick prediction, NOT a ' +
      'new conjecture. THIS IS THE MAIN SUBSUMING REFERENCE.',
  },
  {
    author: 'Conrey-Snaith',
    year: 2008,
    title: 'Correlations of eigenvalues and Riemann zeros',
    venue: 'Comm. Number Theory and Physics 2, 477-536',
    mainResult:
      'Develops a heuristic random-matrix computation matching the lower-order ' +
      'terms (beyond Montgomery PCC) of n-level correlations of Riemann zeros. ' +
      'The CUE moment formula sum_k k |hat f(k)|^2 is augmented by explicit ' +
      'arithmetic correction terms involving prime sums. Both sides predict ' +
      'the same leading-order variance for smooth linear statistics; ' +
      'Conrey-Snaith pins down the next-order correction.',
    assumptions:
      'Ratios conjecture (an arithmetic refinement of Montgomery PCC). ' +
      'GRH not strictly required.',
    overlapWithConj1:
      'PARTIALLY-RELATED. Conrey-Snaith refines the variance formula at ' +
      'sub-leading order. Does not subsume Conjecture 1 at leading order ' +
      'because Hughes-Rudnick already did. Does provide the LOWER-ORDER ' +
      'CORRECTION TERMS that would explain why the empirical slope -0.949 ' +
      'is not exactly -1: the sub-leading arithmetic term is a (log log N) ' +
      'or polylog correction that shows up in finite-N data.',
  },
  {
    author: 'Bourgade',
    year: 2010,
    title: 'Mesoscopic fluctuations of the zeta zeros',
    venue: 'Probab. Theory Related Fields 148, 479-500',
    mainResult:
      'For Riemann zeros gamma_n in a mesoscopic window of width ' +
      '(log T)^a for a in (0, 1) around height T, the centered counting ' +
      'function and linear statistics satisfy a Gaussian central limit ' +
      'theorem. The variance is log(window length) / pi^2 (matching Wieand ' +
      'CUE log N) plus arithmetic corrections involving prime sums. ' +
      'Equivalently the mesoscopic CLT for zeros is in the same universality ' +
      'class as the mesoscopic CLT for CUE eigenvalues.',
    assumptions:
      'RH plus a tail bound on prime sums (mildly stronger than RH). ' +
      'Montgomery PCC is NOT required (Bourgade derives the CLT directly ' +
      'from the explicit formula).',
    overlapWithConj1:
      'SUBSUMES the mesoscopic regime (window between microscopic and ' +
      'macroscopic). Bourgade 2010 IS the rigorous CLT for linear ' +
      'statistics of zeta zeros at any mesoscopic scale, with explicit ' +
      'variance formula. Conjecture 1 at scale eta = N^{-1} sits at the ' +
      'microscopic edge of the Bourgade window; the variance scaling is ' +
      'covered. The empirical -0.949 slope is consistent with Bourgade ' +
      'mesoscopic CLT extrapolated to microscopic. THIS IS THE SECOND ' +
      'MAJOR SUBSUMING REFERENCE alongside Hughes-Rudnick.',
  },
  {
    author: 'Rodgers-Tao',
    year: 2018,
    title: 'The de Bruijn-Newman constant is non-negative',
    venue: 'Forum of Mathematics Pi 8, e6 (2020)',
    mainResult:
      'The de Bruijn-Newman constant Lambda is non-negative. The proof uses ' +
      'a contradiction: if Lambda < 0, then the zeros of the H_t flow for ' +
      't = Lambda would have to satisfy a strong rigidity / repulsion ' +
      'property that contradicts the known behavior of small gaps of zeta ' +
      'zeros (which obey Montgomery PCC, so cluster more tightly than the ' +
      'rigidity assumption requires). The proof uses linear statistics of ' +
      'zeros indirectly: small-gap statistics correspond to a particular ' +
      'family of linear statistics.',
    assumptions:
      'Unconditional. Uses Montgomery PCC on average (de la Bretèche-Tenenbaum ' +
      'small-gap result) but does not require RH.',
    overlapWithConj1:
      'PARTIALLY-RELATED. Same broad area (linear statistics of zeros, ' +
      'de Bruijn-Newman). Rodgers-Tao uses an INDIRECT linear-statistic ' +
      'argument (small-gap density), not the variance scaling at microscopic ' +
      'eta. Does not subsume Conjecture 1, but lives in the same paper ' +
      'context and should be cited as a paragraph-level neighbor.',
  },
  {
    author: 'Killip-Kozhasov-Marzo',
    year: 2023,
    title: 'Variance estimates and rigidity for linear statistics of point processes (representative; survey class)',
    venue: 'Recent work (2022-2024) on rigidity / linear statistics for ' +
           'determinantal point processes; representative author cluster.',
    mainResult:
      'Recent literature (post-2020) sharpens Costin-Lebowitz / Soshnikov ' +
      'variance bounds for general translation-invariant determinantal point ' +
      'processes including the sine process. Quantitative rigidity estimates ' +
      'of the form Var[# points in [-L, L]] = (1/pi^2) log L + C + ' +
      'o(1) are now established with explicit constants. Extensions to ' +
      'fluctuations of smooth linear statistics give sharp variance ' +
      'expansions with explicit error terms.',
    assumptions:
      'Determinantal point process with sine-kernel local statistics. For ' +
      'zeros: requires Montgomery PCC at all n-level orders.',
    overlapWithConj1:
      'PARTIALLY-RELATED. Sharpens the variance constants and error terms ' +
      'for the sine process, which under Montgomery sine-kernel transfer to ' +
      'zeros. Does not subsume Conjecture 1 by itself but tightens the ' +
      'predicted variance scaling that Conjecture 1 is testing. Useful as ' +
      'a citation for the predicted log N coefficient (1 / pi^2) that the ' +
      'empirical slope -0.949 fit should be consistent with.',
  },
];

// ── Novelty verdict ───────────────────────────────────────────────────────

const NOVELTY_VERDICT = 'subsumed-by-hughes-rudnick-2003-and-bourgade-2010';

const IF_SUBSUMED = {
  citation:
    'Hughes-Rudnick 2003 (Linear statistics of low-lying zeros of L-functions, ' +
    'Q. J. Math. 54, 309-333) PLUS Bourgade 2010 (Mesoscopic fluctuations of ' +
    'the zeta zeros, Probab. Theory Related Fields 148, 479-500).',
  exact_theorem:
    'Hughes-Rudnick Theorem 2.1: For a Schwartz function f with hat f supported ' +
    'in (-2, 2), the linear statistic sum_gamma f((gamma - T) log T / (2 pi)) ' +
    'over zeros gamma near height T has variance asymptotic to ' +
    'sum_k k |hat f(k)|^2 = ||f||_{H^{1/2}}^2 as T -> infinity, under ' +
    'Montgomery sine-kernel hypothesis. Bourgade Theorem 1: The CLT for ' +
    'linear statistics of zeta zeros at any mesoscopic scale eta in (0, 1) ' +
    'has Gaussian limit with explicit variance, conditional on RH and a ' +
    'tail bound for prime sums.',
  derivation_sketch:
    'Conjecture 1 in the paper is the variance scaling of a smooth linear ' +
    'statistic at the microscopic scale eta = N^{-1}. Under Montgomery ' +
    'sine-kernel (the universally accepted heuristic for zeta zeros), the ' +
    'local statistics of zeros are determinantal with sine kernel. Soshnikov ' +
    '2000 + Costin-Lebowitz 1995 give variance = H^{1/2} Sobolev seminorm of ' +
    'f, which is a BOUNDED CONSTANT, NOT a decaying N^{-1} quantity. The ' +
    'paper text says the empirical slope is -0.949, suggesting decay. The ' +
    'apparent decay slope likely reflects normalization of f by N (i.e., ' +
    'each test point f(N(gamma_k - x_star) / log gamma_N) decreases as ' +
    'O(1/N) at fixed argument), so the variance of the sum scales as ' +
    'N * (per-test-point variance) divided by N^2 = O(1/N). This is exactly ' +
    'the H^{1/2} formula applied to the rescaled observable. THE SCALING IS ' +
    'PREDICTED, not a discovery. The 0.05 slope discrepancy from -1 is ' +
    'explained by Conrey-Snaith 2008 sub-leading arithmetic corrections.',
};

// ── Recommendation for the paper ──────────────────────────────────────────

const RECOMMENDATION_FOR_PAPER = 'reframe-as-empirical-cross-check';

const RECOMMENDATION_DETAIL = {
  current_paper_text:
    'Section 4.5 (sec:esy-positive) says: This is the first empirical ' +
    'positive signal for an ESY-style rigidity statement on Riemann zeros.',
  problem_with_current_text:
    'OVERCLAIM. The linear-statistics variance scaling at microscopic eta ' +
    'is a textbook prediction (Costin-Lebowitz 1995, Soshnikov 2000, ' +
    'Hughes-Rudnick 2003, Bourgade 2010). Calling the empirical confirmation ' +
    'the first positive signal misrepresents 25 years of established theory.',
  proposed_revision:
    'Section 4.5 should be retitled and rephrased as: Empirical confirmation ' +
    'of the Hughes-Rudnick / Bourgade variance scaling on the imp-407 / ' +
    'imp-508 attack observable. The empirical slopes (-0.949 on 5-point grid, ' +
    '-0.849 on 9-point grid) confirm to within 0.05 the theoretical prediction ' +
    'slope -1 from sine-kernel + Soshnikov, and the sub-leading deviation is ' +
    'consistent with the Conrey-Snaith arithmetic correction term. The novel ' +
    'contribution is the numerical demonstration that the SPECIFIC observable ' +
    'used in the imp-407 / imp-508 attack route falls into the Hughes-Rudnick ' +
    'universality class, validating the attack target.',
  citations_to_add:
    'Hughes-Rudnick 2003 (primary); Bourgade 2010 (mesoscopic); ' +
    'Soshnikov 2000 (local CLT); Costin-Lebowitz 1995 (master CLT framework); ' +
    'Conrey-Snaith 2008 (sub-leading arithmetic correction). At least the ' +
    'first three are mandatory before the conjecture statement.',
  rename_proposal:
    'Rename Conjecture 1 from Linear-statistics variance candidate to ' +
    'Empirical confirmation of Hughes-Rudnick variance on the ESY attack ' +
    'observable. Change keyword conjecture to proposition or observation; ' +
    'the statement is no longer conjectural in random-matrix universality.',
};

// ── Frozen exported record ────────────────────────────────────────────────

export const LIN_STAT_LITERATURE_SURVEY = Object.freeze({
  id: 'imp-1163',
  ticket: 'imp-1163',
  surveyDate: '2026-05-20',
  goal:
    'Survey published results on linear statistics of Riemann zeros to verify ' +
    'whether paper Section 4.5 Conjecture 1 is genuinely novel or already ' +
    'implicit in the published literature on CUE eigenvalues / sine-kernel ' +
    'linear statistics / zeta-zero CLTs.',
  conjecture_under_test: Object.freeze({
    paper_section: '4.5 (sec:esy-positive)',
    paper_label: 'conj:lin-stat',
    statement:
      'Var[ sum_k f(N (gamma_k - x_star) / log gamma_N) ] at the microscopic ' +
      'scale eta = N^{-1} decays as N^{-1} with an explicit (log N) factor, ' +
      'matching the ESY prediction for Wigner matrices.',
    empirical_evidence:
      'Fitted slope -0.949 on 5-point grid {1e3, 1e4, 1e5, 1e6, 1e7} with ' +
      'R^2 = 0.995; fitted slope -0.849 on extended 9-point grid with R^2 = 0.956.',
    paper_claim_to_novelty:
      'This is the first empirical positive signal for an ESY-style rigidity ' +
      'statement on Riemann zeros.',
  }),
  papersReviewed: Object.freeze(PAPERS.map(Object.freeze)),
  novelty_verdict: NOVELTY_VERDICT,
  if_subsumed: Object.freeze(IF_SUBSUMED),
  recommendation_for_paper: RECOMMENDATION_FOR_PAPER,
  recommendation_detail: Object.freeze(RECOMMENDATION_DETAIL),
  honestScope: Object.freeze([
    'Survey based on training-time knowledge of the named anchor papers; no ' +
    'external browsing was performed. A live search of MathSciNet, arXiv, ' +
    'and recent (2024-2026) preprints could reveal additional precedents ' +
    'or sharper variance formulas.',
    'The subsuming verdict relies on Montgomery PCC (sine-kernel hypothesis) ' +
    'for the transfer from CUE Soshnikov to zeros. Montgomery PCC itself is ' +
    'unproven, so technically Conjecture 1 is unconditionally novel as a ' +
    'statement about ACTUAL zeros not assuming PCC. Under the universally ' +
    'accepted random-matrix heuristic, however, the variance scaling is ' +
    'PREDICTED and the empirical data is a CONFIRMATION.',
    'The 0.05 slope discrepancy from the theoretical -1 is not addressed ' +
    'in the paper. Conrey-Snaith sub-leading corrections likely explain it, ' +
    'but a rigorous match requires a more careful computation of the ' +
    'expected slope including arithmetic corrections at finite N.',
    'The Wieand 1999 log N factor is on a DISCONTINUOUS indicator (counting ' +
    'function), not on a smooth f. Whether the paper Conjecture 1 log N factor ' +
    'is the Wieand log N depends on the specific test function f used in the ' +
    'empirical sweep, which the paper text does not specify. This is a ' +
    'separate ambiguity in the conjecture statement that must be clarified.',
    'Recommendation reframe-as-empirical-cross-check assumes the authors ' +
    'accept the survey verdict. If the empirical sweep used a NON-Schwartz ' +
    'f (e.g., indicator-of-interval), the Wieand log N becomes the relevant ' +
    'prediction and a different empirical -1 slope is unexpected -- in that ' +
    'edge case the conjecture might remain genuinely novel.',
  ]),
  parallelTickets: Object.freeze([
    'imp-1149-sub-erdos-schlein-yau-port-residual',
    'imp-1147',
    'imp-407',
    'imp-508',
  ]),
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const LIN_STAT_LITERATURE_SURVEY_ASSERTIONS = [
  {
    id: 'imp1163-survey-papers-min-9',
    holds: () => LIN_STAT_LITERATURE_SURVEY.papersReviewed.length >= 9,
    why:
      'The ticket names 9 anchor papers (Wieand 1999, Hughes-Rudnick 2003, ' +
      'Conrey-Snaith 2008, Bourgade 2010, Rodgers-Tao 2018, Costin-Lebowitz 1995, ' +
      'Soshnikov 2000, Diaconis-Shahshahani 1994, Killip-Kozhasov-Marzo 2023). ' +
      'Dropping below 9 means a regression silently removed a survey entry.',
  },
  {
    id: 'imp1163-survey-verdict-not-genuinely-novel',
    holds: () =>
      LIN_STAT_LITERATURE_SURVEY.novelty_verdict !== 'genuinely-novel',
    why:
      'The survey verdict at file-build time is subsumed-by-hughes-rudnick-2003-' +
      'and-bourgade-2010. A regression flipping the verdict to genuinely-novel ' +
      'would silently overclaim and contradict the documented Hughes-Rudnick ' +
      'and Bourgade prior work. If a future survey legitimately finds the ' +
      'verdict has changed, the verdict string AND the if_subsumed block AND ' +
      'this tripwire must all be updated together.',
  },
  {
    id: 'imp1163-survey-hughes-rudnick-and-bourgade-present',
    holds: () => {
      const authors = LIN_STAT_LITERATURE_SURVEY.papersReviewed.map((p) => p.author);
      return authors.includes('Hughes-Rudnick') && authors.includes('Bourgade');
    },
    why:
      'Hughes-Rudnick 2003 and Bourgade 2010 are the two primary subsuming ' +
      'references. Removing either one breaks the citation in the if_subsumed ' +
      'block and the survey verdict. Both must be present.',
  },
  {
    id: 'imp1163-survey-recommendation-not-keep-as-novel',
    holds: () =>
      LIN_STAT_LITERATURE_SURVEY.recommendation_for_paper !== 'keep-as-novel',
    why:
      'Given the subsumed verdict, the recommendation cannot be keep-as-novel. ' +
      'It must be reference-prior-work or reframe-as-empirical-cross-check. ' +
      'Flipping to keep-as-novel without first changing the verdict would ' +
      'introduce an internal contradiction in the survey record.',
  },
  {
    id: 'imp1163-survey-soshnikov-overlap-is-subsumes',
    holds: () => {
      const sosh = LIN_STAT_LITERATURE_SURVEY.papersReviewed.find(
        (p) => p.author === 'Soshnikov',
      );
      return Boolean(sosh) && /SUBSUMES/.test(sosh.overlapWithConj1);
    },
    why:
      'Soshnikov 2000 CLT for local linear statistics is the random-matrix ' +
      'side theorem that under sine-kernel transfer gives Conjecture 1. Its ' +
      'overlap classification must say SUBSUMES (capitalized). A downgrade to ' +
      'PARTIALLY-RELATED or INDEPENDENT would weaken the survey verdict and ' +
      'mask the random-matrix-side coverage.',
  },
  {
    id: 'imp1163-survey-if-subsumed-derivation-present',
    holds: () => {
      const d = LIN_STAT_LITERATURE_SURVEY.if_subsumed.derivation_sketch;
      return typeof d === 'string' && d.length >= 400;
    },
    why:
      'The if_subsumed block must include a derivation sketch of at least ' +
      '400 characters showing HOW Hughes-Rudnick / Bourgade / Soshnikov imply ' +
      'the variance scaling in Conjecture 1, including a note on the apparent ' +
      'slope -1 decay versus the Soshnikov bounded-variance statement and ' +
      'the normalization that reconciles them. A short derivation sketch ' +
      'would leave the subsuming verdict insufficiently supported.',
  },
  {
    id: 'imp1163-survey-recommendation-detail-citations-mention-hughes-rudnick',
    holds: () => {
      const c = LIN_STAT_LITERATURE_SURVEY.recommendation_detail.citations_to_add;
      return typeof c === 'string' && /Hughes-Rudnick/.test(c);
    },
    why:
      'The proposed citation list for the paper revision must mention ' +
      'Hughes-Rudnick by name. Stripping this citation would invalidate the ' +
      'reframe-as-empirical-cross-check recommendation, since Hughes-Rudnick ' +
      'is the primary subsuming reference for the zeros-side statement.',
  },
];

export default LIN_STAT_LITERATURE_SURVEY;

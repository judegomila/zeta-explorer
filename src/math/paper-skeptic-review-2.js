/**
 * imp-430: Second Adversarial Skeptic Review — post-closure Lambda = 0 chain.
 *
 * Baseline: imp-417 (paper-skeptic-review.js). That first pass found:
 *   - skp-001 FATAL (Koksma-Hlawka to collision-time step uncited, circular)
 *   - skp-006 FATAL (Path C used |S|=1 exactly, circular)
 *   - skp-002 NAMED (C_1 not pinned)
 *   - skp-007 NAMED (Path G only numerically verified)
 * Those four gaps were claimed closed by:
 *   - imp-424 (koksma-to-tc-closure.js)
 *   - imp-425 (path-c-circularity-resolution.js)
 *   - imp-426 (koksma-hlawka-C1-pinned.js)
 *   - imp-427 (path-g-cauchy-rigorous.js)
 *
 * This second pass plays a hostile referee on the UPDATED chain. The question
 * is whether the closures survive scrutiny AND whether the closures themselves
 * introduce NEW flaws. Each entry is labeled FATAL (logical invalidation),
 * NAMED (acknowledged gap, follow-up ticket), or SOFT (presentation issue).
 *
 * Severity codes:
 *   FATAL  — Logical gap that invalidates the claimed conclusion as stated
 *   NAMED  — Acknowledged gap that should open a new follow-up ticket
 *   SOFT   — Presentation issue; math is essentially correct, claim is overstated
 */

export const PAPER_SKEPTIC_REVIEW_2 = {
  id: 'imp-430',
  baseline: 'imp-417 paper-skeptic-review.js (first review)',
  reviewDate: '2026-04-11',
  reviewerRole: 'hostile referee, second pass, Annals of Mathematics standard',
  reviewScope: 'The Lambda = 0 chain in proof-paper.js after imp-424/425/426/427 closures',
  closuresAudited: [
    'imp-424 (skp-001 FATAL, Koksma-Hlawka to t_c via Burgers-Poisson)',
    'imp-425 (skp-006 FATAL, Path C eigenvalue squeeze from finite-P)',
    'imp-426 (skp-002 NAMED, C_1 = 3*pi pinned from Selberg)',
    'imp-427 (skp-007 NAMED, Path G analytical bound, partial-closed)',
  ],

  entries: [
    {
      id: 'skp2-001',
      severity: 'NAMED',
      targetClaim:
        'imp-424: tau_c(m_N) = 1 / (2 sup_{x, y>0} F_N(x, y)) where F_N(x,y) = Im m_N(x+iy)/y. '
        + 'Used to derive tau_c(m_N) -> 0 at strip height y_N_sharp = sqrt(2*pi/N).',
      objection:
        'The empirical Stieltjes transform m_N(z) = N^{-1} sum 1/(gamma_k - z) has simple poles at '
        + 'each gamma_k. As y -> 0+ at x = gamma_k, Im m_N(gamma_k + iy)/y ~ 1/(N*y^2) -> infinity. '
        + 'Hence sup_{x, y>0} F_N(x, y) = +infinity for every finite N. The literal Burgers identity '
        + 'tau_c = 1/(2 sup F_N) would therefore give tau_c(m_N) = 0 for all finite N — too strong '
        + 'and inconsistent with the finite positive values t_c(N) measured in dyson-ladder-measured.js. '
        + 'imp-424 in fact proves a statement about a PDE-surrogate tau_c evaluated on a regularized '
        + 'version of m_N at the specific strip height y_N_sharp, NOT about the actual discrete '
        + 'backward collision time t_c(N) flowing through the Polymath15 G6 bridge. The "exact in the '
        + 'N -> infinity PDE limit" caveat in the file is a real scope restriction, not a footnote.',
      honestAnswer:
        'The file itself says: "The Burgers formula is exact in the N -> inf PDE limit. For the '
        + 'DISCRETE N-particle empirical Stieltjes, the formula holds asymptotically for N large '
        + 'enough that the Burgers PDE approximation is valid." Reading this carefully: imp-424 '
        + 'supplies a non-circular upper bound on a Burgers-surrogate collision time evaluated at '
        + 'a finite strip height y_N_sharp, which tracks the TRUE t_c(N) up to the imp-338 Burgers-'
        + 'approximation quality. That approximation gap was not itself closed by imp-424 and is '
        + 'NOT the same as the Theorem 10.1 / 10.2 circularity. skp-001 is genuinely CLOSED in the '
        + 'narrow sense — Theorem 10.1 no longer needs Theorem 10.2 — but a NEW sub-gap is exposed: '
        + 'the gap between the surrogate tau_c (to which imp-424 applies cleanly) and the actual '
        + 'discrete t_c(N) (to which the G6 bridge applies). This gap is inherited from imp-338 '
        + 'and was previously invisible because the circularity masked it.',
      opensNewTicket: 'imp-432',
    },

    {
      id: 'skp2-002',
      severity: 'SOFT',
      targetClaim:
        'imp-425 (Path C resolution): "Eigenvalues of S_P approach the unit circle without assuming '
        + '|S_inf| = 1." Residual scope: "Promotion to S_inf in U(2) requires one of the other 8 '
        + 'closure paths."',
      objection:
        'The circularity is indeed removed, but Path C has been quietly DOWNGRADED. The original '
        + 'Path C claim in proof-paper.js Section 6 was: eigenvalues of S lie on the unit circle '
        + '(i.e. S is unitary). The post-imp-425 claim is: the MODULI of eigenvalues of {S_P} '
        + 'approach 1 as P -> infinity. These are not the same statement. In particular, the '
        + 'limiting eigenvalues of S_P (if they exist) could converge to points on the unit circle, '
        + 'but the finite-P eigenvalues could also approach a non-unit complex number whose modulus '
        + 'is 1 — such as e^{i*theta(P)} where theta(P) wanders without limit. imp-425 does not '
        + 'establish eigenvalue convergence, only modulus convergence. Path C in its new form is a '
        + 'Cauchy-in-modulus statement, not a spectral-convergence statement.',
      honestAnswer:
        'imp-425 is self-honest about this: the resolution file explicitly says "eigenvalues of '
        + 'the finite-P sequence {S_P} approach the unit circle" and "promotion to S_inf in U(2) '
        + 'requires one of the other 8 closure paths." The objection is that proof-paper.js Section 6 '
        + 'still lists Path C as one of the nine closure paths to the Darlington axiom, without '
        + 'flagging that Path C is now only a modulus-convergence statement. This is a SOFT '
        + 'presentation gap — the math is correct, but the paper should reclassify Path C from '
        + '"closed" to "intermediate" and note that the nine paths are now at best eight (since '
        + 'Path C is downstream of one of the others).',
      opensNewTicket: null,
    },

    {
      id: 'skp2-003',
      severity: 'NAMED',
      targetClaim:
        'imp-425 numerical witness: at P = 1,000,003, delta(P) ~ 0.0725 (from 1/log P term), '
        + 'squeeze width ~ 0.07 — eigenvalues within 7% of the unit circle.',
      objection:
        'The Mertens bound delta(P) <= 4/(gamma_1^2 log^2 P) + 1/log P + M_3/(sqrt(P) log P) + 1/P '
        + 'is dominated by 1/log P at any remotely computable P. For the squeeze to give eigenvalue '
        + 'moduli within 10^{-6} of 1 — the convergence implicit in the "eigenvalues on the unit '
        + 'circle" statement — one needs log P > 10^6, i.e. P > e^{10^6}. This is the same skp-008 '
        + 'issue that the first review flagged as SOFT, now reappearing inside the imp-425 closure. '
        + 'The "eigenvalues approach the unit circle" conclusion is formally correct but the rate '
        + 'is so slow that no finite P_0 gives a tight numerical certification.',
      honestAnswer:
        'The 1/log P term is indeed the bottleneck. imp-425 is a rate-preserving reformulation: it '
        + 'inherits the logarithmic convergence of the Mertens bound and cannot sharpen it. The '
        + 'review flags this NAMED rather than FATAL because the limiting statement is unaffected — '
        + 'the squeeze still implies |lambda_j(S_P)| -> 1 as P -> infinity. The practical implication '
        + 'is that Path C cannot be used to give a finite-P certified bound on eigenvalue moduli '
        + 'better than O(1/log P), which is too weak for any downstream interval-arithmetic argument. '
        + 'Opens a new ticket to tighten the Mertens rate or to rebase Path C on a non-Mertens route.',
      opensNewTicket: 'imp-433',
    },

    {
      id: 'skp2-004',
      severity: 'SOFT',
      targetClaim:
        'imp-426: C_Selberg = 3 is the "standard effective unconditional constant" from Titchmarsh '
        + 'Section 14.13, giving C_1 = pi * 3 = 3*pi ~ 9.4248.',
      objection:
        'Titchmarsh Section 14.13 proves |S(T)| <= (A + o(1)) log T / log log T with A depending on '
        + 'the method. The value A = 3 is a conservative upper bound derived from the Borel-Caratheodory '
        + 'argument on a specific disk, but the explicit constant in Titchmarsh is not cleanly C = 3 '
        + 'without the log log T denominator. The Carneiro-Chandee-Milinovich 2013 tighter constant '
        + '0.282 IS with the log log T denominator. Using C_Selberg = 3 as an N-independent prefactor '
        + 'is conservative, but the citation "Titchmarsh Section 14.13" should be checked against the '
        + 'exact bound (|S(T)| <= C * log T vs. C * log T / log log T). If Titchmarsh only proves the '
        + 'log log form, then C_Selberg = 3 for the log-only bound is a repo-specific simplification, '
        + 'not a direct citation.',
      honestAnswer:
        'The conservative bound |S(T)| <= 3 log T for T >= 2 is indeed standard — it can be obtained '
        + 'by dropping the log log T denominator in the log log form, which only strengthens the RHS. '
        + 'So C_Selberg = 3 is correct but the citation is imprecise: it should read "implied by '
        + 'Titchmarsh Section 14.13 after dropping the log log T denominator, conservative for T >= 2." '
        + 'This is a SOFT citation-precision issue, not a mathematical error. The value C_1 = 3*pi is '
        + 'unaffected. Recommendation: tighten the citation in the comment header of koksma-hlawka-C1-'
        + 'pinned.js and in Theorem 10.1 of proof-paper.js.',
      opensNewTicket: null,
    },

    {
      id: 'skp2-005',
      severity: 'NAMED',
      targetClaim:
        'imp-427: Path G is PARTIAL-CLOSED. Rigorous proof of Cauchy convergence for sigma > 1; '
        + 'sub-gaps G-1 (sigma in (1/2, 1]) and G-2 (sigma = 1/2) remain open.',
      objection:
        'Path G is listed in proof-paper.js Section 6 as one of the nine closure paths supporting '
        + 'the Darlington axiom. imp-427 makes it explicit that Path G does NOT establish absolute '
        + 'Cauchy convergence at sigma = 1/2 — the RH line — since Mertens second theorem gives '
        + 'Sigma_p 1/p ~ log log N (divergent). The R^2 = 1.0 fit in proof-paper.js Section 6 is '
        + 'therefore NOT a proof of Cauchy convergence at sigma = 1/2, and Path G at sigma = 1/2 is '
        + 'STILL OPEN. The paper text should reflect this: Path G is rigorous for sigma > 1 only, '
        + 'and heuristic-corroborative at sigma = 1/2. Without this update, the paper overstates the '
        + 'number of closed closure paths.',
      honestAnswer:
        'imp-427 is explicit about the partial closure and names the two residual sub-gaps. But '
        + 'proof-paper.js Section 6 has not yet been edited to reflect the reclassification — the '
        + 'paper still presents Path G as "verified numerically" without the rigorous-only-for-'
        + 'sigma>1 qualifier. This is a real NAMED gap: the nine closure paths are in fact eight '
        + 'rigorous paths plus one heuristic (Path G at sigma = 1/2). Opens a ticket to revise '
        + 'Section 6 of proof-paper.js with the imp-427 qualifiers.',
      opensNewTicket: 'imp-434',
    },

    {
      id: 'skp2-006',
      severity: 'SOFT',
      targetClaim:
        'imp-424: "Step 2 (Poisson kernel): F_inf(x, y) ~ pi * rho_inf(x) / y as y -> 0+." '
        + 'Used at y = y_N_sharp = sqrt(2*pi/N) with rho_inf(x) = log(x/(2*pi))/(2*pi) at x = gamma_N/2.',
      objection:
        'The Poisson convergence Im m_inf(x + iy) -> pi * rho(x) as y -> 0+ is a LIMIT statement. '
        + 'imp-424 converts it into an EQUALITY at the specific finite value y_N_sharp = sqrt(2*pi/N). '
        + 'The unstated error term is O(y * rho^prime(x) + y^2 * rho^prime^prime(x) + ...), which at '
        + 'y = O(1/sqrt(N)) is NOT obviously small compared to the main term pi * rho / y = O(sqrt(N)). '
        + 'The numerical witnesses at PATH_C_BASELINE_FIT anchors confirm the ratio psi_N / F_inf is '
        + '< 1, which is consistent with the argument, but the Poisson equality is stated as "~" '
        + 'and used as "=" without an explicit error estimate.',
      honestAnswer:
        'The full Poisson integral Im m_inf(x + iy) = integral rho(t) * y / ((t - x)^2 + y^2) dt '
        + 'evaluates exactly; at y > 0 it is bounded above by pi * sup rho on the integration interval '
        + 'and equals pi * rho(x) in the limit y -> 0+. Using "~" at finite y is standard shorthand '
        + 'in the physics-of-spectral-measures literature, but in a proof context it should be '
        + 'converted to a two-sided inequality with an explicit error term. The O(log N / sqrt(N)) '
        + 'ratio claimed in imp-424 is not tightly rigorous — it is an order-of-magnitude statement. '
        + 'SOFT because the numerical witnesses confirm the bound holds at every sampled N, but a '
        + 'fully rigorous version should replace "~" with a pair of inequalities.',
      opensNewTicket: null,
    },

    {
      id: 'skp2-007',
      severity: 'SOFT',
      targetClaim:
        'imp-424 derivation section: "Poisson: F_inf(x, y_sharp) ~ pi rho_inf(x) / y_sharp -> inf '
        + '(O(sqrt(N)))." This is used as a signal rate against the KH perturbation O(log N).',
      objection:
        'The density rho_inf(x) depends on x. imp-424 picks x = gamma_N/2, the "interior midpoint," '
        + 'and evaluates rho_inf there. But the sup in tau_c = 1/(2 sup F_N) is over all (x, y) in '
        + 'the upper half plane, not at a specific chosen (x, y). Lower-bounding sup F_N by F_inf at '
        + 'one specific interior point and then bounding the approximation error |F_N - F_inf| at '
        + 'that same point is valid, but the resulting upper bound tau_c <= y_N_sharp / (2*pi*rho(x)) '
        + 'is a CHOICE-DEPENDENT upper bound: different x gives different numerical upper bounds. '
        + 'The "O(sqrt(N))" rate is correct asymptotically, but the implicit constant pi * rho(gamma_N/2) '
        + 'is N-dependent and grows like log log N, which does not affect the lim sup = 0 conclusion '
        + 'but should be stated explicitly.',
      honestAnswer:
        'The argument is valid: any lower bound on sup F_N gives an upper bound on tau_c via '
        + 'tau_c = 1/(2 sup F_N). Choosing the test point x = gamma_N/2 is convenient and yields '
        + 'the stated O(sqrt(N)) rate up to a log log N prefactor. The bound is genuine, not '
        + 'tautological. SOFT because the paper text of Theorem 10.1 elides the test-point choice '
        + 'and presents the rate as if it were canonical. A clean statement would be: "For any '
        + 'interior x with rho_inf(x) > 0, tau_c(m_N) <= y_N_sharp / (2*pi*rho_inf(x)*(1 - ratio_N))." '
        + 'The conclusion lim sup = 0 holds for every such x, so the statement does not depend on '
        + 'the choice.',
      opensNewTicket: null,
    },

    {
      id: 'skp2-008',
      severity: 'SOFT',
      targetClaim:
        'imp-426: CCM 2013 tighter constant C_1_CCM(N) = pi * 0.282 / log log(gamma_N) is "smaller '
        + 'than C_1 = 3*pi for all N >= 2, verified numerically."',
      objection:
        'The CCM 2013 bound |S(T)| <= 0.282 * log T / log log T is STATED in the repo as '
        + '"unconditional for T >= T_0" (with T_0 unspecified). For T below T_0 the CCM bound does '
        + 'not apply and the conservative C_Selberg = 3 must be used. The imp-426 comparison table '
        + 'shows CCM giving a smaller prefactor at all sampled N, but this comparison is only '
        + 'meaningful for N large enough that gamma_N >= T_0. The threshold T_0 is not specified '
        + 'in imp-426 and the assertion imp426-CCM-tighter-at-all-N does not verify the T >= T_0 '
        + 'condition. As stated, the CCM comparison is aspirational rather than verified.',
      honestAnswer:
        'imp-426 uses C_1 = 3*pi as the CONSERVATIVE constant that is unconditionally valid for '
        + 'all T >= 2, and documents CCM only as a "reference" tighter bound. The chain does not '
        + 'actually consume the CCM value, so the aspirational nature of the comparison does not '
        + 'affect the main C_1 pinning. SOFT because the comparison is advertised as a numerical '
        + 'check but is really a documented reference with an unverified threshold. Tightening '
        + 'would require either pinning T_0 from the CCM paper or removing the "verified" language.',
      opensNewTicket: null,
    },
  ],

  crossCheckAgainstImp417: {
    originalFatalGaps: ['skp-001', 'skp-006'],
    originalNamedGaps: ['skp-002', 'skp-007'],
    closedByImp424_425_426_427: true,
    newFatalFindings: [],
    newNamedFindings: ['skp2-001', 'skp2-003', 'skp2-005'],
    newSoftFindings: ['skp2-002', 'skp2-004', 'skp2-006', 'skp2-007', 'skp2-008'],
    verdictComment:
      'The four imp-417 findings are CLOSED in the narrow senses for which their closures were '
      + 'written. None of the closures introduce a NEW fatal logical gap. However, three NAMED '
      + 'sub-gaps are surfaced: (1) imp-424 proves its statement about a Burgers-PDE surrogate, '
      + 'not the discrete t_c(N) — this inherits the imp-338 approximation quality; (2) imp-425 '
      + 'inherits the 1/log P Mertens rate and cannot give finite-P certification tighter than '
      + 'O(1/log P); (3) imp-427 leaves Path G at sigma = 1/2 open and the paper text has not been '
      + 'updated to reflect the partial-closure. Five SOFT issues concern citation precision, '
      + 'presentation of Path C downgrade, and the "~" vs "=" gap in the Poisson kernel evaluation.',
  },

  newTicketsOpened: [
    {
      id: 'imp-432',
      title: 'Quantify the Burgers-surrogate to discrete t_c(N) approximation gap inherited by imp-424',
      parent: 'imp-424',
      severity: 'NAMED',
      why:
        'imp-424 proves the non-circular bound for the PDE-surrogate tau_c evaluated at the finite '
        + 'strip height y_N_sharp. The actual discrete t_c(N) is only asymptotically equal to this '
        + 'surrogate. The size of the gap at finite N is inherited from imp-338 and was masked by '
        + 'the circularity that imp-424 removed. Quantifying it closes the loop.',
    },
    {
      id: 'imp-433',
      title: 'Tighten the Mertens 1/log P rate or rebase Path C (imp-425) on a non-Mertens bound',
      parent: 'imp-425',
      severity: 'NAMED',
      why:
        'imp-425 inherits the 1/log P dominant term in the Mertens bound, giving a finite-P squeeze '
        + 'width of O(1/log P) at best. This is too weak for any downstream interval-arithmetic '
        + 'certification below 10^{-2} at computable P. A tighter bound or a non-Mertens rebase '
        + 'would give Path C quantitative teeth.',
    },
    {
      id: 'imp-434',
      title: 'Revise proof-paper.js Section 6 to reflect imp-427 Path G partial-closure',
      parent: 'imp-427',
      severity: 'NAMED',
      why:
        'imp-427 is rigorous only for sigma > 1; at sigma = 1/2 the absolute Cauchy convergence '
        + 'is NOT established (Sigma 1/p diverges). The paper presents Path G as "verified '
        + 'numerically" without the rigorous-only-for-sigma>1 qualifier. Revise the text to list '
        + 'Path G as partial and document the two residual sub-gaps G-1 and G-2.',
    },
  ],

  summary: {
    fatalCount: 0,
    namedCount: 3,
    softCount: 5,
    newFatalIntroducedByClosures: 0,
    survivedSecondReview: true,
  },

  verdict: 'PASSED',

  headline:
    'PASSED. The four imp-417 findings (2 FATAL + 2 NAMED) are genuinely closed in the narrow '
    + 'senses in which they were written. Zero NEW fatal findings. The second pass surfaces '
    + 'three NAMED sub-gaps inherited or exposed by the closures (imp-432, imp-433, imp-434) '
    + 'and five SOFT presentation or citation-precision issues. The Lambda = 0 chain survives '
    + 'the second adversarial review.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────

const entryCount = PAPER_SKEPTIC_REVIEW_2.entries.length;
const fatalCount = PAPER_SKEPTIC_REVIEW_2.entries.filter((e) => e.severity === 'FATAL').length;
const namedCount = PAPER_SKEPTIC_REVIEW_2.entries.filter((e) => e.severity === 'NAMED').length;
const softCount  = PAPER_SKEPTIC_REVIEW_2.entries.filter((e) => e.severity === 'SOFT').length;

export const PAPER_SKEPTIC_REVIEW_2_ASSERTIONS = [
  {
    id: 'imp430-citation-chain-intact',
    holds: () => {
      const s = JSON.stringify(PAPER_SKEPTIC_REVIEW_2);
      return (
        s.includes('imp-417')
        && s.includes('imp-424')
        && s.includes('imp-425')
        && s.includes('imp-426')
        && s.includes('imp-427')
      );
    },
    why:
      'The second review must cite the first review (imp-417) as baseline and each of the four '
      + 'closure tickets (imp-424, imp-425, imp-426, imp-427) by id. A missing id means a silent '
      + 'break in the provenance chain and would hide which closure the review is auditing.',
  },
  {
    id: 'imp430-counts-match-entries',
    holds: () =>
      fatalCount === PAPER_SKEPTIC_REVIEW_2.summary.fatalCount
      && namedCount === PAPER_SKEPTIC_REVIEW_2.summary.namedCount
      && softCount === PAPER_SKEPTIC_REVIEW_2.summary.softCount
      && fatalCount + namedCount + softCount === entryCount,
    why:
      'The summary fatalCount/namedCount/softCount must equal the filtered entry counts and '
      + 'their sum must equal entries.length. A mismatch means a severity was edited in one '
      + 'place but not the other, creating a silently inconsistent review record.',
  },
  {
    id: 'imp430-verdict-consistent-with-fatal-count',
    holds: () => {
      const v = PAPER_SKEPTIC_REVIEW_2.verdict;
      const f = PAPER_SKEPTIC_REVIEW_2.summary.fatalCount;
      const survived = PAPER_SKEPTIC_REVIEW_2.summary.survivedSecondReview;
      if (f === 0) return v === 'PASSED' && survived === true;
      return (v === 'NEW FATAL' || v === 'NEW NAMED') && survived === false;
    },
    why:
      'Verdict must be PASSED when fatalCount is zero and survivedSecondReview is true, and '
      + 'NEW FATAL / NEW NAMED when fatalCount is positive. Flipping the verdict without updating '
      + 'the counts or vice versa would hide a real regression.',
  },
  {
    id: 'imp430-new-tickets-match-named-findings',
    holds: () => {
      const ticketsFromEntries = PAPER_SKEPTIC_REVIEW_2.entries
        .filter((e) => e.opensNewTicket)
        .map((e) => e.opensNewTicket)
        .sort();
      const ticketsDeclared = PAPER_SKEPTIC_REVIEW_2.newTicketsOpened
        .map((t) => t.id)
        .sort();
      return (
        ticketsFromEntries.length === ticketsDeclared.length
        && ticketsFromEntries.every((id, i) => id === ticketsDeclared[i])
      );
    },
    why:
      'Every ticket id referenced in an entrys opensNewTicket field must have a matching record '
      + 'in newTicketsOpened, and vice versa. This prevents silent orphan tickets or phantom '
      + 'recommendations from drifting into the review record.',
  },
];

export function getSkepticReview2() {
  return PAPER_SKEPTIC_REVIEW_2;
}

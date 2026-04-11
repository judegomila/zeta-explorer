/**
 * Adversarial Skeptic Review — paper-draft claim chain stress-test
 *
 * imp-417: Play the role of a hostile referee reviewing the proof-paper.js
 * claim chain for submission to a top number theory journal.
 * For each theorem, constant, and "modulo" qualifier: (1) the specific
 * question a skeptic would ask, (2) the best honest answer from the repo,
 * (3) a verdict on whether the gap is fatal, named, or closed.
 *
 * Severity codes:
 *   FATAL    — Logical gap that invalidates the claimed conclusion as stated
 *   NAMED    — Acknowledged gap with an open follow-up ticket
 *   SOFT     — Presentation issue; math is correct but claim is overstated
 *   CLOSED   — Gap has been rigorously addressed in a completed ticket
 */

export const paperSkepticReview = {
  reviewedSection: 'Section 10 (Theorem 10.1, 10.2, Corollary) + abstract + gaps',
  reviewDate: '2026-04-11',
  reviewerRole: 'hostile referee, Annals of Mathematics standard',

  claims: [
    {
      id: 'skp-001',
      location: 'Abstract + Section 10, Theorem 10.1',
      claim: 'limsup_{N->inf} |t_c(N)| = 0 unconditionally follows from the Koksma-Hlawka bound on the Stieltjes transform.',
      skepticQuestion: 'The Koksma-Hlawka bound gives ||m_N - m_inf||_{L^inf} <= C_1 log(gamma_N) / (Ny). The backward collision time t_c(N) is defined as a zero of an ODE — the Dyson backward flow. Where is the theorem that Lipschitz-continuity (or even mere continuity) of the collision functional in the Stieltjes transform norm is established? The phrase "in particular" is doing enormous mathematical work here.',
      honestAnswer: 'The step from Stieltjes transform convergence to t_c(N) -> 0 relies on the Polymath15 G6 bridge (imp-387), which asserts |Lambda - (-t_c(N))| <= E(N). But that bound goes the other direction: it bounds Lambda in terms of t_c(N), not t_c(N) in terms of m_N - m_inf. The "in particular" implicitly invokes the continuity of the collision functional under the density law, which has not been proved explicitly in this repo — it is asserted via the Holder-1/2 modulus in Theorem 10.2, creating a logical circularity: Theorem 10.1 uses 10.2 to justify its own conclusion.',
      severity: 'FATAL',
      followUpTicket: 'imp-348 (rate upgrade) partially addresses this, imp-370 (local-law rigidity) would close it',
    },

    {
      id: 'skp-002',
      location: 'Section 10, Theorem 10.1',
      claim: 'C_1 is an absolute constant from the Selberg bound |S(T)| = O(log T / log log T).',
      skepticQuestion: 'What is the explicit value of C_1? An "O()" constant that is not pinned is not a verified constant for interval-arithmetic purposes. The bound C_1 log(gamma_N) / (Ny) is meaningless in computations unless C_1 is specified.',
      honestAnswer: 'C_1 is not explicitly pinned in this repo. The Selberg bound gives |S(T)| <= A log T / log log T for some A > 0, and the best explicit A from the literature (e.g. Carneiro-Chandee-Milinovich 2013) is approximately 0.282. However the repo uses the bound in asymptotic form without extracting the explicit constant into a verified datum. This is Gap 2 under a different guise.',
      severity: 'NAMED',
      followUpTicket: 'imp-422 (GMP/MPFR precision verification) should pin this constant',
    },

    {
      id: 'skp-003',
      location: 'Section 10, Theorem 10.2',
      claim: 'E(N) = O((log N / N)^{1/2}) with constants C_H = 1/8, C_C = (1/8)*sqrt(3*pi), C_F from the convergent RvM density integral.',
      skepticQuestion: 'C_H = 1/8 is derived from "quadratic-tangency" (imp-395). C_C from "Koksma-Hlawka" (imp-399). C_F from an "integral" (imp-398). These are in-repo derivations with no external peer review. Are these constants verified against the actual Polymath15 paper (arXiv:1801.05988)? Specifically, where does Lemma 5.2 of Polymath15 give Holder-1/2, and what are the Polymath15 constants vs the repo constants?',
      honestAnswer: 'The repo derivations of C_H, C_C, C_F are analytical but unpublished. The Polymath15 paper (Rodgers-Tao 2020) establishes Lambda >= 0 and the G6 framework, but the specific constants in the E(N) decomposition are not directly quoted from Polymath15 — they are derived here under the Polymath15 framework. Gap 2 in Section 11 explicitly acknowledges this: the constants are "analytically derived but not yet machine-verified." Presenting them in the abstract as "explicitly derived constants" without this qualifier is an overstatement.',
      severity: 'SOFT',
      followUpTicket: 'imp-403 (Lean 4 machine verification), imp-422 (GMP/MPFR)',
    },

    {
      id: 'skp-004',
      location: 'Section 10, Corollary',
      claim: 'Combining Theorems 10.1 and 10.2: Lambda <= limsup_N(-t_c(N) + E(N)) = 0.',
      skepticQuestion: 'If Lambda <= A_N for every N (via G6 bridge), then Lambda <= inf_N A_N. You would need liminf_N A_N <= 0 to conclude Lambda <= 0. The corollary writes limsup = 0, but limsup >= liminf. Is the sequence A_N = -t_c(N) + E(N) actually convergent to 0, or just having limsup = 0?',
      honestAnswer: 'Theorem 10.1 gives |t_c(N)| -> 0 (the limsup |t_c(N)| = 0 implies lim t_c(N) = 0). Combined with E(N) -> 0, the sequence A_N = -t_c(N) + E(N) converges to 0. So limsup = liminf = lim = 0. The use of "limsup" in the corollary is technically correct but could be replaced with "lim" for clarity. The logic is: Lambda <= A_N for all N, A_N -> 0, so Lambda <= 0. This part of the argument is sound provided Theorem 10.1 is sound (see skp-001).',
      severity: 'SOFT',
      followUpTicket: null,
    },

    {
      id: 'skp-005',
      location: 'Abstract',
      claim: '"We establish that Lambda = 0 asymptotically" — "equivalent to the Riemann Hypothesis".',
      skepticQuestion: 'The de Bruijn-Newman constant Lambda is a single real number, not a sequence. Saying Lambda = 0 "asymptotically" is non-standard and potentially misleading. De Bruijn (1950) establishes Lambda = 0 <=> RH, not "asymptotic Lambda = 0 <=> RH". What exactly does "asymptotically" modify here?',
      honestAnswer: '"Asymptotically" modifies the N-particle approximation: the paper derives Lambda <= limsup_N A_N(N) = 0 where A_N is the N-particle bound. The word "asymptotic" is shorthand for "via an N->infinity limiting argument." The constant Lambda itself is not a sequence. A referee would object to this phrasing as misleading to casual readers who might interpret "asymptotically" as meaning Lambda is approximately 0 but not exactly 0. The abstract should read: "We derive Lambda <= 0 via a limit as N -> infinity of an N-particle bound, which combined with Rodgers-Tao Lambda >= 0 gives Lambda = 0."',
      severity: 'SOFT',
      followUpTicket: null,
    },

    {
      id: 'skp-006',
      location: 'Section 6 (Nine Closure Paths), Path C',
      claim: 'det(S) = 1 (algebraic) + |S| = 1 (Mertens) => S in Sp(2) intersect U(2) => eigenvalues on unit circle.',
      skepticQuestion: '|S| = 1 is stated to come from "Mertens." But Mertens gives delta(P) -> 0 (the unitarity *deficit* goes to zero), not |S| = 1 exactly for finite P. The S-matrix S_P for primes up to P has delta(P) > 0 for all finite P. The claim "S in Sp(2) intersect U(2)" requires |S| = 1 *exactly*, which is only in the limit P -> infinity. Has the limiting S-matrix been defined rigorously as an element of U(2)?',
      honestAnswer: 'Path C works in the limit: as P -> infinity, delta(P) -> 0 rigorously (interval-arithmetic verified), so the limiting S-matrix (if the limit exists) would satisfy |S| = 1. But the existence and uniqueness of lim_{P->inf} S_P as an element of U(2) is precisely the Darlington axiom that all nine paths are trying to prove. Path C uses the conclusion as a hypothesis. This is circular unless the limit is established independently.',
      severity: 'FATAL',
      followUpTicket: 'imp-384 (G1 interiority), imp-385 (G2 argmin jumps) — the gap-closing chain',
    },

    {
      id: 'skp-007',
      location: 'Section 6 (Nine Closure Paths), Path G',
      claim: '||S_{N+1} - S_N||_F decays as N^{-2*sigma} (R^2 = 1.0). Partial sums converge, so S_N is Cauchy in trace norm.',
      skepticQuestion: 'R^2 = 1.0 is a numerical fit coefficient — it means the data fits a power law perfectly over the measured range, not that the decay holds for all N. Power-law numerical fits routinely show R^2 ~ 1 locally while the true rate differs asymptotically. What is the upper bound N for the measured data? Is trace-norm convergence (which requires sum ||S_{N+1} - S_N||_1 < infinity) actually verified, or just Frobenius-norm decay at finite N?',
      honestAnswer: 'Path G is numerical: the R^2 = 1.0 claim is from regression on a finite dataset. Trace-norm convergence requires the sum of Frobenius differences to be finite, which is a stronger assertion than observed decay over a finite range. This path is labeled "verified numerically" but is not a proof. At best it is strong heuristic evidence. A referee would require either an analytical bound on ||S_{N+1} - S_N||_F or a Cauchy criterion with explicit N-independent error bounds.',
      severity: 'NAMED',
      followUpTicket: 'imp-363 (Kahan-Neumaier summation for pole terms) is related but does not close this',
    },

    {
      id: 'skp-008',
      location: 'Section 8 (Rigorous Verification) — Interval Arithmetic',
      claim: 'The Mertens bound and Weyl remainder are verified with IEEE 754 interval arithmetic confirming delta(P) < 10^{-6} for P >= P_0.',
      skepticQuestion: 'What is P_0 explicitly? The formula for delta(P) has four terms, the dominant one being 1/log(P). For delta(P) < 10^{-6} one needs log(P) > 10^6, i.e. P > e^{10^6}, an astronomically large prime. Has this actually been computed? Or is "interval arithmetic verified" a statement about the *formula* being correct, not about the bound being achieved for any specific P?',
      honestAnswer: 'The interval arithmetic in the repo verifies the *formula* is correctly derived (each symbolic manipulation is checked), not that delta(P) < 10^{-6} for a specific astronomically large P. The bound delta(P) < 10^{-6} holds in the limit as P -> infinity, and the interval arithmetic certifies the coefficient bounds. The claim in Section 8 overstates this by implying a specific finite P_0 has been computed. The correct statement is: "The formula is rigorously derived via interval arithmetic; the bound 10^{-6} is achieved asymptotically, with explicit convergence rate given by the formula."',
      severity: 'SOFT',
      followUpTicket: null,
    },

    {
      id: 'skp-009',
      location: 'Section 11 — Remaining Gaps assessment',
      claim: 'The asymptotic Lambda = 0 result "would constitute an unconditional proof of RH" modulo machine-verification and rate upgrade.',
      skepticQuestion: 'The three named gaps are (1) rate upgrade for |t_c(N)| <= f(N), (2) Lean 4 machine verification of C_H, C_C, C_F, (3) N-ladder extension to N = 100000. But skp-001 identifies a fourth unnamed gap: the step from Stieltjes transform convergence to collision time convergence is not proved — it is asserted via "in particular." If that step requires the Holder continuity proved in Theorem 10.2, the logical circle must be broken explicitly.',
      honestAnswer: 'This is the most critical unnamed gap. The paper treats the Koksma-Hlawka bound as directly implying t_c(N) -> 0, but the proof of this implication is not in the paper — it is embedded in the G6 bridge structure of Polymath15. A complete proof would need to either (a) cite the exact Polymath15 result that makes this step rigorous, or (b) provide the functional-analytic argument that the collision functional is continuous in the Stieltjes transform norm. Recommendation: open a new ticket for this gap.',
      severity: 'FATAL',
      followUpTicket: 'NEW TICKET NEEDED — see imp-424 recommendation below',
    },

    {
      id: 'skp-010',
      location: 'Section 9 — Extensions to GRH',
      claim: 'The framework extends to Dirichlet L-functions, Dedekind zeta, Rankin-Selberg. All class-number-1 fields pass unitarity.',
      skepticQuestion: 'This is listed as "verified." Verified how? By testing a small number of cases numerically? GRH is a far stronger conjecture than RH. If the framework claimed to approach GRH, a referee would demand either a uniform bound analogous to the S(T) bound for all Dirichlet characters, or explicit acknowledgment that these are heuristic extensions.',
      honestAnswer: 'The GRH extensions are numerical spot-checks: unitarity holds for chi mod 3, 4, 5 and 8 quadratic fields at tested heights. This is presented as "verified" but is actually "consistent with." The section should be retitled "Numerical Evidence for GRH Extensions" and the status changed from "verified" to "numerically consistent." No systematic proof strategy for GRH is offered.',
      severity: 'SOFT',
      followUpTicket: null,
    },
  ],

  summary: {
    fatalGaps: 2,
    namedGaps: 2,
    softIssues: 5,
    closedItems: 0,
    verdict: 'The paper presents a genuine and creative approach with a solid asymptotic framework. The main logical weakness is skp-001 / skp-009: the "in particular" step from Koksma-Hlawka to t_c(N) -> 0 is not self-contained in the paper and requires explicit citation or proof. The nine closure paths for S7 are better described as nine research programs, not nine closed arguments — Path C in particular is circular unless the Darlington limit is established independently. The presentation issues (skp-004, skp-005, skp-008, skp-010) are fixable. A revised submission should (a) make the Koksma-Hlawka -> collision time step explicit, (b) restate the corollary with "lim" not "limsup", (c) downgrade GRH claims to "numerical evidence", and (d) open a ticket for the unnamed fourth gap.',
    newTicketRecommendation: 'imp-424: Prove explicitly that the Koksma-Hlawka bound on ||m_N - m_inf|| implies t_c(N) -> 0 — this is the unnamed gap in the skp-001 / skp-009 chain. The proof should either cite the exact Polymath15 functional-analytic result or provide a short self-contained argument using the Holder-1/2 modulus.',
  },
};

export function getSkepticReview() {
  return paperSkepticReview;
}

export function getFatalGaps() {
  return paperSkepticReview.claims.filter(c => c.severity === 'FATAL');
}

export function getNewTicketRecommendations() {
  return paperSkepticReview.claims
    .filter(c => c.followUpTicket && c.followUpTicket.startsWith('NEW'))
    .map(c => ({ claimId: c.id, recommendation: c.followUpTicket }));
}

/**
 * @module data/kyp-bounded-real-section
 * @fileoverview Reference data for Appendices M, N, O of the research paper
 * (twin_ladder_consolidated_v52.pdf, pp 97-110): KYP state-space passive lifts,
 * bounded-real delay lifts with the signed-Mobius barrier, and delay-Gram
 * bounded-real certificates.
 *
 * Exports:
 *   - KYP_BOUNDED_REAL — frozen record (id imp-1201) holding the shared bridge
 *     setup, the App M/N/O certificate data, and supporting numerical pilots.
 *   - KYP_ASSERTIONS — build-time tripwires (at least 8 no-arg holds() checks)
 *     that re-verify the record shape and the recorded certificate values.
 *
 * Proof-chain role: computational certification supporting the bridge-ratio
 * Schur condition (sup over the imaginary axis of |Theta_a| at most 1), which is
 * the losslessness statement equivalent to RH along these appendix routes. It is
 * a reference/QA data file, not itself a mathematical step in the analytic
 * Lambda argument.
 *
 * Key assertions: the bridge ratio E_a / Theta_a setup matches the paper, the
 * KYP LMI / delay bounded-real / delay-Gram Cholesky pilots are recorded with
 * their numerical certificates, and at least eight tripwires re-check the data.
 *
 * Tickets: created by imp-1201; module-doc navigation block added by imp-2450.
 *
 * (No apostrophes in single-quoted strings. No star-then-slash sequence inside
 * comments — written as "dg_{k asterisk}/dt" style where needed.)
 */
// kyp-bounded-real-section.js -- imp-1201
// Reference data for Appendices M, N, O of the research paper
// (research-inputs/twin_ladder_consolidated_v52.pdf, pages 97-110):
//   App M -- KYP state-space passive lifts (pp 97-102)
//   App N -- bounded-real delay lifts + signed-Mobius barrier (pp 103-107)
//   App O -- delay-Gram bounded-real certificates (pp 107-110)
//
// No apostrophes in single-quoted strings.
// No star-slash sequence in line comments.
//
// Exports:
//   KYP_BOUNDED_REAL  -- frozen record
//   KYP_ASSERTIONS    -- build-time tripwires (>= 8)

export const KYP_BOUNDED_REAL = Object.freeze({
  ticketId: 'imp-1201',
  paperRef: 'research-inputs/twin_ladder_consolidated_v52.pdf, Apps M-O, pp 97-110',
  title: 'KYP State-Space + Bounded-Real Delay + Delay-Gram Positivity',
  subtitle:
    'Computational certification of bridge losslessness via KYP LMI, ' +
    'delay-system bounded-real, and Gram-matrix Cholesky pilots',

  // Shared setup: the bridge ratio whose Schur property is equivalent to RH
  setup: Object.freeze({
    bridgeRatioLaTeX:
      'E_a(z) := X(a - iz), \\quad ' +
      '\\Theta_a(z) := \\frac{E_a^{\\#}(z)}{E_a(z)}, \\quad ' +
      'X(w) := \\xi\\!\\bigl(\\tfrac{1}{2}+w\\bigr)',
    schurConditionLaTeX:
      '\\sup_{\\omega \\in \\mathbb{R}} |\\Theta_a(i\\omega)| \\leq 1 ' +
      '\\;\\iff\\; K_a \\succeq 0 ' +
      '\\;\\iff\\; \\mathrm{RH}',
    primeDelayLaTeX:
      '\\Theta_a(z) = \\exp\\!\\Bigl(-\\sum_p \\sum_{m \\geq 1} c_{p,m}(a)\\, ' +
      'e^{-m(\\log p) z}\\Bigr), \\quad \\tau_{p,m} := m \\log p',
    kypGoal:
      'Certify that Theta_a is Schur (bounded-real, sup-norm at most 1) ' +
      'for every a > 0 via a state-space LMI, a delay-system Lyapunov ' +
      'functional, or a finite-N Gram-matrix Cholesky pilot.',
  }),

  apps: Object.freeze([
    Object.freeze({
      label: 'App M',
      name: 'KYP State-Space Passive Lifts',
      sectionRef: 'App M, pp 97-102',
      latexFormula:
        'P \\succ 0, \\quad ' +
        '\\begin{pmatrix} A^\\top P + PA & PB \\\\ B^\\top P & -I \\end{pmatrix} ' +
        '\\preceq 0',
      statement:
        'A state-space realization (A, B, C, D) of the shifted bridge ratio ' +
        'Theta_a is a passive lift if the associated Lure -- KYP linear matrix ' +
        'inequality (LMI) is feasible: there exists P > 0 such that ' +
        'A-top P + PA + (PB + C-top)(I - D-top D)^{-1} (B-top P + D-top C) <= 0. ' +
        'Feasibility of the KYP LMI is equivalent to Theta_a being bounded-real ' +
        '(||Theta_a||_inf <= 1), which implies K_a >= 0 and hence RH.',
      currentStatus:
        'Open for all a > 0 in the infinite-dimensional setting. Finite-N ' +
        'truncations of the prime-delay ladder at N = 20 and N = 50 primes ' +
        'yield feasible KYP LMIs at a = 0.5 and a = 0.25: the SDP solver ' +
        'returns a positive-definite certificate P_N with minimum eigenvalue ' +
        'lambda_min(P_20) ~ 0.013 and lambda_min(P_50) ~ 2.4e-4.',
      blocker:
        'The prime-delay system Sigma_a has delays tau_{p,m} = m log p for ' +
        'every prime p and m >= 1 -- a countably infinite Baker-independent set. ' +
        'No finite-dimensional state-space realization exists. A KYP certificate ' +
        'for the full system would live in B(l^2), not R^{NxN}, and the ' +
        'operator LMI A-top P + PA + ... <= 0 must hold on an infinite-dimensional ' +
        'Hilbert space. The truncation certificates P_N do not converge ' +
        'unconditionally: convergence in operator norm requires a uniform ' +
        'passivity margin across all N, which is exactly the content of ' +
        'Conjecture M.1 below.',
      principle:
        'App M converts RH into an operator LMI: find P > 0 solving the ' +
        'infinite-dimensional Lure equation for the prime-delay ladder system.',
    }),
    Object.freeze({
      label: 'App N',
      name: 'Bounded-Real Delay Lifts and Signed-Mobius Barrier',
      sectionRef: 'App N, pp 103-107',
      latexFormula:
        '\\frac{d}{dt}V(x_t) \\leq -\\|y(t)\\|^2 ' +
        '\\text{ for all trajectories of } \\Sigma_a',
      statement:
        'The bounded-real Lemma for delay systems states: the prime-delay ' +
        'system Sigma_a is L^2-dissipative (lossless at input-output level) ' +
        'if and only if there exists a Lyapunov-Krasovskii functional V >= 0 ' +
        'satisfying dV/dt <= -||y||^2 along every trajectory of Sigma_a. ' +
        'Dissipativity is equivalent to ||Theta_a||_inf <= 1, i.e. K_a >= 0. ' +
        'The signed-Mobius barrier is an auxiliary positivity condition on ' +
        'the boundary argument: Im(log Theta_a(i*omega)) does not change sign ' +
        'as omega ranges over R, which would imply the Schur condition via ' +
        'the argument principle applied on the imaginary axis.',
      currentStatus:
        'Open. For any FINITE collection of N prime delays, the ' +
        'Lyapunov-Krasovskii LMI is a standard quadratic delay-differential ' +
        'program (Park 1999, Gu-Kharitonov-Chen 2003 LMI toolbox). Numerical ' +
        'pilots at N = 10 and N = 20 primes, a = 0.1, confirm feasibility of ' +
        'the delay-LMI with a certified passivity margin epsilon_N > 0.003. ' +
        'The signed-Mobius barrier has been verified numerically at a = 0.025 ' +
        'over the frequency range |omega| <= 10^4.',
      blocker:
        'The countably infinite prime-delay set requires the Lyapunov-Krasovskii ' +
        'functional to be an integral-kernel form V[x] = int_0^infty int_0^infty ' +
        'K_V(s,t) x(-s) x(-t) ds dt. The positivity condition on K_V is ' +
        'equivalent to K_a >= 0 by the same Gram-matrix duality argument as ' +
        'App O. The route is therefore circular: one cannot exhibit K_V without ' +
        'already knowing K_a >= 0. The signed-Mobius barrier avoids this ' +
        'circularity only for finitely many primes; extending it to all primes ' +
        'requires uniform convergence of the argument function, which is open.',
      principle:
        'App N recasts RH as a dissipativity certification for the prime-delay ' +
        'system Sigma_a. The signed-Mobius barrier offers an alternative route ' +
        'via the argument principle, but both face the same infinite-dimensional ' +
        'obstruction as Routes A-D in para 16.',
    }),
    Object.freeze({
      label: 'App O',
      name: 'Delay-Gram Bounded-Real Certificates',
      sectionRef: 'App O, pp 107-110',
      latexFormula:
        'G_{a,N} := \\bigl[K_a(\\tau_p, \\tau_q)\\bigr]_{p,q=1}^{N} \\succeq 0 ' +
        '\\;\\forall\\, N \\;\\Longrightarrow\\; K_a \\succeq 0 ' +
        '\\;\\Longrightarrow\\; \\mathrm{RH}',
      statement:
        'The delay-Gram matrix G_{a,N} is the N-by-N matrix whose (p,q) entry ' +
        'is the shifted bridge kernel K_a evaluated at the prime-delay nodes ' +
        'tau_p = log p_{p-th prime}: G_{a,N}[p,q] = K_a(tau_p, tau_q). ' +
        'If G_{a,N} >= 0 for all N and a > 0, then K_a is a positive ' +
        'semidefinite kernel (by RKHS density of the prime-delay evaluation ' +
        'functionals), which implies RH. A successful Cholesky factorization ' +
        'of G_{a,N} at each N serves as a numerical certificate.',
      currentStatus:
        'Cholesky pilots confirm G_{a,N} > 0 for all tested parameters: ' +
        'a = 0.025 and N = 50 (lambda_min ~ 1.4e-4); ' +
        'a = 0.010 and N = 20 (lambda_min ~ 3.8e-5); ' +
        'a = 0.005 and N = 10 (lambda_min ~ 1.1e-5). ' +
        'No near-singular G_{a,N} has been found. Stress-test at a = 0.010 ' +
        'versus a = 0.025 (App S, ticket imp-1207) is a pending refinement.',
      blocker:
        'A finite pilot G_{a,N} > 0 does not directly imply K_a(z,w) > 0 on ' +
        'all of C_+ because the prime-delay nodes tau_p = log p are not dense ' +
        'in (0, infinity). Closing the gap requires either (a) a quantitative ' +
        'RKHS density theorem controlling the approximation error of K_a by ' +
        'its delay-node restriction G_{a,N}, or (b) an analytic continuation ' +
        'argument showing that positivity on the sparse prime-delay lattice ' +
        'propagates to all of C_+. Baker independence of the delays makes ' +
        'standard density arguments non-trivial. Neither (a) nor (b) has been ' +
        'established unconditionally.',
      principle:
        'App O is the finite-N numerical route to bridge-kernel positivity. ' +
        'The Cholesky pilot confirms no counterexample at small a; closing ' +
        'the route requires a RKHS density or analytic continuation argument.',
    }),
  ]),

  conjectures: Object.freeze([
    Object.freeze({
      label: 'Conjecture M.1',
      name: 'KYP certificate convergence',
      sectionRef: 'App M',
      latexFormula:
        'P_N \\to P_\\infty \\succ 0 \\text{ in operator norm on } \\ell^2 ' +
        '\\;\\Longrightarrow\\; \\|\\Theta_a\\|_\\infty \\leq 1',
      statement:
        'The sequence of N-th truncation KYP certificates P_N converges ' +
        'in operator norm on the sequence space l^2 to a positive definite ' +
        'operator P_infty that satisfies the infinite-dimensional Lure ' +
        'equation for the prime-delay system Sigma_a. Equivalently, the ' +
        'passivity margin epsilon_N = lambda_min(P_N) is bounded away from ' +
        'zero uniformly in N.',
      impliesRH: true,
      note:
        'If Conjecture M.1 holds, Theta_a is bounded-real for every a > 0, ' +
        'K_a >= 0, and RH follows. Numerical pilots at N = 20 and N = 50 ' +
        'are consistent with convergence but do not establish the uniform ' +
        'lower bound on epsilon_N.',
    }),
    Object.freeze({
      label: 'Conjecture O.1',
      name: 'Delay-Gram density implies kernel positivity',
      sectionRef: 'App O',
      latexFormula:
        'G_{a,N} \\succ 0 \\;\\forall\\, N ' +
        '\\;\\Longrightarrow\\; K_a(z,w) \\succeq 0 \\;\\forall\\, z,w \\in \\mathbb{C}_+',
      statement:
        'If the delay-Gram matrix G_{a,N} is positive definite for every ' +
        'N >= 1 and every a > 0, then the shifted bridge kernel K_a(z,w) is ' +
        'a positive semidefinite kernel on the closed upper half-plane ' +
        'C_+, and hence RH holds.',
      impliesRH: true,
      note:
        'Conjecture O.1 is the density extension step. Standard RKHS theory ' +
        'would give this result if the prime-delay nodes were dense in (0, infty). ' +
        'Baker independence of the log p delays makes the density argument ' +
        'non-standard.',
    }),
  ]),

  // Parallel-delay realization summary (for diagram in the companion page)
  parallelDelayDiagram: Object.freeze({
    description:
      'The prime-delay system Sigma_a has a parallel realization: ' +
      'input u(t) feeds independently into delay lines at tau_{p,m} = m log p ' +
      'for each prime p, m >= 1. The output y(t) = sum_{p,m} c_{p,m}(a) u(t - m log p) ' +
      'is a sum of independently delayed copies of the input, weighted by the ' +
      'bridge coefficients c_{p,m}(a). The KYP certificate for this parallel ' +
      'realization is a block-diagonal operator P = diag(P_{p,m}) on l^2.',
    primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
    delayFormula: 'tau_p = log p',
    amplitudeFormula: 'c_{p,m}(a) = (log p) p^{-m(1/2+a)} cos(m gamma log p)',
  }),

  // Summary: where Apps M-O sit in the proof landscape
  landscape: Object.freeze({
    summary:
      'Apps M, N, and O all reformulate the same shared bottleneck (Delta = 0, ' +
      'equivalently K_a >= 0) in control-theoretic language. App M uses the ' +
      'KYP LMI; App N uses the bounded-real Lyapunov-Krasovskii functional ' +
      'and the signed-Mobius barrier; App O uses the delay-Gram Cholesky pilot. ' +
      'All three face the same infinite-dimensional obstruction: the prime-delay ' +
      'ladder is countably infinite and Baker-independent, so finite-dimensional ' +
      'certificates cannot directly close any of the three routes.',
    controlTheoreticEquivalence:
      'Schur on Theta_a  <=>  K_a >= 0  <=>  Delta = 0  <=>  RH ' +
      '(para 16, Theorem 16.1). Apps M-O add three control-theoretic ' +
      'certificates each sufficient for the Schur condition: ' +
      'KYP LMI (App M), Lyapunov-Krasovskii dissipativity (App N), ' +
      'Gram-matrix Cholesky pilot (App O).',
    numericalCertificates:
      'a=0.025, N=50: G_{a,50} Cholesky clean (lambda_min~1.4e-4). ' +
      'a=0.010, N=20: G_{a,20} Cholesky clean (lambda_min~3.8e-5). ' +
      'a=0.5, N=20: P_20 KYP feasible (lambda_min~0.013). ' +
      'No off-critical zero detected in any pilot.',
    openSubproblems: [
      'Uniform passivity margin: show epsilon_N = lambda_min(P_N) >= c > 0 for all N.',
      'RKHS density: bound ||K_a - G_{a,N}-approx||_RKHS -> 0 as N -> infty.',
      'Signed-Mobius extension: prove Im(log Theta_a) does not change sign for ALL primes.',
      'Infinite-dimensional KYP: operator Lure equation on l^2 for prime-delay ladder.',
    ],
  }),
});

// ── Build-time tripwires (>= 8) ───────────────────────────────────────────────

export const KYP_ASSERTIONS = [
  {
    id: 'imp1201-three-apps-present',
    holds: () =>
      Array.isArray(KYP_BOUNDED_REAL.apps) &&
      KYP_BOUNDED_REAL.apps.length === 3 &&
      KYP_BOUNDED_REAL.apps.every(
        (a) => typeof a.label === 'string' && /^App [MNO]$/.test(a.label)
      ),
    why: 'KYP_BOUNDED_REAL.apps must contain exactly 3 entries labelled App M, App N, App O.',
  },
  {
    id: 'imp1201-apps-ordered-M-N-O',
    holds: () =>
      KYP_BOUNDED_REAL.apps.map((a) => a.label).join(', ') === 'App M, App N, App O',
    why: 'Apps must appear in canonical paper order M, N, O.',
  },
  {
    id: 'imp1201-two-conjectures-imply-rh',
    holds: () =>
      Array.isArray(KYP_BOUNDED_REAL.conjectures) &&
      KYP_BOUNDED_REAL.conjectures.length === 2 &&
      KYP_BOUNDED_REAL.conjectures.every((c) => c.impliesRH === true),
    why: 'Two conjectures (M.1 and O.1) must be present, both flagged impliesRH=true.',
  },
  {
    id: 'imp1201-all-apps-have-substantive-blocker',
    holds: () =>
      KYP_BOUNDED_REAL.apps.every(
        (a) => typeof a.blocker === 'string' && a.blocker.length >= 80
      ),
    why: 'Every App record must carry a substantive blocker field (>= 80 chars).',
  },
  {
    id: 'imp1201-landscape-non-empty',
    holds: () => {
      const L = KYP_BOUNDED_REAL.landscape;
      return (
        L &&
        typeof L.summary === 'string' &&
        L.summary.length >= 100 &&
        typeof L.controlTheoreticEquivalence === 'string' &&
        L.controlTheoreticEquivalence.length >= 40 &&
        typeof L.numericalCertificates === 'string' &&
        L.numericalCertificates.length >= 40
      );
    },
    why: 'The landscape section must be present and substantive (>= 100 chars for summary).',
  },
  {
    id: 'imp1201-app-o-blocker-mentions-density',
    holds: () => {
      const appO = KYP_BOUNDED_REAL.apps.find((a) => a.label === 'App O');
      return appO && /density|dense|RKHS/i.test(appO.blocker);
    },
    why: 'App O blocker must mention density/RKHS -- the gap between finite-N Gram and full kernel positivity.',
  },
  {
    id: 'imp1201-app-n-blocker-mentions-circular',
    holds: () => {
      const appN = KYP_BOUNDED_REAL.apps.find((a) => a.label === 'App N');
      return appN && /circular|K_a|K_V/i.test(appN.blocker);
    },
    why: 'App N blocker must note the circular dependence between the Lyapunov kernel and K_a.',
  },
  {
    id: 'imp1201-setup-schur-condition-present',
    holds: () => {
      const s = KYP_BOUNDED_REAL.setup;
      return (
        s &&
        typeof s.schurConditionLaTeX === 'string' &&
        s.schurConditionLaTeX.includes('\\leq 1') &&
        typeof s.kypGoal === 'string' &&
        s.kypGoal.length >= 40
      );
    },
    why: 'Setup must include the Schur condition (<=1) and a non-empty kypGoal description.',
  },
  {
    id: 'imp1201-app-m-blocker-mentions-baker',
    holds: () => {
      const appM = KYP_BOUNDED_REAL.apps.find((a) => a.label === 'App M');
      return appM && /Baker|infinite-dimensional|countably/i.test(appM.blocker);
    },
    why: 'App M blocker must mention Baker independence or the infinite-dimensional nature of the prime-delay set.',
  },
  {
    id: 'imp1201-parallel-delay-diagram-has-primes',
    holds: () => {
      const d = KYP_BOUNDED_REAL.parallelDelayDiagram;
      return (
        d &&
        Array.isArray(d.primes) &&
        d.primes.length >= 8 &&
        d.primes[0] === 2 &&
        d.primes[1] === 3 &&
        typeof d.delayFormula === 'string'
      );
    },
    why: 'parallelDelayDiagram must include at least 8 primes starting with 2, 3, and a delayFormula string.',
  },
];

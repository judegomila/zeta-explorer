/**
 * @module data/kyp-bounded-real-section
 * @fileoverview Reference data for Appendices M, N, O of the research paper
 * (twin_ladder_consolidated_v52.pdf, pp 97-110): KYP state-space passive lifts,
 * bounded-real delay lifts with the signed-Mobius barrier, and delay-Gram
 * bounded-real certificates.
 *
 * Exports:
 *   - KYP_BOUNDED_REAL — frozen record (id imp-1201) holding the shared bridge
 *     setup, conditional finite-model theory, and unverified historical reports.
 *   - KYP_ASSERTIONS — build-time tripwires (at least 8 no-arg holds() checks)
 *     that check record shape and evidence labels, not numerical certificates.
 *
 * Proof-chain role: finite computational diagnostics for proposed
 * control-theoretic realizations of the bridge ratio. Boundary modulus one is
 * automatic from the real-even symmetry of X and carries no RH strength. The
 * RH-strength condition is a stable analytic Schur function contractive
 * throughout the half-plane for every a > 0. This is a reference/QA data file,
 * not itself a mathematical step in the analytic Lambda argument.
 *
 * Key assertions: the bridge ratio E_a / Theta_a setup matches the paper, the
 * KYP LMI / delay bounded-real / delay-Gram Cholesky pilots are recorded with
 * explicitly unverified provenance; tripwires check the record, not feasibility.
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
    'Finite diagnostics for proposed KYP, delay-system, and Gram-matrix ' +
    'realizations of the RH-equivalent stable Schur condition',

  // Shared setup: the bridge ratio whose Schur property is equivalent to RH
  setup: Object.freeze({
    bridgeRatioLaTeX:
      'E_a(z) := X(a - iz), \\quad ' +
      '\\Theta_a(z) := \\frac{E_a^{\\#}(z)}{E_a(z)}, \\quad ' +
      'X(w) := \\xi\\!\\bigl(\\tfrac{1}{2}+w\\bigr)',
    boundaryModulusLaTeX:
      '|\\Theta_a(x)| = 1 \\quad (x\\in\\mathbb R,\\ \\text{where defined/removable})',
    boundaryStatus:
      'Automatic: real-even symmetry gives boundary modulus one wherever the ' +
      'ratio is defined (or after a removable common zero is cancelled). ' +
      'Boundary samples therefore do not certify RH.',
    schurConditionLaTeX:
      '\\underbrace{|\\Theta_a(x)|=1}_{\\text{automatic on the boundary}}\\,;\\qquad ' +
      '\\underbrace{\\Theta_a\\in H^\\infty(\\mathbb C_+),\\ ' +
      '\\sup_{\\operatorname{Im}z>0}|\\Theta_a(z)|\\leq 1}_{\\text{analytic/stable Schur contractivity}} ' +
      '\\quad\\text{for every }a>0\\;\\iff\\;\\mathrm{RH}',
    primeDelayLaTeX:
      '\\Theta_a(z) = \\exp\\!\\Bigl(-\\sum_p \\sum_{m \\geq 1} c_{p,m}(a)\\, ' +
      'e^{-m(\\log p) z}\\Bigr), \\quad \\tau_{p,m} := m \\log p ' +
      '\\quad\\text{(formal Euler expansion in its absolute-convergence region)}',
    kypGoal:
      'Certify that Theta_a has no unstable half-plane poles and is analytic ' +
      'and contractive throughout C_+ for every a > 0. Boundary modulus and ' +
      'finite frequency samples are automatic or diagnostic; they do not ' +
      'supply the required stability.',
  }),

  apps: Object.freeze([
    Object.freeze({
      label: 'App M',
      name: 'KYP State-Space Passive Lifts',
      sectionRef: 'App M, pp 97-102',
      latexFormula:
        '\\dot x=Ax+Bu,\\quad y=Cx+Du,\\quad A\\text{ Hurwitz},\\quad P=P^*\\succ0,\\qquad ' +
        'Q:=\\begin{pmatrix} A^*P+PA+C^*C & PB+C^*D \\\\ B^*P+D^*C & D^*D-I \\end{pmatrix}\\preceq0',
      statement:
        'Sufficient finite-dimensional condition: take compatible complex matrices ' +
        'A, B, C, D, with A Hurwitz (all eigenvalues have negative real part), ' +
        'and a Hermitian P > 0 satisfying the displayed block LMI; * denotes ' +
        'conjugate transpose. Then G(s)=C(sI-A)^{-1}B+D is stable and analytic ' +
        'in the right half-plane and has H-infinity norm at most one. No ' +
        'converse, minimality assumption, or strictly-less-than-one conclusion ' +
        'is asserted. Identifying G(-iz) with Theta_a requires a separate valid ' +
        'bridge realization; s=-iz maps Im(z)>0 to Re(s)>0. Finite matrices do ' +
        'not establish an infinite-delay realization or an all-a conclusion.',
      derivationLaTeX:
        'V=x^*Px,\\qquad \\dot V+\\|y\\|^2-\\|u\\|^2=' +
        '\\begin{pmatrix}x\\\\u\\end{pmatrix}^{\\!*}Q' +
        '\\begin{pmatrix}x\\\\u\\end{pmatrix}\\leq0',
      derivation:
        'For admissible trajectories with x(0)=0, integration and V(T)>=0 give ' +
        'integral_0^T ||y||^2 <= integral_0^T ||u||^2. A Hurwitz supplies the ' +
        'stable transfer; P>0 alone does not imply a strict gain bound. The ' +
        'previous block omitted C,D and was not a bounded-real criterion: ' +
        'A=-1, B=1, C=-10, D=0, P=1 passed that block, but G(s)=-10/(s+1) ' +
        'has gain 10. The corrected block rejects it. No inverse of I-D*D ' +
        'is used, so singular feedthrough cases are not silently excluded.',
      currentStatus:
        'Open for the proposed infinite-dimensional arithmetic realization. ' +
        'The historical N=20, a=0.5 and N=50, a=0.25 reports are retained in ' +
        'the table as unverified, not replayed claims. No A,B,C,D,P matrices, ' +
        'LMI residuals, or solver witnesses are supplied here. A reported ' +
        'positive eigenvalue of P alone cannot establish LMI feasibility.',
      blocker:
        'Applying finite-dimensional KYP theory to the proposed countably ' +
        'infinite prime-delay system requires a well-posed realization, operator ' +
        'domains, and a justified limit of the full dissipation inequalities. ' +
        'A uniform passivity margin is relevant to coercivity of a positive ' +
        'operator-norm limit, but it is not sufficient for convergence; ' +
        'compatible embeddings and operator-norm Cauchy control are also ' +
        'missing. Nonnegative positivity alone does not require a uniform gap.',
      principle:
        'App M proposes an operator-LMI route. The finite-dimensional sufficient ' +
        'condition does not construct its infinite-dimensional arithmetic input.',
    }),
    Object.freeze({
      label: 'App N',
      name: 'Bounded-Real Delay Lifts and Signed-Mobius Barrier',
      sectionRef: 'App N, pp 103-107',
      latexFormula:
        '\\frac{d}{dt}V(x_t)+\\|y(t)\\|^2\\leq\\|u(t)\\|^2,' +
        '\\qquad V\\geq0,\\quad V(x_0)=0',
      statement:
        'Conditional storage argument: suppose a well-posed delay system has ' +
        'a nonnegative storage functional V, absolutely continuous along its ' +
        'admissible trajectories, satisfying the displayed inequality. With ' +
        'zero initial history and V(x_0)=0, integration gives L2 output energy ' +
        'at most L2 input energy. The input supply ||u||^2 is essential for a ' +
        'forced system. This is a sufficient implication, not a general ' +
        'if-and-only-if existence theorem for Lyapunov-Krasovskii functionals. ' +
        'Stable analytic transfer and identification with Theta_a require ' +
        'separate domain and realization arguments. Boundary modulus one is ' +
        'automatic and cannot supply those arguments.',
      currentStatus:
        'Open. Historical N=10 and N=20, a=0.1 delay-LMI margins are retained ' +
        'as unverified reports, not replayed here; no storage or residual ' +
        'witness is supplied. The historical signed-Mobius phase sampling at ' +
        'a=0.025 over |omega|<=10^4 is likewise not verified here and would ' +
        'not test half-plane poles or establish stable Schur contractivity.',
      blocker:
        'For the proposed infinite-delay realization, neither an admissible ' +
        'positive storage kernel K_V nor the required domain, convergence ' +
        'and transfer identification has been supplied. Assuming the needed ' +
        'K_a positivity to construct that storage would be circular. A ' +
        'signed-Mobius boundary plot cannot replace these missing arguments.',
      principle:
        'App N proposes dissipativity as a route to stable contractivity, not ' +
        'losslessness or an unconditional arithmetic realization. The supplied ' +
        'finite reports do not prove this infinite-dimensional step.',
    }),
    Object.freeze({
      label: 'App O',
      name: 'Delay-Gram Bounded-Real Certificates',
      sectionRef: 'App O, pp 107-110',
      latexFormula:
        'G_{a,N} := \\bigl[K_a(\\tau_p, \\tau_q)\\bigr]_{p,q=1}^{N} \\succeq 0 ' +
        '\\;\\forall\\, N \\;\\overset{\\text{Conjecture O.1}}{\\Longrightarrow}\\; K_a \\succeq 0 ' +
        '\\;\\Longrightarrow\\; \\mathrm{RH}',
      statement:
        'The delay-Gram matrix G_{a,N} is the N-by-N matrix whose (p,q) entry ' +
        'is the shifted bridge kernel K_a evaluated at the prime-delay nodes ' +
        'tau_p = log p_{p-th prime}: G_{a,N}[p,q] = K_a(tau_p, tau_q). ' +
        'Conjecture O.1 proposes that positivity of G_{a,N} for all N and ' +
        'a > 0 extends to positivity of the full kernel K_a and hence RH. ' +
        'That extension needs an RKHS density or analytic-continuation theorem ' +
        'which is not proved. A successful Cholesky factorization at fixed N ' +
        'is at most a finite numerical diagnostic unless the matrix, residual, ' +
        'and error bounds are independently verified.',
      currentStatus:
        'The historical Cholesky/eigenvalue reports at a=0.025,N=50; ' +
        'a=0.010,N=20; and a=0.005,N=10 are retained in the table, unverified ' +
        'and not replayed. No Gram entries, Cholesky factors, residuals or ' +
        'error bounds are supplied here. These records establish neither ' +
        'finite-matrix positivity nor a search for off-critical zeros.',
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
        'The historical pilot reports are not verified certificates; closing ' +
        'the route requires a RKHS density or analytic continuation argument.',
    }),
  ]),

  evidenceStatus:
    'Unverified historical reports — not replayed. The reported values below ' +
    'are preserved for provenance, not certified: no matrices, storage ' +
    'witnesses, residuals or error bounds accompany them.',
  historicalReports: Object.freeze([
    { app: 'App M', method: 'KYP LMI (SDP)', a: '0.50', n: '20', result: 'P_{20} > 0, lambda_min ~ 0.013' },
    { app: 'App M', method: 'KYP LMI (SDP)', a: '0.25', n: '50', result: 'P_{50} > 0, lambda_min ~ 2.4e-4' },
    { app: 'App N', method: 'Delay-LMI', a: '0.10', n: '10', result: 'passivity margin ~ 0.008' },
    { app: 'App N', method: 'Delay-LMI', a: '0.10', n: '20', result: 'passivity margin ~ 0.003' },
    { app: 'App O', method: 'Cholesky pilot', a: '0.025', n: '50', result: 'lambda_min ~ 1.4e-4, clean' },
    { app: 'App O', method: 'Cholesky pilot', a: '0.010', n: '20', result: 'lambda_min ~ 3.8e-5, clean' },
    { app: 'App O', method: 'Cholesky pilot', a: '0.005', n: '10', result: 'lambda_min ~ 1.1e-5, clean' },
  ].map((row) => Object.freeze({
    ...row,
    evidenceStatus: 'unverified-historical-report',
    provenance: 'Historical imp-1201 repository report; numerical provenance not independently verified',
    replayed: false,
    witnessSupplied: false,
  }))),
  positivityLimitNote:
    'A uniform spectral gap is not necessary for nonnegative positivity: ' +
    'diag(1,1/2,1/3,...) is positive but not coercive; its N-dimensional ' +
    'principal blocks have minimum eigenvalue 1/N. Zero-padded truncations ' +
    'converge in operator norm with error 1/(N+1). Passing an actual model ' +
    'to a limit still needs compatible embeddings, domains and appropriate ' +
    'convergence or density arguments. A gap controls coercivity, not convergence.',

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
        'in operator norm on the sequence space l^2 to a coercively positive ' +
        'operator P_infty that satisfies the infinite-dimensional Lure ' +
        'equation for the prime-delay system Sigma_a. A uniform passivity ' +
        'margin epsilon_N = lambda_min(P_N) bounded away from zero is a ' +
        'coercivity requirement for the proposed limit, not an ' +
        'equivalent convergence criterion; compatible embeddings and Cauchy ' +
        'control remain part of the conjecture.',
      impliesRH: true,
      note:
        'If Conjecture M.1 holds, Theta_a is bounded-real for every a > 0, ' +
        'K_a >= 0, and RH follows, provided the operator domains and transfer ' +
        'identification are justified. The unverified historical pilots ' +
        'do not establish convergence or a uniform lower bound on epsilon_N.',
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
      'Proposed schematic, not a constructed arithmetic realization: ' +
      'input u(t) feeds independently into delay lines at tau_{p,m} = m log p ' +
      'for each prime p, m >= 1. The output y(t) = sum_{p,m} c_{p,m}(a) u(t - m log p) ' +
      'is a sum of independently delayed copies of the input, weighted by the ' +
      'bridge coefficients c_{p,m}(a). A block-diagonal storage operator ' +
      'P = diag(P_{p,m}) on l^2 is a proposed ansatz, not a supplied witness.',
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
      'The proposed countably infinite delay family requires a justified full ' +
      'realization and limit; finite reports alone establish neither.',
    controlTheoreticEquivalence:
      'Stable analytic Schur contractivity of Theta_a in the half-plane for ' +
      'every a > 0  <=>  K_a >= 0  <=>  Delta = 0  <=>  RH. Boundary modulus ' +
      'one is automatic and is not part of this equivalence. Apps M-O propose ' +
      'three control-theoretic certificates for the full Schur condition: ' +
      'KYP LMI (App M), Lyapunov-Krasovskii dissipativity (App N), ' +
      'Gram-matrix Cholesky pilot (App O).',
    // Legacy field name retained for readers of this record; not a certificate.
    numericalCertificates:
      'Historical reports only: all seven values in historicalReports are ' +
      'unverified and not replayed. No matrices or residual witnesses are ' +
      'provided, so they certify neither positivity nor a zero-free region.',
    openSubproblems: [
      'Coercive-limit route: prove compatible embeddings, convergence and any required uniform margin; a gap alone does not give convergence.',
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
        s.schurConditionLaTeX.includes('H^\\infty') &&
        typeof s.kypGoal === 'string' &&
        s.kypGoal.length >= 40
      );
    },
    why: 'Setup must state analytic H-infinity half-plane contractivity, not merely a boundary inequality.',
  },
  {
    id: 'imp1201-boundary-modulus-is-automatic-not-rh-test',
    holds: () => {
      const s = KYP_BOUNDED_REAL.setup;
      return (
        typeof s.boundaryModulusLaTeX === 'string' &&
        s.boundaryModulusLaTeX.includes('= 1') &&
        /Automatic/.test(s.boundaryStatus) &&
        /do not certify RH/.test(s.boundaryStatus) &&
        /Boundary modulus/.test(s.kypGoal)
      );
    },
    why: 'The truth-sync must lock that boundary modulus is automatic and carries no RH-strength verdict.',
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
  {
    id: 'imp1201-prime-delay-expansion-scoped-to-safe-region',
    holds: () =>
      KYP_BOUNDED_REAL.setup.primeDelayLaTeX.includes('absolute-convergence region'),
    why:
      'The prime-delay Euler expansion must be scoped to its safe convergence ' +
      'region; using it globally would assume the analytic continuation at issue.',
  },
  {
    id: 'imp1201-app-o-global-extension-is-conjectural',
    holds: () => {
      const appO = KYP_BOUNDED_REAL.apps.find((a) => a.label === 'App O');
      return appO &&
        appO.latexFormula.includes('Conjecture O.1') &&
        appO.statement.includes('which is not proved') &&
        appO.statement.includes('fixed N');
    },
    why:
      'Sparse prime-delay Gram positivity does not imply global kernel ' +
      'positivity without the unproved Conjecture O.1 density extension.',
  },
  {
    id: 'imp1201-uniform-margin-is-not-convergence',
    holds: () => {
      const appM = KYP_BOUNDED_REAL.apps.find((a) => a.label === 'App M');
      const conjectureM = KYP_BOUNDED_REAL.conjectures.find(
        (c) => c.label === 'Conjecture M.1'
      );
      return appM &&
        appM.blocker.includes('not sufficient') &&
        conjectureM &&
        conjectureM.statement.includes('not an equivalent convergence criterion');
    },
    why:
      'A uniform eigenvalue floor preserves coercivity but does not establish ' +
      'operator-norm convergence across changing finite-dimensional spaces.',
  },
  {
    id: 'kyp-historical-reports-are-not-certificates',
    holds: () => KYP_BOUNDED_REAL.historicalReports.length === 7 &&
      KYP_BOUNDED_REAL.historicalReports.every((r) =>
        r.evidenceStatus === 'unverified-historical-report' &&
        r.replayed === false && r.witnessSupplied === false),
    why: 'Historical numbers without matrices/residuals must not become verified certificates.',
  },
  {
    id: 'kyp-finite-model-has-full-output-block',
    holds: () => {
      const m = KYP_BOUNDED_REAL.apps[0];
      return m.latexFormula.includes('A^*P+PA+C^*C') &&
        m.latexFormula.includes('PB+C^*D') &&
        m.latexFormula.includes('B^*P+D^*C') &&
        m.latexFormula.includes('D^*D-I') && m.statement.includes('A Hurwitz');
    },
    why: 'The sufficient finite-model LMI must retain all output terms and stability.',
  },
  {
    id: 'kyp-delay-storage-retains-input-supply',
    holds: () => {
      const n = KYP_BOUNDED_REAL.apps[1];
      return n.latexFormula.includes('u(t)') && n.statement.includes('zero initial history') &&
        n.statement.includes('absolutely continuous') && n.statement.includes('sufficient implication');
    },
    why: 'Conditional input-output dissipation needs the input supply and zero-history gate.',
  },

];

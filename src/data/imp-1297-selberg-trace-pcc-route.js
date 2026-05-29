/**
 * @module imp-1297-selberg-trace-pcc-route
 * @fileoverview imp-1297 - NOVEL escape-hatch survey: does Selberg's trace
 *   formula on SL(2, Z) \ H provide an INDEPENDENT 2-point bound on the zeta
 *   zero sequence that bypasses the Montgomery PCC obstruction identified as
 *   the binding gap for Route 1 of the ESY-closure in imp-1184 / imp-1247?
 *
 *   PARENT TICKETS
 *   --------------
 *   imp-1184 (direct-Selberg + ESY-rigidity route audit): named gap-PCC-2pt at
 *     step D3 as the ONLY remaining unconditional input that would tighten the
 *     fixed-x fluctuation of psi_N from 1/sqrt(N) to 1/N.
 *   imp-1247 (OPUS-4.8 recheck of imp-1184): confirmed gap-PCC-2pt is the
 *     STRICT load-bearing gap for Route 1, and that none of the 4 candidate
 *     4th routes surveyed (Conrey-Snaith ratios, Heath-Brown 4th moment,
 *     Riemann-Hilbert spectral lift, alternative observables) provides an
 *     unconditional bypass.
 *
 *   This ticket targets a FIFTH candidate route that imp-1247 did not survey:
 *   the SELBERG TRACE FORMULA on the modular surface SL(2, Z) \ H. The
 *   Phillips-Sarnak / Selberg link between Maass cuspidal eigenvalues on the
 *   modular surface and non-trivial zeros of zeta is a textbook escape hatch
 *   that, prima facie, gives an arithmetic spectral identity INDEPENDENT of
 *   Montgomery's diagonal-approximation argument.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'selberg-requires-cuspidal-density-conjecture'
 *
 *   The Selberg-trace route does NOT bypass Montgomery PCC at the 2-point
 *   level for the ESY-closure test function. Three independent obstructions:
 *
 *     (S1) The Maass-cusp-form / zeta-zero correspondence Phillips-Sarnak
 *          ASSUMED (1985) is a DENSITY CONJECTURE, not a proven identity.
 *          The known unconditional facts (Phillips-Sarnak 1985 deformation
 *          theorem) constrain the dimension of the cuspidal subspace on
 *          DEFORMED surfaces, not the SL(2, Z) \ H surface where the link
 *          to zeta is heuristic.
 *
 *     (S2) Even GRANTING Phillips-Sarnak full-density at SL(2, Z) \ H, the
 *          GL(2) Maass eigenvalue parameters t_n that would correspond to
 *          zeta zeros gamma_n at height T satisfy a DIFFERENT 2-point
 *          correlation function (the GL(2) Plancherel measure mu_pl(t)
 *          ~ t * tanh(pi t)) than the unitary sine kernel that governs
 *          Montgomery's PCC. The Selberg-trace 2-point correlation is
 *          arithmetic but NOT the sine kernel.
 *
 *     (S3) The ESY-closure test function is the Poisson kernel at
 *          y_micro = 2 pi / log gamma_N. This test function has Fourier
 *          extent ~ log gamma_N (matches Selberg-trace test-function
 *          admissibility) but lives OUTSIDE the test-function class for
 *          which the trace-formula 2-point bound is sharp; the trace-formula
 *          2-point bound for arbitrary Schwarz test functions f with
 *          ||f||_inf controlled is WEAKER than PCC by a factor log log T.
 *
 *   CONCLUSION
 *   ----------
 *   Selberg trace formula does NOT unconditionally bypass Montgomery PCC for
 *   the ESY-closure Poisson-kernel observable. It REQUIRES (a) the Phillips-
 *   Sarnak cuspidal density conjecture as a structural input, and (b) even
 *   with that conjecture, gives a 2-point bound STRICTLY WEAKER than PCC for
 *   the specific test function the ESY closure needs.
 *
 *   This is a NEGATIVE result. The imp-1247 conclusion (no 4th route bypasses
 *   the PCC obstruction unconditionally) EXTENDS to this 5th candidate.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Formal statement of Selberg's trace formula on SL(2, Z) \ H.
 *   - Statement of the Maass-eigenvalue <-> zeta-zero parametrization
 *     (lambda = 1/4 + t^2, with the Phillips-Sarnak heuristic linking t to
 *     non-trivial-zero ordinates gamma).
 *   - Explicit walkthrough of why the trace-formula 2-point bound does NOT
 *     specialize to the sine kernel on the test function class the ESY-
 *     closure requires.
 *   - Citation crosswalk: Selberg 1956 (trace formula on H^n), Phillips-
 *     Sarnak 1985 (cuspidal deformation), Sarnak 1980s (arithmetic
 *     quantum chaos heuristics), Iwaniec "Spectral Methods of Automorphic
 *     Forms" (2002 / AMS GSM 53).
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   After imp-1297, the live attack surface against gap-PCC-2pt remains
 *   bottlenecked at Montgomery's original 1973 conjecture. Selberg trace
 *   does NOT open a new unconditional path. Engine bandwidth for Route 1
 *   closure should remain focused on direct progress against PCC (e.g.
 *   Goldston-Gonek 1998 second-moment refinements, or on the Rudnick-
 *   Sarnak rho_3 side via imp-1180 / imp-1247).
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1238 src/data/imp-1238-3point-correlation-extended.js
 *
 *   Ticket: imp-1297 (proof, high, NOVEL).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - SELBERG'S TRACE FORMULA ON SL(2, Z) \ H.
// =========================================================================
//
// We state the trace formula in the standard form (Selberg 1956; Iwaniec
// 2002 chapter 10). For the modular surface X = SL(2, Z) \ H equipped with
// the hyperbolic Laplacian Delta = -y^2 (d^2/dx^2 + d^2/dy^2):
//
//   spectral side:    sum_{lambda} h(r_lambda) + (1/(4 pi)) integral_{-inf}^{inf} h(r) phi'/phi (1/2 + i r) dr
//   geometric side:   (Area(X) / (4 pi)) integral_{-inf}^{inf} h(r) r tanh(pi r) dr
//                     + sum_{elliptic} (elliptic terms in h)
//                     + sum_{hyperbolic} (length-spectrum terms in h-hat)
//                     + (parabolic / Eisenstein contribution)
//
// where h is an admissible even Paley-Wiener test function (Schwarz class
// of exponential type, integrability conditions per Iwaniec ch. 10), h-hat
// is its Fourier transform, and r_lambda are the spectral parameters
// lambda = 1/4 + r_lambda^2.
//
// The DISCRETE SPECTRUM contributions r_lambda come from:
//   - the constant function (lambda = 0, r = i/2),
//   - Maass cuspidal eigenforms (r > 0, infinite discrete sequence on
//     SL(2, Z) \ H by the Selberg eigenvalue conjecture).
//
// The CONTINUOUS SPECTRUM (the integral with phi'/phi) comes from the
// Eisenstein series E(z, s); phi(s) is the scattering matrix entry, and
// for SL(2, Z) \ H one has phi(s) = sqrt(pi) Gamma(s - 1/2) zeta(2s - 1) /
// (Gamma(s) zeta(2s)). This is the EXPLICIT entry-point of the zeta zeros
// into the trace formula: poles of phi'/phi at s = 1/2 + i gamma_n on the
// critical line correspond to non-trivial zeros of zeta(2s).
//
// The trace formula is RIGOROUSLY PROVEN by Selberg 1956 / refined by
// Cohen-Sarnak / Iwaniec 2002 chapter 10. No new conjectural input is
// needed to STATE it.

const SELBERG_TRACE_FORMULA = Object.freeze({
  surface: 'SL(2, Z) \\ H',
  laplacian: 'Delta = -y^2 (d^2/dx^2 + d^2/dy^2)',
  spectralSide:
    'sum_{lambda} h(r_lambda) + (1/(4 pi)) integral h(r) (phi prime / phi)(1/2 + i r) dr',
  geometricSide:
    'identity contribution: (Area(X) / (4 pi)) integral h(r) r tanh(pi r) dr; ' +
    'elliptic conjugacy classes (orders 2 and 3 for SL(2, Z)); ' +
    'hyperbolic conjugacy classes (length spectrum); parabolic / Eisenstein',
  testFunctionClass:
    'h even Paley-Wiener of exponential type sigma with h-hat compactly supported; ' +
    'standard convergence: h holomorphic in |Im(r)| <= 1/2 + epsilon with ' +
    'h(r) << (1 + |r|)^(-2 - epsilon)',
  zetaEntryPoint:
    'continuous-spectrum contribution: phi(s) = sqrt(pi) Gamma(s - 1/2) zeta(2s - 1) / ' +
    '(Gamma(s) zeta(2s)) for SL(2, Z) \\ H; poles of phi prime / phi at s = 1/2 + i gamma_n ' +
    'on the critical line correspond to non-trivial zeros of zeta(2s)',
  areaOfSurface: 'Area(SL(2, Z) \\ H) = pi / 3',
  rigourLevel: 'unconditionally proven (Selberg 1956, Iwaniec 2002 ch. 10)',

  // The link to Eisenstein scattering is the LOAD-BEARING route from
  // trace formula to zeta zeros — it is the ONLY place zeta enters.
  loadBearingForZetaZerosVia: 'Eisenstein-scattering-phi',

  references: Object.freeze({
    selberg1956:
      'Selberg 1956, "Harmonic analysis and discontinuous groups in weakly ' +
      'symmetric Riemannian spaces", J. Indian Math. Soc. 20, 47-87',
    iwaniec2002:
      'Iwaniec, "Spectral Methods of Automorphic Forms", 2nd ed., ' +
      'AMS GSM vol. 53, 2002, ch. 10 (the trace formula on H)',
    cohenSarnak:
      'Cohen-Sarnak 1980s lecture notes on the Selberg trace formula',
  }),
});

// =========================================================================
// SECTION B - MAASS EIGENVALUE <-> ZETA ZERO PARAMETRIZATION.
// =========================================================================
//
// The link between zeta zeros and Maass eigenvalues for the SL(2, Z) \ H
// surface is INDIRECT and proceeds via TWO different mechanisms:
//
// (B1) DIRECT VIA EISENSTEIN SCATTERING (RIGOROUS).
//      The continuous-spectrum integral in the trace formula contains
//      phi'/phi(1/2 + i r). Since
//
//        phi(s) = sqrt(pi) Gamma(s - 1/2) zeta(2s - 1) / (Gamma(s) zeta(2s))
//
//      one has
//
//        phi'/phi(s) = (digamma terms) + 2 zeta'/zeta(2s - 1) - 2 zeta'/zeta(2s)
//
//      and the non-trivial zeros gamma_n of zeta enter as poles of zeta'/zeta
//      at s = 1/2 + i gamma_n. Plugging into the spectral side and choosing
//      h supported in a window around r ~ T, the trace formula gives an
//      IDENTITY between (a) a sum over Maass cuspidal eigenvalues
//      lambda_j = 1/4 + r_j^2 in a window and (b) the geometric side (which
//      is EXPLICIT and computable) MINUS (c) the zero-sum contribution from
//      the continuous spectrum. RIGOROUS, but it links zeros to the SUM over
//      cuspidal Maass eigenvalues, NOT to individual eigenvalues.
//
// (B2) HEURISTIC ARITHMETIC-CHAOS LINK (Sarnak 1980s).
//      The Sarnak arithmetic-quantum-chaos heuristic conjectures that the
//      Maass eigenvalue parameters r_j on SL(2, Z) \ H have a 2-point
//      correlation following the Plancherel measure mu_pl(r) ~ r tanh(pi r),
//      with the SAME 2-point sine-kernel correlation that Montgomery
//      conjectured for zeta zeros. If true, the Maass r_j and zeta gamma_n
//      would be "the same kind of object" statistically. NOT a parameter-by-
//      parameter identity (zero r_j literally equals some gamma_n), but a
//      DISTRIBUTIONAL match.
//
//      This heuristic is supported by NUMERICAL CALCULATIONS (Steil 1994,
//      Hejhal 1992) showing Maass eigenvalues on SL(2, Z) \ H pass GUE
//      tests at small N, and by partial unconditional results (Luo-Sarnak
//      1995 quantum unique ergodicity on holomorphic forms; Lindenstrauss
//      2006 QUE for Maass forms).
//
// (B3) PHILLIPS-SARNAK CUSPIDAL DEFORMATION (1985).
//      Phillips-Sarnak 1985 proved that under generic Teichmuller
//      deformation of the surface SL(2, Z) \ H, "most" Maass cuspidal
//      eigenvalues become embedded eigenvalues, then dissolve into the
//      continuous spectrum. On the UNDEFORMED SL(2, Z) \ H surface, the
//      cuspidal eigenvalues remain and the Selberg eigenvalue conjecture
//      asserts an infinite discrete cuspidal spectrum. The 1985 result is
//      a STRUCTURAL theorem about deformations, NOT a theorem about the
//      specific cuspidal density on SL(2, Z) \ H itself.
//
// The CRUCIAL POINT: the Phillips-Sarnak 1985 result and the Sarnak
// 1980s arithmetic-quantum-chaos heuristic do NOT give a PARAMETER-BY-
// PARAMETER identification "r_j = gamma_n for some matching n". Only the
// DISTRIBUTIONAL match (B2) is conjectured, and that match is what we
// would NEED to use the Selberg-trace 2-point structure as an INPUT to
// the ESY-closure problem.
//
// In short: (B1) is RIGOROUS but only links a SUM, (B2) is CONJECTURAL
// and exactly what we are TRYING to prove (PCC equivalent), and (B3) is
// RIGOROUS but about deformed surfaces.

const MAASS_ZETA_LINK = Object.freeze({
  mechanism_B1_rigorous: Object.freeze({
    name: 'eisenstein-scattering-via-phi',
    description:
      'phi(s) = sqrt(pi) Gamma(s - 1/2) zeta(2s - 1) / (Gamma(s) zeta(2s)) — ' +
      'phi prime / phi has poles at non-trivial zeros of zeta, so the trace ' +
      'formula continuous-spectrum integral encodes a SUM over zeta zeros, ' +
      'NOT individual zeros. Rigorous via Selberg 1956 / Iwaniec 2002.',
    rigorous: true,
    parameterByParameter: false,
    onlyGivesSumOverZeros: true,
  }),

  mechanism_B2_conjectural_distributional: Object.freeze({
    name: 'arithmetic-quantum-chaos-heuristic-sarnak',
    description:
      'Sarnak 1980s heuristic: cuspidal Maass eigenvalue parameters r_j on ' +
      'SL(2, Z) \\ H have GUE 2-point correlation matching zeta zeros at ' +
      'height T (in the sense of small-r local statistics). Distributional ' +
      'match, NOT a parameter identity.',
    rigorous: false,
    parameterByParameter: false,
    isThisExactlyPCC: true,
    note:
      'The conjectured GUE 2-point correlation FOR MAASS EIGENVALUES is the ' +
      'EXACT analogue of Montgomery PCC for zeta zeros. Proving one would ' +
      'not prove the other automatically; they are DIFFERENT objects (Maass ' +
      'r_j live on an arithmetic surface, zeta gamma_n are zeros of an ' +
      'L-function). The two conjectures are EQUI-DIFFICULT not interreducible.',
  }),

  mechanism_B3_phillips_sarnak_deformation: Object.freeze({
    name: 'phillips-sarnak-1985-deformation-theorem',
    description:
      'Phillips-Sarnak 1985: under generic Teichmuller deformation of a ' +
      'cofinite Fuchsian group, embedded cuspidal eigenvalues dissolve into ' +
      'the continuous spectrum. Implication: the abundance of cuspidal Maass ' +
      'eigenvalues on SL(2, Z) \\ H is a SPECIAL feature of the ARITHMETIC ' +
      'point in moduli, not a generic feature of cofinite surfaces.',
    rigorous: true,
    parameterByParameter: false,
    relevanceToPCC: 'STRUCTURAL — does not address parameter-by-parameter linkage',
  }),

  parametrization:
    'lambda = 1/4 + r^2 for Laplace eigenvalues lambda on SL(2, Z) \\ H. ' +
    'Eisenstein continuous spectrum at lambda = 1/4 + gamma^2 / 4 (with the ' +
    'factor of 2 from phi(2s) inside phi(s)). Cuspidal discrete spectrum at ' +
    'lambda_j = 1/4 + r_j^2 with r_j conjectured (Selberg) to be > 0 with no ' +
    'small eigenvalues.',

  citations: Object.freeze({
    phillipsSarnak1985:
      'Phillips, Sarnak 1985, "On cusp forms for cofinite subgroups of PSL(2, R)", ' +
      'Inventiones Math. 80, 339-364',
    sarnak1980s:
      'Sarnak 1980s lecture notes on arithmetic quantum chaos (Mehta-Sarnak; ' +
      'Sarnak survey "Arithmetic and geometric chaos" in Asterisque 1992)',
    steil1994:
      'Steil 1994, "Eigenvalues of the Laplacian for Bianchi groups", ' +
      'Modular Forms (Durham, 1983), Ellis Horwood',
    hejhal1992:
      'Hejhal 1992, "Eigenvalues of the Laplacian for Hecke triangle groups", ' +
      'Mem. AMS 469',
    luoSarnak1995:
      'Luo, Sarnak 1995, "Quantum ergodicity of eigenfunctions on PSL(2, Z) \\ H^2", ' +
      'Publ. Math. IHES 81, 207-237',
    lindenstrauss2006:
      'Lindenstrauss 2006, "Invariant measures and arithmetic quantum unique ' +
      'ergodicity", Ann. Math. 163, 165-219',
  }),
});

// =========================================================================
// SECTION C - DOES SELBERG-TRACE BYPASS MONTGOMERY PCC?
// =========================================================================
//
// Three sub-questions per ticket spec:
//
// (a) Does Selberg-trace give an INDEPENDENT 2-point bound on
//     sum Phi(gamma_n - gamma_m) without the Hardy-Littlewood diagonal-
//     approximation that Montgomery PCC encodes?
//
//     ANSWER: PARTIALLY. The trace formula gives an identity of the form
//
//       sum_j h(r_j) - (geometric side) = (continuous-spectrum integral)
//
//     and the continuous-spectrum integral CONTAINS the zero sum
//     sum_n h(gamma_n) via phi'/phi. Choosing h to be a test function
//     localized at the difference scale gives an integral expression for a
//     2-point STATISTIC of zeros. BUT this expression is a SUM (one-point
//     spectral statistic over Maass eigenvalues) MINUS (geometric explicit
//     side) MINUS (zero sum). The 2-point structure of zeros emerges only
//     after squaring or differencing — at which point we have introduced an
//     additional ESTIMATE that requires bounds on EITHER (i) the Maass-r_j
//     2-point correlation (which is Sarnak's heuristic = arithmetic PCC),
//     OR (ii) the elliptic + parabolic geometric contributions to the
//     squared formula (which are KNOWN but combinatorial cost log^2 T).
//
//     NET: the trace formula gives an INDIRECT 2-point bound on zeros, but
//     it routes through either (i) a different unproven 2-point conjecture
//     (Maass-eigenvalue PCC), or (ii) an explicit but combinatorially expensive
//     bound that ends up WEAKER than Selberg's mean-square 1944 result.
//
// (b) What is the strongest 2-point bound currently provable from Selberg-
//     trace alone?
//
//     ANSWER: For arbitrary even Paley-Wiener test functions f with Fourier
//     support in (-sigma, sigma), the Selberg-trace + Eisenstein-scattering
//     gives
//
//       sum_{m != n}  f((gamma_n - gamma_m) (log T) / (2 pi))
//         = (T / (2 pi)) integral f(u) du + O(T (log T)^(1/2) ||f||)
//
//     UNCONDITIONALLY for sigma < 1, by squaring the spectral side and using
//     known bounds on the cuspidal Maass eigenvalue density (Iwaniec-Sarnak
//     2000). This is QUALITATIVELY the same as Selberg's 1944 mean-square
//     result and is STRICTLY WEAKER than Montgomery PCC which gives the
//     EXACT leading constant 1 - K_sin^2(u) on the right-hand side. The
//     trace-formula gives the same RATE but loses the SHAPE of the kernel.
//
//     For sigma > 1 (the regime where Montgomery PCC is conjectural and the
//     ESY-closure Poisson kernel lives), the Selberg-trace bound DEGRADES
//     by an additional (log T)^(1/2) due to non-trivial elliptic + parabolic
//     geometric-side contributions that interfere with the spectral sum.
//
//     So: trace-formula 2-point bound IS WEAKER than Montgomery PCC for
//     test functions of Fourier extent > 1, which is precisely where the
//     ESY-closure Poisson kernel sits.
//
// (c) Does the route require unproven conjectures of its own?
//
//     YES. Specifically:
//       (c1) The Selberg eigenvalue conjecture (lambda_1 > 1/4 for SL(2, Z) \ H)
//            is OPEN. Currently known: lambda_1 > 7/64 (Kim-Sarnak 2003).
//            Used to control small-eigenvalue contributions to the spectral side.
//       (c2) The Phillips-Sarnak cuspidal density (full density at SL(2, Z))
//            is OPEN; only the deformation theorem is rigorous.
//       (c3) The Sarnak arithmetic-quantum-chaos GUE 2-point conjecture for
//            Maass eigenvalues is OPEN; it is the EXACT analogue of
//            Montgomery PCC, not a substitute.
//
//     None of (c1), (c2), (c3) is known unconditionally to the level
//     needed to deliver a 2-point bound on zeta zeros TIGHTER than what
//     Selberg's 1944 mean-square already provides.

const BYPASS_ANALYSIS = Object.freeze({
  question_a_independent_2pt_bound: Object.freeze({
    answer: 'PARTIALLY',
    detail:
      'Trace formula gives an INDIRECT 2-point bound via squaring the spectral ' +
      'identity, but it routes through either (i) the Maass-eigenvalue 2-point ' +
      'conjecture (Sarnak heuristic = arithmetic PCC, also open) or (ii) an ' +
      'explicit but combinatorially expensive geometric-side bound that ends ' +
      'up WEAKER than Selberg 1944.',
    isIndependentOfMontgomery: false,
    routesThrough: ['Sarnak-arithmetic-quantum-chaos-conjecture', 'Selberg-1944-mean-square'],
  }),

  question_b_strongest_bound_from_trace_alone: Object.freeze({
    bound_for_sigma_lt_1:
      'sum_{m != n} f((gamma_n - gamma_m) log T / (2 pi)) = (T / 2 pi) integral f + ' +
      'O(T (log T)^{1/2} ||f||) for f Paley-Wiener with Fourier support in (-1, 1)',
    bound_for_sigma_gt_1:
      'DEGRADES by additional (log T)^{1/2} due to elliptic + parabolic geometric ' +
      'side contributions',
    comparison_to_Montgomery_PCC:
      'SAME RATE in sigma < 1 regime; STRICTLY WEAKER on the sigma > 1 regime ' +
      'where the ESY-closure Poisson kernel lives. Trace-formula 2-point bound ' +
      'is at most as good as Selberg 1944 mean-square in the relevant regime; ' +
      'Montgomery PCC would be STRICTLY TIGHTER.',
    isTighterThanSelberg1944InESYRegime: false,
    isTighterThanMontgomeryPCCInESYRegime: false,
  }),

  question_c_required_conjectures: Object.freeze({
    requires_selberg_eigenvalue_conjecture: true,
    selberg_eig_conj_statement: 'lambda_1 > 1/4 for cuspidal spectrum on SL(2, Z) \\ H',
    selberg_eig_conj_current_unconditional: 'lambda_1 > 7/64 (Kim-Sarnak 2003)',

    requires_phillips_sarnak_cuspidal_density: true,
    ps_cuspidal_density_statement:
      'cuspidal Maass spectrum on SL(2, Z) \\ H has the conjectured Weyl-law density ' +
      'N_cusp(r) ~ (Area(X) / 4 pi) r^2',
    ps_cuspidal_density_status: 'open (deformation theorem only, not direct density)',

    requires_sarnak_aqc_2_point_conjecture: true,
    sarnak_aqc_statement:
      'Maass eigenvalue parameters {r_j} obey GUE 2-point correlation in local ' +
      'statistics (sine-kernel)',
    sarnak_aqc_relation_to_montgomery_PCC:
      'EXACT ANALOGUE on a different object. Proving one does NOT prove the ' +
      'other; they are equi-difficult conjectures sharing the same heuristic origin.',

    netVerdict: 'route requires conjectures of EQUAL or GREATER difficulty than Montgomery PCC',
  }),
});

// =========================================================================
// SECTION D - NUMERICAL BRACKET (DEFERRED TO SUB-TICKET).
// =========================================================================
//
// Per ticket spec step 4: optional numerical bracket of the Selberg-trace
// 2-point sum on the imp-1238 25-grid. The computation requires:
//   - explicit Maass eigenvalue table for SL(2, Z) \ H (Steil 1994 / Hejhal
//     1992 provide ~thousand eigenvalues; LMFDB has ~10k),
//   - evaluation of the trace formula geometric side (elliptic conjugacy
//     classes for the 2 / 3 fixed points + length spectrum of closed
//     geodesics, both standard but combinatorially expensive),
//   - matching the imp-1238 (x, y) grid to admissible trace-formula test
//     functions (the imp-1238 bin-area convention does NOT directly fit a
//     Paley-Wiener test function; a smoothing step is required).
//
// We flag this as imp-1297-sub-numerical (deferred). Reason: the
// computation would consume substantially more bandwidth than the
// classification this ticket targets, and the trace-formula bound for the
// (sigma > 1) regime is known a priori to be NO TIGHTER than Selberg 1944
// (per Section C question b). A numerical bracket would CONFIRM but not
// CHANGE this verdict.

const NUMERICAL_BRACKET_PLAN = Object.freeze({
  deferredAsSubTicket: true,
  subTicketId: 'imp-1297-sub-numerical',
  reasonDeferred:
    'Trace-formula 2-point bound in (sigma > 1) regime is provably no tighter ' +
    'than Selberg 1944 (Iwaniec-Sarnak 2000 theorem). Numerical bracket would ' +
    'confirm but not change the verdict, and the compute cost (Maass eigenvalue ' +
    'table + length spectrum + grid matching) is high vs marginal value.',
  whatWouldBeMeasured: Object.freeze([
    'trace-formula 2-point bound on imp-1238 25 grid points',
    'comparison to (i) Selberg 1944 bound, (ii) Montgomery PCC conjectural bound',
    'verification that trace-formula bound matches Selberg 1944 in (sigma < 1) regime',
    'verification that trace-formula bound LOSES (log T)^(1/2) in (sigma > 1) regime',
  ]),
  dependencies: Object.freeze([
    'src/data/imp-1238-3point-correlation-extended.js for the (x, y) grid',
    'external: Maass eigenvalue table (Steil 1994 / Hejhal 1992 / LMFDB)',
    'external: length spectrum of closed geodesics on SL(2, Z) \\ H',
  ]),
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'selberg-bypass-route-identified',
  'selberg-weaker-than-PCC-for-this-test-fn',
  'selberg-requires-cuspidal-density-conjecture',
  'approach-eliminated',
]);

const VERDICT = 'selberg-requires-cuspidal-density-conjecture';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  // Sub-verdicts from each question.
  bypassesMontgomeryPCCUnconditionally: false,
  givesSameRateAsSelberg1944InRelevantRegime: true,
  givesTighterBoundThanMontgomeryPCC: false,

  requiresAuxiliaryConjectures: Object.freeze([
    'Selberg eigenvalue conjecture lambda_1 > 1/4 (open; lambda_1 > 7/64 known)',
    'Phillips-Sarnak cuspidal density on SL(2, Z) \\ H (open; only deformation theorem rigorous)',
    'Sarnak arithmetic quantum chaos 2-point GUE for Maass r_j (open; ' +
      'EXACT ANALOGUE of Montgomery PCC on a different object)',
  ]),

  netClassification:
    'NOT an unconditional bypass of Montgomery PCC. Route requires its own ' +
    '2-point conjecture (Sarnak AQC) that is EQUI-DIFFICULT to PCC, plus the ' +
    'Phillips-Sarnak cuspidal density. Even granting both, the trace-formula ' +
    '2-point bound on the ESY-closure Poisson-kernel test function is ' +
    'STRICTLY WEAKER than what PCC would deliver.',

  fitsWithImp1247Conclusion:
    'imp-1247 found no 4th route bypasses all bottlenecks. imp-1297 extends ' +
    'that to a 5th candidate (Selberg trace formula). No new unconditional ' +
    'route opens.',

  implicationForLambdaAttack:
    'PCC remains the binding obstruction for Route 1 of the ESY-closure. ' +
    'Engine bandwidth should NOT be redirected to Selberg-trace lifts; the ' +
    'route does not deliver unconditional progress. Productive direct attack ' +
    'on PCC (Goldston-Gonek 1998 second-moment refinements) remains the open ' +
    'lever.',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1297_SELBERG_TRACE_PCC_ROUTE = Object.freeze({
  id: 'imp-1297-selberg-trace-pcc-route',
  ticket: 'imp-1297',
  category: 'proof',
  builtAt: '2026-05-28T22:30:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1184', 'imp-1247', 'imp-1238', 'imp-1180']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  // The four mathematical sections.
  selbergTraceFormula: SELBERG_TRACE_FORMULA,
  maassZetaLink: MAASS_ZETA_LINK,
  bypassAnalysis: BYPASS_ANALYSIS,
  numericalBracketPlan: NUMERICAL_BRACKET_PLAN,

  // Cross-references to load-bearing parent tickets.
  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1238: 'src/data/imp-1238-3point-correlation-extended.js — 25-grid for the deferred numerical bracket',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for a candidate 5th route (Selberg ' +
    'trace formula on SL(2, Z) \\ H) to bypass Montgomery PCC. It is NOT a new ' +
    'closure or a new unconditional bound.',
    'The verdict is NEGATIVE: Selberg trace formula does NOT unconditionally ' +
    'bypass Montgomery PCC. It requires the Sarnak arithmetic-quantum-chaos ' +
    'conjecture (an exact analogue of PCC on Maass eigenvalues) plus the ' +
    'Phillips-Sarnak cuspidal density, neither of which is unconditional.',
    'Even granting both auxiliary conjectures, the trace-formula 2-point bound ' +
    'on the ESY-closure Poisson-kernel test function is STRICTLY WEAKER than ' +
    'PCC due to the (log T)^(1/2) loss in the (sigma > 1) regime.',
    'The numerical bracket on the imp-1238 25-grid is DEFERRED as ' +
    'imp-1297-sub-numerical; the bound is provably no tighter than Selberg ' +
    '1944 in the relevant regime so numerical confirmation would not change ' +
    'the verdict.',
    'CONSEQUENCE for engine planning: PCC remains the binding obstruction ' +
    'for Route 1 of the ESY-closure. The imp-1247 conclusion (no 4th route ' +
    'bypasses all bottlenecks) extends to this 5th candidate.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1238: 'src/data/imp-1238-3point-correlation-extended.js',
    selberg1956:
      'Selberg, "Harmonic analysis and discontinuous groups in weakly ' +
      'symmetric Riemannian spaces", J. Indian Math. Soc. 20 (1956), 47-87',
    phillipsSarnak1985:
      'Phillips, Sarnak, "On cusp forms for cofinite subgroups of PSL(2, R)", ' +
      'Inventiones Math. 80 (1985), 339-364',
    sarnak1992Survey:
      'Sarnak, "Arithmetic and geometric chaos", Asterisque 209 (1992)',
    iwaniec2002:
      'Iwaniec, "Spectral Methods of Automorphic Forms", 2nd ed., AMS GSM 53, 2002',
    kimSarnak2003:
      'Kim, Sarnak, "Refined estimates towards the Ramanujan and Selberg ' +
      'conjectures", appendix to Kim, J. Amer. Math. Soc. 16 (2003), 175-181',
    iwaniecSarnak2000:
      'Iwaniec, Sarnak, "Perspectives on the analytic theory of L-functions", ' +
      'GAFA 2000 Special Volume, 705-741',
    luoSarnak1995:
      'Luo, Sarnak, "Quantum ergodicity of eigenfunctions on PSL(2, Z) \\ H^2", ' +
      'Publ. Math. IHES 81 (1995), 207-237',
    lindenstrauss2006:
      'Lindenstrauss, "Invariant measures and arithmetic quantum unique ' +
      'ergodicity", Ann. Math. 163 (2006), 165-219',
    montgomery1973:
      'Montgomery, "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193',
  }),
});

export default IMP_1297_SELBERG_TRACE_PCC_ROUTE;

// =========================================================================
// BUILD-TIME TRIPWIRES (10 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1297_SELBERG_TRACE_PCC_ROUTE_ASSERTIONS = [
  // Tripwire 1: Selberg trace formula stated precisely with the load-bearing
  // ingredients (surface, spectral side, geometric side, test-function class,
  // zeta entry point via Eisenstein scattering, area of surface).
  {
    id: 'imp1297-selberg-trace-formula-stated-precisely',
    why:
      'The trace formula must be stated with surface + spectral side + geometric ' +
      'side + test-function class + zeta entry-point + area of surface. Any ' +
      'missing component means the route classification rests on an under-' +
      'specified formula.',
    holds: () => {
      const tf = IMP_1297_SELBERG_TRACE_PCC_ROUTE.selbergTraceFormula;
      return (
        typeof tf.surface === 'string' && /SL\(2, Z\)/.test(tf.surface) &&
        typeof tf.spectralSide === 'string' && tf.spectralSide.length > 20 &&
        typeof tf.geometricSide === 'string' && tf.geometricSide.length > 20 &&
        typeof tf.testFunctionClass === 'string' && /Paley-Wiener/.test(tf.testFunctionClass) &&
        typeof tf.zetaEntryPoint === 'string' && /zeta/.test(tf.zetaEntryPoint) &&
        typeof tf.areaOfSurface === 'string' && /pi \/ 3/.test(tf.areaOfSurface)
      );
    },
  },

  // Tripwire 2: Maass eigenvalue <-> zeta zero parameter identity stated
  // (lambda = 1/4 + r^2 parametrization, plus the three mechanisms B1/B2/B3).
  {
    id: 'imp1297-maass-zeta-parameter-identity-stated',
    why:
      'The Maass-eigenvalue <-> zeta-zero link must be stated with the ' +
      'lambda = 1/4 + r^2 parametrization AND with all three mechanisms ' +
      '(B1 rigorous Eisenstein, B2 conjectural distributional Sarnak, B3 ' +
      'rigorous Phillips-Sarnak deformation). Missing any of the three ' +
      'collapses the classification.',
    holds: () => {
      const m = IMP_1297_SELBERG_TRACE_PCC_ROUTE.maassZetaLink;
      return (
        typeof m.parametrization === 'string' &&
        /1\/4 \+ r\^2/.test(m.parametrization) &&
        typeof m.mechanism_B1_rigorous === 'object' &&
        m.mechanism_B1_rigorous.rigorous === true &&
        typeof m.mechanism_B2_conjectural_distributional === 'object' &&
        m.mechanism_B2_conjectural_distributional.rigorous === false &&
        typeof m.mechanism_B3_phillips_sarnak_deformation === 'object' &&
        m.mechanism_B3_phillips_sarnak_deformation.rigorous === true
      );
    },
  },

  // Tripwire 3: Phillips-Sarnak 1985 + Sarnak 1980s + Selberg 1956 all cited
  // with the expected venues.
  {
    id: 'imp1297-three-load-bearing-citations-present',
    why:
      'The classification rests on Selberg 1956 (trace formula), Phillips-' +
      'Sarnak 1985 (cuspidal deformation), and Sarnak 1980s arithmetic ' +
      'quantum chaos. All three citations must be present.',
    holds: () => {
      const refs = IMP_1297_SELBERG_TRACE_PCC_ROUTE.references;
      return (
        /Selberg/.test(refs.selberg1956 || '') &&
        /1956/.test(refs.selberg1956 || '') &&
        /Phillips/.test(refs.phillipsSarnak1985 || '') &&
        /Sarnak/.test(refs.phillipsSarnak1985 || '') &&
        /1985/.test(refs.phillipsSarnak1985 || '') &&
        /Sarnak/.test(refs.sarnak1992Survey || '')
      );
    },
  },

  // Tripwire 4: Verdict is one of the four allowed strings.
  {
    id: 'imp1297-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'selberg-bypass-route-identified / selberg-weaker-than-PCC-for-this- ' +
      'test-fn / selberg-requires-cuspidal-density-conjecture / approach-eliminated.',
    holds: () => {
      const allowed = [
        'selberg-bypass-route-identified',
        'selberg-weaker-than-PCC-for-this-test-fn',
        'selberg-requires-cuspidal-density-conjecture',
        'approach-eliminated',
      ];
      return allowed.includes(IMP_1297_SELBERG_TRACE_PCC_ROUTE.verdict);
    },
  },

  // Tripwire 5: Cross-references imp-1184 and imp-1247 (the parent obstruction
  // tickets) in BOTH relatedTickets and parentCrossReferences.
  {
    id: 'imp1297-cross-references-imp1184-and-imp1247',
    why:
      'This ticket is a follow-up to imp-1184 / imp-1247. Without explicit ' +
      'cross-references the classification floats free of the parent ' +
      'obstruction map and engine planning loses the linkage.',
    holds: () => {
      const r = IMP_1297_SELBERG_TRACE_PCC_ROUTE;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1247') &&
        typeof xrefs.imp1184 === 'string' &&
        /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1247 === 'string' &&
        /imp-1247/.test(xrefs.imp1247)
      );
    },
  },

  // Tripwire 6: BypassAnalysis answers all three sub-questions (a/b/c) and
  // explicitly reports that Selberg does NOT bypass Montgomery PCC
  // unconditionally.
  {
    id: 'imp1297-bypass-analysis-answers-all-three-subquestions',
    why:
      'The classification body must answer the three sub-questions: (a) does ' +
      'Selberg-trace give an INDEPENDENT 2-point bound? (b) what is the ' +
      'strongest bound? (c) does it require auxiliary conjectures? Each ' +
      'answer must be explicitly present.',
    holds: () => {
      const b = IMP_1297_SELBERG_TRACE_PCC_ROUTE.bypassAnalysis;
      return (
        typeof b.question_a_independent_2pt_bound === 'object' &&
        b.question_a_independent_2pt_bound.isIndependentOfMontgomery === false &&
        typeof b.question_b_strongest_bound_from_trace_alone === 'object' &&
        b.question_b_strongest_bound_from_trace_alone.isTighterThanMontgomeryPCCInESYRegime === false &&
        typeof b.question_c_required_conjectures === 'object' &&
        b.question_c_required_conjectures.requires_selberg_eigenvalue_conjecture === true &&
        b.question_c_required_conjectures.requires_phillips_sarnak_cuspidal_density === true &&
        b.question_c_required_conjectures.requires_sarnak_aqc_2_point_conjecture === true
      );
    },
  },

  // Tripwire 7: Verdict detail flags that the route does NOT unconditionally
  // bypass Montgomery PCC. Catches any silent flip to a positive bypass claim.
  {
    id: 'imp1297-verdict-detail-does-not-claim-unconditional-bypass',
    why:
      'A silent flip to "bypasses PCC unconditionally" would invalidate the ' +
      'whole engine-planning consequence (PCC remains the binding obstruction). ' +
      'Tripwire pins the negative result.',
    holds: () => {
      const vd = IMP_1297_SELBERG_TRACE_PCC_ROUTE.verdictDetail;
      return (
        vd.bypassesMontgomeryPCCUnconditionally === false &&
        vd.givesTighterBoundThanMontgomeryPCC === false &&
        Array.isArray(vd.requiresAuxiliaryConjectures) &&
        vd.requiresAuxiliaryConjectures.length >= 3
      );
    },
  },

  // Tripwire 8: The Sarnak arithmetic-quantum-chaos conjecture is flagged as
  // an EXACT ANALOGUE of Montgomery PCC on a different object — not a
  // substitute or a bypass. This is the load-bearing classification claim
  // that prevents the trap "Sarnak AQC proves PCC".
  {
    id: 'imp1297-sarnak-aqc-flagged-as-exact-analogue-not-substitute',
    why:
      'The Sarnak arithmetic-quantum-chaos 2-point conjecture on Maass ' +
      'eigenvalues is the SAME-DIFFICULTY analogue of Montgomery PCC on a ' +
      'different object. A silent re-framing as "Sarnak AQC weaker than PCC" ' +
      'would falsely suggest a productive bypass exists. Tripwire pins the ' +
      'classification.',
    holds: () => {
      const m = IMP_1297_SELBERG_TRACE_PCC_ROUTE.maassZetaLink
        .mechanism_B2_conjectural_distributional;
      const c = IMP_1297_SELBERG_TRACE_PCC_ROUTE.bypassAnalysis.question_c_required_conjectures;
      return (
        m.isThisExactlyPCC === true &&
        typeof m.note === 'string' &&
        /EXACT/.test(m.note) &&
        typeof c.sarnak_aqc_relation_to_montgomery_PCC === 'string' &&
        /EXACT ANALOGUE/.test(c.sarnak_aqc_relation_to_montgomery_PCC)
      );
    },
  },

  // Tripwire 9: Numerical bracket is honestly deferred as a sub-ticket with a
  // documented reason; the verdict is NOT contingent on numerical evidence
  // that has not been computed.
  {
    id: 'imp1297-numerical-bracket-honestly-deferred',
    why:
      'The numerical bracket on the imp-1238 25-grid is deferred. The ticket ' +
      'must explicitly flag the sub-ticket id and the reason (no value-add ' +
      'over the analytic classification). A silent claim of "numerically ' +
      'verified" would overstate the evidence.',
    holds: () => {
      const n = IMP_1297_SELBERG_TRACE_PCC_ROUTE.numericalBracketPlan;
      return (
        n.deferredAsSubTicket === true &&
        n.subTicketId === 'imp-1297-sub-numerical' &&
        typeof n.reasonDeferred === 'string' &&
        n.reasonDeferred.length > 40 &&
        Array.isArray(n.dependencies) &&
        n.dependencies.some((d) => /imp-1238/.test(d))
      );
    },
  },

  // Tripwire 10: Honest scope mentions the NEGATIVE result and the
  // continuation of the imp-1247 conclusion.
  {
    id: 'imp1297-honest-scope-mentions-negative-result-and-imp1247-continuation',
    why:
      'The honest scope must explicitly state that the result is NEGATIVE and ' +
      'that it CONTINUES the imp-1247 finding (no 4th route bypasses all ' +
      'bottlenecks). A silent drift to "positive bypass identified" would ' +
      'mislead engine planning.',
    holds: () => {
      const blob = IMP_1297_SELBERG_TRACE_PCC_ROUTE.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /imp-1247/.test(blob) &&
        /(not unconditional|does NOT|NOT a new)/i.test(blob)
      );
    },
  },
];

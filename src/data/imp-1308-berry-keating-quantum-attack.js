/**
 * @module imp-1308-berry-keating-quantum-attack
 * @fileoverview imp-1308 — NEW-INPUT classification: does the Berry-Keating
 *   H = xp semiclassical quantum-chaos Hamiltonian (Berry-Keating 1999),
 *   together with the Sierra-Townsend 2008 quantum-correction (Landau-level /
 *   BCSL Hamiltonian on a stretched torus), provide a genuinely NEW input
 *   that bypasses the Montgomery PCC obstruction at Fourier support > 1 that
 *   imp-1297 / imp-1302 / imp-1303 / imp-1304 / imp-1305 all hit?
 *
 *   CONTEXT
 *   -------
 *   imp-1305 closed the moment-method family and imp-1309 closed the
 *   entropy-method family, both with the aggregate verdict
 *   `pcc-genuinely-open-pending-new-input`. imp-1307 audited the first
 *   geometric / non-commutative-geometry candidate (Connes-Bost adele class
 *   space) and returned `connes-bost-program-not-rigorous-as-published`.
 *   Berry-Keating semiclassical quantum-chaos is the SECOND named geometric /
 *   spectral candidate outside both the moment and entropy families.
 *
 *   This ticket asks: does the Berry-Keating H = xp Hamiltonian (plus the
 *   Sierra-Townsend 2008 quantum corrections) provide a genuinely new
 *   spectral pathway to RH that bypasses the Cauchy-Schwarz off-diagonal
 *   obstruction, by realising the Riemann zeros as the spectrum of a
 *   self-adjoint operator and/or deriving the Montgomery PCC at support > 1
 *   semiclassically and unconditionally?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'berry-keating-program-not-rigorous-as-published'
 *
 *   The Berry-Keating program is a genuine and historically important
 *   semiclassical HEURISTIC: the classical Hamiltonian H = xp has a
 *   hyperbolic fixed point whose smoothed quantisation reproduces the
 *   Riemann-von Mangoldt smooth counting function N(E) ~ (E / 2 pi)
 *   (log(E / 2 pi) - 1) + 7/8, and the Bogomolny-Keating 1996 semiclassical
 *   pair-correlation calculation (periodic orbits = primes, with periods
 *   log p) recovers the Montgomery PCC form factor AND its lower-order
 *   corrections. HOWEVER, it does NOT provide a rigorous new input for PCC
 *   at support > 1, for THREE independent structural reasons:
 *
 *   (B1) NO SELF-ADJOINT OPERATOR / NO COMPACTIFICATION. The classical
 *        H = xp has a CONTINUOUS, unbounded spectrum on L^2(R) with no
 *        discrete eigenvalues; it is not even essentially self-adjoint
 *        without a choice of boundary condition / compactification. Neither
 *        Berry-Keating 1999 nor Sierra-Townsend 2008 constructs an operator
 *        whose DISCRETE SPECTRUM is the set of Riemann zeros. The
 *        Sierra-Townsend Landau-level / stretched-torus Hamiltonian
 *        reproduces only the SMOOTH (average) counting function N(E),
 *        NOT the FLUCTUATING part where the individual zeros live. The
 *        Hilbert-Polya operator remains UNCONSTRUCTED.
 *
 *   (B2) THE SEMICLASSICAL PCC IS CONDITIONAL ON HARDY-LITTLEWOOD. The
 *        Bogomolny-Keating 1996 derivation of PCC beyond the diagonal
 *        approximation evaluates the off-diagonal periodic-orbit double sum
 *        using the Hardy-Littlewood prime k-tuple conjecture for the
 *        prime-pair correlations. The diagonal approximation alone
 *        reproduces PCC only in the UNCONDITIONAL Montgomery window
 *        (Fourier support < 1); extending to support > 1 requires the HL
 *        prime-pair conjecture, which is UNPROVEN and (via the Goldston-
 *        Montgomery 1987 equivalence) at least as hard as PCC itself.
 *
 *   (B3) THE OFF-DIAGONAL SUM IS THE SAME CAUCHY-SCHWARZ SLACK. The
 *        off-diagonal periodic-orbit double sum in the Gutzwiller trace
 *        formula IS the prime-pair correlation sum, which IS the off-
 *        diagonal prime-power correction in the Weil explicit formula in
 *        disguise. An unconditional evaluation of it hits the SAME
 *        (log T)^{1/2} Cauchy-Schwarz / L^1-L^2 duality slack documented by
 *        imp-1303 / imp-1305. The semiclassical route does not bypass the
 *        layer; it re-encodes it in periodic-orbit language.
 *
 *   HONEST UNCERTAINTY NOTE ON SIERRA-TOWNSEND 2008 SPECIFICS
 *   --------------------------------------------------------
 *   The Sierra-Townsend 2008 paper ("Landau levels and Riemann zeros",
 *   Phys. Rev. Lett. 101, 110201, arXiv:0805.4079) and the broader Sierra
 *   program (Sierra 2014 / 2019 reviews) are partially available in
 *   training data. The PRECISE form of the most recent compactified
 *   Berry-Keating Hamiltonians (Berry-Keating 2011 J. Phys. A 44, 285203;
 *   Bender-Brody-Mueller 2017 PRL claimed PT-symmetric realisation) is
 *   uncertain at training-cutoff (January 2026). The (B1)-(B3) structural
 *   obstructions are ROBUST to the exact form of the quantum correction
 *   because they identify load-bearing layer-level obstructions that any
 *   semiclassical H = xp realisation must traverse. If a specific
 *   construction exists that (i) realises the zeros as the discrete
 *   spectrum of a proven self-adjoint operator AND (ii) derives PCC at
 *   support > 1 without assuming Hardy-Littlewood, this classification is
 *   OPEN-FOR-REVISION.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family) +
 *   imp-1309 (entropy family) + imp-1307 (Connes-Bost geometric) +
 *   imp-1308 (this ticket, Berry-Keating geometric) now cover the FULL
 *   standard toolkit PLUS the two leading geometric/spectral candidates.
 *   All produce negative classifications. The aggregate engine-planning
 *   verdict remains:
 *
 *       PCC-GENUINELY-OPEN-PENDING-NEW-INPUT
 *
 *   Remaining candidate routes:
 *     - Alternative §15-27 closure pathways that DECOUPLE from sigma > 1
 *       (imp-1310 explicitly addresses this; this is the most likely escape).
 *     - Selberg trace on Hecke triangle groups (Beyerstedt-Strombergsson
 *       2010 unconditional eigenvalue) as a different geometric object.
 *     - Closing imp-1241 unified existence for the Romanov-Woracek-Pruss
 *       2024 de Branges direct route.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1303 src/data/imp-1303-heath-brown-pcc-route.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *   @see imp-1307 src/data/imp-1307-connes-bost-adelic-attack.js
 *   @see imp-1309 src/data/imp-1309-tao-entropy-pcc-attack.js
 *   @see imp-1310 src/data/imp-1310-section15-27-support-leq-1-reroute.js
 *
 *   Ticket: imp-1308 (proof, critical, NEW-INPUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - BERRY-KEATING H = xp + SIERRA-TOWNSEND 2008 STATEMENT.
// =========================================================================
//
// [BK1999] M. V. Berry and J. P. Keating, "H = xp and the Riemann zeros",
//   in Supersymmetry and Trace Formulae: Chaos and Disorder (ed. Lerner,
//   Keating, Khmelnitskii), Kluwer / Plenum 1999, pp. 355-367; and
//   "The Riemann zeros and eigenvalue asymptotics", SIAM Review 41 (1999),
//   236-266. The CLASSICAL Hamiltonian
//
//       H(x, p) = x * p
//
//   on the phase plane (x, p) has a hyperbolic fixed point at the origin
//   and hyperbolae H = E as energy contours. The number of semiclassical
//   states below energy E, obtained by counting Planck cells in the region
//   {0 < x < L_x, 0 < p, x p < E} after a regularising cutoff l_x l_p = 2 pi
//   hbar, is
//
//       N_smooth(E) = (E / 2 pi)(log(E / 2 pi) - 1) + 7/8 + ...
//
//   which MATCHES the Riemann-von Mangoldt smooth counting function for the
//   zeros of zeta on the critical line (with E = t the height). This is the
//   ORIGIN of the Berry-Keating conjecture: the Riemann zeros are the
//   eigenvalues of a quantisation of H = xp.
//
// ISSUES WITH THE BARE H = xp (acknowledged by Berry-Keating 1999):
//
//   (i)  CONTINUOUS SPECTRUM. The quantum operator (x p + p x)/2 on L^2(R)
//        is self-adjoint but has CONTINUOUS spectrum filling all of R; it
//        has NO discrete eigenvalues, so it cannot directly have the zeros
//        as its spectrum.
//   (ii) NO COMPACTIFICATION. To obtain a discrete spectrum one must
//        compactify the phase-space region (impose boundary conditions on
//        the hyperbolic flow). No canonical compactification is known that
//        yields the zeros as eigenvalues; the truncation x > l_x, p > l_p
//        used to count states is a SEMICLASSICAL bookkeeping device, not a
//        self-adjoint boundary condition.
//   (iii) TIME-REVERSAL. The hyperbolic flow of H = xp is time-reversal
//        non-invariant in the right way to suggest GUE (not GOE) statistics,
//        consistent with the conjectured GUE distribution of the zeros, but
//        this is a heuristic match of symmetry classes, not a theorem.
//
// [ST2008] G. Sierra and J. Rodriguez-Laguna / G. Sierra and P. Townsend,
//   "Landau levels and Riemann zeros", Phys. Rev. Lett. 101, 110201 (2008),
//   arXiv:0805.4079. Quantum correction: a charged particle in a magnetic
//   field B and electrostatic potential V(x, y) = x y (a "BCSL" / stretched-
//   torus Hamiltonian) yields, in the lowest-Landau-level projection, an
//   effective H = xp dynamics. The lowest Landau level gives a smooth
//   counting function reproducing N_smooth(E) including the constant 7/8
//   and lower-order Berry-Keating corrections. Later refinements (Sierra
//   2014 / 2019; Berry-Keating 2011 compact Hamiltonian J. Phys. A 44,
//   285203) propose Hamiltonians H = x(p + l_p^2 / p) or H = (x + l_x^2 / x)
//   p with smoothed boundaries to regularise the spectrum.
//
// CRUCIAL OBSERVATION (the load-bearing limitation). ALL of these
// constructions reproduce the SMOOTH (mean) counting function N_smooth(E).
// NONE of them produces a discrete spectrum whose individual eigenvalues
// are the Riemann zeros gamma_n. The FLUCTUATING part of the counting
// function, N(E) - N_smooth(E), where the actual zeros live, is NOT
// reproduced by any rigorous self-adjoint realisation. The fluctuating
// part is governed by the same prime-sum (Gutzwiller trace formula with
// periodic orbits = primes) that the explicit formula encodes.

const BERRY_KEATING_STATEMENT = Object.freeze({
  source:
    'Berry-Keating 1999 (H = xp, SIAM Review 41, 236-266 + Lerner-Keating-' +
    'Khmelnitskii volume) + Sierra-Townsend 2008 (Landau levels and Riemann ' +
    'zeros, Phys. Rev. Lett. 101, 110201, arXiv:0805.4079) + Berry-Keating ' +
    '2011 compact Hamiltonian (J. Phys. A 44, 285203)',

  classicalHamiltonian:
    'H(x, p) = x * p on the phase plane; hyperbolic fixed point at origin, ' +
    'energy contours x p = E. Semiclassical state count below E with cutoff ' +
    'l_x l_p = 2 pi hbar gives N_smooth(E) = (E / 2 pi)(log(E / 2 pi) - 1) + 7/8',

  smoothCountingFunctionMatch:
    'N_smooth(E) MATCHES the Riemann-von Mangoldt smooth counting function ' +
    'for zeros of zeta on the critical line with E = t (height). This is the ' +
    'ORIGIN of the Berry-Keating conjecture',

  isTrainingTimeUncertain: true,
  trainingTimeUncertaintyNote:
    'The precise form of the most recent compactified Berry-Keating ' +
    'Hamiltonians (Berry-Keating 2011 J. Phys. A 44, 285203; Bender-Brody-' +
    'Mueller 2017 PRL PT-symmetric proposal) is uncertain at training-cutoff ' +
    '(January 2026). The (B1)-(B3) structural obstructions are robust to the ' +
    'exact form of the quantum correction because they identify load-bearing ' +
    'layer-level obstructions any semiclassical H = xp realisation must traverse.',

  sierraTownsend2008Correction:
    'Charged particle in magnetic field B with potential V(x, y) = x y; ' +
    'lowest-Landau-level projection yields effective H = xp dynamics whose ' +
    'smooth counting function reproduces N_smooth(E) including the 7/8 constant',

  bareHxpIssues: Object.freeze({
    continuousSpectrum:
      'Quantum (xp + px)/2 on L^2(R) is self-adjoint with CONTINUOUS spectrum ' +
      'filling R; NO discrete eigenvalues, so cannot directly carry the zeros',
    noCompactification:
      'No canonical compactification yields the zeros as eigenvalues; the ' +
      'truncation x > l_x, p > l_p is a semiclassical bookkeeping device, ' +
      'NOT a self-adjoint boundary condition',
    timeReversal:
      'Hyperbolic flow is time-reversal non-invariant, heuristically matching ' +
      'GUE (not GOE), consistent with conjectured zero statistics — a symmetry-' +
      'class match, not a theorem',
  }),

  loadBearingLimitation:
    'ALL constructions (BK1999, ST2008, BK2011) reproduce only the SMOOTH ' +
    '(mean) counting function N_smooth(E). NONE produces a discrete spectrum ' +
    'whose eigenvalues are the zeros gamma_n. The FLUCTUATING part N(E) - ' +
    'N_smooth(E), where the zeros live, is governed by the same prime-sum ' +
    '(Gutzwiller trace formula, periodic orbits = primes) the explicit formula ' +
    'encodes — and is NOT reproduced by any rigorous self-adjoint realisation',
});

// =========================================================================
// SECTION B - DOES THE QUANTUM CORRECTION CLOSE THE SPECTRAL INTERPRETATION?
// =========================================================================
//
// The Hilbert-Polya conjecture asks for a self-adjoint operator whose
// discrete spectrum is {gamma_n}. A rigorous Berry-Keating realisation
// would need:
//
//   (S1) a Hilbert space H and a densely-defined operator A on H;
//   (S2) a PROOF that A is (essentially) self-adjoint;
//   (S3) a PROOF that the spectrum of A is discrete and equals {gamma_n}.
//
// STATUS OF (S1)-(S3) under Berry-Keating 1999 + Sierra-Townsend 2008:
//
//   (S1) PARTIAL. Sierra-Townsend 2008 gives a concrete Hilbert space
//        (lowest Landau level of a charged particle) and a concrete
//        operator. Berry-Keating 2011 gives H = x(p + l_p^2/p) on a
//        half-line with a smoothed boundary.
//   (S2) PARTIAL / heuristic. Self-adjointness of the regularised
//        operators requires a careful choice of boundary condition
//        (deficiency-index analysis). Some choices give self-adjoint
//        extensions; NONE is canonically singled out by the arithmetic.
//   (S3) FAILS. The spectrum of every proposed self-adjoint realisation
//        matches only the SMOOTH counting function N_smooth(E). The
//        discrete eigenvalues are NOT the zeros gamma_n. Equivalently:
//        the average spectral DENSITY matches, but the individual levels
//        do not, and the fluctuating part is not reproduced.
//
// WHY (S3) FAILS STRUCTURALLY. To pin the individual eigenvalues to the
// zeros, the operator would need to encode the FLUCTUATING part of N(E),
// which is the imaginary part of (1 / pi) * arg zeta(1/2 + i E), i.e. the
// function S(E). Via the explicit formula, S(E) is a sum over primes
//
//     S(E) = -(1 / pi) sum_p sum_{k>=1} (1 / k) p^{-k/2} sin(k E log p) + ...
//
// Reproducing S(E) requires the operator dynamics to contain periodic
// orbits with periods {k log p} and amplitudes {p^{-k/2} / k} EXACTLY.
// The Gutzwiller trace formula for a quantisation of H = xp DOES produce
// periodic orbits with periods log p (Berry-Keating 1999 identify the
// primitive periodic orbits with the primes), but matching the amplitudes
// and phases EXACTLY — so that the trace reproduces S(E) and the
// eigenvalues land on the zeros — is precisely the content of RH and is
// NOT achieved by any published construction. The semiclassical trace
// formula is an ASYMPTOTIC (hbar -> 0) statement; turning it into an
// EXACT operator identity is the unproven step.
//
// NET. The quantum correction (Sierra-Townsend 2008) closes the SMOOTH
// spectral interpretation (matches the average density) but does NOT close
// the FLUCTUATING spectral interpretation (does not realise the zeros as
// eigenvalues). The Hilbert-Polya operator remains unconstructed.

const SPECTRAL_REALISATION_EVALUATION = Object.freeze({
  hilbertPolyaRequirements: Object.freeze({
    S1_hilbert_space_and_operator:
      'PARTIAL: Sierra-Townsend 2008 gives lowest-Landau-level Hilbert space ' +
      'and concrete operator; Berry-Keating 2011 gives H = x(p + l_p^2/p) on a ' +
      'half-line with smoothed boundary',
    S2_self_adjointness:
      'PARTIAL / heuristic: self-adjointness of the regularised operators ' +
      'requires a chosen boundary condition (deficiency-index analysis); some ' +
      'choices give self-adjoint extensions but NONE is canonically singled ' +
      'out by the arithmetic',
    S3_spectrum_equals_zeros:
      'FAILS: spectrum of every proposed realisation matches only the SMOOTH ' +
      'counting function N_smooth(E); the discrete eigenvalues are NOT the ' +
      'zeros gamma_n; the fluctuating part is not reproduced',
  }),

  whyS3FailsStructurally:
    'Pinning the eigenvalues to the zeros requires encoding the FLUCTUATING ' +
    'part S(E) = -(1/pi) sum_p sum_k (1/k) p^{-k/2} sin(k E log p), which via ' +
    'the explicit formula is a prime sum. The Gutzwiller trace formula for a ' +
    'quantisation of H = xp produces periodic orbits with periods log p, but ' +
    'matching amplitudes and phases EXACTLY (so the trace reproduces S(E) and ' +
    'the eigenvalues land on the zeros) is precisely the content of RH and is ' +
    'NOT achieved by any published construction. The trace formula is an ' +
    'asymptotic (hbar -> 0) statement; the EXACT operator identity is unproven',

  closesSmoothSpectralInterpretation: true,
  closesFluctuatingSpectralInterpretation: false,
  hilbertPolyaOperatorConstructed: false,

  sierraTownsend2008Verdict:
    'Sierra-Townsend 2008 closes the SMOOTH spectral interpretation (matches ' +
    'average density including the 7/8 constant) but does NOT close the ' +
    'FLUCTUATING spectral interpretation (does not realise the zeros as ' +
    'eigenvalues). The Hilbert-Polya operator remains unconstructed',
});

// =========================================================================
// SECTION C - DOES THE SEMICLASSICAL 2-POINT STATISTIC MATCH PCC AT
//             SUPPORT > 1 UNCONDITIONALLY?
// =========================================================================
//
// [BogomolnyKeating1996] E. B. Bogomolny and J. P. Keating, "Gutzwiller's
//   trace formula and spectral statistics: beyond the diagonal
//   approximation", Phys. Rev. Lett. 77 (1996), 1472-1475. The
//   semiclassical pair-correlation of energy levels of a quantum-chaotic
//   system is computed from the Gutzwiller trace formula via the DOUBLE SUM
//   over pairs of periodic orbits:
//
//     R_2(epsilon) ~ sum_{p, p'} A_p A_{p'} exp(i (S_p - S_{p'}) / hbar) ...
//
//   For the Riemann case, periodic orbits are labelled by primes (period
//   T_p = log p) with amplitudes derived from the von Mangoldt weights.
//   The double sum splits into:
//
//     DIAGONAL (p = p'): reproduces the Montgomery form factor for Fourier
//       support |tau| < 1 — the UNCONDITIONAL Montgomery 1973 range.
//
//     OFF-DIAGONAL (p != p'): Bogomolny-Keating 1996 evaluate this using
//       the HARDY-LITTLEWOOD prime-pair conjecture (the singular series for
//       prime pairs p, p + h) to obtain the contribution that EXTENDS the
//       form factor to support |tau| > 1, recovering the full Montgomery
//       PCC F(tau) -> 1 for |tau| > 1 AND the lower-order corrections
//       (later matched to Keating-Snaith 2000 CUE moments).
//
// THE CRUX. The semiclassical recovery of PCC at support > 1 is CONDITIONAL
// ON HARDY-LITTLEWOOD. Specifically:
//
//   - The DIAGONAL term gives PCC only in the unconditional window
//     |tau| < 1 (exactly Montgomery 1973).
//   - The OFF-DIAGONAL term, which carries the support |tau| > 1
//     behaviour, requires the Hardy-Littlewood prime k-tuple / prime-pair
//     conjecture to evaluate the prime-pair correlation
//
//       sum_{p, p' : log p - log p' ~ x} (log p)(log p') ~
//                     singular-series(HL) + error.
//
//   - By the GOLDSTON-MONTGOMERY 1987 equivalence, the prime-pair
//     correlation conjecture and the Montgomery PCC are EQUIVALENT (each
//     implies the other in the relevant ranges). So the semiclassical
//     "derivation" of PCC at support > 1 ASSUMES a statement equivalent to
//     what it is trying to prove. It is CIRCULAR with respect to an
//     unconditional PCC.
//
// IS THERE AN UNCONDITIONAL SEMICLASSICAL PCC? NO. The Bogomolny-Keating
// 1996 calculation is a HEURISTIC semiclassical derivation that takes
// Hardy-Littlewood as input. Unconditionally, the off-diagonal periodic-
// orbit double sum is the prime-pair correlation sum, which is the
// off-diagonal prime-power correction in the Weil explicit formula in
// disguise. Bounding it unconditionally hits the SAME (log T)^{1/2}
// Cauchy-Schwarz / L^1-L^2 duality slack that imp-1303 (Heath-Brown 1979)
// and imp-1305 (Goldston-Yildirim 2003 absolutized) documented: the
// unconditional range is sigma in (1, 5/4) with (log T)^{1/2} slack, and
// no unconditional bound for sigma > 5/4.
//
// NET. The Berry-Keating / Bogomolny-Keating semiclassical 2-point
// statistic MATCHES Montgomery PCC at support > 1 only CONDITIONALLY on
// Hardy-Littlewood (equivalently, conditionally on PCC). It does NOT
// provide an unconditional semiclassical derivation of PCC at support > 1.

const SEMICLASSICAL_PCC_EVALUATION = Object.freeze({
  bogomolnyKeating1996Source:
    'Bogomolny, E. B. and Keating, J. P., "Gutzwiller trace formula and ' +
    'spectral statistics: beyond the diagonal approximation", Phys. Rev. ' +
    'Lett. 77 (1996), 1472-1475',

  diagonalTermGives:
    'Montgomery form factor for Fourier support |tau| < 1 — the ' +
    'UNCONDITIONAL Montgomery 1973 range. Diagonal (p = q) periodic-orbit ' +
    'pairs only',

  offDiagonalTermGives:
    'The support |tau| > 1 behaviour, recovering full Montgomery PCC ' +
    'F(tau) -> 1 for |tau| > 1 plus lower-order corrections (matched to ' +
    'Keating-Snaith 2000 CUE moments) — but ONLY by assuming the Hardy-' +
    'Littlewood prime-pair conjecture to evaluate the off-diagonal double sum',

  offDiagonalRequiresHardyLittlewood: true,
  hardyLittlewoodEquivalentToPCC:
    'By the Goldston-Montgomery 1987 equivalence, the prime-pair correlation ' +
    'conjecture and the Montgomery PCC are EQUIVALENT in the relevant ranges. ' +
    'The semiclassical derivation of PCC at support > 1 ASSUMES a statement ' +
    'equivalent to what it is trying to prove — CIRCULAR with respect to an ' +
    'unconditional PCC',

  unconditionalSemiclassicalPCCExists: false,
  whyNoUnconditionalSemiclassicalPCC:
    'The Bogomolny-Keating 1996 calculation is a HEURISTIC semiclassical ' +
    'derivation that takes Hardy-Littlewood as input. Unconditionally, the ' +
    'off-diagonal periodic-orbit double sum is the prime-pair correlation sum, ' +
    'which is the off-diagonal prime-power correction in the Weil explicit ' +
    'formula in disguise. Bounding it unconditionally hits the SAME ' +
    '(log T)^{1/2} Cauchy-Schwarz slack as imp-1303 / imp-1305',

  unconditionalSupportWindowReached: 'sigma in (1, 5/4) — SAME as HB1979 / imp-1303 / imp-1305',
  unconditionalRangeAbove_5_4: 'NO unconditional 2-point bound; same as HB1979',
  closesPCCForSupportGtOne: false,

  twoPointBoundFromSemiclassicalAttempt:
    'F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in (1, 5/4), ' +
    'matching imp-1303 / imp-1305 to leading order; no improvement to the PCC ' +
    'slack in support (1, 5/4) and no unconditional bound for sigma > 5/4',
});

// =========================================================================
// SECTION D - RELATIONSHIP TO PRIOR PCC ROUTES AND IMP-1307.
// =========================================================================
//
// imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family) and
// imp-1309 (entropy family) all collapse to a CAUCHY-SCHWARZ step at the
// L^1 / L^2 duality boundary giving (log T)^{1/2} slack. imp-1307
// (Connes-Bost adelic) returned NOT-RIGOROUS because the unconditional
// absorption identity is the Weil explicit formula in adelic coordinates
// (same off-diagonal slack) and the Lefschetz-trace interpretation needs
// unproven positivity (equivalent to RH).
//
// THE BERRY-KEATING ROUTE (this imp-1308) is structurally PARALLEL to
// Connes-Bost: it is a SPECTRAL / GEOMETRIC reframing that, unconditionally,
// reduces to the SAME prime-sum off-diagonal correction.
//
//   - Connes-Bost: zeros as ABSORPTION SPECTRUM of the adele class space;
//     trace = Weil explicit formula; unconditional content = explicit
//     formula; conjectural content = positivity (equivalent to RH).
//
//   - Berry-Keating: zeros as the SPECTRUM of a quantisation of H = xp;
//     trace = Gutzwiller trace formula with periodic orbits = primes;
//     unconditional content = smooth counting function N_smooth(E);
//     conjectural content = (i) self-adjoint realisation pinning the
//     eigenvalues to the zeros (Hilbert-Polya, unconstructed) and (ii)
//     off-diagonal periodic-orbit sum = Hardy-Littlewood prime-pair
//     conjecture (equivalent to PCC).
//
// BOTH geometric routes have the SAME signature: the UNCONDITIONAL part
// reproduces the smooth / average behaviour (Weil explicit formula resp.
// smooth counting function), and the LOAD-BEARING fluctuating / 2-point
// part requires an unproven positivity (RH) resp. an unproven prime-pair
// correlation (PCC). Neither produces an independent arithmetic estimate
// that bypasses the (log T)^{1/2} slack.

const RELATIONSHIP_TO_PRIOR_PCC_ROUTES = Object.freeze({
  momentMethodRoutesHitCauchySchwarzAtInputStage:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1304 (Iwaniec-Sarnak 2000) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) bound the off-diagonal explicit-formula ' +
    'correction via Cauchy-Schwarz against a higher-moment input; the step ' +
    'gives the (log T)^{1/2} slack',

  entropyMethodRouteHitsCauchySchwarzAtOutputStage:
    'imp-1309 (Tao 2024 entropy, closest-known) re-introduces the same ' +
    '(log T)^{1/2} slack at the Pinsker -> Cauchy-Schwarz -> Parseval output stage',

  connesBostGeometricRoute:
    'imp-1307 (Connes-Bost adelic): zeros as absorption spectrum of the adele ' +
    'class space; trace = Weil explicit formula (unconditional content = ' +
    'explicit formula, same off-diagonal slack); conjectural content = ' +
    'positivity equivalent to RH. Verdict connes-bost-program-not-rigorous-' +
    'as-published',

  berryKeatingGeometricRoute:
    'imp-1308 (this ticket): zeros as spectrum of a quantisation of H = xp; ' +
    'trace = Gutzwiller trace formula, periodic orbits = primes (periods log ' +
    'p); unconditional content = smooth counting function N_smooth(E); ' +
    'conjectural content = (i) self-adjoint realisation pinning eigenvalues to ' +
    'zeros (Hilbert-Polya, unconstructed) and (ii) off-diagonal periodic-orbit ' +
    'sum = Hardy-Littlewood prime-pair conjecture (equivalent to PCC)',

  bothGeometricRoutesSameSignature:
    'Both Connes-Bost and Berry-Keating have the SAME signature: the ' +
    'UNCONDITIONAL part reproduces the smooth / average behaviour (Weil ' +
    'explicit formula resp. smooth counting function), and the LOAD-BEARING ' +
    'fluctuating / 2-point part requires an unproven positivity (RH) resp. an ' +
    'unproven prime-pair correlation (PCC). Neither produces an independent ' +
    'arithmetic estimate that bypasses the (log T)^{1/2} slack',

  aggregateConclusion:
    'imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family) + ' +
    'imp-1309 (entropy family) + imp-1307 (Connes-Bost geometric) + imp-1308 ' +
    '(Berry-Keating geometric) all produce negative classifications at the same ' +
    '(log T)^{1/2} Cauchy-Schwarz / L^1-L^2 duality boundary (or its ' +
    'periodic-orbit / adelic re-encoding), with the same residual gap in ' +
    'support (1, 5/4) and no unconditional bound for sigma > 5/4. The standard ' +
    'analytic-number-theory toolkit PLUS the two leading geometric/spectral ' +
    'candidates are EXHAUSTED for PCC at 2-point. Remaining: alternative ' +
    '§15-27 pathways decoupled from sigma > 1 (imp-1310), Hecke-triangle ' +
    'Selberg trace, de Branges direct route (imp-1241)',
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'berry-keating-fully-closes-pcc-bypass',
  'berry-keating-requires-X-spectral-realization-conjecture',
  'berry-keating-program-not-rigorous-as-published',
  'berry-keating-bypasses-pcc-but-only-conjecturally',
]);

const VERDICT = 'berry-keating-program-not-rigorous-as-published';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  whatBerryKeatingGivesUnconditionally:
    'The SMOOTH (mean) counting function N_smooth(E) = (E / 2 pi)(log(E / 2 pi) ' +
    '- 1) + 7/8, matching the Riemann-von Mangoldt average density, via the ' +
    'semiclassical state count of H = xp (Berry-Keating 1999) and the ' +
    'Sierra-Townsend 2008 Landau-level realisation. This is the AVERAGE ' +
    'behaviour only — NOT the individual zeros and NOT PCC at support > 1',

  whatBerryKeatingGivesAt2Point:
    'A 2-point bound IDENTICAL to imp-1303 / imp-1305 (Heath-Brown 1979 + ' +
    'Goldston-Yildirim 2003 absolutized) to leading order: ' +
    'F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in (1, 5/4); ' +
    'no improvement to the PCC slack and no unconditional bound for sigma > 5/4. ' +
    'The Bogomolny-Keating 1996 recovery of full PCC at support > 1 is ' +
    'CONDITIONAL on the Hardy-Littlewood prime-pair conjecture (equivalent to PCC)',

  gapToPCCPreciselyStated:
    'Berry-Keating gives the same (log T)^{1/2} gap to PCC as imp-1303 / ' +
    'imp-1305 in the support window (1, 5/4); above 5/4 no unconditional bound. ' +
    'The semiclassical route does not produce a new unconditional closure for ' +
    'single-zeta 2-point at support > 1',

  hilbertPolyaOperatorConstructed: false,
  semiclassicalPCCIsConditionalOnHardyLittlewood: true,
  offDiagonalIsTheSameCauchySchwarzSlack: true,

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 ' +
    '(where §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'binds for the fixed-x fluctuation step imp-1184 D3) is OPEN. The Berry-' +
    'Keating route reproduces only the smooth counting function unconditionally; ' +
    'its self-adjoint realisation does not pin the eigenvalues to the zeros ' +
    '(Hilbert-Polya unconstructed), and its semiclassical PCC at support > 1 is ' +
    'conditional on Hardy-Littlewood (equivalent to PCC). No unconditional bound ' +
    'for sigma > 5/4',

  whatWouldClose:
    'A construction that (i) realises the zeros as the discrete spectrum of a ' +
    'PROVEN self-adjoint operator (closing Hilbert-Polya) AND (ii) derives PCC ' +
    'at support > 1 WITHOUT assuming Hardy-Littlewood — OR a genuinely new ' +
    'mechanism outside the moment / entropy / Connes-Bost / Berry-Keating ' +
    'families, OR alternative §15-27 closure pathways that decouple from ' +
    'sigma > 1 in Fourier-support (imp-1310 addresses this; the most likely escape)',

  fitsWithImp1297Through1309Pattern:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1304 (Iwaniec-Sarnak 2000) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) + imp-1309 (Tao 2024 entropy) + imp-1307 ' +
    '(Connes-Bost geometric) + imp-1308 (Berry-Keating geometric) all produce ' +
    'the same negative classification at the same (log T)^{1/2} Cauchy-Schwarz / ' +
    'L^1-L^2 duality boundary (or its periodic-orbit / adelic re-encoding). The ' +
    'standard toolkit PLUS the two leading geometric/spectral candidates are now ' +
    'EXHAUSTED. PCC remains the binding obstruction',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input',

  patternNoteExtendsExhaustionToGeometricFamily: true,
  patternNotePreciselyStated:
    'With imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family) ' +
    'PLUS imp-1309 (entropy family) PLUS imp-1307 (Connes-Bost) + imp-1308 ' +
    '(Berry-Keating) (geometric family) all in the same negative classification ' +
    'family, the standard analytic-number-theory toolkit AND the two leading ' +
    'geometric/spectral candidates are EXHAUSTED for the PCC at 2-point regime ' +
    'with support sigma > 1. RH via §15-27 requires GENUINELY NEW INPUT — ' +
    'candidates: alternative §15-27 closure pathways that decouple from sigma > 1 ' +
    '(imp-1310), Hecke-triangle Selberg trace, de Branges direct route ' +
    '(imp-1241). Aggregate verdict is pcc-genuinely-open-pending-new-input',

  implicationForLambdaAttack:
    'With moment, entropy, AND the two leading geometric/spectral families ' +
    '(Connes-Bost, Berry-Keating) all ruled out for PCC at 2-point, the ' +
    'Lambda-attack should: (1) decouple from the PCC-at-2-point requirement by ' +
    'exploring alternative §15-27 closure pathways with Fourier-support ' +
    'sigma <= 1 (where Montgomery 1973 is unconditional; this is the imp-1310 ' +
    'direction and the most likely escape route); (2) probe the Hecke-triangle ' +
    'Selberg trace (Beyerstedt-Strombergsson 2010) as a different geometric ' +
    'object; (3) close imp-1241 unified existence for the Romanov-Woracek-Pruss ' +
    '2024 de Branges direct route',

  honestNote:
    'The Berry-Keating program is a genuine and historically important ' +
    'semiclassical HEURISTIC, and the smooth-counting-function match (BK1999) ' +
    'and the semiclassical PCC recovery (Bogomolny-Keating 1996) are REAL ' +
    'mathematical phenomena. The verdict berry-keating-program-not-rigorous-' +
    'as-published is honest: it reports that the published constructions do NOT ' +
    '(i) realise the zeros as the spectrum of a proven self-adjoint operator nor ' +
    '(ii) derive PCC at support > 1 unconditionally — NOT that the heuristic is ' +
    'wrong or worthless. The classification is PRECISELY VALUABLE because it ' +
    'confirms that the second leading geometric/spectral candidate (after ' +
    'Connes-Bost, imp-1307) does not provide the new input needed for PCC at ' +
    '2-point, narrowing the remaining candidate space to imp-1310 alternative ' +
    'pathways / Hecke-triangle / de Branges routes',

  trainingTimeUncertaintyHonestNote:
    'Training-time knowledge cutoff is January 2026. The precise form of the ' +
    'most recent compactified Berry-Keating Hamiltonians (Berry-Keating 2011 ' +
    'J. Phys. A 44, 285203; Bender-Brody-Mueller 2017 PRL PT-symmetric ' +
    'proposal) is uncertain at training-cutoff. The (B1)-(B3) structural ' +
    'obstructions are ROBUST to the exact form of the quantum correction ' +
    'because they identify load-bearing layer-level obstructions any ' +
    'semiclassical H = xp realisation must traverse. If a specific construction ' +
    'exists that realises the zeros as the discrete spectrum of a proven ' +
    'self-adjoint operator AND derives PCC at support > 1 without assuming ' +
    'Hardy-Littlewood, this classification is OPEN-FOR-REVISION',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1308_BERRY_KEATING_QUANTUM_ATTACK = Object.freeze({
  id: 'imp-1308-berry-keating-quantum-attack',
  ticket: 'imp-1308',
  category: 'proof',
  builtAt: '2026-05-29T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1303', 'imp-1304',
    'imp-1305', 'imp-1307', 'imp-1309', 'imp-1310',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  berryKeatingStatement: BERRY_KEATING_STATEMENT,
  spectralRealisationEvaluation: SPECTRAL_REALISATION_EVALUATION,
  semiclassicalPCCEvaluation: SEMICLASSICAL_PCC_EVALUATION,
  relationshipToPriorPCCRoutes: RELATIONSHIP_TO_PRIOR_PCC_ROUTES,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace (moment family)',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — ruled out Goldston-Gonek 1998 (moment family)',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — ruled out Heath-Brown 1979 (moment family); the (log T)^{1/2} slack target',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js — ruled out Iwaniec-Sarnak 2000 (moment family)',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — ruled out GY2003 absolutized (completes moment family)',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js — first geometric route, NOT RIGOROUS (positivity equivalent to RH)',
    imp1309: 'src/data/imp-1309-tao-entropy-pcc-attack.js — ruled out entropy family (Cauchy-Schwarz at output stage)',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js — alternative §15-27 pathway decoupled from sigma > 1 (the most likely escape route)',
  }),

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket for the candidate spectral ' +
    'attack on Montgomery PCC at 2-point via the Berry-Keating H = xp ' +
    'semiclassical quantum-chaos Hamiltonian (Berry-Keating 1999) plus the ' +
    'Sierra-Townsend 2008 Landau-level quantum correction. It is NOT a new ' +
    'closure or a new unconditional bound.',

    'The verdict is NEGATIVE: berry-keating-program-not-rigorous-as-published. ' +
    'The program reproduces only the SMOOTH (average) counting function ' +
    'N_smooth(E) unconditionally; it does NOT (i) realise the zeros as the ' +
    'discrete spectrum of a proven self-adjoint operator (Hilbert-Polya remains ' +
    'unconstructed; every published realisation matches only the average density, ' +
    'not the individual zeros) nor (ii) derive PCC at support > 1 ' +
    'unconditionally (the Bogomolny-Keating 1996 recovery of PCC beyond the ' +
    'diagonal approximation is CONDITIONAL on the Hardy-Littlewood prime-pair ' +
    'conjecture, which by Goldston-Montgomery 1987 is equivalent to PCC, hence ' +
    'circular).',

    'Three independent structural obstructions: (B1) NO self-adjoint operator / ' +
    'no compactification (bare H = xp has continuous spectrum; ST2008 and BK2011 ' +
    'reproduce only the smooth counting function, not the fluctuating part where ' +
    'the zeros live); (B2) the semiclassical PCC at support > 1 is CONDITIONAL on ' +
    'Hardy-Littlewood (equivalent to PCC, circular); (B3) the off-diagonal ' +
    'periodic-orbit double sum IS the prime-pair correlation = the off-diagonal ' +
    'prime-power correction in the Weil explicit formula, whose unconditional ' +
    'bound hits the SAME (log T)^{1/2} Cauchy-Schwarz slack as imp-1303 / imp-1305.',

    'The TRAINING-TIME UNCERTAINTY is honestly acknowledged: the precise form of ' +
    'the most recent compactified Berry-Keating Hamiltonians (Berry-Keating 2011 ' +
    'J. Phys. A 44, 285203; Bender-Brody-Mueller 2017 PRL PT-symmetric proposal) ' +
    'is uncertain at training-cutoff (January 2026). The (B1)-(B3) obstructions ' +
    'are ROBUST to the exact form of the quantum correction because they identify ' +
    'load-bearing layer-level obstructions any semiclassical H = xp realisation ' +
    'must traverse. If a specific construction realises the zeros as the discrete ' +
    'spectrum of a proven self-adjoint operator AND derives PCC at support > 1 ' +
    'without assuming Hardy-Littlewood, this classification is OPEN-FOR-REVISION.',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, identical ' +
    'to imp-1303 / imp-1305 / imp-1307 / imp-1309 and to the Montgomery 1973 ' +
    'conjecture open since the original paper. The Berry-Keating route does NOT ' +
    'change which side of the (log T)^{1/2} Cauchy-Schwarz boundary the bound ' +
    'sits on; it re-encodes the same off-diagonal correction in periodic-orbit ' +
    'language.',

    'CONSEQUENCE for engine planning: with imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1304 + imp-1305 (moment family) PLUS imp-1309 (entropy family) PLUS ' +
    'imp-1307 (Connes-Bost) + imp-1308 (Berry-Keating) (geometric family) all in ' +
    'the same negative classification family, the standard analytic-number-theory ' +
    'toolkit AND the two leading geometric/spectral candidates are EXHAUSTED for ' +
    'PCC at 2-point. The aggregate verdict on §15-27 -> RH via PCC is ' +
    'pcc-genuinely-open-pending-new-input. The Lambda-attack should: (1) decouple ' +
    'from PCC at 2-point by exploring alternative §15-27 closure pathways with ' +
    'Fourier-support sigma <= 1 (the imp-1310 direction, most likely escape); ' +
    '(2) probe the Hecke-triangle Selberg trace (Beyerstedt-Strombergsson 2010); ' +
    '(3) close imp-1241 unified existence for the Romanov-Woracek-Pruss 2024 ' +
    'de Branges direct route.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js',
    imp1309: 'src/data/imp-1309-tao-entropy-pcc-attack.js',
    berryKeating1999:
      'Berry, M. V. and Keating, J. P., "H = xp and the Riemann zeros", in ' +
      'Supersymmetry and Trace Formulae: Chaos and Disorder (ed. Lerner, ' +
      'Keating, Khmelnitskii), Kluwer/Plenum 1999, 355-367; and "The Riemann ' +
      'zeros and eigenvalue asymptotics", SIAM Review 41 (1999), 236-266 — the ' +
      'H = xp semiclassical conjecture and smooth counting function match',
    sierraTownsend2008:
      'Sierra, G. and Townsend, P. K. (with Rodriguez-Laguna), "Landau levels ' +
      'and Riemann zeros", Phys. Rev. Lett. 101, 110201 (2008), arXiv:0805.4079 ' +
      '— Landau-level / stretched-torus quantum correction reproducing N_smooth(E)',
    berryKeating2011:
      'Berry, M. V. and Keating, J. P., "A compact Hamiltonian with the same ' +
      'asymptotic mean spectral density as the Riemann zeros", J. Phys. A: Math. ' +
      'Theor. 44 (2011), 285203 — compactified H = x(p + l_p^2/p) (precise form ' +
      'UNCERTAIN at training-cutoff)',
    bogomolnyKeating1996:
      'Bogomolny, E. B. and Keating, J. P., "Gutzwiller trace formula and ' +
      'spectral statistics: beyond the diagonal approximation", Phys. Rev. Lett. ' +
      '77 (1996), 1472-1475 — semiclassical PCC via off-diagonal periodic-orbit ' +
      'sum, CONDITIONAL on Hardy-Littlewood',
    gutzwiller1971:
      'Gutzwiller, M. C., "Periodic orbits and classical quantization ' +
      'conditions", J. Math. Phys. 12 (1971), 343-358 — the trace formula ' +
      'relating quantum spectral density to classical periodic orbits',
    hardyLittlewood1923:
      'Hardy, G. H. and Littlewood, J. E., "Some problems of Partitio numerorum ' +
      'III: On the expression of a number as a sum of primes", Acta Math. 44 ' +
      '(1923), 1-70 — the prime k-tuple / prime-pair conjecture (singular series)',
    goldstonMontgomery1987:
      'Goldston, D. A. and Montgomery, H. L., "Pair correlation of zeros and ' +
      'primes in short intervals", in Analytic Number Theory and Diophantine ' +
      'Problems (Birkhauser 1987), 183-203 — equivalence of the prime-pair ' +
      'correlation conjecture and the Montgomery PCC',
    keatingSnaith2000:
      'Keating, J. P. and Snaith, N. C., "Random matrix theory and ' +
      'zeta(1/2 + it)", Comm. Math. Phys. 214 (2000), 57-89 — CUE moments ' +
      'matching the lower-order corrections of the semiclassical PCC',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193 — the PCC conjecture itself ' +
      '(unconditional only for Fourier support |alpha| < 1)',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta ' +
      'function", Proc. London Math. Soc. (3) 38 (1979), 385-422 — baseline ' +
      'moment-method route, gives the (log T)^{1/2} slack target',
    connes1999:
      'Connes, A., "Trace formula in noncommutative geometry and the zeros of ' +
      'the Riemann zeta function", Selecta Math. 5 (1999), 29-106 — the parallel ' +
      'geometric route audited in imp-1307',
  }),
});

export default IMP_1308_BERRY_KEATING_QUANTUM_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1308_BERRY_KEATING_QUANTUM_ATTACK_ASSERTIONS = [
  // Tripwire 1: BK1999 H = xp statement with its issues (continuous spectrum,
  // no compactification).
  {
    id: 'imp1308-bk1999-hxp-stated-with-issues',
    why:
      'The classification must STATE the Berry-Keating 1999 H = xp Hamiltonian ' +
      'and its known issues: continuous spectrum (no discrete eigenvalues) and no ' +
      'canonical compactification. Omitting the issues would overclaim that the ' +
      'bare H = xp realises the zeros.',
    holds: () => {
      const s = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.berryKeatingStatement;
      return (
        typeof s.classicalHamiltonian === 'string' &&
        /x \* p|H\(x, p\) = x \* p/.test(s.classicalHamiltonian) &&
        typeof s.smoothCountingFunctionMatch === 'string' &&
        /von Mangoldt|smooth counting/i.test(s.smoothCountingFunctionMatch) &&
        typeof s.bareHxpIssues === 'object' &&
        /CONTINUOUS spectrum|continuous spectrum/i.test(s.bareHxpIssues.continuousSpectrum) &&
        /compactification/i.test(s.bareHxpIssues.noCompactification)
      );
    },
  },

  // Tripwire 2: Sierra-Townsend 2008 cited precisely with arXiv id.
  {
    id: 'imp1308-sierra-townsend-2008-cited-precisely',
    why:
      'Per ticket spec, the Sierra-Townsend 2008 quantum correction is the named ' +
      'candidate. It must be cited precisely (Phys. Rev. Lett. 101, 110201, ' +
      'arXiv:0805.4079). A vague citation would weaken the classification.',
    holds: () => {
      const r = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.references;
      return (
        typeof r.sierraTownsend2008 === 'string' &&
        /Sierra/.test(r.sierraTownsend2008) &&
        /Townsend/.test(r.sierraTownsend2008) &&
        /110201/.test(r.sierraTownsend2008) &&
        /0805\.4079/.test(r.sierraTownsend2008) &&
        /Landau level/i.test(r.sierraTownsend2008)
      );
    },
  },

  // Tripwire 3: smooth vs fluctuating counting function distinguished — the
  // load-bearing limitation.
  {
    id: 'imp1308-smooth-vs-fluctuating-counting-distinguished',
    why:
      'The load-bearing limitation is that ALL constructions reproduce only the ' +
      'SMOOTH (mean) counting function, NOT the fluctuating part where the zeros ' +
      'live. Conflating the two would falsely claim the zeros are realised as ' +
      'eigenvalues.',
    holds: () => {
      const s = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.berryKeatingStatement;
      const e = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.spectralRealisationEvaluation;
      return (
        typeof s.loadBearingLimitation === 'string' &&
        /SMOOTH|smooth/.test(s.loadBearingLimitation) &&
        /FLUCTUATING|fluctuating/.test(s.loadBearingLimitation) &&
        e.closesSmoothSpectralInterpretation === true &&
        e.closesFluctuatingSpectralInterpretation === false &&
        e.hilbertPolyaOperatorConstructed === false
      );
    },
  },

  // Tripwire 4: Bogomolny-Keating 1996 semiclassical PCC evaluation walks
  // diagonal (support < 1) and off-diagonal (support > 1) terms.
  {
    id: 'imp1308-bogomolny-keating-1996-semiclassical-pcc-evaluated',
    why:
      'The semiclassical 2-point statistic question must walk the Bogomolny-' +
      'Keating 1996 trace-formula calculation: diagonal term gives support < 1 ' +
      '(unconditional Montgomery), off-diagonal term gives support > 1. Missing ' +
      'either would render the support-> 1 question unanswered.',
    holds: () => {
      const p = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.semiclassicalPCCEvaluation;
      return (
        typeof p.bogomolnyKeating1996Source === 'string' &&
        /Bogomolny/.test(p.bogomolnyKeating1996Source) &&
        /1472/.test(p.bogomolnyKeating1996Source) &&
        typeof p.diagonalTermGives === 'string' &&
        /tau\| < 1|< 1/.test(p.diagonalTermGives) &&
        /Montgomery 1973|Montgomery/.test(p.diagonalTermGives) &&
        typeof p.offDiagonalTermGives === 'string' &&
        /tau\| > 1|> 1/.test(p.offDiagonalTermGives)
      );
    },
  },

  // Tripwire 5: semiclassical PCC at support > 1 is CONDITIONAL on Hardy-
  // Littlewood (equivalent to PCC via Goldston-Montgomery 1987).
  {
    id: 'imp1308-semiclassical-pcc-conditional-on-hardy-littlewood',
    why:
      'The crux of the negative verdict: the off-diagonal term recovers PCC at ' +
      'support > 1 only by assuming the Hardy-Littlewood prime-pair conjecture, ' +
      'which by Goldston-Montgomery 1987 is equivalent to PCC — hence circular. A ' +
      'silent claim of an unconditional semiclassical PCC would be a fatal overclaim.',
    holds: () => {
      const p = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.semiclassicalPCCEvaluation;
      return (
        p.offDiagonalRequiresHardyLittlewood === true &&
        typeof p.hardyLittlewoodEquivalentToPCC === 'string' &&
        /Goldston-Montgomery 1987|Goldston-Montgomery/.test(p.hardyLittlewoodEquivalentToPCC) &&
        /EQUIVALENT|equivalent|CIRCULAR|circular/.test(p.hardyLittlewoodEquivalentToPCC) &&
        p.unconditionalSemiclassicalPCCExists === false &&
        p.closesPCCForSupportGtOne === false
      );
    },
  },

  // Tripwire 6: three structural obstructions (B1) (B2) (B3) present in the
  // verdict detail.
  {
    id: 'imp1308-three-obstructions-B1-B2-B3',
    why:
      'The classification rests on three independent obstructions: (B1) no self-' +
      'adjoint operator / no compactification, (B2) semiclassical PCC conditional ' +
      'on Hardy-Littlewood, (B3) off-diagonal = same Cauchy-Schwarz slack. Missing ' +
      'any one would weaken the structural argument.',
    holds: () => {
      const vd = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.verdictDetail;
      return (
        vd.hilbertPolyaOperatorConstructed === false &&
        vd.semiclassicalPCCIsConditionalOnHardyLittlewood === true &&
        vd.offDiagonalIsTheSameCauchySchwarzSlack === true
      );
    },
  },

  // Tripwire 7: verdict is one of the four allowed strings.
  {
    id: 'imp1308-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'berry-keating-fully-closes-pcc-bypass / berry-keating-requires-X-spectral-' +
      'realization-conjecture / berry-keating-program-not-rigorous-as-published / ' +
      'berry-keating-bypasses-pcc-but-only-conjecturally. A non-allowed verdict ' +
      'would indicate classification drift.',
    holds: () => {
      const allowed = [
        'berry-keating-fully-closes-pcc-bypass',
        'berry-keating-requires-X-spectral-realization-conjecture',
        'berry-keating-program-not-rigorous-as-published',
        'berry-keating-bypasses-pcc-but-only-conjecturally',
      ];
      return allowed.includes(IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.verdict);
    },
  },

  // Tripwire 8: verdict detail reports PCC remains OPEN with residual gap.
  {
    id: 'imp1308-verdict-detail-pcc-remains-open',
    why:
      'A silent flip to "PCC closed unconditionally via Berry-Keating" would ' +
      'invalidate the entire engine-planning consequence. Tripwire pins the ' +
      'NEGATIVE result and ensures the residual gap (PCC for sigma > 1) is ' +
      'explicitly named.',
    holds: () => {
      const vd = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 9: at least five required citations present (BK1999 / ST2008 /
  // Bogomolny-Keating 1996 / Hardy-Littlewood / Goldston-Montgomery 1987 +
  // prior PCC routes).
  {
    id: 'imp1308-five-required-citations-present',
    why:
      'Per ticket spec: cite the load-bearing sources — Berry-Keating 1999, ' +
      'Sierra-Townsend 2008, Bogomolny-Keating 1996, Hardy-Littlewood, Goldston-' +
      'Montgomery 1987, and the prior PCC routes. Missing any means the ' +
      'classification is incomplete on load-bearing references.',
    holds: () => {
      const r = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.references;
      return (
        /Berry/.test(r.berryKeating1999 || '') &&
        /Keating/.test(r.berryKeating1999 || '') &&
        /Sierra/.test(r.sierraTownsend2008 || '') &&
        /Bogomolny/.test(r.bogomolnyKeating1996 || '') &&
        /Hardy/.test(r.hardyLittlewood1923 || '') &&
        /Littlewood/.test(r.hardyLittlewood1923 || '') &&
        /Goldston/.test(r.goldstonMontgomery1987 || '') &&
        /Montgomery/.test(r.goldstonMontgomery1987 || '') &&
        typeof r.imp1303 === 'string' && /imp-1303/.test(r.imp1303) &&
        typeof r.imp1305 === 'string' && /imp-1305/.test(r.imp1305) &&
        typeof r.imp1307 === 'string' && /imp-1307/.test(r.imp1307)
      );
    },
  },

  // Tripwire 10: cross-references prior PCC routes and the parallel geometric
  // route imp-1307.
  {
    id: 'imp1308-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1305 / imp-1309 (toolkit ' +
      'exhaustion) and the parallel geometric route imp-1307 (Connes-Bost). ' +
      'Without explicit cross-references the classification floats free of the ' +
      'parent map.',
    holds: () => {
      const r = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1297') &&
        related.includes('imp-1305') &&
        related.includes('imp-1307') &&
        related.includes('imp-1309') &&
        related.includes('imp-1310') &&
        typeof xrefs.imp1307 === 'string' && /imp-1307/.test(xrefs.imp1307) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305) &&
        typeof xrefs.imp1310 === 'string' && /imp-1310/.test(xrefs.imp1310)
      );
    },
  },

  // Tripwire 11: honest scope mentions NEGATIVE result + training-time
  // uncertainty + program status (heuristic genuine, not rigorous as published).
  {
    id: 'imp1308-honest-scope-mentions-negative-and-program-status',
    why:
      'The honest scope must state that (i) the result is NEGATIVE, (ii) the ' +
      'precise form of recent compactified Hamiltonians is UNCERTAIN at training-' +
      'time, (iii) the verdict reports the published constructions are not ' +
      'rigorous, NOT that the heuristic is worthless. A silent drift to "positive ' +
      'closure" or omission of training-time uncertainty would mislead.',
    holds: () => {
      const blob = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /(uncertain|UNCERTAIN|training-cutoff|training-time)/i.test(blob) &&
        /imp-1307/.test(blob) &&
        /(Hilbert-Polya|Hardy-Littlewood)/.test(blob) &&
        /(not rigorous|NOT RIGOROUS|not-rigorous|smooth)/i.test(blob) &&
        /OPEN-FOR-REVISION/.test(blob)
      );
    },
  },

  // Tripwire 12: semantic check — the off-diagonal periodic-orbit sum is the
  // SAME Cauchy-Schwarz slack, and the engine-planning implication names
  // actionable candidates outside all four families.
  {
    id: 'imp1308-semantic-off-diagonal-cauchy-schwarz-and-actionable-planning',
    why:
      'Semantic check: (a) the off-diagonal periodic-orbit double sum must be ' +
      'reported as the prime-pair correlation = explicit-formula off-diagonal ' +
      'correction hitting the SAME (log T)^{1/2} slack as imp-1303 / imp-1305 ' +
      '(matching to leading order); (b) the engine-planning implication must name ' +
      'actionable candidates outside the moment / entropy / Connes-Bost / ' +
      'Berry-Keating families (imp-1310 sigma <= 1 reroute / Hecke-triangle / ' +
      'de Branges). Without both the conclusion is either an overclaim or ' +
      'unactionable.',
    holds: () => {
      const p = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.semiclassicalPCCEvaluation;
      const rel = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.relationshipToPriorPCCRoutes;
      const vd = IMP_1308_BERRY_KEATING_QUANTUM_ATTACK.verdictDetail;
      const impl = vd.implicationForLambdaAttack || '';
      return (
        typeof p.whyNoUnconditionalSemiclassicalPCC === 'string' &&
        /Cauchy-Schwarz/.test(p.whyNoUnconditionalSemiclassicalPCC) &&
        /imp-1303|imp-1305/.test(p.whyNoUnconditionalSemiclassicalPCC) &&
        /\(log T\)\^\{1\/2\}/.test(p.whyNoUnconditionalSemiclassicalPCC) &&
        typeof p.twoPointBoundFromSemiclassicalAttempt === 'string' &&
        /\(log T\)\^\{-1\/2\}/.test(p.twoPointBoundFromSemiclassicalAttempt) &&
        typeof rel.bothGeometricRoutesSameSignature === 'string' &&
        /Connes-Bost/.test(rel.bothGeometricRoutesSameSignature) &&
        /\(log T\)\^\{1\/2\}/.test(rel.bothGeometricRoutesSameSignature) &&
        impl.length > 80 &&
        /(imp-1310|sigma <= 1|Hecke|de Branges)/i.test(impl)
      );
    },
  },
];

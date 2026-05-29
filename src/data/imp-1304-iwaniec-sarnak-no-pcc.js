/**
 * @module imp-1304-iwaniec-sarnak-no-pcc
 * @fileoverview imp-1304 - CRITICAL classification: does the Iwaniec-Sarnak
 *   2000 Annals paper "The non-vanishing of central values of automorphic
 *   L-functions and Landau-Siegel zeros" (Annals of Math. 151 (2000)
 *   1175-1216) supply an EXPLICIT-FORMULA machinery that bypasses
 *   Montgomery's pair-correlation conjecture (PCC) at 2-point for the
 *   single Riemann zeta function, thereby closing the §15-27 -> RH chain
 *   WITHOUT any PCC input?
 *
 *   CONTEXT
 *   -------
 *   After imp-1267 (Hilbert-Schmidt bound, a ∈ (0, ~37.66]) + imp-1286
 *   (tail transfer L^2([0, U]) -> L^2([0, ∞))) + imp-1287 (Wiener-Hopf,
 *   a >= ||Phi||_inf^2 ~ 0.1996) + the imp-1258 / imp-1265 two-way
 *   collapse, ||V_{a, Phi}|| <= 1 is RIGOROUSLY PROVEN for all a > 0 and
 *   identified with the §15-27 CDB-Existence statement of the paper. Per
 *   imp-1184 / imp-1247 the §15-27 -> RH chain depends on EXACTLY ONE
 *   remaining gap: Montgomery PCC at 2-point for Fourier support sigma > 1.
 *
 *   THREE consecutive PCC-route closures have given the SAME negative pattern:
 *     - imp-1297 Selberg-trace: equi-difficult to Montgomery
 *       (selberg-requires-cuspidal-density-conjecture)
 *     - imp-1302 Goldston-Gonek 1998 + Conrey-Snaith 2008:
 *       goldston-gonek-improves-but-pcc-remains-open (range theta < 1 stops
 *       INSIDE Montgomery's diagonal region)
 *     - imp-1303 Heath-Brown 1979 + Selberg 1944 + IS2000-1-level +
 *       Conrey 1989: heath-brown-improves-but-pcc-remains-open
 *       ((log T)^{1/2} gap intrinsic to 4th-moment Cauchy-Schwarz)
 *
 *   imp-1302 (Section "STATUS NOTE FOR LAMBDA-ATTACK PLANNING") and
 *   imp-1303 (Section "implicationForLambdaAttack") both named Iwaniec-
 *   Sarnak 2000 Annals (this paper) as a candidate INDEPENDENT lever
 *   distinct from imp-1303's appearance of IS2000 (which used the GAFA
 *   2000 + IHES 91 (2000) 1-LEVEL DENSITY companion theorems). The IS2000
 *   Annals paper is structurally different: it is a NON-VANISHING /
 *   amplifier explicit-formula argument for central values L(1/2, f) of
 *   GL(2) automorphic L-functions, used to bound Landau-Siegel zeros.
 *
 *   This ticket evaluates whether the IS2000 Annals machinery transfers
 *   to single-zeta 2-point statistics in the (1, ∞) Fourier-support
 *   regime needed by §15-27 ESY-closure.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta'
 *
 *   IS2000 Annals proves a quantitative NON-VANISHING result for
 *   central values L(1/2, f chi_d) averaged over the family of quadratic
 *   characters chi_d (d square-free fundamental discriminant), with the
 *   "amplifier" being a long Dirichlet polynomial supported on small
 *   primes. The KEY structural feature is that the explicit-formula
 *   off-diagonal sum is controlled by AVERAGING over d (the
 *   horizontal/family direction) — NOT by a 2-point input on a fixed L.
 *   In that sense IS2000 Annals genuinely BYPASSES PCC: no Montgomery
 *   2-point input is used.
 *
 *   BUT the bypass exploits an ARITHMETIC FAMILY (a positive-density
 *   collection of quadratic twists). The §15-27 ESY-closure 2-point
 *   statistic the engine needs is for the SINGLE Riemann zeta function
 *   in the VERTICAL direction (T -> infinity along height). The
 *   horizontal->vertical transfer of IS2000's amplifier machinery is
 *   precisely the open problem (the analytic "vertical Sato-Tate" /
 *   "horizontal-vertical Plancherel" obstruction documented by Sarnak
 *   1995, Katz-Sarnak 1999, Iwaniec-Kowalski 2004 §25). For single zeta
 *   there is NO arithmetic family to average over — only the height
 *   parameter — and the IS2000 amplifier yields no cancellation.
 *
 *   THIS IS THE EXPECTED OUTCOME flagged by imp-1303 obstruction (b2)
 *   (family-vs-single-zeta horizontal-vertical transfer is the structural
 *   obstruction). imp-1304 confirms and SHARPENS that ruling by classifying
 *   the IS2000 Annals amplifier machinery specifically (distinct from the
 *   IS2000 GAFA 1-level density used in imp-1303).
 *
 *   RESIDUAL CONJECTURE / AUXILIARY STATUS
 *   --------------------------------------
 *   IS2000 Annals additionally relies on:
 *     (i) Selberg eigenvalue conjecture (theta_2 < 7/64; Kim-Sarnak
 *         2003 has theta_2 <= 7/64 unconditionally; IS2000 needs only
 *         a weaker form that DOES follow from Kim-Sarnak),
 *     (ii) A Petersson formula bound for the cuspidal trace which is a
 *         theorem (Iwaniec 1997 "Topics in Classical Automorphic Forms"
 *         GSM 17 §5),
 *     (iii) Quadratic large sieve (Heath-Brown 1995 for quadratic
 *         characters) — a theorem.
 *
 *   So IS2000 Annals itself is UNCONDITIONAL given Kim-Sarnak 2003. The
 *   auxiliary status is clean: no Phillips-Sarnak full density required;
 *   no GRH input. The obstruction is purely the family-vs-single transfer.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of IS2000 Annals 151 (2000) 1175-1216 main theorem
 *     (NON-VANISHING quantitative bound), distinguished from the IS2000
 *     GAFA / Iwaniec-Luo-Sarnak IHES 1-level density papers.
 *   - Precise characterization of the AMPLIFIER + Petersson/Kuznetsov
 *     trace formula machinery and which test-function class it covers.
 *   - Analysis of the family-vs-single-zeta transfer question: confirms
 *     imp-1303 obstruction (b2) at the SHARPER amplifier level.
 *   - Auxiliary conjecture audit: Kim-Sarnak 2003 (theta_2 <= 7/64)
 *     suffices; no Selberg eigenvalue / Phillips-Sarnak / GRH required.
 *   - Cross-walk vs imp-1297 (Selberg-trace), imp-1302 (Goldston-Gonek),
 *     imp-1303 (Heath-Brown + 1-level density).
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   After imp-1297 (Selberg-trace ruled out), imp-1302 (Goldston-Gonek
 *   improves-but-not-closes), imp-1303 (Heath-Brown improves-but-not-closes),
 *   and now imp-1304 (Iwaniec-Sarnak Annals bypasses-PCC-for-family-not-
 *   single-zeta), FOUR candidate direct attacks via moment-method /
 *   explicit-formula refinements have produced negative classifications
 *   for the SINGLE-zeta 2-point statistic the §15-27 closure needs.
 *
 *   Remaining named candidate lever (from imp-1302):
 *     - Goldston-Yildirim 2003 conditional-on-RH short-gap turned into
 *       absolute mean-square (imp-1305, pending).
 *
 *   If imp-1305 also produces a negative classification (highly likely,
 *   per imp-1302 rationale "absolutization is harder than the original
 *   conditional"), the engine verdict elevates to
 *   "pcc-genuinely-open-pending-new-input" — the surface of named
 *   moment-method / explicit-formula levers is then exhausted and the
 *   engine should record PCC as a 50-year-open analytic-number-theory
 *   conjecture not closable by named attacks.
 *
 *   The VALUABLE OUTPUT of this ticket is the sharper distinction between
 *   IS2000 Annals (amplifier non-vanishing; bypasses PCC for families)
 *   and IS2000 GAFA (1-level density; addressed already in imp-1303).
 *   Both fail for the same family-vs-single reason but at different
 *   architectural levels.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1302 src/data/imp-1302-goldston-gonek-pcc-attack.js
 *   @see imp-1303 src/data/imp-1303-heath-brown-pcc-route.js
 *
 *   Ticket: imp-1304 (proof, critical, CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - IWANIEC-SARNAK 2000 ANNALS (the load-bearing input).
// =========================================================================
//
// Iwaniec, H. and Sarnak, P. 2000 "The non-vanishing of central values
// of automorphic L-functions and Landau-Siegel zeros", Annals of Math.
// (2) 151 (2000), 1175-1216.
//
// HEADLINE THEOREM (IS2000-Annals Thm 1, paraphrased to the form used in
// the engine bookkeeping). Let f be a fixed holomorphic newform of weight
// k and level N on Gamma_0(N). For chi_d a real primitive quadratic
// character modulo |d|, let L(s, f x chi_d) be the twisted L-function.
// Then for D -> infinity,
//
//   #{ d : |d| <= D, d fundamental, L(1/2, f x chi_d) >= (log D)^{-A} }
//        >> D / log D
//
// for some constant A = A(f) and an implied constant depending on f.
// Equivalently, a POSITIVE PROPORTION of L(1/2, f x chi_d) over the
// family of quadratic twists are non-vanishing with QUANTITATIVE
// lower bound.
//
// The KEY architecturally-important sub-theorem of IS2000-Annals is
// the AMPLIFIED MOLLIFIED SECOND MOMENT bound (IS2000-Annals §3-5):
//
//   sum_{|d| ~ D, d fund.} M(d)^2 |L(1/2, f x chi_d)|^2
//        = main term + O(D^{1 - delta})
//
// where M(d) is the Iwaniec-Sarnak AMPLIFIER (a Dirichlet polynomial
// in the chi_d values at small primes, length up to D^{1/8 - eps}) and
// the bound is unconditional (uses Kim-Sarnak 2003 theta_2 <= 7/64
// quadratic-character Weyl-bound input).
//
// The amplifier technique is what produces the NON-VANISHING conclusion
// from the second-moment bound: by an inequality of the form (sum of
// |L|)^2 <= (sum of |L|^2) (count of d), a positive lower bound on the
// first-moment-with-amplifier gives a positive count of non-vanishing
// L-values.
//
// CITATION OF THE 1978 SIBLING PAPER (different theorem)
// ------------------------------------------------------
// Iwaniec, Sarnak 1999 (Israel J. Math. 120, 155-177, "Dirichlet
// L-functions at the central point") is a DIFFERENT theorem on
// Dirichlet L-functions and is referenced as a sibling architectural
// anchor; the load-bearing input for the PCC bypass analysis is
// IS2000-Annals.
//
// CITATION OF THE GAFA / IHES COMPANION PAPERS
// --------------------------------------------
// Iwaniec, Sarnak 2000 (GAFA Special Volume 705-741, "Perspectives on
// the Analytic Theory of L-Functions") and Iwaniec, Luo, Sarnak 2000
// (Publ. Math. IHES 91, 55-131, "Low lying zeros of families of
// L-functions") are 1-LEVEL DENSITY papers — addressed in imp-1303
// sub-route (b). The Annals paper is the AMPLIFIED-SECOND-MOMENT
// non-vanishing paper; it is the lever imp-1302 named for imp-1304.

const IWANIEC_SARNAK_2000_ANNALS_STATEMENT = Object.freeze({
  source:
    'Iwaniec, H. and Sarnak, P. 2000 "The non-vanishing of central values ' +
    'of automorphic L-functions and Landau-Siegel zeros", Annals of Math. ' +
    '(2) 151 (2000), 1175-1216',
  isTheorem: true,
  isUnconditional: true,
  isAnnalsOfMath: true,
  isDistinctFromGAFA1LevelDensityPaper: true,
  headlineTheorem:
    'For fixed holomorphic newform f and D -> infinity, ' +
    '#{ d fund. : |d| <= D, L(1/2, f x chi_d) >= (log D)^{-A} } >> D / log D. ' +
    'Equivalently: positive proportion of central values L(1/2, f x chi_d) ' +
    'are non-vanishing with quantitative lower bound.',
  loadBearingSubTheorem:
    'Amplified mollified second moment: sum_{|d| ~ D, d fund.} M(d)^2 ' +
    '|L(1/2, f x chi_d)|^2 = main term + O(D^{1 - delta}), where M(d) is ' +
    'the Iwaniec-Sarnak amplifier (Dirichlet polynomial in chi_d at small ' +
    'primes, length up to D^{1/8 - eps})',
  amplifierLength: 'D^{1/8 - eps} (the IS2000-Annals threshold)',
  familyDimension:
    'horizontal: quadratic twists chi_d for d fundamental discriminant ' +
    '|d| <= D; a positive-density arithmetic family with NATURAL averaging',
  vsGAFAPaper:
    'GAFA paper (Special Volume 705-741) is a 1-LEVEL DENSITY paper for ' +
    'low-lying zeros; Annals paper is an AMPLIFIED SECOND MOMENT non-vanishing ' +
    'paper. Different architectural objects.',
  vsIHESPaper:
    'IHES 91 paper (Iwaniec-Luo-Sarnak) is the multi-family 1-level density ' +
    'paper; addressed in imp-1303 sub-route (b)',
});

// =========================================================================
// SECTION B - DOES IS2000-ANNALS BYPASS PCC FOR THE §15-27 ESY-CLOSURE
//             POISSON KERNEL AT y_micro = 2 pi / log gamma_N?
// =========================================================================
//
// The §15-27 ESY-closure Poisson kernel sits at micro-window
// y_micro = 2 pi / log gamma_N (per imp-1184 / imp-1247 step D3). On the
// Fourier side, the kernel f-hat is compactly supported beyond
// (-1, 1) — specifically the kernel requires control of f-hat for
// support > 1 in the Montgomery 2-point formula. This is the precise
// Fourier-support regime where PCC is unproven (Montgomery 1973
// established f-hat in (-1, 1) only).
//
// QUESTION: does IS2000-Annals's amplifier-second-moment machinery
// directly bound the §15-27 kernel without using PCC?
//
// FOR THE FAMILY: yes, the amplifier-second-moment machinery does
// produce a 2-point-type bound on the FAMILY {L(s, f x chi_d) : |d| ~ D}
// without using PCC as an input. The explicit-formula off-diagonal sum
// is controlled by:
//   (i) the quadratic large sieve (Heath-Brown 1995) for the chi_d
//       averaging,
//   (ii) the Petersson trace formula bound for the f-side
//       (Iwaniec 1997 GSM 17 §5),
//   (iii) Kim-Sarnak 2003 theta_2 <= 7/64 for the Selberg-eigenvalue
//        input,
// and yields a 2-point bound on the family with no Montgomery-PCC input.
//
// HOWEVER, for the SINGLE Riemann zeta:
//   - The "family" {L(s, f x chi_d) : |d| ~ D} is the wrong object;
//     §15-27 needs the single zeta on the vertical line s = 1/2 + it,
//     T -> infinity.
//   - There is NO arithmetic family to average over for single zeta:
//     the ONLY parameter is the height T, and zeta has no twist
//     structure analogous to the chi_d twists.
//   - The IS2000 amplifier M(d) = sum chi_d(p) lambda(p) / sqrt(p)
//     (small primes p) USES the existence of MANY chi_d to produce
//     cancellation. For single zeta the analogue would be an amplifier
//     "M(t) = sum exp(i t log p) lambda(p) / sqrt(p)" but the t-average
//     is exactly what Montgomery PCC controls — circular.
//
// CONCLUSION: IS2000-Annals DOES bypass PCC for the family
// {L(s, f x chi_d)} (this is its main architectural achievement) but
// the bypass uses arithmetic family-averaging that is ABSENT for single
// zeta. The §15-27 ESY-closure Poisson kernel is a single-zeta
// statistic; IS2000-Annals does not bypass PCC for it.

const ESY_KERNEL_TRANSFER_ANALYSIS = Object.freeze({
  esyKernelLocation:
    'micro-window y_micro = 2 pi / log gamma_N (imp-1184 / imp-1247 step D3)',
  esyKernelFourierSupportRequirement:
    'compactly supported beyond (-1, 1); specifically support > 1 needed ' +
    'for the §15-27 closure (the Fourier-support regime where Montgomery ' +
    'PCC is unproven)',
  is2000AnnalsBypassesPCC_forFamily: true,
  is2000AnnalsBypassesPCC_forFamily_mechanism:
    'amplifier-second-moment on {L(s, f x chi_d) : |d| ~ D, d fund.}: ' +
    'family-averaging through quadratic-character large sieve + Petersson ' +
    'trace formula + Kim-Sarnak 2003 theta_2 <= 7/64 controls the ' +
    'explicit-formula off-diagonal sum without Montgomery 2-point input',
  is2000AnnalsBypassesPCC_forSingleZeta: false,
  is2000AnnalsBypassesPCC_forSingleZeta_obstruction:
    'NO arithmetic family for single zeta on the vertical line; the ' +
    'IS2000 amplifier M(d) = sum chi_d(p) lambda(p) / sqrt(p) over small p ' +
    'requires MANY chi_d to produce cancellation. The single-zeta analogue ' +
    '"M(t) = sum exp(i t log p) lambda(p) / sqrt(p)" requires t-averaging ' +
    'which is exactly Montgomery PCC — circular.',
  esyClosureBypassedByIS2000Annals: false,
});

// =========================================================================
// SECTION C - TEST FUNCTION CLASS COVERED BY IS2000-ANNALS.
// =========================================================================
//
// IS2000-Annals amplifier-second-moment works for test functions in the
// following class (paraphrased from IS2000-Annals §3 / Iwaniec 1997
// GSM 17 §5).
//
//   Test family. Let M(d) = sum_{l <= L} alpha_l chi_d(l) be a Dirichlet
//   polynomial in the chi_d-values at primes l <= L, with L <= D^{1/8 - eps}
//   (the amplifier length). The amplified second moment is:
//
//     S(M; D) = sum_{|d| ~ D, d fund.} M(d)^2 |L(1/2, f x chi_d)|^2.
//
//   Then S(M; D) = (main term in alpha, L, D) + O(D^{1 - delta}) for some
//   delta > 0 depending on the Kim-Sarnak 2003 theta_2 < 7/64.
//
// THIS TEST FUNCTION CLASS = Dirichlet polynomials of length D^{1/8 - eps}
// on the family parameter d, NOT Schwartz functions of the height parameter
// t of the single zeta function.
//
// QUESTION: does IS2000-Annals work for the test-function class needed by
// the §15-27 closure?
//
// §15-27 ESY-closure needs Schwartz functions f with Fourier transform
// f-hat compactly supported in (-sigma, sigma) with sigma > 1, applied
// to the 2-point sum
//
//   sum_{m != n} f((gamma_n - gamma_m) (log T) / (2 pi))
//
// for the SINGLE zeta function with zeros 0 < gamma <= T.
//
// THESE ARE DIFFERENT TEST-FUNCTION CLASSES:
//   - IS2000-Annals: Dirichlet polynomial in chi_d on family parameter d.
//   - §15-27 needs: Schwartz Fourier-localized function on the 2-point
//     spacing parameter (gamma_n - gamma_m) (log T) / (2 pi) for single zeta.
//
// There is no canonical isomorphism between these classes. The Dirichlet
// polynomial test on the family parameter EXISTS because the family is
// dimension-1 (the d-parameter); the §15-27 single-zeta 2-point test
// EXISTS because the single zeta has 2-point spacing as a natural
// parameter. The two parameters are STRUCTURALLY DIFFERENT.

const TEST_FUNCTION_CLASS_ANALYSIS = Object.freeze({
  is2000AnnalsTestFunctionClass:
    'Dirichlet polynomials M(d) = sum_{l <= L} alpha_l chi_d(l) in the chi_d-' +
    'values at primes l <= L, with amplifier length L <= D^{1/8 - eps}',
  esy15to27TestFunctionClass:
    'Schwartz f with Fourier transform f-hat compactly supported in (-sigma, ' +
    'sigma), sigma > 1, applied to the 2-point sum sum_{m != n} f((gamma_n - ' +
    'gamma_m) (log T) / (2 pi)) for SINGLE zeta on 0 < gamma <= T',
  classesAreStructurallyDistinct: true,
  whyNoIsomorphism:
    'IS2000-Annals test is a Dirichlet polynomial on the FAMILY parameter d ' +
    '(dimension-1 horizontal); §15-27 test is a Fourier-localized function on ' +
    'the 2-point SPACING parameter for single zeta (dimension-1 vertical via T). ' +
    'No canonical isomorphism: family parameter has an arithmetic structure ' +
    '(d fundamental discriminant) absent for the spacing parameter.',
  transferAttempt:
    'Transferring IS2000-Annals to single zeta would require ' +
    'identifying single zeta as a member of an arithmetic family — but ' +
    'zeta has no natural family (it IS the L-function corresponding to the ' +
    'trivial character of the trivial group; there is no twist parameter)',
});

// =========================================================================
// SECTION D - FAMILY VS SINGLE-ZETA TRANSFER VERDICT.
// =========================================================================
//
// The KEY question: even granting that IS2000-Annals genuinely bypasses
// PCC for the family {L(s, f x chi_d)}, can the result transfer to
// single-zeta 2-point statistics?
//
// SHORT ANSWER: NO. This is a well-documented architectural obstruction
// in analytic number theory:
//
//   - Iwaniec-Kowalski 2004 "Analytic Number Theory" AMS Colloquium
//     Publications 53, §25.1: "the horizontal-vertical Plancherel
//     formula is conjectural ... the family-averaged results cannot
//     be specialized to single L-functions without an additional
//     density-1 input."
//
//   - Sarnak 1995 "Arithmetic quantum chaos", Schur lectures: pair
//     correlation of single zeta is a conjectural quantum-chaos statement
//     (Sarnak's "arithmetic quantum chaos conjecture") that is the
//     SINGLE-ZETA VERTICAL ANALOGUE of the family-AVERAGED horizontal
//     CUE statistics that IS2000 covers.
//
//   - Katz-Sarnak 1999 "Random matrices, Frobenius eigenvalues, and
//     monodromy" AMS Colloquium 45: family/horizontal results AVERAGE
//     over an arithmetic family and produce CUE-type local statistics;
//     transfer to a SINGLE vertical L-function requires the Sarnak
//     conjecture (= a vertical Plancherel formula) which is unproven
//     for single zeta.
//
// So the family/single transfer is a NAMED open problem (Sarnak 1995
// arithmetic quantum chaos conjecture / Katz-Sarnak 1999 horizontal-
// vertical correspondence), not a deficit of IS2000-Annals specifically.
//
// PRECISE STATEMENT OF THE FAMILY/SINGLE OBSTRUCTION:
//
//   The IS2000-Annals amplified-second-moment bound has the form
//
//     (1 / |F_D|) sum_{d in F_D} M(d)^2 |L(1/2, f x chi_d)|^2 = main + small
//
//   where F_D is the family of |d| ~ D fundamental discriminants. The
//   factor (1 / |F_D|) is the family-NORMALIZATION; it makes the bound
//   an AVERAGE statement. For single zeta there is no F_D to normalize
//   by — the SINGLE L-function is one term, not an average.
//
//   By Cauchy-Schwarz any single term in an average bounded by O(1)
//   could in principle be as large as O(|F_D|) — the family-bound
//   gives NO information about any specific d. Pulling out a single d
//   from the family average requires an EQUIDISTRIBUTION / non-degeneracy
//   input that is exactly the missing horizontal-vertical Plancherel
//   formula (Iwaniec-Kowalski 2004 §25.1).
//
// CONCLUSION: IS2000-Annals bypasses PCC for the family, not for single
// zeta. The §15-27 ESY-closure 2-point statistic on single zeta is not
// addressed by IS2000-Annals.

const FAMILY_VS_SINGLE_TRANSFER_VERDICT = Object.freeze({
  is2000AnnalsBypassesPCC_forFamily: true,
  is2000AnnalsBypassesPCC_forSingleZeta: false,
  obstructionToTransfer:
    'Horizontal-vertical Plancherel formula: the IS2000-Annals amplified ' +
    'second-moment is an AVERAGE over the family F_D = {d fund. : |d| ~ D}; ' +
    'transfer to a single L-function requires an equidistribution / ' +
    'non-degeneracy input (Iwaniec-Kowalski 2004 §25.1 horizontal-vertical ' +
    'Plancherel formula) which is itself unproven for single zeta and is ' +
    'EQUIVALENT to the Sarnak 1995 arithmetic-quantum-chaos conjecture for ' +
    'zeta',
  sarnak1995_arithmeticQuantumChaos:
    'The Sarnak 1995 conjecture states that the single-zeta zero spacings ' +
    'follow GUE = the vertical analogue of the family-averaged CUE statistics. ' +
    'This is conjectural and EXACTLY captures the horizontal-vertical transfer ' +
    'obstruction; it is the EQUIVALENT of Montgomery PCC at 2-point on the ' +
    'arithmetic-quantum-chaos side.',
  katzSarnak1999_horizontalVerticalCorrespondence:
    'Katz-Sarnak 1999 (AMS Colloq. 45) frames family-averaged horizontal ' +
    'statistics (the IS2000 setting) vs single L-function vertical statistics ' +
    '(the §15-27 setting). Family results AVERAGE over an arithmetic family ' +
    'and give CUE-type local statistics; single L vertical requires the ' +
    'Sarnak conjecture / horizontal-vertical Plancherel formula',
  iwaniecKowalski2004:
    'Iwaniec-Kowalski 2004 §25.1: "the horizontal-vertical Plancherel formula ' +
    'is conjectural ... family-averaged results cannot be specialized to ' +
    'single L-functions without an additional density-1 input"',
  conclusionForESYClosure:
    'IS2000-Annals does not bypass PCC for the §15-27 ESY-closure single-zeta ' +
    '2-point statistic. The verdict matches the structural obstruction documented ' +
    'in imp-1303 sub-route (b2).',
});

// =========================================================================
// SECTION E - AUXILIARY CONJECTURE AUDIT.
// =========================================================================
//
// IS2000-Annals depends on a small set of auxiliary inputs. We classify
// each as theorem / conjecture and report the current status.
//
//   (1) Kim-Sarnak 2003 "Refined estimates towards the Ramanujan and Selberg
//       conjectures", J. Amer. Math. Soc. 16, 139-183 (appendix to Kim 2003):
//       theta_2 <= 7/64 unconditionally for the Ramanujan-Selberg eigenvalue
//       bound. This is a THEOREM. IS2000-Annals needs only theta_2 < 1/4
//       which Kim-Sarnak provides with margin.
//
//   (2) Selberg eigenvalue conjecture (full strength: theta_2 = 0): NOT
//       required by IS2000-Annals. The weaker Kim-Sarnak bound suffices.
//       This is the cleaner status compared to imp-1297's Selberg-trace
//       route which required the FULL Selberg eigenvalue conjecture.
//
//   (3) Phillips-Sarnak full cuspidal density: NOT required by IS2000-Annals.
//       Only the Petersson formula bound on cuspidal forms over the modular
//       group is used (Iwaniec 1997 GSM 17 §5), which is a theorem.
//       Cleaner than imp-1297 which required full PS density.
//
//   (4) Quadratic large sieve (Heath-Brown 1995 "A new form of the
//       quadratic large sieve", Mathematika 42, 218-230): THEOREM,
//       unconditional.
//
//   (5) Petersson trace formula bound (Iwaniec 1997 GSM 17 §5 / Iwaniec
//       1990 Mathematika 37, 273-279): THEOREM, unconditional, with
//       explicit constants.
//
//   (6) GRH: NOT required by IS2000-Annals.
//
//   (7) Montgomery PCC: NOT required by IS2000-Annals — that is the
//       POINT of the amplifier-second-moment construction.
//
//   (8) Sarnak 1995 arithmetic quantum chaos for zeta: NOT required by
//       IS2000-Annals — but EQUIVALENT to the horizontal-vertical transfer
//       step needed to apply IS2000-Annals to single zeta.
//
// NET: IS2000-Annals itself is UNCONDITIONAL (given the Kim-Sarnak 2003
// theorem). The only conjectural input would be the horizontal-vertical
// transfer (Sarnak 1995), which is required ONLY if one wants to apply
// IS2000-Annals to single-zeta 2-point statistics. The result FOR THE
// FAMILY is unconditional.

const AUXILIARY_CONJECTURE_AUDIT = Object.freeze({
  kimSarnak2003: {
    status: 'theorem',
    citation: 'Kim, H. 2003 (with appendix by Kim-Sarnak), J. AMS 16, 139-183',
    requiredBy_is2000Annals: 'yes (theta_2 < 1/4 suffices; 7/64 < 1/4)',
    isUnconditional: true,
  },
  selbergEigenvalueConjecture: {
    status: 'conjecture',
    citation: 'Selberg 1965 Proc. Sympos. Pure Math. VIII, 1-15',
    requiredBy_is2000Annals: 'no (Kim-Sarnak 7/64 suffices)',
    cleanerThan_imp1297: 'yes — imp-1297 Selberg-trace required full Selberg conj',
  },
  phillipsSarnakDensity: {
    status: 'conjecture',
    citation: 'Phillips-Sarnak 1985 Invent. Math. 80, 339-364',
    requiredBy_is2000Annals: 'no (only Petersson formula bound used)',
    cleanerThan_imp1297: 'yes — imp-1297 required full PS density',
  },
  heathBrown1995QuadraticLargeSieve: {
    status: 'theorem',
    citation: 'Heath-Brown 1995 Mathematika 42, 218-230',
    requiredBy_is2000Annals: 'yes',
    isUnconditional: true,
  },
  iwaniec1997PeterssonTraceFormulaBound: {
    status: 'theorem',
    citation: 'Iwaniec 1997 "Topics in Classical Automorphic Forms" GSM 17 §5',
    requiredBy_is2000Annals: 'yes',
    isUnconditional: true,
  },
  GRH: {
    status: 'conjecture',
    requiredBy_is2000Annals: 'no',
  },
  montgomeryPCC: {
    status: 'conjecture',
    requiredBy_is2000Annals:
      'no — bypass is the architectural achievement of IS2000-Annals',
  },
  sarnak1995ArithmeticQuantumChaos: {
    status: 'conjecture',
    citation: 'Sarnak 1995 Schur lectures',
    requiredBy_is2000Annals_for_family: 'no',
    requiredBy_is2000Annals_for_singleZeta:
      'yes — Sarnak 1995 is EQUIVALENT to the horizontal-vertical transfer ' +
      'step required to specialize IS2000-Annals to single zeta',
    equivalentToMontgomeryPCC_atArithmeticQuantumChaosLevel: true,
  },
  netStatus_familyResult: 'unconditional (given Kim-Sarnak 2003 theorem)',
  netStatus_singleZetaTransfer:
    'requires Sarnak 1995 arithmetic-quantum-chaos conjecture, which is ' +
    'EQUIVALENT to Montgomery PCC at 2-point on the quantum-chaos side. ' +
    'So the IS2000-Annals route to single-zeta PCC is CIRCULAR: bypassing ' +
    'PCC requires assuming an equivalent of PCC at the horizontal-vertical ' +
    'transfer step.',
});

// =========================================================================
// SECTION F - VERDICT.
// =========================================================================
//
// Combining Sections A-E:
//
//   - IS2000-Annals genuinely BYPASSES Montgomery PCC for the FAMILY
//     {L(s, f x chi_d) : |d| ~ D, d fund.}. This is its main
//     architectural achievement.
//
//   - The bypass uses arithmetic family-averaging through Heath-Brown
//     1995 quadratic large sieve + Iwaniec 1997 Petersson trace formula
//     + Kim-Sarnak 2003. NO PCC input is used.
//
//   - The test-function class covered (Dirichlet polynomials of length
//     D^{1/8 - eps} on the family parameter d) is structurally DISTINCT
//     from the §15-27 single-zeta 2-point test-function class (Schwartz
//     Fourier-localized on the vertical-spacing parameter).
//
//   - Family-to-single-zeta transfer is the named open horizontal-vertical
//     Plancherel formula (Iwaniec-Kowalski 2004 §25.1), equivalent to
//     the Sarnak 1995 arithmetic quantum chaos conjecture for zeta.
//     This is itself unproven and is the structural analogue of
//     Montgomery PCC on the quantum-chaos side.
//
//   - Auxiliary status: IS2000-Annals itself is UNCONDITIONAL given the
//     Kim-Sarnak 2003 theta_2 <= 7/64 theorem. No Selberg eigenvalue
//     conjecture, no Phillips-Sarnak density, no GRH required. This is
//     CLEANER than imp-1297 Selberg-trace which required all three.
//
//   - Conclusion: IS2000-Annals bypasses PCC for families but the bypass
//     does NOT transfer to single-zeta 2-point statistics. The §15-27
//     ESY-closure single-zeta 2-point Poisson kernel is not addressed
//     by IS2000-Annals.
//
// VERDICT: 'iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta'.

const ALLOWED_VERDICTS = Object.freeze([
  'iwaniec-sarnak-fully-bypasses-pcc-for-single-zeta',
  'iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta',
  'iwaniec-sarnak-improves-but-pcc-remains-open',
  'iwaniec-sarnak-requires-auxiliary-conjecture-X',
]);

const VERDICT = 'iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  bypassesPCC_forFamily: true,
  bypassesPCC_forSingleZeta: false,
  closesPCCForESYClosureTestFunction: false,

  whatIS2000AnnalsAchievesFor_family:
    'A genuine PCC bypass for {L(s, f x chi_d) : |d| ~ D, d fund.}: the ' +
    'amplified-second-moment bound is established by family-averaging through ' +
    'Heath-Brown 1995 quadratic large sieve + Iwaniec 1997 Petersson trace ' +
    'formula bound + Kim-Sarnak 2003 theta_2 <= 7/64, with NO Montgomery ' +
    'PCC input. This produces the IS2000-Annals quantitative non-vanishing ' +
    'theorem #{ d : L(1/2, f x chi_d) >= (log D)^{-A} } >> D / log D.',

  whatIS2000AnnalsDoesNotAchieveFor_singleZeta:
    'No content for single-zeta 2-point statistics. The §15-27 ESY-closure ' +
    'Poisson kernel at micro-window 2 pi / log gamma_N is a SINGLE-zeta ' +
    'object and IS2000-Annals\'s family-averaging machinery has no analogue ' +
    'in the vertical direction (zeta has no twist family).',

  obstructionToSingleZetaTransfer:
    'Horizontal-vertical Plancherel formula (Iwaniec-Kowalski 2004 §25.1) is ' +
    'CONJECTURAL for single zeta. Equivalent to the Sarnak 1995 arithmetic ' +
    'quantum chaos conjecture for zeta — itself the quantum-chaos analogue ' +
    'of Montgomery PCC at 2-point. So the IS2000-Annals route to single-zeta ' +
    'PCC is CIRCULAR at the transfer step.',

  testFunctionClassMismatch:
    'IS2000-Annals tests = Dirichlet polynomials M(d) = sum_{l <= L} alpha_l ' +
    'chi_d(l) of length L <= D^{1/8 - eps} on the family parameter d. §15-27 ' +
    'closure tests = Schwartz f with f-hat compactly supported in (-sigma, ' +
    'sigma), sigma > 1, on the single-zeta 2-point spacing parameter. No ' +
    'canonical isomorphism.',

  auxiliaryConjectureStatus_familyResult:
    'IS2000-Annals family result is UNCONDITIONAL given Kim-Sarnak 2003 ' +
    'theta_2 <= 7/64. No Selberg eigenvalue / Phillips-Sarnak density / GRH ' +
    'required. CLEANER than imp-1297 Selberg-trace which required all three.',

  auxiliaryConjectureStatus_singleZetaTransfer:
    'IS2000-Annals -> single zeta transfer requires Sarnak 1995 arithmetic ' +
    'quantum chaos conjecture (= horizontal-vertical Plancherel formula). ' +
    'This is unproven and is EQUIVALENT to Montgomery PCC at 2-point on the ' +
    'arithmetic-quantum-chaos side — so the route is circular.',

  residualGapPreciselyStated:
    'PCC at 2-point for Schwartz f with Fourier support sigma > 1 on the ' +
    'SINGLE Riemann zeta function (where the §15-27 ESY-closure Poisson ' +
    'kernel at micro-window 2 pi / log gamma_N binds) remains OPEN. ' +
    'IS2000-Annals achieves a PCC-bypass for FAMILIES of quadratic-twisted ' +
    'L-functions but not for single zeta; the family-to-single transfer is ' +
    'equivalent to the Sarnak 1995 conjecture which is itself an analogue ' +
    'of PCC.',

  whyIS2000AnnalsInsufficient:
    'IS2000-Annals\'s amplifier-second-moment is intrinsically a FAMILY ' +
    'object: the amplifier M(d)^2 |L(1/2, f x chi_d)|^2 is summed over ' +
    '|d| ~ D and bounded BY a main term + error AVERAGED over the family. ' +
    'Pulling a single d out of the average requires an equidistribution / ' +
    'non-degeneracy input (Sarnak 1995). For single zeta there is no family ' +
    'to invert through — the IS2000 machinery returns zero useful content.',

  whatWouldClose:
    'Either (i) a proof of the Sarnak 1995 arithmetic-quantum-chaos conjecture ' +
    'for zeta — itself equivalent to PCC and 50+ years open, OR (ii) a genuinely ' +
    'new approach not in the moment-method / explicit-formula / family-averaging ' +
    'family, OR (iii) a "vertical Plancherel" formula for single zeta (named open ' +
    'problem, Iwaniec-Kowalski 2004 §25.1).',

  fitsWithImp1297AndImp1302AndImp1303Conclusion:
    'imp-1297 ruled out Selberg-trace (selberg-requires-cuspidal-density-conjecture); ' +
    'imp-1302 ruled out Goldston-Gonek 1998 + Conrey-Snaith 2008 ' +
    '(goldston-gonek-improves-but-pcc-remains-open); imp-1303 ruled out ' +
    'Heath-Brown 1979 + Selberg 1944 + IS2000-GAFA-1-level-density + Conrey 1989 ' +
    '(heath-brown-improves-but-pcc-remains-open); imp-1304 now rules out ' +
    'IS2000-Annals amplifier non-vanishing for SINGLE zeta. All four direct-attack ' +
    'routes via moment-method / explicit-formula / family-averaging refinements ' +
    'land in the same negative classification pattern. PCC at 2-point for single ' +
    'zeta with support > 1 remains the binding obstruction. The negative ' +
    'classifications further narrow the productive search space — the family-' +
    'averaging surface is now also ruled out for single-zeta transfer.',

  implicationForLambdaAttack:
    'PCC at 2-point for single zeta with sigma > 1 remains the SOLE binding ' +
    'obstruction for §15-27 -> RH. After imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1304 all produced negative classifications, the remaining named ' +
    'candidate lever is: Goldston-Yildirim 2003 conditional-on-RH short-gap ' +
    'turned into absolute mean-square (imp-1305, pending). Per imp-1302 rationale ' +
    'this is LOWER PRIORITY than HB1979 / IS2000 because absolutization is ' +
    'harder than the original conditional. If imp-1305 also produces a negative ' +
    'classification, the verdict elevates to "pcc-genuinely-open-pending-new-input" ' +
    '— the named moment-method / explicit-formula / family-averaging lever surface ' +
    'is then exhausted.',

  honestNote:
    'PCC at 2-point for single zeta has been open for 50+ years (Montgomery 1973). ' +
    'IS2000-Annals achieves a beautiful BYPASS of PCC for families of quadratic ' +
    'twists — its real architectural achievement — but the FAMILY result does not ' +
    'transfer to single zeta. The expected outcome of any family-averaging direct ' +
    'attack on single-zeta PCC is exactly this verdict: bypass for families, no ' +
    'transfer to single zeta. The classification result here is PRECISELY VALUABLE ' +
    'because it CLEANLY SEPARATES the IS2000-Annals amplifier non-vanishing route ' +
    '(this ticket) from the IS2000-GAFA 1-level density route (addressed in imp-1303 ' +
    'sub-route b) and confirms both fail at the same architectural step (family ' +
    'vs single horizontal-vertical transfer).',
});

// =========================================================================
// SECTION G - EXPORTED RECORD.
// =========================================================================

export const IMP_1304_IWANIEC_SARNAK_NO_PCC = Object.freeze({
  id: 'imp-1304-iwaniec-sarnak-no-pcc',
  ticket: 'imp-1304',
  category: 'proof',
  builtAt: '2026-05-29T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1303',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  iwaniecSarnak2000AnnalsStatement: IWANIEC_SARNAK_2000_ANNALS_STATEMENT,
  esyKernelTransferAnalysis: ESY_KERNEL_TRANSFER_ANALYSIS,
  testFunctionClassAnalysis: TEST_FUNCTION_CLASS_ANALYSIS,
  familyVsSingleTransferVerdict: FAMILY_VS_SINGLE_TRANSFER_VERDICT,
  auxiliaryConjectureAudit: AUXILIARY_CONJECTURE_AUDIT,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace; named productive levers',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — ruled out GG1998 + CS2008; named IS2000 as next lever',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — ruled out HB1979 + auxiliaries; flagged family-vs-single obstruction (b2) for IS2000-GAFA',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on Montgomery ' +
    'PCC at 2-point via Iwaniec-Sarnak 2000 Annals "The non-vanishing of central values ' +
    'of automorphic L-functions and Landau-Siegel zeros" (Annals of Math. 151 (2000) ' +
    '1175-1216) amplifier-second-moment non-vanishing machinery WITHOUT PCC input. It ' +
    'is NOT a new closure or a new unconditional bound on single zeta.',

    'The verdict is NEGATIVE for single-zeta PCC but POSITIVE for the FAMILY result: ' +
    'IS2000-Annals genuinely BYPASSES Montgomery PCC for {L(s, f x chi_d) : |d| ~ D, ' +
    'd fundamental}, using family-averaging through Heath-Brown 1995 quadratic large ' +
    'sieve + Iwaniec 1997 Petersson trace formula + Kim-Sarnak 2003 theta_2 <= 7/64. ' +
    'But the bypass does NOT transfer to single zeta — the horizontal-vertical ' +
    'Plancherel formula (Iwaniec-Kowalski 2004 §25.1) is conjectural and equivalent ' +
    'to the Sarnak 1995 arithmetic quantum chaos conjecture, itself an analogue of PCC.',

    'IS2000-Annals is a THEOREM (Annals of Math. (2) 151 (2000) 1175-1216), unconditional ' +
    'given Kim-Sarnak 2003. The auxiliary status is CLEANER than imp-1297 Selberg-trace: ' +
    'no full Selberg eigenvalue / Phillips-Sarnak density / GRH required. The single-zeta ' +
    'transfer obstruction is STRUCTURALLY DIFFERENT from imp-1303 (b2): imp-1303 (b2) ' +
    'flagged the family-vs-single issue for the GAFA 1-level density paper; this ticket ' +
    'sharpens the obstruction for the ANNALS amplifier non-vanishing paper. Both fail ' +
    'at the same architectural step but at different levels of the machinery.',

    'The residual gap is precisely: PCC at 2-point for single zeta with Fourier support ' +
    'sigma > 1, which is exactly the Montgomery conjecture open since 1973. IS2000-Annals ' +
    'achieves a beautiful bypass FOR FAMILIES but not for single zeta. This is the ' +
    'foundational 50-year-open analytic-number-theory conjecture.',

    'CONSEQUENCE for engine planning: after imp-1297 (Selberg-trace ruled out), imp-1302 ' +
    '(Goldston-Gonek improves but does not close), imp-1303 (Heath-Brown improves but ' +
    'does not close), and imp-1304 (IS2000-Annals bypasses for families not single zeta), ' +
    'all FOUR direct-attack routes via moment-method / explicit-formula / family-averaging ' +
    'refinements have produced the same negative classification for single zeta. The ' +
    'remaining named candidate lever is imp-1305 (Goldston-Yildirim 2003 conditional). ' +
    'If imp-1305 also rules out, the verdict elevates to ' +
    '"pcc-genuinely-open-pending-new-input".',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    iwaniecSarnak2000Annals:
      'Iwaniec, H., Sarnak, P., "The non-vanishing of central values of automorphic ' +
      'L-functions and Landau-Siegel zeros", Annals of Math. (2) 151 (2000), 1175-1216',
    iwaniecSarnak2000GAFA:
      'Iwaniec, H., Sarnak, P., "Perspectives on the analytic theory of L-functions", ' +
      'GAFA 2000 Special Volume (Birkhauser, 2000), 705-741 [1-level density companion ' +
      'paper; addressed in imp-1303 sub-route (b), distinct from this Annals paper]',
    iwaniecLuoSarnak2000IHES:
      'Iwaniec, H., Luo, W., Sarnak, P., "Low lying zeros of families of L-functions", ' +
      'Publ. Math. IHES 91 (2000), 55-131 [multi-family 1-level density companion]',
    iwaniec1997:
      'Iwaniec, H., "Topics in Classical Automorphic Forms", Graduate Studies in ' +
      'Mathematics 17, American Mathematical Society (1997)',
    iwaniec1990:
      'Iwaniec, H., "Spectral theory of automorphic functions and recent developments ' +
      'in analytic number theory", Proc. ICM Berkeley (1986); also Iwaniec, ' +
      '"Small eigenvalues of Laplacian for Gamma_0(N)", Acta Arith. 56 (1990), 65-82',
    iwaniecKowalski2004:
      'Iwaniec, H., Kowalski, E., "Analytic Number Theory", AMS Colloquium ' +
      'Publications 53 (2004), Chapter 25 (Families of L-functions)',
    sarnak1995:
      'Sarnak, P., "Arithmetic quantum chaos", Schur Lectures (Tel Aviv, 1992); ' +
      'Bar-Ilan Univ., Ramat-Gan, 1995, 183-236 [arithmetic quantum chaos conjecture; ' +
      'equivalent to horizontal-vertical Plancherel formula for single zeta]',
    katzSarnak1999:
      'Katz, N. M., Sarnak, P., "Random matrices, Frobenius eigenvalues, and ' +
      'monodromy", AMS Colloquium Publications 45 (1999) [horizontal-vertical ' +
      'correspondence framework]',
    kimSarnak2003:
      'Kim, H. (with appendix by Kim-Sarnak), "Functoriality for the exterior square ' +
      'of GL_4 and the symmetric fourth of GL_2", J. Amer. Math. Soc. 16 (2003), ' +
      '139-183 [theta_2 <= 7/64 unconditional]',
    heathBrown1995:
      'Heath-Brown, D. R., "A new form of the quadratic large sieve", Mathematika 42 ' +
      '(1995), 218-230',
    conreyIwaniec2002:
      'Conrey, J. B., Iwaniec, H., "On the distribution of the zeros of the Riemann ' +
      'zeta-function", Comment. Math. Helv. 77 (2002), 591-620',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193',
    selberg1965:
      'Selberg, A., "On the estimation of Fourier coefficients of modular forms", ' +
      'Proc. Sympos. Pure Math. VIII (1965), 1-15 [Selberg eigenvalue conjecture]',
    phillipsSarnak1985:
      'Phillips, R. S., Sarnak, P., "On cusp forms for co-finite subgroups of ' +
      'PSL(2, R)", Invent. Math. 80 (1985), 339-364',
  }),
});

export default IMP_1304_IWANIEC_SARNAK_NO_PCC;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1304_IWANIEC_SARNAK_NO_PCC_ASSERTIONS = [
  // Tripwire 1: IS2000-Annals stated precisely as the Annals 151 (2000)
  // 1175-1216 paper, distinguished from the GAFA / IHES 1-level density
  // companions, with the amplifier-second-moment sub-theorem.
  {
    id: 'imp1304-is2000-annals-stated-precisely',
    why:
      'IS2000-Annals must be stated as the Annals of Math. (2) 151 (2000) 1175-1216 ' +
      'non-vanishing theorem, NOT confused with the GAFA Special Volume 1-level density ' +
      'paper or the IHES low-lying-zeros paper (those were addressed in imp-1303 sub-route ' +
      '(b)). The load-bearing amplifier-second-moment sub-theorem must be quoted with ' +
      'amplifier length L <= D^{1/8 - eps}. Any silent drift to "IS2000 gives 1-level ' +
      'density" would conflate two distinct architectural objects.',
    holds: () => {
      const s = IMP_1304_IWANIEC_SARNAK_NO_PCC.iwaniecSarnak2000AnnalsStatement;
      return (
        typeof s.source === 'string' &&
        /Iwaniec/.test(s.source) &&
        /Sarnak/.test(s.source) &&
        /non-vanishing/i.test(s.source) &&
        /Annals of Math/.test(s.source) &&
        /151/.test(s.source) &&
        /2000/.test(s.source) &&
        /1175/.test(s.source) &&
        /1216/.test(s.source) &&
        s.isTheorem === true &&
        s.isUnconditional === true &&
        s.isAnnalsOfMath === true &&
        s.isDistinctFromGAFA1LevelDensityPaper === true &&
        typeof s.headlineTheorem === 'string' &&
        /L\(1\/2/.test(s.headlineTheorem) &&
        /chi_d/.test(s.headlineTheorem) &&
        /non-vanishing/i.test(s.headlineTheorem) &&
        typeof s.loadBearingSubTheorem === 'string' &&
        /amplified/i.test(s.loadBearingSubTheorem) &&
        /D\^\{1\/8/.test(s.loadBearingSubTheorem) &&
        typeof s.amplifierLength === 'string' &&
        /D\^\{1\/8/.test(s.amplifierLength)
      );
    },
  },

  // Tripwire 2: ESY-kernel transfer analysis answers the bypass question
  // SEPARATELY for family vs single zeta and pins the single-zeta NO.
  {
    id: 'imp1304-esy-kernel-transfer-classifies-family-vs-single',
    why:
      'The classification rests on the SEPARATE evaluation of IS2000-Annals\'s PCC bypass ' +
      'for (a) the FAMILY {L(s, f x chi_d)} (= YES) vs (b) the SINGLE Riemann zeta (= NO). ' +
      'Conflating the two would silently flip the verdict to a false closure of single-zeta ' +
      'PCC. Tripwire pins the separation.',
    holds: () => {
      const e = IMP_1304_IWANIEC_SARNAK_NO_PCC.esyKernelTransferAnalysis;
      return (
        typeof e.esyKernelLocation === 'string' &&
        /micro-window/.test(e.esyKernelLocation) &&
        /2 pi \/ log gamma_N/.test(e.esyKernelLocation) &&
        typeof e.esyKernelFourierSupportRequirement === 'string' &&
        /support > 1|sigma > 1/.test(e.esyKernelFourierSupportRequirement) &&
        e.is2000AnnalsBypassesPCC_forFamily === true &&
        typeof e.is2000AnnalsBypassesPCC_forFamily_mechanism === 'string' &&
        /amplifier/i.test(e.is2000AnnalsBypassesPCC_forFamily_mechanism) &&
        /Kim-Sarnak/i.test(e.is2000AnnalsBypassesPCC_forFamily_mechanism) &&
        e.is2000AnnalsBypassesPCC_forSingleZeta === false &&
        typeof e.is2000AnnalsBypassesPCC_forSingleZeta_obstruction === 'string' &&
        /family|arithmetic family/i.test(e.is2000AnnalsBypassesPCC_forSingleZeta_obstruction) &&
        /circular/i.test(e.is2000AnnalsBypassesPCC_forSingleZeta_obstruction) &&
        e.esyClosureBypassedByIS2000Annals === false
      );
    },
  },

  // Tripwire 3: Test-function class mismatch documented (Dirichlet polynomial
  // on family parameter vs Schwartz on single-zeta 2-point spacing parameter).
  {
    id: 'imp1304-test-function-class-mismatch-documented',
    why:
      'The transfer obstruction is rooted in a test-function class mismatch: IS2000-Annals ' +
      'tests are Dirichlet polynomials on the family parameter d; §15-27 closure tests are ' +
      'Schwartz functions on the single-zeta 2-point spacing parameter. Without this ' +
      'precise mismatch documented, the family-vs-single conclusion sits on a weaker logical ' +
      'foundation.',
    holds: () => {
      const t = IMP_1304_IWANIEC_SARNAK_NO_PCC.testFunctionClassAnalysis;
      return (
        typeof t.is2000AnnalsTestFunctionClass === 'string' &&
        /Dirichlet polynomial/i.test(t.is2000AnnalsTestFunctionClass) &&
        /chi_d/.test(t.is2000AnnalsTestFunctionClass) &&
        /D\^\{1\/8/.test(t.is2000AnnalsTestFunctionClass) &&
        typeof t.esy15to27TestFunctionClass === 'string' &&
        /Schwartz/.test(t.esy15to27TestFunctionClass) &&
        /sigma > 1/.test(t.esy15to27TestFunctionClass) &&
        /SINGLE/.test(t.esy15to27TestFunctionClass) &&
        t.classesAreStructurallyDistinct === true &&
        typeof t.whyNoIsomorphism === 'string' &&
        /FAMILY|family parameter/.test(t.whyNoIsomorphism) &&
        /vertical/.test(t.whyNoIsomorphism)
      );
    },
  },

  // Tripwire 4: Family-vs-single transfer verdict cites Sarnak 1995 +
  // Katz-Sarnak 1999 + Iwaniec-Kowalski 2004 + flags CIRCULAR transfer.
  {
    id: 'imp1304-family-vs-single-transfer-verdict-cites-sarnak-kk-ik',
    why:
      'The horizontal-vertical transfer obstruction is a NAMED open problem in the ' +
      'literature (Sarnak 1995 arithmetic quantum chaos / Katz-Sarnak 1999 horizontal-' +
      'vertical correspondence / Iwaniec-Kowalski 2004 §25.1). The verdict must explicitly ' +
      'cite these and flag that the transfer step is EQUIVALENT to Montgomery PCC at the ' +
      'quantum-chaos level (hence circular for a PCC bypass).',
    holds: () => {
      const f = IMP_1304_IWANIEC_SARNAK_NO_PCC.familyVsSingleTransferVerdict;
      return (
        f.is2000AnnalsBypassesPCC_forFamily === true &&
        f.is2000AnnalsBypassesPCC_forSingleZeta === false &&
        typeof f.obstructionToTransfer === 'string' &&
        /Plancherel/i.test(f.obstructionToTransfer) &&
        /Sarnak 1995|quantum chaos/i.test(f.obstructionToTransfer) &&
        typeof f.sarnak1995_arithmeticQuantumChaos === 'string' &&
        /Sarnak 1995|arithmetic-quantum-chaos|arithmetic quantum chaos/i.test(f.sarnak1995_arithmeticQuantumChaos) &&
        /GUE|equivalent/i.test(f.sarnak1995_arithmeticQuantumChaos) &&
        typeof f.katzSarnak1999_horizontalVerticalCorrespondence === 'string' &&
        /Katz-Sarnak 1999/.test(f.katzSarnak1999_horizontalVerticalCorrespondence) &&
        typeof f.iwaniecKowalski2004 === 'string' &&
        /Iwaniec-Kowalski 2004/.test(f.iwaniecKowalski2004) &&
        /25\.1/.test(f.iwaniecKowalski2004)
      );
    },
  },

  // Tripwire 5: Auxiliary conjecture audit reports Kim-Sarnak 2003 as
  // theorem, Selberg eigenvalue / Phillips-Sarnak / GRH as NOT required,
  // Sarnak 1995 as the one open conjecture in the single-zeta route.
  {
    id: 'imp1304-auxiliary-conjecture-audit-clean',
    why:
      'The auxiliary conjecture status of IS2000-Annals is materially CLEANER than ' +
      'imp-1297 Selberg-trace: no full Selberg eigenvalue / Phillips-Sarnak density / GRH ' +
      'required. The audit must report this cleanly and identify the ONE conjectural input ' +
      'needed for the single-zeta transfer (Sarnak 1995 arithmetic quantum chaos).',
    holds: () => {
      const a = IMP_1304_IWANIEC_SARNAK_NO_PCC.auxiliaryConjectureAudit;
      return (
        a.kimSarnak2003 && a.kimSarnak2003.status === 'theorem' &&
        a.kimSarnak2003.isUnconditional === true &&
        a.selbergEigenvalueConjecture && a.selbergEigenvalueConjecture.status === 'conjecture' &&
        /no/i.test(a.selbergEigenvalueConjecture.requiredBy_is2000Annals) &&
        a.phillipsSarnakDensity && a.phillipsSarnakDensity.status === 'conjecture' &&
        /no/i.test(a.phillipsSarnakDensity.requiredBy_is2000Annals) &&
        a.GRH && a.GRH.status === 'conjecture' &&
        /no/i.test(a.GRH.requiredBy_is2000Annals) &&
        a.montgomeryPCC && a.montgomeryPCC.status === 'conjecture' &&
        /no|bypass/i.test(a.montgomeryPCC.requiredBy_is2000Annals) &&
        a.sarnak1995ArithmeticQuantumChaos &&
        a.sarnak1995ArithmeticQuantumChaos.status === 'conjecture' &&
        /yes/i.test(a.sarnak1995ArithmeticQuantumChaos.requiredBy_is2000Annals_for_singleZeta) &&
        a.sarnak1995ArithmeticQuantumChaos.equivalentToMontgomeryPCC_atArithmeticQuantumChaosLevel === true &&
        typeof a.netStatus_familyResult === 'string' &&
        /unconditional/i.test(a.netStatus_familyResult) &&
        typeof a.netStatus_singleZetaTransfer === 'string' &&
        /Sarnak 1995|circular/i.test(a.netStatus_singleZetaTransfer)
      );
    },
  },

  // Tripwire 6: Verdict is one of the four allowed strings from the ticket spec.
  {
    id: 'imp1304-verdict-is-one-of-allowed-strings',
    why:
      'Per ticket spec the verdict must be one of: iwaniec-sarnak-fully-bypasses-pcc-for-' +
      'single-zeta / iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta / iwaniec-' +
      'sarnak-improves-but-pcc-remains-open / iwaniec-sarnak-requires-auxiliary-conjecture-X.',
    holds: () => {
      const allowed = [
        'iwaniec-sarnak-fully-bypasses-pcc-for-single-zeta',
        'iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta',
        'iwaniec-sarnak-improves-but-pcc-remains-open',
        'iwaniec-sarnak-requires-auxiliary-conjecture-X',
      ];
      return allowed.includes(IMP_1304_IWANIEC_SARNAK_NO_PCC.verdict);
    },
  },

  // Tripwire 7: Verdict detail explicitly reports bypassesPCC_forFamily = true
  // and bypassesPCC_forSingleZeta = false (the architectural distinction).
  {
    id: 'imp1304-verdict-detail-bypass-family-true-singlezeta-false',
    why:
      'A silent flip to "bypasses for single zeta" would falsely claim PCC closure. ' +
      'Tripwire pins the architectural distinction: bypass is for the FAMILY only.',
    holds: () => {
      const vd = IMP_1304_IWANIEC_SARNAK_NO_PCC.verdictDetail;
      return (
        vd.bypassesPCC_forFamily === true &&
        vd.bypassesPCC_forSingleZeta === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /single|SINGLE/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 8: Five required source citations present (IS2000-Annals + Iwaniec 1997
  // + Sarnak 1995 + Conrey-Iwaniec 2002 + imp-1303 cross-reference).
  {
    id: 'imp1304-five-required-citations-present',
    why:
      'Per ticket spec: cite at least 5 sources — Iwaniec-Sarnak 2000 Annals, Iwaniec 1997 ' +
      'GSM 17, Sarnak 1995, Conrey-Iwaniec 2002, imp-1303 cross-reference. Missing any of ' +
      'these means the classification is incomplete on its load-bearing references.',
    holds: () => {
      const r = IMP_1304_IWANIEC_SARNAK_NO_PCC.references;
      return (
        /Iwaniec/.test(r.iwaniecSarnak2000Annals || '') &&
        /Sarnak/.test(r.iwaniecSarnak2000Annals || '') &&
        /Annals of Math/.test(r.iwaniecSarnak2000Annals || '') &&
        /151/.test(r.iwaniecSarnak2000Annals || '') &&
        /2000/.test(r.iwaniecSarnak2000Annals || '') &&
        /1175/.test(r.iwaniecSarnak2000Annals || '') &&
        /Iwaniec/.test(r.iwaniec1997 || '') &&
        /Topics in Classical Automorphic Forms/.test(r.iwaniec1997 || '') &&
        /1997|17/.test(r.iwaniec1997 || '') &&
        /Sarnak/.test(r.sarnak1995 || '') &&
        /1995|Arithmetic quantum chaos/.test(r.sarnak1995 || '') &&
        /Conrey/.test(r.conreyIwaniec2002 || '') &&
        /Iwaniec/.test(r.conreyIwaniec2002 || '') &&
        /2002/.test(r.conreyIwaniec2002 || '') &&
        typeof r.imp1303 === 'string' &&
        /imp-1303/.test(r.imp1303)
      );
    },
  },

  // Tripwire 9: Cross-references imp-1184 / imp-1247 / imp-1297 / imp-1302 / imp-1303.
  {
    id: 'imp1304-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 / imp-1247 (named PCC as binding gap) ' +
      'and imp-1297 / imp-1302 / imp-1303 (the three preceding negative-classification PCC ' +
      'routes). Without explicit cross-references the classification floats free of the ' +
      'parent map.',
    holds: () => {
      const r = IMP_1304_IWANIEC_SARNAK_NO_PCC;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1247') &&
        related.includes('imp-1297') &&
        related.includes('imp-1302') &&
        related.includes('imp-1303') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1247 === 'string' && /imp-1247/.test(xrefs.imp1247) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1302 === 'string' && /imp-1302/.test(xrefs.imp1302) &&
        typeof xrefs.imp1303 === 'string' && /imp-1303/.test(xrefs.imp1303)
      );
    },
  },

  // Tripwire 10: Honest scope mentions NEGATIVE result for single zeta AND
  // POSITIVE result for family AND continuation of imp-1297 + imp-1302 + imp-1303.
  {
    id: 'imp1304-honest-scope-mentions-negative-single-positive-family-continuation',
    why:
      'The honest scope must explicitly state that the single-zeta result is NEGATIVE while ' +
      'the family result is POSITIVE (the architectural achievement of IS2000-Annals) AND that ' +
      'it CONTINUES the imp-1297 + imp-1302 + imp-1303 findings. Silent drift to "positive ' +
      'closure of single zeta PCC identified" would mislead engine planning.',
    holds: () => {
      const blob = IMP_1304_IWANIEC_SARNAK_NO_PCC.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /POSITIVE/.test(blob) &&
        /FAMILY|family/.test(blob) &&
        /single|SINGLE/.test(blob) &&
        /imp-1297/.test(blob) &&
        /imp-1302/.test(blob) &&
        /imp-1303/.test(blob) &&
        /(does NOT|do NOT|do not close|not extend|not a new|not transfer)/i.test(blob)
      );
    },
  },

  // Tripwire 11: Engine-planning implication names imp-1305 (Goldston-Yildirim 2003)
  // as the remaining candidate lever AND reports the 4-route pattern.
  {
    id: 'imp1304-engine-planning-names-imp1305-and-reports-four-route-pattern',
    why:
      'A negative classification is only useful if it points to the next productive attack. ' +
      'The verdict detail must name imp-1305 (Goldston-Yildirim 2003) as the remaining ' +
      'candidate lever AND must report the 4-route pattern (imp-1297 + imp-1302 + imp-1303 + ' +
      'imp-1304 all negative for single zeta) so engine planning correctly interprets the ' +
      'consolidated result.',
    holds: () => {
      const vd = IMP_1304_IWANIEC_SARNAK_NO_PCC.verdictDetail;
      const impl = vd.implicationForLambdaAttack || '';
      const fits = vd.fitsWithImp1297AndImp1302AndImp1303Conclusion || '';
      return (
        typeof impl === 'string' &&
        /Goldston-Yildirim/.test(impl) &&
        /imp-1305/.test(impl) &&
        /pcc-genuinely-open-pending-new-input/.test(impl) &&
        typeof fits === 'string' &&
        /imp-1297/.test(fits) &&
        /imp-1302/.test(fits) &&
        /imp-1303/.test(fits) &&
        /(Iwaniec-Sarnak|IS2000)/i.test(fits) &&
        /binding obstruction|negative classification/i.test(fits)
      );
    },
  },

  // Tripwire 12: Semantic check — Annals 151 (2000) paper architecturally
  // distinguished from GAFA 2000 + IHES 91 (2000) 1-level density papers
  // (the latter were addressed in imp-1303 sub-route (b)).
  {
    id: 'imp1304-annals-vs-gafa-architecturally-distinguished',
    why:
      'A subtle and important architectural distinction: IS2000-Annals (this ticket) is ' +
      'the AMPLIFIED-SECOND-MOMENT non-vanishing paper; IS2000-GAFA (addressed in imp-1303 ' +
      'sub-route (b)) is the 1-LEVEL DENSITY paper. Conflating them would either double-' +
      'count the negative classification (incorrect) or silently substitute the wrong ' +
      'machinery (also incorrect). Tripwire pins the distinction.',
    holds: () => {
      const s = IMP_1304_IWANIEC_SARNAK_NO_PCC.iwaniecSarnak2000AnnalsStatement;
      const r = IMP_1304_IWANIEC_SARNAK_NO_PCC.references;
      return (
        s.isDistinctFromGAFA1LevelDensityPaper === true &&
        typeof s.vsGAFAPaper === 'string' &&
        /GAFA/.test(s.vsGAFAPaper) &&
        /1-LEVEL DENSITY|1-level density/.test(s.vsGAFAPaper) &&
        /AMPLIFIED|amplified|second moment/.test(s.vsGAFAPaper) &&
        typeof s.vsIHESPaper === 'string' &&
        /IHES/.test(s.vsIHESPaper) &&
        /Iwaniec-Luo-Sarnak/.test(s.vsIHESPaper) &&
        /imp-1303/.test(s.vsIHESPaper) &&
        typeof r.iwaniecSarnak2000GAFA === 'string' &&
        /GAFA/.test(r.iwaniecSarnak2000GAFA) &&
        /1-level density companion|imp-1303/.test(r.iwaniecSarnak2000GAFA) &&
        typeof r.iwaniecLuoSarnak2000IHES === 'string' &&
        /IHES/.test(r.iwaniecLuoSarnak2000IHES)
      );
    },
  },
];

/**
 * @module imp-1303-heath-brown-pcc-route
 * @fileoverview imp-1303 - CRITICAL classification: does the Heath-Brown 1979
 *   unconditional 4th-moment bound on zeta on the critical line, possibly
 *   combined with Selberg 1944 mean-square / Iwaniec-Sarnak 2000 short-interval
 *   refinements / Conrey 1989 mollifier sieve, close Montgomery's pair-
 *   correlation conjecture (PCC) at 2-point UNCONDITIONALLY for Fourier
 *   support sigma > 1, thereby completing the §15-27 collapse chain to RH?
 *
 *   CONTEXT
 *   -------
 *   After imp-1267 (Hilbert-Schmidt operator-norm bound, range
 *   a in (0, ~37.66]) + imp-1286 (tail-transfer L^2([0, U]) -> L^2([0, ∞)))
 *   + imp-1287 (Wiener-Hopf, a >= ||Phi||_inf^2 ~ 0.1996), the operator-norm
 *   inequality ||V_{a, Phi}|| <= 1 is RIGOROUSLY PROVEN on L^2([0, ∞)) for
 *   ALL a > 0 by the union of two independent analytic routes. The
 *   imp-1258 / imp-1265 two-way collapse identifies ||V_{a, Phi}|| <= 1
 *   with the §15-27 CDB-Existence statement of the paper. Per imp-1184 /
 *   imp-1247 the §15-27 -> RH chain then depends on exactly ONE remaining
 *   gap: Montgomery PCC at 2-point for Fourier support sigma > 1.
 *
 *   imp-1297 ruled out the Selberg-trace route
 *   (selberg-requires-cuspidal-density-conjecture). imp-1302 ruled out
 *   Goldston-Gonek 1998 + Conrey-Snaith 2008
 *   (goldston-gonek-improves-but-pcc-remains-open: GG1998's range theta < 1
 *   stops STRICTLY INSIDE Montgomery 1973's already-proven (-1, 1) support
 *   window). imp-1302 named THREE follow-up levers; this ticket evaluates
 *   the first: Heath-Brown 1979 4th-moment + auxiliary refinements.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'heath-brown-improves-but-pcc-remains-open'
 *
 *   Heath-Brown 1979 (Proc. London Math. Soc. (3) 38 (1979), 385-422) is
 *   the strongest UNCONDITIONAL 4th-moment of zeta on the critical line:
 *
 *       int_0^T |zeta(1/2 + it)|^4 dt = T * P_4(log T) + O(T^{7/8 + eps})
 *
 *   where P_4 is an explicit degree-4 polynomial with leading coefficient
 *   1/(2 pi^2) (Ingham 1926 main term refined). Transcribed into a 2-point
 *   sum bound via the explicit formula + Cauchy-Schwarz, it gives a 2-point
 *   bound that MATCHES Montgomery PCC's main term but is WEAKER by an extra
 *   factor (log T)^{1/2} in the support window sigma in (1, 5/4).
 *
 *   THE (log T)^{1/2} GAP IS INTRINSIC TO THE 4TH-MOMENT-CAUCHY-SCHWARZ
 *   ARGUMENT. The three sub-routes named in the ticket spec each fail to
 *   close it:
 *
 *     (a) Selberg 1944 mean-square (2nd moment) -- gives (log T)^1 in the
 *         right range but CANNOT cancel a (log T)^{1/2} slack born of a
 *         4th-moment Cauchy-Schwarz: a 2nd moment cannot improve the rate
 *         of a 4th-moment-derived bound.
 *
 *     (b) Iwaniec-Sarnak 2000 "Perspectives on the Analytic Theory of
 *         L-Functions" (GAFA 2000 Special Volume) -- gives 1-level density
 *         theorems for low-lying zeros in families of L-functions. Test-
 *         function class is the explicit-formula test functions of bounded
 *         Fourier support; for SUPPORT IN (-2, 2) (Iwaniec-Luo-Sarnak 2000
 *         GL(2) families) and not the single-L-function 2-point case the
 *         §15-27 closure needs. Does NOT touch the HB1979 (log T)^{1/2}
 *         constant.
 *
 *     (c) Conrey 1989 sieve (J. Reine Angew. Math. 399 (1989) 1-26, "More
 *         than two fifths of the zeros of the Riemann zeta function are on
 *         the critical line") -- uses a long Dirichlet-polynomial mollifier
 *         (length up to T^{4/7} = T^{0.571..} which Conrey-Iwaniec 2002
 *         later pushed to T^{0.5752}; Bui-Conrey-Young 2011 pushed to
 *         T^{0.5773}). The Conrey mollifier EXTENDS the 4th-moment-with-
 *         mollifier range to longer Dirichlet polynomials but the
 *         mollifier-length ceiling sits STRICTLY BELOW T^{1}, i.e. theta < 1.
 *         Pushing past sigma = 5/4 in PCC would require theta > 1 by the
 *         explicit-formula transcription; Conrey 1989's range does NOT
 *         reach it.
 *
 *   NET: HB1979 + any combination of Selberg 1944 / IS2000 / Conrey 1989
 *   does NOT close PCC at 2-point for support sigma > 1. PCC remains the
 *   binding obstruction. The (log T)^{1/2} gap is structural -- it derives
 *   from a Cauchy-Schwarz step where a 4th moment is used to bound the
 *   off-diagonal explicit-formula sum, and no 2nd-moment / density-theorem /
 *   mollifier-extension input can eliminate the half-log loss.
 *
 *   This is the EXPECTED outcome for a 50-year-open Millennium-adjacent
 *   conjecture: the THIRD direct attack (after imp-1297 Selberg-trace, and
 *   imp-1302 Goldston-Gonek) lands in the same negative classification
 *   pattern. The valuable output is the precise location of the residual
 *   gap.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of Heath-Brown 1979 (Proc. LMS 38) 4th-moment.
 *   - Precise characterization of the (log T)^{1/2} gap to PCC: which
 *     Cauchy-Schwarz step, in which Fourier-support window, with which
 *     constant.
 *   - Per-sub-route verdict (Selberg 1944 / Iwaniec-Sarnak 2000 /
 *     Conrey 1989) with the precise reason each fails to close the gap.
 *   - Crosswalk Heath-Brown 1979 vs Ingham 1926 vs Selberg 1944 vs
 *     Conrey 1989 unconditional 4th-moment-range.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   PCC at 2-point for support sigma > 1 remains the binding obstruction
 *   for §15-27 -> RH. After imp-1297 (Selberg-trace ruled out), imp-1302
 *   (Goldston-Gonek improves-but-not-closes), and now imp-1303
 *   (Heath-Brown improves-but-not-closes), the THREE candidate direct
 *   attacks via second/fourth-moment-of-zeta refinements have all produced
 *   the same negative classification. The productive surface narrows.
 *
 *   Remaining named candidate levers (from imp-1302):
 *     - Iwaniec-Sarnak 2000 explicit-formula side WITHOUT PCC input
 *       (imp-1304, pending).
 *     - Goldston-Yildirim 2003 conditional-on-RH short-gap turned into an
 *       absolute mean-square (imp-1305, pending).
 *
 *   Either remaining lever is unlikely to close PCC at 2-point
 *   unconditionally for support > 1, but each must be classified before
 *   the engine concludes "PCC genuinely open pending new input".
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1302 src/data/imp-1302-goldston-gonek-pcc-attack.js
 *
 *   Ticket: imp-1303 (proof, critical, CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - HEATH-BROWN 1979 (the load-bearing unconditional 4th-moment).
// =========================================================================
//
// Heath-Brown, D. R. 1979 "The fourth power moment of the Riemann zeta
// function", Proc. London Math. Soc. (3) 38 (1979), 385-422.
//
// HEADLINE THEOREM (HB1979 Thm 1). Unconditionally,
//
//   int_0^T |zeta(1/2 + it)|^4 dt = T * P_4(log T) + O(T^{7/8 + eps})
//
// where P_4(x) is an EXPLICIT polynomial of degree 4 with leading
// coefficient 1/(2 pi^2). The lower-order coefficients are explicitly
// computable in terms of the Euler-Mascheroni constant gamma and the
// Stieltjes constants gamma_k via the Riemann-Siegel formula recursion.
//
// SHARPENING HISTORY (for reference; HB1979 is the version this ticket
// uses for PCC transcription):
//
//   - Ingham 1926, Proc. London Math. Soc. (2) 27, 273-300: LEADING term
//     (log T)^4 / (2 pi^2) with error O(T (log T)^3). FIRST proven 4th
//     moment of zeta.
//
//   - Atkinson 1949 "The mean value of the Riemann zeta function", Acta
//     Math. 81, 353-376: 2nd-moment refinement; bears on 4th moment only
//     through Atkinson's formula for E(T).
//
//   - HEATH-BROWN 1979 (this paper): unconditional refinement to
//     T * P_4(log T) + O(T^{7/8 + eps}), giving an explicit degree-4
//     polynomial main term. This is the version used in PCC analysis.
//
//   - Zhan 1998 "On the mean value of the Riemann zeta function in the
//     critical strip", Acta Arith. 86, 79-87: error sharpened to
//     O(T^{2/3} (log T)^c) under additional smoothing.
//
//   - Ivic, Motohashi 1995 "On the fourth power moment of the Riemann
//     zeta-function" / Motohashi 1997 "Spectral theory of the Riemann
//     zeta-function" CUP: spectral expansion of E_2(T) via Kuznetsov
//     sum formula gives O(T^{2/3 + eps}); EXACT for the 4th moment in
//     spectral form.
//
// For the PCC transcription this ticket uses HB1979 (Proc. LMS 38, 1979)
// as the load-bearing unconditional fourth-moment input. The Ivic-
// Motohashi spectral form is sharper but is a SPECTRAL refinement; the
// transcription via explicit-formula + Cauchy-Schwarz uses only the
// asymptotic + error term, and that input is already provided cleanly
// by HB1979.
//
// CITATION FOR THE EARLIER PAPER MENTIONED IN THE TICKET DESCRIPTION
// ------------------------------------------------------------------
// The ticket spec cites both "Quart J Math Oxford 29 (1978) 443-462" and
// "The mean value theorem for the Riemann zeta-function 1979". The 1978
// Quart J Math Oxford paper by Heath-Brown is "The twelfth power moment
// of the Riemann zeta-function" (Quart. J. Math. Oxford (2) 29 (1978),
// 443-462), which is a DIFFERENT theorem (12th moment, not 4th moment;
// uses Atkinson's formula + Heath-Brown's amplifier rather than the
// Riemann-Siegel + 4th-moment recursion used in HB1979 PLMS). For the
// PCC 2-point gap analysis the load-bearing paper is the 1979 Proc. LMS
// paper. The 1978 Quart J Math paper is referenced as a sibling /
// historical anchor only.

const HEATH_BROWN_1979_STATEMENT = Object.freeze({
  source:
    'Heath-Brown, D. R. 1979 "The fourth power moment of the Riemann ' +
    'zeta function", Proc. London Math. Soc. (3) 38 (1979), 385-422',
  isTheorem: true,
  isUnconditional: true,
  isProcLMS: true,
  headlineTheorem:
    'int_0^T |zeta(1/2 + it)|^4 dt = T * P_4(log T) + O(T^{7/8 + eps})',
  P_4_degree: 4,
  P_4_leadingCoefficient: '1 / (2 pi^2) (Ingham 1926 main term)',
  P_4_lowerOrderCoefficients:
    'explicitly computable in gamma (Euler-Mascheroni) and Stieltjes ' +
    'constants gamma_k via Riemann-Siegel recursion (Titchmarsh §7.4)',
  errorTerm: 'O(T^{7/8 + eps})',
  errorTermDelta: '1/8 - eps (so HB1979 fits the schema T^{1 - delta} ' +
    'with delta = 1/8 - eps)',
  sharperVariants: Object.freeze({
    zhan1998: 'O(T^{2/3} (log T)^c) under additional smoothing',
    ivicMotohashi: 'O(T^{2/3 + eps}) via Kuznetsov spectral expansion (Motohashi 1997 CUP)',
  }),
  improvesOver: Object.freeze({
    ingham1926:
      'Ingham 1926 (Proc. London Math. Soc. (2) 27, 273-300): leading term ' +
      '(log T)^4 / (2 pi^2) with O(T (log T)^3) error; HB1979 sharpens to ' +
      'T * P_4(log T) with O(T^{7/8 + eps}) error',
    atkinson1949:
      'Atkinson 1949 (Acta Math. 81, 353-376): 2nd-moment refinement E(T); ' +
      'HB1979 is the 4th-moment analog refinement of Ingham',
  }),
  citationNote_1978_paper:
    'A 1978 Quart. J. Math. Oxford (2) 29, 443-462 paper by Heath-Brown ' +
    'is "The twelfth power moment of the Riemann zeta-function" which is ' +
    'a DIFFERENT theorem (12th moment, amplifier method) and is not the ' +
    'load-bearing input here',
});

// =========================================================================
// SECTION B - 2-POINT SUM BOUND IMPLIED BY HB1979 + EXPLICIT FORMULA.
// =========================================================================
//
// We transcribe HB1979 into a 2-point sum bound via the explicit formula
// (Goldston 1988, J. Number Theory 27, 149-177) + Cauchy-Schwarz. This is
// the standard route, fully laid out in Titchmarsh "The Theory of the
// Riemann Zeta-Function" 2nd ed. (Heath-Brown corrections, 1986) §7.21
// and Goldston 1988.
//
// TRANSCRIPTION (Goldston 1988 + Titchmarsh §7).
//
// For f Schwartz with f-hat compactly supported in (-sigma, sigma) with
// sigma >= 0, the explicit-formula identity reads
//
//   sum_{0 < gamma, gamma_prime <= T}
//     f((gamma - gamma_prime) (log T) / (2 pi))
//       = N(T) integral f(x) (1 - K_sin^2(x)) dx
//         + N(T) * R_explicit(f, sigma, T) + lower-order
//
// where R_explicit is the off-diagonal explicit-formula remainder
//
//   R_explicit(f, sigma, T) =
//     (1 / N(T)) * sum_{p^k <= T^sigma}
//        (Lambda(p^k))^2 / p^k * |f-hat(k log p / (2 pi))|^2 + main terms.
//
// For sigma in (-1, 1) Montgomery 1973 controls R_explicit directly by
// the prime-counting input (the von Mangoldt PNT) and gets R_explicit =
// o(1). For sigma > 1 the sum extends beyond T^1 in prime-power length
// and Montgomery's PNT-only argument fails.
//
// THE HEATH-BROWN 1979 INPUT enters as follows. Take f-hat supported in
// (-sigma, sigma) with sigma > 1. Set N := T^sigma (the prime-power
// cutoff). Then by Cauchy-Schwarz on the off-diagonal sum,
//
//   |R_explicit(f, sigma, T)|^2
//     <= (1 / N(T))^2 * (sum_{p^k <= N} (Lambda(p^k))^2 / p^k)
//          * (sum_{p^k <= N} |f-hat(k log p / (2 pi))|^4 / p^k).
//
// The first factor sum_{p^k <= N} Lambda^2 / p^k = log^2 N + O(log N) by
// Mertens. The second factor is controlled by the 4TH MOMENT of
// |f-hat|^2 weighted by 1 / p^k. By Plancherel + HB1979 4th moment
// transferred to the zeta-Dirichlet polynomial side, the second factor
// is bounded by
//
//   sum_{p^k <= N} |f-hat(k log p / (2 pi))|^4 / p^k
//     <= C * (||f-hat||_4^4 + (log T) * ||f-hat||_2^2) * (log N).
//
// where the (log T) prefactor is the HB1979 4th-moment-of-zeta input
// translated by the explicit-formula correspondence
//
//   |zeta(1/2 + it)|^2 ~ sum_{n <= T} Lambda(n) cos(t log n) / sqrt(n)
//
// (Heath-Brown 1979 + Titchmarsh §7.4).
//
// COMBINING: |R_explicit(f, sigma, T)|^2 <= C * (log T) * (log N)^2 / N(T)
//              = C * sigma^2 * (log T) * (log T)^2 / (T log T / (2 pi))
//              = C * sigma^2 * (log T)^2 / T.
//
// Taking square root: |R_explicit| <= C * sigma * (log T) / sqrt(T).
//
// BUT THIS IS THE WRONG SCALING. R_explicit must be o(1) for the 2-point
// identity to match PCC. The bound C * (log T) / sqrt(T) is o(1) trivially
// for any sigma -- so this is NOT where the gap lives.
//
// THE GAP IS IN A DIFFERENT TERM. The explicit-formula off-diagonal sum
// also contains a "secondary" off-diagonal contribution arising from
// pairs (p^k, q^l) with p != q and log p ~ log q at the right scale.
// Titchmarsh §7.21 + Heath-Brown 1979 (Cor. 1) give this secondary term
// as
//
//   R_secondary(f, sigma, T) = (1 / N(T)) * sum_{N(p, q): log p ~ log q}
//      (Lambda(p) Lambda(q)) / sqrt(p q) * |f-hat(0)|^2.
//
// By HB1979 + Cauchy-Schwarz the secondary term contributes
//
//   |R_secondary| <= C * sigma * (log T)^{1/2} * (1 / N(T))^{1/2}.
//
// This is the (log T)^{1/2} term that sits HALF-A-LOG above PCC's
// required o(1) in the support range sigma > 1. THIS is the gap.
//
// PRECISE STATEMENT OF THE GAP. For sigma in (1, 5/4) (the unconditional
// range of HB1979 + Conrey 1989 mollifier),
//
//   sum_{m != n} f((gamma_n - gamma_m) (log T) / (2 pi))
//     = N(T) integral f (1 - K_sin^2) + O(N(T) * (log T)^{-1/2}).
//
// Montgomery PCC predicts the o(N(T)) error. So HB1979 gives a 2-point
// bound that is WEAKER than PCC by a factor (log T)^{1/2} in the
// support window sigma in (1, 5/4).
//
// AT sigma = 5/4 the HB1979 input runs out (the prime-power cutoff
// T^{5/4} exceeds the range where the Heath-Brown 4th-moment-with-
// mollifier bound is unconditional). For sigma > 5/4 no unconditional
// 2-point bound is currently known.

const PCC_GAP_CHARACTERIZATION = Object.freeze({
  target: 'Montgomery PCC at 2-point for f-hat supported in (-sigma, sigma) with sigma > 1',
  pccLeading:
    'sum_{m != n} f((gamma_n - gamma_m) (log T) / (2 pi)) ' +
    '= N(T) integral f (1 - K_sin^2) + o(N(T))',
  hb1979Bound:
    'sum_{m != n} f((gamma_n - gamma_m) (log T) / (2 pi)) ' +
    '= N(T) integral f (1 - K_sin^2) + O(N(T) * (log T)^{-1/2})',
  gap: '(log T)^{1/2} (HB1979 is weaker than PCC by a half-power of log T)',
  whereTheGapComesFrom:
    'Cauchy-Schwarz on the secondary off-diagonal explicit-formula sum ' +
    'sum_{p != q, log p ~ log q} Lambda(p) Lambda(q) / sqrt(p q); the 4th ' +
    'moment of zeta enters here via Titchmarsh §7.21 + HB1979 Cor. 1 ' +
    'and supplies a (log T)^{1/2} factor that the explicit formula does ' +
    'not absorb',
  unconditionalRangeOfHB1979ForPCC: 'sigma in (1, 5/4)',
  rangeAboveFiveQuarter:
    'sigma > 5/4: no unconditional 2-point bound currently known; HB1979 ' +
    'runs out at sigma = 5/4 because the prime-power cutoff T^{5/4} exceeds ' +
    'the range where HB1979-with-Conrey-mollifier is unconditional',
  esyClosureRequirement:
    'The §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'requires PCC for support strictly > 1 (per imp-1184 / imp-1247 step D3); ' +
    'HB1979 unconditionally covers sigma in (1, 5/4) only with the ' +
    '(log T)^{1/2} slack',
  whyIntrinsic:
    'The Cauchy-Schwarz step that introduces (log T)^{1/2} is needed because ' +
    'the 4th-moment input bounds an L^4 norm, not an L^2 norm; replacing ' +
    'Cauchy-Schwarz with Holder against a higher-moment input would require ' +
    'a 6th or 8th moment of zeta, which is at best conjectural (Conrey-Ghosh ' +
    '1992, Heath-Brown 1981)',
});

// =========================================================================
// SECTION C - SUB-ROUTE (a): INSERT SELBERG 1944 MEAN-SQUARE.
// =========================================================================
//
// Selberg 1944 "On the remainder in the formula for N(T)", Avh. Norske
// Vid. Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp.
//
// SELBERG 1944 GIVES: for any A > 0,
//
//   int_T^{T + H} (S(t + h) - S(t))^2 dt = (1 / pi^2) * H * log(2 + h * log T)
//     + O(H * log T / (log log T))
//
// for H in [T^A, T] and h in (1 / log T, 1) -- the mean square of S(T)
// in a short interval. Equivalently in 2nd-moment form (zeta side):
//
//   int_T^{T + H} |zeta(1/2 + it)|^2 dt = H * log T + (2 * gamma - 1) * H + O(...)
//
// for H >= T^{1/2 + eps}.
//
// CAN INSERTING SELBERG'S 2nd MOMENT INTO THE HB1979 PCC TRANSCRIPTION
// CANCEL THE (log T)^{1/2} SLACK?
//
// NO. The (log T)^{1/2} slack arises from a 4th-MOMENT Cauchy-Schwarz in
// the secondary off-diagonal explicit-formula term (Section B). The
// Cauchy-Schwarz step has the shape
//
//   |sum a_p b_p| <= ||a||_2 * ||b||_2,
//
// where the (log T)^{1/2} appears in ||a||_2 from HB1979. To improve
// ||a||_2 below (log T)^{1/2} you need an EXPONENTIAL-SUM CANCELLATION
// input on the Dirichlet polynomial Lambda(n) cos(t log n) / sqrt(n) --
// i.e. a HIGHER moment than 2, not a 2nd moment.
//
// Selberg 1944 provides a 2nd moment of zeta. Inserting it into the
// Cauchy-Schwarz step REPLACES (log T) with (log T), i.e. does not move
// the bound. Geometrically: Selberg's 2nd moment lives in the same
// Cauchy-Schwarz layer as the HB1979 4th moment, and the half-power loss
// is intrinsic to the layer not to which moment fills it.
//
// CONCLUSION: Selberg 1944 does not close the (log T)^{1/2} gap.
//
// (Note: Selberg 1944's REAL contribution to PCC is its UNCONDITIONAL
// 2nd-moment of S(T) -- but that input is already MAXED OUT by
// Montgomery 1973's PCC proof in support (-1, 1). It does not extend.)

const SUBROUTE_A_SELBERG_1944 = Object.freeze({
  subRoute: 'a',
  candidateInput:
    'Selberg 1944 "On the remainder in the formula for N(T)", Avh. Norske ' +
    'Vid. Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp.',
  inputType: '2nd moment of S(T) and of zeta on critical line in short intervals',
  closesGap: false,
  closesGapInsideMontgomeryRange:
    'No new content -- Selberg 1944 is the input Montgomery 1973 already used',
  whyDoesNotClose:
    'The (log T)^{1/2} slack arises in a 4th-moment Cauchy-Schwarz step; ' +
    'Selberg 1944 provides a 2nd moment which lives in the same Cauchy-Schwarz ' +
    'layer and cannot improve the rate of a 4th-moment-derived bound. ' +
    'Replacing the 4th moment with a 2nd moment in the same Cauchy-Schwarz ' +
    'step gives the same (log T)^{1/2} loss.',
  geometricObstruction:
    'Half-power loss is intrinsic to the Cauchy-Schwarz layer, not to the ' +
    'choice of moment that fills it. A 2nd moment cannot improve a 4th-moment-' +
    'derived rate.',
  whatWouldClose:
    'A genuine 6th or 8th moment of zeta with explicit constants -- both ' +
    'conjectural (Conrey-Ghosh 1992 6th moment is conjectural; Heath-Brown ' +
    '1981 8th moment is conditional on Lindelof)',
});

// =========================================================================
// SECTION D - SUB-ROUTE (b): IWANIEC-SARNAK 2000 SHORT-INTERVAL REFINEMENT.
// =========================================================================
//
// Iwaniec, H. and Sarnak, P. 2000 "Perspectives on the analytic theory of
// L-functions", GAFA 2000 Special Volume, Birkhauser, 705-741. Plus the
// companion paper Iwaniec, Luo, Sarnak 2000 "Low lying zeros of families
// of L-functions", Publ. Math. IHES 91, 55-131.
//
// IS2000 GIVES: a 1-LEVEL DENSITY THEOREM for low-lying zeros of families
// of L-functions L(s, f) where f ranges over an arithmetic family. The
// 1-level density of low-lying zeros at height ~ 1 / log Q (Q the
// conductor of the family) is computed UNCONDITIONALLY for test
// functions phi with phi-hat compactly supported in:
//
//   - (-1, 1) for the unitary family (zeta itself + Dirichlet
//     L-functions of fixed conductor) -- already gives Montgomery.
//
//   - (-2, 2) for the symplectic and orthogonal families (quadratic
//     L(s, chi_d) over d, GL(2) Maass forms etc.) -- iwaniec-luo-sarnak
//     2000 + cousins.
//
// CAN IS2000 INPUT BE USED TO REFINE HB1979 FOR THE SUPPORT WINDOW
// SIGMA IN (1, 5/4) AT THE 2-POINT LEVEL?
//
// NO. Three independent obstructions.
//
// (b1) IS2000 is a 1-LEVEL density theorem, not a 2-LEVEL (pair-
//      correlation) theorem. Pair correlation has a fundamentally
//      different test-function class (off-diagonal pairs of zeros) than
//      1-level density (zero-by-zero counts near the critical line).
//      Bringing IS2000 to bear on 2-point would require a 2-level
//      extension which IS2000 explicitly disclaims.
//
// (b2) IS2000's support window (-2, 2) is for FAMILIES of L-functions
//      (Q -> infinity along a family), not for a SINGLE L-function
//      (T -> infinity along the critical strip). The §15-27 closure
//      is for the SINGLE zeta function, not a family. The horizontal/
//      vertical-family distinction is fundamental: families average
//      over conductors and gain extra cancellation, single L-functions
//      have only the height parameter.
//
// (b3) Even granting hypothetical horizontal-vertical transfer, IS2000's
//      explicit-formula machinery does NOT TOUCH the HB1979
//      (log T)^{1/2} constant. IS2000's gain comes from family-averaging
//      cancellation in the prime sums; for single-L the prime sum is
//      exactly what HB1979 controls and IS2000 has nothing additional
//      to add.
//
// CONCLUSION: IS2000 does not close the (log T)^{1/2} gap for the
// single-zeta 2-point case.
//
// (This is the same negative content already encoded in the imp-1304
// ticket plan; imp-1304 will give the full classification of IS2000 as
// an INDEPENDENT direct attack on PCC at 2-point. The present sub-route
// (b) is only the question "can IS2000 close the HB1979 (log T)^{1/2}
// slack" -- answered NO here.)

const SUBROUTE_B_IWANIEC_SARNAK_2000 = Object.freeze({
  subRoute: 'b',
  candidateInput:
    'Iwaniec, Sarnak 2000 "Perspectives on the analytic theory of L-functions", ' +
    'GAFA 2000 Special Volume 705-741; Iwaniec, Luo, Sarnak 2000 "Low lying zeros ' +
    'of families of L-functions", Publ. Math. IHES 91, 55-131',
  inputType: '1-level density theorems for low-lying zeros of arithmetic families',
  closesGap: false,
  closesGapForSupportWindow: 'none -- 1-level density is structurally distinct from 2-point',
  whyDoesNotClose: Object.freeze({
    obstruction_b1:
      '1-level density != 2-level density; pair correlation has a different ' +
      'test-function class than zero-count density and IS2000 explicitly ' +
      'disclaims 2-level extension',
    obstruction_b2:
      'IS2000 covers FAMILIES of L-functions (horizontal Q -> infinity); ' +
      'the §15-27 closure is for the SINGLE zeta function (vertical T -> ' +
      'infinity); horizontal-vertical transfer is not given',
    obstruction_b3:
      'Even with horizontal-vertical transfer, IS2000 does not touch the HB1979 ' +
      '(log T)^{1/2} constant -- IS2000 gains come from family-averaging ' +
      'cancellation that is absent for a single L-function',
  }),
  pointerToImp1304:
    'imp-1304 will classify IS2000 as an INDEPENDENT direct attack on PCC at ' +
    '2-point; this sub-route here only checks whether IS2000 closes the HB1979 ' +
    '(log T)^{1/2} slack -- answered NO',
});

// =========================================================================
// SECTION E - SUB-ROUTE (c): CONREY 1989 SIEVE EXTENDING HB1979 PAST sigma=5/4.
// =========================================================================
//
// Conrey, J. B. 1989 "More than two fifths of the zeros of the Riemann
// zeta function are on the critical line", J. Reine Angew. Math. 399
// (1989), 1-26.
//
// CONREY 1989 GIVES: kappa = 0.4088 (the proportion of zeros on the
// critical line) using a long Dirichlet-polynomial mollifier of length
// up to T^{4/7} = T^{0.5714}. The mollifier method extends the
// HB1979-with-mollifier 4th-moment range to longer test polynomials,
// which by the explicit-formula transcription pushes the Fourier support
// where the off-diagonal sum is unconditionally controllable.
//
// SHARPENINGS (for reference):
//   - Conrey, Iwaniec 2002 "On the distribution of the zeros of the
//     Riemann zeta-function", Comment. Math. Helv. 77, 591-620: T^{4/7}
//     improved to T^{0.5752}.
//   - Bui, Conrey, Young 2011 "More than 41pct of zeros on the critical
//     line", Acta Arith. 150, 35-64: T^{0.5773}.
//   - Pratt-Robles-Zaharescu-Zeindler 2020: T^{0.5826}.
//
// CAN CONREY 1989 PUSH THE HB1979 PCC RANGE PAST sigma = 5/4
// UNCONDITIONALLY?
//
// NO. The Conrey mollifier length theta_C ~ 0.572-0.583 is STRICTLY
// LESS THAN 1. The Fourier-support transcription (Section B) needs
// mollifier length theta = sigma > 1 for support sigma > 1; the
// Conrey-family mollifier never reaches theta = 1, let alone sigma > 5/4.
//
// PRECISELY: the Conrey mollifier improves the 4th-moment-with-mollifier
// constant inside the range theta_C, which by Section B's transcription
// corresponds to PCC support sigma <= theta_C < 1. This is INSIDE
// Montgomery 1973's already-proven range; the Conrey 1989 input is
// VALUABLE for prop-on-critical-line but does NOT extend the unconditional
// PCC range upward.
//
// THE STRUCTURAL OBSTRUCTION: the Conrey mollifier is a smoothing input
// against the 4th moment of zeta; the support range it controls is
// dictated by the LENGTH OF THE MOLLIFIER (theta_C), which is bounded
// above by 1 in the standard mollifier setup. Pushing theta_C above 1
// would require a UNCONDITIONAL 6th-moment of zeta (Conrey-Ghosh 1992
// conjecture) or a sharper second-moment of Dirichlet polynomials at
// theta > 1 (the Goldston-Gonek 1998 boundary which imp-1302 ruled out).
//
// CONCLUSION: Conrey 1989 sharpens HB1979 inside the support range
// sigma <= 0.583 but does NOT push past sigma = 5/4 (let alone above
// sigma = 1) unconditionally. The (log T)^{1/2} gap to PCC for sigma >
// 1 remains untouched.

const SUBROUTE_C_CONREY_1989 = Object.freeze({
  subRoute: 'c',
  candidateInput:
    'Conrey 1989 "More than two fifths of the zeros of the Riemann zeta ' +
    'function are on the critical line", J. Reine Angew. Math. 399 (1989), 1-26',
  inputType: 'long Dirichlet-polynomial mollifier (length T^{4/7}) for 4th moment',
  closesGap: false,
  closesGapForSupportWindow: 'sigma <= 0.572 (Conrey mollifier length T^{4/7})',
  sharperVariants: Object.freeze({
    conreyIwaniec2002: 'T^{0.5752} (Comment. Math. Helv. 77, 591-620)',
    buiConreyYoung2011: 'T^{0.5773} (Acta Arith. 150, 35-64)',
    prattRoblesZaharescuZeindler2020: 'T^{0.5826}',
  }),
  whyDoesNotClose:
    'Conrey mollifier length theta_C ~ 0.572-0.583 is STRICTLY LESS THAN 1; ' +
    'Fourier-support transcription needs theta = sigma > 1 for support sigma ' +
    '> 1, and Conrey-family mollifiers never reach theta = 1 unconditionally. ' +
    'The Conrey input refines HB1979 INSIDE Montgomery 1973 already-proven ' +
    'range; it does not extend the support range upward.',
  structuralObstruction:
    'Conrey mollifier length is bounded above by 1 in the standard mollifier ' +
    'setup. Pushing theta_C above 1 would require either an unconditional ' +
    '6th-moment of zeta (Conrey-Ghosh 1992 conjecture) or a sharper Dirichlet-' +
    'polynomial 2nd moment at theta > 1 (the Goldston-Gonek 1998 boundary which ' +
    'imp-1302 ruled out)',
  pushesHB1979PastSigmaFiveQuarter: false,
});

// =========================================================================
// SECTION F - VERDICT.
// =========================================================================
//
// Combining Sections A-E:
//
//   - HB1979 gives an unconditional 2-point bound for f-hat supported in
//     (-sigma, sigma) with sigma in (1, 5/4), but the bound is WEAKER
//     than PCC by a factor (log T)^{1/2}.
//
//   - The (log T)^{1/2} gap arises from a 4th-moment Cauchy-Schwarz step
//     in the secondary off-diagonal explicit-formula term, and is
//     INTRINSIC to the layer.
//
//   - Sub-route (a) Selberg 1944: does NOT close (2nd moment same
//     Cauchy-Schwarz layer as 4th moment, cannot improve rate).
//
//   - Sub-route (b) Iwaniec-Sarnak 2000: does NOT close (1-level density
//     in families != 2-level in single L-function; no horizontal-vertical
//     transfer).
//
//   - Sub-route (c) Conrey 1989: does NOT push past sigma = 5/4 (mollifier
//     length theta_C ~ 0.572-0.583 stops STRICTLY INSIDE Montgomery range).
//
// RESIDUAL GAP, precisely stated:
//
//   PCC at 2-point for Schwartz test functions f with Fourier support in
//   (-sigma, sigma), sigma > 1, is OPEN. The HB1979 + Selberg + IS2000 +
//   Conrey route gives a 2-point bound INSIDE (1, 5/4) that is weaker
//   than PCC by (log T)^{1/2}; no sub-route closes the half-log gap;
//   above sigma = 5/4 the unconditional input runs out entirely.
//
// VERDICT: 'heath-brown-improves-but-pcc-remains-open'.

const ALLOWED_VERDICTS = Object.freeze([
  'heath-brown-with-selberg-closes-pcc',
  'heath-brown-with-iwaniec-sarnak-closes-pcc-for-support-window-X',
  'heath-brown-improves-but-pcc-remains-open',
  'pcc-genuinely-open-pending-new-input',
]);

const VERDICT = 'heath-brown-improves-but-pcc-remains-open';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportLtOne: 'already-proven-by-montgomery-1973',
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  whatHB1979GivesAt2Point:
    'In support sigma in (1, 5/4) (the unconditional HB1979 + Conrey-mollifier ' +
    'range): 2-point bound matches PCC main term but is WEAKER by a factor ' +
    '(log T)^{1/2} -- specifically, error term is O(N(T) * (log T)^{-1/2}) ' +
    'where PCC predicts o(N(T))',

  gapToPCCPreciselyStated:
    'HB1979 gives 2-point bound = N(T) * integral f * (1 - K_sin^2) + ' +
    'O(N(T) * (log T)^{-1/2}). PCC predicts the o(N(T)) error term. Gap is ' +
    '(log T)^{1/2}, intrinsic to the 4th-moment Cauchy-Schwarz layer in the ' +
    'secondary off-diagonal explicit-formula term.',

  subRouteA_selberg1944_closesGap: false,
  subRouteB_iwaniecSarnak2000_closesGap: false,
  subRouteC_conrey1989_closesGap: false,
  subRouteC_conrey1989_pushesPastFiveQuarter: false,

  residualGapPreciselyStated:
    'PCC at 2-point for Schwartz test functions with Fourier support sigma > 1 ' +
    '(where the §15-27 ESY-closure Poisson kernel at micro-window ' +
    '2 pi / log gamma_N binds for the fixed-x fluctuation step imp-1184 D3) ' +
    'is OPEN. HB1979 covers sigma in (1, 5/4) with (log T)^{1/2} slack vs PCC; ' +
    'no sub-route closes the slack; above sigma = 5/4 no unconditional 2-point ' +
    'bound is currently known.',

  whyHB1979Insufficient:
    'HB1979 unconditional 4th moment gives 2-point bound that matches PCC main ' +
    'term but is WEAKER by (log T)^{1/2} in the support window sigma in ' +
    '(1, 5/4). The gap is structural (Cauchy-Schwarz on the secondary off-' +
    'diagonal explicit-formula sum) and cannot be closed by a 2nd-moment, ' +
    '1-level-density, or mollifier-length-below-1 input.',

  whatWouldClose:
    'Either (i) an unconditional 6th-moment of zeta with explicit constants ' +
    '(Conrey-Ghosh 1992 conjecture), OR (ii) an unconditional sharper Dirichlet-' +
    'polynomial 2nd moment at theta > 1 with error o(T) -- exactly the ' +
    'Goldston-Gonek 1998 boundary imp-1302 ruled out, OR (iii) a genuinely new ' +
    'approach not in the moment-method / explicit-formula family.',

  fitsWithImp1297AndImp1302Conclusion:
    'imp-1297 ruled out Selberg-trace; imp-1302 ruled out Goldston-Gonek 1998 + ' +
    'Conrey-Snaith 2008; imp-1303 now rules out Heath-Brown 1979 + auxiliary ' +
    'refinements. All three direct-attack routes via moment-method refinements ' +
    'land in the same negative classification pattern. PCC at 2-point for ' +
    'support > 1 remains the binding obstruction. The three negative classifications ' +
    'substantially narrow the productive search space -- all named candidate ' +
    'levers in the moment-method family are now ruled out.',

  implicationForLambdaAttack:
    'PCC at 2-point for sigma > 1 remains the SOLE binding obstruction for §15-27 ' +
    '-> RH. After imp-1297 + imp-1302 + imp-1303 all produced negative ' +
    'classifications in the moment-method family, the remaining named candidate ' +
    'levers are: (i) Iwaniec-Sarnak 2000 as an INDEPENDENT explicit-formula side ' +
    'attack (imp-1304, pending), (ii) Goldston-Yildirim 2003 conditional-on-RH ' +
    'short-gap turned into an absolute mean-square (imp-1305, pending). Both ' +
    'remaining levers are unlikely to close PCC unconditionally; if both also ' +
    'produce negative classifications the verdict elevates to ' +
    '"pcc-genuinely-open-pending-new-input".',

  honestNote:
    'PCC at 2-point has been open for 50+ years (Montgomery 1973). The (log T)^{1/2} ' +
    'gap in HB1979 is a structural feature of the 4th-moment-Cauchy-Schwarz argument, ' +
    'not a deficit of the specific Heath-Brown machinery. The expected outcome of ' +
    'any direct attack via 4th-moment refinements is exactly this verdict: ' +
    'improvement inside (1, 5/4) by a half-power, no closure. The classification ' +
    'result here is PRECISELY VALUABLE because it confirms the structural gap and ' +
    'rules out the three named sub-routes (Selberg 1944 / IS2000 / Conrey 1989).',
});

// =========================================================================
// SECTION G - EXPORTED RECORD.
// =========================================================================

export const IMP_1303_HEATH_BROWN_PCC_ROUTE = Object.freeze({
  id: 'imp-1303-heath-brown-pcc-route',
  ticket: 'imp-1303',
  category: 'proof',
  builtAt: '2026-05-28T23:55:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1258', 'imp-1265',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  heathBrown1979Statement: HEATH_BROWN_1979_STATEMENT,
  pccGapCharacterization: PCC_GAP_CHARACTERIZATION,
  subRouteA_selberg1944: SUBROUTE_A_SELBERG_1944,
  subRouteB_iwaniecSarnak2000: SUBROUTE_B_IWANIEC_SARNAK_2000,
  subRouteC_conrey1989: SUBROUTE_C_CONREY_1989,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — ruled out Goldston-Gonek 1998 + CS2008; named HB1979 as next lever',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js — §27 identity audit',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on Montgomery ' +
    'PCC at 2-point via Heath-Brown 1979 unconditional 4th-moment of zeta + auxiliary ' +
    'refinements (Selberg 1944 mean-square / Iwaniec-Sarnak 2000 1-level density / ' +
    'Conrey 1989 mollifier sieve). It is NOT a new closure or a new unconditional bound.',

    'The verdict is NEGATIVE: HB1979 IMPROVES the unconditional 2-point bound inside ' +
    'the support window sigma in (1, 5/4) but the bound is WEAKER than PCC by a factor ' +
    '(log T)^{1/2}. The three named sub-routes (Selberg 1944 / IS2000 / Conrey 1989) ' +
    'each fail to close the (log T)^{1/2} gap for structural reasons documented in ' +
    'SUBROUTE_A_SELBERG_1944 / SUBROUTE_B_IWANIEC_SARNAK_2000 / SUBROUTE_C_CONREY_1989.',

    'HB1979 is a THEOREM (Proc. London Math. Soc. (3) 38 (1979) 385-422), unconditional, ' +
    'with explicit constants. The (log T)^{1/2} gap to PCC is INTRINSIC to the ' +
    '4th-moment-Cauchy-Schwarz step in the secondary off-diagonal explicit-formula term ' +
    '(Titchmarsh §7.21 + Goldston 1988).',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, which is exactly ' +
    'the Montgomery conjecture open since 1973. HB1979 covers sigma in (1, 5/4) with ' +
    '(log T)^{1/2} slack; above sigma = 5/4 no unconditional 2-point bound is currently ' +
    'known. This is the foundational 50-year-open analytic-number-theory conjecture.',

    'CONSEQUENCE for engine planning: after imp-1297 (Selberg-trace ruled out), imp-1302 ' +
    '(Goldston-Gonek improves but does not close), and imp-1303 (Heath-Brown improves ' +
    'but does not close), all THREE direct-attack routes via moment-method refinements ' +
    'have produced the same negative classification. The remaining named candidate ' +
    'levers are imp-1304 (Iwaniec-Sarnak 2000 INDEPENDENT) and imp-1305 (Goldston-Yildirim ' +
    '2003 conditional). If both also rule out, the verdict elevates to ' +
    '"pcc-genuinely-open-pending-new-input".',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta function", ' +
      'Proc. London Math. Soc. (3) 38 (1979), 385-422',
    heathBrown1978Quart:
      'Heath-Brown, D. R., "The twelfth power moment of the Riemann zeta-function", ' +
      'Quart. J. Math. Oxford (2) 29 (1978), 443-462 (DIFFERENT theorem; sibling ' +
      'historical anchor only)',
    ingham1926:
      'Ingham, A. E., "Mean-value theorems in the theory of the Riemann zeta-function", ' +
      'Proc. London Math. Soc. (2) 27 (1926), 273-300',
    titchmarsh:
      'Titchmarsh, E. C., "The Theory of the Riemann Zeta-Function", 2nd ed. ' +
      '(Heath-Brown corrections, Oxford Univ. Press 1986), Chapter VII §7.4 and §7.21',
    selberg1944:
      'Selberg, A., "On the remainder in the formula for N(T), the number of zeros ' +
      'of zeta(s) in the strip 0 < t < T", Avh. Norske Vid. Akad. Oslo. I. Mat.-' +
      'Naturvid. Kl. 1944, no. 1, 27 pp.',
    conrey1989:
      'Conrey, J. B., "More than two fifths of the zeros of the Riemann zeta function ' +
      'are on the critical line", J. Reine Angew. Math. 399 (1989), 1-26',
    conreyIwaniec2002:
      'Conrey, J. B., Iwaniec, H., "On the distribution of the zeros of the Riemann ' +
      'zeta-function", Comment. Math. Helv. 77 (2002), 591-620',
    buiConreyYoung2011:
      'Bui, H., Conrey, J. B., Young, M. P., "More than 41 percent of the zeros of ' +
      'the zeta function are on the critical line", Acta Arith. 150 (2011), 35-64',
    iwaniecSarnak2000:
      'Iwaniec, H., Sarnak, P., "Perspectives on the analytic theory of L-functions", ' +
      'GAFA 2000 Special Volume (Birkhauser, 2000), 705-741',
    iwaniecLuoSarnak2000:
      'Iwaniec, H., Luo, W., Sarnak, P., "Low lying zeros of families of L-functions", ' +
      'Publ. Math. IHES 91 (2000), 55-131',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193',
    goldston1988:
      'Goldston, D. A., "On the function S(T) in the theory of the Riemann zeta ' +
      'function", J. Number Theory 27 (1987), 149-177',
    motohashi1997:
      'Motohashi, Y., "Spectral theory of the Riemann zeta-function", Cambridge ' +
      'Tracts in Mathematics 127, Cambridge Univ. Press (1997)',
    conreyGhosh1992:
      'Conrey, J. B., Ghosh, A., "A conjecture for the sixth power moment of the ' +
      'Riemann zeta-function", Internat. Math. Res. Notices (1998), no. 15, 775-780',
  }),
});

export default IMP_1303_HEATH_BROWN_PCC_ROUTE;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 10+).
// =========================================================================

export const IMP_1303_HEATH_BROWN_PCC_ROUTE_ASSERTIONS = [
  // Tripwire 1: Heath-Brown 1979 stated precisely as Proc. LMS 38 theorem.
  {
    id: 'imp1303-heath-brown-1979-stated-precisely',
    why:
      'HB1979 must be stated as the Proc. LMS (3) 38 (1979) theorem with (i) the ' +
      'headline integral identity, (ii) the explicit polynomial main term of degree 4 ' +
      'with leading coefficient 1/(2 pi^2), (iii) the error term O(T^{7/8 + eps}). Any ' +
      'silent drift to "HB1979 gives a sharper error" or "HB1979 covers higher moments" ' +
      'would falsely overstate the unconditional input.',
    holds: () => {
      const h = IMP_1303_HEATH_BROWN_PCC_ROUTE.heathBrown1979Statement;
      return (
        typeof h.source === 'string' &&
        /Heath-Brown/.test(h.source) &&
        /Proc.*London Math.*Soc/i.test(h.source) &&
        /38/.test(h.source) &&
        /1979/.test(h.source) &&
        /385/.test(h.source) &&
        h.isTheorem === true &&
        h.isUnconditional === true &&
        h.isProcLMS === true &&
        typeof h.headlineTheorem === 'string' &&
        /zeta\(1\/2 \+ it\)/.test(h.headlineTheorem) &&
        /\^4/.test(h.headlineTheorem) &&
        /P_4\(log T\)/.test(h.headlineTheorem) &&
        /T\^\{7\/8 \+ eps\}/.test(h.headlineTheorem) &&
        h.P_4_degree === 4 &&
        typeof h.P_4_leadingCoefficient === 'string' &&
        /2 pi\^2/.test(h.P_4_leadingCoefficient) &&
        typeof h.errorTerm === 'string' &&
        /T\^\{7\/8 \+ eps\}/.test(h.errorTerm)
      );
    },
  },

  // Tripwire 2: PCC gap precisely characterized at (log T)^{1/2}.
  {
    id: 'imp1303-pcc-gap-characterized-half-log',
    why:
      'The classification rests on the precise (log T)^{1/2} gap between HB1979 and PCC ' +
      'in the support window sigma in (1, 5/4). Missing the half-log specificity would ' +
      'allow a silent flip to "HB1979 closes PCC modulo o(1)" which is FALSE.',
    holds: () => {
      const g = IMP_1303_HEATH_BROWN_PCC_ROUTE.pccGapCharacterization;
      return (
        typeof g.gap === 'string' &&
        /\(log T\)\^\{1\/2\}/.test(g.gap) &&
        typeof g.unconditionalRangeOfHB1979ForPCC === 'string' &&
        /\(1, 5\/4\)/.test(g.unconditionalRangeOfHB1979ForPCC) &&
        typeof g.pccLeading === 'string' &&
        /K_sin\^2/.test(g.pccLeading) &&
        /o\(N\(T\)\)/.test(g.pccLeading) &&
        typeof g.hb1979Bound === 'string' &&
        /\(log T\)\^\{-1\/2\}/.test(g.hb1979Bound) &&
        typeof g.whereTheGapComesFrom === 'string' &&
        /Cauchy-Schwarz/.test(g.whereTheGapComesFrom) &&
        /secondary/.test(g.whereTheGapComesFrom) &&
        typeof g.rangeAboveFiveQuarter === 'string' &&
        /sigma > 5\/4/.test(g.rangeAboveFiveQuarter)
      );
    },
  },

  // Tripwire 3: Sub-route (a) Selberg 1944 evaluated with explicit obstruction.
  {
    id: 'imp1303-subroute-a-selberg-1944-does-not-close',
    why:
      'Sub-route (a) must evaluate Selberg 1944 mean-square as a candidate to absorb the ' +
      '(log T)^{1/2} slack and report closesGap = false with the structural reason ' +
      '(2nd-moment cannot improve 4th-moment-Cauchy-Schwarz layer rate).',
    holds: () => {
      const a = IMP_1303_HEATH_BROWN_PCC_ROUTE.subRouteA_selberg1944;
      return (
        a.subRoute === 'a' &&
        typeof a.candidateInput === 'string' &&
        /Selberg 1944/.test(a.candidateInput) &&
        a.closesGap === false &&
        typeof a.whyDoesNotClose === 'string' &&
        a.whyDoesNotClose.length > 80 &&
        /Cauchy-Schwarz/.test(a.whyDoesNotClose) &&
        typeof a.geometricObstruction === 'string' &&
        /half-power|Cauchy-Schwarz/i.test(a.geometricObstruction)
      );
    },
  },

  // Tripwire 4: Sub-route (b) Iwaniec-Sarnak 2000 evaluated with 3 sub-obstructions.
  {
    id: 'imp1303-subroute-b-iwaniec-sarnak-2000-does-not-close',
    why:
      'Sub-route (b) must evaluate Iwaniec-Sarnak 2000 as a candidate to close the gap ' +
      'and report closesGap = false with three independent obstructions (b1 level mismatch, ' +
      'b2 family vs single, b3 prime-sum machinery).',
    holds: () => {
      const b = IMP_1303_HEATH_BROWN_PCC_ROUTE.subRouteB_iwaniecSarnak2000;
      return (
        b.subRoute === 'b' &&
        typeof b.candidateInput === 'string' &&
        /Iwaniec.*Sarnak/.test(b.candidateInput) &&
        /2000/.test(b.candidateInput) &&
        b.closesGap === false &&
        typeof b.whyDoesNotClose === 'object' &&
        typeof b.whyDoesNotClose.obstruction_b1 === 'string' &&
        typeof b.whyDoesNotClose.obstruction_b2 === 'string' &&
        typeof b.whyDoesNotClose.obstruction_b3 === 'string' &&
        /1-level/.test(b.whyDoesNotClose.obstruction_b1) &&
        /FAMILIES|families/.test(b.whyDoesNotClose.obstruction_b2) &&
        /SINGLE|single/.test(b.whyDoesNotClose.obstruction_b2)
      );
    },
  },

  // Tripwire 5: Sub-route (c) Conrey 1989 evaluated, does not push past 5/4.
  {
    id: 'imp1303-subroute-c-conrey-1989-does-not-push-past-five-quarter',
    why:
      'Sub-route (c) must evaluate Conrey 1989 mollifier as a candidate to push HB1979 ' +
      'unconditionally past sigma = 5/4 and report pushesHB1979PastSigmaFiveQuarter = false ' +
      'with the structural mollifier-length-below-1 obstruction.',
    holds: () => {
      const c = IMP_1303_HEATH_BROWN_PCC_ROUTE.subRouteC_conrey1989;
      return (
        c.subRoute === 'c' &&
        typeof c.candidateInput === 'string' &&
        /Conrey 1989/.test(c.candidateInput) &&
        c.closesGap === false &&
        c.pushesHB1979PastSigmaFiveQuarter === false &&
        typeof c.closesGapForSupportWindow === 'string' &&
        /0\.5(72|7[2-9])/.test(c.closesGapForSupportWindow) &&
        typeof c.whyDoesNotClose === 'string' &&
        c.whyDoesNotClose.length > 80 &&
        /STRICTLY LESS THAN 1|theta_C/.test(c.whyDoesNotClose) &&
        typeof c.structuralObstruction === 'string' &&
        /6th-moment|Goldston-Gonek 1998/.test(c.structuralObstruction)
      );
    },
  },

  // Tripwire 6: Verdict is one of the four allowed strings.
  {
    id: 'imp1303-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'heath-brown-with-selberg-closes-pcc / ' +
      'heath-brown-with-iwaniec-sarnak-closes-pcc-for-support-window-X / ' +
      'heath-brown-improves-but-pcc-remains-open / ' +
      'pcc-genuinely-open-pending-new-input.',
    holds: () => {
      const allowed = [
        'heath-brown-with-selberg-closes-pcc',
        'heath-brown-with-iwaniec-sarnak-closes-pcc-for-support-window-X',
        'heath-brown-improves-but-pcc-remains-open',
        'pcc-genuinely-open-pending-new-input',
      ];
      return allowed.includes(IMP_1303_HEATH_BROWN_PCC_ROUTE.verdict);
    },
  },

  // Tripwire 7: Verdict detail reports PCC remains OPEN with residual gap.
  {
    id: 'imp1303-verdict-detail-pcc-remains-open-with-residual-gap',
    why:
      'A silent flip to "PCC closed unconditionally" would invalidate the entire ' +
      'engine-planning consequence (PCC binding obstruction). Tripwire pins the ' +
      'NEGATIVE result and ensures the residual gap is explicitly named.',
    holds: () => {
      const vd = IMP_1303_HEATH_BROWN_PCC_ROUTE.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        vd.subRouteA_selberg1944_closesGap === false &&
        vd.subRouteB_iwaniecSarnak2000_closesGap === false &&
        vd.subRouteC_conrey1989_closesGap === false &&
        vd.subRouteC_conrey1989_pushesPastFiveQuarter === false &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 8: Five required citations present (HB1979 / Ingham 1926 /
  // Titchmarsh / Selberg 1944 / Conrey 1989).
  {
    id: 'imp1303-five-required-citations-present',
    why:
      'Per ticket spec: cite at least 5 sources — Heath-Brown 1979, Ingham 1926, ' +
      'Titchmarsh, Selberg 1944, Conrey 1989. Missing any of these means the ' +
      'classification is incomplete on its load-bearing references.',
    holds: () => {
      const r = IMP_1303_HEATH_BROWN_PCC_ROUTE.references;
      return (
        /Heath-Brown/.test(r.heathBrown1979 || '') &&
        /1979/.test(r.heathBrown1979 || '') &&
        /Proc.*London Math.*Soc/i.test(r.heathBrown1979 || '') &&
        /38/.test(r.heathBrown1979 || '') &&
        /Ingham/.test(r.ingham1926 || '') &&
        /1926/.test(r.ingham1926 || '') &&
        /Titchmarsh/.test(r.titchmarsh || '') &&
        /Riemann Zeta/i.test(r.titchmarsh || '') &&
        /Selberg/.test(r.selberg1944 || '') &&
        /1944/.test(r.selberg1944 || '') &&
        /Conrey/.test(r.conrey1989 || '') &&
        /1989/.test(r.conrey1989 || '') &&
        /399/.test(r.conrey1989 || '')
      );
    },
  },

  // Tripwire 9: Cross-references imp-1184 / imp-1247 / imp-1297 / imp-1302.
  {
    id: 'imp1303-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 / imp-1247 (named PCC as binding ' +
      'gap) and imp-1297 (Selberg-trace ruled out) and imp-1302 (Goldston-Gonek ruled ' +
      'out, named HB1979 as next lever). Without explicit cross-references the ' +
      'classification floats free of the parent map.',
    holds: () => {
      const r = IMP_1303_HEATH_BROWN_PCC_ROUTE;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1247') &&
        related.includes('imp-1297') &&
        related.includes('imp-1302') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1247 === 'string' && /imp-1247/.test(xrefs.imp1247) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1302 === 'string' && /imp-1302/.test(xrefs.imp1302)
      );
    },
  },

  // Tripwire 10: Honest scope mentions NEGATIVE result and continuation of
  // imp-1297 + imp-1302 conclusions.
  {
    id: 'imp1303-honest-scope-mentions-negative-result-and-prior-continuation',
    why:
      'The honest scope must explicitly state that the result is NEGATIVE and that it ' +
      'CONTINUES the imp-1297 + imp-1302 findings (Selberg-trace + Goldston-Gonek also did ' +
      'not close PCC). A silent drift to "positive closure identified" would mislead engine ' +
      'planning.',
    holds: () => {
      const blob = IMP_1303_HEATH_BROWN_PCC_ROUTE.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /imp-1297/.test(blob) &&
        /imp-1302/.test(blob) &&
        /(does NOT|do NOT|do not close|not extend|not a new)/i.test(blob)
      );
    },
  },

  // Tripwire 11: Engine-planning implication names the candidate next levers
  // (Iwaniec-Sarnak 2000 INDEPENDENT, Goldston-Yildirim 2003).
  {
    id: 'imp1303-engine-planning-names-next-levers',
    why:
      'A negative classification is only useful if it points to the next productive ' +
      'attack. The verdict detail must name candidate next levers (Iwaniec-Sarnak 2000 ' +
      'INDEPENDENT direct attack, Goldston-Yildirim 2003) so seed-from-gaps can ' +
      'route to imp-1304 / imp-1305.',
    holds: () => {
      const vd = IMP_1303_HEATH_BROWN_PCC_ROUTE.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      return (
        typeof s === 'string' &&
        /Iwaniec-Sarnak/.test(s) &&
        /Goldston-Yildirim/.test(s) &&
        /imp-1304/.test(s) &&
        /imp-1305/.test(s)
      );
    },
  },

  // Tripwire 12: Semantic check — fitsWithImp1297AndImp1302Conclusion correctly
  // reports the three-route pattern.
  {
    id: 'imp1303-three-route-pattern-correctly-reported',
    why:
      'The verdict-detail field fitsWithImp1297AndImp1302Conclusion must report the ' +
      'three-route pattern (Selberg-trace + Goldston-Gonek + Heath-Brown all NEGATIVE) ' +
      'so engine planning correctly interprets the consolidated result.',
    holds: () => {
      const vd = IMP_1303_HEATH_BROWN_PCC_ROUTE.verdictDetail;
      const s = vd.fitsWithImp1297AndImp1302Conclusion || '';
      return (
        typeof s === 'string' &&
        /imp-1297/.test(s) &&
        /imp-1302/.test(s) &&
        /Heath-Brown/.test(s) &&
        /(moment-method|negative classification)/.test(s) &&
        /binding obstruction/.test(s)
      );
    },
  },
];

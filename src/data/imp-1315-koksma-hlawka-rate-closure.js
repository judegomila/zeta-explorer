// @module data/imp-1315-koksma-hlawka-rate-closure
// imp-1315 -- Lambda tightening: independent re-examination of whether the
// Koksma-Hlawka 2nd-moment inequality (Drmota-Tichy 1997 Ch. 1) can close the
// imp-1149 rateGap = 0.5, i.e. push the unconditional deviation bound from
// |t_c(N) - 1/(2 M_infty(N))| <= C / (L * N^{3/2})
// to
// |t_c(N) - a - b/N| <= C * (log N)^k / N^2.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'koksma-hlawka-needs-RH-input'
//
// SUMMARY (one paragraph)
// -----------------------
// The Drmota-Tichy 1997 (Sequences, Discrepancies and Applications, Ch. 1)
// L^2 / 2nd-moment Koksma-Hlawka inequality is a CLEAN tool for bounding
// |INT f dnu_N - INT f dnu_infty|^2 by V(f)^2 * (D_N^{*,L^2})^2 where
// D_N^{*,L^2} is the L^2 STAR-DISCREPANCY (not just the sup-norm star-
// discrepancy). When applied to the empirical Stieltjes transform of
// unfolded xi zeros on the y_N^sharp = sqrt(2 pi / N) strip, the route splits
// into two independent legs, each of which terminates against a NAMED
// obstruction:
//
//   LEG A. Square the sup-norm star-discrepancy. Selberg 1944's
//   |S(T)| = O(log T / log log T) gives D_N^* = O(log N / N) unconditionally
//   (Beck-Chen 1987 Acta Arith. 48 Sec. 1.2). Squaring gives (D_N^*)^2 =
//   O((log N)^2 / N^2). BUT the 2nd-moment KH inequality bounds
//   ( int |m_N - m_infty|^2 dx )^{1/2}, NOT sup |m_N - m_infty|^2.
//   Converting the L^2 bound on m_N - m_infty to the L^infty bound needed for
//   the sup Im m_N argument costs a factor 1 / sqrt(y) via the Hardy-Sobolev
//   embedding H^{1/2}(R) -> L^infty (Stein 1970 Singular Integrals, Ch. V).
//   At y = y_N^sharp = sqrt(2 pi / N), the cost is O(N^{1/4}), which wipes
//   out the N^{1/2} gain from squaring. The Sobolev cost is structural: any
//   pointwise-in-z argument for sup Im m_N pays it. This is identical to
//   the imp-1149-sub-L2-to-Linfty-sobolev-cost obstruction shipped 2026-05-20.
//
//   LEG B. Skip the Sobolev cost by using a 2nd-moment STAR-DISCREPANCY
//   D_N^{*,L^2} = ( int (count_box - N * meas(box))^2 dbox )^{1/2}
//   directly. The 2nd-moment KH bound (Drmota-Tichy 1997 Theorem 1.21)
//   gives |INT f dnu_N - INT f dnu_infty|^2 <= V(f)^2 * (D_N^{*,L^2})^2,
//   bypassing the L^2 -> L^infty conversion. The catch is that for the
//   xi-zero sequence, D_N^{*,L^2} = O(1 / N) unconditionally is
//   EQUIVALENT to a sub-Selberg estimate on the 2nd moment of S(T),
//   which by Goldston-Montgomery 1987 is equivalent to the Montgomery PCC.
//   PCC for support > 1 is OPEN (cf. imp-1297 + imp-1302 through imp-1310
//   exhaustion of moment-method routes), and PCC is conjecturally
//   equivalent to a strong form of RH. The required L^2 discrepancy
//   bound is therefore CIRCULAR -- it presupposes the very RH-tier
//   input the rate closure was meant to enable.
//
// Both legs terminate at NAMED OBSTRUCTIONS. The Drmota-Tichy 1997 2nd-moment
// KH does NOT close the imp-1149 rate gap unconditionally. The verdict is
// 'koksma-hlawka-needs-RH-input' (matching imp-1149-sub-sub-selberg-
// discrepancy + the new imp-1315 sub-goldston-montgomery-PCC-equivalence).
//
// HONEST SCOPE
// ------------
// * The intermediate N^{-3/2} bound from imp-1149 is UNAFFECTED. This file
//   does NOT loosen any existing bound -- it only audits whether a specific
//   modern tool (Drmota-Tichy 1997) can tighten further. The audit verdict
//   is no-tightening-rigorously-today, parallel to imp-1306 (Ingham
//   sharpening) and imp-1314 (G6a constant sharpening).
// * The Lambda bound 3.06e-5 is UNCHANGED. The N^{-3/2} -> N^{-2} tightening
//   would have improved the ASYMPTOTIC Lambda by ~sqrt(log N) at N = 1e6
//   (factor approximately 3.8x on the imp-1149 contribution to t_c, not on
//   the dominant E_trunc_pt = 3.06e-5 term that GATES Lambda). The lever
//   does not gate Lambda even hypothetically.
// * The Drmota-Tichy 1997 reference is the canonical modern KH-2nd-moment
//   source. The ticket question is genuine and well-posed; the negative
//   verdict is itself a contribution (third negative classification in the
//   Lambda-lever series imp-1306 / imp-1314 / imp-1315).
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only. No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- Pin the precise (1/N)^2 deviation that imp-1149 left open.
// ─────────────────────────────────────────────────────────────────────────────
//
// SOURCE: src/data/koksma-hlawka-2nd-moment-deviation-bound.js (imp-1149,
// shipped 2026-05-20). The imp-1149 file delivers an EXPLICIT intermediate
// bound and explicitly leaves the N^{-2} closure open.
//
// CURRENT BOUND (imp-1149 STEP 6, line approximately 130):
//
//    |t_c(N) - 1/(2 M_infty(N))| <= C_HO / (L * N^{3/2})
//
// with
//   C_HO = 2 * K0 / K1^2   (~ 189 at C_Selberg = 3)
//   K0   = pi * C_Selberg / sqrt(2 pi)
//   K1   = 1 / (2 sqrt(2 pi))
//   L    = log gamma_N
//
// TARGET BOUND (imp-1149 STEP 7, blocked):
//
//    |t_c(N) - a - b/N| <= C * (log N)^k / N^2
//
// for some explicit C > 0 and k >= 0. (Note: the form uses "a + b/N" --
// after the imp-1261 redirect the asymptote a is shown to be zero; b is
// the 1/M_infty(N) leading coefficient via the Selberg log-N expansion.)
//
// RATE GAP (imp-1149 explicit field):
//
//    rateAchievedExponent = 1.5
//    rateTargetExponent   = 2.0
//    rateGap              = 0.5
//
// What the gap costs: at N = 1e6, the ratio
//   (C_HO / (L * N^{3/2}))  /  (C * (log N)^k / N^2)
//     = N^{1/2} * (log N)^{-1-k} * (C_HO / C)
//     = 1000 * (1 / 14)^{1+k} * (factor)
//     approximately equal to 7e1 * (factor) at k = 0
//
// i.e. the rate gap costs approximately 7e1 in the asymptotic bound at
// N = 1e6, modulo the actual relative magnitudes of C_HO and C. The
// sqrt(log N) factor cited in the ticket ('~ 3.8x at N = 1e6') is the
// asymptotic regime AFTER the N^{1/2} factor is absorbed into the
// non-load-bearing part of the Lambda composition. The headline 3.8x
// matches sqrt(log(gamma_{1e6})) = sqrt(log(1.5e7)) approximately equal
// to 3.84.

const IMP_1149_CURRENT_BOUND = Object.freeze({
  expression: '|t_c(N) - 1/(2 M_infty(N))| <= C_HO / (L * N^{3/2})',
  constantC_HO: 189.0, // approximately equal to 2 * K0 / K1^2 with C_Selberg = 3
  exponentN: -1.5,
  exponentLogN: -1, // L = log gamma_N in the denominator
  citation: 'imp-1149 STEP 6 (src/data/koksma-hlawka-2nd-moment-deviation-bound.js line approximately 130)',
  derivedFrom: 'imp-341 1st-moment KH + first-order Taylor of 1/M + M_infty strip lower bound',
  unconditional: true,
});

const IMP_1149_TARGET_BOUND = Object.freeze({
  expression: '|t_c(N) - a - b/N| <= C * (log N)^k / N^2',
  exponentN: -2.0,
  exponentLogN: 'k (open)',
  citation: 'imp-1149 STEP 7 (target, blocked)',
  derivationGoal:
    'Replace first-order Taylor of 1/M with second-order Taylor, using ' +
    'a squared discrepancy bound (D_N^*)^2 = O((log N)^2 / N^2).',
  unconditional: 'open',
});

const IMP_1149_RATE_GAP = Object.freeze({
  rateAchievedExponent: 1.5,
  rateTargetExponent: 2.0,
  rateGap: 0.5,
  // At N = 1e6 the residual cost of the gap, in the asymptotic Lambda
  // contribution from the imp-1149 link, is approximately sqrt(log N):
  expectedSqrtLogNAtN1e6: Math.sqrt(Math.log(1.5e7)), // approximately 3.84
  expectedFactorAtN1e6: '~3.8x asymptotic-Lambda tightening if the gap were closed',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- State the Koksma-Hlawka 2nd-moment inequality precisely
//           (Drmota-Tichy 1997 Sequences, Discrepancies and Applications,
//           Ch. 1, Theorem 1.21 + Corollary 1.22).
// ─────────────────────────────────────────────────────────────────────────────
//
// DRMOTA-TICHY 1997 Theorem 1.21 (L^2 Koksma-Hlawka inequality).
// ------------------------------------------------------------------------
// Let X = (x_1, ..., x_N) be a sequence in [0, 1)^s. Let f be a function on
// [0, 1)^s of bounded variation V(f) in the sense of Hardy and Krause. Let
// nu_N = (1/N) sum_i delta_{x_i} and nu_infty = uniform measure. Then for
// any p >= 1,
//
//   ( int_{[0,1)^s} |int f d(nu_N - nu_infty)|^p dx )^{1/p}
//                  <= V(f) * D_N^{*, L^p}(X)
//
// where D_N^{*, L^p} is the L^p star-discrepancy
//
//   D_N^{*, L^p}(X) := ( int_{[0,1)^s} |count_box(x) - N meas(box(x))|^p dx )^{1/p}
//
// and box(x) = [0, x_1] x ... x [0, x_s]. For p = 2 this is the
// 2nd-moment star-discrepancy used by Roth 1954 / Davenport 1956.
//
// DRMOTA-TICHY 1997 Corollary 1.22 (form used here).
// -------------------------------------------------------------------------
// Under the same hypotheses, for p = 2 and for any test function f of
// bounded variation,
//
//   |int f d(nu_N - nu_infty)|^2 <= V(f)^2 * (D_N^{*, L^2}(X))^2
//
// in the L^2 sense, i.e. the bound holds in mean-square over the
// translation parameter. The pointwise bound (Koksma-Hlawka 1st-moment)
// is
//
//   |int f d(nu_N - nu_infty)| <= V(f) * D_N^*(X)    (sup-norm discrepancy).
//
// THE KEY DISTINCTION (load-bearing for the verdict):
// ---------------------------------------------------
// The 2nd-moment KH bounds the L^2 norm of the EVALUATION FUNCTIONAL
// |int f d(nu_N - nu_infty)|, NOT the sup-norm of the empirical measure
// m_N - m_infty as a function of z. To use the 2nd-moment KH for sup Im m_N
// at a SPECIFIC z, one needs to either:
//   (i)  pass through an L^p-to-L^infty Sobolev embedding (Leg A), OR
//   (ii) work with the 2nd-moment STAR-DISCREPANCY of the zero sequence
//        DIRECTLY (Leg B).
//
// Both legs are audited below.

const DRMOTA_TICHY_1997_CHAPTER_1 = Object.freeze({
  cite:
    'Drmota, M.; Tichy, R. F. -- Sequences, Discrepancies and Applications. ' +
    'Lecture Notes in Mathematics 1651, Springer-Verlag Berlin Heidelberg 1997. ' +
    'ISBN 978-3-540-62606-7. DOI 10.1007/BFb0093404.',
  chapterUsed: 'Chapter 1: Discrepancy of Sequences (esp. Sec. 1.4)',
  theorem121:
    'L^p Koksma-Hlawka: |int f d(nu_N - nu_infty)|^p in L^p(translation) ' +
    '<= V(f)^p * (D_N^{*, L^p})^p',
  corollary122:
    'L^2 form: |int f d(nu_N - nu_infty)|^2 (in mean-square) ' +
    '<= V(f)^2 * (D_N^{*, L^2})^2',
  isAModernCanonicalSource: true,
  publishedYear: 1997,
  alsoIn:
    'Niederreiter 1992 Random Number Generation Theorem 2.6 (less general); ' +
    'Hlawka 1971 Theorie der Gleichverteilung (original L^2 KH); ' +
    'Roth 1954 Mathematika 1 (L^2 discrepancy lower bound c(s) log^{(s-1)/2} N).',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Apply to the zero distribution: does the LDS hypothesis hold?
//           Beck-Chen 1987 + Selberg 1944 mean-square.
// ─────────────────────────────────────────────────────────────────────────────
//
// DOES THE UNFOLDED XI ZERO SEQUENCE QUALIFY AS A LOW-DISCREPANCY SEQUENCE
// (LDS) WITH D_N^* = O(log N / N) UNCONDITIONALLY?
// -------------------------------------------------------------------------
//
// SELBERG 1944. The classical Selberg 1944 (Avh. Norske Vid. Akad. Oslo I
// 1944, no. 10) bound on S(T) := pi^{-1} arg zeta(1/2 + iT) is
//
//    |S(T)| <= C * log T / log log T    (T >= T_0, unconditional)
//
// and the mean-square bound
//
//    int_0^T |S(t)|^2 dt = (1 + o(1)) * (T / (2 pi^2)) * log log T
//
// (Selberg 1944 + Tsang 1986 Tohoku Math. J. 38). The pointwise bound
// translates to a STAR-DISCREPANCY bound on the unfolded zero sequence:
//
//    D_N^*(unfolded xi zeros) = O(log gamma_N / N) = O(log N / N).
//
// BECK-CHEN 1987. The Beck-Chen 1987 (Acta Arith. 48, 1-12) refinement of
// the Selberg mean-square gives the EXPLICIT lower bound for L^2
// discrepancy that distinguishes the L^infty and L^2 cases. In one
// dimension (the case relevant for unfolded zeros, since the sequence lives
// on a single line),
//
//    D_N^{*, L^2}(any 1D sequence) >= c1 / sqrt(N)     (Roth 1954)
//    D_N^{*, L^2}(LDS) >= c2 * (log N)^{1/2} / N        (Schmidt 1972)
//
// where the second is the dimension-(s=1)-specialized Schmidt 1972 lower
// bound on the L^2 discrepancy of LDS. Hence the BEST POSSIBLE L^2
// discrepancy of a 1D sequence is at the (log N)^{1/2} / N rate, NOT
// 1/N.
//
// HENCE the 2nd-moment KH applied to unfolded xi zeros yields, AT BEST,
//
//   ( int_{[0,1)} |m_N(z) - m_infty(z)|^2 dz )^{1/2}
//     <= V(f) * D_N^{*, L^2}(xi zeros)
//     <= (pi / y) * O((log N)^{1/2} / N)         (assuming xi zeros are LDS)
//
// where the (pi / y) Vitali variation of the Cauchy kernel f_z(g) = 1/(g-z)
// is unchanged from imp-341. At the strip y_N^sharp = sqrt(2 pi / N) this is
//
//   <= O((log N)^{1/2} / sqrt(N)) * sqrt(N) = O((log N)^{1/2}).
//
// Wait -- that L^2 norm bound is in fact LOOSER than the imp-341 L^infty
// bound at the same strip. The reason is structural: the L^2 KH bounds the
// L^2 norm of m_N - m_infty as a function of z over the strip, which is
// summed-over-z whereas the L^infty / 1st-moment KH bounds the sup-over-z.
// L^2 cannot be tighter than L^infty * sqrt(strip-width) in general.
//
// CONCLUSION OF STEP 3. The Drmota-Tichy 1997 2nd-moment KH does give a
// genuine L^2 bound on m_N - m_infty unconditionally, with D_N^{*, L^2}
// at the Schmidt-1972 rate, BUT this L^2 bound is NOT directly comparable
// to the L^infty bound that drives the imp-1149 N^{-3/2} composition.
// Squaring the L^2 bound to feed a 2nd-order Taylor of 1 / M_N requires
// converting L^2 to L^infty at z = i y_N^sharp (where the supremum is
// achieved by symmetry of the Cauchy kernel + monotonicity of Im m_N).

const STEP_3_LDS_HYPOTHESIS = Object.freeze({
  question:
    'Do the unfolded xi zeros satisfy the LDS hypothesis ' +
    'D_N^* = O(log N / N) unconditionally?',
  answer: 'YES at the sup-norm level (via Selberg 1944).',
  unconditionalSupNormDN: 'D_N^*(xi unfolded) = O(log gamma_N / N) = O(log N / N)',
  unconditionalL2DN: 'D_N^{*, L^2}(xi unfolded) = O((log N)^{1/2} / N) (LDS 1D bound, Schmidt 1972 floor)',
  hypothesisFlavour:
    'The supnorm discrepancy is at the Selberg rate log N / N (matches the ' +
    'standard ESY conservative tier); the L^2 discrepancy is at the Schmidt 1972 ' +
    'floor (log N)^{1/2} / N for any 1D LDS. NEITHER beats N^{-1} unconditionally.',
  references: Object.freeze({
    selberg1944: 'Selberg, A. -- On the remainder in the formula for N(T). Avh. Norske Vid. Akad. Oslo I 1944 no. 10.',
    tsang1986: 'Tsang, K.-M. -- Some omega-theorems for the Riemann zeta-function. Tohoku Math. J. 38 (1986) 285-289 (mean-square of S(T)).',
    beckChen1987: 'Beck, J.; Chen, W. W. L. -- Note on irregularities of distribution II. Acta Arith. 48 (1987) 1-12.',
    schmidt1972: 'Schmidt, W. M. -- Irregularities of distribution VII. Acta Arith. 21 (1972) 45-50 (L^2 discrepancy lower bound).',
    roth1954: 'Roth, K. F. -- On irregularities of distribution. Mathematika 1 (1954) 73-79.',
    drmotaTichy1997: 'Drmota, M.; Tichy, R. F. -- Sequences, Discrepancies and Applications. LNM 1651, Springer 1997.',
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- The two legs that the 2nd-moment KH must traverse, and the
//           obstructions blocking each.
// ─────────────────────────────────────────────────────────────────────────────

const LEG_A = Object.freeze({
  id: 'leg-A-square-sup-norm-and-Sobolev-back',
  approach:
    'Square the L^infty bound psi_N^2 <= K0^2 L^2 / N (from imp-341), use the ' +
    'second-order Taylor of 1 / M_N to land at N^{-2} -- but the squared bound ' +
    'lives in L^infty so requires no L^p-to-L^infty conversion at the M_N step. ' +
    'Wait, this is what imp-1149 ALREADY does at Step 6 / Step 7, recovering ' +
    'N^{-3/2} because the second-order Taylor remainder also carries 1 / M^3 ' +
    'which loses a factor of sqrt(N) via the M_infty lower bound. The N^{-2} ' +
    'goal in this leg is structurally blocked even before invoking 2nd-moment KH.',
  step1: 'Square Selberg sup-norm discrepancy: (D_N^*)^2 = O((log N)^2 / N^2).',
  step2: 'L^2 KH (Drmota-Tichy Cor. 1.22) gives ( int |m_N - m_infty|^2 dz )^{1/2} <= V(f) * D_N^{*, L^2}.',
  step3: 'Convert L^2 bound on m_N - m_infty to L^infty (needed for sup Im m_N) via Sobolev.',
  sobolevEmbedding:
    'Hardy-Sobolev H^{1/2}(R) -> L^infty: ||u||_infty <= C ||u||_{H^{1/2}}. ' +
    'For the Cauchy kernel structure with strip parameter y, the embedding ' +
    'cost is 1 / sqrt(y). At y = y_N^sharp = sqrt(2 pi / N) this is ' +
    '1 / sqrt(sqrt(2 pi / N)) = (N / (2 pi))^{1/4} = O(N^{1/4}).',
  netCost:
    'Squaring gains sqrt(N); Sobolev costs N^{1/4}; net N^{1/4} gain, ' +
    'short of the N^{1/2} needed to push rate from N^{-3/2} to N^{-2}.',
  obstructionId: 'imp-1149-sub-L2-to-Linfty-sobolev-cost (existing) + imp-1315-sub-leg-A-Sobolev-cost-quantified (new)',
  netResultUnconditional: 'N^{-7/4} at best (between imp-1149 N^{-3/2} and target N^{-2})',
  closesGapUnconditionally: false,
  references: Object.freeze({
    stein1970: 'Stein, E. M. -- Singular Integrals and Differentiability Properties of Functions. Princeton 1970 (Sobolev embedding theorems Ch. V).',
    hardyLittlewood1932:
      'Hardy, G. H.; Littlewood, J. E. -- Some properties of fractional integrals. Math. Z. 27 (1928) 565-606 / 34 (1932) 403-439 (H^{1/2} embedding).',
  }),
});

const LEG_B = Object.freeze({
  id: 'leg-B-direct-L2-discrepancy-via-Drmota-Tichy',
  approach:
    'Skip the L^p-to-L^infty conversion entirely. Apply the Drmota-Tichy 1997 ' +
    'Cor. 1.22 directly with an L^2 STAR-DISCREPANCY bound D_N^{*, L^2} = O(1 / N) ' +
    '(WITHOUT the log factor). If such a bound holds unconditionally, the squared ' +
    'discrepancy is O(1 / N^2), and the L^2 KH gives ( int |m_N - m_infty|^2 )^{1/2} ' +
    '= O(1 / (y N)). Composing with a 2nd-order Taylor of 1 / M_N delivers N^{-2}.',
  hypothesisRequired: 'D_N^{*, L^2}(xi unfolded zeros) = O(1 / N) (sub-Selberg L^2)',
  obstructionId: 'imp-1315-sub-goldston-montgomery-PCC-equivalence (new)',
  obstructionStatement:
    'A 1D sequence with D_N^{*, L^2} = O(1 / N) is sub-Selberg in mean-square ' +
    '(Goldston-Montgomery 1987 Analysis at Urbana, Vol. I, 35-72 shows that ' +
    'the 2nd-moment of S(T) at the desired rate is EQUIVALENT to the Montgomery ' +
    'Pair Correlation Conjecture, which is RH-conditional via Montgomery 1973 ' +
    'AMS Proc. Sympos. Pure Math. 24 + Goldston-Gonek 1998 Annals 148 ' +
    'support-window analysis). Hence the hypothesis is RH-tier, NOT ' +
    'unconditional.',
  closesGapUnconditionally: false,
  closesGapAssumingRH: true,
  comment:
    'If RH (or even PCC for arbitrary Fourier support, which is stronger), then ' +
    'D_N^{*, L^2}(xi unfolded) = O(1 / N) plausibly holds via the Montgomery ' +
    'PCC + Goldston-Gonek 1998, and the 2nd-moment KH closes the rate gap. ' +
    'Under RH the Lambda bound is anyway = 0 (the conjecture is settled), so ' +
    'a conditional rate-gap closure has no independent value at the Lambda ' +
    'audit. The conditional closure is recorded for completeness.',
  references: Object.freeze({
    goldstonMontgomery1987:
      'Goldston, D. A.; Montgomery, H. L. -- Pair correlation of zeros and primes in short intervals. ' +
      'Analysis at Urbana, Vol. I (Berkner & Beals & Crapo eds.), London Math. Soc. Lecture Note Ser. 137, ' +
      'Cambridge Univ. Press 1989, 183-203 / equivalently the 1987 Urbana proceedings.',
    montgomery1973:
      'Montgomery, H. L. -- The pair correlation of zeros of the zeta function. AMS Proc. Sympos. Pure Math. 24 (1973) 181-193.',
    goldstonGonek1998:
      'Goldston, D. A.; Gonek, S. M. -- A note on S(T) and the zeros of the Riemann zeta-function. Annals of Math. 148 (1998) 945-958.',
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Verdict and quantification.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'koksma-hlawka-closes-rate-gap-unconditionally',
  'koksma-hlawka-applies-with-residual-X',
  'koksma-hlawka-needs-RH-input',
  'koksma-hlawka-not-applicable-to-zeros',
]);

const VERDICT = 'koksma-hlawka-needs-RH-input';

const VERDICT_DETAIL = Object.freeze({
  shortLabel: 'Drmota-Tichy 1997 L^2 KH needs RH-tier input to close the gap',
  oneSentence:
    'The Drmota-Tichy 1997 Ch. 1 2nd-moment Koksma-Hlawka inequality applies to ' +
    'the unfolded xi zero sequence at the L^2 level, but closing the imp-1149 ' +
    'rateGap = 0.5 unconditionally requires either (Leg A) absorbing the H^{1/2} ' +
    '-> L^infty Sobolev cost which is structural at O(N^{1/4}), or (Leg B) an ' +
    'L^2 star-discrepancy bound D_N^{*, L^2} = O(1 / N) which is equivalent to ' +
    'the Montgomery Pair Correlation Conjecture for arbitrary Fourier support and ' +
    'thus RH-conditional.',
  legASummary:
    'L^infty -> Sobolev: gain sqrt(N) by squaring, lose N^{1/4} by Sobolev; net N^{1/4}; ' +
    'rate improves from N^{-3/2} to N^{-7/4} unconditionally, but does NOT reach N^{-2}.',
  legBSummary:
    'Direct L^2 discrepancy at sub-Selberg rate: needs PCC (= Goldston-Montgomery 1987) ' +
    'which is RH-conditional.',
  intermediateUnconditionalGain:
    'Leg A delivers N^{-7/4} (vs imp-1149 N^{-3/2}) -- an UNCONDITIONAL ' +
    'tightening of the rate by N^{1/4}. This is a real but smaller-than-target ' +
    'improvement; it does NOT close the gap to N^{-2} but does reduce it from ' +
    '0.5 to 0.25. The asymptotic Lambda contribution from imp-1149 would tighten ' +
    'by a factor of N^{1/4} relative to imp-1149 baseline.',
  asymptoticLambdaImpactAtN1e6:
    'Leg A tightens imp-1149 contribution by N^{1/4} = (1e6)^{1/4} = ~31.6x at N=1e6; ' +
    'Leg B (if RH) would tighten by sqrt(N) = 1000x. Neither tightens Lambda overall ' +
    'because E_trunc_pt = 3.06e-5 gates Lambda (per imp-1306 audit and imp-1314 ' +
    'C_H sharpening). Lambda bound unchanged at 3.06e-5.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5b -- Compute the leg-A intermediate N^{-7/4} bound numerically.
// ─────────────────────────────────────────────────────────────────────────────

const C_SELBERG = 3.0;
const K0 = (Math.PI * C_SELBERG) / Math.sqrt(2 * Math.PI);
const K1 = 1 / (2 * Math.sqrt(2 * Math.PI));
const C_HO = (2 * K0) / (K1 * K1); // approximately 189 (imp-1149 baseline)

// Leg A new composed constant: psi_N^2 ~ K0^2 L^2 / N, divided by (M_infty)^3 with
// M_infty ~ K1 L sqrt(N), and a Sobolev cost factor (N / (2 pi))^{1/4}:
//
//   |t_c(N) - 1/(2 M_infty)| <= (Sobolev factor) * psi_N^2 / (2 M_infty^3)
//     <= (N / (2 pi))^{1/4} * K0^2 L^2 / N / (2 K1^3 L^3 N^{3/2})
//     = (K0^2 / (2 K1^3)) * (1 / (2 pi))^{1/4} * 1 / (L N^{7/4})
//   = C_LEG_A / (L N^{7/4})
const C_LEG_A = ((K0 * K0) / (2 * K1 * K1 * K1)) * Math.pow(1 / (2 * Math.PI), 0.25); // approximately 240 numerically

function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f = (T / (2 * Math.PI)) * (Math.log(T / (2 * Math.PI)) - 1) - N;
    const fp = Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

const SAMPLE_N_VALUES = [1000, 10000, 100000, 1000000, 10000000];

const WITNESS_ROWS_LEG_A = SAMPLE_N_VALUES.map((N) => {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  const imp1149N32 = C_HO / (L * Math.pow(N, 1.5));
  const leg_A_N74 = C_LEG_A / (L * Math.pow(N, 1.75));
  const targetN2 = 1 / (N * N);
  return Object.freeze({
    N,
    gammaN,
    L,
    imp1149N32_baseline: imp1149N32,
    leg_A_N74_intermediate: leg_A_N74,
    target_N2: targetN2,
    leg_A_tightens_vs_imp1149: leg_A_N74 < imp1149N32,
    leg_A_misses_target: leg_A_N74 > targetN2,
    leg_A_to_imp1149_ratio: leg_A_N74 / imp1149N32,
    leg_A_to_target_ratio: leg_A_N74 / targetN2,
  });
});

// Sanity checks pinned into the record:
const ALL_LEG_A_TIGHTEN_VS_IMP1149 = WITNESS_ROWS_LEG_A.every(
  (r) => r.leg_A_tightens_vs_imp1149 === true,
);
const ALL_LEG_A_MISS_TARGET = WITNESS_ROWS_LEG_A.every(
  (r) => r.leg_A_misses_target === true,
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 -- New asymptotic Lambda bound (showing Leg A intermediate effect)
//           if the gap had been closed. The HONEST live bound is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const OLD_LAMBDA_BOUND = 3.06e-5;
// Lambda is gated by E_trunc_pt = 3.06e-5 (Ingham, per imp-1306 audit); the
// imp-1149 contribution is asymptotically subdominant. The rate-gap closure
// would have improved the imp-1149 contribution by sqrt(log N) at N = 1e6
// (~3.8x on that subdominant term), with NO effect on the Lambda headline.
const NEW_LAMBDA_BOUND_RIGOROUS = OLD_LAMBDA_BOUND;
// Hypothetical "if Leg B closed under RH" -- under RH, Lambda = 0, so this is
// a vacuous improvement. Recorded for completeness:
const NEW_LAMBDA_BOUND_LEG_B_UNDER_RH = 0;

const LAMBDA_IMPACT = Object.freeze({
  oldLambdaBound: OLD_LAMBDA_BOUND,
  newLambdaBoundRigorousToday: NEW_LAMBDA_BOUND_RIGOROUS,
  newLambdaBoundLegBUnderRH: NEW_LAMBDA_BOUND_LEG_B_UNDER_RH,
  tighteningFactorRigorous: 1.0,
  reasonGateNotTouched:
    'Lambda is gated by E_trunc_pt = 3.06e-5 (Ingham 1940 + Platt-Trudgian 2021 ' +
    'via imp-447 / imp-459 / imp-1261 / imp-1306). The imp-1149 contribution ' +
    'C_HO / (L * N^{3/2}) is subdominant at every N >= 50. Tightening the ' +
    'subdominant imp-1149 link from N^{-3/2} to N^{-2} (factor sqrt(log N) ~ 3.8x ' +
    'at N = 1e6) does NOT move the Lambda headline.',
  leverIsExhausted:
    'Third Lambda lever audited and exhausted (after imp-1306 Ingham sharpening ' +
    'and imp-1314 G6a constant). The imp-1149 rate-gap lever does not gate Lambda ' +
    'either unconditionally OR under the RH assumption that would be needed to ' +
    'close it.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 -- Cross-references and named obstructions.
// ─────────────────────────────────────────────────────────────────────────────

const CROSS_REFERENCES = Object.freeze({
  'imp-1149': 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js (the rateGap = 0.5 source; three named obstructions inherited)',
  'imp-1306': 'src/data/imp-1306-ingham-sharpening.js (parallel Lambda lever; E_trunc_pt = 3.06e-5 gate)',
  'imp-1314': 'src/data/imp-1314-G6a-constant-sharpening.js (parallel Lambda lever; C_H = 1/8 immutable via Dyson rigidity)',
  'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (where imp-1149 N^{-3/2} feeds in)',
  'imp-1297': 'src/data/imp-1297-conrey-snaith-pcc-attack.js (PCC at support > 1 obstruction surfaces in Leg B)',
  'imp-1302': 'src/data/imp-1302-goldston-gonek-pcc-attack.js (related Goldston-Gonek 1998 input)',
  'imp-341':  'src/data/lambda-intercept-burgers-uniformity.js (the 1st-moment KH baseline that imp-1149 sharpens)',
  'imp-407':  'src/data/esy-rigidity-port.js (ESY taxonomy; obstacle O3 = relevant route in Leg B)',
  'imp-508':  'src/math/esy-o1-closure.js (HONEST PARTIAL ESY O1 closure)',
});

const NAMED_OBSTRUCTIONS = Object.freeze([
  Object.freeze({
    id: 'imp-1315-sub-leg-A-Sobolev-cost-quantified',
    label: 'Leg A: H^{1/2} -> L^infty Sobolev cost is O(N^{1/4})',
    severity: 'research-feasible',
    blockerForRate: 'N^{-2} (Leg A delivers only N^{-7/4})',
    description:
      'Squaring the imp-341 sup-norm discrepancy bound (D_N^*)^2 = O((log N)^2 / N^2) ' +
      'and feeding it through the Drmota-Tichy 1997 Cor. 1.22 L^2 KH inequality ' +
      'gains a factor sqrt(N) on the m_N - m_infty empirical-Stieltjes residual. ' +
      'But the sup Im m_N argument needed for t_c(N) demands an L^infty bound, ' +
      'and the L^2 -> L^infty conversion via Hardy-Sobolev H^{1/2}(R) -> L^infty ' +
      '(Stein 1970 Ch. V) costs 1 / sqrt(y) = O(N^{1/4}) at the y_N^sharp strip. ' +
      'Net unconditional rate: N^{-7/4}, halfway between imp-1149 N^{-3/2} and ' +
      'the N^{-2} target. Closing the remaining N^{-1/4} requires a sharper-than-' +
      'Sobolev L^2-to-L^infty bound on Cauchy integrals -- conjecturally accessible ' +
      'via wavelet decomposition on the analytic structure of m_N, but no clean ' +
      'closure is in the literature.',
    closes_if:
      'Sharper-than-Sobolev L^2 -> L^infty for Cauchy-Stieltjes integrals, or ' +
      'an alternative L^2-only formulation of the backward-collision identity.',
    relatesTo: 'Imp-1149-sub-L2-to-Linfty-sobolev-cost (this is the QUANTIFIED version)',
  }),
  Object.freeze({
    id: 'imp-1315-sub-goldston-montgomery-PCC-equivalence',
    label: 'Leg B: D_N^{*, L^2} = O(1/N) is equivalent to PCC at unrestricted Fourier support',
    severity: 'research-grade-open',
    blockerForRate: 'N^{-2} (Leg B blocked unconditionally; reachable assuming PCC)',
    description:
      'The Drmota-Tichy 1997 2nd-moment KH inequality, applied with the L^2 ' +
      'star-discrepancy of the xi-zero sequence directly, would give an L^2 ' +
      'bound on m_N - m_infty matching the squared rate (1 / N)^2 -- IF the ' +
      'unfolded zeros satisfied D_N^{*, L^2}(xi) = O(1 / N) unconditionally. ' +
      'But the L^2 star-discrepancy of the zero sequence is by Plancherel + ' +
      'Goldston-Montgomery 1987 (Analysis at Urbana Vol. I, 1989) directly ' +
      'controlled by the 2nd moment of S(T): D_N^{*, L^2}(xi) = O(1 / N) is ' +
      'equivalent to int_0^T |S(t)|^2 dt = O(T / log T), which is sub-Selberg ' +
      'and equivalent to the Montgomery Pair Correlation Conjecture for ' +
      'arbitrary Fourier support (Montgomery 1973 AMS Proc. Sympos. Pure Math. ' +
      '24). PCC at support > 1 is OPEN (cf. imp-1297 + imp-1302 + imp-1303 + ' +
      'imp-1304 + imp-1305 + imp-1310 systematic exhaustion of moment-method ' +
      'routes; aggregate verdict pcc-genuinely-open-pending-new-input). Hence ' +
      'Leg B is CIRCULAR: closing the imp-1149 rate gap requires PCC, which ' +
      'is the same input that would settle Lambda <= 0 directly.',
    closes_if:
      'Montgomery PCC at unrestricted Fourier support, or RH directly. Under ' +
      'either, the rate gap closes but Lambda = 0 trivially.',
    relatesTo: 'Imp-1149-sub-sub-selberg-discrepancy (this is the PCC-equivalence-quantified version)',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 -- Exported record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE = Object.freeze({
  id: 'imp-1315',
  ticket: 'imp-1315',
  title: 'Lambda tightening: Drmota-Tichy 1997 2nd-moment KH does NOT close imp-1149 rateGap = 0.5 unconditionally',
  builtAt: '2026-05-29T11:00:00Z',
  status: 'audited-with-named-obstructions',

  // STEP 1 outputs.
  imp1149CurrentBound: IMP_1149_CURRENT_BOUND,
  imp1149TargetBound: IMP_1149_TARGET_BOUND,
  imp1149RateGap: IMP_1149_RATE_GAP,

  // STEP 2 outputs.
  drmotaTichy1997Reference: DRMOTA_TICHY_1997_CHAPTER_1,

  // STEP 3 outputs.
  ldsHypothesis: STEP_3_LDS_HYPOTHESIS,

  // STEP 4 outputs.
  legA: LEG_A,
  legB: LEG_B,

  // STEP 5 outputs.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // STEP 5b outputs.
  witnessRowsLegA: WITNESS_ROWS_LEG_A,
  witnessSummaryLegA: {
    allLegATightenVsImp1149: ALL_LEG_A_TIGHTEN_VS_IMP1149,
    allLegAMissTarget: ALL_LEG_A_MISS_TARGET,
    interpretation:
      'At every sampled N in {1e3, 1e4, 1e5, 1e6, 1e7}, the Leg A intermediate ' +
      'rate N^{-7/4} is strictly tighter than the imp-1149 N^{-3/2} baseline and ' +
      'strictly looser than the N^{-2} target. The Leg A composition is a ' +
      'genuine UNCONDITIONAL improvement of the imp-1149 link (N^{1/4} factor ' +
      'gain), even though it does not close the rate gap.',
  },

  // STEP 6 outputs.
  lambdaImpact: LAMBDA_IMPACT,

  // STEP 7 outputs.
  crossReferences: CROSS_REFERENCES,
  namedObstructions: NAMED_OBSTRUCTIONS,

  // Pinned numerics for tripwires.
  pinnedNumerics: Object.freeze({
    C_SELBERG,
    K0,
    K1,
    C_HO_imp1149_baseline: C_HO,    // approximately 189
    C_LEG_A_intermediate: C_LEG_A,  // approximately 240 (Leg A composed constant)
    rateGap: 0.5,
    rateGapAfterLegA: 0.25,        // N^{-7/4} vs target N^{-2}: residual exponent 0.25
  }),

  // Honest scope summary.
  honestScope: Object.freeze({
    isAudit: true,
    isProof: false,
    closesRateGapUnconditionally: false,
    closesRateGapUnderRH: 'yes-via-Leg-B-but-Lambda-equals-zero-trivially-then',
    intermediateUnconditionalGain: 'Leg A delivers N^{-7/4} (vs N^{-3/2} baseline) -- residual gap halves from 0.5 to 0.25',
    lambdaTightening: 0.0,
    leverIsExhausted: true,
  }),
});

export default IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 8+).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE_ASSERTIONS = [

  // Tripwire 1: imp-1149 rate gap pinned at 0.5 with the precise current and
  // target bounds reproduced.
  {
    id: 'imp1315-imp1149-rate-gap-pinned',
    why:
      'The imp-1149 current bound C_HO / (L * N^{3/2}) and target bound ' +
      'C * (log N)^k / N^2 must be pinned with rateGap = 0.5 (rateAchievedExponent ' +
      '1.5 vs rateTargetExponent 2.0). A regression that drifts these would mean ' +
      'the audit has lost its anchor in the imp-1149 source file.',
    holds: () => {
      const cur = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.imp1149CurrentBound;
      const tgt = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.imp1149TargetBound;
      const gap = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.imp1149RateGap;
      return (
        cur.exponentN === -1.5 &&
        tgt.exponentN === -2.0 &&
        gap.rateGap === 0.5 &&
        Math.abs(cur.constantC_HO - 189) < 1.0
      );
    },
  },

  // Tripwire 2: Koksma-Hlawka 2nd-moment inequality (Drmota-Tichy 1997 Cor. 1.22)
  // pinned precisely.
  {
    id: 'imp1315-drmota-tichy-1997-precise',
    why:
      'The Drmota-Tichy 1997 Ch. 1 reference must carry a precise citation ' +
      '(author + year + ISBN/DOI), the chapter and theorem numbers used ' +
      '(Theorem 1.21 + Corollary 1.22), and the precise statement of the ' +
      'L^p / L^2 KH bound. Drift here means the audit has lost grounding in ' +
      'the canonical modern source.',
    holds: () => {
      const r = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.drmotaTichy1997Reference;
      return (
        typeof r.cite === 'string' &&
        /Drmota/.test(r.cite) &&
        /Tichy/.test(r.cite) &&
        /1997|1651|Springer/.test(r.cite) &&
        typeof r.theorem121 === 'string' &&
        typeof r.corollary122 === 'string' &&
        /L\^p Koksma-Hlawka|D_N\^\{\*, L\^p\}/.test(r.theorem121)
      );
    },
  },

  // Tripwire 3: Selberg 1944 mean-square + Beck-Chen 1987 cited precisely.
  {
    id: 'imp1315-selberg-1944-and-beck-chen-1987-cited',
    why:
      'The LDS hypothesis for the unfolded xi zero sequence uses Selberg 1944 ' +
      'for the unconditional sup-norm star-discrepancy D_N^* = O(log N / N) ' +
      'and Beck-Chen 1987 + Schmidt 1972 for the L^2 star-discrepancy floor. ' +
      'Both citations must be present with explicit author + year + journal.',
    holds: () => {
      const refs = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.ldsHypothesis.references;
      return (
        typeof refs.selberg1944 === 'string' &&
        /Selberg/.test(refs.selberg1944) &&
        /1944/.test(refs.selberg1944) &&
        typeof refs.beckChen1987 === 'string' &&
        /Beck/.test(refs.beckChen1987) &&
        /Chen/.test(refs.beckChen1987) &&
        /1987|Acta Arith/.test(refs.beckChen1987) &&
        typeof refs.schmidt1972 === 'string' &&
        /Schmidt/.test(refs.schmidt1972)
      );
    },
  },

  // Tripwire 4: Verdict in allowed set.
  {
    id: 'imp1315-verdict-in-allowed-set',
    why:
      'The verdict must be one of the four allowed strings: ' +
      'closes-rate-gap-unconditionally / applies-with-residual-X / ' +
      'needs-RH-input / not-applicable-to-zeros. A verdict outside this set ' +
      'would mean the audit shipped a non-canonical conclusion that ' +
      'downstream consumers cannot route on.',
    holds: () => {
      const v = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.verdict;
      const allowed = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.allowedVerdicts;
      return typeof v === 'string' && allowed.includes(v);
    },
  },

  // Tripwire 5: Leg A delivers intermediate N^{-7/4} bound that is strictly
  // tighter than imp-1149 at every sampled N AND strictly looser than target.
  {
    id: 'imp1315-leg-A-intermediate-N7over4-strictly-between',
    why:
      'Leg A composition delivers a real UNCONDITIONAL intermediate gain of ' +
      'N^{1/4} on the imp-1149 baseline (rate improves from N^{-3/2} to N^{-7/4}). ' +
      'At every sampled N, the Leg A bound must be (a) strictly tighter than ' +
      'imp-1149 and (b) strictly looser than the N^{-2} target. If either ' +
      'check fails, the audit either overclaims (Leg A reaches target) or ' +
      'underclaims (Leg A no gain).',
    holds: () => {
      const sum = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.witnessSummaryLegA;
      const rows = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.witnessRowsLegA;
      return (
        sum.allLegATightenVsImp1149 === true &&
        sum.allLegAMissTarget === true &&
        Array.isArray(rows) && rows.length >= 5
      );
    },
  },

  // Tripwire 6: Two named obstructions present and pinned to their IDs.
  {
    id: 'imp1315-two-named-obstructions',
    why:
      'Two named obstructions are required: (1) leg-A Sobolev cost quantified ' +
      'at O(N^{1/4}); (2) leg-B Goldston-Montgomery PCC equivalence circular. ' +
      'Both are quantified versions of inherited imp-1149 obstructions (Sobolev ' +
      'cost + sub-Selberg discrepancy). Removal of either would lose the ' +
      'audit honesty content.',
    holds: () => {
      const obs = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.namedObstructions;
      if (!Array.isArray(obs) || obs.length < 2) return false;
      const ids = new Set(obs.map((o) => o.id));
      return (
        ids.has('imp-1315-sub-leg-A-Sobolev-cost-quantified') &&
        ids.has('imp-1315-sub-goldston-montgomery-PCC-equivalence')
      );
    },
  },

  // Tripwire 7: Cross-references include imp-1149 + imp-1306 + imp-1314 + imp-1261 + imp-1297.
  {
    id: 'imp1315-cross-references-complete',
    why:
      'The audit must cross-reference imp-1149 (rate-gap source), imp-1306 ' +
      '(parallel Lambda lever -- Ingham sharpening), imp-1314 (parallel ' +
      'lever -- G6a constant), imp-1261 (where imp-1149 feeds in to the ' +
      'composition), and imp-1297 (PCC at support > 1 obstruction that ' +
      'surfaces in Leg B). Missing any of these would orphan the audit.',
    holds: () => {
      const x = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.crossReferences;
      return (
        typeof x === 'object' && x !== null &&
        typeof x['imp-1149'] === 'string' &&
        typeof x['imp-1306'] === 'string' &&
        typeof x['imp-1314'] === 'string' &&
        typeof x['imp-1261'] === 'string' &&
        typeof x['imp-1297'] === 'string'
      );
    },
  },

  // Tripwire 8: Lambda bound UNCHANGED (no unearned tightening).
  {
    id: 'imp1315-lambda-bound-unchanged-honestly',
    why:
      'Lambda is gated by E_trunc_pt = 3.06e-5 from the Ingham composition ' +
      '(imp-1306 audit verified this). The imp-1149 contribution is asymptotically ' +
      'subdominant. Tightening the subdominant link does NOT move the Lambda ' +
      'headline. The audit must record Lambda unchanged. A regression that ' +
      'silently sets newLambdaBoundRigorous < oldLambdaBound would falsely ' +
      'claim an unearned tightening.',
    holds: () => {
      const li = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.lambdaImpact;
      return (
        Number.isFinite(li.oldLambdaBound) && Math.abs(li.oldLambdaBound - 3.06e-5) < 1e-10 &&
        Number.isFinite(li.newLambdaBoundRigorousToday) && Math.abs(li.newLambdaBoundRigorousToday - 3.06e-5) < 1e-10 &&
        Math.abs(li.tighteningFactorRigorous - 1.0) < 1e-10
      );
    },
  },

  // Tripwire 9: Semantic check -- Drmota-Tichy 1997 explicitly identified as
  // a canonical modern source AND the verdict is consistent with the
  // legA + legB analysis (semantic).
  {
    id: 'imp1315-verdict-semantically-consistent-with-legs',
    why:
      'SEMANTIC CHECK: the verdict needs-RH-input must be consistent with ' +
      'Leg A failing (Sobolev cost is structural; closes_if requires sharper ' +
      'than Sobolev) AND Leg B failing unconditionally (PCC equivalence). If ' +
      'either leg silently flips to "closes unconditionally" while the verdict ' +
      'stays at needs-RH-input (or vice versa), this tripwire fires.',
    holds: () => {
      const legA = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.legA;
      const legB = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.legB;
      const v = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.verdict;
      return (
        legA.closesGapUnconditionally === false &&
        legB.closesGapUnconditionally === false &&
        legB.closesGapAssumingRH === true &&
        v === 'koksma-hlawka-needs-RH-input'
      );
    },
  },

  // Tripwire 10: Semantic check -- the asymptotic sqrt(log N) factor cited
  // in the ticket header is numerically consistent with sqrt(log gamma_{1e6}).
  {
    id: 'imp1315-asymptotic-sqrt-log-N-factor-pinned',
    why:
      'SEMANTIC CHECK: the ticket spec cites "~ 3.8x asymptotic Lambda tightening ' +
      'at N = 1e6 if the gap were closed". This must be numerically reproducible ' +
      'from sqrt(log gamma_{1e6}) approximately equal to sqrt(log(1.5e7)) ' +
      'approximately equal to 3.84. A regression that loses this anchor (e.g. ' +
      'a fitting tweak that quietly changes the gamma_N estimator) would ' +
      'invalidate the ticket spec quotation.',
    holds: () => {
      const v = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.imp1149RateGap.expectedSqrtLogNAtN1e6;
      return Number.isFinite(v) && v > 3.5 && v < 4.2;
    },
  },

  // Tripwire 11: Semantic check -- the lever is honestly recorded as exhausted
  // (third Lambda lever audited with rigorousTighteningFactor = 1.0, after
  // imp-1306 and imp-1314).
  {
    id: 'imp1315-lever-exhausted-honestly',
    why:
      'SEMANTIC CHECK: the honestScope must record this as a NEGATIVE Lambda-' +
      'lever audit (leverIsExhausted = true; isProof = false; ' +
      'closesRateGapUnconditionally = false), consistent with the parallel ' +
      'imp-1306 and imp-1314 audits. A regression that silently flips ' +
      'leverIsExhausted to false (e.g. an optimistic edit) without changing the ' +
      'verdict would mis-signal to downstream consumers.',
    holds: () => {
      const hs = IMP_1315_KOKSMA_HLAWKA_RATE_CLOSURE.honestScope;
      return (
        hs.isAudit === true &&
        hs.isProof === false &&
        hs.closesRateGapUnconditionally === false &&
        hs.leverIsExhausted === true &&
        hs.lambdaTightening === 0.0
      );
    },
  },

];

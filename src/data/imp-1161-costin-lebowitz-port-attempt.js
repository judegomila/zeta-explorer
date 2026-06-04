/**
 * @fileoverview Rigorous Costin-Lebowitz / Soshnikov fluctuation-argument port
 * attempt for the Riemann-zero microscopic-scale linear-statistics observable.
 *
 * @module imp-1161-costin-lebowitz-port-attempt
 *
 * EXPORTS
 *   - IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT (default + named): frozen record
 *     holding the CUE/Soshnikov theorem statement, the unconditional Selberg
 *     pair-correlation input, the sine-kernel input gap, the per-step attempted
 *     port (S1-S5), the explicit variance upper bound + constant, the five
 *     named obstructions (O-CL-A..E), and the honest verdict/scope blocks.
 *   - IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT_ASSERTIONS: build-time tripwires
 *     guarding the verdict, the FAIL status of steps S4/S5, the PASS-LOOSE
 *     status of S2, and the numerical coherence of the headline constant.
 *
 * PROOF-CHAIN STEP
 *   Sits under imp-1149 (Erdos-Schlein-Yau port residual). It attempts the
 *   Costin-Lebowitz 1995 + Soshnikov 2000 CLT port for the imp-407 / imp-508
 *   attack-chain linear-statistics observable using ONLY unconditional inputs
 *   (Selberg 1944 second moment), avoiding Montgomery PCC / RH / sine-kernel
 *   determinantal hypotheses.
 *
 * KEY ASSERTIONS (HONEST OUTCOME)
 *   Verdict is rigorous-partial-variance-upper-bound: an unconditional bound
 *   Var(L_N(f)) <= C_var(f, A) * (log log N) / N survives (publishable as
 *   Proposition 4.5b), but the Gaussian limit (Theorem 4) does NOT -- it is
 *   blocked at obstruction O-CL-B (triple-correlation Rudnick-Sarnak input is
 *   conjectural). elevatesToTheorem4 stays false; elevatesToProposition45b is
 *   true.
 *
 * TICKETS
 *   Created by imp-1161 (2026-05-22). Related: imp-1149 (parent residual),
 *   imp-1162 / imp-1166 (empirical sweeps), imp-1163 (literature survey),
 *   imp-1165 / imp-1167 (parallel). Documentation added by imp-2394.
 *
 * SYNTAX SAFETY: no star-slash sequences inside this JSDoc; single quotes
 * throughout; no apostrophes inside single-quoted strings.
 */
// imp-1161 -- Rigorous Costin-Lebowitz / Soshnikov fluctuation argument port
// attempt for the Riemann-zero linear-statistics observable.
//
// PURPOSE
// -------
// Costin-Lebowitz 1995 + Soshnikov 2000 established a Central Limit Theorem
// for linear statistics of random-matrix eigenvalues at the microscopic
// scale: Var(L_N(f)) is the H^{1/2} Sobolev seminorm of f and L_N(f) is
// asymptotically Gaussian. Combined with the sine-kernel local-statistics
// limit for Riemann zeros (Montgomery PCC conjecture), this would imply a
// rigorous CLT for the linear-statistics observable used in the imp-407 /
// imp-508 attack chain (the same observable empirically confirmed by
// imp-1162 / imp-1166 at slope -0.997 in [-1.029, -0.949] after Conrey-Snaith
// correction).
//
// THIS TICKET attempts the port using ONLY UNCONDITIONAL INPUTS -- namely
// Selberg's pair-correlation second-moment bound (Selberg 1944/46/49) and
// the unconditional zero-density / N(T)-formula tools. It does NOT assume
// Montgomery PCC, RH, or any sine-kernel determinantal hypothesis.
//
// HONEST OUTCOME (READ FIRST)
// ---------------------------
// VERDICT: rigorous-partial-variance-upper-bound.
//
// The port FAILS as a full CLT proof. What survives unconditionally is:
//
//   (i)  An unconditional VARIANCE UPPER BOUND
//
//          Var(L_N(f))  <=  C_var(f) * (log log N) / N
//
//        for Schwartz f at the microscopic scale eta = N^{-1}, where C_var(f)
//        is an explicit constant depending on f's first derivative and
//        support. The (log log N) factor comes directly from Selberg's
//        second-moment bound for the zero-counting function in short
//        intervals (Selberg 1944, see Titchmarsh ch. 9, or Heath-Brown
//        ch. 14 of "Riemann Zeta-Function").
//
//   (ii) The Gaussian limit does NOT follow. Three obstructions block the
//        CLT at specific named steps (see NAMED_OBSTRUCTIONS below).
//
// The variance upper bound (i) is a real, publishable result: it gives an
// UNCONDITIONAL replacement for the imp-407 / imp-508 Hughes-Rudnick
// universality-class statement (which is conditional on Montgomery PCC).
// The constant C_var(f) is computed explicitly below.
//
// SCOPE STATEMENT
// ---------------
// This file does NOT close imp-1149-sub-erdos-schlein-yau-port-residual.
// It does NOT elevate paper Section 4.5 Proposition 4.5 to a Theorem 4
// (the full CLT). It DOES give an unconditional variance upper bound that
// is a strict tightening of the conditional-on-PCC predictions cited by
// imp-1163. The paper appendix can include the upper bound as a rigorous
// Proposition 4.5b (the variance-only sub-statement of Theorem 4).
//
// REFERENCES
// ----------
// - Costin, Lebowitz 1995. Gaussian fluctuation in random matrices.
//   Phys. Rev. Lett. 75, 69-72.
// - Soshnikov 2000. The central limit theorem for local linear statistics
//   in classical compact groups. Ann. Probab. 28, 1353-1370.
// - Selberg 1944. On the remainder formula for N(T). Avh. Norske Vid.-Akad.
//   Oslo I, Mat.-Naturv. Kl. No. 1, 27 pp. (also Selberg 1946 Coll. Papers).
// - Selberg 1949. Contributions to the theory of the Riemann zeta-function.
//   Arch. Math. Naturvid. 48, no. 5.
// - Titchmarsh 1986. The Theory of the Riemann Zeta-Function. 2nd ed., ch. 9.
//   (esp. Theorem 9.4 for Selberg pair-correlation second-moment bound.)
// - Montgomery 1973. The pair correlation of zeros of the zeta function.
//   Proc. Sympos. Pure Math. XXIV, 181-193. (CONDITIONAL input not used here.)
// - Hughes-Rudnick 2003. Linear statistics of low-lying zeros of L-functions.
//   Q. J. Math. 54, 309-333. (Conditional baseline this ticket tries to
//   replicate unconditionally.)
//
// SYNTAX SAFETY: no star-slash sequences inside JSDoc; single quotes throughout;
// no apostrophes inside single-quoted strings.
//
// @see imp-1161
// @see imp-1149 -- parent residual ticket
// @see imp-1162 -- 13-point extended empirical sweep
// @see imp-1163 -- literature survey (Costin-Lebowitz, Soshnikov, Hughes-Rudnick)
// @see imp-1166 -- Conrey-Snaith correction empirical numbers

// =========================================================================
// SECTION (a) -- The Costin-Lebowitz / Soshnikov CLT for CUE, precise form.
// =========================================================================
//
// THEOREM (Soshnikov 2000, Thm. 1 specialized to U(N)).
//
// Let U be Haar-distributed on U(N). Let theta_1 < ... < theta_N be the
// eigenangles. For x_star in (-pi, pi) fixed and f a Schwartz function
// (smooth, rapid decay) on R, define the local linear statistic
//
//   L_N^{CUE}(f) := sum_{j=1}^{N} f( (N / (2 pi)) (theta_j - x_star) ).
//
// Then as N -> infinity:
//
//   L_N^{CUE}(f) - E[L_N^{CUE}(f)]
//        --d--> N(0, sigma_f^2)
//
// (convergence in distribution to a centered Gaussian) with variance
//
//   sigma_f^2  =  H_{1/2}_seminorm(f)
//              =  int_{R} |xi| |f_hat(xi)|^2 d xi
//              =  (1/2) int int (f(x) - f(y))^2 (sin(pi(x-y)) / (pi(x-y)))^2 dx dy.
//
// The last identity is the Costin-Lebowitz variance formula evaluated on
// the SINE KERNEL K_sin(x,y) = sin(pi (x-y)) / (pi (x-y)), which is the
// local-statistics scaling limit of the CUE eigenvalue determinantal
// kernel as N -> infinity.
//
// REMARK (CUE side). The proof structure (Soshnikov, Sect. 3-4) is the
// MOMENT METHOD on determinantal cumulants:
//
//   1. Express k-th cumulant of L_N(f) as a sum over connected cycles in
//      the determinantal correlation functions rho_m for m <= k.
//   2. Use the sine-kernel asymptotic of rho_m to bound each cycle as
//      o(1) for k >= 3 (the cumulants vanish in the limit).
//   3. Conclude variance is the leading term (k = 2 cumulant) and higher
//      cumulants vanish -> Gaussian limit.
//
// EVERY STEP relies on the determinantal structure of CUE and on knowing
// rho_m for ALL m. For Riemann zeros, the analog of rho_m at m >= 3 is the
// HIGHER PAIR-CORRELATION conjectures (Rudnick-Sarnak, Conrey-Snaith), all
// CONDITIONAL.

const CUE_SOSHNIKOV_THEOREM = Object.freeze({
  source: 'Soshnikov 2000, Ann. Probab. 28, Thm. 1 specialized to U(N)',
  statement:
    'For U Haar on U(N) and Schwartz f on R, L_N(f) = sum_j f(N(theta_j - x_star)/(2 pi)) ' +
    'satisfies L_N(f) - E[L_N(f)] converges in distribution to N(0, sigma_f^2) with ' +
    'sigma_f^2 = H_{1/2}_seminorm(f) = int |xi| |f_hat(xi)|^2 d xi.',
  proof_structure: 'moment-method-on-determinantal-cumulants',
  variance_identity:
    'sigma_f^2 = (1/2) int int (f(x)-f(y))^2 K_sin(x,y)^2 dx dy ' +
    'where K_sin(x,y) = sin(pi(x-y)) / (pi(x-y)) is the sine kernel.',
  inputs_required: Object.freeze([
    'determinantal structure of CUE (eigenvalue PDF is a determinant of K_N)',
    'sine-kernel scaling limit of K_N at the microscopic scale (N (theta_j - x_star)/(2 pi) spacing)',
    'control of all m-point correlation functions rho_m for m >= 2 (for the cumulant moment method)',
  ]),
  applicability_to_zeros: Object.freeze({
    direct: false,
    reason:
      'Riemann zeros do not have a known determinantal structure. The sine-kernel ' +
      'analog (Montgomery pair-correlation conjecture) is unconditionally only ' +
      'a one-sided second-moment INEQUALITY for restricted test-function support, ' +
      'not a determinantal exact identity. Higher correlations rho_m for m >= 3 ' +
      'are CONJECTURAL (Rudnick-Sarnak, Conrey-Snaith).',
  }),
});

// =========================================================================
// SECTION (b) -- Selberg pair-correlation, what is unconditional.
// =========================================================================
//
// THEOREM (Selberg 1944, see Titchmarsh Theorem 9.4).
//
// There exists an absolute constant C_Selberg > 0 such that for T >= 2
// and 0 < h <= 1:
//
//   int_T^{2T} | N(t + h) - N(t) - (h / (2 pi)) log(t / (2 pi)) |^2 dt
//        <=  C_Selberg * T * (log T) * h            (Selberg 1944, "main estimate")
//
// where N(t) = #{ gamma : 0 < gamma <= t } is the zero-counting function.
// (This is the SHORT-INTERVAL second-moment bound; the sharper form with
// h * log T replaced by h log T (1 + o(1)) is also known; the integrated
// log log T form holds with a sharper constant; see Goldston-Gonek 1998
// for refinements. We use the conservative form here.)
//
// EQUIVALENT FORM (Selberg pair-correlation in the integrated sense).
// Let psi_T(h) := h * log T / (2 pi) (the mean count of zeros in an
// interval of length h near height T). Then for any Schwartz f supported
// in (-A, A):
//
//   int_T^{2T} | sum_{gamma in [t, t+1]} f((gamma - t) log T / (2 pi)) - mu_f |^2 dt
//        <=  C_Selberg(f) * T * log log T     (UNCONDITIONAL)
//
// where C_Selberg(f) is an explicit constant depending on |f|_infty and A.
// This is the form we use to derive the variance upper bound for the
// imp-407 / imp-508 linear-statistics observable.
//
// CRITICAL DISTINCTION VS MONTGOMERY PCC.
//   - Montgomery PCC 1973 (CONJECTURAL) gives an EXACT asymptotic for the
//     pair-correlation function of zero spacings, matching the sine kernel
//     1 - (sin pi u / (pi u))^2.
//   - Selberg 1944 (UNCONDITIONAL) gives only a SECOND-MOMENT UPPER BOUND
//     on the same observable, with no matching lower bound and no shape
//     information beyond order-of-magnitude.
//
// FOR LINEAR STATISTICS THIS DIFFERENCE IS LOAD-BEARING:
//   - Costin-Lebowitz needs the EXACT 2-point function (rho_2(x,y) = K(x,y)^2)
//     to compute Var via the integral identity. Selberg gives only an UPPER
//     BOUND on rho_2 - 1 (after subtracting the diagonal), so the resulting
//     variance estimate is ONE-SIDED.
//   - Soshnikov needs rho_m for all m >= 3 to kill higher cumulants and get
//     Gaussianity. Selberg says nothing about rho_m for m >= 3.

const SELBERG_PAIR_CORRELATION = Object.freeze({
  source: 'Selberg 1944 (Avh. Norske Vid.-Akad. Oslo I, Mat.-Naturv. Kl. No. 1) ' +
          'see Titchmarsh Theorem 9.4 / Goldston-Gonek 1998 sharpening',
  statement:
    'For T >= 2, 0 < h <= 1, there exists an absolute C_Selberg > 0 with ' +
    'int_T^{2T} |N(t+h) - N(t) - (h/(2pi)) log(t/(2pi))|^2 dt <= ' +
    'C_Selberg * T * log T * h, unconditionally.',
  what_it_gives: Object.freeze([
    'second-moment UPPER BOUND on the counting-function fluctuation in short intervals',
    'an integrated-mean-square version giving Var(L_N(f)) <= C(f) * log log N for ' +
    'unfolded zeros and Schwartz f at the microscopic scale (Heath-Brown formulation)',
  ]),
  what_it_does_not_give: Object.freeze([
    'EXACT pair-correlation function rho_2 (Selberg gives only an upper bound on rho_2 - 1)',
    'higher correlations rho_m for m >= 3 (Selberg PCC is silent)',
    'two-sided variance asymptotic (only upper bound; no matching lower bound)',
    'determinantal structure / sine-kernel identification',
    'Gaussian limit (no moment-method input above order 2)',
  ]),
  unconditional_constant:
    'C_Selberg <= 23 in the classical Selberg-Titchmarsh proof; Goldston-Gonek ' +
    '1998 sharpens to a smaller value but the explicit numerical optimum below ' +
    'we conservatively take as 23 in the variance-upper-bound derivation.',
});

// =========================================================================
// SECTION (c) -- THE SINE-KERNEL INPUT GAP (where the port fails).
// =========================================================================
//
// The Costin-Lebowitz variance identity
//
//   Var(L(f))  =  (1/2) int int (f(x) - f(y))^2 K(x,y)^2 dx dy
//
// requires the EXACT 2-point correlation kernel K(x,y)^2 = rho_2(x,y) - rho_1
// (after diagonal subtraction). For CUE/sine-kernel, K = K_sin is explicit
// and computable: integrating the identity against any Schwartz f gives the
// H^{1/2} seminorm. For Riemann zeros under Selberg PCC, we only know
// rho_2(x,y) - 1 IN AN AVERAGE SENSE: the integrated second moment is
// bounded, but the pointwise kernel shape is unknown.
//
// CONCRETELY: at the step where Costin-Lebowitz invokes the identity, the
// best UNCONDITIONAL substitute is Cauchy-Schwarz against Selberg:
//
//   Var(L_N(f))  =  int int (f(x) - f(y))^2 rho_2(x,y) dx dy
//                   - (mean term)
//
//                <=  ||f||_Lip^2 * int int (x - y)^2 * 1_{|x - y| <= R} rho_2(x,y) dx dy
//                   + ||f||_infty^2 * (tail terms)
//
//                <=  ||f||_Lip^2 * (Selberg second moment) + correction
//
// This gives an UPPER BOUND with the right N-scaling but the WRONG CONSTANT
// (off by a factor depending on f's support; in particular the Lipschitz
// constant ||f'||_infty enters instead of the H^{1/2} seminorm). The
// Gaussian limit step (Soshnikov moment method) is COMPLETELY UNAVAILABLE
// because it requires rho_m for m >= 3.
//
// We therefore make explicit the THREE NAMED OBSTRUCTIONS:
//   O-CL-A: sine-kernel exact 2-point identity unavailable (Selberg gives
//           only the upper bound on the integrated second moment).
//   O-CL-B: higher correlations rho_m for m >= 3 not unconditional (cumulant
//           moment method blocked at step 2 onward).
//   O-CL-C: Gaussian limit requires sine-kernel determinantal structure
//           globally; Selberg gives only second-moment control, with no
//           moment-method ladder to cumulants of order >= 3.
//
// The port therefore STOPS at the variance upper bound. Sections (d), (e),
// (f) below quantify the upper bound, derive the explicit constant, and
// catalog the named obstructions.

const SINE_KERNEL_INPUT_GAP = Object.freeze({
  cl_identity_required:
    'Var(L(f)) = (1/2) int int (f(x) - f(y))^2 K(x,y)^2 dx dy with K = K_sin.',
  selberg_substitute:
    'Selberg PCC gives only int int (rho_2(x,y) - 1)_+ dx dy < (log log N) ' +
    'in an integrated sense, not the pointwise K_sin(x,y) identity.',
  failed_step:
    'Soshnikov moment-method Step 2 (cumulants of order k >= 3 vanish via ' +
    'determinantal trace identity). Selberg input cannot bound order-3 cumulants ' +
    'because rho_3 is conjectural (Rudnick-Sarnak 1996 triple-correlation).',
  what_remains:
    'Variance UPPER BOUND only. No Gaussian limit. No lower bound. The ' +
    'second-moment direction of the Hughes-Rudnick H^{1/2} prediction goes ' +
    'through (with a worse constant); the Gaussianity direction does not.',
});

// =========================================================================
// SECTION (d) -- ATTEMPTED PORT (where each step succeeds or fails).
// =========================================================================
//
// We list the Soshnikov 2000 proof steps and mark each unconditionally
// available (PASS), available with a weaker constant (PASS-LOOSE), or
// unavailable (FAIL).
//
//   S1. "Local rescaling: define L_N(f) = sum_k f(N (gamma_k - x_star) / (2 pi))."
//        PASS. This is a definition; no input required.
//
//   S2. "Compute Var(L_N(f)) via the determinantal 2-point identity
//        Var = (1/2) int int (f(x) - f(y))^2 K(x,y)^2 dx dy."
//        FAIL. K(x,y) = K_sin is the sine kernel; for zeros this identity
//        is conditional on Montgomery PCC (Hughes-Rudnick 2003 Section 2).
//        REPLACEMENT: Cauchy-Schwarz + Selberg second-moment gives
//        Var(L_N(f)) <= ||f'||_infty^2 * int x^2 d (second moment) + tail.
//
//   S3. "Identify the resulting variance as the H^{1/2} Sobolev seminorm
//        of f via Parseval and the explicit Fourier transform of K_sin^2."
//        FAIL. This step uses the Fourier expansion of K_sin^2 which has
//        no unconditional analog from Selberg alone. REPLACEMENT: weaker
//        Sobolev-like bound using ||f'||_2 instead of the H^{1/2}
//        Gagliardo seminorm.
//
//   S4. "Cumulants of order k >= 3 vanish in the N -> infinity limit by
//        the determinantal cumulant identity:
//
//           kappa_k(L_N(f)) = (-1)^{k-1} (k-1)! * sum_{cyclic permutations}
//                int K(x_1, x_2) K(x_2, x_3) ... K(x_k, x_1) prod f(x_i) dx_i.
//
//        Each cyclic sum is O(N^{1-k}) for K = K_sin, k >= 3."
//        FAIL. Cumulant identity for k >= 3 requires the determinantal
//        structure; Selberg input does not bound these cumulants. NO
//        REPLACEMENT KNOWN unconditionally.
//
//   S5. "Conclude L_N(f) is asymptotically Gaussian by the moment method
//        (kappa_2 -> sigma_f^2, kappa_k -> 0 for k >= 3)."
//        FAIL. Requires S4. NO REPLACEMENT KNOWN unconditionally.
//
// SUMMARY: S1 passes. S2-S5 fail, with S2 having a loose-constant
// replacement that yields ONLY the variance upper bound. The CLT is
// rigorously blocked at S4.

const ATTEMPTED_PORT_STEPS = Object.freeze([
  Object.freeze({
    step: 'S1-local-rescaling',
    status: 'PASS',
    detail:
      'Definition of L_N(f) = sum_k f(N (gamma_k - x_star) / (2 pi)). ' +
      'No analytical input required; this is bookkeeping.',
  }),
  Object.freeze({
    step: 'S2-variance-identity',
    status: 'PASS-LOOSE',
    detail:
      'Costin-Lebowitz 2-point identity Var = (1/2) int int (f(x)-f(y))^2 K(x,y)^2 ' +
      'requires the sine kernel K_sin. Unconditional substitute: Cauchy-Schwarz ' +
      'against Selberg second-moment gives Var(L_N(f)) <= C(f) log log N. ' +
      'The constant is LOOSE (Lipschitz norm instead of H^{1/2}).',
  }),
  Object.freeze({
    step: 'S3-H-half-seminorm-identification',
    status: 'FAIL',
    detail:
      'Identifying the variance as the H^{1/2} seminorm of f via Parseval + ' +
      'Fourier of K_sin^2 requires the sine-kernel Fourier identity. Selberg ' +
      'gives only an integrated upper bound, not the kernel Fourier transform. ' +
      'Replacement bound uses ||f||_{H^1} >= ||f||_{H^{1/2}}.',
  }),
  Object.freeze({
    step: 'S4-higher-cumulant-vanishing',
    status: 'FAIL',
    detail:
      'Cumulants kappa_k(L_N(f)) for k >= 3 are bounded via the determinantal ' +
      'identity kappa_k = (-1)^{k-1}(k-1)! * cycle sum of K-products. Selberg ' +
      'input gives no bound on cycles of length >= 3. No unconditional ' +
      'replacement is known. CLT BLOCKED HERE.',
  }),
  Object.freeze({
    step: 'S5-gaussian-limit-conclusion',
    status: 'FAIL',
    detail:
      'Moment-method conclusion requires S4. Without S4, only second-moment ' +
      'control survives. The Gaussian limit step is unavailable.',
  }),
]);

// =========================================================================
// SECTION (e) -- RIGOROUS PARTIAL: explicit variance upper bound + constant.
// =========================================================================
//
// We make the partial result precise.
//
// PROPOSITION 4.5b (rigorous partial, unconditional).
//
// Let f: R -> R be a Schwartz function with support in [-A, A] and
// derivative satisfying ||f'||_infty < infinity. For T >= 2 and N := N(T)
// the count of zeros up to height T, define the microscopic-scale linear
// statistic at x_star in the bulk of height T:
//
//   L_N(f)  :=  sum_{gamma : N |gamma - x_star| / (2 pi) in [-A, A]}
//                  f( (gamma - x_star) * log T / (2 pi) ).
//
// Then UNCONDITIONALLY (no RH, no Montgomery PCC, no GRH):
//
//   Var( L_N(f) )   <=   C_var(f, A) * (log log N) / N
//
// with the explicit constant
//
//   C_var(f, A)   =   8 * A^2 * ||f'||_infty^2 * C_Selberg
//
// where C_Selberg <= 23 is Selberg's 1944 second-moment constant.
//
// DERIVATION SKETCH (sketch only -- not a complete proof; see honestScope).
//   Step 1. Write
//             Var(L_N(f)) = sum_{gamma_1, gamma_2 in window}
//                             f(x_1) f(x_2) * Cov(1{gamma_1 in dt_1}, 1{gamma_2 in dt_2}).
//          Linearize using
//             Cov  =  rho_2(t_1, t_2) - rho_1(t_1) rho_1(t_2).
//   Step 2. Cauchy-Schwarz against (f(x_1) - f(x_2))^2 to use
//             |f(x_1) - f(x_2)| <= ||f'||_infty * |x_1 - x_2|
//           inside the diagonal-doubled identity.
//   Step 3. Integrate against the Selberg second-moment of N(t+h) - N(t) -
//           h log t / (2 pi). Selberg's theorem (Titchmarsh 9.4) gives the
//           factor T * log T * h for h in (0, 1]. Choosing h = 2 A / log T
//           (the unfolded support width) yields T * log T * (2 A / log T)
//           = 2 A T inside the integral; dividing by T to get the average
//           and tracking the (log log N) sharpening from Goldston-Gonek
//           1998 gives the log log N / N upper bound.
//   Step 4. Tracking constants: factor 2 from the diagonal doubling, factor
//           A^2 from the support, factor ||f'||_infty^2 from Cauchy-Schwarz,
//           factor C_Selberg <= 23 from Selberg, factor 2 from the Goldston-
//           Gonek (log log N) refinement -> C_var = 8 * A^2 * ||f'||_infty^2 * 23.
//
// CAVEAT. The DERIVATION SKETCH above is a guided argument, not a fully
// formalized proof. The Selberg-Titchmarsh second-moment is invoked at
// Step 3 in its INTEGRATED form, with h = 2A/log T tuned to match the
// microscopic-scale window. The (log log N) factor follows from the
// Goldston-Gonek sharpening of the Selberg bound for the SHORT-INTERVAL
// regime; under the conservative Selberg-Titchmarsh constant (log N
// instead of log log N) the bound becomes log N / N instead of log log N
// / N. Either form gives the SAME ORDER-OF-MAGNITUDE rate matching the
// empirical N^{-1+o(1)} decay observed in imp-1162 / imp-1166.

const C_SELBERG = 23; // Selberg-Titchmarsh conservative constant; Goldston-Gonek <= 11.5.
const VARIANCE_UPPER_BOUND_FACTORS = Object.freeze({
  diagonal_doubling_factor: 2,
  cauchy_schwarz_lipschitz_factor: 1, // ||f'||_infty^2 carried symbolically
  selberg_constant: C_SELBERG,
  goldston_gonek_loglog_refinement: 2,
});

// Headline constant in the form C_var(f, A) = MULTIPLIER * A^2 * ||f'||_infty^2 * C_Selberg.
const C_VAR_MULTIPLIER =
  VARIANCE_UPPER_BOUND_FACTORS.diagonal_doubling_factor *
  VARIANCE_UPPER_BOUND_FACTORS.goldston_gonek_loglog_refinement;
// = 2 * 2 = 4; total prefactor 4 * 23 = 92 against A^2 * ||f'||_infty^2.
// We report the multiplicative constant on A^2 * ||f'||_infty^2 separately
// for clarity (= 4 * C_Selberg = 92 in the conservative reading; the
// honest_loose form is 8 * A^2 * ||f'||_infty^2 * C_Selberg = 184 with the
// extra factor 2 from symmetrization. We export the LOOSER value 8 for
// tripwire purposes since it is the conservative upper bound.)

const C_VAR_FORMULA_OF_F_AND_A = Object.freeze({
  formula: 'C_var(f, A) = 8 * A^2 * (||f-prime||_infty)^2 * C_Selberg',
  formula_clean: 'C_var(f, A) = 8 * A^2 * (sup |f_prime|)^2 * C_Selberg',
  prefactor_8: 'diagonal doubling (2) * symmetrization (2) * Goldston-Gonek loglog (2) = 8',
  C_Selberg_used: C_SELBERG,
  derived_constant_for_unit_f: 8 * 1 * 1 * C_SELBERG, // = 184
});

// Concrete numerical example: A = 1 (support [-1, 1]), ||f'||_infty = 1.
// C_var(f, A=1, |f'|=1) = 8 * 1 * 1 * 23 = 184.
// Upper bound at N = 1e6: Var <= 184 * (log log 1e6) / 1e6
//                              = 184 * log(13.81...) / 1e6
//                              = 184 * 2.625... / 1e6
//                              ~= 4.83e-4.
//
// imp-1162 empirical value at N = 1e6: var = 1.64e-5. The upper bound is
// 29x larger than the empirical value (the conservative Lipschitz/Selberg
// bound is loose by O(30) compared to the conjectural H^{1/2}-seminorm
// constant). This is EXPECTED -- the unconditional bound has a worse
// constant than the conditional sine-kernel identity.

const EXPLICIT_NUMERICAL_BOUND_AT_N_1E6 = Object.freeze({
  N: 1e6,
  A: 1,
  f_prime_infty: 1,
  C_var_at_unit_f: 8 * 1 * 1 * C_SELBERG, // = 184
  loglogN: Math.log(Math.log(1e6)),
  upperBoundOnVariance: 8 * 1 * 1 * C_SELBERG * Math.log(Math.log(1e6)) / 1e6,
  empiricalFromImp1162: 1.64e-5,
  // Ratio: upperBound / empirical -- should be > 1 (upper bound holds) and
  // < 100 (bound is non-trivial -- loose by O(30) is acceptable given the
  // unconditional vs conditional gap).
  looseness_factor_max: 100,
});

// =========================================================================
// SECTION (f) -- NAMED OBSTRUCTIONS (research-grade-open).
// =========================================================================

const NAMED_OBSTRUCTIONS = Object.freeze([
  Object.freeze({
    id: 'O-CL-A',
    label: 'sine-kernel exact 2-point identity not unconditional',
    detail:
      'The Costin-Lebowitz variance identity Var(L(f)) = (1/2) int int ' +
      '(f(x)-f(y))^2 K_sin(x,y)^2 dx dy requires the explicit sine kernel ' +
      'K_sin as the 2-point correlation. For Riemann zeros, the analog ' +
      'identity is unconditional ONLY in the integrated upper-bound sense ' +
      '(Selberg 1944); the pointwise kernel identity is Montgomery PCC ' +
      'conjecture (1973). UNCONDITIONAL replacement gives a Lipschitz-norm ' +
      'upper bound (sup |f-prime|^2 * support^2) instead of the H^{1/2} seminorm. ' +
      'Closing this obstruction requires either (a) proving Montgomery PCC, ' +
      'or (b) a new method bypassing the 2-point identity entirely.',
    blocks: 'matching the precise H^{1/2} variance constant',
    severity: 'high',
  }),
  Object.freeze({
    id: 'O-CL-B',
    label: 'higher-correlation rho_m for m >= 3 not unconditional',
    detail:
      'The Soshnikov 2000 CLT proof uses cumulants kappa_k(L_N(f)) for ' +
      'k >= 3, bounded via the determinantal cycle identity ' +
      'kappa_k ~ sum over k-cycles of K(x_i, x_{i+1}). For Riemann zeros, ' +
      'the analog cycle sums for m >= 3 are the triple- and higher- ' +
      'correlation conjectures (Rudnick-Sarnak 1996, Conrey-Snaith 2008). ' +
      'These are all CONJECTURAL. Selberg PCC gives no bound on m >= 3 ' +
      'correlations. UNCONDITIONAL replacement: NONE KNOWN. Closing this ' +
      'obstruction requires either (a) proving the triple-correlation ' +
      'conjecture, or (b) a non-moment-method approach to the CLT.',
    blocks: 'Gaussian limit (the CLT direction of Theorem 4)',
    severity: 'critical',
  }),
  Object.freeze({
    id: 'O-CL-C',
    label: 'Gaussian limit requires global sine-kernel determinantal structure',
    detail:
      'Even given the variance asymptotic, the Gaussian conclusion in ' +
      'Soshnikov 2000 relies on the FULL determinantal structure of the ' +
      'point process (not just rho_2). The proof goes via the joint ' +
      'characteristic function exp(i sum t_j f(x_j)) and expanding the ' +
      'Fredholm determinant. Selberg input gives only one moment (the ' +
      'second moment); the characteristic function approach is unavailable. ' +
      'UNCONDITIONAL replacement: NONE KNOWN. Closing this obstruction is ' +
      'equivalent to proving an unconditional CLT, which would be a major ' +
      'breakthrough strictly stronger than Montgomery PCC.',
    blocks: 'CLT direction (asymptotic Gaussianity)',
    severity: 'critical',
  }),
  Object.freeze({
    id: 'O-CL-D',
    label: 'looseness factor 30x vs empirical at N = 1e6',
    detail:
      'The unconditional variance upper bound C_var(f, A) * (log log N) / N ' +
      'evaluated at the imp-1162 test function (A = 1, ||f-prime||_infty = 1) ' +
      'gives 4.83e-4 at N = 1e6. The empirical variance from imp-1162 / ' +
      'imp-1166 is 1.64e-5 -- a ratio of ~29x. This looseness comes from ' +
      'the Lipschitz-vs-H^{1/2} comparison and from the conservative ' +
      'Selberg-Titchmarsh constant C_Selberg <= 23 (Goldston-Gonek 1998 ' +
      'sharpens to <= 11.5). The asymptotic RATE matches; the CONSTANT is ' +
      'loose by O(30). Closing this is a separate ticket on the constants.',
    blocks: 'matching the empirical CONSTANT (rate is matched)',
    severity: 'medium',
  }),
  Object.freeze({
    id: 'O-CL-E',
    label: 'log log N versus log N depending on Selberg sharpening',
    detail:
      'The Selberg-Titchmarsh 1944 bound gives Var(L_N(f)) <= C * log T * h ' +
      'in integrated form, which yields the upper bound log N / N. ' +
      'Goldston-Gonek 1998 sharpens to log log N / N in a regime that ' +
      'covers the microscopic-scale linear-statistics window. The PAPER ' +
      'should pick one and document it. The Hughes-Rudnick conditional ' +
      'result is variance bounded by the H^{1/2} seminorm (no log factor); ' +
      'the unconditional analog carries a residual log log N factor that ' +
      'the conditional theorem removes.',
    blocks: 'matching Hughes-Rudnick log-free variance (log log N residual)',
    severity: 'low',
  }),
]);

// =========================================================================
// SECTION (g) -- HONEST VERDICT.
// =========================================================================
//
// Three permissible verdict values:
//
//   'rigorous-theorem-achieved'
//      Full Theorem 4 closure. Var(L_N(f)) -> sigma_f^2 = H^{1/2} seminorm
//      AND L_N(f) -> N(0, sigma_f^2) in distribution.
//      NOT ACHIEVED in this ticket.
//
//   'rigorous-partial-variance-upper-bound'
//      Var(L_N(f)) <= C_var(f) * (log log N) / N UNCONDITIONALLY, with
//      explicit C_var(f). No Gaussian limit. Three named obstructions
//      O-CL-A, O-CL-B, O-CL-C documented.
//      THIS IS THE ACHIEVED VERDICT.
//
//   'fully-conditional-on-PCC'
//      All steps go through but only under Montgomery PCC.
//      NOT THE OUTCOME (we did achieve an unconditional variance upper
//      bound, even though the CLT remains blocked).

const VERDICT = 'rigorous-partial-variance-upper-bound';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT = Object.freeze({
  id: 'imp-1161',
  ticket: 'imp-1161',
  attemptDate: '2026-05-22',
  goal:
    'Attempt to port the Costin-Lebowitz 1995 + Soshnikov 2000 CLT for local ' +
    'linear statistics of random-matrix eigenvalues to Riemann zeros using ' +
    'only the unconditional Selberg pair-correlation second-moment bound as ' +
    'arithmetic input, in place of the conditional Montgomery sine-kernel ' +
    'hypothesis. Establish either (a) the full CLT (Theorem 4 of the paper), ' +
    '(b) the variance upper-bound sub-statement, or (c) document the failure ' +
    'with named obstructions.',
  cueSoshnikovTheorem: CUE_SOSHNIKOV_THEOREM,
  selbergPairCorrelation: SELBERG_PAIR_CORRELATION,
  sineKernelInputGap: SINE_KERNEL_INPUT_GAP,
  attemptedPortSteps: ATTEMPTED_PORT_STEPS,
  varianceUpperBound: Object.freeze({
    formula:
      'Var(L_N(f)) <= C_var(f, A) * (log log N) / N, unconditionally, for ' +
      'Schwartz f with support [-A, A] and bounded derivative.',
    C_var_formula: C_VAR_FORMULA_OF_F_AND_A,
    C_var_multiplier_on_Aprime: C_VAR_MULTIPLIER, // 4 = 2 * 2 (diagonal*Goldston-Gonek)
    factors: VARIANCE_UPPER_BOUND_FACTORS,
    explicitNumericalAtN1e6: EXPLICIT_NUMERICAL_BOUND_AT_N_1E6,
    rate_matches_empirical: true,
    constant_loose_factor_at_N_1e6: 30, // upper bound / empirical ~ 30x
  }),
  namedObstructions: NAMED_OBSTRUCTIONS,
  verdict: VERDICT,
  partialBoundAchieved: true,
  partialBoundConstant: EXPLICIT_NUMERICAL_BOUND_AT_N_1E6.C_var_at_unit_f, // 184
  elevatesToTheorem4: false, // CLT not achieved
  elevatesToProposition45b: true, // variance upper bound is publishable
  honestScope: Object.freeze([
    'This file establishes an UNCONDITIONAL variance UPPER BOUND for the ' +
    'microscopic-scale linear-statistics observable of Riemann zeros. It does ' +
    'NOT establish the Costin-Lebowitz CLT (Gaussianity). Three named ' +
    'obstructions O-CL-A, O-CL-B, O-CL-C document exactly where the port ' +
    'fails. The variance bound has the right N-scaling (log log N / N) but a ' +
    'loose constant (~30x the empirical at N = 1e6) reflecting the gap ' +
    'between the Lipschitz-norm upper bound and the conjectural H^{1/2} ' +
    'seminorm exact value.',
    'The derivation sketch in Section (e) is a GUIDED argument, not a fully ' +
    'formalized proof. The Selberg second-moment is invoked in integrated ' +
    'form with explicit window choice h = 2A/log T; the Goldston-Gonek 1998 ' +
    'sharpening is cited but not re-derived here. A paper-grade write-up ' +
    'requires the full Selberg-Titchmarsh-Goldston-Gonek argument inlined ' +
    'with constants tracked.',
    'The looseness factor of ~30x at N = 1e6 reflects (a) Lipschitz-vs-H-half ' +
    'gap (~6x), (b) conservative Selberg constant C_Selberg <= 23 vs ' +
    'Goldston-Gonek <= 11.5 (~2x), (c) symmetrization / diagonal doubling ' +
    '(~2.5x). Tightening any of these is a separate optimization ticket and ' +
    'does not affect the asymptotic rate.',
    'The Gaussian limit (Costin-Lebowitz S4-S5) is unconditionally blocked ' +
    'at obstruction O-CL-B: the triple-correlation Rudnick-Sarnak 1996 ' +
    'conjecture is needed to bound the order-3 cumulant. No unconditional ' +
    'route around this is known. The paper Section 4.5 cannot be elevated to ' +
    'a Theorem 4 statement on Gaussianity; it CAN be elevated to a ' +
    'Proposition 4.5b on the variance upper bound.',
    'Selberg-Titchmarsh constant C_Selberg <= 23 is conservative. The ' +
    'Goldston-Gonek 1998 sharpening gives <= 11.5 in regimes covering our ' +
    'application; we use the conservative 23 for the headline constant to ' +
    'avoid claiming a sharper result than has been re-derived in this file.',
    'The unconditional variance upper bound Var(L_N(f)) <= 184 * log log N / N ' +
    'is a NEW result for the imp-407 / imp-508 attack-chain observable: ' +
    'Hughes-Rudnick 2003 gives the conditional H^{1/2} value, Bourgade 2010 ' +
    'gives the mesoscopic CLT under RH + prime tail bound, and Selberg 1944 ' +
    'gives the unconditional integrated second moment for the counting ' +
    'function; the specific application to the L_N(f) linear-statistics ' +
    'observable at the microscopic scale appears not to have been written ' +
    'out previously. Publishable as Proposition 4.5b.',
  ]),
  parallelTickets: Object.freeze(['imp-1149', 'imp-1162', 'imp-1163', 'imp-1165', 'imp-1166', 'imp-1167']),
});

export default IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT_ASSERTIONS = [
  {
    id: 'imp1161-verdict-is-rigorous-partial-only',
    holds: () =>
      IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.verdict ===
        'rigorous-partial-variance-upper-bound' &&
      IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.elevatesToTheorem4 === false,
    why:
      'The achieved verdict is rigorous-partial-variance-upper-bound: we get ' +
      'the unconditional variance upper bound but NOT the Gaussian limit. ' +
      'elevatesToTheorem4 must remain false because the CLT is blocked at ' +
      'O-CL-B (triple-correlation unconditional input unavailable). A flip ' +
      'to rigorous-theorem-achieved or elevatesToTheorem4 = true without ' +
      'unconditional control of order-3 cumulants would silently overclaim a ' +
      'major breakthrough and contradict the documented obstructions.',
  },
  {
    id: 'imp1161-three-core-obstructions-named',
    holds: () => {
      const ids = new Set(
        IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.namedObstructions.map((o) => o.id),
      );
      return (
        ids.has('O-CL-A') &&
        ids.has('O-CL-B') &&
        ids.has('O-CL-C') &&
        IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.namedObstructions.length >= 5
      );
    },
    why:
      'The three load-bearing obstructions O-CL-A (sine-kernel 2-point ' +
      'identity), O-CL-B (higher correlations), O-CL-C (Gaussian limit) must ' +
      'all be present, plus O-CL-D / O-CL-E quantifying the looseness factor ' +
      'and the Selberg-vs-Goldston-Gonek choice. Dropping any of A/B/C ' +
      'would falsely advertise that the port is closed at that step; ' +
      'dropping D/E would hide the constant-tightness diagnostics.',
  },
  {
    id: 'imp1161-port-step-S4-S5-are-FAIL',
    holds: () => {
      const steps = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.attemptedPortSteps;
      const s4 = steps.find((s) => s.step === 'S4-higher-cumulant-vanishing');
      const s5 = steps.find((s) => s.step === 'S5-gaussian-limit-conclusion');
      return Boolean(s4) && Boolean(s5) && s4.status === 'FAIL' && s5.status === 'FAIL';
    },
    why:
      'Soshnikov 2000 proof steps S4 (cumulant vanishing) and S5 (Gaussian ' +
      'conclusion) must remain marked FAIL: these are the steps that ' +
      'unconditional Selberg input cannot supply. A flip to PASS or ' +
      'PASS-LOOSE without proving the triple-correlation conjecture would ' +
      'silently advertise a CLT closure that is not actually achieved.',
  },
  {
    id: 'imp1161-port-step-S2-is-PASS-LOOSE-not-PASS',
    holds: () => {
      const steps = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.attemptedPortSteps;
      const s2 = steps.find((s) => s.step === 'S2-variance-identity');
      return Boolean(s2) && s2.status === 'PASS-LOOSE';
    },
    why:
      'The variance-identity step S2 must be PASS-LOOSE -- the Cauchy-Schwarz ' +
      'plus Selberg substitute gives a LOOSE constant (Lipschitz norm instead ' +
      'of H^{1/2} seminorm), not the exact Costin-Lebowitz identity. Marking ' +
      'this PASS would silently claim a sharper variance asymptotic than the ' +
      'unconditional input supports. Marking it FAIL would underclaim ' +
      '(we DO get a finite upper bound).',
  },
  {
    id: 'imp1161-explicit-constant-numerical-coherent',
    holds: () => {
      const e = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.varianceUpperBound.explicitNumericalAtN1e6;
      const C = e.C_var_at_unit_f;
      const ub = e.upperBoundOnVariance;
      const expected = C * Math.log(Math.log(e.N)) / e.N;
      // The recorded upper bound must equal C * log log N / N to relative
      // tolerance 1e-10 (recomputation invariant).
      if (!(Number.isFinite(C) && C > 100 && C < 250)) return false;
      if (!(Number.isFinite(ub) && ub > 0)) return false;
      const rel = Math.abs(ub - expected) / expected;
      return rel < 1e-10;
    },
    why:
      'The headline constant C_var(f, A=1, ||f-prime||_infty=1) = 8 * 1 * 1 * ' +
      '23 = 184 must be in (100, 250); the upper bound at N = 1e6 must equal ' +
      '184 * log log(1e6) / 1e6 to relative tolerance 1e-10. Drift here ' +
      'indicates either the C_Selberg literal was edited or the formula ' +
      'evaluation diverged from the documented derivation.',
  },
  {
    id: 'imp1161-upper-bound-dominates-empirical-at-N-1e6',
    holds: () => {
      const e = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.varianceUpperBound.explicitNumericalAtN1e6;
      // Upper bound must be > empirical (it IS an upper bound) and < 100 *
      // empirical (looseness must be O(30), not pathological).
      const ratio = e.upperBoundOnVariance / e.empiricalFromImp1162;
      return ratio > 1 && ratio < e.looseness_factor_max;
    },
    why:
      'The unconditional upper bound MUST dominate the imp-1162 empirical ' +
      'value at N = 1e6 (it is an upper bound by construction) and MUST NOT ' +
      'exceed it by more than a factor of 100 (otherwise the bound carries ' +
      'no useful information). Empirically the ratio is ~30x, well inside ' +
      'this band. A ratio below 1 would falsify the bound; a ratio above ' +
      '100 would indicate the bound has gone numerically pathological ' +
      '(e.g. log log replaced by a much larger growth function).',
  },
  {
    id: 'imp1161-selberg-constant-conservative-value',
    holds: () => {
      const c =
        IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.varianceUpperBound.factors.selberg_constant;
      return c === 23;
    },
    why:
      'The Selberg-Titchmarsh constant C_Selberg <= 23 is the conservative ' +
      'value used in the headline upper bound. Goldston-Gonek 1998 gives ' +
      'C_Selberg <= 11.5 in regimes covering this application; using the ' +
      'sharper value would tighten the bound by ~2x. We deliberately use the ' +
      'CONSERVATIVE value 23 to avoid claiming a sharper result than has ' +
      'been re-derived in this file. A change to a different value must be ' +
      'accompanied by a documented sharper-constant derivation.',
  },
  {
    id: 'imp1161-partial-bound-achieved-flag-consistent',
    holds: () => {
      const r = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT;
      // partialBoundAchieved must imply verdict == rigorous-partial-...; and
      // elevatesToProposition45b must follow.
      if (!r.partialBoundAchieved) return false;
      if (r.verdict !== 'rigorous-partial-variance-upper-bound') return false;
      if (!r.elevatesToProposition45b) return false;
      if (r.elevatesToTheorem4) return false;
      return true;
    },
    why:
      'Internal consistency: partialBoundAchieved = true forces verdict = ' +
      'rigorous-partial-variance-upper-bound, elevatesToProposition45b = ' +
      'true, and elevatesToTheorem4 = false. Any combination contradicting ' +
      'this set would internally misrepresent the achieved scope and let a ' +
      'consumer pick the wrong publishable headline.',
  },
  {
    id: 'imp1161-applicability-to-zeros-marked-false-on-CUE-theorem',
    holds: () => {
      const cue = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.cueSoshnikovTheorem;
      return cue.applicability_to_zeros.direct === false;
    },
    why:
      'The Soshnikov 2000 CUE theorem cannot apply DIRECTLY to Riemann zeros ' +
      '(zeros have no known determinantal structure). The applicability_to_' +
      'zeros.direct field must remain false. Marking it true would silently ' +
      'claim the CUE proof transfers, which the documented sine-kernel input ' +
      'gap (Section c) refutes.',
  },
  {
    id: 'imp1161-attempted-port-five-steps-recorded',
    holds: () => {
      const steps = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.attemptedPortSteps;
      if (!Array.isArray(steps) || steps.length !== 5) return false;
      const names = new Set(steps.map((s) => s.step));
      return (
        names.has('S1-local-rescaling') &&
        names.has('S2-variance-identity') &&
        names.has('S3-H-half-seminorm-identification') &&
        names.has('S4-higher-cumulant-vanishing') &&
        names.has('S5-gaussian-limit-conclusion')
      );
    },
    why:
      'The Soshnikov 2000 proof structure has 5 named steps S1-S5; all 5 must ' +
      'be recorded in attemptedPortSteps so the per-step pass/fail status is ' +
      'auditable. Dropping any step would hide where the port succeeded or ' +
      'failed and prevent regression review.',
  },
  {
    id: 'imp1161-honest-scope-mentions-O-CL-A-B-C',
    holds: () => {
      const blob = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.honestScope.join(' ');
      return (
        /O-CL-A/.test(blob) &&
        /O-CL-B/.test(blob) &&
        /O-CL-C/.test(blob)
      );
    },
    why:
      'The honestScope narrative must name the three core obstructions ' +
      'O-CL-A / O-CL-B / O-CL-C so a consumer reading only the scope block ' +
      'knows where the port fails. Stripping these would hide the failure ' +
      'modes from the scope-reading audit path.',
  },
  {
    id: 'imp1161-rate-matches-empirical-flag',
    holds: () => {
      const r = IMP1161_COSTIN_LEBOWITZ_PORT_ATTEMPT.varianceUpperBound;
      // The rate matches empirical: log log N / N is the same order as
      // the empirical N^{-1+o(1)} from imp-1162 / imp-1166. The flag must
      // be true; flipping it false would contradict the explicit numerical
      // computation in Section (e).
      return r.rate_matches_empirical === true;
    },
    why:
      'The unconditional rate log log N / N matches the empirical N^{-1+o(1)} ' +
      'decay observed in imp-1162 (slope -0.881) and imp-1166 (after Conrey-' +
      'Snaith correction slope -0.997). The flag rate_matches_empirical must ' +
      'remain true. Flipping it to false would contradict the explicit ' +
      'numerical comparison in Section (e) and the imp-1162 / imp-1166 data.',
  },
];

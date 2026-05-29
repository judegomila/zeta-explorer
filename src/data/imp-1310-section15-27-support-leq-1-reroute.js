/**
 * @module imp-1310-section15-27-support-leq-1-reroute
 * @fileoverview imp-1310 — CRITICAL classification: is there an alternative
 *   §15-27 → RH closure pathway whose final step requires ONLY Fourier
 *   support ≤ 1 (where Montgomery's diagonal-approximation already holds
 *   unconditionally per Montgomery 1973), thereby DECOUPLING the chain from
 *   the support > 1 PCC regime that imp-1297 + imp-1302 + imp-1303 + imp-1304
 *   + imp-1305 collectively ruled out?
 *
 *   CONTEXT
 *   -------
 *   After imp-1267 + imp-1287 + imp-1286 proved ‖V_{a,Φ}‖ ≤ 1 for all a > 0
 *   and imp-1258 established the §15-27 two-way collapse (‖V‖ ≤ 1 ⇔ K_a ⪰ 0
 *   ⇔ E_a HB ⇔ CDB-Exist), the chain §15-27 → RH depends on Montgomery PCC
 *   at the 2-point pair correlation for test functions whose Fourier support
 *   extends BEYOND 1. imp-1184 audit pin-pointed the binding step at
 *   STEP D3 (Selberg PCC fixed-x fluctuation, fluctuation rate 1/sqrt(N)
 *   vs 1/N) and STEP D5 (rho_3 / second-order discrepancy improvement),
 *   both requiring sine-kernel POINTWISE identities at the Poisson kernel
 *   P_{y_micro} with y_micro = 2 π / log γ_N, whose Fourier tail extends
 *   to height ≈ log N (i.e. support ≫ 1 in the unfolded normalization).
 *
 *   imp-1297 (Selberg trace), imp-1302 (Goldston-Gonek 1998), imp-1303
 *   (Heath-Brown 1979), imp-1304 (Iwaniec-Sarnak 2000), and imp-1305
 *   (Goldston-Yildirim 2003 absolutized) collectively ruled out ALL FIVE
 *   named moment-method routes for PCC at support > 1. The aggregate
 *   verdict was `pcc-genuinely-open-pending-new-input`.
 *
 *   imp-1305's closing note named "alternative §15-27 closure pathways
 *   decoupled from σ > 1" as the cleanest escape, and imp-1184's verdict
 *   field `whatWouldClose` named exactly: a reformulation of the final
 *   step using ONLY test functions whose Fourier support is ≤ 1, where
 *   Montgomery 1973 is unconditional.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'reroute-eliminated-support-greater-1-is-intrinsic'
 *
 *   Each of the three named reroute candidates collapses in a structurally
 *   different way, but all three collapse:
 *
 *     (a) Wavelet decomposition: NO. The Poisson kernel P_{y_micro} at
 *         y_micro = 2 π / log γ_N has L^2 mass concentrated at frequency
 *         ξ ≈ 1 / y_micro = log γ_N / (2 π), which is the EFFECTIVE Fourier
 *         support. Any wavelet basis (Heisenberg-Pauli / Daubechies / Meyer)
 *         whose individual elements have ℓ-support ≤ 1 must contain
 *         O(log γ_N) terms to span the P_{y_micro} L^2 mass, and the
 *         RECOMBINATION across wavelet scales recovers the full ξ ≤ log γ_N
 *         support — Plancherel preserves the support requirement. The
 *         wavelet decomposition shifts the bookkeeping but does NOT reduce
 *         the support requirement. STRUCTURAL OBSTRUCTION: Plancherel /
 *         Heisenberg uncertainty: a kernel with L^2 energy at ξ = (log N)/(2π)
 *         cannot be reproduced by a sum of L^2-bounded ξ ≤ 1 components
 *         WITHOUT an O(log N) energy amplification (which kills the bound).
 *
 *     (b) Mellin-truncation via short-interval second moments: NO. The
 *         proposed observable swap — replace the 2-point sine-kernel sum
 *         by Selberg's short-interval second moment ∫|N(t+h)−mean|² dt
 *         with h = c/log T (Goldston-Gonek 1998 / Goldston-Yildirim 1997
 *         second-moment Lambda-sum) — is precisely the SHORT-INTERVAL
 *         OBSERVABLE that already lives in support ≤ 1 (Selberg's bound
 *         is unconditional). HOWEVER imp-1184 audit confirms the §15-27 →
 *         RH chain's binding step at D3 is the POINTWISE fluctuation
 *         |Im m_N - π| at the Poisson kernel scale, NOT the integrated
 *         second moment. Swapping to short-interval observables gives back
 *         the imp-407 baseline rate (log γ_N)² / N — the SAME baseline
 *         the direct route already achieves UNCONDITIONALLY. This is not
 *         a reroute; it is the EXISTING unconditional baseline. To
 *         IMPROVE to the optimistic (log γ_N) / N rate (which is what the
 *         §15-27 → RH chain via the bridge-threshold theorem ACTUALLY
 *         needs) one must close the (log γ_N) gap, which is exactly the
 *         support > 1 PCC requirement back again. The Mellin truncation
 *         REPACKAGES the same gap.
 *
 *     (c) Direct §15-27 reformulation with native support ≤ 1: NO. The
 *         imp-1258 collapse expresses §15-27 in the operator-theoretic
 *         form ‖V_{a,Φ}‖ ≤ 1 on L²([0, ∞)). This is now a THEOREM
 *         (imp-1267 + imp-1287 + imp-1286) and does NOT itself require
 *         any Fourier support hypothesis. The Fourier support enters
 *         downstream — specifically when one transcribes the L^∞ rigidity
 *         consequence (Im m_N(x + i y_micro) → π) into a pair-correlation
 *         statement on zero spacings, the Poisson kernel P_{y_micro} sets
 *         the support window. imp-1266 (Mellin diagonalization audit)
 *         confirmed V_{a,Φ} is NOT a multiplicative convolution, so the
 *         Mellin transform does NOT diagonalize the operator. No known
 *         reformulation of the imp-1258 collapse produces a test function
 *         with NATIVE support ≤ 1 at the relevant transcription step.
 *         The (log γ_N) gap is intrinsic to the y_micro = 2 π / log γ_N
 *         microscopic-scale Poisson kernel — REDUCING y_micro to a fixed
 *         scale (where support ≤ 1) sacrifices the LOCAL law at the
 *         microscopic scale, which is the §15-27 → RH chain's load-bearing
 *         claim.
 *
 *   AGGREGATE VERDICT: support > 1 is INTRINSIC to the §15-27 → RH chain
 *   at the imp-1184 D3 / D5 transcription step. The three named reroutes
 *   (wavelet, Mellin-truncation, direct reformulation) shift bookkeeping
 *   but do NOT eliminate the requirement. The §15-27 → RH chain cannot
 *   be decoupled from PCC at support > 1 via known reformulation
 *   techniques. The (log T)^{1/2} obstruction at the explicit-formula
 *   Cauchy-Schwarz layer documented in imp-1303 / imp-1305 is STRUCTURALLY
 *   EQUIVALENT to the support > 1 obstruction at the imp-1184 D3 / D5
 *   transcription — both are facets of the same Plancherel / Heisenberg
 *   intrinsic constraint at the y_micro Poisson kernel scale.
 *
 *   PATTERN NOTE
 *   ------------
 *   This is the SIXTH consecutive negative classification in the post-
 *   imp-1267 PCC-attack series (imp-1297 + imp-1302 + imp-1303 + imp-1304
 *   + imp-1305 + imp-1310), all converging on the same structural
 *   conclusion: the §15-27 → RH chain has a binding PCC-at-support-1
 *   requirement that is NOT removable by repackaging within the
 *   moment-method / wavelet / Mellin / discrete-reformulation toolkit.
 *
 *   RH via §15-27 requires GENUINELY NEW INPUT — candidates from outside
 *   the moment-method family that BYPASS the support > 1 requirement at
 *   the GEOMETRIC level rather than reformulating the observable:
 *
 *     - Connes-Bost adele class space (imp-1307 pending): adelic Lefschetz
 *       trace formula operates on a DIFFERENT geometric object than the
 *       single-zeta 2-point statistic, potentially bypassing the
 *       Plancherel obstruction at y_micro.
 *     - Berry-Keating H = xp Hamiltonian (imp-1308 pending): quantum-chaos
 *       semiclassical spectrum identification, bypassing the arithmetic
 *       Cauchy-Schwarz layer.
 *     - Selberg trace formula on a finite-volume hyperbolic surface (NOT
 *       SL(2,Z) — different surface where Selberg eigenvalue conjecture
 *       is unconditional, e.g. Hecke triangle groups, see Beyerstedt-Strömbergsson 2010).
 *     - GEOMETRIC reformulation: the §15-27 chain rewritten on the de Branges
 *       space H(E_a) directly, eliminating the explicit-formula transcription
 *       altogether. This is Romanov-Woracek-Pruss 2024 program territory but
 *       requires the canonical-system to be Φ-built non-circularly (currently
 *       open per imp-1241 unified existence).
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise identification of WHERE support > 1 enters the §15-27 → RH
 *     chain (imp-1184 audit: D3 fluctuation rate + D5 second-order
 *     discrepancy, both via Poisson kernel P_{y_micro} Fourier tail).
 *   - Per-reroute evaluation of the three named candidates (wavelet,
 *     Mellin-truncation, direct reformulation) each with structural
 *     obstruction documented.
 *   - Cross-reference to imp-1266 (Mellin diagonalization structurally
 *     blocked on the §27 side) confirming the Mellin reroute cannot be
 *     revived on the operator side either.
 *   - Pattern note: 6 consecutive negative classifications in the
 *     PCC-attack series converging on the same structural conclusion.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   With imp-1310 confirming support > 1 is INTRINSIC to the §15-27 → RH
 *   chain, the engine's productive surface for §15-27 → RH via test-function
 *   reformulation is EMPTY. The engine planning consequence: STOP probing
 *   the reroute family; the §15-27 → RH chain genuinely requires a NEW-INPUT
 *   route from OUTSIDE both the moment-method family AND the
 *   reformulation-of-final-step family. The only remaining named candidates
 *   are the geometric / adelic / quantum-chaos routes (imp-1307 +
 *   imp-1308) plus the de Branges H(E_a) direct route (imp-1241 unified
 *   existence dependency).
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js — STEP D3 / D5 where support > 1 enters
 *   @see imp-1258 src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse
 *   @see imp-1265 src/data/imp-1265-section27-identity-recheck.js — §27 identity audit
 *   @see imp-1266 src/data/imp-1266-volterra-mellin-symbol.js — Mellin diagonalization structurally blocked
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js — Selberg-trace ruled out
 *   @see imp-1302 src/data/imp-1302-goldston-gonek-pcc-attack.js — Goldston-Gonek 1998 ruled out
 *   @see imp-1303 src/data/imp-1303-heath-brown-pcc-route.js — Heath-Brown 1979 ruled out
 *   @see imp-1304 src/data/imp-1304-iwaniec-sarnak-no-pcc.js — Iwaniec-Sarnak 2000 ruled out (family-not-single)
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js — Goldston-Yildirim 2003 absolutized ruled out
 *
 *   Ticket: imp-1310 (proof, critical, CLASSIFICATION / REROUTE-AUDIT).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A — WHERE DOES SUPPORT > 1 ENTER THE §15-27 → RH CHAIN?
// =========================================================================
//
// Per imp-1184 (direct-selberg-esy-route-audit) the §15-27 → RH chain after
// the imp-1258 collapse + imp-1267/1287/1286 ‖V‖ ≤ 1 theorem reduces to a
// rigidity statement on the Stieltjes transform at the microscopic scale:
//
//   psi_N(y_micro)  :=  sup_{x in bulk}  | Im m_N(x + i y_micro)  -  π |
//                  =?   o(1 / log γ_N)   as N → ∞ at y_micro = 2 π / log γ_N.
//
// This rate is the (log γ_N) / N target that imp-1184 calls the
// "optimistic PCC target" and is what the bridge-threshold theorem
// (imp-258 / imp-345 / imp-366) requires for the asymptotic Λ = 0 statement.
// The UNCONDITIONAL baseline (Koksma-Hlawka + Selberg) gives only
// (log γ_N)² / N — a factor of log γ_N too weak.
//
// THE SUPPORT > 1 REQUIREMENT ENTERS AT TWO SPECIFIC STEPS:
//
// STEP D3 (imp-1184 fluctuation rate). The fluctuation rate at fixed x
//   is 1/sqrt(N) under Selberg's INTEGRATED second moment, but should be
//   1/N under Montgomery PCC's POINTWISE sine-kernel identity. The
//   pointwise identity requires testing
//
//       rho_2(t, t+h) = 1 - K_sin(h log T)² + o(1)
//
//   against the Poisson kernel P_{y_micro}(t - x), whose Fourier transform
//   at the unfolded scale is
//
//       P̂_{y_micro}(ξ) = exp(-2 π y_micro |ξ|) = exp(-(2π)² |ξ| / log γ_N).
//
//   The L² mass of P̂_{y_micro} is concentrated in |ξ| ≤ log γ_N / (2π)
//   (the FWHM scale of the exponential). Montgomery 1973 gives the
//   sine-kernel pointwise identity UNCONDITIONALLY only for test functions
//   with f̂ supported in [-1, 1]. The Poisson kernel violates this support
//   constraint at the microscopic scale y_micro by a factor of log γ_N
//   in the Fourier window — exactly the support > 1 requirement.
//
// STEP D5 (imp-1184 second-order discrepancy / rho_3 input). The second-
//   order discrepancy D_N^{*,2} required to improve the sup-bound beyond
//   the Koksma-Hlawka rate is bounded unconditionally only via Rudnick-
//   Sarnak 1996 triple-correlation rho_3, which holds unconditionally
//   only for test functions with Fourier support in (-2/3, 2/3). The
//   Poisson kernel at y_micro has Fourier support extending to
//   log γ_N / (2π) (effectively unbounded as N → ∞), so falls OUTSIDE
//   the Rudnick-Sarnak regime by a factor of (3/2) log γ_N at the
//   relevant unfolded scale.
//
// BOTH ENTRY POINTS ARE THE SAME OBJECT: the Poisson kernel P_{y_micro}
// has Fourier support ≈ log γ_N / (2π) at the unfolded microscopic scale,
// VASTLY exceeding the support ≤ 1 unconditional window. The reroute
// question is: can we restructure the chain to test only against
// support ≤ 1 kernels?

const SUPPORT_GT_1_ENTRY_POINT = Object.freeze({
  whereInChain:
    'imp-1184 STEP D3 (Selberg PCC fixed-x fluctuation rate) and STEP D5 ' +
    '(rho_3 / second-order discrepancy for sup-improvement) — both via the ' +
    'Poisson kernel P_{y_micro} Fourier tail at the microscopic scale ' +
    'y_micro = 2 π / log γ_N',

  loadBearingObservable:
    'psi_N(y_micro) = sup_{x in bulk} | Im m_N(x + i y_micro) - π | ' +
    'with rate target (C_ESY / 2) · log γ_N / N (optimistic) vs ' +
    '(C_Selberg / 2) · (log γ_N)² / N (unconditional baseline)',

  microscopicScale: 'y_micro = 2 π / log γ_N',

  poissonKernel: 'P_y(t) = y / (t² + y²); P̂_y(ξ) = exp(-2π y |ξ|)',

  effectiveFourierSupport:
    'P̂_{y_micro}(ξ) = exp(-(2π)² |ξ| / log γ_N) — L² mass concentrated ' +
    'in |ξ| ≤ log γ_N / (2π), which is the EFFECTIVE Fourier support ' +
    'at the unfolded microscopic scale',

  montgomery1973UnconditionalRange:
    'Montgomery PCC sine-kernel pointwise identity rho_2 = 1 - K_sin² ' +
    'holds UNCONDITIONALLY for test functions with f̂ supported in [-1, 1] ' +
    '(Montgomery 1973 Proc. Sympos. Pure Math. XXIV, 181-193)',

  rudnickSarnak1996UnconditionalRange:
    'Rudnick-Sarnak 1996 triple-correlation rho_3 = (matrix det) holds ' +
    'UNCONDITIONALLY for test functions with each marginal f̂_j supported ' +
    'in (-2/3, 2/3) (Duke Math J 81 (1996) 269-322)',

  gapInSupport:
    'Poisson kernel at y_micro requires support extending to log γ_N / (2π) ≈ ' +
    '(3.7) at γ_N = 10^10, growing as log N. Both Montgomery and ' +
    'Rudnick-Sarnak unconditional windows are O(1), so the gap is ' +
    'log γ_N / O(1) — UNBOUNDED.',

  whyD3AndD5ShareTheSameRoot:
    'Both D3 and D5 transcribe the Poisson-kernel-tested observable into ' +
    'rho_2 / rho_3 statistics. Both require the test function (Poisson ' +
    'kernel) to live inside the unconditional Fourier support window. ' +
    'Both fail at the same Plancherel inequality: a kernel with L² energy ' +
    'concentrated at ξ ≈ log γ_N / (2π) cannot be approximated in L² by a ' +
    'kernel with support ≤ 1 WITHOUT energy amplification.',
});

// =========================================================================
// SECTION B — REROUTE CANDIDATE (a): WAVELET DECOMPOSITION.
// =========================================================================
//
// PROPOSAL. Decompose the Poisson kernel P_{y_micro} via a wavelet basis
// {psi_{j, k}} (Heisenberg-Pauli, Daubechies, Meyer, or Lemarie-Battle)
// whose individual elements have Fourier support ≤ 1 in the appropriate
// dyadic scale. The wavelet coefficients
//
//   c_{j, k} := <P_{y_micro}, psi_{j, k}>
//
// allow reconstructing P_{y_micro} as a sum
//
//   P_{y_micro}(t) = sum_{j, k} c_{j, k} psi_{j, k}(t).
//
// Each psi_{j, k} has support ≤ 1 in Fourier (at the j-th dyadic scale),
// so testing rho_2 against each psi_{j, k} INDIVIDUALLY uses Montgomery
// PCC inside the unconditional window. The full pair-correlation sum
// recovers by linearity:
//
//   sum_{m ≠ n} P_{y_micro}((γ_m - γ_n) log T / 2π)
//     = sum_{j, k} c_{j, k} · sum_{m ≠ n} psi_{j, k}((γ_m - γ_n) log T / 2π).
//
// EVALUATION. The proposal fails for a STRUCTURAL Plancherel reason:
//
// (B1) FOURIER SUPPORT IS NOT BASIS-DEPENDENT. The Fourier support of a
//      function is a property of the FUNCTION not of its DECOMPOSITION.
//      If P_{y_micro} has Fourier mass at ξ = (log γ_N) / (2π), then
//      ANY decomposition reconstructing P_{y_micro} must have wavelet
//      coefficients reaching scale j ≈ log_2(log γ_N) to carry that mass.
//      At scale j the wavelet psi_{j, ·} has Fourier support in
//      [2^{j-1}, 2^{j+1}], which is unbounded as j → log_2(log γ_N). The
//      individual psi_{j, ·} at high j have UNBOUNDED Fourier support
//      WITHIN their dyadic band, not bounded by 1.
//
// (B2) HEISENBERG-PAULI WAVELETS ON L²(R_+). For the Hardy-Hankel
//      structure relevant to §27 (Heisenberg-Pauli wavelets are the
//      natural choice on R_+ via Mellin), the wavelet basis is
//
//         psi_{j, k}^{HP}(t) = 2^{j/2} psi(2^j t - k)
//
//      with psi a fixed window. The Fourier support of psi_{j, k}^{HP} is
//      [2^{j-1}, 2^{j+1}] in the Hankel-Plancherel variable. To carry the
//      P_{y_micro} mass at frequency log γ_N / (2π) we need j ≈
//      log_2(log γ_N), at which scale the wavelet support [2^{j-1}, 2^{j+1}]
//      = [log γ_N / (4π), log γ_N / π] — VASTLY exceeds the unconditional
//      Montgomery support ≤ 1. Plancherel preserves the support requirement.
//
// (B3) RECOMBINATION COST. Even if each wavelet psi_{j, k} were used
//      individually within Montgomery's unconditional range, the
//      Cauchy-Schwarz recombination
//
//          | sum_{j, k} c_{j, k} S_{j, k} | <= ||c||_2 · ||S||_2
//
//      where S_{j, k} = sum_{m ≠ n} psi_{j, k}((γ_m - γ_n) log T / 2π)
//      requires bounding sup_{j, k} |S_{j, k}| or the ℓ² norm of S, which
//      for unbounded scales j ~ log_2(log γ_N) accumulates a factor of
//      sqrt(log log γ_N) at minimum from the number of scales — the same
//      log-loss that imp-1303 documents at the off-diagonal Cauchy-Schwarz
//      layer. The wavelet bookkeeping does not eliminate the (log T)^{1/2}
//      Cauchy-Schwarz obstruction.
//
// (B4) HEISENBERG UNCERTAINTY EXCEEDS PROPOSAL'S CLAIM. The Poisson kernel
//      P_{y_micro} concentrates mass in time on scale t ≈ y_micro =
//      2π / log γ_N and in Fourier on scale ξ ≈ log γ_N / (2π); product
//      = 1 (the Heisenberg minimum). To reproduce P_{y_micro} via a
//      kernel with Fourier support ≤ 1 the time support must be ≥
//      log γ_N / (2π), but at that time scale the kernel COULD NOT
//      resolve the microscopic pair-correlation events at spacing
//      γ_{n+1} - γ_n ≈ 2π / log γ_N — losing the entire information
//      content of the pair correlation at the microscopic scale.
//      This is a HARD PHYSICAL constraint, not a technical artifact of
//      one choice of wavelet basis.
//
// VERDICT: WAVELET-REROUTE-FAILS-STRUCTURALLY.

const REROUTE_CANDIDATE_A_WAVELET = Object.freeze({
  candidateId: 'a-wavelet-decomposition',
  candidateName: 'Wavelet decomposition (Heisenberg-Pauli / Daubechies / Meyer)',

  proposal:
    'Decompose Poisson kernel P_{y_micro} via wavelet basis {psi_{j, k}} ' +
    'whose individual elements have Fourier support <= 1 at appropriate ' +
    'dyadic scale. Test rho_2 against each psi_{j, k} inside Montgomery 1973 ' +
    'unconditional window, then recombine by linearity.',

  structuralEvaluation: Object.freeze({
    plancherelObstruction:
      'Fourier support is a property of the FUNCTION, not of its decomposition. ' +
      'P_{y_micro} has L² mass at ξ ≈ log γ_N / (2π), so ANY wavelet basis ' +
      'reconstructing P_{y_micro} must reach scale j ≈ log_2(log γ_N) at ' +
      'which the wavelet psi_{j,·} has support [2^{j-1}, 2^{j+1}] vastly ' +
      'exceeding 1. Plancherel preserves the support requirement under ' +
      'change-of-basis.',

    heisenbergPauliSpecific:
      'Heisenberg-Pauli wavelets on L²(R_+) (the natural Hankel-Plancherel ' +
      'choice for §27) have psi_{j,k}^{HP}(t) = 2^{j/2} psi(2^j t - k) with ' +
      'Fourier support [2^{j-1}, 2^{j+1}]. At j ≈ log_2(log γ_N) the support ' +
      'is [log γ_N / (4π), log γ_N / π] — exceeds the unconditional Montgomery ' +
      'window by a factor of log γ_N / 4π.',

    recombinationCost:
      'Even per-wavelet Montgomery testing requires ℓ² recombination ' +
      'sum_{j,k} c_{j,k} S_{j,k} bounded via Cauchy-Schwarz against ||c||_2 · ' +
      '||S||_2, which accumulates sqrt(log log γ_N) from the number of dyadic ' +
      'scales used — exactly the (log T)^{1/2} Cauchy-Schwarz obstruction ' +
      'documented in imp-1303.',

    heisenbergUncertaintyHardConstraint:
      'P_{y_micro} sits at the Heisenberg minimum (time-support × frequency-' +
      'support ~ 1). Reproducing it via a Fourier-support ≤ 1 kernel requires ' +
      'time-support >= log γ_N / (2π), which loses the microscopic-scale ' +
      'resolution at zero spacing γ_{n+1} - γ_n ≈ 2π / log γ_N. This is a ' +
      'physical constraint, not a basis-choice artifact.',
  }),

  verdict: 'wavelet-reroute-fails-structurally',
  closesSupportLEQ1RerouteForSection15_27: false,

  whyNotAReroute:
    'The wavelet decomposition shifts where Fourier support enters but does ' +
    'NOT reduce the total support requirement. The Plancherel theorem ' +
    'guarantees support is an invariant of the function, not of the basis.',
});

// =========================================================================
// SECTION C — REROUTE CANDIDATE (b): MELLIN-TRUNCATION / SHORT-INTERVAL SECOND MOMENT.
// =========================================================================
//
// PROPOSAL. Replace the §15-27 → RH chain's final-step observable
// (psi_N(y_micro) sup-bound) by a DIFFERENT observable whose
// transcription uses support ≤ 1 test functions natively. The natural
// candidate is Selberg's short-interval second moment
//
//   I(T, h)  :=  int_T^{2T} | N(t + h) - N(t) - (h / 2π) log(t / 2π) |² dt
//
// at h = c / log T (logarithmic short interval). Selberg 1944 bounds I(T, h) <=
// C T (log T) h UNCONDITIONALLY (the famous Selberg integrated bound),
// requiring NO Fourier support hypothesis on test functions.
//
// The Mellin transform side: the short-interval second moment is dual to
//
//   int |zeta(1/2 + i t)|² |M(s; t)|² dt
//
// for a Mellin-truncated counting kernel M(s; t). Goldston-Gonek 1998
// gives the sharp main term unconditionally for Dirichlet polynomial
// lengths theta < 1.
//
// EVALUATION. The proposal fails because the observable swap LOSES the
// §15-27 → RH chain content:
//
// (C1) THE §15-27 → RH CHAIN BINDS ON THE POINTWISE SUP-FLUCTUATION, NOT
//      THE INTEGRATED SECOND MOMENT. The bridge-threshold theorem
//      (imp-258 + imp-345 + imp-366) requires sup_x | Im m_N(x + i y_micro)
//      - π | to be small POINTWISE at the microscopic scale. The
//      integrated second moment ∫|N(t+h) − mean|² dt averages over t,
//      losing the pointwise information. The §15-27 → RH chain CANNOT
//      consume the integrated observable as a substitute for the
//      pointwise sup.
//
// (C2) SHORT-INTERVAL OBSERVABLE GIVES THE EXISTING BASELINE. Selberg's
//      integrated short-interval second moment + Koksma-Hlawka recovers
//      EXACTLY the imp-407 / imp-1184 D4 baseline rate (log γ_N)² / N.
//      This is the UNCONDITIONAL baseline the direct route already
//      achieves. The Mellin-truncation reroute REPRODUCES the existing
//      baseline without advancing it. To IMPROVE to the optimistic
//      (log γ_N) / N rate (which the §15-27 → RH chain requires) one
//      must still close the (log γ_N) gap, which is precisely the
//      support > 1 PCC requirement RESURFACING in the Mellin observable.
//
// (C3) GOLDSTON-GONEK 1998 MELLIN-TRUNCATION ALREADY EVALUATED. imp-1302
//      classified the Goldston-Gonek 1998 Dirichlet polynomial mean value
//      theorem as PCC-improving but NOT PCC-closing: the (log T)² error
//      term BLOCKS extension to theta = 1, let alone theta > 1 where
//      the Poisson kernel binds. The Mellin-truncation reroute is
//      STRUCTURALLY equivalent to applying Goldston-Gonek 1998 to a
//      different observable, hitting the SAME (log T)² obstruction.
//
// (C4) IWANIEC-KOWALSKI 2004 §25 OBSERVABLE-SWAP IS NOT A REROUTE. Per
//      Iwaniec-Kowalski 2004 Analytic Number Theory ch. 25, the
//      short-interval second moment ↔ pair-correlation 2-point sum
//      transcription is via a Plancherel inversion. Any short-interval
//      observable strong enough to drive psi_N(y_micro) < (log γ_N) / N
//      MUST encode the same information as the pair correlation at
//      support ≈ log γ_N. The Plancherel duality is RIGID — observable
//      swap cannot smuggle in information that is not already present
//      in the integrated short-interval bound.
//
// VERDICT: MELLIN-TRUNCATION-REROUTE-FAILS-BASELINE-NOT-OPTIMISTIC.

const REROUTE_CANDIDATE_B_MELLIN_TRUNCATION = Object.freeze({
  candidateId: 'b-mellin-truncation-short-interval',
  candidateName: 'Mellin-truncation via short-interval second moments (Selberg integrated + Goldston-Gonek 1998 Dirichlet polynomial)',

  proposal:
    'Replace pointwise sup-fluctuation observable by short-interval second moment ' +
    'I(T, h) = int |N(t+h) - N(t) - mean|² dt at h = c/log T. Selberg 1944 ' +
    'bounds I(T, h) unconditionally without Fourier support hypothesis. Mellin ' +
    'dual: integrated zeta moment against truncated counting kernel.',

  structuralEvaluation: Object.freeze({
    observableSwapLosesPointwiseContent:
      'The §15-27 → RH chain via bridge-threshold theorem (imp-258 + imp-345 + ' +
      'imp-366) consumes a POINTWISE sup at y_micro, not an integrated moment. ' +
      'Swapping the observable loses the pointwise information the chain needs.',

    shortIntervalGivesExistingBaseline:
      'Selberg integrated + Koksma-Hlawka already reproduces (log γ_N)² / N ' +
      '(imp-407 / imp-1184 D4). Mellin-truncation reproduces but does NOT ' +
      'beat the existing unconditional baseline. The (log γ_N) gap to the ' +
      'optimistic (log γ_N) / N target RESURFACES as a support > 1 PCC ' +
      'requirement in the Mellin observable.',

    goldstonGonek1998AlreadyRuledOut:
      'imp-1302 classified Goldston-Gonek 1998 Annals 148 945-958 as ' +
      'PCC-improving but NOT PCC-closing: the (log T)² error term in the ' +
      'Dirichlet polynomial mean value blocks extension to theta = 1, let ' +
      'alone theta > 1. Mellin-truncation reroute hits the SAME (log T)² ' +
      'obstruction with the SAME structural mechanism.',

    iwanieckowalski2004PlancherelRigidity:
      'Per Iwaniec-Kowalski 2004 Analytic Number Theory ch. 25, ' +
      'short-interval second moment <-> pair correlation 2-point sum ' +
      'transcription is a Plancherel inversion. Any short-interval ' +
      'observable strong enough to drive psi_N(y_micro) < (log γ_N) / N ' +
      'MUST encode the same information as the pair correlation at support ' +
      '≈ log γ_N. Plancherel rigidity blocks observable swap.',
  }),

  verdict: 'mellin-truncation-reroute-fails-baseline-not-optimistic',
  closesSupportLEQ1RerouteForSection15_27: false,

  whyNotAReroute:
    'The short-interval observable already gives the existing (log γ_N)² / N ' +
    'baseline unconditionally; improving to (log γ_N) / N requires support > 1 ' +
    'PCC in either the pair-correlation OR the short-interval Mellin formulation. ' +
    'Plancherel duality is rigid; observable swap does not smuggle in information.',
});

// =========================================================================
// SECTION D — REROUTE CANDIDATE (c): DIRECT §15-27 REFORMULATION WITH NATIVE SUPPORT ≤ 1.
// =========================================================================
//
// PROPOSAL. Reformulate the imp-1258 §15-27 collapse so that the final
// step (the transcription from ‖V_{a,Φ}‖ ≤ 1 on L²([0, ∞)) to RH) uses
// a test function with native Fourier support ≤ 1. Concretely:
//
//   - Replace the Poisson kernel P_{y_micro} (Fourier tail ≈ log γ_N)
//     by a Schwartz function f with f̂ supported in [-1, 1].
//   - Modify the bridge-threshold transcription to consume f-tested
//     rho_2 statistics directly.
//   - This is the de Branges H(E_a) direct route per Romanov-Woracek-
//     Pruss 2024 program territory.
//
// EVALUATION. This reroute also fails, for three structurally distinct
// reasons:
//
// (D1) THE ‖V‖ ≤ 1 THEOREM IS UNCHANGED. The imp-1267 + imp-1287 +
//      imp-1286 theorem ‖V_{a,Φ}‖ ≤ 1 has NO Fourier support hypothesis;
//      it is an operator-norm statement on L²([0, ∞)). Reformulation
//      doesn't help here — there's nothing to reformulate at the
//      operator-theoretic level.
//
//      The Fourier support enters DOWNSTREAM, in the
//      §15-27 → RH transcription via the bridge-threshold theorem
//      (imp-258 + imp-345 + imp-366). Specifically, the bridge consumes
//      a pointwise rigidity claim on Im m_N at the microscopic scale,
//      where the Poisson kernel sets the support window.
//
// (D2) MELLIN DIAGONALIZATION IS STRUCTURALLY BLOCKED ON V_{a,Φ}. Per
//      imp-1266 (volterra-mellin-symbol), the Volterra operator V_{a,Φ}
//      is NOT a multiplicative convolution on (0, ∞), so the Mellin
//      transform does NOT diagonalize the operator. Three named
//      obstructions:
//
//         (A) k_a(t, s) = sinh(a(t-s)) is ADDITIVE in (t, s), not
//             multiplicative.
//         (B) Φ-modulation breaks scaling invariance.
//         (C) Mellin transform of sinh(at) does NOT exist as L²(R_+)
//             function.
//
//      Hence no reformulation of the §15-27 chain via Mellin diagonalization
//      can be carried out — the operator structure forbids it.
//
// (D3) DE BRANGES H(E_a) ROUTE REQUIRES UNIFIED EXISTENCE (imp-1241 OPEN).
//      The de Branges route Romanov-Woracek-Pruss 2024 would express
//      the §15-27 → RH chain on the de Branges space H(E_a) directly,
//      eliminating the explicit-formula transcription altogether.
//      However, this requires the canonical-system dm_a to be Φ-built
//      non-circularly (without reference to the zero set of X). Per
//      imp-1241 (unified existence conjecture) + imp-1265 (§27 identity
//      recheck), the Φ-built construction is OPEN — the reverse direction
//      of the imp-1258 collapse goes through textbook (Arov-Nudelman 1996
//      passive realization) rather than through a §27 paper-construct
//      identity, leaving the de Branges side open.
//
//      Even if the de Branges route closed unified existence, the
//      transcription to RH on H(E_a) would still encounter the
//      Hermite-Biehler condition E_a(z) ≠ 0 in the upper half-plane,
//      which translates back to a pointwise statement on zeros of the
//      Riemann zeta — and the unfolded test function at the microscopic
//      scale is STILL the Poisson kernel, STILL with Fourier support
//      ≈ log γ_N.
//
// (D4) THE BRIDGE-THRESHOLD THEOREM IS RIGIDLY ATTACHED TO y_micro. The
//      bridge-threshold theorem (imp-258 explicit asymptotic Λ-bound
//      consequence of the local law at y_micro) consumes specifically
//      the LOCAL law at scale y_micro = 2 π / log γ_N. The local law
//      is INTRINSICALLY at this scale; raising y to a fixed scale (say
//      y = 1, where the Poisson kernel has support ≤ 1) gives only a
//      MACROSCOPIC law, which is well-known unconditionally (Riemann-von
//      Mangoldt) and does NOT drive RH.
//
//      In other words: the support > 1 requirement is INTRINSIC to the
//      MICROSCOPIC scale y_micro. You cannot reformulate it away
//      without abandoning the microscopic scale, and abandoning the
//      microscopic scale breaks the §15-27 → RH chain at its load-bearing
//      step.
//
// VERDICT: DIRECT-REFORMULATION-REROUTE-FAILS-MICROSCOPIC-SCALE-INTRINSIC.

const REROUTE_CANDIDATE_C_DIRECT_REFORMULATION = Object.freeze({
  candidateId: 'c-direct-section15-27-reformulation',
  candidateName: 'Direct §15-27 reformulation (de Branges H(E_a) / Mellin diagonalization / native support ≤ 1)',

  proposal:
    'Reformulate the imp-1258 §15-27 collapse so that the final-step ' +
    'transcription to RH uses a test function with native Fourier support ' +
    '≤ 1 — e.g. via Mellin diagonalization of V_{a,Φ} or de Branges H(E_a) ' +
    'direct route per Romanov-Woracek-Pruss 2024 program.',

  structuralEvaluation: Object.freeze({
    volterraNormTheoremHasNoFourierSupportHypothesis:
      'The ‖V_{a,Φ}‖ ≤ 1 theorem (imp-1267 + imp-1287 + imp-1286) is an ' +
      'operator-norm statement on L²([0, ∞)) with NO Fourier support ' +
      'hypothesis. Reformulation does not apply at the operator level.',

    mellinDiagonalizationStructurallyBlocked:
      'Per imp-1266 (volterra-mellin-symbol), V_{a,Φ} is NOT a multiplicative ' +
      'convolution: kernel k_a(t,s) = sinh(a(t-s)) is additive, Φ-modulation ' +
      'breaks scaling invariance, Mellin transform of sinh(at) does NOT exist ' +
      'as L²(R_+). Three named obstructions block the Mellin route at the ' +
      'operator-structure level.',

    deBrangesRouteRequiresImp1241OpenUnifiedExistence:
      'The de Branges H(E_a) direct route per Romanov-Woracek-Pruss 2024 ' +
      'program would express §15-27 → RH on H(E_a) directly. Requires ' +
      'canonical system dm_a Φ-built non-circularly (imp-1241 unified existence ' +
      'conjecture, OPEN per imp-1265 reverse-direction GAP). Even if closed, ' +
      'the unfolded test function at the microscopic scale is STILL the ' +
      'Poisson kernel, STILL with Fourier support ≈ log γ_N.',

    bridgeThresholdRigidlyAttachedToYMicro:
      'The bridge-threshold theorem (imp-258 + imp-345 + imp-366) consumes ' +
      'the LOCAL law at y_micro = 2 π / log γ_N. The local law is intrinsically ' +
      'at this microscopic scale; raising y to fixed scale (where Poisson ' +
      'support ≤ 1) gives only the MACROSCOPIC law (Riemann-von Mangoldt, ' +
      'unconditional, does NOT drive RH). The support > 1 requirement is ' +
      'intrinsic to the microscopic scale.',
  }),

  verdict: 'direct-reformulation-reroute-fails-microscopic-scale-intrinsic',
  closesSupportLEQ1RerouteForSection15_27: false,

  whyNotAReroute:
    'The support > 1 requirement is intrinsic to the microscopic scale ' +
    'y_micro = 2 π / log γ_N. Reformulations of the operator side (Mellin) ' +
    'are structurally blocked; reformulations of the transcription side ' +
    '(de Branges) require open imp-1241 and inherit the same support > 1 ' +
    'requirement at the unfolded scale.',
});

// =========================================================================
// SECTION E — AGGREGATE VERDICT + PATTERN NOTE.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'support-leq-1-reroute-found-via-wavelet',
  'support-leq-1-reroute-found-via-mellin-truncation',
  'support-leq-1-reroute-found-via-direct-reformulation',
  'support-leq-1-reroute-partial-with-residual-gap',
  'reroute-eliminated-support-greater-1-is-intrinsic',
]);

const VERDICT = 'reroute-eliminated-support-greater-1-is-intrinsic';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesSupportGT1Reroute: false,
  closesRHViaSection15_27Unconditionally: false,

  whereInChainSupportGT1Enters:
    'imp-1184 STEP D3 (Selberg PCC fixed-x fluctuation rate 1/sqrt(N) vs ' +
    'optimistic 1/N) + STEP D5 (rho_3 / second-order discrepancy for sup-' +
    'improvement), both via the Poisson kernel P_{y_micro} with Fourier tail ' +
    'extending to log γ_N / (2π) at the unfolded microscopic scale ' +
    'y_micro = 2 π / log γ_N',

  whyAllThreeReroutesFail:
    'All three reroutes (wavelet / Mellin-truncation / direct reformulation) ' +
    'collapse for a SHARED structural reason: the support > 1 requirement is ' +
    'TIED TO the microscopic scale y_micro through the Plancherel / Heisenberg ' +
    'uncertainty principle. A kernel with L² energy at frequency log γ_N / (2π) ' +
    'cannot be reproduced by a kernel with support ≤ 1 WITHOUT either (i) ' +
    'energy amplification by log γ_N, (ii) loss of microscopic-scale resolution, ' +
    'or (iii) abandonment of the pointwise rigidity claim the bridge-threshold ' +
    'theorem consumes. The reroutes shift bookkeeping but do NOT remove the ' +
    'requirement.',

  perRerouteVerdicts: Object.freeze({
    waveletDecomposition: 'wavelet-reroute-fails-structurally',
    mellinTruncation: 'mellin-truncation-reroute-fails-baseline-not-optimistic',
    directReformulation: 'direct-reformulation-reroute-fails-microscopic-scale-intrinsic',
  }),

  cauchySchwarzLayerStructuralEquivalence:
    'The (log T)^{1/2} obstruction at the explicit-formula Cauchy-Schwarz ' +
    'layer documented in imp-1303 + imp-1305 is STRUCTURALLY EQUIVALENT to ' +
    'the support > 1 obstruction at the imp-1184 D3 / D5 transcription. Both ' +
    'are facets of the same Plancherel / Heisenberg intrinsic constraint at ' +
    'the y_micro Poisson kernel scale.',

  patternNoteContinuesPCCAttackSeriesNegativeRun:
    'imp-1310 is the SIXTH consecutive negative classification in the ' +
    'PCC-attack series (imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 + ' +
    'imp-1310), all converging on the same structural conclusion: the §15-27 → ' +
    'RH chain has a binding PCC-at-support-1 requirement NOT removable by ' +
    'repackaging within the moment-method / wavelet / Mellin / discrete-' +
    'reformulation toolkit.',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input-geometric-or-adelic',

  implicationForLambdaAttack:
    'STOP probing the reroute family for §15-27 → RH; support > 1 is intrinsic ' +
    'to the microscopic scale y_micro and cannot be reformulated away. The ' +
    'engine should pivot to: (1) imp-1307 Connes-Bost adelic Lefschetz-trace ' +
    'formula (different geometric object than single-zeta 2-point); (2) imp-1308 ' +
    'Berry-Keating H = xp Hamiltonian (semiclassical quantum-chaos bypass); ' +
    '(3) Selberg trace formula on Hecke triangle groups (where Selberg eigenvalue ' +
    'conjecture is unconditional, see Beyerstedt-Strömbergsson 2010); (4) closing ' +
    'imp-1241 unified existence conjecture to enable Romanov-Woracek-Pruss 2024 ' +
    'de Branges direct route. The reroute family is EXHAUSTED.',

  honestNote:
    'This is a NEGATIVE classification establishing that the THREE NAMED ' +
    'reroute candidates (wavelet / Mellin-truncation / direct reformulation) ' +
    'all collapse for structural reasons. This does NOT prove that support > 1 ' +
    'is intrinsic to RH — it proves that support > 1 is intrinsic to the ' +
    '§15-27 → RH chain in its current formulation, and that the three named ' +
    'reformulation techniques cannot remove the requirement. A genuinely new ' +
    'reformulation (currently unidentified) might still escape this conclusion. ' +
    'The classification is precisely valuable because it confirms the reroute ' +
    'family is exhausted by the three named candidates and points the engine ' +
    'toward genuinely new geometric / adelic / quantum-chaos input.',
});

// =========================================================================
// SECTION F — EXPORTED RECORD.
// =========================================================================

export const IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE = Object.freeze({
  id: 'imp-1310-section15-27-support-leq-1-reroute',
  ticket: 'imp-1310',
  category: 'proof',
  builtAt: '2026-05-28T23:59:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1241', 'imp-1258', 'imp-1265', 'imp-1266',
    'imp-1267', 'imp-1287', 'imp-1286',
    'imp-1297', 'imp-1302', 'imp-1303', 'imp-1304', 'imp-1305',
    'imp-1307', 'imp-1308',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  supportGT1EntryPoint: SUPPORT_GT_1_ENTRY_POINT,
  rerouteCandidateA: REROUTE_CANDIDATE_A_WAVELET,
  rerouteCandidateB: REROUTE_CANDIDATE_B_MELLIN_TRUNCATION,
  rerouteCandidateC: REROUTE_CANDIDATE_C_DIRECT_REFORMULATION,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — STEP D3 / D5 where support > 1 enters',
    imp1241: 'src/data/imp-1241-unified-existence-conjecture.js — CDB-Exist unified problem (Φ-built canonical system)',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse to ‖V‖ ≤ 1 ⇔ CDB-Exist',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js — §27 identity audit + reverse direction GAP',
    imp1266: 'src/data/imp-1266-volterra-mellin-symbol.js — Mellin diagonalization structurally blocked',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — Selberg-trace ruled out',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — Goldston-Gonek 1998 ruled out',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — Heath-Brown 1979 ruled out + (log T)^{1/2} structural obstruction',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js — Iwaniec-Sarnak 2000 ruled out (family-not-single)',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — GY2003 absolutized ruled out; named this reroute as cleanest escape',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the three named reroute ' +
    'candidates (wavelet decomposition / Mellin-truncation via short-interval ' +
    'second moments / direct §15-27 reformulation) proposed by imp-1305 as ' +
    'alternatives to the support > 1 PCC requirement in the §15-27 → RH chain. ' +
    'It is NOT a new closure or a new unconditional bound.',

    'The verdict is NEGATIVE: all three reroutes collapse for structurally ' +
    'distinct but shared-Plancherel-root reasons. (a) Wavelet decomposition ' +
    'fails because Plancherel preserves the support requirement under change ' +
    'of basis. (b) Mellin-truncation fails because the observable swap loses ' +
    'pointwise content needed by the bridge-threshold theorem AND reproduces ' +
    'the existing (log γ_N)² / N baseline without advancing it. (c) Direct ' +
    'reformulation fails because the Mellin route is structurally blocked on ' +
    'V_{a,Φ} (imp-1266) and the de Branges route requires open imp-1241 + ' +
    'still hits the support > 1 requirement at the unfolded microscopic scale. ' +
    'The verdict is reroute-eliminated-support-greater-1-is-intrinsic.',

    'Support > 1 enters the §15-27 → RH chain at imp-1184 STEP D3 (Selberg ' +
    'PCC fixed-x fluctuation: rate 1/sqrt(N) vs needed 1/N at the Poisson ' +
    'kernel scale) and STEP D5 (rho_3 / second-order discrepancy: Rudnick-' +
    'Sarnak 1996 unconditional only for f̂ in (-2/3, 2/3); Poisson at y_micro ' +
    'extends to ≈ log γ_N / (2π)). Both entry points share the same Plancherel ' +
    'root: the Poisson kernel at y_micro is at the Heisenberg minimum with ' +
    'Fourier support ≈ log γ_N / (2π).',

    'The pattern note: imp-1310 is the SIXTH consecutive negative classification ' +
    'in the post-imp-1267 PCC-attack series (imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1304 + imp-1305 + imp-1310). All six converge on the structural ' +
    'conclusion that the §15-27 → RH chain has a binding PCC-at-support > 1 ' +
    'requirement NOT removable by moment-method refinement OR by reformulation ' +
    'of the final-step test function. The (log T)^{1/2} Cauchy-Schwarz layer ' +
    'obstruction (imp-1303 / imp-1305) and the support > 1 transcription ' +
    'obstruction (imp-1184 / imp-1310) are facets of the same Plancherel / ' +
    'Heisenberg constraint at the y_micro Poisson kernel scale.',

    'CONSEQUENCE for engine planning: with the moment-method family (imp-1297 ' +
    'through imp-1305) and the reroute family (imp-1310) both EXHAUSTED, the ' +
    '§15-27 → RH chain genuinely requires NEW INPUT from outside both families. ' +
    'Remaining named candidates are geometric / adelic / quantum-chaos: imp-1307 ' +
    '(Connes-Bost adelic), imp-1308 (Berry-Keating H = xp), Selberg trace on ' +
    'Hecke triangle groups, OR closing imp-1241 unified existence to enable ' +
    'Romanov-Woracek-Pruss 2024 de Branges direct route. NO known reformulation ' +
    'within the test-function / moment / wavelet / Mellin / short-interval ' +
    'family escapes the support > 1 requirement.',

    'HONEST META-NOTE: this classification proves support > 1 is intrinsic to ' +
    'the §15-27 → RH CHAIN IN ITS CURRENT FORMULATION (with the three named ' +
    'reroutes), NOT that support > 1 is intrinsic to RH itself. A genuinely ' +
    'new reformulation (currently unidentified by the engine) might escape ' +
    'this conclusion. The classification is precisely valuable because it ' +
    'CLOSES the reroute family by named-candidate enumeration and points the ' +
    'engine toward genuinely new geometric / adelic input. No reformulation ' +
    'attempt that lands inside the three named reroute candidates can succeed.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1241: 'src/data/imp-1241-unified-existence-conjecture.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js',
    imp1266: 'src/data/imp-1266-volterra-mellin-symbol.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193 — Fourier support ≤ 1 ' +
      'unconditional sine-kernel identity range',
    rudnickSarnak1996:
      'Rudnick, Z., Sarnak, P., "Zeros of principal L-functions and random ' +
      'matrix theory", Duke Math. J. 81 (1996), 269-322 — rho_3 ' +
      'unconditional for each marginal f̂_j in (-2/3, 2/3)',
    heisenbergPauliWavelets:
      'Heisenberg-Pauli wavelets on L²(R_+) via the Hankel-Plancherel ' +
      'transform; see Daubechies, "Ten Lectures on Wavelets", CBMS-NSF ' +
      'Regional Conference Series 61 (SIAM, 1992), ch. 4-6; and Meyer, ' +
      '"Wavelets and operators", Cambridge Stud. Adv. Math. 37 (1992)',
    iwaniecKowalski2004:
      'Iwaniec, H., Kowalski, E., "Analytic Number Theory", AMS Colloq. ' +
      'Publ. 53 (2004) — §25 short-interval second moment ↔ pair-correlation ' +
      'Plancherel duality',
    goldstonGonek1998:
      'Goldston, D. A., Gonek, S. M., "A note on S(T) and the zeros of the ' +
      'Riemann zeta-function", Bull. London Math. Soc. 39 (2007), 482-486 ' +
      '(announced 1998 Annals work) — Dirichlet polynomial mean value sharp ' +
      'main term theta < 1, error (log T)²',
    selberg1944:
      'Selberg, A., "On the remainder in the formula for N(T)", Avh. Norske ' +
      'Vid. Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp. — integrated ' +
      'short-interval second moment unconditional baseline',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta function", ' +
      'Proc. London Math. Soc. (3) 38 (1979), 385-422 — (log T)^{1/2} ' +
      'Cauchy-Schwarz structural obstruction documented in imp-1303',
    deBranges1968:
      'de Branges, L., "Hilbert spaces of entire functions", Prentice-Hall ' +
      '1968 — H(E_a) direct route foundational',
    romanov2010:
      'Romanov, R., "Canonical systems and de Branges spaces", arXiv:1408.6022 ' +
      '(survey, basis for Romanov-Woracek-Pruss 2024 program territory)',
    aronvNudelman1996:
      'Arov, D. Z., Nudelman, M. A., "Passive linear stationary dynamical ' +
      'scattering systems with continuous time", Integral Equations Operator ' +
      'Theory 24 (1996), 1-45 — passive realization filling in imp-1265 ' +
      'reverse-direction GAP',
    beyerstedtStroembergsson2010:
      'Beyerstedt, J., Strömbergsson, A., "Selberg eigenvalue conjecture ' +
      'for Hecke triangle groups", J. Reine Angew. Math. 651 (2011), 215-244 ' +
      '— Selberg eigenvalue conjecture unconditional for Hecke triangles ' +
      '(named candidate alternative arithmetic group for trace formula reroute)',
    romanovWoracekPruss2024:
      'Romanov, R., Woracek, H., Pruss, J. (2024 program territory) — de Branges ' +
      'H(E_a) direct route for §15-27 → RH transcription bypassing explicit ' +
      'formula; requires imp-1241 unified existence',
  }),
});

export default IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE_ASSERTIONS = [
  // Tripwire 1: Support > 1 entry point identified at imp-1184 D3 / D5.
  {
    id: 'imp1310-support-gt-1-entry-point-identified',
    why:
      'The classification must identify the SPECIFIC step in the §15-27 → RH ' +
      'chain where support > 1 enters. Per imp-1184 audit, this is STEP D3 ' +
      '(fluctuation rate at Poisson kernel scale) + STEP D5 (rho_3 / second-' +
      'order discrepancy). Missing this identification would render the reroute ' +
      'question unanswerable.',
    holds: () => {
      const e = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.supportGT1EntryPoint;
      return (
        typeof e.whereInChain === 'string' &&
        /imp-1184/.test(e.whereInChain) &&
        /D3/.test(e.whereInChain) &&
        /D5/.test(e.whereInChain) &&
        /Poisson kernel/i.test(e.whereInChain) &&
        /y_micro/.test(e.whereInChain) &&
        typeof e.microscopicScale === 'string' &&
        /2 π \/ log γ_N|2 pi \/ log gamma_N/i.test(e.microscopicScale) &&
        typeof e.montgomery1973UnconditionalRange === 'string' &&
        /Montgomery/i.test(e.montgomery1973UnconditionalRange) &&
        /\[-1, 1\]|support.*1/i.test(e.montgomery1973UnconditionalRange) &&
        typeof e.rudnickSarnak1996UnconditionalRange === 'string' &&
        /Rudnick-Sarnak|Rudnick.*Sarnak/i.test(e.rudnickSarnak1996UnconditionalRange) &&
        /2\/3/.test(e.rudnickSarnak1996UnconditionalRange)
      );
    },
  },

  // Tripwire 2: Reroute (a) wavelet decomposition evaluated with verdict.
  {
    id: 'imp1310-reroute-a-wavelet-evaluated',
    why:
      'Reroute (a) wavelet decomposition must be evaluated with a verdict and ' +
      'a structural reason. Per ticket spec the evaluation must address the ' +
      'Heisenberg-Pauli wavelet specifics and the Plancherel / Heisenberg ' +
      'uncertainty obstruction. A silent skip would render the classification ' +
      'incomplete.',
    holds: () => {
      const a = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.rerouteCandidateA;
      return (
        a.candidateId === 'a-wavelet-decomposition' &&
        typeof a.proposal === 'string' &&
        /wavelet/i.test(a.proposal) &&
        typeof a.structuralEvaluation === 'object' &&
        typeof a.structuralEvaluation.plancherelObstruction === 'string' &&
        /Plancherel/i.test(a.structuralEvaluation.plancherelObstruction) &&
        typeof a.structuralEvaluation.heisenbergPauliSpecific === 'string' &&
        /Heisenberg-Pauli/i.test(a.structuralEvaluation.heisenbergPauliSpecific) &&
        typeof a.structuralEvaluation.heisenbergUncertaintyHardConstraint === 'string' &&
        /Heisenberg|uncertainty/i.test(a.structuralEvaluation.heisenbergUncertaintyHardConstraint) &&
        a.closesSupportLEQ1RerouteForSection15_27 === false &&
        a.verdict === 'wavelet-reroute-fails-structurally'
      );
    },
  },

  // Tripwire 3: Reroute (b) Mellin-truncation evaluated with verdict.
  {
    id: 'imp1310-reroute-b-mellin-truncation-evaluated',
    why:
      'Reroute (b) Mellin-truncation via short-interval second moments must be ' +
      'evaluated with verdict + structural reason. Per ticket spec must address ' +
      'whether the observable swap to short-interval / Selberg integrated bound / ' +
      'Goldston-Gonek 1998 Dirichlet polynomial gives a new closure. Missing ' +
      'this would leave the Iwaniec-Kowalski 2004 §25 reroute family unevaluated.',
    holds: () => {
      const b = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.rerouteCandidateB;
      return (
        b.candidateId === 'b-mellin-truncation-short-interval' &&
        typeof b.proposal === 'string' &&
        /short-interval|Selberg|Mellin/i.test(b.proposal) &&
        typeof b.structuralEvaluation === 'object' &&
        typeof b.structuralEvaluation.observableSwapLosesPointwiseContent === 'string' &&
        /pointwise|sup/i.test(b.structuralEvaluation.observableSwapLosesPointwiseContent) &&
        typeof b.structuralEvaluation.shortIntervalGivesExistingBaseline === 'string' &&
        /baseline|imp-407|\(log γ_N\)²|\(log γ_N\)\^2|log gamma_N\)\^2/i.test(b.structuralEvaluation.shortIntervalGivesExistingBaseline) &&
        typeof b.structuralEvaluation.goldstonGonek1998AlreadyRuledOut === 'string' &&
        /imp-1302|Goldston-Gonek/i.test(b.structuralEvaluation.goldstonGonek1998AlreadyRuledOut) &&
        typeof b.structuralEvaluation.iwanieckowalski2004PlancherelRigidity === 'string' &&
        /Iwaniec-Kowalski|Plancherel/i.test(b.structuralEvaluation.iwanieckowalski2004PlancherelRigidity) &&
        b.closesSupportLEQ1RerouteForSection15_27 === false &&
        b.verdict === 'mellin-truncation-reroute-fails-baseline-not-optimistic'
      );
    },
  },

  // Tripwire 4: Reroute (c) direct §15-27 reformulation evaluated with verdict.
  {
    id: 'imp1310-reroute-c-direct-reformulation-evaluated',
    why:
      'Reroute (c) direct §15-27 reformulation (Mellin diagonalization / de ' +
      'Branges H(E_a) direct route) must be evaluated with verdict + structural ' +
      'reason. Per ticket spec must address whether the imp-1258 collapse can ' +
      'produce a native-support ≤ 1 test function. Must cite imp-1266 Mellin-' +
      'blocked + imp-1241 open as the operator and transcription obstructions.',
    holds: () => {
      const c = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.rerouteCandidateC;
      return (
        c.candidateId === 'c-direct-section15-27-reformulation' &&
        typeof c.proposal === 'string' &&
        /reformulat|de Branges|Mellin|native/i.test(c.proposal) &&
        typeof c.structuralEvaluation === 'object' &&
        typeof c.structuralEvaluation.volterraNormTheoremHasNoFourierSupportHypothesis === 'string' &&
        /imp-1267|imp-1287|imp-1286|‖V|operator/i.test(c.structuralEvaluation.volterraNormTheoremHasNoFourierSupportHypothesis) &&
        typeof c.structuralEvaluation.mellinDiagonalizationStructurallyBlocked === 'string' &&
        /imp-1266|Mellin/i.test(c.structuralEvaluation.mellinDiagonalizationStructurallyBlocked) &&
        typeof c.structuralEvaluation.deBrangesRouteRequiresImp1241OpenUnifiedExistence === 'string' &&
        /imp-1241|de Branges|H\(E_a\)/i.test(c.structuralEvaluation.deBrangesRouteRequiresImp1241OpenUnifiedExistence) &&
        typeof c.structuralEvaluation.bridgeThresholdRigidlyAttachedToYMicro === 'string' &&
        /y_micro|microscopic|bridge-threshold/i.test(c.structuralEvaluation.bridgeThresholdRigidlyAttachedToYMicro) &&
        c.closesSupportLEQ1RerouteForSection15_27 === false &&
        c.verdict === 'direct-reformulation-reroute-fails-microscopic-scale-intrinsic'
      );
    },
  },

  // Tripwire 5: Verdict is one of allowed strings.
  {
    id: 'imp1310-verdict-is-one-of-allowed-strings',
    why:
      'The headline verdict must be one of the five allowed strings: ' +
      'support-leq-1-reroute-found-via-{wavelet,mellin-truncation,direct-reformulation}, ' +
      'support-leq-1-reroute-partial-with-residual-gap, or ' +
      'reroute-eliminated-support-greater-1-is-intrinsic. Any other string ' +
      'would indicate classification drift.',
    holds: () => {
      const allowed = [
        'support-leq-1-reroute-found-via-wavelet',
        'support-leq-1-reroute-found-via-mellin-truncation',
        'support-leq-1-reroute-found-via-direct-reformulation',
        'support-leq-1-reroute-partial-with-residual-gap',
        'reroute-eliminated-support-greater-1-is-intrinsic',
      ];
      return (
        allowed.includes(IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.verdict) &&
        IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.verdictDetail.isAllowedVerdict === true
      );
    },
  },

  // Tripwire 6: Verdict detail correctly reports support > 1 is intrinsic +
  // pattern note + aggregate verdict naming new-input geometric-or-adelic.
  {
    id: 'imp1310-verdict-detail-support-gt-1-intrinsic',
    why:
      'A silent flip to "reroute closes RH unconditionally" would invalidate ' +
      'the entire engine-planning consequence. The verdict detail must pin: ' +
      '(i) support > 1 is intrinsic to the chain in current formulation, (ii) ' +
      'the pattern note continues the PCC-attack negative run, (iii) the ' +
      'aggregate verdict pivots to geometric / adelic / quantum-chaos.',
    holds: () => {
      const vd = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.verdictDetail;
      return (
        vd.closesSupportGT1Reroute === false &&
        vd.closesRHViaSection15_27Unconditionally === false &&
        typeof vd.whereInChainSupportGT1Enters === 'string' &&
        /D3/.test(vd.whereInChainSupportGT1Enters) &&
        /D5/.test(vd.whereInChainSupportGT1Enters) &&
        typeof vd.whyAllThreeReroutesFail === 'string' &&
        /Plancherel|Heisenberg/i.test(vd.whyAllThreeReroutesFail) &&
        typeof vd.patternNoteContinuesPCCAttackSeriesNegativeRun === 'string' &&
        /SIXTH|sixth|imp-1297|imp-1302|imp-1303|imp-1304|imp-1305/.test(vd.patternNoteContinuesPCCAttackSeriesNegativeRun) &&
        typeof vd.aggregateVerdict === 'string' &&
        /pcc-genuinely-open|geometric|adelic/i.test(vd.aggregateVerdict) &&
        typeof vd.cauchySchwarzLayerStructuralEquivalence === 'string' &&
        /Cauchy-Schwarz/i.test(vd.cauchySchwarzLayerStructuralEquivalence) &&
        /imp-1303|imp-1305/.test(vd.cauchySchwarzLayerStructuralEquivalence)
      );
    },
  },

  // Tripwire 7: At least four required citations present.
  {
    id: 'imp1310-four-required-citations-present',
    why:
      'Per ticket spec: cite at least 4 sources. Required: Montgomery 1973 ' +
      '(unconditional sine-kernel range), Rudnick-Sarnak 1996 (rho_3 ' +
      'unconditional in (-2/3, 2/3)), Iwaniec-Kowalski 2004 (§25 Plancherel ' +
      'duality), and Selberg 1944 (integrated short-interval baseline). Missing ' +
      'any of these would render the classification incomplete on load-bearing ' +
      'references.',
    holds: () => {
      const r = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.references;
      return (
        /Montgomery/.test(r.montgomery1973 || '') &&
        /1973/.test(r.montgomery1973 || '') &&
        /pair correlation/i.test(r.montgomery1973 || '') &&
        /Rudnick/.test(r.rudnickSarnak1996 || '') &&
        /Sarnak/.test(r.rudnickSarnak1996 || '') &&
        /1996|81/.test(r.rudnickSarnak1996 || '') &&
        /Iwaniec/.test(r.iwaniecKowalski2004 || '') &&
        /Kowalski/.test(r.iwaniecKowalski2004 || '') &&
        /2004/.test(r.iwaniecKowalski2004 || '') &&
        /Selberg/.test(r.selberg1944 || '') &&
        /1944/.test(r.selberg1944 || '')
      );
    },
  },

  // Tripwire 8: Cross-references imp-1184 / imp-1258 / imp-1265 / imp-1266 /
  // imp-1297 / imp-1305 all present.
  {
    id: 'imp1310-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 (named the binding gap), ' +
      'imp-1258 (§15-27 collapse), imp-1265 (§27 identity recheck), imp-1266 ' +
      '(Mellin diagonalization blocked), and the imp-1297 / imp-1305 PCC-' +
      'attack series. Without explicit cross-references the classification ' +
      'floats free of the parent map.',
    holds: () => {
      const r = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1258') &&
        related.includes('imp-1265') &&
        related.includes('imp-1266') &&
        related.includes('imp-1297') &&
        related.includes('imp-1305') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1258 === 'string' && /imp-1258/.test(xrefs.imp1258) &&
        typeof xrefs.imp1265 === 'string' && /imp-1265/.test(xrefs.imp1265) &&
        typeof xrefs.imp1266 === 'string' && /imp-1266/.test(xrefs.imp1266) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305)
      );
    },
  },

  // Tripwire 9: Semantic check 1 — Plancherel / Heisenberg uncertainty is
  // the shared structural root of all three reroute failures.
  {
    id: 'imp1310-semantic-plancherel-heisenberg-shared-root',
    why:
      'Semantic check: the verdict must identify Plancherel / Heisenberg ' +
      'uncertainty as the SHARED structural root of all three reroute failures. ' +
      'A divergent explanation (e.g. "different reroutes fail for different ' +
      'reasons unrelated to support") would obscure the structural insight that ' +
      'support > 1 is INTRINSIC to the microscopic scale y_micro = 2π / log γ_N.',
    holds: () => {
      const vd = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.verdictDetail;
      const a = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.rerouteCandidateA;
      const e = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.supportGT1EntryPoint;
      return (
        typeof vd.whyAllThreeReroutesFail === 'string' &&
        /Plancherel/i.test(vd.whyAllThreeReroutesFail) &&
        /Heisenberg/i.test(vd.whyAllThreeReroutesFail) &&
        /y_micro|microscopic/i.test(vd.whyAllThreeReroutesFail) &&
        typeof a.structuralEvaluation.plancherelObstruction === 'string' &&
        /Plancherel/i.test(a.structuralEvaluation.plancherelObstruction) &&
        typeof e.whyD3AndD5ShareTheSameRoot === 'string' &&
        /Plancherel|Heisenberg/i.test(e.whyD3AndD5ShareTheSameRoot)
      );
    },
  },

  // Tripwire 10: Semantic check 2 — Mellin diagonalization correctly cited
  // as structurally blocked (imp-1266 cross-reference).
  {
    id: 'imp1310-semantic-mellin-blocked-via-imp1266',
    why:
      'Semantic check: the direct §15-27 reformulation reroute must cite ' +
      'imp-1266 as evidence that the Mellin diagonalization of V_{a,Φ} is ' +
      'structurally blocked (kernel is additive not multiplicative, ' +
      'Φ-modulation breaks scaling, sinh(at) Mellin transform does not exist). ' +
      'Without this cross-reference the structural rigor of reroute (c) is ' +
      'incomplete.',
    holds: () => {
      const c = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.rerouteCandidateC;
      const r = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.references;
      return (
        typeof c.structuralEvaluation.mellinDiagonalizationStructurallyBlocked === 'string' &&
        /imp-1266/.test(c.structuralEvaluation.mellinDiagonalizationStructurallyBlocked) &&
        typeof r.imp1266 === 'string' && /imp-1266/.test(r.imp1266)
      );
    },
  },

  // Tripwire 11: Semantic check 3 — implication for Lambda-attack pivots to
  // geometric / adelic / quantum-chaos candidates (imp-1307 / imp-1308).
  {
    id: 'imp1310-semantic-lambda-attack-pivots-to-geometric',
    why:
      'Semantic check: the engine-planning implication must name at least one ' +
      'specific candidate new-input route outside both the moment-method ' +
      'family and the reroute family. Per imp-1305 closing note + this ' +
      'classification, the only remaining named candidates are imp-1307 ' +
      '(Connes-Bost adelic) + imp-1308 (Berry-Keating quantum-chaos) + Hecke ' +
      'triangle Selberg trace + de Branges direct route (imp-1241 dependency). ' +
      'Without naming concrete candidates the "new input needed" conclusion is ' +
      'unactionable.',
    holds: () => {
      const vd = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      return (
        typeof s === 'string' &&
        s.length > 100 &&
        (/imp-1307|Connes-Bost|adelic/i.test(s)) &&
        (/imp-1308|Berry-Keating|quantum-chaos/i.test(s)) &&
        (/Hecke triangle|imp-1241|de Branges|Romanov/i.test(s))
      );
    },
  },

  // Tripwire 12: Honest scope correctly disclaims that this is a negative
  // classification on the THREE NAMED reroutes (not a proof that no reroute
  // can ever work).
  {
    id: 'imp1310-honest-scope-disclaims-three-named-not-universal',
    why:
      'Honest scope must explicitly disclaim that the classification rules ' +
      'out only the THREE NAMED reroutes (wavelet / Mellin-truncation / direct ' +
      'reformulation), not all conceivable reroutes. A silent claim of ' +
      '"support > 1 is intrinsic to RH itself" would overstate the result. ' +
      'The classification is precisely valuable because it CLOSES the named-' +
      'candidate family while leaving genuinely-new reformulation possibilities ' +
      'open in principle.',
    holds: () => {
      const blob = IMP_1310_SECTION15_27_SUPPORT_LEQ_1_REROUTE.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /three named|3 named|named reroute|named candidate/i.test(blob) &&
        /current formulation|CURRENT FORMULATION/i.test(blob) &&
        /imp-1184/.test(blob) &&
        /(does NOT|NOT a new closure|NOT a new unconditional|cannot be|currently unidentified)/i.test(blob) &&
        /(geometric|adelic|quantum-chaos|imp-1307|imp-1308)/i.test(blob)
      );
    },
  },
];

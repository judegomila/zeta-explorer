/**
 * @module data/imp-2436-sympow-volterra-functoriality-2026-06
 * @fileoverview imp-2436 (Wave-2 fan-out, follow-on to imp-2357) -- analytic
 * investigation of whether the Volterra contraction property (the imp-1258
 * collapse target ||V_{a,Phi}|| <= 1, and its empirical Cauchy-Schwarz margin
 * = HS_bound/op_norm < 2 diagnostic) is preserved under the symmetric-power
 * functorial transfer f -> sym^m f. Conclusion: a DOCUMENTED OBSTRUCTION plus a
 * CONDITIONAL preservation argument. The transfer keeps the kernel SCALAR (the
 * sym^m gamma factor is a PRODUCT of complex gammas whose inverse Mellin is a
 * single Meijer-G / generalised K-Bessel kernel, not a matrix), but the analytic
 * conductor grows like log Q_m ~ (k-1) (m/2) log m, translating the kernel peak
 * to u* ~ (1/2) log Q_m where the sinh^2(a u) weight in J_a is exponentially
 * large (~ Q_m^a). At FIXED a the contraction is therefore NOT manifestly
 * functorial; the imp-2357 data (margin creeps UP with conductor) and imp-2421
 * (degree-4 lopsided Rankin-Selberg already touches 2.00) are the empirical
 * warning signs. Contraction IS recovered if the shift is conductor-normalised
 * a_m ~ a_0 / log Q_m, reducing the open question to uniform-in-m control of the
 * sym^m Rankin-Selberg second moment. ANALYTIC ANALYSIS, no proof claim.
 * @see imp-2357
 * @see imp-2421
 * @see imp-1258
 * @see imp-1298
 * @see data/imp-1267-volterra-hs-bound.js
 */
// imp-2436 -- is the Volterra contraction functorial under sym^m?
//
// SETUP (the object whose functoriality is in question)
// -----------------------------------------------------
// For a self-dual degree-d L-function with completed form
//     Lambda(s) = Q^{s/2} gamma(s) L(s) = int_0^inf Phi(w) w^{s-1} dw,
// the twin-ladder Volterra operator (imp-1258 / imp-1267) is
//     V_{a,Phi} f(x) = int_0^x Phi(x) Phi(y) sinh(a (x-y)) f(y) dy,
//     ||V||_op <= ||V||_HS <= sqrt(I_0 J_a),
//     I_0 = int_0^inf Phi(u)^2 du,   J_a = int_0^inf Phi(u)^2 sinh^2(a u) du,
// with Phi(u) = e^{u/2} sum_{n>=1} lambda(n) G( n e^u / sqrt(Q) ), where G is the
// inverse Mellin transform of the gamma factor gamma(s) and Q the conductor.
// Two diagnostics: (a) the contraction ||V|| <= 1 (the imp-1258 collapse target),
// (b) the Cauchy-Schwarz slack margin = HS_bound / op_norm, empirically < 2
// (imp-1267 ~1.58-2.57, imp-1317 ~1.71, imp-2357 ~1.52-1.55, imp-2421 ~1.70-2.00).
//
// WHAT sym^m DOES TO EACH INGREDIENT (f holomorphic, level 1, weight k; kappa = k-1)
// ---------------------------------------------------------------------------------
// By Newton-Thorne (2021) sym^m f is cuspidal automorphic on GL(m+1)/Q for all m,
// so Lambda(s, sym^m f) exists with a self-dual functional equation s -> 1-s.
//   * Dirichlet coefficients: lambda_{sym^m}(p) = U_m(cos theta_p) (Chebyshev
//     2nd kind in the Satake angle); |lambda_{sym^m}(p)| <= m+1; multiplicative.
//   * Conductor (finite part): N(sym^m f) = 1 for level-1 f (sym^m of an
//     unramified rep is unramified at every prime). So the conductor is PURELY
//     ARCHIMEDEAN -- the analytic conductor.
//   * Gamma factor: the archimedean Langlands parameters are
//        mu_j = (m - 2j) * kappa/2,   j = 0, ..., m,
//     i.e. { m kappa/2, (m-2) kappa/2, ..., -m kappa/2 }. They pair (mu, -mu):
//        m ODD  : gamma(s, sym^m f) = prod_{i=1}^{(m+1)/2} Gamma_C( s + (2i-1) kappa/2 ),
//        m EVEN : gamma(s, sym^m f) = Gamma_R(s + eps) * prod_{i=1}^{m/2} Gamma_C(s + i kappa),
//     with Gamma_C(s) = 2 (2 pi)^{-s} Gamma(s), Gamma_R(s) = pi^{-s/2} Gamma(s/2),
//     eps in {0,1}. Degree = m+1 as required.
//
// CONSEQUENCE 1 -- THE KERNEL STAYS SCALAR (settles the imp-2357 sub-gap (ii) worry).
//   gamma(s, sym^m f) is a PRODUCT of gamma factors, so its inverse Mellin G is a
//   single MULTIPLE Mellin-Barnes integral = a Meijer-G function G^{p,0}_{0,p}, a
//   scalar positive kernel on (0, inf) (e.g. two complex gammas collapse to one
//   K-Bessel, exactly the imp-2421 degree-4 reduction y^m K_nu(4 pi sqrt y)).
//   The "matrix-Phi" of imp-1298 arises only from a DIRECT SUM at infinity (several
//   archimedean places, e.g. real quadratic fields); a single cuspidal sym^m f is
//   one place, hence Phi_{sym^m} is scalar. The imp-1267 scalar HS machinery applies.
//
// CONSEQUENCE 2 -- THE ANALYTIC CONDUCTOR GROWS SUPER-EXPONENTIALLY.
//   Q_m := analytic conductor(sym^m f) ~ prod_{j=0}^{m} (1 + |mu_j|)
//        ~ (kappa/2)^{m+1} prod_{j} |m - 2j|  ~ exp( (kappa) (m/2) log m + O(m) ),
//   so log Q_m ~ (k-1)(m/2) log m -> infinity. The kernel Phi_{sym^m}(u) (peaked,
//   single-Gamma model, where it decays like e^{u/2} exp(-c e^u / sqrt(Q_m)) ) has
//   its PEAK at u* with d/du[ u/2 - c e^u/sqrt(Q_m) ] = 0, i.e.
//        u* ~ (1/2) log Q_m  -> infinity with m.
//   The functional-equation symmetry sends the kernel mass out to u ~ (1/2) log Q_m.
//
// THE OBSTRUCTION (fixed a).
//   J_a = int Phi^2 sinh^2(a u) du is dominated near the kernel peak u*, where
//        sinh^2(a u*) ~ (1/4) e^{2 a u*} ~ (1/4) Q_m^{a}.
//   Hence J_a / I_0 ~ Q_m^{a} and the HS bound sqrt(I_0 J_a) ~ I_0 * Q_m^{a/2}; since
//   the margin HS/op is scale-invariant (Phi -> c Phi) but NOT translation-invariant,
//   the operator norm itself inherits the conductor amplification:
//        ||V_{a, sym^m f}||_op  grows with Q_m at fixed a.
//   This is EXACTLY the imp-2357 empirical trend made structural: there op_norm rose
//   monotonically with |D| and the margin crept 1.522 -> 1.554 as the conductor grew
//   |D| = 3 -> 20; imp-2421 then saw the degree-4 lopsided Rankin-Selberg margin reach
//   2.00 and edge just over. Extrapolated to sym^m with Q_m -> inf, there is NO
//   uniform-in-m bound: at fixed a the contraction ||V|| <= 1 is NOT manifestly
//   preserved -- conductor growth is the documented obstruction the ticket anticipated.
//
// CANDIDATE PRESERVATION ARGUMENT (conductor-normalised shift).
//   The obstruction is a TRANSLATION artefact: shifting u -> u - (1/2) log Q_m
//   (unfolding by the analytic conductor) re-centres the kernel and removes the
//   Q_m^{a} factor. Equivalently, measure the twin-ladder shift in conductor units,
//        a_m := a_0 / log Q_m,    so that  a_m u* ~ a_0 / 2 = O(1).
//   Under this normalisation sinh^2(a_m u*) = O(1), J_a / I_0 = O(1), and the
//   contraction reduces to the scale-AND-translation-invariant margin staying bounded.
//   The margin is then governed by the SHAPE of Phi_{sym^m}, i.e. by the smoothing
//   from the extra Gamma_C factors (which tends to TIGHTEN the bound, cf. the
//   single K-Bessel of imp-2421) competing against the spreading of the coefficient
//   mass sum lambda_{sym^m}(n)^2.
//
// NAMED GAPS (honest partial -- delivers BOTH an obstruction and a conditional route).
//   (i)  imp-2436-sympow-RS-residue: a uniform-in-m margin bound requires controlling
//        the sym^m Rankin-Selberg second moment sum_{n<=x} lambda_{sym^m}(n)^2 ~ c_m x,
//        c_m = Res_{s=1} L(s, sym^m f x sym^m f) = Res L(s, prod_{j} sym^{2j} f); c_m
//        grows with m through the L(1, sym^{2j} f) factors, and an effective upper
//        bound on c_m (polynomial in m, say) is the missing analytic input.
//   (ii) imp-2436-twin-ladder-shift-convention: whether the project twin-ladder
//        normalisation holds a FIXED (obstruction bites) or implicitly conductor-
//        normalises a (preservation route) is a definitional question about the
//        construction in research-inputs/twin_ladder_consolidated_v52.pdf; the two
//        readings give opposite verdicts and must be pinned down from the source.
//
// VERDICT: 'sympow-contraction-conditional' -- NOT manifestly functorial at fixed a
//   (conductor growth defeats the fixed-normalisation bound), but preserved under a
//   conductor-normalised shift MODULO uniform sym^m Rankin-Selberg second-moment
//   control. No proof claim; analytic structural analysis only.

export const SYMPOW_VOLTERRA_FUNCTORIALITY = Object.freeze({
  ticket: "imp-2436",
  followOnTo: "imp-2357",
  evidenceClass: "analytic-structural-conditional",
  question: "Is the Volterra contraction ||V_{a,Phi}|| <= 1 (margin = HS_bound/op_norm < 2) preserved under f -> sym^m f?",
  standingInput: "Newton-Thorne 2021: sym^m f is cuspidal automorphic on GL(m+1) for all m (level-1 holomorphic f), so Lambda(s, sym^m f) and its s->1-s functional equation exist.",
  kernelStructure: Object.freeze({
    scalar: true,
    reason: "gamma(s, sym^m f) is a PRODUCT of gamma factors; its inverse Mellin is a single Meijer-G^{p,0}_{0,p} (generalised K-Bessel), not a matrix. A single cuspidal rep is one archimedean place, so no direct-sum / matrix-Phi (contrast imp-1298 real-quadratic case).",
    gammaFactorOdd_m: "prod_{i=1}^{(m+1)/2} Gamma_C(s + (2i-1) kappa/2),  kappa = k-1",
    gammaFactorEven_m: "Gamma_R(s + eps) * prod_{i=1}^{m/2} Gamma_C(s + i kappa)",
    settlesSubGap: "imp-2357 sub-gap (ii): the sym^m kernel is scalar, not matrix.",
  }),
  conductor: Object.freeze({
    finitePart: "N(sym^m f) = 1 for level-1 f (unramified everywhere).",
    analyticConductor: "Q_m ~ prod_{j=0}^m (1 + |mu_j|), mu_j = (m-2j) kappa/2",
    growth: "log Q_m ~ (k-1)(m/2) log m -> infinity",
    kernelPeak: "u* ~ (1/2) log Q_m -> infinity (kernel mass translated out the u-axis)",
  }),
  obstruction: Object.freeze({
    mechanism: "J_a = int Phi^2 sinh^2(a u) du is dominated at u* ~ (1/2) log Q_m, where sinh^2(a u*) ~ (1/4) Q_m^a; the margin is scale-invariant but NOT translation-invariant, so ||V||_op inherits a Q_m^{a/2} amplification.",
    fixedA_verdict: "At fixed a > 0, ||V_{a, sym^m f}|| is NOT uniformly bounded as m -> infinity: contraction is not manifestly functorial.",
    empiricalWarningSigns: Object.freeze({
      imp2357: "margin rose monotonically with conductor: 1.522 (|D|=3) -> 1.554 (|D|=20).",
      imp2421: "degree-4 lopsided Rankin-Selberg margin reached 2.00 and edged just over (F20 x Delta).",
    }),
  }),
  preservationRoute: Object.freeze({
    fix: "conductor-normalised shift a_m = a_0 / log Q_m (unfold u -> u - (1/2) log Q_m), giving a_m u* = O(1) and J_a/I_0 = O(1).",
    reducesTo: "the scale-and-translation-invariant margin staying < 2 uniformly in m, governed by Phi_{sym^m} SHAPE (extra Gamma_C factors smooth/tighten vs. coefficient mass spread).",
  }),
  namedGaps: Object.freeze({
    "imp-2436-sympow-RS-residue": "uniform-in-m control of c_m = Res_{s=1} L(s, sym^m f x sym^m f) = Res L(s, prod_j sym^{2j} f); grows through L(1, sym^{2j} f) factors -- needs an effective (e.g. polynomial-in-m) upper bound.",
    "imp-2436-twin-ladder-shift-convention": "whether the v52 twin-ladder construction holds a fixed (obstruction) or conductor-normalises a (preservation) -- a definitional question to resolve from research-inputs/twin_ladder_consolidated_v52.pdf.",
  }),
  verdict: "sympow-contraction-conditional",
  headline: "Volterra contraction is NOT manifestly sym^m-functorial at fixed a (analytic-conductor growth Q_m^{a/2} defeats the fixed-normalisation bound), but IS preserved under a conductor-normalised shift a_m ~ a_0/log Q_m, modulo uniform sym^m Rankin-Selberg second-moment control.",
  proofClaim: false,
});

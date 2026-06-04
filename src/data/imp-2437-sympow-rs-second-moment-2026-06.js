/**
 * @module data/imp-2437-sympow-rs-second-moment-2026-06
 * @fileoverview imp-2437 (Wave-3 follow-on to imp-2436) -- quantify the
 * uniform-in-m sym^m Rankin-Selberg second-moment input that the imp-2436
 * conductor-normalised preservation route depends on. imp-2436 reduced the
 * functoriality of the Volterra contraction under f -> sym^m f to a named
 * sub-gap (imp-2436-sympow-RS-residue): uniform-in-m control of the residue
 * c_m = Res_{s=1} L(s, sym^m f x sym^m f). This file makes that object EXACT,
 * states the precise threshold the preservation route needs, cites the best
 * known per-factor inputs (GRH vs unconditional), and reports a direct
 * numerical test on Delta (weight 12). RESULT: a clean reduction-to-known-input
 * -- the route closes CONDITIONALLY on a GRH-order per-factor bound
 * log L(1,sym^{2j}f) = O(log log Q(sym^{2j}f)) (confirmed empirically for Delta
 * up to sym^48), and leaves a DOCUMENTED RESIDUAL GAP unconditionally (the best
 * known zero-free-region bound is too weak by a factor ~ m/log m). No proof claim.
 * @see imp-2436
 * @see imp-2357
 * @see imp-2421
 * @see imp-1258
 * @see data/imp-2436-sympow-volterra-functoriality-2026-06.js
 */
// imp-2437 -- the sym^m Rankin-Selberg second-moment input to the imp-2436
// conductor-normalised preservation route.
//
// THE OBJECT, MADE EXACT (the residue identity)
// ---------------------------------------------
// The imp-2436 preservation route needs uniform-in-m control of the sym^m
// Rankin-Selberg second moment
//     sum_{n<=x} lambda_{sym^m}(n)^2 ~ c_m * x,   c_m = Res_{s=1} L(s, sym^m f x sym^m f).
// Because f is holomorphic level 1 (so sym^m f is self-dual and unramified) the
// GL(m+1) x GL(m+1) tensor decomposes by Clebsch-Gordan into an ISOBARIC SUM of
// symmetric powers:
//     sym^m f (x) sym^m f  =  +_{j=0}^{m} sym^{2j} f,     hence
//     L(s, sym^m f x sym^m f) = prod_{j=0}^{m} L(s, sym^{2j} f).
// The j=0 factor is sym^0 f = zeta(s), the ONLY factor with a pole at s=1 (simple,
// residue 1); every j>=1 factor is the L-function of a cuspidal rep (Newton-Thorne
// 2021), holomorphic and NON-ZERO at s=1 (Jacquet-Shalika non-vanishing on Re s=1).
// Therefore the residue is the EXACT finite product
//     c_m = prod_{j=1}^{m} L(1, sym^{2j} f).                     (RESIDUE IDENTITY)
// This pins the imp-2436-sympow-RS-residue object: c_m is NOT a single L-value but a
// growing PRODUCT of m central-edge symmetric-power L-values.
//
// THE THRESHOLD THE PRESERVATION ROUTE NEEDS
// ------------------------------------------
// The conductor-normalised shift a_m = a_0/log Q_m removes the imp-2436 TRANSLATION
// amplification Q_m^{a/2}. What remains is the SCALE: c_m = int Phi_{sym^m}^2 du is the
// normalisation of the kernel, and the unfolding stays "tight" (a fixed O(1)-window
// around the re-centred peak captures an O(1) fraction of the mass) only if the
// second-moment budget does not outrun the conductor budget. The clean sufficient
// threshold is
//     log c_m = O(log Q_m)        (equivalently c_m is polynomial in the conductor),
// so the SAME conductor unit log Q_m that fixes the translation also bounds the
// second-moment normalisation. log Q_m ~ m log m (archimedean parameters
// mu_j=(m-2j)kappa/2, kappa=k-1), so the threshold is log c_m = O(m log m).
//
// THE AVAILABLE PER-FACTOR INPUTS (and what they give for log c_m)
// ---------------------------------------------------------------
// log c_m = sum_{j=1}^{m} log L(1, sym^{2j} f), and log Q(sym^{2j} f) ~ 2j log(2j).
//  * CONDITIONAL (GRH for each sym^{2j} f): the Littlewood / Lamzouri extreme-value
//    bound log L(1, pi) <= (1+o(1)) log log Q(pi) gives
//        log L(1, sym^{2j} f) = O(log log Q(sym^{2j} f)) = O(log j),
//    so log c_m = O( sum_{j<=m} log j ) = O(m log m) = O(log Q_m). THRESHOLD MET --
//    the ratio log c_m/log Q_m tends to a finite constant, the route closes.
//  * UNCONDITIONAL: the best general estimate is the de la Vallee Poussin / Landau
//    zero-free-region bound log L(1, pi) << log Q(pi)/log log Q(pi); for sym^{2j} f
//    that is ~ (2j log 2j)/log(2j log 2j) = O(j), so
//        log c_m = O( sum_{j<=m} j ) = O(m^2)  >>  log Q_m ~ m log m.
//    THRESHOLD MISSED by a factor ~ m/log m: the unconditional input is NOT strong
//    enough; a genuine residual gap remains.
// The only known way to UPGRADE the unconditional side is an automorphic-large-sieve /
// second-moment-on-average bound that beats the worst-case zero-free region for the
// symmetric-power family, OR a uniform-in-m subconvexity input -- neither is currently
// available uniformly in m. So the reduction is: imp-2436 preservation <= a uniform
// per-factor bound log L(1,sym^{2j}f) = o(j), and ideally = O(log j).
//
// NUMERICAL TEST (Delta, weight 12; scripts/compute-imp2437-sympow-rs-residue.mjs)
// --------------------------------------------------------------------------------
// We evaluate the actual residue product for Delta directly from its Satake angles
// theta_p (tau(p) exact via eta^24), through the convergent prime-power sum
//     log L(1, sym^n f) = sum_p sum_{r>=1} (1/(r p^r)) * U_n(cos(r theta_p)),
//     U_n(cos y) = sin((n+1)y)/sin(y)   (= trace of sym^n; Chebyshev 2nd kind).
// Convergence verified: the per-factor values are stable to 4 decimals across prime
// bounds 2e4 / 6e4 / 2e5 (the {U_n} are orthonormal under Sato-Tate, so the tail
// variance is ~ sum_{p>P} 1/p^2 -- tiny, uniformly in n). We then form the cumulative
// log c_m and compare three ratios against log Q_m (computed exactly from the
// archimedean parameters): the EMPIRICAL ratio, and the two MODEL upper bounds got by
// capping each factor at the GRH value log log Q(sym^{2j}) and at the unconditional
// value log Q(sym^{2j})/log log Q(sym^{2j}). FINDINGS (m=1..24, i.e. sym^2..sym^48):
//   - EMPIRICAL: the per-factor log L(1,sym^{2j} Delta) OSCILLATE IN SIGN with bounded
//     magnitude (all in [-1.28, +1.05] up to sym^48), so they nearly cancel: log c_m
//     stays in [-1.2, +0.2] and the ratio log c_m/log Q_m ~ 0 (|.| < 0.12, no drift).
//     Delta sits comfortably inside the GRH regime -- the residue is DOMINATED by the
//     conductor budget, route unobstructed.
//   - GRH MODEL: the ratio FLATTENS toward ~1.06 (drift 0.0036/step, decelerating) --
//     bounded, confirming the GRH per-factor bound is strong enough.
//   - UNCOND MODEL: the ratio GROWS 0.83 -> 5.44 (sustained drift 0.166/step) --
//     unbounded, confirming the unconditional bound is NOT strong enough.
//
// VERDICT: 'sympow-RS-residue-reduces-to-GRH-order-per-factor-bound'.
//   imp-2436-sympow-RS-residue is reduced to a clean known input: a uniform-in-m bound
//   log L(1, sym^{2j} f) = o(j) (ideally O(log j)) on the symmetric-power L-values at
//   the edge. Conditionally on GRH this holds and the preservation route closes; the
//   Delta numerics confirm the residue product behaves at GRH order in practice. The
//   RESIDUAL GAP is exactly the unconditional per-factor bound (current best O(j) is a
//   factor ~ m/log m too weak). No proof claim; analytic reduction + honest numerics.

export const SYMPOW_RS_SECOND_MOMENT = Object.freeze({
  ticket: "imp-2437",
  followOnTo: "imp-2436",
  closesSubGap: "imp-2436-sympow-RS-residue",
  evidenceClass: "analytic-reduction-plus-numerics",
  question: "Is the available uniform-in-m sym^m Rankin-Selberg second-moment bound c_m = Res_{s=1} L(s, sym^m f x sym^m f) strong enough to keep the imp-2436 conductor-normalised margin bounded as m grows?",
  residueIdentity: Object.freeze({
    statement: "c_m = Res_{s=1} L(s, sym^m f x sym^m f) = prod_{j=1}^{m} L(1, sym^{2j} f).",
    derivation: "sym^m f (x) sym^m f = isobaric sum +_{j=0}^m sym^{2j} f (Clebsch-Gordan for GL(m+1) self-dual); only j=0 (= zeta) has a pole at s=1 (simple, residue 1), every j>=1 factor is cuspidal (Newton-Thorne 2021) and non-zero at s=1 (Jacquet-Shalika).",
    consequence: "c_m is a GROWING PRODUCT of m symmetric-power L-values at the edge s=1, not a single bounded L-value.",
  }),
  threshold: Object.freeze({
    needed: "log c_m = O(log Q_m), i.e. c_m polynomial in the analytic conductor Q_m.",
    why: "the conductor-normalised shift a_m = a_0/log Q_m removes the translation amplification Q_m^{a/2}; the residual requirement is that the second-moment normalisation log c_m not outrun the SAME conductor unit log Q_m (so the unfolding stays tight).",
    conductorGrowth: "log Q_m ~ m log m, so the threshold is log c_m = O(m log m).",
  }),
  availableInputs: Object.freeze({
    perFactorConductor: "log Q(sym^{2j} f) ~ 2j log(2j).",
    grh: Object.freeze({
      bound: "log L(1, sym^{2j} f) <= (1+o(1)) log log Q(sym^{2j} f) = O(log j) (Littlewood/Lamzouri extreme value at s=1).",
      gives: "log c_m = O(sum_{j<=m} log j) = O(m log m) = O(log Q_m) -- THRESHOLD MET, route closes.",
    }),
    unconditional: Object.freeze({
      bound: "log L(1, sym^{2j} f) << log Q(sym^{2j} f)/log log Q(sym^{2j} f) = O(j) (de la Vallee Poussin / Landau zero-free region).",
      gives: "log c_m = O(sum_{j<=m} j) = O(m^2) >> log Q_m -- THRESHOLD MISSED by a factor ~ m/log m, residual gap.",
    }),
    upgradePath: "the residual gap closes given a uniform-in-m per-factor bound log L(1,sym^{2j}f) = o(j) (ideally O(log j)) -- e.g. an automorphic-large-sieve second-moment-on-average estimate or uniform subconvexity for the symmetric-power family, neither currently available uniformly in m.",
  }),
  numerics: Object.freeze({
    script: "scripts/compute-imp2437-sympow-rs-residue.mjs",
    form: "Delta (weight 12)",
    method: "log L(1,sym^n f) = sum_p sum_{r=1}^{5} (1/(r p^r)) U_n(cos(r theta_p)), U_n(cos y)=sin((n+1)y)/sin y; tau(p) exact via eta^24; primes to 6e4.",
    convergence: "per-factor values stable to 4 decimals across prime bounds 2e4/6e4/2e5 ({U_n} orthonormal under Sato-Tate => tail variance ~ sum_{p>P} 1/p^2, tiny uniformly in n).",
    range: "m = 1..24 (sym^2 .. sym^48)",
    perFactor_logL_sym2j: Object.freeze([
      -0.459811, 0.101651, 0.42789, -1.277151, 1.052893, -0.643782, 0.747172,
      -0.150732, -0.666088, 0.63232, -0.864101, 0.905302, 0.182631, -0.298155,
      0.179631, -0.507217, 0.39832, 0.331908, -0.181531, 0.256037, -0.17785,
      -0.086783, -0.226936, 0.417005,
    ]),
    // compact table at m = 1,4,8,12,16,20,24
    sampleRows: Object.freeze([
      Object.freeze({ m: 1, sym: 2, log_c_m: -0.4598, log_Q_m: 3.744, ratio_empirical: -0.1228, ratio_GRHmodel: 0.4283, ratio_uncondModel: 0.8280 }),
      Object.freeze({ m: 4, sym: 8, log_c_m: -1.2074, log_Q_m: 11.241, ratio_empirical: -0.1074, ratio_GRHmodel: 0.9060, ratio_uncondModel: 1.9571 }),
      Object.freeze({ m: 8, sym: 16, log_c_m: -0.2019, log_Q_m: 25.907, ratio_empirical: -0.0078, ratio_GRHmodel: 0.9837, ratio_uncondModel: 2.7249 }),
      Object.freeze({ m: 12, sym: 24, log_c_m: -0.1944, log_Q_m: 42.367, ratio_empirical: -0.0046, ratio_GRHmodel: 1.0186, ratio_uncondModel: 3.4474 }),
      Object.freeze({ m: 16, sym: 32, log_c_m: -0.6375, log_Q_m: 60.058, ratio_empirical: -0.0106, ratio_GRHmodel: 1.0389, ratio_uncondModel: 4.1365 }),
      Object.freeze({ m: 20, sym: 40, log_c_m: 0.1672, log_Q_m: 78.687, ratio_empirical: 0.0021, ratio_GRHmodel: 1.0524, ratio_uncondModel: 4.8005 }),
      Object.freeze({ m: 24, sym: 48, log_c_m: 0.0926, log_Q_m: 98.076, ratio_empirical: 0.0009, ratio_GRHmodel: 1.0621, ratio_uncondModel: 5.4448 }),
    ]),
    ratioDrift: Object.freeze({ empirical: 0.000461, GRHmodel: 0.003628, uncondModel: 0.166448 }),
    finalRatios: Object.freeze({ empirical: 0.000944, GRHmodel: 1.062113, uncondModel: 5.444751 }),
    readings: Object.freeze({
      empirical: "per-factor log L(1,sym^{2j} Delta) oscillate in sign (all in [-1.28,+1.05] up to sym^48) and nearly cancel; log c_m bounded, ratio ~ 0 -- Delta sits inside the GRH regime, residue dominated by conductor budget.",
      grhModel: "ratio flattens to ~1.06 (drift 0.0036/step, decelerating) -- BOUNDED: GRH per-factor bound is strong enough.",
      uncondModel: "ratio grows 0.83 -> 5.44 (drift 0.166/step) -- UNBOUNDED: unconditional per-factor bound is NOT strong enough.",
    }),
  }),
  namedResidualGap: Object.freeze({
    "imp-2437-uniform-sympow-edge-bound": "an UNCONDITIONAL uniform-in-m bound log L(1, sym^{2j} f) = o(j) (ideally O(log j)); the current best is the zero-free-region O(j), a factor ~ m/log m too weak. This is the single analytic input that would make the imp-2436 preservation route unconditional.",
  }),
  verdict: "sympow-RS-residue-reduces-to-GRH-order-per-factor-bound",
  headline: "c_m = Res_{s=1} L(s, sym^m f x sym^m f) = prod_{j=1}^m L(1, sym^{2j} f) (exact); the imp-2436 conductor-normalised route needs log c_m = O(log Q_m) ~ O(m log m), which the GRH per-factor bound O(log j) delivers (Delta numerics confirm) but the unconditional bound O(j) misses by ~ m/log m. Reduction-to-GRH plus a named unconditional residual gap.",
  proofClaim: false,
});

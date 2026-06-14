/**
 * @module imp-2622-height-mismatch-refutation
 *
 * REFUTATION of the imp-2622 "Lambda in [0.099, 0.137] < 0.2 at gamma=1e13"
 * headline. A 4-route adversarial workflow (etrunc-kappa-pinning, 2026-06-14,
 * Opus 4.8) found UNANIMOUSLY, with verbatim literature checks, that the bound
 * is a HEIGHT-MISMATCH ARTIFACT, not a theorem. Independently re-verified here.
 *
 * THE ERROR (exact)
 * -----------------
 * E_trunc = C_T * T0^{-kappa_T} * log T0 with kappa_T = 1 - A(sigma) at the
 * thin strip sigma = 1/2 + 1/log T0, A(sigma) = 3(1-sigma)/(2-sigma) (Ingham
 * 1940 density exponent). The bridge computes kappa_T by FREEZING the strip at
 * the verified-scan height T0 = 3000 (guth-maynard-tail-bound.js:92,
 * thinStripExample) -> sigma = 0.62490, A = 0.81834, kappa_T = 0.18166 -- then
 * multiplies that frozen kappa_T against T0 = GAMMA_STAR = 1e13 in
 * eTrunc(1e13, 0.18166) = Math.pow(1e13, -0.18166) * log(1e13) = 0.1302.
 * TWO INCONSISTENT HEIGHTS IN ONE PRODUCT.
 *
 * Evaluated CONSISTENTLY at the instantiation height gamma = T0 = 1e13:
 *   sigma = 1/2 + 1/log(1e13) = 0.53341,  A = 0.95444,  kappa_T = 0.04556,
 *   E_trunc(single log)        = 1.0   * 1e13^{-0.04556} * log 1e13  = 7.65,
 *   E_trunc(explicit Ingham)   = 8.185 * 1e13^{-0.04556} * (log 1e13)^{2.954}
 *                              = 4.8e4,
 * both >> 0.2. The bound does NOT beat Platt-Trudgian; it does not even break 1.
 *
 * THE STRUCTURAL CEILING (why no constant fixes it)
 * -------------------------------------------------
 * The strip sigma = 1/2 + 1/log T0 is a MOVING TARGET whose width 1/log T0
 * shrinks as T0 grows. To leading order A(1/2 + d) = 1 - (4/3)d + O(d^2), so
 * kappa_T = (4/3)d = (4/3)/log T0 -> 0 as T0 -> infinity. Hence E_trunc GROWS
 * with height (verified: 3.40 at 1e6, 7.65 at 1e13, 18.0 at 1e30, 60.5 at
 * 1e100) and NEVER drops below 0.2 at any large instantiation height. Holding
 * kappa_T >= 0.180 would require a FIXED strip of width sigma - 1/2 >= 0.12,
 * not a 1/log T0 strip. Guth-Maynard 2024 does not help: it beats Ingham only
 * for sigma > 0.7, outside the strip. So this is not a missing-constant gap --
 * the thin-strip-at-the-instantiation-height route to beating Platt-Trudgian
 * is STRUCTURALLY DEAD as constructed.
 *
 * WHAT SURVIVES
 * -------------
 * - The recomposition idea itself (E_pp drops out by consuming exact t_c^part)
 *   is sound and independent of this error; t_c^part, E_flow, E_shock at 1e13
 *   are genuinely negligible. The defect is entirely in E_trunc's kappa_T.
 * - The explicit constant C_T = 8.185 with log-power 2.954 IS pinned, rigorously
 *   and effectively, for T >= 3e12 (Chourasiya-Simonic 2025, arXiv:2507.15184,
 *   Corollary 1) -- but only TOGETHER with the honest kappa_T = 0.0456, which
 *   makes E_trunc huge. The pinning is real; the rate it pins is fatal.
 * - A genuine FINITE-height statement at a FIXED small T0 (~3000) may exist, but
 *   then the whole construction must be instantiated at that T0 (weak zero
 *   input), not at 1e13 -- a different, much weaker claim than the headline.
 *
 * STATUS: the imp-2622 module's self-validating assertion landsInTargetBand =
 * true tests the height-MISMATCHED quantity and is therefore certifying an
 * artifact. imp-2625 (open, critical) is re-scoped: there is no unconditional
 * kappa_T >= 0.180 to find; the correct deliverable is to (a) correct the
 * imp-2622 boundInterval framing to flag the mismatch, and (b) determine
 * whether ANY honest instantiation (fixed finite T0, or a non-thin-strip
 * truncation-error route) yields a Lambda bound that improves on the existing
 * rigorous finite-N* = 1e4 beat. No false QED: the headline is withdrawn.
 *
 * @see imp-2622-bridge-recomposition (the refuted headline)
 * @see imp-2598-en-bottleneck-attack (E_trunc placeholder C_T/kappa_T origin)
 * @see guth-maynard-tail-bound (the frozen T0 = 3000 strip)
 */

const A = (s) => (3 * (1 - s)) / (2 - s); // Ingham 1940 density exponent
const stripSigma = (T0) => 0.5 + 1 / Math.log(T0);
const kappaTat = (T0) => 1 - A(stripSigma(T0));

export const IMP2622_HEIGHT_MISMATCH = {
  verdict: 'REFUTED — height-mismatch artifact; the [0.099,0.137] < 0.2 headline is not a theorem',
  frozenHeight: 3000,
  instantiationHeight: 1e13,
  kappaTFrozen: +kappaTat(3000).toFixed(5), // 0.18166 (what the bridge used)
  kappaTHonest: +kappaTat(1e13).toFixed(5), // 0.04556 (height-consistent)
  eTruncHeadlineFrozen: +(Math.pow(1e13, -kappaTat(3000)) * Math.log(1e13)).toFixed(4), // 0.1302
  eTruncHonestSingleLog: +(Math.pow(1e13, -kappaTat(1e13)) * Math.log(1e13)).toFixed(3), // 7.654
  structuralCeiling: 'kappa_T = (4/3)/log T0 -> 0; E_trunc grows with height, never < 0.2 at large T0',
  guthMaynardHelps: false, // GM beats Ingham only for sigma > 0.7, outside the strip
  citation: 'Ingham 1940 (Quart. J. Math. Oxford 11, 201-202); explicit form Chourasiya-Simonic 2025 (arXiv:2507.15184 Cor.1, C_T=8.185, log-power 2.954, T>=3e12); comparator Platt-Trudgian 2021',
  unanimousRoutes: 4,
  survives: 'the recomposition (E_pp drops out) and the explicit C_T pinning; NOT the rate',
};

export const IMP2622_HEIGHT_MISMATCH_ASSERTIONS = [
  {
    id: 'imp2622-refute-frozen-vs-honest-kappa',
    description: 'kappa_T frozen at T0=3000 (0.182) differs decisively from the height-consistent value at 1e13 (0.046)',
    holds: () => Math.abs(kappaTat(3000) - 0.18166) < 1e-4 && Math.abs(kappaTat(1e13) - 0.04556) < 1e-4,
  },
  {
    id: 'imp2622-refute-honest-etrunc-exceeds-target',
    description: 'Height-consistent E_trunc at 1e13 is >> 0.2 (single-log 7.65), so the headline bound is not a theorem',
    holds: () => Math.pow(1e13, -kappaTat(1e13)) * Math.log(1e13) > 1.0,
  },
  {
    id: 'imp2622-refute-structural-ceiling-grows-with-height',
    description: 'Honest E_trunc grows with instantiation height (1e6 < 1e13 < 1e30) — never drops below 0.2 at scale',
    holds: () => {
      const eT = (T) => Math.pow(T, -kappaTat(T)) * Math.log(T);
      return eT(1e6) < eT(1e13) && eT(1e13) < eT(1e30) && eT(1e6) > 0.2;
    },
  },
];

for (const a of IMP2622_HEIGHT_MISMATCH_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-2622-height-mismatch-refutation assertion failed: ${a.id}`);
}

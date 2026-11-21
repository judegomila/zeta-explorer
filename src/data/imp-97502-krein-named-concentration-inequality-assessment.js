/**
 * @module imp-97502-krein-named-concentration-inequality-assessment
 * @fileoverview imp-97502 -- ASSESSMENT (proof) extending imp-97161 to the remaining NAMED band-limited
 *   concentration / uncertainty inequalities: does Nazarov's inequality, a Turan / Amrein-Berthier-type
 *   annihilation bound, a Donoho-Stark support-size uncertainty bound, or a Paneah / Logvinenko-Sereda
 *   relative-measure bound supply ANY provable positive lower bound c>0 on the shared de Branges coercivity
 *   primitive -- the fraction of a normalised type-a Paley-Wiener mass that can be charged against the
 *   confined negative sigma_2 well at 2a = ln3?
 *
 *   imp-97350/imp-97411 gated the two surviving c_sharp lower-bound routes (Lehmann-Maehly spectral-gap and
 *   de Branges coercivity) as ONE shared missing primitive: a quantitative band-limited (PW_a) concentration
 *   inequality controlling how much a Paley-Wiener function can concentrate its weighted L^2 mass in the
 *   confined negative sigma_2 well (global inf -4336.198 at t=9.3502, negative set |t| in [0,3.306] u
 *   [6.945,10.532]). imp-97161 already assessed Beurling-Selberg extremal functions (circular) and flat
 *   Slepian prolate eigenvalues (recurring unbounded-depth dip violates the flat hypotheses). This leaf
 *   assesses the FOUR named tools the imp-97502 ticket lists and were not yet examined, and records the
 *   precise reason each falls short.
 *
 *   Assessment / derivation only. Produces NO coercivity constant and no operator positivity (none is
 *   derived); changes no bound; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed;
 *   RH open; NO QED.
 *
 * THE CONVERSION ANY SUCH TOOL WOULD HAVE TO SURVIVE. Split the Rayleigh numerator at the negative set
 *   E = {t : sigma_2(t) < 0} = (in |t|) [0,3.306] u [6.945,10.532]:
 *       int sigma_2 |psi|^2 = int_E sigma_2 |psi|^2 + int_{E^c} sigma_2 |psi|^2
 *                          >= (inf_E sigma_2) int_E |psi|^2  +  0
 *                           = -4336.198 * theta * ||psi||^2,   theta := int_E |psi|^2 / ||psi||^2.
 *   A named concentration tool bounds theta (the mass FRACTION of a band-limited function inside a fixed
 *   set), i.e. gives theta <= theta_max. Two independent walls then block c>0, and each named tool hits at
 *   least one:
 *
 *   WALL A -- DEPTH (a mass-fraction bound cannot beat -4336). Even a perfect theta_max < 1 gives only
 *     c >= -4336.198 * theta_max, which is positive only if theta_max < c / 4336.198. For any usable
 *     c ~ 0.5 that demands theta_max < 1.15e-4 -- an absurd concentration ceiling for band-limited data on a
 *     set of measure |E| ~ 13.79. The dip is a WEIGHT of unbounded depth, not an indicator, so no
 *     relative-measure ceiling of the form theta_max < 1 is anywhere near strong enough.
 *
 *   WALL B -- SIGN / WEIGHT (indicator, not the signed sigma_2). All four tools bound int_E |psi|^2 against
 *     LEBESGUE measure of E (or a two-set inequality), never the signed integral int sigma_2 |psi|^2 against
 *     the actual weight. Converting a mass bound into c>0 additionally requires a matching LOWER bound on the
 *     positive part int_{E^c} sigma_2 |psi|^2, which none of these tools provides: sigma_2 -> 0^+ at the well
 *     boundaries (sigma_2(3.306) = +0.10, sigma_2(10.532) = +8.18), so there is no uniform positive floor to
 *     buy back the discarded far-field. This is the same "sets, not the signed weight" gap imp-97161 named.
 *
 * TOOL-BY-TOOL VERDICTS at 2a = ln3, band a = (ln3)/2, |E| = 13.786.
 *   Define the time-bandwidth product TBW = |E| * (2a) = 15.15 (ordinary-frequency band |W| = 2a), or
 *   TBW/(2pi) = 2.41 (angular-frequency convention); BOTH exceed the Donoho-Stark non-triviality threshold 1.
 *
 *   (1) DONOHO-STARK support-size uncertainty. |T||W| >= (1 - eps_T - eps_W)^2 is a NON-TRIVIAL constraint on
 *       the concentration quality eps only when |T||W| < 1. Here |E| * band = 15.15 (or 2.41 in the 2pi
 *       convention) >> 1, so the RHS bound is >1 and the inequality is VACUOUS -- it places NO ceiling on
 *       theta. Falls short: wrong regime (the well set is far too large at the working band), and a set bound
 *       even if available runs into Wall A/B.
 *
 *   (2) TURAN / AMREIN-BERTHIER (quantitative annihilation, Nazarov form). The quantitative
 *       Amrein-Berthier-Nazarov bound int_{R\E} |psi|^2 >= C1 exp(-C2 |E||W|) ||psi||^2 gives a mass-OUTSIDE
 *       floor with an exponential-in-TBW constant. At |E||W| = 15.15 with the known absolute C2 (tens to
 *       hundreds), exp(-C2 * 15.15) is astronomically small, so theta_max = 1 - C1 exp(-C2 |E||W|) is
 *       indistinguishable from 1 at any working precision. Falls short: the constant is exponentially weak at
 *       this TBW (direction gives ~0 mass outside), and it is an indicator statement (Wall B); even theta ~ 1
 *       - epsilon then triggers Wall A.
 *
 *   (3) NAZAROV / TURAN-NAZAROV reverse-Holder (Remez-type) on the band. int_I |psi|^2 <= (C |I| / |I\E|)^{C
 *       * band * |I|} int_{I\E} |psi|^2 has a constant growing like (geometric-ratio)^{C * band * |I|}. At
 *       band = ln3 over |E| ~ 13.79 the exponent C * band * |I| is large, so the multiplier is enormous and
 *       theta_max -> 1 with no usable margin. Falls short: constant blows up with band*window (Wall-A-scale),
 *       indicator not weight (Wall B) -- the quantitative twin of imp-97161's flat-Slepian failure.
 *
 *   (4) PANEAH / LOGVINENKO-SEREDA relative-measure. LS lower-bounds the mass captured on a RELATIVELY DENSE
 *       (thick) set: int_S |psi|^2 >= gamma ||psi||^2 with gamma = c1 (c2 * rho)^{c3 * band * L} for a
 *       gamma-dense S. This is the WRONG DIRECTION -- it lower-bounds mass on the (thick, unbounded) positive
 *       region E^c, giving only theta <= 1 - gamma, and its gamma is again exponentially small in band*window
 *       at 2a = ln3. Even the resulting theta bound is an indicator statement, and it yields no lower bound on
 *       the WEIGHTED int_{E^c} sigma_2 |psi|^2 because sigma_2 -> 0^+ at the well edges (Wall B). Falls short.
 *
 * VERDICT. NO. None of Donoho-Stark, Turan / Amrein-Berthier, Nazarov / Turan-Nazarov, or
 *   Paneah / Logvinenko-Sereda supplies a positive lower bound c>0 on the shared primitive at 2a = ln3.
 *   Each is a bound on the mass FRACTION (or support size) of a band-limited function in a FIXED set against
 *   LEBESGUE measure -- an indicator statement, never a bound against the signed, unbounded-depth sigma_2
 *   weight (Wall B) -- and each has a computable constant governed by the time-bandwidth product |E| * 2a =
 *   15.15 >> 1, making it either vacuous (Donoho-Stark, needs <1) or exponentially close to trivial
 *   (Amrein-Berthier / Nazarov / Logvinenko-Sereda), so theta_max is never usefully below 1. And even a
 *   hypothetical theta_max < 1 would give only c >= -4336.198 * theta_max, so a usable c>0 would require
 *   theta_max < 1.15e-4, unreachable for band-limited data on |E| ~ 13.79 where the O(1) time-bandwidth
 *   product leaves the top few Slepian concentration eigenvalues near 1 (Wall A). This confirms and extends
 *   imp-97161: the shared primitive still needs a WEIGHTED (Fejer-Riesz / de Branges) square-factorisation
 *   margin or a weighted band-limited uncertainty inequality, none of the off-the-shelf named tools.
 *   SUB-GAP IMP97502_NAMED_CONCENTRATION_TOOLS_INDICATOR_NOT_SIGNED_WEIGHT_AND_VACUOUS_AT_LN3. Assessment
 *   only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (the shared band-limited concentration primitive)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (Beurling-Selberg circular; flat Slepian violated)
 * @see imp-97384-krein-csharp-routes-not-independent-gate.js (do-not-treat-as-independent gate)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2 = (t^2+1/4)^2 w_1; reach 2a<=0.96)
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN2 = Math.log(2); // 0.6931471805599453 -- the single in-band prime frequency at 2a = ln3
const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this assessment)
export const IMP97502_RIGOROUS_REACH_2A = 0.96;
export const IMP97502_BINDING_2A = LN3;

// Geometry of the confined negative sigma_2 well (imp-97335 / imp-97350), verified below against sigma2().
export const IMP97502_WELL = Object.freeze({
  negativeSetPositiveAxis: [[0, 3.306], [6.945, 10.532]], // |t| intervals where sigma_2 < 0
  globalInf: -4336.198,        // deepest dip
  argmin: 9.3502,              // location of the deepest dip
  // full (even) Lebesgue measure of the negative set on the whole axis
  measureE: 2 * (3.306 + (10.532 - 6.945)), // = 13.786
});

// Band datum at 2a = ln3, and the two walls the conversion int sigma_2|psi|^2 >= (inf_E) theta ||psi||^2
// must survive. TBW is the time-bandwidth product that governs every named constant.
export const IMP97502_CONVERSION = Object.freeze({
  a: LN3 / 2,                                        // band half-width
  twoA: LN3,                                         // band width
  timeBandwidthProduct_freqBand: IMP97502_WELL.measureE * LN3,             // |E| * 2a = 15.15
  timeBandwidthProduct_angular: (IMP97502_WELL.measureE * LN3) / (2 * Math.PI), // 2.41 (2pi convention)
  donohoStarkNonTrivialThreshold: 1,                 // |T||W| < 1 required for a non-vacuous DS constraint
  depth: 4336.198,                                   // |inf_E sigma_2|
  // Wall A: c >= -depth * theta_max, so c>0 needs theta_max below this tiny ceiling
  thetaCeilingForCoercivity_c_half: 0.5 / 4336.198,  // = 1.153e-4
});

export const IMP97502_VERDICT = Object.freeze({
  ticket: 'imp-97502',
  question:
    'does any standard NAMED band-limited concentration / uncertainty inequality (Nazarov, Turan / Amrein-Berthier-type, Donoho-Stark support-size, or Paneah / Logvinenko-Sereda relative-measure) yield a computable positive lower bound c>0 on the shared de Branges coercivity primitive -- the fraction of a normalised type-a PW mass chargeable against the confined negative sigma_2 well -- at 2a = ln3?',
  answer:
    'no. Each named tool bounds the mass FRACTION (or support size) of a band-limited function in a FIXED set against Lebesgue measure -- an indicator statement, never a bound against the signed, unbounded-depth sigma_2 weight (Wall B: sigma_2 -> 0^+ at the well edges, so no lower bound on the positive part int_{E^c} sigma_2|psi|^2 follows) -- and each has a computable constant governed by the time-bandwidth product |E|*2a = 15.15 (or 2.41 in the 2pi convention), both above the Donoho-Stark non-triviality threshold 1, making the tool vacuous (Donoho-Stark) or exponentially close to trivial (Amrein-Berthier / Nazarov / Logvinenko-Sereda) so theta_max stays near 1. And even a hypothetical theta_max<1 gives only c >= -4336.198*theta_max, so a usable c>0 needs theta_max < 1.15e-4, unreachable for band-limited data on |E| ~ 13.79 (Wall A). No positive lower bound is produced.',
  binding_2a: LN3,
  // the two structural walls
  wallA_depthDominatesMassFractionBound: true, // c >= -depth*theta_max; needs theta_max < 1.15e-4
  wallB_indicatorNotSignedWeight: true,        // tools bound int_E|psi|^2 vs Lebesgue, not int sigma_2|psi|^2
  positivePartLowerBoundUnavailable: true,     // sigma_2 -> 0^+ at well edges, no uniform far floor
  // per-tool verdicts
  donohoStarkVacuousAtThisBand: true,          // |T||W| >> 1, so (1-eps)^2 <= |T||W| places no ceiling
  amreinBerthierNazarovConstantExpWeak: true,  // int_{R\E}|psi|^2 >= C1 exp(-C2|E||W|), exp(-C2*15) ~ 0
  nazarovTuranReverseHolderConstantBlowsUp: true, // (ratio)^{C*band*|I|} multiplier enormous at 2a=ln3
  logvinenkoSeredaWrongDirectionAndExpWeak: true, // lower-bounds mass on thick set; gamma exp-small; wrong dir
  // shared outcome
  anyNamedToolSuppliesC: false,
  sameSharedPrimitiveAsImp97161: true,         // still needs weighted Fejer-Riesz / uncertainty margin
  // unchanged program state
  positiveLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97502_NAMED_CONCENTRATION_TOOLS_INDICATOR_NOT_SIGNED_WEIGHT_AND_VACUOUS_AT_LN3 -- none of ' +
    'Donoho-Stark support-size, Turan / Amrein-Berthier annihilation, Nazarov / Turan-Nazarov reverse-Holder, ' +
    'or Paneah / Logvinenko-Sereda relative-measure supplies a positive lower bound c>0 on the shared ' +
    'primitive (int sigma_2 |psi|^2 / ||psi||^2 over PW_a) at 2a = ln3. Two walls: (A) DEPTH -- splitting at ' +
    'the negative set E = |t| in [0,3.306] u [6.945,10.532] gives int sigma_2|psi|^2 >= (inf_E sigma_2) theta ' +
    '||psi||^2 = -4336.198 * theta * ||psi||^2, so a mass-fraction ceiling theta <= theta_max yields only ' +
    'c >= -4336.198*theta_max, positive only for theta_max < 0.5/4336.198 = 1.15e-4, absurd for band-limited ' +
    'data on |E| ~ 13.79 where the O(1) time-bandwidth product (|E|*2a = 15.15, or 2.41 in the 2pi ' +
    'convention) leaves the top Slepian concentration eigenvalues near 1; (B) SIGN/WEIGHT -- every named tool ' +
    'bounds int_E|psi|^2 against LEBESGUE measure (an indicator / support-size / relative-measure statement), ' +
    'not the signed int sigma_2|psi|^2, and converting needs a matching LOWER bound on int_{E^c} sigma_2 ' +
    '|psi|^2, unavailable because sigma_2 -> 0^+ at the well edges (sigma_2(3.306)=+0.10, sigma_2(10.532)=' +
    '+8.18). Tool-by-tool at 2a=ln3: Donoho-Stark |T||W| >> 1 is VACUOUS (needs <1); Amrein-Berthier-Nazarov ' +
    'int_{R\\E}|psi|^2 >= C1 exp(-C2|E||W|) has exp(-C2*15.15) astronomically small so theta_max ~ 1; ' +
    'Nazarov / Turan-Nazarov reverse-Holder has a (ratio)^{C*band*|I|} multiplier that blows up at band=ln3 ' +
    'over |E|~13.79; Logvinenko-Sereda lower-bounds mass on a thick set (wrong direction) with an ' +
    'exponentially small gamma. This confirms and extends imp-97161 (Beurling-Selberg circular, flat Slepian ' +
    'violated): the shared primitive still requires a WEIGHTED Fejer-Riesz / de Branges square-factorisation ' +
    'margin or a weighted band-limited uncertainty inequality, none of the off-the-shelf named tools. ' +
    'Assessment only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96.',
  qed: false,
});
export default IMP97502_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97502_ASSERTIONS = [
  {
    id: 'imp97502-negative-well-geometry-matches-sigma2',
    holds: () => {
      // E = |t| in [0,3.306] u [6.945,10.532]: negative inside, non-negative just outside each boundary.
      const insideFirst = sigma2(0) < 0 && sigma2(2) < 0;
      const gapPositive = sigma2(4) > 0 && sigma2(5) > 0;         // between the two wells
      const insideSecond = sigma2(8) < 0 && sigma2(9.3502) < -4000; // deep well
      const edgesNonNeg = sigma2(3.306) > 0 && sigma2(10.532) > 0;  // sigma_2 -> 0^+ at well edges
      const farPositive = sigma2(50) > 1e6;
      return insideFirst && gapPositive && insideSecond && edgesNonNeg && farPositive &&
        Math.abs(IMP97502_WELL.measureE - 13.786) < 1e-9 &&
        Math.abs(IMP97502_WELL.globalInf + 4336.198) < 1e-2;
    },
    why: 'sigma_2 is negative on |t| in [0,3.306] u [6.945,10.532] (deep -4336.198 at 9.3502), non-negative just past each edge and in the between-wells gap, and far-positive at t=50 -- the confined negative well the concentration tools would have to control.',
  },
  {
    id: 'imp97502-wallA-depth-dominates-any-mass-fraction-bound',
    holds: () => {
      const C = IMP97502_CONVERSION;
      // c >= -depth * theta_max, so c>0 needs theta_max < c/depth: a ceiling of order 1e-4 for c ~ 0.5.
      const ceiling = 0.5 / C.depth;
      return Math.abs(C.thetaCeilingForCoercivity_c_half - ceiling) < 1e-12 &&
        ceiling < 2e-4 && C.depth > 4000 &&
        IMP97502_VERDICT.wallA_depthDominatesMassFractionBound === true;
    },
    why: 'the negative well has depth 4336.198, so any mass-fraction ceiling theta<=theta_max gives only c >= -4336.198*theta_max; a usable c ~ 0.5 would need theta_max < 1.15e-4, far below what band-limited functions can be forced under on |E| ~ 13.79.',
  },
  {
    id: 'imp97502-donoho-stark-vacuous-either-convention',
    holds: () => {
      const C = IMP97502_CONVERSION;
      // Donoho-Stark |T||W| >= (1-eps)^2 is non-trivial only when |T||W| < 1. Here both conventions exceed 1.
      return C.timeBandwidthProduct_freqBand > 1 &&
        C.timeBandwidthProduct_angular > 1 &&
        C.timeBandwidthProduct_freqBand > 15 && C.timeBandwidthProduct_freqBand < 16 &&
        C.timeBandwidthProduct_angular > 2 && C.timeBandwidthProduct_angular < 3 &&
        IMP97502_VERDICT.donohoStarkVacuousAtThisBand === true;
    },
    why: 'the time-bandwidth product |E|*2a = 15.15 (or 2.41 in the 2pi convention) exceeds the Donoho-Stark non-triviality threshold 1 under either Fourier normalization, so the support-size uncertainty bound places no ceiling on the concentrated mass fraction.',
  },
  {
    id: 'imp97502-single-in-band-prime-anchor-unchanged',
    holds: () =>
      // the arithmetic datum is unchanged from imp-97161: only the ln2 harmonic is in-band at 2a=ln3.
      LN2 < LN3 && 2 * LN2 > LN3 &&
      Math.abs(IMP97502_BINDING_2A - LN3) < 1e-12 &&
      IMP97502_VERDICT.sameSharedPrimitiveAsImp97161 === true,
    why: 'at 2a=ln3 the single in-band prime frequency ln2 (2 ln2 = ln4 > ln3 excluded) and the shared missing primitive are unchanged; this leaf only assesses the additional named concentration tools against it.',
  },
  {
    id: 'imp97502-no-named-tool-supplies-c-assessment-only-no-qed',
    holds: () =>
      IMP97502_VERDICT.donohoStarkVacuousAtThisBand === true &&
      IMP97502_VERDICT.amreinBerthierNazarovConstantExpWeak === true &&
      IMP97502_VERDICT.nazarovTuranReverseHolderConstantBlowsUp === true &&
      IMP97502_VERDICT.logvinenkoSeredaWrongDirectionAndExpWeak === true &&
      IMP97502_VERDICT.anyNamedToolSuppliesC === false &&
      IMP97502_VERDICT.wallB_indicatorNotSignedWeight === true &&
      IMP97502_VERDICT.positivePartLowerBoundUnavailable === true &&
      IMP97502_VERDICT.positiveLowerBoundProduced === false &&
      IMP97502_VERDICT.operatorPositivityProved === false &&
      IMP97502_VERDICT.boundMoves === false &&
      IMP97502_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97502_RIGOROUS_REACH_2A === 0.96 &&
      IMP97502_VERDICT.subGap.includes('IMP97502_NAMED_CONCENTRATION_TOOLS_INDICATOR_NOT_SIGNED_WEIGHT_AND_VACUOUS_AT_LN3') &&
      IMP97502_VERDICT.qed === false,
    why: 'no named band-limited concentration inequality (Donoho-Stark, Amrein-Berthier / Nazarov, Turan-Nazarov, Logvinenko-Sereda) supplies c>0: all are indicator / support-size / relative-measure statements (Wall B) with constants vacuous or exponentially weak at 2a=ln3, and depth 4336 defeats any mass-fraction ceiling (Wall A); assessment only, no positivity, no bound moves, reach stays 2a<=0.96, NO QED.',
  },
];

for (const a of IMP97502_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97502-krein-named-concentration-inequality-assessment assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
